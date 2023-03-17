[TOC]

# CSS制作图形效果

## 三角形

原理：宽高设置为0，调整边框。

```css
div {
    width: 0;
    height: 0;
    border-color: red green blue gray;
    border-style: solid;
    border-width: 20px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8265a150b32d47d4aa93820b25ce6610.png)

```css
div {
    width: 0;
    height: 0;
    border-color: transparent transparent black transparent;
    border-style: solid;
    border-width: 20px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0b238f7940114d6da9550383882e9577.png)

```css
div {
    width: 0;
    height: 0;
    border-color: red red transparent transparent;
    border-style: solid;
    border-width: 20px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/dd58d59a12f84a82b9c78423c31eba49.png)

```css
div {
    width: 0;
    height: 0;
    border-color: transparent transparent red red;
    border-style: solid;
    border-width: 20px 10px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/98603b633d474baebd32e6e1ad915aba.png)

```html
<!DOCTYPE>
<html>
	<head>
		<title></title>
		<style type="text/css">
			/*外层三角形*/
			#triangle {
				position: relative;
				width: 0;
				height: 0;
				border-width: 30px;
				/*注意外层三角形高为30px*/
				border-style: solid;
				border-color: transparent transparent black transparent;
			}

			/*内层三角形*/
			#triangle .inner {
				position: absolute;
				top: -28px;
				left: -29px;
				width: 0;
				height: 0;
				border-width: 29px;
				/*注意内层三角形边高为29px*/
				border-style: solid;
				border-color: transparent transparent #BBFFEE transparent;
			}
		</style>
	</head>
	<body>
		<div id="triangle">
			<div class="inner"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/964a561ff4c04e28a1090fdf7448897c.png)



## 圆角

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>圆角</title>
		<style type="text/css">
			div {
				width: 100px;
				height: 50px;
				border: 1px solid gray;
				border-radius: 10px;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/efdb62d72c1443f8916b131f67375f5a.png)



## 圆形

原理：正方形，圆角值为宽的一半。

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>圆形</title>
		<style type="text/css">
			div {
				width: 100px;
				height: 100px;
				border: 1px solid red;
				border-radius: 50%;
				background-color: #FCE9B8;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1f23064dc9c1473781a850e8f94f976e.png)



## 半圆

原理：高度为宽度的一半，左上圆角值和右上圆角值为元素的高度，右下角和左下角为0。

```html
<!DOCTYPE html>
<html>
	<head>
		<title>半圆</title>
		<style type="text/css">
			div {
				width: 100px;
				height: 50px;
				border: 1px solid red;
				border-radius: 100px 100px 0 0;
				background-color: #FCE9B8;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/35504c5ef50e462fa443e1e685353d91.png)



## 椭圆

原理：圆角的x轴半径为宽度的一半，y轴半径为高度的一半。

```html
<!DOCTYPE html>
<html>
	<head>
		<title>椭圆</title>
		<style type="text/css">
			div {
				width: 160px;
				height: 100px;
				border: 1px solid gray;
				border-radius: 80px/50px;
			}
		</style>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a70b1b0b691a41bc886dcdab0c15edf6.png)



## 聊天框

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            .wrapper {
                display: inline-block;
                position: relative;
                padding: 20px 30px;
                margin-top: 100px;
                border: 1px solid gray;
                border-radius: 10px;
                /*添加圆角效果*/
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                background-color: #BBFFEE;
            }

            /*外层三角形*/
            .triangle {
                position: absolute;
                top: -30px;
                /*left:50%和margin-left:-15px是为了实现三角形的水平居中*/
                left: 50%;
                margin-left: -15px;
                width: 0;
                height: 0;
                border-width: 15px;
                border-style: solid;
                border-color: transparent transparent black transparent;
            }

            /*内层三角形*/
            .triangle .inner {
                position: absolute;
                top: -13px;
                left: -14px;
                width: 0;
                height: 0;
                border-width: 14px;
                border-style: solid;
                border-color: transparent transparent #BBFFEE transparent
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="triangle">
                <div class="inner"></div>
            </div>
            hello world!
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bb527613a3524b3f8bc1d4a00cad250e.png)

## 标签

```html
<!DOCTYPE html>
<html>
	<head>
		<title>标签</title>
		<style type="text/css">
			div {
				width: 50px;
				line-height: 50px;
				border-radius: 80% 90% 100% 20%;
				background-color: #E61588;
				font-size: 30px;
				text-align: center;
				color: White;
			}
		</style>
	</head>
	<body>
		<div>6</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fd1d638360554f49b196aca0acaf40cd.png)



