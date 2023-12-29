[TOC]

# Jetpack DataStore

## 概述

Jetpack DataStore 是一种数据存储解决方案，允许您使用[协议缓冲区](https://developers.google.cn/protocol-buffers?hl=zh-cn)存储键值对或类型化对象。DataStore 使用 Kotlin 协程和 Flow 以异步、一致的事务方式存储数据。 

DataStore 提供两种不同的实现：Preferences DataStore 和 Proto DataStore。

- **Preferences DataStore** 使用键存储和访问数据。此实现不需要预定义的架构，也不确保类型安全。
- **Proto DataStore** 将数据作为自定义数据类型的实例进行存储。此实现要求您使用[协议缓冲区](https://developers.google.cn/protocol-buffers?hl=zh-cn)来定义架构，但可以确保类型安全。

[DataStore 官方文档](https://developer.android.google.cn/topic/libraries/architecture/datastore)

[Proto3 语法入门](https://juejin.cn/post/7165363032577540133)

[Proto3 官方语法指南](https://protobuf.dev/programming-guides/proto3)



## DataStore 对比 SP

SharedPreference（简称SP） 是一个轻量级的数据存储方式，使用方便，以键值对的形式存储在本地。

SP的缺点：

- SP不能保证类型安全。如果存的数据和取的数据的类型不一致时会报异常。
- SP加载的数据会一直停留在内存中。
- 不支持多进程。
- 读写性能差，可能阻塞UI线程，可能引起ANR。

 DataStore优点：

- 读写性能高。基于协程和Flow保证了UI线程的安全性。
- 从一定程度上保证类型安全。



## 添加依赖库

**project/build.gradle**

```groovy
buildscript {   
    dependencies {
        // Proto DataStore
        classpath 'com.google.protobuf:protobuf-gradle-plugin:0.8.19'
    }
}
```

**module/build.gradle**

```groovy
plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'com.google.protobuf'
}

dependencies {
    // Preferences DataStore
    implementation "androidx.datastore:datastore-preferences:1.0.0"
    implementation "androidx.datastore:datastore-core:1.0.0"

    // Proto DataStore
    implementation 'androidx.datastore:datastore-core:1.0.0'
    implementation 'com.google.protobuf:protobuf-javalite:3.10.0'

    implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.5.0"

}


protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:3.14.0"
    }

    // 为该项目中的 Protobufs 生成 java Protobuf-lite 代码。
    generateProtoTasks {
        all().each { task ->
            task.builtins {
                java {
                    option 'lite'
                }
            }
        }
    }
}
```



## Preferences DataStore

### 路径

DataStore 生成的缓存文件存放在 `/data/data/<包名>/files/datastore` 目录下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e6429252a7b84d798b5514106b96e122.png)

### 创建 Preferences DataStore

```kotlin
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_info")
```

### 获取数据

```kotlin
lifecycleScope.launch {
    dataStore.edit { preferences ->
        // 先通过 stringPreferencesKey() 方法获取指定Key
        val nameKey = stringPreferencesKey("name")
        val ageKey = intPreferencesKey("age")
        val sexKey = booleanPreferencesKey("sex")
        // 通过Key获取值
        val name = preferences[nameKey]
        val age = preferences[ageKey]
        val sex = preferences[sexKey]
        logE("name:$name age:$age sex:$sex")
    }
}
```

### 保存数据

```kotlin
dataStore.edit { preferences ->
    preferences[stringPreferencesKey("name")] = "小明"
    preferences[intPreferencesKey("age")] = 18
    preferences[booleanPreferencesKey("sex")] = true
}
```

### 修改数据

```kotlin
 dataStore.edit { preferences ->
     preferences[stringPreferencesKey("name")] = "小黑"
     preferences[intPreferencesKey("age")] = 28
     preferences[booleanPreferencesKey("sex")] = false
 }
```

### 删除数据

```kotlin
dataStore.edit { preferences ->
    val removeValue = preferences.remove(stringPreferencesKey("name"))
    logE("remove:$removeValue")
}
```

### 清除全部数据

```kotlin
dataStore.edit { preferences ->
    preferences.clear()
}
```



## Proto DataStore

### 配置

#### AndroidStudio安装插件

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2c4da3a9609742249cbce7bfc683c60a.png)

#### 配置proto文件

先新建 proto 目录：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/566bac2ddc1040db8ecd8411c6fc93c3.png)

再创建 person.proto 文件，并写入：

```protobuf
syntax = "proto3";

option java_package = "com.example.datastoredemo"; //设置生成的类所在的包
option java_multiple_files = true; //可能会有多个文件。

message PersonPreferences {
  string name = 1; //String类型
  int32 age = 2; //int类型
  bool sex = 3; //boolean类型
  repeated string address = 4; //String[]数组
  map<string, string> fruits = 5; //Map类型
}
```

#### 创建序列化器

```kotlin
object PersonSerializer : Serializer<PersonPreferences> {
    override val defaultValue: PersonPreferences
        get() = PersonPreferences.getDefaultInstance()

    override suspend fun writeTo(t: PersonPreferences, output: OutputStream) {
        t.writeTo(output)
    }

    override suspend fun readFrom(input: InputStream): PersonPreferences {
        try {
            return PersonPreferences.parseFrom(input)
        } catch (exception: InvalidProtocolBufferException) {
            throw CorruptionException("Cannot read proto.", exception)
        }
    }
}
```

### 创建 Proto DataStore

```kotlin
val Context.personDataStore: DataStore<PersonPreferences> by dataStore(
    fileName = "person.pb", serializer = PersonSerializer
)
```

### 获取数据

```kotlin
lifecycleScope.launch {
    personDataStore.data.first().let { preferences ->
        val name = preferences.name
        val age = preferences.age
        val sex = preferences.sex
        val address = preferences.addressList
        val fruits = preferences.fruitsMap
        logE("name:$name age:$age sex:$sex address:$address fruits:$fruits")
    }
}
```

### 保存数据

```kotlin
preferences.toBuilder()
    .setName("小白")
    .setAge(28)
    .setSex(true)
    .addAddress("广东省")
    .addAddress("广州市")
    .addAddress("黄埔区")
    .putFruits("apple", "苹果")
    .putFruits("banner", "香蕉")
    .putFruits("cherry", "樱桃")
    .build()
```

```kotlin
preferences.toBuilder()
    .setName("小白")
    .setAge(28)
    .setSex(true)
    .addAllAddress(listOf("广东省", "广州市", "黄埔区"))
    .putAllFruits(mapOf("apple" to "苹果", "banner" to "香蕉", "cherry" to "樱桃"))
    .build()
```

### 修改数据

``` kotlin
personDataStore.updateData { preferences -
    preferences.toBuilder()
        .setName("小黑")
        .setAge(38)
        .setSex(false)
        .setAddress(0, "湖南省")
        .setAddress(1, "长沙市")
        .setAddress(2, "芙蓉区")
        .putFruits("apple", "苹果1号")
        .build()
}
```

### 删除Map数据

```kotlin
 personDataStore.updateData { preferences ->
     preferences.toBuilder()
         .removeFruits("apple")  // 删除map数据
         .build()
 }
```

### 清除数据

```kotlin
personDataStore.updateData { preferences ->
    // 清除所有数据
    preferences.toBuilder()
        .clear()
        .build()
    // 依次清除数据
      preferences.toBuilder()
          .clearName()
          .clearAge()
          .clearSex()
          .clearAddress()
          .clearFruits()
          .build()
}
```

```kotlin
personDataStore.updateData { preferences ->
    // 清除所有数据
    preferences.toBuilder()
        .clear()
        .build()
    // 依次清除数据
      preferences.toBuilder()
          .clearName()
          .clearAge()
          .clearSex()
          .clearAddress()
          .clearFruits()
          .build()
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_JetpackProject)

