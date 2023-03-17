[TOC]

# 初识Flutter

## 什么是Flutter

Flutter 是 Google 推出并开源的移动应用开发框架，主打跨平台、高保真、高性能。开发者可以通过 Dart 语言开发 App，一套代码同时运行在 iOS 和 Android平台。 Flutter 提供了丰富的组件、接口，开发者可以很快地为 Flutter 添加 Native 扩展。

Flutter 与用于构建移动应用程序的其它大多数框架不同，因为 Flutter 既不使用 WebView，也不使用操作系统的原生控件。 相反，Flutter 使用自己的高性能渲染引擎来绘制 Widget（组件）。这样不仅可以保证在 Android 和iOS 上 UI 的一致性，也可以避免对原生控件依赖而带来的限制及高昂的维护成本。

Flutter 的绘制需要使用Skia引擎， 而Skia在Android平台中是内置的，iOS平台则需要打包到项目里，所以Flutter打包大小是iOS比Android的大。



## Flutter框架结构

![Flutter框架结构](https://img-blog.csdnimg.cn/7206dbee9d054ecd8d7940417b7cf3b2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

- Framework即框架层，这是一个纯Dart实现的SDK，实现了一套基础库。
- Engine即引擎层，这是Flutter的核心，由C++实现，其中包含了Skia引擎、Dart运行时、文字排版引擎等，在代码调用`dart:ui`库时，最终会走到引擎层，实现真正的绘制和显示。
- Embedder即嵌入层，Flutter最终渲染、交互是要需要依赖其所在平台的操作系统API，主要将Flutter引擎安装到特定平台上。嵌入层使用当前平台的语言，用于调用当前平台的API。



## 首个Flutter应用

### 目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/bd7480c3fd1945bb91678d185492b316.png)

- android:：Android源代码目录。
- ios：IOS源代码目录。
- lib：Flutter项目的核心目录，存放flutter源代码。
- test：测试代码目录。
- pubspec.yaml：Flutter项目的配置文件，类似于Android的build.gradle。



### 导包

```dart
import 'package:flutter/material.dart';
```

这里指导入Material UI组件库。



### 应用入口

```dart
void main() {
  runApp(const MyApp());
}
```



### Flutter项目结构

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '任务栏标题',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: '首页标题'),
    );
  }
}
```

在Flutter中，绝大多数组件、布局方式、手势等都是以Widget形式提供的。

- MyApp 表示Flutter应用，继承自StatelessWidget类，本质是一个widget。
- MateriaApp 是Flutter Material库提供的App框架，可以设置应用的名称、主题、首页、路由等。
- home 是Flutter应用的首页。



### 首页

```dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              '首页',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ), 
    );
  }
}
```

- MyHomePage 是应用首页，继承自StatefulWidget类，是一个有状态的widget。
- _MyHomePageState 是组建的状态类，记录状态值，当点击按钮时会触发`_incrementCounter()`，变量`_counter`会+1，接着会调用`setState()`，`setState()`会通知Flutter框架，Flutter框架收到通知会执行`build()`根据新的状态重构界面，Flutter对该方法做了优化执行变的很快。
- Scaffold 是Material库提供的页面脚手架，可以设置导航栏、标题、页面的内容。



## 设置app名称、图标

### Android设置app名称、图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2645f3a4ed14535bcb4448750bf3e85.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

- label：设置app名称
- icon：设置图标
- mipmap-mdpi、mipmap-hdpi、mipmap-xdpi、mipmap-xxdpi、mipmap-xxxdpi目录用于存放具体图片，`mipmap-mdpi 放置48*48的图标，mipmap-hdpi存放72*72，mipmap-xdpi存放96*96，mipmap-xxdpi存放144*144，mipmap-xxxdpi存放192*192`



### IOS设置app名称、图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f6cf0491a1b479abe380f2c9bb64d68.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

- CFBundleName：设置app名称



## pubspec.yaml配置文件说明

```yaml
name: myflutter #设置包名
description: A new Flutter project. #当前项目描述

publish_to: 'none' 

version: 1.0.0+1 #版本名和版本号，对应Android中的versionName和versionCode

environment: #支持Dart SDK版本
  sdk: ">=2.12.0 <3.0.0"

dependencies: #项目依赖库
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.2 #项目名+版本号，符号“^”表示自动匹配最近的一个大版本，如果不需要自动匹配可以去除“^”

dev_dependencies:
  flutter_test:
    sdk: flutter

  flutter_lints: ^1.0.0

flutter:

  uses-material-design: true #使用Material组件

  assets: #资源文件
    - assets/images/logo.png
    - assets/images/pub.png
    - assets/images/user.png
    - assets/images/avatar.jpg
    - assets/images/bird.jpg
    - assets/json/student.json
    - assets/json/students.json
    
  fonts: #字体
    - family: myIcon
      fonts:
        - asset: assets/fonts/iconfont.ttf
          style: italic    
```



## Flutter调试技巧

### 信息输出

```dart
print("测试1");
debugPrint("测试2");
```

-   `print`函数可以在任何模式下输出。
-   `debugPrint`函数只能在debug模式下输出。

### 断电调试

![在这里插入图片描述](https://img-blog.csdnimg.cn/6a8940a04f1b44e49057b25626e09e3a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/396e79543242422298c50c6257f8b513.png)



## Flutter Inspector调试快速定位元素

![在这里插入图片描述](https://img-blog.csdnimg.cn/b26c6a83096043e69468896af0d48294.png)



