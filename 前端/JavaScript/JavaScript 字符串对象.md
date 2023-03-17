[TOC]

# JavaScript 字符串对象

## 概述

在JavaScript中，对象可以分2种：自定义对象、内置对象。字符串对象就是内置对象之一。



## 常用属性和方法

| 属性和方法                                                   | 说明                                            |
| ------------------------------------------------------------ | ----------------------------------------------- |
| 字符串.length                                                | 获取字符串长度                                  |
| 字符串.toLowerCase()                                         | 转小写                                          |
| 字符串.toUpperCase()                                         | 转大写                                          |
| 字符串.charAt(index)                                         | 获取指定下标的字符                              |
| 字符串.substring(start,end)                                  | 截取字符串，但不包含end                         |
| 字符串.replace(原字符串, 替换字符串)<br />字符串.replace(正则表达式, 替换字符串) | 替换字符串                                      |
| 字符串.split("分割符")                                       | 分割字符串，并返回数组                          |
| 字符串.indexOf(指定字符串)                                   | 检索指定字符串的下标                            |
| 字符串.lastIndexOf(指定字符串)                               | 从后往前检索，检索指定字符串的下标              |
| 字符串.includes(指定字符串)                                  | 是否包含指定字符串，包含返回true，否则返回false |
| 字符串.trimStart()                                           | 清除前面空格                                    |
| 字符串.trimEnd()                                             | 清除后面空格                                    |
| 字符串.trim()                                                | 清除前后空格                                    |
| 字符串.padStart(最大长度, 指定字符)                          | 字符串超过最大长度，前面填充指定字符            |
| 字符串.padEnd(最大长度, 指定字符)                            | 字符串超过最大长度，后面填充指定字符            |
| 字符串.concat(字符串)                                        | 拼接字符串                                      |



## 案例

### 统计字符个数

```javascript
var str = "HTML,CSS,JavaScript";
var count = 0;
for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (c == "S") {
        count++;
    }
}

console.log(count); //3
```

### 统计字符串有多少个数字

```javascript
var str = "HT1ML,C2S,Jav3aScri4pt5";
var count = 0;
for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (c != " " && !isNaN(c)) {
        count++;
    }
}

console.log(count); //5
```

说明：isNaN会将空字符串转为0，需要增加空格判断。

