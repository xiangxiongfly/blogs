# jQuery index()

## 概述

在jQuery中，我们可以使用index()方法来获取当前jQuery对象集合中“指定元素”的索引值。



**语法**

```
$(元素).index()
```

**说明**

index()方法可以接受一个“jQuery对象”或“DOM对象”作为参数，不过一般情况下，我们很少会使用到参数。当index()不带参数时，一般指的是当前元素相对于父元素的索引值。

索引值是从0开始而不是从1开始的。

## 使用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("li").click(function() {
					var index = $(this).index();
					alert("当前元素是" + index);
				})
			})
		</script>
	</head>
	<body>
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>jQuery</li>
			<li>Vue</li>
		</ul>
	</body>
</html>
```



## Tab选项卡

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style type="text/css">
            * {
                padding: 0;
                margin: 0;
            }

            #wrapper {
                width: 300px;
                margin: 50px auto;
            }

            .title {
                list-style-type: none;
                overflow: hidden;
            }

            .title li {
                float: left;
                width: 100px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                color: white;
                cursor: pointer;
            }

            .title li:nth-child(1) {
                background-color: hotpink;
            }

            .title li:nth-child(2) {
                background-color: skyblue;
            }

            .title li:nth-child(3) {
                background-color: palegreen;
            }

            .content {
                width: 298px;
                border: 1px solid gray;
            }

            .content li {
                display: none;
            }

            li.current {
                display: block;
            }
        </style>
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $(".title li").click(function() {
                    var n = $(this).index();
                    $(".content li").removeClass("current").eq(n).addClass("current");
                })
            })
        </script>
    </head>
    <body>
        <div id="wrapper">
            <ul class="title">
                <li>娱乐</li>
                <li>经济</li>
                <li>军事</li>
            </ul>
            <ul class="content">
                <li class="current">
                    这是娱乐栏目<br>
                    这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。
                </li>
                <li>
                    这是经济栏目<br>
                    这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。
                </li>
                <li>
                    这是军事栏目<br>
                    这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。这是一些数据。
                </li>
            </ul>
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f752bf25d70f4183a6ef2496b0c28f03.gif)



