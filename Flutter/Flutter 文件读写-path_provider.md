[TOC]

# Flutter 文件读写-path_provider

## 概述

-   Android和iOS的文件路径是不同的，因此获取不同平台的文件路径需要原生开发的支持。我们可以借助第三方插件完成这部分工作——PathProvider。
-   `path_provider`是一个`Flutter`插件，主要作用是提供一种以平台无关一致的方式访问设备的文件系统，比如应用临时目录、文档目录等。而且`path_provider`支持**Android**、**iOS**、**Linux**、**MacOS**、**Windows**。



## 添加依赖

```
path_provider: ^2.0.11
```



## path_provider支持平台

App存储目录总共分八种：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c51ad194c9384ef188f1b242aab220ed.png)



## 使用path_provider

-   `getTemporaryDirectory()`：临时目录

    -   特点：程序私有目录，其他应用无法访问，适用于缓存文件，可以被系统随时清空的。
    -   iOS的实现方式是`NSCachesDirectory`
    -   Android的实现方式是`getCacheDir`，即`data/data/packageName/cache`

-   `getApplicationSupportDirectory()`：应用程序支持目录

    -   特点：程序私有目录，其他应用无法访问，系统不会清除该目录，只有在删除应用时才会消失。
    -   iOS的实现方式是`NSApplicationSupportDirectory`
    -   Android的实现方式是`getFilesDir`

-   `getLibraryDirectory()`：应用程序持久文件目录

    -   特点：应用程序可以在其中存储持久性文件，备份文件以及对用户不可见的文件的目录路径，例如storage.sqlite.db。

-   `getApplicationDocumentsDirectory()`：文档目录

    -   特点：用于存储只能由该应用访问的文件，系统不会清除该目录，只有在删除应用时才会消失。
    -   iOS的实现方式是`NSDocumentDirectory`
    -   Android的实现方式是`getDataDirectory`或`getExternalStorageDirectory`，即`data/data/packageName/app_flutter`

-   `getExternalStorageDirectory()`：外部存储目录

    -   特点：用于获取外部存储目录，如SD卡等，但iOS不支持外部存储目录，目前只有Android才支持。
    -   Android的实现方式是`getExternalFilesDir`，即外部存储目录根目录

-   `getExternalCacheDirectories()`：外部存储缓存目录

    -   特点：主要用户获取应用程序特定外部缓存数据的目录，比如从SD卡或者手机上有多个存储目录的，但iOS不支持外部存储目录，目前只有Android才支持。
    -   Android的实现方式是`getExternalCacheDirs`或`getExternalCacheDir`

-   `getExternalStorageDirectories()`：外部存储目录（单独分区）

    -   特点：可根据类型获取外部存储目录，如SD卡、单独分区等，和外部存储目录不同在于他是获取一个目录数组。但iOS不支持外部存储目录，目前只有Android才支持。
    -   Android的实现方式是`getExternalFilesDirs`或`getExternalFilesDir`

-   `getDownloadsDirectory()`：桌面程序下载目录

    -   特点：主要用于存储下载文件的目录，只适用于`Linux`、`MacOS`、`Windows`，`Android`和`iOS`平台无法使用。


平时我们常用三种：`getApplicationDocumentsDirectory()`、`getTemporaryDirectory()`、`getApplicationSupportDirectory()`。



![在这里插入图片描述](https://img-blog.csdnimg.cn/0becf360a3ce40ec93445b0c50a6bab6.png)

```dart
class PathProviderDemo extends StatefulWidget {
    const PathProviderDemo({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _PathProviderDemoState();
    }
}

class _PathProviderDemoState extends State<PathProviderDemo> {
    late Future<Directory> _tempDirectory;
    late Future<Directory> _appSupportDirectory;
    late Future<Directory> _appLibraryDirectory;
    late Future<Directory> _appDocumentsDirectory;
    late Future<Directory?> _externalStorageDirectory;
    late Future<List<Directory>?> _externalStorageDirectories;
    late Future<List<Directory>?> _externalCacheDirectories;
    late Future<Directory?> _downloadDirectory;

    @override
    void initState() {
        super.initState();
        setState(() {
            _tempDirectory = getTemporaryDirectory();
            _appSupportDirectory = getApplicationSupportDirectory();
            _appLibraryDirectory = getLibraryDirectory();
            _appDocumentsDirectory = getApplicationDocumentsDirectory();
            _externalStorageDirectory = getExternalStorageDirectory();
            _externalCacheDirectories = getExternalCacheDirectories();
            _externalStorageDirectories = getExternalStorageDirectories();
            _downloadDirectory = getDownloadsDirectory();
        });
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("path_provider支持平台"),
            ),
            body: ListView(
                children: [
                    _buildItem("getTemporaryDirectory", _tempDirectory),
                    _buildItem("getApplicationSupportDirectory", _appSupportDirectory),
                    _buildItem("getLibraryDirectory", _appLibraryDirectory),
                    _buildItem("getApplicationDocumentsDirectory", _appDocumentsDirectory),
                    _buildItem("getExternalStorageDirectory", _externalStorageDirectory),
                    _buildItem2("getExternalCacheDirectories", _externalCacheDirectories),
                    _buildItem2("getExternalStorageDirectories", _externalStorageDirectories),
                    _buildItem("getDownloadsDirectory", _downloadDirectory),
                ],
            ),
        );
    }

    Widget _buildItem(String title, Future<Directory?> future) {
        return Column(
            children: [
                Text("$title:"),
                FutureBuilder(future: future, builder: _buildDirectory),
                const Divider(),
            ],
        );
    }

    Widget _buildItem2(String title, Future<List<Directory>?> future) {
        return Column(
            children: [
                Text("$title:"),
                FutureBuilder(future: future, builder: _buildDirectories),
                const Divider(),
            ],
        );
    }

    Widget _buildDirectory(BuildContext context, AsyncSnapshot<Directory?> snapshot) {
        Text text = const Text("");
        if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
                text = Text("Error: ${snapshot.error}");
            } else if (snapshot.hasData) {
                text = Text("path: ${snapshot.data?.path}");
            } else {
                text = const Text("不支持");
            }
        }
        return text;
    }

    Widget _buildDirectories(BuildContext context, AsyncSnapshot<List<Directory>?> snapshot) {
        Text text = const Text("2");
        if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
                text = Text("Error: ${snapshot.error}");
            } else if (snapshot.hasData) {
                final String? paths = snapshot.data?.map((Directory d) => d.path).join(",");
                text = Text("paths: $paths");
            } else {
                text = const Text("不支持");
            }
        }
        return text;
    }
}
```



## 操作文件夹&文件

### 创建文件夹

```dart
/// 创建文件夹
createDir() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}hello/a/b/c";
    print("path:$path");
    var dir = Directory(path);
    bool exist = dir.existsSync();
    if (exist) {
        print("文件已存在");
    } else {
        var result = dir.create(recursive: true);
        print("创建$result");
    }
}
```

-   `Platform.pathSeparator`：平台分隔符，在Android和iOS中表示“/”。
-   `create()`：创建文件夹，默认不支持嵌套文件夹，`create(recursive:true)`支持嵌套文件夹的创建。



### 遍历文件夹

```dart
/// 遍历文件夹中的文件
queryDir() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}hello";
    Stream<FileSystemEntity> fileList = Directory(path).list(recursive: true);
    fileList.forEach((element) {
        FileSystemEntityType type = FileSystemEntity.typeSync(element.path);
        print("$element 类型：$type");
    });
}
```

-   `list()`：默认值为false，只遍历当前目录；为true时，遍历当前目录和子目录。
-   文件类型：
    -   file：文件
    -   directory：文件夹
    -   link：链接文件
    -   notFound：未知



### 文件重命名

```dart
/// 重命名文件夹
renameDir() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}hello";
    var dir = Directory(path);
    var newDir = await dir.rename("${parentDir.path}${Platform.pathSeparator}newhello");
    print(newDir);
}
```



### 删除文件夹

```dart
/// 删除文件夹
deleteDir() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}hello";
    var dir = await Directory(path).delete(recursive: true);
    print(dir);
}
```

-   `delete()`：删除文件夹，默认不支持嵌套文件夹，`create(recursive:true)`支持嵌套文件夹的删除。



### 创建文件

```dart
/// 创建文件
createFile() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}mytxt.txt";
    var file = File(path);
    bool exist = file.existsSync();
    if (exist) {
        print("文件已存在");
    } else {
        await file.create();
        print(file);
    }
}
```



### 删除文件

```dart
file.delete();
```



### 文件写入数据

```dart
/// 文件写入数据
writeFile() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}mytxt.txt";
    var file = File(path);
    await file.writeAsString("哈喽 flutter1");
    //追加写入
    await file.writeAsBytes(const Utf8Encoder().convert("\n哈喽 flutter2"), mode: FileMode.writeOnlyAppend);
}
```



### 文件读取数据

```dart
/// 文件读取数据
readFile() async {
    final parentDir = await getApplicationSupportDirectory();
    String path = "${parentDir.path}${Platform.pathSeparator}mytxt.txt";
    var file = File(path);
    List<String> lines = await file.readAsLines();
    for (var e in lines) {
        print(e);
    }
    //读取bytes并转String
    String result = const Utf8Decoder().convert(await file.readAsBytes());
    print("result: $result");
}
```



## 读取assets文件

```dart
/// 读取asset文件
readAsset(BuildContext context) async {
    //方式一
    String jsonStr = await DefaultAssetBundle.of(context).loadString("assets/students.json");
    print("jsonStr: $jsonStr");
    var list = json.decode(jsonStr);
    for (var e in list) {
        print(e);
    }

    //方式二
    String jsonStr2 = await rootBundle.loadString("assets/students.json");
    print("jsonStr2: $jsonStr2");
}
```



