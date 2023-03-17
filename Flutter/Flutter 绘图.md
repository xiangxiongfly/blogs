[TOC]

# Flutter 绘图

## 概述

-   Canvas（画布）用来在上面画图形的，如绘制点、线、矩形、圆形、路径、图像等。
-   Paint（画笔）用来设置画布上绘制图形的颜色、粗细、是否抗锯齿等作图风格。
-   在Flutter中，绘图需要用到`CustomPaint`和`CustomPainter`，`CustomPaint`可以理解为画板，用于承载画布，`CustomPainter`可以理解为画布，承载绘制内容。



## 绘制线

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c4390483f1e4c74a6fcb3d0ab7be329.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        //定义画板大小
        size: const Size(200, 200),
        //配置画布
        painter: LinePainter(),
        //子节点，RepaintBoundary会创建一个新的图层layer，避免重复绘制
        child: const RepaintBoundary(
            child: Center(child: Text("hello world")),
        ),
    ),
)
```

```dart
class LinePainter extends CustomPainter {
    //定义画笔：画笔颜色、画笔宽度
    final Paint _paint = Paint()
        ..color = Colors.blue
        ..strokeWidth = 4;

    /// 绘制流程
    @override
    void paint(Canvas canvas, Size size) {
        canvas.drawLine(const Offset(20, 20), const Offset(100, 100), _paint);
    }

    /// 刷新是是否重绘
    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return false;
    }
}
```



## 绘制点

![在这里插入图片描述](https://img-blog.csdnimg.cn/8c3c4973aee34cfe85581b5b08a30147.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: PointPainter(),
    ),
)
```

```dart
class PointPainter extends CustomPainter {
    final Paint _paint = Paint()
        //画笔颜色
        ..color = Colors.blue
        //画笔笔头样式
        ..strokeCap = StrokeCap.round
        //抗锯齿
        ..isAntiAlias = true
        //填充样式
        ..style = PaintingStyle.fill
        //画笔宽度
        ..strokeWidth = 20;

    @override
    void paint(Canvas canvas, Size size) {
        canvas.drawPoints(
            ui.PointMode.points,
            [
                const Offset(50, 50),
                const Offset(100, 150),
                const Offset(150, 150),
            ],
            _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制矩形

![在这里插入图片描述](https://img-blog.csdnimg.cn/5eb09904866242b980800c50e6dfd0ae.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: RectPainter(),
    ),
)
```

```dart
class RectPainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.blueAccent
        ..strokeCap = StrokeCap.round
        ..isAntiAlias = true
        ..style = PaintingStyle.fill
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        //方式一：设置左上右下4个顶点
        // Rect rect = const Rect.fromLTRB(20, 40, 150, 100);
        //方式二：设置2左上2个顶点和宽高
        // Rect rect = const Rect.fromLTWH(20, 40, 150, 100);
        //方式三：设置圆心和半径
        // Rect rect = Rect.fromCircle(center: const Offset(100, 100), radius: 50);
        //方式四：设置圆心和宽高
        Rect rect = Rect.fromCenter(center: const Offset(100, 100), width: 100, height: 100);
        canvas.drawRect(rect, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制圆角矩形

![在这里插入图片描述](https://img-blog.csdnimg.cn/4bf132820823447e9daabd04ea4d1bf1.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: RRectPainter(),
    ),
)
```

```dart
class RRectPainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.blueAccent
        ..strokeCap = StrokeCap.round
        ..isAntiAlias = true
        ..style = PaintingStyle.fill
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        Rect rect = Rect.fromCenter(center: const Offset(100, 100), width: 100, height: 100);
        RRect rRect = RRect.fromRectAndRadius(rect, const Radius.circular(20));
        canvas.drawRRect(rRect, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制圆形

![在这里插入图片描述](https://img-blog.csdnimg.cn/43ea59d6c2fc465c8521cc1aae1d2514.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: CirclePainter(),
    ),
)
```

```dart
class CirclePainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.blueAccent
        ..strokeCap = StrokeCap.round
        ..isAntiAlias = true
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        canvas.drawCircle(const Offset(100, 100), 40, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制椭圆

![在这里插入图片描述](https://img-blog.csdnimg.cn/174b58be03df49b894a2004aeaafca42.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: OvalPainter(),
    ),
)
```

```dart
class OvalPainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.blueAccent
        ..strokeCap = StrokeCap.round
        ..isAntiAlias = true
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        Rect rect = Rect.fromCenter(center: const Offset(150, 100), width: 200, height: 100);
        canvas.drawOval(rect, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制弧

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b3cdd8cc5154d17a7f18096395013f8.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: ArcPainter(),
    ),
)
```

```dart
class ArcPainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.blueAccent
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        const Rect rect = Rect.fromLTRB(50, 50, 150, 150);
        //参数依次是：矩形范围、开始弧度、结束弧度、是否连接圆心、画笔
        canvas.drawArc(rect, 0, 2, false, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制路径

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc24501d33f84d508f162bcf75a9c7d5.png)

```dart
Container(
    width: double.infinity,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: PathPainter(),
    ),
)
```

```dart
class PathPainter extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.black
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..isAntiAlias = true
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        final Path path = Path();
        path.moveTo(100, 80);
        path.lineTo(100, 150);
        path.lineTo(160, 150);
        path.close();
        canvas.drawPath(path, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/065e317daa5d4889ae14f5b0bc23ce05.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: PathPainter2(),
    ),
)
```

```dart
class PathPainter2 extends CustomPainter {
    final Paint _paint = Paint()
        ..color = Colors.black
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..isAntiAlias = true
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

    @override
    void paint(Canvas canvas, Size size) {
        final Path path = Path();
        path.moveTo(100, 80);
        path.lineTo(200, 80);
        path.addArc(
            Rect.fromCenter(center: const Offset(150, 80), width: 100, height: 100),
            0,
            0.5 * pi,
        );
        canvas.drawPath(path, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制文本

![在这里插入图片描述](https://img-blog.csdnimg.cn/e3606e516aba48faad17951194371a95.png)

```dart
Container(
    width: MediaQuery.of(context).size.width,
    height: 200,
    color: Colors.white,
    child: CustomPaint(
        size: const Size(200, 200),
        painter: TextPainter(),
    ),
)
```

```dart
class TextPainter extends CustomPainter {
    @override
    void paint(Canvas canvas, Size size) {
        ui.ParagraphBuilder builder = ui.ParagraphBuilder(
            ui.ParagraphStyle(
                //文字方向
                textDirection: TextDirection.ltr,
                //最大行数
                maxLines: 2,
                //文本居中
                textAlign: TextAlign.center,
                //字体加粗
                fontWeight: FontWeight.bold,
                //字体样式
                fontStyle: FontStyle.normal,
                //字体大小
                fontSize: 24,
                //超出范围显示内容
                ellipsis: "...",
                //行间距
                height: 1.2,
                textHeightBehavior: const TextHeightBehavior(
                    applyHeightToFirstAscent: true,
                    applyHeightToLastDescent: true,
                ),
            ),
        );
        //设置文字样式
        builder.pushStyle(ui.TextStyle(
            color: Colors.red,
            fontSize: 20,
            height: 1,
            fontWeight: FontWeight.w500,
        ));
        String text = "床前明月光，疑是地上霜；举头望明月，低头思故乡。";
        builder.addText(text);
        //文本绘制最大宽度
        ui.ParagraphConstraints constraints = const ui.ParagraphConstraints(width: 300);
        ui.Paragraph paragraph = builder.build()..layout(constraints);
        //绘制文字
        canvas.drawParagraph(paragraph, const Offset(40, 40));
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



## 绘制图片

![在这里插入图片描述](https://img-blog.csdnimg.cn/062ab621993e4105b6dd9fcfe5a04bb3.png)

```dart
class ImagePaintPage extends StatefulWidget {
    const ImagePaintPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() => _ImagePaintPageState();
}

class _ImagePaintPageState extends State<ImagePaintPage> {
    ui.Image? _image;

    @override
    void initState() {
        super.initState();
        loadImage();
    }

    loadImage() async {
        // _image = await loadImageByAssets();
        _image = await loadImageByNet();
        if (!mounted) return;
        setState(() {});
    }

    @override
    Widget build(BuildContext context) {
        return Column(
            children: [
                const Text("绘制图片"),
                Container(
                    width: MediaQuery.of(context).size.width,
                    height: 200,
                    color: Colors.white,
                    child: Center(
                        child: Stack(
                            children: [
                                _image == null
                                ? const CircularProgressIndicator()
                                : CustomPaint(
                                    size: const Size(200, 200),
                                    painter: ImagePainter(_image!),
                                ),
                            ],
                        ),
                    ),
                ),
            ],
        );
    }

    /// 加载Assets图片
    Future<ui.Image> loadImageByAssets() async {
        AssetImage assetImage = const AssetImage("assets/images/bird.jpg");
        Completer<ui.Image> completer = Completer();
        ImageStream imageStream = assetImage.resolve(ImageConfiguration.empty);
        late ImageStreamListener listener;
        listener = ImageStreamListener((ImageInfo imageInfo, bool synchronousCall) {
            final ui.Image image = imageInfo.image;
            completer.complete(image);
            imageStream.removeListener(listener);
        });
        imageStream.addListener(listener);
        return completer.future;
    }

    /// 加载网络图片
    Future<ui.Image> loadImageByNet() async {
        String imageUrl = "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png";
        NetworkImage networkImage = NetworkImage(imageUrl);
        Completer<ui.Image> completer = Completer();
        ImageStream imageStream = networkImage.resolve(ImageConfiguration.empty);
        late ImageStreamListener listener;
        listener = ImageStreamListener((ImageInfo imageInfo, bool synchronousCall) {
            final ui.Image image = imageInfo.image;
            completer.complete(image);
            imageStream.removeListener(listener);
        });
        imageStream.addListener(listener); //添加监听
        return completer.future;
    }
}

class ImagePainter extends CustomPainter {
    final Paint _paint = Paint()..isAntiAlias = true;

    final ui.Image _image;

    ImagePainter(this._image);

    @override
    void paint(Canvas canvas, Size size) {
        //原图区域，一般传原图的宽高
        Rect src = const Offset(0.0, 0.0) & Size(_image.width.toDouble(), _image.height.toDouble());
        //目标显示区域
        Rect dst = const Offset(0.0, 0.0) & const Size(200, 200);
        canvas.drawImageRect(_image, src, dst, _paint);
    }

    @override
    bool shouldRepaint(covariant CustomPainter oldDelegate) {
        return true;
    }
}
```



