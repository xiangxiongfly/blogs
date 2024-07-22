[TOC]

# Java 字符串常量池

## String类特性

### 创建字符串对象的两种方式

```java
// 方式一：字面量
String s1 = "abc";

// 方式二：new 
String s2 = new String("abc");
```

### String类特性

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence
```

- 使用 final 修饰符，表示 String 类不能被继承。
- 实现 Serializable 接口，表示支持序列化。
- 实现 Comparable 接口，表示可以比较大小。
- 在 JDK 8 及以前版本内部定义 `final char[] value` 用于存储数据，在 JDK 9 以后更改为 `final byte[] value`，节约空间。一个 char类型占用2个字节，而大多数字符只需要1个字节。

### 不可变性

String是不可变的字符序列，即字符串对象具有不可变性。例如，对字符串变量重新赋值、对现有的字符串进行连接操作、调用String的replace等方法修改字符串等操作时，都是指向另一个字符串对象而已，对于原来的字符串的值不做任何改变。

```java
String s1 = "java";
String s2 = "hello" + s1;
String s3 = s1.concat("hello");
String s4 = s1.replace("a", "A");
System.out.println(s1); // java
System.out.println(s2); // hellojava
System.out.println(s3); // javahello
System.out.println(s4); // jAvA
```



## 字符串常量池

因为String对象的不可变性，所以String的对象可以共享。

但是Java中并不是所有字符串对象都共享，只会共享字符串常量对象。

Java把需要共享的字符串常量对象存储在字符串常量池(StringTable)中，即字符串常量池中是不会存储相同内容的字符串的。

### 字符串常量池大小

String的StringTable是一个固定大小的HashTable。

在 JDK 6 中StringTable长度默认是1009，所以如果常量池中的字符串过多就会导致效率下降很快。在JDK 7和JDK 8中，StringTable长度默认是60013。

### 字符串常量池位置

- 八种基本数据类型的常量池都由系统协调使用。
- String类型的常量池使用比较特殊，如果使用字面量方式创建字符串对象，则直接将字符串存放到常量池中。如果使用 new 方式创建字符串对象，字符串不会存储在常量池，但是可以通过 intern() 方式将字符串存储在常量池。
- 在 Java 6 及以前版本中字符串常量池放到了永久代，在 Java 7 及之后版本中字符串常量池被放到了堆空间。字符串常量池位置之所以调整到堆空间，是因为永久代空间默认比较小，而且永久代垃圾回收频率低。将字符串保存在堆中，就是希望字符串对象可以和其他普通对象一样，垃圾对象可以及时被回收，同时可以通过调整堆空间大小来优化应用程序的运行。

#### 间接证明字符串常量池的位置

在JDK8下设置：`-Xmx5m -XX:-UseGCOverheadLimit`

```java
List<String> list = new ArrayList<>();
int i = 0;
try {
    for (int j = 0; j < 260000; j++) {
        list.add(String.valueOf(j).intern());
        i++;
    }
} catch (Throwable e) {
    e.printStackTrace();
} finally {
    System.out.println(i);
}

//抛出异常：java.lang.OutOfMemoryError: Java heap space
```

### 字符串的共享

因为String对象是不可变的，所以可以共享。存储在StringTable中的字符串对象是不会重复的，即相同的字符串对象本质上是共享同一个。

#### 相同的字面量指向同一实例

```java
String s1 = "hello";
String s2 = "hello";
String s3 = "abc";
System.out.println(System.identityHashCode(s1)); // 2104457164
System.out.println(System.identityHashCode(s2)); // 2104457164
System.out.println(System.identityHashCode(s3)); // 1521118594
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a8918858d4e8401ca2dc54ad6e033606.png)

#### new出来的字符串不再常量池

```java
String s1 = new String("hello");
String s2 = new String("hello");
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/53325146e03746ad886a48fc9fffce41.png)

### 字符串拼接

#### 字面量拼接

```java
String s1 = "a" + "b" + "c"; // 编译期优化，等同于”abc“
String s2 = "abc";

System.out.println(System.identityHashCode(s1)); // 2104457164
System.out.println(System.identityHashCode(s2)); // 2104457164
System.out.println(s1 == s2); // true
```

#### 字符串对象拼接

```java
String s1 = "hello";
String s2 = "world";
String s3 = "helloworld";
String s4 = s1 + new String("world");
String s5 = s1 + "world";
String s6 = s1 + s2;

System.out.println(System.identityHashCode(s1)); // 870698190
System.out.println(System.identityHashCode(s2)); // 1514322932
System.out.println(System.identityHashCode(s3)); // 654582261
System.out.println(System.identityHashCode(s4)); // 1389647288
System.out.println(System.identityHashCode(s5)); // 1330278544
System.out.println(System.identityHashCode(s6)); // 1634198
System.out.println(s3 == s4); // false
System.out.println(s3 == s5); // false
System.out.println(s3 == s6); // false
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/602588a4da1e48d6841ace1b5c1c9171.png)

说明：使用”+“拼接，只要有一个变量不是字面量，本质上都属于 StringBuilder#append() 操作。

如：`s1 + s2` 操作等同于 `new StringBuilder.append("hello").append("world").toString()`  -> `new String("helloworld")`。

#### 字符串常量拼接

```java
final String s1 = "hello";
final String s2 = "world";
String s3 = "helloworld";
String s4 = s1 + s2; // 直接转为"helloworld"

System.out.println(s3 == s4); // true
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/75093c34f043419ea8c51b6fa3dfae80.png)

说明：s1和s2用final修饰表示为字符串常量，因此编译期优化直接转换为常量。

#### ”+“和StringBuild对比

```java
long start = System.currentTimeMillis();
String str = "";
for (int i = 0; i < 100000; i++) {
    str = str + "a";
}
System.out.println("耗时：" + (System.currentTimeMillis() - start));
long totalMemory = Runtime.getRuntime().totalMemory();
long freeMemory = Runtime.getRuntime().freeMemory();
System.out.println("占用内存：" + (totalMemory - freeMemory));

// 耗时：555
// 占用内存：436143768
```

```java
long start = System.currentTimeMillis();
StringBuilder builder = new StringBuilder();
for (int i = 0; i < 100000; i++) {
    builder.append("a");
}
String str = builder.toString();
System.out.println("耗时：" + (System.currentTimeMillis() - start));
long totalMemory = Runtime.getRuntime().totalMemory();
long freeMemory = Runtime.getRuntime().freeMemory();
System.out.println("占用内存：" + (totalMemory - freeMemory));

// 耗时：4
// 占用内存：3145728
```

说明： 拼接100000次，直接拼接字符串耗时555ms，占用内存436143768字节，而StringBuilder则耗时4ms，占用内存3145728字节。

### intern()

池化操作：当调用 intern() 方法时，如果字符串常量池中有该字符串，则返回池中的字符串，如果没有，则将字符串添加到池中，并返回字符串的引用。

```java
String s1 = "hello";
String s2 = new String("hello");
String s3 = new String("hello").intern();

System.out.println(s1 == s2); // false
System.out.println(s1 == s3); // true
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d38e7e72f2a14fd4b57f6a9f4d07c00e.png)

#### intern()优点

```java
final int MAX_COUNT = 1000 * 10000;
final String[] arr = new String[MAX_COUNT];
final Integer[] data = new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
long start = System.currentTimeMillis();
for (int i = 0; i < MAX_COUNT; i++) {
    arr[i] = new String(String.valueOf(data[i % data.length]));
}
System.out.println("耗时：" + (System.currentTimeMillis() - start));
long totalMemory = Runtime.getRuntime().totalMemory();
long freeMemory = Runtime.getRuntime().freeMemory();
System.out.println("占用内存：" + (totalMemory - freeMemory));

// 耗时：325
// 占用内存：545261568
```

```java
final int MAX_COUNT = 1000 * 10000;
final String[] arr = new String[MAX_COUNT];
final Integer[] data = new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
long start = System.currentTimeMillis();
for (int i = 0; i < MAX_COUNT; i++) {
    arr[i] = new String(String.valueOf(data[i % data.length])).intern();
}
System.out.println("耗时：" + (System.currentTimeMillis() - start));
long totalMemory = Runtime.getRuntime().totalMemory();
long freeMemory = Runtime.getRuntime().freeMemory();
System.out.println("占用内存：" + (totalMemory - freeMemory));

// 耗时：1056
// 占用内存：54247920
```

说明：池化操作可以节省大量的内存空间，适用于重复字符串操作。



## String对象创建问题

### new String("hello") 会创建几个对象？

**查看字节码：**

```
 0 new #2 <java/lang/String>
 3 dup
 4 ldc #3 <abc>
 6 invokespecial #4 <java/lang/String.<init> : (Ljava/lang/String;)V>
 9 pop
10 return
```

会创建2个对象：

1.   通过new创建一个String对象。
2.   类加载完后会在字符串常量池中创建`hello`字符串实例



### new String("abc") + new String("ABC")会创建几个对象

```
 0 new #2 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #3 <java/lang/StringBuilder.<init> : ()V>
 7 new #4 <java/lang/String>
10 dup
11 ldc #5 <abc>
13 invokespecial #6 <java/lang/String.<init> : (Ljava/lang/String;)V>
16 invokevirtual #7 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
19 new #4 <java/lang/String>
22 dup
23 ldc #8 <ABC>
25 invokespecial #6 <java/lang/String.<init> : (Ljava/lang/String;)V>
28 invokevirtual #7 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
31 invokevirtual #9 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
34 astore_1
35 return
```

会创建6个 对象：

1.   对象1：new StringBuilder()对象
2.   对象2：new String("abc")对象
3.   对象3：常量池中的`abc`字符串实例
4.   对象4：new String("ABC")对象
5.   对象5：常量池中的`ABC`字符串实例
6.   对象6：调用StringBuilder的toString()方法，会创建并返回一个String对象

注意：`toString()`方法，本质是调用`new String()`重新创建一个String对象，创建的`abcABC`字符串不是常量，所以不会放入常量池，String类的本质是char数组。


