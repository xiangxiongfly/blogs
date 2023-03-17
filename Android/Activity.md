[TOC]

# 四大组件之Activity

## Activity生命周期回调

Activity生命周期是Android开发基础之一，在开发中经常用到生命周期，比如：UI的初始化和回收操作、第三方框架的注册和反注册，线程和网络请求的管理等。

**Activity生命周期回调**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190715111042611.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

**Activity四种状态**

![在这里插入图片描述](https://img-blog.csdnimg.cn/d86fb4b5f43a462f95e3b4ef89fa49ef.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_11,color_FFFFFF,t_70,g_se,x_16)

**生命周期详解**

| 生命周期回调 | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| onCreate()   | Activity被创建时回调，不可见状态。可以做一些初始化操作。     |
| onStart()    | Activity进入前台前的瞬间状态，用户可见但不可交互。           |
| onResume()   | Activity进入前台，位于Activity栈的顶部，用户可见可交互。     |
| onPause()    | Activity进入暂停状态，用户可见但不可交互。可以做一些资源回收操作。 |
| onStop()     | Activity进入停止状态，用户不可见。可以做一些停止动画运行和UI更新的操作。 |
| onDestroy()  | Activity被销毁时调用。可以用`isFinishing()`判断，为true时表示Activity正在被系统销毁。可以做一些资源回收操作。 |
| onRestart()  | 由onStop状态切换至onStart状态                                |

**注意：**

Android为了方便对Activity组件的管理以及开发使用，对Activity进行了封装，开发者不能直接new一个Activity对象（new出来的对象不被Android管理，失去了生命周期流程）。



## 生命周期变化

**点击back键时生命周期变化：**

````
onPause -> onStop -> onDestroy
````

**点击home键后再打开Activity的生命周期变化：**

```
onPause -> onStop -> onRestart -> onStart -> onResume
```

**从Activity A 跳转Activity B 时的生命周期变化：**

```
A onPause() -> B onCreate() -> B onStart() -> B onResume() -> A onStop()
```

**Activity B 返回到 Activity A的生命周期变化：**

```
B onPause() -> A onRestart() -> A onStart() -> A onResume() -> B onStop() -> B onDestroy()
```

**当屏幕发生旋转时生命周期变化：**

````
onPause() -> onSaveInstanceState() -> onStop() -> onDestroy() -> onCreate() -> onStart() -> onRestoreInstanceState() -> onResume()
````

**弹出Dialog**

Activity弹出Dialog没有生命周期变化。



## 数据保存和恢复

### onSaveInstanceState()

在Activity开始停止时或非正常情况下被销毁，系统会调用`onSaveInstanceState()`方法，方便Activity保存状态信息，`onSaveInstanceState()`可能在`onStop()`之前或之后执行。

```kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.apply {
        putString("name", "小明")
        putInt("age", 18)
        putString("address", "beijing")
    }
}
```

### onCreate()/onRestoreInstanceState()

当停止或销毁的Activity被重建后，可以从`onCreate()`和`onRestoreInstanceState()`回调方法中获取状态信息，`onRestoreInstanceState()`会在`onStart()`和`onResume()`之间调用。

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    if (savedInstanceState != null) {
        val name = savedInstanceState.getString("name")
        val age = savedInstanceState.getInt("age")
        val address = savedInstanceState.getString("address")
    }
}
```

```kotlin
override fun onRestoreInstanceState(savedInstanceState: Bundle) {
    super.onRestoreInstanceState(savedInstanceState)
    val name = savedInstanceState.getString("name")
    val age = savedInstanceState.getInt("age")
    val address = savedInstanceState.getString("address")
}
```



## Activity之间导航

### 显式启动

```kotlin
 context.startActivity(Intent(context, SecondActivity::class.java))
```

```kotlin
startActivityForResult(Intent(this, SecondActivity::class.java), REQ_CODE)

override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQ_CODE) {
        if (resultCode == Activity.RESULT_OK) {
            data?.let {
                val value: String? = data.getStringExtra("hello")
                log(value!!)
            }
        }
    }
}
```



### 隐式启动

```xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.activitydemo.MY_ACTION" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

```kotlin
val intent = Intent()
intent.setAction("com.example.activitydemo.MY_ACTION")
intent.addCategory("com.example.activitydemo.MY_CATEGORY")
startActivity(intent)
```



## 四种启动模式

**standard**

标准模式，即默认模式，每次启动Activity都会进行一次入栈操作。

**singleTop**

栈顶复用机制，如果当前任务栈的顶部存在该Acivity实例，则会复用该实例，并回调`onNewIntent()`方法。

**singleTask**

栈内复用机制，如果当前任务栈存在该Activity实例，则会复用该实例，并回调`onNewIntent()`方法，并会清楚它上面的实例。

**singleInstance**

会新建一个任务栈，并将该Activity实例放入新任务栈中。



### Intent标记

- Intent.FLAG_ACTIVITY_NEW_TASK
- Intent.FLAG_ACTIVITY_CLEAR_TOP
- Intent.FLAG_ACTIVITY_SINGLE_TOP

```kotlin
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)

//等价于SingleTop启动模式
```

```kotlin
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

//等价于SingleTask启动模式
```



## 跳转另一个App的Activity

```kotlin
val intent = Intent()
//设置包名和Activity全名
intent.setClassName("com.example.other", "com.example.other.MainActivity")
intent.putExtra("name", "小黑")
intent.putExtra("age", 18)
intent.putExtra("address", "beijing")
startActivity(intent)
```



## 屏幕旋转问题

旋转屏幕时，会重走Activity生命周期：`onPause -> onStop -> onDestroy -> onCreate -> onStart -> onResume`，导致界面重新渲染数据丢失。

### 解决一

使用`onSaveInstanceState`和`onRestoreInstanceState`保存和恢复数据。

### 解决二

在`AndroidManifest.xml`文件中设置`android:configChanges="orientation|screenSize"`，这样手机屏幕旋转时只会执行`onConfigurationChanged()`方法。

### 解决三

可以使用Jetpack中的ViewModel组件，ViewModel会保持这些数据，避免受Activity影响导致数据丢失。



## 监听App前后台切换

```kotlin
class BaseApplication : Application() {

    //Activity数量
    private var activityCount = 0

    //是否在前台
    private var isForeground = false

    companion object {
        lateinit var INSTANCE: BaseApplication
    }

    override fun onCreate() {
        super.onCreate()
        INSTANCE = this
        initRegister()
    }

    private fun initRegister() {
        registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
            }

            override fun onActivityStarted(activity: Activity) {
                activityCount++
                if (!isForeground) {
                    setForeground(true)
                    mOnForegroundListener?.onForeground(isForeground())
                }
            }

            override fun onActivityResumed(activity: Activity) {
            }

            override fun onActivityPaused(activity: Activity) {
            }

            override fun onActivityStopped(activity: Activity) {
                activityCount--
                if (activityCount == 0) {
                    setForeground(false)
                    mOnForegroundListener?.onForeground(isForeground())
                }
            }

            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
            }

            override fun onActivityDestroyed(activity: Activity) {
            }
        })
    }

    /**
     * 是否在前台
     * @return Boolean
     */
    fun isForeground() = isForeground

    private fun setForeground(isForeground: Boolean) {
        this.isForeground = isForeground
    }

    interface OnForegroundListener {
        fun onForeground(isForeground: Boolean)
    }

    private var mOnForegroundListener: OnForegroundListener? = null

    fun setOnForegroundListener(onForegroundListener: OnForegroundListener) {
        mOnForegroundListener = onForegroundListener
    }
}
```

```kotlin
BaseApplication.INSTANCE.setOnForegroundListener(object : BaseApplication.OnForegroundListener {
    override fun onForeground(isForeground: Boolean) {
        log("是否位于前台:$isForeground")
    }
})
```



## 管理封装Activity

```kotlin
open class BaseActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.i("TopActivity", this.javaClass.name)
        ActivityCollector.addActivity(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        ActivityCollector.removeActivity(this)
    }

    object ActivityCollector {
        private val activites = ArrayList<Activity>()

        fun addActivity(activity: Activity) {
            activites.add(activity)
        }

        fun removeActivity(activity: Activity) {
            activites.remove(activity)
        }

        fun finishAll() {
            for (activity in activites) {
                if (!activity.isFinishing) {
                    activity.finish()
                }
            }
            activites.clear()
        }
    }
}
```

**规范startActivity**

```kotlin
class TwoActivity : BaseActivity() {
    companion object {
        fun actionStart(context: Context, param1: String, param2: String) {
            val intent = Intent(context, TwoActivity::class.java)
            intent.putExtra("param1", param1)
            intent.putExtra("param2", param2)
            context.startActivity(intent)
        }
    }
}
```

```kotlin
TwoActivity.actionStart(this, "data1", "data2")
```



## 点击EditText区域外收起键盘

### 方法一

```kotlin
open class BaseActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val contentView = findViewById<ViewGroup>(Window.ID_ANDROID_CONTENT)
        contentView.setOnClickListener {
            KeyboardUtils.hideKeyboard(currentFocus)
        }
    }
}
```



### 方法二

```kotlin
open class BaseActivity : AppCompatActivity() {

    override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
        val v = currentFocus
        if (v != null) {
            if (ev.action == MotionEvent.ACTION_DOWN) {
                if (isShouldHideInput(v, ev)) {
                    KeyboardUtils.hideKeyboard(v)
                }
            }
        }
        return super.dispatchTouchEvent(ev)
    }

    /**
     * 是否需要隐藏键盘
     */
    private fun isShouldHideInput(v: View, event: MotionEvent): Boolean {
        if (v is EditText) {
            val l = intArrayOf(0, 0)
            v.getLocationOnScreen(l)
            val left = l[0]
            val top = l[1]
            val bottom: Int = top + v.getHeight()
            val right: Int = left + v.getWidth()

            return !(event.getRawX() > left && event.getRawX() < right
                     && event.getRawY() > top && event.getRawY() < bottom)
        }
        return false
    }
}
```

