[TOC]

# Android EditText与软键盘

## windowSoftInputMod 属性

**软键盘状态**

| 属性值             | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| stateUnspecified   | 系统默认行为。系统会根据不同场景决定键盘显示状态，如Activity中有一个EditText不会显示键盘，但使用ScrollView嵌套后，会显示键盘。 |
| stateUnchanged     | 下一个界面的显示状态与当前界面保持一致。                     |
| stateHidden        | 初次进入界面时，隐藏键盘。                                   |
| stateAlwaysHidden  | 无论是初次进入界面还是从其他界面导航回来，总是隐藏键盘。     |
| stateVisible       | 初次进入界面时，显示键盘。                                   |
| stateAlwaysVisible | 无论是初次进入界面还是从其他界面导航回来，总是显示键盘。     |

**布局变化**

| 属性值            | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| adjustUnspecified | 系统默认设置，由系统决定                                     |
| adjustResize      | 调整界面的尺寸，从底部抬起键盘高度，顶部保持不变，中间区域可能被底部顶上的内容覆盖。 |
| adjustPan         | 键盘会顶到焦点下面，window整体会向上抬起。                   |
| adjustNothing     | 布局没有变化，键盘覆盖在布局上面。                           |



### adjustPan & adjustResize的区别

**adjustPan**

adjustPan：软键盘会顶在焦点下面，window会被顶起抬升，但是DecorView和ContentView的高度没有影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/570e3162327f46359aaa57b47ecb6f91.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_15,color_FFFFFF,t_70,g_se,x_16)

```kotlin
Log.e("TAG","""
    adjustPan:
    contentIdView: ${contentIdView.height}  ${contentIdView.measuredHeight}
    decorView: ${decorView.height}  ${decorView.measuredHeight}
""".trimIndent())
```

```
软键盘展开：
    contentIdView: 2153  2153
    decorView: 2400  2400

软键盘收起：
    contentIdView: 2153  2153
    decorView: 2400  2400
```

**adjustResize**

adjustResize：可能会调整界面尺寸，ContentView可能会缩小。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c3c6e3753d564d2699d8b224e565f9e8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_14,color_FFFFFF,t_70,g_se,x_16)

```
软键盘展开：
    contentIdView: 2153  2153
    decorView: 2400  2400

软键盘收起：
    contentIdView: 1344  1344
    decorView: 2400  2400
```



## EditText 获取焦点 & 失去焦点

```kotlin
//获取焦点
editText.isFocusable = true;
editText.isFocusableInTouchMode = true;
editText.requestFocus()

//失去焦点
editText.clearFocus()
```



## 软键盘工具类

```kotlin
/**
 * 软键盘工具类
 */
object KeyboardUtils {
    /**
     * 显示软键盘
     * 需要先 requestFocus 获取焦点，如果是在 Activity Create，那么需要延迟一段时间
     */
    fun showKeyboard(view: View?) {
        if (view == null)
            return
        val manager: InputMethodManager = view.context
            .getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        manager.showSoftInput(view, 0)
    }

    /**
     * 强制显示软键盘，页面滚动时不会收起
     */
    fun forceShowKeyboard(view: EditText?) {
        if (view == null)
            return
        val manager: InputMethodManager = view.context
            .getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        manager.showSoftInput(view, InputMethodManager.SHOW_FORCED)
    }

    /**
     * 隐藏软键盘
     */
    fun hideKeyboard(view: View?) {
        if (view == null)
            return
        val manager: InputMethodManager =
            view.context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        manager.hideSoftInputFromWindow(view.windowToken, 0)
    }

    /**
     * 强制隐藏软键盘
     * 谨慎使用，需要判断软键盘是否开启
     */
    fun forceHideKeyboard() {
        object : Thread() {
            override fun run() {
                try {
                    val inst = Instrumentation()
                    inst.sendKeyDownUpSync(KeyEvent.KEYCODE_BACK)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }.start()
    }

    /**
     * 切换软键盘
     */
    fun toggleSoftInput(view: View?) {
        if (view == null)
            return
        val manager: InputMethodManager = view.context
            .getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        manager.toggleSoftInput(0, 0)
    }
}
```



