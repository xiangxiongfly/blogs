[toc]

# ES6 Iterrator和Generator

## Iterator

### 简介

Iterator称为遍历器，是ES6为不同数据结构遍历所新增的统一访问接口。

作用：

- 为任何部署了Iterator接口的数据结构提供统一的访问机制。
- 使得数据结构的成员能够按照某种次序排列。
- 为新的遍历方式for...of提供基础。



### 简单使用

一个合法的Iterator接口都会具有一个next()函数，在遍历的过程中，依次调用next()函数，返回一个带有value和done属性的对象。

value值表示当前遍历到的值。

done值表示迭代是否结束：

- true表示迭代完成，Iterator执行结束；
- false表示迭代未完成，继续执行next()函数，进入下一轮遍历中，直到done值为true。

### 模拟Iterator接口

```javascript
function makeIterator(array) {
    let index = 0;
    return {
        next: function() {
            if (index < array.length) {
                return {
                    value: array[index++],
                    done: false
                };
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    };
}
let arr = ["red", "green", "blue"];
let iter = makeIterator(arr);
console.log(iter.next()); //{value: "red", done: false}
console.log(iter.next()); //{value: "green", done: false}
console.log(iter.next()); //{value: "blue", done: false}
console.log(iter.next()); //{value: undefined, done: true}
console.log(iter.next()); //{value: undefined, done: true}
```

### for...of

只有部署了Iterator接口的数据结构才能使用for...of遍历，如下:

```javascript
let obj = {
    name: "小明",
    age: 18,
    address: "beijing"
};
for (let key of obj) {
    console.log(key);
}
//Uncaught TypeError: obj is not iterable
```

说明：对象类型使用for...of遍历时，会抛出异常；只能使用for...in。

```javascript
let arr = ["a", "b", "c"];
for (let i of arr) {
    console.log(i);
}
// a
// b
// c
```

原生具备Iterator接口的数据结构有以下：

- Array
- Map
- Set
- String
- arguments对象
- NodeList对象

### 对象类型添加Iterator接口

需要对特定的数据结构加上Symbol.iterator属性即可。

```javascript
//定义构造函数
function Person(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
}
//添加Symbol.iterator属性
Person.prototype[Symbol.iterator] = function() {
    let count = 0;
    let propArr = Object.keys(this);
    return {
        next: function() {
            if (count < propArr.length) {
                let index = count++;
                return {
                    value: propArr[index],
                    done: false
                };
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    };
};
let p = new Person("小明", 18, "beijing");
for (let key of p) {
    console.log(key, p[key]);
}
// name 小明
// age 18
// address beijing
```



## Generator

### 简介

Generator()函数是ES6提供的一种异步编程解决方案。



### 简单使用

Generator()函数本质上也是一个函数，调用方法也与普通函数相同，但是相比较于普通的函数，有以下两个明显的特征：

-  function关键字与函数名之间有一个星号（*）。
- 函数体内部使用yield关键字来定义不同的内部状态。

**yield表达式和next()函数关系**

- yield控制暂停状态。
- next()负责读取数据，返回值是一个具有value和done属性的对象。
- 当所有的yield语句执行完毕时，会直接运行至函数末尾，如果有return语句，将return语句的表达式值作为value值返回；如果没有return语句，则value以undefined值进行返回，这两种情况下的done属性的值都为true，遍历结束。

```javascript
function* makeGenerator() {
    yield 'hello';
    yield 'world';
    return "完成";
}
const generator = makeGenerator();
console.log(generator.next()); //{value: "hello", done: false}
console.log(generator.next()); //{value: "world", done: false}
console.log(generator.next()); //{value: "完成", done: true}
console.log(generator.next()); //{value: undefined, done: true}
```



### for...of遍历

```javascript
function* makeGenerator() {
    yield 'hello';
    yield 'world';
    return "完成";
}
const generator = makeGenerator();
for (let i of generator) {
    console.log(i);
}
// hello
// world
```

```javascript
function* propGenerator() {
    let propArr = Object.keys(this);
    for (let prop of propArr) {
        yield [prop, this[prop]];
    }
}
let user = {
    name: "小明",
    age: 18,
    address: "beijing"
}
user[Symbol.iterator] = propGenerator;
for (let [key, value] of user) {
    console.log(key, value);
}
// name 小明
// age 18
// address beijing
```



