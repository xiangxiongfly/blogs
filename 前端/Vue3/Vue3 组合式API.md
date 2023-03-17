[toc]

# Vue3 组合式API

## 选项式API和组合式API

使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。

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

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 [``](https://cn.vuejs.org/api/sfc-script-setup.html) 搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

下面是使用了组合式 API 与 `<script setup>` 改造后和上面的模板完全一样的组件：

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



## 响应式

- 基本数据类型使用`ref()`函数。需要通过`value`属性获取其值。
- 引用数据类型使用`reactive()`函数。
- 在`setup()`函数中return暴露数据。

```vue
<script>
import { ref, reactive } from 'vue'
export default {
    // 组合式API，将同一逻辑关联在一起
    setup() {
        // 在组件创建前调用
        console.log("setup");
        console.log(this); //undefined，this不会指向应用实例

        let msg = "hello"; //不是响应式
        function changeMsg() {
            msg = "你好";
        }

        let message = ref("hello2"); //响应式，基本数据类型需要使用`ref`
        function changeMessage() {
            message.value = "你好2";
        }

        const obj = reactive({ //响应式，引用数据类型需要使用`reactive`
            name: "小明",
            name: "小明",
            age: 18
        });
        function changeObjName() {
            obj.name = "xiaoming";
        }

        return { msg, changeMsg, message, changeMessage, obj, changeObjName };
    }
}
</script>

<template>
    <p> {{ msg }}</p>
    <button @click="changeMsg()">改变msg</button>
    <p> {{ message }}</p>
    <button @click="changeMessage()">改变message</button>
    <p>{{ obj.name }}</p>
    <button @click="changeObjName()">改变obj.name</button>
</template>
```



## 侦听器

- watch: 只会侦听所监听的数据源。
- watchEffect：会自动侦听所有响应式属性。组件初始化时会自动执行一次。


```vue
<script >
import { ref, reactive, watch, watchEffect } from 'vue'
export default {
    setup() {
        const count = ref(0);
        function changeCount() {
            count.value++;
        }
        const user = reactive({
            name: "Tom",
            age: 18
        });
        function changeUserName() {
            user.name = "Jake";
        }

        //侦听器，基本数据类型
        watch(count, (newValue, oldValue) => {
            console.log("count", "新值：" + newValue + "  旧值：" + oldValue);
        });
        //侦听器，对象的属性
        watchEffect(() => {
            console.log(user.name);
        });
        return { count, user, changeCount, changeUserName };
    }
}
</script>

<template>
    <p>{{ count }}</p>
    <button @click="changeCount">改变count</button>
    <p>{{ user.name }}</p>
    <button @click="changeUserName">改变user.name</button>
</template>
```



## 计算属性

```vue
<script >
import { ref, reactive, computed } from 'vue'
export default {
    setup() {
        const msg = ref("hello");
        //计算属性
        const reverseMsg = computed(() => {
            return msg.value.split("").reverse().join("");
        });
        return { msg, reverseMsg };
    }
}
</script>

<template>
    <p> {{ msg }}</p>
    <p> {{ reverseMsg }}</p>
</template>
```



## props

**定义组件：Content.vue**

```vue
<script>
export default {
    props: {
        message: {
            type: String,
            default: "你好"
        }
    },
    setup(props) {
        //可以在这里获取message属性值
        console.log(props.message);
    }
}
</script>

<template>
    <h2>组合式API-我是Content.vue</h2>
    <p>{{ message }}</p>
</template>
```

**使用组件**

```vue
<script >
import Content from "../components/Content2.vue"
export default {
    components: {
        Content
    }
}
</script>

<template>
    <Content message="abc"></Content>
</template>
```



## provide/inject

- provide()：父组件提供数据。
- inject()：子组件接收数据。

**父组件：Father**

```vue
<script>
import Child from "./Child.vue"
import { ref, provide } from "vue"
export default {
    setup() {
        provide("name", "小花");
        const userName = ref("张三"); //响应式
        function changeUserName() {
            userName.value = "李四";
        }
        provide("userName", userName);
        return { changeUserName };
    },
    components: {
        Child
    }
}
</script>
<template>
    <h2>组合式API-父组件</h2>
    <Child></Child>
    <button @click="changeUserName">修改userName</button>
</template>
```

**子组件：Child.vue**

```vue
<script>
import { inject } from "vue"
export default {
    setup() {
        const name = inject("name");
        const userName = inject("userName");
        return { name, userName };
    }
}
</script>
<template>
    <h3>组合式API-子组件</h3>
    <p>{{ name }}</p>
    <p>{{ userName }}</p>
</template>
```



## SFC

在 `setup()` 函数中手动暴露大量的状态和方法非常繁琐。

当使用单文件组件（SFC）时，我们可以使用 `<script setup>` 来大幅度地简化代码。

```vue
<script setup>
import { ref } from "vue"
//引入组件，不需要注册
import Content from "../components/Content.vue"
//定义变量，不需要导出暴露
const name = "张三";
const age = 18;
const count = ref(10);
function add() {
    count.value++;
}
</script>

<template>
    <Content></Content>
    <p>姓名：{{ name }} 年龄：{{ age }}</p>
    <p>{{ count }}</p>
    <button @click="add">count++</button>
</template>

<style></style>
```



