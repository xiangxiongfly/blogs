## CSS 排行榜

![在这里插入图片描述](https://img-blog.csdnimg.cn/69cb593169ee47aa9e2c909812a23e2b.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>排行榜</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}

			/* 容器 */
			.rank-container {
				width: 400px;
				color: #333;
				font-size: 14px;
				background-color: #fff;
				border-radius: 5px;
				border: 1px solid silver;
				margin: 100px auto;
			}

			/* 标题 */
			.rank-title {
				font-size: 30px;
				padding: 30px 20px;
			}

			/* 内容主体 */
			.rank-body {
				padding: 0 30px 20px;
			}

			/* 每项样式 */
			.item {
				display: flex;
				align-items: center;
				margin-bottom: 20px;
			}

			/* 数字 */
			.item .num {
				font-size: 20px;
				margin-right: 20px;
			}

			/* 作者 */
			.item .author {
				display: flex;
				align-items: center;
				flex: 1;
			}

			/* 头像 */
			.item .avatar {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 46px;
				height: 46px;
				margin-right: 10px;
				position: relative;
			}

			.item .avatar img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			.item .avatar .img-bg {
				width: 46px;
				height: 54px;
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 1;
			}

			/* 能力值 */
			.item .rank-ability {
				color: #999;
			}

			.item:nth-child(1) .num {
				color: #de5149;
			}

			.item:nth-child(2) .num {
				color: #ef8634;
			}

			.item:nth-child(3) .num {
				color: #f6cb46;
			}
		</style>
	</head>
	<body>
		<div class="rank-container">
			<div class="rank-title">创作者排行</div>
			<div class="rank-body">
				<div class="item">
					<div class="num">1</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/1.png" class="img-bg">
							<img src="../img/user1.jpg">
						</dt>
						<dd>游山记</dd>
					</dl>
					<div class="rank-ability">100万能力值</div>
				</div>
				<div class="item">
					<div class="num">2</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/2.png" class="img-bg">
							<img src="../img/user2.jpg">
						</dt>
						<dd>hello world</dd>
					</dl>
					<div class="rank-ability">100万能力值</div>
				</div>
				<div class="item">
					<div class="num">3</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/3.png" class="img-bg">
							<img src="../img/user3.jpg">
						</dt>
						<dd>hello CSS</dd>
					</dl>
					<div class="rank-ability">90万能力值</div>
				</div>
				<div class="item">
					<div class="num">4</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/user4.jpg" class="img_bg">
						</dt>
						<dd>hello JavaScript</dd>
					</dl>
					<div class="rank-ability">80万能力值</div>
				</div>
				<div class="item">
					<div class="num">5</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/user5.jpg" class="img_bg">
						</dt>
						<dd>hello 前端</dd>
					</dl>
					<div class="rank-ability">70万能力值</div>
				</div>
				<div class="item">
					<div class="num">6</div>
					<dl class="author">
						<dt class="avatar">
							<img src="../img/user6.jpg" class="img_bg">
						</dt>
						<dd>贝尔加湖 </dd>
					</dl>
					<div class="rank-ability">60万能力值</div>
				</div>
			</div>
		</div>
	</body>
</html>
```



