[TOC]

# Android 常用ADB命令

## 概述

Android 调试桥 (`adb`) 是一种功能多样的命令行工具，可让您与设备进行通信。`adb` 命令可用于执行各种设备操作，例如安装和调试应用。

[官网](https://developer.android.com/tools/adb?hl=zh-cn)



## adb 的工作原理

当您启动某个 `adb` 客户端时，该客户端会先检查是否有 `adb` 服务器进程已在运行。如果没有，它会启动服务器进程。服务器在启动后会与本地 TCP 端口 5037 绑定，并监听 `adb` 客户端发出的命令。

**注意**：所有 `adb` 客户端均使用端口 5037 与 `adb` 服务器通信。



## 命令

### adb命令

您可以使用开发机器上的命令行或使用以下命令通过脚本发出 `adb` 命令：

```
adb [-d | -e | -s serial_number] command
```

### shell命令

直接使用 shell 命令：

适合单个命令。

```
adb [-d |-e | -s serial_number] shell shell_command
```

使用交互式 shell 命令：

适合多个命令。

退出交互式 shell，请按 `Control+D` 或输入 `exit`。

```
adb [-d | -e | -s serial_number] shell
```



## 使用

### adb服务器

```
停止adb服务器：
adb kill-server

启动adb服务器：
adb start-server
```

### 操作设备

```
获取信息：
adb --help

重启设备：
adb reboot

获取设备列表：
adb devices

查看设备详细信息：
adb devices -l

获取设备屏幕分辨率：
adb shell wm size

截屏：
adb shell screencap <路径>
如：adb shell screencap /sdcard/abc.png

录屏：
adb shell screenrecord <路径>
如：adb shell screenrecord /sdcard/demo.mp4
停止录屏：按 ctrl+c 停止
```

重启：先执行 `adb kill-server` 再执行 `adb start-server`

### 操作应用

```
安装app：
adb install <apk路径>

授权安装app：
adb install -g <apk路径>

降级安装app
adb install -d <apk路径>

替换安装app：
adb install -r <apk路径>

卸载app：
adb uninstall <包名>
如：adb uninstall com.example.app
```

### 文件操作

```
从电脑复制文件到手机：
adb push <电脑的文件路径> <手机的文件路径>
如：adb push C:\Users\Administrator\Desktop\abc.zip /sdcard/Download/123.rar

从手机复制文件到电脑：
adb pull <手机的文件路径> <电脑的文件路径>
如：adb pull /sdcard/123123.rar  D:\downloads\efj.zip
```

### activity操作

```
隐式启动Activity：
adb shell am start -a android.intent.action.VIEW

显式启动Activity：
adb shell am start -n com.example.app/.ui.WelcomeActivity
```

### 日志操作

```
将日志导入文件：
adb logcat -d > <文件路径>
如：adb logcat -d > logcat.txt
```

