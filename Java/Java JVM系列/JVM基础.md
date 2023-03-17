[TOC]

# JVM基础

## 什么是JVM

Java虚拟机（Java Virtual Machine，简称JVM），是一种能运行Java字节码的虚拟机。JVM是一种规范，JVM与Java没有关系，只要生成的字节码文件符合JVM规范都允许允许，如Kotlin、Scala等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/700659db52a145fb8586c3c52185ab32.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_16,color_FFFFFF,t_70,g_se,x_16)





## JDK JRE JVM关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/b55accf013b0441daa84b4508902dd5e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

- JDK：即Java Development Kit，是Java的开发工具包，JDK包含Java开发工具和JRE，是开发用的。
- JRE：即Java Runtime Environment，是Java运行环境，JRE包含Java程序所需要的核心类库和JVM，如果只是运行Java程序则只需安装JRE即可，是运行用的。
- JVM：即Java Virtual Machine，是Java虚拟机，它只能识别`.class`的文件，将字节码文件转化为机器码并调用，是跨平台使用的。



## Java从编码到执行过程

![请添加图片描述](https://img-blog.csdnimg.cn/ea6a0017ee84460b9dc97e56f24d227d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



## JVM体系

![在这里插入图片描述](https://img-blog.csdnimg.cn/05bfe11c06d44e40a43ae575bba6de16.png)