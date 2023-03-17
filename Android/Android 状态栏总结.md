[TOC]

# Android 状态栏总结

## 全屏+状态栏无文字图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/981fab58e63a4811bd900acd9e4b51b0.png)

**方式一：设置主题**

```xml
 <style name="FullScreenTheme" parent="AppTheme">
        <item name="android:windowFullscreen">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:windowTranslucentNavigation">true</item>
</style>
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_status_bar1)

    StatusBarUtils.fitsNotchScreen(this)
}
```

**方式二：代码设置**

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_status_bar1)
    //隐藏状态栏
    //        StatusBarUtils.hideBar(this, BarState.FLAG_HIDE_STATUS_BAR)
    //隐藏状态栏和底部导航栏
    StatusBarUtils.hideBar(this, BarState.FLAG_HIDE_ALL_BAR)
    //隐藏底部导航栏
    //        StatusBarUtils.hideBar(this, BarState.FLAG_HIDE_NAVIGATION_BAR)
    //显示全部
    //        StatusBarUtils.hideBar(this,BarState.FLAG_SHOW_ALL_BAR)
}
```

```kotlin
/**
 * 状态栏工具类
 */
object StatusBarUtils {
    //刘海屏适配
    fun fitsNotchScreen(activity: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            try {
                val lp: WindowManager.LayoutParams = activity.window.getAttributes()
                lp.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                activity.window.attributes = lp
            } catch (e: Exception) {
            }
        }
    }

    /**
     * 操作状态栏
     */
    fun hideBar(activity: Activity, item: BarState) {
        fitsNotchScreen(activity)
        var uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        when (item) {
            BarState.FLAG_HIDE_ALL_BAR ->
            //隐藏状态栏和导航栏
            uiFlags =
            uiFlags or (View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.INVISIBLE)
            BarState.FLAG_HIDE_STATUS_BAR ->
            //隐藏状态栏
            uiFlags = uiFlags or (View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.INVISIBLE)
            BarState.FLAG_HIDE_NAVIGATION_BAR ->
            //隐藏导航栏
            uiFlags =
            uiFlags or (View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION)
            BarState.FLAG_SHOW_ALL_BAR ->
            //显示状态栏和导航栏
            uiFlags = uiFlags or View.SYSTEM_UI_FLAG_VISIBLE
        }
        uiFlags = uiFlags or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        activity.window.decorView.systemUiVisibility = uiFlags
    }
}

enum class BarState {
    /**
     * 隐藏状态栏
     */
    FLAG_HIDE_STATUS_BAR,

    /**
     * 隐藏导航栏
     */
    FLAG_HIDE_NAVIGATION_BAR,

    /**
     * 隐藏状态栏和导航栏
     */
    FLAG_HIDE_ALL_BAR,

    /**
     * 显示状态栏和导航栏
     */
    FLAG_SHOW_ALL_BAR
}
```



## 全屏+状态栏有文字图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/e99f39036ee14d3a873b859678629602.png)

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_status_bar2)
    //        window.statusBarColor= Color.TRANSPARENT //可以替换为主题
    window.decorView.systemUiVisibility =
    View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
}
```

```xml
<!-- 透明状态栏主题 -->
<style name="AppTheme.Transparent" parent="AppTheme">
    <item name="android:statusBarColor">@android:color/transparent</item>
</style>
```



## 修改状态栏颜色

**工具类**

```kotlin
object StatusBarUtils {
    /**
     * 修改状态栏颜色
     */
    fun setStatusBarColor(activity: Activity, @ColorInt color: Int) {
        activity.window.statusBarColor = color
    }

    /**
     * 修改状态栏颜色，通过资源文件
     */
    fun setStatusBarColor2(activity: Activity, @ColorRes colorId: Int) {
        activity.window.statusBarColor = activity.resources.getColor(colorId)
    }
}
```

**使用**

```kotlin
fun switchRed(v: View) {
    StatusBarUtils.setStatusBarColor(this, Color.RED)
}

fun switchYellow(v: View) {
    StatusBarUtils.setStatusBarColor2(this, R.color.yellow)
}

fun switchGreen(v: View) {
    StatusBarUtils.setStatusBarColor2(this, R.color.green)
}
```



## [沉浸式导航栏效果](https://blog.csdn.net/qq_14876133/article/details/100990933)



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/statusbar)

