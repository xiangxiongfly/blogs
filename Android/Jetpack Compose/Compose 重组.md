[TOC]

# Compose 重组

## 概述

组合阶段用于生成并维护 LayoutNode 视图树，当使用 Activity 中的 setContent() 时，会开始首次组合，这时执行的代码中的所有 Composable 函数体都会生成与之对应的 LayoutNode 视图树。同样，传统 View 体系也是在 setContentView() 中首次构建 View 视图树。

在 Compose 中如果 Composable 函数中依赖了可变状态，当该状态发生变更时，会触发当前 Composable 进行重组，在当前组件发生重组时，子Composable也会被依次重新调用：

- 子 Composable 会将输入参数与重组前的参数做比较，如果参数变化，则 Composable 会进行重组，更新LayoutNode 视图树上对应节点，UI发生更新；如果参数无变化，则跳过本次执行，也就是智能重组，UI无变化。
- 如果子 Composable 在重组中没有被再次调用，则对应的节点以及子节点会从 LayoutNode 视图树中被移除，UI从屏幕移除。

重组可以自动维护 LayoutNode 视图树，使其永远保持最新的视图状态。而传统的 View 体系，则只能对 ViewGroup 进行 add/remove 等操作维护View视图树，这是两种视图体系的区别。



## 重组特性

### 组件会按任意顺序运行

```kotlin
@Composable
fun Bottom() {
    MyList {
        MyOne()
        MyTwo()
        MyThree()
    }
}
```

组件 MyOne/MyTwo/MyThree 的执行顺序是任意，各组件之间是独立的。

在一个Box布局中处于前景的UI具有较高的优先级，因此Composable会根据优先级来执行，这与代码中出现的位置可能并不一致。

### 组件并行运行

重组中的Composable并不一定执行在UI线程，它们可能在后台线程池中并行执行，这有利于发挥多核处理器的性能优势。但是由于多个Composable在同一时间可能执行在不同线程，此时必须考虑线程安全问题。

```kotlin
@Composable
fun MyList(list: List<String>) {
    Row(horizontalArrangement = Arrangement.SpaceBetween) {
        Column {
            for (item in list) {
                Text("Item: ${item}")
            }
        }
        Text("Count: ${list.size}")
    }
}
```

**错误：**

```kotlin
@Composable
fun MyListWithBug(list: List<String>) {
    var count = 0
    Row(horizontalArrangement = Arrangement.SpaceBetween) {
        Column {
            for (item in list) {
                Text("Item: ${item}")
                count++
            }
        }
        Text("Count: ${count}")
    }
}
```

这是一个错误案例，每次重组时都会修改count值，同时count值不能准确显示。

### 重组更新部分组件

Compose 只重组需要更新的部分。

```kotlin
@Composable
fun NamePicker(header: String, names: List<String>, onNameClicked: (String) -> Unit) {
    Column {
        Text(header, style = MaterialTheme.typography.h5)
        Divider() // 分割线
        LazyColumn(modifier = Modifier.fillMaxSize()) {  // 类似于RecyclerView，后续章节会讲
            items(names) { name ->
                NamePickerItem(name, onNameClicked)
            }
        }
    }
}

@Composable
private fun NamePickerItem(name: String, onClicked: (String) -> Unit) {
    Text(name, Modifier.clickable(onClick = { onClicked(name) }))
}
```

当header值发生变化时，Compose会进行重组，但是name值没有发生变化所以 NamePickerItem 组件和 Divider 组件不会被重组。

### 重组是乐观操作

所谓“乐观”是指Composable最终总会依据最新的状态正确地完成重组。在某些场景下，状态可能会连续变化，这可能会导致中间态的重组在执行中被打断，新的重组会插入进来。对于被打断的重组，Compose不会将执行一般的重组结果反应到视图树上，因为它知道最后一次状态总归是正确的，因此中间状态丢弃也没关系。



## 重组作用域

重组是智能的，会尽可能跳过不必要的重组。

```kotlin
@Composable
fun RecomposePage() {
    Log.e("TAG", "Scope-1 run")
    var counter by remember { mutableStateOf(0) }
    Column {
        Log.e("TAG", "Scope-2 run")
        Button(onClick = run {
            Log.e("TAG", "Button Scope")
            return@run {
                counter++
            }
        }) {
            Log.e("TAG", "Scope-4 run")
            Text("hello")
        }
        Text("$counter")
    }
}
```

点击按钮后输出：

```
Scope-1 run
Scope-2 run
Button Scope
```

经过Compose编译器处理后的Composable代码在对State进行读取的同时，能够自动建立关联，在运行过程中当State变化时，Compose会找到关联的代码块标记为Invalid。在下一渲染帧到来之前，Compose会触发重组并执行invalid代码块，Invalid代码块即下一次重组的范围。能够被标记为Invalid的代码必须是非inline且无返回值的Composable函数或lambda。

说明：Column 是一个 inline 声明的高阶函数，内部 content 也会被展开在调用处，Scope-2与Scope-1共享重组范围，因此“Scope-1 run”日志都会被输出。虽然Button没有依赖counter，但是Scope-2的重组会触发Button的重新调用，所以“Button-onclick”的日志也会输出。虽然Button会重新调用，但是其content内部并没有依赖counter，所以“Scope-3 run”也就不会输出。


