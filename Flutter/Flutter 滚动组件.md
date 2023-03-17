[TOC]

# Flutter 滚动控件

## SingleChildScrollView

滚动组件，类似于Android中的ScrollView，只能接收一个子元素。

```
scrollDirection：滚动方向。

padding：设置内边距。

BouncingScrollPhysics：滚动到边界效果
    - ClampingScrollPhysics：类似安卓效果，会有微光显示。
    - BouncingScrollPhysics：类似ios效果，会有回弹。
    - NeverScrollableScrollPhysics：禁止滚动。
    - AlwaysScrollableScrollPhysics：可以滚动。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/9609b9de30474c2d9a32054649fbd404.png)

```dart
Scrollbar(
    child: Container(
        width: double.infinity,
        child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            padding: EdgeInsets.all(10),
            child: Column(
                children:
                str.split("").map((e) => Text(e, textScaleFactor: 2)).toList(),
            ),
        ),
    ),
)
```



## ListView

itemExtent：子组件长度，指定itemExtent后有利于提高性能，避免每次构建子组件时再次计算。

prototypeItem：列表项原型，指定子元素的Widget。有利于提供ListView性能，与itemExtent互斥。

shrinkWrap：是否根据子组件的总长度设置ListView的长度，默认为false。如果为false时，ListView会在主轴方向尽可能多占空间。



### 默认构造函数

这种方式会一次还在所有组件，没有懒加载，适合数据量比较小。

```
itemExtent：子元素高度，会强制子元素的高度为itemExtent值。

prototypeItem：子列表原型，会计算子元素的高度，和itemExtent类似，但与itemExtent属性互斥。

shrinkWrap：默认为false，会根据子元素的总长度计算机ListView的长度，在主轴方向尽可能多占空间；在无限长容器里必须设置为true。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ec05969d7b63447d851e9e29abe8b087.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_7,color_FFFFFF,t_70,g_se,x_16)

```dart
ListView(
    shrinkWrap: true,
    prototypeItem: Padding(
        padding: EdgeInsets.all(20),
        child: Text("A"),
    ),
    children: List.generate(5, (index) {
        return Center(child: Text("$index"));
    }),
)
```



### ListView.builder

适合数据量比较多或不确定的情况。

```
itemCount：子元素数量。如果为null，表示无限列表。

itemExtent：每一个子元素的高度。

itemBuilder：创建子元素的Widget。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5c1c91b19a94984bddaf7aa6bda5352.png)

```dart
ListView.builder(
    itemCount: 50,
    itemExtent: 50,
    itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Center(child: Text("$index")));
    },
)
```



### ListView.separated

可以给ListView添加一个分割线。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2dced65624fc4c15a709967c8fa845a0.png)

```dart
Widget divider1 = Divider(color: Colors.red);
Widget divider2 = Divider(color: Colors.blue);

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



## ScrollController

监听滚动组件。

```
offset：滚动距离。

animateTo & jumpTo：滚动到指定位置，前者滚动时会执行动画，后者则不会。

addListener：监听滚动组件。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/380fc78010ef4ec9ac960a82098c724b.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/e27e016bc6a2430baba468ac006bdd80.png)

```dart
class ListViewPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() {
        return _ListViewPageState();
    }
}

class _ListViewPageState extends State<ListViewPage> {
    final ScrollController _controller = ScrollController();
    bool showTopBtn = false;

    @override
    void initState() {
        super.initState();
        _controller.addListener(() {
            print("滚动距离：${_controller.offset}");
            if (_controller.offset < 1000) {
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
    }

    @override
    void dispose() {
        super.dispose();
        _controller.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text("ListView"),
                actions: [],
            ),
            body: ListView.builder(
                itemCount: null,
                itemExtent: 50,
                physics: BouncingScrollPhysics(),
                controller: _controller,
                itemBuilder: (BuildContext context, int index) {
                    return ListTile(title: Text("$index"));
                }),
            floatingActionButton: !showTopBtn
            ? null
            : FloatingActionButton(
                onPressed: () {
                    _controller.animateTo(
                        0,
                        duration: Duration(microseconds: 800),
                        curve: Curves.ease,
                    );
                },
                child: Icon(Icons.arrow_upward),
            ),
        );
    }
}
```



## NotificationListener

可以监听ListView、NestedScrollView、GridView的滚动监听。

**NotificationListener与ScrollController对比**

- NotificationListener可以在任意位置监听，并且携带的信息更多。
- ScrollController只能和具体的滚动组件关联后才能监听，只能获取当前滚动位置。



ScrollNotification类里包含一个metrics属性，其类型是ScrollMetrics，包含一些信息：

```
var extentBefore = notification.metrics.extentBefore; //已滑出ViewPort顶部的长度，已滚动距离
var extentInside = notification.metrics.extentInside; //ViewPort内部长度，表示屏幕显示的列表部分的长度
var extentAfter = notification.metrics.extentAfter; //未划入ViewPort部分的长度
var pixels = notification.metrics.pixels; //当前滚动距离
var maxScrollExtent = notification.metrics.maxScrollExtent; //最大可滚动距离
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/781aa4bc55fc4990a96ba4c37ba62418.png)

```dart
class NotificationListenerPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() {
        return _NotificationListenerPageState();
    }
}

class _NotificationListenerPageState extends State<NotificationListenerPage> {
    String _progress = "0%";

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(title: Text("滚动监听")),
            body: Scrollbar(
                child: NotificationListener<ScrollNotification>(
                    onNotification: (ScrollNotification notification) {
                        double progress = notification.metrics.pixels /
                            notification.metrics.maxScrollExtent;
                        setState(() => _progress = "${(progress * 100).toInt()}%");
                        return false;
                    },
                    child: Stack(
                        alignment: Alignment.center,
                        children: [
                            ListView.builder(
                                itemCount: 100,
                                itemExtent: 50,
                                itemBuilder: (context, index) => ListTile(
                                    title: Text("$index"),
                                ),
                            ),
                            CircleAvatar(
                                radius: 30,
                                child: Text(_progress),
                                backgroundColor: Colors.transparent.withAlpha(200),
                            ),
                        ],
                    ),
                ),
            ),
        );
    }
}
```



## AnimatedList

![在这里插入图片描述](https://img-blog.csdnimg.cn/761bfa10b3a04bb1bd39881dfe7a7fe8.png)

```dart
class AnimatedListPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() {
        return _AnimatedListPageState();
    }
}

class _AnimatedListPageState extends State<AnimatedListPage> {
    final _listKey = GlobalKey<AnimatedListState>();
    var data = <String>[];
    int counter = 5;

    @override
    void initState() {
        super.initState();
        for (int i = 0; i < counter; i++) {
            data.add("${i + 1}");
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("AnimatedList"),
                actions: [
                    IconButton(
                        icon: const Icon(Icons.add),
                        onPressed: () {
                            addItem();
                        },
                    ),
                ],
            ),
            body: AnimatedList(
                key: _listKey,
                initialItemCount: data.length,
                itemBuilder: (context, index, animation) {
                    return buildItem(context, index);
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
        data.add("${++counter}");
        _listKey.currentState!.insertItem(data.length - 1);
    }

    void deleteItem(BuildContext context, int index) {
        _listKey.currentState!.removeItem(
            index,
            (BuildContext context, Animation<double> animation) {
                var item = buildItem(context, index);
                data.removeAt(index);
                return item;
            },
        );
    }
}
```



## GridView

可滚动的二维网格列表。

### SliverGridDelegateWithFixedCrossAxisCount

横轴为固定数量的子元素布局。

```
crossAxisCount：横轴的子元素的数量。

mainAxisSpacing：主轴方向的间距。

crossAxisSpacing：横轴方向的间距。

childAspectRatio：子元素的宽高比。

gridDelegate：控制交叉轴拍了发方式
	- SliverGridDelegateWithFixedCrossAxisCount：交叉轴上的子元素固定数量。
	- SliverGridDelegateWithMaxCrossAxisExtent：交叉轴方向尽可能大。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/ef50e323ae45496389aa9dc84f3a2211.png)

```dart
GridView(
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1,
    ),
    children: const [
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
    ],
)
```



### GridView.count

用于快速创建GridView，内部仍然使用`SliverGridDelegateWithFixedCrossAxisCount`等价于上面的代码。

```dart
GridView.count(
    crossAxisCount: 3,
    childAspectRatio: 1,
    children: [
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
    ],
)
```



### SliverGridDelegateWithMaxCrossAxisExtent

横轴的子元素最大长度的布局。

maxCrossAxisExtent：横轴子元素最大长度。

```dart
GridView(
    gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 120,
        childAspectRatio: 1,
    ),
    children: const [
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
        Icon(Icons.add),
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
    ],
)
```



### GridView.extent

快速创建GridView，本质是调用SliverGridDelegateWithMaxCrossAxisExtent。

```dart
GridView.extent(
    maxCrossAxisExtent: 120,
    children: const [
        Icon(Icons.delete),
        Icon(Icons.update),
        Icon(Icons.close),
        Icon(Icons.lock),
        Icon(Icons.home),
        Icon(Icons.add),
    ],
)
```



### GridView.builder

当子元素数量较多时，推荐使用`GridView.builder()`方式创建。

```dart
GridView.builder(
    itemCount: 50,
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1,
    ),
    itemBuilder: (BuildContext context, int index) {
        return index % 2 == 0 ? Icon(Icons.delete) : Icon(Icons.add);
    },
)
```



### GridView.custom

```dart
GridView.custom(
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
    ),
    childrenDelegate: SliverChildBuilderDelegate(
        (context, index) {
            return Container(
                height: 80,
                color: Colors.primaries[index % Colors.primaries.length],
            );
        },
        childCount: 50,
    ),
)
```



## PageView

类似于Android中的ViewPager控件。PageView组件可以实现页面切换和Tab布局。

```
pageSnapping：每次滑动时，是否强制切换页面。

onPageChanged：滚动监听。

allowImplicitScrolling：是否预加载下一页。

```



![在这里插入图片描述](https://img-blog.csdnimg.cn/a4ec29d263bc460eaa8352a7d1c41079.gif)

```dart
class PageViewPage extends StatefulWidget {
    const PageViewPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _PageViewPageState();
    }
}

class _PageViewPageState extends State<PageViewPage> {
    @override
    Widget build(BuildContext context) {
        List<Page> pages = [];
        for (int i = 0; i < Colors.primaries.length; i++) {
            pages.add(
                Page(
                    title: "$i",
                    color: Colors.primaries[i],
                ),
            );
        }

        return Scaffold(
            appBar: AppBar(
                title: Text("PageView"),
            ),
            body: PageView(
                allowImplicitScrolling: true,
                children: pages,
            ),
        );
    }
}
```

```dart
class Page extends StatelessWidget {
    final String title;
    final Color color;

    const Page({Key? key, required this.title, required this.color})
        : super(key: key);

    @override
    Widget build(BuildContext context) {
        return Container(
            color: color,
            alignment: Alignment.center,
            child: Text(
                "$title",
                textScaleFactor: 2,
            ),
        );
    }
}
```



### PageController

用于控制页面。

```
viewportFraction: 每一页占用空间。

initialPage: 默认第几页。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/611a77d89e5242e880f397cf400b9838.png)

```dart
PageView(
    controller: PageController(viewportFraction: 0.8),
)
```





## TabBarView

TabBarView是Material组件库提供的Tab布局组件，通过配合TabBar使用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f69698e86ef848bc9cd84a655e3873ba.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_7,color_FFFFFF,t_70,g_se,x_16)

```dart
class TabBarViewPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() {
        return _TabBarViewPageState();
    }
}

class _TabBarViewPageState extends State<TabBarViewPage>
    with SingleTickerProviderStateMixin {
    final List tabs = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
    late TabController _controller;

    @override
    void initState() {
        super.initState();
        _controller = TabController(length: tabs.length, vsync: this);
    }

    @override
    void dispose() {
        super.dispose();
        _controller.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text("TabBarView"),
                bottom: TabBar(
                    controller: _controller,
                    isScrollable: true,
                    tabs: tabs.map((e) {
                        return Tab(text: e);
                    }).toList(),
                ),
            ),
            body: TabBarView(
                controller: _controller,
                children: tabs.map((e) {
                    return Container(
                        alignment: Alignment.center,
                        child: Text(e, textScaleFactor: 3),
                    );
                }).toList(),
            ),
        );
    }
}
```



## DataTable

DataTable组件显示表格数据。

```
columns：设置列数据。

rows：设置行数据。

selected：选中指定行。

onSelectChanged：点击回调。

showEditIcon：是否显示编辑图标。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/0b54690988c2489b8f005d98a6e07556.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_8,color_FFFFFF,t_70,g_se,x_16)

```dart
DataTable(
    columns: [
        DataColumn(label: Text("姓名")),
        DataColumn(label: Text("年龄")),
        DataColumn(label: Text("地址")),
    ],
    rows: [
        DataRow(
            cells: [
                DataCell(Text("小黑")),
                DataCell(Text("38")),
                DataCell(Text("上海")),
            ],
        ),
        DataRow(
            cells: [
                DataCell(Text("小明")),
                DataCell(Text("18")),
                DataCell(Text("乌鲁木齐")),
            ],
        ),
        DataRow(
            cells: [
                DataCell(Text("小白")),
                DataCell(Text("28")),
                DataCell(Text("广州")),
            ],
        ),
    ],
)
```



### 排序 & 选中

![在这里插入图片描述](https://img-blog.csdnimg.cn/bab1413209534e2a90f2cf94e6eca50d.gif)

```dart
List<User> datas = [
    User("小明", 48, "北京"),
    User("小白", 28, "上海"),
    User("小黑", 38, "乌鲁木齐"),
    User("小花", 18, "哈尔滨"),
];
bool _sortAscending = false;

List<DataRow> dataRows = [];
for (int i = 0; i < datas.length; i++) {
    dataRows.add(
        DataRow(
            cells: [
                DataCell(Text(datas[i].name)),
                DataCell(Text(datas[i].age.toString())),
                DataCell(Text(datas[i].address)),
            ],
            selected: datas[i].selected,
            onSelectChanged: (selected) {
                setState(() {
                    datas[i].selected = selected!;
                });
            },
        ),
    );
}

DataTable(
    sortColumnIndex: 1,
    sortAscending: _sortAscending,
    columns: [
        DataColumn(label: Text("姓名")),
        DataColumn(
            label: Text("年龄"),
            onSort: (int columnIndex, bool ascending) {
                setState(() {
                    _sortAscending = ascending;
                    if (ascending) {
                        datas.sort((a, b) {
                            return a.age.compareTo(b.age);
                        });
                    } else {
                        datas.sort((a, b) {
                            return b.age.compareTo(a.age);
                        });
                    }
                });
            },
        ),
        DataColumn(label: Text("地址")),
    ],
    rows: dataRows,
)
```

