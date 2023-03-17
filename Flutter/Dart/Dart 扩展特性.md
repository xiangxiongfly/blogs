[TOC]

# Dart 扩展特性

## 概述

一般情况下要扩展一个类，需要继承这个类，在dart 2.7以后，引入extension，用来对类的方法进行扩展。



## 使用

```dart
extension StringToNumber on String {
    int toInt() {
        return int.parse(this);
    }
}

extension NumberOperator on int {
    int add(int other) {
        return this + other;
    }
}
```

```dart
int result = "18".toInt();

int sum = 1.add(2);
```



## API冲突

**方式一**

使用`show`或`hide`限制使用。

```dart
import 'extension1.dart' hide StringToNumber, NumberOperator;
import 'extension2.dart';
```

**方式二**

重命名。

```dart
import 'extention1.dart';
import 'extention2.dart' as ext2;
```

