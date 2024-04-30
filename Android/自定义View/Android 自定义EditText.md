[toc]

# Android 自定义EditText

## 概述

定义一款可清空内容的 ClearEditText 和可显示密码的 PasswordEditText，支持修改提示图标和大小、背景图片等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1ffe25db212d43709851276ccacce845.png)



## 源码

**基类：**

```kotlin
open class BaseEditText @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.editTextStyle
) : androidx.appcompat.widget.AppCompatEditText(context, attrs, defStyleAttr) {

    companion object {
        @JvmStatic
        protected val DEFAULT_DRAWABLE = ColorDrawable(0xFFFFFFFF.toInt())
    }

    init {
        gravity = Gravity.CENTER_VERTICAL
        background = DEFAULT_DRAWABLE
    }

    override fun setLayoutParams(params: ViewGroup.LayoutParams) {
        if (params.width == ViewGroup.LayoutParams.WRAP_CONTENT) {
            params.width = ViewGroup.LayoutParams.MATCH_PARENT
        }
        super.setLayoutParams(params)
    }
}
```

### 可清空内容的EditText

**定义属性：**

```xml
<declare-styleable name="ClearEditText">
    <attr name="cet_deleteIcon" format="reference" />
    <attr name="cet_deleteIconSize" format="dimension" />
    <attr name="cet_tipDefaultIcon" format="reference" />
    <attr name="cet_tipSelectedIcon" format="reference" />
    <attr name="cet_tipIconSize" format="dimension" />
    <attr name="cet_defaultBg" format="color|reference" />
    <attr name="cet_selectedBg" format="color|reference" />
</declare-styleable>
```

**定义ClearEditText：**

```kotlin
class ClearEditText @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : BaseEditText(context, attrs) {

    private val deleteIconDrawable: Drawable?
    private val tipIconDefaultDrawable: Drawable?
    private val tipIconSelectedDrawable: Drawable?
    private val bgDefaultDrawable: Drawable?
    private val bgSelectedDrawable: Drawable?

    init {
        val a: TypedArray = context.obtainStyledAttributes(attrs, R.styleable.ClearEditText)
        val deleteIconSize =
            a.getDimensionPixelSize(R.styleable.ClearEditText_cet_deleteIconSize, 0)
        deleteIconDrawable = a.getDrawable(R.styleable.ClearEditText_cet_deleteIcon)
        deleteIconDrawable?.let { it ->
            if (deleteIconSize > 0) {
                it.setBounds(0, 0, deleteIconSize, deleteIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        val tipIconSize = a.getDimensionPixelSize(R.styleable.ClearEditText_cet_tipIconSize, 0)
        tipIconDefaultDrawable = a.getDrawable(R.styleable.ClearEditText_cet_tipDefaultIcon)
        tipIconDefaultDrawable?.let { it ->
            if (tipIconSize > 0) {
                it.setBounds(0, 0, tipIconSize, tipIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        tipIconSelectedDrawable = a.getDrawable(R.styleable.ClearEditText_cet_tipSelectedIcon)
        tipIconSelectedDrawable?.let { it ->
            if (tipIconSize > 0) {
                it.setBounds(0, 0, tipIconSize, tipIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        bgDefaultDrawable = a.getDrawable(R.styleable.ClearEditText_cet_defaultBg)
        bgSelectedDrawable = a.getDrawable(R.styleable.ClearEditText_cet_selectedBg)
        a.recycle()

        setup()
    }

    private fun setup() {
        setIconVisible(false, false)
        bgDefaultDrawable?.let {
            background = it
        }
    }

    override fun onTextChanged(
        text: CharSequence,
        start: Int,
        lengthBefore: Int,
        lengthAfter: Int
    ) {
        super.onTextChanged(text, start, lengthBefore, lengthAfter)
        setIconVisible(hasFocus() && text.length > 0, hasFocus())
    }

    override fun onFocusChanged(focused: Boolean, direction: Int, previouslyFocusedRect: Rect?) {
        super.onFocusChanged(focused, direction, previouslyFocusedRect)
        setIconVisible(focused && length() > 0, focused)
    }

    private fun setIconVisible(deleteIconVisible: Boolean, focused: Boolean) {
        setCompoundDrawablesRelative(
            if (focused) tipIconSelectedDrawable else tipIconDefaultDrawable,
            null,
            if (deleteIconVisible) deleteIconDrawable else null,
            null
        )
        if (bgDefaultDrawable != null && bgSelectedDrawable != null) {
            background = if (focused) bgSelectedDrawable else bgDefaultDrawable
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_UP) {
            val drawable = deleteIconDrawable
            if (drawable != null) {
                if (event.x <= width - paddingRight && event.x >= width - paddingRight - drawable.bounds.width()) {
                    text = null
                }
            }
        }
        return super.onTouchEvent(event)
    }
}
```

### 可显示密码的EditText

**定义属性：**

```xml
<declare-styleable name="PasswordEditText">
    <attr name="pet_eyeIconSize" format="dimension" />
    <attr name="pet_tipDefaultIcon" format="reference" />
    <attr name="pet_tipSelectedIcon" format="reference" />
    <attr name="pet_tipIconSize" format="dimension" />
    <attr name="pet_defaultBg" format="color|reference" />
    <attr name="pet_selectedBg" format="color|reference" />
</declare-styleable>
```

**定义PasswordEditText：**

```kotlin
class PasswordEditText @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : BaseEditText(context, attrs) {

    private val eyeOpenDrawable: Drawable?
    private val eyeCloseDrawable: Drawable?
    private var currentEyeDrawable: Drawable? = null
    private var tipIconDefaultDrawable: Drawable?
    private var tipIconSelectedDrawable: Drawable?
    private var bgDefaultDrawable: Drawable?
    private var bgSelectedDrawable: Drawable?

    init {
        val a: TypedArray = context.obtainStyledAttributes(attrs, R.styleable.PasswordEditText)

        val eyeIconSize = a.getDimensionPixelSize(R.styleable.PasswordEditText_pet_eyeIconSize, 0)
        eyeOpenDrawable = ContextCompat.getDrawable(context, R.drawable.eye_open)
        eyeOpenDrawable?.let {
            if (eyeIconSize > 0) {
                it.setBounds(0, 0, eyeIconSize, eyeIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        eyeCloseDrawable = ContextCompat.getDrawable(context, R.drawable.eye_close)
        eyeCloseDrawable?.let {
            if (eyeIconSize > 0) {
                it.setBounds(0, 0, eyeIconSize, eyeIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        val tipIconSize = a.getDimensionPixelSize(R.styleable.PasswordEditText_pet_tipIconSize, 0)
        tipIconDefaultDrawable = a.getDrawable(R.styleable.PasswordEditText_pet_tipDefaultIcon)
        tipIconDefaultDrawable?.let { it ->
            if (tipIconSize > 0) {
                it.setBounds(0, 0, tipIconSize, tipIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        tipIconSelectedDrawable = a.getDrawable(R.styleable.PasswordEditText_pet_tipSelectedIcon)
        tipIconSelectedDrawable?.let { it ->
            if (tipIconSize > 0) {
                it.setBounds(0, 0, tipIconSize, tipIconSize)
            } else {
                it.setBounds(0, 0, it.intrinsicWidth, it.intrinsicHeight)
            }
        }
        bgDefaultDrawable = a.getDrawable(R.styleable.PasswordEditText_pet_defaultBg)
        bgSelectedDrawable = a.getDrawable(R.styleable.PasswordEditText_pet_selectedBg)
        a.recycle()

        setup()
    }

    private fun setup() {
        setIconVisible(false, false)
        currentEyeDrawable = eyeCloseDrawable
        bgDefaultDrawable?.let {
            background = it
        }
        inputType = InputType.TYPE_TEXT_VARIATION_PASSWORD
        transformationMethod = PasswordTransformationMethod.getInstance()
    }

    override fun onTextChanged(
        text: CharSequence,
        start: Int,
        lengthBefore: Int,
        lengthAfter: Int
    ) {
        super.onTextChanged(text, start, lengthBefore, lengthAfter)
        setIconVisible(hasFocus() && text.length > 0, hasFocus())
    }

    override fun onFocusChanged(focused: Boolean, direction: Int, previouslyFocusedRect: Rect?) {
        super.onFocusChanged(focused, direction, previouslyFocusedRect)
        setIconVisible(focused && length() > 0, focused)
    }

    private fun setIconVisible(pwdIconVisible: Boolean, focused: Boolean) {
        setCompoundDrawablesRelative(
            if (focused) tipIconSelectedDrawable else tipIconDefaultDrawable,
            null,
            if (pwdIconVisible) currentEyeDrawable else null,
            null
        )
        if (bgDefaultDrawable != null && bgSelectedDrawable != null) {
            background = if (focused) bgSelectedDrawable else bgDefaultDrawable
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_UP) {
            val drawable = currentEyeDrawable
            if (drawable != null) {
                if (event.x <= width - paddingRight && event.x >= width - paddingRight - drawable.bounds.width()) {
                    if (drawable == eyeOpenDrawable) {
                        // 密码不可见
                        currentEyeDrawable = eyeCloseDrawable
                        transformationMethod = PasswordTransformationMethod.getInstance()
                        refreshDrawables()
                    } else if (drawable == eyeCloseDrawable) {
                        // 密码可见
                        currentEyeDrawable = eyeOpenDrawable
                        transformationMethod = HideReturnsTransformationMethod.getInstance()
                        refreshDrawables()
                    }
                }
            }
        }
        return super.onTouchEvent(event)
    }

    private fun refreshDrawables() {
        val drawables = compoundDrawablesRelative
        setCompoundDrawablesRelative(drawables[0], drawables[1], currentEyeDrawable, drawables[3])
    }
}
```



## 使用

```xml
<com.example.widgets.custom_edittext.ClearEditText
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="30dp"
    android:layout_marginTop="60dp"
    android:hint="请输入用户名"
    android:padding="10dp"
    android:singleLine="true"
    android:textSize="20sp"
    app:cet_defaultBg="@drawable/shape_border_gray"
    app:cet_deleteIcon="@drawable/ic_delete_x"
    app:cet_deleteIconSize="30dp"
    app:cet_selectedBg="@drawable/shape_border_blue"
    app:cet_tipDefaultIcon="@drawable/ic_user_gray"
    app:cet_tipIconSize="30dp"
    app:cet_tipSelectedIcon="@drawable/ic_user_blue" />

<com.example.widgets.custom_edittext.ClearEditText
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="30dp"
    android:layout_marginTop="30dp"
    android:hint="请输入手机号"
    android:inputType="phone"
    android:padding="10dp"
    android:textSize="20sp"
    app:cet_defaultBg="@drawable/shape_border_gray"
    app:cet_deleteIcon="@drawable/ic_delete_x"
    app:cet_deleteIconSize="30dp"
    app:cet_selectedBg="@drawable/shape_border_blue"
    app:cet_tipDefaultIcon="@drawable/ic_user_gray"
    app:cet_tipIconSize="30dp"
    app:cet_tipSelectedIcon="@drawable/ic_user_blue" />

<com.example.widgets.custom_edittext.PasswordEditText
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="30dp"
    android:layout_marginTop="30dp"
    android:hint="请输入密码"
    android:padding="10dp"
    android:textSize="20sp"
    app:pet_defaultBg="@drawable/shape_border_gray"
    app:pet_selectedBg="@drawable/shape_border_blue"
    app:pet_tipDefaultIcon="@drawable/ic_lock_gray"
    app:pet_tipIconSize="30dp"
    app:pet_tipSelectedIcon="@drawable/ic_lock_blue" />
```



## [源码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/my_edittext)

