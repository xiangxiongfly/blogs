[TOC]

# Jetpack LiveData

## 概述

LiveData是一种可观察的数据存储器类。与常规的可观察类不同，LiveData 具有生命周期感知能力，意指它遵循其他应用组件（如 activity、fragment 或 service）的生命周期。这种感知能力可确保 LiveData 仅更新处于活跃生命周期状态的应用组件观察者。

 如果观察者（由 [`Observer`](https://developer.android.google.cn/reference/androidx/lifecycle/Observer?hl=zh-cn) 类表示）的生命周期处于 [`STARTED`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle.State?hl=zh-cn#STARTED) 或 [`RESUMED`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle.State?hl=zh-cn#RESUMED) 状态，则 LiveData 会认为该观察者处于活跃状态。LiveData 只会将更新通知给活跃的观察者。为观察 [`LiveData`](https://developer.android.google.cn/reference/androidx/lifecycle/LiveData?hl=zh-cn) 对象而注册的非活跃观察者不会收到更改通知。

您可以注册与实现 [`LifecycleOwner`](https://developer.android.google.cn/reference/androidx/lifecycle/LifecycleOwner?hl=zh-cn) 接口的对象配对的观察者。有了这种关系，当相应的 [`Lifecycle`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle?hl=zh-cn) 对象的状态变为 [`DESTROYED`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle.State?hl=zh-cn#DESTROYED) 时，便可移除此观察者。这对于 activity 和 fragment 特别有用，因为它们可以放心地观察 [`LiveData`](https://developer.android.google.cn/reference/androidx/lifecycle/LiveData?hl=zh-cn) 对象，而不必担心泄露（当 activity 和 fragment 的生命周期被销毁时，系统会立即退订它们）。



## LiveData优点

**确保界面符合数据状态**

LiveData 遵循观察者模式。当底层数据发生变化时，LiveData 会通知 [`Observer`](https://developer.android.google.cn/reference/androidx/lifecycle/Observer?hl=zh-cn) 对象。您可以整合代码以在这些 `Observer` 对象中更新界面。这样一来，您无需在每次应用数据发生变化时更新界面，因为观察者会替您完成更新。

**不会发生内存泄漏**

观察者会绑定到 [`Lifecycle`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle?hl=zh-cn) 对象，并在其关联的生命周期遭到销毁后进行自我清理。

**不会因 Activity 停止而导致崩溃**

如果观察者的生命周期处于非活跃状态（如返回堆栈中的 activity），它便不会接收任何 LiveData 事件。

**不再需要手动处理生命周期**

界面组件只是观察相关数据，不会停止或恢复观察。LiveData 将自动管理所有这些操作，因为它在观察时可以感知相关的生命周期状态变化。

**数据始终保持最新状态**

如果生命周期变为非活跃状态，它会在再次变为活跃状态时接收最新的数据。例如，曾经在后台的 Activity 会在返回前台后立即接收最新的数据。

**适当的配置更改**

如果由于配置更改（如设备旋转）而重新创建了 activity 或 fragment，它会立即接收最新的可用数据。

**共享资源**

您可以使用单例模式扩展 [`LiveData`](https://developer.android.google.cn/reference/androidx/lifecycle/LiveData?hl=zh-cn) 对象以封装系统服务，以便在应用中共享它们。`LiveData` 对象连接到系统服务一次，然后需要相应资源的任何观察者只需观察 `LiveData` 对象。



## 基本使用

### 创建LiveData对象

```kotlin
class SimpleViewModel : ViewModel() {
    //创建LiveData对象
    val liveData: MutableLiveData<String> by lazy {
        MutableLiveData<String>()
    }
}
```

### 创建观察者对象

```kotlin
val observer = object : Observer<String> {
    override fun onChanged(t: String?) {
        name.text = t
    }
}
```

### 注册察

```kotlin
class LiveDataSimpleActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_data_simple)
        //观察LiveData对象
        viewModel.liveData.observe(this, observer)
    }
}
```

### 发送消息

```kotlin
//UI线程发送消息
viewModel.liveData.setValue("hello world") 

//子线程发送消息
viewModel.liveData.postValue("hello world")
```

**说明**

- LiveData对象调用`observe()`方法后，系统会立即调用`onChanged()`方法。



## 活跃状态与非活跃状态

观察者只有在活跃状态时，LiveData才会发送数据。

```kotlin
class LiveDataSimpleActivity : BaseActivity() {
    private val viewModel: SimpleViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_data_simple)
        val name: TextView = findViewById(R.id.name)

        //创建观察者对象
        val observer = object : Observer<String> {
            override fun onChanged(t: String?) {
                Log.e(LIVEDATA, "onChanged: $t")
                name.text = t
            }
        }

        //观察LiveData对象
        viewModel.liveData.observe(this, observer)

        viewModel.liveData.setValue("onCreate") //非活跃状态，不会通知观察者
    }

    override fun onStart() {
        super.onStart()
        viewModel.liveData.setValue("onStart") //活跃状态，会通知观察者
    }

    override fun onResume() {
        super.onResume()
        viewModel.liveData.setValue("onResume") //活跃状态，会通知观察者
    }

    override fun onPause() {
        super.onPause()
        viewModel.liveData.setValue("onPause") //活跃状态，会通知观察者
    }

    override fun onStop() {
        super.onStop()
        viewModel.liveData.setValue("onStop") //非活跃状态，不会通知观察者
    }

    override fun onDestroy() {
        super.onDestroy()
        viewModel.liveData.setValue("onDestroy") //非活跃状态，不会通知观察者
    }
}
```



## LiveData转换

### Transformations#map() 

修改LiveData发送的消息。

```kotlin
val userLiveData = MutableLiveData<User>()
val mapLiveData = Transformations.map(userLiveData, object : Function<User, String> {
    override fun apply(user: User): String {
        val userString = "id:${user.id} 姓名:${user.name} 年龄:${user.age} 地址:${user.address}"
        Log.e(LIVEDATA, userString)
        return userString
    }
})
mapLiveData.observe(this, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e(LIVEDATA, "结果：$t")
    }
})
userLiveData.value = User(1, "小明", 19, "北京市")
```

```
apply: hello LiveData
onChanged: hello LiveData
```



### Transformations#switchMap() 

根据判断条件切换不同的LiveData。

```kotlin
val liveData1 = MutableLiveData<String>()
val liveData2 = MutableLiveData<String>()
val switchLiveData = MutableLiveData<Boolean>()
val resultLiveData = Transformations.switchMap(
    switchLiveData,
    object : Function<Boolean, LiveData<String>> {
        override fun apply(input: Boolean): LiveData<String> {
            if (input) {
                return liveData1
            } else {
                return liveData2
            }
        }
    })
resultLiveData.observe(this, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e(LIVEDATA, "onChanged:$t")
    }
})
liveData1.value = "123"
liveData2.value = "ABC"
switchLiveData.value = false
```

```
onChanged:ABC
```



### MediatorLiveData#addSource() 

观察多个数据。

```kotlin
val mediatorLiveData = MediatorLiveData<String>()
val liveData1 = MutableLiveData<String>()
val liveData2 = MutableLiveData<String>()
mediatorLiveData.addSource(liveData1, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e(LIVEDATA, "onChanged liveData1:$t")
        mediatorLiveData.value = t
    }
})
mediatorLiveData.addSource(liveData2, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e(LIVEDATA, "onChanged liveData2:$t")
        mediatorLiveData.value = t
    }
})
mediatorLiveData.observe(this, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e(LIVEDATA, "onChanged mediatorLiveData:$t")
    }
})
//        liveData1.value="123"
liveData2.value = "ABC"
```

```
onChanged liveData2:ABC
onChanged mediatorLiveData:ABC
```



## hasObservers()

判断LiveData是否有观察者。



## observeForever()

如果想让数据监测变化不受活动状态的影响，可以使用`observeForever`方法，这样Activity即使不处于活动状态，也可以接收到改变的数据，但当Activity销毁时，一定要主动调用`removeObserver`方法，否则LiveData会一直存在，这会导致内存泄漏。



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/jetpack/src/main/java/com/example/jetpack/livedata)

