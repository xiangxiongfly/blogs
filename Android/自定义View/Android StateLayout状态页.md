[TOC]

# Android StateLayout状态页

## 概述

StateLayout（状态页）包含：加载中页面，错误页面，空页面，内含状态默认页面，支持自定义页面。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5660b6b8b1b44f0bb70ee1fb953c0bdf.png)



## 源码

**全局配置：**

```kotlin
package com.example.tools.state_layout.widgets

import android.view.View
import androidx.annotation.LayoutRes

/**
 * StateLayout全局配置
 */
object StateConfig {

    @LayoutRes
    @JvmStatic
    var emptyLayoutRes = View.NO_ID

    @LayoutRes
    @JvmStatic
    var errorLayoutRes = View.NO_ID

    @LayoutRes
    @JvmStatic
    var loadingLayoutRes = View.NO_ID

    @LayoutRes
    @JvmStatic
    var retryIds: IntArray? = null

    private var mOnStateChangeListener: OnStateChangeListener? = null

    fun setOnStateChangeListener(listener: OnStateChangeListener) {
        mOnStateChangeListener = listener
    }

    fun getOnStateChangeListener(): OnStateChangeListener? {
        return mOnStateChangeListener
    }
}
```

**状态监听：**

```kotlin
interface OnStateChangeListener {
    fun showState(status: Int)
}
```

**属性：**

```xml
<declare-styleable name="StateLayout">
    <attr name="empty_layout" format="reference" />
    <attr name="loading_layout" format="reference" />
    <attr name="error_layout" format="reference" />
</declare-styleable>
```

**代码：**

```kotlin
class StateLayout @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    companion object {
        const val STATE_LOADING = 0xA001
        const val STATE_EMPTY = 0xA002
        const val STATE_ERROR = 0xA003
        const val STATE_CONTENT = 0xA004
    }

    // empty布局资源
    @LayoutRes
    private var emptyLayoutRes = View.NO_ID
        get() = if (field == View.NO_ID) StateConfig.emptyLayoutRes else field

    // loading布局资源
    @LayoutRes
    private var loadingLayoutRes = View.NO_ID
        get() = if (field == View.NO_ID) StateConfig.loadingLayoutRes else field

    // error布局资源
    @LayoutRes
    private var errorLayoutRes = View.NO_ID
        get() = if (field == View.NO_ID) StateConfig.errorLayoutRes else field

    // 保存状态
    private val stateInfoMap = ArrayMap<Int, View>()

    // 当前状态
    private var currentState = STATE_CONTENT

    // 需要设置点击事件的id
    private var retryIds: IntArray? = null
        get() = field ?: StateConfig.retryIds

    private var mOnStateChangeListener: OnStateChangeListener? = null
        get() = field ?: StateConfig.getOnStateChangeListener()

    init {
        val a: TypedArray = context.obtainStyledAttributes(attrs, R.styleable.StateLayout)
        emptyLayoutRes = a.getResourceId(R.styleable.StateLayout_empty_layout, View.NO_ID)
        loadingLayoutRes = a.getResourceId(R.styleable.StateLayout_loading_layout, View.NO_ID)
        errorLayoutRes = a.getResourceId(R.styleable.StateLayout_error_layout, View.NO_ID)
        a.recycle()
    }

    override fun onFinishInflate() {
        super.onFinishInflate()
        if (childCount != 1) {
            throw IllegalStateException("StateLayout必须只能有一个子View")
        }
        if (stateInfoMap.size == 0) {
            val view = getChildAt(0)
            setContentView(view)
        }
    }

    /**
     * 设置内容布局
     */
    private fun setContentView(contentView: View) {
        stateInfoMap[STATE_CONTENT] = contentView
    }

    /**
     * 设置点击事件
     */
    fun setRetryIds(@IdRes vararg ids: Int) {
        retryIds = ids
    }

    /**
     * 设置状态变化监听
     */
    fun setOnStateChangeListener(listener: OnStateChangeListener) {
        mOnStateChangeListener = listener
    }

    /**
     * 显示内容布局
     */
    fun showContent() {
        showState(STATE_CONTENT)
    }

    /**
     * 显示加载布局
     */
    fun showLoading() {
        showState(STATE_LOADING)
    }

    /**
     * 显示失败布局
     */
    fun showError() {
        showState(STATE_ERROR)
    }

    /**
     * 显示空布局
     */
    fun showEmpty() {
        showState(STATE_EMPTY)
    }

    /**
     * 显示视图
     */
    private fun showState(status: Int) {
        if (currentState == status) {
            return
        }
        val stateView = getStateView(status)
        for (i in stateInfoMap) {
            if (i.key != status) {
                val view = i.value
                hideStateView(view)
            }
        }
        showStateView(this, stateView, status)
        mOnStateChangeListener?.showState(status)
        currentState = status
    }

    /**
     * 获取状态视图
     */
    private fun getStateView(status: Int): View {
        val view = stateInfoMap[status]
        if (view != null) {
            return view
        } else {
            val layoutRes = when (status) {
                STATE_EMPTY -> emptyLayoutRes
                STATE_ERROR -> errorLayoutRes
                STATE_LOADING -> loadingLayoutRes
                STATE_CONTENT -> View.NO_ID
                else -> View.NO_ID
            }
            if (layoutRes == View.NO_ID) {
                when (status) {
                    STATE_ERROR -> throw Resources.NotFoundException("请设置errorLayout")
                    STATE_EMPTY -> throw Resources.NotFoundException("请设置emptyLayout")
                    STATE_LOADING -> throw Resources.NotFoundException("请设置loadingLayout")
                    STATE_CONTENT -> throw Resources.NotFoundException("请设置contentView")
                }
            }
            val view = LayoutInflater.from(context).inflate(layoutRes, this, false)
            stateInfoMap[status] = view
            return view
        }
    }

    /**
     * 隐藏视图
     */
    private fun hideStateView(view: View) {
        view.visibility = View.GONE
    }

    /**
     * 显示视图
     */
    private fun showStateView(container: StateLayout, view: View, status: Int) {
        if (container.indexOfChild(view) != -1) {
            view.visibility = View.VISIBLE
        } else {
            if (status == STATE_EMPTY || status == STATE_ERROR) {
                if (retryIds != null) {
                    for (id in retryIds!!) {
                        view.findViewById<View>(id).setOnClickListener {
                            showLoading()
                        }
                    }
                }
            }
            container.addView(view)
        }
    }
}
```



## 使用

**使用全局配置：**

```xml
<com.example.tools.state_layout.widgets.StateLayout
    android:id="@+id/state_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center"
        android:text="加载成功" />
</com.example.tools.state_layout.widgets.StateLayout>
```

```kotlin
StateConfig.emptyLayoutRes = R.layout.state_empty
StateConfig.errorLayoutRes = R.layout.state_error
StateConfig.loadingLayoutRes = R.layout.state_loading
StateConfig.retryIds = intArrayOf(R.id.state_msg, R.id.state_iv)

StateConfig.setOnStateChangeListener(object : OnStateChangeListener {
    override fun showState(status: Int) {
        when (status) {
            StateLayout.STATE_LOADING -> {
                LogUtils.e("StateLayout", "显示加载页")
                postDelayed({
                    stateLayout.showContent()
                }, 2000L)
            }
            StateLayout.STATE_CONTENT -> {
                LogUtils.e("StateLayout", "显示内容页")
            }
            StateLayout.STATE_ERROR -> {
                LogUtils.e("StateLayout", "显示失败页")
            }
            StateLayout.STATE_EMPTY -> {
                LogUtils.e("StateLayout", "显示空页")
            }
        }
    }
})
```

**使用局部配置：**

```xml
<com.example.tools.state_layout.widgets.StateLayout
    android:id="@+id/state_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:empty_layout="@layout/state_empty"
    app:error_layout="@layout/state_error"
    app:loading_layout="@layout/state_loading">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center"
        android:text="加载成功" />
</com.example.tools.state_layout.widgets.StateLayout>
```

```kotlin
stateLayout.setRetryIds(R.id.state_msg, R.id.state_iv)
stateLayout.setOnStateChangeListener(object : OnStateChangeListener {
    override fun showState(status: Int) {
        when (status) {
            StateLayout.STATE_LOADING -> {
                LogUtils.e("StateLayout", "显示加载页")
                postDelayed({
                    stateLayout.showContent()
                }, 2000L)
            }
            StateLayout.STATE_CONTENT -> {
                LogUtils.e("StateLayout", "显示内容页")
            }
            StateLayout.STATE_ERROR -> {
                LogUtils.e("StateLayout", "显示失败页")
            }
            StateLayout.STATE_EMPTY -> {
                LogUtils.e("StateLayout", "显示空页")
            }
        }
    }
})
```



## [源码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/state_layout)

