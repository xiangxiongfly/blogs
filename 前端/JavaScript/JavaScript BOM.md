[TOC]

# JavaScript BOM

## BOM结构

window对象存放了这个页面的所有信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fbe5b22b4dd74fc3afc11fd4f613fbd4.png)

**window的子对象**

| 子对象    | 说明                               |
| --------- | ---------------------------------- |
| document  | 文档对象，用于操作页面元素         |
| location  | 地址对象，用于操作URL地址          |
| navigator | 浏览器对象，用于获取浏览器版本信息 |
| history   | 历史对象，用于操作浏览历史         |
| screen    | 屏幕对象，用于操作屏幕宽高         |

在JavaScript中，一个浏览器窗口就是一个window对象，窗口里的HTML文档就是一个document对象，document对象就是window对象的子对象。

window对象及下面的location、navigator等子对象，由于都是操作浏览器窗口的，所以也被称为BOM（Brower Object Module，浏览器对象模型）。

BOM和DOM都是对象模型，也就是将它们当作一个对象进行处理。



## window对象

window对象表示浏览器打开的窗口。如果网页中包含frame或iframe标签，则浏览器会为每个框架创建一个window对象，并将它们存放在frames集合中。

window对象的所有属性和方法都是全局性的。而且JavaScript中的所有全局变量都是window对象的属性，所有全局函数都是window对象的方法。

window对象的属性和方法，在使用时都可以省略window直接使用，如`window.alert()`可以简写为`alert()`。



**window对象方法**

| 方法            | 说明           |
| --------------- | -------------- |
| alert()         | 提示对话框     |
| confirm()       | 判断对话框     |
| prompt()        | 输入对话框     |
| open()          | 打开窗口       |
| close()         | 关闭窗口哦     |
| setTimeout()    | 开启定时器     |
| clearTimeout()  | 关闭定时器     |
| setInterval()   | 开启循环定时器 |
| clearInterval() | 关闭循环定时器 |



### open() 打开窗口

**语法**

```
window.open(url, target)
```

**取值**

url指新窗口的地址。如果url为空，则会打开一个空白窗口，可以通过`document.write()`写入数据。

target指打开方式。

- 取值为`_blank`（默认值）表示在新窗口中打开。
- 取值为`_self`表示在当前窗口中打开。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				btn.onclick = function() {
					window.open("https://www.baidu.com", "_blank");
				}
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="打开">
	</body>
</html>
```

**打开新窗口并输入数据**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				btn.onclick = function() {
					var opener = window.open();
					var html = "hello";
					opener.document.write(html);
				}
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="打开">
	</body>
</html>
```



### close() 关闭窗口

**语法**

```
window.close()
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var closeBtn = document.getElementById("close-btn");
				var opener = null;
				btn.onclick = function() {
					opener = window.open();
					var html = "hello";
					opener.document.write(html);
				}
				closeBtn.onclick = function() {
					if (opener != null)
						opener.close();
				}
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="打开">
		<input id="close-btn" type="button" value="关闭">
	</body>
</html>
```



### 对话框

| 方法      | 说明                           |
| --------- | ------------------------------ |
| alert()   | 仅提示文字                     |
| confirm() | 提示文字，返回布尔值           |
| prompt()  | 提示文字，具有输入框，返回内容 |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var alertBtn = document.getElementById("alert-btn");
				alertBtn.onclick = function() {
					alert("HTML\nCSS\nJavaScript")
				}
				var confirmBtn = document.getElementById("confirm-btn");
				confirmBtn.onclick = function() {
					confirm("hello");
				}
				var promptBtn = document.getElementById("prompt-btn");
				promptBtn.onclick = function() {
					var name = prompt("请输入你的名字：");
					console.log(name);
				}
			}
		</script>
	</head>
	<body>
		<input id="alert-btn" type="button" value="alert">
		<input id="confirm-btn" type="button" value="confirm">
		<input id="prompt-btn" type="button" value="prompt">
	</body>
</html>
```



### 定时器

#### setTimeout() 和 clearTimeout()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var start = document.getElementById("start");
				var cancel = document.getElementById("cancel");
				var timer = null;
                
				start.onclick = function() {
					if (timer != null)
						clearTimeout(timer);
                    
					timer = setTimeout(function() {
						alert("hello world");
					}, 2000);
				}
                
				cancel.onclick = function() {
					if (timer != null)
						clearTimeout(timer);
				}
			}
		</script>
	</head>
	<body>
		<input id="start" type="button" value="开始">
		<input id="cancel" type="button" value="取消">
		<div><span id="num"></span></div>
	</body>
</html>
```



#### setInerval() 和 clearInterval()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var start = document.getElementById("start");
				var cancel = document.getElementById("cancel");
				var num = document.getElementById("num");
				var i = 5;
				var timer = null;
                
				start.onclick = function() {
					if (timer != null)
						clearInterval(timer);
                    
					timer = setInterval(function() {
						if (i > 0) {
							i--;
							num.innerText = i.toString();
						} else {
							clearInterval(timer);
						}
					}, 1000);
				}
                
				cancel.onclick = function() {
					if (timer != null)
						clearInterval(timer);
				}
			}
		</script>
	</head>
	<body>
		<input id="start" type="button" value="开始">
		<input id="cancel" type="button" value="取消">
		<div><span id="num" style="color:red;">5</span></div>
	</body>
</html>
```



## location对象

| 属性和方法 | 说明                                             |
| ---------- | ------------------------------------------------ |
| href       | 获取和设置当前页面地址                           |
| search     | 获取当前页面地址”?“后面的内容                    |
| hash       | 获取当前页面地址”#“后面的内容                    |
| reload()   | 重新加载当前页面，参数为true表示强制从服务器加载 |

### window.location.href

**获取当前页面地址**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var url = window.location.href;
				document.write(url);
			}
		</script>
	</head>
	<body>
	</body>
</html>
```

**设置当前页面地址**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				setTimeout(function() {
					window.location.href = "http://www.baidu.com";
				}, 2000);
			}
		</script>
	</head>
	<body>
		<p>2秒后跳转百度</p>
	</body>
</html>
```



### window.location.search

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			var search = window.location.search;
			document.write(search)
		</script>
	</head>
	<body>
	</body>
</html>
```



### window.location.hash

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			var hash = window.location.hash;
			document.write(hash)
		</script>
	</head>
	<body>
	</body>
</html>
```



## navigator对象

### window.navigator.userAgent

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			var userAgent = window.navigator.userAgent;
			document.write(userAgent)
		</script>
	</head>
	<body>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/82d7346598b9472aa16cb267d6dbfa7c.png)



## history对象

history对象包含用户在浏览器窗口中访问过的URL。

| 方法                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| back()                        | 加载history列表中的前一个URL                                 |
| forward()                     | 加载history列表中的下一个URL                                 |
| go(number)                    | 加载history列表中的某个具体页面。参数number 是要访问的URL在history的URL列表中的相对位置，可取正数或负数。在当前页面前面的 URL的位置为负数(如在前一个页面的位置为-1)，反之则为正数 |
| pushState(state,title,url)    | 添加指定的url到历史记录中，并且刷新将地址栏中的网址更新为url |
| replaceState(state,title,url) | 使用指定的url替换当前历史记录，并且无需刷新浏览器就会将地址栏中的网址更新为url |

```
history.back();//等效单击后退按钮
history.forward();//等效单击前进按钮
history.go(-1);//等效单击一次后退按钮,与history.back()功能等效
history.go(-2);//等效单击两次后退按钮
history.pushState(null,null,"test1.html"); 
history.replaceState(null,null,"test2.html");
```



## screen对象

screen对象包含有关客户端显示屏幕的信息。

| 方法        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| availHeight | 返回显示屏幕的可用高度，单位为像素，不包括任务栏             |
| availWidth  | 返回显示屏幕的可用宽度，单位为像素，不包括任务栏             |
| height      | 返回显示屏幕的高度，单位为像素                               |
| width       | 返回显示屏幕的宽度，单位为像素                               |
| colorDepth  | 返回当前颜色设置所用的位数，值为-1:黑白;8:256色;16:增强色;24/32:真彩色 |

```
screen.availHeight;//获取屏幕的可用高度
screen.availWidth;//获取屏幕的可用宽度
scren.height;//获取屏幕的高度
screen.width;//获取屏幕的宽度
```



## document对象

document对象是window对象的一个子对象，它可以操作HTML文档里所有的内容。

浏览器每次打开一个窗口，就会为这个窗口生成一个window对象，并且为这个窗口内部的页面即HTML文档，生成一个document对象，这样可以通过document对象操作页面里的元素。

### document对象属性

| 属性              | 说明                        |
| ----------------- | --------------------------- |
| document.title    | 获取文档title               |
| document.body     | 获取文档body                |
| document.forms    | 获取所有form元素            |
| document.images   | 获取所有img元素             |
| document.links    | 获取所有a元素               |
| document.cookie   | 文档的cookie                |
| document.URL      | 获取文档URL                 |
| document.referrer | 获取当前页面之前的页面的URL |

说明：

- document.forms等价于document.getElementByTagName("form")。
- document.URL和window.location.href都可以获取当前页面的URL，但是document.URL只能获取。
- 获取当前页面之前的页面的URL，如从页面A跳转到页面B，在页面B可以通过document.referrer获取页面A的URL。

### document对象方法

| 方法                              | 说明                   |
| --------------------------------- | ---------------------- |
| document.getElementById()         | 通过id获取元素         |
| document.getElementsByTagName()   | 通过标签名获取元素     |
| document.getElementsByClassName() | 通过class获取元素      |
| docuemt.getElementsByName()       | 通过name获取元素       |
| document.querySelector()          | 通过选择器获取元素     |
| document.querySelectorAll()       | 通过选择器获取所有元素 |
| document.createElement()          | 创建元素节点           |
| document.createTextNode()         | 创建文本节点           |
| document.write()                  | 输出内容               |
| document.writeln()                | 输出内容并换行         |



