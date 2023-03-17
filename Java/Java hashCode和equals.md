# Java hashCode和equals

## hashCode



## equals

equals方法





## hash冲突问题





## hashCode与equals关系









## 概述

hashCode主要用于快捷查找，如HashMap/HashSet/HashTable等。

equals用于比较元素是否相等。



## hashCode与equals关系

- hashCode相等：equals不一定相等，因为hash值是int类型，取值有限。
- equals相等：hashCode一定相等，因为equals相等表示两个对象指向同一个引用。
- 重写equals不一定需要重写hashCode
- 重写hashCode一定重写equals
- 如果两对象hashCode()和equals()都相同，会覆盖旧数据



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