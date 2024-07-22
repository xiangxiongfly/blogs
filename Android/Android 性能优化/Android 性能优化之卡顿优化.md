[toc]

# Android 性能优化之卡顿优化

## 卡顿检测

- TraceView
- StricktModel
- BlockCanary

### TraceView

#### 配置

```
Debug.startMethodTracing("myTrace");
Debug.stopMethodTracing();
```

生成的 trace 文件保存在：`/storage/self/primary/Android/data/<包名>/files/myTrace.trace`

#### 缺点

- 运行时开销大，整体变慢。
- 容易带偏优化方向。

### StricktMode

StricktMode 严苛模式，是 Android 提供的一种运行时检测机制。

**策略：**

- 线程策略：
  - 自定义耗时调用：detectCustomSlowCalls
  - 磁盘读取操作：detectDiskReads
  - 网络操作：detectNetwork
- 虚拟机策略：
  - Activity泄露：detectActivityLeaks()
  - Sqlite对象泄露：detectLeakedSqlLiteObjects
  - 检测实例数量：setClassInstanceLimit()

在 LogCat 中过滤 "StrictMode" 即可查看日志信息。

#### 配置

```java
public class BaseApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        initStrictMode();
    }

    private void initStrictMode() {
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                    .detectCustomSlowCalls() //API等级11，使用StrictMode.noteSlowCode
                    .detectDiskReads()
                    .detectDiskWrites()
                    .detectNetwork()// or .detectAll() for all detectable problems
                    .penaltyLog() //在Logcat 中打印违规异常信息
                    .build());
            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                    .detectActivityLeaks()
                    .detectLeakedSqlLiteObjects()
//                    .setClassInstanceLimit(Person.class, 1)
                    .detectLeakedClosableObjects() //API等级11
                    .penaltyLog()
                    .build());
        }
    }
}
```

#### 违规代码

**主线操作IO问题：**

```java
File externalStorage = getFilesDir();
File destFile = new File(externalStorage, "hello.txt");
try {
    OutputStream output = new FileOutputStream(destFile, true);
    output.write("I am testing io".getBytes());
    output.flush();
    output.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

**日志：**

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/78fd31c8a61c44c09886353f2f4597d5.png)

可以看到违规的原因和位置。

**Activity内存泄露问题：**

```java
BaseApp.addActivity(this);
```

**日志：**

```
2024-07-15 17:50:48.075 19900-19900/com.example.anr D/StrictMode: StrictMode policy violation: android.os.strictmode.InstanceCountViolation: class com.example.anr.StuckActivity; instances=12; limit=2
        at android.os.StrictMode.setClassInstanceLimit(StrictMode.java:1)
```

多次进出后输出日志，存在12个实例。

### BlockCanary

BlockCanary 是一个用于 Android 应用开发者的性能分析工具，它可以帮助开发者发现和解决应用中的卡顿问题。BlockCanary 通过在应用中植入检测逻辑，监控应用运行时的线程状态，并在检测到卡顿发生时记录相关信息。它的主要目的是帮助开发者追踪和分析应用中可能导致卡顿的代码段或操作。

#### 配置

**添加依赖库：**

```
implementation 'com.github.markzhai:blockcanary-android:1.5.0'
```

**配置：**

```java
public class BaseApplication extends Application {
    @Override
    public void onCreate() {
        BlockCanary.install(this, new AppBlockCanaryContext()).start();
    }
}
```

#### 问题代码

依次执行问题代码：

```java
private void testSleep() {
    Log.e("TAG", "sleep前");
    try {
        Thread.sleep(2000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    Log.e("TAG", "sleep后");
}
```

```java
private void testMath() {
    Log.e("TAG", "math前");
    long start = System.currentTimeMillis();
    double result = 0;
    for (int i = 0; i < 10000000; i++) {
        result += Math.acos(Math.cos(i));
        result -= Math.asin(Math.sin(i));
        result += Math.acos(Math.cos(i));
        result -= Math.asin(Math.sin(i));
    }
    Log.e("TAG", "math" + result);
    Log.e("TAG", "耗时 " + (System.currentTimeMillis() - start));
}
```

BlockCanary 依次生成2个信息：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a5c39ae2ac9d40ea8ddf8950b3cabc3d.png)

点击第一个进去可以看到，阻塞时间和阻塞代码：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/29c11c48fb104ede9f0de309d8d4f255.png)

点击第二个进去同样也能看到相关信息：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a34a5f7194bb4847b8039c95f076b979.png)

#### 缺点

- BlockCanary 需要在应用中植入检测逻辑，这会带来一定的性能开销。
- 卡顿堆栈可能不准确。



## ANR

ANR（Application Not Responding）是指应用程序未响应，Android 系统对于一些事件需要在一定时间范围内完成，如果超过预定时间未能得到有效响应或者响应时间过长，都会造成 ANR。

### ANR原因

- 数据导致的 ANR：频繁 GC 导致线程暂停，处理事件时间被拉长。
- 线程阻塞或死锁导致的 ANR。
- Binder 导致的 ANR：Binder 通信数据量过大。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6eb70e32a49843548441de83b1bf04c0.png)



### ANRWatchDog监测

ANRWatchDog是一个用于监测Android应用程序中的ANR（应用程序无响应）的开源库。

**添加依赖库：**

```
implementation 'com.github.anrwatchdog:anrwatchdog:1.4.0'
```

**配置：**

```java
public class BaseApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate(); 
        new ANRWatchDog().start(); // 默认5000毫秒
    }
}
```

**问题代码一：**

```java
public void onClick1(View view) {
    try {
        Thread.sleep(20000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}
```

ANRWatchDog警告：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/686a31126fff4478920f44479647bdba.png)

**问题代码二：**

```java
public void onClick2(View view) {
    SharedPreferences sp = getSharedPreferences("app", Context.MODE_PRIVATE);
    for (int i = 0; i < 100000; i++) {
        SharedPreferences.Editor edit = sp.edit();
        for (int j = 0; j < 100000; j++) {
            edit.putString("name", "aaaaa")
                    .putInt("age", 18)
                    .putBoolean("sex", true)
                    .commit();
        }
    }
}
```

ANRWatchDog警告：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c802354407df4c26ba81226c6a810390.png)

### 解决方案

- **将所有耗时操作如访问网络、socket 通信、查询大量 SQL 语句、复杂逻辑计算等都放在子线程中，然后通过 handler.sendMessage、runOnUIThread 等方式更新 UI**。无论如何都要确保用户界面的流畅度，如果耗时操作需要让用户等待，可以在界面上显示进度条
- **将 IO 操作放在异步线程**。在一些同步的操作主线程有可能被锁，需要等待其他线程释放响应锁才能继续执行，这样会有一定的 ANR 风险，对于这种情况有时也可以用异步线程来执行相应的逻辑，另外，**要避免死锁的发生**
- **使用 Thread 或 HandlerThread 时，调用 Process.setThreadPriority（Process.THREAD_PRIORITY_BACKGROUND）设置优先级，否则仍然会降低程序响应，因为默认 Thread 优先级和主线程相同**
- **使用 Handler 处理工作线程结果，而不是使用 Thread.wait() 或 Thread.sleep() 来阻塞主线程**
- **Activity 的 onCreate() 和 onResume() 回调中避免耗时代码**
- **BroadcastReceiver 中 onReceive() 代码也要尽量减少耗时，建议使用 IntentService 处理**
- **各个组件的生命周期函数都不应该有太耗时的操作**，即使对于后台 Service 或 ContentProvider 来讲，虽然应用在后台运行时生命周期函数不会有用户输入引起无响应的 ANR，但其执行时间过长也会引起 Service 或 ContentProvider 的 ANR

 