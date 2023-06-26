[TOC]

# Cookie

## 概述

在前端开发中，Cookie是一种存储在客户端（通常是浏览器）的小型文本文件，用于跟踪用户和存储与用户相关的信息。当用户访问一个网站时，服务器可以通过HTTP响应头将cookie发送给客户端，客户端则会将cookie存储在本地。之后，每次客户端向该网站发送请求时，都会将相应的cookie发送给服务器，以便服务器能够识别用户并提供个性化的服务。

Cookie通常包含如下信息：

- 名称：cookie的名称。
- 值：cookie的值。
- 过期时间：cookie的过期时间，过期后cookie将被删除。
- 路径：cookie所属的路径。
- 域名：cookie所属的域名。
- 安全标志：指定cookie是否只能通过安全连接传输（HTTPS）。

由于cookie存储在客户端，因此可能会被恶意攻击者窃取和篡改，所以不应该将重要信息存储在cookie中。例如Safari浏览器默认禁止第三方cookie，除非用户明确允许。



## 操作Cookie

### 查询

```javascript
document.cookie; //hello=world; hello2=world2
```



### 设置

```javascript
document.cookie = "key1=value1";
document.cookie = "key2=value2";
```



### encodeURIComponent & decodeURIComponent

- `encodeURIComponent` 用于处理Cookie中的非英文字符
- `decodeURIComponent` 用于解码

```javascript
document.cookie = `username=${encodeURIComponent("小明")}`;
```



### expires & max-age

- `expires` 指定失效时间
- `max-age` 指定当前时间多少秒后过期；当`max-age`的值是0或负数，则Cookie会被删除
- 失效的Cookie会被浏览器清除
- 没有设置失效时间的Cookie会被称为会话Cookie，它存在内存中，当会话结束或浏览器关闭Cookie会被清除

```javascript
document.cookie = `key1=value1;expires=${new Date("2022-1-1 00:00:00")}`;

document.cookie = `key2=value2;max-age=5`;
```



### domain

- `domain` 限制访问Cookie的范围



### path

- 同一域名下，限制不同路径访问Cookie



### HttpOnly

- 设置`HttpOnly`属性的Cookie不能被JS访问



### secure

- 限定Cookie只能在https下使用



### 封装Cookie

```javascript
//设置cookie
const setCookie = (name, value, { maxAge, domain, path, secure } = {}) => {

    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (typeof maxAge === "number") {
        cookieText += `;max-age=${maxAge}`;
    }
    if (domain) {
        cookieText += `;domain=${domain}`;
    }
    if (path) {
        cookieText += `;path=${path}`;
    }
    if (secure) {
        cookieText += `;secure`;
    }
    document.cookie = cookieText;
};

//获取cookie
const getCookie = name => {
    name = `${encodeURIComponent(name)}`;
    const cookies = document.cookie.split("; ");
    for (const item of cookies) {
        const [cookieName, cookieValue] = item.split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

};

//删除cookie
const removeCookie = (name, { domain, path } = {}) => {
    setCookie(name, "", { domain, path, maxAge: -1 });
}

export { setCookie, getCookie, removeCookie };
```
