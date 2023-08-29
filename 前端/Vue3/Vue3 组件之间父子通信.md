[toc]

# Vue3 组件之间父子通信

## 概述

所有的 props 都遵循着**单向绑定**原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。



## 选项式API

### 父传子

**父组件：Father.vue**

- 静态prop：在定义组件时确定值，如`abc="ABC"`。
- 动态prop：在组件被渲染时确定值，需要使用 `v-bind` 或缩写 `:` 来进行动态绑定的 props，如`:message="msg"`和`:list="list"`。
- 每次父组件更新后，所有的子组件中的 props 都会被更新到最新值。

```vue
<script>
import Child from "./Child.vue"

export default {
    data() {
        return {
            message: "hello",
            list: ["北京", "上海", "广州"]
        }
    },
    methods: {
        changeMessage() {
            this.message = "你好"
        }
    },
    components: {
        Child
    }
}
</script>

<template>
    <h2>父组件</h2>
	<button @click="changeMessage">修改message</button>
    <Child abc="ABC" :message="message" :list="list"></Child>
</template>
```

**子组件：Child.vue**

需要通过`props`属性接收来自父组件的数据，子组件不能直接修改接收到值——单项数据流。

**方式一：只接收**

```vue
<script>
export default {
    props: ["abc", "message", "list"]
}
</script>

<template>
    <h2>子组件</h2>
    <p>abc: {{ abc }}</p>
    <p>message: {{ message }}</p>
    <p>list: {{ list }}</p>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/569968e7e75f4d73894198b2a4751541.png)

**方式二：限制类型**

支持类型：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

```vue
<script>
export default {
    props: {
        abc: String,
        message: String,
        list: Array
    }
}
</script>

<template>
    <h2>子组件</h2>
    <p>abc: {{ abc }}</p>
    <p>message: {{ message }}</p>
    <p>list: {{ list }}</p>
</template>
```

**方式三：限制类型、限制必填、指定默认值**

- type
- required
- default

```vue
<script>
export default {
    props: {
        abc: {
            type: String,
            default: "66666"
        },
        message: {
            type: String, //数据类型
            default: "你好", //默认值
            required: true //是否必填
        },
        list: {
            type: Array,
            default() { //默认值，对象或数组需要调用default()方法
                return []
            }
        }
    }
}
</script>

<template>
    <h2>子组件</h2>
    <p>abc: {{ abc }}</p>
    <p>message: {{ message }}</p>
    <p>list: {{ list }}</p>
</template>
```



### 子传父

**子组件：Child.vue**

```vue
<script>
export default {
    data() {
        return {
            childMsg: "哈喽 来自子组件的消息"
        }
    },
    methods: {
        // 第二步：定义事件，传递数据
        sendFatherData() {
            this.$emit("onReceive", this.childMsg)
        }
    }
}
</script>

<template>
    <div>
        <!-- 第一步：发送消息 -->
        <button @click="sendFatherData">向父组件发送数据</button>
    </div>
</template>

<style scoped>
div {
    border: 1px dashed silver;
}
</style>
```

**父组件：Father.vue**

```vue
<script>
import Child from "./Child.vue"

export default {
    data() {
        return {
            childMsg: ""
        }
    },
    methods: {
        // 第四步：接收数据
        receiveChildMsg(value) {
            this.childMsg = value
        }
    },
    components: {
        Child
    }
}
</script>

<template>
    <h2>父组件</h2>
    <!-- 第三步：监听事件，回调receiveChildMsg方法 -->
    <Child abc="ABC" :message="message" :list="list" @onReceive="receiveChildMsg"></Child>
    <p>接收子组件数据：{{ childMsg }}</p>
</template>

```



## 组合式API

### 父传子

- 在父组件中给子组件绑定属性。
- 在子组件中通过props接收数据。

**父组件：Father2.vue**

```vue
<script setup>
import { ref } from "vue";
import Child2 from "./Child2.vue"

let message = ref("hello")
const list = ref(["北京", "上海", "广州"])
</script>

<template>
    <h2>父组件</h2>
    <Child2 abc="ABC" :message="message" :list="list"></Child2>
</template>
```

**子组件：Child2.vue**

```vue
<script setup>
// 方式一：只接收
// const props = defineProps(["abc", "message", "list"])

// 方式二：限制类型
const props = defineProps({
    abc: String,
    message: String,
    list: Array
})
</script>

<template>
    <div>
        <h2>子组件</h2>
        <p>abc: {{ abc }}</p>
        <p>message: {{ message }}</p>
        <p>list: {{ list }}</p>
    </div>
</template>
```

### 子传父

- 在父组件中给子组件通过`@`绑定事件。
- 在子组件中通过`emit`方法触发事件。

**子组件：Child2.vue**

```vue
<script setup>
// 第二步：通过defineEmits生成emit方法
// const emit = defineEmits("onReceive")
const emit = defineEmits(["onReceive"])

function sendFatherData() {
    // 第三步：触发事件，发送数据
    emit("onReceive", "哈喽 这一条来自子组件的消息")
}

</script>

<template>
    <div>
        <!-- 第一步：发送消息 -->
        <button @click="sendFatherData">向父组件发送数据</button>
    </div>
</template>
```

**父组件：Father2.vue**

```vue
<script setup>
import { ref } from "vue";
import Child2 from "./Child2.vue"
    
let childMsg = ref("")

// 接收数据
function receiveChildMsg(value) {
    childMsg.value = value
}
</script>

<template>
    <h2>父组件</h2>
    <!-- 第四步：监听事件，回调receiveChildMsg方法 -->
    <Child2 abc="ABC" :message="message" :list="list" @onReceive="receiveChildMsg"></Child2>
    <p>接收子组件数据：{{ childMsg }}</p>
</template>
```

