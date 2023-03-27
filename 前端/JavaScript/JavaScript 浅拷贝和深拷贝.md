[toc]

# JavaScript 浅拷贝和深拷贝

## 概述

在JavaScript中，浅拷贝和深拷贝是常用的两种对象复制方式。

- 浅拷贝是新建一个对象，浅拷贝只能复制对象的一层属性，对于嵌套的引用类型属性，只会复制其引用地址而不是真正的值。浅拷贝可以使用`Object.assign()`方法或展开运算符（`...`）来实现。
- 深拷贝是新建一个对象，将原始对象的所有属性值都复制到新对象中，包括引用类型的属性值。因此，即使修改了原始对象中的引用类型属性的值，新对象中的属性值也不会受到影响。深拷贝通常使用递归函数或JSON对象来实现。



## 浅拷贝实现

### Object.assign()

```javascript
let user = {
    name: "小明",
    age: 18,
    address: {
        city: "广州市"
    }
};
let user2 = Object.assign({}, user);
user.age = 28;
user.address.city = "上海市";
console.log(user2); //{name: "小明", age: 18, address: { city : "上海市"}}
```

### 展开运算符(...)

```javascript
let user = {
    name: "小明",
    age: 18,
    address: {
        city: "广州市"
    }
};
let user2 = {
    ...user
};
user.age = 28;
user.address.city = "上海市";
console.log(user2); //{name: "小明", age: 18, address: { city : "上海市"}}
```



## 深拷贝实现

### 递归函数

```javascript
function deepClone(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    const newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        newObj[key] = deepClone(obj[key]);
    }
    return newObj;
}

let user = {
    name: "小明",
    age: 18,
    address: {
        city: "广州市"
    }
};
let user2 = deepClone(user);
user.age = 28;
user.address.city = "上海市";
console.log(user2); //{name: "小明", age: 18, address: { city : "广州市"}}
```



### JSON对象

`JSON.stringify()`将对象或数组转为JSON字符串。
`JSON.parse()`将JSON字符串解析为Object类型。

```javascript
let user = {
    name: "小明",
    age: 18,
    address: {
        city: "广州市"
    }
};
let user2 = JSON.parse(JSON.stringify(user));
user.age = 28;
user.address.city = "上海市";
console.log(user2); //{name: "小明", age: 18, address: { city : "广州市"}}
```



