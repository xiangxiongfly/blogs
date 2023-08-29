[TOC]

## 使用AndroidStudio打包

第一步：

点击AndroidStudio导航栏上的 Build→Generate Signed Bundle / APK
![在这里插入图片描述](https://img-blog.csdnimg.cn/3af9b5baebf54a77b69f5ecb3cdbd825.png)

第二步：选择APK选项
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f4f435a90e14ac0a4a848d56ca25fd9.png)

第三步：

创建签名文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3055d5c79dc40b4ac83b738d98f9ff3.png)

第四步：

配置签名文件，签名密码和别名密码需要保持一致。
![在这里插入图片描述](https://img-blog.csdnimg.cn/26d522c2245248cfae5a54e499338576.png)

第五步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/431e4c3306ec4d5eb61e4393f7df40be.png)

第六步：
开始构建，生成apk文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/4038645e428d43c09cbaf65e8964368f.png)



## 使用gradle打包

### 配置gradle文件

```groovy
//签名信息
signingConfigs {
    release {
        // 签名文件未知
        storeFile file('MyAndroid.jks')
        // 签名文件密码
        storePassword '123456'
        // 别名
        keyAlias 'app'
        // 别名密码
        keyPassword '123456'
    }
    debug {
        storeFile file('MyAndroid.jks')
        storePassword '123456'
        keyAlias 'app'
        keyPassword '123456'
    }
}

buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        //配置签名
        signingConfig signingConfigs.release
    }
    debug {
        //配置签名
        signingConfig signingConfigs.debug
    }
}
```
### 进一步配置gradle

签名信息属于敏感信息，应该配置在一个独立的文件里面，然后再在build.gradle中去读取这些数据。

将签名信息放在gradle.properties文件中：

```
KEY_PATH=../MyAndroid.jks
KEY_PASSWORD=123456
ALIAS_NAME=app
ALIAS_PASSWORD=123456
```

编辑app/build.gradle文件：

```groovy
signingConfigs {
    release {
        storeFile file(KEY_PATH)
        storePassword KEY_PASSWORD
        keyAlias ALIAS_NAME
        keyPassword ALIAS_PASSWORD
    }
    debug {
        storeFile file(KEY_PATH)
        storePassword KEY_PASSWORD
        keyAlias ALIAS_NAME
        keyPassword ALIAS_PASSWORD
    }
}
```

### 打包

点击AndroidStudio右侧工具栏，gradle -> 项目名 -> app -> Tasks -> build 

执行assemble命令，会生成debug和release两个版本的apk文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/7fd2ef1a20a84e55b458d5a97f1ccda5.png)

### 显示assembleDebug和assembleRelease选项

使用assemble会一次性编译出debug和release版本会比较耗时。

**方式一：**

打开other目录：

![在这里插入图片描述](https://img-blog.csdnimg.cn/460c7afdf7264612a863b228d18b131a.png)

**方式二：**

配置Edit Configurations:

![在这里插入图片描述](https://img-blog.csdnimg.cn/6212c942f41f4c76b886c06d5e3e51ba.png)

然后直接运行即可：

![在这里插入图片描述](https://img-blog.csdnimg.cn/615e38975ffc48739a5f6e1b451e3a13.png)



## 查看签名信息

keytool -list -v -keystore <签名文件>
![在这里插入图片描述](https://img-blog.csdnimg.cn/e922451626814bed9bb21548ca5908bb.png)



## 检查签名是否成功

keytool -printcert -jarfile <apk文件>
![在这里插入图片描述](https://img-blog.csdnimg.cn/1126a2548b764e0a8434abdd3ca5b017.png)


说明apk已经签名了，如果没有签名，则会提示当前应用无签名。

