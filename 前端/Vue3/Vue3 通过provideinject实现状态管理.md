# Vue 通过provide/inject实现状态管理

### 定义状态管理对象

```js
//状态管理
import { reactive } from "vue";

const store = {
  //支持响应式
  state: reactive({
    msg: "hello world",
  }),
  updateMsg() {
    this.state.msg = "你好";
  },
};

export default store;
```

### 定义父组件App.vue

```vue
<script >
import store from "./store/store"
import Home from "./views/Home.vue"

export default {
    data() {
        return {
            count: 0
        }
    },
    provide: {
        store
    },
    components: {
        Home
    }
}
</script>

<template>   
    <p>
        <Home></Home>
    </p>
</template>

<style></style>
```



### 定义子组件Home.vue

```vue
<script>
export default {
    inject: ["store"],
    methods: {
        updateMsg() {
            this.store.updateMsg();
        }
    }
}
</script>
<template>
    {{ store.state.msg }}
    <button @click="updateMsg">修改msg</button>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/57deac7cb79a48759789596c57b11898.png)

点击button后变为：

![在这里插入图片描述](https://img-blog.csdnimg.cn/642d60056111404293741c12b4e414c1.png)