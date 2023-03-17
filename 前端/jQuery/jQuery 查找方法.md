[TOC]

# jQuery 查找方法

| 查找祖先元素   | 查找后代元素 | 向前查找兄弟元素 | 向后查找兄弟元素 | 查找兄弟元素 |
| -------------- | ------------ | ---------------- | ---------------- | ------------ |
| parent()       | children()   | prev()           | next()           | siblings()   |
| parents()      | find()       | prevAll()        | nextAll()        |              |
| parentsUntil() | contents()   | prevUntil()      | nextUntil()      |              |



## 查找祖先元素

### parent()

**语法**

```
 $(元素).parent(选择器或省略)
```

**说明**

获取元素的父元素。

**不带参数时使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            table,
            tr,
            td {
                border: 1px solid red;
            }

            td {
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
            }
        </style>
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("td").hover(function() {
                    $(this).parent().css("background-color", "red");
                }, function() {
                    $(this).parent().css("background-color", "white");
                });
            })
        </script>
    </head>
    <body>
        <table>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
            </tr>
            <tr>
                <td>4</td>
                <td>5</td>
                <td>6</td>
            </tr>
            <tr>
                <td>7</td>
                <td>8</td>
                <td>9</td>
            </tr>
        </table>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/58ab6568eaa548e0b7c94fc0dcfa903f.gif)

**带参数时使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			tr,
			td {
				border: 1px solid red;
			}

			td {
				width: 40px;
				height: 40px;
				line-height: 40px;
				text-align: center;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("td").hover(function() {
					$(this).parent(".select").css("background-color", "red");
				}, function() {
					$(this).parent(".select").css("background-color", "white");
				});
			})
		</script>
	</head>
	<body>
		<table>
			<tr>
				<td>1</td>
				<td>2</td>
				<td>3</td>
			</tr>
			<tr class="select">
				<td>4</td>
				<td>5</td>
				<td>6</td>
			</tr>
			<tr>
				<td>7</td>
				<td>8</td>
				<td>9</td>
			</tr>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/55049213c69b4d0e802feb477218c2eb.gif)



### parents()

**语法**

```
$(元素).parents(选择器或省略)
```

**说明**

获取元素的祖先元素，返回一个jQuery对象集合。

**带参数使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var parents = $("span").parents();
				var result = [];
				$.each(parents, function() {
					var tagName = this.tagName.toLowerCase();
					result.push(tagName);
				});
				console.log(result.join(",")); //strong,p,div,body,html
			})
		</script>
	</head>
	<body>
		<div>
			<p>
				<strong>
					<span>hello world</span>
				</strong>
			</p>
		</div>
	</body>
</html>
```

**不带参数使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var parents = $("span").parents(".b");
				console.log(parents.get(0).tagName); //p
			})
		</script>
	</head>
	<body>
		<div class="a">
			<p class="b">
				<strong class="c">
					<span class="d">hello world</span>
				</strong>
			</p>
		</div>
	</body>
</html>
```



### parentsUntil()

**语法**

```
$(元素).parentsUntil(选择器)
```

**说明**

获取指定范围内的祖先元素。

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
				var parents = $("span").parentsUntil(".a");
				var result = [];
				$.each(parents, function() {
					var tagName = this.tagName.toLowerCase();
					result.push(tagName);
				});
				console.log(result); //["strong", "p"]
			})
		</script>
	</head>
	<body>
		<div class="a">
			<p class="b">
				<strong class="c">
					<span class="d">hello world</span>
				</strong>
			</p>
		</div>
	</body>
</html>
```



## 查找后代元素

### children()

**语法**

```
$(元素).children(选择器)
```

**说明**

查找符合条件的子元素。

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
				var children = $("#wrap").children(".select");
				children.each(function(index, e) {
					$(this).css("color", "red");
				});
			})
		</script>
	</head>
	<body>
		<div id="wrap">
			<p>子元素</p>
			<p class="select">子元素</p>
			<div>
				<p>孙子元素</p>
				<p class="select">孙子元素</p>
			</div>
			<p>子元素</p>
			<p class="select">子元素</p>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4285e2a6c0d042fca01fc4e2cada913e.png)



### find()

**语法**

```
$(元素).find(选择器或省略)
```

**说明**

查找符合条件的后代元素。

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
				var children = $("#wrap").find(".select");
				children.each(function(index, e) {
					$(this).css("color", "red");
				});
			})
		</script>
	</head>
	<body>
		<div id="wrap">
			<p>子元素</p>
			<p class="select">子元素</p>
			<div>
				<p>孙子元素</p>
				<p class="select">孙子元素</p>
			</div>
			<p>子元素</p>
			<p class="select">子元素</p>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c0bad39a2ad34153a97fd2d3a31e04f6.png)



### contents()

在jQuery中，可以使用`contents()`方法来获取子元素及其内部文本。`contents()`方法和`children()`方法相似，不同的是，`contents()`返回的jQuery对象中不仅包含子元素，还包含文本内容；而`children()`方法返回的jQuery对象中只会包含子元素，不包含文本内容。

在实际开发中，我们极少会用到`contents()`方法。



## 向前查找兄弟元素

### prev()

**语法**

```
$(元素).prev()
```

**说明**

查找前面的相邻的兄弟元素。

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
				$("#js").prev().css("color", "red");

			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/83dc4c3f02f34b6790cbd89be31472d4.png)



### prevAll()

**语法**

```
$(元素).prevAll(选择器或省略)
```

**说明**

查找前面所有的兄弟元素。

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
				$("#js").prevAll().css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/41e4bbbb122c4f7aa6a856905ce61474.png)



### prevUnitl()

**语法**

```
$(元素).prevUntil(选择器)
```

**说明**

在jQuery中，`prevUntil()`方法是对`prevAll()`方法的一个补充，它可以查找元素前面“指定范围”中所有的兄弟元素，相当于在`prevAll()`方法返回的集合中截取一部分。

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
				$("#js").prevUntil("#end").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li id="end">HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/29e28f33093845d2b6e051096680c980.png)



## 向后查找兄弟元素

### next()

**语法**

```
$(元素).next()
```

**说明**

查找后面的相邻的兄弟元素。

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
				$("#js").next().css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li id="end">HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/de85dcffe31e4bc8b364118e307eee81.png)



### nextAll()

**语法**

```
$(元素).nextAll(选择器或省略)
```

**说明**

选择后面所有的兄弟元素。

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
				$("#js").nextAll().css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li id="end">HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff6923119ade4ad49aa751313213e38c.png)



### nextUntil()

**语法**

```
$(元素).nextUntil(选择器或省略)
```

**说明**

选择后面符合条件的兄弟元素。

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
				$("#js").nextUntil().css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
			<li id="end">React</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a0b8738404884e4bb4cbfaafccab1dc6.png)



## 查找所有兄弟元素

### siblings()

**语法**

```
$(元素).siblings(选择器或省略) 
```

**说明**

查找所有兄弟元素。

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
				$("#js").siblings().css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
			<li>React</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1628ebb045be490fb2e05ec1509a45c5.png)

**无参使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#js").siblings(".select").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li class="select">HTML</li>
			<li>CSS</li>
			<li id="js">JavaScript</li>
			<li>jQuery</li>
			<li class="select">Vue</li>
			<li>React</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c885fbd682214c4f89d7978b28ecfad2.png)

