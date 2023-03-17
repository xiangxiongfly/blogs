[TOC]

# jQuery 选择器

## 元素选择器

**语法**

```
$("元素名")
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
				$("div").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div>hello1</div>
		<p>hellp2</p>
		<div>hello3</div>
		<span>hello4</span>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a15d37a9ed434e999a59894ffe02584b.png)



## id选择器

**语法**

```
$("#id名")
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
				$("#myid").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div>hello1</div>
		<p id="myid">hellp2</p>
		<div>hello3</div>
		<span>hello4</span>
	</body>
</html>
```



## class选择器

**语法**

```
$(".类名")
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
				$(".myclass").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div>hello1</div>
		<p class="myclass">hellp2</p>
		<div>hello3</div>
		<span>hello4</span>
	</body>
</html>
```



## 并集选择器

**语法**

```
$("选择器1,选择器2,...")
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
				$("div,p,span").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div>hello1</div>
		<p>hellp2</p>
		<div>hello3</div>
		<span>hello4</span>
	</body>
</html>
```



## 后代选择器

**语法**

```
$("M N")
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
				$("#box1 div").css("color", "red");
				$("#box2 span").css("color", "blue");
			})
		</script>
	</head>
	<body>
		<div id="box1">
			<div>HTML</div>
			<div>CSS</div>
		</div>
		<div id="box2">
			<p>hello</p>
			<p>world</p>
			<span>hi</span>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b01227e40dae4b2d9acfcd2b9c7223ed.png)



## 子代选择器

**语法**

```
$("M>N")
//等价
$(M).find(M)
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
				$("#one>p").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div id="one">
			<p>子元素1</p>
			<p>子元素2</p>
			<div id="two">
				<p>孙子元素1</p>
				<p>孙子元素2</p>
			</div>
			<p>子元素3</p>
			<p>子元素4</p>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d415efc3deb48e388749267ae687df7.png)



## 兄弟选择器

**语法**

```
$("M~N")
//等价
$(M).children(N)
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
				$("#two~p").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div id="one">
			<p>子元素1</p>
			<p>子元素2</p>
			<div id="two">
				<p>孙子元素1</p>
				<p>孙子元素2</p>
			</div>
			<p>子元素3</p>
			<p>子元素4</p>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/207e394619a0495f9e55af1b0e8ac855.png)



## 相邻选择器

**语法**

```
$("M+N")
//等价
$(M).next(N)
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
				$("#two+p").css("color", "red");
			})
		</script>
	</head>
	<body>
		<div id="one">
			<p>子元素1</p>
			<p>子元素2</p>
			<div id="two">
				<p>孙子元素1</p>
				<p>孙子元素2</p>
			</div>
			<p>子元素3</p>
			<p>子元素4</p>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8e2ab0ce875e48d3b808e7cd53b73f4f.png)



## 属性选择器

| 选择器            | 说明                                                     |
| ----------------- | -------------------------------------------------------- |
| E[attr]           | 选择元素E，其中E元素必须有attr属性                       |
| E[attr="value"]   | 选择元素E，其中E元素的attr属性值是”value“                |
| E[attr!="value"]  | 选择元素E，其中E元素的attr属性值不是”value“              |
| E[attr^="value"]  | 选择元素E，其中E元素的attr属性值以”value“开头的任意数据  |
| E[attr$="value"]  | 选择元素E，其中E元素的attr属性值以”value“结尾的任意数据  |
| E[attr*="value"]  | 选择元素E，其中E元素的attr属性值包含”value“的任意数据    |
| E[attr\|="value"] | 选择元素E，其中E元素的attr属性值等于”value“或”value“开头 |
| E[attr~="value"]  | 选择元素E，其中E元素的attr属性值等于”value“或包含”value“ |



## 伪类选择器

### 位置选择器

| 选择器 | 说明                                            |
| ------ | ----------------------------------------------- |
| :first | 选取某种元素的第一个元素                        |
| :last  | 选取某种元素的最后一个元素                      |
| :odd   | 选取某种元素中序号为奇数的所有元素，序号从0开始 |
| :even  | 选取某种元素中序号为偶数的所有元素，序号从0开始 |
| :eq(n) | 选取某种元素的第n个元素，序号从0开始            |
| :lt(n) | 选取某种元素中小于n的所有元素，序号从0开始      |
| :gt(n) | 选取某种元素中大于n的所有元素，序号从0开始      |

**li:first,li:last**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:first,li:last").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e16b473287fa4fba9973e56324bf395e.png)

**li:odd**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:odd").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4d117f0457948ddab28186d2b6348f7.png)

**li:eq(n)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:eq(3)").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9aa7c55e56d44adab451e449f6d3a6c0.png)

**li:lt(n)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:lt(3)").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bba27c6ccd05490386270fdbd5e5add3.png)



### 子元素选择器

| 选择器           | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| E:first-child    | 选择父元素下的第一个子元素                                   |
| E:last-child     | 选择父元素下的最后一个子元素                                 |
| E:nth-child(n)   | 选择父元素下的第n个子元素或奇偶元素，n取值：数字、odd、even，n从1开始 |
| E:only-child     | 如果父元素只有一个子元素，就选择该子元素                     |
| E:first-of-type  | 选择父元素下的第一个E类型的子元素                            |
| E:last-of-type   | 选择父元素下的最后一个E类型的子元素                          |
| E:nth-of-type(n) | 选择父元素下的第n个E类型的子元素或奇偶元素，n取值：数字、odd、even，n从1开始 |
| E:only-of-type   | 父元素可以有多个子元素，选择父元素下唯一的E类型的子元素      |

**ul li:first-child 和 li:last-child**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("ul li:first-child,li:last-child").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc2078f961174397968a5886a3065305.png)

**ul li:nth-child(odd) 和 ul li:nth-child(even)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("ul li:nth-child(odd)").css("background-color", "grey");
				$("ul li:nth-child(even)").css("background-color", "white");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7238d379d06640e39d625577ac872152.png)

**li:first-of-type 和 li:last-of-type**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("ul li:first-of-type,li:last-of-type").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<span>aaaa</span>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
			<span>bbbb</span>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/46d682d917dc48428a3a3aed04cae5ed.png)

**li:nth-of-type(odd)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("ul li:nth-of-type(odd)").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<span>aaaa</span>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
			<span>bbbb</span>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4968e0a2aed845d890db5a517727201d.png)



### 可见性选择器

| 选择器   | 说明                                     |
| -------- | ---------------------------------------- |
| :visible | 选取所有可见元素                         |
| :hidden  | 选取所有不可见元素，指`display:none`元素 |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#visible-btn").click(function() {
					$("li:hidden").css("display", "block");
				});
				$("#hidden-btn").click(function() {
					$("li:visible").css("display", "none");
				});
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
		<input id="visible-btn" type="button" value="显示">
		<input id="hidden-btn" type="button" value="隐藏">
	</body>
</html>
```



### 内容选择器

| 选择器          | 说明                             |
| --------------- | -------------------------------- |
| :contains(文本) | 选取包含指定文本的元素           |
| :has(选择器)    | 选取包含指定选择器的元素         |
| :empty          | 选取空元素，即不含有文本或子元素 |
| :parent         | 选取含有文本或子元素的元素       |

**:contains(文本)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:contains(jQuery)").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>hello HTML</li>
			<li>hello CSS</li>
			<li>hello JavaScript</li>
			<li>hello jQuery</li>
			<li>hello Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/214a6c7f45bd44ae8cbeb630e774d9eb.png)

**:has(选择器)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("div:has(span)").css("background-color", "red");
			})
		</script>
	</head>
	<body>
		<div>
			<p>这是一个段落</p>
		</div>
		<div>
			<p>这是一个段落</p>
			<span>这是一个span</span>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a3672595a6ba4e9390b9fd69ac649b52.png)

**:empty**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			td {
				border: 1px solid silver;
			}

			td {
				width: 60px;
				height: 60px;
				line-height: 60px;
				text-align: center;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("td:empty").css("background-color", "red");
			})
		</script>
	</head>
	<body>
		<table>
			<tr>
				<td>2</td>
				<td>4</td>
				<td>8</td>
			</tr>
			<tr>
				<td>16</td>
				<td>32</td>
				<td>64</td>
			</tr>
			<tr>
				<td>128</td>
				<td>256</td>
				<td></td>
			</tr>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/114f7fafdb094ebbaf7ffb81b98e39a4.png)

**:parent**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			td {
				border: 1px solid silver;
			}

			td {
				width: 60px;
				height: 60px;
				line-height: 60px;
				text-align: center;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("td:parent").css("background-color", "red");
			})
		</script>
	</head>
	<body>
		<table>
			<tr>
				<td>2</td>
				<td>4</td>
				<td>8</td>
			</tr>
			<tr>
				<td>16</td>
				<td>32</td>
				<td>64</td>
			</tr>
			<tr>
				<td>128</td>
				<td>256</td>
				<td></td>
			</tr>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/00707d0992734ba5890debd0a1d2be01.png)



### 表单选择器

| 选择器    | 说明                                          |
| --------- | --------------------------------------------- |
| :input    | 选取所有input元素                             |
| :button   | 选取所有button元素，即`<input type="button">` |
| :submit   | 选取所有submit元素                            |
| :reset    | 选取所有reset元素                             |
| :text     | 选取所有单行文本框                            |
| :textarea | 选取所有多行文本框                            |
| :password | 选取所有密码文本框                            |
| :radio    | 选取所有单选框                                |
| :checkbox | 选取所有复选框                                |
| :image    | 选取所有图片域                                |
| :file     | 选取所有文件域                                |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("input:checkbox").attr("checked", true);
			})
		</script>
	</head>
	<body>
		<div>
			性别：
			<label><input type="radio" name="gendar">男</label>
			<label><input type="radio" name="gendar">女</label>
		</div>
		<div>
			水果：
			<label><input type="checkbox" name="fruit">苹果</label>
			<label><input type="checkbox" name="fruit">菠萝</label>
			<label><input type="checkbox" name="fruit">西瓜</label>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e0b78cc759c4422c8ce7e19f9f2815d0.png)



### 表单属性选择器

| 选择器     | 说明                                           |
| ---------- | ---------------------------------------------- |
| :checked   | 选取所有被选中的表单元素，一般指单选框和复选框 |
| :selected  | 选取被选中的表单元素的选项，一般指下拉列表     |
| :enabled   | 选取所有可用的表单元素                         |
| :disabled  | 选取所有不可用的表单元素                       |
| :read-only | 选取所有只读的表单元素                         |
| :focus     | 选取所有获取焦点的表单元素                     |

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                var len = $("input:checked").length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push($("input:checked")[i].value);
                }
                console.log(arr); //["橘子", "香蕉"]
            })
        </script>
    </head>
    <body>
        <div>
            水果：
            <label><input type="checkbox" name="fruit" value="苹果">苹果</label>
            <label><input type="checkbox" name="fruit" value="橘子" checked>橘子</label>
            <label><input type="checkbox" name="fruit" value="香蕉" checked>香蕉</label>
        </div>
    </body>
</html>
```



### 其他伪类选择器

| 选择器       | 说明                           |
| ------------ | ------------------------------ |
| :not(选择器) | 选取除指定选择器以外的所有元素 |
| :animated    | 选取正在执行动画的元素         |
| :root        | 选取页面根元素，即html元素     |
| :header      | 选取h1~h6的标题元素            |
| :target      | 选取锚点元素                   |
| :lang(语言)  | 选取特定语言的元素             |

**:not(选择器)**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li:not(#select)").css("color", "red");
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li id="select">jQuery</li>
			<li>Vue.js</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/77ade83165074ab6877506f78f07012a.png)



