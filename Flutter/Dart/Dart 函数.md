[TOC]

# Dart 函数

## 概述

Dart是一种面向对象语言，函数也是对象，其类型是Function。Dart中定义函数基本与Java相同，但多了一些高级特性。



## 普通函数

```dart
int add(int a, int b) {
    return a + b;
}
```

在dart中返回值可以省略：

```dart
add(int a, int b) {
    return a + b;
}
```



## 可选参数

### 命名可选参数

可以使用`required`表示参数是必填的。

```dart
void main(List<String> args) {
    printInfo("小明"); //name:小明 age:0 address: sex:false
    printInfo("小白",
              age: 10,
              address: "beijing",
              sex: true); //name:小白 age:10 address:beijing sex:true
}

void printInfo(String name,
               {int age = 0, String address = "", bool sex = false}) {
    print("name:$name age:$age address:$address sex:$sex");
}
```

### 位置可选参数

```dart
void main(List<String> args) {
    printInfo("小明"); //name:小明 age:0 address: sex:false
    printInfo(
        "小白", 20, "shanghai", true); //name:小白 age:20 address:shanghai sex:true
}

void printInfo(String name,
               [int age = 0, String address = "", bool sex = false]) {
    print("name:$name age:$age address:$address sex:$sex");
}
```



## 匿名函数

正常情况下创建的函数都是有函数名的，匿名函数是指没有函数名、保留函数参数列表和函数体的函数。

```dart
var fun = (int a, int b) {
    return a + b;
};

//使用：
fun(2, 3);
```



## 箭头函数

```dart
int add(int a, int b) => a + b;
```

**匿名函数和箭头函数组合：**

```dart
var fun = (int a, int b) => a + b;
```



## 函数类型

在很多语言里，如Java/OC都不支持函数类型，但在Dart中，可以使用函数类型，将函数赋值给一个变量来使用。

```dart
void main(List<String> args) {
    var fun1 = myFunction;
    fun1("hello"); //hello
    test("world", myFunction); //world
}

void myFunction(String desc) {
    print(desc);
}

void test(String desc, Function fun) {
    fun(desc);
}
```

