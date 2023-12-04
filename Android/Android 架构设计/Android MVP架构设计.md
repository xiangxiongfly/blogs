[TOC]
# Android MVP架构设计

## MVC 架构设计

### MVC 角色

![在这里插入图片描述](https://img-blog.csdnimg.cn/89a7d1a688fd40fca75122484e58fce8.png)


MVC 是 Android 默认的设计，主要将代码分为三个部分：
| 角色                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| Model（模型）        | 负责请求数据和处理数据，将处理后的数据发送给 View 和 Controller。 |
| View（视图）         | 负责界面展示，对应XML布局和View。视图不处理任何业务逻辑，只负责显示数据并接收用户的输入。 |
| Controller（控制器） | 负责业务逻辑处理和UI相互，对应Activity和Fragment。控制器是模型和视图之间的协调者。它处理用户在视图上的交互（例如点击按钮），并更新模型以反映这些交互。然后，它更新视图以反映模型的新状态。 |

### MVC 代码

**代码结构：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/aff68e401d194e73ae64fc81908ce8bd.png)

**定义实体类：**

```java
public class BaseBean<T> {
    private String errorMsg;
    private int errorCode;
    private T data;
    
    //省略构造函数、get、set方法
}
```

```java
public class ArticleBean {
    private String name;

    //省略构造函数、get、set方法
}
```

**Adapter类：**

```java
public class ArticleAdapter extends RecyclerView.Adapter<ArticleAdapter.ViewHolder> {
    private final LayoutInflater mInflater;
    private final ArrayList<ArticleBean> mList;

    public ArticleAdapter(Context context, ArrayList<ArticleBean> list) {
        this.mList = list;
        mInflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = mInflater.inflate(R.layout.item_layout, parent, false);
        return new ViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.tvName.setText(mList.get(position).getName());
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName;

        public ViewHolder(@NonNull @NotNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tv_name);
        }
    }
}
```

**Activity：**

```java
public class MainActivity extends AppCompatActivity {
    private Button btnGetData;
    private RecyclerView rvArticles;

    private ArrayList<ArticleBean> mList = new ArrayList<>();
    private ArticleAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initViews();
    }

    private void initViews() {
        btnGetData = findViewById(R.id.btn_get_data);
        rvArticles = findViewById(R.id.rv_articles);

        btnGetData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getData();
            }
        });

        mAdapter = new ArticleAdapter(this, mList);
        rvArticles.setAdapter(mAdapter);
    }

    private void getData() {
        final String url = "https://wanandroid.com/wxarticle/chapters/json";
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(url)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {

            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                String json = response.body().string();
                BaseBean<ArrayList<ArticleBean>> result = new Gson().fromJson(json, new TypeToken<BaseBean<ArrayList<ArticleBean>>>() {
                }.getType());
                setData(result.getData());
            }
        });
    }

    private void setData(ArrayList<ArticleBean> data) {
        mList.clear();
        mList.addAll(data);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mAdapter.notifyDataSetChanged();
            }
        });
    }
}
```

### MVC 缺点

- MVC三者相互关联耦合，可能会导致后期维护困难。
- 同时在 Android 中，Activity 和 Fragment 需要同时承担 View 和 Controller 逻辑处理，会导致其代码臃肿。



## MVP 架构设计

### MVP 角色

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e2e25ab6a474aafb1a14ae3177ba078.png)

| 角色          | 说明                                           |
| ------------- | ---------------------------------------------- |
| Model（模型） | 负责请求数据和处理数据，不包含任何UI信息。     |
| View（视图）  | 负责显示数据和UI交互，通常是Activity和Fragment |
| Presenter     | Presenter是Model和View之间的桥梁，负责业务逻辑 |

### MVP 代码

**代码结构：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/43981a24bd9d42bbabce1c75dcaa8208.png)

#### 封装View层：

```java
public abstract class BaseActivity extends AppCompatActivity implements HandlerAction {
    public static final int NO_LAYOUT = -1;
    protected Context mContext;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        if (getLayoutId() != NO_LAYOUT) {
            setContentView(getLayoutId());
            initViews();
        }
        initData(savedInstanceState);
    }


    /**
     * 获取布局id
     */
    @LayoutRes
    protected abstract int getLayoutId();

    /**
     * 初始化View
     */
    protected abstract void initViews();

    /**
     * 初始化数据
     */
    protected abstract void initData(Bundle savedInstanceState);
    
    /**
     * 添加Fragment到Activity里
     */
    protected void addFragmentToActivity(@IdRes int id, @NonNull Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.add(id, fragment);
        transaction.commit();
    }
}
```

```java
public abstract class BaseMvpActivity<P extends BasePresenter> extends BaseActivity {
    private P mPresenter;

    @Override
    protected void initViews() {
        mPresenter = createPresenter();
        if (mPresenter != null) {
            mPresenter.attachView(this);
        }
        initMvpViews();
    }

    protected abstract void initMvpViews();

    /**
     * 创建Presenter
     */
    protected abstract P createPresenter();

    protected P getPresenter() {
        return mPresenter;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mPresenter != null) {
            mPresenter.detachView();
            mPresenter = null;
        }
    }
}
```

#### 封装Presenter层：

```java
public class BasePresenter<V> {
    private WeakReference<V> mRef;

    public void attachView(V view) {
        mRef = new WeakReference<>(view);
    }

    public void detachView() {
        if (mRef != null) {
            mRef.clear();
            mRef = null;
        }
    }

    public boolean isViewAttached() {
        return mRef != null && mRef.get() != null;
    }

    public V getView() {
        return mRef.get();
    }
}
```

#### 定义契约接口，关联MVP：

```java
public interface ArticlesContract {

    /**
     * Model层接口
     */
    interface IArticlesModel {
        void getArticles(@NonNull ArticlesCallback callback);
    }

    /**
     * View层接口
     */
    interface IArticlesView {
        void showLoading();

        void hideLoading();

        void articlesSuccess(Response<ArrayList<ArticleBean>> success);

        void articlesError(String error);
    }

    /**
     * Presenter层接口
     */
    interface IArticlesPresenter {
        void getArticles();
    }

    /**
     * 回调接口
     */
    interface ArticlesCallback {
        void onSuccess(Response<ArrayList<ArticleBean>> success);

        void onError(String error);
    }
}
```

#### 使用View层：

```java
public class ArticlesMvpActivity extends BaseMvpActivity<ArticlesPresenter> implements ArticlesContract.IArticlesView {
    private ArticleAdapter mAdapter;
    private final ArrayList<ArticleBean> mList = new ArrayList<>();

    @Override
    protected int getLayoutId() {
        return R.layout.activity_articles_mvp;
    }

    @Override
    protected void initMvpViews() {
        Button btnGetData = findViewById(R.id.btn_get_data);
        RecyclerView rvArticles = findViewById(R.id.rv_articles);

        btnGetData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showLoading();
                getPresenter().getArticles();
            }
        });

        mAdapter = new ArticleAdapter(this, mList);
        rvArticles.setAdapter(mAdapter);
    }

    @Override
    protected void initData(Bundle savedInstanceState) {

    }

    @NotNull
    @Override
    protected ArticlesPresenter createPresenter() {
        return new ArticlesPresenter();
    }

    private ProgressDialog progressDialog;

    @Override
    public void showLoading() {
        runOnUiThread(() -> {
            if (progressDialog == null) {
                progressDialog = new ProgressDialog(mContext);
                progressDialog.setMessage("加载中");
            }
            progressDialog.show();
        });
    }

    @Override
    public void hideLoading() {
        runOnUiThread(() -> {
            if (progressDialog != null && progressDialog.isShowing()) {
                progressDialog.hide();
            }
        });
    }

    @Override
    public void articlesSuccess(Response<ArrayList<ArticleBean>> success) {
        post(new Runnable() {
            @Override
            public void run() {
                hideLoading();
                mList.clear();
                mList.addAll(success.getData());
                mAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    public void articlesError(String error) {
        post(new Runnable() {
            @Override
            public void run() {
                hideLoading();
                Toast.makeText(mContext, error, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

#### 使用Model层：

```java
public class ArticlesModel implements ArticlesContract.IArticlesModel {

    @Override
    public void getArticles(@NotNull ArticlesContract.ArticlesCallback callback) {
        final String url = "https://wanandroid.com/wxarticle/chapters/json";
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(url)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                callback.onError(e.getMessage());
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull okhttp3.Response response) throws IOException {
                String json = response.body().string();
                Response<ArrayList<ArticleBean>> bean = new Gson().fromJson(json, new TypeToken<Response<ArrayList<ArticleBean>>>() {
                }.getType());
                callback.onSuccess(bean);
            }
        });
    }
}
```

#### 使用Presenter层：

```java
public class ArticlesPresenter extends BasePresenter<ArticlesMvpActivity> implements ArticlesContract.IArticlesPresenter {
    private final ArticlesModel mArticlesModel;

    public ArticlesPresenter() {
        mArticlesModel = new ArticlesModel();
    }

    @Override
    public void getArticles() {
        mArticlesModel.getArticles(new ArticlesContract.ArticlesCallback() {
            @Override
            public void onSuccess(Response<ArrayList<ArticleBean>> success) {
                if (isViewAttached()) {
                    getView().articlesSuccess(success);
                }
            }

            @Override
            public void onError(String error) {
                if (isViewAttached()) {
                    getView().articlesError(error);
                }
            }
        });
    }
}
```

#### 在Fragment中使用：

```java
public abstract class BaseFragment extends Fragment implements HandlerAction {
    protected Context mContext;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        mContext = context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(getLayoutId(), container, false);
        initViews(rootView);
        initData();
        return rootView;
    }

    /**
     * 获取布局id
     */
    @LayoutRes
    protected abstract int getLayoutId();

    /**
     * 初始化View
     */
    protected abstract void initViews(View rootView);

    /**
     * 初始化数据
     */
    protected abstract void initData();
}
```

```java
public abstract class BaseMvpFragment<P extends BasePresenter> extends BaseFragment {
    private P mPresenter;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mPresenter = createPresenter();
        if (mPresenter != null) {
            mPresenter.attachView(this);
        }
    }

    protected abstract P createPresenter();

    protected P getPresenter() {
        return mPresenter;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mPresenter != null) {
            mPresenter.detachView();
            mPresenter = null;
        }
    }
}
```

```java
public class ArticlesFragment extends BaseMvpFragment<ArticlesPresenter> implements ArticlesContract.IArticlesView {
    private ArticleAdapter mAdapter;
    private final ArrayList<ArticleBean> mList = new ArrayList<>();
    private ProgressDialog progressDialog;

    public static ArticlesFragment newInstance() {
        return new ArticlesFragment();
    }

    @Override
    protected ArticlesPresenter createPresenter() {
        return new ArticlesPresenter();
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_articles_mvp;
    }

    @Override
    protected void initViews(View rootView) {
        Button btnGetData = rootView.findViewById(R.id.btn_get_data);
        RecyclerView rvArticles = rootView.findViewById(R.id.rv_articles);

        btnGetData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showLoading();
                getPresenter().getArticles();
            }
        });

        mAdapter = new ArticleAdapter(mContext, mList);
        rvArticles.setAdapter(mAdapter);
    }

    @Override
    protected void initData() {

    }

    @Override
    public void showLoading() {
        if (progressDialog == null) {
            progressDialog = new ProgressDialog(mContext);
            progressDialog.setMessage("加载中");
        }
        progressDialog.show();
    }

    @Override
    public void hideLoading() {
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.hide();
        }
    }

    @Override
    public void articlesSuccess(Response<ArrayList<ArticleBean>> success) {
        post(new Runnable() {
            @Override
            public void run() {
                hideLoading();
                mList.clear();
                mList.addAll(success.getData());
                mAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    public void articlesError(String error) {
        post(new Runnable() {
            @Override
            public void run() {
                hideLoading();
                Toast.makeText(mContext, error, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

```java
public class ArticlesPresenter extends BasePresenter<ArticlesFragment> implements ArticlesContract.IArticlesPresenter {
    private ArticlesModel mArticlesModel;

    public ArticlesPresenter() {
        mArticlesModel = new ArticlesModel();
    }

    @Override
    public void getArticles() {
        mArticlesModel.getArticles(new ArticlesContract.ArticlesCallback() {
            @Override
            public void onSuccess(Response<ArrayList<ArticleBean>> success) {
                if (isViewAttached()) {
                    getView().articlesSuccess(success);
                }
            }

            @Override
            public void onError(String error) {
                if (isViewAttached()) {
                    getView().articlesError(error);
                }
            }
        });
    }
}
```


### MVP 优点

- 让 Model 与 View 的彻底耦合。
- 代码结构清晰，极大简化了Activity/Fragment。



## MVP+RxJava+Retrofit

![在这里插入图片描述](https://img-blog.csdnimg.cn/b8436d1572d84ce28beaf3410ebc1109.png)



## [源码下载](https://github.com/xiangxiongfly/Android_ArchitectureDesign)

