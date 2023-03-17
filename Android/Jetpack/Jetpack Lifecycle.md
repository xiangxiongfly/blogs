[TOC]

# Jetpack Lifecycle

## 概述

- Lifecycle是Jetpack组件中用来感知生命周期的组件，使用Lifecycle可以帮助开发者写出与生命周期相关且简洁、易于维护的代码。

- Lifecycle 是多个 Jetpack 组件的基础，例如我们熟悉的 LiveData 就是以 Lifecycle 为基础实现的生命周期感知型数据容器。



## 添加依赖库

```groovy
def lifecycle_version = "2.5.0"
implementation "androidx.lifecycle:lifecycle-livedata-ktx:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-common-java8:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-process:$lifecycle_version"
```



## Lifecycle事件状态图

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021031412231130.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



## 简单使用

### 传统方式监听生命周期

```kotlin
interface IObserver {
    fun dispatchCreate()
    fun dispatchStart()
    fun dispatchResume()
    fun dispatchPause()
    fun dispatchStop()
    fun dispatchDestroy()
}

class CustomObserver : IObserver {
    override fun dispatchCreate() {
        Log.e(LIFECYCLE, "Activity onCreate")
    }

    override fun dispatchStart() {
        Log.e(LIFECYCLE, "Activity onStart")
    }

    override fun dispatchResume() {
        Log.e(LIFECYCLE, "Activity onResume")
    }

    override fun dispatchPause() {
        Log.e(LIFECYCLE, "Activity onPause")
    }

    override fun dispatchStop() {
        Log.e(LIFECYCLE, "Activity onStop")
    }

    override fun dispatchDestroy() {
        Log.e(LIFECYCLE, "Activity onDestroy")
    }
}
```

```kotlin
class LifecycleSimpleActivity : BaseActivity() {
    val customObserver = CustomObserver()

    companion object {
        fun start(context: Context) {
            context.startActivity(Intent(context, LifecycleSimpleActivity::class.java).apply {
                putExtra(KEY_TITLE, "Lifecycle简单使用")
            })
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle_simple)
        lifecycle.addObserver(MyObserver())
        lifecycle.addObserver(MyObserver2())
        customObserver.dispatchCreate()
    }

    override fun onStart() {
        super.onStart()
        customObserver.dispatchStart()
    }

    override fun onResume() {
        super.onResume()
        customObserver.dispatchResume()
    }

    override fun onPause() {
        super.onPause()
        customObserver.dispatchPause()
    }

    override fun onStop() {
        super.onStop()
        customObserver.dispatchStop()
    }

    override fun onDestroy() {
        super.onDestroy()
        customObserver.dispatchDestroy()
    }
}
```

### Lifecycle监听生命周期

- 通过`getLifecycle()`方法获取Lifecycler对象，再使用`addObserver()`方法注册监听。
- 创建观察者：
  - 方式一，实现`LifecycleObserver`接口，使用注解。
  - 方式二，实现`DefaultLifecycleObserver`接口，非注解方式较推荐。

```kotlin
//方式一：
class MyObserver : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun onInit() {
        Log.e(LIFECYCLE, "MyObserver 初始化")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun onConnect(owner: LifecycleOwner) {
        Log.e(LIFECYCLE, "MyObserver 建立连接")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun onDisconnect(owner: LifecycleOwner) {
        Log.e(LIFECYCLE, "MyObserver 断开连接")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onRelease() {
        Log.e(LIFECYCLE, "MyObserver 释放")
    }
}
```

```kotlin
//方式二
class MyObserver2 : DefaultLifecycleObserver {

    override fun onCreate(owner: LifecycleOwner) {
        super.onCreate(owner)
        onInit()
    }

    private fun onInit() {
        Log.e(LIFECYCLE, "MyObserver2 初始化")
    }

    override fun onResume(owner: LifecycleOwner) {
        super.onResume(owner)
        onConnect(owner)
    }

    private fun onConnect(owner: LifecycleOwner) {
        Log.e(LIFECYCLE, "MyObserver2 建立连接")
    }

    override fun onPause(owner: LifecycleOwner) {
        super.onPause(owner)
        onDisconnect(owner)
    }

    private fun onDisconnect(owner: LifecycleOwner) {
        Log.e(LIFECYCLE, "MyObserver2 断开连接")
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        onRelease()
    }

    private fun onRelease() {
        Log.e(LIFECYCLE, "MyObserver2 释放")
    }
}
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_lifecycle_simple)
    lifecycle.addObserver(MyObserver())
    lifecycle.addObserver(MyObserver2())
}
```



## 广告页案例

开启广告页，显示5秒广告后进入下一页，也可以在广告结束前点击跳过广告直接进入下一页。

页面销毁时，计时器销毁。

### 使用传统方式

**广告管理类**

```kotlin
class AdvertisingManage {

    private var mAdvertisingManageListener: AdvertisingManageListener? = null

    private var countDownTimer: CountDownTimer? =
        object : CountDownTimer(5000L, 1000L) {
            override fun onTick(millisUntilFinished: Long) {
                mAdvertisingManageListener?.time((millisUntilFinished / 1000L).toInt())
            }

            override fun onFinish() {
                mAdvertisingManageListener?.gotoActivity()
            }
        }

    /**
     * 开始计时
     */
    fun start() {
        countDownTimer?.start()
    }

    /**
     * 结束计时
     */
    fun cancel() {
        countDownTimer?.cancel()
        countDownTimer = null
    }

    fun setAdvertisingManageListener(advertisingManageListener: AdvertisingManageListener) {
        mAdvertisingManageListener = advertisingManageListener
    }

    interface AdvertisingManageListener {
        /**
         * 计时
         */
        fun time(second: Int)

        /**
         * 计时结束后进入主界面
         */
        fun gotoActivity()
    }
}
```

**广告页**

```kotlin
class AdvertisingActivity : BaseActivity() {
    private lateinit var tvAdvertisingTime: TextView
    private lateinit var btnEnter: Button
    private var advertisingManage: AdvertisingManage? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_advertising1)
        initView()
        advertisingManage = AdvertisingManage()
        advertisingManage?.setAdvertisingManageListener(
            object : AdvertisingManage.AdvertisingManageListener {
                override fun time(second: Int) {
                    tvAdvertisingTime.text = "广告剩余 $second 秒"
                }

                override fun gotoActivity() {
                    SecondActivity.start(mContext)
                    finish()
                }
            })
        btnEnter.setOnClickListener {
            SecondActivity.start(mContext)
            finish()
        }
        advertisingManage?.start()
    }

    private fun initView() {
        tvAdvertisingTime = findViewById(R.id.tv_advertising_time)
        btnEnter = findViewById(R.id.btn_enter)
    }

    override fun onDestroy() {
        super.onDestroy()
        advertisingManage?.cancel()
        advertisingManage = null
    }
}
```



### 使用Lifecycle

**广告管理类**

```kotlin
class AdvertisingManage2 : DefaultLifecycleObserver {

    private var mAdvertisingManageListener: AdvertisingManageListener? = null

    private var countDownTimer: CountDownTimer? =
    object : CountDownTimer(5000L, 1000L) {
        override fun onTick(millisUntilFinished: Long) {
            Log.e(TAG, "广告剩余 ${millisUntilFinished / 1000L} 秒")
            mAdvertisingManageListener?.time((millisUntilFinished / 1000L).toInt())
        }

        override fun onFinish() {
            Log.e(TAG, "广告结束，跳转页面")
            mAdvertisingManageListener?.gotoActivity()
        }
    }

    override fun onCreate(owner: LifecycleOwner) {
        super.onCreate(owner)
        start()
    }

    private fun start() {
        Log.e(TAG, "开始计时")
        countDownTimer?.start()
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        cancel()
    }

    /**
     * 结束计时
     */
    private fun cancel() {
        Log.e(TAG, "结束计时")
        countDownTimer?.cancel()
        countDownTimer = null
    }

    fun setAdvertisingManageListener(advertisingManageListener: AdvertisingManageListener) {
        mAdvertisingManageListener = advertisingManageListener
    }

    interface AdvertisingManageListener {
        /**
         * 计时
         */
        fun time(second: Int)

        /**
         * 计时结束后进入主界面
         */
        fun gotoActivity()
    }
}
```

**广告页**

```kotlin
class AdvertisingActivity2 : BaseActivity() {
    private lateinit var tvAdvertisingTime: TextView
    private lateinit var btnEnter: Button
    private var advertisingManage: AdvertisingManage2? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_advertising2)
        initView()
        advertisingManage = AdvertisingManage2()
        lifecycle.addObserver(advertisingManage!!)
        advertisingManage?.setAdvertisingManageListener(
            object : AdvertisingManage2.AdvertisingManageListener {
                override fun time(second: Int) {
                    tvAdvertisingTime.text = "广告剩余 $second 秒"
                }

                override fun gotoActivity() {
                    SecondActivity.start(mContext)
                    finish()
                }
            })
        btnEnter.setOnClickListener {
            SecondActivity.start(mContext)
            finish()
        }
    }

    private fun initView() {
        tvAdvertisingTime = findViewById(R.id.tv_advertising_time)
        btnEnter = findViewById(R.id.btn_enter)
    }

    override fun onDestroy() {
        super.onDestroy()
        advertisingManage = null
    }
}
```



### 自定义LifecycleOwner

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



### 传统方式解决

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
        ProcessLifecycleOwner.get().lifecycle.addObserver(ApplicationLifecycleObserver())
    }
}

class ApplicationLifecycleObserver : DefaultLifecycleObserver {

    override fun onStart(owner: LifecycleOwner) {
        super.onStart(owner)
        onAppForeground()
    }

    fun onAppForeground() {
        Log.e("TAG", "App在前台")
    }

    override fun onStop(owner: LifecycleOwner) {
        super.onStop(owner)
        onAppBackground()
    }

    fun onAppBackground() {
        Log.e("TAG", "App在后台")
    }
}
```



## [源码分析](https://blog.csdn.net/qq_14876133/article/details/126969491)



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/jetpack/src/main/java/com/example/jetpack/lifecycle)

