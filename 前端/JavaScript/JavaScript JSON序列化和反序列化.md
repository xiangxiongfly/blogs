[toc]

# JavaScript JSON序列化和反序列化

## 概述

JSON数据在网络传输时存在两种类型，一种是JSON对象类型，一种是JSON字符串类型，两种类型的转换涉及JSON序列化和反序列化的知识。

JSON序列化即将JSON对象处理为JSON字符串的过程，以方便数据的传输。JSON序列化可以通过两种方式来实现，一种是调用JSON对象内置的stringify()函数，一种是为对象自定义toJSON()函数。

JSON反序列化即将JSON字符串转换为JSON对象的过程，得到的结果用于在JavaScript中做逻辑处理。JSON反序列化的实现方式有两种，一种是使用JSON对象内置的parse()函数，一种是使用eval()函数。



## JSON序列化

### JSON.stringify()

**语法**

```
JSON.stringify(value, replacer, space)
```

**说明**

参数value：需要处理的值，可以为对象活数组。

参数replacer：可选参数。

- 如果其值为一个函数，则表示在序列化过程中，被序列化值的每个属性都会经过该函数的处理；
- 如果其值为一个数组，则表示只有包含在这个数组中的属性名才会被序列化到最终的JSON字符串中；
- 如果该值为null或者未传递，则value参数对应值的所有属性都会被序列化。

参数space：可选参数。用于指定缩进用的空白字符串，美化输出。

- 如果参数是个数字，则代表有多少个空格，上限值为10；
- 如果该参数的值小于1，则意味着没有空格；
- 如果参数为字符串，则取字符串的前十个字符作为空格；
- 如果没有传入参数或者传入的值为null，将没有空格。

#### 仅一个参数使用

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"]
};

var jsonStr = JSON.stringify(obj);
console.log(jsonStr); 
//{"name":"xiaoming","age":18,"sex":true,"address":["广东省","广州市"]}
```

#### 使用2个参数

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"]
};

function replacerFn(key, value) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value;
}

var jsonStr = JSON.stringify(obj, replacerFn);
console.log(jsonStr);
//{"name":"XIAOMING","age":18,"sex":true,"address":["广东省","广州市"]}
```

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"]
};

var jsonStr = JSON.stringify(obj, ["name", "age"]);
console.log(jsonStr);
//{"name":"xiaoming","age":18}
```

#### 使用3个参数

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"]
};

function replacerFn(key, value) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value;
}
var jsonStr = JSON.stringify(obj, ["name", "age"], 10);
console.log(jsonStr);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff60417699ec410199307f61a2827cd7.png)

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"]
};

function replacerFn(key, value) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value;
}
var jsonStr = JSON.stringify(obj, ["name", "age"], "@@@");
console.log(jsonStr);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/be6e7c552c534b25861beffa62ac5d20.png)

#### 其他

```javascript
var jsonStr = JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
console.log(jsonStr); 
//[1,"false",false]
```

```javascript
var jsonStr = JSON.stringify({
    x: undefined,
    y: Object,
    z: Symbol("")
});
console.log(jsonStr);
//{}
```

```javascript
var jsonStr = JSON.stringify([undefined, Object, Symbol("")]);
console.log(jsonStr);
//[null,null,null]
```



### 自定义toJson

如果一个被序列化的对象拥有toJSON()函数，那么toJSON()函数就会覆盖默认的序列化行为，被序列化的值将不再是原来的属性值，而是toJSON()函数的返回值。

toJSON()函数用于更精确的控制序列化，可以看作是对stringify()函数的补充。

```javascript
var obj = {
    name: "xiaoming",
    age: 18,
    sex: true,
    address: ["广东省", "广州市"],
    toJSON: function() {
        return {
            Name: this.name,
            Age: this.age,
            Sex: this.sex
        };
    }
};

var jsonStr = JSON.stringify(obj);
console.log(jsonStr);
//{"Name":"xiaoming","Age":18,"Sex":true}
```

#### 序列化顺序

序列化处理的顺序如下：

- 如果待序列化的对象存在toJSON()函数，则优先调用toJSON()函数，以toJSON()函数的返回值作为待序列化的值，否则返回JSON对象本身。
- 如果stringify()函数提供了第二个参数replacer，则对上一步的返回值经过replacer参数处理。
- 如果stringify()函数提供了第三个参数，则对JSON字符串进行格式化处理，返回最终的结果。



## 反序列化

### JSON.parse()

**语法**

```
JSON.parse(text, reviver)
```

**说明**

参数text：待解析度JSON字符串。

参数reviver：可选参数。

- 如果是一个函数，则规定了原始值在返回之前如何被解析改造。
- 如果被解析的JSON字符串是非法的，则会抛出异常。

#### 仅一个参数使用

```javascript
var arrStr = '[1,true,"hello"]';
var arr = JSON.parse(arrStr);
console.log(arr); //[1, true, "hello"]
```

```javascript
var objStr = `{
"name":"xiaoming",
"age":18,
"address":"beijing"
}`;
var obj = JSON.parse(objStr);
console.log(obj); //{name: "xiaoming", age: 18, address: "beijing"}
```

```javascript
var a = "12.34";
var result = JSON.parse(a);
console.log(result); //12.34
```

#### 使用2个参数

```javascript
var objStr = `{
"name":"xiaoming",
"age":18,
"address":"beijing"
}`;
var result = JSON.parse(objStr, function(key, value) {
    if (key === "name") {
        return value + "先生";
    }
    if (key === "age") {
        return value + "岁";
    }
    return value;
});
console.log(result); //{name: "xiaoming先生", age: "18岁", address: "beijing"}
```



### eval()

eval()函数用于计算JavaScript字符串，并把它作为脚本来执行。

**语法**

```
eval("(" + str + ")")
```

**说明**

这里为什么要使用括号将拼接出来的字符串括起来呢？

因为JSON字符串是以“{}”表示开始和结束，在JavaScript中它会被当作一个语句块来处理，所以必须强制将它处理成一个表达式，所以采用括号。

**使用**

```javascript
var objStr = `{
"name":"xiaoming",
"age":18,
"address":"beijing"
}`;
var result = eval("(" + objStr + ")");
console.log(result); //{name: "xiaoming先生", age: "18岁", address: "beijing"}
```



