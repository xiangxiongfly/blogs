[TOC]

# Flutter FittedBox组件

## 简述

当子组件的宽高比和父组件的宽高比不一样时，可以FittedBox组件操作子组件拉伸或填充父组件的空间。



## 基本属性

```
fit：子元素的填充方式。
	- fill：填充父组件。
	- contain：等比拉伸。
	- cover：等比拉伸充满父组件，尽可能小。
	- fitWidth：等比拉伸，宽度充满父组件。
	- fitHeight：等比拉伸，高度充满父组件。
	- none：默认子组件居中，不做处理。
	- scaleDown：缩放至contain，否则和none一样。
```



## 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/846f3820cbaf482aa49ff2faaa1e7945.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/9802303833bc4ed8977747779d9161eb.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/f970efd2a596483faa1e1c17c1f384c0.png)

```dart
const Text("原图"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const Image(image: AssetImage("images/bird.jpg")),
),
const Text("BoxFit.fill"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.fill,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
),
const SizedBox(height: 20),
const Text("BoxFit.contain"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.contain,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
),
const SizedBox(height: 20),
const Text("BoxFit.cover"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.cover,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
),
const SizedBox(height: 20),
const Text("BoxFit.fitWidth"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.fitWidth,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
),
const SizedBox(height: 20),
const Text("BoxFit.fitHeight"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.fitHeight,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
),
const SizedBox(height: 20),
// const Text("BoxFit.none"),
// Container(
//   width: 100,
//   height: 100,
//   color: Colors.red,
//   child: const FittedBox(
//     fit: BoxFit.none,
//     child: Image(image: AssetImage("images/bird.jpg")),
//   ),
// ),
const SizedBox(height: 20),
const Text("BoxFit.scaleDown"),
Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: const FittedBox(
        fit: BoxFit.scaleDown,
        child: Image(image: AssetImage("images/bird.jpg")),
    ),
)
```

















