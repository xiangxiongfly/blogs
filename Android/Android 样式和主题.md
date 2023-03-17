[TOC]

# Android 样式和主题

## Style 样式

- 样式是View级别的，只能作用于View。
- 一个样式可以指定多种属性，如 宽高、颜色等，一个View只能使用一个样式。

**定义样式**

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="RadioButtonStyle">
        <item name="android:layout_width">wrap_content</item>
        <item name="android:layout_height">match_parent</item>
        <item name="android:layout_weight">1</item>
        <item name="android:button">@null</item>
        <item name="android:drawablePadding">10dp</item>
        <item name="android:gravity">center</item>
        <item name="android:textSize">16sp</item>
    </style>
</resources>
```

**使用样式**

```xml
<RadioGroup
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">

    <RadioButton
                 style="@style/RadioButtonStyle"
                 android:drawableTop="@drawable/home"
                 android:text="home" />

    <RadioButton
                 style="@style/RadioButtonStyle"
                 android:drawableTop="@drawable/find"
                 android:text="find" />

    <RadioButton
                 style="@style/RadioButtonStyle"
                 android:drawableTop="@drawable/message"
                 android:text="message" />
</RadioGroup>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/41ea66acf66646bb9fdcbbe4e8390a72.png)





## Theme 主题

- 主题是应用级别的，可以作用于Application、Activity。
- 主题可以看作是样式的加强版。

### 作用于Activity

**定义主题**

```xml
<style name="ActivityTheme" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
    <item name="colorPrimary">#FF0000</item>
    <item name="colorPrimaryDark">#00FF00</item>
    <item name="colorAccent">#0000FF</item>
    <item name="android:textColor">#FF0000</item>
    <item name="android:textSize">36sp</item>
</style>
```

**使用主题**

```xml
<activity
          android:theme="@style/ActivityTheme">
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f3991fbadbad462383f728f9e9bc8feb.png)

### 作用于Application

将刚才的主题放在`<application>`标签里

```xml
<application
             android:theme="@style/ActivityTheme">
```



## @ 和 ? 和 @android 和 @attr/ 和 ?android:attr/

### @

`@`表示引用自定义的资源。

```xml
<string name="app_name">hello</string>
```

```xml
<TextView
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="@string/app_name" />
```



### ?

`?`表示引用当前主题的资源

- colorPrimary：表示主色，如标题默认颜色
- colorPrimaryDark：第二颜色，如状态栏颜色
- colorAccent：强调色，如FloatingActionButton背景色

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>
```

```xml
<TextView
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="@string/app_name"
          android:textColor="?colorPrimary"
          android:textSize="24sp" />
```



### @android

`@android`表示引用Android内置的系统资源

```xml
<ImageView
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:src="@android:mipmap/sym_def_app_icon" />
```



### ?attr/

`?attr/`等价于`?`

```xml
<resources>
    <attr name="nameColor" format="color" />
</resources>
```

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
    <item name="nameColor">#a2a3e2</item>
</style>
```

```xml
<TextView
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="@string/app_name"
          android:textColor="?nameColor"
          android:textSize="24sp" />
```



### ?android:attr/

`?android:attr/` 引用系统的资源,等价于`?android`



## Theme常见写法

**普通写法**

```
@android:style/Theme.Holo.Light
```

**4.0以后写法**

```
@android:style/Theme.Material.xxx
```

**5.0以后写法**

```
Theme.AppCompat.Light.DarkActionBar
```

**MeterailDesign样式**

```
Theme.MaterialComponents.Light.NoActionBar
```



## 常见主题样式设置

```xml
<!--应用的主要颜色-->
<item name="colorPrimary">#ff0000</item>

<!--应用的次要颜色-->
<item name="colorPrimaryDark">#00ff00</item>

<!--默认选中颜色-->
<item name="colorAccent">@color/colorAccent</item>

<!--状态栏颜色-->
<item name="android:statusBarColor">#00000000</item>

<!-- 状态栏透明化 -->
<item name="android:windowTranslucentStatus">true</item>

<!-- 状态栏文字颜色，API23可用-->
<item name="android:windowLightStatusBar">true</item>

<!-- 全屏显示，隐藏状态栏、导航栏、底部导航栏 -->
<item name="android:windowFullscreen">true</item>

<!-- 隐藏Title -->
<item name="windowNoTitle">true</item>

<!-- 底部虚拟导航栏颜色 -->
<item name="android:navigationBarColor">#E91E63</item>

<!-- 让底部导航栏变半透明灰色，覆盖在Activity之上（默认false，activity会居于底部导航栏顶部），如果设为true，navigationBarColor 失效 -->
<item name="android:windowTranslucentNavigation">true</item>

<!--背景颜色-->
<item name="android:background">#a2a3e2</item>

<!--背景图片-->
<item name="android:windowBackground">@drawable/ic_launcher_background</item>
```

**控件相关**

```xml
<!-- button 文字是否全部大写，系统默认打开 -->
<item name="android:textAllCaps">false</item>

<!-- 默认 Button,TextView的文字颜色 -->
<item name="android:textColor">#B0C4DE</item>

<!-- 默认 EditView 输入框字体的颜色 -->
<item name="android:editTextColor">#E6E6FA</item> 

<!-- RadioButton checkbox等控件的文字 -->
<item name="android:textColorPrimaryDisableOnly">#1C71A9</item>

<!-- 应用的主要文字颜色,actionBar的标题文字默认使用该颜色 -->
<item name="android:textColorPrimary">#FFFFFF</item>

<!-- 辅助的文字颜色，一般比textColorPrimary的颜色弱一点，用于一些弱化的表示 -->
<item name="android:textColorSecondary">#C1C1C1</item>

<!-- 控件选中时的颜色,默认使用colorAccent -->
<item name="android:colorControlActivated">#FF7F50</item>

<!-- 控件按压时的色调-->
<item name="android:colorControlHighlight">#FF00FF</item>

<!-- CheckBox,RadioButton,SwitchCompat等默认状态的颜色 -->
<item name="android:colorControlNormal">#FFD700</item>

<!-- 默认按钮的背景颜色 -->
<item name="android:colorButtonNormal">#1C71A9</item>

<!--屏幕方向-->
<item name="android:screenOrientation">landscape</item>
```