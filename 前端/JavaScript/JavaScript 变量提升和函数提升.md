[toc]

# JavaScript 变量提升和函数提升

## 作用域

在JavaScript中，一个变量的定义与调用都是会在一个固定的范围中的，这个范围我们称之为作用域。

**作用域可以分为：**

- 全局作用域：如果变量定义在全局环境中，那么在任何位置都可以访问到这个变量。
- 函数作用域：如果变量定义在函数内部，那么只能在函数内部访问到这个变量。
- 块级作用域：如果变量定义在一个代码块中，那么只能在代码块中访问到这个变量。

块级作用域是在ES6中新增的，需要使用特定的let或者const关键字定义变量。

```javascript
//全局作用域
var a = "global variable";

function fn() {
    //函数作用域
    var b = "function variable";
    console.log(a);
    console.log(b);
}

{
    //块级作用域
    let c = "block variable";
    console.log(c);
}
```



## 变量提升

全局作用域和块级作用域使用比较简单，但是函数作用域不一样，主要是因为在函数内部使用var定义的变量时，函数中会存在变量提升的问题。

通过var关键字定义的变量会发生变量提升，变量提升是将变量的声明提升到函数顶部的位置，而变量的赋值并不会被提升。

**问题**

```javascript
//代码一
var a = "hello";
(function() {
    console.log(a); //hello
})();
```

```javascript
//代码二
var a = "hello";
(function() {
    console.log(a); //undefined
    var a = "hello js";
})();
```

代码一正常输出，但是代码二输出“undefined”，这是因为发生了变量提升。

```javascript
//代码二等价于：
var a = "hello";
(function() {
    var a; //变量提升
    console.log(a); 
    a = "hello js"; //赋值未提升
})();
```



## 函数提升

不仅通过var定义的变量会出现提升的情况，使用函数声明方式定义的函数也会出现提升。

函数提升会将整个函数体一起进行提升，包括里面的执行逻辑。

函数表达式，是不会进行函数提升的。

**函数**

```javascript
fn();
function fn() {
    console.log("hello"); 
}
```

```javascript
//上面代码等价于：
function fn() {
    console.log("hello"); 
}
fn();
```

**函数表达式**

```javascript
fn(); //ncaught TypeError: fn is not a function
var fn = function() {
    console.log("hello");
}
```

**同时使用函数和函数表达式**

```javascript
show(); //你好
var show;
function show() {
    console.log("你好");
}
show = function() {
    console.log("hello");
}
```

由于函数声明会被提升，因此最后输出的结果为“你好”。

**函数提升覆盖**

```javascript
function fn() {
    function bar() {
        return 3;
    }

    return bar();

    function bar() {
        return 8;
    }
}
console.log(fn()); // 8
```

代码中使用函数声明定义了两个相同的bar()函数。由于变量提升的存在，两段代码都会被提升至foo()函数的顶部，而且后一个函数会覆盖前一个bar()函数，因此最后输出值为“8”。



## 变量提升和函数提升的优先级

同时存在变量提升和函数提升，但是变量提升的优先级要比函数提升的优先级高。

```javascript
function fn() {
    console.log(typeof foo); // function
    // 变量提升
    var foo = 'variable';
    // 函数提升
    function foo() {
        return 'function';
    }
    console.log(typeof foo); // string
}
fn();
```

```javascript
//上面代码等价于：
function fn() {
    var foo;
    function foo() {
        return 'function';
    }
    console.log(typeof foo); // function
    foo = 'variable';
    console.log(typeof foo); // string
}
fn();
```



