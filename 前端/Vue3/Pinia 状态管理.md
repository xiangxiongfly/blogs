[toc]

# Pinia 状态管理

## 概述

Pinia 是一个基于 Vue 3 的状态管理库，它的目标是提供更好的类型支持和更好的利用 TypeScript 特性的方式来进行状态管理。相比于 Vuex 等其他状态管理库，它使用起来更加简单、轻量级、可维护性更高。

Pinia 的主要特点包括：

1. 类型强化：Pinia 支持 TypeScript，它可以提供更好的类型推导，使得代码更加安全、可读性更高。
2. 模块化设计：Pinia 可以将应用程序的状态划分为多个模块，每个模块都有自己的状态、操作和 getter，这样可以提高代码的可维护性。
3. 插件支持：Pinia 提供了许多插件来扩展其功能，例如 devtools 插件可以在开发过程中帮助调试状态变化。
4. 开箱即用：Pinia 不需要额外的构建配置，只需安装并引入即可开始使用。
5. 可测试性：Pinia 将逻辑与状态分离，使得测试更加容易。

总之，Pinia 是一个非常优秀的状态管理库，在 Vue 3 项目中使用 Pinia 可以提高代码的可维护性和可测试性，同时还可以获得更好的开发体验和更好的类型推导支持。

[Pinia 官方文档](https://pinia.web3doc.top/)



## 安装

```
npm install pinia
```



## 使用

### 引入Pinia

```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

const app = createApp(App);
//支持Pinia
app.use(createPinia());
app.mount("#app");
```



### Store

一个 Store （如 Pinia）是一个实体，它持有未绑定到您的组件树的状态和业务逻辑。换句话说，**它托管全局状态**。它有点像一个始终存在并且每个人都可以读取和写入的组件。它有**三个概念**，[state](https://pinia.web3doc.top/core-concepts/state.html)、[getters](https://pinia.web3doc.top/core-concepts/getters.html) 和 [actions](https://pinia.web3doc.top/core-concepts/actions.html) 并且可以安全地假设这些概念等同于组件中的“数据”、“计算”和“方法”。

在`src`目录下新建`stores`文件夹，并在`stores`目录下新建`index.js`文件。



### State

state 是 store 的核心部分。

在 Pinia 中，状态被定义为返回初始状态的函数。

**定义Store**

```js
import { defineStore } from "pinia";

//使用选项API
export const useUserStore = defineStore("user", {
  //类似组件中的data
  state: () => {
    return { name: "小明", age: 30, address: "北京", arr: [1, 2, 3] };
  }
});

//使用setup
export const useCounterStore = defineStore("counter", () => {
  //相当于state
  const counter = ref(30);
  return { counter };
});
```

**使用State**

```vue
<script setup>
import { useUserStore, useCounterStore } from "./stores/index.js"
const userStore = useUserStore();
const counterStore = useCounterStore();
</script>

<template>
  <p>姓名：{{ userStore.name }} 年龄：{{ userStore.age }} 地址：{{ userStore.address }} 数组：{{ userStore.arr }}</p>
 
  <p>{{ counterStore.counter }}</p>
</template>
```



### Getters

Getter 完全等同于 Store 状态的 [计算值](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values)。

**定义Store**

```js
import { defineStore } from "pinia";
import { computed, ref } from "vue";

//使用选项API
export const useUserStore = defineStore("user", {
  state: () => {
    return { name: "小明", age: 30, address: "北京", arr: [1, 2, 3] };
  },
  getters: {
    gettersAge: (state) => {
      console.log("state", state);
      return state.age + 10;
    },
    gettersAge2() {
      //this指向store
      return this.age + 10;
    },
    gettersNameAge: (state) => {
      return state.name + "-" + state.age;
    },
    //调用其他state，但是getter不再缓存
    gettersOther() {      
      const counterStore = useCounterStore();
      return this.age + counterStore.counter;
    },
  }
});

//使用setup
export const useCounterStore = defineStore("counter", () => {
  const counter = ref(30);
  //相当于getters
  const gettersCounter = computed(() => {
    return counter.value + 5;
  });
  return { counter, gettersCounter };
});
```

**使用Getters**

```vue
<script setup>
import { useUserStore, useCounterStore } from "./stores/index.js"
import { storeToRefs } from "pinia"
const userStore = useUserStore();
const counterStore = useCounterStore();
</script>

<template>
  <p>{{ userStore.gettersAge }}</p>
  <p>{{ userStore.gettersAge2 }}</p>
  <p>{{ userStore.gettersNameAge }}</p>
  <p>{{ userStore.gettersOther }}</p>

  <p>{{ counterStore.gettersCounter }}</p>  
</template>
```



### Actions

Actions 相当于组件中的 [methods](https://v3.vuejs.org/guide/data-methods.html#methods)。

**定义Store**

```js
import { defineStore } from "pinia";
import { ref } from "vue";

//使用选项API
export const useUserStore = defineStore("user", {
  state: () => {
    return { name: "小明", age: 30, address: "北京", arr: [1, 2, 3] };
  },  
  //类似于methods
  actions: {
    //不能使用箭头函数
    addAge() {
      //this指向store
      this.age++;
    },
  },
});

//使用setup
export const useCounterStore = defineStore("counter", () => {
  //相当于state
  const counter = ref(30); 
  //相当于actions
  function addCounter() {
    counter.value++;
  }
  return { counter, addCounter };
});
```

**使用Actions**

```vue
<script setup>
import { useUserStore, useCounterStore } from "./stores/index.js"
const userStore = useUserStore();
const counterStore = useCounterStore();

//批量操作    
function change() {
  userStore.$patch({
    age: 100,
    name: "xiaoming"
  })
}
//批量操作
function change2() {
  userStore.$patch((state) => {
    state.age = 200
    state.name = "xiaoming2"
    state.arr.push("a")
  })
}
//重置
function reset() {
  userStore.$reset();
}
</script>

<template>
  <p>姓名：{{ userStore.name }} 年龄：{{ userStore.age }} 地址：{{ userStore.address }} 数组：{{ userStore.arr }}</p>
  <!-- 方式一：调用actions -->
  <button @click="userStore.addAge">修改age</button>
  <!-- 方式二：直接操作state -->
  <button @click="userStore.age++">修改age</button>

  <!-- 批量修改 -->
  <button @click="change">批量修改</button>
  <!-- 批量修改，方式二 -->
  <button @click="change2">批量修改</button>
  <!-- 重置 -->
  <button @click="reset">重置userStore</button>

  <p>{{ counterStore.counter }}</p>
  <button @click="counterStore.addCounter">修改counter</button>
</template>
```



### 解构

解构操作会丢失响应式，可以使用`storeToRefs()`函数保持响应式。

```vue
<script setup>
import { useUserStore, useCounterStore } from "./stores/index.js"
import { storeToRefs } from "pinia"
const userStore = useUserStore();
const counterStore = useCounterStore();

//使用解构并保持响应式`storeToRefs`
const { counter, gettersCounter } = storeToRefs(counterStore);
const { addCounter } = counterStore;
</script>

<template>  
  <p>{{ counter }}</p>
  <p>{{ gettersCounter }}</p>
  <button @click="addCounter">addCounter</button>
</template>
```

