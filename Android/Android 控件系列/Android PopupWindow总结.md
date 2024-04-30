[TOC]

# Android PopupWindow总结

## 常用API说明

| API                                                          | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `showAsDropDown(View anchor, int xoff, int yoff, int gravity)` | 在指定视图的下方显示弹出窗口。                               |
| `showAtLocation(View parent, int gravity, int x, int y)`     | 在指定位置显示弹出窗口。                                     |
| `setTouchable(boolean touchable)`                            | 是否响应触摸事件，默认值为true。                             |
| `setOutsideTouchable(boolean touchable)`                     | 是否允许弹出窗口外部的事件传递给后面的视图，默认值为false。<br />如：setOutsideTouchable设置为true，setTouchable色孩子为false，点击外部区域时事件会被传递到后面的视图。 |
| `setFocusable(boolean focusable)`                            | 是否为弹出窗口获取焦点。setFocusable设置为true，弹出窗口可以获取焦点，可以接收键盘事件，<br />如：弹出窗口有一个输入框。 |



## 使用

```kotlin
/**
 * 设置背景是否昏暗
 */
private fun setDimEnable(enable: Boolean) {
    if (enable) {
        setBackgroundAlpha(0.6F)
    } else {
        setBackgroundAlpha(1F)
    }
}

/**
 * 设置背景透明度
 */
private fun setBackgroundAlpha(alpha: Float) {
    window.let { w ->
        val layoutParams = w.attributes
        layoutParams.alpha = alpha
        w.attributes = layoutParams
    }
}
```

### 下拉框

```kotlin
val view = LayoutInflater.from(mContext).inflate(R.layout.pop_share, null)
val tvQQ = view.findViewById<TextView>(R.id.tv_qq)
val tvWeixin = view.findViewById<TextView>(R.id.tv_weixin)
val tvSina = view.findViewById<TextView>(R.id.tv_sina)
val sharePop = PopupWindow(view, dp2px(100), ViewGroup.LayoutParams.WRAP_CONTENT, true)
sharePop.apply {
    setBackgroundDrawable(ColorDrawable())
    setOnDismissListener { setDimEnable(false) }
}
setDimEnable(true)
sharePop.showAsDropDown(btnShare, -30, 0, Gravity.RIGHT)
tvQQ.setOnClickListener { sharePop.dismiss() }
tvWeixin.setOnClickListener { sharePop.dismiss() }
tvSina.setOnClickListener { sharePop.dismiss() }
```

### 仿QQ弹窗

```kotlin
val view = LayoutInflater.from(mContext).inflate(R.layout.pop_qq, null)
val cancel = view.findViewById<TextView>(R.id.cancel)
val qqPop = PopupWindow(
    view,
    ViewGroup.LayoutParams.MATCH_PARENT,
    ViewGroup.LayoutParams.WRAP_CONTENT,
    true
)
qqPop.apply {
    setBackgroundDrawable(ColorDrawable())
    animationStyle = R.style.DialogAnim
    setOnDismissListener { setDimEnable(false) }
}
setDimEnable(true)
qqPop.showAtLocation(root, Gravity.BOTTOM, 0, 0)
cancel.setOnClickListener { qqPop.dismiss() }
```

**动画设置：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
           android:duration="200"
           android:fromYDelta="100%"
           android:interpolator="@android:anim/accelerate_interpolator"
           android:toYDelta="0" />
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
           android:duration="200"
           android:fromYDelta="0"
           android:interpolator="@android:anim/accelerate_interpolator"
           android:toYDelta="100%" />
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="DialogAnim">
        <item name="android:windowEnterAnimation">@anim/anim_enter</item>
        <item name="android:windowExitAnimation">@anim/anim_out</item>
    </style>
</resources>
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/home/src/main/java/com/example/home/popupwindow)

