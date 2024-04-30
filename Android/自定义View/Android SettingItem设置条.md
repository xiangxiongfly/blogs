[TOC]

# Android 自定义View之Settingitem

自定义设置条。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ca035fa92a224f3ab2178ab87fcbfb76.png)



## 代码

### 定义属性

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- 设置item -->
    <declare-styleable name="SettingItem">
        <!-- 左边 -->
        <attr name="item_leftText" format="string" />
        <attr name="item_leftTextColor" format="color" />
        <attr name="item_leftTextSize" format="dimension" />
        <attr name="item_leftDrawable" format="reference" />
        <attr name="item_leftDrawablePadding" format="dimension" />
        <attr name="item_leftDrawableSize" format="dimension" />
        <!-- 右边 -->
        <attr name="item_rightText" format="string" />
        <attr name="item_rightTextColor" format="color" />
        <attr name="item_rightTextSize" format="dimension" />
        <attr name="item_rightDrawable" format="reference" />
        <attr name="item_rightDrawablePadding" format="dimension" />
        <attr name="item_rightDrawableSize" format="dimension" />
        <!-- 分割线 -->
        <attr name="item_lineVisible" format="boolean" />
        <attr name="item_lineDrawable" format="color|reference" />
        <attr name="item_lineWidth" format="dimension" />
        <attr name="item_lineMargin" format="dimension" />
    </declare-styleable>
</resources>
```

### 定义SettingItem

```kotlin
class SettingItem @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, @AttrRes defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    companion object {
        val DEFAULT_TEXT_SIZE = sp2px(14)
        val DEFAULT_TEXT_COLOR = Color.parseColor("#99000000")
        const val DEFAULT_DRAWABLE_SIZE = 0
        val DEFAULT_DRAWABLE_PADDING = dp2px(0)
        const val DEFAULT_LINE_WIDTH = 1
        val DEFAULT_LINE_COLOR = Color.parseColor("#0D000000")
    }

    private val mContainerLayout by lazy {
        LinearLayout(context).apply {
            layoutParams =
                FrameLayout.LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.WRAP_CONTENT,
                    Gravity.CENTER_VERTICAL
                )
        }
    }

    private val mLeftTextView by lazy {
        TextView(context).apply {
            val leftLayoutParams =
                LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1F)
            leftLayoutParams.gravity = Gravity.CENTER_VERTICAL
            layoutParams = leftLayoutParams
            isSingleLine = true
            ellipsize = TextUtils.TruncateAt.END
            setPaddingRelative(dp2px(15), dp2px(12), dp2px(15), dp2px(12))
            gravity = Gravity.START or Gravity.CENTER_VERTICAL
        }
    }

    private val mRightTextView by lazy {
        TextView(context).apply {
            val rightLayoutParams =
                LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
            rightLayoutParams.gravity = Gravity.CENTER_VERTICAL
            layoutParams = rightLayoutParams
            isSingleLine = true
            ellipsize = TextUtils.TruncateAt.END
            setPaddingRelative(dp2px(15), dp2px(12), dp2px(15), dp2px(12))
            gravity = Gravity.END or Gravity.CENTER_VERTICAL
        }
    }

    private val mLineView by lazy {
        View(context).apply {
            layoutParams = FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, 1, Gravity.BOTTOM)
        }
    }

    init {
        val a = context.obtainStyledAttributes(attrs, R.styleable.SettingItem)

        // 设置左边
        mLeftTextView.apply {
            // 设置左边文本
            if (a.hasValue(R.styleable.SettingItem_item_leftText)) {
                text = a.getString(R.styleable.SettingItem_item_leftText)
            }
            // 设置左边文字大小
            val leftTextSize =
                a.getDimensionPixelSize(
                    R.styleable.SettingItem_item_leftTextSize,
                    DEFAULT_TEXT_SIZE
                ).toFloat()
            setTextSize(TypedValue.COMPLEX_UNIT_PX, leftTextSize)
            // 设置左边文字颜色
            val leftTextColor =
                a.getColor(R.styleable.SettingItem_item_leftTextColor, DEFAULT_TEXT_COLOR)
            setTextColor(leftTextColor)
            // 设置左边图片
            val leftDrawable = a.getDrawable(R.styleable.SettingItem_item_leftDrawable)
//            setCompoundDrawablesWithIntrinsicBounds(leftDrawable, null, null, null)
            // 设置左边图片大小
            val leftDrawableSize = a.getDimensionPixelSize(
                R.styleable.SettingItem_item_leftDrawableSize,
                DEFAULT_DRAWABLE_SIZE
            )
            if (leftDrawable != null) {
                if (leftDrawableSize > 0) {
                    leftDrawable.setBounds(0, 0, leftDrawableSize, leftDrawableSize)
                } else {
                    leftDrawable.setBounds(
                        0,
                        0,
                        leftDrawable.intrinsicWidth,
                        leftDrawable.intrinsicHeight
                    )
                }
                mLeftTextView.setCompoundDrawables(leftDrawable, null, null, null)
            }
            // 设置左边文字和图片之间的间距
            val leftDrawablePadding = a.getDimensionPixelSize(
                R.styleable.SettingItem_item_leftDrawablePadding,
                DEFAULT_DRAWABLE_PADDING
            )
            compoundDrawablePadding = leftDrawablePadding
        }

        // 设置右边
        mRightTextView.apply {
            // 设置右边文本
            if (a.hasValue(R.styleable.SettingItem_item_rightText)) {
                text = a.getString(R.styleable.SettingItem_item_rightText)
            }
            // 设置右边文字大小
            val rightTextSize =
                a.getDimensionPixelSize(
                    R.styleable.SettingItem_item_rightTextSize,
                    DEFAULT_TEXT_SIZE
                ).toFloat()
            setTextSize(TypedValue.COMPLEX_UNIT_PX, rightTextSize)
            // 设置右边文字颜色
            val rightTextColor =
                a.getColor(R.styleable.SettingItem_item_rightTextColor, DEFAULT_TEXT_COLOR)
            setTextColor(rightTextColor)
            // 设置右边图片
            val rightDrawable = a.getDrawable(R.styleable.SettingItem_item_rightDrawable)
            setCompoundDrawablesWithIntrinsicBounds(rightDrawable, null, null, null)
            // 设置右边图片大小
            val rightDrawableSize = a.getDimensionPixelSize(
                R.styleable.SettingItem_item_rightDrawableSize,
                DEFAULT_DRAWABLE_SIZE
            )
            if (rightDrawable != null) {
                if (rightDrawableSize > 0) {
                    rightDrawable.setBounds(0, 0, rightDrawableSize, rightDrawableSize)
                } else {
                    rightDrawable.setBounds(
                        0,
                        0,
                        rightDrawable.intrinsicWidth,
                        rightDrawable.intrinsicHeight
                    )
                }
                mRightTextView.setCompoundDrawables(null, null, rightDrawable, null)
            }
            // 设置右边文字和图片之间的间距
            val rightDrawablePadding = a.getDimensionPixelSize(
                R.styleable.SettingItem_item_rightDrawablePadding,
                DEFAULT_DRAWABLE_PADDING
            )
            compoundDrawablePadding = rightDrawablePadding
        }

        // 设置下划线
        mLineView.apply {
            // 设置是否显示下划线
            val visible = a.getBoolean(R.styleable.SettingItem_item_lineVisible, false)
            visibility = if (visible) View.VISIBLE else View.GONE
            val params = layoutParams as FrameLayout.LayoutParams
            // 设置下划线宽度
            val lineWidth =
                a.getDimensionPixelSize(R.styleable.SettingItem_item_lineWidth, DEFAULT_LINE_WIDTH)
            params.height = lineWidth
            // 设置下换线左右边距
            val lineMargin = a.getDimensionPixelSize(R.styleable.SettingItem_item_lineMargin, 0)
            params.leftMargin = lineMargin
            params.rightMargin = lineMargin
            layoutParams = params
            // 设置下划线颜色
            mLineView.background =
                if (a.hasValue(R.styleable.SettingItem_item_lineDrawable)) {
                    a.getDrawable(R.styleable.SettingItem_item_lineDrawable)
                } else {
                    ColorDrawable(Color.parseColor("#FFECECEC"))
                }
        }

        if (background == null) {
            val drawable = StateListDrawable()
            drawable.addState(
                intArrayOf(android.R.attr.state_pressed),
                ColorDrawable(DEFAULT_LINE_COLOR)
            )
            drawable.addState(
                intArrayOf(android.R.attr.state_selected),
                ColorDrawable(DEFAULT_LINE_COLOR)
            )
            drawable.addState(
                intArrayOf(android.R.attr.state_focused),
                ColorDrawable(DEFAULT_LINE_COLOR)
            )
            drawable.addState(
                intArrayOf(),
                ColorDrawable(ContextCompat.getColor(getContext(), R.color.white))
            )
            background = drawable

            // 必须要设置可点击，否则点击屏幕任何角落都会触发按压事件
            isFocusable = true
            isClickable = true
        }

        a.recycle()

        mContainerLayout.addView(mLeftTextView)
        mContainerLayout.addView(mRightTextView)

        addView(mContainerLayout, 0)
        addView(mLineView, 1)
    }
}
```



## 使用

**方式一：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/66ad51452fce40e8be61b86e90860a4b.png)

```xml
<com.example.tools.setting_item.layout.SettingItem
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="15dp"
    app:item_leftDrawable="@drawable/ic_arrows_left"
    app:item_leftText="设置1"
    app:item_rightDrawable="@drawable/ic_arrows_right"
    app:item_rightText="设置2" />
```

**方式二：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/a8db3fbf815b48249e4ee5eef47c8674.png)

```xml
    <com.example.tools.setting_item.layout.SettingItem
        android:id="@+id/setting_about"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="15dp"
        app:item_leftText="关于我们"
        app:item_lineMargin="15dp"
        app:item_lineVisible="true"
        app:item_lineWidth="2dp"
        app:item_rightDrawable="@drawable/ic_arrows_right" />

    <com.example.tools.setting_item.layout.SettingItem
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:item_leftText="关于我们2"
        app:item_rightDrawable="@drawable/ic_arrows_right" />
```

**方式三：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/3a2b1ffbc8d44525aff4e08eae1546af.png)

```xml
<com.example.tools.setting_item.layout.SettingItem
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="15dp"
    app:item_leftDrawable="@drawable/icon_smile"
    app:item_leftDrawablePadding="5dp"
    app:item_leftDrawableSize="30dp"
    app:item_leftText="清空缓存"
    app:item_rightDrawable="@drawable/ic_arrows_right" />
```

**方式四：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4a6c604d4743436bb22de3adcf7090e3.png)

```xml
<com.example.tools.setting_item.layout.SettingItem
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="15dp"
    app:item_leftText="请输入">

    <EditText
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical|end"
        android:hint="请输入相关信息"
        android:textSize="14sp" />
</com.example.tools.setting_item.layout.SettingItem>
```

**方式五：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/234f59951d154950b61a68466883fe4b.png)

```xml
<com.example.tools.setting_item.layout.SettingItem
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="15dp"
    app:item_leftText="退出登录"
    app:item_leftTextColor="#F00"
    app:item_leftTextSize="18sp" />
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/setting_item)

