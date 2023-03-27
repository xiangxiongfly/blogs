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

**URL编码格式：**

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

**JSON格式提交：**

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

### 产生的原因

跨域问题是由于浏览器的同源策略导致的。同源策略是一种安全机制，限制了来自不同源的脚本对当前文档的访问。具体来说，同源策略要求两个 URL 的协议、域名和端口号都相同，才能够进行跨域访问。

**解决跨域问题的两种方法：**

- JSONP（JSON with Padding）：利用 `<script>` 标签可以跨域加载资源的特性，通过在页面中动态创建 `<script>` 标签，并指定请求的 URL 和回调函数名称，来实现跨域数据传输。JSONP只支持`GET`请求。
- CORS（Cross-Origin Resource Sharing）：CORS 是一种官方推荐的跨域解决方案，允许服务器在响应头中添加特定的字段，以授权其他域名的请求访问资源。客户端发送请求时，会先发送一个 OPTIONS 请求，以获取服务器支持的请求方法和头部信息。如果服务器允许跨域访问，则会在响应头中添加 `Access-Control-Allow-Origin` 字段，并指定允许访问的域名。CORS支持所有类型的HTTP请求。

