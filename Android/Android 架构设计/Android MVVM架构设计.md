[TOC]

# Android MVVM架构设计

##  架构分类

### MVC

![在这里插入图片描述](https://img-blog.csdnimg.cn/89a7d1a688fd40fca75122484e58fce8.png)

MVC 是 Android 默认的设计，主要将代码分为三个部分：

| 角色                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| Model（模型）        | 负责请求数据和处理数据，将处理后的数据发送给 View 和 Controller。 |
| View（视图）         | 负责界面展示，对应XML布局和View。视图不处理任何业务逻辑，只负责显示数据并接收用户的输入。 |
| Controller（控制器） | 负责业务逻辑处理和UI相互，对应Activity和Fragment。控制器是模型和视图之间的协调者。它处理用户在视图上的交互（例如点击按钮），并更新模型以反映这些交互。然后，它更新视图以反映模型的新状态。 |

**缺点：**

- MVC三者相互关联耦合，可能会导致后期维护困难。
- 同时在 Android 中，Activity 和 Fragment 需要同时承担 View 和 Controller 逻辑处理，会导致其代码臃肿。

### MVP

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e2e25ab6a474aafb1a14ae3177ba078.png)

| 角色              | 说明                                           |
| ----------------- | ---------------------------------------------- |
| Model（模型）     | 负责请求数据和处理数据，不包含任何UI信息。     |
| View（视图）      | 负责显示数据和UI交互，通常是Activity和Fragment |
| Presenter（控制） | Presenter是Model和View之间的桥梁，负责业务逻辑 |

**优点**

- 让 Model 与 View 的彻底耦合。
- 代码结构清晰，极大简化了Activity/Fragment。

**缺点**

- View层和Presenter层之前互相持有，生命周期存在不同步，容易引起内存泄露和空指针异常。
- 会引入大量接口，增加代码复杂度。

### MVVM

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210518115543344.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

**MVVM：Model-View-ViewModel**

| 角色                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| Model（模型）         | 负责获取数据和处理数据                                       |
| View（视图）          | 负责界面展示和用户交互，即Activity/Fragment                  |
| ViewModel（视图模型） | ViewModel是Model和View之间的桥梁，负责业务逻辑处理、数据驱动，通常由ViewModel+LiveData。从Model获取数据更新View，处理View的交互，ViewModel不会引用View |

**事件流向**

MVVM的本质是数据驱动，用户操作界面，View 触发事件，使用 ViewModel 处理业务逻辑，通知 Model 处理数据，Model 将新数据传递给ViewModel，ViewModel 通过数据驱动通知 View 更新界面。

**优点**

- ViewModel不在持有View，解藕更彻底。



## MVVM 简单实现

由于 MVVM 架构需要将 ViewModel 与 View 解耦。因此这里使用观察者模式（LiveData）来实现。

**代码结构：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/f80736896dc24456accb31fdf5212408.png)

### 定义Bean类

```java
public class BaseResponse<T> {
    private String errorMsg;
    private int errorCode;
    private T data;
    
    //省略构造函数、get/set方法
}
```

```java
public class User {
    private boolean admin;
    private int id;
    private String nickname;
    private String publicName;
    private String username;
    
     //省略构造函数、get/set方法
}
```

### 定义状态类

```java
public class ResultState<T> {
    public static final int STATE_SUCCESS = 1;
    public static final int STATE_ERROR = 2;
    public static final int STATE_LOADING = 0;
    public static final int STATE_COMPLETE = 3;

    private int state = STATE_LOADING;
    private String errMsg;
    private T data;

    //省略构造函数、get/set方法
}
```

### 定义Model层

```java
public class LoginModel {
    public void login(MutableLiveData<ResultState<User>> liveData, String username, String password) {
        liveData.postValue(new ResultState(ResultState.STATE_LOADING));
        final String url = "https://www.wanandroid.com/user/login";
        OkHttpClient client = new OkHttpClient();
        FormBody body = new FormBody.Builder()
                .add("username", username)
                .add("password", password)
                .build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    String json = response.body().string();
                    BaseResponse<User> userResponse = new Gson().fromJson(json, new TypeToken<BaseResponse<User>>() {
                    }.getType());
                    if (userResponse.isSuccessful()) {
                        liveData.postValue(new ResultState(ResultState.STATE_SUCCESS, userResponse.getData()));
                    } else {
                        liveData.postValue(new ResultState(ResultState.STATE_ERROR, userResponse.getErrorMsg()));
                    }
                } else {
                    liveData.postValue(new ResultState(ResultState.STATE_ERROR, "网络连接失败：${response.code}"));
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                liveData.postValue(new ResultState(ResultState.STATE_ERROR, "网络连接失败：${e.message}"));
            }
        });
    }
}
```

### 定义View层

```java
public class LoginActivity extends AppCompatActivity implements Observer<ResultState<User>> {
    private ActivityLoginBinding viewBinding;
    private LoginViewModel viewModel;
    private ProgressDialog progressDialog;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewBinding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(viewBinding.getRoot());
        viewModel = new LoginViewModel();
        initViews();
        observe();
    }

    private void initViews() {
        viewBinding.btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String username = viewBinding.etUsername.getText().toString();
                String password = viewBinding.etPassword.getText().toString();
                if (TextUtils.isEmpty(username)) {
                    Utils.showToast("请输入用户名");
                    return;
                }
                if (TextUtils.isEmpty(password)) {
                    Utils.showToast("请输入密码");
                    return;
                }
                viewModel.login(username, password);
            }
        });
    }

    // 注册观察者
    private void observe() {
        viewModel.getLoginLiveData().observe(this, this);
    }

    @Override
    public void onChanged(ResultState<User> resultState) {
        switch (resultState.getState()) {
            case ResultState.STATE_LOADING:
                showLoading();
                break;
            case ResultState.STATE_ERROR:
                viewBinding.tvDesc.setText(resultState.getErrMsg());
                hideLoading();
                break;
            case ResultState.STATE_SUCCESS:
                User user = resultState.getData();
                viewBinding.tvDesc.setText(user.toString());
                hideLoading();
                break;
        }
    }

    // 取消注册
    private void removeObserve() {
        viewModel.getLoginLiveData().removeObserver(this);
    }

    private void showLoading() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("加载中");
        progressDialog.show();
    }

    private void hideLoading() {
        progressDialog.hide();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        removeObserve();
    }
}
```

### 定义ViewModel层

```java
public class LoginViewModel {
    private MutableLiveData<ResultState<User>> loginLiveData;
    private LoginModel loginModel;

    public LoginViewModel() {
        loginLiveData = new MutableLiveData<>();
        loginModel = new LoginModel();
    }

    public MutableLiveData<ResultState<User>> getLoginLiveData() {
        return loginLiveData;
    }

    public void login(String username, String password) {
        loginModel.login(loginLiveData, username, password);
    }
}
```



## Jetpack MVVM实现

**Jetpack MVVM** 是 MVVM 模式在 Android 开发中的一个具体实现，是 Android 官方提供并推荐的 MVVM实现方式。 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2021032723012254.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

**各模块对应MVVM分层：**

- View：Activity/Fragment
- ViewModel：Jetpack ViewModel + Jetpack LiveData
- Model：本地持久化存储和远程服务端数据

### 代码结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/f108c9f7a8ef46e8b8dc1ebcb8968a81.png)

### 定义Bean类

```kotlin
data class BaseResponse<T>(
    val errorCode: Int = 0,
    var errorMsg: String = "",
    val data: T? = null
) {
    fun isSuccessful() = errorCode == 0
}
```

```kotlin
data class User(
    var admin: Boolean = false,
    val id: Int = 0,
    val nickname: String? = null,
    val publicName: String? = null,
    val username: String? = null
)
```

### 定义状态类

```kotlin
sealed class ResultState {
    // 成功状态
    data class Success<out T>(val data: T) : ResultState()

    // 失败状态
    data class Error(val exception: Exception?, val message: String?) : ResultState()

    // 加载状态
    object Loading : ResultState()
}
```

### 定义网络请求

```kotlin
class ServerException(val code: Int, val msg: String) : RuntimeException()
```

```kotlin
class ApiException(throwable: Throwable, val code: Int, val displayMessage: String) :
    Exception(throwable){

    /**
     * Http状态码
     */
    object Http {
        const val UNAUTHORIZED = 401
        const val FORBIDDEN = 403
        const val NOT_FOUND = 404
        const val REQUEST_TIMEOUT = 408
        const val INTERNAL_SERVER_ERROR = 500
        const val BAD_GATEWAY = 502
        const val SERVICE_UNAVAILABLE = 503
        const val GATEWAY_TIMEOUT = 504
    }

    /**
     * 异常状态码
     */
    object Error {
        /**
         * 未知错误
         */
        const val UNKNOWN = 1000

        /**
         * 解析错误
         */
        const val PARSE_ERROR = 1001

        /**
         * 网络错误
         */
        const val NETWORD_ERROR = 1002

        /**
         * 协议出错
         */
        const val HTTP_ERROR = 1003

        /**
         * 证书出错
         */
        const val SSL_ERROR = 1005
    }
    }
```

```kotlin
object ExceptionHandler {

    fun handleException(e: Throwable): ApiException {
        if (e is ServerException) {
            return ApiException(e, e.code, e.msg)
        } else if (e is HttpException) {
            return ApiException(e, ApiException.Error.HTTP_ERROR, "服务器连接失败")
        } else if (e is JsonParseException || e is JSONException || e is ParseException) {
            return ApiException(e, ApiException.Error.PARSE_ERROR, "解析错误")
        } else if (e is ConnectException || e is ConnectTimeoutException || e is SocketTimeoutException) {
            return ApiException(e, ApiException.Error.NETWORD_ERROR, "网络连接失败,请稍后重试")
        } else if (e is SSLHandshakeException) {
            return ApiException(e, ApiException.Error.SSL_ERROR, "证书验证失败")
        } else {
            return ApiException(e, ApiException.Error.UNKNOWN, "网络连接异常,请稍后重试")
        }
    }
}
```


```kotlin
object HttpManager {
    private const val BASE_URL = "https://wanandroid.com/"

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttpClient)
            .build()
    }

    fun <T> create(serviceClass: Class<T>): T = retrofit.create(serviceClass)
}
```

### 定义Model层

```kotlin
open class BaseModel {

    suspend fun <T> requestForResult(block: suspend () -> BaseResponse<T>): ResultState {
        return try {
            val response = block()
            if (response.isSuccessful()) {
                ResultState.Success(response.data)
            } else {
                val serverException = ServerException(response.errorCode, response.errorMsg)
                val e = ExceptionHandler.handleException(serverException)
                ResultState.Error(e, e.displayMessage)
            }
        } catch (e: Exception) {
            val e = ExceptionHandler.handleException(e)
            ResultState.Error(e, e.displayMessage)
        }
    }

}
```

```kotlin
interface LoginApi {
    @POST("user/login")
    @FormUrlEncoded
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): BaseResponse<User>
}
```

```kotlin
class LoginModel : BaseModel() {

    private val loginApi: LoginApi by lazy {
        HttpManager.create(LoginApi::class.java)
    }

    suspend fun login(username: String, password: String): ResultState {
        return requestForResult<User> {
            loginApi.login(username, password)
        }
    }
}
```

### 定义View层

```kotlin
abstract class BaseActivity<VB : ViewBinding> : AppCompatActivity() {
    private lateinit var _mViewBinding: VB
    protected val mViewBinding get() = _mViewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _mViewBinding = createViewBinding()
        setContentView(_mViewBinding.root)
        initViews()
        initData(savedInstanceState)
    }

    abstract fun createViewBinding(): VB

    abstract fun initViews()

    abstract fun initData(savedInstanceState: Bundle?)
}
```

```kotlin
class LoginActivity : BaseActivity<ActivityLoginBinding>() {
    private val viewModel: LoginViewModel by viewModels()

    private val progressDialog: ProgressDialog by lazy {
        ProgressDialog(this).apply {
            setMessage("加载中")
        }
    }

    override fun createViewBinding(): ActivityLoginBinding =
        ActivityLoginBinding.inflate(layoutInflater)

    override fun initViews() {
        mViewBinding.btnLogin.setOnClickListener {
            val username = mViewBinding.etUsername.text.toString()
            val password = mViewBinding.etPassword.text.toString()
            if (username.isNullOrEmpty()) {
                toast("请输入用户名")
                return@setOnClickListener
            }
            if (password.isNullOrEmpty()) {
                toast("请输入密码")
                return@setOnClickListener
            }

            viewModel.login(username, password)
        }
    }

    override fun initData(savedInstanceState: Bundle?) {
        observe()
    }

    private fun observe() {
        viewModel.loginLiveData.observe(this) {
            when (it) {
                is ResultState.Loading -> {
                    showLoadingDialog()
                }
                is ResultState.Error -> {
                    hideLoadingDialog()
                    mViewBinding.tvDesc.text = it.message
                }
                is ResultState.Success<*> -> {
                    hideLoadingDialog()
                    mViewBinding.tvDesc.text = it.data.toString()
                }
            }
        }
    }

    private fun showLoadingDialog() {
        progressDialog.show()
    }

    private fun hideLoadingDialog() {
        progressDialog.hide()
    }

}
```

### 定义ViewModel层

```kotlin
open class BaseViewModel : ViewModel() {

    fun launchWithMain(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Main) {
            block()
        }
    }

    fun launchWithIO(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            block()
        }
    }

    fun launchWithDefault(block: suspend CoroutineScope.() -> Unit) {
        viewModelScope.launch(Dispatchers.Default) {
            block()
        }
    }
}
```

```kotlin
class LoginViewModel : BaseViewModel() {
    private val _loginLiveData = MutableLiveData<ResultState>()
    val loginLiveData: LiveData<ResultState> get() = _loginLiveData

    fun login(username: String, password: String) {
        _loginLiveData.value = ResultState.Loading
        launchWithIO {
            val loginModel = LoginModel()
            val resultState = loginModel.login(username, password)
            _loginLiveData.postValue(resultState)
        }
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_ArchitectureDesign)

