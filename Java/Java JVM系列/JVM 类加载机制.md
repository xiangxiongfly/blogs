[TOC]

# JVM 类加载机制

## 概述

- 在Java中数据类型分为基本数据类型和引用数据类型。基本数据类型由虚拟机预先定义，引用数据类型则需要进行类的加载。
- Java虚拟机规范中规定，class文件加载到内存，再到类卸载出内存会经历7个阶段，分别是加载、验证、准备、解析、初始化、使用和卸载，其中，验证、准备和解析3个阶段统称为链接(Linking)，整个过程称为类的生命周期。



## 类加载过程

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d588c2efdd1a44dd8c7ffa4f3a9887fe.png)

### 加载

将Java类的class文件加载到内存中，并在内存中构建出Java类的原型。

1. 通过类的全名，获取类的二进制数据流。
2. 解析类的二进制数据流，转为方法区内的数据结构，Java类模型。
3. 创建 java.lang.Class 实例，作为方法区中访问类数据的入口。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9e550e4f00c84e47a38be2ead60b8e60.png)

### 验证

验证是链接操作的第一步。证的目的是保证加载的字节码是符合JVM规范。

会进行4个阶段的检验：

1. 格式验证：主要检查是否以魔数OxCAFEBABE开头，主版本和副版本号是否在当前JVM的支持范围内，数据中每一个项是否都拥有正确的长度等。
2. 语义验证：
   1. 是否所有的类都有父类的存在（Object除外）。
   2. 是否一些被定义为final的方法或者类被重写或继承了。
   3. 非抽象类是否实现了所有抽象方法或者接口方法。
   4. 是否存在不兼容的方法，比如方法的签名除了返回值不同，其他都一样。
3. 字节码验证，判断字节码是否可以被正确地执行：
   1. 在字节码的执行过程中，是否会跳转到一条不存在的指令。
   2. 函数的调用是否传递了正确类型的参数。
   3. 变量的赋值是不是给了正确的数据类型等。
   4. 检查栈映射帧的局部变量表和操作数栈是否有着正确的数据类型。
4. 符号引用验证：查这些类或者方法是否存在，检查当前类是否有权限访问这些数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/11d64baa193c43bbbac33f07ece108e7.png)

### 准备

准备阶段主要负责为类的静态变量分配内存，并将其初始化为默认值。

- static final 修饰的静态常量在编译阶段会赋初始化值，然后在准备阶段会显示赋值。
- 非 final 修饰的静态变量会在准备阶段会赋初始化值，然后在初始化阶段显示赋值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/578e489330694a40946c700b0608fd20.png)

说明：Java并不支持boolean类型，对于boolean类型，内部实现是int，int的默认值是0，对应boolean类型的默认值是false。

### 解析

解析阶段主要负责将class常量池中的类、接口、字段和方法的符号引用转为直接引用。

### 初始化

类的初始化是类装载的最后一个阶段。表示类可以顺利装载到系统中，JVM开始执行Java字节码。

执行流程：

1. 执行 `<clinit>` 方法：`<clinit>` 方法是由编译器自动生成的，包含了类的静态初始化块和静态变量的赋值语句。这个方法会在类被首次使用之前被调用。
2. 初始化静态变量：按照代码中出现的顺序，初始化静态变量。
3. 执行静态块：执行类中定义的静态初始化块，这允许开发者在类加载时执行一些特定的逻辑。

### 使用

任何一个类在使用之前都必须经历过完整的加载、链接和初始化3个步骤。

一旦一个类成功经历这3个步骤之后，开发人员便可以在程序中访问和调用它的静态类成员信息（比如静态字段、静态方法等），或者使用new关键字创建对象实例。

### 卸载

类在使用完成以后，也有可能被卸载掉。

**类、类的加载器、类的Class对象、类的实例之间的引用关系：**

- 类加载器和类的Class对象之间的关系：在类加载器的内部实现中，用一个Java集合来存放所加载类的引用。另外，一个Class对象总是会引用它的类加载器，调用Class对象的getClassLoader()方法，就能获得它的类加载器。由此可见，代表某个类的Class对象与该类的类加载器之间为双向关联关系。
- 类、类的Class对象、类的实例对象之间的关系：一个类的实例总是引用代表这个类的Class对象。Object类中定义了getClass()方法，这个方法返回代表实例所属类的Class对象的引用。此外，所有的Java类都有一个静态属性class，它引用代表这个类的Class对象。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dac851cb606440cb8dbc120e82532e2c.jpeg)

**类的生命周期：**

当类被加载、链接和初始化后，它的生命周期就开始了。当代表类的Class对象不再被引用，即不可触及时，Class对象就会结束生命周期，类在方法区内的数据也会被卸载，从而结束类的生命周期。一个类何时结束生命周期，取决于代表它的Class对象何时结束生命周期。

**类的卸载：**

- 该类所有的实例已经被回收。
- 加载该类的类加载器的实例已经被回收。
- 该类对应的Class对象没有任何对方被引用。



## 类加载器

类加载器从文件系统或者网络中加载class文件到JVM内部，至于class文件是否可以运行，则由执行引擎决定，类加载器将加载的类信息存放到方法区。类加载器在整个装载阶段，只能影响到类的加载，而无法改变类的链接和初始化行为。

### 类加载的分类

类的加载分为显式加载和隐式加载两种类型：

- 显式加载：指在代码中通过类加载器的方法加载 class 对象，如 `Class.forName(name) ` 或`this.getClass().getClassLoader().loadClass()`。
- 隐式加载：不直接在代码中调用类加载器的方法加载 class 文件，而是通过 JVM 自动加载到内存中，如在加载某个类的 class 文件时，该类的 class 文件中引用了另外一个类的对象，此时额外引用的类将通过 JVM 自动加载到内存中。

在日常开发中以上两种方式一般会混合使用。

### 类加载器分类

![在这里插入图片描述](https://img-blog.csdnimg.cn/154bf77eadc94179bcfaf03cbb5438a8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_9,color_FFFFFF,t_70,g_se,x_16)

- 启动类加载器（Bootstrap ClassLoader）：由C++实现，嵌套在虚拟机内部。默认加载jdk\lib下的核心类，这个路径可以使用 -Xbootclasspath参数指定。
- 扩展类加载器（Extension ClassLoader）：由Java语言编写。默认加载jdk\lib\ext\目录下扩展类，这个路径可以使用 java.ext.dirs系统变量来更改。
- 应用类加载器（App ClassLoader）：由Java语言编写。负责加载开发人员编写的类，负责加载环境变量classpath或系统属性。该类加载器是程序中默认的类加载器，通常Java应用的类都是由它来完成加载到。可以通过`ClassLoader#getSystemClassLoader()`方法获取该类加载器。
- 用户自定义类加载器（Custom ClassLoader）：用户自定义ClassLoader。

JVM支持两种类型的类加载器，分别是：启动类加载器（Bootstrap ClassLoader）和自定义类加载器（User-Defined ClassLoader）。Java虚拟机规范中将所有派生于抽象类ClassLoader的类加载器都划分为自定义类加载器。

各类加载器之间的关系是包含关系。不是上下层，也不是父子继承关系。

### Class.forName() 和 ClassLoader.loadClass()

- Class.forName() 是一个静态方法，最常用的是Class.forName(String className);根据传入的类的全限定名返回一个Class对象。该方法在将class文件加载到内存的同时会执行类的初始化［即调用〈clinit〉()方法］，如Class.forName("com.atguigu.java.HelloWorld")。
- ClassLoader.loadClass() 是一个实例方法，需要一个ClassLoader对象来调用该方法。该方法将class文件加载到内存时不会执行类的初始化，直到这个类第一次使用时才进行初始化。该方法因为需要得到一个ClassLoader对象，所以可以根据需要指定使用哪个类加载器，使用格式为“ClassLoader cl=.......;cl.loadClass(“com.atguigu.java.HelloWorld”);”。



## 双亲委派机制

### 定义

类加载器用来把类文件加载到JVM内存中。从JDK1.2版本开始，类的加载过程采用双亲委派模型。

如果一个类加载器在接到加载类的请求时，它首先不会自己尝试去加载这个类，而是把这个请求任务委托给父类加载器去完成，依次递归，如果父类加载器可以完成类加载任务，就成功返回。只有父类加载器无法完成此加载任务时，才自己去加载。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/da3c2d2f44374f4f9bb9fe1f30c8f6ee.png)

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