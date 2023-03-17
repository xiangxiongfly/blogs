# CSS3 calc()函数

## 概述

在CSS3中，我们可以使用calc()函数通过“计算”的方式来定义某一个属性的取值。



## 使用

**语法**

```
属性: calc(表达式);
```

**说明**

可以使用calc()函数计算元素的width、margin、padding、font-size等。

对于calc()函数，有以下5条运算规则：

- 只能使用加（+）、减（-）、乘（*）和除（/）这4种运算。
- 可以使用px、em、rem、百分比等单位。
- 可以混合使用各种单位进行运算。
- 表达式中有加号（+）和减号（-）时，其前后必须有空格。
- 表达式中有乘号（*）和除号（/）时，其前后可以没有空格，但建议保留。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.box {
				width: 200px;
				height: 60px;
				border: 1px solid black;
			}

			.box-left {
				float: left;
				width: calc((100% - 1px) / 2);
				height: 100%;
				border-right: 1px solid black;
				background-color: lightskyblue;
			}

			.box-right {
				float: right;
				width: calc((100% - 1px) / 2);
				height: 100%;
				background-color: hotpink;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="box-left"></div>
			<div class="box-right"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/13f0ae0db91b450391816fc1d1b28bcf.png)



## 三列平分布局

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

			.col-3 {
				float: left;
				width: calc(100% / 3 - 5px);
				margin-right: calc(5px * 3 / 2);
				margin-bottom: calc(5px * 3 / 2);
				height: 60px;
				line-height: 60px;
				text-align: center;
				font-size: 24px;
				background: #EEEEEE;
				color: #333333;
			}

			.col-3:nth-child(3) {
				margin-right: 0;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="col-3">1</div>
			<div class="col-3">2</div>
			<div class="col-3">3</div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b5c74f2e9df404ca5a8face49d6278c.png)



