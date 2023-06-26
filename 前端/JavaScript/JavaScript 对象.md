[TOC]

# JavaScript 对象

## 概述

JavaScript是一门面向对象的语言，但JavaScript没有类的概念，一切都是对象。任意一个对象都是某种引用类型的实例，都是通过已有的引用类型创建。引用类型可以是原生的，也可以是自定义的。

对象（object）是JavaScript的核心概念，是键值对的集合，表示属性和值得映射关系。JavaScript的所有数据都可以被视为对象。



## 创建对象

### 对象字面量模式

```javascript
var user = {
    name: "小明",
    age: 18,
    address: "beijing",
    sayHello: function() {
        console.log("hello");
    }
}

console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```

### 工厂模式

工厂模式是软件工程领域中一种广为人知的设计模式，工厂模式抽象了创建具体对象的过程，用函数来封装以特定的接口创建对象的细节。

```javascript
function createUser(name, age, address) {
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.address = address;
    obj.sayHello = function() {
        console.log("hello");
    }
    return obj;
}

var user = createUser("小明", 18, "beijing");
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```

### 构造函数模式

所谓“构造函数”，其实就是一个普通函数，但是内部使用了this变量。对构造函数使用new运算符，就能生成实例，并且this变量会绑定在实例对象上。

```javascript
function User(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
    this.sayHello = function() {
        console.log("hello");
    }
}

var user = new User("小明", 18, "beijing");
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```

### 原型模式

JavaScript中创建的每个函数都有一个prototype（原型）属性，它是一个指针，指向一个称为“原型对象”的对象，原型包含了所有实例共享的属性和方法。对所有实例共享的属性和方法，可以将其放到原型对象中，这样对这些共享属性和方法只需定义一次就可以了。

```javascript
function User() {}
User.prototype.name = "小明";
User.prototype.age = 18;
User.prototype.address = "beijing";
User.prototype.sayHello = function() {
    console.log("hello");
};

var user = new User();
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```

### 组合使用（构造函数模式和原型模式）

组合使用构造函数模式和原型模式中，构造函数用于定义实例属性，原型模式用于定义方法和共享的属性。这样每个实例都会有自己的一份实例属性的副本，同时也可以共享对方法的引用，最大限度地节省了内存。

```javascript
function User(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;

}
User.prototype = {
    constructor: User,
    sayHello: function() {
        console.log("hello");
    }
}


var user = new User("小明", 18, "beijing");
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```

### 动态原型模式

动态原型模式将需要的所有信息都封装到构造函数中，通过if语句判断原型中的某个属性是否存在，若不存在（在第一次调用这个构造函数的时候），执行if语句内部的原型初始化代码。

```javascript
function User(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
    if (typeof this.sayHello != "function") {
        User.prototype.sayHello = function() {
            console.log("hello");
        }
    }
}

var user = new User("小明", 18, "beijing");
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();
```



## 使用

### 访问对象属性和方法

**方式一**

```
对象.属性名
对象.方法名()
```

**方式二**

```
对象["属性名"]
对象["方法名"]
```

**使用**

```javascript
var user = {
    name: "小明",
    age: 18,
    address: "beijing",
    sayHello: function() {
        console.log("hello");
    }
}

//方式一
console.log(user.name);
console.log(user.age);
console.log(user.address);
user.sayHello();

//方式二
console.log(user["name"]);
console.log(user["age"]);
console.log(user["address"]);
user["sayHello"]();
```



### 删除属性

```javascript
var user = {
    name: "小明",
    age: 18,
    address: "beijing",
    sayHello: function() {
        console.log("hello");
    }
}
delete user.name //删除属性
console.log(user); //{age: 18, address: "beijing", sayHello: ƒ}
```



### 遍历对象

```javascript
const user = {
    name: "Tom",
    age: 18,
    sex: "man"
};
```

**for-in**

`for-in` 可以遍历对象的每个键。

```javascript
for (let k in user) {
    console.log(`键:${k} 值:${user[k]}`);
}

//键:name 值:Tom
//键:age 值:18
//键:sex 值:man
```

**for-of**

```javascript
for (let [key, value] of Object.entries(user)) {
    console.log(`键:${key} 值:${value}`);
}

//键:name 值:Tom
//键:age 值:18
//键:sex 值:man
```

**kes values entries**

```javascript
const keyArr = Object.keys(user);
console.log(keyArr); //["name", "age", "sex"]

const valueArr = Object.values(user);
console.log(valueArr); //["Tom", 18, "man"]

const entries = Object.entries(user);
console.log(entries); //[Array(2), Array(2), Array(2)]
```



### hasOwnProperty

`hasOwnProperty()`方法用于判断属性是否为自身拥有的，非原型。

```javascript
function User(name, age) {
    this.name = name;
    this.age = age;
}
User.prototype.address = "beijing";
var user = new User("xiaoming", 18);
console.log(user.hasOwnProperty("name")); //true
console.log(user.hasOwnProperty("age")); //true
console.log(user.hasOwnProperty("address")); //false
console.log(user.hasOwnProperty("toString")); //false
```

### in

`in`操作法可以检查属性和方法是否可以被对象访问。

```javascript
function User(name, age) {
    this.name = name;
    this.age = age;
}
User.prototype.address = "beijing";
var user = new User("xiaoming", 18);
console.log("name" in user); //true
console.log("age" in user); //true
console.log("address" in user); //true
console.log("toString" in user); //true
```



## toString() 和 valueOf()

toString()和valueOf()是Object对象提供的两个方法，toString()用于返回对象的字符串表示，valueOf()则用于返回对象的原始值。所有对象都是继承了Object对象，因而所有对象都具有toString()和valueOf()这两个方法。

Object对象的toString()方法返回值是[object Object]，而valueOf()方法返回的是对象本身。

```javascript
function User(name, age) {
    this.name = name;
    this.age = age;
    this.toString = function() {
        return "姓名：" + name + " 年龄：" + age;
    }
    this.valueOf = function() {
        return "name:" + name + " age:" + age;
    }
}

var user = new User("小明", 18);
console.log(user.toString()); //姓名：小明 年龄：18
console.log(user.valueOf()); //name:小明 age:18
```



## Object的静态函数

### Object.create()

创建并返回一个指定原型和指定属性的对象。

**语法**

```
Object.create(prototype, propertyDescriptor)。
```

**说明**

参数prototype：对象的原型，可以为null。当为null时，对象的原型为undefined。

参数propertyDescriptor格式如下：

```
属性名: {
    value: "", // 设置属性的值。
    writable: true, // 属性是否是否能修改，默认值为true。
    enumerable: true, // 属性是否为可枚举，默认值为true，可枚举的属性表示能for..in操作。
    conﬁgurable: true //属性是否删除而重新定义，默认值为true。
}
```

**使用**

```javascript
var obj = Object.create(null, {
    name: {
        value: "小明",
        writable: true,
        enumerable: true,
        configurable: true
    },
    age: {
        value: 18
    }
});
console.log(obj.__proto__); //undefined
console.log(obj.name); //小明
console.log(obj.age); //18

obj.age = 28;
console.log(obj.age); //18。writable为false，表示只读。

for (var i in obj) {
    console.log(i);
}
//name。只输出name属性；age属性enumerable为false，不能被for...in。
```

### Object.defineProperty()

添加或修改对象的属性值。

**语法**

```
Object.defineProperty(目标对象, "属性明", 属性描述)
```

**使用**

```javascript
Object.defineProperty(user, "name", {
    value: "小明",
    writable: true,
    enumerable: true,
    configurable: true
});
console.log(user); //{name: "小明"}
```

### Object.defineProperties()

添加或修改对象的属性值。

**语法**

```
Object.deﬁneProperties(目标对象, 属性描述)
```

**使用**

```javascript
//给一个空对象{}添加name和age属性
var obj = {};
Object.defineProperties(obj, {
    name: {
        value: "小明",
        enumerable: true
    },
    age: {
        value: 18,
        enumerable: true
    }
});

for (var i in obj) {
    console.log(i);
}
// name
// age
```

### Object.getOwnPropertyNames()

获取对象的所有实例属性和函数，不包含原型链继承的属性和函数，数据格式为数组。

```javascript
function Person(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
    this.getName = function() {
        return this.name;
    }
}
Person.prototype.sayHello = function() {
    console.log("hello");
}

var p = new Person();
console.log(Object.getOwnPropertyNames(p)); //["name", "age", "address", "getName"]
```

### Object.keys()

获取对象可枚举的实例属性，不包含原型链继承的属性，数据格式为数组。

```javascript
var obj = {
    name: "小明",
    age: 18,
    sayHello: function() {
        console.log("hello");
    }
}
Object.defineProperties(obj, {
    name: {
        enumerable: false
    }
});
console.log(Object.keys(obj)); //["age", "sayHello"]
```



## 判断空对象

### 使用JSON.stringify

```javascript
function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}

var obj = {};
var obj2 = {
    name: "小明"
};

console.log(isEmptyObject(obj)); //true
console.log(isEmptyObject(obj2)); //false
```

### 使用Object.keys

```javascript
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
```



## 四大特性

同C++、Java等大多数面向对象语言一样，JavaScript存在抽象、封装、继承和多态四大特性。

### 抽象性

是创建一个“类”，用来描述具有相似性的一类事物。即使需求变了，通性也不会变，这就是抽象。

### 封装性

封装就是把抽象出来的数据和对数据的操作封装在一起，数据被保护在内部，程序的其他部分只有通过被授权的操作（成员方法），才能对数据进行操作。

### 继承性

继承也可以理解为扩展性。

在传统的基于Class的语言如Java、C++中，继承的本质是扩展一个已有的Class，并生成新的Subclass。

由于这类语言严格区分类和实例，继承实际上是类型的扩展。但是，JavaScript由于采用原型继承，我们无法直接扩展一个Class，因为根本不存在Class这种类型。

继承实现的本质是重写原型对象，用父对象的实例替换子对象的默认原型对象。

#### 原型链继承

```javascript
function Person() {
    this.country = "China";
}
Person.prototype.printCountry = function() {
    console.log("来自于" + this.country);
}

function Student(name, age) {
    this.name = name;
    this.age = age;
}
Student.prototype = new Person();
Student.prototype.printInfo = function() {
    console.log("姓名：" + this.name + " 年龄：" + this.age);
}

var stu = new Student("小明", 18);
stu.printInfo(); //姓名：小明 年龄：18
stu.printCountry(); //来自于China
```

#### 构造继承

```javascript
function Animal(age) {
    this.name = "animal";
    this.age = age;
    this.sleep = function() {
        return this.name + "在睡觉";
    }
}
Animal.prototype.eat = function(food) {
    return this.name + "吃" + food;
}

function Cat(name) {
    Animal.call(this);
    this.name = name || "Tom";
}

var cat = new Cat();
console.log(cat.sleep()); //Tom在睡觉
console.log(cat.eat()); //Uncaught TypeError，不能访问父类的原型方法
```

#### 复制继承

```javascript
function Animal(age) {
    this.name = "animal";
    this.age = age;
    this.sleep = function() {
        return this.name + "在睡觉";
    }
}
Animal.prototype.eat = function(food) {
    return this.name + "吃" + food;
}

function Cat(name, age) {
    var animal = new Animal(age);
    for (var key in animal) {
        if (animal.hasOwnProperty(key)) {
            this[key] = animal[key];
        } else {
            Cat.prototype[key] = animal[key];
        }
    }
    this.name = name || "Tom";
}

var cat = new Cat("小白", 18);
console.log(cat.sleep()); //小白在睡觉
console.log(cat.eat("沙丁鱼")); //小白吃沙丁鱼
```

#### 组合继承

组合继承的主要思想是组合了构造继承和原型继承两种方法，一方面在子类的构造函数中通过call()函数调用父类的构造函数，将父类的实例的属性和函数绑定到子类的this中；另一方面，通过改变子类的prototype属性，继承父类的原型对象上的属性和函数。

```javascript
function Animal() {
    this.name = "animal";
    this.sleep = function() {
        return this.name + "在睡觉";
    }
}
Animal.prototype.eat = function(food) {
    return this.name + "吃" + food;
}

function Cat(name) {
    Animal.call(this);
    this.name = name || "Tom";
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;

var cat = new Cat("小白");
console.log(cat.sleep()); //小白在睡觉
console.log(cat.eat("沙丁鱼")); //小白吃沙丁鱼
```

### 多态性

多态性是指相同操作方式带来不同的结果。

从形式上来说，有两种多态。分别为重载和重写：

- 重写是指子类对父类的行为做了修改，虽然行为相同，但结果不同。例如改进性能的同系列车就比原先的某些方面的性能更优越。
- 重载是指某一对象的相同行为导致了不同的结果。

多态一方面加强了程序的灵活性和适应性，另一方面也可以减少编码的工作量。

JavaScript实现重载的方式与Java等其他面向对象语言不同。JavaScript需要利用arguments属性来实现方法重载。

```javascript
function User() {
    this.test = function() {
        if (arguments.length == 1) {
            this.show1(arguments[0]);
        } else if (arguments.length == 2) {
            this.show2(arguments[0], arguments[1]);
        } else if (arguments.length == 3) {
            this.show3(arguments[0], arguments[1], arguments[2]);
        }
    }
    this.show1 = function(a) {
        console.log("show1() 调用了");
    }
    this.show2 = function(a, b) {
        console.log("show2() 调用了");
    }
    this.show3 = function(a, b, c) {
        console.log("show3() 调用了");
    }
}

var user = new User();
user.test(1);
user.test(1, 2);
user.test(1, 2, 3);
```



## 包装类

- `Number()` `String()` `Boolean()`分别是数值、字符串、布尔类型的包装类
- 包装类的目的是为了让基本类型从它们的构造函数的prototype上获取方法

```javascript
var a = new Number(100);
var b = new String("hello");
var c = new Boolean(true);
```



