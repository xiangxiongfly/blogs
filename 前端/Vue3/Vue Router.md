[toc]

# Vue Router

## 概述

Vue Router 是 Vue.js 官方提供的路由管理插件，它可以让 Vue.js 应用程序实现客户端路由功能。

客户端路由是指在 Web 应用程序中，通过 JavaScript 代码来控制页面的跳转和切换，而不是通过后端服务器来控制。Vue Router 允许您将应用程序分解为多个视图，并通过 URL 来管理和导航这些视图。

Vue Router 的主要特点包括：

- 嵌套路由：Vue Router 支持嵌套路由，可以将应用程序分解为多个嵌套的视图层次结构。
- 命名路由：Vue Router 支持命名路由，可以为路由指定名称，并使用名称来进行路由导航。
- 动态路由：Vue Router 支持动态路由，可以通过参数化的 URL 来动态生成路由。
- 导航守卫：Vue Router 提供了导航守卫功能，可以在路由导航过程中拦截并进行相应的操作。
- 路由懒加载：Vue Router 支持路由懒加载，可以在需要时才动态加载路由组件，以提高应用程序的性能。

通过使用 Vue Router，可以为 Vue.js 应用程序添加客户端路由功能，使其更具交互性和可扩展性。Vue Router 是 Vue.js 生态系统中的重要组成部分，为 Vue.js 应用程序开发提供了很多便利。

[Vue Router官方文档](https://router.vuejs.org/zh/)



## 安装

```
npm install vue-router@4
```



## 简单使用

### 定义2个组件

**Home.vue组件**

```vue
<template>
    <h2>Home页面</h2>
</template>
```

**About.vue组件**

```vue
<template>
    <h2>About页面</h2>
</template>
```

### 定义路由信息

在src目录下新建router文件夹，然后在router目录中新建index.js文件，写入：

```js
import { createRouter, createWebHashHistory } from "vue-router";

//引入组件
import Home from "../views/Home.vue";
import About from "../views/About.vue";

//定义路由表
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

//创建Router实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

### 支持路由

在main.js中配置：

```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
//引入
import router from "./router";

const app = createApp(App);
//支持路由
app.use(router);
//挂载
app.mount("#app");
```

### 使用路由

- `<router-link`：负责导航，类似于a链接。
- `<router-view>`：负责渲染。

在App.vue组件中使用：

```vue
<template>
  <h1>Hello Router!</h1>
  <p>
    <!-- 导航 -->
    <router-link to="/">跳转Home页面</router-link>
  </p>
  <p>
    <router-link to="/about">跳转About页面</router-link>
  </p>
  <!-- 占位符 -->
  <router-view></router-view>
</template>
```



## 动态路由

### 配置动态路由

- 路径参数用冒号`:`表示。
- 用`this.$route.params`获取路径参数。

在router/index.js文件中配置动态路由：

```js
//定义路由表
const routes = [
  { path: "/", component: Home },
  // 动态路由：
  { path: "/about/name/:name/age/:age", component: About },
];
```

在About.vue组件中使用：

```vue
<script>
export default {
    data() {
        return {
            name: "",
            age: 0
        }
    },
    mounted() {
        //接收数据
        const params = this.$route.params;
        console.log(params); //{name: '小明', age: '18'}
        this.name = params.name;
        this.age = params.age;
    }
}

</script>
<template>
    <h2>About页面</h2>
    <p>name:{{ name }} age:{{ age }}</p>
</template>
```



### 配置404

新建NotFound.vue组件，表示404页面；

```vue
<template>
    <h2>找不到页面</h2>
</template>
```

在router/index.js中配置NotFound：

```js
import { createRouter, createWebHashHistory } from "vue-router";

//引入组件
import NotFound from "../views/NotFound.vue";

//定义路由表
const routes = [
  //配置404
  { path: "/:path(.*)", component: NotFound },
];
```



### 限制动态参数

没有找到合适的路由时会显示NotFound。

**限制动态参数age为数字**

```vue
//定义路由表
const routes = [
  //动态路由：限制age为数字
  { path: "/about/name/:name/age/:age(\\d+)", component: About },
  //配置404
  { path: "/:path(.*)", component: NotFound },
];
```

**限制动态参数age为多个数字**

```
//动态路由：限制age可传多个参数
{ path: "/about/name/:name/age/:age+", component: About },
```

**限制动态参数age可有可无**

```
//动态路由：限制age可有可无
{ path: "/about/name/:name/age/:age*", component: About },
```



## 嵌套路由

一些应用程序的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构，如：

```
/parent/one                				/parent/two
+------------------+                  +-----------------+
| Parent           |                  | Parent          |
| +--------------+ |                  | +-------------+ |
| | One      	 | |  +------------>  | | Two         | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

在router/index.js文件中配置：

```js
import Parent from "../views/Parent.vue";
import One from "../views/One.vue";
import Two from "../views/Two.vue";

const routes = [
  //嵌套路由
  {
    path: "/parent",
    component: Parent,
    children: [
      { path: "one", component: One },
      { path: "two", component: Two },
    ],
  }
];
```

创建Parent.vue/One.vue/Two.vue组件：

**One.vue组件：**

```vue
<template>
    <p>样式一</p>
    <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JS</li>
        <li>Vue</li>
    </ul>
</template>
```

**Two.vue组件：**

```vue
<template>
    <p>样式二</p>
    <ol>
        <li>Java</li>
        <li>Kotlin</li>
        <li>Android</li>
        <li>JetPack</li>
    </ol>
</template>
```

**Parent.vue组件：**

```vue
<template>
    <h2>Parent页面</h2>
    <router-link to="/parent/one">样式一</router-link>
    <router-link to="/parent/two">样式二</router-link>
    <router-view></router-view>
</template>
```



## 命名路由

**命名路由优点：**

- 没有硬编码的URL。
- params自动编码解码。
- 防止在url拼写错误。
- 绕过路径排序。

在路由表中设置name属性：

```js
const routes = [
  { path: "/about/name/:name/age/:age", name: "about", component: About }
];
```

**router-link中使用**

```vue
<router-link :to="{ name: 'about', params: { name: '小明', age: 18 } }">跳转About页面</router-link>
```

**编程式导航中使用**

```js
 this.$router.push({ name: "about", params: { name: "小明", age: "18" } })
```



## 编程式导航

除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

### 简单使用

```js
// 方式一：字符串路径
this.$router.push("/about/name/小明/age/18");

// 方式二：路径对象
this.$router.push({ path: "/about/name/小明/age/18" });

// 方式三：命名路由
this.$router.push({ name: "about", params: { name: "小明", age: "18" } })

// 方式四：带hash
this.$router.push({ path: "/info", hash: "#abc" }) //结果：/info#abc
```

### 替换导航

```js
// 方式五：替换当前页面
this.$router.push({ path: "/info", replace: true })
//等价于：
this.$router.replace({ path: "/info" })
```

### 前进

```js
this.$router.forward();
//等价于：
this.$router.go(1);
```

### 后退

```js
this.$router.back();
//等价于：
this.$router.go(-1);
```



## 命名视图

可以同时 (同级) 展示多个视图，而不是嵌套展示。

如创建一个布局，有ShopTop、ShopMain和ShopFooter三个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。

如果 `router-view` 没有设置名字，那么默认为 `default`。

```
/shop                                      
+-----------------------------------+        
|     +--------------------+        |
|     |       ShopTop      |        |
|     +--------------------+        |
|     +--------------------+        |
|     |       ShopMain     |		|
|     +--------------------+  		|
|     +--------------------+   		|
|     |       ShopFooter   |		|
|     +--------------------+  		|
+-----------------------------------+
```

一、创建`ShopTop.vue`/`ShopMain.vue`/`ShopFooter.vue`三个组件。

二、在路由表中定义：

```js
const routes = [
    //命名视图
    {
        path: "/shop",
        components: {
            default: ShopMain,
            ShopTop, //ShopTop:ShopTop的简写
            ShopFooter,
        },
    }
];
```

三、在html中定义`<router-view>`并设置name属性：

```vue
<router-view name="ShopTop"></router-view>
<router-view ></router-view>
<router-view name="ShopFooter"></router-view>
```

### 嵌套命名视图

```
/sidebar/info                                      
+-----------------------------------+        
|     +--------------------+        |
|     |   LeftSidebar      |        |
|     +--------------------+        |
|     +--------------------+        |
|     |    MainContent     |		|
|     +--------------------+  		|
|     +--------------------+   		|
|     |     RightSidebar   |		|
|     +--------------------+  		|
+-----------------------------------+
```

一、创建`Sidebar.vue`/`LeftSidebar.vue`/`MainContent.vue`/`RightSidebar.vue`组件：

```
<template>
    <h2>Sidebar页面</h2>
    <router-view name="LeftSidebar"></router-view>
    <router-view name="MainContent"></router-view>
    <router-view name="RightSidebar"></router-view>
</template>
```

```
<template>
    <h3>LeftSidebar</h3>
</template>
```

```
<template>
    <h3>MainContent</h3>
</template>
```

```
<template>
    <h3>RightSidebar</h3>
</template>
```

二、在路由表中配置：

```
const routes = [
  //嵌套命名视图
  {
    path: "/sidebar",
    component: Sidebar,
    children: [
      {
        path: "info",
        components: { LeftSidebar, MainContent, RightSidebar },
      },
    ],
  }
];
```

三、使用路由：

```
<router-link to="/sidebar/info">跳转Sidebar页面（嵌套命名视图）</router-link>
```



## 重定向

重定向是指当用户访问 `/home` 时，URL 会被 `/` 替换，然后匹配成 `/`。

### 简单使用

```js
const routes = [
    // 方式一：字符串路径
    { path: "/home", redirect: "/" },

    // 方式二：路径对象
    { path: "/home", redirect: { path: "/" } },

    // 方式三：命名路由
    { path: "/home", redirect: { name: "homePage" } },

    //方式四：方法
    {
        path: "/home/:searchText",
        redirect: (to) => {
            return { path: "/home", query: { q: to.params.searchText } };
        },
    },
];
```

### 别名

别名指将 `/` 别名为 `/home`，意味着当用户访问 `/home` 时，URL 仍然是 `/home`，但会被匹配为用户正在访问 `/`。

在路由表中配置：

```js
const routes = [
    { path: "/", alias: "/home", component: Home },
];
```



## props传值

在你的组件中使用 `$route` 会与路由紧密耦合，这限制了组件的灵活性，因为它只能用于特定的 URL。虽然这不一定是件坏事，但我们可以通过 `props` 配置来解除这种行为：

在路由表中配置：

```js
const routes = [
    { path: "/user/:name/:age/:address", component: User, props: true },
];
```

创建User.vue组件

```vue
<script>
export default {
    //方式一，通过props接收数据
    props: ["name", "age", "address"],
    mounted() {
        //方式二：在`mounted()`中接收数据
        console.log("name:", this.$route.params.name);
        console.log("age:", this.$route.params.age);
        console.log("address:", this.$route.params.address);
    }
}
</script>
<template>
    <h2>User页面</h2>
    <p>name:{{ name }}</p>
    <p>age:{{ age }}</p>
    <p>address:{{ address }}</p>
</template>
```



## 路由守卫

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

### 全局守卫

守卫方法参数：

- to：表示将要进入的目标。
- from：表示要离开的目标。
- next：可选参数，表示执行路由。

`return false`表示取消导航。

```js
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuth) 
      next({ name: 'Login' })
  else 
      next()
})
```

### 独享守卫

`beforeEnter` 守卫 **只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在 **从一个不同的** 路由导航时，才会被触发。

在路由表中配置：

```vue
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```



## 路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。

Vue Router 支持开箱即用的[动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports)，这意味着你可以用动态导入代替静态导入：

```js
import User from "../views/User.vue";

替换为：
const User = () => import("../views/User.vue");
```



## 历史模式

在创建路由器实例时，`history` 配置允许我们在不同的历史模式中进行选择。

### Hash模式

它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。

**它在 SEO 中确实有不好的影响**。如果你担心这个问题，可以使用 HTML5 模式。

hash 模式是用 `createWebHashHistory()` 创建的：

```js
//创建Router实例，Hash模式
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```

### HTML5模式

当使用这种历史模式时，URL 会看起来很 "正常"，例如 `https://example.com/user/id`。漂亮!

不过，问题来了。由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 `https://example.com/user/id`，就会得到一个 404 错误。这就尴尬了。

不用担心：要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 `index.html` 相同的页面。漂亮依旧!

[服务器配置相关文档](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

用 `createWebHistory()` 创建 HTML5 模式，推荐使用这个模式：

```js
//HTML5模式
const router = createRouter({
  history: createWebHistory(),
  routes,
});
```



## [源码下载](https://github.com/xiangxiongfly/MyVueProject)