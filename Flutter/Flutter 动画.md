[TOC]

# Flutter 动画

## 概述

Flutter对动画系统进行抽象、封装，使我们可以方便的进行动画开发。

-   AnimationController继承自Animation，负责动画的播放、停止等操作，通常在`initState`方法中初始化，在`dispose`方法中释放。Animation是一个抽象类，不能直接实例化。
-   Tween继承自Animatable，定义动画执行的范围，通常需要和AnimationController使用。
-   Curve类似于Android中的Interpolator，控制动画的速率。



## 简单使用

**AnimationController类：**

```
vsync：vsync可以防止屏幕外动画消耗不必要的资源，单个AnimationController使用SingleTickerProviderStateMixin，多个AnimationController使用TickerProviderStateMixin。

duration：动画执行时长。

lowerBound & upperBound：设置开始值和结束值。AnimationController的默认值是[0,1]。

addListener：动画监听。

addStatusListener：动画执行状态：
    - dismissed：动画停止在开始处。
    - forward：动画正在从开始处运行到结束处（正向运行）。
    - reverse：动画正在从结束处运行到开始处（反向运行）。
    - completed：动画停止在结束处。

动画控制方法：
    - forward()：正向动画。
    - reverse()：反向动画。
    - repeat()：反复执行动画。
    - reset()：重置动画。
```

### 缩放动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/3e0b4e4610b54053aa79615fa0f5b4fb.gif)

```dart
late AnimationController _scaleController;
double _size = 100;

@override
void initState() {
    super.initState();
    _scaleController =
        AnimationController(vsync: this, duration: const Duration(seconds: 2), lowerBound: 100, upperBound: 200)
        ..addListener(() {
            setState(() {
                _size = _scaleController.value;
            });
        });
}

@override
void dispose() {
    _scaleController.dispose();
    super.dispose();
}

Container(
    width: _size,
    height: _size / 2,
    color: Colors.red.withOpacity(_opacity),
    transformAlignment: Alignment.center,
)
```

### 透明度动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/2157c1d995cb4c67884da3bd8f642059.gif)

```dart
double _opacity = 1;
late AnimationController _alphaController;

@override
void initState() {
    super.initState();
    _alphaController = AnimationController(vsync: this, duration: const Duration(seconds: 2))
        ..addListener(() {
            setState(() {
                _opacity = _alphaController.value;
            });
        });
}

@override
void dispose() {
    _alphaController.dispose();
    super.dispose();
}

Container(
    width: _size,
    height: _size / 2,
    color: Colors.red.withOpacity(_opacity),
    transformAlignment: Alignment.center,
)
```

### 旋转动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/48f66e1c6b39495297d474ec08985d2b.gif)

```dart
double _rotation = 1;
late AnimationController _rotationController;

@override
void initState() {
    super.initState();
    _rotationController =
        AnimationController(vsync: this, duration: const Duration(seconds: 2), lowerBound: 1, upperBound: 2)
        ..addListener(() {
            setState(() {
                _rotation = _rotationController.value;
            });
        });
}

@override
void dispose() {
    _rotationController.dispose();
    super.dispose();
}

Container(
    width: _size,
    height: _size / 2,
    color: Colors.red.withOpacity(_opacity),
    transformAlignment: Alignment.center,
    transform: Matrix4.rotationZ(pi / _rotation),
)
```

### 循环执行动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/7a723fa1d6b84eba86cb592e5c513aad.gif)

```dart
_scaleController =
    AnimationController(vsync: this, duration: Duration(milliseconds: 500), lowerBound: 100, upperBound: 200)
    ..addStatusListener((status) {
        switch (status) {
            case AnimationStatus.dismissed:
                print("dismissed");
                _scaleController.forward();
                break;
            case AnimationStatus.forward:
                print("forward");
                break;
            case AnimationStatus.reverse:
                print("reverse");
                break;
            case AnimationStatus.completed:
                _scaleController.reverse();
                break;
        }
    })
    ..addListener(() {
        setState(() {
            _size = _controller.value;
        });
    });
```



## Tween

负责两种状态之间的过渡转换。

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc5221ef0e9c4d4db46899e65162c872.gif)

```dart
Color _color = Colors.green;
late AnimationController _controller;

@override
void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 3000))
        ..addListener(() {
            setState(() {
                _color = Color.lerp(Colors.green, Colors.blue, _controller.value)!;
            });
        });
}

@override
void dispose() {
    _controller.dispose();
    super.dispose();
}

GestureDetector(
    onTap: () {
        _controller.forward();
    },
    child: Container(
        width: 100,
        height: 100,
        color: _color,
        alignment: Alignment.center,
        child: const Text(
            "变色",
            style: TextStyle(color: Colors.white, fontSize: 18),
        ),
    ),
)
```



### ColorTween

本质也是由` Color.lerp`实现的。

```dart
final Color _startColor = Colors.yellow;
final Color _endColor = Colors.red;
late AnimationController _controller2;
late Animation<Color?> _animation;

@override
void initState() {
    super.initState();
    _controller2 = AnimationController(vsync: this, duration: const Duration(milliseconds: 3000))
        ..addListener(() {
            setState(() {});
        });
    _animation = ColorTween(begin: _startColor, end: _endColor).animate(_controller2);
}

@override
void dispose() {
    _controller2.dispose();
    super.dispose();
}

GestureDetector(
    onTap: () {
        _controller2.forward();
    },
    child: Container(
        width: 100,
        height: 100,
        color: _animation.value,
        alignment: Alignment.center,
        child: const Text(
            "变色",
            style: TextStyle(color: Colors.white, fontSize: 18),
        ),
    ),
)
```

### 平移动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/0dc5c06ce31245f2b84e3b4c92c1704e.gif)

```dart
late AnimationController _slideController;
late Animation<Offset> _animation;

@override
void initState() {
    super.initState();
    _slideController = AnimationController(vsync: this, duration: const Duration(seconds: 2))
        ..addListener(() {
            setState(() {});
        });
    _animation = Tween(begin: const Offset(0, 0), end: const Offset(100, 100)).animate(_slideController);
}

@override
void dispose() {
    _slideController.dispose();
    super.dispose();
}

Transform.translate(
    offset: _animation.value,
    child: Container(
        width: _size,
        height: _size / 2,
        color: Colors.red.withOpacity(_opacity),
        transformAlignment: Alignment.center,
        transform: Matrix4.rotationZ(pi / _rotation),
    ),
)
```



## Curve

Flutter中的Curve类似于Android中的Interpolator差值器，控制动画变化的速率，可分为：匀速、加速、减速等速率。

### 使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/2ec15fcda52d47d38dc534d65b49fb20.gif)

```dart
_controller =
    AnimationController(vsync: this, duration: Duration(milliseconds: 1000))
    ..addListener(() {
        setState(() {});
    });
_animation = Tween(begin: 100.0, end: 200.0)
    .chain(CurveTween(curve: Curves.bounceInOut))
    .animate(_controller);
```

```dart
child: Container(
    width: _animation.value,
    height: _animation.value,
    color: Colors.red,
    alignment: Alignment.center,
    child: const Text(
        "变大",
        style: TextStyle(color: Colors.white, fontSize: 18),
    ),
)
```



### 自定义Curve

```dart
class _MyCurve extends Curve {
    late final int num;

    _MyCurve(this.num);

    @override
    double transformInternal(double t) {
        return t * num;
    }
}
```

```dart
_animation = Tween(begin: 100.0, end: 200.0)
    .chain(CurveTween(curve: _MyCurve(5)))
    .animate(_controller);
```



## 动画混合使用

### 多动画同时执行

同时变大变色效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0426155d8e9a46c4a5af83255bff2765.gif)

```dart
class AnimationMultiPage extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => _AnimationMultiPageState();
}

class _AnimationMultiPageState extends State<AnimationMultiPage> with TickerProviderStateMixin {
    late AnimationController _sizeController;
    late AnimationController _colorController;
    late Animation<double> _sizeAnimation;
    late Animation<Color?> _colorAnimation;

    @override
    void initState() {
        super.initState();
        _sizeController = AnimationController(vsync: this, duration: Duration(seconds: 2))
            ..addListener(() {
                setState(() {});
            });
        _sizeAnimation = _sizeController.drive(CurveTween(curve: Curves.linear))
            .drive(Tween(begin: 100, end: 200));

        _colorController = AnimationController(vsync: this, duration: Duration(seconds: 2))
            ..addListener(() {
                setState(() {});
            });
        _colorAnimation = _colorController.drive(CurveTween(curve: Curves.linear))
            .drive(ColorTween(begin: Colors.blue, end: Colors.red));
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("同时变大变色"),
            ),
            body: Center(
                child: GestureDetector(
                    onTap: () {
                        _sizeController.forward();
                        _colorController.forward();
                    },
                    child: Container(
                        width: _sizeAnimation.value,
                        height: _sizeAnimation.value,
                        color: _colorAnimation.value,
                        alignment: Alignment.center,
                        child: const Text(
                            "变大变色",
                            style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                    ),
                ),
            ),
        );
    }

    @override
    void dispose() {
        _sizeController.dispose();
        _colorController.dispose();
        super.dispose();
    }
}
```



### 多动画依次执行

先变大再变色效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bc1fcd96ce8497e8ea6b4c7b36ea833.gif)

```dart
class AnimationMulti2Page extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => _AnimationMulti2PageState();
}

class _AnimationMulti2PageState extends State<AnimationMulti2Page> with SingleTickerProviderStateMixin {
    late AnimationController _controller;
    late Animation<double> _sizeAnimation;
    late Animation<Color?> _colorAnimation;

    @override
    void initState() {
        super.initState();
        _controller = AnimationController(vsync: this, duration: Duration(seconds: 2))
            ..addListener(() {
                setState(() {});
            });
        _sizeAnimation = _controller.drive(CurveTween(curve: Interval(0.0, 0.5)))
            .drive(Tween(begin: 100, end: 200));
        _colorAnimation = _controller.drive(CurveTween(curve: Interval(0.5, 1.0)))
            .drive(ColorTween(begin: Colors.blue, end: Colors.red));
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("先变大再变色"),
            ),
            body: Center(
                child: GestureDetector(
                    onTap: () {
                        _controller.forward();
                    },
                    child: Container(
                        width: _sizeAnimation.value,
                        height: _sizeAnimation.value,
                        color: _colorAnimation.value,
                        alignment: Alignment.center,
                        child: const Text(
                            "先变大再变色",
                            style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                    ),
                ),
            ),
        );
    }

    @override
    void dispose() {
        _controller.dispose();
        super.dispose();
    }
}
```



### 动画序列

```
weight：表示每个Tween的权重。
```



先变大暂停一段再变大效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac1fc3cbf55c4ee68cf32c03551eddec.gif)

```dart
class AnimationMulti3Page extends StatefulWidget {
    @override
    State<StatefulWidget> createState() => _AnimationMulti3PageState();
}

class _AnimationMulti3PageState extends State<AnimationMulti3Page> with SingleTickerProviderStateMixin {
    late AnimationController _controller;
    late Animation _animation;

    @override
    void initState() {
        super.initState();
        _controller = AnimationController(vsync: this, duration: Duration(seconds: 2))
            ..addListener(() {
                setState(() {});
            });
        _animation = TweenSequence([
            TweenSequenceItem(tween: Tween(begin: 100.0, end: 200.0).chain(CurveTween(curve: Curves.easeIn)), weight: 40),
            TweenSequenceItem(tween: ConstantTween<double>(200.0), weight: 20),
            TweenSequenceItem(tween: Tween(begin: 200.0, end: 300.0), weight: 40),
        ]).animate(_controller);
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("先变大暂停一段再变大"),
            ),
            body: Center(
                child: GestureDetector(
                    onTap: () {
                        _controller.forward();
                    },
                    child: Container(
                        width: _animation.value,
                        height: _animation.value,
                        color: Colors.red,
                        alignment: Alignment.center,
                        child: const Text(
                            "先变大暂停一段再变大",
                            style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                    ),
                ),
            ),
        );
    }

    @override
    void dispose() {
        _controller.dispose();
        super.dispose();
    }
}
```



## Hero

过渡动画。Hero是我们常用的过渡动画，当用户点击一张图片，切换到另一个页面时，这个页面也有此图，那么使用Hero组件就在合适不过了，先看下Hero的效果图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/3e0b4e4610b54053aa79615fa0f5b4fb.gif)

**第一页**

```dart
class HeroFirstPage extends StatefulWidget {
    const HeroFirstPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _HeroFirstPageState();
    }
}

class _HeroFirstPageState extends State<HeroFirstPage> {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("第一页"),
            ),
            body: GridView(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 5,
                    mainAxisSpacing: 3,
                ),
                children: List.generate(10, (index) {
                    return InkWell(
                        onTap: () {
                            Navigator.push(
                                context,
                                PageRouteBuilder(
                                    transitionDuration: const Duration(seconds: 2),
                                    pageBuilder: (BuildContext context, animation, secondaryAnimation) {
                                        return FadeTransition(
                                            opacity: animation,
                                            child: const HeroSecondPage(),
                                        );
                                    },
                                ),
                            );
                        },
                        child: Hero(
                            tag: "hero",
                            child: Container(
                                color: Colors.redAccent,
                                child: Image.asset(
                                    'images/logo.png',
                                ),
                            ),
                        ),
                    );
                }),
            ),
        );
    }
}
```

**第二页**

```dart

class HeroSecondPage extends StatelessWidget {
    const HeroSecondPage({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("第二页"),
            ),
            body: Container(
                alignment: Alignment.center,
                child: Hero(
                    tag: "hero",
                    child: Image.asset(
                        'images/logo.png',
                    ),
                ),
            ),
        );
    }
}
```



## 动画组件

### ScaleTransition 缩放动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/b62c74494b51492ab1b154c281e8d160.gif)

```dart
late AnimationController _controller;
late Animation<double> _animation;
_controller = AnimationController(vsync: this, duration: Duration(seconds: 2));
_animation = Tween(begin: 1.0, end: 0.1).animate(_controller);
```

```dart
ScaleTransition(
    scale: _animation,
    child: Container(
        width: 100,
        height: 100,
        color: Colors.red,
        alignment: Alignment.center,
        child: Text("变小"),
    ),
)
```

```dart
//执行动画
_controller.forward();

//重置动画
_controller.reset();
```



### AnimatedOpacity 透明动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/b7b5c97c371949a5872df1aaa24f2467.gif)

```dart
AnimatedOpacity(
    opacity: _opacity,
    duration: Duration(seconds: 2),
    child: Container(
        width: 100,
        height: 100,
        color: Colors.green,
        alignment: Alignment.center,
        child: Text("透明"),
    ),
)
```

```dart
//执行动画
setState(() {
    _opacity = 0;
});

//重置
setState(() {
    _opacity = 0;
});
```



### SlideTransition 移动动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/96bce4143de543c79098d2408a218cbb.gif)

```dart
late AnimationController _slideController;
late Animation<Offset> _slideAnimation;
_slideController = AnimationController(vsync: this, duration: const Duration(seconds: 2));
_slideAnimation =
    Tween(begin: const Offset(-1, 0), end: const Offset(0, 0)).animate(_slideController);

SlideTransition(
    position: _slideAnimation,
    child: Container(
        width: 100,
        height: 100,
        color: Colors.yellow,
        alignment: Alignment.center,
        child: const Text("移动"),
    ),
)
```

```dart
//执行动画
_slideController.forward();

//重置动画
_slideController.reset();
```



### RotationTransition 旋转动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fb95d4774564ad49d627d88fe825d72.gif)

```dart
late AnimationController _rotationController;
late Animation<double> _rotationAnimation;
_rotationController = AnimationController(vsync: this, duration: const Duration(seconds: 2));
_rotationAnimation = Tween(begin: 0.0, end: 0.5).animate(_rotationController);

RotationTransition(
    alignment: Alignment.center,
    turns: _rotationAnimation,
    child: Container(
        width: 100,
        height: 100,
        color: Colors.pink,
        alignment: Alignment.center,
        child: const Text("旋转"),
    ),
),
```

```dart
//执行动画
_rotationController.forward();

//重置动画
_rotationController.reset();
```



### AnimatedBuilder 构建简单动画

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7578e42dee4415bab76a53bb923caaf.gif)

```dart
_multiController = AnimationController(vsync: this, duration: Duration(seconds: 2));
_colorAnimation = ColorTween(begin: Colors.blue, end: Colors.red).animate(_multiController);
_sizeAnimation = SizeTween(begin: Size(100.0, 50.50), end: Size(50.0, 100.0))
    .animate(_multiController);
```

```dart
AnimatedBuilder(
    animation: _multiController,
    builder: (context, widget) {
        return Container(
            width: _sizeAnimation.value!.width,
            height: _sizeAnimation.value!.height,
            color: _colorAnimation.value,
            alignment: Alignment.center,
            child: Text("变形变色"),
        );
    },
)
```

```dart
//执行动画
_multiController.forward();

//重置
_multiController.reset();
```

