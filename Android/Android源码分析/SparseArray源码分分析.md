[TOC]

# SparseArray源码分析

## 总结

- 在Android中，某些场景推荐使用SparseArray替代HashMap，其原因是SparseArray更加节省内存，查询效率更高。
- SparseArray内部使用双数组，分别存储Key值和Value值，Key是int类型数组，Value是Object类型数组。
- SparseArray内部使用二分查找定位Key数组中索引值，Key数组的元素是有序的。
- 使用DELETE标记表面删除元素时移动数组。



## 基本使用

```kotlin
val sparseArray = SparseArray<String>(5) //存储的数据类型

//增和改
sparseArray.put(1, "A")
sparseArray.put(3, "B")
sparseArray.put(5, "C")
sparseArray.put(2, "D")
sparseArray.put(4, "E")

//删
sparseArray.delete(2) //删除指定key
sparseArray.remove(3) //最终调用delete()
sparseArray.removeAt(0)  //删除指定索引

//查
val value = sparseArray.get(1) //根据key值获取value值
val key = sparseArray.keyAt(0) //根据索引获取key值
val value = sparseArray.valueAt(0) //根据索引索取value值

//遍历
sparseArray.forEach { 
    key, value ->
    Log.e("TAG", "$key ~ $value")
}
```



## 源码分析

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe0f2874429a42928a9921f9862a66c5.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)



### 基本属性

```java
public class SparseArray<E> implements Cloneable {
    //DELETE标记
    private static final Object DELETED = new Object();
    
    //是否可以调用gc()回收
    private boolean mGarbage = false;

    //Key数组
    private int[] mKeys;
    //Value数组
    private Object[] mValues;
    
    //元素数量
    private int mSize;

    //无参构造器
    public SparseArray() {
        //默认容量为10
        this(10);
    }

    //有参构造器，可以设置容量
    public SparseArray(int initialCapacity) {
        if (initialCapacity == 0) {
            mKeys = EmptyArray.INT;
            mValues = EmptyArray.OBJECT;
        } else {
            mValues = ArrayUtils.newUnpaddedObjectArray(initialCapacity);
            mKeys = new int[mValues.length];
        }
        mSize = 0;
    }
}
```



### get()

可以通过`get()`获取指定位置的元素

```java
public E get(int key) {
    return get(key, null);
}

public E get(int key, E valueIfKeyNotFound) {
    //通过二分查找获取key的索引值，
    int i = ContainerHelpers.binarySearch(mKeys, mSize, key);

    if (i < 0 || mValues[i] == DELETED) {
        //没找到key或value被删除，返回valueIfKeyNotFound值
        return valueIfKeyNotFound;
    } else {
        //合法的key返回具体值
        return (E) mValues[i];
    }
}
```



### put()

可以通过`put()`存储元素

```java
public void put(int key, E value) {
    //二分查找获取key的索引值
    int i = ContainerHelpers.binarySearch(mKeys, mSize, key);

    if (i >= 0) {
        //如果找到key，直接赋值
        mValues[i] = value;
    } else {
        //如果没有找到
        i = ~i;

        if (i < mSize && mValues[i] == DELETED) {
            //如果value值被DELETE标记，则直接赋值
            mKeys[i] = key;
            mValues[i] = value;
            return;
        }

        if (mGarbage && mSize >= mKeys.length) {
            gc();

            i = ~ContainerHelpers.binarySearch(mKeys, mSize, key);
        }

        //向Key数组中插入数据，GrowingArrayUtils.insert()会将元素插入到指定位置上，
        //如果空间不够，则会扩容，扩容机制：如果当前空间小于等于4，则扩容到8；如果当前空间大于4则2被扩容
        //本质操作是调用System.arraycopy()
        mKeys = GrowingArrayUtils.insert(mKeys, mSize, i, key);
        //向Value数组中插入数据
        mValues = GrowingArrayUtils.insert(mValues, mSize, i, value);
        mSize++;
    }
}
```



### delete()

可以通过`delete()`方法删除元素

SparseArray在做删除操作时，为了避免删除元素导致数组移动，同时为了方便插入数据时不移动数组，引入了DELETE标记，避免了频繁操作数组。

```java
public void delete(int key) {
    //二分查找获取索引值
    int i = ContainerHelpers.binarySearch(mKeys, mSize, key);

    if (i >= 0) {
        //value值被DELETE标记，表示元素被删除了
        if (mValues[i] != DELETED) {
            mValues[i] = DELETED;
            mGarbage = true;
        }
    }
}
```



### gc()

整理Key数组和Value数组

引入DELETE标记后，虽然数据被删除，但是仍然在数组中占据空间，会影响到一些操作，这时引入`gc()`方法清除DELETE标记，`put() / size()`等方法会触发`gc()`。

```java
private void gc() {
    int n = mSize;
    int o = 0;
    int[] keys = mKeys;
    Object[] values = mValues;

    for (int i = 0; i < n; i++) {
        Object val = values[i];

        //清理双数组中被DELETE标记的元素
        if (val != DELETED) {
            if (i != o) {
                keys[o] = keys[i];
                values[o] = val;
                values[i] = null;
            }
            o++;
        }
    }

    mGarbage = false;
    mSize = o;
}
```



## 其他

### ContainerHelpers类

```java
package android.util;

class ContainerHelpers {

    static int binarySearch(int[] array, int size, int value) {
        int lo = 0;
        int hi = size - 1;

        while (lo <= hi) {
            final int mid = (lo + hi) >>> 1;
            final int midVal = array[mid];

            if (midVal < value) {
                lo = mid + 1;
            } else if (midVal > value) {
                hi = mid - 1;
            } else {
                return mid;  // value found
            }
        }
        return ~lo;  // value not present
    }

    static int binarySearch(long[] array, int size, long value) {
        int lo = 0;
        int hi = size - 1;

        while (lo <= hi) {
            final int mid = (lo + hi) >>> 1;
            final long midVal = array[mid];

            if (midVal < value) {
                lo = mid + 1;
            } else if (midVal > value) {
                hi = mid - 1;
            } else {
                return mid;  // value found
            }
        }
        return ~lo;  // value not present
    }
}
```



### GrowingArrayUtils类

```java
package com.android.internal.util;

public final class GrowingArrayUtils {

    /**
     * Appends an element to the end of the array, growing the array if there is no more room.
     * @param array The array to which to append the element. This must NOT be null.
     * @param currentSize The number of elements in the array. Must be less than or equal to
     *                    array.length.
     * @param element The element to append.
     * @return the array to which the element was appended. This may be different than the given
     *         array.
     */
    public static <T> T[] append(T[] array, int currentSize, T element) {
        assert currentSize <= array.length;

        if (currentSize + 1 > array.length) {
            @SuppressWarnings("unchecked")
            T[] newArray = ArrayUtils.newUnpaddedArray(
                    (Class<T>) array.getClass().getComponentType(), growSize(currentSize));
            System.arraycopy(array, 0, newArray, 0, currentSize);
            array = newArray;
        }
        array[currentSize] = element;
        return array;
    }

    /**
     * Primitive int version of {@link #append(Object[], int, Object)}.
     */
    public static int[] append(int[] array, int currentSize, int element) {
        assert currentSize <= array.length;

        if (currentSize + 1 > array.length) {
            int[] newArray = ArrayUtils.newUnpaddedIntArray(growSize(currentSize));
            System.arraycopy(array, 0, newArray, 0, currentSize);
            array = newArray;
        }
        array[currentSize] = element;
        return array;
    }

    /**
     * Primitive long version of {@link #append(Object[], int, Object)}.
     */
    public static long[] append(long[] array, int currentSize, long element) {
        assert currentSize <= array.length;

        if (currentSize + 1 > array.length) {
            long[] newArray = ArrayUtils.newUnpaddedLongArray(growSize(currentSize));
            System.arraycopy(array, 0, newArray, 0, currentSize);
            array = newArray;
        }
        array[currentSize] = element;
        return array;
    }

    /**
     * Primitive boolean version of {@link #append(Object[], int, Object)}.
     */
    public static boolean[] append(boolean[] array, int currentSize, boolean element) {
        assert currentSize <= array.length;

        if (currentSize + 1 > array.length) {
            boolean[] newArray = ArrayUtils.newUnpaddedBooleanArray(growSize(currentSize));
            System.arraycopy(array, 0, newArray, 0, currentSize);
            array = newArray;
        }
        array[currentSize] = element;
        return array;
    }

    /**
     * Primitive float version of {@link #append(Object[], int, Object)}.
     */
    public static float[] append(float[] array, int currentSize, float element) {
        assert currentSize <= array.length;

        if (currentSize + 1 > array.length) {
            float[] newArray = ArrayUtils.newUnpaddedFloatArray(growSize(currentSize));
            System.arraycopy(array, 0, newArray, 0, currentSize);
            array = newArray;
        }
        array[currentSize] = element;
        return array;
    }

    /**
     * Inserts an element into the array at the specified index, growing the array if there is no
     * more room.
     *
     * @param array The array to which to append the element. Must NOT be null.
     * @param currentSize The number of elements in the array. Must be less than or equal to
     *                    array.length.
     * @param element The element to insert.
     * @return the array to which the element was appended. This may be different than the given
     *         array.
     */
    public static <T> T[] insert(T[] array, int currentSize, int index, T element) {
        assert currentSize <= array.length;

        if (currentSize + 1 <= array.length) {
            System.arraycopy(array, index, array, index + 1, currentSize - index);
            array[index] = element;
            return array;
        }

        @SuppressWarnings("unchecked")
        T[] newArray = ArrayUtils.newUnpaddedArray((Class<T>)array.getClass().getComponentType(),
                growSize(currentSize));
        System.arraycopy(array, 0, newArray, 0, index);
        newArray[index] = element;
        System.arraycopy(array, index, newArray, index + 1, array.length - index);
        return newArray;
    }

    /**
     * Primitive int version of {@link #insert(Object[], int, int, Object)}.
     */
    public static int[] insert(int[] array, int currentSize, int index, int element) {
        assert currentSize <= array.length;

        if (currentSize + 1 <= array.length) {
            System.arraycopy(array, index, array, index + 1, currentSize - index);
            array[index] = element;
            return array;
        }

        int[] newArray = ArrayUtils.newUnpaddedIntArray(growSize(currentSize));
        System.arraycopy(array, 0, newArray, 0, index);
        newArray[index] = element;
        System.arraycopy(array, index, newArray, index + 1, array.length - index);
        return newArray;
    }

    /**
     * Primitive long version of {@link #insert(Object[], int, int, Object)}.
     */
    public static long[] insert(long[] array, int currentSize, int index, long element) {
        assert currentSize <= array.length;

        if (currentSize + 1 <= array.length) {
            System.arraycopy(array, index, array, index + 1, currentSize - index);
            array[index] = element;
            return array;
        }

        long[] newArray = ArrayUtils.newUnpaddedLongArray(growSize(currentSize));
        System.arraycopy(array, 0, newArray, 0, index);
        newArray[index] = element;
        System.arraycopy(array, index, newArray, index + 1, array.length - index);
        return newArray;
    }

    /**
     * Primitive boolean version of {@link #insert(Object[], int, int, Object)}.
     */
    public static boolean[] insert(boolean[] array, int currentSize, int index, boolean element) {
        assert currentSize <= array.length;

        if (currentSize + 1 <= array.length) {
            System.arraycopy(array, index, array, index + 1, currentSize - index);
            array[index] = element;
            return array;
        }

        boolean[] newArray = ArrayUtils.newUnpaddedBooleanArray(growSize(currentSize));
        System.arraycopy(array, 0, newArray, 0, index);
        newArray[index] = element;
        System.arraycopy(array, index, newArray, index + 1, array.length - index);
        return newArray;
    }

    /**
     * Given the current size of an array, returns an ideal size to which the array should grow.
     * This is typically double the given size, but should not be relied upon to do so in the
     * future.
     */
    public static int growSize(int currentSize) {
        return currentSize <= 4 ? 8 : currentSize * 2;
    }

    // Uninstantiable
    private GrowingArrayUtils() {}
}
```

