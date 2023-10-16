[TOC]

# Kotlin 协程的启动

## 添加依赖

```
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0'
```



## 调试协程

### 配置VM参数

设置VM参数：`-Dkotlinx.coroutines.debug`，在输出 `Thread.currentThread().name` 时会带上协程的相关信息。

```
格式：
<线程名> @<协程名>#<自增点唯一ID>
```

**例子：**

```kotlin
fun main() = runBlocking {
    launch(Dispatchers.IO) {
        println("A: ${Thread.currentThread().name}")
    }
    println("B: ${Thread.currentThread().name}")
    Thread.sleep(1000L)
}

//B: main @coroutine#1
//A: DefaultDispatcher-worker-1 @coroutine#2
```



### 断点调试

查看Kotlin版本：

![在这里插入图片描述](https://img-blog.csdnimg.cn/dce46895426646ef8436114bad0b9206.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_16,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/534b5a43cda342769960faca50b779f8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_18,color_FFFFFF,t_70,g_se,x_16)

打断点：勾选suspend、All，表示对协程生效

![在这里插入图片描述](https://img-blog.csdnimg.cn/463c6e8f8859424fa3c26294b2d8af28.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_9,color_FFFFFF,t_70,g_se,x_16)

可以查看Coroutines面板信息：当前协程名是"coroutine:1"，运行在“"DefaultDispatcher-worker-1"”线程上，当前状态是“RUNNING”。

![在这里插入图片描述](https://img-blog.csdnimg.cn/430db192f60f42ae98395d8b44e8ac4d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



## 启动协程

### GlobalScope.launch

```kotlin
fun main() {
    GlobalScope.launch {
        println("协程开始执行")	//1
        delay(1000L)
        println("hello world")	//2
    }
    println("abc")				//3
    Thread.sleep(2000L)
    println("执行完毕")			//4
}

//abc
//协程开始执行
//hello world
//执行完毕
```

**说明：**

一、

添加 `Thread.sleep(2000L) ` 是为了防止通过 launch 创建的协程还没有开始执行，主线程就执行完了，程序就已经结束了。

这是因为 `GlobalScope.launch` 所依赖的线程是守护线程，守护线程当主线程结束的时候它也会跟着销毁。

类似于：

```kotlin
fun main() {
    //              守护线程
    //                 ↓
    thread(isDaemon = true) {
        Thread.sleep(1000L)
        println("Hello World!")
    }
}
```

二、

协程是 Fire-and-forget 的模型，因此打印的信息顺序是：3 1 2 4。



### launch源码

```kotlin
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job {
    ...
}
```

` CoroutineScope.launch()` ：launch 是一个扩展函数，接受者类型是CoroutineScope，等价于它的成员方法。GlobalScope 是 Kotlin提供的一个 CoroutineScope 对象。

第一个参数 `CoroutineContext` ：表示协程的上下文，默认值是EmptyCoroutineContext。可以用来指定协程的相关信息。

第二个参数 `CoroutineStart ` ：表示协程的启动模式。

-   DEFAULT：默认值，立即执行。
-   LAZY：懒加载执行。

第三个参数 `suspend CoroutineScope.() -> Unit` ：协程执行的任务主体，函数类型的block，CoroutineScope的扩展函数。



### runBlocking

```kotlin
fun main() {
    runBlocking {
        println("协程开始执行")	//1
        delay(1000L)
        println("hello world")	//2
    }
    println("abc")				//3
    Thread.sleep(2000L)
    println("执行完毕")			//4
}

//协程开始执行
//hello world
//abc
//执行完毕

```

说明：runBlocking 启动的协程会阻塞当前线程的执行，因此打印的顺序变成了：1 2 3 4。

**案例二**

```kotlin
fun main() {
    runBlocking {
        println("第一个协程：${Thread.currentThread().name}")
        delay(1000L)
        println("hello first")
    }
    runBlocking {
        println("第二个协程：${Thread.currentThread().name}")
        delay(1000L)
        println("hello second")
    }
    runBlocking {
        println("第三个协程：${Thread.currentThread().name}")
        delay(1000L)
        println("hello third")
    }
    println("end")
}

//第一个协程：main @coroutine#1
//hello first
//第二个协程：main @coroutine#2
//hello second
//第三个协程：main @coroutine#3
//hello third
//end
```

说明：runBlocking 启动的协程会阻塞当前线程的执行，因此打印会依次执行。请不要在生产环境当中使用 runBlocking。

**返回值**

```kotlin
fun main() {
    val result = runBlocking {
        delay(1000L)
        //可以省略 return@runBlocking
        return@runBlocking "hello world"
    }
    println("结果：${result}")
}

//结果：hello world
```



### async-await

使用 `async ` 启动协程后不会阻塞当前的执行流程，`await()`函数可以接收返回值，接收过程会执行“挂起”和“恢复”。


```kotlin
fun main() = runBlocking {
    println("runBlocking: ${Thread.currentThread().name}")  

    val deferred: Deferred<String> = async {
        println("async: ${Thread.currentThread().name}")
        delay(1000L)
        return@async "hello world"
    }
    
    println("async之后: ${Thread.currentThread().name}")
    
    val result = deferred.await()
    println("result: $result")
}

//runBlocking: main @coroutine#1
//async之后: main @coroutine#1
//async: main @coroutine#2
//result: hello world
```

### async优化并发

```kotlin
//不使用async：
fun main() = runBlocking {
    suspend fun getName(): String {
        delay(1000L)
        return "小明"
    }

    suspend fun getAge(): Int {
        delay(2000L)
        return 18
    }

    suspend fun getAddress(): String {
        delay(3000L)
        return "北京市"
    }

    val results = mutableListOf<Any>()
    val time = measureTimeMillis {
        results.add(getName())
        results.add(getAge())
        results.add(getAddress())
    }
    println("耗时：$time")
    println(results)
}

//耗时：6009
//[小明, 18, 北京市]
```

```kotlin
//使用async：
fun main() = runBlocking {
    suspend fun getName(): String {
        delay(1000L)
        return "小明"
    }

    suspend fun getAge(): Int {
        delay(2000L)
        return 18
    }

    suspend fun getAddress(): String {
        delay(3000L)
        return "北京市"
    }

    var results = listOf<Any>()
    val time = measureTimeMillis {
        val result1 = async { getName() }
        val result2 = async { getAge() }
        val result3 = async { getAddress() }
        results = listOf<Any>(result1.await(), result2.await(), result3.await())
    }
    println("耗时：$time")
    println(results)
}

//耗时：3024
//[小明, 18, 北京市]
```



## launch与async区别

**源码区别：**

```kotlin
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit // 不同点1
): Job {} // 不同点2

public fun <T> CoroutineScope.async(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> T // 不同点1
): Deferred<T> {} // 不同点2
```

- launch 中的 block 的函数类型的返回值是 Unit，而 async 中的 block 的返回值是泛型T。
- launch函数的返回值是Job类型，async函数的返回值是Deferred类型。
- launch 就像射箭，async 就像钓鱼。

| 启动方式    | 是否阻塞 | 是否返回结果 | 应用场景           |
| ----------- | -------- | ------------ | ------------------ |
| launch      | 否       | 否           | Fire-and-forget    |
| runBlocking | 是       | 是           | 测试环境           |
| async-await | 否       | 是           | 获取协程执行的结果 |

