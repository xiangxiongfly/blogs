[TOC]

# Flutter Widget

## 概述

- Flutter作为跨平台的UI框架，主要解决的是界面的跨平台。
- 在Flutter中，一切都显示都是Widget，Widget的概念非常广泛，可以表示一些UI组建、手势等。
- Flutter中的Widget可以粗略理解为Android中的View。Widget与View不同的是：Widget具有不同的生命周期，它是不可变的，每当Widget状态发生变化时，Flutter都会创建一个新的Widget；而Android中的View会被绘制一次，并且在invalidate调用之前不会重绘。
- Widget不是真正意义上的控件，在Flutter中的定位更像是配置文件。
- Widget可分为有状态和无状态：
  - 无状态，即继承自StatelessWiget，指保持在一帧。
  - 有状态，即继承自StatefulWidget，指数据更新时，构建新的Widget。



## Widget种类

- WidgetsApp：需要自定义风格。
- MaterialApp：Android的Material Design风格。
- CupertinoApp：iOS风格。



## 常用Widget

Flutter中的Widget负责的功能都相对比较单一。

- Container：只能包含一个子Widget，默认充满，可以使用padding、margin、color、width、height、decoration等配置。
- Padding：只能包含一个子Widget，可以设置内边距值。
- Center：只能包含一个子Widget，用于居中显示。
- Stack：可以包含多个子Widget，用于多个子Widget层叠效果。
- Column：可以包含多个子Widget，用于垂直线性布局。
- Row：可以保护多个子Widget，用于水平线性布局。
- Expanded：只能包含一个子Widget，在Column或Row中填充空间，可以设置flex配置比例。
- ListView：可以包含多个子Widget的滚动控件。
- Text：显示文本，可以通过style设置样式。
- RichText：富文本，可以通过TextSpan拼接富文本效果。
- TextField：文本输入框。
- Image：图片显示。



## StatefulWidget的状态分类

```dart
import 'package:flutter/cupertino.dart';

class DemoWidget extends StatefulWidget {
    late final String text;

    DemoWidget(this.text);

    @override
    State<StatefulWidget> createState() => _DemoWidgetState(text);
}

class _DemoWidgetState extends State<DemoWidget> {
    late String text;

    _DemoWidgetState(this.text);

    /// 初始化
    /// 理论上只会调用一次
    @override
    void initState() {
        super.initState();
        print("initState()");
    }

    /// 在initState之后调用
    /// 该方法当父容器发生变化时可能会被调用
    @override
    void didChangeDependencies() {
        super.didChangeDependencies();
        print("didChangeDependencies()");
        Future.delayed(Duration(seconds: 1), () {
            setState(() {
                text = "卧槽";
            });
        });
    }

    /// 销毁
    /// 只会调用一次
    @override
    void dispose() {
        super.dispose();
        print("dispose()");
    }

    @override
    Widget build(BuildContext context) {
        print("build()");
        return Center(
            child: Container(
                child: Text(text),
            ),
        );
    }
}

// initState()
// didChangeDependencies()
// build()
// dispose()
```

| 名称                  | 状态说明                                         |
| :-------------------- | ------------------------------------------------ |
| initState             | 渲染时调用，只会调用一次，可以做一些初始化操作。 |
| didChangeDependencies | state依赖的对象发生变化时盗用。                  |
| didUpdateWidget       | Widget状态改变时调用，可能会调用多次。           |
| build                 | 构建Widget时调用。                               |
| deactivate            | 当移除渲染树时调用。                             |
| dispose               | Widget即将销毁时调用。                           |



## Widget工作流程

当Widget被加载时，首先会创建出Widget对应的Element对象，然后Element读取Widget的配置信息（尺寸、位置、文本等），转化为RenderObject对象，RenderObject才是真正上的控件对象，最终插入RenderObject树中实现绘制。

Element会保持一些配置信息，同时Widget的加载、生命周期和更新等流程，RenderObject的创建、更新等时机，child的加载、更新等行为，都是通过Element实现或执行的。

- Widget可能被多次调用。
- Element一般只会创建一次，Element持有Wdiget和RenderObject。
- Widget与Element是多对一的关系，Element与RenderObject是一对一关系。



![在这里插入图片描述](https://img-blog.csdnimg.cn/1541f6d5c2a4425cbcb76fbc6869eb0c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_19,color_FFFFFF,t_70,g_se,x_16)



![在这里插入图片描述](https://img-blog.csdnimg.cn/76dceff683a14122bf0a1cd1ddc3b856.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

