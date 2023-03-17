[TOC]

# Java 集合框架使用总结

## 概述

- Java提供了集合框架，方便为程序员用于存储、检索、操作和传递聚合数据。
- 集合框架的相关类和接口都在`java.util`包中。集合框架的相关类都实现了`Cloneable`和`Serializable`接口。

Java集合框架支持3种主要类型的集合：

- List：有序列表集合
- Set：无重复元素集合
- Map：键值对集合

![在这里插入图片描述](https://img-blog.csdnimg.cn/d97ee25726bf4c2582501bc123eb1e7e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/42cbc4fc7f24412eab588f1fc99e2946.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



## List

### ArrayList

- ArrayList即数组列表。
- 特点：有序、可重复、可为null。
- 优点：查询快；缺点：增删慢。
- 扩容机制：当容量不足时，每次扩容增加50%。

**增加数据**

```java
ArrayList<String> fruits = new ArrayList<>();
fruits.add("apple"); //添加单个数据
fruits.addAll(newList); //添加批量数据
```

**删除数据**

```java
fruits.remove("apple"); //删除指定数据
fruits.remove(1); //删除指定索引数据
fruits.removeAll(newList); //删除批量数据

//删除指定规则的数据
fruits.removeIf(new Predicate<String>() {
    @Override
    public boolean test(String s) {
        return s.length() == 6;
    }
});

fruits.clear(); //清空集合
```

**修改数据**

```java
//修改第一个元素
fruits.set(0, "APPLE");
```

**查询数据**

```java
//获取ArrayList的元素数量
int size = fruits.size();

//获取指定坐标元素
String item = fruits.get(2);
```

**遍历数据**

```java
//for循环
for (int i = 0; i < fruits.size(); i++) {
    System.out.println(fruits.get(i));
}

//for-each循环
for (String i : fruits) {
    System.out.println(i);
}

//迭代器循环：支持遍历过程中删除元素
Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()){
    System.out.println(iterator.next());
}
```



### LinkedList

- LinkedList即链式列表。
- 特点：有序、可重复、可为null。
- 优点：增删快；缺点：查询慢。

**增加数据**

```java
LinkedList<String> fruits = new LinkedList<>();
fruits.add("apple"); //添加单个数据
```

**删除数据**

```java
fruits.remove(2); //删除元素
```

**修改数据**

```java
fruits.set(0, "APPLE"); ////修改元素
```

**查询数据**

```java
String item = fruits.get(1); //获取指定下标的元素
```

**遍历数据**

```java
//for循环元素
for (int i = 0; i < fruits.size(); i++) {
    System.out.println(fruits.get(i));
}

//for-each循环元素
for (String i : fruits) {
    System.out.println(i);
}

//迭代器循环元素
Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```



### SynchronizedList

ArrayList、LinkedList是线程不安全的，SynchronizedList是线程安全的，它的get、set、add等方法都使用synchronized同步支持。

```java
List list = Collections.synchronizedList(new ArrayList<>());
```



## Map

### HashMap

- HashMap即哈希映射。
- 特点：无序、key可为null、key不可重复。
- 优点：增删改查快；缺点：无序。
- 哈希冲突问题：数组+链表+红黑树。树化：当链表长度大于8且数组容量大于等于64时，将链表转换为红黑树；链化：当红黑树节点数量小于等于6时，红黑树转换为链表。
- 扩容机制：当元素个数超过临界值（临界值=容量*负载因子）时，HashMap就会扩容，扩容后的容量时之前的2倍。

**增加数据**

```java
HashMap<Integer, String> fruits = new HashMap<>();
fruits.put(1, "apple");
fruits.put(2, "orange");
fruits.put(3, "banana");
```

**删除数据**

```java
//删除指定key元素
String remove = fruits.remove(2);

//清空HashMap
fruits.clear();
```

**修改数据**

```java
//修改指定key元素
fruits.put(1, "AAA");
```

**查询数据**

```java
//获取HashMap元素数量
int size = fruits.size();

//获取指定key元素
String item = fruits.get(2);

//是否包含指定key值
boolean b = fruits.containsKey(1);

//是否包含指定value值
boolean b = fruits.containsValue("apple");

//获取所有key值
Set<Integer> keySet = fruits.keySet();

//获取所有value值
Collection<String> values = fruits.values();
```

**遍历数据**

```java
//for-each迭代HashMap
for (Integer k : fruits.keySet()) {
    System.out.println("key=" + k + ",value=" + fruits.get(k));
}

//遍历HashMap
Set<Map.Entry<Integer, String>> entrySet = fruits.entrySet();
for (Map.Entry<Integer, String> entry : entrySet) {
    System.out.println("key=" + entry.getKey() + ",value=" + entry.getValue());
}

//迭代器循环：支持遍历过程中删除元素
Iterator<Map.Entry<Integer, String>> iterator = fruits.entrySet().iterator();
while (iterator.hasNext()) {
    Map.Entry<Integer, String> next = iterator.next();
    System.out.println("key=" + next.getKey() + ",value=" + next.getValue());
}
```



### LinkedHashMap

- LinkedHashMap即链式哈希映射。
- 特点：有序、key唯一，key可为null。
- 优点：有序。



### TreeMap

- TreeMap即二叉树映射。
- 特点：对key排序、无序、key唯一、key不可为null。
- 优点：对key排序；缺点：无序。



### ConcurrentHashMap

- ConcurrentHashMap使用线程安全的容器类。
- 特点：无序、key唯一、key&value不可为null、线程安全。
- 优点：增删改查快；缺点：无序。

**ConcurrentHashMap API说明**

| 方法                | 说明                       |
| ------------------- | -------------------------- |
| put(K, V)           | 添加元素                   |
| get(Object)         | 获取指定key的元素          |
| containsKey(Object) | 查询集合是否包含指定key    |
| remove(Object)      | 删除指定key的元素          |
| keySet()            | 以Set集合形式返回所有的key |
| size()              | 获取集合大小               |
| isEmpty()           | 判断集合是否为空           |
| clear()             | 清空集合                   |

**HashMap与ConcurrentHashMap区别**

|                        | HashMap    | ConcureentHashMap         |
| ---------------------- | ---------- | ------------------------- |
| 线程是否安全           | 不安全     | 安全                      |
| 扩容                   | 单线程扩容 | 多线程协同扩容            |
| 统计元素数量           | size       | baseCount + CounterCell[] |
| key、value是否可为null | 能         | 不能                      |



## Set

### HashSet

- HashSet即哈希集合。
- 特点：无序、值唯一、值可为null。
- 优点：增删改查快；缺点：无序。
- HashSet内部用的是HashMap。

```java
HashSet<String> fruits = new HashSet<>();
fruits.add("apple");
fruits.add("orange");
fruits.add("banana");

//判断元素是否存在
boolean b = fruits.contains("apple");

//删除元素
fruits.remove("apple");

//获取HashSet元素数量
int size = fruits.size();

//for-each迭代HashSet
for (String i : fruits) {
    System.out.println(i);
}

//迭代器迭代HashSet
Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```



### LinkedHashSet

- LinkedHashSet即链式哈希集合。
- 特点：有序、值唯一、值可为null。
- 优点：有序，增删快；缺点：查询慢。
- LinkedHashSet内部使用LinkedHashMap。

```java
LinkedHashSet<String> fruits = new LinkedHashSet<>();
fruits.add("apple");
fruits.add("orange");
fruits.add("banana");

//for-each迭代LinkedHashSet
for (String i : fruits) {
    System.out.println(i);
}
```



### TreeSet

- TreeSet即二叉树集合。
- 特点：对值排序、无序、值唯一、值不可为null。
- 优点：对值排序；缺点：无序。
- TreeSet间接实现了SortedSet接口，SortedSet是Set的一个子接口，它支持集合内部的元素是有序的。
- 默认自然排序，可实现Comparable接口自定义排序规则。

```java
TreeSet<String> fruits = new TreeSet<>();
fruits.add("apple");
fruits.add("orange");
fruits.add("banana");
System.out.println(fruits);//[apple, banana, orange]

//获取第一个元素
String first = fruits.first();

//获取最后一个元素
String last = fruits.last();

//迭代器迭代HashSet
Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```

**自定义排序规则**

```java
//年龄从小到大，姓名从小到大规则进行排序
TreeSet<Student> students = new TreeSet<>(new Comparator<Student>() {
    @Override
    public int compare(Student o1, Student o2) {
        if (o1.getAge() - o2.getAge() == 0) {
            return o1.getName().compareTo(o2.getName());
        } else {
            return o1.getAge() - o2.getAge();
        }
    }
});
students.add(new Student("a", 10));
students.add(new Student("b", 12));
students.add(new Student("d", 11));
students.add(new Student("c", 11));

System.out.println(students);
```



## fail-fast

fail-fast快速失败机制：

- 一种容器保护机制；
- 可以防止度过了线程并发修改同一个容器的内容；
- 容器若被并发修改，则抛出 ConcurrentModificationException 异常。

| 线程不安全    | 线程安全             |
| ------------- | -------------------- |
| ArrayList     | CopyOnWriteArrayList |
| LinkedList    |                      |
| HashMap       | ConcurrentHashMap    |
| LinkedHashMap |                      |
| TreeMap       |                      |
| HashSet       | CopyOnWriteArraySet  |
| LinkedHashSet |                      |
| TreeSet       |                      |



## 数据转换

### List转数组

```java
//方式一
//toArray(): 返回一个Object[]
Object[] objects = fruits.toArray();

//方式二（推荐）
//toArray(T[] a): 返回一个指定类型的数组
String[] fruitArr = fruits.toArray(new String[fruits.size()]);
```



### 数组转List

```java
//方式一
//Arrays.asList(T...a): 转为List后，不能增删 只能查改，否则抛出异常
String[] fruitArr = {"apple", "orange", "banana"};
List<String> fruitList = Arrays.asList(fruitArr);
//需要进行ArrayList转换
ArrayList<String> list = new ArrayList<>(fruitList);


//方式二（推荐）
ArrayList<String> fruitList = new ArrayList<>(fruits.length);
Collections.addAll(fruitList, fruits);
```



## 内置工具类

### Arrays 数组工具类

`java.util.Arrays`

```java
//数组转List
String[] arr = {"hello", "world", "java"};
List<String> list = Arrays.asList(arr);
println(list);//[hello, world, java]

//数组转String
int[] intArr = {1, 2, 3, 4};
String str = Arrays.toString(intArr);
println(str);//[1, 2, 3, 4]
```

```java
//排序
int[] intArr = {7, 4, 1, 8, 3};
Arrays.sort(intArr);
println(Arrays.toString(intArr));//[1, 3, 4, 7, 8]

//判断两数组的值是否相等
int[] intArr01 = {1, 3, 5, 7};
int[] intArr02 = {1, 0, 5, 7};
boolean is = Arrays.equals(intArr01, intArr02);
println(is);//false

//二分法查找元素索引
int[] intArr = {1, 3, 5, 7, 9};
Arrays.sort(intArr);
int index = Arrays.binarySearch(intArr, 9);
println(index);//4

//拷贝数组并指定长度，超出范围补0
int[] intArr = {1, 2, 3, 4, 5, 6, 7};
int[] newArr = Arrays.copyOf(intArr, 3);
println(Arrays.toString(newArr));//[1, 2, 3]

//拷贝数组指定范围的元素
int[] intArr = {1, 2, 3, 4, 5, 6, 7};
int[] newArr = Arrays.copyOfRange(intArr, 3, 5);
println(Arrays.toString(newArr));//[4, 5]
```



### Collections 集合工具类

`java.util.Collections`

```java
//初始化并赋值
ArrayList<String> list = new ArrayList<String>() {{
    add("b");
    add("a");
    add("e");
    add("d");
    add("c");
}};
println(list);//[b, a, e, d, c]

//反转数据
Collections.reverse(list);
println(list);//[c, d, e, a, b]

//排序
Collections.sort(list);
println(list);//[a, b, c, d, e]

//随记排序
Collections.shuffle(list);
println(list);//[d, b, e, c, a]

//获取最大值
String max = Collections.max(list);
println(max);//e

//获取最小值
String min = Collections.min(list);
println(min);//a

//替换指定元素
Collections.replaceAll(list, "a", "A");
println(list);//[b, A, e, d, c]
```