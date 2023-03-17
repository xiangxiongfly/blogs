[TOC]

# Android 处理软键盘遮挡问题





## 方案一：使用NestedScrollView

![在这里插入图片描述](https://img-blog.csdnimg.cn/60ce4d98086d4bd88b39cc97ba073253.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_16,color_FFFFFF,t_70,g_se,x_16)

### 方案说明

使用NestedScrollView嵌套时，当键盘弹出时，顶层的DecorView的高度是不变的，而ContentView的高度则会缩小。

通过这个特性可以监听ContentView来判断软键盘的打开和关闭。

**XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true"
    tools:context=".LoginActivity">

    <ImageView
        android:id="@+id/logo"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="120dp"
        android:src="@mipmap/ic_launcher_round" />

    <androidx.core.widget.NestedScrollView
        android:id="@+id/scrollView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true"
        android:scrollbarThumbVertical="@android:color/transparent"
        android:scrollbars="vertical">

        <LinearLayout
            android:id="@+id/content"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:layout_marginLeft="15dp"
            android:layout_marginRight="15dp"
            android:orientation="vertical">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="300dp"
                android:gravity="center"
                android:orientation="horizontal">

                <ImageView
                    android:layout_width="35dp"
                    android:layout_height="35dp"
                    android:src="@drawable/user" />

                <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入用户名" />

            </LinearLayout>

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                android:gravity="center"
                android:orientation="horizontal">

                <ImageView
                    android:layout_width="35dp"
                    android:layout_height="35dp"
                    android:src="@drawable/pwd" />

                <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入密码" />

            </LinearLayout>

            <Button
                android:id="@+id/confirm"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                android:background="#FF0000"
                android:text="确定" />

            <RelativeLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:padding="10dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_alignParentLeft="true"
                    android:text="忘记密码" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_alignParentRight="true"
                    android:text="注册" />
            </RelativeLayout>
        </LinearLayout>
    </androidx.core.widget.NestedScrollView>

    <LinearLayout
        android:id="@+id/helper"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:gravity="center"
        android:orientation="horizontal"
        android:padding="10dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="联系客服" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="10dp"
            android:layout_marginRight="10dp"
            android:text="|" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="关于我们" />

    </LinearLayout>

</RelativeLayout>
```

**逻辑代码**

```kotlin
class LoginActivity : AppCompatActivity(), View.OnLayoutChangeListener {
    private lateinit var scrollView: NestedScrollView
    private lateinit var helper: LinearLayout
    private lateinit var content: LinearLayout
    private lateinit var logo: ImageView
    private lateinit var confirm: Button

    private var screenHeight = 0 //屏幕高度
    private var keyboardHeight = 0 //键盘高度

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        scrollView = findViewById(R.id.scrollView)
        helper = findViewById(R.id.helper)
        content = findViewById(R.id.content)
        logo = findViewById(R.id.logo)
        confirm = findViewById(R.id.confirm)

        confirm.setOnClickListener { KeyboardUtils.hideKeyboard(confirm) }

        screenHeight = Resources.getSystem().displayMetrics.heightPixels
        keyboardHeight = screenHeight / 3

        //禁止ScrollView滚动
        scrollView.setOnTouchListener { v, event -> true }

        //监听
        scrollView.addOnLayoutChangeListener(this)
    }

    override fun onLayoutChange(
        v: View?,
        left: Int, top: Int, right: Int, bottom: Int,
        oldLeft: Int, oldTop: Int, oldRight: Int, oldBottom: Int
    ) {
        if (oldBottom == 0 || bottom == 0)
            return

        if ((oldBottom - bottom) > keyboardHeight) {
            Log.e("TAG", "软键盘弹出")
            val diff = content.bottom - bottom
            if (diff > 0) {
                AnimatorUtils.translationY(content, 0F, (-diff).toFloat())
                AnimatorUtils.scaleXY(logo, 1F, 0.6F)
                AnimatorUtils.translationY(logo, 0F, -100F)
            }
            helper.visibility = View.INVISIBLE
        } else if ((bottom - oldBottom) > keyboardHeight) {
            Log.e("TAG", "软键盘收起")
            val diff = content.bottom - oldBottom
            if (diff > 0) {
                AnimatorUtils.translationY(content, content.translationY, 0F)
                AnimatorUtils.scaleXY(logo, 0.6F, 1F)
                AnimatorUtils.translationY(logo, logo.translationY, 0F)
            }
            helper.visibility = View.VISIBLE
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        scrollView.removeOnLayoutChangeListener(this)
    }
}
```

**动画代码**

```kotlin
object AnimatorUtils {

    /**
     * Y轴移动动画
     */
    fun translationY(view: View, from: Float, to: Float) {
        ObjectAnimator.ofFloat(view, TRANSLATION_Y, from, to).apply {
            interpolator = LinearInterpolator()
            duration = 300L
        }.start()
    }

    /**
     * 缩放动画
     */
    fun scaleXY(view: View, fromScale: Float, toScale: Float) {
        view.apply {
            pivotX = (view.width / 2).toFloat()
            pivotY = (view.height / 2).toFloat()
        }
        val animatorScaleX = ObjectAnimator.ofFloat(view, SCALE_X, fromScale, toScale)
        val animatorScaleY = ObjectAnimator.ofFloat(view, SCALE_Y, fromScale, toScale)
        AnimatorSet().apply {
            duration = 300L
            playTogether(animatorScaleX, animatorScaleY);
        }.start()
    }
}
```



## 方案二：使用scrollTo或属性动画

### 方案说明

通过`getWindowVisibleDisplayFrame()`获取window的可视区域，软键盘弹出时，可视区域的高度小于decorView的高度。

**监听软键盘状态工具类**

```java
/**
 * 监听顶层View，判断软键盘是否弹出
 */
public class SoftKeyboardListener implements ViewTreeObserver.OnGlobalLayoutListener {

    private static SoftKeyboardListener mSoftKeyboardListener;
    private boolean isShowKeyboard;
    private View decorView;
    private OnSoftKeyboardListener mListener;

    public static SoftKeyboardListener with(@NotNull Activity activity) {
        if (mSoftKeyboardListener == null) {
            mSoftKeyboardListener = new SoftKeyboardListener(activity);
        }
        return mSoftKeyboardListener;
    }

    public SoftKeyboardListener(Activity activity) {
        isShowKeyboard = false;
        decorView = activity.getWindow().getDecorView();
    }

    @Override
    public void onGlobalLayout() {
        if (mListener == null) return;
        Rect rect = new Rect();
        decorView.getWindowVisibleDisplayFrame(rect);
        int visibleHeight = rect.height();
        int diffHeight = decorView.getHeight() - visibleHeight;
        if (!isShowKeyboard && diffHeight > decorView.getRootView().getHeight() / 4) {
            isShowKeyboard = true;
            mListener.onKeyboardShow(diffHeight);
        } else if (isShowKeyboard && diffHeight < decorView.getRootView().getHeight() / 4) {
            isShowKeyboard = false;
            mListener.onKeyboardHide();
        }
    }

    /**
     * 注册监听
     */
    public void registerListener(@NotNull OnSoftKeyboardListener listener) {
        mListener = listener;
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(this);
        Log.e("TAG", "register " + this.hashCode());
    }

    /**
     * 取消监听
     */
    public void unregisterListener() {
        if (mSoftKeyboardListener != null) {
            Log.e("TAG", "unregister " + this.hashCode());
            decorView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            mListener = null;
            decorView = null;
            isShowKeyboard = false;
            mSoftKeyboardListener = null;
        }
    }

    public interface OnSoftKeyboardListener {
        /**
         * 软键盘弹出
         *
         * @param keyboardHeight 软键盘高度
         */
        void onKeyboardShow(int keyboardHeight);

        /**
         * 软键盘收起
         */
        void onKeyboardHide();
    }
}
```

**XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true"
    tools:context=".LoginActivity">

    <ImageView
        android:id="@+id/logo"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="120dp"
        android:src="@mipmap/ic_launcher_round" />

    <LinearLayout
        android:id="@+id/content"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginLeft="15dp"
        android:layout_marginRight="15dp"
        android:orientation="vertical">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="300dp"
            android:gravity="center"
            android:orientation="horizontal">

            <ImageView
                android:layout_width="35dp"
                android:layout_height="35dp"
                android:src="@drawable/user" />

            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入用户名" />
        </LinearLayout>

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:gravity="center"
            android:orientation="horizontal">

            <ImageView
                android:layout_width="35dp"
                android:layout_height="35dp"
                android:src="@drawable/pwd" />

            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入密码" />
        </LinearLayout>

        <Button
            android:id="@+id/confirm"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:text="确定" />

        <RelativeLayout
            android:id="@+id/help"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_alignParentBottom="true"
            android:orientation="horizontal"
            android:padding="10dp">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentLeft="true"
                android:text="忘记密码" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentRight="true"
                android:text="注册" />
        </RelativeLayout>
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:gravity="center"
        android:orientation="horizontal"
        android:padding="10dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="联系客服" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="10dp"
            android:layout_marginRight="10dp"
            android:text="|" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="关于我们" />
    </LinearLayout>

</RelativeLayout>
```

**逻辑代码**

```kotlin
class LoginActivity2 : AppCompatActivity() {
    private lateinit var content: LinearLayout
    private lateinit var help: View
    private lateinit var confirm: Button
    private lateinit var logo: ImageView
    private var diff = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login2)
        content = findViewById(R.id.content)
        confirm = findViewById(R.id.confirm)
        help = findViewById(R.id.help)
        logo = findViewById(R.id.logo)

        help.post {
            diff = help.bottom - confirm.top
        }

        SoftKeyboardListener.with(this).registerListener(object : OnSoftKeyboardListener {
            override fun onKeyboardShow(keyboardHeight: Int) {
                Log.e("TAG", "软键盘弹出")
                AnimatorUtils.scaleXY(logo, 1F, 0.6F)
                AnimatorUtils.translationY(logo, 0F, -100F)
//                content.scrollBy(0, diff)
                AnimatorUtils.translationY(content, 0F, -diff.toFloat())
            }

            override fun onKeyboardHide() {
                Log.e("TAG", "软键盘收起")
                AnimatorUtils.scaleXY(logo, 0.6F, 1F)
                AnimatorUtils.translationY(logo, logo.translationY, 0F)
//                content.scrollTo(0, 0)
                AnimatorUtils.translationY(content, -diff.toFloat(), 0F)
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        SoftKeyboardListener.with(this).unregisterListener()
    }
}
```

