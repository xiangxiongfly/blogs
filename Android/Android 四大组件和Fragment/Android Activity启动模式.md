[TOC]

# Android Activity启动模式

## 概述

Activity 的管理方式是任务栈。栈是先进后出的结构。



## 四种启动模式

| 启动模式                     |  说明                                                         | 适用场景                   |
| ---------------------------- | ------------------------------------------------------------ | -------------------------- |
| standard<br />标准模式            | 默认模式，每次启动Activity都会创建一个新的Activity实例，并放在栈顶。 | 相对独立的界面             |
| singleTop<br />栈顶复用模式      | 如果启动的Activity在栈顶，则会复用该Activity实例，并回调`onNewIntent()`方法。 | 用于接收通的界面           |
| singleTask<br />栈内复用模式      | 如果启动的Activity在栈内，则会复用该Activity实例，并回调`onNewIntent()`方法，并清除它上方的实例。 | 全局的界面，如主界面       |
| singIeInstance<br />单例模式      | 创建一个新任务栈，将新建一个Activity实例并放入新栈中，再次启动会回调`onNewIntent()`方法。 | 单独隔离的界面，如地图界面 |

标准模式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1398fffcbbb54ef796ff86c6141ebdd1.png)

栈顶复用模式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/a35854182dee43888c74fe0ab1f15e22.png)

栈内复用模式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/72cb06bd275447ef9d51435231224531.png)

单例模式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4b2a48b8e0644e898b0721e992d4ca4e.png)

**在AndroidManifest中设置：**

```xml
<activity
          android:launchMode="standard" />
```



## Intent标记

| 标记                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| FLAG_ACTIVITY_NEW_TASK   | 在新任务栈中启动Activity，非Activity中启动Activity需要添加该属性 |
| FLAG_ACTIVITY_SINGLE_TOP | 栈顶复用模式（singleTop）                                    |
| FLAG_ACTIVITY_CLEAR_TOP  | 启动模式为standard时，栈中存在该Activity实例，则重新创建一个新实例，并清除原实例上方的所有实例；启动模式为singleTop时，不会重建Activity，会调用onNewIntent()方法，并清除上方的所有实例。 |
| FLAG_ACTIVITY_CLEAR_TASK | 必须配合FLAG_ACTIVITY_NEW_TASK使用，如果任务栈存在，则清空任务栈重新创建Activity实例，如果任务栈不存在，则新建任务栈并创建Activity实例。 |

**使用：**

```kotlin
intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
```



## 二者区别

- 优先级不同：Intent标记的优先级高于Manifest设置。
- 限定范围不同：Manifest不能设置FLAG_ACTIVITY_CLEAR_TOP，Intent无法设置singleInstance。


