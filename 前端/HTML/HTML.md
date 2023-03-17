[TOC]


# HTML

## 概述

- HTML（HyperText Mark-up Language）即超文本标记语言，用于控制网页的结构。
- CSS（Cascading Style Sheets）几层叠样式表，用于控制网页的外观。
- JavaScript是一种嵌入在HTML页面中的脚本语言，由浏览器一边解释一边执行，控制网页的行为。



## 文档

[W3C网址](https://www.w3school.com.cn)



## HTML结构

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>这是网页的标题</title>
    </head>
    <body>
        <p>这是网页的内容</p>
    </body>
</html>
```

HTML结构说明：

- 文档声明：`<!DOCTYPE html>`是一个文档声明，表示这是一个HTML页面。
- html标签对：`<html></html>`告诉浏览器，这个页面是从`<html>`开始，然后到`</html>`结束。
- head标签对：`<head></head>`是网页的头部，用于定义一些特殊的内容，如页面标题、定时刷新、外部文件等。
- body标签对：`<body></body>`是网页的身体，主体内容显示。



## 标签分类

**根据编写形式，标签可分为两种：**

1. 一般标签，有开始符号和结束符号，可以在内部插入其他内容。如：`<p>`、`<div>`
2. 自闭合标签，只有开始符号。如：`<br/>`、`<hr/>`、`<img/>`

**根据表现形式，元素可分为两类：**

1. 块元素，独占一行，元素内部可以包含其他块元素和行内元素。如：`<h1>~<h6>`、`<p>`、`<div>`
2. 行内元素，行内元素可以和其他行内元素共处一行，行内元素内部只能容纳其他行内元素。如：`<strong>`、`<em>`、`<a>`、`<span>`

标签也叫做元素，叫法不同意思相同。



## 基本标签

### head标签

head标签表示页面的“头部”。

一般只有6个标签能放在head标签里：

- title标签
- meta标签
- link标签
- style标签
- script标签
- base标签

#### title标签

title标签定义网页的标题。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>标题</title>
    </head>
</html>
```

#### meta标签

meta标签一般用于定义页面的特殊信息，如页面关键字、页面描述等、SEO等。通常放在最前面。

**name属性**

```html
<!DOCTYPE html>
<html>
    <head>
        <!--网页关键字-->
        <meta name="keywords" content="HTML,CSS,JavaScript"/>
        <!--网页描述-->
        <meta name="description" content="学习前端相关知识"/>
        <!--本页作者-->
        <meta name="author" content="小明">
        <!--版权声明-->
        <meta name="copyright" content="本站所有内容均为原创，版权所有，禁止转载。否则必将追究法律责任。"/>
    </head>
</html>
```

**http-equiv属性**

**定义页面的编码：**

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
```

```html
在HTML5标准中可简写为：
<meta charset="utf-8"/>
```

**定义网页自动刷新跳转：**

```html
<meta http-equiv="refresh" content="6;url=http://www.baidu.com" />
```

说明：6秒后自动跳转指定url页面。

#### style标签

style标签用于定义CSS样式。

```html
<!DOCTYPE html>
<html >
    <head>
        <style type="text/css">
            /*这里写CSS样式*/
        </style>
    </head>
</html>
```

#### script标签

script标签用于定义页面的JavaScript代码和引入外部JavaScript文件。

```html
<!DOCTYPE html>
<html >
    <head>
        <script>
            /*这里写JavaScript代码*/
        </script>
    </head>
</html>
```

#### link标签

link标签用于引入外部CSS文件。

```html
<!DOCTYPE html>
<html >
    <head>
        <link type="text/css" rel="stylesheet" href="css/index.css">
    </head>
</html>
```

#### 浏览器标题栏小图标

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>hello</title>
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	</head>
	<body>
	</body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/561a3c87b0b349a58e970334760c1202.png)



### body标签

body标签表示页面的“身体”。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>body标签</title>
    </head>
    <body>
        <h3>静夜思</h3>
        <p>床前明月光，疑是地上霜。</p>
        <p>举头望明月，低头思故乡。</p>
    </body>
</html>
```



## 文本

### h标签

HTML中共有6个级别的标题标签：h1 , h2 , h3 , h4 , h5 , h6。

h是header的缩写，h1标签重要性最高，一个页面只能有一个h1标签，h6标签重要性最低，一个页面h2到h6可以有多个。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>标题标签</title>
    </head>
    <body>
        <h1>这是一级标题</h1>
        <h2>这是二级标题</h2>
        <h3>这是三级标题</h3>
        <h4>这是四级标题</h4>
        <h5>这是五级标题</h5>
        <h6>这是六级标题</h6>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/94abb879c2dc4ff099bb913304f4ad3e.png)



### 段落标签

#### p标签

p标签会自动换行，用来给文字分段的，段落之间有一定的间距。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>p标签</title>
    </head>
    <body>
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>换行标签</title>
            </head>
            <body>
                <h3>静夜思</h3>
                <p>床前明月光</p>
                <p>疑是地上霜</p>
                <p>举头望明月</p>
                <p>低头思故乡</p>
            </body>
        </html>
    </body>
</html>

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/278dad51cbec4343a458447bc9b104d7.png)

#### br标签

br标签用来给文字换行的。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>换行标签</title>
    </head>
    <body>
        <h3>静夜思</h3>
        <p>床前明月光，疑是地上霜。<br />举头望明月，低头思故乡。</p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7a5b0290b7f44fcd8e2ec7bc4f521596.png)

### 文本标签

常用的文本标签有以下8种：

- 粗体标签：strong、b。推荐strong，更具有语义化。
- 斜体标签：i、em、cite。推荐em。
- 上标标签：sup。
- 下标标签：sub。
- 中划线标签：s。
- 下划线标签：u。
- 大字号标签：big。
- 小字号标签：small。

```html
<p>普通文本</p>
<p><strong>粗体文本1</strong></p>
<p><b>粗体文本2</b></p>
<p><i>斜体文本1</i></p>
<p><em>斜体文本2</em></p>
<p><cite>斜体文本3</cite></p>
<p>(a+b)<sup>2</sup></p>
<p>(a+b)<sub>2</sub></p>
<p><s>中划线</s></p>
<p><u>下划线</u></p>
<p><big>大号文本</big></p>
<p><small>小号文本</small></p>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/34d137bf0936498eae463f1cd22ff408.png)

### hr标签

hr标签可以实现水平线效果。

```html
<h3>静夜思</h3>
<p>床前明月光，疑是地上霜。</p>
<p>举头望明月，低头思故乡。</p>
<hr />
<h3>春晓</h3>
<p>春眠不觉晓，处处闻啼鸟。</p>
<p>夜来风雨声，花落知多少。</p>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9fc74b9832724c0d9afb0f90417e22ae.png)



### div标签

div（division 分区），用来划分一个区域。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>div标签</title>
    </head>
    <body>
        <!--这是第一首诗-->
        <div>
            <h3>静夜思</h3>
            <p>床前明月光，疑是地上霜。</p>
            <p>举头望明月，低头思故乡。</p>
        </div>
        <hr/>
        <!--这是第二首诗-->
        <div>
            <h3>春晓</h3>
            <p>春眠不觉晓，处处闻啼鸟。</p>
            <p>夜来风雨声，花落知多少。</p>
        </div>
    </body>
</html>
```



## 列表

在HTML中，列表共有3中：有序列表、无序列表、定义列表。

### ol标签

ol标签（ordered list 有序列表）表示各个列表项是有顺序的。

```html
<ol>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
    <li>jQuery</li>
    <li>Vue.js</li>
</ol>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f3469372dbbc46bfad3b6ea291c21219.png)

**type属性**

![在这里插入图片描述](https://img-blog.csdnimg.cn/0d42b74423a048648f07b864f73f0588.png)

```html
<ol type="a">
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
    <li>jQuery</li>
    <li>Vue.js</li>
</ol>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/30b6b713d2f34ca5991e50a12ea5d846.png)



### ul标签

ul标签（unordered list 无序列表）。ul元素的子元素只能是li元素，不能是其他元素。

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
    <li>jQuery</li>
    <li>Vue.js</li>
</ul>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1668e09cc5b147ababd2e01eec5fbc6d.png)

**type属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f382319ffc34bad9f858f4160f6edf3.png)

```html
<ul type="circle">
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
    <li>jQuery</li>
    <li>Vue.js</li>
</ul>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4d5ffbdb54964595b3091d3551b4c8e5.png)



### dl标签

dl（definition list 定义列表），dt（definition term 定义名称），dd（difinition description 定义秒杀）。

`dl`标签定义列表开始和结束，`dt`标签定义解释的名词，`dd`标签定义具体解释。

```html
<dl>
    <dt>HTML</dt>
    <dd>制作网页的标准语言，控制网页的结构</dd>
    <dt>CSS</dt>
    <dd>层叠样式表，控制网页的样式</dd>
    <dt>JavaScript</dt>
    <dd>脚本语言，控制网页的行为</dd>
</dl>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/51ef7f9bba224df395f1d3bbca4518b8.png)



## 表格

### 基本结构

在HTML中一个表格由以下3个部分组成：

- table标签
- tr标签
- td标签

```html
<table border="1">
    <tr>
        <td>HTML</td>
        <td>CSS</td>
    </tr>
    <tr>
        <td>JavaScript</td>
        <td>jQuery</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bc90ecf87e8a4865a21f3d32c7adb3f3.png)

### 完整结构

**caption标签使用：**

```html
<table border="1">
    <caption>考试成绩表</caption>
    <tr>
        <td>小明</td>
        <td>80</td>
        <td>80</td>
        <td>80</td>
    </tr>
    <tr>
        <td>小红</td>
        <td>90</td>
        <td>90</td>
        <td>90</td>
    </tr>
    <tr>
        <td>小杰</td>
        <td>100</td>
        <td>100</td>
        <td>100</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/89fdacee271e40bb8276495577d2eb22.png)

**th标签使用：**

th指table header cell，表头单元格。

```html
<table border="1">
    <caption>考试成绩表</caption>
    <tr>
        <th>姓名</th>
        <th>语文</th>
        <th>英语</th>
        <th>数学</th>
    </tr>
    <tr>
        <td>小明</td>
        <td>80</td>
        <td>80</td>
        <td>80</td>
    </tr>
    <tr>
        <td>小红</td>
        <td>90</td>
        <td>90</td>
        <td>90</td>
    </tr>
    <tr>
        <td>小杰</td>
        <td>100</td>
        <td>100</td>
        <td>100</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2cd9d285d58f42f0b6352dffc6aa7c8a.png)

**thead/tbody/tfoot标签使用：**

thead、tbody、tfoot把表格分为3部分：表头、表身、表脚。

```html
<table border="1">
    <caption>考试成绩表</caption>
    <thead>
        <tr>
            <th>姓名</th>
            <th>语文</th>
            <th>英语</th>
            <th>数学</th>
        <tr>
    </thead>
    <tbody>
        <tr>
            <td>小明</td>
            <td>80</td>
            <td>80</td>
            <td>80</td>
        </tr>
        <tr>
            <td>小红</td>
            <td>90</td>
            <td>90</td>
            <td>90</td>
        </tr>
        <tr>
            <td>小杰</td>
            <td>100</td>
            <td>100</td>
            <td>100</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>平均</td>
            <td>90</td>
            <td>90</td>
            <td>90</td>
        </tr>
    </tfoot>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d3cfbfe294094da4af194a21bb8b806d.png)

### 合并行 colspan

```html
<table width="400px" border="1">
    <tr>
        <td>A</td>
        <td>B</td>
        <td colspan="2">C</td>
    </tr>
    <tr>
        <td>D</td>
        <td colspan="3">E</td>
    </tr>
    <tr>
        <td>F</td>
        <td>G</td>
        <td>H</td>
        <td>I</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b471d7808344f4b82870efa1dcaa5e2.png)

### 合并列 rowspan

```html
<table width="400px" border="1">
    <tr>
        <td>A</td>
        <td>B</td>
        <td>C</td>
        <td>D</td>
    </tr>
    <tr>
        <td>E</td>
        <td rowspan="2">F</td>
        <td>G</td>
        <td rowspan="3">H</td>
    </tr>
    <tr>
        <td>I</td>
        <td>J</td>
    </tr>
    <tr>
        <td>K</td>
        <td>L</td>
        <td>M</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c824771c9bf44d6964820bb3e93c852.png)

```html
<table width="400px" border="1">
    <tr>
        <td>A</td>
        <td>B</td>
        <td>C</td>
        <td>D</td>
    </tr>
    <tr>
        <td>E</td>
        <td rowspan="2">F</td>
        <td colspan="2" rowspan="3">G</td>
    </tr>
    <tr>
        <td>H</td>
    </tr>
    <tr>
        <td>I</td>
        <td>J</td>
    </tr>
</table>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a6521718631a4bb9a53ffce186ce4f71.png)



## 图片

**img标签属性：**

| 属性  | 说明                                                         |
| ----- | ------------------------------------------------------------ |
| src   | 图片路径                                                     |
| alt   | 图片描述，给搜索引擎看的。党图片无法显示时，页面会显示alt中的文字 |
| title | 图片描述，给用户看到。党鼠标指针移到图片上是，会显示title中的文字 |

实际开发中，src和alt是必选属性。



### 图片格式

在HTML中，图片格式有2种：

- 位图：又称为像素图，由像素点组成的图片。放大或缩小图片都会导致失真。常见的图片格式：
  - jpg/jpeg
  - png
  - gif
- 矢量图：可以防止图片放大或缩小引起的失真。缺点图片色彩相对简单。常见的矢量图格式：
  - ai
  - cdr
  - fh
  - swf



## 超链接

### a标签

```html
<a href="https://www.baidu.com/" >跳转百度</a>
```

**a标签属性：**

| 属性   | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| href   | 超链接路径                                                   |
| target | 超链接打开窗口的方式：<br />1. `_self`：默认值，在原来窗口打开链接。<br />2.`_blank`：在新窗口打开。<br />3.`_parent`：在父窗口打开。<br />4.`_top`：在顶层窗口打开。 |



### 锚点链接

**使用锚点链接：**

1. 定义目标元素的id。
2. 在href指向目标元素id。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <div>
            <a href="#article">推荐文章</a><br />
            <a href="#music">推荐音乐</a><br />
            <a href="#movie">推荐电影</a><br />
        </div>
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        <div id="article">
            <h3>推荐文章</h3>
            <ul>
                <li>朱自清-荷塘月色</li>
                <li>余光中-乡愁</li>
                <li>鲁迅-阿Q正传</li>
            </ul>
        </div>
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        <div id="music">
            <h3>推荐音乐</h3>
            <ul>
                <li>林俊杰-被风吹过的夏天</li>
                <li>曲婉婷-我的歌声里</li>
                <li>许嵩-灰色头像</li>
            </ul>
        </div>
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        ……<br />
        <div id="movie">
            <h3>推荐电影</h3>
            <ul>
                <li>蜘蛛侠系列</li>
                <li>钢铁侠系列</li>
                <li>复仇者联盟</li>
            </ul>
        </div>
    </body>
</html>
```



## 表单

### form标签

**form标签属性：**

| 属性    | 说明                                       |
| ------- | ------------------------------------------ |
| name    | 表单名称。name属性是为了区分不同的form表单 |
| method  | 提交方式：<br />1.get。<br />2.post。      |
| action  | 提交地址                                   |
| target  | 打开方式                                   |
| enctype | 编码方式                                   |



### input标签

**input标签属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/8596ba3ed5054e9d8e1387e46105093a.png)

### 单行文本框

**单行文本属性：**

| 属性      | 说明                       |
| --------- | -------------------------- |
| value     | 设置默认值                 |
| size      | 设置文本框长度             |
| maxlength | 设置文本框最多输入的字符数 |

```html
<form method="post">
    姓名：<input type="text" maxlength="5"><br>
    年龄：<input type="text" maxlength="3" size="5">
</form>
```

### 密码文本框

密码文本框的属性与单行文本框类似。

```html
<form method="post">
    账号：<input type="text" size="15" maxlength="10" /><br />
    密码：<input type="password" size="15" maxlength="10" />
</form>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/abb2c503bd4b4241a56fb9977aebbf3b.png)

### 单选框

**单选框属性：**

| 属性    | 说明                                         |
| ------- | -------------------------------------------- |
| name    | 组名                                         |
| value   | 单选框取值                                   |
| checked | 表示选中，`checked`等价于`checked="checked"` |

```html
<label><input type="radio" name="gender" value="男">男</label>
<label><input type="radio" name="gender" value="女">女</label>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1be0de2535334f91838361e62a4b7a15.png)

### 复选框

复选框属性与单选框类似。

```html
<h3>你喜欢的水果:</h3>
<label><input type="checkbox" name="fruit" value="苹果" />苹果</label>
<label><input type="checkbox" name="fruit" value="香蕉" />香蕉</label>
<label><input type="checkbox" name="fruit" value="西瓜" />西瓜</label>
<label><input type="checkbox" name="fruit" value="李子" />李子</label>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2960a96cef514c949f08ca1b599fff3b.png)

### 按钮

在HTML中常见按钮有3种：

- 普通按钮（button）：一般配合JavaScript操作。
- 提交按钮（submit）：一般用来向服务器提交数据。
- 重置按钮（reset）：一般用来清除表单的文本框内容。

```html
<input type="button" value="普通按钮" />
<input type="submit" value="提交按钮" />
<input type="reset" value="重置按钮" />
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a1e6a24cdf854ebeb9a82f4f5ccb9790.png)

### 文件上传

```html
<form method="post">
    <input type="file" />
</form>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e06de55c430e40bc8963bb2b3d3fe847.png)

### 多行文本框

**多行文本框属性：**

| 属性      | 说明                 |
| --------- | -------------------- |
| rows      | 行数                 |
| cols      | 列数                 |
| maxlength | 设置最多输入的字符数 |

```html
个人简介：<br />
<textarea rows="5" cols="20">请介绍一下你自己</textarea>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/dd06c85de21942f99f7c89026898f0f3.png)

### 下拉列表

下拉列表由select标签和option标签配合使用。

**select标签属性：**

| 属性     | 说明             |
| -------- | ---------------- |
| multiple | 设置多选         |
| size     | 设置列表显示数量 |

**option标签属性：**

| 属性     | 说明     |
| -------- | -------- |
| selected | 是否选中 |
| value    | 选项值   |



```html
<select>
    <option>HTML</option>
    <option>CSS</option>
    <option>JavaScript</option>
    <option>jQuery</option>
</select>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2a399b218cdd4a75a873bbb932819d1f.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/a9c22b3d29d349ee97eea41a4e6bb4e8.png)

**multiple属性**

```html
<select multiple>
    <option>HTML</option>
    <option>CSS</option>
    <option>jQuery</option>
    <option>JavaScript</option>
</select>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b7d4c9aea924d7db99300934154763b.png)

**selected属性**

```html
<select>
    <option>HTML</option>
    <option>CSS</option>
    <option>JavaScript</option>
    <option selected>jQuery</option>
</select>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8b6e23a8903c40639438c0f5604bb254.png)



## 框架

可以使用iframe标签实现一个内嵌框架，指在当前页面内再嵌入另外一个网页。

```html
<iframe src="http://news.baidu.com" width="200" depth="150"></iframe>
<iframe src="https://www.w3school.com.cn/index.html" width="200" depth="150"></iframe>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3cfd31545e054dd09e4b39034d85638b.png)



## HTML转义字符

| 显示结果 | 描述                             | 实体名称 |
| :------- | :------------------------------- | :------- |
|          | 空格，1个汉字约等于3个"`&nbsp;`" | `&nbsp;` |
| <        | 小于号                           | `&lt;`   |
| >        | 大于号                           | `&gt;`   |
| &        | 和号                             | `&amp;`  |
| "        | 引号                             | `&quot;` |
| &copy;   | 版权符号                         | `&copy;` |

![在这里插入图片描述](https://img-blog.csdnimg.cn/c0796190f8d846a19bf14b92340e640f.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/da59fd151e5d4446aff6b0c788ad60c1.png)



