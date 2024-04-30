[toc]

# Compose 动画

## 高级别动画

### AnimatedVisibiliy 可见性动画

显示时执行显示动画，隐藏时执行隐藏动画。

- EnterTransition() 进入动画：
  - fadeIn：淡入
  - slideIn：滑入
  - slideInHorizontally：水平滑入
  - slideInVertically：垂直滑入
  - expandIn：展开
  - expandHorizontally：水平展开
  - expandVertically：垂直展开
- ExitTransition() 退出动画：
  - fadeOut：淡出
  - slideOut：滑出
  - slideOutHorizontally：水平滑出
  - slideOutVertically：垂直滑出
  - shrinkOut：缩小
  - shrinkHorizontally：水平缩小
  - shrinkVertically：垂直缩小

```kotlin
val visible = remember {
    mutableStateOf(true)
}
Column(
    modifier = Modifier
    .size(360.dp)
    .padding(10.dp)
) {
    Button(onClick = { visible.value = !visible.value }) {
        Text("可见性动画")
    }
    AnimatedVisibility(visible = visible.value) {
        Text(text = "床前明月光，疑是地上霜，举头望明月，低头思故乡", modifier = Modifier.size(150.dp)
    }
}
```

```kotlin
val visible = remember {
    mutableStateOf(true)
}
Column(
    modifier = Modifier
    .size(360.dp)
    .padding(10.dp)
) {
    Button(onClick = { visible.value = !visible.value }) {
        Text("可见性动画")
    }
    AnimatedVisibility(visible = visible.value,
                       enter = slideIn { IntOffset(400, 400) } + expandIn(),
                       exit = slideOut { IntOffset(400, 400) } + shrinkOut()) {
        Text(
            text = "床前明月光，疑是地上霜，举头望明月，低头思故乡", modifier = Modifier.size(150.dp)
        )
    }
}
```

### animateContentSize 布局大小动画

```kotlin
val isExpand = remember {
    mutableStateOf(true)
}
Column(
    modifier = Modifier
        .size(360.dp)
        .padding(10.dp)
) {
    Text(
        text = "床前明月光，疑是地上霜，举头望明月，低头思故乡。床前明月光，疑是地上霜，举头望明月，低头思故乡。床前明月光，疑是地上霜，举头望明月，低头思故乡。",
        fontSize = 16.sp,
        textAlign = TextAlign.Justify,
        overflow = TextOverflow.Ellipsis,
        modifier = Modifier.animateContentSize(),
        maxLines = if (isExpand.value) Int.MAX_VALUE else 2
    )
    Text(if (isExpand.value) "收起" else "全文", color = Color.Blue, modifier = Modifier.clickable {
        isExpand.value = !isExpand.value
    })
}
```

### Crossfade 淡入淡出动画

```kotlin
val tabs = Tabs.values()
var position by remember { mutableStateOf(Tabs.ONE) }
Box(modifier = Modifier.padding(paddingValues)) {
    Crossfade(targetState = position) { screen ->
                                       when (screen) {
                                           Tabs.ONE -> OnePage()
                                           Tabs.TWO -> TwoPage()
                                           Tabs.THREE -> ThreePage()
                                           Tabs.FOUR -> FourPage()
                                       }
                                      }
}
```



## 低级别动画

### animateXXXAsState 属性动画

animateXXXAsState() 函数可以使用：Float、Color、Dp、Size、Bounds、Offset、Rect、Int、IntOffset、IntSize。

```kotlin
var isSmall by remember {
    mutableStateOf(true)
}
val size: Dp by animateDpAsState(if (isSmall) 40.dp else 100.dp) {
    Log.e("TAG", "尺寸变化：$it")
}
val color: Color by animateColorAsState(if (isSmall) Color.Red else Color.Blue) {
    Log.e("TAG", "颜色变化：$it")
}
Column(Modifier.padding(16.dp)) {
    Button(onClick = { isSmall = !isSmall }, modifier = Modifier.padding(vertical = 16.dp)) {
        Text("修改尺寸")
    }
    Box(
        Modifier
            .size(size)
            .background(color)
    )
}
```

### Animatable 帧动画

```kotlin
val ok = remember {
    mutableStateOf(false)
}
val color = remember {
    Animatable(Color.Red)
}
LaunchedEffect(ok.value) {
    color.animateTo(if (ok.value) Color.Yellow else Color.Green)
}
Column {
    Box(
        Modifier
            .size(360.dp)
            .background(color.value)
    )
    Button(onClick = { ok.value = !ok.value }) {
        Text("点击")
    }
}
```

### updateTransition  组合多个动画

在 Compose 中需要使用 updateTransition 组合多个动画。

```kotlin
var boxState: BoxState by remember { mutableStateOf(BoxState.Small) }
val transition = updateTransition(targetState = boxState, label = "transition")
val color by transition.animateColor(label = "color") {
    boxState.color
}
val size by transition.animateDp(label = "size") {
    boxState.size
}
val offset by transition.animateDp(label = "offset") {
    boxState.offset
}
val angle by transition.animateFloat(label = "angle") {
    boxState.angle
}

Column {
    Button(
        onClick = { boxState = !boxState }
    ) {
        Text("hello world")
    }
    Box(
        Modifier
        .padding(top = 20.dp)
        .rotate(angle)
        .size(size)
        .offset(x = offset)
        .background(color)
    )
}
```

### rememberInfiniteTransition 重复执行动画

```kotlin
val infiniteTransition = rememberInfiniteTransition()
val color by infiniteTransition.animateColor(
    initialValue = Color.Red,
    targetValue = Color.Green,
    animationSpec = infiniteRepeatable(
        animation = tween(1000, easing = LinearEasing),
        repeatMode = RepeatMode.Reverse
    )
)

Box(
    Modifier
    .size(360.dp)
    .background(color)
)
```



## 自定义动画

### AnimationSpec 动画规格

#### spring 阻尼动画

spring 可在起始值和结束值之间创建基于物理特性的动画。

```kotlin
fun <T> spring(
    dampingRatio: Float = Spring.DampingRatioNoBouncy, // 阻尼系数
    stiffness: Float = Spring.StiffnessMedium, // 刚度
    visibilityThreshold: T? = null
)
```

```kotlin
val flag = remember {
    mutableStateOf(true)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = spring(
        dampingRatio = Spring.DampingRatioHighBouncy,
        stiffness = Spring.StiffnessMedium
    )
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

#### tween 补间动画

tween用来创建使用给定的持续时间、延迟以及缓和曲线配置的tween规范。

```kotlin
fun <T> tween(
    durationMillis: Int = DefaultDurationMillis, // 持续时长
    delayMillis: Int = 0, // 延迟播放时间
    easing: Easing = FastOutSlowInEasing // 缓动曲线
)
```

```kotlin
val flag = remember {
    mutableStateOf(true)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = tween(
        durationMillis = 5000, easing = LinearEasing
    )
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

#### keyframes 帧动画

keyframes会根据在动画时长内不同时间戳中指定的快照值添加动画效果。

```kotlin
val flag = remember {
    mutableStateOf(true)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = keyframes {
        durationMillis = 5000
        100.dp at 1000 with LinearOutSlowInEasing // for 0-1000 ms
        150.dp at 2000 with FastOutLinearInEasing // for 1000-2000 ms
        200.dp at 3000 // 2000-3000 ms
    }
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

#### repeatable 有限动画

repeatable  可以反复执行指定时长的动画。

```kotlin
fun <T> repeatable(
    iterations: Int, // 重复次数
    animation: DurationBasedAnimationSpec<T>, // 执行动画
    repeatMode: RepeatMode = RepeatMode.Restart, // 重复模式
    initialStartOffset: StartOffset = StartOffset(0)
)
```

```kotlin
val flag = remember {
    mutableStateOf(false)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = repeatable(
        iterations = 2,
        animation = tween(
            durationMillis = 5000, easing = LinearEasing
        ),
        repeatMode = RepeatMode.Reverse
    )
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

#### infiniteRepeatable 无限动画

```kotlin
fun <T> infiniteRepeatable(
    animation: DurationBasedAnimationSpec<T>,
    repeatMode: RepeatMode = RepeatMode.Restart,
    initialStartOffset: StartOffset = StartOffset(0)
)
```

```kotlin
val flag = remember {
    mutableStateOf(false)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = infiniteRepeatable(
        animation = tween(
            durationMillis = 5000, easing = LinearEasing
        ),
        repeatMode = RepeatMode.Reverse
    )
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

#### snap 提前结束动画

```kotlin
val flag = remember {
    mutableStateOf(false)
}
val size by animateDpAsState(
    targetValue = if (flag.value) 300.dp else 100.dp,
    animationSpec = if (flag.value) tween(
                                        durationMillis = 5000,
                                        easing = LinearEasing
                                    ) else snap()
)
Box(
    Modifier
    .size(size)
    .background(Color.Blue)
    .clickable {
        flag.value = !flag.value
    }
)
```

