[toc]

# JavaScript call() apply() bind() 

## 简介

在JavaScript中，`call()` `apply()` `bind() ` 可以指定函数的上下文。

call()和apply()的作用相同，都是立即调用一个函数并且可以指定函数内部的this指向。它们的区别在于传递参数的方式不同：call()接受一系列参数列表，而apply()接受一个数组作为参数。

bind()方法返回一个新的函数，将原函数中的this绑定到指定的对象，并且可以预先设置部分参数。与call()和apply()不同，bind()不会立即执行函数，而是返回一个新函数，需要手动调用才能执行。



## call()

**语法**

```
函数.call(thisArg, 参数列表)
```

**说明**

thisArg指新的对象上下文，函数中的this指向thisArg，如果thisArg为null或undefined，则this会指向全局对象。

**使用**

```javascript
var person = {
    doSomething() {
        console.log(this.name + "在" + this.play);
    }
};
var p1 = {
    name: "小明",
    play: "踢足球"
};
var p2 = {
    name: "小花",
    play: "打羽毛球"
};
person.doSomething.call(p1); //小明在踢足球
person.doSomething.call(p2); //小花在打羽毛球
```



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
var person = {
    doSomething(province, city) {
        console.log(this.name + "在" + province + "省" + city + "市");
    }
};
var p1 = {
    name: "小明"
};
var p2 = {
    name: "小花"
};
person.doSomething.apply(p1, ["湖北", "武汉"]); //小明在湖北省武汉市
person.doSomething.apply(p2, ["广东", "深圳"]); //小花在广东省深圳市
```



## bind()

**语法**

```
函数.bind(thisArg, 参数列表)
```

**说明**

bind()函数与call()函数的参数一样。

**使用**

```javascript
var person = {
    say(content) {
        console.log(this.name + "说：" + content);
    }
};
var p1 = {
    name: "小明"
};
var p2 = {
    name: "小花"
};
var say = person.say.bind(p1, "hello");
say(); //小明说：hello
var say2 = person.say.bind(p2, "哈喽");
say2(); //小花说：哈喽
```



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



