[TOC]

# Flutter 表格组件

## Table

![在这里插入图片描述](https://img-blog.csdnimg.cn/20621e280fdc4e1fb1a54dc517493bd1.png)

```dart
Table(
    border: TableBorder.all(
        color: Colors.black,
        width: 1,
        style: BorderStyle.solid,
        borderRadius: BorderRadius.circular(5),
    ),
    children: const [
        TableRow(
            decoration: ShapeDecoration(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(5),
                        topRight: Radius.circular(5),
                    ),
                ),
                color: Colors.grey,
            ),
            children: [
                TableCell(child: Center(child: Text("姓名"))),
                TableCell(child: Center(child: Text("年龄"))),
                TableCell(child: Center(child: Text("地址"))),
            ],
        ),
        TableRow(
            children: [
                TableCell(child: Center(child: Text("小明"))),
                TableCell(child: Center(child: Text("18"))),
                TableCell(child: Center(child: Text("北京市"))),
            ],
        ),
        TableRow(
            children: [
                TableCell(child: Center(child: Text("小花"))),
                TableCell(child: Center(child: Text("19"))),
                TableCell(child: Center(child: Text("广州市"))),
            ],
        ),
    ],
)
```



## DataTable

**常用属性**

```
DataTable：
    - numeric：对齐方式。
            - false：左对齐。
            - true：右对齐。
    - tooltip：长按提示。	
    - onSort：点击表头回调。
    
DataRow：
	- selected：选中一行。
	- onSelectChanged：选中回调。
```

### 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ec27a39606c4f2d9bc4ce56792aab22.png)

```dart
DataTable(
    border: TableBorder.all(
        color: Colors.black,
        width: 1,
        style: BorderStyle.solid,
        borderRadius: BorderRadius.circular(5),
    ),
    columns: const [
        DataColumn(label: Text("姓名")),
        DataColumn(label: Text("年龄")),
        DataColumn(numeric: true, label: Text("地址")),
    ],
    rows: const [
        DataRow(cells: [
            DataCell(Center(child: Text("小白"))),
            DataCell(Center(child: Text("18"))),
            DataCell(Center(child: Text("北京市"))),
        ]),
        DataRow(cells: [
            DataCell(Center(child: Text("小黑"))),
            DataCell(Center(child: Text("16"))),
            DataCell(Center(child: Text("上海市"))),
        ]),
        DataRow(cells: [
            DataCell(Center(child: Text("小花"))),
            DataCell(Center(child: Text("20"))),
            DataCell(Center(child: Text("广州市"))),
        ]),
    ],
)
```

### 排序问题

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e5d843d6bd54cb4994444e50d16f106.png)

```dart
class User {
    final String name;
    final int age;

    User(this.name, this.age);
}
```

```dart
DataTable(
    sortColumnIndex: 1,
    sortAscending: _sortAsc,
    columns: [
        const DataColumn(label: Text("姓名")),
        DataColumn(
            label: const Text("年龄"),
            onSort: (int columnIndex, bool ascending) {
                setState(() {
                    _sortAsc = ascending;
                    if (_sortAsc) {
                        _userList.sort((a, b) => a.age.compareTo(b.age));
                    } else {
                        _userList.sort((a, b) => b.age.compareTo(a.age));
                    }
                });
            },
        ),
    ],
    rows: _userList.map((e) {
        return DataRow(cells: [
            DataCell(Text(e.name)),
            DataCell(Text(e.age.toString())),
        ]);
    }).toList(),
)
```

