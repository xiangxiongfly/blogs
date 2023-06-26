[toc]

# 移动端click事件300ms延迟

## 问题

在移动端中，点击屏幕的按钮会产生200~300ms的延迟响应，会导致用户认为页面卡顿问题。

如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>click事件300ms延迟</title>
    <style>
      #btn {
        width: 100%;
        height: 300px;
        font-size: 100px;
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <script>
      let btn = document.getElementById("btn");
      btn.addEventListener("touchstart", () => {
        console.time("click");
      });
      btn.addEventListener("click", () => {
        console.timeEnd("click");
        console.log("点击了");
      });
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/89d77cb9a5ed46879732d85336694b6c.png)



## 原因

原因是在移动端下，浏览器会做双加缩放检测（double-tap to zoom）。



## 解决

### 将click事件放在touchstart或touchend中处理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>click事件300ms延迟</title>
    <style>
      #btn {
        width: 100%;
        height: 300px;
        font-size: 100px;
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <script>
      let btn = document.getElementById("btn");
      btn.addEventListener("touchstart", () => {

      });
      btn.addEventListener("touchend", () => {
        console.log("点击了");
      });
    </script>
  </body>
</html>
```

### 禁止双击缩放

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1,maximum-scale=1, user-scalable=no" />
    <title>click事件300ms延迟</title>
    <style>
      #btn {
        width: 100%;
        height: 300px;
        font-size: 100px;
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <script>
      let btn = document.getElementById("btn");
      btn.addEventListener("touchstart", () => {
        console.time("click");
      });
      btn.addEventListener("click", () => {
        console.timeEnd("click");
        console.log("点击了");
      });
    </script>
  </body>
</html>
```

