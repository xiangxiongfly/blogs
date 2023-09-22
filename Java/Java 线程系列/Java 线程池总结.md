[TOC]
# Java线程池

## 线程池优点

- **降低资源消耗**：复用已创建的线程降低线程创建和小会造成的消耗。
- **提高响应速度**：当有任务时，任务可以不需要等待线程创建就能立即执行。
- **增加系统稳定性**：线程池可以统一分配，调优和监控。



## 线程池类关系

- Executor：是一个接口，它是Executor框架的基础，它将任务的提交和执行分离开来。
- ExecutorService：也是一个接口，继承了Executor，增加了shutdown()、submit()等方法，是真正的线程池接口。
- AbstractExecutorService：抽象类，实现了ExecuteService接口中的一些方法。
- ThreadPoolExecutor：继承了AbstractExecutorService，是线程池的核心类，用来执行任务。



## 线程池API说明

### 线程池参数说明

```java
//构造方法
new ThreadPoolExecutor(int corePoolSize,//核心线程数
                       int maximumPoolSize,//最大线程数
                       long keepAliveTime,//空闲线程的存活时间
                       TimeUnit unit,//时间单位
                       BlockingQueue<Runnable> workQueue,//任务队列
                       ThreadFactory threadFactory,//线程工厂
                       RejectedExecutionHandler handler//拒绝策略
                      );
```

#### `int corePoolSize` 核心线程数

- 当提交一个任务时，线程池就会创建一个新线程执行任务，直到工作线程数等于corePoolSize。
- 如果工作线程数为corePoolSize，继续提交的任务会被保存在阻塞队列中，等待被执行。
- 如果执行了线程池的`prestartAllCoreThreads()`方法，就会提前创建并启动所有核心线程。

- 核心线程默认会一直存活，即便是空闲状态；如果设置`allowCoreThreadTimeOut(true)`，那么核心线程空闲时间达到`keepAliveTime`时会关闭。

#### `int maximumPoolSize` 最大线程数

- 线程池中允许的最大线程数。
- 如果阻塞队列满了，且继续提交任务，则会创建新的线程执行任务，前提是工作线程数小于maximumPoolSize。

#### `long keepAliveTime` 空闲线程存活时间

非核心线程在空闲状态下，超过`keepAliveTime`时间，会被回收；如果时间设置为0，则空闲线程不会被销毁。

#### `TimeUnit unit` 时间单位

| 时间单位              | 说明 |
| --------------------- | ---- |
| TimeUnit.MILLISECONDS | 毫秒 |
| TimeUnit.SECOND       | 秒   |
| TimeUnit.MINUTES      | 分   |

#### `BlockingQueue<Runnable> workQueue` 阻塞队列

任务阻塞队列，当线程池中的工作线程数超过corePoolSize时，任务会进入阻塞队列进行等待执行。

| 阻塞队列              | 说明                                 |
| --------------------- | ------------------------------------ |
| ArrayBlockingQueue    | 一个由数组结构组成的有界阻塞队列     |
| LinkedBlockingQueue   | 一个由链表结构组成的有界阻塞队列     |
| PriorityBlockingQueue | 一个支持优先级排序的无界阻塞队列     |
| DelayedWorkQueue      | 一个使用优先级队列实现的无界阻塞队列 |
| SynchronousQueue      | 一个不存储元素的阻塞队列             |
| LinkedTransferQueue   | 一个由链表结构组成的无界阻塞队列     |
| LinkedBlockingDeque   | 一个由链表结构组成的双向阻塞队列     |

#### `ThreadFactory threadFactory` 线程工厂

用于创建线程池中的线程，使用默认即可。

#### `RejectedExecutionHandler handler` 拒绝策略

当任务队列满了，且没有空闲的工作线程，如果继续提交任务，线程池就执行拒绝策略。

| 拒绝策略            | 说明                                               |
| ------------------- | -------------------------------------------------- |
| AbortPolicy         | 默认策略，直接抛出RejectedExecutionException异常。 |
| DiscardPolicy       | 直接丢弃任务。                                     |
| DiscardOldestPolicy | 丢弃处于任务队列头部的任务，添加被拒绝的任务。     |
| CallerRunsPolicy    | 使用调用者所在线程执行被拒绝的任务。               |

[线程池之任务拒绝策略](https://blog.csdn.net/qq_14876133/article/details/132602368)



### execute() & submit() 的区别

- `execute()`方法只能提交Runnable任务，无返回值。
- `submit()`方法支持Runnable和Callbale任务，返回Future对象。

#### execute()方法提交Runnable任务

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

#### submit()方法提交Runnable任务

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

#### submit()方法提交Callable任务

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



### shutdown() & shutdownNow() 的区别

- `shutdown()`：关闭线程池，不再接收新任务，继续执行完任务队列中的任务。
- `shutdownNow()`：立即关闭线程池，不再接收新任务，返回任务队列中的未执行的任务。



## 线程池执行流程

![流程图](https://img-blog.csdnimg.cn/12267491dfdd4cdf968fad9d65052278.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_13,color_FFFFFF,t_70,g_se,x_16)

1. 首先检查线程池运行状态，如果不是RUNNING，则直接拒绝，线程池必须在RUNNING状态下执行任务。
1. 如果工作线程数<核心线程数，则创建并启动一个核心线程执行新提交的任务。
1. 如果工作线程数>=核心线程数，且阻塞队列未满，则将任务添加入阻塞队列中。
1. 如果工作线程数>=核心线程数，且任务队列已满，且工作线程数<最大线程数，则创建并启动一个线程执行新提交的任务。
1. 如果工作线程数>=最大线程数，则执行拒绝策略。

通俗理解：饭店(线程池) -> 厨子(线程) -> 人多先排队(阻塞队列) -> 招厨子(创建最大线程数) -> 今日满客(拒绝)



## 线程池大小的选择策略

- 如果是CPU密集型，则线程数设置为`CPU核数`或`CPU核数 + 1`;
- 如果是IO密集型，则线程数设置为`CPU核数 * 目标CPU利用率 * (1 + 平均等待时间 / 平均工作时间)`。





## 自定义线程工厂

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



### 不建议使用Executors创建线程池

- 不设置容量，底层是一个无界的阻塞队列，默认长度为Integer.MAX_VALUE。
- 对于一个无界队列来说，可以不断往里添加任务，可能会导致OOM。



## 合理配置线程池

- 可以通过`Runtime.getRuntime().availableProcessors()`获取核心数。
- CPU密集型任务：需要减少线程数量，降低线程之间切换造成的开销，可配置线程池大小为N+1。如：属性计算、图像处理等。
- IO密集型任务：需要增加线程数量，可配置线程大小为N*2+1。如：文件读写、网络通信。
- 混合型任务则可拆分为CPU密集型和IO密集型，独立配置。



## 线程池工具类

[ThreadUtils](https://github.com/Blankj/AndroidUtilCode/blob/master/lib/utilcode/src/main/java/com/blankj/utilcode/util/ThreadUtils.java)

