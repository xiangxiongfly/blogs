[TOC]

# JavaScript Math对象

## 常用属性和方法

| 属性和方法                     | 说明                       |
| ------------------------------ | -------------------------- |
| Math.PI                        | 圆周率                     |
| Math.max(数字1, 数字2, ......) | 获取最大值                 |
| Math.min(数字1, 数字2, ......) | 获取最小值                 |
| Math.floor()                   | 向下取整                   |
| Math.ceil()                    | 向上取整                   |
| Math.random()                  | 生成随机数，0~1之间不包含1 |
| Math.abs()                     | 获取绝对值                 |
| Math.sqrt()                    | 获取平方根                 |
| Math.pow(x,y)                  | 获取x的y次方               |



## 案例

### 获取指定范围内的随机数

```
Math.random() * m
```

表示生成`0~m`的随机数，如`Math.random() * 10`表示生成`[0,10)`的随机数。



```
Math.random() * m + n
```

表示生成`n~m+n`的随机数，如`Math.random() * 5 + 10`表示生成`[10,15)`的随机数。



### 获取指定范围内的整数

```
Math.floor(Math.random() * 5)
```

表示生成`[0,4]`的随机数。



### 生成随机数验证码

```javascript
var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var arr = str.split("");
var result = "";
for (
    var i = 0; i < 4; i++) {
    var n = Math.floor(Math.random() * arr.length);
    result += arr[n];
}
document.write(result);
```



### 生成随机颜色值

```javascript
function getRandomColor() {
    var r = Math.floor(Math.random() * (255 + 1));
    var g = Math.floor(Math.random() * (255 + 1));
    var b = Math.floor(Math.random() * (255 + 1));
    var rgb = "rgb(" + r + "," + g + "," + b + ")";
    return rgb;
}
```

