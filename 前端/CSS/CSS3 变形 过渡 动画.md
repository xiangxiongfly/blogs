[TOC]

# CSS3 变形 过渡 动画

在CSS3中，动画效果包括3个部分：变形（transform）、过渡（transition）、动画（animation）。



## transform(变形)

### 概述

可以使用transform属性来实现元素的各种变形效果，如平移、缩放、旋转、倾斜等。

位移变形和相对定位非常像，也会在“老家留坑”，“行影分离”。

| 方法        | 说明 |
| ----------- | ---- |
| translate() | 平移 |
| scale()     | 缩放 |
| skew()      | 倾斜 |
| rotate()    | 旋转 |

### translate() 平移

**语法**

```
transform: translateX(x);　　　 /*沿x轴方向平移*/
transform: translateY(y);　　　 /*沿y轴方向平移*/
transform: translate(x, y);　　 /*沿x轴和y轴同时平移*/
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 150px;
				height: 100px;
			}

			.box {
				border: 1px dashed silver;
			}

			.current {
				background-color: rgb(30, 170, 250);
				opacity: 0.5;
				transform: translate(20px, 20px);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="current"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/31b27fb45a66471a9959f268fd90a559.png)



### scale() 缩放

**语法**

```
transform: scaleX(x);　　　 /*沿x轴方向缩放*/
transform: scaleY(y);　　　 /*沿y轴方向缩放*/
transform: scale(x, y);　　 /*沿x轴和y轴同时缩放*/
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 150px;
				height: 100px;
			}

			.box {
				border: 1px dashed silver;
				margin: 50px auto;
			}

			.current {
				background-color: rgb(30, 170, 250);
				opacity: 0.5;
				transform: scale(1.2, 1.5);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="current"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/999fdea662a847bca3978519e55863ff.png)



### skew() 倾斜

**语法**

```
transform: skewX(x);　　　　/*沿x轴方向倾斜*/
transform: skewY(y);　　　　/*沿y轴方向倾斜*/
transform: skew(x, y);　　　/*沿x轴和y轴同时倾斜*/
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 150px;
				height: 100px;
			}

			.box {
				border: 1px dashed silver;
				margin: 50px auto;
			}

			.current {
				background-color: rgb(30, 170, 250);
				opacity: 0.5;
				transform: skewY(30deg);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="current"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0745488cd23e495684d401c23786a795.png)



### rotate() 旋转

**语法**

```
transform: rotate(angle);
```

**说明**

angle参数：表示元素相对于中心原点旋转的度数，单位为deg。如果度数为正，则表示顺时针旋转；如果度数为负，则表示逆时针旋转。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 150px;
				height: 100px;
			}

			.box {
				border: 1px dashed silver;
				margin: 50px auto;
			}

			.current {
				background-color: rgb(30, 170, 250);
				opacity: 0.5;
				transform: rotate(30deg);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="current"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d6404f65c5f14a6d9a964f68fc253ca3.png)



### transform-origin 中心原点

**语法**

```
transform-origin: 取值;
```

**说明**

transform-origin属性取值有两种：一种是“长度值”，另一种是“关键字”。

当取值为长度值时，单位可以为px、em和百分比等。

当取值为关键字时，transform-origin属性取值跟background-position属性取值是相似的.

![在这里插入图片描述](https://img-blog.csdnimg.cn/6dbd3a6bc76d458b8dbf2a013c0b9d4e.png)

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 150px;
				height: 100px;
			}

			.box {
				border: 1px dashed silver;
				margin: 50px auto;
			}

			.current {
				background-color: rgb(30, 170, 250);
				opacity: 0.5;
				transform-origin: right center;
				transform: rotate(-90deg);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="current"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/34804a1e37a744bb99a4fd49f808e7f7.png)



## transition(过渡)

### 概述

在CSS3中，我们可以使用transition属性将元素的某一个属性从“一个属性值”在指定的时间内平滑地过渡到“另一个属性值”，从而实现动画效果。

CSS变形（transform）呈现的仅仅是一个“结果”，而CSS过渡（transition）呈现的是一个“过程”。这个所谓的“过程”，通俗来说就是一种动画变化过程，如渐渐显示、渐渐隐藏、动画快慢等



### 说明

**语法**

```
transition: 过渡属性 过渡时间 过渡方式 延迟时间;
```

**transition子属性**

| 属性                       | 说明           |
| -------------------------- | -------------- |
| transition-property        | 需要操作的属性 |
| transition-duration        | 过渡时间       |
| transition-timing-function | 过渡速率       |
| transition-delay           | 延迟时间       |

**transition-timing-function属性**

![在这里插入图片描述](https://img-blog.csdnimg.cn/c4c461184319420ca01157c0d0a98904.png)

### 使用


```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				display: inline-block;
				padding: 5px 10px;
				border-radius: 5px;
				color: white;
				background-color: hotpink;
				cursor: pointer;
				transition: background-color 1s linear 0s;
			}

			div:hover {
				background-color: purple;
			}
		</style>
	</head>
	<body>
		<div>hello</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/54f7747e652c4033ace07db9f1e15dab.gif)

### transition-property取值为all

可以使用transition属性同时对多个CSS属性来实现过渡效果。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				display: inline-block;
				width: 100px;
				height: 100px;
				border-radius: 0%;
				background-color: lightskyblue;
				transition: all 1s linear 0s;
			}

			div:hover {
				border-radius: 50%;
				background-color: purple;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e1b1bb1e879b4af3822220e16c16c220.gif)



## animation(动画)

### 概述

在CSS3中，我们可以使用animation属性来实现元素的动画效果。

transition属性（即CSS3过渡）只能实现一次性的动画效果，而animation属性（即CSS3动画）可以实现连续性的动画效果。

### 说明

**语法**

```
animation:动画名称 持续时间 动画方式 延迟时间 动画次数 动画方向;
```

**说明**

animation是一个复合属性，主要包括6个子属性。

**animation的子属性**

| 属性                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| animation-name            | 动画名                                                       |
| animation-duration        | 动画持续时间                                                 |
| animation-timing-function | 动画速率变化方式                                             |
| animation-delay           | 延迟时间                                                     |
| animation-iteration-count | 动画播放次数<br />取值：1.正整数；<br />2.infinite，循环播放。 |
| animation-direction       | 动画播放方向<br />取值：1.normal，正向播放（默认值）；<br />2.reverse，反向播放；<br />3.alternate，奇数正向播放，偶数反向播放。 |
| animation-fill-mode       | 动画不播放时状态<br />取值：1.none，等待期间和完成后都为开始样式（默认值）；<br />2.forwards，等待期间为开始样式，完成后保持在最后一帧；<br />3.backwards，等待期间为第一帧，完成后跳转到开始样式；<br />4.both，等待期间为第一帧，完成后保持在最后一帧。 |

### 使用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			@keyframes mycolor {
				0% {
					background-color: red;
				}

				30% {
					background-color: blue;
				}

				60% {
					background-color: yellow;
				}

				100% {
					background-color: green;
				}
			}

			div {
				width: 100px;
				height: 100px;
				border-radius: 50px;
				background-color: red;
			}

			div:hover {
				animation: mycolor 5s linear;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/79aa51aa21bb45caabe1cac50b97c549.gif)

### animation-play-state 播放状态

**语法**

```
animation-play-state: 取值;
```

**animation-play-state属性取值**

| 属性值  | 说明         |
| ------- | ------------ |
| running | 播放，默认值 |
| paused  | 暂停         |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			@keyframes mytranslate {
				0% {}

				50% {
					transform: translateX(160px);
				}

				100% {}
			}

			#container {
				display: inline-block;
				width: 200px;
				border: 1px solid silver;
			}

			#ball {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background-color: red;
				animation: mytranslate 2s linear infinite;
			}
		</style>
		<script>
			window.onload = function() {
				var ball = document.getElementById("ball");
				var btn_pause = document.getElementById("btn_pause");
				var btn_play = document.getElementById("btn_play");
				btn_pause.onclick = function() {
					ball.style.animationPlayState = "paused";
				}
				btn_play.onclick = function() {
					ball.style.animationPlayState = "running";
				}
			}
		</script>
	</head>
	<body>
		<div id="container">
			<div id="ball"></div>
		</div>
		<div>
			<button id="btn_pause">暂停</button>
			<button id="btn_play">播放</button>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d47e2df75a24c0ba14e43bc0e82316b.gif)

### animation-fill-mode 动画不播放时状态

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            @keyframes test {
                0% {
                    left: 0px;
                    background: red;
                }

                100% {
                    left: 300px;
                    background: blue;
                }
            }

            div {
                width: 100px;
                height: 100px;
                background: yellow;
                position: relative;
                margin: 10px 0px;
            }

            .box1 {
                animation: test 4s linear 2s 1;
                animation-fill-mode: none;
            }

            .box2 {
                animation: test 4s linear 2s 1;
                animation-fill-mode: forwards;
            }

            .box3 {
                animation: test 4s linear 2s 1;
                animation-fill-mode: backwards;
            }

            .box4 {
                animation: test 4s linear 2s 1;
                animation-fill-mode: both;
            }
        </style>
    </head>
    <body>
        <div class="box1"></div>
        <div class="box2"></div>
        <div class="box3"></div>
        <div class="box4"></div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c9621cf4250342498599a78a2a8bd133.gif)



## [动画案例](http://t.csdn.cn/II9rJ)

