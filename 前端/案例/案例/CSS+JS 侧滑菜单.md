## CSS+JS 侧滑菜单

![在这里插入图片描述](https://img-blog.csdnimg.cn/26fba0629e0e4c22a0ff080854a49d15.gif)

```javascript
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>侧滑菜单</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			.container {
				height: 100vh;
				display: flex;
				font-size: 18px;
			}

			.menu {
				width: 0;
				height: 100vh;
				background-color: #666;
				padding-top: 50px;
				transition: all 0.3s;
			}

			.menu.show {
				width: 250px;
			}

			.menu a {
				display: block;
				color: #fff;
				line-height: 60px;
				text-align: center;
				text-decoration: none;
			}

			.main {
				flex: 1;
			}

			.header {
				display: flex;
				align-items: center;
				height: 100px;
				background-color: #eee;
			}

			.btn {
				width: 40px;
				height: 40px;
				position: relative;
				margin-left: 30px;
			}

			.btn i {
				width: 40px;
				height: 2px;
				background-color: #666;
				position: absolute;
				left: 0;
				transition: all 0.3s;
			}

			.btn i:nth-child(1) {
				top: 0;
			}

			.btn i:nth-child(2) {
				top: 19px;
			}

			.btn i:nth-child(3) {
				bottom: 0;
			}

			.btn.close i:nth-child(1) {
				width: 55px;
				transform: rotate(45deg);
				transform-origin: left top;
			}

			.btn.close i:nth-child(2) {
				opacity: 0;
			}

			.btn.close i:nth-child(3) {
				width: 55px;
				transform: rotate(-45deg);
				transform-origin: left bottom;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="menu show">
				<a href="">首页</a>
				<a href="">产品中心</a>
				<a href="">关于我们</a>
			</div>
			<div class="main">
				<div class="header">
					<div class="btn close">
						<i></i>
						<i></i>
						<i></i>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript">
			let btn = document.querySelector(".btn");
			let menu = document.querySelector(".menu");
			btn.onclick = function() {
				this.classList.toggle("close");
				menu.classList.toggle("show");
			}
		</script>
	</body>
</html>
```



