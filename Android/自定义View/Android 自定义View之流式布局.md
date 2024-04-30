
# Android 自定义View之流式布局

处理了padding和元素之间的间距。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ea6dccd865574eeeaab6b61294132a2b.png)



## 代码实现

```java
package com.example.app

import android.content.Context
import android.graphics.Rect
import android.util.AttributeSet
import android.view.ViewGroup
import androidx.core.view.children
import kotlin.math.max


class FlowLayout @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : ViewGroup(context, attrs, defStyleAttr) {
    private val childrenBounds = mutableListOf<Rect>() //存放所有子View坐标

    companion object {
        val HORIZONTAL_SPACE = 20F.dp
        val VERTICAL_SPACE = 16F.dp
    }

    private var mHorizontalSpace: Int = HORIZONTAL_SPACE.toInt() //子View水平间距
    private var mVerticalSpace: Int = VERTICAL_SPACE.toInt() //子View垂直间距

    init {
        if (attrs != null) {
            val a = context.obtainStyledAttributes(attrs, R.styleable.FlowLayout)
            mHorizontalSpace =
                a.getDimension(
                    R.styleable.FlowLayout_horizontalSpace, HORIZONTAL_SPACE
                ).toInt()
            mVerticalSpace = a.getDimension(
                R.styleable.FlowLayout_verticalSpace, VERTICAL_SPACE
            ).toInt()
            a.recycle()
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        childrenBounds.clear()
        val widthSize = MeasureSpec.getSize(widthMeasureSpec) //FlowLayout宽度尺寸
        val widthMode = MeasureSpec.getMode(widthMeasureSpec) //FlowLayout宽度模式
        var widthUsed = 0  //FlowLayout已用宽度
        var heightUsed = 0  //FlowLayout已用高度
        var lineWidthUsed = 0 //单行已用宽度
        var lineMaxHeight = 0 //单行最大高度

        lineWidthUsed = paddingLeft //处理padding
        heightUsed = paddingTop  //处理padding

        //遍历子View
        for ((index, childView) in children.withIndex()) {
            measureChildWithMargins(
                childView,
                widthMeasureSpec, 0,
                heightMeasureSpec, heightUsed
            )

            //处理换行（需要考虑padding和水平间距）
            if (lineWidthUsed + childView.measuredWidth + paddingRight + mHorizontalSpace > widthSize) {
                lineWidthUsed = paddingLeft
                heightUsed += lineMaxHeight + mVerticalSpace
                lineMaxHeight = 0
                measureChildWithMargins(
                    childView,
                    widthMeasureSpec, 0,
                    heightMeasureSpec, heightUsed
                )
            }

            //计算子View坐标
            val rect = Rect()
            rect.set(
                lineWidthUsed,
                heightUsed,
                lineWidthUsed + childView.measuredWidth,
                heightUsed + childView.measuredHeight
            )
            childrenBounds.add(rect)

            lineWidthUsed += childView.measuredWidth + mHorizontalSpace //计算单行已用宽度（需要考虑水平间距）
            widthUsed = max(lineWidthUsed, widthUsed) //计算FlowLayout已用高度
            lineMaxHeight = max(lineMaxHeight, childView.measuredHeight) //计算单行最大高度

            //处理最后一行，主要处理padding问题
            if (index == childCount - 1) {
                widthUsed += paddingRight
                heightUsed += paddingBottom
            }
        }

        val selfWidth = widthUsed
        val selfHeight = heightUsed + lineMaxHeight
        setMeasuredDimension(widthSize, selfHeight)
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        for ((index, childView) in children.withIndex()) {
            val bounds = childrenBounds[index]
            childView.layout(bounds.left, bounds.top, bounds.right, bounds.bottom)
        }
    }

    override fun generateDefaultLayoutParams(): LayoutParams {
        return MarginLayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
    }

    //必须重写
    override fun generateLayoutParams(attrs: AttributeSet): LayoutParams {
        return MarginLayoutParams(context, attrs)
    }

    //必须重写
    override fun generateLayoutParams(p: LayoutParams): LayoutParams {
        return MarginLayoutParams(p)
    }

    override fun checkLayoutParams(p: LayoutParams): Boolean {
        return p is MarginLayoutParams
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/TagLayout)