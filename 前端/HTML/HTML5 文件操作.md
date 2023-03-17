[toc]

# HTML5 文件操作

## file元素

**语法**

```
<input type="file" />
<input type="file" multiple />
<input type="file" accept="image/jpeg, image/png"/>
```

accept属性用于设置文件的过滤类型（MIME类型）。

**accept属性取值**

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b276ee9d5114434ba647e3855cf3b7e.png)



### 选择单个文件

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <form method="post">
            <input type="file">
        </form>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3855467a27914ced9065c15cfd268b82.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/7260e040e86146a18fbfc33587bf2bb2.png)



### 选择多个文件

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form method="post">
			<input type="file" accept="image/png" multiple>
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3855467a27914ced9065c15cfd268b82.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/0bbb545e77c14860b7f8a2fd7bd21306.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/c25e083bdd654c67a0dde698890de266.png)



### 美化file元素

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <style>
            * {
                margin: 0;
                padding: 0;
            }

            .fileContainer {
                width: 160px;
                margin: 30px auto;
            }

            .filePicker {
                position: relative;
                width: 160px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                color: #ffffff;
                background: #00b7ee;
            }

            .filePicker input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 160px;
                height: 44px;
                opacity: 0;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="fileContainer">
            <div class="filePicker">
                <label>点击选择文件</label>
                <input id="fileInput" type="file" accept=" image/*" />
            </div>
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/88ef5fe8627c4e03a3dea3ffc42e01db.png)

**分析**

首先使用opacity: 0;将表单设置为透明，然后使用绝对定位在表单原来的位置上面定义一个label就可以了。



## File对象

在文件上传元素中，将会产生一个FileList对象，它是一个类数组对象，表示所有文件的集合。其中，每一个文件就是一个File对象。

想要获取某一个文件对象（即File对象），我们首先需要获取FileList对象，然后再通过数组下标形式来获取。

**File对象有以下4个属性**

| 属性             | 说明              |
| ---------------- | ----------------- |
| name             | 文件名            |
| type             | 文件类型          |
| size             | 文件大小，单位为B |
| lastModifiedDate | 文件最后修改修改  |

### 获取文件信息

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oFile = document.getElementById("fileInput");
				oFile.onchange = function() {
					var file = oFile.files[0];
					console.log("图片名为：" + file.name);
					console.log("图片大小为：" + file.size + "B");
					console.log("图片类型为：" + file.type);
					console.log("最后修改时间为：" + file.lastModifiedDate);
				}
			}
		</script>
	</head>
	<body>
		<input id="fileInput" type="file" accept=" image/*" />
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/36e1008310d24527b07a975dec94b89f.png)



### 转化单位

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var unitArr = ["KB", "MB", "GB", "TB"];
				var oFile = document.getElementById("fileInput");
				var oOutput = document.getElementById("output");
				oFile.onchange = function() {
					var file = oFile.files[0];
					var size = file.size;
					var fileSizeStr = size + "B";
					//B转为KB
					size = size / 1024;
					//转化单位
					for (var i = 0; size > 1; i++) {
                        //size.toFixed(2)表示将size值四舍五入，只取两位小数
						fileSizeStr = size.toFixed(2) + unitArr[i];
						size /= 1024;
					}
					oOutput.innerText = fileSizeStr;
				}
			}
		</script>
	</head>
	<body>
		<input id="fileInput" type="file" /><br>
		<output id="output"></output><br>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac106a272ff540718d7984f5a34260b1.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/45a21188a8e14349b4160271880ecf2a.png)



## FileReader对象

在HTML5中，专门提供了一个文件操作的API，即FileReader对象。我们通过FileReader对象可以很方便地读取文件中的数据。

FileReader对象有5个方法，其中4个用来读取文件数据，另外1个用于中断读取操作.

**FileReader方法**

| 方法                 | 说明                                  |
| -------------------- | ------------------------------------- |
| readAsText()         | 将文件读取为文本                      |
| readAsDataURL()      | 将文件读取为DataURL格式的base64字符串 |
| readAsBinaryString() | 将文件读取为二进制编码                |
| readAsArrayBuffer()  | 将文件读取为一个ArrayBuffer对象       |
| abort()              | 中止读取操作                          |

readAsText()方法有两个参数：第1个参数为File对象，第2个参数为文本的编码方式，默认值为“utf-8”。这个方法非常容易理解，表示将文件以文本方式读取，读取的结果就是这个文本文件的内容。

readAsBinaryString()方法将文件读取为二进制字符串，通常我们将它传送到后端，后端可以通过这段字符串来存储文件。

abort()方法可以用来中止读取操作，在读取大文件时，这个方法非常有用。

**FileReader对象的事件**

| 事件        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| onloadstart | 开始读取                                                     |
| onprogress  | 正在读取                                                     |
| onload      | 读取成功。如果读取成功，则this.result的值就文件的内容；否则this.result的值为null。 |
| onloadend   | 读取完成（成功、失败或取消）                                 |
| onabort     | 中断                                                         |
| onerror     | 读取出错                                                     |



### 读取txt文本

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oFile = document.getElementById("fileInput");
				var oOutput = document.getElementById("output");
				oFile.onchange = function() {
					var file = oFile.files[0];
					var fileReader = new FileReader();
					fileReader.readAsText(file, "utf-8");
					fileReader.onload = function() {
						oOutput.innerText = this.result;
					}
				}
			}
		</script>
	</head>
	<body>
		<input id="fileInput" type="file" /><br>
		<output id="output"></output>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d47a565036c14d7fbebb741f7b8c29b8.png)



### 在线预览图片

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oFile = document.getElementById("file");
				var oOutput = document.getElementById("output");
				oFile.onchange = function() {
					var file = oFile.files[0];
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file); //图片转base64
					fileReader.onload = function() {
						var oImg = document.createElement("img");
						oImg.src = this.result;
						console.log(this.result);
						oOutput.appendChild(oImg);
					}
				}
			}
		</script>
	</head>
	<body>
		<input id="file" type="file" /><br>
		<output id="output"></output>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b5872c1cccaf4c418943b5c2fe8ee471.png)



### 拖拽文件并读取

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			#box {
				width: 150px;
				height: 150px;
				border: 1px solid red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBox = document.getElementById("box");
				var oOutput = document.getElementById("output");
				//阻止默认行为
				oBox.ondragover = function(e) {
					e.preventDefault();
				}
				//添加ondrop事件
				oBox.ondrop = function(e) {
					e.preventDefault();
					var file = e.dataTransfer.files[0];
					var reader = new FileReader();
					reader.readAsText(file, "utf-8");
					reader.onload = function() {
						oOutput.innerText = this.result;
					}
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<output id="output"></output>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/700c22b9d1f749d1a58e023ca6ba733e.gif)



### 拖拽图片并预览

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			#box {
				width: 150px;
				height: 150px;
				border: 1px solid red;
			}
		</style>
		<script>
			window.onload = function() {
				var oBox = document.getElementById("box");
				var oOutput = document.getElementById("output");
				//阻止默认行为
				oBox.ondragover = function(e) {
					e.preventDefault();
				}
				//添加ondrop事件
				oBox.ondrop = function(e) {
					e.preventDefault();
					var file = e.dataTransfer.files[0];
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function() {
						var oImg = document.createElement("img");
						oImg.src = this.result;
						oImg.style.width = "150px";
						oImg.style.height = "150px";
						oOutput.appendChild(oImg);
					}
				}
			}
		</script>
	</head>
	<body>
		<div id="box"></div>
		<output id="output"></output>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7020f50348344ad9abea61ace70b510e.gif)



## Blob对象

在HTML5中，还新增了一个Blob对象，用于代表原始二进制数据。前面介绍的File对象也继承于Blob对象。

**语法**

```
var blob = new Blob(dataArray, type);
```

**说明**

dataArray参数：这是一个数组，可以是String对象（即字符串）、Blob对象（即其他Blob对象）、ArrayBuffer对象、ArrayBufferView对象。

type参数：是一个字符串，表示Blob对象的MIME类型。



### 创建并下载txt文件

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oTxt = document.getElementById("txt");
				var oBtn = document.getElementById("btn");
				var oContainer = document.getElementById("container");
				oBtn.onclick = function() {
					var text = oTxt.value;
					if (text == "") {
						return;
					}
					var blob = new Blob([text], {
						type: "text/plain"
					});
					var oA = document.createElement("a");
					var url = window.URL.createObjectURL(blob);
					oA.href = url;
					oA.download = "新文件";
					oA.innerText = "下载文件";
					oContainer.appendChild(oA)
				}
			}
		</script>
	</head>
	<body>
		<textarea id="txt" cols="30" rows="10"></textarea>
		<input id="btn" type="button" value="创建链接">
		<div id="container"></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f04dff5e94a40c9bbc544dbf2c5b8aa.gif)



### 将Canvas下载为一张图片

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var canvas = document.getElementById("canvas");
				var btn = document.getElementById("btn");
				var context = canvas.getContext("2d");
				var text = "hello world";
				context.font = "bold 60px 微软雅黑";
				context.shadowOffsetX = 5;
				context.shadowOffsetY = 5;
				context.shadowColor = "#66ccff";
				context.shadowBlur = 10;
				context.fillStyle = "#ff6699";
				context.fillText(text, 10, 90);
				btn.onclick = function() {
					canvas.toBlob(function(blob) {
						var oA = document.createElement("a");
						var url = window.URL.createObjectURL(blob);
						oA.download = "hello";
						oA.href = url;
						document.body.appendChild(oA);
						oA.click();
						document.body.removeChild(oA);
					}, "image/png", 1);
				}
			}
		</script>
	</head>
	<body>
		<canvas id="canvas" width="380" height="150" style="border:1px solid silver;"></canvas>
		<input id="btn" type="button" value="下载图片">
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb76a1f73f784b0982b60b60d2176e44.png)



