[TOC]

# Vue3 基础

## 概述

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。

Vue 的两个核心功能：

*   **声明式渲染**：Vue 基于标准 HTML 拓展了一套模板语法，使得我们可以声明式地描述最终输出的 HTML 和 JavaScript 状态之间的关系。
*   **响应性**：Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM。

[Vue3官方文档](https://cn.vuejs.org/)

[Vite官方文档](https://cn.vitejs.dev/)

## 安装Vue

方式一：使用CDN

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

方式二：npm安装

    npm init vue@latest

方式三：使用JS的方式引入Vue

```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>vue3简单使用</title>
        <script src="./vue3.js"></script>
    </head>

    <body>
        <div id="counter">
            <p>{{uname}}</p>
            <p>{{age}}</p>
        </div>

        <script>
            // 配置对象
            const counter = {
                data: function () {
                    return {
                        uname: "小明",
                        age: 0
                    }
                }
            };

            // 使用createApp函数创建一个应用实例
            // 传入配置对象
            let app = Vue.createApp(counter)
                // 应用实例必须调用mount函数，挂载后才会渲染出来
                .mount("#counter");

            //数据双向绑定
            app.age = 18;
        </script>
    </body>

</html>
```

## 使用Vite构建项目

Vite是要给web开发构建工具，由于其原生ES模块导入方式，可以实现闪电般的冷服务器启动。

    npm create vite@latest

或者：

    npm create vite@latest my-vue-app -- --template vue

接着依次执行命令启动vue项目：

    cd my-vue-app
    npm install
    npm run dev

## data & 模板语法

- data 定义数据：
  - 值可以为对象、函数。
  - 尽量不使用箭头函数。
- 模板语法：
  - 差值语法：可以直接在模板中输出变量，也可以写js表达式。
  - 指令语法：如v-model、v-bind、v-if等。
  - Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法层面合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。
  - 在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

### 基本使用

```html
<script>
export default {
    data() {
        return {
            name: "小明123",
            age: 18,
            num: 0,
            num100: function () {
                return this.num + 100;
            },
            rawHtml: "<h2 style='color:red;'>hello msg</h2>"            
        }
    }
}
</script>

<template>
    <!-- 文本插值 -->
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>数量：{{ num }}</p>
    <p>num100：{{ num100() }}</p>

    <!-- 使用html -->
    <p v-html="rawHtml"></p>
    
    <!-- 使用JavaScript表达式 -->
    <p>{{ num + 1 }}</p>
    <p>{{ name.split("").reverse().join("") }}</p>
</template>
```

### 条件渲染

```vue
<script>
    export default {
        data() {
            return {
                age: 68,
                isShow: true
            }
        }
    }
</script>

<template>
<!-- v-if条件渲染 -->
<p v-if="age < 18">未成年人</p>
<p v-if="age >= 18 && age < 60">年轻人</p>
<p v-else>老人</p>

<!-- v-show，本质是display:none; -->
<p v-show="isShow">
    hello template
</p>
</template>
```

*   `v-if`：会根据条件进行渲染，切换时元素会被销毁或重建，因此切换开销大。
*   `v-for`：本质是通过`display`进行显示和隐藏。
*   `<template>` 标签可以作为占位符使用。

### 列表渲染

- 遍历数组：`<li v-for="item in userList">` `<li v-for="(item, index) in userList">` `<li v-for="({ name, age, address }, index) in userList">`
- 遍历对象：`<li v-for="(value, key) in userInfo">` `<li v-for="(value, key, index) in userInfo">`
- 遍历字符串：`<li v-for="(char, index) in name">`
- 指定遍历次数：`<li v-for="(number, index) in 10">`

```vue
<script>
    export default {
        data() {
            return {
                userList: [
                    { name: "张三", age: 19, address: "北京" },
                    { name: "李四", age: 29, address: "上海" },
                    { name: "王五", age: 39, address: "广州" }
                ],
                userInfo: {
                    name: "小白",
                    title: "顶级作者",
                    bookName: "西游记"
                }
            }
        }
    }
</script>

<template>   
    <!-- v-for遍历数组 -->
	<ul>
        <li v-for="item in userList">
            姓名：{{ item.name }} 年龄：{{ item.age }} 地址：{{ item.address }}
        </li>
    </ul>
    <ul>
        <li v-for="(item, index) in userList">
            编号：{{ index }} 姓名：{{ item.name }} 年龄：{{ item.age }} 地址：{{ item.address }}
        </li>
    </ul>
    <ul>
        <li v-for="({ name, age, address }, index) in userList">
            编号：{{ index }} 姓名：{{ name }} 年龄：{{ age }} 地址：{{ address }}
        </li>
    </ul>

    <!-- v-for遍历对象 -->
    <ul>
        <li v-for="(value, key) in userInfo">
            {{ key }} : {{ value }}
        </li>
    </ul>
	 <ul>
        <li v-for="(value, key, index) in userInfo">
            {{ index }} - {{ key }} : {{ value }}
        </li>
    </ul>

	<!-- v-for遍历字符串 -->
    <ul>
        <li v-for="(char, index) in name">
            {{ char }} {{ index }}
        </li>
    </ul>

	<!-- 指定遍历次数 -->
    <ul>
        <li v-for="(number, index) in 10">
            {{ number }} {{ index }}
        </li>
    </ul>

</template>
```

### 通过key管理状态

- key属性帮助Vue跟踪每个节点的身份，当数据发生变化时，Vue可以更准确地确定哪些节点是新创建的、被修改的或被删除的。Vue通过比较新旧节点的key来最小化DOM操作，提高性能。
- key具有唯一性，最好使用唯一的标识符，若后续有破坏顺序的操作，一定要避免使用随机数或索引值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b417f1833b164716bc0e53cc99a7ea3b.png)

```vue
<script>
    export default {
        data() {
            return {
                userList: [
                    { name: "张三", age: 19, address: "北京" },
                    { name: "李四", age: 29, address: "上海" },
                    { name: "王五", age: 39, address: "广州" }
                ]
            }
        },
        methods: {
            addUser() {
                this.userList.unshift({ name: "小白", age: "8", address: "成都" })
            }
        }
    }
</script>

<template>
    <!-- :key的使用 -->
    <ul>
        <li v-for="item in userList" :key="item">
            <input type="checkbox">{{ item.name }}
        </li>
    </ul>
    <button @click="addUser">添加user</button>
</template>
```

### 数组变化检测

Vue 能够侦听响应式数组的变更方法，并在它们被调用时触发相关的更新。这些变更方法包括：

*   `push()`
*   `pop()`
*   `shift()`
*   `unshift()`
*   `splice()`
*   `sort()`
*   `reverse()`

## computed 计算属性

计算属性只会在依赖值发生变化时才会重新计算。

```vue
<script >
export default {
    data() {
        return {
            message: "hello world",
            firstMsg: "abc",
            lastMsg: "efg"
        }
    },
    //方法
    methods: {
        reverseMsg2() {
            console.log("reverseMsg2");
            return this.message.split("").reverse().join("");
        }
    },
    //计算属性
    computed: {
        reverseMsg() {
            console.log("reverseMsg");
            return this.message.split("").reverse().join("");
        },
        // 可写计算属性
        fullName: {
            // getter
            get() {
                return this.firstMsg + "-" + this.lastMsg;
            },
            // setter
            set(newValue) {
                [this.firstMsg, this.lastMsg] = newValue.split(" ");
            }
        }
    }
}
</script>

<template>
    <p>{{ message }}</p>
    <p>{{ reverseMsg2() }}</p>
    <p>{{ reverseMsg2() }}</p>
    <p>{{ reverseMsg }}</p>
    <p>{{ reverseMsg }}</p>
    <button @click="message = '你好'">修改message</button>
    <p>{{ fullName }}</p>
    <p>{{ fullName="ABC EFG" }}</p>
</template>
```

说明：

打印了2次“reverseMsg2”，说明每次调用方法都会执行一次；打印了1次“reverseMsg”，说明计算属性会缓存。

点击按钮修改了message属性，会重复上面操作，说明计算属性只有依赖值发生变化时才会重新计算。

## watch 侦听器

监听状态变化。

```vue
<script >
export default {
    data() {
        return {
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
        // 侦听器，方式一，message发生变化时调用
        // message(newValue, oldValue) {
        //     console.log("新值：" + newValue, "旧值：" + oldValue);
        //     if (newValue.length < 5 || newValue.length > 10) {
        //         this.isHidden = false;
        //     } else {
        //         this.isHidden = true;
        //     }
        // }
        // 侦听器，方式二，初始化时触发
        message: {
            immediate: true, // 是否初始化时调用
            handler(newValue, oldValue) {
                if (newValue.length < 5 || newValue.length > 10) {
                    this.isHidden = false;
                } else {
                    this.isHidden = true;
                }
            }
        },
        // 深度监听，方式一，监听对象的每个属性
        // user: {
        //     handler(newValue) {
        //         console.log(newValue);
        //         console.log(newValue.name);
        //     },
        //     deep: true // 是否深度监听，给对象的每个属性都加上侦听器
        // },
        // 深度监听，方式二，监听对象的单个属性
        "user.name": {
            handler(newValue) {
                console.log(newValue);
            },
            deep: true // 是否深度监听
        }
    }
}
</script>

<template>
    <p>{{ message }}</p>
    <button @click="message = '你好'">修改message</button><br>
    <input type="text" v-model="message"><br>
    <p :hidden="isHidden">输入框中的内容不能小于5或大于10</p>
    <button @click="user.name = '小白'">修改user.name</button>
</template>
```

## v-bind 属性绑定

*   动态的绑定一个或多个 attribute，也可以是组件的 prop。
*   `v-bind:`可简写为`:`，如`v-bind:class`简写为`:class`。
*   class样式绑定:
    *   方式一：`:class="xxx"` 用于类名不确定。
    *   方式二：`:class="{active:xxx}"`  用于个数确定，类名确定，但不确定是否可用。
    *   方式三：`:class=[xxx,yyy,zzz]` 用于个数、类名不确定。
*   style样式绑定：
    *   方式一：`:style="xxx"` 字符串写法。
    *   方式二：`:style="color:xxx"` 用于属性名确定，但属性值不确定。
    *   方式三：`:style=[xxx,yyy,zzz]` 用于

```vue
<script >
export default {
    data() {
        return {
            message: "hello wold",
            //class
            isActive: true,
            isBgColor: true,
            classObj: {
                active: true,
                bgColor: true
            },
            error: null,
            activeClass: "active",
            bgColorClass: "bgColor",
            //style
            activeColor: "red",
            bgColor: "grey",
            fontSize: "30px",
            styleObj: {
                color: "red",
                'background-color': "grey",
                fontSize: "30px"
            },
            styleObj2: {
                border: "2px dashed black"
            }
        }
    },
    // 计算属性
    computed: {
        classObject() {
            return {
                active: this.isActive && !this.error,
                bgColor: this.isBgColor && !this.error
            }
        }
    }
}
</script>

<template>
    <!-- 使用class -->
    <p class="active">hello world1</p>
	<!-- class样式绑定： -->
    <!-- 绑定对象 -->
    <p :class="{ active: isActive }">hello world2</p>
    <p :class="{ active: isActive, bgColor: isBgColor }">hello world3</p>
    <!-- 绑定对象简写 -->
    <p :class="classObj">hello world4</p>
    <!-- 计算属性 -->
    <p :class="classObject">hello world5</p>
    <!-- 绑定数组 -->
    <p :class="[activeClass, bgColorClass]">hello world6</p>

    <button @click="isActive = !isActive">修改active</button>
    <button @click="isBgColor = !isBgColor">修改bgColor</button>

    <!-- 使用内联样式 -->
    <p style="color:red;">hello1</p>
	<!-- style样式绑定： -->
    <!-- 绑定对象 -->
    <p :style="{ color: activeColor, 'background-color': bgColor, fontSize: fontSize }">hello2</p>
    <!-- 绑定对象简写 -->
    <p :style="styleObj">hello3</p>
    <!-- 绑定数组 -->
    <p :style="[styleObj, styleObj2]">hello4</p>
</template>

<style>
.active {
    color: red;
}

.bgColor {
    background-color: grey;
}
</style>
```

## v-on 事件绑定

*   给元素绑定事件监听器。
*   `v-on`可简写为`@`，如`v-on:click`简写为`@click`。
*   事件对象，vue在触发事件回调时，会主动传入event对象。
*   事件传参：
    *   无参：` @click="add"`，add方法会有一个默认的event对象。
    *   一个参数：`@click="add2(5)"`，add2方法有一个参数。
    *   多个参数：`@click="add2(6,7,8)"`，add2方法有多个参数。
    *   参数+事件对象：` @click="add3($event, 5)"`，add3方法有event和5参数。
*   事件修饰符：
    - `.stop` - 调用 `event.stopPropagation()`，阻止事件冒泡。
    - `.prevent` - 调用 `event.preventDefault()`，阻止默认事件。
    - `.once` - 只触发一次事件处理函数。
    - `.capture` - 在捕获模式添加事件监听器。
    - `.self` - 只有事件从元素本身发出才触发处理函数。
    - `.{keyAlias}` - 只在某些按键下触发处理函数。
    - `.left` - 只在鼠标左键事件触发处理函数。
    - `.right` - 只在鼠标右键事件触发处理函数。
    - `.middle` - 只在鼠标中键事件触发处理函数。
    - `.passive` - 通过 `{ passive: true }` 附加一个 DOM 事件。
*   键盘事件别名：
    - enter：回车。
    - delete：删除。
    - space：空格。
    - tab：换行。
    - up：上，
    - down，下。
    - left：左。
    - right：右。

```vue
<script >
export default {
    data() {
        return {
            num: 0,
            score: 0
        }
    },
    methods: {
        add(event) {
            this.num++;
        },
        add2(n) {
            this.num += n;
        },
        add3(event, n) {
            this.num += n;
            console.log(event);
        },
        addScore() {
            this.score++;
        },
        fatherClick() {
            console.log("父元素点击");
        },
        childClick() {
            console.log("子元素点击");
        },
        mclick() {
            console.log("提交成功");
        },
        onceClick() {
            console.log("aaa");
        },
        keyupFn(e) {
            console.log("按键修饰符：", e.key);
        },
        keyupEnterFn(e) {
            console.log("enter");
        },
        keyupDirectionFn(e) {
            console.log("监听方向键：", e.key);
        },
        rightClickFn() {
            console.log("鼠标左键");
        },
        ctrlFn() {
            console.log("ctrlFn");
        }
    }
}
</script>

<template>
    <!-- 点击事件： -->
    <!-- 绑定事件，直接通过js代码处理 -->
    <button @click="num++">{{ num }}</button><br>

    <!-- 绑定事件，没有传参 -->
    <button @click="add">{{ num }}</button><br>

    <!-- 绑定事件，传递参数 -->
    <button @click="add2(5)">{{ num }}</button><br>

    <!-- 绑定事件，获取传参和事件对象 -->
    <button @click="add3($event, 5)">{{ num }}</button><br>

    <!-- 绑定多个处理函数 -->
    <button @click="add(), addScore()">{{ num }} --- {{ score }}</button>

    <!-- 事件修饰符： -->
    <!-- 阻止事件冒泡 -->
    <div @click="fatherClick">
        <button @click.stop="childClick">阻止事件冒泡</button>
    </div>
 	<!-- 只触发自身事件 -->
    <div @click.self="fatherClick">
        父元素点击
        <button @click="childClick">子元素点击</button>
    </div>
    <!-- 阻止默认行为 -->
    <form action="">
        <input type="submit" value="阻止默认提交" @click.prevent="mclick">
    </form>
    <!-- 只会触发一次 -->
    <button @click.once="onceClick">只触发一次</button><br>
    <!-- 按键修饰符： -->
    <input type="text" placeholder="按键修饰符" @keyup="keyupFn"><br>

    <!-- 按键别名 -->
    <!-- 监听按键输入 -->
    <input type="text" placeholder="enter别名" @keyup.enter="keyupEnterFn"><br>
    <!-- 监听方向键 -->
    <input type="text" placeholder="监听方向键" @keyup.left.right.down.up="keyupDirectionFn"><br>
    <!-- 系统按键， -->
    <input placeholder="ctrl" @keyup.ctrl="ctrlFn" /><br>

    <!-- 鼠标按键：该按键必须在事件发出时处于按下状态。 -->
    <button @click.right="rightClickFn">鼠标按键</button>
</template>
```

## v-model 双向绑定

`v-model` 可以在表单输入元素或组件上创建双向绑定。

- **仅限：**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components
- **修饰符：**
  - [`.lazy`](https://cn.vuejs.org/guide/essentials/forms.html#lazy) - 监听 `change` 事件而不是 `input`
  - [`.number`](https://cn.vuejs.org/guide/essentials/forms.html#number) - 将输入的合法字符串转为数字
  - [`.trim`](https://cn.vuejs.org/guide/essentials/forms.html#trim) - 移除输入内容两端空格

```vue
<script >
export default {
    data() {
        return {
            msg: "hello world",
            checked: true,
            fruits: [],
            sex: "男",
            city: "上海",
            citys: [],
            desc: "abc",
            num: 0,
            inputMsg: ""
        }
    },
    methods: {
        changeMsg(e) {
            this.msg = e.target.value;
        },
        changeInput(e) {
            console.log(this.inputMsg);
        }
    }
}
</script>

<template>
    <!-- v-model双向绑定 -->
    <input type="text" v-model="msg">
    <h3>{{ msg }}</h3>

    <!-- v-model原理： -->
    <input type="text" :value="msg" @input="changeMsg"><br>

    <!-- 单个多选框 -->
    <input type="checkbox" v-model="checked">
    <p>{{ checked }}</p>

    <!-- 多选框 -->
    <label><input type="checkbox" v-model="fruits" value="苹果">苹果</label>
    <label><input type="checkbox" v-model="fruits" value="梨子">梨子</label>
    <label><input type="checkbox" v-model="fruits" value="香蕉">香蕉</label>
    <label><input type="checkbox" v-model="fruits" value="西瓜">西瓜</label>
    <p>你喜欢的水果：{{ fruits }}</p>

    <!-- 单选框 -->
    <input type="radio" v-model="sex" value="男">男
    <input type="radio" v-model="sex" value="女">女
    <p>你的性别：{{ sex }}</p>

    <!-- 单选选项框 -->
    <select v-model="city">
        <option value="北京">北京</option>
        <option value="上海">上海</option>
        <option value="广州">广州</option>
    </select>
    <p>你选的城市：{{ city }}</p>

    <!-- 多选框 -->
    <select v-model="citys" multiple>
        <option value="北京">北京</option>
        <option value="上海">上海</option>
        <option value="广州">广州</option>
    </select>
    <p>你喜欢城市：{{ citys }}</p>

    <!-- v-model修饰符： -->
    <!-- .lazy 当输入框失去焦点时执行 -->
    <input type="text" v-model.lazy="desc">
    <p>{{ desc }}</p>
    <!-- .number 将输入框的内容转为number类型 -->
    <input type="text" v-model.number="num" type="number">
    <p>{{ num }} 类型：{{ typeof num }}</p>
    <!-- .trim 清楚前后空格 -->
    <input type="text" v-model.trim="inputMsg" @input="changeInput">
</template>
```

