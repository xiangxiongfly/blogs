[TOC]

# JavaScript RegExp正则类型

## 概述

- 正则表达式（regular expression）用于描述字符串的构成模式，经常用于检查字符串是否符合预定的格式要求
- ECMAScript通过RegExp类型支持正则表达式。





## 创建

### 方式一

```js
let p = /pattern/flags;
```

- pattern：正则表达式。
- flags：标记
  - g：全局模式，查找字符串的全部内容。
  - i：不区分大小写。
  - m：多行模式，查找到一行文本末尾时会继续查找。
  - y：粘附模式，表示只查找从lastIndex开始及之后的字符串。
  - u：Unicode模式，启用Unicode匹配。
  - s：dotAll模式，表示元字符．匹配任何字符（包括\n或\r）。

### 方式二

```js
let p1 = new RegExp(pattern, flags);
```



## 使用正则

### exec()

- `exec()`方法用于查找字符串，返回值为数组或null，返回的数组是Array实力，包含2个属性：
  - index：匹配的开始位置。
  - input：匹配的字符串。

```js
//匹配字符串中所有at
let p1 = /at/g;
let text = "bbbatbbbbbatbbbb";
let a = p1.exec(text);
console.log(a);
console.log(a.index); //3
console.log(a.input); //bbbatbbbbbatbbbb

let a2 = p1.exec(text);
console.log(a2);
console.log(a2.index); //10
console.log(a2.input); //bbbatbbbbbatbbbb

let a3 = p1.exec(text);
console.log(a3); //null
```

```js
//匹配第一个bat或cat，并忽略大小写
let p2 = /[bc]at/i;
let text1 = "eeeebateeeeeeee";
let text2 = "eeeeecateeeeeeee";
let a = p2.exec(text1);
let b = p2.exec(text2);
console.log(a.index); //4
console.log(b.index); //5
```

```js
//匹配at结尾的三字符，并忽略大小写
let p3 = /.at/gi;
let text = "ooooooeatoooooo";
let a = p3.exec(text);
console.log(a.index); //6
```



### test()

- `test()`方法是用来检测字符串是否匹配，返回true或false。

```js
//匹配字符串中所有at
let p1 = /at/g;
let text = "bbbatbbbbbatbbbb";
let a = p1.test(text);
console.log(a); //true
```

```js
//匹配第一个bat或cat，并忽略大小写
let p2 = /[bc]at/i;
let text1 = "eeeebateeeeeeee";
let text2 = "eeeeecateeeeeeee";
let a = p2.test(text1);
let b = p2.test(text2);
console.log(a); //true
console.log(b); //true
```

```js
//匹配at结尾的三字符，并忽略大小写
let p3 = /.at/gi;
let text = "ooooooeatoooooo";
let a = p3.test(text);
console.log(a); //true
```



## 实际运用

### 检查字符串是否为6位数字

```javascript
var str = "123456";
var reg = /^\d{6}$/;
//var reg = new RegExp("^\\d{6}$");
if (reg.test(str)) {
    alert("符合");
} else {
    alert("不符合");
}
```



### 检查字符串是否为5位字母，大小均可

```javascript
var str = "abcde";
var reg = /^[a-zA-Z]{5}$/;
if (reg.test(str)) {
    alert("符合");
} else {
    alert("不符合");
}
```



### 检查字符串是否5位，且仅由小写字母、点组成

```javascript
var str = "abc..";
var reg = /^[a-z\.]{5}$/;
if (reg.test(str)) {
    alert("符合");
} else {
    alert("不符合");
}
```



### 检查字符串是否位4位小写字母，且最后一位不能为m

```javascript
var str = "abcc";
var reg = /^[a-z]{3}[a-ln-z]$/;
if (reg.test(str)) {
    alert("符合");
} else {
    alert("不符合");
}
```



### 手机号验证

```javascript
var str = "12345678900";
var reg = /^1\d{10}$/;
if (reg.test(str)) {
    alert("符合");
} else {
    alert("不符合");
}
```



## JS中字符串对正则的支持

```javascript
var str = "hello javascript hello javascript";

//search()：与indexOf()类似，查找到下标，找不到返回-1
var index = str.search("llo");
console.log(index); //2

//match()：返回查找的数组，找不到返回null
var arr = str.match(/llo/g);
console.log(arr); //["llo", "llo"] 

//replace()：替换字符串
var result1 = str.replace(/llo/, "ABC");
console.log(result1); //heABC javascript hello javascript
var result2 = str.replace(/llo/g, "ABC"); //heABC javascript heABC javascript
console.log(result2);

//splite()：拆分为数组
var arr1 = str.split(" ");
console.log(arr1); //["hello", "javascript", "hello", "javascript"]
var arr2 = str.split(/\s/);
console.log(arr2); //["hello", "javascript", "hello", "javascript"]
```