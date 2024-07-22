[TOC]

# JVM 基础

## 什么是JVM

Java虚拟机（Java Virtual Machine，简称JVM），是一种能运行Java字节码的虚拟机。JVM是一种规范，JVM与Java没有关系，只要生成的字节码文件符合JVM规范都允许允许，如Kotlin、Scala等。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ff2ee7f12efc4f8f8040a07d8f96ba82.png)





## JDK & JRE & JVM的关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/b55accf013b0441daa84b4508902dd5e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

- JDK：即Java Development Kit，是Java的开发工具包，JDK包含Java开发工具和JRE，是开发用的。
- JRE：即Java Runtime Environment，是Java运行环境，JRE包含Java程序所需要的核心类库和JVM，如果只是运行Java程序则只需安装JRE即可，是运行用的。
- JVM：即Java Virtual Machine，是Java虚拟机，它只能识别`.class`的文件，将字节码文件转化为机器码并调用，是跨平台使用的。



## JVM 结构

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8858ff8addfd416a88b36dd048eb22c3.jpeg)

**最上层：**

类装载器子系统。javac编译器将编译好的字节码文件，通过Java类装载器执行机制，把对象或字节码文件存放在JVM内存划分区域。

**中间层：**

运行时数据区(Runtime Data Area)。主要是在Java代码运行时用于存放数据的区域，包括方法区、堆、Java栈、程序计数器、本地方法栈。

**最下层：**

执行引擎层。执行引擎包含解释器、JIT(Just In Time)编译器和垃圾回收器(Garbage Collection,GC)。



## JVM 执行流程

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8f0a37eb7d2d453298865871613ee585.jpeg)



- 编译期：Java源文件经过编译器的词法分析、语法分析、语义分析、字节码生成器等一系列过程生成以“.class”为后缀的字节码文件。
- 运行期：字节码文件再经过JVM的类加载器、字节码校验器、翻译字节码（解释执行）或JIT编译器（编译执行）的过程编译成机器指令，提供给操作系统进行执行。



## JVM 架构模型

- 基于栈式架构。
  - 指令集更小，编译器容易实现。
  - 可移植性好，方便跨平台。
- 基于寄存器架构。
  - 直接由CPU执行，效率更高。

**源码：**

```java
public static void main(String[] args) {
    int i = 2;
    int j = 3;
    int k = i + j;
    System.out.println(k);
}
```

**字节码：**

```
 0 iconst_2 // 常量2入操作数栈
 1 istore_1 // 将常量2保存到局部变量表的第1个位置
 2 iconst_3 // 常量3入操作数栈
 3 istore_2 // 将常量3保存到局部变量表的第2个位置
 4 iload_1  // 将局部变量表中第1个变量压入操作数栈
 5 iload_2  // 将局部变量表中第2个变量压入操作数栈
 6 iadd 	// 常量2和3相加，并压入操作数栈栈顶
 7 istore_3 // 弹出操作数栈栈顶元素，保存到局部变量表的第3个位置
 8 getstatic #2 <java/lang/System.out : Ljava/io/PrintStream;>
11 iload_3  // 将局部变量表中第3个元素压入操作数栈
12 invokevirtual #3 <java/io/PrintStream.println : (I)V>
15 return
```



## JVM 生命周期

- JVM启动
  - 通过Java命令启动，通过类加载器加载类文件，找到main()方法执行Java程序。
- JVM执行
  - 通过main()方法执行程序。
- JVM退出
  - 程序正常执行结束。
  - 发生异常结束。
  - 系统错误导致JVM终止。
  - 强制关闭JVM。

