[TOC]

# Activity启动方法

## 显式启动

```kotlin
startActivity(Intent(this, SecondActivity::class.java))
```



## 隐式启动

- 隐式启动需要设置`intent-filter`，通过action、category、data过滤信息。
- 跨应用的Activity启动就需要使用隐式intent。

### action

- 需要在`AndroidManifest.xml`文件中配置，可以配置多个
- intent中的action值与清单文件的action值相同表示匹配成功

```xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.activitydemo.MY_ACTION" />
        <action android:name="com.example.activitydemo.MY_ACTION2" />
        
        <!-- 必须加上 -->
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

```kotlin
val intent = Intent()
intent.setAction("com.example.activitydemo.MY_ACTION")
startActivity(intent)
```



### category

- 与action类似，可以在清单文件中配置多个
- intent中的action是必须添加的，但是cateogry可以不用添加

```xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.activitydemo.MY_ACTION" />
        <action android:name="com.example.activitydemo.MY_ACTION2" />
        
        <!-- 必须加上 -->
        <category android:name="android.intent.category.DEFAULT" />
        
        <category android:name="com.example.activitydemo.MY_CATEGORY" />
        <category android:name="com.example.activitydemo.MY_CATEGORY2" />
    </intent-filter>
</activity>
```

```kotlin
val intent = Intent()
intent.setAction("com.example.activitydemo.MY_ACTION")
intent.addCategory("com.example.activitydemo.MY_CATEGORY")
startActivity(intent)
```



### data

data由mimeType和URL组成

```
mimeType数据类型：image/jpeg  video/*等

URL数据格式：<scheme>://<host>:<port>/[<path>|<pathPrefix>|<pathPattern>]

如：
content://com.example.project:200/folder/subfolder/etc
http://www.baidu.com:80/search/info
```

- scheme：url的模式，如http、file等
- host：url主机名，如”www.baidu.com“
- port：url端口，如”80“
- path：表示路径
- pathPrefix：表示路径前缀
- pathPattern：表示完整路径，包含通配符

```xml
<activity android:name=".SecondActivity">
    <intent-filter>
        <action android:name="com.example.activitydemo.MY_ACTION" />

        <!-- 必须加上 -->
        <category android:name="android.intent.category.DEFAULT" />

        <data
              android:host="www.123456.com"
              android:mimeType="image/*"
              android:path="/helloworld"
              android:port="800"
              android:scheme="abc" />
    </intent-filter>
</activity>
```

```kotlin
val intent = Intent()
intent.action = "com.example.activitydemo.MY_ACTION"
intent.setDataAndType(Uri.parse("abc://www.123456.com:800/helloworld"), "image/png")
startActivity(intent)
```



## 判断隐式启动是否成功

```kotlin
val intent = Intent()
intent.setAction("com.example.activitydemo.MY_ACTION")
intent.setDataAndType(Uri.parse("hello://www.123456.com"), "world/*")
val componentName: ComponentName? = intent.resolveActivity(packageManager)
if (componentName != null) {
    startActivity(intent)
} else {
    toast("隐式启动失败")
}
```