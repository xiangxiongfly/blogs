[TOC]

# Android Jetpack

## 概述

Android Jetpack是一组库、工具和指南，旨在帮助开发者轻松地编写高质量的Android应用。它是Google推出的，旨在加速Android应用开发过程，同时保持应用的稳定性和兼容性。Jetpack通过提供向后兼容的、可靠的组件，使得开发者可以专注于编写他们应用的独特功能，而不是处理Android平台的复杂性。

[官网](https://developer.android.google.cn/jetpack)



## Jetpack与Android关系

- 补充：Jetpack并不是替代Android SDK的，而是作为补充存在。它提供了一系列的库和工具，帮助开发者更有效地使用Android SDK。
- 向后兼容：许多Jetpack组件提供了向后兼容性，这意味着开发者可以在旧版本的Android上使用新特性，从而扩大应用的受众范围。



## Jetpack包含内容

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191230163930395.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)

#### Foundationy 基础组件

基础组件提供了横向功能，如向后兼容、测试、安全你、kotlin支持。

- Android KTX：优化了供kotlin使用的Jetpack和Android的API。
- AppCompat：提供较低版本的兼容。



#### Architecture 架构组件

Architecture指的是架构组件，帮助开发者设计文件、可测试且易维护的应用。这些架构组件既可以配合配合使用，也可以单独使用。

- DataBinding：以声明式将可观察数据绑定到界面元素，通常和ViewModel配合使用。
- Lifecycle：用于管理Activity和Fragment的生命周期。
- LiveData：用于底层数据更改时通知视图。
- Navigation：处理应用内导航。
- Paging：用于帮助开发者一次加载和显示小块数据。
- Room：友好、流畅的访问SQLite数据库。
- ViewModel：以生命周期的方式管理界面相关的数据，通常和DataBinding配合使用，为开发者实现MVVM架构提供了有力支持。
- WorkManager：管理Android的后台工作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191230163946666.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



#### Behavior 行为组件

行为组件可帮助开发者的应用于标准Android服务组成。

- CameraX：帮助开发简化相机应用的开发工作。
- DownloadManager：用于处理长时间运行的HTTP下载的系统服务。
- 权限：用于检查和请求应用权限的兼容性API。
- 媒体和播放：用于媒体放风和路由的向后兼容API



#### UI 界面组件

- Animation and Transition：该框架用于内置动画。
- Emoji Compatibility：用于Android系统的表情符号。
- Framgent：组件化界面。
- Layout：用XML声明UI元素或代码实现UI元素。




