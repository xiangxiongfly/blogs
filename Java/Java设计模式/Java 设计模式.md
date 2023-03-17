[TOC]

# 设计模式

## 设计模式的意义

设计模式的本质是面向对象设计原则的实际运用，是对类的封装性、继承性和多态性以及类的关联关系和组合关系的充分理解。

使用设计模式的代码可重用性高、可读性强、可靠性高、灵活性好、可维护性高。



## 分类

### 创建型模式

单例模式、工厂模式、抽象工厂模式、建造者模式、原型模式。



### 结构型模式

适配器模式、桥接模式、装饰模式、组合模式、外观模式、享元模式、代理模式。



### 行为型模式

模版方法模式、命令模式、迭代器模式、观察者模式、中介模式、备忘录模式、解释器模式、状态模式、策略模式、职责链模式、访问者模式。



## OOP七大原则

### 单一职责原则

控制类的粒度大小、将对象解耦、提高其内聚性，改变一个类的原因不能超过一个。

```java
public class Person {
    public void eat() {
        System.out.println("吃饭");
    }

    public void run() {
        System.out.println("步行");
    }
}
```



### 里氏替换原则

子类可以对父类进行扩展，但是不能改变父类现有的功能。

```java
class Boy extends Person {
    @Override
    public void eat() {
        super.eat();
        System.out.println("男孩吃饭");
    }
}
```

```java
Person person = new Boy();
person.eat();
```



### 依赖倒置原则

简而言之就是要面向接口编程，所有模块必须依赖抽象，实现也依赖抽象。

```java
interface IFood {
}

class Hamburger implements IFood {
}

class Sandwich implements IFood {
}

public class Person {
    public void eat(IFood food) {
        System.out.println("吃" + food);
    }
}
```

```java
Person person = new Person();
person.eat(new Hamburger());
```



### 接口隔离原则

要为各个类建立他们需要的专用接口.

```java
interface IBase {
    void eat();
    void run();
}
```



### 迪米特原则

只与你的直接朋友交谈，不和“陌生人”说话，能用private就用private。

- private用于私有属性和方法。
- protected用于暴露给子类使用。
- public可以开放给其他类使用。



### 开闭原则

对扩展开放，对修改关闭。

```java
class Driver extends Person {
    public void drive() {
        System.out.println("开车");
    }
}
```



### 合成复用原则

尽量先使用组合等关联关系实现，其次考虑继承关系来实现。



