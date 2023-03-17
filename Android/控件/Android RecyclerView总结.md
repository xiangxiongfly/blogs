[TOC]

# RecyclerView总结

## 概述

RecyclerView 可以让您轻松高效地显示大量数据。您提供数据并定义每个列表项的外观，而 RecyclerView 库会根据需要动态创建元素。优化了ListView的不足之处，更加强大和灵活。



## 简单使用

### 线性布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/b0fa8a581a6d491ca7a0e470e2b7de9a.png)

**XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.recyclerview.widget.RecyclerView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".recyclerview.simple.LinearActivity" />
```

**实现Adapter类**

```kotlin
class FruitAdapter(val mContext: Context, private val mList: ArrayList<Fruit>) :
    RecyclerView.Adapter<FruitAdapter.ViewHolder>() {

    private val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = layoutInflater.inflate(R.layout.item_fruit, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.img.setImageResource(mList[position].fruitImage)
        holder.name.text = mList[position].fruitName
    }

    override fun getItemCount(): Int = mList.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val img: ImageView
        val name: TextView

        init {
            img = itemView.findViewById(R.id.fruit_img)
            name = itemView.findViewById(R.id.fruit_name)
        }
    }
}
```

**使用**

```kotlin
val mAdapter = FruitAdapter(mContext, mList)
//垂直布局
recyclerView.layoutManager = LinearLayoutManager(mContext)
//如果itemView的高度都一致可以设置为true，性能优化
recyclerView.setHasFixedSize(true)
recyclerView.adapter = mAdapter
```

```kotlin
//设置水平布局布局
recyclerView.layoutManager = LinearLayoutManager(mContext, LinearLayoutManager.HORIZONTAL, false)
```



### 网格布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/7d38850422b349a8bd159435a2cc55d1.png)

RecyclerView使用网格样式只需要设置`GridLayoutManager`即可。

```kotlin
recyclerView.layoutManager = GridLayoutManager(mContext, 2)
```



### 瀑布流布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/2a4c24a3aa0041ab8a83c018260ac725.png)

RecyclerView使用瀑布流样式只需要设置`StaggeredGridLayoutManager`即可。

```kotlin
recyclerView.layoutManager =
	StaggeredGridLayoutManager(3, StaggeredGridLayoutManager.VERTICAL)
```



## 多类型布局

![在这里插入图片描述](https://img-blog.csdnimg.cn/5866483d45f24a2daa5096804339219a.png)

**设计Adapter类**

```kotlin
class MutilTypeAdapter(val mContext: Context, val mList: ArrayList<Any>) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        const val TYPE_LEFT = 0
        const val TYPE_RIGHT = 1
    }

    val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    override fun getItemViewType(position: Int): Int {
        return if (mList[position] is LeftFruit) {
            TYPE_LEFT
        } else {
            TYPE_RIGHT
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == TYPE_LEFT) {
            val itemView = layoutInflater.inflate(R.layout.item_left_fruit, parent, false)
            LeftViewHolder(itemView)
        } else {
            val itemView = layoutInflater.inflate(R.layout.item_right_fruit, parent, false)
            RightViewHolder(itemView)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        if (holder is LeftViewHolder) {
            val leftFruit = mList[position] as LeftFruit
            holder.fruitImg.setImageResource(leftFruit.fruitImage)
            holder.fruitName.text = leftFruit.fruitName
        } else if (holder is RightViewHolder) {
            val rightFruit = mList[position] as RightFruit
            holder.fruitImg.setImageResource(rightFruit.fruitImage)
            holder.fruitName.text = rightFruit.fruitName
        }
    }

    override fun getItemCount(): Int = mList.size

    class LeftViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val fruitImg: ImageView = itemView.findViewById(R.id.fruit_img)
        val fruitName: TextView = itemView.findViewById(R.id.fruit_name)
    }

    class RightViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val fruitImg: ImageView = itemView.findViewById(R.id.fruit_img)
        val fruitName: TextView = itemView.findViewById(R.id.fruit_name)
    }
}
```

**使用**

```kotlin
class RvMutilTypeActivity : BaseActivity() {
    private lateinit var recyclerView: RecyclerView

    private val mList = arrayListOf<Any>()
    private val mFruitImgs = FruitData.getFruitImage()
    private val mFruitNames = FruitData.getFruitName()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rv_mutil_type)
        initView()
        initData()
        initRv()
    }

    private fun initView() {
        recyclerView = findViewById(R.id.recyclerView)
    }

    private fun initData() {
        val random = Random()
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

    private fun initRv() {
        recyclerView.addItemDecoration(
            DividerItemDecoration(
                mContext,
                DividerItemDecoration.VERTICAL
            )
        )
        recyclerView.adapter = MutilTypeAdapter(mContext, mList)
    }
}
```



## 添加分割线

### ItemDecoration类介绍

RecyclerView中的分割线通继承`RecyclerView.ItemDecoration`类实现，`ItemDecoration`中有3个方法：

- getItemOffsets(): 设置itemView的偏移量。
- onDraw(): 通过Canvas绘制分割线内容，ItemDecoration的`onDraw()`早于itemView的`onDraw()`执行。
- onDrawOver(): 与`onDraw()`类似，在itemView的`onDraw()`之后执行。



### 添加默认分割线

```kotlin
recyclerView.addItemDecoration(
    DividerItemDecoration(
        mContext,
        DividerItemDecoration.VERTICAL
    )
)
```



### 添加自定义分割线

#### 线性布局中的分割线

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c4bb8f730df4db596695d78a751d57f.png)

**定义分割线类**

```java
public class LinearItemDecoration extends RecyclerView.ItemDecoration {
    public static final int HORIZONTAL_LIST = RecyclerView.HORIZONTAL;
    public static final int VERTICAL_LIST = RecyclerView.VERTICAL;

    //RecyclerView布局方向
    private int mOrientation = VERTICAL_LIST;
    //分割线尺寸
    private int mDividerSize = 1;
    //Drawable分割线
    private final Drawable mDivider;

    /**
     * 添加分割线方式一
     *
     * @param context     Context
     * @param orientation 方向
     * @param drawableId  Drawable图片
     */
    public LinearItemDecoration(Context context, int orientation, @DrawableRes int drawableId) {
        mOrientation = orientation;
        mDivider = ContextCompat.getDrawable(context, drawableId);
        mDividerSize = mDivider.getIntrinsicHeight();
    }

    /**
     * 添加分割线方式二
     *
     * @param orientation  方向
     * @param dividerColor 分割线颜色
     * @param dividerSize  分割线尺寸
     */
    public LinearItemDecoration(int orientation, int dividerColor, int dividerSize) {
        mOrientation = orientation;
        mDivider = new ColorDrawable(dividerColor);
        mDividerSize = dividerSize;
    }

    /**
     * 设置分割线大小
     */
    @Override
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        if (mOrientation == VERTICAL_LIST) {
            outRect.set(0, 0, 0, mDividerSize);
        } else {
            outRect.set(0, 0, mDividerSize, 0);
        }
    }

    /**
     * 绘制分割线
     */
    @Override
    public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        if (mOrientation == VERTICAL_LIST) {
            drawVertical(c, parent);
        } else {
            drawHorizontal(c, parent);
        }
    }

    /**
     * 垂直方向分割线绘制
     */
    private void drawVertical(@NonNull Canvas canvas, @NonNull RecyclerView parent) {
        final int left = parent.getPaddingLeft();
        final int right = parent.getMeasuredWidth() - parent.getPaddingRight();
        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount - 1; i++) { //最后一条不显示
            final View childView = parent.getChildAt(i);
            RecyclerView.LayoutParams layoutParams = (RecyclerView.LayoutParams) childView.getLayoutParams();
            final int top = childView.getBottom() + layoutParams.bottomMargin;
            final int bottom = top + mDividerSize;
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(canvas);
        }
    }

    /**
     * 水平方向分割线绘制
     */
    private void drawHorizontal(@NonNull Canvas canvas, @NonNull RecyclerView parent) {
        final int top = parent.getPaddingTop();
        final int bottom = parent.getMeasuredHeight() - parent.getPaddingBottom();
        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount - 1; i++) { //最后一条不显示
            final View childView = parent.getChildAt(i);
            RecyclerView.LayoutParams layoutParams = (RecyclerView.LayoutParams) childView.getLayoutParams();
            final int left = childView.getRight() + layoutParams.rightMargin;
            final int right = left + mDividerSize;
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(canvas);
        }
    }
}
```

**使用**

```kotlin
//使用方式一
recyclerView.addItemDecoration(
    LinearItemDecoration(
        LinearItemDecoration.VERTICAL_LIST,
        Color.RED,
        1.dp
    )
)
```

```kotlin
//使用方式二
recyclerView.addItemDecoration(
    LinearItemDecoration(
        mContext,
        LinearItemDecoration.VERTICAL_LIST,
        R.drawable.divider_red_shape
    )
)
```



#### 网格布局中的分割线

**定义分割线类**

![在这里插入图片描述](https://img-blog.csdnimg.cn/ef1fcfd2ca2e40a98ae7e93034df722b.png)

```java
public class GridItemDecoration extends RecyclerView.ItemDecoration {
    //Drawable分割线
    private Drawable mDivider;
    private final int mDividerWidthSize;
    private final int mDividerHeightSize;

    /**
     * 添加分割线方式一
     *
     * @param color       分割线颜色
     * @param dividerSize 分割线尺寸
     */
    public GridItemDecoration(int color, int dividerSize) {
        mDividerWidthSize = dividerSize;
        mDividerHeightSize = dividerSize;
        ColorDrawable shapeDrawable = new ColorDrawable(color);
        mDivider = shapeDrawable;
    }

    public GridItemDecoration(Context context, @DrawableRes int drawableId) {
        mDivider = ContextCompat.getDrawable(context, drawableId);
        mDividerHeightSize = mDivider.getIntrinsicHeight();
        mDividerWidthSize = mDivider.getIntrinsicWidth();
    }

    /**
     * 获取RecyclerView列数
     */
    private int getSpanCount(RecyclerView parent) {
        int spanCount;
        GridLayoutManager layoutManager = (GridLayoutManager) parent.getLayoutManager();
        spanCount = layoutManager.getSpanCount();
        return spanCount;
    }

    /**
     * 设置分割线大小
     */
    @Override
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        int spanCount = getSpanCount(parent);
        int childCount = parent.getAdapter().getItemCount();
        int position = parent.getChildAdapterPosition(view);
        if (isLastRow(parent, position, spanCount, childCount)) {
            //最后一行不绘制底部
            outRect.set(0, 0, mDividerWidthSize, 0);
        } else if (isLastColumn(parent, position, spanCount, childCount)) {
            //最后一列不绘制右边
            outRect.set(0, 0, 0, mDividerHeightSize);
        } else {
            outRect.set(0, 0, mDividerWidthSize, mDividerHeightSize);
        }
    }

    /**
     * 是否最后一列
     */
    private boolean isLastColumn(RecyclerView parent, int position, int spanCount, int childCount) {
        if ((position + 1) % spanCount == 0) { //最后一列不需要绘制右边
            return true;
        }
        return false;
    }

    /**
     * 是否最后一行
     */
    private boolean isLastRow(RecyclerView parent, int position, int spanCount, int childCount) {
        childCount = childCount - childCount % spanCount;
        if (position >= childCount) { //最后一行不需要绘制底部
            return true;
        }
        return false;
    }

    /**
     * 绘制分割线
     */
    @Override
    public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        drawHorizontal(c, parent);
        drawVertical(c, parent);
    }

    /**
     * 绘制垂直分割线
     */
    private void drawVertical(@NonNull Canvas canvas, @NonNull RecyclerView parent) {
        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View childView = parent.getChildAt(i);
            RecyclerView.LayoutParams layoutParams = (RecyclerView.LayoutParams) childView.getLayoutParams();
            final int left = childView.getRight() + layoutParams.rightMargin;
            final int right = left + mDividerWidthSize;
            final int top = childView.getTop() - layoutParams.topMargin;
            final int bottom = childView.getBottom() + layoutParams.bottomMargin;
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(canvas);
        }
    }

    /**
     * 绘制水平分割线
     */
    private void drawHorizontal(@NonNull Canvas canvas, @NonNull RecyclerView parent) {
        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View childView = parent.getChildAt(i);
            RecyclerView.LayoutParams layoutParams = (RecyclerView.LayoutParams) childView.getLayoutParams();
            final int left = childView.getLeft() - layoutParams.leftMargin;
            final int right = childView.getRight() + layoutParams.rightMargin + mDividerWidthSize;
            final int top = childView.getBottom() + layoutParams.bottomMargin;
            final int bottom = top + mDividerHeightSize;
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(canvas);
        }
    }
}
```

**使用**

```kotlin
//方式一
recyclerView.addItemDecoration(GridItemDecoration(Color.RED, 1.dp))
```

```kotlin
//方式二 
recyclerView.addItemDecoration(GridItemDecoration(mContext, R.drawable.divider_red_shape))
```



## 设置点击事件

**定义接口**

```kotlin
private var mOnItemClickListener: OnItemClickListener? = null

interface OnItemClickListener {
    fun onUpdate(position: Int)
    fun onDelete(position: Int)
}

fun setOnItemClickListener(listener: OnItemClickListener) {
    mOnItemClickListener = listener
}
```

**在Adapter中处理**

```kotlin
override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
    val itemView = layoutInflater.inflate(R.layout.item_fruit_add_delete, parent, false)
    val viewHolder = ViewHolder(itemView)
    viewHolder.update.setOnClickListener {
        mOnItemClickListener?.onUpdate(viewHolder.adapterPosition)
    }
    viewHolder.delete.setOnClickListener {
        mOnItemClickListener?.onDelete(viewHolder.adapterPosition)
    }
    return viewHolder
}
```



## 增删改操作

```java
//插入数据
notifyItemInserted(int position) //插入单条
notifyItemRangeInserted(int positionStart, int itemCount) //插入多条

//删除数据
notifyItemRemoved(int position) //删除单挑    
notifyItemRangeRemoved(int positionStart, int itemCount) //删除多条
   
//修改数据
notifyItemChanged(int position) //刷新单挑    
notifyItemRangeChanged(int positionStart, int itemCount) //刷新多条

//全部更新
notifyDataSetChanged()    
```

**使用**

```kotlin
class FruitAdapter2(val mContext: Context, private val mList: ArrayList<Fruit>) :
	RecyclerView.Adapter<FruitAdapter2.ViewHolder>() {

    fun add(position: Int, fruit: Fruit) {
        mList.add(0, fruit)
        notifyItemInserted(position)
    }

    fun addRange(position: Int, fruits: ArrayList<Fruit>) {
        mList.addAll(position, fruits)
        notifyItemRangeInserted(position, fruits.size)
    }

    fun delete(position: Int) {
        mList.removeAt(position)
        notifyItemRemoved(position)
    }

    fun deleteRange(position: Int, count: Int) {
        val tmpList = arrayListOf<Fruit>()
        for (i in position until position + count) {
            tmpList.add(mList[i])
        }
        mList.removeAll(tmpList)
        notifyItemRangeRemoved(position, count)
    }

    fun update(position: Int) {
        mList[position].fruitName = "修改了$position"
        notifyItemChanged(position)
    }

    fun updateRange(position: Int, count: Int) {
        for (i in position until position + count) {
            mList[i].fruitName = "修改了$i"
        }
        notifyItemRangeChanged(position, count)
    }
}
```



## DiffUtil的使用

RecyclerView提供`notifyDataSetChanged()`用于整体刷新，提供`notifyItemXXX()`用于局部刷新。

DiffUtil可以配合RecyclerView使用，会自动帮我们比较两个数据源，并刷新适配器，

**定义DiffUtil类**

```kotlin
public class AdapterDiffCallback extends DiffUtil.Callback {
    private ArrayList<User> mOldList;
    private ArrayList<User> mNewList;

    public AdapterDiffCallback(ArrayList<User> oldList, ArrayList<User> newList) {
        mOldList = oldList;
        mNewList = newList;
    }

    @Override
    public int getOldListSize() {
        return mOldList.size();
    }

    @Override
    public int getNewListSize() {
        return mNewList.size();
    }

    /**
     * 判断是否同一个item
     */
    @Override
    public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
        return mOldList.get(oldItemPosition).getId() == mNewList.get(newItemPosition).getId();
    }

    /**
     * 比较两个item的内容是否相同
     */
    @Override
    public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
        String oldName = mOldList.get(oldItemPosition).getName();
        String oldAddress = mOldList.get(oldItemPosition).getAddress();
        int oldAge = mOldList.get(oldItemPosition).getAge();

        String newName = mNewList.get(newItemPosition).getName();
        String newAddress = mNewList.get(newItemPosition).getAddress();
        int newAge = mNewList.get(newItemPosition).getAge();

        return oldAddress.equals(newAddress) && oldName.equals(newName) && oldAge == newAge;
    }
}
```

**定义Adapter类**

```kotlin
class UserAdapter(val mContext: Context, private var mList: ArrayList<User>) :
	RecyclerView.Adapter<UserAdapter.ViewHolder>() {

    val layoutInflater: LayoutInflater = LayoutInflater.from(mContext)

    fun setData(newList: ArrayList<User>) {
        mList.clear()
        mList.addAll(newList)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = layoutInflater.inflate(R.layout.item_user, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.id.text = mList[position].id.toString()
        holder.name.text = mList[position].name
        holder.age.text = mList[position].age.toString()
        holder.address.text = mList[position].address
    }

    override fun getItemCount(): Int = mList.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val id: TextView = itemView.findViewById(R.id.id)
        val name: TextView = itemView.findViewById(R.id.name)
        val age: TextView = itemView.findViewById(R.id.age)
        val address: TextView = itemView.findViewById(R.id.address)
    }
}
```

**使用**

```kotlin
val newList = ArrayList<User>()
for (item in mList) {
    newList.add(item.copy())
}
newList.removeFirst()
newList.removeLast()
newList[1].address = "修改了1"
newList[10].address = "修改了10"
val result: DiffUtil.DiffResult =
DiffUtil.calculateDiff(MyDiffUtilCallback(mList, newList), true)
result.dispatchUpdatesTo(mAdapter)
mAdapter.setData(newList)
```



## 拖拽排序和侧滑删除

![在这里插入图片描述](https://img-blog.csdnimg.cn/994e89978be444368d3d9499588303a7.gif)

```kotlin
val helper = ItemTouchHelper(
    object : ItemTouchHelper.Callback() {
        override fun getMovementFlags(
            recyclerView: RecyclerView,
            viewHolder: RecyclerView.ViewHolder
        ): Int {
            //侧滑删除
            val swipeFlags = ItemTouchHelper.LEFT or ItemTouchHelper.RIGHT
            //拖拽
            val dragFlags =
                ItemTouchHelper.UP or ItemTouchHelper.DOWN or ItemTouchHelper.LEFT or ItemTouchHelper.RIGHT
            return makeMovementFlags(dragFlags, swipeFlags)
        }

        //拖拽事件
        override fun onMove(
            recyclerView: RecyclerView,
            viewHolder: RecyclerView.ViewHolder,
            target: RecyclerView.ViewHolder
        ): Boolean {
            Collections.swap(mFruitList, viewHolder.adapterPosition, target.adapterPosition)
            mAdapter.notifyItemMoved(viewHolder.adapterPosition, target.adapterPosition)
            return false
        }

        //侧滑事件
        override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
            mFruitList.removeAt(viewHolder.adapterPosition)
            mAdapter.notifyItemRemoved(viewHolder.adapterPosition)
        }

        //是否拖拽
        override fun isLongPressDragEnabled(): Boolean {
            return true
        }
    }
)
//绑定
helper.attachToRecyclerView(recyclerView)
```



























## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/recyclerview)

