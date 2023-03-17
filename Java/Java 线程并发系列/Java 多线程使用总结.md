[TOC]

# Java多线程总结

## 进程与线程区别

- 进程与进程之间是没有关联的，一个应用对应一个进程。

- 线程是依赖于进程，线程之间是可以共享资源，线程是程序执行的最小单位。



## 创建线程

### 实现Runnable接口

```java
class MyRunnable implements Runnable {
    private Thread thread;
    private String threadName;

    public MyRunnable(String threadName) {
        this.threadName = threadName;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < 4; i++) {
                System.out.println("Thread: " + threadName + "," + 1);
                Thread.sleep(50);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
            System.out.println("Thread: " + threadName + "中断");
        }
        System.out.println("Thread: " + threadName + "退出");
    }

    public void start() {
        if (thread == null) {
            thread = new Thread(this, threadName);
            thread.start();
        }
    }
}

MyRunnable r1 = new MyRunnable("线程1");
r1.start();
MyRunnable r2 = new MyRunnable("线程2");
r2.start();
```



### 继承Thread类

```java
class MyThread extends Thread {
    private Thread thread;
    private String threadName;

    public MyThread(String name) {
        super(name);
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < 4; i++) {
                System.out.println("Thread: " + getName() + "," + i);
                Thread.sleep(50);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
            System.out.println("Thread: " + getName() + "中断");
        }
        System.out.println("Thread: " + getName() + "退出");
    }
}


MyThread t1 = new MyThread("线程1");
t1.start();
MyThread t2 = new MyThread("线程2");
t2.start();    
```



### Callable

带返回值的线程。

```java
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
Callable callable = new Callable<String>() {

    @Override
    public String call() throws Exception {
        Thread.sleep(2000L);
        return "完成";
    }
};

Future<String> submit = cachedThreadPool.submit(callable);
while (true) {
    if (submit.isDone()) {
        try {
            //get会阻塞当前线程
            String result = submit.get();
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
        break;
    }
}
```



## 线程的状态

![在这里插入图片描述](https://img-blog.csdnimg.cn/282e2e4d865e4af3be523d8aa9b0f86e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_14,color_FFFFFF,t_70,g_se,x_16)



## join()

当调用`join()`后，会阻塞当前线程，直到该线程任务执行结束，当前线程再继续执行。

```java
Thread t = new Thread(new Runnable() {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
});
t.start();
t.join();
System.out.println("end");
```

输出信息：

```
0
1
2
3
4
end
```

注：如果没有使用join，end可能不在4之后输出。



## sleep()

`Thread.sleep()`可以让当前线程睡眠一段时间，可以释放CPU资源给其他线程使用。



## interrupt()

`interrupt()`并不是直接中断线程，而是标记线程为中断状态，这时需要开发者需要再次判断，通常在耗时操作前判断是否需要继续执行。

```java
//子线程1秒后停止打印

Thread thread = new Thread() {
    @Override
    public void run() {
        for (long i = 0L; i < 100000000L; i++) {
            if (isInterrupted()) {
                return;
            }

            System.out.println("number: " + i);
        }
    }
};
thread.start();

try {
    Thread.sleep(1000L);
} catch (InterruptedException e) {
    e.printStackTrace();
}
thread.interrupt();
```



## wait() & notify & notifyAll()

- wait()：当前线程进入等待状态，释放锁资源
- notify()：只会唤醒一个线程
- notifyAll()：唤醒全部线程
- wait()与sleep()的区别：wait()会释放锁资源。sleep()不会释放锁

**wait-notify**

notify只会唤醒一个线程，另外一个仍然等待

```java
new Thread(() -> {
    synchronized (lock) {
        System.out.println("t1 wait");
        try {
            lock.wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("t1 wait end");
    }
}).start();

new Thread(() -> {
    synchronized (lock) {
        System.out.println("t2 wait");
        try {
            lock.wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("t2 wait end");
    }
}).start();

Thread.sleep(3000);
new Thread(() -> {
    synchronized (lock) {
        lock.notify();
    }
}).start();
```

```
t1 wait
t2 wait
t1 wait end
```

**wait-nofity**

notifyAll会唤醒所有线程

```java
new Thread(() -> {
    synchronized (lock) {
        System.out.println("t1 wait");
        try {
            lock.wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("t1 wait end");
    }
}).start();

new Thread(() -> {
    synchronized (lock) {
        System.out.println("t2 wait");
        try {
            lock.wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("t2 wait end");
    }
}).start();

Thread.sleep(3000);
new Thread(() -> {
    synchronized (lock) {
        lock.notifyAll();
    }
}).start();
```

```
t1 wait
t2 wait
t1 wait end
t2 wait end
```



## yield

短暂释放锁资源，让给同优先级的线程 ，比wait()更短。



## 线程同步问题

### 不加锁

不加锁时会导致多个线程共享同一资源时，导致数据不同步的问题，属于线程不安全操作。

```java
public class ThreadTest1 {

    int i = 0;
    private void count() {
        i++;
    }

    public void execute() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 100000; i++) {
                    count();
                }
                System.out.println("thread1 " + i);
            }
        }).start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 100000; i++) {
                    count();
                }
                System.out.println("thread2 " + i);
            }
        }).start();
    }
}
```

输出：

```
thread1 117075
thread2 126826
```



### synchronized

synchronized称为内置锁机制，用于确保多个线程在同一时刻，只能有一个线程在方法或同步块中。

synchronized特性：可见性、原子性、有序性。

```java
public class ThreadTest2 {

    int i = 0;
    private synchronized void count() {
        i++;
    }

    public void execute() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 100000; i++) {
                    count();
                }
                System.out.println("thread1 " + i);
            }
        }).start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 100000; i++) {
                    count();
                }
                System.out.println("thread2 " + i);
            }
        }).start();
    }
}
```

**输出**

```
thread1 198429
thread2 200000
```



### volatile

在多线程并发执行中，多个线程修改共享变量，会出现一个线程修改了共享变量，其他线程不能直接看到共享变量的最新值。

volatile特性：可见性、有序性。

```java
public class ThreadTest3 {

    private volatile boolean isRun = true;

    private void stop() {
        isRun = false;
    }

    public void execute() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (isRun) {

                }
            }
        }).start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        stop();
    }
}
```



### Lock

Lock比synchronized粒度更小，更灵活。

```java
ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
Lock readLock = lock.readLock();
Lock writeLock = lock.writeLock();

private void save() {
    writeLock.lock();
    try {
        i++;
    } finally {
        writeLock.unlock();
    }
}

private void get() {
    readLock.lock();
    try {
        System.out.println(i);
    }finally {
        readLock.unlock();
    }
}
```



## 线程安全的集合

### Collections

Collections类提供了一些线程安全的类，其本质是在操作方法里使用synchronized关键字。

```java
List list = Collections.synchronizedList(new ArrayList<>());
Set set = Collections.synchronizedSet(new HashSet<>());
Map map = Collections.synchronizedMap(new HashMap<>());
```



### java.util.concurrent.*

Java提供了一些并发工具类，在`java.util.concurrent`包下。

```java
//CopyOnWriteArrayList和CopyOnWriteArraySet本质是对操作方法加lock
CopyOnWriteArrayList list = new CopyOnWriteArrayList();
CopyOnWriteArraySet set = new CopyOnWriteArraySet();

//本质是CAS+synchronized
ConcurrentHashMap map=new ConcurrentHashMap();
```



### 阻塞队列

在`java.util.concurrent`包下。

```java
ArrayBlockingQueue queue1 = new ArrayBlockingQueue(capacity);
LinkedBlockingQueue<Person> queue2 = new LinkedBlockingQueue<Person>();
```



## 单例模式—双重检验锁

```java
public class Singleton {
    private volatile static Singleton instance = null;

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```



## [线程的生命周期](https://blog.csdn.net/qq_14876133/article/details/122864380)



## [死锁](https://blog.csdn.net/qq_14876133/article/details/122864774?spm=1001.2014.3001)



## [多线程并发问题 & synchronized & volatile](https://blog.csdn.net/qq_14876133/article/details/90717489)



## [生产消费模式](https://blog.csdn.net/qq_14876133/article/details/122865593)



## [线程池的使用](https://blog.csdn.net/qq_14876133/article/details/100542811)



