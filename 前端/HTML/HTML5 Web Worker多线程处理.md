[TOC]

# HTML5 Web Worker(多线程处理)

## 概述

JavaScript的执行环境是单线程的，也就是一次只能执行一个任务。如果遇到多个任务时，只能排队依次执行。

在HTML5中，可以使用Web Worker创建一个后台线程执行一个耗时任务，而不会影响页面响应。



## 简单使用

Web Worker技术基本原理就是：在当前JavaScript的主线程中，使用Worker()构造函数新建一个worker实例，然后加载某一个JavaScript文件，发送给一个后台线程来处理（注意，这里是后台线程）。

**worker.html**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			//创建worker
			var worker = new Worker("worker.js");
			//向后台线程发送数据
			worker.postMessage("hello world");
			//监听后台线程返回的数据
			worker.onmessage = function(e) {
				console.log("前台线程收到：" + e.data);
			};
		</script>
	</head>
	<body>
	</body>
</html>
```

**worker.js**

```javascript
onmessage = function(e) {
	//接收前台发来的数据
	var d = e.data;
	console.log("后台线程收到：" + d);
	var str = d.split("").reverse().join("");
	postMessage(str);
};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/15a775962bd0471dbff87d43445f060e.png)



## 处理复杂数据

**worker.html**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			var worker;
			window.onload = function() {
				var start = document.getElementById("start");
				var stop = document.getElementById("stop");
				start.onclick = function() {
					worker = new Worker("worker.js")
					worker.onmessage = function(e) {
						console.log("前台接收：" + e.data);
					}
				}
				stop.onclick = function() {
					worker.terminate();
				}
			}
		</script>
	</head>
	<body>
		<button id="start">开始</button>
		<button id="stop">停止</button>
	</body>
</html>
```

**worker.js**

```javascript
var i = 0;

function handleTask() {
	i++;
	console.log("handle:" | i);
	postMessage(i);
}
setInterval(handleTask, 1000);
```



