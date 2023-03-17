[TOC]

# HTTP方法和状态码

## 请求和响应

![在这里插入图片描述](https://img-blog.csdnimg.cn/20b90d060b884c0194a282cd9cf19a67.png)

HTTP协议规定，请求从客户端发出，然后服务端响应请求并返回。

### 请求报文

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f21b40ab11843c8ac5001c270883d62.png)

请求报文由请求方法、请求URI、协议版本、可选的请求首部字段、内容实体。



### 响应报文

![在这里插入图片描述](https://img-blog.csdnimg.cn/09ad19295e2841cbb09c11303dc4c499.png)

响应报文由协议版本、状态码、解释状态码、可选的响应首部字段、实体主体。



## HTTP方法

| 方法   | 说明         |
| ------ | ------------ |
| GET    | 获取资源     |
| POST   | 传输数据     |
| PUT    | 传输文件     |
| HEAD   | 获取报文首部 |
| DELETE | 删除文件     |

### GET

GET方法用来请求访问已被URI识别的资源。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d374353e0a1e49d79231dfe6e28702f2.png)

### POST

POST方法用来传输数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/df21424deb3241feb38bdf9611cb698d.png)

### PUT

PUT方法从向服务器传输的数据取代指定的数据，通常用作传输资源。

PUT方法与POST方法最大的区别是：PUT是幂等到，而POST是不幂等的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6664054df2ff4a3ab6232baf086bc144.png)

### HEAD

HEAD方法用来获取报文首部，和GET方法一样，只是不返回报文主体部分。用来确认URI的有效性及资源更新的日期时间等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1ba9426de18f409da59e93d642cc0e85.png)

### DELETE

DELETE方法用来删除指定的资源。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5256a0bbcc6c4454a718ba671dfdff40.png)





## HTTP状态码

### 状态码分类

| 状态码 | 类别                          | 原因短语                   |
| ------ | ----------------------------- | -------------------------- |
| 1XX    | Informational（信息性状态码） | 接收到请求正在处理         |
| 2XX    | Success（请求成功）           | 请求正常处理完毕           |
| 3XX    | Redirection（重定向）         | 需要进行附加操作已完成请求 |
| 4XX    | Client Error（客户端错误）    | 服务器无法处理请求         |
| 5XX    | Server Error（服务器错误）    | 服务器处理请求出错         |

### 2XX 成功

(Success) 成功状态码，表示请求正常。

- 200 ok 请求被成功处理。
- 204 No Content 该状态码表示服务器接收到的请求已经处理完毕，但是服务器不需要返回响应体。
- 206 Partial Content 该状态码表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求。

### 3XX 重定向

(Redirection) 重定向状态码，表示客户端需要进行附加操作。

- 301 Moved Permanently 永久性重定向，请求的资源已被永久的移动到新URI，返回信息会包含新URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新URI替代。
- 302 Found 临时性重定向，与301蕾丝，但资源只是临时被移动。客户端应继续使用原URI。 

### 4XX 客户端错误

(Client Error) 客户端错误状态码，表示服务器无法处理请求。

- 400 Bad Request 指出客户端请求中的语法错误。
- 401 Unauthorized 该状态码表示发送的请求需要有认证。
- 403 Forbidden 该状态码表明对请求资源的访问被服务器拒绝了。
- 404 Not Found 该状态码表明服务器上无法找到指定的资源。

### 5XX 服务端错误

(Server Error) 服务器错误状态码，表示服务器处理请求出错。

- 500 Internal Server Error 该状态码表明服务器端在执行请求时发生了错误。
- 502 Bad Gateway 该状态码表明服务器网关错误。
- 503 Service Unavailable 该状态码表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

