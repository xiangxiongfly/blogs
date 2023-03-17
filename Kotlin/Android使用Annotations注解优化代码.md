[TOC]

# Android使用Annotations注解优化代码

## Null 注解

- `@Nullable`注解用于标识参数或返回值可以为null。
- `@NonNull`注解用于标识参数或返回值不能为null，否则IDE提示警告。

```java
@Nullable
private String test1(@Nullable String param) {
    return null;
}

@NonNull
private String test2(@NonNull String param){
    return "abc";
}
```



## Typedef 注解

枚举Enum在Java中是一个完整的类，相比常量整数消耗更多的内存，可以使用Typedef注解替代枚举。

- `@IntDef`
- `@LongDef`
- `@StringDef`

```java
final public class SexType {
    public static final int UNKNOWN = 0;
    public static final int BOY = 1;
    public static final int GIRL = 2;
}

@IntDef({UNKNOWN, BOY, GIRL})
@Retention(RetentionPolicy.SOURCE)
@interface Sex {
}
```

```java
private void test(@Sex int sex) {
}

test(SexType.UNKNOWN);
test(1); //提示警告
```



## Resource Type 注解

资源类型在Android中作为整型值来传递，这意味着在传递的过程中容易出错，且编译器很难区分，使用Resource Type 注解可以提供类型检查。

```java
private void test(@StringRes int strRes) {
}

test(R.string.app_name);
test(123); //红线警报
```

- `@AnimatorRes`：属性动画资源类型。
- `@AnimRes`：动画资源类型。
- `@ArrayRes`：数组资源类型。
- `@AttrRes`：属性资源类型。
- `@BoolRes`：布尔资源类型。
- `@ColorRes`：颜色资源类型。
- `@DimenRes`：尺寸资源类型。
- `@DrawableRes`：图像资源类型。
- `@IdRes`：id类型。
- `@IntegerRes`：整数资源类型。
- `@LayoutRes`：布局资源类型。
- `@RawRes`：Raw资源类型。
- `@StringRes`：字符串资源类型。
- `@StyleRes`：样式资源类型。
- `@StyleableRes`：样式资源类型。
- `@XmlRes`：xml资源类型。
- `@AnyRes`：任意资源类型。



## Threading 注解

- `@UiThread`：UI线程注解。
- `@MainThread`：主线程注解。
- `@WorkerThread`：子线程注解。
- `@BinderThread`：绑定线程。



## Value Constraints 注解

- `@IntRange`：限制整数取值范围。
- `@FloatRange`：限制小数取值范围。
- `@Size`：限制集合数量。

```kotlin
private void test(@IntRange(from = 1, to = 100) int param) {
}

test(50);
test(0); //提示警报
test(200); //提示警报
```

```java
private void test(@Size(min = 2, max = 4) String str) {
}

test("abc");
test("a"); //提示警报
```



## Overriding Methods 注解

- `@CallSuper`：表示重写该方法时，必须调用`super`。

```java
class Base{
    @CallSuper
    public void onCreate(){
    }
}

class Child extends Base{

    @Override
    public void onCreate() {
        //super.onCreate();
        /*
        被@CallSuper注解的方法，当删除super方法时会提示警报
         */
    }
}
```



## Return Values 注解

- `@CheckResult`注解表示期待返回值做处理。

```java
@CheckResult
private String test() {
    return "hello world";
}

String ret = test();
test(); //提示警报
```



## Keep 注解

- 当Android开启代码混淆，会出现代码被混淆、删除没有用的代码，可以使用`@Keep`注解避免此情况。



## Permissions 注解

- 可以通过`@RequiresPermission`注解提示开发者需要指定的权限。

**必须调用权限**

```java
@RequiresPermission(Manifest.permission.CALL_PHONE)
public void test() {

}
```

**需要多个权限**

```java
@RequiresPermission(allOf = {
    Manifest.permission.CALL_PHONE,
    Manifest.permission.CAMERA
})
public void test() {

}
```

**至少一个权限**

```java
@RequiresPermission(anyOf = {
    Manifest.permission.CALL_PHONE,
    Manifest.permission.CAMERA
})
public void test() {

}
```

