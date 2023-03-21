// //alloc
// let buffer = Buffer.alloc(10);
// console.log(buffer); //<Buffer 00 00 00 00 00 00 00 00 00 00>

// //allocUnsafe
// let buffer2 = Buffer.allocUnsafe(10);
// console.log(buffer2); //<Buffer 00 00 00 00 00 00 00 00 00 00>

// //from
// let buffer3 = Buffer.from("hello");
// console.log(buffer3); //<Buffer 68 65 6c 6c 6f>

// let buffer4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
// console.log(buffer4); //<Buffer 69 6c 6f 76 65 79 6f 75>

// //buffer转字符串
// console.log(buffer4.toString()); //iloveyou

// //获取下标位3的元素，转为二进制字符串
// console.log(buffer3[3].toString()); //108
// console.log(buffer3[3].toString(2)); //1101100

// buffer是数组结构
// let buf = Buffer.from("hello");
// console.log(buf);
// buf[0] = 65;
// console.log(buf);
// console.log(buf.toString());

let buffer = Buffer.from("你好"); //UTF-8下 一个汉字占3个字节
console.log(buffer);
