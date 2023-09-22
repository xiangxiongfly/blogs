[TOC]

# Android 自定义View

## 分类

自定义View可分为两大类：

- 自定义View
  - 继承View
  - 继承指定View，如TextView
- 自定义ViewGroup
  - 继承ViewGroup
  - 继承指定ViewGroup，如LinearLayout



## 自定义View须知

**支持padding & margin**

- 对于继承View的控件，padding是在`draw()`里处理
- 对于继承ViewGroup的控件，需要在`onMeasure()`和`onLayout()`中考虑

**推荐使用View#post()**

View的内部提供`post()`系列方法，一定程度上可以替代Handler

**避免内存泄漏**

在View退出或不可见时，需要及时处理线程和动画等。

- `View#onAttachdToWindow()`在View的Activity启动时时调用
- `View#onDetachedFromWindow()`在View的Activiyt退出或View被remove时调用



## 自定义属性

**format属性详解**

| 类型      | 说明                                  |
| --------- | ------------------------------------- |
| color     | 颜色值，如：#000000                   |
| string    | 字符串类型，如："abc123"              |
| dimension | 尺寸值，如：16dp、18sp                |
| boolean   | 布尔值，true或false判断               |
| integer   | 整数类型                              |
| float     | 浮点类型                              |
| fraction  | 百分比，如：10%、50%p                 |
| reference | 资源类型id                            |
| enum      | 枚举类型，单选值，子项value为整数值   |
| flags     | 位或运算，可以多选，子项value为整数值 |

说明：format同时设置多个属性值，通过`|`连接。

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="CustomView">
        <attr name="custom_color" format="color" />
        <attr name="custom_string" format="string" />
        <attr name="custom_dimension" format="dimension" />
        <attr name="custom_boolean" format="boolean" />
        <attr name="custom_integer" format="integer" />
        <attr name="custom_float" format="float" />
        <attr name="custom_fraction" format="fraction" />
        <attr name="custom_resid" format="reference" />
        <attr name="custom_enum" format="enum">
            <enum name="left" value="0" />
            <enum name="right" value="1" />
        </attr>
        <attr name="custom_flags" format="flags">
            <flag name="none" value="0" />
            <flag name="english" value="2" />
            <flag name="chinese" value="4" />
        </attr>
    </declare-styleable>
</resources>
```



**使用：**

```xml
<com.example.attr_demo.AttrView 
                                xmlns:app="http://schemas.android.com/apk/res-auto"
                                android:id="@+id/customView"
                                android:layout_width="100dp"
                                android:layout_height="100dp"
                                android:layout_margin="30dp"
                                android:background="#123123"
                                app:custom_boolean="true"
                                app:custom_color="#ff0000"
                                app:custom_dimension="100dp"
                                app:custom_enum="right"
                                app:custom_flags="english|chinese"
                                app:custom_float="1.66"
                                app:custom_fraction="6%"
                                app:custom_integer="666"
                                app:custom_resid="@drawable/ic_right"
                                app:custom_string="@string/app_name" />
```

```java
public class AttrView extends View {

    //在代码中实例化会调用
    public AttrView(Context context) {      
        super(context);
    }

    //在XML布局中定义时会调用
    public AttrView(Context context, @Nullable AttributeSet attrs) {     
        super(context, attrs);
        init(context, attrs);
    }

    //添加Theme时调用
    public AttrView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.CustomView);

            //获取color
            int color = a.getColor(R.styleable.CustomView_custom_color, Color.WHITE);
            Log.e("TAG", "color: " + color);

            //获取string
            String str = a.getString(R.styleable.CustomView_custom_string);
            Log.e("TAG", "string: " + str);

            //获取dimension
            float dimension = a.getDimension(R.styleable.CustomView_custom_dimension, 0);
            Log.e("TAG", "dimension: " + dimension);
            //取整
            int dimensionPixelOffset = a.getDimensionPixelOffset(R.styleable.CustomView_custom_dimension, 0);
            Log.e("TAG", "dimensionPixelOffset: " + dimensionPixelOffset);
            //四舍五入
            int dimensionPixelSize = a.getDimensionPixelSize(R.styleable.CustomView_custom_dimension, 0);
            Log.e("TAG", "dimensionPixelSize: " + dimensionPixelSize);

            //获取boolean
            boolean aBoolean = a.getBoolean(R.styleable.CustomView_custom_boolean, false);
            Log.e("TAG", "aBoolean: " + aBoolean);

            //获取integer
            int anInt = a.getInt(R.styleable.CustomView_custom_integer, 0);
            Log.e("TAG", "anInt: " + anInt);
            int integer = a.getInteger(R.styleable.CustomView_custom_integer, 0);
            Log.e("TAG", "integer: " + integer);

            //获取float
            float aFloat = a.getFloat(R.styleable.CustomView_custom_float, 1.1f);
            Log.e("TAG", "aFloat: " + aFloat);


            //获取fraction，属性值为% 则乘以base，属性值为%p 则乘以pbase
            float fraction = a.getFraction(R.styleable.CustomView_custom_fraction, 10, 100, 0);
            Log.e("TAG", "fraction: " + fraction);

            //获取reference
            int resourceId = a.getResourceId(R.styleable.CustomView_custom_resid, 0);
            Log.e("TAG", "resourceId: " + resourceId);
            //属性值为drawalbe类型
            Drawable drawable = a.getDrawable(R.styleable.CustomView_custom_resid);
            Log.e("TAG", "ddd: " + drawable);

            //获取enum
            int anEnum = a.getInt(R.styleable.CustomView_custom_enum, 0);
            Log.e("TAG", "anEnum: " + anEnum);

            //获取falgs
            int falgs = a.getInteger(R.styleable.CustomView_custom_flags, 0);
            Log.e("TAG", "falgs: " + falgs);

            a.recycle();
        }
    }
}
```





## 自定义View

### 继承系统控件

这种自定义View在系统控件的基础上进行扩展，一般是添加新的功能或修改显示效果，一般情况下我们在`onDraw()`中进行操作。

<img src="https://img-blog.csdnimg.cn/20210404212418777.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:50%;" />

attrs.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="InvalidTextView">
        <attr name="line_width" format="dimension" />
        <attr name="line_color" format="color" />
    </declare-styleable>
</resources>
```

XML布局

```xml
<com.example.custom_view.pkg1.InvalidTextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="5dp"
        android:background="@android:color/holo_green_dark"
        android:text="hello"
        android:textSize="32sp" />

<com.example.custom_view.pkg1.InvalidTextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="5dp"
        android:background="@android:color/holo_green_dark"
        android:padding="10dp"
        android:text="hello"
        android:textSize="32sp"
        app:line_color="#000000"
        app:line_width="1dp" />
```

InvalidTextView.java

```java
public class InvalidTextView extends androidx.appcompat.widget.AppCompatTextView {
    private static final float DEFAULT_LINE_WIDTH = 1F;
    private static final int DEFAULT_LINE_COLOR = Color.RED;

    private Paint mPaint;
    private float lineWidth;
    private int color;

    public InvalidTextView(@NonNull Context context) {
        this(context, null);
    }

    public InvalidTextView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public InvalidTextView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }


    private void init(@NonNull Context context, @Nullable AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.InvalidTextView);
            lineWidth = a.getDimension(R.styleable.InvalidTextView_line_width, DEFAULT_LINE_WIDTH);
            color = a.getColor(R.styleable.InvalidTextView_line_color, DEFAULT_LINE_COLOR);
            a.recycle();
        }
        
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setColor(color);
        mPaint.setStrokeWidth(lineWidth);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int w = getWidth();
        int h = getHeight();
        canvas.drawLine(0, h / 2, w, h / 2, mPaint);
    }
}
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/20210404221541479.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



attrs.xml

```xml
<declare-styleable name="CircleTextView">
    <attr name="border_width" format="dimension" />
    <attr name="border_color" format="color" />
    <attr name="circler_color" format="color" />
</declare-styleable>
```

XML布局

```xml
<com.example.custom_view.pkg1.CircleTextView
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_marginTop="5dp"
        android:text="hello"
        android:textSize="32sp" />

<com.example.custom_view.pkg1.CircleTextView
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_marginTop="5dp"
        android:padding="10dp"
        android:text="hello"
        android:textSize="32sp"
        app:border_color="#00ff00"
        app:border_width="5dp"
        app:circler_color="#123123" />
```

CircleTextView.java

```java
public class CircleTextView extends androidx.appcompat.widget.AppCompatTextView {
    private static final int DEFAULT_BORDER_WIDTH = 0;
    private static final int DEFAULT_BORDER_COLOR = Color.BLACK;
    private static final int DEFAULT_CIRCLE_COLOR = Color.RED;
    private int borderWidth;
    private int borderColor;
    private int circleColor;
    private Paint paint;
    private Paint borderPaint;

    public CircleTextView(@NonNull Context context) {
        this(context, null);
    }

    public CircleTextView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CircleTextView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.CircleTextView);
            borderWidth = a.getDimensionPixelOffset(R.styleable.CircleTextView_border_width, DEFAULT_BORDER_WIDTH);
            borderColor = a.getColor(R.styleable.CircleTextView_border_color, DEFAULT_BORDER_COLOR);
            circleColor = a.getColor(R.styleable.CircleTextView_circler_color, DEFAULT_CIRCLE_COLOR);
            a.recycle();
        }
        setGravity(Gravity.CENTER);
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(circleColor);

        borderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setColor(borderColor);
        borderPaint.setStrokeWidth(borderWidth);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int measuredWidth = getMeasuredWidth();
        int measuredHeight = getMeasuredHeight();
        int max = Math.max(measuredWidth, measuredHeight);
        setMeasuredDimension(max, max);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        int radius = getMeasuredWidth() / 2;
        float cx = radius;
        float cy = radius;
        canvas.drawCircle(cx, cy, radius, paint);
        if (borderWidth > 0) {
            canvas.drawCircle(cx, cy, radius - borderWidth / 2, borderPaint);
        }
        super.onDraw(canvas);
    }
}
```



### 继承View

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210404232725709.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

attrs.xml

```xml
<declare-styleable name="CircleView">
    <attr name="circle_color" />
</declare-styleable>
```

XML布局

```xml
<com.example.custom_view.pkg1.CircleView
                                         android:layout_width="wrap_content"
                                         android:layout_height="wrap_content"
                                         android:layout_marginTop="5dp" />

<com.example.custom_view.pkg1.CircleView
                                         android:layout_width="wrap_content"
                                         android:layout_height="100dp"
                                         android:layout_marginTop="5dp"
                                         android:background="#000"
                                         android:padding="10dp" />
```

CircleView.java

```java
public class CircleView extends View {
    private static final int DEFAULT_COLOR = Color.RED;
    private int circleColor;
    private Paint paint;

    public CircleView(Context context) {
        this(context, null);
    }

    public CircleView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CircleView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.CircleView);
            circleColor = a.getColor(R.styleable.CircleView_circle_color, DEFAULT_COLOR);
            a.recycle();
        }
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(circleColor);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int widthSize = MeasureSpec.getSize(widthMeasureSpec);
        int widthMode = MeasureSpec.getMode(widthMeasureSpec);
        int heightSize = MeasureSpec.getSize(heightMeasureSpec);
        int heightMode = MeasureSpec.getMode(heightMeasureSpec);
        if (widthMode == MeasureSpec.AT_MOST && heightMode == MeasureSpec.AT_MOST) {
            setMeasuredDimension(200, 200);
        } else if (widthMode == MeasureSpec.AT_MOST) {
            setMeasuredDimension(200, heightSize);
        } else if (heightMode == MeasureSpec.AT_MOST) {
            setMeasuredDimension(widthSize, 200);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        //获取padding值
        int paddingLeft = getPaddingLeft();
        int paddingRight = getPaddingRight();
        int paddingTop = getPaddingTop();
        int paddingBottom = getPaddingBottom();
        //获取实际宽高
        int width = getWidth() - paddingLeft - paddingRight;
        int height = getHeight() - paddingTop - paddingBottom;

        int radius = Math.min(width, height) / 2;
        float cx = (width >> 1) + paddingLeft;
        float cy = (height >> 1) + paddingTop;
        canvas.drawCircle(cx, cy, radius, paint);
    }
}
```



## 自定义ViewGroup

### 自定义组合控件

自定义组合控件是将多个控件组合成为一个新的控件，主要用于处理重复使用同一类型的布局。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210404234224430.png)

attrs.xml

```xml
<declare-styleable name="TitleBar">
    <attr name="title_text_color" format="color" />
    <attr name="title_bg" format="color" />
    <attr name="title" format="string" />
</declare-styleable>
```

view_titlebar.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/titlebar_root"
    android:layout_width="match_parent"
    android:layout_height="45dp">

    <ImageView
        android:id="@+id/titlebar_back"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_alignParentLeft="true"
        android:layout_centerVertical="true"
        android:paddingLeft="15dp"
        android:paddingRight="15dp"
        android:src="@drawable/ic_back" />

    <TextView
        android:id="@+id/titlebar_tittle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:maxEms="11"
        android:singleLine="true"
        android:textStyle="bold" />

    <ImageView
        android:id="@+id/titlebar_right"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_alignParentRight="true"
        android:layout_centerVertical="true"
        android:paddingLeft="15dp"
        android:paddingRight="15dp"
        android:src="@drawable/ic_right" />
</RelativeLayout>
```

XML布局

```xml
<com.example.custom_view.pkg2.TitleBar
                                       android:id="@+id/titleBar"
                                       android:layout_width="match_parent"
                                       android:layout_height="wrap_content"
                                       app:title="自定义View"
                                       app:title_bg="@color/teal_200"
                                       app:title_text_color="@color/black" />
```

TitleBar.java

```java
public class TitleBar extends RelativeLayout {
    private ImageView titlebar_back;
    private ImageView titlebar_right;
    private TextView titlebar_title;
    private RelativeLayout titlebar_root;

    private int mBgColor = Color.BLUE;
    private int mTextColor = Color.WHITE;
    private String mTitle;

    public TitleBar(Context context) {
        this(context, null);
    }

    public TitleBar(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TitleBar(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.TitleBar);
            mBgColor = a.getColor(R.styleable.TitleBar_title_bg, Color.BLUE);
            mTextColor = a.getColor(R.styleable.TitleBar_title_text_color, Color.WHITE);
            mTitle = a.getString(R.styleable.TitleBar_title);
            a.recycle();
        }

        LayoutInflater.from(context).inflate(R.layout.view_titlebar, this, true);
        titlebar_root = findViewById(R.id.titlebar_root);
        titlebar_back = findViewById(R.id.titlebar_back);
        titlebar_right = findViewById(R.id.titlebar_right);
        titlebar_title = findViewById(R.id.titlebar_tittle);
        titlebar_root.setBackgroundColor(mBgColor);
        titlebar_title.setTextColor(mTextColor);
        setTitle(mTitle);
    }

    public void setTitle(String mTitle) {
        if (!TextUtils.isEmpty(mTitle)) {
            titlebar_title.setText(mTitle);
        }
    }

    public void setOnLeftListener(OnClickListener onClickListener) {
        titlebar_back.setOnClickListener(onClickListener);
    }

    public void setOnRightListener(OnClickListener onClickListener) {
        titlebar_right.setOnClickListener(onClickListener);
    }
}
```



### 自定义ViewGroup

```java
public class HorizontalView extends ViewGroup {
    int currentIndex = 0; //当前子元素
    int childWidth = 0;
    private Scroller mScroller;
    private VelocityTracker tracker;

    public HorizontalView(Context context) {
        this(context, null);
    }

    public HorizontalView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public HorizontalView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        mScroller = new Scroller(context);
        tracker = VelocityTracker.obtain();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int widthMode = MeasureSpec.getMode(widthMeasureSpec);
        int widthSize = MeasureSpec.getSize(widthMeasureSpec);
        int heightMode = MeasureSpec.getMode(heightMeasureSpec);
        int heightSize = MeasureSpec.getSize(heightMeasureSpec);

        //测量所有子元素
        measureChildren(widthMeasureSpec, heightMeasureSpec);

        if (getChildCount() == 0) {
            //如果没有子元素，宽高都设为0
            setMeasuredDimension(0, 0);
        } else if (widthMode == MeasureSpec.AT_MOST && heightMode == MeasureSpec.AT_MOST) {
            //如果该View都宽高都是AT_MOST，则将宽设为所有子元素的宽度总和，高度设为第一个子元素的高度
            View child = getChildAt(0);
            int childWidth = child.getMeasuredWidth();
            int childHeight = child.getMeasuredHeight();
            setMeasuredDimension(childWidth * getChildCount(), childHeight);
        } else if (widthMode == MeasureSpec.AT_MOST) {
            int childWidth = getChildAt(0).getMeasuredWidth();
            setMeasuredDimension(childWidth * getChildCount(), heightSize);
        } else if (heightMode == MeasureSpec.AT_MOST) {
            int childHeight = getChildAt(0).getMeasuredHeight();
            setMeasuredDimension(widthMeasureSpec, childHeight);
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        int childCount = getChildCount();
        int left = 0;
        View childView;
        for (int i = 0; i < childCount; i++) {
            childView = getChildAt(i);
            if (childView.getVisibility() != GONE) {
                int width = childView.getMeasuredWidth();
                childWidth = width;
                childView.layout(left, 0, left + width, childView.getMeasuredHeight());
                left += width;
            }
        }
    }


    private int lastX;
    private int lastY;
    private int lastInterceptX;
    private int lastInterceptY;

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        boolean intercepted = false;
        int eventX = (int) ev.getX();
        int eventY = (int) ev.getY();

        switch (ev.getAction()) {
            case MotionEvent.ACTION_DOWN:
                intercepted = false;
                break;
            case MotionEvent.ACTION_MOVE:
                if (Math.abs(eventX - lastInterceptX) > Math.abs(eventY - lastInterceptY)) {
                    intercepted = true;
                } else {
                    intercepted = false;
                }
                break;
            case MotionEvent.ACTION_UP:
                intercepted = false;
                break;
        }

        //onTouchEvent()中不能获取down事件，记录lastX、lastY
        lastX = eventX;
        lastY = eventY;
        lastInterceptX = eventX;
        lastInterceptY = eventY;
        return intercepted;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        tracker.addMovement(event);
        int eventX = (int) event.getX();
        int eventY = (int) event.getY();

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                Log.e("TAG", "down");
                //如果动画还没有执行完，则中断
                if (!mScroller.isFinished()) {
                    mScroller.abortAnimation();
                }
                break;
            case MotionEvent.ACTION_MOVE:
                int dx = eventX - lastX;
                int dy = eventY - lastY;
                scrollBy(-dx, 0);
                break;
            case MotionEvent.ACTION_UP:
                //向左滑动为正，将要进入下一个页面；向右滑动为负，将要进入上一个页面
                int distance = getScrollX() - currentIndex * childWidth;

                //移动距离必须大于一半才会切换页面
                if (Math.abs(distance) > childWidth / 2) {
                    if (distance > 0) {
                        currentIndex++;
                    } else {
                        currentIndex--;
                    }
                } else {
                    //计算快速的滑动的平均数独
                    tracker.computeCurrentVelocity(1000);
                    float xV = tracker.getXVelocity();
                    //大于50说明快速滑动
                    if (Math.abs(xV) > 50) {
                        if (xV > 0) {
                            currentIndex--;
                        } else {
                            currentIndex++;
                        }
                    }
                }
                if (currentIndex < 0) {
                    currentIndex = 0;
                } else if (currentIndex > getChildCount() - 1) {
                    currentIndex = getChildCount() - 1;
                }
                smoothScrollTo(currentIndex * childWidth, 0);
                tracker.clear();
                break;
        }

        lastX = eventX;
        lastY = eventY;
        return true;
    }

    /*
    View中如果有线程或动画，需要及时停止
     */
    @Override
    protected void onDetachedFromWindow() {
        tracker.recycle();
        super.onDetachedFromWindow();
    }

    @Override
    public void computeScroll() {
        super.computeScroll();
        if (mScroller.computeScrollOffset()) {
            scrollTo(mScroller.getCurrX(), mScroller.getCurrY());
            postInvalidate();
        }
    }

    private void smoothScrollTo(int destX, int destY) {
        mScroller.startScroll(getScrollX(), getScrollY(), destX - getScrollX(), destY - getScrollY(), 1000);
        invalidate();
    }
}
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.example.custom_view.HorizontalView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ListView
        android:id="@+id/listView1"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <ListView
        android:id="@+id/listView2"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</com.example.custom_view.HorizontalView>
```



## [代码下载](https://github.com/xiangxiongfly/ViewProject)