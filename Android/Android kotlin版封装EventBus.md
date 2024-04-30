[TOC]

# Android Kotlin版封装EventBus

## 代码封装

### 添加依赖库

```
implementation("org.greenrobot:eventbus:3.3.1")
```

### 定义消息类

```kotlin
class MessageEvent<T> {
    var code: Int
    var data: T? = null

    constructor(code: Int) {
        this.code = code
    }

    constructor(code: Int, data: T) {
        this.code = code
        this.data = data
    }
}
```

### 定义常量值

```kotlin
object MessageEventCode {
    const val REFRESH = 0xB001 //刷新
    const val DELETE = 0xB002 //删除
    const val ADD = 0xB003 //增加
}
```

### 定义注解

```kotlin
@Target(AnnotationTarget.TYPE, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class BindEventBus
```

### 定义工具类

```kotlin
object EventBusUtils {
    /**
     * 注册
     */
    fun register(subscriber: Any) {
        EventBus.getDefault().register(subscriber)
    }

    /**
     * 取消注册
     */
    fun unregister(subscriber: Any) {
        EventBus.getDefault().unregister(subscriber)
    }

    /**
     * 发送普通事件
     */
    fun post(event: MessageEvent<*>) {
        EventBus.getDefault().post(event)
    }

    /**
     * 发送粘性事件
     */
    fun postSticky(event: MessageEvent<*>) {
        EventBus.getDefault().postSticky(event)
    }

    /**
     * 判断是否注册Eventbus
     */
    fun isRegister(clz: Any): Boolean {
        return clz.javaClass.isAnnotationPresent(BindEventBus::class.java)
    }
}
```



## 使用

### 在Activity中

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_event_bus)
    if (EventBusUtils.isRegister(this)) {
        EventBusUtils.register(this)
    }
}

@Subscribe(threadMode = ThreadMode.MAIN)
fun onMessageEvent(event: MessageEvent<*>) {
    when (event.code) {
        MessageEventCode.REFRESH -> {
            tvMessage.text = "刷新数据"
        }
        MessageEventCode.DELETE -> {
            tvMessage.text = "删除数据"
        }
        MessageEventCode.ADD -> {
            tvMessage.text = "添加数据：${event.data}"
        }
    }
}

override fun onDestroy() {
    super.onDestroy()
    if (EventBusUtils.isRegister(this)) {
        EventBusUtils.unregister(this)
    }
}
```

### 在Fragment中

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    if (EventBusUtils.isRegister(this)) {
        EventBusUtils.register(this)
    }
}

@Subscribe(threadMode = ThreadMode.MAIN)
fun onMessageEvent(event: MessageEvent<*>) {
    when (event.code) {
        MessageEventCode.REFRESH -> {
            tvMessage.text = "刷新数据"
        }
        MessageEventCode.DELETE -> {
            tvMessage.text = "删除数据"
        }
        MessageEventCode.ADD -> {
            tvMessage.text = "添加数据：${event.data}"
        }
    }
}

override fun onDestroyView() {
    super.onDestroyView()
    if (EventBusUtils.isRegister(this)) {
        EventBusUtils.unregister(this)
    }
}
```

### 发送事件

```kotlin
EventBusUtils.post(MessageEvent<Nothing>(MessageEventCode.REFRESH))
```

```kotlin
EventBusUtils.post(MessageEvent<Nothing>(MessageEventCode.DELETE))
```

```kotlin
EventBusUtils.post(MessageEvent(MessageEventCode.ADD, "hello world"))
```



## [源码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/module/tools/src/main/java/com/example/tools/eventbus)

