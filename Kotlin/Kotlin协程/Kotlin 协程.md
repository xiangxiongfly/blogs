[TOC]

# 协程

## 概述

- 线程：线程一旦开始执行就不会暂停，直到任务结束，这个过程是持续的。线程之间是抢占式的调度。
- 协程：现场是通过主动挂起让出运行权来实现写作的。协程内部封装了线程池用于任务调度。

**特点**

- **轻量**：您可以在单个线程上运行多个协程，因为协程支持[挂起](https://kotlinlang.org/docs/reference/coroutines/basics.html)，不会使正在运行协程的线程阻塞。挂起比阻塞节省内存，且支持多个并行操作。
- **内存泄漏更少**：使用[结构化并发](https://kotlinlang.org/docs/reference/coroutines/basics.html#structured-concurrency)机制在一个作用域内执行多项操作。
- **内置取消支持**：[取消](https://kotlinlang.org/docs/reference/coroutines/cancellation-and-timeouts.html)操作会自动在运行中的整个协程层次结构内传播。
- **Jetpack 集成**：许多 Jetpack 库都包含提供全面协程支持的[扩展](https://developer.android.google.cn/kotlin/ktx)。某些库还提供自己的[协程作用域](https://developer.android.google.cn/topic/libraries/architecture/coroutines)，可供您用于结构化并发。



## 依赖库

```groovy
//Kotlin支持库
implementation "org.jetbrains.kotlin:kotlin-stdlib:1.4.32"

//协程核心库
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.2"
//协程Android支持库
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.2"
//协程Java8支持库
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-jdk8:1.4.3"

//ViewModelScope
implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.2.0"
//LifecycleScope
implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.2.0"
//LiveData
implementation "androidx.lifecycle:lifecycle-livedata-ktx:2.2.0"
```



## 启动协程

### 通用代码

```kotlin
fun date() = SimpleDateFormat("HH:mm:ss").format(System.currentTimeMillis())

fun log(msg: String) = println("${date()} - [${Thread.currentThread().name}]  $msg")
```



### GlobalScope.launch

- 开启一个全局协程，生命周期伴随着App。
- 非阻塞，不会阻塞当前线程。
- 一般不建议使用

```kotlin
fun main() {
    log("--start--")
    GlobalScope.launch {
        delay(1000L)
        log("hello GlobalScope")
    }
    log("--end--")
    Thread.sleep(10_000L)
}
```

```
17:01:55 - [main]  --start--
17:01:56 - [main]  --end--
17:01:57 - [DefaultDispatcher-worker-1]  hello GlobalScope
```



### runBlocking

- 开启一个顶级协程，并阻塞当前线程
- 存在性能问题，只推荐在测试中使用

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)
        log("hello runBlocking")
    }
    log("--end--")
}
```

```
17:04:12 - [main]  --start--
17:04:14 - [main]  hello runBlocking
17:04:14 - [main]  --end--
```



### CoroutineScope.launch

```kotlin
fun main() {
    log("--start--")
    CoroutineScope(Dispatchers.IO).launch {
        delay(1000L)
        log("hello 开启一个新协程")
    }
    log("--end--")
    Thread.sleep(10_000L)
}
```

```
17:08:49 - [main]  --start--
17:08:49 - [main]  --end--
17:08:50 - [DefaultDispatcher-worker-1]  hello 开启一个新协程
```



### launch

- 协程内部可以通过`launch`函数创建子协程，子协程是并发执行，只有当所有子协程执行完后才会关闭父协程
- 返回一个`Job`，但不会携带执行结果

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)
        log("开启父新协程")

        launch {
            delay(1000L)
            log("执行子协程A")
        }

        launch {
            delay(2000L)
            log("执行子协程B")
        }
    }
    log("--end--")
}
```

```
17:26:22 - [main]  --start--
17:26:23 - [main]  开启父新协程
17:26:24 - [main]  执行子协程A
17:26:25 - [main]  执行子协程B
17:26:25 - [main]  --end--
```



### 挂起函数

使用`suspend`关键字修饰的函数被称为挂起函数，挂起函数只能在协程体内或其他挂起函数内调用。



### async / await

- async开启子协程，返回一个`Deferred`（本质也是Job），并携带执行结果

- await会获取返回值，如果没有获取到返回值会阻塞当前协程

  

**launch与async区别**

- launch没有返回值
- async有返回值，同时会阻塞当前协程

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)
        log("开启父新协程")

        val value1 = async { getName() }
        val value2 = async { getAge() }

        log("姓名：${value1.await()}  年龄：${value2.await()} ")
    }
    log("--end--")
}

suspend fun getName(): String {
    delay(1000L)
    log("小明")
    return "小明"
}

suspend fun getAge(): Int {
    delay(3000L)
    log("18")
    return 18
}
```

```
10:57:45 - [main]  --start--
10:57:46 - [main]  开启父新协程
10:57:47 - [main]  小明
10:57:49 - [main]  18
10:57:49 - [main]  姓名：小明  年龄：18 
10:57:49 - [main]  --end--
```



## CoroutineContext协程上下文

- CoroutineContext 即协程上下文，里面主要元素：Job 、CoroutineDispatcher、CoroutineName
- 每一个元素都是一个唯一key



### 协程命名

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)
        log("开启父新协程")
        launch(CoroutineName("协程1号")) {
            val coroutineName = coroutineContext[CoroutineName]
            log("子协程 $coroutineName")
        }
    }
    log("--end--")
}
```

```
13:38:13 - [main]  --start--
13:38:14 - [main]  开启父新协程
13:38:14 - [main]  子协程 CoroutineName(协程1号)
13:38:14 - [main]  --end--
```



### 协程调度器 

- Dispatchers.Default：默认调度器，适合CPU密集型的任务，如：数据解析等
- Dispatchers.Main：在主线程中执行，如：UI操作
- Dispatchers.IO：在IO线程中执行，如：网络请求，数据库操作等
- Dispatchers.Unconfined：非限制的调度器，线程会受挂起函数的影响，本人不推荐使用

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)
        log("开启父新协程")

        CoroutineScope(Job() + Dispatchers.IO).launch {
            log("子协程处理耗时任务")
        }

    }
    log("--end--")
}
```

```
11:38:18 - [main]  --start--
11:38:19 - [main]  开启父新协程
11:38:19 - [DefaultDispatcher-worker-1]  子协程处理耗时任务
11:38:19 - [main]  --end--
```



#### withContext

用于切换调度器，将耗时任务放在异步子协程中处理

```kotlin
GlobalScope.launch(Dispatchers.Main) {
    val name = getName()
    log("姓名：$name")
    val age = getAge()
    log("年龄：$age")
}

suspend fun getName() = withContext(Dispatchers.IO) {
    delay(1000L)
    val name = "小明"
    log("模拟网络请求：获取小明")
    name
}

suspend fun getAge() = withContext(Dispatchers.IO) {
    delay(3000L)
    val age = 18
    log("模拟网络请求：获取18")
    age
}
```

```
17:53:51 - [DefaultDispatcher-worker-1]  模拟网络请求：获取小明
17:53:51 - [main]  姓名：小明
17:53:54 - [DefaultDispatcher-worker-3]  模拟网络请求：获取18
17:53:54 - [main]  年龄：18
```



### 协程启动模式

- CoroutineStart.DEFAUULT：默认值，协程创建后立即调度
- CoroutineStart.LAZY：懒启动，在执行start操作后才调度
- CoroutineStart.ATOMIC：协程创建后立即开始调度，第一个挂起点之前是不响应cancel操作
- CoroutineStart.UNDISPATCHED：第一额挂起点之前的操作在当前线程下执行



### 协程作用域

CoroutineScope表示协程作用域，协程内的代码运行的时间周期范围，如果超出指定的协程范围，协程会被取消执行。

launch、async都是CoroutineScope的扩展函数

#### Lifecycle

- 指定生命周期内运行协程
- 在`onDestroy`时取消协程

```
implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.3.0"
```



#### LiveData

- 可设置超时时间取消协程
- 限制指定活跃状态

```
implementation "androidx.lifecycle:lifecycle-livedata-ktx:2.2.0"
```





## CoroutineScope详细说明

### join()

与Thread里的join()类似，会先执行协程里的代码。

```kotlin
fun main() {
    runBlocking {
        log("runBlocking start")
        val job = launch(start = CoroutineStart.LAZY) {
            delay(2000L)
            log("launch end")
        }
        job.join()
        log("runBlocking end")
    }
}
```

```
14:58:56 [main]  runBlocking start
14:58:58 [main]  launch end
14:58:58 [main]  runBlocking end
```



### yield()

可以让当前协程暂时挂起执行其他协程。



### 取消协程

- cancel()：取消协程
- isActive：判断协程是否被取消

注：调用cancel()方法并不会立即取消协程的执行，而且标记当前协程状态为取消，类似于Thread中的interrupt()

```kotlin
coroutineScope.launch {
    var i = 0
    while (i < 100) {
        i++
        log("$i")
        delay(100L)
        if (i == 3) {
            cancel() //调用cancel(),协程并没有立即终止
        }
    }
}
```

```
[DefaultDispatcher-worker-1]  1
[DefaultDispatcher-worker-1]  2
[DefaultDispatcher-worker-1]  3
[DefaultDispatcher-worker-1]  4
```

**优化方案**

```kotlin
coroutineScope.launch {
    var i = 0
    while (i < 100) {
        //利用isActive进行判断
        if (!isActive) {
            break
        }
        
        i++
        log("$i")
        delay(100L)
        if (i == 3) {
            cancel()
        }
    }
}
```

```
[DefaultDispatcher-worker-1]  1
[DefaultDispatcher-worker-1]  2
[DefaultDispatcher-worker-1]  3
```



## 协程异常

### try-catch

对于可能产生异常的代码进行`try-catch`，这样就避免程序崩溃。

```kotlin
fun main() {
    log("--start--")
    runBlocking {
        delay(1000L)

        launch {
            log("子协程1")
            try {
                throw NullPointerException()
            } catch (e: Exception) {
            }
        }

        launch {
            delay(1000L)
            log("子协程2")
        }
    }
    log("--end--")
}
```

```
14:15:55 - [main]  --start--
14:15:56 - [main]  子协程
14:15:57 - [main]  子协程2
14:15:57 - [main]  --end--
```



### CoroutineExceptionHandler

`CoroutineExceptionHandler`可以捕获协程作用域内的异常，子协程发生异常会导致父协程取消执行，同时其他的后续子协程也会终止执行。

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        log("${coroutineContext[CoroutineName]} 处理异常：$throwable")
    }

    log("--start--")
    GlobalScope.launch(CoroutineName("父协程") + exceptionHandler) {
        delay(1000L)

        launch(CoroutineName("子协程1")) {
            log("执行子协程1的任务")
            throw NullPointerException()
        }

        launch(CoroutineName("子协程2")) {
            delay(1000L)
            log("执行子协程2的任务")
        }
    }
    log("--end--")
    Thread.sleep(5_000L)
}
```

```
14:46:15 - [main]  --start--
14:46:15 - [main]  --end--
14:46:16 - [DefaultDispatcher-worker-2]  执行子协程1的任务
14:46:16 - [DefaultDispatcher-worker-2]  CoroutineName(父协程) 处理异常：java.lang.NullPointerException
```



### SupervisorJob & supervisorScope

- SupervisorJob通过主从作用域，避免了子协程的异常导致其他子协程的执行
- supervisorScope底层使用的是SupervisorJob 

**supervisorScope使用：**

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        log("${coroutineContext[CoroutineName]} 处理异常：$throwable")
    }

    log("--start--")
    GlobalScope.launch(CoroutineName("父协程") + exceptionHandler) {
        delay(1000L)

        supervisorScope {
            launch(CoroutineName("子协程1")) {
                log("执行子协程1的任务")
                throw NullPointerException()
            }

            launch(CoroutineName("子协程2")) {
                log("执行子协程2的任务")
                throw IllegalArgumentException()
            }

            launch(CoroutineName("子协程3")) {
                delay(1000L)
                log("执行子协程3的任务")
            }
        }
    }
    log("--end--")
    Thread.sleep(5_000L)
}
```

```
20:46:39 - [main]  --start--
20:46:39 - [main]  --end--
20:46:40 - [DefaultDispatcher-worker-2]  执行子协程1的任务
20:46:40 - [DefaultDispatcher-worker-2]  CoroutineName(子协程1) 处理异常：java.lang.NullPointerException
20:46:40 - [DefaultDispatcher-worker-2]  执行子协程2的任务
20:46:40 - [DefaultDispatcher-worker-2]  CoroutineName(子协程2) 处理异常：java.lang.IllegalArgumentException
20:46:41 - [DefaultDispatcher-worker-1]  执行子协程3的任务
```

**SupervisorJob使用：**

```kotlin
fun main() {
    val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        log("${coroutineContext[CoroutineName]} 处理异常：$throwable")
    }

    log("--start--")
    val supervisorScope =
        CoroutineScope(CoroutineName("父协程") + SupervisorJob() + exceptionHandler)
    with(supervisorScope) {
        launch(CoroutineName("子协程1")) {
            log("执行子协程1的任务")
            throw NullPointerException()
        }

        launch(CoroutineName("子协程2")) {
            delay(1000L)
            log("执行子协程2的任务")
        }
    }
    log("--end--")
    Thread.sleep(5_000L)
}
```

```
15:22:30 - [main]  --start--
15:22:30 - [main]  --end--
15:22:30 - [DefaultDispatcher-worker-2]  执行子协程1的任务
15:22:30 - [DefaultDispatcher-worker-2]  CoroutineName(父协程) 处理异常：java.lang.NullPointerException
```



## 协程实际运用

### 串行执行

```kotlin
suspend fun getName(): String {
    delay(2000L)
    return "小白"
}

suspend fun getAge(): Int {
    delay(1000L)
    return 18
}

fun main() {
    CoroutineScope(CoroutineName("协程1") + Job() + Dispatchers.IO)
    .launch {
        log("开始执行")
        val name = getName()
        log("姓名：$name ")
        val age = getAge()
        log("年龄：$age")
        log("结束执行")
    }
    Thread.sleep(5_000L)
}
```

```
15:45:17 - [DefaultDispatcher-worker-1]  开始执行
15:45:19 - [DefaultDispatcher-worker-1]  姓名：小白 
15:45:20 - [DefaultDispatcher-worker-1]  年龄：18
15:45:20 - [DefaultDispatcher-worker-1]  结束执行
```



### 并行执行

```kotlin
fun main() {
    CoroutineScope(CoroutineName("协程1") + Job() + Dispatchers.IO)
        .launch {
            log("开始执行")
            launch {
                val name = getName()
                log("姓名：$name ")
            }
            launch {
                val age = getAge()
                log("年龄：$age")
            }
            log("结束执行")
        }
    Thread.sleep(5_000L)
}
```

```
15:51:56 - [DefaultDispatcher-worker-1]  开始执行
15:51:56 - [DefaultDispatcher-worker-1]  结束执行
15:51:57 - [DefaultDispatcher-worker-3]  年龄：18
15:51:58 - [DefaultDispatcher-worker-3]  姓名：小白 
```



### 并行执行并统一处理返回值

```kotlin
fun main() {
    CoroutineScope(CoroutineName("协程1") + Job() + Dispatchers.IO)
        .launch {
            log("开始执行")
            val value1 = async { getName() }
            val value2 = async { getAge() }
            log("姓名：${value1.await()} 年龄：${value2.await()}")
            log("结束执行")
        }
    Thread.sleep(5_000L)
}
```

```
15:58:02 - [DefaultDispatcher-worker-1]  开始执行
15:58:04 - [DefaultDispatcher-worker-2]  姓名：小白 年龄：18
15:58:04 - [DefaultDispatcher-worker-2]  结束执行
```



### 模拟网络请求

```kotlin
CoroutineScope(Job() + Dispatchers.IO)
    .launch {
        val image = getImage()
        withContext(Dispatchers.Main) {
            imageView.setImageResource(image)
        }	
    }
```

