[toc]

# Node 模块

## 概述

将一个复杂的程序文件依据一定规则（规范）拆分成多个文件的过程称之为模块化。

其中拆分出的 每个文件就是一个模块 ，模块的内部数据是私有的，不过模块可以暴露内部数据以便其他模块使用。

**模块化优点：**

- 防止命名冲突。
- 高复用性。
- 高维护性。



## 使用

### 方式一：module.exports

**定义moduleA.js**

```javascript
function sayHello() {
  console.log("hello");
}

// 使用module.exprots暴露数据
module.exports = sayHello;
```

**使用**

```javascript
// 使用require引入模块
const sayHello = require("./moduleA.js");
sayHello();
```



**定义moduleA.js**

```javascript
const user = {
  name: "小明",
  age: 18,
  sayHello: function () {
    console.log("hello");
  },
};

module.exports = user;
```

**使用**

```javascript
const user = require("./moduleA.js");
user.sayHello();
console.log(user.name);
console.log(user.age);
```



### 方式二：exports

**定义moduleC.js**

```javascript
// 使用exports暴露数据
exports.sayHello = function () {
  console.log("hello");
};
exports.user = {
  name: "小明",
  age: 18,
};
```

**使用**

```javascript
const { sayHello, user } = require("./moduleC.js");
sayHello();
console.log(user.name);
console.log(user.age);
```



## 目录模块

在CommonJS中，我们可以使用目录作为模块，这被称为目录模块。目录模块的作用是将一组相关的模块组织在一起，方便管理和使用。

新建`moduleD`目录，并在其中新建`index.js`文件。

**index.js**

```javascript
const user = {
  name: "小花",
  age: 28,
  sayHello: function () {
    console.log("hello");
  },
};
module.exports = user;
```

**使用**

```javascript
const user = require("./moduleD");
user.sayHello();
console.log(user.name);
console.log(user.age);
```

### package.json配置

如果导入的路径是个文件夹，会先检查文件夹中是否存在 `package.json` 文件中 `main` 属性对应的文件，如果存在则导入，如果不存在则报错。

如果 `main` 属性不存在，或者 `package.json` 不存在，则会尝试导入文件夹下的 `index.js` 和 `index.json` ，如果还是没找到，就会报错。

在 `moduleD` 目录中新建 `package.json`文件，并定义 `main` 属性。
**package.json**

```json
{
  "main": "./my.js"
}
```

**my.js**

```javascript
const user = {
  name: "小白",
  age: 38,
  sayHello: function () {
    console.log("hello");
  },
};
module.exports = user;
```

**使用**

```javascript
const user = require("./moduleD");
user.sayHello();
console.log(user.name);
console.log(user.age);
```



## 引入模块的基本流程

1. 将相对路径转为绝对路径，定位目标文件。
2. 缓存检测。 
3. 读取目标文件代码。
4. 包裹为一个函数并执行（自执行函数）。通过 arguments.callee.toString() 查看自执行函数。
5. 缓存模块的值。
6. 返回 module.exports 的值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7467adb12df344269969a77171f2dd30.png)

