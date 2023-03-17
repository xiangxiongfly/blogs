[TOC]

# HTML5 新增元素

## 概述

HTML5新增的主要结构元素有6个：header、nav、article、aside、section、footer。



## header

在HTML5中，header元素一般用于3个地方：

- 页面头部：如网站名称、页面LOGO、顶部导航、介绍信息等。
- 文章头部（article元素）：文章标题、meta信息（一般指作者、点赞数、评论数）。
- 区块头部（section元素）：标题。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <header></header>
        <nav></nav>
        <article>
            <header></header>
            ……
            <footer></footer>
        </article>
        <aside></aside>
        <section>
            <header></header>
            ……
        </section>
        <footer></footer>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e8a8efe2a374b75bd3d1b6fbfaf8d05.png)



## nav

在HTML5中，nav元素一般用于3个地方：

- 顶部导航：nav元素既可以放到header元素内部，也可以放到header元素外部。
- 侧栏导航。
- 分页导航。



## article

在HTML5中，article元素一般只会用于一个地方：文章内容部分。

可以把article看成一个独立的部分，它内部可以包含标题以及其他部分。也就是说，article元素内部可以包含header元素、section元素和footer元素等。

```html
<article>
    <header>
        <h1>HTML5是什么？</h1>
        <p>作者、点赞、评论、浏览……</p>
    </header>
    <div id="content">文章内容……</div>
    <footer>
        <nav>上一篇、下一篇导航</nav>
    </footer>
</article>
```



## aside

在HTML5中，aside元素一般用于表示跟周围区块相关的内容，正确地使用aside元素，主要取决于它的使用位置，我们大体可以分为以下两种情况：

- 如果aside元素放在article元素或section元素之中，则aside内容必须与article内容或section内容紧密相关。
- 如果aside元素放在article元素或section元素之外，则aside内容应该是与整个页面相关的，比如相关文章、相关链接、相关广告等。



## section

在HTML5中，section元素一般用于某一个需要标题内容的区块。如果页面某个区块不需要标题，直接使用div元素就可以了。如果需要标题，则建议使用section元素。

HTML5标准建议，section元素内部必须带有标题，也就是说，section元素内部必须带有一个header元素。

```html
<section>
    <header>工具手册</header>
    <ul>
        <li>HTML5参考手册</li>
        <li>CSS3参考手册</li>
        <li>JavaScript参考手册</li>
    </ul>
</section>
```



## footer

在HTML5中，footer元素一般用于两个地方：

- 一个是“页面底部”：一般包含友情链接、版权声明、备案信息等。
- 另一个是“文章底部”：footer元素一般包含“上一篇/下一篇导航”“文章分类”“发布信息”等。

```html
<article>
    <header>
        <h1>HTML5是什么？</h1>
        <p>作者、点赞、评论、浏览……</p>
    </header>
    <div id="content">文章内容……</div>
    <footer>
        <nav>上一篇、下一篇导航</nav>
    </footer>
</article>
```



## 表单元素

### 新增type属性值（验证型）

| 属性值 | 说明     |
| ------ | -------- |
| email  | 邮政类型 |
| tel    | 电话类型 |
| url    | URL类型  |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form>
			<p><label>电子邮件：<input type="email"></label></p>
			<p><label>电话号码：<input type="tel"></label></p>
			<p><label>你的网址：<input type="url"></label></p>
			<input type="submit" value="提交">
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ce83b7b0d1a42e38903100a0e3a9e4f.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/af7d1b7c69f64f4aacac6a0418e01151.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/f65a47965bca4ba7aa48adf3bd6655b4.png)



### 新增type属性值（取值型）

| 属性值 | 说明             |
| ------ | ---------------- |
| range  | 取数字，滑块样式 |
| number | 取数字，微调样式 |
| color  | 取颜色           |
| date   | 取日期           |
| time   | 取时间           |
| month  | 取月份           |
| week   | 取周数           |

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			window.onload = function() {
				var number1 = document.querySelector("input[type='range']").value;
				console.log(number1);
				var number2 = document.querySelector("input[type='number']").value;
				console.log(number2);
				var color = document.querySelector("input[type='color']").value;
				console.log(color);
				var date = document.querySelector("input[type='date']").value;
				console.log(date);
				var time = document.querySelector("input[type='time']").value;
				console.log(time);
			}
		</script>
	</head>
	<body>
		<form>
			<p><label>取值：<input type="range" min="0" max="100" step="10" value="20"></label></p>
			<p><label>取值：<input type="number" min="0" max="100" step="10" value="30"></label></p>
			<p><label>取颜色：<input type="color" value="#ff557f"></label></p>
			<p><label>取日期：<input type="date" value="2008-08-09"></label></p>
			<p><label>取时间：<input type="time" value="06:07"></label></p>
			<p><label>取月份：<input type="month" value="2008-09"></label></p>
			<p><label>取周数：<input type="week" value="2008-W09"></label></p>
			<input type="submit" value="提交">
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d749625dcf414f0fbb04a39322b1c49f.png)



### output元素

在HTML5中，我们可以使用output元素来定义表单元素的输出结果或计算结果。

output元素是一个行内元素，只不过它比span元素更具有语义化。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script>
			window.onload = function() {
				var input = document.querySelector("input[type='range']");
				var output = document.getElementsByTagName("output")[0];
				output.value = input.value;
				input.onchange = function() {
					output.value = input.value;
				}
			}
		</script>
	</head>
	<body>
		<form>
			<input type="range" min="0" max="100" step="5">
			<output></output>
		</form>
	</body>
</html>
```



## address

在HTML5中，address元素一般用于两个地方：

- 当address元素应用于整个页面时，它一般放于整个页面的底部（footer元素内部），表示该网站所有者的地址信息。
- 一个页面可以有多个article元素，比如有些页面就有好几篇文章。当address元素应用于article元素时，它一般放在article元素内部的footer元素内，表示该篇文章所有者的地址信息。当然，address元素也可以放于section元素内。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <header></header>
        <nav></nav>
        <article>
            <header>作者：mozilla</header>
            <p>这是第2篇文章的内容……</p>
            <footer>
                <address>
                    你可以通过<a href="mailto:webmaster@somedomain.com">mailto:webmaster@somedomain.com</a>联系作者：mozilla。
                </address>
            </footer>
        </article>
        <aside></aside>
        <footer>
            <address>
                如果你发现网站有bug，可以通过<a href="mailto:lvyestudy@foxmail.com"> 电子邮件 </a>联系我们。<br/>
                当然你也可以通过下面地址访问我们：<br/>
                广州市黄埔大道601号暨南大学.
            </address>
        </footer>
    </body>
</html>
```



## progress

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <progress max="10" value="8"></progress><br/>
        <progress max="100" value="80"></progress>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/58cdfec4d7244f33a0ffbbac8337e7ca.png)



## meter

meter元素跟progress元素非常相似，都是以进度条形式来显示数据比例。不过，两者在语义上有很大的区别：

- meter元素一般用于显示静态数据比例。所谓的静态数据，指的是很少改变的数据，例如男生人数占全班人数的比例。
- progress元素一般用于显示动态数据比例。所谓“动态数据”，指的是会不断改变的数据，例如下载文件的进度。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<meter min="0" max="10" value="8"></meter><br />
		<meter min="0" max="100" value="80"></meter>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/109f3a943fa84a939b0e91c0bbdd565c.png)



## figure 和 figcaption

figure元素用于包含图片和图注，figcaption元素用于表示图注文字。在实际开发中，对于“图片+图注”效果，我们都建议使用figure和figcaption这两个元素来实现，从而使得页面的语义更加良好。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			figure {
				width: 100px;
				text-align: center;
				border: 1px solid red;
			}
		</style>
	</head>
	<body>
		<figure>
			<img src="img/apple_pic.png" alt="黑夜">
			<figcaption>hello</figcaption>
		</figure>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d0e77ffe2ed84462b398c0b933e20929.png)



## fieldset 和 legend

在HTML5中，我们还可以使用fieldset元素来给表单元素进行分组。其中，legend元素用于定义某一组表单的标题。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<form action="index.php" method="post">
			<fieldset>
				<legend>hello</legend>
				<p>
					<label for="name">账号：</label>
					<input type="text" id="name" name="name" />
				</p>
				<p>
					<label for="pwd">密码：</label>
					<input type="password" id="pwd" name="pwd" />
				</p>
				<input type="checkbox" id="remember-me" name="remember-me" />
				<label for="remember-me">记住我</label>
				<input type="submit" value="登录" />
			</fieldset>
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/40e2ac9d501142569da0cd4d1cd62aaf.png)



## a

HTML5为a元素新增了3个属性。

| 属性     | 说明                                 |
| -------- | ------------------------------------ |
| download | 定义可被下载的目标（如文件、图片等） |
| media    | 定会被链接文档为何种媒介/设备优化的  |
| type     | 定义被链接文档的MIME类型             |

其中media和type这两个属性用得很少，我们只需要掌握download这一个属性即可。

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title></title>
</head>
<body>
  <a href="img/a.png" download="hello.png">下载图片</a>
</body>
</html>
```

当我们点击超链接后，浏览器就会下载该图片，并且图片名字换成新的文件名hello.png。如果我们改为下面这句代码，也就是省略download属性值，则图片会使用旧的文件名a.png。



## script

HTML5为script元素新增了两个属性：defer和async。

这两个属性的作用都是加快页面的加载速度，两者区别如下：

- defer属性用于异步加载外部JavaScript文件，当异步加载完成后，该外部JavaScript文件不会立即执行，而是等待到整个HTML文档加载完成才会执行。
- async属性用于异步加载外部JavaScript文件，当异步加载完成后，该外部JavaScript文件会立即执行，即使整个HTML文档还没有加载完成。

defer和async都是异步加载的，两者区别在于，异步加载外部JavaScript文件完成后何时执行。从上面也可以看出，defer属性相对于async属性来说，更符合大多数开发场景对脚本加载执行的要求。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script src="js/async.js" async></script>
    </head>
    <body>
        <script>
            console.log("内部脚本");
        </script>
    </body>
</html>
```

