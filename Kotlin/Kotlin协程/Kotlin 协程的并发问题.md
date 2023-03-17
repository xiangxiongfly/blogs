[TOC]

# Kotlin 协程的并发问题

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

    println("i = $i")
}
/*
输出信息：
i = 9703
 */
```

说明：创建了10个协程，每个协程对i进行1000次自增操作，正常情况下结果应该是10000，但是实际上大概率不会是10000。这是因为这10个协程分别运行在不同的线程中，出现了并发同步问题。



## 使用synchronized解决协程并发问题

Kotlin是基于JVM的，所以可以使用Java中的同步手段，如synchronized、Lock、Atomic等。

但是sychronized是线程模型下的，不支持协程中的挂起函数。

```kotlin
fun main() = runBlocking {
    val lock = Any()
    var i = 0
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

    println("i = $i")
}
/*
输出信息：
i = 10000
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

    println("i = $i")
}

/*
输出信息：
i = 10000
 */
```



## 使用单线程解决并发问题

```kotlin
fun main() = runBlocking {
    val mySingleDispatcher = Executors.newSingleThreadExecutor {
        Thread(it, "我的线程").apply { isDaemon = true }
    }.asCoroutineDispatcher()

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

    println("i = $i")
}

/*
输出信息：
i = 10000
 */
```

使用`launch(mySingleDispatcher)`后，所有的协程任务都运行在单线程`mySingleDispatcher`中，这样就没有并发问题了。



## 使用Mutex(协程同步锁)解决并发问题

在Java中，锁是阻塞式的，会大大影响协程的非阻塞式的特性，所以不推荐使用传统的同步锁。

在Kotlin协程中，可以使用Mutex非阻塞式锁。`Mutex#lock()`是一个挂起函数，这是实现非阻塞式同步锁的根本原因。

```kotlin
fun main() = runBlocking {
    val mutex = Mutex()
    var i = 0
    val jobs = mutableListOf<Job>()

    repeat(10) {
        val job = launch(mySingleDispatcher) {
            repeat(1000) {
                mutex.lock()
                try {
                    i++
                } finally {
                    mutex.unlock()
                }
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    println("i = $i")
}

/*
输出信息：
i = 10000
 */
```

### withLock

`withLock`扩展函数的本质，其实是在 finally{} 当中调用了 unlock()。

```kotlin
fun main() = runBlocking {
    val mutex = Mutex()
    var i = 0
    val jobs = mutableListOf<Job>()

    repeat(10) {
        val job = launch(mySingleDispatcher) {
            repeat(1000) {
                mutex.withLock {
                    i++
                }
            }
        }
        jobs.add(job)
    }

    jobs.joinAll()

    println("i = $i")
}

/*
输出信息：
i = 10000
 */
```



## 使用Actor并发同步模型

Actor是一个并发同步模型，本质是基于Channel管道消息实现的。

```kotlin
sealed class Msg {
    object AddMsg : Msg()
    class ResultMsg(val result: CompletableDeferred<Int>) : Msg()
}

fun main() = runBlocking {
    suspend fun addActor() = actor<Msg> {
        var i = 0
        for (msg in channel) {
            when (msg) {
                is Msg.AddMsg -> i++
                is Msg.ResultMsg -> msg.result.complete(i)
            }
        }
    }

    val actor = addActor()
    val jobs = mutableListOf<Job>()

    repeat(10) {
        val job = launch(mySingleDispatcher) {
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
    
    println("i = $result")
}

/*
输出信息：
i = 10000
 */
```



## 避免共享变量

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
    
    println("i = $result")
}

/*
输出信息：
i = 10000
 */
```



