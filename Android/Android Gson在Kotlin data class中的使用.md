[TOC]

# Android Gson在Kotlin data class中的使用

## 基本使用

```kotlin
data class UserBean(val name: String, val age: Int)

val json = """
        {
            "name":"小明",
            "age":18
        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json, UserBean::class.java)
    println("姓名：${userBean.name} 年龄：${userBean.age}")
}

//姓名：小明 年龄：18
```



## NEP 空指针异常问题

```kotlin
val json2 = """
        {
            "name":null,
            "age":null
        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json2, UserBean::class.java)
    println(userBean)
    printMsg(userBean.name)
}

fun printMsg(msg: String) {
}

//UserBean(name=null, age=0)
//Exception in thread "main" java.lang.NullPointerException: Parameter specified as non-null is null: method com.example.lib_java.test.GsonTestKt.printMsg, parameter msg
```



### 空指针异常产生的原因

将`printMsg()`方法翻译为Java代码：

```java
public static final void printMsg(@NotNull String msg) {
    Intrinsics.checkNotNullParameter(msg, "msg");
}
```

Gson解析后，UserBean中的`name`字段仍然为null，Kotlin是严格区分`可null`和`非null`类型的，如果是非null类型会做空安全检查，所以在调用`printMsg()`方法时会抛出NPE。



## 空安全失效问题

Gson是通过反射创建对象，然后遍历JSON中的key值和UserBean中的字段进行对应赋值的，核心代码如下：

**ReflectiveTypeAdapterFactory类**

```java
@Override public T read(JsonReader in) throws IOException {
    if (in.peek() == JsonToken.NULL) {
        in.nextNull();
        return null;
    }

    //创建对象
    T instance = constructor.construct(); 

    try {
        in.beginObject();
        while (in.hasNext()) {
            String name = in.nextName();
            BoundField field = boundFields.get(name);
            if (field == null || !field.deserialized) {
                in.skipValue();
            } else {
                //赋值操作
                field.read(in, instance);
            }
        }
    } catch (IllegalStateException e) {
        throw new JsonSyntaxException(e);
    } catch (IllegalAccessException e) {
        throw new AssertionError(e);
    }
    in.endObject();
    return instance;
}
```

**ConstructorConstructor类**

![在这里插入图片描述](https://img-blog.csdnimg.cn/e424c4d6326b4840a9ab04bda3ef7993.png)

- newDefaultConstructor：通过反射无参构造函数创建对象。
- newDefaultImplementationConstructor：通过反射Collection和Map等集合框架类型创建对象。
- newUnsafeAllocator：通过Unsafe包创建对象，兜底方案，是不安全的操作。



### 字段全有默认值

```kotlin
data class UserBean(val name: String = "未知", val age: Int = -1)

val json2 = """
        {

        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json2, UserBean::class.java)
    println("姓名：${userBean.name} 年龄：${userBean.age}")
}

//姓名：未知 年龄：-1
```

**翻译为Java代码：**

```java
public final class UserBean {
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

    public UserBean(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        super();
        this.name = name;
        this.age = age;
    }

    // $FF: synthetic method
    public UserBean(String var1, int var2, int var3, DefaultConstructorMarker var4) {
        if ((var3 & 1) != 0) {
            var1 = "未知";
        }

        if ((var3 & 2) != 0) {
            var2 = -1;
        }

        this(var1, var2);
    }

    public UserBean() {
        this((String)null, 0, 3, (DefaultConstructorMarker)null);
    }
}
```

说明：当data class的属性全赋值时，存在无参构造函数，所以走的是`newDefaultConstructor()`方法流程。



### 字段部分有默认值

```kotlin
data class UserBean(val name: String = "未知", val age: Int)

val json2 = """
        {
        
        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json2, UserBean::class.java)
    println("姓名：${userBean.name} 年龄：${userBean.age}")
}

//姓名：null 年龄：0
```

**翻译为Java代码：**

```java
public final class UserBean {
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

    public UserBean(@NotNull String name, int age) {
        Intrinsics.checkNotNullParameter(name, "name");
        super();
        this.name = name;
        this.age = age;
    }

    // $FF: synthetic method
    public UserBean(String var1, int var2, int var3, DefaultConstructorMarker var4) {
        if ((var3 & 1) != 0) {
            var1 = "未知";
        }

        this(var1, var2);
    }
}
```

说明：当data class部分字段赋值时，没有无参构造函数，所以这里走的Unsafe包下的类创建对象，绕开了Kotlin的空安全检查。



## 解决问题

### 使用data class时属性全赋值



### 使用无参构造函数

```kotlin
data class UserBean(val name: String, val age: Int) {
    constructor() : this("未知", -1)
}

val json = """
        {
         "age":18
        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json, UserBean::class.java)
    println("姓名：${userBean.name} 年龄：${userBean.age}")
}

//姓名：未知 年龄：18
```



### 声明为字段

本质是通过间接创建一个无参构造函数实现的。

```kotlin
class UserBean {
    val name: String = "未知"
    val age: Int = -1
}

val json = """
        {
         "age":18
        }
    """.trimIndent()

fun main() {
    val userBean = Gson().fromJson(json, UserBean::class.java)
    println("姓名：${userBean.name} 年龄：${userBean.age}")
}

//姓名：未知 年龄：18
```



### 使用moshi框架

**添加依赖**

```
implementation 'com.squareup.moshi:moshi-kotlin:1.11.0'
```

```kotlin
data class UserBean(val name: String = "未知", val age: Int)

val json = """
        {
         "age":18
        }
    """.trimIndent()

fun main() {
    val moshi = Moshi.Builder()
	    .addLast(KotlinJsonAdapterFactory())
    	.build()
    val jsonAdapter = moshi.adapter(UserBean::class.java)
    val userBean = jsonAdapter.fromJson(json)
    println("姓名：${userBean?.name} 年龄：${userBean?.age}")
}

//姓名：未知 年龄：18
```

