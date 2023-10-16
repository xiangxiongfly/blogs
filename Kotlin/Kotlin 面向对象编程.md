[TOC]

# Kotlin 面向对象编程

## 修饰符

**类属性修饰符**

| 类属性修饰符 | 说明                 |
| ------------ | -------------------- |
| abstract     | 抽象类               |
| final        | 类不可继承，默认属性 |
| enum         | 枚举类               |
| open         | 类可继承             |
| annotation   | 注解类               |

**访问权限修饰符**

| 访问权限修饰符 | 说明               |
| -------------- | ------------------ |
| private        | 同一文件中可见     |
| protected      | 同一文件或子类可见 |
| public         | 任何地方可见       |
| internal       | 同一模块可见       |

**限制修饰符**

- open：Kotlin中的类和方法默认是不可被继承和重写，`open`修饰表示这个类或方法可以被继承或重写。



## 类和对象

**Kotlin中的构造函数可分为：主构造函数和次构造函数**

一个类只能有一个主构造函数，但可以有多个次构造函数。

### 主构造函数

- 主构造函数属于类头的一部分，需要紧跟类名后。
- 初始化代码可以放在`init`代码块中，`init`代码块在主构造函数之后，次构造函数之前执行。
- 主构造函数中声明了`var/val`的变量会自动成为类的属性。
- 如果主构造函数存在注解或可见性修饰符，需要加`constructor`关键字

```kotlin
class Person(var name: String, var age: Int)

//等价于
class Person(name: String, age: Int) {
    var name: String = ""
    var age: Int = 0

    init {
        this.name = name
        this.age = age
    }
}
```

等价于Java代码

```java
class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```



### 次构造函数

- 如果一个类存在主构造函数，每个次构造函数需要直接或间接委托给它

```java
class Person(var name: String, var age: Int, var score: Int) {

    constructor(name: String, age: Int) : this(name, age, 0) {
    }

    constructor() : this("", 0) {
    }
}
```



### getter/setter

```kotlin
class Person(var name: String, var age: Int) {

    // 是否成年
    val isAdult
    	get() = age >= 18

    // 成绩
    var score = 0
        get() = field
        set(value) {
            if (value < 0) {
                field = 0
            } else if (value > 100) {
                field = 100
            } else {
                field = value
            }
        }
}
```



## 数据解构

- 解构对象：按属性顺序赋值
- 解构数组：最多只能只能赋值5个变量

```kotlin
data class User(val name: String, val age: Int)
```

```kotlin
val user = User("abc", 18)
val (name, age) = user
println(name) //abc
println(age) //18
```

```kotlin
val user = arrayOf("小明", 18, "北京市")
val (username, age, address) = user
println("姓名：$username 年龄：$age 地址：$address") //姓名：小明 年龄：18 地址：北京市
```



## 继承

- 在Java中使用 `extends` 表示继承，在Kotlin中使用 `:` 表示继承。
- Java中使用 `@Overrid` 注解表示重写，在Kotlin中使用 `overrid` 关键字。
- 使用`open`关键字的类，表示可以被继承；使用`open`关键字的方法，表示可以被重写。
- Java的继承是默认开放的，Kotlin的继承是默认封闭的。

```kotlin
open class Animal {
    open fun eat() {
        println("吃")
    }
}

class Dog : Animal() {
    override fun eat() {
        println("吃骨头")
    }
}
```



## 接口

- Kotlin中的接口与Java类似，都是使用 `interface` 关键字。
- 虽然在 Java 1.8 版本当中，接口引入了方法默认实现，但由于 Kotlin 是完全兼容 Java 1.6 版本的。因此为了实现这个特性，Kotlin 编译器在背后做了一些转换。

```kotlin
interface IAnimal {
    var name: String
    fun eat()
    fun run()

    fun sleep() {
        println("sleep")
    }
}

class Dog(override var name: String) : IAnimal {
    override fun eat() {
        println("吃骨头")
    }

    override fun run() {
        println("奔跑")
    }

    override fun sleep() {
        println("睡觉")
    }
}
```

```kotlin
val dog = Dog("旺财")
println(dog.name)
dog.eat()
dog.run()
dog.sleep()
```

**IAnimal接口翻译为Java代码**

```java
public interface IAnimal {
    @NotNull
    String getName();

    void setName(@NotNull String var1);

    void eat();

    void run();

    void sleep();

    public static final class DefaultImpls {
        public static void sleep(@NotNull IAnimal $this) {
            String var1 = "sleep";
            boolean var2 = false;
            System.out.println(var1);
        }
    }
}
```



## 抽象类

Kotlin里的抽象类与Java的抽象类类似。

```kotlin
abstract class AbsAnimal {
    abstract fun eat()
    abstract fun run()
    abstract fun sleep()
}

class Dog(val name: String) : AbsAnimal() {
    override fun eat() {
        println("$name 吃骨头")
    }

    override fun run() {
        println("$name 奔跑")
    }

    override fun sleep() {
        println("$name 睡觉")
    }
}
```



## 单例类

需要使用`object`关键字

```kotlin
object Config {
    var host: String = "127.0.0.1"
    var port: String = "28"

    fun connect() {
        println("这是一个单例类")
    }
}

Config.host
Config.port
Config.connect()
```

等价于Java代码

```java
public final class Config {
    @NotNull
    private static String host;
    @NotNull
    private static String port;
    @NotNull
    public static final Config INSTANCE;

    private Config() {
    }

    static {
        Config var0 = new Config();
        INSTANCE = var0;
        host = "127.0.0.1";
        port = "28";
    }

    @NotNull
    public final String getHost() {
        return host;
    }

    public final void setHost(@NotNull String var1) {
        Intrinsics.checkNotNullParameter(var1, "<set-?>");
        host = var1;
    }

    @NotNull
    public final String getPort() {
        return port;
    }

    public final void setPort(@NotNull String var1) {
        Intrinsics.checkNotNullParameter(var1, "<set-?>");
        port = var1;
    }

    public final void connect() {
        String var1 = "这是一个单例类";
        boolean var2 = false;
        System.out.println(var1);
    }
}
```



## 数据类

- 数据类指用于保存数据的类，在类的前面加 `data` 关键字。
- 数据类会自动生成`getter`/`setter`/`equals`/`hashCode`/`toString`/`copy`方法。

```kotlin
data class Person(var name: String, var age: Int)
```

**等价于Java代码：**

```java
public final class Person {
    @NotNull
    private String name;
    private int age;

    @NotNull
    public final String getName() {
        return this.name;
    }

    public final void setName(@NotNull String var1) {
        Intrinsics.checkNotNullParameter(var1, "<set-?>");
        this.name = var1;
    }

    public final int getAge() {
        return this.age;
    }

    public final void setAge(int var1) {
        this.age = var1;
    }

    public Person(@NotNull String name, int age) {
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
    public final Person copy(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        return new Person(name, age);
    }

    // $FF: synthetic method
    public static Person copy$default(Person var0, String var1, int var2, int var3, Object var4) {
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
        return "Person(name=" + this.name + ", age=" + this.age + ")";
    }

    public int hashCode() {
        String var10000 = this.name;
        return (var10000 != null ? var10000.hashCode() : 0) * 31 + Integer.hashCode(this.age);
    }

    public boolean equals(@Nullable Object var1) {
        if (this != var1) {
            if (var1 instanceof Person) {
                Person var2 = (Person)var1;
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



## 嵌套类

- Java中的嵌套类分2种：非静态内部类、静态内部类。
- Kotlin中的嵌套类相当于Java中静态内部类。
- 嵌套类不能访问外部类的属性和方法。

```kotlin
class Outer {
    fun eat() {
        println("在外面吃饭")
    }

    class Inner {
        fun eat() {
            println("在里面吃饭")
        }

        fun test() {
            this.eat()
        }
    }
}

val i = Outer.Inner()
i.test()
```



## 内部类和this

- 在嵌套类前面加上 `inner` 关键字就是内部类。
- Kotlin中的内部类相当于Java中非静态内部类。
- 内部类持有外部类的引用，所以内部类是可以访问外部类的属性和方法。

```kotlin
class Outer {
    fun eat() {
        println("在外面吃饭")
    }

    inner class Inner {
        fun eat() {
            println("在里面吃饭")
        }

        fun test() {
            this.eat()
            this@Inner.eat()
            this@Outer.eat() //内部类访问外部类
        }
    }
}

val i = Outer().Inner()
i.test()
```



## 匿名内部类

**Java写法**

```java
List<String> list = Arrays.asList("hello", "world", "C", "Java", null);
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
System.out.println(list); //[null, C, Java, hello, world]
```

**object表达式**

```kotlin
val list = listOf("hello", "world", "C", "Java", null)
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
println(list) //[null, C, Java, hello, world]
```

**Lambda表达式**

```kotlin
val list = listOf("hello", "world", "C", "Java", null)
val comparator = Comparator<String?> { 
    o1, o2 ->
    if (o1 == null) {
        return@Comparator -1
    }
    if (o2 == null) {
        return@Comparator 1
    }
    o1.compareTo(o2)
}
Collections.sort(list, comparator)
println(list) //[null, C, Java, hello, world]
```



## 枚举类

与Java中的枚举基本类似。

```kotlin
//简单枚举
enum class Color {
    RED,
    GREEN,
    BLUE;
}
```
```kotlin
//复杂枚举
enum class Color(val value: String) {
    RED("红色"),
    GREEN("绿色"),
    BLUE("蓝色");
}
```


```kotlin
val color = Color.GREEN

//获取枚举对象
println(color) //GREEN
//获取枚举对象的值
println(color.value) //绿色
//获取枚举对象的索引
println(color.ordinal) //1

//通过枚举名获取枚举对象
val blue = Color.valueOf("BLUE")
println(blue) //BLUE

//遍历枚举
Color.values().forEach {
    println(it)
}
```



## 密封类

密封类是对枚举类的一种补充，使用枚举类或密封类时慎用else分支。

```kotlin
sealed class Result<out R> {
    data class Success<out T>(val data: T, val message: String = "") : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

fun displayUI(result: Result<String>) = when (result) {
    is Result.Success -> showSuccess(result)
    is Result.Error -> showError(result)
    is Result.Loading -> showLoading()
}
```

