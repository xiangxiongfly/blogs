[toc]

# Compose 简单组件

## Text

Compose中的“TextView”。

在 Compose 中，Text 是遵循 Material Design 规范设计的上层文本组件，如果想脱离 Material Design 使用，也可以直接使用更底层的文本组件 BasicText。

### Text属性

```kotlin
@Composable
fun Text(
    text: String, // 文本
    modifier: Modifier = Modifier, // 修饰符
    color: Color = Color.Unspecified, // 文字颜色
    fontSize: TextUnit = TextUnit.Unspecified, // 文字大小
    fontStyle: FontStyle? = null, // 文字样式，如斜体
    fontWeight: FontWeight? = null, // 文字粗细
    fontFamily: FontFamily? = null, // 字体
    letterSpacing: TextUnit = TextUnit.Unspecified, // 字间距
    textDecoration: TextDecoration? = null, // 文字的装饰，如下划线
    textAlign: TextAlign? = null, // 文字的对齐方式
    lineHeight: TextUnit = TextUnit.Unspecified, // 行高
    overflow: TextOverflow = TextOverflow.Clip, // 文字溢出处理
    softWrap: Boolean = true, // 是否在换行处中断
    maxLines: Int = Int.MAX_VALUE, // 最大行数
    onTextLayout: (TextLayoutResult) -> Unit = {}, // 文字变化回调
    style: TextStyle = LocalTextStyle.current // 样式配置，包含颜色、字体、行高等
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/70543b119cc944d4bfb0a8df6edc8cbe.png)

```kotlin
Text(
    "hello compose", // 指定字符串
    color = Color.Red,
    fontSize = 16.sp,
    fontStyle = FontStyle.Italic,
    fontWeight = FontWeight.Bold
)
Text(
    stringResource(id = R.string.app_text), // 指定字符串资源
    color = Color.Blue,
    fontFamily = FontFamily.Cursive
)
Text("下划线", textDecoration = TextDecoration.Underline)
Text("贯穿线", textDecoration = TextDecoration.LineThrough)
Text(
    "猫和老鼠",
    textAlign = TextAlign.Center,
    modifier = Modifier
    .width(250.dp) // 宽
    .border(width = 1.dp, color = Color.Gray) // 边框
)
Text(
    "床前明月光，疑似地上霜，举头望明月，低头思故乡",
    lineHeight = 35.sp, // 行高
    modifier = Modifier
    .width(250.dp)
    .drawBehind {
        drawRoundRect(
            color = Color.Red, style = Stroke(
                width = 1.dp.toPx(),
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
            )
        )
    },
)
Text(
    "床前明月光，疑似地上霜，举头望明月，低头思故乡",
    modifier = Modifier.width(250.dp),
    maxLines = 1, // 最大行数
    overflow = TextOverflow.Ellipsis // 溢出处理
)
```

### AnnotatedString

AnnotatedString 支持在同一组Text中设置不同的样式。

#### SpanStyle

SpanStyle 应用于字符。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/07d362f7097847e4969efd1ffeccb006.png)

```kotlin
Text(buildAnnotatedString {
    withStyle(style = SpanStyle(color = Color.Blue, fontWeight = FontWeight.Bold)) {
        append("H")
    }
    append("ello")
    withStyle(style = SpanStyle(color = Color.Red, fontWeight = FontWeight.Bold)) {
        append("W")
    }
    append("orld")
})
```

#### ParagraphStyle

ParagraphStyle 应用于整个段落，属于容器。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f4a2abbfe5be443eaa31e8c9d4f0f7cb.png)

```kotlin
Text(buildAnnotatedString {
    withStyle(style = ParagraphStyle(lineHeight = 30.sp)) {
        withStyle(style = SpanStyle(color = Color.Blue)) {
            append("Hello")
            append("\n")
        }
        withStyle(style = SpanStyle(color = Color.Red)) {
            append("World")
            append("\n")
        }
        append("Text")
    }
})
```

### SelectionContainer 和 DisableSelection

- SelectionContainer 用于文字选择。
- DisableSelection 用于禁止文字选择。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8e4256ace5014bf7af4a89467a3d13c6.png)

```kotlin
SelectionContainer(modifier = Modifier.fillMaxSize()) {
    Column {
        Text("床前明月光")
        Text("疑是地下霜")
        DisableSelection {
            Text("hello")
            Text("world")
        }
        Text("举头望明月")
        Text("低头思故乡")
    }
}
```

### ClickableText

- ClickableText 用于可点击文本。

```kotlin
ClickableText(text = AnnotatedString("hello world"), 
              onClick = { offset ->
                         Log.e("TAG", "offset: ${offset}")  
                        }
             )
```

**在Text中添加额外信息：**

```kotlin
val annotatedString = buildAnnotatedString {
    append("点击")
    pushStringAnnotation(tag = "URL", annotation = "https://www.baidu.com/")
    withStyle(style = SpanStyle(color = Color.Red, fontWeight = FontWeight.Bold)) {
        append("Url")
    }
    pop()
}
    ClickableText(text = annotatedString, style = TextStyle(fontSize = 30.sp), onClick = { offset ->
        annotatedString.getStringAnnotations(tag = "URL", start = offset, end = offset)
            .firstOrNull()?.let { annotation -> Log.e("TAG", annotation.item) }
    })
```



## TextField

Compose中的"EditText"。

TextField 组件是我们最常使用的文本输入框，它也遵循着 Material Design 设计准则。它也有一个低级别的底层组件，叫作BasicTextField。

TextField 有两种风格，一种为默认的 filled，另一种 OutlinedTextField。

### TextField属性

```kotlin
@Composable
fun TextField(
    value: String, // 文本内容
    onValueChange: (String) -> Unit, // 文本内容变化回调
    modifier: Modifier = Modifier, // 修饰符
    enabled: Boolean = true, // 是否可点击
    readOnly: Boolean = false, // 是否只读
    textStyle: TextStyle = LocalTextStyle.current, // 文字样式
    label: @Composable (() -> Unit)? = null, // 定义label组件
    placeholder: @Composable (() -> Unit)? = null, // 定义placeholder组件
    leadingIcon: @Composable (() -> Unit)? = null, // 定义前置图标
    trailingIcon: @Composable (() -> Unit)? = null, // 定义后置图标
    isError: Boolean = false, // 是否提示错误
    visualTransformation: VisualTransformation = VisualTransformation.None, // 输入框的视觉，如PasswordVisualTransformation密码效果
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default, // 软键盘选项，类似于inputType
    keyboardActions: KeyboardActions = KeyboardActions(), // IME动作
    singleLine: Boolean = false, // 是否单行
    maxLines: Int = Int.MAX_VALUE, // 支持最大行数
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }, // 监听组件状态
    shape: Shape =
    	MaterialTheme.shapes.small.copy(bottomEnd = ZeroCornerSize, bottomStart = ZeroCornerSize), // 输入框形状
    colors: TextFieldColors = TextFieldDefaults.textFieldColors() // 不同状态下颜色组
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/11b1bdbb9c204ee58e47f384a3a76d6c.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e6190ec627a84743bb88bf46e76c02ce.png)

```kotlin
var name by remember { mutableStateOf("") }
var password by remember { mutableStateOf("") }
TextField(value = name, onValueChange = { name = it }, label = { Text("用户名") })
TextField(
    value = password,
    onValueChange = { password = it },
    label = { Text("密码") },
    visualTransformation = PasswordVisualTransformation()
)
```

**其他属性使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/835abc9a5a534ff985d03c7ec82e587d.png)

```kotlin
var name by remember { mutableStateOf("") }
var password by remember { mutableStateOf("") }
TextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("用户名") },
    leadingIcon = { Icon(Icons.Filled.AccountBox, null) }
)
TextField(
    value = password,
    onValueChange = { password = it },
    label = { Text("密码") },
    trailingIcon = {
        IconButton(onClick = { }) {
            Icon(Icons.Filled.Face, null)
        }
    },
    visualTransformation = PasswordVisualTransformation()
)
```

### OutlinedTextField

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d9d7493efbdb4c8bbd40019764998f27.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/34075ebcd6f743379fc9424dbcb28fee.png)

```kotlin
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("用户名") },
    leadingIcon = { Icon(Icons.Filled.AccountBox, null) }
)
OutlinedTextField(
    value = password,
    onValueChange = { password = it },
    label = { Text("密码") },
    trailingIcon = {
        IconButton(onClick = { }) {
            Icon(Icons.Filled.Face, null)
        }
    },
    visualTransformation = PasswordVisualTransformation()
)
```

### BasicTextField

#### BasicTextField属性

```kotlin
fun BasicTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    textStyle: TextStyle = TextStyle.Default,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    singleLine: Boolean = false,
    maxLines: Int = Int.MAX_VALUE,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    onTextLayout: (TextLayoutResult) -> Unit = {},
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    cursorBrush: Brush = SolidColor(Color.Black), // 光标颜色
    decorationBox: @Composable (innerTextField: @Composable () -> Unit) -> Unit =
        @Composable { innerTextField -> innerTextField() } // 装饰
)
```

#### 简单使用BasicTextField

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b167ed0f9c8e4462be0db7ee64e21057.png)

```kotlin
val text = remember { mutableStateOf("hello") }
BasicTextField(
    value = text.value,
    onValueChange = { text.value = it },
    decorationBox = { innerTextField ->
        Column {
            innerTextField()
            Divider(
                thickness = 2.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.Blue)
            )
        }
    }
)
```

#### 自定义样式

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7a5a5165ae494369bc665be9732d8cc9.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/71677b7e6a1d49c5a13832123f993f0f.png)

```kotlin
var searchText by remember { mutableStateOf("") }
Box(
    modifier = Modifier
        .fillMaxWidth()
        .height(40.dp)
        .background(Color(0xFFFF0000)),
    contentAlignment = Alignment.Center
) {
    BasicTextField(
        value = searchText,
        onValueChange = { searchText = it },
        modifier = Modifier
            .padding(horizontal = 10.dp)
            .background(Color.White, CircleShape)
            .height(30.dp)
            .fillMaxWidth(),
        decorationBox = { innerTextField ->
                         Row(
                             verticalAlignment = Alignment.CenterVertically,
                             modifier = Modifier.padding(horizontal = 8.dp)
                         ) {
                             Icon(imageVector = Icons.Filled.Search, contentDescription = null)
                             Box(
                                 modifier = Modifier
                                     .weight(1F)
                                     .padding(horizontal = 5.dp),
                                 contentAlignment = Alignment.CenterStart,
                             ) {
                                 if (searchText.isEmpty()) {
                                     Text("请输入点东西看看", style = TextStyle(color = Color(0, 0, 0, 128)))
                                 }
                                 innerTextField()
                             }
                             if (searchText.isNotEmpty()) {
                                 IconButton(
                                     onClick = { searchText = "" },
                                     modifier = Modifier.size(16.dp)
                                 ) {
                                     Icon(imageVector = Icons.Filled.Close, contentDescription = null)
                                 }
                             }
                         }
                        }
    )
}
```

### KeyboardOptions 键盘属性

```kotlin
class KeyboardOptions constructor(
    // 大写选项：
    // None 无大写，Characters 全部大写，Words 单词首字母大写，Sentences 句子首字母大写
    val capitalization: KeyboardCapitalization = KeyboardCapitalization.None, 
    // 是否开启自动更正
    val autoCorrect: Boolean = true,
    // 键盘类型：
    // Text 普通类型，Ascii ASCII字符类型，Number 数字类型，Phone 电话号码
    // Uri URI类型，Email 邮件地址类型，Password 密码类型，NumberPassword 数字密码类型
    val keyboardType: KeyboardType = KeyboardType.Text,
    // IME动作
    // Default 默认行为，None 不执行任何操作，默认为换行，Go 开始动作，Search 搜索动作
    // Send 发送动作，Previous 上一个，Next 下一步，Done 完成
    val imeAction: ImeAction = ImeAction.Default
) 
```

```kotlin
val text = remember { mutableStateOf("hello") }
TextField(
    value = text.value,
    onValueChange = { text.value = it },
    label = { Text("请输入") },
    maxLines = 2,
    textStyle = TextStyle(color = Color.Blue),
    modifier = Modifier.padding(20.dp),
    keyboardOptions = KeyboardOptions(
        capitalization = KeyboardCapitalization.Characters,
        keyboardType = KeyboardType.Email,
        autoCorrect = true,
        imeAction = ImeAction.Done
    )
)
```

### KeyboardActions IME动作

```kotlin
val context = LocalContext.current
val text = remember { mutableStateOf("hello") }
TextField(
    value = text.value,
    onValueChange = { text.value = it },
    label = { Text("请输入") },
    maxLines = 2,
    textStyle = TextStyle(color = Color.Blue),
    modifier = Modifier.padding(20.dp),
    keyboardOptions = KeyboardOptions(
        capitalization = KeyboardCapitalization.Characters,
        keyboardType = KeyboardType.Email,
        autoCorrect = true,
        imeAction = ImeAction.Search
    ),
    keyboardActions = KeyboardActions(onSearch = {
        Toast.makeText(context, "${text.value} world", Toast.LENGTH_SHORT).show()
    })
)
```



## Icon

### Icon属性

```kotlin
fun Icon(
    imageVector: ImageVector, // 矢量图对象
    contentDescription: String?,
    modifier: Modifier = Modifier,
    tint: Color = LocalContentColor.current.copy(alpha = LocalContentAlpha.current)
)

fun Icon(
    bitmap: ImageBitmap, // 位图对象
    contentDescription: String?,
    modifier: Modifier = Modifier,
    tint: Color = LocalContentColor.current.copy(alpha = LocalContentAlpha.current)
)

fun Icon(
    painter: Painter, // 画笔，可以在Canvas上绘制
    contentDescription: String?,
    modifier: Modifier = Modifier,
    tint: Color = LocalContentColor.current.copy(alpha = LocalContentAlpha.current)
) 
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/3dd9deadcb084df39cc95295a4f18935.png)

```kotlin
Icon(
    imageVector = ImageVector.vectorResource(id = R.drawable.ic_search),
    contentDescription = "矢量图资源"
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    bitmap = ImageBitmap.imageResource(id = R.drawable.img),
    contentDescription = "图片资源",
    modifier = Modifier.size(100.dp, 100.dp)
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    painter = painterResource(id = R.drawable.ic_search),
    contentDescription = "任意类型图资源"
)
```

### Icon五种类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e13583b8660a4c749aec3452bc608c46.png)

```kotlin
Icon(
    imageVector = Icons.Filled.ShoppingCart,
    contentDescription = "Filled"
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    imageVector = Icons.Outlined.ShoppingCart,
    contentDescription = "Outlined"
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    imageVector = Icons.Rounded.ShoppingCart,
    contentDescription = "Rounded"
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    imageVector = Icons.Sharp.ShoppingCart,
    contentDescription = "Sharp"
)
Spacer(modifier = Modifier.height(10.dp))
Icon(
    imageVector = Icons.TwoTone.ShoppingCart,
    contentDescription = "TwoTone"
)
```



## Image

Compose中的”ImageView“。

和 Icon 一样支持三中图片类型。

### Image属性

```kotlin
@Composable
fun Image(
    painter: Painter,
    contentDescription: String?, // 文字描述
    modifier: Modifier = Modifier, // 修饰符
    alignment: Alignment = Alignment.Center, // 对齐方式
    contentScale: ContentScale = ContentScale.Fit, // 图片缩放模式
    alpha: Float = DefaultAlpha, // 透明度
    colorFilter: ColorFilter? = null // 修改图片
)

@Composable
fun Image(
    bitmap: ImageBitmap, // 位图对象
    contentDescription: String?,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    colorFilter: ColorFilter? = null,
    filterQuality: FilterQuality = DefaultFilterQuality
)

@Composable
fun Image(
    imageVector: ImageVector, // 矢量图对象
    contentDescription: String?,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.Center,
    contentScale: ContentScale = ContentScale.Fit,
    alpha: Float = DefaultAlpha,
    colorFilter: ColorFilter? = null
)
```

### 使用

```kotlin
val context = LocalContext.current
val path = "${context.cacheDir}${File.separator}bg_banner.png"
val bitmap = BitmapFactory.decodeFile(path)
Image(bitmap = bitmap.asImageBitmap(), contentDescription = "位图")
Divider(modifier = Modifier.padding(vertical = 10.dp))
Image(painter = painterResource(id = R.drawable.img), contentDescription = "图片")
Divider(modifier = Modifier.padding(vertical = 10.dp))
Image(
    imageVector = ImageVector.vectorResource(id = R.drawable.ic_search),
    contentDescription = "矢量图"
)
```

### ContentScale 缩放比

```kotlin
@Stable
interface ContentScale {
    // 计算缩放因子
    fun computeScaleFactor(srcSize: Size, dstSize: Size): ScaleFactor

    companion object {
        // 保持图片宽高比，使图片大于或等于目标尺寸
        @Stable
        val Crop 

        // 保持图片宽高比，使图片大于或等于目标尺寸
        @Stable
        val Fit 
        
        // 缩放图片并保持宽高比，使图片高度匹配目标尺寸
        @Stable
        val FillHeight 
        
        // 缩放图片并保持宽高比，使图片宽度匹配目标尺寸
        @Stable
        val FillWidth 
        
        // 如果图片大于目标，则缩放
        @Stable
        val Inside  

        // 不处理
        @Stable
        val None = FixedScale(1.0f)

        // 横向和纵向缩放填充目标尺寸
        @Stable
        val FillBounds
    }
}
```

```kotlin
Image(
    painter = painterResource(id = R.drawable.a),
    contentDescription = null,
    contentScale = ContentScale.Crop,
    modifier = Modifier.fillMaxSize(0.5F)
)
```

### alpha 图片透明度

```kotlin
Image(
    painter = painterResource(id = R.drawable.a),
    contentDescription = null,
    alpha = 0.5F
)
```

### colorFilter 图片着色

```kotlin
@Immutable
class ColorFilter internal constructor(internal val nativeColorFilter: NativeColorFilter) {
    companion object {
        // 使用颜色滤镜
        // 参数一：颜色值，参数二：混合模式
        @Stable
        fun tint(color: Color, blendMode: BlendMode = BlendMode.SrcIn): ColorFilter =
            actualTintColorFilter(color, blendMode)

        // 使用颜色矩阵，用于修改饱和度        
        @Stable
        fun colorMatrix(colorMatrix: ColorMatrix): ColorFilter =
            actualColorMatrixColorFilter(colorMatrix)

        // 模拟灯光效果
        @Stable
        fun lighting(multiply: Color, add: Color): ColorFilter =
            actualLightingColorFilter(multiply, add)
    }
}
```

### 加载网络图片

**添加依赖库：**

coil是一个图片加载库，完全使用Kotlin编写，使用了Kotlin的协程，图片网络请求方式默认为OkHttp。其特点如下：足够快速，它在内存、图片存储、图片采样、Bitmap重用、暂停/取消下载等细节方面都做了大幅优化。

```
 implementation "com.google.accompanist:accompanist-coil:0.15.0"
```

**使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1395850d93ec4c58a47f024a8b67ea93.png)

```kotlin
val painter = rememberImagePainter(
    data = "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
    imageLoader = LocalImageLoader.current
)
Image(
    painter = painter,
    contentDescription = null,
    modifier = Modifier.border(
        1.dp,
        Color.Red,
        shape = RectangleShape
    )
)
```



## Button

Compose中的”Button“。

### Button属性

```kotlin
@Composable
fun Button(
    onClick: () -> Unit, // 点击事件
    modifier: Modifier = Modifier, // 修饰符
    enabled: Boolean = true, // 是否可点击
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }, // 交互流
    elevation: ButtonElevation? = ButtonDefaults.elevation(), // 高度
    shape: Shape = MaterialTheme.shapes.small, // 按钮形状
    border: BorderStroke? = null, // 边框
    colors: ButtonColors = ButtonDefaults.buttonColors(), // 不同状态下颜色
    contentPadding: PaddingValues = ButtonDefaults.ContentPadding, // 内边距
    content: @Composable RowScope.() -> Unit // 内容
)
```

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/894602171db644f298375761164c110a.png)

```kotlin
Button(onClick = { }, shape = RoundedCornerShape(10.dp)) {
    Text("按钮")
}
Spacer(Modifier.height(10.dp))
Button(onClick = { }, shape = RoundedCornerShape(10.dp)) {
    Icon(
        imageVector = Icons.Filled.Done,
        contentDescription = null,
        modifier = Modifier.size(ButtonDefaults.IconSize)
    )
    Spacer(Modifier.size(ButtonDefaults.IconSpacing))
    Text("确定")
}
```

#### colors属性

colors就是用来设置按钮在不同状态下的颜色的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0a11a3a12cee4b0e8f118cdf4ab2accf.png)

```kotlin
Button(
    onClick = { },
    shape = RoundedCornerShape(10.dp),
    colors = ButtonDefaults.buttonColors(
        backgroundColor = Color.Red, // 背景颜色
        contentColor = Color.Green, // 内容颜色
        disabledBackgroundColor = Color.Blue, // 未启用时的背景颜色
        disabledContentColor = Color.Gray // 未启用时的内容颜色
    )
) {
    Text("按钮")
}
```

#### contentPadding属性

contentPadding用于设置内容与容器间的距离。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f556b2f9e37d4ca59cecf014ad18285f.png)

```kotlin
Button(
    onClick = { },
    contentPadding = PaddingValues(20.dp, 10.dp)
) {
    Text("按钮")
}
```

#### interactionSource属性

监听组件状态的事件源，通过它我们可以根据组件状态设置不同的样式，比如按钮按下时什么效果，正常时什么效果，类似传统视图中的Selector。

- interactionSource.collectIsPressedAsState()判断是否按下状态。
- interactionSource.collectIsFocusedAsState()判断是否获取焦点的状态。
- interactionSource.collectIsDraggedAsState()判断是否拖动。

如下例子，默认情况边框是绿色，当处于按下状态时边框变红色。

```kotlin
val interactionSource = remember { MutableInteractionSource() }
val pressState = interactionSource.collectIsPressedAsState() // 是否按下
val borderColor = if (pressState.value) Color.Red else Color.Green

Button(
    onClick = { },
    border = BorderStroke(2.dp, borderColor),
    interactionSource = interactionSource
) {
    Text("按钮")
}
```

### IconButton 图标按钮

IconButton组件实际上只是Button组件的简单封装（一个可点击的图标），它一般用于应用栏中的导航或者其他行为。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7761c78096084d55ba7799febc6df7f0.png)

```kotlin
IconButton(onClick = {}) {
    Icon(Icons.Filled.Favorite, contentDescription = null)
}
```

### FloatingActionButton 悬浮按钮

FloatingActionButton悬浮按钮(FAB)一般代表当前页面的主要行为。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/625673a8c3984ea696398257d4c96c38.png)

```kotlin
FloatingActionButton(onClick = { }) {
    Icon(Icons.Filled.ArrowBack, contentDescription = null)
}
```

### ExtendedFloatingActionButton 文字扩展悬浮按钮

Compose也提供了带有文字扩展的FAB。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2767f75fc6854439bcf25df883fc2d2a.png)

```kotlin
ExtendedFloatingActionButton(
    text = { Text("hello world compose button") },
    icon = { Icon(Icons.Filled.Favorite, null) },
    onClick = { }
)
```



## 选择器组件

### Checkbox

Checkbox 复选框。

#### Checkbox属性

```kotlin
@Composable
fun Checkbox(
    checked: Boolean, // 是否被选中
    onCheckedChange: ((Boolean) -> Unit)?, // 状态变化回调
    modifier: Modifier = Modifier, // 修饰符
    enabled: Boolean = true, // 是否启用
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }, 
    colors: CheckboxColors = CheckboxDefaults.colors() // 颜色组
)
```

#### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/938a9db53d5c4797ba18bdc493854f43.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e1ec21b2d03244289da2bcbd290fd2eb.png)

```kotlin
var checkedState by remember { mutableStateOf(false) }
Checkbox(
    checked = checkedState,
    onCheckedChange = { checkedState = it },
    colors = CheckboxDefaults.colors(checkedColor = Color.Red)
)
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f38ef1240e1e409a9b4d928d8059de2f.png)

```kotlin
val hobbyOptions = remember { mutableStateListOf(false, false, false) }
Row(verticalAlignment = Alignment.CenterVertically) {
    Text("爱好： ")
    Text("足球")
    Checkbox(
        checked = hobbyOptions[0],
        onCheckedChange = { hobbyOptions[0] = it }
    )
    Text("篮球")
    Checkbox(
        checked = hobbyOptions[1],
        onCheckedChange = { hobbyOptions[1] = it }
    )
    Text("乒乓球")
    Checkbox(
        checked = hobbyOptions[2],
        onCheckedChange = { hobbyOptions[2] = it }
    )
}
```

### RadioButton

RadioButton 单选按钮。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f9725899613949b1ac65b878c58dbb64.png)

```kotlin
var sexOption by remember { mutableStateOf(0) }
Row(verticalAlignment = Alignment.CenterVertically) {
    Text("性别： ")
    Text("男")
    RadioButton(selected = sexOption == 0, onClick = { sexOption = 0 })
    Text("女")
    RadioButton(selected = sexOption == 1, onClick = { sexOption = 1 })
}
```

### TriStateCheckbox 

TriStateCheckbox  三态选择框。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/73b007343a954d27beb9f15fcd6238c1.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7326a3696e0c4fa79aaa1f6b655aea05.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8c6d29245c164c9b932319e042de4475.png)

```kotlin
// 子Checkbox状态
val (state, onStateChange) = remember { mutableStateOf(true) }
// 子Checkbox状态
val (state2, onStateChange2) = remember { mutableStateOf(true) }
// 父TriStateCheckbox状态
val parentState = remember(state, state2) {
    if (state && state2) ToggleableState.On// 开
    else if (!state && !state2) ToggleableState.Off // 关
    else ToggleableState.Indeterminate // 不确定
}
val onParentClick = {
    val s = parentState != ToggleableState.On
    onStateChange(s)
    onStateChange2(s)
}

TriStateCheckbox(
    state = parentState,
    onClick = onParentClick,
    colors = CheckboxDefaults.colors(checkedColor = Color.Red)
)
Column(modifier = Modifier.padding(horizontal = 10.dp)) {
    Checkbox(checked = state, onCheckedChange = onStateChange)
    Checkbox(checked = state2, onCheckedChange = onStateChange2)
}
```

### Switch

Switch 单选开关。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/3f2a8ded4b23443191b45693a7457643.png)

```kotlin
var checkedState by remember { mutableStateOf(true) }
Switch(
    checked = checkedState,
    onCheckedChange = { checkedState = it }
)
```

### Slider

Slider 滑竿组件。

类似于Seekbar，适合做音量、亮度等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/9c1b577f22484977958171f5e0f2e84b.png)

```kotlin
var sliderPosition by remember { mutableStateOf(0F) }
val format = "%.1f"
Text("${String.format(format, sliderPosition * 100)}%")
Slider(value = sliderPosition, onValueChange = { sliderPosition = it })
```



## CircularProgressIndicator & LinearProgressIndicator

Compose中的”ProgressBar“。

### 圆形进度条

**简单使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f8edbf36cf644809855b561241f32319.png)

```kotlin
CircularProgressIndicator()
```

**使用属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/22ef579641b8426fab2c437e92506fb8.png)

```kotlin
CircularProgressIndicator(
    modifier = Modifier.size(100.dp),
    color = Color.Red,
    strokeWidth = 10.dp
)
```

**设置进度：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0df5b76f150743cd9eb639522fa9b350.png)

```kotlin
CircularProgressIndicator(
    progress = 0.5F,
    modifier = Modifier.size(100.dp),
    color = Color.Red,
    strokeWidth = 10.dp
)
```

### 条形进度条

**简单使用：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/16f1405f6360453eb7a085ab8debc810.png)

```kotlin
LinearProgressIndicator()
```

**设置进度：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b139f823e8174912ba541d04c3aabc32.png)

```kotlin
LinearProgressIndicator(
    progress = 0.5F,
    color = Color.Red,
    backgroundColor = Color.Blue
)
```

