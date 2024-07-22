[TOC]

# Android Lint

## 概述

Lint 是 Android 提供的 **代码扫描分析工具**，它可以帮助我们发现代码结构/质量问题，同时提供一些解决方案，而且这个过程不需要我们手写[测试](https://link.juejin.cn?target=http%3A%2F%2Flib.csdn.net%2Fbase%2Fsoftwaretest)用例。

Lint 发现的每个问题都有描述信息和等级（和测试发现 bug 很相似），我们可以很方便地定位问题，同时按照严重程度进行解决。

[官网](https://developer.android.com/studio/write/lint?hl=zh-cn)



 ## 工作流程

Lint 会根据预先配置的检测标准检查我们 Android 项目的源文件，发现潜在的 bug 或者可以优化的地方。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b6a98e7b34fd40e8b6b4b21c0b063a96.png)



## Lint 问题

### 问题种类

- Correctness：编码质量问题，可能包括硬编码的字符串、使用过时的API、无效的注释、废弃的代码路径等。
- Security： 安全性问题，例如使用不安全的网络连接、在代码中泄露敏感信息、AndroidManifest 中的权限问题等。
- Performance：性能相关的问题，例如无效的布局层次结构、不必要的资源加载、内存泄漏、过度使用静态变量、循环引用等。
- Usability：易用性问题，比如缺少某些倍数的图像资源、布局方向依赖性、触摸目标大小不合理等。
- Accessibility：辅助功能问题，比如 ImageView 缺少 contentDescription、不正确的视图聚焦顺序、文本大小或颜色对比度不足等。
- Internationalization：国际化问题，如直接在代码中使用非英文字符而不是使用资源文件中的字符串、硬编码的日期和时间格式等。
- Spelling：拼写错误问题，在代码或资源文件中的拼写问题。

### 警告严重性

- Fatal：最严重错误，可能导致编译失败或应用崩溃，这些问题必须立即解决，否则项目无法构建。
- Error：错误，可能导致应用行为不正确或不稳定。强烈建议修复这些错误，以保证应用的可靠性和稳定性。
- Warning：警告，虽然可能不会阻止应用运行，但它们可能会影响应用的性能、安全性或用户体验。开发者应该评估这些警告，并考虑是否需要修复。
- Info：信息提示，通常用于指出一些可能的改进点，或者是一些可能需要开发者注意但不一定需要立即修复的事项。
- Typo，拼写错误。
- Unused Entry：未使用的属性。

### 检查规则

Android Lint 支持大量的检查规则，每个规则都有一个唯一的ID。由于规则数量众多且不断更新，这里无法提供一个详尽无遗的列表，但我可以列举一些常见的Lint检查ID及其简要说明，帮助你理解它们的用途：

```
TypographyFractions: 检查分数显示方式是否正确。
TypographyQuotes: 检查引号使用是否一致。
UnusedResources: 检查是否存在未使用的资源。
deprecated-api: 检查是否使用了已弃用的 API。
EqualsHashCode: 检查类是否正确地实现了 equals() 和 hashCode() 方法。
MagicNumber: 检查是否有魔数（硬编码的数字）。
ArraySizeZero: 检查数组大小是否为零。
EmptyCatchBlock: 检查空的 catch 块。
ProguardRules: 检查 ProGuard 配置文件中的规则。
LayoutInflation: 检查布局文件中的视图引用是否正确。
UnusedResources - 检查项目中未使用的资源文件，包括图片、布局、字符串等。
ExtraTranslation - 检查是否有未在代码中使用的翻译字符串资源。
IconMissingDensityFolder - 警告图标缺失特定密度的文件夹，比如hdpi、xhdpi等。
MissingDefaultResource - 当资源引用了默认值但未提供时触发。
UnusedAttribute - 在XML布局文件中检测未使用的属性。
InefficientWeight - 布局中使用LinearLayout权重可能导致性能问题的警告。
HardcodedText - 查找代码中直接硬编码的文本，建议使用字符串资源。
Deprecated - 使用了已废弃的API或方法。
NewerVersionAvailable - 当使用了较旧的支持库版本时提醒有新版本可用。
SwitchIntDef - 当Switch语句没有覆盖所有@IntDef的情况发出警告。
GradleDependency - 检查依赖是否使用了正确的版本或指出潜在的依赖冲突。
SecurityDetector - 包含多种安全相关的检查，如不安全的网络请求、文件权限等。
ExportedReceiver - 未明确指定exported属性的BroadcastReceiver可能被外部应用调用。
AllowBackup - 应用是否允许备份，可能会导致敏感数据泄露。
PermissionLeak - 检测Activity、Service等组件注册后未注销可能导致的权限泄露。
```

可以点击：工具栏 -> Analyze -> Inspect Code -> Inspections 中查看所有规则。



 ## 用命令运行 Lint

- 在 Windows 上：

  ```
  gradlew lint
  ```

- 在 Linux 或 macOS 上：

  ```
  ./gradlew lint
  ```

```
指定模块
gradlew :app:lint
```

 最终会在 `build/reports` 目录下生成 `lint-results.html` 等报告。



## AndroidStudio 使用 Lint

一、点击：工具栏 -> Analyze -> Inspect Code... ：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5dc9645f65dd448294f149c5c92ad85d.png)

二、弹出对话框，选择扫描的作用域：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/80e9461a264347758d235fc98d44f800.png)

三、点击 Custom scope 自定义范围，弹出对话框：

- Local：在当前项目中使用。
- Shared：其他项目也可以使用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/bc87a0581f184ba5a6dca5322159c71d.png) 

四、 选择Shared，并取名为“MyShared”，显示如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/dca9ebd863dc4c4eb7ddd177acae09ea.png)

 右边4个按钮含义：

- Include：包含当前文件夹内的文件，但不包含子文件夹。
- Include Recursively：递归添加，包含当前文件夹和子文件夹内所有文件。
- Exclude：移除当前文件夹，当不包含子文件夹。
- Exclude Recursively：移除当前文件夹和子文件夹。

五、 点击“app”，并点击右边“Include Recursively”：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2af88753c1fc446988128223b1d9fa15.png)

app目录颜色变绿，并提示有36个文件夹190个文件要扫码。

 六、点击确定，开始扫码：

扫码结果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/3e904980f6d641e48e83f9558108e946.png)

切换视图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/caf3f88d138440aa91e671618c7a7ff2.png)

详细问题：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/d7c3a109bab047328f255a64851fb208.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4fb01a5eed2d4b5eafecda0d0c3f386d.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b1257a8c5ec4422988b65a5b63844a77.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/56a00002003d4d97957bedd9d8dccd9d.png)



## 忽略 Lint 警告

**代码忽略警告：**

`@SuppressWarnings` 和 `@SuppressLint` 都是用来抑制代码中特定警告的注解，`@SuppressWarnings` 主要针对Java编译器警告，而 `@SuppressLint` 特定于Android Lint工具的警告。

```java
public class MyHandler extends Handler {

    // 忽略内存泄露风险
    @SuppressLint("StaticFieldLeak")
    private static Activity activity;

    public MyHandler(Activity activity) {
        this.activity = activity;
    }
}
```

```java
// 忽略新API警告
@SuppressLint("NewApi")
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
}
```

```java
// 直接忽略
@SuppressLint("all")
```

**XML忽略警告：**

```
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:tools="http://schemas.android.com/tools"
              tools:ignore="all"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical"
              android:background="@color/white">

```



## gradle 配置 Lint

1. **abortOnError**:
   - **类型**: `Boolean`
   - **默认值**: `false`
   - **说明**: 当设置为`true`时，如果Lint发现任何错误，Gradle构建将会终止。如果为`false`，即使发现错误构建也会继续。
2. **ignoreWarnings**:
   - **类型**: `Boolean`
   - **默认值**: `false`
   - **说明**: 如果设为`true`，Lint将忽略所有的警告级别问题，只报告错误级别的问题。这对于只想关注严重问题的场景很有用。
3. **quiet**:
   - **类型**: `Boolean`
   - **默认值**: `false`
   - **说明**: 当设为`true`时，Lint不会输出分析进度信息到控制台，使得输出更加简洁，仅显示最终的报告或错误信息。
4. **checkReleaseBuilds**:
   - **类型**: `Boolean`
   - **默认值**: `true`
   - **说明**: 控制是否在release构建时运行Lint检查。设为`false`可以跳过发布构建的Lint检查，加快构建速度。
5. **warningsAsErrors**:
   - **类型**: `Boolean`
   - **默认值**: `false`
   - **说明**: 如果设置为`true`，则所有警告都将被视为错误处理，这会影响`abortOnError`的行为。
6. **checkAllWarnings**:
   - **类型**: `Boolean`
   - **默认值**: `true`
   - **说明**: 当设为`false`时，可以关闭某些非默认启用的警告检查，但通常建议保持为`true`以获取完整的检查覆盖。
7. **disable**:
   - **类型**: `List<String>`
   - **说明**: 指定要禁用的特定Lint检查的ID列表。这允许你排除不关心或经常产生误报的检查。
8. **enable**:
   - **类型**: **List<String>**
   - **说明**: 指定要特别启用的Lint检查的ID列表，即使这些检查在默认配置中是禁用的。
9. **baselineFile**:
   - **类型**: `File`
   - **说明**: 指定一个XML文件作为基线，只报告比基线中新增的问题。这有助于持续改进代码质量，而不需要立即解决历史问题。
10. **textReport**:
    - **类型**: `Boolean`
    - **默认值**: `false`
    - **说明**: 设置为`true`会在构建目录下生成文本形式的Lint报告。
11. **htmlReport**:
    - **类型**: `Boolean`
    - **默认值**: `false`
    - **说明**: 开启后会在构建目录生成HTML格式的Lint报告，便于浏览和分享。

```groovy
android {

    lintOptions {
        // Turns off checks for the issue IDs you specify.
        disable 'TypographyFractions','TypographyQuotes'
        // Turns on checks for the issue IDs you specify. These checks are in
        // addition to the default lint checks.
        enable 'RtlHardcoded','RtlCompat', 'RtlEnabled'
        // To enable checks for only a subset of issue IDs and ignore all others,
        // list the issue IDs with the 'check' property instead. This property overrides
        // any issue IDs you enable or disable using the properties above.
        checkOnly 'NewApi', 'InlinedApi'
        // If set to true, turns off analysis progress reporting by lint.
        quiet true
        // If set to true (default), stops the build if errors are found.
        abortOnError false
        // If set to true, lint only reports errors.
        ignoreWarnings true
        // If set to true, lint also checks all dependencies as part of its analysis.
        // Recommended for projects consisting of an app with library dependencies.
        checkDependencies true
    }
}
```



## 查找无用资源文件

点击：工具栏 -> Analyze -> Run Inspection By Name ：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ef570feab0b4445ba440d24b4db59741.png)

扫描出很多无用文件：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e6be865f40aa473184f4e513e47f5c98.png)

可以点击右边按钮“**Remove All Unused Resources**”删除。

