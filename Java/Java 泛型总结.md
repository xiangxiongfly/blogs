[TOC]

# Java 泛型总结



## 概述

泛型是JDK5引入的特性，提供了编译时类型安全检测机制，该机制允许我们在编译时检测到非法的类型数据结构。

Java允许定义泛型类、泛型接口、泛型方法。

泛型优点：

- 编译时进行类型检查。
- 消除类型转换。

常用泛型标识：T 类型、E 元素、K 键、V 值、N 数字、S U V 第二、三、四个类型。



## 类型参数和类型实参

- `Foo<T>`：T为类型参数。
- `Foo<String>`：String为类型变量。



## 泛型类

- 泛型类，如果没有指定具体类型，则默认类型是Object
- 泛型的类型只能是类的类型
- 泛型类型在逻辑上可以看成是多个不同的类型，但实际上都是相同类型

```java
public class GenericClass<T> {
    private T name;

    public GenericClass(T name) {
        this.name = name;
    }

    public T getName() {
        return name;
    }

    public void setName(T name) {
        this.name = name;
    }
}
```

**使用**

```java
GenericClass<String> strObj = new GenericClass<>("abc");
String value = strObj.getValue();
System.out.println(value);//abc

GenericClass<Integer> intObj = new GenericClass<>(123);
int value = intObj.getValue();
System.out.println(value);//123
```



### 泛型类的子类

- 子类是泛型类，子类和父类的泛型类型标识要一致
- 子类不是泛型类，父类要明确泛型的类型

```java
public class ParentGeneric<T> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
```

**子类是泛型类**

```java
public class ChildGeneric<T> extends ParentGeneric<T> {
   
}
```

**子类不是泛型类**

```java
public class ChildGeneric extends ParentGeneric<String> {

}
```



## 泛型接口

- 实现类不是泛型类，接口要明确数据类型
- 实现类是泛型类，实现类和接口的泛型类型要一致

```java
public interface GenericInterface<T> {
    T getData();
    void setData(T data);
}
```

**实现类不是泛型类**

```java
public class Sample implements GenericInterface<String> {
    @Override
    public String getData() {
        return "hello";
    }
}
```

**实现类是泛型类**

```java
public class Sample<T> implements GenericInterface<T> {
    @Override
    public T getData() {
        return null;
    }
}
```

```java
Sample<String> strSample = new Sample<>("abc");
String data = strSample.getData();
System.out.println(data);//abc
```



## 泛型方法

泛型方法在调用方法的时候需要指定泛型类型。

```java
class User<T> {
    public void sayHello(T value) {
        System.out.println(value);
    }

    public <U> void printAge(U age) {
        System.out.println(age);
    }
}
```
使用：
```
User<String> user = new User<>();
user.sayHello("hello");
user.printAge(10);
```



## 泛型边界

- `<?>`: 无限通配符，可以为任意类型。
- `<? extends T>`: 上限通配符，参数类型是T及其子类。
- `<? super T>`: 下限通配符，参数类型是T及其父类。


```java
class Base {
}

class Fruit extends Base {
    public String fruitName;
}

class Apple extends Fruit {
    public String name;
}
```

**上限通配符：**

```java
public static void process1(List<? extends Fruit> list) {
    for (Fruit e : list) {
        System.out.println(e);
    }
}

List<Fruit> list = new ArrayList<>();
list.add(new Fruit("A"));
list.add(new Fruit("B"));
list.add(new Apple("C"));
process1(list);
```

**下限通配符：**

```java
public static void process2(List<? super Fruit> list) {
    for (int i = 0; i < 3; i++) {
        list.add(new Fruit(String.valueOf(i)));
    }
    System.out.println(list);
}

List<Fruit> list = new ArrayList<>();
process2(list);
```

**无限通配符：**

```java
public static void process3(List<?> list) {
    for (Object e : list) {
        System.out.println(e);
    }
    list.add(null);
}
```



### PECS原则

PECS原则（Producer Extends Consumer Super），如果需要返回`T`类型，它是生产者（Producer），要使用`extends`通配符；如果需要写入`T`类型，它是消费者（Consumer），要使用`super`通配符。

通俗理解：`List<? extends Fruit>`：编译器知道元素的类型是Fruit类型和子类，但是具体子类型是不知道的，为了保证类型安全，不允许往里添加数据，但是因为知道都是Fruit类型，因此可以取数据。

`List<? super Fruit>`：编译器知道元素的类型是Fruit类型和父类，但是不知道具体哪个父类，因此读取是都按Object类型，添加数据时可以插入Fruit类型和子类，因为这个集合的元素都是Fruit的父类。

```java
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T e : src) {
        dest.add(e);
    }
}

List<Fruit> destList = new ArrayList<>(20);
destList.add(new Apple("C"));
List<Apple> appleList = new ArrayList<>(20);
appleList.add(new Apple("A"));
appleList.add(new Apple("B"));
Test.<Fruit>copy(destList, appleList);
System.out.println(destList);    
```



## List & `List<Object>` & `List<?>` 区别

```java
//不使用泛型
List list1 = new ArrayList();
list1.add(new Object());
list1.add(new Integer(1));
list1.add("hello");
Object o = list1.get(1);
```

不使用泛型，所有功能可以正常使用，取值是Object类型。

```java
//泛型Object
List<Object> list2 = new ArrayList();
List<String> strList = new ArrayList<>();
list2 = strList; //报错
```

需要保证泛型一致。

```java
//泛型?
List<?> list3 = new ArrayList();
list3.add(null);
list3.add("hello"); //报错
```

`List<?>`一般作为参数接收外部的集合，或返回一个未知类型的集合。因为类型不确定，因此不能添加非null元素。



## 泛型擦除

Java的泛型是JDK5新引入的特写，为了向下兼容，虚拟机是不支持泛型的，所以Java实现的是一种伪泛型机制。

也就是说Java在编译期就会擦除所有的泛型信息，这样Java就不会产生新的类型到字节码，所有的泛型类最终都是一种原始类型。

在运行期Java不存在泛型信息。

**泛型擦除规则：**

- 没有限定类型，则用Object作为原始类型。

- 有限定类型，则用上限类型作为原始类型，如`<T extends MyClass>`，MyClass作为原始类型。

- 多个限定类型，则使用第一个边界类型作为原始类型，如`<T extends MyClass,MyClass2>`，MyClass作为原始类型。

  

### 无限制类型擦除

```java
public class Erasure<T> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201004205947982.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70#pic_center)

**通过反射获取类型：**

```java
Erasure<String> erasure = new Erasure<>();
Class<? extends Erasure> clz = erasure.getClass();
Field field = clz.getDeclaredField("value");
System.out.println(field.getName() + " " + field.getType().getName()); //value java.lang.Object
```



### 有限制类型擦除

如果泛型指定了上限，则类型替换为上限类型。

```java
public class Erasure<T extends Number> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201004210017616.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70#pic_center)

**通过反射获取类型：**

```java
Erasure<? extends Number> erasure = new Erasure<>();
Class<? extends Erasure> clz = erasure.getClass();
Field field = clz.getDeclaredField("value");
System.out.println(field.getName() + " " + field.getType().getName()); //value java.lang.Number
```

