[toc]

# JavaScript instanceof原理

## 概述

在使用typeof运算符时，存在一个比较大的问题，即对于任何引用数据类型的值都会返回“object”，从而无法判断对象的具体类型。

因此，在JavaScript中，可以使用instanceof运算符判断一个对象是否属于某个构造函数的实例。其原理是通过检查对象的原型链来确定对象是否是指定构造函数的实例。



## 使用

### 语法

```
实例对象 instanceof 类型
```

### 简单使用

```javascript
var strObj = new String("hello");
console.log(strObj instanceof String); //true

function Foo() {}
var f = new Foo();
console.log(f instanceof Foo); //true
```

### 继承判断

判断一个实例对象是否属于它的父类。

```javascript
function A() {}
var a = new A();
console.log(a instanceof A); //true

function B() {}
var b = new B();
B.prototype = new A();
console.log(b instanceof B); //true
console.log(b instanceof A); //true
```



## instanceof原理分析

```javascript
function Foo() {}
console.log(Object instanceof Object); //true
console.log(Function instanceof Function); //true
console.log(Number instanceof Number); //false
console.log(String instanceof String); //false
console.log(Function instanceof Object); //true
console.log(Foo instanceof Function); //true
console.log(Foo instanceof Foo); //false
```

### 推演代码

instanceof 运算符会沿着对象的原型链向上查找，直到找到 Object.prototype 为止。如果在这个过程中找到了指定构造函数的 prototype 对象，则返回 true；否则返回 false。

```javascript
function Foo() {}

console.log(instanceOf(Object, Object)); //true
console.log(instanceOf(Function, Function)); //true
console.log(instanceOf(Number, Number)); //false
console.log(instanceOf(String, String)); //false
console.log(instanceOf(Function, Object)); //true
console.log(instanceOf(Foo, Function)); //true
console.log(instanceOf(Foo, Foo)); //false

//推演代码
function instanceOf(L, R) {
    var _prototype = L.__proto__; //获取L的隐式原型
    var prototype = R.prototype; //获取R的显式原型    
    while (true) {
        if (_prototype === null) {
            return false;
        }
        if (_prototype === prototype) { //L的隐式原型等于R的显式原型时返回true
            return true;
        }
        _prototype = _prototype.__proto__;
    }
}
```

### 分析 Object instanceof Object 返回true

因为`Object.__proto__`指向`Function.prototype`，而`Function.prototype.__proto__`指向`Object.prototype`，因此`Object instanceof Object`返回true。



### 分析 Function instanceof Function 返回true

因为`Function.__proto__`指向`Function.prototype`，因此`Function instanceof Function`返回true。



### 分析 Foo instanceof Foo 返回false

因为`Foo.__proto__`指向`Function.prototype`，`Function.prototype.__proto__`指向`Object.prototype`，`Object.prototype.__proto__`指向null，因此`Foo instanceof Foo`返回false。



### 分析 String instanceof String 返回false

因为`String.__proto__`指向`Function.prototype`，`Function.prototype.__proto__`指向`Object.prototype`，``Object.prototype.__proto__`指向null，因此`String instanceof String`返回false。



