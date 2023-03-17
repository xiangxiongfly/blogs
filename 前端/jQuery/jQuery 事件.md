[TOC]

# jQuery 事件

## 概述

在jQuery中，一个事件由3部分组成：

- 事件主角：div、button？
- 事件类型：点击、移动？
- 事件过程：事件函数？



## 常用事件

### 页面事件

### ready()

JavaScript中onload表示文档加载完后执行的一个事件，jQuery的ready事件与onload是一样的。jQuery的ready事件是可以多次执行的。

但是，jQuery的ready事件仅仅是DOM元素加载完成就可以执行，而JavaScript的onload事件在DOM元素加载完成后还需要等所有外部文件也加载完成才可以执行。

因此，jQuery的ready事件相对于JavaScript的onload事件来说，极大地提高页面的响应速度，有着更好的用户体验。

**语法**

```
//写法1：
$(document).ready(function(){ 
    …… 
}) 
 
//写法2： 
jQuery(document).ready(function(){ 
    …… 
}) 
 
//写法3： 
$(function(){ 
    ……  
}) 
 
//写法4： 
jQuery(function(){ 
    …… 
}) 
```

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				console.log("第一次调用");
			})
			$(function() {
				console.log("第二次调用");
			})
			$(function() {
				console.log("第三次调用");
			})
		</script>
	</head>
	<body>
	</body>
</html>
```

注：依次输出”第一次调用“，”第二次调用“，”第三次调用“。



### 鼠标事件

| 事件      | 说明         |
| --------- | ------------ |
| click     | 鼠标单击事件 |
| mouseover | 鼠标移入事件（会冒泡） |
| mouseout  | 鼠标移出事件（会冒泡） |
| mouseenter  | 鼠标移入事件（不会冒泡） |
| mouseleave  | 鼠标移出事件（不会冒泡） |
| mousedown | 鼠标按下事件 |
| mouseup   | 鼠标抬起事件 |
| mousemove | 鼠标移动事件 |

鼠标事件非常多，这里我们只列出最实用的，以免增加大家的记忆负担。从上表可以看出，jQuery事件比JavaScript事件只是少了“on”这个前缀。例如鼠标单击事件在JavaScript中是onclick，而在jQuery中是click。

#### 自动触发点击事件

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function() {
					alert("hello");
				}).click();
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```

#### mouseover 和 mouseenter 区别

当鼠标滑过这个元素，会触发**mouseover()**方法，滑过它的子元素时，同样会再次出发**mouseover()**方法；但是，**mouseenter()**方法确实只在该元素本身被滑过时才被触发，该元素的子元素被划过时，**mouseenter()**函数是不会被触发的。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>mouseover与mouseenter事件</title>
	</head>
	<style>
		#box1 {
			width: 100px;
			height: 200px;
			background: #ccc;
		}

		#box1 div {
			width: 100px;
			height: 100px;
			background: #B3CD57;
		}

		#box2 {
			width: 100px;
			height: 200px;
			background: #ccc;
		}

		#box2 div {
			width: 100px;
			height: 100px;
			background: #B3CD57;
		}
	</style>
	<script src="js/jquery-1.12.4.min.js"></script>
	<script>
		$(function() {
			$("#box1").mouseover(function() {
				console.log("box1移入");
			}).mouseout(function() {
				console.log("box1移出");
			});
			$("#box2").mouseenter(function() {
				console.log("box2移入");
			}).mouseleave(function() {
				console.log("box2移出");
			});
		})
	</script>
	<body>
		<div id="box1">
			<div>box1</div>
		</div>
		<br>
		<div id="box2">
			<div>box2</div>
		</div>
	</body>
</html>
```



### 键盘事件

| 事件    | 说明     |
| ------- | -------- |
| keydown | 键盘按下 |
| keyup   | 键盘抬起 |



### 表单事件

| 事件   | 说明                                   |
| ------ | -------------------------------------- |
| focus  | 获取焦点时触发事件                     |
| blur   | 失去焦点时触发事件                     |
| selct  | 选中文本框中的内容时触发事件           |
| change | 单选框、多选框、下拉菜单选中时触发事件 |



### 编辑事件

在jQuery中，常用的编辑事件只有一种，那就是contextmenu事件。

contextmenu事件在大多数情况下都是用来保护版权的。



### 滚动事件

滚动事件，指的是拉动页面滚动条时所触发的事件。滚动事件非常有用，特别是在“回顶部特效”以及“扁平化页面动画”中会大量用到。

`scroll()`方法经常配合`scrollTop()`方法一起使用。`scroll()`方负责滚动监听，`scrollTop()`负责获取距离。

**语法**

```
$(元素).scroll(function() {
	...
}
```

#### 固定栏目

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				height: 1000px;
			}

			div {
				display: inline-block;
				width: 100px;
				height: 100px;
			}

			#box1 {
				background-color: red;
			}

			#box2 {
				background-color: blue;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var top = $("#box2").offset().top;
				$(window).scroll(function() {
					if ($(this).scrollTop() > top) {
						$("#box2").css({
							"position": "fixed",
							"top": "0"
						});
					} else {
						$("#box2").css({
							"position": "relative",
						});
					}
				});
			})
		</script>
	</head>
	<body>
		<div id="box1"></div><br>
		<div id="box2"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/94c4f77e7cbb4e8183a41ac80f91cb1d.gif)



## 事件

### 绑定事件

jQuery中的`click()`方法类似于JavaScript中的`onclick`属性，jQuery中的`on()`方法类似于JavaScript的`addEventListener()`方法。

**语法**

```
$(元素).on("事件名",函数)
```

**添加绑定事件**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").on("click", function() {
					alert("hello");
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```

**动态创建的元素添加绑定事件**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var $btn = $("<input id='btn' type='button' value='按钮'>");
				$($btn).appendTo("body")
				$($btn).on("click", function() {
					alert("hello");
				});
			})
		</script>
	</head>
	<body>
	</body>
</html>
```



### 解绑事件

**语法**

```
$(元素).off("事件名")
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				//添加事件
				$("#btn").on("click", function() {
					alert("hello");
				});
				//解绑事件
				$("btn-off").click(function() {
					$("#btn").off("click");
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
		<input id="btn-off" type="button" value="解绑">
	</body>
</html>
```



### 合成事件

**语法**

```
$(元素).hover(函数1, 函数2)
```

**说明**

函数1表示鼠标移入时触发函数，函数2表示鼠标移出时触发函数。

替代了`mouseenter()`和`mouseleave()`方法。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("div").hover(function() {
					$(this).css("color", "red");
				}, function() {
					$(this).css("color", "green");
				});
			})
		</script>
	</head>
	<body>
		<div>hello world</div>
	</body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b1fa2b08a414cf2aa8813a9437b0eaf.gif)



### 一次事件

**语法**

```
$(元素).one("事件名", 函数)
```

**说明**

`one()`方法可以为元素添加一个只会触发一次的事件。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").one("click", function() {
					alert("hello");
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```



### 自定义事件

**说明**

在jQuery中，可以通过`on()`方法来自定义一个事件，然后通过`trigger()`方法来触发这个自定义事件。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").on("delay", function() {
					setTimeout(function() {
						alert("hello");
					}, 2000);
				});
				$("#btn").click(function() {
					$("#btn").trigger("delay");
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```



### event对象

**event对象的属性**

| 属性         | 说明             |
| ------------ | ---------------- |
| type         | 事件类型         |
| target       | 事件元素         |
| which        | 鼠标左、中、右键 |
| pageX、pageY | 鼠标在页面的坐标 |
| shiftKey     | 是否按下shift键  |
| ctrlKey      | 是否按下ctrl键   |
| altKey       | 是否按下alt键    |
| keyCode      | 键码值           |

#### event.type

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").click(function(e) {
					console.log(e.type); //click
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```

#### event.target

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("a").click(function(e) {
					var url = $(e.target).attr("href");
					console.log(url); //http://www.baidu.com
					return false; //return false可以阻止超链接跳转
				});
			})
		</script>
	</head>
	<body>
		<a href="http://www.baidu.com">百度</a>
	</body>
</html>
```

#### event.which

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#btn").mousedown(function(e) {
					switch (e.which) {
						case 1:
							console.log("左键");
							break;
						case 2:
							console.log("中键");
							break;
						case 3:
							console.log("右键");
							break;
					}
				});
			})
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="点击">
	</body>
</html>
```

#### event.pageX 和 event.pageY

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$(document).mousemove(function(e) {
					var x = e.pageX;
					var y = e.pageY;
					var result = "鼠标点坐标X：" + x + " Y：" + y;
					$("body").text(result);
				});
			})
		</script>
	</head>
	<body>
	</body>
</html>
```

#### keyCode

**常用的按键及对应的键码**

![在这里插入图片描述](https://img-blog.csdnimg.cn/87fe725ce491481b85871424f124786e.png)

**禁止使用Shift、Ctrl、Alt键**

```html
<!DOCTYPE html>
<html> 
<head> 
    <meta charset="utf-8" /> 
    <title></title> 
    <script src="js/jquery-1.12.4.min.js"></script> 
    <script> 
        $(function () { 
            $(document).keydown(function(e){ 
                if (e.shiftKey || e.altKey || e.ctrlKey) { 
                    alert("禁止使用Shift、Ctrl、Alt键！") 
                } 
            }) 
        }) 
    </script> 
</head> 
<body> 
    <div>hello world</div> 
</body> 
</html> 
```

**获取“上”“下”“左”“右”方向键**

```html
<!DOCTYPE html>
<html> 
    <head> 
        <meta charset="utf-8" /> 
        <title></title> 
        <script src="js/jquery-1.12.4.min.js"></script> 
        <script> 
            $(function () { 
                $(window).keydown(function(e){ 
                    if (e.keyCode == 38 || e.keyCode == 87) { 
                        $("span").text("上"); 
                    } else if (e.keyCode == 39 || e.keyCode == 68) { 
                        $("span").text("右"); 
                    } else if (e.keyCode == 40 || e.keyCode == 83) { 
                        $("span").text("下"); 
                    } else if (e.keyCode == 37 || e.keyCode == 65) { 
                        $("span").text("左"); 
                    } else { 
                        $("span").text(""); 
                    } 
                }) 
            }) 
        </script> 
    </head> 
    <body> 
        <div>你控制的方向是： 
            <span style="color:red;"></span> 
        </div> 
    </body> 
</html> 
```



### this

原生JavaScript中的this是非常复杂的。不过在jQuery中，this的使用相对来说简单一点。jQuery中的this大多数是用于事件操作中。

在jQuery中的thisthis始终指向触发当前事件的元素。

```html
<!DOCTYPE html>
<html> 
    <head> 
        <meta charset="utf-8" /> 
        <title></title> 
        <script src="js/jquery-1.12.4.min.js"></script> 
        <script> 
            $(function () { 
                $("div").click(function(){ 
                    //$(this)等价于$("div") 
                    $(this).css("color", "red"); 
                }) 
                $("p").click(function () { 
                    //$(this)等价于$("p") 
                    $(this).css("color", "blue"); 
                }) 
            }) 
        </script> 
    </head> 
    <body> 
        <div>hello</div> 
        <p>world</p> 
    </body> 
</html> 
```



## 案例

### 统计输入字符的长度

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#txt").keyup(function() {
					var str = $(this).val();
					$("#num").text(str.length);
				});
			})
		</script>
	</head>
	<body>
		<input id="txt" type="text" />
		<div>字符串长度：<span id="num">0</span></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/52c77ba0122c43e086f3e4e123c280a1.png)



### 验证输入是否正确

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var reg = /^[0-9]*$/;
				$("#txt").keyup(function() {
					var str = $(this).val();
					if (reg.test(str)) {
						$("#tip").text("输入正确");
					} else {
						$("#tip").text("必须输入数字");
					}
				});
			})
		</script>
	</head>
	<body>
		<input id="txt" type="text" />
		<div id="tip"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/de2254060af342a68fd0c4d99649a2a8.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/75a6707ae8ba460db481f70986a8a766.png)



### 搜索框

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				var txt = $("#search").val();
				$("#search").focus(function() {
					if ($(this).val() == txt) {
						$(this).val("");
					}
				}).blur(function() {
					if ($(this).val() == "") {
						$(this).val(txt);
					}
				});
				$("#btn").click(function() {
					$("#search").focus();
				});
			})
		</script>
	</head>
	<body>
		<input id="search" type="text" value="搜索一下" />
		<input id="btn" type="button" value="搜索">
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/11f0b21f9cb34c9ca6285e93f3564710.png)



### 全选文本框

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#search").click(function() {
					$(this).select();
				});
			})
		</script>
	</head>
	<body>
		<input id="search" type="text" placeholder="搜索一下" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf26a3d16e4d4dba9e055659cfb3687d.png)



### 复选框的全选和反选

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("#checkAll").change(function() {
					$("input:checkbox").prop("checked", true);
				});
				$("#checkBack").change(function() {
					$("input:checkbox").each(function(index, element) {
						$(element).prop("checked", !$(element).prop("checked"));
					});
				});
			})
		</script>
	</head>
	<body>
		<div>
			<p>你喜欢的水果：</p>
			<label><input type="checkbox" name="fruit">苹果</label>
			<label><input type="checkbox" name="fruit">橘子</label>
			<label><input type="checkbox" name="fruit">香蕉</label>
		</div>
		<br>
		<div>
			<label><input id="checkAll" type="radio" name="select">全选</label>
			<label><input id="checkBack" type="radio" name="select">反选</label>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/62ad0471ea8243939b4cb8fa835bcb72.png)



### 下拉列表

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("select").change(function() {
					var url = $("option:selected").val();
					window.open(url);
				});
			})
		</script>
	</head>
	<body>
		<select>
			<option value="https://www.baidu.com">百度</option>
			<option value="https://www.tencent.com">腾讯</option>
			<option value="https://www.aliyun.com">阿里</option>
		</select>
	</body>
</html>
```



### 返回顶部特效

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				height: 1800px;
			}

			div {
				position: fixed;
				right: 50px;
				bottom: 50px;
				display: none;
				width: 40px;
				height: 40px;
				color: white;
				background-color: #45b823;
				font-family: 微软雅黑;
				font-size: 15px;
				font-weight: bold;
				text-align: center;
				cursor: pointer;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$(window).scroll(function() {
					if ($(this).scrollTop() > 300) {
						$("div").css("display", "inline-block");
					} else {
						$("div").css("display", "none");
					}
				});

				$("div").click(function() {
					$("html,body").scrollTop(0);
				});
			})
		</script>
	</head>
	<body>
		<h3>hello world</h3>
		<div>回到顶部</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1f1b89fb89c46da819e7263d4b177e8.gif)



### 鼠标经过显示详细内容

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			h3 {
				height: 40px;
				line-height: 40px;
				text-align: center;
				background-color: #ddd;
				cursor: pointer;
			}

			div {
				display: none;
				padding: 10px;
				border: 1px solid silver;
				text-indent: 32px;
			}
		</style>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				$("h3").hover(function() {
					$("div").css("display", "block");
				}, function() {
					$("div").css("display", "none");
				});
			})
		</script>
	</head>
	<body>
		<h3>hello world</h3>
		<div>
			这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。这是一些内容。
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/217833e40734400d9801cbdf55688dae.gif)

