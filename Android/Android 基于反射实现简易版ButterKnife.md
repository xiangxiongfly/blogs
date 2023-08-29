[TOC]

# Android 基于反射实现简易版ButterKnife

反射比较消耗资源，一般不推荐使用。

## 定义注解

```java
/**
 * 用于绑定元素
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface BindView {
    @IdRes int value();
}
```

```java
/**
 * 定义元注解
 */
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface EventType {
    Class methodClass(); //方法所在的Class

    String methodName(); //方法名
}
```

```java
/**
 * 绑定点击事件
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@EventType(methodClass = View.OnClickListener.class, methodName = "setOnClickListener")
public @interface OnClick {
    @IdRes int[] value() default {};
}
```

```java
/**
 * 绑定长按事件
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@EventType(methodClass = View.OnLongClickListener.class, methodName = "setOnLongClickListener")
public @interface OnLongClick {
    @IdRes int[] value() default {};
}
```



## 定义绑定类解析注解

```java
public class MyButterKnife {
    public static void bind(Activity activity) {
        //获取类中所有变量
        Field[] fields = activity.getClass().getDeclaredFields();
        //获取类中所有方法
        Method[] methods = activity.getClass().getDeclaredMethods();

        bindFields(activity, fields);
        bindMethods(activity, methods);
    }

    /**
     * 绑定变量
     *
     * @param activity
     * @param fields
     */
    private static void bindFields(Activity activity, Field[] fields) {
        for (Field field : fields) {
            //判断是否被@BindView注解
            if (field.isAnnotationPresent(BindView.class)) {
                //获取@BindView注解
                BindView bindView = field.getAnnotation(BindView.class);
                if (bindView != null) {
                    //设置访问权限
                    if (!field.isAccessible()) {
                        field.setAccessible(true);
                    }
                    //获取注解值
                    int id = bindView.value();
                    //获取View
                    View view = activity.findViewById(id);
                    try {
                        //通过反射设置值
                        field.set(activity, view);
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
     * 绑定方法
     *
     * @param activity
     * @param methods
     */
    private static void bindMethods(Activity activity, Method[] methods) {
        for (Method method : methods) {
            //判断是否被@OnClick或@OnLongClick注解
            if (method.isAnnotationPresent(OnClick.class) || method.isAnnotationPresent(OnLongClick.class)) {
                //获取方法上的所有注解
                Annotation[] annotations = method.getAnnotations();
                //遍历注解
                for (Annotation annotation : annotations) {
                    //获取注解的注解类型
                    Class<? extends Annotation> annotationType = annotation.annotationType();
                    //判断注解是否为@EventType
                    if (annotationType.isAnnotationPresent(EventType.class)) {
                        //获取EventType注解
                        EventType eventType = annotationType.getAnnotation(EventType.class);
                        assert eventType != null;
                        //获取方法的Class
                        Class methodClass = eventType.methodClass();
                        //获取方法名
                        String methodName = eventType.methodName();
                        //设置访问权限
                        method.setAccessible(true);

                        try {
                            //获取OnClick或OnLongClick的value值
                            Method valueMethod = annotationType.getDeclaredMethod("value");
                            //获取绑定的id
                            int[] viewIds = (int[]) valueMethod.invoke(annotation);
                            //代理对象
                            Object proxy = Proxy.newProxyInstance(methodClass.getClassLoader(),
                                    new Class[]{methodClass},
                                    new InvocationHandler() {
                                        @Override
                                        public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
                                            return method.invoke(activity, args);
                                        }
                                    });
                            assert viewIds != null;
                            //遍历id并绑定事件
                            for (int id : viewIds) {
                                //获取Activity的View
                                View view = activity.findViewById(id);
                                //获取指定方法，如setOnClickListener方法，参数类型是OnClickListener
                                Method clickMethod = view.getClass().getMethod(methodName, methodClass);
                                //执行方法
                                clickMethod.invoke(view, proxy);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }
}
```

## 使用

```java
public class MainActivity extends AppCompatActivity {
    @BindView(R.id.textView)
    TextView textView;

    @BindView(R.id.imageView)
    ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        MyButterKnife.bind(this);

        textView.setText("hello");
        imageView.setImageResource(R.mipmap.ic_launcher);
    }

    @OnClick({R.id.btn1, R.id.btn2})
    public void click(View view) {
        switch (view.getId()) {
            case R.id.btn1:
                Toast.makeText(this, "btn1 click", Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn2:
                Toast.makeText(this, "btn2 click", Toast.LENGTH_SHORT).show();
                break;
        }
    }

    @OnLongClick({R.id.btn1, R.id.btn2})
    public boolean longClick(View view) {
        switch (view.getId()) {
            case R.id.btn1:
                Toast.makeText(this, "btn1 longClick", Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn2:
                Toast.makeText(this, "btn2 longClick", Toast.LENGTH_SHORT).show();
                break;
        }
        return true;
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyButterKnifeProject)

