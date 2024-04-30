[toc]

# Compose 使用Navigation

## 概述

Navigation也是Jetpack中的导航库，它可以处理多个Fragment之间的跳转、传值等操作。Navigation专门为Compose做了适配，让我们在Compose中也可以完美地进行页面之间的跳转。



## 添加依赖库

```
implementation "androidx.navigation:navigation-compose:2.5.1"
```



## 使用

### 简单使用

- rememberNavController()：创建NavController对象。
- NavHost()：定义导航。
- composable：将composable添加到NavGraphBuilder。
- NavHostController#navigate()：跳转指定页面。
- NavHostController#navigateUp()：返回上一个页面。

```kotlin
public fun NavHost(
    navController: NavHostController, // 控制器
    startDestination: String, // 默认路径
    modifier: Modifier = Modifier, // 修饰符
    route: String? = null, // 路径
    builder: NavGraphBuilder.() -> Unit
)
```

```kotlin
@Composable
fun BasePage(content: String, navController: NavHostController, handleClick: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(content, fontSize = 35.sp)
        Button(onClick = { handleClick() }) {
            Text("跳转")
        }
        Button(onClick = { navController.navigateUp() }) {
            Text("返回上一个")
        }
    }
}

@Composable
fun OnePage(navController: NavHostController) {
    BasePage("OnePage", navController) {
        navController.navigate("two_page")
    }
}

@Composable
fun TwoPage(navController: NavHostController) {
    BasePage("TwoPage", navController) {
        navController.navigate("three_page")
    }
}

@Composable
fun ThreePage(navController: NavHostController) {
    BasePage("ThreePage", navController) {
        navController.navigate("one_page")
    }
}

@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {
            OnePage(navController)
        }
        composable("two_page") {
            TwoPage(navController)
        }
        composable("three_page") {
            ThreePage(navController)
        }
    }
}
```

### 传递参数

- 定义参数：在NavHost中修改，`composable("two_page/{占位符1}/{占位符2}")`
- 传递参数：`navController.navigate("two_page/参数1/参数2")`
- 获取参数：通过 `NavBackStackEntry.arguments` 提取参数。

```kotlin
@Composable
fun OnePage(navController: NavHostController) {
    BasePage("OnePage", navController) {
        // 传递参数
        navController.navigate("two_page/小明/18")
    }
}

@Composable
fun TwoPage(navController: NavHostController, name: String, age: String) {
    val context = LocalContext.current
    BasePage("TwoPage:${name}-${age}", navController) {
        Toast.makeText(context, "参数：${name}-${age}", Toast.LENGTH_SHORT).show()
    }
}

@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {            
            OnePage(navController)
        }
        composable("two_page/{name}/{age}") {
            // 接收参数
            TwoPage(
                navController,
                it.arguments?.getString("name") ?: "",
                it.arguments?.getString("age") ?: ""
            )
        }
    }
}
```

### 解析参数类型

上面的age其实是Int类型，但是用String类型接收到，不合理。

- 通过 composable 中的 arguments 的 type 定义参数类型。
- 再使用 getInt() 方法接收。

```kotlin
@Composable
fun TwoPage(navController: NavHostController, name: String, age: Int) {
    val context = LocalContext.current
    BasePage("TwoPage:${name}-${age}", navController) {
        Toast.makeText(context, "参数：${name}-${age}", Toast.LENGTH_SHORT).show()
    }
}

@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {
            OnePage(navController)
        }
        composable(
            "two_page/{name}/{age}",
            arguments = listOf(
                navArgument("name") { type = NavType.StringType },
                navArgument("age") { type = NavType.IntType }
            )
        ) {
            // 接收参数
            TwoPage(
                navController,
                it.arguments?.getString("name") ?: "",
                it.arguments?.getInt("age") ?: 0
            )
        }
    }
}
```

### 可选默认值参数

- 传递参数：`two_page?参数1={占位符2}?参数2={占位符2}`。如果有参数则正常获取，如果没有参数则返回默认值
- 定义参数默认值：通过 navArgument 中的 defaultValue 设置默认值。

**默认值：**

```kotlin
@Composable
fun OnePage(navController: NavHostController) {
    BasePage("OnePage", navController) {
        // 传递参数时
        navController.navigate("two_page?name=Tom?age=28")
    }
}

@Composable
fun OnePage(navController: NavHostController) {
    BasePage("OnePage", navController) {
        // 不传递参数时
        navController.navigate("two_page")
    }
}

@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {
            OnePage(navController)
        }
        composable(
            "two_page?name={name}?age={age}",
            arguments = listOf(
                navArgument("name") {
                    type = NavType.StringType
                    defaultValue = "未命名"
                },
                navArgument("age") {
                    type = NavType.IntType
                    defaultValue = 18
                }
            )
        ) {
            // 接收参数
            TwoPage(
                navController,
                it.arguments?.getString("name") ?: "",
                it.arguments?.getInt("age") ?: 0
            )
        }
    }
}
```

### 可选null值参数

- 设置 nullable 为true表示支持null值。

```kotlin
@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {
            Log.e("TAG", "one_page")
            OnePage(navController)
        }
        composable(
            "two_page?name={name}?age={age}",
            arguments = listOf(
                navArgument("name") {
                    nullable = true
                },
                navArgument("age") {
                    nullable = true
                }
            )
        ) {
            // 接收参数
            TwoPage(
                navController,
                it.arguments?.getString("name") ?: "",
                it.arguments?.getString("age") ?: ""
            )
        }
    }
}
```

### 传递对象

传递对象的本质是将对象序列化为字符串，然后在接收字符串反序列化为对象。

```kotlin
data class Person(val name: String, val age: Int)
```

```kotlin
@Composable
fun OnePage(navController: NavHostController) {
    BasePage("OnePage", navController) {
        // 传递参数
        val personJson = Gson().toJson(Person("小黑", 60))
        navController.navigate("two_page?name=Tom?age=28/${personJson}")
    }
}

@Composable
fun TwoPage(navController: NavHostController, name: String, age: Int, person: Person) {
    val context = LocalContext.current
    BasePage("TwoPage:${name}-${age}-${person}", navController) {
        Toast.makeText(context, "参数：${name}-${age}-${person}", Toast.LENGTH_SHORT).show()
    }
}

@Composable
fun MyNavigation() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "one_page"
    ) {
        composable("one_page") {
            OnePage(navController)
        }
        composable(
            "two_page?name={name}?age={age}/{person}",
            arguments = listOf(
                navArgument("name") {
                    type = NavType.StringType
                    defaultValue = "未命名"
                },
                navArgument("age") {
                    type = NavType.StringType
                    defaultValue = "0"
                },
                navArgument("person") {
                    type = NavType.StringType
                }
            )
        ) {
            // 接收参数
            val personJson = it.arguments?.getString("person") ?: ""
            val person = Gson().fromJson(personJson, Person::class.java)
            TwoPage(
                navController,
                it.arguments?.getString("name") ?: "",
                it.arguments?.getInt("age") ?: 0,
                person
            )
        }
    }
}
```

