[toc]

# Android 控件保持宽高比得几种方式

## adjustViewBounds

仅适用于 ImageView，保持横竖比。

```xml
<ImageView
           android:layout_width="match_parent"
           android:layout_height="wrap_content"
           android:layout_gravity="center"
           android:adjustViewBounds="true"
           android:scaleType="fitXY"
           android:src="@drawable/bg" />
```



## 百分比布局

宽高比为 16:9

```xml
<androidx.percentlayout.widget.PercentFrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ratio.PercentFragment">

    <ImageView
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="fitXY"
        android:src="@drawable/bg"
        app:layout_aspectRatio="178%"
        app:layout_widthPercent="100%" />

</androidx.percentlayout.widget.PercentFrameLayout>
```



## ConstraintLayout

宽高比为 16:9

```kotlin
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ratio.ConstraintLayoutFragment">

    <ImageView
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="fitXY"
        android:src="@drawable/bg"
        app:layout_constraintDimensionRatio="16:9"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```



## 自定义View

**自定义View：**

```xml
<declare-styleable name="MyRatioFrameLayout">
    <attr name="whRatio" format="string" />
</declare-styleable>
```

```kotlin
class MyRatioFrameLayout @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {
    private var widthRatio: Float = 0F
    private var heightRatio: Float = 0F

    init {
        val a = context.obtainStyledAttributes(attrs, R.styleable.MyRatioFrameLayout)
        val whRatio = a.getString(R.styleable.MyRatioFrameLayout_whRatio)
        a.recycle()
        whRatio?.let {
            val strs = it.split(":");
            when (strs.size) {
                1 -> {
                    widthRatio = strs[0].toFloat()
                    heightRatio = 1F
                }
                2 -> {
                    widthRatio = strs[0].toFloat()
                    heightRatio = strs[1].toFloat()
                }
            }
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        var wMeasureSpec = widthMeasureSpec
        var hMeasureSpec = heightMeasureSpec
        if (widthRatio != 0F && heightRatio != 0F) {
            val ratio = getRatio()
            val lp: ViewGroup.LayoutParams = layoutParams
            val widthMode = MeasureSpec.getMode(widthMeasureSpec)
            val widthSize = MeasureSpec.getSize(widthMeasureSpec)
            val heightMode = MeasureSpec.getMode(heightMeasureSpec)
            val heightSize = MeasureSpec.getSize(heightMeasureSpec)
            if (lp.width != ViewGroup.LayoutParams.WRAP_CONTENT && widthMode == MeasureSpec.EXACTLY &&
                lp.height != ViewGroup.LayoutParams.WRAP_CONTENT && heightMode == MeasureSpec.EXACTLY
            ) {
                // 宽度和高度都是固定值
                if (widthSize / ratio < heightSize) {
                    // 如果计算后高度小于原有高度
                    hMeasureSpec = MeasureSpec.makeMeasureSpec(
                        (widthSize / ratio).toInt(),
                        MeasureSpec.EXACTLY
                    )
                } else if (heightSize * ratio <= widthSize) {
                    // 如果计算后的宽度小于原有宽度
                    wMeasureSpec = MeasureSpec.makeMeasureSpec(
                        (heightSize * ratio).toInt(),
                        MeasureSpec.EXACTLY
                    )
                }
            } else if (lp.width != ViewGroup.LayoutParams.WRAP_CONTENT && widthMode == MeasureSpec.EXACTLY && heightMode != MeasureSpec.EXACTLY) {
                // 宽度固定值
                hMeasureSpec =
                    MeasureSpec.makeMeasureSpec((widthSize / ratio).toInt(), MeasureSpec.EXACTLY)

            } else if (lp.height != ViewGroup.LayoutParams.WRAP_CONTENT && heightMode == MeasureSpec.EXACTLY && widthMode != MeasureSpec.EXACTLY) {
                // 高度固定值
                wMeasureSpec =
                    MeasureSpec.makeMeasureSpec((heightSize * ratio).toInt(), MeasureSpec.EXACTLY)
            }
        }
        super.onMeasure(wMeasureSpec, hMeasureSpec)
    }

    fun setRatio(widthRatio: Float, heightRatio: Float) {
        this.widthRatio = widthRatio
        this.heightRatio = heightRatio
    }

    fun getRatio(): Float {
        return widthRatio / heightRatio
    }
}
```

**使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d2cd0acfb4ad49078b3b1afdefff606c.png)

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".ratio.RatioViewFragment">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <com.example.tools.ratio.MyRatioFrameLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="#ff0000"
            app:whRatio="16:9">

            <ImageView
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="fitXY"
                android:src="@drawable/bg" />
        </com.example.tools.ratio.MyRatioFrameLayout>

        <com.example.tools.ratio.MyRatioFrameLayout
            android:layout_width="200dp"
            android:layout_height="300dp"
            android:layout_marginTop="10dp"
            android:background="#00ff00"
            app:whRatio="16:9">

            <ImageView
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="fitXY"
                android:src="@drawable/bg" />
        </com.example.tools.ratio.MyRatioFrameLayout>

        <com.example.tools.ratio.MyRatioFrameLayout
            android:layout_width="300dp"
            android:layout_height="200dp"
            android:layout_marginTop="10dp"
            android:background="#0000ff"
            app:whRatio="16:9">

            <ImageView
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="fitXY"
                android:src="@drawable/bg" />
        </com.example.tools.ratio.MyRatioFrameLayout>

    </LinearLayout>
</ScrollView>
```

