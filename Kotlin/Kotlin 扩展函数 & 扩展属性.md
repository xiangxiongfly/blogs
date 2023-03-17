[TOC]

# Kotlin 扩展函数 & 扩展属性

## 概述

- Kotlin的扩展是给类增加新的功能。
- 从语法角度可分为两种：扩展函数、扩展属性。
- 从作用域角度可分为：顶层扩展和类内扩张。

**扩展的作用：**在Kotlin中，几乎所有的类都可以被扩展，包括：普通类、单例类、密封类、枚举类、伴生对象以及第三方提供的Java类。但匿名内部类不存在名称所以不能被扩展。扩展主要用途之一是替代Java中的各种工具类。



## 顶层扩展

### 扩展函数

扩展函数是指从类的外部扩展出一个函数，这个函数看起来像类的成员方法一样。

顶层扩展的本质就是类似于Java中的工具类+静态方法

- 定义扩展函数需要使用`fun`关键字。
- 接收者：如`String.`就是接收者，指扩展函数的接收方，代表这个扩展函数属于这个类的。
- 扩展函数中的方法体是可以省略`this`。

```kotlin
fun String.lastElement(): Char? {
    if (this.isEmpty()) {
        return null
    }
    return this[length - 1]
}
```

```kotlin
fun main() {
    val msg = "hello world"
    val last = msg.lastElement()
    println(last)
}

//d
```

**转换为Java代码**

```java
public final class ExtKt {
    @Nullable
    public static final Character lastElement(@NotNull String $this$lastElement) {
        CharSequence var1 = (CharSequence)$this$lastElement;
        return var1.length() == 0 ? null : $this$lastElement.charAt($this$lastElement.length() - 1);
    }
}
```

```java
public static final void main() {
    String msg = "hello world";
    Character last = ExtKt.lastElement(msg);
    System.out.println(last);
}
```

说明：

- String类型的扩展函数`lastElement()`被编译器转换为静态方法，同时多了一个String类型的参数。
- 调用`msg.lastElement()`的地方被编译器转换为静态方法的调用`ExtKt.lastElement(msg)`。



### 扩展属性

扩展属性指在类的外部定义一个新的成员属性。

```kotlin
val String.lastElement
    get():Char? {
        if (isEmpty()) {
            return null
        } else {
            return get(length - 1)
        }
    }
```

```kotlin
fun main() {
    val msg = "hello world"
    val last = msg.lastElement
    println(last)
}

//d
```

**转换为Java代码**

```kotlin
public final class ExtKt {
    @Nullable
    public static final Character getLastElement(@NotNull String $this$lastElement) {
        CharSequence var1 = (CharSequence)$this$lastElement;
        return var1.length() == 0 ? null : $this$lastElement.charAt($this$lastElement.length() - 1);
    }
}
```

```java
public static final void main() {
    String msg = "hello world";
    Character last = ExtKt.getLastElement(msg);
    System.out.println(last);
}
```

说明：

- 扩展属性被编译器转换为静态方法。



## 类内扩展

类内的扩展，外面是无法访问的，只能被类内的成员访问。

```kotlin
class Person {
    var name: String = ""
    var age: Int = 0
}

class Helper {
    val Person.isAult: Boolean
	    get() = age >= 18

    fun Person.sayHello() {
        println("say hello")
    }

    fun test() {
        val person = Person()
        println(person.isAult)
        person.sayHello()
    }
}
```

```kotlin
fun main() {
    val person = Person()
    //    person.isAult //编译器报错
    //    Person.sayHello() //编译报错

    val helper=Helper()
    helper.test()
}
```



**转换为Java代码**

```java
public final class Person {
    @NotNull
    private String name = "";
    private int age;

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final void setName(@NotNull String var1) {
        this.name = var1;
    }

    public final int getAge() {
        return this.age;
    }

    public final void setAge(int var1) {
        this.age = var1;
    }
}


public final class Helper {
    public final boolean isAult(@NotNull Person $this$isAult) {
        return $this$isAult.getAge() >= 18;
    }

    public final void sayHello(@NotNull Person $this$sayHello) {
        String var2 = "say hello";
        System.out.println(var2);
    }

    public final void test() {
        Person person = new Person();
        boolean var2 = this.isAult(person);
        System.out.println(var2);
        this.sayHello(person);
    }
}
```

说明：

类内扩展方法和属性会被Kotlin编译器转换为类的成员方法，不属于类的成员，所以外界不能访问。



## 扩展的局限性

- Kotlin的扩展的不是真正的类成员，因此它无法被子类重写。
- 扩展属性不能存储数据，其本质是静态方法。
- 扩展可以访问同文件下的属性和方法，其他文件则不行；不能访问接收者类型的非private、protected成员。根本原因仍是类+静态方法的形式。



## 优先级问题

| 情况                       | 优先级       |
| -------------------------- | ------------ |
| 成员方法与扩展函数         | 成员方法     |
| 子类成员方法与父类扩展函数 | 子类成员方法 |
| 子类扩展函数与父类成员方法 | 父类成员方法 |



## 优化封装SP

```kotlin
fun SharedPreferences.edit(commit: Boolean = false, action: SharedPreferences.Editor.() -> Unit) {
    val editor = edit()
    action(editor)
    if (commit) {
        editor.commit()
    } else {
        editor.apply()
    }
}
```

```kotlin
private val preference: SharedPreferences by lazy {
    getSharedPreferences("APP", Context.MODE_PRIVATE)
}

//调用
preference.edit {
    putString("name", "Tom")
}
```