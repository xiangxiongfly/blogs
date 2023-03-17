# Kotlin思维封装OkHttp

**定义注解**

```kotlin
@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class Field(val value: String)

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class GET(val value: String)
```

**定义数据类**

```kotlin
data class RepoList(
    val count: Int,
    val items: List<Repo>,
    val msg: String
)

data class Repo(
    val added_stars: String,
    val avatars: List<String>,
    val desc: String,
    val forks: String,
    val lang: String,
    val repo: String,
    val repo_link: String,
    val stars: String
)
```

**封装OkHttp**

```kotlin
object KtHttp {
    private const val baseUrl = "https://trendings.herokuapp.com"
    private val okHttpClient: OkHttpClient by lazy { OkHttpClient() }
    private val gson: Gson by lazy { Gson() }

    fun <T> create(service: Class<T>): T {
        return Proxy.newProxyInstance(
            service.classLoader,
            arrayOf<Class<*>>(service)
        ) { proxy, method, args ->
           val annotations = method.annotations
           for (annotation in annotations) {
               if (annotation is GET) {
                   val url = baseUrl + annotation.value
                   return@newProxyInstance invoke(url, method, args!!)
               }
           }
           return@newProxyInstance null
          } as T
    }

    private fun invoke(path: String, method: Method, args: Array<Any>): Any? {
        if (method.parameterAnnotations.size != args.size)
        return null

        var url = path
        val parameterAnnotations = method.parameterAnnotations
        //遍历参数
        for (i in args.indices) {
            //遍历参数上的注解
            for (parameterAnnotation in parameterAnnotations[i]) {
                if (parameterAnnotation is Field) {
                    val key = parameterAnnotation.value
                    val value = args[i].toString()
                    url += if ("?" !in url) {
                        "?$key=$value"
                    } else {
                        "&$key=$value"
                    }
                }
            }
        }

        val request = Request.Builder()
            .url(url)
            .build()

        val response = okHttpClient.newCall(request).execute()

        val genericReturnType = method.genericReturnType
        val body = response.body
        val json = body?.string()
        val result = gson.fromJson<Any?>(json, genericReturnType)
        return result
    }
}
```

**使用**

```kotlin
interface ApiService {
    @GET("/repo")
    fun repos(@Field("lang") lang: String, @Field("since") since: String): RepoList
}
```

```kotlin
val api: ApiService = KtHttp.create(ApiService::class.java)
val data: RepoList = api.repos("kotlin", "weekly")              
```



