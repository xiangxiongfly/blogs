[toc]

# Compose 屏幕适配

## 横竖屏适配

在传统的 Android View 中，横屏需要使用 land，竖屏需要使用 port：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/99800f914a5b465f999333cef5c06400.jpeg)

而在 Compose 中完全可用代码编写：

```kotlin
@Composable
fun MyScreen() {
    val config = LocalConfiguration.current
    if (config.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        // 横屏
        LandscapeScreen()
    } else {
        // 竖屏
        PortraitScreen()
    }
}

@Composable
fun LandscapeScreen() {
    Row(
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(3) {
            Text(
                "横屏",
                textAlign = TextAlign.Center,
                fontSize = 50.sp
            )
        }
    }
}

@Composable
fun PortraitScreen() {
    Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        repeat(5) {
            Text(
                "竖屏",
                textAlign = TextAlign.Center,
                fontSize = 50.sp
            )
        }
    }
}
```



## 分辨率适配

需要使用可组合项 BoxWithConstraints 组件。

```kotlin
@Composable
fun MyScreenAdapter() {
    BoxWithConstraints(contentAlignment = Alignment.Center) {
        when {
            minWidth < 360.dp -> {
                Text("小屏")
            }
            minWidth < 480.dp -> {
                Text("中屏")
            }
            minWidth < 720.dp -> {
                Text("大屏")
            }
            else -> {
                Text("其他")
            }
        }
    }
}
```

