[TOC]

# Java 泛型总结



## 概述

泛型是JDK5引入的特性，提供了编译时类型安全检测机制，该机制允许我们在编译时检测到非法的类型数据结构。

Java允许定义泛型类、泛型接口、泛型方法。

泛型本质是参数化类型，也就是说变量的类型是一个参数，在使用时再指定为具体类型。

常用泛型标识：T 类型、E 元素、K 键、V 值、N 数字



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

- `<?>`: 无限通配符，可以为任意类型
- `<? extends T>`: 上限通配符，参数类型是T的本身或子类
- `<? super T>`: 下限通配符，参数类型是T的本身或父类


```java
class People {
}

class Father extends People {
}

class Son extends Father {
}
```

```java
List<People> list = new ArrayList<>();
list.add(new People());
list.add(new Father());
list.add(new Son());
```

```java
List<? extends People> list = new ArrayList<>(); //具体泛型可以为People、Father、Son
list.add(new People()); //报错
list.add(new Father()); //报错
list.add(new Son()); //报错
```

```java
List<? super Father> list = new ArrayList<>(); //具体泛型可以为Object、People、Father
list.add(new Son()); //是Father的子类
list.add(new Father());
list.add(new People()); //报错
```



### PECE

Producer Extends Consumer Super

如果需要返回`T`，它是生产者（Producer），要使用`extends`通配符；如果需要写入`T`，它是消费者（Consumer），要使用`super`通配符。



## 类型擦除

泛型信息只存在于代码编译阶段，在进入JVM之前，与泛型相关的信息会被擦除掉，我们称为泛型擦除。

泛型信息在运行时是不可用的。

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

```java
Erasure<? extends Number> erasure = new Erasure<>();
Class<? extends Erasure> clz = erasure.getClass();
Field field = clz.getDeclaredField("value");
System.out.println(field.getName() + " " + field.getType().getName()); //value java.lang.Number
```

