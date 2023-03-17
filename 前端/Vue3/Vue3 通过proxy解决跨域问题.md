# Vue3 通过proxy解决跨域问题

这里用的是vite，因此需要在vite.config.js文件中配置：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
    
  //配置中转服务器
  server: {
    proxy: {
      //通过代理实现跨域
      "/path": {
        target: "https://www.wanandroid.com", //替换的域名地址
        changeOrigin: true, //开启代理，表示允许跨域
        rewrite: (path) => path.replace(/^\/path/, ""), //重写路径，替换字符串"/path"
      },
    },
  },
});
```

网络请求：

```js
import axios from "axios";
axios.get("/path/banner/json")
                .then((res) => {
                    console.log(res);
                });
```

