[toc]

# 移动端1px边框问题

## 问题

在移动端开发中，1px的边框在不同手机上显示粗细不一致，特别是在高清屏下会变的粗一些。



## 原因

并不是真的变粗了，而是设计师想要的1像素是1物理像素，不是程序员眼中的 1CSS像素。

设计图为750x1334，表示物理像素是750x1334：

- 如果dpr=1时，那么CSS像素为750x1334；
- 如果dpr=2时，那么CSS像素为375x667；
- 如果dpr=3时，那么CSS像素为250x444.66666；

如下所示：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>1px边框</title>
    <style>
      .box {
        width: 200px;
        height: 200px;
        border-bottom: 1px dashed black;
        background: red;
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
  </body>
</html>
```

dpr为1时：

![在这里插入图片描述](https://img-blog.csdnimg.cn/3343049c4e244b5a9970f1896dcd683b.png)

dpr为3时：

![在这里插入图片描述](https://img-blog.csdnimg.cn/93f4f810d1ef4366b59b9691c30f2984.png)



## 解决

### 伪类+transform（推荐）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>1px边框</title>
    <style>
      .box {
        width: 200px;
        height: 200px;
        border: 0.5px dashed black;
      }
      @media (-webkit-min-device-pixel-ratio: 2) {
        .border-1px {
          position: relative;
          border: none;
        }
        .border-1px::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          border: 1px dashed black;
          transform-origin: 0 0;
          transform: scale(0.5);
        }
      }
      @media (-webkit-min-device-pixel-ratio: 3) {
        .border-1px::after {
          width: 300%;
          height: 300%;
          border: 1px dashed black;
          transform: scale(0.33333);
        }
      }
    </style>
  </head>
  <body>
    <div class="box border-1px"></div>
  </body>
</html>
```

### viewport+rem

这种方式就可以像以前一样轻松愉快的写1px了。

如果devicePixelRatio = 2 时，输出viewport

```
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

如果devicePixelRatio = 3 时，输出viewport

```
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.33
```

使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <title>1px边框</title>
    <style>
      .box {
        width: 2.6667rem;
        height: 2.6667rem;
        border: 1px dashed black;
      }
    </style>
    <script>
      let rootEl = document.documentElement;
      let viewportEl = document.querySelector("meta[name='viewport']");
      let dpr = window.devicePixelRatio || 1;

      // 限制为整数
      if (dpr >= 3) {
        dpr = 3;
      } else if (dpr >= 2) {
        dpr = 2;
      } else {
        dpr = 1;
      }

      // 计算缩放比例
      let scale = 1 / dpr;
      let content = `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`;

      // 设置ViewPort
      if (viewportEl) {
        viewportEl.setAttribute("content", content);
      } else {
        viewportEl = document.createElement("meta");
        viewportEl.setAttribute("name", "viewport");
        viewportEl.setAttribute("content", content);
        document.head.appendChild(viewportEl);
      }

      // 设置rem
      function setRemUnit() {
        const ratio = 10;
        let viewWidth =
          rootEl.getBoundingClientRect().width || window.innerWidth;
        rootEl.style.fontSize = viewWidth / ratio + "px";
      }
      setRemUnit();

      // 监听屏幕尺寸变化
      window.addEventListener("resize", setRemUnit);
      indow.addEventListener("pageshow", function (e) {
        if (e.persisted) {
          setRemUnit();
        }
      });
    </script>
  </head>
  <body>
    <div class="box"></div>
  </body>
</html>
```

