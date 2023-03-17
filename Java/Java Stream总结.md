[TOC]

# Stream总结

## 概述

Stream API作为Java 8的一大亮点，是对集合（Collection）对象功能的增强。它专注于对集合对象进行各种非常便利、高效的聚合操作（aggregateoperation），或者大批量数据操作（bulk data operation）。



## collect

合并流

```java
Person p1 = new Person("Tom", 11);
Person p2 = new Person("Jack", 12);
Person p3 = new Person("Jane", 15);
Person p4 = new Person("Mike", 14);
Person p5 = new Person("John", 13);

List<Person> personList = Stream.of(p1, p2, p3, p4, p5)
    .collect(Collectors.toList());

System.out.println(personList);

//[Person{name='Tom', age=11}, Person{name='Jack', age=12}, Person{name='Jane', age=15}, Person{name='Mike', age=14}, Person{name='John', age=13}]
```



## 过滤数据

### filter

过滤流

```java
List<Person> newList = Stream.of(p1, p2, p3, p4, p5)
    .filter(p -> p.getAge() > 13)
    .collect(Collectors.toList());
System.out.println(newList);

//[Person{name='Jane', age=15}, Person{name='Mike', age=14}]
```



### distinct

去重

```java
Integer[] intArr = {1, 2, 3, 4, 5, 3};
Stream<Integer> distinctStream = Stream.of(intArr).distinct();
distinctStream.forEach(System.out::println);

//1
//2
//3
//4
//5
```



## 遍历数据

### forEach

遍历流

```java
personStream.forEach(System.out::println);
```



### limit

保留元素

```java
String[] strArr = {"hello", "world", "java", "C", "C++"};
List<String> list = Stream.of(strArr)
        .filter(x -> x.length() > 2)
        .limit(2)
        .collect(Collectors.toList());

list.forEach(System.out::println);

//hello
//world
```



### skip

跳过前几个元素

```java
String[] strArr = {"hello", "world", "java", "C", "C++"};
List<String> list = Stream.of(strArr)
        .skip(2)
        .collect(Collectors.toList());

list.forEach(System.out::println);

//java
//C
//C++
```



## 数据转换

### map

转换流，将每个元素进行转换，并返回一个Stream类型对象。

```java
String[] strArr = {"Hello", "World", "Java", "C", "C++"};
List<String> list = Stream.of(strArr)
    .map(String::toUpperCase)
    .collect(Collectors.toList());

list.forEach(System.out::println);

//HELLO
//WORLD
//JAVA
//C
//C++
```



### flatMap

将一个Stream进行扁平化处理，合并成一个流

```java
String[] strArr = {"Hello", "World", "Java", "C", "C++"};
Stream.of(strArr)
    .map(s -> s.split(""))
    .flatMap(Arrays::stream)
    .distinct()
    .collect(Collectors.toList())
    .forEach(System.out::println);

//H
//e
//l
//o
//W
//r
//d
```



## 查找、匹配

### allMatch

全部匹配返回true

```java
boolean b = Stream.of("Hello", "World", "Java", "C++")
    .allMatch(param -> param.length() > 2);

System.out.println(b);

//true
```



### anyMatch

匹配任意一个返回true

```java
boolean b = Stream.of("Hello", "World", "Java", "C++", "C")
    .anyMatch(param -> param.length() > 2);

System.out.println(b);

//true
```



### noneMatch

都不匹配返回true

```java
boolean b = Stream.of("Hello", "World", "Java", "C++")
    .noneMatch(param -> param.length() > 100);

System.out.println(b);

//true
```



### findFirst

获取第一个元素

```java
String s = Stream.of("Hello", "World", "Java", "C++")
    .findFirst()
    .get();

System.out.println(s);

//Hello
```



### findAny

获取第一个符合条件的元素

```java
String s = Stream.of("Hello", "World", "Java", "C++")
    .filter(param -> param.length() > 2)
    .findAny()
    .get();

System.out.println(s);

//Hello
```



## 统计

### max & min

获取最大和最小值

```java
Optional<Person> max = Stream.of(p1, p2, p3, p4, p5)
    .max((o1, o2) -> o1.getAge() - o2.getAge());

Optional<Person> min = Stream.of(p1, p2, p3, p4, p5)
    .min(Comparator.comparing(p -> p.getAge()));

System.out.println(max.get());
System.out.println(min.get());

//Person{name='Jane', age=15}
//Person{name='Tom', age=11}
```



### count

统计数量

```java
long count = Stream.of(p1, p2, p3, p4, p5)
    .filter(p -> p.getAge() > 13)
    .count();

System.out.println(count);

//2
```



### reduce

累加计算

```java
Integer reduce = Stream.of(1, 2, 3, 4, 5)
    .reduce(0, (acc, x) -> acc + x);

System.out.println(reduce);

//15
```



## Collectors

### toList

转List集合

```java
List<String> list = Stream.of("Hello", "World", "Java", "C++")
    .collect(Collectors.toList());
```



### toMap

转Map集合

```java
Map<String, String> map = Stream.of("Hello", "World", "Java", "C++")
    .collect(Collectors.toMap(key -> "键:" + key, value -> "值:" + value));

map.forEach((k, v) -> {
    System.out.println(k);
    System.out.println(v);
});

//键:World
//值:World
//键:C++
//值:C++
//键:Java
//值:Java
//键:Hello
//值:Hello
```



### counting

统计

```java
Long count = Stream.of("Hello", "World", "Java", "C++")
    .collect(Collectors.counting());
```



### joining

字符串拼接

```java
String newStr = Stream.of(p1, p2, p3, p4, p5)
    .map(p -> p.getName())
    .collect(Collectors.joining("-", "[", "]"));

//[Tom-Jack-Jane-Mike-John]
```

