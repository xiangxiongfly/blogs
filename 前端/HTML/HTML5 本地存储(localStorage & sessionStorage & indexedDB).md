[toc]

# HTML5 本地存储(localStorage & sessionStorage)

## Cookie的缺点

在HTML4.01中，想要在浏览器端存储用户的某些数据时，我们一般只能使用Cookie来实现。

但是Cookie存在一些问题：

- 大小限制：大多数浏览器支持最大为4KB的Cookie。
- 数量限制：大多数浏览器只允许每个站点存储20个Cookie，如果想要存储更多Cookie，则旧的Cookie将会被丢弃。
- 有些浏览器还会对它们将接收的来自所有站点的Cookie总数做出绝对限制，通常为300个。
- Cookie默认情况下都会随着HTTP请求发送到后台，但是实际上大多数请求都是不需要Cookie的。

为了解决Cookie这种方式的限制，HTML5新增了3种全新的数据存储方式：localStorage、sessionStorage和indexedDB：

- localStorage用于永久保存客户端的少量数据。
- sessionStorage用于临时保存客户端的少量数据。
- indexedDB用于永久保存客户端的大量数据。



## localStorage

### 简介

在HTML5中，我们可以使用localStorage对象来“永久”保存客户端的少量数据。即使浏览器被关闭了，使用localStorage对象保存的数据也不会丢失，下次打开浏览器访问网站时仍然可以继续使用。

对于localStorage来说，每一个域名可以保存5MB数据，现在绝大多数浏览器都已经支持localStorage。

localStorage对象的常用方法有5种：

| 方法                | 说明                 |
| ------------------- | -------------------- |
| setItem(key, value) | 保持数据             |
| getItem(key)        | 获取数据             |
| removeItem(key)     | 删除数据             |
| clear()             | 清空所有数据         |
| key(n)              | 获取第n个值，n为整数 |

### 简单使用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			table {
				border-collapse: collapse;
			}

			table td {
				width: 100px;
				line-height: 30px;
				border: 1px solid #000;
				text-align: center;
			}
		</style>
		<script>
			function Item(key, value) {
				this.key = key;
				this.value = value;
			}

			var arr = [];

			function setTable() {
				queryLocal();
				var tbody = document.querySelector("tbody");
				var html = "";
				arr.forEach(function(value, index, array) {
					html += `<tr>`;
					html += `<td>${value.key}</td>`;
					html += `<td>${value.value}</td>`;
					html += `<td><button index="${index}">删除</button></td>`;
					html += `</tr>`;
				})
				tbody.innerHTML = html;
				setDelBtn();
			}

			function setDelBtn() {
				var delBtns = document.querySelectorAll("tbody button");
				for (var i = 0; i < delBtns.length; i++) {
					delBtns[i].onclick = function() {
						var index = this.getAttribute("index");
						var delArr = arr.splice(index, 1);
						delArr.forEach(function(value, index, array) {
							deleteLocal(value.key);
						})
						setTable();
					}
				}
			}

			/**
			 * localStorage添加数据
			 */
			function addLocal(key, value) {
				localStorage.setItem(key, value);
			}

			/**
			 * localStorage删除数据
			 */
			function deleteLocal(key) {
				localStorage.removeItem(key);
			}

			/**
			 * localStorage清空数据
			 */
			function clearLocal() {
				localStorage.clear();
			}

			/**
			 * localStorage获取所有数据
			 */
			function queryLocal() {
				arr = [];
				for (var i = 0; i < localStorage.length; i++) {
					var key = localStorage.key(i);
					var value = localStorage.getItem(key);
					arr.push(new Item(key, value));
				}
			}

			window.onload = function() {
				var keyInput = document.getElementById("keyInput");
				var valueInput = document.getElementById("valueInput");
				var addBtn = document.getElementById("addBtn");
				var queryBtn = document.getElementById("queryBtn");
				var clearBtn = document.getElementById("clearBtn");
				var table = document.getElementById("table");

				addBtn.onclick = function() {
					addLocal(keyInput.value, valueInput.value);
					keyInput.value = "";
					valueInput.value = "";
					setTable();
				}
				queryBtn.onclick = function() {
					setTable();
				}
				clearBtn.onclick = function() {
					clearLocal();
					setTable();
				}
			}
		</script>
	</head>
	<body>
		<p><label>key: <input id="keyInput" type="text"></label></p>
		<p><label>value: <input id="valueInput" type="text"></label></p>
		<p>
			<input id="addBtn" type="button" value="增加">
			<input id="queryBtn" type="button" value="查询">
			<input id="clearBtn" type="button" value="清空">
		</p>
		<table id="table">
			<thead>
				<tr>
					<td>key值</td>
					<td>value值</td>
					<td>删除</td>
				</tr>
			</thead>
			<tbody> </tbody>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c469470fd2804aaaa7d03c01b3513a04.png)



## sessionStorage

### 简介

在HTML5中，我们可以使用sessionStorage对象来“暂时”保存客户端的少量数据。sessionStorage对象跟localStorage对象非常相似，两者有着完全相同的方法。

| 方法                | 说明                 |
| ------------------- | -------------------- |
| setItem(key, value) | 保持数据             |
| getItem(key)        | 获取数据             |
| removeItem(key)     | 删除数据             |
| clear()             | 清空所有数据         |
| key(n)              | 获取第n个值，n为整数 |

sessionStorage对象跟localStorage对象也有本质上的区别：sessionStorage对象保存的是“临时数据”，用户关闭浏览器后，数据就会丢失；而localStorage对象保存的是“永久数据”，用户关闭浏览器后，数据依然存在。

此外，localStorage和sessionStorage都是window对象下的子对象。也就是说，localStorage.getItem()其实是window.localStorage.getItem()的简写。



### 简单使用

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style>
			table {
				border-collapse: collapse;
			}

			table td {
				width: 100px;
				line-height: 30px;
				border: 1px solid #000;
				text-align: center;
			}
		</style>
		<script>
			function Item(key, value) {
				this.key = key;
				this.value = value;
			}

			var arr = [];

			function setTable() {
				queryLocal();
				var tbody = document.querySelector("tbody");
				var html = "";
				arr.forEach(function(value, index, array) {
					html += `<tr>`;
					html += `<td>${value.key}</td>`;
					html += `<td>${value.value}</td>`;
					html += `<td><button index="${index}">删除</button></td>`;
					html += `</tr>`;
				})
				tbody.innerHTML = html;
				setDelBtn();
			}

			function setDelBtn() {
				var delBtns = document.querySelectorAll("tbody button");
				for (var i = 0; i < delBtns.length; i++) {
					delBtns[i].onclick = function() {
						var index = this.getAttribute("index");
						var delArr = arr.splice(index, 1);
						delArr.forEach(function(value, index, array) {
							deleteLocal(value.key);
						})
						setTable();
					}
				}
			}

			/**
			 * sessionStorage添加数据
			 */
			function addLocal(key, value) {
				sessionStorage.setItem(key, value);
			}

			/**
			 * sessionStorage删除数据
			 */
			function deleteLocal(key) {
				sessionStorage.removeItem(key);
			}

			/**
			 * sessionStorage清空数据
			 */
			function clearLocal() {
				sessionStorage.clear();
			}

			/**
			 * sessionStorage获取所有数据
			 */
			function queryLocal() {
				arr = [];
				for (var i = 0; i < sessionStorage.length; i++) {
					var key = sessionStorage.key(i);
					var value = sessionStorage.getItem(key);
					arr.push(new Item(key, value));
				}
			}

			window.onload = function() {
				var keyInput = document.getElementById("keyInput");
				var valueInput = document.getElementById("valueInput");
				var addBtn = document.getElementById("addBtn");
				var queryBtn = document.getElementById("queryBtn");
				var clearBtn = document.getElementById("clearBtn");
				var table = document.getElementById("table");

				addBtn.onclick = function() {
					addLocal(keyInput.value, valueInput.value);
					keyInput.value = "";
					valueInput.value = "";
					setTable();
				}
				queryBtn.onclick = function() {
					setTable();
				}
				clearBtn.onclick = function() {
					clearLocal();
					setTable();
				}
			}
		</script>
	</head>
	<body>
		<p><label>key: <input id="keyInput" type="text"></label></p>
		<p><label>value: <input id="valueInput" type="text"></label></p>
		<p>
			<input id="addBtn" type="button" value="增加">
			<input id="queryBtn" type="button" value="查询">
			<input id="clearBtn" type="button" value="清空">
		</p>
		<table id="table">
			<thead>
				<tr>
					<td>key值</td>
					<td>value值</td>
					<td>删除</td>
				</tr>
			</thead>
			<tbody> </tbody>
		</table>
	</body>
</html>
```



