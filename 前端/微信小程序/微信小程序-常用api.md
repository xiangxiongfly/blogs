[toc]

# 微信小程序-常用API

## 路由

**常用路由API：**

| 方法            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| wx.navigateTo() | 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 [wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html) 可以返回到原页面。小程序中页面栈最多十层。 |
| wx.redirectTo() | 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 |
| wx.switchTab()  | 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面             |

**通用选项：**

| 选项     | 类型     | 说明                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| url      | string   | 需要跳转到路径，路径后面可以添加参数，参数与路径直接用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数之间用 `&` 分隔，例如：path?key=value&key2=value2。必填项 |
| success  | funciton | 接口调用成功的回调函数                                       |
| fail     | function | 接口调用失败的回调函数                                       |
| complete | function | 接口调用结束的回调函数                                       |

**使用 navigateTo() ：**

第一个页面携带参数：

```js
Page({
    navigateTo(){
        wx.navigateto({
            url: "/pages/two/two?id=1",
            success: () => {
                console.log("跳转成功")
            },
            fail: () => {
                console.log("跳转失败")
            },
            complete: () => {
                console.log("跳转结束")
            }
        })
    }
})
```

第二个页面接收参数：

```js
Page({
    onLoad(options){
        console.log(options)
    }
})
```



## 提示

### wx.showModal(Object object)

显示模态对话框 

### wx.showActionSheet(Object object)

显示操作菜单



## 消息提示框

通过调用 wx.showToast() 方法用于显示消息提示框。

| 选项     | 类型     | 说明                                             |
| -------- | -------- | ------------------------------------------------ |
| title    | string   | 提示的内容                                       |
| icon     | string   | 图标，默认值为 success                           |
| duration | number   | 提示的停留实验，单位为毫秒，默认值为 1500        |
| mask     | boolean  | 是否显示透明蒙层，防止触摸穿透，默认值为 false   |
| success  | function | 接口调用成功的回调函数                           |
| fail     | function | 接口调用失败的回调函数                           |
| complete | function | 接口调用结束的回调函数（调用成功、失败都会执行） |

- icon 选项的合法值包括：success（成功图标）、error（失败图标）、loading（加载图标）和none（无图标）。
- 当 icon 的值为 success、error、loading 时，title 选项中文本最多显示7个汉字长度；
- 当 icon 的值为 none 时，title 选项中文本最多可显示两行。

```javascript
wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```



## 加载提示框

通过调用 wx.showLoading() 方法弹出加载提示框，弹出后不会自动关闭，需要调用 wx.hideLoading() 方法关闭加载提示框。

[wx.showLoading](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html) 和 [wx.showToast](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html) 同时只能显示一个

| 选项     | 类型     | 说明                                             |
| -------- | -------- | ------------------------------------------------ |
| title    | string   | 提示的内容                                       |
| mask     | boolean  | 是否显示透明蒙层，防止触摸穿透，默认值为false    |
| success  | function | 接口调用成功的回调函数                           |
| fail     | function | 接口调用失败的回调函数                           |
| complete | function | 接口调用结束的回调函数（调用成功、失败都会执行） |

```javascript
wx.showLoading({
  title: '加载中',
})

setTimeout(function () {
  wx.hideLoading()
}, 2000) 
```



## 下拉刷新

在page下的json文件中开启下拉刷新：

```json
{  
  "window": {
    "navigationBarTextStyle": "black",
    "enablePullDownRefresh": false
  }
}
```

在js中回调：

```js
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
onPullDownRefresh() {
    console.log("下拉刷新了");
    setTimeout(() => {
        wx.stopPullDownRefresh()
    }, 2000)
},
```

全局开启下拉刷新：

在app.json文件中设置

```
 "enablePullDownRefresh": false
```



## 网络请求

在微信小程序中发起网络请求通过调用 wx.reqeust() 方法实现。

每个 wx.request() 方法都是一个请求任务，可以通过 abort() 方法取消。

| 选项         | 类型                      | 说明                          |
| ------------ | ------------------------- | ----------------------------- |
| url          | string                    | 接口地址，默认值为""          |
| data         | string/object/ArrayBuffer | 请求参数，默认值为""          |
| header       | object                    | 请求头，默认值为""            |
| method       | string                    | 请求方法，默认值为 GET        |
| dataType     | string                    | 返回到数据格式，默认值为 json |
| responseType | string                    | 响应的数据类型，默认值为 text |
| success      | function                  | 接口调用成功的回调函数        |
| fail         | function                  | 接口调用失败的回调函数        |
| complete     | function                  | 接口调用结束的回调函数        |

```javascript
// 发送请求
let requestTask = wx.request({
    ...
})
// 中断请求    
requestTask.abort()    
```

wxml

```xml
<!--pages/api/request/request.wxml-->
<button bindtap="handleRequest">网络请求</button>
<view wx:for="{{dataList}}" wx:key="index">
  <image src=" {{item.img}}" mode="aspectFit" />
  <view>
    电影名：{{item.nm}}
    发布时间：{{item.rt}}
  </view>
</view>
```

js

```js
Page({
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleRequest()
  },
  handleRequest() {
    wx.request({
      url: 'https://m.maoyan.com/ajax/movieOnInfoList?token=&optimus_uuid=74B5F0A032A711EB82DD6B9282E93C676D27D7B9731D4E608D7612C3E708C120&optimus_risk_level=71&optimus_code=10',
      method: "get",
      data: {},
      success: (res) => {
        console.log(res.data);
        this.setData({
          dataList: res.data.movieList
        })
      },
      fail: () => {}
    })
  }
})
```



## 数据缓存

除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。

单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。

**异步方式：**

| 方法                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| wx.setStorage()     | 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。 |
| wx.getStorage()     | 从本地缓存中异步获取指定 key 的内容。                        |
| wx.getStorageInfo() | 异步获取当前storage的相关信息。                              |
| wx.removeStorage()  | 从本地缓存中移除指定 key。                                   |
| wx.clearStorage()   | 清除本地数据缓存                                             |

**同步方式：**

| 方法                    | 说明                               |
| ----------------------- | ---------------------------------- |
| wx.setStorageSync()     | wx.setStorage() 的同步方式         |
| wx.getStorageSync()     | wx.getStorageSync() 的同步方式     |
| wx.getStorageInfoSync() | wx.getStorageInfoSync() 的同步方式 |
| wx.removeStorageSync()  | wx.removeStorageSync() 的同步方式  |

**wx.setStorage()选项：**

| 选项     | 类型     | 说明                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| key      | string   | 指定的 key 值，必填项                                        |
| data     | any      | 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 |
| success  | function | 接口调用成功的回调函数                                       |
| fail     | function | 接口调用失败的回调函数                                       |
| complete | function | 接口调用结束的回调函数                                       |

**wx.getStorage()选项：**

| 选项     | 类型     | 说明                   |
| -------- | -------- | ---------------------- |
| key      | string   | 指定的 key 值，必填项  |
| success  | function | 接口调用成功的回调函数 |
| fail     | function | 接口调用失败的回调函数 |
| complete | function | 接口调用结束的回调函数 |

使用：

```js
// 存储数据
wx.setStorage({
    key: "key",
    data: "data",
    success: res => {},
    fail: () => {}
})

// 获取数据
wx.getStorage({
    key: "key",
    success: res => {
        console.log(res.data)
    },
    fail: ()=> {}
})
```



## 头像昵称

微信小程序不允许开发者在未获得用户同意的情况下展示用户的头像和昵称，当需要展示时，应使用微信小程序的头像昵称填写功能。

[文档说明](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)

**头像选择：**

将 button 组件的 open-type 属性值设置为 chooseAvatar，当用户选择头像之后，可通过 bindchooseavatar 绑定的事件处理函数获取头像信息的临时路径。

**昵称填写：**

将 input 组件的 type 属性值设置为 nickname，当用户在此 input 组件进行输入时，键盘上方会展示用户的微信昵称，用户可以使用该昵称，也可以手动填写昵称。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9147bc9ad8b44c7dbffd23aca23060c7.png)

wxml

```xml
<!--pages/api/getUserProfile/getUserProfile.wxml-->
<view class="container">
  <text>头像昵称填写</text>
  <button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
    <image class="avatar" src="{{avatarUrl}}" />
  </button>
  <input type="nickname" placeholder="请输入昵称" style="background-color:rgb(231, 231, 231);" />
</view>
```

wxss

```css
.avatar-wrapper {
  padding: 0;
  width: 56px !important;
  border-radius: 8px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.avatar {
  display: block;
  width: 56px;
  height: 56px;
}
```

js

```js
Page({
  data: {
    avatarUrl: ""
  },
  onChooseAvatar(e) {
    let avatarUrl = e.detail.avatarUrl
    console.log("头像：", avatarUrl);
    this.setData({
      avatarUrl: avatarUrl
    })
  }
})
```



## 小程序登录

1. 在微信小程序中，通过 wx.login() 方法获取临时登录凭证 code，code 由微信小程序内部自动生成，每次调用 wx.login() 方法获得的 code 都不同，code 有效期为 5 分钟，且被微信接口服务验证一次后就会失效。

2. 微信小程序将临时 code 发送给开发者服务器。

3. 开发者服务器将 appid（微信小程序的唯一标识，即AppID）、appsecret（微信小程序的密钥，即AppSecret）和 code 发送给微信接口服务进行登录凭证校验，如果校验成功，微信接口服务会返回 session_key、openid、unionid 等信息。
   - appid和appsecret用于辨别微信小程序开发者身份；
   - session_key是用户的会话密钥，用于对用户数据进行加密签名；
   - openid是用户唯一标识，同一个微信用户在不同AppID的微信小程序中的openid是不同的；
   - unionid是用户在微信开放平台账号下的唯一标识，若当前微信小程序已绑定到微信开放平台账号会返回此信息。
4. 发者服务器登录成功后，开发者服务器需要保存用户的 openid 和 session_key，然后生成一个对应的 token 响应给微信小程序。微信小程序下次请求时，需要携带 token。当开发者服务器收到请求后，需要使用当前请求携带的 token 查询对应用户的 openid 和 session_key，如果能查询到，说明用户已登录，如果没有查询到，则说明用户未登录。

**wx.login()选项：**

| 选项     | 类型     | 说明                   |
| -------- | -------- | ---------------------- |
| timeout  | number   | 超时事件，单位为毫秒   |
| success  | function | 接口调用成功的回调函数 |
| fail     | function | 接口调用失败的回调函数 |
| complete | function | 接口调用结束的回调函数 |

**success回调方法属性：**

| 属性 | 类型   | 说明                                                         |
| :--- | :----- | ------------------------------------------------------------ |
| code | string | 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [code2Session](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html)，使用 code 换取 openid、unionid、session_key 等信息 |

用法：

```js
wx.login({
    success: res => {
        if(res.code) {
            wx.request({
                url: "http://127.0.0.1:3000/login",
                method: "post",
                data: {
                    code: res.code
                }
            })

        } else {
            console.log("登录失败" + res.errMsg)
        }
    }
})
```



## 背景音频

一、在 app.json 文件中配置 requireBackgroundModes 属性：

```js
"requiredBackgroundModes": [
    "audio"
]
```

二、通过调用 wx.getBackgroundAudioManager() 方法获取 BackgroundAudioManager 实例。

```js
let audioGbam = wx.getBackgroundAudioManager()
```

**BackgroundAudioManager的属性和方法：**

| 属性         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| src          | 背景音频的数据源，默认值为空，设置数据源后会自动播放，支持格式：M4A/AAC/MAP/WAV |
| startTime    | 背景音频开始播放的位置，单位为秒                             |
| title        | 背景音频标题，用于原生音频播放器的背景音频标题               |
| playbackRate | 播放速率，范围 0.5~2.0 倍，默认值为 1 倍                     |
| duration     | 当前背景音频的长度，单位为秒，只有在合法的src时有效，只读属性 |
| currentTime  | 当前背景音频的播放位置，单位为秒，只有在合法的src时有效，只读属性 |
| paused       | 当前是否暂停或停止，只读属性                                 |

| 方法法         | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| play()         | 播放背景音频                                                 |
| pause()        | 暂停背景音频                                                 |
| seek()         | 跳转至指定位置                                               |
| stop()         | 停止背景音频                                                 |
| onCanplay()    | 监听背景音频进入可播放状态事件                               |
| onWaiting()    | 监听背景音频加载中事件，当背景音频因为数据不足需要停下来加载时触发 |
| onError()      | 监听背景音频播放错误事件                                     |
| onPlay()       | 监听背景音频播放事件                                         |
| onPause()      | 监听背景音频暂停事件                                         |
| onSeeking()    | 监听背景音频开始跳转操作事件                                 |
| onSeeked()     | 监听背景音频完成跳转操作事件                                 |
| onEnded()      | 监听背景音频自然播放结束事件                                 |
| onStop()       | 监听背景音频停止事件                                         |
| onTimeUpdate() | 监听背景音频播放进度更新事件，只有小程序在前台时会调用       |

在页面中使用：

```js
onReady: function(){
    let audio = wx.getBackgroundAudioManager()
    audio.onPlay(function() {
        console.log("开始播放")
    })
    audio.title = "音乐标题"
    audio.src = "http://127.0.0.1:3000/1.mp3"
}
```



## 录音

通过调用 wx.getRecorderManager() 方法获取 RecorderManager 的实例。

RecorderManager 的属性和方法：**

| 方法                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| start()               | 开始录音                                                     |
| pause()               | 暂停录音                                                     |
| resume()              | 继续录音                                                     |
| stop()                | 停止录音                                                     |
| onStart()             | 监听录音开始事件                                             |
| onResume()            | 监听录音继续事件                                             |
| onPause()             | 监听录音暂停事件                                             |
| onStop()              | 监听录音结束事件                                             |
| onFrameRecorded()     | 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。 |
| onError()             | 监听录音错误事件                                             |
| onInterruptionBegin() | 监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发 |
| onInterruptionEnd()   | 监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。 |

在页面中使用：

```js
onReady: function(){
    let recorderManager = wx.getRecorderManager()
    recorderManager.onStart(() => {
        console.log("录音开始监听")
    })
    recorderManager.onStop(res => {
        console.log("录音停止监听")
    })
    recorderManager.start() // 开始录音
    setTimeout(() => {
        recorderManager.stop() // 停止录音
    })
}
```



## 音频

通过调用 wx.createInnerAudioContext() 创建 InnerAudioContext 的实例。

**InnerAudioContext的属性和方法：**

| 属性     | 说明                         |
| -------- | ---------------------------- |
| autoplay | 是否自动播放，默认值为 false |
| loop     | 是否循环播放，默认值为 false |
| volume   | 音量，范围为 0~1，默认值为 1 |

| 方法      | 说明         |
| --------- | ------------ |
| destroy() | 销毁当前实例 |

在页面中使用：

```js
onReady(){
	let audioCtx = wx.createInnerAudioContext()
    audioCtx.src = "http://127.0.0.1:3000/1.mp3"
    audioCtx.onPlay(() => {
        console.log("监听播放开始")
    })
    audioCtx.play() // 开发播放
}
```



 ## 选择媒体

微信小程序提供了选择媒体API，可以用于选择图片和视频，一般用于上传头像、上传图片和上传视频等功能。

通过调用 wx.chooseMedia() 方法调用选择媒体API。

| 选项        | 类型             | 说明                                                         |
| ----------- | ---------------- | ------------------------------------------------------------ |
| count       | number           | 文件最多可选数量，默认值为 9                                 |
| mediaType   | `Array.<string>` | 文件类型，默认值为 ["image","video]                          |
| sourceType  | `Array.<string>` | 图片和视频选择的来源，默认值为 ["album","camera"]            |
| maxDuration | number           | 拍摄视频的最长时间，单位为秒，事件范围为 3~60，默认值为 10   |
| camera      | string           | 仅在 sourceType 为 camera 时生效，用于设置使用前置或后置摄像头，默认值为 back |
| success     | function         | 接口调用成功的回调方法                                       |
| fail        | function         | 接口调用失败的回调方法                                       |
| complete    | function         | 接口调用结束的回调方法                                       |

- mediaType 选项：
  - image：图片
  - video：视频
  - mix：可同时选择图片和视频
- sourceType 选项：
  - album：相册
  - camera：相机拍摄

使用：

```xml
<view bindtap="test">选择图片</view>
```

```js
test(){
    wx.chooseMedia({
        count: 9,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: res => {
            const tempFilePath = res.tempFiles[0].tempFilePath
            console.log(tempFilePath)
        }        
    })
}
```



## 图片预览

微信小程序提供了图片预览API，通过图片预览API可以预览图片，而且在预览过程中可以进行图片保存、发送给朋友等操作。

通过调用 wx.previewImage() 方法使用图片预览API。

| 选项     | 类型             | 说明                                       |
| -------- | ---------------- | ------------------------------------------ |
| urls     | `Array.<string>` | 需要预览的图片连接，必填项，默认值为""     |
| showmenu | boolean          | 是否显示长按菜单，默认值为 true            |
| current  | string           | 当前显示的图片链接，默认值为 urls 的第一张 |
| success  | function         | 接口调用成功的回调方法                     |
| fail     | function         | 接口调用失败的回调方法                     |
| complete | function         | 接口调用结束的回调方法                     |

- urls 选项：支持 http 或 https 协议的网络图片，如果使用本地图片预览，可能会出现黑屏或加载不出图片的情况。

使用：

```xml
<image src="{{url}}" bindtap="previewImage" />
```

```js
Page({
    data: {
        url: "http://127.0.0.1:3000/tree.jpg"
    },
    previewImage() {
        wx.previewImage({
            urls: [this.data.url]
        })
    }
})
```



## 文件上传

微信小程序提供了文件上传API，使用文件上传API可以在微信小程序中发起一个post请求，将本地资源上传到服务器。

通过调用 wx.uploadFile() 方法使用、

| 选项     | 类型     | 说明                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| url      | string   | 服务器地址，必填项                                           |
| header   | object   | 请求头，不能设置 Referer                                     |
| timeout  | number   | 超时事件，单位为毫秒                                         |
| name     | string   | 文件对应的 key，服务器可以通过这个 key 获取文件的二进制内容，必填项 |
| filePath | string   | 需要上传文件的路径（本地路径），必填项                       |
| success  | function | 接口调用成功的回调方法                                       |
| fail     | function | 接口调用失败的回调方法                                       |
| complete | function | 接口调用结束的回调方法                                       |

使用：

```js
wx.uploadFile({
    filePath: "本地路径",
    name: "image",
    url: "http://127.0.0.1:3000/upload",
    success: res => {
        console.log("res")
    }
})
```



## 文件下载

微信小程序提供了文件下载API，使用文件下载API可以实现文件下载功能。

通过调用 wx.downloadFile() 方法使用。

| 选项     | 类型     | 说明                             |
| -------- | -------- | -------------------------------- |
| url      | string   | 下载资源地址，必填项             |
| header   | object   | 请求头，不能设置 Referer         |
| timeout  | number   | 超时事件，单位为毫秒             |
| filePath | string   | 文件下载后存储的路径（本地路径） |
| success  | function | 接口调用成功的回调方法           |
| fail     | function | 接口调用失败的回调方法           |
| complete | function | 接口调用结束的回调方法           |

使用：

```js
wx.downloadFile({
    url: "http://127.0.0.1:3000/tree.jpg",
    success: res => {
        console.log(res.tempFilePath)
    }
})
```

