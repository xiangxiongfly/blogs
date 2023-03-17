# CSS 图文左右布局

- 方式一：使用float。
- 方式二：使用flex。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>float、flex实现图文左右布局</title>
		<style type="text/css">
			dl,
			dt,
			dd,
			flex {
				margin: 0;
				padding: 0;
			}

			.title {
				line-height: 50px;
				font-size: 30px;
				font-weight: bold;
				text-align: center;
				background: #eee;
			}

			.part1,
			.part2 {
				width: 350px;
				margin-top: 10px;
				border: 1px solid silver;
				overflow: hidden;
			}

			.item {
				margin-top: 20px;
				padding-left: 20px;
				padding-bottom: 20px;
			}

			.item img {
				margin-right: 20px;
			}

			.part1 .item img {
				float: left;
				margin-bottom: 20px;
			}

			.part2 .item {
				display: flex;
			}
		</style>
	</head>
	<body>
		<div class="part1">
			<div class="title">float左右布局</div>
			<div class="item">
				<img width="150" src="../img/0.jpg" alt="">
				<dl>
					<dt>hello world</dt>
					<dd>这是一些内容</dd>
				</dl>
			</div>
		</div>
		<div class="part2">
			<div class="title">flex左右布局</div>
			<div class="item">
				<img width="150" src="../img/0.jpg" alt="">
				<dl>
					<dt>hello world</dt>
					<dd>这是一些内容</dd>
				</dl>
			</div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/802292218e124cdab6048e5ddeacd658.png)

