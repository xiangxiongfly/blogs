[TOC]

# Jetpack LiveData源码分析

LiveData 本质是观察者设计模式。



## 前提

- LiveData：被观察者，用于发送消息。
- Observer：观察者，接收数据变化。
- LifecycleOwner：生命周期拥有者（宿主），监听生命周期变化，一般指 Activity/Fragment。
- LifecycleBoundObserver：包装类，继承了ObserverWrapper类和实现LifecycleEventObserver接口，用于绑定宿主和观察者，监听活跃状态变化。
- LifecycleRegistry：生命周期管理类，管理观察者和监听状态变化。
- ObserverWithState：关联观察者和状态。



## 源码分析

### 注册订阅流程

#### LiveData#observe()

注册观察者。

```java
@MainThread
public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
    // 主线程检查
    assertMainThread("observe");
    if (owner.getLifecycle().getCurrentState() == DESTROYED) {
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
    // 最终调用LifecycleRegistry#addObserver()
    owner.getLifecycle().addObserver(wrapper);
}
```

#### LifecycleRegistry#addObserver()

```java
public void addObserver(@NonNull LifecycleObserver observer) {
    State initialState = mState == DESTROYED ? DESTROYED : INITIALIZED;
    ObserverWithState statefulObserver = new ObserverWithState(observer, initialState);
    ObserverWithState previous = mObserverMap.putIfAbsent(observer, statefulObserver);
    if (previous != null) {
        return;
    }
    LifecycleOwner lifecycleOwner = mLifecycleOwner.get();
    if (lifecycleOwner == null) {
        return;
    }
    boolean isReentrance = mAddingObserverCounter != 0 || mHandlingEvent;
    State targetState = calculateTargetState(observer);
    mAddingObserverCounter++;
    while ((statefulObserver.mState.compareTo(targetState) < 0
            && mObserverMap.contains(observer))) {
        pushParentState(statefulObserver.mState);
        final Event event = Event.upFrom(statefulObserver.mState);
        if (event == null) {
            throw new IllegalStateException("no event up from " + statefulObserver.mState);
        }
        // 调用ObserverWithState#dispatchEvent()
        statefulObserver.dispatchEvent(lifecycleOwner, event);
        popParentState();
        targetState = calculateTargetState(observer);
    }

    if (!isReentrance) {
        sync();
    }
    mAddingObserverCounter--;
}
```

#### ObserverWithState#dispatchEvent()

```java
static class ObserverWithState { 
    State mState;
    LifecycleEventObserver mLifecycleObserver;

    ObserverWithState(LifecycleObserver observer, State initialState) {
        mLifecycleObserver = Lifecycling.lifecycleEventObserver(observer);
        mState = initialState;
    }

    void dispatchEvent(LifecycleOwner owner, Event event) {
        State newState = event.getTargetState();
        mState = min(mState, newState);
        // 回调LifecycleBoundObserver#onStateChanged()
        mLifecycleObserver.onStateChanged(owner, event);
        mState = newState;
    }
}
```

#### LiveData#removeObserver()

注销观察者。

```java
@MainThread
public void removeObserver(@NonNull final Observer<? super T> observer) {
    // 主线程检查
    assertMainThread("removeObserver");
    // 移除该观察者
    ObserverWrapper removed = mObservers.remove(observer);
    if (removed == null) {
        return;
    }
    // 最终调用 mOwner.getLifecycle().removeObserver(this);
    removed.detachObserver();
    removed.activeStateChanged(false);
}
```

### LiveData$LifecycleBoundObserver类

LifecycleBoundObserver 是 ObserverWrapper 的实现类，是一个包装类，用于关联 LifecycleOwner 和 Observer。

```java
class LifecycleBoundObserver extends ObserverWrapper implements LifecycleEventObserver {
    @NonNull
    final LifecycleOwner mOwner;

    LifecycleBoundObserver(@NonNull LifecycleOwner owner, Observer<? super T> observer) {
        super(observer);
        mOwner = owner;
    }
}
```

#### LifecycleBoundObserver#shouldBeActive()

```java
// 判断宿主是否为活跃状态，也就是宿主的生命周期状态必须是STARTED或RESUMED
@Override
boolean shouldBeActive() {
    return mOwner.getLifecycle().getCurrentState().isAtLeast(STARTED);
}
```

#### LifecycleBoundObserver#onStateChanged()

```java
// 生命周期发生变化
@Override
public void onStateChanged(@NonNull LifecycleOwner source,
                           @NonNull Lifecycle.Event event) {
    // 获取宿主的生命周期状态
    Lifecycle.State currentState = mOwner.getLifecycle().getCurrentState();
    // 如果宿主的生命周期状态是DESTROYED时，表示页面销毁，则移除观察者并直接返回
    if (currentState == DESTROYED) {
        removeObserver(mObserver);
        return;
    }
    Lifecycle.State prevState = null;
    while (prevState != currentState) {
        prevState = currentState;
        // 调用ObserverWrapper#activeStateChanged()
        activeStateChanged(shouldBeActive());
        currentState = mOwner.getLifecycle().getCurrentState();
    }
}
```

### LiveData$ObserverWrapper类

```java
private abstract class ObserverWrapper {
    // 观察者对象
    final Observer<? super T> mObserver;
    // 是否活跃状态
    boolean mActive;
    // 观察者持有的版本号
    int mLastVersion = START_VERSION; 
}
```

#### ObserverWrapper#activeStateChanged()

```java
// 活跃状态变化
void activeStateChanged(boolean newActive) {
    if (newActive == mActive) {
        return;
    }
    mActive = newActive;
    changeActiveCounter(mActive ? 1 : -1);
    if (mActive) {
        // 如果是活跃状态，则表示分发数据，调用LiveData#dispatchingValue()
        dispatchingValue(this);
    }
}
```

### 发送数据流程

#### LiveData#dispatchingValue()

```java
// 分发数据
void dispatchingValue(@Nullable ObserverWrapper initiator) {
    // 通过mDispatchingValue防止重复执行
    if (mDispatchingValue) {
        mDispatchInvalidated = true;
        return;
    }
    mDispatchingValue = true;
    do {
        mDispatchInvalidated = false;
        if (initiator != null) {
            considerNotify(initiator);
            initiator = null;
        } else {
            // 遍历所有观察者，通过considerNotify()方法更新数据
            for (Iterator<Map.Entry<Observer<? super T>, ObserverWrapper>> iterator =
                 mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                // 调用LiveData#considerNotify()
                considerNotify(iterator.next().getValue());
                if (mDispatchInvalidated) {
                    break;
                }
            }
        }
    } while (mDispatchInvalidated);
    mDispatchingValue = false;
}
```

#### LiveData#considerNotify()

```java
// 通知观察者
private void considerNotify(ObserverWrapper observer) {
    // 如果观察者是非活跃状态，则直接返回
    if (!observer.mActive) {
        return;
    }
    // 如果观察者的宿主是非活跃状态，则直接返回
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    // 比较观察者的版本号和数据的版本号
    // 如果观察者的版本号>=数据的版本号，则表示数据是最新的，无需分发数据直接返回
    // 否则表示数据是旧的，需要分发数据
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    // 更新观察者的版本号
    observer.mLastVersion = mVersion;
    // 回调Observer#onChanged()
    observer.mObserver.onChanged((T) mData);
}
```

#### setValue()流程

```java
public abstract class LiveData<T> {
    private volatile Object mData;
    private int mVersion;

    public LiveData() {
        mData = NOT_SET;
        mVersion = START_VERSION;
    }

    // 主线程发送数据
    @MainThread
    protected void setValue(T value) {
        // 主线程检查
        assertMainThread("setValue");
        // 版本号更新
        mVersion++;
        // 赋值操作
        mData = value;
        // 分发数据
        // 调用LiveData#dispatchingValue()
        dispatchingValue(null);
    }
}
```

#### postValue()流程

```java
public abstract class LiveData<T> {
    // 锁对象
    final Object mDataLock = new Object();
    // 空数据标记
    static final Object NOT_SET = new Object();
    // 临时变量
    volatile Object mPendingData = NOT_SET;

    private final Runnable mPostValueRunnable = new Runnable() {
        @Override
        public void run() {
            Object newValue;
            synchronized (mDataLock) {
                // 将临时变量赋值给newValue
                newValue = mPendingData;
                // 重置临时变量
                mPendingData = NOT_SET;
            }
            // 发送数据，调用LiveData#setValue()
            setValue((T) newValue);
        }
    };

    protected void postValue(T value) {
        boolean postTask;
        synchronized (mDataLock) {
            // mPendingData == NOT_SET 如果为true表示临时变量为空值，否则表示临时变量有值
            postTask = mPendingData == NOT_SET;
            // 给临时变量赋值
            mPendingData = value;
        }
        // 如果临时变量有值，则直接返回
        if (!postTask) {
            return;
        }
        // 切换到主线程执行任务
        ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
    }
}
```



## LiveData数据丢失问题

### 问题

频繁调用 postValue() 发送数据时，发送的数据速度远大于观察者消费速度时，会出现新值覆盖旧值问题，早期数据被丢失情况。

### 原因

这样的设计是为了兼顾性能，UI只需显示最终状态即可，省略中间态造成的频发刷新

**源码：**

```java
protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        postTask = mPendingData == NOT_SET;
        mPendingData = value;
    }
    // mPendingData可能有值，postTask可能为false，因此可能不会执行后续代码
    if (!postTask) {
        return;
    }
    // 切换主线程发送数据
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}
```

说明：每次调用 postValue() 方法时，会覆盖临时变量 mPendingData 的值，因此 mPendingData 一直都是最新值，当切换主线程并执行 mPostValueRunnable 任务时，这属于耗时操作，临时变量 mPendingData 可能是有值的，因此 postTask 可能为false，最终执行的是最新的值。



## LiveData数据倒灌问题

### 问题

数据倒灌也就是粘性事件，先发送数据，然后注册订阅，会立即收到之前的发的数据。

LiveData 先调用 setValue() 发送数据，然后再调用 observe() 注册订阅，观察者会立即收到旧数据。

### 原因

LiveData 内部会维护一个版本号（mVersion）初始值为-1，每当发送数据时，这个版本号就会递增，同样观察者内部也维护一个版本号（mLastVersion）初始值为-1。如果观察者的版本号>=LiveData的版本号，则表示数据是最新的，无需分发数据；如果<LiveData的版本号，则表示数据是旧的需要分发数据，同时更新观察者的版本号，

如果先发送数据，会导致mVersion版本号更新了，注册订阅会触发 onStateChanged() 方法，最终调用 considerNotify() 方法， 

```java
public abstract class LiveData<T> {
    private int mVersion;
    
    // 发送数据会调用此方法
    protected void setValue(T value) {
        assertMainThread("setValue");
        mVersion++;
        mData = value;
        dispatchingValue(null);
    }

    // 注册订阅执行observe()会调用此方法
    private void considerNotify(ObserverWrapper observer) {
        if (!observer.mActive) {
            return;
        }
        if (!observer.shouldBeActive()) {
            observer.activeStateChanged(false);
            return;
        }
        // 如果先setValue()后observe()，会导致mLastVersion一直比mVersion小，继续执行后续代码，最终调用onChanged()
        if (observer.mLastVersion >= mVersion) {
            return;
        }
        observer.mLastVersion = mVersion;
        observer.mObserver.onChanged((T) mData);
    }
}
```

### 解决方法一：SingleLiveEvent

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

### 解决方法二：UnPeek-LiveData

使用第三方开源框架：[https://github.com/KunMinX/UnPeek-LiveData](https://github.com/KunMinX/UnPeek-LiveData)。

### 解决方法三：Flow 

Google 对 Flow 的定位是 Kotlin 环境下对 LiveData 的替代品，使用 SharedFlow 可以控制重放数量，可以设置为 0 表示禁止重放。