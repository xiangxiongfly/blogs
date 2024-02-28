[TOC]

# Android 状态栏总结

## 全屏+状态栏无文字图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/483cac2e88aa41e1bc1ade83f4f2c474.png)

**方式一：设置主题**

```xml
<style name="FullScreenTheme" parent="Theme.MyStatusBar">
    <!--   是否显示ActionBar     -->
    <item name="windowActionBar">false</item>
    <!--   是否显示标题栏     -->
    <item name="windowNoTitle">true</item>
    <!--   是否全屏显示     -->
    <item name="android:windowFullscreen">true</item>
    <!--   设置状态栏颜色     -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <!--   导航栏是否是半透明     -->
    <item name="android:windowTranslucentNavigation">true</item>
</style>
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    BarUtils.fitsNotchScreen(this)
    setContentView(R.layout.activity_status_bar1)
}
```

**方式二：代码设置**

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    BarUtils.fitsNotchScreen(this)
    BarUtils.fullScreen(this)
    setContentView(R.layout.activity_status_bar1)
}
```



## 全屏+状态栏有文字图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7364129c1b854fc88694f93783ed3f96.png)

**方式一：设置主题**

```xml
<style name="FullScreenTheme" parent="Theme.MyStatusBar">
    <!--   是否显示ActionBar     -->
    <item name="windowActionBar">false</item>
    <!--   是否显示标题栏     -->
    <item name="windowNoTitle">true</item>
    <!--   设置状态栏颜色     -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <!--   导航栏是否是半透明     -->
    <item name="android:windowTranslucentNavigation">true</item>
</style>
```

**方式二：代码设置**

```java
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
        BarUtils.fitsNotchScreen(this)
        BarUtils.fullScreen2(this)
        setContentView(R.layout.activity_operate_status_bar2)
}
```



## 工具类

### BarUtils

```kotlin
/**
 * 状态栏工具类
 */
object BarUtils {

//<editor-fold desc="全屏设置">
    /**
     * 刘海屏适配
     */
    fun fitsNotchScreen(activity: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            try {
                val lp: WindowManager.LayoutParams = activity.window.attributes
                lp.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                activity.window.attributes = lp
            } catch (e: Exception) {
            }
        }
    }

    /**
     * 隐藏ActionBar
     */
    fun setNoTitle(activity: AppCompatActivity) {
        activity.requestWindowFeature(Window.FEATURE_NO_TITLE) // 隐藏标题栏
        activity.supportActionBar?.hide() // 隐藏ActionBar
    }

    /**
     * 全屏显示，状态栏不显示文字图片
     */
    fun fullScreen(activity: AppCompatActivity) {
        setNoTitle(activity)
        activity.window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        ) // 全屏显示
        activity.window.statusBarColor = Color.TRANSPARENT; // 设置状态栏颜色为透明
        activity.window.setFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        ) // 导航栏半透明
    }

    /**
     * 全屏显示，状态栏显示文字图片
     */
    fun fullScreen2(activity: AppCompatActivity) {
        setNoTitle(activity)
        activity.window.statusBarColor = Color.TRANSPARENT; // 设置状态栏颜色为透明
        activity.window.setFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        ) // 导航栏半透明
    }

    /**
     * 隐藏状态栏
     */
    fun hideStatusBar(activity: Activity) {
        activity.window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
    }

    /**
     * 显示状态栏
     */
    fun showStatusBar(activity: Activity) {
        activity.window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
    }

    /**
     * 隐藏底部导航栏
     */
    fun hideNavigationBar(activity: Activity) {
        activity.window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    }

    /**
     * 显示底部导航栏
     */
    fun showNavigationBar(activity: Activity) {
        activity.window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
    }
//</editor-fold>

//<editor-fold desc="状态栏颜色">
    /**
     * 修改状态栏颜色
     */
    fun setStatusBarColor(activity: Activity, @ColorInt color: Int) {
        activity.window.statusBarColor = color
    }

    /**
     * 修改状态栏颜色，通过Color资源
     */
    fun setStatusBarColorRes(activity: Activity, @ColorRes colorResId: Int) {
        setStatusBarColor(activity, ContextCompat.getColor(activity, colorResId))
    }

    /**
     * 亮色状态栏，图片和文字是黑色的
     */
    fun setLightStatusBar(activity: Activity) {
        val flags = activity.window.decorView.systemUiVisibility
        activity.window.decorView.systemUiVisibility = flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
    }

    /**
     * 暗色状态栏，图片和文字是白色的
     */
    fun setDarkStatusBar(activity: Activity) {
        val flags =
            activity.window.decorView.systemUiVisibility or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        activity.window.decorView.systemUiVisibility =
            flags xor View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
    }
//</editor-fold>

//<editor-fold desc="辅助">
    /**
     * 获取状态栏高度
     */
    fun getStatusBarHeight(context: Context): Int {
        val resourceId = context.resources.getIdentifier("status_bar_height", "dimen", "android")
        return if (resourceId > 0) {
            context.resources.getDimensionPixelSize(resourceId)
        } else {
            0
        }
    }

    /**
     * 获取状态栏高度
     */
    fun getNavigationBarHeight(context: Context): Int {
        val resourceId: Int =
            context.resources.getIdentifier("navigation_bar_height", "dimen", "android")
        return if (resourceId > 0) {
            context.resources.getDimensionPixelSize(resourceId)
        } else {
            0
        }
    }

    /**
     * 是否有导航栏
     */
    fun isNavigationBar(activity: Activity): Boolean {
        val vp = activity.window.decorView as? ViewGroup
        if (vp != null) {
            for (i in 0 until vp.childCount) {
                vp.getChildAt(i).context.packageName
                if (vp.getChildAt(i).id != -1 && "navigationBarBackground" ==
                    activity.resources.getResourceEntryName(vp.getChildAt(i).id)
                ) return true
            }
        }
        return false
    }
//</editor-fold>
}
```



## [沉浸式状态栏](https://blog.csdn.net/qq_14876133/article/details/100990933)



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/status_bar_demo)

