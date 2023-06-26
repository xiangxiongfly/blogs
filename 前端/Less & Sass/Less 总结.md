[toc]

# Less 总结

## 概述

Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言。这里呈现的是 Less 的官方文档（中文版），包含了 Less 语言以及利用 JavaScript 开发的用于将 Less 样式转换成 CSS 样式的 Less.js 工具。

因为 Less 和 CSS 非常像，Less具有以下优点：

1. 变量：可以定义变量来存储颜色、字体、大小等常用样式，方便后续的样式修改和维护。
2. 嵌套规则：可以将相关的选择器嵌套在一起，使代码更加简洁易读。
3. 混合（Mixin）：可以将一些常用的样式封装成一个Mixin，然后在需要使用的地方直接调用，提高代码复用性。
4. 函数：可以自定义函数来处理样式，例如颜色的加减、字体的计算等。
5. Import：可以将多个Less文件合并成一个CSS文件，简化代码结构。

Less可以被认为是CSS的一种扩展，属于CSS系列的一部分。

[Less 快速入门 | Less.js 中文文档 - Less 中文网 (bootcss.com)](https://less.bootcss.com/)



## 注释

Less的注释分2种：

- 行注释：编译后不会在CSS文件中出现。
- 块注释：编译后会保留在CSS文件中。

```less
// hello red
@a: red;
/**
* hello blue
*/
@b: blue;
```



## 变量

### 属性值变量

用符号`@`声明变量，使用时用`@变量`。

```less
@width: 100px;
@height: 100px;
@color: red;

.box {
  width: @width;
  height: @height;
  background-color: @color;
  margin: auto;
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  margin: auto;
}
```

### 属性名变量

用符号`@`声明变量，使用时用`@{变量}`。

```less
@width: width;
@height: height;
@border: border;
@margin: margin;

.box {
  @{width}: 100px;
  @{height}: 100px;
  @{border}: 1px solid red;
  @{margin}: auto;
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  border: 1px solid red;
  margin: auto;
}
```

### 选择器变量

```less
@outer: .outer;
@inner: .inner;

@{outer} {
  width: 200px;
  height: 200px;
  border: 1px solid red;
  @{inner} {
    width: 100px;
    height: 100px;
    border: 1px dashed green;
  }
}
```

编译为：

```css
.outer {
  width: 200px;
  height: 200px;
  border: 1px solid red;
}
.outer .inner {
  width: 100px;
  height: 100px;
  border: 1px dashed green;
}
```

### url变量

```less
@image_path: "../images/";

.box {
  width: 100px;
  height: 100px;
  background-image: url("@{image_path}a.jpg");
}
```

编译为：

```css
.box {
  width: 100px;
  height: 100px;
  background-image: url("../images/a.jpg");
}
```

### 变量作用域

Less 中的作用域与 CSS 中的作用域非常类似，就近原则。

```less
@color: red;

.outer {
  .inner {
    width: 100px;
    height: 100px;
    background-color: @color;
    margin: auto;
  }
  @color: green;
}
```

编译为：

```css
.outer .inner {
  width: 100px;
  height: 100px;
  background-color: green;
  margin: auto;
}
```

### 变量运算

Less 的变量运算十分强大：

- 加减时，以第一个数据的单位为基准。
- 乘除时，注意单位一定要统一。
- 在连接运算的时候，注意添加空格避免变量产生找不到的报错。

为了与 CSS 保持兼容，`calc()` 并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

```less
@width: 200px;
@height: 200px;
@color: red;
@inner_width: @width - 100;
@inner_height: (@width / 2);
@inner_color: green;

.outer {
  width: @width;
  height: @height;
  background-color: @color;
  margin: auto;
  .inner {
    width: @inner_width;
    height: @inner_height;
    background-color: @inner_color;
    margin: auto;
  }
}
```

编译为：

```css
.outer {
  width: 200px;
  height: 200px;
  background-color: red;
  margin: auto;
}
.outer .inner {
  width: 100px;
  height: 100px;
  background-color: green;
  margin: auto;
}
```

### 变量懒加载

当定义一个变量两次时，使用该变量的最后一个定义，从当前范围向上搜索。这类似于css本身，定义中的最后一个属性用于确定值。

```less
@size: 90px;
@color: red;

.wrap {
  @color: green;
  .box {
    width: @size;
    height: @size;
    background-color: @color;
  }
  @color: blue;
}
```

编译为：

```css
.wrap .box {
  width: 90px;
  height: 90px;
  background-color: blue;
}
```



## 嵌套

Less 提供了使用嵌套（nesting）代替层叠或与层叠结合使用的能力。

### &符号

`&` 表示当前选择器的父级。

```less
div {
  border: 1px solid red;
  margin: auto;
  overflow: hidden;
  ul {
    list-style: none;
    li {
      float: left;
      &:first-child {
        color: pink;
      }
      &:last-child {
        color: green;
      }
    }
  }
}
```

编译为：

```css
div {
  border: 1px solid red;
  margin: auto;
  overflow: hidden;
}
div ul {
  list-style: none;
}
div ul li {
  float: left;
}
div ul li:first-child {
  color: pink;
}
div ul li:last-child {
  color: green;
}
```

**清除浮动**

```less
.clearfix {
  display: block;
  zoom: 1;
  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

编译：

```css
.clearfix {
  display: block;
  zoom: 1;
}
.clearfix:after {
  content: " ";
  display: block;
  font-size: 0;
  height: 0;
  clear: both;
  visibility: hidden;
}
```

### 媒体查询

在使用媒体查询，都要把一个元素分开写。

```less
.box {
  height: 100px;    
  @media screen {
    @media (max-width: 299px) {
      background-color: red;
    }
  }
  @media screen {
    @media (min-width: 300px) {
      @media (max-width: 399px) {
        background-color: green;
      }
    }
  }
  @media screen {
    @media (min-width: 400px) {
      background-color: blue;
    }
  }
}
```

编译为：

```css
.box {
  height: 100px;
}
@media screen and (max-width: 299px) {
  .box {
    background-color: red;
  }
}
@media screen and (min-width: 300px) and (max-width: 399px) {
  .box {
    background-color: green;
  }
}
@media screen and (min-width: 400px) {
  .box {
    background-color: blue;
  }
}
```



## 混合

混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。

### 无参方法

- 符号`.`和`#`都可以作为方法前缀。
- 方法后的`()`可以省略，下面的两种方法都是一样的效果。

**方式一：省略括号**

```less
.bordered {
  border: 2px dashed black;
}

.box {
  width: 200px;
  height: 200px;
  margin: auto;
  .bordered; 
}
```

编译为：

```css
.bordered {
  border: 2px dashed black;
}
.box {
  width: 200px;
  height: 200px;
  margin: auto;
  border: 2px dashed black;
}
```

**方式二：添加括号**

```less
.bordered() {
  border: 2px dashed black;
}

.box {
  width: 200px;
  height: 200px;
  margin: auto;
  .bordered(); 
}
```

编译为：

```css
.box {
  width: 200px;
  height: 200px;
  margin: auto;
  border: 2px dashed black;
}
```

### 带参数方法

- 参数必须是CSS属性值。

```less
.bordered(@width,@style,@color) {
  border: @width @style @color;
}

.box {
  width: 200px;
  height: 200px;
  margin: auto;
  .bordered(5px,solid,red);
}
```

编译为：

```css
.box {
  width: 200px;
  height: 200px;
  margin: auto;
  border: 5px solid red;
}
```

### 默认参数

- Less 可以使用默认参数，如果没有传参数，那么将使用默认参数。
- @arguments 类似 JS 中的 arguments 指代的是全部参数。

```less
.bordered(@width:2px,@style:dashed,@color:blue) {
  border: @width @style @color;
}

.box {
  width: 200px;
  height: 200px;
  margin: auto;
  .bordered();
}
```

编译为：

```css
.box {
  width: 200px;
  height: 200px;
  margin: auto;
  border: 2px dashed blue;
}
```

**使用@argument**

```less
.bordered(@width:2px,@style:dashed,@color:blue) {
  border: @arguments;
}

.box {
  width: 200px;
  height: 200px;
  margin: auto;
  .bordered();
}
```

编译为：

```css
.box {
  width: 200px;
  height: 200px;
  margin: auto;
  border: 2px dashed blue;
}
```

### 方法的匹配模式

- 第一个参数 left 要会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样 式覆盖替换。 
- 如果匹配的参数 是变量，则将会匹配，如 @_ 。

```less
.triangle(@_,@width:20px,@color:red) {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: @width;
  border-color: transparent;
}
.triangle(top,@width:20px,@color:red) {
  border-top-color: @color;
}
.triangle(right,@width:20px,@color:red) {
  border-right-color: @color;
}
.triangle(bottom,@width:20px,@color:red) {
  border-bottom-color: @color;
}
.triangle(left,@color:red) {
  border-left-color: @color;
}

.box1 {
  .triangle(right);
}
.box2 {
  .triangle(right,50px);
}
.box3 {
  .triangle(right,50px,blue);
}
```

编译为：

```css
.box1 {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 20px;
  border-color: transparent;
  border-right-color: red;
}
.box2 {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50px;
  border-color: transparent;
  border-right-color: red;
}
.box3 {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50px;
  border-color: transparent;
  border-right-color: blue;
}
```

### 方法的命名空间

对混合（mixins）进行分组。

```less
.bundle() {
  .button1() {
    width: 50px;
    border: 1px solid red;
    background-color: pink;
  }
  .button2() {
    width: 100px;
    border: 1px solid green;
    background-color: greenyellow;
  }
  .button3() {
    width: 200px;
    border: 1px solid blue;
    background-color: blueviolet;
  }
}

.box .button1 {
  .bundle.button1();
}

.box .button2 {
  .bundle.button2();
}

.box .button3 {
  .bundle.button3();
}
```

编译为：

```css
.box .button1 {
  width: 50px;
  border: 1px solid red;
  background-color: pink;
}
.box .button2 {
  width: 100px;
  border: 1px solid green;
  background-color: greenyellow;
}
.box .button3 {
  width: 200px;
  border: 1px solid blue;
  background-color: blueviolet;
}
```

### 方法的条件筛选

Less 没有 if-else，可以通过when进行条件判断。

```less
.card() {
  .border (@width,@style,@color) {
    border: @width @style @color;
  }
  .border(@width,@style,@color) when(@width>50px) {
    border: @width @style @color;
    background-color: blue;
  }
}
@width: 60px;

.box {
  width: @width;
  height: @width;
  .card.border(@width,solid,red);
}
```

编译为：

```css
.box {
  width: 60px;
  height: 60px;
  border: 60px solid red;
  background-color: blue;
}
```



```less
.card() {
  .border (@width,@style,@color) {
    border: @width @style @color;
  }
  .border(@width,@style,@color) when(@width>50px) {
    border: @width @style @color;
    background-color: blue;
  }
}
@width: 20px;

.box {
  width: @width;
  height: @width;
  .card.border(@width,solid,red);
}
```

编译为：

```css
.box {
  width: 20px;
  height: 20px;
  border: 20px solid red;
}
```

### !important

```less
.border() {
  border: 2px dashed blue;
}
.box {
  .border() !important;
  border: 1px solid red;
}
```

编译为：

```css
.box {
  border: 2px dashed blue !important;
  border: 1px solid red;
}
```



### 混合映射

从 Less 3.5 版本开始，你还可以将混合（mixins）和规则集（rulesets）作为一组值的映射（map）使用。

```less
#colors() {
  primary: blue;
  secondary: green;
}
#size() {
  w100: 100px;
  w200: 100px;
}

.box1 {
  width: #size[w100];
  height: #size[w100];
  background-color: #colors[primary];
}

.box2 {
  width: #size[w200];
  height: #size[w200];
  background-color: #colors[secondary];
}
```

编译为：

```css
.box1 {
  width: 100px;
  height: 100px;
  background-color: blue;
}
.box2 {
  width: 100px;
  height: 100px;
  background-color: green;
}
```



## 继承

### extend

extend可以继承所有匹配声明中的全部样式。

```less
.base {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
}

.box {
  &:extend(.base);
}
```

编译为：

```css
.base,
.box {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
}
```

### all

all可以使用选择器匹配到的全部声明。

**没有使用all之前：**

```less
.base {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
  &:after {
    content: "hello";
  }
}

.box {
  &:extend(.base);
}
```

编译为：

```css
.base,
.box {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
}
.base:after {
  content: "hello";
}
```

**没有使用all之后：**

```less
.base {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
  &:after {
    content: "hello";
  }
}

.box {
  &:extend(.base all);
}
```

编译为：

```css
.base,
.box {
  width: 100px;
  height: 100px;
  border: 10px dashed blue;
  background-color: red;
}
.base:after,
.box:after {
  content: "hello";
}
```



## 导入

### @import

```less
// my_border.less
.my_border {
  border: 2px solid red;
}
```

```less
//index.less
@import "./my_border.less";

.outer {
  width: 200px;
  height: 200px;
  .my_border();
  .inner {
    width: 100px;
    height: 100px;
    .my_border();
  }
}
```

编译为：

```css
.my_border {
  border: 2px solid red;
}
.outer {
  width: 200px;
  height: 200px;
  border: 2px solid red;
}
.outer .inner {
  width: 100px;
  height: 100px;
  border: 2px solid red;
}
```

### @import (once)

@import语句的默认行为。这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解

```less
@import (once) "./my_border.less";
@import (once) "./my_border.less";
```

编译为：

```css
.my_border {
  border: 2px solid red;
}
```

### @import (multiple)

使用@import (multiple)允许导入多个同名文件。

```less
@import (multiple) "./my_border.less";
@import (multiple) "./my_border.less";
```

编译为：

```css
.my_border {
  border: 2px solid red;
}
.my_border {
  border: 2px solid red;
}
```

### @import (reference)

导入Less文件，但不会编译它。

```less
@import (reference) "./my_border.less";
```



## 函数

### 逻辑函数

- if()
- boolean()

```less
@size: 100px;

.box {
  width: @size;
  height: @size;
  background-color: if(@size>=100px, red, green);
}
```

```less
@size: 90px;

.box {
  width: @size;
  height: @size;
  background-color: if(boolean(@size>=100px), red, green);
}
```



### 类型检测函数

- iscolor()：是否为颜色。
- isnumber()：是否为数字
- isstring()：是否为字符串。
- iskeyword()：是否为关键字，如“red”、
- isurl()

```less
@size: 90px;
@var: #123123;

.box {
  width: @size;
  height: @size;
  background-color: if(iscolor(@var), red, green);
}
```

```less
@size: 90px;
@var: 123;

.box {
  width: @size;
  height: @size;
  background-color: if(isnumber(@var), red, green);
}
```

```less
@size: 90px;
@var: "123";

.box {
  width: @size;
  height: @size;
  background-color: if(isstring(@var), red, green);
}
```

```less
@size: 90px;
@var: border;

.box {
  width: @size;
  height: @size;
  background-color: if(iskeyword(@var), red, green);
}
```

```less
@size: 90px;
@var: url("https://www.example.com");

.box {
  width: @size;
  height: @size;
  background-color: if(isurl(@var), red, green);
}
```



### 单位检测函数

- ispixel()：是否为像素。
- ispercentage()：是否为%。
- isem()：是否为em。
- isunit()：是否为指定单位。

```less
@size: 90px;

.box {
  width: @size;
  height: @size;
  background-color: if(ispixel(@size), red, green);
}
```

```less
@size: 50%;

.box {
  width: @size;
  height: @size;
  background-color: if(ispercentage(@size), red, green);
}
```

```less
@size: 50em;

.box {
  width: @size;
  height: @size;
  background-color: if(isem(@size), red, green);
}
```

```less
@size: 50px;

.box {
  width: @size;
  height: @size;
  background-color: if(isunit(@size, px), red, green);
}
```

