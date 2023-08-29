[toc]

# Vue3 模板语法

## 概述

Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法层面合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。



## 选项式API

### 使用

- data函数：
  - 用于定义数据。
  - 值可以为对象、函数。
  - 尽量不使用箭头函数。
- 模板语法：
  - 差值语法：可以直接在模板中输出变量，也可以写js表达式。
  - 指令语法：如v-model、v-bind、v-if等。
  - Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法层面合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。
  - 在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

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



## 组合式API

setup在beforeCreate钩子之前执行，因此this为undefined。

在setup函数中写的数据和方法需要在末尾以对象的方式return，才能给模版使用。

```vue
<script>
import { reactive } from 'vue';

export default {
    setup() {
        function addFirstUser() {
            this.userList.unshift({ name: "小白", age: "8", address: "成都" })
        }
        function addLastUser() {
            this.userList.push({ name: "小黑", age: "18", address: "重庆" })
        }
        return {
            name: "小明123",
            age: 68,
            num: 0,
            num100: function () {
                return this.num + 100;
            },
            rawHtml: "<h2 style='color:red;'>hello msg</h2>",
            userList: reactive([
                { name: "张三", age: 19, address: "北京" },
                { name: "李四", age: 29, address: "上海" },
                { name: "王五", age: 39, address: "广州" }
            ]),
            userInfo: {
                name: "小白",
                title: "顶级作者",
                bookName: "西游记"
            },
            addFirstUser,
            addLastUser,
        }
    }
}
</script>
```



## setup语法糖

`<script setup>`语法糖：在script标签添加`setup`标记，不需要再写导出语句，默认会添加导出语句。

```vue
<script setup>
import { reactive } from 'vue'

function addFirstUser() {
    // 这里的this是undefined
    userList.unshift({ name: "小白", age: "8", address: "成都" })
}
function addLastUser() {
    userList.push({ name: "小黑", age: "18", address: "重庆" })
}
function num100() {
    // 这里的this指向vue实例
    return this.num + 100
}
let name = "小明123"
let age = 68
let num = 0
let rawHtml = "<h2 style='color:red;'>hello msg</h2>"
let userList = reactive([
    { name: "张三", age: 19, address: "北京" },
    { name: "李四", age: 29, address: "上海" },
    { name: "王五", age: 39, address: "广州" }
])
let userInfo = {
    name: "小白",
    title: "顶级作者",
    bookName: "西游记"
}
</script>
```

