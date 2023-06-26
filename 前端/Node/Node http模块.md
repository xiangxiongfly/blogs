[toc]

# Node http模块

## 概述

http模块提供了创建 HTTP 服务器和客户端的功能。



## 创建http服务

```javascript
// 导入http模块
const http = require("http");

// 创建服务
// request：请求报文的封装对象，可以通过request对象获取请求报文信息
// response：响应报文的封装对象，可以通过response对象设置响应报文
const server = http.createServer((request, response) => {
  // 设置编码集，处理响应内容的中文乱码问题
  response.setHeader("content-type", "text/html;charset=utf-8");
  response.end("hello哈喽");
});

// 监听端口
server.listen(9000, () => {
  console.log("服务器启动了");
});
```

通过 `node 文件名.js` 命令启动服务器。

浏览器通过URL `http://127.0.0.1:9000` 或 `http://localhost:9000` 访问服务器。



## 获取请求报文

| 方法                                                         | 说明            |
| ------------------------------------------------------------ | --------------- |
| request.method                                               | 获取请求方法    |
| request.httpVersion                                          | 获取http版本    |
| request.url                                                  | 获取请求路径url |
| request.headers                                              | 获取请求头      |
| request.on("data", (*chunk*) => { })<br />request.on("end", () => { }) | 获取请求体      |

```javascript
const http = require("http");

const server = http.createServer((request, response) => {
  // 获取请求方法
  console.log("请求方法：", request.method);

  // 获取http版本
  console.log("http版本：", request.httpVersion);

  // 获取请求路径
  console.log("请求url：", request.url);

  // 获取请求头
  console.log("headers：", request.headers);

  // 获取请求体
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    console.log("body：", body);
  });

  response.end("hello");
});

server.listen(9000, () => {
  console.log("服务器启动了");
});
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/beba59a04c1d4585bff4efd07973c8a1.png)

调用上面的接口后，打印信息如下：

```
请求方法： POST
http版本： 1.1
请求url： /hello?name=Tom&age=18
headers： {
  host: 'localhost:9000',
  'user-agent': 'insomnia/2023.1.0',
  aaa: 'bbb',
  accept: '*/*',
  'content-length': '30'
}
body： studentName=Jake&studentAge=18
```

### 练习搭建http服务

```javascript
const http = require("http");

const server = http.createServer((request, response) => {
  let { url, method } = request;
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  if (method === "GET" && url === "/login") {
    response.end("登录页面");
  } else if (method === "GET" && url === "/register") {
    response.end("注册页面");
  } else {
    response.end("Not Found");
  }
});
server.listen(9000, () => {
  console.log("服务器启动了");
});
```



## url模块

URL模块，提供了解析和操作 URL 的功能。

### 解析url

```javascript
const http = require("http");
const url = require("url");

const server = http.createServer((request, response) => {
  // 使用url模块解析url
  let parseUrl = url.parse(request.url, true); //设置为true，表示url查询参数转为对象

  // 获取路径
  console.log(parseUrl.path); //hello?name=Tom&age=18

  // 获取路径的基础名称
  console.log(parseUrl.pathname); //hello

  // 获取查询参数，这里解析为对象
  console.log(parseUrl.query); //{ name: 'Tom', age: '18' }
  console.log(parseUrl.query.name); //Tom

  response.end("hello");
});

server.listen(9000, () => {
  console.log("服务器启动了");
});
```

```javascript
let parseUrl = url.parse(request.url, false); //设置为false，表示query为字符串
console.log(parseUrl.query); //name=Tom&age=18
```

### 操作url

```javascript
// 组合url
let url = new URL("/search?name=Tom&age=28", "http://localhost:9000");
```



## 设置响应报文

| 语法                                 | 说明             |
| ------------------------------------ | ---------------- |
| response.statusCode                  | 设置响应状态码   |
| response.statusMessage               | 设置响应状态描述 |
| response.setHeader("key", "value")   | 设置响应头       |
| response.write()<br />response.end() | 设置响应体       |

```javascript
const http = require("http");

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.write("html");
  response.write("css");
  response.write("js");
  response.write("node");
  response.end("这就是前端");
});

server.listen(9000, () => {
  console.log("服务器启动了");
});
```

### 练习搭建网页

在当前目录下新建`index.html`文件，接着在public目录下新建`index.css`和`index.js`文件。

```javascript
const http = require("http");
const fs = require("fs");

const server = http.createServer((request, response) => {
  let { url, method } = request;
  if (method === "GET" && (url === "/" || url === "/index.html")) {
    let htmlData = fs.readFileSync(__dirname + "/index.html");
    response.end(htmlData);
  } else if (method === "GET" && url === "/public/index.css") {
    let cssData = fs.readFileSync(__dirname + "/public/index.css");
    response.end(cssData);
  } else if (method === "GET" && url === "/public/index.js") {
    let jsData = fs.readFileSync(__dirname + "/public/index.js");
    response.end(jsData);
  } else {
    response.statusCode = 404;
    response.end("Not Found");
  }
});

server.listen(9000, () => {
  console.log("服务器启动了");
});
```

