// 导入fs模块
const fs = require("fs");

// 异步写入文件
// fs.writeFile("./test.txt", "好好学习", (err) => {
//   //写入失败，err为错误对象；写入成功，err为null
//   if (err) {
//     console.log("写入失败");
//     return;
//   }
//   console.log("写入成功");
// });

// 同步写入文件
// fs.writeFileSync("./test.txt", "天天向上");

// 文件异步追加写入
// fs.appendFile("./test.txt", "卧槽", (err) => {
//   if (err) {
//     console.log("写入失败");
//     return;
//   }
//   console.log("写入成功");
// });

// appendFileSync同步追加写入
// fs.appendFileSync("./test.txt", "hello world!");
// fs.writeFile("./test.txt", "six six six", { flag: "a" }, (err) => {});

// 流式写入
// 创建写入流对象
const ws = fs.createWriteStream("./西游记.txt");

// 写入
ws.write("唐僧\r\n");
ws.write("孙悟空\r\n");
ws.write("猪八戒\r\n");
ws.write("沙和尚\r\n");

// 关闭
ws.close();
