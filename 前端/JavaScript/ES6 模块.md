[TOC]

# ES6 模块

## 概述

ES6提供了模块化的设计，可以将具有某一类特定功能的代码放在一个文件里，在使用时，只需要引入特定的文件，便可以降低文件之间的耦合性。

相比于早期制定的CommonJS规范，ES6的模块化设计有3点不同：

- CommonJS在运行时完成模块的加载，而ES6模块是在编译时完成模块的加载，效率要更高。
- CommonJS模块是对象，而ES6模块可以是任何数据类型，通过export命令指定输出的内容，并通过import命令引入即可。
- CommonJS模块会在require加载时完成执行，而ES6的模块是动态引用，只在执行时获取模块中的值。

ES6模块核心的内容在于export命令和import命令的使用，两者相辅相成，共同为模块化服务。



## export命令

export命令用于定义模块对外输出的内容，任何你想通过外部文件进行访问的内容，只需要通过export关键字就可以完成。

### 简单使用

```javascript
let obj = {};
function fn() {}

export let a=1;
export {obj};
export {fn};
```

### 设置别名

相同变量名只能够export一次.

```javascript
const _name = "小明";
export {_name as name};
export {_name as name2};
```

### 尽量统一export

```javascript
const name = "小明";
const age = 18;
const sayHello = function() {
    console.log("hello");
};
export {name,age,sayHello};
```



## import命令

一个模块中使用export命令导出的内容，通过import命令可以引到另一个模块中，两者可以相互配合使用。

**特性：**

- import命令只会执行一次。
- 相同变量名的值只能import一次。
- import命令具有提升的效果。
- import的值本身是只读的，不可修改。

### 在HTML中使用

在HTML页面种使用import命令，需要在script标签上使用`type="module"`。

```javascript
//module.js
const _name = "小明";
const _age = 18;
const sayHello = function() {
	console.log("hello");
};

export {
	_name as name, _age as age, sayHello
};
```

```html
//使用import
<script type="module">
    import {
        name,
        age,
        sayHello
    } from "./js/module1.js";

    console.log(name, age); //小明 18
    sayHello(); //hello
</script>
```

### 使用别名

```html
<script type="module">
    import {
        name as personName,
        age as personAge,
        sayHello
    } from "./js/module1.js";

    console.log(personName, personAge); //小明 18
</script>
```

### 整体加载

当我们需要加载整个模块的内容时，可以使用星号（*）并配合as关键字指定一个对象，通过对象去访问各个输出值。

```html
<script type="module">
    import * as person from "./js/module1.js";
    console.log(person.name, person.age); //小明 18
    person.sayHello(); //hello
</script>
```



## export default命令

使用import引入的变量名需要和export导出的变量名一样。在某些情况下，我们希望不设置变量名也能供import使用，import的变量名由使用方自定义，这时就要使用到export default命令了。

**特性：**

- 一个文件只有一个export default语句。
- import的内容不需要使用大括号括起来。因为默认输出只能使用一次，本质就是输出一个叫default的变量或方法，系统允许你任意取名字。

```javascript
//module1.js
const user = {
	name: "小明",
	age: 18,
	sayHello: function() {
		console.log("hello");
	}
};
export default user;
```

```html
<script type="module">
    import user from "./js/module1.js";
    console.log(user.name, user.age); //小明 18
    user.sayHello(); //hello
</script>
```



## export和export default混合使用

```javascript
//module1.js
const user = {
	name: "小明",
	age: 18,
	sayHello: function() {
		console.log("hello");
	}
}

let name = "小白";
let age = 10;
function sayHello() {
	console.log("hello 小白");
}

export default user;
export {name,age,sayHello};
```

```html
<script type="module">
    import user, {name,age,sayHello} from "./js/module1.js";
    console.log(user.name, user.age); //小明 18
    user.sayHello(); //hello
    console.log(name, age); //小白 10
    sayHello(); //hello 小白
</script>
```



## export和import复合使用

export命令和import命令复合使用表示先输入再输出，导致当前模块不能直接使用变量或方法

```javascript
//module1.js
const user = {
	name: "小明",
	age: 18,
	sayHello: function() {
		console.log("hello 小明");
	}
}

let name = "小白";
let age = 10;
function sayHello() {
	console.log("hello 小白");
}

export default user;
export {name,age,sayHello};
```

```javascript
//module2.js
import user, {
    name,
    age,
    sayHello
} from "./module1.js";
export default user;
export {name,age,sayHello};
```

```HTML
<script type="module">
    import user, {
        name,
        age,
        sayHello
    } from "./js/module2.js";
    console.log(user.name, user.age); //小明 18
    user.sayHello(); //hello
    console.log(name, age); //小白 10
    sayHello(); //hello 小白
</script>
```

module2.js可简写为：

```javascript
//module2.js
export {default,name,age,sayHello} from "./module1.js";
```



## 模块的继承

```javascript
//base.js

let name = "Tom";
let age = 28;
let address = "beijing";

export { name, age, address }
```

```javascript
//children.js

export * from "./base.js"
export function sayHello() {
    console.log("sayHello");
};
```

```html
<script type="module">
    import * as myobj from "./js/children.js";

    console.log(myobj.name, myobj.age, myobj.address);
    myobj.sayHello();
</script>

//Tom 18 beijing
//sayHello
```



## module加载的本质

ES6模块的运行机制是这样的：当遇到import命令时，不会立马去执行模块，而是生成一个动态的模块只读引用，等到需要用到时，才去解析引用对应的值。

由于ES6的模块获取的是实时值，就不存在变量的缓存。

**实施性体现**

```javascript
//export1.js
export let count = 1;
export function add() {
	count++;
}
```

```html
<img id="myImg">
<script type="module">
    import {count,add} from "./js/export1.js";
    console.log(count); //1
    add();
    add();
    console.log(count); //3
</script>
```

