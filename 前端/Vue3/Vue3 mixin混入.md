[toc]

# Vue3 mixin & 自定义指令 & teleport

## mixin 混入

`mixins` 选项接受一个 mixin 对象数组。这些 mixin 对象可以像普通的实例对象一样包含实例选项，它们将使用一定的选项合并逻辑与最终的选项进行合并。

- 自定义的属性：组件中的属性优先级高于 mixin 属性的优先级。
-  data, methods：组件中的data、methods优先级高于 mixin data, methods 优先级。
- 生命周期函数：先执行 mixin 里面的，再执行组件里面的。

### 简单使用

```vue
<script>
const myMixin = {
    number: 222,
    data() {
        return { num: 456 }
    },
    methods: {
        handleClick() {
            console.log("myMixin handleClick");
        }
    },
    created() {
        console.log("myMixin created");
    }
}
export default {
    mixins: [myMixin],
    number: 111,
    data() {
        return {
            num: 123,
        }
    },
    methods: {
        handleClick() {
            console.log("handleClick");
        }
    },
    created() {
        console.log("created");
    }
}
</script>

<template>
    <div>
        <div>{{ num }}</div>
        <div>{{ this.$options.number }}</div>
        <button @click="handleClick">点击</button>
    </div>
</template>
```



## 自定义指令

除了 Vue 内置的一系列指令 (比如 `v-model` 或 `v-show`) 之外，Vue 还允许你注册自定义的指令 (Custom Directives)。

### 简单使用

```vue
<script>
const focus = {
    mounted: (el) => el.focus()
}
export default {
    directives: {
        focus
    }
}
</script>

<template>
    <div>
        <input v-focus />
    </div>
</template>
```

### 全局注册

```vue
const app = createApp(App);
app.directive("focus", (el) => el.focus());
app.mount("#app");
```

```vue
<template>
    <div>
        <input v-focus />
    </div>
</template>
```

### 参数

```vue
const app = createApp(App);
app.directive("pos", (el, binding) => {
  el.style[binding.arg] = binding.value + "px";
});
app.mount("#app");
```

```vue
<template>
    <div>
        <div class="header" v-pos:left="100">
            <input />
        </div>
    </div>
</template>

<style>
.header {
    position: absolute;
}
</style>
```



## teleport 传送门

`<teleport>` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

### 简单使用

`<Teleport>` 挂载时，传送的 `to` 目标必须已经存在于 DOM 中。理想情况下，这应该是整个 Vue 应用 DOM 树外部的一个元素。如果目标元素也是由 Vue 渲染的，你需要确保在挂载 `<Teleport>` 之前先挂载该元素。

```vue
<script>
export default {
    data() {
        return {
            show: false,
            message: "hello world"
        }
    },
    methods: {
        handleClick() {
            this.show = !this.show;
        }
    }
}
</script>

<template>
    <div id="box2">
    </div>
    <div id="box1">
        <button @click="handleClick">点击</button>
        <Teleport to="#box2">
            <div class="mask" v-show="show">{{ message }}</div>
        </Teleport>
    </div>
</template>

<style>
.mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: 0.5;
    color: white;
    font-size: 50px;
    text-align: center;
}
</style>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/19394d03ebbf47eb9f028ee57b021722.png)

