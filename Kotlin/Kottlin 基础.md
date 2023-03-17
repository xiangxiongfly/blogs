[TOC]

# Kotlin基础

## 概述

**Java的问题**

- 语法表现差：Java 1.8之前不支持Lambda表达式，匿名内部写法繁琐，不支持高阶函数，不支持参数默认值等等。
- 可读性较差：Java中嵌套多个Callback回调时，可读性变得非常差并难以维护。
- 隐藏问题：隐式转换，如字符串变量赋值给整型变量，但编译不会报错；Java的内部类持有外部类的引用导致内存泄露的风险。
- 线程与并发的复杂机制。

**Kotlin的优势**

- 极高的编码效率：相比Java更加简洁，同时一定程度上避免了空指针问题。
- 强大的兼容性：与Java完全兼容。
- 工具友好，发展前景广阔。

**Kotlin与Java的思维差异**

- 不变性思维：虽然Java也存在final不变性，但Kotlin却做到了极致，Kotlin要求我们在定义一个变量、集合是就明确它的不变性。
- 空安全思维：Kotlin的类型可分为：可空和不可控类型。
- 表达式思维：Kotlin中的if、else、when等语句可以作为表达式使用，简化了代码逻辑。
- 函数思维：在Kotlin中，函数是一等公民。



Kotlin在线编译器：[https://play.kotlinlang.org/](https://play.kotlinlang.org/)



## 主程序入口

`main`函数是主程序入口，`args: Array<String>`在Kotlin1.3后可以省略。

```kotlin
fun main(args: Array<String>) {
    println("hello Kotlin")
    var a = readLine()
    println("输入的内容是：$a")
}
```



## 变量声明

Kotlin声明变量需要两个关键字`var`和`val`:

- var：表示可变变量，相当于Java中的普通变量。
- val：表示不可变变量，值在初始化后不能再次修改，相当于Java中的final变了，尽可能多的使用val。



## 数据类型

在Kotlin里，一切都是对象，Kotlin完全抛弃Java的基本数据类型，全部使用对象类型，且类型名放在变量名的后面。

| Java基本数据类型 | Kotlin对象数据类型 |
| ---------------- | ------------------ |
| int              | Int                |
| long             | Long               |
| short            | Short              |
| float            | Float              |
| double           | Double             |
| boolean          | Boolean            |
| char             | Char               |
| byte             | Byte               |



### 类型推导

Kotlin支持类型推导，大部分情况下，变量类型可以省略不写。

```kotlin
var a = 1 //自动推导为Int类型
var b = "123" //自动推导为String类型
```



### 类型判断

Kotlin中的`is`类似于Java里的`instanceOf`，Kotlin增加了智能转换。

```kotlin
when (data) {
    is String -> {
        //智能转换
        //data自动转换为String
        data.length
    }
    is Int -> {
        println("Int类型")
    }
    is Boolean -> {
        println("Boolean类型")
    }
    !is Float -> {
        println("不是Float类型")
    }
    else -> {
        println("未知类型")
    }
}
```



### 类型转换

Kotlin抛弃了隐式转换，更推崇显式转换，类型转换可以借助toByte()、toShort()、toInt()、toLong()、toFloat()、toDouble()、toChar() 等函数。

```kotlin
val a: Int = 100
val b: Long = a // 编译器报错
```

```kotlin
val a: Int = 100
val b: Long = a.toLong() // 编译通过
```



## 逻辑控制

### 条件语句

**if**

```kotlin
fun maxNumber(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
```

```kotlin
//if表达式
fun maxNumber(a: Int, b: Int): Int {
    return if (a > b) a else b
}
```

**when**

```kotlin
fun getScore(score: Int): String {
    when (score) {
        0 -> return "缺考"
        in 1..59 -> return "不及格"
        in 60..80 -> return "及格"
        in 80..99 -> return "优秀"
        100 -> return "满分"
        else -> return "超神"
    }
}
```

```kotlin
//when表达式
fun getScore(score: Int) = when {
    score == 0 -> "缺考"
    score in 1..59 -> "不及格"
    score in 60..80 -> "及格"
    score in 80..99 -> "优秀"
    score == 100 -> "满分"
    else -> "超神"
}
```



### 循环语句

### 区间

```kotlin
//[1-10]
for (i in 1..10) {
    print(i)
}

//[1-9]
for (i in 1 until 10) {
    print(i)
}

//输出：13579
for (i in 1 until 10 step 2) {
    print(i)
}

//降序：[10-1]
for (i in 10 downTo 1) {
    print(i)
}
```

### while

```kotlin
while (布尔表达式) {
    //循环内容
}

do {
    //循环内容
} while (布尔表达式)
```

### in

`in`关键字可以检查一个元素是否在区间或集合中。

```kotlin
"a" in "abc" 

"a" in listOf("a", "b", "c")

1 in 0..3 
```

### if-else代替传统三元运算符

```kotlin
//三元运算符
val a = 1
val b = 2
val c = if (a > b) a else b
```



## 比较判断

kotlin存在结构相等和引用相等两种判断。

- `==`或`equals()`比较的是两个对象的内容是否相同
- `===`比较的是两个对象的引用是否相同

```kotlin
val a = 1
val b = 1
println(a == b) //输出true
println(a.equals(b)) //输出true

var p1 = Person("xiaobai", 11)
var p2 = Person("xiaobai", 11)
println(p1 == p2) //true
println(p1.equals(p2)) //true
println(p1 === p2) //false
```



## 类型检查和智能转换

在Java中，可以使用`instanceof`关键字判断是否该类型；在Kotlin中，可以使用`is`关键字判断。

Smart Casts 智能转换可以将一个变量的类型转变为另一种类型，它是隐式完成的。

```kotlin
open class Animal

class Dog : Animal() {
    fun eatBone() {
        println("吃骨头")
    }
}

class Cat : Animal() {
    fun eatFish() {
        println("吃鱼")
    }
}
```

```kotlin
when (animal) {
    is Dog -> animal.eatBone()
    is Cat -> animal.eatFish()
}
```



## 空安全

- 在Java中`NullPointerException`异常比较常见，Kotlin的优点就是尽量避免空指针异常，Kotlin将空指针异常的检查提前到了编译期间，这样如果我们的程序存在空指针异常的风险，编译的时候会直接报错，修正后才能成功运行，这样可以保证程序在运行时期不会出现空指针异常了。
- Kotlin强制要求开发者在定义变量时，指定这个变量是否可能为null。

**Kotlin分为可空类型和非空类型：**

| 运算符 | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| ?      | 可空类型，在类型后面添加?                                    |
| ?.     | 空安全操作符，当前对象不为null时正常调用，否则返回null       |
| ?:     | Elvis运算符，当前对象不为null时返回左边表达式结果，否则返回右侧表达式结果 |
| as?    | 安全转换运算符，将值转换为指定类型，若值不是指定类型返回null |
| !!     | 非空断言，将值转换为非空类型，值为null抛出KotlinNullPointerException异常 |

**?**

```kotlin
//不可空类型
var name: String = "hello"
name = null //编译失败

//可空类型
var name: String? = "hello"
name = null //编译成功
```

**?.**

```kotlin
//?. 运算符
var name: String? = "hello"
println(name?.length)//5
```

**?:**

```kotlin
//?: elvis运算符，对三元运算符的升级
val a: String? = "abc"
val b = a ?: "default"
```

**as?**

```kotlin
//as? 运算符
var data: String = "Tom"
var name = data as? String
println(name)//Tom
var age = data as? Int
println(age)//null
```

**!!**

```kotlin
//!! 运算符
val data: String = "kotlin"
println(data!!.length)//6
val data: String? = null
println(data!!.length)//KotlinNullPointerException
```



## 延迟初始化

在Kotlin中，可以使用`lateinit`和`by lazy`实现延迟初始化效果。

### lateinit

- 用var声明的变量可以用`lateinit`实现延迟初始化
- `::value.isInitialized`用于判断变量是否初始化

```kotlin
lateinit var value: String
println(value)

/*
抛出异常：
Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property value has not been initialized
*/
```

```kotlin
println(::value.isInitialized)

/*
 输出信息：
 false
 */
```

```kotlin
lateinit var value: String
value = "hello world"
println(value)

/*
输出信息：
hello world
*/
```



### by lazy

- 用val声明的变量可以用`by lazy`实现延迟初始化

```kotlin
val value: String by lazy {
    var i = "hello"
    i += "_world"
    println("数据处理完了")
    i
}

println(value) //第一次执行
println(value) //第二次执行


/*
输出信息：
数据处理完了
hello_world
hello_world
*/
```



## :: 双冒号

双冒号表示引用关系

```kotlin
data class Book(val name: String)
```

```kotlin
val getBook = ::Book
val book = getBook("我的kotlin")
print(book.name) //我的kotlin
```

```kotlin
val list = listOf(
    Book("Java"),
    Book("Kotlin")
).map(Book::name)

println(list) //[Java, Kotlin]
```



## 展开操作符

可以使用`*`展开操作法展开数组。

```kotlin
val arr1 = arrayOf(1, 2, 3, 4)
val arr2 = listOf(0, *arr1)
println(arr2)

/*
[0, 1, 2, 3, 4]
 */
```

