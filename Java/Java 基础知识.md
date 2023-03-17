[TOC]

# Java 基础知识

## 概述

Java是一种面向对象的语言。最显著的特性有两个方面，一是编写一次到处运行，具有跨平台能力；二是垃圾收集，通过垃圾收集器（Garbage Collector）分配回收内存，大部分情况下开发人员无需操心内存的分配和回收。

- JRE：即Java运行环境，包含JVM和Java类库。
- JDK：可以看作JRE的一个超集，提供更多的工具，如编译器、诊断工具类。



## 编译期和运行时

![在这里插入图片描述](https://img-blog.csdnimg.cn/d93b9a8f557a47bcaa0d237db69f7cec.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_17,color_FFFFFF,t_70,g_se,x_16)

Java通过引入字节码这种中间表达式，屏蔽了不同硬件的差异，由JVM复杂完成从字节码到机器码的转化。

Java分为编译期和运行时。首先通过Javac等编译器将Java源代码转换成字节码，字节码是不能直接运行的；再通过JVM中的解释器将字节码转换为最终的机器码。这就是实现“一次编译，到处执行”的基础。



## 数据类型

Java支持两种类型，基本数据类型（primitive types）和引用类型（reference types）。引用类型又可分为：类和数组。



### 基本数据类型

在Java中，一个字符是2个byte字节，一个byte等于8bit

| 基本数据类型 | 默认值   | 字节数 |
| ------------ | -------- | ------ |
| byte         | 0        | 1      |
| short        | 0        | 2      |
| int          | 0        | 4      |
| long         | 0L       | 8      |
| float        | 0f       | 4      |
| double       | 0.0      | 8      |
| char         | '\u0000' | 2      |
| boolean      | false    | 4      |

说明：在JVM规范中，boolean变量当作int处理，也就是4个字节；而boolean数组当作byte数组处理，也就是每个元素占1个字节。



### 变量

- 实例变量（成员变量）：没有static声明的变量，直接通过new产生的，它们的值对于类的每个实例都是唯一的。
- 类变量（静态变量）：用static修饰的字段，只属于类，所以在内存中只有一个副本。
- 局部变量：方法中的变量。
- 参数：如`public static void main(String[] args)`这里的`args`变量就是这个方法方法的参数。



### 字面量

在Java中，字面量=字面值，字面量表示固定的值，直接展示在代码中

- 整型字面量：如`26、0x1A、0b110110`
- 浮点字面量：如`123.4、1.23F`
- 字符和字符串字面量：如`'@'、'a'、"abchello"`
- 特殊字面量：如`12_456、1.23_45`



## 数组

### 创建和初始化数组

```java
//声明数组
int[] arr;

//创建并初始化
int[] arr = {1, 2, 3, 4, 5};
```



### 复制数组

可以借助`System#arraycopy()`方法实现。

```java
char[] arr = {'a', 'b', 'c', 'd', 'e', 'f', 'g'};
char[] newArr = new char[4];
System.arraycopy(arr, 2, newArr, 0, 3);
System.out.println(newArr); //cde 
```



## Java的作用域

| 作用域    | 当前类 | 同一包 | 子类 | 其他包 |
| --------- | ------ | ------ | ---- | ------ |
| public    | ✓      | ✓      | ✓    | ✓      |
| protected | ✓      | ✓      | ✓    | ×      |
| 缺省      | ✓      | ✓      | ×    | ×      |
| private   |  ✓      | ×      | ×    | ×      |




## 面向对象三大特性

**Java面向对象的三大特征是：封装、继承、多态。**

### 封装

- 封装是面向对象的重要原则。
- 统一管理内部代码，简化编程，方便代码维护。
- 隐藏内部细节，避免外部调用，提供安全性。

### 继承

- 继承是面向对象最显著的特性。
- 继承体现了子类与父类的关系。
- 子类可以继承父类的部分属性和方法，也可以 方法重载/重写 拓展自己的属性和方法。
- 继承有利于增加代码复用，简化代码的维护，提供工作效率。

### 多态

- 多态是对封装和继承的扩展。
- 多态的作用是为了消除类之间的低耦合问题。
- 多态必须要有继承和重写，父类引用指向子类对象。
- 多态有利于复用对象，根据不同场景指向不同的子类。



## 类 & 对象 & 实例 的理解

```java
Person p = new Person();
```

-   `Person p`表示声明了一个Person类型的变量，变量p的引用类型是Person，抽象类是不能被实例化的。
-   `p = new Person()`表示实例化过程，走了new流程并在堆中开辟了一块内存，并赋值给变量p，变量p的实例对象类型是Person。

其实没必要纠结这些名词之间的差异的。



## 属性 & 字段 语义区别

-   字段指类中声明的公有变量。
-   属性是对字段的管理，具有set或get方法。



## 方法重载 & 方法重写

### 方法重载

- 方法重载指同一个类具有多个重名的方法
- 特点：
  - 方法名必须相同
  - 返回值类型、参数列表必须不同

```java
class Animal {
    public void eat(String food) {
    }

    public void eat(int food) {

    }
}
```


### 方法重写

- 方法重写指子类重新编写父类的方法
- 特点：
  - 返回值类型、方法名、列表参数不能改变
  - 方法体需要重写

```java
class Animal {
    protected void eat(String food) {
    }
}

class Dog extends Animal {
    @Override
    public void eat(String food) {
        System.out.println("Dog eat");
    }
}
```



## 接口 & 抽象类

### 接口

- 接口是Java语言中的一个抽象类型，用于定义对象的公共行为。声明接口需要使用`interface`关键字，实现接口需要使用`implements`关键字。
- 在Java 8中，可以在接口中定义抽象方法、static、default方法。接口中的变量默认是`public static final`类型。
- 接口不能直接实例化。
- 接口具有多实现的特点。

### 抽象类

- 抽象类与接口类似，定义对象的公共行为。声明抽象类需要使用`abstract class`关键字，继承抽象类需要使用`extends`关键字。
- 抽象类可以包含普通方法和抽象方法。
- 抽象类不能直接实例化。
- Java只支持单继承。



## 代码块 & 静态代码块 & 构造函数的执行顺序

```java
public class Demo {
    public static void main(String[] args) {
        Base b1 = new Base();
        System.out.println("====");
        Base b2 = new Base();
    }
}

class Base {
    static {
        System.out.println("Base 静态代码块");
    }

    {
        System.out.println("Base 普通代码块");
    }

    public Base() {
        System.out.println("Base 构造函数");
    }
}

//Base 静态代码块
//Base 普通代码块
//Base 构造函数
//====
//Base 普通代码块
//Base 构造函数
```

**结论：**

- 先执行静态代码块，再执行普通代码块，最后执行构造函数。
- 静态代码块只会被调用一次。



**子类继承父类的情况**

```java
class Child extends Base {
    static {
        System.out.println("Child 静态代码块");
    }

    {
        System.out.println("Child 普通代码块");
    }

    public Child() {
        System.out.println("Child 构造函数");
    }
}

//Base 静态代码块
//Child 静态代码块
//Base 普通代码块
//Base 构造函数
//Child 普通代码块
//Child 构造函数
```



