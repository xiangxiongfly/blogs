[TOC]

# Compose 智能重组

## 概述

重组就是系统根据需要使用新数据重新绘制的函数来重新组合，而Compose可以智能地仅重组已更改的组件。



## 重组特性

### 组件任意顺序运行

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

### 组件并行运行

Compose 是并行运行可组合函数来优化重组。

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

重组是乐观的操作，也就是说，Compose预计会在参数再次更改之前完成重组。如果某个参数在重组完成之前发生更改，Compose可能会取消重组，并使用新参数重新开始。取消重组后，Compose会从重组中舍弃界面树。如有任何附带效应依赖于显示的界面，则即使取消了重组操作，也会应用该附带效应。这可能会导致应用状态不一致。所以我们应该确保所有可组合函数和lambda都幂等且没有附带效应，以处理乐观的重组。