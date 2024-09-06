[toc]

# Android SystemServer启动流程

## 概述

SystemServer 是 Android 系统 Java 层最重要的进程之一，几乎所有的 Java 层 Binder 服务都运行在这个进程里。

SystemServer 的启动大致可分为两个阶段：

- 在 Zygote 进程中调用 fork 系统调用创建 SystemServer 进程。
- 执行 SystemServer 类的 main 方法来启动系统服务。



## 流程图

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1bfa70d2ffee4ca9b98cd475449b2c69.png)



## 源码分析

### 创建SystemServer进程

```java
// ZygoteInit类
public static void main(String argv[]) {   
    if (startSystemServer) {
        // fork出SystemServer进程
        Runnable r = forkSystemServer(abiList, zygoteSocketName, zygoteServer);

        if (r != null) {
            r.run();
            return;
        }
    }
}
```

```java
// ZygoteInit类
private static Runnable forkSystemServer(String abiList, String socketName, ZygoteServer zygoteServer) {  
    String args[] = {
            "--setuid=1000",
            "--setgid=1000",
            "--setgroups=1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1018,1021,1023,"
                    + "1024,1032,1065,3001,3002,3003,3006,3007,3009,3010,3011",
            "--capabilities=" + capabilities + "," + capabilities,
            "--nice-name=system_server",
            "--runtime-args",
            "--target-sdk-version=" + VMRuntime.SDK_VERSION_CUR_DEVELOPMENT,
            "com.android.server.SystemServer",
    };
    ZygoteArguments parsedArgs = null;

    int pid;

    try {
        parsedArgs = new ZygoteArguments(args);
        Zygote.applyDebuggerSystemProperty(parsedArgs);
        Zygote.applyInvokeWithSystemProperty(parsedArgs);

        if (Zygote.nativeSupportsTaggedPointers()) { 
            parsedArgs.mRuntimeFlags |= Zygote.MEMORY_TAG_LEVEL_TBI;
        } 
        parsedArgs.mRuntimeFlags |= Zygote.GWP_ASAN_LEVEL_LOTTERY;

        if (shouldProfileSystemServer()) {
            parsedArgs.mRuntimeFlags |= Zygote.PROFILE_SYSTEM_SERVER;
        }

        // 最终调用Zygote.forkSystemServer()
         pid = Zygote.forkSystemServer(
                parsedArgs.mUid, parsedArgs.mGid,
                parsedArgs.mGids,
                parsedArgs.mRuntimeFlags,
                null,
                parsedArgs.mPermittedCapabilities,
                parsedArgs.mEffectiveCapabilities);
    } catch (IllegalArgumentException ex) {
        throw new RuntimeException(ex);
    }

    /* For child process */
    if (pid == 0) {
        if (hasSecondZygote(abiList)) {
            waitForSecondaryZygote(socketName);
        }

        zygoteServer.closeServerSocket();
        // 处理SystemServer
        return handleSystemServerProcess(parsedArgs);
    }

    return null;
}
```

```java
// Zygote类
static int forkSystemServer(int uid, int gid, int[] gids, int runtimeFlags,
                            int[][] rlimits, long permittedCapabilities, long effectiveCapabilities) {
    ZygoteHooks.preFork();
    // nativeForkSystemServer()是native方法
    int pid = nativeForkSystemServer(
        uid, gid, gids, runtimeFlags, rlimits,
        permittedCapabilities, effectiveCapabilities);
    Thread.currentThread().setPriority(Thread.NORM_PRIORITY);
    ZygoteHooks.postForkCommon();
    return pid;
}
```

ZygoteInit#forkSystemServer() 最终调用 Zygote#forkSystemServer() 创建 SystemServer 进程。

SystemServer 进程的id 为1000，进程名为 system_server。

### 启动SystemServer进程

```java
// ZygoteInit类
private static Runnable handleSystemServerProcess(ZygoteArguments parsedArgs) {
	// 设置umask为0077，保证SystemServer只有权限
    Os.umask(S_IRWXG | S_IRWXO);
    
	// 设置进程名
    if (parsedArgs.mNiceName != null) {
        Process.setArgV0(parsedArgs.mNiceName);
    }

    // 设置classpath
    final String systemServerClasspath = Os.getenv("SYSTEMSERVERCLASSPATH");
    if (systemServerClasspath != null) {
        performSystemServerDexOpt(systemServerClasspath);
        if (shouldProfileSystemServer() && (Build.IS_USERDEBUG || Build.IS_ENG)) {
            try {
                Log.d(TAG, "Preparing system server profile");
                prepareSystemServerProfile(systemServerClasspath);
            } catch (Exception e) {
                Log.wtf(TAG, "Failed to set up system server profile", e);
            }
        }
    }

    if (parsedArgs.mInvokeWith != null) {
        String[] args = parsedArgs.mRemainingArgs;
        if (systemServerClasspath != null) {
            String[] amendedArgs = new String[args.length + 2];
            amendedArgs[0] = "-cp";
            amendedArgs[1] = systemServerClasspath;
            System.arraycopy(args, 0, amendedArgs, 2, args.length);
            args = amendedArgs;
        }

        WrapperInit.execApplication(parsedArgs.mInvokeWith,
                parsedArgs.mNiceName, parsedArgs.mTargetSdkVersion,
                VMRuntime.getCurrentInstructionSet(), null, args);

        throw new IllegalStateException("Unexpected return from WrapperInit.execApplication");
    } else {
        ClassLoader cl = null;
        if (systemServerClasspath != null) {
            // 创建ClassLoader
            cl = createPathClassLoader(systemServerClasspath, parsedArgs.mTargetSdkVersion);
            Thread.currentThread().setContextClassLoader(cl);
        }
		// 查找main()方法，调用ZygoteInit#zygoteInit()
        return ZygoteInit.zygoteInit(parsedArgs.mTargetSdkVersion,
                parsedArgs.mDisabledCompatChanges,
                parsedArgs.mRemainingArgs, cl);
    }
}
```

说明：这里主要做一些配置工作。

```java
// ZygoteInit类
public static final Runnable zygoteInit(int targetSdkVersion, long[] disabledCompatChanges,
        String[] argv, ClassLoader classLoader) {
    if (RuntimeInit.DEBUG) {
        Slog.d(RuntimeInit.TAG, "RuntimeInit: Starting application from zygote");
    }

    Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "ZygoteInit");
    RuntimeInit.redirectLogStreams();

    RuntimeInit.commonInit();
    ZygoteInit.nativeZygoteInit();
    // 调用RuntimeInit#applicationInit()
    return RuntimeInit.applicationInit(targetSdkVersion, disabledCompatChanges, argv,
            classLoader);
}
```

```java
// RuntimeInit类
protected static Runnable applicationInit(int targetSdkVersion, long[] disabledCompatChanges,
        String[] argv, ClassLoader classLoader) {
    nativeSetExitWithoutCleanup(true);

    VMRuntime.getRuntime().setTargetSdkVersion(targetSdkVersion);
    VMRuntime.getRuntime().setDisabledCompatChanges(disabledCompatChanges);

    final Arguments args = new Arguments(argv);

    Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
	// 调用RuntimeInit#findStaticMain()查找main()方法
    return findStaticMain(args.startClass, args.startArgs, classLoader);
}
```

说明：

- 设置当前 SDKVersion
- 调用 RuntimeInit#findStaticMain() 查找main 方法。

```java
// RuntimeInit类
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
        m = cl.getMethod("main", new Class[] { String[].class });
    } catch (NoSuchMethodException ex) {
        throw new RuntimeException(
                "Missing static main on " + className, ex);
    } catch (SecurityException ex) {
        throw new RuntimeException(
                "Problem getting static main on " + className, ex);
    }

    int modifiers = m.getModifiers();
    if (! (Modifier.isStatic(modifiers) && Modifier.isPublic(modifiers))) {
        throw new RuntimeException(
                "Main method is not public and static on " + className);
    }    
    return new MethodAndArgsCaller(m, argv);
}
```

说明：通过反射获取 main 方法，包装为 Runnable 对象并返回。

```java
// ZygoteInit类
Runnable r = forkSystemServer(abiList, zygoteSocketName, zygoteServer);

if (r != null) {
    r.run();
    return;
}
```

说明：执行 main 方法。

### SystemServer#main()

```java
// SystemServer类
public static void main(String[] args) {
    new SystemServer().run();
}
```

### SystemServer#run()

```java
// SystemServer类
private void run() {
    TimingsTraceAndSlog t = new TimingsTraceAndSlog();
    try {
        t.traceBegin("InitBeforeStartServices");

        SystemProperties.set(SYSPROP_START_COUNT, String.valueOf(mStartCount));
        SystemProperties.set(SYSPROP_START_ELAPSED, String.valueOf(mRuntimeStartElapsedTime));
        SystemProperties.set(SYSPROP_START_UPTIME, String.valueOf(mRuntimeStartUptime));

        EventLog.writeEvent(EventLogTags.SYSTEM_SERVER_START,
                mStartCount, mRuntimeStartUptime, mRuntimeStartElapsedTime);

        // 设置系统属性，如：设置时区、语言、国家
        String timezoneProperty = SystemProperties.get("persist.sys.timezone");
        if (timezoneProperty == null || timezoneProperty.isEmpty()) {
            Slog.w(TAG, "Timezone not set; setting to GMT.");
            SystemProperties.set("persist.sys.timezone", "GMT");
        }               
        if (!SystemProperties.get("persist.sys.language").isEmpty()) {
            final String languageTag = Locale.getDefault().toLanguageTag();
            SystemProperties.set("persist.sys.locale", languageTag);
            SystemProperties.set("persist.sys.language", "");
            SystemProperties.set("persist.sys.country", "");
            SystemProperties.set("persist.sys.localevar", "");
        }

        // 设置Binder、Sqlite属性
        Binder.setWarnOnBlocking(true);
        PackageItemInfo.forceSafeLabels();
        SQLiteGlobal.sDefaultSyncMode = SQLiteGlobal.SYNC_MODE_FULL;
        SQLiteCompatibilityWalFlags.init(null);
 
        Slog.i(TAG, "Entered the Android system server!");
        final long uptimeMillis = SystemClock.elapsedRealtime();
        EventLog.writeEvent(EventLogTags.BOOT_PROGRESS_SYSTEM_RUN, uptimeMillis);
        if (!mRuntimeRestart) {
            FrameworkStatsLog.write(FrameworkStatsLog.BOOT_TIME_EVENT_ELAPSED_TIME_REPORTED,
                    FrameworkStatsLog
                            .BOOT_TIME_EVENT_ELAPSED_TIME__EVENT__SYSTEM_SERVER_INIT_START,
                    uptimeMillis);
        } 
        
        // 设置虚拟机的运行库路径
        SystemProperties.set("persist.sys.dalvik.vm.lib.2", VMRuntime.getRuntime().vmLibrary());
 
        // 调整虚拟机
        VMRuntime.getRuntime().clearGrowthLimit(); 
        Build.ensureFingerprintProperty(); 
        Environment.setUserRequired(true); 
        BaseBundle.setShouldDefuse(true); 
        Parcel.setStackTraceParceling(true); 
        BinderInternal.disableBackgroundScheduling(true); 
        BinderInternal.setMaxThreads(sMaxBinderThreads);
 
        // 设置线程相关属性
        android.os.Process.setThreadPriority(
                android.os.Process.THREAD_PRIORITY_FOREGROUND);
        android.os.Process.setCanSelfBackground(false);
        
        // 创建Looper
        Looper.prepareMainLooper();
        Looper.getMainLooper().setSlowLogThresholdMs(
                SLOW_DISPATCH_THRESHOLD_MS, SLOW_DELIVERY_THRESHOLD_MS);

        SystemServiceRegistry.sEnableServiceNotFoundWtf = true;
 
        // 加载
        System.loadLibrary("android_servers");
 
        initZygoteChildHeapProfiling();
 
        if (Build.IS_DEBUGGABLE) {
            spawnFdLeakCheckThread();
        }
 
        performPendingShutdown();
 
        // 创建系统context
        createSystemContext();
 
        ActivityThread.initializeMainlineModules();
 
        // 创建SystemServerManager
        mSystemServiceManager = new SystemServiceManager(mSystemContext);
        mSystemServiceManager.setStartInfo(mRuntimeRestart,
                                           mRuntimeStartElapsedTime, mRuntimeStartUptime);
        LocalServices.addService(SystemServiceManager.class, mSystemServiceManager);
        SystemServerInitThreadPool.start();
        if (Build.IS_DEBUGGABLE) {
             String jvmtiAgent = SystemProperties.get("persist.sys.dalvik.jvmtiagent");
            if (!jvmtiAgent.isEmpty()) {
                int equalIndex = jvmtiAgent.indexOf('=');
                String libraryPath = jvmtiAgent.substring(0, equalIndex);
                String parameterList =
                        jvmtiAgent.substring(equalIndex + 1, jvmtiAgent.length());
                try {
                    Debug.attachJvmtiAgent(libraryPath, parameterList, null);
                } catch (Exception e) {
                    Slog.e("System", "*************************************************");
                    Slog.e("System", "********** Failed to load jvmti plugin: " + jvmtiAgent);
                }
            }
        }
    } finally {
        t.traceEnd();  
    }

    RuntimeInit.setDefaultApplicationWtfHandler(SystemServer::handleEarlySystemWtf);

    // 启动一些列服务
    try {
        t.traceBegin("StartServices");
        startBootstrapServices(t); // 启动一些基础服务
        startCoreServices(t); // 启动一些核心服务
        startOtherServices(t);
    } catch (Throwable ex) {
        Slog.e("System", "******************************************");
        Slog.e("System", "************ Failure starting system services", ex);
        throw ex;
    } finally {
        t.traceEnd(); // StartServices
    }

    // ......

    Looper.loop();
    throw new RuntimeException("Main thread loop unexpectedly exited");
}
```

说明：

- SystemServer 启动前准备：
  - 设置系统时间、时区、语言。
  - 调整虚拟机运行库、内存参数、内存利用率。
  - 设置线程优先级。
  - 加载 libandroid_servies.so 库。
  - 创建 Looper 对象。
  - 创建 SystemContext、SystemServiceManager。
- 启动 SystemServer：
  - 依次执行 startBootstrapServices()、startCoreServices()、startOtherServices()。
  - 调用 Looper.loop() 处理消息。

### SystemServer#createSystemContext()

```java
// SystemServer类
private void createSystemContext() {
    ActivityThread activityThread = ActivityThread.systemMain();
    mSystemContext = activityThread.getSystemContext();
    mSystemContext.setTheme(DEFAULT_SYSTEM_THEME);

    final Context systemUiContext = activityThread.getSystemUiContext();
    systemUiContext.setTheme(DEFAULT_SYSTEM_THEME);
}
```

说明：

- 通过 ActivityThread.systemMain() 获取 ActivityThread 对象。
- 通过 getSystemContext() 获取 SystemContext。
- 设置默认主题。

### SystemServer#startBootstrapServices()

```java
// SystemServer类
private void startBootstrapServices(@NonNull TimingsTraceAndSlog t) {
    t.traceBegin("startBootstrapServices");

    // Start the watchdog as early as possible so we can crash the system server
    // if we deadlock during early boot
    t.traceBegin("StartWatchdog");
    final Watchdog watchdog = Watchdog.getInstance();
    watchdog.start();
    t.traceEnd();

    Slog.i(TAG, "Reading configuration...");
    final String TAG_SYSTEM_CONFIG = "ReadingSystemConfig";
    t.traceBegin(TAG_SYSTEM_CONFIG);
    SystemServerInitThreadPool.submit(SystemConfig::getInstance, TAG_SYSTEM_CONFIG);
    t.traceEnd();

    // Platform compat service is used by ActivityManagerService, PackageManagerService, and
    // possibly others in the future. b/135010838.
    t.traceBegin("PlatformCompat");
    PlatformCompat platformCompat = new PlatformCompat(mSystemContext);
    ServiceManager.addService(Context.PLATFORM_COMPAT_SERVICE, platformCompat);
    ServiceManager.addService(Context.PLATFORM_COMPAT_NATIVE_SERVICE,
            new PlatformCompatNative(platformCompat));
    AppCompatCallbacks.install(new long[0]);
    t.traceEnd();

    // FileIntegrityService responds to requests from apps and the system. It needs to run after
    // the source (i.e. keystore) is ready, and before the apps (or the first customer in the
    // system) run.
    t.traceBegin("StartFileIntegrityService");
    mSystemServiceManager.startService(FileIntegrityService.class);
    t.traceEnd();

    // Wait for installd to finish starting up so that it has a chance to
    // create critical directories such as /data/user with the appropriate
    // permissions.  We need this to complete before we initialize other services.
    t.traceBegin("StartInstaller");
    Installer installer = mSystemServiceManager.startService(Installer.class);
    t.traceEnd();

    // In some cases after launching an app we need to access device identifiers,
    // therefore register the device identifier policy before the activity manager.
    t.traceBegin("DeviceIdentifiersPolicyService");
    mSystemServiceManager.startService(DeviceIdentifiersPolicyService.class);
    t.traceEnd();

    // Uri Grants Manager.
    t.traceBegin("UriGrantsManagerService");
    mSystemServiceManager.startService(UriGrantsManagerService.Lifecycle.class);
    t.traceEnd();

    // Activity manager runs the show.
    t.traceBegin("StartActivityManager");
    // TODO: Might need to move after migration to WM.
    ActivityTaskManagerService atm = mSystemServiceManager.startService(
            ActivityTaskManagerService.Lifecycle.class).getService();
    mActivityManagerService = ActivityManagerService.Lifecycle.startService(
            mSystemServiceManager, atm);
    mActivityManagerService.setSystemServiceManager(mSystemServiceManager);
    mActivityManagerService.setInstaller(installer);
    mWindowManagerGlobalLock = atm.getGlobalLock();
    t.traceEnd();

    // Data loader manager service needs to be started before package manager
    t.traceBegin("StartDataLoaderManagerService");
    mDataLoaderManagerService = mSystemServiceManager.startService(
            DataLoaderManagerService.class);
    t.traceEnd();

    // Incremental service needs to be started before package manager
    t.traceBegin("StartIncrementalService");
    mIncrementalServiceHandle = startIncrementalService();
    t.traceEnd();

    // Power manager needs to be started early because other services need it.
    // Native daemons may be watching for it to be registered so it must be ready
    // to handle incoming binder calls immediately (including being able to verify
    // the permissions for those calls).
    t.traceBegin("StartPowerManager");
    mPowerManagerService = mSystemServiceManager.startService(PowerManagerService.class);
    t.traceEnd();

    t.traceBegin("StartThermalManager");
    mSystemServiceManager.startService(ThermalManagerService.class);
    t.traceEnd();

    // Now that the power manager has been started, let the activity manager
    // initialize power management features.
    t.traceBegin("InitPowerManagement");
    mActivityManagerService.initPowerManagement();
    t.traceEnd();

    // Bring up recovery system in case a rescue party needs a reboot
    t.traceBegin("StartRecoverySystemService");
    mSystemServiceManager.startService(RecoverySystemService.Lifecycle.class);
    t.traceEnd();

    // Now that we have the bare essentials of the OS up and running, take
    // note that we just booted, which might send out a rescue party if
    // we're stuck in a runtime restart loop.
    RescueParty.registerHealthObserver(mSystemContext);
    PackageWatchdog.getInstance(mSystemContext).noteBoot();

    // Manages LEDs and display backlight so we need it to bring up the display.
    t.traceBegin("StartLightsService");
    mSystemServiceManager.startService(LightsService.class);
    t.traceEnd();

    t.traceBegin("StartSidekickService");
    // Package manager isn't started yet; need to use SysProp not hardware feature
    if (SystemProperties.getBoolean("config.enable_sidekick_graphics", false)) {
        mSystemServiceManager.startService(WEAR_SIDEKICK_SERVICE_CLASS);
    }
    t.traceEnd();

    // Display manager is needed to provide display metrics before package manager
    // starts up.
    t.traceBegin("StartDisplayManager");
    mDisplayManagerService = mSystemServiceManager.startService(DisplayManagerService.class);
    t.traceEnd();

    // We need the default display before we can initialize the package manager.
    t.traceBegin("WaitForDisplay");
    mSystemServiceManager.startBootPhase(t, SystemService.PHASE_WAIT_FOR_DEFAULT_DISPLAY);
    t.traceEnd();

    // Only run "core" apps if we're encrypting the device.
    String cryptState = VoldProperties.decrypt().orElse("");
    if (ENCRYPTING_STATE.equals(cryptState)) {
        Slog.w(TAG, "Detected encryption in progress - only parsing core apps");
        mOnlyCore = true;
    } else if (ENCRYPTED_STATE.equals(cryptState)) {
        Slog.w(TAG, "Device encrypted - only parsing core apps");
        mOnlyCore = true;
    }

    // Start the package manager.
    if (!mRuntimeRestart) {
        FrameworkStatsLog.write(FrameworkStatsLog.BOOT_TIME_EVENT_ELAPSED_TIME_REPORTED,
                FrameworkStatsLog
                        .BOOT_TIME_EVENT_ELAPSED_TIME__EVENT__PACKAGE_MANAGER_INIT_START,
                SystemClock.elapsedRealtime());
    }

    t.traceBegin("StartPackageManagerService");
    try {
        Watchdog.getInstance().pauseWatchingCurrentThread("packagemanagermain");
        mPackageManagerService = PackageManagerService.main(mSystemContext, installer,
                mFactoryTestMode != FactoryTest.FACTORY_TEST_OFF, mOnlyCore);
    } finally {
        Watchdog.getInstance().resumeWatchingCurrentThread("packagemanagermain");
    }

    // Now that the package manager has started, register the dex load reporter to capture any
    // dex files loaded by system server.
    // These dex files will be optimized by the BackgroundDexOptService.
    SystemServerDexLoadReporter.configureSystemServerDexReporter(mPackageManagerService);

    mFirstBoot = mPackageManagerService.isFirstBoot();
    mPackageManager = mSystemContext.getPackageManager();
    t.traceEnd();
    if (!mRuntimeRestart && !isFirstBootOrUpgrade()) {
        FrameworkStatsLog.write(FrameworkStatsLog.BOOT_TIME_EVENT_ELAPSED_TIME_REPORTED,
                FrameworkStatsLog
                        .BOOT_TIME_EVENT_ELAPSED_TIME__EVENT__PACKAGE_MANAGER_INIT_READY,
                SystemClock.elapsedRealtime());
    }
    // Manages A/B OTA dexopting. This is a bootstrap service as we need it to rename
    // A/B artifacts after boot, before anything else might touch/need them.
    // Note: this isn't needed during decryption (we don't have /data anyways).
    if (!mOnlyCore) {
        boolean disableOtaDexopt = SystemProperties.getBoolean("config.disable_otadexopt",
                false);
        if (!disableOtaDexopt) {
            t.traceBegin("StartOtaDexOptService");
            try {
                Watchdog.getInstance().pauseWatchingCurrentThread("moveab");
                OtaDexoptService.main(mSystemContext, mPackageManagerService);
            } catch (Throwable e) {
                reportWtf("starting OtaDexOptService", e);
            } finally {
                Watchdog.getInstance().resumeWatchingCurrentThread("moveab");
                t.traceEnd();
            }
        }
    }

    t.traceBegin("StartUserManagerService");
    mSystemServiceManager.startService(UserManagerService.LifeCycle.class);
    t.traceEnd();

    // Initialize attribute cache used to cache resources from packages.
    t.traceBegin("InitAttributerCache");
    AttributeCache.init(mSystemContext);
    t.traceEnd();

    // Set up the Application instance for the system process and get started.
    t.traceBegin("SetSystemProcess");
    mActivityManagerService.setSystemProcess();
    t.traceEnd();

    // Complete the watchdog setup with an ActivityManager instance and listen for reboots
    // Do this only after the ActivityManagerService is properly started as a system process
    t.traceBegin("InitWatchdog");
    watchdog.init(mSystemContext, mActivityManagerService);
    t.traceEnd();

    // DisplayManagerService needs to setup android.display scheduling related policies
    // since setSystemProcess() would have overridden policies due to setProcessGroup
    mDisplayManagerService.setupSchedulerPolicies();

    // Manages Overlay packages
    t.traceBegin("StartOverlayManagerService");
    mSystemServiceManager.startService(new OverlayManagerService(mSystemContext));
    t.traceEnd();

    t.traceBegin("StartSensorPrivacyService");
    mSystemServiceManager.startService(new SensorPrivacyService(mSystemContext));
    t.traceEnd();

    if (SystemProperties.getInt("persist.sys.displayinset.top", 0) > 0) {
        // DisplayManager needs the overlay immediately.
        mActivityManagerService.updateSystemUiContext();
        LocalServices.getService(DisplayManagerInternal.class).onOverlayChanged();
    }

    // The sensor service needs access to package manager service, app ops
    // service, and permissions service, therefore we start it after them.
    // Start sensor service in a separate thread. Completion should be checked
    // before using it.
    mSensorServiceStart = SystemServerInitThreadPool.submit(() -> {
        TimingsTraceAndSlog traceLog = TimingsTraceAndSlog.newAsyncLog();
        traceLog.traceBegin(START_SENSOR_SERVICE);
        startSensorService();
        traceLog.traceEnd();
    }, START_SENSOR_SERVICE);

    t.traceEnd(); // startBootstrapServices
}
```

说明：

- 基本都是通过 SystemServiceManager#startService() 启动服务。
- SystemServiceManager 类用于创建和管理服务，内部通过 ArrayList 管理服务。
- 启动一系列引导服务。如：Installer、AMS/ATMS、PMS、PKMS 等。

### SystemServer#startCoreServices()

```java
private void startCoreServices(@NonNull TimingsTraceAndSlog t) {
    t.traceBegin("startCoreServices");

    // Service for system config
    t.traceBegin("StartSystemConfigService");
    mSystemServiceManager.startService(SystemConfigService.class);
    t.traceEnd();

    t.traceBegin("StartBatteryService");
    // Tracks the battery level.  Requires LightService.
    mSystemServiceManager.startService(BatteryService.class);
    t.traceEnd();

    // Tracks application usage stats.
    t.traceBegin("StartUsageService");
    mSystemServiceManager.startService(UsageStatsService.class);
    mActivityManagerService.setUsageStatsManager(
            LocalServices.getService(UsageStatsManagerInternal.class));
    t.traceEnd();

    // Tracks whether the updatable WebView is in a ready state and watches for update installs.
    if (mPackageManager.hasSystemFeature(PackageManager.FEATURE_WEBVIEW)) {
        t.traceBegin("StartWebViewUpdateService");
        mWebViewUpdateService = mSystemServiceManager.startService(WebViewUpdateService.class);
        t.traceEnd();
    }

    // Tracks and caches the device state.
    t.traceBegin("StartCachedDeviceStateService");
    mSystemServiceManager.startService(CachedDeviceStateService.class);
    t.traceEnd();

    // Tracks cpu time spent in binder calls
    t.traceBegin("StartBinderCallsStatsService");
    mSystemServiceManager.startService(BinderCallsStatsService.LifeCycle.class);
    t.traceEnd();

    // Tracks time spent in handling messages in handlers.
    t.traceBegin("StartLooperStatsService");
    mSystemServiceManager.startService(LooperStatsService.Lifecycle.class);
    t.traceEnd();

    // Manages apk rollbacks.
    t.traceBegin("StartRollbackManagerService");
    mSystemServiceManager.startService(ROLLBACK_MANAGER_SERVICE_CLASS);
    t.traceEnd();

    // Service to capture bugreports.
    t.traceBegin("StartBugreportManagerService");
    mSystemServiceManager.startService(BugreportManagerService.class);
    t.traceEnd();

    // Serivce for GPU and GPU driver.
    t.traceBegin("GpuService");
    mSystemServiceManager.startService(GpuService.class);
    t.traceEnd();

    t.traceEnd(); // startCoreServices
}
```

说明：

- 启动一系列核心服务。如：BatteryService、UsageStatsService、WebViewUpdateService、BugreportManagerService、GpuService 等。

### SystemServer#startOtherServices()

```java
private void startOtherServices(@NonNull TimingsTraceAndSlog t) {
    // ......
    // 初始化一些基础服务，如：WindowManagerServer、NetworkManagementService、NetworkPolicyManagerService
    // 初始化一些UI相关服务，如:InputManagerService、AccessibilityManagerService、StorageManagerService、NotificationManagerService、UiModeManagerService
    // ......
    mActivityManagerService.systemReady(() -> {
        // ......
    }, t);

    t.traceEnd(); // startOtherServices
}
```

```java
// ActivityManagerService类
public void systemReady(final Runnable goingCallback, TimingsTraceLog traceLog) {a
    traceLog.traceBegin("PhaseActivityManagerReady");
    synchronized(this) {
        if (mSystemReady) { 
            if (goingCallback != null) {
                 goingCallback.run();
            }
            return;
        }

       // ....
    }

    // ......
     synchronized (this) {
       
        // ......
        if (bootingSystemUser) {
            // 启动桌面Activity
            mAtmInternal.startHomeOnAllDisplays(currentUserId, "systemReady");
        }
        //......
    }
    // ......
}
```

   说明：

- 启动其他服务，如：CameraService、AlarmManagerService、InputManagerService、WindowManagerService、BluetoothService、LocationManagerService、AndioService、NetworkManagementService、NetworkStatsService、WifiService、NotificationManagerService、UsbService、BackupManagerService、DreamManagerService 等。

