[toc]

# Express 使用

## 概述

express 是一个基于 Node.js 平台的极简、灵活的 WEB 应用开发框架。

官方网址：https://www.expressjs.com.cn



## 下载Express

```
npm i express
```



## 简单使用

一、创建js文件，写入下面代码：

```javascript
// 导入express
const express = require("express");

// 创建应用对象
const app = express();

// 创建路由规则
app.get("/home", (request, response) => {
  response.end("hello express server");
});

// 启动服务，并监听端口
app.listen(9000, () => {
  console.log("服务器启动了");
});
```

二、执行命令：

```
node <"文件名">
//或
nodemon <"文件名">
```

三、在浏览器输入`http://127.0.0.1:9000/home`就能访问了。



## Express 生成器

### 安装生成器

```
npm install -g express-generator
```

### 使用

一、使用`express -e myapp`命令，创建名为myapp的Express应用程序。

![在这里插入图片描述](https://img-blog.csdnimg.cn/65b247229a2a48388f2ec7f0a9b54742.png)

二、使用`npm i`命令，安装依赖。

三、使用`npm start`命令运行项目。

四、在浏览器端通过`http://127.0.0.1:3000`就能访问Express程序。



## 基本路由

官方定义： 路由确定了应用程序如何响应客户端对特定端点的请求。

### 使用路由

**语法**

一个路由的组成有：请求方法、路径、回调函数。

格式如下：

```
app.<method> (path, callback)
```

**使用**

```javascript
// 导入express
const express = require("express");

// 创建应用对象
const app = express();

// 首页路由
app.get("/", (request, response) => {
  response.end("首页");
});

// get请求
app.get("/home", (request, response) => {
  response.end("home页面");
});

// post请求
app.post("/login", (request, response) => {
  response.send("登录成功");
});

// 匹配所有的请求方法
app.all("/search", (request, response) => {
  response.send("搜索成功");
});

// 定义404
app.all("*", (request, response) => {
  response.send("404 Not Found");
});

// 启动服务，并监听端口
app.listen(9000, () => {
  console.log("服务器启动了");
});
```

### 获取请求数据

```javascript
const express = require("express");

const app = express();

app.all("/search", (request, response) => {
  // 获取请求方法
  console.log(request.method); 
  // 获取url
  console.log(request.url); 
  // 获取http版本
  console.log(request.httpVersion); 
  // 获取请求头
  console.log(request.headers); 
  // 获取指定请求头
  console.log(request.get("host"));
  // 获取url参数，是JSON对象格式
  console.log(request.query); 
  response.send("搜索成功");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

### 获取路由参数

路由参数指：URL路径中的参数。

```javascript
app.all("/search/:keyword", (request, response) => {
  // 获取路由参数
  console.log(request.params.keyword);
  response.send("搜索成功");
});
```

### 处理请求体

Express没有内置获取请求体的API，需要借助第三方包`body-parser`。

**安装body-parser**

```
npm i body-parser
```

**使用**

```javascript
const express = require("express");
// 导入body-parser
const bodyParser = require("body-parser");

const app = express();

// 处理querystring格式，application/x-www-form-urlencoded
let urlParser = bodyParser.urlencoded({ extended: false });
// 处理json格式，application/json
let jsonParser = bodyParser.json();

// 设置中间件使用body-parser
app.all("/search1", urlParser, (request, response) => {
  console.log(request.body); //[Object: null prototype] { name: 'Tom', age: '18' }
  console.log(request.body.name); //Tom
  response.send("search1");
});

app.all("/search2", jsonParser, (request, response) => {
  console.log(request.body); //{ name: 'Jake', age: 19 }
  console.log(request.body.name); //Jake
  response.send("search2");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```



## 设置响应

### 方式一：兼容http模块

```javascript
const express = require("express");

const app = express();

app.all("/search", (request, response) => {
  // 设置http状态码
  response.statusCode = 404;
  // 设置http状态描述
  response.statusMessage = "Not Found";
  // 设置响应头
  response.setHeader("name", "Tom");
  response.setHeader("age", 18);
  // 设置响应体
  response.write("响应体1");
  response.write("响应体2");
  response.end("hello express");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

### 方式二：express的响应方法

```javascript
const express = require("express");

const app = express();

app.all("/search", (request, response) => {
  //   response.status(404);
  //   response.set("name", "Tom");
  //   response.set("age", 18);
  //   response.send("响应体");
	
  // 连续调用
  response.status(404).set("name", "Tom").set("age", 18).send("响应体");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

### 其他响应

```javascript
// 重定向
response.redirect("https://www.baidu.com/");
```

```javascript
// 下载
response.download("./package.json");
```

```javascript
// 响应JSON
let users = [
    { name: "Tom", age: 18, address: "北京" },
    { name: "Jake", age: 28, address: "上海" },
    { name: "Mike", age: 38, address: "广州" },
];
response.json(users);
```

```javascript
// 响应文件
response.sendFile(__dirname + "/search.html");
```



## 中间件

### 简介

Express提供了全局中间件和路由中间件，用于处理应用程序的路由和请求。

中间件（Middleware）本质是一个回调函数。中间件函数可以像路由回调一样访问请求对象（request）、响应对象（response）。



### 全局中间件

全局中间件可以在应用程序的整个生命周期中使用，而不需要在每个组件中都使用。

express 允许使用 app.use() 定义多个全局中间件。

**日志记录**

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// 定义全局中间件
function recordMiddleware(request, response, next) {
  let { url, ip } = request;
  fs.appendFileSync(path.resolve(__dirname, "access.log"), `${url} ${ip}\r\n`);
  next();
}

// 使用全局中间件
app.use(recordMiddleware);

app.all("/search", (request, response) => {
  response.send("search");
});
app.all("/home", (request, response) => {
  response.send("home");
});
app.all("/login", (request, response) => {
  response.send("login");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

**判断是否登录**

```javascript
// 定义中间件
function checkLoginMiddleware(request, response, next) {
  if (request.query.token === "123") {
    next();
  } else {
    response.send("请先登录");
  }
}

// 可以设置多个全局中间件
app.use(recordMiddleware);
app.use(checkLoginMiddleware);
```



### 路由中间件

路由中间件通常用于处理路由请求。

```javascript
app.all(
  "/search",
  recordMiddleware,
  checkLoginMiddleware,
  (request, response) => {
    response.send("search");
  }
);
```



### 静态资源中间件

express 内置处理静态资源的中间件。

```javascript
const express = require("express");

const app = express();

// 设置静态资源中间件，讲public目录作为网站的跟目录
app.use(express.static("./public"));

app.all("/home", (request, response) => {
  response.send("home");
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

说明：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c5f86aaf334d42dbb5d9b79d8912e4fa.png)

在当前文件夹下新建public文件夹，并在public文件夹里新建home.html网页，接着在public文件夹里新建css文件夹，在css文件夹里新建home.css样式。

这时访问`http://127.0.0.1:9000/home`，Express会返回“home”。

访问`http://127.0.0.1:9000/home.html`，Express会返回home.html的网页内容和css样式。



## Router

### 简介

Express 中的 Router 是一个完整的中间件和路由系统，可以看做是一个小型的 app 对象。

Router的作用是对路由进行模块化，更好的管理路由。

路由的行为类似于中间件本身，因此您可以将其用作 [app.use()](https://nodejs.cn/express/4x/api/router/##84e22a74db12425391fb745786da7669) 的参数或用作另一个路由的 [use()](https://nodejs.cn/express/4x/api/router/##1cd1b38b4faf467eb01d55e4bc080381) 方法的参数。



### 使用

新建routes文件夹，在其中新建homeRouter.js文件并写入下面代码：

```javascript
// 导入Express
const express = require("express");

// 创建路由器对象
const router = express.Router();

// 定义路由
router.get("/", (request, response) => {
  response.send("首页");
});

// 定义路由
router.get("/search", (request, response) => {
  response.send("search页面");
});

// 暴露路由器对象
module.exports = router;
```

在主文件中使用子路由：

```javascript
const express = require("express");

const app = express();

// 引入子路由
const homeRouter = require("./routes/homeRouter");

// 使用子路由
app.use(homeRouter);

app.listen(9000, () => {
  console.log("服务器启动了");
});
```

说明：

在浏览器中输入`http://127.0.0.1:9000/`，Express返回“首页”；

输入`http://127.0.0.1:9000/search`，Express返回“search页面”。



### 路由前缀

```javascript
// 设置路由前缀
app.use("/home", homeRouter);
```

说明：

在浏览器中输入`http://127.0.0.1:9000/home`，Express返回“首页”；

输入`http://127.0.0.1:9000/home/search`，Express返回“search页面”。



## EJS 模板引擎

### 简介

模板引擎是分离 用户界面和业务数据 的一种技术。

EJS 是一个高效的 Javascript 的模板引擎。

官网: https://ejs.co/

中文站：https://ejs.bootcss.com/



### 安装EJS

```
npm i ejs
```



### 语法

```
<% code %> ：执行js代码。
<%= code %>：输出转义的数据到模板上
<%- code %>：输出非转义的数据到模板上
```



### 简单使用

```javascript
const express = require("express");
// 导入ejs
const ejs = require("ejs");

const app = express();

app.get("/", (request, response) => {
  let persons = ["张三", "李四", "王五"];
  // 渲染
  let html = ejs.render('<%= persons.join(",") %>', { persons });
  response.send(html);
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```



### 配合html使用

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
    <p>姓名：<%= name %></p>
    <p>年龄：<%= age %></p>
    <ul>
      <% address.forEach(item => { %>
      <li><%= item %></li>
      <% }) %>
    </ul>
  </body>
</html>
```

```javascript
const express = require("express");
const fs = require("fs");
// 导入ejs
const ejs = require("ejs");

const app = express();

app.get("/", (request, response) => {
  let name = "小明";
  let age = 18;
  let address = ["广东省", "广州市", "白云区"];
  // 读取html
  let html = fs.readFileSync("./index.html").toString();
  // 渲染
  let bodyData = ejs.render(html, { name, age, address });
  response.send(bodyData);
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```



### 设置模板引擎

步骤一：新建views文件夹，在其中新建home.ejs文件，类似于HTML页面，可以使用ejs语法，写入下面代码：

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>姓名：<%= name %></p>
    <p>年龄：<%= age %></p>
    <ul>
      <% address.forEach(item => { %>
      <li><%= item %></li>
      <% }) %>
    </ul>
  </body>
</html>
```

步骤二：在主文件中写入下面代码：

```javascript
const express = require("express");
const path = require("path");

const app = express();

// 设置模板引擎
app.set("view engine", "ejs");
// 设置模板文件存放路径
app.set("views", path.resolve(__dirname, "views"));

app.get("/home", (request, response) => {
  let name = "小明";
  let age = 18;
  let address = ["广东省", "广州市", "白云区"];
  // 渲染
  response.render("home", { name, age, address });
});

app.listen(9000, () => {
  console.log("服务器启动了");
});
```



## 文件上传

文件上传需要解析请求体，可以使用第三方包`formidable`，安装如下：

```
npm install formidable
```

一、新建index.ejs视图文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>文件上传</title>
  </head>
  <body>
    <h2>文件上传</h2>
    <form action="/portrait" method="post" enctype="multipart/form-data">
      <p>用户名：<input type="text" name="username" /></p>
      <p>头像：<input type="file" name="portrait" /></p>
      <button>提交</button>
    </form>
  </body>
</html>
```

二、新建index.js路由文件：

```javascript
const express = require("express");
const formidable = require("formidable");
var router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.get("/portrait", (request, response) => {
  response.render("portrait");
});
router.post("/portrait", (request, response) => {
  const form = formidable({
    multiples: true,
    // 上传文件的保存目录
    uploadDir: __dirname + "/../public/images",
    // 保持文件后缀名
    keepExtensions: true,
  });
  // 解析请求体
  form.parse(request, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    let url = "/images/" + files.portrait.newFilename;
    response.send(url);
  });
});

module.exports = router;
```

