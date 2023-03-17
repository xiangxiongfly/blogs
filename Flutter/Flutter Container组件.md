[TOC]

# Flutter Container组件

## 基本属性

```
width & height：设置组件的宽高。

color：设置背景颜色。

padding & margin：设置内外边距。

decoration：背景装饰，与color属性互斥。

constraints：约束条件，也可以指定组件宽高。

alignment：子元素对齐方式。

transform：变形。
```



## 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/196a53701ff4456b8eab9273f07d5da4.png)

```dart
Container(
    width: 100,
    height: 50,
    color: Colors.blue,
    margin: const EdgeInsets.all(10),
    padding: const EdgeInsets.all(10),
    alignment: Alignment.center,
    child: const Text("hello world"),
)
```



## decoration 属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/7ca0d3975133474ba9322a04a58665b3.png)

```dart
Container(
    child: const Text("hello Container"),
    margin: const EdgeInsets.all(10),
    padding: const EdgeInsets.all(10),
    clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(
        shape: BoxShape.rectangle,
        borderRadius: const BorderRadius.all(Radius.circular(20)),
        color: Colors.red.shade50,
        border: Border.all(
            color: Colors.red.shade900,
            width: 2,
        ),
    ),
)
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/47b5196e690e4fe88dfe96899e372457.png)

```dart
Container(
    width: 150,
    height: 150,
    decoration: BoxDecoration(
        image: const DecorationImage(
            image: AssetImage("images/avatar.jpg"),
            fit: BoxFit.cover,
        ),
        shape: BoxShape.circle,
        border: Border.all(
            color: Colors.red.shade900,
            width: 2,
        ),
    ),
)
```



## constraints & transform & alignment 属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/93cf2d19ee1e4f79a900b90be13dc3fe.png)

```dart
Container(
    margin: const EdgeInsets.all(50),
    constraints: const BoxConstraints.tightFor(width: 200, height: 150),
    decoration: BoxDecoration(
        gradient: RadialGradient(
            colors: [Colors.blue.shade800, Colors.blue.shade200],
            center: Alignment.center,
            radius: 0.5,
        ),
        boxShadow: const [
            BoxShadow(
                color: Colors.grey,
                offset: Offset(2, 2),
                blurRadius: 2,
            ),
        ],
    ),
    transform: Matrix4.rotationZ(0.2),
    transformAlignment: Alignment.center,
    alignment: Alignment.center,
    child: const Text("hello world"),
)
```

