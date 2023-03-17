[TOC]

## String

### 创建

```java
String s1 = "helloString";
String s2 = new String("helloString");

System.out.println(System.identityHashCode(s1)); //1163157884
System.out.println(System.identityHashCode(s2)); //1956725890
```

- 第一行代码使用直接赋值操作，如果字符串常量池里有hello字符串，则变量s1就会直接指向常量池中的hello字符串，否则JVM会在类加载期间在常量池中创建该字符串。
- 第二行代码使用new创建一个对象，会先在堆内存中创建一个对象，然后该对象会指向常量池中的hello字符串，变量s2会指向该对象的地址
- s1的地址值指向常量池hello字符串的地址，s2的地址指向堆内存中的对象地址，所有`s1==s2`返回false



### charAt

- 获取指定索引的元素

```java
s1.charAt(1) //e
```



### indexOf & lastIndexOf

- indexOf 从左往右查找，获取指定字符串的第一次出现的索引
- lastIndexOf 同理indexOf，从有网做查找

```java
String s = "hello";

System.out.println(s.indexOf("e"));//1
System.out.println(s.lastIndexOf("e"));//1
```



### contentEquals

- 判断两字符串内容是否相等

```java
s1.contentEquals(s2) //true
```



### substring

- 截取字符串

```java
s1.substring(1) //elloString
s1.substring(1, 5) //ello
```



### startsWith & endsWidth

- startsWith 判断是否为指定字符串开头
- endsWidth 
- 判断是否为指定字符串结尾

```java
s1.endsWith("ing") //true
s1.startsWith("hello") //true
```



### isEmpty

- 判断字符串是否为空

```java
s1.isEmpty() //false
```



### trim

- 去除前后空格

```java
s1.trim()
```



### split

- 根据特定符号，分割字符串为字符串数据

```java
String s1 = "he|llo|Str|ing";
String[] split = s1.split("\\|");
for (String i : split) {
    System.out.println(i);
}

//her
//llo
//Str
//ing
```



### replace & replaceAll

- replace 替换指定字符串
- replaceAll 替换指定字符串，支持正则

```java
String s1 = "hellostringhellostring";

System.out.println(s1.replace("hello", "HELLO")); //HELLOstringHELLOstring
System.out.println(s1.replaceAll("hello", "HELLO")); //HELLOstringHELLOstring
```



### contains

- 是否包含指定字符串

```java
String s1 = "hellostringhellostring";

System.out.println(s1.contains("hello")); //true
```



### concat

- 拼接字符串

```java
String s1 = "abc";
String s2 = "efg";

System.out.println(s1.concat(s2)); //abcefg
```



### equals

- String重写了equals方法，可以用于判断两字符串内容是否相等

```java
s1.equals(s2) //true
```



### intern

- `intern` 是一个本地方法，它返回的是一个字符串对象，如果常量池已经包含了字符串，那么直接返回该字符串；否则，会将该字符串添加到常量池，并返回该字符串

```java
String s1 = "hello";
String s2 = "hello".intern();

System.out.println(s2); //hello
System.out.println(s1 == s2); //true
```



## StringBuilder & StringBuffer

- StringBuilder与StringBuffer的API基本类似，通常是用于频繁拼接字符串
- StringBuffer是线程安全的，StringBuilder是线程不安全的

### append

- 拼接字符串

```java
StringBuilder builder = new StringBuilder();
builder.append("[")
    .append("hello ")
    .append("StringBuilder")
    .append("]");
System.out.println(builder.toString()); //[hello StringBuilder]
```



### delete

- 删除指定范围字符串

```java
StringBuilder builder = new StringBuilder("hello StringBuilder");
builder.delete(0, 3);

System.out.println(builder.toString()); //lo StringBuilder
```



## StringJoiner

- Java提供StringJoiner用于更高效拼接字符串

```java
StringJoiner joiner = new StringJoiner(",", "[", "]");
joiner.add("hello")
    .add("StringJoiner");
System.out.println(joiner.toString());//[hello,StringJoiner]
```