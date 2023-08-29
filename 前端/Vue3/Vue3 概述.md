[toc]

# Vue3 概述

## 概述

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。

Vue 的两个核心功能：

*   **声明式渲染**：Vue 基于标准 HTML 拓展了一套模板语法，使得我们可以声明式地描述最终输出的 HTML 和 JavaScript 状态之间的关系。
*   **响应性**：Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM。

[Vue3官方文档](https://cn.vuejs.org/)

[Vite官方文档](https://cn.vitejs.dev/)



## Vue3对比Vue2优势

- 更容易维护：
  - 组合式API
  - 更好的TypeScript支持
- 更快的速度：
  - 重写diff算法
  - 模板编译优化
  - 更高效的组件初始化
- 更优点数据响应式：
  - Proxy
- 更小的体积：
  - 良好的TreeShaking
  - 按需引用



## 选项式API和组合式API

选项式 API（Options API）：每个功能的：数据、方法、计算属性等，是分散在：data、methods、computed配置中的，若想新增或者修改一个需求，就需要分别修改：data、methods、computed，不便于代码的维护和复用。

组合式API（Composition API）：可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起。

**选项式API案例：**

```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件监听器绑定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

**组合式API案例：**

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```



## 使用create-vue创建项目

### 概述

create-vue是Vue官方新的脚手架工具，底层切换到了 vite （下一代前端工具链），为开发提供极速响应。

[vite官方文档](https://cn.vitejs.dev/)

### 创建项目

**方式一：**

执行命令：

```
npm init vue@latest
```

配置：

```
✔ Project name: … <your-project-name>
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit testing? … No / Yes
✔ Add an End-to-End Testing Solution? … No / Cypress / Playwright
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
```

依次执行命令启动项目：

```
cd <项目名>
npm install
npm run dev
```

**方式二：**

快速创建命令

```
npm create vite@latest <项目名> -- --template vue
```

### 目录结构

![Vue Cli](https://img-blog.csdnimg.cn/b9df8619b8c043a497887542b2862773.png)

- vite.config.js：项目的配置文件，基于vite。
- package.json：项目包文件，核心依赖为vue和vite。
- main.js：入口文件，createApp函数创建应用实例。
- index.html：单页入口，提供id为app的挂载点。
- app.vue：根组件，SFC单文件组件，script-template-style。



## 使用vue-cli创建项目

### 概述

vue-cli是Vue官方脚手架工具，底层是基于webpack。

[vue-cli官方文档](https://cli.vuejs.org/zh/)

### 创建项目

Vue CLI 4.x 需要 [Node.js](https://nodejs.org/) v8.9 或更高版本 (推荐 v10 以上)。

**安装vue-cli：**

```
npm install -g @vue/cli
```

**查看vue-cli版本：**

```
vue --version
```

**方式一：创建项目**

执行命令：

```
vue create <项目名>
```

启动项目：

```
npm run serve
```

**方式二：图形化界面**

执行如下命令打开图形界面：

```
vue ul
```

### 目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/49c09e924e61403ead70d36ce73db0b2.png)

- vue.config.js：项目的配置文件，基于webpack。

