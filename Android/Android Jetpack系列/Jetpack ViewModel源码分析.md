[TOC]

# Jetpack ViewModel源码分析

## ViewModel生命周期图

![在这里插入图片描述](https://img-blog.csdnimg.cn/ffef5a01a9064cbcbe6632e4b9487a42.png)



## 源码分析

### ViewModel的创建流程

#### ViewModelProvider类

```kotlin
public open class ViewModelProvider @JvmOverloads constructor(
    private val store: ViewModelStore,
    private val factory: Factory,
    private val defaultCreationExtras: CreationExtras = CreationExtras.Empty,
) {

    public constructor(
        owner: ViewModelStoreOwner
    ) : this(owner.viewModelStore, defaultFactory(owner), defaultCreationExtras(owner))

    @MainThread
    public open operator fun <T : ViewModel> get(modelClass: Class<T>): T {
        val canonicalName = modelClass.canonicalName
        ?: throw IllegalArgumentException("Local and anonymous classes can not be ViewModels")
        //使用类名拼接作为换成的key
        return get("$DEFAULT_KEY:$canonicalName", modelClass)
    }

    @MainThread
    public open operator fun <T : ViewModel> get(key: String, modelClass: Class<T>): T {
        //ViewModelStore通过key获取ViewModel对象
        val viewModel = store[key]
        if (modelClass.isInstance(viewModel)) {
            (factory as? OnRequeryFactory)?.onRequery(viewModel)
            return viewModel as T
        } else {
            @Suppress("ControlFlowWithEmptyBody")
            if (viewModel != null) {
                // TODO: log a warning.
            }
        }
        val extras = MutableCreationExtras(defaultCreationExtras)
        extras[VIEW_MODEL_KEY] = key
        return try {
            //使用工厂模式创建ViewModel对象，创建后存储在ViewModelStore中
            factory.create(modelClass, extras)
        } catch (e: AbstractMethodError) {
            factory.create(modelClass)
        }.also { store.put(key, it) }
    }
    
    public open class NewInstanceFactory : Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return try {
                modelClass.newInstance()
            } catch (e: InstantiationException) {
                throw RuntimeException("Cannot create an instance of $modelClass", e)
            } catch (e: IllegalAccessException) {
                throw RuntimeException("Cannot create an instance of $modelClass", e)
            }
        }

        public companion object {
            private var sInstance: NewInstanceFactory? = null
            @JvmStatic
            public val instance: NewInstanceFactory
                @RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
                get() {
                    if (sInstance == null) {
                        sInstance = NewInstanceFactory()
                    }
                    return sInstance!!
                }

            private object ViewModelKeyImpl : Key<String>
            @JvmField
            val VIEW_MODEL_KEY: Key<String> = ViewModelKeyImpl
        }
    }
}
```

说明：

先调用构造函数创建ViewModelProvider对象，再调用`get()`方法获取ViewModel对象。



#### ComponentActivity类

```java
public class ComponentActivity extends androidx.core.app.ComponentActivity implements
    ViewModelStoreOwner { 

    //ViewModel存储容器
    private ViewModelStore mViewModelStore;
    //ViewModel的创建工厂
    private ViewModelProvider.Factory mDefaultFactory;

    public ComponentActivity() {
        //监听Activity生命周期
        getLifecycle().addObserver(new LifecycleEventObserver() {
            @Override
            public void onStateChanged(@NonNull LifecycleOwner source,
                                       @NonNull Lifecycle.Event event) {
                if (event == Lifecycle.Event.ON_DESTROY) {
                    //Activity在onDestroy时清理ViewModelStore
                    mContextAwareHelper.clearAvailableContext();                    
                    if (!isChangingConfigurations()) {
                        getViewModelStore().clear();
                    }
                }
            }
        });
    }

    @Override
    public ViewModelStore getViewModelStore() {
        if (getApplication() == null) {
            throw new IllegalStateException("Your activity is not yet attached to the "
                                            + "Application instance. You can't request ViewModel before onCreate call.");
        }
        ensureViewModelStore();
        return mViewModelStore;
    }

    //创建ViewModelStore对象
    void ensureViewModelStore() {
        if (mViewModelStore == null) {
            NonConfigurationInstances nc =
                (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                mViewModelStore = nc.viewModelStore;
            }
            if (mViewModelStore == null) {
                mViewModelStore = new ViewModelStore();
            }
        }
    }

    //屏幕旋转时调用
    @Override
    @Nullable
    public final Object onRetainNonConfigurationInstance() {
        Object custom = onRetainCustomNonConfigurationInstance();
        ViewModelStore viewModelStore = mViewModelStore;
        if (viewModelStore == null) {
            //恢复ViewModelStore对象
            NonConfigurationInstances nc =
                (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                viewModelStore = nc.viewModelStore;
            }
        }

        if (viewModelStore == null && custom == null) {
            return null;
        }

        //保存ViewModelStore对象
        NonConfigurationInstances nci = new NonConfigurationInstances();
        nci.custom = custom;
        nci.viewModelStore = viewModelStore;
        return nci;
    }

    static final class NonConfigurationInstances {
        Object custom;
        ViewModelStore viewModelStore;
    }
}
```

说明：

ComponentActivity类实现了ViewModelStoreOwner接口并实现了`getViewModelStore()`方法，Activity在创建时生成ViewModelStore对象。

当Activity旋转屏幕导致被销毁时，不仅会调用`onSaveInstanceState()`方法，还会调用`onRetainNonConfigurationInstance()`方法，屏幕旋转时保存ViewModelStore对象。



#### by viewModels()

```kotlin
@MainThread
public inline fun <reified VM : ViewModel> ComponentActivity.viewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> {
    val factoryPromise = factoryProducer ?: {
        defaultViewModelProviderFactory
    }
    return ViewModelLazy(VM::class, { viewModelStore }, factoryPromise)
}
```

```kotlin
public class ViewModelLazy<VM : ViewModel> @JvmOverloads constructor(
    private val viewModelClass: KClass<VM>,
    private val storeProducer: () -> ViewModelStore,
    private val factoryProducer: () -> ViewModelProvider.Factory,
    private val extrasProducer: () -> CreationExtras = { CreationExtras.Empty }
) : Lazy<VM> {
    private var cached: VM? = null

    override val value: VM
        get() {
            val viewModel = cached
            return if (viewModel == null) {
                val factory = factoryProducer()
                val store = storeProducer()
                //最终也是通过 ViewModelProvider 创建 ViewModel 实例
                ViewModelProvider(
                    store,
                    factory,
                    extrasProducer()
                ).get(viewModelClass.java).also {
                    cached = it
                }
            } else {
                viewModel
            }
        }

    override fun isInitialized(): Boolean = cached != null
}
```



### 数据保存阶段

#### ViewModelStore类

```java
//ViewModelStore本质是一个哈希表，键值对形式
public class ViewModelStore {
    
    //key："androidx.lifecycle.ViewModelProvider.DefaultKey"+ViewModel类名的拼接
    //value：ViewModel对象
    private final HashMap<String, ViewModel> mMap = new HashMap<>();

    final void put(String key, ViewModel viewModel) {
        ViewModel oldViewModel = mMap.put(key, viewModel);
        if (oldViewModel != null) {
            oldViewModel.onCleared();
        }
    }

    final ViewModel get(String key) {
        return mMap.get(key);
    }

    Set<String> keys() {
        return new HashSet<>(mMap.keySet());
    }

    //清除内部存储并通知viewmodel它们不再使用。
    public final void clear() {
        for (ViewModel vm : mMap.values()) {
            vm.clear();
        }
        mMap.clear();
    }
}
```



页面上的数据可以定义为两类：

- 配置数据：窗口大小、主题资源、多语言字符等。
- 非配置数据：用户信息、音视频播放信息、异步任务等。

当设备配置发生变更时，需要根据最新的配置重新读取新的数据，因此这部分数据在配置变更后失去意义，无需保存；非配置数据和设备配置没有任何关系，在重建Activity时会丢失，无法快速恢复页面数据，降低用户体验度。

#### ActivityThread#handleDestroyActivity#

```java
public void handleDestroyActivity(ActivityClientRecord r, boolean finishing, int configChanges,
                                  boolean getNonConfigInstance, String reason) {
    performDestroyActivity(r, finishing, configChanges, getNonConfigInstance, reason);

    if (finishing) {
        ActivityClient.getInstance().activityDestroyed(r.token);
    }
}
```

#### ActivityThread#performDestroyActivity
```java
void performDestroyActivity(ActivityClientRecord r, boolean finishing,
                            int configChanges, boolean getNonConfigInstance, String reason) {

    if (getNonConfigInstance) {
        try {
            //调用Activity#retainNonConfigurationInstances()，并存放在ActivityClientRecord
            r.lastNonConfigurationInstances = r.activity.retainNonConfigurationInstances();
        } 
    }
    //回调Activity#onDestroy()
    mInstrumentation.callActivityOnDestroy(r.activity);
}
```

#### Activity#retainNonConfigurationInstances()

```java
NonConfigurationInstances retainNonConfigurationInstances() {
    Object activity = onRetainNonConfigurationInstance();
    //间接回调ComponentActivity#onRetainNonConfigurationInstance()，并返回NonConfigurationInstances对象
    HashMap<String, Object> children = onRetainNonConfigurationChildInstances();
    FragmentManagerNonConfig fragments = mFragments.retainNestedNonConfig();

    mFragments.doLoaderStart();
    mFragments.doLoaderStop(true);
    ArrayMap<String, LoaderManager> loaders = mFragments.retainLoaderNonConfig();

    if (activity == null && children == null && fragments == null && loaders == null
        && mVoiceInteractor == null) {
        return null;
    }

    NonConfigurationInstances nci = new NonConfigurationInstances();
    nci.activity = activity;
    nci.children = children;
    nci.fragments = fragments;
    nci.loaders = loaders;
    if (mVoiceInteractor != null) {
        mVoiceInteractor.retainInstance();
        nci.voiceInteractor = mVoiceInteractor;
    }
    //返回NonConfigurationInstances对象
    return nci;
}
```

#### Activity#onRetainNonConfigurationInstance()

```java
//此方法交给子Activity实现
public Object onRetainNonConfigurationInstance() {
    return null;
}
```

#### androidx.activity.ComponentActivity#onRetainNonConfigurationInstance()

```java
public final Object onRetainNonConfigurationInstance() {
    //mViewModelStore为当前Activity的ViewModelStore
    ViewModelStore viewModelStore = mViewModelStore;

    //如果Activity没有调用getViewModelStore()，那么检查旧Activity传递过来的数据
    if (viewModelStore == null) {
        NonConfigurationInstances nc =
            (NonConfigurationInstances) getLastNonConfigurationInstance();
        if (nc != null) {
            viewModelStore = nc.viewModelStore;
        }
    }

    //viewModelStore为null说明Activity和旧Activity没有ViewModel
    if (viewModelStore == null && custom == null) {
        return null;
    }

    NonConfigurationInstances nci = new NonConfigurationInstances();
    //换成ViewModelStore对象
    nci.viewModelStore = viewModelStore;
    //返回NonConfigurationInstances对象
    return nci;
}
```




### 数据恢复阶段

#### ActivityThread#handleRelaunchActivity()

```java
public void handleRelaunchActivity(ActivityClientRecord tmp,
                                   PendingTransactionActions pendingActions) {
    ActivityClientRecord r = mActivities.get(tmp.token);
    r.activity.mConfigChangeFlags |= configChanges;
    r.mPreserveWindow = tmp.mPreserveWindow;
    r.activity.mChangingConfigurations = true;

    handleRelaunchActivityInner(r, configChanges, tmp.pendingResults, tmp.pendingIntents,
                                pendingActions, tmp.startsNotResumed, tmp.overrideConfig, "handleRelaunchActivity");
}
```

#### ActivityThread#handleRelaunchActivityInner()

```java
private void handleRelaunchActivityInner(ActivityClientRecord r, int configChanges,         List<ResultInfo> pendingResults, List<ReferrerIntent> pendingIntents, PendingTransactionActions pendingActions, boolean startsNotResumed, Configuration overrideConfig, String reason) {
    //回调Activity#onPause()
    performPauseActivity(r, false, reason, null /* pendingActions */);
    //回调Activity#onStop()
    callActivityOnStop(r, true /* saveState */, reason);
	//获取Activity的非配置数据
    handleDestroyActivity(r, false, configChanges, true, reason);
	//间接在Activity#attach()传递旧Activity的数据
    handleLaunchActivity(r, pendingActions, customIntent);
}
```

#### ActivityThread#handleLaunchActivity

```java
public Activity handleLaunchActivity(ActivityClientRecord r,
                                     PendingTransactionActions pendingActions, 
                                     Intent customIntent) {

    final Activity a = performLaunchActivity(r, customIntent);
    return a;
}
```

#### ActivityThread#performLaunchActivity()

```java
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {
    //创建新的Activity    
    Activity activity = mInstrumentation.newActivity(cl, component.getClassName(), r.intent);
    //创建火获取Application实例
    Application app = r.packageInfo.makeApplication(false, mInstrumentation);
    //传递lastNonConfigurationInstances数据
    activity.attach(appContext, this, getInstrumentation(), r.token,
                    r.ident, app, r.intent, r.activityInfo, title, r.parent,
                    r.embeddedID, r.lastNonConfigurationInstances, config,
                    r.referrer, r.voiceInteractor, window, r.configCallback,
                    r.assistToken, r.shareableActivityToken);
    //清空临时变量
    r.lastNonConfigurationInstances = null;
    return activity;
}
```

#### Activity#attach()

```java
final void attach(Context context, ActivityThread aThread,
                  Instrumentation instr, IBinder token, int ident,
                  Application application, Intent intent, ActivityInfo info,
                  CharSequence title, Activity parent, String id,
                  NonConfigurationInstances lastNonConfigurationInstances,
                  Configuration config, String referrer, IVoiceInteractor voiceInteractor,
                  Window window, ActivityConfigCallback activityConfigCallback, IBinder 	          assistToken,
                  IBinder shareableActivityToken) {
    	//将旧Activity的非配置数据保存
        mLastNonConfigurationInstances = lastNonConfigurationInstances;
}
```

#### ComponentActivity#getViewModelStore()

获取ViewModelStore

```java
public ViewModelStore getViewModelStore() {
    if (getApplication() == null) {
        throw new IllegalStateException("Your activity is not yet attached to the "
                + "Application instance. You can't request ViewModel before onCreate call.");
    }
    ensureViewModelStore();
    return mViewModelStore;
}

void ensureViewModelStore() {
    if (mViewModelStore == null) {
        NonConfigurationInstances nc =
                (NonConfigurationInstances) getLastNonConfigurationInstance();
        if (nc != null) {
            // Restore the ViewModelStore from NonConfigurationInstances
            mViewModelStore = nc.viewModelStore;
        }
        if (mViewModelStore == null) {
            mViewModelStore = new ViewModelStore();
        }
    }
}
```


