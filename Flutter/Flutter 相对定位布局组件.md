[TOC]

# Flutter 相对定位布局组件

## Align

### 简述

Align组件可以调整子组件在父组件中的位置。



### 基本属性

```
alignment：设置子组件在父组件中的位置。
		- center：等价于Alignment(0.0, 0.0)，居中效果
		- bottomRight：等价于Alignment(1.0, 1.0)，右下角
		
widthFactor & heightFactor：缩放因子，根据子组件自身的宽高确定Align组件的宽高。
公式：(Alignment.x*childWidth/2+childWidth/2, Alignment.y*childHeight/2+childHeight/2)
```



### alignment属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/a14d10ebb3ec4ca08608b71a802a366e.png)

```dart
Column(
    children: [
        const Text("居中"),
        Container(
            color: Colors.grey,
            width: 100,
            height: 100,
            child: const Align(
                child: Icon(Icons.home, size: 30),
            ),
        ),
        const SizedBox(height: 10),
        const Text("右下"),
        Container(
            color: Colors.grey,
            width: 100,
            height: 100,
            child: const Align(
                alignment: Alignment.bottomRight,
                child: Icon(Icons.home, size: 30),
            ),
        ),
        const SizedBox(height: 10),
        const Text("居中方式2"),
        Container(
            color: Colors.grey,
            width: 100,
            height: 100,
            child: const Align(
                alignment: Alignment(0, 0),
                child: Icon(Icons.home, size: 30),
            ),
        ),
        const SizedBox(height: 10),
        const Text("右下方式2"),
        Container(
            color: Colors.grey,
            width: 100,
            height: 100,
            child: const Align(
                alignment: Alignment(1, 1),
                child: Icon(Icons.home, size: 30),
            ),
        ),          
    ],
)
```



### widthFactor&heightFactor属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/f4c8b4c39c2044c89ec3dedc5fa49d3f.png)

```dart
Container(
    color: Colors.grey,
    child: const Align(
        alignment: Alignment.center,
        widthFactor: 2,
        heightFactor: 2,
        child: Icon(Icons.home, size: 30),
    ),
)
```



## Center

Center是Align的子类，可以让子元素居中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8101b6ac33944d38073383b7d37cdba.png)

```dart
Container(
    width: 100,
    height: 100,
    color: Colors.green,
    child: const Center(child: Text("hello world")),
),

Container(
    color: Colors.green,
    child: const Center(widthFactor: 2, heightFactor: 2, child: Text("hello world")),
)
```

