[TOC]


# Kotlin Flow 数据流

## 概述

-   Flow 是冷数据流，只有调用终止操作符后，Flow才会开始工作；并且Flow具有惰性，每次只处理一条数据。
-   Channel 是热数据流，不管有没有接收方，发送方都会工作。

Flow主要分三个部分：上游、中间操作、下游：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6950e7c315aa4c3abd2d6e605e4e2b13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_15,color_FFFFFF,t_70,g_se,x_16)

[Flow交互网站](https://flowmarbles.com/)



## 创建Flow

-   flow { }：高阶函数，适合未知数据集。
-   flowOf()：适合已知具体的数据。
-   asFlow()：适合迭代类型。

```kotlin
// 方式一
flow {
    emit(1)
    emit(2)
    emit(3)
}.collect {
    println(it)
}
```

```kotlin
// 方式二
flowOf(1, 2, 3)
    .collect {
        println(it)
    }
```

```kotlin
// 方式三
(1..3).asFlow()
    .collect {
        println(it)
    }
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



### 合并

#### zip

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d0cb0baebd884664b0ea275ee95ad579.png)

- 合并两个 Flow 里的数据并返回一个新值。
- 当两个 Flow 的长度不一样时，以短的为基准。

```kotlin
fun main() = runBlocking {
    val f1 = (1..5).asFlow()
    val f2 = flowOf("A", "B", "c")
    f1.zip(f2) { a, b -> "$a - $b" }
        .collect {
            println(it)
        }
}

/*
输出信息：
1 - A
2 - B
3 - c
*/
```

#### combine

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/52be0431499f4f4193cbd283b64b0813.png)

- 组合两个 Flow，将每次发射的数据组合在一起。
- 当两个 Flow 的长度不一样时，以长的为基准。

```kotlin
fun main() = runBlocking {
    val f1 = (1..5).asFlow().onEach { delay(1000L) }
    val f2 = flowOf("A", "B", "C").onEach { delay(2000L) }
    f1.combine(f2) { a, b -> "$a - $b" }
        .collect {
            println(it)
        }
}

/*
输出信息：
1 - A
2 - A
3 - A
3 - B
4 - B
5 - B
5 - C
*/
```



### 叠加

#### reduce

```kotlin
fun main() = runBlocking {
    val result = (1..5).asFlow()
    	.reduce { a, b -> a + b }
    println(result)
}

/*
输出信息：
15
*/
```



### 展平操作

#### flatMapConcat

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1c39e66eda6c46b699bc3e3d157dbc65.png)

串行执行，m 个元素的流 与 n 个元素的流 连接后 , 元素个数为 m x n 个 。

```kotlin
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    (1..3).asFlow()
        .onEach { delay(100L) }
        .flatMapConcat {
            flow {
                emit("start $it")
                delay(500L)
                emit("end $it")
            }
        }
        .collect {
            println("${it} 耗时：${System.currentTimeMillis() - startTime}")
        }
}

/*
输出信息：
start 1 耗时：133
end 1 耗时：647
start 2 耗时：759
end 2 耗时：1264
start 3 耗时：1376
end 3 耗时：1886
*/
```
**模拟网络串行请求：**

```kotlin
fun main() = runBlocking {
    val f1 = flow {
        delay(1000L)
        emit("缓存")
    }
    val f2 = flow {
        delay(5000L)
        emit("网络")
    }

    val startTime = System.currentTimeMillis()
    flowOf(f1, f2)
        .flatMapConcat { it }
        .collect {
            println(it)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
}

/*
输出信息：
缓存
耗时：1024
网络
耗时：6033
*/
```

#### flatMapMerge

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/14e9c8bffb56464da811fdab097742fd.png)

并行执行，m 个元素的流 与 n 个元素的流 合并后 , 元素个数为 n x m 个 。

```kotlin
fun main() = runBlocking {
    (1..3).asFlow()
        .onEach { delay(100L) }
        .flatMapMerge {
            flow {
                emit("start $it")
                delay(500L)
                emit("end $it")
            }
        }
        .collect {
            println(it)
        }
}

/*
输出信息：
start 1
start 2
start 3
end 1
end 2
end 3
*/
```
**模拟网络并行请求：**

```kotlin
fun main() = runBlocking {
    val f1 = flow {
        delay(1000L)
        emit("缓存")
    }
    val f2 = flow {
        delay(5000L)
        emit("网络")
    }

    val startTime = System.currentTimeMillis()
    flowOf(f1, f2)
        .flatMapMerge { it }
        .collect {
            println(it)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
}

/*
输出信息：
缓存
耗时：1041
网络
耗时：5053
*/
```

#### flatMapLatest

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/062bf23f8dff4fd9806b8a24c3e306f0.png)

前面的看时间间隔进行结合 , 中间的可能跳过某些元素 , 不要中间值 , 只重视最新的数据 。

```kotlin
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    (1..3).asFlow()
        .onEach { delay(100L) }
        .flatMapLatest  {
            flow {
                emit("start $it")
                delay(500L)
                emit("end $it")
            }
        }
        .collect {
            println("${it} 耗时：${System.currentTimeMillis() - startTime}")
        }
}

/*
输出信息：
start 1 耗时：146
start 2 耗时：251
start 3 耗时：360
end 3 耗时：865
*/
```



### 防抖和节流

#### debounce

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ee2e972225314c62a5d94bd6f5a8902e.png)

debounce 操作符会等待指定的时间间隔，如果在这个时间间隔内没有新的元素发出，那么它就会发出最后一个元素。如果在这个时间间隔内有新的元素发出，那么它就会重置等待时间。

debounce 操作符适用于处理用户的输入事件，例如搜索框的输入，我们通常希望用户停止输入一段时间后再进行搜索，而不是每输入一个字符就进行一次搜索。 

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        delay(90)
        emit(2)
        delay(90)
        emit(3)
        delay(1010)
        emit(4)
        delay(1010)
        emit(5)
    }.debounce(1000)
        .collect {
            println(it)
        }
}

/*
输出信息：
3
4
5
*/
```

#### sample

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8b2d7dcb63d949dcbd494ff235dee37b.png)

sample 操作符会在指定的时间间隔后发出最后一个元素，不管在这个时间间隔内是否有新的元素发出。这个操作符常常用于限制流的发出频率。 

```kotlin
fun main() = runBlocking {
    (1..10).asFlow()
        .onEach { delay(110) }
        .sample(200)
        .collect {
            println(it)
        }
}

/*
输出信息：
1
3
5
7
9
*/
```

**总结：**

debounce 是基于最后一个元素的发出时间进行等待，而 sample 是基于固定的时间间隔进行采样。 



### 背压

#### buffer

如果没有 buffer，会先执行 emit 然后再执行 collect，这会导致整个流程变慢。

而如果使用 buffer，buffer 操作符允许 emit 和 collect 同时进行，从而提高了整体的处理速度。发射的数据会进入缓冲区，在缓冲区满了下游开始接收数据。

**不使用buffer：**

```kotlin
fun main() = runBlocking {
    val time = measureTimeMillis {
        flow {
            for (i in 1..3) {
                delay(1000)
                println("emit: $i")
                emit(i)
            }
        }.collect {
            delay(2000)
            println("collect: $it")
        }
    }
    println("耗时：$time")
}

/*
输出信息：
emit: 1
collect: 1
emit: 2
collect: 2
emit: 3
collect: 3
耗时：9069
*/
```

**使用buffer：**

```kotlin
fun main() = runBlocking {
    val time = measureTimeMillis {
        flow {
            for (i in 1..3) {
                delay(1000)
                println("emit: $i")
                emit(i)
            }
        }.buffer(3)
            .collect {
                delay(2000)
                println("collect: $it")
            }
    }
    println("耗时：$time")
}

/*
输出信息：
emit: 1
emit: 2
emit: 3
collect: 1
collect: 2
collect: 3
耗时：7068
*/
```

#### conflate

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/73b6701dff2c4714bbc3255af8468042.png)

仅保留最新的值，无论上游发射多少数据，下游只会接收最新值。

```kotlin
fun main() = runBlocking<Unit> {
    val time = measureTimeMillis {
        flow {
            for (i in 1..10) {
                delay(100)
                emit(i)
            }
        }.conflate()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    println("耗时：$time")
}

/*
输出信息：
1
3
6
9
10
耗时：1672
*/
```



## 下游终止操作符

终止操作符的意思就是终止整个 Flow 流程的操作符 ，如：first() / single() / fold{} / reduce{} / collect{} / toList() 。

### collectLast

如果上游发射数据太快了，可以忽略旧的数据。

```kotlin
fun main() = runBlocking {
    (1..100).asFlow()
        .onEach { delay(10) }
        .collectLatest {
            println("collect1: $it")
            delay(100)
            println("collect2: $it")
        }
}

/*
输出信息：
collect1: 1
collect1: 2
....
collect1: 98
collect1: 99
collect1: 100
collect2: 100
*/
```

### toList & asFlow

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



## Flow的取消

Flow 是依赖协程的，因此可以通过取消协程从而取消 Flow 的执行。

```kotlin
fun main() = runBlocking {
    val job = launch {
        flowOf(1, 2, 3, 4, 5)
        .onEach { delay(1000L) }
        .collect {
            println(it)
        }
    }
    delay(3000L)
    job.cancel()
}

/*
输出信息：
1
2
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


