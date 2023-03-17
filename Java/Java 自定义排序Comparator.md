### Comparator

Comparator是比较器接口。

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
    boolean equals(Object var1);
}
```



- o1表示前面的字符，o2表示后面的字符，Java默认升序。
- 返回值
  - 返回值大于0，表示o1大于o2，交换位置。
  - 返回值小于0，表示o1小于o2，位置不变。
  - 返回值等于0，表示两元素相等，不会交换位置。



### 自定义Comparator

```java
public class Student {
    public String name;
    public int age;
    public int score;

    public Student() {
    }

    public Student(String name, int age, int score) {
        this.name = name;
        this.age = age;
        this.score = score;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", score=" + score +
                '}';
    }
}
```



```java
ArrayList<Student> students = new ArrayList<Student>() {{
    add(new Student("Tom", 15, 60));
    add(new Student("Andy", 16, 70));
    add(new Student("Jake", 15, 66));
    add(new Student("Jarry", 15, 70));
    add(new Student("Tim", 16, 80));
    add(new Student("Mike", 15, 90));
}};

// 先按分数排序，再按年龄升序
students.sort(new Comparator<Student>() {
    @Override
    public int compare(Student t1, Student t2) {
        if (t1.score > t2.score) {
            return 1;
        } else if (t1.score < t2.score) {
            return -1;
        } else {
            if (t1.age > t2.age) {
                return 1;
            } else if (t1.age < t2.age) {
                return -1;
            } else {
                return 0;
            }
        }
    }
});

for (Student s : students) {
    System.out.println(s);
}
```

输出信息：

```
Student{name='Tom', age=15, score=60}
Student{name='Jake', age=15, score=66}
Student{name='Jarry', age=15, score=70}
Student{name='Andy', age=16, score=70}
Student{name='Tim', age=16, score=80}
Student{name='Mike', age=15, score=90}
```