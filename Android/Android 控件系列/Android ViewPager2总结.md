[TOC]

# ViewPager2总结



## 概述

ViewPager2是一个增强版的ViewPager，ViewPager2是基于RecyclerView+PagerSnapHelper实现的，解决了ViewPager的一些弊端，同时加入一些新特性。



## 常用API

```
//设置分页方向
setOrientation(@Orientation int orientation)

//定位指定页面
setCurrentItem(int item)  
setCurrentItem(int item, boolean smoothScroll)

//设置预加载页数
setOffscreenPageLimit(@OffscreenPageLimit int limit)

//禁止滑动
setUserInputEnabled(boolean enabled) 

//模拟滑动
beginFakeDrag()
fakeDragBy(float offsetPxFloat)
//停止模拟
endFakeDrag()


//全部刷新
notifyDataSetChanged();
//局部刷新
notifyItemChanged(int position)

//监听页面变化
registerOnPageChangeCallback(@NonNull OnPageChangeCallback callback)
//删除监听
unregisterOnPageChangeCallback(@NonNull OnPageChangeCallback callback) 
```



## ViewPager2基本使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/d7e8396906e24878a33eb6cb985ae3fa.gif)

```kotlin
class ViewPager2SimpleActivity : BaseActivity() {
    private lateinit var viewPager2: ViewPager2
    private lateinit var indicator: LinearLayout

    //图片资源
    private val mImgIds =
        intArrayOf(R.drawable.a, R.drawable.b, R.drawable.c, R.drawable.d, R.drawable.e)

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, ViewPager2SimpleActivity::class.java).apply {
                putExtra(KEY_TITLE, "ViewPager2基本使用")
            }
            context.startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_pager2_simple)
        initView()
        initViewPager2()
    }

    private fun initView() {
        viewPager2 = findViewById(R.id.viewPager2)
        indicator = findViewById(R.id.indicator)
    }

    private fun initViewPager2() {
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

        viewPager2.adapter = ViewPager2Adapter(this, mImgIds)
        //设置监听
        viewPager2.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageScrolled(
                position: Int,
                positionOffset: Float,
                positionOffsetPixels: Int
            ) {
                indicator.forEachIndexed { index, view ->
                    view.isSelected = index == position
                }
            }
        })
    }
}
```

```kotlin
class ViewPager2Adapter(private val context: Context, private val mImgIds: IntArray) :
    RecyclerView.Adapter<ViewPager2Adapter.MyViewHolder>() {

    private var inflater: LayoutInflater = LayoutInflater.from(context)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        return MyViewHolder(inflater.inflate(R.layout.item_image_view, parent, false))
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        holder.imageView.setImageResource(mImgIds[position])
    }

    override fun getItemCount(): Int {
        return mImgIds.size
    }

    class MyViewHolder(private val itemView: View) : RecyclerView.ViewHolder(itemView) {
        public val imageView: ImageView = itemView as ImageView
    }
}
```



## ViewPager2+TabLayout+Fragment

![在这里插入图片描述](https://img-blog.csdnimg.cn/7986f6ae7e454769b4ab6c852500dfd2.gif)

```kotlin
class TabActivity : BaseActivity() {
    private lateinit var tabLayout: TabLayout
    private lateinit var viewPager2: ViewPager2

    private val titles = arrayOf("one", "two", "three", "four", "five", "six", "seven", "eight")
    private val fragmentList = arrayListOf<TextFragment>().apply {
        titles.forEachIndexed { index, s ->
                               add(TextFragment.newInstance(s))
                              }
    }

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, TabActivity::class.java).apply {
                putExtra(KEY_TITLE, "ViewPager2+TabLayout+Fragment")
            }
            context.startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tab)
        initView()

        // offscreenPageLimit默认不开启预加载
        // offscreenPageLimit设置为1表示缓存前一页，预加载下一页，包含当前页一共三页
        viewPager2.offscreenPageLimit = 1
        viewPager2.adapter = TabAdapter(this, fragmentList)
        TabLayoutMediator(
            tabLayout,
            viewPager2,
            object : TabLayoutMediator.TabConfigurationStrategy {
                override fun onConfigureTab(tab: TabLayout.Tab, position: Int) {
                    tab.text = titles[position]
                }
            }
        ).attach()
    }

    private fun initView() {
        tabLayout = findViewById(R.id.tabLayout)
        viewPager2 = findViewById(R.id.viewPager2)
    }
}
```

```kotlin
class TabAdapter(
    fragmentActivity: FragmentActivity,
    private val fragmentList: ArrayList<TextFragment>
) : FragmentStateAdapter(fragmentActivity) {
    override fun getItemCount(): Int = fragmentList.size

    override fun createFragment(position: Int): Fragment {
        return fragmentList[position]
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/viewpager2)

