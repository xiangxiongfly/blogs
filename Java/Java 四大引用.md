@[toc]
# Java 四大引用

## 前言

Java将对象的引用划分为4个等级，分别是：强引用、软引用、弱引用和虚引用。

根据不同引用类型可以灵活控制对象的生命周期，提高对象的回收效率。



## 强引用

强引用是使用最多的，gc不会回收强引用的对象，即使JVM发生内存溢出，也不会回收该对象。

```java
 Object o = new Object();
```



## 软引用

只要内存足够，JVM不会回收该对象；但当内存不足时，gc对软引用对象进行回收。

```java
String str = "软引用对象";
//使用软引用
SoftReference<String> soft = new SoftReference<>(str);
//获取软引用的对象
String s = soft.get();
```



## 弱引用

当gc发现弱引用时，不管内存是否充足，都会直接回收。

```java
String str = "弱引用对象";
//使用软引用
WeakReference<String> weak = new WeakReference<>(str);
//获取软引用的对象
String s = weak.get();
```



## 虚引用

虚引用再任何时候都可能被gc回收。

```java
String str = "虚引用对象";
ReferenceQueue<String> queue = new ReferenceQueue<>();
PhantomReference<String> phantom = new PhantomReference<>(str, queue);
String s = phantom.get();
```