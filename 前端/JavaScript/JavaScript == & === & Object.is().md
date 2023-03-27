[toc]

# JavaScript == & === & Object.is()

### == 相等运算符

`==`相等运算符，会先进行类型转换，将2个操作数转为相同的类型，再比较2个值。

```js
console.log("10" == 10); //true
console.log(1 == true); //true
console.log(+0 == -0); //true
console.log(NaN == NaN); //false
console.log(null == undefined); //true
```

说明：

- `"10" == 10`返回true，这是因为双等于运算符会做类型转换，字符串10转为数值10，因此结果为true。
- `1 == true`返回true，同理类型转换true转为数值1，因此结果也为true。
- `NaN == NaN`返回false，这是因为NaN表示不是一个数字，一种特殊的number类型，不是一个确切的值，与任何值都不相等，包括它自己。
- `null == undefined`返回true，这是因为双等于运算符会做类型转换，都转换为0，所以结果为true。



### === 全等运算符

`===`全等运算符，不会类型转换，只有当两个值的类型和值都相同时才会返回 true。

```javascript
console.log("10" === 10); //false
console.log(1 === true); //false
console.log(+0 === -0); //true
console.log(NaN === NaN); //false
console.log(null === undefined); //false
```



### Object.is() 值比较

`Object.is()` 是 ES6新增的方法，用于比较两个值是否严格相等（即在所有情况下都返回相同的布尔值），与`===`类似，但有一些特殊情况下的行为不同。

满足以下调节则会返回true：

- 两个值都是 `undefined`。
- 两个值都是 `null`。
- 两个值都是相同的布尔值。
- 两个值都是相同的字符串。
- 两个值都是相同的数字（包括正零、负零和 NaN）。
- 两个值引用同一个对象。

```javascript
console.log(Object.is("10", 10)); //false
console.log(Object.is(1, true)); //false
console.log(Object.is(+0, -0)); //false
console.log(Object.is(NaN, NaN)); //true
console.log(Object.is(null, undefined)); //false
```

总的来说，建议在比较值的相等性时优先使用三等号`===`，因为它更加严格和可靠。而 `Object.is()` 则可以用于特殊情况下的比较，如判断 NaN 或 +0/-0。双等号`==`则应该避免使用，因为它的类型转换规则容易引起混淆和错误。



