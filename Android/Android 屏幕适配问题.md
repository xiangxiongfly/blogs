[TOC]

# Android 屏幕适配问题

## 基本概念

### ppi

ppi（Pixels Per Inch）硬件像素密度：在物理设备上，每英寸包含的物理像素点数量，ppi是不能修改的。

### dpi

dpi（Dots Per Inch）屏幕像素密度：是软件概念，每英寸包含多少个点，dpi一般情况下是能修改的。

### density

density 密度：1个dp对应多少个px。

### dp

dp（density-independent pixel）密度无关像素：与设备的像素密度无关的像素，Google推荐使用。

### sp

sp（scale-independent pixel）比例无关像素：与dp类似，但会随着系统的字体大小改变而调整。



### 密度限定符

不同屏幕像素密度大设备对应了不同的密度限定符。

| 密度类型 | 说明                   | 像素密度 | denstiy |
| -------- | ---------------------- | -------- | ------- |
| ldpi     | 低密度屏幕             | 120dpi   | 0.75    |
| mdpi     | 中密度屏幕（基准密度） | 160dpi   | 1       |
| hdpi     | 高密度屏幕             | 240dpi   | 1.5     |
| xhdpi    | 超高密度屏幕           | 320dpi   | 2       |
| xxhdpi   | 超超高密度屏幕         | 480dpi   | 3       |



### 方向限定符

| 限定符 | 说明 |
| ------ | ---- |
| land   | 横屏 |
| port   | 竖屏 |



### 转换公式

px = density * dp

density = dpi /160

px = dp * (dpi / 160)



### 获取屏幕信息

不同的手机屏幕上，1pd对应的px值可能忽悠很大差异。如，在小屏幕上1dp可能对应1px，在大屏幕圣桑可能对应1px

可以通过displayMetrics获取详细信息：

```kotlin
val displayMetrics = applicationContext.resources.displayMetrics

//输出： DisplayMetrics{density=3.0, width=1080, height=1920, scaledDensity=3.0, xdpi=480.0, ydpi=480.0}
```

说明：

-   屏幕像素密度为480dpi
-   density为3，表示在这个设备上1dp=3px
-   屏幕宽高为`1080*1920px`，也就是`360*640dp`

Android系统定义的屏幕像素密度基准值是160dp，也就是1dp=1px，因此480dp下1dp=3px



## 适配问题

在布局文件中使用的单位值，最终都会被系统转换为px。Google官方推荐使用dp作为单位值，系统会根据屏幕的实际情况自动完成dp与px之间的转换。

如：将一个View的宽度设置为180dp，在标准屏幕下如`540*960px/240dpi 即360*640dp`、`720*1280px/320dpi 即360*640dp`、`1080*1920px/480dpi 即360*640dp`中都是显示一半空间。由于屏幕像素密度的存在，使得同一套dp在不同的屏幕下显示相同的效果。但是dp值只适用于大部分正常情况。

![在这里插入图片描述](https://img-blog.csdnimg.cn/695ebf6dc5e947adaeb05dd864878d70.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_18,color_FFFFFF,t_70,g_se,x_16)



屏幕适配问题的根源是设备碎片化：系统碎片化、屏幕尺寸碎片化、屏幕像素密度碎片化。

屏幕尺寸碎片化问题，如：dpi都为320，但屏幕尺寸不相同时，同样的180dp在`720*1280px/320dpi`下占据50%的空间，但在`900*1600px/320dpi`下占据40%的空间，两边的显示效果就不一样了。这是用dp值无法解决的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/63cf117c4df74e7a91eba9c4169f8d61.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_11,color_FFFFFF,t_70,g_se,x_16)

屏幕像素密度碎片化问题，如：尺寸是`720*1280px/320dpi 即360*640dp`，尺寸为`720*1280px/360dpi 即320*568dp`，这时相同的屏幕尺寸但是dpi不同，导致同样的180dp所占据的空间是不一样的。



## 适配方案

在布局文件中声明的dp值，最终都通过`TypedValue#applyDimension()`方法转换为px值，即：`density * dp`。

```java
public static float applyDimension(int unit, float value, DisplayMetrics metrics) {
    switch (unit) {
        case COMPLEX_UNIT_PX:
            return value;
        case COMPLEX_UNIT_DIP:
            return value * metrics.density;
        case COMPLEX_UNIT_SP:
            return value * metrics.scaledDensity;
        case COMPLEX_UNIT_PT:
            return value * metrics.xdpi * (1.0f/72);
        case COMPLEX_UNIT_IN:
            return value * metrics.xdpi;
        case COMPLEX_UNIT_MM:
            return value * metrics.xdpi * (1.0f/25.4f);
    }
    return 0;
}
```



### 今日头条方案

[详细文档](https://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247484502&idx=2&sn=a60ea223de4171dd2022bc2c71e09351&scene=21#wechat_redirect)

本质是通过获取屏幕宽度，再除以基准dp值，获取新的density，通过修改旧的density，最终改变View的尺寸。

```kotlin
fun setCustomDensity(activity: Activity, application: Application, designWidthDp: Int) {
    val appDisplayMetrics = application.resources.displayMetrics
    val targetDensity = 1.0f * appDisplayMetrics.widthPixels / designWidthDp
    val targetDensityDpi = (targetDensity * 160).toInt()
    appDisplayMetrics.density = targetDensity
    appDisplayMetrics.densityDpi = targetDensityDpi
    val activityDisplayMetrics = activity.resources.displayMetrics
    activityDisplayMetrics.density = targetDensity
    activityDisplayMetrics.densityDpi = targetDensityDpi
}
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    val displayMetrics = applicationContext.resources.displayMetrics
    log("修改前：${displayMetrics.toString()}")
    setCustomDensity(this, application, 360)
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    log("修改后：${displayMetrics.toString()}")
}

//修改前：DisplayMetrics{density=2.0, width=900, height=1600, scaledDensity=2.0, xdpi=320.0, ydpi=320.0}
//修改后：DisplayMetrics{density=2.5, width=900, height=1600, scaledDensity=2.0, xdpi=320.0, ydpi=320.0}
```



### smallestWidth 最小宽度限定

smallestWidth即最小宽度适配，是系统原生支持的一种适配方案。

它是不考虑屏幕方向，指的是最短的那个边，按比例分配，如：设计稿是`720*1280px/360dpi`，那么基准分辨率就是设计稿的宽度宽度为360dp，表示把宽度分为360份，得到以下尺寸：

```xml
<dimen name="dp_2">1dp</dimen>
<dimen name="dp_1">2dp</dimen>
...
<dimen name="dp_360 ">360dp</dimen>
```

以`360dp`为基准，在不同最小宽度的文件夹下按比例缩放尺寸，如`sw480dp`：

```xml
<dimen name="dp_2">1.333dp</dimen>
<dimen name="dp_1">2.666dp</dimen>
...
<dimen name="dp_360 ">480dp</dimen>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/92476fdcaaa24198ab46ed9cd0f69605.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_14,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ca5ea0ab09784a429844627146494bbb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_14,color_FFFFFF,t_70,g_se,x_16)

使用最小宽度限定符适配解决大部分情况下的适配问题。



### 布局适配

-   可以使用LinearLayout（线性布局）和百分比布局控制权重比例。

-   使用RelativeLayout（相对布局）和ConstraintLayout（约束布局）控制关联关系。

    

## 其他

### dimens 文件生成工具

```kotlin
import java.io.File
import java.io.FileOutputStream
import kotlin.math.min

private const val XML_FILE_NAME = """dimens.xml"""
private const val XML_HEADER = """<?xml version="1.0" encoding="utf-8"?>"""
private const val XML_RESOURCE_START = """<resources>"""
private const val XML_SW_DP_TAG = """<string name="sw_dp">%ddp</string>"""
private const val XML_DIMEN_TEMPLATE_TO_DP = """<dimen name="DIMEN_%ddp">%.2fdp</dimen>"""
private const val XML_DIMEN_TEMPLATE_TO_PX = """<dimen name="DIMEN_%dpx">%.2fdp</dimen>"""
private const val XML_RESOURCE_END = """</resources>"""

private const val DESIGN_WIDTH_DP = 360
private const val DESIGN_HEIGHT_DP = 640

private const val DESIGN_WIDTH_PX = 720
private const val DESIGN_HEIGHT_PX = 1280

fun main() {
    val designWidthDp = min(DESIGN_WIDTH_DP, DESIGN_HEIGHT_DP)
    val srcDirFileDp = File("src-dp")
    makeDimens(designWidthDp, srcDirFileDp, XML_DIMEN_TEMPLATE_TO_DP)

    val designWidthPx = min(DESIGN_WIDTH_PX, DESIGN_HEIGHT_PX)
    val srcDirFilePx = File("src-px")
    makeDimens(designWidthPx, srcDirFilePx, XML_DIMEN_TEMPLATE_TO_PX)
}

private fun makeDimens(designWidth: Int, srcDirFile: File, xmlDimenTemplate: String) {
    if (srcDirFile.exists() && !srcDirFile.deleteRecursively()) {
        return
    }
    srcDirFile.mkdirs()
    val smallestWidthList = mutableListOf<Int>().apply {
        for (i in 320..460 step 10) {
            add(i)
        }
    }.toList()
    for (smallestWidth in smallestWidthList) {
        makeDimensFile(designWidth, smallestWidth, xmlDimenTemplate, srcDirFile)
    }
}

private fun makeDimensFile(
    designWidth: Int,
    smallestWidth: Int,
    xmlDimenTemplate: String,
    srcDirFile: File
) {
    val dimensFolderName = "values-sw" + smallestWidth + "dp"
    val dimensFile = File(srcDirFile, dimensFolderName)
    dimensFile.mkdirs()
    val fos = FileOutputStream(dimensFile.absolutePath + File.separator + XML_FILE_NAME)
    fos.write(generateDimens(designWidth, smallestWidth, xmlDimenTemplate).toByteArray())
    fos.flush()
    fos.close()
}

private fun generateDimens(designWidth: Int, smallestWidth: Int, xmlDimenTemplate: String): String {
    val sb = StringBuilder()
    sb.append(XML_HEADER)
    sb.append("\n")
    sb.append(XML_RESOURCE_START)
    sb.append("\n")
    sb.append("    ")
    sb.append(String.format(XML_SW_DP_TAG, smallestWidth))
    sb.append("\n")
    for (i in 1..designWidth) {
        val dpValue = i.toFloat() * smallestWidth / designWidth
        sb.append("    ")
        sb.append(String.format(xmlDimenTemplate, i, dpValue))
        sb.append("\n")
    }
    sb.append(XML_RESOURCE_END)
    return sb.toString()
}
```



### dimens 文件生成插件

一、需要在AndroidStudio中安装`ScreenMatch `插件。

二、在默认`values`文件夹下准备一份`dimens.xml`文件。

三、鼠标右键`ScreenMatch`选项，立即会生成多套`dimens`文件。

四、可以打开工程目录下`screenMatch.properties`文件，配置一些其他信息。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f7f24cefe164e2aa33d0405f471f4f5.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/25a62aa9ac0c4006b8445b99cfe3c1fe.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



