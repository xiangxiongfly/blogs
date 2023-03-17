[toc]

# JavaScript 事件流

## 概述

事件流描述的是从页面中接受事件的顺序。IE和Netscape开发团队提出了两个截然相反的事件流概念，IE的事件流是事件冒泡（event bubbling），Netscape的事件流是事件捕获（event capturing）。



## 事件冒泡

### 简介

事件冒泡：当一个元素接收到事件时，会把它接收到的事件逐级向上传播给它的祖先元素，一直传到顶层的window对象。

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
				oBtn.onclick = function(e) {
					e.stopPropagation(); //阻止事件冒泡
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

事件捕获是由Netscape Communicator团队提出来的，从最顶层的window对象开始逐渐往下传播事件，即最顶层的window对象最早接收事件，最低层的具体被操作的元素最后接收事件。

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



### W3C标准事件流

W3C标准事件流包含3个阶段，捕获阶段、目标阶段、冒泡阶段。

在捕获阶段，事件对象通过目标的祖先从窗口传播到目标的父级。

在目标阶段，事件对象到达事件对象的事件目标。

在冒泡阶段，事件对象以相反的顺序通过目标的祖先传播，从目标的父级开始，到窗口结束。

W3C事件模型中发生的任何事件，先从顶层对象window开始一路向下捕获，直到达到目标元素，其后进入目标阶段。目标元素div接收到事件后开始冒泡到顶层对象window。例如，当用户单击了`<div>`元素，则首先会进行事件捕获，此时事件按`window→document→<html>→<body>`的顺序进行传播，当事件对象传到`<div>`时进入目标阶段，接着事件对象又从目标对象传到`body`，从而进入事件的冒泡阶段，此时事件对象按`<body>→<html>→document→window`的顺序传播事件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/52ae6b3290f6432ba47155c13b3c51d0.png)

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
				//标准事件流处理事件
				oDiv1.addEventListener('click', function() {
					console.log('事件冒泡1');
				}, false);
				oDiv1.addEventListener('click', function() {
					console.log('事件捕获1');
				}, true);
				oDiv2.addEventListener('click', function() {
					console.log('事件冒泡2');
				}, false);
				oDiv2.addEventListener('click', function() {
					console.log('事件捕获2');
				}, true);
				oDiv3.addEventListener('click', function() {
					console.log('事件捕获3');
				}, true);
				oDiv3.addEventListener('click', function() {
					console.log('事件冒泡3');
				}, false);
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/a3259c3df74342938dcca717723f84cc.png)





## 取消事件默认行为

事件的默认行为指的是：当一个事件发生时，浏览器自己会默认做的事情。这些事件的默认行为，在某些情况下，可能并不是我们所期望的，此时就需要取消它。事件默认行为的取消方法跟事件的绑定方式有关。

一、使用对象的事件属性绑定事件（即使用“obj.on事件名称=事件处理函数”的绑定格式）的事件默认行为的取消方法是：在当前事件的处理函数中`return false`即可阻止当前事件的默认行为。

二、使用addEventListenter()绑定事件函数的事件默认行为的取消方法是：在当前事件的处理函数中使用`event.preventDefault()`即可阻止当前事件的默认行为。

### 取消使用对象属性绑定的事件的默认行为

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



### 取消使用addEventListener()绑定的事件的默认行为

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

### 利用事件冒泡实现分享功能

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
		<script>
			window.onload = function() {
				var oDiv = document.getElementById('div1');
				oDiv.onmouseover = function() { //鼠标光标移入，使div1显示
					this.style.left = '0px';
				}
				oDiv.onmouseout = function() { //鼠标光标移出，使div1隐藏
					this.style.left = '-82px';
				}
			};
		</script>
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
	</body>
</html>
```

![a](https://img-blog.csdnimg.cn/1a15ff8bb1de466c96edaf9e34510053.png) ![b](https://img-blog.csdnimg.cn/dd8c9310b32a462280a5b470d40286e7.png)







