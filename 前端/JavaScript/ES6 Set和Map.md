[TOC]

# ES6 Set和Map

## Set

### 概述

ES6中新增了一种数据结构Set，表示的是一组数据的集合，Set集合具有无序、没有重复值的特性。

### 创建

```javascript
//方式一
let set1 = new Set(); //{}
//方式二
let set2 = new Set([1, 2, 3]); //{1, 2, 3}			
//方式三
let set3 = new Set("hello"); //{"h", "e", "l", "o"}
```

### 常用方法

```javascript
let set = new Set([1, 2, 3]);

//增加
set.add(4).add(5);

//删除
set.delete(4);

//获取长度
console.log(set.size); //4

//是否包含
console.log(set.has(2)); //true

//清空全部
set.clear();
```

### 遍历

```javascript
let set = new Set(["red", "green", "blue"]);

//方式一
for (let item of set) {
    console.log(item);
}
// red
// green
// blue

//方式二
for (let item of set.keys()) {
    console.log(item);
}
// red
// green
// blue

//方式三
for (let item of set.values()) {
    console.log(item);
}
// red
// green
// blue

//方式四
for (let item of set.entries()) {
    console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

### Set与数组的互转

```javascript
//Set -> 数组
let arr1 = [1, 2, 3, 4, 5];
let set1 = new Set(arr1);
console.log(set1); //{1, 2, 3, 4, 5}

//数组 -> Set
let set2 = new Set();
set2.add(1).add(2).add(3).add(4).add(5);
let arr2 = Array.from(set2);
console.log(arr2); //[1, 2, 3, 4, 5]
```



## Map

### 概述

ES6增加了另一种数据结构Map。本质是一种键值对的组合。

与对象字面量不同的是，对象字面量的键只能是字符串，对于非字符串类型的值会采用强制类型转换成字符串，而Map的键却可以由各种类型的值组成。

### 创建

```javascript
//方式一
let map1 = new Map(); //{}

//方式二
let map2 = new Map([
    ["name", "Tom"],
    ["age", 18]
]); //{"name" => "Tom", "age" => 18}
```

### 常用方法

```javascript
let map = new Map([
    ["name", "小明"],
    ["age", 18]
]);

//增加
map.set("address", "beijing");
map.set("sex", "男");

//删除
map.delete("sex");

//获取
console.log(map.get("name"));

//是否包含
console.log(map.has("address"));

//清空所有
map.clear();
```

### 遍历

```javascript
let map = new Map([
    ["name", "小明"],
    ["age", 18],
    ["address", "beijing"],
]);

//方式一
for (let [key, value] of map) {
    console.log(key, value);
}
// name 小明
// age 18
// address beijing

//方式二
map.forEach(function(value, key) {
    console.log(key, value);
});
// name 小明
// age 18
// address beijing

//方式三
for (let key of map.keys()) {
    console.log(key, map.get(key));
}
// name 小明
// age 18
// address beijing

//方式四
for (let value of map.values()) {
    console.log(value);
}
// 小明
// 18
// beijing

//方式五
for (let obj of map.entries()) {
    console.log(obj);
}
// ["name", "小明"]
// ["age", 18]
// ["address", "beijing"]
```

### Map与其他数据结构的转换

```javascript
let map = new Map();
map.set("name", "小明");
map.set("age", 18);
map.set("address", "beijing");

//Map -> 数组
let arr = [...map];
console.log(arr); //[["name", "小明"],["age", 18],["address", "beijing"]]

//Map -> 对象
function mapToObject(map) {
    let obj = {};
    for (let [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}
let obj = mapToObject(map);
console.log(obj); //{name: "小明", age: 18, address: "beijing"}

//对象 -> Map
function objectToMap(obj) {
    let map = new Map();
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key]);
    }
    return map;
}
let obj2 = {
    name: "xiaobai",
    age: 28
};
let map2 = objectToMap(obj2);
console.log(map2); //{"name" => "xiaobai", "age" => 28}
```

### Map与JSON字符串的互转

#### Map转JSON字符串

**key名是字符串时**

```javascript
function mapToObject(map) {
    let obj = {};
    for (let [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}

function mapToJson(map) {
    return JSON.stringify(mapToObject(map));
}

let map = new Map();
map.set("name", "xiaobai").set("age", 18).set("address", "beijing");
let json = mapToJson(map);
console.log(json); //{"name":"xiaobai","age":18,"address":"beijing"}
```

**key名不是字符串时**

```javascript
function mapToArrayJson(map) {
    return JSON.stringify([...map]);
}

let map = new Map();
map.set(true, false).set(10, 20).set("address", "beijing");
let json = mapToArrayJson(map);
console.log(json); //[[true,false],[10,20],["address","beijing"]]
```

#### JSON字符串转Map

```javascript
function objectToMap(obj) {
    let map = new Map();
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key]);
    }
    return map;
}

function jsonToMap(jsonStr) {
    return objectToMap(JSON.parse(jsonStr));
}

let json = '{"name":"xiaoming","age":18,"sex":true}';
let map = jsonToMap(json);
console.log(map); //{"name" => "xiaoming", "age" => 18, "sex" => true}
```



