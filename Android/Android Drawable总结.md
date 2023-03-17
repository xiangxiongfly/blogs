[TOC]

# Android Drawable总结

## 概述

Drawable有很多种，它们都表示一种图像的概念，但是它们又不全是图片，通过颜色也可以构造出各式各样的图像的效果。在实际开发中，Drawable常被用来作为View的背景使用。Drawable一般都是通过XML来定义的，当然我们也可以通过代码来创建具体的Drawable对象，只是用代码创建会稍显复杂。在Android的设计中，Drawable是一个抽象类，它是所有Drawable对象的基类。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3bf15100dda464abb6ac15b44f8142f.png)



## BitmapDrawable 位图图像

![在这里插入图片描述](https://img-blog.csdnimg.cn/ca90e4904aa04410894d9f3416af5ff3.png)

### XML实现

**基本属性**

```
<bitmap>：根元素
    - src：资源文件
    - antialias：是否抗锯齿
	- gravity：当图片小雨容器尺寸时，图片的位置设置
    - tileMode：平铺模式
```

**定义XML位图**

```xml
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:antialias="true"
    android:gravity="fill"
    android:src="@drawable/apple_pic"
    android:tileMode="disabled" />
```

**使用XML位图**

```kotlin
val bitmapDrawable = ContextCompat.getDrawable(mContext, R.drawable.bitmap_drawable)
iv1.setImageDrawable(bitmapDrawable)
```



### 代码实现

```kotlin
val bitmap = BitmapFactory.decodeResource(resources, R.drawable.apple_pic)
val bitmapDrawable2 = BitmapDrawable(resources, bitmap)
iv2.setImageDrawable(bitmapDrawable2)
```



## LayerDrawable

图层图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b0e4b3aa91f24d5ba18b5ce35229be21.png)

### XML实现

**基本属性**

```
<layer-list>：根元素
<item>：子元素
	- drawable：图片资源
	- top：顶部偏移
	- right：右边偏移
	- bottom：底部偏移
	- left：左边偏移
```

**定义XML图层**

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" />

    <item
          android:bottom="10dp"
          android:left="10dp"
          android:right="10dp"
          android:top="10dp">
        <shape android:shape="rectangle">
            <solid android:color="#FF0000" />
        </shape>
    </item>

    <item
          android:bottom="20dp"
          android:left="20dp"
          android:right="20dp"
          android:top="20dp">
        <shape android:shape="oval">
            <solid android:color="#00FF00" />
        </shape>
    </item>

    <item android:gravity="center">
        <shape android:shape="oval">
            <size
                  android:width="50dp"
                  android:height="50dp" />
            <stroke
                    android:width="5dp"
                    android:color="#0000FF" />
        </shape>
    </item>
</layer-list>
```

**使用XML图层**

```kotlin
val layerDrawable = ContextCompat.getDrawable(mContext, R.drawable.layer_drawable)
iv1.setImageDrawable(layerDrawable)
```



### 代码实现

```kotlin
val drawable = ContextCompat.getDrawable(mContext, R.drawable.a)
val rectDrawable = GradientDrawable().apply {
    shape = GradientDrawable.RECTANGLE
    setColor(Color.parseColor("#FF0000"))
}
val ovalDrawable = GradientDrawable().apply {
    shape = GradientDrawable.OVAL
    setColor(Color.parseColor("#00FF00"))
}
val ringDrawable = GradientDrawable().apply {
    setSize(50.dp, 50.dp)
    shape = GradientDrawable.OVAL
    setStroke(5.dp, Color.parseColor("#0000FF"))
}
val arr = arrayOf(drawable, rectDrawable, ovalDrawable, ringDrawable)
val layerDrawable2 = LayerDrawable(arr).apply {
    setLayerInset(1, 10.dp, 10.dp, 10.dp, 10.dp)
    setLayerInset(2, 20.dp, 20.dp, 20.dp, 20.dp)
    setLayerGravity(3, Gravity.CENTER)
}
iv2.setImageDrawable(layerDrawable2)
```



## StateListDrawable

状态列表图像。

### XML实现

**基本属性**

```
<selector>：根元素
<item>：子元素
	- drawable：图片资源
	- state_pressed：是否按下
	- state_checked：是否选中
	- state_enabled：是否可用
```

**定义XML**

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" android:state_pressed="true" />
    <item android:drawable="@drawable/b" />
</selector>
```

**使用**

```kotlin
val stateListDrawable = ContextCompat.getDrawable(mContext, R.drawable.state_list_drawable)
iv1.setImageDrawable(stateListDrawable)
```



### 代码实现

```kotlin
val stateListDrawable2 = StateListDrawable().apply {
    addState(
        intArrayOf(android.R.attr.state_pressed),
        ContextCompat.getDrawable(mContext, R.drawable.a)
    )
    addState(StateSet.NOTHING, ContextCompat.getDrawable(mContext, R.drawable.b))
}
iv2.setImageDrawable(stateListDrawable2)
```



## LevelListDrawable

级别列表图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc1530e605a2438ab0a22878bab6ff48.png)

### XML实现

**基本属性**

```
<level-list>：根元素
<item>：子元素
	- drawable：图片资源
	- maxLevel：item的最高级别
	- minLevel：item的最低级别
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<level-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:drawable="@drawable/a"
        android:maxLevel="1" />
    <item
        android:drawable="@drawable/b"
        android:maxLevel="2" />
    <item
        android:drawable="@drawable/c"
        android:maxLevel="3" />
    <item
        android:drawable="@drawable/d"
        android:maxLevel="4" />
    <item
        android:drawable="@drawable/e"
        android:maxLevel="5" />
    <item
        android:drawable="@drawable/apple_pic"
        android:maxLevel="6" />
    <item
        android:drawable="@drawable/banana_pic"
        android:maxLevel="7" />
    <item
        android:drawable="@drawable/cherry_pic"
        android:maxLevel="8" />
    <item
        android:drawable="@drawable/grape_pic"
        android:maxLevel="9" />
    <item
        android:drawable="@drawable/mango_pic"
        android:maxLevel="10" />
</level-list>
```

**使用**

```kotlin
val levelListDrawable =
    ContextCompat.getDrawable(mContext, R.drawable.level_list_drawable)!!
iv1.setImageDrawable(levelListDrawable)
```



### 代码实现

```kotlin
val levelListDrawable2 = LevelListDrawable().apply {
    addLevel(0, 1, ContextCompat.getDrawable(mContext, R.drawable.a))
    addLevel(0, 2, ContextCompat.getDrawable(mContext, R.drawable.b))
    addLevel(0, 3, ContextCompat.getDrawable(mContext, R.drawable.c))
    addLevel(0, 4, ContextCompat.getDrawable(mContext, R.drawable.d))
    addLevel(0, 5, ContextCompat.getDrawable(mContext, R.drawable.e))
    addLevel(0, 6, ContextCompat.getDrawable(mContext, R.drawable.apple_pic))
    addLevel(0, 7, ContextCompat.getDrawable(mContext, R.drawable.banana_pic))
    addLevel(0, 8, ContextCompat.getDrawable(mContext, R.drawable.cherry_pic))
    addLevel(0, 9, ContextCompat.getDrawable(mContext, R.drawable.grape_pic))
    addLevel(0, 10, ContextCompat.getDrawable(mContext, R.drawable.mango_pic))
}
iv2.setImageDrawable(levelListDrawable2)
```

```kotlin
seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        levelListDrawable.level = progress
        levelListDrawable2.level = progress
    }

    override fun onStartTrackingTouch(seekBar: SeekBar?) {
    }

    override fun onStopTrackingTouch(seekBar: SeekBar?) {
    }
})
```



## TransitionDrawable

过渡图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7c3e2cc91fd44194bdd28a1be3b07852.gif)

### XML实现

**基本属性**

```
<transition>：根元素
<item>：子元素
	- drawable：图片资源
	- top、bottom、left、right：偏移值
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<transition xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" />
    <item android:drawable="@drawable/b" />
</transition>
```

**使用**

```kotlin
val transitionDrawable = ContextCompat.getDrawable(
    mContext, R.drawable.transition_drawable
) as TransitionDrawable
iv1.setImageDrawable(transitionDrawable)
```



### 代码实现

```kotlin
val drawables = arrayOf(
    ContextCompat.getDrawable(mContext, R.drawable.a),
    ContextCompat.getDrawable(mContext, R.drawable.b)
)
val transitionDrawable2 = TransitionDrawable(drawables)
iv2.setImageDrawable(transitionDrawable2)
```



## InsetDrawable

插入可绘制图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/533431f8b5f6495a9181c7c63cba6d4e.png)

### XML实现

**基本属性**

```
<inset>：根元素
	- drawable：图片资源
	- insetLeft、insetTop、insetRight、insetBottom：插入图片距离边界距离
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/a"
    android:insetLeft="200dp"
    android:insetTop="200dp" />
```

**使用**

```kotlin
val insetDrawable = ContextCompat.getDrawable(mContext, R.drawable.inset_drawable)
iv1.setImageDrawable(insetDrawable)
```



### 代码实现

```kotlin
val insetDrawable2 = InsetDrawable(
    ContextCompat.getDrawable(mContext, R.drawable.a),
    300.dp
)
iv2.setImageDrawable(insetDrawable2)
```



## ClipDrawable

剪裁图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b544474819f4706a880e963f9046bca.gif)

### XML实现

**基本属性**

```
<clip>：根元素
	- drawable：图片资源
	- clipOrientation：剪裁方向
		- horizontal：水平方向
		- vertical：垂直放心
	- gravity：位置
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<clip xmlns:android="http://schemas.android.com/apk/res/android"
    android:clipOrientation="horizontal"
    android:drawable="@drawable/a"
    android:gravity="center" />
```

**使用**

```kotlin
 val clipDrawable = ContextCompat.getDrawable(mContext, R.drawable.clip_drawable)!!
iv1.setImageDrawable(clipDrawable)
```



### 代码实现

```kotlin
val clipDrawable2 = ClipDrawable(
    ContextCompat.getDrawable(mContext, R.drawable.a),
    Gravity.CENTER,
    ClipDrawable.VERTICAL
)
iv2.setImageDrawable(clipDrawable2)
```

```kotlin
seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        clipDrawable.level = progress
        clipDrawable2.level = progress
    }

    override fun onStartTrackingTouch(seekBar: SeekBar?) {
    }

    override fun onStopTrackingTouch(seekBar: SeekBar?) {
    }
})
```



## ScaleDrawable

缩放图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/aab08250e1fa483e869d14be11e2e8a6.gif)

### XML实现

**基本属性**

```
<scale>：根元素
	- drawable：图片资源
	- scaleHeight、scaleWidth：缩放比例
	- scaleGravity：图像缩放后的位置
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<scale xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/a"
    android:scaleWidth="100%"
    android:scaleHeight="100%"
    android:scaleGravity="center" />
```

**使用**

```kotlin
val scaleDrawable = ContextCompat.getDrawable(mContext, R.drawable.scale_drawable)!!
iv1.setImageDrawable(scaleDrawable)
```



### 代码实现

```kotlin
val scaleDrawable2 =
    ScaleDrawable(ContextCompat.getDrawable(mContext, R.drawable.a), Gravity.CENTER, 1F, 1F)
iv2.setImageDrawable(scaleDrawable2)
```

```kotlin
seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        scaleDrawable.level = progress
        scaleDrawable2.level = progress
    }

    override fun onStartTrackingTouch(seekBar: SeekBar?) {
    }

    override fun onStopTrackingTouch(seekBar: SeekBar?) {
    }
})
```



## ShapeDrawable

形状图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/62b94cb842134ef0adeff953030e87a2.png)

### XML实现

**基本属性**

```
<shape>：根元素
	- shape：形状类型
		- rectangle：矩形
		- oval：椭圆
		- line：水平线
		- ring：换下
	<corner>：子元素，设置圆角
		- radius：所有角的圆角设置
		- topLeftRadius、topRightRadius、bottomLeftRadius、bottomRightRadius：单独角的圆角设置
	<padding>：子元素，设置内边距
	<size>：子元素，设置大小
		- height、width：设置宽高
	<solid>：填充颜色
		- color：填充颜色设置
	<stroke>：设置边框
		- width：边框宽度
		- color：边框颜色
		- dashGap：虚线间隔长度
		- dashWith：虚线长度
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <corners android:radius="20dp" />
    <solid android:color="#0000FF" />
    <stroke
        android:width="5dp"
        android:color="#FF0000"
        android:dashWidth="10dp"
        android:dashGap="5dp" />
</shape>
```

**使用**

```kotlin
val shapeDrawable = ContextCompat.getDrawable(mContext, R.drawable.shape_drawable)
iv1.setImageDrawable(shapeDrawable)
```



## GradientDrawable

渐变图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2db3cefd982471e83fc85e25d11354a.png)

### XML实现

**基本属性**

```
<shape>：根元素
<gradient>：子元素，表示渐变
	- startColor、centerColor、endColor：开始、中间、结束颜色
	- centerX、centerY：渐变中心点
	- type：渐变类型
		- radial：径向渐变
		- linear：线性渐变
		- sweep：流线渐变
	- gradientRadius：渐变半径，仅在type="radial"中使用
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <gradient
        android:endColor="#BBFFFF"
        android:gradientRadius="50%p"
        android:startColor="#00F5FF"
        android:type="radial" />
</shape>
```

**使用**

```kotlin
val gradientDrawable = ContextCompat.getDrawable(mContext, R.drawable.gradient_drawable)
iv1.setImageDrawable(gradientDrawable)
```



### 代码实现

```kotlin
val gradientDrawable2 = GradientDrawable().apply {
    shape = GradientDrawable.OVAL
    gradientType = GradientDrawable.RADIAL_GRADIENT
    colors = intArrayOf(Color.parseColor("#00F5FF"), Color.parseColor("#BBFFFF"))
    gradientRadius = 100.dp.toFloat()
}
iv2.setImageDrawable(gradientDrawable2)
```



## AnimationDrawable

动画图像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1ad0212c495d44829986879922bf372c.gif)

### XML实现

**基本属性**

```
<animation-list>：根元素
	- oneshot：是否只播放一次
<item>：子元素
	- drawable：图片资源
	- duration：每帧持续时间
```

**定义XML图像**

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="false">
    <item
        android:drawable="@drawable/a"
        android:duration="500" />
    <item
        android:drawable="@drawable/b"
        android:duration="500" />
    <item
        android:drawable="@drawable/c"
        android:duration="500" />
    <item
        android:drawable="@drawable/d"
        android:duration="500" />
    <item
        android:drawable="@drawable/e"
        android:duration="500" />
    <item
        android:drawable="@drawable/apple_pic"
        android:duration="500" />
    <item
        android:drawable="@drawable/banana_pic"
        android:duration="500" />
    <item
        android:drawable="@drawable/cherry_pic"
        android:duration="500" />
    <item
        android:drawable="@drawable/mango_pic"
        android:duration="500" />
    <item
        android:drawable="@drawable/grape_pic"
        android:duration="500" />
</animation-list>
```

**使用**

```kotlin
val animationDrawable =
ContextCompat.getDrawable(mContext, R.drawable.animation_drawable) as AnimationDrawable
iv1.setImageDrawable(animationDrawable)

iv1.setOnClickListener {
    isStart1 = !isStart1
    if (isStart1) {
        animationDrawable.start()
    } else {
        if (animationDrawable.isRunning) animationDrawable.stop()
    }
}
```



### 代码实现

```kotlin
private val drawables = intArrayOf(
    R.drawable.a,
    R.drawable.b,
    R.drawable.c,
    R.drawable.d,
    R.drawable.e,
    R.drawable.apple_pic,
    R.drawable.banana_pic,
    R.drawable.cherry_pic,
    R.drawable.mango_pic,
    R.drawable.grape_pic,
)

val animationDrawable2 = AnimationDrawable().apply {
    drawables.forEachIndexed {
        index, item ->
        addFrame(ContextCompat.getDrawable(mContext, item)!!, 500)
    }
}
iv2.setImageDrawable(animationDrawable2)

iv2.setOnClickListener {
    isStart2 = !isStart2
    if (isStart2) {
        animationDrawable2.start()
    } else {
        if (animationDrawable2.isRunning) animationDrawable2.stop()
    }
}
```



## 自定义Drawable

```kotlin
class CustomDrawable:Drawable() {
    override fun draw(canvas: Canvas) {
        TODO("Not yet implemented")
    }

    override fun setAlpha(alpha: Int) {
        TODO("Not yet implemented")
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        TODO("Not yet implemented")
    }

    override fun getOpacity(): Int {
        TODO("Not yet implemented")
    }
}
```

- `setAlpha()`：为Drawable指定alpha值，0表示完全透明，255表示不透明。
- `setColorFilter()`：颜色过滤器。
- `getOpacity()`：返回Drawable的透明度
  - `PixelFormat.TRANSLUCENT`：半透明的。
  - `PixelFormat.TRANSPARENT`：透明的。
  - `PixelFormat.OPAQUE`：不透明的。
  - `PixelFormat.UNKNOWN`：未知。
- `draw()`：绘制。



### CustomCircleDrawable

定义一个旋转的进度条Drawable。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e2c0c2d0978a4aba8aba9abe5b070142.gif)

**定义Drawable类**

```kotlin
class CustomCircleDrawable : Drawable(), Animatable {

    val CIRCLE_WIDTH = 5.dp.toFloat()

    private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = CIRCLE_WIDTH
        color = Color.GRAY
    }

    private val progressPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = CIRCLE_WIDTH
        strokeCap = Paint.Cap.ROUND
        color = Color.RED
    }

    private var progress = 0F

    private val valueAnimator = ValueAnimator.ofFloat(0F, 1F).apply {
        duration = 3000L
        repeatCount = Animation.INFINITE
        interpolator = LinearInterpolator()
        addUpdateListener {
            //[0.0.~1.0]
            progress = it.animatedValue as Float
            invalidateSelf()
        }
    }

    init {
        start()
    }

    override fun draw(canvas: Canvas) {
        var radius = (min(bounds.width(), bounds.height()) / 2).toFloat()
        radius -= (bgPaint.strokeWidth / 2)
        val centerX = bounds.exactCenterX()
        val centerY = bounds.exactCenterY()
        val rectF = RectF().apply {
            left = centerX - radius
            right = centerX + radius
            top = centerY - radius
            bottom = centerY + radius
        }
        canvas.rotate(360F * progress, centerX, centerY)
        canvas.drawArc(rectF, 0F, 360F, false, bgPaint)
        canvas.drawArc(rectF, -90F, 360F * progress, false, progressPaint)
    }

    override fun setAlpha(alpha: Int) {
        bgPaint.alpha = alpha
        invalidateSelf()
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        bgPaint.colorFilter = colorFilter
        invalidateSelf()
    }

    override fun getOpacity(): Int {
        return PixelFormat.OPAQUE
    }

    override fun start() {
        if (valueAnimator.isRunning) return
        valueAnimator.start()
    }

    override fun stop() {
        if (valueAnimator.isRunning) valueAnimator.cancel()
    }

    override fun isRunning(): Boolean {
        return valueAnimator.isRunning
    }
}
```

**使用**

```kotlin
val drawable = CustomCircleDrawable()
imageView.setImageDrawable(drawable)

imageView.setOnClickListener {
    if (!drawable.isRunning) {
        drawable.start()
    } else {
        drawable.stop()
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/drawable)

