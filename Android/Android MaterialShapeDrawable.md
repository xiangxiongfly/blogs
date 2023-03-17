[TOC]

# Android MaterialShapeDrawable

## 概述

方便开发人员给控件添加样式，变换背景样式。



## 属性说明

- CornerTreatment：角样式
  - RoundedCornerTreatment：圆角样式
  - CutCornerTreatment：切角样式

- EdgeTreatment：边样式

  - TriangleEdgeTreatment：三角形

  - MarkerEdgeTreatment：标记点

  - OffsetEdgeTreatment：偏移

    

## 基本使用

### 圆角效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/06e596ff24e84bdbaba31e9690d2d274.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCorners(RoundedCornerTreatment())
    .setAllCornerSizes(dp2px(10F))
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.GRAY)
    paintStyle = Paint.Style.FILL
}
textView01.background = backgroundDrawable
```



### 切角效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/5e0e9c1ba40b454893bbc32abf1609d8.png)

```kotlin
private fun test6() {
    val shapeModel = ShapeAppearanceModel.builder()
        .setAllCorners(CutCornerTreatment())
        .setAllCornerSizes(dp2px(10F))
        .build()
    val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
        setTint(Color.GRAY)
        paintStyle = Paint.Style.FILL
    }
    textView06.background = backgroundDrawable
}
```



### 标注效果

![image-20211221154351180](C:\Users\NINGMEI\AppData\Roaming\Typora\typora-user-images\image-20211221154351180.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCorners(RoundedCornerTreatment())
    .setAllCornerSizes(dp2px(10F))
    .setAllEdges(MarkerEdgeTreatment(dp2px(10F)))
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.GRAY)
    paintStyle = Paint.Style.FILL_AND_STROKE
    strokeWidth = dp2px(2F)
    strokeColor = ContextCompat.getColorStateList(context, R.color.red)
}
textView07.background = backgroundDrawable
```



### 内边三角形

![在这里插入图片描述](https://img-blog.csdnimg.cn/06dcae2233c4412d8d9ceea63227978d.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCorners(RoundedCornerTreatment())
    .setAllCornerSizes(dp2px(10F))
    .setAllEdges(TriangleEdgeTreatment(dp2px(10F), true))
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.GRAY)
    paintStyle = Paint.Style.FILL_AND_STROKE
    strokeWidth = dp2px(2F)
    strokeColor = ContextCompat.getColorStateList(context, R.color.red)
}
textView02.background = backgroundDrawable
```



### 外边三角形

![在这里插入图片描述](https://img-blog.csdnimg.cn/4cc5bbe782e34472a4867ca37ebb045f.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCorners(RoundedCornerTreatment())
    .setAllCornerSizes(dp2px(10F))
    .setAllEdges(TriangleEdgeTreatment(dp2px(10F), false))
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.GRAY)
    paintStyle = Paint.Style.FILL_AND_STROKE
    strokeWidth = dp2px(2F)
    strokeColor = ContextCompat.getColorStateList(context, R.color.red)
}
(textView03.parent as ViewGroup).clipChildren = false
textView03.background = backgroundDrawable
```



### 气泡

![在这里插入图片描述](https://img-blog.csdnimg.cn/28fb831fb7724d2a9c4ec5c7c1e47ee5.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCornerSizes(dp2px(6F))
    .setBottomEdge(
        OffsetEdgeTreatment(
            TriangleEdgeTreatment(dp2px(6F), false),
            dp2px(30F)
        )
    )
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.parseColor("#FA4B05"))
    paintStyle = Paint.Style.FILL
}
(textView04.parent as ViewGroup).clipChildren = false
textView04.background = backgroundDrawable
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/dbf7c454c07b4876b16c8800d80fb713.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCornerSizes(dp2px(6F))
    .setRightEdge(
        OffsetEdgeTreatment(
            TriangleEdgeTreatment(dp2px(6F), false),
            dp2px(0F)
        )
    )
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.parseColor("#FA4B05"))
    paintStyle = Paint.Style.FILL
}
(textView05.parent as ViewGroup).clipChildren = false
textView05.background = backgroundDrawable
```



### 阴影

![在这里插入图片描述](https://img-blog.csdnimg.cn/633c4e9a1d814d2da132c1a8c953ae9c.png)

```kotlin
val shapeModel = ShapeAppearanceModel.builder()
    .setAllCorners(RoundedCornerTreatment())
    .setAllCornerSizes(dp2px(16F))
    .build()
val backgroundDrawable = MaterialShapeDrawable(shapeModel).apply {
    setTint(Color.GRAY)
    paintStyle = Paint.Style.FILL

    //绘制阴影
    shadowCompatibilityMode = MaterialShapeDrawable.SHADOW_COMPAT_MODE_ALWAYS
    initializeElevationOverlay(context)
    setShadowColor(Color.RED)
    elevation = dp2px(10F)
}
(textView08.parent as ViewGroup).clipChildren = false
textView08.background = backgroundDrawable
```



## [源码下载](https://github.com/xiangxiongfly/MyMeterialDesign)

