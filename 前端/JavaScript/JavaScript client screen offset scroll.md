[toc]

# JavaScript 尺寸和坐标

## 元素宽高

- el.clientWidth：获取元素可视区域宽度，包含元素宽、内边距，不包含滚动条、边框、外边距。
- el.offsetWidth：获取元素整体宽度，包含元素宽、内边距、边框、滚动条。clientWidth的值小于等于offsetWidth的值。
- el.scrollWidth：获取元素的实际宽度，包括因为溢出而没有显示出来的部分。如果元素的内容没有溢出，则scrollWidth等于clientWidth；如果元素溢出，则scrollWidth大于clientWidth。
- el.clientTop：获取元素上边框的宽度。
- el.offsetTop：获取元素距离定位父元素的顶部距离。
- el.scrollTop：垂直移动距离。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <style>
      #box {
        width: 200px;
        height: 200px;
        padding: 10px;
        border: 1px solid red;
        margin: 50px;
      }
    </style>
  </head>
  <body>
    <div id="box"></div>
    <script>
      let box = document.getElementById("box");
      console.log(box.clientWidth); //220
      console.log(box.offsetWidth); //222
      console.log(box.clientTop); //1
      console.log(box.offsetTop); //50
    </script>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/48c9482e25d04f5d890625f9c2bc78fc.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <style>
      #box {
        width: 200px;
        height: 200px;
        padding: 10px;
        border: 1px solid red;
        margin: 50px;
        overflow: auto;
          background-color: yellowgreen;
      }
      p {
        width: 2000px;
        height: 2000px;
      }
    </style>
  </head>
  <body>
    <div id="box">
      <p></p>
    </div>
    <script>
      let box = document.getElementById("box");
      console.log(box.clientWidth); //205
      console.log(box.offsetWidth); //222
      console.log(box.scrollWidth); //2020
      console.log(box.clientTop); //1
      console.log(box.offsetTop); //50
      console.log(box.scrollTop); //0
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
![在这里插入图片描述](https://img-blog.csdnimg.cn/21e1290d7b3f4d85a758762e9bb96b97.png)

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



## window

- window.innerWidth：获取浏览器视口宽度（包含滚动条）。
- window.innerHeight：获取浏览器视口高度（包含滚动条）。
- window.outerWidth：获取整个浏览器宽度。
- window.outerHeight：获取整个浏览器高度。

```javascript
console.log(window.innerWidth); //638
console.log(window.innerHeight); //861
console.log(window.outerWidth); //1531
console.log(window.outerHeight); //981
```



## document.documentElement

- document.documentElement.clientWidth：获取html根元素的宽度（不包含滚动条）。
- document.documentElement.clientHeight：获取html根元素的高度（不包含滚动条）。

```javascript
console.log(document.documentElement.clientWidth); //623
console.log(document.documentElement.clientHeight); //861
```



## window.screen

- window.screen.height：获取屏幕高度。
- window.screen.availHeight：获取屏幕可用高度。

```javascript
console.log(window.screen.availHeight); //1040
console.log(window.screen.height); //1080
```

