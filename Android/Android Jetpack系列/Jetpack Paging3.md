[TOC]

# Jetpack Paging3

## 概述

Paging 库可帮助您加载和显示来自本地存储或网络中更大的数据集中的数据页面。此方法可让您的应用更高效地利用网络带宽和系统资源。Paging 库的组件旨在契合推荐的 [Android 应用架构](https://developer.android.google.cn/jetpack/docs/guide?hl=zh-cn)，流畅集成其他 [Jetpack](https://developer.android.google.cn/jetpack?hl=zh-cn) 组件，并提供一流的 Kotlin 支持。 



## 添加依赖库

```
def paging_version = "3.1.1"
implementation "androidx.paging:paging-runtime:$paging_version"
```



## Paging3架构

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2440f31f820e4be98f685bc6616d7372.png)

**Repository层：**

代码库层中的主要 Paging 库组件是 [`PagingSource`](https://developer.android.google.cn/reference/kotlin/androidx/paging/PagingSource?hl=zh-cn)。每个 `PagingSource` 对象都定义了数据源，以及如何从该数据源检索数据。`PagingSource` 对象可以从任何单个数据源（包括网络来源和本地数据库）加载数据。

您可能使用的另一个 Paging 库组件是 [`RemoteMediator`](https://developer.android.google.cn/reference/kotlin/androidx/paging/RemoteMediator?hl=zh-cn)。`RemoteMediator` 对象会处理来自分层数据源（例如具有本地数据库缓存的网络数据源）的分页。

**ViewModel层：**

[`Pager`](https://developer.android.google.cn/reference/kotlin/androidx/paging/Pager?hl=zh-cn) 组件提供了一个公共 API，基于 `PagingSource` 对象和 [`PagingConfig`](https://developer.android.google.cn/reference/kotlin/androidx/paging/PagingConfig?hl=zh-cn) 配置对象来构造在响应式流中公开的 `PagingData` 实例。

将 `ViewModel` 层连接到界面的组件是 [`PagingData`](https://developer.android.google.cn/reference/kotlin/androidx/paging/PagingData?hl=zh-cn)。`PagingData` 对象是用于存放分页数据快照的容器。它会查询 [`PagingSource`](https://developer.android.google.cn/reference/kotlin/androidx/paging/PagingSource?hl=zh-cn) 对象并存储结果。

**UI层：**

界面层中的主要 Paging 库组件是 [`PagingDataAdapter`](https://developer.android.google.cn/reference/kotlin/androidx/paging/PagingDataAdapter?hl=zh-cn)，它是一种处理分页数据的 [`RecyclerView`](https://developer.android.google.cn/reference/kotlin/androidx/recyclerview/widget/RecyclerView?hl=zh-cn) 适配器。

此外，您也可以使用随附的 [`AsyncPagingDataDiffer`](https://developer.android.google.cn/reference/kotlin/androidx/paging/AsyncPagingDataDiffer?hl=zh-cn) 组件构建自己的自定义适配器。



## 使用

### 代码结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/74a94023e3984e68b3bd265fd730992b.png)

### 定义网络请求

```kotlin
object NetworkManager {
    private const val BASE_URL = "https://api.github.com/"

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor(object : HttpLoggingInterceptor.Logger {
                override fun log(message: String) {
                    logE(message)
                }
            }).setLevel(HttpLoggingInterceptor.Level.BASIC))
            .build()
    }

    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}
```

```kotlin
interface UserService {

    @GET("search/repositories?sort=stars&q=Android")
    suspend fun searchUser(@Query("page") page: Int, @Query("per_page") perPager: Int): BaseResponse

    companion object {
        fun create(): UserService {
            return NetworkManager.retrofit.create(UserService::class.java)
        }
    }
}
```

### 定义数据源

实现 PagingSource 接口，PagingSource有2个泛型参数：

- 参数一：Key表示第几页，Int类型。
- 参数二：Value表示数据类型。

```kotlin
class UserPagingSource(private val userService: UserService) : PagingSource<Int, User>() {
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, User> {
        return try {
            // 获取当前页数，params.key为null时，默认加载第1页
            val page = params.key ?: 1
            // 获取每页的数据
            val pageSize = params.loadSize
            // 网络请求：
            val response = userService.searchUser(page, pageSize)
            val data = response.items
            // 获取前一页索引
            val prevKey = if (page > 1) page - 1 else null
            // 获取后一页索引
            val nextKey = if (data.isNotEmpty()) page + 1 else null
            // 返回分页数据
            LoadResult.Page(data, prevKey, nextKey)
        } catch (e: Exception) {
            // 请求失败返回错误状态
            LoadResult.Error(e)
        }
    }

    override fun getRefreshKey(state: PagingState<Int, User>): Int? {
        return null
    }
}
```

**调用PagingSource：**

通过 PagingConfig 可以对Paging3进行定制：

- pageSize：每页加载的数量。
- prefetchDistance：预加载的距离。
- enablePlaceholders：占位符。

```kotlin
object UserRepo {
    private const val PAGE_SIZE = 15
    private val userService = UserService.create()

    fun getPagingData(): Flow<PagingData<User>> {
        // 配置Pager
        return Pager(
            config = PagingConfig(PAGE_SIZE),
            pagingSourceFactory = { UserPagingSource(userService) }
        ).flow
    }
}
```

### ViewModel层中调用

```kotlin
class MainViewModel(application: Application) : AndroidViewModel(application) {

    fun getPagingData(): Flow<PagingData<User>> {
        // cacheIn表示将结果缓存到ViewModelScope中，在onClear之前一直存在
        return UserRepo.getPagingData().cachedIn(viewModelScope)
    }
}
```

### 定义ReyclerView#Adapter

继承 PagingDataAdapter 类。

```kotlin
class UserAdapter(val updateItem: (Int, User) -> Unit) :
    PagingDataAdapter<User, UserAdapter.ViewHolder>(diffCallback) {

    companion object {
        private val diffCallback = object : DiffUtil.ItemCallback<User>() {
            override fun areItemsTheSame(oldItem: User, newItem: User): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(oldItem: User, newItem: User): Boolean {
                return oldItem == newItem
            }
        }
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvName: TextView = itemView.findViewById(R.id.tv_name)
        val tvFullName: TextView = itemView.findViewById(R.id.tv_full_name)
        val tvCount: TextView = itemView.findViewById(R.id.tv_count)
        val tvDescription: TextView = itemView.findViewById(R.id.tv_description)
        val btnUpdate: Button = itemView.findViewById(R.id.btn_update)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val user = getItem(position)
        user?.let {
            holder.tvName.text = it.name
            holder.tvFullName.text = it.fullName
            holder.tvDescription.text = it.description
            holder.tvCount.text = it.starCount.toString()
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView =
            LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        val viewHolder = ViewHolder(itemView)
        viewHolder.btnUpdate.setOnClickListener {
            val position = viewHolder.layoutPosition
            val user = getItem(position)
            updateItem(position, user!!)
            notifyItemChanged(position)
        }
        return viewHolder
    }
}
```

### UI层中调用

```kotlin
lifecycleScope.launch {
    // 监听数据
    viewModel.getPagingData().collect {
        pagingData = it
        // 将数据传递给适配器
        mAdapter.submitData(it)
    }
}

// 监听加载状态
mAdapter.addLoadStateListener {
    when (it.refresh) {
        is LoadState.NotLoading -> {
            progressBar.visibility = View.INVISIBLE
            rvUsers.visibility = View.VISIBLE
            logE("无加载")
        }
        is LoadState.Loading -> {
            progressBar.visibility = View.VISIBLE
            rvUsers.visibility = View.INVISIBLE
            logE("正在加载")
        }
        is LoadState.Error -> {
            val state = it.refresh as LoadState.Error
            progressBar.visibility = View.INVISIBLE
            showToast("加载失败")
            logE("加载失败：${state.error.message}")
        }
    }
}
```

### 在底部显示加载状态

**定义FooterAdapter：**

```kotlin
class FooterAdapter(val retry: () -> Unit) : LoadStateAdapter<FooterAdapter.ViewHolder>() {
    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val progressBar: ProgressBar = itemView.findViewById(R.id.progress_bar)
        val btnRetry: Button = itemView.findViewById(R.id.btn_retry)
    }

    override fun onBindViewHolder(holder: ViewHolder, loadState: LoadState) {
        holder.progressBar.isVisible = loadState is LoadState.Loading
        holder.btnRetry.isVisible = loadState is LoadState.Error
        logE("loadState $loadState")
    }

    override fun onCreateViewHolder(parent: ViewGroup, loadState: LoadState): ViewHolder {
        val itemView =
            LayoutInflater.from(parent.context).inflate(R.layout.item_footer, parent, false)
        val viewHolder = ViewHolder(itemView)
        viewHolder.btnRetry.setOnClickListener {
            retry()
        }
        return viewHolder
    }
}
```

**设置FooterAdapter：**

```kotlin
rvUsers.adapter = mAdapter.withLoadStateFooter(FooterAdapter {
    // 重试
    mAdapter.retry()
})
```

### 修改item

在 onCreateViewHolder() 方法中设置监听。

```kotlin
class UserAdapter(val updateItem: (Int, User) -> Unit) :
    PagingDataAdapter<User, UserAdapter.ViewHolder>(diffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView =
            LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        val viewHolder = ViewHolder(itemView)
        viewHolder.btnUpdate.setOnClickListener {
            val position = viewHolder.layoutPosition
            val user = getItem(position)
            updateItem(position, user!!)
            notifyItemChanged(position)
        }
        return viewHolder
    }
}
```

```kotlin
mAdapter = UserAdapter { position, user ->
    user.fullName = System.currentTimeMillis().toString()
}
```




## [代码下载](https://github.com/xiangxiongfly/Android_JetpackProject)

