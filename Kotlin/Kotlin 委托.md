[TOC]

# Kotlin委托

## 概述

- 委托模式是一种抽象的设计模式，将我的工作委托给别人处理，委托模式也是一种替代继承的方式。
- 在Kotlin里，委托分两种：分别是类委托和属性委托。



## 类委托

### 普通实现

```kotlin
interface DB {
    fun save()
}

class FileDB : DB {
    override fun save() {
        println("文件存储")
    }
}

class SqlDB : DB {
    override fun save() {
        println("数据库存储")
    }
}

//委托类
class OperaDB(var db: DB) : DB {
    override fun save() {
        db.save()
    }
}

fun main() {
    OperaDB(FileDB()).save()
    OperaDB(SqlDB()).save()
}

//文件存储
//数据库存储
```



### 委托实现

语法格式：`<类>:<约束接口> by <实现类的实例>`

```kotlin
//委托类
class OperaDB(db: DB) : DB by db

fun main() {
    OperaDB(FileDB()).save()
    OperaDB(SqlDB()).save()
}

//文件存储
//数据库存储
```

如果不用传多个不同的实例，可以去掉构造函数里的参数，直接在`by`关键字后面添加具体的实现。

```kotlin
class OperaDB : DB by FileDB()

fun main() {
    OperaDB().save()
}
```



## 属性委托

- 属性委托是将属性的`get`/`set`方法的逻辑委托给一个类进行实现。
- `val属性`必须有`getValue`方法，`var属性`必须有`setValue`和`getValue`方法，通过`operator`关键字修饰。

语法格式：`val/var <属性名> : <类型> by <表达式>`

### 方式一

```kotlin
class Delegate {
    /**
     * thisRef: 表示被委托的对象
     * property: 表示被委托对象自身的描述
     */
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
    }

    /**
     * thisRef: 表示被委托的对象
     * property: 表示被委托对象自身的描述
     * value: 是将要赋予的值
     */
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
    }
}
```


```kotlin

class MyDelegate {
    operator fun getValue(thisRef: Any, property: KProperty<*>): String {
        println("getValue(), $thisRef, ${property.name}")
        return "hello 属性委托"
    }

    operator fun setValue(thisRef: Any, property: KProperty<*>, value: String) {
        println("setValue(), $thisRef, ${property.name}, $value")
    }
}

class Test {
    var p: String by MyDelegate()
}

fun main() {
    val test = Test()
    println(test.p) //会调用getValue函数
    test.p = "abcd" //会调用setValue()函数
}

//getValue(), com.example.lib_kt.Test@1f17ae12, p
//hello 属性委托
//setValue(), com.example.lib_kt.Test@1f17ae12, p, abcd
```



### 方式二

上面的代码可以简写为：

```kotlin
public fun interface ReadOnlyProperty<in T, out V> {
    public operator fun getValue(thisRef: T, property: KProperty<*>): V
}

public interface ReadWriteProperty<in T, V> : ReadOnlyProperty<T, V> {
    public override operator fun getValue(thisRef: T, property: KProperty<*>): V

    public operator fun setValue(thisRef: T, property: KProperty<*>, value: V)
}
```

```kotlin
class MyDelegate : ReadWriteProperty<Any, String> {
    override fun getValue(thisRef: Any, property: KProperty<*>): String {
        println("getValue(), $thisRef, ${property.name}")
        return "hello 属性委托"
    }

    override fun setValue(thisRef: Any, property: KProperty<*>, value: String) {
        println("setValue(), $thisRef, ${property.name}, $value")
    }
}

class Test {
    var p: String by MyDelegate()
}

fun main() {
    val test = Test()
    println(test.p)
    test.p = "hello"
}

//getValue(), com.example.lib_kt.Test@c4437c4, p
//hello 属性委托
//setValue(), com.example.lib_kt.Test@c4437c4, p, hello
```



## 标准委托

Kotlin提供了好几种标准委托，其中包括了：

- 两个属性之间的直接委托
- by lazy 懒加载委托
- Delegatre.observable 观察者委托
- by map 映射委托。

### 直接委托

有利于处理软件版本之间的兼容问题。

```kotlin
class Test {
    var oldName: Int = 0
    var newName: Int by ::oldName
}

fun main() {
    val test = Test()
    test.newName = 100
    println(test.oldName)
}

//100
```

说明：

- 这里指将newName的getter、setter属性都委托给oldName的getter、setter，`::oldName`表示属性引用。
- 当调用newName的`get()`方法时，会返回oldName的值；当调用newName的`set()`方法时，会将值传递给oldName，也就是调用oldName的`set()`方法。

等价于以下代码：

```kotlin
class Test {
    var oldName: Int = 0
    var newName: Int
        get() = oldName
        set(value) {
            oldName = value
        }
}
```



### 懒加载

```kotlin
val data: String by lazy {
    request()
}

fun request(): String {
    println("获取数据")
    return "hello world"
}

fun main() {
    println(data)
    println(data)
}

//获取数据
//hello world
//hello world
```



### 可观察属性 

```kotlin
class User {
    var name: String by Delegates.observable("unknow") { 
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    println(user.name)
    user.name = "hello"
    user.name = "world"
}

//unknow
//unknow -> hello
//hello -> world
```



### 映射属性

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}

fun main() {
    var user = User(
        mapOf(
            "age" to 18,
            "name" to "abc"
        )
    )

    println(user.name)
    println(user.age)
}

//abc
//18
```



## 提供委托

可以使用`provideDelegate`在属性委托之前做一些额外的判断，这样可以实现根据不同的委托属性的名称，使用不同委托类。

```kotlin
class StringDelegate(private var s: String = "hello") : ReadWriteProperty<Any, String> {
    override fun getValue(thisRef: Any, property: KProperty<*>): String {
        return s
    }

    override fun setValue(thisRef: Any, property: KProperty<*>, value: String) {
        s = value
    }
}

class SmartDelegator {
    operator fun provideDelegate(
        thisRef: Any,
        prop: KProperty<*>
    ): ReadWriteProperty<Any, String> {
        return if (prop.name.contains("log")) {
            StringDelegate("log")
        } else {
            StringDelegate("normal")
        }
    }
}

class Test {
    var normalText: String by SmartDelegator()
    var logText: String by SmartDelegator()
}

fun main() {
    val test = Test()
    println(test.normalText)
    println(test.logText)
}

//normal
//log
```



## 其他

### 增加可见性封装

```kotlin
class Model {
    private val _data: MutableList<String> = mutableListOf()

    val data: List<String> by ::_data

    fun load() {
        _data.add("hello")
    }
}

fun main() {
    val model = Model()
    model.load()
    model.load()
    println(model.data)
}

//[hello, hello]
```

说明：

- `_data`属性是MutableList类型，是可变集合，`data`是List类型，是不可变集合。
- 通过委托，将`data`的get方法委托给`_data`，这样外部访问只能查看数据。



### View和数据绑定

```kotlin
operator fun TextView.provideDelegate(value: Any?, prop: KProperty<*>) =
    object : ReadWriteProperty<Any?, String?> {
        override fun getValue(thisRef: Any?, property: KProperty<*>): String {
            return text.toString()
        }

        override fun setValue(thisRef: Any?, property: KProperty<*>, value: String?) {
            text = value
        }
    }
```

```kotlin
val textView = findViewById<TextView>(R.id.textView)
var message: String? by textView
textView.text = "hello"
println(message)
message = "world"
println(textView.text)

//hello
//world
```



### 借助委托创建ViewModel

```kotlin
private val mainViewModel: MainViewModel by viewModels()
```

