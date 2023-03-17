[TOC]

# CSS列表样式

## list-style-type 列表项符号

**语法**

```
list-style-type: 取值;
```

**有序列表取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/e4ebc84bb535416cb565678269970030.png)

**无序列表取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/62972dee383348d092ee623320dd6308.png)

**去除列表项符号**

```css
list-style-type:none;
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            ol {
                list-style-type: lower-roman;
            }

            ul {
                list-style-type: circle;
            }
        </style>
    </head>
    <body>
        <h3>有序列表</h3>
        <ol>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ol>
        <h3>无序列表</h3>
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/07b4639d500f49b3bfc1b1a5dbffdb7a.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			ol,
			ul {
				list-style-type: none;
			}
		</style>
	</head>
	<body>
		<h3>有序列表</h3>
		<ol>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
		</ol>
		<h3>无序列表</h3>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
		</ul>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a416f86903c24397ba41191a9a31dc76.png)



## list-style-image 列表项图片

**语法**

```
list-style-image: url(图片路径);
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            html {
                background-color: gray;
            }

            ul {
                list-style-image: url(img/ic_day.png);
            }
        </style>
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/6aa54b423bdd4621be9ed8f09328b323.png)

