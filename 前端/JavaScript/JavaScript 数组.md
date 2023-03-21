[TOC]

# JavaScript 数组

## 创建数组

```javascript
//通过构造函数创建
var arr = new Array(1, 2, 3, 4, 5);

//简写
var arr = [1, 2, 3, 4, 5];
```



## 操作数组

### 获取和赋值

```javascript
var arr = ["HTML", "CSS", "JavaScript"];
var str = arr[1];
console.log(str); //CSS
arr[1] = "abc"
arr[3] = "jQuery";
console.log(arr); //["HTML","abc","JavaScript","jQuery"]
```



### 常见属性和方法

| 属性和方法                         | 说明                          |
| ---------------------------------- | ----------------------------- |
| 数组.length                        | 获取数组长度                  |
| 数组.slice(start, end)             | 截取数组的一部分，包含end     |
| 数组.unshift(元素1, 元素2, ......) | 在数组头部添加元素            |
| 数组.push(元素1, 元素2, ......)    | 在数组尾部添加元素            |
| 数组.shift()                       | 删除数组第一个元素            |
| 数组.pop()                         | 删除数组最后一个元素          |
| 数组.indexOf(元素)                 | 获取元素的下标                |
| 数组.lastIndexOf(元素)             | 从后往前查找，获取元素的下标  |
| 数组.includes(元素)                | 数组是否包含指定元素          |
| 数组A.concat(数组B)                | 合并2个数组，并返回一个新数组 |


#### sort() 排序

```javascript
//升序
function up(a, b) {
    return a - b;
}
//降序
function down(a, b) {
    return b - a;
}
var arr = [1, 6, 8, 3, 5, 2];
arr.sort(up);
console.log(arr); //[1,2,3,5,6,8]
var a = arr.sort(down);
console.log(arr); //[8,6,5,3,2,1]
```

#### reverse() 反转数组

```javascript
var arr = [1, 6, 8, 3, 5, 2];
arr.reverse();
console.log(arr); //[2, 5, 3, 8, 6, 1]
```

#### toString() 数组转字符串

```javascript
var arr = ["a", "b", "c", "d", "e", "f"];
var newArr = arr.toString();
console.log(newArr); //a,b,c,d,e,f
console.log(typeof newArr); //string
```

#### join() 数组转字符串

支持添加分割符。

```javascript
var arr = ["HTML", "CSS", "JavaScript", "jQuery"];
var str = arr.join("-");
console.log(str); //HTML-CSS-JavaScript-jQuery
```

#### filter() 过滤数据

```javasc
var arr = [1, 2, 3, 4, 5, 6];
var newArr = arr.filter(function(value, index, array) {
return value % 2 == 0;
});
console.log(newArr); //[2,4,6]
```

#### find() 查找元素

查找指定元素，找到了就返回该元素；如果找不到则返回undefined。

```javascript
var arr = [1, 2, 3, 4, 5, 6];
var num = arr.find(function(value, index, arr) {
    return value > 4;
});
console.log(num); //5
```

#### findIndex()  查找元素

查找目标元素，找到就返回元素的位置，找不到就返回-1。

```javascript
var arr = ["a", "B", "c", "d", "e", "f"];
var num = arr.findIndex(function(value, index, arr) {
    return value == "B";
});
console.log(num); //1
```

#### map() 数据转换

```javascript
var arr = [1, 2, 3, 4, 5, 6];
var newArr = arr.map(function(value, index, array) {
    return value * 10;
});
console.log(newArr); //[10, 20, 30, 40, 50, 60]
```

#### splice() 删除数据并插入数据

- 第一个参数：插入坐标。
- 第二个参数：删除数量。
- 第三个以后参数：插入数据。

```javascript
var arr = ["A", "B", "C", "D", "E"];
var delArr = arr.splice(1, 2, "1", "2");

console.log(delArr); //["B","C"]
console.log(arr); //["A","1","2","D","E"] 
```



### 遍历数组

```javascript
var arr = ["HTML", "CSS", "JavaScript", "jQuery"];

for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

arr.forEach(function(value, index, arr) {
    console.log(value);
});
```



## 判断是否为空数组

```javascript
function isEmptyArray(arr) {
    return arr instanceof Array && arr.length === 0;
}

var o1 = [];
var o2 = [1, 2, 3];
console.log(isEmptyArray(o1)); //true
console.log(isEmptyArray(o2)); //false
```



## 判断是否数组类型

方式一：通过`instanceof`关键字判断。

方式二：通过`Array.isArray()`方法判断，是ES5新增方法。

方式三：通过`Object.prototype.toString.call()`函数判断。

方式四：通过原型链判断。

方式五：通过`Array.prototype.isPrototypeof()`函数判断。

```js
console.log([] instanceof Array); //true
```

```js
console.log(Array.isArray([])); //true
```

```js
function isArray(arr) {
    return Object.prototype.toString.call(arr).slice(8, -1) === "Array";
}
console.log(isArray([])); //true
```

```js
console.log([].__proto__ === Array.prototype); //true
```

```js
console.log(Array.prototype.isPrototypeOf([])); //true
```



## 案例

### 计算长方体的面积和体积

```javascript
function getSzie(width, height, depth) {
    var area = width * height;
    var volume = area * depth;
    var arr = [];
    arr.push(area, volume);
    return arr;
}

var arr = getSzie(10, 20, 30);
console.log("面积：" + arr[0]); //面积：200
console.log("体积：" + arr[1]); //体积：6000
```

### 冒泡排序

```javascript
var arr = [1, 10, 2, 33, 44, 6, 7, 8];
for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
            var temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }
}
console.log(arr); //[1, 2, 6, 7, 8, 10, 33, 44]
```

### 数组去重

```javascript
function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

var arr = [1, 2, 3, 2, 4, 5, 4, 6];
var newArr = unique(arr);
console.log(newArr); //[1, 2, 3, 4, 5, 6]
```

