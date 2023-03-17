[TOC]

# CSS定位

## 概述

**position属性值**

| 属性值   | 说明                                           |
| -------- | ---------------------------------------------- |
| static   | 默认值，静态定位                               |
| relative | 相对定位，相对于原始位置进行定位               |
| absolute | 绝对定位，相对于上一个已经定位的父元素进行定位 |
| fixed    | 固定定位，相对于浏览器窗口定位                 |

**偏移**

除了静态定位外，position属性一般配合偏移使用。

| 属性   | 说明     |
| ------ | -------- |
| top    | 顶部偏移 |
| bottom | 顶部偏移 |
| left   | 左侧偏移 |
| right  | 右侧偏移 |



## static 静态定位

静态定位是所有元素的默认定位方式。

可以通过`position: static`开启静态定位。

在静态定位中不能通过边偏移属性改变元素的位置。



## relative 相对定位

相对定位不会脱离文档流，指元素的位置相对于它的原宿位置计算而来的。

**语法**

```
position: relative;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.box1 {
				background-color: red;
				width: 100px;
				height: 100px;
			}

			.box2 {
				background-color: green;
				width: 100px;
				height: 100px;
				position: relative;
				top: 50px;
				left: 50px;
			}

			.box3 {
				background-color: blue;
				width: 100px;
				height: 100px;
			}
		</style>
	</head>
	<body>
		<div class="box1"></div>
		<div class="box2"></div>
		<div class="box3"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/99cd047036e94a1fb6134c77387f1354.png)



### 导航条制作

鼠标经过时，导航条上面出现红色边框。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			ul {
				list-style: none;
				width: 960px;
				height: 40px;
				margin: 40px auto;
			}

			ul li {
				float: left;
				width: 120px;
				height: 40px;
				text-align: center;
				line-height: 40px;
			}

			ul li a {
				display: block;
				width: 120px;
				height: 40px;
				background-color: orange;
				text-decoration: none;
				color: white;
			}

			ul li a:hover {
				border-top: 3px solid red;
				position: relative;
				top: -3px;
				background-color: gold;
			}
		</style>
	</head>
	<body>
		<ul>
			<li><a href="#">网站栏目</a></li>
			<li><a href="#">新闻</a></li>
			<li><a href="#">HTML</a></li>
			<li><a href="#">CSS</a></li>
			<li><a href="#">JavaScript</a></li>
			<li><a href="#">jQuery</a></li>
			<li><a href="#">Vue</a></li>
			<li><a href="#">React</a></li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20b94c8855c247ce8a69891f0144b1dd.png)



## absolute 绝对定位

绝对定位会脱离文档流，具有快元素特性，默认情况下，绝对定位的元素的位置是相对于浏览器定位的。

**父元素没有定位**

若所有父元素都没有定位，则以`html`根元素进行定位。

**父元素有定位**

绝对定位是根据最近的定位父元素进行定位。

**子绝父相**

通常子元素为绝对定位时，父元素用相对定位。

因为子元素时绝对定位，不会占有位置，可以放在父盒子的任何地方。父元素布局时需要占有位置。

**语法**

```
position: absolute;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.box1 {
				background-color: red;
				width: 100px;
				height: 100px;
			}

			.box2 {
				background-color: green;
				width: 100px;
				height: 100px;
				position: absolute;
				top: 50px;
				left: 50px;
			}

			.box3 {
				background-color: blue;
				width: 100px;
				height: 100px;
			}
		</style>
	</head>
	<body>
		<div class="box1"></div>
		<div class="box2"></div>
		<div class="box3"></div>
	</body>
</html>
```

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.box1 {
				background-color: green;
				width: 200px;
				height: 200px;
				position: absolute;
				top: 50px;
				left: 50px;
			}

			.box2 {
				background-color: yellow;
				width: 50px;
				height: 50px;
				position: absolute;
				top: 50px;
				left: 50px;
			}
		</style>
	</head>
	<body>
		<div class="box1">
			<div class="box2"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2c0d98fc797748ce89bafeb376381d34.png)



### 水平垂直居中

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210523181627773.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }

    div {
        width: 400px;
        height: 300px;
        border: 1px solid black;
        margin: 40px auto;
        position: relative;
    }

    p {
        width: 80px;
        height: 80px;
        background-color: orange;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -40px;
        margin-left: -40px;
    }
</style>

<body>
    <div>
        <p></p>
    </div>
</body>
```



## fixed 固定定位

固定定位会脱离标准文档流，以浏览器窗口为参照物。

被固定的元素不会随着滚动条的拖动而改变位置。

**语法**

```
position: fixed;
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #first {
                width: 120px;
                height: 1800px;
                border: 1px solid gray;
                line-height: 600px;
                background-color: #B7F1FF;
            }

            #second {
                width: 50px;
                height: 50px;
                position: fixed;
                bottom: 30px;
                right: 30px;
                font-size: 13px;
                line-height: 16px;
                background-color: hotpink;
                box-sizing: border-box;
                padding: 10px 8px 0 12px;
            }
        </style>
    </head>
    <body>
        <div id="first">无定位的div元素</div>
        <div id="second">回到顶部</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/70f7f49c8b79403bad7509539eecb620.png)



## 四种定位总结

| 定位模式 | 是否脱标占有位置     | 是否可以使用边偏移 | 移动位置基准         |
| -------- | -------------------- | ------------------ | -------------------- |
| static   | 不脱标               | 不可以             | 正常模式             |
| relative | 不脱标，占有位置     | 可以               | 相对自身位置移动     |
| absolute | 完全脱标，不占有位置 | 可以               | 相对定位父级元素位置 |
| fixed    | 完全脱标，不占有位置 | 可以               | 相对于浏览器位置     |



## z-index 层叠级别

- 当多个元素同时设置定位时，元素之间会出现重叠问题
- 这时可以使用`z-index`属性，取值越大，层叠元素越居上
- 只有相对定位、绝对定位、固定定位有该属性，其他浮动、静态定位无此属性

```
选择器 {
	z-index: 1;
}
```

