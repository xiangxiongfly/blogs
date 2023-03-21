[TOC]

# JavaScript 基础

## 概述

JavaScript，就是我们通常所说的JS。这是一种嵌入到HTML页面中的编程语言，由浏览器一边解释一边执行。

HTML用于控制网页的结构，CSS用于控制网页的外观，而JavaScript控制着网页的行为。



## JavaScript引入方式

在HTML中引入JavaScript一般有3种方式：

- 外部JavaScript
- 内部JavaScript
- 元素事件JavaScript

### 外部JavaScript

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <!--引入外部CSS-->
        <link rel="stylesheet" type="text/css" href="index.css"/>
        <!--方式一：在head中引入-->
        <script src=”index.js”></script>
    </head>
    <body>
        <!--方式二：在body中引入-->
        <script src="index.js"></script>
    </body>
</html>
```

### 内部JavaScript

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <!--方式一：在head中引入-->
        <script>
            //JS代码
        </script>
    </head>
    <body>
        <!--方式二：在body中引入-->
        <script>
            //JS代码
        </script>
    </body>
</html>
```

### 元素事件JavaScript

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<input type="button" value="按钮" onclick="alert('hello world')" />
	</body>
</html>
```



## 变量和常量

```
//变量
var a = 10;

//常量
var CONST = 1;
```



## 基本数据类型

在JavaScript中，基本数据类型有5种：

- 数字。
- 字符串。
- 布尔值。
- undefined。
- null。



### 类型转换

在JavaScript中，有2种类型转换：

- 隐式类型转换。
- 显式类型转换。

**字符串转数字：**

- Number()
- parseInt()
- parseFloat()

```
Number(10);    // 10
Number(010);   // 8，010是八进制的数据，转换成十进制是8
Number(0x10);  // 16，0x10是十六进制数据，转换成十进制是16
Number(true);  // 1
Number(false); // 0
Number(null);  // 0
Number(undeﬁned); // NaN
Number('');     // 0
Number('   ');  // 0

parseInt('0x12', 16);  // 18，先将将字符串"0x12"转换为十六进制数，得到的结果为1×16+2=18；
parseInt(0x12, 16);    // 24，由于传入的是十六进制数，所以会先转换成十进制数18，然后转换成字符串"18"，再将字符串"18"转换成十六进制数，得到的结果为1×16+8=24。
```

**数字转字符串：**

- toString()
- 空字符串拼接

### undefined & null区别

- null表示空对象，指变量没有分配内存空间。
- undefined表示变量未定义，通常有2种场景：
  1. 变量声明了但未赋值；
  2. 读取对象不存在的属性。
  3. 函数没有返回值。
  4. 函数参数没有传递值。
- 转为数值也不同，null转为0，undefined转为NaN。

```js
console.log(Number(null)); //0
console.log(Number(undefined)); //NaN
```

**案例**

```js
var a;
console.log(a); //undefined

var b = null;
console.log(b); //null

var obj = {
    name: "小明"
};
console.log(obj.age); //undefined

function fun() {}
var result = fun();
console.log(result); //undefined

function foo(param) {
    console.log(param); //undefined
}
foo();
```



### NaN

NaN（Not a Number，即不是一个数字）是一个数值类，Number类型数据中存在一个比较特殊的数值，它表示应该返回数值却并未返回数值的情况。

```
console.log(0 / 0); //NaN
```



### typeof

typeof运算符用于返回操作数的数据类型。

| 类型      | 结果        |
| --------- | ----------- |
| Undefined | "undefined" |
| Null      | "object"    |
| Boolean   | "boolean"   |
| Number    | "number"    |
| String    | "string"    |
| Symbol    | "symbol"    |
| 函数对象  | "function"  |
| 其他对象  | "object"    |

```javascript
console.log(typeof undefined); //undefined
console.log(typeof null); //object
console.log(typeof true); //boolean
console.log(typeof 10); //number
console.log(typeof "hello"); //string

function func() {}
console.log(typeof func); //function

let user = {};
console.log(typeof user); //object
```



### isNaN() 和 Number.isNaN()

isNaN()函数在判断是否为NaN时，需要先进行数据类型转换，只有在无法转换为数字时才会返回“true”；Number.isNaN()函数在判断是否为NaN时，只需要判断传入的值是否为NaN，并不会进行数据类型转换。

```javascript
isNaN(NaN);       // true
isNaN(undeﬁned);  // true
isNaN({});        // true

isNaN(true);      // false，Number(true)会转换成数字1
isNaN(null);      // false，Number(null)会转换成数字0
isNaN(1);         // false
isNaN('');        // false，Number('')会转换为成数字0
isNaN("1");            // false，字符串"1"可以转换成数字1
isNaN("JavaScript");   // true，字符串"JavaScript"无法转换成数字
// Date类型
isNaN(new Date());     // false
isNaN(new Date().toString());  // true
```

```javascript
Number.isNaN(NaN);        // true
Number.isNaN(undeﬁned);   // false
Number.isNaN(null);       // false
Number.isNaN(true);       // false
Number.isNaN('');         // false
Number.isNaN(123);        // false
```



## 引用数据类型与基本数据类型区别

基本数据类型包括：stirng、number、boolean、null、undefined、symbol。

引用数据类型包括：Object类型、Array类型、Date类型、RegExp类型、Math类型、Function类型，和基本数据类型的包装类型如Number类型、String类型、Boolean类型等。

一、存储分配不同：

- 基本数据类型存储在栈中。
- 引用数据类型存储在堆中。

二、访问机制不同：

- 基本数据类型是通过值传递的。
- 引用数据类型是通过引用传递的。

三、复制操作不同：

- 基本数据类型是直接复制值。
- 引用数据类型是复制引用地址。



## 运算符

### 等于运算符

JavaScript中相等的比较分为双等于（`==`）比较和三等于（`===`）比较：

- 双等于运算符在比较时，会将两端的变量进行隐式类型转换，然后比较值的大小。
- 三等于运算符在比较时，会优先比较数据类型，数据类型相同才去判断值的大小，如果类型不同则直接返回“false”。

```javascript
console.log(1 == "1"); //true
console.log(1 === "1"); //false

console.log(1 == new Number(1)); //true
console.log(1 === new Number(1)); //false

console.log("a" == new String("a")); //true
console.log("a" === new String("a")); //false

console.log(null == undefined); //true
console.log(null === undefined); //false
```

### 算术运算符

![在这里插入图片描述](https://img-blog.csdnimg.cn/7e3b20f643304dcba6420237e4446465.png)

### 赋值运算符

![在这里插入图片描述](https://img-blog.csdnimg.cn/935f507828474f19a44ef1ab18f657b3.png)

### 比较运算符

![在这里插入图片描述](https://img-blog.csdnimg.cn/4485babdd76d42b78f49b165bf358fc8.png)

### 逻辑运算符

![在这里插入图片描述](https://img-blog.csdnimg.cn/0d28f9631e2944b7a4d511dd744d4693.png)



## 流程控制

**if**

```
单向选择：if...。
双向选择：if...else...。
多向选择：if...else if...else...。
```

**switch**

```
switch（判断值）{
    case 取值1:
         语块1;break;
    case 取值2:
         语块2;break;
      ……
      case 取值n:
            语块n;break;
      default:
            语句块n+1;
}
```

**while**

```
while（条件）{
    //当条件为true时，循环执行
}
```

**do while**

```
do {
     ……
}while（条件）;
```

**for**

```
for（var i=0;i<5;i++）{
	
}
```



## 判空方法

在JavaScript中判断一个变量是否为空时，我们往往会想到对变量取反，然后判断是否为true。

```
if(!x){}
```



### 判断null或undefined

```javascript
function isNull(obj) {
    return obj == null
}

function isUndefined(obj) {
    return obj == undefined;
}
```



### 判断空对象

```javascript
function isEmptyObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

var o1 = {};
var o2 = {
    name: "Tom"
};
console.log(isEmptyObject(o1)); //true
console.log(isEmptyObject(o2)); //false
```



### 判断空数组

```javascript
function isEmptyArray(arr) {
    return arr instanceof Array && arr.length === 0;
}

var o1 = [];
var o2 = [1, 2, 3];
console.log(isEmptyArray(o1)); //true
console.log(isEmptyArray(o2)); //false
```



### 判断空字符串

```javascript
function isEmptyString(str) {
    return str == "" || str.trim().length == 0;
}

var o1 = ""
var o2 = "abc";
console.log(isEmptyString(o1)); //true
console.log(isEmptyString(o2)); //false
```



### 判断0或NaN

```javascript
function is0OrNaN(n) {
    return !(Number(n) && n) == true;
}

var o1 = 1
var o2 = 0;
var o3 = NaN;
console.log(is0OrNaN(o1)); //false
console.log(is0OrNaN(o2)); //true
console.log(is0OrNaN(o3)); //true
```



