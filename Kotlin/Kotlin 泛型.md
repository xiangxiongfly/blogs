[TOC]

# Kotlin 泛型

## 概述

- 泛型是对程序的一种抽象，可以借助泛型对代码的复用。

- 支持类型检查，能在编译期检查出问题。

- 还可以在定义泛型时，设置边界限制。

- 从型变的位置来分类的话，分为使用处型变和声明处型变。

- 从型变的父子关系来分类的话，分为逆变和协变。逆变表示父子关系颠倒了，而协变表示父子关系和原来一致。

- 型变的口诀：泛型作为参数，用 in；泛型作为返回值，用 out。在特殊场景下，同时作为参数和返回值的泛型参数，我们可以用 @UnsafeVariance 来解决型变冲突。

  

## 基本使用

- 通过泛型定义`Controller`万能控制类，泛型T代表传入类型。

### Java版

```java
class Animal {
    public void eat() {
        System.out.println("吃点啥?");
    }
}

class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("吃骨头");
    }
}

class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println("吃鱼");
    }
}

class Controller<T> {
    public void eat(T t) {

    }
}

public class Demo {
    public static void main(String[] args) {
        Animal animal = new Animal();
        Dog dog = new Dog();
        Cat cat = new Cat();
        Controller<Animal> controller = new Controller();
        controller.eat(animal);
        controller.eat(dog);
        controller.eat(cat);
    }
}
```



### Kotlin版

```kotlin
open class Animal {
    open fun eat() {
        println("吃点啥？")
    }
}

class Dog : Animal() {
    override fun eat() {
        println("吃骨头")
    }
}

class Cat : Animal() {
    override fun eat() {
        println("吃鱼")
    }
}

class Controller<T > {
    fun eat(t: T) {

    }
}

fun main() {
    val animal = Animal()
    val dog = Dog()
    val cat = Cat()
    val controller = Controller<Animal>()
    controller.eat(animal)
    controller.eat(dog)
    controller.eat(cat)
}
```



## 泛型函数

在 Kotlin 中函数是一等公民。

```kotlin
fun <T> eat(t: T) {
}

fun main() {
    val animal = Animal()
    val dog = Dog()
    val cat = Cat()
    eat<Animal>(animal)
    eat<Animal>(dog)
    eat<Animal>(cat)
}
```



## 泛型边界

- 在 Java 中可以通过`? extends Base`指定上界是`Base`类型，表示前者是后者的子类。
- 在 Kotlin 中可以通过`T : Base`指定上界是`Base`类型。

```kotlin
class Controller<T : Animal> {
    fun eat(t: T) {
        t.eat()
    }
}

fun main() {
    val animal = Animal()
    val dog = Dog()
    val cat = Cat()
    val controller = Controller<Cat>()
    controller.eat(cat)
}
```



## 限制多个类型

可以通过 `where` 关键字实现

```kotlin
class Dog : Animal() {
}

class Cat : Animal(), IPet {
}

class Controller<T> where T : Animal, T : IPet {
    fun eat(t: T) {
        t.eat()
    }
}

fun <T> eat(t: T) where T : Animal, T : IPet {
    t.eat()
}

fun main() {
    val animal = Animal()
    val dog = Dog()
    val cat = Cat()
    eat(cat)
    // eat(dog) //编译器报错
    val controller = Controller<Cat>()
    controller.eat(cat)
}
```



## 型变

- 型变是为了解决泛型的不变性问题。
- 根据位置分类：
  - 使用处型变
  - 声明处型变
- 根据父子关系分类：
  - 逆变：负责关系颠倒
  - 协变：父子关系不变

### 不变性问题

虽然`Cat`是`Animal`的子类，但是`MutableList<Cat>`与`Mutable<Animal>`不存在任何继承关系，无法互相替代，没有任何联系，这就是泛型的不变性。

虽然 Java 也有型变的概念，但是 Java 是没有声明处型变的，只有使用处型变。

```kotlin
fun foo(animalList: MutableList<Animal>) {
    animalList.add(Dog()) //Cat集合不能存Dog对象
    val animal: Animal = animalList[0]
}

fun main() {
    val catList = mutableListOf<Cat>(Cat())
    foo(catList) //编译器报错
}
```

```kotlin
fun foo(catList: MutableList<Cat>) {
    catList.add(Cat())
    val cat: Cat = catList[0] //实际取出来的是Animal对象
}

fun main() {
    val animalList = mutableListOf<Animal>(Animal())
    foo(animalList) //编译器报错
}
```

说明：

- 当程序需要 Animal 集合时，如果传入 Cat 集合，这时往 list 中添加 Dog，就会出问题。
- 当程序需要 Cat 集合时，如果传入 Animal 集合，这时从 list 中取对象是 Animal 而不是 Cat 时，就会出问题。
- 因此 `MutableList<Cat>`与`MutabelList<Animal>` 没有任何继承关系，这就是泛型的不变性。



### 协变

#### 协变问题

```kotlin
open class Fruit

class Apple : Fruit()

class FruitShop<T>(private val fruit: T) {
    fun getFruit(): T {
        return fruit
    }
}

fun fetchFruit(shop: FruitShop<Fruit>) {
    val fruit = shop.getFruit()
}

fun main() {
    val apple = Apple()
    val shop = FruitShop<Apple>(apple)
    fetchFruit(shop) //编译器报错
}
```

报错原因：类型不匹配，fetchFruit函数要求传入 `FruitShop<Fruit>` 类型，而实际传入 `FruitShop<Apple>` 类型，导致类型不匹配。

#### 在Java中处理协变

虽然 Java 当中也有型变的概念，但是呢，Java 当中是没有声明处型变的。Java 里面只有使用处型变。

```java
class Fruit {}
class Apple extends Fruit {}

class FruitShop<T> {

    private T fruit;

    public FruitShop(T fruit) {
        this.fruit = fruit;
    }

    T getFruit() {
        return fruit;
    }
}

public class Test {
    public static void main(String[] args) {
        Apple apple = new Apple();
        FruitShop<Apple> shop = new FruitShop<Apple>(apple);
        fetchFruit(shop);
    }

    static void fetchFruit(FruitShop<? extends Fruit> shop) {
        Fruit fruit = shop.getFruit();
    }
}
```

#### 第一种做法：使用处协变

在 fetchFruit() 函数中的泛型参数前面添加 out 关键字。

这样代码就可以通过编译了，可以将 ``FruitShop<Apple>`` 看作为 `FruitShop<Fruit>` 的子类。

水果商店和水果的父子关系一致了，这称为”泛型的协变“。

```kotlin
//                          使用处协变
//                             ↓
fun fetchFruit(shop: FruitShop<out Fruit>) {
    val fruit = shop.getFruit()
}
```

#### 第二种做法：声明处协变

在 FruitShop 类的泛型参数前面添加 out 关键字

```kotlin
//             声明处协变
//                ↓
class FruitShop<out T>(private val fruit: T) {
    fun getFruit(): T {
        return fruit
    }
}
```



### 逆变

#### 逆变问题

```kotlin
open class Fruit

class Apple : Fruit()

class Controller<T> {
    fun cutFruit(fruit: T) {}
}

fun cutFruit(controller: Controller<Apple>) {
    val apple = Apple()
    controller.cutFruit(apple)
}

fun main() {
    val controller = Controller<Fruit>()
    cutFruit(controller) //编译器报错
}
```

报错原因：类型不匹配，cutFruit函数要求传入 `Controller<Apple>` 类型，而实际传入 `Controller<Fruit>` 类型，导致类型不匹配。

#### 在Java中处理逆变

```java
class Fruit {}

class Apple extends Fruit {}

class Controller<T> {
    void cutFruit(T fruit) {
    }
}

public class Test {
    public static void main(String[] args) {
        Controller<Fruit> controller = new Controller<Fruit>();
        cutFruit(controller);
    }

    static void cutFruit(Controller<? super Apple> controller) {
        Apple apple = new Apple();
        controller.cutFruit(apple);
    }
}
```

#### 第一种做法：使用处逆变

在 cutFruit() 函数的泛型参数前面添加 in 关键字。

这样代码就可以通过编译了，可以将 `Controller<Fruit>` 看作为 `Controller<Apple>` 的子类。

切水果师傅和水果的父子关系不一致了，这称为”泛型的逆变“。

```kotlin
//                                使用处逆变
//                                  ↓
fun cutFruit(controller: Controller<in Apple>) {
    val apple = Apple()
    controller.cutFruit(apple)
}
```

#### 第二种做法：声明处逆变

在 Controller 类的泛型参数前面添加 in关键字

```kotlin
//              声明处逆变
//                ↓
class Controller<in T> {
    fun cutFruit(fruit: T) {}
}
```



### 星投影

星投影指用“星号”作为泛型的实参，表示接收任意类型。

```kotlin
fun findShop(): FruitShop<*> {
    return FruitShop<Cat>(Cat())
}

fun main() {
    val shop = findShop()
    val fruit: Any? = shop.getFruit()
}
```



## 型变总结

Consumer in, Producer out ！大概意思：消费者 in，生产者 out。

- 协变情况：使用 out 关键字，是一种读取行为。泛型作为返回值时。
- 逆变情况：使用 in 关键字，是一种写入行为。泛型作为参数时。
- 特殊场景：同时作为参数和返回值的泛型参数，可以用`@UnsafeVariance`解决冲突。

**案例：**

```kotlin
//             声明处协变
//                ↓
class FruitShop<out T>(private val fruit: T) {
    fun getFruit(): T {
        return fruit
    }
}

//              声明处逆变
//                ↓
class Controller<in T> {
    fun cutFruit(fruit: T) {}
}
```

**Kotlin源码：**

```kotlin
//                          逆变
//                           ↓
public interface Comparable<in T> {
//                                   泛型作为参数
//                                       ↓
    public operator fun compareTo(other: T): Int
}
```
由于泛型是作为了 compareTo 方法的参数传入的，因此，对于 Comparable 的泛型 T，我们应该使用 in 来修饰，这就是逆变的实际应用。
```kotlin
//                        协变
//                         ↓
public interface Iterator<out T> {
//                         泛型作为返回值
//                              ↓    
    public operator fun next(): T
    
    public operator fun hasNext(): Boolean
}
```

由于泛型是作为 next 方法的返回值的，因此，对于 Iterator 的泛型 T，我们应该使用 out 来修饰，这就是协变的应用。


|      | Kotlin               | Java                     |      |
| ---- | -------------------- | ------------------------ | ---- |
| 协变 | `List<out TextView>` | List<? extends TextView> | 上限 |
| 逆变 | `List<in TextView>`  | List<? super TextView>   | 下限 |

### 数组拷贝

```kotlin
fun <T> copyIn(src: Array<T>, dest: Array<in T>) {
    if (dest.size < src.size) {
        throw IndexOutOfBoundsException()
    } else {
        src.forEachIndexed { index, value ->
            dest[index] = src[index]
        }
    }
}

fun <T> copyOut(src: Array<out T>, dest: Array<T>) {
    if (dest.size < src.size) {
        throw IndexOutOfBoundsException()
    } else {
        src.forEachIndexed { index, value ->
            dest[index] = src[index]
        }
    }
}
```



## 特殊情况

**同时存在out in，官方案例**

```kotlin
//                   协变    
//                    ↓      
public interface List<out E> : Collection<E> {
//                                泛型作为返回值
//                                       ↓    
    public operator fun get(index: Int): E
//                                           泛型作为参数
//                                                 ↓    
    override fun contains(element: @UnsafeVariance E): Boolean
//                                        泛型作为参数
//                                              ↓   
    public fun indexOf(element: @UnsafeVariance E): Int
}
```



## 获取泛型参数的类型

可以借助匿名内部类实现，泛型擦除并不是真的将全部的类型信息擦除，而是将类型信息存放在对于class的常量池中。

```kotlin
open class Controller<T> {
}

fun main() {
    val controller = object : Controller<Cat>() {}
    val superClass = controller.javaClass.genericSuperclass
    println(superClass) //com.example.lib_kt.Controller<com.example.lib_kt.Cat>
    val type = (superClass as ParameterizedType).actualTypeArguments[0]
    println(type) //class com.example.lib_kt.Cat
}
```



## 具体化类型参数 reified

在Java中泛型本质都是Object，而在Kotlin中可以通过关键字`reified`具体化类型参数

```kotlin
inline fun <reified T : Activity> Activity.startActivity(context: Context) {
    startActivity(Intent(context, T::class.java))
}

//使用：
startActivity<TwoActivity>(context)
```



