
[TOC]

#  JavaScript DOM

## 概述

DOM（Document Object Model，文档对象模型），它是由W3C定义的一个标准。

DOM提供了很多API，可以通过它操作网页中的元素，如改变颜色、点击效果、删除元素等。

我们在操作元素时，其实就是把这个元素看成一个对象，然后使用这个对象的属性和方法来进行相关操作。



## DOM结构

DOM采用树状结构，每一个树节点都对应页面中的元素。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>head>
    <body>
        <h1>hello</h1>
        <p>HTML</p>
        <p>CSS</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fd912b975c345729a0eaec70f46b922.png)



## 节点类型

在JavaScript中，DOM节点共有12种类型，常见4种如下：

- 文档节点。
- 元素节点。
- 属性节点。
- 文本节点。

```html
<div id="wrapper">hello world</div>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ca27d9d9aac49979b229a518db385b9.png)

### 元素和节点的关系

JavaScript会把元素、属性、文本当作不同的节点处理。表示元素的叫做“元素节点”，表示属性的叫做“属性没电”，表示文本的叫做“文本节点”。

总而言之，节点和元素是不一样的概念，节点是包括元素的。

属性节点和文本节点看起来像是元素节点的一部分，其实他们是独立的，不属于元素节点。

只有元素节点才可以拥有子节点，属性节点和文本节点都没有。

### 节点对应nodeType值

| 节点类型 | nodeName  | nodType | nodeValue |
| -------- | --------- | ------- | --------- |
| 文档节点 | #document | 9       | null      |
| 元素节点 | 标签名    | 1       | null      |
| 文本节点 | #text     | 3       | hello     |
| 属性节点 | 属性名    | 2       | 属性值    |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {

				//文档节点
				console.log(document.nodeName); //#document
				console.log(document.nodeType); //9
				console.log(document.nodeValue); //null

				//元素节点
				var div1 = document.getElementById("myid");
				console.log(div1.nodeName); //DIV
				console.log(div1.nodeType); //1
				console.log(div1.nodeValue); //null

				//文本节点
				var id1 = div1.childNodes[0];
				console.log(id1.nodeName); //#text
				console.log(id1.nodeType); //3
				console.log(id1.nodeValue); //hello

				//属性节点
				var attr1 = div1.attributes[0]
				console.log(attr1.nodeName); //id
				console.log(attr1.nodeType); //2
				console.log(attr1.nodeValue); //myid
			}
		</script>
	</head>
	<body>
		<div id="myid">hello</div>
	</body>
</html>
```



## 操作元素

### 获取元素

在JavaScript中，可以通过以下方法获取元素:

- getElementById()：通过id获取元素。
- getElementsByTagName()：通过标签名获取元素。
- getElementsByClassName()：通过类名获取元素。
- getElementsByName()：通过name值获取元素。
- querySelector()：通过CSS选择器获取第1个元素。当页面只有一个元素时，getElementById()效率更高。
- querySelectorAll()：通过CSS选择器获取所有元素。
- document.title 和 document.body：一个页面只有一个title元素和一个body元素。

#### getElementById()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var div = document.getElementById("div1");
				div.style.color = "red";
			}
		</script>
	</head>
	<body>
		<div id="div1">hello world</div>
	</body>
</html>
```

#### getElementsByTagName()

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script>
            window.onload = function() {
                var lis = document.getElementsByTagName("li");
                lis[1].style.color = "red";
            }
        </script>
    </head>
    <body>
        <ul>
            <li>html</li>
            <li>css</li>
            <li>javascript</li>
        </ul>
    </body>
</html>
```

#### getElementById() 和 getElementsByTagName() 区别

- getElementBy()只能获取1个元素，不支持动态创建的DOM元素，并且前面只能用docuemnt。
- getElementsByTagName()可以获取多个元素，支持动态创建的DOM元素，前面不仅可以用document还能用其他DOM对象。

#### getElementsByClassName()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var lis = document.getElementsByClassName("select");
				for (var i = 0; i < lis.length; i++) {
					lis[i].style.color = "red";
				}
			}
		</script>
	</head>
	<body>
		<ul>
			<li>html</li>
			<li class="select">css</li>
			<li>javascript</li>
			<li class="select">jquery</li>
		</ul>
	</body>
</html>
```

#### querySelector()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var li = document.querySelector("li");
				li.style.color = "red";
			}
		</script>
	</head>
	<body>
		<ul>
			<li>html</li>
			<li>css</li>
			<li>javascript</li>
			<li>jquery</li>
		</ul>
	</body>
</html>
```

#### querySelectorAll()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var lis = document.querySelectorAll("li");
				for (var i = 0; i < lis.length; i++) {
					lis[i].style.color = "red";
				}
			}
		</script>
	</head>
	<body>
		<ul>
			<li>html</li>
			<li>css</li>
			<li>javascript</li>
			<li>jquery</li>
		</ul>
	</body>
</html>
```

#### getElementsByName()

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var inputs = document.getElementsByName("level");
				inputs[1].checked = true;
			}
		</script>
	</head>
	<body>
		<label><input type="radio" name="level">一级</label>
		<label><input type="radio" name="level">二级</label>
		<label><input type="radio" name="level">三级</label>
	</body>
</html>
```

#### document.title 和 document.body

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				document.title = "hello world!";
				document.body.innerHTML = "<strong>hello DOM</strong>";
			}
		</script>
	</head>
	<body>
	</body>
</html>
```



### 创建元素

| 创建元素方法     | 说明         |
| ---------------- | ------------ |
| createElement()  | 创建元素节点 |
| createTextNode() | 创建文本节点 |

#### 创建简单元素

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script>
            window.onload = function() {
                var content = document.getElementById("content");
                var oStrong = document.createElement("strong");
                var oText = document.createTextNode("hello world");
                oStrong.appendChild(oText);
                content.appendChild(oStrong);
            }
        </script>
    </head>
    <body>
        <div id="content"></div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b105f806c9114e5e90bc7b1b9178f6dd.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ea2144f621b548cabc09a526d50cbf96.png)

#### 创建复杂元素，带属性

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oImg = document.createElement("img");
				oImg.className = "pic";
				oImg.src = "img/apple_pic.png";
				oImg.style.border = "1px dashed red";
				document.body.appendChild(oImg);
			}
		</script>
	</head>
	<body>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8b5d65db05e741e6a1c86ed70b96cddd.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2e6e9103777b4ada86fabf4edf498e14.png)



#### 创建多个元素

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style>
            table {
                border-collapse: collapse;
            }

            td {
                width: 80px;
                height: 20px;
                border: 1px solid red;
            }
        </style>
        <script>
            window.onload = function() {
                var textArr = ["HTML", "CSS", "JavaScript", "jQuery", "Vue", "React", "Java", "Android", "iOS"];
                var oTable = document.createElement("table");
                for (var i = 0; i < 3; i++) {
                    var oTr = document.createElement("tr");
                    for (var j = 0; j < 3; j++) {
                        var oTd = document.createElement("td");
                        var text = document.createTextNode(textArr[i * 3 + j])
                        oTd.appendChild(text);
                        oTr.appendChild(oTd);
                    }
                    oTable.appendChild(oTr);
                }
                document.body.appendChild(oTable);
            }
        </script>
    </head>
    <body>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d80c28e54c44431398b3e3db572c242d.png)



### 插入元素

插入元素可以通过以下方法：

- appendChild()：
- insertBefore()：

#### appendChild()

将子元素插入父元素的内部的末尾。

**语法**

```
父元素.appendChild(子元素)
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
				var oUl = document.getElementsByTagName("ul")[0];

				var li1 = document.createElement("li");
				var text1 = document.createTextNode("JavaScript");
				li1.appendChild(text1);

				var li2 = document.createElement("li");
				var text2 = document.createTextNode("jQuery");
				li2.appendChild(text2);

				oUl.appendChild(li1);
				oUl.appendChild(li2);
			}
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3c95d51a7bb8495eba46f15e21567a29.png)



#### insertBefore()

将子元素插入父元素内的某一个元素的前面。

**语法**

```
父元素.insertBefore(新子元素, 子元素)
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
                var oUl = document.getElementsByTagName("ul")[0];

                var firstChild = document.getElementsByTagName("li")[0];

                var newLi = document.createElement("li");
                var text = document.createTextNode("JavaScript");
                newLi.appendChild(text);

                oUl.insertBefore(newLi, firstChild);
            }
        </script>
    </head>
    <body>
        <ul>
            <li>HTML</li>
            <li>CSS</li>
        </ul>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5b3f4888d10744ed84d2866165127209.png)

#### 移动节点

可以借助`appendChild()`方法移动节点。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var lis = document.getElementsByTagName("li");
				var li1 = lis[1];
				var li3 = lis[3];
				li3.appendChild(li1);
			}
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c06dff247e94955b2faa72277f160cf.png)



### 删除元素

#### removeChild()

删除子元素。

**语法**

```
父元素.removeChild(子元素)
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
				var oUl = document.getElementsByTagName("ul")[0];
				var deleteLi = document.getElementsByTagName("li")[1];
				oUl.removeChild(deleteLi);
			}
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/64be351ed48a4068b1dcf0f715b67a0b.png)



### 复制元素

#### cloneNode()

**语法**

```
元素.cloneNode(取值)
```

**取值**

| 值       | 说明                 |
| -------- | -------------------- |
| true或1  | 复制元素和所有子元素 |
| false或0 | 只复制元素本身       |

**说明**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oUl = document.getElementById("list");
				var newUl = oUl.cloneNode(true);
				document.body.appendChild(newUl);
			}
		</script>
	</head>
	<body>
		<ul id="list">
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/596ced89f9bf45a1ac856b33536a7c36.png)



### 替换元素

#### replaceChild()

**语法**

```
父元素.replaceChild(新子元素, 旧子元素)
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
				var oldTag = document.querySelector("#div1");
				var newTag = document.createElement("h1");
				var txt = document.createTextNode("hello DOM");
				newTag.appendChild(txt);
				document.body.replaceChild(newTag, oldTag);
			}
		</script>
	</head>
	<body>
		<div id="div1">hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9c0f9780c5a44316a84dcc158c33a909.png)



### 获取父元素

#### parentNode

**语法**

```
DOM对象.parentNode
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table {
				border-collapse: collapse;
			}

			table,
			tr,
			td {
				border: 1px solid red;
			}
		</style>
		<script>
			window.onload = function() {
				var tds = document.getElementsByTagName("td");
				for (var i = 0; i < tds.length; i++) {
					tds[i].onclick = function() {
						var oParent = this.parentNode;
						oParent.style.backgroundColor = "green";
						oParent.style.color = "white";
					}
				}
			}
		</script>
	</head>
	<body>
		<table>
			<tr>
				<td>小明</td>
				<td>100</td>
				<td>100</td>
				<td>70</td>
			</tr>
			<tr>
				<td>小白</td>
				<td>90</td>
				<td>95</td>
				<td>98</td>
			</tr>
			<tr>
				<td>小花</td>
				<td>80</td>
				<td>80</td>
				<td>88</td>
			</tr>
		</table>
	</body>
</html>
```

注：点击td单元格，它的父元素也就是tr元素，会修改文字颜色和背景颜色。



### 获取子元素

可以通过一下方式获取子元素：

- childNodes：获取所有子节点。
- firstChild：获取第一个子节点。
- lastChild：获取最后一个子节点。
- children：获取所有子元素。
- firstElementChild：获取第一个子元素节点。
- lastElementChild：获取最后一个子元素节点。

#### childNodes 和 children 区别

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oUl = document.getElementsByTagName("ul")[0];
				console.log(oUl.childNodes.length); //7
				console.log(oUl.children.length); //3

				var c1 = oUl.childNodes;
				var c2 = oUl.children;
				console.log(c1); //[text, li, text, li, text, li, text]
				console.log(c2); //[li, li, li]
			}
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

说明：

- childNodes：获取所有子节点，包含3个元素节点和4个文本节点。
- children：获取所有子元素，只有3个元素节点。

#### firstChild 和 firstElementChild 区别

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oUl = document.getElementsByTagName("ul")[0];
				console.log(oUl.firstChild); //#text
				console.log(oUl.firstElementChild); //<li>
			}
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

说明：

- firstChild：ul元素里存在换行符，所以获取的第一个子节点是文本节点。
- firstElementChild：获取第一个子元素节点。



### 获取兄弟元素

- previousSibling：获取前一个兄弟节点。
- nextSlibing：获取后一个兄弟节点。
- previousElementSlibing：获取前一个兄弟元素节点。
- nextElementSlibing：获取后一个兄弟元素节点。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oLi = document.getElementsByTagName("li")[0];
				console.log(oLi.nextSibling); //#text
				console.log(oLi.nextElementSibling); //<li>
			}
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



## HTML属性操作

### 对象属性

#### 获取HTML属性值

**语法**

```
DOM对象.属性
```

**获取DOM对象的属性值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oInput = document.createElement("input");
				oInput.id = "submit";
				oInput.type = "button";
				oInput.value = "提交";
				document.body.appendChild(oInput);

				oInput.onclick = function() {
					console.log(oInput.id); //submit
					console.log(oInput.type); //button
					console.log(oInput.value); //提交
				};
			}
		</script>
	</head>
	<body>
	</body>
</html>
```

**获取输入框的值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var txt = document.getElementById("txt");
				var btn = document.getElementById("btn");
				btn.onclick = function() {
					console.log(txt.value);
				}
			}
		</script>
	</head>
	<body>
		<input type="text" id="txt">
		<input type="button" id="btn" value="获取">
	</body>
</html>
```

**获取单选框和复选框的值**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script>
            window.onload = function() {
                var btn = document.getElementById("btn");
                var hobbys = document.getElementsByName("hobby");
                var fruits = document.getElementsByName("fruit");
                btn.onclick = function() {
                    var hobbyStr = "";
                    for (var i = 0; i < hobbys.length; i++) {
                        if (hobbys[i].checked) {
                            hobbyStr += hobbys[i].value;
                        }
                    }
                    console.log(hobbyStr);

                    var fruitStr = "";
                    for (var i = 0; i < fruits.length; i++) {
                        if (fruits[i].checked) {
                            fruitStr += fruits[i].value;
                        }
                    }
                    console.log(fruitStr);
                }
            }
        </script>
    </head>
    <body>
        <div>
            <p>兴趣：</p>
            <label><input type="radio" name="hobby" value="篮球">篮球</label>
            <label><input type="radio" name="hobby" value="足球">足球</label>
        </div>
        <div>
            <p>水果：</p>
            <label><input type="checkbox" name="fruit" value="苹果">苹果</label>
            <label><input type="checkbox" name="fruit" value="香蕉">香蕉</label>
            <label><input type="checkbox" name="fruit" value="橘子">橘子</label>
        </div>
        <div>
            <input type="button" value="获取" id="btn">
        </div>
    </body>
</html>
```

**获取下拉菜单的值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var select = document.getElementById("select");
				btn.onclick = function() {
					console.log(select.value);
				}
			}
		</script>
	</head>
	<body>
		<div>
			<select id="select">
				<option value="html">HTML</option>
				<option value="css">CSS</option>
				<option value="javascript">JavaScript</option>
				<option value="jquery">jQuery</option>
				<option value="vue">Vue</option>
			</select>
		</div>
		<div>
			<input type="button" value="获取" id="btn">
		</div>
	</body>
</html>
```

#### 设置HTML属性值

**语法**

```
DOM对象.属性 = "属性值"
```

**修改value属性**

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
					btn.value = "hello world";
				}
			}
		</script>
	</head>
	<body>
		<input type="button" value="修改" id="btn">
	</body>
</html>
```

**修改src属性**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var pic = document.getElementById("pic");
				var flag = true;
				btn.onclick = function() {
					flag = !flag;
					pic.src = flag ? "img/apple_pic.png" : "img/banana_pic.png";
				}
			}
		</script>
	</head>
	<body>
		<img id="pic" src="img/apple_pic.png">
		<input type="button" value="修改" id="btn">
	</body>
</html>
```



### 对象方法

对象方法有4种：

- getAttribute()：获取属性值。
- setAttribute()：设置属性值。
- removeAttribute()：删除属性。
- hasAttribute()：是否有属性。

#### getAttribute()

**语法**

```
DOM对象.getAttribute("属性")
```

**获取固定属性值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var txt = document.getElementById("txt");
				btn.onclick = function() {
					var value = txt.getAttribute("id");
					console.log(value);
				}
			}
		</script>
	</head>
	<body>
		<input type="text" id="txt">
		<input type="button" value="获取" id="btn">
	</body>
</html>
```

**获取自定义属性值**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var txt = document.getElementById("txt");
				btn.onclick = function() {
					var value = txt.getAttribute("data");
					console.log(value);
				}
			}
		</script>
	</head>
	<body>
		<input type="text" id="txt" data="hello world">
		<input type="button" value="获取" id="btn">
	</body>
</html>
```

#### obj.value 和 obj.getAttribute("value") 区别

**例子1**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oTxt = document.getElementById("txt");
				oBtn.onclick = function() {
					var value1 = oTxt.value;
					var value2 = oTxt.getAttribute("value");
					console.log(value1); //hello
					console.log(value2); //hello
				}
			}
		</script>
	</head>
	<body>
		<input id="txt" type="text" value="hello">
		<input id="btn" type="button" value="获取">
	</body>
</html>
```

**例子2**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oTxt = document.getElementById("txt");
				oBtn.onclick = function() {
					var value1 = oTxt.value;
					var value2 = oTxt.getAttribute("value");
					console.log(value1); //abc
					console.log(value2); //null
				}
			}
		</script>
	</head>
	<body>
		<input id="txt" type="text"> <!-- 输入abc -->
		<input id="btn" type="button" value="获取">
	</body>
</html>
```

分析：例子1，输入框设置了value属性，`oTxt.value`和`oTxt.getAttribute("value")`都能获取到值；例子2，输入框没有设置value属性，然后手动输入字符串abc，这时`oTxt.value`能获取到值，但是`oTxt.getAttribute("value")`不能获取到值。这说明`getAttribute()`方法只能获取设置属性的值，而`value`则是获取输入框的文本。

#### setAttribute()

**语法**

```
DOM对象.setAttribute("属性", "属性值")
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
                var oBtn = document.getElementById("btn");
                oBtn.onclick = function() {
                    oBtn.setAttribute("value", "hello world");
                };
            }
        </script>
    </head>
    <body>
        <input id="btn" type="button" value="修改" />
    </body>
</html>
```

#### removeAttribute()

**语法**

```
DOM对象.removeAttribute("属性")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.main {
				color: red;
				font-weight: bold;
			}
		</style>
		<script>
			window.onload = function() {
				var btn = document.querySelector("#btn");
				var p = document.querySelector("#p1");
				btn.onclick = function() {
					p.removeAttribute("class");
				}
			}
		</script>
	</head>
	<body>
		<p id="p1" class="main">hello world!</p>
		<input type="button" value="删除" id="btn">
	</body>
</html>
```

#### hasAttribute()

**语法**

```
DOM对象.hasAttribute("属性")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.main {
				color: red;
				font-weight: bold;
			}
		</style>
		<script>
			window.onload = function() {
				var oP = document.getElementsByTagName("p")[0];
				var add = document.getElementById("add");
				var del = document.getElementById("delete");
				add.onclick = function() {
					if (!oP.hasAttribute("class")) {
						oP.className = "main";
					}
				}
				del.onclick = function() {
					if (oP.hasAttribute("class")) {
						oP.removeAttribute("class");
					}
				}
			}
		</script>
	</head>
	<body>
		<p class="main">hello world</p>
		<input id="add" type="button" value="添加样式">
		<input id="delete" type="button" value="删除样式">
	</body>
</html>
```



## CSS属性操作

### 获取CSS属性值

`getComputedStyle()`方法仅支持Google、Firefox、IE9及以上版本的浏览器，不支持IE6、IE7、IE8。

``getComputedStyle()`方法从名字上就可看出，获取计算后的样式（get computed style）。

**语法**

```
getComputedStyle(DOM对象).属性
或：
getComputedStyle(DOM对象)["属性名"]
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box {
				width: 100px;
				height: 100px;
				background-color: red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oBox = document.getElementById("box");
				oBtn.onclick = function() {
					var color = getComputedStyle(oBox).backgroundColor;
					console.log(color); //rgb(255, 0, 0)
					var color2 = getComputedStyle(oBox)["backgroundColor"];
					console.log(color2); //rgb(255, 0, 0)
					console.log(typeof color); //string
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<input id="btn" type="button" value="获取颜色">
	</body>
</html>
```



### 设置CSS属性值

设置CSS属性值，有2种方式：

- style对象。
- cssText属性。

#### style对象

**语法**

```
DOM对象.style.属性 = "属性值"
//或：
DOM对象.style["属性"] = "属性值"
```

**简单属性**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box {
				width: 100px;
				height: 100px;
				background-color: red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oBox = document.getElementById("box");
				oBtn.onclick = function() {
					oBox.style.backgroundColor = "black";
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<input id="btn" type="button" value="修改颜色">
	</body>
</html>
```

**复合属性**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box {
				width: 100px;
				height: 100px;
				background-color: red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oBox = document.getElementById("box");
				oBtn.onclick = function() {
					oBox.style.border = "2px dashed blue";
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<input id="btn" type="button" value="设置边框">
	</body>
</html>
```



#### cssText属性

cssText属性可以同时设置多个CSS属性。

**语法**

```
DOM对象.style.cssText = "属性值"
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#box {
				width: 100px;
				height: 100px;
				background-color: red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oBox = document.getElementById("box");
				oBtn.onclick = function() {
					oBox.style.cssText = "width:200;height:200px;background-color:green;border:2px dashed black;";
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<input id="btn" type="button" value="修改样式">
	</body>
</html>
```

#### className

**语法**

```
DOM对象.className = "类名"
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.oldBox {
				width: 100px;
				height: 100px;
				background-color: red;
			}

			.newBox {
				width: 200px;
				height: 200px;
				background-color: green;
				border: 2px dashed black
			}
		</style>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				var oBox = document.getElementById("box");
				oBtn.onclick = function() {
					oBox.className = "newBox";
				}
			}
		</script>
	</head>
	<body>
		<div id="box" class="oldBox"></div>
		<input id="btn" type="button" value="修改样式">
	</body>
</html>
```



## innerHTML 和 innerText

- innerHTML：获取一个元素的内部元素。
- innerText：获取一个元素的内部文本。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var div1 = document.getElementById("div1");
				console.log(div1.innerHTML); //<strong style="color:red;">hello</strong>
				console.log(div1.innerText); //hello

				var div2 = document.getElementById("div2");
				console.log(div2.innerHTML); //hello
				console.log(div2.innerText); //hello
			}
		</script>
	</head>
	<body>
		<div id="div1">
			<strong style="color:red;">hello</strong>
		</div>
		<div id="div2">
			hello
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bad9dea2da04f5d80c53ada4bdd5963.png)



