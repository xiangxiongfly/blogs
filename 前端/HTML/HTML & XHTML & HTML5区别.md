[TOC]

# HTML & XHTML & HTML5区别

## HTML

HTML，全称“HyperText Mark-up Language（超文本标记语言）”，它是构成网页文档的主要语言。我们常说的HTML，指的是HTML4.01。



## XHTML

XHTML，全称“EXtensible HyperText Mark-up Language（扩展的超文本标记语言）”，它是XML风格的HTML4.01，我们可以称之为更严格、更纯净的HTML4.01。



## HTML5

HTML指的是HTML4.01，XHTML是XML风格的HTML4.01，它是HTML的过渡版本。而HTML5指的是下一代HTML，也就是HTML4.01的升级版.





## 区别

HTML语法书写比较松散，比较利于开发者编写。但是对于机器如电脑、手机等来说，语法越松散，处理起来越困难。因此，为了让机器更好地处理HTML，才在HTML的基础上引入了XHTML。

XHTML和HTML的主要区别如下：

- XHTML标签必须被关闭。

- XHTML标签以及属性必须小写。

- XHTML标签属性必须用引号。

- XHTML标签用id属性代替name属性

  

HTML5特点：

**1.文档简写：**

```
<!DOCTYPE html>
```

**2.编码简写：**

```
<meta charset="utf-8" />
```

**3.标签不区分大小写：**

```
<div>hello</DIV>
```

**4.允许属性值不加引号：**

```
<div id=wrapper style=color:red> hello </div>
```

**5.允许部分属性的属性值省略**

```
<input type="text" readonly/>
<input type="checkbox" checked/>
```

HTML5中可以省略属性值的属性：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9110319ea69244b0a8ec3763089c073a.png)



