[toc]

# JavaScript client screen offset scroll

## offsetWidth & clientWidth & scrollWidth

| 属性/方法   | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| offsetWidth | 获取元素的整体宽度，包含元素宽度、内边距、边框、滚动条，但不包含外边距。 |
| clientWidth | 获取元素的可视区域的宽度，包含元素宽度、内边距，但不包含滚动条、边框、外边距。<br />因此，clientWidth的值小于等于offsetWidth的值。 |
| scrollWidth | 获取元素的内容宽度，包括因为溢出而没有显示出来的部分。<br />如果元素的内容没有溢出，则scrollWidth等于clientWidth；如果元素溢出，则scrollWidth大于clientWidth。 |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			#box {
				width: 100px;
				height: 100px;
				padding: 10px;
				border: 1px solid red;
			}
		</style>
	</head>
	<body>
		<div id="box"></div>
		<script>
			let box = document.getElementById("box");
			console.log(box.offsetWidth); //122，元素宽度+内边距+边框
			console.log(box.clientWidth); //120，元素宽度+内边距
		</script>
	</body>
</html>
```

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			#box {
				width: 100px;
				height: 100px;
			}

			p {
				width: 300px;
				height: 50px;
			}
		</style>
	</head>
	<body>
		<div id="box">
			<p></p>
		</div>
		<script>
			let box = document.getElementById("box");
			console.log(box.clientWidth); //100px，内容宽度
			console.log(box.scrollWidth); //300px，实际内容宽度，包括溢出的部分
		</script>
	</body>
</html>
```



## screenX & clientX & pageX & offsetX

这些都是JavaScript事件对象的属性，包含有关鼠标或指针事件的信息。

| 属性/方法 | 说明                                                  |
| --------- | ----------------------------------------------------- |
| screenX   | 获取鼠标相对于屏幕的X轴坐标。                         |
| clientX   | 获取鼠标相对于视口（即浏览器窗口）的X轴坐标。         |
| pageX     | 获取鼠标相对于整个文档（包含文档的滚动条）的X轴坐标。 |
| offsetX   | 获取鼠标相对于目标元素（即触发事件的元素）的X轴坐标。 |
![在这里插入图片描述](https://img-blog.csdnimg.cn/2857f637ef624df1a3de31515232a658.png)

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}

			.box {
				width: 200px;
				height: 200px;
				border: 50px solid silver;
			}
		</style>
		<script>
			window.onload = function() {
				var box = document.querySelector(".box");
				box.onclick = function(e) {
					box.innerHTML = `
					e.clientX: ${e.clientX} <br>
					e.clientY: ${e.clientY} <br>
					e.offsetX: ${e.offsetX} <br>
					e.offsetY: ${e.offsetY} <br>
					e.screenX: ${e.screenX} <br>
					e.screenY: ${e.screenY}
					`;
				}
			}
		</script>
	</head>
	<body>
		<div class="box"></div>
	</body>
</html>
```

点击边框左上角：

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e55a54995974e6b94642b68f576be57.png)

点击边框右下角：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9c04a11d103e4f8e9d8c5e66e3f52153.png)



## window.outerWidth & window.innerWidth & document.documentElement.clientWidth

| 属性/方法                            | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| window.outerWidth                    | 获取整个浏览器窗口的高度（单位：像素），包括侧边栏（如果存在）、窗口镶边（window chrome）和窗口调正边框（window resizing borders/handles）。 |
| window.innerWidth                    | 获取浏览器视口，包含滚动条                                   |
| document.documentElement.clientWidth | 获取内容区域，不包含滚动条                                   |

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}

			body {
				width: 2000px;
				height: 2000px;
			}
		</style>
		<script>
			window.onload = function() {
				var body = document.querySelector("body");
				body.innerHTML = `
				window.outerWidth: ${window.outerWidth} <br>
				window.outerHeight: ${window.outerHeight} <br>
				window.innerWidth: ${window.innerWidth} <br>
				window.innerHeight: ${window.innerHeight} <br>					
				document.documentElement.clientWidth: ${document.documentElement.clientWidth} <br>
				document.documentElement.clientHeight: ${document.documentElement.clientHeight} <br>
					`;
			}
		</script>
	</head>
	<body>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4c91a6a5ffed4a8988b2bcf3c0de93b8.png)



