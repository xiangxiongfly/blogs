[TOC]

# Android MVVM+coroutine+retrofit+flow+hilt

## 概述

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0b0d303b9e7847c3a37a66987cbff8c7.png)

**代码结构：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d8d4daa69c2d4f29b91b7811b494a0ef.png)

## 依赖注入层

**数据库：**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
class DBModule {

    @Singleton
    @Provides
    fun provideDB(application: Application): AppDatabase {
        return AppDatabase.getDatabase(application)
    }

    @Singleton
    @Provides
    fun provideCacheDao(db: AppDatabase): CacheDao {
        return db.cacheDao()
    }
}
```

**网络请求：**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
class NetworkModule {

    @Singleton
    @Provides
    fun provideOkHttpClient(): OkHttpClient {
        return HttpManager.okHttpClient
    }

    @Singleton
    @Provides
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return HttpManager.retrofit
    }

    @Singleton
    @Provides
    fun provideLoginApi(retrofit: Retrofit): LoginApi {
        return retrofit.create(LoginApi::class.java)
    }

    @Singleton
    @Provides
    fun provideArticleApi(retrofit: Retrofit): ArticleApi {
        return retrofit.create(ArticleApi::class.java)
    }
}
```



## 数据层

```kotlin
open class BaseModel {

    @Inject
    lateinit var cacheHelper: CacheHelper

    fun <T> requestForResult(block: suspend () -> BaseResponse<T>): Flow<ResultState<T>> {
        return flow<ResultState<T>> {
            val response = block()
            if (response.isSuccessful()) {
                emit(ResultState.Success(response.data!!))
            } else {
                val serverException = ServerException(response.errorCode, response.errorMsg)
                val e = ExceptionHandler.handleException(serverException)
                emit(ResultState.Error(e, e.displayMessage))
            }
        }.flowOn(Dispatchers.IO)
            .catch {
                val e = ExceptionHandler.handleException(it)
                emit(ResultState.Error(e, e.displayMessage))
            }
    }

    suspend fun <T> requestForResult(
        cacheName: String,
        cacheBlock: () -> T?,
        block: suspend () -> BaseResponse<T>
    ): Flow<ResultState<T>> {
        return flow {
            val cacheData = cacheBlock()
            cacheData?.let {
                emit(ResultState.Success(cacheData, true))
            }

            val response = block()
            if (response.isSuccessful()) {
                cacheHelper.saveCache(cacheName, response.data!!)
                emit(ResultState.Success(response.data, false))
            } else {
                val serverException = ServerException(response.errorCode, response.errorMsg)
                val e = ExceptionHandler.handleException(serverException)
                emit(ResultState.Error(e, e.displayMessage))
            }
        }.flowOn(Dispatchers.IO)
            .catch {
                val e = ExceptionHandler.handleException(it)
                emit(ResultState.Error(e, e.displayMessage))
            }
    }
}
```

```kotlin
class ArticleModel @Inject constructor() : BaseModel() {

    @Inject
    lateinit var articleApi: ArticleApi

    suspend fun getArticleList(): Flow<ResultState<ArrayList<ArticleBean>>> {
        val cacheName = "article_list"
        return requestForResult(cacheName, {
            cacheHelper.getCache<ArrayList<ArticleBean>>(
                cacheName, object : TypeToken<ArrayList<ArticleBean>>() {}.type
            )
        }, {
            articleApi.getArticleList()
        })
    }
}
```



## 视图层

```kotlin
abstract class BaseActivity<VB : ViewBinding> : AppCompatActivity() {
    private lateinit var _mViewBinding: VB
    protected val mViewBinding get() = _mViewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _mViewBinding = createViewBinding()
        setContentView(_mViewBinding.root)
        initViews()
        initData(savedInstanceState)
    }

    abstract fun createViewBinding(): VB

    abstract fun initViews()

    abstract fun initData(savedInstanceState: Bundle?)
}
```

```kotlin

@AndroidEntryPoint
class ArticleListActivity : BaseActivity<ActivityArticleListBinding>() {
    private val mList = arrayListOf<ArticleBean>()
    private val articleListViewModel by viewModels<ArticleViewModel>()
    private val progressDialog: ProgressDialog by lazy {
        ProgressDialog(this).apply {
            setMessage("加载中")
        }
    }

    override fun createViewBinding(): ActivityArticleListBinding {
        return ActivityArticleListBinding.inflate(layoutInflater)
    }

    override fun initViews() {

    }

    override fun initData(savedInstanceState: Bundle?) {
        mViewBinding.rvArticleList.adapter = ArticleAdapter(this, mList)

        mViewBinding.btnGetArticleList.setOnClickListener {
            getArticleList()
        }
        observe()
    }

    private fun getArticleList() {
        articleListViewModel.getArticleList()
    }

    private fun observe() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.RESUMED) {
                articleListViewModel.articleFlow.collect {
                    when (it) {
                        is ResultState.Loading -> showLoading()
                        is ResultState.Error -> {
                            showToast(it.message)
                            hideLoading()
                        }
                        is ResultState.Success -> {
                            hideLoading()
                            updateUI(it.data)
                        }
                    }
                }
            }
        }
    }

    private fun updateUI(list: ArrayList<ArticleBean>?) {
        mList.clear()
        if (list != null) {
            mList.addAll(list)
        }
        mViewBinding.rvArticleList.adapter!!.notifyDataSetChanged()
    }

    private fun showLoading() {
        progressDialog.show()
    }

    private fun hideLoading() {
        progressDialog.hide()
    }
}

```



## 模型视图层

```kotlin
open class BaseViewModel : ViewModel() {

    fun launchMain(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Main) {
            block()
        }
    }

    fun launchIO(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            block()
        }
    }

    fun launchDefault(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Default) {
            block()
        }
    }
}
```

```kotlin
@HiltViewModel
class ArticleViewModel @Inject constructor(
    private val articleModel: ArticleModel
) : BaseViewModel() {
    private val _articleFlow =
        MutableStateFlow<ResultState<ArrayList<ArticleBean>>>(ResultState.None)
    val articleFlow get() = _articleFlow.asStateFlow()

    fun getArticleList() {
        launchIO {
            articleModel.getArticleList()
                .onStart {
                    _articleFlow.value = ResultState.Loading
                }
                .collect {
                    _articleFlow.value = it
                }
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_ArchitectureDesign)

