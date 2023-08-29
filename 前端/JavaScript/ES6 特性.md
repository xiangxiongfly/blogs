[TOC]

# ES6 特性

## 概述

- ES与JS关系：
  - JavaScript（浏览器端）= ECMAScript（语法 API）+ DOM +BOM
- ES6兼容性：
  - 主流浏览器的最新版本基本都支持ES6规范
  - IE等老版本浏览，可以通过`Babel`转码兼容



## var & let & const

在ES6之前，只有全局作用域和函数作用域，在使用var变量时会出现变量提升的问题。

在ES6中新增了块级作用域来避免这个问题的出现。

**var & let & count区别：**

|              | var                                               | let        | const          |
| ------------ | ------------------------------------------------- | ---------- | -------------- |
| 作用域       | 函数作用域或全局作用域                            | 块级作用域 | 块级作用域     |
| 变量提升     | 存在变量提升                                      | 不存在     | 不存在         |
| 变量重复声明 | 可以重复声明                                      | 不可以     | 不可以         |
| 全局对象属性 | 在全局作用域下，var声明的变量会称为全局对象的属性 | 不会       | 不会           |
| 初始值设置   | 可以不用                                          | 可以不用   | 必须设置初始值 |
| 重新赋值     | 可以                                              | 可以       | 不可以         |

let声明的变量更加安全可空，避免了变量提升和作用域混淆的问题。

[变量提升和函数提升](https://blog.csdn.net/qq_14876133/article/details/128701606)

[JavaScript var & let区别](https://blog.csdn.net/qq_14876133/article/details/129884254)



## 字符串模版

在ES6中，对于字符串的扩展增加了模板字符串的语法，可以轻松解决两个问题：

- 模板字符串使用反引号（``）括起来，它可以当作普通的字符串使用，也可以用来定义多行字符串。通过模板字符串的语法输出的字符串包含了缩进和换行符。
- 支持在字符串中使用`${}`嵌入变量。

### 多行字符串

```javascript
let str = `hello
			world
			javascript`;
console.log(str);
// hello
// 			world
// 			javascript
```

### 嵌入变量

```javascript
let user = {
    name: "Tom",
    age: 18,
    sex: "男"
}
console.log(`名字：${user.name} 年龄：${user.age} 性别：${user.sex}`); //名字：Tom 年龄：18 性别：男
```



## 解构操作

解构可以将值从数组或者对象中提取出来，并赋值到不同的变量中。

### 字符串解构

```js
const [a, b, , , c] = "hello";
console.log(a, b, c); //h e o
```

```javascript
const {
    0: a,
    3: b
} = "hello";
console.log(a, b); //h l
```

### 数组解构

```js
//一般情况
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); //1 2 3
```

```js
//忽略值
const [a, , , , c] = [1, 2, 3, 4, 5];
console.log(a, c); //1 5
```

```js
//默认值
//默认值生效的条件是对应的属性值严格等于undefined。
const [a = 1, b = 2, c = 3] = [undefined, undefined, ];
console.log(a, b, c); //1 2 3
```

```js
//变量交换
let a = 1;
let b = 2;
[b, a] = [a, b];
console.log(a, b); //2 1
```

```js
//嵌套数组
let [a, b, [c]] = [1, [2, 3], [4, 5, 6]];
console.log(a); //1
console.log(b); //[2,3]
console.log(c); //4
```

### 对象解构

在对象中，属性是没有顺序的，这就要求右侧解构对象的属性名和左侧定义对象的变量名必须相同，这样才可以进行解构。

```js
//一般情况
const user = {
    name: "Tom",
    age: 18,
    sex: "man"
};
const {age, name, sex} = user;
console.log(name, age, sex); //Tom 18 man	
```

```js
//默认值，默认值生效的条件是对应的属性值严格等于undefined。
const {a, b = 1, c = true} = {a: "xiaoming", b: null, c: undefined};
console.log(a); //xiaoming
console.log(b); //null
console.log(c); //true
```

```js
//嵌套对象
let user = {
    name: "小明",
    age: 18,
    address: {
        province: "湖北省",
        city: "武汉市"
    }
};
let {
    name,
    age,
    address: {
        province,
        city
    }
} = user;
console.log(name); //小明
console.log(age); //18
console.log(province); //湖北省
console.log(city); //武汉市
```



## ... 扩展运算符

扩展运算符用3个点表示（...），可以将字符串、数组或类数组、对象转转换为值序列。

### 字符串

```javascript
const str = "hello";
console.log(...str); //h e l l o
```

### 数组

```javascript
//展开数组
let arr = [1, 2, 3, 4];
console.log(...arr); //1 2 3 4

//浅拷贝数组
let newArr = [...arr];
console.log(newArr); //[1, 2, 3, 4]

//合并数组
const a = [1, 2, 3];
const b = [4, 5];
const newArr = [...a, ...b];
console.log(newArr); //[1, 2, 3, 4, 5]

//Set去重
let a = [1, 2, 2, 3];
let newArr = [...new Set(a)];
console.log(newArr); //[1, 2, 3]
```

### 对象

```javascript
let user = {
    name: "Tom",
    age: 18,
    address: "beijing"
}

//浅拷贝对象
let newUser = {
    ...user
};
console.log(newUser); //{name: "Tom", age: 18, address: "beijing"}

//合并对象
var user1 = {
    name: "Tom",
    age: 18,
    sex: "man"
}
var user2 = {
    name: "Jake",
    address: "beijing",
    email: "360@qq.com"
}
var newUser = {
    ...user1,
    ...user2
};
console.log(newUser); //{name: "Jake", age: 18, sex: "man", address: "beijing", email: "360@qq.com"}
```



## ... rest运算符

rest运算符（剩余参数运算符）同样使用3个点表示（...），其作用与扩展运算符相反，可以将多个参数合并成一个数组。

### 数组

```javascript
let arr = [1, 2, 3, 4, 5];
let [arr1, ...arr2] = arr;
console.log(arr1); //1
console.log(arr2); //[2, 3, 4, 5]
```

### 对象

```javascript
let {
    a,
    b,
    ...c
} = {
    a: 1,
    b: 2,
    m: 3,
    n: 4
};
console.log(a); //1
console.log(b); //2
console.log(c); //{m: 3, n: 4}
```

### 函数

```javascript
function fn(...args) {
    for (let arg of args) {
        console.log(arg);
    }
}
fn("a", "b", "c", "d");
```

### 区别

既然两者都是通过3个点（…）来表示的，那么如何去判断这3个点（…）属于哪一种运算符呢？我们可以遵循下面的规则。·

- 当3个点（…）出现在函数的形参上或者出现在赋值等号的左侧，则表示它为rest运算符。
- 当3个点（…）出现在函数的实参上或者出现在赋值等号的右侧，则表示它为扩展运算符。



## 箭头函数

在ES6中，增加了一种新的函数定义方式——箭头函数（=>）。

### 一般函数

```javascript
function add(a, b) {
    return a + b;
}
let result = add(1, 2);
console.log(result); //3
```

### 箭头函数

```javascript
//等价于
const add = (a, b) => {
    return a + b;
};
```
```javascript
//等价于
const add = (a, b) => a + b;
```

### 默认参数函数

```javascript
function add(a = 1, b = 2) {
    return a + b;
}
console.log(add()); //3
```

```javascript
const add = (a = 1, b = 2) => a + b;
console.log(add()); //3
```

### 剩余参数函数

```javascript
function say(a, b, ...args) {
    console.log(a, b, args);
    console.log(arguments);
}

say("a", "b", "c", "d", "e"); 
```

```javascript
const say = (a, b, ...args) => {
    console.log(a, b, args);
}

say("a"); //a undefined []
say("a", "b", "c", "d", "e"); //a b (3) ["c", "d", "e"]
```

### this指向问题

在普通函数中，this永远指向函数的调用者。

在箭头函数中，this指向的是定义时所在的对象，而不是使用时所在的对象。

```javascript
//代码一
const person1 = {
    name1: "小明",
    age1: 18,
    sayHello: function() {
        console.log(`姓名：${this.name1} 年龄：${this.age1}`);
    }
};
person1.sayHello(); //姓名：小明 年龄：18

//代码二
const person2 = {
    name2: "小明",
    age2: 18,
    sayHello: () => console.log(`姓名：${this.name2} 年龄：${this.age2}`)
};
person2.sayHello(); //姓名：undefined 年龄：undefined
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/db5316a068d74d4bbbc04f9bfdfeb648.png)

说明：

代码一中的sayHello()是普通函数，this指向函数的调用体，即person1对象，因此正常输出”姓名：小明 年龄：18“；

代码二中的sayHello()是剪头函数，this指向外层作用域，即window对象，window没有name2和age2属性，因此输出undefined。



### 无法使用arguments

```javascript
const fn = () => console.log(arguments);
fn(1, 2); //Uncaught ReferenceError: arguments is not defined
```

可以使用rest运算符替代：

```javascript
const fn = (...args) => console.log(args);
fn(1, 2); //[1, 2]
```



### 箭头函数不适合场景

- 不适合作为对象的函数。
- 不能作为构造函数，不能使用new操作符。构造函数是通过new操作符生成对象实例的，生成实例的过程也是通过构造函数给实例绑定this的过程，而箭头函数没有自己的this。因此不能使用箭头函数作为构造函数，也就不能通过new操作符来调用箭头函数。
- 没有prototype属性。因为在箭头函数中是没有this的，也就不存在自己的作用域，因此箭头函数是没有prototype属性的。




