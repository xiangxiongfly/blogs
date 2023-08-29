[toc]

# Java 注解总结

## 概述

Java注解是JDK1.5引入的，提供有关于程序但不属于程序本身的数据。注解对它们注解的代码的操作没有直接影响。



## Java内置注解

- @Override
- @Deprecated
- @SuppressWarnings

### @Override

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

### @Deprecated

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

### @SuppressWarnings

`@SuppressWarnings`注解表示压制编译器中的警告，当使用一些过期或会有风险的方法时，编译器可能会提示黄线，这时可以添加该注解消除警告：

```java
@SuppressWarnings({"描述信息", "不建议使用"})
Date date = new Date(2008, 9, 9);
```



## 元注解

Java中有四个元注解：

- `@Target`：表示注解的目标。
- `@Retention`：表示注解的保留级别。
- `@Documented`：表示注解信息是否保存到文档。
- `@Inherited`：表示注解之间的继承关系。

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

`@Target` 表示注解的作用位置：

| 注解                        | 作用位置       |
| --------------------------- | -------------- |
| ElementType.TYPE            | 类、接口、枚举 |
| ElementType.FIELD           | 属性           |
| ElementType.METHOD          | 类中的方法     |
| ElementType.PARAMETER       | 方法参数       |
| ElementType.CONSTRUCTOR     | 构造器         |
| ElementType.LOCAL_VARIABLE  | 局部变量       |
| ElementType.ANNOTATION_TYPE | 注解           |
| ElementType.PACKAGE         | 包             |

### @Retention

`@Retention `表示注解的保留级别：

| 注解                    | 保留级别 | 说明                                                         | 技术           |
| ----------------------- | -------- | ------------------------------------------------------------ | -------------- |
| RetentionPolicy.SOURCE  | 源码     | 编译后丢失注解。<br />在编译期能回去注解和注解声明的类包括类中所有成员信息，一般用于生成额外的辅助类 | APT            |
| RetentionPolicy.CLASS   | 字节码   | 在编译出Class后，通过修改Class数据以实现修改代码逻辑目的。   | 字节码增强技术 |
| RetentionPolicy.RUNTIME | 运行时   | 在程序运行期间，通过反射技术动态获取注解信息。               |                |

### @Inherited

`@Inherited` 表示是否可被继承，默认值为false。

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



## 使用自定义注解

- 定义新注解需要关键字`@interface`
- 注解是无参无异常的
- 类型只能是基本数据类型、String类型、Class类型、Annotation类型、Enum枚举
- 可以使用关键字`default`指定初始值
- 当只有一个参数时，建议使用`value()`做参数名

**定义注解**

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Label {
    String value() default "";
}
```

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Formatter {
    String format() default "yyyy-MM-dd HH:mm:ss";
}
```

**使用注解**

```java
public class User {
    @Label("姓名")
    private String name;

    @Label("生日")
    @Formatter(format = "yyyy年MM月dd日")
    private Date birthday;

    @Label("现在时间")
    @Formatter
    private Date nowDate;

    public User(String name, Date birthday, Date nowDate) {
        this.name = name;
        this.birthday = birthday;
        this.nowDate = nowDate;
    }
}
```

**定义注解处理器**

```java
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UserProcess {
    public static String parse(User user) {
        Class<? extends User> clz = user.getClass();
        StringBuilder builder = new StringBuilder();
        //获取所有成员变量
        Field[] declaredFields = clz.getDeclaredFields();
        for (Field field : declaredFields) {
            //设置访问权限
            if (!field.isAccessible()) {
                field.setAccessible(true);
            }
            //是否被@Label注解
            if (field.isAnnotationPresent(Label.class)) {
                //获取Label注解
                Label label = field.getAnnotation(Label.class);
                //获取注解值
                String name = label.value();
                try {
                    //获取变量值
                    Object value = field.get(user);
                    if (value != null) {
                        //变量类型为String
                        if (field.getType() == String.class) {
                            builder.append(name).append(":").append(value).append("\n");
                        }
                        //变量类型为Date
                        else if (field.getType() == Date.class) {
                            value = formatDate(field, value);
                            builder.append(name).append(":").append(value).append("\n");
                        }
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        return builder.toString();
    }

    private static Object formatDate(Field field, Object value) {
        //是否被@Formatter注解
        if (field.isAnnotationPresent(Formatter.class)) {
            Formatter formatter = field.getAnnotation(Formatter.class);
            String format = formatter.format();
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            return sdf.format(value);
        }
        return value;
    }
}
```

**使用：**

```java
public class Demo {
    public static void main(String[] args) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date birthday = sdf.parse("2008-09-10");
        User user = new User("小明", birthday, new Date());
        String userInfo = UserProcess.parse(user);
        System.out.println(userInfo);
    }
}
```

输出：

```
姓名:小明
生日:2008年09月10日
现在时间:2023-08-24 13:59:01
```



## [APT技术使用](https://blog.csdn.net/qq_14876133/article/details/115844588)

