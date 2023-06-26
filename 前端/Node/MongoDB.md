[toc]

# MongoDB 

## 概述

MongoDB 是一个基于分布式文件存储的数据库。

官方地址：https://www.mongodb.com/



## 基本概念

- 数据库（database）：数据库是一个数据仓库，数据库服务下可以创建很多数据库，数据库中考有存放很多集合。
- 集合（collection）：集合类似于JS中的数组，在集合中可以存放很多文档。
- 文档（document）：文档是数据库中的最小单位，类似于JS中的对象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/acbddef7ad44431a9f2a646528c49a5a.png)



## MongoDB服务

### 查看版本

```
mongo -version
```

### 启动服务

```
mongod
```

### 连接服务

```
mongo
```



## 数据类型

- String
  - 字符串。存储数据常用的数据类型- 。在 MongoDB 中，UTF-8 - 编码的字符串才是合法的。
- Integer
  - 整型数值。用于存储数值。根据你- 所采用的服务器，可分为 32 位或 64 位。
- Boolean
  - 布尔值。用于存储布尔值（真/假- ）。
- Double
  - 双精度浮点值。用于存储浮点值。
- Min/Max keys
  - 将一个值与 BSON（二进制的 - JSON）元素的最低值和最高值相对比。
- Array
  - 用于将数组或列表或多个值存储为一- 个键。
- Timestamp
  - 时间戳。记录文档修改或添加的具体时间。
- Object
  - 用于内嵌文档。
- Null
  - 用于创建空值。
- Symbol
  - 符号。该数据类型基本上等同于字- 符串类型，但不同的是，它一般用于采用特殊- 符号类型的语言。
- Date
  - 日期时间。用 UNIX - 时间格式来存储当前日期或时间。你可以指定- 自己的日期时间：创建 Date - 对象，传入年月日信息。
- Object ID
  - 对象 ID。用于创建文档的 ID。
- Binary Data
  - 二进制数据。用于存储二进制数据。
- Code
  - 代码类型。用于在文档中存储JavaScript 代码。
- Regular expression
  - 正则表达式类型。用于存储正则



## 命令行交互

### 数据库命令

| 命令              | 说明                                   |
| ----------------- | -------------------------------------- |
| show dbs          | 查看所有数据库                         |
| use "数据库名"    | 切换数据库，如果数据库不存在则自动创建 |
| db                | 显示当前所在数据库                     |
| db.dorpDatabase() | 删除当前数据库，需要先切换             |

```
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
test    0.000GB
```

```
> use test
switched to db test
> db
test
```

```
> db.dropDatabase()
{ "ok" : 1 }
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

### 集合命令

| 命令                                     | 说明         |
| ---------------------------------------- | ------------ |
| show collections                         | 显示所有集合 |
| db.createCollection("集合名")            | 创建集合     |
| db."集合名".drop()                       | 删除集合     |
| db."集合名".renameCollection("新集合名") | 重命名       |

```
> db.createCollection("users")
{ "ok" : 1 }
> db.createCollection("books")
{ "ok" : 1 }
> show collections
books
users
```

```
> db.books.renameCollection("shuji")
{ "ok" : 1 }
> show collections
shuji
users
```

```
> db.shuji.drop()
true
> show collections
users
```

### 文档命令

| 命令                                                         | 说明     |
| ------------------------------------------------------------ | -------- |
| db."集合名".insert(“文档对象”)                               | 插入文档 |
| db."集合名".find("查询条件")                                 | 查询文档 |
| db."集合名".update(查询条件, 新的文档)<br />db."集合名".update({name:"小明"}, {$set:{age:18}}) | 更新文档 |
| db."集合名".remove(查询条件)                                 | 删除文档 |


插入文档：
```
> db.users.insert({name:"小明",age:18})
WriteResult({ "nInserted" : 1 })
> db.users.find()                    })
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 18 }
```

插入多条文档：
```
> db.users.insert([{name:"小花",age:18},{name:"小白",age:19},{name:"小黑",age:20}])
BulkWriteResult({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 3,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
})
> db.users.find()
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bc"), "name" : "小白", "age" : 19 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑", "age" : 20 }
```

全部更新：
```
> db.users.update({name:"小黑"},{name:"小黑2"})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.users.find()
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bc"), "name" : "小白", "age" : 19 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2" }
```

局部更新：
```
> db.users.update({name:"小白"},{$set:{name:"小白2"}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.users.find()
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bc"), "name" : "小白2", "age" : 19 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2" }
```

更新多条文档：

```
> db.users.update({name:"小明"},{$set:{age:30}},{multi:true})
WriteResult({ "nMatched" : 2, "nUpserted" : 0, "nModified" : 2 })
> db.users.find()
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 30 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 19 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2", "age" : "20" }
{ "_id" : ObjectId("643cc1d3ed65e45584ea427b"), "name" : "小明", "age" : 30 }
```

删除文档：

```
> db.users.remove({name:"小白2"})
WriteResult({ "nRemoved" : 1 })
> db.users.find()  
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2" }
```

查询全部：

```
> db.users.find()
```

查询第一个：

```
> db.users.findOne()
```

条件查询：

```
> db.users.find({name:"小明"})
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 30 }
{ "_id" : ObjectId("643cc1d3ed65e45584ea427b"), "name" : "小明", "age" : 30 }
```

大于查询：

```
> db.users.find({age:{$gt:18}})
```

大于等于查询：

```
> db.users.find({age:{$gte:18}})
```

小于查询：

```
> db.users.find({age:{$lt:18}})
```

小于等于查询：

```
> db.users.find({age:{$lte:18}})
```

and查询：

```
> db.users.find({age:30,sex:0})
```

or查询：

```
> db.users.find({$or:[{age:30},{sex:0}]})
```

limit获取3条数据：

```
> db.users.find().limit(3)
```

skip：

```
> db.users.find().skip(3).limit(3)
```

order排序：

1表示升序，-1表示降序。

```
> db.users.find().sort({age:1})
{ "_id" : ObjectId("643cc1d3ed65e45584ea427b"), "name" : "小明", "age" : 17 }
{ "_id" : ObjectId("643cc2c9ed65e45584ea427c"), "name" : "张三", "age" : 18 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 19, "sex" : 0 }
{ "_id" : ObjectId("643cc2d1ed65e45584ea427d"), "name" : "李四", "age" : 19 }
{ "_id" : ObjectId("643cc2daed65e45584ea427e"), "name" : "王五", "age" : 20 }
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 30, "sex" : 0 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2", "age" : "20", "sex" : 1 }
```

```
> db.users.find().sort({age:-1})
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bd"), "name" : "小黑2", "age" : "20", "sex" : 1 }
{ "_id" : ObjectId("643cbc53793a9b6222f48215"), "name" : "小明", "age" : 30, "sex" : 0 }
{ "_id" : ObjectId("643cc2daed65e45584ea427e"), "name" : "王五", "age" : 20 }
{ "_id" : ObjectId("643cbcf42a5514c1e9be48bb"), "name" : "小花", "age" : 19, "sex" : 0 }
{ "_id" : ObjectId("643cc2d1ed65e45584ea427d"), "name" : "李四", "age" : 19 }
{ "_id" : ObjectId("643cc2c9ed65e45584ea427c"), "name" : "张三", "age" : 18 }
{ "_id" : ObjectId("643cc1d3ed65e45584ea427b"), "name" : "小明", "age" : 17 }
```

