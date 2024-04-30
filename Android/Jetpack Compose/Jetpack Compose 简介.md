[toc]

# Jetpack Compose简介

## 概述

Jetpack Compose是谷歌推出的全新Android UI开发框架，它采用更为先进的声明式开发思想，极大地提升了应用界面的开发效率，Compose代码与基于Android View系统的传统代码可以共存。



## 声明式UI和命令式UI

- **命令式**用命令的方式告诉计算机如何去做事情(how to do)，计算机通过执行命令达到结果。
- **声明式**直接告诉计算机用户想要的结果(what to do)，计算机自己去想该怎么做。

Android View 属于命令式的编程范式，使用 XML 定义的布局是静态的，无法根据响应状态自行更新。开发者需要通过 findViewById 等获取视图对象，然后通过命令式的代码调用对象方法驱动UI变更；而 Jetpack Compose 采用声明式编程范式，开发者只需要根据状态描述UI，当状态变化时，UI会自动更新。



## Jetpack Compose和Android View对比

**Android View劣势：**

- 代码臃肿：View.java本身也变得越发臃肿，目前已超过三万行，早已不堪重负。臃肿的父类视图控件也造成了子类视图功能的不合理。以最常见的Button类为例，为了能让按钮具备显示文字的功能，Button被设计成了继承自TextView的子类：这显然是不合理的。
- 兼容性差：像Button这类基础控件只能跟随系统的升级而更新，即使发现了问题也得不到及时修复，长期下来积重难返，破窗效应也越发突出。如今很多新的视图组件都以Jetpack扩展库的形式单独发布，目的也是为了不受系统版本的制约。

**Jetpack Compose优势：**

- 先进的开发范式：Compose采用声明式的开发范式，开发者只需要聚焦在对UI界面的描述上，当需要渲染的数据发生变化时，框架将自动完成UI刷新。
- 直观易用的API：基于Kotlin DSL打造的API紧贴函数式编程思想，相对于传统的视图开发方式，代码效率更高，实现同样的功能只需要以前一半的代码量。
- 良好的兼容性：Compose代码与基于Android View系统的传统代码可以共存，用户可以按照喜欢的节奏将既有代码逐步过渡到Compose。
- 广泛的适用性：Compose最低兼容到API 21，支持市面上绝大多数手机设备的使用；Jetpack以及各种常用三方库也都第一时间与Compose进行了适配。

| Android View                 | Jetpack Compose                    |
| ---------------------------- | ---------------------------------- |
| 类职责不单一，继承关系不合理 | 函数声式编程，规避了面向对象的弊病 |
| 依赖系统版本，问题修复不及时 | 独立迭代，良好的系统兼容性         |
| 命令式编程，开发效率低下     | 声明式编程，DSL开发效率高          |



## Compose API设计原则

### 一切皆为函数

Compose 声明式UI的基础是 Composable 函数，Composable 函数通过多级嵌套形成结构化的函数调用链，函数调用链经过运行后生成UI视图树；视图树一旦生成后不能随意改变，视图的刷新依靠 Composable 函数的反复执行实现。

说明：Kotlin编码规范中要求函数的首字母小写，但是 Compose 推荐 Composable 使用首字母大写的名词来命名，且不允许有返回值。这样在DSL中书写时可读性更好。有的 Composable 函数并不代表UI组件，此时可以遵循一般的函数命名规范。

### 组合优于继承

Android View 中的所有组件都直接或间接继承自 View 类，处于末端的子 View 会继承很多无用的功能。反观 Jetpack Compose，Composable 作为函数相互间没有继承关系，有利于促使开发者使用组合的视角思考问题。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/02791e6ba0484006b45eda8e5f189d44.png)

### 单一数据源

传统的 Android View 中的 EditText，它的文字变化可能来自用户的输入，也有可能来自 setText() 方法，也就是所谓的多数据源，数据的变化不容易跟踪。而 Compose 则是数据是自上而下的单向流动，事件是自下而上传递。



## Jetpack Compose和Android View关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/43de17c90b394b0882a2885a015e6bb2.jpeg)

- Android View 是由 View 和 ViewGroup构成视图树。
- Compose 是由 LayoutNode 构成视图树。ComposeView 继承自 AbstractComposeView，ComposeView 负责对Android平台的Activity窗口的适配，AndroidComposeView 负责连接LayoutNode视图系统与View视图系统。



## 使用Compose

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAndroidComposeTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background
                ) {
                    Greeting("Android")
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    MyAndroidComposeTheme {
        Greeting("Android")
    }
}
```

使用 setContent() 方法替代以前的 setContentView() 方法。

### setContent()源码

```kotlin
public fun ComponentActivity.setContent(
    parent: CompositionContext? = null,
    content: @Composable () -> Unit
) {
    val existingComposeView = window.decorView
        .findViewById<ViewGroup>(android.R.id.content)
        .getChildAt(0) as? ComposeView

    if (existingComposeView != null) with(existingComposeView) {
        setParentCompositionContext(parent)
        setContent(content)
    } else ComposeView(this).apply {
        // Set content and parent **before** setContentView
        // to have ComposeView create the composition on attach
        setParentCompositionContext(parent)
        setContent(content)
        // Set the view tree owners before setting the content view so that the inflation process
        // and attach listeners will see them already present
        setOwners()
        setContentView(this, DefaultActivityContentLayoutParams)
    }
}
```

说明：setContent() 方法是 ComponentActivity 的一个扩展方法，通过Activity中的Window的DecorView获取到ContentView根布局，接着将 ContentView 的第一个子元素强转为 ComposeView，ComposeView 如果不存在则创建，然后通过 setContent() 给 ComposeView 设置内容，最后调用 setContentView()。

### @Composable

@Composable 注解表示可组合函数，表示告知 Compose 编译器将该函数转换为界面。

### @Preview

@Preview 注解表示可以在Android Studio中快速预览这些可组合函数的渲染结果，无需在设备或模拟器上运行应用。

```kotlin
annotation class Preview(
    val name: String = "",  // 名字
    val group: String = "",  // 分组
    @IntRange(from = 1) val apiLevel: Int = -1,  // API的等级
    val widthDp: Int = -1,  // 宽度
    val heightDp: Int = -1,  // 高度
    val locale: String = "",  // 语言设定
    @FloatRange(from = 0.01) val fontScale: Float = 1f, // 字体缩放比
    val showSystemUi: Boolean = false,  // 是否显示设备的状态栏和操作栏
    val showBackground: Boolean = false, // 是否显示背景
    val backgroundColor: Long = 0, // 背景颜色设置
    @UiMode val uiMode: Int = 0, // UI模式，比如深色模式
    @Device val device: String = Devices.DEFAULT  // 要在预览中使用的设备
)
```

**使用：**

```kotlin
@Preview(name = "测试", widthDp = 100, heightDp = 200, showBackground = true)
@Composable
fun DefaultPreview() {
    Greeting("Compose")
}
```

