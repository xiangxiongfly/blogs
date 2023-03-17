[TOC]

# Flutter 功能型组件

## 监听返回键

两次点击返回键才会退出程序。

```dart
class _MyHomePageState extends State<MyHomePage> {
    DateTime? lastTime;

    @override
    Widget build(BuildContext context) {
        return WillPopScope(
            onWillPop: () async {
                if (lastTime == null ||
                    DateTime.now().difference(lastTime!) > const Duration(seconds: 1)) {
                    lastTime = DateTime.now();
                    ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("再按一次退出程序")),
                    );
                    return false;
                } else {
                    return true;
                }
            },
            child: Scaffold(
               
            ),
        );
    }
}
```





















































































































