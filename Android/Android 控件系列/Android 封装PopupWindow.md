[TOC]

# Android 封装PopupWindow

## 封装类

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

**封装PopupWindow类：**

```kotlin
class BasePopupWindow(private val params: PopupWindowParams, private val build: Builder) :
    PopupWindow() {

    override fun dismiss() {
        super.dismiss()
        if (params.mDimEnable) {
            build.setBackgroundDim(false)
        }
    }

    class PopupWindowParams {
        var mWidth: Int = ViewGroup.LayoutParams.WRAP_CONTENT // 宽度
        var mHeight: Int = ViewGroup.LayoutParams.WRAP_CONTENT // 高度
        var mFocusable: Boolean = false // 焦点
        var mBackground: Drawable = ColorDrawable() // 背景
        var mGravity: Int = Gravity.NO_GRAVITY // 位置
        var x: Int = 0 // x偏移
        var y: Int = 0 // y偏移
        var mDimEnable: Boolean = false // 背景是否暗淡

        @StyleRes
        var mAnimationStyle: Int = -1 // 隐藏监听
        var mOnDismissListener: OnDismissListener? = null // 隐藏监听
    }

    abstract class Builder(val context: Context, @LayoutRes layoutResId: Int) {
        private val mParams = PopupWindowParams()
        private val mContentView: View by lazy {
            LayoutInflater.from(context).inflate(layoutResId, null)
        }
        private val mViewHolder: ViewHolder by lazy {
            ViewHolder.create(mContentView)
        }
        private var mPopupWindow: BasePopupWindow? = null

        /**
         * 设置宽度
         */
        fun setWidth(width: Int): Builder {
            mParams.mWidth = width
            return this
        }

        /**
         * 设置高度
         */
        fun setHeight(height: Int): Builder {
            mParams.mHeight = height
            return this
        }

        /**
         * 设置焦点
         */
        fun setFocusable(focusable: Boolean): Builder {
            mParams.mFocusable = focusable
            return this
        }

        /**
         * 设置背景
         */
        fun setBackgroundDrawable(background: Drawable): Builder {
            mParams.mBackground = background
            return this
        }

        /**
         * 设置位置
         */
        fun setGravity(gravity: Int): Builder {
            mParams.mGravity = gravity
            return this
        }

        /**
         * 设置x偏移
         */
        fun setXOffset(x: Int): Builder {
            mParams.x = x
            return this
        }

        /**
         * 设置y便宜
         */
        fun setYOffset(y: Int): Builder {
            mParams.y = y
            return this
        }

        /**
         * 获取Activity
         */
        protected fun getActivity(context: Context): Activity? {
            if (context is Activity) {
                return context
            }
            return null
        }

        /**
         * 设置背景是否暗淡
         */
        fun setDimEnable(enable: Boolean): Builder {
            mParams.mDimEnable = enable
            return this
        }

        /**
         * 设置背景暗淡
         */
        fun setBackgroundDim(isDim: Boolean) {
            if (isDim) {
                setBackgroundAlpha(0.6F)
            } else {
                setBackgroundAlpha(1F)
            }
        }

        /**
         * 设置背景暗淡度
         */
        fun setBackgroundAlpha(alpha: Float) {
            val activity = getActivity(context)
            activity?.let { act ->
                act.window.let { w ->
                    val layoutParams = w.attributes
                    layoutParams.alpha = alpha
                    w.attributes = layoutParams
                }
            }
        }

        /**
         * 设置隐藏监听
         */
        fun setOnDismissListener(onDismissListener: OnDismissListener): Builder {
            mParams.mOnDismissListener = onDismissListener
            return this
        }

        /**
         * 设置动画
         */
        fun setAnimationStyle(@StyleRes animationStyle: Int): Builder {
            mParams.mAnimationStyle = animationStyle
            return this
        }

        /**
         * 获取PopupWindow
         */
        fun getPopupWindow(): PopupWindow {
            return mPopupWindow!!
        }

        /**
         * 创建PopupWindow
         */
        fun build(): Builder {
            mPopupWindow = BasePopupWindow(mParams, this)
            mPopupWindow!!.apply {
                contentView = mContentView
                width = mParams.mWidth
                height = mParams.mHeight
                isFocusable = mParams.mFocusable
                setBackgroundDrawable(mParams.mBackground)
                if (mParams.mAnimationStyle != -1) {
                    animationStyle = mParams.mAnimationStyle
                }
                if (mParams.mOnDismissListener != null) {
                    setOnDismissListener(mParams.mOnDismissListener)
                }
            }
            convertView(mViewHolder, mPopupWindow!!)
            return this
        }

        abstract fun convertView(viewHolder: ViewHolder, popupWindow: BasePopupWindow)

        /**
         * 判断PopupWindow是否被创建
         */
        fun isCreated(): Boolean {
            return mPopupWindow != null
        }

        /**
         * 判断PopupWindow是否显示
         */
        fun isShowing(): Boolean {
            return mPopupWindow!!.isShowing
        }

        private fun show(): Boolean {
            if (!isCreated()) {
                build()
            }
            if (isShowing()) {
                return false
            }
            if (mParams.mDimEnable) {
                setBackgroundDim(true)
            }
            return true
        }

        /**
         * 在指定视图的下方显示弹出窗口
         */
        fun showAsDropDown(anchor: View) {
            if (show()) {
                mPopupWindow!!.showAsDropDown(anchor, mParams.x, mParams.y, mParams.mGravity)
            }
        }

        /**
         * 在指定位置显示弹出窗口
         */
        fun showAtLocation(parent: View) {
            if (show()) {
                mPopupWindow!!.showAtLocation(parent, mParams.mGravity, mParams.x, mParams.y)
            }
        }
    }
}
```



## 使用

### 分享样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5fd450e4f23d4fd0aa8cdb1a0f75ce2c.png)

**代码：**

```kotlin
class SharePop {

    class Build(context: Context) : BasePopupWindow.Builder(context, R.layout.pop_share) {
        init {
            setWidth(dp2px(100))
            setFocusable(true)
            setXOffset(-30)
            setGravity(Gravity.RIGHT)
            setDimEnable(true)
        }

        override fun convertView(viewHolder: ViewHolder, popupWindow: BasePopupWindow) {
            viewHolder.setOnClickListener(R.id.tv_qq) {
                popupWindow.dismiss()
                ToastUtils.show("QQ")
            }
            viewHolder.setOnClickListener(R.id.tv_weixin) {
                popupWindow.dismiss()
                ToastUtils.show("微信")
            }
            viewHolder.setOnClickListener(R.id.tv_sina) {
                popupWindow.dismiss()
                ToastUtils.show("新浪")
            }
        }

        fun show(view: View) {
            showAsDropDown(view)
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
    android:background="@drawable/pop"
    android:gravity="center_horizontal"
    android:orientation="vertical">

    <TextView
        android:id="@+id/tv_qq"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="10dp"
        android:text="QQ" />

    <View
        android:layout_width="match_parent"
        android:layout_height="0.5dp"
        android:layout_margin="1dp"
        android:background="@color/black" />

    <TextView
        android:id="@+id/tv_weixin"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="10dp"
        android:text="微信" />

    <View
        android:layout_width="match_parent"
        android:layout_height="0.5dp"
        android:layout_margin="1dp"
        android:background="@color/black" />

    <TextView
        android:id="@+id/tv_sina"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="10dp"
        android:text="新浪" />

</LinearLayout>
```

**使用：**

```kotlin
SharePop.Build(mContext)
    .show(btnShare)
```

### 仿QQ弹窗样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/db384ff7d4e9474889be1ab35bd67f80.png)

**代码：**

```kotlin
class QQPop {

    class Builder(context: Context) : BasePopupWindow.Builder(context, R.layout.pop_qq) {
        private var mOnClickListener: OnClickListener? = null

        init {
            setWidth(ViewGroup.LayoutParams.MATCH_PARENT)
            setFocusable(true)
            setGravity(Gravity.BOTTOM)
            setDimEnable(true)
            setAnimationStyle(R.style.DialogAnim)
        }

        override fun convertView(viewHolder: ViewHolder, popupWindow: BasePopupWindow) {
            viewHolder.setOnClickListener(R.id.video) {
                popupWindow.dismiss()
                mOnClickListener?.onClickVideo()
            }
            viewHolder.setOnClickListener(R.id.photo) {
                popupWindow.dismiss()
                mOnClickListener?.onClickPhoto()
            }
            viewHolder.setOnClickListener(R.id.cancel) { popupWindow.dismiss() }
        }

        fun setOnClickListener(listener: OnClickListener): Builder {
            mOnClickListener = listener
            return this
        }

        fun show(root: View) {
            showAtLocation(root)
        }
    }

    interface OnClickListener {
        fun onClickVideo()
        fun onClickPhoto()
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/shape_rounded_bg"
    android:orientation="vertical">

    <TextView
        android:id="@+id/video"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="16dp"
        android:text="视频"
        android:textColor="#111188" />

    <View
        android:layout_width="match_parent"
        android:layout_height="0.5dp"
        android:background="#888" />

    <TextView
        android:id="@+id/photo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="16dp"
        android:text="相册"
        android:textColor="#111188" />

    <View
        android:layout_width="match_parent"
        android:layout_height="0.5dp"
        android:background="#888" />

    <TextView
        android:id="@+id/cancel"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="16dp"
        android:text="取消"
        android:textColor="#111188" />
</LinearLayout>
```

**使用：**

```kotlin
QQPop.Builder(mContext)
    .setOnClickListener(object : QQPop.OnClickListener {
        override fun onClickVideo() {
            ToastUtils.show("视频")
        }

        override fun onClickPhoto() {
            ToastUtils.show("相册")
        }
    })
    .show(root)
```

### 点赞样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0c3b30e697db48078f182cfdb25cc3a0.png)

**代码：**

```kotlin
package com.example.tools.popupwindow.sample

import android.content.Context
import android.view.View
import com.example.tools.R
import com.example.tools.dialog.base.ViewHolder
import com.example.tools.popupwindow.base.BasePopupWindow
import com.xiangxiongfly.common.utils.ToastUtils
import com.xiangxiongfly.common.utils.dp2px

class LikePop {

    class Builder(context: Context) : BasePopupWindow.Builder(context, R.layout.pop_like) {
        init {
            setFocusable(true)
        }

        override fun convertView(viewHolder: ViewHolder, popupWindow: BasePopupWindow) {
            viewHolder.setOnClickListener(R.id.like) {
                popupWindow.dismiss()
                ToastUtils.show("喜欢")
            }
            viewHolder.setOnClickListener(R.id.collection) {
                popupWindow.dismiss()
                ToastUtils.show("收藏")
            }
        }

        fun show(view: View) {
            build()

            val popupWindow = getPopupWindow()

            val contentView = popupWindow.contentView
            contentView.measure(
                View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED
            )
            val diff = (contentView.measuredWidth - view.measuredWidth) / 2

            val location = IntArray(2)
            view.getLocationOnScreen(location)
            setXOffset(location[0] - diff)
            setYOffset(location[1] - contentView.measuredHeight - dp2px(5))
            showAtLocation(view)
        }
    }
}
```

**布局：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:background="#3F51B5"
    android:orientation="horizontal">

    <ImageView
        android:id="@+id/like"
        android:layout_width="20dp"
        android:layout_height="40dp"
        android:layout_marginLeft="15dp"
        android:layout_marginTop="3dp"
        android:layout_marginRight="15dp"
        android:layout_marginBottom="3dp"
        android:gravity="center"
        android:src="@drawable/ic_like" />

    <View
        android:layout_width="1dp"
        android:layout_height="20dp"
        android:layout_gravity="center_vertical"
        android:background="#bbbbbb" />

    <ImageView
        android:id="@+id/collection"
        android:layout_width="20dp"
        android:layout_height="40dp"
        android:layout_marginLeft="15dp"
        android:layout_marginTop="3dp"
        android:layout_marginRight="15dp"
        android:layout_marginBottom="3dp"
        android:gravity="center"
        android:src="@drawable/ic_collection" />
</LinearLayout>
```

**使用：**

```kotlin
LikePop.Builder(mContext)
    .show(view)
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/popupwindow)

