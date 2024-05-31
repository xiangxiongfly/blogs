[toc]

# Compose CompositionLocal

## 概述

Compose 提供了 CompostionLocal 用来完成 composable 树中共享数据方式。CompositionLocals 是具有层级的，可以被限定在以某个 composable 作为根结点的子树中，其默认会向下传递的，当然当前子树中的某个 composable 可以对该 CompositionLocals 进行覆盖，从而使得新值会在这个 composable 中继续向下传递。



## 使用

### compositionLocalOf

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4c1a14b322b0481b82e08678bb3d3fc4.png)

```kotlin
val localString = compositionLocalOf { "Hello Compose" }
Column {
    Text("${localString.current}", color = Color.Red)
    CompositionLocalProvider(localString provides "hello world") {
        Text("${localString.current}", color = Color.Green)
        CompositionLocalProvider(localString provides "hello android") {
            Text("${localString.current}", color = Color.Blue)
        }
    }
    Text("${localString.current}", color = Color.Red)
}
```

说明：所有 composable 组件都依赖的是同一个 CompositionLocal，而其获得到的实际的值却是不一样的。

### staticCompositionLocalOf 和 compositionLocalOf

```kotlin
var isStatic = false
val title: String
val localColor = if (isStatic) {
    title = "staticCompositionLocalOf"
    staticCompositionLocalOf { Color.Black }
} else {
    title = "compositionLocalOf"
    compositionLocalOf { Color.Black }
}
var message = "init"

@Preview
@Composable
fun MyCompositionLocal2() {
    var color by remember { mutableStateOf(Color.Green) }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(" ${title}")
        VerticalSpacer(10.dp)
        CompositionLocalProvider(localColor provides color) {
            MyBox("外层：${message}", 300.dp, Color.Red) {
                MyBox("中层：${message}", 200.dp, localColor.current) {
                    MyBox("内层：${message}", 100.dp, Color.Magenta) {

                    }
                }
            }
        }
        Button(onClick = {
            color = Color.Yellow
            message = "recompose"
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

**compositionLocalOf场景：**

仅依赖CompositionLocal的地方发生重组了。

修改前：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/50ac0357d6dc4a5a96c0a9298c937109.png)

修改后：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5227586658d14283bbd447c5cf68830d.png)

**staticCompositionLocalOf场景：**

staticCompositionLocalOf 作用域内的都发生重组了。

修改前：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/c32309a437204135b793e62a2fc4c313.png)

修改后：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/8f72b4f4b2e2495e8ba107672921694e.png)

## 总结

-  `compositionLocalOf`，实际上创建了个 `DynamicProvidableCompositionLocal` 实例，当其所提供的值改变时，仅会导致 CompositionLocalProvide 内部依赖当前 CompositionLocal 的 composable 触发重组(recompose)。
-  `staticCompositionLocalOf` 时，实际上创建了个`StaticProvidableCompositionLocal` 实例，当其所提供的值改变时，会导致 CompositionLocalProvide 内部所有 composable 触发重组(recompose)。

