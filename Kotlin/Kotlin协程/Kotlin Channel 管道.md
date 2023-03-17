[TOC]

# Kotlin Channel 管道

## 概述

-   在Kotlin协程中，挂起函数、async只能一次返回一个结果。
-   而Kotlin协程中的Channel可以发送-接收多个数据。
-   Channel是热数据流，不管有没有接收方，发送方都会工作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c376ce998ce4c51a09333f8328a7d40.png)



## 基本使用

`Channel()`是一个顶层函数。

```kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    onUndeliveredElement: ((E) -> Unit)? = null
): Channel<E> { }
```

**capacity**

代表管道的容量。

-   Channel.RENDEZVOUS：默认值，发送后可以立即接收的模式。
-   Channel.CONFLATED：无限容量。
-   Channel.UNLIMITED：容量为1，新数据会替代旧数据。
-   Channel.BUFFERED：缓存容量，默认情况下是64，具体容量可以设置VM参数`kotlinx.coroutines.channels.defaultBuffe`

**onBufferOverflow**

当管道指定容量后，管道的容量满了室，Channel的应对策略。

-   BufferOverflow.SUSPEND：默认值，当管道的容量满了后，如果发送方还再继续发送，就会挂起`send()`方法，等管道空闲了后再恢复。`send()`这是一个挂起函数。
-   BufferOverflow.DROP_OLDEST：丢弃最旧的数据，然后发送新数据。
-   BufferOverflow.DROP_LATEST：丢弃最新的数据，管道的内容维持不变。

**onUndeliveredElement**

相当于一个异常处理回调，管道中的数据没有被成功接收时，回调这个函数。

**注意**

Channel是一种协程资源，使用完后，一定要调用`close()`方法及时关闭，否则程序不会停止，造成资源浪费。



### capacity =  默认值

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>()
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
receive: 1
send: 2
send: 3
receive: 2
receive: 3
 */
```

说明：发送方和接收方是交替执行的。

### capacity = UNLIMITED

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = UNLIMITED)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
send: 3
receive: 1
receive: 2
receive: 3
 */
```

说明：当`capacity = UNLIMITED`时，表示Channel的容量是无限大的，所以发送方可以一直往管道里发送数据，等数据发送完后，接收方才开始接收。

### capacity = CONFLATED

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = CONFLATED)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
send: 3
receive: 3
 */
```

说明：当`capacity = CONFLATED`时，表示发送方会一直发送数据，但对于接收方来说，它永远只能接收最后一条数据。

### capacity = BUFFERED

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = BUFFERED)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
send: 3
receive: 1
receive: 2
receive: 3
 */
```

说明：`capacity = BUFFERED`与`capacity = UNLIMITED`效果基本一样。

### onBufferOverflow = 默认值

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = 1, onBufferOverflow = BufferOverflow.SUSPEND)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2 被挂起了，程序停在这里
 */
```

说明：当Channel的容量满了后，`send()`方法会被挂起。

### onBufferOverflow = BufferOverflow.DROP_OLDEST

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = 1, onBufferOverflow = BufferOverflow.DROP_OLDEST)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
send: 3
receive: 3
 */
```

说明：效果与`capacity = CONFLATED`基本一样，会丢弃最旧的数据。

### onBufferOverflow = BufferOverflow.DROP_LATEST

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = 1, onBufferOverflow = BufferOverflow.DROP_LATEST)
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
send: 3
receive: 1
 */
```

说明：Channel容量满了后，会丢弃后续发送的内容。

### onUndeliveredElement

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>(capacity = Channel.CONFLATED) {
        println("onUndeliveredElement: $it")
    }
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close()
    }
    launch {
        for (i in channel) {
            println("receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
send: 2
onUndeliveredElement: 1
send: 3
onUndeliveredElement: 2
receive: 3
 */
```

说明：丢弃的数据会被`onUndeliveredElement`接收到。



## produce 高阶函数

还可以使用`produce`高阶函数创建Channel，这样就不用手动调用`close()`方法，因为`produce`内部已经帮我们去调用了。

```kotlin
fun main() = runBlocking {
    val channel: ReceiveChannel<Int> = produce {
        (1..3).forEach {
            println("send: $it")
            send(it)
        }
    }
    launch {
        // 3，接收数据
        for (i in channel) {
            println("Receive: $i")
        }
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
Receive: 1
send: 2
send: 3
Receive: 2
Receive: 3
 */
```



## consumeEach 高阶函数

可以使用`consumeEach`高阶函数接收数据，替代for循环。

```kotlin
fun main() = runBlocking {
    val channel: ReceiveChannel<Int> = produce {
        (1..3).forEach {
            println("send: $it")
            send(it)
        }
    }
    channel.consumeEach {
        println("receive: $it")
    }
    println("结束！")
}

/*
输出信息：
结束！
send: 1
Receive: 1
send: 2
send: 3
Receive: 2
Receive: 3
 */
```

