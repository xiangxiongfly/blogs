[TOC]

# Java 多线程基本使用

## 进程与线程区别

- 进程与进程之间是没有关联的，一个应用对应一个进程。

- 线程是依赖于进程，是CPU调度的最小单位，线程之间是可以共享资源。



## 多线程的创建

### 继承Thread类

使用场景：单继承。

```java
public class Demo {
    public static void main(String[] args) {
        MyThread threadA = new MyThread("线程A");
        threadA.start();
        MyThread threadB = new MyThread("线程B");
        threadB.start();
    }
}

class MyThread extends Thread {

    public MyThread(String threadName) {
        super(threadName);
    }

    @Override
    public void run() {
        super.run();
        for (int i = 0; i < 3; i++) {
            System.out.println("Thread: " + getName() + " , " + i);
            try {
                Thread.sleep(50L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### 实现Runnable接口

使用场景：无返回值任务。

```java
public class Demo {
    public static void main(String[] args) {
        MyRunnable runnable = new MyRunnable();
        Thread threadA = new Thread(runnable, "线程A");
        threadA.start();
    }
}

class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
            try {
                Thread.sleep(50L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### 实现Callable接口

使用场景：有返回值任务。

```java
public class Demo {
    public static void main(String[] args) {
        MyCallable callable = new MyCallable();
        FutureTask<String> futureTask = new FutureTask<>(callable);
        Thread thread = new Thread(futureTask);
        thread.start();
        try {
            String str = futureTask.get();
            System.out.println(str);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}

class MyCallable implements Callable<String> {

    @Override
    public String call() throws Exception {
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
            try {
                Thread.sleep(50L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return "hello world";
    }
}
```



## 基本使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/0574abd66a95450dae0ef109f7ecefbc.png)



### run()与start()的区别

- start：会开启一个新线程，只能调用一次，是同步方法。
- run：运行任务的地方，可以多次调用，非同步方法。



### currentThread()

使用`currentThread()`方法可以获取当前正在执行的线程。

```java
Thread thread = Thread.currentThread();
System.out.println(thread); //Thread[线程A,5,main]，包含：线程名、优先级、线程组

String threadName = thread.getName(); //获取线程名
int priority = thread.getPriority(); //获取线程优先级
```




### join()

当调用`join()`后，会阻塞当前线程，该线程执行完后当前线程再继续执行。

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



### sleep()

`Thread.sleep()`可以让当前线程睡眠一段时间，可以释放CPU资源给其他线程使用，不会释放锁。



### yield

让当前线程放弃权，短暂释放锁资源，让给同优先级的线程 ，比wait()更短。

```java
public class Demo {
    public static void main(String[] args) {
        new Thread(new ValueTask()).start();
        new Thread(new PrintTask()).start();
    }
}

class ValueTask implements Runnable {
    public static int value = 0;
    @Override
    public void run() {
        try {
            Thread.sleep(3000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        value = 100;
    }
}

class PrintTask implements Runnable {
    @Override
    public void run() {
        while (ValueTask.value == 0) {
            Thread.yield();
        }
        System.out.println("hello world");
    }
}
```

说明：当value不等于0时，yield短暂让出执行权，直到value等于100，才输出“hello world”。



### wait() & notify & notifyAll()

- wait()：当前线程进入等待状态，释放锁资源
- notify()：只会唤醒一个线程
- notifyAll()：唤醒全部线程

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

**wait-nofityAll**

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



### wait与sleep区别

- sleep方法是位于Object类，wait方法是在Thread类中；
- sleep不会释放锁资源，wait会释放锁资源；

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        new Thread(task).start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (task) {
                    System.out.println("hello world");
                }
            }
        }).start();
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        synchronized (this) {
            try {
                Thread.sleep(10_000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

说明：sleep不会释放锁资源，所以“hello world” 10秒后才会打印。

```java

public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        new Thread(task).start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (task) {
                    System.out.println("hello world");
                }
            }
        }).start();
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        synchronized (this) {
            try {
                this.wait(10_000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

说明：wait会释放锁资源，“hello world”会立即被打印。



### 守护线程

设置为守护线程的线程会随着主线程的结束而结束。

```java
public static void main(String[] args) {
    Thread thread = new Thread() {
        @Override
        public void run() {
            for (long i = 0L; i < 100000000L; i++) {
                System.out.println("number: " + i);
            }
        }
    };
    thread.setDaemon(true);
    thread.start();

    try {
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```



## 优雅中断线程

### interrupt()

`interrupt()`并不是直接中断线程，而是标记线程为中断状态，这时需要开发者需要再次判断，通常在耗时操作前判断是否需要继续执行。

```java
//子线程1秒后停止打印
public static void main(String[] args) {
    Thread thread = new Thread() {
        @Override
        public void run() {
            for (long i = 0L; i < 100000000L; i++) {
                if (isInterrupted()) { //判断
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
    thread.interrupt(); //标记线程中断
}
```

### 自定义变量

```java
private static volatile boolean interrupt = false;

public static void main(String[] args) {
    Thread thread = new Thread() {
        @Override
        public void run() {
            for (long i = 0L; i < 100000000L; i++) {
                if (interrupt) { //判断
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
    interrupt = true;
}
```



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

synchronized被称为隐式锁，Lock被称为显示锁。Lock与synchronized一样可以实现线程同步，但比synchronized更强大，粒度更小，更灵活。

- `lock()`获取锁。
- `unlock()`释放锁。

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        new Thread(task).start();
        new Thread(task).start();
    }
}

class Task implements Runnable {
    private Lock lock = new ReentrantLock();

    @Override
    public void run() {
        lock.lock();
        try {
            Thread.sleep(3000L);
            System.out.println(Thread.currentThread().getName() + " hello world");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```



### 原子类

原子类指具有原子性的类。如：AtomicInteger、AtomicBoolean等。这里已AtomicBoolean为例：

- AtomicBoolean()：创建AtomicBoolean对象，默认值为false。
- AtomicBoolean(boolean)：创建指定初始值的AtomicBoolean对象。
- get()：获取值。
- set()：设置值。
- getAndSet()：先获取值再设置值。
- comparseAndSet()：以CAS形式更新数据。

```java
public class Demo {

    public static AtomicBoolean stopped = new AtomicBoolean(false);

    public static void main(String[] args) {
        Thread thread = new Thread() {
            @Override
            public void run() {
                while (!stopped.get()) {

                }
            }
        };
        thread.start();
        try {
            Thread.sleep(1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        stopped.set(true);
    }
}
```

说明：1秒钟后程序停止运行。



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


