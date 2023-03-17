[TOC]

# Dart 基础

## 概述

- 开发效率高，支持JIT和AOT
  - JIT即“及时编译”，在Flutter开发阶段，采用JIT模式，避免每次修改导致的编译
  - AOT即“提前编译”，在Flutter发布时可以通过AOT生成高效机器码保证应用性能
- 性能高
- 快速分配内存
- 支持类型安全和空安全

[官方文档](https://dart.cn/guides/language/language-tour)



## Hello World

```dart
main() {
    print("Hello World!");
}
```

```dart
//完整版
void main(List<String> args) {
    print("Hello World!");
    print("Hello Dart!");
}
```



## 注释

`//` 单行注释

`///` 文档注释

`/* */` 多行注释



## 数据类型

- 数值类型：num
  - int：整数
  - double：浮点数
- 布尔类型：bool
- 字符串类型：String
- 集合类型：
  - List
  - Set
  - Map

```dart
int age = 10;
double price = 77.88;
bool flag = true;
String name = "小明";
String address = """
      北京市
      海淀区
  """;
```



### 类型相互转换

```dart
var a = int.parse("1"); //String -> int
var b = double.parse("22.33"); //String -> int

var c = a.toString(); //int -> String
var d = b.toString(); //double -> String
```



### as

类型转换

```dart
Object str = "hello";
int len = (str as String).length;
```



### is

类型判断

```dart
Object str = "hello";
if (str is String) {
    print(str.length);
}
```



## 变量声明

### final 和 const

final和const变量只能被设置一次，二者区别在于：const变量是编译时常量，必须直接赋值；final变量是运行时常量，在第一次使用时初始化。

```dart
//const必须直接赋值
const a = "a"; 

//final可以间接赋值
final b = "b"; 
final c = getNum();

String getNum() {
    return "c";
}
```



### var & dynamic & Object区别 

Dart属于强类型语言

- 用`var`声明变量，可以接收任意类型，当类型确定后不能修改，Dart会自动推导出数据类型，`var`属于编译器的语法糖。
- `dynamic`表示动态类型，用`dynamic`声明的变量可以接收任意类型，且后期可以更改。`dynamic`被编译后是一个`Object`类型，在编译器不会类型检查，而是运行时对类型检查。
- `Object`是所有对象的基类，`Object`声明的变量可以接收任何类型，且后期可以更改，但声明的变量只能使用`Object`的属性和方法，否则编译器会报错。

```dart
var a = "abc";
// a = 123; //报错

dynamic b = "ABC";
b = 123;

Object a = "ABC";
a = 123;
```



### runtimeType

获取变量类型

```dart
var a = 1;
print(a.runtimeType); //int
```



## 运算符

### 基本运算操作

| 运算符 | 说明             |
| ------ | ---------------- |
| +      | 加法运算         |
| +=     | 加法赋值         |
| ++     | 自加一运算       |
| /      | 除法，会有小数点 |
| ~/     | 整除，无小数点   |
| %      | 取模             |



### 三元运算符

```dart
String sex = flag ? "男" : "女";
```



### .. 级联操作符

级联操作符，支持对象进行联系操作。

```dart
void main(List<String> args) {
    final p = Person();
    p.name = "小明";
    p.sayName();
    p.run();

    final p2 = Person()
        ..name = "小黑"
        ..sayName()
        ..run();
}

class Person {
    late String name;

    void sayName() {
        print("sayName: $name");
    }

    void run() {
        print("run");
    }
}
```



## 流程控制

### if-else

```dart
int num = 3;
if (num == 0) {
    print(0);
} else if (num == 1) {
    print(1);
} else {
    print("其他");
}
```

### for

```dart
for (int i = 0; i < arr.length; i++) {
    print(arr[i]);
}

for (String item in arr) {
    print(item);
}
```

### switch-case

```dart
var direction = "east";
switch (direction) {
    case "east":
        print("东");
        break;
    case "south":
        print("南");
        break;
    case "west":
        print("西");
        break;
    case "noth":
        print("北");
        break;
    default:
        print("无");
}
```



## 集合类型

### List

```dart
//创建
var list = [1, "a", "a", true];
List<int> list2 = [1, 2, 3, 4];
List list = List.generate(5, (index) => "第$index个"); //[第0个, 第1个, 第2个, 第3个, 第4个]

//增
list.add("Hello");

//删
list.remove("a"); //删除指定元素
list.removeAt(0); //删除指定索引

//改
list[0] = "A";

//查
list.contains("a"); //是否包含该元素
list[0]; //获取指定索引
list.getRange(2, 4); //获取指定范围元素
list.indexOf("a"); //获取元素的索引

//遍历
for (int i = 0; i < list.length; i++) {
    print(list[i]);
}

for (String item in list) {
    print(item);
}

list.forEach((element) {
    print(element);
});
```



### Set

List的元素是有序的，Set是无序的、有去重的特性。

Set的操作与List大致相同。

```dart
var set = {"A", "B", "C", "D", "E", "F"};

var emptySet = <String>{}; 
```



### Map

```dart
//创建
var emptyMap = {};
var map = {"name": "小明", "age": 18, "address": "北京市", 1: 11};
Map<String, String> map2 = {"key1": "value1", "key2": "value2"};

//增
map["sex"] = "男";
//如果存入的key值存在，则直接返回value值，如果key值不存在，则先插入值再返回
map.putIfAbsent("name111", () => "hello world"); 

//删
map.remove("name");

//改
map["name"] = "小白";

//查
map.containsKey("name");
map.containsValue("小明");
map["name"];

//遍历
for (var item in map.keys) {
    print("$item  ${map[item]}");
}

map.forEach((key, value) {
    print("$key  $value");
});
```



### ... 展开操作符

```dart
var list = [1, 2, 3];
var list2 = [0, ...list];
print(list2); //[0, 1, 2, 3]
```



### ...? 空展开操作符

```dart
List<int>? list;
var list2 = [0, ...?list];
print(list2); //[0]
```



## 异常

### 抛出异常

```dart
throw FormatException("格式转换异常");
```

```dart
throw "格式转换异常";
```



### 捕获异常

```dart
try {
    String str = "abc";
    int i = int.parse(str);
} on FormatException catch (e) {
    print(e);
} on Exception catch (e) {
    print(e);
} catch (e) {
    print(e);
} finally {
    print("finally");
}
```















