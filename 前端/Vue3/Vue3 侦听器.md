[toc]

# Vue3 侦听器

## 概述

侦听器（Watchers）是一种用于监听和响应数据变化的功能。



## 选项式API

```vue
<script >
export default {
    data() {
        return {
            msg: "hello",
            message: "hello world",
            isHidden: true,
            user: {
                name: "小明",
                age: 18,
                sex: true
            }
        }
    },
    // 侦听器
    watch: {
        // 方式一：msg变化时调用
        msg(newValue, oldValue) {
            console.log("新值：" + newValue, "旧值：" + oldValue);
        },
        // 方式二：立即调用
        message: {
            handler(newValue, oldValue) {
                if (newValue.length < 5 || newValue.length > 10) {
                    this.isHidden = false;
                } else {
                    this.isHidden = true;
                }
            },
            immediate: true // 是否立即调用
        },
        // 方式三：深度监听，监听对象的每个属性
        user: {
            handler(newValue) {
                console.log(newValue);
            },
            deep: true // 是否深度监听
        },
        // 方式四：监听指定属性
        "user.name": {
            handler(newValue) {
                console.log("user.name的新值：", newValue);
            }
        }
    }
}
</script>

<template>
    <h1>侦听器(Options)</h1>
    <p>{{ msg }}</p>
    <button @click="msg = '你好'">修改msg</button>
    <p>{{ message }}</p>
    <input type="text" v-model="message"><br>
    <p :hidden="isHidden">输入框中的内容不能小于5或大于10</p>
    <p>{{ user }}</p>
    <button @click="user.name = '小白'">修改user.name</button>
    <button @click="user.age = 28">修改user.age</button>
</template>
```



## 组合式API

- watch：只会侦听所监听的数据源。
- watchEffect：会自动侦听所有响应式属性。组件初始化时会自动执行一次。

```vue
<script setup>
import { reactive, ref, watch, watchEffect } from 'vue';

let msg = ref("hello")
let msg1 = ref("hello1")
let msg2 = ref("hello2")
let message = ref("hello world")
let isHidden = ref(true)
let user = reactive({
    name: "小明",
    age: 18,
    sex: true
})

const changeMsg1 = () => {
    msg1.value = "你好1"
}
const changeMsg2 = () => {
    msg2.value = "你好2"
}

// 方式一：msg变化时调用
watch(msg, (newValue, oldValue) => {
    console.log("新值：" + newValue, "旧值：" + oldValue)
})

// 侦听多个数据
watch([msg1, msg2], ([newMsg1, newMsg2], [oldMsg1, oldMsg2]) => {
    console.log("msg1或msg2发生变化：", `新值：${[newMsg1, newMsg2]}`, `旧值：${[oldMsg1, oldMsg2]}`);
})

// 方式二：立即调用
watch(message,
    (newValue, oldValue) => {
        console.log("立即调用");
        if (newValue.length < 5 || newValue.length > 10) {
            isHidden.value = false
        } else {
            isHidden.value = true
        }
    },
    { immediate: true }
)

// 方式三：深度监听，监听对象的每个属性
// 直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发
watch(user,
    (newValue) => {
        console.log("深度监听：", newValue)
    },
    { deep: true }
)

// 方式四：监听指定属性
// 这里需要用一个返回该属性的 getter 函数：
watch(
    () => user.name,
    (newName) => {
        console.log("user.name的新值：", newName)
    }
)

// watchEffect，类似于深度监听
watchEffect(() => {
    console.log("watchEffect:", user.age);
})

</script>

<template>
    <h1>侦听器(Composition)</h1>
    <p>{{ msg }}</p>
    <button @click="msg = '你好'">修改msg</button>
    <p>{{ msg1 }}-{{ msg2 }}</p>
    <button @click="changeMsg1">修改msg1</button>
    <button @click="changeMsg2">修改msg2</button>
    <p>{{ message }}</p>
    <input type="text" v-model="message"><br>
    <p :hidden="isHidden">输入框中的内容不能小于5或大于10</p>
    <p>{{ user }}</p>
    <button @click="user.name = '小白'">修改user.name</button>
    <button @click="user.age = 28">修改user.age</button>
</template>
```

