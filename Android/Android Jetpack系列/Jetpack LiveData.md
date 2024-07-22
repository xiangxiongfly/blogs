[TOC]

# Jetpack LiveData

## 概述

LiveData是一种可观察的数据存储器类，它具有生命周期感知能力，可确保LiveData仅更新处于活跃生命周期的应用组件观察者。

[官网](https://developer.android.google.cn/topic/libraries/architecture/livedata?hl=en)



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



## 添加依赖库

```
implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.2.0'
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.2.0'
```



## 使用

### 简单使用

**创建LiveData：**

```kotlin
class SimpleViewModel : ViewModel() {
    private val _liveData by lazy { MutableLiveData<String>() }
    val liveData: LiveData<String> = _liveData
}
```

**监听：**

```kotlin
viewModel.liveData.observe(this, object : Observer<String> {
    override fun onChanged(t: String) {
        tvMessage.text = t
    }
})
```

**发送消息：**

```kotlin
// 发送UI线程消息
_liveData.setValue(message)
```

```kotlin
// 发送子线程消息
_liveData.postValue(message)
```

### 活跃状态与非活跃状态

观察者只有在活跃状态时，LiveData才会发送数据。

如果观察者的生命周期处于 [`STARTED`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle.State?hl=zh-cn#STARTED) 或 [`RESUMED`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle.State?hl=zh-cn#RESUMED) 状态，则 LiveData 会认为该观察者处于活跃状态。

```kotlin
package com.example.livedatademo.simple

import android.os.Bundle
import android.util.Log
import android.widget.TextView
import androidx.activity.viewModels
import androidx.lifecycle.Observer
import com.example.common.base.BaseActivity
import com.example.livedatademo.R
import kotlin.concurrent.thread

class SimpleActivity : BaseActivity() {
    private val viewModel by viewModels<SimpleViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple)
        val tvMessage = findViewById<TextView>(R.id.tv_message)      

        viewModel.liveData.observe(this, object : Observer<String> {
            override fun onChanged(t: String) {
                Log.e("TAG", "onChanged:${t}")
                tvMessage.text = t
            }
        })
        viewModel.sendMessageInUI("onCreate")
    }

    override fun onStart() {
        super.onStart()
        viewModel.sendMessageInUI("onStart")
    }

    override fun onResume() {
        super.onResume()
        viewModel.sendMessageInUI("onResume")
    }

    override fun onRestart() {
        super.onRestart()
        viewModel.sendMessageInUI("onRestart")
    }

    override fun onPause() {
        super.onPause()
        viewModel.sendMessageInUI("onPause")
    }

    override fun onStop() {
        super.onStop()
        viewModel.sendMessageInUI("onStop")
    }

    override fun onDestroy() {
        super.onDestroy()
        viewModel.sendMessageInUI("onDestroy")
    }
}
```

```
onChanged:onStart
onChanged:onResume
onChanged:onPause
```

### 其他

#### Transformations#map() 

修改LiveData发送的消息。

```kotlin
val userLiveData = MutableLiveData<User>()
val mapLiveData = Transformations.map(userLiveData, object : Function<User, String> {
    override fun apply(user: User): String {
        return "姓名：${user.name} 年龄：${user.age} 地址：${user.address}"
    }
})
mapLiveData.observe(this, { t ->
                           Log.e("TAG", "${t}")
                          })
userLiveData.value = User("小明", 18, "上海市")
```

```
姓名：小明 年龄：18 地址：上海市
```

#### Transformations#switchMap() 

根据不同条件切换不同的LiveData。

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
        Log.e("TAG", "onChanged:$t")
    }
})
switchLiveData.value = false
liveData1.value = "123"
liveData2.value = "ABC"
```

```
ABC
```

#### MediatorLiveData#addSource() 

[`MediatorLiveData`](https://developer.android.google.cn/reference/androidx/lifecycle/MediatorLiveData?hl=zh-cn) 是 [`LiveData`](https://developer.android.google.cn/reference/androidx/lifecycle/LiveData?hl=zh-cn) 的子类，允许您合并多个 LiveData 源。只要任何原始的 LiveData 源对象发生更改，就会触发 `MediatorLiveData` 对象的观察者。

```kotlin
val mediatorLiveData = MediatorLiveData<String>()
val liveData1 = MutableLiveData<String>()
val liveData2 = MutableLiveData<String>()
mediatorLiveData.addSource(liveData1, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e("TAG", "onChanged liveData1:$t")
        mediatorLiveData.value = t
    }
})
mediatorLiveData.addSource(liveData2, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e("TAG", "onChanged liveData2:$t")
        mediatorLiveData.value = t
    }
})
mediatorLiveData.observe(this, object : Observer<String> {
    override fun onChanged(t: String?) {
        Log.e("TAG", "onChanged mediatorLiveData:$t")
    }
})
liveData1.value = "123"
liveData2.value = "ABC"
```

```
onChanged liveData1:123
onChanged mediatorLiveData:123
onChanged liveData2:ABC
onChanged mediatorLiveData:ABC
```

### 扩展LiveData

当 LiveData 对象具有Active状态的观察者时调用onActive方法，应该在onActive方法中开始观察数据的更新。当 LiveData 对象没有任何Active状态的观察者时调用onInactive方法。

```kotlin
class StockManager {
    private val list = Collections.synchronizedList(arrayListOf<UpdateListener>())
    private var isStop = AtomicBoolean(false)

    fun start() {
        isStop.set(false)
        thread {
            while (!isStop.get() && list.size > 0) {
                for (i in list) {
                    i.onUpdate(System.currentTimeMillis().toString())
                }
                Thread.sleep(1000L)
            }
        }
    }

    fun stop() {
        isStop.set(true)
    }

    fun registerUpdates(listener: UpdateListener) {
        list.add(listener)
    }

    fun unregisterUpdates(listener: UpdateListener) {
        list.remove(listener)
    }
}

interface UpdateListener {
    fun onUpdate(price: String)
}
```

```kotlin
class StockLiveData : LiveData<String>() {
    private val stockManager = StockManager()

    companion object {
        private var instance: StockLiveData? = null
        fun get(): StockLiveData {
            if (instance == null) {
                instance = StockLiveData()
            }
            return instance!!
        }
    }

    private val listener = object : UpdateListener {
        override fun onUpdate(time: String) {
            postValue(time)
        }
    }

    override fun onActive() {
        super.onActive()
        Log.e("TAG", "onActive")
        stockManager.registerUpdates(listener)
        stockManager.start()
    }

    override fun onInactive() {
        super.onInactive()
        Log.e("TAG", "onInactive")
        stockManager.unregisterUpdates(listener)
        stockManager.stop()
    }
}
```

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    StockLiveData.get().observe(this, object : Observer<String> {
        override fun onChanged(t: String) {
            Log.e("TAG", "StockLiveData: ${t}")
        }
    })
}
```



## hasObservers()

判断LiveData是否有观察者。



## observeForever()

如果想让数据监测变化不受活动状态的影响，可以使用`observeForever`方法，这样Activity即使不处于活动状态，也可以接收到改变的数据，但当Activity销毁时，一定要主动调用`removeObserver`方法，否则LiveData会一直存在，这会导致内存泄漏。



## [LiveData源码分析](https://blog.csdn.net/qq_14876133/article/details/127736084)

