# 弹窗

![在这里插入图片描述](https://img-blog.csdnimg.cn/014810446d224bb28f9f8d818809e5c7.gif)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>弹窗</title>
		<style type="text/css">
			.alert {
				display: none;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100vh;
				background: rgba(0, 0, 0, 0.4);
				position: fixed;
				top: 0;
				left: 0;
			}

			.alert-body {
				width: 450px;
				background-color: white;
				border-radius: 10px;
				font-size: 30px;
				color: #000;
				text-align: center;
				animation: moveFromTop 0.3s linear;
			}

			.alert-title {
				line-height: 80px;
				border-bottom: 2px solid #eee;
				font-size: 30px;
				position: relative;
			}

			.close {
				position: absolute;
				top: 22px;
				right: 30px;
				width: 40px;
				height: 40px;
				line-height: 40px;
				cursor: pointer;
				color: grey;
			}

			.close:hover {
				color: black;
			}

			.alert-content {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 150px;
				color: #999;
			}

			@keyframes moveFromTop {
				from {
					margin-top: -600px;
				}

				to {
					margin-top: 0;
				}
			}
		</style>
	</head>
	<body>
		<button id="btn">显示弹窗</button>
		<div class="alert">
			<div class="alert-body">
				<div class="alert-title">标题<div class="close">x</div>
				</div>
				<div class="alert-content">hello world</div>
			</div>
		</div>
		<script type="text/javascript">
			let btn = document.getElementById("btn");
			let alert = document.querySelector(".alert");
			let close = document.querySelector(".close");
			btn.onclick = function() {
				alert.style.display = "flex";
			};
			close.onclick = function() {
				alert.style.display = "none";
			};
			alert.onclick = function(e) {
				if (e.target == alert) {
					alert.style.display = "none";
				}
			};
		</script>
	</body>
</html>
```



