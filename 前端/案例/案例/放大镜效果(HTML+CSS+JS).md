[toc]

# 放大镜效果(HTML+CSS+JS)

![在这里插入图片描述](https://img-blog.csdnimg.cn/066d75a424ea401a9dca9d6bddd0ed39.png)



### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>放大镜</title>
    <link rel="stylesheet" href="./reset.css" />
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    <div class="container">
      <div class="top">
        <!-- 小图框 -->
        <div class="small_wrap">
          <!-- 小图片 -->
          <img class="small_img" />
          <!-- 蒙版 -->
          <div class="mask"></div>
        </div>
        <!-- 大图框 -->
        <div class="big_wrap">
          <img class="big_img" />
        </div>
      </div>
      <div class="bottom">
        <a class="prev" href="javascript:;">&lt;</a>
        <div class="pic_list">
          <ul></ul>
        </div>
        <a class="next" href="javascript:;">&gt;</a>
      </div>
    </div>
    <script src="./data.js"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

### CSS

```css
/* reset.css */
* {
    margin: 0;
    padding: 0;
}

ul {
    list-style: none;
}

a {
    text-decoration: none;
    color: #666;
}
```

```css
/* index.css */
.container {
    user-select: none;
    width: 822px;
    margin: 100px auto;
}

.top {
    position: relative;
}

.small_wrap {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #dfdfdf;
}

.small_wrap .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 200px;
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid #ddd;
    display: none;
}

.big_wrap {
    position: absolute;
    left: 420px;
    top: 0;
    width: 400px;
    height: 400px;
    border: 1px solid #ddd;
    overflow: hidden;
    display: none;
}

.small_wrap:hover+.big_wrap {
    display: block;
}

.small_wrap:hover .mask {
    display: block;
}

.big_wrap .big_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 800px;
    height: 800px;
}

.bottom {
    width: 400px;
    margin-top: 5px;
    font-size: 0;
}

.bottom .prev,
.bottom .next {
    float: left;
    width: 10px;
    height: 54px;
    border: 1px solid #ccc;
    background-color: #ebebeb;
    text-align: center;
    line-height: 54px;
    font-size: 12px;
}

.bottom .prev {
    margin-right: 4px;
}

.bottom .pic_list {
    position: relative;
    float: left;
    width: 372px;
    height: 56px;
    overflow: hidden;
}

.bottom .pic_list ul {
    position: absolute;
    left: 0;
    white-space: nowrap;
    transition: all 0.2s;
}

.bottom .pic_list ul li {
    display: inline-block;
    width: 50px;
    height: 50px;
    padding: 2px;
    border: 1px solid #ccc;
    margin-right: 20px;
    cursor: pointer;
}

.bottom .pic_list ul li img {
    width: 50px;
    height: 50px;
}
```

### JS

```js
// data.js
let imageUrls = [
  { b: "../img/phone/b1.png", s: "../img/phone/s1.png" },
  { b: "../img/phone/b2.png", s: "../img/phone/s2.png" },
  { b: "../img/phone/b3.png", s: "../img/phone/s3.png" },
  { b: "../img/phone/b1.png", s: "../img/phone/s1.png" },
  { b: "../img/phone/b2.png", s: "../img/phone/s2.png" },
  { b: "../img/phone/b3.png", s: "../img/phone/s3.png" },
  { b: "../img/phone/b1.png", s: "../img/phone/s1.png" },
  { b: "../img/phone/b2.png", s: "../img/phone/s2.png" },
  { b: "../img/phone/b3.png", s: "../img/phone/s3.png" },
  { b: "../img/phone/b1.png", s: "../img/phone/s1.png" },
  { b: "../img/phone/b2.png", s: "../img/phone/s2.png" },
  { b: "../img/phone/b3.png", s: "../img/phone/s3.png" },
  { b: "../img/phone/b1.png", s: "../img/phone/s1.png" },
  { b: "../img/phone/b2.png", s: "../img/phone/s2.png" },
];
```

```javascript
// index.js

let smallWrap = document.querySelector(".small_wrap");
let mask = document.querySelector(".mask");
let smallImg = document.querySelector(".small_img");
let bigWrap = document.querySelector(".big_wrap");
let bigImg = document.querySelector(".big_img");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let ul = document.querySelector(".pic_list ul");

let imgIndex = 0;

initBottom();
//初始化底部缩略图
function initBottom() {
  for (let i = 0; i < imageUrls.length; i++) {
    let li = document.createElement("li");
    let img = document.createElement("img");
    img.src = imageUrls[i].s;
    li.appendChild(img);
    li.onclick = function () {
      imgIndex = i;
      smallImg.src = imageUrls[imgIndex].s;
      bigImg.src = imageUrls[imgIndex].b;
    };
    ul.appendChild(li);
  }
}

initMagnifier();
//初始化放大镜
function initMagnifier() {
  smallImg.src = imageUrls[imgIndex].s;
  bigImg.src = imageUrls[imgIndex].b;

  smallWrap.onmousemove = function (e) {
    let left =
      e.clientX - smallWrap.getBoundingClientRect().left - mask.offsetWidth / 2;
    let top =
      e.clientY - smallWrap.getBoundingClientRect().top - mask.offsetHeight / 2;

    //边界限制
    if (left < 0) {
      left = 0;
    } else if (left > smallWrap.clientWidth - mask.offsetWidth) {
      left = smallWrap.clientWidth - mask.offsetWidth;
    }
    if (top < 0) {
      top = 0;
    } else if (top > smallWrap.clientHeight - mask.offsetHeight) {
      top = smallWrap.clientHeight - mask.offsetHeight;
    }

    //移动mask
    mask.style.left = left + "px";
    mask.style.top = top + "px";

    //移动距离比例
    let scale =
      (smallWrap.clientWidth - mask.offsetWidth) /
      (bigImg.offsetWidth - bigWrap.clientWidth);

    //移动大图片
    bigImg.style.left = -(left / scale) + "px";
    bigImg.style.top = -(top / scale) + "px";
  };
}

initTurn();
function initTurn() {
  let liList = document.querySelectorAll(".pic_list ul li");
  //起点
  let start = 0;
  //步长
  let step = (liList[0].offsetWidth + 20) * 2;
  //范围
  let endRange = (liList.length - 5) * (liList[0].offsetWidth + 20);

  prev.onclick = function () {
    start += step;
    if (start > 0) {
      start = 0;
    }
    ul.style.left = start + "px";
  };

  next.onclick = function () {
    start -= step;
    if (start < -endRange) {
      start = -endRange;
    }
    ul.style.left = start + "px";
  };
}
```

