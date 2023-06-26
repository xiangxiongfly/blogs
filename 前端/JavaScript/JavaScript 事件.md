[TOC]

# JavaScript 事件

## 概述

JavaScript的事件包含3部分：

*   事件主角：元素。
*   事件类型：点击事件、移动事件等。
*   事件过程：事件触发。

## 事件调用方式

### 在Script标签中调用

**语法**

    DOM对象.事件 = function() {
    	//...
    }

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
					alert("hello");
				}
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```

### 在元素中调用

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script>
            function alertMessage() {
                alert("hello");
            }
        </script>
    </head>
    <body>
        <input id="btn" onclick="alertMessage()" type="button" value="点击">
    </body>
</html>
```

等价于：

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<input id="btn" onclick="alert('hello')" type="button" value="点击">
	</body>
</html>
```

## 常用事件

### 鼠标事件

| 事件          | 说明   |
| ----------- | ---- |
| onclick     | 点击事件 |
| ondblclick  | 双击事件 |
| onmouseover | 移入事件 |
| onmouseout  | 移出事件 |
| onmousedown | 按下事件 |
| onmouseup   | 抬起事件 |
| onmousemove | 移动事件 |

```js
document.getElementById("btn").onclick = function() {
  
}
```

### 键盘事件

| 事件        | 说明 |
| --------- | -- |
| onkeydown | 按下 |
| onkeyup   | 抬起 |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<input type="text" id="txt">
		<span id="num"></span>
		<script>
			let txt = document.getElementById("txt");
			let num = document.getElementById("num");
			txt.onkeyup = function() {
				num.innerText = txt.value.length;
			}
		</script>
	</body>
</html>
```

### 表单事件

| 事件       | 说明                   |
| -------- | -------------------- |
| onfocus  | 获取焦点事件               |
| onblur   | 失去焦点事件               |
| onselect | 单行文本框、多行文本框内选中文本触发事件 |
| onchange | 单选框、复选框、下拉框触发事件      |
| oninput  | 文本框输入时触发事件           |
| onsubmit | 表单提交时触发              |
| onreset  | 表单重置时触发              |

`focus()`方法表示输入框获取焦点。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			function submitFunc() {
				alert("submit");
			}

			function resetFunc() {
				alert("reset");
			}
		</script>
	</head>
	<body>
		<form id="form" onsubmit="submitFunc()" onreset="resetFunc()">
			<input id="txt" type="text">
			<input id="submit" type="submit" value="submit">
			<input id="reset" type="reset" value="reset">
		</form>
	</body>
</html>
```

### 编辑事件

| 事件                                                            | 说明                           |
| ------------------------------------------------------------- | ---------------------------- |
| oncopy                                                        | 可以利用oncopy事件防止页面内容被复制        |
| onselectstart                                                 | 可以利用onselectstart事件防止页面内容被选取 |
| oncontextmenu                                                 | 可以利用oncontextmenu事件禁止使用鼠标右键  |
| oncopy、onselectstart和oncontextmenu在大多数情况下都是用来保护版权的，通常情况是综合使用。 |                              |

#### 防止页面内容被复制

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>防止页面内容被复制</title>
		<script>
			window.onload = function() {
				document.body.oncopy = function() {
					return false;
				}
			}
		</script>
	</head>
	<body>
		<div>hello world!</div>
	</body>
</html>
```

#### 防止页面内容被选取

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>防止页面内容被选取</title>
		<script>
			window.onload = function() {
				document.body.onselectstart = function() {
					return false;
				}
			}
		</script>
	</head>
	<body>
		<div>hello world!</div>
	</body>
</html>
```

#### 禁止使用鼠标右键

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>禁止使用鼠标右键</title>
		<script>
			window.onload = function() {
				document.body.oncontextmenu = function() {
					return false;
				}
			}
		</script>
	</head>
	<body>
		<div>hello world!</div>
	</body>
</html>
```

### 页面事件

| 事件               | 说明                               |
| ---------------- | -------------------------------- |
| DOMContentLoaded | 文档结构加载完后执行事件，不包含图片、flash等非文字媒体内容 |
| onload           | 文档加载完后执行事件（文档中包含图片、flash等元素）     |
| onbeforeunload   | 页面离开前触发事件                        |
| onresize         | 窗口重新调整时触发事件                      |

```js
window.onload = function() {
   
}
```

```js
window.onresize = function() {
    
}
```

```js
document.addEventListener("DOMContentLoaded", function() {
  
});
```

## 事件处理器

### onclick

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var cancelBtn = document.getElementById("cancel-btn");
				var fn = function() {
					alert("hello");
				};
				oBtn.onclick = fn; //绑定
				cancelBtn.onclick = function() {
					oBtn.onclick = null; //解绑
				};
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="按钮" />
		<input id="cancel-btn" type="button" value="解绑" />
	</body>
</html>
```

### onclick的缺陷

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				oBtn.onclick = function() {
					alert("第1次");
				};
				oBtn.onclick = function() {
					alert("第2次");
				};
				oBtn.onclick = function() {
					alert("第3次");
				};
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="按钮" />
	</body>
</html>
```

注：点击按钮时，JS只会执行最后一次onclick，这说明onclick不能为同一个元素添加多个相同事件。

### addEventListener

**语法**

    DOM对象.addEventListner(type, fun, false)

**取值**

*   type是一个字符串，指事件类型，如单机事件用"click"，鼠标移入用“mouseover”等。
*   fun是一个函数。
*   false表示事件冒泡，true表示事件捕获。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				oBtn.addEventListener("click", function() {
					alert("第1次");
				}, false);
				oBtn.addEventListener("click", function() {
					alert("第2次");
				}, false);
				oBtn.addEventListener("click", function() {
					alert("第3次");
				}, false);
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="按钮" />
	</body>
</html>
```

注：点击按钮后，会依次执行3个事件代码，这说明addEventListener是可以添加多个相同事件。

### removeEventListener

解除事件绑定。

**语法**

    DOM对象.removeEventListener(type, fun, false)

## this

this可以理解为哪个对象调用了函数，函数里的this就指向这个对象。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oUl = document.getElementById("list");
				var oLis = oUl.children;
				for (var i = 0; i < oLis.length; i++) {
					oLis[i].onclick = function() {
						this.style.color = "red";
					}
				}
			}
		</script>
	</head>
	<body>
		<ul id="list">
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
		</ul>
	</body>
</html>
```

