[TOC]

# Flutter 尺寸限制类容器组件

## 简述

Flutter中尺寸限制类容器组件包含：Container、ConstrainedBox、UnconstrainedBox、SizedBox、AspectRatio、FractionallySizedBox、LimiteBox等，这些组件可以约束子组件的尺寸。



## [Container](https://blog.csdn.net/qq_14876133/article/details/125204915)



## ConstrainedBox

对子组件尺寸限制，可以设置最大值、最小值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b865e3ae478b429c96bef78749655829.png)

```dart
ConstrainedBox(
    constraints: const BoxConstraints(
        minWidth: 50,
        minHeight: 50,
        maxHeight: 100,
        maxWidth: 100,
    ),
    child: Container(
        width: 10,
        height: 10,
        color: Colors.red,
    ),
),
const SizedBox(height: 10),
ConstrainedBox(
    constraints: const BoxConstraints(
        minWidth: 50,
        minHeight: 50,
        maxHeight: 100,
        maxWidth: 100,
    ),
    child: Container(
        width: 200,
        height: 200,
        color: Colors.red,
    ),
)
```



## SizedBox

为子组件设置固定的宽高。功能上类似ConstrainedBox组件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ee8fa7ff50f54a38a1ae7b23d99ed64d.png)

```dart
SizedBox(
    width: 50,
    height: 50,
    child: Container(color: Colors.green),
),
const SizedBox(height: 10),
SizedBox.fromSize(
    size: const Size(50, 50),
    child: Container(color: Colors.green),
)
```




## UnconstrainedBox

用于去除父组件的约束，允许子组件按照自己的尺寸绘制。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e14000da1b248f6acb8f7e007a5df9c.png)

红色文字部分只会在debug模式下显示，在release模式下只会显示蓝色区域。

```dart
SizedBox(
    width: 10,
    height: 10,
    child: UnconstrainedBox(
        child: Container(width: 100, height: 100, color: Colors.blue),
    ),
)
```



## AspectRatio

固定宽高比得组件。

```
aspectRatio：表示宽高比。可以为分数形式或小数形式。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/9e98d4bdebcf4c24a19ccc1862cf587e.png)

```dart
Container(
    width: 100,
    height: 100,
    alignment: Alignment.center,
    color: Colors.red,
    child: AspectRatio(
        aspectRatio: 2 / 1,
        child: Container(color: Colors.blue),
    ),
)
```



## FractionallySizedBox

相对尺寸组件，控制子元素占父组件的百分比空间。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c73b0c246e984e6fa67489c0d32ded06.png)

```dart
Container(
    width: 100,
    height: 100,
    color: Colors.blue,
    child: FractionallySizedBox(
        widthFactor: 0.5,
        heightFactor: 0.5,
        child: Container(color: Colors.red),
    ),
)
```



