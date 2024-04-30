[toc]

# Compose Canvas

## 概述

在Compose中绘制文字、曲线、矩形、圆、椭圆、圆弧、路径、BlendMode等。



## Canvas属性

```kotlin
@Composable
fun Canvas(modifier: Modifier, onDraw: DrawScope.() -> Unit) =　　
    Spacer(modifier.drawBehind(onDraw))
```

```kotlin
@DrawScopeMarker
interface DrawScope : Density {

    // 当前的DrawContext，包含创建绘图环境所需的依赖项
    val drawContext: DrawContext

    // 绘图环境当前边界的中心
    val center: Offset
        get() = drawContext.size.center

    // 当前绘图环境的大小（可以通过size获取当前Canvas的宽和高）
    val size: Size
        get() = drawContext.size

    // 绘制版面的版面方向
    val layoutDirection: LayoutDirection

    companion object {

        // 用于每个绘图操作的默认混合模式。这样可以确保将内容绘制在目标中的像素上方
        val DefaultBlendMode: BlendMode = BlendMode.SrcOver
    }
}
```



## drawPoints 绘制点

### drawPoints属性

```kotlin
// 方法一：
fun drawPoints(
    points: List<Offset>, // 点的集合
    // Points：点模式；Lines：两点的线模式；Polygon：连续的线模式
    pointMode: PointMode, // 绘制方式
    color: Color, // 颜色
    strokeWidth: Float = Stroke.HairlineWidth, // 宽度
    // Butt：直角，末端无延伸；Round：圆角，末端有延伸；Square：直角，末端有延伸
    cap: StrokeCap = StrokeCap.Butt, // 末端处理
    pathEffect: PathEffect? = null, // 点的可选效果或图案
    alpha: Float = 1.0f, // 透明度
    colorFilter: ColorFilter? = null,  // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)

// 方法二：
fun drawPoints(
    points: List<Offset>,
    pointMode: PointMode,
    brush: Brush, // 渐变色
    strokeWidth: Float = Stroke.HairlineWidth,
    cap: StrokeCap = StrokeCap.Butt,
    pathEffect: PathEffect? = null,
    alpha: Float = 1.0f,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode
)
```

### 使用

**使用pointMode属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f382539efcaa43e19984dacd5cc4052f.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/6fcaa7349f494acfa28b4c3c8c3073af.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5bc3689a6dc9404495ee76d2d519c86c.png)

```kotlin
var pointMode by remember {
    mutableStateOf(PointMode.Points)
}
val scrollState = rememberScrollState()
val points = arrayListOf(
    Offset(100F, 100F),
    Offset(300F, 300F),
    Offset(500F, 500F),
    Offset(700F, 500F),
    Offset(900F, 900F),
)
var text by remember {
    mutableStateOf("PointMode.Points")
}
Column(modifier = Modifier.fillMaxSize()) {
    Row(modifier = Modifier.horizontalScroll(scrollState)) {
        Button(onClick = {
            pointMode = PointMode.Points
            text = "PointMode.Points"
        }) {
            Text("PointMode.Points")
        }
        Button(onClick = {
            pointMode = PointMode.Lines
            text = "PointMode.Lines"
        }) {
            Text("PointMode.Lines")
        }
        Button(onClick = {
            pointMode = PointMode.Polygon
            text = "PointMode.Polygon"
        }) {
            Text("PointMode.Polygon")
        }
    }
    Text(text)
    Canvas(modifier = Modifier
           .size(360.dp)
           .background(Color.LightGray)) {
        drawPoints(
            points = points,
            pointMode = pointMode,
            color = Color.Red,
            strokeWidth = 15F
        )
    }
}
```

**使用brush属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/abb689ea70c94a31ba094caadd979b6c.png)

```kotlin
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawPoints(
        points = points,
        pointMode = PointMode.Polygon,
        cap = StrokeCap.Square,
        strokeWidth = 30F,
        brush = Brush.linearGradient(
            colors = arrayListOf(Color.Red, Color.Green, Color.Blue)
        )
    )
}
```

上面的颜色是均匀分布的，也可以精确指定每段的颜色，如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/aa233cbc36e44723b0438ac2660e6ac2.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawPoints(
        points = points,
        pointMode = PointMode.Polygon,
        cap = StrokeCap.Square,
        strokeWidth = 30F,
        brush = Brush.linearGradient(
            0.0F to Color.Red, 0.2F to Color.Green, 0.8F to Color.Blue
        )
    )
}
```



## drawLine 绘制线

### drawLine属性

```kotlin
// 方法一：
fun drawLine(
    color: Color, // 线的颜色
    start: Offset, // 开始坐标
    end: Offset, // 结束坐标
    strokeWidth: Float = Stroke.HairlineWidth, // 线的宽度
    cap: StrokeCap = Stroke.DefaultCap, // 末端处理
    pathEffect: PathEffect? = null, // 线的可选效果或图案
    alpha: Float = 1.0f, // 透明度
    colorFilter: ColorFilter? = null, // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)

// 方法二：
fun drawLine(
    brush: Brush, // 渐变色
    start: Offset,
    end: Offset,
    strokeWidth: Float = Stroke.HairlineWidth,
    cap: StrokeCap = Stroke.DefaultCap,
    pathEffect: PathEffect? = null,
    alpha: Float = 1.0f,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/9acf74ba977641369f7f3f5b6bcf02b4.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawLine(
        color = Color.Red,
        start = Offset(100F, 100F),
        end = Offset(900F, 900F),
        strokeWidth = 30F,
        cap = StrokeCap.Round
    )
}
```



## drawRect 绘制矩形

### drawRect属性

```kotlin
fun drawRect(
    color: Color, // 颜色
    topLeft: Offset = Offset.Zero, // 顶点
    size: Size = this.size.offsetSize(topLeft), // 尺寸
    alpha: Float = 1.0f, // 透明度
    // Fill：填充；Stroke：边框；
    style: DrawStyle = Fill, // 样式
    colorFilter: ColorFilter? = null, // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)

class Stroke(
    val width: Float = 0.0f, // 边的宽度
    val miter: Float = DefaultMiter, // 连接角度
    val cap: StrokeCap = StrokeCap.Butt, // 末端处理
    val join: StrokeJoin = StrokeJoin.Miter, // 边的连接处理
    val pathEffect: PathEffect? = null
) : DrawStyle()
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/79077d6ae832420788e40be33f7b2d88.png)

```kotlin
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawRect(
        color = Color.Red,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 400F)
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e13eb477b2964097aff8f0a45ce5e8ee.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawRect(
        color = Color.Red,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 400F),
        style = Stroke(width = 30F, cap = StrokeCap.Round)
    )
}
```



## drawRoundRect 绘制圆角矩形

### drawRoundRect属性

```kotlin
fun drawRoundRect(
    color: Color,
    topLeft: Offset = Offset.Zero,
    size: Size = this.size.offsetSize(topLeft),
    cornerRadius: CornerRadius = CornerRadius.Zero, // 圆角
    style: DrawStyle = Fill,
    alpha: Float = 1.0f,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/56e938590b194ac59a2385936a8ae7b9.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawRoundRect(
        color = Color.Red,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 600F),
        cornerRadius = CornerRadius(50F),
        style = Stroke(width = 30F)
    )
}
```



## drawCircle 绘制圆

### drawCircle属性

```kotlin
fun drawCircle(
    color: Color, // 颜色
    radius: Float = size.minDimension / 2.0f, // 半径
    center: Offset = this.center, // 圆形坐标
    alpha: Float = 1.0f, // 透明度
    style: DrawStyle = Fill, // 样式
    colorFilter: ColorFilter? = null, // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/208dbe5df91241ad83cc82ee7eedd3a9.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawCircle(
        color = Color.Red,
        radius = 300F,
        center = center
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f319efda8e8d40769600e2adc0eb46cf.png)

```kotlin
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawCircle(
        color = Color.Red,
        radius = 300F,
        center = center,
        style = Stroke(width = 30F)
    )
}
```



## drawOval 绘制椭圆

### drawOval属性

```kotlin
fun drawOval(
    color: Color,
    topLeft: Offset = Offset.Zero,
    size: Size = this.size.offsetSize(topLeft),
    alpha: Float = 1.0f,
    style: DrawStyle = Fill,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/cf64ce2d972049eaabb849975e1391ba.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawOval(
        color = Color.Red,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 600F),
        style = Stroke(width = 30F)
    )
}
```



## drawArc 绘制圆弧

### drawArc属性

```kotlin
fun drawArc(
    color: Color, // 颜色
    startAngle: Float, // 开始角度
    sweepAngle: Float, // 弧度
    useCenter: Boolean, // 是否使用中心
    topLeft: Offset = Offset.Zero, // 顶点
    size: Size = this.size.offsetSize(topLeft), // 尺寸
    alpha: Float = 1.0f, // 透明度
    style: DrawStyle = Fill, // 样式
    colorFilter: ColorFilter? = null, // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2dfa41fcadfc4318aba94f545ee5a4bb.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawArc(
        color = Color.Red,
        startAngle = 0F,
        sweepAngle = 270F,
        useCenter = true,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 400F)
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/cdefa9732f994e369d8c6a9851e60c60.png)

```kotlin
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawArc(
        color = Color.Red,
        startAngle = 0F,
        sweepAngle = 270F,
        useCenter = false,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 400F)
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/c6cd804948d14f5986f6236d95c8dd62.png)

```kotlin
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawArc(
        color = Color.Red,
        startAngle = 0F,
        sweepAngle = 270F,
        useCenter = false,
        topLeft = Offset(100F, 100F),
        size = Size(400F, 400F),
        style = Stroke(width = 5F)
    )
}
```



## drawImage 绘制图片

### drawImage属性

```kotlin
// 方式一：
fun drawImage(
    image: ImageBitmap, // 图片
    topLeft: Offset = Offset.Zero, // 顶点
    alpha: Float = 1.0f, // 透明度
    style: DrawStyle = Fill, // 样式
    colorFilter: ColorFilter? = null, // 颜色效果
    blendMode: BlendMode = DefaultBlendMode // 混合模式
)

// 方式二：
fun drawImage(
    image: ImageBitmap,
    srcOffset: IntOffset = IntOffset.Zero, // 设置原图片
    srcSize: IntSize = IntSize(image.width, image.height), // 设置原图片尺寸
    dstOffset: IntOffset = IntOffset.Zero, // 设置目标图片
    dstSize: IntSize = srcSize, // 设置目标图片尺寸
    alpha: Float = 1.0f,
    style: DrawStyle = Fill,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode,
    filterQuality: FilterQuality = DefaultFilterQuality
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/c6c8a07c5ac7462891dd2fdc109a1c41.png)

```kotlin
val context = LocalContext.current
val bitmap = BitmapFactory.decodeResource(context.resources, R.drawable.a)
val image = bitmap.asImageBitmap()
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawImage(
        image = image
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d55a311ad0c54d9983536bc2edad07f7.png)

```kotlin
val context = LocalContext.current
val bitmap = BitmapFactory.decodeResource(context.resources, R.drawable.a)
val image = bitmap.asImageBitmap()
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawImage(
        image = image,
        srcOffset = IntOffset(0, 0),
        srcSize = IntSize(100, 100),
        dstOffset = IntOffset(100, 100),
        dstSize = IntSize(400, 400)
    )
}
```



## drawPath 绘制路径

### drawPath属性

```kotlin
fun drawPath(
    path: Path,
    color: Color,
    alpha: Float = 1.0f,
    style: DrawStyle = Fill,
    colorFilter: ColorFilter? = null,
    blendMode: BlendMode = DefaultBlendMode
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/545dd6e95b1540cca02a2399496c340d.png)

```kotlin
val path = Path()
path.moveTo(100F, 300F)
path.lineTo(100F, 700F)
path.lineTo(800F, 700F)
path.lineTo(900F, 300F)
path.lineTo(600F, 100F)
path.close()
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawPath(
        path = path,
        color = Color.Red,
        style = Stroke(width = 10F)
    )
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/aa2cc02d88df4502b6a2d2b8e3a3fc23.png)

```kotlin
val path = Path()
path.moveTo(100F, 300F)
path.lineTo(100F, 700F)
path.quadraticBezierTo(800F,700F,600F,100F)
path.cubicTo(700F,200F,800F,400F,100F,100F)
path.close()
Canvas(
    modifier = Modifier
        .size(360.dp)
        .background(Color.LightGray)
) {
    drawPath(
        path = path,
        color = Color.Red,
        style = Stroke(width = 10F)
    )
}
```



## 混合模式

**混合模式：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/786c1b59f6aa4353a38d14f9ea1c5333.jpeg)

**BlendMode类型说明：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8e6b0a9db4474af4bf2f691842116124.jpeg)

**使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b9df12ac0ec44ce09da8df8a38d2c8c7.png)

```kotlin
Canvas(
    modifier = Modifier
    .size(360.dp)
    .background(Color.LightGray)
) {
    drawCircle(
        color = Color.Yellow,
        radius = 170F,
        center = Offset(350F, 350F),
        blendMode = BlendMode.Clear
    )
    drawRect(
        color = Color.Red,
        topLeft = Offset(300F, 300F),
        size = Size(350F, 350F),
        blendMode = BlendMode.Clear
    )
}
```

