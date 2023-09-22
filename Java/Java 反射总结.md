[toc]

# 反射总结

## 概述

Java的反射是指程序在运行期可以拿到一个对象的所有信息。

Java可以通过反射实现一下功能：

- 创建一个类的对象。
- 访问对象的成员变量和方法。

在Android中，出于安全考虑，google对系统的某些方法使用`@hide`或`private`修饰，导致不能正常调用该方法，这时可以借助反射进行操作。



## Class实例

Class是一个类，里面包含类的所有信息，如：属性、方法、构造函数等。

**定义实体类：**

```java
public class Person extends People implements Serializable {
    private String name;
    private int age;
    public String address;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    private Person(int age, String address) {
        this.age = age;
        this.address = address;
    }

    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public String setName(String name) {
        this.name = name;
        return "666";
    }

    private String setRealName(String name) {
        this.name = name;
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    private void setAddress(String address) {
        this.address = address;
    }

    public static String getCountry() {
        return "中国";
    }

    public String showDetail() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
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

### 获取Class对象

```java
//方式一：通过类名获取
Class<Person> clazz = Person.class;

//方式二：通过对象获取
Person person = new Person();
Class<? extends Person> clazz = person.getClass();

//方式三：通过Class.forName()获取
Class<?> clazz = Class.forName("com.example.myapplication.Person");
```

### instanceof & isInstance() & isAssignableFrom()区别

- instanceof：是一个关键字，用于判断对象是否为类的实例。
- isInstance()：是Class类中的方法，判断是否为类的实例。
- isAssignableFrom()：是Clas类s中的方法，判断继承关系。

```java
//instanceof
System.out.println(fruit instanceof Fruit);//true
System.out.println(apple instanceof Apple);//true
System.out.println(apple instanceof Fruit);//true
//        System.out.println("hello" instanceof Fruit);//报错

//isInstance
System.out.println(Fruit.class.isInstance(fruit));//true
System.out.println(Apple.class.isInstance(apple));//true
System.out.println(Fruit.class.isInstance(apple));//true
System.out.println(Fruit.class.isInstance("hello"));//false

//isAssignableFrom
System.out.println(Fruit.class.isAssignableFrom(Fruit.class));//true
System.out.println(Apple.class.isAssignableFrom(Apple.class));//true
System.out.println(Fruit.class.isAssignableFrom(Apple.class));//true
System.out.println(Fruit.class.isAssignableFrom(String.class));//false
```

### 获取Class信息

```java
Class<String> clazz = String.class;

//获取全类名
String name = clazz.getName();
System.out.println(name); //java.lang.String

//获取全类名
String canonicalName = clazz.getCanonicalName();
System.out.println(canonicalName); //java.lang.String

//获取类名
String simpleName = clazz.getSimpleName();
System.out.println(simpleName); //String

//获取报名
Package pkg = clazz.getPackage();
System.out.println(pkg.getName()); //java.lang

//获取父类
Class<? super String> superclass = clazz.getSuperclass();
System.out.println(superclass.getName()); //java.lang.Object

//获取当前实现的接口
Class<?>[] interfaces = clazz.getInterfaces();
for (Class i : interfaces) {
    System.out.println(i.getName());
}
/*
        java.io.Serializable
        java.lang.Comparable
        java.lang.CharSequence
         */
```

### 通过Class创建对象

```java
//通过Class实例创建实例对象
Person person = clazz.newInstance();
```



## 访问构造函数

### 获取Constructor对象

```java
//获取public构造方法
Constructor[] constructors = clazz.getConstructors();

//获取所有构造方法
Constructor[] declaredConstructors = clazz.getDeclaredConstructors();

//获取指定参数的public构造方法
Constructor constructor = clazz.getConstructor(String.class, int.class);

//获取指定参数的非public构造方法
Constructor constructor = clazz.getDeclaredConstructor(int.class, String.class);
```

### 通过构造函数创建对象

```java
Constructor<Person> constructor = Person.class.getConstructor(String.class, int.class, String.class);
Person p = constructor.newInstance("小白", 18, "北京市");
```



## 调用方法

### 获取Method对象

```java
//获取当前类和父类的public方法
Method[] methods = clazz.getMethods();

//获取当前类的所有方法
Method[] methods = clazz.getDeclaredMethods();

//根据方法名和参数Class对象，获取当前类和父类的public方法
Method method = clazz.getMethod("setName", String.class);

//根据方法名和参数Class对象，获取当前类的方法，无限制
Method method = clazz.getDeclaredMethod("setAddress", String.class);
```

### 获取Method信息

```java
//获取方法名
String methodName = method.getName();

//获取返回值类型
Class<?> returnType = method.getReturnType();

//获取参数类型
Class<?>[] parameterTypes = method.getParameterTypes();

//获取修饰符
int modifiers = method.getModifiers();
```

### 调用普通方法

```java
//获取指定方法
Method method = clazz.getMethod("setName", String.class);
//调用方法并获取返回值
String ret = (String) method.invoke(p, "小红");
```

### 调用非public方法

```java
Method method = clazz.getDeclaredMethod("setRealName", String.class);
method.setAccessible(true);
String ret = (String) method.invoke(p, "小花");
```

### 调用静态方法

静态方法无需指定实例对象，所以invoke()的第一个参数永远为null。

```java
Method method = clazz.getMethod("getCountry");
String ret = (String) method.invoke(null);
```



## 访问字段

### 获取Field对象

```java
//获取当前类和父类的public属性
Field[] fields = clazz.getFields();

//获取当前类的所有属性
Field[] fields = clazz.getDeclaredFields();

//获取当前类和父类的public属性
Field field = clazz.getField("address");

//获取当前类的属性，无限制
Field field = clazz.getDeclaredField("name");
```

### 获取Field信息

```java
//获取字段名
String fieldName = field.getName();
//获取字段类型
Class<?> fieldType = field.getType();
//获取字段修饰符
int fieldModifiers = field.getModifiers();
//是否为private修饰
boolean isPrivate = Modifier.isPrivate(fieldModifiers);
```

### 获取字段值

```java
Person p = new Person("小明", 18, "北京市");
Class<? extends Person> clazz = p.getClass();
Field f = clazz.getDeclaredField("name");
f.setAccessible(true);//非public设为true
Object value = f.get(p);
System.out.println(value);//小明
```

### 设置字段值

```java
Person person = clazz.newInstance();
Field name = clazz.getDeclaredField("name");
name.setAccessible(true);//非public设置true
name.set(person, "小白");
```



## 泛型类型

泛型中常用的Type：

- TypeVariable：表示类型变量。在泛型方法和泛型类中，可以定义类型参数，如T、E等。TypeVariable接口表示这些类型参数。
- ParamterizedType：表示参数化类型，即带有泛型参数的类型。如 List、Map<K,V> 等。ParameterizedType接口提供了获取参数化类型的原始类型、类型参数等方法。
- GenericeArrayType：表示泛型数组类型，即带有泛型参数的数组类型。比如 T[]、List[] 等。
- WildcardType：表示通配符类型，即问号（？）形式的类型。在泛型中，可以使用通配符来表示未知类型，比如 ? extends Number 表示一个上界是 Number 类型的未知类型。WildcardType 接口表示这种通配符类型。

### TypeVariable

获取变量的类型变量。

```java
class Person<K extends Comparable & Serializable, V> {
    K key;
    V value;
}
```

```java
//获取成员变量
Field keyField = Person.class.getDeclaredField("key");
Field valueField = Person.class.getDeclaredField("value");

//获取成员变量的泛型类型
TypeVariable keyType = (TypeVariable) keyField.getGenericType();
TypeVariable valueType = (TypeVariable) valueField.getGenericType();
System.out.println(keyType.getName()); //K
System.out.println(valueType.getName()); //V

//获取泛型的声明类型
System.out.println(keyType.getGenericDeclaration()); //class com.example.java_demo.Person
System.out.println(valueType.getGenericDeclaration()); //class com.example.java_demo.Person

//获取上界
for (Type type : keyType.getBounds()) {
    System.out.println(type);
}
/*
        interface java.lang.Comparable
        interface java.io.Serializable
         */
for (Type type : valueType.getBounds()) {
    System.out.println(type);
}
/*
        class java.lang.Object
         */
```

### ParameterizedType

获取变量的参数化类型。

```java
class Person {
    Map<String, Integer> map;
}
```

```java
Field field = Person.class.getDeclaredField("map");
//获取泛型的类型
Type genericType = field.getGenericType();
System.out.println(genericType); //java.util.Map<java.lang.String, java.lang.Integer>

//转具体的泛型类型
ParameterizedType pType = (ParameterizedType) genericType;
//获得原始类型
Type rawType = pType.getRawType();
System.out.println(rawType); //interface java.util.Map

//获取泛型类型
for (Type t : pType.getActualTypeArguments()) {
    System.out.println(t);
}
/*
        class java.lang.String
        class java.lang.Integer
         */
```

### GenericArrayType

获取变量的泛型数组类型。

```java
public class Test {
    List<String>[] lists;

    public static void main(String[] args) throws NoSuchFieldException {
        Field field = Test.class.getDeclaredField("lists");
        GenericArrayType genericType = (GenericArrayType) field.getGenericType();
        Type type = genericType.getGenericComponentType();
        System.out.println(type); //java.util.List<java.lang.String>
    }
}
```

### WildcardType

获取变量的通配符类型。

```java
public class Test {
    private List<? extends Number> a;
    private List<? super String> b;

    public static void main(String[] args) throws NoSuchFieldException {
        Field aField = Test.class.getDeclaredField("a");
        Field bField = Test.class.getDeclaredField("b");
        //获取参数化类型
        ParameterizedType pTypeA = (ParameterizedType) aField.getGenericType();
        ParameterizedType pTypeB = (ParameterizedType) bField.getGenericType();
        //获取通配符类型
        WildcardType wTypeA = (WildcardType) pTypeA.getActualTypeArguments()[0];
        WildcardType wTypeB = (WildcardType) pTypeB.getActualTypeArguments()[0];
        //获取上界
        System.out.println(wTypeA.getUpperBounds()[0]); //class java.lang.Number
        //获取下界
        System.out.println(wTypeB.getLowerBounds()[0]); //class java.lang.String
    }
}
```

