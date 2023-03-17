[Toc]

# Kotlin 协程的生命周期

## 概述

当使用`launch`和`async`开启一个协程后，同时也会返回一个Job对象，Job对象其实就是协程的句柄。

Job对象主要做两件事：

-   监测协程的生命周期状态；
-   操控协程。

Job与协程的关系非常类似空调遥控器与空调的关系：

-   遥控器可以监测空调的运行状态，Job可以监测协程的运行状态；
-   遥控器可以操控空调的运行状态，Job可以简单操控协程的运行状态。



## Job

**日志打印**

定义了一个`Job.log()`扩展函数，用打印Job的生命周期状态。

```kotlin
fun Job.log() {
    log("isActive=$isActive isCancelled=$isCancelled isCompleted=$isCompleted")
}

fun log(any: Any?) {
    println(
        """
┌──────────────────────────────────────────────────
$any
Thread:${Thread.currentThread().name}
└──────────────────────────────────────────────────""".trimIndent()
    )
}
```



### 生命周期状态

![在这里插入图片描述](https://img-blog.csdnimg.cn/726dcacf4dde4d0f87dc55450d848051.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_17,color_FFFFFF,t_70,g_se,x_16)

-   isActive：`job.isActive()`返回true时表示协程处于活跃状态。
-   isCancelled：调用了`job.cancel()`方法，`job.isCancelled()`返回true，表示协程处于取消状态。
-   isCompleted：协程执行完后，`job.isCompleted`返回true，表示协程处于结束状态。
-   start：启动协程，蓝家在模式下使用。
-   cancel：取消协程。



### 先启动协程再取消时的状态


```kotlin
fun main() = runBlocking {
    val job = launch {
        delay(1000L)
    }
    job.log()
    job.cancel()
    job.log()
    delay(1500L)
    job.log()
}

/*
┌──────────────────────────────────────────────────
isActive=true isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=false isCancelled=true isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=false isCancelled=true isCompleted=true
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```



### 懒加载模式下先启动再取消时的状态


```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        log("协程开启")
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
    log("完毕")
}

/*
┌──────────────────────────────────────────────────
isActive=false isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=true isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程开启
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=false isCancelled=true isCompleted=true
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```



### 协程正常执行完毕的状态

```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        log("协程开启")
        delay(1000L)
    }
    delay(500L)
    job.log()
    job.start()
    job.log()
    delay(1100L)
    job.log()
    delay(2000L)
    log("完毕")
}

/*
┌──────────────────────────────────────────────────
isActive=false isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=true isCancelled=false isCompleted=false
Thread:main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
协程开启
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



### 监听结束事件

将上面的案例launch中的delay改为5000L时，就会发现输出”完毕“后，程序没有立即结束，而是过了一段时间才真正退出。

可以使用`invokeOnCompletion()`函数监听结束事件，`join()`函数挂起后续代码。

```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        log("协程开启")
        delay(5000L)
    }
    job.start()
    job.invokeOnCompletion {
        job.log()
    }
    job.join() //等待协程执行完后
    log("完毕")
}

/*
┌──────────────────────────────────────────────────
协程开启
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
isActive=false isCancelled=false isCompleted=true
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
完毕
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```



## Deferred

```kotlin
public interface Deferred<out T> : Job {
    public suspend fun await(): T
}
```

Deferred其实也是继承自Job。

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

/*
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
 */
```



## 结构化并发

-   结构化并发指带有结构和层级的并发。线程之间不存在父子关系，但是协程之间存在父子关系，一个协程可以拥有多个子协程。
-   可以实现只控制父协程，从而控制一堆子协程。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2357bb41bd8e4978aef459c0c3bdcbc1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_7,color_FFFFFF,t_70,g_se,x_16)

### 场景一

只有子协程全部执行完后，父协程才会执行完。

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

### 场景二

父协程取消了，子协程也会被取消。

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

说明：因为协程具有结构化并发的特性，当job执行完后处于complete状态，job2与job存在依赖关系，不会被激活，所以job2不会执行。

