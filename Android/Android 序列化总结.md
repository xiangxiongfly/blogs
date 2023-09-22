[toc]

# Android 序列化总结

## 概述

- Java中的序列化是指将对象转换为字节序列的过程，而反序列化则是指将字节序列转换为对象的过程。序列化和反序列化是一对相关的操作，它们可以用来实现对象的存储（文件存储）和传输（网络传输）。
- 序列化方式：
  1. 实现Java中的Serializable接口。
  2. 实现Android中的Parcelable接口。



## Serializable

- Serializable：是 Java 提供的一个序列化接口，它是一个空接口，用于标识当前类可以被序列化 。
- serialVersionUID：在进行反序列化时，JVM会把传来的字节流中的serialVersionUID与本地相应实体类的serialVersionUID进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常，即是InvalidCastException 。

```java
public class Test {
    public static void main(String[] args) {
        Person p = new Person("小明", 18, "beijing");
        saveObject(p, "./test.txt");
        Person r = readObject("./test.txt");
        System.out.println(r);
    }

    private static void saveObject(Object obj, String path) {
        ObjectOutputStream out = null;
        try {
            out = new ObjectOutputStream(new FileOutputStream(path));
            //序列化对象
            out.writeObject(obj);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private static <T> T readObject(String path) {
        ObjectInputStream input = null;
        try {
            //反序列化对象
            input = new ObjectInputStream(new FileInputStream(path));
            return (T) input.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }
}

class Person implements Serializable {
    public String name;
    public int age;
    public String address;

    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
    }
}
```



### 自定义序列化

1. `writeReplace()`：序列化时，首先系统会先调用`writeReplace`方法，在这个阶段，可以进行自己操作，将需要进行序列化的对象换成我们指定的对象， 一般很少重写该方法。

2. `writeObject()`：接着系统将调用`writeObject`方法，来将对象中的属性一个个进行序列化，我们可以在这个方法中控制住哪些属性需要序列化。


3. `readObject()`：反序列化时，系统会调用`readObject`方法，将我们刚刚在`writeObject`方法序列化好的属性，反序列化回来。然后通过`readResolve`方法，我们也可以指定系统返回给我们特定的对象可以不是`writeReplace`序列化时的对象,可以指定其他对象.


4. `readResolve()`：通过`readResolve`方法，我们也可以指定系统返回给我们特定的对象可以不是`writeReplace`序列化时的对象,可以指定其他对象，一般很少重写该方法。

```java
class Person implements Serializable {
    public String name;
    public int age;
    public String address;

    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    private Object writeReplace() throws ObjectStreamException {
        System.out.println("writeReplace()");
        return this;
    }

    private void writeObject(java.io.ObjectOutputStream out) throws IOException {
        System.out.println("writeObject()");
        out.writeObject(this.name == null ? "未知" : this.name);
        out.writeObject(this.age);
        out.writeObject(this.address);
    }

    private void readObject(java.io.ObjectInputStream in) throws IOException,
            ClassNotFoundException {
        System.out.println("readObject()");
        this.name = (String) in.readObject();
        this.age = (int) in.readObject();
        this.address = (String) in.readObject();
    }

    private Object readResolve() throws ObjectStreamException {
        System.out.println("readResolve()");
        return this;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
    }
}
```

```java
Person p = new Person(null, 18, "beijing");
saveObject(p, "./test.txt");
Person r = readObject("./test.txt");
System.out.println(r);
```

输出信息：

```
writeReplace()
writeObject()
readObject()
readResolve()
Person{name='未知', age=18, address='beijing'}
```



## Parcelable

- Parcelable是Android为我们提供的序列化的接口，Parcelable相对于Serializable的使用相对复杂一些，但Parcelable的效率相对Serializable也高很多。
- Parcelable和Serializable的效率对比： Parcelable vs Serializable 号称快10倍的效率。
- Parcelable是Android SDK提供的，它是基于内存的，由于内存读写速度高于硬盘，因此Android中的跨进程对象的传递一般使用Parcelable。

```java
public class Person implements Parcelable {
    public String name;
    public int age;
    public String address;

    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    /**
     * 当前对象的内容描述,一般返回0即可
     */
    @Override
    public int describeContents() {
        return 0;
    }

    /**
     * 序列化过程
     * 将对象转Parcel对象
     */
    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.name);
        dest.writeInt(this.age);
        dest.writeString(this.address);
    }

    /**
     * public static final一个都不能少，内部对象CREATOR的名称也不能改变，必须全部大写。
     */
    public static final Creator<Person> CREATOR = new Creator<Person>() {
        /**
         * 反序列化过程
         * 将Parcel对象转为Java对象
         */
        @Override
        public Person createFromParcel(Parcel source) {
            String name = source.readString();
            int age = source.readInt();
            String address = source.readString();
            return new Person(name, age, address);
        }

        /**
         * 创建指定长度的原始对象数组
         */
        @Override
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };
}
```



## Parcelable 与 Serializable 比较

- Serializable是Java提供的序列化接口。
  - 优点：使用简单。
  - 缺点：性能开销大，因为Serializable在序列化过程中使用了反射机制，回产生大量的临时变量，从而导致频繁的GC。
- Parcelable是Android提供的序列化接口。
  - 优点：在内存上开销较小，以IBinder为信息载体，因此在内存之间进行数据传递时优先使用。
  - 缺点：Parcelable使用时操作复杂。不同的Android版本中Parcelable可能会不同，因此持久化仍然使用Serializable。

