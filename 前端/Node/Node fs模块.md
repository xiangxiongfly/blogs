[toc]

# Node fs模块

## 概述

fs（file system）文件系统，是Node.js的内置模块，可以对计算机中的磁盘机械能操作。



## 文件写入

文件写入就是将 数据 保存到 文件 中，我们可以使用如下几个方法来实现该效果

| 文件写入方法                | 说明     |
| --------------------------- | -------- |
| writeFile                   | 异步写入 |
| writeFileSync               | 同步写入 |
| appendFile / appendFileSync | 追加写入 |
| createWriteStream           | 流式写入 |

### writeFile 异步写入

**语法**

```
fs.writeFile(file, data, callback)
```

**参数说明**

- file：文件路径。
- data：写入到内容。
- callback：结果回调。

**使用**

```javascript
const fs = require("fs");

fs.writeFile("./test.txt", "hello 哈喽", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("写入成功");
});
```

### writeFileSync 同步写入

**语法**

```
fs.writeFileSync(file, data)
```

**使用**

```javascript
try {
  fs.writeFileSync("./test.txt", "hello 哈喽");
  console.log("写入成功");
} catch (e) {
  console.log(e);
}
```



### appendFile / appendFileSync 追加写入

**语法**

```
fs.appendFile(file, data, callback)
```

```
fs.appendFileSync(file, data)
```

**使用**

```javascript
fs.appendFile("./test.txt", "hello world", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("追加成功");
});
```

```javascript
fs.appendFileSync("./test.txt", "hello node");
```

### createWriteStream 流式写入

程序打开一个文件是需要消耗资源的，writeFile适合写入频率较低的情况，createWriteStream适合大文件写入和写入频率较高的情况。

**语法**

```
fs.createWriteStream(path)
```

**参数说明**

- path：文件路径。

**使用**

```javascript
let ws = fs.createWriteStream("./前端学习");
ws.write("HTML\n");
ws.write("CSS\n");
ws.write("JavaScript\n");
ws.write("Vue\n");
ws.end();
```



## 文件读取

从文件中读取数据。

| 文件读取方法     | 说明     |
| ---------------- | -------- |
| readFile         | 异步读取 |
| readFileSync     | 同步读取 |
| createReadStream | 流式读取 |

### readFile 异步读取

**语法**

```
fs.readFile(path, callback)
```

**参数说明**

- path：文件路径。
- callback：回调函数。

**使用**

```javascript
const fs = require("fs");

fs.readFile("./test.txt", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString()); //hello 哈喽
});
```

```javascript
fs.readFile("./test.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString()); //hello 哈喽
});
```

### readFileSync 同步读取

**语法**

```
fs.readFileSync(path)
```

**参数说明**

- path：文件路径。
- 返回值为string或Buffer。

**使用**

```javascript
let data = fs.readFileSync("./test.txt", "utf-8");
console.log(data); //hello 哈喽
```

```javascript
let data = fs.readFileSync("./test.txt");
console.log(data); //<Buffer 68 65 6c 6c 6f 20 e5 93 88 e5 96 bd>
```

### createReadStream 流式读取

**语法**

```
fs.createReadStream(path)
```

**参数说明**

- path：文件路径。
- 返回值为object。

**使用**

```javascript
let rs = fs.createReadStream("./test.txt");

// 监听读取中，每次读取64k数据
rs.on("data", (data) => {
  console.log(data);
  console.log(data.length);
});

// 监听读取完成，完成后执行回调
rs.on("end", () => {
  console.log("读取完成");
});
```



## 文件移动和重命名

| 方法       | 说明                         |
| ---------- | ---------------------------- |
| rename     | 异步移动或重命名文件和文件夹 |
| renameSync | 同步移动或重命名文件和文件夹 |

### rename 移动或重命名

**语法**

```
fs.rename(oldPath, newPath, callback)
```

**参数说明**

- oldPath：旧文件路径。
- newPath：新文件路径。
- callback：操作后的回调。

**使用**

如果涉及到文件夹，需要保证文件夹的存在，否则操作会

```javascript
fs.rename("./test.txt", "./a/test2.txt", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("移动成功");
});
```

### renameSync 同步移动或重命名

```javascript
fs.renameSync("./test.txt", "./a/test2.txt");
```



## 文件删除

| 方法       | 说明         |
| ---------- | ------------ |
| unlink     | 异步删除文件 |
| unlickSync | 同步删除文件 |

### unlink 删除文件

**语法**

```
fs.unlink(path, callback)
```

**参数说明**

- path：文件路径。
- callback：操作后的回调。

**使用**

```javascript
fs.unlink("./test.txt", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("删除成功");
});
```



## 文件夹操作

| 方法                  | 说明           |
| --------------------- | -------------- |
| mkdir / mkdirSync     | 创建文件夹     |
| readdir / readdirSync | 读取文件夹内容 |
| rmdir / rmdirSync     | 删除文件夹     |

### mkdir 创建文件夹

**语法**

```
fs.mkdir(path, options, callback)
```

**参数说明**

- path：文件夹路径。
- options：可选，配置选项。
- callback：操作后的回调。

**使用**

```javascript
// 创建单个文件夹
fs.mkdir("./a", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("创建成功");
});
```

```javascript
// 创建多级文件夹
fs.mkdir("./a/b/c", { recursive: true }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("创建成功");
});
```

```javascript
// 同步创建多级文件夹
fs.mkdirSync("./a/b/c", { recursive: true });
```

### readdir 读取文件夹内容

**语法**

```
fs.readdir(path, callback)
```

**参数说明**

- path：文件夹路径。
- callback：操作后的回调。

**使用**

```javascript
// 读取文件夹中的内容
fs.readdir("./a", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data); //[ 'b', 'c', 'test1.txt', 'test2.txt' ]
});
```

```javascript
// 同步读取文件里的内容
let arr = fs.readdirSync("./a");
console.log(arr); //[ 'b', 'c', 'test1.txt', 'test2.txt' ]
```

### rmdir 删除文件夹

**语法**

```
fs.rmdir(path, options, callback)
```

**参数说明**

- path：文件夹路径。
- options：可选，配置选项。
- callback：操作后的回调。

**使用**

```javascript
// 删除文件夹，只能删除空文件夹
fs.rmdir("./a", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("删除成功");
});
```

```javascript
// 递归删除文件夹
fs.rmdir("./a", { recursive: true }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("删除成功");
});
```

```javascript
// 同步递归删除文件夹
fs.rmdirSync("./a", { recursive: true });
```




## 查看资源状态

**语法**

```
fs.stat(path, callback)
```

**参数说明**

- path：文件路径。
- callback：操作后的回调。

**使用**

```javascript
// 获取文件信息
fs.stat("./test.txt", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});

// Stats {
//   dev: 2823837299,
//   mode: 33206,
//   nlink: 1,
//   uid: 0,
//   gid: 0,
//   rdev: 0,
//   blksize: 4096,
//   ino: 1407374885128710,
//   size: 11,
//   blocks: 0,
//   atimeMs: 1681185331790.6975,
//   mtimeMs: 1681185330730.9456,
//   ctimeMs: 1681185330730.9456,
//   birthtimeMs: 1681185292801.0833,
//   atime: 2023-04-11T03:55:31.791Z,
//   mtime: 2023-04-11T03:55:30.731Z,
//   ctime: 2023-04-11T03:55:30.731Z,
//   birthtime: 2023-04-11T03:54:52.801Z
// }
```

```javascript
// 同步获取文件信息
let data = fs.statSync("./test.txt");
```

### isFile() & isDirectory()

isFile() 是否为文件。

isDirectory() 是否为文件夹。

```javascript
let data = fs.statSync("./test.txt");
console.log(data.isFile()); //true
console.log(data.isDirectory()); //false
```



## 文件批量重命名

```javascript
const fs = require("fs");

let files = fs.readdirSync("./a");
files.forEach((value, index) => {
  let newName = index + "-" + value;
  fs.renameSync("./a/" + value, "./a/" + newName);
});
```



## 文件复制操作

**方式一：readFileSync & writeFileSync**

```javascript
const fs = require("fs");

let data = fs.readFileSync("./a.pdf");
fs.writeFileSync("./b.pdf", data);
```

**方式二：createReadStream & createWriteStream**

```javascript
const fs = require("fs");

let rs = fs.createReadStream("./a.pdf");
let ws = fs.createWriteStream("./b.pdf");
rs.pipe(ws);
```

```javascript
// 上面等价于如下：
let rs = fs.createReadStream("./a.pdf");
let ws = fs.createWriteStream("./b.pdf");
rs.on("data", (data) => {
  ws.write(data);
});
rs.on("end", () => {
  ws.end();
});
```

