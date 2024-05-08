[toc]

# Compose 状态管理

## 概述

当应用程序的状态发生变化时，Compose会进行重组，重组过程中会运行可能已更改的可组合项以响应状态变化，然后Compose会更新组合以反映所有更改。这就是Compose的工作流程。



## 使用

### 状态

```kotlin
val counter: MutableState<Int> = mutableStateOf(0)
```

这里的 counter 是一个` MutableState<Int> `类型，可以使用 `.value` 进行读写。


```kotlin
// 解构
val (counter: Int, setCounter: (Int) -> Unit) = mutableStateOf(0)
```

这里的 counter 是一个 Int 类型的数据，其他地方可以直接访问，需要更新 counter 时可以使用 setCounter(xx) 完成。

```kotlin
// 属性代理
val counter: Int by mutableStateOf(0)
```

这里的 counter 的读写会通过 getValue 和 setValue这 两个运算符的重写最终代理为对 value 的操作，通过 by 关键字，可以像访问一个普通的Int变量一样对状态进行读写。

### StatelessComposable & StatefulComposable

- StatelessComposable：
  - 无状态组件。
  - 是一个“纯函数”，这类函数不管理任何内部状态，它的输出完全受输入参数影响，参数不变UI就不会变化，StatelessComposable 函数在每次调用时都会重新计算输出，并且不会保留任何中间状态因此Compose编译器针对其进行了优化。
  - StatelesComposable 的重组只能来自上层 Composable 的调用。它适用于那些不需要在不同调用之间保持状态的组件，例如简单的显示文本、图片或按钮等。
- StatefulComposable：
  - 有状态组件。
  - 这类函数管理内部状态，并可以根据状态的变化更新输出。StatefulComposable 函数会在第一次调用时创建一个状态对象，并在后续调用中使用该状态对象来更新输出。
  - StatefulComposable 的重组来自其依赖状态的变化。适用于那些需要在不同调用之间保持状态的组件，例如计数器、开关、滑动条等。

**StatelessComposable：**

```kotlin
@Composable
fun MyTextComponent(text: String) {  
    Text(text = text)
}
```

说明：`MyTextComponent` 是一个 StatelessComposable，它接受一个字符串参数 `text`，并将其显示为文本。

**StatefulComposable：**

```kotlin
@Composable
fun MyCounterComponent() { 
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text(text = "计数器：$count")
    }
}
```

说明：`MyCounterComponent` 是一个 StatefulComposable，它内部使用 `mutableStateOf` 来管理一个整数状态 `count`。当点击按钮时，`count` 会增加 1，并更新计数器的显示。

**总结：**

|              | StatelessComposable        | StatefulComposable |
| ------------ | -------------------------- | ------------------ |
| 状态         | 不管理                     | 管理               |
| 重新渲染条件 | 取决于输入参数             | 取决于状态         |
| 性能         | 性能较好，参数不变，UI不变 |                    |
| 用法         | 无状态的界面组件           | 状态的界面组件     |

### remember

- mutableStateOf() 函数会创建一个 MutableState 类型的对象，MutableState 是可观察类型，在值发生变化的情况下系统会安排重组持有该值的可组合函数。
- remember() 在Composable首次执行时，remember中计算得到的数据会自动缓存，当Composable重组再次执行到remember处会返回之前已缓存的数据，无须重新计算。

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

### 状态提升

状态提升也就是将 Statefule 改造为 Stateless，Stateless 由于不耦合任何业务逻辑，所以功能更加纯粹，相对于 Stateful 的可复用性更好，对测试也更加友好。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/44505e8288d8407ca9c9b5136cd91765.png)

```kotlin
// StatefulComposable
@Composable
fun CounterScreen() {
    var counter by remember { mutableStateOf(0) }
    CounterComponent(
        counter = counter,
        onIncrement = { counter++ },
        onDecrement = {
            if (counter > 0) {
                counter--
            }
        }
    )
}

// StatelessComposable
@Composable
fun CounterComponent(
    counter: Int,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Counter:", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
        Text(
            "$counter",
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Bold
        )
        Row {
            Button(onClick = { onDecrement() }, modifier = Modifier.weight(1F)) {
                Text("-")
            }
            Button(onClick = { onIncrement() }, modifier = Modifier.weight(1F)) {
                Text("+")
            }
        }
    }
}
```

说明：CounterComponent经状态上提后，职责更加单一。

### rememberSaveable

rememberSaveable() 函数可以保证ConfigurationChanged事件发生时（如屏幕旋转等）保存状态，数据会随onSaveInstanceState进行保存。

并在进程或者Activity重建时根据key恢复到对应的Composable中，这个key就是Composable在编译期被确定的唯一标识。因此当用户手动退出应用时，rememberSavable中的数据才会被清空。

rememberSavable实现原理实际上就是将数据以Bundle的形式保存，所以凡是Bundle支持的基本数据类型都可以自动保存。对于一个对象类型，则可以通过添加@Parcelize变为一个Parcelable对象进行保存。

#### 支持parceable

**添加kotlin-parcelize插件：**

```
plugins {
    id 'kotlin-parcelize'
}
```

**使用：**

```kotlin
// 定义数据类
@Parcelize
data class Person(val name: String, val age: Int) : Parcelable

// 使用：
@Composable
fun PersonScreen() {
    var person by rememberSaveable { mutableStateOf(Person("小白", 18)) }
    Button(onClick = { person = Person("小黑", 28) }) {
        Text(person.toString())
    }
}
```

#### 不支持parceable

有的数据结构可能无法添加Parcelable接口，比如定义在三方库的类等，此时可以通过自定义Saver为其实现保存和恢复的逻辑。只需要在调用rememberSavable时传入此Saver。

```kotlin
// 定义数据类
data class People(val name: String, val age: Int)

// 定义Saver
object PersonSaver : Saver<People, Bundle> {
    override fun restore(value: Bundle): People {
        val name = value.getString("name") ?: ""
        val age = value.getInt("age")
        return People(name, age)
    }

    override fun SaverScope.save(value: People): Bundle {
        return Bundle().apply {
            putString("name", value.name)
            putInt("age", value.age)
        }
    }
}

// 使用：
@Composable
fun PeopleScreen() {
    var people by rememberSaveable(stateSaver = PersonSaver) { mutableStateOf(People("小红", 18)) }
    Button(onClick = { people = People("小绿", 28) }) {
        Text(people.toString())
    }
}
```

**支持MapSaver：**

MapSaver将对象转换为 `Map<String, Any>` 的结构进行保存。

```kotlin
data class City(val name: String, val country: String)

// 定义MapSaver
val CitySaver = run {
    val nameKey = "name"
    val countryKey = "country"
    mapSaver(
        save = { mapOf(nameKey to it.name, countryKey to it.country) },
        restore = { City(it[nameKey] as String, it[countryKey] as String) }
    )
}

@Composable
fun CityScreen() {
    var city by rememberSaveable(stateSaver = CitySaver) { mutableStateOf(City("北京", "中国")) }
    Button(onClick = { city = City("东京", "日本") }) {
        Text(city.toString())
    }
}
```

**支持ListSaver：**

ListSaver则是将对象转换为 `List<Any>` 的数据结构进行保存。

```kotlin
val CitySaver2 = listSaver<City, Any>(
    save = { listOf(it.name, it.country) },
    restore = { City(it[0] as String, it[1] as String) }
)
```



## 使用ViewModel

在 Compose 中也可以使用 ViewModel 缓存状态，通过 LiveData 或 Flow 监听变化。

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

说明：通过 observeAsState() 函数观察 LiveData 对象，当 LiveData 发生变化时，该对象都会更新。


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

