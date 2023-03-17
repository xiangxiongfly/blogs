## 搜索框

![在这里插入图片描述](https://img-blog.csdnimg.cn/864b2fc7aa5f4f3fb631ffa33e96c03a.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>搜索框</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.search-container {
				margin: 50px;
				display: flex;
				width: 500px;
				height: 50px;
				line-height: 50px;
			}

			.search-container input {
				box-sizing: border-box;
				flex: 1;
				height: 50px;
				line-height: 50px;
				outline: none;
				border: none;
				border-top-left-radius: 25px;
				border-bottom-left-radius: 25px;
				padding: 0 20px;
				background-color: #f8f8ff;
				border-top: 1px solid silver;
				border-left: 1px solid silver;
				border-bottom: 1px solid silver;
			}

			.search-container button {
				box-sizing: border-box;
				height: 50px;
				line-height: 50px;
				padding: 0 30px;
				border: none;
				background-color: pink;
				font-size: 24px;
				color: #fff;
				cursor: pointer;
				border-top-right-radius: 25px;
				border-bottom-right-radius: 25px;
				border-top: 1px solid silver;
				border-right: 1px solid silver;
				border-bottom: 1px solid silver;
			}
		</style>
	</head>
	<body>
		<div class="search-container">
			<input type="text" placeholder="请输入">
			<button>搜索</button>
		</div>
	</body>
</html>
```



