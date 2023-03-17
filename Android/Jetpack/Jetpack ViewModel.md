[TOC]

# Jetpack ViewModel

## 概述

ViewModel 类目的在于以注重生命周期的方式存储和管理界面相关数据。ViewModel类让数据可在发生屏幕旋转等配置更改后继续留存。

 

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





## ViewModel的生命周期

[`ViewModel`](https://developer.android.google.cn/reference/androidx/lifecycle/ViewModel?hl=zh-cn) 对象存在的时间范围是获取 [`ViewModel`](https://developer.android.google.cn/reference/androidx/lifecycle/ViewModel?hl=zh-cn) 时传递给 [`ViewModelProvider`](https://developer.android.google.cn/reference/androidx/lifecycle/ViewModelProvider?hl=zh-cn) 的 [`Lifecycle`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle?hl=zh-cn)。[`ViewModel`](https://developer.android.google.cn/reference/androidx/lifecycle/ViewModel?hl=zh-cn) 将一直留在内存中，直到限定其存在时间范围的 [`Lifecycle`](https://developer.android.google.cn/reference/androidx/lifecycle/Lifecycle?hl=zh-cn) 永久消失：对于 Activity，是在 Activity 完成时；而对于 Fragment，是在 Fragment 分离时。 

由于ViewModel的生命周期长于Activity，因此不能将View或者Activity的context传给ViewModel，否则会引起内存泄露。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210315142343341.png)



## 基本使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/81f025304e1f4d9abec4ef78fb6bbee0.png)

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

**获取ViewModel对象，方式一**

```kotlin
var viewModel: MyViewModel = ViewModelProvider(this).get(MyViewModel::class.java)
```

**获取ViewModel对象，方式二**

```kotlin
val viewModel: MyViewModel by viewModels()
```

**在Activity中使用**

```kotlin
class ViewModelSimpleActivity : BaseActivity() {
    private lateinit var tvCount: TextView
    private lateinit var tvScreen: TextView

    private val viewModel: MyViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_model_simple)
        Log.e(VIEWMODEL, "onCreate")

        initView()
        val screenOrientation =
        if (resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "竖屏" else "横屏"
        tvScreen.text = "屏幕方向：$screenOrientation"

        viewModel.countLiveData.observe(this, object : Observer<Int> {
            override fun onChanged(t: Int?) {
                Log.e(VIEWMODEL, "onChanged")
                tvCount.text = t.toString()
            }
        })
    }

    private fun initView() {
        tvCount = findViewById(R.id.tv_count)
        tvScreen = findViewById(R.id.tv_screen)
    }

    fun clickIncrease(v: View) {
        viewModel.increase()
    }

    fun clickDecrease(v: View) {
        viewModel.decrease()
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.e(VIEWMODEL, "onDestroy")
    }
}
```



### AndroidViewModel

因为ViewModel对象的存活时间较长，因此不能将Activity的Context传递给ViewModel，否则会引起内存泄露。如果需要使用context，这时可以使用AndroidViewModel接收Application的对象。

```kotlin
class MyAndroidViewModel(application: Application) : AndroidViewModel(application) {
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




## Fragment之间共享数据

**优点：**

- Activity不需要做其他操作
- Fragment之间没有任何干扰，只需要约定ViewModel

![在这里插入图片描述](https://img-blog.csdnimg.cn/5defb6be83eb4da69a067632e19ae224.png)

**SharedViewModel类**

```kotlin
class SharedViewModel : ViewModel() {
    private val _liveData = MutableLiveData<String>()
    val liveData = _liveData

    fun select(item: String) {
        _liveData.postValue("$item detail")
    }
}
```

**Activity类**

```kotlin
class MenuActivity : BaseActivity() {
   override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)
        supportFragmentManager.beginTransaction()
            .add(R.id.fl_menu, MenuFragment.newInstance())
            .add(R.id.fl_detail, DetailFragment.newInstance())
            .commit()
    }
}
```

**MenuFragment**

```kotlin
class MenuFragment : BaseFragment() {
    private val sharedViewModel: SharedViewModel by activityViewModels()

    companion object {
        fun newInstance() = MenuFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_menu, container, false)
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
            sharedViewModel.select(data[position])
        }
    }
}
```

**DetailFragment**

```kotlin
class DetailFragment : BaseFragment() {
    private val sharedViewModel: SharedViewModel by activityViewModels()

    companion object {
        fun newInstance() = DetailFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.detail_fragment, container, false)
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

|                          | ViewModel                                 | onSaveInstanceState()                              |
| ------------------------ | ----------------------------------------- | -------------------------------------------------- |
| 存储方式                 | 在内存中                                  | 序列化在磁盘                                       |
| 读写效率                 | 高（内存中访问）                          | 较慢（需要序列化、反序列化操作）                   |
| 配置更改后，数据是否留存 | 是                                        | 否                                                 |
| 系统回收后，数据是否留存 | 否                                        | 是                                                 |
| 使用场景                 | 屏幕旋转等配置更改后保存                  | Activity异常销毁时才会被调用                       |
| 存储限制                 | 可存储复杂数据，存储大小受App可用内存影响 | 只能存储可序列化对象，有存储大小有限制（一般为1M） |



## [代码下载](https://github.com/xiangxiongfly/MyAndroid/tree/main/jetpack/src/main/java/com/example/jetpack/viewmodel)




