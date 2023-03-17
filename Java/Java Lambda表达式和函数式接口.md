[TOC]

# Lambda表达式

- Java8引入Lambda表达式。
- Lambda表达式是一种匿名函数，它没有声明的方法，没有访问修饰符、返回值声明和函数名。
- 主要作用是简化部分匿名内部类的写法。
- Lambda表达式不会创建匿名内部类，那么在 Lambda 表达式中使用 `this` 关键字时，其指向的是外部类的引用。 

AndroidStudio3.0以后只需在`module`的`build.gradle`里加入：

```
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```



## 替代匿名内部类

### 无参方法简写

**Java**

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("hello Java7");
    }
}).start();
```

**使用Lambda**

```
() -> {
	执行语句
}
或
() -> 执行语句
```

```java
new Thread(() -> {
    System.out.println("hello Lambda");
}).start();
```

```java
new Thread(() -> System.out.println("hello Lambda")).start();
```



### 单参方法简写

**Java**

```java
btn.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Toast.makeText(MainActivity.this, "点击了", Toast.LENGTH_SHORT).show();
    }
});
```

**使用Lambda**

```
([类型] 变量) -> {
	执行语句
}
或
变量 -> 执行语句
```

```java
btn.setOnClickListener((View v) -> {
    Toast.makeText(MainActivity.this, "点击了", Toast.LENGTH_SHORT).show();
});
```

```java
btn.setOnClickListener(v -> Toast.makeText(MainActivity.this, "点击了", Toast.LENGTH_SHORT).show());
```



### 多参方法简写

**Java**

```java
List<Integer> list = Arrays.asList(1, 5, 3);
Collections.sort(list, new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
});
```

**使用Lambda**

```
([类型1] 变量1, [类型2] 变量2, ...) -> {
	执行语句
}
或
(o1, o2, ...) -> 执行语句
```

```java
Collections.sort(list, (Integer o1, Integer o2) -> {
    return o1.compareTo(o2);
});
```

```java
Collections.sort(list, (o1, o2) -> o1.compareTo(o2));
```



## 方法引用

方法引用是用来直接访问类或实例的方法或构造函数。

### 引用静态方法

```
([变量1, 变量2, ...]) -> 类名.静态方法名([变量1, 变量2, ...])
或
类名::静态方法名
```

定义工具类

```java
class Utils {
    public static int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
}
```

```java
Collections.sort(list, (o1, o2) -> Utils.compare(o1, o2));
```

```java
Collections.sort(list, Utils::compare);
```



### 引用对象方法

```
([变量1, 变量2, ...]) -> 对象名.方法名([变量1, 变量2, ...])
或
对象名::方法名
```

定义工具类

```java
class MyUtils {
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
}
```

```java
MyUtils myUtils = new MyUtils();
Collections.sort(list, (o1, o2) -> myUtils.compare(o1, o2));
```

```java
Collections.sort(list,myUtils::compare);
```



### 引用构造函数

```
([变量1, 变量2, ...]) -> new 类名([变量1, 变量2, ...])
或
类名::new
```

定义实体类

```java
class Person {
    private String name;
    private int age;

    public Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

#### 无参构造函数

```java
Supplier<Person> p = () -> new Person();
//或
Supplier<Person> p= Person::new;

Person person = p.get();
```

#### 有参构造函数

```java
Function<String, Person> fun = (name) -> new Person(name);
//或
Function<String, Person> fun = Person::new;

Person person = fun.apply("Tom");
```

# 函数式接口

- 函数式接口适用于函数式编程场景的接口。
- 在Java中的函数式编程体现就是Lambda表达式，所以函数式接口适用于Lambda表达式。
- 使用注解`@FunctionalInterface`声明是一个函数式接口。



## 内置函数式接口

| 函数接口       | 抽象方法          | 功能     |
| -------------- | ----------------- | -------- |
| Supplier       | T get()           | 生产消息 |
| Consumer       | void accept(T t)  | 消费消息 |
| Function       | R apply(T t)      | 转换消息 |
| Predicate      | boolean test(T t) | 判断真假 |
| BinaryOperator | R apply(T t, U u) | 两数运算 |



## Supplier

Supplier接口类似”生成者“的角色。

```java
@FunctionalInterface
public interface Supplier<T> {

    T get();
}
```

**例子**

```java
Supplier<Double> supplier = () -> Math.random();
System.out.println(supplier.get());

//0.8076428064774539
```



## Consumer

Consumer接口承担类似于”消费者“的角色。

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

**例子**

```java
Consumer<String> consumer = param -> System.out.println(param.toLowerCase());
consumer.accept("hello JAVA");

//hello java
```

```java
Consumer<String> c1 = param -> System.out.println(param.toLowerCase());
Consumer<String> c2 = param -> System.out.println(param.toUpperCase());
c1.andThen(c2).accept("hello JAVA");

//hello java
//HELLO JAVA
```



## Function

Function接口接受一个参数，转换生成一个结果。

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

**例子**

```java
Function<String, String> function = param -> "姓名：" + param;
System.out.println(function.apply("小明"));

//姓名：小明
```



## Predicate

Predicate接口接受一个参数，返回一个布尔值结果。

```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
            ? Objects::isNull
                : object -> targetRef.equals(object);
    }
}
```

**例子**

```java
Predicate<String> predicate = param -> param.length() > 5;
System.out.println(predicate.test("hello java"));

//true
```




