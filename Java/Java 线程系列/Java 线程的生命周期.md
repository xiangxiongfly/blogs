[TOC]

# Java 线程的生命周期

## 线程的生命周期

关于线程生命周期的不同状态，在 Java 5 以后，线程状态被明确定义在其内部枚举类型`java.lang.Thread.State`中，分别是：

- 新建（NEW）：线程对象被创建，但尚未启动，此时线程状态为NEW。
- 就绪（RUNNABLE）：可执行或正在执行的线程处于此状态。表示线程已经在JVM中运行，由于JVM需要计算资源，因此它可能正在运行或在等待系统分配给它CPU资源，在就绪队列里排队。
- 阻塞（BLOCKED）：线程可能会由于某些原因而阻塞，比如等待I/O操作活等待获取某个锁，此时线程状态为BLOCKED。
- 等待（WAITING）：线程调用wait()方法或join()方法等，使线程进入等待状态，此时线程状态为WAITING。
- 计时等待（TIMED_WAITING）：线程调用sleep()方法或wait()方法，使线程进入具有超时事件的等待状态，此时线程状态为TIMED_WAITING。
- 终止（TERMINATED）：线程执行完run()方法活因异常提前结束，线程的状态变为TERMINATED。



![在这里插入图片描述](https://img-blog.csdnimg.cn/25b48251cbee4e6bb141feadcafb6e9f.png)



## 一个线程两次不能调用start()方法

Java 的线程不允许启动两次，第二次调用时会抛出`IllegalThreadStateException`异常，当第二次调用时，该线程可能处于终止状态或其他状态，无法再次启动。



## 论证

### 论证NEW状态

```java
public class Demo {
    public static void main(String[] args) {
        Thread thread = new Thread();
        System.out.println("线程状态：" + thread.getState());
    }
}

//线程状态：NEW
```



### 论证RUNNABLE状态

```java
public class Demo {
    public static void main(String[] args) {
        Thread thread = new Thread();
        thread.start();
        System.out.println("线程状态：" + thread.getState());
    }
}

//线程状态：RUNNABLE
```



### 论证BLOCKED状态

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        Thread thread = new Thread(task);
        synchronized (task) {
            thread.start();
            System.out.println("线程状态：" + thread.getState());
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("线程状态：" + thread.getState());
        }
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        synchronized (this) {
            System.out.println("线程状态：" + Thread.currentThread().getState());
        }
    }
}

//线程状态：RUNNABLE
//线程状态：BLOCKED
//线程状态：RUNNABLE
```



### 论证WAITING状态

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        Thread thread = new Thread(task);
        thread.start();
        try {
            Thread.sleep(1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        synchronized (task) {
            System.out.println("线程状态2：" + thread.getState());
            task.notify();
        }
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        synchronized (this) {
            System.out.println("线程状态1：" + Thread.currentThread().getState());
            try {
                wait();
                System.out.println("线程状态3：" + Thread.currentThread().getState());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

//线程状态1：RUNNABLE
//线程状态2：WAITING
//线程状态3：RUNNABLE
```



### 论证WAITING状态

```java
public class Demo {
    public static void main(String[] args) {
        Task task = new Task();
        Thread thread = new Thread(task);
        thread.start();
        try {
            Thread.sleep(1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程状态2：" + thread.getState());
    }
}

class Task implements Runnable {
    @Override
    public void run() {
        synchronized (this) {
            System.out.println("线程状态1：" + Thread.currentThread().getState());
            try {
                Thread.sleep(2000L);
                System.out.println("线程状态3：" + Thread.currentThread().getState());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

//线程状态1：RUNNABLE
//线程状态2：TIMED_WAITING
//线程状态3：RUNNABLE
```



### 论证TERMINATED状态

```java
public class Demo {
    public static void main(String[] args) {
        Thread thread = new Thread();
        thread.start();
        try {
            Thread.sleep(1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程状态：" + thread.getState());
    }
}

//线程状态：TERMINATED
```



