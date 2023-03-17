[TOC]

# Android SpannableString总结

## 概述

SpannableString和SpannableStringBuilder主要通过`setSpan(Object what, int start, int end, int flags)`方法改变文本样式：

- what：样式
  - BackgroundColorSpan : 文本背景色   
  - ForegroundColorSpan : 文本颜色   
  - MaskFilterSpan : 修饰效果，如模糊(BlurMaskFilter)浮雕
  - RasterizerSpan : 光栅效果   
  - StrikethroughSpan : 删除线     
  - SuggestionSpan : 相当于占位符    
  - UnderlineSpan : 下划线   
  - AbsoluteSizeSpan : 文本字体（绝对大小）  
  - DynamicDrawableSpan : 设置图片，基于文本基线或底部对齐。 
  - ImageSpan : 图片   
  - RelativeSizeSpan : 相对大小（文本字体）  
  - ScaleXSpan : 基于x轴缩放   
  - StyleSpan : 字体样式：粗体、斜体等    
  - SubscriptSpan : 下标（数学公式会用到）   
  - SuperscriptSpan : 上标（数学公式会用到）    
  - TextAppearanceSpan : 文本外貌（包括字体、大小、样式和颜色）  
  - TypefaceSpan : 文本字体     
  - URLSpan : 文本超链接  
  - ClickableSpan : 点击事件  
- start：开始位置。
- end：结束位置，不包含该位置。
- flags：模式，只有在使用类似`insert()`方法时才生效
  - Spannable.SPAN_EXCLUSIVE_EXCLUSIVE：前面不包含，后面不包含
  - Spannable.SPAN_INCLUSIVE_INCLUSIVE：前面包含，后面包含
  - Spannable.SPAN_EXCLUSIVE_INCLUSIVE：前面不包含，后面包含
  - Spannable.SPAN_INCLUSIVE_EXCLUSIVE：前面包含，后面不包含



##  flags属性使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/31d23ef0a1814a99aaa609100fe4737f.png)

```kotlin
SpannableStringBuilder("123456789").apply {
    setSpan(ForegroundColorSpan(Color.RED), 1, 2, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    insert(1, "A")
}

SpannableStringBuilder("123456789").apply {
    setSpan(ForegroundColorSpan(Color.RED), 1, 2, Spannable.SPAN_INCLUSIVE_INCLUSIVE)
    insert(1, "A")
}

SpannableStringBuilder("123456789").apply {
    setSpan(ForegroundColorSpan(Color.RED), 1, 2, Spannable.SPAN_EXCLUSIVE_INCLUSIVE)
    insert(1, "A")
}

SpannableStringBuilder("123456789").apply {
    setSpan(ForegroundColorSpan(Color.RED), 1, 2, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
    insert(1, "A")
}
```



## what属性使用

![请添加图片描述](https://img-blog.csdnimg.cn/fea566387b214d1e924be09b1949317e.jpeg)

```kotlin
mList.add(
    SpannableString("设置前景色").apply {
        setSpan(ForegroundColorSpan(Color.GREEN), 1, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableStringBuilder("追加字符串").apply {
        val text = "fuck!"
        append(text)
        setSpan(ForegroundColorSpan(Color.RED), 5, 9, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置背景色").apply {
        setSpan(BackgroundColorSpan(Color.GREEN), 1, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置下划线").apply {
        setSpan(UnderlineSpan(), 1, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置删除线").apply {
        setSpan(StrikethroughSpan(), 1, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置上下标:y=x3+An").apply {
        //设置上标
        setSpan(SuperscriptSpan(), 9, 10, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        //设置下标
        setSpan(SubscriptSpan(), 12, 13, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("超级链接：电话").apply {
        setSpan(URLSpan("tel:12345678911"), 5, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("超级链接：网络").apply {
        setSpan(URLSpan("http://www.baidu.com"), 5, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(ForegroundColorSpan(Color.RED), 5, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("超级链接：短信").apply {
        setSpan(URLSpan("sms:12345678912"), 5, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(ForegroundColorSpan(Color.RED), 5, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置字体样式：正常、粗体、斜体、粗斜体").apply {
        setSpan(StyleSpan(Typeface.NORMAL), 7, 9, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(StyleSpan(Typeface.BOLD), 10, 12, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(StyleSpan(Typeface.ITALIC), 13, 15, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(StyleSpan(Typeface.BOLD_ITALIC), 16, 19, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置字体：default、default-bold、monospace、serif、sans-serif").apply {
        setSpan(TypefaceSpan("default"), 5, 12, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(TypefaceSpan("default-bold"), 13, 25, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(TypefaceSpan("monospace"), 26, 35, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(TypefaceSpan("serif"), 36, 41, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(TypefaceSpan("sans-serif"), 42, 51, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置字体大小（绝对值：单位：像素、单位：像素）").apply {
        setSpan(AbsoluteSizeSpan(10, true), 14, 16, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(AbsoluteSizeSpan(30, true), 17, 22, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("设置字体大小（相对值：单位：像素、单位：像素）").apply {
        setSpan(RelativeSizeSpan(0.5F), 14, 16, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        setSpan(RelativeSizeSpan(2F), 17, 22, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
mList.add(
    SpannableString("后面添加图片：#").apply {
        setSpan(
            ImageSpan(mContext, R.mipmap.ic_launcher),
            7, 8,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
    }
)
mList.add(
    SpannableString("我的中#间添加图片").apply {
        setSpan(
            ImageSpan(mContext, R.mipmap.ic_launcher),
            3, 4,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
    }
)
mList.add(
    SpannableString("图片点击事件#").apply {
        setSpan(
            ImageSpan(mContext, R.mipmap.ic_launcher),
            6,
            7,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        setSpan(
            object : ClickableSpan() {
                override fun onClick(widget: View) {
                    Toast.makeText(mContext, "点击了", Toast.LENGTH_SHORT).show()
                }
            }, 6, 7, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
    }
)
mList.add(
    SpannableString("复杂的点击效果1").apply {
        setSpan(object : ClickableSpan() {
            override fun onClick(widget: View) {
                Toast.makeText(mContext, "点击了", Toast.LENGTH_SHORT).show()
            }
        }, 3, 5, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)

mList.add(
    SpannableString("复杂的点击效果2").apply {
        setSpan(object : ClickableSpan() {
            override fun onClick(widget: View) {
                Toast.makeText(mContext, "点击了", Toast.LENGTH_SHORT).show()
            }

            override fun updateDrawState(ds: TextPaint) {
                ds.isUnderlineText = false
            }
        }, 3, 5, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
    }
)
```



## 使用Html.fromHtml

```kotlin
val html: String = "HTML:<img src=\"${R.mipmap.ic_launcher}\">"
val imageGetter = CustomImageGetter(mContext, 0, 0)
val htmlString = Html.fromHtml(html, imageGetter, null)
mList.add(htmlString)
```

```kotlin
class CustomImageGetter(
    val mContext: Context,
    private val width: Int,
    private val height: Int
) : Html.ImageGetter {
    override fun getDrawable(source: String): Drawable {
        val drawableRes = source.toInt()
        val drawable = ContextCompat.getDrawable(mContext, drawableRes)
        drawable?.let {
            it.setBounds(
                0,
                0,
                if (width != 0) width else it.intrinsicWidth,
                if (height != 0) height else it.intrinsicHeight
            )
        }
        return drawable!!
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/home/src/main/java/com/example/home/span)


