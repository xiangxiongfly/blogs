[TOC]

# Jetpack Lifecycle

## 概述

Lifecycle 是 Jetpack 架构组件中用来感知生命周期的组件，使用 Lifecycle 可以帮助开发者写出与生命周期相关且更简洁、更易维护的代码。

[官网](https://developer.android.google.cn/topic/libraries/architecture/lifecycle?hl=en)



## 添加依赖库

```groovy
def lifecycle_version = "2.5.0"
implementation "androidx.lifecycle:lifecycle-livedata-ktx:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-common-java8:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-process:$lifecycle_version"
```



## 生命周期的状态和事件

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5b9010e438a94de6b83c98b58ae93110.png)

```java
public enum Event { 
    ON_CREATE, 
    ON_START, 
    ON_RESUME, 
    ON_PAUSE, 
    ON_STOP, 
    ON_DESTROY, 
    ON_ANY
}
```

说明：前面几个状态分别对应 Activity 的生命周期，最后一个 ON_ANY 状态则表示可对应Activity的任意生命周期。

```java
public enum State { 
    DESTROYED, 
    INITIALIZED, 
    CREATED, 
    STARTED, 
    RESUMED;
}
```

说明：如果 getCurrentState() 返回值是 STARTED，表示当前 Activity 已经执行了 onStart() 方法，但是还未执行 onResume() 方法。 



## 简单使用

### 传统方式监听生命周期

**定义接口：**

```kotlin
interface IObserver {
    fun dispatchCreate()
    fun dispatchStart()
    fun dispatchResume()
    fun dispatchPause()
    fun dispatchStop()
    fun dispatchDestroy()
}
```

**实现接口：**

```kotlin
class MyObserver : IObserver {
    override fun dispatchCreate() {
        Log.e("TAG", "Activity#onCreate()")
    }

    override fun dispatchStart() {
        Log.e("TAG", "Activity#onStart()")
    }

    override fun dispatchResume() {
        Log.e("TAG", "Activity#onResume()")
    }

    override fun dispatchPause() {
        Log.e("TAG", "Activity#onPause()")
    }

    override fun dispatchStop() {
        Log.e("TAG", "Activity#onStop()")
    }

    override fun dispatchDestroy() {
        Log.e("TAG", "Activity#onDestroy()")
    }
}
```

**使用：**

```kotlin
class LifecycleActivity : AppCompatActivity() {
    val myObserver = MyObserver()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle)
        myObserver.dispatchCreate()
    }

    override fun onStart() {
        super.onStart()
        myObserver.dispatchStart()
    }

    override fun onResume() {
        super.onResume()
        myObserver.dispatchResume()
    }

    override fun onPause() {
        super.onPause()
        myObserver.dispatchPause()
    }

    override fun onStop() {
        super.onStop()
        myObserver.dispatchStop()
    }

    override fun onDestroy() {
        super.onDestroy()
        myObserver.dispatchDestroy()
    }
}
```

### Lifecycle监听生命周期

- 通过`getLifecycle()`方法获取Lifecycler对象，再使用`addObserver()`方法注册监听。
- 创建观察者：
  - 方式一，实现 LifecycleObserver 接口，使用注解。
  - 方式二，实现 DefaultLifecycleObserver 接口，推荐非注解方式。

```kotlin
// 方式一，实现 LifecycleObserver 接口
class MyObserver2 : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun onInit() {
        Log.e("TAG", "MyObserver2 初始化")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun onConnect() {
        Log.e("TAG", "MyObserver2 建立连接")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun onDisconnect() {
        Log.e("TAG", "MyObserver2 断开连接")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onRelease() {
        Log.e("TAG", "MyObserver2 释放资源")
    }
}
```

```kotlin
// 方式二，实现 DefaultLifecycleObserver 接口
class MyObserver3 : DefaultLifecycleObserver {

    override fun onCreate(owner: LifecycleOwner) {
        super.onCreate(owner)
        Log.e("TAG", "MyObserver3 初始化")
    }

    override fun onResume(owner: LifecycleOwner) {
        super.onResume(owner)
        Log.e("TAG", "MyObserver3 建立连接")
    }

    override fun onPause(owner: LifecycleOwner) {
        super.onPause(owner)
        Log.e("TAG", "MyObserver3 断开连接")
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        Log.e("TAG", "MyObserver3 释放资源")
    }
}
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_lifecycle_simple)
    lifecycle.addObserver(MyObserver2())
    lifecycle.addObserver(MyObserver3())
}
```



## 广告页案例

打开广告页，显示5秒广告后进入下一页，也可以在点击按钮在广告结束前跳转下一页，页面销毁时，计时器销毁。

### 使用传统方式

**定义管理类：**

```kotlin
class AdvertisingManager {
    private var mOnAdvertisingListener:  OnAdvertisingListener? = null
    private var countDownTimer: CountDownTimer? = null

    /**
     * 开始计时
     */
    fun start() {
        countDownTimer = object : CountDownTimer(5000L, 1000L) {
            override fun onTick(millisUntilFinished: Long) {
                mOnAdvertisingListener?.time((millisUntilFinished / 1000L).toInt())
            }

            override fun onFinish() {
                mOnAdvertisingListener?.jumpToActivity()
            }
        }
        countDownTimer!!.start()
    }

    /**
     * 结束计时
     */
    fun cancel() {
        countDownTimer?.cancel()
        countDownTimer = null
    }

    fun setOnAdvertisingListener(onAdvertisingListener: OnAdvertisingListener) {
        mOnAdvertisingListener = onAdvertisingListener
    }

    interface OnAdvertisingListener {
        /**
         * 计时
         */
        fun time(second: Int)

        /**
         * 调整下一页
         */
        fun jumpToActivity()
    }
}
```

**使用：**

```kotlin
class AdvertisingActivity : AppCompatActivity() {
    private lateinit var textView: TextView
    private lateinit var btnNext: Button

    private var advertisingManager: AdvertisingManager? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_advertising)
        val context = this
        textView = findViewById(R.id.text_view)
        btnNext = findViewById(R.id.btn_next)
        btnNext.setOnClickListener {
            startActivity(Intent(context, SecondActivity::class.java))
            finish()
        }

        advertisingManager = AdvertisingManager()
        advertisingManager!!.setOnAdvertisingListener(object :
            AdvertisingManager.OnAdvertisingListener {
            override fun time(second: Int) {
                textView.text = "广告剩余时间：${second}秒"
            }

            override fun jumpToActivity() {
                startActivity(Intent(context, SecondActivity::class.java))
                finish()
            }
        })
        advertisingManager!!.start()
    }

    override fun onDestroy() {
        super.onDestroy()
        advertisingManager!!.cancel()
        advertisingManager = null
    }
}
```

### 使用Lifecycle

**定义管理类：**

```kotlin
class AdvertisingManager2 : DefaultLifecycleObserver {
    private var mOnAdvertisingListener: OnAdvertisingListener? = null
    private var countDownTimer: CountDownTimer? = null

    /**
     * 开始计时
     */
    fun start() {
        countDownTimer = object : CountDownTimer(5000L, 1000L) {
            override fun onTick(millisUntilFinished: Long) {
                mOnAdvertisingListener?.time((millisUntilFinished / 1000L).toInt())
            }

            override fun onFinish() {
                mOnAdvertisingListener?.jumpToActivity()
            }
        }
        countDownTimer!!.start()
    }

    override fun onCreate(owner: LifecycleOwner) {
        super.onCreate(owner)
        start()
    }

    /**
     * 结束计时
     */
    fun cancel() {
        countDownTimer?.cancel()
        countDownTimer = null
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        cancel()
    }

    fun setOnAdvertisingListener(onAdvertisingListener: OnAdvertisingListener) {
        mOnAdvertisingListener = onAdvertisingListener
    }

    interface OnAdvertisingListener {
        /**
         * 计时
         */
        fun time(second: Int)

        /**
         * 调整下一页
         */
        fun jumpToActivity()
    }
}
```

**使用：**

```kotlin
class AdvertisingActivity2 : AppCompatActivity() {
    private lateinit var textView: TextView
    private lateinit var btnNext: Button

    private var advertisingManager: AdvertisingManager2? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_advertising)
        val context = this
        textView = findViewById(R.id.text_view)
        btnNext = findViewById(R.id.btn_next)
        btnNext.setOnClickListener {
            startActivity(Intent(context, SecondActivity::class.java))
            finish()
        }

        advertisingManager = AdvertisingManager2()
        lifecycle.addObserver(advertisingManager!!)
        advertisingManager!!.setOnAdvertisingListener(object :
            AdvertisingManager2.OnAdvertisingListener {
            override fun time(second: Int) {
                textView.text = "广告剩余时间：${second}秒"
            }

            override fun jumpToActivity() {
                startActivity(Intent(context, SecondActivity::class.java))
                finish()
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        advertisingManager = null
    }
}
```

### 自定义LifecycleOwner

AppCompatActivity 继承自 FragmentActivity 继承自 ComponentActivity 实现了 LifecycleOwner 接口。

使用 getLifecycle 方法的前提是当前父类实现了 LifecycleOwner 接口，因此若需要在没有实现 LifecycleOwner 接口的类中使用该方法，则需要自定义 LifecycleOwner。

如下面的 Activity 类就需要实现 LifecycleOwner 接口：

```kotlin
class LifecycleCustomActivity : Activity(), LifecycleOwner {
    private lateinit var tvAdvertisingTime: TextView
    private lateinit var btnEnter: Button
    private lateinit var lifecycleRegistry: LifecycleRegistry
    private var advertisingManage: AdvertisingManage2? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle_custom)
        initView()
        lifecycleRegistry = LifecycleRegistry(this)
        //分发事件到观察者
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
        advertisingManage = AdvertisingManage2()
        //注册监听
        lifecycle.addObserver(advertisingManage!!)
        advertisingManage?.setAdvertisingManageListener(
            object : AdvertisingManage2.AdvertisingManageListener {
                override fun time(second: Int) {
                    tvAdvertisingTime.text = "广告剩余 $second 秒"
                }

                override fun gotoActivity() {
                    SecondActivity.start(this@LifecycleCustomActivity)
                    finish()
                }
            })
        btnEnter.setOnClickListener {
            SecondActivity.start(this@LifecycleCustomActivity)
            finish()
        }
    }

    private fun initView() {
        tvAdvertisingTime = findViewById(R.id.tv_advertising_time)
        btnEnter = findViewById(R.id.btn_enter)
    }

    override fun onDestroy() {
        super.onDestroy()
		//分发事件到观察者
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
        advertisingManage = null
    }

    override fun getLifecycle(): Lifecycle {
        return lifecycleRegistry
    }
}
```



## Dialog中使用Lifecycle

### 内存泄露问题

**Dialog**

```kotlin
class LifecycleDialog(context: Context) : Dialog(context) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.dialog_lifecycle)
    }
}
```

**使用**

```kotlin
class LifecycleDialogActivity : BaseActivity() {
    private lateinit var dialog: LifecycleDialog

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle_dialog)

        dialog = LifecycleDialog(mContext)
        dialog.show()
        postDelayed({
            finish()
        }, 2000L)
    }
}
```

**问题**

进入页面后弹出Dialog，2秒后finish当前页面，这时会抛出异常：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b23517b650a444baed0268522ebd5b8.png)

这是因为在Activity关闭的时候，Dialog没有关闭，进而导致内存泄漏。

### 传统方式解决

在 Activity 销毁时关闭Dialog。

```kotlin
class LifecycleDialogActivity : BaseActivity() {
    private lateinit var dialog: LifecycleDialog

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle_dialog)

        dialog = LifecycleDialog(mContext)
        dialog.show()
        postDelayed({
            finish()
        }, 2000L)
    }

    override fun onDestroy() {
        super.onDestroy()
        dialog.dismiss()
    }
}
```

可以在`onDestroy()`方法中编写额外的代码，但这样破坏了代码的完整性。

### 使用Lifecycle

修改 Dialog 的代码，使得 Dialog 可以感应生命周期变化。

```kotlin
class LifecycleDialog(context: Context) : Dialog(context), LifecycleObserver {
    init {
        if (context is ComponentActivity) {
            context.lifecycle.addObserver(this)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.dialog_lifecycle)
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onDestroy() {
        if (isShowing) dismiss()
    }
}
```

**也可以使用以下方式，更加推荐：**

```kotlin
class LifecycleDialog(context: Context) : Dialog(context), LifecycleEventObserver {
    init {
        if (context is ComponentActivity) {
            context.lifecycle.addObserver(this)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.dialog_lifecycle)
    }

    override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        if (event == Lifecycle.Event.ON_DESTROY) {
            if (isShowing) dismiss()
        }
    }
}
```



## 监听App前后台状态

```kotlin
class BaseApp : Application() {
    override fun onCreate() {
        super.onCreate()
        ProcessLifecycleOwner.get().lifecycle
            .addObserver(ApplicationLifecycleObserver())
    }
}

class ApplicationLifecycleObserver : DefaultLifecycleObserver {

    override fun onStart(owner: LifecycleOwner) {
        super.onStart(owner)
        onAppForeground()
    }

    private fun onAppForeground() {
        Log.e("TAG", "当前在前台")
    }

    override fun onStop(owner: LifecycleOwner) {
        super.onStop(owner)
        onAppBackground()
    }

    private fun onAppBackground() {
        Log.e("TAG", "当前在后台")
    }
}
```



## [源码分析](https://blog.csdn.net/qq_14876133/article/details/126969491)


