## 折叠效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>折叠效果</title>
		<style type="text/css">
			.collapse-box {
				width: 500px;
				border: 1px solid silver;
				border-radius: 4px;
				margin: auto;
			}

			.collapse-title {
				height: 60px;
				line-height: 60px;
				font-size: 30px;
				text-align: center;
				color: black;
				background-color: #DDD;
				cursor: pointer;
			}

			.collapse-content {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30px;
				color: #666;
				height: 0;
				overflow: hidden;
				transition: all 0.3s;
			}

			.collapse-content.show {
				height: 200px
			}
		</style>
	</head>
	<body>
		<div class="collapse-box">
			<div class="collapse-title">折叠标题</div>
			<div class="collapse-content">折叠内容&nbsp;&nbsp;折叠内容&nbsp;&nbsp;折叠内容</div>
		</div>
		<script type="text/javascript">
			let title = document.querySelector(".collapse-title");
			let content = document.querySelector(".collapse-content");
			title.onclick = function() {
				let res = content.getAttribute("class").indexOf("show");
				if (res == -1) {
					content.classList.add("show");
				} else {
					content.classList.remove("show");
				}
			};
		</script>
	</body>
</html>
```

