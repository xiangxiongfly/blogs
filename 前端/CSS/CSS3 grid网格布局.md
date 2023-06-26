[toc]

# CSS3 grid网格布局

## 概述

`Grid` 布局即网格布局，是一种新的 `CSS` 布局模型，比较擅长将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。号称是最强大的的 `CSS` 布局方案，是目前唯一一种 `CSS` 二维布局。

grid元素是块元素。



## grid属性说明

![在这里插入图片描述](https://img-blog.csdnimg.cn/f95dad17c7f64e3b8f047032a981099c.png)

**容器属性**

| 属性                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| grid-template-rows    | 定义行高                                                     |
| grid-template-columns | 定义列宽                                                     |
| grid-auto-flow        | 定义项目的排列顺序                                           |
| grid-auto-rows        | 定义多余网格的行高                                           |
| grid-auto-columns     | 定义多余网格的列宽                                           |
| row-gap               | 行间距                                                       |
| column-gap            | 列间距                                                       |
| gap                   | row-gap和column-gap的简写                                    |
| grid-template-areas   | 定义区域                                                     |
| justify-items         | 设置项目的水平位置                                           |
| align-items           | 设置项目的垂直位置                                           |
| place-items           | align-items和justify-items的简写                             |
| align-content         | 设置整个内容区域的垂直位置                                   |
| justify-content       | 设置整个内容区域的水平位置                                   |
| place-content         | align-content和justify-content的简写                         |
| grid-template         | grid-template-columns、grid-template-rows 和 grid-template-areas的简写 |

**项目属性**

| 属性                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| grid-row-start & grid-row-end & grid-column-start & grid-column-end | 指定项目位置                                                 |
| grid-column                                                  | grid-column-start 和 grid-column-end 的合并简写形式          |
| grid-row                                                     | grid-row-start 和 grid-row-end 的合并简写形式                |
| grid-area                                                    | grid-row-start、grid-column-start、grid-row-end、grid-column-end 的合并简写形式 |
| align-self                                                   | 项目的垂直位置                                               |
| justify-self                                                 | 项目的水平位置                                               |
| place-self                                                   | align-self 和 justify-self的简写形式                         |




## 使用

### grid-template-rows & grid-template-columns 定义行高和列宽

**grid-template-rows和 grid-template-columns属性取值**

| 属性值   | 说明                           |
| -------- | ------------------------------ |
| px       | 固定值                         |
| %        | 百分比                         |
| fr       | 片段，分配剩余空间             |
| auto     | 先于fr计算，获取必要的最小空间 |
| repeat() | 简化重复值                     |

**固定值使用**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        display: grid;
        grid-template-rows: 50px 50px 50px;
        grid-template-columns: 50px 50px 50px;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
      }

      .item-1 {
        background-color: lightseagreen;
      }
      .item-2 {
        background-color: lightsteelblue;
      }
      .item-3 {
        background-color: lightgreen;
      }
      .item-4 {
        background-color: #ffd200;
      }
      .item-5 {
        background-color: lightskyblue;
      }
      .item-6 {
        background-color: pink;
      }
      .item-7 {
        background-color: gray;
      }
      .item-8 {
        background-color: orange;
      }
      .item-9 {
        background-color: yellowgreen;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="item item-1">1</div>
      <div class="item item-2">2</div>
      <div class="item item-3">3</div>
      <div class="item item-4">4</div>
      <div class="item item-5">5</div>
      <div class="item item-6">6</div>
      <div class="item item-7">7</div>
      <div class="item item-8">8</div>
      <div class="item item-9">9</div>
    </div>
  </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/374f7b279398435c8455013c40c64052.png)

**百分比使用**

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: 33.33% 33.33% 33.33%;
    grid-template-columns: 33.33% 33.33% 33.33%;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8fff46c1989467aabcf5fba06c682b8.png)

**fr使用**

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8fff46c1989467aabcf5fba06c682b8.png)

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: 20px 1fr 20px;
    grid-template-columns: 20px 1fr 20px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/32505dbb524c48e98fa22ffc9551c085.png)

**auto使用**

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: 20px auto 20px;
    grid-template-columns: 20px auto 20px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/32505dbb524c48e98fa22ffc9551c085.png)

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: auto 1fr 50px;
    grid-template-columns: auto auto auto;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb024ed8b389429ca3c5da066670b2b1.png)

**repeat()使用**

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8fff46c1989467aabcf5fba06c682b8.png)



### grid-auto-flow 定义项目的排列顺序

**grid-auto-flow属性取值**

| 属性         | 说明         |
| ------------ | ------------ |
| row          | 先填入第一行 |
| column       | 先填入第一列 |
| row dense    | 按行填充空白 |
| column dense | 按列填充空白 |

**使用**

```
.container {
display: grid;
width: 150px;
height: 150px;
grid-template-rows: repeat(3, 50px);
grid-template-columns: repeat(3, 50px);
grid-auto-flow: row;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8fff46c1989467aabcf5fba06c682b8.png)

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    grid-auto-flow: column;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/370111ef78f0412ba0d1687042c9465b.png)

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    grid-auto-flow: row dense;
}

.item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e131a8f10a6541a3bf5486cc80959880.png)

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    grid-auto-flow: column dense;
}

.item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e0b9ac85b47e4a3b93803873087535c3.png)



### grid-auto-rows & grid-auto-columns 定义多余网格的行高和列宽

**使用**

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    grid-auto-rows: 100px;
    grid-auto-columns: 100px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/10cef1bec8324c4789d9b9bfb6376d61.png)



### row-gap & column-gap 设置行间距和列间距

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    row-gap: 10px;
    column-gap: 40px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d62485e994c948babdff0d5b46bdeddc.png)



### gap 简写形式

```css
.container {
    display: grid;
    width: 150px;
    height: 150px;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    gap: 10px 40px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d62485e994c948babdff0d5b46bdeddc.png)



### grid-template-areas 定义区域

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    grid-template-areas:
        "a b c"
        "e f g"
        "h i j";
}

.item-1 {
    grid-area: c;
}

.item-3 {
    grid-area: a;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bfa3daa73b84437789453b16c9eb8345.png)



### justify-items & align-items 设置项目的水平位置和垂直位置

**justify-items & align-items属性取值**

| 属性值  | 说明         |
| ------- | ------------ |
| stretch | 默认值，拉伸 |
| start   | 开始位置     |
| center  | 居中位置     |
| end     | 结束位置     |

**使用**

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    justify-items: center;
    align-items: center;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d12c8d39be24e68ae4a56dc9dfcb60e.png)



### place-items 简写形式

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    place-items: center center;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d12c8d39be24e68ae4a56dc9dfcb60e.png)



### align-content & justify-content 设置整个内容的位置

**align-content & justify-content属性取值**

| 属性          | 说明                                             |
| ------------- | ------------------------------------------------ |
| stretch       | 默认值，没有指定大小时，拉伸                     |
| start         | 开始位置                                         |
| center        | 居中位置                                         |
| end           | 结束位置                                         |
| space-around  | 每个项目的间隔相等                               |
| space-between | 每个项目的间隔相等，项目与边框之间没有间隔       |
| space-evenly  | 每个项目的间隔相等，项目与边框之间也是一样的间隔 |

**使用**

```css
.container {
    display: grid;
    height: 500px;
    border: 1px dashed green;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    align-content: center;
    justify-content: center;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2439dfc0f7d0407daa0e2f371edc9ab2.png)



### place-content 简写形式

```css
.container {
    display: grid;
    height: 500px;
    border: 1px dashed green;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
    place-content: center;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2439dfc0f7d0407daa0e2f371edc9ab2.png)



### grid-row-start & grid-row-end & grid-column-start & grid-column-end 指定项目位置

**属性取值**

| 属性值      | 说明                                   |
| ----------- | -------------------------------------- |
| number      | 从第几个网格线开始，到第几个网格线结束 |
| name        | 需要先定义网格线                       |
| span number | 表示跨域几个网格                       |

**使用**

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/63436df810294cc2b1094f1c36089878.png)

```css
.container {
    display: grid;
    grid-template-rows: [c1] 50px [c2] 50px [c3] 50px [c4];
    grid-template-columns: [r1] 50px [r2] 50px [r3] 50px [r4];
}

.item-1 {
    grid-row-start: c1;
    grid-row-end: c3;
    grid-column-start: r1;
    grid-column-end: r3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/63436df810294cc2b1094f1c36089878.png)

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    grid-row-start: span 2;
    grid-column-start: span 2;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/63436df810294cc2b1094f1c36089878.png)



### grid-column & grid-row 简写形式

grid-column 是 grid-column-start 和 grid-column-end 的合并简写形式 

grid-row 是 grid-row-start 和 grid-row-end 的合并简写形式

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/63436df810294cc2b1094f1c36089878.png)



### grid-area 简写形式

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    grid-area: 1/1/3/3;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/63436df810294cc2b1094f1c36089878.png)



### align-self & justify-self 设置项目的垂直位置和水平位置

**属性取值**

| 属性值  | 说明         |
| ------- | ------------ |
| stretch | 默认值，拉伸 |
| start   | 开始位置     |
| center  | 居中位置     |
| end     | 结束位置     |

**使用**

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    align-self: end;
    justify-self: end;
}

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/da562bd7fe0a40caa8a44151e5e5bf66.png)



###  place-self 简写形式

```css
.container {
    display: grid;
    grid-template-rows: repeat(3, 50px);
    grid-template-columns: repeat(3, 50px);
}

.item-1 {
    place-self: end;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/da562bd7fe0a40caa8a44151e5e5bf66.png)



## 案例

### 圣杯布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/f763eab6bd884f548ebdc51a2519cc25.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圣杯布局（grid）</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      html {
        width: 100%;
        height: 100%;
      }
      body {
        display: grid;
        grid-template-rows: 80px 1fr 80px;
        grid-template-columns: 200px auto 200px;
        grid-template-areas:
          "header header header"
          "left main right"
          "footer footer footer";
        height: 100%;
      }
      .header {
        grid-area: header;
        background-color: red;
      }
      .left {
        grid-area: left;
        background-color: yellow;
      }
      .main {
        grid-area: main;
        background-color: aqua;
      }
      .right {
        grid-area: right;
        background-color: bisque;
      }
      .footer {
        grid-area: footer;
        background-color: gray;
      }
      .grid-center {
        display: grid;
        justify-items: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <header class="header grid-center">header</header>
    <div class="left grid-center">left</div>
    <div class="main grid-center">main</div>
    <div class="right grid-center">right</div>
    <footer class="footer grid-center">footer</footer>
  </body>
</html>
```

