[TOC]

# ES6 对象和类

## 概述

对象是JavaScript中重要的数据结构，而ES6对它进行了重大的升级，包括数据结构本身和对象新增的函数，为开发带来了极大的便利。

- 在JS中，生成实例对象是通过构造函数
- ES6则提供了Class概念，通过`class`定义类
- 一个类必须有`constructor()`方法，new对象时会自动调用



## 对象

### 属性简写

传统的JavaScript中，对象都会采用{key: value}的写法，但是在ES6中，可以直接在对象中写入变量，key相当于变量名，value相当于变量值，并且可以直接省略value，通过key表示一个对象的完整属性。

```javascript
let name = "小明";
let age = 18;
const obj = {
    name,
    age,
    sayHello() {
        console.log("hello");
    }
}
console.log(obj.name); //小明
console.log(obj.age); //18
obj.sayHello(); //hello
```

```javascript
//等价于：
let name = "小明";
let age = 18;
const obj = {
    name: name,
    age: age,
    sayHello: function() {
        console.log("hello");
    }
}
console.log(obj.name);
console.log(obj.age); 
obj.sayHello(); 
```



### 属性遍历

常用5种方法遍历属性：

- for...in：遍历对象自身和继承的可枚举属性（不包含Symbol属性）。
- Object.keys(obj)：包含对象自身所有可枚举属性，不包含继承属性和Symbol属性。
- Object.getOwnPropertyNames(obj)：包含对象自身所有可枚举属性和不可枚举属性，不包含继承属性和Symbol属性。
- Object.getOwnPropertySymbols(obj)：包含对象自身所有Symbol属性，不包含其他属性。
- Reflect.ownKeys(obj)：包含可枚举属性、不可枚举属性以及Symbol属性，不包含继承属性。

```javascript
function Animal(name, type) {
    this.name = name;
    this.type = type;
}

function Cat(age, weight) {
    this.age = age;
    this.weight = weight;
}

//继承
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;

let cat = new Cat(12, "10kg");

//for...in
for (let key in cat) {
    console.log(key);
}
//age
//weight
//name
//type
//constructor

//Object,keys
console.log(Object.keys(cat)); //["age", "weight"]

//Object.getOwnPropertyNames
console.log(Object.getOwnPropertyNames(cat)); //["age", "weight"]

//Object.getOwnPropertySymbols
console.log(Object.getOwnPropertySymbols(cat)); //[]

//Reflect.ownKeys
console.log(Reflect.ownKeys(cat)); //["age", "weight"]
```



### Object.assign()

Object.assign()函数用于将一个或者多个对象的可枚举属性赋值给目标对象，然后返回目标对象。

当多个源对象具有相同的属性时，后者的属性值会覆盖前面的属性值。

#### 对象克隆

使用Object.assign()函数进行克隆时，进行的是浅克隆。

```javascript
let a = {
    name: "小明",
    age: 18
};
let b = Object.assign({}, a);
console.log(b); //name: "小明", age: 18}
```

#### 对象添加属性

```javascript
function Person(name, age, address) {
    Object.assign(this, {
        name,
        age,
        address
    });
}
var p = new Person("小明", 18, "beijing");
console.log(p); //{name: "小明", age: 18, address: "beijing"}
```

#### 对象添加函数

为对象添加公共的函数.

```javascript
function Person(name, age, address) {
    Object.assign(this, {
        name,
        age,
        address
    });
}

Object.assign(Person.prototype, {
    getName() {
        return this.name;
    },
    getAge() {
        return this.age;
    }
});

var p = new Person("小明", 18, "beijing");
console.log(p.getName()); //小明
console.log(p.getAge()); //18
```

#### 合并对象

```javascript
let target = {
    x: 1
};
let b = {
    y: 2
};
let c = {
    z: 3
};
var obj = Object.assign(target, b, c);
console.log(target); //{x: 1, y: 2, z: 3}
```



## Symbol类型

ES6引入了一种新的基本数据类型Symbol，它表示的是一个独一无二的值。

至此JavaScript中就一共存在6种基本数据类型，分别是Undefined类型、Null类型、Boolean类型、String类型、Number类型、Symbol类型。

**Symbol类型特性：**

- 唯一性。
- 不能使用new。
- 不能参加类型运算。
- 可以使用同一个Symbol值。Symbol.for()函数传入相同的字符串会得到相同的Symbol值，因此返回“true”。

### 使用

```javascript
let a = Symbol();
console.log(a); //Symbol()
console.log(typeof a); //symbol

let b = Symbol(1);
let c = Symbol(1);
console.log(b == c); //false
console.log(b === c); //false

let d = Symbol("hello");
console.log(d.toString()); //Symbol(hello)
d + "world"; //Uncaught TypeError: Cannot convert a Symbol value to a string

let e = Symbol.for(1);
let f = Symbol.for(1);
console.log(e == f); //true
console.log(e === f); //true
```

### 用作对象属性名

因为每一个Symbol值都是不相等的，它会经常用作对象的属性名，尤其是当一个对象由多个模块组成时，这样能够避免属性名被覆盖的情况。

```javascript
const PROP_NAME = Symbol();

//方式一
let obj1 = {};
obj1[PROP_NAME] = "hello";
console.log(obj1); //{Symbol(): "hello"}

//方式二
let obj2 = {
    [PROP_NAME]: "hello"
}
console.log(obj2); //{Symbol(): "hello"}

//方式三
let obj3 = {};
Object.defineProperty(obj3, PROP_NAME, {
    value: "hello"
});
console.log(obj3); //{Symbol(): "hello"}
```

### 属性区分

```javascript
// 事先声明两个Symbol值，用于作判断
const SHAPE_TYPE = {
    triangle: Symbol('triangle'),
    rectangle: Symbol('rectangle')
};

function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case SHAPE_TYPE.triangle:
            area = 0.5 * options.width * options.height;
            break;
        case SHAPE_TYPE.rectangle:
            area = options.width * options.height;
            break;
    }
    return area;
}

console.log(getArea(SHAPE_TYPE.triangle, {
    width: 100,
    height: 100
})); // 5000

console.log(getArea(SHAPE_TYPE.rectangle, {
    width: 100,
    height: 100
})); // 10000
```

### 属性名遍历

使用Symbol作为属性名时，不能通过Object.keys()函数或者for...in来枚举，这样我们可以将一些不需要对外操作和访问的属性通过Symbol来定义。

```javascript
const obj = {
    [Symbol("name")]: "hello",
    age: 18,
    titlte: "teacher"
}
console.log(Object.getOwnPropertySymbols(obj)); //[Symbol(name)]
console.log(obj[Object.getOwnPropertySymbols(obj)[0]]); //hello
```



## 类

### 简介

传统的JavaScript中只有对象，没有类概念，跟面向对象语言差异很大。为了让JavaScript具有更接近面向对象语言的写法，ES6引入了Class（类）的概念，通过class关键字定义类。

ES5需要定义构造函数，在构造函数中定义实例属性，然后在prototype原型上添加原型属性或者函数。

ES6则使用class关键字定义类的名称，然后在类的constructor构造函数中定义实例属性，原型属性在class内部直接声明并赋值，原型函数的声明与构造函数处于同一层级，并且省略function关键字。



### 定义类

```javascript
//ES5写法：
//定义构造函数
function Person(name, age) {
    //定义实例属性
    this.name = name;
    this.age = age;
}
//定义原型属性
Person.prototype.country = "China";
//定义原型函数
Person.prototype.getName = function() {
    return this.name;
};

var p = new Person("小明", 18);
console.log(p.name, p.age, p.country); //小明 18 China
console.log(p.getName()); //小明
```

```javascript
//ES6写法：
class Person {
    //定义原型属性
    country = "China";
    //定义静态属性
    static sex = true;
 
    constructor(name, age) {
        //定义实例属性
        this.name = name;
        this.age = age;
    }
    //定义原型函数
    getName() {
        return this.name;
    }
    //定义静态函数
    static sayHello() {
        console.log("hello");
    }
}

let p = new Person("小明", 18);
console.log(p.name, p.age, p.country); //小明 18 China
console.log(p.getName()); //小明
Person.sayHello();
console.log(Person.sex); //true
```

```
console.log(typeof Person); //function
console.log(p.getName === Person.prototype.getName); //true
```

说明：

- class的本质依然是一个函数。
- class中的所有属性和函数都是定义在prototype属性中，ES6将prototype相关的操作封装在了class中，避免我们直接去使用prototype属性。



### class表达式

```javascript
const Person = class {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    say() {
        console.log(`say hello`);
    }
};
```



### class继承

ES6新增了extends关键字，可以快速实现类的继承。

```javascript
//父类
class Animal {
    constructor(type) {
        this.type = type;
    }
}
//子类
class Dog extends Animal {
    constructor(name, type) {
        super(type);
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

let dog = new Dog("旺财", "哈士奇");
console.log(dog.type); //哈士奇
console.log(dog.name); //旺财
console.log(dog.getName()); //旺财
```



### get set

在ES6中，可以在class使用get和set关键字，对某个属性设置存值函数和取值函数， 拦截该属性的存取行为。

- `get` 取值函数
- `set` 赋值函数

```javascript
class Person {
    constructor(name, age) {
        this._name = name;
        this._age = age;
    }

    get nameValue() {
        return this._name;
    }

    set nameValue(value) {
        this._name = value;
    }

    get ageValue() {
        return this._age;
    }

    set ageValue(value) {
        this._age = value;
    }
}

let p = new Person("Tom", 18);
console.log(p.nameValue); //Tom

p.ageValue = 28;
console.log(p.ageValue); //28
```

