[toc]

# 微信小程序-WXS

## 概述

WXS（WeiXin Script）是小程序的一套脚本语言，可以结合 WXML 构建出页面结构。

WXS 的应用场景是“过滤器”，所谓的过滤器是指在渲染数据之前，对数据进行处理，过滤器处理的结果最终会显示在页面上。

WXS 与 JavaScript 是不同的语言，有自己的语法，不支持 ES6 规范，并不和 JavaScript 一致。WXS 不支持 let、const、解构赋值、展开运算符、箭头函数、对象属性简写等语法，WXS 支持 var 定义变量、普通 function 函数等语法。

WXS 支持八种数据类型：

- `number` ： 数值
- `string` ：字符串
- `boolean`：布尔值
- `object`：对象
- `function`：函数
- `array` : 数组
- `date`：日期
- `regexp`：正则

WXS 遵循 CommonJS规范。在每个模块内部，module 变量代表当前模块，这个变量是一个对象，它的 exports 属性（即module.exports）是对外的接口。在使用 require() 函数引用其他模块时，得到的是被引用模块中 module.exports 所指的对象。

WXS 具有隔离性：隔离性是指 WXS 代码的运行环境和其他 JavaScript 代码是隔离的：

- 在 WXS 代码中不能调用页面的JS文件定义的函数。
- 在 WXS 代码中不能调用微信小程序提供的API。

WXS代码可以写在页面的WXML文件的标签内（内嵌WXS脚本），也可以写在以.wxs为后缀名的文件中（外联WXS脚本）。每一个.wxs文件和标签均为一个单独的模块，有自己独立的作用域，即在一个模块内定义的变量和函数默认为私有的，对其他模块不可见。一个模块想要对外暴露其内部的变量和函数，只能通过module.exports实现。

## [语法文档](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)



## 内联WXS脚本

```xml
<wxs module="m1">
	function toUpper(str){
    	return str.toUpperCase()
    }
    module.exports = {
    	toUpper: toUpper
    }
</wxs>

<view>
	{{m1.toUpper("hello world")}}
</view>
```



## 外联WXS脚本

新建date.wxs文件：

```javascript
function handleDate(time) {
  var oDate = getDate(time);
  return oDate.getFullYear() + "-" + (oDate.getMonth() + 1) + "-" + oDate.getDate();
}

module.exports = handleDate
```

```xml
<wxs src="./date.wxs" module="handleCurrentDate" />
<text>{{handleCurrentDate()}}</text>
```

新建studentList.wxs文件：

```javascript
function filterScore(studentList) {
  return studentList.filter(function (item) {
    return item.age > 18
  })
}

function filterAge(studentList) {
  return studentList.filter(function (item) {
    return item.score > 60
  })
}

module.exports = {
  filterScore: filterScore,
  filterAge: filterAge
};
```

使用：

```xml
<view>过滤score大于60的</view>
<wxs src="./studentUtils.wxs" module="studentUtils" />
<view wx:for="{{studentUtils.filterScore(studentList)}}" wx:key="index">
  {{item.name}} - {{item.score}}
</view>
<view>过滤age大于18的</view>
<view wx:for="{{studentUtils.filterAge(studentList)}}">
  {{item.name}} - {{item.age}}
</view>
```

