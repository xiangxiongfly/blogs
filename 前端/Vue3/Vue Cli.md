[toc]

# Vue Cli

## 概述

Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统，提供：

- 通过 `@vue/cli` 实现的交互式的项目脚手架。

- 通过 `@vue/cli` + `@vue/cli-service-global` 实现的零配置原型开发。

- 一个运行时依赖 (`@vue/cli-service`)，该依赖：

  - 可升级；
  - 基于 webpack 构建，并带有合理的默认配置；
  - 可以通过项目内的配置文件进行配置；
- 可以通过插件进行扩展。
  
- 一个丰富的官方插件集合，集成了前端生态中最好的工具。

- 一套完全图形化的创建和管理 Vue.js 项目的用户界面。

[Vue Cli官方文档](https://cli.vuejs.org/zh/guide/)



## 安装

```
npm install -g @vue/cli
```

**检查版本：**

```
vue --version
```



## 创建项目

### 命令式

通过如下命令创建新项目：

```
vue create my-vue-cli-app
```

启动运行：

```
npm run serve
```



### 图形化界面

执行如下命令打开图形界面：

```
vue ui
```

