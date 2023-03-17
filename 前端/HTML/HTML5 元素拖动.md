[TOC]

# HTML5 元素拖放

## 概述

在HTML5中，我们只需要给元素添加一个draggable属性，然后设置该属性值为true，就能实现元素的拖放。

拖放，指的是“拖曳”和“释放”。在页面中进行一次拖放操作，我们必须先弄清楚两个元素：“源元素”和“目标元素”。“源元素”指的是被拖曳的那个元素，“目标元素”指的是源元素最终被释放到的那个元素。



## 触发事件

**源元素触发的事件**

| 事件        | 说明       |
| ----------- | ---------- |
| ondragstart | 开始拖放   |
| ondrag      | 拖放过程中 |
| ondragend   | 结束拖放   |

**目标元素触发的事件**

| 事件        | 说明                                 |
| ----------- | ------------------------------------ |
| ondragenter | 当被拖放的元素进入本元素时           |
| ondragover  | 当被拖放的元素正在本元素范围内移动时 |
| ondragleave | 当贝拖放的元素离开本元素时           |
| ondrop      | 当源元素释放到本元素时               |



### 实现元素拖放功能

**说明**

e.offsetX、e.offsetY分别表示鼠标相对于触发事件的对象的X坐标、Y坐标。

e.pageX、e.pageY分别表示鼠标相对于当前窗口的X坐标、Y坐标。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}

			body {
				position: relative;
			}

			#img {
				position: absolute;
			}
		</style>
		<script>
			window.onload = function() {
				var img = document.getElementById("img");
				var offsetX, offsetY;
				//拖动开始时，记录鼠标在图片上的偏移值
				img.ondragstart = function(e) {
					offsetX = e.offsetX;
					offsetY = e.offsetY;
				}
				//拖动时，获取鼠标在页面的坐标值
				img.ondrag = function(e) {
					if (e.pageX == 0 && e.pageY == 0) {
						return;
					}
					img.style.left = (e.pageX - offsetX) + "px";
					img.style.top = (e.pageY - offsetY) + "px";
				}
			}
		</script>
	</head>
	<body>
		<img id="img" src="img/apple_pic.png" draggable="true">
	</body>
</html>
```



## dataTransfer

在HTML5中，如果想要在元素拖放中实现数据传递，我们需要使用dataTransfer对象。dataTransfer对象主要用于在“源元素”与“目标元素”之间传递数据。

dataTransfer对象有两个最重要的方法：setData()和getData()。在整个拖曳过程中，具体操作是这样的：开始拖放源元素时（ondragstart事件），调用setData()方法保存数据；然后在放入目标元素时（ondrop事件），调用getData()方法读取数据。

**setData()方法**

可以使用setData()方法。

```
setData(format, data);
```

**format格式**

| 数据格式      | 说明         |
| ------------- | ------------ |
| text/plain    | 文本文字格式 |
| text/html     | HTML格式     |
| text/xml      | XML字符格式  |
| text/url-list | URL列表格式  |

**get()方法**

可以使用getData()方法读取数据。

```
getData(format);
```



### 元素拖动效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			ul {
				width: 120px;
				height: 120px;
				border: 1px solid silver;
			}
		</style>
		<script>
			window.onload = function() {
				var box1 = document.getElementById("box1");
				var oLis = box1.getElementsByTagName("li");
				var box2 = document.getElementById("box2");
				//为每个li（源元素）添加ondragstart事件
				for (var i = 0; i < oLis.length; i++) {
					oLis[i].ondragstart = function(e) {
						e.dataTransfer.setData("text/plain", e.target.id);
					}
				}
				//屏蔽元素的默认行为
				box2.ondragover = function(e) {
					e.preventDefault();
				}
				//为目标元素添加ondrop事件
				box2.ondrop = function(e) {
					e.preventDefault();
					var id = e.dataTransfer.getData("text/plain");
					var obj = document.getElementById(id);
					box2.appendChild(obj);
				}
			}
		</script>
	</head>
	<body>
		<ul id="box1">
			<li draggable="true" id="li1">HTML</li>
			<li draggable="true" id="li2">CSS</li>
			<li draggable="true" id="li3">JavaScript</li>
			<li draggable="true" id="li4">jQuery</li>
			<li draggable="true" id="li5">Vue</li>
		</ul>
		<ul id="box2"> </ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/87fa2ea620464cccbf62ae0f049dc576.gif)



### 垃圾箱效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#garbageBox {
				display: inline-block;
				width: 100px;
				height: 100px;
				background-color: red;
			}

			#garbage {
				display: inline-block;
				width: 50px;
				height: 50px;
				background-color: hotpink;
			}
		</style>
		<script>
			window.onload = function() {
				var garbageBox = document.getElementById("garbageBox");
				var garbage = document.getElementById("garbage");
				garbageBox.ondragover = function(e) {
					e.preventDefault();
				}
				garbageBox.ondrop = function(e) {
					e.preventDefault();
					garbage.parentNode.removeChild(garbage);
				}
			}
		</script>
	</head>
	<body>
		<div id="garbageBox"></div>
		<div id="garbage" draggable="true"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/37c1d9a9c75848c1aeb4bbac7c7b8166.gif)



