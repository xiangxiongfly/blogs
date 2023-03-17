[toc]

# CSS 单位

## 绝对单位

在CSS中，绝对单位定义的大小是固定的，使用的是物理度量单位，显示效果不会受到外界因素影响。绝对单位一般多用于传统平面印刷，而极少用于前端开发。

| 绝对单位 | 说明                    |
| -------- | ----------------------- |
| cm       | 厘米                    |
| mm       | 毫米                    |
| in       | 英寸                    |
| pt       | 磅（point），印刷的点数 |
| pc       | pica，1pc=12pt          |



## 相对单位

在CSS中，相对单位定义的大小是不固定的，一般是相对其他长度而言。

浏览器默认的font-size值都是16px。

| 相对单位 | 说明                              |
| -------- | --------------------------------- |
| px       | 像素                              |
| %        | 百分比                            |
| em       | 1em=当前元素大小                  |
| rem      | 1rem=根元素大小                   |
| vw       | 视口宽度单位，vw = 1/100视口宽度  |
| vh       | 视口高度单位，1vh = 1/100视口高度 |

### %效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style type="text/css">
			body {
				height: 500px;
				background-color: gainsboro;
			}

			#father {
				width: 50%;
				height: 50%;
				background-color: blue;
			}

			#son {
				width: 50%;
				height: 50%;
				background-color: red;
			}
		</style>
	</head>
	<body>
		<div id="father">
			<div id="son"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7bb0f513b4594cc2ad01c150229d20c6.png)



### vw vh

vw（viewpoint width，视区宽度）和vh（viewpoint height，视区高度）是相对单位，1vw表示屏幕宽度的1%，1vh表示屏幕高度的1。

**与百分比的区别：**

- 百分比是相对于父元素
- vw和vh总是针对于视口来说的。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style type="text/css">
			body {
				background-color: gainsboro;
			}

			#father {
				width: 50vw;
				height: 50vh;
				background-color: blue;
			}

			#son {
				width: 25vw;
				height: 25vh;
				background-color: red;
			}
		</style>
	</head>
	<body>
		<div id="father">
			<div id="son"></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c46d0d07efea4df48655756d55391273.png)



### 使用em实现首行缩进2个字

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <style type="text/css">
            p {
                font-size: 14px;
                text-indent: 2em;
                width: 360px;
            }
        </style>
    </head>
    <body>
        <h3>爱莲说</h3>
        <p>水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出
            淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
        <p>予谓菊，花之隐逸者也；牡丹，花之富贵者也；莲，花之君子者也。噫！菊之爱，陶后
            鲜有闻；莲之爱，同予者何人？牡丹之爱，宜乎众矣。</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9a8e9dcefc4a4f9db20c9517d5b2e6c1.png)

