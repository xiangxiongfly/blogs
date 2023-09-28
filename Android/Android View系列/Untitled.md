[toc]

# Android MeasureSpec测量规格

## 概述

MeasureSpec指View的测量规格，MeasureSpec是View的一个静态内部类。

**View的MeasureSpec**是根据**自身的布局参数（LayoutParams）**和**父View的MeasureSpec**共同计算出来的。



## MeasureSpec组成

测量规格封装了父View对子View布局上的限制。

测量规格（MeasureSpec）是由测量模式（mode）和测量大小（size）组成，共32位整数型：

- 高2位表示测量模式SpecMode。
- 低30位表示测量尺寸SpecSize。

![在这里插入图片描述](https://img-blog.csdnimg.cn/aa3d5634be3e413999d1dbc4ef60800c.png)

**测量模式（SpecMode）共3种：**

<table border="2" cellpadding="20" style="border-collapse: collapse; text-align: left">
    <thead>
        <tr>
            <td>模式</td>
            <td>说明</td>
            <td>场景</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>UNSPECIFIED</td>
            <td>表示View的大小没有限制，MeasureSpec中的size可以为任意值</td>
            <td>系统内部，如：ListView、ScrollView</td>
        </tr>
        <tr>
            <td rowspan="2">EXACTLY</td>
            <td rowspan="2">表示View的大小已经确定，MeasureSpec中的size是一个精确值</td>
            <td>match_parent：强制使View的尺寸扩展至父View的尺寸</td>
        </tr>
        <tr>
            <td>具体数值：如100dp或100px</td>
        </tr>
        <tr>
            <td>AT_MOST</td>
            <td>表示View的大小可以是一个指定的最大值，MeasureSpec中的size是一个上限值，View的大小会根据内容自动调整不会超过size值</td>
            <td>wrap_content：自适应大小</td>
        </tr>
    </tbody>
</table>



## 常用API

```java
// 获取测量模式
int specMode = MeasureSpec.getMode(measureSpec)

// 获取测量大小
int specSize = MeasureSpec.getSize(measureSpec)

// 通过Mode和Size生成新的SpecMode
int measureSpec=MeasureSpec.makeMeasureSpec(size, mode);
```



## MeasureSpec源码分析

```java
public static class MeasureSpec {
    private static final int MODE_SHIFT = 30;
    private static final int MODE_MASK  = 0x3 << MODE_SHIFT;

    public static final int UNSPECIFIED = 0 << MODE_SHIFT;

    public static final int EXACTLY     = 1 << MODE_SHIFT;

    public static final int AT_MOST     = 2 << MODE_SHIFT;

    //根据尺寸和测量模式生成一个MeasureSpec
    public static int makeMeasureSpec(int size, int mode) {
        if (sUseBrokenMakeMeasureSpec) {
            return size + mode;
        } else {
            return (size & ~MODE_MASK) | (mode & MODE_MASK);
        }
    }

    //获取测量模式
    public static int getMode(int measureSpec) {
        return (measureSpec & MODE_MASK);
    }

    //获取测量尺寸
    public static int getSize(int measureSpec) {
        return (measureSpec & ~MODE_MASK);
    }

    //调整MeasureSpec大小
    static int adjust(int measureSpec, int delta) {
        final int mode = getMode(measureSpec);
        int size = getSize(measureSpec);
        if (mode == UNSPECIFIED) {
            return makeMeasureSpec(size, UNSPECIFIED);
        }
        size += delta;
        if (size < 0) {
            Log.e(VIEW_LOG_TAG, "MeasureSpec.adjust: new size would be negative! (" + size +
                  ") spec: " + toString(measureSpec) + " delta: " + delta);
            size = 0;
        }
        return makeMeasureSpec(size, mode);
    }  
}
```



## getChildMeasureSpec源码分析

View的MeasureSpec是根据View自身的LayoutParams和父View的MeasureSpec决定的。

MeasureSpec的计算逻辑封装在 `ViewGroup#getChildMeasureSpce()` 方法中。

```java
public abstract class ViewGroup{

    /**	
    * spec：父View的测量规格
	* padding：父容器的已用空间（父View的padding和子View的margin）
	* childDimension：子View的尺寸（布局参数）
	**/
    public static int getChildMeasureSpec(int spec, int padding, int childDimension) {    
        //获取父View的测量模式
        int specMode = MeasureSpec.getMode(spec);     
        //获取父View的测量尺寸
        int specSize = MeasureSpec.getSize(spec); 

        //计算父View的剩余空间
        int size = Math.max(0, specSize - padding);  

        //子View期望的尺寸和模式（需要计算）  
        int resultSize = 0;  
        int resultMode = 0;  

        //如下通过父View的MeasureSpec和子View的LayoutParams计算过程：

        switch (specMode) {                 
                //当父View的模式为EXACTLY时，也就是父View设置为match_parent或具体数值时。
            case MeasureSpec.EXACTLY:  
                if (childDimension >= 0) {                           
                    //如果子View有具体数值，则子View的尺寸为自身的值，模式为EXACTLY
                    resultSize = childDimension;  
                    resultMode = MeasureSpec.EXACTLY;  
                } else if (childDimension == LayoutParams.MATCH_PARENT) {                     
                    //如果子View为match_parent时，则子View的尺寸为父View的剩余空间大小，模式为EXACTLY
                    resultSize = size;  
                    resultMode = MeasureSpec.EXACTLY;                          
                } else if (childDimension == LayoutParams.WRAP_CONTENT) {       
                    //如果子View为wrap_content时，则子View的尺寸为父View的剩余空间大小，模式为AT_MOST
                    resultSize = size;  
                    resultMode = MeasureSpec.AT_MOST;  
                }  
                break;  

                //父View的模式为AT_MOST时，也就是wrap_content。
            case MeasureSpec.AT_MOST:  
                if (childDimension >= 0) {               
                    //如果子View有具体数值，则子View的尺寸为自身的值，模式为EXACTLY
                    resultSize = childDimension;  
                    resultMode = MeasureSpec.EXACTLY;  
                } else if (childDimension == LayoutParams.MATCH_PARENT) {                     
                    //如果子View为match_parent时，则子View的尺寸为父View的剩余空间大小，模式为AT_MOST
                    resultSize = size;  
                    resultMode = MeasureSpec.AT_MOST;  
                } else if (childDimension == LayoutParams.WRAP_CONTENT) {                 
                    //如果子View为wrap_content时，则子View的尺寸为父View的剩余空间大小，模式为AT_MOST
                    resultSize = size;  
                    resultMode = MeasureSpec.AT_MOST;  
                }  
                break;  

                //当父View的模式为UNSPECIFIED时，父View不对子View限制，常用于系统空间，如ListView、ScrollView等。
            case MeasureSpec.UNSPECIFIED:       
                if (childDimension >= 0) {  
                    //如果子View有具体数值，则子View的尺寸为自身的值，模式为EXACTLY
                    resultSize = childDimension;  
                    resultMode = MeasureSpec.EXACTLY;  
                } else if (childDimension == LayoutParams.MATCH_PARENT) {                  
                    //如果子View为match_parent时，则子View的尺寸为父View的剩余空间大小，模式为UNSPECIFIED
                    resultSize = 0;  
                    resultMode = MeasureSpec.UNSPECIFIED;  
                } else if (childDimension == LayoutParams.WRAP_CONTENT) {  
                    //如果子View有具体数值，则子View的尺寸为0，模式为UNSPECIFIED
                    resultSize = 0;  
                    resultMode = MeasureSpec.UNSPECIFIED;  
                }  
                break;  
        }  
        
        //计算子View的测量规格
        return MeasureSpec.makeMeasureSpec(resultSize, resultMode);  
    }  

    /**	
     * child：子View
     * parentWidthMeasureSpec：父View的宽的测量规格
     * widthUsed：父View在宽上的已使用空间
     * parentHeightMeasureSpec：父View的高的测量规格
     * heightUsed：父View在高上的已使用空间
     **/
    protected void measureChildWithMargins(View child,
                                           int parentWidthMeasureSpec, int widthUsed,
                                           int parentHeightMeasureSpec, int heightUsed) {
        //获取子View的布局参数
        final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

        //获取子View的宽的测量规格
        final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
                                                              mPaddingLeft + mPaddingRight + lp.leftMargin + lp.rightMargin
                                                              + widthUsed, lp.width);
        //获取子View的高的测量规格
        final int childHeightMeasureSpec = getChildMeasureSpec(parentHeightMeasureSpec,
                                                               mPaddingTop + mPaddingBottom + 		lp.topMargin + lp.bottomMargin
                                                               + heightUsed, lp.height);
        //测量子View
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }
}
```



## 总结

![在这里插入图片描述](https://img-blog.csdnimg.cn/8108094a6dc64e08b9567c51157085d0.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



**以子View为标准，总结：**

| 子View的LayoutParams | 子View的MeasureSpec                                          |
| -------------------- | ------------------------------------------------------------ |
| 具体数值             | 测量模式：EXACTLY<br />测量尺寸：自身的具体数值              |
| match_parent         | 测量模式：父View的测量模式<br />如果父View的测量模式为EXACTLY，则测量大小：父View的剩余空间；<br />如果父View的测量模式为AT_MOST，则测量大小：不超过父View的剩余空间 |
| wrap_content         | 测量模式：AT_MOST<br />测量尺寸：不超过父View的剩余空间      |

![在这里插入图片描述](https://img-blog.csdnimg.cn/792b10c2118848a6a035edeee7273522.png)

