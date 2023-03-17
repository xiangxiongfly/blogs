[toc]

# JavaScript 分析instanceof运算符

## 概述

使用typeof运算符时，存在一个比较大的问题，即对于任何引用数据类型的值都会返回“object”，从而无法判断对象的具体类型。因此，在JavaScript中，又引入了一个新的运算符instanceof，用来帮助我们确定对象的具体类型。



## 使用

**语法**

```
实例对象 instanceof 类型
```

**使用**

```javascript
var strObj = new String("hello");
console.log(strObj instanceof String); //true

function Foo() {}
var f = new Foo();
console.log(f instanceof Foo); //true
```



## 继承判断

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



## 复杂用法

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

instanceof运算符推演代码：

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



