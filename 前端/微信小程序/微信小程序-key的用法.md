[toc]

# 微信小程序-key的用法

## 说明

在微信小程序中，key是用于标识列表中每个项目的唯一标识符。当使用wx:for指令渲染列表时，可以使用key属性来指定每个项目的key值。这有助于提高列表渲染的性能，并确保在列表中添加或删除项目时，只更新必要的项目。



## 不使用key

wxml:

```
<view style="background-color: rgb(190, 188, 188);">
  <view wx:for="{{checkboxList}}">
    <label>
      <checkbox value="{{item}}" />{{item}}
    </label>
  </view>
  <button bindtap="addCheckbox" size="mini">头部添加元素</button>
</view>
```

js:

```js
addCheckbox(e) {
    let checkboxList = ["微信小程序", ...this.data.checkboxList]
    console.log(checkboxList);
    this.setData({
        checkboxList
    })
},
```

操作前：

![在这里插入图片描述](https://img-blog.csdnimg.cn/bdae2e9e13e74e96b67c019c065bacb6.png)

操作后：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f4e1ef6b3fa34cb6acfb8a4458b34708.png)

说明：被选中的checkbox出现了错误，同时微信小程序的编译也报了黄色警报，要求提供`wx:key`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/12665d7c56924dd6b0a43e4195cab480.png)





## 使用key

在使用`wx:for`设置了`wx:key`可以避免这种情况。

`*this`表示 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字。

```
<view style="background-color: rgb(190, 188, 188);">
  <view wx:for="{{checkboxList}}" wx:key="*this">
    <label>
      <checkbox value="{{item}}" />{{item}}
    </label>
  </view>
  <button bindtap="addCheckbox" size="mini">头部添加元素</button>
</view>
```

