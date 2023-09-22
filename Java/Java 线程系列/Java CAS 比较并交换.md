[TOC]

# Java CAS 比较并交换

## 概述

- Java CAS（Compare-and-Swap）是一种无锁算法，它基于比较并交换的思想来实现多线程之间的变量同步。

- 作用：是一种原子性操作，保证在多线程环境下实现线程安全。

- CAS操作包含三个操作数：内存值（V）、预期原值（A）和新值(B)。

  - 如果内存值等于预期原值时，将新值赋值给内存值。
  - 否则，不做操作。

- CAS操作的实现原理是利用CPU提供的原子操作指令，通过硬件保证了比较-更新操作的原子性 。

- CAS问题：

  - ABA问题：假如一个值原来是A，现在变为B，再后来变为A，那么CAS检查时会发现它的值没有发生变化，但是实际已经发生变化了。

    ABA问题的解决思路就是使用版本号。在变量前面追加上版本号，每次变量更新的时候把版本号加1，那么A→B→A就会变成1A→2B→3A。也可以使用Java提供的原子类AtomicMarkableReference、AtomicStampedReference。

  - 自旋CAS如果长时间不成功，会给CPU带来非常大的执行开销。默认自旋10次。

  - 当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁。

- 原子类：

  - 更新基本类型类：AtomicBoolean，AtomicInteger，AtomicLong
  - 更新数组类：AtomicIntegerArray，AtomicLongArray，AtomicReferenceArray
  - 更新引用类型：AtomicReference，AtomicMarkableReference，AtomicStampedReference

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d95c5f4fad24e2f9f453b84d1808d1d.png)



## 线程干扰问题

```java
public class Demo {

    public static int i = 0;

    public static void main(String[] args) {
        Thread thread = new Thread() {
            @Override
            public void run() {
                System.out.println("内存值：" + i);
                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                i = i + 1;
                System.out.println("新值：" + i);
            }
        };
        thread.start();
        try {
            Thread.sleep(50L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //干扰
        i = 5;
    }
}
```

输出：

```
内存值：0
新值：6
```

说明：预期值是1，最终返回值是6，这是因为受到其他线程的干扰，值在被篡改了。



## 使用CAS技术解决问题

```java
public class Demo {

    public static int i = 0;

    public static void main(String[] args) {
        Thread thread = new Thread() {
            @Override
            public void run() {
                int oldValue = i;
                System.out.println("内存值：" + oldValue);
                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                boolean result = compareAndSwap(i, oldValue, i + 1);
                System.out.println("设置是否成功：" + result);
                System.out.println("新值：" + i);
            }
        };
        thread.start();
        try {
            Thread.sleep(50L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        i = 5;
    }

    /**
     * 比较并交换
     *
     * @param oldValue      内存值
     * @param expectedValue 预期原值
     * @param newValue      新值
     * @return 				设置成功返回true；否则返回false
     */
    public static boolean compareAndSwap(int oldValue, int expectedValue, int newValue) {
        if (expectedValue == oldValue) {
            i = newValue;
            return true;
        } else {
            return false;
        }
    }
}
```

输出：

```
内存值：0
设置是否成功：false
新值：5
```

说明：CAS就是在做值操作前做一次判断是否被篡改。