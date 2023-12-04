[TOC]

# Android MVVM+Coroutine+retrofit+flow

## 添加依赖库

```
implementation "androidx.activity:activity-ktx:1.3.1"
implementation "androidx.fragment:fragment-ktx:1.3.6"

implementation "com.squareup.retrofit2:retrofit:2.9.0"
implementation "com.squareup.retrofit2:converter-gson:2.9.0"

implementation "com.squareup.okhttp3:okhttp:4.9.3"
implementation 'com.squareup.okhttp3:logging-interceptor:4.9.3'

implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.5.0"
implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.0"
implementation "androidx.lifecycle:lifecycle-livedata-ktx:2.5.0"
```



## 代码实现

**代码结构：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/2b5b5ac487334c6885546ceeabf70f38.png)



### 定义Bean类

```kotlin
data class BaseResponse<T>(
    val errorCode: Int = 0,
    var errorMsg: String = "",
    val data: T? = null
) {
    fun isSuccessful() = errorCode == 0
}
```

```kotlin
data class User(
    var admin: Boolean = false,
    val id: Int = 0,
    val nickname: String? = null,
    val publicName: String? = null,
    val username: String? = null
)
```

### 定义状态类

```kotlin
/**
 * 状态类
 */
sealed class ResultState<out R> {
    // 成功状态
    data class Success<out T>(val data: T) : ResultState<T>()

    // 失败状态
    data class Error(val exception: ApiException, val message: String) : ResultState<Nothing>()

    // 加载状态
    object Loading : ResultState<Nothing>()

    // 完成状态
    object Complete : ResultState<Nothing>()

    // 无状态
    object None : ResultState<Nothing>()
}
```

### 定义网络层

```kotlin
/**
 * 服务端返回错误码
 */
class ServerException(val code: Int, val msg: String) : RuntimeException()
```

```kotlin
/**
 * 统一管理异常类
 */
class ApiException(throwable: Throwable, val code: Int, val displayMessage: String) :
    Exception(throwable) {

    /**
     * Http状态码
     */
    object Http {
        const val UNAUTHORIZED = 401
        const val FORBIDDEN = 403
        const val NOT_FOUND = 404
        const val REQUEST_TIMEOUT = 408
        const val INTERNAL_SERVER_ERROR = 500
        const val BAD_GATEWAY = 502
        const val SERVICE_UNAVAILABLE = 503
        const val GATEWAY_TIMEOUT = 504
    }

    /**
     * 异常状态码
     */
    object Error {
        /**
         * 未知错误
         */
        const val UNKNOWN = 1000

        /**
         * 解析错误
         */
        const val PARSE_ERROR = 1001

        /**
         * 网络错误
         */
        const val NETWORD_ERROR = 1002

        /**
         * 协议出错
         */
        const val HTTP_ERROR = 1003

        /**
         * 证书出错
         */
        const val SSL_ERROR = 1005
    }
}
```

```kotlin
/**
 * 异常处理类
 */
object ExceptionHandler {
    fun handleException(e: Throwable): ApiException {
        if (e is ServerException) {
            return ApiException(e, e.code, e.msg)
        } else if (e is HttpException) {
            return ApiException(e, ApiException.Error.HTTP_ERROR, "服务器连接失败")
        } else if (e is JsonParseException || e is JSONException || e is ParseException) {
            return ApiException(e, ApiException.Error.PARSE_ERROR, "解析错误")
        } else if (e is ConnectException || e is ConnectTimeoutException || e is SocketTimeoutException) {
            return ApiException(e, ApiException.Error.NETWORD_ERROR, "网络连接失败,请稍后重试")
        } else if (e is SSLHandshakeException) {
            return ApiException(e, ApiException.Error.SSL_ERROR, "证书验证失败")
        } else {
            return ApiException(e, ApiException.Error.UNKNOWN, "网络连接异常,请稍后重试")
        }
    }
}
```

```kotlin
object HttpManager {
    private const val BASE_URL = "https://wanandroid.com/"

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttpClient)
            .build()
    }

    fun <T> create(serviceClass: Class<T>): T = retrofit.create(serviceClass)
}
```

```kotlin
interface LoginApi {
    @POST("user/login")
    @FormUrlEncoded
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): BaseResponse<User>
}
```

### 定义Model层

```kotlin
/**
 * 封装Model
 */
open class BaseModel {

    fun <T> requestForResult(block: suspend () -> BaseResponse<T>): Flow<ResultState<T>> {
        return flow<ResultState<T>> {
            val userResponse = block()
            if (userResponse.isSuccessful()) {
                emit(ResultState.Success(userResponse.data!!))
            } else {
                val serverException = ServerException(userResponse.errorCode, userResponse.errorMsg)
                val e = ExceptionHandler.handleException(serverException)
                emit(ResultState.Error(e, e.displayMessage))
            }
        }.flowOn(Dispatchers.IO)
            .onStart {
                emit(ResultState.Loading)
            }
            .catch {
                val e = ExceptionHandler.handleException(it)
                emit(ResultState.Error(e, e.displayMessage))
            }
    }
}
```

```kotlin
/**
 * Model层
 */
class LoginModel : BaseModel() {

    private val loginApi: LoginApi by lazy {
        HttpManager.create(LoginApi::class.java)
    }

    suspend fun login(username: String, password: String): Flow<ResultState<User>> {
        return requestForResult {
            loginApi.login(username, password)
        }
    }
}
```

### 定义View层

```kotlin
/**
 * 封装Activity
 */
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
/**
 * View层
 */
class LoginActivity : BaseActivity<ActivityLoginBinding>() {
    private val viewModel: LoginViewModel by viewModels()

    private val progressDialog: ProgressDialog by lazy {
        ProgressDialog(this).apply {
            setMessage("加载中")
        }
    }

    override fun createViewBinding(): ActivityLoginBinding =
    ActivityLoginBinding.inflate(layoutInflater)

    override fun initViews() {
        mViewBinding.btnLogin.setOnClickListener {
            val username = mViewBinding.etUsername.text.toString()
            val password = mViewBinding.etPassword.text.toString()
            if (username.isNullOrEmpty()) {
                showToast("请输入用户名")
                return@setOnClickListener
            }
            if (password.isNullOrEmpty()) {
                showToast("请输入密码")
                return@setOnClickListener
            }

            viewModel.login(username, password)
        }
    }

    override fun initData(savedInstanceState: Bundle?) {
        observe()
    }

    private fun observe() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.RESUMED) {
                viewModel.userFlow.collect {
                    when (it) {
                        is ResultState.Loading -> showLoadingDialog()
                        is ResultState.Success<User> -> {
                            mViewBinding.tvDesc.text = it.toString()
                            hideLoadingDialog()
                        }
                        is ResultState.Error -> {
                            mViewBinding.tvDesc.text = it.message
                            hideLoadingDialog()
                        }
                    }

                }
            }
        }
    }

    private fun showLoadingDialog() {
        progressDialog.show()
    }

    private fun hideLoadingDialog() {
        progressDialog.hide()
    }

}
```

### 定义ViewModel层

```kotlin
/**
 * 封装ViewModel
 */
open class BaseViewModel : ViewModel() {

    fun launchWithMain(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Main) {
            block()
        }
    }

    fun launchWithIO(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            block()
        }
    }

    fun launchWithDefault(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Default) {
            block()
        }
    }
}
```

```kotlin
/**
 * ViewModel层
 */
class LoginViewModel : BaseViewModel() {
    private val loginModel: LoginModel by lazy {
        LoginModel()
    }

    private val _userFlow = MutableStateFlow<ResultState<User>>(ResultState.None)
    val userFlow: StateFlow<ResultState<User>> get() = _userFlow.asStateFlow()

    fun login(username: String, password: String) {
        launchWithIO {
            loginModel.login(username, password).collect {
                _userFlow.value = it
            }
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_ArchitectureDesign)