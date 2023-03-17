[TOC]

# Android 代码混淆总结

## 混淆优点

- 增加反编译的成本，修改了类类、方法名、属性名。
- 缩小apk包体积，会删除无用的类、方法、数学。
- 应用运行更快，对字节码进行优化，删除无用指令。



## 混淆影响元素

- 类名
- 变量名
- 方法名
- 包名
- 其他元素



## 混淆前后对比

**混淆前：**![在这里插入图片描述](https://img-blog.csdnimg.cn/bf8a2ea5949b4d3e976593b4cb963e5f.png)

**混淆后：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/47024a232f16426cbc3253c1c13e9f04.png)

混淆前后对比，明显发现混淆后apk体积变小了，部分名字被转为abcd了。



## 开启混淆

```groovy
release {
	//签名配置
    signingConfig signingConfigs.release
    //开启混淆
    minifyEnabled true
    //资源压缩，移除未使用资源，需要配合minifyEnabled true使用
    shrinkResources true
    //混淆规则
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
}
```

混淆后的项目会在 **`build\outputs\mapping\release`** 输出下述文件：

- **mapping.txt** → 原始与混淆过的类、方法、字段名称间的转换；
- **seeds.txt** → 未进行混淆的类与成员；
- **usage.txt** → APK中移除的代码；
- **resources.txt** → 资源优化记录文件，哪些资源引用了其他资源，哪些资源在使用，哪些资源被移除；

**Tips**：上述文件不一定都有，R8可以在 **`proguard-rules.pro`** 文件添加下述配置输出对应文件：

```bash
# 输出mapping.txt文件
-printmapping ./build/outputs/mapping/mapping.txt

# 输出seeds.txt文件
-printseeds ./build/outputs/mapping/seeds.txt

# 输出usage.txt文件
-printusage ./build/outputs/mapping/usage.txt
```



## 混淆规则

### 语法

```
[keep命名] [类] {
	[成员]
}
```

### 保持命令

```
-keep #防止类和类成员被移除或混淆
-keepnames #
```

### 混淆元素

- “类”表示的限定条件：
  - 具体的类
  - 访问修饰符（public/protected/privite）
  - 通配符`*`，匹配任意长度字符，但不包含包名分隔符`.`
  - 通配符`**`，匹配任意长度字符，且包含包名分隔符`.`
  - `extends`，匹配继承基类的类
  - `implement`，匹配实现接口的类
  - `$`，匹配内部类
- “成员”表示类成员相关的限定条件
  - 匹配所有构造函数
  - 匹配所有域
  - 匹配所有方法
  - 通配符`*`，匹配任意长度字符，但不包含包名分隔符`.`
  - 通配符`**`，匹配任意长度字符，且包含包名分隔符`.`
  - 通配符`***`，匹配任意参数类型
  - `...`匹配任意长度的任意类型参数，如`void test(...)`表示匹配`void test(String a)`或者`void test(int a, String a)`等方法
  - 访问修饰符（public/protected/private）
  - `<init>` 构造函数
  - `<methods>` 方法
  - `<fields>` 字段

### 案例

```
#管理bugly SDK的警告
-dontwarn com.tencent.bugly.**

#不混淆某个类，但成员变量和成员方法会被混淆
-keep class com.example.app.Demo

#不混淆某个类和类里的成员变量、成员方法
-keep public class com.example.app.Demo {*;}

#不混淆某个类的子类和类里的成员变量、成员方法
-keep public class * extends com.example.app.base {*;}

#不混淆某个包下的类和子包
-keep class com.example.app.bean.** {*;}

#不混淆所有类名中包含model关键字的类
-keep class **.*model*.** {*;}

#不混淆某个接口实现的类
-keep class * implements com.example.app.IMyInterface {*;}

#不混淆类的成员变量和方法，但类名会被混淆
-keepclassmembers class com.example.app.Test {
	*;
}

#不混淆某个类的构造函数
-keepclassmembers class com.example.app.Test {
	public <init>();
}

#不混淆某个类的构造函数的参数为int类型
-keepclassmembers class com.example.app.Test {
	public <init>(int);
}

#不混淆某个类的构造函数
-keep class com.example.app.Test {
	<init>(***);
	<init>(***,***);
}

#不混淆某个类的所有public成员和方法
-keepclassmembers class com.example.app.Test {
	public *;
}

#不混淆某个类的public方法和private字段
-keepclassmembers class com.example.app.Test {
	public <methods>;
	private <fields>;
}

#不混淆某个类里的特定方法
-keepclassmembers class com.example.app.Test {
	public void test(java.lang.String);
}

#不混淆某个类里的内部类
-keep class com.example.Test$* {*;}

#不混淆get/set方法
-keep class com.example.Test {
	void set*(***);
	*** get*();
}
```



## 常用混淆配置

### 混淆规则

1. 四大组件不能混淆
2. 自定义View不能混淆,因为在xml里面引用需要根据View的名字去找
3. menu不能混淆
4. native方法不能混淆
5. js调用java方法不能混淆
6. 反射类不能混淆
7. 实体类不能混淆
8. 序列化类不能混淆
9. 注解不能混淆



### 基本配置

```
# --------------------------------------------基本指令区--------------------------------------------#
-ignorewarnings                                      # 忽略警告
-optimizationpasses 5                               # 指定代码的压缩级别(在0~7之间，默认为5)
-dontusemixedcaseclassnames                         # 不使用大小写混合(windows大小写不敏感，建议加入)
-dontskipnonpubliclibraryclasses                    # 不混淆非公共的库的类
-dontskipnonpubliclibraryclassmembers               # 不混淆非公共的库的类的成员
-dontpreverify                                      # 混淆时不做预校验(Android不需要预校验，去掉可以加快混淆速度)
-verbose                                            # 混淆时记录日志(混淆后会生成映射文件)

#混淆时所采用的算法(谷歌推荐算法)
-optimizations !code/simplification/arithmetic,!field,!class/merging,!code/allocation/variable

#添加支持的jar(引入libs下的所有jar包)
-libraryjars libs(*.jar)

#将文件来源重命名为“SourceFile”字符串
-renamesourcefileattribute SourceFile

#保持注解不被混淆
-keepattributes *Annotation*
-keep class * extends java.lang.annotation.Annotation {*;}

#保持泛型不被混淆
-keepattributes Signature
#保持反射不被混淆
-keepattributes EnclosingMethod
#保持异常不被混淆
-keepattributes Exceptions
#保持内部类不被混淆
-keepattributes Exceptions,InnerClasses
#抛出异常时保留代码行号
-keepattributes SourceFile,LineNumberTable

#------------------------------------默认保留区--------------------------------------#
#保持四大组件不被混淆
-keep public class * extends android.app.Fragment
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference

#保持 Google 原生服务需要的类不被混淆
-keep public class com.google.vending.licensing.ILicensingService
-keep public class com.android.vending.licensing.ILicensingService

# 保留support下的所有类及其内部类,AndroidX
-keep class android.support.** {*;}
-dontwarn android.support.**
-keep interface android.support.** { *; }
-keep class androidx.** {*;}
-keep interface androidx.** {*;}
-keep public class * extends androidx.**
-dontwarn androidx.**

# 保留继承的
-keep public class * extends android.support.v4.**
-keep public class * extends android.support.v7.**
-keep public class * extends android.support.annotation.**
-keep class com.google.android.material.** {*;}
-dontwarn com.google.android.material.**
-dontnote com.google.android.material.**


# 保留本地native方法不被混淆
-keepclasseswithmembernames class * {
    native <methods>;
}

# 保留我们自定义控件（继承自View）不被混淆
-keep public class * extends android.view.View{
    *** get*();
    void set*(***);
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

#保留指定格式的构造方法不被混淆
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

#保留在Activity中的方法参数是view的方法(避免布局文件里面onClick被影响)
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

#保持枚举 enum 类不被混淆
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

#保持R(资源)下的所有类及其方法不能被混淆
-keep class **.R$* { *; }


#保持 Parcelable 序列化的类不被混淆(注：aidl文件不能去混淆)
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

#需要序列化和反序列化的类不能被混淆(注：Java反射用到的类也不能被混淆)
-keepnames class * implements java.io.Serializable

#保持 Serializable 序列化的类成员不被混淆
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

#保持 BaseAdapter 类不被混淆
-keep public class * extends android.widget.BaseAdapter { *; }
#保持 CusorAdapter 类不被混淆
-keep public class * extends android.widget.CursorAdapter{ *; }

#-------------------------------------webView区---------------------------------------#

#保护代码中的jsinterface注解不被混淆
-keepattributes *JavascriptInterface*

#WebView处理，项目中没有使用到webView忽略即可
#保持Android与JavaScript进行交互的类不被混淆
-keep class **.AndroidJavaScript { *; }
-keepclassmembers class * extends android.webkit.WebViewClient {
     public void *(android.webkit.WebView,java.lang.String,android.graphics.Bitmap);
     public boolean *(android.webkit.WebView,java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
     public void *(android.webkit.WebView,java.lang.String);
}

#网络请求相关
-keep public class android.net.http.SslError

#-------------------------------------删除代码区（可不配置）--------------------------------------#
删除代码中Log相关的代码
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}
```

```
#---------------------------------处理第三方框架 start------------------------------------
# ButterKnife
-keep class butterknife.** { *; }
-dontwarn butterknife.internal.**
-keep class **$$ViewBinder { *; }
-keepclasseswithmembernames class * {
    @butterknife.* <fields>;
}
-keepclasseswithmembernames class * {
    @butterknife.* <methods>;
}

# EventBus
-keepattributes *Annotation*
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# OkHttp3
-dontwarn com.squareup.okhttp3.**
-keep class com.squareup.okhttp3.** { *;}
-dontwarn okio.**

# Retrofit
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions


# RxJava RxAndroid
-dontwarn sun.misc.**
-keepclassmembers class rx.internal.util.unsafe.*ArrayQueue*Field* {
    long producerIndex;
    long consumerIndex;
}
-keepclassmembers class rx.internal.util.unsafe.BaseLinkedQueueProducerNodeRef {
    rx.internal.util.atomic.LinkedQueueNode producerNode;
}
-keepclassmembers class rx.internal.util.unsafe.BaseLinkedQueueConsumerNodeRef {
    rx.internal.util.atomic.LinkedQueueNode consumerNode;
}

# Glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.examples.android.model.** { <fields>; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# GreenDao
-keepclassmembers class * extends org.greenrobot.greendao.AbstractDao {
    public static java.lang.String TABLENAME;
}
-keep class **$Properties { *; }


#---------------------------------处理第三方框架 end------------------------------------
```



