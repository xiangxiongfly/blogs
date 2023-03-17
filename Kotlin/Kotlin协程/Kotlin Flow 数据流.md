[TOC]


# Kotlin Flow 数据流

## 概述

-   Flow是冷数据流，只有调用终止操作费后，Flow才会开始工作；并且Flow具有惰性，每次只处理一条数据。
-   Channel是热数据流，不管有没有接收方，发送方都会工作。

Flow主要分三个部分：上游、中间操作、下游：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6950e7c315aa4c3abd2d6e605e4e2b13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_15,color_FFFFFF,t_70,g_se,x_16)



## 创建Flow

-   `flow { }`：适合未知数据集。
-   `flowOf()`：适合已知具体的数据。

```kotlin
flow {
    emit(1)
    emit(2)
    emit(3)
}

flowOf(1, 2, 3)
```



## 中间操作符

### filter & map & take

-   `filter()`：过滤指定条件的数据。
-   `map()`：数据转换。
-   `take()`：发送前几个数据。

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

-   `onStart()`：Flow被启动后，会被回调。
-   `onCompletion()`：Flow数据流执行完毕后会被回调，以下三种：
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



### 异常处理

-   `catch`操作符可以捕获它上游的异常。
-   需要捕获下游的异常可以使用`try-catch`。

#### catch

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        throw IllegalArgumentException()
        emit(3)
        emit(4)
    }.map { it * 100 }
        .catch { println("catch: $it") }
        .onStart { println("onStart") }
        .onCompletion { println("onCompletion") }
        .collect {
            println("collect: $it")
        }
}

/*
输出信息：
onStart
collect: 100
collect: 200
catch: java.lang.IllegalArgumentException
onCompletion
 */
```

#### try-catch

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        emit(3)
        emit(4)
    }.map { it * 100 }
        .onStart { println("onStart") }
        .onCompletion { println("onCompletion") }
        .collect {
            try {
                println("collect: $it")
                throw IllegalArgumentException()
            } catch (e: Exception) {
                println("catch: $e")
            }
        }
}
```



### 线程切换

-   `flowOn`操作符可以指定它的上游的线程池。
-   `widthContext{ }`可以操作`flowOn`下游的线程池。
-   `launchIn`其实是一个下游操作符，可以指定Flow数据流的线程池，需要借助`onEach`操作费实现类似`collect`的功能。

#### flowOn

```kotlin
fun main() = runBlocking {
    flow {
        log("send: 1")
        emit(1)
        log("send: 2")
        emit(2)
        log("send: 3")
        emit(3)
    }.map {
        log("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .collect {
            log("collect: $it")
        }
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 2   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 2   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 3   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 3   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 100   Thread: main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 200   Thread: main @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 300   Thread: main @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：`flowOn`操作符的上游运行在DefaultDispatcher线程池中，它的下游依然运行在main线程中。

#### withContext

```kotlin
val mySingleDispatcher: ExecutorCoroutineDispatcher = Executors.newSingleThreadExecutor {
    Thread(it, "我的单线程").apply { isDaemon = true }
}.asCoroutineDispatcher()
```

```kotlin
fun main() = runBlocking {
    flow {
        log("send: 1")
        emit(1)
        log("send: 2")
        emit(2)
        log("send: 3")
        emit(3)
    }.map {
        log("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .collect {
            withContext(mySingleDispatcher) {
                log("collect: $it")
            }
        }
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 2   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 2   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 3   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 3   Thread: DefaultDispatcher-worker-1 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 100   Thread: 我的单线程 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 200   Thread: 我的单线程 @coroutine#1
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
collect: 300   Thread: 我的单线程 @coroutine#1
└──────────────────────────────────────────────────
 */
```

说明：`flowOn`的下游collect中代码运行在mySingleDispatcher线程池中。

#### launchIn

```kotlin
fun main() = runBlocking {
    val scope = CoroutineScope(mySingleDispatcher)
    flow {
        log("send: 1")
        emit(1)
        log("send: 2")
        emit(2)
        log("send: 3")
        emit(3)
    }.map {
        log("map: $it")
        it * 100
    }.flowOn(Dispatchers.IO)
        .onEach { log("onEach: $it") }
        .launchIn(scope)
   delay(100)
}

/*
输出信息：
┌──────────────────────────────────────────────────
send: 1   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 1   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 2   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 2   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
send: 3   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
map: 3   Thread: DefaultDispatcher-worker-1 @coroutine#3
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
onEach: 100   Thread: 我的单线程 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
onEach: 200   Thread: 我的单线程 @coroutine#2
└──────────────────────────────────────────────────
┌──────────────────────────────────────────────────
onEach: 300   Thread: 我的单线程 @coroutine#2
└──────────────────────────────────────────────────
 */
```



## 下游：终止操作符

终止操作符指终止整个Flow数据流的操作费，如`collect`、`toList`、`first`



## Flow与List互相转换

Flow与集合有很多类似之处。

-   `Flow#toList()`扩展函数可以将Flow转List。
-   `List#asFlow()`扩展函数可以将List转Flow。

```kotlin
fun main() = runBlocking {
    //Flow -> List
    flowOf(1, 2, 3, 4, 5)
        .toList()
        .filter { it > 2 }
        .map { it * 100 }
        .take(2)
        .forEach { println(it) }

    //List -> Flow
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


