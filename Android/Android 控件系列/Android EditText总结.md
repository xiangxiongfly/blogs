[toc]

# Android EditText总结

## 常用属性

```
android:layout_width：控件宽度
android:layout_height：控件高度
android:visibility：控件是否可见
android:maxLength：设置文字最大长度 
android:maxLines：设置最大行数 
android:maxEms：设置每行最多有几个字符 
android:text：设置文字 
android:textColor：设置文字颜色 
android:textSize“设置文字大小 
android:fontFamily：设置字体样式 
android:hint：设置占位文字
android:textColorHint：设置占位文字颜色 
android:textStyle：设置文字样式，可选为normal, bold, italic, bold|italic 
android:gravity：文字对齐方式,可选有		 top,bottom,left,right,center_vertical,fill_vertical,center_horizontal,fill_horizontal,center,fill,clip_vertical,clip_horizontal,start,end 
android:layout_gravity：设置控件相对父容器的位置,可选自动同android:gravity 
android:digits：指定输入框仅可接受指定的字符 
android:textScaleX：设置字间距 
android:editable：设置输入框是否可编辑 
android:focusableInTouchMode：控制视图在触摸模式下是否可获得焦点 
android:focusable：设置控件是否可以获得焦点 
android:selectAllOnFocus：设置控件获得焦点后是否全选文字 
android:imeOptions：设置软件盘功能键显示样式,常用选项为actionGo显示Go,actionSearch搜索,actionSend发送,actionNext下一个,actionDone完成 
android:background：设置控件背景,一般为@null 
android:enabled：是否开启组件 
android:clickable：设置控件是否可以点击 
android:digits：设置接受的字符集
android:inputType：设置输入类型
```

### inputType 

inputType 指定键盘样式。

```
android:inputType指定键盘样式, 有以下可选 
none没有内容类型。文本不可编辑 
text简单的文本格式 
textCapCharacters字母大写 
textCapWords首字母大写 
textCapSentences毎一段的第一个字母大写 
textAutoCorrect自动更正文本 
textAutoComplete自动更正文本 
textMultiLine允许多行输出, 默认为一行 
textImeMultiLine如果支持ime可以多行输入 
textNoSuggestions不显示任何提示 
textUri指定输入框输入的类型为一个网址 
textEmailAddress指定输入框输入的类型为邮箱 
textEmailSubject表示文字是一个邮件主题 
textShortMessage短消息内容 
textLongMessage长消息内容 
textPersonName表示输入的为人名 
textPostalAddress表示文本为地址 
textPassword指定输入框输入类型为密码 
textVisiblePassword表示输入的密码为可见状态 
textWebEditText表示当前为网页输入框 
textFilter过滤一些其他数据的文本 
textPhonetic表示当前为拼音输入 
textWebEmailAddress将用作 Web 表单上的电子邮件地址的文本 
textWebPassword将用作网络表单密码的文本。 
number指定输入框仅支持数字类型 
numberSigned指定输入框支持带符号的数值类型 
numberDecimal指定输入框支持小数点的数值类型 
numberPassword 指定输入仅支持数字类型的密码 
phone指定输入框仅支持手机号码输入 
datetime指定输入框用于输入日期和时间 
date指定输入框用于输入日期 
time指定输入框用于输入时间 
```



## 常用功能

### 获取焦点

```
editText.requestFocus()
```

### 强制获取焦点

```
editText.setFocusable(true)
editText.setFocusableInTouchMode(true)
editText.requestFocus()
```

### 清除焦点

```
editText.clearFocus()
```

### 设置光标位置

可能会报 `java.lang.IndexOutOfBoundsException` 异常。

```
editText.setSelection(5)
```

### 设置图片

```
editText.setCompoundDrawablesWithIntrinsicBounds(leftDrawable, null, rightDrawable, null)
```

### 监听文字变化

```
editText.addTextChangedListener(new TextWatcher())
```

### 监听焦点变化

```
editText.setOnFocusChangeListener(new View.OnFocusChangeListener())
```

### 设置软键盘回车键

`imeOptions` 属性值和对应的效果：

- `actionGo`：右下角按键显示“开始”。
- `actionSearch`：右下角显示放大镜，对应搜索功能场景。
- `actionSend`：右下角按键内容为“发送”，一般用于即时聊天页面。
- `actionNext`：右下角按键内容为“下一步”或者“下一项”，会跳到下一个 `EditText`。
- `actionDone`：右下角按键内容为“完成”。
- `actionNone`：无任何提示。
- `flagNoExtractUi`：使软键盘不全屏显示，只占用一部分屏幕，右下角按键为默认回车键。

如果设置了 `imeOptions` 属性后软键盘没有发生变化，需要同时设置 `android:singleLine="true"` 或者 `android:inputType="text"` 属性。

```xml
<EditText
    android:id="@+id/editText"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:imeOptions="actionSearch"
    android:singleLine="true" />
```

```kotlin
editText.setOnEditorActionListener(object : TextView.OnEditorActionListener {
    override fun onEditorAction(v: TextView?, actionId: Int, event: KeyEvent?): Boolean {
        if (EditorInfo.IME_ACTION_SEARCH == actionId) {
            Toast.makeText(context, "${editText.text}", Toast.LENGTH_SHORT).show()
            return true
        }
        return false
    }
})
```

### 屏蔽复制粘贴功能

```
editText.setOnLongClickListener { true }
editText.setCustomSelectionActionModeCallback(object : ActionMode.Callback {
    override fun onCreateActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        return false
    }

    override fun onPrepareActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        return false
    }

    override fun onActionItemClicked(mode: ActionMode?, item: MenuItem?): Boolean {
        return false
    }

    override fun onDestroyActionMode(mode: ActionMode?) {

    }
})
```

### 软键盘的显示和隐藏（工具类）

```java
public class KeyboardUtils {

    /**
     * 显示软键盘 
     */
    public static void showSoftInput(EditText editText) {
        if (editText == null)
            return;
        InputMethodManager imm = (InputMethodManager) JKBApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null)
            return;
        editText.setFocusable(true);
        editText.setFocusableInTouchMode(true);
        editText.requestFocus();
        imm.showSoftInput(editText, 0);
    }

    /**
     * 隐藏软键盘 
     */
    public static void hideSoftInput(View view) {
        if (view == null)
            return;
        InputMethodManager inputMethodManager = (InputMethodManager) JKBApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (inputMethodManager == null)
            return;
        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    /**
     * 隐藏软键盘 
     */
    public static void hideSoftInput(EditText editText) {
        if (editText == null)
            return;
        InputMethodManager inputMethodManager = (InputMethodManager) JKBApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (inputMethodManager == null)
            return;
        editText.clearFocus();
        inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(), 0);
    }

    /**
     * 隐藏软键盘 
     */
    public static void hideSoftInput(Activity activity) {
        Window window = activity.getWindow();
        View view = window.getCurrentFocus();
        if (view == null) {
            view = window.getDecorView();
        }
        hideSoftInput(view);
    }

    /**
     * 软键盘切换
     */
    public static void toggleSoftInput() {
        InputMethodManager imm = (InputMethodManager) JKBApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null)
            return;
        imm.toggleSoftInput(0, 0);
    }
}
```



## 限制输入

在 Android 中，EditText 可以使用 InputFilter 来对输入内容进行过滤和限制。

```java
public interface InputFilter{

    // source：新输入的内容
    // start：开始位置
    // end：结束位置
    // dest：原始内容
    // dstart：原始内容开始位置
    // dend：原始内容结束位置
    // 返回值：如果返回null，表示不进行任何过滤；如果返回空字符串""，表示清空原始内容；否则，返回过滤后的字符串。
    public CharSequence filter(CharSequence source, int start, int end,
                               Spanned dest, int dstart, int dend);
}
```

### 方法一：InputFilter

#### 限制输入长度为10

```kotlin
val lengthFilter = InputFilter.LengthFilter(10)
editText.filters = arrayOf<InputFilter>(lengthFilter)
```

#### 只允许输入手机号

```kotlin
@JvmStatic
fun getPhoneFilter(): InputFilter {
    return object : InputFilter {
        override fun filter(
            source: CharSequence?,
            start: Int,
            end: Int,
            dest: Spanned,
            dstart: Int,
            dend: Int
        ): CharSequence? {
            val regex = "[1]\\d{0,10}"
            val dBuilder = StringBuilder(dest.toString())
            if (dstart == dend) {
                // 增加操作
                val result = dBuilder.insert(dstart, source.toString())
                if (!Pattern.matches(regex, result)) {
                    return ""
                }
            } else {
                // 删除操作
                if (dBuilder.length >= dend) {
                    val result = dBuilder.delete(dstart, dend)
                    if (result.isNotEmpty()) {
                        if (Pattern.matches(regex, result)) {
                            return null
                        } else {
                            return dest.toString().substring(dstart, dend)
                        }
                    }
                }
            }
            return null
        }
    }
}
```

```kotlin
val decimalFilter = EditTextUtils.getPhoneFilter()
editText.filters = arrayOf<InputFilter>(isPhoneFilter)
```

#### 只允许输入中文

仅需将修改regex。

```kotlin
val regex = "[\\u4e00-\\u9fa5]*"
```

#### 只允许输入中文、英文、数字

仅需将修改regex。

```kotlin
val regex = "[[\\u4e00-\\u9fa5]|[a-zA-Z]|\\d]*"
```

#### 小数点自动补0

```kotlin
object EditTextUtils {
    @JvmStatic
    fun getTwoDecimalFilter() = getDecimalFilter(2)

    @JvmStatic
    fun getDecimalFilter(count: Int): InputFilter {
        val count: Int = if (count < 0) {
            0
        } else {
            count + 1
        }
        return object : InputFilter {
            override fun filter(
                source: CharSequence,
                start: Int,
                end: Int,
                dest: Spanned,
                dstart: Int,
                dend: Int
            ): CharSequence? {
                val srcStr = source.toString()
                val destStr = dest.toString()
                if ("." == srcStr && dest.isEmpty()) {
                    return "0."
                }
                if ("0" == srcStr && destStr == "0") {
                    return ""
                }
                if (destStr.contains(".")) {
                    val index = destStr.indexOf(".")
                    val decimalLength = destStr.substring(index).length
                    if (decimalLength == count) {
                        return ""
                    }
                }
                return null
            }
        }
    }
}
```

```kotlin
val decimalFilter = EditTextUtils.getTwoDecimalFilter()
editText.inputType = InputType.TYPE_NUMBER_FLAG_DECIMAL or InputType.TYPE_CLASS_NUMBER
editText.filters = arrayOf(decimalFilter)

val decimalFilter2 = EditTextUtils.getDecimalFilter(3)
editText2.inputType = InputType.TYPE_NUMBER_FLAG_DECIMAL or InputType.TYPE_CLASS_NUMBER
editText2.filters = arrayOf(decimalFilter2)
```

### 方法二：TextWatcher

#### 只允许输入数字、英文

```kotlin
val textWatcher = object : TextWatcher {
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
    }

    override fun afterTextChanged(s: Editable) {
        val value = s.toString()
        if (value.isEmpty()) {
            return
        }
        if (!Pattern.matches("[A-Za-z0-9]+", value)) {
            Toast.makeText(context, "请输入数字或字母", Toast.LENGTH_SHORT).show()
            val temp = s.toString()
            s.delete(temp.length - 1, temp.length)
            editText.setSelection(s.length)
        }
    }
}
editText.addTextChangedListener(textWatcher)
```

#### 限制输入长度为10

```kotlin
val textWatcher = object : TextWatcher {
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
    }

    override fun afterTextChanged(s: Editable) {
        val value = s.toString()
        if (value.isEmpty()) {
            return
        }
        if (value.length > 10) {
            s.delete(10, value.length)
            editText.setSelection(s.length)
            Toast.makeText(context, "最多输入10个字符", Toast.LENGTH_SHORT).show()
        }
    }
}
editText.addTextChangedListener(textWatcher)
```

### 方法三：OnFocusChangeListener

#### 自动填充占位符

````kotlin
object EditTextUtils {

    /**
     * 自动填充
     */
    @JvmStatic
    fun setAutoFill(editText: EditText, number: Int, placeholder: String = "#") {
        editText.setOnFocusChangeListener(object : View.OnFocusChangeListener {
            override fun onFocusChange(v: View?, hasFocus: Boolean) {
                if (!hasFocus) {
                    setFill(editText, number, placeholder)
                }
            }
        })
    }

    /**
     * 填充
     */
    @JvmStatic
    fun setFill(editText: EditText, number: Int, placeholder: String = "#") {
        val value = editText.text.toString()
        val builder = StringBuilder(value)
        synchronized(editText) {
            while (builder.length < number) {
                builder.insert(0, placeholder)
            }
        }
        editText.setText(builder.toString())
    }
}
````

```kotlin
EditTextUtils.setAutoFill(editText, 3)
EditTextUtils.setAutoFill(editText2, 4, "0")
```

### 方法四：XML属性

#### 只允许输入数字

```xml
<EditText
    android:id="@+id/editText"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="number"
    android:digits="0123456789" />
```

#### 只允许输入0~9和a~z

```xml
<EditText
    android:id="@+id/editText"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="text"
    android:digits="0123456789abcdefghijklmnopqrstuvwxyz" />
```



## windowSoftInputMode属性

```
<activity 
    android:name=".MainActivity"
    android:windowSoftInputMode="stateHidden|adjustResize">
</activity>
```

**软键盘状态**

| 属性值             | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| stateUnspecified   | 软键盘的默认状态由系统决定。<br />如：Activity中有一个EditText不会显示键盘，但使用ScrollView嵌套后，会显示键盘。 |
| stateUnchanged     | 软键盘的状态与上一个页面的状态保持一致。                     |
| stateHidden        | 初次进入界面时，隐藏软键盘。                                 |
| stateAlwaysHidden  | 无论是初次进入界面还是从其他界面导航回来，总是隐藏软键盘。   |
| stateVisible       | 初次进入界面时，显示软键盘。                                 |
| stateAlwaysVisible | 无论是初次进入界面还是从其他界面导航回来，总是显示软键盘。   |

**布局变化**

| 属性值            | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| adjustUnspecified | 系统默认设置。                                               |
| adjustResize      | 当软键盘显示时，窗口会调整大小，为软键盘腾出控件，从底部抬起键盘高度，顶部保持不变，中间区域可能被底部顶上的内容覆盖。 |
| adjustPan         | 当软键盘显示时，窗口不会调整大小，而是会向上平移。           |
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

