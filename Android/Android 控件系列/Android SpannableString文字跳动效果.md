# Android SpannableString文字跳动效果



![在这里插入图片描述](https://img-blog.csdnimg.cn/47887ba0fe4c4d0e985465f7c4a642c6.gif)

**Kotlin代码**

```kotlin
class TextStyleActivity : BaseActivity() {
    private lateinit var textView: TextView

    private var text: String = ""
    private var position: Int = 0

    companion object {
        const val DELAY_TIME = 150L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_text_style)
        textView = findViewById(R.id.textView)

        text = textView.text.toString()
        mHandler.sendEmptyMessageDelayed(0, DELAY_TIME)
    }

    private val mHandler: Handler = object : Handler(Looper.getMainLooper()) {
        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)
            val span = SpannableString(text).apply {
                setSpan(
                    RelativeSizeSpan(1.5F),
                    position,
                    position + 1,
                    Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
                )
            }
            textView.text = span
            position++
            if (position >= text.length) {
                position = 0
            }
            this.sendEmptyMessageDelayed(0, DELAY_TIME)
        }
    }
}
```

**XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".span.text_style.TextStyleActivity">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="看，这里的文字会动哦！"
        android:textColor="#0099EE"
        android:textSize="16sp" />

</FrameLayout>
```

