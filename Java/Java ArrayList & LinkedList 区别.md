[TOC]

# Java ArrayList & LinkedList 区别

## ArrayList

- ArrayList底层是动态数组实现的，数组是一块连续的内存，是线程不安全的。
- ArrayList会根据需要调整容量，每次扩容增加50%。
- ArrayList内部元素以数组形式顺序存储，所以查询效率高。除了尾部插入和删除元素，其他位置性能较差，如我们在中间位置插入一个元素，需要移动后续所有元素。



## LinkedList

- LinkedList是Java提供的双向链表，所以不需要扩容，它也是线程不安全的。
- LinkedList进行节点插入、删除高效很多，但是查询效率要低于动态数组。



## SynchronizedList

SynchronizedList是线程安全的List，它的get、set、add等方法都使用synchronized同步支持。

```java
List list = Collections.synchronizedList(new ArrayList<>());
```



## [ArrayList源码分析](https://blog.csdn.net/qq_14876133/article/details/105360236)



## [LinkedList源码分析](https://blog.csdn.net/qq_14876133/article/details/105411619)


