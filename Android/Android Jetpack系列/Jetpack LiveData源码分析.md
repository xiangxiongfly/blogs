[TOC]

# Jetpack LiveData源码分析

## 源码分析

### LiveData#observe()

注册观察者。

```java
@MainThread
public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
    assertMainThread("observe");
    if (owner.getLifecycle().getCurrentState() == DESTROYED) {
        // ignore
        return;
    }
    LifecycleBoundObserver wrapper = new LifecycleBoundObserver(owner, observer);
    ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
    if (existing != null && !existing.isAttachedTo(owner)) {
        throw new IllegalArgumentException("Cannot add the same observer"
                + " with different lifecycles");
    }
    if (existing != null) {
        return;
    }
    owner.getLifecycle().addObserver(wrapper);
}
```

### LiveData#removeObserver()

注销观察者。

```java
@MainThread
public void removeObserver(@NonNull final Observer<? super T> observer) {
    //主线程检查
    assertMainThread("removeObserver");
    //移除该观察者
    ObserverWrapper removed = mObservers.remove(observer);
    if (removed == null) {
        return;
    }
    //最终调用 mOwner.getLifecycle().removeObserver(this);
    removed.detachObserver();
    removed.activeStateChanged(false);
}
```

### LiveData#LifecycleBoundObserver

LifecycleBoundObserver是ObserverWrapper的实现类。

```java
class LifecycleBoundObserver extends ObserverWrapper implements LifecycleEventObserver {
    @NonNull
    final LifecycleOwner mOwner;

    LifecycleBoundObserver(@NonNull LifecycleOwner owner, Observer<? super T> observer) {
        super(observer);
        mOwner = owner;
    }

    //宿主的生命周期状态必须大于等于STARTED，才被认为是活跃状态
    @Override
    boolean shouldBeActive() {
        return mOwner.getLifecycle().getCurrentState().isAtLeast(STARTED);
    }

    //状态变化
    @Override
    public void onStateChanged(@NonNull LifecycleOwner source,
                               @NonNull Lifecycle.Event event) {
        //获取宿主的生命周期状态
        Lifecycle.State currentState = mOwner.getLifecycle().getCurrentState();
        //宿主的生命周期状态是DESTROYED时，移除观察者
        if (currentState == DESTROYED) {
            removeObserver(mObserver);
            return;
        }
        Lifecycle.State prevState = null;
        while (prevState != currentState) {
            prevState = currentState;
            //宿主从非活跃状态转变为活跃状态时，会尝试触发数据分发
            activeStateChanged(shouldBeActive());
            currentState = mOwner.getLifecycle().getCurrentState();
        }
    }

    @Override
    boolean isAttachedTo(LifecycleOwner owner) {
        return mOwner == owner;
    }

    @Override
    void detachObserver() {
        mOwner.getLifecycle().removeObserver(this);
    }
}
```

### LiveData#ObserverWrapper

```java
private abstract class ObserverWrapper {
    //观察者对象
    final Observer<? super T> mObserver;
    //是否活跃状态
    boolean mActive;
    //观察者持有的版本号
    int mLastVersion = START_VERSION;

    ObserverWrapper(Observer<? super T> observer) {
        mObserver = observer;
    }

    abstract boolean shouldBeActive();

    boolean isAttachedTo(LifecycleOwner owner) {
        return false;
    }

    void detachObserver() {
    }

    void activeStateChanged(boolean newActive) {
        if (newActive == mActive) {
            return;
        }
        mActive = newActive;
        changeActiveCounter(mActive ? 1 : -1);
        if (mActive) {
            //活跃状态就分发数据
            dispatchingValue(this);
        }
    }
}
```

### setValue()流程

```java
//LiveData持有版本
private int mVersion;

@MainThread
protected void setValue(T value) {
    //主线程检查
    assertMainThread("setValue");
    //版本+1
    mVersion++;
    //赋值操作
    mData = value;
    //分发数据
    dispatchingValue(null);
}

//数据分发
void dispatchingValue(@Nullable ObserverWrapper initiator) {
    //使用mDispatchingValue变量标记来防止分发相同的内容
    if (mDispatchingValue) {
        mDispatchInvalidated = true;
        return;
    }
    mDispatchingValue = true;
    do {
        mDispatchInvalidated = false;
        if (initiator != null) {
            //onStateChange()时，走这个流程
            considerNotify(initiator);
            initiator = null;
        } else {
            //setValue()时，走这个流程
            //遍历所有的观察者
            for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                 mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                considerNotify(iterator.next().getValue());
                if (mDispatchInvalidated) {
                    break;
                }
            }
        }
    } while (mDispatchInvalidated);
    mDispatchingValue = false;
}

//通知回调onChanged
private void considerNotify(ObserverWrapper observer) {
    //观察者必须是活跃状态，且STARTED状态以上
    if (!observer.mActive) {
        return;
    }
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    //版本对比
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    //更新观察者的版本号
    observer.mLastVersion = mVersion;
    //分发回调onChanged()
    observer.mObserver.onChanged()((T) mData);
}
```

### post()流程

```java
//锁
final Object mDataLock = new Object();
//空数据标记
static final Object NOT_SET = new Object();
//临时变量
volatile Object mPendingData = NOT_SET;

private final Runnable mPostValueRunnable = new Runnable() {
    @Override
    public void run() {
        Object newValue;
        synchronized (mDataLock) {
            //赋值给newValue
            newValue = mPendingData;
            //重置临时变量
            mPendingData = NOT_SET;
        }
        //调用setValue()
        setValue((T) newValue);
    }
};

protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        //是否发送数据
        postTask = mPendingData == NOT_SET;
        //赋值操作
        mPendingData = value;
    }
    if (!postTask) {
        return;
    }
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}
```



## LiveData数据丢失场景

**情况一：**

当使用`postValue()`发送数据，发送的数据速度远大于观察者消费速度时，会出现数据被覆盖问题，早期数据被丢失情况。

**情况二：**

观察者绑定的生命周期处于非活跃状态时，连续使用 setValue() / postValue() 设置数据时，观察将无法接收到中间的数据。 



## LiveData数据倒灌问题

### 原因

**LiveData#considerNotify()**

```java

public LiveData() {
    mData = NOT_SET;
    mVersion = START_VERSION; //-1
}

private void considerNotify(ObserverWrapper observer) {
    if (!observer.mActive) {
        return;
    }
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    observer.mLastVersion = mVersion;
    observer.mObserver.onChanged((T) mData);
}
```

LiveData的mVersion初始值是-1，Observer的mLastVersion初始值也是-1，每次`setValue()/postValue()`后，LiveData的版本号mVersion都会+1，这时`observer.mLastVersion >= mVersion`不成立，接着会执行`onChanged()`。

### 解决方法一

使用Google提供的SingleLiveEvent类。

```java
public class SingleLiveEvent<T> extends MutableLiveData<T> {

    private static final String TAG = "SingleLiveEvent";

    // 消费标记位
    private final AtomicBoolean mPending = new AtomicBoolean(false);

    @MainThread
    public void observe(LifecycleOwner owner, final Observer<T> observer) {

        if (hasActiveObservers()) {
            Log.w(TAG, "Multiple observers registered but only one will be notified of changes.");
        }

        // Observe the internal MutableLiveData
        super.observe(owner, new Observer<T>() {
            @Override
            public void onChanged(@Nullable T t) {
                if (mPending.compareAndSet(true, false)) {
                    observer.onChanged(t);
                }
            }
        });
    }

    @MainThread
    public void setValue(@Nullable T t) {
        mPending.set(true);
        super.setValue(t);
    }

    /**
     * Used for cases where T is Void, to make calls cleaner.
     */
    @MainThread
    public void call() {
        setValue(null);
    }
}
```

### 解决方法二

使用第三方开源框架：[https://github.com/KunMinX/UnPeek-LiveData](https://github.com/KunMinX/UnPeek-LiveData)。

### 解决方法三

Google 对 Flow 的定位是 Kotlin 环境下对 LiveData 的替代品，使用 SharedFlow 可以控制重放数量，可以设置为 0 表示禁止重放。