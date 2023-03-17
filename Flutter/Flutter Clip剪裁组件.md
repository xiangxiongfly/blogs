[TOC]

# Flutter Clip剪裁组件

## 简述

Flutter提供了一些剪裁工具，用于对组件的剪裁。



## 使用

### 原图

![在这里插入图片描述](https://img-blog.csdnimg.cn/44e56f22401547488127ac96bedbb5e9.png)

```dart
Image.asset("images/avatar.jpg", width: 100, height: 100);
```



### ClipRect

矩形剪裁。

![在这里插入图片描述](https://img-blog.csdnimg.cn/50ea1ebd2628415d809e9e1c37adb8c2.png)

```dart
ClipRect(
    child: Align(
        child: avatar,
        alignment: Alignment.topCenter,
        heightFactor: 0.5,
    ),
)
```



### ClipOval

圆形剪裁。

![在这里插入图片描述](https://img-blog.csdnimg.cn/412af15da818487690a45131f5117d89.png)

```dart
ClipOval(
    child: avatar,
    clipBehavior: Clip.antiAlias, //抗锯齿，通常用于处理圆形和弧形
)
```



### ClipRRect

矩形圆角剪裁。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ebcbca08d4674d55b2102e6490845e20.png)

```dart
ClipRRect(
  child: avatar,
  borderRadius: BorderRadius.circular(10),
)
```



### ClipPath

路径剪裁。

```
shape：ShapeBorder类型，定义剪裁形状。
	- RoundedRectangleBorder：圆角矩形。
	- ContinuousRectangleBorder：直线与圆角平滑过渡，与RoundedRectangleBorder类似，但圆角效果小一些。
	- StadiumBorder：类似足球场，两端半圆。
	- BeveledRectangleBorder：斜角矩形。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/df305b27406f4a48b0dbc8bb0bfd27b3.png)

```dart
ClipPath.shape(
    shape: const StadiumBorder(),
    child: SizedBox(
        width: 100,
        height: 60,
        child: Image.asset("images/avatar.jpg", fit: BoxFit.cover),
    ),
),
```



### 自定义剪裁

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac1cc5c0248f4a2bae933b46335580d6.png)

```dart
Container(
    color: Colors.red,
    child: ClipRect(
        clipper: MyClipper1(),
        child: avatar,
    ),
)
```

```dart
class MyClipper1 extends CustomClipper<Rect> {
    @override
    Rect getClip(Size size) {
        return const Rect.fromLTWH(0, 0, 30, 30);
    }

    @override
    bool shouldReclip(covariant CustomClipper<Rect> oldClipper) {
        return false;
    }
}
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/88a83900afdd4e448f66ccbb8227688e.png)

```dart
Container(
    color: Colors.green,
    child: ClipPath(
        clipper: TrianglePath(),
        child: avatar,
    ),
)
```

```dart

class TrianglePath extends CustomClipper<Path> {
    @override
    Path getClip(Size size) {
        var path = Path();
        path.moveTo(size.width / 2, 0);
        path.lineTo(0, size.height);
        path.lineTo(size.width, size.height);
        path.close();
        return path;
    }

    @override
    bool shouldReclip(covariant CustomClipper<Path> oldClipper) {
        return true;
    }
}
```



