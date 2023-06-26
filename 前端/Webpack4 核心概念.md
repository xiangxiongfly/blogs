[toc]

# Webpack4 核心概念

## 概述

Webpack 是一个现代化的静态资源打包工具，它能够将多个静态资源（例如：JavaScript、CSS、图片等）打包成一个或多个文件，使用的是类似于模块化的方式进行开发。

它不仅可以将多个小文件打包成一个大文件，还可以对这些文件进行进一步的优化（例如：代码压缩、混淆、按需加载等），以便减少用户的等待时间，提高网站性能。

Webpack 支持大量的插件和 Loader，用于解决各种各样的问题。例如：可以使用 babel-loader 来处理 ES6 语法；使用 css-loader 和 style-loader 来处理 CSS 文件；使用 file-loader 和 url-loader 来处理图片和其他文件等。

Webpack 的配置文件 webpack.config.js 提供了丰富的配置选项，用于自定义开发过程，比如定义 entry（入口文件）和 output（出口文件）；对多个文件进行代码分割；定义 loaders 和 plugins 等。

在现代Web应用开发中，我们通常使用一些模块化打包工具来管理以及打包我们的应用。而这些打包工具，比如Webpack、Rollup、Parcel等，都提供了对CSS文件的模块化支持，使得我们可以像引入JS文件一样，直接引入CSS文件，进行模块依赖关系管理。

[官方文档](https://www.webpackjs.com/)



## 安装webpack

执行命令：

```
npm install --save-dev webpack-cli@3.3.12 webpack@4.44.1
```



## 简单使用

### 配置webpack.config.js

新建 `webpack.config.js` 文件，并写入：

```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

### 配置package.json

```
{
  "name": "webpack_demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "webpack": "webpack --config webpack.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.82.1",
    "webpack-cli": "^5.1.1"
  }
}
```

### 打包

执行命令：

```
npm run webpack
```

打包完后目录结构如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e572e78a23684ff880728fc878eeb443.png)



## 核心概念

### mode

- development：开发模式，会开启更加详细的调试信息和提示，同时也可以增加对开发阶段的注重点，例如热更新等。
- production：生产模式，针对代码做各种优化，例如压缩js代码、去掉未使用的代码、代码分离等。
- none：默认值。

### entry 和 output

- entry 表示 Webpack 构建的入口文件，也就是 Webpack 从哪个文件开始打包。
- output 表示 Webpack 构建生成的文件输出路径和文件名。

#### entry配置说明

- entry可以是字符串，也可以是对象。如果是字符串表示程序的入口；如果是对象可以指定多个入口。

#### output配置说明

- filename：输出文件名称。
  - 可以使用占位符，如：[name]、[id]、[hash]表示文件名、id、hash值。
- path：输出的绝对路径。

#### 配置单入口

配置webpack.config.js：

```
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2c4eb03bbe6b4298bcb9445f07a78fb4.png)

#### 配置多入口

配置webpack.config.js：

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
    search: "./src/search.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/59aa49a36f3348d4b254c551988f5308.png)



### loader

在 Webpack 中，Loader 和 Plugin 都是用于加强其打包功能的机制，但它们的作用和用法有所不同。

- Loader：用于将模块的原始源代码转换成 Webpack 可以处理的有效模块。(比如将 ES6/ES7/JSX 等语法转译成 ES5)。每个 Loader 只负责单一的转换过程，而多个 Loader 可以串联使用，形成一个 Loader 链（Webpack 根据 Loader 链引用 Loader）。常见的 Loader 有 `babel-loader`，`style-loader`，`css-loader` 等。
- Plugin：通过在构建流程的不同阶段 hook 功能实现对代码的加工或操作。(比如生成 HTML 文件、压缩代码等)。Plugin 可以在整个 Webpack 构建周期内挂载事件钩子，用于监听 Webpack 并可修改其内部的参数和结果，进而对打包后的数据进行加工处理。常见的 Plugin 有 `HtmlWebpackPlugin`，`UglifyJsPlugin`，`clean-webpack-plugin` 等。

这里以babel-loader为例子。

#### 安装babel、babel-loader、core-js

```
//安装webpack
npm install --save-dev webpack-cli@3.3.12 webpack@4.44.1
//安装babel
npm install --save-dev @babel/core @babel/preset-env
//安装babel-loader
npm install --save-dev babel-loader@8.1.0
//安装core-js
npm install --save-dev core-js
```

- babel是JavaScript编译器，用于将ES6+代码转为低版本的JavaScript代码。
- babel-loader是webpack的加载器。
- core-js是用于编译新增API的。

#### 配置.babelrc

新建 `.babelrc` 文件，并写入：

```
{
  "presets": ["@babel/preset-env"]
}
```

#### 配置webpack.config.js

新建 `webpack.config.js` 文件，并写入：

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
      	// 检查文件类型
        test: /\.js$/,
        // 排除文件
        exclude: /node_modules/,
        // 使用指定loader
        loader: 'babel-loader'
      }
    ]
  }
};
```

#### 配置package.json

```
"scripts": {
	"webpack": "webpack --config webpack.config.js"
},
```

#### 编写源代码

新建 `src` 文件夹，在其中写入 `index.js` 文件：

```js
import 'core-js/stable';

let name = 'Alex';
const age = 18;
console.log(name, age);

const add = (x, y) => x + y;
console.log(add(1, 1));

new Promise((resolve, reject) => {
  resolve('成功');
}).then(value => {
  console.log(value);
});

console.log(Array.from([1, 2]));

class Person {
  constructor(name, age) {
    Object.assign(this, { name, age });
  }
}
new Person('Alex', 18);
```

#### 编译源代码

执行命令：

```
npm run webpack
```

编译完成后如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f51e0f41b22b44229a8e1c817c17fa01.png)



### plugins

`html-webpack-plugin` 是一个 Webpack 插件，它可以将生成的 JavaScript 文件自动插入到生成的 HTML 文件中，并可以根据模板生成 HTML 文件，同时还支持代码压缩、文件指纹等功能。

#### 安装html-webpack-plugin

```
npm install --save-dev html-webpack-plugin@4.3.0
```

#### HTMLWebpackPlugin配置说明

- template：指定HTML模板文件位置。
- filename：生成HTML文件名。
- chunks：指定需要注入的文件。
- minify：对HTML文件进行压缩。
- hash：为生成的HTML文件名添加hash值。
- title：指定HTML的title。
- meta：指定HTML的meta标签。
- favicon：指定HTML的favicon。

#### 配置单入口

新建 `webpack.config.js` 文件，并写入：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 模板文件路径
      template: "./index.html",
    }),
  ],
};
```

**编写源代码**

新建 `index.html` 和 `src/index.js` 文件。

**编译源代码**

执行命令：

```
npm run webpack
```

编译完成目录如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/3d71b920e87843808af3028e82ec9b2d.png)

#### 配置多入口

配置 `webpack.config.js` 文件：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["index"],
      minify: {
        // 删除html中的注释
        removeComments: true,
        // 删除html中空格
        collapseWhitespace: true,
        // 删除html中的属性值双引号
        removeAttributeQuotes: true,
      },
    }),
    new HtmlWebpackPlugin({
      // 模板文件路径
      template: "./search.html",
      // 生成的文件名
      filename: "search.html",
      // 注入的文件
      chunks: ["search"],
    }),
  ],
};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/049dd673f19846178baea1c2652db845.png)

