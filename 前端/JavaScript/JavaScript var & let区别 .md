[toc]

# JavaScript var & let区别

var和let都是用来声明变量的关键字。

### 变量作用域

var声明的变量作用域是函数作用域或全局作用域，而let声明的变量作用域是块级作用域。

```javascript
function test1() {
    var a = 1;
    if (true) {
        var a = 2;
        console.log(a);
    }
    console.log(a);
}
test1();
// 2
// 2
```

```javascript
function test2() {
    let a = 1;
    if (true) {
        let a = 2;
        console.log(a);
    }
    console.log(a);
}
test2();
// 2
// 1
```

说明：test1函数中，if语句中的变量a覆盖了函数作用域中的变量a，因此2次输出都是2.

test2函数中，if语句中的a变了只在块级作用域中生效，因此第二次输出的a变量为1。



### 变量提升

var声明的变量会发生变量提升，即变量可以在声明前使用，而let声明的变量不会发生变量提升

```javascript
function test1() {
    console.log(a);
    var a = 1;
}
test1();
// undefined
```

```javascript
function test2() {
    console.log(a);
    let a = 1;
}
test2();
// Uncaught ReferenceError: Cannot access 'a' before initialization
```

说明：test1函数中，因为var声明的变量存在变量提升，即使变量a在声明前使用也不会不报错，输出undefined。

test2函数中，let声明的变量不会发生变量提升，因此在声明前使用会报错。



### 变量重复声明

同一作用域内，var声明的变量可以被重复声明，而let声明的变量不允许被重复声明。

```javascript
function test1() {
    var a = 1;
    var a = 2;
    console.log(a);
}
test1();
// 2
```

```javascript
function test2() {
    let a = 1;
    let a = 2; //提示错误
    console.log(a);
}
```

说明：test1函数中，变量a可以被重复声明，最终输出的值为2.

test2函数中，变量a不能重复声明，报错提示`Identifier 'a' has already been declared*`。



### 全局对象属性

在全局作用域下，用var声明的变量会成为全局对象的一个属性，而let声明的变量不会。

```javascript
var a = 1;
console.log(window.a); // 1

let b = 2;
console.log(window.b); // undefined
```

说明：变量a被声明为全局变量，可以通过window对象访问。

变量b不会称为全局对象，因此会输出undefined。



### for循环中的作用域

在循环语句中，用var声明的变量会存在作用域提升和共享的问题，而用let声明的变量则不存在这些问题。

```javascript
function test1() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function() {
            console.log(i);
        }, 100);
    }
}
test1();
// 5
// 5
// 5
// 5
// 5
```

```javascript
function test2() {
    for (let i = 0; i < 5; i++) {
        setTimeout(function() {
            console.log(i);
        }, 100);
    }
}
test2();
// 0
// 1
// 2
// 3
// 4
```

说明：test1函数中，var声明的变量在函数作用域中会发生变量提升问题，最终会输出5个5.

test2函数中，let声明的变量不存在这些问题，会输出0~4。

