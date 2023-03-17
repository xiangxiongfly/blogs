[TOC]

# Kotlin 标准函数

Kotlin的标准函数指定义在`Standard.kt`文件下的函数。



## 分类

- run / with / apply ：block是带接收者的函数类型（T的扩展函数），block中的this指函数的调用者
- also / let ：block是参数为T的函数类型，block中的参数it指函数的调用者

```java
public inline fun <T, R> T.let(block: (T) -> R): R {
    return block(this)
}

public inline fun <T, R> T.run(block: T.() -> R): R {
    return block()
}

public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
    return receiver.block()
}

public inline fun <T> T.apply(block: T.() -> Unit): T {
    block()
    return this
}

public inline fun <T> T.also(block: (T) -> Unit): T {
    block(this)
    return this
}
```



## let

```kotlin
public inline fun <T, R> T.let(block: (T) -> R): R {
    return block(this)
}
```

```kotlin
data class User(var name: String, var age: Int, var address: String)

fun main() {
    val user = User("Tom", 18, "beijing")
    val ret = user.let {
        it.name = "ABC"
        it.age = 28
        it.address = "shanghai"
        it.name + "-" + it.age + "-" + it.address
    }

    println(user) //User(name=ABC, age=28, address=shanghai)
    println(ret) //ABC-28-shanghai
}
```



## run

```kotlin
public inline fun <T, R> T.run(block: T.() -> R): R {
    return block()
}
```

```kotlin
data class User(var name: String, var age: Int, var address: String)

fun main() {
    val user = User("Tom", 18, "beijing")
    val ret = user.run {
        name = "ABC"
        age = 28
        address = "shanghai"
        "$name-$age-$address"
    }

    println(user) //User(name=ABC, age=28, address=shanghai)
    println(ret) //ABC-28-shanghai
}
```



## with

```kotlin
public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
    return receiver.block()
}
```

```kotlin
data class User(var name: String, var age: Int, var address: String)

fun main() {
    val user = User("Tom", 18, "beijing")
    val ret = with(user) {
        name = "ABC"
        age = 28
        address = "shanghai"
        "hello"
    }

    println(user) //User(name=ABC, age=28, address=shanghai)
    println(ret) //hello
}
```



## apply

```kotlin
fun <T> T.apply(block: T.() -> Unit): T {
    block()
    return this
}
```

```kotlin
data class User(var name: String, var age: Int, var address: String)

fun main() {
    val user = User("Tom", 18, "beijing")
    user.apply {
        name = "ABC"
        age = 28
        address = "shanghai"
    }

    println(user) //User(name=ABC, age=28, address=shanghai)
}
```



## also

```kotlin
public inline fun <T> T.also(block: (T) -> Unit): T {
    block(this)
    return this
}
```

```kotlin
data class User(var name: String, var age: Int, var address: String)

fun main() {
    val user = User("Tom", 18, "beijing")
    user.also {
        it.name = "ABC"
        it.age = 28
        it.address = "shanghai"
    }

    println(user) //User(name=ABC, age=28, address=shanghai)
}
```



## takeIf

```kotlin
public inline fun <T> T.takeIf(predicate: (T) -> Boolean): T? {
    contract {
        callsInPlace(predicate, InvocationKind.EXACTLY_ONCE)
    }
    return if (predicate(this)) this else null
}
```

```kotlin
data class User(var name: String, var age: Int)

fun main() {
    val user = User("Tom", 19)
    user.takeIf {
        it.age >= 18
    }?.let {
        println(it)
    }
}
```



## takeUnless

与`takeIf`相反

```kotlin
public inline fun <T> T.takeUnless(predicate: (T) -> Boolean): T? {
    contract {
        callsInPlace(predicate, InvocationKind.EXACTLY_ONCE)
    }
    return if (!predicate(this)) this else null
}
```
