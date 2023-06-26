[toc]

# Vue3 过渡动画效果

## 概述

Vue 提供了两个内置组件，可以帮助你制作基于状态变化的过渡和动画：

- `<Transition>` 会在一个元素或组件进入和离开 DOM 时应用动画。
- `<TransitionGroup>` 会在一个 `v-for` 列表中的元素或组件被插入，移动，或移除时应用动画。



## `<Transition>`组件

`<Transition>`是一个内置组件，它可以将进入和离开应用到通过默认插槽传递给它的元素或组件上。

进入或离开可以由以下的条件之一触发：

- 由 `v-if` 所触发的切换
- 由 `v-show` 所触发的切换

### 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/30bfbb3d26194ebfa3b9040b77d2cfa9.png)

- `v-enter-from`：进入动画的起始状态。
- `v-enter-active`：进入动画的生效状态。这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。
- `v-enter-to`：进入动画的结束状态。
- `v-leave-from`：离开动画的起始状态。
- `v-leave-active`：离开动画的生效状态。这个 class 可以被用来定义离开动画的持续时间、延迟与速度曲线类型。
- `v-leave-to`：离开动画的结束状态。

```vue
<script>
export default {
    data() {
        return {
            show: false,
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
    <div>
        <transition>
            <div v-if="show">hello world</div>
        </transition>
        <button @click="handleClick">切换</button>
    </div>
</template>
<style>
/* 入场效果 */
.v-enter-from {
    opacity: 0;
}

/* 定义过渡效果 */
.v-enter-active {
    transition: opacity 3s ease-out;
}

.v-enter-to {
    opacity: 1;
}

/* 出场效果 */
.v-leave-from {
    opacity: 1;
}

.v-leave-active {
    transition: opacity 3s ease-in;
}

.v-leave-to {
    opacity: 0;
}
</style>
```

### 为过渡效果命名

可以给 `<Transition>` 组件传一个 `name` prop 来声明一个过渡效果名：

```vue
<script>
export default {
    data() {
        return {
            show: false,
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
    <div>
        <transition name="abc">
            <div v-if="show">hello world222</div>
        </transition>
        <button @click="handleClick">切换</button>
    </div>
</template>
<style>
@keyframes my-anim {
    0% {
        transform: translateX(50px);
    }

    50% {
        transform: translateX(-50px);
    }

    100% {
        transform: translateX(50px);
    }
}

.abc-enter-active {
    animation: my-anim 3s;
}

.abc-leave-active {
    animation: my-anim 3s ease-out;
}
</style>
```

### 自定义过渡class

可以向 `<Transition>` 传递以下的 props 来指定自定义的过渡 class：

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

```vue
<script>
export default {
    data() {
        return {
            show: false,
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
    <div>
        <transition enter-active-class="myenter" leave-active-class="myleave">
            <div v-if="show">hello world333</div>
        </transition>
        <button @click="handleClick">切换</button>
    </div>
</template>
<style>
@keyframes my-anim {
    0% {
        transform: translateX(50px);
    }

    50% {
        transform: translateX(-50px);
    }

    100% {
        transform: translateX(50px);
    }
}

.myenter {
    animation: my-anim 3s;
}

.myleave {
    animation: my-anim 3s;
}
</style>
```

### JavaScript动画效果

可以通过监听 `<Transition>` 组件事件的方式在过渡过程中挂上钩子函数。

添加一个 `:css="false"` prop。这显式地向 Vue 表明可以跳过对 CSS 过渡的自动探测。

对于 `@enter` 和 `@leave` 钩子来说，回调函数 `done` 就是必须的。否则，钩子将被同步调用，过渡将立即完成。

```vue
<script>
export default {
    data() {
        return {
            show: false,
        }
    },
    methods: {
        handleClick() {
            this.show = !this.show;
        },
        handleBeforeEnter(el) {
            el.style.color = "red";
        },
        handleEnter(el, done) {
            let animation = setInterval(() => {
                let color = el.style.color;
                if (color === "red") {
                    el.style.color = "green";
                } else {
                    el.style.color = "red";
                }
            }, 1000)
            setTimeout(() => {
                clearInterval(animation);
                done(); //通知动画结束
            }, 3000)
        },
        handleAfterEnter(el) {
            alert("结束")
        },
    }
}
</script>
<template>
    <div>
        <transition :css="false" @before-enter="handleBeforeEnter" @enter="handleEnter" @after-enter="handleAfterEnter">
            <div v-if="show">hello world444</div>
        </transition>
        <button @click="handleClick">切换</button>
    </div>
</template>
```

### 元素间过渡

除了通过 `v-if` / `v-show` 切换一个元素，我们也可以通过 `v-if` / `v-else` / `v-else-if` 在几个组件间进行切换，只要确保任一时刻只会有一个元素被渲染即可。

如果你想在某个节点初次渲染时应用一个过渡效果，你可以添加 `appear` prop：

```vue
<script>
export default {
    data() {
        return {
            show: false,
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
    <div>
        <transition mode="out-in" appear>
            <div v-if="show">hello</div>
            <div v-else="show">world</div>
        </transition>
        <button @click="handleClick">切换</button>
    </div>
</template>
<style>
.v-enter-to,
.v-leave-from {
    opacity: 1;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 1s ease-in;
}
</style>
```



## `<transition-group>`组件

`<transition-group>`是一个内置组件，用于对 `v-for` 列表中的元素或组件的插入、移除和顺序改变添加动画效果。

### 列表动画

```vue
<script>
export default {
    data() {
        return {
            list: [1, 2, 3]
        }
    },
    methods: {
        handleClick() {
            this.list.unshift(this.list.length + 1);
        }
    }
}
</script>
<template>
    <div>
        <transition-group>
            <span class="list-item" v-for="item in list" :key="item">{{ item }}</span>
        </transition-group>
        <button @click="handleClick">添加</button>
    </div>
</template>
<style>
.list-item {
    display: inline-block;
    margin-right: 10px;
}

.v-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.v-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.v-enter-active {
    transition: all 0.5s ease-in;
}

.v-move {
    transition: all 0.5s ease-in;
}
</style>
```

### 状态动画

```vue
<script>
export default {
    data() {
        return {
            animNum: 1
        }
    },
    methods: {
        handleClick() {
            if (this.animNum < 10) {
                let interval = setInterval(() => {
                    this.animNum++;
                    if (this.animNum === 10) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        }
    }
}
</script>
<template>
    <div>
        <transition-group>
            <div>{{ animNum }}</div>
        </transition-group>
        <button @click="handleClick">添加</button>
    </div>
</template>
```

