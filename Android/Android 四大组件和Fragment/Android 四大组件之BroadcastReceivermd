[TOC]

# Android BroadcastReceiver总结

## 前言

*   BroadcastReceiver是四大组件之一，主要用于接受app发送的广播。
*   内部通信是通过Android系统的binder机制。
*   `BroadcastReceiver`运行于主线程，执行耗时操作会导致ANR。
*   广播使用场景：
    *   App全局监听，各组件间通信。
    *   监听系统广播，如开机启动、网络连接、电量变化、锁屏等。



## 广播分类

**全局广播和本地广播：**

*   全局广播：能在应用之间进行传递的广播。相比之下，本地广播的的效率更高（无需进行进程间通信），而且您无需担心其他应用在收发您的广播时带来的任何安全问题。
*   本地广播：只能够在应用程序的内部进行传递 ，并且相应广播接收器也只能接收来自应用程序发出的广播。

**无序广播和有序广播：**

*   无序广播（标准广播）是一种完全异步执行的广播。在广播发送后，所有的广播接收者几乎都会在同一时刻接收这条广播消息，它们之间没有任何先后顺序，广播效率较高。
*   有序广播：是一种同步执行的广播。在广播发送后，同一时刻只有一个广播接收者能够收到这条广播消息，当其逻辑执行完后，才会交给下一个接收者处理，通过`sendOrderedBroadcast`方法发送广播，可以调用`abortBroadcast`方法拦截广播，可通过`android:property`设置优先级。有序广播接收者之间可互传数据，可使用`setResultData`方法传递数据，使用`getStringExtra`方法接收原始数据，`getResultData`方法获取上一个广播设置的数据。

**显示广播和隐式广播：**

*   显示广播：经由setPackage()方法指定了目标程序的广播。
*   隐式广播：未指定发送给哪个应用程序的广播。注意，在Android 8.0之后的系统中，静态注册的BroadcastReceiver是无法接受除少数特殊的系统广播之外的隐式广播的。



## 广播注册方式

*   静态注册
    *   在`AndroidManifest.xml`里注册，并设置`action`。
    *   生命周期伴随App运行，一直接收广播消息。
*   动态注册
    *   在代码中设置`action`。
    *   注册后可以接收广播消息，销毁时必须取消注册，解注册后对象被回收就不再接收消息。

### 静态注册

**定义广播**

```java
public class MyReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String data = intent.getStringExtra("data");
        Toast.makeText(context, "接收数据: " + data, Toast.LENGTH_SHORT).show();
    }
}
```

**注册广播**

*   `enabled`是否启用广播。
*   `exported`是否运行本App外接收。

```xml
<receiver
          android:name=".MyReceiver"
          android:enabled="true"
          android:exported="true">
    <intent-filter>
        <action android:name="my_broadcast.myreceiver" />
    </intent-filter>
</receiver>
```

**发送广播**

```java
//发送广播
Intent intent = new Intent();
intent.putExtra("data", "这是静态注册");
intent.setAction("my_broadcast.myreceiver");
context.sendBroadcast(intent);
```

### 动态注册

**定义广播**

```java
public class MyReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String data = intent.getStringExtra("data");
        Toast.makeText(context, "接收数据: " + data, Toast.LENGTH_SHORT).show();
    }
}
```

**注册广播**

```java
receiver = new MyReceiver();
intentFilter = new IntentFilter();
intentFilter.addAction("my_broadcast.myreceiver");
registerReceiver(receiver, intentFilter);
```

**注销广播**

```java
unregisterReceiver(receiver);
```

**发送广播**

```java
Intent intent = new Intent();
intent.setAction("my_broadcast.myreceiver");
intent.putExtra("data", "hello 这是一条动态广播");
context.sendBroadcast(intent);
```

## 本地广播

*   本地广播发送的消息只能在程序内部传递，安全性强。
*   本地广播不能静态注册。
*   本广播的传递效率更高。
*   本地广播内部是通过`Handler`实现广播的发送，相比系统广播使用的`Binder`更加高效。

```java
//注册本地广播
private void regLocalReceiver() {
    mLocalBroadcastManager = LocalBroadcastManager.getInstance(context);
    IntentFilter intentFilter = new IntentFilter();
    intentFilter.addAction("my_broadcast.myreceiver");
    mLocalBroadcastManager.registerReceiver(myReceiver, intentFilter);
}
//注销本地广播
private void unregLocalReceiver() {
    context.unregisterReceiver(myReceiver);
}

//发送广播
Intent intent = new Intent("my_broadcast.myreceiver");
intent.putExtra("data", "发送本地广播");
mLocalBroadcastManager.sendBroadcast(intent);
```

## 有序广播

*   使用`sendOrderedBroadcast`方法发送广播。
*   通过`IntentFilter`的`property`属性，设置接收的优先级。
*   在`onReceiver`方法中，`isOrderedBroadcast`方法可以判断是否是有序广播，`abortBroadcast`方法中止广播传递。
*   在`onReceiver`中，可以通过`setResultData`将数据传给下一个接收者，`getResultData`获取传递的数据。