[TOC]

# Android 验证Activity启动模式

## 查看任务栈

可以通过 `adb shell dumpsys activity activities` 命令查看 Activity 任务栈。

## launchMode

### standard

OneActivty -> TwoActivity -> ThreeActivity -> ThreeActivity

栈信息：

```
* Task{347a4b3 #124 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=4}
bounds=[0,0][1080,2400]
    * ActivityRecord{75681b9 u0 com.example.demo/.ThreeActivity t124}
    * ActivityRecord{156b287 u0 com.example.demo/.ThreeActivity t124}
    * ActivityRecord{2982324 u0 com.example.demo/.TwoActivity t124}
    * ActivityRecord{f21da70 u0 com.example.demo/.OneActivity t124}
```

### singleTop

将 ThreeActivity 设置为 singleTop。

依次启动：OneActivty -> TwoActivity -> ThreeActivity -> ThreeActivity

栈信息：

```
* Task{5241c10 #154 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=3}
        bounds=[0,0][1080,2400]
        * ActivityRecord{d70d694 u0 com.example.demo/.ThreeActivity t154}
        * ActivityRecord{9c92c1f u0 com.example.demo/.TwoActivity t154}
        * ActivityRecord{54d0309 u0 com.example.demo/.OneActivity t154}
```

### singleTask

将 TwoActivity 设置为 singleTask。

依次启动：OneActivty -> TwoActivity -> ThreeActivity -> TwoActivity

栈信息：

```
* Task{ec23885 #174 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=2}
bounds=[0,0][1080,2400]
    * ActivityRecord{f6f60c7 u0 com.example.demo/.TwoActivity t174}
    * ActivityRecord{1c8c6da u0 com.example.demo/.OneActivity t174}
```

### singleInstance

将 ThreeActivity 设置为 singleInstance。

依次启动：OneActivty -> TwoActivity -> ThreeActivity -> ThreeActivity

栈信息：

```
* Task{628a158 #176 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=1}
bounds=[0,0][1080,2400]
	* ActivityRecord{285b2b1 u0 com.example.demo/.ThreeActivity t176}
* Task{ce196c3 #175 type=standard A=10289:com.example.demo U=0 visible=false mode=fullscreen translucent=true sz=2}
bounds=[0,0][1080,2400]
	* ActivityRecord{2a72e67 u0 com.example.demo/.TwoActivity t175}
	* ActivityRecord{b04408e u0 com.example.demo/.OneActivity t175}
```

## Intent标记

### FLAG_ACTIVITY_NEW_TASK

启动 ThreeeActivity 时添加该标记。

依次启动：OneActivty -> TwoActivity -> ThreeActivity -> ThreeActivity

栈信息：

```
* Task{93cafdd #142 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=4}
bounds=[0,0][1080,2400]
    * ActivityRecord{9233d38 u0 com.example.demo/.ThreeActivity t142}
    * ActivityRecord{7a45878 u0 com.example.demo/.ThreeActivity t142}
    * ActivityRecord{b0bb4ce u0 com.example.demo/.TwoActivity t142}
    * ActivityRecord{3652a23 u0 com.example.demo/.OneActivity t142}
```

在Manifest.xml文件中，给ThreeActivity添加 `taskAffinity="www.baidu.com" `属性，并依次启动：OneActivty -> TwoActivity -> ThreeActivity -> ThreeActivity

栈信息：

```
* Task{919184b #144 type=standard A=10289:www.baidu.com U=0 visible=true mode=fullscreen translucent=false sz=1}
bounds=[0,0][1080,2400]
    * ActivityRecord{a186228 u0 com.example.demo/.ThreeActivity t144}
* Task{6b64d39 #143 type=standard A=10289:com.example.demo U=0 visible=false mode=fullscreen translucent=true sz=2}
bounds=[0,0][1080,2400]
    * ActivityRecord{b15b5da u0 com.example.demo/.TwoActivity t143}
    * ActivityRecord{a3c6f7e u0 com.example.demo/.OneActivity t143}
```

**总结：**

如果没有设置 taskAffinity 属性，表现形式和standard模式一样；如果设置了 taskAffinity 属性，会在一个新的任务栈中启动一个Activity。

### FLAG_ACTIVITY_CLEAR_TASK 和 FLAG_ACTIVITY_NEW_TASK

依次启动：OneActivty -> TwoActivity -> ThreeActivity

栈信息：

```
* Task{ff9bb3d #173 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=3}
bounds=[0,0][1080,2400]
    * ActivityRecord{52b8327 u0 com.example.demo/.ThreeActivity t173}
    * ActivityRecord{7866df1 u0 com.example.demo/.TwoActivity t173}
    * ActivityRecord{28f7f32 u0 com.example.demo/.OneActivity t173}
```

再启动  -> ThreeActivity(添加该属性)

栈信息：

```
* Task{ff9bb3d #173 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=1}
bounds=[0,0][1080,2400]
    * ActivityRecord{4903a43 u0 com.example.demo/.ThreeActivity t173}
```

**总结：**

会清空任务栈中的Acitivity实例，并启动新的Activity实例。

### FLAG_ACTIVITY_CLEAR_TOP

**场景一：TwoActivity设置为standard**

依次启动：OneActivty -> TwoActivity -> ThreeActivity

栈信息：

```
* Task{42187d #165 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=3}
bounds=[0,0][1080,2400]
    * ActivityRecord{b4ffb82 u0 com.example.demo/.ThreeActivity t165}
    * ActivityRecord{20a3e02 u0 com.example.demo/.TwoActivity t165}
    * ActivityRecord{4c44440 u0 com.example.demo/.OneActivity t165}
```

再启动-> TwoActivity(设置该属性)

栈信息：

```
* Task{42187d #165 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=2}
bounds=[0,0][1080,2400]
    * ActivityRecord{22e57ea u0 com.example.demo/.TwoActivity t165}
    * ActivityRecord{4c44440 u0 com.example.demo/.OneActivity t165}
```

**场景二：TwoActivity设置为singleTop**

依次启动：OneActivty -> TwoActivity -> ThreeActivity

栈信息：

```
* Task{3cb644c #166 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=3}
bounds=[0,0][1080,2400]
    * ActivityRecord{4fce6bb u0 com.example.demo/.ThreeActivity t166}
    * ActivityRecord{c88c13d u0 com.example.demo/.TwoActivity t166}
    * ActivityRecord{4f10c95 u0 com.example.demo/.OneActivity t166}
```

再启动-> TwoActivity(设置该属性)

栈信息：

```
* Task{3cb644c #166 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=2}
bounds=[0,0][1080,2400]
    * ActivityRecord{c88c13d u0 com.example.demo/.TwoActivity t166}
    * ActivityRecord{4f10c95 u0 com.example.demo/.OneActivity t166}
```

**总结：**

如果Activity的启动模式设置为standard，该Activity会被重新创建，并且上方的Activity都会被清除；如果启动模式设置为singleTop，则该Activity不会被重建，上方的Activity会被清除。

### FLAG_ACTIVITY_SINGLE_TOP

启动 TwoActivity 时添加该标记。

依次启动：OneActivty -> TwoActivity -> TwoActivity

栈信息：

```
* Task{5566fe4 #172 type=standard A=10289:com.example.demo U=0 visible=true mode=fullscreen translucent=false sz=2}
bounds=[0,0][1080,2400]
    * ActivityRecord{cddc22b u0 com.example.demo/.TwoActivity t172}
    * ActivityRecord{a3d4c4d u0 com.example.demo/.OneActivity t172}
```

**总结：**

和 singleTop 的效果一样。
