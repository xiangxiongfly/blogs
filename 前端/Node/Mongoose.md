[toc]

# Mongoose

## 概述

Mongoose 是一个对象文档模型库，方便使用代码操作 mongodb 数据库。

官网： **http://www.mongoosejs.net/**



## 安装Mongoose

```
npm install mongoose
```



## 连接数据库

```javascript
// 导入mongoose包
const mongoose = require("mongoose");

// 严格查询模式
mongoose.set("strictQuery", true);

// 连接mongodb服务
mongoose.connect("mongodb://127.0.0.1:27017/test_db");

// 连接成功回调
// once表示回调函数只会执行一次，这里也可以使用on
mongoose.connection.once("open", () => {
  console.log("连接成功");
});

// 连接失败回调
mongoose.connection.on("error", () => {
  console.log("连接失败");
});

// 连接关闭回调
mongoose.connection.on("close", () => {
  console.log("连接关闭");
});

// setTimeout(() => {
//   // 关闭连接
//   mongoose.disconnect();
// }, 2000);
```



## 创建文档结构

```javascript
// 导入mongoose
const mongoose = require("mongoose");

// 严格查询模式
mongoose.set("strictQuery", true);

// 连接mongodb服务
mongoose.connect("mongodb://127.0.0.1:27017/test_db");

// 连接成功回调
// once表示回调函数只会执行一次，这里也可以使用on
mongoose.connection.once("open", () => {
  console.log("连接成功");
  // 创建文档结构对象
  let BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
  });
  // 创建文档模型对象
  let BookModel = mongoose.model("books", BookSchema);
    
  // 插入文档
  BookModel.create(
    {
      title: "西游记",
      author: "吴承恩",
      price: 19.9,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }
  );
});

// 连接失败回调
mongoose.connection.on("error", () => {
  console.log("连接失败");
});

// 连接关闭回调
mongoose.connection.on("close", () => {
  console.log("连接关闭");
});
```

### 字段类型

文档结构可选的常用字段类型列表。

| 类型       | 说明                                                       |
| ---------- | ---------------------------------------------------------- |
| String     | 字符串                                                     |
| Number     | 数字                                                       |
| Boolean    | 布尔值                                                     |
| Array      | 数组，可以用`[]`表示                                       |
| Date       | 日期                                                       |
| Buffer     | Buffer对象                                                 |
| Mixed      | 任意类型，需要使用`mongoose.Schema.Types.Mixed`指定        |
| ObjectId   | 对象id，需要使用`mongoose.Schema.Types.ObjectId`指定       |
| Decimal128 | 高精度数字，需要使用`mongoose.Schema.Types.Decimal128`指定 |

### 字段验证

Mongoose 有一些内建验证器，可以对字段值进行验证。

```javascript
// 导入mongoose
const mongoose = require("mongoose");

// 严格查询模式
mongoose.set("strictQuery", true);

// 连接mongodb服务
mongoose.connect("mongodb://127.0.0.1:27017/test_db");

// 连接成功回调
// once表示回调函数只会执行一次，这里也可以使用on
mongoose.connection.once("open", () => {
  console.log("连接成功");
  // 创建文档结构对象
  let BookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true, //设置必填项
    },
    username: {
      type: String,
      unique: true, //设置唯一值
    },
    author: {
      type: String,
      default: "未命名", //设置默认值
    },
    gender: {
      type: String,
      enum: ["男", "女"], //设置枚举值
    },
    price: Number,
  });
  // 创建文档模型对象
  let BookModel = mongoose.model("books", BookSchema);
  // 插入文档
  BookModel.create(
    {
      title: "西游记",
      username: "小明",
      author: "吴承恩",
      gender: "男",
      price: 19.9,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }
  );
});

// 连接失败回调
mongoose.connection.on("error", () => {
  console.log("连接失败");
});

// 连接关闭回调
mongoose.connection.on("close", () => {
  console.log("连接关闭");
});
```



## 增删改查

### 插入一条

```javascript
BookModel.create(
  {
    title: "西游记2",
    username: "小明2",
    author: "吴承恩2",
    gender: "女",
    price: 19.9,
  },
  (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  }
);
```

### 插入多条

```javascript
BookModel.insertMany(
  [
    {
      title: "西游记3",
      username: "小明3",
      author: "吴承恩3",
      gender: "女",
      price: 19.9,
    },
    {
      title: "西游记4",
      username: "小明4",
      author: "吴承恩4",
      gender: "女",
      price: 19.9,
    },
  ],
  (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  }
);
```

### 删除一条

```javascript
BookModel.deleteOne({ title: "西游记1" }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("删除成功");
});
```

### 删除多条

```javascript
BookModel.deleteMany({ gender: "女" }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("删除成功");
});
```

### 更新一条

```javascript
BookModel.updateOne({ author: "吴承恩" }, { author: "吴承恩2" }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("更新成功");
});
```

### 更新多条

```javascript
BookModel.updateMany({ author: "吴承恩2" }, { author: "吴承恩" }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("更新成功");
});
```

### 查询一条

```javascript
BookModel.findById("643cf1abb04ee1849e937759", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```

```javascript
BookModel.findOne({ title: "西游记" }, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```

### 查询多条

```javascript
BookModel.find((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```

```javascript
BookModel.find({ gender: "女" }, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```



## 条件控制

在mongodb中不能使用一些运算符，因此需要使用替代符号：

| 运算符 | 替代符号 |
| ------ | -------- |
| >      | $gt      |
| <      | $lt      |
| `>=`   | $get     |
| `<=`   | $lte     |
| `!==`  | $ne      |
| 逻辑或 | $or      |
| 逻辑与 | $and     |

```
db.students.find({age:{$gt:30}});
```

```
db.students.find({$or:[{age:18},{age:24}]});
```

```
db.students.find({$and: [{age: {$lt:20}}, {age: {$gt: 15}}]});
```

```
// 正则表示
db.students.find({name:/imissyou/});
```



## 个性化读取

### 字段筛选

0表示不要的字段，1表示需要的字段。

```
BookModel.find()
  .select({ _id: 0, username: 1, title: 1 })
  .exec((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  });
```

说明：只会输出username和title字段的数据。

### 数据排序

可以使用`sort`排序，1表示升序，-1表示倒序。

```javascript
BookModel.find()
  .sort({ author: 1 })
  .exec((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  });
```

### 数据截取

`skip`跳过。

`limit`限制。

```javascript
BookModel.find()
  .skip(2)
  .limit(2)
  .exec((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  });
```



## 模块化

![在这里插入图片描述](https://img-blog.csdnimg.cn/77eaa12fc36f40d19c31e6fced7089e3.png)

**config/config.js**

```javascript
module.exports = {
  DB_HOST: "127.0.0.1",
  DB_PORT: 27017,
  DB_NAME: "mydb",
};
```

**db/db.js**

```javascript
const { DB_HOST, DB_PORT, DB_NAME } = require("../config/config.js");
const mongoose = require("mongoose");

module.exports = function (
  success,
  error = () => {
    console.log("连接失败");
  }
) {
  // 设置 strictQuery 为 true
  mongoose.set("strictQuery", true);
  // 连接服务
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  // 连接成功回调
  mongoose.connection.once("open", () => {
    success();
  });
  // 连接失败回调
  mongoose.connection.once("error", () => {
    error();
  });
  // 连接关闭回调
  mongoose.connection.once("close", () => {
    console.log("连接关闭");
  });
};
```

**models/BookModel.js**

```javascript
const mongoose = require("mongoose");
// 文档结构对象
let BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
});
// 文档模型对象
let BookModel = mongoose.model("books", BookSchema);
// 暴露
module.exports = BookModel;
```

**index.js**

```javascript
const db = require("./db/db.js");
const BookModel = require("./models/BookModel.js");

db(() => {
  BookModel.create(
    {
      name: "西游记",
      author: "小明",
      price: 18.8,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }
  );
});
```



##  图形化管理工具

### Robo 3T 

我们可以使用图形化的管理工具来对 Mongodb 进行交互，这里演示两个图形化工具

Robo 3T 免费 **https://github.com/Studio3T/robomongo/releases**