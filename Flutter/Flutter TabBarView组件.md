[TOC]

# Flutter TabBarView组件

## 简述

TabBarView 是 Material 组件库中提供了 Tab 布局组件，通常和 TabBar 配合使用。

TabBarView封装了PageView，使用起来非常简单。

##  

## 基本属性

**TabBarView**

```
controller：TabBarView控制器。

children：子元素。
```

**TabBar**

```
tabs	一系列标签控件

controller	标签选择变化控制器

isScrollable	是否可滚动，默认false

indicatorColor	指示器颜色

indicatorWeight	指示器粗细

indicator	指示器，可自定义形状等样式

indicatorSize	指示器长短，tab：和tab一样长，label：和标签label 一样长

labelColor	标签颜色

labelStyle	标签样式

labelPadding	标签padding

unselectedLabelColor	未选中标签颜色

unselectedLabelStyle	未选中标签样式
```



## 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/7d07d11bd45241c5adfeb97843eec77a.gif)

```dart
class TabBarViewPage extends StatefulWidget {
    const TabBarViewPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _TabBarViewPageState();
    }
}

class _TabBarViewPageState extends State<TabBarViewPage> with SingleTickerProviderStateMixin {
    final List tabs = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
    late TabController _controller;

    @override
    void initState() {
        _controller = TabController(length: tabs.length, vsync: this);
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
                title: const Text("TabBarView & PageView"),
                bottom: TabBar(
                    indicatorColor: Colors.red,
                    controller: _controller,
                    isScrollable: true,
                    tabs: tabs.map((e) {
                        return Tab(text: e);
                    }).toList(),
                ),
            ),
            body: TabBarView(
                dragStartBehavior: DragStartBehavior.down,
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



