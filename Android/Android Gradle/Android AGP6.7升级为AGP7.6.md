[toc]

# AGP6.7升级为AGP7.6

## 版本关系

### AGP插件版本与gradle版本

[官方文档](https://developer.android.google.cn/build/releases/gradle-plugin?hl=zh_cn)

| 插件版本 | 所需的最低 Gradle 版本 |
| :------- | :--------------------- |
| 8.5      | 8.7                    |
| 8.4      | 8.6                    |
| 8.3      | 8.4                    |
| 8.2      | 8.2                    |
| 8.1      | 8.0                    |
| 8.0      | 8.0                    |
| 7.4      | 7.5                    |
| 7.3      | 7.4                |
| 7.2      | 7.3.3              |
| 7.1      | 7.2                |
| 7.0      | 7.0                |
| 4.2.0+   | 6.7.1              |
| 4.1.0+   | 6.5+               |
| 4.0.0+   | 6.1.1+             |

### gradle版本与kotlin插件版本

[官方文档](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)

| KGP version   | Gradle min and max versions | AGP min and max versions |
| ------------- | --------------------------- | ------------------------ |
| 2.0.0         | 6.8.3–8.5                   | 7.1.3–8.3.1              |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                 | 4.2.2–8.1.0              |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                 | 4.2.2–7.4.0              |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                 | 4.1.3–7.4.0              |
| 1.8.0–1.8.11  | 6.8.3–7.3.3                 | 4.1.3–7.2.1              |
| 1.7.20–1.7.22 | 6.7.1–7.1.1                 | 3.6.4–7.0.4              |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                 | 3.4.3–7.0.2              |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                 | 3.4.3–7.0.2              |

### AGP插件版本与AS兼容性

| Android Studio 版本       | 所需的 AGP 版本 |
| :------------------------ | :-------------- |
| 考拉 \| 2024 年 1 月 1 日 | 3.2-8.5         |
| 水母 \| 2023 年 3 月 1 日 | 3.2-8.4         |
| Iguana \| 2023.2.1        | 3.2-8.3         |
| Hedgehog \| 2023.1.1      | 3.2-8.2         |
| Giraffe \| 2022.3.1       | 3.2-8.1         |
| Flamingo \| 2022.2.1      | 3.2-8.0         |
| Electric Eel \| 2022.1.1 | 3.2-7.4         |
| Dolphin \| 2021.3.1      | 3.2-7.3         |
| Chipmunk \| 2021.2.1     | 3.2-7.2         |
| Bumblebee \| 2021.1.1    | 3.2-7.1         |
| Arctic Fox \| 2020.3.1   | 3.1-7.0         |

















## 修改 settings.gradle
**AGP6.7:**

```groovy
rootProject.name = "project"
include ':APP'
```

**AGP7.6:**

```groovy
// 用于插件管理：
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
// 永远管理项目的依赖解析配置：
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "project"
include ':app'
```

## 修改 build.gradle

**AGP6.7:**

```groovy
// 用于配置构建脚本：
buildscript {
    ext {
        kotlin_version = '1.5.31'
        hiltVersion = "2.36"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:4.2.2"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        classpath "com.google.dagger:hilt-android-gradle-plugin:$hiltVersion"
    }
}
// 用于配置项目：
allprojects {
    repositories {
        maven { url 'https://jitpack.io' }
        google()
        mavenCentral()
        jcenter()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

**AGP7.6:**

```groovy
// 配置构建插件：
plugins {
    id 'com.android.application' version '7.4.2' apply false
    id 'com.android.library' version '7.4.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.8.0' apply false
}
```

## 修改 module/build.gradle

**AGP6.7:**

```groovy
plugins {
    id 'com.android.application'
}

android {
    compileSdkVersion 30

    defaultConfig {
        applicationId "com.example.mvc"
        minSdkVersion 22
        targetSdkVersion 30
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.3.1'
    implementation 'com.google.android.material:material:1.3.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
    testImplementation 'junit:junit:'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'

    implementation 'com.squareup.okhttp3:okhttp:4.9.1'
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

**AGP7.6:**

```groovy
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    // 包名
    namespace 'com.example.mvc'
    compileSdk 33

    defaultConfig {
        applicationId "com.example.mvc"
        minSdk 22
        targetSdk 33
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.3.1'
    implementation 'com.google.android.material:material:1.3.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
    testImplementation 'junit:junit:'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'

    implementation 'com.squareup.okhttp3:okhttp:4.9.1'
    implementation 'com.google.code.gson:gson:2.10.1'
}
```



## 参考

https://juejin.cn/post/7316698702118813747



