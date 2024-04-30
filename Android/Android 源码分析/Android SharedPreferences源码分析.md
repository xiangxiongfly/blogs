[TOC]

# Android SharedPreferences源码分析

## 概述

SharedPreferences 是 Android 平台上轻量级的 K-V 存储框架。

SharedPreferences 采用 XML 文件格式持久化键值对数据，文件的存储位置位于应用沙盒的内部存储 `/data/data/<包名>/shared_prefs/` 位置，每个 XML 文件对应于一个 SharedPreferences 对象。

一个sp文件（XML文件） 对应一个 SharedPreferences 对象。



## 基本使用

```java
SharedPreferences sp = context.getSharedPreferences("app", Context.MODE_PRIVATE);
SharedPreferences.Editor edit = sp.edit();
edit.putString("name", "小明")
        .putInt("age", 18)
        .putBoolean("sex", true)
        .apply();

String name = sp.getString("name", "");
int age = sp.getInt("age", 0);
boolean sex = sp.getBoolean("sex", false);
```

查看 /data/data/com.example.myapplication/shared_prefs/app.xml 文件：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f0c7a4a142bc4fb9971936a84754d873.png)



## 流程图

### SP内存模型图

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/9333e8a2ceb14c51af502e27fd82a8a4.png)

### SP初始化流程图

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/939d7c5043e0425e895930e0fd570471.png)

### 读取数据流程图

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/fa7b81616b3645fc90689d36cc70c9fb.png)

### 写入数据流程图

**commit()**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/25e229c0bfc04ed79e8b6d1079811fc9.png)

**apply()**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1529255552144b76b13d22e173c220be.png)



## 源码分析

### 获取SP对象

ContextImpl 类是 Context 抽象类的实现类。

```java
// ContextImpl.java

class ContextImpl extends Context {
    // sp文件的根目录
    private File mPreferencesDir;
    // 缓存name和file对象的对应关系
    private ArrayMap<String, File> mSharedPrefsPaths;
    // 缓存包名、file对象和SharedPreferencesImpl对象的对应关系
    private static ArrayMap<String, ArrayMap<File, SharedPreferencesImpl>> sSharedPrefsCache;

    // 通过name获取sp对象
    public SharedPreferences getSharedPreferences(String name, int mode) {      
        File file;
        synchronized (ContextImpl.class) {
            // mSharedPrefsPaths缓存对象为null则创建
            if (mSharedPrefsPaths == null) {
                mSharedPrefsPaths = new ArrayMap<>();
            }
            // 从mSharedPrefsPaths缓存中获取file对象
            file = mSharedPrefsPaths.get(name);
            // 如果file对象为null，则创建file对象
            if (file == null) {
                // 通过路径获取file对象
                file = getSharedPreferencesPath(name);
                mSharedPrefsPaths.put(name, file);
            }
        }
        return getSharedPreferences(file, mode);
    }

    // 创建file对象
    public File getSharedPreferencesPath(String name) {
        return makeFilename(getPreferencesDir(), name + ".xml");
    }

    // 获取sp文件的根目录
    private File getPreferencesDir() {
        synchronized (mSync) {
            if (mPreferencesDir == null) {
                mPreferencesDir = new File(getDataDir(), "shared_prefs");
            }
            return ensurePrivateDirExists(mPreferencesDir);
        }
    }

    // 通过file对象获取sp对象
    public SharedPreferences getSharedPreferences(File file, int mode) {
        SharedPreferencesImpl sp;
        synchronized (ContextImpl.class) {
            // 从sSharedPrefsCache缓存获取ArrayMap
            final ArrayMap<File, SharedPreferencesImpl> cache = 							 													getSharedPreferencesCacheLocked();
            // 从缓存中获取sp对象
            sp = cache.get(file);
            if (sp == null) {
                // 如果sp对象为null，则创建并缓存
                checkMode(mode);     
                sp = new SharedPreferencesImpl(file, mode);
                cache.put(file, sp);
                return sp;
            }
        }
        return sp;
    }

    // 从sSharedPrefsCache缓存获取sp对象
    private ArrayMap<File, SharedPreferencesImpl> getSharedPreferencesCacheLocked() {
        // sSharedPrefsCache缓存对象为null则创建
        if (sSharedPrefsCache == null) {
            sSharedPrefsCache = new ArrayMap<>();
        }
        // 获取包名
        final String packageName = getPackageName();
        // sSharedPrefsCache通过包名获取ArrayMap
        ArrayMap<File, SharedPreferencesImpl> packagePrefs = sSharedPrefsCache.get(packageName);
        // packagePrefs为null则创建
        if (packagePrefs == null) {
            packagePrefs = new ArrayMap<>();
            sSharedPrefsCache.put(packageName, packagePrefs);
        }
        return packagePrefs;
    }
}
```

- 通过 name 获取对应的 file 对象，再通过 file 对象获取到 sp 对象。
- mSharedPrefsPaths：缓存 name 和 file 对象的对应关系。
- sSharedPrefsCache：这是一个二级映射表，第一级是缓存包名和 Map 对象，第二级是 Map 对象缓存 file 对象和 sp 对象的对应关系。

### 初始化

```java
// SharedPreferencesImpl.java

final class SharedPreferencesImpl implements SharedPreferences {
    // 目标文件
    private final File mFile;
    // 锁
    private final Object mLock = new Object();
    // 是否加载到内存中
    private boolean mLoaded = false;
    // 缓存加载的数据
    private Map<String, Object> mMap;

    SharedPreferencesImpl(File file, int mode) {
        mFile = file;
        mBackupFile = makeBackupFile(file);
        mMode = mode;
        mLoaded = false;
        mMap = null;
        mThrowable = null;
        // 开始加载文件
        startLoadFromDisk();
    }

    // 开启一个线程并加载文件
    private void startLoadFromDisk() {
        synchronized (mLock) {
            mLoaded = false;
        }
        // 开启线程
        new Thread("SharedPreferencesImpl-load") {
            public void run() {
                loadFromDisk();
            }
        }.start();
    }

    // 加载文件
    private void loadFromDisk() {
        synchronized (mLock) {
            if (mLoaded) {
                return;
            }
            // 如果有备份文件，则恢复备份文件
            if (mBackupFile.exists()) {
                mFile.delete();
                mBackupFile.renameTo(mFile);
            }
        }

        Map<String, Object> map = null;  
        if (mFile.canRead()) {
            // 读取sp文件
            BufferedInputStream str = new BufferedInputStream(new FileInputStream(mFile), 16 * 1024);
            // 解析sp的XML文件并转为Map
            map = (Map<String, Object>) XmlUtils.readMapXml(str);            
        }

        synchronized (mLock) {
            mLoaded = true;
            if (map != null) {
                // 使用新Map
                mMap = map;
            } else {
                mMap = new HashMap<>();
            }
            // 解析完文件后唤醒锁
            mLoaded = true;
            mLock.notifyAll();
        }
    }
}
```

- 开启一个线程并读取sp文件。
- 判断是否有备份文件，如果有则删除当前文件恢复备份文件。
- 解析sp文件，并将 mLoad 设置为 true 表示已经读取到内存中。

### 读取数据

```java
// 获取数据
public String getString(String key, @Nullable String defValue) {
    synchronized (mLock) {
        // 等待加载完成
        awaitLoadedLocked();
        // 从Map中读取数据
        String v = (String)mMap.get(key);
        return v != null ? v : defValue;
    }
}

// 判断是否加载完成，如果没有加载完成就一直等待
private void awaitLoadedLocked() {
    while (!mLoaded) {
        try {
            mLock.wait();
        } catch (InterruptedException unused) {
        }
    }
}
```

- 使用 awaitLoadedLocked() 方法保证已经加载完成。

### 写入数据

虽然 ContextImpl 中使用了内存缓存，但是最终数据还是需要执行磁盘 IO 持久化到磁盘文件中。如果每一次 “变更操作” 都对应一次磁盘 “写回操作” 的话，不仅效率低下，而且没有必要。所以 SharedPreferences 会使用 “事务” 机制，将多次变更操作聚合为一个 “事务”，一次事务最多只会执行一次磁盘写回操作。
SharedPreferences 的事务操作由 Editor 接口实现。

```java
// SharedPreferencesImpl.java

final class SharedPreferencesImpl implements SharedPreferences {

    public Editor edit() {
        // 等待文件加载完成
        synchronized (mLock) {
            awaitLoadedLocked();
        }
        // 创建编辑器
        return new EditorImpl();
    }

    // 编辑器
    public final class EditorImpl implements Editor {
        // 锁对象
        private final Object mEditorLock = new Object();
        // 修改记录
        private final Map<String, Object> mModified = new HashMap<>();
        // 清除全部数据的标记
        private boolean mClear = false;

        // 存放String类型数据
        @Override
        public Editor putString(String key, @Nullable String value) {
            synchronized (mEditorLock) {
                mModified.put(key, value);
                return this;
            }
        }

        // 存放int类型数据
        @Override
        public Editor putInt(String key, int value) {
            synchronized (mEditorLock) {
                mModified.put(key, value);
                return this;
            }
        }

        // 删除数据
        @Override
        public Editor remove(String key) {
            synchronized (mEditorLock) {
                mModified.put(key, this);
                return this;
            }
        }

        // 清除所有数据
        @Override
        public Editor clear() {
            synchronized (mEditorLock) {
                mClear = true;
                return this;
            }
        }

        // 异步提交
        @Override
        public void apply() {
            ...
        }

        // 同步提交，并返回操作结果是否成功
        @Override
        public boolean commit() {
            ...
        }
    }   
}
```

#### MemoryCommitResult

MemoryCommitResult 是一个事务对象，收集需要写入磁盘的数据。

```java
// MemoryCommitResult.java

private static class MemoryCommitResult {
    // 内存版本号
    final long memoryStateGeneration;
    // 写入磁盘的数据
    final Map<String, Object> mapToWriteToDisk;
    // 同步计数器  
    final CountDownLatch writtenToDiskLatch = new CountDownLatch(1);

    @GuardedBy("mWritingToDiskLock")
    volatile boolean writeToDiskResult = false;
    boolean wasWritten = false;

    void setDiskWriteResult(boolean wasWritten, boolean result) {
        this.wasWritten = wasWritten;
        writeToDiskResult = result;
        // 唤醒等待锁
        writtenToDiskLatch.countDown();
    }
}
```

#### commitToMemory()

```java
// SharedPreferencesImpl.java

final class SharedPreferencesImpl implements SharedPreferences {
    // 每次提交数据自增 1，事务结束自减 1
    private int mDiskWritesInFlight = 0;
    // 内存版本
    private long mCurrentMemoryStateGeneration;
    // 磁盘版本
    private long mDiskStateGeneration;
    // 修改记录
    private final Map<String, Object> mModified = new HashMap<>();
    // 清除全部数据的标记
    private boolean mClear = false;

    // 全量提交到内存
    private MemoryCommitResult commitToMemory() {
        long memoryStateGeneration;
        boolean keysCleared = false;
        List<String> keysModified = null;
        Set<OnSharedPreferenceChangeListener> listeners = null;
        Map<String, Object> mapToWriteToDisk;

        synchronized (SharedPreferencesImpl.this.mLock) {
            // 表示有多个写入操作
            if (mDiskWritesInFlight > 0) {
                mMap = new HashMap<String, Object>(mMap);
            }
            // 需要写入磁盘的数据
            mapToWriteToDisk = mMap; // 全量Map
            // 自增加1
            mDiskWritesInFlight++;

            synchronized (mEditorLock) {
                // 是否发生有效修改
                boolean changesMade = false;

                // 清除全部数据
                if (mClear) {
                    if (!mapToWriteToDisk.isEmpty()) {
                        changesMade = true;
                        mapToWriteToDisk.clear();
                    }
                    keysCleared = true;
                    mClear = false;
                }

                // 将内存中的mModified都数据整合到mapToWriteToDisk中
                for (Map.Entry<String, Object> e : mModified.entrySet()) {
                    String k = e.getKey();
                    Object v = e.getValue();
                    if (v == this || v == null) {
                        // 如果value是this，表示删除这个key
                        if (!mapToWriteToDisk.containsKey(k)) {
                            continue;
                        }
                        mapToWriteToDisk.remove(k);
                    } else {
                        // 修改key-value值
                        if (mapToWriteToDisk.containsKey(k)) {
                            Object existingValue = mapToWriteToDisk.get(k);
                            if (existingValue != null && existingValue.equals(v)) {
                                continue;
                            }
                        }
                        mapToWriteToDisk.put(k, v);
                    }

                    // 标记修改完成
                    changesMade = true;
                    // 记录发生修改的key
                    if (hasListeners) {
                        keysModified.add(k);
                    }
                }

                // 重置内存中的mModified
                mModified.clear();

                // 修改完成，自增加1
                if (changesMade) {
                    mCurrentMemoryStateGeneration++;
                }
                // 修改内存版本号
                memoryStateGeneration = mCurrentMemoryStateGeneration;
            }
        }
        return new MemoryCommitResult(memoryStateGeneration, keysCleared, keysModified,
                                      listeners, mapToWriteToDisk);
    }
}
```

#### commit()

```java
// SharedPreferencesImpl.EditorImpl#commit()

public boolean commit() {
    // 写入到内存，并获取事务对象
    MemoryCommitResult mcr = commitToMemory();
    // 写入到磁盘
    SharedPreferencesImpl.this.enqueueDiskWrite(mcr, null);
    // 阻塞等待写入完成
    mcr.writtenToDiskLatch.await();       
    // 触发回调监听
    notifyListeners(mcr);
    return mcr.writeToDiskResult;
}
```

- 调用 commitToMemory() 方法将数据提交到内存中，并返回 MemoryCommitResult 对象。
- 调用 enqueueDiskWrite() 方法写入磁盘。
- writtenToDiskLatch.await() 会阻塞等待写入完成。
- notifyListeners() 触发回调监听。

#### apply()

```java
// SharedPreferencesImpl.EditorImpl#apply()

public void apply() {
    // 写入到内存，并获取事务对象
    final MemoryCommitResult mcr = commitToMemory();
    // 创建awaitCommit任务
    final Runnable awaitCommit = new Runnable() {
        @Override
        public void run() {
            // 阻塞等待写入完成
            mcr.writtenToDiskLatch.await();
        }
    };
    // 将awaitCommit任务提交到QueuedWork的等待队列中
    QueuedWork.addFinisher(awaitCommit);
    // 创建postWriteRunnable任务，写入成功后执行
    Runnable postWriteRunnable = new Runnable() {
        @Override
        public void run() {
            awaitCommit.run();
            QueuedWork.removeFinisher(awaitCommit);
        }
    };
    // 写入到磁盘，触发postWriteRunnable任务
    SharedPreferencesImpl.this.enqueueDiskWrite(mcr, postWriteRunnable);
    // 触发回调监听
    notifyListeners(mcr);
}
```

- 调用 commitToMemory() 方法将数据提交到内存中，并返回 MemoryCommitResult 对象。
- 创建 awaitCommit 任务放入 QueuedWork 的等待队列中，用于阻塞等待写入完成。
- 调用 enqueueDiskWrite() 方法写入磁盘。
- 写入后触发 postWriteRunnable 任务，完成后移除 awaitCommit 任务。
- notifyListeners() 触发回调监听。

#### enqueueDiskWrite()

```java
// SharedPreferencesImpl#enqueueDiskWrite()

// postWriteRunnable为null表示commit同步提交，不为null表示apply异步提交
private void enqueueDiskWrite(final MemoryCommitResult mcr, final Runnable postWriteRunnable) {
    // 判断是否为同步操作
    final boolean isFromSyncCommit = (postWriteRunnable == null);
    // 写入磁盘任务
    final Runnable writeToDiskRunnable = new Runnable() {
        @Override
        public void run() {
            synchronized (mWritingToDiskLock) {
                // 写入到磁盘
                writeToFile(mcr, isFromSyncCommit);
            }
            synchronized (mLock) {
                // 自减1
                mDiskWritesInFlight--;
            }
            if (postWriteRunnable != null) {
                postWriteRunnable.run();
            }
        }
    };

    // 如果是同步操作
    if (isFromSyncCommit) {
        // 判断mDiskWritesInFlight变量，如果存在并发写入则交给QueuedWork
        boolean wasEmpty = false;
        synchronized (mLock) {
            wasEmpty = mDiskWritesInFlight == 1;
        }
        // wasEmpty为true，表示没有并发写入，则直接执行写入任务
        if (wasEmpty) {
            writeToDiskRunnable.run();
            return;
        }
    }

    // 如果是异步操作，提交到QueuedWork执行
    QueuedWork.queue(writeToDiskRunnable, !isFromSyncCommit);
}
```

#### QueuedWork

```java
public class QueuedWork {
    // 等待队列
    private static final LinkedList<Runnable> sFinishers = new LinkedList<>();
    // 任务队列
    private static LinkedList<Runnable> sWork = new LinkedList<>();
    // apply时延迟执行时间
    private static final long DELAY = 100;

    public static void queue(Runnable work, boolean shouldDelay) {
        Handler handler = getHandler();

        synchronized (sLock) {
            sWork.add(work);

            if (shouldDelay && sCanDelay) {
                handler.sendEmptyMessageDelayed(QueuedWorkHandler.MSG_RUN, DELAY);
            } else {
                handler.sendEmptyMessage(QueuedWorkHandler.MSG_RUN);
            }
        }
    }
}
```

- 用 apply() 方式提交时，消息会延迟100毫秒发送，避免频繁的磁盘写入操作。
- 用 commit() 方式提交时，handler 会立即发送消息。

#### writeToFile()

```java
// SharedPreferencesImpl#writeToFile()

private void writeToFile(MemoryCommitResult mcr, boolean isFromSyncCommit) {
    // 判断旧文件是否存在	
    boolean fileExists = mFile.exists();

    if (fileExists) {
        // 是否执行写入操作
        boolean needsWrite = false;
        // 如果磁盘版本小于内存版本，执行磁盘写入操作
        if (mDiskStateGeneration < mcr.memoryStateGeneration) {
            if (isFromSyncCommit) {
                // 如果是同步执行，一定执行写入操作
                needsWrite = true;
            } else {
                // 如果是异步执行，只有最新的内存版本菜执行写入操作
                synchronized (mLock) {
                    if (mCurrentMemoryStateGeneration == mcr.memoryStateGeneration) {
                        needsWrite = true;
                    }
                }
            }
        }

        // 无效的异步写回，直接结束
        if (!needsWrite) {
            mcr.setDiskWriteResult(false, true);
            return;
        }

        // 文件备份
        boolean backupFileExists = mBackupFile.exists();

        if (!backupFileExists) {
            // 如果没有备份文件，将旧文件改为备份文件
            if (!mFile.renameTo(mBackupFile)) {
                mcr.setDiskWriteResult(false, false);
                return;
            }
        } else {
            // 如果有备份文件，则删除旧文件
            mFile.delete();
        }
    }

    try {
        // 执行写入操作，写入到xml文件中
        FileOutputStream str = createFileOutputStream(mFile);     
        XmlUtils.writeMapXml(mcr.mapToWriteToDisk, str);
        FileUtils.sync(str);
        str.close();
        ContextImpl.setFilePermissionsFromMode(mFile.getPath(), mMode, 0);

        // 写入成功，直接删除备份文件
        mBackupFile.delete();
        // 同步磁盘版本号
        mDiskStateGeneration = mcr.memoryStateGeneration;
        // 写入成功
        mcr.setDiskWriteResult(true, true);

        return;
    } catch (XmlPullParserException e) {
        Log.w(TAG, "writeToFile: Got exception:", e);
    } catch (IOException e) {
        Log.w(TAG, "writeToFile: Got exception:", e);
    }

    // 写入失败会执行这里
    if (mFile.exists()) {
        if (!mFile.delete()) {
            Log.e(TAG, "Couldn't clean up partially-written file " + mFile);
        }
    }
    mcr.setDiskWriteResult(false, false);
}
```

### 主线程堵塞ANR

```java
//QueuedWork.java

public static void waitToFinish() {
    ...
    // 执行所有的写入任务
    processPendingWork();
    ...
        
        // 执行所有的等待任务
        while (true) {
            Runnable finisher;

            synchronized (sLock) {
                finisher = sFinishers.poll();
            }

            if (finisher == null) {
                break;
            }

            finisher.run();
        }
}

private static void processPendingWork() {
    work = sWork;
    ....
     if (work.size() > 0) {
         for (Runnable w : work) {
             w.run();
         }
         ...  
     }
}
```

waitToFinish() 方法会将执行在 QueuedWork 中的任务队列和等待队列的任务。

```java
// ActivityThread.java

public void handlePauseActivity(...) {
    performPauseActivity(r, finished, reason, pendingActions);
    if (r.isPreHoneycomb()) {
        QueuedWork.waitToFinish();
    }
}

private void handleStopService(IBinder token) {
    QueuedWork.waitToFinish();
    ActivityManager.getService().serviceDoneExecuting(token, SERVICE_DONE_EXECUTING_STOP, 0, 0);
}
```

可以看到，在主线程的 Activity#onPause、Activity#onStop、Service#onStop、Service#onStartCommand 等生命周期状态变更时，会调用 QueudeWork.waitToFinish()，这些方法都执行在主线程中，一旦 waitToFinish() 执行超时就会ANR。



## 总结

SharedPreferences 是一个轻量级的 K-V 存储框架。从源码分析中，可以看到 SharedPreferences 在读写性能、可用性方面都有做一些优化，例如：锁细化、事务化、事务过滤、文件备份等。

 **建议：**

- 因为SP初始化时会加载全部sp文件，另外修改后提交属于全量提交，因此大文件尽可能的拆分多个文件，同时修改多个数据时尽量一次提交。
- 因为 commit() 是同步操作，apply() 是异步操作，因此推荐使用 apply()。