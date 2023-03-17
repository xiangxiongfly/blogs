[TOC]

# jQuery 过滤方法

| 过滤方法   | 说明               |
| ---------- | ------------------ |
| hasClass() | 类名过滤           |
| eq()       | 下标过滤           |
| is()       | 判断过滤           |
| not()      | 反向过滤           |
| filter()   | 表达式过滤         |
| has()      | 表达式过滤后代元素 |



## hasClass() 类名过滤

**语法**

```
$(元素).hasClass("了类名")
```

**说明**

判断元素是否包含指定类名。

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
				$("li").each(function(index) {
					var b = $(this).hasClass("select");
					if (b) {
						$(this).css("color", "red");
					}
				})
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/7eb5eae831b34c9caebf681a26e76ec4.png)



## eq() 下标过滤

**语法**

```
$(元素).eq(n)
```

**说明**

n是一个整数。当n取值为0或正整数时，eq(0)获取的是第1个元素，eq(1)获取的是第2个元素，……，以此类推。当n取值为负整数时，eq(-1)获取的是倒数第1个元素，eq(-2)获取的是倒数第2个元素，……，以此类推。

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
				$("li").eq(3).css("color", "red");
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/3484f9274a46455197f511c201437acb.png)



## is() 判断过滤

**语法**

```
$(元素).is(选择器)
```

**说明**

判断元素集合是否存在符合条件的元素。

is()方法非常好用，能不能用好也直接决定你的代码是否高效。使用jQuery进行开发，没有做不到的，只有想不到的。下面列出的是is()方法的常用功能代码。

**举例**

```html
//元素是否可见
$().is(":visible")

//元素是否在动画中
$().is(":animated")

//单选框或复选框是否被选中
$().is(":checked")

//元素是否为第一个子元素
$(this).is(":first-child")

//文本是否包含指定内容
$().is(":contains('hello')")

//元素是否包含类名
$().is(".select")
```

**复选框选中**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#selectAll").change(function() {
					var b = $(this).is(":checked");
					if (b) {
						$(".fruit").prop("checked", true);
					} else {
						$(".fruit").prop("checked", false);
					}
				});
			})
		</script>
	</head>
	<body>
		<p>
			<label><input id="selectAll" type="checkbox">全选/反选</label>
		</p>
		<label><input class="fruit" type="checkbox" value="苹果">苹果</label>
		<label><input class="fruit" type="checkbox" value="香蕉">香蕉</label>
		<label><input class="fruit" type="checkbox" value="西瓜">西瓜</label>
	</body>
</html>
```

**是否包含类名**

判断元素是否存在某个类名，我们有两种方法：一种是hasClass()方法，另一种是is()方法。在实际开发中，建议优先使用hasClass()方法。主要是从查找速度来看，hasClass()方法远远优于is()方法。造成二者查找速度存在差异的原因很简单，is()方法封装的东西比hasClass()方法封装的多得多，运行速度肯定也慢得多。

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
					var b = $(this).is(".select");
					if (b) {
						$(this).css("color", "red");
					}
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
	</body>
</html>
```



## not() 反向过滤

**语法**

```
$(元素).not(选择器或函数)
```

**说明**

当not()方法参的数是一个选择器时，表示使用选择器来过滤不符合条件的元素，然后选取其余元素。

当not()方法的参数是一个函数时，表示使用函数来过滤不符合条件的元素，然后选取其余元素。

**选择器使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").not(".select").css("color", "red");
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/f309cdddd2f048c584c841d11ee3d86c.png)

**函数使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").not(function() {
					return $(this).text() == "jQuery"
				}).css("color", "red");
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/546414d28f76479d946390694b7768c1.png)



## filter() 表达式过滤

**语法**

```
$(元素).filter(选择器或函数)
```

**选择器使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").filter(".select").css("color", "red");
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/fad5db172cbb435c81d9dc71a1e7ca56.png)

**函数使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").filter(function() {
					return $(this).text() == "jQuery";
				}).css("color", "red");
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/d7847f4e7378437a83d48ebd262fccc9.png)



## has() 表达式过滤后代元素

**语法**

```
$(元素).has(选择器)
```

**说明**

`has()`方法与`filter()`方法功能相似，不过`has()`方法只能使用选择器来过滤，不能使用函数来过滤。因此我们可以把`has()`方法看成是`filter()`方法的精简版。

`has()`方法虽然没有`filter()`方法那么强大，但是它的运行速度更快。

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
				$("li").has("span").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li><span>jQuery</span></li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a57df95d44244f49aa38d645a01dacef.png)



