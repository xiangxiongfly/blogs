[toc]

# 微信小程序-使用vant组件库

## 概述

Vant Weapp 是有赞前端团队开源的小程序 UI 组件库，基于微信小程序的自定义组件开发，可用来快速搭建小程序项目。

[官方文档](https://vant.pro/vant-weapp/#/home)



## 构建npm

目前小程序已经支持使用 npm 安装第三方包，但是这些 npm 包在小程序中不能够直接使用，必须得使用小程序开发者工具进行构建后才可以使用。

因为 `node_modules` 目录下的包，不会参与小程序项目的编译、上传和打包，因此。在小程序项目中要想使用 npm 包，必须走一遍 **构建 npm** 的过程。

在构建成功以后，默认会在小程序项目根目录，也就是 `node_modules` 同级目录下生成 `miniprogram_npm`目录，里面存放这构建打包后的 npm 包，也就是小程序运行过程中真正使用的包。

目录结构如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f5526ac70a4b484f9025aa3ce637fb45.jpeg)



## 构建步骤

一、执行命令 `npm init -y`，生成 package.json 文件。

二、执行命令 ` npm i @vant/weapp`，添加 vant 组件库。

如果遇到问题，可以先清理缓存，执行命令 `npm cache clean --force`.

三、点击微信开发者工具：菜单栏 -> 工具 -> 构建npm，会生成 minnprogram_npm 目录。

 生成如下目录结构：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7c339be5588f47c7b108f5b2fcfee8c4.png)

四、删除 app.json 文件中 `style:v2` 属性，小程序的[新版基础组件](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style)强行加上了许多样式，难以覆盖，不关闭将造成部分组件样式混乱。



## 使用vant

### 注册

- 全局注册：在 app.json 中注册，可以在任意组件中使用。
- 局部注册：在 index.json 中注册，只能在当前组件中使用。

```
// index.json
"usingComponents": {
  "van-image": "@vant/weapp/image/index"
}
```

```
// app.json
"usingComponents": {
	"van-image": "@vant/weapp/image/index"
}
```

### 使用

```html
<van-button type="default">默认按钮</van-button>
<van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button>
```

```html
<!-- 网络图片： -->
<van-image width="100" height="100" src="https://img.yzcdn.cn/vant/cat.jpeg" />
<!-- 本地图片： -->
<van-image width="100" height="100" src="/images/a.png" />
<!-- 圆形图片： -->
<van-image width="100" height="100" round src="/images/a.png" />
```

### 添加事件

| 事件名     | 说明               | 回调参数     |
| :--------- | :----------------- | :----------- |
| bind:click | 点击图片时触发     | event: Event |
| bind:load  | 图片加载完毕时触发 | event: Event |
| bind:error | 图片加载失败时触发 | event: Event |

```
<van-image width="100" height="100" src="https://img.yzcdn.cn/vant/cat.jpeg" bind:click="handleClick" />
```

```
Page({
  handleClick() {
    console.log("点击了网络图片")
  },
})
```

### 使用插槽

| 名称    | 说明                       |
| :------ | :------------------------- |
| loading | 自定义加载中的提示内容     |
| error   | 自定义加载失败时的提示内容 |

```html
<van-image width="100" height="100" src="https://img.yzcdn.cn/vant/cat.jpeg" use-loading-slot use-error-slot>
  <van-loading slot="loading" type="spinner" size="20" vertical />
  <text slot="error">加载失败</text>
</van-image>
```



## 样式覆盖

`Vant Weapp` 基于微信小程序的机制，为开发者提供了以下 3 种修改组件样式的方法：

1. 解除样式隔离：在页面中使用 Vant Weapp 组件时，可直接在页面的样式文件中覆盖样式
2. 使用外部样式类：需要注意普通样式类和外部样式类的优先级是未定义的，需要添加 !important 保证外部样式类的优先级
3. 使用 CSS 变量：在页面或全局对多个组件的样式做批量修改以进行主题样式的定制

### 解除样式隔离

`Vant Weapp` 的所有组件都开启了`addGlobalClass: true`以接受外部样式的影响，因此我们可以通过审核元素的方式获取当前元素的类名，然后复制到组件的 `.wxss` 中进行修改。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/96fb5b217ce544348555c2cfa03053e9.png)

```
<van-button type="danger">危险按钮</van-button>
```

```
.van-button--danger {
  background-color: blue !important;
  border: 10rpx solid yellow !important;
}
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/56d035eb9d1a42b48649e260eb79f190.png)

### 使用外部样式类

Vant Weapp 开放了大量的外部样式类供开发者使用，具体的样式类名称可查阅对应组件的“外部样式类”部分。

需要注意的是普通样式类和外部样式类的优先级是未定义的，因此使用时请添加`!important`以保证外部样式类的优先级。

如下是 van-button 的外部样式类：

| 类名          | 说明                   |
| :------------ | :--------------------- |
| custom-class  | 根节点样式类           |
| hover-class   | 指定按钮按下去的样式类 |
| loading-class | 加载图标样式类         |

```
<van-button type="info" custom-class="my-custom-class">信息按钮</van-button>
```

```
.my-custom-class {
  background-color: lightcoral !important;
  color: blue !important;
}
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f015a374200e4e2a94949716e2758999.png)

### 使用CSS变量

Vant Weapp 为部分 CSS 属性开放了基于 CSS 属性的定制方案。

相较于 解除样式隔离 和 使用外部样式类，这种方案支持在页面或应用级别对多个组件的样式做批量修改以进行主题样式的定制。

当然，用它来修改单个组件的部分样式也是绰绰有余的

一、声明自定义属性，属性名需要以两个减号（`--`）开始，属性值则可以是任何有效的 CSS 值

```
/* 声明全局变量 */
page {
  --main-bg-color: lightcoral;
}
```

二、使用全局变量，用 `var()` 函数包裹

```
/* 声明全局变量 */
page {
  --main-bg-color: lightcoral;
}
```

```
/* 声明局部变量 */
.container {
  --main-bg-color: lightseagreen;
}
```

三、使用

```
<van-button type="primary" custom-class="my-custom-class2">主要按钮</van-button>
```


```
.my-custom-class2 {
  background-color: var(--main-bg-color) !important;
  color: red !important;
}
```

四、也可以在按钮上直接添加类名：

```
<van-button type="default" class="my-button">默认按钮</van-button>
```

```
.my-button {
  --my-background-color: red;
  --my-border-color: blue;
}

.van-button--default {
  font-size: 28rpx !important;
  background-color: var(--my-background-color) !important;
  border: 1px solid var(--my-border-color) !important;
}
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/029c7aa049284180829eae8e3c6e47a9.png)

