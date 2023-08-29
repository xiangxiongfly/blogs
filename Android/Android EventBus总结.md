[toc]

# Android EventBus总结

## 概述

EventBus是一种用于Android的事件发布-订阅总线，用于简化各模块之间的通信。

[Github地址：https://github.com/greenrobot/EventBus](https://github.com/greenrobot/EventBus)



**引入依赖**

```groovy
 implementation 'org.greenrobot:eventbus:3.2.0'
```



## 事件流程

![](https://img-blog.csdnimg.cn/20200525135210849.png)

### 三个角色

| 角色       | 说明                 |
| ---------- | -------------------- |
| Event      | 事件，可以是任意类型 |
| Subscriber | 事件订阅者           |
| Publisher  | 事件发布者           |

### 四种线程模型

| 线程模型                | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| ThreadMode.POSTING      | 默认值。在哪个线程发送事件就在哪个线程接收，避免了线程切换，效率高。 |
| ThreadMode.MAIN         | 在主线程接收事件。如果主线程发送事件，则在主线程中接收事件；如果子线程中发送事件，则先将事件加入主线程队列，再通过Handler切换到主线程，依次处理事件。 |
| ThreadMode.MAIN_ORDERED | 在主线程接收事件。无论从哪个线程发送事件，都先加入队列，再通过Handler切换到主线程，依次处理事件。 |
| ThreadMode.BACKGROUND   | 在子线程接收事件。如果在主线程发送事件，则先将事件加入队列，再通过线程池处理事件；如果在子线程发送事件，则直接在子线程中处理事件； |
| ThreadMode.ASYNC        | 在子线程接收事件。无论从哪个线程发送事件，都先加入队列，再通过线程池处理事件。 |



## 使用

### 普通事件

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    EventBus.getDefault().register(this);
}

@Subscribe(threadMode = ThreadMode.MAIN)
public void onEvent(MessageEvent<String> event) {
    if (event.getCode() == 100) {
        tv_msg.setText(event.getData());
    }
}

@Override
protected void onDestroy() {
    super.onDestroy();
    EventBus.getDefault().unregister(this);
}
```

```java
EventBus.getDefault().post(new MessageEvent<String>(100, "hello 这是一条普通事件"));
```

### 粘性事件

普通事件需要 EventBus 先注册才能接收事件，但是粘性事件特殊，可以先发送事件后再注册。（一注册就立马接收）。

```java
@Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
public void onGetStickyEvent(MessageEvent<String> event) {
    tv_msg.setText(event.getData());
}
```

```java
EventBus.getDefault().postSticky(new MessageEvent<String>(200, "这是一条粘性事件"));
```



### 验证：粘性事件订阅者收到普通事件

如果先注册粘性事件订阅者，再发送普通事件，是可以收到普通事件的。

```java
public class OneActivity extends AppCompatActivity {
    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_one);
        textView = findViewById(R.id.textView);
        EventBus.getDefault().register(this);
    }

    public void sendMessage(View v) {
        EventBus.getDefault().post(new MessageEvent(1, "普通消息"));
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onReceiveEvent(MessageEvent<String> event) {
        if (event.code == 1) {
            textView.setText(event.data);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }
}
```



### 验证：普通事件订阅者收到粘性消息

如果先注册普通事件订阅者，再发送粘性事件，则是可以收到粘性事件的。

```java
public class OneActivity extends AppCompatActivity {
    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_one);
        textView = findViewById(R.id.textView);
        EventBus.getDefault().register(this);
    }

    public void sendStickyMessage(View v) {
        EventBus.getDefault().postSticky(new MessageEvent(1, "粘性消息"));
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = false)
    public void onReceiveEvent(MessageEvent<String> event) {
        if (event.code == 1) {
            textView.setText(event.data);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }
}
```



## 优雅封装

EventBusUtils类：

```java
public class EventBusUtils {
    /**
     * 注册
     */
    public static void register(Object subscriber) {
        EventBus.getDefault().register(subscriber);
    }

    /**
     * 取消注册
     */
    public static void unregister(Object subscriber) {
        EventBus.getDefault().unregister(subscriber);
    }

    /**
     * 发送普通消息
     */
    public static void post(MessageEvent event) {
        EventBus.getDefault().post(event);
    }

    /**
     * 发送粘性消息
     */
    public static void postSticky(MessageEvent event) {
        EventBus.getDefault().postSticky(event);
    }
}
```

BindEventBus注解：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface BindEventBus {
}
```

MessageEvent事件类：

```java
public class MessageEvent<T> {
    public int code;
    public T data;

    public MessageEvent(int code) {
        this.code = code;
    }

    public MessageEvent(int code, T data) {
        this.code = code;
        this.data = data;
    }
}
```

MessageEventCode标记类：

```java
public class MessageEventCode {
    public static int CREATE = 0x1111;
    public static int DELETE = 0x1112;
    public static int UPDATE = 0x1113;
    public static int READ = 0x1114;
}
```

BaseActivity：

```java
public abstract class BaseActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutId());
        initViews();
        initData();
        if (isRegisterEventBus()) {
            EventBusUtils.register(this);
        }
    }

    @LayoutRes
    protected abstract int getLayoutId();

    protected void initViews() {
    }

    protected void initData() {
    }

    protected boolean isRegisterEventBus() {
        return this.getClass().isAnnotationPresent(BindEventBus.class);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isRegisterEventBus()) {
            EventBusUtils.unregister(this);
        }
    }
}
```

发送消息：

```java
EventBusUtils.post(new MessageEvent(MessageEventCode.UPDATE, "普通消息"));
```

订阅消息：

```java
@BindEventBus
public class OneActivity extends BaseActivity {
    private TextView textView;

    @Override
    protected int getLayoutId() {
        return R.layout.activity_one;
    }

    @Override
    protected void initViews() {
        textView = findViewById(R.id.textView);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onReceiveEvent(MessageEvent<String> event) {
        if (event.code == MessageEventCode.UPDATE) {
            textView.setText(event.data);
        }
    }
}
```

