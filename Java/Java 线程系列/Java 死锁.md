[TOC]

# Java 死锁

## 概述

死锁是一种特定的程序状态，指由于两个或者多个线程之间，互相持有对方所需要的锁，导致这些线程处于阻塞状态，无法继续执行。

![请添加图片描述](https://img-blog.csdnimg.cn/769b8fe0289c44508223a9ae134fcf3f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)



## 案例

```java
Object lockA = new Object();
Object lockB = new Object();

Thread thread1 = new Thread("线程一") {
    @Override
    public void run() {
        super.run();
        synchronized (lockA) {
            System.out.println("执行任务1");
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (lockB) {
                System.out.println("执行任务2");
            }
        }
    }
};

Thread thread2 = new Thread("线程二") {
    @Override
    public void run() {
        super.run();
        synchronized (lockB) {
            System.out.println("执行任务3");
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (lockA) {
                System.out.println("执行任务4");
            }
        }
    }
};

thread1.start();
thread2.start();
```



## 定位死锁

使用 Java 提供的标准管理API，`ThreadMXBean`提供了用于定位的方法。对线程进行快照本身是一个相对重量级的操作，需要谨慎使用。

```java
public static void main(String[] args) {
    ThreadMXBean mbean = ManagementFactory.getThreadMXBean();
    Runnable dlCheck = new Runnable() {

        @Override
        public void run() {
            long[] threadIds = mbean.findDeadlockedThreads();
            if (threadIds != null) {
                ThreadInfo[] threadInfos = mbean.getThreadInfo(threadIds);
                System.out.println("Detected deadlock threads:");
                for (ThreadInfo threadInfo : threadInfos) {
                    System.out.println(threadInfo.getThreadName());
                }
            }
        }
    };

    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    //延迟5秒开始，每隔10秒扫描一次
    scheduler.scheduleAtFixedRate(dlCheck, 5L, 10L, TimeUnit.SECONDS);

    //TODO 死锁代码
}
```



## 避免死锁

- 按正确的顺序使用锁。
- 开发调用锁。
- 使用定时锁。

