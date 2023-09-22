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

`finalize()` 方法是Object类的一个方法，它会在垃圾收集器准备回收对象所占内存之前被调用。

**缺点：**

- 不可预测性：finalize()方法的调用时机是由垃圾收集器决定的，而垃圾收集器的行为是不可预测的。
- 不可靠性：在JVM退出时，不保证会调用尚未执行的finalize()方法。因此，你不能依赖finalize()方法来做清理资源等操作。
- 性能开销：finalize()方法的执行会给垃圾收集器带来额外的性能开销。如果一个对象有finalize()方法，垃圾收集器在回收这个对象之前，需要先调用这个方法，这会延迟对象的回收。
- 可能导致对象复活：在finalize()方法中，如果将当前对象赋给任何类变量或者对象的成员变量，那么这个对象就会复活，也就是说，它再次变得可达。

由于以上的缺点，从Java 9开始，finalize()方法已经被标记为deprecated（不推荐使用）。对于需要清理的资源，推荐使用try-with-resources语句或者显式的关闭方法（如close()方法）。

