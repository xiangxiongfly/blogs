[TOC]

# Jetpack ViewModel

## 概述

ViewModel 类目的在于以注重生命周期的方式存储和管理界面相关数据。

ViewModel 可以让数据可在发生屏幕旋转等配置更改后继续留存。

 [官网](https://developer.android.google.cn/topic/libraries/architecture/viewmodel?hl=en)



## 添加依赖库

```groovy
//ktx
implementation "androidx.activity:activity-ktx:1.2.3"
implementation "androidx.fragment:fragment-ktx:1.3.6"

//Lifecycle
def lifecycle_version = "2.5.0"
//LiveData
implementation "androidx.lifecycle:lifecycle-livedata-ktx:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-common-java8:$lifecycle_version"
implementation "androidx.lifecycle:lifecycle-process:$lifecycle_version"
//ViewModel
implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:$lifecycle_version"
```



## ViewModel生命周期

创建 ViewModel 的方法采用的是工厂模式，创建好之后将其缓存在ViewModelStore中。如果当前需要创建的ViewModel对象已经存在，则直接从ViewModelStore中取出。所以在屏幕旋转前后使用的ViewModel是同一个对象。也就是说在创建ViewModel的时候，只要传入的class对象是一样的，那么获取到的ViewModel就是同一个对象。

由于 ViewModel 的生命周期长于 Activity，因此不能将 View 或者 Activity 传递给 ViewModel，否则会引起内存泄露。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210315142343341.png)



## 使用

### 简单使用

**竖屏：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/81f025304e1f4d9abec4ef78fb6bbee0.png)

**横屏：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/e05b5cb75d304ea197fe5fee994bd0ff.png)

**ViewModel类实现**

```kotlin
class MyViewModel : ViewModel() {
    private val _countLiveData = MutableLiveData<Int>()
    val countLiveData = _countLiveData
    private var count = 0

    fun increase() {
        _countLiveData.postValue(++count)
    }

    fun decrease() {
        _countLiveData.postValue(--count)
    }
}
```

**获取ViewModel对象**

```kotlin
// 方式一：
private val viewModel: MyViewModel by lazy {
    ViewModelProvider(this).get(MyViewModel::class.java)
}

// 方式二：
private val viewModel: MyViewModel by viewModels()
```

**在Activity中使用**

```kotlin
class SimpleActivity : BaseActivity() {
    private lateinit var tvOrientation: TextView
    private lateinit var tvCount: TextView

    private val viewModel: MyViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple)
        Log.e("TAG", "onCreate")

        tvOrientation = findViewById(R.id.tv_orientation)
        tvCount = findViewById(R.id.tv_count)

        tvOrientation.text =
            if (resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "竖屏" else "横屏"
        viewModel.countLiveData.observe(this, object : Observer<Int> {
            override fun onChanged(t: Int?) {
                tvCount.text = "${t}"
            }
        })
    }

    fun onIncrease(view: View) {
        viewModel.increase()
    }

    fun onDecrease(view: View) {
        viewModel.decrease()
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.e("TAG", "onDestroy")
    }
}
```

### AndroidViewModel

AndroidViewModel 是 ViewModel 的子类，拥有 Application 的实例，可以访问资源文件。

```kotlin
class MyAndroidViewModel(application: Application) : AndroidViewModel(application) {
    val appContext = application.applicationContext
    private val _countLiveData = MutableLiveData<Int>()
    val countLiveData = _countLiveData
    private var count = 0

    fun increase() {
        Log.e("TAG", "context:${appContext}")
        _countLiveData.postValue(++count)
    }

    fun decrease() {
        _countLiveData.postValue(--count)
    }

    override fun onCleared() {
        super.onCleared()
        Log.e("TAG", "onCleared")
    }
}
```

### ViewModel添加依赖

**定义ViewModel：**

```kotlin
class UserViewModel(private var user: User) : ViewModel() {

    private val _userLiveData = MutableLiveData<User>()
    val userLiveData = _userLiveData

    fun showUser() {
        userLiveData.postValue(user)
    }

    fun changeUser() {
        user = User("小黑", 28, arrayOf<String>("上海市", "浦东区"))
        userLiveData.postValue(user)
    }
}
```

**定义ViewModelFactory：**

```kotlin
class UserViewModelFactory(private val user: User) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(UserViewModel::class.java)) {
            return UserViewModel(user) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

**使用：**

```kotlin
class UserActivity : BaseActivity() {
    private lateinit var tvUser: TextView

    // 获取ViewModel对象，方式一：
    private val viewModel: UserViewModel by lazy {
        val factory = UserViewModelFactory(User("小白", 18, arrayOf("北京市", "朝阳区")))
        ViewModelProvider(this, factory).get(UserViewModel::class.java)
    }

    // 获取ViewModel对象，方式二：
    private val viewModel2: UserViewModel by viewModels {
        UserViewModelFactory(
            User(
                "小白",
                18,
                arrayOf("北京市", "朝阳区")
            )
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        tvUser = findViewById(R.id.tv_user)

        viewModel.userLiveData.observe(this, object : Observer<User> {
            override fun onChanged(user: User) {
                tvUser.text = "${user}"
            }
        })
    }

    fun onShow(view: View) {
        viewModel.showUser()
    }

    fun onChange(view: View) {
        viewModel.changeUser()
    }
}
```

**规范Factory：**

```kotlin
class UserViewModel(private var user: User) : ViewModel() {

    private val _userLiveData = MutableLiveData<User>()
    val userLiveData = _userLiveData

    companion object {
        fun provideFactory(user: User): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    if (modelClass.isAssignableFrom(UserViewModel::class.java)) {
                        return UserViewModel(user) as T
                    }
                    throw IllegalArgumentException("Unknown ViewModel class")
                }
            }
        }
    }
}
```

**使用：**

```kotlin
private val viewModel: UserViewModel by viewModels {
    UserViewModel.provideFactory(User("小白", 18, arrayOf("北京市", "朝阳区")))
}
```

### Fragment之间共享数据

**优点：**

- Activity不需要做其他操作。
- Fragment之间没有任何干扰，只需要约定共享的 ViewModel。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5defb6be83eb4da69a067632e19ae224.png)

**定义ViewModel：**

```kotlin
class SharedViewModel : ViewModel() {
    private val _liveData = MutableLiveData<String>()
    val liveData = _liveData

    fun setData(item: String) {
        _liveData.postValue("$item detail")
    }
}
```

**Activity类**

```kotlin
class SharedDataActivity : BaseActivity(R.layout.activity_sharred_data) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportFragmentManager.beginTransaction()
            .replace(R.id.fl_menu, MenuFragment.newInstance())
            .replace(R.id.fl_detail, DetailFragment.newInstance())
            .commit()
    }
}
```

**MenuFragment**

```kotlin
class MenuFragment : BaseFragment(R.layout.fragment_menu) {
    private val sharedViewModel: SharedViewModel by activityViewModels()

    companion object {
        fun newInstance() = MenuFragment()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val listView = view.findViewById<ListView>(R.id.listView)
        val data = ArrayList<String>().apply {
            for (i in 0..20) {
                add("menu$i")
            }
        }
        listView.adapter = ArrayAdapter(mContext, android.R.layout.simple_list_item_1, data)
        listView.setOnItemClickListener { parent, view, position, id ->
            sharedViewModel.setData(data[position])
        }
    }
}
```

**DetailFragment**

```kotlin
class DetailFragment : BaseFragment(R.layout.detail_fragment) {
    private val sharedViewModel: SharedViewModel by activityViewModels()

    companion object {
        fun newInstance() = DetailFragment()
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val textView = view.findViewById<TextView>(R.id.textView)
        sharedViewModel.liveData.observe(viewLifecycleOwner, object : Observer<String> {
            override fun onChanged(t: String?) {
                textView.text = t
            }
        })
    }
}
```



## ViewModel与onSaveInstanceState()区别

- ViewModel：适用于配置变更导致的数据恢复，这是因为内存容量相对较大，可以存储较多的数据。
- onSaveInstanceState()：适用于被系统回收后重建时的数据恢复，这是因为系统回收时应用进程会消亡，因此不能用内存存储而是使用持久化存储，同时这部分数据需要通过Bundle机制传输数据，Bundle缓冲区有大小限制，只能适用于小规模数据。

|                                    | ViewModel                        | onSaveInstanceState()                      | 持久化             |
| ---------------------------------- | -------------------------------- | ------------------------------------------ | ------------------ |
| 存储位置                           | 在内存中                         | 在内存中                                   | 在磁盘或网络       |
| 配置修改后是否存在                 | 是                               | 是                                         | 是                 |
| 在系统启动的进程死亡后存活         | 否                               | 是                                         | 是                 |
| 关闭activity或onFinish()后是否存在 | 否                               | 否                                         | 是                 |
| 数据限制                           | 支持复制类型，空间受可用内存限制 | 适用于基本数据类型和简单的小对象，如字符串 | 仅受限于磁盘空间   |
| 读写效率                           | 快（内存操作）                   | 慢（需要序列化和反序列化）                 | 慢（需要磁盘读写） |



## [ViewModel源码分析](https://blog.csdn.net/qq_14876133/article/details/126989117)

