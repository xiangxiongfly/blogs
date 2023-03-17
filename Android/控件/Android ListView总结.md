[TOC]

# ListView总结

## 常用技巧

设置分割线：

```
android:divider="@color/black"
android:dividerHeight="1dp"
```

去除分割线：

```
android:divider="@null"
```

隐藏滚动条：

```
android:scrollbars="none"
```

取消点击效果：

```
android:listSelector="@android:color/transparent"
```

滚动至指定位置：

```
listView.setSelection(11);//指定item
```



## 常用适配器

| 适配器        | 说明                |
| ------------- | ------------------- |
| ArrayAdapter  | 只能显示文本信息    |
| SimpleAdapter | 用于绑定xml中的数据 |
| BaseAdapter   | 通用适配器          |



### ArrayAdapter

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9051105cd6a455883e51c236ea85694.png)

```kotlin
val datas = arrayOf(
    "yellow",
    "white",
    "black",
    "blue",
    "pink",
    "red",
    "orange",
    "green",
    "gray",
    "红",
    "绿",
    "蓝",
    "黑"
)
listView.adapter = ArrayAdapter(mContext, android.R.layout.simple_list_item_1, datas)
```



### SimpleAdapter

![在这里插入图片描述](https://img-blog.csdnimg.cn/873649898a10459ab2ed48a9c42c8484.png)

```kotlin
val names = arrayOf("苹果", "香蕉", "樱桃", "葡萄", "芒果")
val imgs = intArrayOf(
    R.drawable.apple_pic, R.drawable.banana_pic, R.drawable.cherry_pic,
    R.drawable.grape_pic, R.drawable.mango_pic
)
val datas = ArrayList<Map<String, Any>>()
for (i in names.indices) {
    val map = HashMap<String, Any>()
    map["name"] = names[i]
    map["img"] = imgs[i]
    datas.add(map)
}
listView.adapter = SimpleAdapter(
    mContext,
    datas,
    R.layout.item_simple,
    arrayOf("name", "img"),
    intArrayOf(R.id.name, R.id.img)
)
```



### BaseAdapter

![在这里插入图片描述](https://img-blog.csdnimg.cn/046b7bcdebb040d5b8aa8765777f6ba4.png)

```kotlin
/**
 * BaseAdapter优化
 * 复用ConvertView
 * 使用ViewHolder复用itemView的控件
 */
class MyAdapter(mContext: Context, private val mDatas: ArrayList<Fruit>) : BaseAdapter() {

    private val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun getCount(): Int = mDatas.size

    override fun getItemId(position: Int): Long = position.toLong()

    override fun getItem(position: Int): Fruit = mDatas[position]

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val viewHolder: ViewHolder
        val itemView: View
        if (convertView == null) {
            itemView = layoutInflater.inflate(R.layout.item_simple, null)
            val fruitImage: ImageView = itemView.findViewById(R.id.img)
            val fruitName: TextView = itemView.findViewById(R.id.name)
            viewHolder = ViewHolder(fruitImage, fruitName)
            itemView.tag = viewHolder
        } else {
            itemView = convertView
            viewHolder = itemView.tag as ViewHolder
        }
        val fruit = getItem(position)
        viewHolder.fruitImage.setImageResource(fruit.fruitImage)
        viewHolder.fruitName.text = fruit.fruitName
        return itemView
    }

    class ViewHolder(
        val fruitImage: ImageView,
        val fruitName: TextView
    )
}
```

```kotlin
listView.adapter = MyAdapter(mContext, datas)
```



## 添加头尾布局

```kotlin
val headerView = LayoutInflater.from(mContext).inflate(R.layout.layout_header, null)
val headerView2 = LayoutInflater.from(mContext).inflate(R.layout.layout_header2, null)
val footerView = LayoutInflater.from(mContext).inflate(R.layout.layout_footer, null)
listView.addHeaderView(headerView)
listView.addHeaderView(headerView2)
listView.addFooterView(footerView)
```

注意：第一个头布局放在第一个，第二个头布局放在第二个，添加头布局后，ListView点击item时的坐标发生变化。



## 局部刷新

```kotlin
fun changeItem(listView: ListView, position: Int) {
    val startPosition: Int = listView.headerViewsCount
    val endPosition: Int = listView.count - listView.footerViewsCount
    val firstVisiblePosition: Int = listView.firstVisiblePosition
    val lastVisiblePosition: Int = listView.lastVisiblePosition
    if (position >= startPosition && position < endPosition) {
        val realPosition = position - listView.headerViewsCount
        mDatas[realPosition].fruitName = "${mDatas[realPosition].fruitName} 被吃掉了"
        if (position >= firstVisiblePosition && position <= lastVisiblePosition) {
            val childView = listView.getChildAt(position - firstVisiblePosition)
            getView(realPosition, childView, listView)
        }
        Toast.makeText(mContext, mDatas[realPosition].fruitName, Toast.LENGTH_SHORT).show()
    }
}
```



## 多类型布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e0d4a47b68e456199773f364075464b.png)

**定义2套布局**

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left"
        android:background="@drawable/left_shape"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:padding="10dp">

        <ImageView
            android:id="@+id/img"
            android:layout_width="30dp"
            android:layout_height="30dp" />

        <TextView
            android:id="@+id/name"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />
    </LinearLayout>
</FrameLayout>
```

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:background="@drawable/right_shape"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:padding="10dp">

        <TextView
            android:id="@+id/name"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />

        <ImageView
            android:id="@+id/img"
            android:layout_width="30dp"
            android:layout_height="30dp" />
    </LinearLayout>
</FrameLayout>
```

**定义Adapter**

```kotlin
class MutilTypeAdapter(val mContext: Context, val mDatas: ArrayList<Any>) : BaseAdapter() {
    companion object {
        const val TYPE_LEFT = 0
        const val TYPE_RIGHT = 1
    }

    private val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun getCount(): Int = mDatas.size

    override fun getItemId(position: Int): Long = position.toLong()

    override fun getItem(position: Int): Any {
        return mDatas[position]
    }

    override fun getViewTypeCount(): Int {
        return 2
    }

    override fun getItemViewType(position: Int): Int {
        return if (mDatas[position] is LeftFruit) {
            TYPE_LEFT
        } else {
            TYPE_RIGHT
        }
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        var leftViewHolder: LeftViewHolder? = null
        var rightViewHolder: RightViewHolder? = null
        val itemView: View
        val type: Int = getItemViewType(position)

        if (convertView == null) {
            when (type) {
                TYPE_LEFT -> {
                    itemView = layoutInflater.inflate(R.layout.item_left_fruit, null)
                    val img: ImageView = itemView.findViewById(R.id.img)
                    val name: TextView = itemView.findViewById(R.id.name)
                    leftViewHolder = LeftViewHolder(name, img)
                    itemView.setTag(R.id.type_left, leftViewHolder)
                }
                else -> {
                    itemView = layoutInflater.inflate(R.layout.item_right_fruit, null)
                    val img: ImageView = itemView.findViewById(R.id.img)
                    val name: TextView = itemView.findViewById(R.id.name)
                    rightViewHolder = RightViewHolder(name, img)
                    itemView.setTag(R.id.type_right, rightViewHolder)
                }
            }
        } else {
            itemView = convertView
            when (type) {
                TYPE_LEFT -> {
                    leftViewHolder = itemView.getTag(R.id.type_left) as LeftViewHolder
                }
                else -> {
                    rightViewHolder = itemView.getTag(R.id.type_right) as RightViewHolder
                }
            }
        }

        val item: Any = getItem(position)
        when (type) {
            TYPE_LEFT -> {
                val leftFruit: LeftFruit = item as LeftFruit
                leftViewHolder!!.img.setImageResource(leftFruit.fruitImage)
                leftViewHolder.name.text = leftFruit.fruitName
            }
            TYPE_RIGHT -> {
                val rightFruit: RightFruit = item as RightFruit
                rightViewHolder!!.img.setImageResource(rightFruit.fruitImage)
                rightViewHolder.name.text = rightFruit.fruitName
            }
        }

        return itemView
    }

    class LeftViewHolder(
        val name: TextView,
        val img: ImageView
    )

    class RightViewHolder(
        val name: TextView,
        val img: ImageView
    )
}
```

**使用**

```kotlin
class LvMutilTypeActivity : BaseActivity() {
    private val mList = arrayListOf<Any>()
    private val mFruitImgs = FruitData.getFruitImage()
    private val mFruitNames = FruitData.getFruitName()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lv_mutil_type)
        val listView: ListView = findViewById(R.id.listView)
        initData()
        val mAdapter = MutilTypeAdapter(mContext, mList)
        listView.adapter = mAdapter
    }

    private fun initData() {
        val random = Random();
        for (i in 0..30) {
            val index = random.nextInt(mFruitImgs.size)
            val type = random.nextInt(2)
            mList.add(
                if (type == 1) {
                    LeftFruit(mFruitImgs[index], mFruitNames[index])
                } else {
                    RightFruit(mFruitImgs[index], mFruitNames[index])
                }
            )
        }
    }
}
```



## ListView+CheckBox

![在这里插入图片描述](https://img-blog.csdnimg.cn/a026e72246ba492f890287dc44018180.png)

**设计Bean类**

```kotlin
data class Fruit(
    var fruitImage: Int,
    var fruitName: String
) {
    var checked: Boolean = false
}
```

**设计itemView布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="center_vertical"
    android:orientation="horizontal"
    android:padding="10dp">

    <ImageView
        android:id="@+id/img"
        android:layout_width="30dp"
        android:layout_height="30dp" />

    <TextView
        android:id="@+id/name"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1" />

    <CheckBox
        android:id="@+id/checkBox"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

</LinearLayout>
```

**设计Adapter类**

```kotlin
class CheckBoxAdapter(val mContext: Context, val mList: ArrayList<Fruit>) : BaseAdapter() {

    private val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun getCount(): Int = mList.size

    override fun getItem(position: Int): Fruit = mList[position]

    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val viewHolder: ViewHolder
        val itemView: View
        if (convertView == null) {
            itemView = layoutInflater.inflate(R.layout.item_checkbox, null)
            val img = itemView.findViewById<ImageView>(R.id.img)
            val name = itemView.findViewById<TextView>(R.id.name)
            val checkBox = itemView.findViewById<CheckBox>(R.id.checkBox)
            viewHolder = ViewHolder(img, name, checkBox)
            itemView.tag = viewHolder
        } else {
            itemView = convertView
            viewHolder = itemView.tag as ViewHolder
        }
        val item: Fruit = getItem(position)
        viewHolder.img.setImageResource(item.fruitImage)
        viewHolder.name.text = item.fruitName
        viewHolder.checkBox.setOnCheckedChangeListener { buttonView, isChecked ->
                                                        item.checked = isChecked
                                                       }
        viewHolder.checkBox.isChecked = item.checked
        return itemView
    }

    class ViewHolder(
        val img: ImageView,
        val name: TextView,
        val checkBox: CheckBox
    )
}
```



## ScrollView+ListView

**重写ListView**

```kotlin
class MyListView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : ListView(context, attrs, defStyleAttr) {
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val expandSpec = MeasureSpec.makeMeasureSpec(
            Int.MAX_VALUE shr 2,
            MeasureSpec.AT_MOST
        )
        super.onMeasure(widthMeasureSpec, expandSpec)
    }
}
```



## ExpandableListView与CheckBox

![在这里插入图片描述](https://img-blog.csdnimg.cn/fa16f8e72a61483384f2cecb454d96df.png)

**取消Group上的箭头**

```xml
android:groupIndicator="@null"
```


**定义布局**

layout_group.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/title"
    android:layout_width="match_parent"
    android:layout_height="56dp"
    android:gravity="center_vertical"
    android:paddingLeft="30dp"
    android:text="title"
    android:textSize="20sp"
    android:textStyle="bold" />
```

layout_child.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="center_vertical"
    android:orientation="horizontal"
    android:padding="5dp">

    <CheckBox
        android:id="@+id/checkBox"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginLeft="10dp" />

    <TextView
        android:id="@+id/tv_child"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="姓名"
        android:textSize="18sp" />
</LinearLayout>
```

**定义实体类**

```kotlin
data class Group(val title: String)

data class Child(val text: String) {
    var selected: Boolean = false
}
```

**定义Adapter类**

```kotlin
class ExpandableAdapter(
    val mContext: Context,
    private val mGroupList: ArrayList<Group>,
    private val mChildList: ArrayList<ArrayList<Child>>
) : BaseExpandableListAdapter() {

    private val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun getGroupCount(): Int = mGroupList.size

    override fun getChildrenCount(groupPosition: Int): Int = mChildList[groupPosition].size

    override fun getGroup(groupPosition: Int): Group = mGroupList[groupPosition]

    override fun getChild(groupPosition: Int, childPosition: Int): Child =
    	mChildList[groupPosition][childPosition]

    override fun getGroupId(groupPosition: Int): Long = groupPosition.toLong()

    override fun getChildId(groupPosition: Int, childPosition: Int): Long = 
    	childPosition.toLong()

    override fun hasStableIds(): Boolean = true

    override fun isChildSelectable(groupPosition: Int, childPosition: Int): Boolean = true

    override fun getGroupView(
        groupPosition: Int,
        isExpanded: Boolean,
        convertView: View?,
        parent: ViewGroup?
    ): View {
        val groupView: View
        val groupViewHolder: GroupViewHolder
        if (convertView == null) {
            groupView = layoutInflater.inflate(R.layout.layout_group, parent, false)
            val title = groupView.findViewById<TextView>(R.id.title)
            groupViewHolder = GroupViewHolder(title)
            groupView.tag = groupViewHolder
        } else {
            groupView = convertView
            groupViewHolder = groupView.tag as GroupViewHolder
        }
        val item = getGroup(groupPosition)
        groupViewHolder.title.text = item.title
        return groupView
    }

    override fun getChildView(
        groupPosition: Int,
        childPosition: Int,
        isLastChild: Boolean,
        convertView: View?,
        parent: ViewGroup?
    ): View {
        val childView: View
        val childViewHolder: ChildViewHolder
        if (convertView == null) {
            childView = layoutInflater.inflate(R.layout.layout_child, parent, false)
            val text = childView.findViewById<TextView>(R.id.text)
            val checkBox = childView.findViewById<CheckBox>(R.id.checkBox)
            childViewHolder = ChildViewHolder(text, checkBox)
            childView.tag = childViewHolder
        } else {
            childView = convertView
            childViewHolder = childView.tag as ChildViewHolder
        }
        val item = getChild(groupPosition, childPosition)
        childViewHolder.text.text = item.text
        childViewHolder.checkBox.setOnCheckedChangeListener { buttonView, isChecked ->
                                                             item.selected = isChecked
                                                            }
        childViewHolder.checkBox.isChecked = item.selected
        return childView
    }

    class GroupViewHolder(val title: TextView)

    class ChildViewHolder(val text: TextView, val checkBox: CheckBox)
}
```

**使用**

```kotlin
class ExpandableListViewActivity : BaseActivity() {
    private lateinit var expandableListView: ExpandableListView

    private val groupList = arrayListOf<Group>()
    private val childList = arrayListOf<ArrayList<Child>>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_expandable_list_view)
        initView()
        initData()
        initExpandableListView()
    }

    private fun initView() {
        expandableListView = findViewById(R.id.expandableListView)
    }

    private fun initData() {
        groupList.add(Group("西游记"))
        childList.add(arrayListOf<Child>().apply {
            add(Child("唐僧"))
            add(Child("孙悟空"))
            add(Child("猪八戒"))
            add(Child("沙和尚"))
        })

        groupList.add(Group("三国演义"))
        childList.add(arrayListOf<Child>().apply {
            add(Child("刘备"))
            add(Child("关羽"))
            add(Child("赵云"))
            add(Child("张飞"))
            add(Child("马超"))
        })

        groupList.add(Group("水浒传"))
        childList.add(arrayListOf<Child>().apply {
            add(Child("宋江"))
            add(Child("武松"))
            add(Child("吴用"))
            add(Child("鲁智深"))
            add(Child("西门庆"))
            add(Child("潘金莲"))
        })

        groupList.add(Group("红楼梦"))
        childList.add(arrayListOf<Child>().apply {
            add(Child("贾宝玉"))
            add(Child("林黛玉"))
            add(Child("王熙凤"))
        })

        groupList.add(Group("颜色"))
        childList.add(arrayListOf<Child>().apply {
            add(Child("红"))
            add(Child("黄"))
            add(Child("蓝"))
            add(Child("绿"))
            add(Child("青"))
            add(Child("橙"))
            add(Child("紫"))
        })
    }

    private fun initExpandableListView() {
        val mAdapter = ExpandableAdapter(mContext, groupList, childList)
        expandableListView.setAdapter(mAdapter)
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/listview)

