[TOC]

# Flutter shape类型组件

## 简述

Flutter中很多组件都有`shape`属性，类型是`ShapeBorder`，如Button、Container、Card等组件，表示控件的形状。



## BeveledRectangleBorder

斜边矩形边框。

```
side：设置边框样式。

borderRadius：设置边框圆角。设置为0时，则是矩形。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/13e1eb9a9d414186922a2ba7b18aa72a.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: BeveledRectangleBorder(
        side: BorderSide(width: 1, color: Colors.red),
        borderRadius: BorderRadius.circular(0),
    ),
),

RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: BeveledRectangleBorder(
        side: BorderSide(width: 1, color: Colors.red),
        borderRadius: BorderRadius.circular(10),
    ),
),

RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: BeveledRectangleBorder(
        side: BorderSide(width: 1, color: Colors.red),
        borderRadius: BorderRadius.circular(100),
    ),
),
```



## Border

可以单独设置某一条边样式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/444470adaa634770ae6563f42e301cd3.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: Border(
        top: BorderSide(color: Colors.red, width: 2),
        bottom: BorderSide(color: Colors.blue, width: 2),
    ),
)
```



## CircleBorder

圆形边框。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5444341d7da543e595ac90e18a99aef5.png)

```dart
Container(
    width: 120,
    height: 120,
    child: RaisedButton(
        onPressed: () {},
        child: Text("hello world"),
        shape: const CircleBorder(
            side: BorderSide(
                color: Colors.red,
                width: 1,
            ),
        ),
    ),
)
```



## ContinuousRectangleBorder

圆角矩形，直线和圆角平滑过渡，相比RoundedRectangleBorder圆角效果要小一些。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0d5b24684c774066b463da4536836b29.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: ContinuousRectangleBorder(
        side: BorderSide(color: Colors.red),
        borderRadius: BorderRadius.circular(20),
    ),
)
```



## RoundedRectangleBorder

圆角矩形。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a18ebe5928c3475188743ea7b19ff728.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: RoundedRectangleBorder(
        side: BorderSide(color: Colors.red),
        borderRadius: BorderRadius.circular(10),
    ),
)
```



## StadiumBorder

类似足球场的形状，两端圆形，中间矩形。

![在这里插入图片描述](https://img-blog.csdnimg.cn/04f757345c944cb398441b48fee23ed3.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("hello world"),
    shape: StadiumBorder(
        side: BorderSide(color: Colors.red),
    ),
)
```



## OutlineInputBorder

外边框。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9415f73f93864b4c9eaa173e015a4cc7.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("OutlineInputBorder"),
    shape: OutlineInputBorder(
        borderSide: BorderSide(color: Colors.red),
    ),
)
```



## UnderlineInputBorder

带下划线。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b75cc77d99b54924aa958d55639fc16f.png)

```dart
RaisedButton(
    onPressed: () {},
    child: Text("UnderlineInputBorder"),
    shape: UnderlineInputBorder(
        borderSide: BorderSide(color: Colors.red),
    ),
)
```




