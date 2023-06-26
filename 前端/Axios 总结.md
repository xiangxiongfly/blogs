[toc]

# Axios 总结

## 概述

Axios 是一个基于 promise 的网络请求库，可以用于浏览器和 node.js。



## 安装

使用npm：

```
npm install axios
```

直接使用：

```
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

或

```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```



## 基本使用

### get

**方式一：**

```javascript
axios
    .get("http://localhost:3000/users", {
        params: {
            age: 38,
        },
    })
        .then((response) => {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    })
        .catch((error) => {
        console.log("失败");
    });
```

**方式二：**

```javascript
 axios({
        method: "get",
        url: "http://localhost:3000/users",
        params: {
          age: 38,
        },
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("失败");
        });
```

### post

**方式一：**

```javascript
axios
        .post("http://localhost:3000/users", {
          name: "小明",
          age: 10,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
```

**方式二：**

```javascript
 axios({
        method: "post",
        url: "http://localhost:3000/users",
        data: {
          name: "小明",
          age: 10,
        },
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
```

**方式三：**

```javascript
 axios
        .post("http://localhost:3000/users", "name=abc&age=66")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
```

### 并发请求

```javascript
function getUsers() {
    return axios.get("http://localhost:3000/users");
}
function getComments() {
    return axios.get("http://localhost:3000/comments");
}

Promise.all([getUsers(), getComments()])
    .then(function (results) {
    const users = results[0];
    console.log(users);
    const comments = results[1];
    console.log(comments);
})
    .catch((error) => {
    console.log(error);
});
```



## 基本配置

### 配置项

- baseURL 请求的域名，基本地址，类型：String
- timeout 请求超时时长，单位ms，类型：Number
- url 请求路径，类型：String
- method 请求方法，类型：String
- headers 设置请求头，类型：Object
- params 请求参数，将参数拼接在URL上，类型：Object
- data 请求参数，将参数放到请求体中，类型：Object

### 请求配置

```javascript
axios
        .get("/users", {
          baseURL: "http://localhost:3000",
          timeout: 3000,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("失败");
        });
```

### 实例配置

```javascript
let instance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 30000,
});
instance
    .get("/users")
    .then((response) => {
    console.log(response.data);
})
    .catch((error) => {
    console.log(error);
});
```

### 全局配置

```javascript
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.timeout = 30000;
axios.get("/users")
    .then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.log("失败");
});
```



## 拦截器

### 使用拦截器

```javascript
// 添加请求拦截器
const requestInterceptor = axios.interceptors.request.use(
    function (config) {
        // 发生请求前的处理
        console.log("请求拦截器：", config);
        return config;
    },
    function (error) {
        // 请求错误处理
        console.log("请求拦截器：请求错误：", error.message);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
const responseInterceptor = axios.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        console.log("响应拦截器：", response);
        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        console.log("响应拦截器：请求失败：", error.message);
        return Promise.reject(error);
    }
);

axios
    .get("/users", {
        baseURL: "http://localhost:3000",
    })
        .then((response) => {
        console.log("请求成功：", response.data);
    })
        .catch((error) => {
        console.log("请求失败：", error);
    });
```

### 取消拦截

```javas
axios.interceptors.request.eject(requestInterceptor);
```



## 取消请求

```javascript
let source = axios.CancelToken.source();

axios
    .get("/users", {
        baseURL: "http://localhost:3000",
        cancelToken: source.token,
    })
        .then((response) => {
        console.log("请求成功：", response.data);
    })
        .catch((error) => {
        console.log("请求失败：", error);
    });

source.cancel("hell 取消了");
```

