[toc]

# JavaScript 原型和原型链

## 概述

每一个构造函数都有一个`prototype`属性，也就是显示原型。

每一个实例对象都有一个`__proto__`属性，也就是隐式原型。

`prototype`的属性值是个对象，它默认拥有`constructor`属性指回函数。



## new操作符的流程

```javascript
// 定义一个构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 使用 new 操作符创建一个对象实例
var person1 = new Person("Tom", 23);
console.log(person1.name); // Tom
console.log(person1.age); // 23
```

1. 函数体内会自动创建一个空对象。
2. 该对象的原型指向构造函数的原型。
3. 函数的上下文（this）会指向这个对象。
4. 函数体内的语句会继续执行。
5. 函数会自动返回上下文对象，即使函数没有return语句。



## 原型对象、构造函数、实例关系

每个构造函数在创建时都拥有一个prototype属性，prototype属性也就是指向函数的原型对象。在默认情况下，所有的原型对象都会增加一个constructor属性， 并指向prototype属性所在的函数，即构造函数。

通过new调用构造函数创建的实例，实例拥有一个`__proto__`属性，指向构造函数的原型对象，因此`__proto__`属性可以看作是一个连接实例与构造函数的原型对象的桥梁。

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

var p1 = new Person("小明", 18);
var p2 = new Person("小花", 28);

console.log(Person.prototype === p1.__proto__); //true
console.log(Person.prototype === p2.__proto__); //true
console.log(Person.prototype.constructor === Person); //true
```

说明：构造函数Person的`prototype`属性指向Person的原型对象，person1实例和person2实例的`__proto__`隐式属性指向Person的原型对象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e0801ff62b4403c81dd1a9fbc2238af.png)



## 原型链

对象的每个实例都具有一个`__proto__`属性，指向的是构造函数的原型对象，而原型对象同样存在一个`__proto__`属性指向上一级构造函数的原型对象，就这样层层往上，直到最上层某个原型对象为`null`。

在JavaScript中几乎所有的对象都具有`__proto__`属性，由`__proto__`属性连接而成的链路构成了JavaScript的原型链，原型链的顶端是`Object.prototype`，它的`__proto__`属性为`null`。

```javascript
function Person() {}
var p = new Person();

console.log(p.__proto__ === Person.prototype); //true
console.log(Person.prototype.__proto__ === Object.prototype); //true
console.log(Object.prototype.__proto__ === null); //true
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c47fb64d0a0941208b13ed5f5c70f4fa.png)



## 原型链查找

当我们通过对象的实例读取某个属性时，是有一个搜索过程的。它会先在实例本身去找指定的属性，如果找到了，则直接返回该属性的值；如果没找到，则会继续沿着原型对象寻找；如果在原型对象中找到了该属性，则返回该属性的值。

```javascript
function Person() {
    this.name = "小明";
}
Person.prototype.name = "小花";
var p = new Person();
console.log(p.name); //小明
```

### hasOwnProperty

通过使用 `hasOwnProperty` 可以确定访问的属性是来自于实例还是原型对象。

```javascript
var person = {
  name: 'Alice'
};
console.log(person.hasOwnProperty('name')); // true
console.log(person.hasOwnProperty('toString')); // false，toString是Object原型上的方法，不属于person对象自身
```

### in

in操作符则是用来检查对象及其原型链上是否包含某个属性。

```javascript
var person = {
  name: 'Alice'
};
console.log('name' in person); // true
console.log('toString' in person); // true，toString属于Object原型，被person继承
```

