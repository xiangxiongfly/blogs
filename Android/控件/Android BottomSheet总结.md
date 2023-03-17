[TOC]

# Android BottomSheet总结

## BottomSheet

![请添加图片描述](https://img-blog.csdnimg.cn/e1ac08b401224fdbbf894a936a306a16.gif)

**XML布局：**

```XML
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".bottom_sheet.BottomSheetActivity">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:orientation="vertical">

        <androidx.appcompat.widget.Toolbar
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="@drawable/main_shape"
            app:title="BottomSheet"
            app:titleTextColor="@android:color/white" />

        <Button
            android:id="@+id/btn_bottom_sheet"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:text="BottomSheet" />

    </LinearLayout>

    <LinearLayout
        android:id="@+id/ll_bottom"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:behavior_peekHeight="80dp"
        app:layout_behavior="com.google.android.material.bottomsheet.BottomSheetBehavior">

        <TextView
            android:id="@+id/tv_title"
            android:layout_width="match_parent"
            android:layout_height="80dp"
            android:background="@color/red"
            android:gravity="center"
            android:text="上拉展开"
            android:textColor="@color/white" />

        <TextView
            android:layout_width="match_parent"
            android:layout_height="60dp"
            android:background="@color/color_main"
            android:gravity="center"
            android:text="内容一"
            android:textColor="@color/white" />

        <TextView
            android:layout_width="match_parent"
            android:layout_height="90dp"
            android:background="@color/color_secondary"
            android:gravity="center"
            android:text="内容二"
            android:textColor="@color/white" />

        <TextView
            android:layout_width="match_parent"
            android:layout_height="80dp"
            android:background="@color/green"
            android:gravity="center"
            android:text="内容三"
            android:textColor="@color/white" />
    </LinearLayout>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

- 必须是`CoordinatorLayout`布局
- `behavior_peekHeight`属性表示默认显示高度，设置为0则不显示
- 需要设置`layout_behavior`属性

**代码：**

```kotlin
val behavior = BottomSheetBehavior.from(llBottom)
btnBottomSheet.setOnClickListener {
    if (behavior.state == BottomSheetBehavior.STATE_EXPANDED) {
        behavior.state = BottomSheetBehavior.STATE_COLLAPSED
    } else if (behavior.state == BottomSheetBehavior.STATE_COLLAPSED) {
        behavior.state = BottomSheetBehavior.STATE_EXPANDED
    }
}
behavior.addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
    override fun onStateChanged(bottomSheet: View, newState: Int) {
        if (newState == BottomSheetBehavior.STATE_EXPANDED) {
            tvTitle.text = "下滑收起"
        } else if (newState == BottomSheetBehavior.STATE_COLLAPSED) {
            tvTitle.text = "上拉展开"
        }
    }

    override fun onSlide(bottomSheet: View, slideOffset: Float) {
    }
})
```

## BottomSheetDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/4a74db2ff80a404cabf5af460d68aeaa.gif)

**MyBottomSheetDialogStyle样式：**

```xml
<!--  BottomSheetDialog圆角效果  -->
<style name="MyBottomSheetDialogStyle" parent="Theme.Design.Light.BottomSheetDialog">
    <item name="bottomSheetStyle">@style/bottomSheetStyleWrapper</item>
</style>

<style name="bottomSheetStyleWrapper" parent="Widget.Design.BottomSheet.Modal">
    <item name="android:background">@android:color/transparent</item>
</style>
```

**dialog_bottom_sheet布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/bottom_sheet_shape"
    android:orientation="vertical"
    android:padding="10dp">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="10dp"
        android:text="拍照" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="10dp"
        android:text="相册" />

    <View
        android:layout_width="match_parent"
        android:layout_height="1dp"
        android:background="#f5f5f5" />

    <TextView
        android:id="@+id/cancel"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="10dp"
        android:text="取消"
        android:textColor="@color/red" />

</LinearLayout>
```

**代码：**

```kotlin
val bottomSheetDialog = BottomSheetDialog(mContext, R.style.MyBottomSheetDialogStyle)
bottomSheetDialog.dismissWithAnimation
bottomSheetDialog.setContentView(R.layout.dialog_bottom_sheet)
val cancel: TextView = bottomSheetDialog.findViewById<TextView>(R.id.cancel)!!
cancel.setOnClickListener {
    bottomSheetDialog.dismiss()
}
bottomSheetDialog.show()
```

## BottomSheetDialogFragment

![在这里插入图片描述](https://img-blog.csdnimg.cn/bc8e8fbd0b6b43088a35db6f7b8ee02c.gif)

**MyBottomSheetDialog代码：**

```kotlin
class MyBottomSheetDialog : BottomSheetDialogFragment() {
    private lateinit var cancel: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NORMAL, R.style.MyBottomSheetDialogStyle)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.dialog_bottom_sheet, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        cancel = view.findViewById(R.id.cancel)
        cancel.setOnClickListener {
            dismiss()
        }
    }
}
```

**使用：**

```kotlin
btnBottomSheetDialogFragment.setOnClickListener {
    MyBottomSheetDialog().show(supportFragmentManager, "MyBottomSheetDialog")
}
```

## 全屏无阴影BottomSheetDialogFragment

![在这里插入图片描述](https://img-blog.csdnimg.cn/2a161a5768e24676bfebad1fd2ee82f4.gif)

**MyBottomSheetDialogBgStyle样式：**

```xml
<!--  BottomSheetDialog圆角效果、背景无阴影  -->
<style name="MyBottomSheetDialogBgStyle" parent="Theme.Design.Light.BottomSheetDialog">
    <item name="bottomSheetStyle">@style/bottomSheetStyleWrapper</item>
    <item name="android:backgroundDimEnabled">false</item>
</style>

<style name="bottomSheetStyleWrapper" parent="Widget.Design.BottomSheet.Modal">
    <item name="android:background">@android:color/transparent</item>
</style>
```

**dialog_full布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/bottom_sheet_shape"
    android:orientation="vertical"
    android:padding="10dp">

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerInParent="true"
            android:text="标题"
            android:textSize="20sp"
            android:textStyle="bold" />

        <ImageView
            android:id="@+id/iv_close"
            android:layout_width="30dp"
            android:layout_height="30dp"
            android:layout_alignParentRight="true"
            android:layout_centerVertical="true"
            android:src="@drawable/ic_close" />
    </RelativeLayout>

    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="请输入"
        android:inputType="text"
        android:padding="10dp" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/desc" />
</LinearLayout>
```

**MyFullDialog代码：**

```kotlin
class MyFullDialog : BottomSheetDialogFragment() {
    private lateinit var close: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NORMAL, R.style.MyBottomSheetDialogBgStyle)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_full, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        close = view.findViewById(R.id.iv_close)
        close.setOnClickListener {
            dismiss()
        }
    }

    override fun onStart() {
        super.onStart()
        val view: FrameLayout = dialog?.findViewById(R.id.design_bottom_sheet)!!
        //设置BottomSheetDialogFragment高度
        view.layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT
        //设置弹出高度
        val behavior = BottomSheetBehavior.from(view)
        behavior.peekHeight = 3000
        //展开
        behavior.state = BottomSheetBehavior.STATE_EXPANDED
    }

    override fun dismiss() {
        KeyboardUtils.hideKeyboard(dialog?.currentFocus)
        super.dismiss()
    }
}
```

**使用：**

```kotlin
btnFullDialog.setOnClickListener {
    MyFullDialog().show(supportFragmentManager, "MyFullDialog")
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/bottom_sheet)



