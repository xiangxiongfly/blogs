[TOC]

# Flutter Transform变形

## 概述

-   Transform可以对子组件进行变化，比如旋转、平移、缩放等。
-   Transform变形是通过矩阵变换实现的，发生在绘制阶段，而不是布局阶段，所以对子组件任何变化，都不会影响其占用的空间。



## 平移

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4acf9db68f4419288e9439657558925.png)

```dart
DecoratedBox(
    child: Transform.translate(
        offset: Offset(10, 10), //默认原点左上角，向右平移10，向下平移10
        child: Text("hello world"),
    ),
    decoration: BoxDecoration(color: Colors.red),
)
```



## 旋转

![在这里插入图片描述](https://img-blog.csdnimg.cn/d9a8611493e14ebdb49328e4a46f06c8.png)

```dart
DecoratedBox(
    child: Transform.rotate(
        angle: math.pi / 2, //选择90度
        child: Text("hello world"),
    ),
    decoration: BoxDecoration(color: Colors.red),
)
```



## 缩放

![在这里插入图片描述](https://img-blog.csdnimg.cn/01837a43a6174ae3b396caceafef1cc3.png)

```dart
DecoratedBox(
    child: Transform.scale(
        scale: 2,
        child: Text("hello world"),
    ),
    decoration: BoxDecoration(color: Colors.red),
)
```



## 倾斜

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a5bbcc89150466fa756aa9a2dbd3236.png)

```dart
Container(
    color: Colors.black,
    child: Transform(
        alignment: Alignment.topRight,
        transform: Matrix4.skewY(0.3),
        child: Container(
            padding: EdgeInsets.all(8),
            color: Colors.red,
            child: Text("  hello transform!  "),
        ),
    ),
)
```



## RotatedBox

RotatedBox与Transform.rotate()功能类似，但是RotatedBox是变化是在layout阶段，所以会影响子组件的位置和大小。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d7ee1192834a4bf8a144f26ad5ebdbe8.png)

```dart
DecoratedBox(
    child: RotatedBox(
        quarterTurns: 1,
        child: Text("hello world"),
    ),
    decoration: BoxDecoration(color: Colors.red),
)
```

