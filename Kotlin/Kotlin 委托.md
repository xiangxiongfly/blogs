[TOC]

# Kotlin委托

## 概述

- 委托模式是一种抽象的设计模式，将我的工作委托给别人处理，委托模式也是一种替代继承的方式。
- 在Kotlin里，委托分两种：分别是委托类和委托属性。



## 委托类

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

//使用
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
//           参数         通过by将接口实现委托给db
//            ↓             ↓
class OperaDB(db: DB) : DB by db

//使用
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



## 委托属性

- Kotlin 中的“委托类”委托单是接口方法，而“委托属性”委托单是属性的getter、setter。
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
class MyDelegate(private var s: String = "hello") {
//     ㈠                           ㈡                               ㈢   
//     ↓                            ↓                               ↓
    operator fun getValue(thisRef: Test, property: KProperty<*>): String {
        println("调用getValue()方法")
        return s
    }

//      ㈠                          ㈡                                      ㈢  
//      ↓                           ↓                                      ↓
    operator fun setValue(thisRef: Test, property: KProperty<*>, value: String) {
        println("调用setValue()方法")
        s = value
    }
}

//      ㈡   
//      ↓
class Test {
//               ㈢ 
//               ↓
    var text: String by MyDelegate()
}

fun main() {
    val owner = Test();
    println(owner.text)
    owner.text = "world"
    println(owner.text)
}

//调用getValue()方法
//hello
//调用setValue()方法
//调用getValue()方法
//world
```

说明：

- var 修饰的属性，必须有 `getValue`、`setValue()` 这2个方法，必须是 `operator` 关键字修饰。
- 第`㈡ `处表示text属性必须是Test类中。
- 第`㈢`处表示text属性必须是String类型。



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

- 指将属性A委托给属性B。
- 有利于处理软件版本之间的兼容问题。

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
- 当调用newName的`get()`方法时，会返回oldName的值，也就是调用oldName的`get()`方法；当调用newName的`set()`方法时，会将值传递给oldName，也就是调用oldName的`set()`方法。

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

懒加载，顾名思义，就是对于一些需要消耗计算机资源的操作，我们希望它在被访问的时候才去触发，从而避免不必要的资源开销。

```kotlin
val data: String by lazy {
    request()
}

fun request(): String {
    println("执行请求")
    return "hello world"
}

fun main() {
    println(data)
    println(data)
}

//执行请求
//hello world
//hello world
```



### 可观察属性 

每次赋值时(在执行赋值之后)都会调用处理程序。它有三个参数：初始值、旧值和新值:

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
    val user = User(
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

如果在属性委托之前再做一些额外的判断工作，我们可以使用 provideDelegate 来实现。

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



## 案例

### 属性可见性封装

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



### 数据与View绑定

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



### ViewModel委托

```kotlin
private val mainViewModel: MainViewModel by viewModels()
```

