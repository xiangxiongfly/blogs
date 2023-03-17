[TOC]

# 并发问题

## [Java内存模型详情](https://blog.csdn.net/qq_14876133/article/details/123525760)



## 多线程并发问题

### 可见性

可见性指一个线程对共享变量进行修改，其他线程要立即得到修改后的最新值。

#### 可见性问题测试

在并发编程中，可能会出现可见性问题，当一个线程对共享变量进行了修改，另外的线程没有理解看到修改后的最新数据。

下面的案例中，第二个线程已经修改了共享变量，但是第一个线程仍然还在继续执行。

```java
public class ThreadDemo {
    private static boolean flag = true;

    public static void main(String[] args) throws InterruptedException {

        new Thread(() -> {
            while (flag) {
            }
        }).start();

        Thread.sleep(2000);

        new Thread(() -> {
            while (flag) {
                flag = false;
                System.out.println("flag修改为false");
            }
        }).start();
    }
}
```



### 原子性

原子性指在相关操作时中途不会被其他线程干扰，一般通过同步机制实现。

#### 原子性问题测试

下面的案例中，多个线程操作一个共享变量时，当其中一个线程对共享变量操作到一半时，另外的线程也有可能操作共享变量，干扰了前一个线程的操作，导致最终输出的值会小于等于5000。

```java
public class ThreadDemo {
    private static int number = 0;

    public static void main(String[] args) throws InterruptedException {
        Runnable increment = () -> {
            for (int i = 0; i < 1000; i++) {
                number++;
            }
        };

        List<Thread> list = new ArrayList<Thread>();

        for (int i = 0; i < 5; i++) {
            Thread t = new Thread(increment);
            t.start();
            list.add(t);
        }

        for (Thread t : list) {
            t.join();
        }

        System.out.println("number=" + number);
    }
}
```



### 有序性

在Java中，为了提供程序的执行效率，在编译时和运行时会对代码进行优化重排，导致程序最终执行的顺序并不是我们编写时的顺序。如：现在需要执行3条指令，执行完第一条指令后，JVM发现第二条指令需要等待，就直接跳过执行第三条，执行完后再执行第二条。

有序性指保证线程内串行语义，避免指令重排等。

#### 有序性问题测试

```java
public class Demo {
    private static int x = 0;
    private static int y = 0;
    private static int a = 0;
    private static int b = 0;

    public static void main(String[] args) throws InterruptedException {
        long count = 0;
        while (true) {
            count++;
            x = y = a = b = 0;
            Thread t1 = new Thread(new Runnable() {
                @Override
                public void run() {
                    a = 1;
                    x = b;
                }
            });
            Thread t2 = new Thread(new Runnable() {
                @Override
                public void run() {
                    b = 2;
                    y = a;
                }
            });
            t1.start();
            t2.start();
            t1.join();
            t2.join();
            String result = "第" + count + "次" + "(x=" + x + ",y=" + y + ")";

            if (x == 0 && y == 0) {
                System.out.println(result);
                break;
            } else {
//                System.out.println(result);
            }
        }
    }
}

//第1580464次(x=0,y=0)
```

说明：当`x=0 y=0`时表示指令`x = b`和`y = a`都优先执行了。



## synchronized

### synchronized三大特性

- 可见性
- 原子性
- 有序性



### synchronized执行流程

```java
synchronized (锁对象) {
    //代码块
}
```

1. 线程获得锁
2. 清空工作内存
3. 从主内存拷贝共享变量的最新值到工作内存成为副本
4. 执行代码
5. 将修改后的副本的值刷新回主内存中
6. 线程释放锁



### synchronized与保证原子性

对`number++`增加同步代码块后，保证同一时间只有一个线程操作`number++`。

下面的案例中，最终输出的结果是50000正确的结果。

```java
public class ThreadDemo {
    private static int number = 0;
    private static Object obj = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable increment = () -> {
            for (int i = 0; i < 10000; i++) {
                synchronized (obj) {
                    number++;
                }
            }
        };

        List<Thread> list = new ArrayList<Thread>();

        for (int i = 0; i < 5; i++) {
            Thread t = new Thread(increment);
            t.start();
            list.add(t);
        }

        for (Thread t : list) {
            t.join();
        }

        System.out.println("number=" + number);
    }
}
```



### synchronized与可见性

执行synchronized时，会刷新工作内存中的共享变量副本。

下面案例中第二个线程执行后，2秒后，第一个线程就会执行完毕

```java
public class ThreadDemo {
    private static boolean flag = true;
    private static Object obj = new Object();

    public static void main(String[] args) throws InterruptedException {

        new Thread(() -> {
            while (flag) {
                synchronized (obj) {

                }
            }
        }).start();

        Thread.sleep(2000);

        new Thread(() -> {
            while (flag) {
                flag = false;
                System.out.println("flag修改为false");
            }
        }).start();
    }
}
```



### synchronized与有序性

为了提高程序的执行效率，编译器会CPU会对程序中的代码进行重排序。

synchronized保证有序性的原理：我们添加sychronized后，依然会发生重排序，只不过我们有同步代码块，可以保证只有一个线程执行同步代码块中的代码，保证了有序性。



### synchronized优化

**减少sychronized的范围**

同步代码块中尽量短，减少同步代码块中代码的执行时间，减少锁的竞争。

```java
synchronized(obj) {
    System.out,.println("hello");
}
```



**降低synchronize锁的粒度**

将一个锁拆分为多个锁提高并发度。



**读写分离**

读取数据不加锁，写和删除时添加锁。





## volatile

在多线程并发执行中，多个线程修改共享变量，会出现一个线程修改了共享变量，其他线程不能直接看到共享变量的最新值。



### volatile特性

- 可见性
- 有序性

volatile不能保证数据操作的原子性，在多线程环境下，要保证数据的安全性，需要使用锁机制。



### volatile执行流程

1. 子线程从主内存获取最新值到工作内存中
2. 子线程修改工作内存中的变量，并刷新主内存的值
3. 失效其他线程的副本
4. 其他线程从主内存读取最新值，放入工作内存中



### volatile使用场景

- volatile不能保证原子性，比较适合做纯复制操作，不适合类似`i++`这样的运算操作。
- volatile具有可见性和有序性，可以作为刷新之前变量的触发器。我们可以将某个变量设置为volatile修饰符，其他线程一旦发现该变量的值发生变化后，触发获取该变量的最新值。



## 双重检查单例模式

双重检查的优点：线程安全，延迟加载，效率较高。

```java
public class Singleton {
    private volatile static Singleton INSTANCE;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (INSTANCE == null) {
            synchronized (Singleton.class) {
                if (INSTANCE == null) {
                    INSTANCE = new Singleton();
                }
            }
        }
        return INSTANCE;
    }
}
```



## syncronized与volatile主要区别

- volatile只能修饰变量，保证了可见性、有序性，但不能保证原子性。
- synchronized可以修饰方法和代码块，保证了可见性、有序性、原子性，更多保证并发机制下的同步操作。
- volatile不会造成线程的阻塞，synchronized可能造成线程的阻塞。