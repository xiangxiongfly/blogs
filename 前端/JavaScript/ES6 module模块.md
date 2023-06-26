[TOC]

# ES6 module模块

## 概述

ES6中的module指的是JavaScript模块化规范中的一种。它通过export和import语法来导出和导入模块中的变量、函数、类等内容。

使用ES6模块化的好处包括：解决了模块化的问题。消除了全局变量。管理加载顺序。



## 使用

- 在ES6模块中，一个文件代表一个模块
- 当使用`script`标签加载模块时，需要加`type="module"`。
- export命令用于导出内容。
- import命令用于导入内容。

![在这里插入图片描述](https://img-blog.csdnimg.cn/cd2c2651817c4b7ebc1500c027babe6a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/12ef3a3d2b5d456ba4e71705753936ab.png)



### export default 和 import

- 一个模块只能有一个`export default`。
- 相同内容的import命令只会执行一次。

#### 方式一：导出变量

```js
// module.js

const age = 18;
export default age;
```

```js
import age from "./module.js";
console.log(age); //18
```

等价于下面：

```js
// module.js

export default 18;
```

```js
import age from "./module.js";
console.log(age); //18
```

#### 方式二：导出方法

```js
// module.js

function sayHello() {
  console.log("hello");
}
export default sayHello;
```

```js
import sayHello from "./module.js";
sayHello();
```

等价于下面：

```js
// module.js

export default function () {
  console.log("hello");
}
```

```js
import sayHello from "./module.js";
sayHello();
```

#### 方式三：导出对象

```js
// module.js

let user = { name: "小明", age: 18 };
export default user;
```

```js
import user from "./module.js";
console.log(`${user.name}今年${user.age}岁`);
```

等价于下面:

```js
// module.js

export default { name: "小明", age: 18 };
```

```js
import user from "./module.js";
console.log(`${user.name}今年${user.age}岁`);
```



### export 和 import

#### 方式一

```js
// module.js

let name = "小明";
let age = 18;
function sayHello() {
  console.log("hello");
}
export { name, age, sayHello };
```

```js
import { name, age, sayHello } from "./module.js";
console.log(name); //小明
console.log(age); //18
sayHello(); //hello
```

#### 方式二

```js
// module.js

export let name = "小明";
export let age = 18;
export function sayHello() {
  console.log("hello");
}
```

```js
import { name, age, sayHello } from "./module.js";
console.log(name); //小明
console.log(age); //18
sayHello(); //hello
```



### 别名

#### 导出别名

```js
// module.js

let name = "小明";
let age = 18;
function sayHello() {
  console.log("hello");
}
export { name as name2, age as age2, sayHello as sayHello2 };
```

```js
import { name2, age2, sayHello2 } from "./module.js";
console.log(name2); //小明
console.log(age2); //18
sayHello2(); //hello
```

#### 导入别名

```js
// module.js

let name = "小明";
let age = 18;
function sayHello() {
  console.log("hello");
}
export { name, age, sayHello };
```

```js
import {
    name as name2,
    age as age2,
    sayHello as sayHello2,
} from "./module.js";
console.log(name2); //小明
console.log(age2); //18
sayHello2(); //hello
```

#### 整体别名

```js
// module.js

let name = "小明";
let age = 18;
function sayHello() {
  console.log("hello");
}
export { name, age, sayHello };
```

```js
import * as obj from "./module.js";
console.log(obj.name); //小明
console.log(obj.age); //18
obj.sayHello(); //hello
```



### export default 和 export混用

**导出**

```js
// module.js

let name = "小明";
let age = 18;
function sayHello() {
  console.log("hello");
}
export { name, age, sayHello };
export default "北京市";
```
**导入**

```js
import address from "./module.js";
import { name, age, sayHello } from "./module.js";
console.log(address); //北京市
console.log(name); //小明
console.log(age); //18
sayHello(); //hello
```

等价于下面：

```js
// export default必须放在前面
import address, { name, age, sayHello } from "./module.js";
console.log(address); //北京市
console.log(name); //小明
console.log(age); //18
sayHello(); //hello
```



## this指向问题

- 在js中，顶层的this指向window对象。
- 模块中，顶层的this指向undefined。

```js
// module.js

console.log(this);
```

```js
<script src="./module.js"></script>
<script src="./module.js" type="module"></script>
```

打印输出：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a37bf46d9f8443e9e9600d63f9c6b3f.png)



## import 和 import()

- import命令具有提升作用，会提升到整个模块的头部，并率先执行。
- import()是一个函数，可以动态导入，返回一个promise对象。

```js
// mobile.js

export default "这是移动端";
```

```js
// pc.js

export default "这是PC端";
```

```js
let isPc = true;
if (isPc) {
    import("./pc.js").then((module) => {
        console.log(module.default);
    });
} else {
    import("./mobile.js").then((module) => {
        console.log(module.default);
    });
}
```



## 导入导出复合写法

```js
// module1.js

export const age = 18;
```

```js
// module2.js

import { age } from "./module1.js";
export { age };
```

```js
import { age } from "./module2.js";
console.log(age); //18
```

module2.js可简写为：

```js
// module2.js

export { age } from "./module1.js";
```



## 模块的继承

```javascript
//base.js

let name = "Tom";
let age = 28;
let address = "beijing";

export { name, age, address }
```

```javascript
//children.js

export * from "./base.js"
export function sayHello() {
    console.log("sayHello");
};
```

```html
<script type="module">
    import * as myobj from "./js/children.js";

    console.log(myobj.name, myobj.age, myobj.address);
    myobj.sayHello();
</script>

//Tom 18 beijing
//sayHello
```



## module加载的本质

ES6模块的运行机制是这样的：当遇到import命令时，不会立马去执行模块，而是生成一个动态的模块只读引用，等到需要用到时，才去解析引用对应的值。

由于ES6的模块获取的是实时值，就不存在变量的缓存。

**实施性体现**

```javascript
//export1.js
export let count = 1;
export function add() {
	count++;
}
```

```html
<img id="myImg">
<script type="module">
    import {count,add} from "./js/export1.js";
    console.log(count); //1
    add();
    add();
    console.log(count); //3
</script>
```

