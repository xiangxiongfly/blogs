[TOC]

# Flutter PageView组件

## 简述

Flutter中的PageView组件类似于Android中的ViewPage控件，可以实现页面滑动切换，可以和BottomNavigationBar等配合使用。



## 基本属性

```
scrollDirection：滑动方向。
	- Axis.horizontal：水平方向。
	- Axis.vertical：垂直方向。
	
pageSnapping：滑动时是否强制切换页面，如果为false，不会切换页面，如果为true，会强制切换页面。

controller：PageController类型，控制PageView。	
	- initialPage：默认第几页。
	- viewportFraction：每页占用空间。

onPageChanged：PageView滑动监听。

allowImplicitScrolling：是否预加载下一页，一般情况下缓存前后两页。
```



## 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/361bcaa625d644e2a4ba07e2127b01b6.gif)

```dart
class SimplePageViewPage extends StatefulWidget {
    const SimplePageViewPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _SimplePageViewPageState();
    }
}

class _SimplePageViewPageState extends State<SimplePageViewPage> {
    @override
    Widget build(BuildContext context) {
        List<Page> pageList = [];
        for (int i = 0; i < Colors.primaries.length; i++) {
            pageList.add(Page(title: "$i", color: Colors.primaries[i]));
        }
        return Scaffold(
            appBar: AppBar(
                title: const Text("PageView简单使用"),
            ),
            body: PageView(
                scrollDirection: Axis.horizontal,
                allowImplicitScrolling: true,
                pageSnapping: true,
                children: pageList,
                controller: PageController(viewportFraction: 0.8, initialPage: 1),
                onPageChanged: (index) {
                    print("onPageChanged $index");
                },
            ),
        );
    }
}

class Page extends StatelessWidget {
    final String title;
    final Color color;

    const Page({Key? key, required this.title, required this.color}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        print("build $title");
        return Container(
            color: color,
            alignment: Alignment.center,
            child: Text(title, textScaleFactor: 2),
        );
    }
}
```



## 无限滚动效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/611153955a0e442e89f6c4a0a7f80b61.gif)

```dart
class XPageViewPage extends StatelessWidget {
    const XPageViewPage({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        List<Widget> pageList = const [
            Page(title: "1", color: Colors.red),
            Page(title: "2", color: Colors.green),
            Page(title: "3", color: Colors.blue),
        ];
        return Scaffold(
            appBar: AppBar(
                title: const Text("PageView无限滚动"),
            ),
            body: PageView.builder(
                itemCount: 10000,
                itemBuilder: (BuildContext context, int index) {
                    return pageList[index % pageList.length];
                },
            ),
        );
    }
}
```



## 轮播图

![在这里插入图片描述](https://img-blog.csdnimg.cn/1846bc14a30d45e0bbc90c8b1ba1f8f3.gif)

```dart
class BannerPage extends StatefulWidget {
    const BannerPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _BannerPageState();
    }
}

class _BannerPageState extends State<BannerPage> {
    List<String> titles = ["One", "Two", "Three"];
    List<Color> colors = [Colors.red, Colors.green, Colors.blue];
    int currentIndex = 0;

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(title: const Text("轮播图")),
            body: Center(
                child: SizedBox(
                    height: 250,
                    child: Stack(
                        children: [
                            _buildItem(),
                            _buildPoint(),
                        ],
                    ),
                ),
            ),
        );
    }

    _buildItem() {
        return PageView.builder(
            itemCount: 1000,
            itemBuilder: (BuildContext context, int index) {
                int realIndex = index % titles.length;
                Color color = colors[realIndex];
                String title = titles[realIndex];
                return Container(
                    color: color,
                    alignment: Alignment.center,
                    child: Text(
                        title,
                        style: const TextStyle(color: Colors.white),
                    ),
                );
            },
            onPageChanged: (int index) {
                setState(() {
                    currentIndex = index % titles.length;
                });
            },
        );
    }

    _buildPoint() {
        return Positioned(
            bottom: 10,
            left: 0,
            right: 0,
            child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                    titles.length,
                    (index) {
                        return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: currentIndex == index
                                ? Colors.red.shade900
                                : Colors.grey.shade50,
                            ),
                        );
                    },
                ),
            ),
        );
    }
}
```