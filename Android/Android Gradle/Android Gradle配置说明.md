[TOC]

# Android Gradle配置说明

## 概述

Gradle是一个基于JVM运行的构建工具，使用java编写；

脚本语言(DSL)使用Groovy(.gradle)、Kotlin(.gradle.kts)编写，都是高级语言，都是面向对象编程；

Gradle中的核心对象是`Task`，Task是Gradle中最小的构建单元，Action是最小的执行单元；

Gradle中的`Project`对应一个工程，是树形结构，可以向下或向上遍历，还用来关联Task；

Gradle提供了很好的扩展能力，可以根据需求自定义插件及配置；

Gradle在各个`生命周期`阶段提供了丰富的回调，对于切面处理的扩展很有帮助；

 

## 目录结构

<img src="https://img-blog.csdnimg.cn/20210320101631713.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70" width="50%"/>

- 项目`build.gradle`：配置项目的整体属性，比如指定使用的代码仓库、依赖的gradle插件等。
- 模块`builde.gradle`：配置当前模块。
- `gradle-wrapper.properites`：配置gradle版本信息等。
- `gradle.properties`：配置gradle编译参数。
- `settings.gradle`：管理项目和模块。
- `local.properties`：配置SDK路径。



### 项目build.gradle

```groovy
//构建时的依赖
buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        //gradle插件版本
        classpath "com.android.tools.build:gradle:4.1.2"
    }
}

//项目的依赖
allprojects {
    repositories {
        google()
        jcenter()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```



### 模块build.gradle

```groovy
//声明是一个应用模块
plugins {
    id 'com.android.application'
}

android {
    //编译时SDK版本
    compileSdkVersion 30
    //Android构建工具版本
    buildToolsVersion "30.0.3"

    defaultConfig {
        //App唯一id/包名
        applicationId "com.example.myapplication"
        //App支持最低SDK版本
        minSdkVersion 21
        //基于SDK开发版本
        targetSdkVersion 30
        //内部版本号，控制App升级
        versionCode 1
        //版本名称，展示给用户
        versionName "1.0"
    }

    //配置签名文件
    signingConfigs {
        release {
            //签名文件
            storeFile file('./key.jks')
            //签名文件密码
            storePassword "111111"
            //别名
            keyAlias "app"
            //别名密码
            keyPassword "123456"
        }

        debug {
            storeFile file('./key.jks')
            storePassword "111111"
            keyAlias "app"
            keyPassword "123456"
        }
    }

    //构建不同类型的apk
    buildTypes {
        release {
            //设置签名文件
            signingConfig signingConfigs.release
            //开启混淆
            minifyEnabled true
            //配置混淆文件
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'

            //配置清理未使用的资源
            minifyEnabled true
            shrinkResources true
            //开启zipalign优化
            zipAlignEnabled true
        }
        debug {
            signingConfig signingConfigs.debug
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'            
            //配置appcationId的后缀
            applicationIdSuffix '.debug'
            //配置versionName的后缀
            versionNameSuffix "_debug"
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    //依赖libs目录下的jar包
    implementation fileTree(include: ['*.jar'], dir: 'libs')

    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'com.google.android.material:material:1.2.1'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
    testImplementation 'junit:junit:4.+'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
}
```

- implementation可以让module在编译时隐藏自己使用的依赖，但是在运行时这个依赖对所有模块是可见的。而api与compile一样，无法隐藏自己使用的依赖。
- 如果使用api，一个module发生变化，这条依赖链上所有的module都需要重新编译，而使用implemention，只有直接依赖这个module需要重新编译。



**如果你觉得jks密码放在`build.gradle里`不安全，可以把相关密码放在不加入版本控制系统的`gradle.properties`文件里：**

```groovy
STORE_PASSWORD=xxxxxx
KEY_PASSWORD=xxxxxx
```

```groovy
release {
    storeFile file("hello.jks") // jks路径
    storePassword STORE_PASSWORD // jks密码
    keyAlias "xx" // 别名
    keyPassword KEY_PASSWORD //别名密码
}
```





## 自定义输出apk名称

```groovy
//applicationVariants Android应用Gradle插件
applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith(".apk")) {
            def appName = "test"
            def buildType = variant.buildType.name
            def versionName = defaultConfig.versionName
            def versionCode = defaultConfig.versionCode
            def buildTime = new Date().format("yyyyMMdd")
            outputFileName = "${appName}_${buildType}_v${versionName}_${versionCode}_${buildTime}.apk"
        }
    }
}
```





## gradle依赖管理

gradle默认是支持依赖传递的，如项目C依赖项目B，项目B依赖项目A，这样可能会导致重复依赖、依赖错误等问题。

### 禁止依赖传递

```groovy
//禁止指定库依赖传递
implementation('com.xxx.xxx:xxx:1.1.1') {
    transitive false
}
```

```groovy
//关闭当前模块等依赖传递
configurations.all {
    transitive = false
}
```



### 处理依赖冲突

```groovy
configurations {
    all*.exclude group: 'com.android.support', module: 'support-annotations'
}
```





## 全局配置

在根目录下新建`config.gradle`文件，并添加代码:

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

在根目录下的`build.gradle`里加在：

```groovy
apply from: "config.gradle"
```



在module中使用：

```groovy
android {
    compileSdkVersion rootProject.ext.android["compileSdkVersion"]

    defaultConfig {
        applicationId rootProject.ext.android["applicationId"]
        minSdkVersion rootProject.ext.android["minSdkVersion"]
        targetSdkVersion rootProject.ext.android["targetSdkVersion"]
        versionCode rootProject.ext.android["versionCode"]
        versionName rootProject.ext.android["versionName"]
    }
}
```

在dependencies 节点的使用：

```groovy
dependencies {
    implementation rootProject.ext.dependencies["appcompat"]
    implementation rootProject.ext.dependencies["material"]
    implementation rootProject.ext.dependencies["circleimageview"]
}
```



## implementation、api区别

**api：支持传递依赖**

例如：模块app依赖library1，library1依赖library2，那么app可以调用library2的api。同时library2的代码改变会导致app的重新编译。

**implementation：不支持传递依赖**

例如：模块app依赖library1，library1依赖library2，app不能调用library2的api。



## productFlavors

在Android Studio中创建一个新项目时，applicationId默认是和项目的包名一致的。所以常常有开发者会将两者混淆，以为它们是一个概念。实际上应用ID和包名是相互独立的。改变包名不会影响应用ID，反之亦然。

- flavorDimensions：风味维度，新版本Android必须指定一个维度
- productFlavors：风味，配置多渠道

### 单维度

**配置多渠道**

```groovy
flavorDimensions 'channel'

productFlavors {
    xiaomi {
        applicationId 'com.test.appid_xiaomi'
        buildConfigField "String", "baseUrl", '"www.xiaomi.com"'
        resValue "string", "tip", "hello 小米"
        manifestPlaceholders = [CHANNEL_VALUE: "xiaomi",
                                APP_NAME     : "小米"]
    }
    huawei {
        applicationId 'com.test.appid_huawei'
        buildConfigField "String", "baseUrl", '"www.huawei.com"'
        resValue "string", "tip", "hello 华为"
        manifestPlaceholders = [CHANNEL_VALUE: "huawei",
                                APP_NAME     : "华为"]
    }
}
```

**替换manifest文件**

```xml
<application
             android:allowBackup="true"
             android:icon="@mipmap/ic_launcher"
             android:label="${APP_NAME}"
             android:supportsRtl="true"
             android:theme="@style/Theme.MyApplication">
    <meta-data
               android:name="CHANNEL"
               android:value="@{CHANNEL_VALUE}" />
</application>
```

**BuildConfig配置常量**

```java
Log.e("TAG", "baseUrl " + BuildConfig.baseUrl);
Button button = findViewById(R.id.button);
button.setText(getString(R.string.tip));
```

**定制apk名称**


```groovy
applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith(".apk")) {
            //渠道名
            def flavorsName = variant.productFlavors[0].name
            outputFileName = "app_${flavorsName}.apk"
        }
    }
}
```





### 多维度

```groovy
flavorDimensions 'channel', 'app'

productFlavors {

    v1 {
        dimension "app"
        applicationId 'com.test.appid_v1'
    }

    v2 {
        dimension "app"
        applicationId 'com.test.appid_v2'
    }

    xiaomi {
        dimension "channel"
        applicationId 'com.test.appid_xiaomi'
        manifestPlaceholders = [CHANNEL_VALUE: "xiaomi",
                                APP_NAME     : "小米"]
        buildConfigField "String", "baseUrl", '"www.xiaomi.com"'
    }

    huawei {
        dimension "channel"
        applicationId 'com.test.appid_huawei'
        manifestPlaceholders = [CHANNEL_VALUE: "huawei",
                                APP_NAME     : "华为"]
        buildConfigField "String", "baseUrl", '"www.huawei.com"'
    }
}
```

```java
public final class BuildConfig {
    public static final boolean DEBUG = Boolean.parseBoolean("true");
    public static final String APPLICATION_ID = "com.test.appid_huawei.debug";
    public static final String BUILD_TYPE = "debug";
    public static final String FLAVOR = "huaweiV1";
    public static final String FLAVOR_channel = "huawei";
    public static final String FLAVOR_app = "v1";
    public static final int VERSION_CODE = 1;
    public static final String VERSION_NAME = "1.0_debug";
    // Field from product flavor: huawei
    public static final String baseUrl = "www.huawei.com";
}
```

