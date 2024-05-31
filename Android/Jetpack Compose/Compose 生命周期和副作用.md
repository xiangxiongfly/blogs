[toc]

# Compose 生命周期和副作用

## 生命周期

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4b6b280d96c84c6b923cfe59ae838316.png)



- OnActive：添加到视图树。即Composable被首次执行，在视图树上创建对应的节点。
- OnUpdate：重组。Composable跟随重组不断执行，更新视图树上的对应节点。
- OnDispose：从视图树移除。Composable不再被执行，对应节点从视图树上移除。

Composable在角色上更加类似于传统视图的View，所以没有Activity或者Fragment那样的前后台切换的概念，生命周期相对简单。



## 副作用API

副作用(Side-Effects)：指在 Composable 函数中执行的可能会产生外部影响或依赖于外部资源的操作。如，访问数据库、网络请求、文件操作、弹出Toast、保存本地文件、访问远程或本地数据等。

重组可能会造成Composable频繁反复执行，副作用不应该跟随重组反复执行的。

为了处理副作用，Android Compose 提供了一系列副作用API。

### DisposableEffect

DisposableEffect 可以感知 Composable 的 onActive 和 onDispose，允许通过副作用完成一些预处理和收尾处理。

```kotlin
@Composable
fun LifecyclePage() {
    var counter by remember { mutableStateOf(0) }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Counter: ${counter}")
        Row {
            Button(onClick = { counter-- }) {
                Text("-")
            }
            Button(onClick = { counter++ }) {
                Text("+")
            }
        }
    }

    DisposableEffect(Unit) {
        Log.e("TAG", "预处理")
        counter = 100

        onDispose {
            Log.e("TAG", "销毁处理")
        }
    }
}
```

### SideEffect

SideEffect 会在重组成功时执行，不适合处理那些耗时或者异步的副作用逻辑。

```kotlin
@Composable
fun LifecyclePage() {
    var counter by remember { mutableStateOf(0) }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Counter: ${counter}")
        Row {
            Button(onClick = { counter-- }) {
                Text("-")
            }
            Button(onClick = { counter++ }) {
                Text("+")
            }
        }
    }

    SideEffect {
        Log.e("TAG", "hello 重组了")
    }
}
```

### LaunchedEffect

用于异步操作。

当 Composable 进入 OnActive 时，LaunchedEffect 会启动协程执行 block 中的内容，可以在其中启动子协程或者调用挂起函数。当Composable 进入 OnDispose 时，协程会自动取消，因此 LaunchedEffect 不需要实现OnDispose{...}。

```kotlin
@Composable
fun LifecyclePage() {
    var counter by remember { mutableStateOf(0) }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Counter: ${counter}")
        Row {
            Button(onClick = { counter-- }) {
                Text("-")
            }
            Button(onClick = { counter++ }) {
                Text("+")
            }
        }
    }
    
    LaunchedEffect(Unit) {
        async {
            delay(2000L)
            Log.e("TAG", "异步处理")
            counter = 2000
        }
    }
}
```

### rememberCoroutineScope

协程操作。

LaunchedEffect 虽然可以启动协程，但是只能在 Composable 中调用。如果想在非 Composable 中使用协程，如点击事件中，可以使用  rememberCoroutineScope。

rememberCoroutineScope 会返回一个 CoroutineScope，并在 OnDispose 时自动取消。

```kotlin
@Composable
fun LifecyclePage() {
    var counter by remember { mutableStateOf(0) }
    val scope = rememberCoroutineScope()

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Counter: ${counter}")      
        Button(onClick = {
            scope.launch {
                Log.e("TAG", "协程操作")
                counter = 3000
            }
        }) {
            Text("协程操作")
        }
    } 
}
```

### rememberUpdatedState

监听状态最新状态。

rememberUpdatedState的实现就明白其中原理了，其实就是remember和mutableStateOf的组合使用

```kotlin
@Composable
fun LifecyclePage() {
    var counter by remember { mutableStateOf(0) }
    val updateCounter by rememberUpdatedState(newValue = counter)

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Counter: ${counter}")
        Row {
            Button(onClick = { counter-- }) {
                Text("-")
            }
            Button(onClick = { counter++ }) {
                Text("+")
            }
        } 
        Text("监听最新状态：${updateCounter}")
    }
}
```

### snapshotFlow

snapshotFlow 可以把 Compose 的 State 状态对象转成协程的 Flow。

```kotlin
@Composable
fun LifecyclePage() {
    var time by remember { mutableStateOf("${System.currentTimeMillis()}") }
    val flow = snapshotFlow { time }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Button(onClick = {
            time = "${System.currentTimeMillis()}"
        }) {
            Text("更新")
        }
    }

    LaunchedEffect(Unit) {
        flow.collect {
            Log.e("TAG", "snapshotFlow: ${it}")
        }
    }
}

```

### produceState

SideEffect 常用来将Compose的State暴露给外部使用，而produceState则相反，可以将一个外部的数据源转成State。外部数据源可以是一个LiveData或者RxJava这样的可观察数据，也可以是任意普通的数据类型。

```kotlin
data class Person(val name: String, val age: Int, val time: Long)

@Composable
fun MyProduceState() {
    var name by remember { mutableStateOf("小明") }
    var age by remember { mutableStateOf(18) }

    val personState by produceState(
        initialValue = Person(name, age, System.currentTimeMillis()),
        name,
        age
    ) {
        value = Person(name, age, System.currentTimeMillis())
    }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Button(onClick = { name = "小红" }) {
            Text("修改name")
        }
        Button(onClick = { age = 19 }) {
            Text("修改age")
        }
        Text("produceState: ${personState}")
    }
}
```

说明：修改 name 或 age 都会触发 produceState。

### derivedStateOf

derivedStateOf用来将一个或多个State转成另一个State。derivedStateOf{...}的block中可以依赖其他State创建并返回一个DerivedState，当block中依赖的State发生变化时，会更新此DerivedState，依赖此DerivedState的所有Composable会因其变化而重组。

```kotlin
@Composable
fun MyDerivedStateOf() {
    var postList by remember { mutableStateOf(listOf("a", "b", "c", "d", "e")) }
    var keyword by remember { mutableStateOf("") }
    val result by remember {
        derivedStateOf { postList.filter { it.contains(keyword, false) } }
    }
    Text("过滤：${result}")
    Button(onClick = { postList = listOf("1", "2", "3", "4", "5") }) {
        Text("修改List")
    }
    OutlinedTextField(value = keyword, onValueChange = { keyword = it }, label = { Text("请输入") })
}
```

说明：当 postList 或 keyword 方式变化时，derivedStateOf 都会重新计算，result 也就更新了。

