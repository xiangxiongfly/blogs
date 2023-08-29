[toc]

# Vue3 组件之间跨级通信

## 概述

通常情况下，当我们需要从父组件向子组件传递数据时，会使用`props`。

但是一些多层级嵌套的组件，形成了一颗巨大的组件树，仅使用 props 则必须将其沿着组件链逐级传递下去，这会非常麻烦。

![在这里插入图片描述](https://img-blog.csdnimg.cn/baa19c4e1b8d473ba04e5bd5f9a9e720.png)

可以使用`provide` 和 `inject` 解决这一问题。一个父组件相对于其所有的后代组件，会作为**依赖提供者**。任何后代的组件树，无论层级有多深，都可以**注入**由父组件提供给整条链路的依赖。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc2bde7a657c436686399d5a4aba751b.png)



## 选项式API

### 简单使用

- 顶层组件通过`provide`提供数据。
- 底层组件通过`inject`接收数据。

**定义父组件：Father.vue**

```vue
<script>
import Child from "./Child.vue"
export default {
    // 方式一：
    provide: {
        message: "hello world"
    }
    components: {
        Child,
    }
}
</script>
```

**定义孙子组件：GrandChild.vue**

```vue
<script>
export default {
    inject: ["message"]
}
</script>

<template>
    <h2>孙子组件</h2>
    <p>message:{{ MessageChannel }}</p>
</template>
```

### 支持响应式

provide函数：可以访问当前组件实例的数据，同时可以支持响应式数据。

**父组件：Father.vue**

```vue
<script>
import { computed } from "vue"
import Child from "./Child.vue"
export default {
    data() {
        return {
            name: "小白",
            age: 18,
            address: "北京市",
            userInfo: {
                name: "小红",
                age: 1
            },
            message: "hello",
        }
    },
    methods: {
        changeData: function () {
            this.name = "小黑"
            this.age = 28
            this.address = "上海市"
            this.userInfo.name = "小红2222"
            this.userInfo.age = "2"
            this.message = "哈喽！"
        }
    },
    provide() {
        return {
            name: this.name, //不支持响应式
            age: this.age, //不支持响应式
            address: this.address,//不支持响应式
            userInfo: this.userInfo, //支持响应式，浅拷贝
            message: computed(() => this.message), //支持响应式，使用计算属性
        }
    },
    components: {
        Child,
    }
}
</script>

<template>
    <h2>父组件</h2>
    <p>{{ name }}-{{ age }}-{{ address }}</p>
    <p>{{ userInfo }}</p>
    <p>{{ message }}</p>
    <button @click="changeData">修改数据</button>
    <Child></Child>
</template>
```

**孙子组件：GrandChild.vue**

```vue
<script>
export default {
    inject: ["name", "age", "address", "userInfo", "message"]
}
</script>

<template>
    <h2>孙子组件</h2>
    <p>{{ name }}-{{ age }}-{{ address }}</p>
    <p>{{ userInfo }}</p>
    <p>{{ message }}</p>
</template>
```

### 调用顶层方法

**父组件：Father.vue**

```vue
<script>
import { computed } from "vue"
import Child from "./Child.vue"
export default {
    data() {
        return {
            name: "小白",
        }
    },
    methods: {
        changeFatherMethod: function () {
            this.name = "小绿"
        }
    },
    provide() {
        return {
            changeFatherMethod: this.changeFatherMethod
        }
    },
    components: {
        Child,
    }
}
</script>

<template>
    <h2>父组件</h2>
    <Child></Child>
</template>
```

**孙子组件：GrandChild.vue**

```vue
<script>
export default {
    inject: ["changeFatherMethod"]
}
</script>

<template>
    <h2>孙子组件</h2>
    <button @click="changeFatherMethod">调用顶层方法</button>
</template>
```



## 组合式API

### 简单使用

**父组件：Father.vue**

```vue
<script setup>
import { provide } from "vue";
import Child2 from "./Child2.vue"
    
provide("message", "hello world")
</script>

<template>
    <h2>父组件</h2>
    <Child2></Child2>
</template>
```

**孙子组件：GrandChild.vue**

```vue
<script setup>
import { inject } from 'vue';

const message = inject("message")
</script>

<template>
    <h2>孙子组件</h2>
    <p>{{ message }}</p>
</template>
```

### 支持响应式

**父组件：Father.vue**

```vue
<script setup>
import { provide, ref, reactive } from "vue";
import Child2 from "./Child2.vue"

const name = ref("小白")
const age = ref(18)
const address = ref("北京市")
const userInfo = reactive({
    name: "小红",
    age: 1
})
const message = ref("hello")


function changeData() {
    name.value = "小黑"
    age.value = 28
    address.value = "上海市"
    userInfo.name = "小红2222"
    userInfo.age = "2"
    message.value = "哈喽！"
}

provide("name", name)
provide("age", age)
provide("address", address)
provide("userInfo", userInfo)
provide("message", message)
</script>

<template>
    <h2>父组件</h2>
    <p>{{ name }}-{{ age }}-{{ address }}</p>
    <p>{{ userInfo }}</p>
    <p>{{ message }}</p>
    <button @click="changeData">修改数据</button>
    <Child2></Child2>
</template>
```

**孙子组件：GrandChild.vue**

```vue
<script setup>
import { inject } from 'vue';

const name = inject("name")
const age = inject("age")
const address = inject("address")
const userInfo = inject("userInfo")
const message = inject("message")
</script>

<template>
    <h2>孙子组件</h2>
    <p>{{ name }}-{{ age }}-{{ address }}</p>
    <p>{{ userInfo }}</p>
    <p>{{ message }}</p>
</template>
```

### 底层调顶层方法

**父组件：Father.vue**

```vue
<script setup>
import { provide, ref, reactive } from "vue";
import Child2 from "./Child2.vue"

const name = ref("小白")

function changeFatherMethod() {
    name.value = "小红"
}
provide("changeFatherMethod", changeFatherMethod)
</script>

<template>
    <h2>父组件</h2>
    <Child2></Child2>
</template>
```

**孙子组件：GrandChild.vue**

```vue
<script setup>
import { inject } from 'vue';
    
const changeFatherMethod = inject("changeFatherMethod")
</script>

<template>
    <h2>孙子组件</h2>
    <button @click="changeFatherMethod">调用顶层方法</button>
</template>
```



