# JavaScript 判断元素是否包含指定class

## 方式一：className

```javascript
console.log(element.className); //a b c
console.log(typeof element.className); //string

//是否存在class属性
if (element.getAttribute("class")) {
    if (element.className.indexOf("a") != -1) {
        console.log("存在");
    } else {
        console.log("不存在");
    }
}
```

## 方式二：classList

在HTML5中新增classList。

```javascript
console.log(element.classList); //DOMTokenList(3) ["a", "b", "c", value: "a b c"]
console.log(typeof element.classList); //object

//是否存在class属性
if (element.getAttribute("class")) {
    if (element.classList.contains("a")) {
        console.log("存在");
    } else {
        console.log("不存在");
    }
}
```

## 方式三：getAttribute()

```javascript
if (element.getAttribute("class")) {
    if (element.getAttribute("class").indexOf("a") != -1) {
        console.log("存在");
    } else {
        console.log("不存在");
    }
}
```



