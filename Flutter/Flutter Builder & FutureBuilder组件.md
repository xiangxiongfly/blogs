[TOC]

# Flutter Builder & FutureBuilder & StreamBuilder组件

## Builder组件

Builder组件起闭包作用，可以限制期使用范围。

### 问题

```dart
class BuilderPage extends StatelessWidget {
    const BuilderPage({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("Builder组件"),
            ),
            body: Center(
                child: RaisedButton(
                    color: Colors.red,
                    textColor: Colors.white,
                    onPressed: () {
                        showSnackBar(context);
                    },
                    child: const Text('show SnackBar'),
                ),
            ),
        );
    }

    showSnackBar(BuildContext context) {
        const snackBar = SnackBar(content: Text('老孟'));
        Scaffold.of(context).showSnackBar(snackBar);
    }
}
```

点击按钮后，会提示异常信息：`Scaffold.of() called with a context that does not contain a Scaffold.`。

这是因为你传入的BuildContext是当前parent Widget的，不是Scaffold的，所以会报错。

### 解决

可以借助Builder组件解决。

```dart
@override
Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            title: const Text("Builder组件"),
        ),
        body: Builder(
            builder: (context) {
                return Center(
                    child: RaisedButton(
                        color: Colors.red,
                        textColor: Colors.white,
                        onPressed: () {
                            showSnackBar(context);
                        },
                        child: const Text('show SnackBar'),
                    ),
                );
            }
        ),
    );
}
```



## FutureBuilder组件

展示异步任务状态，当有一个Future异步任务需要展示给用户时，可以使用FutureBuilder组件来实现。

![在这里插入图片描述](https://img-blog.csdnimg.cn/154b1932adbd483c8e9578090bb564d8.gif)

```dart
final Future<dynamic> _futureSuccess = Future.delayed(const Duration(seconds: 3), () {
    return "成功了";
});
final Future<dynamic> _futureError = Future.delayed(const Duration(seconds: 3), () {
    return Future.error("失败了");
});

String _msg = "加载中";
String _msg2 = "加载中";

FutureBuilder(
    future: _futureSuccess,
    builder: (context, snapshot) {
        late Widget widget;
        if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
                widget = const Icon(Icons.error, color: Colors.red, size: 50);
                _msg = snapshot.error.toString();
            } else {
                if (snapshot.hasData) {
                    _msg = snapshot.data.toString();
                } else {
                    _msg = "无数据";
                }
                widget = const Icon(Icons.check_circle, color: Colors.green, size: 50);
            }
        } else {
            widget = const CircularProgressIndicator();
            _msg = "加载中";
        }
        return Container(
            height: 100,
            width: 100,
            decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: const BorderRadius.all(Radius.circular(10)),
            ),
            child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                    children: [
                        widget,
                        Text(_msg),
                    ],
                ),
            ),
        );
    },
),
FutureBuilder(
    future: _futureError,
    builder: (context, snapshot) {
        late Widget widget;
        if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
                widget = const Icon(Icons.error, color: Colors.red, size: 50);
                _msg2 = snapshot.error.toString();
            } else {
                widget = const Icon(Icons.check_circle, color: Colors.green, size: 50);
                _msg2 = snapshot.data.toString();
            }
        } else {
            widget = const CircularProgressIndicator();
            _msg2 = "加载中";
        }
        return Container(
            height: 100,
            width: 100,
            decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: const BorderRadius.all(Radius.circular(10)),
            ),
            child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                    children: [
                        widget,
                        Text(_msg2),
                    ],
                ),
            ),
        );
    },
)
```



## StreamBuilder组件

StreamBuilder组件用于异步接收数据更新组件，与FutureBuilder不同的地方在于StreamBuilder可以接收多个异步操作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a6443ec73420491d8c6354a48e50d1b1.gif)

```dart
late StreamController<dynamic> _streamController;

@override
void initState() {
    _streamController = StreamController();
    super.initState();
}

@override
void dispose() {
    _streamController.close();
    super.dispose();
}

Column(
    children: [
        StreamBuilder(
            stream: _streamController.stream,
            builder: (BuildContext context, AsyncSnapshot<dynamic> snapshot) {
                if (snapshot.hasError) {
                    return const Text("失败");
                } else {
                    if (snapshot.hasData) {
                        return Text("有数据 ${snapshot.data}");
                    } else {
                        return const Text("无数据");
                    }
                }
            },
        ),
        ElevatedButton(
            onPressed: () {
                _streamController.add("hello StreamBuilder");
            },
            child: const Text("发送数据"),
        ),
    ],
)
```









