[TOC]

# Java调用Kotlin特性

## Java调用Kotlin属性和方法

**Kotlin类：**

```kotlin
class User {
    var name = "无名"
    val age: Int
        get() = 18

    fun eat() {
        println("$name 在吃饭")
    }
}
```

**在Java中调用：**

```java
User user = new User();
user.setName("小明");
user.getAge();
user.eat();
```

## Java调用Kotlin静态属性和方法

**Kotlin类：**

```kotlin
class User {
    companion object {
        var name = "无名"

        @JvmField
        var age = 0

        fun sayHello() {
            println("$name 说hello")
        }

        @JvmStatic
        fun sayInfo() {
            println("姓名：$name，年龄：$age")
        }
    }
}
```

**在Java中调用：**

```java
User.Companion.setName("小明");
User.age = 18;
User.Companion.sayHello();
User.sayInfo();
```

## Java调用Kotlin的@JvmOverloads

**Kotlin代码：**

```kotlin
class User @JvmOverloads constructor(
    val name: String = "",
    val age: Int = 0,
    val address: String = ""
) {
    @JvmOverloads
    fun setInfo(name: String, age: Int = 0, address: String = "") {
    }
}
```

**在Java中调用：**

```java
User user = new User();
user.setInfo("小明");
user.setInfo("小明", 18);
user.setInfo("小明", 18, "北京市");

User user2 = new User("小明");
User user3 = new User("小明", 18);
User user4 = new User("小明", 18, "北京市");
```

## Java调用Kotln顶层函数和扩展函数

**Kotlin代码：**

StringExt.kt

```kotlin
fun String.lastElement(): Char? {
    if (this.isEmpty()) {
        return null
    }
    return this[length - 1]
}

val String.firstElement
    get():Char? {
        return if (isEmpty()) {
            null
        } else {
            get(0)
        }
    }
```

**在Java中调用：**

```java
Character lastElement = StringExtKt.lastElement("hello");
System.out.println(lastElement); //0
Character firstElement = StringExtKt.getFirstElement("hello");
System.out.println(firstElement); //h
```

## Java调用Kotlin高阶函数

**Kotlin代码：**

```kotlin
class User {
    fun showInfo(name: String, age: Int, block: (String, Int) -> Unit, action: (Int) -> Int) {
        block(name, age)
        val count = action(10)
        println("count：$count")
    }
}
```

**在Java中调用：**

```java
new User().showInfo("小明", 18, new Function2<String, Integer, Unit>() {
    @Override
    public Unit invoke(String name, Integer age) {
        System.out.println("name:" + name + ", age:" + age);
        return null;
    }
}, new Function1<Integer, Integer>() {
    @Override
    public Integer invoke(Integer integer) {
        return 100 + integer;
    }
});
```

## Java间接Kotlin协程

在Java中是无法使用Kotlin协程的，我们可以间接的使用协程。

**Kotlin代码：**

```kotlin
class CoroutineDemo {
    fun test1(block: CoroutineScope.() -> Unit) {
        GlobalScope.launch(Dispatchers.IO) {
            block()
        }
    }

    fun test2(block: suspend CoroutineScope.() -> Unit) {
        GlobalScope.launch(Dispatchers.IO) {
            block()
        }
    }
}
```

**在Java中的使用：**

```java
demo.test1(new Function1<CoroutineScope, Unit>() {
    @Override
    public Unit invoke(CoroutineScope coroutineScope) {
        System.out.println("1在协程中执行：" + Thread.currentThread().getName());
        //1在协程中执行：DefaultDispatcher-worker-1 @coroutine#1
        return null;
    }
});

demo.test2(new Function2<CoroutineScope, Continuation<? super Unit>, Object>() {
    @Override
    public Object invoke(CoroutineScope coroutineScope, Continuation<? super Unit> continuation) {
        System.out.println("2在协程中执行：" + Thread.currentThread().getName());
        //2在协程中执行：DefaultDispatcher-worker-3 @coroutine#2
        return null;
    }
});
```

