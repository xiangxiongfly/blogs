[TOC]

# Flutter 包管理

## 概述

Flutter通过`pubspec.yaml`管理第三方库。

Pub（https://pub.dev/ ）是 Google 官方的 Dart Packages 仓库。



## 说明

```yaml
name: MyFlutter
description: A new Flutter project.

publish_to: 'none' 

version: 1.0.0+1

environment:
  sdk: ">=2.12.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter

  flutter_lints: ^1.0.0

flutter:
  uses-material-design: true
```

name：应用包名

description：包名的描述

version：版本号

dependencies：依赖库

dev_dependencies：测试环境依赖库

flutter：Flutter相关配置



## 案例

**添加依赖**

```yaml
dependencies:
  flutter:
    sdk: flutter
  # 添加第三方库
  english_words: ^4.0.0
```



**添加本地依赖**

```
dependencies:
	pkg1:
        path: ../../code/pkg1
```



**添加git依赖**

```
dependencies:
  pkg1:
    git:
      url: git://github.com/xxx/pkg1.git
```

可以使用path指定位置

```
dependencies:
  package1:
    git:
      url: git://github.com/flutter/packages.git
      path: packages/package1        
```

