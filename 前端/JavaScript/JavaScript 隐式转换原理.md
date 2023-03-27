[toc]

# JavaScript 隐式转换原理

## 原理

JavaScript 中的隐式数据转换是指在表达式中使用不同类型的值时，JavaScript 引擎自动将其中一个或多个值转换为另一种类型。

在JavaScript中，ToPrimitive方法是一个抽象操作，每个值隐含的自带的方法，用于将值（基本数据类型和引用类型）转换为其基本数据类型值。

- 如果值为基本类型，则直接返回值本身。
- 如果值为引用类型则会自动调用ToPrimitive方法。

核心方法：

- valueOf()：返回对象的原始值。
- toString()：对象的字符串表示。

ToPrimitive方法的行为取决于要转换的值和所需的原始类型：

- 值转换为number类型：
  1. 先尝试调用valueOf方法，如果返回值为基本数据类型则返回，否则下一步。
  2. 再尝试调用toString方法，如果返回值为基本数据类型则返回，否则下一步
  3. 抛出异常。
- 转换为string类型：
  1. 先首先尝试调用toString方法，如果返回值为基本数据类型则返回，否则下一步。
  2. 再尝试调用valueOf方法，如果返回值为基本数据类型则返回，否则下一步。
  3. 抛出异常。



## 隐式转换规则

以下是JavaScript中常见的隐式转换规则：

1. 字符串和数字之间的隐式转换：当一个字符串和一个数字进行运算时，JavaScript会将字符串自动转换为数字。
2. 布尔值和其他类型之间的隐式转换：当一个布尔值和其他类型进行运算时，JavaScript会将布尔值自动转换为数字（true为1，false为0）。
3. 对象和原始类型之间的隐式转换：当一个对象和一个原始类型进行运算时，JavaScript会将对象自动转换为原始类型。



## 案例

### + 运算符至少一个string类型

当使用`+`运算符两边至少一个string类型时，两边的操作数都会隐式转为字符串。

```js
console.log(1 + "23"); //123
console.log(1 + false); //1
console.log("1" + false); //1false
console.log(true + false); //1
```



### + - * / 都会转为数字

```js
console.log(25 - "23"); //2
console.log(1 * false); //0
console.log(1 / "aa"); //NaN
```



### == 双等于

```js
console.log(3 == true); //true为转为数值1，因此结果为false
console.log("0" == false); //“0”会转为数值0，false转为数值0，因此结果为true
console.log("0" == 0); //“0”转为数值0，因此结果为true
```



### < > 比较顺序

```js
console.log("c" > "b"); //true
console.log("de" > "fg"); //false

// 其他情况转数字比较
console.log("12" < 13); //true
console.log(false < -1); //false
```



### 数组、对象

**对象类型转string类型**

```js
var obj = {
    toString() {
        console.log("toString");
        return this
    },
    valueOf() {
        console.log("valueOf");
        return this
    }
};
console.log(String(obj));
// toString
// valueOf
```

说明：对象类型转string类型，会先尝试调用`toString()`方法，再尝试调用`valueOf()`方法。

**对象类型转number类型**

```js
console.log(Number(obj));
// valueOf
// toString
```

说明：对象类型转number类型，会先尝试调用`valueOf()`方法，再尝试调用`toString()`方法。

**等价于以下步骤：**

```js
var obj = {};

//第一步：调用toString()方法返回字符串
var str = obj.toString();

//第二步：调用valueOf()方法获取值
var value = str.valueOf();

//第三步：通过Number构造函数转数值类型
var num = Number(value);
```

