[TOC]

# CSS overflow display visibility

## overflow

overflow属性用于处理内容溢出父容器的情况。

**语法**

```
overflow: 取值;
```

**取值**

| 属性值  | 取值                                           |
| ------- | ---------------------------------------------- |
| visible | 默认值，内容溢出仍然显示                       |
| hidden  | 内容溢出，则溢出部分隐藏                       |
| scroll  | 内容溢出，则显示滚动条                         |
| auto    | auto与scroll相似，auto是内容溢出时才显示滚动条 |

`overflow:hidden`会触发BFC，可以用来清除浮动影响。



## overflow-x 和 overflow-y

在CSS2.1中，我们可以使用overflow属性来定义内容超出元素大小时应该如何处理。

在CSS3中又新增了overflow-x和overflow-y这两个属性。其中，overflow-x属性用来定义内容超出元素“宽度”时应该如何处理，而overflow-y属性用来定义内容超出元素“高度”时应该如何处理。

**语法**

```
overflow-x: 取值;
overflow-y: 取值;
```

**overflow-x取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/05fd86ed3677492cba444f7a5378cc71.png)

**overflow-y取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/3ae11179323e47f4b68f1483e1a8b154.png)

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				font-family: 微软雅黑;
				font-size: 14px;
			}

			#view {
				display: inline-block;
				width: 160px;
				height: 160px;
				background-color: #F1F1F1;
				border: 1px solid gray;
				overflow-x: visible;
			}

			#circle {
				width: 200px;
				height: 200px;
				background-color: Red;
				border-radius: 100px;
			}
		</style>
		<script>
			window.onload = function() {
				var oRadio = document.getElementsByName("group");
				var oDiv = document.getElementById("view");
				for (var i = 0; i < oRadio.length; i++) {
					oRadio[i].onclick = function() {
						if (this.checked) {
							oDiv.style.overflowX = this.value;
						}
					}
				}
			}
		</script>
	</head>
	<body>
		<div id="select">
			<h3>overflow-X取值：</h3>
			<label><input name="group" type="radio" value="visible" checked="checked" />visible</label>
			<label><input name="group" type="radio" value="hidden" />hidden</label>
			<label><input name="group" type="radio" value="scroll" />scroll</label>
			<label><input name="group" type="radio" value="auto" />auto</label>
		</div>
		<div id="view">
			<div id="circle"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c627b25b890f47108f7c076525d3511a.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/75d69e0474a44928bb8dbf2adddb8c9f.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d9244039837545a394503acdf889450f.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/18bfe145c0a24fc29188fd0869c80e1a.png)





## display

display属性用于元素类型转换。

**语法**

```
display: 取值;
```

**取值**

| 属性值       | 说明                             |
| ------------ | -------------------------------- |
| inline       | 行内元素                         |
| block        | 块元素                           |
| inline-block | 行内块元素                       |
| table        | 以表格形式显示，类似table元素    |
| table-row    | 以表格行形式显示，类似tr元素     |
| table-cell   | 以表格单元格形式显示，类似td元素 |
| none         | 隐藏元素                         |

**块级元素、行内元素和行内块元素**

| display属性 | 是否能并排显示 | 是否能设置宽高 | 不设置width时 | 举例                           |
| ----------- | -------------- | -------------- | ------------- | ------------------------------ |
| 块级元素    | 否             | 是             | width自动撑满 | div section header h系列 li ul |
| 行内元素    | 是             | 否             | width自动收缩 | a span em b u i                |
| 行内块元素  | 是             | 是             | width自动撑满 | img input                      |

**使用**

```html
<style>
    .btn {
        display: block;
        background-color: rgb(250, 137, 137);
        width: 200px;
        height: 60px;
        color: white;
        text-align: center;
        line-height: 60px;
        text-decoration: none;
        border-radius: 6px;
    }

    .btn:hover {
        background-color: red;
    }
</style>

<a class="btn" href="#">点击</a>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210518002121846.png)



## visibility

visibility属性用于隐藏元素。

**语法**

```
visibility: 取值;
```

**取值**

| 属性值  | 说明                     |
| ------- | ------------------------ |
| visible | 显示元素                 |
| hidden  | 隐藏元素，但仍然占据空间 |



## display:none 和 visibility:hidden 区别

`display:none`和`visibility:hidden`都可以隐藏元素，不过使用`display:none`的元素被隐藏之后不会占据原来的位置；而使用`visibility:hidden`的元素被隐藏后会占据原来的位置。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			div {
				display: inline-block;
				width: 100px;
				height: 100px;
			}

			#box1 {
				background-color: red;
			}

			#box2 {
				background-color: green;
				display: none;
			}

			#box3 {
				background-color: blue;
			}
		</style>
	</head>
	<body>
		<div id="box1"></div>
		<div id="box2"></div>
		<div id="box3"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ea9f24c4f7764b7fba4b3061d66e45d7.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			div {
				display: inline-block;
				width: 100px;
				height: 100px;
			}

			#box1 {
				background-color: red;
			}

			#box2 {
				background-color: green;
				visibility: hidden;
			}

			#box3 {
				background-color: blue;
			}
		</style>
	</head>
	<body>
		<div id="box1"></div>
		<div id="box2"></div>
		<div id="box3"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5b9a23230ca84612a5e672fddcdbdcf3.png)



## display:table-cell

`display:table-cell`可以让元素以表格单元格的形式展示，具有td元素的特点。

可以实现3种功能：

- 图片垂直居中。
- 等高布局。
- 自动平分元素，并在一行显示。

### 图片居中

**方法**

```
父元素 {
	display: table-cell;
	text-align: center;
}
子元素 {
	vertical-align: middle;
}
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            div {
                display: table-cell;
                width: 150px;
                height: 150px;
                border: 1px solid gray;
                vertical-align: middle;
                text-align: center;
            }

            img {
                width: 100px;
                vertical-align: middle;
            }

            div+div {
                border-left: none;
            }
        </style>
    </head>
    <body>
        <div><img src="img/a.png" alt="" /></div>
        <div><img src="img/bg.jpg" alt="" /></div>
        <div><img src="img/c.png" alt="" /></div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/318978f2d5654607be9f04feeaabf7b6.png)



### 等高布局

同一行的单元格td元素的高度是相等的，根据这个特性可以实现等高布局效果。

```html
<!DOCTYPE html>
<html x>
	<head>
		<title></title>
		<style type="text/css">
			#wrapper {
				display: table-row;
			}

			#img-box {
				display: table-cell;
				vertical-align: middle;
				text-align: center;
				width: 150px;
				border: 1px solid red;
			}

			#text-box {
				display: table-cell;
				width: 200px;
				border: 1px solid green;
				border-left: none;
				padding: 10px;
			}
		</style>
	</head>
	<body>
		<div id="wrapper">
			<div id="img-box">
				<img width="100%" src="img/dark_image.jpg" alt="" />
			</div>
			<div id="text-box">
				<span>
					这是一堆数据。。。
					这是一堆数据。。。
					这是一堆数据。。。
					这是一堆数据。。。
				</span>
			</div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8530d843bb85486c8f0a18f671dcba0f.png)



### 平分元素

**方法**

```
父元素 {
	display: table;
}
子元素 {
	display: table-cell;
}
```



**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            * {
                padding: 0;
                margin: 0;
            }

            ul {
                list-style-type: none;
                display: table;
                width: 300px;
            }

            li {
                display: table-cell;
                height: 60px;
                line-height: 60px;
                text-align: center;
                color: White;
            }

            ul li:nth-child(1) {
                background-color: Red;
            }

            ul li:nth-child(2) {
                background-color: Orange;
            }

            ul li:nth-child(3) {
                background-color: Blue;
            }

            ul li:nth-child(4) {
                background-color: silver;
            }

            ul li:nth-child(5) {
                background-color: Purple;
            }
        </style>
    </head>
    <body>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
        </ul>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8fb63e0dddc545a8a40b6e75687ae048.png)



## 去除行内块元素间距

inline-block元素之间是有间距的，可以通过`font-size:0`去除间距。

```
父元素 {
	font-size: 0;
}
```



