[toc]

# JavaScript async和await总结

## 概述

`async/await` 是在ES8（也称为ES2017）中引入的。它是一种用于处理异步操作的语法糖，可让异步代码更容易编写和阅读。

async/await 是以更舒适的方式使用 Promise 的一种特殊语法，同时它也非常易于理解和使用。



## async

async函数会返回一个promise。

```js
async function myfun() {
    return "hello";
}

console.log(myfun()); //Promise
```

使用async函数处理数据：

```js
async function myfun() {
    return "hello";
}

myfun().then((value) => {
    console.log(value);
});

//hello
```

等价于下面：

```js
async function myfun() {
    return Promise.resolve("hello");
}

myfun().then((value) => {
    console.log(value);
});
```



## await

关键字 `await` 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。

`await` 实际上会暂停函数的执行，直到 promise 状态变为 Fulfilled，然后以 promise 的结果继续执行。这个行为不会耗费任何 CPU 资源，因为 JavaScript 引擎可以同时处理其他任务：执行其他脚本，处理事件等。

不能再普通函数中使用await。

```js
async function myfun() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("成功"), 3 * 1000);
  });
  let result = await promise; //等待3s
  console.log(result);
}
myfun();

// 成功
```


```js
function getData1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("hello");
        }, 3 * 1000);
    });
}
function getData2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("world");
        }, 2 * 1000);
    });
}
async function handleData() {
    let result1 = await getData1();
    let result2 = await getData2();
    console.log(result1, result2); //等待5s
}
handleData();
```



## Error处理

如果一个 promise 正常 resolve，`await promise` 返回的就是其结果。但是如果 promise 被 reject，它将 throw 这个 error，就像在这一行有一个 `throw` 语句那样。

```js
async function fun() {
    throw new Error("失败了");
}
```

等价于下面：

```js
async function fun() {
    await Promise.reject(new Error("失败了"));
}
```

可以用 `try..catch` 来捕获上面提到的那个 error，与常规的 `throw` 使用的是一样的方式：

```js
async function myfun() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => reject("失败"), 3 * 1000);
  });
  try {
    let result = await promise; //等待3s
    console.log(result);
  } catch (e) {
    console.log("失败");
  }
}

myfun();

// 失败
```

或者：

```js
async function myfun() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => reject("失败"), 3 * 1000);
  });
  let result = await promise; //等待3s
  console.log(result);
}

myfun().catch((e) => {
  console.log("失败");
});

// 失败
```

