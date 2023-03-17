[TOC]

## 一、生成签名文件
第一步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/3af9b5baebf54a77b69f5ecb3cdbd825.png)
第二步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f4f435a90e14ac0a4a848d56ca25fd9.png)
第三步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/b3055d5c79dc40b4ac83b738d98f9ff3.png)
第四步：
签名密码和别名密码需要保持一致。
![在这里插入图片描述](https://img-blog.csdnimg.cn/26d522c2245248cfae5a54e499338576.png)
第五步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/431e4c3306ec4d5eb61e4393f7df40be.png)
第六步：
开始构建。
![在这里插入图片描述](https://img-blog.csdnimg.cn/4038645e428d43c09cbaf65e8964368f.png)


## 二、查看签名信息
keytool -list -v -keystore <签名文件>
![在这里插入图片描述](https://img-blog.csdnimg.cn/e922451626814bed9bb21548ca5908bb.png)


## 三、Android配置签名信息
```groovy
//签名信息
signingConfigs {
    release {
        storeFile file('MyAndroid.jks')
        storePassword '123456'
        keyAlias 'app'
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
执行assemble命令，生成apk文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/e0a2664fd92b47c69605c800da95d243.png)



## 四、检查签名是否成功
keytool -printcert -jarfile <apk文件>
![在这里插入图片描述](https://img-blog.csdnimg.cn/1126a2548b764e0a8434abdd3ca5b017.png)


说明apk已经签名了，如果没有签名，则会提示当前应用无签名。