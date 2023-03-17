# CSS3 initial取值

在实际开发中，我们有时需要将某个CSS属性重新设置为它的默认值。大多数情况下，我们都是采用直接给一个值的方式来实现。例如，浏览器默认字体颜色为黑色，如果重置color属性为默认值，我们大多数都是使用color:black;。但是很多时候，我们对元素的默认样式并不是特别清楚，例如p元素默认会有一定的margin，但是我们并不知道默认的margin是多少。

在CSS3中，我们可以使用initial属性直接将某个CSS属性重置为它的默认值，并不需要事先知道这个CSS属性的默认值是多少，因为浏览器会自动设置的。

**语法**

```
属性名: initial;
```

**说明**

property是一个CSS属性名，“property:initial;”表示设置property这个属性的取值为默认值。此外，initial取值可以用于任何HTML元素上的任何CSS属性。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			div {
				color: red;
				font-size: 30px;
				font-weight: bold;
				padding: 50px;
				margin-top: 10px;
				border: 1px solid silver;
			}

			.select {
				color: initial;
				font-size: initial;
				font-weight: initial;
				padding: initial;
			}
		</style>
	</head>
	<body>
		<div>hello world</div>
		<div>hello world</div>
		<div class="select">hello world</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/acbb80c206ce427cb0c287f08a69ba4f.png)



