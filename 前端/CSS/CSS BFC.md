[toc]

# BFC

## 什么是BFC

在CSS中，BFC（Block Formatting Context，即块级格式化上下文）。它是一个独立的渲染区域，块级盒子按照移动的规则进行布局，并与外部的元素相互隔离。



## BFC解决问题

- 元素开启BFC后，子元素不会产生margin塌陷问题。
- 元素开启BFC后，元素本身不会被其他浮动元素覆盖。
- 元素开启BFC后，即使子元素浮动，元素自身高度也不会塌陷。



## 开启BFC

- 根元素，即HTML元素。
- 浮动元素。
- 绝对定位、固定定位的元素。
- 行内块元素。
- 表格元素，如table、thead、tbody、tfoot、th、td、tr、caption。
- overflow不为visible的块元素。
- 弹性盒子。
- 多列容器。



## Demo

### BFC解决margin塌陷问题

**问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFC解决margin塌陷问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      .outer {
        width: 400px;
        background-color: grey;
      }

      .inner {
        width: 100px;
        height: 100px;
        margin: 20px;
      }

      .inner1 {
        background-color: red;
      }
      .inner2 {
        background-color: green;
      }
      .inner3 {
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner inner1"></div>
      <div class="inner inner2"></div>
      <div class="inner inner3"></div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f74adc30f7484cde85c6384b28c1701e.png)

**开启BFC解决问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFC解决margin塌陷问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        /* display: flex; */
      }
      .outer {
        width: 400px;
        background-color: grey;
        /* float: left; */
        /* position: absolute; */
        /* display: inline-block; */
        /* display: table; */
        /* overflow: hidden; */
        /* column-count: 1; */
      }

      .inner {
        width: 100px;
        height: 100px;
        margin: 20px;
      }

      .inner1 {
        background-color: red;
      }
      .inner2 {
        background-color: green;
      }
      .inner3 {
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner inner1"></div>
      <div class="inner inner2"></div>
      <div class="inner inner3"></div>
    </div>
  </body>
</html>
```

### BFC解决浮动元素覆盖问题

**问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFC解决浮动元素覆盖问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .box {
        width: 100px;
        height: 100px;
      }
      .box1 {
        background-color: red;
        float: left;
      }
      .box2 {
        background-color: green;
      }
    </style>
  </head>
  <body>
    <div class="box box1"></div>
    <div class="box box2"></div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/652d19e1fdcc4f04a3b457f044a42975.png)

**开启BFC解决问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFC解决浮动元素覆盖问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        /* display: flex; */
      }
      .box {
        width: 100px;
        height: 100px;
      }
      .box1 {
        background-color: red;
        float: left;
      }
      .box2 {
        background-color: green;
        /* float: left; */
        /* position: absolute; */
        /* display: inline-block; */
        /* display: table; */
        /* overflow: hidden; */
        /* column-count: 1; */
      }
    </style>
  </head>
  <body>
    <div class="box box1"></div>
    <div class="box box2"></div>
  </body>
</html>
```

### BFC解决元素高度塌陷问题

**问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BGC解决高度塌陷问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .outer {
        width: 400px;
        background-color: grey;
      }
      .inner {
        width: 100px;
        height: 100px;
        float: left;
      }
      .inner1 {
        background-color: red;
      }
      .inner2 {
        background-color: green;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner inner1"></div>
      <div class="inner inner2"></div>
    </div>
  </body>
</html>
```

**开启BFC解决问题**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BGC解决高度塌陷问题</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        /* display: flex; */
      }
      .outer {
        width: 400px;
        background-color: grey;
        /* float: left; */
        /* position: absolute; */
        /* display: inline-block; */
        /* display: table; */
        /* overflow: hidden; */
        /* column-count: 1; */
      }
      .inner {
        width: 100px;
        height: 100px;
        float: left;
      }
      .inner1 {
        background-color: red;
      }
      .inner2 {
        background-color: green;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner inner1"></div>
      <div class="inner inner2"></div>
    </div>
  </body>
</html>
```



## [代码下载](https://github.com/xiangxiongfly/bfc)

