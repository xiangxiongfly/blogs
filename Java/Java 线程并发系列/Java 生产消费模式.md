# 生产消费模式

## 方式一：synchronized & wait & notifyAll

```java
public class Test1 {
    public static void main(String[] args) {
        Shop shop = new Shop();
        Producer producer1 = new Producer("生产者-A", shop);
        Producer producer2 = new Producer("生产者-B", shop);
        Consumer consumer1 = new Consumer("消费者-1", shop);
        Consumer consumer2 = new Consumer("消费者-2", shop);
        Consumer consumer3 = new Consumer("消费者-3", shop);

        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();
        consumer3.start();
    }
}

//商品类
class Goods {
    public String name;

    public Goods(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Goods{" +
            "name='" + name + '\'' +
            '}';
    }
}

//仓库类
class Shop {
    public static final int MAX = 10;
    LinkedList<Goods> list = new LinkedList<>();
    private int count = 0;

    //生产商品
    public void put() {
        while (true) {
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (this) {
                //必须使用while，避免多个线程被同时唤醒
                while (list.size() == MAX) {
                    try {
                        System.out.println("======仓库满了，停止生产");
                        wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                count++;
                Goods goods = new Goods("商品" + count);
                list.add(goods);
                System.out.println(Thread.currentThread().getName() + " 生产 " + goods + "，库存" + list.size());
                notifyAll();
            }
        }
    }

    //消费商品
    public void get() {
        while (true) {
            try {
                Thread.sleep(new Random().nextInt(1000) * 2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (this) {
                while (list.size() == 0) {
                    try {
                        System.out.println("======仓库空了，停止消费");
                        wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                Goods goods = list.removeFirst();
                System.out.println(Thread.currentThread().getName() + " 消费 " + goods + "，库存" + list.size());
                notifyAll();
            }
        }
    }
}

//生产者
class Producer extends Thread {
    Shop shop;

    public Producer(String name, Shop shop) {
        super(name);
        this.shop = shop;
    }

    @Override
    public void run() {
        super.run();
        shop.put();
    }
}

//消费者
class Consumer extends Thread {
    Shop shop;

    public Consumer(String name, Shop shop) {
        super(name);
        this.shop = shop;
    }

    @Override
    public void run() {
        super.run();
        shop.get();
    }
}
```

注：wait那里使用while是为了避免虚唤醒，即如果有多个线程被`wait`阻塞，接着`notifyAll`后被唤醒，会导致全部线程唤醒进行生产，那么在消费时会出现问题。



## 方式二：lock & await & signalAll

```java
public class Test2 {
    public static void main(String[] args) {
        Shop shop = new Shop();
        Producer producer1 = new Producer("生产者-A", shop);
        Producer producer2 = new Producer("生产者-B", shop);
        Consumer consumer1 = new Consumer("消费者-1", shop);
        Consumer consumer2 = new Consumer("消费者-2", shop);
        Consumer consumer3 = new Consumer("消费者-3", shop);

        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();
        consumer3.start();
    }
}

//商品类
class Goods {
    public String name;

    public Goods(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Goods{" +
            "name='" + name + '\'' +
            '}';
    }
}

//仓库类
class Shop {
    public static final int MAX = 10;
    LinkedList<Goods> list = new LinkedList<>();
    private int count = 0;
    final Lock lock = new ReentrantLock();
    final Condition put = lock.newCondition();
    final Condition get = lock.newCondition();

    //生产商品
    public void put() {
        while (true) {
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            lock.lock();
            try {
                while (list.size() == MAX) {
                    try {
                        System.out.println("======仓库满了，停止生产");
                        put.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                count++;
                Goods goods = new Goods("商品" + count);
                list.add(goods);
                System.out.println(Thread.currentThread().getName() + " 生产 " + goods + "，库存" + list.size());
                get.signalAll();
            } finally {
                lock.unlock();
            }
        }
    }

    //消费商品
    public void get() {
        while (true) {
            try {
                Thread.sleep(new Random().nextInt(1000) * 2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            lock.lock();
            try {
                while (list.size() == 0) {
                    try {
                        System.out.println("======仓库空了，停止消费");
                        get.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                Goods goods = list.removeFirst();
                System.out.println(Thread.currentThread().getName() + " 消费 " + goods + "，库存" + list.size());
                put.signalAll();
            } finally {
                lock.unlock();
            }
        }
    }
}

//生产者
class Producer extends Thread {
    Shop shop;

    public Producer(String name, Shop shop) {
        super(name);
        this.shop = shop;
    }

    @Override
    public void run() {
        super.run();
        shop.put();
    }
}

//消费者
class Consumer extends Thread {
    Shop shop;

    public Consumer(String name, Shop shop) {
        super(name);
        this.shop = shop;
    }

    @Override
    public void run() {
        super.run();
        shop.get();
    }
}
```



## 方式三：ArrayBlockingQueue

利用ArrayBlockingQueue阻塞队列，当缓冲区满了或空了就会等待阻塞。

```java
//生产者
class Producer extends Thread {
    public static final int max = 10;
    private ArrayBlockingQueue<Goods> queue;
    private int count;

    public Producer(String name, ArrayBlockingQueue<Goods> queue) {
        super(name);
        this.queue = queue;
    }

    @Override
    public void run() {
        super.run();
        while (true) {
            try {
                Thread.sleep(1000L);
                int num = new Random().nextInt(5);
                for (int i = 0; i < num; i++) {
                    count++;
                    Goods goods = new Goods("商品" + count);
                    queue.put(goods);
                    System.out.println(Thread.currentThread().getName() + "生产一个商品" + goods + "，库存" + queue.size());
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

```java
//消费者
class Consumer extends Thread {
    public static final int max = 10;
    private ArrayBlockingQueue<Goods> queue;

    public Consumer(String name, ArrayBlockingQueue<Goods> queue) {
        super(name);
        this.queue = queue;
    }

    @Override
    public void run() {
        super.run();
        while (true) {
            try {
                Thread.sleep(1000L);
                Goods goods = queue.take();
                System.out.println(Thread.currentThread().getName() + "消费一个商品" + goods + "，库存" + queue.size());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

```java
//生产-消费模式
ArrayBlockingQueue<Goods> queue = new ArrayBlockingQueue<>(10);
Producer producer1 = new Producer("生产者A", queue);
Producer producer2 = new Producer("生产者B", queue);
Producer producer3 = new Producer("生产者C", queue);
Consumer consumer1 = new Consumer("消费者1", queue);
Consumer consumer2 = new Consumer("消费者2", queue);
Consumer consumer3 = new Consumer("消费者3", queue);

producer1.start();
producer2.start();
producer3.start();
consumer1.start();
//consumer2.start();
//consumer3.start();
```

