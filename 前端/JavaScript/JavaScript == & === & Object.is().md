[toc]

# JavaScript == & === & Object.is()

### == 相等运算符

`==`相等运算符，会先进行类型转换，将2个操作数转为相同的类型，再比较2个值。

```js
console.log("10" == 10); //true
console.log(1 == true); //true
console.log(+0 == -0); //true
console.log(NaN == NaN); //false
```



### === 全等运算符

`===`全等运算符，不会类型转换，只有当两个值的类型和值都相同时才会返回 true。

```javascript
console.log("10" === 10); //false
console.log(1 === true); //false
console.log(+0 === -0); //true
console.log(NaN === NaN); //false
```



### Object.is() 值比较

`Object.is()` 是 ES6新增的方法，用于比较两个值是否严格相等（即在所有情况下都返回相同的布尔值），与`===`类似，但有一些特殊情况下的行为不同。

```javascript
console.log(Object.is("10", 10)); //false
console.log(Object.is(1, true)); //false
console.log(Object.is(+0, -0)); //false
console.log(Object.is(NaN, NaN)); //true
```

总的来说，建议在比较值的相等性时优先使用三等号`===`，因为它更加严格和可靠。而 `Object.is()` 则可以用于特殊情况下的比较，如判断 NaN 或 +0/-0。双等号`==`则应该避免使用，因为它的类型转换规则容易引起混淆和错误。

