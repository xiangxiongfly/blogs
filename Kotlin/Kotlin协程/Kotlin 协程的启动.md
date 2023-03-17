[TOC]

# Kotlin 协程的启动

## 添加依赖

```
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0'
```



## 调试协程

**设置VM参数**

设置VM参数：`-Dkotlinx.coroutines.debug`，可以在输出`Thread.currentThread().name`时带上协程的相关信息。

```
格式：
<线程名> @<协程名>#<自增点唯一ID>
```



**断点调试**

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
        println("协程开始执行")
        delay(1000L)
        println("协程执行完毕")
    }

    println("A")
    Thread.sleep(2000L) 
    println("B")
}

//A
//协程开始执行
//协程执行完毕
//B
```

添加`Thread.sleep(2000L) `是为了防止协程还没有开始执行，主线程就执行完了，程序就已经结束了。

这是因为`GlobalScope.launch`所依赖的线程是守护线程，主线程退出后也会跟随销毁。



### launch

```kotlin
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job {
    ...
}
```

` CoroutineScope.launch()`：launch其实是一个扩展函数，是CoroutineScope的成员方法。GlobalScope是Kotlin提供的一个CoroutineScope对象。

第一个参数`CoroutineContext`：表示协程的上下文，默认值是EmptyCoroutineContext。可以用来指定协程的相关信息。

第二个参数`CoroutineStart`：表示协程的启动模式。

-   DEFAULT：默认值，立即执行。
-   LAZY：懒加载执行。

第三个参数`suspend CoroutineScope.() -> Unit`：函数类型的block，协程执行的任务主体。



### runBlocking

使用`runBlocking`启动的协程会阻塞当前线程。

```kotlin
fun main() {
    runBlocking {
        println("协程开始执行")
        delay(1000L)
        println("协程执行完毕")
    }

    println("A")
    Thread.sleep(2000L) 
    println("B")
}

//协程开始执行
//协程执行完毕
//A
//B
```

注意：生产环境不要使用`runBlocking`。



### async-await

使用`async`创建的协程具有返回值。启动协程后不会阻塞当前的执行流程，`await()`函数可以接收返回值，接收过程会执行“挂起”和“恢复”。


```kotlin
fun main() {
    runBlocking {
        println("协程开始执行")
        val deferred: Deferred<String> = async {
            println("async start: ${Thread.currentThread().name}")
            delay(1000L)
            return@async "hello"
        }
        println("async end: ${Thread.currentThread().name}")
        val result = deferred.await()
        println("result: $result")
        println("协程执行完毕")
    }
}

//协程开始执行
//async end: main @coroutine#1
//async start: main @coroutine#2
//result: hello
//协程执行完毕
```



### launch与async区别

```kotlin
public fun <T> CoroutineScope.async(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> T
): Deferred<T> {
	...
}
```

`async`与`launch`相比，block参数前者的返回值类型是T，后者是Unit；函数的返回值前者是Deferred类型，后者是Job类型，Deferred继承自Job。

```kotlin
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

如果存在依赖关系，就直接用挂起函数串联；如果没有依赖关系，就可以用async并联。



## 总结

| 启动方式    | 是否阻塞 | 是否返回结果 | 应用场景           |
| ----------- | -------- | ------------ | ------------------ |
| launch      | 否       | 否           | Fire-and-forget    |
| runBlocking | 是       | 是           | 测试环境           |
| async-await | 否       | 是           | 获取协程执行的结果 |



