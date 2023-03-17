[TOC]

# Flutter Dialog弹窗组件

## AlertDialog

![在这里插入图片描述](https://img-blog.csdnimg.cn/de66826ce094481d82ec47f8b20f2505.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_6,color_FFFFFF,t_70,g_se,x_16)

```dart
showDialog(
    context: context,
    builder: (BuildContext context) {
        return AlertDialog(
            title: const Text("提示"),
            content: const Text("确定删除吗？"),
            actions: [
                FlatButton(
                    onPressed: () {
                        Navigator.of(context).pop();
                    },
                    child: const Text("取消"),
                ),
                FlatButton(onPressed: () {}, child: const Text("确定")),
            ],
        );
    },
);

```



## AlertDialog设置自定义样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/6ccca62a63744789a6a7fe4f5bf27099.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_6,color_FFFFFF,t_70,g_se,x_16)

```dart
showCustomAlertDialog(context) async {
    var result = await showDialog(
        context: context,
        builder: (BuildContext context) {
            return AlertDialog(
                //标题
                title: const Center(child: Text("提示")),
                //标题样式
                titleTextStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                    fontSize: 30,
                ),
                //内容区
                content: const Center(heightFactor: 1, child: Text("确定删除吗？")),
                //背景颜色
                backgroundColor: Colors.yellowAccent,
                //弹窗形状
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                actionsAlignment: MainAxisAlignment.center,
                actions: [
                    FlatButton(
                        onPressed: () {
                            Navigator.of(context).pop("no");
                        },
                        child: const Text("取消"),
                    ),
                    FlatButton(
                        onPressed: () {
                            Navigator.of(context).pop("yes");
                        },
                        child: const Text("确定"),
                    ),
                ],
            );
        },
    );
    print("返回结果：$result");
}
```



## iOS风格

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7f5d84d880e4e258281ef6582d8f739.png)

```dart
showCupertinoAlertDialog(context) {
    showCupertinoDialog(
        //点击空白处不取消
        barrierDismissible: false,
        context: context,
        builder: (context) {
            return CupertinoAlertDialog(
                title: const Text("提示"),
                content: const Text("确认删除吗？"),
                actions: [
                    CupertinoDialogAction(
                        child: const Text("取消"),
                        onPressed: () {
                            Navigator.of(context).pop();
                        },
                    ),
                    CupertinoDialogAction(
                        child: const Text("确定"),
                        onPressed: () {},
                    ),
                ],
            );
        },
    );
}
```



## SimpleDialog

如果系统提供的弹窗不够用，可以使用SimpleDialog试试。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f7f654ab995145a7889bc9923ef16e1a.png)

```dart
showSimpleDialog(context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
            return SimpleDialog(
                title: const Center(child: Text("提示")),
                contentPadding: EdgeInsets.all(0),
                children: [
                    Container(
                        height: 80,
                        alignment: Alignment.center,
                        child: const Text("确定删除吗？"),
                    ),
                    Container(width: double.infinity, height: 1, color: Colors.black),
                    Center(
                        child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                                Expanded(
                                    child: TextButton(
                                        onPressed: () {
                                            Navigator.of(context).pop();
                                        },
                                        child: const Text("取消"),
                                    ),
                                ),
                                Container(width: 1, height: 50, color: Colors.black),
                                Expanded(
                                    child: TextButton(
                                        onPressed: () {},
                                        child: const Text("确定"),
                                    ),
                                ),
                            ],
                        ),
                    ),
                ],
            );
        },
    );
}
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