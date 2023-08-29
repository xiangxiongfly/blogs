[toc]

# Vue3 组件和插槽

## 组件基础

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。在实际应用中，组件常常被组织成层层嵌套的树状结构：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ac220ff8cb446739066713e0e4b6d91.png)

## 根组件

我们传入 `createApp` 的对象实际上是一个组件，每个应用都需要一个“根组件”，其他组件将作为其子组件。

如果你使用的是单文件组件，我们可以直接从另一个文件中导入根组件。

```vue
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)
```



## 简单使用

### 定义组件

在`src/components`目录下，定义 `Content.vue`、`Hello.vue` 2个组件：

**Hello.vue组件**

```vue
<template>
    <h3>我是Hello.vue</h3>
</template>
```

**Content.vue组件**

父组件可以嵌套子组件。

```vue
<script>
import Hello from "./Hello.vue"
export default {
    components: {
        Hello
    }
}
</script>

<template>
    <Hello></Hello>
    <h2>我是Content.vue</h2>
    <Hello></Hello>
</template>
```

### 使用组件

```vue
<script>
import Content from "../components/Content.vue"
export default { 
    components: {
        Content
    }
}
</script>

<template>
    <Content></Content>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a74c6a6a267a4cae8e2c1a8ae4fbec05.png)



## 父子访问

### 父组件访问子组件

```vue
<script>
import Child3 from "./Child3.vue"
export default {
    //挂载
    mounted() {
        // 第二步：通过`$refs`获取子组件数据
        console.log(this.$refs);
        // 获取子组件的name/age/sex数据：
        console.log(this.$refs.child3.name);
        console.log(this.$refs.child3.age);
        console.log(this.$refs.child3.sex);
    },
    //组件
    components: {
        Child3
    }
}
</script>

<template>
    <h2>父组件</h2>
    <!-- 第一步：通过`ref`注册引用信息 -->
    <Child3 ref="child3"></Child3>
    <p ref="p"></p>
</template>
```



### 子组件访问父组件

在开发中尽量少用`$parent`。

```vue
<script>
export default {
    data() {
        return {
            name: "小明",
            age: 18,
            sex: true
        }
    },
    mounted() {
        // 通过`$parent`获取父组件
        console.log("父组件：", this.$parent);
        // 获取父组件数据
        console.log("父组件list：", this.$parent.list);
    }
}
</script>

<template>
    <h3>子组件3</h3>
</template>
```



### 访问根组件

```vue
<script>
export default {
    mounted() {
        // 通过`$root`获取根组件
        console.log("根组件：", this.$root);
        // 访问根组件数据
        console.log("根组件rootName：", this.$root.rootName);
    }
}
</script>

<template>
    <h3>子组件3</h3>
</template>
```



## 插槽

### 使用插槽

只能使用单个插槽。

- `<slot>`元素是一个插槽出口。表示父元素的插槽内容在哪里渲染。

**定义插槽组件：MySlot.vue**

```vue
<template>
  <h2>使用插槽</h2>
  <div>
    <!-- slot占位 -->
    <slot></slot>
  </div>
</template>
```

**使用插槽**

```vue
<script>
import MySlot from "../components/MySlot.vue"
export default {
    //组件
    components: {
        MySlot
    }
}
</script>

<template>
    <MySlot>
        <!-- 使用插槽 -->
        <button>按钮</button>
    </MySlot>
    <MySlot>
        <input type="text" placeholder="请输入123">
        <input type="text" placeholder="请输入abc">
    </MySlot>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b49ab0285a5f45dd8e0f3d1fb6c173c3.png)



### 具名插槽

可以定义和使用多个插槽。

- 在`<slot>`元素中定义name属性，用于给插槽分配唯一的id。

**定义具名插槽组件：MyMultiSlot.vue**

```vue
<template>
  <h2>使用具名插槽</h2>
  <div>
    <slot name="a"></slot>
    <slot name="b"></slot>
    <slot name="c"></slot>
  </div>
</template>
```

**使用具名插槽**

```vue
<script>
import MyMultiSlot from "../components/MyMultiSlot.vue"
export default {
    //组件
    components: {
        MyMultiSlot
    }
}
</script>

<template>
    <MyMultiSlot>
        <template v-slot:a>
            <button>按钮一</button>
        </template>
        <template v-slot:b>
            <button>按钮二</button>
        </template>
        <template v-slot:c>
            <button>按钮三</button>
        </template>
    </MyMultiSlot>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7bff92ff2924b61b44afdba853df750.png)



### 默认值插槽

在外部没有提供任何内容情况下，可以指定默认内容。

- 在`<slot>`元素内提供默认内容。

**定义默认值插槽组件**

```vue
<template>
  <h2>使用具名插槽</h2>
  <div>
    <slot name="a"><button>默认按钮</button></slot>
    <slot name="b"></slot>
    <slot name="c"></slot>
  </div>
</template>
```

**使用默认值插槽**


```vue
<MyMultiSlot>
    <template v-slot:a>

    </template>
    <template v-slot:b>
		<button>按钮二</button>
    </template>
    <template v-slot:c>
		<button>按钮三</button>
    </template>
</MyMultiSlot>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3c9fd36649e94cd6b1800816d29ddc83.png)

### 作用域插槽

在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

- 插槽提供数据。
- 父组件接收数据。

**定义作用域插槽组件：MyListSlot.vue**

```vue
<script>
export default {
    data() {
        return {
            list: [1, 2, 3],
            message: "你好"
        }
    }
}
</script>
<template>
    <h2>作用域插槽</h2>
    <div>
        <slot :list="list" :message="message"></slot>
    </div>
</template>
```

**使用作用域插槽**

需要使用`v-slot`指令接收props对象。

```vue
<script>
import MyListSlot from "../components/MyListSlot.vue"
export default {
    //组件
    components: {
        MyListSlot
    }
}
</script>

<template>
    <!-- 作用域插槽，父组件替换插槽标签，但是数据由子组件提供 -->
    <!-- 无序列表 -->
    <MyListSlot>
        <template v-slot:default="slotProps">
            <p>{{ slotProps.message }}</p>
            <ul>
                <li v-for="item in slotProps.list" :key="item">{{ item }}</li>
            </ul>
        </template>
    </MyListSlot>
    <!-- 有序列表 -->
    <MyListSlot>
        <template v-slot:default="slotProps">
            <ol>
                <li v-for="item in slotProps.list" :key="item">{{ item }}</li>
            </ol>
        </template>
    </MyListSlot>
</template>
```


