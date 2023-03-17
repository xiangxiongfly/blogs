[TOC]

# CSS 边框样式

## 边框样式

| 属性         | 说明     |
| ------------ | -------- |
| border-width | 边框宽度 |
| border-style | 边框外观 |
| border-color | 边框颜色 |

### border-width 边框宽度

**语法**

```
border-width: 像素值;
```



### border-style 边框外观

**语法**

```
border-style: 取值;
```

**取值**

| 属性值 | 说明   |
| ------ | ------ |
| none   | 无样式 |
| dashed | 虚线   |
| sold   | 实现   |



### border-color 边框颜色

**语法**

```
border-color: 颜色值;
```



### border 简写

**语法**

```
border: 边框宽度 边框外观 边框颜色;
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style>
            div {
                width: 100px;
                height: 100px;
                margin-top: 10px;
            }

            .box1 {
                border: 3px solid black;
            }

            .box2 {
                border: 3px dashed black;
            }

            .box3 {
                border: 3px dotted black;
            }
        </style>
    </head>
    <body>
        <body>
            <div class="box1"></div>
            <div class="box2"></div>
            <div class="box3"></div>
        </body>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/02576b3047bd47398cefbfbfe92d9ad4.png)



### 局部样式

**上边框 border-top**

```
border-top-width:1px;
border-top-style:solid;
border-top-color:red;
```

简写：

```
border-top:1px solid red;
```

**下边框 border-bottom**

```
border-bottom-width:1px;
border-bottom-style:solid;
border-bottom-color:red;
```

简写：

```
border-bottom:1px solid red;
```

**左边框 border-left**

```
border-left-width:1px;
border-left-style:solid;
border-left-color:red;
```

简写：

```
border-left:1px solid red;
```

**右边框 border-right**

```
border-right-width:1px;
border-right-style:solid;
border-right-color:red;
```

简写：

```
border-right:1px solid red;
```



## border-radius 边框圆角

在CSS3中，我们可以使用border-radius属性为元素添加圆角效果。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			div {
				width: 100px;
				height: 100px;
				margin: 10px;
				border: 1px solid red;
			}

			.box2 {
				border-radius: 10px;
			}

			.box3 {
				border-radius: 50%;
			}

			.box4 {
				height: 50px;
				border-radius: 50px 50px 0 0;
			}

			.box5 {
				height: 50px;
				border-radius: 50px/25px;
			}
		</style>
	</head>
	<body>
		<div class="box1"></div>
		<div class="box2"></div>
		<div class="box3"></div>
		<div class="box4"></div>
		<div class="box5"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/670dce6fd0d74825b3a65a04461776d0.png)



## box-shaow 边框阴影

在CSS2.1中，如果想要为元素添加边框阴影，也是只能使用背景图片的方式来实现。

在CSS3中，我们可以使用box-shadow属性轻松为元素添加阴影效果。

**语法**

```
box-shadow: x-offset y-offset blur spread color style;
```

**说明**

x-offset：定义水平阴影的偏移距离，可以使用负值。由于CSS3采用的是W3C坐标系，因此x-offset取值为正时，向右偏移；取值为负时，向左偏移。

y-offset：定义垂直阴影的偏移距离，可以使用负值。由于CSS3采用的是W3C坐标系，因此y-offset取值为正时，向下偏移；取值为负时，向上偏移。

blur：定义阴影的模糊半径，只能为正值。

spread：定义阴影的大小。

color：定义阴影的颜色。

style：定义是外阴影还是内阴影。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			.box {
				width: 100px;
				height: 100px;
				box-shadow: 2px 2px 10px rgba(0, 0, 0, .4);
			}
		</style>
	</head>
	<body>
		<div class="box"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a00cef7ab2a43fb8deddf8d6360c27f.png)



## border-image 边框背景

在CSS2.1中，边框只有实线、虚线等几种简单的样式。

在CSS3中，我们可以使用border-image属性为边框添加背景图片。现在所有主流浏览器最新版本都支持border-image属性。

**语法**

```
border-image: url(图片路径) 切割宽度 平铺方式;
```

**说明**

border-image属性需要定义3个方面的内容：

- 图片路径。
- 切割宽度：4条边的切割宽度，依次为上边、右边、下边、左边（顺时针）。
- 平铺方式：有3种取值，分别为repeat、round和stretch。
  - 取值为repeat时，表示4条边的小方块会不断重复，超出元素部分将会被剪切掉。
  - 取值为round时，表示4条边的小方块会铺满。为了铺满，边框图片会压缩或拉伸。
  - 取值为stretch时，表示4条边的小方块会拉伸，边长有多长就拉多长。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 170px;
				height: 110px;
				line-height: 110px;
				text-align: center;
				border: 30px solid gray;
				margin-top: 20px;
			}

			/*第1个div平铺方式为：repeat*/
			#div1 {
				border-image: url(img/border.png) 30 repeat;
			}

			/*第2个div平铺方式为：round*/
			#div2 {
				border-image: url(img/border.png) 30 round;
			}

			/*第3个div平铺方式为：stretch*/
			#div3 {
				border-image: url(img/border.png) 30 stretch;
			}
		</style>
	</head>
	<body>
		<div id="div1">repeat</div>
		<div id="div2">round</div>
		<div id="div3">stretch</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/98f4356a6d4b4d2e8ab84b120261e036.png)



