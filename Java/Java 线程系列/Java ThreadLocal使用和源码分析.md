[TOC]

# ThreadLocal使用和源码分析

## 概述

- ThreadLocal即线程本地变量。
- 每个线程拥有一个属于自己的变量副本，不会和其他线程的变量副本冲突，实现了线程的数据隔离。
- ThreadLocal和Synchonized都用于解决多线程并发访问。但是是ThreadLocal与synchronized有本质的区别：
  - synchronized是利用锁的机制，使变量或代码块在某一时该仅仅能被一个线程访问。
  - ThreadLocal为每个线程都提供了变量的副本，使得每个线程在某一时间访问到的并非同一个对象，这样就隔离了多个线程对数据的数据共享。



## 基本使用

```java
//创建ThreadLocal对象
private static ThreadLocal<String> mThreadLocal = new ThreadLocal<>();

static class A implements Runnable {

    @Override
    public void run() {
        //设置数据
        mThreadLocal.set("线程A");
        //覆盖数据
        mThreadLocal.set("线程AAA");
        //获取数据
        System.out.println(mThreadLocal.get());
    }
}

static class B implements Runnable {

    @Override
    public void run() {
        mThreadLocal.set("线程B");
        System.out.println(mThreadLocal.get());
    }
}

public static void main(String[] args) {
    mThreadLocal.set("线程main");
    new Thread(new A()).start();
    new Thread(new B()).start();
    System.out.println(mThreadLocal.get());
}
```

输出信息：

```
线程main
线程AAA
线程B
```



## 源码简写

```java
public class Thread implements Runnable {
    ThreadLocalMap threadLocals;
}
```

```java
class ThreadLocalMap {
    Entry[] table;
}
```

```java
class Entry {
    ThreadLocal<?> k;
    Object v;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8e5df65be48a4ace8a1cbb7a1e9bf1af.png)



## 源码详细分析

### Thread

```java
public class Thread implements Runnable {
    ThreadLocal.ThreadLocalMap threadLocals = null;

    private void exit() {    
        threadLocals = null;
    }
}
```

### ThreadLocal

```java
public class ThreadLocal<T> {

    //创建ThreadLocalMap对象
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }

    //获取ThreadLocalMap对象
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    //设置ThreadLocal变量的值
    //获取当前线程，再获取ThreadLocalMap对象，如果map不为null进行set操作，map为null则进行创建操作
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }

    //获取ThreadLocal变量的值
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }

    //初始化ThreadLocal的值
    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            //创建
            createMap(t, value);
        return value;
    }

    //清除数据
    public void remove() {
        ThreadLocalMap m = getMap(Thread.currentThread());
        if (m != null)
            m.remove(this);
    }

    private void remove(ThreadLocal<?> key) {
        Entry[] tab = table;
        int len = tab.length;
        int i = key.threadLocalHashCode & (len-1);
        for (Entry e = tab[i];
             e != null;
             e = tab[i = nextIndex(i, len)]) {
            if (e.get() == key) {
                e.clear();
                expungeStaleEntry(i);
                return;
            }
        }
    }
}
```

### ThreadLocalMap

```java
static class ThreadLocalMap {

    //存储数据
    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;
        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }

    //table初始容量
    private static final int INITIAL_CAPACITY = 16;
    //table用于存储数据
    private Entry[] table;
    //下次扩容的阀值
    private int threshold; 
    //2/3的负载因子
    private void setThreshold(int len) {
        threshold = len * 2 / 3;
    }

    //初始化ThreadLocalMap，key为ThreadLocal
    ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
        table = new Entry[INITIAL_CAPACITY];
        int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
        table[i] = new Entry(firstKey, firstValue);
        size = 1;
        setThreshold(INITIAL_CAPACITY);
    }

    //设置数据
    private void set(ThreadLocal<?> key, Object value) {     
        Entry[] tab = table;
        int len = tab.length;
        //通过hash值获取索引值
        int i = key.threadLocalHashCode & (len-1);
		//遍历tab如果存在则更新
        for (Entry e = tab[i];
             e != null;
             e = tab[i = nextIndex(i, len)]) {
            ThreadLocal<?> k = e.get();
            //key相同，覆盖值
            if (k == key) {
                e.value = value;
                return;
            }
            //key为null，清空所有key为null的数据
            if (k == null) {
                replaceStaleEntry(key, value, i);
                return;
            }
        }
        //若不存在则直接添加
        tab[i] = new Entry(key, value);
        int sz = ++size;
        if (!cleanSomeSlots(i, sz) && sz >= threshold)
            rehash();
    }

    //获取数据
    private Entry getEntry(ThreadLocal<?> key) {
        int i = key.threadLocalHashCode & (table.length - 1);
        Entry e = table[i];
        if (e != null && e.get() == key)
            return e;
        else
            return getEntryAfterMiss(key, i, e);
    }
}
```



## 内存泄漏问题

ThreadLocalMap内部维护了一个Entry数组，在没有执行remove的情况下，将ThreadLocal设置为null，下次GC时，key是弱引用会被回收，value是强引用并指向对象就会一直存在内存中，这样会发生内存泄露。

所以ThreadLocal使用后需要及时remove掉。