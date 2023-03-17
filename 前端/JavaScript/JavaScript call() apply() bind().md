[toc]

# JavaScript call() apply() bind() 

## 简介

在JavaScript中，每个函数都包含两个非继承而来的函数apply()和call()，这两个函数的作用是一样的，都是为了改变函数运行时的上下文而存在的，实际就是改变函数体内this的指向。



## call()

**语法**

```
函数.call(thisArg, 参数1, 参数2 ......)
```

**说明**

thisArg指新的对象上下文，函数中的this指向thisArg，如果thisArg为null或undefined，则this会指向全局对象。

**使用**

```javascript
function add(x, y) {
    return x + y;
}

function myAdd(x, y) {
    return add.call(this, x, y);
}

console.log(myAdd(2, 3)); //5
```

说明：myCall()函数本身不具备运算能力，是通过调用add()函数的call()函数，并传入this，将add()函数的主体改变为myCall()函数。



## apply()

**语法**

```
函数.apply(thisArg, 参数数组)
```

**说明**

thisArg与call()函数的thisArg参数一样。

参数数组值参数以数组形式进行传递。

**使用**

```javascript
function add(x, y) {
    return x + y;
}

function myAdd(x, y) {
    return add.apply(this, [x, y]);
}

console.log(myAdd(2, 3)); //5
```



## bind()

**语法**

```
函数.bind(thisArg, 参数1, 参数2......)
```

**说明**

bind()函数与call()函数的参数一样。

**使用**

```javascript
function add(x, y) {
    return x + y;
}

function myAdd(x, y) {
    //获取新函数
    var addFun = add.bind(this, x, y);
    //执行新函数
    return addFun();
}

console.log(myAdd(2, 3)); //5
```



## 区别

相同点：都会改变函数调用的执行主体，修改this指向。

不同点：

- call()和apply()调用后会理解执行，bind()调用后会先返回一个新函数再调用执行。
- call()和bind()接收到参数相同；apply()则不一样。



## 案例

### 求最大值和最小值

```javascript
var arr = [1, 2, 3, 4, 5];
var max = Math.max.apply(null, arr);
console.log(max); //5
var min = Math.min.apply(null, arr);
console.log(min); //1
```

### 类数组对象转数组对象

```javascript
function sum() {
    var arr = Array.prototype.slice.call(arguments);
    return arr.reduce(function(pre, cur) {
        return pre + cur
    }, 0);
}
console.log(sum(1)); //1
console.log(sum(1, 2, 3)); //6
console.log(sum(1, 2, 3, 4, 5)); //15
```

### 实现继承

```javascript
function Person(country) {
    this.country = country;
    this.showCountry = function() {
        return "国籍：" + this.country;
    }
}

function Student(name, age, country) {
    this.name = name;
    this.age = age;
    Person.call(this, country);
    this.showInfo = function() {
        return "姓名：" + this.name + " 年龄：" + this.age;
    }
}

var stu = new Student("小明", 18, "China");
console.log(stu.showCountry()); //国籍：China
console.log(stu.showInfo()); //姓名：小明 年龄：18
```

执行完这段代码后` Person.call(this, country)`，实际的Student如下：

```javascript
function Student(name, age, country) {
    this.name = name;
    this.age = age;
    this.country = country;
    this.showCountry = function() {
        return "国籍：" + this.country;
    }
    this.showInfo = function() {
        return "姓名：" + this.name + " 年龄：" + this.age;
    }
}
```

### 执行匿名函数

```javascript
var users = [{
    name: "小明",
    age: 18
}, {
    name: "小白",
    age: 28
}, ];
for (var i = 0; i < users.length; i++) {
    (function(x) {
        this.print = function() {
            console.log(this.name + "-" + this.age);
        }
        this.print();
    }).call(users[i], i);
}

// 小明-18
// 小白-28
```

### bind()配合setTimeout()

```javascript
// 定义一个函数
function LateBloomer() {
    this.petalCount = Math.ceil(Math.random() * 12) + 1;
}
// 定义一个原型函数
LateBloomer.prototype.bloom = function() {
    // 在一秒后调用实例的declare()函数，很关键的一句
    window.setTimeout(this.declare.bind(this), 1000);
};
// 定义原型上的declare()函数
LateBloomer.prototype.declare = function() {
    console.log('I am a beautiful ﬂower with ' + this.petalCount + ' petals!');
};
// 生成LateBloomer的实例
var ﬂower = new LateBloomer();
ﬂower.bloom(); // 1秒后，调用declare()函数
```



