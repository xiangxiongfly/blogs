[TOC]

# Java BigDecimal总结

## 概述

BigDecimal类在Java的`java.math`包中，可以处理超过16位有效位数的精确运算，而双精度浮点类型double只能处理16位有效数。



## float 和 double的问题

```java
float a = 1.0F;
float b = 0.9F;
System.out.println(a - b); //0.100000024
```

**问题分析：**

执行结果是0.100000024而不是0.1，这是因为计算机的资源是有限的，所以没办法用二进制精确到表示0.1，只能用近似值来表示，也就是在有限的精度下，最大化接近0.1的二进制数，这样也就出现了精度缺少的问题。



## 创建BigDecimal对象

可以使用`new BigDecimal() `或`BigDecimal.value()`的这2种方式创建BigDecimal对象。

```java
BigDecimal a = new BigDecimal(0.1);
BigDecimal b = BigDecimal.valueOf(0.1);
System.out.println(a); //0.1000000000000000055511151231257827021181583404541015625
System.out.println(b); //0.1
```

**问题分析：**

使用`new BigDecimal() `仍然会出现精度问题，而使用`BigDecimal.valueOf()`则不会出现精度问题。

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



## equals() 和 compareTo()

比较2个BigDecimal对象，可以使用`equals()`和`compareTo()`。

```java
BigDecimal a = new BigDecimal("0.01");
BigDecimal b = new BigDecimal("0.010");
System.out.println(a.equals(b)); //false
System.out.println(a.compareTo(b)); //0
```

**问题分析：**

`equals()`方法不仅比较2个对象的值是否相等，还比较精度是否相同。

`compareTo()`方法仅比较值的大小，返回值为：

- -1：小于
- 0：等于
- 1：大于

因此，如果只比较2个对象的值的大小，则使用`compareTo()`；如果严格限制精度的比较，则使用`equals()`；



## BigDecimal设置精度和舍入模式

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

这是因为在做除法运算时，遇到一个无限小数0.3333.....，不是一个精确到数字，因此抛出ArithmeticException异常。

### 舍入模式介绍

入模式定义在RoundingMode枚举类中，共有8种：

- RoundingMode.UP：舍入远离零的舍入模式。在丢弃非零部分之前始终增加数字(始终对非零舍弃部分前面的数字加1)。注意，此舍入模式始终不会减少计算值的大小。
- RoundingMode.DOWN：接近零的舍入模式。在丢弃某部分之前始终不增加数字(从不对舍弃部分前面的数字加1，即截短)。注意，此舍入模式始终不会增加计算值的大小。
- RoundingMode.CEILING：接近正无穷大的舍入模式。如果 BigDecimal 为正，则舍入行为与 ROUNDUP 相同;如果为负，则舍入行为与 ROUNDDOWN 相同。注意，此舍入模式始终不会减少计算值。
- RoundingMode.FLOOR：接近负无穷大的舍入模式。如果 BigDecimal 为正，则舍入行为与 ROUNDDOWN 相同;如果为负，则舍入行为与 ROUNDUP 相同。注意，此舍入模式始终不会增加计算值。
- RoundingMode.HALF_UP：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。如果舍弃部分 >= 0.5，则舍入行为与 ROUND_UP 相同;否则舍入行为与 ROUND_DOWN 相同。注意，这是我们在小学时学过的舍入模式(四舍五入)。
- RoundingMode.HALF_DOWN：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为上舍入的舍入模式。如果舍弃部分 > 0.5，则舍入行为与 ROUND_UP 相同;否则舍入行为与 ROUND_DOWN 相同(五舍六入)。
- RoundingMode.HALF_EVEN：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则向相邻的偶数舍入。如果舍弃部分左边的数字为奇数，则舍入行为与 ROUNDHALFUP 相同;如果为偶数，则舍入行为与 ROUNDHALF_DOWN 相同。注意，在重复进行一系列计算时，此舍入模式可以将累加错误减到最小。此舍入模式也称为“银行家舍入法”，主要在美国使用。四舍六入，五分两种情况。如果前一位为奇数，则入位，否则舍去。以下例子为保留小数点1位，那么这种舍入方式下的结果。1.15 ==> 1.2 ,1.25 ==> 1.2
- RoundingMode.UNNECESSARY：断言请求的操作具有精确的结果，因此不需要舍入。如果对获得精确结果的操作指定此舍入模式，则抛出ArithmeticException。

常用的四舍五入也就是`RoundingMode.HALF_UP`。

加入精度和舍入模式后除法运算就正常了。

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("3");
System.out.println(a.divide(b, 2, RoundingMode.HALF_UP)); //0.33
```



## BigDecimal转字符串

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

1. 如果使用`new BigDecimal()`方式创建对象，一定要传入字符串；否则使用`BigDecimal.valueOf()`方式创建对象。
2. BigDecimal对象比较值大小时推荐使用`compareTo()`方法。
3. 使用BigDecimal运算时一定要设置精度和舍入模式。
4. BigDecimal转字符串推荐使用`toPlainString()`方法。



