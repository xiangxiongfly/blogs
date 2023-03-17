[TOC]

# Kotlin 挂起函数

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

-   挂起函数需要用`suspend`定义，其余与普通函数基本一致。
-   挂起函数具有“挂起”和“恢复”的功能。
-   挂起函数只能在协程中使用，或者被其他挂起函数调用。



### 基本使用

使用协程和挂起函数重构以上代码：

```kotlin
fun main() = runBlocking {
    val userId = login()
    val userInfo = getUserInfo(userId)
    val friendList = getFriendList(userInfo)
}

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
```



### 挂起函数的类型

**普通函数：**

```kotlin
fun foo(num: Int): Double {
    return num.toDouble()
}

fun main() {
    val f: (Int) -> Double = ::foo
    println(f(1)) //1.0
}
```

这个普通函数是`Int`为参数，`Double`为返回值，也就是函数类型是：`(Int) -> Double`。



**挂起函数：**

```kotlin
suspend fun foo(num: Int): Double {
    return num.toDouble()
}

fun main() {
    runBlocking {
        val f: suspend (Int) -> Double = ::foo
        println(f(1)) //1.0
    }
}
```

这个挂起函数的函数类型是：`suspend (Int) -> Double `。



### CPS转换

CPS( Continuation-Passing-Style Transformation )，从挂起函数转换成Callbacl函数的过程。

Continuation代表程序继续运行需要执行的代码，当程序执行到`getUserInfo()`时，将剩余的未执行代码打包在一起，以Continuation的形式传递到`getUserInfo()`的Callback回调中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f2e1cc56179488f83ea63ba99d1f085.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



## 挂起函数总结

协程之所以是非阻塞，是因为它支持挂起和恢复；而挂起和恢复的能力来源自挂起函数；挂起函数式由CPS实现的，其中Continuation本质是Callback。

