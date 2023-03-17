[TOC]

# Flutter Card组件

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8bb6db4393040cea2a8c17387efe7b4.png)

```dart
Padding(
    padding: const EdgeInsets.all(10.0),
    child: Column(
        children: [
            Card(
                child: Column(
                    children: [
                        const ListTile(
                            leading: Icon(Icons.flag),
                            title: Text("hello"),
                            subtitle: Text("真棒Card"),
                        ),
                        ButtonBar(
                            children: [
                                TextButton(onPressed: () {}, child: const Text("确定")),
                                TextButton(onPressed: () {}, child: const Text("设置")),
                            ],
                        ),
                    ],
                ),
            ),
            Card(
                color: Colors.green,
                elevation: 10,
                child: Column(
                    children: [
                        const ListTile(
                            leading: Icon(Icons.flag),
                            title: Text("hello"),
                            subtitle: Text("真棒Card"),
                        ),
                        ButtonBar(
                            children: [
                                TextButton(onPressed: () {}, child: const Text("确定")),
                                TextButton(onPressed: () {}, child: const Text("设置")),
                            ],
                        ),
                    ],
                ),
            )
        ],
    ),
)
```

