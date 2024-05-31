[toc]

# Compose Accompanist

## 概述

Accompanist是谷歌官方的Compose实验库，它主要是填补Compose工具包中的空白，并且尝试开发新的API。

[官方文档](https://google.github.io/accompanist/)



## SystemUiController

SystemUiController 库可以修改系统UI栏的颜色。

### 添加依赖库

```groovy
implementation "com.google.accompanist:accompanist-systemuicontroller:$accompanist_version"
```

### 使用

```kotlin
val systemUiController = rememberSystemUiController()
val isLight = MaterialTheme.colors.isLight
val colors = arrayOf(
    Color.Red,
    Color.Green,
    Color.Blue,
    Color.Black,
    Color.Gray
)

SideEffect {
    systemUiController.setSystemBarsColor(Color.Transparent, isLight)
}

Column(
    modifier = Modifier
    .systemBarsPadding()
    .fillMaxSize()
    .background(Color.White)
) {
    colors.forEach {
        Box(
            modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .background(it)
            .clickable {
                systemUiController.setSystemBarsColor(it, isLight)
            }
        )
    }
}
```



## Pager

Pager库可以在Jetpack Compose中实现分页的功能，类似于ViewPager。Pager库有两种@Composable组件，分别是HorizontalPager和VerticalPage。

### 添加依赖库

```
implementation "com.google.accompanist:accompanist-pager:$accompanist_version"
```

### 使用

```kotlin
val pagerState = rememberPagerState()
val coroutineScope = rememberCoroutineScope()
var selectedIndex by remember { mutableStateOf(0) }
val tabs = arrayOf(
    TabItem(label = "首页", Icons.Default.Home) { MyPage(text = "首页", color = Color.Red) },
    TabItem(label = "收藏", Icons.Default.Favorite) { MyPage(text = "收藏", color = Color.Green) },
    TabItem(label = "设置", Icons.Default.Settings) { MyPage(text = "设置", color = Color.Blue) },
)

LaunchedEffect(pagerState) {
    snapshotFlow { pagerState.currentPage }.collect {
        selectedIndex = it
    }
}

Scaffold(
    bottomBar = {
        BottomNavigationBar(
            selectedIndex = selectedIndex,
            tabs = tabs,
            onClick = {
                selectedIndex = it
                coroutineScope.launch { pagerState.scrollToPage(selectedIndex) }
            }
        )
    }
) {
    HorizontalPager(
        count = tabs.size,
        modifier = Modifier.fillMaxSize(),
        state = pagerState
    ) { pageIndex ->
       tabs[pageIndex].content()
      }
}
```

```kotlin
data class TabItem(
    val label: String,
    val icon: ImageVector,
    var content: @Composable () -> Unit
)
```

```kotlin
@Composable
fun BottomNavigationBar(selectedIndex: Int, tabs: Array<TabItem>, onClick: (Int) -> Unit) {
    NavigationBar {
        tabs.forEachIndexed { index, tabItem ->
                             NavigationBarItem(
                                 label = { Text(tabItem.label) },
                                 icon = { Icon(tabItem.icon, null) },
                                 selected = selectedIndex == index,
                                 onClick = { onClick(index) }
                             )
                            }
    }
}
```

```kotlin
@Composable
fun MyPage(text: String, color: Color) {
    Box(
        modifier = Modifier
        .fillMaxSize()
        .background(color),
        contentAlignment = Alignment.Center
    ) {
        Text(text)
    }
}
```



## SwipeRefresh

Accompanist库还提供了一个滑动下拉刷新的库，它类似于Android的SwipeRefreshLayout。

### 添加依赖库

```
implementation "com.google.accompanist:accompanist-swiperefresh:$accompanist_version"
```

### 使用

```kotlin
val viewModel: MyViewModel = viewModel()
val isRefreshing by viewModel.isRefreshing.collectAsState()
val data = viewModel.data

SwipeRefresh(
    state = rememberSwipeRefreshState(isRefreshing),
    onRefresh = { viewModel.refresh() }
) {
    LazyColumn(Modifier.fillMaxSize()) {
        items(data) {
            Text("$it")
        }
    }
}
```

```kotlin
class MyViewModel : ViewModel() {
    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean>
        get() = _isRefreshing.asStateFlow()

    private val dataList = mutableListOf<String>().apply {
        for (i in 0..30) {
            add("hello $i")
        }
    }

    var data by mutableStateOf(dataList)

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            delay(1000)
            data.add(0, "${System.currentTimeMillis()}")
            _isRefreshing.value = false
        }
    }
}
```



## FlowLayout

Flow Layout和普通的Row、Column组件不同，如果布局中有子项无法被安排在同一行/列，Flow Layout会帮助它们自动换行/列。

### 添加依赖库

```
implementation "com.google.accompanist:accompanist-flowlayout:$accompanist_version"
```

### 使用

```kotlin
val elements = arrayOf(
    "Apple",
    "Banana",
    "Cherry",
    "Watermelon",
    "Strawberries",
)

FlowRow(
    mainAxisAlignment = FlowMainAxisAlignment.Start,
    mainAxisSpacing = 10.dp,
    crossAxisAlignment = FlowCrossAxisAlignment.Start,
    crossAxisSpacing = 20.dp
) {
    repeat(5) {
        elements.forEach {
            Text(
                text = "$it",
                modifier = Modifier
                .border(1.dp, Color.Green)
                .padding(10.dp)
            )
        }
    }
}
```

