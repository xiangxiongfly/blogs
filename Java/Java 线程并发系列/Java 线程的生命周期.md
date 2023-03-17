[TOC]

# Java 线程的生命周期

## 线程的生命周期

关于线程生命周期的不同状态，在 Java 5 以后，线程状态被明确定义在其内部枚举类型`java.lang.Thread.State`中，分别是：

- 新建（NEW）：刚创建的线程处于此状态。
- 就绪（RUNNABLE）：可执行或正在执行的线程处于此状态。表示线程已经在JVM中运行，由于执行需要计算资源，它可能正在运行，也可能在等待系统分配给它CPU资源，在就绪队列里排队。
- 阻塞（BLOCKED）：被阻塞等待锁的线程处于此状态。如：线程试图通过synchronized获取某个锁，但是其他线程已经占用了，那么当前线程就处于阻塞状态。
- 等待（WAITING）：无限期等待的线程处于此状态。如：让当前线程进入等待（wait），然后在通过notify唤醒，通知当前线程继续工作。
- 计时等待（TIMED_WAITING）：与等待状态类似，但是调用的是存在超时条件的方法，如：`wait`或`join`等方法。
- 终止（TERMINATED）：无论是意外退出还是正常执行结束，已结束的线程处于此状态。



![在这里插入图片描述](https://img-blog.csdnimg.cn/cc2739398d71401d824f8432648d03a1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



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



