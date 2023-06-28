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



## 父子组件传递数据

### 父组件 -> 子组件

**父组件：Father.vue**

- 静态prop：在定义组件时确定值，如`abc="ABC"`。
- 动态prop：在组件被渲染时确定值，需要使用 `v-bind` 或缩写 `:` 来进行动态绑定的 props，如`:message="msg"`和`:list="list"`。

```vue
<script>
import Child from "./Child.vue"
export default {
    data() {
        return {
            msg: "hello world",
            list: ["北京", "上海", "广州"]
        }
    }
    components: {
        Child
    }
}
</script>

<template>
    <h2>父组件</h2>
    <Child :message="msg" abc="ABC" :list="list"></Child>
</template>
```

**子组件：Child.vue**

需要通过`props`属性接收来自父组件的数据，子组件不能直接修改接收到值——单项数据流。

**方式一：只接收**

```vue
<script>
export default {
    props: ["message", "abc", "list"]
}
</script>

<template>
    <h3>子组件</h3>
    <p>message: {{ message }}</p>
    <p>abc: {{ abc }}</p>
    <p v-for="item in list">{{ item }}</p>
</template>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3503f6e07c0e4774a8f1eb070aedda88.png)

**方式二：限制类型**

支持的类型：

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
        message: "String",
        abc: "String",
        list: "Array"
    }
}
</script>

<template>
    <h3>子组件</h3>
    <p>message: {{ message }}</p>
    <p>abc: {{ abc }}</p>
    <p v-for="item in list">{{ item }}</p>
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
        message: {
            type: String, //数据类型
            default: "你好", //默认值
            required: true //是否必填
        },
        abc: {
            type: String,
            default: "abc"
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
    <h3>子组件</h3>
    <p>message: {{ message }}</p>
    <p>abc: {{ abc }}</p>
    <p v-for="item in list">{{ item }}</p>
</template>
```



### 子组件 -> 父组件

**子组件：Child.vue**

```vue
<script>
export default {
    data() {
        return {
            eventMsg: "哈喽 来自子组件的消息"
        }
    },
    // 方法
    methods: {
        //第二步：在子组件中，通过`$emit`触发`onReceiveEvent`事件，并将数据传递过去
        sendParent() {
            this.$emit("onReceiveEvent", this.eventMsg);
        }
    }
}
</script>

<template>
	<h3>子组件</h3>
    <!-- 第一步：发送消息 -->
    <button @click="sendParent">向父组件发送数据</button>
</template>
```

**父组件：Father.vue**

```vue
<script>
import Child from "./Child.vue"
export default {
    data() {
        return {
            eventMsg: ""
        }
    },
    methods: {
        // 第四步：接收数据
        getChildMsg(value) {
            this.eventMsg = value;
        }
    },
    components: {
        Child
    }
}
</script>

<template>
    <h2>父组件</h2>
	<!-- 第三步：通过v-on监听子组件的`onReceiveEvent`事件，并回调getChildMsg()方法 -->
    <Child @onReceiveEvent="getChildMsg"></Child>
    <p>{{ eventMsg }}</p>
</template>
```



## 组件访问

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



## Provide/Inject 组件之间跨级通信

通常情况下，当我们需要从父组件向子组件传递数据时，会使用 [props](https://cn.vuejs.org/guide/components/props.html)。想象一下这样的结构：有一些多层级嵌套的组件，形成了一颗巨大的组件树，而某个深层的子组件需要一个较远的祖先组件中的部分数据。在这种情况下，如果仅使用 props 则必须将其沿着组件链逐级传递下去，这会非常麻烦。

`provide` 和 `inject` 可以帮助我们解决这一问题。一个父组件相对于其所有的后代组件，会作为**依赖提供者**。任何后代的组件树，无论层级有多深，都可以**注入**由父组件提供给整条链路的依赖。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc2bde7a657c436686399d5a4aba751b.png)

### provide和inject

- 在父组件中使用`provide`属性，提供数据，不支持响应式。
- 在子组件中使用`inject`属性，接收属性。

**定义父组件：Father.vue**

```vue
<script>
import Child from "./Child.vue"
export default {
    provide: {
        message: "hello world"
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

**定义孙子组件：Grandson.vue**

```vue
<script>
export default {
    inject: ["message"]
}
</script>

<template>
    <h2>孙子组件</h2>
    <p>孙子组件message：{{ message }}</p>
</template>
```



### provide()函数和inject

`provide`选项缺点：

- 不支持响应式。
- 不能调用`data()`函数里的数据。

因此推荐使用`provide()`函数形式。

**父组件：Father.vue**

```vue
<script>
import Child from "./Child.vue"
export default {
    data() {
        return {
            a: "hello world", 
            b: {
                message: "hello world2" 
            },
            c: "hello world3"
        }
    },
    provide() {
        return {
            a: this.a, //不支持响应式
            b: this.b, //支持响应式，本质是对象的浅拷贝
            c: () => this.c ////支持响应式，本质函数引用
        }
    },
    components: {
        Child,
    }
}
</script>

<template>
    <h2>父组件</h2>
    <p>父组件a：{{ a }}</p>
    <p>父组件b.message：{{ b.message }}</p>
    <p>父组件c：{{ c }}</p>
    <Child></Child>
    <button @click="a = '你好1'; b.message = '你好2'; c = '你好3'">改变message</button>
</template>
```

**孙子组件：Grandson.vue**

```vue
<script>
export default {
    inject: ["a", "b", "c"]
}
</script>

<template>
    <h2>孙子组件</h2>
    <p>孙子组件a：{{ a }}</p>
    <p>孙子组件b.message：{{ b.message }}</p>
    <p>孙子组件c：{{ c() }}</p>
</template>
```



