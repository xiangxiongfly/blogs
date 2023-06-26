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



## localStorage和sessionStorage区别

`localStorage`和`sessionStorage`是HTML5中提供的两个Web存储API，用于在浏览器端存储数据。

**相同点**

`localStorage`和`sessionStorage`都可以存储键值对数据，并且它们都是基于同源策略的。这意味着只有在相同的协议、主机名和端口号下，才能访问同一个`localStorage`或`sessionStorage`对象。

**区别**

- `localStorage`：
  - 存储在`localStorage`中的数据没有过期时间，除非被显式删除。
  - 作用域为整个域名，在同一域名下的所有页面都可以访问同一个`localStorage`对象。
  - 每个域名的容量限制为5MB或更大。
- `sessionStorage`：
  - 存储在`sessionStorage`中的数据仅在当前会话期间有效。当用户关闭浏览器窗口时，`sessionStorage`中的数据将被删除。
  - 作用域限制在当前窗口或标签页，不同的标签页或窗口无法共享同一个`sessionStorage`对象。
  - 容量限制则相对较小，一般为5MB以下。

以下是各个浏览器对于localStorage和sessionStorage容量限制的具体情况：

- Chrome：localStorage和sessionStorage的容量限制都为5MB。
- Firefox：localStorage和sessionStorage的容量限制都为10MB。
- Safari：localStorage和sessionStorage的容量限制都为5MB。
- Internet Explorer：localStorage和sessionStorage的容量限制都为10MB。
- Microsoft Edge：localStorage和sessionStorage的容量限制都为10MB。



## localStorage

### 常用方法

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

### 常用方法

在HTML5中，我们可以使用sessionStorage对象来“暂时”保存客户端的少量数据。sessionStorage对象跟localStorage对象非常相似，两者有着完全相同的方法。

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



