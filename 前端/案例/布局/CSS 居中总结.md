[TOC]

# CSS 居中总结

## 文字居中

**原理**

```
父元素 {
	text-align: center;
	line-height: 父元素的高度;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>文字居中</title>
        <style type="text/css">
            .box {
                width: 200px;
                height: 200px;
                border: 1px dashed silver;
                text-align: center;
                line-height: 200px;
            }
        </style>
    </head>
    <body>
        <div class="box">hello world</div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f5a23127ebdf460eae4ba828fa0463ca.png)

## 多行文字垂直居中

**原理**

```
父元素 {
    display: table-cell;
    vertical-align: middle;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>多行文字垂直居中</title>
		<style type="text/css">
			.box {
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
				display: table-cell;
				vertical-align: middle;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<span>
				helloworld helloworld helloworld helloworld helloworld
			</span>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ddd2eec1d5f404b9cc38cca0da239a8.png)

## 块元素水平居中

**原理**

```
子元素 {
	margin: 0 auto;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>块元素水平居中</title>
		<style type="text/css">
			.box {
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
			}

			.box .child {
				margin: auto;
				width: 50px;
				height: 50px;
				background-color: red;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="child"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/37fe21ce1cf84b868bb13c9b4ae3e8ae.png)

## 行内元素、行内块元素居中

**原理**

使用table-cell属性，这种方式适用于inline元素、inline-block元素。

```
父元素 {
	display:table-cell;
	vertical-align:middle;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>行内元素、行内块元素居中</title>
        <style type="text/css">
            .box {
                width: 200px;
                height: 200px;
                border: 1px dashed silver;
                display: table-cell;
                vertical-align: middle;
                text-align: center;
            }

            .box .child {
                width: 50px;
                height: 50px;
                background-color: red;
            }
        </style>
    </head>
    <body>
        <div class="box">
            <a href="#">hello world</a>
        </div>
        <div class="box">
            <img src="../img/apple_pic.png" alt="">
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3448fb2d1e6a483b95e5e23acf939b23.png)

## 块元素居中一

**原理**

使用position定位元素，这种方式适用于block元素。

```
父元素 {
	position: relative;
}

子元素 {
	position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 子元素height值一半的负值;
    margin-left: 子元素width值一半的负值;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>块元素居中一</title>
		<style type="text/css">
			.box {
				position: relative;
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
			}

			.box .child {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 50px;
				height: 50px;
				background-color: red;
				margin-top: -25px;
				margin-left: -25px;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="child"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/579535d7b62141b5b5f3e0e7e82f6436.png)

## 块元素居中二

**原理**

用translate替代margin。

```
父元素 {
	position: relative;
}

子元素 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>块元素居中二</title>
		<style type="text/css">
			.box {
				position: relative;
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
			}

			.box .child {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 50px;
				height: 50px;
				background-color: red;
				transform: translate(-50%, -50%);
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="child"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f01397232e5c4e6fb6a7e9aa62173413.png)

## 块元素居中三

**原理**

```
父元素 {
	position: relative;
}

子元素 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>块元素居中三</title>
		<style type="text/css">
			.box {
				position: relative;
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
			}

			.box .child {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 50px;
				height: 50px;
				background-color: red;
				margin: auto;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="child"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f01397232e5c4e6fb6a7e9aa62173413.png)

## flex居中

**原理**

```
父元素 {
    display: flex;
    align-items: center;
    justify-content: center;
}
```

**实现**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>flex居中</title>
		<style type="text/css">
			.box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 200px;
				height: 200px;
				border: 1px dashed silver;
			}

			.box .child {
				width: 50px;
				height: 50px;
				background-color: red;
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="child"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f01397232e5c4e6fb6a7e9aa62173413.png)

## [代码下载](https://github.com/xiangxiongfly/MyHtmlCssJs/tree/main/%E5%B1%85%E4%B8%AD)



