[TOC]

# ES6 Promise

## 概述

Promise是在ES6中新增的一种用于解决异步编程的方案。

Promise可以用来解决回调地狱问题。



## Promise生命周期

每个Promise对象有3种状态：

- pending：进行中
- fulfilled：已完成
- rejected：已失败

Promise在创建时处于pending状态；执行成功时，由pending转为fulfilled状态；执行失败时，由pending转为rejected状态。

状态一旦发生改变，就不能再改变。



## 基本用法

### Promise基本使用

Promise创建后会立即执行。

Promise构造函数会接收一个函数，该函数有两个参数分为为resolve和reject：
- 执行`resolve()`方法：Promise状态由pending转变为fulfilled，表示执行成功。
- 执行`reject()`方法：Promise状态由pending转变为rejected，表示执行失败。

```javascript
let promise = new Promise(function(resolve, reject) {
    console.log("hello promise");
    resolve();
});
promise.then(function() {
    console.log("resolve");
});
console.log("hello");

// hello promise
// hello
// resolve
```



### then

then()方法可以接收两个回调函数：

- 第一个回调函数是Promise对象的状态变为`resolved`时调用。
- 第二个回调函数是Promise对象的状态变为`rejected`时调用。这两个回调函数是可选的。

在then()函数中不能返回Promise实例本身，否则会出现Promise循环引用的问题，抛出异常。

```javascript
new Promise((resolve, reject) => {
    resolve("hello 成功");
    // reject("hello 失败");
})
    .then(
    (succssMsg) => {
        console.log(`成功回调：${succssMsg}`);
    },
    (errMsg) => {
        console.log(`失败回调：${errMsg}`);
    }
);
//成功回调：hello 成功
```

```javascript
//处理地狱回调
new Promise((resolve, reject) => {
    resolve(1)
}).then(result => {
    console.log(result);
    return 2;
}).then(result => {
    console.log(result);
    return 3;
}).then(result => {
    console.log(result);
    return 4;
}).then(result => {
    console.log(result);
})
// 1
// 2
// 3
// 4
```



### catch

catch()方法是专门处理失败状态。

```javascript
new Promise((resolve, reject) => {
    reject("hello 失败");
})
    .then(
    succssMsg => {
        console.log(`成功回调：${succssMsg}`);
    }
)
    .catch(
    errMsg => {
        console.log(`失败回调：${errMsg}`);
    }
);
//失败回调：hello 失败
```

```javascript
new Promise((resolve, reject) => {
    try {
        throw new Error('失败了');
    } catch (err) {
        reject(err);
    }
})
    .catch((err) => {
    console.log(err); // Error: test
});
//Error: 失败了

//在Promise执行过程中出现了异常，就会被自动抛出，并触发reject(err)，而不用我们去使用try...catch，在catch()函数中手动调用reject()函数。
//因此前面的代码可以改写成如下所示的代码：
new Promise((resolve, reject) => {
    throw new Error('失败了');
})
    .catch((err) => {
    console.log(err); 
});
```



### finally

finally()方法是最后一定会被执行。

```javascript
new Promise((resolve, reject) => {
    resolve("hello 成功");
})
    .then(
    (succssMsg) => {
        console.log(`成功回调：${succssMsg}`);
    }
)
    .catch(
    (errMsg) => {
        console.log(`失败回调：${errMsg}`);
    }
)
    .finally(
    () => {
        console.log("执行完毕");
    }
);
//成功回调：hello 成功
//执行完毕
```

```javascript
new Promise((resolve, reject) => {
    null.name;
})
    .then(
    (succssMsg) => {
        console.log(`成功回调：${succssMsg}`);
    }
)
    .catch(
    (errMsg) => {
        console.log(`失败回调：${errMsg}`);
    }
)
    .finally(
    () => {
        console.log("执行完毕");
    }
);
// 失败回调：TypeError: Cannot read property 'name' of null
// 执行完毕
```



### Promise.all()

- `Promise.all()`观察所有Promise对象的状态变化。
- 所有状态为resolved时，最终状态才会变为resolved。
- 只要有一个为rejected，最终状态为rejected。

```java
const p1 = new Promise((resolve, reject) => {
    resolve("yes1");
});

const p2 = new Promise((resolve, reject) => {
    resolve("yes2");
});

Promise.all([p1, p2])
    .then(result => console.log("成功：" + result))
    .catch(err => console.log("失败：" + err));
//成功：yes1,yes2
```

```javascript
const p1 = new Promise((resolve, reject) => {
    resolve("yes1");
});

const p2 = new Promise((resolve, reject) => {
    null.name;
});

Promise.all([p1, p2])
    .then(result => console.log("成功：" + result))
    .catch(err => console.log("失败：" + err));
//失败：TypeError: Cannot read property 'name' of null
```



### Promise.race()

Promise.race()状态取决于最先完成的Promise实例对象，如果第一个完成对象的成功了，那最终就成功；如果第一个完成对象的失败，那就最终失败。

```javascript
const p1 = new Promise((resolve, reject) => {
    reject("no1");
});

const p2 = new Promise((resolve, reject) => {
    resolve("yes2");
});

Promise.race([p1, p2])
    .then(
    result => console.log("成功：" + result)
)
    .catch(
    err => console.log("失败：" + err)
);
//失败：no1
```



### Promise.allSettled()

Promise.allSettled()会记录所有Promise对象的状态，只有等这些对象都返回结果才会结束。

```javascript
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("yes1");
    }, 2000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("no2");
    }, 1000);
});

Promise.allSettled([p1, p2])
    .then(
    results => {
        console.log(results);
        console.log(Array.isArray(results));
    }
);
//[{status: "fulfilled", value: "yes1"},{status: "rejected", reason: "no2"}]
//true
```



### Promise.resolve()

Promise.resolve()成功状态简写。

```javascript
Promise.resolve("hello 成功")
//等价于
new Promise(resolve => resolve("成功"));
```



###  Promise.reject()

 Promise.reject()失败状态简写。

```javascript
Promise.reject("hello 失败");
//等价于
new Promise((resolve, reject) => reject("hello 失败"));
```



## 其他场景

### Promise对象重复执行

同一个Promise的实例只能有一次状态变换的过程，在状态变换完成后，如果成功会触发所有的then()函数，如果失败会触发所有的catch()函数。

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("hello");
        const start = Date.now();
        resolve(start);
    }, 1000);
});

promise.then((res) => {
    console.log(res);
});

promise.then((res) => {
    console.log(res);
});

// hello
// 1674011880245
// 1674011880245
```

### then()函数中返回一个异常

```javascript
Promise.resolve()
    .then(() => {
    console.log(1);
    return null.name;
})
    .then(value => {
    console.log(2);
    console.log(`then: ${value}`);
})
    .catch(reason => {
    console.log(3);
    console.log(`catch: ${reason}`);
});
// 1
// 3
// catch: TypeError: Cannot read property 'name' of null
```

说明：执行到`null.name`时发生了异常，所以会执行catch代码。

```javascript
Promise.resolve()
    .then(() => {
    console.log(1);
    return new Error("失败了");
})
    .then(value => {
    console.log(2);
    console.log(`then: ${value}`);
})
    .catch(reason => {
    console.log(3);
    console.log(`catch: ${reason}`);
});
// 1
// 2
// then: Error: 失败了
```

说明：执行到` return new Error("失败了");`，会正常执行并将结果传递到下一个then代码，这里是将Error对象当作参数进行传递了。



## 案例

### 使用Promise封装Ajax请求

```javascript
function ajax(url, method, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = function() {
            reject(new Error("Network error"));
        }
        xhr.send(data);
    });
}

ajax("https://jsonplaceholder.typicode.com/posts", "GET")
    .then(response => {
    console.log(JSON.parse(response));
}).catch(error => {
    console.log(error.message);
});
```

### 异步加载图片

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<img id="myImg">
		<script>
			let myImg = document.querySelector("#myImg");

			const asyncLoadImage = (url) => {
				return new Promise((resolve, reject) => {
					var image = new Image();
					image.src = url;

					image.onload = () => {
						resolve(image.src);
					};
					image.onerror = () => {
						reject(new Error("加载失败"));
					};
				});
			};

			asyncLoadImage("https://www.baidu.com/img/flexible/logo/pc/result@2.png")
				.then(
					(value) => {
						console.log(value);
						myImg.src = value;
					})
				.catch(
					(reason) => {
						console.log(reason);
					});
		</script>
	</body>
</html>
```



