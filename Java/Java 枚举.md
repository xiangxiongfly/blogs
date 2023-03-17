@[toc]
# 枚举

## 概述

- 枚举是JDK1.5新增的数据类型
- 枚举具有较强的类型约束



## 基本使用

### 定义枚举

```java
public enum Color {
    RED,
    GREEN,
    BLUE
}
```



### 基本方法

```java
//遍历枚举
for (Color c : Color.values()) {
    System.out.println(c);
}

Color red = Color.RED;
Color green = Color.GREEN;
Color blue = Color.BLUE;

//获取枚举常量的序号
red.ordinal(); //0
green.ordinal(); //1
blue.ordinal(); //2

//获取枚举名
red.name(); //RED

//获取所属enum类型
red.getDeclaringClass(); 
```



### 自定义枚举

```java
public enum Color {
    RED("红", "#ff0000"),
    GREEN("绿", "#00ff00"),
    BLUE("蓝", "#0000ff");

    private String colorName;
    private String colorValue;

    Color(String colorName, String colorValue) {
        this.colorName = colorName;
        this.colorValue = colorValue;
    }

    public String getColorName() {
        return colorName;
    }

    public String getColorValue() {
        return colorValue;
    }
}
```

```java
for (Color item : Color.values()) {
    System.out.println(item);
    System.out.println(item.getColorName());
    System.out.println(item.getColorValue());
}
```