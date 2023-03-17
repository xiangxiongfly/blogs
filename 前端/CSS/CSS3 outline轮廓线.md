# CSS3 outline轮廓线

当文本框获取焦点时，我们可以看到文本框周围会出现一条淡蓝色的轮廓线。

`outline`用于设置元素的轮廓线，用法和`border`一样，但轮廓线不会影响到边框的大小。

**语法**

```
outline: 轮廓线宽度 轮廓线样式 轮廓线颜色;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			input[type="text"]:focus {
				outline: 1px solid red;
			}
		</style>
	</head>
	<body>
		<input id="txt" type="text" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5dd74ee33e1453bb61aadf210d94950.png)

