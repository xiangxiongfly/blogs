[TOC]

# HTML5 Canvas

## 概述

HTML5新增了一个Canvas元素，我们常说的Canvas技术，指的就是使用Canvas元素结合JavaScript来绘制各种图形的技术。



## Canvas元素

Canvas是一个行内块元素（即inline-block），我们一般需要指定其3个属性：id、width和height。width和height分别定义Canvas的宽度和高度。默认情况下，Canvas的宽度为300px，高度为150px。

**Canvas对象常用属性**

| 属性   | 说明         |
| ------ | ------------ |
| width  | Canvas的宽度 |
| height | Canvas的高度 |

**Canvas对象常用方法**

| 方法             | 说明                             |
| ---------------- | -------------------------------- |
| getContext("2d") | 获取Canvas 2D上下文环境对象      |
| toDataURL()      | 获取Canvas对象产生的位图的字符串 |

对于IE浏览器来说，暂时只有IE9及以上版本支持HTML5 Canvas，对于IE7和IE8，我们可以借助ExplorerCanvas扩展来解决。



## 使用

### 绘制直线

**语法**

```
cxt.moveTo(x1, y1);
cxt.lineTo(x2, y2);
cxt.stroke();
```

**说明**

`moveTo()`移动画，表示笔起点坐标；`lineTo()`画直线，表示终点坐标；必须调用`stroke()`才会生效。

#### 画2条直线

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.moveTo(50, 50);
				context.lineTo(100, 50);
				context.moveTo(50, 100);
				context.lineTo(100, 100);
				context.stroke();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a0a96d8b85254ddcbbe326562b112d79.png)

#### 用直线画三角形

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.moveTo(50, 100);
				context.lineTo(150, 50);
				context.lineTo(150, 100);
				context.lineTo(50, 100);
				context.stroke();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e84b9bd56ed4148b2a10f657059a84e.png)

#### 用直线画矩形

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.moveTo(50, 100);
				context.lineTo(50, 50);
				context.lineTo(100, 50);
				context.lineTo(100, 100);
				context.lineTo(50, 100);
				context.stroke();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a4cc3c00a674c2899779b68e04dbeaa.png)



### 绘制矩形

#### 描边矩形

**语法**

```
cxt.strokeStyle = "属性值";
cxt.strokeRect(x,y,width,height);
```

**strokeStyle属性**

strokeStyle属性取值有3种：颜色值、渐变色和图案。

```
cxt.strokeStyle = "#FF0000";　　　　　　 //十六进制颜色值
cxt.strokeStyle = "red";　　　　　　　　 //颜色关键字
cxt.strokeStyle = "rgb(255,0,0)";　　　 //rgb颜色值
cxt.strokeStyle = "rgba(255,0,0,0.8)";　//rgba颜色值
```

**strokeRect()方法**

x和y为矩形左上角坐标，width和height表示矩形宽高。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.strokeStyle = "red";
				context.strokeRect(50, 50, 100, 50);
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/efd42170e3a8446896ec18efc478ccdf.png)

#### 填充矩形

**语法**

```
cxt.fillStyle = "属性值";
cxt.fillRect(x, y, width, height);
```

**fillStyle属性**

fillStyle属性跟strokeStyle属性一样，取值也有3种：颜色值、渐变色和图案。

**fillRect()**

fillRect()方法跟strokeRect()方法一样，用于确定矩形的坐标，其中x和y为矩形左上角的坐标，width表示矩形的宽度，height表示矩形的高度。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.fillStyle = "red";
				context.fillRect(50, 50, 100, 50);
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d47ee6f4d28e4f449de03375367cc864.png)

#### 混合使用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.strokeStyle = "red";
				context.strokeRect(50, 50, 100, 50);
				context.fillStyle = "#ffe8e8";
				context.fillRect(50, 50, 100, 50);
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/41fa8d58abe641e8a941676b32012b8f.png)

#### rect()

**语法**

```
rect(x,y,width,height);
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.strokeStyle = "red";
				context.rect(50, 50, 100, 50);
				context.stroke();
				context.fillStyle = "#ffe8e8";
				context.rect(50, 50, 100, 50);
				context.fill();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/41fa8d58abe641e8a941676b32012b8f.png)

#### 清空矩形区域

**语法**

```
cxt.clearRect(x, y, width, height);
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.fillStyle = "red";
				context.fillRect(50, 50, 100, 50);
				context.clearRect(80, 80, 20, 10);
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/82f0e2ec4d354555902f70985b98d73d.png)

#### 清空画布

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var btn = document.getElementById("btn");
				var context = canvas.getContext("2d");
				context.fillStyle = "red";
				context.fillRect(50, 50, 100, 50);
				btn.onclick = function() {
					context.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
		<br>
		<button id="btn">清空画布</button>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/30c9a7b7b2474d73a090064c0eb5cd89.png)



### 绘制多边形

#### 画箭头

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.moveTo(40, 60);
				context.lineTo(100, 60);
				context.lineTo(100, 30);
				context.lineTo(150, 75);
				context.lineTo(100, 120);
				context.lineTo(100, 90);
				context.lineTo(40, 90);
				context.lineTo(40, 60);
				context.strokeStyle = "red";
				context.stroke();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/81b5f02d82db43ec9a5c4791e9ef7215.png)

#### 画正三角形

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			/**
			 * 画多边形
			 * @param {Object} cxt
			 * @param {Object} n n边形
			 * @param {Object} dx 中心坐标
			 * @param {Object} dy 中心坐标
			 * @param {Object} size 边长度
			 */
			function drawPolygon(cxt, n, dx, dy, size) {
				cxt.beginPath();
				var degree = (2 * Math.PI) / n;
				for (var i = 0; i < n; i++) {
					var x = Math.cos(i * degree);
					var y = Math.sin(i * degree);
					cxt.lineTo(x * size + dx, y * size + dy);
				}
				cxt.closePath();
				cxt.fillStyle = "HotPink";
				cxt.fill();
			}

			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				drawPolygon(context, 3, 100, 75, 50);
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7021d5c4e73547a1843453211d674414.png)



### 绘制圆形

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				context.beginPath();
				context.arc(100, 75, 50, 0, 360 * Math.PI / 180, true);
				context.closePath();
				context.strokeStyle = "HotPink";
				context.stroke();
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="200" height="150" style="border:1px dashed gray;"></canvas>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/545b72db2adf4fb1a2c29692dbd813b9.png)



