[TOC]

# HTML5 音视频

## video元素

### 简介

**语法**

```
<video>
  你的浏览器不支持video元素，请升级到最新版本
</video>
```

**说明**

如果浏览器不支持video元素，就会显示标签中的内容“你的浏览器不支持video元素，请升级到最新版本”。当然，这个提示文字可省略。

**video元素常用属性**

| 属性     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| autoplay | 是否自动播放                                                 |
| controls | 是否显示控制栏                                               |
| loop     | 是否循环播放                                                 |
| preload  | 是否预加载<br />取值：auto，预加载（默认值）；<br />metadata，只预加载元数据（即媒体字数、第一帧、播放列表等）；<br />none，不预加载。 |

### 简单使用

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <video src="media/movie.mp4" width="320" height="240" autoplay controls loop></video>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7df758dcb504b69846b5343fa18e55a.png)



### 多种格式的视频

对于HTML5视频格式，主要有3种，分别是ogg、mp4和webm。不过，主流浏览器对这3种视频格式的支持程度都不一样，如：

![在这里插入图片描述](https://img-blog.csdnimg.cn/50c261b3cc324ccd855b9d5df6dc4ea6.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<video controls>
			<source type="video/ogg" src="media/movie.ogg" />
			<source type="video/mp4" src="media/movie.mp4" />
			<source type="video/webm" src=media/movie.webm" />
		</video>
	</body>
</html>
```



### 自定义视频

**video元素的DOM属性**

| 属性         | 说明                            |
| ------------ | ------------------------------- |
| volume       | 音量                            |
| currentTime  | 当前播放时间（单位：秒）        |
| startTime    | 设置开始播放时间（单位：秒）    |
| duration     | 总的播放时间（单位：秒）        |
| playbackRate | 播放速率，默认值为1             |
| muted        | 是否静音，默认值为false         |
| paused       | 是否暂停，取值为true或false     |
| end          | 是否播放完毕，取值为true或false |

**video元素的DOM方法**

| 方法    | 说明 |
| ------- | ---- |
| play()  | 播放 |
| pause() | 暂停 |

**video元素的DOM事件**

| 事件       | 说明               |
| ---------- | ------------------ |
| timeupdate | 修改播放时间时触发 |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var oVideo = document.getElementsByTagName("video")[0];
				var oRange = document.getElementById("range");
				var oCurrentTime = document.getElementsByClassName("currentTime")[0];
				var oDuration = document.getElementsByClassName("duration")[0];
				//初始化两个时间
				oDuration.innerHTML = getTime(oVideo.duration);
				oCurrentTime.innerHTML = "00:00:00";
				//初始化进度条的值
				oRange.min = 0;
				oRange.max = oVideo.duration;
				oRange.value = 0;
				//保持滑动条和video的时间同步
				oRange.onchange = function() {
					oVideo.currentTime = oRange.value;
					oCurrentTime.innerHTML = getTime(oVideo.currentTime);
				};
				oVideo.addEventListener("timeupdate", function() {
					oRange.value = oVideo.currentTime;
					oCurrentTime.innerHTML = getTime(oVideo.currentTime);
				}, false);
				//定义一个转换为“00:00:00”格式时间的函数
				function getTime(time) {
					var hours = parseInt(time / 3600);
					var minutes = parseInt((time - hours * 3600) / 60);
					var seconds = parseInt(time - hours * 3600 - minutes * 60);
					if (hours < 10) {
						hours = "0" + hours;
					}
					if (minutes < 10) {
						minutes = "0" + minutes;
					}
					if (seconds < 10) {
						seconds = "0" + seconds;
					}
					var result = hours + ":" + minutes + ":" + seconds;
					return result;
				}
			}
		</script>
	</head>
	<body>
		<video autoplay preload="metadata" width="320" height="240" src="media/movie.mp4" autoplay></video><br />
		<input id="range" type="range" /><br />
		<div class="time">
			<span class="currentTime"></span>/
			<span class="duration"></span>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d60c2092fb945d896236da18db9371b.png)



## audio元素

### 简介

**语法**

```
<audio src="文件地址">
  你的浏览器不支持audio元素，请升级到最新版本
</audio>
```

**说明**

如果浏览器不支持audio元素，就会显示标签中的内容“你的浏览器不支持audio元素，请升级到最新版本”。当然，这个提示文字可省略。

**audio元素常用属性**

audio元素的属性跟video元素的属性几乎是一样的。

| 属性     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| autoplay | 是否自动播放                                                 |
| controls | 是否显示控件                                                 |
| loop     | 是否循环播放                                                 |
| preload  | 是否预加载<br />preload取值：auto，预加载（默认值）；<br />metadata，只加载元数据；<br />none，不预加载。 |

### 简单使用

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <audio src="media/music.mp3" autoplay controls loop></audio>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/96d3efb93f25431f9ccf143c6e39d87a.png)



### 设置网页背景音乐

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <audio src="media/music.mp3" autoplay loop></audio>
    </body>
</html>
```



### 多种格式的音频

对于HTML5音频格式，主要有3种，分别是ogg、mp3和wav。主流浏览器对这3种音频格式的支持程度都不一样，如：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5142415ab9f544d799768ae98f9a4632.png)

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title></title>
    </head>
    <body>
        <audio autoplay controls loop>
            <source src="music.mp3" type="audio/mp3" />
            <source src="music.ogg" type="audio/ogg" />
        </audio>
    </body>
</html>
```



### 自定义音频

**audio元素的DOM属性**

| 属性         | 说明                            |
| ------------ | ------------------------------- |
| volume       | 音量                            |
| currentTime  | 当前播放时间（单位：秒）        |
| startTime    | 设置开始播放时间（单位：秒）    |
| duration     | 总的播放时间（单位：秒）        |
| playbackRate | 播放速率，默认值为1             |
| muted        | 是否静音，默认值为false         |
| paused       | 是否暂停，取值为true或false     |
| end          | 是否播放完毕，取值为true或false |

**audio元素的DOM方法**

| 方法    | 说明 |
| ------- | ---- |
| play()  | 播放 |
| pause() | 暂停 |

**audio元素的DOM事件**

| 事件       | 说明               |
| ---------- | ------------------ |
| timeupdate | 修改播放时间时触发 |



