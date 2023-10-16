[TOC]



# Kotlin 反射

## 概述

Kotlin反射具备这三个特性：

- 感知程序的状态，包含程序的运行状态，还有源码结构；
- 修改程序的状态；
- 根据程序的状态，调整自身的决策行为。



## 添加依赖库

在 Kotlin 中，反射库并没有直接集成到标准库中。必须引入这个依赖：

```
implementation "org.jetbrains.kotlin:kotlin-reflect"
```



## 反射结构图

![在这里插入图片描述](https://img-blog.csdnimg.cn/c0e40a3658094e638262d86ab9a94c6a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_14,color_FFFFFF,t_70,g_se,x_16)

## KClass

KClass 代表了一个 Kotlin 的类。

### 获取KClass

`obj::class`  这是 Kotlin 反射的语法，我们叫做类引用，通过这样的语法，我们就可以读取一个变量的“类型信息”，并且就能拿到这个变量的类型，它的类型是 KClass。

在Kotln中，字节码对应的是KClass类，如果想要使用Java中的反射，需要首先获取Java的Class的实例，并且可以通过`.java`和`.kotlin`方法在KClass和Class之间互相转换。

```kotlin
//获取Kotlin的Class对象
Student::class
student::class

//获取Java的Class对象
student.javaClass

//Java Class -> Kotlin Class
student.javaClass.kotlin

//Kotlin Class -> Java Class
Student::class.java
```

### 创建对象

```kotlin
val stu: Student = kClass1.createInstance()
```

### 遍历构造函数

```kotlin
Student::class.constructors.forEach { 
    println(it)
}

//fun <init>(kotlin.String, kotlin.Double, kotlin.Char): com.example.lib_kt.Student
```

### 主要成员

```kotlin
kClass.simpleName //类名，匿名内部类则为null

kClass.qualifiedName //全类名

kClass.members //获取所有成员属性和方法，返回类型是Collection<KCallable<*>>

kClass.memberProperties //获取所有属性

kClass.memberFunctions //获取所有函数

kClass.constructors //获取所有构造函数，返回类型是Collection<KFunction<T>>

kClass.nestedClasses //获取所有嵌套类，返回类型是Collection<KClass<*>>

kClass.visibility //类的可见性修饰符，如PUBLIC/PROTECTED/INTERNAL/PRIVATE

kClass.isFinal //是否final修饰

kClass.isOpen //是否open修饰

kClass.isAbstract //是否抽象

kClass.isSealed //是否密封

kClass.isData //是否数据类

kClass.isInner //是否内部类

kClass.isCompanion //是否伴生对象

kClass.isFun //是否函数式接口

kClass.isValue //是否Value Class
```



## KCallable

KCallable 代表了 Kotlin 当中的所有可调用的元素，如函数、属性、构造函数。

### 主要成员

```kotlin
kCallable.name //属性和函数的名称

kCallable.parameter //获取参数，类型是List<KParameter>

kCallable.returnType //返回值类型，类型是KType

kCallable.typeParameters //返回泛型类型，类型是List<KTypeParameter>

kCallable.visibility //可见性

kCallable.isSuspend //是否挂起函数

kCallable.call(student, "123") //函数调用
```



## KParameter

KParameter 代表了 KCallable 的参数。

### 主要成员

```kotlin
kParameter.index //参数的下标，从0开始

kParameter.name //参数名

kParameter.type //参数类型

kParameter.kind //参数种类，INSTANCE指对象实例，EXTENSION_RECEIVER指扩展接收者，VALUE指实际的参数值
```



## KType 

KType 代表了 Kotlin 当中的类型。

### 主要成员

```kotlin
kParameter.type.classifier //类型，Kotlin的类型即KClass

kParameter.type.isMarkedNullable //是否可空

kParameter.type.arguments //类型的泛型参数
```



## 获取对象属性

```kotlin

data class Student(
    val name: String,
    val age: Int,
    val sex: Boolean
)

data class School(
    val name: String,
    var address: String
)

fun readMembers(obj: Any) {
    obj::class.memberProperties.forEach {
        println("${obj::class.simpleName}.${it.name}=${it.getter.call(obj)}")
    }
}

fun main() {
    val student = Student("小明", 5, true)
    val school = School("光明小学", "广州市")
    readMembers(student)
    println("-------")
    readMembers(school)
}

//Student.age=5
//Student.name=小明
//Student.sex=true
//-------
//School.address=广州市
//School.name=光明小学
```



## 修改对象属性值

```kotlin
fun modifyAddressMember(obj: Any, address: String) {
    obj::class.memberProperties.forEach {
        if (it.name == "address" &&
            it is KMutableProperty1 &&
            it.setter.parameters.size == 2 &&
            it.getter.returnType.classifier == String::class
        ) {
            it.setter.call(obj, address)
        }
    }
}

fun main() {
    val school = School("光明小学", "广州市")
    modifyAddressMember(school, "上海市")
    println(school)
}

//School(name=光明小学, address=上海市)
```



## 案例

### Java对象转Map


```java
class Student {
    String name;
    int age;
    String address;
    String school;

    public Student(String name, int age, String address, String school) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.school = school;
    }
}
```

```java
public static <T> Map<String, Object> toMap(T t) {
    Field[] declaredFields = t.getClass().getDeclaredFields();
    Map<String, Object> map = new HashMap<>();
    for (Field field : declaredFields) {
        field.setAccessible(true);
        try {
            map.put(field.getName(), field.get(t));
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }
    return map;
}
```

```java
public static void main(String[] args) {
    Student student = new Student("小红", 18, "北京市", "中学");
    Map<String, Object> map = toMap(student);
    System.out.println(map);
}

//{address=北京市, school=中学, name=小红, age=18}
```

### Kotlin对象转Map

```kotlin
data class Student(val name: String, val age: Int, val address: String, val school: String)
```

```kotlin
object Mapper {
    fun <T : Any> toMap(t: T): Map<String, Any?> {
        return t::class.memberProperties.map { m ->
            val p = m as KProperty<*>
            p.name to p.call(t)
        }.toMap()
    }
}
```

```kotlin
fun main() {
    val student = Student("小明", 18, "北京市", "大学")
    val map = Mapper.toMap(student)
    println(map)
}

//{address=北京市, age=18, name=小明, school=大学}
```

