# Java hashCode和equals

## hashCode和equals是什么

- `hashCode()`方法和`equals()`方法的作用是一样的，用于对比两个对象是否相等。
- 重写`equals()`方法一般用于比较复杂的比较，效率相对较低；而利用`hashCode()`进行对比，则只需要生成一个hashCode值，效率较高。



## hashCode和equals关系

hashCode值不是完全可靠的，有时候不同的对象生成的hashCode值可能会一样，所以hashCode值大部分时候可靠，并不是完全可靠：

- equals()相等，则hashCode()一定相等，所以equals是可靠的
- hashCode相等，equals不一定相等，所以hashCode是不可靠的



## 什么时候需要重写hashCode

这种大量且快速的对象对比一般用于hash容器中，如HashSet、HashMap、HashTable等，HashSet要求对象不能重复。如果只重写`equals()`方法，在使用HashSet时，就会出现两个内容相同的对，因此也要重写`hashCode()`方法

需要做大量且快速对比时，首先用hashCode比较，如果hashCode不一样，则两对象一定不相等；如果hashCode相等，则再比较他们的equals；如果equals也相等，则表示两对象完全相等，这样操作提高了效率也保证了正确性。



## hash冲突

在HashMap中，会先获取key的hashCode值，找到数组中对应的桶位置，再通过key的equals找到value值。



## 案例

当HashMap中的key为对象类型时，需要重写`hashCode()`和`equals()`。

```java
public class Demo {

    public static void main(String[] args) {
        Point p1 = new Point(1, 2);
        Point p2 = new Point(1, 2);
        HashMap<Point, String> map = new HashMap<>();
        map.put(p1, "Point 1");
        map.put(p2, "Point 2");

        Set<Map.Entry<Point, String>> entries = map.entrySet();
        for (Map.Entry item : entries) {
            System.out.println(item.getKey() + "-" + item.getValue());
        }
    }
}


class Point {
    int x, y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return "Point{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return x == point.x &&
                y == point.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}
```