[toc]

# Compose 手势

## 概述

手势在智能手机中运用得非常广泛，如点按、拖动、滑动，等等。使用一些简单的手势就可以完成较为复杂的操作。Compose为我们提供了多种手势API，可以帮助我们检测交互生成的手势。



## 点击事件

**clickable点击事件：**

```kotlin
val count = remember {
    mutableStateOf(0)
}
Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
    Text("${count.value}", modifier = Modifier
         .width(100.dp)
         .background(Color.Gray)
         .clickable {
             count.value += 2
         }
        )
}
```

**pointerInput监听点击事件：**

```kotlin
Text("${count.value}", modifier = Modifier
     .width(100.dp)
     .background(Color.Gray)
     .pointerInput(Unit) {
         detectTapGestures(
             onPress = { Log.e("TAG", "onPress") },
             onLongPress = { Log.e("TAG", "onLongPress") },
             onTap = {
                 Log.e("TAG", "onTap")
                 count.value += 2
             },
             onDoubleTap = { Log.e("TAG", "onDoubleTap") }
         )
     }
    )
```



## 滚动事件

可以使用 verticalScroll 和 horizontalScroll 修饰符实现滚动效果。

```kotlin
Column(
    modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(Color.Red)
    )
    Spacer(modifier = Modifier.height(50.dp))
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(Color.Green)
    )
    Spacer(modifier = Modifier.height(50.dp))
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(Color.Blue)
    )
}
```



## 嵌套滚动

```kotlin
Column(
    modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .verticalScroll(rememberScrollState())
    ) {
        repeat(5) {
            Text(
                "hello world",
                color = Color.Black,
                modifier = Modifier
                    .background(Color.Yellow)
                    .fillMaxWidth()
                    .border(1.dp, Color.Red)
                    .padding(50.dp),
                textAlign = TextAlign.Center
            )
        }
    }
    Spacer(modifier = Modifier.height(50.dp))
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(Color.Green)
    )
    Spacer(modifier = Modifier.height(50.dp))
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(Color.Blue)
    )
}
```



## 拖动事件

**使用draggable实现横向或纵向拖动：**

```kotlin
val offsetY = remember {
    mutableStateOf(0F)
}
Box(modifier = Modifier.fillMaxSize()) {
    Text("拖动",
         fontSize = 30.sp,
         fontWeight = FontWeight.Bold,
         modifier = Modifier
         .offset { IntOffset(0, offsetY.value.toInt()) }
         .draggable(
             orientation = Orientation.Vertical,
             state = rememberDraggableState(onDelta = { delta ->
                                                       offsetY.value += delta
                                                      })
         )
        )
}
```

**使用detectDragGestures实现整体拖动：**

```kotlin
val offsetX = remember {
    mutableStateOf(0F)
}
val offsetY = remember {
    mutableStateOf(0F)
}
Box(modifier = Modifier.fillMaxSize()) {
    Text("拖动",
         fontSize = 30.sp,
         fontWeight = FontWeight.Bold,
         modifier = Modifier
         .offset { IntOffset(offsetX.value.toInt(), offsetY.value.toInt()) }
         .pointerInput(Unit) {
             detectDragGestures { change, dragAmount ->
                                 change.consume()
                                 offsetX.value += dragAmount.x
                                 offsetY.value += dragAmount.y
                                }
         }
        )
}
```



## 滑动事件

**使用swipeable实现滑动：**

```kotlin
fun <T> Modifier.swipeable(
    state: SwipeableState<T>, // 状态
    anchors: Map<Float, T>, // 用于为锚点添加动画效果
    orientation: Orientation, // 滑动方向
    enabled: Boolean = true, // 是否开启滑动
    reverseDirection: Boolean = false, // 是否反向滑动
    interactionSource: MutableInteractionSource? = null,
    thresholds: (from: T, to: T) -> ThresholdConfig = { _, _ -> FixedThreshold(56.dp) }, // 阈值
    resistance: ResistanceConfig? = resistanceConfig(anchors.keys),
    velocityThreshold: Dp = VelocityThreshold
)
```

```kotlin
val size = 48.dp
val swipeableState = rememberSwipeableState(0)
val sizePx = with(LocalDensity.current) {
    size.toPx()
}
val anchors = mapOf(0F to 0, sizePx to 1)

Box(
    modifier = Modifier
    .width(96.dp)
    .background(Color.Red)
    .swipeable(
        state = swipeableState,
        anchors = anchors,
        thresholds = { from, to -> FractionalThreshold(0.3F) },
        orientation = Orientation.Horizontal
    )
) {
    Box(
        modifier = Modifier
        .offset { IntOffset(swipeableState.offset.value.roundToInt(), 0) }
        .size(size)
        .background(Color.Green)
    )
}
```

