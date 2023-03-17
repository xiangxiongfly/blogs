@[toc]
### 克隆

当使用“=”赋值引用类型的时候，其实是直接赋值该对象的地址，本质还是一个对象。

而克隆则是完全创造一个新的对象出来，有自己的新地址，只是初始化的数据相同。

克隆属于浅拷贝。

```java
Person p1 = new Person("Tom", 11);
Person p2 = p1;
Person p3 = (Person) p1.clone();
System.out.println(p1);
System.out.println(p2);
System.out.println(p3);
```

输出信息：

```
Person@74a14482
Person@74a14482
Person@1540e19d
```



### 浅拷贝

对于对象或数组类型，将`对象A`赋值给`对象B`，然后改变`对象B`的属性，`对象A`也会随之变化。

`对象A`和`对象B`指向同一块内存，浅拷贝就是拷贝内存地址。



需要实现`Cloneable`接口，重写`clone()`方法。

```java
class Person implements Cloneable {
    public String name;
    public int age;
    public Address addr;

    public Person(String name, int age, Address addr) {
        this.name = name;
        this.age = age;
        this.addr = addr;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", addr=" + addr +
                '}';
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Person newPerson = (Person) super.clone();
        return newPerson;
    }

    public static class Address {
        public String address;

        public Address(String address) {
            this.address = address;
        }

        @Override
        public String toString() {
            return "Address{" +
                    "address='" + address + '\'' +
                    '}';
        }
    }
}
```

```java
Person p1 = new Person("Tom", 11, new Person.Address("beijing"));
Person p2 = (Person) p1.clone();
p2.addr.address = "shanghai";

System.out.println(p1);
System.out.println(p2);
```

输出信息：

```
Person{name='Tom', age=11, addr=Address{address='shanghai'}}
Person{name='Tom', age=11, addr=Address{address='shanghai'}}
```



### 深拷贝

深拷贝是指`对象B`开辟新的内存，将`对象A`的各个属性都复制到新内存中，

`对象B`的属性发生变化时，`对象A`的属性不会受影响。

深拷贝相比于浅拷贝速度较慢并且花销较大。



比较常用的方案有两种：

1. 继续使用`clone()`方法对其内部的引用类型，再进行一次`clone()`。
2. 序列化这个对象，再反序列回来，重新获取这个新对象。



#### 使用Cloneable接口

```java
class Person implements Cloneable {
    public String name;
    public int age;
    public Address addr;

    public Person(String name, int age, Address addr) {
        this.name = name;
        this.age = age;
        this.addr = addr;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", addr=" + addr +
                '}';
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Person newPerson = (Person) super.clone();
        newPerson.addr = (Address) addr.clone();
        return newPerson;
    }

    public static class Address implements Cloneable {
        public String address;

        public Address(String address) {
            this.address = address;
        }

        @Override
        public String toString() {
            return "Address{" +
                    "address='" + address + '\'' +
                    '}';
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }
    }
}
```

```java
Person p1 = new Person("Tom", 11, new Person.Address("beijing"));
Person p2 = (Person) p1.clone();
p2.addr.address = "shanghai";

System.out.println(p1);
System.out.println(p2);
```

输出信息:

```
Person{name='Tom', age=11, addr=Address{address='beijing'}}
Person{name='Tom', age=11, addr=Address{address='shanghai'}}
```

其实和浅复制是一样的道理，在深复制时将Address也进行了一次深复制。



#### 使用反序列化

```java
class Person implements Serializable {
    public String name;
    public int age;
    public Address addr;

    public Person(String name, int age, Address addr) {
        this.name = name;
        this.age = age;
        this.addr = addr;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", addr=" + addr +
                '}';
    }

    public static class Address implements Serializable {
        public String address;

        public Address(String address) {
            this.address = address;
        }

        @Override
        public String toString() {
            return "Address{" +
                    "address='" + address + '\'' +
                    '}';
        }
    }
}
```

```java
class CloneUtils {

    public static <T extends Serializable> T deepClone(T obj) {
        T cloneObj = null;
        ByteArrayOutputStream baos = null;
        ObjectOutputStream oos = null;
        ByteArrayInputStream bais = null;
        ObjectInputStream ois = null;
        try {
            baos = new ByteArrayOutputStream();
            oos = new ObjectOutputStream(baos);
            oos.writeObject(obj);

            bais = new ByteArrayInputStream(baos.toByteArray());
            ois = new ObjectInputStream(bais);
            cloneObj = (T) ois.readObject();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (oos != null) {
                try {
                    oos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bais != null) {
                try {
                    bais.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (ois != null) {
                try {
                    ois.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (baos != null) {
                try {
                    baos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return cloneObj;
    }
}
```

```java
Person p1 = new Person("Tom", 11, new Person.Address("beijing"));
Person p2 = CloneUtils.deepClone(p1);
p2.name = "Jim";
p2.addr.address = "shanghai";

System.out.println(p1);
System.out.println(p2);
```

输出信息：

```
Person{name='Tom', age=11, addr=Address{address='beijing'}}
Person{name='Jim', age=11, addr=Address{address='shanghai'}}
```