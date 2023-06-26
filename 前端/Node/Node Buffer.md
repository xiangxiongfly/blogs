[toc]

# Node Buffer

## 概述

Buffer是一个类似数组的对象，用户表示固定长度的字节序列。

Buffer本质是一段内存空间，专门用来处理二进制数据。

**特点：**

- Buffer大小固定，无法调整。
- Buffer性能较好，可以直接对计算机内存进行操作。
- 每个元素的大小为1byte。



## 创建

**方式一：通过Buffer.alloc()创建**

```javascript
// 表示创建一个长度为10个byte的Buffer，每个byte都值为0
let buffer1 = Buffer.alloc(10);
console.log(buffer1); //<Buffer 00 00 00 00 00 00 00 00 00 00>
```

**方式二：通过Buffer.allocUnsafe()创建**

```javascript
// 创建一个长度为10字节的Buffer，buffer中可能存在旧数据
let buffer2 = Buffer.allocUnsafe(10);
console.log(buffer2); //<Buffer 00 00 00 00 00 00 00 00 00 00>
```

**方式三：通过 Buffer.from()创建**

```javascript
// 通过字符串创建Buffer
let buffer3 = Buffer.from("hello");
console.log(buffer3); //<Buffer 68 65 6c 6c 6f>
```

```javascript
// 通过数组创建Buffer
let buffer4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
console.log(buffer4); //<Buffer 69 6c 6f 76 65 79 6f 75>
```



## 转化

### toString()

可以通过toString()将Buffer转为字符串。

toString()默认按照utf-8编码方式转换，在utf-8中一个字符占3个字节。

```javascript
console.log(buffer4.toString()); //iloveyou
```

```javascript
let buffer = Buffer.from("ABC");
console.log(buffer[0]); //65
buffer[0] = 97;
console.log(buffer.toString()); //aBC
```

