[toc]

# Babel 总结

## 概述

Babel 是一个 JavaScript 编译器，主要用于在当前和旧的浏览器或环境中，将 ECMAScript 2015+ 代码转换为 JavaScript 向后兼容版本的代码。



## 安装

```
npm install --save-dev @babel/core @babel/cli
```

```
npm install @babel/preset-env --save-dev
```

- `@babel/cli` 是Babel的命令行工具，可用于在终端中使用Babel进行编译。
- `@babel/core` 是Babel的核心库，包括了转换代码的逻辑和API。
- `@babel/preset-env` 是一个Babel预设，它包含了一系列的插件，能够根据您所声明的目标环境自动为您生成转换代码的插件列表。例如，如果您声明了目标环境是Chrome 58，则@babel/preset-env会自动选择生成Chrome 58支持的代码。



## 使用

### 一、添加配置文件

创建 `.babelrc` 或 `babel.config.json` 文件，并写入：

```
{
  "presets": ["@babel/preset-env"]
}
```

### 二、编写源代码

1. 创建 `src` 文件夹用于编写源代码，在 `src` 目录下新建 `my_babel.js` ，写入源代码。
2. 创建 `dist `文件夹用于保存编译后代码。


```js
// my_babel.js
let name = "小明";
const age = 18;
let address = ["广东省"];
let newAddress = [...address, "广州市"];

new Promise((resolve, reject) => {
  resolve("成功");
});

Array.from([1, 2]);

class Person {}

import "./index.js";
```

### 三、配置package.json

```json
{
  "scripts": {
    "build": "babel src -d dist"
  },
  "devDependencies": {
    "@babel/cli": "^7.21.5",
    "@babel/core": "^7.21.8",
    "@babel/preset-env": "^7.21.5"
  }
}
```

- src表示源代码目录。
- dist表示目标代码目录。

### 四、编译代码

执行命令：

```
npm run build
```

编译完成后，会在dist目录下生成`my_babel.js`文件。



## 对比代码

![在这里插入图片描述](https://img-blog.csdnimg.cn/6a59f11e8a084e6daa38ebfd1519d061.png)

Babel可以编译ES6的大部分语法，如：let。const、剪头函数、类等。

但对于ES6新增的API，如：promise、Set、Map、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign/Array.from）都不能直接编译，需要借助其它的模块。



