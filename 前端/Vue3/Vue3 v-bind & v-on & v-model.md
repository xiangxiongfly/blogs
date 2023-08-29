[TOC]

# Vue3 v-bind & v-on

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

