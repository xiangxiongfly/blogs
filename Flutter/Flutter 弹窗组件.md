[TOC]

# 弹窗系列组件

## 概述

弹窗的基本内容分布区域：

-   标题title区域
-   内容content区域
-   按钮actions区域

常用方法：

-   `showDialog`方法是Material组件库提供的，用于弹出Materail风格弹窗的方法。

-   `showCupertinoDialog`方法是弹出苹果风格的弹窗。

-   `showGeneralDialog`方法是自定义显示的弹窗内容，可以结合动画组件。

-   `showBottomSheet`方法是底部弹出Material风格的弹窗。

-   `showModalBottomSheet`方法是底部弹出一个Modal Material Design风格的对话框。

-   `showCupertinoModalPopup`方法是用来快速构建弹出iOS风格的底部弹框。

    



## showDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/332e08f7e2a0412c86bd3e86c1060fce.png)

```dart
/// showDialog
showDialogFunction(context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
            return AlertDialog(
                title: const Text("提示"),
                content: const Text("确定删除吗？"),
                actions: [
                    TextButton(
                        onPressed: () {
                            Navigator.of(context).pop();
                        },
                        child: const Text("取消"),
                    ),
                    TextButton(onPressed: () {}, child: const Text("确定")),
                ],
            );
        },
    );
}
```



## showCupertinoDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf978378e87e407796f0030903003cc1.png)

```dart

/// showCupertinoDialog
showCupertinoDialogFunction(context) {
    showCupertinoDialog(
        context: context,
        builder: (BuildContext context) {
            return AlertDialog(
                title: const Text("提示"),
                content: const Text("确定删除吗？"),
                actions: [
                    TextButton(
                        onPressed: () {
                            Navigator.of(context).pop();
                        },
                        child: const Text("取消"),
                    ),
                    TextButton(onPressed: () {}, child: const Text("确定")),
                ],
            );
        },
    );
}
```



## showGeneralDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/e6207c6970754716aff9a4c071a2c59f.gif)

```dart
/// showGeneralDialog
showGeneralDialogFunction(context) {
    showGeneralDialog(
        context: context,
        pageBuilder:
        (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
            return AlertDialog(
                title: const Text("提示"),
                content: const Text("确定删除吗？"),
                actions: [
                    TextButton(
                        onPressed: () {
                            Navigator.of(context).pop();
                        },
                        child: const Text("取消"),
                    ),
                    TextButton(onPressed: () {}, child: const Text("确定")),
                ],
            );
        },
        transitionDuration: const Duration(seconds: 1),
        transitionBuilder: (BuildContext context, Animation<double> animation,
                            Animation<double> secondaryAnimation, Widget child) {
            return FractionalTranslation(
                //从左向右滑出
                // translation: Offset(animation.value - 1, 0),
                //从右向左滑出
                // translation: Offset(1 - animation.value, 0),
                //从顶部滑出
                // translation: Offset(0, animation.value - 1),
                //从底部滑出
                translation: Offset(0, 1 - animation.value),
                child: child,
            );
        },
    );
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b7bcd8fbd5e140c68b93e13ab8fce217.gif)

```dart
/// showGeneralDialog：缩放动画
showGeneralDialogFunction2(context) {
  showGeneralDialog(
    context: context,
    pageBuilder:
        (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
      return AlertDialog(
        title: const Text("提示"),
        content: const Text("确定删除吗？"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text("取消"),
          ),
          TextButton(onPressed: () {}, child: const Text("确定")),
        ],
      );
    },
    transitionBuilder: (BuildContext context, Animation<double> animation,
        Animation<double> secondaryAnimation, Widget child) {
      return ScaleTransition(
        alignment: Alignment.center,
        scale: animation,
        child: child,
      );
    },
  );
}
```



## showBottomSheet

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc9b03caf84542028d0518e75ddba9e9.gif)

```dart
/// showBottomSheet：底部弹窗
showBottomSheetFunction(context) {
    showBottomSheet(
        context: context,
        builder: (BuildContext context) {
            return Container(
                padding: const EdgeInsets.all(10),
                color: Colors.white,
                height: 240,
                width: double.infinity,
                child: Column(
                    children: [
                        Container(
                            alignment: Alignment.center,
                            height: 55,
                            child: const Text(
                                "提示",
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                        ),
                        const Expanded(
                            child: Text(
                                "这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息",
                                style: TextStyle(fontSize: 14),
                            ),
                        ),
                        SizedBox(
                            height: 65,
                            child: Row(
                                children: [
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("取消"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("确定"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                ],
                            ),
                        ),
                    ],
                ),
            );
        },
    );
}
```



## showModalBottomSheet

![在这里插入图片描述](https://img-blog.csdnimg.cn/752853f45c434206af363e42b239d754.gif)

```dart
/// showModalBottomSheet：Material风格的底部弹窗
showModalBottomSheetFunction(context) {
    showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
            return Container(
                padding: const EdgeInsets.all(10),
                color: Colors.white,
                height: 240,
                width: double.infinity,
                child: Column(
                    children: [
                        Container(
                            alignment: Alignment.center,
                            height: 55,
                            child: const Text(
                                "提示",
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                        ),
                        const Expanded(
                            child: Text(
                                "这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息",
                                style: TextStyle(fontSize: 14),
                            ),
                        ),
                        SizedBox(
                            height: 65,
                            child: Row(
                                children: [
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("再考虑下"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("考虑好了"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                ],
                            ),
                        ),
                    ],
                ),
            );
        },
    );
}
```



## showCupertinoModalPopup

![在这里插入图片描述](https://img-blog.csdnimg.cn/f033f766516945c987592b95f009745c.gif)

```dart
/// showCupertinoModalPopup：iOS风格的底部弹窗
showCupertinoModalPopupFunction(context) {
    showCupertinoModalPopup(
        context: context,
        builder: (BuildContext context) {
            return Container(
                padding: const EdgeInsets.all(10),
                color: Colors.white,
                height: 240,
                width: double.infinity,
                child: Column(
                    children: [
                        Container(
                            alignment: Alignment.center,
                            height: 55,
                            child: const Text(
                                "提示",
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                        ),
                        const Expanded(
                            child: Text(
                                "这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息这是一些信息",
                                style: TextStyle(fontSize: 14),
                            ),
                        ),
                        SizedBox(
                            height: 65,
                            child: Row(
                                children: [
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("再考虑下"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                    Expanded(
                                        child: TextButton(
                                            child: const Text("考虑好了"),
                                            onPressed: () {
                                                Navigator.of(context).pop();
                                            },
                                        ),
                                    ),
                                ],
                            ),
                        ),
                    ],
                ),
            );
        },
    );
}
```



## AlertDialog 自定义样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/6ccca62a63744789a6a7fe4f5bf27099.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_6,color_FFFFFF,t_70,g_se,x_16)

```dart
showDialog(
    context: context,
    builder: (BuildContext context) {
        return AlertDialog(
            title: Center(child: Text("提示")),
            titleTextStyle: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black,
                fontSize: 30,
            ),
            content: Center(heightFactor: 1, child: Text("确定删除吗？")),
            backgroundColor: Colors.yellowAccent,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            actionsAlignment: MainAxisAlignment.center,
            actions: [
                FlatButton(
                    onPressed: () {
                        Navigator.of(context).pop("no");
                    },
                    child: Text("取消"),
                ),
                FlatButton(
                    onPressed: () {
                        Navigator.of(context).pop("yes");
                    },
                    child: Text("确定"),
                ),
            ],
        );
    },
);
```



## CupertinoAlertDialog IOS风格

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7f5d84d880e4e258281ef6582d8f739.png)

```dart
showCupertinoDialog(
    //点击空白处取消
    barrierDismissible: true,
    context: context,
    builder: (context) {
        return CupertinoAlertDialog(
            title: Text("提示"),
            content: Text("确认删除吗？"),
            actions: [
                CupertinoDialogAction(
                    child: Text("取消"),
                    onPressed: () {
                        Navigator.of(context).pop();
                    },
                ),
                CupertinoDialogAction(
                    child: Text("确定"),
                    onPressed: () {},
                ),
            ],
        );
    },
);
```



## SimpleDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ddf88483c604a8483f8ca9508b36460.png)

```dart
showDialog(
    context: context,
    builder: (BuildContext context) {
        return SimpleDialog(
            title: Text("提示"),
            children: [
                Container(
                    height: 80,
                    alignment: Alignment.center,
                    child: Text("确定删除吗？"),
                ),
                Divider(height: 1),
                TextButton(
                    onPressed: () {
                        Navigator.of(context).pop();
                    },
                    child: Text("取消"),
                ),
                Divider(height: 1),
                TextButton(
                    onPressed: () {},
                    child: Text("确定"),
                ),
            ],
        );
    },
);
```



## 自定义Dialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/853aaf1f1da1416880ea11bbadf53c10.png)

```dart
showDialog(
    context: context,
    builder: (BuildContext context) {
        return Dialog(
            child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                    "hello world",
                    textAlign: TextAlign.center,
                ),
            ),
        );
    },
);
```

