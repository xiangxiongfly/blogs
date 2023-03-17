[TOC]

# CSS盒模型

## 概述

在“CSS盒子模型”理论中，页面中的所有元素都可以看成一个盒子，并且占据着一定的页面空间。



## 盒子结构

- 每个盒模型由以下部分组成：
  - 内容区（content）
  - 内边距（padding）
  - 边框（border）
  - 外边距（margin）
- 盒子总大小 = content + padding + border

![盒模型](https://img-blog.csdnimg.cn/20200621000045564.gif)



## content 内容区

内容区的大小由`width`和`height`两个属性设置。

只有块元素才可以设置width和height，行内元素无法设置。

**语法**

```
width: 像素值;
height: 像素值;
```

**使用**

```css
.box {
    width: 200px;
    height: 200px;
    background-color: red;
}
```



## border 边框

边框属于盒子内部，边框大小会影响整个盒子的大小。
**语法**

```
border: border-width border-style border-color;
```

**使用**

```css
.box {
    border: 10px yellowgreen solid;
}
```



## padding 内边距

内边距指边框到内容之间的距离，内边距属于盒子内部，会影响盒子的大小。

**语法**

```
padding: 像素值;
```

**使用**

```css
.box {
    padding: 10px;
}
```



## margin 外边距

外边距指边框到父元素或兄弟元素之间的那一部分，在边框的外部。

外边距不会影响盒子的大小，会影响盒子的位置。

**语法**

```
margin: 像素值;
```

**使用**

```css
.box {
    margin: 10px;
}
```



## 盒子模型：box-sizing

`box-sizing`用于设置盒子尺寸的计算方式

| box-sizing属性 | 说明                                               |
| -------------- | -------------------------------------------------- |
| content-box    | 默认值，盒子实际尺寸=width/height+padding+border   |
| border-box     | 盒子实际尺寸=width/height，padding、border将会内缩 |

```css
.up {
    width: 100px;
    height: 100px;
    border: 10px red solid;
    box-sizing: content-box;
}

.down {
    width: 100px;
    height: 100px;
    border: 10px green dashed;
    box-sizing: border-box;
}
```

![box-sizing](https://img-blog.csdnimg.cn/20200621000145402.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



## border:0 和 border:none 区别

**border:0**

`border:0`表示把border设置为0px。虽然0px在页面上看不见，但是浏览器仍然会对border进行渲染。

**border:none**

`border:none`表示把border设置为none，浏览器不会解析border，因此不会消耗内存资源。



## 外边距叠加问题

外边距叠加也成为margin叠加，通常分3种情况：

- 同级元素。
- 父子元素。
- 空元素。

### 同级元素

当遇到上下相邻的两个块元素时，上面的元素为`margin-bottom: 50px;`，下面的元素为`margin-top: 100px;`，就会发生外边距合并，它们的间距会取两个值中的最大的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/dd036fd20d804e00aac9482cad4d89ce.png)

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            div {
                width: 100px;
                height: 100px;
                background-color: red;
                text-align: center;
                box-sizing: border-box;
                border: 1px solid black;
                text-align: center;
            }

            .one {
                margin-bottom: 50px;
            }

            .two {
                margin-top: 100px;
            }
        </style>
    </head>
    <body>
        <div class="one">one </div>
        <div class="two">two</div>
    </body>
</html>
```

### 父子元素

当一个元素包含另一个元素存在父子关系，这时父元素和子元素相邻的外边距就会发生合并。

**解决办法：**

- 父元素设置border或padding。
- 父元素设置`overflow: hidden;`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad7cff5441f24b82ae3f40cc92d8c268.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			html {
				background-color: gray;
			}

			div {
				text-align: center;
				box-sizing: border-box;
				text-align: center;
			}

			.one {
				background-color: red;
				width: 200px;
				height: 200px;
				margin-top: 50px;
			}

			.two {
				background-color: green;
				width: 100px;
				height: 100px;
				margin-top: 100px;
			}
		</style>
	</head>
	<body>
		<div class="one">
			<div class="two"></div>
		</div>
	</body>
</html>
```

