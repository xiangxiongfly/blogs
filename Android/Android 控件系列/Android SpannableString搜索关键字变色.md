# Android SpannableString搜索关键字变色



![在这里插入图片描述](https://img-blog.csdnimg.cn/d23719e4edfe4d26b4ec4d50e8b1a6c4.gif)

**kotlin代码**

```kotlin
class SpanSearchActivity : BaseActivity() {
    private lateinit var editText: EditText
    private lateinit var textView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_span_search)
        initView()
        initListener()
    }

    private fun initView() {
        editText = findViewById(R.id.editText)
        textView = findViewById(R.id.textView)
    }

    private fun initListener() {
        val text = textView.text.toString()
        editText.addTextChangedListener(
            object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }

                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                }

                override fun afterTextChanged(s: Editable?) {
                    val keyword = s.toString()
                    textView.text = matchKeyword(mContext, text, keyword, R.style.SearchStyle)
                }
            })
    }

    fun matchKeyword(
        context: Context,
        text: String,
        keyword: String,
        @StyleRes style: Int
    ): SpannableString {
        val span = SpannableString(text)
        val pattern = Pattern.compile(keyword)
        val matcher = pattern.matcher(span)
        while (matcher.find()) {
            val start = matcher.start()
            val end = matcher.end()
            span.setSpan(
                TextAppearanceSpan(context, style),
                start,
                end,
                Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
            )
        }
        return span
    }
}
```

**XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="10dp"
    tools:context=".span.SpanSearchActivity">

    <EditText
        android:id="@+id/editText"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <TextView
        android:id="@+id/textView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="@string/desc" />

</LinearLayout>
```

**样式文件**

```xml
<style name="SearchStyle">
    <item name="android:textColor">#FFFF0000</item>
</style>
```