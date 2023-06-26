[toc]

# JavaScript 浏览器的重排和重绘

## 概述

虽然可以通过JavaScript操作DOM元素，但是代价却是高昂的。我们可以将DOM和JavaScript想象成两个岛，它们之间的连接需要通过一座桥，而JavaScript对DOM的访问就需要通过这座桥，并收取“过桥费”，随着对DOM访问次数的增加，费用也就越高，因此我们需要尽量减少“过桥”的次数，也就是减少对DOM的访问和修改，而这也是优化DOM性能的手段之一。

对DOM的修改相比于对DOM的访问，在性能上的影响会更大，这是因为它会带来浏览器的重排或重绘。



## 浏览器解析过程

**浏览器渲染HTML的过程大致可以分为4步：**

1. HTML文件被HTML解析器解析成对应的DOM树，CSS样式文件被CSS解析器解析生成对应的样式规则集。
2. DOM树与CSS样式集解析完成后，附加在一起形成一个渲染树。
3. 节点信息的计算，即根据渲染树计算每个节点的几何信息。
4. 渲染绘制，即根据计算完成的节点信息绘制整个页面。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b404d96767164253adfd331700e32239.png)



## 重排

览器渲染页面默认采用的是流式布局模型。

因为浏览器渲染页面是基于流式布局的，对某一个DOM节点信息进行修改时，就需要对该DOM结构进行重新计算。该DOM结构的修改会决定周边DOM结构的更改范围，主要分为全局范围和局部范围。

全局范围就是从页面的根节点html标签开始，对整个渲染树进行重新计算。例如，当我们改变窗口的尺寸或者修改了根元素的字体大小时。

局部范围只会对渲染树的某部分进行重新计算。例如要改变页面中某个div的宽度，只需要重新计算渲染树中与该div相关的部分即可。

**重排是一种明显的改变页面布局的操作，常见操作：**

- 页面首次渲染。在页面首次渲染时，HTML页面的各个元素位置、尺寸、大小等信息均是未知的，需要通过与CSS样式规则集才能确定各个元素的几何信息。这个过程中会产生很多元素几何信息计算的过程，所以会产生重排操作。
- 浏览器窗口大小发生改变。页面渲染完成后，就会得到一个固定的渲染树。如果此时对浏览器窗口进行缩放或者拉伸操作，渲染树中从根元素html标签开始的所有元素，都会重新计算其几何信息，从而产生重排操作。
- 元素尺寸或位置发生改变。
- 元素内容发生变化。
- 元素字体发生变化。
- 添加或删除可见的DOM元素。
- 获取某些特定的属性。

频繁的重排操作会对浏览器引擎产生很大的消耗，因此浏览器不会针对每个JS操作都进行一次重排，而是维护一个会引起重排操作的队列，等队列中的操作达到了一定的数量或者到了一定的时间间隔时，浏览器才会去flush一次队列，进行真正的重排操作。

虽然浏览器会有这个优化，但是浏览器为了返回最精准的信息，我们写的一些代码可能会强制浏览器提前flush队列，例如我们获取以下这些样式信息的时候：

```css
·  oﬀsetTop, oﬀsetLeft, oﬀsetWidth, oﬀsetHeight
·  scrollTop/Left/Width/Height
·  clientTop/Left/Width/Height
·  width,height
·  调用getComputedStyle()函数
```

在获取以下一些常见的属性和函数时，会引发重排的操作：

```css
· width：宽度。
· height：高度。
· margin：外边距。
· padding：内边距。
· display：元素显示方式。
· border：边框。
· position：元素定位方式。
· overflow：元素溢出处理方式。
· clientWidth：元素可视区宽度。
· clientHeight：元素可视区高度。
· clientLeft：元素边框宽度。
· clientTop：元素边框高度。
· offsetWidth：元素水平方向占据的宽度。
· offsetHeight：元素水平方向占据的高度。
· offsetLeft：元素左外边框至父元素左内边框的距离。
· offsetTop：元素上外边框至父元素上内边框的距离。
· scrollWidth：元素内容占据的宽度。
· scrollHeight：元素内容占据的高度。
· scrollLeft：元素横向滚动的距离。
· scrollTop：元素纵向滚动的距离。
· scrollIntoView()：元素滚动至可视区的函数。
· scrollTo()：元素滚动至指定坐标的函数。
· getComputedStyle()：获取元素的CSS样式的函数。
· getBoundingClientRect()：获取元素相对于视窗的位置集合的函数。
· scrollIntoViewIfNeeded()：元素滚动至浏览器窗口可视区的函数。（非标准特性，谨慎使用）
```



## 重绘

相比于重排，重绘简单很多。重绘只是改变元素在页面中的展现样式，而不会引起元素在文档流中位置的改变。例如更改了元素的字体颜色、背景色、透明度等，浏览器均会将这些新样式赋予元素并重新绘制。

简单来说，重排一定会引起重绘的操作，而重绘却不一定会引起重排的操作。

因为在元素重排的过程中，元素的位置等几何信息会重新计算，并会引起元素的重新渲染，这就会产生重绘的操作。而在重绘时，只是改变了元素的展现样式，而不会引起元素在文档流中位置的改变，所以并不会引起重排的操作。

在修改某些常见的属性时，会引发重绘的操作，例如：

```css
· color：颜色。
· border-style：边框样式。
· visibility：元素是否可见。
· background：元素背景样式，包括背景色、背景图、背景图尺寸、背景图位置等。
· text-decoration：文本装饰，包括文本加下画线、上划线、贯穿线等。
· outline：元素的外轮廓的样式，在边框外的位置。
· border-radius：边框圆角。
· box-shadow：元素的阴影。
```



## 优化

### 将多次改变样式的属性操作合并为一次

**不推荐**

```javascript
var changeDiv = document.querySelector('#changeDiv');
changeDiv.style.width = '100px';
changeDiv.style.background = '#e3e3e3';
changeDiv.style.height = '100px';
changeDiv.style.marginTop = '10px';
```

**推荐**

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style type="text/css">
			div.changeDiv {
				width: "100px";
				background: #e3e3e3;
				height: 100px;
				margin-top: 10px;
			}
		</style>
	</head>
	<body>
		<div class="changeDiv"></div>
		<script type="text/javascript">
			document.getElementById('changeDiv').className = "changeDiv";
		</script>
	</body>
</html>
```



### 需要多次重排的元素设置为绝对定位

需要进行重排的元素都是处于正常的文档流中的，如果这个元素不处于文档流中，那么它的变化就不会影响到其他元素的变化，这样就不会引起重排的操作。常见的操作就是设置其position为absolute或者fixed。

假如一个页面有动画元素，如果它会频繁地改变位置、宽高等信息，那么最好将其设置为绝对定位。



### 减少DOM操作

**不推荐**

```javascript
// 将数据渲染至table
function renderTable(list) {
    // 目标table元素
    var table = $('#table');
    var rowHTML = '';
    // 遍历数据集
    list.forEach(function(item) {
        rowHTML += '<tr>';
        rowHTML += '<td>' + item.name + '</td>';
        rowHTML += '<td>' + item.address + '</td>';
        rowHTML += '<td>' + item.email + '</td>';
        rowHTML += '</tr>';
        // 每次添加一行数据
        table.append($(rowHTML));
        // 添加完后清空
        rowHTML = '';
    });
}
```

**推荐**

```javascript
// 将数据渲染至table
function renderTable(list) {
    // 目标table元素
    var table = $('#table');
    var allHTML = '';
    // 遍历数据集
    list.forEach(function(item) {
        allHTML += '<tr>';
        allHTML += '<td>' + item.name + '</td>';
        allHTML += '<td>' + item.address + '</td>';
        allHTML += '<td>' + item.email + '</td>';
        allHTML += '</tr>';
    });
    // 获取完整片段后,一次性渲染
    table.append($(allHTML));
}
```



### 复杂元素处理先设置display为none处理完后再显示

因为display属性为none的元素不会出现在渲染树中，所以对该元素处理时不会引起其他元素的重排。当我们需要对一个元素做复杂处理时，可以将其display属性设置为none，操作完成后，再将其显示出来，这样就只会在隐藏和显示的时候引发两次重排操作。



### 缓存频繁操作的属性

**不推荐**

```javascript
var ele = document.querySelector('#ele');
// 判断条件1
if(true) {
    ele.style.width = '200px';
}
// 判断条件2
if(true) {
    ele.style.width = '300px';
}
// 判断条件3
if(true) {
    ele.style.width = '400px';
}
```

**推荐**

```javascript
var ele = document.querySelector('#ele');
// 先获取width属性
var width = ele.style.width;
// 判断条件1
if(true) {
    width = '200px';
}
// 判断条件2
if(true) {
    width = '300px';
}
// 判断条件3
if(true) {
    width = '400px';
}
// 最后执行一次width属性赋值
ele.style.width = width;
```



### 减少使用table布局

如果table中任何一个元素触发了重排的操作，那么整个table都会触发重排的操作，尤其是当一个table内容比较庞大时，更加不推荐使用table布局。

如果不得已使用了table，可以设置table-layout:auto或者是table-layout:fixed。这样可以让table一行一行地渲染，这种做法也是为了限制重排的影响范围。



### 使用事件委托绑定事件处理程序

在对多个同级元素做事件绑定时，推荐使用事件委托机制进行处理。使用事件委托可以在很大程度上减少事件处理程序的数量，从而提高性能。

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



### 利用DocumentFragment操作DOM节点

DocumentFragment是一个没有父级节点的最小文档对象，它可以用于存储已经排好版或者尚未确定格式的HTML片段。DocumentFragment最核心的知识点在于它不是真实DOM树的一部分，它的变化不会引起DOM树重新渲染的操作，也就不会引起浏览器重排和重绘的操作，从而带来性能上的提升。

因为DocumentFragment具有的特性，在需要频繁进行DOM新增或者删除的操作中，它将变得非常有用。

一般的操作方法分为以下两步：

1. 将需要变更的DOM元素放置在一个新建的DocumentFragment中，因为DocumentFragment不存在于真实的DOM树中，所以这一步操作不会带来任何性能影响。
2. 将DocumentFragment添加至真正的文档树中，这一步操作处理的不是DocumentFragment自身，而是DocumentFragment的全部子节点。对DocumentFragment的操作来说，只会产生一次浏览器重排和重绘的操作，相比于频繁操作真实DOM元素的方法，会有很大的性能提升。

**不推荐**

```html
<ul id="list"></ul>
<script>
    var list = document.querySelector('#list');
    for (var i = 0; i < 100; i++) {
        var li = document.createElement('li');
        var text = document.createTextNode('节点' + i);
        li.append(text);
        list.append(li);
    }
</script>
```

**推荐**

```html
<script>
    var list = document.querySelector('#list2');
    // 1.创建新的DocumentFragment对象
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 100; i++) {
        var li = document.createElement('li');
        var text = document.createTextNode('节点' + i);
        li.append(text);
        // 2.将新增的元素添加至DocumentFragment对象中
        fragment.append(li);
    }
    // 3.处理DocumentFragment对象
    list.append(fragment);
</script>
```



