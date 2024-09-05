[toc]

# Android Activity启动流程(Android 13)

## 概述

AMS（ActivityManagerService） 是 Android 操作系统中的一个核心组件。它负责管理应用程序的生命周期、进程管理、任务管理、内存管理以及应用程序之间的通信。

在 Android 10 及以后版本中，AMS 的部分功能迁移到了 ATMS，Activity 的管理和调度主要由 ATMS（ActivityTaskManagerService） 负责，而其他三大组件（Service、ContentProvider 和 BroadcastReceiver）仍然由 AMS 管理。AMS 持有 ATMS 的引用，AMS 可以通过 ATMS 处理 Activity。



## 流程图

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e0d543d402674488835c4aa54c61dd3f.png)

1. App 进程向 SystemServer 进程发送 startActivity 请求。
2. SystemServer 进程处理 startActivity 请求，如果 App 进程存在，则直接调用直接启动 Activity，如果 App 进程不存在，则向 Zygote 进程发送创建进程消息。
3. Zygote 进程收到请求后，fork新进程，并调用 ActivityThread 的 main() 初始化操作。
4. 新进程启动后，向 ActivityManagerService 发送 attachApplication，告诉 AMS 新进程已经启动了。
5. ActivityManagerService 收到新进程通知，会做一些准备工作，然后调用 ActivityTaskSupervisor#realStartActivityLocked() 启动 Activity。ActivityTaskSupervisor 使用 ApplicationThread 的 Binder 代理向被启动的App进程发送 scheduleTransaction 请求。
6. 已启动的 App 进程的 ApplicationThread（Binder 客户端） 收到请求后，通过 handler 向主线程发送 EXECUTE_TRANSACTION 消息。
7. 主线程在收到消息后，通过反射机制创建目标 Activity，启动 Activity 并回调Activity.onCreate()等方法。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f33e9634f6f340839db6ba0ea98d7419.png)



## 前提

- ActivityManagerService（AMS）：负责管理 Service、BroadcastReceiver 和 ContentProvider。
- ActivityTaskManagerService（ATMS）：负责 Activity 的启动、生命周期管理、任务栈管理等。
- ActivityTaskSupervisor：属于 AMTS 的一部分，负责监督和管理 Activity 的生命周期、任务栈以及 Activity 的启动和切换等操作。。
- Instrumentation：负责创建 Application 和 Activity 和管理生命周期，持有 ActivityThread 的引用。
- ActivityTaskManager：提供有关活动及其容器(如任务、堆栈和显示器)的信息，并与之交互。
- ActivityStartController：ActivityStart 的控制类。
- ActivityStarter：负责 Activity 的启动。
- ActivityInfo：负责记录 Activity 信息，如：主题、启动模式、屏幕方向、包信息等。
- ProcessRecord：负责记录进程信息，如：身份信息、进程中的组件（Activity组件记录表，Service组件记录表，广播记录表，ContentProvider记录表等）、进程状态、时间、Crash、ANR、电源信息等。
- ActivityRecord：负责记录  Activity 的信息，一个 Activity 对应一个 ActivityRecord，如：Activity 的配置信息、运行状态等。
- Task：继承自 TaskFragment，负责管理 Activity 的启动顺序，内部维护 `ArrayList<ActivityRecord>`。
- ActivityStackSupervisor：负责管理 ActivityStack 任务栈。
  - `ArrayList<ActivityRecord> mStoppingActivities`：维护停止的Activity。
  - `ArrayList<ActivityRecord> mFinishingActivitie`：维护已结束的Activity。
  - `ArrayList<ActivityRecord> mNoAnimActivities`：维护无过渡动画的Activity。
- RootWindowContainer：负责管理与 Activity 相关的窗口。
- ActivityThread：运行在 UI 线程（主线程），App的入口。
- ApplicationThread：实现 IBinder 接口，是 ActivityThread 的内部类，负责与 ATMS 交互。
- ActivityStartController：负责 ATMS 中 Actvitiy 启动相关的功能。
- ResolveInfo：存储解析 AndroidManifest.xml 的信息，如：Activity、Broadcast、Service、ContentProvider、packageName 等。
- 客户端：启动 Activity 的进程。
- 服务端：system_server 进程。



## 流程分析

### Activity#startActivity()

```java
public void startActivity(Intent intent) {
    this.startActivity(intent, null);
}
```

```java
public void startActivity(Intent intent, @Nullable Bundle options) {
    getAutofillClientController().onStartActivity(intent, mIntent);
    if (options != null) {
        startActivityForResult(intent, -1, options);
    } else { 
        startActivityForResult(intent, -1);
    }
}
```

说明：

- 最终都会调用 Activity#startActivityForResult()，
- requestCode 为 -1 时表示没有返回值。

### Activity#startActivityForResult()

```java
public void startActivityForResult(@RequiresPermission Intent intent, int requestCode,                      																@Nullable Bundle options) {
    if (mParent == null) {
        options = transferSpringboardActivityOptions(options);
        // 调用Instrumentation#execStartActivity()
        Instrumentation.ActivityResult ar =
            mInstrumentation.execStartActivity(
            this, mMainThread.getApplicationThread(), mToken, this,
            intent, requestCode, options);
        if (ar != null) {
            mMainThread.sendActivityResult(
                mToken, mEmbeddedID, requestCode, ar.getResultCode(),
                ar.getResultData());
        }
        // requestCode必须>=0才可以启动Activity
        if (requestCode >= 0) { 
            mStartedActivity = true;
        }
        // 取消输入事件，开始执行Activity动画
        cancelInputsAndStartExitTransition(options);
    } else {

    }
}
```

说明：

- 最终调用 Instrumentation#execStartActivity()。
- mMainThread 是 ActivityThread 的实例。
- 通过 getApplicationThread() 获取 ApplicationThread，ApplicationThread 是一个 Binder 类。

### Instrumentation#execStartActivity()

```java
public ActivityResult execStartActivity(
        Context who, IBinder contextThread, IBinder token, Activity target,
        Intent intent, int requestCode, Bundle options) {
    IApplicationThread whoThread = (IApplicationThread) contextThread;
    // ......
    try {
        intent.migrateExtraStreamToClipData(who);
        intent.prepareToLeaveProcess(who);
        // 最终调用ActivityTaskManager#startActivity，并获取返回值
        int result = ActivityTaskManager.getService().startActivity(whoThread,
                who.getOpPackageName(), who.getAttributionTag(), intent,
                intent.resolveTypeIfNeeded(who.getContentResolver()), token,
                target != null ? target.mEmbeddedID : null, requestCode, 0, null, options);
        // 检查Activity启动结果
        checkStartActivityResult(result, intent);
    } catch (RemoteException e) {
        throw new RuntimeException("Failure from system", e);
    }
    return null;
}
```

说明：

- 通过 ActivityTaskManager 获取 ActivityTaskManagerService，进行 Binder 通信。
-  向 SystemServer 进程中 ATMS 发送 startActivity 请求
- 通过 checkStartActivityResult() 检测启动结果，如异常：未在AndroidManifest.xml中注册抛出异常等。

#### ActivityTaskManager#getService()

```java
// ActivityTaskManager类
public static IActivityTaskManager getService() {
    return IActivityTaskManagerSingleton.get();
}

private static final Singleton<IActivityTaskManager> IActivityTaskManagerSingleton =
            new Singleton<IActivityTaskManager>() {
                @Override
                protected IActivityTaskManager create() {
                    final IBinder b = ServiceManager.getService(Context.ACTIVITY_TASK_SERVICE);
                    return IActivityTaskManager.Stub.asInterface(b);
                }
            };
```

### ActivityTaskManagerService#startActivity()

```java
public final int startActivity(IApplicationThread caller, String callingPackage,
        String callingFeatureId, Intent intent, String resolvedType, IBinder resultTo,
        String resultWho, int requestCode, int startFlags, ProfilerInfo profilerInfo,
        Bundle bOptions) {
    // 调用ActivityTaskManagerService#startActivityAsUser()
    return startActivityAsUser(caller, callingPackage, callingFeatureId, intent, resolvedType,
            resultTo, resultWho, requestCode, startFlags, profilerInfo, bOptions,
            UserHandle.getCallingUserId());
}
```

说明：

- 这是一个跨进程操作，已经进入 system_server 进程。
- 在该流程return前，Client即发起startActivity的应用进程均处于挂起状态。

### ActivityTaskManagerService#startActivityAsUser()

```java
public int startActivityAsUser(IApplicationThread caller, String callingPackage,
            String callingFeatureId, Intent intent, String resolvedType, IBinder resultTo,
            String resultWho, int requestCode, int startFlags, ProfilerInfo profilerInfo,
            Bundle bOptions, int userId) {
        return startActivityAsUser(caller, callingPackage, callingFeatureId, intent, resolvedType,
                resultTo, resultWho, requestCode, startFlags, profilerInfo, bOptions, userId,
                true );
 }
```

```Java
private int startActivityAsUser(IApplicationThread caller, String callingPackage,
        @Nullable String callingFeatureId, Intent intent, String resolvedType,
        IBinder resultTo, String resultWho, int requestCode, int startFlags,
        ProfilerInfo profilerInfo, Bundle bOptions, int userId, boolean validateIncomingUser) {
	
      userId = getActivityStartController().checkTargetUser(userId, validateIncomingUser,
                Binder.getCallingPid(), Binder.getCallingUid(), "startActivityAsUser");
    
    // 最终调用ActivityStarter#execute()
    return getActivityStartController().obtainStarter(intent, "startActivityAsUser")
            .setCaller(caller)
            .setCallingPackage(callingPackage)
            .setCallingFeatureId(callingFeatureId)
            .setResolvedType(resolvedType)
            .setResultTo(resultTo)
            .setResultWho(resultWho)
            .setRequestCode(requestCode)
            .setStartFlags(startFlags)
            .setProfilerInfo(profilerInfo)
            .setActivityOptions(bOptions)
            .setUserId(userId)
            .execute();
}
```

说明：

- 通过 getActivityStartController() 获取 ActivityStartController 实例。
- 通过 obtainStarter() 获取 ActivityStarter 实例。
- 最终调用 ActivityStarter#execute()。

### ActivityStarter#execute()

```java
int execute() {
    // ......
    try {
        // 调用ActivityStarter#executeRequest()
        res = executeRequest(mRequest);
    } finally {
        // 启动Activity后的回调
        onExecutionComplete();
    }
}
```

### ActivityStarter#executeRequest()

```java
private int executeRequest(Request request) {    

    // 创建ActivityRecord
    final ActivityRecord r = new ActivityRecord.Builder(mService)
        .setCaller(callerApp)
        .setLaunchedFromPid(callingPid)
        .setLaunchedFromUid(callingUid)
        .setLaunchedFromPackage(callingPackage)
        .setLaunchedFromFeature(callingFeatureId)
        .setIntent(intent)
        .setResolvedType(resolvedType)
        .setActivityInfo(aInfo)
        .setConfiguration(mService.getGlobalConfiguration())
        .setResultTo(resultRecord)
        .setResultWho(resultWho)
        .setRequestCode(requestCode)
        .setComponentSpecified(request.componentSpecified)
        .setRootVoiceInteraction(voiceSession != null)
        .setActivityOptions(checkedOptions)
        .setSourceRecord(sourceRecord)
        .build();

    // 调用ActivityStarter#startActivityUnchecked()
    mLastStartActivityResult = startActivityUnchecked(r, sourceRecord, voiceSession,
                request.voiceInteractor, startFlags, true /* doResume */, checkedOptions,
                inTask, inTaskFragment, restrictedBgActivity, intentGrants);
      
    return mLastStartActivityResult;
}
```

说明：

- 创建 ActivityRecord 实例。
- 调用 startActivityUnchecked()。

### ActivityStarter#startActivityUnchecked()

```java
private int startActivityUnchecked(final ActivityRecord r, ActivityRecord sourceRecord,
                                   IVoiceInteractionSession voiceSession, IVoiceInteractor voiceInteractor,
                                   int startFlags, boolean doResume, ActivityOptions options, Task inTask,
                                   TaskFragment inTaskFragment, boolean restrictedBgActivity,
                                   NeededUriGrants intentGrants) {
、 
    try {
        mService.deferWindowLayout();
        Trace.traceBegin(Trace.TRACE_TAG_WINDOW_MANAGER, "startActivityInner");
        // 调用ActivityStarter#startActivityInner()
        result = startActivityInner(r, sourceRecord, voiceSession, voiceInteractor,
                                    startFlags, doResume, options, inTask, inTaskFragment, 					                                    restrictedBgActivity, intentGrants);
    }  
    return result;
}
```

### ActivityStarter#startActivityInner()

```java
int startActivityInner(final ActivityRecord r, ActivityRecord sourceRecord,
        IVoiceInteractionSession voiceSession, IVoiceInteractor voiceInteractor,
        int startFlags, boolean doResume, ActivityOptions options, Task inTask,
        TaskFragment inTaskFragment, boolean restrictedBgActivity,
        NeededUriGrants intentGrants) {
    // 初始化参数
    setInitialState(r, options, inTask, inTaskFragment, doResume, startFlags, sourceRecord,
            voiceSession, voiceInteractor, restrictedBgActivity);
	// 处理Intent携带的flags
    computeLaunchingTaskFlags();
    // 获取Activity的任务栈
    computeSourceRootTask();
    // 设置启动模式
    mIntent.setFlags(mLaunchFlags);    
    // 获取可用的任务栈
    final Task reusedTask = getReusableTask();
  
    // 计算是否有一个现存的任务需要使用
    final Task targetTask = reusedTask != null ? reusedTask : computeTargetTask();
    // 标记是否使用新建任务栈
    final boolean newTask = targetTask == null;
    mTargetTask = targetTask;

    // 调用RootWindowContainer#resumeFocusedTasksTopActivities()
    mRootWindowContainer.resumeFocusedTasksTopActivities(
                        mTargetRootTask, mStartActivity, mOptions, mTransientLaunch);

    return START_SUCCESS;
}
```

说明：

- 这里主要处理任务栈相关流程：
  - 如果找到可用任务栈则直接使用，如果没有找到可用则新建。
- 接着调用 resumeFocusedTasksTopActivities()。

### RootWindowContainer#resumeFocusedTasksTopActivities()

```java
boolean resumeFocusedTasksTopActivities(
        Task targetRootTask, ActivityRecord target, ActivityOptions targetOptions,
        boolean deferPause) {
    boolean result = false;
    if (targetRootTask != null && (targetRootTask.isTopRootTaskInDisplayArea()
            || getTopDisplayFocusedRootTask() == targetRootTask)) {
        // 调用Task#resumeTopActivityUncheckedLocked()
        result = targetRootTask.resumeTopActivityUncheckedLocked(target, targetOptions,
                deferPause);
    }  
    return result;
}
```

### Task#resumeTopActivityUncheckedLocked()

```java
boolean resumeTopActivityUncheckedLocked(ActivityRecord prev, ActivityOptions options,
                                         boolean deferPause) {
    // 调用Task#resumeTopActivityInnerLocked()
    someActivityResumed = resumeTopActivityInnerLocked(prev, options, deferPause);
    return someActivityResumed;
}
```

### Task#resumeTopActivityInnerLocked()

```java
private boolean resumeTopActivityInnerLocked(ActivityRecord prev, ActivityOptions options,
        boolean deferPause) { 
    // 获取任务栈的栈顶的Activity
    final ActivityRecord topActivity = topRunningActivity(true);
    final TaskFragment topFragment = topActivity.getTaskFragment();
    // TaskFragment#resumeTopActivity()
    resumed[0] = topFragment.resumeTopActivity(prev, options, deferPause);   
    return resumed[0];
}
```

### TaskFragment#resumeTopActivity()

```java
final boolean resumeTopActivity(ActivityRecord prev, ActivityOptions options,
                                boolean deferPause) {     
    ActivityRecord next = topRunningActivity(true);

    if (mResumedActivity != null) {
        // 暂停栈顶的Activity
        pausing |= startPausing(mTaskSupervisor.mUserLeaving, false,                                 												 next, "resumeTopActivity");
    }

    // 调用ActivityTaskSupervisor#startSpecificActivity()
    mTaskSupervisor.startSpecificActivity(next, true, false);
    return true;
}
```

说明：

- 暂停栈顶的 Activity。
- 调用 startSpecificActivity() 启动 Activity。

### ActivityTaskSupervisor#startSpecificActivity()

```java
void startSpecificActivity(ActivityRecord r, boolean andResume, boolean checkConfig) {
    // Activity所在的App进程是否运行
    final WindowProcessController wpc =
            mService.getProcessController(r.processName, r.info.applicationInfo.uid);

    boolean knownToBeDead = false;
    if (wpc != null && wpc.hasThread()) {
        try {
            // 进程已启动情况
            realStartActivityLocked(r, wpc, andResume, checkConfig);
            return;
        } catch (RemoteException e) {           
        } 
    }

    r.notifyUnknownVisibilityLaunchedForKeyguardTransition();

    final boolean isTop = andResume && r.isTopRunningActivity();
    // 进程没有启动情况
    mService.startProcessAsync(r, knownToBeDead, isTop,
            isTop ? HostingRecord.HOSTING_TYPE_TOP_ACTIVITY
                    : HostingRecord.HOSTING_TYPE_ACTIVITY);
}
```

说明：

- mService 是 ActivityTaskManagerService 的实例。
- 开始执行启动 Activity 的流程。
- 进程已启动情况：直接启动 Activity。
- 进程未启动情况：先启动进程，再启动 Activity。



## 情况一：进程已启动

### ActivityTaskSupervisor#realStartActivityLocked()

```java
boolean realStartActivityLocked(ActivityRecord r, WindowProcessController proc,
        boolean andResume, boolean checkConfig) throws RemoteException {             
    // 创建启动Activity的事务 
    final ClientTransaction clientTransaction = ClientTransaction.obtain(proc.getThread(), r.token);
    final boolean isTransitionForward = r.isTransitionForward();
    final IBinder fragmentToken = r.getTaskFragment().getFragmentToken();
    // 添加callback
    clientTransaction.addCallback(LaunchActivityItem.obtain(new Intent(r.intent),
                    System.identityHashCode(r), r.info,                 
                    mergedConfiguration.getGlobalConfiguration(),
                    mergedConfiguration.getOverrideConfiguration(), r.compat,
                    r.getFilteredReferrer(r.launchedFromPackage), task.voiceInteractor,
                    proc.getReportedProcState(), r.getSavedState(), r.getPersistentSavedState(),
                    results, newIntents, r.takeOptions(), isTransitionForward,
                    proc.createProfilerInfoIfNeeded(), r.assistToken, activityClientController,
                    r.shareableActivityToken, r.getLaunchedFromBubble(), fragmentToken));
 
    // 设置Activity启动后的生命周期状态
    final ActivityLifecycleItem lifecycleItem;
    if (andResume) {
        // RESUME状态
        lifecycleItem = ResumeActivityItem.obtain(isTransitionForward);
    } else {
        // PAUSE状态
        lifecycleItem = PauseActivityItem.obtain();
    }
    // 设置状态
    clientTransaction.setLifecycleStateRequest(lifecycleItem);

    // 开启事务，最终调用ClientLifecycleManager#scheduleTransaction()
    mService.getLifecycleManager().scheduleTransaction(clientTransaction);                         
    
    return true;
}
```

说明：

- mService 是 ActivityTaskManagerService 实例。
- mService.getLifecycleManager() 获取 ClientLifecycleManager 对象。
- AMS 向 app进程（ApplicationThread）发送 scheduleTransaction。

#### ClientLifecycleManager#scheduleTransaction()

```java
// 启动Activity的事务
void scheduleTransaction(ClientTransaction transaction) throws RemoteException {
    final IApplicationThread client = transaction.getClient();
    // 调用ClientTransaction#schedule()
    transaction.schedule(); 
}
```

#### ClientTransaction#schedule()

```java
public void schedule() throws RemoteException {
    // 调用ApplicationThread#scheduleTransaction()
    mClient.scheduleTransaction(this);
}
```

说明：mClient 是 IApplicationThread 实例。

### ApplicationThread#scheduleTransaction()

```java
@Override
public void scheduleTransaction(ClientTransaction transaction) throws RemoteException {
    // 最终调用ClientTransactionHandler#scheduleTransaction()
    ActivityThread.this.scheduleTransaction(transaction);
}
```

### ClientTransactionHandler#scheduleTransaction()

```java
void scheduleTransaction(ClientTransaction transaction) {
    transaction.preExecute(this);
    // 发送消息，在H类中接收消息
    sendMessage(ActivityThread.H.EXECUTE_TRANSACTION, transaction);
}
```

说明：

- ClientTransactionHandler 是一个抽象类。
- ActivityThread  继承自 ClientTransactionHandler 类。
- scheduleTransaction() 方法定义在 ClientTransactionHandler 中。
- H 是一个 Handler，是 ActivityThread 的内部类。
- sendMessage() 是通过 Handler 发送消息。

### ActivityThread.H#handleMessage()

```java
class H extends Handler {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case EXECUTE_TRANSACTION:
                final ClientTransaction transaction = (ClientTransaction) msg.obj;
                // 执行事务
                mTransactionExecutor.execute(transaction);
                if (isSystem()) {
                    transaction.recycle();
                }
                break;
        }
    }
}
```

说明：

- Handler 接收消息，并执行事务。
- mTransactionExecutor 是 TransactionExecutor 实例。

### TransactionExecutor#execute()

```java
public void execute(ClientTransaction transaction) {
    // 调用TransactionExecutor#executeCallbacks()
    executeCallbacks(transaction);
    // 执行lifecycleState
    executeLifecycleState(transaction);

    mPendingActions.clear();
}
```

说明：

- executeLifecycleState() 处理 Activity 的生命周期状态。

#### TransactionExecutor#executeCallbacks()

```java
public void executeCallbacks(ClientTransaction transaction) {
    final List<ClientTransactionItem> callbacks = transaction.getCallbacks(); 
    final IBinder token = transaction.getActivityToken();
    ActivityClientRecord r = mTransactionHandler.getActivityClient(token);     
    final int size = callbacks.size();
    for (int i = 0; i < size; ++i) {
        if (postExecutionState != UNDEFINED && r != null) {
            final boolean shouldExcludeLastTransition =
                		i == lastCallbackRequestingState && finalState == postExecutionState;
            cycleToPath(r, postExecutionState, shouldExcludeLastTransition, transaction);
        }
    }
}
```

#### TransactionExecutor#cycleToPath()

```java
private void cycleToPath(ActivityClientRecord r, int finish, boolean excludeLastState,
        ClientTransaction transaction) {
    // 获取当前Activity生命周期状态
    final int start = r.getLifecycleState();
    // 获取需要执行的生命周期数组
    final IntArray path = mHelper.getLifecyclePath(start, finish, excludeLastState);
    // 按顺序执行Activity的生命周期
    performLifecycleSequence(r, path, transaction);
}
```

#### TransactionExecutor#executeLifecycleState()

```java
private void executeLifecycleState(ClientTransaction transaction) {
    final ActivityLifecycleItem lifecycleItem = transaction.getLifecycleStateRequest();
    if (lifecycleItem == null) {
        return;
    }

    final IBinder token = transaction.getActivityToken();
    final ActivityClientRecord r = mTransactionHandler.getActivityClient(token);   

    if (r == null) {
        return;
    }

    // 调用cycleToPath()
    cycleToPath(r, lifecycleItem.getTargetState(), true /* excludeLastState */, transaction);

    lifecycleItem.execute(mTransactionHandler, token, mPendingActions);
    lifecycleItem.postExecute(mTransactionHandler, token, mPendingActions);
}
```

### TransactionExecutor#performLifecycleSequence()

```java
private void performLifecycleSequence(ActivityClientRecord r, IntArray path, ClientTransaction transaction){
    final int size = path.size();
    // 遍历生命周期数组
    for (int i = 0, state; i < size; i++) {
        state = path.get(i); 
        switch (state) {
            case ON_CREATE:
                // 调用ClientTransactionHandler#handleLaunchActivity()，这是个抽象类抽象方法
                // 最终调用ActivityThread#handleLaunchActivity()
                mTransactionHandler.handleLaunchActivity(r, mPendingActions,
                        null /* customIntent */);
                break;
            case ON_START:
                mTransactionHandler.handleStartActivity(r, mPendingActions,
                        null /* activityOptions */);
                break;
            case ON_RESUME:
                mTransactionHandler.handleResumeActivity(r, false /* finalStateRequest */,
                        r.isForward, "LIFECYCLER_RESUME_ACTIVITY");
                break;
            case ON_PAUSE:
                mTransactionHandler.handlePauseActivity(r, false /* finished */,
                        false /* userLeaving */, 0 /* configChanges */, mPendingActions,
                        "LIFECYCLER_PAUSE_ACTIVITY");
                break;
            case ON_STOP:
                mTransactionHandler.handleStopActivity(r, 0 /* configChanges */,
                        mPendingActions, false /* finalStateRequest */,
                        "LIFECYCLER_STOP_ACTIVITY");
                break;
            case ON_DESTROY:
                mTransactionHandler.handleDestroyActivity(r, false /* finishing */,
                        0 /* configChanges */, false /* getNonConfigInstance */,
                        "performLifecycleSequence. cycling to:" + path.get(size - 1));
                break;
            case ON_RESTART:
                mTransactionHandler.performRestartActivity(r, false /* start */);
                break;
            default:
                throw new IllegalArgumentException("Unexpected lifecycle state: " + state);
        }
    }
}
```

说明：

- 遍历生命周期数组，如果生命周期数组只有 ON_START 和 ON_RESUME，那么先后执行 handleStartActivity() 和 handleResumeActivity()。

#### ClientTransactionHandler#handleLaunchActivity()

```java
public abstract class ClientTransactionHandler {
    public abstract Activity handleLaunchActivity(@NonNull ActivityClientRecord r,
                        PendingTransactionActions pendingActions, Intent customIntent);
}
```

说明：

- ClientTransactionHandler 是一个抽象类，handleLaunchActivity 是一个抽象方法。
- ActivityThread 是 ClientTransactionHandler  的子类，直接看 ActivityThread 代码。

### ActivityThread#handleLaunchActivity()

```java
public Activity handleLaunchActivity(ActivityClientRecord r,
        PendingTransactionActions pendingActions, Intent customIntent) {  
 	// 在创建Activity之前初始化
    if (ThreadedRenderer.sRendererEnabled
            && (r.activityInfo.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0) {
        HardwareRenderer.preload();
    }
    // 获取WMS服务，初始化WindowManager
    WindowManagerGlobal.initialize();
    // GraphicsEnvironment提示一个activity正在进程上启动
    GraphicsEnvironment.hintActivityLaunch();
    // 启动Activity，调用ActivityThread#performLaunchActivity()
    final Activity a = performLaunchActivity(r, customIntent); 
    return a;
}
```

说明：

- 初始化 WindowManagerGlocal。
- 调用 performLaunchActivity() 执行 Activity 的创建流程。

#### ActivityThread#performLaunchActivity()

```java
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {   

    ContextImpl appContext = createBaseContextForActivity(r);
    Activity activity = null;

    java.lang.ClassLoader cl = appContext.getClassLoader();
    // 创建Activity
    activity = mInstrumentation.newActivity(
        cl, component.getClassName(), r.intent);    

    // 获取Application实例
    Application app = r.packageInfo.makeApplicationInner(false, mInstrumentation);

    // Activity与Context建立关联
    activity.attach(appContext, this, getInstrumentation(), r.token,
                    r.ident, app, r.intent, r.activityInfo, title, r.parent,
                    r.embeddedID, r.lastNonConfigurationInstances, config,
                    r.referrer, r.voiceInteractor, window, r.activityConfigCallback,
                    r.assistToken, r.shareableActivityToken);

    // 执行Activity的create流程，包含Activity#onCreate()回调
    if (r.isPersistable()) {
        mInstrumentation.callActivityOnCreate(activity, r.state, r.persistentState);
    } else {
        mInstrumentation.callActivityOnCreate(activity, r.state);
    }

    return activity;
}
```

说明：

- mInstrumentation 是 Instrumentation  实例。
- 通过 Instrumentation 类创建 Activity 实例。
- 接着执行 Activity 的生命周期。

#### Instrumentation#newActivity()

```java
public Activity newActivity(ClassLoader cl, String className,
        Intent intent)
        throws InstantiationException, IllegalAccessException,
        ClassNotFoundException {
    String pkg = intent != null && intent.getComponent() != null
            ? intent.getComponent().getPackageName() : null;
    return getFactory(pkg).instantiateActivity(cl, className, intent);
}

private AppComponentFactory getFactory(String pkg) {
    if (pkg == null) { 
        return AppComponentFactory.DEFAULT;
    }
    if (mThread == null) { 
        return AppComponentFactory.DEFAULT;
    }
    LoadedApk apk = mThread.peekPackageInfo(pkg, true);
    if (apk == null) apk = mThread.getSystemContext().mPackageInfo;
    return apk.getAppFactory();
}

public @NonNull Activity instantiateActivity(@NonNull ClassLoader cl, @NonNull String className, @Nullable Intent intent)
        throws InstantiationException, IllegalAccessException, ClassNotFoundException {
    return (Activity) cl.loadClass(className).newInstance();
}
```

说明：

- 调用 newActivity()，通过反射创建 Activity 实例。

#### Activity#attach()

```java
final void attach(Context context, ActivityThread aThread,
        Instrumentation instr, IBinder token, int ident,
        Application application, Intent intent, ActivityInfo info,
        CharSequence title, Activity parent, String id,
        NonConfigurationInstances lastNonConfigurationInstances,
        Configuration config, String referrer, IVoiceInteractor voiceInteractor,
        Window window, ActivityConfigCallback activityConfigCallback, IBinder assistToken,
        IBinder shareableActivityToken) {
    attachBaseContext(context);

    mFragments.attachHost(null /*parent*/);

    // 创建PhoneWindow实例
    mWindow = new PhoneWindow(this, window, activityConfigCallback);
    mWindow.setWindowControllerCallback(mWindowControllerCallback);
	// 将Activity传入PhoneWindow
    mWindow.setCallback(this);
    mWindow.setOnWindowDismissedCallback(this);
    mWindow.getLayoutInflater().setPrivateFactory(this);
	// PhoneWindow关联WindowManager
    mWindow.setWindowManager(
            (WindowManager)context.getSystemService(Context.WINDOW_SERVICE),
            mToken, mComponent.flattenToString(),
            (info.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0);
    if (mParent != null) {
        mWindow.setContainer(mParent.getWindow());
    }
    // 让Activity持有WindowManager
    mWindowManager = mWindow.getWindowManager();
    mCurrentConfig = config;

    mWindow.setColorMode(info.colorMode);
    mWindow.setPreferMinimalPostProcessing(
            (info.flags & ActivityInfo.FLAG_PREFER_MINIMAL_POST_PROCESSING) != 0);

    getAutofillClientController().onActivityAttached(application);
    setContentCaptureOptions(application.getContentCaptureOptions());
}
```

#### Instrumentation#callActivityOnCreate()

```java
public void callActivityOnCreate(Activity activity, Bundle icicle) {
    prePerformCreate(activity);
    // 调用Activity#performCreate()
    activity.performCreate(icicle);
    postPerformCreate(activity);
}
```

说明：

- Activity 执行create流程。
- 接着调用 performCreate()。

#### Activity#performCreate()

```java
final void performCreate(Bundle icicle) {
  performCreate(icicle, null);
}

final void performCreate(Bundle icicle, PersistableBundle persistentState) {    
  // 回调Activity#onCreate()
  if (persistentState != null) {
    onCreate(icicle, persistentState);
  } else {
    onCreate(icicle);
  }
  // Fragment分发生命周期
  mFragments.dispatchActivityCreated();
}
```

说明：

- 到此 Activity 已经被创建并启动。
- 执行了 onCreate() 方法，
- 在 onCreate() 中可以通过 setContentView() 设置布局。

### ActivityThread#handleStartActivity()

```java
public void handleStartActivity(ActivityClientRecord r,
        PendingTransactionActions pendingActions, ActivityOptions activityOptions) {
    final Activity activity = r.activity;
    if (!r.stopped) {
        throw new IllegalStateException("Can't start activity that is not stopped.");
    }
	// 如果Activity被finish直接return
    if (r.activity.mFinished) {
        return;
    }

    unscheduleGcIdler();
    if (activityOptions != null) {
        activity.mPendingOptions = activityOptions;
    }

    // 调用Activity#performStart()
    activity.performStart("handleStartActivity");
    // 生命周期状态设置为ON_START
    r.setState(ON_START);

    // 最终会调用Activity#onRestoreInstanceState()
    if (pendingActions.shouldRestoreInstanceState()) {
        if (r.isPersistable()) {
            if (r.state != null || r.persistentState != null) {
                mInstrumentation.callActivityOnRestoreInstanceState(activity, r.state,
                        r.persistentState);
            }
        } else if (r.state != null) {
            mInstrumentation.callActivityOnRestoreInstanceState(activity, r.state);
        }
    }

    // 可见状态
    updateVisibility(r, true);
    mSomeActivitiesChanged = true;
}
```

说明：

- 调用 performStart()，最终会调用 Activity#onStart()。
- 将生命周期状态设置为 ON_START。
- 最终调用 Activity#onRestoreInstanceState()。

### ActivityThread#handleResumeActivity()

```java
public void handleResumeActivity(ActivityClientRecord r, boolean finalStateRequest,
                                 boolean isForward, String reason) {
    unscheduleGcIdler();
    mSomeActivitiesChanged = true;

    // 如果是resume状态则直接return
    if (!performResumeActivity(r, finalStateRequest, reason)) {
        return;
    }

    final Activity a = r.activity;

    final int forwardBit = isForward
        ? WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION : 0;

    boolean willBeVisible = !a.mStartedActivity;
    if (!willBeVisible) {
        willBeVisible = ActivityClient.getInstance().willActivityBeVisible(
            a.getActivityToken());
    }
    if (r.window == null && !a.mFinished && willBeVisible) {
        // 获取PhoneWindow
        r.window = r.activity.getWindow();
        // 获取DecorView
        View decor = r.window.getDecorView();
        // DecorView设置为不可见
        decor.setVisibility(View.INVISIBLE);
        // 获取WindowManager
        ViewManager wm = a.getWindowManager();
        WindowManager.LayoutParams l = r.window.getAttributes();
        a.mDecor = decor;
        l.type = WindowManager.LayoutParams.TYPE_BASE_APPLICATION;
        l.softInputMode |= forwardBit;
        if (r.mPreserveWindow) {
            a.mWindowAdded = true;
            r.mPreserveWindow = false;
            ViewRootImpl impl = decor.getViewRootImpl();
            if (impl != null) {
                impl.notifyChildRebuilt();
            }
        }
        if (a.mVisibleFromClient) {
            if (!a.mWindowAdded) {
                a.mWindowAdded = true;
                // 将DecorView添加到Window中
                wm.addView(decor, l);
            } else {
                a.onWindowAttributesChanged(l);
            }
        }
    }
}
```

说明：

- 调用 performResumeActivity()，最终会执行 Activity#onResume()。
- 将 DecorView 添加到窗口中，最终显示布局。

#### ActivityThread#performResumeActivity()

```java
public boolean performResumeActivity(ActivityClientRecord r, boolean finalStateRequest,
                                     String reason) {
    // 如果Activity是finish状态，则直接return false
    if (r.activity.mFinished) {
        return false;
    }
    // 如果Activity是ON_RESUME状态，则直接return false
    if (r.getLifecycleState() == ON_RESUME) {
        return false;
    }
    try {
        // 最终会调用onResume()
        r.activity.performResume(r.startsNotResumed, reason)
        r.state = null;
        r.persistentState = null;
        // 设置Activity到状态为ON_RESUME
        r.setState(ON_RESUME);
        reportTopResumedActivityChanged(r, r.isTopResumedActivity, "topWhenResuming");
    } catch (Exception e) {
    }
    return true;
}
```

说明：

- 检查 Activity 到状态。
- 最终会执行 onResume()。



## 情况二：进程未启动

### ActivityTaskManagerService#startProcessAsync()

```java
void startProcessAsync(ActivityRecord activity, boolean knownToBeDead, boolean isTop, String hostingType) {
    try {
        // 发布消息以启动进程，以避免在ATMS锁保持的情况下调用AMS可能出现死锁。
        // 调用ActivityManagerInternal#startProcess()，这是一个抽象类
        final Message m = PooledLambda.obtainMessage(ActivityManagerInternal::startProcess,
                mAmInternal, activity.processName, activity.info.applicationInfo, knownToBeDead,
                isTop, hostingType, activity.intent.getComponent());
        mH.sendMessage(m);
    } finally {        
    }
}
```

说明：启动App进程。

### ActivityManagerInternal#startProcess()

```java
public abstract class ActivityManagerInternal {
    public abstract void startProcess(String processName, ApplicationInfo info,
                                      boolean knownToBeDead, boolean isTop, String hostingType, 													ComponentName hostingName);
}
```

说明：

- ActivityManagerInternal 是抽象类。
- 子类是 ActivityManagerService.LocalService。

###  ActivityManagerService.LocalService#startProcess()

```java
public void startProcess(String processName, ApplicationInfo info, boolean knownToBeDead,
        boolean isTop, String hostingType, ComponentName hostingName) {
    try { 
        synchronized (ActivityManagerService.this) { 
            // 开启一个新进程
            // 调用ActivityManagerService#startProcessLocked()
            startProcessLocked(processName, info, knownToBeDead, 0 /* intentFlags */,
                    new HostingRecord(hostingType, hostingName, isTop),
                    ZYGOTE_POLICY_FLAG_LATENCY_SENSITIVE, false /* allowWhileBooting */,
                    false /* isolated */);
        }
    } finally {    
    }
}
```

### ActivityManagerService#startProcessLocked()

```java
final ProcessRecord startProcessLocked(String processName,
        ApplicationInfo info, boolean knownToBeDead, int intentFlags,
        HostingRecord hostingRecord, int zygotePolicyFlags, boolean allowWhileBooting,
        boolean isolated) {
    return mProcessList.startProcessLocked(processName, info, knownToBeDead, intentFlags,
            hostingRecord, zygotePolicyFlags, allowWhileBooting, isolated, 0 /* isolatedUid */,
            false /* isSdkSandbox */, 0 /* sdkSandboxClientAppUid */,
            null /* sdkSandboxClientAppPackage */,
            null /* ABI override */, null /* entryPoint */,
            null /* entryPointArgs */, null /* crashHandler */);
}
```

###  ProcessList#startProcessLocked()

```java
@GuardedBy("mService")
ProcessRecord startProcessLocked(String processName, ApplicationInfo info,
        boolean knownToBeDead, int intentFlags, HostingRecord hostingRecord,
        int zygotePolicyFlags, boolean allowWhileBooting, boolean isolated, int isolatedUid,
        boolean isSdkSandbox, int sdkSandboxUid, String sdkSandboxClientAppPackage,
        String abiOverride, String entryPoint, String[] entryPointArgs, Runnable crashHandler) {
    
    final boolean success =
        startProcessLocked(app, hostingRecord, zygotePolicyFlags, abiOverride);
    return success ? app : null;
}
```

```java
boolean startProcessLocked(ProcessRecord app, HostingRecord hostingRecord,
        int zygotePolicyFlags, String abiOverride) {
    return startProcessLocked(app, hostingRecord, zygotePolicyFlags,
            false /* disableHiddenApiChecks */, false /* disableTestApiChecks */,
            abiOverride);
}
```

```java
boolean startProcessLocked(ProcessRecord app, HostingRecord hostingRecord,
        int zygotePolicyFlags, boolean disableHiddenApiChecks, boolean disableTestApiChecks,
        String abiOverride) {
    return startProcessLocked(hostingRecord, entryPoint, app, uid, gids,
                runtimeFlags, zygotePolicyFlags, mountExternal, seInfo, requiredAbi,
                instructionSet, invokeWith, startUptime, startElapsedTime);
}
```

```java
boolean startProcessLocked(HostingRecord hostingRecord, String entryPoint, ProcessRecord app,
        int uid, int[] gids, int runtimeFlags, int zygotePolicyFlags, int mountExternal,
        String seInfo, String requiredAbi, String instructionSet, String invokeWith,
        long startUptime, long startElapsedTime) {
    // 调用ProcessList#startProcess()
    final Process.ProcessStartResult startResult = startProcess(hostingRecord,
                    entryPoint, app,
                    uid, gids, runtimeFlags, zygotePolicyFlags, mountExternal, seInfo,
                    requiredAbi, instructionSet, invokeWith, startUptime);
    handleProcessStartedLocked(app, startResult.pid, startResult.usingWrapper,
                    startSeq, false);
}
```

### ProcessList#startProcess()

```java
private Process.ProcessStartResult startProcess(HostingRecord hostingRecord, String entryPoint,
        ProcessRecord app, int uid, int[] gids, int runtimeFlags, int zygotePolicyFlags,
        int mountExternal, String seInfo, String requiredAbi, String instructionSet,
        String invokeWith, long startTime) {
    try {      
        final Process.ProcessStartResult startResult;
        boolean regularZygote = false;
        if (hostingRecord.usesWebviewZygote()) {
            // 从WebView Zygote中产生
            startResult = startWebView(entryPoint,
                    app.processName, uid, uid, gids, runtimeFlags, mountExternal,
                    app.info.targetSdkVersion, seInfo, requiredAbi, instructionSet,
                    app.info.dataDir, null, app.info.packageName,
                    app.getDisabledCompatChanges(),
                    new String[]{PROC_START_SEQ_IDENT + app.getStartSeq()});
        } else if (hostingRecord.usesAppZygote()) {
            // 从Zygote进程中生成
            final AppZygote appZygote = createAppZygoteForProcessIfNeeded(app);
            // 调用ZygoteProcess#start()
            startResult = appZygote.getProcess().start(entryPoint,
                    app.processName, uid, uid, gids, runtimeFlags, mountExternal,
                    app.info.targetSdkVersion, seInfo, requiredAbi, instructionSet,
                    app.info.dataDir, null, app.info.packageName,
                    /*zygotePolicyFlags=*/ ZYGOTE_POLICY_FLAG_EMPTY, isTopApp,
                    app.getDisabledCompatChanges(), pkgDataInfoMap, allowlistedAppDataInfoMap,
                    false, false,
                    new String[]{PROC_START_SEQ_IDENT + app.getStartSeq()});
        } else {
            regularZygote = true;
            startResult = Process.start(entryPoint,
                    app.processName, uid, uid, gids, runtimeFlags, mountExternal,
                    app.info.targetSdkVersion, seInfo, requiredAbi, instructionSet,
                    app.info.dataDir, invokeWith, app.info.packageName, zygotePolicyFlags,
                    isTopApp, app.getDisabledCompatChanges(), pkgDataInfoMap,
                    allowlistedAppDataInfoMap, bindMountAppsData, bindMountAppStorageDirs,
                    new String[]{PROC_START_SEQ_IDENT + app.getStartSeq()});
        }
        return startResult;
    } 
}
```

### ZygoteProcess#start()

```java
public final Process.ProcessStartResult start(@NonNull final String processClass,
                                              final String niceName,
                                              int uid, int gid, @Nullable int[] gids,
                                              int runtimeFlags, int mountExternal,
                                              int targetSdkVersion,
                                              @Nullable String seInfo,
                                              @NonNull String abi,
                                              @Nullable String instructionSet,
                                              @Nullable String appDataDir,
                                              @Nullable String invokeWith,
                                              @Nullable String packageName,
                                              int zygotePolicyFlags,
                                              boolean isTopApp,
                                              @Nullable long[] disabledCompatChanges,
                                              @Nullable Map<String, Pair<String, Long>>
                                                      pkgDataInfoMap,
                                              @Nullable Map<String, Pair<String, Long>>
                                                      allowlistedDataInfoList,
                                              boolean bindMountAppsData,
                                              boolean bindMountAppStorageDirs,
                                              @Nullable String[] zygoteArgs) {
     return startViaZygote(processClass, niceName, uid, gid, gids,
                runtimeFlags, mountExternal, targetSdkVersion, seInfo,
                abi, instructionSet, appDataDir, invokeWith, /*startChildZygote=*/ false,
                packageName, zygotePolicyFlags, isTopApp, disabledCompatChanges,
                pkgDataInfoMap, allowlistedDataInfoList, bindMountAppsData,
                bindMountAppStorageDirs, zygoteArgs);
}
```

### ZygoteProcess#startViaZygote()

```java
private Process.ProcessStartResult startViaZygote(@NonNull final String processClass,
                                                  @Nullable final String niceName,
                                                  final int uid, final int gid,
                                                  @Nullable final int[] gids,
                                                  int runtimeFlags, int mountExternal,
                                                  int targetSdkVersion,
                                                  @Nullable String seInfo,
                                                  @NonNull String abi,
                                                  @Nullable String instructionSet,
                                                  @Nullable String appDataDir,
                                                  @Nullable String invokeWith,
                                                  boolean startChildZygote,
                                                  @Nullable String packageName,
                                                  int zygotePolicyFlags,
                                                  boolean isTopApp,
                                                  @Nullable long[] disabledCompatChanges,
                                                  @Nullable Map<String, Pair<String, Long>>
                                                          pkgDataInfoMap,
                                                  @Nullable Map<String, Pair<String, Long>>
                                                          allowlistedDataInfoList,
                                                  boolean bindMountAppsData,
                                                  boolean bindMountAppStorageDirs,
                                                  @Nullable String[] extraArgs)
                                                  throws ZygoteStartFailedEx { 

    synchronized(mLock) { 
        // 依次调用ZygoteProcess#openZygoteSocketIfNeeded()
        // -> ZygoteProcess#zygoteSendArgsAndGetResult()
        return zygoteSendArgsAndGetResult(openZygoteSocketIfNeeded(abi),
                                          zygotePolicyFlags,
                                          argsForZygote);
    }
}
```

说明：

- openZygoteSocketIfNeeded()：尝试打开 Socket。
- zygoteSendArgsAndGetResult()：发送消息。

### ZygoteProcess#zygoteSendArgsAndGetResult()

```java
private Process.ProcessStartResult zygoteSendArgsAndGetResult(
        ZygoteState zygoteState, int zygotePolicyFlags, @NonNull ArrayList<String> args)
        throws ZygoteStartFailedEx {
    String msgStr = args.size() + "\n" + String.join("\n", args) + "\n"; 
    return attemptZygoteSendArgsAndGetResult(zygoteState, msgStr);
}
```

#### ZygoteProcess#attemptZygoteSendArgsAndGetResult()

```java
private Process.ProcessStartResult attemptZygoteSendArgsAndGetResult(
        ZygoteState zygoteState, String msgStr) throws ZygoteStartFailedEx {
    try {
        final BufferedWriter zygoteWriter = zygoteState.mZygoteOutputWriter;
        final DataInputStream zygoteInputStream = zygoteState.mZygoteInputStream;
        zygoteWriter.write(msgStr);
        zygoteWriter.flush(); 
        Process.ProcessStartResult result = new Process.ProcessStartResult();
        result.pid = zygoteInputStream.readInt();
        result.usingWrapper = zygoteInputStream.readBoolean();
        if (result.pid < 0) {
            throw new ZygoteStartFailedEx("fork() failed");
        }
        return result;
    } catch (IOException ex) {
        zygoteState.close();
        throw new ZygoteStartFailedEx(ex);
    }
}
```

说明：

- 通过 Scoket 方式调用 Zygote 进程。

### ZygoteInit#main()

```java
public static void main(String[] argv){
    caller = zygoteServer.runSelectLoop(abiList);
    if (caller != null) {
        caller.run();
    }
}
```

说明：

- 从 Zygote 进程中fork出新App进程。

#### ZygoteServer#runSelectLoop()

```java
Runnable runSelectLoop(String abiList) {
    ZygoteConnection connection = peers.get(pollIndex);
    final Runnable command = connection.processOneCommand(this)
}
```

说明；

- 运行 Zygote 进程，fork 出子进程。

#### ZygoteConnection#processCommand()

```java
Runnable processCommand(ZygoteServer zygoteServer, boolean multipleOK) {
    // fork操作
    if (parsedArgs.mInvokeWith != null || parsedArgs.mStartChildZygote
        || !multipleOK || peer.getUid() != Process.SYSTEM_UID) {
        // 调用Zygote#forkAndSpecialize()
        pid = Zygote.forkAndSpecialize(parsedArgs.mUid, parsedArgs.mGid,
                                       parsedArgs.mGids, parsedArgs.mRuntimeFlags, rlimits,
                                       parsedArgs.mMountExternal, parsedArgs.mSeInfo, parsedArgs.mNiceName,
                                       fdsToClose, fdsToIgnore, parsedArgs.mStartChildZygote,
                                       parsedArgs.mInstructionSet, parsedArgs.mAppDataDir,
                                       parsedArgs.mIsTopApp, parsedArgs.mPkgDataInfoList,
                                       parsedArgs.mAllowlistedDataInfoList, 									   								   parsedArgs.mBindMountAppDataDirs,
                                       parsedArgs.mBindMountAppStorageDirs);
        try {
            if (pid == 0) {
                zygoteServer.setForkChild();
                zygoteServer.closeServerSocket();
                IoUtils.closeQuietly(serverPipeFd);
                serverPipeFd = null;
                // 调用ZygoteConnection#handleChildProc()
                return handleChildProc(parsedArgs, childPipeFd,
                                       parsedArgs.mStartChildZygote);
            } else {
                IoUtils.closeQuietly(childPipeFd);
                childPipeFd = null;               
                handleParentProc(pid, serverPipeFd);
                return null;
            }
        } finally {
            IoUtils.closeQuietly(childPipeFd);
            IoUtils.closeQuietly(serverPipeFd);
        }
    } else {
        ZygoteHooks.preFork();
        Runnable result = Zygote.forkSimpleApps(argBuffer,
                                                zygoteServer.getZygoteSocketFileDescriptor(),
                                                peer.getUid(), Zygote.minChildUid(peer), 																	parsedArgs.mNiceName);
        if (result == null) {
            ZygoteHooks.postForkCommon();
            continue;
        } else {
            zygoteServer.setForkChild();
            Zygote.setAppProcessName(parsedArgs, TAG);
            return result;
        }
    }
}
```

说明：fork出新的App进程。

#### Zygote#forkAndSpecialize()

```java
static int forkAndSpecialize(int uid, int gid, int[] gids, int runtimeFlags,
        int[][] rlimits, int mountExternal, String seInfo, String niceName, int[] fdsToClose,
        int[] fdsToIgnore, boolean startChildZygote, String instructionSet, String appDataDir,
        boolean isTopApp, String[] pkgDataInfoList, String[] allowlistedDataInfoList,
        boolean bindMountAppDataDirs, boolean bindMountAppStorageDirs) {
    ZygoteHooks.preFork();

    int pid = nativeForkAndSpecialize(
            uid, gid, gids, runtimeFlags, rlimits, mountExternal, seInfo, niceName, fdsToClose,
            fdsToIgnore, startChildZygote, instructionSet, appDataDir, isTopApp,
            pkgDataInfoList, allowlistedDataInfoList, bindMountAppDataDirs,
            bindMountAppStorageDirs);
    if (pid == 0) {
        // Note that this event ends at the end of handleChildProc,
        Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "PostFork");

        // If no GIDs were specified, don't make any permissions changes based on groups.
        if (gids != null && gids.length > 0) {
            NetworkUtilsInternal.setAllowNetworkingForProcess(containsInetGid(gids));
        }
    }

    // Set the Java Language thread priority to the default value for new apps.
    Thread.currentThread().setPriority(Thread.NORM_PRIORITY);

    ZygoteHooks.postForkCommon();
    return pid;
}
```

#### ZygoteConnection#handleChildProc()

```java
private Runnable handleChildProc(ZygoteArguments parsedArgs,
        FileDescriptor pipeFd, boolean isZygote) {
    closeSocket();
    Zygote.setAppProcessName(parsedArgs, TAG);
    // End of the postFork event.
    Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
    if (parsedArgs.mInvokeWith != null) {
        WrapperInit.execApplication(parsedArgs.mInvokeWith,
                parsedArgs.mNiceName, parsedArgs.mTargetSdkVersion,
                VMRuntime.getCurrentInstructionSet(),
                pipeFd, parsedArgs.mRemainingArgs);
        throw new IllegalStateException("WrapperInit.execApplication unexpectedly returned");
    } else {
        if (!isZygote) {
            return ZygoteInit.zygoteInit(parsedArgs.mTargetSdkVersion,
                    parsedArgs.mDisabledCompatChanges,
                    parsedArgs.mRemainingArgs, null /* classLoader */);
        } else {
            // 调用ZygoteInit#childZygoteInit()
            return ZygoteInit.childZygoteInit(
                    parsedArgs.mRemainingArgs  /* classLoader */);
        }
    }
}
```

#### ZygoteInit#childZygoteInit()

```java
static Runnable childZygoteInit(String[] argv) {
    RuntimeInit.Arguments args = new RuntimeInit.Arguments(argv);
    return RuntimeInit.findStaticMain(args.startClass, args.startArgs, /* classLoader= */null);
}
```

#### RuntimeInit#findStaticMain()

```java
protected static Runnable findStaticMain(String className, String[] argv,
        ClassLoader classLoader) {
    Class<?> cl;

    try {
        cl = Class.forName(className, true, classLoader);
    } catch (ClassNotFoundException ex) {
        throw new RuntimeException(
                "Missing class when invoking static main " + className,
                ex);
    }

    Method m;
    try {
        // 通过反射获取main方法
        m = cl.getMethod("main", new Class[] { String[].class });
    }

    int modifiers = m.getModifiers();
    if (! (Modifier.isStatic(modifiers) && Modifier.isPublic(modifiers))) {
        throw new RuntimeException(
                "Main method is not public and static on " + className);
    }
    return new MethodAndArgsCaller(m, argv);
}
```

说明：

- 通过反射获取 main() 方法并执行。

### ActivityThread#main()

```java
public static void main(String[] args) {   
    Looper.prepareMainLooper();
    ActivityThread thread = new ActivityThread();
    // 调用ActivityThread#attach()
    thread.attach(false, startSeq);
    if (sMainThreadHandler == null) {
        sMainThreadHandler = thread.getHandler();
    }
    Looper.loop();
    throw new RuntimeException("Main thread loop unexpectedly exited");
}
```

### ActivityThread#attach()

```java
private void attach(boolean system, long startSeq) {
    sCurrentActivityThread = this;
    mConfigurationController = new ConfigurationController(this);
    mSystemThread = system;
    if (!system) {
        android.ddm.DdmHandleAppName.setAppName("<pre-initialized>",
                                                UserHandle.myUserId());
        RuntimeInit.setApplicationObject(mAppThread.asBinder());
        final IActivityManager mgr = ActivityManager.getService();
        try {
            // 调用ActivityManagerService#attachApplication()
            mgr.attachApplication(mAppThread, startSeq);
        } catch (RemoteException ex) {
            throw ex.rethrowFromSystemServer();
        }
       
        BinderInternal.addGcWatcher(new Runnable() {
            @Override public void run() {
                if (!mSomeActivitiesChanged) {
                    return;
                }
                Runtime runtime = Runtime.getRuntime();
                long dalvikMax = runtime.maxMemory();
                long dalvikUsed = runtime.totalMemory() - runtime.freeMemory();
                if (dalvikUsed > ((3*dalvikMax)/4)) {
                    if (DEBUG_MEMORY_TRIM) Slog.d(TAG, "Dalvik max=" + (dalvikMax/1024)
                                                  + " total=" + (runtime.totalMemory()/1024)
                                                  + " used=" + (dalvikUsed/1024));
                    mSomeActivitiesChanged = false;
                    try {
                        ActivityTaskManager.getService().releaseSomeActivities(mAppThread);
                    } catch (RemoteException e) {
                        throw e.rethrowFromSystemServer();
                    }
                }
            }
        });
    } else {
        android.ddm.DdmHandleAppName.setAppName("system_process",
                                                UserHandle.myUserId());
        try {
            mInstrumentation = new Instrumentation();
            mInstrumentation.basicInit(this);
            ContextImpl context = ContextImpl.createAppContext(
                this, getSystemContext().mPackageInfo);
            mInitialApplication = context.mPackageInfo.makeApplicationInner(true, null);
            mInitialApplication.onCreate();
        } catch (Exception e) {
          
        }
    }

    ViewRootImpl.addConfigCallback(configChangedCallback);
}
```

说明：

- 调用 ActivityManagerService#attachApplication() 向 AMS 通知进程已经启动。

### ActivityManagerService#attachApplication()

```java
public final void attachApplication(IApplicationThread thread, long startSeq) {
    if (thread == null) {
        throw new SecurityException("Invalid application interface");
    }
    synchronized (this) {
        int callingPid = Binder.getCallingPid();
        final int callingUid = Binder.getCallingUid();
        final long origId = Binder.clearCallingIdentity();
        // 调用ActivityManagerService#attachApplicationLocked()
        attachApplicationLocked(thread, callingPid, callingUid, startSeq);
        Binder.restoreCallingIdentity(origId);
    }
}
```

### ActivityManagerService#attachApplicationLocked()

```java
private boolean attachApplicationLocked(@NonNull IApplicationThread thread,
                                        int pid, int callingUid, long startSeq) {
    synchronized (mProcLock) {
        app.mState.setCurAdj(ProcessList.INVALID_ADJ);
        app.mState.setSetAdj(ProcessList.INVALID_ADJ);
        app.mState.setVerifiedAdj(ProcessList.INVALID_ADJ);
        mOomAdjuster.setAttachingSchedGroupLSP(app);
        app.mState.setForcingToImportant(null);
        updateProcessForegroundLocked(app, false, 0, false);
        app.mState.setHasShownUi(false);
        app.mState.setCached(false);
        app.setDebugging(false);
        app.setKilledByAm(false);
        app.setKilled(false);
        app.setUnlocked(StorageManager.isUserKeyUnlocked(app.userId));
    }
    // 移除进程超时信息
    mHandler.removeMessages(PROC_START_TIMEOUT_MSG, app);

    final ProviderInfoList providerList = ProviderInfoList.fromList(providers);
    if (app.getIsolatedEntryPoint() != null) {
        thread.runIsolatedEntryPoint(
            app.getIsolatedEntryPoint(), app.getIsolatedEntryPointArgs());
    } else if (instr2 != null) {
        thread.bindApplication(processName, appInfo,
                               app.sdkSandboxClientAppVolumeUuid, app.sdkSandboxClientAppPackage,
                               providerList,
                               instr2.mClass,
                               profilerInfo, instr2.mArguments,
                               instr2.mWatcher,
                               instr2.mUiAutomationConnection, testMode,
                               mBinderTransactionTrackingEnabled, enableTrackAllocation,
                               isRestrictedBackupMode || !normalMode, app.isPersistent(),
                               new Configuration(app.getWindowProcessController().getConfiguration()),
                               app.getCompat(), getCommonServicesLocked(app.isolated),
                               mCoreSettingsObserver.getCoreSettingsLocked(),
                               buildSerial, autofillOptions, contentCaptureOptions,
                               app.getDisabledCompatChanges(), serializedSystemFontMap,
                               app.getStartElapsedTime(), app.getStartUptime());
    } else {
        thread.bindApplication(processName, appInfo,
                               app.sdkSandboxClientAppVolumeUuid, app.sdkSandboxClientAppPackage,
                               providerList, null, profilerInfo, null, null, null, testMode,
                               mBinderTransactionTrackingEnabled, enableTrackAllocation,
                               isRestrictedBackupMode || !normalMode, app.isPersistent(),
                               new Configuration(app.getWindowProcessController().getConfiguration()),
                               app.getCompat(), getCommonServicesLocked(app.isolated),
                               mCoreSettingsObserver.getCoreSettingsLocked(),
                               buildSerial, autofillOptions, contentCaptureOptions,
                               app.getDisabledCompatChanges(), serializedSystemFontMap,
                               app.getStartElapsedTime(), app.getStartUptime());
    }

    if (normalMode) {
        try {
            // 最终调用ActivityTaskManagerService.LocalService#attachApplication()
            didSomething = mAtmInternal.attachApplication(app.getWindowProcessController());
        } catch (Exception e) {
        }
    }

    return true;
}
```

说明：

- thread 是 ApplicationThread 的实例。
- ApplicationThread 是 ActivityThread 的内部类。
- mAtmInternal 是 ActivityTaskManagerService.LocalService 的实例。

### ApplicationThread#bindApplication()

```java
public final void bindApplication(String processName, ApplicationInfo appInfo,
        String sdkSandboxClientAppVolumeUuid, String sdkSandboxClientAppPackage,
        ProviderInfoList providerList, ComponentName instrumentationName,
        ProfilerInfo profilerInfo, Bundle instrumentationArgs,
        IInstrumentationWatcher instrumentationWatcher,
        IUiAutomationConnection instrumentationUiConnection, int debugMode,
        boolean enableBinderTracking, boolean trackAllocation,
        boolean isRestrictedBackupMode, boolean persistent, Configuration config,
        CompatibilityInfo compatInfo, Map services, Bundle coreSettings,
        String buildSerial, AutofillOptions autofillOptions,
        ContentCaptureOptions contentCaptureOptions, long[] disabledCompatChanges,
        SharedMemory serializedSystemFontMap,
        long startRequestedElapsedTime, long startRequestedUptime) {   

    AppBindData data = new AppBindData();
    data.processName = processName;
    data.appInfo = appInfo;
    data.sdkSandboxClientAppVolumeUuid = sdkSandboxClientAppVolumeUuid;
    data.sdkSandboxClientAppPackage = sdkSandboxClientAppPackage;
    data.providers = providerList.getList();
    data.instrumentationName = instrumentationName;
    data.instrumentationArgs = instrumentationArgs;
    data.instrumentationWatcher = instrumentationWatcher;
    data.instrumentationUiAutomationConnection = instrumentationUiConnection;
    data.debugMode = debugMode;
    data.enableBinderTracking = enableBinderTracking;
    data.trackAllocation = trackAllocation;
    data.restrictedBackupMode = isRestrictedBackupMode;
    data.persistent = persistent;
    data.config = config;
    data.compatInfo = compatInfo;
    data.initProfilerInfo = profilerInfo;
    data.buildSerial = buildSerial;
    data.autofillOptions = autofillOptions;
    data.contentCaptureOptions = contentCaptureOptions;
    data.disabledCompatChanges = disabledCompatChanges;
    data.mSerializedSystemFontMap = serializedSystemFontMap;
    data.startRequestedElapsedTime = startRequestedElapsedTime;
    data.startRequestedUptime = startRequestedUptime;
    sendMessage(H.BIND_APPLICATION, data);
}
```

说明：

- 发送 BIND_APPLICATION 消息。
- 在 H 类中接收数据

### ActivityThread.H#handleMessage()

```java
public void handleMessage(Message msg) {
    switch (msg.what) {
        case BIND_APPLICATION:
            AppBindData data = (AppBindData)msg.obj;
            handleBindApplication(data);
            Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
            break;
    }
}
```

### ActivityThread#handleBindApplication()

```java
private void handleBindApplication(AppBindData data) {    
    // 初始化context
    final ContextImpl appContext = ContextImpl.createAppContext(this, data.info);       
    // 初始化Instrumentation
    if (ii != null) {
        initInstrumentation(ii, data, appContext);
    } else {
        mInstrumentation = new Instrumentation();
        mInstrumentation.basicInit(this);
    }    
    Application app; 
    try {
        // 初始化Application
        // 调用LoadedApk#makeApplicationInner()
        app = data.info.makeApplicationInner(data.restrictedBackupMode, null);           
        mInstrumentation.onCreate(data.instrumentationArgs);        
        // 回调Application#onCreate()
        mInstrumentation.callApplicationOnCreate(app);
    } finally {
    }
}
```

说明：

- 初始化 Context。
- 初始化 Instrumentation。
- 初始化 Application。
- 回调 Application#onCreate()。

#### LoadedApk#makeApplicationInner()

```java
public Application makeApplicationInner(boolean forceDefaultAppClass,
                                        Instrumentation instrumentation) {
    return makeApplicationInner(forceDefaultAppClass, instrumentation, false);
}

private Application makeApplicationInner(boolean forceDefaultAppClass,
                                         Instrumentation instrumentation, boolean allowDuplicateInstances) {
    if (mApplication != null) {
        return mApplication;
    }

    synchronized (sApplications) {
        final Application cached = sApplications.get(mPackageName);
        if (cached != null) {
            if (!allowDuplicateInstances) {
                mApplication = cached;
                return cached;
            }
        }
    }

    Application app = null;

    final String myProcessName = Process.myProcessName();
    String appClass = mApplicationInfo.getCustomApplicationClassNameForProcess(
        myProcessName);


    try {
        final java.lang.ClassLoader cl = getClassLoader();
        if (!mPackageName.equals("android")) { 
            initializeJavaContextClassLoader(); 
        }
        // 初始化Application的上下文
        ContextImpl appContext = ContextImpl.createAppContext(mActivityThread, this);
        // 创建Application实例
        app = mActivityThread.mInstrumentation.newApplication(
            cl, appClass, appContext);
        appContext.setOuterContext(app);
    } catch (Exception e) {
    }
    mActivityThread.mAllApplications.add(app);
    mApplication = app;
    if (!allowDuplicateInstances) {
        synchronized (sApplications) {
            sApplications.put(mPackageName, app);
        }
    }

    if (instrumentation != null) {
        try {
            // 回调Application#onCreate()
            instrumentation.callApplicationOnCreate(app);
        } catch (Exception e) {
        }
    }
    return app;
}
```

说明：

- 初始化 Application 的上下文。
- makeApplicationInner() 表示获取或创建 Application 实例。
- 回调 Application 的 onCreate()。

#### Instrumentation#newApplication()

```java
public Application newApplication(ClassLoader cl, String className, Context context)
        throws InstantiationException, IllegalAccessException, 
        ClassNotFoundException {
    Application app = getFactory(context.getPackageName())
            .instantiateApplication(cl, className);
    app.attach(context);
    return app;
}
```

#### Instrumentation#callApplicationOnCreate()

```java
public void callApplicationOnCreate(Application app) {
    app.onCreate();
}
```

### ActivityTaskManagerService.LocalService#attachApplication()

```java
public boolean attachApplication(WindowProcessController wpc) throws RemoteException {
    synchronized (mGlobalLockWithoutBoost) {
        try {
            // 调用RootWindowContainer#attachApplication()
            // 最终调用AttachApplicationHelper#test()
            return mRootWindowContainer.attachApplication(wpc);
        } finally {           
        }
    }
}
```

### RootWindowContainer.AttachApplicationHelper#test()

```java
public boolean test(ActivityRecord r) {
    if (r.finishing || !r.showToCurrentUser() || !r.visibleIgnoringKeyguard
            || r.app != null || mApp.mUid != r.info.applicationInfo.uid
            || !mApp.mName.equals(r.processName)) {
        return false;
    }

    try {
        // 调用ActivityTaskSupervisor#realStartActivityLocked()
        if (mTaskSupervisor.realStartActivityLocked(r, mApp,
                mTop == r && r.getTask().canBeResumed(r) /* andResume */,
                true /* checkConfig */)) {
            mHasActivityStarted = true;
        }
    } catch (RemoteException e) {
    }
    return false;
}
```

说明：

- 最终调用 ActivityTaskSupervisor#realStartActivityLocked()。
- 执行 Activity 的启动流程（情况一，进程已启动流程）。

### ActivityTaskSupervisor#realStartActivityLocked()



## 资料

https://blog.csdn.net/ss520k/article/details/129147496

https://blog.csdn.net/ss520k/article/details/129147496

https://juejin.cn/user/1116759543786040/posts

https://juejin.cn/post/7211801284709548093

