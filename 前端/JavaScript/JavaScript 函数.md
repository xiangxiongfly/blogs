[TOC]

# JavaScript 函数

## 函数的定义和调用

```javascript
//定义函数
function sum(a, b) {
    return a + b;
}

//调用函数
sum(1, 2);
```



### 在超链接中调用

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script>
            function printInfo() {
                alert("hello\nworld");
            }
        </script>
    </head>
    <body>
        <a href="javascript:printInfo()">点击</a>
    </body>
</html>
```



### 在事件中调用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			function alertMes() {
				alert("hello world");
			}
		</script>
	</head>
	<body>
		<input type="button" onclick="alertMes()" value="提交" />
	</body>
</html>
```



### 函数提升

在JavaScript中，即使声明的函数在代码的底部，也会在解析阶段被提升。

函数提升会将整个函数体一起进行提升，包括里面的执行逻辑。

函数表达式，是不会进行函数提升的。

[变量提升和函数提升](https://blog.csdn.net/qq_14876133/article/details/128701606)



## 实参和形参

```javascript
function sum(x, y) {
    return x + y
}
var result = sum(2, 3);
console.log(result); //5
```

- 2和3为实参。
- x和y为形参。



## 全局变量和局部变量

在JavaScript中根据作用域，变量可以分为2种：

- 全局变量。
- 局部变量。

全局变量一般在主程序中定义，其有效范围是从定义开始，一直到整个程序结束。也就是全局变量在任何地方都可以使用。

局部变量一般在函数中定义，其有效范围只限于在函数中。也就是局部变量只能在函数中使用，函数之外是不能使用函数中定义的变量的。

如果不给变量赋值，则被定义为全局变量。

```javascript
var a;

function sum(x, y) {
    var b = x + y;
    c = b + 10;
    a = b + 20
}

sum(2, 3);
console.log(a); //25
// console.log(b);
console.log(c); //15
```

- a为全局变量。
- b为局部变量
- c为全局变量



## arguments

JavaScript的函数都内置一个arguments对象，这是一个类数组对象，保存了所有传递过来的数据。

```javascript
function sum(x, y) {
    console.log("长度：" + arguments.length);
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
    return x + y
}
sum(2, 3);

//长度：2
// 2
// 3
```



## 嵌套函数

嵌套函数指在函数内部定义函数。

```javascript
function func(num) {
    function multi(x) {
        return x * x;
    }
    
    var sum = 0;
    for (var i = 1; i <= num; i++) {
        sum += multi(i);
    }
    return sum;
}
var result = func(4);
console.log(result); //30
```



## 闭包

在JavaScript中存在一种内部函数，即函数声明和函数表达式可以位于另一个函数的函数体内，在内部函数中可以访问外部函数声明的变量，当这个内部函数在包含它们的外部函数之外被调用时，就会形成闭包。

简而言之，闭包就是函数嵌套函数的一种使用方法，可以缓存内部变量，防止内部变量被外界污染。

```javascript
var obj = (function () {
    //私有值
    var count = 0;

    function add() {
        count++;
    }

    function decrease() {
        count--;
    }

    function getCount() {
        return count;
    }

    return {
        add: add,
        decrease: decrease,
        getCount: getCount,
    };
})();

obj.add();
obj.add();
obj.add();
obj.decrease();

console.log(obj.getCount()); //2
```



## 递归函数

```javascript
function func(num) {
    if (num == 1) {
        return 1;
    }
    return num * func(num - 1);
}
var result = func(4);
console.log(result); //24
```



## IIFE 立即调用函数

立即调用函数（IIFE，Immediately Invoked Function Expression），是一种特殊的JavaScript函数写法，定义函数后就立即调用。

```javascript
var func = function(level) {
    function myScore(score) {
        if (score >= level) {
            console.log("成绩及格");
        } else {
            console.log("成绩不及格");
        }
    }
    return myScore;
}(60);

func(70); //成绩及格
func(50); //成绩不及格
```

说明：这个demo就是立即调用函数，同时也体现了闭包的记忆性，缓存了level变量。



## 内置函数

| 内置函数     | 说明                         |
| ------------ | ---------------------------- |
| parseInt()   | 字符串转数字，只提取整数部分 |
| parseFloat() | 字符串转小数                 |
| isFinite     | 是否为有限数值               |
| isNaN()      | 是否为NaN值                  |
| escape()     | 对字符串编码                 |
| unescape()   | 对字符串解码                 |
| eval()       | 讲字符串当作表达式执行       |



## 案例

### 判断闰年

```javascript
function isLeapYear(year) {
    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
        console.log("是闰年");
    } else {
        console.log("不是闰年");
    }
}

isLeapYear(2000); //是闰年
isLeapYear(2008); //是闰年
isLeapYear(2022); //不是闰年
```

### 求最大值

```javascript
function getMax() {
    var max;
    for (var i = 0; i < arguments.length; i++) {
        max = (max > arguments[i]) ? max : arguments[i];
    }
    return max;
}

console.log(getMax(1, 7, 3, 6)); //7
console.log(getMax(100, 300, 200)); //300
```



