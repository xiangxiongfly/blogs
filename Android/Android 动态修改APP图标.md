[toc]

# Android 动态修改APP图标

**修改前：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/9554a3fb25384a67a01f82cd425cad6b.png)

**修改后：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1aaa4002480b47d0a91fba0ca2afc87b.png)



## 定义activity-alias

在 AndroidManifest.xml 中设置 activity-alias：

**activity-alias标签中的属性：**

| 标签                   | 作用                   |
| ---------------------- | ---------------------- |
| android:name           | 别名                   |
| android:enabled        | 是否启用别名           |
| android:icon           | 应用图标               |
| android:label          | 应用名                 |
| android:targetActivity | 必须指向原入口Activity |

下面定义了2个alias标签：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapplication">

    <application
        android:name=".BaseApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApplication">
        <activity android:name=".SecondActivity" />
        <activity android:name=".MainActivity" />

        <activity-alias
            android:name=".DefaultAliasActivity"
            android:enabled="true"
            android:exported="true"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher_round"
            android:targetActivity=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>

        <activity-alias
            android:name=".TaobaoAliasActivity"
            android:enabled="false"
            android:exported="true"
            android:icon="@mipmap/ic_taobao"
            android:label="taobao"
            android:targetActivity=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>

    </application>

</manifest>
```



## 修改图标和App名

```kotlin
object AliasUtils {
    private const val DEFAULT_ALIAS = "com.example.myapplication.DefaultAliasActivity"
    private const val TAOBAO_ALIAS = "com.example.myapplication.TaobaoAliasActivity"

    fun setDefaultAlias(context: Context) {
        context.packageManager.apply {
            setComponentEnabledSetting(
                ComponentName(context, DEFAULT_ALIAS),
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            )
            setComponentEnabledSetting(
                ComponentName(context, TAOBAO_ALIAS),
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        }
    }

    fun setTaobaoAlias(context: Context) {
        context.packageManager.apply {
            setComponentEnabledSetting(
                ComponentName(context, TAOBAO_ALIAS),
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            )
            setComponentEnabledSetting(
                ComponentName(context, DEFAULT_ALIAS),
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        }
    }
}
```



## 监听APP前后台状态切换

```kotlin
class BaseApplication : Application() {
    companion object {
        private lateinit var INSTANCE: BaseApplication

        fun getInstance(): BaseApplication {
            return INSTANCE
        }
    }

    override fun onCreate() {
        super.onCreate()
        INSTANCE = this
        ActivityManager.getInstance().init(INSTANCE)
    }
}
```

```java
public final class ActivityManager implements Application.ActivityLifecycleCallbacks {

    private static volatile ActivityManager sInstance;

    /**
     * Activity 存放集合
     */
    private final ArrayMap<String, Activity> mActivitySet = new ArrayMap<>();

    /**
     * 应用生命周期回调
     */
    private final ArrayList<ApplicationLifecycleCallback> mLifecycleCallbacks = new ArrayList<>();

    /**
     * 当前应用上下文对象
     */
    private Application mApplication;
    /**
     * 栈顶的 Activity 对象
     */
    private Activity mTopActivity;
    /**
     * 前台并且可见的 Activity 对象
     */
    private Activity mResumedActivity;

    private ActivityManager() {
    }

    public static ActivityManager getInstance() {
        if (sInstance == null) {
            synchronized (ActivityManager.class) {
                if (sInstance == null) {
                    sInstance = new ActivityManager();
                }
            }
        }
        return sInstance;
    }

    public void init(Application application) {
        mApplication = application;
        mApplication.registerActivityLifecycleCallbacks(this);
    }

    /**
     * 获取 Application 对象
     */
    public Application getApplication() {
        return mApplication;
    }

    /**
     * 获取栈顶的 Activity
     */
    @Nullable
    public Activity getTopActivity() {
        return mTopActivity;
    }

    /**
     * 获取前台并且可见的 Activity
     */
    @Nullable
    public Activity getResumedActivity() {
        return mResumedActivity;
    }

    /**
     * 判断当前应用是否处于前台状态
     */
    public boolean isForeground() {
        return getResumedActivity() != null;
    }

    /**
     * 注册应用生命周期回调
     */
    public void registerApplicationLifecycleCallback(ApplicationLifecycleCallback callback) {
        mLifecycleCallbacks.add(callback);
    }

    /**
     * 取消注册应用生命周期回调
     */
    public void unregisterApplicationLifecycleCallback(ApplicationLifecycleCallback callback) {
        mLifecycleCallbacks.remove(callback);
    }

    /**
     * 销毁指定的 Activity
     */
    public void finishActivity(Class<? extends Activity> clazz) {
        if (clazz == null) {
            return;
        }
        String[] keys = mActivitySet.keySet().toArray(new String[]{});
        for (String key : keys) {
            Activity activity = mActivitySet.get(key);
            if (activity == null || activity.isFinishing()) {
                continue;
            }

            if (activity.getClass().equals(clazz)) {
                activity.finish();
                mActivitySet.remove(key);
                break;
            }
        }
    }

    /**
     * 销毁所有的 Activity
     */
    public void finishAllActivities() {
        finishAllActivities((Class<? extends Activity>) null);
    }

    /**
     * 销毁所有的 Activity
     *
     * @param classArray 白名单 Activity
     */
    @SafeVarargs
    public final void finishAllActivities(Class<? extends Activity>... classArray) {
        String[] keys = mActivitySet.keySet().toArray(new String[]{});
        for (String key : keys) {
            Activity activity = mActivitySet.get(key);
            if (activity == null || activity.isFinishing()) {
                continue;
            }

            boolean whiteClazz = false;
            if (classArray != null) {
                for (Class<? extends Activity> clazz : classArray) {
                    if (activity.getClass().equals(clazz)) {
                        whiteClazz = true;
                    }
                }
            }

            if (whiteClazz) {
                continue;
            }

            // 如果不是白名单上面的 Activity 就销毁掉
            activity.finish();
            mActivitySet.remove(key);
        }
    }

    @Override
    public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {
        if (mActivitySet.size() == 0) {
            for (ApplicationLifecycleCallback callback : mLifecycleCallbacks) {
                callback.onApplicationCreate(activity);
            }
        }
        mActivitySet.put(getObjectTag(activity), activity);
        mTopActivity = activity;
    }

    @Override
    public void onActivityStarted(@NonNull Activity activity) {
    }

    @Override
    public void onActivityResumed(@NonNull Activity activity) {
        if (mTopActivity == activity && mResumedActivity == null) {
            for (ApplicationLifecycleCallback callback : mLifecycleCallbacks) {
                callback.onApplicationForeground(activity);
            }
        }
        mTopActivity = activity;
        mResumedActivity = activity;
    }

    @Override
    public void onActivityPaused(@NonNull Activity activity) {
    }

    @Override
    public void onActivityStopped(@NonNull Activity activity) {
        if (mResumedActivity == activity) {
            mResumedActivity = null;
        }
        if (mResumedActivity == null) {
            for (ApplicationLifecycleCallback callback : mLifecycleCallbacks) {
                callback.onApplicationBackground(activity);
            }
        }
    }

    @Override
    public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(@NonNull Activity activity) {
        mActivitySet.remove(getObjectTag(activity));
        if (mTopActivity == activity) {
            mTopActivity = null;
        }
        if (mActivitySet.size() == 0) {
            for (ApplicationLifecycleCallback callback : mLifecycleCallbacks) {
                callback.onApplicationDestroy(activity);
            }
        }
    }

    /**
     * 获取一个对象的独立无二的标记
     */
    private static String getObjectTag(Object object) {
        // 对象所在的包名 + 对象的内存地址
        return object.getClass().getName() + Integer.toHexString(object.hashCode());
    }

    /**
     * 应用生命周期回调
     */
    public interface ApplicationLifecycleCallback {

        /**
         * 第一个 Activity 创建了
         */
        void onApplicationCreate(Activity activity);

        /**
         * 最后一个 Activity 销毁了
         */
        void onApplicationDestroy(Activity activity);

        /**
         * 应用从前台进入到后台
         */
        void onApplicationBackground(Activity activity);

        /**
         * 应用从后台进入到前台
         */
        void onApplicationForeground(Activity activity);
    }
}
```



## 进入后台时切换修改图标和名字

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    ActivityManager.getInstance().registerApplicationLifecycleCallback(object :
        ActivityManager.ApplicationLifecycleCallback {
        override fun onApplicationCreate(activity: Activity?) {
        }

        override fun onApplicationDestroy(activity: Activity?) {
        }

        override fun onApplicationBackground(activity: Activity?) {
            Log.e("TAG", "App处于后台")
            if (type == TYPE_DEFAULT) {
                AliasUtils.setDefaultAlias(this@MainActivity)
            } else if (type == TYPE_TAOBAO) {
                AliasUtils.setTaobaoAlias(this@MainActivity)
            }
        }

        override fun onApplicationForeground(activity: Activity?) {
            Log.e("TAG", "App处于前台")
        }
    })
}
```



## 缺点

- 切换图标时，应用会自动退出，因此放在后台执行相对有好些。
- 切换图标是一个耗时过程，1s~10s不等。
- 在切换图标过程中，点击App图标，可能会提示“应用数据读取失败”等。



