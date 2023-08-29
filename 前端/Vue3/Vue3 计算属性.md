[toc]

# Vue3 计算属性

## 概述

模板中的表达式虽然方便，但也只能用来做简单的操作。如果在模板中写太多逻辑，会让模板变得臃肿，难以维护。

计算属性默认是只读的，可以通过 getter 和 setter 来创建可写计算属性。

特点：

- 惰性求值：只有对它访问时才会求值，不是立即执行。
- 自动缓存：会自动缓存计算属性的值。
- 声明式依赖追踪：计算属性只会在依赖值发生变化时才会重新计算。



## 选项式API

```vue
<script >
export default {
    data() {
        return {
            message: "hello world",
            name: "小明",
            age: 18
        }
    },
    //方法
    methods: {
        reverseMethod() {
            console.log("reverseMethod");
            return this.message.split("").reverse().join("");
        },
        changeUserInfo() {
            this.userInfo = "小花 28"
        }
    },
    //计算属性
    computed: {
        reverseComputed() {
            console.log("reverseComputed");
            return this.message.split("").reverse().join("");
        },
        // 可写计算属性
        userInfo: {
            // getter
            get() {
                return this.name + "-" + this.age;
            },
            // setter
            set(newValue) {
                [this.name, this.age] = newValue.split(" ");
            }
        }
    }
}
</script>

<template>
    <h1>计算属性(Options)</h1>
    <p>原始值：{{ message }}</p>
    <p>第一次调用方法：{{ reverseMethod() }}</p>
    <p>第二次调用方法：{{ reverseMethod() }}</p>
    <p>第一次调用计算属性：{{ reverseComputed }}</p>
    <p>第二次调用计算属性：{{ reverseComputed }}</p>
    <button @click="message = '你好'">修改message</button>
    <p>{{ userInfo }}</p>
    <button @click="changeUserInfo">修改userInfo</button>
</template>
```

说明：

 进入页面后，会打印了2次“reverseMethod”，说明每次调用方法都会执行一次；打印了1次“reverseComputed”，说明计算属性会缓存。

当点击按钮修改了message属性，会重复上面操作，说明计算属性只有依赖值发生变化时才会重新计算。



## 组合式API

计算属性返回值类型为一个Ref类型。因此在script标签中使用需要加`.value`。

```vue
<script setup>
import { ref, reactive, computed } from 'vue'

let message = ref("hello world")
let name = ref("小明")
let age = ref(18)

function reverseMethod() {
    console.log("reverseMethod")
    return message.value.split("").reverse().join("")
}

function changeUserInfo() {
    userInfo.value = "小花 28"
}

// 计算属性
const reverseComputed = computed(() => {
    console.log("reverseComputed")
    return message.value.split("").reverse().join("")

})

// 可写计算属性
let userInfo = computed({
    // getter
    get() {
        return name.value + "-" + age.value
    },
    // setter
    set(newValue) {
        [name.value, age.value] = newValue.split(" ")
    }
})
</script>

<template>
    <h1>计算属性(Options)</h1>
    <p>原始值：{{ message }}</p>
    <p>第一次调用方法：{{ reverseMethod() }}</p>
    <p>第二次调用方法：{{ reverseMethod() }}</p>
    <p>第一次调用计算属性：{{ reverseComputed }}</p>
    <p>第二次调用计算属性：{{ reverseComputed }}</p>
    <button @click="message = '你好'">修改message</button>
    <p>{{ userInfo }}</p>
    <button @click="changeUserInfo">修改userInfo</button>
</template>
```

