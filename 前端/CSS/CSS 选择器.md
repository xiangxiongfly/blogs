[TOC]

# CSS 选择器

## 元素选择器

- 元素选择器也称为标签选择器、类型选择器，直接使用元素的标签名为选择器。
- 由于标签选择器覆盖面非常大，通常用于标签的初始化。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            div {
                color: red;
            }
        </style>
    </head>
    <body>
        <div>HTML</div>
        <p>CSS</p>
        <span>JavaScript</span>
        <div>jQuery</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fd71d398a6e4a268814d4be7edcc2f4.png)



## id选择器

- id选择器指针对指定id的元素定义CSS样式。
- 同一个页面通常不允许出现2个相同的id。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #css1 {
                color: red;
            }
        </style>
    </head>
    <body>
        <div>HTML</div>
        <div id="css1">CSS</div>
        <div>JavaScript</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/89d75e6637574030b7311dc2967c42b0.png)



## class选择器

- class选择器指对定义class属性的元素定义CSS样式。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            .red {
                color: red;
            }
        </style>
    </head>
    <body>
        <div>HTML</div>
        <div class="red">CSS</div>
        <div class="red">JavaScript</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8b80c516976e49b38de6da95d2b2a15a.png)



## 通配符选择器

- 通配符选择器用`*`表示，是所有选择器中作用范围最广的，能匹配页面中所有的元素。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            * {
                color: red;
            }
        </style>
    </head>
    <body>
        <div>HTML</div>
        <div>CSS</div>
        <div>JavaScript</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d2a864a0ec6343e5a4e6e5fada1a9972.png)



## 交集选择器

- 交集选择器通常由两个选择器构成，第一个为标签选择器，第二个为class选择器，两个选择器之间不能有空格。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            h3.one {
                color: red;
            }
        </style>
    </head>
    <body>
        <h3>HTML</h3>
        <h3 class="one">CSS</h3>
        <h3>JavaScript</h3>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c651c6bc51c44a6790ca42cf51116e71.png)



## 并集选择器

- 并集选择器是各个选择器通过`,`连接，任何形式的选择器（包括标签选择器、class类选择器和id选择器），都可以成为并集选择器的一部分。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            h3,
            div,
            p,
            span {
                color: red;
            }
        </style>
    </head>
    <body>
        <h3>HTML</h3>
        <div>CSS</div>
        <p>JavaScript</p>
        <span>jQuery</span>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d689016a06064b0da5f7c09551b42d1f.png)



## 后代选择器

- 后代选择器是用来选择元素内的元素，包含子元素，孙子元素，标签之间用空格分隔。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #box1 div {
                color: red;
            }

            #box2 span {
                color: blue;
            }
        </style>
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

- 子元素选择器只能选择某元素的子元素，标签之间用`>`分隔。
- 子代选择器和后代选择器区别：子代只能选取子元素，后代包含子元素、孙子元素。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			#one>p {
				color: Red;
			}
		</style>
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

- 兄弟选择器选取元素后面的某一类兄弟元素，不包含前面。
- 如：`a~b`选择a元素之后所有同层级b元素。

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            #two~p {
                color: Red;
            }
        </style>
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

- 相邻选择器选取元素后面的某一个相邻的兄弟元素，使用`+`选择符。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			#two+p {
				color: Red;
			}
		</style>
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

### 底部导航栏制作

![在这里插入图片描述](https://img-blog.csdnimg.cn/06557c4d640d4e84bb6b6481d5eec8a4.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			* {
				padding: 0;
				margin: 0
			}

			nav {
				overflow: hidden;
				margin-top: 100px;
				background-color: #f9f9f9;
				width: 960px;
				height: 36px;
			}

			ul {
				list-style-type: none;
				margin: 0 auto;
				font-size: 13px;
				width: 364px;
				margin-top: 9px;
			}

			ul li {
				float: left;
				width: 72px;
				height: 18px;
				line-height: 18px;
				text-align: center;
			}

			ul li a {
				color: #1a1a1a;
				text-decoration: none;
			}

			li+li {
				border-left: 1px solid #666;
			}
		</style>
	</head>
	<body>
		<nav>
			<ul>
				<li><a href="#">关于</a></li>
				<li><a href="#">版权声明</a></li>
				<li><a href="#">广告服务</a></li>
				<li><a href="#">联系我们</a></li>
				<li><a href="#">意见反馈</a></li>
			</ul>
		</nav>
	</body>
</html>
```



## 属性选择器

![在这里插入图片描述](https://img-blog.csdnimg.cn/c3a8c073123a4bfca1eb7ff5c590d2a7.png)


```css
/*选择有title属性的标签*/
div[title]{
    color:green;
}

/*选择title属性值是abc的标签*/
div[title="abc"] {
    color: red;
}

/*选择class属性值以h开头的标签*/
div[class^="h"]{
    color:red;
}

/*选择class属性值以e结尾的标签*/
div[class$="e"]{
    color:yellow;
}

/*选择class属性值包含g的标签*/
div[class*="g"]{
    color:green;
}

/*选择class属性值包含空格分开hello的独立部分的标签*/
div[class~="hello"]{
    color:green;
}
```



## 伪类选择器

### 子元素伪类

![在这里插入图片描述](https://img-blog.csdnimg.cn/20a06d744367413c8482d6a324a46ace.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/e0db8604546749d28277453e8cdbe49b.png)

**nth-child(n)表达式**

- n可以为数字：n从1开始
- n可以是公式：n则从0开始计算

**常用公式**

| n取值 | 取值范围          |
| ----- | ----------------- |
| even  | 偶数              |
| odd   | 奇数              |
| 2n    | 偶数              |
| 2n+1  | 奇数              |
| 5n    | 5 , 10 , 15 ...   |
| n+5   | 从第5个开始到最后 |
| -n+5  | 前5个             |

```css
/*选择第一个子元素*/
ul>li:first-child {
    color: red;
}

/*选择最后一个子元素*/
ul>li:last-child {
    color: green;
}

/*选择第n个子元素，n从1开始...*/
ul>li:nth-child(n) {
    color: red;
}

/*选择奇数的子元素 odd*/
ul>li:nth-child(2n+1) {
    color: red;
}

/*选择偶数的子元素 even*/
ul>li:nth-child(2n+1) {
    color: red;
}

/*选择第一个不同类型的子元素*/
ul>li:first-of-type {
    color: red;
}

/*否定选择器*/
ul>li:not(:nth-of-type(3)) {
    color: yellowgreen;
}
```



### a标签伪类选择器

- a:link：未访问的样式
- a:visited：已访问后的样式
- a:hover：鼠标移到到链接时的样式
- a:active：选中时的样式（即鼠标按下时）

顺序必须是 l v h a 

```css
/*未访问的样式*/
a:link {
    color: red;
}

/*已访问后的样式*/
a:visited {
    color: green;
}

/*鼠标移到到链接时的样式*/
a:hover {
    color: blue;
}

/*选中时的样式*/
a:active {
    color: gray;
}
```



### 其他伪类

- :empty：选择空标签
- :focus：选择当前获取焦点的表单元素
- :enabled：选择当前有效的表单元素
- :disabled：选择当前无效的是表单元素
- :checked：选择当前已经勾选的单选按钮或复选框
- :root：选择根元素，即html标签
- :read-write：可读可写
- :read-only：只读
- :target：锚点元素
- :not(选择器)：排除

```css
p:empty {
    background-color: red;
}

input:focus {
    background-color: red;
}

input:disabled {
    background-color: black;
}

input:checked+span {
    background-color: red;
}
```



## 伪元素选择器

```css
/*选择第一个字符*/
p::first-letter {
    font-size: 50px;
    color: red;
}

/*选择第一行文本*/
p::first-line {
    font-size: 30px;
    color: greenyellow;
}

/*选择选中的文本*/
p::selection {
    color: gray;
}

/*在开始位置创建一个元素*/
p::before {
    content: "开头";
}

/*在结束位置创建一个元素*/
p::after {
    content: "结尾";
}
```



## 不同选择器的解析速度

```
#box1 .content div {}
#box1 .test {}
#test {}
```

由于浏览器解析选择器是从右往左的，因此最右边的选择器是最重要的。

第一个性能最差，第三个性能最好。id是唯一的，因此第三个可以快速定位，而第一个则需要匹配所有的元素。

谷歌资深Web开发工程师Steve Souders对CSS选择器的匹配效率从高到低做了一个排序：

- id选择器。
- class选择器。
- 元素选择器。
- 相邻选择器。
- 子选择器。
- 后代选择器。
- 通配符选择器。
- 属性选择器。
- 伪类选择器。



## 选择器使用技巧

### 不要使用通配符

在选择器中，通配符*一般用于选取页面中所有元素。例如“*{}”表示选取页面所有元素，“#wrapper *{}”表示选取id为wrapper元素下面的所有子元素。

通配符的匹配量非常大，一般情况下不建议使用。当然，从上面的CSS选择器匹配效率排序也可以看出来通配符的效率非常低。

### 不要在id选择器和class选择器前面添加元素名

元素的id在一个页面中具有唯一性，因此在id选择器前添加元素名是多余的，同时也增加了匹配量。

元素的id在一个页面中具有唯一性，因此在id选择器前添加元素名是多余的，同时也增加了匹配量。

```
/*多余的写法*/
div#wrapper{font-size:12px; }

/*正确的写法*/
#wrapper{font-size:12px; }
```

### 选择器最好不要超过三层，位置靠右的选择条件尽可能精确

选择器的层级越多，浏览器解析时匹配的次数就越多，因而速度就越慢。因此在定义选择器时，我们要尽量让选择器的层级少一些，最好不要超过三层。此外，根据选择器在浏览器中从右到左的解析原理可知，位置靠右的选择条件越精确，匹配量就越少，速度就越快。



