[toc]

# Java 代理模式

## 概述

- 代理模式给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。通俗的来讲代理模式就是我们生活中常见的中介。

**角色介绍**

- **抽象角色**：指代理角色和真实角色对外提供的公共方法，一般为一个接口。
- **真实角色**：需要实现抽象角色接口，定义了真实角色所要实现的业务逻辑，以便供代理角色调用。也就是真正的业务逻辑在此。
- **代理角色**：需要实现抽象角色接口，是真实角色的代理，通过真实角色的业务逻辑方法来实现抽象方法，并可以附加自己的操作。将统一的流程控制都放到代理角色中处理。



## 静态代理

**抽象接口**

```java
public interface IProduce {
    //生产CPU
    void createCPU();

    //生产摄像头
    void createCamera();

    //组装
    void produce();
}
```

**真实类**

```java
public class XiaomiProduce implements IProduce {
    @Override
    public void createCPU() {
        System.out.println("生产CPU");
    }

    @Override
    public void createCamera() {
        System.out.println("生产摄像头");
    }

    @Override
    public void produce() {
        System.out.println("组装");
    }
}
```

**静态代理类**

```java
public class ProxyProduce implements IProduce {

    private IProduce mProduce;

    public ProxyProduce(IProduce produce) {
        mProduce = produce;
    }

    @Override
    public void createCPU() {
        mProduce.createCPU();
    }

    @Override
    public void createCamera() {
        mProduce.createCamera();
    }

    @Override
    public void produce() {
        mProduce.produce();
    }
}
```

**使用**

```java
public class Demo {
    public static void main(String[] args) {
        //真实对象
        IProduce xiaomi = new XiaomiProduce();
        //代理对象
        IProduce proxy = new ProxyProduce(xiaomi);

        proxy.createCPU();
        proxy.createCamera();
        proxy.produce();
    }
}
```

```
生产CPU
生产摄像头
组装
```



## 动态代理

静态代理，一对一则会出现时静态代理对象量多、代码量大，从而导致代码复杂，可维护性差的问题，一对多则代理对象会出现扩展能力差的问题。

动态代理执行流程：

1. 定义抽象接口。
2. 实现InvocationHandler接口，并重写invoke方法，该方法在代理对象调用是触发。
3. 通过Proxy.newProxyInstance方法创建代理对象，该方法需要传入目标对象的类加载器、抽象接口、InvocationHandler对象。
4. 执行目标方法。

**动态代理类处理方法**

```java
public class DynamicProxyProduce implements InvocationHandler {

    //真实对象
    private Object object;

    public DynamicProxyProduce(Object o) {
        object = o;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //执行真实对象的方法
        return method.invoke(object, args);
    }
}
```

**使用**

```java
//真实对象
IProduce xiaomi = new XiaomiProduce();
//动态代理对象
IProduce proxy = (IProduce) Proxy.newProxyInstance(xiaomi.getClass().getClassLoader(),
                       new Class[]{IProduce.class},
                       new DynamicProxyProduce(xiaomi));

proxy.createCamera();
proxy.createCPU();
proxy.produce();
```

```
生产摄像头
生产CPU
组装
```