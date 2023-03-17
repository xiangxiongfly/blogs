[TOC]

# Flutter JSON解析



## 基本使用

### 定义bean类

```dart
class User {
    final String name;
    final int age;
    final String address;

    User(this.name, this.age, this.address);

    @override
    String toString() {
        return 'User{name: $name, age: $age, address: $address}';
    }
}
```

### 解析Json

```dart
String jsonStr = """{
    "name":"小明",
    "age":18,
    "address":"beijing"
}""";
var jsonMap = json.decode(jsonStr);
var user = User(jsonMap["name"], jsonMap["age"], jsonMap["address"]);
print(user); //User{name: 小明, age: 18, address: beijing}
```

### 解析JsonArray

```dart
String jsonArrayStr = """[
  {
    "name": "小黑",
    "age": 18,
    "address": "shanghai"
  },
  {
    "name": "小白",
    "age": 28,
    "address": "beijing"
  },
  {
    "name": "小明",
    "age": 38,
    "address": "广州"
  }
]""";
List jsonArray = json.decode(jsonArrayStr);
List<User> userList = jsonArray.map((e) => User(e["name"], e["age"], e["address"])).toList();
print(userList); //[User{name: 小黑, age: 18, address: shanghai}, User{name: 小白, age: 28, address: beijing}, User{name: 小明, age: 38, address: 广州}]
```



## 自动生成Model类

实际开发中，JSON很少会这么简单，嵌套的Json情况很多。可以使用`json_serializable`插件自动生成Model类。

### 添加依赖

```
dependencies:
  json_annotation: ^4.5.0

dev_dependencies:
  json_serializable: ^6.2.0
  build_runner: ^2.1.11
```

### 编写代码

```dart
part 'person.g.dart';

@JsonSerializable()
class Person {
  final String name;
  final int age;
  final String address;

  Person(this.name, this.age, this.address);

  factory Person.fromJson(Map<String, dynamic> json) => _$PersonFromJson(json);

  Map<String, dynamic> toJson() => _$PersonToJson(this);

  @override
  String toString() {
    return 'User{name: $name, age: $age, address: $address}';
  }
}
```

-   `part`：表示生成的Model类在什么位置。
-   `@JsonSerializable()`：这个标注告诉生成器，是这个类需要生成Model类。

### 执行命令

**一次性生成**

在项目的根目录下执行：

```
flutter packages pub run build_runner build
```

**持续生成**

```
flutter packages pub run build_runner watch
```

推荐将所有的Model类放在一个单独的目录下，然后执行命令。



## 在线网站生成

[https://app.quicktype.io/](https://app.quicktype.io/)

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4b83fafb94a475a87e3a0ecd6b5c7a5.png)



## JsonToDart插件生成

在AndroidStudio中安装`JsonToDart`插件，然后选定目录，点击右键，选择`New -> Json to Dart`，或快捷键`ALT + Shift + D`自动生成Model类。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d137607fa33d4c4b9ba2df11ddbd1a0a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ceee9325632f4796bf60aeccfb774024.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/d2c921e340a346a89eb9da0a5441d4c6.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/7c7259140af544a88a47c03c40013552.png)




