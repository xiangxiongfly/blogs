[toc]

# Node path模块

## 概述

path 是Node.js的内置模块，提供了处理文件路径和目录路径的功能。



## __dirname

`__dirname` 是 Node.js 中的一个全局变量，它表示当前模块文件所在的目录的绝对路径。

使用 `__dirname` 可以方便地获取当前模块所在的目录路径，而不需要事先计算或指定路径。

```javascript
console.log(__dirname); // D:\xxx\LearnNode\LearnNodeTest
```



## __filename

`__filename` 是 Node.js 中的一个全局变量，它表示当前模块文件的绝对路径。

使用 `__filename` 可以方便地获取当前模块文件的完整路径，包括文件名和扩展名。与 `__dirname` 不同，`__filename` 包含了文件名和扩展名，而不仅仅是目录路径。

```javascript
console.log(__filename); //D:\xxx\LearnNode\LearnNodeTest\xxx.js
```



## 使用

| 方法          | 说明               |
| ------------- | ------------------ |
| path.resolve  | 拼接绝对路径       |
| path.sep      | 分隔符             |
| path.parse    | 解析路径并返回对象 |
| path.basename | 获取路径的基础名称 |
| path.dirname  | 获取路径的目录名   |
| path.extname  | 获取路径的扩展名   |

```javascript
const path = require("path");

// 获取分隔符
console.log(path.sep); //\

// 拼接绝对路径
console.log(path.resolve(__dirname, "test")); //D:\xxx\LearnNode\LearnNodeTest\test
console.log(path.resolve(__dirname, "a", "b", "test")); //D:\xxx\LearnNode\LearnNodeTest\a\b\test


// 解析路径
let fileName = "D:/MyWorksapce/LearnNode/LearnNodeTest/test.txt";
console.log(path.parse(fileName));
// {
//     root: 'D:/',
//     dir: 'D:/xxx/LearnNode/LearnNodeTest',
//     base: 'test.txt',
//     ext: '.txt',
//     name: 'test'
//   }

// 获取路径基础名
console.log(path.basename(fileName)); //test.txt

// 获取路径的目录名
console.log(path.dirname(fileName)); //D:/xxx/LearnNode/LearnNodeTest

// 获取路径的扩展名
console.log(path.extname(fileName)); //.txt
```

