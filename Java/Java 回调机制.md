@[toc]
# 回调机制

## 概述

回调是一种常见的程序设计模式，指可以在某个特定事件发生时应该采取的动作。



## 实现

定义2个类Boss类和Employee类，Boss类负责通知Employee类开始工作，Employee类工作完后通过callback回调通知已经完成工作

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210608153720249.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

```java
class Boss {
    public void execute(Employee employee) {
        employee.work();
    }
}

class Employee {

    interface ICallback {
        void notify(String msg);
    }

    private ICallback callback;

    public void setCallback(ICallback callback) {
        this.callback = callback;
    }

    public void work() {
        System.out.println("开始工作");
        try {
            Thread.sleep(1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        callback.notify("工作完成");
    }
}

public class Demo {
    public static void main(String[] args) {

        Boss boss = new Boss();
        Employee employee = new Employee();
        employee.setCallback(new Employee.ICallback() {
            @Override
            public void notify(String msg) {
                System.out.println(msg);
            }
        });
        boss.execute(employee);
    }
}
```



### [文档](https://mp.weixin.qq.com/s/GWffaWGBoSnaLO9t-YbOUg)