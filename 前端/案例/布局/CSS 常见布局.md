[toc]

# CSS 常见布局

## 单列布局

### 单列布局（不通栏）

实现方式：

- 通过对header、content、footer统一设置宽度。
- 再设置margin: 0 auto实现居中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/94b4055f42ea4b2ca5047ce0db0ebace.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>单列布局（不通栏）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.header {
				margin: 0 auto;
				max-width: 960px;
				height: 100px;
				background-color: orangered;
			}

			.content {
				margin: 0 auto;
				max-width: 960px;
				height: 400px;
				background-color: seagreen;
			}

			.footer {
				margin: 0 auto;
				max-width: 960px;
				height: 100px;
				background-color: slateblue;
			}
		</style>
	</head>
	<body>
		<div class="header"></div>
		<div class="content"></div>
		<div class="footer"></div>
	</body>
</html>
```

### 单列布局（通栏）

实现方式：

- header、footer宽度不设置，块元素会充满屏幕。
- content设置width，并通过margin: auto实现居中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/da91fdc223d242afb12ee0c556c9d542.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>单列布局（通栏）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.header {
				margin: 0 auto;
				height: 100px;
				background-color: orangered;
				overflow: hidden;
			}

			.nav {
				margin: 10px auto 0;
				max-width: 800px;
				background-color: darkgray;
				height: 50px;
			}

			.content {
				margin: 0 auto;
				max-width: 960px;
				height: 400px;
				background-color: seagreen;
			}

			.footer {
				margin: 0 auto;
				height: 100px;
				background-color: slateblue;
			}
		</style>
	</head>
	<body>
		<div class="header">
			<div class="nav"></div>
		</div>
		<div class="content"></div>
		<div class="footer"></div>
	</body>
</html>
```



## 双列布局

双列布局，一列固定宽度，另一列填充用剩余空间。

### float+overflow:hidden

实现方式：

- 如果是普通的两列布局，通过浮动+普通元素的margin可以实现。
- 如果是自适应的两列布局，通过float+overflow:hidden可以实现，这种办法主要通过overflow触发BFC，而BFC不会重叠浮动元素。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b2f84d14e554686a3d96fde0d7b215c.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>双列布局（float+overflow:hidden）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				height: 500px;
				background-color: palevioletred;
				overflow: hidden;
				zoom: 1;
			}

			.left {
				width: 200px;
				height: 100%;
				background-color: lightgreen;
				float: left;
				margin-right: 20px;
			}

			.right {
				height: 100%;
				background-color: lightblue;
				overflow: hidden;
				zoom: 1;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	</body>
</html>
```

### flex

实现方式：通过flex弹性盒子布局实现。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b2f84d14e554686a3d96fde0d7b215c.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>双列布局（flex）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				height: 500px;
				background-color: palevioletred;
				display: flex;
			}

			.left {
				width: 200px;
				height: 100%;
				background-color: lightgreen;
				margin-right: 20px;
			}

			.right {
				height: 100%;
				background-color: lightblue;
				flex: 1;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	</body>
</html>
```

### grid

实现方式：通过grid布局实现。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b2f84d14e554686a3d96fde0d7b215c.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>双列布局（grid）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				height: 500px;
				background-color: palevioletred;
				display: grid;
				grid-template-columns: auto 1fr;
				grid-gap: 20px;
			}

			.left {
				width: 200px;
				background-color: lightgreen;
			}

			.right {
				background-color: lightblue;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	</body>
</html>
```



## 三列布局

### 三列布局（圣杯布局）

实现方式：

- 通过float: left进行排列。
- 再通过margin-left和postion: relatvie进行位置调整。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ceb627f4d3a440529b2519ec20a3c77d.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>三列布局（圣杯布局）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				min-width: 600px;
				padding-left: 220px;
				padding-right: 220px;
			}

			.left {
				float: left;
				width: 200px;
				height: 400px;
				background-color: indianred;
				margin-left: -100%;
				position: relative;
				left: -220px;
			}

			.center {
				float: left;
				width: 100%;
				height: 500px;
				background-color: greenyellow;
			}

			.right {
				float: left;
				width: 200px;
				height: 400px;
				background-color: skyblue;
				margin-left: -200px;
				position: relative;
				right: -220px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="center">center</div>
			<div class="left">left</div>
			<div class="right">right</div>
		</div>
	</body>
</html>
```

### 三列布局（双飞翼布局）

在圣杯布局的基础上进一步优化。

实现方式：

- 通过float: left进行排列。
- 再通过margin: left调整位置。

![在这里插入图片描述](https://img-blog.csdnimg.cn/558daaf7815f48499585313d155389a1.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>三列布局（双飞翼布局）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				min-width: 600px;
			}

			.left {
				float: left;
				width: 200px;
				height: 400px;
				background-color: indianred;
				margin-left: -100%;
			}

			.center {
				float: left;
				width: 100%;
				height: 500px;
				background-color: greenyellow;
			}

			.center .inner {
				margin: 0 200px;
			}

			.right {
				float: left;
				width: 200px;
				height: 400px;
				background-color: skyblue;
				margin-left: -200px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="center">
				<div class="inner">center</div>
			</div>
			<div class="left">left</div>
			<div class="right">right</div>
		</div>
	</body>
</html>
```



## 等高布局

### 等高布局（正padding+负margin）

实现方式：

- 通过padding-bottom和margin-bottom实现等高。
- 再通过overflow: hidden把溢出剪切掉。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ef13b987541c417a94788add455a8835.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>等高布局（正padding+负margin）</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				min-width: 600px;
				height: 600px;
				padding-left: 220px;
				padding-right: 220px;
				overflow: hidden;
			}

			.left {
				float: left;
				width: 200px;
				background-color: indianred;
				margin-left: -100%;
				position: relative;
				left: -220px;
			}

			.center {
				float: left;
				width: 100%;
				background-color: greenyellow;
			}

			.right {
				float: left;
				width: 200px;
				background-color: skyblue;
				margin-left: -200px;
				position: relative;
				right: -220px;
			}

			.center,
			.left,
			.right {
				padding-bottom: 10000px;
				margin-bottom: -10000px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="center">center</div>
			<div class="left">left</div>
			<div class="right">right</div>
		</div>
	</body>
</html>
```

### 仿表格布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/b48e57f10b4e4ec7a4abe3fd8678cbea.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>仿表格布局</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.table {
				width: auto;
				min-width: 1000px;
				margin: 0 auto;
				display: table;
			}

			.tableRow {
				display: table-row;
			}

			.tableCell {
				display: table-cell;
				width: 33%;
				height: 500px;
			}

			.cell1 {
				background-color: orangered;
			}

			.cell2 {
				background-color: palegreen;
			}

			.cell3 {
				background-color: steelblue;
			}
		</style>
	</head>
	<body>
		<div class="table">
			<div class="tableRow">
				<div class="tableCell cell1">left</div>
				<div class="tableCell cell2">center</div>
				<div class="tableCell cell3">right</div>
			</div>
		</div>
	</body>
</html>
```



## 粘连布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/cd0458b321c845edb482748f25e75490.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>粘连布局</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			html,
			body {
				height: 100%;
			}

			.content {
				min-height: 100%;
				background-color: lightgrey;
				text-align: center;
				overflow: hidden;
			}

			.content .main {
				padding-bottom: 50px;
			}

			.footer {
				height: 50px;
				line-height: 50px;
				background-color: aliceblue;
				text-align: center;
				margin-top: -50px;
			}
		</style>
	</head>
	<body>
		<div class="content">
			<div class="main">main</div>
		</div>
		<div class="footer">footer</div>
	</body>
</html>
```



## [代码下载](https://github.com/xiangxiongfly/MyHtmlCssJs/tree/main/%E5%B8%83%E5%B1%80)

