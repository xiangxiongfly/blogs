[TOC]

# Flutter 手势事件处理

## GestureDetector

GestureDetector是手势识别组件。包含：点击、双击、长按、拖动、缩放等。

### 点击事件

```dart
GestureDetector(
    onTapDown: (TapDownDetails details) {
        print("onTapDown");
    },
    onTapUp: (TapUpDetails details) {
        print("onTapUp");
    },
    onTapCancel: () {
        print("onTapCancel");
    },
    onTap: () {
        print("onTap");
    },
    onDoubleTap: () {
        print("onDoubleTap");
    },
    child: Center(
        child: Container(
            width: 200,
            height: 200,
            color: Colors.red,
        ),
    ),
)
```

说明：

-   点击时调用顺序：onTapDown -> onTapUp -> onTap
-   按下后移动时调用顺序：onTapDown -> onTapCancel
-   双击时调用顺序：onDoubleTap

### 长按事件

```dart
GestureDetector(
    onLongPressStart: (LongPressStartDetails details) {
        print("onLongPressStart");
    },
    onLongPress: () {
        print("onLongPress");
    },
    onLongPressMoveUpdate: (LongPressMoveUpdateDetails details) {
        print("onLongPressMoveUpdate");
    },
    onLongPressUp: () {
        print("onLongPressUp");
    },
    onLongPressEnd: (LongPressEndDetails details) {
        print("onLongPressEnd");
    },
    child: Center(
        child: Container(
            width: 200,
            height: 200,
            color: Colors.red,
        ),
    ),
)
```

说明：用户按下、移动、抬起的调用顺序为：onLongPressStart -> onLongPress -> ... -> onLongPressMoveUpdate -> onLongPressEnd -> onLongPressUp

### 拖动事件

```dart
GestureDetector(  
    onVerticalDragDown: (DragDownDetails details) {
        print("onVerticalDragDown");
    },
    onVerticalDragStart: (DragStartDetails details) {
        print("onVerticalDragStart");
    },
    onVerticalDragUpdate: (DragUpdateDetails details) {
        print("onVerticalDragUpdate");
    },
    onVerticalDragCancel: () {
        print("onVerticalDragCancel");
    },
    onVerticalDragEnd: (DragEndDetails details) {
        print("onVerticalDragEnd");
    },
    child: Center(
        child: Container(
            width: 200,
            height: 200,
            color: Colors.red,
        ),
    ),
)
```

说明：垂直方向拖动的调用顺序：onVerticalDragDown -> onVerticalDragStart -> ... -> onVerticalDragUpdate -> onVerticalDragEnd

### 缩放相关

```dart
GestureDetector(
    onScaleStart: (ScaleStartDetails details) {
        print("onScaleStart");
    },
    onScaleUpdate: (ScaleUpdateDetails details) {
        print("onScaleUpdate");
    },
    onScaleEnd: (ScaleEndDetails details) {
        print("onScaleEnd");
    },
    child: Center(
        child: Container(
            width: 200,
            height: 200,
            color: Colors.red,
        ),
    ),
)
```

说明：缩放操作的调用顺序：onVerticalDragDown -> onVerticalDragStart -> ... -> onVerticalDragUpdate -> onVerticalDragEnd



## GestureRecognizer

GestureRecognizer不是一个Widget，下面的案例是按下时是蓝色，抬起恢复为黑色。

```dart
class _GestureRecognizerPageState extends State<GestureRecognizerPage> {
    final _tapGestureRecognizer = TapGestureRecognizer();
    var _textColor = Colors.black;

    @override
    void initState() {
        super.initState();
        _tapGestureRecognizer.onTapDown = (TapDownDetails details) {
            setState(() {
                _textColor = Colors.blue;
            });
        };
        _tapGestureRecognizer.onTapUp = (TapUpDetails details) {
            setState(() {
                _textColor = Colors.black;
            });
        };
    }

    @override
    void dispose() {
        super.dispose();
        _tapGestureRecognizer.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("GestureRecognizer"),
            ),
            body: Center(
                child: Text.rich(
                    TextSpan(children: [
                        TextSpan(
                            text: "hello world",
                            recognizer: _tapGestureRecognizer,
                            style: TextStyle(color: _textColor),
                        ),
                    ]),
                ),
            ),
        );
    }
}
```



## Listener

-   Listener是一个监听指针事件的控件，比如按下、移动、释放、取消等指针事件。
-   上面的GestureDetector和GestureRecognizer都是直接或间接封装Pointers而实现的。

```dart
Listener(
    onPointerDown: (PointerDownEvent event) {
        print("按下");
    },
    onPointerMove: (PointerMoveEvent event) {
        print("移动");
    },
    onPointerUp: (PointerUpEvent event) {
        print("抬起");
    },
    onPointerCancel: (PointerCancelEvent event) {
        print("取消");
    },
    child: Container(
        width: 200,
        height: 200,
        color: Colors.blue,
        alignment: Alignment.center,
    ),
)
```

