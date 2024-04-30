[toc]

# Compose 状态

## 概述

当应用程序的状态发生变化时，Compose会进行重组，重组过程中会运行可能已更改的可组合项以响应状态变化，然后Compose会更新组合以反映所有更改。这就是Compose的工作流程。



## 使用

- mutableStateOf() 函数会创建一个 MutableState 类型的对象，MutableState是可观察类型，在值发生变化的情况下系统会安排重组持有该值的可组合函数。
- remember() 函数可以保证在重组后保持状态。如果没有使用remember()每次重组时系统会将状态重新初始化为默认值。
- rememberSaveable() 函数可以保证配置发生变化后（屏幕旋转等）保存状态。

```kotlin
@Preview
@Composable
fun Test3() {
    val index = remember {
        mutableStateOf(10)
    }
    Column(modifier = Modifier.fillMaxSize()) {
        Button(onClick = {
            index.value++
            Log.e("TAG", "点击了 :${index.value}")
        }) {
            Text("Click")
        }
        Text("${index.value}", fontSize = 30.sp)
    }
}
```

说明：使用 `remember { mutableStateOf() }` 记录状态，当 index 发生变化时，Text显示的值也会跟着发生变化。



## 使用ViewModel

在Compose中也可以使用ViewModel缓存状态，通过LiveData或Flow监听变化。

**添加依赖：**

```
implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:2.5.1'
implementation "androidx.compose.runtime:runtime-livedata:$compose_version"
```

**使用：**

```kotlin
class CountViewModel : ViewModel() {
    private val _count = MutableLiveData(10)
    val count get() = _count

    fun onCountChanged(count: Int) {
        _count.postValue(count)
    }
}
```

```kotlin
@Composable
fun MyCount() {
    val viewModel: CountViewModel = viewModel()
    val count by viewModel.count.observeAsState(0) // 语法糖

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("$count")
        Button(onClick = { viewModel.onCountChanged(count + 2) }) {
            Text("点击")
        }
    }
}
```

说明：通过 observeAsState() 函数观察LiveData对象，当LiveData发生变化时，该对象都会更新。


### ViewModelProvider.Factory

```kotlin
class CountViewModel(defaultCount: Int) : ViewModel() {
    private val _count = MutableLiveData(defaultCount)
    val count get() = _count

    fun onCountChanged(count: Int) {
        _count.postValue(count)
    }
}

class CountViewModelFactory(private val defaultCount: Int) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return CountViewModel(defaultCount) as T
    }
}
```

```kotlin
@Composable
fun MyCount() {
    val viewModel: CountViewModel = viewModel(factory = CountViewModelFactory(100))
    val count by viewModel.count.observeAsState(0)

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("$count")
        Button(onClick = {
            viewModel.onCountChanged( count+ 2) }) {
            Text("点击")
        }
    }
}
```

## 使用Flow

```kotlin
class CountViewModel : ViewModel() {
    private val _countFlow = MutableStateFlow(10)
    val countFlow get() = _countFlow.asStateFlow()

    fun onCountChanged(count: Int) {
        _countFlow.value = count
    }
}
```

```kotlin
@Composable
fun MyCount() {
    val viewModel: CountViewModel = viewModel()
    val count: Int by viewModel.countFlow.collectAsState(0) // 语法糖

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("$count")
        Button(onClick = {
            viewModel.onCountChanged(count + 2)
        }) {
            Text("点击")
        }
    }
}
```



