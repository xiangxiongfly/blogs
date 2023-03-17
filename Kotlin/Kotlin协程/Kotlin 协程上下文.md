[TOC]

# Kotlin CoroutineContext 协程上下文

## 概述

-   CoroutineContext即协程上下文，是Kotlin协程中的重要概念，可以用来切换线程池、指定协程名、捕获异常等。
-   CoroutineContext是一个接口，如Job、Deferred、Dispatcher、CoroutineName、CoroutineExceptionHandler都间接继承自CoroutineContext接口。
-   CoroutineScope协程作用域，用于批量控制协程，本质也是对CoroutineContext的一层简单封装。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c72e9456d99243b3bcaed0c0cdde9df1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_15,color_FFFFFF,t_70,g_se,x_16)



## Dispatchers 协程调度器

协程是运行在线程之上的。

-   Dispatchers.Main：只在UI编程平台才有意义，如Android，一般Main线程用于UI绘制。在普通JVM工程中无法直接使用。
-   Dispatchers.Unconfined：代表无所谓，当前协程可能运行在任意线程之上，不推荐使用。
-   Dispatchers.Default：CPU密集型任务的线程池。
-   Dispatchers.IO：IO密集型任务的线程池。

**情况一**

```kotlin
fun main() = runBlocking {
    val user = getUserInfo()
    log(user)
}

suspend fun getUserInfo(): String {
    log("before")
    withContext(Dispatchers.IO) {
        log("withContext(Dispatchers.IO)")
        delay(1000L)
    }
    log("after")
    return "hello world"
}

/*
输出信息：
┌──────────────────────────────────────────────────
before
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
withContext(Dispatchers.IO)
Thread:DefaultDispatcher-worker-1 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
after
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
hello world
Thread:main @coroutine#1
└──────────────────────────────────────────────────
*/
```

说明：使用`withContext(Dispatchers.IO)`后，withContext中的代码会被分发到DefaultDispatcher线程池中执行，而它外部的代码依然在main线程中执行。

**情况二**

```kotlin
//						   变化
//							↓
fun main() = runBlocking(Dispatchers.Default) {
    val user = getUserInfo()
    log(user)
}

suspend fun getUserInfo(): String {
    log("before")
    withContext(Dispatchers.IO) {
        log("withContext(Dispatchers.IO)")
        delay(1000L)
    }
    log("after")
    return "hello world"
}

/*
输出信息：
┌──────────────────────────────────────────────────
before
Thread:DefaultDispatcher-worker-1 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
withContext(Dispatchers.IO)
Thread:DefaultDispatcher-worker-2 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
after
Thread:DefaultDispatcher-worker-2 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
hello world
Thread:DefaultDispatcher-worker-2 @coroutine#1
└──────────────────────────────────────────────────
*/
```

说明：当Default线程池有富余线程时，它是可以被IO线程池复用的。

**情况三**

```kotlin
val mySingleDispatcher: ExecutorCoroutineDispatcher = Executors.newSingleThreadExecutor {
    Thread(it, "我的单线程").apply { isDaemon = true }
}.asCoroutineDispatcher()

//						   变化
//   						↓
fun main() = runBlocking(mySingleDispatcher) {
    val user = getUserInfo()
    log(user)
}

suspend fun getUserInfo(): String {
    log("before")
    withContext(Dispatchers.IO) {
        log("withContext(Dispatchers.IO)")
        delay(1000L)
    }
    log("after")
    return "hello world"
}

/*
输出信息：
┌──────────────────────────────────────────────────
before
Thread:我的单线程 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
withContext(Dispatchers.IO)
Thread:DefaultDispatcher-worker-1 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
after
Thread:我的单线程 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
hello world
Thread:我的单线程 @coroutine#1
└──────────────────────────────────────────────────
*/
```

说明：创建一个单线程的线程池，为runBlocking传入自定义的mySingleDispatcher后，程序运行在mySingleDispatcher线程池中，而withContext中的代码仍然运行在DefaultDispatcher线程池中。



## CoroutineScope 协程作用域

CoroutineScope是一个接口，内部有个CoroutineContext类型的成员变量。CoroutineScope有个扩展函数launch，用于开启一个协程。

CoroutineScope最大的作用是方便我们批量控制协程。

```kotlin
//CoroutineScope相关源码

public interface CoroutineScope {
    public val coroutineContext: CoroutineContext
}

public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job {
    ...
}
```

**情况一**

```kotlin
fun main() = runBlocking {
    val scope: CoroutineScope = CoroutineScope(Job())
    scope.launch {
        log("协程A start")
        delay(1000L)
        log("协程A end") //不会执行
    }
    scope.launch {
        log("协程B start")
        delay(1000L)
        log("协程B end") //不会执行
    }
    scope.launch {
        log("协程C start")
        delay(1000L)
        log("协程C end") //不会执行
    }
    delay(500L)
    scope.cancel()
}

/*
输出信息：
┌──────────────────────────────────────────────────
协程A start
Thread:DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程B start
Thread:DefaultDispatcher-worker-2 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程C start
Thread:DefaultDispatcher-worker-3 @coroutine#4
└──────────────────────────────────────────────────
 */
```

说明：创建一个CoroutineScope对象，使用这个scope开启三个协程，500毫秒后，调用`cancel()`方法，这三个协程被取消了。这也体现了Kotlin协程结构化并发的特性。



## Job与CoroutineContext关系

Job继承自CoroutineContext.Element，而CoroutineContext.Element继承自CoroutineContext，所以Job间接继承自CoroutineContext。

Job也是一个CoroutineContext类型。

```kotlin
//Job相关源码：

public interface Job : CoroutineContext.Element { }

public interface CoroutineContext {   
    public operator fun <E : Element> get(key: Key<E>): E?
    public operator fun plus(context: CoroutineContext): CoroutineContext {}
    public fun <R> fold(initial: R, operation: (R, Element) -> R): R
    public fun minusKey(key: Key<*>): CoroutineContext

    public interface Element : CoroutineContext { }
}
```

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() = runBlocking {
    val scope: CoroutineScope = CoroutineScope(Job() + mySingleDispatcher)
    val job: Job = scope.launch {
        log("协程A start")
        log(coroutineContext[CoroutineDispatcher] == mySingleDispatcher)
        delay(1000L)
        log("协程A end") //不会执行
    }
    delay(500L)
    scope.cancel()
}

/*
输出信息：
┌──────────────────────────────────────────────────
协程A start
Thread:我的单线程 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
true
Thread:我的单线程 @coroutine#2
└──────────────────────────────────────────────────
 */
```

说明：CoroutineContext可以看作Map，内部进行了一些操作费重载。



## Dispatcher与CoroutineContext关系

Dispatchers是一个object单例，内部成员是CoroutineDispatcher类型，而它继承自ContinuationInterceptor接口，这个接口继承自 CoroutineContext.Element，所以Dispatchers间接继承自CoroutineContext。

Dispatcher也是一个CoroutineContext类型。

```kotlin
//Dispatcher相关源码：

public actual object Dispatchers {
    public actual val Default: CoroutineDispatcher = DefaultScheduler   
    public actual val Main: MainCoroutineDispatcher get() = MainDispatcherLoader.dispatcher
    public actual val Unconfined: CoroutineDispatcher = kotlinx.coroutines.Unconfined
    public val IO: CoroutineDispatcher = DefaultIoScheduler
    public fun shutdown() { }
}

public abstract class CoroutineDispatcher : AbstractCoroutineContextElement(ContinuationInterceptor), ContinuationInterceptor { }

public interface ContinuationInterceptor : CoroutineContext.Element { }
```



## CoroutineName 指定协程名

CoroutineName是一个数据类，继承自AbstractCoroutineContextElement类，而它继承自Element，所以CoroutineName间接继承自CoroutineContext。

CoroutineName也是一个CoroutineContext类型。

```kotlin
//CoroutineName相关源码：
public data class CoroutineName(val name: String) : AbstractCoroutineContextElement(CoroutineName) { }

public abstract class AbstractCoroutineContextElement(public override val key: Key<*>) : Element
```

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() = runBlocking {
    val scope: CoroutineScope = CoroutineScope(Job() + mySingleDispatcher + CoroutineName("我的协程"))
    scope.launch {
        log("协程A start")
        log(coroutineContext[CoroutineDispatcher] == mySingleDispatcher)
        delay(1000L)
        log("协程A end")
    }
    delay(500L)
    scope.cancel()
}

/*
输出信息：
┌──────────────────────────────────────────────────
协程A start
Thread:我的单线程 @我的协程#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
true
Thread:我的单线程 @我的协程#2
└──────────────────────────────────────────────────
 */
```



## CoroutineExceptionHandler 协程的异常处理

CoroutineExceptionHandler间接继承自CoroutineContext。

CoroutineExceptionHandler也是一个CoroutineContext类型。

```kotlin
//CoroutineExceptionHandler相关源码：

public inline fun CoroutineExceptionHandler(crossinline handler: (CoroutineContext, Throwable) -> Unit): CoroutineExceptionHandler =
object : AbstractCoroutineContextElement(CoroutineExceptionHandler), CoroutineExceptionHandler {
    override fun handleException(context: CoroutineContext, exception: Throwable) =
    handler.invoke(context, exception)
}

public interface CoroutineExceptionHandler : CoroutineContext.Element {
    public companion object Key : CoroutineContext.Key<CoroutineExceptionHandler>
    public fun handleException(context: CoroutineContext, exception: Throwable)
}
```

```kotlin
fun main() = runBlocking {
    val myExceptionHandler = CoroutineExceptionHandler { 
        coroutineContext, throwable -> println("捕获异常：$throwable")
    }
    val scope: CoroutineScope = CoroutineScope(Job())
    val job = scope.launch(myExceptionHandler) {
        val s: String? = null
        s!!.length
    }
    job.join()
}

/*
输出信息：
捕获异常：java.lang.NullPointerException
 */
```

