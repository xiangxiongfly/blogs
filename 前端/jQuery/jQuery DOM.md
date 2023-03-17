[TOC]

# jQuery DOM

## 概述

DOM，全称“Document Object Model（文档对象模型）”，它是由W3C（World Wide Web Consortium，万维网联盟）定义的一个标准。

DOM采用的是“树形结构”，用“树节点”的形式来表示页面中的每一个元素。



## 操作元素

### 创建元素

**语法**

```
$().append("字符串")
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
			$(function() {
				var $li = "<li>jQuery</li>";
				$("ul").append($li);
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/98f26add7f574e99ba7fd6f158ceb31c.png)



### 插入节点

在jQuery中插入节点的方法有以下4组：

- prepend() 和 prependTo()
- append() 和 appendTo()
- before() 和 insertBefore()
- after() 和 insertAfter()

#### prepend()

**语法**

```
$(父元素).append(子元素)
```

**说明**

在父元素里添加子元素。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$("p").prepend($strong);
			})
		</script>
	</head>
	<body>
		<p> hello</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0be5efa5b3bb4379851e316eb66e16ca.png)

#### prependTo()

**语法**

```
$(子元素).prependTo(父元素)
```

**说明**

将子元素添加到父元素内部。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$($strong).prependTo("p");
			})
		</script>
	</head>
	<body>
		<p> hello</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0be5efa5b3bb4379851e316eb66e16ca.png)

#### append()

**语法**

```
$(父元素).append(子元素)
```

**说明**

父元素内部添加子元素。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$("p").append($strong);
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f0f4c2e14b984f72ae90d7f02675f9c0.png)

#### appendTo()

**语法**

```
$(子元素).appendTo(父元素)
```

**说明**

将子元素添加到父元素内部。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$($strong).appendTo("p");
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f0f4c2e14b984f72ae90d7f02675f9c0.png)

#### before()

**语法**

```
$(元素A).before(元素B)
```

**说明**

在元素A的外部前面插入元素B。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$("p").before($strong);
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6565f7110e4c436587421c5bc659710a.png)

#### insertBefore()

**语法**

```
$(元素A).insertBefore(元素B)
```

**说明**

将元素A插入元素B外部的前面。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$($strong).insertBefore("p");
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6565f7110e4c436587421c5bc659710a.png)

#### after()

**语法**

```
$(元素A).after(元素B)
```

**说明**

在元素A外部的后面插入元素B。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$("p").after($strong);
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3da550049c674b16826cffb6d55c4b89.png)

#### insertAfter()

**语法**

```
$(元素A).insertAfter(元素B)
```

**说明**

将元素A插入到元素B外部的后面。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'>jQuery</strong>";
				$($strong).insertAfter("p");
			})
		</script>
	</head>
	<body>
		<p>hello </p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3da550049c674b16826cffb6d55c4b89.png)



### 删除元素

在jQuery中删除元素有以下3种：

- remove()
- detach()
- empty()

#### remove()

**语法**

```
$(元素).remove()
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
			$(function() {
				$("li:nth-child(3)").remove();
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0fcc0223713f485cb68afeebb832cd49.png)

#### detach()

在jQuery中，detach()和remove()的功能虽然相似，都是将某个元素及其内部所有内容删除，但是两者也有明显的区别。

- remove()方法用于“彻底”删除元素。所谓的“彻底”，指的是不仅会删除元素，还会把元素绑定的事件删除。
- detach()方法用于“半彻底”删除元素。所谓的“半彻底”，指的是只会删除元素，不会把元素绑定的事件删除。

#### empty()

**语法**

```
$(父元素).empty()
```

**说明**

清空后代元素。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:nth-child(4)").empty();
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6966bb7d257c4f1ca80f9c7d8a0cc473.png)



### 复制元素

#### clone()

**语法**

```
$(元素).clone(取值)
```

**取值**

| 属性值 | 说明                             |
| ------ | -------------------------------- |
| true   | 复制元素，同时复制所有绑定的事件 |
| false  | 仅复制元素，不会复制绑定的事件   |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").each(function(index, e) {
					$(e).click(function() {
						alert($(this).text())
					});
				});

				var $ul = $("ul").clone(true);
				$("#box").append($ul);
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
		</ul>
		<div id="box"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1e8e20df115549bbb4e999e7df8f8eec.png)



### 替换元素

在jQuery中替换元素有以下2种方法：

- replaceWith()
- replaceAll()

#### replaceWith()

**语法**

```
$(元素A).replaceWith(元素B)
```

**说明**

将元素A替换为元素B。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function() {
					var $a = "<a href='http://www.baidu.com'>百度</a>";
					$("strong").replaceWith($a);
				});
			})
		</script>
	</head>
	<body>
		<strong>hello jQuery</strong>
		<input id="btn" type="button" value="替换">
	</body>
</html>
```

#### replaceAll()

**语法**

```
$(元素A).replaceAll(元素B)
```

**说明**

用元素A替换元素B。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function() {
					var $a = "<a href='http://www.baidu.com'>百度</a>";
					$($a).replaceWith("strong");
				});
			})
		</script>
	</head>
	<body>
		<strong>hello jQuery</strong>
		<input id="btn" type="button" value="替换">
	</body>
</html>
```



### 包裹元素

在jQuery中包裹元素有以下3种方式：

- wrap()
- wrapAll()
- wrapInner()

#### wrap()

**语法**

```
$(元素A).wrap(元素B)
```

**说明**

元素B包裹元素A。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $div = "<div style='color:red;'></div>";
				$("p").wrap($div);
			})
		</script>
	</head>
	<body>
		<p>HTML</p>
		<p>CSS</p>
		<p>JavaScript</p>
		<p>jQuery</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/85026a9094c648e699b6507665fc9981.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/447ebdf62db849cdaaccf8963ddca9f6.png)

#### wrapAll()

**语法**

```
$(元素A).wrapAll(元素B)
```

**说明**

将所有的元素A一起被元素B包裹

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $div = "<div style='color:red;'></div>";
				$("p").wrapAll($div);
			})
		</script>
	</head>
	<body>
		<p>HTML</p>
		<p>CSS</p>
		<p>JavaScript</p>
		<p>jQuery</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e1ebc00c6f54311bd9b176d4860e901.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ed6b5ecfb14e40efb42e7852f9c7e20d.png)

#### wrapInner()

**语法**

```
$(元素A).wrapInner(元素B)
```

**说明**

将元素A内部的元素和文本用元素B包裹。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $strong = "<strong style='color:red;'></strong>";
				$("p").wrapInner($strong);
			})
		</script>
	</head>
	<body>
		<p>HTML</p>
		<p>CSS</p>
		<p>JavaScript</p>
		<p>jQuery</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/dea493895a824e92b6111db0b1d41a9a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/73fe8f32553f422ab8d2b06747eb1d72.png)



### 遍历元素

**语法**

```
$("li").each(function(index, element) {
	
});
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
			$(function() {
				$("li").each(function(index, element) {
					var txt = "第" + index + "个元素";
					$(element).text(txt).css("color", "red");
				});
			})
		</script>
	</head>
	<body>
		<div>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f7007599cbf4d2195a8c655b99b900d.png)



## 属性操作

### 获取属性

**语法**

```
$(元素).attr("属性名")
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
			$(function() {
				var src = $("img").attr("src");
				var alt = $("img").attr("alt");
				console.log(src); //img/a.png
				console.log(alt); //图片1号
			})
		</script>
	</head>
	<body>
		<img src="img/a.png" alt="图片1号">
	</body>
</html>
```



### 设置属性

**语法**

```
$(元素).attr("属性名", "属性值")
$(元素).attr({"属性名":"属性值","属性名2":"属性值",...})
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
			$(function() {
				$("#pic").attr({
					"src": "img/a.png",
					"alt": "图片1号"
				})
			})
		</script>
	</head>
	<body>
		<img id="pic">
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b2706ee67799445481633b48a2ceed64.png)



### 删除属性

**语法**

```
$(元素).removeAttr("属性名")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			.select {
				color: red;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#p1").removeAttr("class");
			})
		</script>
	</head>
	<body>
		<p class="select">hello</p>
		<p id="p1" class="select">hello</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2c4e8a8eb8846908b85b90e5aace4b2.png)



### prop()方法

prop()方法和attr()方法相似，都可以获取和设置元素的HTML属性。

但是jQuery官方建议：具有true和false这两种取值的属性，如checked、selected和disabled等，建议使用prop()方法来操作，而其他的属性都建议使用attr()方法来操作。

总之，如果某个属性没法使用`attr()`方法来获取或设置，改换`prop()`方法就可以实现。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("input[type='radio']").change(function() {
					var b = $(this).prop("checked");
					if (b) {
						$("p").text("您选择的是：" + $(this).val());
					}
				});
			})
		</script>
	</head>
	<body>
		<div>
			<label><input type="radio" name="fruit" value="苹果">苹果</label>
			<label><input type="radio" name="fruit" value="香蕉">香蕉</label>
			<label><input type="radio" name="fruit" value="梨子">梨子</label>
		</div>
		<p></p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/393f5885e0d34c1a8539bb4b9200e21a.png)



## 样式操作

### 获取属性

**语法**

```
$(元素).css("属性名")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			p {
				color: red;
				font-weight: bold;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var a = $("p").css("color");
				console.log(a); //rgb(255, 0, 0)
				var b = $("p").css("font-weight");
				console.log(b); //700
			})
		</script>
	</head>
	<body>
		<p>hello</p>
	</body>
</html>
```



### 设置属性

**语法**

```
$(元素).css("属性名", "属性值")

$(元素).css({
    "属性名", "属性值",
    "属性名2", "属性值2"，
    ...
});
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
			$(function() {
				$("#p1").css("color", "red");
				$("#p2").css({
					"color": "blue",
					"font-weight": "bold"
				});
			})
		</script>
	</head>
	<body>
		<p id="p1">hello</p>
		<p id="p2">world</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/26d1595ca8e74aa1966b3ba67a087fc8.png)



### CSS类名操作

#### 添加class

**语法**

```
$(元素).addClass("类名")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.select {
				color: red;
				font-weight: bold;
				background-color: yellow;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:nth-child(4)").addClass("select");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b336b3bf5867480e950df0324084a6cf.png)



#### 删除class

**语法**

```
$(元素).removeClass("类名")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.select {
				color: red;
				font-weight: bold;
				background-color: yellow;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:nth-child(4)").removeClass("select");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li class="select">jQuery</li>
		</ul>
	</body>
</html>
```



#### 切换class

**语法**

```
$(元素).toggleClass("类名")
```

**说明**

`toggleClass()`方法用于检查元素是否有某个class。如果class不存在，则为元素添加该class；如果class已经存在，则为元素删除该class。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.select {
				color: red;
				font-weight: bold;
				background-color: yellow;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function() {
					$("li:nth-child(4)").toggleClass("select");
				});
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li class="select">jQuery</li>
		</ul>
		<input id="btn" type="button" value="切换">
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f448956d82744da8bc24f13f9b887607.png)



### 元素的宽高

在jQuery中，如果我们想要“获取”和“设置”元素的宽度和高度，共有3组方法：

- width() 和 height()
- innerWidth() 和 innerHeight()
- outerWidth() 和 outerHeight()

| 方法          | 范围                      |
| ------------- | ------------------------- |
| width()       | wdith                     |
| height()      | height                    |
| innerWidth()  | width + padding           |
| innerHeight() | height + padding          |
| outerWidth()  | width + padding + border  |
| outerHeight() | height + padding + border |

**语法**

```
$(元素).width() //获取元素宽度
$(元素).width(像素) //设置元素宽度
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box1,
			#box2 {
				width: 100px;
				height: 100px;
				border: 1px solid red;
				padding: 20px;
				margin: 30px;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var a = $("#box1").width()
				console.log(a); //100
				var b = $("#box1").innerWidth();
				console.log(b); //140
				var c = $("#box1").outerWidth();
				console.log(c); //142

				$("#box2").width(50);
			})
		</script>
	</head>
	<body>
		<div id="box1"></div>
		<div id="box2"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b79bd193edb445bdaed07bc2a91f6617.png)



### 元素的位置

在jQuery中，获取元素的位置有2种方法：

- offset()
- position()

#### offset()

在jQuery中，可以使用offset()方法获取和设置元素相对于当前文档（浏览器窗口）的偏移距离。

**语法**

```
$(元素).offset().top //相对于顶部距离
$(元素).offset().left //相对于左边距离
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				text-align: center;
			}

			div {
				width: 100px;
				height: 100px;
				display: inline-block;
			}

			#box1 {
				background-color: red;
			}

			#box2 {
				background-color: blue;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var top = $("#box2").offset().top;
				var left = $("#box2").offset().left
				console.log(top); //112
				console.log(left); //161
			})
		</script>
	</head>
	<body>
		<div id="box1"></div><br>
		<div id="box2"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f37d5fc442a473181d9219791f4adc7.png)



#### position()

**语法**

```
$(元素).position().top //相对于定位元素的顶部距离
$(元素).position().left //相对于定位元素的左边距离
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box1 {
				position: relative;
				width: 200px;
				height: 200px;
				background-color: red;
			}

			#box2 {
				position: absolute;
				top: 20px;
				left: 30px;
				width: 100px;
				height: 100px;
				background-color: blue;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var top = $("#box2").position().top;
				var left = $("#box2").position().left;
				console.log(top); //20
				console.log(left); //30
			})
		</script>
	</head>
	<body>
		<div id="box1">
			<div id="box2"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1274c798b9a41978a43fd3989ae146c.png)



#### scrollTop()

在jQuery中，可以使用`scrollTop()`方法来获取和设置元素相对于滚动条“顶边”的距离，也可以使用`scrollLeft()`方法来获取和设置元素相对于滚动条“左边”的距离。

**语法**

```
$(元素).scrollTop()
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				height: 1000px;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$(window).scroll(function() {
					var top = $(this).scrollTop();
					console.log(top);
				});
			})
		</script>
	</head>
	<body>
	</body>
</html>
```



## 内容操作

在jQuery中，有以下3种方法操作内容：

- html()
- text()
- val()

### html()

在jQuery中，可以使用`html()`方法来获取和设置一个元素中的“html内容”。所谓的html内容，指的是所有的内部元素以及文本。

jQuery中的`html()`方法和JavaScript中的`innerHTML`属性的效果是一样的。

**语法**

```
$(元素).html() //获取html内容
$(元素).html("html内容") //设置html内容
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
			$(function() {
				var a = $("#box1").html();
				console.log(a); //hello <strong>jQuery</strong>
				var str = "<strong style='color:red;'>hello world</strong>";
				$("#box2").html(str);
			})
		</script>
	</head>
	<body>
		<div id="box1">
			hello <strong>jQuery</strong>
		</div>
		<div id="box2"></div>
	</body>
</html>
```



### text()

在jQuery中，可以使用`text()`方法来获取和设置一个元素的“文本内容”。

jQuery的`text()`方法和JavaScript的`innerText`属性的效果是一样的。

**语法**

```
$(元素).text() //获取文本内容
$(元素).text("文本内容") //设置文本内容
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
			$(function() {
				var a = $("#box1").text();
				console.log(a); //hello jQuery
			})
		</script>
	</head>
	<body>
		<div id="box1">
			hello <strong>jQuery</strong>
		</div>
	</body>
</html>
```



### val()

表单元素和一般元素不太一样，它们的值都是通过value属性来定义的。因此，不能使用`html()`和`text()`这两个方法来获取表单元素的值。

在jQuery中，可以使用`val()`来获取和设置表单元素的值。

**语法**

```
$(元素).val() //获取值
$(元素).val("值内容") //设置值
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
			$(function() {
				$("#btn").click(function() {
					var value = $("#txt").val()
					$("#p1").text(value);
				});
			})
		</script>
	</head>
	<body>
		<input id="txt" type="text" value="hello">
		<input id="btn" type="button" value="获取">
		<p id="p1"></p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2da98fec58aa4991812a21a13e30d22d.png)

