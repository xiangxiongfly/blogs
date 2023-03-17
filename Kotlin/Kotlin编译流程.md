[TOC]
# Kotlin编译流程

## Kotlin编译流程

Kotlin代码经过编译器边后，生成Java字节码，这种字节码是专门为JVM设计的，JVM拿到字节码后，会根据特定的语法解析其中的内容，并让字节码运行起来。
Java和Kotlin本质是在用同一种语言进行沟通的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/769db9f9d54e4e02840c5e6840ddc646.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_8,color_FFFFFF,t_70,g_se,x_16)

## 使用AS工具

可以使用AndroidStudio的工具：点击菜单栏 -> Tool -> Kotlin -> Show Kotlin Bytecode，查看生成的Java字节码；

还可以点击顶部的"Decompile"按钮查看翻译后的Java代码。



## Kotlin与Java代码对比

### println

**Kotlin代码**

```kotlin
println("hello world")
```

**翻译为Java代码**

```java
String var0 = "hello world";
System.out.println(var0);
```



### Kotlin类型

**Kotlin代码**

```kotlin
val a: Long = 1L
val b: Long? = 2L

var c: Long = 3L
var d: Long? = 4L

val e: Long? = null
var f: Long? = null

var g: Long? = 5L
g = null

var h: Long? = null
h = 6L
```

**翻译为Java代码**

```java
long a = 1L;
long b = 2L;

long c = 3L;
long d = 4L;

Long e = (Long)null;
Long f = (Long)null;

Long g = 5L;
g = (Long)null;

Long h = (Long)null;
h = 6L;
```

说明：变量a、b、c、d被Kotlin转换为Java的原始类型long，而e、f、g、h则被转换为包装类型Long。

转换规则：如果变量可能为空，则被转换为Java的包装类型；如果变量不可能为空，则被转换为Java的原始类型。



### 类型推导

**Kotlin代码**

```kotlin
val a = 100L
val b = "hello"
```

**翻译为Java代码**

```java
long a = 100L;
String b = "hello";
```

说明：在写Kotlin代码的时候省略的类型，最终会被编译器补充回来。



### 字符串模板

**Kotlin代码**

```kotlin
val a = """
        姓名：$name
        年龄：$age
    """
```

**翻译为Java代码**

```java
String a = "\n        姓名：" + name + "\n        年龄：" + age + "\n    ";
```

说明：编译器最终会将它们转换程Java字符串拼接的形式。



### when表达式

**Kotlin代码**

```kotlin
fun foo(a: Any) {
    when (a) {
        is Int -> println("Int")
        is Boolean -> println("Boolean")
        is String -> println("String")
        else -> println("unknown")
    }
}

fun foo2(a: String) {
    when (a) {
        "AAA" -> println("A")
        "BBB" -> println("B")
        "CCC" -> println("C")
        else -> println("else")
    }
}
```

**翻译为Java代码**

```java
public static final void foo(@NotNull Object a) {
    Intrinsics.checkNotNullParameter(a, "a");
    String var2;
    if (a instanceof Integer) {
        var2 = "Int";
        System.out.println(var2);
    } else if (a instanceof Boolean) {
        var2 = "Boolean";
        System.out.println(var2);
    } else if (a instanceof String) {
        var2 = "String";
        System.out.println(var2);
    } else {
        var2 = "unknown";
        System.out.println(var2);
    }
}

public static final void foo2(@NotNull String a) {
    String var2;
    switch(a.hashCode()) {
        case 64545:
            if (a.equals("AAA")) {
                var2 = "A";
                System.out.println(var2);
                return;
            }
            break;
        case 65538:
            if (a.equals("BBB")) {
                var2 = "B";
                System.out.println(var2);
                return;
            }
            break;
        case 66531:
            if (a.equals("CCC")) {
                var2 = "C";
                System.out.println(var2);
                return;
            }
    }
    var2 = "else";
    System.out.println(var2);
}
```

说明：编译器最终会将它们转换为类似switch-case和if-else形式。

Java的`switch-case`支持'char, byte, short, int, Character, Byte, Short, Integer, String, or an enum'，其中String是Java 1.7及以后才支持的，而Kotlin是完全兼容Java 1.6的。



### 类

**Kotlin代码**

```kotlin
open class Base {
    var country = "中国"
}

class Person(val name: String, val age: Int) : Base() {

}
```

**翻译为Java代码**

```java
public class Base {
    @NotNull
    private String country = "中国";

    @NotNull
    public final String getCountry() {
        return this.country;
    }

    public final void setCountry(@NotNull String var1) {
        this.country = var1;
    }
}

public final class Person extends Base {
    @NotNull
    private final String name;
    private final int age;

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final int getAge() {
        return this.age;
    }

    public Person(@NotNull String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }
}
```

说明：

- var变量会被编译器转换为`get/set`方法，val变量会被编译器转换为`get`方法。
- 省略的public最终会被编译器补充。



### 抽象类

```kotlin
abstract class AbsBase {
    abstract val isAult: Boolean

    abstract fun say()

    fun run() {}
}

class Chinese(val name: String, val age: Int) : AbsBase() {
    override val isAult: Boolean
	    get() = age >= 18

    override fun say() {
        println("hello world")
    }
}
```

**翻译为Java代码**

```java
public abstract class AbsBase {
    public abstract boolean isAult();

    public abstract void say();

    public final void run() {
    }
}

public final class Chinese extends AbsBase {
    @NotNull
    private final String name;
    private final int age;

    public Chinese(@NotNull String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    public boolean isAult() {
        return this.age >= 18;
    }

    public void say() {
        String var1 = "hello world";
        System.out.println(var1);
    }

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final int getAge() {
        return this.age;
    }   
}
```

说明：

- `isAult`属性被编译器转换为抽象方法。



### 接口

**Kotlin代码**

```kotlin
interface IBase {
    val isForeign: Boolean

    fun say()

    fun eat() {
        println("吃饭")
    }
}

class Chinese(val name: String, var age: Int) : IBase {
    val isAdult
    	get() = age >= 18

    override val isForeign: Boolean = false

    override fun say() {
        println("说中文")
    }

    override fun eat() {
        super.eat()
        println("吃中餐")
    }
}
```

**翻译为Java代码**

```java
public interface IBase {
    boolean isForeign();

    void say();

    void eat();

    public static final class DefaultImpls {
        public static void eat(@NotNull IBase $this) {
            String var1 = "吃饭";
            System.out.println(var1);
        }
    }
}

public final class Chinese implements IBase {
   private final boolean isForeign;
   @NotNull
   private final String name;
   private int age;

   public final boolean isAdult() {
      return this.age >= 18;
   }

   public boolean isForeign() {
      return this.isForeign;
   }

   public void say() {
      String var1 = "说中文";
      System.out.println(var1);
   }

   public void eat() {
      IBase.DefaultImpls.eat(this);
      String var1 = "吃中餐";
      System.out.println(var1);
   }

   @NotNull
   public final String getName() {
      return this.name;
   }

   public final int getAge() {
      return this.age;
   }

   public final void setAge(int var1) {
      this.age = var1;
   }

   public Chinese(@NotNull String name, int age) {
      super();
      this.name = name;
      this.age = age;
   }
}
```

说明：

- Kotlin中的接口方法实现被编译器转换为静态内部类，虽然Java 1.8支持了接口方法实现，但是Kotlin是基于Java 1.6设计的，所以通过静态内部类实现。
- 接口中的`isForeign`属性会被编译器转换为抽象方法。
- 实现类中的`isAdult`属性会被编译器转化为get方法。



### 数据类

#### 不设置默认值

**Kotlin代码**

```kotlin
data class Student(val name: String, val age: Int)
```

**翻译为Java代码**

```java
public final class Student {
    @NotNull
    private final String name;
    private final int age;

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final int getAge() {
        return this.age;
    }

    public Student(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        super();
        this.name = name;
        this.age = age;
    }

    @NotNull
    public final String component1() {
        return this.name;
    }

    public final int component2() {
        return this.age;
    }

    @NotNull
    public final Student copy(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        return new Student(name, age);
    }

    // $FF: synthetic method
    public static Student copy$default(Student var0, String var1, int var2, int var3, Object var4) {
        if ((var3 & 1) != 0) {
            var1 = var0.name;
        }

        if ((var3 & 2) != 0) {
            var2 = var0.age;
        }

        return var0.copy(var1, var2);
    }

    @NotNull
    public String toString() {
        return "Student(name=" + this.name + ", age=" + this.age + ")";
    }

    public int hashCode() {
        String var10000 = this.name;
        return (var10000 != null ? var10000.hashCode() : 0) * 31 + Integer.hashCode(this.age);
    }

    public boolean equals(@Nullable Object var1) {
        if (this != var1) {
            if (var1 instanceof Student) {
                Student var2 = (Student)var1;
                if (Intrinsics.areEqual(this.name, var2.name) && this.age == var2.age) {
                    return true;
                }
            }

            return false;
        } else {
            return true;
        }
    }
}
```

#### 全设置默认值

**Kotlin代码**

```kotlin
data class Student(val name: String = "小明", val age: Int = 18)
```

**翻译为Java代码**

```java

public final class Student {
    @NotNull
    private final String name;
    private final int age;

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final int getAge() {
        return this.age;
    }

    public Student(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        super();
        this.name = name;
        this.age = age;
    }

    // $FF: synthetic method
    public Student(String var1, int var2, int var3, DefaultConstructorMarker var4) {
        if ((var3 & 1) != 0) {
            var1 = "小明";
        }

        if ((var3 & 2) != 0) {
            var2 = 18;
        }

        this(var1, var2);
    }

    public Student() {
        this((String)null, 0, 3, (DefaultConstructorMarker)null);
    }

    @NotNull
    public final String component1() {
        return this.name;
    }

    public final int component2() {
        return this.age;
    }

    @NotNull
    public final Student copy(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        return new Student(name, age);
    }

    // $FF: synthetic method
    public static Student copy$default(Student var0, String var1, int var2, int var3, Object var4) {
        if ((var3 & 1) != 0) {
            var1 = var0.name;
        }

        if ((var3 & 2) != 0) {
            var2 = var0.age;
        }

        return var0.copy(var1, var2);
    }

    @NotNull
    public String toString() {
        return "Student(name=" + this.name + ", age=" + this.age + ")";
    }

    public int hashCode() {
        String var10000 = this.name;
        return (var10000 != null ? var10000.hashCode() : 0) * 31 + Integer.hashCode(this.age);
    }

    public boolean equals(@Nullable Object var1) {
        if (this != var1) {
            if (var1 instanceof Student) {
                Student var2 = (Student)var1;
                if (Intrinsics.areEqual(this.name, var2.name) && this.age == var2.age) {
                    return true;
                }
            }

            return false;
        } else {
            return true;
        }
    }
}
```

#### 总结

-   Kotlin中的数据类会自动生成`copy()`、`toString()`、`hashCode()`、`equals()`方法。
-   数据类的属性如果不设置默认值，则不会生成无参构造函数，如Person类，只会生成2个参数的构造函数。
-   数据类的属性如果全设置默认值，会生成无参构造函数，如Person类，会生成无参构造函数和2个参数的构造函数。



### @JvmOverloads

**Kotlin代码**

```kotlin
class Person {
    @JvmOverloads
    fun printInfo(name: String = "小明", age: Int = 18) {

    }
}
```

**翻译为Java代码**

```java
public final class Person {
    @JvmOverloads
    public final void printInfo(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
    }  

    @JvmOverloads
    public final void printInfo(@NotNull String name) {
        printInfo$default(this, name, 0, 2, (Object)null);
    }

    @JvmOverloads
    public final void printInfo() {
        printInfo$default(this, (String)null, 0, 3, (Object)null);
    }
}
```

说明：使用`@JvmOverloads`后，会自动生成3个构造函数。

