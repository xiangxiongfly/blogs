# CSS3 pointer-events属性

在CSS3中，我们可以使用pointer-events属性来定义元素是否禁用鼠标单击事件。pointer-events属性是一个与JavaScript有关的属性。

**语法**

```
pointer-events: 取值;
```

**pointer-events属性取值**

| 属性值 | 说明                       |
| ------ | -------------------------- |
| auto   | 默认值，不禁用鼠标单击事件 |
| none   | 禁用鼠标单击事件           |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.disable {
				pointer-events: none;
				color: #666666;
			}
		</style>
		<script>
			window.onload = function() {
				var oA = document.getElementsByTagName("a")[0];
				oA.onclick = function() {
					this.className = "disable";
					setTimeout(function() {
						oA.removeAttribute("class");
					}, 3000);
				}
			}
		</script>
	</head>
	<body>
		<a href="javascript:;">发送验证码</a>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e73b430ab7a448fabf5e5141db8e1692.gif)



