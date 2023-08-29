[toc]

# Vue3 生命周期

## 概述

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。



## 生命周期图

![在这里插入图片描述](https://img-blog.csdnimg.cn/1128e58d12c6414bba19448d9f5e8ad0.png)



## 生命周期说明

1. beforeCreate：在实例创建之前被调用，此时组件的data和methods等属性都还未初始化。
2. created：在实例创建之后被调用，此时组件的data和methods等属性已经被初始化。
3. beforeMount：在组件挂载到页面前被调用。
4. mounted：在组件挂载到页面后被调用，此时组件的DOM节点已经生成。
5. beforeUpdate：在组件更新之前被调用，此时data中的数据已经发生了改变但页面还没有重新渲染。
6. updated：在组件更新之后被调用，此时data中的数据已经发生了改变，并且页面已经重新渲染。
7. beforeUnmount：在组件卸载之前被调用。
8. unmounted：在组件卸载之后被调用，此时组件的DOM节点已经从页面中删除。

此外，Vue3还引入了两个新的生命周期函数：beforeRender和renderTracked。

1. beforeRender：在组件渲染之前被调用，它需要返回一个vnode或false。如果返回false，则该组件不会被渲染。
2. renderTracked：在组件渲染时被调用，每个组件均会调用该函数，它用于跟踪组件中的哪些响应式数据被使用了。



## 选项式对比组合式

| 选项式API            | 组合式API       |
| -------------------- | --------------- |
| beforeCreate/created | setup           |
| beforeMount          | onBeforeMount   |
| mounted              | onMounted       |
| beforeUpdate         | onBeforeUpdate  |
| updated              | onUpdated       |
| beforeUnmount        | onBeforeUnmount |
| unmounted            | onUnmounted     |

- setup在beforeCreate钩子之前自动执行，因此setup中的this是undefined。

```js
<script>
export default {
    beforeCreate() {
        console.log("生命周期选项", "beforeCreate");
    },
    created() {
        console.log("生命周期选项", "created");
    },
    beforeMount() {
        console.log("生命周期选项", "beforeMount");
    },
    mounted() {
        console.log("生命周期选项", "mounted");
    },
    updated() {
        console.log("生命周期选项", "updated");
    },
    beforeUnmount() {
        console.log("生命周期选项", "beforeUnmount");
    },
    unmounted() {
        console.log("生命周期选项", "unmounted");
    }
}
</script> 
```

```js

<script setup>
import { onBeforeMount, onBeforeUpdate, onMounted, onUpdated, onBeforeUnmount, onUnmounted } from "vue";

console.log("生命周期钩子", "setup");

onBeforeMount(() => {
    console.log("生命周期钩子", "onBeforeMount");
})

onMounted(() => {
    console.log("生命周期钩子", "onMounted");
})

onMounted(() => {
    console.log("生命周期钩子", "onMounted执行多次");
})

onBeforeUpdate(() => {
    console.log("生命周期钩子", "onBeforeUpdate");
})

onUpdated(() => {
    console.log("生命周期钩子", "onUpdated");
})

onBeforeUnmount(() => {
    console.log("生命周期钩子", "onBeforeUnmount");
})

onUnmounted(() => {
    console.log("生命周期钩子", "onUnmounted");
})
</script>
```

