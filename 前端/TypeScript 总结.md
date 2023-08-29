[toc]

# TypeScript 总结

## 概述

TypeScript 是一种基于 JavaScript 构建的强类型编程语言，可为你提供任何规模的更好工具。

[官方文档](https://www.typescriptlang.org/)

[中文文档](https://ts.nodejs.cn/)

[TypeScript资料](https://ts.xcatliu.com/)



## 运行ts文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/01d20432a8834f5982b4981a0be00659.png)

### 方式一

一、安卓typescript：

```
npm install -g typescript
```

二、将ts文件编译为js文件：

```
tsc code.ts
```

三、运行js文件：

```
node code.js
```

查看tsc版本：

```
tsc -v
```

使用ES5编译ts代码：

```
tsc -t es5 demo.ts
```

### 方式二

一、安装ts-node：

```
npm install -g typescript ts-node
```

二、运行ts文件：

```
ts-node code.ts
```



## 基础

### 声明变量

```ts
var a = 1;
let b = 2;
const c = 3;
```

### 类型

TypeScript是JavaScript的一个超集，它添加了静态类型和一些其他的特性。

类型：boolean 布尔值、number 数字、string 字符串、array 数组、tuple 元组、enum 元组、any 任意类型、void、null、undefined、never、object。

### 数组

```ts
let arr1: number[] = [1, 2, 3, 4];
let arr2: Array<number> = [1, 2, 3, 4];
let arr3 = [1, 2, 3, 4];
```

### 元组

```ts
let person: [string, number] = ["小明", 18];
console.log(person[0]); //小明
console.log(person[1]); //18
```

### 联合类型

```ts
let union1: string | number;
union1 = 2;
union1 = "hello";
```

#### 取值限制

```ts
let union2: 10 | 20 | 30;
// union2 = 1; //报错
union2 = 10;
```

### 枚举类型

```ts
enum Color {
  red,
  green,
  blue,
}
let color = Color.red;
console.log(color); //0
```

**自定义值：**

```ts
enum Sports {
  football = "足球",
  basketball = "篮球",
  pingpong = "乒乓球",
}
let s = Sports.football;
console.log(s); //足球
```

### any & unknown

- any：任意类型，没有类型检查。
- unknown：未知类型，会进行类型检查。

```ts
let a: any;
a = 123;
a = "abc";
a.eat(); //不会提示报错
```

```ts
let a: unknown;
a = 123;
a = "abc";
a.eat(); //提示报错
```

### void & undefined

- void：表示没有返回值，主要用于函数。
- undefined：表示值未定义。

```ts
function fun1(): void {
    
}
console.log(fun1()); //undefined
```

```ts
function fun2(): undefined {
  let a;
  return a;
}
console.log(fun2()); //undefined
```

### 类型适配

类型适配：也称为类型断言，将某个值强转为指定类型。

**无类型适配：**

```ts
let msg: any;
msg = "hello";
let result = msg.endsWith("o");
console.log(result); //true
```

说明：调用`endsWidth`方法时没有提示。

**适配方式一：**

```ts
let msg: any;
msg = "hello";
let result = (<string>msg).endsWith("o");
```

说明：通过`<string>`将any转为string类型，调用`endsWidth`方式有提示。

**适配方式二：**


```ts
let msg: any;
msg = "hello";
let result = (msg as string).endsWith("o");
```

说明：通过`as string`将any转为string类型。



## 面向对象

### 函数

#### 普通函数

```ts
function fun(msg: string) {
  console.log(msg);
}
```

#### 箭头函数

```ts
let fun = (msg: string) => console.log(msg);
```

#### 可选参数

```ts
let fun = (msg: string, code?: number) => console.log(msg);
```

#### 默认参数

```ts
let fun = (msg: string, code: number = 0) => console.log(msg, code);
```

### 对象

#### 创建对象

```ts
const user = {
  name: "小明",
  age: 18,
  address: "北京市",
};
console.log(user.name);
// console.log(user.nickname); //提示报错
```

#### 对象的类型限制

```ts
let user: { name: string; age: number; address: string };
user = {
  name: "小明",
  age: 18,
  address: "北京市",
};
console.log(user.name);
```

### 类和接口

```ts
interface IPoint {
  x: number;
  y: number;
}
const drawPoint = (point: IPoint) => {
  console.log({ x: point.x, y: point.y });
};
drawPoint({ x: 100, y: 200 });
// drawPoint({ x: "abc", y: true }); //提示报错
```

```ts
interface IPoint {
  x: number;
  y: number;
  drawPoint: () => void;
}
class Point implements IPoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  drawPoint() {
    console.log({ x: this.x, y: this.y });
  }
}
let p = new Point(2, 3);
p.drawPoint();
```

### 泛型

#### 简单使用

```ts
// 普通泛型函数
function lastInArray<T>(arr: T[]) {
  return arr[arr.length - 1];
}
console.log(lastInArray(["a", "b", "c", "d"])); //d
```

```ts
// 箭头泛型函数
const lastInArray = <T>(arr: T[]) => arr[arr.length - 1];
```

```ts
// 联合类型
console.log(lastInArray<string | number>(["a", "b", "c", 1])); //d
```

#### 多个泛型

```ts
let makeArray = <T, Y>(x: T, y: Y) => [x, y];
let result = makeArray("a", true);
console.log(result); //[ 'a', true ]
```

#### 默认泛型类型

```ts
let makeArray = <T, Y = number>(x: T, y: Y) => [x, y];
let result = makeArray<string>("a", 1);
console.log(result); //[ 'a', 1 ]
```



## 进阶

### 类型守卫

在 TypeScript 中，类型守卫是一种表达式，它在编译时期检查某个变量的类型，以确保在某个特定的代码块中，该变量的类型是已知的。这对于避免类型错误非常有用，因为它可以确保你在处理变量时，变量的类型是你期望的那种类型。

```ts
type Square = {
  size: number;
};
type Rectangle = {
  width: number;
  height: number;
};
type Shape = Square | Rectangle;

function area(shape: Shape) {
  if ("size" in shape) {
    return shape.size * shape.size;
  } else if ("width" in shape) {
    return shape.width * shape.height;
  }
}

let shape = { size: 20 };
console.log(area(shape)); //400
let shape2 = { width: 20, height: 30 };
console.log(area(shape2)); //600
```

#### 自定义类型守卫

需要借助is表达式。

```ts
type Square = {
  size: number;
};
type Rectangle = {
  width: number;
  height: number;
};
type Shape = Square | Rectangle;

function isSquare(shape: Shape): shape is Square {
  return "size" in shape;
}
function isRectangle(shape: Shape): shape is Rectangle {
  return "width" in shape;
}

function area(shape: Shape) {
  if (isSquare(shape)) {
    return shape.size * shape.size;
  } else if (isRectangle(shape)) {
    return shape.width * shape.height;
  }
}

let shape = { size: 20 };
console.log(area(shape)); //400
let shape2 = { width: 20, height: 30 };
console.log(area(shape2)); //600

```

### 函数重载

在TypeScript中，函数重载是指在一个函数名下定义多个函数签名，每个函数签名对应不同的参数类型和返回值类型。通过函数重载，我们可以根据不同的参数类型和返回值类型来实现不同的函数行为。

```ts
function reverse(string: string): string;
function reverse(array: string[]): string[];
function reverse(stringOrArray: string | string[]) {
  if (typeof stringOrArray == "string") {
    return stringOrArray.split("").reverse().join("");
  } else {
    return stringOrArray.slice().reverse();
  }
}

console.log(reverse("hello")); //olleh
console.log(reverse(["h", "e", "l", "l", "o"])); //[ 'o', 'l', 'l', 'e', 'h' ]
```

```ts
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(timestampOrYear: number, month?: number, day?: number) {
  if (month != null && day != null) {
    return new Date(timestampOrYear, month - 1, day);
  } else {
    return new Date(timestampOrYear);
  }
}

console.log(makeDate(1688368612562));
console.log(makeDate(2008, 9, 10));
```

### 调用签名

TypeScript调用签名是指在TypeScript中定义函数或方法时，指定函数的参数类型和返回值类型。通过调用签名，我们可以明确指定函数的输入和输出类型，以提高代码的可读性和可维护性。

```ts
type Add = (a: number, b: number) => number;

const add: Add = (a: number, b: number) => {
  return a + b;
};
console.log(add(2, 3)); //5
```

#### 实现函数重载

```ts
type Add = {
  (a: number, b: number): number;
  (a: number, b: number, c: number): number;
};
const add: Add = (a: number, b: number, c?: number) => {
  return a + b + (c != null ? c : 0);
};

console.log(add(1, 2)); //3
console.log(add(1, 2, 3)); //6
```

#### 实现constructor重载

```ts
type Point = {
  new (x: number, y: number): { x: number; y: number };
  new (x: number, y: number, z: number): { x: number; y: number };
};
const point: Point = class {
  constructor(public x: number, public y: number, public c?: number) {}
};

const p1 = new point(2, 3);
const p2 = new point(2, 3, 4);
console.log(p1); //{ x: 2, y: 3, c: undefined }
console.log(p2); //{ x: 2, y: 3, c: 4 }
```

### 索引签名

```ts
type Person = {
  name: string;
  age: number;
};
type PersonDictionary = {
  [username: string]: Person;
};
const persons: PersonDictionary = {
  aaa: {
    name: "小明",
    age: 18,
  },
  bbb: {
    name: "小红",
    age: 28,
  },
};

console.log(persons["aaa"]); //{ name: '小明', age: 18 }
console.log(persons["bbb"]); //{ name: '小红', age: 28 }

// 添加数据
persons["ccc"] = {
  name: "小白",
  age: 38,
};
```

### readonly 和 Readonly

- readonly：是关键字，表示只读变量。
- Readonly：是类型，表示只读类型。

#### readonly

```ts
function reverseSorted(input: readonly number[]): number[] {
  return [...input].sort().reverse();
}

console.log(reverseSorted([1, 2, 3, 4])); //[ 4, 3, 2, 1 ]
```

```ts
type MyReadOnly = {
  readonly [key in "x" | "y" | "z"]: number;
};
const p: MyReadOnly = {
  x: 10,
  y: 20,
  z: 30,
};
// p.x = 100; //提示报错
console.log(p); //{ x: 10, y: 20, z: 30 }
```

#### Readonly

```ts
type Person = {
  name: string;
  age: number;
};
const p: Readonly<Person> = {
  name: "小明",
  age: 18,
};
// p.name = "小白"; //提示报错
```

### 双重断言

```ts
type Point2D = { x: number; y: number };
type Point3D = { x: number; y: number; z: number };
type Person = { name: string; address: string };

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };
let person: Person = { name: "小明", address: "北京" };

// point2D = point3D; //可以转换
// point3D = point2D; //提示报错
// point3D = point2D as Point3D; //类型断言
point3D = person as any as Point3D; //双重断言
```

### 常量断言

```ts
const person = {
  name: "小明",
  age: 18,
} as const;
// obj = {}; //提示报错
// obj.name = "abc"; //条报报错
```

### this类型检查

```ts
function double(this: { value: number }) {
  this.value = this.value * 2;
}
const num = {
  value: 10,
  double,
};
num.double();
console.log(num.value); //20
```

### typeof提取类型

```ts
const person = {
  name: "小明",
  age: 18,
  sex: true,
};
type Person = typeof person;
const p1: Person = {
  name: "小白",
  age: 28,
  sex: false,
};
console.log(p1); //{ name: '小白', age: 28, sex: false }
```

### keyof提取联合类型

```ts
type Person = {
  name: string;
  age: number;
  sex: boolean;
};
type PersonKey = keyof Person;
function getValueByKey(obj: Person, key: PersonKey) {
  return obj[key];
}
let p: Person = {
  name: "小明",
  age: 18,
  sex: false,
};
let age = getValueByKey(p, "age");
console.log(age); //18
```

