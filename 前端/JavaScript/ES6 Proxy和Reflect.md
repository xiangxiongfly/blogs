[toc]

# ES6 Proxy和Reflect

## Proxy

### 简介

ES6中新增了Proxy对象，从字面上看可以理解为代理器，主要用于改变对象的默认访问行为，实际表现是在访问对象之前增加一层拦截，任何对对象的访问行为都会通过这层拦截。在拦截中，我们可以增加自定义的行为。

### 简单使用

**语法**

```
const proxy = new Proxy(target, handler);
```

**说明**

参数target：目标对象。

参数handler：定义拦截行为。

通过Proxy构造函数可以生成实例proxy，任何对proxy实例的属性的访问都会自动转发至target对象上，我们可以针对访问的行为配置自定义的handler对象，因此外界通过proxy访问target对象的属性时，都会执行handler对象自定义的拦截操作。

**使用**

```javascript
//目标对象
let person = {
    name: "小明",
    age: 18
}
//拦截行为
let handler = {
    get: function(target, prop, receiver) {
        console.log("你访问了person的属性");
        return target[prop];
    }
};
//proxy
let p = new Proxy(person, handler);

console.log(p.name);
//你访问了person的属性
//小明
```

### Proxy函数说明

Proxy实例支持的总共13种函数：

```
get(target, propKey, receiver)
拦截对象属性的读取操作，例如调用proxy.name或者proxy[name]，其中target表示的是目标对象，propKey表示的是读取的属性值，receiver表示的是配置对象。

set(target, propKey, value, receiver)
拦截对象属性的写操作，即设置属性值，例如proxy.name='kingx'或者proxy[name]='kingx'，其中target表示目标对象，propKey表示的是将要设置的属性，value表示将要设置的属性的值，receiver表示的是配置对象。

has(target, propKey)
拦截hasProperty的操作，返回一个布尔值，最典型的表现形式是执行propKey in target，其中target表示目标对象，propKey表示判断的属性。

deleteProperty(target, propKey)
拦截delete proxy[propKey]的操作，返回一个布尔值，表示是否执行成功，其中target表示目标对象，propKey表示将要删除的属性。

ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环等操作，其中target表示的是获取对象自身所有的属性名。

getOwnPropertyDescriptor(target, propKey)
拦截Object.getOwnPropertyDescriptor(proxy, propKey)操作，返回属性的属性描述符构成的对象，其中target表示目标对象，propKey表示需要获取属性描述符集合的属性。

defineProperty(target, propKey, propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy,propDescs)操作，返回一个布尔值，其中target表示目标对象，propKey表示新增的属性，propDesc表示的是属性描述符对象。

preventExtensions(target)
拦截Object.preventExtensions(proxy)操作，返回一个布尔值，表示的是让一个对象变得不可扩展，不能再增加新的属性，其中target表示目标对象。

getPrototypeOf(target)
拦截Object.getPrototypeOf(proxy)操作，返回一个对象，表示的是拦截获取对象原型属性，其中target表示目标对象。

isExtensible(target)
拦截Object.isExtensible(proxy)，返回一个布尔值，表示对象是否是可扩展的，其中target表示目标对象。

setPrototypeOf(target, proto)
拦截Object.setPrototypeOf(proxy, proto)操作，返回一个布尔值，表示的是拦截设置对象的原型属性的行为，其中target表示目标对象，proto表示新的原型对象。

apply(target, object, args)
拦截Proxy实例作为函数调用的操作，例如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)，其中target表示目标对象，object表示函数的调用方，args表示函数调用传递的参数。

construct(target, args)
拦截Proxy实例作为构造函数调用的操作，例如new proxy(...args)，其中target表示目标对象，args表示函数调用传递的参数。
```

### 场景一：私有化

JavaScript中虽然没有私有属性的语法，但存在一种约定俗成的下画线写法，我们可以通过Proxy处理下画线写法来实现真正的私有。

- 不能访问到私有属性，如果访问到私有属性则返回“undefined”。·
- 不能直接修改私有属性的值，即使设置了也无效。
- 不能遍历出私有属性，遍历出来的属性中不会包含私有属性。

```javascript
const datas = {
    _key: "123abc",
    getAllUser: function() {
        console.log("获取所有用户信息");
    },
    getUserById: function(userId) {
        console.log("通过userId查询用户信息");
    },
    saveUser: function(user) {
        console.log("保存用户信息");
    }
};

const proxy = new Proxy(datas, {
    get: function(target, prop) {
        if (prop[0] === "_") {
            return undefined;
        }
        return target[prop];
    },
    set: function(target, prop, value) {
        if (prop[0] !== "_") {
            target[prop] = value;
        }
    },
    has: function(target, prop) {
        if (prop[0] === "_") {
            return false;
        }
        return prop in target;
    }
});

console.log(proxy._key); //undefined
proxy._key = "456"; //设置无效
console.log("_key" in proxy); //false

proxy.getAllUser(); //获取所有用户信息
proxy.getUserById("123"); //通过userId查询用户信息
```

### 场景二：增加日志记录

```javascript
const datas = {
    _key: "123abc",
    getAllUser: function() {
        console.log("获取所有用户信息");
    },
    getUserById: function(userId) {
        console.log("通过userId查询用户信息");
    },
    saveUser: function(user) {
        console.log("保存用户信息");
    }
};

//记录日志
function recordLog() {
    console.log("记录日志");
}

const proxy = new Proxy(datas, {
    get: function(target, prop) {
        const value = target[prop];
        return function(...args) {
            //日志
            recordLog();
            //调用真实函数
            return value.apply(null, args);
        };
    }
});

proxy.getAllUser();
// 记录日志
// 获取所有用户信息
```

### 场景三：特定操作

通过Proxy，我们可以增加某些操作的友好提示或者阻止特定的操作，主要包括以下几类：

- 某些被弃用的函数被调用时，给用户提供友好提示。
- 阻止删除属性的操作。
- 阻止修改某些特定的属性的操作。

```javascript
const NO_DELETE = ["name"];
const NO_CHANGE = ["age"];
const DEPRECATED = ["sayHello"];

let user = {
    name: "小明", //不能被删除的变量
    age: 18, //不能修改值
    sayHello: function(s) { //过时淘汰方法
        console.log(s);
    }
};

const proxy = new Proxy(user, {
    set(target, prop, value, proxy) {
        if (NO_CHANGE.includes(prop)) {
            throw Error(`${prop}不能被修改`);
        }
        target[prop] = value;
    },
    deleteProperty(target, prop) {
        if (NO_DELETE.includes(prop)) {
            throw Error(`${prop}不能被删除`);
        }
        return delete target[prop];
    },
    get(target, prop, proxy) {
        if (DEPRECATED.includes(prop)) {
            console.warn(`${prop}是淘汰方法`)
        }
        const v = target[prop];
        if (typeof v === "function") {
            return function(...args) {
                v.apply(null, args);
            };
        } else {
            return v;
        }
    }
});

// delete proxy.name; //Uncaught Error: name不能被删除
// proxy.age = 100; //Uncaught Error: age不能被修改
proxy.sayHello("hello");
//sayHello是淘汰方法
//hello
```



## Reflect

### 简介

Reflect对象与Proxy对象一样，也是ES6为了操作对象而提供的新API。

有一个名为Reflect的全局对象，上面挂载了对象的某些特殊函数，这些函数可以通过类似于Reflect.apply()这种形式来调用，所有在Reflect对象上的函数要么可以在Object原型链中找到，要么可以通过命令式操作符实现，例如delete和in操作符。

### Reflect函数说明

```
Reflect.apply(target, thisArg, args)
Reflect.apply()函数的作用是通过指定的参数列表执行target函数，等同于执行Function.prototype.apply.call(target, thisArg, args)。
其中target表示的是目标函数，thisArg表示的是执行target函数时的this对象，args表示的是参数列表。

Reflect.construct(target, args [, newTarget])
Reflect.construct()函数的作用是执行构造函数，等同于执行new target(...args)。
其中target表示的是构造函数，args表示的是参数列表。newTarget是选填的参数，如果增加了该参数，则表示将newTarget作为新的构造函数；如果没有增加该参数，则仍然使用第一个参数target作为构造函数。

Reflect.defineProperty(target, propKey, attributes)
Reflect.defineProperty()函数的作用是为对象定义属性，等同于执行Object.defineProperty()。
其中target表示的是定义属性的目标对象，propKey表示的是新增的属性名，attributes表示的是属性描述符对象集。

Reflect.deleteProperty(target, propKey)
Reflect.deleteProperty()函数的作用是删除对象的属性，等同于执行delete obj[propKey]。
其中target表示的是待删除属性的对象，propKey表示的是待删除的属性。

Reflect.get(target, propKey, receiver)
Reflect.get()函数的作用是获取对象的属性值，等同于执行target[propKey]。
其中target表示的是获取属性的对象，propKey表示的是获取的属性，receiver表示函数中this绑定的对象。

Reflect.getOwnPropertyDescriptor(target, propKey)
Reflect.getOwnPropertyDescriptor()函数的作用是得到指定属性的描述对象，等同于执行Object.getOwnPropertyDescriptor()。
其中target表示的是待操作的对象，propKey表示的是指定的属性。

Reflect.getPrototypeOf(target)
Reflect.getPrototypeOf()函数的作用是读取对象的__proto__属性，等同于执行Object.getPrototypeOf(obj)。
其中target表示的是目标对象。

Reflect.has(target, propKey)
Reflect.has()函数的作用是判断属性是否在对象中，等同于执行propKey in target。
其中target表示的是目标对象，propKey表示的是判断的属性。

Reflect.isExtensible(target)
Reflect.isExtensible()函数的作用是判断对象是否可扩展，等同于执行Object.isExtensible()函数。
其中target表示的是目标对象。

Reflect.ownKeys(target)
Reflect.ownKeys()函数的作用是获取对象的所有属性，包括Symbol属性，等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
其中target表示的是目标对象。

Reflect.preventExtensions(target)
Reflect.preventExtensions()函数的作用是让一个对象变得不可扩展，等同于执行Object.preventExtensions()。
其中target表示的是目标对象。

Reflect.set(target, propKey, value, receiver)
Reflect.set()函数的作用是设置某个属性值，等同于执行target[propKey] = value。
其中target表示的是目标对象，propKey表示的是待设置的属性，value表示的是设置属性的具体值，receiver表示函数中this绑定的对象。

Reflect.setPrototypeOf(target, newProto)
Reflect.setPrototypeOf()函数的作用是设置对象的原型prototype，等同于执行Object.setPrototypeOf(target, newProto)。
其中target表示的是目标对象，newProto表示的是新的原型对象。
```

### Reflect.has()

对象是否包含属性和方法。

```javascript
let user = {
    name: "小明",
    sayHello: function() {
        console.log("hello");
    }
};

//传统写法
console.log("name" in user); //true
console.log("sayHello" in user); //true

//Reflect写法
console.log(Reflect.has(user, "name")); //true
console.log(Reflect.has(user, "sayHello")); //true
```



### Reflect.defineProperty()

扩展对象的属性和方法。

```javascript
let user = {
    name: "小明"
};

//传统写法
try {
    Object.defineProperty(user, "age", {
        value: 18
    });
    console.log("添加成功");
} catch (e) {
    console.log("添加失败");
}
console.log(user); //{name: "小明", age: 18}

//Reflect写法
if (Reflect.defineProperty(user, "address", {
    value: "beijing"
})) {
    console.log("添加成功");
} else {
    console.log("添加失败");
}
console.log(user); //{name: "小明", age: 18, address: "beijing"}
```

### Reflect.deleteProperty()

删除对象的属性和方法。

```javascript
let user = {
    name: "小明",
    age: 18,
    address: "beijing",
    sayHello() {
        console.log("hello");
    }
};
let user2 = Object.assign({}, user);

//传统写法
console.log(user); //{name: "小明", age: 18, address: "beijing", sayHello: ƒ}
delete user.name;
delete user.sayHello;
console.log(user); //{age: 18, address: "beijing"}

//Reflect写法
console.log(user2); //{name: "小明", age: 18, address: "beijing", sayHello: ƒ}
Reflect.deleteProperty(user2, "name"); //
Reflect.deleteProperty(user2, "sayHello");
console.log(user2); //{age: 18, address: "beijing"}
```



## Proxy配合Reflect

ES6在设计的时候就将Reflect对象和Proxy对象绑定在一起了，Reflect对象的函数与Proxy对象的函数一一对应，因此在Proxy对象中调用Reflect对象对应的函数是一个明智的选择。

如在使用Proxy对象拦截属性的读取、设置和删除操作、并配合Reflect对象实现时，可以编写如下所示的代码：

```javascript
let user = {
    name: "小明"
};
const proxy = new Proxy(user, {
    get(target, prop) {
        console.log(`获取属性${prop}的值为${target[prop]}`);
        return Reflect.get(target, prop);
    },
    set(target, prop, value) {
        console.log(`设置属性${prop}的值为${value}`);
        return Reflect.set(target, prop, value);
    },
    deleteProperty(target, prop) {
        console.log(`删除属性：${prop}`);
        return Reflect.deleteProperty(target, prop);
    }
});

proxy.name = "小白";
console.log(proxy.name);
delete proxy.name;
// 设置属性name的值为小白
// 获取属性name的值为小白
// 小白
// 删除属性：name
```



