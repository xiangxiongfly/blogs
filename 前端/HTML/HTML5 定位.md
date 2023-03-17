[TOC]

# HTML5 定位

## geolocation

### 简介

在HTML5中，可以使用geolocation对象来获取用户的地理位置信息。

**语法**

```
window.navigator.geolocation
//简写为
navigator.geolocation
```

**geolocation对象的方法**

| 方法                 | 说明         |
| -------------------- | ------------ |
| getCurrentPosition() | 获取当前位置 |
| watchPosition()      | 监听位置     |
| clearWatch()         | 取消监听     |



### getCurrentPosition()

**语法**

```
navigator.geolocation.getCurrentPosition(function(position){
  ……
}, error, option);
```

**说明**

参数1：成功获取当前地理位置。

参数2：获取失败执行。

参数3：配置信息。

**postion对象的属性**

| 属性             | 说明 |
| ---------------- | ---- |
| coords.longitude | 经度 |
| coords.latitude  | 维度 |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var btn = document.getElementById("btn");
				var content = document.getElementById("content");
				btn.onclick = function() {
					navigator.geolocation.getCurrentPosition(function(position) {
						var html = `经度：${position.coords.longitude} <br>
									维度：${position.coords.latitude} <br>`;
						content.innerHTML = html;
					}, function() {
						content.innerHTML = "获取失败";
					});
				}

			}
		</script>
	</head>
	<body>
		<button id="btn">获取位置信息</button>
		<p id="content"></p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/66182ac0fc9f4f9c83be62964e332e19.png)



### watchPosition() 和 clearWatch()

可以使用watchPosition()方法来持续不断地获取当前位置的坐标。

**语法**

```
navigator.geolocation.watchPosition(function(position){
……
}, error, option);
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport"
			content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title></title>
		<script>
			window.onload = function() {
				var startBtn = document.getElementById("startBtn");
				var clearBtn = document.getElementById("clearBtn");
				var content = document.getElementById("content");
				var watchId;
				startBtn.onclick = function() {
					watchId = navigator.geolocation.watchPosition(function(position) {
						var html = `经度：${position.coords.longitude} <br>
								维度：${position.coords.latitude}`;
						content.innerHTML = html;
					}, function(positionError) {
						content.innerHTML = "获取失败: " + positionError.message;
					});
				}
				clearBtn.onclick = function() {
					navigator.geolocation.clearWatch(watchId);
				}
			}
		</script>
	</head>
	<body>
		<button id="startBtn">开始监听</button>
		<button id="clearBtn">停止监听</button>
		<p id="content"></p>
	</body>
</html>
```



## 百度地图

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<title></title>
		<style type="text/css">
			html {
				height: 100%
			}

			body {
				height: 100%;
				margin: 0px;
				padding: 0px
			}

			#container {
				height: 100%
			}
		</style>
		<script src="http://api.map.baidu.com/api?v=2.0&ak=8bAHsDS8gDguHeavuGuEGng-mChkSCQ4Y"></script>
		<script>
			window.onload = function() {
				var content = document.getElementById("content");
				// 百度地图API功能
				var map = new BMap.Map("container");
				var point = new BMap.Point(116.331398, 39.897445);
				map.centerAndZoom(point, 12);
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						var mk = new BMap.Marker(r.point);
						map.addOverlay(mk);
						map.panTo(r.point);
						content.innerText = '您的位置：' + r.point.lng + ',' + r.point.lat;
					} else {
						content.innerText = 'failed' + this.getStatus();
					}
				}, {
					enableHighAccuracy: true
				})
				//关于状态码
				//BMAP_STATUS_SUCCESS　　检索成功。对应数值“0”。
				//BMAP_STATUS_CITY_LIST　　城市列表。对应数值“1”。
				//BMAP_STATUS_UNKNOWN_LOCATION　　位置结果未知。对应数值“2”。
				//BMAP_STATUS_UNKNOWN_ROUTE　　导航结果未知。对应数值“3”。
				//BMAP_STATUS_INVALID_KEY　　非法密钥。对应数值“4”。
				//BMAP_STATUS_INVALID_REQUEST　　非法请求。对应数值“5”。
				//BMAP_STATUS_PERMISSION_DENIED　　没有权限。对应数值“6”。(自 1.1 新增)
				//BMAP_STATUS_SERVICE_UNAVAILABLE　　服务不可用。对应数值“7”。(自 1.1 新增)
				//BMAP_STATUS_TIMEOUT　　超时。对应数值“8”。(自 1.1 新增)
			}
		</script>
	</head>
	<body>
		<p id="content"></p>
		<div id="container"></div>
	</body>
</html>
```

