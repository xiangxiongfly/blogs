[toc]

# Compose 手势

## 概述

手势在智能手机中运用得非常广泛，如点按、拖动、滑动，等等。使用一些简单的手势就可以完成较为复杂的操作。Compose为我们提供了多种手势API，可以帮助我们检测交互生成的手势。



## 点击事件

### clickable

**属性：**

```kotlin
fun Modifier.clickable(
    enabled: Boolean = true,
    onClickLabel: String? = null,
    role: Role? = null,
    onClick: () -> Unit
)
```

**使用：**

```kotlin
val count = remember { mutableStateOf(0) }
Text(
    "${count.value}",
    textAlign = TextAlign.Center,
    modifier = Modifier
        .width(100.dp)
        .background(Color.Gray)
        .clickable {
            count.value += 2
        }
)
```

### pointerInput

```kotlin
val count = remember { mutableStateOf(0) }
Text(
    "${count.value}",
    textAlign = TextAlign.Center,
    modifier = Modifier
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

### combinedClickable

```kotlin
val count = remember { mutableStateOf(0) }
Text(
    "${count.value}",
    textAlign = TextAlign.Center,
    modifier = Modifier
        .width(100.dp)
        .background(Color.Gray)
        .combinedClickable(
            onLongClick = { Log.e("TAG", "onLongClick") },
            onDoubleClick = { Log.e("TAG", "onDoubleClick") },
            onClick = {
                Log.e("TAG", "onTap")
                count.value += 2
            },
        )
)
```



## 滚动事件

### horizontalScroll & verticalScroll

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

### scrollable

horizontalScroll 与 verticalScroll 都是基于 scrollable 修饰符实现的，scrollable 修饰符只提供了最基本的滚动手势监听，而上层 horizontalScroll 与 verticalScroll 分别额外提供了滚动在布局内容方面的偏移。

```kotlin

```



## 嵌套滚动

### nestedScroll 

**属性：**

```kotlin
fun Modifier.nestedScroll(
    connection: NestedScrollConnection, // 处理手势逻辑
    dispatcher: NestedScrollDispatcher? = null // 调度器
)
```

NestedScrollConnection 提供四个回调方法：

```kotlin
interface NestedScrollConnection {
    // 预先劫持滑动事件。
    fun onPreScroll(available: Offset, source: NestedScrollSource): Offset = Offset.Zero

    fun onPostScroll(
        consumed: Offset,
        available: Offset,
        source: NestedScrollSource
    ): Offset = Offset.Zero

    suspend fun onPreFling(available: Velocity): Velocity = Velocity.Zero

    suspend fun onPostFling(consumed: Velocity, available: Velocity): Velocity {
        return Velocity.Zero
    }
}
```





**使用：**

```kotlin
val toolbarHeight = 48.dp
val toolbarHeightPx = with(LocalDensity.current) {
    toolbarHeight.roundToPx().toFloat()
}
val toolbarOffsetHeightPx = remember { mutableStateOf(0f) }
val nestedScrollConnection = remember {
    object : NestedScrollConnection {
        override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
            val delta = available.y
            val newOffset = toolbarOffsetHeightPx.value + delta
            toolbarOffsetHeightPx.value = newOffset.coerceIn(-toolbarHeightPx, 0f)
            return Offset.Zero
        }
    }
}

Box(
    Modifier
    .fillMaxSize()
    .nestedScroll(nestedScrollConnection)
) {
    LazyColumn(contentPadding = PaddingValues(top = toolbarHeight)) {
        items(100) { index ->
                    Text(
                        "I'm item $index", modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                    )
                   }
    }
    TopAppBar(
        modifier = Modifier
        .height(toolbarHeight)
        .offset { IntOffset(x = 0, y = toolbarOffsetHeightPx.value.roundToInt()) },
        title = { Text("toolbar offset is ${toolbarOffsetHeightPx.value}") }
    )
}
```



## 拖动事件

### draggable

draggable 只能监听垂直方向或水平方向的偏移。

```kotlin
var offsetY by remember { mutableStateOf(0F) }
Box(modifier = Modifier.fillMaxSize()) {
    Text("拖动",
         fontSize = 30.sp,
         fontWeight = FontWeight.Bold,
         modifier = Modifier
         .offset { IntOffset(0, offsetY.toInt()) }
         .draggable(
             orientation = Orientation.Vertical,
             state = rememberDraggableState(onDelta = { delta ->
                                                       offsetY += delta
                                                      })
         )
        )
}
```

### detectDragGestures

detectDragGestures 可以监听任意方向。

```kotlin
val offsetX = remember { mutableStateOf(0F) }
val offsetY = remember { mutableStateOf(0F) }
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

### swipeable

与Draggable修饰符一样，Swipeable修饰符只能监听水平或垂直方向的手势事件。

Swipeable修饰符允许开发者通过锚点设置，为组件增加位置吸附交互效果，常用于开关、下拉刷新等。

**属性：**

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

**使用：**

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



## 多点触控

### transformable

**属性：**

```kotlin
fun Modifier.transformable(
    state: TransformableState,
    lockRotationOnZoomPan: Boolean = false, // 为true时，在发生双指拖动或缩放时，不会同时监听用户的旋转
    enabled: Boolean = true
) 
```

**使用：**

rotate修饰符需要先于offset调用，若先用offset再调用rotate，则组件会先偏移再旋转，这会导致组件最终位置不可预期。

```kotlin
val boxSize = 100.dp
var offset by remember { mutableStateOf(Offset.Zero) }
var rotationAngle by remember { mutableStateOf(1F) }
var scale by remember { mutableStateOf(1F) }
val transformableState =
rememberTransformableState { zoomChange: Float, panChange: Offset, rotationChange: Float ->
                            scale *= zoomChange
                            offset += panChange
                            rotationAngle += rotationChange
                           }

Box(
    modifier = Modifier.fillMaxSize(),
    contentAlignment = Alignment.Center
) {
    Box(
        Modifier
        .size(boxSize)
        .rotate(rotationAngle)
        .offset {
            IntOffset(offset.x.roundToInt(), offset.y.roundToInt())
        }
        .scale(scale)
        .background(Color.Green)
        .transformable(
            state = transformableState,
            lockRotationOnZoomPan = true
        )
    )
}
```

