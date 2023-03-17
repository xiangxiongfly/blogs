[TOC]

# jQuery Ajax

## 概述

Ajax，全称“Asynchronous JavaScript and XML”，即“异步的JavaScript和XML”。其核心是通过JavaScript的XMLHttpRequest对象，以一种异步的方式，向服务器发送数据请求，并且通过该对象接收请求返回的数据，从而实现客户端与服务器端的数据操作。

Ajax能够刷新指定的页面区域，而不是刷新整个页面，从而减少客户端和服务端之间传输的数据量，提高页面速度，使得用户体验更好。

注意：由于浏览器安全方面的限制，大多数Ajax请求遵守“同源策略”。也就说，Ajax请求无法从不同的域、子域或协议中获取数据。



## load()

**语法**

```
//参数data省略，则是get()方式
$().load("test.php", function(){ 
    …… 
}) 
//参数data没有省略，则是post()方式 
$().load("test.php", {name: "xiaoming", age: 18}, function(){ 
    …… 
}) 
```

**说明**

在jQuery中，可以使用`load()`方法来通过Ajax请求从服务器中获取数据，然后把获取的数据插入到指定的元素中。

load()方法可以用来加载某一个文件的内容，例如扩展名txt、html和php的文件等。

url参数：加载的页面url。

data参数：发送到服务器的数据。

fn：请求完后的回调。

### 简单使用

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("#wrapper").load("http://localhost/test/hello.txt");
            })
        </script>
    </head>
    <body>
        <div id="wrapper"></div>
    </body>
</html>
```



### 加载部分内容

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
	</head>
	<script src="js/jquery-1.12.4.min.js"></script>
	<script>
		$(function() {
			$("#wrapper").load("http://localhost/test/content.html .select");
		})
	</script>
	<body>
		<div id="wrapper"></div>
	</body>
</html>
```

说明：只加载`.select`类名的元素。



### 传递数据

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("#wrapper").load("http://localhost/test/test.php", {
                    name: "小明",
                    age: 18,
                    address: "beijing"
                });
            })
        </script>
    </head>	
    <body>
        <div id="wrapper"></div>
    </body>
</html>
```



### 回调函数

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("#wrapper").load("http://localhost/test/test.php", {
                    name: "小明",
                    age: 18,
                    address: "beijing"
                }, function(responseText, status, xhr) {
                    console.log(responseText);
                    console.log(status);
                    console.log(xhr);
                });
            })
        </script>
    </head>	
    <body>
        <div id="wrapper"></div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3fd904337b69486f9bbf3e1a220fa942.png)



## $.get()

**语法**

```
$.get(url, data, fn, type)  
```

**说明**

在jQuery中，可以使用$.get()方法通过Ajax向服务器请求获取数据。

url参数：加载的url。

data参数：发送到服务器的数据。

fn参数：请求成功后的回调。

type参数：服务器返回的数据格式。text、html、xml、json、script或default。

**使用**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title></title>
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("#send").click(function() {
                    $.get("http://localhost/test/test_get.php", {
                        name: $("#name").val(),
                        age: $("#age").val(),
                        address: $("#address").val()
                    }, function(data, textStatus, jqXHR) {
                        console.log(data);
                        console.log(textStatus);
                        console.log(jqXHR);
                        $("#comment").html(data);
                    });
                });
            })
        </script>
    </head>
    <body>
        <form>
            <fieldset>
                <legend>用户信息</legend>
                <p><label>姓名：<input id="name" type="text"></label></p>
                <p><label>年龄：<input id="age" type="text"></label></p>
                <p><label>地址：<input id="address" type="text"></label></p>
                <p><input id="send" type="button" value="提交"></p>
            </fieldset>
        </form>
        <h3>评论列表</h3>
        <div id="comment"></div>
    </body>
</html>
```



## $.post()

**语法**

```
$.post(url, data, fn, type)
```

**说明**

$.get()方法和$.post()方法在使用方式上差不多。

**使用**

```javascript
$.post("http://localhost/test/test.php", {
    name: "小明",
    age: 18,
    address: "beijing"
}, function(data, textStatus, jqXHR) {
    $("#comment").html(data);
});
```



## $.getJSON()

**语法**

```
$.getJSON(url ,data, function(data){
    …… 
}) 
```

**说明**

在jQuery中，可以使用$.getJSON()方法通过Ajax请求获取服务器中JSON格式的数据。

参数url：表示被加载的文件地址。

参数data：表示发送到服务器的数据，数据为“键值对”格式。

参数function(data){}：表示请求成功后的回调函数，请求失败是不会处理的。

**使用**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title></title>
        <script src="js/jquery-1.12.4.min.js"></script>
        <script>
            $(function() {
                $("#btn").click(function() {
                    $.getJSON("http://localhost/test/info.json", function(data) {
                        var str = "";
                        $.each(data, function(index, info) {
                            str += "姓名：" + info["name"] + "<br>";
                            str += "年龄：" + info["age"] + "<br>";
                            str += "性别：" + info["sex"] + "<br>";
                            str += "<hr>";
                        });
                        $("#comment").html(str);
                    });
                });
            })
        </script>
    </head>
    <body>
        <input id="btn" type="button" value="获取" />
        <div id="comment"></div>
    </body>
</html>
```



## $.getScript()

**语法**

```
$,getScript(url, 回调函数)
```

**说明**

在jQuery中，可以使用$.getScript()方法通过Ajax请求获取并运行一个外部JavaScript文件。

$.getScript()是一个用于动态加载JavaScript的方法。当网站需要加载大量JavaScript时，动态加载JavaScript就是一个比较好的方法。当需要某个功能时，再将相应的JavaScript加载进来。

相对传统的加载方式，$.getScript()方法有以下两个优点：

- 异步跨域加载JavaScript文件。
- 可避免提前加载JavaScript文件，只有需要的时候才会去加载。这样可以减少服务器和客户端的负担，加快页面的加载速度。

**使用**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title></title>
		<style>
			div {
				width: 100px;
				height: 100px;
				background-color: blue;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("div").click(function() {
					$.ajaxSetup({
						cache: true
					});
					$.getScript("js/jquery.color.js");
					$(this).animate({
						"width": "150px",
						"height": "150px",
						"background-color": "red"
					}, 1000);
				});
			})
		</script>
	</head>
	<body>
		<div></div>
	</body>
</html>
```



## $.ajax()

**语法**

```
$.ajax(options) 
```

**说明**

options是一个对象，这个对象内部有很多参数可以设置，所有参数都是可选的，如下：![在这里插入图片描述](https://img-blog.csdnimg.cn/7a8c8627a42c4d77a9ba993d7bd21806.png)

### $.ajax()替代$.getJSON()

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function() {
					$.ajax({
						url: "http://localhost/test/info.json",
						type: "get",
						dataType: "json",
						success: function(data) {
							var str = "";
							$.each(data, function(index, info) {
								str += "姓名：" + info["name"] + "<br>";
								str += "性别：" + info["sex"] + "<br>";
								str += "年龄" + info["age"] + "<br>";
								str += "<hr>";
							});
							$("div").html(str);
						}
					})
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="获取数据">
		<div></div>
	</body>
</html>
```

### $.ajx()替代$.getScript()

```html
<!DOCTYPE html>
<html> 
    <head> 
        <meta charset="utf-8" /> 
        <title></title> 
        <script src="js/jquery-1.12.4.min.js"></script> 
        <script> 
            $(function(){ 
                $("#btn").click(function(){ 
                    $.ajax({ 
                        url:"js/test.js", 
                        type:"get", 
                        dataType:"script" 
                    }) 
                }) 
            }) 
        </script> 
    </head> 
    <body> 
        <input id="btn" type="button" value="加载"/> 
    </body> 
</html> 
```

### $.ajax替代$.get()

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#send").click(function() {
					$.ajax({
						url: "http://localhost/test/test_get.php",
						type: "get",
						data: {
							name: $("#name").val(),
							age: $("#age").val(),
							address: $("#address").val()
						},
						success: function(data, textStatus, jqXHR) {

						},
						error: function(jqXHR, textStatus, errorThrown) {

						}
					})
				});
			})
		</script>
	</head>
	<body>
		<form>
			<fieldset>
				<legend>用户信息</legend>
				<p><label>姓名：<input id="name" type="text"></label></p>
				<p><label>年龄：<input id="age" type="text"></label></p>
				<p><label>地址：<input id="address" type="text"></label></p>
				<p><input id="send" type="button" value="提交"></p>
			</fieldset>
		</form>
		<h3>评论列表</h3>
		<div id="comment"></div>
	</body>
</html>
```

