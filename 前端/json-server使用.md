[toc]

# json-server使用

## 简介

[github地址](https://github.com/typicode/json-server)

### 安装json-server

```
npm install -g json-server
```

### 启动json-server

```
json-server --watch db.json
```



## 配置

常用选项列表：

配置项	简写	描述
–help	-h	查看所有命令选项
–watch	-w	是否监视文件自动刷新数据
–host	-H	设置域，默认为localhost
–port	-p	设置端口号，默认为3000
–routes	-r	指定路由文件
–static	-s	设置静态资源目录
–config	-c	指定配置文件，默认为“json-serer.json
–version	-v	查看json-server版本号
–middlewares	-m	指定中间件文件
–no-gzip	-ng	不能压缩
–delay	-d	设置延迟响应
–id	-i	设置数据项/库的id属性，默认为id

如：

```
启动时修改端口号：
json-server --watch db.json --port 5001
```



## 操作

### 创建数据库

1. 先创建一个server文件夹，并在里面创建db.json文件，在db.json文件中写入以下数据：

```
{
  "users": [
    {
      "id": 1,
      "name": "a",
      "age": 18
    }
  ],
  "comments": [
    {
      "id": 1,
      "content": "hello",
      "userId": 1
    }
  ]
}
```

2. 启动服务，执行命令：

```
json-server --watch db.json --port 5001
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/288c3d2bbb01459aaef29fc9bc48fbce.png)

创建了首页和三个接口。



### 查询数据

#### 查询所有数据

调用接口：

```
http://localhost:5001/users
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/340b0e5dd35b4f1b9f354fb1c22c2e2c.png)

#### 通过id查询

调用接口：

```
http://localhost:5001/users/1
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3e009c11f17a4af1bed26ffc25f4bc04.png)

调用接口：

```
http://localhost:5001/users?id=2
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2e08d4f1192848ecb1f4f4f0e0b2f2be.png)



### 增加数据

调用接口：

id为自增长，不用提交。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1ede03442b5f418796d472d19e8dda8f.png)



### 删除数据

#### 通过id删除

调用接口：

```
http://localhost:5001/users/1
```

表示删除id为1的数据。



### 修改数据

修改数据分2种：

- put：覆盖数据
- patch：补丁修改

#### put

调用接口：



![在这里插入图片描述](https://img-blog.csdnimg.cn/05d06abe06d046af9fd69e6db675d01b.png)



#### patch

调用接口：

![在这里插入图片描述](https://img-blog.csdnimg.cn/10b241b7bc8a48abad0d237d1a93d5bc.png)



## 高级查询

### 条件查询

调用接口：

```
http://localhost:5001/users?name=小明
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/050d301b179b4d0cbc75e34e660ad56f.png)

调用接口：

```
http://localhost:5001/users?name=小明&age=23
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d94b4f42693d4c2284f27ac6e48aef51.png)

调用接口：

```
http://localhost:5001/users?name=小明&name=小花
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b50851299a774a52a348b68b7e750c34.png)



### 分页查询

- `_page`：设置页码。
- `_limit`：页面数量。

调用接口：

```
http://localhost:5001/users?_page=3&_limit=3
// 调用第3页，每页获取3条数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d68cac6157d4a27b9ee838aa0d76353.png)



### 排序查询

- `_sort`：排序的字段名。
- `_order`：排序规则。
  - `asc`：升序。
  - `desc`：降序。

调用接口：

```
http://localhost:5001/users?_sort=age&_order=desc
// 通过age字段降序排列
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9932a0c8e4364a00b532bff4e68c8967.png)



### 切片查询

- `_start`：开始位置，下标从0开始。
- `_end`：结束位置。
- `_limit`：片段长度。

调用接口：

```
http://localhost:5001/users?_start=3&_end=5
// 获取从下标3到下标5的数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/35e33e74cb354b9ea0780499c34c6f38.png)

调用接口：

```
http://localhost:5001/users?_start=3&_limit=5
// 获取从下标3开始的5条数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c00110d6dc744b53b9f779790adf113e.png)



### 范围查询

- `_gte`：大于等于。
- `_lte`：小于等于。
- `_ne`：不等于。

调用接口：

```
http://localhost:5001/users?id_gte=10
// 获取id大于等于10的所有数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/38087850569d43e08d8bb61bc887423a.png)

调用接口：

```
http://localhost:5001/users?id_lte=5
// 获取id小于等于5的所有数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e89d1d31f70a4c8a8b1bbc08f8353fc2.png)

调用接口：

```
http://localhost:5001/users?id_ne=2
// 获取id不为2的所有数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/581d80fcd514424f9edaf6d4d2c745eb.png)



### 模糊查询

- `_like`：模糊查询。

调用接口：

```
http://localhost:5001/users?name_like=花
// 获取name包含花的数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8f945a2896b46bd960d3d96de1e0d36.png)



### 全文查询

- `q`：全文查询。

调用接口：

```
http://localhost:5001/users?q=2
// 查询所有包含2的相关数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fcfbdca23cd44723b68d4ec86d1aab74.png)



### 外键关联查询

调用接口：

```
http://localhost:5001/users/2/comments
// 查询comments中userId为2的数据
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f83840dec4c4700a9a21f483822064b.png)





## 配置静态资源

### 静态资源

在server目录下，新建public文件夹，可以用于存放静态资源。

如果需要存放图片资源，可以在public目录下新建images文件夹，在images目录里放入图片。

这时可以通过`http://localhost:5001/images/a.jpg`访问图片。

![在这里插入图片描述](https://img-blog.csdnimg.cn/67fbfcc66bdd4254b9d8b74bd009a85b.png)



### 首页资源

在public目录下，定义`index.html`，这样可以通过``http://localhost:5001`访问首页。



## [免费api接口](https://juejin.cn/post/7041461420818432030)



