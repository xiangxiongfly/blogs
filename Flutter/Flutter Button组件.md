[TOC]

# Flutter Button组件

## ElevatedButton

**基本属性**

```
const ButtonStyle({
  this.textStyle, //字体
  this.backgroundColor, //背景色
  this.foregroundColor, //前景色
  this.overlayColor, // 高亮色，按钮处于focused, hovered, or pressed时的颜色
  this.shadowColor, // 阴影颜色
  this.elevation, // 阴影值
  this.padding, // padding
  this.minimumSize, //最小尺寸
  this.side, //边框
  this.shape, //形状
  this.mouseCursor, //鼠标指针的光标进入或悬停在此按钮的[InkWell]上时。
  this.visualDensity, // 按钮布局的紧凑程度
  this.tapTargetSize, // 响应触摸的区域
  this.animationDuration, //[shape]和[elevation]的动画更改的持续时间。
  this.enableFeedback, // 检测到的手势是否应提供声音和/或触觉反馈。例如，在Android上，点击会产生咔哒声，启用反馈后，长按会产生短暂的振动。通常，组件默认值为true。
});
```



漂浮按钮，默认带有阴影和灰色背景。按下后，阴影变大。

![在这里插入图片描述](https://img-blog.csdnimg.cn/87a5bab5f82b450b9dc586d851caa3e2.png)

```dart
ElevatedButton(
  child: Text("漂浮按钮"),
  onPressed: () {},
)
```



## TextButton

文本按钮，默认透明并不带阴影。按下后，会有背景色。

![在这里插入图片描述](https://img-blog.csdnimg.cn/58abce7580aa4d0f90b280be1682768a.png)

```dart
TextButton(
  child: Text("文本按钮"),
  onPressed: () {},
)
```



## OutlineButton

边框按钮，默认带有边框、背景透明、不带阴影。按钮后，边框、背景、阴影会有变化。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e3beeca3af634076885291cdbfa18794.png)

```dart
OutlineButton(
  child: Text("边框按钮"),
  onPressed: () {},
)
```



## IconButton

图标按钮，不包含文字。

![在这里插入图片描述](https://img-blog.csdnimg.cn/79f68b120ef044a9b6d6c88c930b3e9a.png)

```dart
IconButton(
  icon: Icon(Icons.home),
  onPressed: () {},
)
```



## 带图标的按钮

ElevatedButton、TextButton、OutlineButton都有一个`icon`构造函数，可以设置图标。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5157eb4c82a94e03a34c411b7c443931.png)

```dart
ElevatedButton.icon(
  onPressed: () {},
  icon: Icon(Icons.add),
  label: Text("添加"),
),
OutlinedButton.icon(
  onPressed: () {},
  icon: Icon(Icons.delete),
  label: Text("删除"),
),
TextButton.icon(
  onPressed: () {},
  icon: Icon(Icons.info),
  label: Text("详情"),
)
```