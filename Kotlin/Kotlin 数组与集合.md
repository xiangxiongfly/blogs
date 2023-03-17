[TOC]



# Kotlin 数组

## 创建

在Kotlin中，我们一般使用`arrayOf()`创建数组。

```kotlin
val arr = arrayOf(1, 'a', "hello")

val strArr = arrayOf<String>("abc", "efg", "hij")

val intArr = intArrayOf(1, 2, 3)
```



## 常用属性

```kotlin
// 获取数组大小
arr.size

//访问数组
arr[0]
```



# Kotlin 集合

## 概述

Kotlin的集合都是以Java的集合库为基础来构建的，只是Kotln通过扩展函数增强了它，Kotlin的集合设计观念与Java不同，Kotlin分为只读集合和可变集合。

- **只读集合**由`kotlin.collections.Collection`接口实现，只读集合的元素在一般情况下是不能修改的。
- **可变集合**由`kotlin.collections.MutableCollection`接口实现，它继承于`kotlin.collections.Collection`接口。可变集合的元素是可以改变的，通常会有一个`Mutable`前缀。

| 集合元素 | 只读   | 可变                                                 |
| -------- | ------ | ---------------------------------------------------- |
| List     | listOf | mutableListOf / arryListOf                           |
| Set      | setOf  | mutableSetOf / hashSetOf / linkedSetOf / sortedSetOf |
| Map      | mapOf  | mutableMapOf / hashMapOf / linkedMapOf / sortedMapOf |



## List

- List表示一个有序且可重复的列表。
- 元素的存储方式是线性存储的。

### 创建

```kotlin
//方式一
val list = ArrayList<String>()
list.add("A")
list.add("B")
list.add("C")

//方式二：推荐
val list = listOf("A", "B", "C")
```

### 遍历集合

```kotlin
//遍历元素
for (item in list) {
    println(item)
}

//遍历下标和值
for (index in list.withIndex()) {
    println("index=${index.index} ,value=${index.value}")
}

//遍历下标和值
for ((i, value) in list.withIndex()) {
    println("index=$i ,value=$value")
}

//foreach函数
list.forEach {
    println(it)
}
```

### 增删改操作

```kotlin
val list = mutableListOf("A", "B", "C")

//增加
list.add("D")

//修改
list.set(0, "a")

//删除
list.removeAt(0)
list.remove("A")
```



## Set

- Set表示一个无序且不可重复的集合。

### 创建

```kotlin
//方式一
val set = HashSet<String>()
set.add("A")
set.add("B")
set.add("C")

//方式二：推荐
val set = setOf("A", "B", "C")
```



### 遍历集合

```kotlin
for (item in set) {
    println(item)
}

set.forEach {
    println(it)
}
```



### 增删改操作

```kotlin
val set = mutableSetOf("A", "B", "C")

//增加
set.add("D")

//删除
set.remove("D")
```



## Map

- Map是表示键值对元素的集合。

### 创建

```kotlin
//方式一
val map = HashMap<String, Int>()
map.put("Apple", 101)
map.put("Orange", 102)
map.put("Banana", 103)

//方式二：推荐
val map = mapOf("Apple" to 101, "Orange" to 102, "Banana" to 103)
```

### 遍历

```kotlin
for ((key, value) in map) {
    println("key=$key ,value=$value")
}
```

### 增删改操作

```kotlin
val map = mutableMapOf("Apple" to 101, "Orange" to 102, "Banana" to 103)

//查询
val num1 = map["Apple"]
val num2 = map.get("Apple")
val num3 = map.getValue("Apple") //可能会抛出异常

//增加
map["Pear"] = 104 //kt推荐
map.put("Pear", 104)

//修改
map["Apple"] = 100 //kt推荐
map.put("Apple", 100)

//删除
map.remove("Apple")
```



## 惰性集合

**传统方法**

```kotlin
list.filter {
    	it > 3
    }.map {
        it * 10
    }
```

上面的写法比较简洁，但存在一些问题，比如调用`filter`方法后会返回一个新的结合，再调用`map`方法后会返回一个新的集合，如果list中的元素非常多时，这将会是一笔不小的开销。为了解决这类问题，Kotlin推出序列（Sequence）。



**使用序列提高效率**

```kotlin
list.asSequence()
    .filter {
        it > 3
    }
    .map {
        it * 2
    }
    .toList()
```

使用`asSequence`方法将集合转换为序列，操作数据后，再通过`toList`方法将序列转换为集合。

- 在使用序列时，调用`filter`和`map`方法不会额外创建新的集合，较少了性能开销。
- 序列具有**惰性求值**特点，只有在需要时才进行求值计算。
- 序列可以是**无限**的。

```kotlin
val list = generateSequence(1) { it * 5 }
    .takeWhile { it <= 50 }
    .toList()
println(list) //[1, 5, 25]
```



## 集合和可空性

```kotlin
//集合中的元素不能为null
val list1: List<Int> = listOf(1, 2, 3)

//集合中的元素可以为null
val list2: List<Int?> = listOf(1, 2, 3, null)

//集合可以为null
var list3: List<Int>? = listOf(1, 2, 3)
list3 = null
```