[toc]

# JavaScript 逻辑或(||) 和 逻辑与(&&)

### 特点

- `||`（逻辑或）：当两个操作数都为false时返回false，否则返回true。如果第一个操作数为true，则不会执行第二个操作数。

- `&&`（逻辑与）：当两个操作数都为true时返回true，否则返回false。如果第一个操作数为false，则不会执行第二个操作数。



### 使用

```javascript
console.log(1 || 2); //1
```

说明：左边的操作数为true，逻辑或操作不再执行后面的代码，所以最终返回1。



```javascript
console.log(0 || 2); //2
```

说明：左边的操作数为false，逻辑或会继续执行右边的操作数，所以最终返回2。



```javascript
console.log(1 && 2); //2
```

说明：左边的操作数为true，逻辑与会继续执行右边的操作数，所以最终返回2。



```javascript
console.log(0 && 2); //0
```

说明：左边的操作数为false，逻辑与不再执行，所以最终返回0。