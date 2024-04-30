[TOC]

# Android ViewPager不支持wrap_content的原因

## 问题

```xml
<androidx.viewpager.widget.ViewPager
    android:id="@+id/wrap_view_pager"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#666666" />
```

将 ViewPager 的高度设置为 wrap_content，但是实现显示的效果却是填充了整个父容器。



## 源码分析

```java
// ViewPager#onMeasure()
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    setMeasuredDimension(getDefaultSize(0, widthMeasureSpec),
            getDefaultSize(0, heightMeasureSpec));
}
```

```java
// View#getDefaultSize()
public static int getDefaultSize(int size, int measureSpec) {
    int result = size;
    int specMode = MeasureSpec.getMode(measureSpec);
    int specSize = MeasureSpec.getSize(measureSpec);

    switch (specMode) {
    case MeasureSpec.UNSPECIFIED:
        result = size;
        break;
    case MeasureSpec.AT_MOST:
    case MeasureSpec.EXACTLY:
        result = specSize;
        break;
    }
    return result;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8108094a6dc64e08b9567c51157085d0.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

**源码分析：**

- 前提：View的MeasureSpec是由MeasureMode和MeasureSize构成，子View的MeasureSpec是由父View的MeasureSpec和子View的LayoutParams计算来的。
- 在 ViewPager 中，onMeasure() 直接调用 setMeasuredDimension() 设置宽高，并没有根据子View来计算测量。
- 接着调用 getDefaultSize() 方法，第一个参数传入0，第二个参数传入ViewPager的measureSpec，根据上图父View的MeasureMode和子View的LayoutParams对照关系，由此可得：
  - ViewPager的MeasureMode为EXACTLY时，specSize为具体值或父View的剩余空间。
  - ViewPager的MeasureMode为AT_MOST时，specSize为父View的剩余空间。

因此当ViewPager设置为wrap_content时，ViewPager为父容器的高度。



## 解决

重写 onMeasure() 方法，先主动测量子View的大小，将测量后的结果设置给ViewPager。

```kotlin
class WrapContentViewPager @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : ViewPager(context, attrs) {

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        for (i in 0 until childCount) {
            val child = getChildAt(i)
            measureChild(
                child,
                widthMeasureSpec,
                MeasureSpec.makeMeasureSpec(child.layoutParams.height, MeasureSpec.UNSPECIFIED)
            )
        }
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        var height = 0
        when (heightMode) {
            MeasureSpec.EXACTLY -> {
                height = heightSize
            }
            else -> {
                for (i in 0 until childCount) {
                    val child = getChildAt(i)
                    height = Math.max(height, child.measuredHeight)
                }
            }
        }
        super.onMeasure(
            widthMeasureSpec,
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        )
    }
}
```

