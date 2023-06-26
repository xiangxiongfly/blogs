[toc]

# Node 会话控制

## 概述

所谓会话控制就是 对会话进行控制。

HTTP 是一种无状态的协议，它没有办法区分多次的请求是否来自于同一个客户端， 无法区分用户

而产品中又大量存在的这样的需求，所以我们需要通过 会话控制 来解决该问题

常见的会话控制技术有三种：

- cookie
- session
- token



## cookie

cookie是HTTP服务器发送到用户浏览器并保存在本地的一小块数据。

- cookie是保存在浏览器端的一小块数据。
- cookie是按照域名划分的。

### 运行流程

当用户访问网站时，服务器将cookie设置在请求头中，然后发送到浏览器，浏览器将其存储在本地，在以后的请求中将其放在请求中发送给服务器。

### 设置cookie

```javascript
const express = require("express");

const app = express();

// 设置cookie
app.get("/set_cookie", (request, response) => {
  response.cookie("name", "Tom");
  response.cookie("age", 18, { maxAge: 5 * 60 * 1000 }); //最长时效4分钟
  response.send("设置cookie");
});

app.listen(3000, () => {
  console.log("服务器启动了");
});
```

第一次调用 `http://127.0.0.1:3000/set_cookie`，服务器会返回`set-cookie`字段：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe158b0ea57e4d1ea1efff55a3d16918.png)

第二次调用 `http://127.0.0.1:3000/set_cookie`，浏览器会将可用的cookie放在请求头并发送到服务器：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a21d0d9b92143e4af19836b8ae8c894.png)

### 获取cookie

需要安装`cookie-parser`包：

```
npm install cookie-parser
```

设置cookieParser中间件：

```javascript
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// 设置cookie-parser中间件
app.use(cookieParser());

// 获取cookie
app.get("/get_cookie", (request, response) => {
  console.log(request.cookies);
  response.send("获取cookie"); //{ name: 'Tom', age: '18' }
});

app.listen(3000, () => {
  console.log("服务器启动了");
});
```

### 删除cookie

```javascript
const express = require("express");

const app = express();

// 删除cookie
app.get("/delete_cookie", (request, response) => {
  response.clearCookie("name");
  response.send("删除cookie");
});

app.listen(3000, () => {
  console.log("服务器启动了");
});
```



## session

session是保存在服务器的。

### 运行流程

当用户访问网站时，服务器会创建一个新的session并与用户关联，服务器可以将session保存在服务器，接着服务器通过cookie将session_id的值通过响应头发送给浏览器，浏览器保存其cookie，下次请求是就会自动携带cookie发送到服务器，服务器通过cookie中的session_id确定用户信息。

**安装express-session中间件：**

```
npm i express-session
```

**安装connect-mongo中间件：**

```
npm i connect-mongo
```

### 设置session

```javascript
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(
  session({
    name: "sessionId", //设置cookie的name
    secret: "hello", //加密字符串
    saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
    resave: true, //是否每次请求时重新保存session
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/mydb",
    }),
    cookie: {
      httpOnly: true, //开启后前端不能通过js操作
      maxAge: 1000 * 300, //过期时间
    },
  })
);

// 设置session
app.get("/set_session", (request, response) => {
  request.session.username = "Tom";
  request.session.age = 18;
  response.send("设置session");
});

app.listen(3000, () => {
  console.log("服务器启动了");
});
```

说明：第一次调用 `http://127.0.0.1:3000/set_session`，服务器将sessionId放在cookie中，并返回给浏览器。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6bd7925c35914b819ec19a5db1da8d98.png)

第二次调用 `http://127.0.0.1:3000/set_session`，浏览器将cookie发送到服务器，cookie中包含sessionId。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6fe678e3f0b04a6cbf1c0888b7578ee8.png)

### 获取session

```javascript
// 获取session
app.get("/get_session", (request, response) => {
  console.log(request.session);
  console.log(request.session.username); //Tom
  response.send("获取session");
});
```

### 删除session

```javascript
// 删除session
app.get("/delete_session", (request, response) => {
  request.session.destroy(() => {
    response.send("删除session");
  });
});
```



## session和cookie的区别

|            | cookie | session                                                |
| ---------- | ---- | ------------------------------------------------------------ |
| 存放位置         | 浏览器                                                       | 服务器                                                 |
| 安全性           | cookie以明文方式保存在浏览器，安全性较低                     | session存放在服务器中，安全性相对较高                  |
| 网络传输量       | 内容过多会影响传输效率                                       | 数据存储在服务器，只是通过cookie传递id，不影响传输效率 |
| 存储限制        | 浏览器限制单个 cookie 保存的数据不能超过 4K ，且每个域名下的存储数量也有限制 | 服务器可以将session数据存储在内存中，也可以将其存储在数据库或文件系统中。 |
| 用处 | 存储较小的数据，如用户首选项或购物车信息 | 存储较大的数据，如用户身份验证信息 |



## token

token 是服务端生成并返回给 HTTP 客户端的一串加密字符串， token 中保存着 用户信息。

token可以识别用户的身份，主要用于移动端 APP。

**token** **的特点**

- 服务端压力更小，数据存储在客户端。
- 相对更安全，数据加密，可以避免 CSRF（跨站请求伪造）。
- 扩展性更强，服务间可以共享，增加服务节点更简单。

### 运行流程

当用户访问网站填写了账号和密码，服务器通过身份校验后生成token，token通过响应体返回给浏览器，浏览器在以后的请求中需要手动加上token发送到服务器。

### JWT

JWT（JSON Web Token ）是目前最流行的跨域认证解决方案，可用于基于 token 的身份验证。

JWT 使 token 的生成与校验更规范。

**安装jsonwebtoken包：**

```
npm i jsonwebtoken
```

### 创建token

```javascript
// 导包
const jwt = require("jsonwebtoken");

// 创建token
let token = jwt.sign(
  {
    username: "Tom",
    age: 18,
  },
  "helloworld",
  {
    expiresIn: 60, //单位秒
  }
);
console.log(token);
```

### 校验token

```javascript
jwt.verify(token, "helloworld", (err, data) => {
  if (err) {
    console.log("校验失败");
    return;
  }
  console.log(data);
});
```

