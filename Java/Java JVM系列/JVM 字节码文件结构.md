[TOC]

# JVM 字节码文件结构

## 查看字节码的方法

- Java源代码通过 `javac` 命令编译生产 `.class` 字节码文件。
- 使用javap命令查看字节码文件。如：`javap -v Person.class` 输出字节码信息，或 `javap -v -p Person.class` 输出完整字节码信息。
- 可以安装 `jclasslib` 插件查看。



## 字节码文件标识说明

### 类访问标记

| 标记名         | 说明                                      |
| -------------- | ----------------------------------------- |
| ACC_PUBLIC     | 是否为public                              |
| ACC_FINAL      | 是否为final                               |
| ACC_SUPER      | 兼容旧版本，Java1.1及以上版本始终设置该值 |
| ACC_INTERFACE  | 是否为接口                                |
| ACC_ABSTRACT   | 是否为抽象，接口和抽象类有此标记          |
| ACC_SYNTHETIC  | 这个类的代码不是用户代码                  |
| ACC_ANNOTATION | 是否为注解                                |
| ACC_ENUM       | 是否为枚举                                |

### 字段类型标识符

| 标识字符 | 说明                        |
| -------- | --------------------------- |
| B        | 原始数据类型byte            |
| C        | 原始数据类型char            |
| D        | 原始数据类型double          |
| F        | 原始数据类型float           |
| I        | 原始数据类型int             |
| J        | 原始数据类型long            |
| S        | 原始数据类型short           |
| Z        | 原始数据类型boolean         |
| V        | 特殊类型void                |
| L        | 引用数据类型，以分号“;”结尾 |
| [        | 一维数组                    |

### 字段标识符

字段的标识符与类的非常类似。

| 标识符        | 说明                 |
| ------------- | -------------------- |
| ACC_PUBLIC    | 是否为public         |
| ACC_PRIVATE   | 是否为private        |
| ACC_PROTECTED | 是否为protected      |
| ACC_STATIC    | 是否为static         |
| ACC_FINAL     | 是否为final          |
| ACC_VOLATILE  | 是否为volatile       |
| ACC_TRANSIENT | 是否序列化           |
| ACC_SYNTHETIC | 是否由编译器自动生成 |
| ACC_ENUM      | 是否为枚举           |

### 方法标识符

| 标识符           | 说明                       |
| ---------------- | -------------------------- |
| ACC_PUBLIC       | 是否为public               |
| ACC_PRIVATE      | 是否为private              |
| ACC_PROTECTED    | 是否为protected            |
| ACC_STATIC       | 是否为static               |
| ACC_FINAL        | 是否为final                |
| ACC_SYNCHRONIZED | 是否为synchronized         |
| ACC_NATIVE       | 是否为本地方法             |
| ACC_SYNTHETIC    | 是否由编译器自动生成       |
| ACC_ABSTRACT     | 是否为抽象方法             |
| ACC_STRICT       | 限制浮点计算以确保可移植性 |
| ACC_VARARGS      | 是否能接收可变参数         |



## 字节码文件结构说明

**Java源代码：**

```java
public class Person {
    private String name = "小明";
    private int age = 18;
    private final int NO = 10068;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

**字节码文件：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/632107b37e2c491dae48bb672beb539c.png)

说明：`Person.java` 通过 `javac` 命令编译生成`Person.class`文件，打开文件可以看到里面的内容。

### 魔数

- 魔数用于标识文件类型。
- 在class字节码文件中，通过前4个字节作为身份标识：`CA` `FE` `BA` `BE`，咖啡北鼻（谐音）。

其他常见文件类型的头4个字节：

- JPEG: `FF` `D8` `FF`
- PNG: `89` `50` `4E` `47`
- GIF: `47` `49` `46` `38`
- TIFF: `49` `49` `2A` `00`

### 文件版本

- 字节码文件中的第5~6表示次要版本号，如：`00` `00`
- 第7~8表示主要版本号，如： `34` `00`

常见版本号对应关系：

| JDK版本 | 版本号（十六进制） | 版本号（十进制） |
| ------- | ------------------ | ---------------- |
| 1.6     | 32                 | 50               |
| 1.7     | 33                 | 51               |
| 1.8     | 34                 | 52               |

- 再往后就是字符串常量池。



### 反编译字节码文件

Java内置 `javap` 命令可以反编译查看字节码文件，或者通过 `jclasslib` 插件也可以查看。

通过 `javap -v Person.class` 命令查看输出信息：

```
Classfile /D:/TestWorkspace/AndroidDemo/lib_java/build/classes/java/main/com/example/lib_java/Person.class
  Last modified 2022-3-3; size 624 bytes
  MD5 checksum 44c9bd227e49c0b8440e0f10143b753d
  Compiled from "Person.java"
public class com.example.lib_java.Person
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #7.#28         // java/lang/Object."<init>":()V
   #2 = String             #29            // 小明
   #3 = Fieldref           #6.#30         // com/example/lib_java/Person.name:Ljava/lang/String;
   #4 = Fieldref           #6.#31         // com/example/lib_java/Person.age:I
   #5 = Fieldref           #6.#32         // com/example/lib_java/Person.NO:I
   #6 = Class              #33            // com/example/lib_java/Person
   #7 = Class              #34            // java/lang/Object
   #8 = Utf8               name
   #9 = Utf8               Ljava/lang/String;
  #10 = Utf8               age
  #11 = Utf8               I
  #12 = Utf8               NO
  #13 = Utf8               ConstantValue
  #14 = Integer            10068
  #15 = Utf8               <init>
  #16 = Utf8               ()V
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               LocalVariableTable
  #20 = Utf8               this
  #21 = Utf8               Lcom/example/lib_java/Person;
  #22 = Utf8               getName
  #23 = Utf8               ()Ljava/lang/String;
  #24 = Utf8               getAge
  #25 = Utf8               ()I
  #26 = Utf8               SourceFile
  #27 = Utf8               Person.java
  #28 = NameAndType        #15:#16        // "<init>":()V
  #29 = Utf8               小明
  #30 = NameAndType        #8:#9          // name:Ljava/lang/String;
  #31 = NameAndType        #10:#11        // age:I
  #32 = NameAndType        #12:#11        // NO:I
  #33 = Utf8               com/example/lib_java/Person
  #34 = Utf8               java/lang/Object
{
  private java.lang.String name;
    descriptor: Ljava/lang/String;
    flags: ACC_PRIVATE

  private int age;
    descriptor: I
    flags: ACC_PRIVATE

  private final int NO;
    descriptor: I
    flags: ACC_PRIVATE, ACC_FINAL
    ConstantValue: int 10068

  public com.example.lib_java.Person();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: ldc           #2                  // String 小明
         7: putfield      #3                  // Field name:Ljava/lang/String;
        10: aload_0
        11: bipush        18
        13: putfield      #4                  // Field age:I
        16: aload_0
        17: sipush        10068
        20: putfield      #5                  // Field NO:I
        23: return
      LineNumberTable:
        line 3: 0
        line 4: 4
        line 5: 10
        line 6: 16
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      24     0  this   Lcom/example/lib_java/Person;

  public java.lang.String getName();
    descriptor: ()Ljava/lang/String;
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #3                  // Field name:Ljava/lang/String;
         4: areturn
      LineNumberTable:
        line 9: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/example/lib_java/Person;

  public int getAge();
    descriptor: ()I
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #4                  // Field age:I
         4: ireturn
      LineNumberTable:
        line 13: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/example/lib_java/Person;
}
SourceFile: "Person.java"
```

### 第1部分：字节码的描述

```
Classfile /D:/*/*/*/build/classes/java/main/com/example/lib_java/Person.class
  Last modified 2022-3-3; size 560 bytes
  MD5 checksum ed1b841f2fb00defe07401da1d8c129f
  Compiled from "Person.java"
```

依次说明：

1. 字节码文件的存放位置。
2. 字节码文件修改日期和文件大小。
3. 生成唯一值MD5。
4. 生成字节码文件的源文件是`Person.java`。

### 第2部分：类的描述

```
public class com.example.lib_java.Person
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
```

依次说明：

1. 字节码文件的类全名。
2. 次版本号。
3. 主版本号。
4. 类访问标记，一共8种。

### 第3部分：常量池

第3部分是常量池，是字节码文件的重要部分，主要存放两类信息：

- 字面量：字符串、final常量等；
- 符号引用：类和接口的全限定名、字段的名称和描述符、方法的名称和描述符。

注：

- `#`号后面是索引，索引从1开始，索引没有从0开始，是因为设计者考虑到不引用任何常量时，可以将索引设置为0来表示。
- `=`号后面是常量的类型。

```
Constant pool:
   #1 = Methodref          #7.#28         // java/lang/Object."<init>":()V
   #2 = String             #29            // 小明
   #3 = Fieldref           #6.#30         // com/example/lib_java/Person.name:Ljava/lang/String;
   #4 = Fieldref           #6.#31         // com/example/lib_java/Person.age:I
   #5 = Fieldref           #6.#32         // com/example/lib_java/Person.NO:I
   #6 = Class              #33            // com/example/lib_java/Person
   #7 = Class              #34            // java/lang/Object
   #8 = Utf8               name
   #9 = Utf8               Ljava/lang/String;
  #10 = Utf8               age
  #11 = Utf8               I
  #12 = Utf8               NO
  #13 = Utf8               ConstantValue
  #14 = Integer            10068
  #15 = Utf8               <init>
  #16 = Utf8               ()V
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               LocalVariableTable
  #20 = Utf8               this
  #21 = Utf8               Lcom/example/lib_java/Person;
  #22 = Utf8               getName
  #23 = Utf8               ()Ljava/lang/String;
  #24 = Utf8               getAge
  #25 = Utf8               ()I
  #26 = Utf8               SourceFile
  #27 = Utf8               Person.java
  #28 = NameAndType        #15:#16        // "<init>":()V
  #29 = Utf8               小明
  #30 = NameAndType        #8:#9          // name:Ljava/lang/String;
  #31 = NameAndType        #10:#11        // age:I
  #32 = NameAndType        #12:#11        // NO:I
  #33 = Utf8               com/example/lib_java/Person
  #34 = Utf8               java/lang/Object
```

依次说明：

1. #1常量的类型是Methodref，表示用来定义方法的，#1常量指向常量池中#7和#28的常量。
2. #7常量类型是Class，表示用来定义类或接口，指向#34常量。
3. #34常量类型是Utf8的字符串，值为`java/lang/Object`。
4. #28常量类型是NameAndType，表示字段或方法的部分符号引用，指向常量池中的#15和#16常量。
5. #15常量类型是Utf8的字符串，值为`<init>`，表示为构造方法。
6. #16常量类型是Utf8的字符串，值为`()V`，表示方法的返回值是void。

总结#1常量，Person类的使用默认的构造方法，来源自Object类。

1. #2常量的类型是String，指向#29常量。
2. #29常量的类型是Utf8的字符串，值为小明。

总结#2常量，定义类一个为“小明”的字符串。

1. #3常量的类型是Fieldref，表示用来定义字段的，指向#6和#30常量。
2. #6常量的类型是Class，指向#33常量。
3. #33常量的类型是Utf8的字符串，值是`com/example/lib_java/Person`。
4. #30常量的类型是NameAndType，指向 #8和#9常量。
5. #8常量的类型是Utf8的字符串，值是`name`。
6. #9常量的类型是Utf8的字符串，值是`Ljava/lang/String`。

总结#3常量，声明了一个类型为String的字段name。

### 第4部分：字段表

字段表是用于描述类或接口中声明的字段，包含类变量和成员变量，不包含局部变量。

```
  private java.lang.String name;
    descriptor: Ljava/lang/String;
    flags: ACC_PRIVATE
```

依次说明：

1. 表示该字段的访问修饰符是`private`，类型是`String`，字段名是`name`。

### 第5部分：方法表

方法表用于描述类或接口中声明的方法。

```
  public com.example.lib_java.Person();
    descriptor: ()V
    flags: ACC_PUBLIC
```

依次说明：

1. 表示该方法是构造方法，返回值类型是`void`，访问修饰符是`public`。

```
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: ldc           #2                  // String 小明
         7: putfield      #3                  // Field name:Ljava/lang/String;
        10: aload_0
        11: bipush        18
        13: putfield      #4                  // Field age:I
        16: aload_0
        17: sipush        10068
        20: putfield      #5                  // Field NO:I
        23: return
      LineNumberTable:
        line 3: 0
        line 4: 4
        line 5: 10
        line 6: 16
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      24     0  this   Lcom/example/lib_java/Person;
```

依次说明：

1. stack：最大操作数占，JVM在运行时会根据这个值分配栈帧。为什么是2，因为会调用父类的构造方法。
2. locals：局部变量数量。隐藏了this变量。
3. args_size：形参数量。默认传入this变量。
3. LineNumberTable：描述源码行号与字节码行号之间的对应关系。
3. LocalVariableTable：描述栈帧中的局部变量与源码中定义的变量之间的关系，其中的this。

