[TOC]

# Kotlin 协程的异常处理

## 概述

协程是互相协作的程序，协程是结构化的。

正是因为协程的这两个特点，导致它和 Java 的异常处理机制不一样。如果将 Java 的异常处理机制照搬到Kotlin协程中，会遇到很多问题，如：协程无法取消、try-catch不起作用等。

**Kotlin协程中的异常主要分两大类**

-   协程取消异常（CancellationException）
-   其他异常



## 异常处理六大准则

-   协程的取消需要内部配合。
-   不要打破协程的父子结构。
-   捕获 CancellationException 异常后，需要考虑是否重新抛出来。
-   不要用 try-catch 直接包裹 launch、async。
-   使用 SurpervisorJob 控制异常传播的范围。
-   使用 CoroutineExceptionHandler 处理复杂结构的协程异常，仅在顶层协程中起作用。

**核心理念：协程是结构化的，异常传播也是结构化的。**



## 准则一：协程的取消需要内部配合

协程任务被取消时，它的内部会产生一个 CancellationException 异常，协程的结构化并发的特点：如果取消了父协程，则子协程也会跟着取消。

### 问题：cancel不被响应

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        while (true) {
            Thread.sleep(500L)
            i++
            println("i: $i")
        }
    }

    delay(200L)

    job.cancel()
    job.join()

    println("End")
}

/*
输出信息：
i: 1
i: 2
i: 3
i: 4
// 不会停止，一直打印输出
 */
```

原因：协程是相互协作的程序，因此协程任务的取消也需要相互协作。协程外部取消，协程内部需要做出相应。

### 解决：使用 isActive 判断是否处于活跃状态

使用 isActive 判断协程的活跃状态。

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        //       关键
        //        ↓
        while (isActive) {
            Thread.sleep(500L)
            i++
            println("i: $i")
        }
    }

    delay(200L)

    job.cancel()
    job.join()

    println("End")
}


/*
输出信息：
i: 1
End
 */
```



## 准则二：不要打破协程的父子结构

### 问题：子协程不会跟随父协程一起取消

```kotlin
val fixedDispatcher = Executors.newFixedThreadPool(2) {
    Thread(it, "MyFixedThread")
}.asCoroutineDispatcher()

fun main() = runBlocking {
    // 父协程
    val parentJob = launch(fixedDispatcher) {
        //子协程1
        launch(Job()) {
            var i = 0
            while (isActive) {
                Thread.sleep(500L)
                i++
                println("子协程1 i:$i")
            }
        }

        //子协程2
        launch {
            var i = 0
            while (isActive) {
                Thread.sleep(500L)
                i++
                println("子协程2 i:$i")
            }
        }
    }

    delay(1000L)

    parentJob.cancel()
    parentJob.join()

    println("End")
}


/*
输出信息：
子协程1 i:1
子协程2 i:1
子协程2 i:2
子协程1 i:2
End
子协程1 i:3
子协程1 i:4
子协程1 i:5
// 子协程1一直在执行，不会停下来
 */
```

原因：协程是结构化的，取消啦父协程，子协程也会被取消。但是在这里“子协程1”不在 parentJob 的子协程，打破了原有的结构化关系，当调用 parentJob.cancel 时，“子协程1”就不会被取消了。

### 解决：不破坏父子结构

“子协程1”不要传入额外的 Job()。

```kotlin
fun main() = runBlocking {
    val parentJob = launch(fixedDispatcher) {
        launch {
            var i = 0
            while (isActive) {
                Thread.sleep(500L)
                i++
                println("子协程1：i= $i")
            }
        }
        launch {
            var i = 0
            while (isActive) {
                Thread.sleep(500L)
                i++
                println("子协程2：i= $i")
            }
        }
    }

    delay(2000L)

    parentJob.cancel()
    parentJob.join()

    println("end")
}

/*
输出结果：
子协程1：i= 1
子协程2：i= 1
子协程2：i= 2
子协程1：i= 2
子协程1：i= 3
子协程2：i= 3
子协程1：i= 4
子协程2：i= 4
end
*/
```



## 准则三：捕获 CancellationException 需要重新抛出来

### 挂起函数可以自动响应协程的取消

Kotlin 中的挂起函数是可以自动响应协程的取消，如下中的 delay() 函数可以自动检测当前协程是否被取消，如果已经取消了它就会抛出一个 CancellationException，从而终止当前协程。

```kotlin
fun main() = runBlocking {
    // 父协程
    val parentJob = launch(Dispatchers.Default) {
        //子协程1
        launch {
            var i = 0
            while (true) {
                // 这里
                delay(500L)
                i++
                println("子协程1 i:$i")
            }
        }

        //子协程2
        launch {
            var i = 0
            while (true) {
                // 这里
                delay(500L)
                i++
                println("子协程2 i:$i")
            }
        }
    }

    delay(1000L)

    parentJob.cancel()
    parentJob.join()

    println("End")
}

/*
输出信息：
子协程1 i:1
子协程2 i:1
子协程1 i:2
子协程2 i:2
End
 */
```

```kotlin
fun main() = runBlocking {
    // 父协程
    val parentJob = launch(Dispatchers.Default) {
        //子协程1
        launch {
            var i = 0
            while (true) {
                try {
                    delay(500L)
                } catch (e: CancellationException) {
                    println("捕获CancellationException")
                    throw e
                }
                i++
                println("子协程1 i:$i")
            }
        }

        //子协程2
        launch {
            var i = 0
            while (true) {
                try {
                    delay(500L)
                } catch (e: CancellationException) {
                    println("捕获CancellationException")
                    throw e
                }
                i++
                println("子协程2 i:$i")
            }
        }
    }

    delay(1000L)

    parentJob.cancel()
    parentJob.join()

    println("End")
}

/*
输出信息：
子协程1 i:1
子协程2 i:1
捕获CancellationException
捕获CancellationException
End
 */
```

### 问题：捕获 CancellationException 导致崩溃

```kotlin
fun main() = runBlocking {
    val parentJob = launch(Dispatchers.Default) {
        launch {
            var i = 0
            while (true) {
                try {
                    delay(500L)
                } catch (e: CancellationException) {
                    println("捕获CancellationException异常")
                }
                i++
                println("子协程1 i= $i")
            }
        }
        launch {
            var i = 0
            while (true) {
                delay(500L)
                i++
                println("子协程2 i= $i")
            }
        }
    }

    delay(2000L)

    parentJob.cancel()
    parentJob.join()

    println("end")
}

/*
输出信息：
子协程1 i= 1
子协程2 i= 1
子协程1 i= 2
子协程2 i= 2
子协程1 i= 3
子协程2 i= 3
捕获CancellationException异常
...... //程序不会终止
*/
```

原因：当捕获到 CancellationException 以后，还需要将它重新抛出去，如果没有抛出去则子协程将无法取消。

### 解决：需要重新抛出

重新抛出异常，执行 `throw e`。

以上三条准则，都是应对 CancellationException 这个特殊异常的。

```kotlin
fun main() = runBlocking {
    val parentJob = launch(Dispatchers.Default) {
        launch {
            var i = 0
            while (true) {
                try {
                    delay(500L)
                } catch (e: CancellationException) {
                    println("捕获CancellationException异常")
                    // 抛出异常
                    throw e
                }
                i++
                println("协程1 i= $i")
            }
        }
        launch {
            var i = 0
            while (true) {
                delay(500L)
                i++
                println("协程2 i= $i")
            }
        }
    }

    delay(2000L)

    parentJob.cancel()
    parentJob.join()

    println("end")
}

/*
输出信息：
协程1 i= 1
协程2 i= 1
协程2 i= 2
协程1 i= 2
协程2 i= 3
协程1 i= 3
捕获CancellationException异常
end
*/
```



## 准则四：不要用try-catch直接包裹launch、async

### 问题：try-catch不起作用

```kotlin
fun main() = runBlocking {
    try {
        launch {
            delay(100L)
            1 / 0 //产生异常
        }
    } catch (e: ArithmeticException) {
        println("捕获：$e")
    }

    delay(500L)
    println("end")
}

/*
输出信息：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```

原因：协程的代码执行顺序与普通程序不一样，当协程执行 `1 / 0` 时，程序实际已经跳出 try-catch 的作用域了，所以直接使用 try-catch 包裹 launch、async 是没有任何效果的。

### 解决：调整作用域

可以将 try-catch 移动到协程体内部，这样可以捕获到异常了。

```kotlin
fun main() = runBlocking {
    launch {
        delay(100L)
        try {
            1 / 0 //产生异常
        } catch (e: ArithmeticException) {
            println("捕获异常：$e")
        }
    }

    delay(500L)
    println("end")
}

/*
输出信息：
捕获异常：java.lang.ArithmeticException: / by zero
end
*/
```



## 准则五：灵活使用SurpervisorJob

### 问题：子Job发生异常影响其他子Job

```kotlin
fun main() = runBlocking {
    launch {
        launch {
            1 / 0
            delay(100L)
            println("hello world 111")
        }
        launch {
            delay(200L)
            println("hello world 222")
        }
        launch {
            delay(300L)
            println("hello world 333")
        }
    }

    delay(1000L)
    println("end")
}

/*
输出信息：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```

原因：使用普通 Job 时，当子Job发生异常时，会导致 parentJob 取消，从而导致其他子Job也受到牵连，这也是协程结构化的体现。

### 解决：使用 SupervisorJob

SurpervisorJob 是 Job 的子类，SurpervisorJob 是一个种特殊的 Job，可以控制异常的传播范围，当子Job发生异常时，其他的子Job不会受到影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/84073746e02d4d7c97d806d9350b0761.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)

将 parentJob 改为 SupervisorJob。

```kotlin
fun main() = runBlocking {
    val scope = CoroutineScope(SupervisorJob())
    scope.launch {
        1 / 0
        delay(100L)
        println("hello world 111")
    }
    scope.launch {
        delay(200L)
        println("hello world 222")
    }
    scope.launch {
        delay(300L)
        println("hello world 333")
    }

    delay(1000L)
    println("end")
}

/*
输出信息：
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.ArithmeticException: / by zero
hello world 222
hello world 333
end
*/
```

### 解决：使用 supervisorScope

supervisorScope 底层依然使用的是 SupervisorJob。

```kotlin
fun main() = runBlocking {
    supervisorScope {
        launch {
            1 / 0
            delay(100L)
            println("hello world 111")
        }
        launch {
            delay(200L)
            println("hello world 222")
        }
        launch {
            delay(300L)
            println("hello world 333")
        }
    }

    delay(1000L)
    println("end")
}

/*
输出信息：
Exception in thread "main" java.lang.ArithmeticException: / by zero
hello world 222
hello world 333
end
*/
```



## 准则六：使用 CoroutineExceptionHandler 处理复杂结构的协程异常

### 问题：复杂结构的协程异常

```kotlin
fun main() = runBlocking {
    val scope = CoroutineScope(coroutineContext)
    scope.launch {
        async { delay(100L) }

        launch {
            delay(100L)
            launch {
                delay(100L)
                1 / 0
            }
        }

        delay(100L)
    }

    delay(1000L)
    println("end")
}

/*
输出信息：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```

原因：模拟一个复杂的协程嵌套场景，开发人员很难在每一个协程体中写 try-catch，为了捕获异常，可以使用 CoroutineExceptionHandler。

### 解决：使用CoroutineExceptionHandler

使用 CoroutineExceptionHandler 处理复杂结构的协程异常，它只能在顶层协程中起作用。

```kotlin
fun main() = runBlocking {
    val myCoroutineExceptionHandler = CoroutineExceptionHandler { _, throwable ->
        println("捕获异常：$throwable")
    }
    
    val scope = CoroutineScope(coroutineContext + Job() + myCoroutineExceptionHandler)
    
    scope.launch {
        async { delay(100L) }

        launch {
            delay(100L)
            launch {
                delay(100L)
                1 / 0
            }
        }

        delay(100L)
    }

    delay(1000L)
    println("end")
}

/*
输出信息：
捕获异常：java.lang.ArithmeticException: / by zero
end
*/
```



## 总结

-   准则一：协程的取消需要内部的配合。
-   准则二：不要轻易打破协程的父子结构。协程的优势在于结构化并发，他的许多特性都是建立在这之上的，如果打破了它的父子结构，会导致协程无法按照预期执行。
-   准则三：捕获 CancellationException 异常后，需要考虑是否重新抛出来。协程是依赖 CancellationException 异常来实现结构化取消的，捕获异常后需要考虑是否重新抛出来。
-   准则四：不要用 try-catch 直接包裹 launch、async。协程代码的执行顺序与普通程序不一样，直接使用 try-catch 可能不会达到预期效果。
-   准则五：使用 SupervisorJob 控制异常传播范围。SupervisorJob 是一种特殊的 Job，可以控制异常的传播范围，不会受到子协程中的异常而取消自己。
-   准则六：使用 CoroutineExceptionHandler 捕获异常。当协程嵌套层级比较深时，可以在顶层协程中定义 CoroutineExceptionHandler 捕获整个作用域的所有异常。
