[toc]

# Sass 总结

## 概述

Sass 是一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。使用 Sass 以及 Sass 的样式库（如 [Compass](http://compass-style.org/)）有助于更好地组织管理样式文件，以及更高效地开发项目。

[Sass世界上最成熟、稳定和强大的CSS扩展语言 | Sass中文网](https://www.sass.hk/)



## 编译

在VS Code中安装插件`Live Sass Compiler`，编写Sass文件时会自动编译为CSS文件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/61458fdad6d149b4b7b4b8ad94f04625.png)



## .scss 和 .sass

Sass 有两种语法格式：

- scss：这种格式仅在 CSS3 语法的基础上进行拓展，所有 CSS3 语法在 SCSS 中都是通用的，同时加入 Sass 的特色功能。以 `.scss` 作为拓展名。
- sass：是早期的 Sass 语法格式，使用缩进格式，`.sass` 作为拓展名。



## 变量

### 数据类型

SassScript 支持 6 种主要的数据类型：

- 数字，`1, 2, 13, 10px`
- 字符串，有引号字符串与无引号字符串，`"foo", 'bar', baz`
- 颜色，`blue, #04a3f9, rgba(255,0,0,0.5)`
- 布尔型，`true, false`
- 空值，`null`
- 数组 (list)，用空格或逗号作分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`
- maps, 相当于 JavaScript 的 object，`(key1: value1, key2: value2)`

### 属性值变量

用符号`$`声明变量，使用时用`$变量`。

```scss
$width: 100px;
$height: 100px;
$color: red;

.box {
  width: $width;
  height: $height;
  background-color: $color;
  margin:50px auto;
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  margin: 50px auto;
}
```

### 属性名变量

用符号`$`声明变量，使用时用`#{$变量}`。

```scss
$width: width;
$height: height;
$color: background-color;

.box {
  #{$width}: 100px;
  #{$height}: 100px;
  #{$color}: red;
  margin: 50px auto;
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  margin: 50px auto;
}
```



## 嵌套规则

### 基本嵌套

```scss
.header {
  border: 1px solid red;
  .title {
    font-size: 18px;
    color: blue;
  }
  nav {
    font-size: 14px;
    color: green;
  }
}
```

编译为：

```css
.header {
  border: 1px solid red;
}
.header .title {
  font-size: 18px;
  color: blue;
}
.header nav {
  font-size: 14px;
  color: green;
}
```

### 嵌套属性

**方式一**

```scss
.box {
  width: 100px;
  height: 100px;
  border: {
    style: solid;
    width: 1px;
    color: red;
  }
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border-style: solid;
  border-width: 1px;
  border-color: red;
}
```

**方式二**

```scss
.box {
  width: 100px;
  height: 100px;
  border: 1px solid red {
    left-style: dashed;
    right: 0;
    top-color: green;
    bottom-width: 5px;
  }
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border: 1px solid red;
  border-left-style: dashed;
  border-right: 0;
  border-top-color: green;
  border-bottom-width: 5px;
}
```



## &符号

### 表示父选择器

```scss
a {
  color: red;
  &:visited {
    color: green;
  }
  &:hover {
    color: blue;
  }
  &:active {
    color: black;
  }
}
```

编译为：

```css
a {
  color: red;
}
a:visited {
  color: green;
}
a:hover {
  color: blue;
}
a:active {
  color: black;
}
```

### 拼接选择器

```scss
.aaa {
  padding: 10px;
  &_active {
    padding: 20px;
  }
}
```

编译为：

```css
.aaa {
  padding: 10px;
}
.aaa_active {
  padding: 20px;
}
```



## @import 导入

### 导入Sass文件

使用`@import`导入Sass文件。

导入Sass文件时，可以省略`.scss`文件后缀。

```scss
// my-size.scss
$width: 200px;
$height: 100px;
```

```scss
// my-color.scss
$color: red;
$bg-color: blue;
```

```scss
@import "./my-size";
@import "./my-color";

.box {
  width: $width;
  height: $height;
  border: 10px solid $color;
  background-color: $bg-color;
}
```

编译为：

```css
.box {
  width: 200px;
  height: 100px;
  border: 10px solid red;
  background-color: blue;
}
```

### 私有化

如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。

如：将`my-color.scss`文件改为`_my-color.scss`，则表示不再编译`my-color.scss`文件。

导入时既可以用`@import "./_my-color";`，也可以用`@import "./my-color";`省略下划线。

### 导入原生CSS文件

由于`sass`兼容原生的`css`，所以它也支持原生CSS的`@import`。

在使用`@import`时，如果有`.css`后缀则按原生CSS方式导入，如果没有后缀则按Sass方式导入。

```css
/* style.css */
.box {
    margin: 0 auto;
    background-color: blue;
}
```

```scss
@import "style.css";
@import "my-color";
@import "my-size";
.box {
  width: $width;
  height: $height;
  border: 10px solid $color;
}
```

编译为：

```css
@import "style.css";
.box {
  width: 200px;
  height: 100px;
  border: 10px solid red;
}
```



## @mixin 混合器

如果你的整个网站中有几处小小的样式类似（例如一致的颜色和字体），那么使用变量来统一处理这种情况是非常不错的选择。

但是当你的样式变得越来越复杂，可以通过Sass的混合器实现大段样式的重用。

### 无参数

```scss
// my-style.scss
@mixin box-style {
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

```scss
@import "./my-style";
.box {
  width: 100px;
  height: 100px;
  @include box-style;
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

### 带参数

```scss
// my-style.scss
@mixin box-style($width, $height) {
  width: $width;
  height: $height;
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

```scss
@import "./my-style";
.box {
  @include box-style(100px, 200px);
}
```

编译为：

```css
.box {
  width: 100px;
  height: 200px;
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

### 命名参数

```scss
@import "./my-style";
.box {
  @include box-style($height: 200px, $width: 100px);
}
```

### 关键字参数

```scss
// my-style.scss
@mixin box-style($width: 100px, $height: 100px) {
  width: $width;
  height: $height;
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

```scss
@import "./my-style";
.box {
  @include box-style;
}
```

编译为：

```scss
.box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 10px solid red;
  background-color: blue;
  margin: 0 auto;
}
```

### 可变参数

- 不能确定混合指令需要使用多少个参数时，可以使用参数变量`...`声明，表示Sass将这些参数当作值列表处理。
- 页可以将值列表中的值逐条作为参数引用。

**方式一：值列表**

```scss
// my-style.scss
@mixin box-style($borders...) {
  border-radius: 50%;
  border: $borders;
  background-color: blue;
  margin: 0 auto;
}
```

```scss
@import "./my-style";
.box {
  width: 100px;
  height: 100px;
  @include box-style(5px solid green);
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid green;
  background-color: blue;
  margin: 0 auto;
}
```

**方式二：逐条引用**

```scss
// my-style.scss
@mixin box-style($border-width, $border-style, $border-color) {
  border-radius: 50%;
  border: $border-width $border-style $border-color;
  background-color: blue;
  margin: 0 auto;
}
```

```scss
@import "./my-style";
$borders: 10px dashed red;
.box {
  width: 100px;
  height: 100px;
  @include box-style($borders...);
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 10px dashed red;
  background-color: blue;
  margin: 0 auto;
}
```

### @content 混入内容

```scss
// my-style.scss
@mixin box-style {
  border-radius: 50%;
  background-color: blue;
  margin: 0 auto;
  @content;
}
```

```scss
@import "./my-style";
.box {
  width: 100px;
  height: 100px;
  @include box-style {
    border: 10px dashed green;
  }
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: blue;
  margin: 0 auto;
  border: 10px dashed green;
}
```



## @extend 继承

```scss
.base {
  color: red;
  background-color: blue;
}

.p-style {
  @extend .base;
  font-size: 30px;
}

```

编译为：

```css
.base, .p-style {
  color: red;
  background-color: blue;
}

.p-style {
  font-size: 30px;
}
```



## @media 媒体查询

Sass 中 `@media` 指令与 CSS 中用法一样，只是增加了一点额外的功能：允许其在 CSS 规则中嵌套。如果 `@media` 嵌套在 CSS 规则内，编译时，`@media` 将被编译到文件的最外层，包含嵌套的父选择器。这个功能让 `@media` 用起来更方便，不需要重复使用选择器，也不会打乱 CSS 的书写流程。

```scss
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  @media (min-width: 400px) {
    width: 200px;
    height: 200px;
    background-color: green;
  }
  @media (min-width: 800px) {
    width: 400px;
    height: 400px;
    background-color: blue;
  }
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
@media (min-width: 400px) {
  .box {
    width: 200px;
    height: 200px;
    background-color: green;
  }
}
@media (min-width: 800px) {
  .box {
    width: 400px;
    height: 400px;
    background-color: blue;
  }
}
```



## 控制指令

### @if

```scss
$type: b;
p {
  @if $type == a {
    border: 10px solid red;
  } @else if $type ==b {
    border: 10px dashed green;
  } @else {
    border: 10px dotted blue;
  }
}
```

编译为：

```css
p {
  border: 10px dashed green;
}
```

### @for

- 语法格式一：`@for $var from <start> through <end>`，包含end值。
- 语法格式二：`@for $var from <start> to <end>`，不包含end值。

```scss
@for $i from 1 to 4 {
  .item-#{$i} {
    font-size: 12px * $i;
  }
}
```

编译为：

```css
.item-1 {
  font-size: 12px;
}

.item-2 {
  font-size: 24px;
}

.item-3 {
  font-size: 36px;
}
```

### @each

`@each` 指令的格式是 `$var in <list>`, `$var` 可以是任何变量名，比如 `$length` 或者 `$name`，而 `<list>` 是一连串的值，也就是值列表。

```scss
@each $i in 1, 2, 3 {
  .item-#{$i} {
    font-size: 12px * $i;
  }
}
```

编译为：

```css
.item-1 {
  font-size: 12px;
}

.item-2 {
  font-size: 24px;
}

.item-3 {
  font-size: 36px;
}
```

### @while

```scss
$num: 3;
@while $num > 0 {
  .item-#{$num} {
    font-size: 12px * $num;
  }
  $num: $num - 1;
}
```

编译为：

```css
.item-3 {
  font-size: 36px;
}

.item-2 {
  font-size: 24px;
}

.item-1 {
  font-size: 12px;
}
```



## @function 函数

Sass 支持自定义函数，并能在任何属性值或 Sass script 中使用。

```scss
@function square($width) {
  @return $width * $width;
}
.box {
  width: square(10) + px;
  height: square(20) + px;
  border: 1px solid red;
}

```

编译为:

```css
.box {
  width: 100px;
  height: 400px;
  border: 1px solid red;
}
```

