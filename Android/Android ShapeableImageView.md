[TOC]

# Android ShapeableImageView

## 概述

ShapeableImageView是material控件之一，继承于ImageView，作用是为了让开发者更方便的ImageView进行变形处理。



**依赖库**

```
implementation 'com.google.android.material:material:1.4.0'
```



## 基本使用

**样式：**

- cornerFamily：圆角方式；rounded圆角处理，cut切角处理
- cornerSize：圆角尺寸
-  strokeColor：边框颜色
- strokeWidth：边框宽度



### 不变形

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9bb006e1c8f4d73a7a64e2faf979d30.png)

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box" />
```



### 圆角样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/09948b7292b14746abcd6a2aee5f7486.png)

```
<!--    圆角样式-->
<style name="RoundedStyle">
    <!--        角处理方式-->
    <item name="cornerFamily">rounded</item>
    <!--        圆角大小-->
    <item name="cornerSize">30dp</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/RoundedStyle" />
```



### 圆形样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/45ae4023fc364c33b715d007b20325b6.png)

```
<!--    圆形样式-->
<style name="CircleStyle">
    <item name="cornerFamily">rounded</item>
    <item name="cornerSize">50%</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/CircleStyle" />
```



### 添加边框

![在这里插入图片描述](https://img-blog.csdnimg.cn/6fe961d8815447c698d64cab7c3e1d87.png)

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:padding="2dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/CircleStyle"
    app:strokeColor="@color/red"
    app:strokeWidth="4dp" />
```



### 切角样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/34a1db1637fd4712b62e622d43442e08.png)

```
<!--    切角样式-->
<style name="CutStyle">
    <item name="cornerFamily">cut</item>
    <item name="cornerSize">20dp</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/CutStyle" />
```



### 菱形样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/23f68a2737eb497883700abe58d027b0.png)

```
<!--    菱形样式-->
<style name="RhombusStyle">
    <item name="cornerFamily">cut</item>
    <item name="cornerSize">50%</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/RhombusStyle" />
```



### 叶子样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5af61eec580475aa796ac8625446747.png)

```
<!--    叶子样式-->
<style name="LeafStyle">
    <item name="cornerFamily">rounded</item>
    <item name="cornerSizeTopLeft">50%</item>
    <item name="cornerSizeBottomRight">50%</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/LeafStyle" />
```



### 半圆样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/2166fcfb1e204231b73b4701d9cc55c7.png)

```
<!--    半圆样式-->
<style name="SemicircleStyle">
    <item name="cornerFamily">rounded</item>
    <item name="cornerSizeTopLeft">50%</item>
    <item name="cornerSizeTopRight">50%</item>
</style>
```

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/SemicircleStyle" />
```



### 层叠效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/55b9a55136794e1ba17e9f1b4a0803b3.png)

```
<com.google.android.material.imageview.ShapeableImageView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_margin="5dp"
    android:src="@drawable/box"
    app:shapeAppearance="@style/SemicircleStyle"
    app:shapeAppearanceOverlay="@style/CircleStyle" />
```



## ViewOutlineProvider

ShapeableImageView本质是通过ViewOutlineProvider实现剪裁的。ViewOutlineProvider的效率比传统的Xfermode进行剪裁的方式高很多。

### 实现圆角效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/f784a31f7ebb40518db781a17d6140b2.png)

```kotlin
//绘制圆角
imageView01.apply {
    outlineProvider = object : ViewOutlineProvider() {
        override fun getOutline(view: View, outline: Outline) {
            outline.setRoundRect(0, 0, view.width, view.height, dp2px(30F))
        }
    }
    clipToOutline = true
}
```



### 实现圆形效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/e4a317cb362a49d68b1cc914187ec119.png)

```kotlin
//绘制圆形
imageView02.apply {
    outlineProvider = object : ViewOutlineProvider() {
        override fun getOutline(view: View, outline: Outline) {
            outline.setOval(0, 0, view.width, view.height)
        }
    }
    clipToOutline = true
}
```



### 其他形状

![在这里插入图片描述](https://img-blog.csdnimg.cn/9d86c7bb617a4e3ab1c0e6011565ce1f.png)

```kotlin
imageView03.apply {
    outlineProvider = object : ViewOutlineProvider() {
        override fun getOutline(view: View, outline: Outline) {
            view.elevation = 10F
            val gap = 20F
            val path = Path()
            path.moveTo(-gap, -gap)
            path.lineTo(-gap, view.measuredHeight.toFloat() + gap) //左下点
            path.lineTo(
                (view.measuredWidth / 2).toFloat(),
                (view.measuredHeight + 50).toFloat()
            )
            path.lineTo(
                view.measuredWidth.toFloat() + gap,
                view.measuredHeight.toFloat() + gap
            )
            path.lineTo(view.measuredWidth.toFloat() + gap, -gap) //右上点
            path.close()
            outline.setConvexPath(path)
            view.scaleX = 0.5F
            view.scaleY = 0.5F
        }
    }
}
```





