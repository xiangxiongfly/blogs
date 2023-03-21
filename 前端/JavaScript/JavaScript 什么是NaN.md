[toc]

# JavaScript 什么是NaN

## 概述

在JavaScript中，NaN（Not a Number，即不是一个数字），属于number类型的一种特殊状态，用于表示无法确定的值。



## 案例说明

###  typeof NaN

```js
console.log(typeof NaN); //number
```

说明：NaN是一个全局对象，属于number类型。



### Number("abc") & 0 / 0

```js
console.log(Number("abc")); //NaN 
console.log(0 / 0); //NaN
```

说明：当一个操作数不能被转换为有效的数字时，也就是无效结果，就会返回 NaN。



### NaN == NaN

```js
console.log(NaN == NaN); //false
```

说明：NaN不等于任何值，包含它本身，这是因为NaN表示的是一个不确切的值，代表一个范围。



### isNaN() & Number.isNaN()

```js
console.log(isNaN(NaN)); //true
console.log(isNaN("abc")); //true
console.log(isNaN(123)); //false

console.log(Number.isNaN(NaN)); //true
console.log(Number.isNaN("abc")); //false
console.log(Number.isNaN(123)); //false
```

说明：

- 可以通过`isNaN()`函数判断值是否为NaN。`isNaN()`函数会先尝试将其转换为数值类型，然后进行判断。如果值不能被转换为数字类型，isNaN() 函数会返回 true，这可能与预期结果不符，如`isNaN("abc")`返回true。
- 为了避免与预期不符合，可以使用`Number.isNaN()`函数进行判断。



