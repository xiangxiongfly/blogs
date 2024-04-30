[TOC]

# Android 封装Dialog

## 封装类

**样式：**

```xml
<style name="ToolsBaseDialogStyle">
    <!--是否显示Title -->
    <item name="android:windowNoTitle">true</item>
    <!--Dialog中Window的背景颜色-->
    <item name="android:windowBackground">@android:color/transparent</item>
    <!--Dialog背景颜色-->
    <item name="android:background">@android:color/transparent</item>
    <!--去除边框-->
    <item name="android:windowFrame">@null</item>
    <!--是否浮现在activity之上-->
    <item name="android:windowIsFloating">true</item>
    <!--是否半透明-->
    <item name="android:windowIsTranslucent">true</item>
    <!-- ActionMode 覆盖 Actionbar，不顶下来 -->
    <item name="windowActionModeOverlay">true</item>
    <item name="android:windowContentOverlay">@null</item>
</style>
```

**处理控件类：**

```kotlin
class ViewHolder(private val convertView: View) {

    companion object {
        @JvmStatic
        fun create(view: View): ViewHolder {
            return ViewHolder(view)
        }
    }

    private val views = SparseArray<View>()

    /**
     * 获取控件
     */
    fun <T : View> getView(@IdRes viewId: Int): T {
        var view = views.get(viewId)
        if (view == null) {
            view = convertView.findViewById(viewId)
            views.put(viewId, view)
        }
        return view as T
    }

    /**
     * 设置文本
     */
    fun setText(@IdRes viewId: Int, text: String) {
        val textView = getView<TextView>(viewId)
        textView.text = text
    }

    /**
     * 设置文本颜色
     */
    fun setTextColor(@IdRes viewId: Int, @ColorInt color: Int) {
        val textView = getView<TextView>(viewId)
        textView.setTextColor(color)
    }

    /**
     * 设置控件的背景图片
     */
    fun setBackgroundResource(@IdRes viewId: Int, @DrawableRes resId: Int) {
        val view = getView<View>(viewId)
        view.setBackgroundResource(resId)
    }

    /**
     * 设置控件的背景颜色
     */
    fun setBackgroundColor(@IdRes viewId: Int, @ColorInt color: Int) {
        val view = getView<View>(viewId)
        view.setBackgroundColor(color)
    }

    /**
     * 设置点击事件
     */
    fun setOnClickListener(@IdRes viewId: Int, listener: View.OnClickListener) {
        val view = getView<View>(viewId)
        view.setOnClickListener(listener)
    }
}
```

**封装类：**

```kotlin
class BaseDialog(context: Context, private val params: DialogParams) :
    AppCompatDialog(context, R.style.ToolsBaseDialogStyle) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(params.mDialogView)
        if (params.mWidth == FrameLayout.LayoutParams.WRAP_CONTENT) {
            params.mWidth = params.mDialogView.layoutParams.width
        }
        if (params.mHeight == FrameLayout.LayoutParams.WRAP_CONTENT) {
            params.mHeight = params.mDialogView.layoutParams.height
        }
        window?.let { w ->
            val layoutParams = w.attributes
            layoutParams.apply {
                width = params.mWidth
                if (width > 0) {
                    width -= (params.mGap * 2)
                }
                height = params.mHeight
                gravity = params.mGravity
                if (params.mAnimationStyle != -1) {
                    windowAnimations = params.mAnimationStyle
                }
                if (params.mDimEnabled) {
                    w.addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
                    dimAmount = params.mDimAmount
                } else {
                    w.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
                }
            }
            w.attributes = layoutParams
        }
        setCanceledOnTouchOutside(params.mCanceledOnTouchOutside) //点击外部区域是否取消
        setCancelable(params.mCancelable) //按返回键是否取消
        params.mOnShowListener?.let {
            setOnShowListener(it)
        }
        params.mOnDismissListener?.let {
            setOnDismissListener(it)
        }
    }

    class DialogParams {
        lateinit var mDialogView: View

        @FloatRange(from = 0.0, to = 1.0)
        var mDimAmount = 0.6F // 背景暗淡度
        var mDimEnabled = true // 是否显示背景暗淡度
        var mGravity = Gravity.CENTER //显示位置
        var mWidth: Int = ViewGroup.LayoutParams.WRAP_CONTENT // 宽度
        var mHeight: Int = ViewGroup.LayoutParams.WRAP_CONTENT // 高度
        var mGap: Int = 0 // 左右间隙
        var mCancelable: Boolean = true // 点击返回键是否隐藏
        var mCanceledOnTouchOutside: Boolean = true // 点击外部区域是否隐藏

        @StyleRes
        var mAnimationStyle: Int = -1

        var mOnShowListener: DialogInterface.OnShowListener? = null
        var mOnDismissListener: DialogInterface.OnDismissListener? = null
    }

    abstract class Builder(val context: Context, @LayoutRes layoutResId: Int) {
        private var mParams: DialogParams = DialogParams()
        private var mDialog: BaseDialog? = null
        private var mActivity: Activity? = null

        val mDialogView: View by lazy {
            LayoutInflater.from(context).inflate(layoutResId, FrameLayout(context), false)
        }
        val mViewHolder: ViewHolder by lazy {
            ViewHolder.create(mDialogView)
        }

        init {
            mParams.mDialogView = mDialogView
            mActivity = getActivity(context)
        }

        protected fun getActivity(context: Context): Activity? {
            if (context is Activity) {
                return context
            }
            return null
        }

        /**
         * 是否显示背景暗淡度
         */
        protected fun setDimEnable(enable: Boolean): Builder {
            mParams.mDimEnabled = enable
            return this
        }

        /**
         * 设置背景暗淡度
         */
        protected fun setDimAmount(@FloatRange(from = 0.0, to = 1.0) dimAmount: Float): Builder {
            mParams.mDimAmount = dimAmount
            return this
        }

        /**
         * 设置显示位置
         */
        protected fun setGravity(gravity: Int): Builder {
            mParams.mGravity = gravity
            return this
        }

        /**
         * 设置宽高
         */
        protected fun setWidth(width: Int): Builder {
            mParams.mWidth = width
            return this
        }

        protected fun setHeight(height: Int): Builder {
            mParams.mHeight = height
            return this
        }

        /**
         * 设置左右空白
         */
        protected fun setHorizontalGap(gap: Int): Builder {
            mParams.mGap = gap
            return this
        }

        /**
         * 动画
         */
        protected fun setAnimationStyle(@StyleRes animationStyle: Int): Builder {
            mParams.mAnimationStyle = animationStyle
            return this
        }

        /**
         * 点击外部区域是否隐藏
         */
        protected fun setCanceledOnTouchOutside(cancel: Boolean): Builder {
            mParams.mCanceledOnTouchOutside = cancel
            return this
        }

        /**
         * 点击返回按钮是否隐藏
         */
        protected fun setCancelable(cancelable: Boolean): Builder {
            mParams.mCancelable = cancelable
            return this
        }

        /**
         * 设置显示监听
         */
        protected fun setOnShowListener(onShowListener: DialogInterface.OnShowListener): Builder {
            mParams.mOnShowListener = onShowListener
            return this
        }

        /**
         * 设置隐藏监听
         */
        protected fun setOnDismissListener(onDismissListener: DialogInterface.OnDismissListener): Builder {
            mParams.mOnDismissListener = onDismissListener
            return this
        }

        // 创建Dialog
        fun build(): BaseDialog {
            mDialog = BaseDialog(context, mParams)
            convertView(mViewHolder, mDialog!!)
            return mDialog!!
        }

        // Dialog是否被创建
        private fun isCreated(): Boolean {
            return mDialog != null
        }

        // Dialog是否显示
        private fun isShowing(): Boolean {
            if (mDialog != null && mDialog!!.isShowing) {
                return true
            }
            return false
        }

        abstract fun convertView(viewHolder: ViewHolder, dialog: BaseDialog)

        // 显示Dialog
        open fun show() {
            if (mActivity == null || mActivity!!.isFinishing || mActivity!!.isDestroyed) {
                return
            }
            if (!isCreated()) {
                build()
            }
            if (isShowing()) {
                return
            }
            mDialog!!.show()
        }

        // 隐藏Dialog
        fun dismiss() {
            if (mActivity == null || mActivity!!.isFinishing || mActivity!!.isDestroyed) {
                return
            }
            if (mDialog == null) {
                return
            }
            mDialog!!.dismiss()
        }
    }
}
```



## 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/afbf84e0967b4720aa0317e1b76ec034.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/399813587a2d4ef3840ede14a08bdfec.png)

### 确定样式

**代码：**

```kotlin
class ConfirmDialog {

    class Builder(context: Context) : BaseDialog.Builder(context, R.layout.tools_dialog_confirm) {
        private var mTitle: String? = null
        private var mContent: String? = null
        private var mOnClickListener: OnClickListener? = null

        override fun convertView(viewHolder: ViewHolder, dialog: BaseDialog) {
            setWidth(ScreenUtils.getScreenWidth(context))
            setHorizontalGap(dp2px(50))
            setCancelable(false)
            setCanceledOnTouchOutside(false)

            viewHolder.setText(R.id.title, mTitle!!)
            viewHolder.setText(R.id.content, mContent!!)
            viewHolder.setOnClickListener(R.id.cancel, object : View.OnClickListener {
                override fun onClick(v: View?) {
                    mOnClickListener?.onCancel()
                    dialog.dismiss()
                }
            })
            viewHolder.setOnClickListener(R.id.confirm) {
                mOnClickListener?.onConfirm()
                dialog.dismiss()
            }
        }

        fun setTitle(title: String): Builder {
            mTitle = title
            return this
        }

        fun setContent(content: String): Builder {
            mContent = content
            return this
        }

        fun setOnClickListener(listener: OnClickListener): Builder {
            mOnClickListener = listener
            return this
        }
    }

    interface OnClickListener {
        fun onConfirm()
        fun onCancel()
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/shape_dialog_confirm"
    android:gravity="center_horizontal"
    android:orientation="vertical">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="15dp"
        android:text="--"
        android:textColor="#333333"
        android:textSize="16sp" />

    <TextView
        android:id="@+id/content"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="15dp"
        android:text="---"
        android:textSize="16sp" />

    <View
        android:layout_width="match_parent"
        android:layout_height="1dp"
        android:layout_marginTop="15dp"
        android:background="#e6e6e6" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="40dp">

        <TextView
            android:id="@+id/cancel"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:gravity="center"
            android:text="取消"
            android:textColor="#333333" />

        <View
            android:layout_width="1dp"
            android:layout_height="match_parent"
            android:background="#e6e6e6" />

        <TextView
            android:id="@+id/confirm"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:gravity="center"
            android:text="确定"
            android:textColor="#333333" />
    </LinearLayout>
</LinearLayout>
```

**用法一：**

```kotlin
ConfirmDialog.Builder(mContext)
    .setTitle("标题")
    .setContent("这是一些内容")
    .show()
```

**方法二：**

```kotlin
val dialog = ConfirmDialog.Builder(mContext)
    .setTitle("提示")
    .setContent("您已支付成功")
    .setOnClickListener(object : ConfirmDialog.OnClickListener {
        override fun onConfirm() {
            ToastUtils.show("确定")
        }

        override fun onCancel() {
            ToastUtils.show("取消")
        }
    })
    .build()
dialog.show()
```

### 分享样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/dc0bd72652c04f3da8c6a831b7595237.png)

**代码：**

```kotlin
class ShareDialog {

    class Builder(context: Context) : BaseDialog.Builder(context, R.layout.tools_dialog_share) {
        override fun convertView(viewHolder: ViewHolder, dialog: BaseDialog) {
            setGravity(Gravity.BOTTOM)
            setAnimationStyle(R.style.DialogAnim)
            viewHolder.setOnClickListener(R.id.tv_weixin_share, object : View.OnClickListener {
                override fun onClick(v: View?) {
                    dialog.dismiss()
                }
            })
            viewHolder.setOnClickListener(R.id.tv_qq_share, object : View.OnClickListener {
                override fun onClick(v: View?) {
                    dialog.dismiss()
                }
            })
            viewHolder.setOnClickListener(R.id.tv_weibo_share, object : View.OnClickListener {
                override fun onClick(v: View?) {
                    dialog.dismiss()
                }
            })
        }
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#ffffff"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="40dp"
        android:gravity="center"
        android:text="分享到"
        android:textColor="#969696"
        android:textSize="14sp" />

    <View
        android:layout_width="match_parent"
        android:layout_height="1dp"
        android:layout_marginLeft="20dp"
        android:layout_marginRight="20dp"
        android:background="#e6e6e6" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:paddingTop="15dp"
        android:paddingBottom="15dp">

        <TextView
            android:id="@+id/tv_weixin_share"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:layout_weight="1"
            android:drawableTop="@drawable/icon_weixin"
            android:drawablePadding="10dp"
            android:gravity="center"
            android:text="微信"
            android:textColor="#333333" />

        <TextView
            android:id="@+id/tv_qq_share"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:layout_weight="1"
            android:drawableTop="@drawable/icon_qq"
            android:drawablePadding="10dp"
            android:gravity="center"
            android:text="QQ"
            android:textColor="#333333" />

        <TextView
            android:id="@+id/tv_weibo_share"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:layout_weight="1"
            android:drawableTop="@drawable/icon_weibo"
            android:drawablePadding="10dp"
            android:gravity="center"
            android:text="微博"
            android:textColor="#333333" />
    </LinearLayout>
</LinearLayout>
```

**使用：**

```kotlin
ShareDialog.Builder(mContext)
    .show()
```

### 设置样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/a616ce84edb4401795330d1e3140a329.png)

**代码：**

```kotlin
class SettingDialog {

    class Builder(context: Context) : BaseDialog.Builder(context, R.layout.tools_dialog_setting) {
        override fun convertView(viewHolder: ViewHolder, dialog: BaseDialog) {
            setGravity(Gravity.BOTTOM)
            setAnimationStyle(R.style.DialogAnim)
            setHeight(dp2px(300))
        }
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#ffffff"
    android:overScrollMode="never"
    android:scrollbars="none">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:paddingLeft="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="设置备注及标签"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="标为星标朋友"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="设置朋友圈权限"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="发送改名片"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="投诉"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="加入黑名单"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="删除"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="添加到桌面"
            android:textColor="#969696"
            android:textSize="16sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:paddingBottom="12dp"
            android:paddingTop="12dp"
            android:text="更多..."
            android:textColor="#969696"
            android:textSize="16sp" />
    </LinearLayout>
</ScrollView>
```

**使用：**

```kotlin
SettingDialog.Builder(mContext)
    .show()
```

### 评论样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0bacfa06ae144a239775da0eb44d70bf.png)

**代码：**

```kotlin
class CommentDialog {

    class Builder(context: Context) : BaseDialog.Builder(context, R.layout.tools_dialog_comment) {
        override fun convertView(viewHolder: ViewHolder, dialog: BaseDialog) {
            setGravity(Gravity.BOTTOM)
            setAnimationStyle(R.style.DialogAnim)
            val tvCommit = viewHolder.getView<TextView>(R.id.tv_commit)
            val etComment = viewHolder.getView<EditText>(R.id.et_comment)
            viewHolder.setOnClickListener(R.id.tv_commit) {
                val comment: String = etComment.text.toString().trim()
                if (TextUtils.isEmpty(comment)) {
                    ToastUtils.show("请输入评论")
                } else {
                    dialog.dismiss()
                    ToastUtils.show(comment)
                }
            }
        }
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#ffffff"
    android:orientation="vertical"
    android:paddingLeft="10dp"
    android:paddingTop="8dp"
    android:paddingRight="10dp">

    <EditText
        android:id="@+id/et_comment"
        android:layout_width="match_parent"
        android:layout_height="100dp"
        android:gravity="top"
        android:hint="说你想说的..."
        android:padding="10dp"
        android:textSize="14sp" />

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="60dp"
        android:gravity="center_vertical">

        <ImageView
            android:id="@+id/at"
            android:layout_width="30dp"
            android:layout_height="30dp"
            android:layout_marginLeft="10dp"
            android:background="@drawable/icon_at" />

        <ImageView
            android:layout_width="30dp"
            android:layout_height="30dp"
            android:layout_marginLeft="25dp"
            android:layout_toRightOf="@id/at"
            android:background="@drawable/icon_smile" />

        <TextView
            android:id="@+id/tv_commit"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_alignParentRight="true"
            android:paddingLeft="12dp"
            android:paddingTop="5dp"
            android:paddingRight="12dp"
            android:paddingBottom="5dp"
            android:text="发表评论"
            android:textColor="#00bb29" />
    </RelativeLayout>
</LinearLayout>
```

**使用：**

```kotlin
  CommentDialog.Builder(mContext)
            .show()
```

### 提示样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/6aec5886496143059cbd0342a0df0e34.png)

提示样式会在指定时间后自动隐藏。

**代码：**

```kotlin
class TipDialog : HandlerAction {
    class Build(context: Context) : BaseDialog.Builder(context, R.layout.tools_dialog_tip) {
        override fun convertView(viewHolder: ViewHolder, dialog: BaseDialog) {
        }

        fun show(delayMillis: Long) {
            super.show()
            HANDLER.postDelayed({ dismiss() }, delayMillis)
        }
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="center"
    android:gravity="center"
    android:orientation="vertical"
    app:cardBackgroundColor="#D9000000"
    app:cardCornerRadius="15dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:minWidth="110dp"
        android:minHeight="110dp"
        android:orientation="vertical">

        <androidx.appcompat.widget.AppCompatImageView
            android:id="@+id/iv_tips_icon"
            android:layout_width="60dp"
            android:layout_height="60dp"
            android:layout_marginTop="10dp"
            app:srcCompat="@drawable/tips_warning_ic" />

        <TextView
            android:id="@+id/tv_tips_message"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="提示"
            android:textColor="@color/white"
            android:textSize="14sp" />
    </LinearLayout>

</androidx.cardview.widget.CardView>
```

**使用：**

```kotlin
 TipDialog.Build(mContext)
            .show(2000L)
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/dialog)


