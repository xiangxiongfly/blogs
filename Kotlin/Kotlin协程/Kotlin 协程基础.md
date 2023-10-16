[TOC]

# Kotlin 协程基础

## 概述

- 线程：线程一旦开始执行就不会暂停，直到任务结束，这个过程是持续的。线程之间是抢占式的调度。
- 协程：协程是互相协作的程序，Cooperative-routine也就是Coroutine。
  - 协程框架封装了 Java 线程，对开发者暴露了协程API。
  - 协程是轻量的，依赖于线程但是不会和某个线程绑定，在一个线程中可以运行多个协程。
  - 协程是非阻塞的。



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



## 普通程序与协程区别

**普通程序：**

```kotlin
fun getList(): List<Int> {
    val list = mutableListOf<Int>()
    list.add(1)
    println("add 1")
    list.add(2)
    println("add 2")
    list.add(3)
    println("add 3")
    return list
}

fun printList(list: List<Int>) {
    list.forEach {
        println("print $it")
    }
}

fun main() {
    val list = getList()
    printList(list)
}

//add 1
//add 2
//add 3
//print 1
//print 2
//print 3
```

**协程：**

```kotlin
fun getSequence() = sequence {
    println("add 1")
    yield(1)
    println("add 2")
    yield(2)
    println("add 3")
    yield(3)
}

fun printSequence(sequence: Sequence<Int>) {
    val iterator = sequence.iterator()
    while (iterator.hasNext()) {
        val i = iterator.next()
        println("print $i")
    }
}

fun main() {
    val sequence = getSequence()
    printSequence(sequence)
}

//add 1
//print 1
//add 2
//print 2
//add 3
//print 3
```

**区别：**

- 普通程序需要一次性收集完所有的值，然后统一返回。
- 协程可以每次只返回（yield）一个值，提现了互相协作的特点。   



## 线程和协程区别

### 协程是基于线程

Kotlin 协程框架将线程池进一步封装，对开发者暴露出统一的协程API。

**线程：**

```kotlin
//开启2个线程
fun main() {
    println(Thread.currentThread().name)
    thread {
        println(Thread.currentThread().name)
        Thread.sleep(100L)
    }
    Thread.sleep(1000L)
}

//main
//Thread-0
```

**协程：**

配置VM参数：`-Dkotlinx.coroutines.debug`

```kotlin
//启动2个协程
fun main() = runBlocking {
    println(Thread.currentThread().name)
    launch {
        println(Thread.currentThread().name)
        delay(100L)
    }
    Thread.sleep(1000L)
}

//main @coroutine#1
//main @coroutine#2
```

**区别：**

- 第一块代码，main() 函数本身会启动一个主线程main，然后在thread中，又启动一个子线程Thread-0，所以一共会启动2个线程。
- 第二块代码，从打印信息可以看出2个协程都是运行在主线程main中。

协程可以理解为运行在线程当中的、更加轻量的 Task。

![在这里插入图片描述](https://img-blog.csdnimg.cn/aee34fa5b63b44b88912b596124b55d1.png)

### 协程是轻量的

**线程：**

```kotlin
// 10亿线程
fun main() {
    repeat(1000_000_000) {
        thread {
            Thread.sleep(1000_000L)
        }
    }
    Thread.sleep(10_000L)
}

/*
输出结果：
Exception in thread "main" java.lang.OutOfMemoryError: unable to create new native thread
    at java.lang.Thread.start0(Native Method)
    at java.lang.Thread.start(Thread.java:717)
    at kotlin.concurrent.ThreadsKt.thread(Thread.kt:42)
    at kotlin.concurrent.ThreadsKt.thread$default(Thread.kt:20)
*/
```

**协程：**

```kotlin
// 10亿协程
fun main() = runBlocking {
    repeat(1000_000_000) {
        launch {
            delay(1000000)
        }
    }

    delay(10000L)
}

/*
运行结果：
正常
*/
```

**区别：**

- 启动10亿线程会因为内存不足导致异常退出。
- 启动10亿协程则不会因为内存问题异常退出，说明协程是非常轻量的。

### 协程依赖线程但不会和某个线程绑定

```kotlin
fun main() = runBlocking(Dispatchers.IO) {
    repeat(3) {
        launch {
            repeat(3) {
                println(Thread.currentThread().name)
                delay(100L)
            }
        }
    }
    delay(5000L)
}

//DefaultDispatcher-worker-2 @coroutine#2
//DefaultDispatcher-worker-6 @coroutine#4
//DefaultDispatcher-worker-4 @coroutine#3
//DefaultDispatcher-worker-3 @coroutine#4
//DefaultDispatcher-worker-6 @coroutine#3
//DefaultDispatcher-worker-1 @coroutine#2 //线程切换了
//DefaultDispatcher-worker-1 @coroutine#4
//DefaultDispatcher-worker-3 @coroutine#2 //线程切换了
//DefaultDispatcher-worker-6 @coroutine#3
```

说明：协程`coroutine#2`执行了3次，每次都在不同的线程上。

### 协程是非阻塞式

**线程：**

```kotlin
fun main() {
    repeat(3) {
        Thread.sleep(1000L)
        println("print-A: ${Thread.currentThread().name}")
    }
    repeat(3) {
        Thread.sleep(900L)
        println("print-B: ${Thread.currentThread().name}")
    }
}

//print-A: main
//print-A: main
//print-A: main
//print-B: main
//print-B: main
//print-B: main
```

**协程：**

```kotlin
fun main() = runBlocking {
    launch {
        repeat(3) {
            delay(1000L)
            println("print-A: ${Thread.currentThread().name}")
        }
    }
    launch {
        repeat(3) {
            delay(900L)
            println("print-B: ${Thread.currentThread().name}")
        }
    }
    delay(3000L)
}

//print-B: main @coroutine#3
//print-A: main @coroutine#2
//print-B: main @coroutine#3
//print-A: main @coroutine#2
//print-B: main @coroutine#3
//print-A: main @coroutine#2
```

**说明：**

- 线程是阻塞式的。由于线程的sleep()方法是阻塞式的，它会阻挡后续Task的执行，所以线程会依次打印6次。
- 协程是非阻塞式的。启动了2个协程并行执行，协程的delay()方法是非阻塞式的，支持挂起和恢复，当Task挂起时后续的Task不会被阻塞，所以会交替打印。

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/410f0dc4bb826d08d2ffd6d87455e220.gif#pic_center)