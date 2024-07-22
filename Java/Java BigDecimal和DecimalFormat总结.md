[TOC]

# Java BigDecimal和DecimalFormat总结

## 概述

`BigDecimal`是 Java 中用于高精度十进制数运算的类。它提供了对超过 16 位有效位的数进行精确运算的能力，解决了浮点数运算中可能出现的精度丢失问题。



## float和double的问题

### 问题一

```java
float a = 1.0F;
float b = 0.9F;
System.out.println(a - b); 
// 0.100000024
```

**分析：**

执行结果是0.100000024而不是0.1，这是因为计算机的资源是有限的，所以没办法用二进制精确到表示0.1，只能用近似值来表示，也就是在有限的精度下，最大化接近0.1的二进制数，这样也就出现了精度缺少的问题。

### 问题二

```java
if (0.1 > 0.1F) {
    System.out.println("0.1 > 0.1F");
} else if (0.1F > 0.1) {
    System.out.println("0.1F > 0.1");
} else {
    System.out.println("0.1F == 0.1");
}
// 0.1F > 0.1
```

**分析：**

`0.1f`（单精度浮点数）和 `0.1`（默认是双精度浮点数）在表示上存在精度差异。

浮点数在计算机中的表示并不是精确的，存在一定的误差。单精度浮点数的精度相对较低，在表示一些小数时可能会产生更大的误差。

而 `0.1` 作为双精度浮点数，其精度相对较高，与实际的 `0.1` 更接近一些。

所以，可能在某些比较中，会出现看起来 `0.1f` 大于 `0.1` 的情况，但这实际上是由于浮点数表示的不精确性导致的。这种情况提醒我们在处理浮点数比较和运算时要特别注意精度问题。



## BigDecimal

### 创建BigDecimal对象

可以使用 new BigDecimal()  或 BigDecimal.value() 的这两种方式创建 BigDecimal 对象。

```java
// 方式一
BigDecimal a = new BigDecimal(0.1);
System.out.println(a); //0.1000000000000000055511151231257827021181583404541015625

// 方式二
BigDecimal b = BigDecimal.valueOf(0.1);
System.out.println(b); //0.1
```

**问题分析：**

使用 new BigDecimal()  仍然会出现精度问题，而使用 BigDecimal.valueOf() 则不会出现精度问题。

### BigDecimal.valueOf()源码分析

```java
public static BigDecimal valueOf(double val) {
    return new BigDecimal(Double.toString(val));
}
```

`valueOf()`方法的内部是先调用`toString()`方法，将浮点类型转为字符串，然后再使用构造方法创建对象。因此在使用构造方法创建对象时，应优先传递字符串类型。

将参数改为字符串后没有了精度问题：

```java
BigDecimal c = new BigDecimal("0.1");
System.out.println(c); //0.1
```

### equals() 和 compareTo()

比较2个BigDecimal对象，可以使用 equals() 和 compareTo()。

```java
BigDecimal a = new BigDecimal("0.01");
BigDecimal b = new BigDecimal("0.010");
System.out.println(a.equals(b)); // false
System.out.println(a.compareTo(b)); // 0
```

**问题分析：**

equals() 方法：

- 它用于比较两个 `BigDecimal` 对象的值是否完全相等，包括数值和精度。
- 不仅要求数值相同，而且要求具有完全相同的小数位数和所有相应位上的数字都相同。

compareTo() 方法：

- 主要用于比较两个 `BigDecimal` 对象的大小关系。
- 返回值为 `-1`（小于）、`0`（等于）、`1`（大于）。
- 只关注数值的大小关系，而不严格要求精度完全一致。

因此，如果只比较2个对象的值的大小，则优先使用 compareTo()；如果严格限制精度的比较，则使用 equals()。

### 计算

#### 加法

使用 `add(BigDecimal augend)` 方法执行加法。

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("20.3");
BigDecimal sum = a.add(b);
System.out.println(sum); // 输出 30.8
```

#### 减法

使用 `subtract(BigDecimal subtrahend)` 方法执行减法。

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("20.3");
BigDecimal difference = a.subtract(b);
System.out.println(difference); // 输出 -9.8
```

#### 乘法

使用 `multiply(BigDecimal multiplicand)` 方法执行乘法。

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("20.3");
BigDecimal product = a.multiply(b);
System.out.println(product); // 输出 213.15
```

#### 除法

使用 `divide(BigDecimal divisor, int scale, RoundingMode roundingMode)` 方法执行除法。`scale` 参数表示结果中小数点后的位数，`roundingMode` 参数用于指定舍入模式。

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("20.3");
BigDecimal quotient = a.divide(b, 2, RoundingMode.HALF_UP);
System.out.println(quotient); // 输出 0.52
```

#### 取模

使用 `remainder(BigDecimal divisor)` 方法执行取模运算。

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("2");
BigDecimal remainder = a.remainder(b);
System.out.println(remainder); // 输出 0.5
```

### 设置精度和舍入模式

在使用BigDecimal进行运算时，一定要设置精度和舍入模式，否则会出现以下问题：

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("3");
System.out.println(a.divide(b));
```

报异常：

```
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
	at java.base/java.math.BigDecimal.divide(BigDecimal.java:1722)
```

**问题分析：**

这是因为在做除法运算时，遇到一个无限小数0.3333.....，不是一个精确到数字，因此抛出 ArithmeticException 异常。

### 舍入模式介绍

`BigDecimal` 支持以下8种舍入模式：

1. **`RoundingMode.UP`**：远离零的方向舍入。无论舍弃的数字是什么，都会对前一位进行进位。
2. **`RoundingMode.DOWN`**：向零的方向舍入。简单地丢弃多余的数字，不进行任何进位。
3. **`RoundingMode.CEILING`**：向正无穷方向舍入。对于正数，行为类似于 `UP`；对于负数，行为类似于 `DOWN`。
4. **`RoundingMode.FLOOR`**：向负无穷方向舍入。对于正数，行为类似于 `DOWN`；对于负数，行为类似于 `UP`。
5. **`RoundingMode.HALF_UP`**：向最接近的数字舍入，如果两个相邻的数字一样近，则向上舍入（即向更远离零的方向）。
6. **`RoundingMode.HALF_DOWN`**：向最接近的数字舍入，如果两个相邻的数字一样近，则向下舍入（即向更接近零的方向）。
7. **`RoundingMode.HALF_EVEN`**：向最接近的数字舍入，如果两个相邻的数字一样近，则向偶数舍入，也被称为银行家舍入。
8. **`RoundingMode.UNNECESSARY`**：不允许舍入，如果结果需要舍入，则抛出 ArithmeticException 异常。

| 数字 | UP   | DOWN | CEILING | FLOOR | HALF_UP | HALF_DOWN | HALF_EVEN | UNNECESSARY               |
| ---- | ---- | ---- | ------- | ----- | ------- | --------- | --------- | ------------------------- |
| 5.5  | 6    | 5    | 6       | 5     | 6       | 5         | 6         | throw ArithmeticException |
| 2.5  | 3    | 2    | 3       | 2     | 3       | 2         | 2         | throw ArithmeticException |
| 1.6  | 2    | 1    | 2       | 1     | 2       | 2         | 2         | throw ArithmeticException |
| 1.1  | 2    | 1    | 2       | 1     | 1       | 1         | 1         | throw ArithmeticException |
| 1.0  | 1    | 1    | 1       | 1     | 1       | 1         | 1         | 1                         |
| -1.0 | -1   | -1   | -1      | -1    | -1      | -1        | -1        | -1                        |
| -1.1 | -2   | -1   | -1      | -2    | -1      | -1        | -4        | throw ArithmeticException |
| -1.6 | -2   | -1   | -1      | -2    | -2      | -2        | -2        | throw ArithmeticException |
| -2.5 | -3   | -2   | -2      | -3    | -3      | -2        | -2        | throw ArithmeticException |
| -5.5 | -6   | -5   | -5      | -6    | -6      | -5        | -6        | throw ArithmeticException |

加入精度和舍入模式后除法运算就正常了。

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("3");
System.out.println(a.divide(b, 2, RoundingMode.HALF_UP)); //0.33
```

### BigDecimal转字符串

BigDecimal对象转字符串有3种方法：

- toPlainString()：不适用科学计数法，通常使用最多。
- toString()：使用科学计数法。
- toEngineeringString()：使用工程计数法。

![在这里插入图片描述](https://img-blog.csdnimg.cn/872b9b7872c34eb8a0f7edd8e3b166e8.png)

```java
BigDecimal a = BigDecimal.valueOf(100000000000000000000.11);
System.out.println(a.toPlainString()); //100000000000000000000
System.out.println(a.toString()); //1.0E+20
System.out.println(a.toEngineeringString()); //100E+18
```



## DecimalFormat 格式化

| 占位符 | 说明                       |
| ------ | -------------------------- |
| 0      | 数字占位符，位数不够时补0  |
| #      | 数字占位符，位数不够时省略 |
| .      | 小数点占位符               |

```java
DecimalFormat format1 = new DecimalFormat("##.##");
System.out.println(format1.format(123.456)); //123.46
System.out.println(format1.format(3.4)); //3.4

DecimalFormat format2 = new DecimalFormat("00.00");
System.out.println(format2.format(123.456)); //123.46
System.out.println(format2.format(3.4)); //03.40
```



## 总结

1. 优先使用 BigDecimal.valueOf() 方式创建对象，其次如果使用 new BigDecimal() 方式创建对象，一定要传入字符串。
2. BigDecimal对象比较值大小时推荐使用`compareTo()`方法。
3. 使用BigDecimal运算时一定要设置精度和舍入模式。
4. BigDecimal转字符串推荐使用`toPlainString()`方法。

