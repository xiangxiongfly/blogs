[toc]

# Android 系统启动流程

## Android架构图

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b50b150b4c3f4668ba7b90b7634aa601.png)



## 系统启动流程

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f04adeb51ffa41b6a88d5a2b575bf9bf.jpeg)

Android 系统启动分底层 Linux 内核启动和应用系统启动：

- 底层系统启动：系统上电、bootloader启动、Linux内核启动、init进程启动。
- 应用系统启动：Zygote进程启动、System Server启动。

完整启动流程：

- 上电和自检（Power-On Self-Test, POST）:
  - 当设备加电后，首先会执行一些基本的硬件自检，确保所有的硬件组件都正常工作。
- BootLoader（引导加载程序）：
  - BOOT ROM 会加载 Bootloader 到 RAM，然后把控制权交给 BootLoader。
  - BootLoader 的作用是初始化硬件设备，加载内核文件，然后启动内核。
- Linux Kernel：
  - Linux 内核负责初始化各种软硬件环境，加载驱动程序，挂载根文件系统(/)等。
  - 内核启动完成后，它会在根文件系统中寻找 ”init” 文件，然后启动 init 进程。
- init 进程：
  - init 进程是 Linux 系统中用户空间的第一个进程，进程号为 1，我们可以说它是 root 进程或者所有进程的父进程。
  - init 进程主要工作：
    - 挂载虚拟文件系统：如 /sys、/dev、/proc
    - 启动 property 服务
    - 启动 SELinux
    - 解析执行 init.rc 文件
- Zygote 进程（孵化器）：
  - init 进程在解析 init.rc 时，会创建 zygote 进程，它是 Android 系统最重要的进程之一。
  - zygote 是 Android 系统所有应用的父进程，后续 Android 中的 App 进程都是由 zygote 进程 fork 出来的。
  - Zygote 进程主要工作：
    - 创建虚拟机
    - 通过 AndroidRuntime 启动 ZygoteInit，ZygoteInit主要工作：
      - 创建 socket 服务，接受 ActivityManagerService 的应用启动请求
      - 加载 framework 资源
      - 启动System Server 进程
      - 监听 socket，当有启动应用请求到达，fork 生成 App 应用进程
- System Server 进程：
  - 与 Zygote 进程一样，SystemServer 进程同样是 Android 系统中最重要的进程之一。
  - 主要工作：
    - 启动各种系统服务，如：ActivityManagerService，PackageManagerService，WindowManagerService 以及硬件相关的 Service 等服务，我们平时熟知的各种系统服务其实都是在 SystemServer 进程中启动的，这些服务都运行在同一进程（即 System Server 进程）的不同线程中，而当我们的应用需要使用各种系统服务的时候其实也是通过与 SystemServer 进程通讯获取各种服务对象的句柄进而执行相应的操作的。
- Launcher（桌面应用程序）：
  - SystemServer 进程再启动的过程中会启动PackageManagerService，PackageManagerService 启动后会将系统中的应用程序安装完成。
  - System Server 进程启动完所有的服务后，会调用各服务的 service.systemReady(…)。Launcher 的启动逻辑就在 ActivityManagerService.systemReady()  中。
- BootAnimation 退出：
  - Launcher 启动完之后，我们还看不到 Launcher，因为被 BootAnimation 的画面挡住了。
  - 第一个应用起来之后，其 ActivityThread 线程进入空闲状态时，会通过某种机制把 BootAnimation 给退出。这里的第一个应用自然就是 Launcher了。这样就能确保在 BootAnimation 退出后，用户看到的不是黑屏，而是我们的桌面了。



## 参考资料

https://blog.csdn.net/shulianghan/article/details/39125439

https://juejin.cn/post/7316121883635023891

