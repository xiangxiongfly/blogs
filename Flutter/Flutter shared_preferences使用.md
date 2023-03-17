[TOC]

# Flutter shared_preferences使用

## 简述

为简单数据封装平台特定的持久存储(iOS和macOS上的NSUserDefaults, Android上的SharedPreferences，等等)。数据可能会异步持久化到磁盘，并且不能保证写入返回后会持久化到磁盘，所以这个插件不能用于存储关键数据。

保存路径：`/data/data/<package_name>/shared_prefs`目录下



## 添加依赖

```
shared_preferences: ^2.0.15
```



## 基本使用

### 支持数据类型

`int`, `double`, `bool`, `String` and `List<String>`。



### 支持平台

iOS： NSUserDefaults
Android： SharedPreferences
Web： localStorage
Linux： FileSystem（保存数据到本地系统文件库中）
Mac OS： FileSystem（保存数据到本地系统文件库中）
Windows： FileSystem（保存数据到本地系统文件库中）



### 写数据

```dart
var sp = await SharedPreferences.getInstance();
sp.setString("name", "小明");
sp.setInt("age", 18);
sp.setBool("sex", true);
sp.setDouble("height", 180.1);
sp.setStringList("address", <String>["北京市", "海淀区"]);
```



### 读数据

```dart
var sp = await SharedPreferences.getInstance();
String? name = sp.getString("name");
int? age = sp.getInt("age");
bool? sex = sp.getBool("sex");
double? height = sp.getDouble("height");
List<String>? address = sp.getStringList("address");
```



### 删除数据

**删除一个数据**

```dart
var sp = await SharedPreferences.getInstance();
sp.remove("name");
```

**清除所有数据**

```dart
var sp = await SharedPreferences.getInstance();
sp.clear();
```



### 获取所有key

```dart
var sp = await SharedPreferences.getInstance();
var keys = sp.getKeys();
```



### key是否存在

```dart
var sp = await SharedPreferences.getInstance();
var b = sp.containsKey("name");
```



## 封装

**封装代码**

```dart
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class SpUtils {
    SpUtils._internal();

    factory SpUtils() => _instance;

    static late final SpUtils _instance = SpUtils._internal();

    static late SharedPreferences _preferences;

    static Future<SpUtils> getInstance() async {
        _preferences = await SharedPreferences.getInstance();
        return _instance;
    }

    /// 根据key存储int类型
    static Future<bool> setInt(String key, int value) {
        return _preferences.setInt(key, value);
    }

    /// 根据key获取int类型
    static int? getInt(String key, {int defaultValue = 0}) {
        return _preferences.getInt(key) ?? defaultValue;
    }

    /// 根据key存储double类型
    static Future<bool> setDouble(String key, double value) {
        return _preferences.setDouble(key, value);
    }

    /// 根据key获取double类型
    static double? getDouble(String key, {double defaultValue = 0.0}) {
        return _preferences.getDouble(key) ?? defaultValue;
    }

    /// 根据key存储字符串类型
    static Future<bool> setString(String key, String value) {
        return _preferences.setString(key, value);
    }

    /// 根据key获取字符串类型
    static String? getString(String key, {String defaultValue = ""}) {
        return _preferences.getString(key) ?? defaultValue;
    }

    /// 根据key存储布尔类型
    static Future<bool> setBool(String key, bool value) {
        return _preferences.setBool(key, value);
    }

    /// 根据key获取布尔类型
    static bool? getBool(String key, {bool defaultValue = false}) {
        return _preferences.getBool(key) ?? defaultValue;
    }

    /// 根据key存储字符串类型数组
    static Future<bool> setStringList(String key, List<String> value) {
        return _preferences.setStringList(key, value);
    }

    /// 根据key获取字符串类型数组
    static List<String> getStringList(String key, {List<String> defaultValue = const []}) {
        return _preferences.getStringList(key) ?? defaultValue;
    }

    /// 根据key存储Map类型
    static Future<bool> setMap(String key, Map value) {
        return _preferences.setString(key, json.encode(value));
    }

    /// 根据key获取Map类型
    static Map getMap(String key) {
        String jsonStr = _preferences.getString(key) ?? "";
        return jsonStr.isEmpty ? Map : json.decode(jsonStr);
    }

    /// 通用设置持久化数据
    static set<T>(String key, T value) {
        String type = value.runtimeType.toString();

        switch (type) {
            case "String":
                setString(key, value as String);
                break;
            case "int":
                setInt(key, value as int);
                break;
            case "bool":
                setBool(key, value as bool);
                break;
            case "double":
                setDouble(key, value as double);
                break;
            case "List<String>":
                setStringList(key, value as List<String>);
                break;
            case "_InternalLinkedHashMap<String, String>":
                setMap(key, value as Map);
                break;
        }
    }

    /// 获取持久化数据
    static dynamic get<T>(String key) {
        dynamic value = _preferences.get(key);
        if (value.runtimeType.toString() == "String") {
            if (_isJson(value)) {
                return json.decode(value);
            }
        }
        return value;
    }

    /// 获取持久化数据中所有存入的key
    static Set<String> getKeys() {
        return _preferences.getKeys();
    }

    /// 获取持久化数据中是否包含某个key
    static bool containsKey(String key) {
        return _preferences.containsKey(key);
    }

    /// 删除持久化数据中某个key
    static Future<bool> remove(String key) async {
        return await _preferences.remove(key);
    }

    /// 清除所有持久化数据
    static Future<bool> clear() async {
        return await _preferences.clear();
    }

    /// 重新加载所有数据,仅重载运行时
    static Future<void> reload() async {
        return await _preferences.reload();
    }

    /// 判断是否是json字符串
    static _isJson(String value) {
        try {
            JsonDecoder().convert(value);
            return true;
        } catch (e) {
            return false;
        }
    }
}
```

**初始化**

```dart
void main() async {
    WidgetsFlutterBinding.ensureInitialized();
    await SpUtils.getInstance();
}
```

**使用方式一**

**写数据：**

```dart
SpUtils.setString("name", "小明2");
SpUtils.setInt("age", 28);
SpUtils.setBool("sex", true);
SpUtils.setDouble("height", 180.2);
SpUtils.setStringList("address", <String>["北京市2", "海淀区2"]);
```

**读数据：**

```dart
String? name = SpUtils.getString("name");
int? age = SpUtils.getInt("age");
bool? sex = SpUtils.getBool("sex");
double? height = SpUtils.getDouble("height");
List<String>? address = SpUtils.getStringList("address");
```

**使用方式二**

**写数据：**

```dart
SpUtils.set("name", "小明3");
SpUtils.set("age", 38);
SpUtils.set("sex", true);
SpUtils.set("height", 180.3);
SpUtils.set("address", <String>["北京市3", "海淀区3"]);
```

**读数据：**

```dart
String? name = SpUtils.get<String>("name");
int? age = SpUtils.get<int>("age");
bool? sex = SpUtils.get<bool>("sex");
double? height = SpUtils.get<double>("height");
List<String>? address = SpUtils.get<List<String>>("address");
```

