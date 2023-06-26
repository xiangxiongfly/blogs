[toc]

# Less 运行环境

## 概述

Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言。这里呈现的是 Less 的官方文档（中文版），包含了 Less 语言以及利用 JavaScript 开发的用于将 Less 样式转换成 CSS 样式的 Less.js 工具。

因为 Less 和 CSS 非常像，Less具有以下优点：

1. 变量：可以定义变量来存储颜色、字体、大小等常用样式，方便后续的样式修改和维护。
2. 嵌套规则：可以将相关的选择器嵌套在一起，使代码更加简洁易读。
3. 混合（Mixin）：可以将一些常用的样式封装成一个Mixin，然后在需要使用的地方直接调用，提高代码复用性。
4. 函数：可以自定义函数来处理样式，例如颜色的加减、字体的计算等。
5. Import：可以将多个Less文件合并成一个CSS文件，简化代码结构。

Less可以被认为是CSS的一种扩展，属于CSS系列的一部分。

[Less 快速入门 | Less.js 中文文档 - Less 中文网 (bootcss.com)](https://less.bootcss.com/)



## 运行Less

### 方式一：浏览器环境

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Less</title>
    <style type="text/less">
      .outer {
        width: 200px;
        height: 200px;
        margin: auto;
        background-color: red;
        .inner {
          width: 100px;
          height: 100px;
          margin: auto;
          background-color: green;
        }
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/less@4"></script>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

**等价于如下：**

```less
// index.less
.outer {
  width: 200px;
  height: 200px;
  margin: auto;
  background-color: red;
  .inner {
    width: 100px;
    height: 100px;
    margin: auto;
    background-color: green;
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Less</title>
    <link rel="stylesheet/less" type="text/css" href="./css/index.less" />
    <script src="./less/less.min.js"></script>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

### 方式二：koala编译器

[Koala编译工具](http://koala-app.com/index-zh.html)

![在这里插入图片描述](https://img-blog.csdnimg.cn/65c0281f4bb9450493e59dab369471b8.png)

通过koala编译器，将`index.less`文件编译为`index.css`文件。

在HTML中使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Less</title>
    <link rel="stylesheet" href="./css/index.css" />
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

### 方式三：Node环境下编译

**安装Less**

```
npm install -g less
```

**命令**

将`index.css`编译为`index.css`命令：

```
lessc index.less index.css
```

### 方式四：安装Easy LESS插件

可以在VSCode中通过安装Easy LESS插件，可以自动编译Less文件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/87299bbf5ebf4f8abde92de0eadce4cb.png)

