[toc]

# CSS3 多列布局

## 概述

在CSS3之前，如果想要设计类似报纸那样的多列布局，有两种方式可以实现：一种是“浮动布局”，另一种是“定位布局”。不过这两种方式弊端都很多：浮动布局比较灵活，但不容易控制；定位布局可以精准定位，但是却不够灵活。

CSS3新增多列布局，使用多列布局可以轻松实现类似报纸那样的布局，而且这种布局的自适应能力也非常好。



## 常用属性

| 属性         | 说明               |
| ------------ | ------------------ |
| column-count | 列数               |
| column-width | 每列宽度           |
| column-gap   | 列与列之间的间距   |
| column-rule  | 两列之间的边框样式 |
| column-span  | 跨列               |

## 使用

### column-count 列数

**语法**

```
column-count: 取值;
```

**column-count取值**

| 属性值      | 说明                               |
| ----------- | ---------------------------------- |
| auto        | 默认值，列数由column-width属性决定 |
| n（正整数） | 划分为n列                          |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				width: 400px;
				padding: 10px;
				border: 1px solid silver;
				column-count: 3;
			}

			h1 {
				height: 60px;
				line-height: 60px;
				text-align: center;
				background-color: silver;
			}

			p {
				font-family: "微软雅黑";
				font-size: 14px;
				text-indent: 2em;
			}
		</style>
	</head>
	<body>
		<h1>hello</h1>
		<p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时 候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？
		</p>
		<p>……</p>
		<p>在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸地回去罢？但不能平的，为什么偏要白白走这一遭啊？
		</p>
		<p>你聪明的，告诉我，我们的日子为什么一去不复返呢？</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f4a0ba267e6e49e6b19c7b16557ebd6a.png)



### column-width 列宽

**语法**

```
column-width: 取值;
```

**column-width取值**

| 属性值 | 说明                   |
| ------ | ---------------------- |
| auto   | 由column-count属性决定 |
| 长度值 | px、em、百分比等       |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				width: 400px;
				padding: 10px;
				border: 1px solid silver;
				column-width: 150px;
			}

			h1 {
				height: 60px;
				line-height: 60px;
				text-align: center;
				background-color: silver;
			}

			p {
				font-family: 微软雅黑;
				font-size: 14px;
				text-indent: 28px;
			}
		</style>
	</head>
	<body>
		<h1>匆匆</h1>
		<p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时 候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？
		</p>
		<p>我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。</p>
		<p>……</p>
		<p>在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸地回去罢？但不能平的，为什么偏要白白走这一遭啊？
		</p>
		<p>你聪明的，告诉我，我们的日子为什么一去不复返呢？</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7cb3d5659abf43c6a141449de8ee83e1.png)



### column-gap 间距

**语法**

```
column-gap: 取值;
```

**column-gap取值**

| 属性值 | 说明             |
| ------ | ---------------- |
| normal | 浏览器默认值     |
| 长度值 | px、em、百分比等 |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				width: 400px;
				padding: 10px;
				border: 1px solid silver;
				column-count: 2;
				column-gap: 20px;
				/*定义列间距为20px*/
			}

			h1 {
				height: 60px;
				line-height: 60px;
				text-align: center;
				background-color: silver;
			}

			p {
				font-family: 微软雅黑;
				font-size: 14px;
				text-indent: 28px;
				background-color: #F1F1F1;
			}
		</style>
	</head>
	<body>
		<h1>匆匆</h1>
		<p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？</p>
		<p>我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。</p>
		<p>……</p>
		<p>在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸地回去罢？但不能平的，为什么偏要白白走这一遭啊？
		</p>
		<p>你聪明的，告诉我，我们的日子为什么一去不复返呢？</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/44399febf10b4b2e8c426d96a6ccc683.png)



### column-rule 边框

**语法**

```
column-rule: width style color;
```

**说明**

column-rule属性跟border属性是非常相似的，它也是一个复合属性，由3个子属性组成：

- column-rule-width：定义边框的宽度。
- column-rule-style：定义边框的样式。
- column-rule-color：定义边框的颜色。

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				width: 400px;
				padding: 10px;
				border: 1px solid silver;
				column-count: 2;
				column-gap: 20px;
				column-rule: 1px dashed red;
			}

			h1 {
				height: 60px;
				line-height: 60px;
				text-align: center;
				background-color: silver;
			}

			p {
				font-family: 微软雅黑;
				font-size: 14px;
				text-indent: 28px;
				background-color: #F1F1F1;
			}
		</style>
	</head>
	<body>
		<h1>匆匆</h1>
		<p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？</p>
		<p>我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。</p>
		<p>……</p>
		<p>在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸地回去罢？但不能平的，为什么偏要白白走这一遭啊？
		</p>
		<p>你聪明的，告诉我，我们的日子为什么一去不复返呢？</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d682af9a0396464c95d4bb95302ad5b0.png)



### column-span 跨列

**语法**

```
column-span: 取值;
```

**column-span取值**

| 属性值 | 说明   |
| ------ | ------ |
| none   | 不跨列 |
| all    | 跨列   |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			body {
				width: 400px;
				padding: 10px;
				border: 1px solid silver;
				column-count: 2;
				column-gap: 20px;
				column-rule: 1px dashed red;
			}

			h1 {
				height: 60px;
				line-height: 60px;
				text-align: center;
				background-color: silver;
				column-span: all;
			}

			p {
				font-family: 微软雅黑;
				font-size: 14px;
				text-indent: 28px;
				background-color: #F1F1F1;
			}
		</style>
	</head>
	<body>
		<h1>匆匆</h1>
		<p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？</p>
		<p>我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。</p>
		<p>……</p>
		<p>在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？只有徘徊罢了，只有匆匆罢了；在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了；我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？我赤裸裸来到这世界，转眼间也将赤裸裸地回去罢？但不能平的，为什么偏要白白走这一遭啊？
		</p>
		<p>你聪明的，告诉我，我们的日子为什么一去不复返呢？</p>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/639bda7e81cb4f02b33f44b49cf3fa6b.png)



## 案例

### 瀑布流布局

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			.container {
				column-width: 160px;
				column-gap: 5px;
			}

			.container div {
				width: 160px;
				margin: 4px 0;
			}

			.container div img {
				width: 100%;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div><img src="img/column/pic1.jpg" /></div>
			<div><img src="img/house.png" /></div>
			<div><img src="img/column/pic2.jpg" /></div>
			<div><img src="img/column/pic3.jpg" /></div>
			<div><img src="img/apple_pic.png" /></div>
			<div><img src="img/column/pic4.jpg" /></div>
			<div><img src="img/column/pic5.jpg" /></div>
			<div><img src="img/column/pic6.jpg" /></div>
			<div><img src="img/banana_pic.png" /></div>
			<div><img src="img/column/pic7.jpg" /></div>
			<div><img src="img/column/pic8.jpg" /></div>
			<div><img src="img/cherry_pic.png" /></div>
			<div><img src="img/house.png" /></div>
			<div><img src="img/column/pic9.jpg" /></div>
			<div><img src="img/column/pic10.jpg" /></div>
			<div><img src="img/column/pic11.jpg" /></div>
			<div><img src="img/column/pic12.jpg" /></div>
			<div><img src="img/dark_image.jpg" /></div>
			<div><img src="img/pear_pic.png" /></div>
			<div><img src="img/column/pic13.jpg" /></div>
			<div><img src="img/column/pic14.jpg" /></div>
			<div><img src="img/column/pic15.jpg" /></div>
			<div><img src="img/column/pic16.jpg" /></div>
			<div><img src="img/house.png" /></div>
			<div><img src="img/column/pic17.jpg" /></div>
			<div><img src="img/column/pic18.jpg" /></div>
			<div><img src="img/column/pic19.jpg" /></div>
			<div><img src="img/column/pic20.jpg" /></div>
			<div><img src="img/column/pic1.jpg" /></div>
			<div><img src="img/column/pic2.jpg" /></div>
			<div><img src="img/column/pic3.jpg" /></div>
			<div><img src="img/column/pic4.jpg" /></div>
			<div><img src="img/column/pic5.jpg" /></div>
			<div><img src="img/column/pic6.jpg" /></div>
			<div><img src="img/column/pic7.jpg" /></div>
			<div><img src="img/column/pic8.jpg" /></div>
			<div><img src="img/house.png" /></div>
			<div><img src="img/column/pic9.jpg" /></div>
			<div><img src="img/column/pic10.jpg" /></div>
			<div><img src="img/column/pic11.jpg" /></div>
			<div><img src="img/column/pic12.jpg" /></div>
			<div><img src="img/column/pic13.jpg" /></div>
			<div><img src="img/column/pic14.jpg" /></div>
			<div><img src="img/column/pic15.jpg" /></div>
			<div><img src="img/column/pic16.jpg" /></div>
			<div><img src="img/column/pic17.jpg" /></div>
			<div><img src="img/column/pic18.jpg" /></div>
			<div><img src="img/column/pic19.jpg" /></div>
			<div><img src="img/column/pic20.jpg" /></div>
		</div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7a05d3c0c1524e1c9c3b18f1da9cbc42.png)



