[toc]

# Android 性能优化之线程优化

## 线程调度原理

- 分时调度模型：让线程轮流获取CPU的使用权，并且平均每个线程占用CPU的时间片。这种方式确保了每个线程都有机会执行，但执行时间可能较短。
- 抢占式调度模型：优先级高的获取，JVM采用。

### Android线程调度

- nice值：
  - 通过 `android.os.Process#setThreadPriority(int)` 定义。
  - 内置优先级常量：![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5d8583ab8fb54278835d5973529c4995.png)
  - 在Android中，nice值也是影响线程优先级的一个因素。
  - nice值越小，优先级越高。
  - nice值主要用于调整进程（而非线程）的优先级。
- cgroup：
  - 群组调度策略。
  - 保证前台线程可以获取更多的CPU。

### 注意点

- 线程过多会导致CPU频繁切换，降低线程运行效率。
- 根据任务重要性定义优先级。
- 优先级具有继承性。



## 异步方式

1. Thread
   - 最常见的异步方式。
   - 缺点：不易复用、频繁创建和销毁开销大；复杂场景不宜使用。
2. HandlerThread
   - 继承自Thread，内置Handler。
   - 适合长时间串行执行。
3. IntentService
   - 基继承自Service，内置Handler。
   - 优先级较高，不占用主线程，不易被系统kill。
4. 线程池
   - 易复用，减少频繁创建、销毁。
   - 功能强大，可以定时、任务队列、并发数控制。



## 线程使用准则

- 设置线程名。
- 设置优先级。

```java
// 设置线程名
Thread.currentThread().setName("myWork");

// 设置优先级
Process.setThreadPriority(Process.THREAD_PRIORITY_DEFAULT);
```



## 线程池配置

- IO密集型：
  - CPU密集型任务通常涉及大量的计算和逻辑处理，而不涉及太多的I/O操作。
  - 线程池大小设置为CPU内核数+1是比较合理的。例如，如果设备有4个CPU核心，那么线程池大小可以设置为5。
- CPU密集型：
  - IO密集型任务涉及大量的I/O操作，如数据库交互、文件上传下载和网络传输等。这些操作会导致线程阻塞等待，从而降低CPU的利用率。
  - 线程池大小可以设置为CPU核心数的两倍，即2N。例如，如果设备有4个CPU核心，那么线程池大小可以设置为8。
  - 另一种配置方式是基于阻塞系数（blocking factor）。线程数 = CPU核心数 / (1 – 阻塞系数)。阻塞系数通常在0.8到0.9之间。例如，如果阻塞系数为0.9，CPU核心数为4，则线程数 = 4 / (1 – 0.9) = 40。

```java
public ThreadPoolExecutor(int corePoolSize, // 核心线程数
                          int maximumPoolSize, // 最大线程数
                          long keepAliveTime, //非核心线程的存活时间
                          TimeUnit unit, // 时间单位
                          BlockingQueue<Runnable> workQueue, // 任务队列
                          ThreadFactory threadFactory, // 线程工厂
                          RejectedExecutionHandler handler // 拒绝策略
                         ) 
```

```java
public class CPUThreadPool {

    private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
    private static ExecutorService sInstance;

    public static ExecutorService newCpuThreadPool() {
        int corePoolSize = CPU_COUNT + 1;
        int maximumPoolSize = CPU_COUNT * 2 + 1;
        long keepAliveTime = 30;

        return new ThreadPoolExecutor(
                corePoolSize,
                maximumPoolSize,
                keepAliveTime,
                TimeUnit.SECONDS,
                new SynchronousQueue<>(), 
                Executors.defaultThreadFactory(),  
                new ThreadPoolExecutor.CallerRunsPolicy()  
        );
    }

    public static ExecutorService getInstance() {
        if (sInstance == null) {
            sInstance = newCpuThreadPool();
        }
        return sInstance;
    }
}
```

```JAVA
public class IOThreadPool {

    private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
    private static ExecutorService sInstance;

    public static ExecutorService newIoThreadPool() {
        int corePoolSize = CPU_COUNT * 2 + 1;
        int maximumPoolSize = CPU_COUNT * 2 + 1;
        long keepAliveTime = 30;

        return new ThreadPoolExecutor(
                corePoolSize,
                maximumPoolSize,
                keepAliveTime,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.DiscardOldestPolicy()
        );
    }

    public static ExecutorService getInstance() {
        if (sInstance == null) {
            sInstance = newIoThreadPool();
        }
        return sInstance;
    }
}
```

















