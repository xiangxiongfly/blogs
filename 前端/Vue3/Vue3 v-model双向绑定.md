[toc]

# Vue3 v-model 双向绑定

## 概述

- v-model指令可以在表单 input、textarea以及select元素上创建双向数据绑定。
- 它会根据控件类型自动选取正确的方法来更新元素。

- **仅限：**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components
- **修饰符：**
  - [`.lazy`](https://cn.vuejs.org/guide/essentials/forms.html#lazy) - 监听 `change` 事件而不是 `input`
  - [`.number`](https://cn.vuejs.org/guide/essentials/forms.html#number) - 将输入的合法字符串转为数字
  - [`.trim`](https://cn.vuejs.org/guide/essentials/forms.html#trim) - 移除输入内容两端空格

- v-model的原理主要是两个操作：

   v-bind绑定value属性的值。

   v-on绑定input事件监听到函数中，函数会获取最新的值赋值到绑定的属性中。



## 使用

### 输入框

```vue
<script setup>
import { ref } from 'vue'
let msg = ref("hello world")
</script>

<template>
    <h1>v-model</h1>
    <input type="text" v-model="msg">
    {{ msg }}
</template>
```

**原理等同下面代码：**

```vue
<script setup>
import { ref } from 'vue'
let searchText = ref("hello world")
function inputChange(event) {
    searchText.value = event.target.value
}
</script>

<template>
    <h1>v-model</h1>
	<input type="text" :value="searchText" @input="inputChange">
	{{ searchText }}
</template>
```

### textarea

```vue
<script setup>
import { ref } from 'vue'
let content = ref("")
</script>

<template>
    <textarea cols="30" rows="10" v-model="content"></textarea>
    输入内容：{{ content }}
</template>
```

### checkbox

```vue
<script setup>
import { ref } from 'vue'
let isAgree = ref(false)
let fruits = ref([])
</script>

<template>
    <div>
        <label for="agree">
            <input id="agree" type="checkbox" v-model="isAgree"> 是否同意 <br>
            {{ isAgree }}
        </label>
    </div>
    <div>
        <label for="apple">
            <input id="apple" type="checkbox" value="apple" v-model="fruits">苹果
        </label>
        <label for="banana">
            <input id="banana" type="checkbox" value="banana" v-model="fruits">香蕉
        </label>
        <label for="orange">
            <input id="orange" type="checkbox" value="orange" v-model="fruits">橘子
        </label>
        <p>选中：{{ fruits }}</p>
    </div>
</template>
```

### radio

```vue
<script setup>
import { ref } from 'vue'
let gender = ref("unknown")
</script>

<template>
    <div>
        <label for="unknown">
            <input id="unknown" type="radio" value="unknown" v-model="gender"> 保密
        </label>
        <label for="boy">
            <input id="boy" type="radio" value="boy" v-model="gender"> 男
        </label>
        <label for="girl">
            <input id="girl" type="radio" value="girl" v-model="gender"> 女
        </label>
        <p>性别：{{ gender }}</p>
    </div>
</template>
```

### select

```vue
<script setup>
import { ref } from 'vue'
let hobby = ref("football")
let hobbies = ref([])
</script>

<template>
    <select v-model="hobby">
        <option value="basketball">篮球</option>
        <option value="football">足球</option>
        <option value="tennis">网球</option>
    </select>
    <p>单选：{{ hobby }}</p>

    <select v-model="hobbies" multiple>
        <option value="basketball">篮球</option>
        <option value="football">足球</option>
        <option value="tennis">网球</option>
    </select>
    <p>多选：{{ hobbies }}</p>
</template>
```

### .lazy

在v-model后跟上lazy修饰符，那么会将绑定的事件切换为 change 事件，只有在提交时（比如回车、失去焦点）才会触发。

```vue
<script setup>
import { ref } from 'vue'
let text = ref("")
</script>

<template>
    <input type="text" v-model.lazy="text">
    <p>{{ text }}</p>
</template>
```



### .number

input的数据总是string类型，即使在我们设置type为number也是string类型。

可以使用 `.number` 修饰符转换为数字类型。

如果是一个string类型，在可以转化的情况下会进行隐式转换的。

```vue
<script setup>
import { ref } from 'vue'
let num = ref("")
</script>

<template>
    <input type="text" v-model.number="num">
    <p>{{ num }} 类型：{{ typeof num }}</p>
</template>
```



### .trim

给v-model添加 `.trim` 修饰符，可以自动过滤用户输入的前后空白字符。

```vue
<script setup>
import { ref } from 'vue'
let message = ref("")
</script>

<template>
    <input type="text" v-model.trim="message">
    {{ message }}
</template>
```

