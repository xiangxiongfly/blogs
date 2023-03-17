[TOC]

## CSS+JS 折叠效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/a922cce1766e4ff2bf8d34557d1081d4.gif)

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
				// let res = content.getAttribute("class").indexOf("show");
				// if (res == -1) {
				// 	content.classList.add("show");
				// } else {
				// 	content.classList.remove("show");
				// }

				//可简化为：
				content.classList.toggle("show");
			};
		</script>
	</body>
</html>
```



## CSS+jQuery 鼠标经过显示详细信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9b193b3c4a14264b9b57ceec5b8698e.gif)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			h3 {
				height: 40px;
				line-height: 40px;
				text-align: center;
				background-color: #ddd;
				cursor: pointer;
			}

			div {
				display: none;
				padding: 10px;
				border: 1px solid silver;
				text-indent: 32px;
			}
		</style>
		<script src="../js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("h3").hover(function() {
					$("div").css("display", "block");
				}, function() {
					$("div").css("display", "none");
				});
			})
		</script>
	</head>
	<body>
		<h3>hello world</h3>
		<div>
			这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。
		</div>
	</body>
</html>
```



