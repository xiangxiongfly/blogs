[TOC]

# Flutter LayoutBuilder组件

## 简书

可以借助LayoutBuilder组件根据不同的屏幕尺寸显示不同的效果，如竖屏和横屏显示的样式不一样。

[屏幕尺寸介绍](https://uiiiuiii.com/screen/index.htm)



## 使用

当竖屏时显示红色，横屏时显示蓝色。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3838160b7cdc40aab599604db2f25080.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/440bc1ae0b58447eaf54ddea1f06efc1.png)

```dart
LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) {
        Color color = Colors.red;
        if (constraints.maxWidth > 360) {
            color = Colors.blue;
        }
        return Container(
            width: 50,
            height: 50,
            color: color,
        );
    },
)
```



