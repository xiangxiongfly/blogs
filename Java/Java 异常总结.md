[toc]

# Java 异常总结

## 概述

异常机制值当程序出现错误后，程序的处理方式。

**从程序执行的过程来看编译时异常和运行时异常：**

- 编译时异常：程序在编译时发生的异常（javac 源文件名.java）
- 运行时异常: 程序在运行时发生的异常（java 字节码文件名）



## 异常的结构

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2d0c6566f0a944ceb3418247bf2d2b2c.png)

- Throwable：是 Java 所有错误和异常的父类，其有两个子类 Error 和 Exception
  - Error（错误）：Error通常表示与虚拟机相关的问题，如系统崩溃、虚拟机错误、动态链接失败等。这些错误是无法恢复或捕获的，它们会导致应用程序中断。因此，在编程时，我们一般无法处理Error类型的异常。
  - Exception（异常）：程序可以捕获并且可以处理的异常。其可以分两种：
    - 检查异常（Checked Exceptions）：
      - 继承自 `java.lang.Exception` 类，但不包括 `java.lang.RuntimeException` 及其子类。
      - 编译器会检查此类异常，如果程序中出现此类异常，比如说 IOException，必须对该异常进行处理，要么使用 try-catch捕获，要么使用 throws 语句抛出，否则编译不通过。
      - 如：IOException、ClassNotFoundException、SQLException 。
    - 非检查异常（Unchecked Exceptions）：
      - 继承自 `java.lang.RuntimeException` 类。
      - 这类异常在运行期间可能出现的错误。编译器不会检查此类异常，并且不要求处理异常，一般是由程序逻辑错误引起的，在程序中可以选择捕获处理，也可以不处理。
      - 如：NullPointerException、ArrayIndexOutOfBoundsException、ArithmeticException 。



## 异常处理机制

### try-catch

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
```

### throws

```java
private static void fun2() throws Exception {
    int a = 1;
    int b = 0;
    int c = a / b;
}
```

### throw

```java
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

