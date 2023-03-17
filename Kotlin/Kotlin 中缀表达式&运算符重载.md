[TOC]

# Kotlin 中缀表达式 & 运算符重载

## 中缀表达式

中缀表达式让代码变得更加简洁直观。

- `infix`关键字表示中缀表达式
- 中缀函数必须是某个类型的扩展函数或成员方法
- 中缀函数只能有一个参数

```kotlin
class Dog(val name: String) {
    infix fun eat(food: String) {
        println("$name 吃 $food")
    }
}
```

```kotlin
val dog = Dog("旺财");
dog eat "骨头"
dog.eat("肉")
```



## 运算符重载

### 表达式与实际函数对照

| 表达式                                   | 实际调用函数   |
| ---------------------------------------- | -------------- |
| a + b                                    | a.plus(b)      |
| a - b                                    | a.minus(b)     |
| a * b                                    | a.times(b)     |
| a / b                                    | a.div(b)       |
| a % b                                    | a.rem(b)       |
| a++                                      | a.inc()        |
| a--                                      | a.dec()        |
| +a                                       | a.unaryPlus()  |
| -a                                       | a.unaryMinus() |
| !a                                       | a.not()        |
| a == b                                   | a.equals(b)    |
| a > b<br />a < b<br />a >= b<br />a <= b | a.compareTo(b) |
| a..b                                     | a.rangTo(b)    |
| a[b]                                     | a.get(b)       |
| a[b] = c                                 | a.set(b,c)     |
| a in b                                   | a.contains(b)  |



### 案例

```kotlin
class Money(val value: Int) {
    operator fun plus(money: Money): Money {
        val sum = value + money.value
        return Money(sum)
    }

    operator fun minus(money: Money): Money {
        val ret = value - money.value
        return Money(ret)
    }

    operator fun unaryPlus(): Money {
        return Money(Math.abs(value))
    }
}

fun main() {
    val a = Money(10)
    val b = Money(20)

    val sum = a + b
    println(sum.value) //30

    val ret = a - b
    println(ret.value) //-10

    val d = Money(-100)
    val ret2 = +d
    println(ret2.value) //100
}
```