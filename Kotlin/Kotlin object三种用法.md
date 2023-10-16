[TOC]

# Kotlin object的三种用法

## 概述

在Kotlin中，fun关键字表示定义函数，class关键字表示定义类，interface关键字表示定义接口，但是object关键字却可以定义三种类型：

- 匿名内部类
- 单例模式
- 伴生对象

其实这三种用法本质都是定义一个类的同时还创建对象。



## 匿名内部类

- 在Kotlin中定义匿名内部类需要使用object关键字。
- Kotlin中可以在继承一个抽象类时，同时可以实现多个接口i。

**在Java中定义匿名内部类**

```java
Collections.sort(list, new Comparator<String>() {
    @Override
    public int compare(String o1, String o2) {
        if (o1 == null) {
            return -1;
        }
        if (o2 == null) {
            return 1;
        }
        return o1.compareTo(o2);
    }
});
```

**在Kotlin中定义匿名内部类**

```kotlin
Collections.sort(list, object : Comparator<String?> {
    override fun compare(o1: String?, o2: String?): Int {
        if (o1 == null) {
            return -1;
        }
        if (o2 == null) {
            return 1;
        }
        return o1.compareTo(o2)
    }
})
```

**在继承一个类时同时实现多个接口**

```kotlin
interface A {
    fun a()
}

interface B {
    fun b()
}

abstract class Base {
    abstract fun sayHello()
}
```

```kotlin
val obj = object : Base(), A, B {
    override fun a() {

    }

    override fun b() {

    }

    override fun sayHello() {

    }
}
```



## 单例模式

- 在Kotlin中，可以直接用object关键字实现一个单例模式。
- 等价于Java中的静态代码块的单例模式，在JVM成功加载类的时候就创建对象实例。
- 缺点：不支持懒加载，不支持传参。

```kotlin
object DBManager {
    fun getData() {}
}
```

```kotlin
//在Kotlin中调用
DBManager.getData()

//在Java中调用
DBManager.INSTANCE.getData();
```

**翻译为Java代码**

```java
public final class DBManager {
    @NotNull
    public static final DBManager INSTANCE;

    static {
        DBManager var0 = new DBManager();
        INSTANCE = var0;
    }

    private DBManager() {
    }

    public final void getData() {
    }
}
```



### @JvmStatic

```kotlin
object DBManager {
    @JvmStatic
    fun getData() {}
}

//在Java中调用
DBManager.getData();
```

**翻译为Java代码**

```java
public final class DBManager {
    @NotNull
    public static final DBManager INSTANCE;

    static {
        DBManager var0 = new DBManager();
        INSTANCE = var0;
    }

    private DBManager() {
    }

    @JvmStatic
    public static final void getData() {
    }
}
```



## 伴生对象

- 在Kotlin中没有 `static` 关键字，因此没法直接定义静态方法和静态变量。
- Kotlin提供了伴生对象，可以帮助实现静态方法和静态变量。
- 伴生对象中的方法可以使用 `@JvmStatic` 注解。

```kotlin
class UserManager {
    companion object {
        fun getData() {}
    }
}

//在Kotlin中调用
UserManager.getData()

//在Java中调用
UserManager.Companion.getData();
```

**翻译为Java代码**

```java
public final class DBManager {
    @NotNull
    public static final DBManager.Companion Companion = new DBManager.Companion((DefaultConstructorMarker)null);

    public static final class Companion {
        public final void getData() {
        }

        private Companion() {
        }

        public Companion(DefaultConstructorMarker $constructor_marker) {
            this();
        }
    }
}
```



### 工厂模式

统一管理类的创建过程。

```kotlin
// 主构造函数定义为private，防止外部调用
data class Goods private constructor(val name: String) {
    companion object {
        @JvmStatic
        fun create(name: String): Goods {
            return Goods(name)
        }
    }
}

val a = Goods.create("汽车")
println(a)
val b = Goods.create("飞机")
println(b)

//    Goods(name=汽车)
//    Goods(name=飞机)
```


