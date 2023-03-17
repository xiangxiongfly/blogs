[TOC]

# Kotlin五种思维模型

## 概述

学习Kotlin需要做五种思维转变，即：函数思维、表达式思维、不变性思维、空安全思维、协程思维。



## 函数思维

在Kotlin中，函数式一等公民。

- 函数可以独立于类之外；
- 函数可以作为参数和返回值；
- 函数可以像变量一样，即函数引用。

```kotlin
fun foo() = listOf(1, 2, 3, 4).filter { it % 2 == 0 }
```



## 表达式思维

表达式，是一段可以产生值得代码；语句，是一句不产生值的代码。

Kotlin的类型系统让大部分语句都变成了表达式，同时也让无返回值的函数有了类型。

```kotlin
//when表达式
fun foo(data: Any?): Int {
    val i = when (data) {
        is Number -> data.toInt()
        is String -> data.length
        else -> 0
    }
    return i
}
```

```kotlin
//函数表达式
val f: (String) -> Unit = ::println
f("hello world")
```



## 不变性思维

Kotlin将不变性的思维发挥到极致，开发者需要定义一个变量时，需要明确指明这个变量是可变的（var），还是不可边的（val）。在定义集合时，需要指明这个集合是可变的（MutableList），还是不可变的（List）。

- 尽可能使用条件表达式消灭var。由于Kotlin当中大部分语句都是表达式，可以借助这种思路减少var变量的定义。
- 使用数据类存储数据，消灭数据类的可变性。充分发挥Kotlin数据类的优势，借助copy方法，实现不变性。
- 尽可能对外暴露只读集合。根据开闭原则，尽可能对修改封闭。
- 只读集合底层不一定是不可变的，警惕Java代码中的只读集合访问行为。
- val并不意味着绝对的不可变。

```kotlin
//消灭var，推荐使用val
val i = when (data) {
    is Number -> data.toInt()
    is String -> data.length
    else -> 0
}
```

```kotlin
//推荐用数据类存储数据，消灭可变性
data class Person(val name: String?, val age: Int?)
fun changeName(person: Person, newName: String): Person = person.copy(name = newName)
fun changeAge(person: Person, newAge: Int): Person = person.copy(age = newAge)
```

```kotlin
//尽可能对外暴露只读集合
class Model {
    private val _data: MutableList<String> = mutableListOf()
    val data: List<String>
    	get() = _data.toList()

    fun add() {
        _data.add("A")
    }
}
```

```kotlin
//通过自定义get()方法，打破了val的不变性
object Model {
    val data
        get() = Random.nextInt()
}
```



## 空安全思维

**使用null的场景：**

- 变量还没有初始化时，用null赋值；
- 变量的值不合法时，用null赋值；
- 变量的值计算错误时，用null赋值。

### Java的空安全思维

- 通过判空，避免NPE；
- 使用`@Nullable`、`@NotNull`等注解，提示开发人员。

```java
@Nullable
public static String foo1(@Nullable String param) {
    return null;
}

@NotNull
public static String foo2(@NotNull String param) {
    return "hello world";
}
```



### Kotlin的空安全思维

Kotlin的类型有三种表示方法：

- String：不可空的字符串；
- String?：可能为空的字符串；
- String!：平台类型，不知道是否为空。

**避免使用非空断言!!.，防止NPE的产生**

断言：

```kotlin
fun test(msg: String?) {
    val len = msg!!.length
}
```

避免NPE 方式一：

```kotlin
fun foo(str: String?) {
    if (str != null) {
        val count = str.length
    }
}
```

避免NPE 方式二：

```kotlin
fun foo(str: String?) {
    val count = str?.let { it.length }
}
```



## 协程思维

Kotlin的协程可以帮助我们极大的简化异步、并发编程、优化软件架构。

协程与线程的关系，有点类似线程与进程的关系。Kotlin中的协程封装了Java的线程，对外暴露了协程的API。

-   协程是运行在线程中的、更加轻量的Task。一个线程当中，可以运行许多个协程。
-   协程是非阻塞的，具有挂起和恢复的能力；线程往往是阻塞式的。
-   协程不会与特定的线程绑定，它可以在不同的线程之间灵活切换，这其实也是通过“挂起”和“恢复”实现的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc20e498219844218f5d185f3e716d08.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

**开启两个协程**

可以在VM中设置`-Dkotlinx.coroutines.debug`，打印线程名时就会包含协程名。

```kotlin
fun main() = runBlocking {
    println(Thread.currentThread().name) //main @coroutine#1

    launch {
        println(Thread.currentThread().name) //main @coroutine#2
        delay(100L)
    }

    Thread.sleep(1000L)
}
```



### 论证协程是轻量级的

**使用线程**

```kotlin
fun main() = runBlocking {
    repeat(1000_000_000) {
        thread {
            Thread.sleep(1000000L)
        }
    }
    Thread.sleep(1000000L)
}

//抛出异常：Exception in thread "main" java.lang.OutOfMemoryError
```

**使用协程**

```kotlin
fun main() = runBlocking {
    repeat(1000_000_000) {
        launch {
            delay(1000000L)
        }
    }
    Thread.sleep(1000000L)
}

//运行正常
```



### 论证协程是非阻塞的

**使用线程**

线程是阻塞式的，当执行的Task发生了阻塞行为，就会影响后面所有任务的执行。

![在这里插入图片描述](https://img-blog.csdnimg.cn/31c5726d08cb415abaacc86146b1cffc.gif)

```kotlin
fun main() = runBlocking {
    repeat(3) {
        Thread.sleep(1000L)
        println("输出1：${Thread.currentThread().name}")
    }
    repeat(3) {
        Thread.sleep(500L)
        println("输出2：${Thread.currentThread().name}")
    }
}

//输出1：main @coroutine#1
//输出1：main @coroutine#1
//输出1：main @coroutine#1
//输出2：main @coroutine#1
//输出2：main @coroutine#1
//输出2：main @coroutine#1
```

**使用协程**

协程是非阻塞的，支持挂起和恢复，当执行的Task被挂起，后续的Task不会受到影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4d85c6141d2b4bc2ad9c9d2df364d31c.gif)

```kotlin
fun main() {
    runBlocking {
        launch {
            repeat(3) {
                delay(1000L)
                println("输出1：${Thread.currentThread().name}")
            }
        }
        launch {
            repeat(3) {
                delay(500L)
                println("输出2：${Thread.currentThread().name}")
            }
        }
    }
}

//输出2：main @coroutine#3
//输出1：main @coroutine#2
//输出2：main @coroutine#3
//输出2：main @coroutine#3
//输出1：main @coroutine#2
//输出1：main @coroutine#2
```

















