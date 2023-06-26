[toc]

# JavaScript 上下文对象

## 概述

函数中可以使用this关键字，表示函数的上下文。

判断上下文常用规则：

- 规则一：函数的上下文（this）由调用函数的方式决定。
- 规则二：圆括号直接调用函数，则函数的上下文是window对象。
- 规则三：数组或类数组对象枚举出函数进行调用，上下文是这个数组或类数组对象。
- 规则四：IIFE函数（立即可执行函数），上下文是window对象。
- 规则五：定时器、延时器调用函数，上下文是window对象。
- 规则六：事件处理函数的上下文是绑定事件的DOM元素。



## 规则一使用

### 例子一

```javascript
function fn() {
    console.log(this.a + this.b);
}
var obj = { a: 10, b: 20, fn: fn };
obj.fn(); //30
```

### 例子二

```javascript
var obj1 = {
    a: 1,
    b: 2,
    fn: function () {
        console.log(this.a + this.b);
    },
};
var obj2 = {
    a: 3,
    b: 4,
    fn: obj1.fn,
};
obj2.fn(); //7
```

### 例子三

```javascript
function outer() {
    var a = 11;
    var b = 22;
    return {
        a: 33,
        b: 44,
        fn: function () {
            console.log(this.a + this.b);
        },
    };
}
outer().fn(); //77
```

### 例子四

```javascript
function fun() {
    console.log(this.a + this.b);
}
var obj = {
    a: 1,
    b: 2,
    c: [
        {
            a: 3,
            b: 4,
            c: fun,
        },
    ],
};
var a = 5;
obj.c[0].c(); //7
```

## 规则二使用

### 例子一

```javascript
var obj1 = {
    a: 1,
    b: 2,
    fn: function () {
        console.log(this.a + this.b);
    },
};
var a = 3;
var b = 4;
var fn = obj1.fn;
fn(); //7
```

### 例子二

```javascript
function fun() {
    return this.a + this.b;
}
var a = 1;
var b = 2;
var obj = {
    a: 3,
    b: fun(),
    fun: fun,
};
var result = obj.fun();
console.log(result); //6
```

## 规则三使用

### 例子一

```javascript
var arr = [
    "A",
    "B",
    "C",
    function () {
        console.log(this[0]);
    },
];
arr[3](); //A
```

### 例子二

```javascript
function fun() {
    arguments[3]();
}
fun("A", "B", "C", function () {
    console.log(this[1]);
});
// B
```

## 规则四使用

### 例子一

```javascript
var a = 1;
var obj = {
    a: 2,
    fun: (function () {
        var a = this.a;
        return function () {
            console.log(a + this.a);
        };
    })(),
};
obj.fun(); //3
```

## 规则五使用

### 例子一

```javascript
var obj = {
    a: 1,
    b: 2,
    fun: function () {
        console.log(this.a + this.b);
    },
};
var a = 3;
var b = 4;
setTimeout(obj.fun, 2000); //7
```

### 例子二

```javascript
var obj = {
    a: 1,
    b: 2,
    fun: function () {
        console.log(this.a + this.b);
    },
};
var a = 3;
var b = 4;
setTimeout(function () {
    obj.fun();
}, 2000); //3
```

## 规则六使用

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
  </head>
  <body>
    <ul id="list">
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
      <li>jQuery</li>
    </ul>
    <script>
      var lis = document.querySelectorAll("#list li");
      function setRedColor() {
        this.style.color = "red";
      }
      for (var i = 0; i < lis.length; i++) {
        lis[i].onclick = setRedColor;
      }
    </script>
  </body>
</html>
```

