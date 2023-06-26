[TOC]

# art-template 模版引擎

## 概述

- art-template 是一个简约、超快的模板引擎
- 它采用作用域预声明的技术来优化模板渲染速度，从而获得接近 JavaScript 极限的运行性能，并且同时支持 NodeJS 和浏览器

[官方文档](http://aui.github.io/art-template/zh-cn/)



## 下载

在文档中下载并保存`template-web.js`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ec024aa0eda3456fa66e8cebd337c716.png)







## 使用

### 基本使用

art-template 支持标准语法与原始语法。标准语法可以让模板易读写，而原始语法拥有强大的逻辑表达能力。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>art-template</title>
    <script src="./template-web.js"></script>
  </head>
  <body>
    <div id="container1"></div>
    <div id="container2"></div>

    <script type="text/html" id="t-normal">
      <h1>标准语法</h1>
      <p>姓名：{{name}} 年龄：{{age}} 性别：{{sex?"男":"女"}}</p>
      <div>
        是否转义：
        <p>{{hello}} {{@ hello }}</p>
      </div>
      <div>
        <label>条件：</label>
        {{ if score<60 }} 
        不及格 
        {{ else if score <80 }}
        及格 
        {{ else }} 
        优秀
        {{/if}}
      </div>
      <div>
        <label>循环：</label>
        {{each address}} {{$index}} {{$value}} {{/each}}
      </div>
    </script>

    <script type="text/html" id="t-original">
      <h1>原始语法</h1>
      <p>姓名：<%= name %> 年龄：<%= age %> 性别：<%= sex?"男":"女" %></p>
      <div>
        是否转义：
        <p><%= hello %> <%- hello%></p>
      </div>
      <div>
        <label>条件：</label>
        <% if(score<60){ %>
            不及格
        <% } else if(score<80){ %>
            及格
        <% } else {%>
            优秀
        <% } %>
      </div>
      <div>
        <label>循环：</label>
        <% for(let i=0;i<address.length;i++){ %>
            <%= i %> <%= address[i] %>
        <% } %>
      </div>
    </script>
    <script>
      const content1 = document.querySelector("#container1");
      const content2 = document.querySelector("#container2");

      let user = {
        name: "小明",
        age: 18,
        sex: true,
        hello: "<span style='color:red;'>hello<span>",
        score: 88,
        address: ["广东省", "广州市", "黄埔区"],
      };

      // 渲染HTML结构
      content1.innerHTML = template("t-normal", user);
      content2.innerHTML = template("t-original", user);
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/313bd9e088134150a2029914d164ca5d.png)



### 使用子模版

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>
    <script id="my-template" type="text/html">
      {{include "header"}}
      <p>hello world</p>
      {{include "footer"}}
    </script>
    <script id="header" type="text/html">
      公共头部
    </script>
    <script id="footer" type="text/html">
      公共底部
    </script>
    <script>
      let container = document.getElementById("container");
      container.innerHTML = template("my-template", {});
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d55704de0c844c38883efa9de96df5f.png)



### 子模板传参

**原始语法：**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>
    <script id="my-template" type="text/html">
      <% include("header",{data:"abc"}) %>
      <p>hello world</p>
      <% include("footer",{data:"123"}) %>
    </script>
    <script id="header" type="text/html">
      公共头部 {{data}}
    </script>
    <script id="footer" type="text/html">
      公共底部 {{data}}
    </script>
    <script>
      let container = document.getElementById("container");
      container.innerHTML = template("my-template", {});
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d55704de0c844c38883efa9de96df5f.png)



## webpack中使用art-template

### 安装

```
npm install -D art-template-loader@1.4.3
npm install art-template@4.13.2
```

### 配置package.json

```json
{
  "name": "use_art-template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "webpack": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "art-template-loader": "^1.4.3",
    "html-webpack-plugin": "^4.3.0",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  },
  "dependencies": {
    "art-template": "^4.13.2"
  }
}
```

### 配置webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 获取绝对路径
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  mode: "development",
  // Webpack 入口文件
  entry: {
    index: "./src/index.js",
    list: "./src/list.js",
  },
  // Webpack 输出路径
  output: {
    // 输出的目录
    path: resolve("dist"),
    // 输出的文件名
    filename: "js/[name].js",
  },
  // source-map，调试用的，出错的时候，将直接定位到原始代码，而不是转换后的代码
  devtool: "cheap-module-eval-source-map",
  // 不同类型模块的处理规则
  module: {
    rules: [
      // 模板文件
      {
        test: /\.art$/,
        loader: "art-template-loader",
      },
    ],
  },
  plugins: [
    // 自动将依赖注入 html 模板，并输出最终的 html 文件到目标文件夹
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/list.art",
      filename: "list.html",
      chunks: ["list"],
    }),
  ],
};
```

### 编写源代码

新建`common/header.art`文件：

```
<header>公共头部：{{data}}</header>
```

新建`common/footer.art`文件：

```
<footer>公共底部：{{data}}</footer>
```

新建`index.art`文件：

```
<% include("./common/header.art",{data:"index头部"}) %>
<p>index页面</p>
<% include("./common/footer.art",{data:"index底部"}) %>
data: {{ data }}
```

新建`index.html`文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>index</title>
  </head>
  <body>
    <div id="content"></div>
  </body>
</html>
```

新建`index.js`文件：

```js
import render from "./index.art";
console.log("index.js");
let html = render({ data: "hello world" });
console.log(html);
let content = document.querySelector("#content");
content.innerHTML = html;
```

新建`list.art`文件：

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>list</title>
  </head>
  <body>
     <%  include("./common/header.art",{data:"list头部"}) %>
     <p>list页面</p>
     <%  include("./common/footer.art",{data:"list底部"}) %>
  </body>
</html>
```

新建`list.js`文件：

```js
console.log("list.js");
```

### 打包

执行命令：

```
npm run webpack
```

打包完成后如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/90a0307a690644e4b4b06e7954b8dba6.png)

打开`index.html`：

![在这里插入图片描述](https://img-blog.csdnimg.cn/31925341b3bf471ba70e3edfac438aa5.png)

打开`list.html`：

![在这里插入图片描述](https://img-blog.csdnimg.cn/eb5fa4e7b2db40fe85bfd5ced3d8770a.png)

