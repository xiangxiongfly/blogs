[TOC]

# Kotlin Any & Unit & Nothong关系

![请添加图片描述](https://img-blog.csdnimg.cn/f2e880bd7fc740aba037de52651588f9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

## Any?与Any

- Any是所有非空类型的根类型；
- Any?是所有类型的根类型；
- Any?是Any的根类型，但是没有继承关系。在Kotlin中，任何类型被?修饰后，都会变成原类型的父类。

**举例说明**

```kotlin
val a: Any = ""

val b: Any? = a //通过

val x: Any = b //报错
```



## Unit

Kotlin中的Unit与Java的void更为接近，代表一个函数不需要返回值，但Unit远不止于此。

当Unit作为返回值类型时，可以不需要return。



## Nothing

- Nothing与Any?的概念相反，Any?是所有Kotlin类型的父类，Noting是所有类型的子类，也被叫做底类型。
- throw表达式的返回值就是Notiong类型。
- 当一个表达式的返回值是Nothing时，它后面的语句不再有机会执行。

**举例说明**

```kotlin
fun test(): Int = throw Exception()

fun test2(): Any = throw Exception()

fun test3(): Unit = throw Exception()
```



