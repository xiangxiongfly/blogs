[TOC]

# CSS 变形&过渡&动画

## 2D变形

### 位移变形

- 将transform属性值设置translate()，可实现位移变形
- 位移变形和相对定位非常像，也会在“老家留坑”，“行影分离”

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210524145901189.png)

```html
<style>
    img {
        border: 1px solid black;
    }

    .pic2 {
        transform: translate(100px, 100px);
    }
</style>

<body>
    <p><img class="pic1" src="images/a.png" alt=""></p>
    <p><img class="pic2" src="images/a.png" alt=""></p>
    <p><img class="pic3" src="images/a.png" alt=""></p>
</body>
```



### 旋转变形

- 将transform属性的值设置为rotate()，可实现选择变形
- 若角度为正，则顺时针旋转，否则逆时针旋转
- 可以`transform-origin`设置旋转点

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210524144030691.png)

```html
<style>
    img {
        border: 1px solid black;
    }

    .pic1 {
        transform: rotate(45deg);
    }

    .pic2 {
        transform: rotate(180deg);
    }

    .pic3 {
        transform: rotate(360deg);
    }

    .pic4 {
        /* 设置旋转点 */
        transform-origin: 0 0;
        transform: rotate(45deg);
    }
</style>

<body>
    <p><img class="pic1" src="images/a.png" alt=""></p>
    <p><img class="pic2" src="images/a.png" alt=""></p>
    <p><img class="pic3" src="images/a.png" alt=""></p>
    <p><img class="pic4" src="images/a.png" alt=""></p>
</body>
```



### 缩放变形

- 将transform属性值设置为scale()，可实现缩放变形

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210524144544545.png)

```html
<style>
    img {
        border: 1px solid black;
    }

    .pic1 {
        transform: scale(1.2);
    }

    .pic2 {
        transform: scale(.5);
    }
</style>

<body>
    <p><img class="pic1" src="images/a.png" alt=""></p>
    <p><img class="pic2" src="images/a.png" alt=""></p>
</body>
```



### 倾斜变形

- 将transform属性值设置为skew()，可实现倾斜变形

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210524145124287.png)

```html
<style>
    img {
        border: 1px solid black;
    }

    .pic1 {
        transform: skew(30deg, 0);
    }
</style>

<body>
    <p><img class="pic1" src="images/a.png" alt=""></p>
    <p><img class="pic2" src="images/a.png" alt=""></p>
</body>
```



## 3D变形

### 左手坐标系

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200627192015422.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

伸出左手，让拇指和食指成“L”形，大拇指向右，食指向上，中指指向前方。这样我们就建立了一个左手坐标系，拇指、食指和中指分别代表X、Y、Z轴的正方向。

### 3D旋转

- 将transform属性值设置为rotateX() / rotateY() / rotateZ()，可实现x轴、y轴、z轴旋转
- 需要设置透视值perspective

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210524151720612.png)

```html
<style>
    .box1 {
        margin: 40px auto;
        width: 202px;
        height: 202px;
        border: 1px solid black;
        perspective: 300px;
    }

    .box2 {
        width: 200px;
        height: 200px;
        border: 1px solid black;
        background-color: orange;
        transform: rotateX(30deg);
    }
</style>

<body>
    <div class="box1">
        <div class="box2"></div>
    </div>
</body>
```



### 3D移动

- 在元素进行3D选择后，可以添加translateX() / translateY() / translateZ()让元素在空间进行移动

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021052415410634.png)

```html
<style>
    .box1 {
        margin: 100px auto;
        width: 202px;
        height: 202px;
        border: 1px solid black;
        perspective: 300px;
    }

    .box2 {
        width: 200px;
        height: 200px;
        border: 1px solid black;
        background-color: orange;
        transform: rotateX(30deg) translateZ(100px);
    }
</style>

<body>
    <div class="box1">
        <div class="box2"></div>
    </div>
</body>
```



## 过渡

- transition过渡属性是CSS3的特性，过渡可以为一个元素在不同样式之间变化，自动添加补间动画
- 动画更细腻，内存开销小
- 哪些属性可以参与过渡：
  - 所有数值类型的属性都可以参与过渡，如：width height left top border-radius
  - 背景颜色和文字颜色
  - 所有变形（包含2D和3D）

```
transition: 过渡属性 过渡时间 变化速度 延迟时间;
```

**过渡动画**

<img src="https://img-blog.csdnimg.cn/20200627191716726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom: 67%;" />

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210525150513846.gif)

```html
<style>
    .box {
        width: 200px;
        height: 200px;
        background-color: orange;
        transition: width 5s linear 0s;
        margin-bottom: 10px;
    }

    .box:hover {
        width: 800px;
    }

    .box2 div {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: orange;
        border-radius: 0;
        left: 0;
        transition: left 1s linear 0s, background-color 1s linear 0s, border-radius 1s linear 0s;
    }

    .box2:hover div {
        left: 1000px;
        background-color: red;
        border-radius: 50%;
    }
</style>

<body>
    <div class="box"></div>

    <div class="box2">
        <div></div>
    </div>
</body>
```



## 动画

- 可以使用@keyframes定义动画
- 使用animation调用动画

```
animation: 动画名称 总时长 运动曲线 延迟时间 动画执行次数 动画交替模式;
```

| 属性                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| @keyframes                | 定义动画                                                     |
| animation                 | 调用动画，综合写法                                           |
| animation-name            | 动画名称                                                     |
| animation-duration        | 总时长                                                       |
| animation-timing-function | 运动曲线                                                     |
| animation-delay           | 延迟时间                                                     |
| animation-iteration-count | 动画执行次数<br />inflinite 无限次数                         |
| animation-direction       | 动画交替模式<br />normal 默认值，正常播放<br />reverse 轮流反向播放 |



![在这里插入图片描述](https://img-blog.csdnimg.cn/20210525102815716.gif)

```html
<style>
    .box1 {
        width: 200px;
        height: 200px;
        background-color: orange;
        animation: r 3s linear 0s infinite;
        margin-bottom: 50px;
    }

    @keyframes r {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .box2 {
        width: 200px;
        height: 200px;
        background-color: red;
        animation: changeToCircle 1s linear 0s infinite alternate;
        margin-bottom: 50px;
    }

    @keyframes changeToCircle {
        from {
            border-radius: 0;
        }
        to {
            border-radius: 50%;
        }
    }

    .box3 {
        width: 200px;
        height: 200px;
        background-color: green;
        animation: changeColor 3s linear 0s infinite;
    }

    @keyframes changeColor {
        0% {
            background-color: green;
        }
        20% {
            background-color: greenyellow;
        }
        40% {
            background-color: yellow;
        }
        60% {
            background-color: blue;
        }
        80% {
            background-color: gray;
        }
        100% {
            background-color: orange;
        }
    }
</style>

<body>
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
</body>
```



## [CSS特效-代码下载](https://github.com/xiangxiongfly/CSS-anim)