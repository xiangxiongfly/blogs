[TOC]

# Flutter AutomaticKeepAliveClientMixin缓存组件

## 概述

AutomaticKeepAlive 的组件的主要作用是将列表项的根 RenderObject 的 keepAlive **按需自动标记** 为 true 或 false。为了方便叙述，我们可以认为根 RenderObject 对应的组件就是列表项的根 Widget，代表整个列表项组件，同时我们将列表组件的 Viewport区域 + cacheExtent（预渲染区域）称为**加载区域** ：

1.  当 keepAlive 标记为 false 时，如果列表项滑出加载区域时，列表组件将会被销毁。
2.  当 keepAlive 标记为 true 时，当列表项滑出加载区域后，Viewport 会将列表组件缓存起来；当列表项进入加载区域时，Viewport 从先从缓存中查找是否已经缓存，如果有则直接复用，如果没有则重新创建列表项。



## 基本使用

```dart
class KeepAlivePage extends StatefulWidget {
    const KeepAlivePage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _KeepAlivePageState();
    }
}

class _KeepAlivePageState extends State<KeepAlivePage> {
    @override
    Widget build(BuildContext context) {
        List<Widget> pageList = [];
        for (int i = 0; i < 5; i++) {
            pageList.add(ItemPage(title: i.toString()));
        }

        return Scaffold(
            appBar: AppBar(
                title: const Text("AutomaticKeepAlive缓存组件"),
            ),
            body: PageView(
                children: pageList,
            ),
        );
    }
}

class ItemPage extends StatefulWidget {
    final String title;

    const ItemPage({Key? key, required this.title}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _ItemPage();
    }
}

class _ItemPage extends State<ItemPage> with AutomaticKeepAliveClientMixin {
    @override
    Widget build(BuildContext context) {
        print("build ${widget.title}");
        return Center(child: Text(widget.title));
    }

    @override
    bool get wantKeepAlive => true; //是否缓存
}
```

说明：

-   当wantKeepAlive为false时，每次切换页面，ItemPage都会被build一次，说明页面没有被缓存。
-   当wantKeepAlive为true时，表示缓存页面，往回切换页面时不在执行build方法。



## 封装使用

**封装AutomaticKeepAliveClientMixin**

```dart
class KeepAliveWrapper extends StatefulWidget {
    final bool keepAlive;
    final Widget child;

    const KeepAliveWrapper({Key? key, this.keepAlive = true, required this.child}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _KeepAliveWrapperState();
    }
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper> with AutomaticKeepAliveClientMixin {
    @override
    Widget build(BuildContext context) {
        super.build(context);
        return widget.child;
    }

    @override
    void didUpdateWidget(covariant KeepAliveWrapper oldWidget) {
        //状态发生变化时调用
        if (oldWidget.keepAlive != widget.keepAlive) {
            //更新KeepAlive状态
            updateKeepAlive();
        }
        super.didUpdateWidget(oldWidget);
    }

    @override
    bool get wantKeepAlive => widget.keepAlive;
}
```

**使用**

```dart
class ItemPage2 extends StatelessWidget {
    final String title;

    const ItemPage2({Key? key, required this.title}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        print("ItemPage2 build $title");
        return Center(child: Text(title));
    }
}
```

```dart
List<Widget> pageList = [];

for (int i = 0; i < 5; i++) {
    pageList.add(KeepAliveWrapper(child: ItemPage2(title: i.toString())));
}
return Scaffold(
    appBar: AppBar(
        title: const Text("AutomaticKeepAlive缓存组件"),
    ),
    body: PageView(
        children: pageList,
    ),
);
```

