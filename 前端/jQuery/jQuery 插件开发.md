[TOC]

# jQuery 插件开发

## 插件概述

jQuery插件可以理解成是使用jQuery来封装的一个功能或特效。

一般来说，每一个jQuery插件都是放到独立的一个文件中的。常说的引入一个jQuery插件，其实就是引入一个外部JavaScript文件。



## 常用插件

### 文本溢出：dotdotdot.js

dotdotdot.js官方地址为http://plugins.jquery.com/dotdotdot/。

#### 单行文本省略

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 200px;
				border: 1px solid red;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		</style>
	</head>
	<body>
		<div>
			这些一些内容。这些一些内容。这些一些内容。这些一些内容。这些一些内容。这些一些内容。
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b7d2d9c70374fee83f14f9bbebd64f8.png)

#### 多行文本省略

如果想要实现“多行文本”的省略号效果，我们可以使用dotdotdot.js这个jQuery插件。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				width: 200px;
				height: 50px;
				border: 1px solid red;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script src="js/jquery.dotdotdot.min.js"></script>
		<script>
			$(function() {
				$("div").dotdotdot();
			})
		</script>
	</head>
	<body>
		<div>
			这些一些内容。这些一些内容。这些一些内容。这些一些内容。这些一些内容。这些一些内容。
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e201f979c2a64a17b81d0de243788603.png)



### 延迟加载：lazyload.js

中文文档：http://code.ciaoca.com/jquery/lazyload。

github文档：https://github.com/tuupola/jquery_lazyload。

例如进入某个页面时，页面上会有很多图片，有些图片在下面，当我们没有看完整个页面时，那么下面的图片对我们来说就是“没用”的，加载了也是白加载，而且还会降低页面整体的加载速度。

在jQuery中，我们可以使用lazyload.js这个插件来实现图片的延迟加载。也就是只有当我们把滚动条拉到某个位置，相应处的图片才会显示出来，否则就不会显示。

**步骤**

1. 引入jQuery库和lazyload.js插件。
2. 使用data-original替代src。
3. 调用lazyload()方法。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				height: 800px;
				background-color: grey;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script src="js/jquery.lazyload.min.js"></script>
		<script>
			$(function() {
				$("img").lazyload(function() {
					effect: "fadeIn"
				});
			})
		</script>
	</head>
	<body>
		<div></div>
		<img data-original="img/a.png">
		<img data-original="img/b.png">
		<img data-original="img/c.png">
		<img data-original="img/d.png">
		<img data-original="img/e.png">
	</body>
</html>
```



## 插件编写

### 方法类插件

**语法**

```
(function($){
    $.fn.extend({ 
        "插件名": function(参数){ 
            …… 
        } 
    }); 
})(jQuery); 
```

**简单使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			(function() {
				$.fn.extend({
					"hoverChangeColor": function(fgColor, bgColor) {
						$(this).mouseover(function() {
								$(this).css({
									"color": fgColor,
									"background-color": bgColor
								});
							})
							.mouseout(function() {
								$(this).css({
									"color": "black",
									"background-color": "white"
								});
							});
						return $(this);
					}
				})
			})(jQuery);
		</script>
		<script>
			$(function() {
				$("h3").hoverChangeColor("red", "#010101");
			})
		</script>
	</head>
	<body>
		<h3>hello world!</h3>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e28164cc70554563b2e85a1bf09c4529.gif)

**添加默认值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			(function() {
				$.fn.extend({
					"hoverChangeColor": function(options) {
						var defautls = {
							fgColor: "hotpink",
							bgColor: "lightskyblue"
						};
						var options = $.extend(defautls, options)
						$(this).mouseover(function() {
								$(this).css({
									"color": options.fgColor,
									"background-color": options.bgColor
								});
							})
							.mouseout(function() {
								$(this).css({
									"color": "black",
									"background-color": "white"
								});
							});
						return $(this);
					}
				})
			})(jQuery);
		</script>
		<script>
			$(function() {
				$("h3").hoverChangeColor();
			})
		</script>
	</head>
	<body>
		<h3>hello world!</h3>
	</body>
</html>
```

`$.extend(defautls, options)`合并2个对象，将右边的对象合并到左边的对象上。



### 函数类插件

**语法**

```
(function($){
    $.extend({ 
        "插件名": function(){ 
            …… 
        } 
    }); 
})(jQuery) 
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			(function($) {
				$.extend({
					"maxNum": function(m, n) {
						return (m > n) ? m : n;
					}
				});
			})(jQuery)
			$(function() {
				var result = $.maxNum(10, 5)
				console.log("最大值是：" + result);
			})
		</script>
	</head>
	<body>
	</body>
</html>
```



