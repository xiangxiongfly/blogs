[toc]

# Compose 渲染流程

## 概述

传统View系统中，组件渲染可分为三步骤：测量、布局与绘制。

Compose 也遵循这样的分层设计，将组件渲染流程划分为组合、布局与绘制这三个阶段：

- 组合：执行 Composable 函数体，生成并维护 LayoutNode 视图树。
- 布局：对于视图树中的每个 LayoutNode 进行宽高尺寸测量并完成位置摆放。
- 绘制：将所有 LayoutNode 绘制到屏幕之上。





## 布局

布局阶段用于对视图树中的每个 LayoutNode 进行尺寸测量并完成位置摆放，每个 LayoutNode 都会根据父 LayoutNode 的布局约束进行自我测量。

LayoutNode 不允许多次测量。

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/95bad161cefc46728bce77e0c88c7c9e.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e3a0c735b881482fbf2778daae4d0c68.png)



























































































