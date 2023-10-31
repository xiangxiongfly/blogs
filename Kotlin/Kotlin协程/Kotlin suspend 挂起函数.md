[TOC]

# Kotlin suspend 挂起函数

## 地狱回调问题

我们首先会调用登陆接口，获取用户id，再通过用户id获取用户详细信息，最后再获取好友列表。

通常用Java写出的代码如下：

```java
login(new Callback() {
    @Override
    public void onSuccess(String userId) {
        getUserInfo(userId, new Callback() {
            @Override
            public void onSuccess(String user) {
                getFriendList(user, new Callback() {
                    @Override
                    public void onSuccess(String friendList) {

                    }
                });
            }
        });
    }
});
```

这样的代码可读性差、扩展性差、维护性差。



## 挂起函数

### 概述

挂起函数可以极大地简化异步编程，让我们能够以同步的方式写异步代码。

-   挂起函数需要用 `suspend` 定义，其余与普通函数基本一致。
-   挂起函数具有“挂起”和“恢复”的功能。
-   挂起函数只能在协程中使用，或者被其他挂起函数调用。



### 基本使用

使用协程和挂起函数重构上面代码：

```kotlin
suspend fun login(): String {
    withContext(Dispatchers.IO) {
        delay(1000L)
    }
    return "userId"
}

suspend fun getUserInfo(userId: String): String {
    withContext(Dispatchers.IO) {
        delay(1000L)
    }
    return "userInfo"
}

suspend fun getFriendList(userInfo: String): String {
    withContext(Dispatchers.IO) {
        delay(1000L)
    }
    return "friendList"
}

fun main() = runBlocking {
    val userId = login()
    val userInfo = getUserInfo(userId)
    val friendList = getFriendList(userInfo)
}
```

说明：代码 `val userId = login() ` 中 ”=“ 左边的代码运行在主线程，右边的代码运行在 IO 线程；每一次从主线程到 IO 线程都是一次协程挂起；每一次从 IO 线程到主线程都是一次协程恢复。

挂起只是将程序执行流程转移到其他线程，主线程不会阻塞。



## 挂起函数和普通函数区别

```kotlin
//普通函数
fun func1(num: Int): Double {
    return num.toDouble()
}

//挂起函数
suspend fun func2(num: Int): Double {
    delay(100L)
    return num.toDouble()
}

fun main() {

    val f1: (Int) -> Double = ::func1
    val f2: suspend (Int) -> Double = ::func2

//    val f3: (Int) -> Double = ::func2 //报错
//    val f4: suspend (Int) -> Double = ::func1 //报错
}
```

说明：func1函数的函数类型是 `(Int) -> Double`，func2函数的函数类型是 `suspend (Int) -> Double`，这两个函数类型是不同的，不能互相赋值。



## CPS转换

CPS( Continuation-Passing-Style Transformation )，从挂起函数转换成Callbacl函数的过程。

协程之所以是非阻塞，是因为它支持”挂起“和”恢复“；而”挂起“和”恢复“的能力来源于挂起函数；而挂起函数是由 CPS 实现的，其中 Continuation 本质是 Callback。

Continuation代表程序继续运行需要执行的代码，当程序执行到`getUserInfo()`时，将剩余的未执行代码打包在一起，以Continuation的形式传递到`getUserInfo()`的Callback回调中。

```kotlin
suspend fun getUserInfo(): String {
    return "hello world"
}
```

挂起函数等价于：

```kotlin
interface CallBack {
    fun onSuccess(message: String)
}

fun getUserInfo(cb: CallBack): Any? {
    cb.onSuccess("hello world")
    return Unit
}
```

等价于：

```kotlin
interface Continuation {
    fun resumeWith(message: String)
}

fun getUserInfo(ct: Continuation): Any? {
    ct.resumeWith("hello world")
    return Unit
}
```



## 挂起函数总结

- 定义挂起函数只需要在普通函数的基础上加上 suspend 关键字。
- 协程之所以是非阻塞式，是因为支持挂起函数，具有挂起和恢复的能力，对于同一行代码来说，“=”左右两边的代码可以分别执行在不同的线程之上。 
- 挂起函数的本质是 Callback，也就是 Kotlin 中的 Continuation。CPS 转换也就是 Kotlin 编译器将 suspend 翻译成 Continuation 的过程。这里的 Continuation 是代表了，“程序继续运行下去需要执行的代码”，“接下来要执行的代码”，或者是 “剩下的代码”。
- 协程与挂起函数之间的关系：挂起函数只能在协程中或其他挂起函数中调用。 

