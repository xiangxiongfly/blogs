[TOC]



# Jetpack Hilt

## 概述

- 依赖注入指Dependency Injection，简称DI，Hilt是一个功能强大用法简单的依赖注入框架。
- 通俗来讲，一个类中有一个变量，这个变量就是类的依赖，通过外部注入对这个变量进行赋值，这就是依赖注入。
- 依赖注入有利于代码解耦。

[官方文档](https://developer.android.google.cn/training/dependency-injection)



## 配置Hilt

**project/build.gradle**

```groovy
buildscript {
    ext {
        kotlin_version = '1.5.21'
        hiltVersion = "2.36"
    }
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.2.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        // Hilt
        classpath "com.google.dagger:hilt-android-gradle-plugin:$hiltVersion"
    }
}
```

**module/build.gradle**

```groovy
apply plugin: 'kotlin-kapt'
apply plugin: 'dagger.hilt.android.plugin'

android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "com.google.dagger:hilt-android:$hiltVersion"
    kapt "com.google.dagger:hilt-android-compiler:$hiltVersion"
}
```



## Hilt API介绍

### 常用注解说明

**@HiltAndroidApp**

- 必须定义一个由 @HiltAndroidApp 注解的 Application。
- 在编译期会触发 Hilt 的代码生成。

**@AndroidEntryPoint**

- @AndroidEntryPoint 注解提供Android类的依赖。

**@Inject**

- 在变量上添加 @Inject 注解，表示将实例注入到变量，在 super.onCreate() 之后被调用。
- 在类的构造函数上添加 @Inject 注解，表示告诉 Hilt 怎么创建该类的实例。

**@Module**

- 使用 @Module 注解时必须使用 @InstallIn 注解指定活动范围。
- 用于创建依赖类的对象。

**@Provides**

- 配合 @Module 注解使用。
- 用于提供依赖项对象。

**@EntryPoint**

Hilt 支持最常见的 Android 类 Application、Activity、Fragment、View、Service、BroadcastReceiver 等等，但是您可能需要在Hilt 不支持的类中执行依赖注入，在这种情况下可以使用 @EntryPoint 注解进行创建，Hilt 会提供相应的依赖。

### 入口点

**Hilt 支持的入口点：**

- Application
- ViewModel
- Activity
- Fragment
- View
- Service
- BroadcastReceiver

说明：Application 的入口点需要使用 @HiltAndroidApp 注解，ViewModel 的入口点需要使用 @HiltViewModel 注解，其他入口点使用 @AndroidEntryPoint 注解。

### 组件层次结构

Hilt 为绝大多数 Android 框架类生成组件 (或称为依赖项容器)。每个组件关联信息 (或称为绑定) 通过组件层次结构向下传递。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/01b12b4b4b904a2e8d0e67b2e7ee16b2.png)

### 为Android类生成的组件

在 @InstallIn 注解中使用。

| Hilt 组件                   | 注入器面向的对象                           |
| --------------------------- | ------------------------------------------ |
| `SingletonComponent`        | `Application`                              |
| `ActivityRetainedComponent` | 不适用                                     |
| `ViewModelComponent`        | `ViewModel`                                |
| `ActivityComponent`         | `Activity`                                 |
| `FragmentComponent`         | `Fragment`                                 |
| `ViewComponent`             | `View`                                     |
| `ViewWithFragmentComponent` | 带有 `@WithFragmentBindings` 注解的 `View` |
| `ServiceComponent`          | `Service`                                  |

### 组件的作用域

- @Singleton 注解就是一个作用域注解，表示在整个应用程序范围内共享实例。
- @ActivityScoped 注解表示在Activity和内部的Fragment和View共享实例。

| Android 类                                 | 生成的组件                  | 作用域                    |
| ------------------------------------------ | --------------------------- | ------------------------- |
| `Application`                              | `SingletonComponent`        | `@Singleton`              |
| `Activity`                                 | `ActivityRetainedComponent` | `@ActivityRetainedScoped` |
| `ViewModel`                                | `ViewModelComponent`        | `@ViewModelScoped`        |
| `Activity`                                 | `ActivityComponent`         | `@ActivityScoped`         |
| `Fragment`                                 | `FragmentComponent`         | `@FragmentScoped`         |
| `View`                                     | `ViewComponent`             | `@ViewScoped`             |
| 带有 `@WithFragmentBindings` 注解的 `View` | `ViewWithFragmentComponent` | `@ViewScoped`             |
| `Service`                                  | `ServiceComponent`          | `@ServiceScoped`          |

### 组件的生命周期

Hilt 会按照相应 Android 类的生命周期自动创建和销毁生成的组件类的实例。

| 生成的组件                  | 创建时机                 | 销毁时机               |
| --------------------------- | ------------------------ | ---------------------- |
| `SingletonComponent`        | `Application#onCreate()` | `Application` 已销毁   |
| `ActivityRetainedComponent` | `Activity#onCreate()`    | `Activity#onDestroy()` |
| `ViewModelComponent`        | `ViewModel` 已创建       | `ViewModel` 已销毁     |
| `ActivityComponent`         | `Activity#onCreate()`    | `Activity#onDestroy()` |
| `FragmentComponent`         | `Fragment#onAttach()`    | `Fragment#onDestroy()` |
| `ViewComponent`             | `View#super()`           | `View` 已销毁          |
| `ViewWithFragmentComponent` | `View#super()`           | `View` 已销毁          |
| `ServiceComponent`          | `Service#onCreate()`     | `Service#onDestroy()`  |

### 组件的默认绑定

每个 Hilt 组件都附带一组默认绑定，Hilt 可以将其作为依赖项注入您自己的自定义绑定。请注意，这些绑定对应于常规 activity 和 fragment 类型，而不对应于任何特定子类。这是因为，Hilt 会使用单个 activity 组件定义来注入所有 activity。每个 activity 都有此组件的不同实例。

| Android 组件                | 默认绑定                                      |
| --------------------------- | --------------------------------------------- |
| `SingletonComponent`        | `Application`                                 |
| `ActivityRetainedComponent` | `Application`                                 |
| `ViewModelComponent`        | `SavedStateHandle`                            |
| `ActivityComponent`         | `Application` 和 `Activity`                   |
| `FragmentComponent`         | `Application`、`Activity` 和 `Fragment`       |
| `ViewComponent`             | `Application`、`Activity` 和 `View`           |
| `ViewWithFragmentComponent` | `Application`、`Activity`、`Fragment`、`View` |
| `ServiceComponent`          | `Application` 和 `Service`                    |



## Hilt 使用

### 配置Application

定义一个 Application 并使用 @HiltAndroidApp 注解，否则 Hilt 将无法使用。

```kotlin
@HiltAndroidApp
class BaseApplication : Application() {
}
```

注册到 AndroidManifest.xml 文件中：

```xml
<application
             android:name=".BaseApplication">
</application>
```

### 在Activity中使用

- 使用 @AndroidEntryPoint 注解，将依赖项注入 Android 类。
- 使用 @Inject 注解的字段不能为private。

**使用**

```kotlin
class User @Inject constructor() {
    fun sayHello() {
        log("hello")
    }
}
```

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    @Inject
    lateinit var user: User

    @Inject
    lateinit var user2: User

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        log("$user")
        log("$user2")
        user.sayHello()
        user2.sayHello()
    }
}
```

输出信息：

```
com.example.hiltdemo.entity.User@6a0ef50
com.example.hiltdemo.entity.User@3507549
hello
hello
```

### 带参数的依赖注入

定义Driver类，并在构造函数上使用 @Inject 注解。

在Car类的构造函数里增加 Driver 参数。

```kotlin
class Driver @Inject constructor() {
}
```

```kotlin
class Car @Inject constructor(val driver: Driver) {

    fun start() {
        log("$driver 正在开车")
    }
}
```

**使用：**

```kotlin
@Inject
lateinit var car: Car

car.start()
```

### 接口的依赖注入

- 定义一个Engine接口。
- 实现两个类GasEngine、ElectricEngine。
- 使用 @Module 注解声明一个模块类EngineModule，使用 @Binds 注解提供依赖注入的对象。

**定义接口：**

```kotlin
interface Engine {
    fun start()
    fun shutdown()
}
```
**实现接口：**

```kotlin
class GasEngine @Inject constructor() : Engine {
    override fun start() {
        log("燃油引擎 start")
    }

    override fun shutdown() {
        log("燃油引擎 shutdown")
    }
}

class ElectricEngine @Inject constructor() : Engine {
    override fun start() {
        log("电力引擎 start")
    }

    override fun shutdown() {
        log("电力引擎 shutdown")
    }
}
```

**定义Module：**

返回值必须是Engine类型，表示给Engine类型的接口提供实例。


```kotlin
@Module
@InstallIn(ActivityComponent::class)
abstract class EngineModule {

    @Binds
    abstract fun bindEngine(gasEngine: GasEngine): Engine
}
```

**使用：**

```kotlin
class Car @Inject constructor(val user: User) {

    @Inject
    lateinit var engine: Engine

    fun start() {     
        engine.start()
        log("$driver 正在开车")
        engine.shutdown()
    }
}
```

输出信息：

```
燃油引擎 start
Driver@e7744ba 正在开车
燃油引擎 shutdown
```

### 相同类型注入不同的对象

- 使用 @Qualifier 注解分别定义2个注解：BindGasEngine、BindElectricEngine。
- 定义一个Module类，分别添加2个注解。
- 在注入的地方使用2个注解。

**定义两个注解：**

用于区分类型。

```kotlin
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class BindGasEngine

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class BindElectricEngine
```

**定义Module：**

```kotlin
@Module
@InstallIn(ActivityComponent::class)
abstract class SelectEngineModule {

    @BindGasEngine
    @Binds
    abstract fun bindGasEngine(gasEngine: GasEngine): Engine

    @BindElectricEngine
    @Binds
    abstract fun bindElectricEngine(electricEngine: ElectricEngine): Engine
}
```

**使用：**

使用 @BindGasEngine 注解就会注入 GasEngine 类型的实例。

```kotlin
class Car @Inject constructor(val driver: Driver) {

    @BindGasEngine
    @Inject
    lateinit var gasEngine: Engine

    @BindElectricEngine
    @Inject
    lateinit var electricEngine: Engine

    fun start() {
        gasEngine.start()
        electricEngine.start()
        log("hello $driver 正在开车")
        gasEngine.shutdown()
        electricEngine.shutdown()
    }
}
```

输出信息：

```
燃油引擎 start
电力引擎 start
hello Driver@e7744ba 正在开车
燃油引擎 shutdown
电力引擎 shutdown
```

### 第三方类的依赖注入

- 使用 @Module 注解定义Module，并使用 @InstallIn 注解定义安装至哪个组件。
- 使用 @Provides 注解表示提供的实例。

**定义Module：**

@Single 注解表示单例模式，provideRetrofit() 函数中的参数 Hilt 会自动注入。

```kotlin
@Module
@InstallIn(SingletonComponent::class)
class NetworkModule {

    @Singleton
    @Provides
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
        .build()
    }

    @Singleton
    @Provides
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
        .baseUrl("https://wanandroid.com/")
        .build()
    }
}
```

**使用：**

```kotlin
@Inject
lateinit var okHttpClient: OkHttpClient

@Inject
lateinit var retrofit: Retrofit
```

### Application & Context

Hilt 提供了 @ApplicationContext 和 @ActivityContext 内置注解，会自动提供一个 Application 类型和 Activity 类型的 Context 注入。

**使用Context类型：**

```kotlin
class MyContext @Inject constructor(
    @ApplicationContext val appContext: Context,
    @ActivityContext val activityContext: Context
)
```

**使用：**

```kotlin
@Inject
lateinit var myContext: MyContext

log("appContext : ${myContext.appContext}")
log("activityContext : ${myContext.activityContext}")
```

输出信息：

```
appContext : com.example.hiltdemo.BaseApplication@e7744ba
activityContext : com.example.hiltdemo.MainActivity@756b7ec
```

### 内置依赖Application和Activity

对于 Application 和 Activity 这两个类型，Hilt 也是给它们预置好了注入功能，可以省略注解。 

```kotlin
class MyAppAndActivity @Inject constructor(
    val application: Application,
    val activity: Activity
)
```

**使用：**

```kotlin
@Inject
lateinit var my: MyAppAndActivity

log("application : ${my.application}")
log("activity : ${my.activity}")
```

输出信息：

```
application : com.example.hiltdemo.BaseApplication@e7744ba
activity : com.example.hiltdemo.MainActivity@756b7ec
```

### 依赖注入自定义Application

**定义Module：**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
class ApplicationModule {

    @Provides
    fun provideBaseApplication(application: Application): BaseApplication {
        return application as BaseApplication
    }
}
```

**使用：**

```kotlin
@Inject
lateinit var baseApplication: BaseApplication

log("baseApplication: $baseApplication")
```

输出信息：

```
baseApplication: com.example.hiltdemo.BaseApplication@e7744ba
```

### 在ViewModel中使用

- MVVM架构中，数据层层的实例应该由ViewModel层创建。
- ViewModel层需要使用 @HiltViewModel 注解，在ViewModel的构造函数上使用 @Inject 注解。

**数据层：**

在构造函数上使用 @Inject 注解，表示将 Repository 实例注入到 ViewModel中。

```kotlin
class Repository @Inject constructor() {

    fun getData() = "从仓库获取了数据"
}
```

**ViewModel层**：

```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val savedStateHandle: SavedStateHandle,
    private val repository: Repository
) : ViewModel() {

    private val liveData = MutableLiveData<String>()

    fun loadData(): MutableLiveData<String> {
        viewModelScope.launch {
            delay(5000L)
            liveData.value = repository.getData()
        }
        return liveData
    }
}
```

**使用：**

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    private val viewModel by viewModels<MyViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewModel.loadData().observe(this) {
            log(it)
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/JetpackProject/tree/main/hiltdemo)

