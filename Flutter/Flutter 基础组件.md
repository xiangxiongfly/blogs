[TOC]

# Flutter 基础组件

## 文本组件

### Text

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1bb38aedcf746a38cf95e76af67022e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_10,color_FFFFFF,t_70,g_se,x_16)

```dart
Text(
    "Hello World",
    textAlign: TextAlign.left,
),
Text(
    "Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world ",
    maxLines: 2,
    overflow: TextOverflow.ellipsis,
),
Text(
    "Hello World",
    textScaleFactor: 1.5,
),
Text(
    "Hello World",
    style: TextStyle(
        color: Colors.blue,
        fontSize: 18,
        height: 2.5,
        fontFamily: "Courier",
        background: Paint()..color = Colors.grey,
        decoration: TextDecoration.underline,
        decorationStyle: TextDecorationStyle.dashed,
    ),
),
Text(
    "Hello World",
    textScaleFactor: 1.5,
),
```

textAlign：文本对齐方式。

maxLines：文本显示最大行数。

overflow：超出文本显示方式，默认显示`...`。

textScaleFactor：文本缩放因子。

**TextStyle**

TextStyle用于指定文本显示的样式，如颜色、字体、粗细、背景等。

color：设置文本颜色。

background：设置文本背景颜色。

fontSize：设置字体大小。

fontFamily：设置字体名称。

height：指定行高，具体行高 = fontSize x height

decoration：文本的装饰。

decorationStyle：文本装饰的样式。



### TextSpan

Text中的文本内容只能使用一种样式，可以使用TextSpan按照不同内容显示不同的样式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c474a2ce13064e64bed50840e66d91bb.png)

```dart
Text.rich(TextSpan(
    children: [
        TextSpan(
            text: "Hello World",
        ),
        TextSpan(
            text: "www.baidu.com",
            style: TextStyle(
                color: Colors.blue,
            ),
        ),
    ],
))
```



### DefaultTextStyle

在widget树中，文本的样式是可以被继承的，子级文本组建没有指定样式时，会使用父级的样式，DefaultTextStyle可以用于设置默认文本样式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d2b5b16b5d4445db91f7e5632e417c7b.png)

```dart
DefaultTextStyle(
    style: TextStyle(
        color: Colors.red,
        fontSize: 20,
    ),
    child: Column(
        children: [
            Text("AAA"),
            Text("BBB"),
            Text("CCC"),
        ],
    ),
)
```



## 按钮组件

### ElevatedButton

漂浮按钮，默认带有阴影和灰色背景。按下后，阴影变大。

![在这里插入图片描述](https://img-blog.csdnimg.cn/87a5bab5f82b450b9dc586d851caa3e2.png)

```dart
ElevatedButton(
    child: Text("漂浮按钮"),
    onPressed: () {},
)
```



### TextButton

文本按钮，默认透明并不带阴影。按下后，会有背景色。

![在这里插入图片描述](https://img-blog.csdnimg.cn/58abce7580aa4d0f90b280be1682768a.png)

```dart
TextButton(
    child: Text("文本按钮"),
    onPressed: () {},
)
```



### OutlineButton

边框按钮，默认带有边框、背景透明、不带阴影。按钮后，边框、背景、阴影会有变化。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e3beeca3af634076885291cdbfa18794.png)

```dart
OutlineButton(
    child: Text("边框按钮"),
    onPressed: () {},
)
```



### IconButton

图标按钮，不包含文字。

![在这里插入图片描述](https://img-blog.csdnimg.cn/79f68b120ef044a9b6d6c88c930b3e9a.png)

```dart
IconButton(
    icon: Icon(Icons.home),
    onPressed: () {},
)
```



### 带图标的按钮

ElevatedButton、TextButton、OutlineButton都有一个`icon`构造函数，可以设置图标。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5157eb4c82a94e03a34c411b7c443931.png)

```dart
ElevatedButton.icon(
    onPressed: () {},
    icon: Icon(Icons.add),
    label: Text("添加"),
),
OutlinedButton.icon(
    onPressed: () {},
    icon: Icon(Icons.delete),
    label: Text("删除"),
),
TextButton.icon(
    onPressed: () {},
    icon: Icon(Icons.info),
    label: Text("详情"),
)
```



## 图片图标组件

图片组件是Flutter的基础组件之一。图标组件包含Image和Icon两个组件，Icon本是是一种文字，只是显示的是图标而不是文字，Image是通过图片解码器将图片解码加载，所以Icon体积更小、加载更快、不会失真。

```
width/height：设置图片宽高。如果不设置宽高时，图片会显示原始大小；如果只设置宽或高，则另一个属性会按比例缩放。

fit：图片显示模式：
    - BoxFit.fill：拉伸填充显示空间，图片会变形。
    - BoxFit.cover：图片会按比例放大填充满显示空间，超出显示空间的部分会被裁剪。
    - BoxFit.contain：图片默认显示规则，按比例缩放适应显示空间。
    - BoxFit.fitWidth：图片宽度会缩放到显示空间的宽度，高度会按比例缩放，居中显示，超出显示空间的部分会被剪裁。
    - BoxFit.fitHeight：图片高度会缩放到显示空间的高度，宽度会按比例缩放，居中显示，超出显示空间的部分会被剪裁。
    - BoxFit.none：图片显示原始大小，只会显示图片中间部分。

color：设置图片颜色。

colorBlendMode：设置颜色混合模式。

repeat：图片小于显示空间时，设置图片的重复规则。
```



### 加载资源图片

需要在`pubspec.yaml`文件中，配置如下：

```
flutter:

  uses-material-design: true

  assets:
    - images/logo.png
    - images/pub.png
    - images/user.png
```

**加载图片**

```dart
Image(
    image: AssetImage("images/logo.png"),
    width: 100,
)
```

**简写**

```dart
Image.asset(
    "images/logo.png",
    width: 100,
)
```



### 加载网络图片

```dart
Image(
    image: NetworkImage(
        "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"),
    width: 100,
)
```

**简写**

```dart
Image.network(
    "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    width: 100,
)
```



### 淡入淡出效果

加载图片时淡入淡出效果

```dart
Image.network(
    "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    width: 100,
    frameBuilder: (
        BuildContext context,
        Widget child,
        int? frame,
        bool wasSynchronouslyLoaded,
    ) {
        if (wasSynchronouslyLoaded) {
            return child;
        } else {
            return AnimatedOpacity(
                opacity: frame == null ? 0 : 1,
                duration: const Duration(seconds: 2),
                child: child,
                curve: Curves.easeOut,
            );
        }
    },
)
```



### loading动画

```dart
Image.network(
    "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    width: 100,
    loadingBuilder: (
        BuildContext context,
        Widget child,
        ImageChunkEvent? loadingProgress,
    ) {
        if (loadingProgress == null) {
            return child;
        } else {
            return CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                ? loadingProgress.cumulativeBytesLoaded /
                loadingProgress.expectedTotalBytes!
                : null,
            );
        }
    },
)
```



### 圆形头像加边框

![在这里插入图片描述](https://img-blog.csdnimg.cn/e2d8375b5fc64a6a817bc40173a4d5b6.png)

```dart
Container(
    width: 100,
    height: 100,
    padding: const EdgeInsets.all(3),
    decoration: const BoxDecoration(
        shape: BoxShape.circle, color: Colors.blue),
    child: Container(
        decoration: const BoxDecoration(
            shape: BoxShape.circle,
            image: DecorationImage(
                image: NetworkImage(
                    "https://img1.baidu.com/it/u=1235679188,872295587&fm=26&fmt=auto",
                ),
                fit: BoxFit.cover,
            ),
        ),
    ),
)
```



### 占位图

```dart
Image.network(
    "https://img1.baidu.com/it/u=1235679188,872295587&fm=26&fmt=auto",
    width: 100,
    fit: BoxFit.cover,
    //加载中占位
    frameBuilder: (
        BuildContext context,
        Widget child,
        int? frame,
        bool wasSynchronouslyLoaded,
    ) {
        if (frame == null) {
            return Image.asset("images/logo.png", width: 100);
        } else {
            return child;
        }
    },
    //加载失败占位
    errorBuilder: (
        BuildContext context,
        Object error,
        StackTrace? stackTrace,
    ) {
        return Image.asset("images/user.png", width: 100);
    },
)
```



### 字体图标

Flutter可以像web开发一样使用字体图标iconfont。

Flutter默认包含一套MaterialDesign的字体图标，在`pubspec.yaml`文件中配置：

```
flutter:

  uses-material-design: true
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9cc4e7a9208649edabee5936eebe6e39.png)

```dart
String icons = "";
icons += "\uE03e";
icons += "\uE237";
icons += "\uE287";

Text(
    icons,
    style: TextStyle(
        fontFamily: "MaterialIcons",
        fontSize: 24,
        color: Colors.blue,
    ),
)
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/272debedafe14ab5866ac10c52e2af73.png)

```dart
Row(
    children: [
        Icon(Icons.error, color: Colors.green),
        Icon(Icons.euro, color: Colors.green),
        Icon(Icons.event, color: Colors.green),
    ],
)
```



### 自定义字体图标

![在这里插入图片描述](https://img-blog.csdnimg.cn/987f83a6bfa848329d7e692abaac0ca2.png)

在`pubspec.yaml`文件里配置

```yaml
fonts:
  - family: myIcon
    fonts:
      - asset: fonts/iconfont.ttf
        style: italic
```

使用：

```
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: const [
    Icon(IconData(0xe678, fontFamily: "myIcon")),
    SizedBox(width: 10),
    Icon(IconData(0xe679, fontFamily: "myIcon")),
    SizedBox(width: 10),
    Icon(IconData(0xe69c, fontFamily: "myIcon")),
  ],
)
```



## 输入框和表单组件



### ios风格

![在这里插入图片描述](https://img-blog.csdnimg.cn/854f112d38ad46138e84200c055074d5.png)

```dart
CupertinoActivityIndicator(
    radius: 10,
    animating: true,
)
```



### Form

Flutter提供Form组件，便于对输入框进行分组统一操作，如输入内容验证、输入框重置、数据保存等操作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b51e2c4fa9fd4fdd99dcb07af637831d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_7,color_FFFFFF,t_70,g_se,x_16)

```dart
import 'package:flutter/material.dart';

class FormPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() {
        return _FormPageState();
    }
}

class _FormPageState extends State<FormPage> {
    final TextEditingController _userController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();
    final GlobalKey _formKey = GlobalKey<FormState>();

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text("Form组件"),
            ),
            body: Form(
                key: _formKey,
                autovalidateMode: AutovalidateMode.always,
                onChanged: () {
                    print("子组件FormField发生变化了");
                },
                child: Padding(
                    padding: EdgeInsets.all(10),
                    child: Column(
                        children: [
                            TextFormField(
                                autofocus: true,
                                controller: _userController,
                                decoration: InputDecoration(
                                    labelText: "用户名",
                                    hintText: "请输入用户名",
                                    icon: Icon(Icons.person),
                                ),
                                validator: (value) {
                                    if (value != null) {
                                        return value.trim().length > 0 ? null : "用户名不能为空";
                                    } else {
                                        return "用户名不能为空";
                                    }
                                },
                                onSaved: (value) {
                                    print("保存1");
                                },
                            ),
                            TextFormField(
                                controller: _passwordController,
                                decoration: InputDecoration(
                                    labelText: "密码",
                                    hintText: "请输入密码",
                                    icon: Icon(Icons.lock),
                                ),
                                obscureText: true,
                                validator: (value) {
                                    if (value != null) {
                                        return value.trim().length >= 6 ? null : "密码不能少于6位";
                                    } else {
                                        return "请输入密码";
                                    }
                                },
                                onSaved: (value) {
                                    print("保存2");
                                },
                            ),
                            Padding(
                                padding: EdgeInsets.all(5),
                                child: Column(
                                    children: [
                                        ElevatedButton(
                                            child: Text("登陆"),
                                            onPressed: () {
                                                if ((_formKey.currentState as FormState).validate()) {
                                                    print("验证通过");
                                                } else {
                                                    print("验证失败");
                                                }
                                            },
                                        ),
                                        ElevatedButton(
                                            child: Text("保存"),
                                            onPressed: () {
                                                (_formKey.currentState as FormState).save();
                                            },
                                        ),
                                        ElevatedButton(
                                            child: Text("重置"),
                                            onPressed: () {
                                                (_formKey.currentState as FormState).reset();
                                            },
                                        ),
                                    ],
                                ),
                            ),
                        ],
                    ),
                ),
            ),
        );
    }
}
```

**Form**

autovalidateMode：是否自动校验输入框内容。

- disabled：不会自动验证。
- always：会自动验证。
- onUserInteraction：用户交互后验证。

onChanged：Form中的子组件FormField发生变化时调用。

**FormField**

Form的子元素必须是FormField类型。

**FormState**

FormState是Form的State类。

- FormState#validate()：会调用每一个子组件FormField的validate方法，如果有一个验证失败，则返回false，所有验证失败项会有错误提示。
- FormState#save()：会调用子组件的save方法。
- FormState#reset()：会清空子组件的内容。



## 进度条组件

### 条形进度条

```
value：表示当前进度，取值范围为[0,1]。如果value为null则进度条会执行循环动画（模糊进度）；如果value不为null，则进度条有具体进度。

backgroundColor：进度条背景颜色。

valueColor：进度条颜色。可以通过AlwaysStoppedAnimation指定。
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/0dfa1307e8504b6aabce79e489c19226.png)

```dart
LinearProgressIndicator(
    value: 0.5,
    backgroundColor: Colors.grey,
    valueColor: AlwaysStoppedAnimation(Colors.blue),
),

LinearProgressIndicator(
    backgroundColor: Colors.grey,
    valueColor: AlwaysStoppedAnimation(Colors.blue),
),
```



### 环形进度条

```
strokeWidth：设置弧线宽度。

其他属性与LinearProgressIndicator基本类似。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/472afac6ccc748c5ab2cbad09aafacba.png)

```dart
CircularProgressIndicator(
    backgroundColor: Colors.grey,
    valueColor: AlwaysStoppedAnimation(Colors.red),
),
SizedBox(height: 20),
CircularProgressIndicator(
    backgroundColor: Colors.grey,
    valueColor: AlwaysStoppedAnimation(Colors.red),
    value: 0.5,
),
```



### 设置尺寸

LinearProgressIndicator和CircularProgressIndicator没有提供设置尺寸的参数，它们是去父容器的尺寸作为绘制的边界，这时可以借助SizedBox、ConstrainedBox限制指定尺寸。



![在这里插入图片描述](https://img-blog.csdnimg.cn/00b763ca39654023a52a8c6ebddf36a3.png)

```dart
//将条形进度条设置为高3宽100
SizedBox(
    height: 3,
    width: 100,
    child: LinearProgressIndicator(
        value: 0.5,
        backgroundColor: Colors.grey,
        valueColor: AlwaysStoppedAnimation(Colors.blue),
    ),
),
SizedBox(height: 20),
//将环形进度条设置为直径100
SizedBox(
    height: 100,
    width: 100,
    child: CircularProgressIndicator(
        value: 0.5,
        backgroundColor: Colors.grey,
        valueColor: AlwaysStoppedAnimation(Colors.blue),
    ),
),
```



### 进度条动画

3秒内进度条颜色由灰色变为蓝色。

```dart
import 'package:flutter/material.dart';

class ProgressPage extends StatefulWidget {
    const ProgressPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _ProgressPageState();
    }
}

class _ProgressPageState extends State<ProgressPage>
    with SingleTickerProviderStateMixin {
    late AnimationController _animationController;

    @override
    void initState() {
        _animationController =
            AnimationController(vsync: this, duration: Duration(seconds: 3));
        _animationController.forward();
        _animationController.addListener(() {
            setState(() {});
        });
        super.initState();
    }

    @override
    void dispose() {
        _animationController.dispose();
        super.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text("进度条组件"),
            ),
            body: Padding(
                padding: EdgeInsets.all(10),
                child: Column(
                    children: [                       
                        Text("3秒由灰色变蓝色动画"),
                        LinearProgressIndicator(
                            backgroundColor: Colors.grey,
                            valueColor: ColorTween(begin: Colors.grey, end: Colors.blue)
                            .animate(_animationController),
                            value: _animationController.value,
                        ),
                    ],
                ),
            ),
        );
    }
}
```



##  其他组件

### Radio & Checkbox & Switch

![在这里插入图片描述](https://img-blog.csdnimg.cn/6efa1c9dc2904419b27947ae57dc2abd.png)

```dart
class SwitchCheckBoxPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _SwitchCheckBoxPageState();
  }
}

class _SwitchCheckBoxPageState extends State<SwitchCheckBoxPage> {
  bool _switchSelected = false;
  bool _checkboxSelected = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("图片组件"),
      ),
      body: Column(
        children: [
          Switch(
            value: _switchSelected,
            onChanged: (value) {
              setState(() {
                _switchSelected = value;
              });
            },
          ),
          Checkbox(
            value: _checkboxSelected,
            activeColor: Colors.red,
            checkColor: Colors.white,
            onChanged: (value) {
              setState(() {
                _checkboxSelected = value ?? false;
              });
            },
          ),
        ],
      ),
    );
  }
}
```



### Slider

滑块组件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1da726de82648f7a26b1e10137ccd67.png)

```dart
double _sliderValue = 0;

Slider(
    value: _sliderValue,
    onChanged: (value) {
        print("Slider值：$value");
        setState(() {
            _sliderValue = value;
        });
    },
)
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e55e151a5ad34515bb08e98313b89661.png)

```dart
double _sliderValue2 = 0;

Slider(
    //标签
    label: "值：$_sliderValue2",
    //最小值
    min: 0,
    //最大值
    max: 100,
    //离散值
    divisions: 2,
    //已滑动颜色
    activeColor: Colors.red,
    //未滑动颜色
    inactiveColor: Colors.grey,
    //滑块颜色
    // thumbColor: Colors.blue,
    value: _sliderValue2,
    onChanged: (value) {
        print("Slider值：$value");
        setState(() {
            _sliderValue2 = value;
        });
    },
)
```



### RangeSlider

范围滑块。

![在这里插入图片描述](https://img-blog.csdnimg.cn/38fe1b1d21b54e8c81114d5c63b49912.png)

```dart
RangeValues _rangeValues = RangeValues(0, 0);

RangeSlider(
    values: _rangeValues,
    labels:
    RangeLabels("${_rangeValues.start}", "${_rangeValues.end}"),
    min: 0,
    max: 100,
    divisions: 4,
    onChanged: (value) {
        setState(() {
            _rangeValues = value;
        });
    },
)
```





