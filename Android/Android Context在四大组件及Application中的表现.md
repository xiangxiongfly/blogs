[TOC]

# Android Context在四大组件及Application中的表现

## Context是什么

Context可以理解为“上下文”或”环境“，它提供了**访问系统服务及系统资源的功能**，Context 参与加载资源、启动Activity、启动Service、获取系统服务/应用资源、创建View、数据库等操作。 

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/97d83854abb04e8c9a3dda61f79e2a65.png)

Context有两个实现子类：ContextImpl类和ContextWrapper类。

ContextWrapper类，如其名所言，是一个包装类，内部必须包含一个真正的Context引用（mBase），调用ContextWrapper的方法都会被指向真正的Context对。

ContextThemeWrapper类，如起名所言，内部包含了与Theme（主题）相关的信息，这里的Theme就是定义在Androidmanifest.xml中主题，只有Activity才能定义主题，Servier是不需要主题的，所以Service直接继承自ContextWrapper，Application也同理。

ContextImpl类是真正实现了Context中的所有方法，应用程序中所调用的各种Context类方法都来自该类。



## Context源码

```java
public abstract class Context {
    
    // 作用1：获取应用相关信息
    public abstract ApplicationInfo getApplicationInfo();
    public abstract String getPackageName();
    public abstract Looper getMainLooper();
    public abstract int checkPermission(@NonNull String permission, int pid, int uid);

    // 作用2：获取系统/应用资源
    // 如 AssetManager、PackageManager、Resources、System Service 以及 color、string、drawable 等
    public abstract AssetManager getAssets();
    public abstract Resources getResources();
    public abstract PackageManager getPackageManager();
    public abstract Context getApplicationContext();
    public abstract ClassLoader getClassLoader();
    public final @Nullable <T> T getSystemService(@NonNull Class<T> serviceClass) { ... }

    public final String getString(@StringRes int resId) { ... }
    public final int getColor(@ColorRes int id) { ... }
    public final Drawable getDrawable(@DrawableRes int id) { ... }
    public abstract Resources.Theme getTheme();
    public abstract void setTheme(@StyleRes int resid);
    public final TypedArray obtainStyledAttributes(@StyleableRes int[] attrs) { ... }

    // 作用3：四大组件之间的交互
    // 如启动 Activity、Broadcast、Service，获取 ContentResolver 等
    public abstract void startActivity(@RequiresPermission Intent intent);
    public abstract void sendBroadcast(@RequiresPermission Intent intent);
    public abstract Intent registerReceiver(@Nullable BroadcastReceiver receiver,
                                            IntentFilter filter);
    public abstract void unregisterReceiver(BroadcastReceiver receiver);
    public abstract ComponentName startService(Intent service);
    public abstract boolean stopService(Intent service);
    public abstract boolean bindService(@RequiresPermission Intent service,
            @NonNull ServiceConnection conn, @BindServiceFlags int flags);
    public abstract void unbindService(@NonNull ServiceConnection conn);
    public abstract ContentResolver getContentResolver();
    
    // 作用4：文件相关
    // 如：获取缓存文件夹、删除文件、SharedPreference 相关等
    public abstract File getSharedPreferencesPath(String name);
    public abstract File getDataDir();
    public abstract boolean deleteFile(String name);
    public abstract File getExternalFilesDir(@Nullable String type);
    public abstract File getCacheDir();
    ...
    public abstract SharedPreferences getSharedPreferences(String name, @PreferencesMode int mode);
    public abstract boolean deleteSharedPreferences(String name);

    // 作用5：数据库
    // 如打开数据库、删除数据库、获取数据库路径等
    public abstract SQLiteDatabase openOrCreateDatabase(...);
    public abstract boolean deleteDatabase(String name);
    public abstract File getDatabasePath(String name);
   
    ...
}
```



## Activity流程分析

**核心源码分析：**

```java
// ActivityThread类：

private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {
    // 创建ContextImpl
    ContextImpl appContext = createBaseContextForActivity(r);
    Activity activity = null;
    try {
        java.lang.ClassLoader cl = appContext.getClassLoader();
        // 通过反射创建Activity
        activity = mInstrumentation.newActivity(
                cl, component.getClassName(), r.intent);       
    } 

    try {
        // 获得Application
        Application app = r.packageInfo.makeApplication(false, mInstrumentation);

        if (activity != null) {
            appContext.setOuterContext(activity);
            // 通过attach()方法将appContext和app传递给Activity
            activity.attach(appContext, this, getInstrumentation(), r.token,
                    r.ident, app, r.intent, r.activityInfo, title, r.parent,
                    r.embeddedID, r.lastNonConfigurationInstances, config,
                    r.referrer, r.voiceInteractor, window, r.configCallback,
                    r.assistToken, r.shareableActivityToken);
    }
    return activity;
}
```

```java
// Activity类：

public class Activity extends ContextThemeWrapper {
    private Application mApplication;

    final void attach(Context context, ActivityThread aThread,
                      Instrumentation instr, IBinder token, int ident,
                      Application application, Intent intent, ActivityInfo info,
                      CharSequence title, Activity parent, String id,
                      NonConfigurationInstances lastNonConfigurationInstances,
                      Configuration config, String referrer, IVoiceInteractor voiceInteractor,
                      Window window, ActivityConfigCallback activityConfigCallback, 
                      IBinder assistToken,
                      IBinder shareableActivityToken) {
        
        // 最终传递给mBase变量
        attachBaseContext(context);

        mApplication = application;        
    }

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(newBase);
    }

    public final Application getApplication() {
        return mApplication;
    }
}
```

**说明：**

ContextWrapper 内部包含一个 ContextImpl 类型的成员变量 mBase，mBase的创建是通过 ActivityThread#performLaunchActivity() 创建的。

performLaunchActivity() 主要是四步：

- 通过 createBaseContextForActivity() 方法创建 ContextImpl 实例，得到appContext。
- 通过反射创建Activity实例。
- 获得Application实例，也就是app。
- 通过 attach() 方法将 appContext 和 app 传递给Activity，初始化 mBase  变量。



## Service流程分析

**核心源码分析：**

```java
// ActivityThread类； 

private void handleCreateService(CreateServiceData data) {       
        Service service = null;
        try {
            // 获取Application
            Application app = packageInfo.makeApplication(false, mInstrumentation);
			// 通过反射创建Service
            service = packageInfo.getAppFactory()
                    .instantiateService(cl, data.info.name, data.intent);
            // 创建ContextImpl
            ContextImpl context = ContextImpl.getImpl(service
            // 将context和app传递给Service
            service.attach(context, this, data.info.name, data.token, app,
                    ActivityManager.getService());
        } 
}
```

**说明：**

Service 的流程和 Activity 基本一致。



## BroadcastReceiver流程分析

**核心源码分析：**

```java
// ActivityThread类：

private void handleReceiver(ReceiverData data) {
    Application app;
    BroadcastReceiver receiver;
    ContextImpl context;
    try {
        // 获取Application
        app = packageInfo.makeApplication(false, mInstrumentation);
        // 获取ContextImpl
        context = (ContextImpl) app.getBaseContext();
        // 通过反射创建BroadcastReiver
        receiver = packageInfo.getAppFactory()
            .instantiateReceiver(cl, data.info.name, data.intent);
    } 
    
    try {
        // 实际传递的是ReceiverRestrictedContext
        receiver.onReceive(context.getReceiverRestrictedContext(),
                           data.intent);
    } 
}
```

```java
// ReceiverRestrictedContext类：

@Override
public Intent registerReceiver(BroadcastReceiver receiver, IntentFilter filter,
                               String broadcastPermission, Handler scheduler) {
    if (receiver == null) {
        return super.registerReceiver(null, filter, broadcastPermission, scheduler);
    } else {
        throw new ReceiverCallNotAllowedException(
            "BroadcastReceiver components are not allowed to register to receive intents");
    }
}

@Override
public boolean bindService(Intent service, ServiceConnection conn, int flags) {
    throw new ReceiverCallNotAllowedException(
        "BroadcastReceiver components are not allowed to bind to services");
}
```

**说明：**

BroadcastReceiver 不是 Context 的子类，它的 Context 对象是从其他地方传递来的。

ReceiverRestrictedContext 是 ContextWrapper 的子类， 重载了 registerReceiver 和 bindService 方法，因此广播的注册依赖与 Context。



## ContentProvider流程分析

**核心源码分析：**

```java
// ActivityThread类：

private ContentProviderHolder installProvider(Context context,
          ContentProviderHolder holder, ProviderInfo info,
          boolean noisy, boolean noReleaseNeeded, boolean stable) {
    ContentProvider localProvider = null;
    IContentProvider provider;
    if (holder == null || holder.provider == null) {        
        Context c = null;
        ApplicationInfo ai = info.applicationInfo;
        // 获得ContextImpl
        c = context.createPackageContext(ai.packageName,                                      									 Context.CONTEXT_INCLUDE_CODE);             
        try {
            // 通过反射创建ContentProvider
            localProvider = packageInfo.getAppFactory()
                .instantiateProvider(cl, info.name);
			// 传入Context
            localProvider.attachInfo(c, info);
        } 
    } 
    return retHolder;
}
```

```java
// ContentProvide类：

private Context mContext = null;

public void attachInfo(Context context, ProviderInfo info) {
    attachInfo(context, info, false);
}

private void attachInfo(Context context, ProviderInfo info, boolean testing) {
    if (mContext == null) {
        mContext = context;        
        ContentProvider.this.onCreate();
    }
}
```

**说明：**

ContentProvider 不是 Context 的子类，在应用启动时会自动创建 ContentProvider 并传入 Context 对象。



## Application流程分析

**核心源码分析：**

```java
// ActivityThread类：

private Application mApplication;

public Application makeApplication(boolean forceDefaultAppClass,
                                   Instrumentation instrumentation) {
    if (mApplication != null) {
        return mApplication;
    }

    Application app = null;
    
    try {
        // 创建ContextImpl实例
        ContextImpl appContext = ContextImpl.createAppContext(mActivityThread, this);
        // 通过反射创建Application，并调用attach()方法传入Context
        app = mActivityThread.mInstrumentation.newApplication(
            cl, appClass, appContext);
    } 
    mActivityThread.mAllApplications.add(app);
    // 赋值
    mApplication = app;

    if (instrumentation != null) {
        try {
            // 回调Application#onCreate()方法
            instrumentation.callApplicationOnCreate(app);
        } 
    }
    return app;
}
```

**说明：**

makeApplication() 方法主要分四步：

- 通过 createAppContext() 方法创建 ContextImpl 实例，也就是 appContext。
- 通过 newApplication() 方法反射创建 Application 实例，接着调用 Application#attach() 方法传入 Context，初始化 mBase 变量。
- 将 Application 保存为全局变量。
- 回调 Application#onCreate() 方法。

