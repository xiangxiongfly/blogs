[toc]

# Android 优雅封装Glide

## 核心思想

 使用策略模式实现不同图片加载框架的切换，使用建造者设计模式处理不同参数，最后通过 ImageLoader 进行管理。



## 定义策略接口

```kotlin
interface ILoaderStrategy {

    fun loadImage(configs: ImageOptions)

    fun clearDiskCache(context: Context)

    fun clearMemoryCache(context: Context)

    fun clearAll(context: Context) {
        clearDiskCache(context)
        clearMemoryCache(context)
    }

    fun clear(imageView: ImageView)
}
```



## 定义图片选项

```kotlin
class ImageOptions private constructor() {
    var targetObj: Any? = null // 生命周期对象
    var targetView: ImageView? = null // 目标ImageView
    var resource: Any? = null // 加载资源
    var width = -1 // 指定宽度
    var height = -1 // 指定高度
    var isDiskCache = true // 磁盘缓存
    var isMemoryCache = true // 内存缓存

    @DrawableRes
    var placeholder: Int = -1 // 占位图资源

    @DrawableRes
    var error: Int = -1 // 失败图资源

    var listener: Listener? = null

    companion object {
        fun create(): ImageOptions {
            return ImageOptions()
        }
    }

    fun with(targetObj: Any): ImageOptions {
        this.targetObj = targetObj
        return this
    }

    fun loadResource(resource: Any): ImageOptions {
        this.resource = resource
        return this
    }

    fun size(size: Int): ImageOptions {
        return size(width, height)
    }

    fun size(width: Int, height: Int): ImageOptions {
        this.width = width
        this.height = height
        return this
    }

    fun placeholder(@DrawableRes placeholder: Int): ImageOptions {
        this.placeholder = placeholder
        return this
    }

    fun error(@DrawableRes error: Int): ImageOptions {
        this.error = error
        return this
    }

    fun setDiskCache(isCache: Boolean): ImageOptions {
        isDiskCache = isCache
        return this
    }

    fun setMemoryCache(isCache: Boolean): ImageOptions {
        isMemoryCache = isCache
        return this
    }

    fun setListener(listener: Listener): ImageOptions {
        this.listener = listener
        return this
    }

    fun into(imageView: ImageView) {
        this.targetView = imageView
        ImageLoader.loadOptions(this)
    }

    interface Listener {
        fun onSuccess(model: Any?)
        fun onFail(model: Any?)
    }
}
```



## 实现Glide策略

```kotlin
class GlideLoader : ILoaderStrategy {
    private lateinit var requestManager: RequestManager

    override fun loadImage(options: ImageOptions) {
        requestManager = getRequestManager(options.targetObj)
        var requestBuilder: RequestBuilder<Drawable>? = null

        options.resource?.let {
            requestBuilder = generateRequestBuilder(it)
        }

        requestBuilder?.let {
            if (options.placeholder != -1) {
                it.placeholder(options.placeholder)
            }
            if (options.error != -1) {
                it.error(options.error)
            }
            if (options.width != -1 || options.height != -1) {
                it.override(options.width, options.height)
            }
            it.skipMemoryCache(options.isMemoryCache)
            it.diskCacheStrategy(if (options.isDiskCache) DiskCacheStrategy.AUTOMATIC else DiskCacheStrategy.NONE)
            options.listener?.let { listener ->
                it.addListener(object : RequestListener<Drawable> {
                    override fun onLoadFailed(
                        e: GlideException?,
                        model: Any?,
                        target: Target<Drawable>?,
                        isFirstResource: Boolean
                    ): Boolean {
                        listener.onFail(model)
                        return false
                    }

                    override fun onResourceReady(
                        resource: Drawable?,
                        model: Any?,
                        target: Target<Drawable>?,
                        dataSource: DataSource?,
                        isFirstResource: Boolean
                    ): Boolean {
                        listener.onSuccess(model)
                        return false
                    }
                })
            }
            if (options.targetView == null) {
                throw IllegalArgumentException("targetView cannot be null");
            }
            it.into(options.targetView!!)
        }
    }

    private fun getRequestManager(targetObj: Any?): RequestManager {
        return if (targetObj is FragmentActivity) {
            Glide.with(targetObj)
        } else if (targetObj is Context) {
            Glide.with(targetObj)
        } else if (targetObj is View) {
            Glide.with(targetObj)
        } else if (targetObj is Fragment) {
            Glide.with(targetObj)
        } else {
            throw IllegalArgumentException("You cannot start a load on a null Context");
        }
    }

    private fun generateRequestBuilder(res: Any): RequestBuilder<Drawable>? {
        return if (res is String) {
            requestManager.load(res)
        } else if (res is File) {
            requestManager.load(res)
        } else {
            return null
        }
    }

    override fun clearDiskCache(context: Context) {
        thread {
            Glide.get(context).clearDiskCache()
        }
    }

    override fun clearMemoryCache(context: Context) {
        Glide.get(context).clearMemory()
    }

    override fun clear(imageView: ImageView) {
        Glide.with(imageView.context).clear(imageView)
    }
}
```



## 图片管理类 

```kotlin
object ImageLoader {

    private var imageLoader: ILoaderStrategy? = null

    fun setImageLoader(imageLoader: ILoaderStrategy) {
        this.imageLoader = imageLoader
    }

    fun with(targetObj: Any): ImageOptions {
        val options = ImageOptions.create()
        options.with(targetObj)
        return options
    }

    fun loadOptions(options: ImageOptions) {
        imageLoader!!.loadImage(options)
    }

    fun clearDiskCache(context: Context){
        imageLoader!!.clearDiskCache(context)
    }

    fun clearMemoryCache(context: Context){
        imageLoader!!.clearMemoryCache(context)
    }

    fun clearAll(context:Context){
        imageLoader!!.clearAll(context)
    }

    fun clear(imageView: ImageView){
        imageLoader!!.clear(imageView)
    }

}
```



## 使用

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_image_loader)
    imageView0 = findViewById(R.id.imageView0)
    imageView1 = findViewById(R.id.imageView1)
    imageView2 = findViewById(R.id.imageView2)

    ImageLoader.setImageLoader(GlideLoader())

    val url = "https://i-blog.csdnimg.cn/blog_migrate/de6e3262387d57977e53af596a87f582.png"

    ImageLoader.with(this)
        .loadResource(url)
        .size(100)
        .placeholder(R.mipmap.ic_launcher)
        .error(R.mipmap.ic_launcher)
        .into(imageView1)

    ImageLoader.with(this)
        .loadResource(File(cacheDir, "aaa.png"))
        .placeholder(R.mipmap.ic_launcher)
        .error(R.mipmap.ic_launcher)
        .into(imageView2)
} 
```

```
ImageLoader.clear(imageView1)
ImageLoader.clearAll(this)
ImageLoader.clearMemoryCache(this)
ImageLoader.clearDiskCache(this)
```

