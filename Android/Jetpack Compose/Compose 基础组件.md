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




## @ReadOnlyComposable 只读组件

@ReadOnlyComposable注解是可选的，在Compose中可以对有返回值的Composable使用@ReadOnlyComposable注解，这会使当前的Composable失去局部重组的能力，从而达到编译优化的效果，因此Compose也限制了我们在ReadOnlyComposable中不能使用普通Composable。

