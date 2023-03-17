[TOC]

# CSS超链接样式和鼠标样式

##  超链接样式

### 超链接伪类

**语法**

```
a:link {}
a:visited {}
a:hover {}
a:active {}
```

**说明**

伪类必须按照“link、visited、hover、active”的顺序进行，不然浏览器可能无法正常显示这4种样式。

“love hate”。我们把这个顺序规则称为“爱恨原则”。

| 伪类      | 说明                             |
| --------- | -------------------------------- |
| a:link    | 未访问时的样式                   |
| a:visited | 已访问后的样式                   |
| a:hover   | 鼠标经过时的样式                 |
| a:active  | 鼠标单击激活时（按下状态）的样式 |

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> </title>
        <style type="text/css">
            a {
                text-decoration: none;
            }

            a:link {
                color: red;
            }

            a:visited {
                color: green;
            }

            a:hover {
                color: blue;
            }

            a:active {
                color: yellow;
            }
        </style>
    </head>
    <body>
        <a href="http://www.baidu.com" target="_blank">baidu</a>
    </body>
</html>
```



### 简化超链接样式

通常只有用到2种状态：未访问前的状态和鼠标经过时的状态。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title> </title>
		<style type="text/css">
			a {
				color: red;
				text-decoration: none;
			}

			a:hover {
				color: blue;
				text-decoration: none;
			}
		</style>
	</head>
	<body>
		<div>
			<a href="http://www.baidu.com" target="_blank">baidu</a>
		</div>
	</body>
</html>
```



## 鼠标样式

### 浏览器鼠标样式

**语法**

```
cursor: 取值;
```

**取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/cbe46996359f47f69202be21e4a3732a.png)

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<style type="text/css">
			div {
				width: 100px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				background-color: hotpink;
				color: white;
				font-size: 14px;
			}

			#div_default {
				cursor: default;
			}

			#div_pointer {
				cursor: pointer;
			}
		</style>
	</head>
	<body>
		<div id="div_default">鼠标默认样式</div>
		<div id="div_pointer">鼠标手状样式</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1334f21b88ea4a78882e82a85552e5fe.png)

### 自定义鼠标样式

**语法**

```
cursor:url(图片地址),属性值;
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <style type="text/css">
            div {
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: grey;
                color: white;
                font-size: 14px;
            }

            #div_default {
                cursor: url(img/ic_night.png), default;
            }

            #div_pointer {
                cursor: url(img/ic_day.png), pointer;
            }
        </style>
    </head>
    <body>
        <div id="div_default">鼠标默认样式</div>
        <div id="div_pointer">鼠标手状样式</div>
    </body>
</html>
```

