[toc]

# JavaScript Ajax

## 概述

Ajax（Asynchronous JavaScript and XML）是一种用于在不刷新整个页面的情况下向服务器发送请求并接收响应的技术。它利用了浏览器提供的 XMLHttpRequest 对象，使得 JavaScript 能够在后台与服务器进行通信。



## 实现过程

- 创建XMLHttpRequest对象。
- 设置请求方法、URL、参数等。
- 定义回调方法接收服务区响应。
- 发送请求。
- 在回调函数中处理响应数据。



## 使用

### GET请求

```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/users", true);
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    } else {
        console.log(xhr.statusText);
    }
};
xhr.onerror = function() {
    console.log("Network error");
};
xhr.send(null);
```



### POST请求

#### URL编码格式

```javascript
const xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3000/users", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    } else {
        console.log(xhr.statusText);
    }
};
xhr.onerror = function() {
    console.log("Network error");
};
xhr.send("username=小花6&age=20");
```

#### JSON格式

```javascript
const xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3000/users", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    } else {
        console.log(xhr.statusText);
    }
};
xhr.onerror = function() {
    console.log("Network error");
};
const requestData = {
    username: "小花6",
    age: 20
}
xhr.send(JSON.stringify(requestData));
```



## 跨域问题

### 原因

跨域问题是由于浏览器的同源策略导致的。同源策略是一种安全机制，限制了来自不同源的脚本对当前文档的访问。具体来说，同源策略要求两个 URL 的协议、域名和端口号都相同，才能够进行跨域访问。



### 解决跨域问题的两种方法

- JSONP：JSONP（JSON with Padding）的原理是利用 `<script>` 标签的跨域特性，通过动态创建一个 `<script>` 标签来加载远程服务器返回的 JSON 数据。由于浏览器对 JavaScript 脚本的同源策略限制，无法直接从不同域名的服务器获取数据，但是可以通过在 URL 中添加回调函数名称的方式，将数据包装在该回调函数中，以便客户端能够获取到数据并执行相应的操作。JSONP 只支持 GET 请求，并且存在安全风险。
- CORS：CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种浏览器机制，用于允许在不同域名之间共享资源。它的原理是通过在 HTTP 头部添加特定的字段，告诉浏览器是否允许跨域请求资源。在 HTTP 响应头中添加一个 `Access-Control-Allow-Origin` 字段，指定允许跨域请求的源。



#### JSONP

**服务端代码**

```javascript
const express = require("express");
const app = express();
app.get("/home", (request, response) => {
    //响应页面
    response.sendFile(__dirname + "/index.html");
});
app.get("/test", (request, response) => {
    //响应页面
    let user = {
        name: "小明",
        age: 18,
        msg: "hello",
    };
    let json = JSON.stringify(user);
    response.end(`handle(${json})`);
});
app.listen(9000, () => {
    console.log("服务器启动了");
});
```

**前端代码**

```javascript
function handle(data) {
    console.log(data);
}

btn.onclick = function () {
    let script = document.createElement("script");
    script.src = "http://127.0.0.1:9000/test";
    document.body.appendChild(script);
};
```

#### JSONP(优雅写法)

**服务端代码**

```javascript
const express = require("express");
const app = express();
app.get("/home", (request, response) => {
    //响应页面
    response.sendFile(__dirname + "/index.html");
});
app.get("/test", (request, response) => {
    //响应页面
    const url = new URL(request.url, "http://127.0.0.1");
    const callback = url.searchParams.get("callback");
    const user = {
        name: "小明",
        age: 18,
        msg: "hello",
    };
    const json = JSON.stringify(user);
    response.end(`${callback}(${json})`);
});
app.listen(9000, () => {
    console.log("服务器启动了");
});
```

**前端代码**

```javascript
function handle(data) {
    console.log(data);
}

btn.onclick = function () {
    let script = document.createElement("script");
    script.src = "http://127.0.0.1:9000/test?callback=handle";
    document.body.appendChild(script);
};
```

#### CORS

**服务端代码**

```javascript
const express = require("express");
const app = express();
app.get("/home", (request, response) => {
    //响应页面
    response.sendFile(__dirname + "/index.html");
});
app.get("/test2", (request, response) => {
    //响应页面
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader("Access-Control-Allow-Method", "*");
    const user = {
        name: "小明",
        age: 18,
        msg: "hello",
    };
    const json = JSON.stringify(user);
    response.end(json);
});
app.listen(9000, () => {
    console.log("服务器启动了");
});
```



## 封装Ajax

```javascript
function ajax(options) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                options.success(xhr.responseText);
            } else {
                options.error(xhr.status);
            }
        }
    };
    xhr.open(options.method, options.url, true);
    if (options.method === "POST") {
        xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.send(options.data);
}
```

```javascript
//get请求
ajax({
    method: "GET",
    url: "http://127.0.0.1:3000/users",
    success: function (response) {
        console.log(response);
    },
    error: function (status) {
        console.log("请求失败：" + status);
    },
});
```

```javascript
//post请求
let json = JSON.stringify({
    username: "小花",
    age: 18,
});
ajax({
    method: "POST",
    url: "http://127.0.0.1:3000/users",
    data: json,
    success: function (response) {
        console.log(response);
    },
    error: function (status) {
        console.log("请求失败：" + status);
    },
});
```

