[TOC]

# Android 四大组件之Service

## 概述

- Service 是 Android 中实现程序后台运行的解决方案，适合去执行不需要和用户交互而且长期运行的任务。
- Service 是运行在主线程中的，不能执行耗时操作。

**Service与Thread区别：**

- Service：Service是四大组件之一，运行在主线程中，因此Service不能做耗时操作，当一定要在Service里进行耗时操作需开启线程。服务通常用于后台播放音乐、消息接收等。
- Thread：线程通常用于网络请求、文件读写等耗时操作。

**隐式启动问题：**

- Android 5 以后使用隐式启动会抛出 SecurityException 异常。
- 解决：使用 setPackage() 添加应用包名。



## 生命周期

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d03354234f6641c08bac5e51ed9998c5.png)

- onCreate()：创建服务时调用，只会调用一次。
- onStartCommand()：每次执行 startService() 时都会调用一次。
- onBind()：调用 bindService() 时会被调用，通常只会调用一次。
- onUnbind()：调用 unbindService() 时会被调用。
- onDestroy()：服务销毁时调用。




## 开启Service的两种方式

#### startService

- 调用 startService() 开启服务。
- 调用 stopService() 立即停止服务。
- 调用 stopSelf() 停止当前服务。 只是请求系统停止服务，系统可能不会立即停止服务，而是等待当前正在进行的操作完成后再停止服务。如果你的服务正在执行耗时的操作，可能需要等待一段时间才能停止服务。
- 该启动方式，Activity销毁，Service不会停止。

```java
public class MyService extends Service {
    public MyService() {
    }

    //创建时调用
    @Override
    public void onCreate() {
        super.onCreate();
        Log.e("TAG", "onCreate()");
    }

    //每次服务启动时调用
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.e("TAG", "onStartCommand()");
        return super.onStartCommand(intent, flags, startId);
    }

    //服务销毁时调用
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.e("TAG", "onDestroy()");
    }
}
```

```java
//开启服务
Intent startIntent = new Intent(this, MyService.class);
startService(startIntent);

//停止服务
Intent stopService = new Intent(this, MyService.class);
stopService(stopService);
```

#### bindService

- 使用 bindService() 绑定服务。
- 使用 unbindService() 解绑服务。
- 可以从 onBind() 获取 Binder 实例，通过 Binder 对象访问 Service。
- 该启动方式依赖 Activity，当 Activity 销毁时，Service也会停止。

```java
public class MyService extends Service {
    public MyService() {
    }

    //创建时调用
    @Override
    public void onCreate() {
        super.onCreate();
        Log.e("TAG", "onCreate()");
    }

    //每次服务启动时调用
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.e("TAG", "onStartCommand()");
        return super.onStartCommand(intent, flags, startId);
    }

    private MyBinder mBinder = new MyBinder();

    @Override
    public IBinder onBind(Intent intent) {
        Log.e("TAG", "onBind()");
        return mBinder;
    }

    class MyBinder extends Binder {
        public void startDownload() {
            Log.e("TAG", "开始下载");
        }
    }

    //服务销毁时调用
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.e("TAG", "onDestroy()");
    }
}
```

```java
private MyService.MyBinder downloadBinder;

private ServiceConnection connection = new ServiceConnection() {

    //服务绑定成功调用
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        Log.e("TAG","onServiceConnected()");
        downloadBinder = (MyService.MyBinder) service;
        downloadBinder.startDownload();
    }

    //服务解除绑定调用
    @Override
    public void onServiceDisconnected(ComponentName name) {
        Log.e("TAG","onServiceDisconnected()");
    }
};

//绑定服务
Intent bindIntent = new Intent(this, MyService.class);
bindService(bindIntent, connection, BIND_AUTO_CREATE);

//解绑服务
unbindService(connection);
```

#### startService+bindService

混合使用是用于Activity中操作Service，但Service不依赖于Activity的生命周期。

```java
//开启服务
Intent intent = new Intent(this, MyService.class);
startService(intent);
bindService(intent, connection, BIND_AUTO_CREATE);

//停止服务
stopService(intent);
unbindService(connection);
```



## IntentService

- IntentService 是 Service 的子类。
- 会创建独立的工作线程处理 onHandleIntent() ，不需要处理多线程问题。
- 当请求处理完成后，IntentService 会自动停止，不需要调用 stopSelf() 方法停止服务。

```java
public class MyIntentService extends IntentService {

    public MyIntentService() {
        super("MyIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.e("TAg", "onHandleIntent()");
        Log.e("TAG", "子线程；" + Thread.currentThread().getName());
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.e("TAg", "onDestroy()");
    }
}
```

```java
Intent intentService = new Intent(this, MyIntentService.class);
startService(intentService);
```



## 服务类型

- 前台服务：前台服务执行一些用户能够注意到的操作。例如，音频应用会使用前台服务来播放音轨。前台服务必须显示 [Notification](https://developer.android.google.cn/develop/ui/views/notifications?hl=zh-cn)。即使用户没有与应用互动，前台服务也会继续运行。使用前台服务时，您必须显示通知，让用户知道该服务正在运行。除非服务停止或从前台移除，否则无法关闭此通知。
- 后台服务：后台服务执行用户不会直接注意到的操作。例如，如果应用使用某项服务来压缩其存储空间，则该服务通常是后台服务。
- 绑定服务：绑定服务提供了一个客户端-服务器接口，该接口允许组件与服务交互、发送请求、接收结果，甚至可以通过进程间通信 (IPC) 跨进程执行这些操作。仅当与另一个应用组件绑定时，绑定服务才会运行。多个组件可以同时绑定到该服务，但全部取消绑定后，该服务即会被销毁。



## 前台服务

- 前台服务具有较高的优先级，这意味着即使在系统内存紧张的情况下，前台服务也不太可能被系统终止。这有助于保证重要任务的持续运行。
- 用法：
  - startForeground()：标记服务为前台服务。
  - stopForeground()：关闭前台服务，不会结束服务。
- Android 8 以后需要用 startForegroundService() 启动前台服务。
- Android 9 以后需要在 AndroidManifest.xml 文件中声明 `android.permission.FOREGROUND_SERVICE` 权限。
- Android 12 以后禁止后台程序使用 startForegroundService()，后台程序启动前台服务会抛出 ForegroundServiceStartNotAllowedException 异常，推荐使用 WorkManager。
- Android 8 以后禁止后台程序启动后台服务，表示后台程序启动后台服务，推荐使用 JobScheduler 处理后台任务。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.example.myapplication">

    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application>
        <service
                 android:name=".MyForegroundService"
                 android:enabled="true"
                 android:exported="true" /> 
    </application>

</manifest>
```

```java
public class MyForegroundService extends Service {
    public MyForegroundService() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground();
    }

    private void startForeground() {
        Notification notification = createNotification("serviceId", "serviceName");
        startForeground(1, notification);
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    try {
                        Thread.sleep(500L);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    private Notification createNotification(String channelId, CharSequence channelName) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(channelId, channelName);
        }
        return new NotificationCompat.Builder(this, channelId)
            .setOngoing(true)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(Notification.CATEGORY_SERVICE)
            .setContentTitle("标题")
            .setContentText("内容")
            .build();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel(String channelId, CharSequence channelName) {
        NotificationChannel channel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_NONE);
        channel.setLightColor(Color.BLUE);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        manager.createNotificationChannel(channel);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopForeground(true);
    }
}
```

```java
// 开始前台服务
Intent intent = new Intent(context, MyForegroundService.class);
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            startForegroundService(intent);
//        } else {
//            startActivity(intent);
//        }
// 或者
ContextCompat.startForegroundService(context, intent);
```

```java
// 停止服务
stopService(intent);
```

