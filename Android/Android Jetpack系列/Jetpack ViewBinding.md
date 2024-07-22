[TOC]

# Jetpack ViewBinding

## 概述

视图绑定功能可让您更轻松地编写与视图交互的代码。在模块中启用视图绑定后，它会为该模块中显示的每个 XML 布局文件生成一个绑定类。绑定类的实例包含对在相应布局中具有 ID 的所有视图的直接引用。

[官网](https://developer.android.google.cn/topic/libraries/view-binding)

 

## ViewBinding优点

**ViewBinding优点**

- **Null 安全**：由于视图绑定会创建对视图的直接引用，因此不存在因视图 ID 无效而引发 null 指针异常的风险。此外，当视图仅存在于布局的某些配置中时，绑定类中包含其引用的字段会标记为 `@Nullable`。
- **类型安全**：每个绑定类中的字段都具有与其在 XML 文件中引用的视图相匹配的类型。这意味着不存在发生类转换异常的风险。

**与findViewById区别**

- findViewById 编写过于冗余。
- 类型不安全。

**与ButterKnife区别**

- 官宣不维护，推荐使用ViewBinding。
- 类型不安全。
- 对组件化不友好。

**与Kotlin Android Extensions**

- JetBrains废弃该插件。
- 类型不安全。
- 性能偏低。



## 配置ViewBinding

**Android Studio3.6以上**

```groovy
android {
    viewBinding {
        enabled = true
    }
}
```

**Android Studio4.0以上**

```groovy
android {
    buildFeatures {
        viewBinding = true
    }
}
```

如果需要忽略某个布局文件，需要添加 `tools:viewBindingIgnore="true"` 属性到布局中。

```xml
<LinearLayout
              ...
              tools:viewBindingIgnore="true" >
  		  ...
</LinearLayout>
```



## 使用

当开启ViewBinding后，系统会为该模块中每个XML布局文件生成一个绑定类（转换为驼峰命名并在末尾添加Binding），每个绑定类均包含根视图已交具有id的所有视图的引用。

例如：布局文件名为 `activity_main.xml`，生成绑定类为 `ActivityMainBinding`。

### 在Activity中使用

**使用流程**

- 开启视图绑定功能后，系统会为该模块中的XML布局生成一个绑定类，每个绑定类都包含根布局和具有ID布局的引用。
- 调用绑定类的静态 `inflate()` 方法获取绑定类对象。
- 调用绑定类对象的 `getRoot()` 方法获取根布局传递到 `setContentView()`。

**XML布局**

activity_view_binding_simple.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center_horizontal"
    android:orientation="vertical">

    <TextView
        android:id="@+id/tv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <TextView
        android:id="@+id/tv_age"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <ImageView
        android:id="@+id/iv_avatar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <Button
        android:id="@+id/btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="确定" />
</LinearLayout>
```

**Activity类**

```kotlin
class ViewBindingSimpleActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val viewBinding = ActivityViewBindingSimpleBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)

        viewBinding.tvName.text = "hello world"
        viewBinding.tvAge.text = 18.toString()
        viewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        viewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello", Toast.LENGTH_SHORT).show()
        }
    }
}
```

### 在Fragment中使用

#### 方式一：inflate()

- 调用绑定类的静态 `inflate()` 方法，获取绑定类对象。
- 再调用 `getRoot()` 方法获取根布局。
- 在 `onCreateView()` 方法返回根布局，使其成为屏幕上的活动视图。
- 由于 Fragment 的存在时间比视图长。因此需要在 Fragment 的 `onDestroyView()` 方法中清除对绑定类对象的所有引用。

```kotlin
class MyFragment : BaseFragment() {
    private var _viewBinding: FragmentMyBinding? = null
    private val viewBinding get() = _viewBinding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _viewBinding = FragmentMyBinding.inflate(inflater, container, false)
        return viewBinding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewBinding.tvName.text = "hello world"
        viewBinding.tvAge.text = 18.toString()
        viewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        viewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _viewBinding = null
    }
}
```

#### 方式二：bind()

```kotlin
class MyFragment : BaseFragment() {
    private var _viewBinding: FragmentMyBinding? = null
    private val viewBinding get() = _viewBinding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_my, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _viewBinding = FragmentMyBinding.bind(view)
        viewBinding.tvName.text = "hello world"
        viewBinding.tvAge.text = 18.toString()
        viewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        viewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _viewBinding = null
    }
}
```

### 在RecyclerView中使用

```kotlin
class MyAdapter(private val context: Context, private val data: ArrayList<String>) :
    RecyclerView.Adapter<MyAdapter.ViewHolder>() {
    private val layoutInflater: LayoutInflater = LayoutInflater.from(context)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemBinding = ItemTextBinding.inflate(layoutInflater, parent, false)
        val viewHolder = ViewHolder(itemBinding)
        viewHolder.itemView.setOnClickListener {
            Toast.makeText(context, data[viewHolder.adapterPosition], Toast.LENGTH_SHORT).show()
        }
        return viewHolder
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.dest.text = data[position]
    }

    override fun getItemCount(): Int {
        return data.size
    }

    class ViewHolder(private val itemBinding: ItemTextBinding) :
        RecyclerView.ViewHolder(itemBinding.root) {
        val dest: TextView = itemBinding.dest
    }
}
```

### 在Dialog中使用

```kotlin
class TipDialog(context: Context) : Dialog(context) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val dialogBinding = DialogLayoutBinding.inflate(layoutInflater)
        setContentView(dialogBinding.root)
        dialogBinding.title.text = "标题"
    }
}
```

### 在include标签中使用

ViewBinding可以与 `<include>` 标签一起使用

#### 不使用merge标签

- 一定要给 `<include>` 标签定义id，使用该id访问布局中的控件。

**XML布局**

title_bar.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#2196F3"
    android:minHeight="50dp"
    android:padding="10dp">

    <TextView
        android:id="@+id/back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerVertical="true"
        android:text="返回" />

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="标题位置" />

    <TextView
        android:id="@+id/confirm"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_centerVertical="true"
        android:text="确定" />

</RelativeLayout>
```

**Activity的XML布局**

activity_vbinclude.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".IncludeActivity">

    <include
        android:id="@+id/titleBar"
        layout="@layout/titlebar" />

</LinearLayout>
```

**在include标签中使用**

```kotlin
public class IncludeActivity extends AppCompatActivity {
    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        ActivityIncludeBinding binding = ActivityIncludeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.titleBar.title.setText("这是一个标题");
        binding.titleBar.back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(context, "返回", Toast.LENGTH_SHORT).show();
            }
        });
        binding.titleBar.confirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(context, "确定", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

#### 使用merge标签

- `<merge>` 标签有利于减少布局层次。
- 需要使用 `bind()` 方法绑定根视图。
- 不能给 `<include> `标签设置id。

**布局：detail_layout.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<merge xmlns:android="http://schemas.android.com/apk/res/android">

    <ImageView
        android:id="@+id/ivDetail"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:scaleType="fitXY" />
</merge>
```

**Activity的XML布局**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".IncludeActivity">

    <include layout="@layout/detail_layout" />

</LinearLayout>
```

**在include标签中使用**

```kotlin
public class IncludeActivity extends AppCompatActivity {

    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        ActivityIncludeBinding binding = ActivityIncludeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        DetailLayoutBinding detailBinding = DetailLayoutBinding.bind(binding.getRoot());
        detailBinding.ivDetail.setImageResource(R.mipmap.ic_launcher);
    }
}
```



## 封装使用

### 基类封装，不使用反射

**基类封装**

```kotlin
abstract class BindingActivity<VB : ViewBinding> : BaseActivity() {
    private lateinit var _viewBinding: VB
    protected val mViewBinding get() = _viewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _viewBinding = getViewBinding()
        setContentView(_viewBinding.root)
    }

    abstract fun getViewBinding(): VB
}
```

```kotlin
abstract class BindingFragment<VB : ViewBinding> : BaseFragment() {
    private lateinit var _viewBinding: VB
    protected val mViewBinding get() = _viewBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _viewBinding = getViewBinding(inflater, container)
        return _viewBinding.root
    }

    abstract fun getViewBinding(inflater: LayoutInflater, container: ViewGroup?): VB
}
```

**使用**

```kotlin
class OneActivity : BindingActivity<ActivityOneBinding>() { 

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mViewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        mViewBinding.tvName.text = "小白"
        mViewBinding.tvAge.text = 18.toString()
        mViewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello", Toast.LENGTH_SHORT).show()
        }
    }

    override fun getViewBinding(): ActivityOneBinding {
        return ActivityOneBinding.inflate(layoutInflater)
    }
}
```

```kotlin
class OneFragment : BindingFragment<FragmentOneBinding>() {
    override fun getViewBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ): FragmentOneBinding {
        return FragmentOneBinding.inflate(inflater, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        mViewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        mViewBinding.tvName.text = "小白"
        mViewBinding.tvAge.text = 18.toString()
        mViewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello", Toast.LENGTH_SHORT).show()
        }
    }
}
```



### 基类封装，使用反射

**基类封装**

```kotlin
abstract class BindingActivity<VB : ViewBinding> : BaseActivity() {
    private lateinit var _viewBinding: VB
    protected val mViewBinding get() = _viewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val type: Type? = javaClass.genericSuperclass //获取父类的泛型类型
        if (type != null && type is ParameterizedType) {
            val clz = type.actualTypeArguments[0] as Class<*>
            val method = clz.getMethod("inflate", LayoutInflater::class.java)
            _viewBinding = method.invoke(null, layoutInflater) as VB
            setContentView(_viewBinding.root)
        }
    }
}
```

```kotlin
abstract class BindingFragment<VB : ViewBinding> : BaseFragment() {
    private var _viewBinding: VB? = null
    protected val mViewBinding get() = _viewBinding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        val type: Type? = javaClass.genericSuperclass
        if (type != null && type is ParameterizedType) {
            val clz = type.actualTypeArguments[0] as Class<*>
            val method = clz.getMethod(
                "inflate", LayoutInflater::class.java, ViewGroup::class.java, Boolean::class.java
            )
            _viewBinding = method.invoke(null, inflater, container, false) as VB
        }
        return mViewBinding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _viewBinding = null
    }
}
```

**使用**

```kotlin
class TwoActivity : BindingActivity<ActivityTwoBinding>() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mViewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        mViewBinding.tvName.text = "小白"
        mViewBinding.tvAge.text = 28.toString()
        mViewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello2", Toast.LENGTH_SHORT).show()
        }
    }
}
```

```kotlin
class TwoFragment : BindingFragment<FragmentTwoBinding>() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        mViewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        mViewBinding.tvName.text = "小白"
        mViewBinding.tvAge.text = 28.toString()
        mViewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello2", Toast.LENGTH_SHORT).show()
        }
    }
}
```



### 委托实现

**封装**

```kotlin
inline fun <reified VB : ViewBinding> ComponentActivity.viewBindings(
    noinline factory: (LayoutInflater) -> VB,
    setContentView: Boolean = true
) = ActivityViewBindingDelegate1(factory, setContentView)

inline fun <reified VB : ViewBinding> ComponentActivity.viewBindings(setContentView: Boolean = true) =
    ActivityViewBindingDelegate2(VB::class.java, setContentView)

class ActivityViewBindingDelegate1<VB : ViewBinding>(
    private val factory: (LayoutInflater) -> VB,
    private val setContentView: Boolean,
) : ReadOnlyProperty<ComponentActivity, VB> {
    private var viewBinding: VB? = null

    override fun getValue(thisRef: ComponentActivity, property: KProperty<*>): VB {
        viewBinding?.let { return it }
        viewBinding = factory(thisRef.layoutInflater).also { it ->
            if (setContentView) thisRef.setContentView(it.root)
        }
        return viewBinding!!
    }
}

class ActivityViewBindingDelegate2<VB : ViewBinding>(
    private val clazz: Class<VB>,
    private val setContentView: Boolean,
) : ReadOnlyProperty<ComponentActivity, VB> {
    private var viewBinding: VB? = null

    override fun getValue(thisRef: ComponentActivity, property: KProperty<*>): VB {
        viewBinding?.let { return it }
        val inflateMethod = clazz.getMethod("inflate", LayoutInflater::class.java)
        viewBinding =
            (inflateMethod.invoke(null, thisRef.layoutInflater) as VB).also { it ->
                if (setContentView) thisRef.setContentView(it.root)
            }
        return viewBinding!!
    }
}
```

```kotlin
inline fun <reified VB : ViewBinding> Fragment.viewBindings(noinline factory: (View) -> VB) =
    FragmentViewBindingDelegate1(factory)

inline fun <reified VB : ViewBinding> Fragment.viewBindings() =
    FragmentViewBindingDelegate2(VB::class.java)

class FragmentViewBindingDelegate1<VB : ViewBinding>(
    private val factory: (View) -> VB,
) : ReadOnlyProperty<Fragment, VB> {
    private var viewBinding: VB? = null

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getValue(thisRef: Fragment, property: KProperty<*>): VB {
        viewBinding?.let { return it }

        val lifecycle = thisRef.viewLifecycleOwner.lifecycle
        viewBinding = factory(thisRef.requireView())
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) {
            Log.w(
                "TAG",
                "Access to viewBinding after Lifecycle is destroyed or hasn't created yet. The instance of viewBinding will be not cached."
            )
        } else {
            thisRef.lifecycle.addObserver(object : DefaultLifecycleObserver {
                override fun onDestroy(owner: LifecycleOwner) {
                    thisRef.lifecycle.removeObserver(this)
                    //说明：
                    //Fragment的ViewLifecycleOwner通知更新Lifecycle的ON_DESTROY时机是发生在Fragment#onDestroyView()之前
                    //因此，需要将主线程上的所有操作完后才能清理ViewBinding
                    mainHandler.post {
                        viewBinding = null
                    }
                }
            })
        }
        return viewBinding!!
    }
}

class FragmentViewBindingDelegate2<VB : ViewBinding>(
    clazz: Class<VB>,
) : ReadOnlyProperty<Fragment, VB> {
    private var viewBinding: VB? = null

    private val bindMethod = clazz.getMethod("bind", View::class.java)

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getValue(thisRef: Fragment, property: KProperty<*>): VB {
        viewBinding?.let { return it }

        val lifecycle = thisRef.viewLifecycleOwner.lifecycle
        viewBinding = bindMethod.invoke(null, thisRef.requireView()) as VB
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) {
            Log.w(
                "TAG",
                "Access to viewBinding after Lifecycle is destroyed or hasn't created yet. The instance of viewBinding will be not cached."
            )
        } else {
            thisRef.lifecycle.addObserver(object : DefaultLifecycleObserver {
                override fun onDestroy(owner: LifecycleOwner) {
                    thisRef.lifecycle.removeObserver(this)
                    mainHandler.post {
                        viewBinding = null
                    }
                }
            })
        }
        return viewBinding!!
    }
}
```

**使用**

```kotlin
class ThreeActivity : BaseActivity() {
    //方式一
    private val viewBinding: ActivityThreeBinding by viewBindings(ActivityThreeBinding::inflate)
    //方式二
    //    private val viewBinding: ActivityThreeBinding by viewBindings()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        viewBinding.tvName.text = "小白"
        viewBinding.tvAge.text = 38.toString()
        viewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello3", Toast.LENGTH_SHORT).show()
        }
    }
}

class ThreeFragment : BaseFragment(R.layout.fragment_three) {
    //方式一
//    private val viewBinding: FragmentThreeBinding by viewBindings(FragmentThreeBinding::bind)
    //方式二
    private val viewBinding: FragmentThreeBinding by viewBindings()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewBinding.ivAvatar.setImageResource(R.mipmap.ic_launcher_round)
        viewBinding.tvName.text = "小白33"
        viewBinding.tvAge.text = 338.toString()
        viewBinding.btn.setOnClickListener {
            Toast.makeText(mContext, "hello33", Toast.LENGTH_SHORT).show()
        }
    }
}
```

**[第三方框架](https://github.com/androidbroadcast/ViewBindingPropertyDelegate)**



## [源码分析](https://blog.csdn.net/qq_14876133/article/details/126930594)

