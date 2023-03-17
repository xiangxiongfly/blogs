[TOC]

# Flutter 路由管理

## 概述

- 路由在移动开发中通常指页面，在Android中通常指代一个Activity。Flutter中的路由管理与原生开发较类似，路由管理指页面跳转关系。
- 路由入栈(push)操作对应打开一个新页面，出栈(pop)操作对应关闭页面。



## 简单路由

- 入栈，即新开一个页面，需要调用`Future<T?> push<T extends Object?>(BuildContext context, Route<T> route)`
- 出栈，即关闭页面，需要调用`pop<T extends Object?>(BuildContext context, [ T? result ])`
- Navigator：这是一个组件，用于管理和维护一个基于栈堆的历史记录，通过`push`和`pop`进行页面的跳转。

### 入栈和出栈

```dart
//入栈
Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => NewPage()),
);

//出栈
Navigator.pop(context);
```



### maybePop()

`maybePop`方法只会在路由堆栈有可弹路由时才会出栈。

```dart
Navigator.maybePop(context);
```



### canPop()

`canPop`方法可以判断当前路由堆栈是否可以出栈。

```dart
if (Navigator.canPop(context)) {
    Navigator.pop(context);
}
```



### pushReplacement()

`pushReplacement`方法可以用于切换路由页面。

```dart
Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (context) => NewPage()),
);
```



### pushAndRemoveUntil()

进入新页面并之前所有页面。

```dart
Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (BuildContext context) {
    return FourthPage();
}), (route) => false);
```



## 命名路由

命名路由指有名字的路由，通过给路由起名字，通过路由名直接打开新的页面，便于路由管理。

- `pushNamed`是命名路由的方式。
- 需要在`MaterialApp`中配置路由名称。



### 注册路由表

使用命名路由，必须先注册一个路由表，在MyApp类中添加`routes`属性。

**方式一**

```dart
class MyApp extends StatelessWidget {

    @override
    Widget build(BuildContext context) {
        return MaterialApp(   
            routes: {
                "/NewPage": (context) {
                    return NewPage();
                },
            },
            home: MyHomePage(title: '首页标题'),
        );
    }
}
```

**方式二**

首页home路由使用命名路由，需要在`routes`中注册MyHomePage路由，然后在`initialRoute`声明初始路由。

```dart
class MyApp extends StatelessWidget {

    @override
    Widget build(BuildContext context) {
        return MaterialApp(    
            routes: {
                "/": (context) {
                    return MyHomePage(title: '首页标题');
                },
                "NewPage": (context) {
                    return NewPage();
                },
            },
            initialRoute: "/",
        );
    }
}
```



### 入栈

```dart
Navigator.pushNamed(context, "/first_page");
```



### pushReplacementNamed()

`pushReplacementNamed`方法可以用于切换路由页面，退出当前页面，并切换至新页面。

```dart
Navigator.pushReplacementNamed(context, "/second_page");
```



### popAndPushNamed()

`popAndPushNamed`方法与`pushReplacementNamed`方法的功能基本一致，唯一的区别是会有页面退出的动画。

```dart
Navigator.popAndPushNamed(context, "/second_page");
```



### pushNamedAndRemoveUntil

进入新页面，并删除路由栈堆直到`/first_page`页面，当新页面退出时，会显示`/first_page`页面。

```dart
Navigator.pushNamedAndRemoveUntil(context, "/fourth_page", ModalRoute.withName('/first_page'));
```



### popUntil()

出栈到指定页面。

```dart
Navigator.popUntil(context, ModalRoute.withName('/first_page'));
```







## 传递参数

### 构造函数方式

**第一个页面**

```dart
//跳转
Navigator.push(
    context,
    MaterialPageRoute(builder: (context) {
        return SecondPage("hello world");
    }),
);
```

**第二个页面**

```dart
class SecondPage extends StatelessWidget {
    String title;

    SecondPage(this.title);

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text(title),
            ),
        );
    }
}
```



### 命名路由传参

- 使用`arguments`传递参数。
- 使用` ModalRoute.of(context)!.settings.arguments`获取参数。

**第一个页面**

```dart
Navigator.pushNamed(context, "/second_page", arguments: {"name": "小明", "age": 18, "address": "beijing"});
```

**第二个页面**

```dart
class SecondPage extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        var arguments = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;
        print(arguments);

        return Scaffold(
            appBar: AppBar(
                title: Text("第二个页面"),
            ),
            body: Text("姓名：${arguments!["name"]} 年龄：${arguments["age"]} 地址：${arguments["address"]} "),
        );
    }
}
```



### 普通路由传参

```dart
Navigator.push(
    context,
    MaterialPageRoute(
        builder: (context) {
            return SecondPage();
        },
        settings: const RouteSettings(
            name: "params",
            arguments: {"name": "小明", "age": 18, "address": "beijing"},
        ),
    ),
);
```



## 返回参数

push相关方法返回Future类型，可以使用await等待返回结果。

### async-await方式

**第二个页面**

```dart
Navigator.pop(context, "hello 返回");
```

**第一个页面**

```dart
onPressed: () async {
    var result = await Navigator.pushNamed(context, "/second_page");
    print(result);
},
```



### then

```dart
Navigator.pushNamed(context, "/second_page")
    .then((value) => {print(value)});
```



## 路由钩子

在使用命名路由跳转时，如果路由注册表没有注册，这时会调用`onGenerateRoute`回调。

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
      routes: {
        "/": (context) {
          return const MyHomePage(title: '首页标题');
        },
      },
      initialRoute: "/",
      onGenerateRoute: (RouteSettings settings) {
        print("onGenerateRoute ${settings.name}");
        if (settings.name == "NewPage") {
          return MaterialPageRoute(builder: (context) {
            return NewPage();
          });
        }
      },
    );
  }
}
```



## 总结

推荐使用命名路由，理由如下：

1. 语义化描述更清晰。
2. 方便代码维护。
3. 可以使用`onGenerateRoute`回调。

