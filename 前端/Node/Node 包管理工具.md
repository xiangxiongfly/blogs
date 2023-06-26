[toc]

# Node 包管理工具

## npm

### 简介

npm（Node Package Manager）指Node的包管理工具。

npm是node.js官方内置的包管理工具。node.js在安装时会自动安装npm。

npm包网址：[npm (npmjs.com)](https://www.npmjs.com/)

### npm常用命令

查看npm版本：

```
npm -v
```

初始化：

会生成package.josn文件。

```
npm init
```

快速初始化：

会跳过询问阶段。

```
npm init -y 
或：
npm init --yes
```

查看已安装模块：

```
npm list
```

查看全局已安装模块：

`--depth 0`表示不深入查看，比较简洁。

```
npm list -g --depth 0
```

安装模块：

会读取package.json里的配置进行安装，会生成node_modules文件夹和pacakge-lock.json文件。。

```
npm install "包名"
或：
npm i "包名"

如：
npm i jquery@1.11.2
```

生产环境安装：

`-S`等于`--save`，`-S`是默认选项，包信息保存在package.json中的dependencies属性。

```
npm i --save uniq
或：
npm i -S uniq
```

开发环境安装：

`-D`等于`--save-dev`，包信息保存在package.json中的devDependencies属性。

```
npm i --save-dev less
或：
npm i -D less
```

删除包：

```
npm remove "包名"
或：
npm r "包名"
或：
npm uninstall "包名"

如：
npm r uniq
```

全局删除包：

```
npm remove -g nodemon
```

查看包安装位置：

```
npm root // 查看局部
npm root -g // 查看全局安装包的位置 
```

### package.json & package-lock.json & node_modules关系

- package.json：是一个描述项目依赖关系的JSON文件。
- package-lock.json：用于锁定包的版本。
- node_modules：是一个文件夹，用于存放下载的包。

**package.json文件结构**

```
{
  "name": "demo", //包的名称
  "version": "1.0.0", //包的版本
  "description": "", //包的描述
  "main": "index.js", //包的入口文件
  "scripts": { //脚本配置
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "", //作者
  "license": "ISC" //开源证书
}
```

说明：

包的名称不能使用中文、大写，默认值是文件夹的名称。

包的版本要求是`x.x.x`的格式，x必须是数字，默认值是`1.0.0`。

### nodemon

```
npm i -g nodemon
```

全局安装nodemon，nodemon可以启动重启node应用程序。

### 配置命令别名

配置package.json文件中的 `scripts` 属性：

```json
{
   "scripts": {
    "server": "node server.js",
    "start": "node index.js"
  },
}
```

配置后，可以使用别名执行命令：

```
npm run server
npm run start //start别名比较特殊，可以省略run直接npm start
```

### npm配置淘宝镜像

```
npm config set registry https://registry.npmmirror.com/
```



## cnpm

### 简介

cnpm 是一个淘宝构建的 npmjs.com 的完整镜像，也称为『淘宝镜像』，网址**https://npmmirror.com/**。

cnpm 服务部署在国内 阿里云服务器上 ， 可以提高包的下载速度。

官方也提供了一个全局工具包 cnpm ，操作命令与 npm 大体相同。

### 安装cnpm

```
npm install -g cnpm --registry=https://registry.npmmirror.com
```



## yarn

### 简介

yarn 是由 Facebook 在 2016 年推出的新的 Javascript 包管理工具，官方网址：**https://yarnpkg.com/**。

yarn 官方宣称的一些特点：

- 速度超快：yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
- 超级安全：在执行代码之前，yarn 会通过算法校验每个安装包的完整性。
- 超级可靠：使用详细、简洁的锁文件格式和明确的安装算法，yarn 能够保证在不同系统上无差异的工作。

### 安装yarn

```
npm i -g yarn
```

### yarn常用命令

| 命令                                                         | 说明           |
| ------------------------------------------------------------ | -------------- |
| yarn init<br />yarn init -y                                  | 初始化         |
| yarn add uniq 生产环境<br />yarn add less --dev 开发环境<br />yarn global add nodemon 全局环境 | 安装包         |
| yarn remove uniq 删除项目依赖包<br />yarn global remove nodemon 删除全局依赖包 | 删除包         |
| yarn                                                         | 安装项目依赖   |
| yarn <"别名">                                                | 运行命令别名   |
| yarn config list                                             | 查看yarn配置项 |

### yarn配置淘宝镜像

```
yarn config set registry https://registry.npmmirror.com/
```

