[toc]

# Vue3 组合式API

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



## setup

- setup是组合式API的配置项，值是一个函数，组件中所用到的：数据、方法、计算属性、监视......等等，都配置在setup中。
- setup函数返回的对象中的内容，可以直接在模板中使用。
- setup中访问this是undefined，setup函数会在beforeCreate之前调用。
- setup函数的参数：
  - props：组件的属性，接收父组件传递来的数据。
  - context：组件的上下文。
    - attrs：包含所有未被props接收的数据。
    - slots：用于访问组件的插槽内容
    - emit：用于触发父组件的事件。
    - refs：包含组件内声明的所有ref对象的属性对象。
- setup函数的返回值：
  - 对象：对象中的属性、方法等，可以在模板中直接使用。
  - 函数：返回一个模板，可以自定义渲染内容。



## ref&reactive 响应式

- ref函数：
  - 当数据发生变化时，值也会自动更新。
  - 支持数据类型：
    - 基本数据类型：数字、字符串、布尔值。
    - 对象类型：对象、数组、函数。内部会自动通过reactive实现响应式。
    - null、undefined。
  - 在js中操作需要通过`.value`属性获取和修改值，在模板中可以直接读取。
  - 返回值是`Ref`类型。
- reactive函数：
  - 将普通对象或数组转换为响应式对象，主要用于复杂数据结构。
  - 支持数据类型：对象、数组。
  - 可以使用`toRefs()`函数和`toRef()`函数解构数据，解构出的值是`Ref`类型。
- 使用原则：
  - 若需要一个基本类型的响应式数据，必须使用`ref()`。
  - 若需要一个响应式对象，层级不深，那么使用`ref()`也可以。
  - 若需要一个响应式对象，且层级较深，要深度跟踪，那么使用`reactive()`。

```vue
<script >
import { ref, reactive, toRefs, toRef } from 'vue'
export default {
    setup() {
        //不是响应式
        let message1 = "hello";
        function changeMessage1() {
            message1 = "你好";
        }

        // ref
        //响应式：基本数据类型需要使用`ref`
        const count = ref(100);
        function changeCount() {
            count.value = 200;
        }

        // reactive & toRefs
        // 响应式：引用数据类型需要使用`reactive`
        const user = reactive({ name1: "小明", age1: 36 });
        // 解构后仍然具有响应式
        const { name1, age1 } = toRefs(user);
        function changeUser() {
            name1.value = "小白";
            age1.value = 18;
        }
        function changeUser2() {
            user.name1 = "小黑";
            user.age1 = "28;"
        }

        // reactive & toRef
        const student = reactive({ name2: "小明", age2: 36 });
        // 解构
        const age = toRef(student, "age2");
        function changeAge() {
            age.value = 666;
        }

        return { message1, changeMessage1, count, changeCount, name1, age1, changeUser, changeUser2, age, changeAge };
    }
}
</script>

<template>
    <div>
        <p>{{ message1 }}</p>
        <button @click="changeMessage1">修改message1</button>
    </div>
    <hr>
    <div>
        <p>{{ count }}</p>
        <button @click="changeCount">修改count</button>
    </div>
    <hr>
    <div>
        <p>{{ name1 }} - {{ age1 }}</p>
        <button @click="changeUser">修改user</button>
        <button @click="changeUser2">修改user2</button>
    </div>
    <hr>
    <div>
        <p>{{ age }}</p>
        <button @click="changeAge">修改age</button>
    </div>
</template>
```



## watch&watchEffect 侦听器

- watch：只会侦听所监听的数据源。
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



## computed 计算属性

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

        //计算属性
        const name = ref("小明");
        const age = ref(18);
        const userInfo = computed({
            get() {
                return name.value + "-" + age.value;
            },
            set(newValue) {
                [name.value, age.value] = newValue.split(",");
            }
        })
        function handleClick() {
            userInfo.value = "小红,38";
        }

        //计算属性
        const userObj = reactive({
            name: "小白",
            age: 10
        });
        const userComputed = computed({
            get() {
                return userObj.name + "-" + userObj.age;
            },
            set(newValue) {
                [userObj.name, userObj.age] = newValue.split(",");
            }
        })
        function handleClick2() {
            userComputed.value = "小黑,20";
        }

        return { msg, reverseMsg, userInfo, handleClick, userComputed, handleClick2 };
    }
}
</script>

<template>
    <p> {{ msg }}</p>
    <p> {{ reverseMsg }}</p>
    <div>
        <p> {{ userInfo }}</p>
        <button @click="handleClick">点击</button>
    </div>
    <div>
        <p>{{ userComputed }}</p>
        <button @click="handleClick2">点击2</button>
    </div>
</template>
```



## props 属性

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
        //接收参数
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

