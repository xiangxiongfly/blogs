[TOC]

# Flutter InkWell & Ink组件

-   InkWell组件可以在用户点击是出现水波纹效果。
-   Ink组件可以将水波纹效果作用在装饰上。

![请添加图片描述](https://img-blog.csdnimg.cn/543ad88db45c4d0ba2ba2d24eb7d5eb2.gif)

```dart
InkWell(
    onTap: () {},
    splashColor: Colors.red,
    child: const Padding(
        padding: EdgeInsets.all(10),
        child: Text("InkWell水波纹效果"),
    ),
)
```

![请添加图片描述](https://img-blog.csdnimg.cn/e71c84b9c9b345c6b8ee684ed976d45e.gif)

```dart
InkWell(
    onTap: () {},
    highlightColor: Colors.blue,
    child: const Padding(
        padding: EdgeInsets.all(10),
        child: Text("InkWell高亮效果"),
    ),
)
```

![请添加图片描述](https://img-blog.csdnimg.cn/3067ee95d84540a2817f405ae9937f01.gif)

```dart
InkWell(
    onTap: () {},
    splashColor: Colors.red,
    highlightColor: Colors.blue,
    child: const Padding(
        padding: EdgeInsets.all(10),
        child: Text("InkWell混合效果"),
    ),
)
```

![请添加图片描述](https://img-blog.csdnimg.cn/3fc5056c193a444fa5b3778a39e4741a.gif)

```dart
Ink(
    decoration: const BoxDecoration(
        gradient: LinearGradient(
            colors: [Color(0xFFDE2F21), Color(0xFFEC592F)],
        ),
        borderRadius: BorderRadius.all(Radius.circular(20)),
    ),
    child: InkWell(
        onTap: () {},
        borderRadius: const BorderRadius.all(Radius.circular(20)),
        child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 20),
            child: const Text(
                "Ink&InkWell",
                style: TextStyle(color: Colors.white),
            ),
        ),
    ),
)
```

