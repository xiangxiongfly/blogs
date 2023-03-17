[TOC]

# Flutter Provider状态管理

## 简述

Provider是Flutter官方推出的状态管理包。



## 添加库

```
dependencies:
  provider: ^6.0.3
```



## 简单使用

### 读取值

**监听数据**

```dart
context.watch<CounterModel>().count;
```

```dart
//等价于
Provider.of<CounterModel>(context).count;
```

**读取数据**

```dart
context.read<CounterModel>().add();
```

```dart
//等价于
Provider.of<CounterModel>(context, listen: false).add();
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/6a4a13e54f4546a1ac43cfd1d654add6.png)

### 定义数据管理类

必需继承`ChangeNotifier`类，否则无法刷新数据。

```dart
class CounterModel extends ChangeNotifier {
    int _count = 0;

    CounterModel(this._count);

    int get count => _count;

    void add() {
        _count++;
        notifyListeners();
    }
}
```

### 第一页

```dart
class ProviderFirstPage extends StatefulWidget {
    const ProviderFirstPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() => _ProviderFirstPageState();
}

class _ProviderFirstPageState extends State<ProviderFirstPage> {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("Provider 第一页"),
            ),
            body: Center(
                child: Column(
                    children: [
                        //监听数据变化
                        Text("${context.watch<CounterModel>().count}"),
                        ElevatedButton(
                            onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (BuildContext context) {
                                        return const ProviderSecondPage();
                                    }),
                                );
                            },
                            child: const Text("跳转第二页"),
                        ),
                    ],
                ),
            ),
            floatingActionButton: FloatingActionButton(
                child: const Icon(Icons.add),
                onPressed: () {
                    //修改数据
                    context.read<CounterModel>().add();
                },
            ),
        );
    }
}
```

### 第二页

```dart
class ProviderSecondPage extends StatefulWidget {
    const ProviderSecondPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() => _ProviderSecondPageState();
}

class _ProviderSecondPageState extends State<ProviderSecondPage> {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("Provider 第二页"),
            ),
            body: Center(
                child: Column(
                    children: [
                        //监听数据变化
                        Text("${Provider.of<CounterModel>(context).count}"),
                        ElevatedButton(
                            onPressed: () {
                                Navigator.pop(context);
                            },
                            child: const Text("返回"),
                        ),
                    ],
                ),
            ),
            floatingActionButton: FloatingActionButton(
                child: const Icon(Icons.add),
                onPressed: () {
                    //修改数据
                    Provider.of<CounterModel>(context, listen: false).add();
                },
            ),
        );
    }
}
```

### 注册单个状态管理类

```dart
void main() {
    runApp(
        ChangeNotifierProvider(
            create: (context) => CounterModel(0),
            child: const MyApp(),
        ),
    );
}
```

### 注册多个状态管理类

```dart
void main() {
    runApp(
        MultiProvider(
            providers: [
                ChangeNotifierProvider(create: (context) => CounterModel(0)),
            ],
            child: const MyApp(),
        ),
    );
}
```

