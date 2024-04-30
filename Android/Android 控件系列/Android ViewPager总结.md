[TOC]

# ViewPager总结

## 概述

ViewPager是一个视图滑动切换控件。



## ViewPager基本使用

### FragmentPagerAdapter和FragmentStatePagerAdapter的区别

- FragmentPagerAdapter：页面切换回收时，会执行`onDestroyView`，再次创建时会执行`onCreateView`，Fragment没有被销毁。适合少量页面。
- FragmentStatePagerAdapter：页面切换回收时，会执行`onDestroyView`和`onDestroy`，再次创建时会执行`onCreate`和`onCreateView`，Fragment会被销毁。适合大量页面或Fragment内存占用大。



### 代码准备

```kotlin
//图片资源
private val mImgIds =
    intArrayOf(R.drawable.a, R.drawable.b, R.drawable.c, R.drawable.d, R.drawable.e)
```

### 使用一

![在这里插入图片描述](https://img-blog.csdnimg.cn/760e07211fd642b79d1e1349cd382c1c.gif)

```kotlin
val imageViewList = getImageViewList()

val width = dp2px(10)

for (i in mImgIds.indices) {
    val dot = View(this)
    dot.setBackgroundResource(R.drawable.dot_selector)
    val layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams(width, width))
    if (i != 0) {
        layoutParams.leftMargin = width
    } else {
        dot.isSelected = true
    }
    indicator.addView(dot, layoutParams)
}
viewPager.adapter = ViewPagerAdapter(imageViewList)

viewPager.addOnPageChangeListener(object : ViewPager.OnPageChangeListener {
    override fun onPageScrolled(
        position: Int,
        positionOffset: Float,
        positionOffsetPixels: Int
    ) {

    }

    override fun onPageSelected(position: Int) {
        for (i in 0 until indicator.size) {
            indicator.getChildAt(i).isSelected = i == position
        }
    }

    override fun onPageScrollStateChanged(state: Int) {

    }
})
```

### 使用二

![在这里插入图片描述](https://img-blog.csdnimg.cn/eba1c8a402fd4736baba9ac4da2d6648.gif)

```kotlin
val imageViewList = getImageViewList()
val width = dp2px(10)

for (i in mImgIds.indices) {
    val dot = View(this)
    dot.setBackgroundResource(R.drawable.dot_normal_shape)
    val layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams(width, width))
    if (i != 0) {
        layoutParams.leftMargin = width
    }
    indicator2.addView(dot, layoutParams)
}
viewPager2.adapter = ViewPagerAdapter(imageViewList)
dotSelected.viewTreeObserver.addOnGlobalLayoutListener(
    object : ViewTreeObserver.OnGlobalLayoutListener {
        override fun onGlobalLayout() {
            dotSelected.viewTreeObserver.removeOnGlobalLayoutListener(this)
            distance = indicator2.getChildAt(1).left - indicator2.getChildAt(0).left
        }
    })
viewPager2.addOnPageChangeListener(object : ViewPager.OnPageChangeListener {
    override fun onPageScrolled(
        position: Int,
        positionOffset: Float,
        positionOffsetPixels: Int
    ) {
        val leftMargin: Int = (position * distance + positionOffset * distance).toInt()
        val layoutParams = dotSelected.layoutParams as FrameLayout.LayoutParams
        layoutParams.leftMargin = leftMargin
        dotSelected.layoutParams = layoutParams
    }

    override fun onPageSelected(position: Int) {

    }

    override fun onPageScrollStateChanged(state: Int) {

    }
})
//设置页面变形效果
viewPager2.setPageTransformer(true, ScaleTransformer())
```

### 使用三

![在这里插入图片描述](https://img-blog.csdnimg.cn/545f883c706e410da4fe630cd3fa1fb8.gif)

```kotlin
val imageViewList = getImageViewList()
viewPager3.offscreenPageLimit = 3
viewPager3.pageMargin = dp2px(0)
viewPager3.adapter = ViewPagerAdapter(imageViewList)
viewPager3.setPageTransformer(true, RotateTransformer())
```

### 使用四

![在这里插入图片描述](https://img-blog.csdnimg.cn/9fc9bf4e58894fcdb8cb78fce3f5c381.gif)

```kotlin
   val imageViewList = getImageViewList()
        viewPager4.adapter = ViewPagerAdapter(imageViewList)
        viewPager4.setPageTransformer(true, DepthPageTransformer())
```



## ViewPager+TabLayout+Fragment

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d3901ba9d634516b1ebf5d818f5b1cf.gif)

**XML布局：**

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".viewpager.tab.TabVpActivity">

    <com.google.android.material.tabs.TabLayout
        android:id="@+id/tabLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:tabIndicatorColor="@color/red"
        app:tabIndicatorFullWidth="false"
        app:tabMode="auto"
        app:tabSelectedTextColor="@color/red"
        app:tabTextColor="@color/black" />

    <androidx.viewpager.widget.ViewPager
        android:id="@+id/viewPager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```

**Kotlin代码：**

```kotlin
class TabVpActivity : BaseActivity() {
    private lateinit var tabLayout: TabLayout
    private lateinit var viewPager: ViewPager

    private val titles = arrayOf<String>("one", "two", "three", "four", "five", "six")
    private val fragmentList = ArrayList<TextFragment>().apply {
        titles.forEach {
            add(TextFragment.newInstance(it))
        }
    }

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, TabVpActivity::class.java)
            intent.putExtra(KEY_TITLE, "ViewPager+TabLayout+Fragment")
            context.startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tab_vp)
        initView()
        initData()
    }

    private fun initView() {
        tabLayout = findViewById(R.id.tabLayout)
        viewPager = findViewById(R.id.viewPager)
    }

    private fun initData() {
        val adapter = MyAdapter(supportFragmentManager, titles, fragmentList)
        viewPager.adapter = adapter
        tabLayout.setupWithViewPager(viewPager)
    }
}

class MyAdapter(
    fm: FragmentManager,
    val titles: Array<String>,
    val fragmentList: ArrayList<TextFragment>
) : FragmentPagerAdapter(fm) {
    override fun getCount(): Int {
        return titles.size
    }

    override fun getItem(position: Int): Fragment {
        return fragmentList[position]
    }

    override fun getPageTitle(position: Int): CharSequence? {
        return titles[position]
    }
}
```



## 禁止水平滚动的ViewPager

```kotlin
class NoScrollViewPager(context: Context, attrs: AttributeSet? = null) : ViewPager(context, attrs) {

    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        return false
    }

    override fun onTouchEvent(ev: MotionEvent?): Boolean {
        return false
    }

    override fun executeKeyEvent(event: KeyEvent): Boolean {
        return false
    }
}
```



## ViewPager+Fragment懒加载（方式一）

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d3901ba9d634516b1ebf5d818f5b1cf.gif)

`setUserVisibleHint`方法判断Fragment是否对用户可见
`onActivityCreated`方法判断View是否被创建

**代码封装：**


```kotlin
abstract class LazyBaseFragment : BaseFragment() {
    //View是否创建
    private var isViewCreated = false

    //Fragment是否可见
    private var isVisibleToUser = false

    //是否加载数据
    private var isLoadData = false

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        isViewCreated = true
        prepareFetchData()
    }

    override fun setUserVisibleHint(isVisibleToUser: Boolean) {
        super.setUserVisibleHint(isVisibleToUser)
        this.isVisibleToUser = isVisibleToUser
        if (isVisibleToUser) {
            prepareFetchData()
        }
    }

    protected fun prepareFetchData() {
        prepareFetchData(false)
    }

    protected fun prepareFetchData(forceUpdate: Boolean) {
        if (isVisibleToUser && isViewCreated && (!isLoadData || forceUpdate)) {
            loadData()
            isLoadData = true
        }
    }

    abstract fun loadData()
}
```

**使用：**

```kotlin
class TestFragment : LazyBaseFragment() {
    private lateinit var description: TextView

    private var param1: String? = null

    companion object {
        private const val ARG_PARAM1 = "param1"

        @JvmStatic
        fun newInstance(param1: String) =
        TestFragment().apply {
            arguments = Bundle().apply {
                putString(ARG_PARAM1, param1)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_test, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        description = view.findViewById(R.id.description)
        description.setOnClickListener {
            prepareFetchData(true)
        }
    }

    override fun loadData() {
        description.text = "$param1 \n ${System.currentTimeMillis()}"
    }
}
```



## ViewPager+Fragment懒加载（方式二）

* FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT：表示只有当Fragment显示在屏幕上时才执行onResume()
* 可以将加载数据的方法放在onResume()中从而实现懒加载。

```kotlin
class NewLazyActivity : BaseActivity() {
    private lateinit var viewPager: ViewPager

    private val fragments = arrayOf<TextFragment>(
        TextFragment.newInstance("AAA"),
        TextFragment.newInstance("BBB"),
        TextFragment.newInstance("CCC"),
        TextFragment.newInstance("DDD"),
        TextFragment.newInstance("EEE"),
        TextFragment.newInstance("FFF")
    )

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, NewLazyActivity::class.java)
            intent.putExtra(KEY_TITLE, "ViewPager懒加载(新方案)")
            context.startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lazy)
        initView()

        viewPager.adapter = MyAdapter(
            supportFragmentManager,
            FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT,
            fragments
        )
        viewPager.offscreenPageLimit = fragments.size
    }

    private fun initView() {
        viewPager = findViewById(R.id.viewPager)
    }

    class MyAdapter(
        fm: FragmentManager,
        behavior: Int,
        private val fragments: Array<TextFragment>
    ) : FragmentPagerAdapter(fm, behavior) {
        override fun getCount(): Int {
            return fragments.size
        }

        override fun getItem(position: Int): Fragment {
            return fragments[position]
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/home/src/main/java/com/example/home/viewpager)

