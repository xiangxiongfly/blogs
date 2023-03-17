[TOC]

# HTTP状态管理：Cookie&Session

## HTTP是无状态的

HTTP是一种不保存状态，即无状态协议。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c42765382c12490491d1416bda122914.png)

使用HTTP协议，每当有新的请求发送时，就会有对应的新响应产生。

协议本身并不保存之前的请求或响应的报文的信息，这是为了更快的处理大量事务，确保协议的可伸缩性，特意将HTTP协议设计的如此简单。

实现保持状态功能，可以使用Cookie和Session。



## Cookie

### 什么是Cookie

Cookie实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，就使用response向客户端浏览器颁发一个Cookie

客户端浏览器会把Cookie保存起来。当浏览器再请求该网站时，浏览器把请求的网址连同该Cookie一同提交给服务器。服务器检查该Cookie，

以此来辨认用户状态。服务器还可以根据需要修改Cookie的内容。



### Cookie的使用流程

Cookie会根据从服务器端发送的响应报文内的一个叫做`Set-Cookie`的首部字段信息，通知客户端保存Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入Cookie值后发送出去。

服务器端发现客户端发送过来的Cookie后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。

**没有Cookie信息状态下的请求**

![在这里插入图片描述](https://img-blog.csdnimg.cn/97a036c5bd004ba0ba05bc448c1267a4.png)

**请求报文（没有Cookie）**

```
    GET /reader/ HTTP/1.1
    Host: hackr.jp
    ＊首部字段内没有Cookie的相关信息
```

**响应报文（服务端生成Cookie）**

```
    HTTP/1.1200 OK
    Date: Thu, 12 Jul 2012 07:12:20 GMT
    Server: Apache
    ＜Set-Cookie: sid=1342077140226724; path=/; expires=Wed, =>
    10-Oct-12 07:12:20 GMT＞
    Content-Type: text/plain; charset=UTF-8
```

**第2次以后（存有Cookie信息状态）的请求**

![在这里插入图片描述](https://img-blog.csdnimg.cn/4615b03678864633af983d3195f49666.png)

**请求报文（自动发送保存的Cookie）**

```
    GET /image/ HTTP/1.1
    Host: hackr.jp
    Cookie: sid=1342077140226724
```



## Session

### 什么是Session

Cookie可以让服务端程序跟踪每个客户端的访问，但是每次客户端的访问都必须传回这些Cookie，如果Cookie很多，这无形地增加了客户端与服务端的数据传输量，而 Session 的出现正是为了解决这个问题。

Session是另一种记录客户状态的机制，保存在服务器上，客户端浏览器第一次访问服务器时，服务器会生成一个SessionId，通过Cookie保存在浏览器，下次访问服务器时，客户端只要传回一个SessionId就行了。



### Session的使用流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/413bf17c73da4f3193990042df19582d.png)

1. 客户端通过表单发送信息到服务器进行表单认证。
2. 服务器认证后发送SessionID，把用户认证状态和SessionID绑定。
3. 客户端收到SessionID作为Cookie保存本地，下次再次请求会带入Cookie并随着SessionID一起发送，服务器基于SessionID识别用户和认证状态。



### 保持Session的方式

**情况一：**

当Cookie未被禁用时，Session是依赖Cookie的，会把SessionId放在Cookie里

![加粗样式](https://img-blog.csdnimg.cn/a48c8f5553f2485db518be06982067bd.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb689b860cf64b3a8f6e2ee4feafc4ef.png)

**情况二：**

当Cookie被禁用时，我们经常使用的一种方法叫URL重写，即把session id直接附加在URL路径的后面。比如`https://www.baidu.com/link?url=6PbvsxrkciVmIwG0SOJxfm6izqEh5aJyLsubX;jsessionid=........ `



## Cookie与Session区别

存放位置不同：Cookie存储在客户端，Session存储在服务端。

安全性不一样：Cookie是保持在浏览器里，用户可以查看，Session存放在服务器，用户不能查看。

有效期不同：Cookie根据有效时间可以长时间保存在浏览器，而Session会被服务器定时清理超时的SessionId。

对服务器压力不同：Cookie保持在客户端不会对服务器造成影响，而Session保持在服务器会占用内存。

