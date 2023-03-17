@[toc]
# Java 注解总结

## 概述

在Java中，注解就是给程序添加一些信息，用符号@开头，可以用来修饰后续的其他代码元素，比如类、接口、字段、方法、参数、构造方法等，往往注解还搭配编译器、程序运行时以及其他工具或者插件使用，用于实现代码功能的增强或者修改程序的行为等操作。



## Java内置注解

- @Override
- @Deprecated
- @SuppressWarnings

**@Override**

`@Override`注解是用于修饰方法上，表示当前方法不是当前类最先声明的，而是从父类继承过来的，进行的方法重写操作：

```java
class Base{
    public void eat(){}
}

class Person extends Base{
    @Override
    public void eat() {

    }
}
```

**@Deprecated**

`@Deprecated`注解修饰范围广，可以用在类、方法、常量等，该注解表示被修饰的元素已经过时：

```java
class Base {
    @Deprecated
    public void hello() { }
}

class Person extends Base {
    //会显示过时警告
    @Override
    public void hello() {

    }
}
```

**@SuppressWarnings**

`@SuppressWarnings`注解表示压制编译器中的警告，当使用一些过期或会有风险的方法时，编译器可能会提示黄线，这时可以添加该注解消除警告：

```java
@SuppressWarnings({"描述信息", "不建议使用"})
Date date = new Date(2008, 9, 9);
```



## 元注解

Java中有四个元注解：

- `@Target`：表示要注解的目标
- `@Retention`：表示注解的信息保留在Java的什么阶段
- `@Documented`：表示注解信息是否包含到文档
- `@Inherited`：表示注解之间的继承关系

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

### @Target

`@Target`注解表示当前注解使用在什么类型的元素上：

- ElementType.TYPE：类、接口、枚举
- ElementType.FIELD：属性
- ElementType.METHOD：类中的方法
- ElementType.PARAMETER：方法参数
- ElementType.CONSTRUCTOR：构造器
- ElementType.LOCAL_VARIABLE：局部变量
- ElementType.ANNOTATION_TYPE：注解
- ElementType.PACKAGE：包

### @Retention

`@Retention`注解表示当前注解可以保留在Java的哪一个阶段

- RetentionPolicy.SOURCE：在源码中可用，编译后丢失注解
- RetentionPolicy.CLASS：在源码和字节码中可用
- RetentionPolicy.RUNTIME：在源码、字节码、运行时都可用

### @Inherited

`@Inherited`注解表示是否可以被继承，默认为false

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
}
```

```java
@MyAnnotation
class Base {
}

class Child extends Base {
}

public class Demo {
    public static void main(String[] args) {
        boolean b = Child.class.isAnnotationPresent(MyAnnotation.class);
        System.out.println(b);//true
    }
}
```

### @Documented

`@Documented`注解表示是否保存在Javadoc文档中



## 自定义注解

- 定义新注解需要关键字`@interface`
- 注解是无参无异常的
- 类型只能是基本数据类型、String类型、Class类型、Annotation类型、Enum枚举
- 可以使用关键字`default`指定初始值
- 当只有一个参数时，建议使用`value()`做参数名



**定义注解**

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Label {
    String value() default "";
}
```

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Formatter {
    String format() default "yyyy-MM-dd HH:mm:ss";

    String timezone() default "GMT";
}
```

**使用注解**

```java
class User {
    @Label("姓名")
    private String name;
    @Label("生日")
    @Formatter(format = "yyyy/MM/dd")
    private Date birthday;
    @Label("今日")
    @Formatter
    private Date today;

    public User(String name, Date birthday, Date today) {
        this.name = name;
        this.birthday = birthday;
        this.today = today;
    }
}
```

**定义注解处理器**

```java
class UserProcess {
    public static String parse(Object obj) {
        try {
            Class<?> clz = obj.getClass();
            StringBuilder builder = new StringBuilder();
            for (Field field : clz.getDeclaredFields()) {
                if (!field.isAccessible()) {
                    field.setAccessible(true);
                }
                if (field.isAnnotationPresent(Label.class)) {
                    Label label = field.getAnnotation(Label.class);
                    String name = label.value();

                    Object value = field.get(obj);
                    if (value != null && field.getType() == Date.class) {
                        value = formatData(field, value);
                    }

                    builder.append(name + ":" + value).append("\n");
                }
            }
            return builder.toString();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static Object formatData(Field field, Object value) {
        if (field.isAnnotationPresent(Formatter.class)) {
            Formatter formatter = field.getAnnotation(Formatter.class);
            String format = formatter.format();
            String timezone = formatter.timezone();
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            sdf.setTimeZone(TimeZone.getTimeZone(timezone));
            return sdf.format(value);
        }
        return value;
    }
}
```

**使用：**

```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

User user = new User("小白", sdf.parse("2008-8-8 1:2:3"), sdf.parse("2018-1-1 13:14:15"));
String info = UserProcess.parse(user);
System.out.println(info);
```

输出：

```
姓名:小白
生日:2008/08/07
今日:2018-01-01 05:14:15
```