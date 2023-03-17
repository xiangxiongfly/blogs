[TOC]

# kotlin 集合操作符总结

```kotlin
data class Student(val name: String, val age: Int, val sex: Boolean, val score: Int)

val ming = Student("小明", 12, false, 90)
val hei = Student("小黑", 13, true, 88)
val bai = Student("小白", 11, true, 75)
val hong = Student("小红", 14, false, 55)
val students = listOf(ming, hei, bai, hong)
```



### map

元素转换

```kotlin
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
    return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)
}

public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.mapTo(destination: C, transform: (T) -> R): C {
    for (item in this)
        destination.add(transform(item))
    return destination
}
```

```kotlin
val list = listOf(1, 2, 3)
val newList = list.map { it * 10 }
println(newList) //[10, 20, 30]
```



### filter & filterNot & filterNotNull

- filter：筛选指定条件的元素
- filterNot：过滤指定条件的元素
- filterNotNull：过滤null元素

```kotlin
public inline fun <T> Iterable<T>.filter(predicate: (T) -> Boolean): List<T> {
    return filterTo(ArrayList<T>(), predicate)
}

public inline fun <T, C : MutableCollection<in T>> Iterable<T>.filterTo(destination: C, predicate: (T) -> Boolean): C {
    for (element in this) if (predicate(element)) destination.add(element)
    return destination
}
```

```kotlin
val newStudents = students.filter {
    it.sex
}
println(newStudents) //[Student(name=小黑, age=13, sex=true, score=88), Student(name=小白, age=11, sex=true, score=75)]
```

```kotlin
val newStudents = students.filterNot {
    it.sex
}
println(newStudents) //[Student(name=小明, age=12, sex=false, score=90), Student(name=小红, age=14, sex=false, score=55)]
```

```kotlin
val newStudents = students.filterNotNull()
```



### count

统计元素个数

```kotlin
public inline fun <T> Collection<T>.count(): Int {
    return size
}

public inline fun <T> Iterable<T>.count(predicate: (T) -> Boolean): Int {
    if (this is Collection && isEmpty()) return 0
    var count = 0
    for (element in this) if (predicate(element)) checkCountOverflow(++count)
    return count
}
```

```kotlin
//统计学生总人数
val count = students.count()
```

```kotlin
//统计男学生数量
val count = students.count {
    it.sex
}
```



### take & takeLast

-   take：获取前几个元素
-   takeLast：获取后几个元素

```kotlin
public fun <T> Iterable<T>.take(n: Int): List<T> {
    require(n >= 0) { "Requested element count $n is less than zero." }
    if (n == 0) return emptyList()
    if (this is Collection<T>) {
        if (n >= size) return toList()
        if (n == 1) return listOf(first())
    }
    var count = 0
    val list = ArrayList<T>(n)
    for (item in this) {
        list.add(item)
        if (++count == n)
            break
    }
    return list.optimizeReadOnlyList()
}
```

```kotlin
public fun <T> List<T>.takeLast(n: Int): List<T> {
    require(n >= 0) { "Requested element count $n is less than zero." }
    if (n == 0) return emptyList()
    val size = size
    if (n >= size) return toList()
    if (n == 1) return listOf(last())
    val list = ArrayList<T>(n)
    if (this is RandomAccess) {
        for (index in size - n until size)
            list.add(this[index])
    } else {
        for (item in listIterator(size - n))
            list.add(item)
    }
    return list
}
```

```kotlin
val list = listOf(1, 2, 3, 4, 5, 6)
val newList = list.take(2)
println(newList) //[1, 2]
val newList2 = list.takeLast(2)
println(newList2) //[5, 6]
```



### slice

分割集合

```kotlin
public fun <T> List<T>.slice(indices: IntRange): List<T> {
    if (indices.isEmpty()) return listOf()
    return this.subList(indices.start, indices.endInclusive + 1).toList()
}
```

```kotlin
val list = listOf(1, 2, 3, 4, 5, 6)
val newList = list.slice(2..4)
println(newList) //[3, 4, 5]
```



### sumOf & sum

-   sumOf：指定元素求和
-   sum：求和

```kotlin
public inline fun <T> Iterable<T>.sumOf(selector: (T) -> Int): Int {
    var sum: Int = 0.toInt()
    for (element in this) {
        sum += selector(element)
    }
    return sum
}
```

```kotlin
val students = listOf(ming, hei, bai, hong)
val result = students.sumOf { it.score }
println(result) //308
```

```kotlin
public fun Iterable<Int>.sum(): Int {
    var sum: Int = 0
    for (element in this) {
        sum += element
    }
    return sum
}
```

```kotlin
val list = listOf(1, 2, 3, 4, 5)
val result = list.sum()
println(result) //15
```



### reduce & fold

- reduce：累加元素
- fold：累加元素，可以设置初始值

```kotlin
public inline fun <S, T : S> Iterable<T>.reduce(operation: (acc: S, T) -> S): S {
    val iterator = this.iterator()
    if (!iterator.hasNext()) throw UnsupportedOperationException("Empty collection can't be reduced.")
    var accumulator: S = iterator.next()
    while (iterator.hasNext()) {
        accumulator = operation(accumulator, iterator.next())
    }
    return accumulator
}

public inline fun <T, R> Iterable<T>.fold(initial: R, operation: (acc: R, T) -> R): R {
    var accumulator = initial
    for (element in this) accumulator = operation(accumulator, element)
    return accumulator
}
```

```kotlin
val list = listOf(1, 2, 3, 4, 5)
val reduce = list.reduce { mul, item ->
	mul + item
}
println(reduce) //15
```

```kotlin
val list = listOf(1, 2, 3, 4, 5)
val fold = list.fold(100) { mul, item ->
    mul + item
}
println(fold) //115
```



### groupBy

元素分组

```kotlin
public inline fun <T, K> Iterable<T>.groupBy(keySelector: (T) -> K): Map<K, List<T>> {
    return groupByTo(LinkedHashMap<K, MutableList<T>>(), keySelector)
}

public inline fun <T, K, M : MutableMap<in K, MutableList<T>>> Iterable<T>.groupByTo(destination: M, keySelector: (T) -> K): M {
    for (element in this) {
        val key = keySelector(element)
        val list = destination.getOrPut(key) { ArrayList<T>() }
        list.add(element)
    }
    return destination
}
```

```kotlin
val result = students.groupBy { it.sex }
println(result)
//{false=[Student(name=小明, age=12, sex=false, score=90), Student(name=小红, age=14, sex=false, score=55)], true=[Student(name=小黑, age=13, sex=true, score=88), Student(name=小白, age=11, sex=true, score=75)]}
```



### flatten

展开、扁平化处理

```kotlin
public fun <T> Iterable<Iterable<T>>.flatten(): List<T> {
    val result = ArrayList<T>()
    for (element in this) {
        result.addAll(element)
    }
    return result
}
```

```kotlin
val list = listOf(listOf(1, 2, 3), listOf(4, 5, 6))
val newList = list.flatten()
println(newList) //[1, 2, 3, 4, 5, 6]
```



### flatMap

扁平化处理转集合

```kotlin
public inline fun <T, R> Iterable<T>.flatMap(transform: (T) -> Iterable<R>): List<R> {
    return flatMapTo(ArrayList<R>(), transform)
}

public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.flatMapTo(destination: C, transform: (T) -> Iterable<R>): C {
    for (element in this) {
        val list = transform(element)
        destination.addAll(list)
    }
    return destination
}
```

```kotlin
val list = listOf(listOf(ming, hei), listOf(bai, hong))
val newList = list.flatMap { it.map { it.name } }
println(newList) //[小明, 小黑, 小白, 小红]
```

```kotlin
val newList = students.flatMap { listOf(it.name) }
println(newList) //[小明, 小黑, 小白, 小红]
```

