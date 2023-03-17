[TOC]

# Flutter Sliver滚动组件

## SliverList & SliverGrid

需要同时滚动ListView和GridView时可以使用SliverList和SliverGrid。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3eb7e948bfc840e6a1d2e7c420532309.png)

```dart
CustomScrollView(
    slivers: [
        SliverList(
            delegate: SliverChildBuilderDelegate(
                (context, index) {
                    return Container(
                        height: 50,
                        color: Colors.primaries[index % Colors.primaries.length],
                    );
                },
                childCount: 5,
            ),
        ),
        SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 5,
                mainAxisSpacing: 5,
            ),
            delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                    return Container(
                        color: Colors.primaries[index % Colors.primaries.length],
                    );
                },
                childCount: 20,
            ),
        ),
    ],
)
```



## SliverAppBar

```
pinned：是否固定在屏幕顶部。

expandedHeight：展开区域的高度。

flexibleSpace：展开取消显示内容。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5a79dd285414b29964a9832455328d0.gif)

```dart
CustomScrollView(
    slivers: [
        SliverAppBar(
            pinned: true,
            expandedHeight: 200,
            flexibleSpace: FlexibleSpaceBar(
                title: const Text("SliverAppBar"),
                background: Image.asset("images/avatar.jpg", fit: BoxFit.cover),
            ),
        ),
        SliverFixedExtentList(
            delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                    return Container(
                        alignment: Alignment.center,
                        color: Colors.primaries[index % Colors.primaries.length],
                        child: Text("$index"),
                    );
                },
            ),
            itemExtent: 50.0,
        ),
    ],
)
```



## SliverPersistentHeader

SliverPersistentHeader组件可以控制滚动的最大高度和最小高度，类似SliverAppBar效果。

```
build：显示内容的Widget。

maxExtent & minExtent：滚动的高度范围。

shouldRebuild：是否需要更新。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/0507dca2140c47a981d6c8b8be17e56a.gif)

```dart
CustomScrollView(
    slivers: [
        SliverPersistentHeader(
            pinned: true,
            delegate: MySliverPersistentHeaderDelegate(),
        ),
        SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 5,
                mainAxisSpacing: 5,
            ),
            delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                    return Container(
                        color: Colors.primaries[index % Colors.primaries.length],
                    );
                },
            ),
        ),
    ],
)
```

```dart
class MySliverPersistentHeaderDelegate extends SliverPersistentHeaderDelegate {
    @override
    Widget build(
        BuildContext context, double shrinkOffset, bool overlapsContent) {
        return Container(
            color: Colors.blue,
            alignment: Alignment.center,
            child: Text(
                "hello world",
                style: TextStyle(color: Colors.white),
            ),
        );
    }

    @override
    double get maxExtent => 200;

    @override
    double get minExtent => 50;

    @override
    bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
        return false;
    }
}
```



## SliverToBoxAdapter

CustomScrollView只能包含Sliver组件，如果需要使用普通组件可以使用SliverToBoxAdapter。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc83bbe156b24c6094c596f208164555.png)

```dart
CustomScrollView(
    slivers: [
        SliverToBoxAdapter(
            child: Container(
                height: 200,
                color: Colors.black26,
                alignment: Alignment.center,
                child: Text("hello world"),
            ),
        ),
        SliverList(
            delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                    return Container(
                        height: 60,
                        color: Colors.primaries[index % Colors.primaries.length],
                    );
                },
                childCount: 50,
            ),
        ),
    ],
)
```



## CustomScrollView & NestedScrollView

CustomScrollView组件可以将多个组件组合在一起，具有统一的滚动效果，但是CustomScrollView只能嵌套Sliver系列的组件，如SliverList、SliverGrid、SliverPadding、SliverAppBar等。

NestedScrollView可以协调两个滚动组件滑动。NestedScrollView在逻辑上将可滚动组件分为header和body两部分，heade部分只能接收Sliver类型的组件，而body部分可以接收任意类型的组件。



## NestedScrollView+SliverAppBar+ListView

![在这里插入图片描述](https://img-blog.csdnimg.cn/336fdf499d4144a8bc09c7d20a23b094.gif)

```dart
NestedScrollView(
    headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
        return [
            SliverAppBar(
                toolbarHeight: 0,
                backgroundColor: Colors.transparent,
                automaticallyImplyLeading: false,
                collapsedHeight: 0,
                expandedHeight: 200,
                flexibleSpace: FlexibleSpaceBar(
                    background: Image.asset("images/bird.jpg", fit: BoxFit.cover),
                ),
            ),
        ];
    },
    body: ListView.builder(
        padding: EdgeInsets.zero,
        itemBuilder: (BuildContext context, int index) {
            return Container(
                height: 80,
                color: Colors.primaries[index % Colors.primaries.length],
                alignment: Alignment.center,
                child: Text(
                    "$index",
                    style: TextStyle(color: Colors.white),
                ),
            );
        },
        itemCount: 30,
    ),
)
```



### 优化联动效果

SliverAppBar+CustomScrollView组合，当反向滑动时，SliverAppBar就会整体回到屏幕顶部，出现遮挡问题，为了解决该问题，可以用在header里用SliverOverlapAbsorber组件包裹SliverAppBar，body里Sliver列表最前面添加一个SliverOverlapInjector。

```dart
NestedScrollView(
    headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
        return [
            SliverOverlapAbsorber(
                handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                sliver: SliverAppBar(
                    floating: true,
                    snap: true,
                    expandedHeight: 200,
                    forceElevated: innerBoxIsScrolled,
                    flexibleSpace: FlexibleSpaceBar(
                        background: Image.asset(
                            "images/logo.png",
                            fit: BoxFit.cover,
                        ),
                    ),
                ),
            ),
        ];
    },
    body: Builder(
        builder: (BuildContext context) {
            return CustomScrollView(
                slivers: [
                    SliverOverlapInjector(
                        handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                    ),
                    buildSliverList(50),
                ],
            );
        },
    ),
)
```

