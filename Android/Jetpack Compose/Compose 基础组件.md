[toc]

# Compose 基础组件

## Modifier 修饰符

在传统视图体系中，使用XML文件描述组件的样式，而在Compose中使用Modifier，每个基础的Composable组件都有一个modifier参数，通过Modifier可以修改样式如边距、字体、位移等。

### padding

```kotlin
@Stable
fun Modifier.padding(
    start: Dp = 0.dp,
    top: Dp = 0.dp,
    end: Dp = 0.dp,
    bottom: Dp = 0.dp
)

@Stable
fun Modifier.padding(
    horizontal: Dp = 0.dp,
    vertical: Dp = 0.dp
)

@Stable
fun Modifier.padding(all: Dp)
```

### size

```kotlin
Text("hello world", modifier = Modifier.fillMaxSize()) // 填充父容器

Text("hello world", modifier = Modifier.fillMaxWidth()) // 只充满宽
Text("hello world", modifier = Modifier.fillMaxHeight()) // 只充满高

Text("hello world", modifier = Modifier.size(100.dp)) // 宽高都为100dp
Text("hello world", modifier = Modifier.size(width = 100.dp, height = 110.dp)) // 宽为100dp，高为110dp

// matchParentSize仅在Box组件中使用
Box {
    Spacer(Modifier.matchParentSize().background(Color.Red))
    Text("hello world", fontSize = 30.sp)
}
```

### weight

Row和Column的weight修饰符。

```kotlin
Row(Modifier.fillMaxSize().padding(top = 10.dp)) {
    Box(Modifier.weight(2f).height(50.dp).background(Color.Blue))
    Box(Modifier.weight(1f).height(50.dp).background(Color.Red))
}
```

### clip

```kotlin
Image(
    painterResource(id = R.drawable.img),
    null,
    modifier = Modifier
        .size(100.dp)
        .clip(CircleShape) // 剪裁
)
```

### background

```kotlin
Image(
    painterResource(id = R.drawable.img),
    null,
    modifier = Modifier
        .size(100.dp)
        .background(Color.Red) // 背景色
        .clip(CircleShape)
)
```

### border

```kotlin
Image(
    painterResource(id = R.drawable.img),
    null,
    modifier = Modifier
        .size(100.dp)
        .border(width = 5.dp, color = Color.Blue, shape = CircleShape) // 边框
        .clip(CircleShape)
)
```

### clickable

```kotlin
Modifier.size(50.dp)
    .background(Color.Green)
    .clickable { // 点击事件
       
    }
```

### shadow

```kotlin
@Stable
fun Modifier.shadow(
    elevation: Dp, // 阴影的高度
    shape: Shape = RectangleShape, // Shape
    clip: Boolean = elevation > 0.dp // 是否将内容图形裁剪到该形状
)
```



## Scaffold 脚手架

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e9bfc3dd52fa4ca0bd4594494e5e2453.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/c9c0375cb7124a68bcb96c5f5917e6de.png)

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val tabs = Tabs.values()
            var position by remember { mutableStateOf(Tabs.ONE) }

            Scaffold(
                // 标题栏
                topBar = {
                    TopAppBar(title = { Text("标题") }, navigationIcon = {
                        IconButton(onClick = { /*TODO*/ }) {
                            Icon(Icons.Filled.ArrowBack, null)
                        }
                    })
                },
                // 悬浮按钮
                floatingActionButton = {
                    FloatingActionButton(onClick = { /*TODO*/ }) {
                        Text("确定")
                    }
                },
                // 侧边栏
                drawerContent = {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("侧边栏")
                    }
                },
                // 底部导航栏
                bottomBar = {
                    BottomNavigation(backgroundColor = Color.Gray) {
                        tabs.forEach { tab ->
                            BottomNavigationItem(
                                label = { Text(tab.title) },
                                icon = { Icon(painterResource(tab.icon), null) },
                                selected = tab == position,
                                onClick = { position = tab },
                                alwaysShowLabel = false,
                                selectedContentColor = Color.Red,
                                unselectedContentColor = Color.White
                            )
                        }
                    }
                }) { paddingValues ->
                // 内容
                Box(modifier = Modifier.padding(paddingValues)) {
                    when (position) {
                        Tabs.ONE -> OnePage()
                        Tabs.TWO -> TwoPage()
                        Tabs.THREE -> ThreePage()
                        Tabs.FOUR -> FourPage()
                    }
                }
            }
        }
    }
}
```

```kotlin
enum class Tabs(val title: String, @DrawableRes val icon: Int) {
    ONE("one", R.drawable.ic_one),
    TWO("two", R.drawable.ic_two),
    THREE("three", R.drawable.ic_three),
    FOUR("four", R.drawable.ic_four)
}

@Composable
fun BaseDefault(content: String) {
    Row(
        modifier = Modifier.fillMaxSize(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(content, fontSize = 50.sp)
    }
}

@Composable
fun OnePage() {
    BaseDefault("OnePage")
}

@Composable
fun TwoPage() {
    BaseDefault("TwoPage")
}

@Composable
fun ThreePage() {
    BaseDefault("ThreePage")
}

@Composable
fun FourPage() {
    BaseDefault("FourPage")
}
```



## Theme 主题

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/6dec6333fc8742c78b3e27615657c7a9.jpeg)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/625fa68efaad4e83a10172eff8d014a8.jpeg)



## CompositionLocal 组件树共享数据

在 Android Compose 中，`staticCompositionLocalOf` 和 `compositionLocalOf` 是用于在 Compose 上下文中定义和访问局部变量的方法。

`staticCompositionLocalOf` 和 `compositionLocalOf` 都是用于在 Compose 上下文中定义和访问局部变量的方法，但它们有一些区别：

1. **作用范围**：
   - `staticCompositionLocalOf` 用于定义静态的局部变量，这些变量在整个 Compose 应用程序的生命周期内保持不变。
   - `compositionLocalOf` 用于定义动态的局部变量，这些变量在每个 Compose 节点的范围内有效，并且可以在节点的子树中访问。
2. **创建时机**：
   - `staticCompositionLocalOf` 在 Compose 应用程序启动时创建，并且在整个应用程序运行期间存在。
   - `compositionLocalOf` 在每次 Compose 节点的重新布局时创建，并且在该节点的生命周期内存在。
3. **访问方式**：
   - 可以在任何 Compose 节点中通过 `LocalContext` 访问 `staticCompositionLocalOf` 定义的变量。
   - 可以在当前 Compose 节点及其子树中通过 `LocalContext` 访问 `compositionLocalOf` 定义的变量。

```kotlin
var isStatic = true
val title: String
val localColor = if (isStatic) {
    title = "staticCompositionLocalOf"
    staticCompositionLocalOf { Color.Black }
} else {
    title = "compositionLocalOf"
    compositionLocalOf { Color.Black }
}
var log = "Jetpack Compose"

@Composable
fun CompositionLocalPage() {
    var color by remember { mutableStateOf(Color.Green) }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(" ${title}")
        VerticalSpacer(10.dp)
        CompositionLocalProvider(localColor provides color) {
            MyBox("外层：${log}", 300.dp, Color.Red) {
                MyBox("中层：${log}", 200.dp, localColor.current) {
                    MyBox("内层：${log}", 100.dp, Color.Blue) {

                    }
                }
            }
        }
        Button(onClick = {
            color = Color.Yellow
            log = "recompose"
        }) {
            Text("修改")
        }
    }
}

@Composable
fun MyBox(tag: String, size: Dp, background: Color, content: @Composable () -> Unit = {}) {
    Column(
        modifier = Modifier
            .size(size)
            .background(background),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = tag)
        content()
    }
}
```

说明：

- 当使用 staticCompositionLocalOf 时，localColor发生变化会重组了整个 Compose。
- 当使用 compositionLocalOf 时，localColor发生变化只会重组局部 Compose。




## @ReadOnlyComposable 只读组件

@ReadOnlyComposable注解是可选的，在Compose中可以对有返回值的Composable使用@ReadOnlyComposable注解，这会使当前的Composable失去局部重组的能力，从而达到编译优化的效果，因此Compose也限制了我们在ReadOnlyComposable中不能使用普通Composable。

