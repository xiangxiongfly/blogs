[TOC]
# Java线程池

## 线程池优点

- 线程池是一种基于池化思想管理线程的工具。
- **降低资源消耗**：复用线程池中的线程，避免频繁的创建和销毁造成的资源开销。
- **增加系统稳定性**：由线程池统一管理，有效控制线程池的并发数量。
- **提高响应速度**：当有任务时，可以复用线程，提高了响应速度。



## 线程池API说明

### 创建线程池

```java
//构造方法
new ThreadPoolExecutor(int corePoolSize,//核心线程数量
                       int maximumPoolSize,//最大线程数
                       long keepAliveTime,//最大空闲时间
                       TimeUnit unit,//时间单位
                       BlockingQueue<Runnable> workQueue,//任务队列
                       ThreadFactory threadFactory,//线程工厂
                       RejectedExecutionHandler handler//拒绝策略
                      );
```

### 提交任务

```java
//执行任务
threadPool.execute(new Runnable() {
    @Override
    public void run() {
        //do something...
    }
});

//关闭线程池，不再接收新任务，以前的任务还会继续执行
threadPool.shutdown();

//立即关闭线程池，如果线程池中还有缓存的任务没有执行，则取消执行，并返回这些取消任务
threadPool.shutdownNow();
```

### `int corePoolSize` 核心线程数

- 线程池创建线程时，如果当前线程数量小于`corePoolSize`，则新建核心线程；如果当前线程数量大于`corePoolSize`，则新建非核心线程。
- 核心线程默认会一直存活，即便是空闲状态；如果设置`allowCoreThreadTimeOut(true)`，那么核心线程空闲时间达到`keepAliveTime`时会关闭。

### `int maximumPoolSize` 最大线程数

最大线程数 = 核心线程数 + 非核心线程数 

### `long keepAliveTime` 空闲线程存活时间

非核心线程在空闲状态下，超过`keepAliveTime`时间，会被回收；如果时间设置为0，则空闲线程不会被销毁。

### `TimeUnit unit` 时间单位

常用时间单位：`TimeUnit.MILLISECONDS`、`TimeUnit.SECONDS`、`TimeUnit.MINUTES`

### `BlockingQueue<Runnable> workQueue` 任务队列

提交给线程池的任务都存在这里，当有任务时，会先指派给核心线程执行，当核心线程都被占用时，再有新的任务就会加入到队列中，当队列满了再有任务时，就会启动非核心线程去执行。

| 常用队列            | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| SynchronousQueue    | 当有任务的时候，它不会缓存任务，而是直接将任务交给线程执行，如果线程都被占用，它就会新建线程处理这个任务，所以一般使用这个缓存队列的时候，`maximumPoolSize`设置为`Integer.MAX_VALUE`，否则任务超过`maximumPoolSize`就创建不了线程。 |
| LinkedBlockingDeque | 当有任务的时候，如果当前的核心线程数<`corePoolSize`，则会新建核心线程去执行任务，如果当前核心线程数>=`corePoolSize`，则会将任务存储到队列中，等待执行，但该队列没有存储上限，所以`maximumPoolSize`永远不会超过`corePoolSize`。该队列按先进先出原则处理任务。 |
| ArrayBlockingQueue  | 可以设置队列的长度，当有任务的时候，如果核心线程<`corePoolSize`，则创建核心线程执行任务，如果核心线程>=`corePoolSize`，则先加入到队列里面，等待执行，如果队列也满了，则新建非核心线程去执行任务。该队列按先进先出原则处理任务。线程数不能操作最大线程数。 |
| DelayQueue          | 当有任务时，首先会加入到队列中，达到指定的延时时间后，才会执行任务。 |

### `ThreadFactory threadFactory` 线程工厂

用于创建线程池中的线程，使用默认即可。

### `RejectedExecutionHandler handler` 任务拒绝策略

当任务过多时，当前线程数达到最大线程数，缓冲队列也满了，这时候再来新的任务，就会执行拒绝策略。

| 拒绝策略            | 说明                                             |
| ------------------- | ------------------------------------------------ |
| AbortPolicy         | 默认策略，会抛出RejectedExecutionException异常。 |
| DiscardPolicy       | 直接丢弃任务。                                   |
| DiscardOldestPolicy | 丢弃处于任务队列头部的任务，添加被拒绝的任务。   |
| CallerRunsPolicy    | 使用调用者线程直接执行被拒绝的任务。             |



## 创建使用线程池

```java
/**
 * 定义线程工厂
 */
class CustomThreadFactory implements ThreadFactory {
    private final AtomicInteger i = new AtomicInteger(1);

    @Override
    public Thread newThread(Runnable runnable) {
        Thread thread = new Thread(runnable);
        thread.setName("线程" + i.getAndIncrement() + "号");
        return thread;
    }
}
```

```java
public class Demo {
    public static void main(String[] args) {
        //创建任务
        Task task1 = new Task();
        Task task2 = new Task();
        Task task3 = new Task();
        //创建线程池
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(10, 25,
                10L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<>(),
                new CustomThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy());
        //提交任务
        threadPool.execute(task1);
        threadPool.execute(task2);
        threadPool.execute(task3);
        //关闭线程池
        threadPool.shutdown();
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```



## execute() & submit() 的区别

- `execute()`方法只能提交Runnable任务，无返回值。
- `submit()`方法支持Runnable和Callbale任务，返回Future对象。

### execute()方法提交Runnable任务

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        threadPool.execute(task);
        threadPool.shutdown();
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

### submit()方法提交Runnable任务

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        Future<?> future = threadPool.submit(task);
        try {
            Object result = future.get();
            System.out.println(result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

### submit()方法提交Callable任务

```java
public class Demo {
    public static void main(String[] args) {
        ResultTask task = new ResultTask();
        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        Future<String> future = threadPool.submit(task);
        try {
            String result = future.get();
            System.out.println(result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }
}

class ResultTask implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "hello world";
    }
}
```



## shutdown() & shutdownNow() 的区别

- `shutdown()`：关闭线程池，不再接收新任务，继续执行完任务队列中的任务。
- `shutdownNow()`：立即关闭线程池，不再接收新任务，返回任务队列中的未执行的任务。



## 线程池生命周期

- RUNNING：可以接收新任务，并且也能处理任务队列中的任务。
- SHUTDOWN：不接收新任务，但可以处理任务队列中的任务。
- STOP：不接收新任务，也不处理任务队列中的任务，还中断正在处理任务的线程。
- TIDYING：所有任务已终止，线程池的线程数量为0。
- TERMINATED：线程池彻底关闭。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5957d1a02e524f9eaf2f0a9a380fb997.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



## 线程池执行流程

![流程图](https://img-blog.csdnimg.cn/12267491dfdd4cdf968fad9d65052278.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

![核心代码](https://img-blog.csdnimg.cn/f9dd8c0178f54804a451a1765951a748.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_18,color_FFFFFF,t_70,g_se,x_16)

1. 首先检查线程池运行状态，如果不是RUNNING，则直接拒绝，线程池必须保证在RUNNING状态下执行任务。
1. 如果工作线程数<核心线程数，则创建并启动一个核心线程执行新提交的任务。
1. 如果工作线程数>=核心线程数，且任务队列未满，则将任务天加入任务队列在。
1. 如果工作线程数>=核心线程数 & 工作线程数<最大线程数，且任务队列已满，则创建一个线程执行新提交的任务。
1. 如果工作线程数>=最大线程数，且任务队列已满，则执行拒绝策略。



## 线程池大小的选择策略

- 如果是CPU密集型，则线程数设置为`CPU核数`或`CPU核数 + 1`;
- 如果是IO密集型，则线程数设置为`CPU核数 * 目标CPU利用率 * (1 + 平均等待时间 / 平均工作时间)`。



## 常见四种线程池

### 定长线程池（FixedThreadPool）

特点：只有核心线程且不会被回收，超出线程任务会在队列中等待。

缺点：可能会堆积大量的请求，导致OOM。

场景：控制线程最大并发数。

```java
// 创建定长线程池对象，设置核心线程数量为3
ExecutorService fixedThreadPool = Executors.newFixedThreadPool(3);
Runnable task = new Runnable() {
    @Override
    public void run() {
        // 执行任务      
    }
};
// 向线程池提交任务
fixedThreadPool.execute(task);
```



### 定时线程池（ScheduledThreadPool）

特点：核心线程数量固定，非核心线程数量无限制（限制时马上回收）。

缺点：可能会创建大量的线程，导致OOM。

场景：执行定时或周期性人为。

```java
// 创建定时线程池对象，设置核心线程数量为3
ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(3);
Runnable task = new Runnable() {
    @Override
    public void run() {
        // 执行任务
    }
};
// 向线程池提交任务，延迟1s执行任务
scheduledThreadPool.schedule(task, 1, TimeUnit.SECONDS);
```



### 可缓存线程池（CachedThreadPool）

特点：只有非核心线程，线程数量可无限大，具备超时机制。它会试图缓存线程并重用，当无缓存线程时，会创建新的工作线程；如果线程闲置的时间超过60秒，则被终止并移除缓存；长时间闲置时，这种线程池不会消耗什么资源。内部使用`SynchronousQueue`作为工作队列。

缺点：可能会创建大量线程，导致OOM。

场景：适合执行大量、耗时少的任务。

```java
// 创建可缓存线程池对象
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
Runnable task = new Runnable() {
    @Override
    public void run() {
        // 执行任务
    }
};
cachedThreadPool.execute(task);
```



### 单线程线程池（SingleThreadExecutor）

特点：只有一个核心线程，保证所有的任务都是按顺序执行。

缺点：可能会堆积大量的请求，导致OOM。

场景：适合串行执行的操作。

```java
// 创建单线程线程池
ExecutorService singleThreadPool = Executors.newSingleThreadExecutor();
Runnable task = new Runnable() {
    @Override
    public void run() {
        // 执行任务
    }
};
singleThreadPool.execute(task);
```



### 线程池大小配置

假设CPU为N核

- CPU密集型任务：需要减少线程数量，降低线程之间切换造成的开销，可配置线程池大小为N+1，`Runtime.getRuntime().availableProcessors()`获取CPU数量
- IO密集型任务：需要增加线程数量，可配置线程大小为N*2
- 混合型任务则可拆分为CPU密集型和IO密集型，独立配置



## 线程池工具类

```java
public class ExecutorManager {

    private static volatile ExecutorManager mInstance = null;

    private Handler mHandler = new Handler();

    //核心线程数
    private static final int THREAD_CORE_SIZE = 8;

    //线程对象
    private ExecutorService mCoreThread;
    private ExecutorService mSingleThread;
    private ExecutorService mCacheThread;

    private ExecutorManager() {
        initExecutor();
    }

    public static ExecutorManager getInstance() {
        if (mInstance == null) {
            synchronized (ExecutorManager.class) {
                if (mInstance == null) {
                    mInstance = new ExecutorManager();
                }
            }
        }
        return mInstance;
    }

    private void initExecutor() {
        //可重用的核心线程
        mCoreThread = Executors.newFixedThreadPool(THREAD_CORE_SIZE);
        //队列线程
        mSingleThread = Executors.newSingleThreadExecutor();
        //非核心线程
        mCacheThread = Executors.newCachedThreadPool();
    }

    /**
     * 执行核心线程
     * 核心线程不会销毁，执行完任务后会等待新的任务
     *
     * @param command 任务
     */
    public void executeCore(Runnable command) {
        mCoreThread.execute(command);
    }

    /**
     * 执行核心线程
     * 核心线程不会销毁，执行完任务后会等待新的任务
     *
     * @param listener 回调
     */
    public void executeCore(OnTreadPoolListener listener) {
        mCoreThread.execute(() -> {
            listener.onThread();
            mHandler.post(listener::onUIThread);
        });
    }

    /**
     * 执行核心线程
     * 核心线程不会销毁，执行完任务后会等待新的任务
     *
     * @param listener 回调
     */
    public <T> void executeCore(OnTreadEventPoolListener<T> listener) {
        mCoreThread.execute(() -> {
            T t = listener.onThread();
            mHandler.post(() -> listener.onUIThread(t));
        });
    }

    /**
     * 队列线程
     * 队列线程只有一个核心任务，每次新增任务都会排队执行
     *
     *
     * @param command 任务
     */
    public void executeSingle(Runnable command) {
        mSingleThread.execute(command);
    }

    /**
     * 队列线程
     * 队列线程只有一个核心任务，每次新增任务都会排队执行
     *
     * @param listener 回调
     */
    public void executeSingle(OnTreadPoolListener listener) {
        mSingleThread.execute(() -> {
            listener.onThread();
            mHandler.post(listener::onUIThread);
        });
    }

    /**
     * 队列线程
     * 队列线程只有一个核心任务，每次新增任务都会排队执行
     *
     * @param listener 回调
     */
    public <T> void executeSingle(OnTreadEventPoolListener<T> listener) {
        mSingleThread.execute(() -> {
            T t = listener.onThread();
            mHandler.post(() -> listener.onUIThread(t));
        });
    }


    /**
     * 非核心线程
     * 非核心线程在执行完任务后有60s等待时间，超时后将销毁线程
     *
     * @param command 任务
     */
    public void executeCache(Runnable command) {
        mCacheThread.execute(command);
    }

    /**
     * 非核心线程
     * 非核心线程在执行完任务后有60s等待时间，超时后将销毁线程
     *
     * @param listener 任务
     */
    public void executeCache(OnTreadPoolListener listener) {
        mCacheThread.execute(() -> {
            listener.onThread();
            mHandler.post(listener::onUIThread);
        });
    }

    /**
     * 非核心线程
     * 非核心线程在执行完任务后有60s等待时间，超时后将销毁线程
     *
     * @param listener 任务
     */
    public <T> void executeCache(OnTreadEventPoolListener<T> listener) {
        mCacheThread.execute(() -> {
            T t = listener.onThread();
            mHandler.post(() -> listener.onUIThread(t));
        });
    }

    public interface OnTreadPoolListener {
        //子线程
        void onThread();

        //UI线程
        void onUIThread();
    }

    //具备传参的接口
    public interface OnTreadEventPoolListener<T> {
        //子线程
        T onThread();

        //UI线程
        void onUIThread(T t);
    }
}
```