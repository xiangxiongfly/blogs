[toc]

# Compose 布局

## Column

Compose中的”垂直线性布局“。

通过设置 Modifier.horizontalScroll 可以实现ScrollView效果，如： `Row(modifier = Modifier.horizontalScroll(scrollState)`。

### Column属性

```kotlin
@Composable
inline fun Column(
    // 修饰符
    modifier: Modifier = Modifier,
    // 子元素的垂直排列方式
    // Arrangement.Top：子元素靠近顶部
    // Arrangement.Center：子元素靠近中间
    // Arrangement.Bottom：子元素靠近底部
    // Arrangement.SpaceEvenly：子元素均匀分布，中间间隔是均匀分布的
    // Arrangement.SpaceAround：子元素均匀分布，子元素前后间隔是相同的
    // Arrangement.SpaceBetween：前后无间隔，子元素均匀分布
    // Arrangement.spacedBy：指定子元素间隔
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    // 子元素的水平对齐方式
    horizontalAlignment: Alignment.Horizontal = Alignment.Start,
    content: @Composable ColumnScope.() -> Unit
) 
```

### 使用

**简单使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/530660b72f724d3f85a6dc9993f5c6c6.png)

```kotlin
Column(
    modifier = Modifier.fillMaxSize(),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Text("one", color = Color.Red)
    Text("two", color = Color.Green)
    Text("three", color = Color.Blue)
}
```

**使用Arrangement.SpaceEvenly：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7a1147c011d942dc8d8dab1844e65652.png)

```kotlin
@Composable
fun MyText(text: String) {
    Box(
        modifier = Modifier
            .size(150.dp)
            .background(Color.Gray),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text,
            fontSize = 30.sp
        )
    }
}

@Composable
fun MyColumn() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceEvenly,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        MyText("one")
        MyText("two")
        MyText("three")
    }
}
```

**使用Arrangement.SpaceAround：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/010723af7c5b40edb0f28ca4e89de469.png)

```kotlin
@Composable
fun MyColumn() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceAround,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        MyText("one")
        MyText("two")
        MyText("three")
    }
}
```

**使用Arrangement.SpaceBetween：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/26e99d5255794611abf3a24f6eeb2934.png)

```kotlin
@Composable
fun MyColumn() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        MyText("one")
        MyText("two")
        MyText("three")
    }
}
```

**使用Arrangement.spacedBy：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b6350478ed2643d89436f89345dad993.png)

```kotlin
@Composable
fun MyColumn() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        MyText("one")
        MyText("two")
        MyText("three")
    }
}
```



## Row

Compose中的”水平线性布局“。

### Row属性

```kotlin
@Composable
inline fun Row(
    // 修饰符
    modifier: Modifier = Modifier,
    // 子元素水平排列方式
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    // 子元素垂直对齐方式
    verticalAlignment: Alignment.Vertical = Alignment.Top,
    content: @Composable RowScope.() -> Unit
) 
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/05571fcc92194dd69a9ef3784ec6c10c.png)

```kotlin
@Composable
fun MyRow() {
    Row(
        modifier = Modifier.fillMaxSize(),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        MyText("one")
        MyText("two")
        MyText("three")
    }
}
```



## Box

Compose中的”帧布局“。

### Box属性

```kotlin
@Composable
inline fun Box(
    // 修饰符
    modifier: Modifier = Modifier,
    // 子元素对齐方式
    contentAlignment: Alignment = Alignment.TopStart,
    // 是否开启最小尺寸约束
    // 如果设置true，表示开启，则子元素会有最小尺寸约束
    propagateMinConstraints: Boolean = false,
    content: @Composable BoxScope.() -> Unit
)
```

### 使用

**简单使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/998691c518794597a4ba9dbaf2645aae.png)

```kotlin
@Composable
fun MyBox() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row {
            Box(
                contentAlignment = Alignment.TopStart,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0xFF, 0, 0, 0xFF))
            ) {
                Text("1")
            }
            Box(
                contentAlignment = Alignment.TopCenter,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0xFF, 0, 0, 0x99))
            ) {
                Text("2")
            }
            Box(
                contentAlignment = Alignment.TopEnd,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0xFF, 0, 0, 0x33))
            ) {
                Text("3")
            }
        }
        Row {
            Box(
                contentAlignment = Alignment.CenterStart,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0xFF, 0, 0xFF))
            ) {
                Text("4")
            }
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0xFF, 0, 0x99))
            ) {
                Text("5")
            }
            Box(
                contentAlignment = Alignment.CenterEnd,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0xFF, 0, 0x33))
            ) {
                Text("6")
            }
        }
        Row {
            Box(
                contentAlignment = Alignment.BottomStart,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0, 0xFF, 0xFF))
            ) {
                Text("7")
            }
            Box(
                contentAlignment = Alignment.BottomCenter,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0, 0xFF, 0x99))
            ) {
                Text("8")
            }
            Box(
                contentAlignment = Alignment.BottomEnd,
                modifier = Modifier
                    .size(50.dp)
                    .background(Color(0, 0, 0xFF, 0x33))
            ) {
                Text("9")
            }
        }
    }
}
```

**使用propagateMinConstraints：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/01f14f97ee634aa9bf68a90450feeca7.png)

```kotlin
@Composable
fun MyBox() {
    Box(modifier = Modifier.padding(10.dp)) {
        Box(
            modifier = Modifier
                .size(50.dp)
                .background(Color(0, 0, 0xFF)),
            propagateMinConstraints = true
        ) {
            Box(
                modifier = Modifier
                    .background(Color(0xFF, 0, 0)),
            ) {
                Text("aaa")
            }
        }
    }
}
```

说明：因为第2个Box开启了`propagateMinConstraints = true`，因此第3个Box有了最小约束也就是50x50，因此会填充父容器。



## ConstraintLayout

Compose中的”约束布局“。

**添加依赖库：**

```
implementation "androidx.constraintlayout:constraintlayout-compose:1.0.1"
```

**使用：**

- createRefs()：创建多个引用。
- createRef()：创建一个引用。
- constrainAs：定义约束。
- linkTo：约束关系。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7b4e9adb30044b238fa33bff9916c555.png)

```kotlin
ConstraintLayout(modifier = Modifier.fillMaxSize()) {
    val (one, two) = createRefs()  
    val three = createRef() 
    DefaultText(text = "One", modifier = Modifier.constrainAs(one) {
        start.linkTo(parent.start)
        end.linkTo(parent.end)
        top.linkTo(parent.top, margin = 16.dp)
    })
    DefaultText(text = "Two", modifier = Modifier.constrainAs(two) {
        start.linkTo(parent.start)
        end.linkTo(parent.end)
        top.linkTo(one.bottom, margin = 16.dp)
    })
    DefaultText(text = "Three", modifier = Modifier.constrainAs(three) {
        start.linkTo(parent.start)
        end.linkTo(parent.end)
        bottom.linkTo(parent.bottom, margin = 16.dp)
    })
}
```



## LazyColumn

Compose中的“垂直RecyclerView”。

### LazyColumn属性

```kotlin
@Composable
fun LazyColumn(
    modifier: Modifier = Modifier, // 修饰符
    state: LazyListState = rememberLazyListState(), // 列表状态
    contentPadding: PaddingValues = PaddingValues(0.dp), // 内边距
    reverseLayout: Boolean = false, // 是否反转
    verticalArrangement: Arrangement.Vertical =
        if (!reverseLayout) Arrangement.Top else Arrangement.Bottom, // 垂直排列方式
    horizontalAlignment: Alignment.Horizontal = Alignment.Start, // 水平对齐方式
    flingBehavior: FlingBehavior = ScrollableDefaults.flingBehavior(), // fling逻辑
    userScrollEnabled: Boolean = true, // 是否开启滚动
    content: LazyListScope.() -> Unit
)
```

```kotlin
@LazyScopeMarker
@JvmDefaultWithCompatibility
interface LazyListScope {
    // 添加一个项目
    fun item(
        key: Any? = null,
        contentType: Any? = null,
        content: @Composable LazyItemScope.() -> Unit
    ) 

    // 添加多个项目
    fun items(
        count: Int,
        key: ((index: Int) -> Any)? = null,
        contentType: (index: Int) -> Any? = { null },
        itemContent: @Composable LazyItemScope.(index: Int) -> Unit
    )

    // 添加粘性标题
    @ExperimentalFoundationApi
    fun stickyHeader(
        key: Any? = null,
        contentType: Any? = null,
        content: @Composable LazyItemScope.() -> Unit
    )
}
```

```kotlin
// 通过List添加列表
inline fun <T> LazyListScope.items(
    items: List<T>,
    noinline key: ((item: T) -> Any)? = null,
    noinline contentType: (item: T) -> Any? = { null },
    crossinline itemContent: @Composable LazyItemScope.(item: T) -> Unit
) = items(
    count = items.size,
    key = if (key != null) { index: Int -> key(items[index]) } else null,
    contentType = { index: Int -> contentType(items[index]) }
) {
    itemContent(items[it])
}

// 通过List添加列表，含索引值
inline fun <T> LazyListScope.itemsIndexed(
    items: List<T>,
    noinline key: ((index: Int, item: T) -> Any)? = null,
    crossinline contentType: (index: Int, item: T) -> Any? = { _, _ -> null },
    crossinline itemContent: @Composable LazyItemScope.(index: Int, item: T) -> Unit
) = items(
    count = items.size,
    key = if (key != null) { index: Int -> key(index, items[index]) } else null,
    contentType = { index -> contentType(index, items[index]) }
) {
    itemContent(it, items[it])
}

// 通过数组添加列表
inline fun <T> LazyListScope.items(
    items: Array<T>,
    noinline key: ((item: T) -> Any)? = null,
    noinline contentType: (item: T) -> Any? = { null },
    crossinline itemContent: @Composable LazyItemScope.(item: T) -> Unit
) = items(
    count = items.size,
    key = if (key != null) { index: Int -> key(items[index]) } else null,
    contentType = { index: Int -> contentType(items[index]) }
) {
    itemContent(items[it])
}

// 通过数组添加列表，含索引值
inline fun <T> LazyListScope.itemsIndexed(
    items: Array<T>,
    noinline key: ((index: Int, item: T) -> Any)? = null,
    crossinline contentType: (index: Int, item: T) -> Any? = { _, _ -> null },
    crossinline itemContent: @Composable LazyItemScope.(index: Int, item: T) -> Unit
) = items(
    count = items.size,
    key = if (key != null) { index: Int -> key(index, items[index]) } else null,
    contentType = { index -> contentType(index, items[index]) }
) {
    itemContent(it, items[it])
}
```

### 使用

**使用items：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/be2d3a0a8425416dafe1559b71f1d6a4.png)

```kotlin
val dataList = arrayListOf<Int>()
for (index in 0..50) {
    dataList.add(index)
}

LazyColumn(modifier = Modifier.fillMaxSize()) {
    items(dataList) { data ->
        Text("hello $data")
    }
}
```

**使用itemsIndexed：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/427916e494164c1ba7b6f2fcd56e5835.png)

```kotlin
val dataList = arrayListOf<Int>()
for (index in 0..50) {
    dataList.add(index)
}

LazyColumn(modifier = Modifier.fillMaxSize()) {
    itemsIndexed(dataList) { index, data ->
        Text("hello $index $data")
    }
}
```

### 使用多类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/bbb96423c88041e3a95f538b39ae79ec.png)

```kotlin
val chatList = arrayListOf<Chat>()
chatList.apply {
    add(Chat("hello"))
    add(Chat("world", false))
    add(Chat("apple"))
    add(Chat("orange"))
    add(Chat("banana"))
    add(Chat("List", false))
}

LazyColumn(modifier = Modifier
           .fillMaxSize()
           .padding(5.dp)) {
    items(chatList) { item ->
                     if (item.isLeft) {
                         Column(modifier = Modifier.padding(end = 15.dp)) {
                             Spacer(modifier = Modifier.height(5.dp))
                             Text(
                                 item.content,
                                 modifier = Modifier
                                 .fillMaxWidth()
                                 .height(25.dp)
                                 .background(Color.Green)
                             )
                         }
                     } else {
                         Column(modifier = Modifier.padding(start = 15.dp)) {
                             Spacer(modifier = Modifier.height(5.dp))
                             Text(
                                 item.content,
                                 modifier = Modifier
                                 .fillMaxWidth()
                                 .height(25.dp)
                                 .background(Color.Yellow)
                             )
                         }
                     }
    }
}
```

### 使用粘性标题

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/746ce34a073f472e912d8a0172665591.png)

```kotlin
val dataList = arrayListOf<Int>()
for (i in 0..30) {
    dataList.add(i)
}

LazyColumn(
    modifier = Modifier
    .fillMaxSize()
    .padding(5.dp)
) {
    stickyHeader {
        Text(
            "粘性标题一",
            modifier = Modifier
            .fillMaxWidth()
            .background(Color.Red),
            textAlign = TextAlign.Center
        )
    }
    items(dataList) { data ->
        Text("数据：$data")
    }
    stickyHeader {
        Text(
            "粘性标题二",
            modifier = Modifier
            .fillMaxWidth()
            .background(Color.Green),
            textAlign = TextAlign.Center
        )
    }
    items(dataList) { data ->
        Text("数据：$data")
    }
    stickyHeader {
        Text(
            "粘性标题三",
            modifier = Modifier
            .fillMaxWidth()
            .background(Color.Blue),
            textAlign = TextAlign.Center
        )
    }
    items(dataList) { data ->
        Text("数据：$data")
    }
}
```

### 回到顶部

- firstVisibleItemIndex：可见区域的第一个项的索引值。
- animateScrollToItem：移动到指定坐标。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ce9032ac71fb44878b12cf4051b089a8.png)

```kotlin
val dataList = arrayListOf<Int>()
for (i in 0..60) {
    dataList.add(i)
}

val listState = rememberLazyListState()
val coroutineScope = rememberCoroutineScope()
val context = LocalContext.current

Box {
    LazyColumn(
        modifier = Modifier
        .fillMaxWidth()
        .padding(5.dp), state = listState
    ) {
        items(dataList) { data ->
            Text("数据：$data")
        }
    }

    Box(modifier = Modifier.matchParentSize(), contentAlignment = Alignment.BottomEnd) {
        Button(modifier = Modifier.wrapContentSize(), onClick = {
            coroutineScope.launch {
                listState.animateScrollToItem(0)
            }
        }) {
            Text("返回\n顶部")
        }
    }

    Box(modifier = Modifier.matchParentSize(), contentAlignment = Alignment.BottomCenter) {
        Button(modifier = Modifier.wrapContentSize(), onClick = {
            Toast.makeText(
                context, "firstVisibleItemIndex：${listState.firstVisibleItemIndex}", Toast.LENGTH_SHORT
            ).show()
        }) {
            Text("firstVisibleItemIndex")
        }
    }
}
```



## LazyRow

Compose中的“水平RecyclerView”。

### LazyRow属性

```kotlin
fun LazyRow(
    modifier: Modifier = Modifier, // 修饰符
    state: LazyListState = rememberLazyListState(), // 列表状态
    contentPadding: PaddingValues = PaddingValues(0.dp), // 内边距
    reverseLayout: Boolean = false, // 是否反转
    horizontalArrangement: Arrangement.Horizontal =
        if (!reverseLayout) Arrangement.Start else Arrangement.End, // 水平排列方式
    verticalAlignment: Alignment.Vertical = Alignment.Top, // 垂直对齐方式
    flingBehavior: FlingBehavior = ScrollableDefaults.flingBehavior(), // fling逻辑
    userScrollEnabled: Boolean = true, // 是否开启滚动
    content: LazyListScope.() -> Unit
) 
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f51d0767b7c04a4c9a58ed28158cd096.png)

```kotlin
val dataList = arrayListOf<Int>()
for (i in 0..60) {
    dataList.add(i)
}
LazyRow(
    modifier = Modifier
    .fillMaxWidth()
    .padding(5.dp)
) {
    items(items = dataList, key = { index -> index }) { data ->
         Text("数据：$data", modifier = Modifier.padding(10.dp))
    }
}
```



## LazyVerticalGrid

Compose中的“垂直网格布局”。

### LazyVerticalGrid属性

```kotlin
@Composable
fun LazyVerticalGrid(
    columns: GridCells, // 单元格
    modifier: Modifier = Modifier, // 修饰符
    state: LazyGridState = rememberLazyGridState(), // 网格状态
    contentPadding: PaddingValues = PaddingValues(0.dp), // 内边距
    reverseLayout: Boolean = false, // 是否反转
    verticalArrangement: Arrangement.Vertical =
        if (!reverseLayout) Arrangement.Top else Arrangement.Bottom, // 垂直排列方式
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start, //水平对齐方式
    flingBehavior: FlingBehavior = ScrollableDefaults.flingBehavior(), // fling逻辑
    userScrollEnabled: Boolean = true, // 是否开启滚动
    content: LazyGridScope.() -> Unit
)
```

### 使用

**定义5列：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7fa14757ea6540209a4ab1b61bb54ace.png)

```kotlin
val photoList = arrayListOf<Int>()
for (i in 0..20) {
    photoList.add(R.drawable.ic_launcher_background)
}
LazyVerticalGrid(columns = GridCells.Fixed(5)) {
    items(photoList) { photo ->
        Image(painterResource(id = photo), null, Modifier.padding(5.dp))
    }
}
```

**定义网格最小100dp：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/08d95d7130164afeacba3579753b76ec.png)

```kotlin
LazyVerticalGrid(columns = GridCells.Adaptive(100.dp)) {
    items(photoList) { photo ->
         Image(painterResource(id = photo), null, Modifier.padding(5.dp))
    }
}
```

