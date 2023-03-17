[TOC]

# Flutter GridView组件

## 基本属性

```
scrollDirection：GridView滚动方向。

gridDelegate：
		- SliverGridDelegateWithFixedCrossAxisCount：交叉轴上的子元素固定数量。
		- SliverGridDelegateWithMaxCrossAxisExtent：交叉轴方向尽可能大。

SliverGridDelegateWithFixedCrossAxisCount属性：

	- crossAxisCount：横轴的子元素的数量。

	- mainAxisSpacing：主轴方向的间距。

	- crossAxisSpacing：横轴方向的间距。

	- childAspectRatio：子元素的宽高比。
```



## 简单使用

这种方式适合少量数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8566af674f2440fcb24d2b5d08881860.png)

```dart
GridView(
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 2,
        crossAxisSpacing: 2,
        childAspectRatio: 2,
    ),
    children: [
        createItem(Colors.red.shade300),
        createItem(Colors.red.shade200),
        createItem(Colors.red.shade100),
        createItem(Colors.green.shade300),
        createItem(Colors.green.shade200),
        createItem(Colors.green.shade100),
        createItem(Colors.blue.shade300),
        createItem(Colors.blue.shade200),
        createItem(Colors.blue.shade100),
    ],
)
```

```dart
createItem(Color color) {
    return Container(
        color: color,
    );
}
```



## GridView.builder

适合加载大量数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d728e1caed42405fa26777d843a083a9.png)

```dart
GridView.builder(
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
    ),
    itemBuilder: (BuildContext context, int index) {
        return createItem(Colors.primaries[index % Colors.primaries.length]);
    },
    itemCount: 50,
)
```



## GridView.count

用于快速创建GridView，等价于上面的代码。

```dart
GridView.count(
    crossAxisCount: 3,
    children: List.generate(
        50,
        (index) => createItem(Colors.primaries[index % Colors.primaries.length]),
    ),
)
```



## GridView.extent

![在这里插入图片描述](https://img-blog.csdnimg.cn/c0852c21dbd7467fb381f6b41ff82358.png)

```dart
GridView.extent(
    maxCrossAxisExtent: 300,
    children: List.generate(
        50,
        (index) => createItem(Colors.primaries[index % Colors.primaries.length]),
    ),
)
```



## GridView.custom

![在这里插入图片描述](https://img-blog.csdnimg.cn/f7bc74498404411d93316e3b3bbc3708.png)

```dart
GridView.custom(
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
    ),
    childrenDelegate: SliverChildBuilderDelegate(
        (BuildContext context, int index) {
            return createItem(Colors.primaries[index % Colors.primaries.length]);
        },
        childCount: 50,
    ),
)
```

