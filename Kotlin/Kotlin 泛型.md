[TOC]

# Kotlin 泛型

## 概述

- 泛型是对程序的一种抽象，可以借助泛型对代码的复用。

- 支持类型检查，能在编译期检查出问题。

- 还可以在定义泛型时，设置边界限制。

  

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



### Kotlin泛型函数

在Kotlin中函数式一等公民。

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



### Kotlin泛型边界

- 在Java中可以通过`? extends Base`指定上界是`Base`类型，表示前者是后者的子类。
- 在Kotlin中可以通过`T : Base`指定上界是`Base`类型。

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



### Kotlin限制多个类型

可以通过`where`关键字实现

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

### 泛型不变性

虽然`Cat`是`Animal`的子类，但是`MutableList<Cat>`与`Mutable<Animal>`不存在任何继承关系，无法互相替代，没有任何联系，这就是泛型的不变性。

虽然Java也有型变的概念，但是Java是没有声明处型变的，只有使用处型变。

```kotlin
fun foo(animalList: MutableList<Animal>) {
    animalList.add(Cat())
    val animal: Animal = animalList[0]
}

fun main() {
    val catList = mutableListOf<Cat>(Cat())
    //foo(catList) //编译器报错
}
```

```kotlin
fun foo(catList: MutableList<Cat>) {
    catList.add(Cat())
    val cat = catList[0]
}

fun main() {
    val animalList = mutableListOf<Animal>(Animal())
    //foo(animalList) //编译器报错
}
```



### 协变

- 协变表示父子关系和原来一致，是一种读取行为。
- `Cat`类和`Dog`类是`Animal`的子类，但是`List<Cat>`和`List<Dog>`不是`List<Animal>`的子类，需要使用`? extends Animal`将`List<Cat>`和`List<Dog>`变成`List<Animal>`的子类。这种泛型类型是父子关系的被称为协变。
- 说明：泛型`<? extends Animal>`表示上界是Animal类型，表示传入的泛型具体类型只能是Animal及其子类类型。
  - 泛型具体类型可以是Animal类型，也可以是Cat类型或Dog类型，所以取出的元素一定是`Animal`类型；
  - 但是写入时无法确定元素具体类型是什么，可能是Cat也有可能是Dog，可能将Cat元素写入Dog集合中，所以不能取出元素。

- 协变只能读取元素，不能写入元素。

#### 在Java中处理协变

```java
public class Demo {
    public static void main(String[] args) {
        List<Animal> animalList = new ArrayList<Animal>() {
            {
                add(new Animal());
                add(new Cat());
                add(new Dog());
            }
        };
        foo(animalList);

        List<Cat> catList = new ArrayList<Cat>() {
            {
                add(new Cat());
            }
        };
        foo(catList);

        List<Dog> dogList = new ArrayList<Dog>() {
            {
                add(new Dog());
            }
        };
        foo(dogList);
    }

    public static void foo(List<? extends Animal> animalList) {
        /*
        协变只能获取，不能写入
        所以编译器会报错：
        animalList.add(new Animal());
        animalList.add(new Object());
        animalList.add(new Dog());
        animalList.add(new Cat());
         */
        for (Animal o : animalList) {
            o.eat();
        }
    }
}
```



#### 使用处协变

修改`foo()`函数的泛型参数，在Animal的前面添加`out`关键字，其原理与Java基本一致。

```kotlin
//                      使用处协变
//                         ↓
fun foo(list: MutableList<out Animal>) {
    for (o in list) {
        o.eat()
    }
}

fun main() {
    val animalLIst = mutableListOf<Animal>(Animal(), Cat(), Dog())
    foo(animalLIst)

    val catList = mutableListOf<Cat>(Cat())
    foo(catList)

    val dogList = mutableListOf<Dog>(Dog())
    foo(dogList)
}
```



#### 声明处协变

在Controller类的泛型T的前面添加`out`关键字。

```kotlin
//			声明处协变
//				↓
class Controller<out T : Animal>(private var animal: T) {
    fun getAnimal(): T {
        return animal
    }
}

fun foo(controller: Controller<Animal>) {
    val animal = controller.getAnimal()
    animal.eat()
}

fun main() {
    val cat = Cat()
    val controller = Controller<Cat>(cat)
    foo(controller)
}
```



### 逆变

- 逆变表示父子关系颠倒了，是一种写入行为。
- `Cat`类是`Animal`类的子类，`List<Animal>`也不是`List<Cat>`的子类，在Java中可以使用`? super Cat`将`List<Animal>`变成`List<Cat>`的子类，这种泛型类型的颠倒关系就是逆变。
- 说明：`<? super Cat>`表示下界是Cat类型，表示传入的泛型具体类型只能是Cat及其父类。
  - 传入的泛型具体类型可以是Cat类型，也可以是Animal的类型，只能往里存数据，但不能存Animal类型的元素；
  - 取出来的元素都是Object类型，无法确定它的上界类型，所以无法取出元素确定类型。

- 逆变只能写入元素，不能读取元素。

#### 在Java中处理逆变

```java
public class Demo {
    public static void main(String[] args) {
        List<Animal> animalList = new ArrayList<Animal>() {
            {
                add(new Animal());
                add(new Cat());
                add(new Dog());
            }
        };
        foo(animalList);

        List<Cat> catList = new ArrayList<Cat>() {
            {
                add(new Cat());
            }
        };
        foo(catList);
    }

    public static void foo(List<? super Cat> catList) {
        /*
        逆变变只能写入Cat及其子类类型，不能读取
        所以编译器会报错
        Animal cat = animalList.get(0);
        catList.add(new Animal());
         */
        catList.add(new Cat());
        catList.add(new Tiger());
        for (Object o : catList) {
            System.out.println(o.toString());
        }
    }
}
```



#### 使用处逆变

修改`foo()`函数的泛型参数，在Cat的前面添加`in`关键字。

```kotlin
//						使用处逆变
//						   ↓
fun foo(catList: MutableList<in Cat>) {
    for (o in catList) {
        println(o.toString())
    }
}

fun main() {
    val animalList = mutableListOf<Animal>(Animal(), Cat(), Dog())
    foo(animalList)

    val catList = mutableListOf<Cat>(Cat())
    foo(catList)
}
```



#### 声明处逆变

在`Controller类`的泛型T的前面添加`in`关键字。

```kotlin
//			 声明处逆变
//				↓
class Controller<in T : Animal>() {
    fun eat(t: T) {
        t.eat()
    }
}

fun foo(controller: Controller<Cat>) {
    val cat = Cat()
    controller.eat(cat)
}

fun main() {
    val controller = Controller<Animal>()
    foo(controller)
}
```



### 特殊情况

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



### 协变逆变总结

- Consumer in, Producer out ！消费者 in，生产者 out。
- **写入in，读取out**
  - 逆变情况：是一种写入行为。泛型作为参数时，使用`in`关键字。
  - 协变情况：是一种读取行为。泛型作为返回值时，使用`out`关键字。
- 特殊场景：同时作为参数和返回值的泛型参数，可以用`@UnsafeVariance`解决冲突。

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



## 星号泛型

星号泛型表示任意类型。

```kotlin
class Controller<out T : Animal>(private var animal: T) {
    fun getAnimal(): T {
        return animal
    }
}

fun findAnimal(type: Int): Controller<*> {
    return if (type == 1) {
        Controller<Cat>(Cat())
    } else {
        Controller<Dog>(Dog())
    }
}

fun main() {
    val controller = findAnimal(1)
    val animal: Animal = controller.getAnimal()
    println(animal)
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



