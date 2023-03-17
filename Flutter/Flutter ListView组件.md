[TOC]

# Flutter ListView组件

## 基本属性

```
itemExtent：item高度长度，指定itemExtent有利于提高性能，避免每次构建子组件时再次计算。

prototypeItem：指定子元素的高度，和itemExtent类似，但与itemExtent属性互斥。

shrinkWrap：默认为false，会根据子元素的总长度计算机ListView的长度，在主轴方向尽可能多占空间；在无限长容器里必须设置为true。

scrollDirection：滚动方向。
		- Axis.vertical：水平方向
		- Axis.horizontal：垂直方向。
		
controller：控制ListView滚动。

physics：滚动特性。
		- AlwaysScrollableScrollPhysics：总是可以滑动。
		- verScrollableScrollPhysics：禁止滚动。
		- uncingScrollPhysics ：内容超过一屏 上拉有回弹效果。
		- ampingScrollPhysics ：包裹内容 不会有回弹。
```



## 简单使用

这种方式会一次性加载所有组件，没有懒加载，适合数据量比较小。

![在这里插入图片描述](https://img-blog.csdnimg.cn/891cebc78d914521916b7d781a6d8da9.png)

```dart
ListView(
    itemExtent: 50,
    children: List.generate(10, (index) {
        return Center(child: Text("$index"));
    }),
)
```



## ListView.builder 动态创建

这种方式适合大量数据。

```dart
ListView.builder(
    itemCount: 50,
    itemExtent: 50,
    itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Center(child: Text("$index")));
    },
)
```



## ListView.separated 添加分割线

![在这里插入图片描述](https://img-blog.csdnimg.cn/ca089f0c444649bea59922442237497a.png)

```dart
Widget divider1 = const Divider(color: Colors.red);
Widget divider2 = const Divider(color: Colors.blue);

ListView.separated(
    itemCount: 100,
    itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Center(child: Text("$index")));
    },
    separatorBuilder: (BuildContext context, int index) {
        return index % 2 == 0 ? divider1 : divider2;
    },
)
```



## ListView & ScrollController 滚动监听

![在这里插入图片描述](https://img-blog.csdnimg.cn/6aa4baabbe534f098a8328a7195f8550.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/1477265fa5ca43e1a970ef9bf0e9007d.png)

```dart
class DataListViewPage extends StatefulWidget {
    const DataListViewPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _DataListViewPageState();
    }
}

class _DataListViewPageState extends State<DataListViewPage> {
    final ScrollController _controller = ScrollController();
    bool showTopBtn = false;

    @override
    void initState() {
        _controller.addListener(() {
            if (_controller.offset < 100) {
                if (showTopBtn) {
                    showTopBtn = false;
                    setState(() {});
                }
            } else {
                if (!showTopBtn) {
                    showTopBtn = true;
                    setState(() {});
                }
            }
        });
        super.initState();
    }

    @override
    void dispose() {
        _controller.dispose();
        super.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("动态创建&滚动监听"),
            ),
            body: ListView.builder(
                controller: _controller,
                itemCount: 50,
                itemExtent: 50,
                itemBuilder: (BuildContext context, int index) {
                    return ListTile(title: Center(child: Text("$index")));
                },
            ),
            floatingActionButton: !showTopBtn
            ? null
            : FloatingActionButton(
                child: const Icon(Icons.vertical_align_top),
                onPressed: () {
                    _controller.animateTo(0, duration: const Duration(microseconds: 800), curve: Curves.ease);
                },
            ),
        );
    }
}
```



## ListView & Scrollbar 设置滚动条

![在这里插入图片描述](https://img-blog.csdnimg.cn/c4d48cb8d4b0433eb7f5e512f4da66c6.png)

```dart
Scrollbar(
    child: ListView.builder(
        itemBuilder: (BuildContext context, int index) {
            return Center(child: Text(index.toString()));
        },
        itemCount: 50,
        itemExtent: 50,
    ),
)
```



## ListView & RefreshIndicator 下拉刷新

![在这里插入图片描述](https://img-blog.csdnimg.cn/15a0b797e9a9456b929f672891bb0b54.png)

```dart
class ListViewRefreshPage extends StatefulWidget {
    const ListViewRefreshPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _ListViewRefreshPageState();
    }
}

class _ListViewRefreshPageState extends State<ListViewRefreshPage> {
    List list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("下拉刷新"),
            ),
            body: RefreshIndicator(
                onRefresh: () async {
                    setState(() {
                        list.insert(0, "新数据");
                    });
                },
                child: ListView.builder(
                    itemBuilder: (BuildContext context, int index) {
                        return Center(child: Text(list[index].toString()));
                    },
                    itemExtent: 50,
                    itemCount: list.length,
                ),
            ),
        );
    }
}
```



## AnimatedList

AnimatedList提供了一种简单的方式使列表数据发生变化时加入过渡动画，

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ba2a3182dba4c689378a17a2dc49cff.gif)

```dart
class AnimatedListPage extends StatefulWidget {
    const AnimatedListPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _AnimatedListPageState();
    }
}

class _AnimatedListPageState extends State<AnimatedListPage> {
    final GlobalKey<AnimatedListState> _listKey = GlobalKey<AnimatedListState>();
    var data = <String>[];
    int counter = 5;

    @override
    void initState() {
        for (int i = 0; i < counter; i++) {
            data.add(i.toString());
        }
        super.initState();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("AnimatedList"),
            ),
            body: AnimatedList(
                key: _listKey,
                initialItemCount: data.length,
                itemBuilder: (BuildContext context, int index, Animation<double> animation) {
                    return FadeTransition(
                        opacity: animation,
                        child: buildItem(context, index),
                    );
                },
            ),
            floatingActionButton: FloatingActionButton(
                child: const Icon(Icons.add),
                onPressed: () {
                    addItem();
                },
            ),
        );
    }

    Widget buildItem(BuildContext context, int index) {
        String c = data[index];
        return ListTile(
            key: ValueKey(c),
            title: Text(c),
            trailing: IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () {
                    deleteItem(context, index);
                },
            ),
        );
    }

    void addItem() {
        data.add(counter.toString());
        counter++;
        _listKey.currentState!.insertItem(data.length - 1);
    }

    void deleteItem(BuildContext context, int index) {
        _listKey.currentState!.removeItem(
            index,
            (BuildContext context, Animation<double> animation) {
                var item = buildItem(context, index);
                data.removeAt(index);
                return FadeTransition(
                    opacity: CurvedAnimation(
                        parent: animation,
                        //让透明度变化的更快一些
                        curve: const Interval(0.5, 1.0),
                    ),
                    child: SizeTransition(
                        sizeFactor: animation,
                        axisAlignment: 0.0,
                        child: item,
                    ),
                );
            },
            duration: const Duration(milliseconds: 100),
        );
    }
}
```
