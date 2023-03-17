[TOC]

# Java “+”拼接字符串原理

## 概述

在没有线程安全问题情况下，字符串拼接通常使用`StringBuilder`和`+`实现，那么这二者有什么区别？



## 案例分析一

```java
public static void add1(String str) {
    String result = str + "aa" + "bb" + "cc";
}

public static void add2(String str) {
    String result = new StringBuilder().append(str).append("aa").append("bb").append("cc").toString();
}
```

在 Java 8 的环境下，先编译再反编译，查看生成的字节码文件：

**add1方法字节码**

```
 0 new #2 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #3 <java/lang/StringBuilder.<init> : ()V>
 7 aload_0
 8 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
11 ldc #5 <aabbcc>
13 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
16 invokevirtual #6 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
19 astore_1
20 return
```

**add2方法字节码**

```
 0 new #2 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #3 <java/lang/StringBuilder.<init> : ()V>
 7 aload_0
 8 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
11 ldc #7 <aa>
13 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
16 ldc #8 <bb>
18 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
21 ldc #9 <cc>
23 invokevirtual #4 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
26 invokevirtual #6 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
29 astore_1
30 return
```

**分析：**

- add1方法，会创建一个`StringBuilder`对象，将3个字符串直接优化合并，执行2次`append()`方法后，调用`toString()`方法；
- add2方法，创建`StringBuilder`对象，执行4次`append()`方法后，调用`toString()`方法。



## 案例分析二

```java
public static void add3(String str) {
    String result = "abc" + str + "efg" + "hij";
}

public static void add4(String str) {
    String result = new StringBuilder().append("abc").append(str).append("efg").append("hij").toString();
}
```

**add3方法字节码**

```
 0 new #2 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #3 <java/lang/StringBuilder.<init> : ()V>
 7 ldc #4 <abc>
 9 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
12 aload_0
13 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
16 ldc #6 <efghij>
18 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
21 invokevirtual #7 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
24 astore_1
25 return
```

**add4方法字节码**

```
 0 new #2 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #3 <java/lang/StringBuilder.<init> : ()V>
 7 ldc #4 <abc>
 9 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
12 aload_0
13 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
16 ldc #8 <efg>
18 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
21 ldc #9 <hij>
23 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
26 invokevirtual #7 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
29 astore_1
30 return
```

说明：

- add3方法，创建`StringBuilder`对象，依次执行3次`append()`方法后，调用`toString()`方法。
- add4方法，与add3方法基本一直。



## 案例分析三

```java
public static void add5() {
    String result = "";
    for (int i = 0; i < 5; i++) {
        result += "abc";
    }
}

public static void add6() {
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < 5; i++) {
        builder.append("abc");
    }
    String result = builder.toString();
}
```

**add5方法字节码**

```
 0 ldc #2
 2 astore_0
 3 iconst_0
 4 istore_1
 5 iload_1
 6 iconst_5
 7 if_icmpge 36 (+29)
10 new #3 <java/lang/StringBuilder>
13 dup
14 invokespecial #4 <java/lang/StringBuilder.<init> : ()V>
17 aload_0
18 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
21 ldc #6 <abc>
23 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
26 invokevirtual #7 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
29 astore_0
30 iinc 1 by 1
33 goto 5 (-28)
36 return
```

**add6方法字节码**

```
 0 new #3 <java/lang/StringBuilder>
 3 dup
 4 invokespecial #4 <java/lang/StringBuilder.<init> : ()V>
 7 astore_0
 8 iconst_0
 9 istore_1
10 iload_1
11 iconst_5
12 if_icmpge 28 (+16)
15 aload_0
16 ldc #6 <abc>
18 invokevirtual #5 <java/lang/StringBuilder.append : (Ljava/lang/String;)Ljava/lang/StringBuilder;>
21 pop
22 iinc 1 by 1
25 goto 10 (-15)
28 aload_0
29 invokevirtual #7 <java/lang/StringBuilder.toString : ()Ljava/lang/String;>
32 astore_1
33 return
```

说明：

- add5方法，每次循环都会先创建一个`StringBuilder`对象，然后执行2次`append()`方法，再调用`toString()`方法。比较耗费性能
- add6方法，只会创建一个`StringBuilder`对象，循环调用`append()`方法，最后调用`toString()`方法。



## 总结

- “+”号拼接字符串，在 Java 8 中会被编译器转换为`StringBuilder`等操作。Java编译器是非常智能的，遇到类似`"aa" + "bb" + "cc"`这样的代码，会被优化为`aabbcc`。
- 如果是简单的静态字符串拼接，编译器会做优化，推荐使用”+“。
- 如果是多条件或循环拼接，推荐使用`StringBuilder`。