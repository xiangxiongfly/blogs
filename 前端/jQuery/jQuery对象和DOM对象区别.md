[TOC]

# jQuery对象和DOM对象区别

## 区别

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				//jQuery对象
				$("#box1").text("hello world");
				//DOM对象
				var box2 = document.getElementById("box2");
				box2.innerText = "hello world2";
			})
		</script>
	</head>
	<body>
		<div id="box1"> </div>
		<div id="box2"> </div>
	</body>
</html>
```

说明：

- 通过`$("#box1")`获取的是一个jQuery对象。
- 通过`document.getElementById("box2")`获取的是一个DOM对象。
- 小伙伴们一定要记住，如果你获取的是jQuery对象，就只能使用jQuery的方法；如果你获取的是DOM对象，就只能使用DOM方法（即原生JavaScript方法），两者是不能混用的。



## jQuery对象转DOM对象

**方式一**

```
var box1 = $("#box1").get(0);
box1.innerText = "hello world";
```

**方式二 **

```
var box1 = $("#box1")[0];
box1.innerText = "hello world";
```



## DOM对象转jQuery对象

```
var box1 = document.getElementById("box1")
$(box1).text("hello world");
```



