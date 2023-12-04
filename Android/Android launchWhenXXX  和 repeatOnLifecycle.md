[TOC]

# Android launchWhenXXX  和 repeatOnLifecycle

## lifecycleScope和viewModelScope

**LiveData优点：**

- 避免内存泄露风险：当 Activity/Fragment 进入 DESTROYED 时，会自动删除 Observer 。
- 节省资源：当 Activity/Fragment 进入活跃状态时才开始接受数据，避免 UI 处于后台时的无效计算。 

**Flow缺点：**

Flow 基于协程实现，具有丰富的操作符，通过这些操作符可以实现线程切换、处理流式数据，相比 LiveData 功能更加强大。 但唯有一点不足，无法像 LiveData 那样感知生命周期。 

**lifecycleScope：**

`lifecycle-runtime-ktx` 库提供了 `lifecycleOwner.lifecycleScope` 扩展，可以在当前 Activity 或 Fragment 销毁时结束此协程，防止泄露。

Flow 也是运行在协程中的，`lifecycleScope` 可以帮助 Flow 解决内存泄露的问题。

添加依赖库：

```
implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.5.0"
implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.0"
implementation "androidx.lifecycle:lifecycle-livedata-ktx:2.5.0"
```

```kotlin
class MyFragment: Fragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewLifecycleOwner.lifecycleScope.launch {
            val params = TextViewCompat.getTextMetricsParams(textView)
            val precomputedText = withContext(Dispatchers.Default) {
                PrecomputedTextCompat.create(longTextContent, params)
            }
            TextViewCompat.setPrecomputedText(textView, precomputedText)
        }
    }
}
```

```kotlin
class MyViewModel: ViewModel() {
    init {
        viewModelScope.launch {
            // Coroutine that will be canceled when the ViewModel is cleared.
        }
    }
}
```

 

## launchWhenXXX

由于 lifecycleScope.launch 会立即启动协程，一直运行到协程销毁，不能监听生命周期。因此`lifecycle-runtime-ktx` 又为我们提供了 `LaunchWhenStarted` 和 `LaunchWhenResumed` 。

**优点：**

launchWhenXXX 会在 XXX 状态前一直等待，又在离开 XXX 状态后挂起协程，lifecycleScope+launchWhenXX的组合使用让 Flow 拥有了生命周期感知能力。

- 避免泄露：当 lifecycleOwner 进入 DESTROYED 时， lifecycleScope 结束协程
- 节省资源：当 lifecycleOwner 进入 STARTED/RESUMED 时 launchWhenX 恢复执行，否则挂起。

**缺点：**

对于 launchWhenXXX 来说， 当 lifecycleOwner 离开 XXX 状态时，协程只是挂起协程而非销毁，如果用这个协程来订阅 Flow，就意味着虽然 Flow 的收集暂停了，但是上游的处理仍在继续，资源浪费的问题解决地不够彻底。 

```kotlin
class MyFragment: Fragment {
    init {
        lifecycleScope.launchWhenStarted {
            try {
                // Call some suspend functions.
            } finally {
                // This line might execute after Lifecycle is DESTROYED.
                if (lifecycle.state >= STARTED) {
                    // Here, since we've checked, it is safe to run any
                    // Fragment transactions.
                }
            }
        }
    }
}
```



## repeatOnLifecycle

lifecycle-runtime-ktx 自 `2.4.0-alpha01` 起，提供了一个新的协程构造器 `lifecyle.repeatOnLifecycle`， 它在离开 X 状态时销毁协程，再进入 X 状态时再启动协程。从其命名上也可以直观地认识这一点，即**围绕某生命周期的进出反复启动新协程**。

```kotlin
class MyFragment : Fragment() {

    val viewModel: MyViewModel by viewModel()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Create a new coroutine in the lifecycleScope
        viewLifecycleOwner.lifecycleScope.launch {
            // repeatOnLifecycle launches the block in a new coroutine every time the
            // lifecycle is in the STARTED state (or above) and cancels it when it's STOPPED.
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                // Trigger the flow and start listening for values.
                // This happens when lifecycle is STARTED and stops
                // collecting when the lifecycle is STOPPED
                viewModel.someDataFlow.collect {
                    // Process item
                }
            }
        }
    }
}
```



## flowWithLifecycle

当我们只有一个 Flow 需要收集时，可以使用 `flowWithLifecycle` 这样一个 Flow 操作符的形式来简化代码。

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    exampleProvider.exampleFlow()
        .flowWithLifecycle(viewLifecycleOwner.lifecycle, Lifecycle.State.STARTED)
        .collect {
            // Process the value.
        }
}
```

**flowWithLifecycle源码：**

本质仍然是对 repeatOnLifecycle 的封装。

```kotlin
public fun <T> Flow<T>.flowWithLifecycle(
    lifecycle: Lifecycle,
    minActiveState: Lifecycle.State = Lifecycle.State.STARTED
): Flow<T> = callbackFlow {
    lifecycle.repeatOnLifecycle(minActiveState) {
        this@flowWithLifecycle.collect {
            send(it)
        }
    }
    close()
}
```



## 总结

![在这里插入图片描述](https://img-blog.csdnimg.cn/bd062793396d4abe9e9f8bdfd5d76dd4.png)





- lifecycleScope.launch：可以在当前 Activity 或 Fragment 销毁时结束此协程，防止泄露。
- launchWhenXXX：可以像 LiveData  那样感知生命周期，但是会挂起协程而非销毁，仍然存储资源浪费问题。
- repeatOnLifecycle：可以感知生命周期变化，进入指定状态后会销毁协程。

