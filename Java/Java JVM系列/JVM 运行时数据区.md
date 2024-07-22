[TOC]

# JVM 运行时数据区

## 概述

JVM在程序执行期间把它所管理的内存分为若干个不同的数据区域。

JVM运行时数据区也被称为内存结构，主要有五部分组成：

- Native Method Stack（本地方法栈）
- Program Counter Register（程序计数器）
- Java Virtual Machine Stack（虚拟机栈）
  - 以栈帧为基本单位构成
  - 栈帧包括局部变量表、操作数栈、动态链接、方法返回地址和一些附加信息
- Heap（堆区）
  - 分为Young区（新生代）、Old区（老年代）
- Method Area（方法区）
  - 分为常量池、方法元信息、klass类元信息

这些不同的数据区域可以分为两种类型：一种是在JVM启动时创建，仅在JVM退出时才被销毁，这种可以理解为线程共享的，另外一种数据区是针对每个线程的，是在创建线程时创建的，并在线程退出时销毁，这种可以理解为线程私有的。

- 线程私有的区域：程序计数器、虚拟机栈、本地方法栈。
- 线程间共享区域：堆区、方法区。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cd654ed46618408ebc6054cb58b2f3e8.png)

[官方文档](https://docs.oracle.com/javase/specs/jvms/se8/html/)



## 内存结构图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210427143444653.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



## 程序计数器

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fabad1bb3baf477bb21c4361d441156e.jpeg)

- 程序计数器（Program Counter Register）：一块较小的内存空间，记录字节码指令的地址，也就是代码的执行流程。
- 程序计数器用于存储下一条指令的地址，也就是将要执行的指令代码。当执行引擎执行一条指令时，它会将下一条要执行的指令的地址加载到程序计数器中。它是程序控制流的指示器。分支、循环、跳转、异常处理、线程恢复等基础功能，都需要依赖这个计数器来完成。
- Java是多线程语言，CPU需要不断切换各个线程，因此需要用程序计数器记录字节码指令地址。
- 线程私有的，生命周期与线程的生命周期保持一致。
- 不会发生OOM。



## 虚拟机栈

![在这里插入图片描述](https://img-blog.csdnimg.cn/3026e5dc2f37449497a0d0ad3a51f339.png)

- Java虚拟机栈（Java Virtual Machine Stack）：
  - 每个线程在创建时都会创建一个虚拟机栈，其内部由许多栈帧(Stack Frame)构成，每个栈帧对应着一个Java方法的调用。
  - 先进后出的数据结构，只支持出栈和入栈两种操作。
  - 线程私有的，虚拟机栈的生命周期和线程一致。

- 栈帧（Stack Frame）：
  - 每个方法被执行时，JVM会同步创建一个栈帧。每个方法从被调用到执行完毕的过程，对应一个栈帧在虚拟机栈中从入栈到出栈的过程。
  - 位于栈顶的方法称为当前方法。
  - 栈帧的组成：
    - 局部变量表（Local Variable Table）：存储方法参数和方法内部定义的局部变量。
    - 操作数栈（Operand Stack）：栈结构，主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间。
    - 动态链接（Dynamic Linking）：将符号引用转换为直接引用。
    - 返回地址（Return Address）：指向调用该方法之后的下一条指令。

**内存溢出问题：**

- 栈帧过多导致内存溢出，JVM会抛出 StackOverflowError 异常，如方法递归调用。
- 栈帧过大导致内存溢出，JVM会抛出 OutOfMemoryError 异常。

### 局部变量表

- 局部变量表也称为本地变量表或局部变量数组。
- 主要用于存储方法参数和方法体内的局部变量。包含基本数据类型、对象引用、returnAddress类型。
  - 基本数据类型，直接存储它的值。
  - 引用类型，存储对象的引用。
- 是线程私有的。
- 局部变量表的容量大小在编译期确定的。
- 方法调用结束后，栈帧会被销毁，局部变量表也会跟着销毁。

**可以通过 jclasslib 插件查看字节码信息：**

**成员方法：**

```java
public void sayHello(int param) {
    String text = "hhh";
    System.out.println(text + age);
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/81485cd5e5e540ecb4641149ffb64226.png)

说明：局部变量表里有3个局部变量，包含this对象、方法里的参数和text局部变量。

**静态方法：**

```java
public static void sayHi(int[] args) {
    String hi = "hihhii";
    System.out.println(hi);
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9575b78760014fd8adb81e143c2757bd.png)

说明：局部变量表里有2个局部变量，没有了this对象。

### 操作数栈

- 栈结构。
- 主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间。
- 当一个方法开始执行时，一个新的栈帧会被创建，这个方法的操作数栈是空的。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e4e0aa8e24ca423db3936afc49455a42.jpeg)

**代码：**

```java
public int work() {
    int x = 1;
    int y = 2;
    int z = (x + y) * 10;
    return z;
}
```

**字节码指令分析：**

```
0 iconst_1 		将int类型1入操作数栈
1 istore_1 		将操作数栈中栈顶int类型值，存入局部变量表
2 iconst_2 		将int类型2入操作数栈
3 istore_2 		将操作数栈中栈顶int类型值，存入局部变量表
4 iload_1		将局部变量表中下标为1的int类型数据入栈
5 iload_2		将局部变量表中下标为2的int类型数据入栈
6 iadd			两数相加，将计算结果入操作数栈
7 bipush 10		将10的压入操作数栈
9 imul			两数相乘，将结果压入操作数栈
10 istore_3		将操作数栈中栈顶int类型值，存入局部变量表
11 iload_3		将局部变量表中下标为3的int类型值入栈
12 ireturn		返回栈顶值
```

### 动态链接

- 每一个栈帧都包含一个指向运行时常量池的该帧所属方法的引用。
- Java源文件被编译为字节码文件时，所有的变量和方法都会作为符号引用保存在class文件中的常量池里。
- 动态链接的目的是在JVM加载字节码文件时，将类数据加载到内存中，当前栈帧能清楚记录该方法的来源。将字节码中的符号引用转换为调用方法的直接引用，直接引用就是程序运行时该方法在内存中的具体地址。

**代码：**

```java
public class Test {
    public static void main(String[] args) {
        Person p = new Person();
        p.sayHello();
    }
}
```

**字节码指令：**

```
 0 new #2 <com/example/java_demo/Person>
 3 dup
 4 invokespecial #3 <com/example/java_demo/Person.<init> : ()V>
 7 astore_1
 8 aload_1
 9 invokevirtual #4 <com/example/java_demo/Person.sayHello : ()V>
12 return
```

说明：`#2` 指向方法区中的类信息。

#### 静态链接和动态链接

在JVM中，将符号引用转换为符号引用，与方法的绑定机制相关。方法的绑定机制有两种：

- 静态链接。
- 动态链接。

静态链接：当一个字节码文件被JVM加载时，如果被调用的目标方法在编译期可知，且运行期保存不变。这时将调用方法的符号引用转换为直接引用的过程称为静态链接。

动态链接：如果被调用的方法在编译期无法确定下来，只能在程序运行期将调用方法的符号引用转换为直接引用。由于这种转换过程具有动态性，因此称为动态连接。

```java
class Animal {
    public void eat() {
        System.out.println("吃");
    }
}

interface IFunctions {
    void run();
}

class Dog extends Animal implements IFunctions {

    @Override
    public void eat() {
        System.out.println("吃骨头");
    }

    @Override
    public void run() {
        System.out.println("看门");
    }
}

class Cat extends Animal implements IFunctions {
    public Cat() {
        super(); // 静态链接
    }

    public Cat(String name) {
        this(); // 静态链接
    }

    @Override
    public void eat() {
        super.eat(); // 静态链接
        System.out.println("吃鱼");
    }

    @Override
    public void run() {
        System.out.println("抓老鼠");
    }
}

class Test {
    public void showAnimal(Animal animal) {
        animal.eat(); // 动态链接
    }

    public void showRun(IFunctions f) {
        f.run(); // /动态链接
    }
}
```

说明：showAnimal() 和 showRun() 方法无法在编译期确定，因此这两个方法是动态链接。

#### 虚方法和非虚方法

静态链接指方法在编译期就确定了，称为非虚方法。其他就是虚方法。

非虚方法包含：静态方法、私有方法、final方法、构造函数、父类方法。

方法调用指令：

1. invokestatic：调用静态方法。
2. invokespecial：调用init方法、私有和父类方法。
3. invokevirtual：调用所有虚方法。
4. invokeinterface：调用接口方法。
5. invokedynamic：动态解析出需要调用的方法，然后执行。

普通调用指令：1~4条。

动态调用指令：第5条。

非虚方法：invokestatic、invokespecial。

虚方法：除final外，其他都是。

### 返回地址

- 调用该方法的程序计数器的值，这个返回地址指向调用该方法之后的下一条指令。
- 方法的结束分两种情况：
  - 正常执行完。
  - 异常非正常结束。
- 方法正常退出时，程序计数器的值作为返回地址，也就是该方法的指令单下一条指令单地址。
- 方法异常退出时，返回地址是通过异常表确定的，栈帧中一般不会保存这部分信息。
- 无论哪种方式退出，方法结束后都会返回到该方法调用的位置。

#### 正常退出

**返回指令：**

- ireturn：boolean、byte、char、short、int
- lreturn：long
- freturn：float
- dreturn：double
- areturn：引用类型
- return：void方法，实例初始化方法、类和接口初始化方法

**代码：**

```java
class MyReturn {
    public boolean methodBoolean() {
        return false;
    }

    public byte methodByte() {
        return 0;
    }

    public short methodShort() {
        return 0;
    }

    public char methodChar() {
        return 'a';
    }

    public int methodInt() {
        return 0;
    }

    public long methodLong() {
        return 0L;
    }

    public float methodFloat() {
        return 0.0F;
    }

    public double methodDouble() {
        return 0.00;
    }

    public String methodString() {
        return null;
    }

    public Date methodDate() {
        return null;
    }

    public void methodVoid() {

    }

    static {
        int i = 10;
    }
}
```

**字节码：**

```
  com.example.lib_test.MyReturn();
    descriptor: ()V
    flags: (0x0000)
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 6: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/example/lib_test/MyReturn;

  public boolean methodBoolean();
    descriptor: ()Z
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: iconst_0
         1: ireturn
      LineNumberTable:
        line 9: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public byte methodByte();
    descriptor: ()B
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: iconst_0
         1: ireturn
      LineNumberTable:
        line 13: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public short methodShort();
    descriptor: ()S
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: iconst_0
         1: ireturn
      LineNumberTable:
        line 17: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public char methodChar();
    descriptor: ()C
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: bipush        97
         2: ireturn
      LineNumberTable:
        line 21: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       3     0  this   Lcom/example/lib_test/MyReturn;

  public int methodInt();
    descriptor: ()I
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: iconst_0
         1: ireturn
      LineNumberTable:
        line 25: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public long methodLong();
    descriptor: ()J
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: lconst_0
         1: lreturn
      LineNumberTable:
        line 29: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public float methodFloat();
    descriptor: ()F
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: fconst_0
         1: freturn
      LineNumberTable:
        line 33: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public double methodDouble();
    descriptor: ()D
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: dconst_0
         1: dreturn
      LineNumberTable:
        line 37: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public java.lang.String methodString();
    descriptor: ()Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aconst_null
         1: areturn
      LineNumberTable:
        line 41: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public java.util.Date methodDate();
    descriptor: ()Ljava/util/Date;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aconst_null
         1: areturn
      LineNumberTable:
        line 45: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       2     0  this   Lcom/example/lib_test/MyReturn;

  public void methodVoid();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 50: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       1     0  this   Lcom/example/lib_test/MyReturn;

  static {};
    descriptor: ()V
    flags: (0x0008) ACC_STATIC
    Code:
      stack=1, locals=1, args_size=0
         0: bipush        10
         2: istore_0
         3: return
      LineNumberTable:
        line 53: 0
        line 54: 3
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
}
```

#### 异常退出

方法执行过程中遇到异常：

- 没有使用try-catch/try-finally：也就是该方法的异常表没有搜索到匹配的异常处理器，会导致方法退出。
- 使用try-catch/try-finally：进行异常处理。



## 本地方法接口

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a16ca3f134bc4a73830402665ca8a911.jpeg)

- 本地方法接口（Java Native Interface，JNI）：负责和本地方法库、JVM之间的交互。
- JNI 可以帮助 Java 代码与使用其他编程语言（例如C、C++和汇编）编写的应用程序和库进行交互。
- JNI 最重要的好处是它对底层 JVM 的实现没有任何限制。
- 本地方法用 native 修饰，并且没有方法体，具体的方法体由非Java代码实现。



## 本地方法栈

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1371f11362744694bad7edd0164f7139.jpeg)

- 本地方法栈（Native Method Stack）：用于支持本地方法的执行，一般由C语言实现。
- 本地方法栈与Java虚拟机栈的作用类似，Java虚拟机栈用于管理Java方法的调用，而本地方法栈用于管理本地方法的调用。
- 线程私有的。
- 会抛出OOM和StackOverFlowError



## 堆

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2df35f2b65504c29893706a1106663a6.jpeg)

- 堆（Heap）：是Java内存管理的核心区域。
- 堆在JVM启动时被创建，空间大小也随之被确定，是JVM管理的最大一块内存空间，其大小是可以根据参数调节的。
- 物理上不连续，逻辑上视为连续的。
- 存放所有类实例和数组对象。
- 线程共享的。

**堆内存溢出问题：**

- 堆内存不足时虚拟机会抛出 OutOfMemoryError 异常。

**堆与栈关系：**

- 堆中存放对象实例。
- 栈帧中存放对象引用，引用指向实例在堆中的位置。

<img src="https://i-blog.csdnimg.cn/direct/295e13424173448b90d8bfcdd6aa3b08.jpeg" alt="在这里插入图片描述" style="zoom: 33%;" />

**Java对象可分为两类：**

- 生命周期较短的对象：创建和消亡都非常迅速，一般放在新生代。
- 生命周期较长的对象：会进入老年代。

**堆空间划分：**

方法结束后，堆中的对象不会被立即移除，而是在垃圾收集时才会被移除。

- 新生代（Young Generation Space / Young / New）可分为：占堆内存1/3
  - Eden区：占新生代8/10
  - Survivor区：
    - Survivor0区：可称为From区或S0区，占新生代区1/10
    - Survivor1区：可称为To区或S1区，占新生代区1/10
- 老年代（Tenured Generation Space / Old / Tenured）：占堆内存2/3

![在这里插入图片描述](https://img-blog.csdnimg.cn/5541796fc79f4ab19d0937cb1bf90741.png)

**对象分配过程：**

1. new的对象先放在Eden区。
2. 如果Eden区空间满了，程序创建对象时，JVM会对Eden区进行垃圾回收，Eden区的垃圾对象会被销毁，将新对象放入Eden区。
3. Eden区的剩余对象移动到S0区，S0区的对象有一个年龄计数器，值为1。
4. 如果再次触发垃圾回收，GC会对Eden区和S0区进行垃圾回收，没有回收的对象移动到S1区，从S0区移动来的对象的年龄计数器变为2，从Eden区移动来的对象的年龄计数器为1。
5. 如果再次发生垃圾回收，存活的对象会被移动到S0，年龄计数器加1，循环这类操作。
6. 当年龄计数器的值超过15，对象会进入老年代。
7. 老年代内存相对较大，当老年代内存不足时，会触发GC，可能发生 Major GC 或 Full GC，对老年代进行内存清理。
8. 如果老年代执行了 Major GC 依然内存不足，就会产生OOM异常。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/931487bf576b4f29a7531f65f274a032.jpeg)



## 方法区

![在这里插入图片描述](https://img-blog.csdnimg.cn/5139a8d4423f4f029f48c6a25edde622.png)

- 方法区（Method Area）：存储类的结构信息。
- 存储被虚拟机加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存等方法区在虚拟机启动时创建。
- 线程共享的。

**栈、堆和方法区关系：**

```
Student student = new Student();
```

JVM会将Student类加载到方法区，将student变量放到虚拟机栈中，new的对象实例放在堆中。



<img src="https://i-blog.csdnimg.cn/direct/828b449859974cd993a72720a4f50c63.jpeg" alt="在这里插入图片描述" style="zoom:50%;" />

<img src="https://i-blog.csdnimg.cn/direct/b38d578b011f480e83de25951104a85f.jpeg" alt="在这里插入图片描述" style="zoom:50%;" />

**方法区版本变化：**

- JDK1.6及以前：有永久代，静态变量存放在永久代。
- JDK1.7：有永久代，但逐步“去永久代”，字符串常量池、静态变量保存在堆中。
- JDK1.8及以后：用元空间替代了永久代，元空间用的本地内存。类型信息、字段、方法、常量保存在元空间，字符串常量池、静态变量保存在堆中。

<img src="https://i-blog.csdnimg.cn/direct/613143be1292408da95c3d36a6a92a05.jpeg" alt="在这里插入图片描述" style="zoom: 67%;" />

<img src="https://i-blog.csdnimg.cn/direct/63604ad3dcaf4e07a9dd05e9bac1136f.jpeg" alt="在这里插入图片描述" style="zoom:67%;" />

<img src="https://i-blog.csdnimg.cn/direct/fb2a38f494484da7b84a15cce4296d6f.jpeg" alt="在这里插入图片描述" style="zoom:67%;" />



## 其他问题

### 成员变量 & 局部变量

- 成员变量存放在堆内存，是对象实例的一部分。
- 局部变量存放在虚拟机栈的栈帧中的局部变量表。



### 字面量 & 符号引用 & 直接引用

字面量：

-   字符串
-   final定义的常量值

符号引用：指一组符号描述所引用的目标。符号引用的字面量形式明确定义在“Java虚拟机规范”的Class文件格式中。

-   类和接口的全限定名
-   字段的名称和描述符
-   方法的名称和描述符

直接引用：指直接指向目标的指针、相对偏移量或要给间接定位到目标的句柄。类加载时会将符号引用转为直接引用。



### 垃圾回收是否涉及栈内存

垃圾回收不会涉及栈内存，因为栈内存是一次次的方法调用产生的栈帧内存，方法调用结束后，虚拟机栈会做出栈操作，自动回收内存。垃圾回收只会回收堆内存中无用的对象。


