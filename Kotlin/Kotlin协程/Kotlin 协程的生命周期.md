[Toc]

# Kotlin 协程的生命周期

## 概述

使用 launch 和 async 开启一个协程后，同时也会返回一个Job对象，Job对象就是协程的句柄。

Job对象可以做两件事：

-   通过 Job 监测协程的生命周期状态，如 isActive、isCancelled、isCompleted。
-   通过 Job 操控协程，如 start()、cancel()。



## Job

**日志打印工具：**

定义了一个 `Job.log()` 扩展函数，用于打印 Job 的生命周期状态。

```kotlin
fun Job.log() {
    logX("""
    isActive = ${isActive}        
    isCancelled = ${isCancelled}    
    isCompleted = ${isCompleted}""".trimIndent())
}

fun logX(any: Any?) {
    println(
        """
┌──────────────────────────────────────────────────
$any
Thread:${Thread.currentThread().name}
└──────────────────────────────────────────────────""".trimIndent()
    )
}
```



### Job 生命周期图

![在这里插入图片描述](https://img-blog.csdnimg.cn/726dcacf4dde4d0f87dc55450d848051.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_17,color_FFFFFF,t_70,g_se,x_16)

-   isActive：`job.isActive()`返回true时表示协程处于活跃状态。
-   isCancelled：调用了`job.cancel()`方法，`job.isCancelled()`返回true，表示协程处于取消状态。
-   isCompleted：协程执行完后，`job.isCompleted`返回true，表示协程处于结束状态。
-   start：启动协程，蓝家在模式下使用。
-   cancel：取消协程。



### Job#cancel() 取消协程时的生命周期变化


```kotlin
fun main() = runBlocking {
    val job = launch {
        delay(1000L)
    }
    job.log()       // 第一处
    job.cancel()    // 第二处
    job.log()       // 第三处
}
```

输出信息：

```
┌──────────────────────────────────────────────────
isActive = true        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = true    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
```

说明：第一处的打印日志 `isActive = true ` 表示协程处于活跃状态。第二处调用 `job.cancel()` 后，协程任务就会被取消。因此，第三处的打印日志 `isCancelled = true` 表示协程处于取消状态。



### Job#start() 生命周期变化

可以使用 `Job#start()`  启动协程任务，需要配合 `CoroutineStart.LAZY` 使用。


```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        logX("协程启动了")
        delay(1000L)
    }
    delay(500L)
    job.log()
    job.start()
    job.log()
    delay(500L)
    job.cancel()
    delay(500L)
    job.log()
    delay(2000L)
    logX("结束")
}
```

输出信息：

```
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = true        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程启动了
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = true    
isCompleted = true
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
结束
Thread:main @coroutine#1
└──────────────────────────────────────────────────
```

说明：使用了懒加载模式所以创建协程后，不会立即执行。在调用 `job.start()` 后，协程开始执行，job的状态变为活跃状态。



### Job#start() 懒加载时的生命周期变化

在懒加载模式下需要使用 `Job#start()`  启动协程任务。

```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        logX("协程启动了")
        delay(1000L)
    }
    delay(500L)
    job.log()
    job.start()
    job.log()
    delay(1100L)  
    job.log()
    delay(2000L)  
    logX("结束")
}
```

输出信息：

```
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = true        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程启动了
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = false    
isCompleted = true
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
结束
Thread:main @coroutine#1
└──────────────────────────────────────────────────
```



### Job#invokeOnCompletion() 监听结束事件

 `invokeOnCompletion()` 函数可以监听结束事件，如果 job 被取消，这个函数依然会被调用。

`join() ` 是一个挂起函数，挂起当前的程序执行流程，等待 job 中的协程任务执行完毕后，然后恢复当前程序执行流程。

```kotlin

fun main() = runBlocking {
    suspend fun download() {
        // 模拟下载任务
        val time = (Random.nextDouble() * 1000).toLong()
        logX("Delay time: = $time")
        delay(time)
    }
    val job = launch(start = CoroutineStart.LAZY) {
        logX("协程开始")
        download()
        logX("协程结束")
    }
    delay(500L)
    job.log()
    job.start()
    job.log()
    job.invokeOnCompletion {
        job.log() // 协程结束以后就会调用这里的代码
    }
    job.join()      // 等待协程执行完毕
    logX("结束")
}
```

输出信息：

```
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = true        
isCancelled = false    
isCompleted = false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程开始
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
Delay time: = 112
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程结束
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive = false        
isCancelled = false    
isCompleted = true
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
结束
Thread:main @coroutine#1
└──────────────────────────────────────────────────
```



### Job源码

```kotlin
// 代码段7

public interface Job : CoroutineContext.Element {

    // 省略部分代码

    // ------------ 状态查询API ------------

    public val isActive: Boolean

    public val isCompleted: Boolean

    public val isCancelled: Boolean

    public fun getCancellationException(): CancellationException

    // ------------ 操控状态API ------------

    public fun start(): Boolean

    public fun cancel(cause: CancellationException? = null)

    public fun cancel(): Unit = cancel(null)

    public fun cancel(cause: Throwable? = null): Boolean

    // ------------ 等待状态API ------------

    public suspend fun join()

    public val onJoin: SelectClause0

    // ------------ 完成状态回调API ------------

    public fun invokeOnCompletion(handler: CompletionHandler): DisposableHandle

    public fun invokeOnCompletion(
        onCancelling: Boolean = false,
        invokeImmediately: Boolean = true,
        handler: CompletionHandler): DisposableHandle

    // ------------ parent-child ------------ 
    public val children: Sequence 

    @InternalCoroutinesApi 
    public fun attachChild(child: ChildJob): ChildHandle
}
```



## Deferred

Deferred 其实也是继承自Job 。

**Deffered源码：**

```kotlin
public interface Deferred<out T> : Job {
    public suspend fun await(): T
}
```

**使用async-await：**

```kotlin
fun main() = runBlocking {
    val deferred = async {
        log("协程开始")
        delay(1000L)
        log("协程结束")
        "hello world"
    }
    val result = deferred.await()
    println("result=$result")
    log("完毕")
}
```

输出信息：

```
┌──────────────────────────────────────────────────
协程开始
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程结束
Thread:main @coroutine#2
└──────────────────────────────────────────────────
result=hello world
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
```



## 结构化并发

-   结构化并发指带有结构和层级的并发。
-   线程之间不存在父子关系，但是协程之间存在父子关系，一个协程可以拥有多个子协程。
-   可以实现只控制父协程，从而控制一堆子协程。

### 子协程全部执行完后，父协程才会执行完

![在这里插入图片描述](https://img-blog.csdnimg.cn/aa0e7570b239470e969cb302450bf28c.png)

```kotlin
fun main() = runBlocking {
    val parentJob: Job
    var job1: Job? = null
    var job2: Job? = null
    var job3: Job? = null
    parentJob = launch {
        job1 = launch {
            delay(1000L)
        }
        job2 = launch {
            delay(3000L)
        }
        job3 = launch {
            delay(5000L)
        }
    }
    delay(100L)
    parentJob.children.forEachIndexed { index, job ->
        when (index) {
            0 -> println("job1 === job: ${job1 === job}")
            1 -> println("job2 === job: ${job2 === job}")
            2 -> println("job3 === job: ${job3 === job}")
        }
    }
    parentJob.join() //这里会挂起大概5秒
    log("完毕")
}

/*
job1 === job: false
job2 === job: false
job3 === job: true
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：` parentJob.join()`这里会被挂起大概5秒钟，会等待内部的job1、job2、job3全部执行完后，parentJob才是执行完毕，然后会继续往下执行。

**Job源码：**

```kotlin
public interface Job : CoroutineContext.Element { 
    // 省略部分代码 
    // ------------ parent-child ------------ 
    public val children: Sequence 
    
    @InternalCoroutinesApi 
    public fun attachChild(child: ChildJob): ChildHandle
}
```

每个 Job 对象都一个children属性，类型是 Sequence，是一个惰性的集合，可以对它进行遍历。



### 父协程取消了，子协程也会被取消

![在这里插入图片描述](https://img-blog.csdnimg.cn/4f3f42a14be5458aa9aa2a28b8915b2d.png)

```kotlin
fun main() = runBlocking {
    val parentJob: Job
    var job1: Job? = null
    var job2: Job? = null
    var job3: Job? = null
    parentJob = launch {
        job1 = launch {
            log("job1 start")
            delay(1000L)
            log("job1 end")
        }
        job2 = launch {
            log("job2 start")
            delay(3000L)
            log("job2 end")
        }
        job3 = launch {
            log("job3 start")
            delay(5000L)
            log("job3 end")
        }
    }
    delay(500L)
    parentJob.children.forEachIndexed { index, job ->
        when (index) {
            0 -> println("job1 === job: ${job1 === job}")
            1 -> println("job2 === job: ${job2 === job}")
            2 -> println("job3 === job: ${job3 === job}")
        }
    }
    parentJob.cancel() //这里会挂起大概5秒
    log("完毕")
}

/*
┌──────────────────────────────────────────────────
job1 start
Thread:main @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
job2 start
Thread:main @coroutine#4
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
job3 start
Thread:main @coroutine#5
└──────────────────────────────────────────────────
job1 === job: true
job2 === job: true
job3 === job: true
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：`parentJob.cancel()`执行后，job1、job2、job3也被取消了。



### 场景三

```kotlin
fun main() = runBlocking {
    val job = launch {
        log("协程A开始")
        delay(1000L)
        log("协程A结束")
    }
    job.log()
    job.join()
    job.log()
    val job2 = launch(job) {
        log("协程B开始")
        delay(1000L)
        log("协程B结束")
    }
    job2.join()
    log("完毕")
}

/*
┌──────────────────────────────────────────────────
isActive=true isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程A开始
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程A结束
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=false isCancelled=false isCompleted=true
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：因为协程具有结构化并发的特性，当job执行完后处于complete状态，job 与 job2 存在依赖关系，不会被激活，因此job2不会执行。

