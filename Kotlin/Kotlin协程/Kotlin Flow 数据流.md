[TOC]


# Kotlin Flow 数据流

## 概述

-   Flow 是冷数据流，只有调用终止操作费后，Flow才会开始工作；并且Flow具有惰性，每次只处理一条数据。
-   Channel 是热数据流，不管有没有接收方，发送方都会工作。

Flow主要分三个部分：上游、中间操作、下游：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6950e7c315aa4c3abd2d6e605e4e2b13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_15,color_FFFFFF,t_70,g_se,x_16)



## 创建Flow

-   flow { }：高阶函数，适合未知数据集。
-   flowOf()：适合已知具体的数据。

```kotlin
// 方式一
flow {
    emit(1)
    emit(2)
    emit(3)
}

// 方式二
flowOf(1, 2, 3)

// 方式三
list.asFlow()
```



## 中间操作符

### filter & map & take

这些操作符都执行顺序与它们的位置密切相关，最终结果也会受位置变化的影响。

-   filter()：过滤指定条件的数据。
-   map()：数据转换。
-   take()：发送前几个数据。

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        emit(3)
        emit(4)
        emit(5)
    }.filter { it > 2 }
        .map { it * 100 }
        .take(2)
        .collect {
            println("collect: $it")
        }
}

/*
输出信息：
collect: 300
collect: 400
 */
```



### 监听生命周期

onStart() 和 onCompletion() 的执行顺序和它的位置无关。

-   onStart()：Flow被启动后，会被回调。
-   onCompletion()：Flow数据流执行完毕后会被回调，取消或发生异常时会携带异常信息，以下三种情况都会被调用：
    -   Flow正常执行完毕
    -   Flow出现异常
    -   Flow被取消

```kotlin
fun main() = runBlocking {
    flowOf(1, 2, 3, 4, 5)
        .filter { it > 2 }
        .map { it * 100 }
        .take(2)
        .onStart { println("onStart") }
        .onCompletion { println("onCompletion") }
        .collect {
            println("collect: $it")
        }

}

/*
输出信息：
onStart
collect: 300
collect: 400
onCompletion
 */
```

```kotlin
fun main() = runBlocking {
    launch {
        flow {
            emit(1)
            emit(2)
            emit(3)
        }.onCompletion { println("onCompletion: $it") }
        .collect {
            println("collect: $it")
            cancel() //取消协程
            println("cancel")
        }
    }
    delay(100L)
}
/*
输出信息：
collect: 1
cancel
onCompletion: kotlinx.coroutines.JobCancellationException
 */
```

```kotlin
fun main() = runBlocking {
    flowOf(4, 5, 6)
        .onCompletion { println("onCompletion: $it") }
        .collect {
            println("collect: $it")
            throw IllegalAccessException() //抛出异常
        }
}
/*
输出信息：
collect: 4
onCompletion: java.lang.IllegalAccessException
Exception in thread "main" java.lang.IllegalAccessException
 */
```



### 异常处理

-   catch 操作符可以捕获它上游的异常，作用域仅限于上游。
-   需要捕获下游的异常可以使用 `try-catch`，把 collect{} 当中可能出现问题的代码包裹起来。 

**catch**

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        throw IllegalArgumentException()
        emit(3)
    }.map { it * 100 }
        .catch { println("catch: $it") }
        .collect {
            println("collect: $it")
        }
}
/*
输出信息：
collect: 100
collect: 200
catch: java.lang.IllegalArgumentException
 */
```

**try-catch**

```kotlin
fun main() = runBlocking {
    flowOf(1, 2, 3)
        .map { it * 100 }
        .collect {
            try {
                println("collect: $it")
                throw IllegalArgumentException()
            } catch (e: Exception) {
                println("catch: $e")
            }
        }
}

/*
输出信息：
collect: 100
catch: java.lang.IllegalArgumentException
collect: 200
catch: java.lang.IllegalArgumentException
collect: 300
catch: java.lang.IllegalArgumentException
 */
```



### 线程切换

-   `flowOn`操作符可以指定它的上游的线程池。
-   `widthContext{ }`可以操作`flowOn`下游的线程池。
-   `launchIn`其实是一个下游操作符，可以指定Flow数据流的线程池，需要借助`onEach`操作费实现类似`collect`的功能。

#### flowOn

```kotlin
fun main() = runBlocking {
    flow {
        logX("send: 1")
        emit(1)
    }.map {
        logX("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .collect {
            logX("collect: $it")
        }
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1
Thread:DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1
Thread:DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 100
Thread:main @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：flowOn 操作符的上游代码运行在 DefaultDispatcher 线程池中，它的下游代码运行在 main 线程中。

#### withContext

如果需要指定 collect 中线程可以使用 withContext{}。

```kotlin
val mySingleDispatcher: ExecutorCoroutineDispatcher = Executors.newSingleThreadExecutor {
    Thread(it, "我的单线程").apply { isDaemon = true }
}.asCoroutineDispatcher()

fun main() = runBlocking {
    flow {
        logX("send: 1")
        emit(1)
    }.map {
        logX("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .collect {
            withContext(mySingleDispatcher) {
                logX("collect: $it")
            }
        }
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1
Thread:DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1
Thread:DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 100
Thread:我的单线程 @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：collect 中代码运行在 mySingleDispatcher 线程池中。

#### launchIn

指定 Flow 数据流的线程，需要配合 onEach 操作符使用。

```kotlin
val mySingleDispatcher: ExecutorCoroutineDispatcher = Executors.newSingleThreadExecutor {
    Thread(it, "我的单线程").apply { isDaemon = true }
}.asCoroutineDispatcher()

fun main() = runBlocking {
    val scope = CoroutineScope(mySingleDispatcher)
    flow {
        logX("send: 1")
        emit(1)
    }.map {
        logX("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .onEach { logX("onEach: $it") }
        .launchIn(scope)
    delay(100)
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1
Thread:DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1
Thread:DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
onEach: 100
Thread:我的单线程 @coroutine#2
└──────────────────────────────────────────────────
 */
```

**launchIn源码：**

```kotlin
public fun <T> Flow<T>.launchIn(scope: CoroutineScope): Job = scope.launch {
    collect() // tail-call
}
```

**等价于下面代码：**

```kotlin
fun main() = runBlocking {
    val scope = CoroutineScope(mySingleDispatcher)
    
    val flow = flow {
        logX("send: 1")
        emit(1)
    }.map {
        logX("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
    .onEach { logX("onEach: $it") }

    scope.launch { // 注意这里
        flow.collect() 
    }
    
    delay(100)
}
```



## 下游终止操作符

终止操作符的意思就是终止整个 Flow 流程的操作符 ，如：first() / single() / fold{} / reduce{} / collect{} / toList() 。

### Flow与List互相转换

Flow API 与集合 API 存在很多共性。如：listOf 创建 List，flowOf 创建 Flow。遍历 List 使用 forEach，遍历 Flow 使用 collect。

-   `Flow#toList() `扩展函数可以将Flow转List。
-   `List#asFlow()` 扩展函数可以将List转Flow。

```kotlin
fun main() = runBlocking {
    //Flow 转List
    flowOf(1, 2, 3, 4, 5)
        .toList()
        .filter { it > 2 }
        .map { it * 100 }
        .take(2)
        .forEach { println(it) }

    //List 转 Flow
    listOf(1, 2, 3, 4, 5)
        .asFlow()
        .filter { it > 2 }
        .map { it * 100 }
        .take(2)
        .collect { println(it) }
}

/*
输出信息：
300
400
300
400
 */
```



## Flow 是冷流

Channel 是热流，Flow 是冷流。这是因为 Channel 之所以被认为是“热”的原因，是因为不管有没有接收方，发送方都会工作。那么对应的，Flow 被认为是“冷”的原因，就是因为只有调用终止操作符之后，Flow 才会开始工作。 

```kotlin
fun main() = runBlocking {
    launch {
        // 冷流
        flow {
            (1..3).forEach {
                println("emit: $it")
                emit(it)
            }
        }
    }

    launch {
        // 热流
        produce {
            (1..3).forEach {
                println("send: $it")
                send(it)
            }
        }
    }

    println("end")
}

/*
输出信息：
end
send: 1
// Flow代码没有执行
 */
```





## 模拟网络请求

```kotlin
fun main() = runBlocking {
    fun loadData() = flow {
        repeat(3) {
            delay(100L)
            emit(it)
            log("send: $it")
        }
    }

    fun updateUI(it: Int) {}

    fun showLoading() {
        println("showLoading")
    }

    fun hideLoading() {
        println("hideLoading")
    }

    //模拟UI线程
    val uiScope = CoroutineScope(mySingleDispatcher)

    loadData()
        .onStart { showLoading() }
        .map { it * 100 }
        .flowOn(Dispatchers.IO)
        .catch { throwable ->
            println("catch: $throwable")
            emit(-1)
        }
        .onEach { updateUI(it) }
        .onCompletion { hideLoading() }
        .launchIn(uiScope)

    delay(1000L)
}
```


