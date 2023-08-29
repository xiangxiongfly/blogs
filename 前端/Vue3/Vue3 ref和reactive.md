# Vue3 ref 和 reactive 

## 概述

- ref函数：
  - 接收简单类型或者对象类型的数据传入并返回一个响应式的对象。
  - 支持数据类型：
    - 基本数据类型：数字、字符串、布尔值。
    - 对象类型：对象、数组、函数。内部会自动通过reactive实现响应式。
    - null、undefined。
  - 在script标签中操作需要通过`.value`属性获取值和修改值，在模板中可以直接读取。
  - 返回值是`Ref`类型。
- reactive函数：
  - 接受对象类型数据的参数传入并返回一个响应式的对象。
  - 支持数据类型：对象、数组。
  - 可以使用`toRefs()`函数和`toRef()`函数解构数据，解构出的值是`Ref`类型。
- 使用原则：
  - 若需要一个基本类型的响应式数据，必须使用`ref()`。
  - 若需要一个响应式对象，层级不深，那么使用`ref()`也可以。
  - 若需要一个响应式对象，且层级较深，要深度跟踪，那么使用`reactive()`。



## 使用

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



## 对比

- 都是用于处理响应式数据。
- 不同点：
  - reactive不能处理简单类型的数据。
  - ref参数类型支持较好，但必须通过`.value`访问修改。
  - ref函数内部的实现依赖于reactive函数。

