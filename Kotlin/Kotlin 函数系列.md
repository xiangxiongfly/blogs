[TOC]



# Kotlin 函数系列



## 函数

### 基本使用

Koltin中函数使用`fun`关键字，函数名紧跟其后。

```kotlin
//代码块函数体
fun add(a: Int, b: Int): Int {
    return a + b
}

//表达式函数
fun add(a: Int, b: Int) = a + b

//可以将lambda表达式存储在一个变量中
val add = { a: Int, b: Int -> a + b }
```



### 命名参数

命名参数指在调用函数时传入形参的名。

```kotlin
fun showInfo(name: String, age: Int) {
    println("name:$name,age$age")
}

showInfo("Tom", 18)
showInfo(age = 18, name = "Tom") //命名参数
```



### 默认参数

```kotlin
fun showInfo(name: String = "保密", age: Int = 0) {
    println("name:$name,age$age")
}

showInfo()
showInfo(age = 18, name = "Tom")
```



### 可变参数

```kotlin
fun showInfo(vararg text: String) {
    text.forEach { println(it) }
}
```

```kotlin
showInfo("hello", "Android", "Kotlin")

val list = arrayOf("hello", "world")
showInfo(*list)
```



### 数组转可变长参数

```kotlin
fun main() {
    val arr = arrayOf("a", "b", "c")
    myfun(*arr)

}

fun myfun(vararg args: String) {
    args.forEach {
        println("- $it")
    }
}
```

```
a
b
c
```



## 函数类型

- 函数类型（Function Type）就是函数的类型。
- 在Kotlin中，函数是一等公民，变量可以有类型，函数也是可以有的。
- 将函数的“参数类型”和“返回值类型”抽象出来就得到了函数类型。

```kotlin
//  	  (Int,    Int) -> Float   这就是add函数的类型
//			↑ 	    ↑	    ↑
fun add(a: Int, b: Int): Float { 
    return (a + b).toFloat() 
}
```

说明：这个函数的参数类型是两个`Int`类型，返回值类型是`Float`类型，所以函数类型是 `(Int, Int) -> Float`。



## Lambda

### 定义

- Lambda可以理解为函数的简写
- Lambda表达式必须用`{}`包裹
- Lambda表达式声明了参数和返回值类型，那么Lambda变量可以省略类型声明
- 返回值为函数体的最后一行代码

```
{参数名1: 参数类型, 参数名2: 参数类型 -> 函数体}
```



### SAM转换

- SAM是Single Abstract Method的缩写，意思是只有一个抽象方法的类或接口。但在Kotlin和Java 8 中，**SAM表示只有一个抽象方法的接口**。
- 只要符合SAM要求的接口，编译器就能进行SAM转换，我们可以使用Lambda表达式简写接口类型的参数。
- 当一个函数的参数是SAM的情况下， 我们即可以用匿名内部类的方式传参，也可以用Lambda方式传参。

```java
//OnClickListener是一个SAM接口
public void setOnClickListener(@Nullable OnClickListener l) {

}

//编译器会SAM转换为
fun setOnClickListener(l: ((View!) -> Unit)?)
```

```kotlin
//可以传入匿名内部类
button.setOnClickListener(object : View.OnClickListener {
    override fun onClick(v: View?) {
        println("hello world")
    }
})
```

```kotlin
//可以传入Lambda表达式
button.setOnClickListener { println("hello world") }
```



### 无参数

```kotlin
fun say() {
    println("sayHello")
}

//简化为
val say = { println("sayHello") }
```

### 有参数

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

//等价于
val sum: (Int, Int) -> Int = { a, b -> a + b }

//等价于
val sum = { a: Int, b: Int -> a + b }
```

lambda表达式可以调用：

```kotlin
lambda.invoke()
```

### 匿名函数

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

//等价于
val sum = fun(a: Int, b: Int): Int {
    return a + b
}
```

### 自运行Lambda

```kotlin
val ret = { a: Int, b: Int -> a + b }(1, 2)
```



## 高阶函数

如果一个函数的“参数”或者“返回值”的类型是函数类型，那这个函数就是高阶函数。

```kotlin
fun sum(x: Int): (Int) -> Int {
    return { y: Int -> x + y }
}

//等价于
fun sum(x: Int) = { y: Int -> x + y }
```

```kotlin
//调用
val result = sum(1)(2)
```



## 带接收者的函数类型

```kotlin
data class User(val name: String, val age: Int)

//                                       带接收者的函数类型
//                                   ├        ↓          ┤
fun User.operate(msg: String, block: User.(String) -> Unit): User {
    //                                ↑
    //                             接收者类型
    block(msg)
    return this
}

fun main() {
    val user = User("小明", 18)
    user.operate("hello world") {
        println(it)
        println(this)
        println("姓名：${name}，年龄：${age}")
    }
}

//hello world
//User(name=小明, age=18)
//姓名：小明，年龄：18
```

说明：

- `block` 是函数类型的变量。
- block中的 `User` 是接收者类型。
- `this`指接收者类型的对象，通过编译器注入的，是可以被省略的。
- `it` 是函数中的唯一参数。



## 闭包

一个函数内部申明或返回一个函数，那么这个函数称为闭包。

在Kotlin中，变量的作用域只有两种：全局变量和局部变量。

- 全局变量：函数内部和函数外部都可以直接访问。
- 局部变量：只有在函数内部可以方位。

闭包的设计就是为了能让开发者在函数外部访问函数内部的局部变量。

```kotlin
fun main() {
    val t = test() //1
    t()//2
    t()//3
}

fun test(): () -> Int {
    var a = 1
    println(a)
    return fun(): Int {
        a++
        println(a)
        return a
    }
}
```



## Kotlin实现接口回调

### Java思想实现

```kotlin
//定义接口
interface ICallback {
    fun onSuccess(msg: String)
    fun onError(err: String)
}
```

```kotlin
//监听事件
class TestCallback {
    private var mCallback: ICallback? = null

    fun setCallback(callback: ICallback) {
        mCallback = callback
    }

    fun test() {
        mCallback?.onSuccess("成功")
        mCallback?.onError("失败")
    }
}
```

```kotlin
fun main() {
    val testCallback = TestCallback()
    testCallback.setCallback(object : ICallback {
        override fun onSuccess(msg: String) {
            println(msg)
        }

        override fun onError(err: String) {
            println(err)
        }

    })
    testCallback.test()
}
```



### Kotlin高阶函数思想实现

去掉了接口和匿名内部类

```kotlin
class TestCallback {
    private var success: ((String) -> Unit)? = null
    private var error: ((String) -> Unit)? = null

    fun setCallback(success: ((String) -> Unit), error: ((String) -> Unit)) {
        this.success = success
        this.error = error
    }

    fun test() {
        success?.invoke("yes")
        error?.invoke("no")
    }
}
```

```kotlin
fun main() {
    val testCallback = TestCallback()
    testCallback.setCallback({ println(it) }, { println(it) })
    testCallback.test()
}
```

