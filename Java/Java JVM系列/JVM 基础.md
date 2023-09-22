[TOC]

# JVM 基础

## 什么是JVM

Java虚拟机（Java Virtual Machine，简称JVM），是一种能运行Java字节码的虚拟机。JVM是一种规范，JVM与Java没有关系，只要生成的字节码文件符合JVM规范都允许允许，如Kotlin、Scala等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/700659db52a145fb8586c3c52185ab32.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_16,color_FFFFFF,t_70,g_se,x_16)





## JDK & JRE & JVM的关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/b55accf013b0441daa84b4508902dd5e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

- JDK：即Java Development Kit，是Java的开发工具包，JDK包含Java开发工具和JRE，是开发用的。
- JRE：即Java Runtime Environment，是Java运行环境，JRE包含Java程序所需要的核心类库和JVM，如果只是运行Java程序则只需安装JRE即可，是运行用的。
- JVM：即Java Virtual Machine，是Java虚拟机，它只能识别`.class`的文件，将字节码文件转化为机器码并调用，是跨平台使用的。



## JVM运行过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/6d5b6cb9251248739e57e76fe45db222.png)

1. 类加载器：负责加载class文件信息加载到运行时数据区。
2. 运行时数据区：包含堆、方法区、虚拟机栈、本地方法区、程序计数器。
3. 执行引擎：负责解释字节码指令执行操作系统的指令。

