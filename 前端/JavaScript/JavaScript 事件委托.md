[toc]

# JavaScript 事件委托

## 概述

事件委托是利用事件冒泡原理，管理某一类型的所有事件，利用父元素来代表子元素的某一类型事件的处理方式。



## 已有元素的事件绑定（普通方法）

场景：假如页面上有一个ul标签，里面包含1000个li子标签，我们需要在单击每个li时，输出li中的文本内容。

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<ul>
			<li>文本1</li>
			<li>文本2</li>
			<li>文本3</li>
		</ul>
		<script type="text/javascript">
			var lis = document.querySelectorAll("li");
			for (var i = 0; i < lis.length; i++) {
				lis[i].onclick = function() {
					console.log(this.innerText);
				};
			}
		</script>
	</body>
</html>
```



## 已有元素的事件绑定（事件委托方法）

普通方法缺点：给每个li标签绑定一个click事件，在click事件中输出li标签的文本内容，但这样会导致事件处理程序过多导致页面交互时间过长，事件处理程序过多导致内存占用过多。

事件委托方法：利用事件委托机制，事件委托机制的主要思想是将事件绑定至父元素上，然后利用事件冒泡原理，当事件进入冒泡阶段时，通过绑定在父元素上的事件对象来判断当前事件流正在进行的元素。如果和期望的元素相同，则执行相应的事件代码。

**使用事件委托机制：**

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<ul>
			<li>文本1</li>
			<li>文本2</li>
			<li>文本3</li>
		</ul>
		<script type="text/javascript">
			var EventUtil = {
				// 获取事件对象
				getEvent: function(event) {
					return event || window.event;
				},
				getTarget: function(event) {
					return event.target || event.srcElement;
				}
			};

			var ul = document.querySelector("ul");
			ul.addEventListener("click", function(event) {
				var event = EventUtil.getEvent(event);
				var target = EventUtil.getTarget(event);
				if (target.nodeName.toLowerCase() === "li") {
					console.log(target.innerText);
				}
			});
		</script>
	</body>
</html>
```

## 新建元素的事件绑定

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<ul>
			<li>文本1</li>
			<li>文本2</li>
			<li>文本3</li>
		</ul>
		<button id="add">新增</button>
		<script type="text/javascript">
			var EventUtil = {
				// 获取事件对象
				getEvent: function(event) {
					return event || window.event;
				},
				getTarget: function(event) {
					return event.target || event.srcElement;
				}
			};

			var ul = document.querySelector("ul");
			var add = document.getElementById("add");
			add.addEventListener('click', function() {
				// 创建新的li元素
				var newLi = document.createElement("li");
				var newText = document.createTextNode("文本" + (ul.children.length + 1));
				newLi.appendChild(newText);
				// 添加至父元素ul中
				ul.appendChild(newLi);
			});
			ul.addEventListener("click", function(event) {
				var event = EventUtil.getEvent(event);
				var target = EventUtil.getTarget(event);
				if (target.nodeName.toLowerCase() === "li") {
					console.log(target.innerText);
				}
			});
		</script>
	</body>
</html>
```



