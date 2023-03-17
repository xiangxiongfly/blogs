# Dart 空安全

## 概述

- Dart支持健全的空安全机制。
- 在变量的类型声明上加`?`表示变量是可空类型，否则是非空类型。




## 使用

**非空类型：**

```dart
String name = "小明";
int age = 18;
String address = getAddress();

String getAddress() {
  return "北京市";
}
```

**可空类型：**

```dart
String? name = null;
int? age = null;
String? address = null;
```



## 空安全操作符

### ?.

左边值为空返回null，否则返回右边的值。

```dart
String? name = getName();
print(name?.length);
```



### ??

如果当左边表达式的值不为null，则直接返回自己的值，否则返回右边表达式的值。

```dart
String? name = getName();
String newName = name ?? "未知";
print(newName);
```



### ??=

左边值不为null时，直接返回自己的值，否则返回右边表达式的值。

```dart
String? name = getName();
name ??= "未知";
print(name);
```



## 判断技巧

```dart
void main() {
  var a;
  var b = "";
  var c = 0;

  if ([null, "", 0].contains(a)) {
    print(a);
  }
  if ([null, "", 0].contains(b)) {
    print(b);
  }
  if ([null, "", 0].contains(c)) {
    print(c);
  }
}
```

