[TOC]

# Android 理解Context

## Context是什么

Context可以理解为“上下文”或”环境“，它提供了**访问系统服务及系统资源的功能**，Context 参与加载资源、启动Activity、启动Service、获取系统服务/应用资源、创建View、数据库等操作。

通俗来讲：一个Android应用程序可以理解为一个部电影，Activity、Service、BroadcastReceiver、ContentProvider四大组件可以理解为电影中的四个主演。他们是由剧组（Android系统）一开始就制定好的，整部戏都是围绕这四位主演的，所以这四位主演不能随便在街上拉个人（new一个对象）就能演的，有了演员就需要摄像机拍摄，他们通过镜头（Context）将戏传递给观众，也就是说四大组件必须要在Context环境下运行，而其他的如Button、TextView、LinearLayout这些控件可以理解为配角，没有那么重要（可以new一个对象），

### Activity能直接new吗？

不能，Android的应用模型是基于组件的应用设计模式，组件的运行必须要一个完整的Android工程环境，只有在这个环境下，Activity、Service等系统组件才能正常运行。



## Context结构和源码

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/97d83854abb04e8c9a3dda61f79e2a65.png)

**Context源码：**

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

Context是一个抽象类，提供了关于应用环境全局信息的信息，Android提供该抽象类的具体实现类，可以通过它获取应用程序的资源和启动Activity、发送广播等。

Context有两个实现子类：ContextImpl类和ContextWrapper类。

ContextWrapper类，如其名所言，是一个包装类，内部必须包含一个真正的Context引用，调用ContextWrapper的方法都会被指向真正的Context对。

ContextThemeWrapper类，如起名所言，内部包含了与Theme（主题）相关的信息，这里的Theme就是定义在Androidmanifest.xml中主题，只有Activity才能定义主题，Servier是不需要主题的，所以Service直接继承自ContextWrapper，Application也同理。

ContextImpl类是真正实现了Context中的所有方法，应用程序中所调用的各种Context类方法都来自该类。

总的来讲：Context是一个抽象类，有两个子类，ContextImpl是具体实现类，ContextWrapper是包装类，Activity、Service、Application虽然都继承自ContextWrapper，但是在初始化是都会创建ContextImpl对象，有ContextImpl实现Context中的方法。



## 一个程序有几个Context

Context数量 = Activity数量 + Service数量 + 1

这里的 1 代表Application。

为什么没有BroadcastReceiver和ContentProvider，这是因为它们都不是Context的子类，所持有的Context对象是从其他地方传过来的。



## Context的作用

弹出Toast、启动Activity、启动Service、发送广播、操作数据库等。



## Context作用域

| Context作用域               | Application | Activity | Service |
| --------------------------- | ----------- | -------- | ------- |
| Show a Dialog               | No          | Yes      | No      |
| Start an Activity           | 不推荐      | Yes      | 不推荐  |
| Layout Inflation            | 不推荐      | Yes      | 不推荐  |
| Start a Service             | Yes         | Yes      | Yes     |
| Send a Broadcast            | Yes         | Yes      | Yes     |
| Register Broadcast Receiver | Yes         | Yes      | Yes     |
| Load Resource Values        | Yes         | Yes      | Yes     |

启动Activity、弹出Dialog，必须使用Activity类型的Context。这是因为Android系统出于安全考虑，不允许Activity或Dialog凭空出现，一个Activity的启动必须建立在另一个Activity的基础上，也就是Activity任务栈。

启动Activity也可以使用Application的Context，但是需要将启动模式改为singleTask。

加载布局推荐使用Activity的Context，Application和Service当然也是合法的，但是会使用系统默认的主题样式。

总而言之，Activity的Context作用域最广，这是因为Activity继承自ContextThemeWrapper，ContextThemeWrapper在ContextWrapper的基础上做了一些扩展，而Appliaction和Service继承自ContextWrapper。凡是和UI相关的都应该使用Activity的Context。



## 获取Context

获取Context对象的四种方法：

View#getContext()：通过View获取Context对象，也就是Activity对象。

Activity#getApplicationContext()：获取Application的Context。

ContextWrapper#getBaseContext()：获取ContextWrapper进行装饰前的Context。

Activity#this：获取Activity对象。



## getApplication()和getApplicationContext()区别

其实都是同一个对象，但是作用域不同。

getApplication()表示获取一个Application，而Application本身就是一个Context，可以在Activity、Service中使用

getApplicationContext()表示获取一个Application的Context，可以在BroadcastReceiver中使用

比如可以通过BroadcastReiver中的Context获取Application对象。

```java
public class MyReceiver extends BroadcastReceiver{

    @Override
    publicvoidonReceive(Contextcontext,Intentintent){
        Application myApp = (Application)context.getApplicationContext();
    }
}
```



## Context引起的内存泄露

### 错误的单例模式

```java
public class Singleton {
    private static Singleton instance;
    private Context mContext;

    private Singleton(Context context) {
        this.mContext = context;
    }

    public static Singleton getInstance(Context context) {
        if (instance == null) {
            instance = new Singleton(context);
        }
        return instance;
    }
}
```

这个单例模式，instance作为静态变量，生命周期长于普通对象，如果使用Activity的Context，会导致Activity一直被持有，即使Activity被销毁了，这样会导致内存泄露。

### View持有Activity应用

```java
public class MainActivity extends Activity {
    private static Drawable mDrawable;

    @Override
    protected void onCreate(Bundle saveInstanceState) {
        super.onCreate(saveInstanceState);
        setContentView(R.layout.activity_main);
        ImageView iv = new ImageView(this);
        mDrawable = getResources().getDrawable(R.drawable.ic_launcher);
        iv.setImageDrawable(mDrawable);
    }
}
```

mDrawable对象是一个静态变量会常驻内存，持有Activity的Context，即使Activity被销毁了也不会被回收，因此造成内存泄露。

### 正确使用Context

- 生命周期长的对象，优先使用Application的Context。
- UI相关的场景，推荐使用Activity的Context。
- 尽量不要在Activity中使用非静态内部类，因为非静态内部类会隐式持有外部类实例的引用；如果需要使用静态内部类，应该将外部实例使用作为弱引用持有。

