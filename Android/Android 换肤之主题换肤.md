[toc]

# Android 换肤之主题换肤

## 概述

 Android 实现应用内换肤的常用方式（两种）：

- 通过Theme切换主题，即静态方法。
- 通过AssetManager切换主题，可实现动态切换。



## 效果

**浅色模式：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e9ffd2592b274223868161877c0a558c.png)

**深色模式：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2fa8af9b6c9e495eb78b5f99b988e4ce.png)



## 实现

### 代码结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/29725e00b9374da884cc6165db0c8d9c.png)



### 定义属性

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!--    描述信息-->
    <attr name="description" format="string" />
    <!--    描述文本颜色-->
    <attr name="descriptionColor" format="color" />
    <!--    头像-->
    <attr name="portrait" format="reference" />
    <!--    头像颜色-->
    <attr name="portraitColor" format="color" />
    <!--    头像边框-->
    <attr name="portraitBorder" format="reference" />
    <!--    背景图片-->
    <attr name="bgImage" format="reference" />
    <!--    背景颜色-->
    <attr name="bgColor" format="color" />
</resources>
```

### 定义主题

```xml
<style name="LightTheme" parent="AppTheme">
    <item name="description">@string/light_description</item>
    <item name="descriptionColor">@color/light_text_color</item>
    <item name="portrait">@drawable/ic_light</item>
    <item name="portraitBorder">@drawable/shape_light_border</item>
    <item name="portraitColor">@color/black</item>
    <item name="bgImage">@drawable/light_bg_drawable</item>
    <item name="bgColor">@color/light_bg_color</item>
</style>

<style name="NightTheme" parent="AppTheme">
    <item name="description">@string/night_description</item>
    <item name="descriptionColor">@color/night_text_color</item>
    <item name="portrait">@drawable/ic_night</item>
    <item name="portraitBorder">@drawable/shape_night_border</item>
    <item name="portraitColor">@color/white</item>
    <item name="bgImage">@drawable/night_bg_drawable</item>
    <item name="bgColor">@color/night_bg_color</item>
</style>
```

### 在Activity中使用

```kotlin
open class BaseActivity : AppCompatActivity, ThemeObserver {

    constructor() : super()

    constructor(@LayoutRes layoutId: Int) : super(layoutId)

    override fun onCreate(savedInstanceState: Bundle?) {
        ThemeManager.setTheme(this)
        super.onCreate(savedInstanceState)
        ThemeManager.addObserver(this)
    }

    override fun onThemeChanged() {
        ThemeManager.setTheme(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        ThemeManager.removeObserver(this)
    }
}
```

```kotlin
class MainActivity : BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Log.e("TAG", "MainActivity onCreate()")
        initViews()
    }

    private fun initViews() {
        btnLight.setOnClickListener {
            ThemeManager.setTheme(this, THEME_LIGHT)
        }
        btnNight.setOnClickListener {
            ThemeManager.setTheme(this, THEME_NIGHT)
        }
        btnToSecond.setOnClickListener {
            startActivity(Intent(this, SecondActivity::class.java))
        }
    }

    /**
     * 更新控件
     */
    override fun onThemeChanged() {
        super.onThemeChanged()
        Log.e("TAG", "MainActivity onThemeChanged")
        val helper = ResourceHelper(this)
        helper.setBackgroundResource(root, R.attr.bgColor)
        helper.setImageResource(bgImage, R.attr.bgImage)
        helper.setImageResource(portrait, R.attr.portrait)
        helper.setImageColorResource(portrait, R.attr.portraitColor)
        helper.setBackgroundResource(portrait, R.attr.portraitBorder)
        helper.setTextResource(description, R.attr.description)
        helper.setTextColorResource(description, R.attr.descriptionColor)
    }
}
```

### 在Fragment中使用

```kotlin
abstract class BaseFragment : Fragment, ThemeObserver {

    constructor() : super()

    constructor(@LayoutRes layoutId: Int) : super(layoutId)

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        ThemeManager.addObserver(this)
        return super.onCreateView(inflater, container, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        ThemeManager.removeObserver(this)
    }
}
```

```kotlin
class ThemeFragment : BaseFragment(R.layout.fragment_theme) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.btnLight.setOnClickListener {
            ThemeManager.setTheme(activity!!, THEME_LIGHT)
        }
        view.btnNight.setOnClickListener {
            ThemeManager.setTheme(activity!!, THEME_NIGHT)
        }
    }

    /**
     * 更新控件
     */
    override fun onThemeChanged() {
        Log.e("TAG", "ThemeFragment onThemeChanged")
        if (isAdded) {
            val helper = ResourceHelper(context!!)
            helper.setBackgroundResource(root, R.attr.bgColor)
            helper.setImageResource(bgImage, R.attr.bgImage)
            helper.setImageResource(portrait, R.attr.portrait)
            helper.setImageColorResource(portrait, R.attr.portraitColor)
            helper.setBackgroundResource(portrait, R.attr.portraitBorder)
            helper.setTextResource(description, R.attr.description)
            helper.setTextColorResource(description, R.attr.descriptionColor)
        }
    }
}
```

### 工具类

```kotlin
object ThemeManager {
    const val THEME_LIGHT = 1
    const val THEME_NIGHT = 2

    fun setTheme(activity: Activity, themeType: Int) {
        val sp = activity.getSharedPreferences("app", AppCompatActivity.MODE_PRIVATE)
        sp.edit()
            .putInt("themeType", themeType)
            .commit()
        setTheme(activity)
        notifyThemeChanged();
    }

    fun setTheme(activity: Activity) {
        val sp = activity.getSharedPreferences("app", AppCompatActivity.MODE_PRIVATE)
        val themeType = sp.getInt("themeType", THEME_LIGHT)
        var themeId = -1
        if (themeType == THEME_LIGHT) {
            themeId = R.style.LightTheme
        } else if (themeType == THEME_NIGHT) {
            themeId = R.style.NightTheme
        }
        activity.setTheme(themeId)
    }

    private val mThemeObservers = mutableListOf<ThemeObserver>()

    fun addObserver(observer: ThemeObserver) {
        mThemeObservers.add(observer)
    }

    fun removeObserver(observer: ThemeObserver) {
        mThemeObservers.remove(observer)
    }

    fun notifyThemeChanged() {
        for (i in mThemeObservers.size - 1 downTo 0) {
            mThemeObservers[i].onThemeChanged()
        }
    }
}
```

```kotlin
public interface ThemeObserver {

    fun onThemeChanged()
}
```

```kotlin
class ResourceHelper(val context: Context) {

    /**
     * 获取当前主题
     */
    fun getTheme(): Resources.Theme {
        return context.theme
    }

    /**
     * 设置背景资源
     */
    fun setBackgroundResource(view: View, attr: Int) {
        val theme: Resources.Theme = getTheme()
        val typedValue = TypedValue()
        if (theme.resolveAttribute(attr, typedValue, true)) {
            val resId = typedValue.resourceId
            view.setBackgroundResource(resId)
        }
    }

    /**
     * 设置图片资源
     */
    fun setImageResource(imageView: ImageView, attr: Int) {
        val theme: Resources.Theme = getTheme()
        val typedValue = TypedValue()
        if (theme.resolveAttribute(attr, typedValue, true)) {
            val resId = typedValue.resourceId
            imageView.setImageResource(resId)
        }
    }

    /**
     * 设置图片颜色
     */
    fun setImageColorResource(imageView: ImageView, attr: Int) {
        val drawable: Drawable? = imageView.drawable
        drawable?.let {
            val tintDrawable = DrawableCompat.wrap(it).mutate()
            val theme: Resources.Theme = getTheme()
            val typedValue = TypedValue()
            if (theme.resolveAttribute(attr, typedValue, true)) {
                val resId = typedValue.resourceId
                val color = ResourcesCompat.getColor(context.resources, resId, theme)
                DrawableCompat.setTint(tintDrawable, color)
                imageView.setImageDrawable(tintDrawable)
            }
        }
    }

    /**
     * 设置文本资源
     */
    fun setTextResource(textView: TextView, attr: Int) {
        val theme: Resources.Theme = getTheme()
        val typedValue = TypedValue()
        if (theme.resolveAttribute(attr, typedValue, true)) {
            val resId = typedValue.resourceId
            textView.setText(resId)
        }
    }

    /**
     * 设置文本颜色资源
     */
    fun setTextColorResource(textView: TextView, attr: Int) {
        val theme: Resources.Theme = getTheme()
        val typedValue = TypedValue()
        if (theme.resolveAttribute(attr, typedValue, true)) {
            val resId = typedValue.resourceId
            val color = ResourcesCompat.getColor(context.resources, resId, theme)
            textView.setTextColor(color)
        }
    }
}
```



## [源码下载](https://github.com/xiangxiongfly/Android_SkinApp)

