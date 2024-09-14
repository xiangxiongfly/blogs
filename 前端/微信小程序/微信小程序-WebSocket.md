[toc]

# 微信小程序-WebSocket 

## 概述

微信小程序官方提供了 WebSocket API，允许服务器主动向微信小程序发送消息。

微信小程序中的 WebSocke 与HTML5中的 WebSocket 基本相同。WebSocket 是一种在单个TCP连接上进行全双工通信的协议，它会在客户端与服务器之间专门建立一条通道，使客户端与服务器之间的数据交换变得简单。客户端与服务器只需要完成一次握手，两者之间就可以创建持久性的连接，并进行双向数据传输。

WebSocket 协议是以 ws 或 wss 开头的（类似于 http 和 https 的关系），在微信小程序中，正式项目必须使用以 wss 开头协议，在开发模式下可以使用以 ws 开头协议。



## WebSocket

通过调用 wx.connectSocket() 方法创建一个 WebSocket 连接。

**wx.connectSocket()方法选项：**

| 选项     | 类型     | 说明                     |
| -------- | -------- | ------------------------ |
| url      | string   | wss 接口地址             |
| header   | object   | 请求头，不能设置 Referer |
| timeout  | number   | 超时事件，单位为毫秒     |
| success  | function | 接口调用成功的回调函数   |
| fail     | function | 接口调用失败的回调函数   |
| complete | function | 接口调用结束的回调函数   |

使用 wx.connectSocket() ：

```js
wx.connectSocket({
    url: "ws://127.0.0.1:3000"
})
```



## SocketTask

当项目中同时存在多个 WebSocket 的连接时，可以使用 SocketTask 管理 WebSocket 连接，使每一条链路的生命周期都更可控。

使用 wx.connectSocket() 方法的返回值就是一个 ScoketTask 实例。

```js
const task = wx.connectSocket({
    url: "ws://127.0.0.1:3000"
})
```

**SocketTask实例方法：**

| 方法        | 说                                    |
| ----------- | ------------------------------------- |
| send()      | 通过 WebSocket 连接发送数据           |
| close()     | 关闭 WebSocket 连接                   |
| onOpen()    | 监听 WebSocket 连接打开事件           |
| onClose()   | 监听 WebSocket 连接关闭事件           |
| onError()   | 监听 WebSocket 错误事件               |
| onMessage() | 监听 WebSocket 接收到服务器的消息事件 |

**send()选项：**

| 选项     | 类型               | 说明                   |
| -------- | ------------------ | ---------------------- |
| data     | string/ArrayBuffer | 需要发送的内容，必填项 |
| success  | function           | 接口调用成功的回调方法 |
| fail     | function           | 接口调用失败的回调方法 |
| complete | function           | 接口调用结束的回调方法 |

**onClose()属性：**

| 属性   | 类型   | 说明                                                   |
| ------ | :----- | :----------------------------------------------------- |
| code   | number | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 |
| reason | string | 一个可读的字符串，表示连接被关闭的原因。               |

**close()选项：**

| 选项     | 类型     | 说明                                                         |
| -------- | :------- | ------------------------------------------------------------ |
| code     | number   | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。默认值为 1000（表示正常关闭连接） |
| reason   | string   | 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。 |
| success  | function | 接口调用成功的回调函数                                       |
| fail     | function | 接口调用失败的回调函数                                       |
| complete | function | 接口调用结束的回调函数                                       |

**onOpen()属性：**

| 属性    | 类型   | 说明                        |
| ------- | :----- | --------------------------- |
| header  | object | 连接成功的 HTTP 响应 Header |
| profile | object | 网络请求过程中一些调试信息  |

**onMessage()属性：**

| 属性 | 类型               | 说明             |
| :--- | :----------------- | ---------------- |
| data | string/ArrayBuffer | 服务器返回的消息 |

**onError()属性：**

| 属性   | 类型   | 说明     |
| :----- | :----- | -------- |
| errMsg | string | 错误信息 |



## 使用

**创建和监听：**

```js
Page({
  data: {
    content: "",
    list: [],
    lastId: ""
  },
  message: "",
  ws: null,
  onLoad: function () {
    const ws = wx.connectSocket({
      url: 'ws://127.0.0.1:3000',
      success: res => {
        console.log("连接成功：" + res);
      },
      fail: err => {
        console.log("连接失败：" + err);
      }
    })
    ws.onMessage(msg => {
      console.log("接收消息：" + msg.data);
      let data = JSON.parse(msg.data)
      let list = this.data.list
      let lastId = list.length
      list.push({
        id: lastId,
        content: data.content,
        role: "server"
      })
      this.setData({
        list,
        lastId
      })
    })
    ws.onClose(res => {
      console.log("close");
    })
    this.ws = ws
  },
  onUnload: function () {
    this.ws.close()
  },
  input: function (e) {
    this.message = e.detail.value
  }, 
})
```

**发送数据：**

```js
send: function (e) {
    if (!this.message) {
        wx.showToast({
            title: "消息不能为空",
            icon: "none",
            duration: 2000
        })
        return
    }
    this.ws.send({
        data: this.message
    })
    const list = this.data.list
    const lastId = list.length
    list.push({
        id: lastId,
        content: this.message,
        role: "me"
    })
    this.setData({
        list,
        lastId,
        content: ""
    })
    this.message = ""
}
```

