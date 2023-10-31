[TOC]

# Kotlin Channel 管道

## 概述

-   Kotlin 协程中的挂起函数、async 每次只能返回一个结果。
-   需要返回多个结果，比如聊天软件接收消息、GPS定位实时返回坐标这类场景，使用 Kotlin 协程中的Channel 更适合。
-   Channel 就是一个管道，管道的一端是发送方，另一端是接收方，管道本身可以用来传输数据，可以 发送-接收 多个数据。
-   Channel 是热数据流，不管有没有接收方，发送方都会工作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c376ce998ce4c51a09333f8328a7d40.png)



## 源码和参数

```kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    onUndeliveredElement: ((E) -> Unit)? = null
): Channel<E> { }
```

Channel() 是一个顶层函数。该函数有三个参数：

**参数一：capacity**

代表管道的容量。

-   Channel.RENDEZVOUS：默认值，表示容量为0，发送后可以立即接收的模式。
-   Channel.UNLIMITED：无限容量。
-   Channel.CONFLATED：表示容量为1，新数据会替代旧数据。
-   Channel.BUFFERED：表示具有一定的缓存容量，默认情况下是64，具体容量可以设置VM参数` kotlinx.coroutines.channels.defaultBuffe`。

**参数二：onBufferOverflow**

当管道指定容量后，如果管道的容量满了时，Channel 的应对策略。

-   BufferOverflow.SUSPEND：默认值，当管道的容量满了后，如果发送方还再继续发送，就会挂起当前的send() 方法，等管道有空闲位置后再恢复。send() 这是一个挂起函数。
-   BufferOverflow.DROP_OLDEST：丢弃最旧的数据，然后发送新数据。
-   BufferOverflow.DROP_LATEST：丢弃最新的数据，管道的内容维持不变。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9894ff2e1f9e4d1b95458a99d176a21c.png)

**参数三：onUndeliveredElement**

异常处理回调，管道中的数据没有被成功接收时，就会回调这个函数。

**注意**

Channel 是一种协程资源，使用完后，一定要调用 close() 方法及时关闭，否则程序不会停止，造成资源浪费。



## 使用

### capacity =  Channel.RENDEZVOUS 也就是默认值

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>()
    launch {
        (1..3).forEach {
            println("send: $it")
            channel.send(it)
        }
        channel.close() //主动关闭
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
    println("end")
}

/*
输出信息：
end
send: 1
send: 2
send: 3
receive: 1
receive: 2
receive: 3
 */
```

说明：当 `capacity = UNLIMITED` 时，表示 Channel 的容量是无限大的，所以发送方可以一直往管道里发送数据，等数据发送完后，接收方才开始接收。

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
    println("end")
}

/*
输出信息：
end
send: 1
send: 2
send: 3
receive: 3
 */
```

说明：当 `capacity = CONFLATED` 时，表示发送方会一直发送数据，但是接收方永远只会接收最后一条数据。

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

### onBufferOverflow = BufferOverflow.SUSPEND 也就是默认值

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

说明：当Channel的容量满了后，`send()` 方法会被挂起。

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

说明：效果与 `capacity = CONFLATED` 基本一样，会丢弃最旧的数据。

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

说明：Channel 容量满了后，会丢弃后续发送的数据。

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



## 推荐 produce 高阶函数

如果忘记调用 close() 方法，会导致程序一直运行无法停止，产生很严重的问题。

Kotlin 提供了另一种创建 Channel 的方式，推荐使用 produce{} 高阶函数。使用 produce 以后不用再调用 close() 方法了，因为 produce 内部已经帮我们处理了，会自动调用 close() 方法。

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
    println("end")
}

/*
输出信息：
end
send: 1
Receive: 1
send: 2
send: 3
Receive: 2
Receive: 3
 */
```



## receive() 

可以使用 receive() 接收数据，但是直接使用 receive() 是很容易出现问题的，如下：

```kotlin
fun main() = runBlocking {
    val channel: ReceiveChannel<Int> = produce {
        (1..3).forEach {
            send(it)
        }
    }

    // 调用4次receive()
    println(channel.receive())
    println(channel.receive())
    println(channel.receive())
    println(channel.receive())

    println("end")
}

/*
输出结果：
1
2
3
Exception in thread "main" kotlinx.coroutines.channels.ClosedReceiveChannelException: Channel was closed
*/
```

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>()
    launch {
        (1..3).forEach {
            channel.send(it)
        }
    }

    // 调用4次receive()
    println(channel.receive())
    println(channel.receive())
    println(channel.receive())
    println(channel.receive()) //永远挂起

    println("end")
}

/*
输出结果：
1
2
3
*/
```

### isClosedForReceive 和 isClosedForSend

- 对于发送方，可以使用 isClosedForSend 来判断当前的 Channel 是否关闭。
- 对于接收方，可以使用 isClosedForReceive 来判断当前的 Channel 是否关闭。

但是，当你为管道指定了 capacity 以后，以上的判断方式将会变得不可靠。原因是目前的 1.6.0 版本的协程库，运行这样的代码会崩溃  。

**因此最好不要用 channel.receive() ，即使配合 isClosedForReceive 这个判断条件，我们直接调用 channel.receive() 仍然是一件非常危险的事情！**

```kotlin
fun main() = runBlocking {
    // 发送方：
    val channel: ReceiveChannel<Int> = produce {
        (1..3).forEach {
            send(it)
            println("send: $it")
        }
    }

    // 接收方：
    // 使用while循环判断isClosedForReceive
    while (!channel.isClosedForReceive) {
        val i = channel.receive()
        println("receive: $i")
    }

    println("end")
}

/*
输出信息：
Send 1
Receive 1
Receive 2
Send 2
Send 3
Receive 3
end
*/
```



## 推荐 consumeEach 高阶函数

推荐使用 consumeEach 高阶函数接收数据，替代for循环。

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
    println("end")
}

/*
输出信息：
end
send: 1
Receive: 1
send: 2
send: 3
Receive: 2
Receive: 3
 */
```



## Channel 是热流

Channel 是热流，指的是“不管有没有接收方，发送方都会工作”的模式。 

```kotlin
fun main() = runBlocking {
    // 只发送不接受
    val channel = produce<Int>(capacity = 10) {
        (1..3).forEach {
            send(it)
            println("send: $it")
        }
    }

    println("end")
}

/*
输出结果：
end
Send 1
Send 2
Send 3
*/
```

说明：没有接收方时，Channel 依然会发送数据。

```kotlin
fun main() = runBlocking {
    val channel = produce<Int>(capacity = 0) {
        (1..3).forEach {
            println("Before send $it")
            send(it)
            println("Send $it")
        }
    }

    println("end")
}

/*
输出结果：
end
Before send 1
挂起程序一直停在这里
*/
```

说明：将 capacity 设置为0后，程序一直停着无法退出，这是因为 send() 方法是一个挂起函数，当 Channel 容量满了就会挂起。

