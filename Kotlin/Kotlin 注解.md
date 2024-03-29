[TOC]

# Kotlin 注解

## 概述

Kotln的注解继承自Java，因此Kotlin完全兼容Java的注解，注解就是为了给代码提供元数据。合理使用注解可以提高编码效率，带来性能的提升。

[Java注解总结](https://blog.csdn.net/qq_14876133/article/details/115743314)



## 元注解

Kotlin 常见的元注解有四个：

- @Target，这个注解是指定了被修饰的注解都可以用在什么地方，也就是目标；
- @Retention，这个注解是指定了被修饰的注解是不是编译后可见、是不是运行时可见，也就是保留位置；
- @Repeatable，这个注解是允许我们在同一个地方，多次使用相同的被修饰的注解，使用场景比较少；
- @MustBeDocumented，指定被修饰的注解应该包含在生成的 API 文档中显示，这个注解一般用于 SDK 当中。

### @Target元注解

```kotlin
public enum class AnnotationTarget {
    //用于类、接口、object对象表达式、注解类
    CLASS, 
    //用于给注解添加注解
    ANNOTATION_CLASS, 
    //用于对象属性
    PROPERTY, 
    //作用于字段
    FIELD, 
    //局部变量
    LOCAL_VARIABLE, 
    //函数或构造函数的参数
    VALUE_PARAMETER, 
    //作用于构造函数
    CONSTRUCTOR, 
    //作用于函数
    FUNCTION, 
    //属性的getter函数
    PROPERTY_GETTER, 
    //属性的setter函数
    PROPERTY_SETTER, 
    //作用于类、接口、枚举
    TYPE, 
    //用于对象表达式
    EXPRESSION,
    //用于File对象
    FILE, 
}
```



### @Retention元注解

```kotlin
public enum class AnnotationRetention {
    //只保留在源码，编译后不可见
    SOURCE, 
    //编译后可见，保留在字节码中，运行时不可见
    BINARY, 
    //编译后可见，运行时可见，可以通过反射获取信息
    RUNTIME 
}
```



### @Deprecated废弃

- @Deprecated 只能作用于这些地方：类、 函数、 属性、注解类、构造器、属性 getter、属性 setter、类型别名。
- @Deprecated 这个类当中还包含了几个成员：
  - message 代表了废弃的提示信息；
  - replaceWith 代表了应该用什么来替代废弃的部分；
  - level 代表警告的程度，分别是 WARNING、ERROR、HIDDEN。



## 注解的使用

**方式一：**

```kotlin
@Deprecated(
    message = "请使用CalculatorV2类",
    replaceWith = ReplaceWith("CalculatorV2"),
    level = DeprecationLevel.ERROR
)
class Calculator {
    fun add(a: Int, b: Int) = a - b
}

class CalculatorV2 {
    fun add(a: Int, b: Int) = a + b
}
```

**方式二：**

```kotlin
@Target(
    AnnotationTarget.CLASS,
    AnnotationTarget.FUNCTION,
    AnnotationTarget.FUNCTION,
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.EXPRESSION
)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
@Repeatable
annotation class MyAnnotation()
```

```kotlin
@MyAnnotation
@MyAnnotation
class User {

    @MyAnnotation
    fun fly(@MyAnnotation desc: String) {
    }
}
```



## 自定义注解

### 声明注解

```kotlin
@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Label(val value: String)
```

```kotlin
@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Formatter(
    val format: String = "yyyy-MM-dd HH:mm:ss",
    val timezone: String = "GMT"
)
```



### 使用注解

```kotlin
data class User(
    @Label("姓名") private var name: String,
    @Label("生日") @Formatter(format = "yyyy/MM/dd") private var birthday: Date,
    @Label("今日") @Formatter private var today: Date
)
```



### 解析注解

```kotlin
fun processAnnotation(obj: Any): String {
    val kClass = obj::class //获取Kotlin字节码对象
    val builder = StringBuilder()

    //遍历所有属性
    for (memberProperty in kClass.memberProperties) {
        //开放权限
        memberProperty.isAccessible = true

        //获取属性值
        var value = memberProperty.call(obj)

        //判断是否有Label注解
        if (memberProperty.hasAnnotation<Label>()) {

            //获取Label注解
            val label: Label? = memberProperty.findAnnotation<Label>()
            label?.let {
                val name = it.value //获取Label注解的value值

                //判断是否有Formatter注解
                if (memberProperty.returnType.classifier == Date::class && memberProperty.hasAnnotation<Formatter>()) {
                    //获取Formatter注解
                    val formatter: Formatter? = memberProperty.findAnnotation<Formatter>()
                    formatter?.let { f ->
                                    val format = f.format //获取Formatter注解的format值
                                    val timezone = f.timezone //获取Formatter注解的timezone值
                                    val simpleDateFormat = SimpleDateFormat(format)
                                    simpleDateFormat.timeZone = TimeZone.getTimeZone(timezone)
                                    value = simpleDateFormat.format(value)
                                   }
                }

                builder.append("$name: $value \n")
            }
        }
    }
    return builder.toString()
}
```

```kotlin
fun main() {
    val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val user = User("小明", sdf.parse("2008-8-8 1:2:3"), Date())
    val result = processAnnotation(user)
    println(result)
}

//生日: 2008/08/07 
//姓名: 小明 
//今日: 2021-12-20 07:56:51
```

