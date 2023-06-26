[toc]

# rem&vw布局

## rem布局方式

### 原理

rem是相对于根元素（html元素）的字体大小来计算的，因此可以根据不同的屏幕尺寸和设备类型自动调整。通常情况下，我们会将根元素的字体大小设置为一个固定值，然后使用rem单位来定义其他元素的尺寸和位置。这里将屏幕宽划分为10等份，计算每1份的值，将其赋值给根元素的fontSize，也就是1rem的值。

缺点：

在某些情况下，使用rem布局可能会导致页面加载速度变慢。这是因为浏览器需要计算每个元素的大小和位置，而这些计算可能会变得非常复杂。

### 使用

例如：以iphone6为基准，物理像素为750x1334，dpr为2，因此css像素为375x667。按宽度划分为10等分，宽度一共有10个rem，1rem为37.5px。

以iphone12 pro为基准，物理像素为1170x2532，dpr为3，因此css像素为390x844。宽度一共有10个rem，1rem为39px。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>rem布局方式</title>
    <link rel="stylesheet" href="./fonts/iconfont/iconfont.css" />
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .box {
        width: 5rem;
        height: 5rem;
        line-height: 5rem;
        background-color: pink;
      }
    </style>
    <script>
      const docEl = document.documentElement;
      function setHtmlFontSize() {
        const viewWidth = docEl.clientWidth;
        docEl.style.fontSize = viewWidth / 10 + "px";
      }
      setHtmlFontSize();
      window.addEventListener("resize", setHtmlFontSize);
    </script>
  </head>
  <body>
    <div class="box">hello</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/edff756c81fc48a5833ca9d0081aa0be.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/8f96e87fd69d4cc89714cad8e564ec33.png)



### 第三框架

[https://github.com/amfe/lib-flexible](https://github.com/amfe/lib-flexible)



## vw布局方式

### 原理

vw布局是一种响应式设计的布局方式，它可以根据不同的屏幕尺寸和设备类型自动调整页面布局。vw布局使用相对单位（vw）来定义元素的尺寸和位置，而不是使用固定的像素值。这使得页面可以在不同的设备上自适应，并且可以避免在不同设备上出现滚动条或者元素溢出的问题。

这种布局方式更加推荐。

vw布局的缺点：老项目可能有兼容性问题。

### 使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vw布局方式</title>
    <link rel="stylesheet" href="./fonts/iconfont/iconfont.css" />
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .box {
        width: 50vw;
        height: 25vw;
        line-height: 25vw;
        font-size: 10vw;
        background-color: pink;
      }
    </style>
  </head>
  <body>
    <div class="box">hello</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f3c6726727ec4e82a695dcc83ff1702d.png)



## rem&vw混合布局方式

rem&vw布局方案是用于改写传统的rem方案。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vw&rem布局方式</title>
    <link rel="stylesheet" href="./fonts/iconfont/iconfont.css" />
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      html {
        /*
        原理：设计图为：750*1334
        屏幕一共是100vw，可得：
        1vw = 7.5px
        1px = 0.1333333333333333vw
        假设屏幕分10等份：可得：
        1rem = 75px
        价于：
        1rem = 10vw
        */
        font-size: 10vw;
      }
      .box {
        width: 5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        background-color: pink;
      }
    </style>
  </head>
  <body>
    <div class="box">hello</div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f3c6726727ec4e82a695dcc83ff1702d.png)



## vw方案案例

[代码下载](https://github.com/xiangxiongfly/MyH5/tree/main/常用布局方式/rem%26vw布局)

![在这里插入图片描述](https://img-blog.csdnimg.cn/459bb0f6b2154f029a93067690c5a34e.png)

