[TOC]



# CSS 字体文本样式

## 字体样式

| 属性        | 说明     |
| ----------- | -------- |
| color       | 字体颜色 |
| font-family | 字体类型 |
| font-size   | 字体大小 |
| font-weight | 字体粗细 |
| font-style  | 字体风格 |



### color 字体颜色

color用于定义文本颜色，取值方式有3种：

- 关键字，如：red、green、blue等。
- 十六进制RGB，如：#FF0000、#00FF00、#0000FF
- RGB：`rgb(255,0,0)`，RGBA：`rbga(110,0,0,.5)`

**W3C十六色**

![在这里插入图片描述](https://img-blog.csdnimg.cn/cf3cedcf61804821ac122cb134796ed0.png)



### font-size 字体大小

**语法**

```
font-size: 取值;
```

**取值**

| 属性值 | 说明                                      |
| ------ | ----------------------------------------- |
| px     | 像素                                      |
| em     | 相对于元素的字体大小计算，1em=1 font-size |
| rem    | 相对于根元素（html元素）的字体大小计算    |

注：网页文字正文字号通常为16px，浏览器最小支持10px字号。



### font-family 字体类型

**语法**

```
font-family: 字体1,字体2,字体3,...,字体N;
```

font-family可以指定多个字体，中间用逗号隔开。

**字体**

常用字体：宋体、微软雅黑、黑体等。

| 字体名称    | 英文名称        | Unicode 编码         |
| ----------- | --------------- | -------------------- |
| 宋体        | SimSun          | \5B8B\4F53           |
| 新宋体      | NSimSun         | \65B0\5B8B\4F53      |
| 黑体        | SimHei          | \9ED1\4F53           |
| 微软雅黑    | Microsoft YaHei | \5FAE\8F6F\96C5\9ED1 |
| 楷体_GB2312 | KaiTi_GB2312    | \6977\4F53_GB2312    |
| 隶书        | LiSu            | \96B6\4E66           |
| 幼园        | YouYuan         | \5E7C\5706           |
| 华文细黑    | STXihei         | \534E\6587\7EC6\9ED1 |
| 细明体      | MingLiU         | \7EC6\660E\4F53      |
| 新细明体    | PMingLiU        | \65B0\7EC6\660E\4F53 |

**京东的font-family设置**

```css
font-family: Microsoft YaHei, tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
```



### font-weight 字体粗细

**语法**

```
font-weight: 取值;
```

**取值**

| 属性值        | 说明                                       |
| ------------- | ------------------------------------------ |
| normal        | 标准字体，默认值，与400等值                |
| bold          | 粗体字体，与700等值                        |
| bolder        | 更粗大字体，大多数中文字体不支持           |
| lighter       | 更细的字体，大多数中文字体不支持           |
| 100-900的数值 | 值越大越粗，400等同于normal，700等同于bold |



### font-style 字体风格

**语法**

```
font-style: 取值;
```

**取值**

| 属性值  | 说明         |
| ------- | ------------ |
| normal  | 默认值，正常 |
| italic  | 斜体         |
| oblique | 斜体         |



### 综合简写

```css
选择器 {
    font: font-style font-weight font-size/line-height font-family; 
}
```



## 文本样式

| 属性            | 说明       |
| --------------- | ---------- |
| text-indent     | 首行缩进   |
| text-align      | 水平对齐   |
| vertical-align      | 垂直对齐   |
| text-decoration | 文本修饰   |
| text-transform  | 大小写转换 |
| line-height     | 行高       |
| letter-spacing  | 字间距     |
| word-spacing    | 词间距     |



### text-indent 首行缩进

`text-indent`属性设置首行文本的缩进。

**语法**

```
text-indent: 取值;
```

**取值**

| 属性值 | 说明                     |
| ------ | ------------------------ |
| px     | 缩进像素值               |
| em     | 缩紧字符宽               |
| %      | 缩进父元素的宽度的百分比 |

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            p {
                font-size: 14px;
                text-indent: 28px;
            }
        </style>
    </head>
    <body>
        <h3>爱莲说</h3>
        <p>水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
        <p>予谓菊，花之隐逸者也；牡丹，花之富贵者也；莲，花之君子者也。噫！菊之爱，陶后鲜有闻；莲之爱，同予者何人? 牡丹之爱，宜乎众矣。</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/25d72ae54f454922b22820d2f8f25a81.png)

#### 使用em实现首行缩进2个字

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

#### text-indent:-9999px

在搜索引擎优化中，h1是非常重要的标签。

可以设置h1元素的长宽与LOGO图片的长宽一样，然后定义h1的背景图片（background-image）为LOGO图片。然后使用`text-indent:-9999px;`隐藏h1的文字内容。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			h1 {
				width: 300px;
				height: 100px;
				background-image: url("img/logo.png");
				background-repeat: no-repeat;
				text-indent: -9999px;
			}
		</style>
	</head>
	<body>
		<h1>hello world</h1>
	</body>
</html>
```



### text-decoration 文本装饰线

**语法**

```
text-decoration: 取值;
```

**取值**

| 属性值       | 说明               |
| ------------ | ------------------ |
| none         | 默认值，没有装饰线 |
| underline    | 下划线             |
| line-through | 中划线             |
| overline     | 上划线             |

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #p1 {
                text-decoration: underline;
            }

            #p2 {
                text-decoration: line-through;
            }

            #p3 {
                text-decoration: overline;
            }
        </style>
    </head>
    <body>
        <p id="p1">这是“下划线”效果</p>
        <p id="p2">这是“删除线”效果</p>
        <p id="p3">这是“顶划线”效果</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cfe05d6b71854d63a4369f1a31543cb3.png)

#### 去除超链接下划线

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            a{text-decoration:none;}
        </style>
    </head>
    <body>
        <a>hello</a>
    </body>
</html>
```



### text-transform 大小写转换

**语法**

```
text-transform: 取值;
```

**取值**

| 属性值     | 说明                 |
| ---------- | -------------------- |
| none       | 默认值，无转换       |
| uppercase  | 转为大写             |
| lowercase  | 转为小写             |
| capitalize | 将单纯首字母转为大写 |

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #p1 {
                text-transform: uppercase;
            }

            #p2 {
                text-transform: lowercase;
            }

            #p3 {
                text-transform: capitalize;
            }
        </style>
    </head>
    <body>
        <p id="p1">hello world!</p>
        <p id="p2">hello world!</p>
        <p id="p3">hello world!</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/714629da63c64fb492eb5f99dec27c68.png)



### text-align 水平对齐方式

`text-align`设置文本水平对齐方式。

text-align可以对文本、inline元素、inline-block元素起作用。

**语法**

```
text-align: 取值;
```

**取值**

| 取值   | 说明           |
| ------ | -------------- |
| left   | 默认值，左对齐 |
| center | 居中对齐       |
| right  | 右对齐         |

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #p1 {
                text-align: left;
            }

            #p2 {
                text-align: center;
            }

            #p3 {
                text-align: right;
            }
        </style>
    </head>
    <body>
        <p id="p1">hello</p>
        <p id="p2">hello</p>
        <p id="p3">hello</p>
    </body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/236c01ea03784d40ac9b194c5007511e.jpeg)

#### text-align:center 和 maigin:0 auto 区别

- text-align：对文本、inline元素、inline-block元素起作用，在父元素中定义。
- margin:0 auto：对块元素起作用，在当前元素中定义。



### vertical-align 垂直对齐方式

`vertical-align`设置元素垂直对齐的方式。

vertical-align属性对inline元素、inline-block元素、table-cell有效，对block元素无效。

W3C（Web标准制定者）对vertical-align属性的定义是极其复杂的，其中有一项是“vertical-align属性定义周围的行内元素或文本相对于该元素的垂直方式”。

![在这里插入图片描述](https://img-blog.csdnimg.cn/22b1bda366df448691630c37858ecbe4.png)

**语法**

```
vertical-align: 取值;
```

**取值**

- 负值：“vertical-align:-2px”表示元素相对于基线向下偏移2px。此方法常常用于解决单选框或复选框与文字垂直对齐的问题。
- 百分比：vertical-align:50%”，假如当前元素所继承的line-height为20px，则“vertical-align:50%”实际上等价于“vertical-align:10px”。其中，vertical-align:10px”表示元素相对于基线向上偏移10px。
- 关键字：

| 属性值   | 说明             |
| -------- | ---------------- |
| baseline | 基线对齐，默认值 |
| top      | 顶部对齐         |
| bottom   | 底部对齐         |
| middle   | 居中对齐         |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			img {
				width: 60px;
				height: 60px;
			}

			#img1 {
				vertical-align: top;
			}

			#img2 {
				vertical-align: middle;
			}

			#img3 {
				vertical-align: bottom;
			}

			#img4 {
				vertical-align: baseline;
			}
		</style>
	</head>
	<body>
		学习前端<img id="img1" src="img/bg.jpg" alt="" />学习前端（top）
		<hr />
		学习前端<img id="img2" src="img/bg.jpg" alt="" />学习前端（middle）
		<hr />
		学习前端<img id="img3" src="img/bg.jpg" alt="" />学习前端（bottom）
		<hr />
		学习前端<img id="img4" src="img/bg.jpg" alt="" />学习前端（baseline）
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fbe63d948da946dca9a20c8021b3248e.png)



### white-space 空格处理

| 属性值   | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| normal   | 默认值，浏览器会忽略前后空格，合并中间的空格，当容器空间不足时会换行 |
| nowrap   | 和normal属性值一样，但是不会换行                             |
| pre      | 和原始文本一样                                               |
| pre-wrap | 和pre属性值一样，但超出容器时会换行                          |
| pre-line | 和normal属性值一样，但会保留换行符                           |

**浏览器默认处理情况**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>white-space</title>
		<style type="text/css">
			p {
				border: 1px dashed red;
			}
		</style>
	</head>
	<body>
		<p>  hello  world  </p>
		<p>hello
			world</p>
		<p>hello<br>world</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8052c440d2b493588dc3c8331eb0c31.png)

说明：第一个p元素的前后空格被忽略，中间的2个空格算作一个；第二个p元素中间的换行符被算作一个空格；所以HTML代码的空格换行通常会被浏览器忽略。

**使用white-space**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>white-space</title>
        <style type="text/css">
            p {
                border: 1px dashed red;
                width: 100px;
            }

            #p1 {
                white-space: normal;
            }

            #p2 {
                white-space: nowrap;
            }

            #p3 {
                white-space: pre;
            }

            #p4 {
                white-space: pre-wrap;
            }

            #p5 {
                white-space: pre-line;
            }
        </style>
    </head>
    <body>
        <p id="p1"> hello world hello
            world</p>
        <p id="p2"> hello world hello
            world</p>
        <p id="p3"> hello world hello
            world</p>
        <p id="p4"> hello world hello
            world</p>
        <p id="p5"> hello world hello
            world</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7335bab6cd07415db6c717d034deb0b3.png)



### text-overflow 文字溢出处理

**语法**

```
text-overflow: 取值;
```

**取值**

| 属性值   | 说明                                   |
| -------- | -------------------------------------- |
| clip     | 直接剪切                               |
| ellipsis | 溢出部分显示“...”                      |
| string   | 溢出部分显示指定字符，部分浏览器不兼容 |

**说明**

单独使用`text-overflow`属性是无法得到省略号效果的。要想实现文本溢出时就显示省略号效果，我们还需要结合`white-space`和`overflow`这两个属性来实现，完整的语法：

```css
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				margin: 10px;
				width: 100px;
				white-space: nowrap;
				overflow: hidden;
				border: 1px solid red;
			}

			.box1 {
				text-overflow: clip;
			}

			.box2 {
		 	text-overflow: ellipsis;
			}

		 .box3 {
				text-overflow: "!!!";
			}
		</style>
	</head>
	<body>
		<div class="box1">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
		<div class="box2">bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
		<div class="box3">ccccccccccccccccccccccccccccccccccc</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021051723470075.png)



### line-height 行高

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ea42edafaf34df3af5b58f098e14080.png)

行高指文字占有的实际高度，可通过`line-height`设置行高。

可以通过设置行高，实现文本垂直居中效果。

**语法**

```
line-height: 取值;
```

**取值**

| 属性值 | 说明                         |
| ------ | ---------------------------- |
| px     | 行高为指定的像素值           |
| 数值   | 行高为字号的倍数，如：1.5    |
| %      | 行高为字号的百分比，如：150% |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#p1 {
				line-height: 15px;
			}

			#p2 {
				line-height: 30px;
			}

			#p3 {
				line-height: 2;
			}
		</style>
	</head>
	<body>
		<p id="p1">水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
		<hr />
		<p id="p2">水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
		<hr />
		<p id="p3">水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d599ce6b31ee421d86c91c04ff0231ec.png)



### letter-spacing 字间距

定义字间距。

**语法**

```
letter-spacing: 像素值;
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            #p1 {
                letter-spacing: 0px;
            }

            #p2 {
                letter-spacing: 3px;
            }

            #p3 {
                letter-spacing: 5px;
            }
        </style>
    </head>
    <body>
        <p id="p1">hello world!</p>
        <hr />
        <p id="p2">hello world!</p>
        <hr />
        <p id="p3">hello world!</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cdcbc9a2ee744bd191019e982c0a41d5.png)



### word-spacing 词间距

定义单词之间的距离。

**语法**

```
word-spacing: 像素值;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			#p1 {
				word-spacing: 0px;
			}

			#p2 {
				word-spacing: 10px;
			}

			#p3 {
				word-spacing: 20px;
			}
		</style>
	</head>
	<body>
		<p id="p1">hello world! 哈喽！</p>
		<hr />
		<p id="p2">hello world! 哈喽！</p>
		<hr />
		<p id="p3">hello world! 哈喽！</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d0876dc0b60649dc94aeab7c21594c28.png)



### text-shadow 文本阴影

**语法**

```
text-shadown: x-offset y-offset blur color;
```

**说明**

x-offset参数：阴影水平偏移距离，单位可以是px、em、百分比。

y-offset参数：阴影垂直偏移距离。

blur参数：模糊距离，单位可以是px、em、百分比。

color参数：阴影颜色。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				font-size: 40px;
				text-shadow: 4px 4px 2px gray;
			}
		</style>
	</head>
	<body>
		<div>hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7e33111207d8456bbc63c7ed7fc8356e.png)

#### 文字凹凸效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				display: inline-block;
				padding: 16px;
				font-size: 40px;
				font-weight: bold;
				background-color: #ccc;
				color: #ddd;
				text-shadow: -1px 0 0 #333,
					0 -1px 0 #333,
					1px 0 0 #333,
					0 1px 0 #333;
			}
		</style>
	</head>
	<body>
		<div>hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1570ff306ad4614ae1c8a8eb1035f5c.png)

#### 火焰字体效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				text-align: center;
				color: #45b823;
				padding: 20px 0 0 20px;
				background-color: #fff;
				font-size: 60px;
				font-weight: bold;
				text-shadow: 0 0 4px white,
					0 -5px 4px #ff3,
					2px -10px 6px #fd3,
					-2px -15px 11px #f80,
					2px -25px 18px #f20;
			}
		</style>
	</head>
	<body>
		<div>hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/015cd4e42fd54078b5576361bc7b3c53.png)



### text-stroke 文本描边

**语法**

```
text-stroke: width color;
```

**说明**

width参数：边框宽度。

color参数：边框颜色。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				font-size: 30px;
				font-weight: bold;
			}

			#box2 {
				text-stroke: 1px red;
				-webkit-text-stroke: 1px red;
			}
		</style>
	</head>
	<body>
		<div id="box1">hello world</div>
		<div id="box2">hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cfc3822638df4abcbfabaa24c8dd49eb.png)

注：Chrome和Firefox这两个浏览器都只能识别带有-webkit-前缀的text-stroke属性。

#### 文字镂空效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			div {
				font-family: Verdana;
				font-size: 50px;
				font-weight: bold;
				color: transparent;
				text-stroke: 2px red;
				-webkit-text-stroke: 2px red;
			}
		</style>
	</head>
	<body>
		<div>hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e37594105be442db6a5d022ae5d28a3.png)



## 使用字体库

**语法**

```
@font-face {
	font-family: 字体名称;
	src: url("字体文件路径");
}
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			@font-face {
				font-family: myfont;
				src: url("fonts/Alimama_ShuHeiTi_Bold.ttf");
			}

			.p1 {
				font-family: "宋体";
			}

			.p2 {
				font-family: "微软雅黑";
			}

			.p3 {
				font-family: myfont;
			}
		</style>
	</head>
	<body>
		<p class="p1">hello前端！</p>
		<p class="p2">hello前端！</p>
		<p class="p3">hello前端！</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0444b7f7f58d4262bbc567ff16f59389.png)



## 使用图标 字体

**简介**

- 主要用于网页中的小图标。
- 轻量级：字体图标体积小，渲染快。 
- 灵活性：字体图标本质属于字体，可以很随意的改变颜色、产生阴影、透明效果等。
- 兼容性：几乎支持所有的浏览器

**常用图标字体网站**

https://fontawesome.com/start

https://www.iconfont.cn

http://icomoon.io       

**使用图标字体**

下载字体图标解压后，放在`fonts/iconfont`目录下，引入iconfont.css文件，就可以使用了。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./fonts/iconfont/iconfont.css" />
    </head>
    <body>
        <div>
            <i class="iconfont icon-xiaoxi-zhihui"></i>
            <i class="iconfont icon-xihuan"></i>
            <i class="iconfont icon-shouye-zhihui"></i>
            <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
            <i class="iconfont">&#xe61d;</i>
            <i class="iconfont">&#xe61e;</i>
            <i class="iconfont">&#xe61f;</i>
            <i class="iconfont">&#xe620;</i>
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/abf8795fd4f94b4baadc93592701323f.png)

