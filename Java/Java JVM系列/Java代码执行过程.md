[TOC]

# Java代码执行过程

## 概述

执行引擎是Java虚拟机核心的组成部分之一。

JVM的主要任务是加载字节码，因为字节码不是机器码，所以Java字节码不能直接运行，因此需要执行引擎将字节码指令转为本地机器码指令。在HotSpot中，有两种形式转换：

- 解释执行，将字节码指令逐条翻译为机器码并执行；
- 编译执行，将字节码直接编译为本地机器码并执行。



## 解释器和及时编译器

Java代码的执行可分为编译期和执行期：Java通过**前端编译器**将Java源代码编译为字节码，再通过**解释器**执行字节码，同时通过**及时编译器**的检测和编译热点代码提高执行效率。

- 前端编译器：javac就是前端编译器，可以将Java文件编译为字节码文件。
- 解释器：Java虚拟机会根据规范堆字节码采用逐行解释的方式执行，将每条字节码文件中的内存翻译为对应的机器码指令执行。优势在于无序等待编译。
- 及时编译器（后端编译器）：即（Just In-Time compiler）JIT，以方法为单位，将热点代码的字节码直接编译为机器码，并缓存在本地，运行效率更高。

HotSpot虚拟机默认采用混合模式，综合了解释执行和及时编译两者都有点。它会先解释执行字节码，而后将其中反复执行的热点代码，以方法为单位进行及时编译。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5178575e4bab4982870ccd3d995e8be8.png)



### 为什么说 Java是半编译半解释型语言

这是因为JVM在执行Java代码时，通常会将解释执行与编译执行二者结合进行的。



## 热点代码检测

- 方法计数器：监测方法执行频率；
- 循环计数器：检测循环执行频率。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8cb1a1593a11458e997b33f996163f2f.png)



## -Xmixed -Xint -Xcomp

- -Xmixed：混合模式执行，为默认模式，开始解释执行，启动速度较快，对热点代码实行检测和编译。
- -Xint：仅解释模式执行，启动很快，执行稍慢。
- -Xcomp：仅编译模式执行，执行很快，启动很慢。

### 测试代码

```java
public class Demo {
    public static void main(String[] args) {
        for (int i = 0; i < 10_0000; i++) {
            test();
        }

        long start = System.currentTimeMillis();
        for (int i = 0; i < 10_0000; i++) {
            test();
        }
        long end = System.currentTimeMillis();
        System.out.println("耗时：" + (end - start));
    }

    public static void test() {
        for (long i = 0; i < 10_0000L; i++) {
            long j = i % 3;
        }
    }
}
```



### 测试 -Xmixed 混合模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/4c0b749aed0f416ea15f155949b16fff.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

执行多次依次输出：

```
耗时：2185
耗时：2184
耗时：2184
```



### 测试 -Xint 仅解释模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/d4ca7aefbb024b5098098131b5345fcb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

执行多次依次输出：

```
耗时：159085
耗时：159064
```



### 测试 -Xcomp 仅编译模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6f3e235f4974469800d51b714e3b908.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

执行多次依次输出：

```
耗时：2187
耗时：2191
耗时：2186
```

