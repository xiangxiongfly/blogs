[TOC]

# Flutter 数据存储

## 概述

- 不同的平台对应的文件系统是不同的，Flutter获取文件路径需要原生支持，原生端通过MethodChannel传递文件路径到Flutter。
- 推荐使用Google官方的库`path_provider`，该库提供了8个方法获取不同的文件路径。

**添加依赖**

```yaml
dependencies:
	path_provider: ^2.0.7
```



## 文件路径

### getTemporaryDirectory()

临时目录，为应用程序的私有目录，其他应用无法访问，适用于下载的缓存文件，此目录随时可以被清楚。

- Android对应`getCacheDir`
- iOS对应`NSCachesDirectory`

```dart
```





























































