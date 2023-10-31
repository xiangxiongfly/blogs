[TOC]

# Kotlin 协程的并发问题

## 协程和并发

```kotlin
fun main() = runBlocking {
    var i = 0
    launch(Dispatchers.Default) {
        repeat(1000) {
            i++
        }
    }
    delay(1000L)
    println("i: $i")
}

/*
输出信息：
i: 1000
 */
```

说明：在 Default 线程池中创建一个协程，然后对变量 i 进行1000次自增操作，因为这些自增操作都在同一协程中，因此不会发生并发同步问题。



## 协程并发问题

```kotlin
fun main() = runBlocking {
    var i = 0
    val jobs = mutableListOf<Job>()
    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                i++
            }
        }
        jobs.add(job)
    }
    jobs.joinAll()
    println("i: $i")
}

/*
输出信息：
i: 9310
 */
```

说明：创建了10个协程，每个协程都在 Default 线程池中，每个协程对变量 i 进行1000次自增操作，但是这10个协程可能运行在不同的线程上，因此会出现并发问题，结果大概率不是10000。



## 使用 Java 方式解决并发问题

Kotlin 协程是基于 JVM 的，因此可以使用 synchronized、Atomic、Lock等同步手段。在 Java 中最简单的同步方式是 synchronized，在 kotlin 中可以使用 `@Synchronized` 注解修饰函数，使用 `synchronized(){}` 实现同步代码快。

```kotlin
fun main() = runBlocking {
    var i = 0
    val lock = Any() //锁对象
    val jobs = mutableListOf<Job>()

    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                synchronized(lock) {
                    i++
                }
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    println("i: $i")
}

/*
输出信息：
i: 10000
 */
```

```kotlin
fun main() = runBlocking {
    var i = 0
    val jobs = mutableListOf<Job>()

    @Synchronized
    fun add() {
        i++
    }

    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                add()
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    println("i: $i")
}

/*
输出信息：
i: 10000
 */
```

### synchronized 问题

synchronized 是线程模型下的产物，虽然 Kotlin 协程是基于 Java 线程的，但是它已经脱离了 Java 原本的范畴，因此在协程中使用会存在一些问题。

```kotlin
fun main() = runBlocking {
    var i = 0
    val lock = Any() //锁对象
    val jobs = mutableListOf<Job>()

    suspend fun preload() {}

    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                synchronized(lock) {
                    preload() //编译器报错
                    i++
                }
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    println("i: $i")
}
```

说明：在  `synchronized(){}`  中调用挂起函数，编译器会报错，这是因为挂起函数会被翻译为 Continuation 的异步函数，造成 synchronized 代码块无法正确处理同步。



## 使用 Kotlin 方式解决并发问题

### 单线程并发

在 Java 中，并发需要用到多线程，而在 Kotlin 中，可以使用单线程实现协程并发。

**场景一：**

```kotlin
suspend fun getResult1(): String {
    logX("getResult1")
    delay(1000L)
    return "result1"
}

suspend fun getResult2(): String {
    logX("getResult2")
    delay(1000L)
    return "result2"
}

suspend fun getResult3(): String {
    logX("getResult3")
    delay(1000L)
    return "result3"
}

fun main() = runBlocking {
    val results: List<String>
    val time = measureTimeMillis {
        val result1 = async { getResult1() }
        val result2 = async { getResult2() }
        val result3 = async { getResult3() }
        results = listOf(result1.await(), result2.await(), result3.await())
    }
    println("耗时：$time")
    println(results)
}

/*
输出信息：
┌──────────────────────────────────────────────────
getResult1
Thread:main @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
getResult2
Thread:main @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
getResult3
Thread:main @coroutine#4
└──────────────────────────────────────────────────
耗时：1036
[result1, result2, result3]
 */
```

说明：执行了3个协程，根据打印信息，这3个协程都运行在 main 线程中，总耗时1000毫秒。

**场景二：**

```kotlin
val mySingleDispatcher: ExecutorCoroutineDispatcher = Executors.newSingleThreadExecutor {
    Thread(it, "我的单线程").apply { isDaemon = true }
}.asCoroutineDispatcher()

fun main() = runBlocking {
    var i = 0
    val jobs = mutableListOf<Job>()
    repeat(10) {
        val job = launch(mySingleDispatcher) {
            repeat(1000) {
                i++
            }
        }
        jobs.add(job)
    }
    jobs.joinAll()
    println("i: $i")
}

/*
输出信息：
i: 10000
 */
```

说明：启动了10个协程，都执行在 mySingleDispatcher 线程中，因此不用考虑并发同步问题。

### Mutex 同步锁

在 Java 中，有 Lock 之类的同步锁，但是 Java 的锁是阻塞式的，会影响协程的非阻塞式特性，所以在 Kotlin 协程中，不推荐使用 Java 中的同步锁。

Kotlin 官方提供了非阻塞式的锁：Mutex。

**Mutex源码：**

```kotlin
public interface Mutex {
 
    public val isLocked: Boolean

    //     挂起函数
    //        ↓
    public suspend fun lock(owner: Any? = null)

    public fun unlock(owner: Any? = null)
}
```

Mutex 是一个接口，lock() 方法是一个挂起函数，支持挂起和恢复，这是一个非阻塞式同步锁。

**使用：**

```kotlin
fun main() = runBlocking {
    val mutex = Mutex()
    var i = 0
    val jobs = mutableListOf<Job>()
    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                try {
                    mutex.lock()
                    i++
                } catch (e: Exception) {
                    println(e)
                } finally {
                    mutex.unlock()
                }
            }
        }
        jobs.add(job)
    }
    jobs.joinAll()
    println("i: $i")
}

/*
输出信息：
i: 10000
 */
```

### mutex.withLock{}

withLock{} 是一个扩展函数。

**withLock源码：**

```kotlin
public suspend inline fun <T> Mutex.withLock(owner: Any? = null, action: () -> T): T {
    lock(owner)
    try {
        return action()
    } finally {
        unlock(owner)
    }
}
```

**使用：**

```kotlin
fun main() = runBlocking {
    val mutex = Mutex()
    var i = 0
    val jobs = mutableListOf<Job>()
    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                mutex.withLock {
                    i++
                }
            }
        }
        jobs.add(job)
    }
    jobs.joinAll()
    println("i: $i")
}
```

### Actor

Actor 是一个并发同步模型，本质是基于 Channel 管道消息实现的。

```kotlin
sealed class Msg {
    object AddMsg : Msg()
    class ResultMsg(val result: CompletableDeferred<Int>) : Msg()
}

fun main() = runBlocking {

    suspend fun addActor() = actor<Msg> {
        var count = 0;
        for (msg in channel) {
            when (msg) {
                is Msg.AddMsg -> count++
                is Msg.ResultMsg -> msg.result.complete(count)
            }
        }
    }

    val actor = addActor()
    val jobs = mutableListOf<Job>()

    repeat(10) {
        val job = launch(Dispatchers.Default) {
            repeat(1000) {
                actor.send(Msg.AddMsg)
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    val deferred = CompletableDeferred<Int>()
    actor.send(Msg.ResultMsg(deferred))

    val result = deferred.await()
    actor.close()

    println("i: $result")
}

/*
输出信息：
i: 10000
 */
```

说明：定义的 addActor() 挂起函数，它其实是调用了 actor() 高阶函数，返回值类型是 SendChannel。Actor 本质是 Channel 的简单封装。在 actor{} 外部，发送了10000次 AddMsg 消息，最后发送一次 ResultMsg。获取计算结果。

在这个案例中，执行了10个协程虽然是多线程并发执行的，但是发送消息是借助管道串行发送的，因此保证了并发安全。

### 避免共享可变状态

```kotlin
fun main() = runBlocking {
    val deferreds = mutableListOf<Deferred<Int>>()

    repeat(10) {
        val deferred = async(Dispatchers.Default) {
            var i = 0
            repeat(1000) {
                i++
            }
            return@async i
        }
        deferreds.add(deferred)
    }

    var result = 0
    deferreds.forEach {
        result += it.await()
    }

    println("i: $result")
}

/*
输出信息：
i: 10000
 */
```

说明：执行了10个协程，每个协程都有一个局部变量 i，最后将这10个协程的结果汇总在一块，最后累加在一起 。

**函数式风格：**

```kotlin
fun main() = runBlocking {
    val result = (1..10).map {
        async(Dispatchers.Default) {
            var i = 0
            repeat(1000) {
                i++
            }
            return@async i
        }
    }.awaitAll()
        .sum()

    println("i: $result")
}

/*
输出信息：
i: 10000
 */
```

