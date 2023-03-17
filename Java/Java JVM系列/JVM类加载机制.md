[TOC]

# JVM类加载机制

## 概述

- 在Java中数据类型分为基本数据类型和引用数据类型。基本数据类型由虚拟机预先定义，引用数据类型则需要进行类的加载。
- 虚拟机通过加载class文件获取描述类的数据，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 使用类型。



## 类加载过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/57584376eeb1448b9e0110bde97a8329.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

**类加载过程：**

1. 加载：查找并加载字节码文件。
2. 验证：检查加载进来的字节码文件是否符合JVM规范。
3. 准备：给类中的静态变量分配内存，并设置默认值。
4. 解析：将常量池中的符号引用转换为直接引用。
5. 初始化：为静态变量设置初始值，执行静态代码块。

### 加载

查找并加载字节码文件。通过类的全限定名获取类的二进制数据流；解析类的二进制数据流为在方法区的数据结构（Java类模型）；在堆内存中生成一个代表该类的Class对象，作为方法区该类的各种数据的访问入口。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0caa2199f1114195ae8b636d5e4b536b.png)

### 验证

检查加载进来的字节码文件的字节流中包含信息是否符合JVM规范。会进行4个阶段的检验：1. 格式验证；2. 语义验证；3. 字节码验证；4. 符号引用验证。

![在这里插入图片描述](https://img-blog.csdnimg.cn/11d64baa193c43bbbac33f07ece108e7.png)

### 准备

为类的静态变量分配内存，并设置默认值，即零值。

- static final 修饰的静态常量在编译阶段会赋初始化值，然后在准备阶段会显示赋值。
- 非 final 修饰的静态变量会在准备阶段会赋初始化值，然后在初始化阶段显示赋值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/578e489330694a40946c700b0608fd20.png)

说明：Java并不支持boolean类型，对于boolean类型，内部实现是int，由于int的默认值是0，因此boolean的默认值是false。

### 解析

将常量池内的符号引用转换为直接引用。解析的对象包括：类、接口、方法、字段。

### 初始化

为类变量设置初始值，执行静态代码快。

**说明：**

- 一个字节码文件被加载到内存中，会在内存中划分两块区域，一块是存储被加载的二进制文件数据，存放在方法区中；另一块是存储一个Class类对象，存放在堆区中，并指向内存中的二进制文件并提供访问方法区内数据结构的接口。
- 符号引用：一组无歧义的符号来描述所引用的目标，与虚拟机的实现无关。
- 直接引用：直接指向目标的指针、相对偏移量、或是能间接定位到目标的句柄，是和虚拟机实现相关的。主要针对：类、接口、字段、方法等。



## 类加载器分类

![在这里插入图片描述](https://img-blog.csdnimg.cn/154bf77eadc94179bcfaf03cbb5438a8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_9,color_FFFFFF,t_70,g_se,x_16)

**类加载器分类：**

- 启动类加载器（Bootstrap ClassLoader）：由C++实现，嵌套在虚拟机内部。默认加载jdk\lib下的核心类，这个路径可以使用 -Xbootclasspath参数指定。
- 扩展类加载器（Extension ClassLoader）：由Java语言编写。默认加载jdk\lib\ext\目录下扩展类，这个路径可以使用 java.ext.dirs系统变量来更改。
- 应用类加载器（App ClassLoader）：由Java语言编写。负责加载开发人员编写的类，负责加载环境变量classpath或系统属性。该类加载器是程序中默认的类加载器，通常Java应用的类都是由它来完成加载到。可以通过`ClassLoader#getSystemClassLoader()`方法获取该类加载器。
- 用户自定义类加载器（Custom ClassLoader）：用户自定义ClassLoader。

JVM支持两种类型的类加载器，分别是：启动类加载器（Bootstrap ClassLoader）和自定义类加载器（User-Defined ClassLoader）。Java虚拟机规范中将所有派生于抽象类ClassLoader的类加载器都划分为自定义类加载器。

各类加载器之间的关系是包含关系。不是上下层，也不是父子继承关系。



## 双亲委派机制

### 概述

Java虚拟机对class文件采用的是按需加载的方式，也就是说当需要使用某个类时才会将它的class文件加载到内存并生成class对象。而且加载某个类的class文件时，Java虚拟机采用的是双亲委派模型，即把请求交给父类加载器处理，他是一种任务委派模型。



### 工作流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/eb7e3ab99fb44c4f9baece11dc0797b8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

1. 当一个类收到类加载的请求时，虚拟机将这个请求交给Custom ClassLoader处理，先从ClassLoader缓存中查找，如果缓存中存在，则直接返回结果；如果缓存中不存在，则委派给它的父ClassLoader（即App ClassLoader）处理。
2. App ClassLoader会先从缓存中查找，如果缓存中存在，则直接返回结果；如果缓存中不存在，则委派给他的父ClassLoader（即Ext ClassLoader）处理。
3. Ext ClassLoader也会先从缓存中查找，如果缓存中存在，则直接返回结果；如果缓存中不存在，则委派给他的父ClassLoader（即Bootstrap ClassLoader）处理。
4. Bootstrap ClassLoader已经是顶层了，没有父ClassLoader，如果这时缓存中仍然没有，则会先从核心库中查找，如果核心库中没有找到，则会给子ClassLoader（即Ext ClassLoader）反馈。
5. Ext ClassLoader收到反馈，会查找扩展库，如果扩展库中不存在，则给子ClassLoader（即App ClassLoader）反馈。
6. App ClassLoader收到反馈，会从应用代码中查找，如果没有找到，会给子ClassLoader（即Custom ClassLoader）反馈。
7. Custom ClassLoader收到反馈，会交给自定义的ClassLoader处理，如果没有找到，则会抛ClassNotFoundException异常。

总结工作过程：当类被加载时，先交给父类加载器处理，若父类加载器无法处理时，子类加载器才会尝试处理。



### 优点

- **避免重复加载**：采用双亲委派模式的是好处是Java类随着它的类加载器一起具备了一种带有优先级的层次关系，通过这种层级关可以避免类的重复加载，当父亲已经加载了该类时，就没有必要子ClassLoader再加载一次。
- **提高安全性**：Java核心API中定义类型不会被随意替换。假设通过网络传递一个名为java.lang.Integer的类，通过双亲委托模式传递到启动类加载器，而启动类加载器在核心Java API发现这个名字的类，发现该类已被加载，并不会重新加载网络传递的过来的java.lang.Integer，而直接返回已加载过的Integer.class，这样便可以防止核心API库被随意篡改。




## 案例分析

```java
public class Demo {
    public static void main(String[] args) {

        System.out.println(String.class.getClassLoader());
        //null

        System.out.println(sun.awt.HKSCS.class.getClassLoader());
        //null

        System.out.println(sun.net.spi.nameservice.dns.DNSNameService.class.getClassLoader());
        //sun.misc.Launcher$ExtClassLoader@677327b6

        System.out.println(Person.class.getClassLoader());
        //sun.misc.Launcher$AppClassLoader@18b4aac2

        System.out.println(Class.class.getClassLoader());
        //null

        System.out.println(sun.net.spi.nameservice.dns.DNSNameService.class.getClassLoader().getClass().getClassLoader());
        //null

        System.out.println(Person.class.getClassLoader().getClass().getClassLoader());
        //null

        System.out.println(Person.class.getClassLoader().getParent());
        //sun.misc.Launcher$ExtClassLoader@677327b6
    }
}
```

1. `String.class.getClassLoader()`和`sun.awt.HKSCS.class.getClassLoader()`返回null，这是因为Bootstrap ClassLoader是C++实现的核心库，在Java中没有对应类，只能返回null。
2. `sun.net.spi.nameservice.dns.DNSNameService.class.getClassLoader()`表示这个类位于扩展库中。
3. `Person.class.getClassLoader()`表示这个类是开发人员编写的。
4. `Class.class.getClassLoader()`和`sun.net.spi.nameservice.dns.DNSNameService.class.getClassLoader().getClass().getClassLoader()`以及`Person.class.getClassLoader().getClass().getClassLoader()`返回null，这是因为Class类位于rt包下，由是Bootstrap ClassLoader加载。
5. `Person.class.getClassLoader().getParent()`返回Ext ClassLoader，通过`getParent()`获取它的父ClassLoader。




## 自定义ClassLoader

```java
package com.example.lib_java;

public class Hello {
    public void say() {
        System.out.println("hello");
    }
}
```

```java
//自定义ClassLoader
class MyClassLoader extends ClassLoader {

    //重写findClass方法
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        File f = new File("class文件全路径", name.replaceAll("\\.", "/").concat(".class"));
        try {
            FileInputStream fis = new FileInputStream(f);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int b = 0;
            while ((b = fis.read()) != 0) {
                baos.write(b);
            }
            byte[] bytes = baos.toByteArray();
            baos.close();
            fis.close();
            return defineClass(name, bytes, 0, bytes.length);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return super.findClass(name);
    }
}
```

```java
public class Demo {
    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        MyClassLoader classLoader = new MyClassLoader();
        Class<?> clz = classLoader.loadClass("com.example.lib_java.Hello");
        Hello h = (Hello) clz.newInstance();
        h.say();
        System.out.println(classLoader); 
        System.out.println(classLoader.getClass().getClassLoader()); 
        System.out.println(classLoader.getParent()); 
    }
}

//hello
//com.example.lib_java.MyClassLoader@4554617c
//sun.misc.Launcher$AppClassLoader@18b4aac2
//sun.misc.Launcher$AppClassLoader@18b4aac2
```