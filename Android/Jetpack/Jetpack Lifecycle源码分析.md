[TOC]

# Jetpack Lifecycle源码分析

## 流程图

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7436c369bb14b5f893c3aed2128ce64.png)



## 源码分析

### Lifecycle类

```java
public abstract class Lifecycle {
    //添加观察者
    @MainThread
    public abstract void addObserver(@NonNull LifecycleObserver observer);

    //移除观察者
    @MainThread
    public abstract void removeObserver(@NonNull LifecycleObserver observer);

    //获取当前状态
    @MainThread
    @NonNull
    public abstract State getCurrentState();

    //生命周期事件
    public enum Event {
        ON_CREATE,
        ON_START,
        ON_RESUME,
        ON_PAUSE,
        ON_STOP,
        ON_DESTROY,
        ON_ANY  
    }

    //生命周期状态
    public enum State {
        DESTROYED,
        INITIALIZED,
        CREATED,
        STARTED,
        RESUMED;
        public boolean isAtLeast(@NonNull State state) {
            return compareTo(state) >= 0;
        }
    }
}
```

说明：

- Event：生命周期事件，对应Activity/Fragment的生命周期方法。
- State：生命周期状态。
- ON_CREATE/ON_START/ON_RESUME事件是在LifecycleOwner对应方法之后分发，ON_PAUSE/ON_STOP/ON_DESTROY事件是在LifecycleOwner对应方法之前分发。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8e55727534643c0b6e32b337cb52fff.png)



### androidx.activity.ComponentActivity类

ComponentActivity类实现了LifecycleOwner接口，重写`getLifecycle()`方法。

```java
public class ComponentActivity extends androidx.core.app.ComponentActivity implements 		  LifecycleOwner{

    private final LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        mSavedStateRegistryController.performRestore(savedInstanceState);
        mContextAwareHelper.dispatchOnContextAvailable(this);
        super.onCreate(savedInstanceState);
        ReportFragment.injectIfNeededIn(this); //使用ReportFragment分发事件
        if (mContentLayoutId != 0) {
            setContentView(mContentLayoutId);
        }
    }

    @CallSuper
    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        Lifecycle lifecycle = getLifecycle();
        if (lifecycle instanceof LifecycleRegistry) {
            ((LifecycleRegistry) lifecycle).setCurrentState(Lifecycle.State.CREATED);
        }
        super.onSaveInstanceState(outState);
        mSavedStateRegistryController.performSave(outState);
    }

    @NonNull
    @Override
    public Lifecycle getLifecycle() {
        return mLifecycleRegistry;
    }
}
```

说明：

ComponentActivity类实现了LifecycleOwner接口，并在`getLifecycle()`中返回LifecycleRegistry实例。

在`onSaveInstanceState()`方法中设置mLifecycleRegistry的状态为`State.CREATED`，为什么没有在其他生命周期方法中处理呢？这是因为使用ReportFragment类分发事件。



### ReportFragment类

```java
public class ReportFragment extends android.app.Fragment {

    public static void injectIfNeededIn(Activity activity) {
        if (Build.VERSION.SDK_INT >= 29) {
            //在高版本（API29及以上）中直接观察Activity生命周期
            LifecycleCallbacks.registerIn(activity);
        }

        //在低版本使用无界面的Fragment间接监听Activity生命周期
        android.app.FragmentManager manager = activity.getFragmentManager();
        if (manager.findFragmentByTag(REPORT_FRAGMENT_TAG) == null) {
            manager.beginTransaction().add(new ReportFragment(), REPORT_FRAGMENT_TAG).commit();
            manager.executePendingTransactions();
        }
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        dispatchCreate(mProcessListener);
        dispatch(Lifecycle.Event.ON_CREATE);
    }

    @Override
    public void onStart() {
        super.onStart();
        dispatchStart(mProcessListener);
        dispatch(Lifecycle.Event.ON_START);
    }

    @Override
    public void onResume() {
        super.onResume();
        dispatchResume(mProcessListener);
        dispatch(Lifecycle.Event.ON_RESUME);
    }

    @Override
    public void onPause() {
        super.onPause();
        dispatch(Lifecycle.Event.ON_PAUSE);
    }

    @Override
    public void onStop() {
        super.onStop();
        dispatch(Lifecycle.Event.ON_STOP);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        dispatch(Lifecycle.Event.ON_DESTROY);
        //赋值为空，防止内存泄露
        mProcessListener = null;
    }   

    //API29及以上，使用生命周期回调
    @RequiresApi(29)
    static class LifecycleCallbacks implements Application.ActivityLifecycleCallbacks {

        static void registerIn(Activity activity) {
            activity.registerActivityLifecycleCallbacks(new LifecycleCallbacks());
        }

        @Override
        public void onActivityCreated(@NonNull Activity activity,
                                      @Nullable Bundle bundle) {
        }

        @Override
        public void onActivityPostCreated(@NonNull Activity activity,
                                          @Nullable Bundle savedInstanceState) {
            dispatch(activity, Lifecycle.Event.ON_CREATE);
        }

        @Override
        public void onActivityStarted(@NonNull Activity activity) {
        }

        @Override
        public void onActivityPostStarted(@NonNull Activity activity) {
            dispatch(activity, Lifecycle.Event.ON_START);
        }

        //......
    }
}
```

说明：

ReportFragment类是一个没有布局的Fragment，在`ReportFragment#injectIfNeededIn()`方法中进行注册，在API29及以上直接使用`Activity#registerActivityLifecycleCallbacks()`监听生命周期回调，然后为当前Activity添加ReportFragment。

无论何种方式监听生命周期，最终都会调用`dispatch(Activity activity, Lifecycle.Event event)`方法，接着调用`LifecycleRegistry#handleLifecycleEvent()`方法处理事件。

#### ReportFragment#dispatch()

```java
//分发事件，获取依赖的Activity也就是ComponentActivity
private void dispatch(@NonNull Lifecycle.Event event) {
    if (Build.VERSION.SDK_INT < 29) {
        dispatch(getActivity(), event);
    }
}

//分发事件
static void dispatch(@NonNull Activity activity, @NonNull Lifecycle.Event event) {             
    if (activity instanceof LifecycleOwner) {
        Lifecycle lifecycle = ((LifecycleOwner) activity).getLifecycle();
        if (lifecycle instanceof LifecycleRegistry) {
            //分发事件
            ((LifecycleRegistry) lifecycle).handleLifecycleEvent(event);
        }
    }
}
```



### LifecycleRegistry类

```java
public class LifecycleRegistry extends Lifecycle {

    //存储观察者
    private FastSafeIterableMap<LifecycleObserver, ObserverWithState> mObserverMap =
        new FastSafeIterableMap<>();

    //当前状态
    private State mState;

    //处理事件
    public void handleLifecycleEvent(@NonNull Lifecycle.Event event) {
        enforceMainThreadIfNeeded("handleLifecycleEvent");
        moveToState(event.getTargetState());
    }

    //移动状态
    private void moveToState(State next) {
        //如果和当前状态一样，则不处理
        if (mState == next) {
            return;
        }
        if (mState == INITIALIZED && next == DESTROYED) {
            throw new IllegalStateException("no event down from " + mState);
        }
        //更新状态
        mState = next;
        if (mHandlingEvent || mAddingObserverCounter != 0) {
            mNewEventOccurred = true;
            return;
        }
        mHandlingEvent = true;
        sync(); //把生命周期状态同步给所有观察者
        mHandlingEvent = false;
        if (mState == DESTROYED) {
            mObserverMap = new FastSafeIterableMap<>();
        }
    }

    private void sync() {
        LifecycleOwner lifecycleOwner = mLifecycleOwner.get();
        if (lifecycleOwner == null) {
            throw new IllegalStateException("LifecycleOwner of this LifecycleRegistry is already"
                                            + "garbage collected. It is too late to change lifecycle state.");
        }
        while (!isSynced()) { //isSynced()判断所有观察者是否同步完了
            mNewEventOccurred = false;
            if (mState.compareTo(mObserverMap.eldest().getValue().mState) < 0) {
                //生命周期后退
                backwardPass(lifecycleOwner);
            }
            Map.Entry<LifecycleObserver, ObserverWithState> newest = mObserverMap.newest();
            if (!mNewEventOccurred && newest != null
                && mState.compareTo(newest.getValue().mState) > 0) {
                //生命周期前进
                forwardPass(lifecycleOwner);
            }
        }
        mNewEventOccurred = false;
    }
}
```

#### LifecycleRegistry#addObserver()

```java
//添加观察者
public void addObserver(@NonNull LifecycleObserver observer) {
    //初始化状态
    State initialState = mState == DESTROYED ? DESTROYED : INITIALIZED;
    ObserverWithState statefulObserver = new ObserverWithState(observer, initialState);
    //存放观察者
    ObserverWithState previous = mObserverMap.putIfAbsent(observer, statefulObserver);

    //如果已经存放了，则不处理
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
        statefulObserver.dispatchEvent(lifecycleOwner, event);
        popParentState();
        // mState / subling may have been changed recalculate
        targetState = calculateTargetState(observer);
    }

    if (!isReentrance) {
        // we do sync only on the top level.
        sync();
    }
    mAddingObserverCounter--;
}
```

#### LifecycleRegistry#isSynced()

```java
private boolean isSynced() {
    if (mObserverMap.size() == 0) {
        return true;
    }
    //最老的和最新的观察者状态一样，说明已经同步完成
    State eldestObserverState = mObserverMap.eldest().getValue().mState;
    State newestObserverState = mObserverMap.newest().getValue().mState;
    return eldestObserverState == newestObserverState && mState == newestObserverState;
}
```

#### LifecycleRegistry#forwardPass()

```java
//正向遍历，从新到老
private void forwardPass(LifecycleOwner lifecycleOwner) {
    Iterator<Map.Entry<LifecycleObserver, ObserverWithState>> ascendingIterator =
        mObserverMap.iteratorWithAdditions();
    while (ascendingIterator.hasNext() && !mNewEventOccurred) {
        Map.Entry<LifecycleObserver, ObserverWithState> entry = ascendingIterator.next();
        ObserverWithState observer = entry.getValue();
        while ((observer.mState.compareTo(mState) < 0 && !mNewEventOccurred
                && mObserverMap.contains(entry.getKey()))) {
            pushParentState(observer.mState);
            final Event event = Event.upFrom(observer.mState);
            if (event == null) {
                throw new IllegalStateException("no event up from " + observer.mState);
            }
            observer.dispatchEvent(lifecycleOwner, event);
            popParentState();
        }
    }
}
```



### LifecycleRegistry#ObserverWithState类

```java
static class ObserverWithState {
    State mState;
    LifecycleEventObserver mLifecycleObserver;

    ObserverWithState(LifecycleObserver observer, State initialState) {
        mLifecycleObserver = Lifecycling.lifecycleEventObserver(observer);
        mState = initialState;
    }

    //分发事件
    void dispatchEvent(LifecycleOwner owner, Event event) {
        //通过事件获取新状态
        State newState = event.getTargetState();
        mState = min(mState, newState);
        //通知观察者，回调onStateChanged方法
        mLifecycleObserver.onStateChanged(owner, event);
        mState = newState;
    }
}
```



