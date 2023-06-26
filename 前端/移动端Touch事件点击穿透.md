[toc]

# 移动端Touch事件点击穿透

## 问题

在发生触摸动作约300ms之后，移动端会模拟产生click动作，如果touch事件隐藏了原来元素 则click总作用到它底下的具有点击特性的元素，触发新元素的click事件和跳转，此现象被称为点击穿透。



## 原因

事件触发的先后顺序是：touchstart -> touchend -> click。正是由于这种 click 事件的滞后性设计为事件穿透（点击穿透）埋下了伏笔。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>click事件300ms延迟</title>
    <style>
      #mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <div id="mask"></div>
    <script>
      let btn = document.getElementById("btn");
      let mask = document.getElementById("mask");
      mask.addEventListener("touchstart", () => {
        console.log("touchstart");
        mask.style.display = "none";
      });
      mask.addEventListener("touchend", () => {
        console.log("touchend");
      });
      btn.addEventListener("click", () => {
        console.log("提交了");
      });
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a9acca0a7b8e4c36b7b5171ac1fd5de6.png)



## 解决

### 阻止默认行为

阻止默认的click事件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>click事件300ms延迟</title>
    <style>
      #mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <div id="mask"></div>
    <script>
      let btn = document.getElementById("btn");
      let mask = document.getElementById("mask");
      mask.addEventListener("touchstart", (e) => {
        e.preventDefault();
        console.log("touchstart");
        mask.style.display = "none";
      });
      mask.addEventListener("touchend", () => {
        console.log("touchend");
      });
      btn.addEventListener("click", () => {
        console.log("提交了");
      });
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/467c434cab7e412d8ddfa60c65556287.png)



### 目标元素延迟隐藏

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>click事件300ms延迟</title>
    <style>
      #mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        transition: opacity 0.5s;
      }
    </style>
  </head>
  <body>
    <button id="btn">点击</button>
    <div id="mask"></div>
    <script>
      let btn = document.getElementById("btn");
      let mask = document.getElementById("mask");
      mask.addEventListener("touchstart", (e) => {
        e.preventDefault();
        console.log("touchstart");
        setTimeout(() => {
          mask.style.display = "none";
        }, 200);
        mask.style.opacity = 0;
      });
      mask.addEventListener("touchend", () => {
        console.log("touchend");
      });
      btn.addEventListener("click", () => {
        console.log("提交了");
      });
    </script>
  </body>
</html>
```

