[toc]

# CSS浮动



## [正常文档流介绍](https://blog.csdn.net/qq_14876133/article/details/106889636)



## 浮动特性

- 浮动元素会脱离文档流，不再占据文档流中的位置。
- 浮动元素会一行显示并且元素顶部对齐，父容器空间不足时，子元素会掉下去。
- 浮动元素会具有行内块元素的特性。



## 使用浮动

**语法**

```
float: 取值;
```

**取值**

| 属性值 | 说明         |
| ------ | ------------ |
| left   | 元素向左浮动 |
| right  | 元素向右浮动 |



### 文字环绕效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200620193926640.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

```html
<style>
    img {
        width: 100px;
        float: left;
    }
</style>

<div class="box">
    <img src="images/img.png" alt="">
    <p>
        这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字这是一些文字
    </p>
</div>
```



### 水平导航条

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210520232821984.png)

```html
<style>
    * {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    nav {
        margin: 20px auto;
    }

    ul {
        list-style: none;
        background-color: #333;
    }

    li {
        float: left;
    }

    li a {
        display: block;
        color: white;
        text-align: center;
        text-decoration: none;
        padding: 14px 16px;
    }

    li a:hover {
        color: #111;
    }

    .active {
        background-color: #4CAF50;
    }
</style>

<body>
    <nav>
        <ul>
            <li><a class="active" href="#">首页</a></li>
            <li> <a href="#">服务</a></li>
            <li><a href="#">编辑</a></li>
            <li><a href="#">设置</a></li>
        </ul>
    </nav>
</body>
```



### 借助浮动布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1c1fb2987234618b446657c4975fdab.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}

			header {
				width: 1000px;
				height: 100px;
				margin: 0 auto;
			}

			.content {
				width: 1000px;
				height: 500px;
				margin: 20px auto;
			}

			footer {
				width: 1000px;
				height: 100px;
				background-color: #333;
				margin: 0px auto;
			}

			header .logo {
				float: left;
				width: 220px;
				height: 100px;
				background-color: orange;
			}

			header .login {
				float: right;
				width: 220px;
				height: 30px;
				background-color: orange;
			}

			nav {
				float: right;
				width: 690px;
				height: 50px;
				margin-top: 20px;
				background-color: green;
			}

			.content .ad {
				float: left;
				height: 500px;
				width: 300px;
				background-color: blue;
			}

			.content .main {
				float: right;
				width: 680px;
				height: 500px;
			}

			.content .main .banner {
				width: 680px;
				height: 380px;
				background-color: orange;
			}

			.content .main .pics {
				width: 680px;
				height: 100px;
				margin-top: 20px;
			}

			.content .main .pics ul {
				list-style: none;
			}

			.content .main .pics ul li {
				float: left;
				width: 160px;
				height: 100px;
				background-color: blue;
				margin-right: 10px;
			}

			.content .main .pics ul li:last-child {
				width: 170px;
				margin-right: 0;
			}
		</style>
	</head>
	<body>
		<header>
			<div class="logo">logo</div>
			<div class="login">login</div>
			<nav>nav</nav>
		</header>
		<div class="content">
			<div class="ad">ad</div>
			<div class="main">
				<div class="banner">banner</div>
				<div class="pics">
					<ul>
						<li>pic1</li>
						<li>pic2</li>
						<li>pic3</li>
						<li>pic4</li>
					</ul>
				</div>
			</div>
		</div>
		<footer>footer</footer>
	</body>
</html>
```



### 借助浮动实现两列布局

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

			#sidebar {
				float: left;
				width: 100px;
				height: 250px;
				background: #FF6666;
			}

			#content {
				height: 400px;
				background-color: #FFCCCC;
				overflow: hidden;
			}
		</style>
	</head>
	<body>
		<div id="sidebar"></div>
		<div id="content"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e34011b130054ebba95970ef2840653c.png)



## 浮动的缺点

### 高度塌陷问题

在文档流中，如果父元素没有设置高度height，那么父元素的高度默认是被子元素撑开的；当子元素浮动后，会完全脱离文档流，将会无法撑起父元素的高度，导致父元素的高度丢失。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210520234158247.png)

```html
<style>
    .box {
        width: 400px;
        border: 5px solid red;
    }

    .c1 {
        width: 200px;
        height: 200px;
        background-color: orange;
        float: left;
    }

    .c2 {
        width: 200px;
        height: 200px;
        background-color: blue;
        float: left;
    }
</style>

<div class="box">
    <div class="c1"></div>
    <div class="c2"></div>
</div>
```



### 布局错乱

浮动会影响周围元素，如下案例：浮动导致后续元素受到影响，原本为两行两列的布局变为一行四列。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210520235617464.png)

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style>
            div {
                margin: 5px;
            }

            p {
                float: left;
                width: 100px;
                height: 100px;
                background-color: orange;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
        <div>
            <p></p>
            <p></p>
        </div>
        <div>
            <p></p>
            <p></p>
        </div>
    </body>
</html>
```



## 清除浮动

### 使用clear:both

可以使用clear属性清除浮动带来的影响。

**语法**

```
clear: 取值;
```

**取值**

| 属性值 | 说明             |
| ------ | ---------------- |
| left   | 清除左浮动       |
| right  | 清除右浮动       |
| both   | 同时清除左右浮动 |

原理：设置清除浮动后，浏览器会自动为该元素添加一个上边距，使其元素位置不受影响。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			div {
				margin: 5px;
			}

			p {
				float: left;
				width: 100px;
				height: 100px;
				background-color: orange;
				margin-right: 10px;
			}

			.clear {
				clear: both
			}
		</style>
	</head>
	<body>
		<div class="clearfix">
			<p></p>
			<p></p>
			<div class="clear"></div>
		</div>
		<div>
			<p></p>
			<p></p>
			<div class="clear"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/350ea08af414458294e1f5402d6a5fd4.png)



### 使用overflow:hidden

原理：触发BFC。

```css
div {
    overflow: hidden;
    margin: 5px;
}

p {
    float: left;
    width: 100px;
    height: 100px;
    background-color: orange;
    margin-right: 10px;
}
```



### 使用::after伪元素

```css
.clearfix {
    *zoom: 1;
}

.clearfix::after {
    clear: both;
    content: "";
    display: block;
    height: 0;
    visibility: hidden;
}
```

注：`*zoom: 1;`是为了兼容IE6、IE7。



