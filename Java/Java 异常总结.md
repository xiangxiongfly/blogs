[toc]

# 异常总结

## 概述

- 异常机制值当程序出现错误后，程序的处理方式。

- 程序错误分三种：

  1. 编译错误：指程序没有遵循语法规则
  2. 运行错误：程序执行时，运行环境出现异常问题
  3. 逻辑错误：代码逻辑存在问题

  

## 异常结构

在Java中，所有的异常都有一个共同的祖先`Throwable`类，`Throwable`有两个重要的子类：`Exception`类和`Error`类。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e100f810a0c24f918d3b60d2ab087ba2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



### Error  错误

Error是指正常情况下，不大可能出现的情况，绝大多数`Error`都会导致程序处理非正常、不可恢复状态。因为是非正常情况，所以不方便也不需要捕获，如`OutOfMemoryError`之类等，都是`Error`的子类。

### Exception 异常

Exception是程序正常运行中，可以预料的意外情况，可以嗯那个并且应该被捕获，进行相应处理。

Exception异常分两大类：运行时异常和非运行时异常。



## 异常分类

![在这里插入图片描述](https://img-blog.csdnimg.cn/f87395d706ca409bb2d364fed8894410.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)

### 检查异常

检查异常，是在源码阶段必须显式地进行捕获处理，是编译器检查的一部分。之前的Error是属于Throwable而不是Exception。

### 非检查异常

非检查异常，指所谓的运行时异常，如`NullPointerException`、`ArrayIndexOutOfBoundsException`等，通常是可以避免的逻辑错误，具体根据需要判断是否需要捕获，不在编译器强制要求。



## 异常处理机制

```java
private static void fun1() {
    try {
        //异常代码块
        int a = 1;
        int b = 0;
        int c = a / b;
    } catch (Exception e) {
        //在catch中捕获
        e.printStackTrace();
    }
}

//方法抛出异常
private static void fun2() throws Exception {
    int a = 1;
    int b = 0;
    int c = a / b;
}

private static void fun3() {
    int a = 1;
    int b = 0;
    if (b == 0) {
        //主动抛出异常
        throw new ArithmeticException("不能为0");
    }
}
```



## try-catch-finally

- try块中放置的是可能出现异常的代码
- catch块中放置的是可能的异常
- finally块中放置的是一定会执行的代码

```java
PrintWriter output = null;
try {
    output = new PrintWriter("text.txt");
    output.println("hello 异常");
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (output != null)
        output.close();
}
```



## try-with-resource

在JDK7之前需要手动关闭资源，在JDK7及之后实现了`java.lang.AutoCloseable`接口，try-catch会自动调用`close()`关闭资源。

```java
try (PrintWriter output = new PrintWriter("text.txt")) {
    output.println("hello 异常了");
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```





## 自定义异常类

Java提供类许多异常类，尽量使用它们而不是创建自己的异常类。

如果需要自定义异常类，可以通过继承Exception以及子类创建。

```java
class InvalidAgeException extends Exception {
    private int age;

    public InvalidAgeException(int age) {
        super("年龄错误:" + age);
        this.age = age;
    }

    public int getAge() {
        return age;
    }
}
```

```java
int age = -1;
if (age < 0) {
    throw new InvalidAgeException(age);
}
```