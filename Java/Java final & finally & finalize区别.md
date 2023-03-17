[TOC]

# Java final & finally & finalize区别

 ## final

final可以用来修饰类、方法、变量：

- 修饰类，表示类不能被继承扩展；
- 修饰方法，表示方法不能被重写；
- 修饰变量，表示变量不可变。如果是原始数据类型，值不能被修改；引用数据类型，引用不能被修改。

推荐使用final关键字来明确代码的语义、逻辑意图。final也许会有性能的好处，利用final可能有助于JVM将方法进行内联，可以改善编译器进行条件编译的能力等。



### 匿名内部类

```java
public class Demo {
    public static void main(String[] args) {
        final int x = 100;
        new Inner() {
            @Override
            public void run() {
                System.out.println(x);
            }
        }.run();
    }
}

interface Inner {
    void run();
}
```

匿名内部类访问局部变量时，局部变量需要用final修饰，这是因为内部类会实际拷贝一份，而不是直接使用局部变量，可以防止出现数据一致性问题。



## finally

finally是保证Java代码一定要被执行的一种机制。可以使用`try-finally`或`try-catch-finally`进行关闭资源等操作。

**以下是例外**

```java
try {
    System.exit(1);
} finally {
    System.out.println("end");
}
```



## finalize

finalize是基础类`java.lang.Object`的一个方法，它的设计目的是保证对象在被垃圾收集前完成特定资源等回收。

finalize机制限制已经不推荐使用，并且在JDK 9开始被标记为丢弃。简单说，你无法保证finalize什么时候执行，执行是否符合预期。



