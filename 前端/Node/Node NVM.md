[toc]

# Node NVM

## 概述

nvm全英文也叫node.js version management，是一个nodejs的版本管理工具。nvm和n都是node.js版本管理工具，为了解决node.js各种版本存在不兼容现象可以通过它可以安装和切换不同版本的node.js。

[nvm 文档](https://nvm.uihtm.com/)



## 安装

一、安装nvm之前尽量卸载node.js，避免一些奇葩问题。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9df81c48e33c4cbf80b074161d649d27.png)

二、选择nvm安装路径：

![在这里插入图片描述](https://img-blog.csdnimg.cn/99d553ab057f4e2ca55d08a46182e86f.png)

三、选择nodejs路径：

![在这里插入图片描述](https://img-blog.csdnimg.cn/4151bff13d594840a8b52b7ab2deadee.png)

四、安装成功，输入`nvm`命令查看。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba4747a32f6344f09e68140ea50c4a57.png)



## nvm常用命令

```
nvm //查看nvm相关信息

nvm version //查看nvm版本

nvm list //查看安装列表

nvm install 16.19.1 //安装指定版本的nodejs

nvm uninstall 19.16.1 //卸载指定版本

nvm use 19.16.1 //使用指定版本
```

