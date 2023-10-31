[TOC]

# Kotlin CoroutineContext 协程上下文

## 概述

-   CoroutineContext 即协程上下文，是Kotlin协程中的重要概念，可以用来切换线程池、指定协程名、捕获异常等。
-   CoroutineContext 是一个接口，如 Job、Deferred、Dispatcher、CoroutineName、CoroutineExceptionHandler、挂起函数都与 CoroutineContext 密切联系。
-   CoroutineScope 协程作用域，用于批量控制协程，本质是对 CoroutineContext 的一层简单封装。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7f42d581373b46278237cca6a3e3358e.png)



## Dispatchers 协程调度器

协程是运行在线程之上的。

-   Dispatchers.Main：只在UI编程平台才有意义，如Android，一般Main线程用于UI绘制。在普通JVM工程中无法直接使用。
-   Dispatchers.Unconfined：代表无所谓，当前协程可能运行在任意线程之上，不推荐使用。
-   Dispatchers.Default：CPU密集型任务的线程池。
-   Dispatchers.IO：IO密集型任务的线程池。

**相关源码：**

```kotlin
public actual object Dispatchers {
    public actual val Default: CoroutineDispatcher = DefaultScheduler   
    public actual val Main: MainCoroutineDispatcher get() = MainDispatcherLoader.dispatcher
    public actual val Unconfined: CoroutineDispatcher = kotlinx.coroutines.Unconfined
    public val IO: CoroutineDispatcher = DefaultIoScheduler
    public fun shutdown() { }
}

public abstract class CoroutineDispatcher :  AbstractCoroutineContextElement(ContinuationInterceptor), ContinuationInterceptor { }

public interface ContinuationInterceptor : CoroutineContext.Element { }
```

### 场景一：线程切换

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

说明：使用 `withContext(Dispatchers.IO)` 后，withContext 中的代码会被分发到 DefaultDispatcher 线程池中执行，而它外部的代码依然在main线程中执行。DefaultDispatcher.IO 底层可能会复用 Dispatchers.Default 线程池的。

### 场景二：IO线程池复用Default线程池

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

说明：当 Dispatchers.Default 线程池有富余线程时，它是可以被 IO 线程池复用的。

### 场景三：自定义线程调度器

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

说明：创建一个单线程的线程池，为 runBlocking 传入自定义的 mySingleDispatcher 后，withContext 中的代码运行在 DefaultDispatcher.IO 线程池中，而其他代码运行在 mySingleDispatcher 线程池中。

### 场景四：Dispatchers.Unconfined不可靠

```kotlin
fun main() {
    runBlocking {
        log("before")         //1
        launch {
            log("子协程开始")   //2
            delay(1000L)
            log("子协程结束")   //3
        }
        log("after")          //4
    }
}
/*
输出信息：
┌──────────────────────────────────────────────────
before
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
after
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
子协程开始
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
子协程结束
Thread:main @coroutine#2
└──────────────────────────────────────────────────
 */
```

说明：打印顺序：1 -> 4 -> 2 -> 3。

```kotlin

fun main() {
    runBlocking {
        log("before")         //1
        launch(Dispatchers.Unconfined) {
            log("子协程开始")   //2
            delay(1000L)
            log("子协程结束")   //3
        }
        log("after")          //4
    }
}
/*
输出信息：
┌──────────────────────────────────────────────────
before
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
子协程开始
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
after
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
子协程结束
Thread:kotlinx.coroutines.DefaultExecutor @coroutine#2
└──────────────────────────────────────────────────
 */
```

说明：打印顺序：1 -> 2 -> 4 -> 3。使用 `Dispatchers.Unconfined` 后协程的执行顺序发生了变化。虽然Unconfined 代表的意思就是，当前协程可能运行在任何线程之上，不作强制要求。 但是不应该随意使用 Dispatchers.Unconfined。 



## CoroutineScope 协程作用域

CoroutineScope 是一个接口，内部有个 CoroutineContext 类型的成员变量。CoroutineScope 只是对 CoroutineContext 做了一层封装而已，它的核心能力其实都来自于 CoroutineContext。 

CoroutineScope 有个扩展函数launch，用于开启一个协程。

CoroutineScope 最大的作用是方便我们批量控制协程。

**相关源码：**

```kotlin
public interface CoroutineScope {
    public val coroutineContext: CoroutineContext
}

//扩展函数
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job {
    ...
}
```

### 批量控制协程

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

说明：创建一个 CoroutineScope 对象，使用这个scope开启三个协程，500毫秒后，调用 `cancel()` 方法，这三个协程被取消了。这也体现了Kotlin协程的结构化并发。



## Job与CoroutineContext关系

如果说 CoroutineScope 封装了 CoroutineContext，那么 Job 就是一个真正的 CoroutineContext。

Job 继承自 CoroutineContext.Element ，而 CoroutineContext.Element 继承自 CoroutineContext ，因此说 Job 是一个真正的 CoroutineContext。

**相关源码：**

```kotlin
public interface Job : CoroutineContext.Element { }

public interface CoroutineContext {   
    public operator fun <E : Element> get(key: Key<E>): E?
    public operator fun plus(context: CoroutineContext): CoroutineContext {}
    public fun <R> fold(initial: R, operation: (R, Element) -> R): R
    public fun minusKey(key: Key<*>): CoroutineContext

    public interface Element : CoroutineContext { }
}
```

### 指定线程池


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



## CoroutineName 协程名

CoroutineName 是一个数据类，继承自 AbstractCoroutineContextElement 类，而它继承自 Element，所以 CoroutineName 间接继承自 CoroutineContext。

CoroutineName 也是一个 CoroutineContext 类型。

**相关源码：**

```kotlin
public abstract class AbstractCoroutineContextElement(public override val key: Key<*>) : Element

public data class CoroutineName(val name: String) : AbstractCoroutineContextElement(CoroutineName) { }
```

### 指定协程名


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



## CoroutineExceptionHandler 异常处理

CoroutineExceptionHandler 间接继承自 CoroutineContext。它主要负责处理协程当中的异常。 

CoroutineExceptionHandler 真正重要的，其实只有 handleException() 这个方法，如果我们要自定义异常处理器，我们就只需要实现该方法即可。 

**相关源码：**

```kotlin
public interface CoroutineExceptionHandler : CoroutineContext.Element {
    public companion object Key : CoroutineContext.Key<CoroutineExceptionHandler>
    public fun handleException(context: CoroutineContext, exception: Throwable)
}
```

### 捕获异常

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

