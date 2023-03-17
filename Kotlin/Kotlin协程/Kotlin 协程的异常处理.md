[TOC]

# Kotlin 协程的异常处理

## 概述

协程是互相协作的程序，协程是结构化的。

如果把Java的异常处理机制，照搬到Kotlin协程中，一定会遇到很多的坑。

**Kotlin协程中的异常主要分两大类**

-   协程取消异常（CancellationException）
-   其他异常



## 异常处理六大准则

-   协程的取消需要内部配合
-   不要轻易打破协程的父子结构
-   捕获了`CancellationException`后，需要考虑是否重新抛出来
-   不要用`try-catch`直接包裹`launch`、`async`
-   灵活使用`SurpervisorJob`，控制异常传播的范围
-   使用`CoroutineExceptionHandler`处理复杂结构的协程异常，仅在顶层协程中起作用

**核心理念：协程是结构化的，异常传播也是结构化的。**



## 准则一：协程的取消需要内部配合

### 问题：cancel不被响应

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        while (true) {
            Thread.sleep(500L)
            i++
            println("i= $i")
        }
    }

    delay(2000L)

    job.cancel()
    job.join()

    println("end")
}

/*
输出结果：
i= 1
i= 2
i= 3
... //不会停止，一直执行
*/
```



### 解决：使用isActive判断是否处于活动状态

```kotlin
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        while (isActive) {
            Thread.sleep(500L)
            i++
            println("i= $i")
        }
    }

    delay(2000L)

    job.cancel()
    job.join()

    println("end")
}

/*
输出结果：
i= 1
i= 2
i= 3
i= 4
end
*/
```



## 准则二：不要打破协程的父子结构

### 问题：子协程不会跟随父协程一起取消

协程的优势在于结构化并发，它的许多特性都是建立这个特性之上的，如果我们无意中打破了它的父子结构关系，就会导致协程代码无法按照预期执行。

```kotlin
val fixedDispatcher = Executors.newFixedThreadPool(2) {
    Thread(it, "MyFixedThread").apply { isDaemon = false }
}.asCoroutineDispatcher()

fun main() = runBlocking {
    val parentJob = launch(fixedDispatcher) {
        launch(Job()) {
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
子协程2：i= 1
子协程1：i= 1
子协程2：i= 2
子协程1：i= 2
子协程1：i= 3
子协程2：i= 3
子协程2：i= 4
子协程1：i= 4
end
子协程1：i= 5
子协程1：i= 6
...... //子协程1不会停止
*/
```

说明：协程是结构化的，通常情况下，当取消了父协程，子协程也会被取消。但是在这里，子协程1不再是parentJob的子协程，打破了原有的结构化关系。



### 解决：不破坏父子结构

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



## 准则三：捕获CancellationException需要重新抛出来

准则一中的`Thread.sleep`可以替代为`delay`，`delay()`函数可以自动检测当前的协程是否已经被取消，如果已经被取消，则会抛出`CancellationException`异常，从而终止当前的协程。

协程是`CancellationException`异常来实现结构化取消的，有的时候我们出于某些目的需要捕获`CancellationException`异常，但捕获完以后，还需要考虑是否重新抛出来。

### 问题：捕获CancellationException导致崩溃

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
输出结果：
协程1 i= 1
协程2 i= 1
协程1 i= 2
协程2 i= 2
协程1 i= 3
协程2 i= 3
捕获CancellationException异常
...... //程序不会终止
*/
```



### 解决：需要重新抛出

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
输出结果：
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

协程的代码执行顺序与普通程序不一样，直接使用`try-catch`包裹launch、async是不会有任何效果的。

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
输出结果：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```



### 解决：调整作用域

可以将`try-catch`移动到协程体内部，这样可以捕获到异常了。

```kotlin
fun main() = runBlocking {
    launch {
        delay(100L)
        try {
            1 / 0 //产生异常
        } catch (e: ArithmeticException) {
            println("捕获：$e")
        }
    }

    delay(500L)
    println("end")
}

/*
输出结果：
捕获：java.lang.ArithmeticException: / by zero
end
*/
```



## 准则五：灵活使用SurpervisorJob

### 问题：子Job发生异常影响其他子Job

普通`Job`，当子Job发生异常时，会导致parentJob取消，从而导致其他子Job也受到牵连，这也是协程结构化的体现。

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
输出结果：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```



### 解决：使用SupervisorJob

`SurpervisorJob`是`Job`的子类，`SurpervisorJob`是一个种特殊的Job，可以控制异常的传播范围，当子Job发生异常时，其他的子Job不会受到影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/84073746e02d4d7c97d806d9350b0761.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)

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
输出结果：
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.ArithmeticException: / by zero
hello world 222
hello world 333
end
*/
```



### 解决：使用supervisorScope

`supervisorScope`底层使用是`SupervisorJob`。

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
输出结果：
Exception in thread "main" java.lang.ArithmeticException: / by zero
hello world 222
hello world 333
end
*/
```



## 准则六：使用CoroutineExceptionHandler处理复杂结构的协程异常

Kotlin提供了`CoroutineExceptionHandler`处理复杂的协程嵌套结构，可以捕获整个作用域内的所有异常，只在顶层协程中起作用。

### 问题：处理复杂结构的协程异常



### 解决：使用CoroutineExceptionHandler

```kotlin
fun main() = runBlocking {
    val myExceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        println("捕获异常：$throwable")
    }
    val scope = CoroutineScope(SupervisorJob() + myExceptionHandler)

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
输出结果：
捕获异常：java.lang.ArithmeticException: / by zero
hello world 222
hello world 333
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
