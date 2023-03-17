[TOC]

# Android组件化设计

## 概述

- 库：单一功能或一些功能的提供者。
- 模块：指业务模块，按业务堆App进行拆分，通常一个App可拆分成多个模块，如微信就定义了四个模块：微信、通信录、发现、我。
- 组件：指堆功能的封装就是组件，一个功能就是一个组件，如：IO组件、网络组件、数据库组件、视频组件、支付组件等。具有一次封装，各处使用的特性。组件化是基于模块化。

**由此来看，[模块] 和 [组件] 间最明显的区别就是模块相对与组件来说粒度更大，一个模块中可能包含多个组件。并且两种方式的本质思想是一样的，都是为了代码重用和业务解耦。在划分的时候，模块化是业务导向，组件化是功能导向。**



**优点**

- 提高组件复用性
- 降低组件间的耦合



## 结构说明

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210518163425429.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

从上往下分别为：应用层、组件层和基础层

- 应用层：这里只添加一个app，app会引入不同的组件
- 组件层：具体的组件功能，如视频、支付组件等
- 基础层：包含一些基础库和对基础库的封装，如图片加载、网络框架、数据库操作等



## 实现

### 配置gradle

**config.gradle**

```groovy
ext {
    //组件独立开关
    isModule = false

    //Android相关
    android = [
        compileSdkVersion    : 30,
        applicationId        : "com.example.myapplication",
        applicationId_chat   : "com.example.chat",
        applicationId_contact: "com.example.contact",
        applicationId_find   : "com.example.find",
        applicationId_me     : "com.example.me",
        minSdkVersion        : 21,
        targetSdkVersion     : 30,
        versionCode          : 1,
        versionName          : "1.0"
    ]

    //依赖库
    dependencies = [
        "appcompat"       : 'androidx.appcompat:appcompat:1.2.0',
        "material"        : 'com.google.android.material:material:1.2.1',
        "arouter-api"     : 'com.alibaba:arouter-api:1.5.1',
        "arouter-compiler": 'com.alibaba:arouter-compiler:1.5.1',
        "circleimageview" : 'de.hdodenhof:circleimageview:3.0.0'

    ]
}
```



### 配置BaseModule

**配置gradle**

```groovy
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])

    api rootProject.ext.dependencies["appcompat"]
    api rootProject.ext.dependencies["material"]
    api rootProject.ext.dependencies["circleimageview"]

    //ARouter
    implementation rootProject.ext.dependencies["arouter-api"]
    annotationProcessor rootProject.ext.dependencies["arouter-compiler"]
}
```

**封装Base类**

```
.
├── base
│   ├── BaseActivity.java
│   ├── BaseApp.java
│   └── BaseFragment.java
├── helper
│   └── ARouterHelper.java
└── interceptor
    └── ARouterInterceptor.java
```

```java
public class BaseApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        if (BuildConfig.DEBUG) {
            ARouter.openLog();
            ARouter.openDebug();
        }
        ARouter.init(this);
    }
}
```

```java
public abstract class BaseActivity extends AppCompatActivity {
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutId());
        initViews();
        initData();
    }

    protected abstract int getLayoutId();

    protected abstract void initViews();

    protected abstract void initData();
}
```

```java
public abstract class BaseFragment extends Fragment {

    protected Context mContext;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        mContext = context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(getLayoutId(), container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
        initData();
    }


    protected abstract int getLayoutId();

    protected abstract void initView(View view);

    protected abstract void initData();
}
```



### 配置app

**修改gradle**

```groovy
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation project(path: ':CommonModule')

    if (!Boolean.valueOf(rootProject.ext.isModule)) {
        implementation project(path: ':ChatModule')
        implementation project(path: ':ContactModule')
        implementation project(path: ':FindModule')
        implementation project(path: ':MeModule')
    }

    //ARouter
    implementation rootProject.ext.dependencies["arouter-api"]
    annotationProcessor rootProject.ext.dependencies["arouter-compiler"]
}
```



```java
public class MainActivity extends BaseActivity {

    private FrameLayout container;
    private RadioGroup rgBottom;
    private ArrayList<Fragment> fragmentList;

    @Override
    protected int getLayoutId() {
        return R.layout.activity_main;
    }

    @Override
    protected void initViews() {
        container = findViewById(R.id.container);
        rgBottom = findViewById(R.id.rgBottom);

        rgBottom.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId) {
                    case R.id.rbWeChat:
                        switchFragment(0);
                        break;
                    case R.id.rbContact:
                        switchFragment(1);
                        break;
                    case R.id.rbFind:
                        switchFragment(2);
                        break;
                    case R.id.rbMe:
                        switchFragment(3);
                        break;
                }
            }
        });
    }

    @Override
    protected void initData() {
        initFragments();
        switchFragment(0);
    }

    private void initFragments() {
        fragmentList = new ArrayList<>(4);
        ChatFragment chatFragment = ChatFragment.newInstance();
        ContactFragment contactFragment = ContactFragment.newInstance();
        FindFragment findFragment = FindFragment.newInstance();
        MeFragment meFragment = MeFragment.newInstance();
        getSupportFragmentManager().beginTransaction()
                .add(R.id.container, chatFragment)
                .add(R.id.container, contactFragment)
                .add(R.id.container, findFragment)
                .add(R.id.container, meFragment)
                .commit();
        fragmentList.add(chatFragment);
        fragmentList.add(contactFragment);
        fragmentList.add(findFragment);
        fragmentList.add(meFragment);
    }

    private void switchFragment(int index) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        for (int i = 0; i < fragmentList.size(); i++) {
            if (i == index) {
                transaction.show(fragmentList.get(i));
            } else {
                transaction.hide(fragmentList.get(i));
            }
        }
        transaction.commit();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.menu_chat:
                ARouterHelper.getInstance().build(ARouterHelper.PATH_CHAT_RUN);
                break;
            case R.id.menu_contact:
                ARouterHelper.getInstance().build(ARouterHelper.PATH_CONTACT_RUN);
                break;
            case R.id.menu_find:
                ARouterHelper.getInstance().build(ARouterHelper.PATH_FIND_RUN);
                break;
            case R.id.menu_me:
                ARouterHelper.getInstance().build(ARouterHelper.PATH_ME_RUN);
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/AndroidComponentProject)













