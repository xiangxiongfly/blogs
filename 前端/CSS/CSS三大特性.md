[TOC]



# CSS三大特性

CSS有三个特性：

- 层叠性
- 继承性
- 优先级



## 继承性

CSS的继承性指的是子元素继承了父元素的某些样式属性。

具有继承性的属性有三大类：

- 文本相关属性：font-family、font-size、font-style、font-weight、font、line-height、text-align、text-indent、word-spacing。
- 列表相关属性：list-style-image、list-style-position、list-style-type、list-style；
- 颜色相关属性：color。



## 层叠性

CSS的层叠性，指的就是样式的覆盖。

CSS会以最后定义的属性的值为准；也就是“就近原则”原则。

就近原则三个条件：

- 元素相同。
- 属性相同。
- 权重相同。



## 优先级

当同一个元素的同一个样式属性被设置多个属性值时，就会有优先级的产生。

| 选择器               | 权重    |
| -------------------- | ------- |
| 继承或 *             | 0,0,0,0 |
| 元素选择器           | 0,0,0,1 |
| 类选择器，伪类选择器 | 0,0,1,0 |
| id选择器             | 0,1,0,0 |
| 行内样式 style=""    | 1,0,0,0 |
| !important           | 无穷大  |



### 权重计算

!important > id权重 > class权重 > 元素权重

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <style type="text/css">
            /*权重：(2,0,1)*/
            #box1 #box2 p {
                color: red;
            }

            /*权重：(2,1,1)*/
            #box1 .box2 #box3 p {
                color: green;
            }

            /*权重：(0,3,1)*/
            .box1 .box2 .box3 p {
                color: blue;
            }
        </style>
    </head>
    <body>
        <div id="box1" class="box1">
            <div id="box2" class="box2">
                <div id="box3" class="box3">
                    <p>hello</p>
                </div>
            </div>
        </div>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/29bf420f95e04edcbddf5bc759768d01.png)

