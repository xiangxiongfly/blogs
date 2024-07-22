[toc]

# Android 换肤之插件换肤

## 概述

 Android 实现应用内换肤的常用方式（两种）：

- 通过Theme切换主题，即静态方法。
- 通过AssetManager切换主题，可实现动态切换。



## 效果

**浅色模式：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/263564be33b8451386125313b4d46772.png)

**深色模式：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0d65075e02cc4511a4a884f7ec337627.png)



## 使用

这里使用第三方框架 [PaintedSkin](https://github.com/CoderAlee/PaintedSkin)。

### 步骤

1. 新建 Android application 工程。

2. 皮肤工程包名不能和宿主应用包名相同。

3. 将需要换肤的资源放置于res对应目录下

   - 如果想要替换 `Button` 文字颜色，在 apk 的 res/values/colors.xml 的目录下有如下资源：

     ```
     <color name="textColor">#FFFFFFFF</color>
     ```

     

     在皮肤包对应 res/values/colors.xml 的目录下有如下资源：

     ```
     <color name="textColor">#FF000000</color>
     ```

     

   - 如果想要替换 `Button` 背景图片，在 apk 中有 res/mipmap/bg_button.png ，在皮肤包中 res/mipmap/bg_button.png

4. 在皮肤包工程的 `build.gradle` 文件中添加：

   ```
    applicationVariants.all { variant ->
        variant.outputs.all { output ->
            outputFileName = "xxx.skin"
        }
    }
   ```

### 代码结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ce0b68454f7648f1986d1a73b74a53f0.png)

### 原理

- **资源包准备**：首先，开发者会为应用准备多套皮肤资源，这些资源包括颜色、图片、布局样式等，通常被打包成独立的APK或存放在特定目录下。
- **动态加载资源**：利用`AssetManager`和反射机制，可以在运行时动态加载外部APK或资源目录中的资源文件。



## [代码下载](https://github.com/xiangxiongfly/Android_SkinApp)

