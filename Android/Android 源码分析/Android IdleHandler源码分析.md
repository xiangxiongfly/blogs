[toc]

# Android IdleHandler源码分析

## 概述

`IdleHandler`是一个接口，它定义在`MessageQueue`类中，用于在主线程的消息队列空闲时执行一些轻量级的任务。`IdleHandler`接口有一个方法`queueIdle()`，其返回值决定了`IdleHandler`的后续行为。



## 前提

- ThreadLocal：线程内的局部变量，存储Looper对象。
- Looper：处理消息，存储MessageQueue对象。
- MessageQueue：消息队列，内部维护 `Message mMessages` 和 ` ArrayList<IdleHandler> mIdleHandlers`。
  - mMessages：通过 Handler 发送的消息。
  - mIdleHandlers：列表，存储 IdleHandler 任务。



## 基本用法

```java
MessageQueue.IdleHandler mIdleHandler = new MessageQueue.IdleHandler() {
    @Override
    public boolean queueIdle() {
        // TODO
        return false;
    }
};
```

返回值：

- false：只执行一次。
- true：主线程空闲时会继续执行。



## 源码分析

### 添加和删除任务

```java
// MessageQueue类
public void addIdleHandler(@NonNull IdleHandler handler) {
    if (handler == null) {
        throw new NullPointerException("Can't add a null IdleHandler");
    }
    synchronized (this) {
        mIdleHandlers.add(handler);
    }
}

public void removeIdleHandler(@NonNull IdleHandler handler) {
    synchronized (this) {
        mIdleHandlers.remove(handler);
    }
}
```

### 执行任务

最终会调用 MessageQueue#next() 方法。

```java
Message next() { 

    int pendingIdleHandlerCount = -1;
    // nextPoll超时时间
    // 如果为-1，表示阻塞等待唤醒
    // 如果为0，则表示不阻塞
    // 如果为>0，则表示超时唤醒
    int nextPollTimeoutMillis = 0;
    for (;;) {
        if (nextPollTimeoutMillis != 0) {
            Binder.flushPendingCommands();
        }

        // 是否休眠阻塞
        nativePollOnce(ptr, nextPollTimeoutMillis);

        synchronized (this) {
            final long now = SystemClock.uptimeMillis();
            Message prevMsg = null;
            Message msg = mMessages;
            if (msg != null && msg.target == null) {
                do {
                    prevMsg = msg;
                    msg = msg.next;
                } while (msg != null && !msg.isAsynchronous());
            }
            if (msg != null) {
                // 表示MessageQueue有消息
                if (now < msg.when) {
                    // 就算休眠时间
                    nextPollTimeoutMillis = (int) Math.min(msg.when - now, Integer.MAX_VALUE);
                } else {
                    // Got a message.
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
                // 表示MessageQueue无消息，nextPollTimeoutMillis设置为-1，nativePollOnce无限等待，直到有消息
                nextPollTimeoutMillis = -1;
            }

            // 消息队列里的消息已经执行完了，处于空闲状态
            if (mQuitting) {
                dispose();
                return null;
            }

            // 获取IdleHandler任务数量
            if (pendingIdleHandlerCount < 0
                && (mMessages == null || now < mMessages.when)) {
                pendingIdleHandlerCount = mIdleHandlers.size();
            }
            // 如果为空，则不执行进入下一个循环
            if (pendingIdleHandlerCount <= 0) {
                mBlocked = true;
                continue;
            }

            // 拷贝操作
            if (mPendingIdleHandlers == null) {
                mPendingIdleHandlers = new IdleHandler[Math.max(pendingIdleHandlerCount, 4)];
            }
            mPendingIdleHandlers = mIdleHandlers.toArray(mPendingIdleHandlers);
        }

        // 遍历IdleHandler数组
        for (int i = 0; i < pendingIdleHandlerCount; i++) {
            final IdleHandler idler = mPendingIdleHandlers[i];
            mPendingIdleHandlers[i] = null; // 置空

            boolean keep = false;
            try {
                // 执行IdleHanlder任务，调用queueIdle()方法，并获取返回值
                keep = idler.queueIdle();
            } catch (Throwable t) {
                Log.wtf(TAG, "IdleHandler threw exception", t);
            }

            // 如果返回值为false，则从IdleHandlers列表中删除
            if (!keep) {
                synchronized (this) {
                    mIdleHandlers.remove(idler);
                }
            }
        }

        // 置空
        pendingIdleHandlerCount = 0;

        // 设置为0
        nextPollTimeoutMillis = 0;
    }
}
```

**流程说明：**

- 如果本次循环获取的 Message 为空或是一个延迟消息，则表明当前队列为空闲状态。
- 遍历mIdleHandlers列表，调用queueIdle()方法。
- queueIdle()的返回值为false，表示从mIdleHandlers列表中删除；返回值为true，表示下次队列空闲时继续调用。



## 应用场景

- 启动优化：非必要的代码可以放在 IdleHandler 中处理。
- 加载优化：通过 IdleHandler 进行预加载。
- 第三方框架：LeacCanary、Glide。
- Android系统：GcIdler 空闲时进行GC操作。

