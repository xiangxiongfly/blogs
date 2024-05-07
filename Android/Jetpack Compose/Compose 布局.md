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

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d0c3aac2b6cc4206908012cfa4509771.png)

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

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/800775dae7d24cab8effb8929a1ddc39.png)

```kotlin
Surface(
    shape = RoundedCornerShape(8.dp),
    modifier = Modifier
        .padding(horizontal = 12.dp)
        .fillMaxWidth()
) {
    Column(modifier = Modifier.padding(12.dp)) {
        Text("Jetpack Compose", style = MaterialTheme.typography.h6)
        Spacer(modifier = Modifier.padding(vertical = 5.dp))
        Text("Jetpack Compose 是 Google 推出的一个用于构建现代 Android 用户界面的工具包。它采用了一种反应式的编程模型，使得开发者可以更加高效地构建复杂的用户界面，并提供了丰富的布局、样式和动画功能。")
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = { /*TODO*/ }) {
                Icon(Icons.Filled.Favorite, null)
            }
            IconButton(onClick = { /*TODO*/ }) {
                Icon(Icons.Filled.Call, null)
            }
            IconButton(onClick = { /*TODO*/ }) {
                Icon(Icons.Filled.Person, null)
            }
        }
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



## Surface

Surface从字面上来理解，是一个平面，在Material Design设计准则中也同样如此，我们可以将很多的组件摆放在这个平面之上，可以设置这个平面的边框、圆角、颜色等。

### Surface属性

```kotlin
@Composable
fun Surface(
    modifier: Modifier = Modifier, // 修饰符
    shape: Shape = RectangleShape, // 形状
    color: Color = MaterialTheme.colors.surface, // 背景颜色
    contentColor: Color = contentColorFor(color), // 内容颜色，如内部文字
    border: BorderStroke? = null, // 边框
    elevation: Dp = 0.dp, // 高度，也就是阴影大小
    content: @Composable () -> Unit
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f8746e9217f340be9cdffe739b5530aa.png)

```kotlin
Surface(
    shape = RoundedCornerShape(8.dp),
    elevation = 10.dp,
    modifier = Modifier
        .width(300.dp)
        .height(100.dp)
) {
    Row(modifier = Modifier.clickable { }) {
        Image(
            painter = painterResource(id = R.drawable.img),
            contentDescription = null,
            modifier = Modifier.size(100.dp),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.padding(horizontal = 12.dp))
        Column(modifier = Modifier.fillMaxHeight(), verticalArrangement = Arrangement.Center) {
            Text("Hello World", style = MaterialTheme.typography.h6)
            Spacer(modifier = Modifier.padding(vertical = 8.dp))
            Text("hello compose")
        }
    }
}
```

### Surface与Box区别

- 如果我们需要快速设置界面的形状、阴影、边框、颜色等，则用Surface更为合适，它可以减少Modifier的使用量。
- 如果只是需要简单地设置界面的背景颜色、大小，且有时候需要简单安排里面布局的位置，则可以使用Box。



## ConstraintLayout

Compose中的”约束布局“。

### 添加依赖库

```
implementation "androidx.constraintlayout:constraintlayout-compose:1.0.1"
```

### ConstrainScope属性

在 ConstrainScope 中可以设置 width 和 height：

| Dimension值            | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| wrapContent()          | 内容自适应尺寸                                               |
| matchParent()          | 填充父容器尺寸                                               |
| fillToConstraints()    | 拉伸填充父容器尺寸                                           |
| preferredWrapContent() | 如果剩余空间大于内容尺寸，则实际尺寸为内容尺寸；如果剩余空间小于内容尺寸，则实际尺寸为剩余空间尺寸 |
| ratio(String)          | 宽高比，如 width = Dimension.ratio('1:2') 表示将宽度设置为高度的一半 |
| percent(Float)         | 占比尺寸                                                     |
| value(Dp)              | 固定尺寸                                                     |
| preferredValue(Dp)     | 如果剩余空间大于固定尺寸，则实际尺寸为固定尺寸；如果剩余空间小于固定尺寸，则实际尺寸为剩余空间 |

### 简单使用

- createRefs()：创建多个引用。
- createRef()：创建一个引用。
- constrainAs：定义约束。
- linkTo：约束关系。



![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8ba8eb249521403cb13af58480135f65.png)

```kotlin
ConstraintLayout(
    modifier = Modifier
        .width(300.dp)
        .height(100.dp)
        .padding(10.dp)
) {
    val (portraitImageRef, usernameTextRef, descTextRef) = remember { createRefs() }
    Image(
        painterResource(id = R.drawable.img),
        null,
        modifier = Modifier.clip(RoundedCornerShape(10.dp))
            .constrainAs(portraitImageRef) {
                top.linkTo(parent.top)
                bottom.linkTo(parent.bottom)
                start.linkTo(parent.start)
            }
        )
                Text (
                "Jetpack Compose",
        fontSize = 16.sp,
        maxLines = 1,
        textAlign = TextAlign.Left,
        modifier = Modifier.constrainAs(usernameTextRef) {
            top.linkTo(portraitImageRef.top)
            start.linkTo(portraitImageRef.end, 10.dp)
        }
    )
    Text(
        "这是一堆描述信息",
        fontSize = 14.sp,
        color = Color.Gray,
        fontWeight = FontWeight.Light,
        modifier = Modifier.constrainAs(descTextRef) {
            top.linkTo(usernameTextRef.bottom, 5.dp)
            start.linkTo(portraitImageRef.end, 10.dp)
        }
    )
}
```

### 使用preferredWrapContent

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4f116a1ee12c4914873492dee183f095.png)

```kotlin
Text(
    "这是一堆描述信息这是一堆描述信息这是一堆描述信息这是一堆描述信息这是一堆描述信息这是一堆描述信息这是一堆描述信息这是一堆描述信息",
    fontSize = 14.sp,
    color = Color.Gray,
    fontWeight = FontWeight.Light,
    maxLines = 1,
    modifier = Modifier.constrainAs(descTextRef) {
        top.linkTo(usernameTextRef.bottom, 5.dp)
        start.linkTo(portraitImageRef.end, 10.dp)
        width = Dimension.preferredWrapContent
    }
)
```

### 使用Barrier

Barrier 分界线。

使用createEndBarrier创建一条结尾分界线，该分界线位置位于两个文本中较长文本的结尾处。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/23b1cceaf45e4378b02614d413b7726d.png)

```kotlin
ConstraintLayout(
    modifier = Modifier
    .width(400.dp)
    .padding(10.dp)
) {
    val (usernameTextRef, passwordTextRef, usernameInputRef, passwordInputRef, dividerRef) = remember { createRefs() }
    val barrier = createEndBarrier(usernameTextRef, passwordTextRef)
    Text(
        "用户名",
        fontSize = 14.sp,
        textAlign = TextAlign.Left,
        modifier = Modifier.constrainAs(usernameTextRef) {
            top.linkTo(parent.top)
            start.linkTo(parent.start)
        }
    )
    Divider(modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp)
            .constrainAs(dividerRef) {
                top.linkTo(usernameTextRef.bottom)
                bottom.linkTo(passwordTextRef.top)
            })
    Text(
        "密码",
        fontSize = 14.sp,
        textAlign = TextAlign.Left,
        modifier = Modifier.constrainAs(passwordTextRef) {
            top.linkTo(dividerRef.bottom)
            start.linkTo(parent.start)
        }
    )
    OutlinedTextField(
        value = "",
        onValueChange = {},
        modifier = Modifier.constrainAs(usernameInputRef) {
            start.linkTo(barrier, 10.dp)
            top.linkTo(usernameTextRef.top)
            bottom.linkTo(usernameTextRef.bottom)
            height = Dimension.fillToConstraints
        }
    )
    OutlinedTextField(
        value = "",
        onValueChange = {},
        modifier = Modifier.constrainAs(passwordInputRef) {
            start.linkTo(barrier, 10.dp)
            top.linkTo(passwordTextRef.top)
            bottom.linkTo(passwordTextRef.bottom)
            height = Dimension.fillToConstraints
        }
    )
}
```

### 使用Guideline

Guideline 引导线。

可以使用createGuidelineFromTop创建从顶部出发的引导线。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/23b1cceaf45e4378b02614d413b7726d.png)

```kotlin
ConstraintLayout(
    modifier = Modifier
        .fillMaxWidth()
        .height(300.dp)
        .background(Color.LightGray)
) {
    val (portraitRef, bgRef, welcomeRef) = remember { createRefs() }
    val guideLine = createGuidelineFromTop(0.5F)
    Box(modifier = Modifier
        .background(Color.Blue)
        .constrainAs(bgRef) {
            top.linkTo(parent.top)
            bottom.linkTo(guideLine)
            height = Dimension.fillToConstraints
            width = Dimension.matchParent
        }
       )
    Image(
        painter = painterResource(id = R.drawable.img),
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = Modifier
            .size(100.dp)
            .clip(CircleShape)
            .border(width = 2.dp, color = Color.Red, shape = CircleShape)
            .constrainAs(portraitRef) {
                top.linkTo(guideLine)
                bottom.linkTo(guideLine)
                start.linkTo(parent.start)
                end.linkTo(parent.end)
            }
    )
    Text(
        "Jetpack Compose",
        color = Color.White,
        fontSize = 26.sp,
        modifier = Modifier.constrainAs(welcomeRef) {
            top.linkTo(portraitRef.bottom, 20.dp)
            start.linkTo(parent.start)
            end.linkTo(parent.end)
        }
    )
}
```

### 使用Chain

Chain 链接约束。

通过链接约束可以允许多个组件平均分配布局空间，这个功能类似于weight修饰符。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/16adfbe11ef2401aa2eef4bd22ac0fba.png)

```kotlin
ConstraintLayout(
    modifier = Modifier
    .fillMaxWidth()
    .height(300.dp)
    .background(Color.LightGray)
) {
    val (oneRef, twoRef, threeRef, fourRef) = remember { createRefs() }
    createVerticalChain(oneRef, twoRef, threeRef, fourRef, chainStyle = ChainStyle.Spread)
    Text(
        text = "AAAAAAAAAAAAAAAAAA",
        color = Color.White,
        modifier = Modifier.constrainAs(oneRef) {
            start.linkTo(parent.start)
            end.linkTo(parent.end)
        }
    )
    Text(
        text = "AAAAAAAAAAAAAAAAAA",
        color = Color.White,
        modifier = Modifier.constrainAs(twoRef) {
            start.linkTo(parent.start)
            end.linkTo(parent.end)
        }
    )
    Text(
        text = "AAAAAAAAAAAAAAAAAA",
        color = Color.White,
        modifier = Modifier.constrainAs(threeRef) {
            start.linkTo(parent.start)
            end.linkTo(parent.end)
        }
    )
    Text(
        text = "AAAAAAAAAAAAAAAAAA",
        color = Color.White,
        modifier = Modifier.constrainAs(fourRef) {
            start.linkTo(parent.start)
            end.linkTo(parent.end)
        }
    )
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

