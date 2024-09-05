[TOC]

# Java HashMap源码分析

## 前提

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9c21c22359b3455ab8b7dbae458fe9c0.png)

数据结构：

- JDK1.7：数组+链表。
- JDK1.8：数组+链表+红黑树。

初始化：

- JDK1.7：创建 HashMap 实例时，内部数组会立即初始化。
- JDK1.8：懒加载策略，第一次插入数据时，数组才会初始化，减少创建时开销。

hash冲突：

- JDK1.7：当发生哈希冲突时，使用链表解决冲突，每个桶都是一个链表的头节点，新元素会添加到链表头部。
- JDK1.8：Java 8 引入红黑树，当链表的长度超过阈值(默认为8)时，链表转为红黑树；当红黑树节点数小于6时，退化为链表。

数据插入方式：

- JDK1.7：头插法。
  - 新元素会插入到链表的头部。
  - 缺点：在多线程环境下，HashMap 进行扩容操作时，会出现环状链表，导致死循环。
- JDK1.8：尾插法。
  - 新元素会插入到链表的尾部。
  - 优点：避免环状链表。

扩容策略：

- JDK1.7：每次扩容都会重新计算每个元素在数组中的索引位置，增加性能耗费。
- JDK1.8：原位置 + 扩容长度（偏移值为扩容长度）。

JDK1.8 哈希计算：

- 根据 key 的 hash 值进行扰动计算，均匀分布减少碰撞几率。
- 代码：`(h = key.hashCode()) ^ (h >>> 16)`，获取 hash 值并位移16位进行异或运算。

JDK1.8 容积：

- 默认容积：16
- 默认负载因子：0.75

JDK1.8 扩容机制：

- 双倍扩容。
- 扩容之后，一部分元素在原位置，另外一部分元素移动到合适的位置上。

哈希表和哈希桶：

- 采用哈希函数将记录储存在一块连续的存储空间中，这块连续的储存空间就称之为哈希表。
- 哈希桶是解决哈希表冲突的一种方法，哈希表中同一个位置可能存有多个元素，为应对哈希冲突问题，将哈希表中的每个位置表示一个哈希桶。

红黑树：

- 链表不支持随机存取，只能单向遍历，效率很低，如果冲突比较严重，同一个index上的节点很多，那么链表就会很长，此时查找效率就会很低。

- 使用红黑树，可以将查找效率由原来的线性时间变为对数时间，也就是O(n)变为O(logn)，所以为了效率问题， 这里直接使用了红黑树，也就是二分的思想。冲突越严重，红黑树的效果就越明显，比如链表长度为1024时，采用链表的效率就是1024，而红黑树就是log(1024)=10，差了100倍!



## 数据结构

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e1429f00e89849989c57ef76ccdff755.png)



## 储存流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714163003148.png)



## 源码分析

### 继承关系

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable 
```

### 基本属性

```java
public class HashMap<K,V> {
    // 认初始容量为16
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    // 大容量，2的30次方,2,147,483,648
    static final int MAXIMUM_CAPACITY = 1 << 30;

    // 默认负载因子
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    // 转红黑树的阈值
    static final int TREEIFY_THRESHOLD = 8;

    // 转链表的阈值
    static final int UNTREEIFY_THRESHOLD = 6;

    // 桶数组树化的阈值
    static final int MIN_TREEIFY_CAPACITY = 64;

    // hash桶数组
    transient Node<K,V>[] table;

    // 负载因子
    final float loadFactor;

    // 阈值，超过则双倍扩容，threshold = 容积 * 负载因子
    int threshold;

    // 元素数量
    transient int size;
}
```

### HashMap 构造函数

```java
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}

public HashMap(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```

### Node 单链表节点

Node 是 HashMap 的一个内部类，用于存储 key-value 值，Node是一个单向链表结构。

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;

    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }
}
```

### TreeNode 红黑树节点

```java
static final class TreeNode<K,V> extends LinkedHashMap.LinkedHashMapEntry<K,V> {
    TreeNode<K,V> parent; // 父节点
    TreeNode<K,V> left; // 左子节点
    TreeNode<K,V> right; // 右子节点
    TreeNode<K,V> prev; // 前一个节点
    boolean red; // 标识
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
}
```

### hash() 哈希算法

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

说明：先计算hash值，再无符号右移16位，最后异或运算获取最终的hash值。

```
hash:       1011 1001
hash >>> 4: 0000 1011
^:          1011 0010
```

### put()

HashMap调用put()方法，会先将key值转hash值，通过二次哈希算法（高位运算和取模运算，目的是分散均匀，避免hash冲突），通过hash值计算存储位置。如果没有hash冲突，则将value值存放在指定位置，如果存在hash冲突，则尾插法放入单链表中，当单链表长度大于8时会转红黑树。

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;

    // 如果桶数组table为空，则通过resize()创建
    // 所以哈希表的创建是在第一次调用put()时
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

    // 先判断桶数组，如果没有hash冲突，则通过hash值找到指定坐标，插入桶数组
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    
    // 如果有hash冲突
    else {
        Node<K,V> e; K k;

        // 如果hash值、key引用地址、key值都相等，则新值覆盖旧值
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;

        // 如果是红黑树，则向树中插入值
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);

        // 如果是链表
        else {
            // 遍历链表节点
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    // 尾插法，在末尾插入新的节点
                    p.next = newNode(hash, key, value, null);

                    // 如果链表长度>8，则转红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) 
                        treeifyBin(tab, hash);
                    break;
                }

                // 判断链表中的元素，查找到相同的key值
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;

                // 更新p指向下一个节点
                p = e;
            }
        }

        // 新值覆盖旧值操作
        if (e != null) { 
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }

    ++modCount;

    // 如果容量大于阀值，则resize()扩容操作
    if (++size > threshold)
        resize();

    afterNodeInsertion(evict);
    return null;
}
```

说明：

- 插入数据时，如果桶数组为空，则通过 resize() 方法初始化table。
- 先判断桶数组中的元素是否存在，如果不存在则直接插入桶数字，如果存在则插入链表，如果链表长度达到阈值则转红黑树。
- 如果元素数量达到阈值，则通过 resize() 方法扩容。

### resize()

**扩容操作**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210714163036632.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

```java
//resize使用情况：1.初始化哈希表，2.扩容
final Node<K,V>[] resize() {
    // 扩容前的旧数组
    Node<K,V>[] oldTab = table;
    // 旧数组容量
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    // 扩容前的阈值
    int oldThr = threshold;

    int newCap, newThr = 0;

    if (oldCap > 0) {
        // 如果旧数组的容量大于最大值，则不扩容
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // 双倍扩容，通过旧容积和阈值计算新容积和阈值
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }

    else if (oldThr > 0) 
        // 初始化容积
        newCap = oldThr;
    else {               
        // 使用默认容积和负载因子
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }

    // 如果新阈值为0，则重新计算
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    // 更新阀值
    threshold = newThr;
    // 创建新的桶数组并设置容积
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;

    if (oldTab != null) {
        // 遍历旧的桶数组，将元素放入新的桶数组中
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;

                // 如果是桶数组的元素，则计算后放入新数组中
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;

                // 如果元素是红黑树节点，则插入红黑树中
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);

                // 如果元素是链表节点，则遍历链表，重新分组
                else { 
                    // 低位
                    Node<K,V> loHead = null, loTail = null;
                    // 高位
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // 链表元素重新分组，通过hash值和旧数组容量进行于操作
                        // 如果结果值为0，则元素的坐标不变
                        // 如果结果值为1，则元素的新坐标是原位置+旧数组长度
                        
                        // 原坐标
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // 新坐标
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 位置不变
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    // 新位置
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

说明：

- 计算新容积和阈值，并创建新的桶数组。
- 遍历旧数组的元素并重新分组到新数组中：
  - 如果是桶数组的元素，则通过 `e.hash & (newCap - 1)` 计算后插入新数组中。
  - 如果是红黑树节点，则插入红黑树中。
  - 如果是链表节点，则通过 `e.hash & oldCap` 计算，如果结果值为0，则元素位置不变，如果结果值为1，则位置是原位置+旧数组长度。

### remove()

```java
public V remove(Object key) {
    Node<K,V> e;
    return (e = removeNode(hash(key), key, null, false, true)) == null ? null : e.value;
}
```

```java
final Node<K,V> removeNode(int hash, Object key, Object value, boolean matchValue, boolean movable) {
    Node<K,V>[] tab; Node<K,V> p; int n, index;
    // 判断桶数组不能为空
    if ((tab = table) != null && (n = tab.length) > 0 && (p = tab[index = (n - 1) & hash]) != null) {
        Node<K,V> node = null, e; K k; V v;
        // 如果是桶数组的元素
        if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
            node = p;
        // 如果是链表或红黑树节点
        else if ((e = p.next) != null) {
            // 如果是红黑树节点
            if (p instanceof TreeNode)
                node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
            // 如果是链表节点
            else {
                // 遍历链表，查找指定节点
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key ||
                         (key != null && key.equals(k)))) {
                        node = e;
                        break;
                    }
                    p = e;
                } while ((e = e.next) != null);
            }
        }
        // 删除指定节点，并修复链表或红黑树
        if (node != null && (!matchValue || (v = node.value) == value ||
                             (value != null && value.equals(v)))) {
            if (node instanceof TreeNode)
                ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
            else if (node == p)
                tab[index] = node.next;
            else
                p.next = node.next;
            ++modCount;
            --size;
            afterNodeRemoval(node);
            return node;
        }
    }
    return null;
}
```