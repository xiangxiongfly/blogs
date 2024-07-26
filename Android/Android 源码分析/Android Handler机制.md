[TOC]

# Handler机制分析

## 前提

- Handler：
    -  线程间通信，负责发送和处理Message。
- Message：
    - 消息对象，负责存储数据。
- MessageQueue：
    - 消息队列，负责存放Message，按时间顺序排列的优先级队列，内部是单链表。 
- Looper：
    - 管理消息，负责从MessageQuueue中获取Message，分发给Handler处理。



## 基本使用

```java
Handler mHandler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
        //TODO 用户处理
    }
};
Message message = Message.obtain();
mHandler.sendMessage(message);
```



## 流程图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813161634706.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9201ade1900149148423609bfe12c58a.png)

- 通过 Handler 发送到消息都会调用 Handler#sendMessageAtTime() 方法，接着调用 Handler#enqueueMessage() 方法，再调用 Message#enqueueMessage() 方法将消息插入消息队列中。
- 主线程的Looper在主线程执行时被创建。Looper 会一直执行 loop() 方法，这是一个死循环，会一直调用 MessageQueue#next() 方法从消息队列中获取消息，如果消息队列没有消息了会被睡眠式阻塞，直到再次收到消息被唤醒。Looper 将获取的消息交给 Handler#dispatchMessage()，最后分发给 Handler#handleMessage() 处理。



## 源码分析

### Handler#sendMessageAtTime()

Handler中`sendMessage`/`postXXX`方法最终都会调用`Handler#sendMessageAtTime()`。

```java
// 发送消息
public boolean sendMessageAtTime(Message msg, long uptimeMillis) {
    MessageQueue queue = mQueue;
    if (queue == null) {
        RuntimeException e = new RuntimeException(
            this + " sendMessageAtTime() called with no mQueue");
        Log.w("Looper", e.getMessage(), e);
        return false;
    }
    // 交给Handler#enqueueMessage()处理
    return enqueueMessage(queue, msg, uptimeMillis);
}
```

### Handler#enqueueMessage()

```java
// 往消息队列中存放消息
private boolean enqueueMessage(MessageQueue queue, Message msg, long uptimeMillis) {
    // 绑定，Message对象持有Handler引用
    msg.target = this;
    if (mAsynchronous) {
        // 设置消息类型
        msg.setAsynchronous(true);
    }
    // 交给MessageQueue#enqueueMessage()处理
    return queue.enqueueMessage(msg, uptimeMillis);
}
```

### MessageQueue#enqueueMessage()

MessageQueue接收到消息，按时间优先级存放入消息队列里。

```java
// 往消息队列中存放消息
boolean enqueueMessage(Message msg, long when) {
    // 如果Message没有绑定Handler，直接抛出异常
    if (msg.target == null) {
        throw new IllegalArgumentException("Message must have a target.");
    }
    if (msg.isInUse()) {
        throw new IllegalStateException(msg + " This message is already in use.");
    }
    synchronized (this) {
        // 退出状态
        if (mQuitting) {
            IllegalStateException e = new IllegalStateException(
                msg.target + " sending message to a Handler on a dead thread");
            Log.w(TAG, e.getMessage(), e);
            // 消息回收
            msg.recycle();
            return false;
        }
        
        // 标记已经被使用
        msg.markInUse();
        msg.when = when;
        // mMessage是一个Message对象
        Message p = mMessages;
        boolean needWake;

        if (p == null || when == 0 || when < p.when) {
            // 如果队列中没有消息，或者该消息需要立即执行，或者该消息时间小于第一个消息，则放在该消息插入队列的头部
            msg.next = p;
            mMessages = msg;
            needWake = mBlocked;
        } else {
            needWake = mBlocked && p.target == null && msg.isAsynchronous();
            // 记录跳出循环前最后一个Message对象
            Message prev;
            // 死循环
            // 消息队列里有消息，则根据消息发送的时间插入队列中
            for (;;) {
                prev = p;
                //获取链表的下一个                
                p = p.next;
                if (p == null || when < p.when) {
                    //跳出循环
                    break;
                }
                if (needWake && p.isAsynchronous()) {
                    needWake = false;
                }
            }
            // 将消息插入合适的位置
            msg.next = p; 
            prev.next = msg;
        }

        // 是否需要唤醒操作
        if (needWake) {
            nativeWake(mPtr);
        }
    }
    return true;
}
```

### Looper#loop()

Looper的`loop()`方法一直遍历消息队列，会调用`MessageQueue#next()`获取Message对象，如果有消息就立即取出来，否则进入睡眠阻塞，获取到的消息会交给`Handler#dispatchMessage()`处理。

```java
public static void loop() {
    final Looper me = myLooper();
    // 如果当前线程的Looper为null，则抛出异常
    if (me == null) {
        throw new RuntimeException("No Looper; Looper.prepare() wasn't called on this thread.");
    }
    // ...
    for (;;) {
        if (!loopOnce(me, ident, thresholdOverride)) {
            return;
        }
    }
}
```

```java
private static boolean loopOnce(final Looper me,
                                final long ident, final int thresholdOverride) {
    // 可能阻塞，调用MessageQueue#next()
    Message msg = me.mQueue.next(); 
    // 如果消息为null，则退出死循环，表示执行()
    if (msg == null) {
        return false;
    }
    // ...  
    msg.target.dispatchMessage(msg); 
    // ...
    // 释放资源，消息回收并放入消息池
    msg.recycleUnchecked();
    return true;
}
```

### MessageQueue#next()

MessageQueue中的`next()`方法会从消息队列里获取消息

```java
// 取消息
Message next() {     
    final long ptr = mPtr;
    // ptr等于0，表示退出，调用了quit()
    if (ptr == 0) {
        return null;
    }

    int nextPollTimeoutMillis = 0;
    for (;;) {
        if (nextPollTimeoutMillis != 0) {
            Binder.flushPendingCommands();
        }

        // native层睡眠等待
        // nextPollTimeoutMillis表示等待时间，达到时间自动唤醒
        // 无消息时，则无限等待，需要nativeWake()唤醒，
        nativePollOnce(ptr, nextPollTimeoutMillis);

        synchronized (this) {
            final long now = SystemClock.uptimeMillis();
            Message prevMsg = null;
            Message msg = mMessages;
            //从消息队列中取出消息
            if (msg != null) {
                if (now < msg.when) {
                    // 计算等待时间
                    nextPollTimeoutMillis = (int) Math.min(msg.when - now, Integer.MAX_VALUE);
                } else {
                    // 取出消息
                    mBlocked = false;
                    if (prevMsg != null) {
                        prevMsg.next = msg.next;
                    } else {
                        mMessages = msg.next;
                    }
                    msg.next = null;
                    if (DEBUG) Log.v(TAG, "Returning message: " + msg);
                    msg.markInUse();
                    return msg;
                }
            } else {
                // 若消息队列中无数据，则设置为-1
                // 下次循环时，消息队列处于等待状态
                nextPollTimeoutMillis = -1;
            }

            // 退出处理
            if (mQuitting) {
                dispose();
                return null;
            }
        }
    }
}
```

### Handler#dispatchMessage()

Handler#dispatchMessage() 最终将消息分发给 Handler#handleMessage() 处理。

```java
public void dispatchMessage(@NonNull Message msg) {
    if (msg.callback != null) {
        // 交给Message的callback处理
        handleCallback(msg);
    } else {
        if (mCallback != null) {
            // 交给Handler的callback处理
            if (mCallback.handleMessage(msg)) {
                return;
            }
        }

        // 交给重写的handleMessage()处理
        handleMessage(msg);
    }
}
```

### Looper#prepare()

Looper#prepare() 负责创建 Looper 对象，并保存在 ThreadLocal 中。

```java
public static void prepare() {
    prepare(true);
}

private static void prepare(boolean quitAllowed) {
    if (sThreadLocal.get() != null) {
        throw new RuntimeException("Only one Looper may be created per thread");
    }
    sThreadLocal.set(new Looper(quitAllowed));
}
```

### Looper#quit()

Looper#quit() 表示退出循环，最终调用 MessageQueue 的一些列方法。

```java
public void quit() {
    // 调用MessageQueue#quit()
    mQueue.quit(false);
}
```

```java
// MessageQueue#quit()
void quit(boolean safe) {
    if (!mQuitAllowed) {
        throw new IllegalStateException("Main thread not allowed to quit.");
    }

    synchronized (this) {
        if (mQuitting) {
            return;
        }
        // 标记为退出
        mQuitting = true;

        // 清空所有消息
        if (safe) {
            removeAllFutureMessagesLocked();
        } else {
            removeAllMessagesLocked();
        }

        // 唤醒操作
        nativeWake(mPtr);
    }
}
```



## 常见问题

### 线程、Handler、Looper、MessageQueue 对应关系

- 一个线程可以有多个Handler：我们可以在一个线程中创建多个Handler对象。

- 一个线程对应一个Looper：在主线程执行时，会调用`Looper.prepareMainLooper()`会创建主线程的Looper，通过ThreadLocal保持和获取Looper对象。

- Looper内部维护一个MessageQueue：创建Looper时会创建MessageQueue。

- 一个Handler对应一个Looper：Handler创建时会调用`Looper#myLooper()`获取Looper对象。


### Handler内存泄漏问题

内存泄露原因：内部类的Handler会持有外部类的引用，Message持有Handler对象的引用，MessageQueue持有Message对象的饮用，如果Message没有及时处理，会导致外部类不能回收，造成内存泄漏。

解决办法：

- 及时清理消息队列中的垃圾消息
- 内部类使用static和WeakReference

[ Handler内存泄漏解决方案](https://blog.csdn.net/qq_14876133/article/details/81840492)

### 子线程中使用Handler

在子线程中使用Handler，会抛出异常`java.lang.RuntimeException: Can't create handler inside thread Thread[Thread-2,5,main] that has not called Looper.prepare()`。

这是因为子线程没有Looper，必须先执行`Looper.prepare()`创建Looper对象，然后再执行`Looper.loop()`开启遍历消息队列。

[HandlerThread](https://blog.csdn.net/qq_14876133/article/details/105098994)

```java
static class MyHandlerThread extends Thread {
    private Handler mHandler;
    private Looper mLooper;

    Handler getHandler() {
        return mHandler;
    }

    Looper getLooper() {
        return mLooper;
    }

    @Override
    public void run() {
        Log.e("TAG", "开启子线程");
        super.run();
        Looper.prepare();
        mLooper = Looper.myLooper();
        mHandler = new Handler() {
            @Override
            public void handleMessage(@NonNull Message msg) {
                Log.e("TAG", "子线程接收消息：" + msg);
            }
        };
        Looper.loop();
        Log.e("TAG", "退出");
    }
}
```

### Message创建方式

推荐使用`Message.obtain()`创建Message对象，该方法从消息池里获取数据，性能较高。

### Handler如何保障线程安全

MessageQueue消息队列在存数据和取数据都是用synchronized加锁。

```java
boolean enqueueMessage(Message msg, long when) {  
    synchronized (this) {         
        // ...
    }
    return true;
}
```

```java
Message next() { 
    for (;;) { 
        nativePollOnce(ptr, nextPollTimeoutMillis);
        synchronized (this) {
            // ...    
        }
    }
}
```

### Looper死循环为什么不会导致ANR

ANR指应用无响应，在一段时间内无法处理任务，如：键盘输入、触摸屏幕5s内没有响应，广播10s内没有执行完。

Looper死循环不会导致应用卡死，在没有消息时会阻塞线程并进入休眠释放CPU资源，当有消息时会被立即唤醒。

