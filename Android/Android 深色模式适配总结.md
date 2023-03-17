# Android 深色模式适配总结

## 前言

iOS13推出暗黑模式，既然苹果实现了暗黑模式，那么安卓肯定不能落下啊，所以在安卓10（Q API级别29）中支持了暗黑模式，不过官方的叫法为Dark theme。



## 适配流程

### 主题设置

为了支持Dark主题，必须将应用的主题设置为继承自`DayNight`系列的主题。

```
Theme.MaterialComponents.DayNight.DarkActionBar
或：
Theme.AppCompat.DayNight
```

### 资源文件处理

![在这里插入图片描述](https://img-blog.csdnimg.cn/e0ae91b9e4cb49d6b781c8a04d657d1d.png)

需要在对应的资源文件中添加`night`文件夹，这里存放的就是深色模式相关的资源，也就是说需要准备2套资源。

如：

values strings.xml和values-night strings.xml

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c1b0aa155e745c99891215e011e4fa8.png)

values-colors.xml和values-night strings.xml

![在这里插入图片描述](https://img-blog.csdnimg.cn/11207797dbb84abd86d78e28d81598c4.png)

### 代码相关

**XML布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/color_background"
    android:gravity="center_horizontal"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <ImageView
        android:id="@+id/imageView"
        android:layout_width="200dp"
        android:layout_height="100dp"
        android:layout_marginTop="10dp"
        android:scaleType="fitXY"
        android:src="@drawable/light" />

    <ImageView
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:layout_marginTop="10dp"
        android:background="@drawable/frame_shape"
        android:src="@drawable/ic_daynight"
        app:tint="@color/color_daynight" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="@string/day_night"
        android:textColor="@color/color_daynight"
        android:textSize="18sp" />

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btnLight"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="浅色模式" />

        <Button
            android:id="@+id/btnDark"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginHorizontal="10dp"
            android:text="深色模式" />

        <Button
            android:id="@+id/btnSystem"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="跟随系统" />
    </LinearLayout>    
</LinearLayout>
```

**代码：**

```kotlin
object ThemeUtils {
    /**
     * 是否深色主题
     */
    fun isDarkTheme(context: Context): Boolean {
        val flag = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        return flag == Configuration.UI_MODE_NIGHT_YES
    }
}
```

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Log.e("TAG", "Activity onCreate()")
        initView()
    }

    private fun initView() {
        //手动切换深色模式
        btnLight.setOnClickListener {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        }
        btnDark.setOnClickListener {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        }
        btnSystem.setOnClickListener {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        }
    }

    override fun onStart() {
        super.onStart()
        if (ThemeUtils.isDarkTheme(this)) {
            imageView.setImageResource(R.drawable.dark)
        } else {
            imageView.setImageResource(R.drawable.light)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.e("TAG", "Activity onDestroy()")
    }
}
```

**效果：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ea5a7eb6e314441a3ba3803623e00d9.png)



## 配置变更问题

当切换深色模式时，Activity就会重新加载，重走生命周期流程。

为了避免界面重新加载，可以在`AndroidManifest.xml`文件中设置Activity的`android:configChanges="uiMode"`。当配置发生变化时，可以通过`onConfigurationChanged()`方法监听当前应用是什么模式。

**Activity#onConfigurationChanged()**

```kotlin
//监听系统深色模式切换
override fun onConfigurationChanged(newConfig: Configuration) {
    Log.e("TAG", "onConfigurationChanged:")
    super.onConfigurationChanged(newConfig)
    val currentNightMode = newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK
    when (currentNightMode) {
        Configuration.UI_MODE_NIGHT_NO -> {
            // 夜间模式未启用，我们正在使用浅色主题
            textView.setText("当前浅色模式")
        }
        Configuration.UI_MODE_NIGHT_YES -> {
            // 夜间模式启用，我们使用的是深色主题
            textView.setText("当前深色模式")
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/AndroidDayNight)

