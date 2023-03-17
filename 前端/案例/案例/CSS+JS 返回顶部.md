# 返回顶部

## 方式一：scrollTo

特点：没有动画效果。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>返回顶部</title>
    <style type="text/css">
      body {
        height: 5000px;
      }

      img {
        position: fixed;
        right: 50px;
        bottom: 50px;
        width: 80px;
        display: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h3>hello world</h3>
    <div><img src="../img/toTop.png" alt="" /></div>
    <script>
      let btnTop = document.querySelector("img");
      let scrollTop = 0;
      window.onscroll = function () {
        scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop > 300) {
          btnTop.style.display = "block";
        } else {
          btnTop.style.display = "none";
        }
      };
      btnTop.onclick = function () {
        window.scrollTo(0, 0);
      };
    </script>
  </body>
</html>
```



## 方式二：requestAnimationFrame

特点：滚动时有动画。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5827caebe74a4943912d3bd80e0fc1e6.gif)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>返回顶部</title>
    <style type="text/css">
      body {
        height: 5000px;
      }

      img {
        position: fixed;
        right: 50px;
        bottom: 50px;
        width: 80px;
        display: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h3>hello world2</h3>
    <div><img src="../img/toTop.png" alt="" /></div>
    <script>
      let btnTop = document.querySelector("img");
      window.onscroll = function () {
        let scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop > 300) {
          btnTop.style.display = "block";
        } else {
          btnTop.style.display = "none";
        }
      };
      let request;
      function scrollTopAnim() {
        let height =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (height <= 1) {
          window.cancelAnimationFrame(request);
          window.scrollTo(0, 0);
          return;
        }
        //浏览器页面每次重绘时，会调用该方法
        request = window.requestAnimationFrame(scrollTopAnim);
        window.scrollTo(0, height - height / 8);
      }
      btnTop.addEventListener("click", () => {
        scrollTopAnim();
      });
    </script>
  </body>
</html>
```



## 方式三：缓动动画

特点：滚动时有动画。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>置顶效果</title>
		<style type="text/css">
			body {
				height: 5000px;
			}

			img {
				position: fixed;
				right: 50px;
				bottom: 50px;
				width: 80px;
				display: none;
				cursor: pointer;
			}
		</style>
	</head>
	<body>
		<h3>hello world</h3>
		<div><img src="../img/toTop.png" alt=""></div>
		<script type="text/javascript">
			let btnTop = document.querySelector("img");
			let scrollTop = 0;
			window.onscroll = function() {
				scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				if (scrollTop > 300) {
					btnTop.style.display = "block";
				} else {
					btnTop.style.display = "none";
				}
			}
			btnTop.onclick = function() {
				let timer = setInterval(function() {
					scrollTop -= 30;
					if (scrollTop <= 30) {
						document.body.scrollTop = 0;
						document.documentElement.scrollTop = 0;
						clearInterval(timer);
						return;
					}
					document.body.scrollTop = scrollTop;
					document.documentElement.scrollTop = scrollTop;
				}, 10);
			}
		</script>
	</body>
</html>
```

