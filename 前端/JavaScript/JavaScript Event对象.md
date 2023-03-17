[toc]

# JavaScript Event对象

## 概述

事件在浏览器中是以Event对象的形式存在的，每触发一个事件，就会产生一个Event对象。该对象包含所有与事件相关的信息，包括事件的元素、事件的类型及其他与特定事件相关的信息。

## Event对象属性方法

### event对象常用属性

| 属性     | 说明            |
| -------- | --------------- |
| type     | 事件类型        |
| keyCode  | 键盘值          |
| shiftKey | 是否按下shift键 |
| ctrlKey  | 是否按下ctrl键  |
| alKey    | 是否按下alt键   |

### type

在JavaScript中，当调用一个事件时，JS会给这个事件函数添加一个隐藏对象，也就是event对象。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oBtn = document.getElementById("btn");
				oBtn.onclick = function(event) {
					console.log(event.type); //click
				}
			}
		</script>
	</head>
	<body>
		<input id="btn" type="button" value="按钮" />
	</body>
</html>
```

### keyCode

| 按键 | 键码 |
| ---- | ---- |
| W    | 87   |
| S    | 83   |
| A    | 65   |
| D    | 68   |
| ↑    | 38   |
| ↓    | 40   |
| ←    | 37   |
| →    | 39   |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var direction = document.getElementById("direction");
				window.onkeydown = function(e) {
					if (e.keyCode == 38 || e.keyCode == 87) {
						direction.innerText = "上"
					} else if (e.keyCode == 39 || e.keyCode == 68) {
						direction.innerText = "右";
					} else if (e.keyCode == 40 || e.keyCode == 83) {
						direction.innerText = "下";
					} else if (e.keyCode == 37 || e.keyCode == 65) {
						direction.innerText = "左";
					} else {
						direction.innerText = "";
					}
				}
			}
		</script>
	</head>
	<body>
		<div>方向：<span id="direction" style="color:red;"></span></div>
	</body>
</html>
```



## 获取Event对象

在给元素绑定特定的事件处理程序时，可以获取到Event对象，但是考虑到不同浏览器的差异性，获取Event对象的方式也不同。

获取Event对象的方式有以下两种：

- 在事件处理程序中，Event对象会作为参数传入，参数名为event。
- 在事件处理程序中，通过window.event属性获取Event对象。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var direction = document.getElementById("direction");
				window.onkeydown = function(e) {
					var e = e || event; //兼容处理
					if (e.keyCode == 38 || e.keyCode == 87) {
						direction.innerText = "上"
					} else if (e.keyCode == 39 || e.keyCode == 68) {
						direction.innerText = "右";
					} else if (e.keyCode == 40 || e.keyCode == 83) {
						direction.innerText = "下";
					} else if (e.keyCode == 37 || e.keyCode == 65) {
						direction.innerText = "左";
					} else {
						direction.innerText = "";
					}
				}
			}
		</script>
	</head>
	<body>
		<div>方向：<span id="direction" style="color:red;"></span></div>
	</body>
</html>
```

#### 兼容代码

```javascript
var EventUtil = {
    // 获取事件对象
    getEvent: function(event) {
        return event || window.event;
    }
};
```



## 获取事件的目标对象

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script>
            var EventUtil = {
                // 获取事件对象
                getEvent: function(event) {
                    return event || window.event;
                },
                getTarget: function(event) {
                    return event.target || event.srcElement;
                }
            };
            window.onload = function() {
                var btn = document.getElementById("btn");
                btn.addEventListener("click", function(e) {
                    var event = EventUtil.getEvent(e);
                    var target = EventUtil.getTarget(event);
                    console.log(target);
                });

            }
        </script>
    </head>
    <body>
        <input id="btn" type="button" value="提交">
    </body>
</html>
```

#### target属性和currentTarget属性

target属性和currentTarget属性。两者都可以表示事件的目标元素，但是在事件流中两者却有不同的意义。

- target属性在事件目标阶段，理解为真实操作的目标元素。
- currentTarget属性在事件捕获、事件目标、事件冒泡这3个阶段，理解为当前事件流所处的某个阶段对应的目标元素。

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<table border="1">
			<tbody>
				<tr>
					<td>这是td的元素</td>
				</tr>
			</tbody>
		</table>
		<script type="text/javascript">
			var EventUtil = {
				// 获取事件对象
				getEvent: function(event) {
					return event || window.event;
				},
				getTarget: function(event) {
					return event.target || event.srcElement;
				}
			};
			// 获取target属性和currentTarget属性的元素标签名
			function getTargetAndCurrentTarget(event, stage) {
				var event = EventUtil.getEvent(event);
				var stageStr;
				if (stage === 'bubble') {
					stageStr = '事件冒泡阶段';
				} else if (stage === 'capture') {
					stageStr = '事件捕获阶段';
				} else {
					stageStr = '事件目标阶段';
				}
				console.log(stageStr,
					'target:' + event.target.tagName.toLowerCase(),
					'	currentTarget: ' + event.currentTarget.tagName.toLowerCase());
			}

			var table = document.querySelector("table");
			var tbody = document.querySelector("tbody");
			var tr = document.querySelector("tr");
			var td = document.querySelector("td");

			// 事件捕获
			table.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'capture');
			}, true);

			// 事件捕获
			tbody.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'capture');
			}, true);

			// 事件捕获
			tr.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'capture');
			}, true);

			// 事件捕获
			td.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'target');
			}, true);

			// 事件冒泡
			table.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'bubble');
			}, false);

			// 事件冒泡
			tbody.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'bubble');
			}, false);

			// 事件冒泡
			tr.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'bubble');
			}, false);

			// 事件冒泡
			td.addEventListener('click', function(event) {
				getTargetAndCurrentTarget(event, 'target');
			}, false);
		</script>
	</body>
</html>
```

说明：在事件流的任何阶段，target属性始终指向的是实际操作的元素。因为我们是在td元素上进行的单击操作，所以target属性对应的是td。

在事件流的事件捕获阶段或者事件冒泡阶段，currentTarget指向的是事件流所处的某个特定阶段对应的元素。在该实例中，事件捕获阶段元素的流转顺序为table>tbody>tr，事件冒泡阶段元素的流转顺序为tr>tbody>table。

在事件目标阶段，currentTarget属性指向的也是实际操作的元素，即td。因此只有在事件目标阶段，target属性和currentTarget属性才指向同一个元素。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9bfa6175b8b147b1adb4ab3ec97440d7.png)



