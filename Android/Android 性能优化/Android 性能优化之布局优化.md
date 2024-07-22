[toc]

# Android 性能优化之布局优化

## 绘制原理

- CPU：负责执行应用层的measure、layout、draw等操作，将绘制的数据交给GPU处理。
- GPU：进一步处理数据，并缓存数据。
- 屏幕：由一个个像素点组成的，以固定的频率（16.6ms，1秒60帧）从缓冲区获取数据填充像素点。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d851084475524b20b21b8eaa24a0cedf.png)

## 双缓冲机制

GPU 向缓冲区写入数据的同时，屏幕也在向缓冲区读取数据，可能会导致屏幕上就会出现一部分是前一帧的画面，一部分是另一帧的画面。

因此 Android 系统使用双缓冲机制，GPU 只向`Back Buffer`中写入绘制数据，且 GPU 会定期交换`Back Buffer`和`Frame Buffer`，交换的频率也是60次/秒，这就与屏幕的刷新频率保持了同步。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b6c3320497d246108619bc3424b986f1.png)

GPU 向 Back Buffer 写入数据时，系统会锁定 Back Buffer，如果布局比较复杂或设备性能较差时，CPU 不能保证16.6ms内完成计算，因此到了 GPU 交换两个 Buffer 的时间点，GPU 就会发现 Back Buffer 被锁定了，会放弃这次交换，也就是掉帧。



## 布局加载原理

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/67f4b440fb54443a8eb9ebf0f826abe2.png)

- 解析XML文件，涉及 IO 操作。
- 通过 createViewFromTag() 创建View，用到了反射机制。





## 检测耗时

### 常规方式

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        long start = System.currentTimeMillis();
        setContentView(R.layout.activity_main);
        long time = System.currentTimeMillis() - start;
        Log.e("TAG", "setContentView耗时：" + time);
    }
}
```

### AOP方式

**使用第三方框架：**

https://github.com/FlyJingFish/AndroidAOP

**定义切面类：**

```java
@AndroidAopMatchClassMethod(
        targetClassName = "androidx.appcompat.app.AppCompatActivity",
        methodName = {"setContentView"},
        type = MatchType.SELF
)
public class MatchSetContentView implements MatchClassMethod {
    @Nullable
    @Override
    public Object invoke(@NonNull ProceedJoinPoint proceedJoinPoint, @NonNull String methodName) {
        Class<?> targetClass = proceedJoinPoint.getTargetClass();
        long start = System.currentTimeMillis();
        proceedJoinPoint.proceed();
        long time = System.currentTimeMillis() - start;
        Log.e("TAG", targetClass.getSimpleName() + "#" + methodName + "耗时：" + time);
        return null;
    }
}
```

### 获取控件加载耗时

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        LayoutInflaterCompat.setFactory2(getLayoutInflater(), new LayoutInflater.Factory2() {
            @Nullable
            @Override
            public View onCreateView(@Nullable View parent, @NonNull String name, @NonNull Context context, @NonNull AttributeSet attrs) {
                long start = System.nanoTime();
                View view = getDelegate().createView(parent, name, context, attrs);
                Log.e("TAG", name + "耗时：" + (System.nanoTime() - start) + "ns");
                return view;
            }

            @Nullable
            @Override
            public View onCreateView(@NonNull String name, @NonNull Context context, @NonNull AttributeSet attrs) {
                return null;
            }
        });
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```



## 布局优化

**优化思路：**

- IO 优化。
- 反射优化。

### AsyncLayoutInflater方案

AsyncLayoutInflater 是 Android 提供的一个异步加载布局的类，它允许在 UI 线程之外加载和解析 XML 布局文件，减少主线程的阻塞，从而提高应用的响应性能。

**添加依赖库：**

```groovy
implementation "androidx.asynclayoutinflater:asynclayoutinflater:1.0.0"
```

**使用：**

```java
new AsyncLayoutInflater(this).inflate(R.layout.activity_main, null, new AsyncLayoutInflater.OnInflateFinishedListener() {
    @Override
    public void onInflateFinished(@NonNull View view, int resid, @Nullable ViewGroup parent) {
        setContentView(view);
    }
});
```

**缺点：**

- 兼容性一般。
- 牺牲了易用性。

### Compose方案

- 新一代UI，声明式UI。
- 去掉了 XML。

### 减少布局层级和复杂度

- 使用 ConstraintLayout 可以实现扁平化布局，减少层级。
- 使用 RelativeLayout 减少嵌套。
- 嵌套的 LinearLayout 尽量少用 weight 属性，因为 weight 会重复测量。
- 使用 merge 标签减少布局层级。
- 使用 ViewStub 标签进行延迟加载。
- 使用 include 标签提取复用布局。

### 避免过度绘制

- 去掉多余的背景色，减少复杂 shape 的使用。
- 避免层级叠加。
- 自定义 View 使用 clipRect 屏蔽被遮盖 View 绘制。

