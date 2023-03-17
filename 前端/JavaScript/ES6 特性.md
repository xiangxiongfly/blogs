[TOC]

# ES6特性

## 概述

- ES与JS关系：
  - JavaScript（浏览器端）= ECMAScript（语法 API）+ DOM +BOM
- ES6兼容性：
  - 主流浏览器的最新版本基本都支持ES6规范
  - IE等老版本浏览，可以通过`Babel`转码兼容



## let和const

其实在ES6之前，只存在全局作用域和函数作用域，并不存在块级作用域，这就会导致变量提升的问题。

[变量提升和函数提升](https://blog.csdn.net/qq_14876133/article/details/128701606)

在ES6中新增了块级作用域来避免这个问题的出现。

let关键字用于声明变量，和var关键字的用法类似。

使用const声明的值为一个常量，一旦声明将不会再改变。

**let特性：**

- 不存在变量提升。
- 不能重复声明。
- 不再是全局对象的属性。

**let优点：**

- 避免内存泄露。
- 避免出现变量提升导致的变量覆盖问题。
- 代替立即执行函数。

**const特性：**

- 在块级作用域内有效。
- 不存在变量提升。
- 不能重复声明变量。
- 不再是全局对象的属性。

### var和let运用

```javascript
//var必须使用闭包防止变量提升带来的副作用
var btns = document.querySelectorAll("button");
for (var i = 0; i < btns.length; i++) {
    (function(i) {
        btns[i].addEventListener("click", function() {
            alert(i);
        }, true);
    })(i);
}
```

```javascript
//let不会产生变量提升
var btns = document.querySelectorAll("button");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        alert(i);
    }, true);
}
```



## 模版字符串

在ES6中，对于字符串的扩展增加了模板字符串的语法，可以轻松解决两个问题：

- 模板字符串使用反引号（``）括起来，它可以当作普通的字符串使用，也可以用来定义多行字符串。通过模板字符串的语法输出的字符串包含了缩进和换行符。
- 支持在字符串中使用${}嵌入变量。

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



## 解构赋值

解构可以将值从数组或者对象中提取出来，并赋值到不同的变量中。

### 数组

```js
//一般情况
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); //1 2 3
```

```js
//忽略值
const [a, [, , b], c] = [1, [2, 3, 4], 5];
console.log(a, b, c); //1 4 5
```

```js
//默认值，默认值生效的条件是对应的属性值严格等于undefined。
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
//数据返回
function fn() {
    return [1, 2];
}
let [a, b] = fn();
console.log(a, b); //1 2
```

```js
//嵌套数组
let [a, b, [c]] = [1, [2, 3],
                   [4, 5, 6]
                  ]
console.log(a); //1
console.log(b); //[2,3]
console.log(c); //4
```

### 对象

在对象中，属性是没有顺序的，这就要求右侧解构对象的属性名和左侧定义对象的变量名必须相同，这样才可以进行解构。

```js
//一般情况
const user = {
    name: "Tom",
    age: 18,
    sex: "man"
};
const {
    age,
    name,
    sex
} = user;
console.log(name, age, sex); //Tom 18 man	
```

```js
//默认值，默认值生效的条件是对应的属性值严格等于undefined。
const {
    a,
    b = 1,
    c = true
} = {
    a: "xiaoming",
    b: null,
    c: undefined
};
console.log(a); //xiaoming
console.log(b); //null
console.log(c); //true
```

```js
//嵌套对象
let {
    a: [b, {
        c: name
    }]
} = {
    a: ["hello", {
        c: "world"
    }]
};
console.log(b); //hello
console.log(name); //world
```

```js
//函数参数
function fn({
    name: name,
    age: age,
    address: address
}) {
    console.log(`姓名：${name},年龄：${age},地址：${address[0]}${address[1]}`);
}
const user = {
    name: "小明",
    age: 18,
    address: ["广东省", "广州市"]
};
fn(user); //姓名：小明,年龄：18,地址：广东省广州市
```

### 字符串

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

### 剩余参数

```javascript
const [a, ...args] = [1, 2, 3, 4];
console.log(a, args); //1 [2, 3, 4]
```



## ...扩展运算符

扩展运算符用3个点表示（...），用于将一个数组或类数组对象转换为用逗号分隔的值序列。

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

//合并数组
const a = [1, 2, 3];
const b = [4, 5];
const arr = [...a, ...b];
console.log(arr); //[1, 2, 3, 4, 5]

//Set去重
let a = [1, 2, 2, 3];
let arr = [...new Set(a)];
console.log(arr); //[1, 2, 3]
```

### 对象

```javascript
//展开对象
let user = {
    name: "Tom",
    age: 18,
    address: "beijing"
}
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



## rest运算符

rest运算符同样使用3个点表示（...），其作用与扩展运算符相反，用于将以逗号分隔的值序列转换成数组。

解构会将相同数据结构对应的值赋给对应的变量，但是当我们想将其中的一部分值统一赋给一个变量时，可以使用rest运算符。

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

### this问题

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

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc6f781aa46944778040003130bd488d.png)

说明：代码一的sayHello()是普通函数，this指向函数的调用体，即person1对象，因此正常输出”姓名：小明 年龄：18“；代码二的sayHello()是剪头函数，this指向外层作用域，即window对象，window没有name2和age2属性，因此输出undefined。



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




