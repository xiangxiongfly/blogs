[TOC]

# JavaScript 事件流

## 概述

JavaScript事件流指一个事件在HTML文档中传播和被处理的全过程。

事件流有三个阶段：

- 捕获阶段（Capturing Phase）：从最外层的祖先元素开始，逐级往下，直到事件触发元素（目标元素）所在的元素。
- 目标阶段（Target Phase）：事件到达目标元素。
- 冒泡阶段（Bubbling Phase）：从目标元素开始往上冒泡，逐级往上，直到最外层的祖先元素。

js中只可以执行捕获或冒泡阶段。

![在这里插入图片描述](https://img-blog.csdnimg.cn/52ae6b3290f6432ba47155c13b3c51d0.png)



## 事件冒泡

### 简介

事件冒泡指当一个元素触发事件时，事件会从触发事件的元素开始，沿着DOM树向上传播，直到根元素。在这个过程中，可以通过 Event 对象的 `stopPropagation()` 方法来阻止事件继续向上传播。

顶层对象不同浏览器有可能不同，如IE9及以上版本、FireFox、Chrome、Safari等浏览器，事件冒泡的顶层对象为window对象，而IE7/8顶层对象则为document对象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ab1998f1bc94d649d9a8fae6e5f1a60.png)

说明：当用户点击了`<div>`元素，这时click事件将按照`<div> -> <body> -> <html> -> document -> window`的顺序进行传播。

可以把事件冒泡比喻为水中的气泡，从水底冒出水面，也就是从下向上开始传播。

### onclick() 事件冒泡

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			div {
				padding: 30px;
			}

			#div1 {
				background: red;
			}

			#div2 {
				background: green;
			}

			#div3 {
				background: blue;
			}
		</style>
		<script>
			window.onload = function() {
				//获取各个元素
				var oBody = document.getElementById('body1');
				var oDiv1 = document.getElementById('div1');
				var oDiv2 = document.getElementById('div2');
				var oDiv3 = document.getElementById('div3');
				//对各个元素的单击事件绑定事件处理函数fn1
				window.onclick = fn1;
				document.onclick = fn1;
				oBody.onclick = fn1;
				oDiv1.onclick = fn1;
				oDiv2.onclick = fn1;
				oDiv3.onclick = fn1

				function fn1() { //定义事件处理函数
					console.log(this);
				}
			};
		</script>
	</head>
	<body id="body1">
		<div id="div1">
			<div id="div2">
				<div id="div3"></div>
			</div>
		</div>
	</body>
</html>
```

点击div3元素，打印信息如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/673dc42202cc400da367c43b414fbd12.png)

说明：onclick单击事件会实现事件冒泡，因此div3元素会首先触发单击事件，所触发的事件仍然会逐级向上传递。

### addEventListener() 事件冒泡

`addEventListener()`方法的第三个参数为false事，为事件冒泡；为true时，为事件捕获。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			div {
				padding: 30px;
			}

			#div1 {
				background: red;
			}

			#div2 {
				background: green;
			}

			#div3 {
				background: blue;
			}
		</style>
		<script>
			window.onload = function() {
				var oDiv1 = document.getElementById('div1');
				var oDiv2 = document.getElementById('div2');
				var oDiv3 = document.getElementById('div3');
				//调用addEventListener()实现事件冒泡
				oDiv1.addEventListener('click', fn1, false);
				oDiv2.addEventListener('click', fn1, false);
				oDiv3.addEventListener('click', fn1, false);

				function fn1() {
					console.log(this);
				}
			};
		</script>
	</head>
	<body id="body1">
		<div id="div1">
			<div id="div2">
				<div id="div3"></div>
			</div>
		</div>
	</body>
</html>
```

点击div3元素，打印信息如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/611fc4f593e946e0a58090dee1a525c4.png)

说明：div1、div2和div3元素均使用第三个参数为false的addEventListener()绑定事件函数，因而这3个元素将实现事件冒泡。在Chrome浏览器中运行后，当单击div3时，div3作为事件冒泡的最低层元素，会首先触发单击事件，然后div3逐级向上传递单击事件给div2和div1。

### stopPropagation() 阻止事件冒泡

在 HTML DOM 中，事件会向上冒泡到父元素，如果不希望事件继续向上传播，则可以使用 Event 对象的 stopPropagation() 方法来阻止事件冒泡。

例如：

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			#div1 {
				width: 150px;
				height: 150px;
				line-height: 150px;
				text-align: center;
				border: 1px solid silver;
				margin: auto;
				display: none;
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oDiv = document.getElementById("div1");
				oBtn.onclick = function(event) {
					event.stopPropagation(); //阻止事件冒泡
					oDiv.style.display = "block";
				};
				document.onclick = function(e) {
					oDiv.style.display = "none";
				};
			};
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="弹出">
		<div id="div1">
			hello world
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f31704bb9446429185f3519d895c6e8c.gif)

## 事件捕获

### 简介

事件捕获指挡一个元素触发事件时，该事件会从根元素开始，沿着DOM树向下传播，直到传播到触发事件的元素。在这个过程中，可以通过 Event 对象的 stopPropagation() 方法来阻止事件继续向上传播。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a8718564b2e74ebbb0c42f21b7c60005.png)

说明：当点击了`<div>`元素，采用事件捕获，则click事件将按照`window -> document -> <html> -> <body> -> <div>`的顺序传播。

### addEventListener() 事件捕获

使用addEventListener()绑定事件函数时，当第三个参数取值为true时，将执行事件捕获，除此之外的其他事件的绑定方式，都是执行事件冒泡。

因此，只有标准浏览器才能进行事件捕获。

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				padding: 40px;
			}

			#div1 {
				background: red;
			}

			#div2 {
				background: green;
			}

			#div3 {
				background: blue;
			}
		</style>
		<script>
			window.onload = function() {
				var oDiv1 = document.getElementById('div1');
				var oDiv2 = document.getElementById('div2');
				var oDiv3 = document.getElementById('div3');
				//事件捕获
				oDiv1.addEventListener('click', fn1, true);
				oDiv2.addEventListener('click', fn1, true);
				oDiv3.addEventListener('click', fn1, true);
				window.addEventListener('click', fn1, true);
				document.addEventListener('click', fn1, true);
				//定义事件函数
				function fn1() {
					console.log(this);
				}
			};
		</script>
	</head>
	<body>
		<div id="div1">
			<div id="div2">
				<div id="div3"></div>
			</div>
		</div>
	</body>
</html>

```

点击div3元素，打印信息如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/160ebc38c9a14a55b9d32c16d3a6265b.png)



## 阻止事件默认行为

在 HTML DOM 中，某些事件具有默认行为，例如链接的点击会跳转到链接的地址。不希望事件触发默认行为，可以使用一下两种方式阻止：

*   在事件处理函数中 `return false` 阻止默认行为。
*   使用 Event 对象的 `preventDefault()` 方法来阻止默认行为。

### 处理函数return false

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>取消使用对象属性绑定的事件的默认行为</title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById('btn');
				oBtn.onclick = function() {
					var name = document.getElementById("username");
					if (name.value.length == 0) {
						alert("请输入姓名");
						return false; //用户名没有输入时，阻止表单提交
					}
				};
			};
		</script>
	</head>
	<body>
		<form action="new_file.html">
			姓名: <input type="text" name="username" id="username" />
			<input type="submit" value="提交" id='btn' />
		</form>
	</body>
</html>
```

### 使用preventDefault()方法

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>取消使用addEventListener()绑定的事件的默认行为</title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById('btn');
				oBtn.addEventListener('click', function(ev) {
					var ev = ev || event;
					var name = document.getElementById("username");
					if (name.value.length == 0) {
						alert("请输入姓名");
						if (ev.preventDefault) { //用户名没有输入时，阻止表单提交
							ev.preventDefault();
						}
					}
				}, false);
			};
		</script>
	</head>
	<body>
		<form action="new_file.html">
			姓名: <input type="text" name="username" id="username" />
			<input type="submit" value="提交" id='btn' />
		</form>
	</body>
</html>
```

## 案例

### 分享功能

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f9ba067b530411388269d3eb23c8309.gif)

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>使用事件冒泡实现"分享"功能</title>
		<style>
			#div1 {
				width: 80px;
				height: 150px;
				border: black 1px solid;
				position: absolute;
				left: -82px;
				top: 100px;
			}

			#div2 {
				width: 30px;
				height: 70px;
				position: absolute;
				right: -30px;
				top: 45px;
				background: black;
				color: white;
				text-align: center;
			}

			ul {
				list-style: none;
				padding: 0 20px;
			}

			img {
				width: 36px;
				height: 39px;
			}
		</style>
	</head>
	<body>
		<div id="div1">
			<ul>
				<a href="#">
					<li><img src="img/apple_pic.png" /></li>
				</a>
				<a href="#">
					<li><img src="img/banana_pic.png" /></li>
				</a>
				<a href="#">
					<li><img src="img/cherry_pic.png" /></li>
				</a>
			</ul>
			<div id="div2">分享到</div>
		</div>
		<script>
			var oDiv = document.getElementById('div1');
			oDiv.onmouseover = function() { //鼠标光标移入，使div1显示
				this.style.left = '0px';
			}
			oDiv.onmouseout = function() { //鼠标光标移出，使div1隐藏
				this.style.left = '-82px';
			}
		</script>
	</body>
</html>
```

### 事件委托

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>事件冒泡</title>
  </head>
  <body>
    <ul id="list">
      <li>西游记</li>
      <li>水浒传</li>
      <li>三国演义</li>
      <li>红楼梦</li>
    </ul>
    <script>
      let list = document.getElementById("list");
      list.addEventListener("click", (e) => {
        let el = e.target;
        if (el.nodeName.toLowerCase() === "li") {
          alert(el.innerText);
        }
      });
    </script>
  </body>
</html>
```

