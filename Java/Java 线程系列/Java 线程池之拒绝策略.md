[toc]

# Java 线程池之任务拒绝策略

## 概述

线程池有4种任务拒绝策略：

| 任务拒绝策略        | 说明                                               |
| ------------------- | -------------------------------------------------- |
| AbortPolicy         | 默认策略，直接抛出RejectedExecutionException异常。 |
| DiscardPolicy       | 直接丢弃任务。                                     |
| DiscardOldestPolicy | 丢弃处于任务队列头部的任务，添加被拒绝的任务。     |
| CallerRunsPolicy    | 使用调用者所在线程执行被拒绝的任务。               |



## 测试AbortPolicy默认

```java
public class Test {
    public static void main(String[] args) {

        /**
         * 核心线程数为1
         * 最大线程数为1
         * 任务队列长度为2
         */
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 1,
                0L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<Runnable>(2),
                new ThreadPoolExecutor.AbortPolicy());
        try {
            threadPool.execute(new Task(1));
            threadPool.execute(new Task(2));
            threadPool.execute(new Task(3));
            threadPool.execute(new Task(4));
        } finally {
            threadPool.shutdown();
        }
    }
}

class Task implements Runnable {
    private final int index;

    public Task(int index) {
        this.index = index;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " : " + index);
    }
}
```

输出信息：

```
pool-1-thread-1 : 1
pool-1-thread-1 : 2
pool-1-thread-1 : 3
Exception in thread "main" java.util.concurrent.RejectedExecutionException:
```

说明：

执行3个任务后抛出异常。

### 源码分析：

```java
public static class AbortPolicy implements RejectedExecutionHandler {

    public AbortPolicy() { }

    /**         
         *总是抛出RejectedExecutionException。
         */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        throw new RejectedExecutionException("Task " + r.toString() +
                                             " rejected from " +
                                             e.toString());
    }
}
```



## 测试DiscardPolicy

还是上面的代码，将任务拒绝策略改为DiscardPolicy。

```java
ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 1,
                0L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<Runnable>(2),
                new ThreadPoolExecutor.DiscardPolicy());
```

输出信息：

```
pool-1-thread-1 : 1
pool-1-thread-1 : 2
pool-1-thread-1 : 3
```

说明：

执行了3个任务后，第4个任务被丢弃了。

### 源码分析：

```java
public static class DiscardPolicy implements RejectedExecutionHandler {

    public DiscardPolicy() { }

    /**
         * 不执行任何操作，其效果是丢弃任务
         */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
    }
}
```



## 测试DiscardOldestPolicy

```java
ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 1,
                0L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<Runnable>(2),
                new ThreadPoolExecutor.DiscardOldestPolicy());
```

输出信息：

```
pool-1-thread-1 : 1
pool-1-thread-1 : 3
pool-1-thread-1 : 4
```

说明：

执行了第1个任务，且任务队列保持第2个、第3个任务，添加第4个任务时，丢弃了第2个任务。

### 源码分析：

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {

    public DiscardOldestPolicy() { }

    /**
         * 丢弃队列中头部任务
         */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            e.getQueue().poll();
            e.execute(r);
        }
    }
}
```



## 测试CallerRunsPolicy

```java
ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 1,
                0L, TimeUnit.SECONDS,
                new LinkedBlockingDeque<Runnable>(2),
                new ThreadPoolExecutor.CallerRunsPolicy());
```

输出信息：

```
main : 4
pool-1-thread-1 : 1
pool-1-thread-1 : 2
pool-1-thread-1 : 3
```

说明：

前3个任务都线程池中的线程执行的，最后一个任务是有main线程执行的。

### 源码分析：

```java
public static class CallerRunsPolicy implements RejectedExecutionHandler {

    public CallerRunsPolicy() { }

    /**
         * 在调用者的线程中执行任务
         */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```

