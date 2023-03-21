[toc]

# JavaScript 检测数据类型方式

检测数据类型方式：


- typeof
- instanceof
- constructor
- Object.prototype.toString


## typeof

获取变量的类型，返回一个字符串。

缺点：typeof对于数值、对象、null都返回object类型。

```js
console.log(typeof 10); //number
console.log(typeof true); //boolean
console.log(typeof "hello"); //string
console.log(typeof []); //object
console.log(typeof function() {}); //function
console.log(typeof {}); //object
console.log(typeof undefined); //undefined
console.log(typeof null); //object
```



## instanceof

用于判断一个对象是否属于类或构造函数的实例。

缺点：不能判断基本类型。

```js
console.log(10 instanceof Number); //false
console.log(true instanceof Boolean); //false 
console.log("hello" instanceof String); //false
console.log([] instanceof Array); //true
console.log(function() {} instanceof Function); //true
console.log({} instanceof Object); //true
```



## constructor

获取变量的构造函数从而判断数据类型。

缺点：不能判断null和undefined。

```js
console.log((10).constructor === Number); //true
console.log((true).constructor === Boolean); //true
console.log(("hello").constructor === String); //true
console.log(([]).constructor === Array); //true
console.log((function() {}).constructor === Function); //true
console.log(({}).constructor === Object); //true
```



## Object.prototype.toString

通过`Object.prototype.toString.call()`返回一个字符串。

这种方式可以准确地判断对象和基本类型的类型。

```js
var a = Object.prototype.toString;
console.log(a.call(10)); //[object Number]
console.log(a.call(true)); //[object Boolean]
console.log(a.call("你好")); //[object String]
console.log(a.call([])); //[object Array]
console.log(a.call(function() {})); //[object Function]
console.log(a.call({})); //[object Object]
console.log(a.call(undefined)); //[object Undefined]
console.log(a.call(null)); //[object Null]
```

