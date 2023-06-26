[TOC]



# CSS 基础

## 概述

- CSS（Cascading Style Sheet，层叠样式表），是用来给HTML标签添加样式的语言。
- HTML用于控制网页的结构，CSS用于控制网页的外观，JavaScript控制的是网页的行为。

W3C官网 : [http://w3school.com.cn/](http://w3school.com.cn/)



## CSS 和 CSS3区别

CSS：常说的CSS指的是CSS2.1。

CSS3：CSS3特指相对于CSS2.1新增加的内容，CSS3相对于CSS2.1来说，新增了大量属性，不仅可以让页面更加酷炫，最重要的是可以提高网站的可维护性以及访问速度。



## 编写位置

CSS共有3种引入方式：

- 外部样式表。
- 内部样式表。
- 行内样式表。

### 外部样式表

将样式写在一个独立的` .css` 文件中，通过 HTML 文档中的 `<link>` 标签引入。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link rel="stylesheet" type="text/css" href="css/index.css" />
    </head>
    <body>
    </body>
</html>
```

- rel属性：relative的缩写，取值固定，表示引入的是一个样式表。
- type属性：取值固定，即`type="text/css"`，表示这是标准的CSS。
- href属性：表示CSS文件的路径。

### 内部样式表

将样式写在 HTML文档中的 `<style>` 标签内。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title></title>
        <style type="text/css">
            div{color:red;}
        </style>
    </head>
    <body>
        <div>HTML</div>
        <div>CSS</div>
        <div>JavaScript</div>
    </body>
</html>
```

- 使用内部样式表，CSS样式必须放在style标签内。
- style标签必须放在head标签内。

### 内联样式表

将样式写在 HTML文档中的 `<style>` 标签内。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title></title>
    </head>
    <body>
        <div style="color:red;">HTML</div>
        <div style="color:red;">CSS</div>
        <div style="color:red;">JavaScript</div>
    </body>
</html>
```

### 三种位置样式总结

| 样式表     | 优点                     | 缺点                     |
| ---------- | ------------------------ | ------------------------ |
| 内联样式表 | 书写方便，权重高         | 没有实现样式和结构相分离 |
| 内部样式表 | 部分结构和样式相分离     | 没有彻底分离             |
| 外部样式表 | 完全实现结构和样式相分离 | 需要引入                 |



## @import

`@impor`是CSS提供的引入外部样式表的方法。 

在CSS文件中，使用`@import`规则导入其他CSS文件。将`@import`规则放在CSS文件的顶部，确保导入的CSS文件中的样式在文件中的其他样式之前加载。

**语法格式如下：**

```css
@import url("style.css");
```

请注意：使用@import规则可能会影响页面加载时间。如果您有多个CSS文件，最好将它们合并为一个文件，以减少页面加载时间。



## 浏览器私有前缀

由于CSS3新增的一些属性尚未成为W3C标准的一部分，因此对于这些属性来说，每种内核的浏览器都只能识别“带有自身私有前缀的属性”。也就是说，我们在书写CSS3属性的时候，可能需要在属性前面加上浏览器的私有前缀，然后该浏览器才能识别对应的CSS3属性。

### 浏览器私有前缀

![在这里插入图片描述](https://img-blog.csdnimg.cn/2be3985b145241bc8812d30b724b8364.png)

**例如：**

使用CSS3来实现边框阴影效果。

```
border-shadow:5px 5px 10px red;
```

但是并非所有浏览器都能识别border-shadow这个属性，例如Chrome只能识别-webkit-border-shadow（前缀为-webkit-），而Firefox只能识别-moz-border-shadow（前缀为-moz-）。因此，如果想要让所有主流浏览器都能实现边框阴影效果，我们需要这样写：

```
border-shadow:5px 5px 10px red;
-webkit-border-shadow:5px 5px 10px red;
-moz-border-shadow:5px 5px 10px red;
-ms-border-shadow:5px 5px 10px red;
-o-border-shadow:5px 5px 10px red;
```

### 低版本兼容

对于IE浏览器来说，暂时只有IE9及以上版本支持CSS3属性，但是有时候我们需要兼容IE6~IE8，可以借助ie-css3.htc这个扩展文件来实现。

需要把ie-css3.htc文件放到站点下，然后在元素的CSS中借助behavior属性来引入就可以了，代码如下：

```
div {
  /* 通知IE浏览器调用ie-css3.htc文件作用于div元素*/
  behavior: url(ie-css3.htc);
  /*接下来，div元素就可以使用CSS3属性了*/
  border-radius: 15px;
  box-shadow: 10px 10px 20px #000;
}
```

- 当前元素一定要有定位属性，如position:relative或position:absolute，否则ie-css3.htc无法生效。
- ie-css3.htc文件支持的CSS3属性有限，暂时只支持border-radius、box-shadow、text-shadow属性。

### CSS3兼容查询

[Can I use](https://caniuse.com/)



## reset.css

https://meyerweb.com/eric/tools/css/reset/

Reset.css 是由 CSS 大牛 Eric Meyer 编写的样式重置文件，适用于现代浏览器和老旧浏览器。该文件可以清除所有元素的外边距（margin）、内边距（padding）和边框（border），并将字体大小（font-size）和字体粗细（font-weight）都设置为默认值。

```css
/* http://meyerweb.com/eric/tools/css/reset/ */
/* v1.0 | 20080212 */

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, font, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	font-size: 100%;
	vertical-align: baseline;
	background: transparent;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}

/* remember to define focus styles! */
:focus {
	outline: 0;
}

/* remember to highlight inserts somehow! */
ins {
	text-decoration: none;
}
del {
	text-decoration: line-through;
}

/* tables still need 'cellspacing="0"' in the markup */
table {
	border-collapse: collapse;
	border-spacing: 0;
}
```



## normalize.css

https://necolas.github.io/normalize.css/

Normalize.css 是一种相对于传统的 reset.css 文件更加“温和”的样式重置文件，能够在保留有用的浏览器默认样式的同时，修复不同浏览器之间的差异。该文件支持 HTML5 元素，并且能够在多种媒体查询下工作。

```css
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
```

