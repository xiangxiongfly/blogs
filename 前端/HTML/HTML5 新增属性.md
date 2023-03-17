[TOC]

# HTML5 新增属性

## 公共属性

HTML5新增的常见公共属性有4个：

- hidden
- draggable
- contenteditable
- data-*

### hidden属性

可以使用hidden属性来显示或隐藏某一个元素。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<div hidden>hello1</div>
		<div>hello2</div>
	</body>
</html>
```



### draggable属性

可以使用draggable属性来定义某一个元素是否可以被拖动。

**语法**

```
<element draggable="true或false" ></element>
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			p {
				display: inline-block;
				padding: 10px;
				border: 1px dashed gray;
				background-color: #F1F1F1;
			}
		</style>
	</head>
	<body>
		<p draggable="true">这是一段可以被拖动的文字</p>
	</body>
</html>
```



### contenteditable属性

可以使用contenteditable属性来定义某个元素的内容是否可以被编辑。

**语法**

```
<element contenteditable="true或false" ></element>
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            p {
                display: inline-block;
                padding: 10px;
                border: 1px dashed gray;
                background-color: #F1F1F1;
            }
        </style>
    </head>
    <body>
        <p contenteditable="false">这是一段可以被编辑的文字</p>
    </body>
</html>
```



### data-*属性

可以使用data-*属性来为元素实现自定义属性。

**语法**

```
<element data-*="属性值" ></element>
```

**说明**

“data-”只是一个前缀，后面接一个小写的字符串，例如data-color、data-article-title等。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oP = document.getElementsByTagName("p")[0];
				oP.style.color = oP.dataset.color;
			}
		</script>
	</head>
	<body>
		<p data-color="red">你的努力程度之低，根本轮不到拼天赋。</p>
	</body>
</html>
```

说明：可以使用DOM操作中的obj.dataset.xxx来获取data-*属性的值。

注意：

- 如果是data-xxx格式，则应该写成obj.dataset.xxx。例如data-color应该写成obj.dataset.color，而data-content应该写成obj.dataset.content。
- 如果是data-xxx-yyy格式，则应该写成obj.dataset.xxxYyy。例如data-fruit-price应该写成obj.dataset.fruitPrice，而data-animal-type应该写成obj.dataset.animalType。



## input元素新增属性

为了提高开发效率，以及达到更好的用户体验，HTML5为input元素新增了大量的属性：

- autocomplete
- autofocus
- placeholder
- required
- pattern

### autocomplete属性

可以使用autocomplete属性来实现文本框的自动提示功能。

**语法**

```
<input type="text" autocomplete="on或off" />
```

**说明**

autocomplete属性有两个属性值：on和off。

on表示开启，off表示关闭。

autocomplete属性一般都是结合datalist元素来实现自动提示功能。

autocomplete属性适用于所有文本框型的input元素，包括text、password、email、url、tel等。

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <form method="post">
            <input type="text" autocomplete="on" list="tips" />
            <datalist id="tips">
                <option value="HTML"></option>
                <option value="CSS"></option>
                <option value="JavaScript"></option>
                <option value="Vue.js"></option>
                <option value="React.js"></option>
                <option value="Angular.js"></option>
            </datalist>
        </form>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/089fca5dd635497e9e2aa3507cd76406.png)



### autofocus属性

默认情况下，文本框是不会自动获取焦点的，必须点击文本框才会获取。

在HTML5之前，都是使用JavaScript的focus()方法来实现的，这种方式相对来说比较麻烦。在HTML5中，我们可以使用autofocus属性来实现文本框自动获取焦点。

**语法**

```
<input type="text" autofocus="autofocus" />
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <form method="post">
            <input type="text" autofocus />
        </form>
    </body>
</html>
```



### placeholder属性

可以使用placeholder属性为文本框添加提示内容。

**语法**

```
<input type="text" placeholder="提示内容" />
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form method="post">
			<input type="text" placeholder="请输入账号" /><br />
			<input type="text" placeholder="请输入密码" />
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2ea2e87443e74b2c866ac1a863091c5d.png)



### required属性

可以使用required属性来定义文本框输入内容不能为空。如果文本框为空，则不允许提交。

**语法**

```
<input type="text" required="required" />
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form method="post">
			<input type="text" required /><br />
			<input type="submit" value="提交" />
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ab2d6201e20b415c9a1a5e1a8036a1c3.png)



### pattern属性

可以使用pattern属性来为文本框添加验证功能。

**语法**

```
<input type="text" pattern="正则表达式" />
```

**说明**

email、url、tel这3个类型的input元素，本质上都内置了pattern属性，因此它们会自动进行相关匹配验证。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form method="post">
			<input type="text" pattern="^[a-zA-Z]\w{4,9}$" /><br />
			<input type="submit" value="提交" />
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b281cf9976374f09840c34499c40bb85.png)

说明：`pattern="^[a-zA-Z]\w{4,9}$`表示文本框的内容必须符合“以字母开头，包含字母、数字或下划线，并且长度在5~10之间”的规则。



## form元素新增属性

### novalidate属性

可以使用novalidate属性来禁用form元素的所有文本框内置的验证功能，使用JavaScript来创建更为复杂且健全的验证，这时就要覆盖原有的验证机制了。

**语法**

```
<form novalidate="novalidate">

</form>
```

**说明**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var email = document.getElementById("email");
				var tel = document.getElementById("tel");
				var errorEmail = document.getElementById("errorEmail");
				var errorTel = document.getElementById("errorTel");
				var btn = document.getElementById("btn");
				var oForm = document.getElementsByTagName("form")[0];

				var regEmail = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
				var regTel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;

				btn.onclick = function() {
					if (!regEmail.test(email.value)) {
						errorEmail.innerText = "请输入正确的邮箱地址";
						return;
					} else {
						errorEmail.innerText = "";
					}
					if (!regTel.test(tel.value)) {
						errorTel.innerText = "请输入正确的手机号码";
						return;
					} else {
						errorTel.innerText = "";
					}

					//通过验证
					oForm.submit();
				}
			}
		</script>
	</head>
	<body>
		<form method="post" novalidate>
			<p>
				<label>电子邮箱：<input id="email" type="email" value="abced@qq.com" /></label><span id="errorEmail"></span>
			</p>
			<p>
				<label>手机号码：<input id="tel" type="tel" value="13745617896" /></label><span id="errorTel"></span>
			</p>
			<input id="btn" type="button" value="提交" />
		</form>
	</body>
</html>
```



