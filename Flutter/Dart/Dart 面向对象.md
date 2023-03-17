[TOC]

# 面向对象

## 类和对象

```dart
void main(List<String> args) {
    final user = User("小明");
    user.age = 18;

    user.eat();
    user.run();
    user.showInfo();
}

class User {
    late String name;
    int age = 0;

    //标准构造方法
    User(String name) {
        this.name = name;
    }

    void eat() {
        print("$name 吃东西");
    }

    void run() {
        print("$name 跑步");
    }

    void showInfo() {
        print("$name $age");
    }
}

```



### 构造函数简写

Dart的默认构造函数只能有一个。

```dart
class User {
    int age = 0;

    User(this.name);
}
```



### 命名构造函数

```dart
void main(List<String> args) {
    var map = {"name": "小黑", "age": 18};
    final user = User.fromMap(map);
}

class User {
    late String name;
    int age = 0;

    //命名构造函数
    User.fromMap(Map<String, dynamic> map) {
        this.name = map["name"];
        this.age = map["age"];
    }
}
```



### 初始化列表

```dart
void main(List<String> args) {
    final rect = Rectangle(10, 20);
    rect.showInfo(); //area:200 length:60
}

class Rectangle {
    late int width;
    late int height;
    int area = 0;
    int length = 0;

    //初始化列表
    Rectangle(this.width, this.height)
        : area = width * height,
    length = (width + height) * 2;

    void showInfo() {
        print("area:$area length:$length");
    }
}

```



### 重定向构造函数

```dart
void main(List<String> args) {
    final p = Person.forName("小白");
    p.showInfo();
}

class Person {
    late String name;
    int age = 0;

    Person(this.name, this.age);

    //重定向构造函数
    Person.forName(String name) : this(name, 0);

    void showInfo() {
        print("name:$name age:$age");
    }
}
```



### 常量构造函数

相同参数创建对象是相同的

- 常量构造函数中，所有变量都必须是final修饰，const必须放在构造函数名前
- 创建对象时需要使用`const`关键字

```dart
void main(List<String> args) {
    Person p1 = const Person("hello", 18);
    Person p2 = const Person("hello", 18);
    print(identical(p1, p2)); //true
    print("${p1.hashCode} ${p2.hashCode}"); //156846374 156846374
}

class Person {
    final String name;
    final int age;

    const Person(this.name, this.age);
}

```



### 工厂构造函数

避免重复创建对象。

```dart
void main(List<String> args) {
    var a = Factory("a");
    var b = Factory("a");
    var c = Factory("b");
    print(a.hashCode);
    print(b.hashCode);
    print(c.hashCode);
}

class Factory {
    String name;
    static Map<String, dynamic> _cache = {};

    factory Factory(String name) {
        if (_cache.containsKey(name)) {
            return _cache[name];
        } else {
            final obj = Factory.create(name);
            _cache[name] = obj;
            return obj;
        }
    }

    Factory.create(this.name);
}
```



## getter & setter

Dart可以通过getter/setter监听属性的访问过程。

```dart
main(List<String> args) {
    var user = User();
    user.setName = "Tom";
    print(user.getName);
}

class User {
    String name = "";
    int age = 0;

    set setName(String name) {
        this.name = name;
        print("设置名字");
    }

    String get getName {
        print("获取名字");
        return this.name;
    }

    set setAge(int age) {
        print("设置年龄");
        this.age = age;
    }

    int get getAge {
        print("获取年龄");
        return this.age;
    }
}
```



## static静态方法

```dart
main(List<String> args) {
    var user = User();

    user.name = "小明";
    user.age = 18;
    User.address = "China";

    user.sayHello();
    User.sayWorld();
}

class User {
    String name = "";
    int age = 0;
    static String address = "";

    void sayHello() {
        print("hello");
    }

    static void sayWorld() {
        print("world");
    }
}
```



## 继承

- Dart支持继续特性，通过`extends`关键字实现，子类会继承父类的变量和方法
- 子类可以使用`super`访问父类

```dart
main(List<String> args) {
    var dog = Dog();
    dog.animalName = "狗";
    dog.run();
}

class Animal {
    String animalName = "";

    void run() {
        print("$animalName 在奔跑");
    }
}

class Dog extends Animal {
    @override
    void run() {
        super.run();
        print("$animalName 正在快乐的奔跑");
    }
}
```



## 抽象类

```dart
main(List<String> args) {
    var dog = Dog();
    dog.animalName = "狗";
    dog.run();
}

abstract class Animal {
    String animalName = "";
    void run();
}

class Dog extends Animal {
    @override
    void run() {
        print("$animalName 正在快乐的奔跑");
    }
}
```



## 接口

Dart是隐式接口，没有专门的关键字定义接口。

```dart
main(List<String> args) {
    var animal = Animal();
    animal.fly();
    animal.run();
}

abstract class IRun {
    void run();
}

abstract class IFly {
    void fly();
}

class Animal implements IRun, IFly {
    @override
    void fly() {
        print("fly");
    }

    @override
    void run() {
        print("run");
    }
}
```



## Mixin混入

- Dart只支持单继承
- 可以通过`mixin`关键字定义类，通过`with`关键字混入

```dart
mixin Runner {
    void run() {
        print("run");
    }
}

mixin Flyer {
    void fly() {
        print("fly");
    }
}

class Animal with Runner, Flyer {
    void sayHello() {
        print("hello");
    }
}

main(List<String> args) {
    var animal = Animal();
    animal.fly();
    animal.run();
    animal.sayHello();
}

// fly
// run
// hello
```



## 枚举

- index：返回枚举的索引
- values：返回一个List，所有的枚举值

```dart
main(List<String> args) {
    print(Colors.RED); //Colors.RED
    print(Colors.values); //[Colors.RED, Colors.GREEN, Colors.BLUE]
    print(Colors.RED.index); //0
}

enum Colors { RED, GREEN, BLUE }
```



## 泛型

### 泛型类

```dart
main(List<String> args) {
    var point = Point(10, 20);
    point.showInfo();

    var point2 = Point("A", "B");
    point2.showInfo();
}

class Point<T> {
    late T x;
    late T y;
    
    Point(this.x, this.y);

    void showInfo() {
        print("$x  $y");
    }
}
```



### 泛型方法

```dart
main(List<String> args) {
    var list = ["A", "B", "C"];
    var first = getFirst(list);
    print(first);
}

T getFirst<T>(List<T> list) {
    return list[0];
}
```

