[TOC]

# Flutter SQLite使用

## 概述

保存数据到本地是应用程序非常重要的功能之一，比如如下场景：一个新闻类或者博客类的应用程序，打开后进入首页，如果本地没有保存数据，则需要通过网络获取数据，在返回数据之前，用户看到的是空白页面，而如果本地保存了部分新闻，则显示这部分数据，等待最新的数据返回时在刷新即可，对用户体验来说，明显第二种体验更佳。

**SQLite** 是目前最受欢迎的本地存储框架之一。

文件保存路径：`/data/data/<package_name>/app_flutter`目录下



## 添加依赖

```
dependencies:
  path_provider: ^2.0.11
  sqflite: ^2.0.2+1
```

## 使用SQLite

### 使用单例类

```dart
class DBManager {
    static final DBManager _instance = DBManager._();

    factory DBManager() {
        return _instance;
    }

    DBManager._();
}    
```

### 初始化

```dart
class DBManager {
    /// 数据库名
    final String _dbName = "dbName";

    /// 数据库版本
    final int _version = 1;

    static final DBManager _instance = DBManager._();

    factory DBManager() {
        return _instance;
    }

    DBManager._();

    static Database? _db;

    Future<Database> get db async {
        // if (_db != null) {
        //   return _db;
        // }
        // _db = await _initDB();
        // return _db;
        return _db ??= await _initDB();
    }

    /// 初始化数据库
    Future<Database> _initDB() async {
        Directory directory = await getApplicationDocumentsDirectory();
        String path = join(directory.path, _dbName);
        return await openDatabase(
            path,
            version: _version,
            onCreate: _onCreate,
            onUpgrade: _onUpgrade,
        );
    }

    /// 创建表
    Future _onCreate(Database db, int version) async {
        const String sql = """
    CREATE TABLE Student(
      id INTEGER primary key AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      sex INTEGER
    )
    """;
        return await db.execute(sql);
    }

    /// 更新表
    Future _onUpgrade(Database db, int oldVersion, int newVersion) async {}
}
```

### 增删改查操作

```dart
/// 保存数据
Future saveData(Student student) async {
    Database database = await db;
    return await database.insert("Student", student.toJson());
}

/// 使用SQL保存数据
Future saveDataBySQL(Student student) async {
    const String sql = """
    INSERT INTO Student(name,age,sex) values(?,?,?)
    """;
    Database database = await db;
    return await database.rawInsert(sql, [student.name, student.age, student.sex]);
}

/// 查询全部数据
Future<List<Student>?> findAll() async {
    Database? database = await db;
    List<Map<String, Object?>> result = await database.query("Student");
    if (result.isNotEmpty) {
        return result.map((e) => Student.fromJson(e)).toList();
    } else {
        return [];
    }
}

///条件查询
Future<List<Student>?> find(int sex) async {
    Database database = await db;
    List<Map<String, Object?>> result =
        await database.query("Student", where: "sex=?", whereArgs: [sex]);
    if (result.isNotEmpty) {
        return result.map((e) => Student.fromJson(e)).toList();
    } else {
        return [];
    }
}

/// 修改
Future<int> update(Student student) async {
    Database database = await db;
    student.age = 99;
    int count =
        await database.update("Student", student.toJson(), where: "id=?", whereArgs: [student.id]);
    return count;
}

/// 删除
Future<int> delete(int id) async {
    Database database = await db;
    int count = await database.delete("Student", where: "id=?", whereArgs: [id]);
    return count;
}

/// 删除全部
Future<int> deleteAll() async {
    Database database = await db;
    int count = await database.delete("Student");
    return count;
}
```



## 完整代码如下

![在这里插入图片描述](https://img-blog.csdnimg.cn/c44286b0414c41e2a439b99be70784d8.gif)

![在这里插入图片描述](https://img-blog.csdnimg.cn/16d9c2b09d3d45b4bf7469812abf7008.gif)

![在这里插入图片描述](https://img-blog.csdnimg.cn/72a91c3d4b394737aa5102823da459a5.gif)



### 数据库管理类

```dart
class DBManager {
    /// 数据库名
    final String _dbName = "dbName";

    /// 数据库版本
    final int _version = 1;

    static final DBManager _instance = DBManager._();

    factory DBManager() {
        return _instance;
    }

    DBManager._();

    static Database? _db;

    Future<Database> get db async {
        // if (_db != null) {
        //   return _db;
        // }
        // _db = await _initDB();
        // return _db;
        return _db ??= await _initDB();
    }

    /// 初始化数据库
    Future<Database> _initDB() async {
        Directory directory = await getApplicationDocumentsDirectory();
        String path = join(directory.path, _dbName);
        return await openDatabase(
            path,
            version: _version,
            onCreate: _onCreate,
            onUpgrade: _onUpgrade,
        );
    }

    /// 创建表
    Future _onCreate(Database db, int version) async {
        const String sql = """
    CREATE TABLE Student(
      id INTEGER primary key AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      sex INTEGER
    )
    """;
        return await db.execute(sql);
    }

    /// 更新表
    Future _onUpgrade(Database db, int oldVersion, int newVersion) async {}

    /// 保存数据
    Future saveData(Student student) async {
        Database database = await db;
        return await database.insert("Student", student.toJson());
    }

    /// 使用SQL保存数据
    Future saveDataBySQL(Student student) async {
        const String sql = """
    INSERT INTO Student(name,age,sex) values(?,?,?)
    """;
        Database database = await db;
        return await database.rawInsert(sql, [student.name, student.age, student.sex]);
    }

    /// 查询全部数据
    Future<List<Student>?> findAll() async {
        Database? database = await db;
        List<Map<String, Object?>> result = await database.query("Student");
        if (result.isNotEmpty) {
            return result.map((e) => Student.fromJson(e)).toList();
        } else {
            return [];
        }
    }

    ///条件查询
    Future<List<Student>?> find(int sex) async {
        Database database = await db;
        List<Map<String, Object?>> result =
            await database.query("Student", where: "sex=?", whereArgs: [sex]);
        if (result.isNotEmpty) {
            return result.map((e) => Student.fromJson(e)).toList();
        } else {
            return [];
        }
    }

    /// 修改
    Future<int> update(Student student) async {
        Database database = await db;
        student.age = 99;
        int count =
            await database.update("Student", student.toJson(), where: "id=?", whereArgs: [student.id]);
        return count;
    }

    /// 删除
    Future<int> delete(int id) async {
        Database database = await db;
        int count = await database.delete("Student", where: "id=?", whereArgs: [id]);
        return count;
    }

    /// 删除全部
    Future<int> deleteAll() async {
        Database database = await db;
        int count = await database.delete("Student");
        return count;
    }
}
```

### 定义实体类

```dart
Student studentFromJson(String str) => Student.fromJson(json.decode(str));

String studentToJson(Student data) => json.encode(data.toJson());

class Student {
    Student({
        this.id,
        this.name,
        this.age,
        this.sex,
    });

    Student.fromJson(dynamic json) {
        id = json['id'];
        name = json['name'];
        age = json['age'];
        sex = json['sex'];
    }

    int? id;
    String? name;
    int? age;
    int? sex;

    Map<String, dynamic> toJson() {
        final map = <String, dynamic>{};
        map['id'] = id;
        map['name'] = name;
        map['age'] = age;
        map['sex'] = sex;
        return map;
    }
}
```

### 首页代码

```dart
class SqlitePage extends StatefulWidget {
    const SqlitePage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _SqlitePageState();
    }
}

class _SqlitePageState extends State<SqlitePage> {
    List<Student>? _studentList;

    loadAllData() async {
        _studentList = await DBManager().findAll();
        setState(() {});
    }

    loadData() async {
        _studentList = await DBManager().find(1);
        setState(() {});
    }

    updateData(Student student) async {
        var count = await DBManager().update(student);
        if (count > 0) {
            showSnackBar(context, "修改成功");
        } else {
            showSnackBar(context, "修改失败");
        }
    }

    deleteData(int id) async {
        var count = await DBManager().delete(id);
        if (count > 0) {
            showSnackBar(context, "删除成功");
        } else {
            showSnackBar(context, "删除失败");
        }
    }

    deleteAllData() async {
        var count = await DBManager().deleteAll();
        if (count > 0) {
            showSnackBar(context, "删除成功");
        } else {
            showSnackBar(context, "删除失败");
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("SQLite"),
                actions: [
                    IconButton(
                        icon: const Icon(Icons.add),
                        onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (context) {
                                return const AddStudentPage();
                            }));
                        },
                    )
                ],
            ),
            body: SingleChildScrollView(
                child: Center(
                    child: Column(
                        children: [
                            ElevatedButton(
                                onPressed: () {
                                    loadAllData();
                                },
                                child: const Text("查询所有数据"),
                            ),
                            ElevatedButton(
                                onPressed: () {
                                    loadData();
                                },
                                child: const Text("条件查询"),
                            ),
                            ElevatedButton(
                                onPressed: () {
                                    deleteAllData();
                                },
                                child: const Text("删除全部"),
                            ),
                            Padding(
                                padding: const EdgeInsets.all(10),
                                child: _buildTable(),
                            ),
                        ],
                    ),
                ),
            ),
        );
    }

    _buildTable() {
        return Table(
            border: TableBorder.all(),
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            children: [
                const TableRow(children: [
                    TableCell(child: Text("id")),
                    TableCell(child: Text("姓名")),
                    TableCell(child: Text("年龄")),
                    TableCell(child: Text("性别")),
                    TableCell(child: Text("修改")),
                    TableCell(child: Text("删除")),
                ]),
                ...?_studentList
                ?.map((e) => TableRow(children: [
                    TableCell(child: Text("${e.id}")),
                    TableCell(child: Text("${e.name}")),
                    TableCell(child: Text("${e.age}")),
                    TableCell(child: Text("${e.sex}")),
                    TableCell(
                        child: TextButton(
                            onPressed: () {
                                updateData(e);
                            },
                            child: const Text("修改"),
                        ),
                    ),
                    TableCell(
                        child: TextButton(
                            onPressed: () {
                                deleteData(e.id!);
                            },
                            child: const Text("删除"),
                        ),
                    ),
                ]))
                .toList(),
            ],
        );
    }
}
```

### 添加数据页面

```dart
class AddStudentPage extends StatefulWidget {
    const AddStudentPage({Key? key}) : super(key: key);

    @override
    State<StatefulWidget> createState() {
        return _AddStudentPageState();
    }
}

class _AddStudentPageState extends State<AddStudentPage> {
    int _sexValue = 0;
    late TextEditingController _nameController;
    late TextEditingController _ageController;

    @override
    void initState() {
        _nameController = TextEditingController();
        _ageController = TextEditingController();
        super.initState();
    }

    @override
    void dispose() {
        _nameController.dispose();
        _ageController.dispose();
        super.dispose();
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: const Text("增加学生"),
            ),
            body: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                    children: [
                        TextField(
                            controller: _nameController,
                            decoration: const InputDecoration(labelText: "姓名："),
                        ),
                        TextField(
                            controller: _ageController,
                            decoration: const InputDecoration(labelText: "年龄："),
                            inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                            ],
                        ),
                        Row(
                            children: [
                                Expanded(
                                    child: RadioListTile<int>(
                                        title: const Text("女"),
                                        value: 0,
                                        groupValue: _sexValue,
                                        onChanged: (value) {
                                            setState(() {
                                                _sexValue = value!;
                                            });
                                        },
                                    ),
                                ),
                                Expanded(
                                    child: RadioListTile<int>(
                                        title: const Text("男"),
                                        value: 1,
                                        groupValue: _sexValue,
                                        onChanged: (value) {
                                            setState(() {
                                                _sexValue = value!;
                                            });
                                        },
                                    ),
                                ),
                            ],
                        ),
                        Builder(builder: (BuildContext context) {
                            return Column(
                                children: [
                                    ElevatedButton(
                                        onPressed: () async {
                                            var student = Student(
                                                name: _nameController.text.toString(),
                                                age: int.parse(_ageController.text.toString()),
                                                sex: _sexValue,
                                            );
                                            int result = await DBManager().saveData(student);
                                            if (result > 0) {
                                                showSnackBar(context, '保存数据成功，result:$result');
                                            } else {
                                                showSnackBar(context, '保存数据失败，result:$result');
                                            }
                                        },
                                        child: const Text("保存数据"),
                                    ),
                                    ElevatedButton(
                                        onPressed: () async {
                                            var student = Student(
                                                name: _nameController.text.toString(),
                                                age: int.parse(_ageController.text.toString()),
                                                sex: _sexValue,
                                            );
                                            int result = await DBManager().saveDataBySQL(student);
                                            if (result > 0) {
                                                showSnackBar(context, '保存数据成功，result:$result');
                                            } else {
                                                showSnackBar(context, '保存数据失败，result:$result');
                                            }
                                        },
                                        child: const Text("使用SQL保存数据"),
                                    ),
                                ],
                            );
                        }),
                    ],
                ),
            ),
        );
    }
}
```

