[toc]

# JavaScript 事件案例

### 统计输入字符数量

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oTxt = document.getElementById("txt");
				var oNum = document.getElementById("num");
				oTxt.onkeyup = function() {
					var str = oTxt.value;
					oNum.innerHTML = str.length;
				}
			}
		</script>
	</head>
	<body>
		<input id="txt" type="text">
		<div>字符串长度为：<span id="num" style="color:red;">0</span></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b318d8501144860a8f954ce3a881c64.png)



### 验证输入内容

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oTxt = document.getElementById("txt");
				var oNum = document.getElementById("num");
				var reg = /^[0-9]*$/;
				oTxt.onkeyup = function() {
					var str = oTxt.value;
					if (reg.test(str)) {
						oNum.innerText = "输入正确";
					} else {
						oNum.innerText = "请输入数字";
					}
				}
			}
		</script>
	</head>
	<body>
		<input id="txt" type="text">
		<div>字符串长度为：<span id="num" style="color:red;">0</span></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/443eb2dcb84249d2a66985eaf4dfcc34.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5b566bf5e3145778f91514acea28e52.png)



### 搜索框

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var txt = document.getElementById("txt");
				var btn = document.getElementById("btn");

				txt.onfocus = function() {
					if (this.value == "搜索一下") {
						this.value = "";
					}
				}
				txt.onblur = function() {
					if (this.value == "") {
						this.value = "搜索一下";
					}
				}
				btn.onclick = function() {
                    //获取焦点
					txt.focus();
				}
			}
		</script>
	</head>
	<body>
		<input id="txt" type="text" value="搜索一下" />
		<input type="button" id="btn" value="搜索" />
	</body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/59c0e434c99144128deadbcfdf97a3a0.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f4188614f94f49b9bb43e6f01e4853b9.png)



### 复选框的全选和反选

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oFruits = document.getElementsByName("fruit");
				var checkAll = document.getElementById("checkAll");
				var checkBack = document.getElementById("checkBack");
				checkAll.onclick = function() {
					for (var i = 0; i < oFruits.length; i++) {
						oFruits[i].checked = true;
					}
				}
				checkBack.onclick = function() {
					for (var i = 0; i < oFruits.length; i++) {
						oFruits[i].checked = !oFruits[i].checked;
					}
				}
			}
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

![在这里插入图片描述](https://img-blog.csdnimg.cn/92111a63216d4410821da3048f0bbea8.gif)

### 下拉列表

当我们选择下拉列表的某一项时，就会触发onchange事件，然后就会在新的窗口打开对应的页面。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var list = document.getElementById("list");
				list.onchange = function() {
					var link = this.options[this.selectedIndex].value;
					window.open(link);
				}
			}
		</script>
	</head>
	<body>
		<select id="list">
			<option value="https://www.baidu.com">百度</option>
			<option value="https://www.tencent.com/zh-cn/">腾讯</option>
			<option value="https://www.aliyun.com/">阿里</option>
		</select>
	</body>
</html>
```

### 自定义鼠标右键菜单

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>使用oncontextmenu事件自定义右键菜单</title>
		<style>
			#div1 {
				width: 120px;
				height: 200px;
				border: 1px solid #CCC;
				position: absolute;
				display: none;
				text-align: center;
			}

			ul {
				padding: 5px 0;
			}

			li {
				list-style: none;
				margin: 20px;
			}

			a {
				text-decoration: none;
				color: #000;
			}
		</style>
		<script>
			window.onload = function() {
				var oDiv = document.getElementById('div1');
				//单击右键阻止默认的上下文菜单弹出，而弹出自定义的上下文菜单
				document.oncontextmenu = function(ev) {
					var ev = ev || event;
					oDiv.style.display = 'block'; //显示div
					//设置弹出的div的left和top为单击鼠标光标处的位置
					oDiv.style.left = ev.clientX + 'px';
					oDiv.style.top = ev.clientY + 'px';
					return false; //阻止浏览器的默认行为
				};

				//点击空白处隐藏菜单
				document.onclick = function() {
					oDiv.style.display = 'none';
				};
			};
		</script>
	</head>
	<body>
		<div id="div1">
			<ul>
				<li><a href="#">刷 新</a></li>
				<li><a href="#">资源下载</a></li>
				<li><a href="#">联系我们</a></li>
			</ul>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8636606b16d42c5a531a72f6b5b900b.png)

### ctrl+enter发送消息

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>按Enter键发送信息</title>
		<style>
			ul {
				width: 300px;
				border: 1px solid silver;
			}
		</style>
		<script>
			window.onload = function() {
				var oText = document.getElementById('text1');
				var oUl = document.getElementById('ul1');
				oText.onkeyup = function(e) {
					var e = e || event;
					if (this.value != "") {
						if (e.keyCode == 13 && e.ctrlKey) {
							var oLi = document.createElement('li');
							oLi.innerText = oText.value;
							if (oUl.children[0]) {
								oUl.insertBefore(oLi, oUl.children[0]);
							} else {
								oUl.appendChild(oLi);
							}
							oText.value = "";
						}
					}
				};
			};
		</script>
	</head>
	<body>
		<ul id="ul1"></ul>
		<input type="text" id="text1" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0d74df4a9b9e49c99e4010ab7883dec0.png)

### 规定范围内拖拽元素

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>规定范围内拖拽元素</title>
		<style>
			#div1 {
				width: 100px;
				height: 100px;
				background: red;
				border: 5px solid green;
				position: absolute;
				left: 0;
				top: 0;
			}
		</style>
		<script>
			window.onload = function() {
				var oDiv = document.getElementById("div1");
				oDiv.onmousedown = function(e) {
					var e = e || event;
					//目标元素上鼠标距离左上顶点的偏移值
					var dx = e.clientX - this.offsetLeft;
					var dy = e.clientY - this.offsetTop;
					document.onmousemove = function(e) {
						var e = e || event;
						//确定目标元素的左上顶点
						var left = e.clientX - dx;
						var top = e.clientY - dy;
						//限制范围
						if (left < 0) {
							left = 0;
						} else if (left > document.documentElement.clientWidth - oDiv.offsetWidth) {
							left = document.documentElement.clientWidth - oDiv.offsetWidth;
						}
						if (top < 0) {
							top = 0;
						} else if (top > document.documentElement.clientHeight - oDiv.offsetHeight) {
							top = document.documentElement.clientHeight - oDiv.offsetHeight;
						}
						oDiv.style.left = left + "px";
						oDiv.style.top = top + "px";
					}
					document.onmouseup = function() {
						document.onmousemove = null;
					}
					return false; //阻止默认行为
				};
			};
		</script>
	<body>
		<div id="div1"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b620f7da12e34290ba6df5998c51aaed.gif)

### 两元素碰撞切换图片

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>规定范围内拖拽元素</title>
		<style>
			#div1 {
				width: 100px;
				height: 100px;
				background: red;
				border: 5px solid green;
				position: absolute;
				left: 0;
				top: 0;
			}

			#img1 {
				position: absolute;
				left: 200px;
				top: 120px;
				border: 1px dashed silver;
			}
		</style>
		<script>
			window.onload = function() {
				var oDiv = document.getElementById("div1");
				var oImg = document.getElementById("img1");

				var imgLeft = oImg.offsetLeft;
				var imgRight = imgLeft + oImg.offsetWidth;
				var imgTop = oImg.offsetTop;
				var imgBottom = imgTop + oImg.offsetHeight;

				oDiv.onmousedown = function(e) {
					var e = e || event;
					//目标元素上鼠标距离左上顶点的偏移值
					var dx = e.clientX - this.offsetLeft;
					var dy = e.clientY - this.offsetTop;
					console.log(dx + "-" + dy);
					document.onmousemove = function(e) {
						var e = e || event;
						//获取目标元素的左上右下顶点
						var left = e.clientX - dx;
						var right = left + oDiv.offsetWidth;
						var top = e.clientY - dy;
						var bottom = top + oDiv.offsetHeight;

						//判断是否碰撞
						if (right < imgLeft || left > imgRight || bottom < imgTop || top > imgBottom) {
							//不碰撞
							oImg.src = "img/apple_pic.png";
						} else {
							//碰撞
							oImg.src = "img/banana_pic.png";
						}

						oDiv.style.left = left + "px";
						oDiv.style.top = top + "px";
					}
					document.onmouseup = function() {
						document.onmousemove = null;
					}
					return false; //阻止默认行为
				};
			};
		</script>
	<body>
		<div id="div1"></div>
		<img id="img1" src="img/apple_pic.png" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a7f4c201f1f448a8872d6d98f2ac57e8.gif)

### 内容滚动条

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			#box {
				border: 1px solid silver;
				width: 218px;
				height: 198px;
				position: absolute;
			}

			#sliderBox {
				width: 30px;
				height: 198px;
				background: grey;
				position: absolute;
				right: 0;
				top: 0;
			}

			#slider {
				width: 30px;
				height: 30px;
				background: black;
				position: absolute;
				left: 0;
				top: 0;
			}

			#contentBox {
				width: 168px;
				height: 198px;
				position: absolute;
				left: 10px;
				top: 0;
				overflow: hidden;
			}

			#content {
				position: absolute;
				left: 0;
				top: 0;
			}
		</style>
		<script>
			window.onload = function() {
				var sliderBox = document.getElementById("sliderBox");
				var slider = document.getElementById("slider");
				var contentBox = document.getElementById("contentBox");
				var content = document.getElementById("content");
				var maxTop = sliderBox.offsetHeight - slider.offsetHeight; //滑块最大滚动范围

				slider.onmousedown = function(ev) {
					var ev = ev || event;
					//鼠标在滑块上的偏移值
					var dy = ev.clientY - this.offsetTop;
					document.onmousemove = function(ev) {
						var ev = ev || event;
						var top = ev.clientY - dy; //滑块距离顶部距离
						if (top < 0) {
							top = 0;
						} else if (top > maxTop) {
							top = maxTop;
						}
						slider.style.top = top + "px";
						var scale = top / maxTop; //求滚动条每次滚动后的top值与最大top值的比率
						//滚动条滚动时，包含内容的div的top值
						content.style.top = (contentBox.offsetHeight - content.offsetHeight) * scale + "px";
					};
					document.onmouseup = function() {
						document.onmousemove = null;
					};
					return false;
				};
			};
		</script>
	</head>
	<body>
		<div id="box">
			<div id="sliderBox">
				<div id="slider"></div>
			</div>
			<div id="contentBox">
				<div id="content">
					这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。
					这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。
					这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。 这是一些内容。
				</div>
			</div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/494994f918a746f3a5fdca41cb21fecb.gif)

### 鼠标滚动缩放图片

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>使用鼠标滚轮事件实现对指定图片的缩放</title>
		<style type="text/css">
			img {
				position: fixed;
				border: 1px solid silver;
			}
		</style>
		<script>
			window.onload = function() {
				var oImg = document.getElementById('img1');
				oImg.onmousewheel = fn; //对IE及chrome有效
				if (oImg.addEventListener) { //对FF有效
					oImg.addEventListener('DOMMouseScroll', fn, false);
				}

				function fn(ev) {
					var ev = ev || event;
					var b = true; //将滚轮向上和向下滚动得到的正负值转换为boolean值
					console.log(ev.wheelDelta);
					if (ev.wheelDelta) {
						b = ev.wheelDelta > 0 ? true : false;
					} else {
						b = ev.detail < 0 ? true : false;
					}
					if (b) {
						//b为true表示上滑，缩小
						this.style.width = this.offsetWidth - 10 + 'px';
					} else {
						//b为false表示下滑，放大
						this.style.width = this.offsetWidth + 10 + 'px';
					}
					//取消由addEventListener()绑定的鼠标滚动时滚动条默认会滚动的事件
					if (ev.preventDefault) {
						ev.preventDefault();
					}
					//取消由obj.onmousewheel = fn形式绑定的鼠标滚动时滚动条默认会滚动的事件
					return false;
				}
			};
		</script>
	</head>
	<body style="height:2000px">
		<img src="img/apple_pic.png" id="img1" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bea7c7289a514e4cb4848ddbeb22aa5f.gif)