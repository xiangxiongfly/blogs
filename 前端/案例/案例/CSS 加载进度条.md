# CSS 加载进度条

## 环形加载条

![在这里插入图片描述](https://img-blog.csdnimg.cn/4fe5f0bd2db34b26bbd987688c13ed13.gif)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>环形加载条</title>
		<style type="text/css">
			.box {
				width: 200px;
				height: 200px;
				border: 1px solid silver;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.circle {
				width: 100px;
				height: 100px;
				border: 10px solid gray;
				border-radius: 50%;
				border-right-color: transparent;
				animation: progress 1s infinite linear;
			}

			@keyframes progress {
				0% {
					transform: rotate(0);
				}

				100% {
					transform: rotate(360deg);
				}
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="circle"></div>
		</div>
	</body>
</html>
```



## 条形加载条

![在这里插入图片描述](https://img-blog.csdnimg.cn/38abee21863a439785b4717106d6818a.gif)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>条形加载条</title>
		<style type="text/css">
			.box {
				width: 250px;
				height: 100px;
				border: 1px solid silver;
				padding: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.progress {
				width: 100%;
				height: 25px;
				border: 1px solid blue;
				border-radius: 25px;
				overflow: hidden;
			}

			.bar {
				width: 100%;
				height: 25px;
				background-image: repeating-linear-gradient(45deg, white 0px, white 20px, blue 20px, blue 40px);
				background-size: 56px 25px;
				animation: move 0.8s linear infinite;
			}

			@keyframes move {
				from {
					background-position: 0 0;
				}

				to {
					background-position: 56px 0;
				}
			}
		</style>
	</head>
	<body>
		<div class="box">
			<div class="progress">
				<div class="bar"></div>
			</div>
		</div>
	</body>
</html>
```



## loading

![在这里插入图片描述](https://img-blog.csdnimg.cn/941ef166525746eb9249bb468e146327.gif)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>loading</title>
    <style>
      .loading {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 80px;
        height: 40px;
        margin: 50px auto;
      }
      .loading span {
        display: inline-block;
        width: 8px;
        height: 40px;
        border-radius: 4px;
        background-color: lightblue;
        animation: loadingAnim 1s ease infinite;
      }
      @keyframes loadingAnim {
        0%,
        100% {
          height: 40px;
        }
        50% {
          height: 20px;
        }
      }
      .loading span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .loading span:nth-child(3) {
        animation-delay: 0.4s;
      }
      .loading span:nth-child(4) {
        animation-delay: 0.6s;
      }
      .loading span:nth-child(5) {
        animation-delay: 0.8s;
      }
    </style>
  </head>
  <body>
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </body>
</html>
```



## [代码下载](https://github.com/xiangxiongfly/MyHtmlCssJs/tree/main/%E5%8A%A0%E8%BD%BD%E8%BF%9B%E5%BA%A6%E6%9D%A1)