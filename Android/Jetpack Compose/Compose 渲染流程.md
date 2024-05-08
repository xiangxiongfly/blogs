[toc]

# Compose 渲染流程

## 概述

传统View系统中，组件渲染可分为三步骤：测量、布局与绘制。

Compose也遵循这样的分层设计，将组件渲染流程划分为组合、布局与绘制这三个阶段：

- 组合：执行Composable函数体，生成并维护LayoutNode视图树。
- 布局：对于视图树中的每个LayoutNode进行宽高尺寸测量并完成位置摆放。
- 绘制：将所有LayoutNode实际绘制到屏幕之上。



































































