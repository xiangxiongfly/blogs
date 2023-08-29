[toc]

# Bootstrap4 总结

## 概述

Bootstrap 是全球最受欢迎的前端开源工具库，它支持 Sass 变量和 mixin、响应式栅格系统、自带大量组件和众多强大的 JavaScript 插件。基于 Bootstrap 提供的强大功能，能够让你快速设计并定制你的网站。



## 安装

### 使用CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

### 使用源码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
  </head>
  <body>
    <script src="./libs/jquery/jquery-3.5.1.js"></script>
    <script src="./libs/bootstrap-4.6.2/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```



## 屏幕尺寸的分割点

- Bootstrap的一大核心是响应式，底层原理是使用媒体查询为布局和页面创建合理的断点，根据这些断点给不同屏幕尺寸设置不同的CSS样式。
- Bootstrap4设置了5个断点来构建响应式系统，5个断点分别为：Extral-Small、Small、Medium、Large、Extra large。

| 断点        | 中缀 | 尺寸    |
| ----------- | ---- | ------- |
| Extra-Small | None | <576px  |
| Small       | sm   | ≥576px  |
| Medium      | md   | ≥768px  |
| Large       | lg   | ≥992px  |
| Extra large | xl   | ≥1200px |



## 响应式容器(Containers)

- Containers容器是Bootstrap中最基本的布局元素，并且该布局支持响应式。在使用默认网格系统时是必须的。
- Containers容器用于包含、填充、内容居中使用。
- Bootstrap带有三个不同的Containers容器：
  - `.container`：它在每个断点处会设置不同的max-width。
  - `.container-fluid`：在所有断点处都是`width: 100%`。
  - `.container-{breakpoint}`：默认是`width: 100%`，直到指定断点才会修改响应的值。

|                    | Extra small <576px | Small ≥576px | Medium ≥768px | Large ≥992px | Extra large ≥1200px |
| ------------------ | ------------------ | ------------ | ------------- | ------------ | ------------------- |
| `.container`       | 100%               | 540px        | 720px         | 960px        | 1140px              |
| `.container-sm`    | 100%               | 540px        | 720px         | 960px        | 1140px              |
| `.container-md`    | 100%               | 100%         | 720px         | 960px        | 1140px              |
| `.container-lg`    | 100%               | 100%         | 100%          | 960px        | 1140px              |
| `.container-xl`    | 100%               | 100%         | 100%          | 100%         | 1140px              |
| `.container-fluid` | 100%               | 100%         | 100%          | 100%         | 100%                |

### .container-fluid

使用.container-fluid作为全宽度容器，横跨视口的整个宽度。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      div {
        background-color: pink;
        height: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container-fluid">我是box</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/279b56bf437e4caab38ebc8f5f6c8148.png)

### .container

.container类是一个响应式的、固定宽度的容器，这意味着它的最大宽度在每个断点处都会改变。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      div {
        background-color: pink;
        height: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">我是box</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fd3d42d0a474403bb796aa1118b23283.png)

### .container-{breakpoint}

它们允许您指定一个在达到指定断点之前宽度为100%的类，之后我们对每个较高的断点应用max-width。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      div {
        background-color: pink;
        height: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container-md">我是box</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b32525decbbd4fc5b62bffafde835302.png)



## 网格系统(Gird system)

- 在我们在开发一个页面时，经常会遇到一些列表（例如，商品列表），这些列表通常都是通过行和列来排版。为了方便我们对这种常见列表的布局，Bootstrap框架对它进行了封装，封装为一个网格系统（Grid system）。
- Bootstrap网格系统是用于构建移动设备优先的强大布局系统，可支持12列网格、5 个断点和数十个预定义类。
- 网格系统是有container、row、col三部分组成，底层使用flexbox来布局，并且支持12列网格布局。
  - 底层使用了强大的flexbox来构建弹性布局，并支持12列的网格布局。从Bootstrap2开始，网格系统从16 列转向12列网格，原因之一是12列比以前的16列系统更灵活。
  - 12列网格这意味着我们可将一行分解为12、6、4、3、2和1份：
    - 1列，独占12等份
    - 2列，每列占6等份
    - 3列，每列占4等份
    - 4列，每列占3等份
    - 6列，每列占2等份
    - 12列，每列占1等份



### 指定列宽

底层是 flex: 0 0 x%，max-width: x%

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .container {
        background-color: gainsboro;
      }
      .mr {
        margin-top: 10px;
      }
      .item {
        height: 40px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="container mr">
      <div class="row">
        <div class="col-1 item">1</div>
        <div class="col-1 item">2</div>
        <div class="col-1 item">3</div>
        <div class="col-1 item">4</div>
        <div class="col-1 item">5</div>
        <div class="col-1 item">6</div>
        <div class="col-1 item">7</div>
        <div class="col-1 item">8</div>
        <div class="col-1 item">9</div>
        <div class="col-1 item">10</div>
        <div class="col-1 item">11</div>
        <div class="col-1 item">12</div>
      </div>
      <div class="row mr">
        <div class="col-2 item">1</div>
        <div class="col-2 item">2</div>
        <div class="col-2 item">3</div>
        <div class="col-2 item">4</div>
        <div class="col-2 item">5</div>
        <div class="col-2 item">6</div>
      </div>
      <div class="row mr">
        <div class="col-3 item">1</div>
        <div class="col-3 item">2</div>
        <div class="col-3 item">3</div>
        <div class="col-3 item">4</div>
      </div>
      <div class="row mr">
        <div class="col-4 item">1</div>
        <div class="col-4 item">2</div>
        <div class="col-4 item">3</div>
      </div>
      <div class="row mr">
        <div class="col-6 item">1</div>
        <div class="col-6 item">2</div>
      </div>
      <div class="row mr">
        <div class="col-12 item">1</div>
      </div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d63875e1499e40a3af5af3b43ec218af.png)

#### 实现8列布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .container {
        background-color: gainsboro;
      }
      .mr {
        margin-top: 10px;
      }
      .item {
        height: 40px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="container mr">
      <h2>方式一：</h2>
      <div class="row">
        <div class="col item">1</div>
        <div class="col item">2</div>
        <div class="col item">3</div>
        <div class="col item">4</div>
        <div class="col item">5</div>
        <div class="col item">6</div>
        <div class="col item">7</div>
        <div class="col item">8</div>
      </div>
      <h2>方式二：</h2>
      <div class="row">
        <div class="col-6">
          <div class="row">
            <div class="col-3 item">1</div>
            <div class="col-3 item">2</div>
            <div class="col-3 item">3</div>
            <div class="col-3 item">4</div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-3 item">5</div>
            <div class="col-3 item">6</div>
            <div class="col-3 item">7</div>
            <div class="col-3 item">8</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f5011099ab2f4429aad3fa9069ed9dee.png)

### 等列宽

底层是 flex-grow: 1, max-width: 100%。该类网格系统仅用flexbox布局。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .container {
        background-color: gainsboro;
      }
      .mr {
        margin-top: 10px;
      }
      .item {
        height: 40px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="container mr">
      <div class="row">
        <div class="col item">1</div>
        <div class="col item">2</div>
        <div class="col item">3</div>
        <div class="col item">4</div>
        <div class="col item">5</div>
        <div class="col item">6</div>
        <div class="col item">7</div>
        <div class="col item">8</div>
        <div class="col item">9</div>
        <div class="col item">10</div>
        <div class="col item">11</div>
        <div class="col item">12</div>
        <div class="col item">13</div>
        <div class="col item">13</div>
        <div class="col item">13</div>
        <div class="col item">13</div>
      </div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1e48aa7bc55e4fbc8533f17dd2298362.png)

### auto列宽

底层是 flex: 0 0 auto; width: auto

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .container {
        background-color: gainsboro;
      }
      .mr {
        margin-top: 10px;
      }
      .item {
        height: 40px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="container mr">
      <div class="row">
        <div class="col-auto item">helloworld</div>
        <div class="col item">1</div>
        <div class="col item">2</div>
        <div class="col item">3</div>
      </div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1d1a5f8856a54d4e9a12bf6d9a3e662f.png)

### 响应式列

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .container {
        background-color: gainsboro;
      }
      .mr {
        margin-top: 10px;
      }
      .item {
        height: 40px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="container mr">
      <div class="row">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">1</div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">2</div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">3</div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">4</div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">5</div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 item">6</div>
      </div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/167d99a16d6c411aae580583e9cff7a2.gif)



## 响应式工具类

### display属性

**当我们在开发响应式页面时，可能会有这样的需求：**

- 某个功能在PC端可见，但是在移动端不可见。

- 因为移动端的屏幕比较小，是不能把PC端中所有的内容都展示出来，所以有些不重要的内容可能在移动端就被简化了。

- 这时我们就可以借用响应式的工具来实现该功能。

**使用响应工具类：**

- 隐藏元素可以给某个元素添加 .d-none 类或 .d-{sm,md,lg,xl,xxl}-none 类中的任何一个。

- 显示元素可以给某个元素添加 .d-block 类或 .d-{sm,md,lg,xl,xxl}-block 类中的任何一个。

| 屏幕尺寸                 | 类                               |
| ------------------------ | -------------------------------- |
| 在所有尺寸的屏幕上隐藏   | `.d-none`                        |
| 只在 xs 尺寸的屏幕上隐藏 | `.d-none .d-sm-block`            |
| 只在 sm 尺寸的屏幕上隐藏 | `.d-sm-none .d-md-block`         |
| 只在 md 尺寸的屏幕上隐藏 | `.d-md-none .d-lg-block`         |
| 只在 lg 尺寸的屏幕上隐藏 | `.d-lg-none .d-xl-block`         |
| 只在 xl 尺寸的屏幕上隐藏 | `.d-xl-none`                     |
| 在所有尺寸的屏幕上显示   | `.d-block`                       |
| 只在 xs 尺寸的屏幕上显示 | `.d-block .d-sm-none`            |
| 只在 sm 尺寸的屏幕上显示 | `.d-none .d-sm-block .d-md-none` |
| 只在 md 尺寸的屏幕上显示 | `.d-none .d-md-block .d-lg-none` |
| 只在 lg 尺寸的屏幕上显示 | `.d-none .d-lg-block .d-xl-none` |
| 只在 xl 尺寸的屏幕上显示 | `.d-none .d-xl-block`            |

### 其他工具类

快速浮动（Float）：

- float-left

- float-right

文本（Text）：

- text-left、text-right、text-center

- text-{sm、md、lg、xl}-left 

边框：

- borde border-top border-left ....

- border border-primary border-success

截断文本：

- text-truncate



## 组件

### 按钮

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
  </head>
  <body>
    <div class="btn btn-primary">按钮一</div>
    <div class="btn btn-warning">按钮一</div>
    <div class="btn btn-info">按钮一</div>

    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-light">Light</button>
    <button type="button" class="btn btn-dark">Dark</button>
    <button type="button" class="btn btn-link">Link</button>

    <script src="./libs/jquery/jquery-3.5.1.js"></script>
    <script src="./libs/bootstrap-4.6.2/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/18fea500a0ff46d0879389e9f67c8ff9.png)

### 按钮组

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
  </head>
  <body>
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group mr-2" role="group" aria-label="First group">
        <button type="button" class="btn btn-secondary">1</button>
        <button type="button" class="btn btn-secondary">2</button>
        <button type="button" class="btn btn-secondary">3</button>
        <button type="button" class="btn btn-secondary">4</button>
      </div>
      <div class="btn-group mr-2" role="group" aria-label="Second group">
        <button type="button" class="btn btn-secondary">5</button>
        <button type="button" class="btn btn-secondary">6</button>
        <button type="button" class="btn btn-secondary">7</button>
      </div>
      <div class="btn-group" role="group" aria-label="Third group">
        <button type="button" class="btn btn-secondary">8</button>
      </div>
    </div>

    <script src="./libs/jquery/jquery-3.5.1.js"></script>
    <script src="./libs/bootstrap-4.6.2/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ee7338ba44594587b0e4e0135f5b27fe.png)

### 轮播图

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
  </head>
  <body>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="./images/0.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
          <img src="./images/1.jpg" class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
          <img src="./images/1.jpg" class="d-block w-100" alt="..." />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-target="#carouselExampleIndicators" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-target="#carouselExampleIndicators" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </button>
    </div>

    <script src="./libs/jquery/jquery-3.5.1.js"></script>
    <script src="./libs/bootstrap-4.6.2/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/86dac95f50b04c87a83e0381d1d20ead.png)

### 面包屑导航

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
    <style>
      .mt {
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container mt">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item"><a href="#">Library</a></li>
          <li class="breadcrumb-item active" aria-current="page">Data</li>
        </ol>
      </nav>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d45493738fa405b966a90f84eacd269.png)

### 弹窗

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./libs/bootstrap-4.6.2/css/bootstrap.min.css" />
  </head>
  <body>
    <button id="btn" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      Launch demo modal
    </button>

    <div class="modal" id="myModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <script src="./libs/jquery/jquery-3.5.1.js"></script>
    <script src="./libs/bootstrap-4.6.2/js/bootstrap.bundle.min.js"></script>
    <script>
      $("#btn").click("click", function () {
        $("#myModal").modal("show");
      });
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/76b7a04f840c4cfdaba4d8d5a8e5131a.gif)



## 案例

[代码下载](https://github.com/xiangxiongfly/MyH5/tree/main/bootstrap-4.6.1_demo)

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc0fefa1c61347d882c4ea1db4c356a5.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4b59e16fb164ba59f892e1ac705fb26.png)