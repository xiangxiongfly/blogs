[TOC]

# Java方法分派模型

## 变量的静态类型 & 动态类型

-   变量的静态类型：指引用类型，不会被改变，编译期可知。
-   变量的动态类型：值实例对象类型，可以被改变，运行期可知。

```java
class Animal {
}

class Dog extends Animal {
}

class Cat extends Animal {
}
```

```java
public class Demo {
    public static void main(String[] args) {
        Animal a = new Animal();
        Animal b = new Dog();
        System.out.println(a.getClass()); //class com.example.lib_java.Animal
        System.out.println(b.getClass()); //class com.example.lib_java.Dog
    }
}
```



## 静态分派

根据变量的静态类型进行方法分派的行为。发生在编译期，不受Java虚拟机影响。

对应方法重载（Overload）。

```java
public class Demo {
    public static void main(String[] args) {
        Animal a = new Animal();
        Animal b = new Dog();
        Demo demo = new Demo();
        demo.sayHello(a);
        demo.sayHello(b);
    }

    public void sayHello(Animal a) {
        System.out.println("hello Animal");
    }

    public void sayHello(Dog a) {
        System.out.println("hello Dog");
    }
}

//    hello Animal
//    hello Animal
```

说明：方法重载属于静态分派，会根据变量的静态类型执行哪个方法。变量（a、b）的静态类型是Animal，所以最终都会调用`sayHello(Animal a)`方法。



### 类型强转问题

```java
public class Demo {
    public static void main(String[] args) {
        Animal a = new Animal();
        Animal b = new Dog();
        Demo demo = new Demo();
        demo.sayHello((Animal) b);
    }

    public void sayHello(Animal a) {
        System.out.println("hello Animal");
    }

    public void sayHello(Dog a) {
        System.out.println("hello Dog");
    }
}

//    hello Animal
```

说明：类型强转将变量（b）的静态类型由Dog转为Animal，所以最终会调用`sayHello(Animal a)`方法。



### 静态分派优先级问题

变量没有显示指定静态类型时，程序会根据优先级进行方法分配。

优先级顺序：` char -> int -> long -> float -> double -> Character -> Serializable -> Object -> ... `

```java
public class Demo {
    public static void main(String[] args) {
        Demo demo = new Demo();
        demo.sayHello('a');
    }

    public void sayHello(char a) {
        System.out.println("hello char");
    }

    public void sayHello(int a) {
        System.out.println("hello int");
    }

    public void sayHello(long a) {
        System.out.println("hello long");
    }

    public void sayHello(Object a) {
        System.out.println("hello Object");
    }
}
```

说明：变量`'a'`是char类型，即静态类型是char，所以会调用char参数的重载方法；如果该方法删除掉，则会调用int参数的重载方法，会根据优先级进行调用。



## 动态分派

根据变量的动态类型进行分派的行为。发生在运行期。

对应方法重写（Override）。

```java
class Animal {
    public void sayHello() {
        System.out.println("hello Animal");
    }
}

class Dog extends Animal {
    @Override
    public void sayHello() {
        System.out.println("hello Dog");
    }
}

class Cat extends Animal {
    @Override
    public void sayHello() {
        System.out.println("hello Cat");
    }
}

public class Demo {
    public static void main(String[] args) {
        //情况1
        Animal animal = new Animal();
        animal.sayHello();
        //情况2
        animal = new Dog();
        animal.sayHello();
    }
}

//    hello Animal
//    hello Dog
```

说明：方法重写属于动态分配，会根据变量的动态类型执行哪个方法。情况1中变量（animal）的动态类型是Animal，所以会调用Animal类的`sayHello()`方法，情况2中变量（animal）的动态类型修改为Dog，所以会调用Dog类的`sayHello()`方法。



