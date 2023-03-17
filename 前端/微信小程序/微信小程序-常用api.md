[toc]

# 微信小程序-常用api

## 路由

### wx.switchTab(Object object)

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| url      | string   |        | 是   | 需要跳转的 tabBar 页面的路径 (代码包路径)（需在 app.json 的 [tabBar](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabbar) 字段定义的页面），路径后不能带参数。 |
| success  | function |        | 否   | 接口调用成功的回调函数                                       |
| fail     | function |        | 否   | 接口调用失败的回调函数                                       |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行               |

### wx.navigateTo(Object object)

保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。

使用 [wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html) 可以返回到原页面。小程序中页面栈最多十层。

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| url      | string   |        | 是   | 需要跳转的应用内非 tabBar 的页面的路径 (代码包路径), 路径后可以带参数。参数与路径之间使用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数用 `&` 分隔；如 'path?key=value&key2=value2' |
| events   | Object   |        | 否   | 页面间通信接口，用于监听被打开页面发送到当前页面的数据。基础库 2.7.3 开始支持。 |
| success  | function |        | 否   | 接口调用成功的回调函数                                       |
| fail     | function |        | 否   | 接口调用失败的回调函数                                       |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

### wx.navigateBack(Object object)

关闭当前页面，返回上一页面或多级页面。可通过 [getCurrentPages](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html) 获取当前的页面栈，决定需要返回几层。

| 属性     | 类型     | 默认值 | 必填 | 说明                                                    |
| :------- | :------- | :----- | :--- | :------------------------------------------------------ |
| delta    | number   | 1      | 否   | 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 |
| success  | function |        | 否   | 接口调用成功的回调函数                                  |
| fail     | function |        | 否   | 接口调用失败的回调函数                                  |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）        |

### wx.redirectTo(Object object)

关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| url      | string   |        | 是   | 需要跳转的应用内非 tabBar 的页面的路径 (代码包路径), 路径后可以带参数。参数与路径之间使用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数用 `&` 分隔；如 'path?key=value&key2=value2' |
| success  | function |        | 否   | 接口调用成功的回调函数                                       |
| fail     | function |        | 否   | 接口调用失败的回调函数                                       |
| complete | function |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |



## 提示

### wx.showToast(Object object)

显示消息提示框

### wx.showModal(Object object)

显示模态对话框

### wx.showLoading(Object object)

显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框

### wx.showActionSheet(Object object)

显示操作菜单



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

| 属性 | 类型                 | 默认值                    | 必填  | 说明 | 最低版本                                                     |                                                              |
| :--- | :------------------- | :------------------------ | :---- | :--- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| url                  | string                    |       | 是   | 开发者服务器接口地址                                         |                                                              ||
| data                 | string/object/ArrayBuffer |       | 否   | 请求的参数                                                   |                                                              ||
| header               | Object                    |       | 否   | 设置请求的 header，header 中不能设置 Referer。 `content-type` 默认为 `application/json` |                                                              ||
| timeout              | number                    |       | 否   | 超时时间，单位为毫秒。默认值为 60000                         | [2.10.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) ||
| method               | string                    | GET   | 否   | HTTP 请求方法                                                |                                                              ||
| success  | function                  |        | 否   | 接口调用成功的回调函数                                       |                                                              |      |
| fail     | function                  |        | 否   | 接口调用失败的回调函数                                       |                                                              |      |
| complete | function                  |        | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |                                                              |      |

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



## 头像昵称填写

**调整说明**

自 2022 年 10 月 25 日 24 时后（以下统称 “生效期” ），用户头像昵称获取规则将进行如下调整：

1. **自生效期起，小程序 wx.getUserProfile 接口将被收回**：生效期后发布的小程序新版本，通过 wx.getUserProfile 接口获取用户头像将统一返回默认[灰色头像](https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0)，昵称将统一返回 “微信用户”。生效期前发布的小程序版本不受影响，但如果要进行版本更新则需要进行适配。
2. **自生效期起，插件通过 wx.getUserInfo 接口获取用户昵称头像将被收回**：生效期后发布的插件新版本，通过 wx.getUserInfo 接口获取用户头像将统一返回默认[灰色头像](https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0)，昵称将统一返回 “微信用户”。生效期前发布的插件版本不受影响，但如果要进行版本更新则需要进行适配。通过 wx.login 与 wx.getUserInfo 接口获取 openId、unionId 能力不受影响。
3. **「头像昵称填写能力」支持获取用户头像昵称**：如业务需获取用户头像昵称，可以使用「[头像昵称填写能力](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)」（基础库 2.21.2 版本开始支持，覆盖iOS与安卓微信 8.0.16 以上版本），具体实践可见下方《最佳实践》。
4. **小程序 wx.getUserProfile 与插件 wx.getUserInfo 接口兼容基础库 2.27.1 以下版本的头像昵称获取需求**：对于来自低版本的基础库与微信客户端的访问，小程序通过 wx.getUserProfile 接口将正常返回用户头像昵称，插件通过 wx.getUserInfo 接口将正常返回用户头像昵称，开发者可继续使用以上能力做向下兼容。

[文档说明](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)

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



