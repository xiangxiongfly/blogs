[TOC]

# Flutter 输入框组件

## 基本属性

```
autofocus：是否自动获取焦点。

obscureText：密码输入框。maxLines只能为1，否则出现异常。

showCursor & cursorWidth & cursorRadius & cursorColor：光标是否显示、光标宽度、圆角、颜色。

textAlign：文本水平对齐方式。

textAlignVertical：文本垂直对齐方式。

style：文本样式。

maxLength：输入框最大长度。

inputFormatters：设置输入框内容格式，值允许输入指定格式的数据。
	- FilteringTextInputFormatter.allow(RegExp("[a-zA-Z]"))：只允许a-zA-Z。
	- FilteringTextInputFormatter.digitsOnly：仅数字1-9.

decoration：TextField组件的装饰，类型是InputDecoration，可以设置文本、提示文本、样式等。
	- labelText：label文本。
	- labelStyle：label文本样式
	- hintText：输入框为空时提示文本。
	- hintStyle：hint文本样式。
	- icon：输入框外前面的图标
	- prefixIcon：输入框内前面的图标。
	- prefix：输入框内前面的组件。
	- contentPadding：内边距。

controller：用于控制输入框，监听输入框内容变化、设置默认文本、选中输入框内容。

onChange：监听输入框内容变化。

onTap：点击输入框时回调。

onSubmitted：点击软键盘回车键时回调。

keyboardType：控制软键盘输入类型
    - text：通用键盘。
    - multiline：多行文本，支持换行，需要配合maxLines使用。
    - number：数字键盘。
    - phone：电话键盘，相比数字键盘多了“*”和“#”。
    - datetime：日期时间键盘。
    - emailAddress：邮件键盘。
    - url：url输入键盘。
    - visiblePassword：字母和数字键盘。

textInputAction：软键盘回车键图标。
```

### 自动换行

```dart
maxLines: null,
minLines: 1,
```

### 限制输入

`maxLength`虽然可以限制输入长度，但是右下角会出现输入计数，有些场景是不需要显示的，可以通过如下解决：

```dart
inputFormatters: [
    LengthLimitingTextInputFormatter(10),
]
```

**只允许输入11手机号**

```dart
inputFormatters: [
    LengthLimitingTextInputFormatter(11),
    FilteringTextInputFormatter.digitsOnly,
]
```

**限制当行，会覆盖maxLines**

```dart
inputFormatters: [
    FilteringTextInputFormatter.singleLineFormatter,
]
```



## 简单使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/c738f4c237754ae592c69dcda8781fd8.png)

```dart
final TextEditingController _usernameController = TextEditingController();
final TextEditingController _descController = TextEditingController();
var descriptionCount = "";

@override
void initState() {
    //监听内容变化
    _usernameController.addListener(() {
        print("内容监听1：${_usernameController.text}");
    });

    //设置默认值
    _descController.text = "helloworld";
    //设置选择文本
    _descController.selection = TextSelection(
        baseOffset: 0,
        extentOffset: _descController.text.length,
    );
    super.initState();
}

@override
void dispose() {
    _usernameController.dispose();
    _descController.dispose();
    super.dispose();
}

TextField(
    controller: _usernameController,
    inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp("[a-zA-Z]")),
    ],
    decoration: const InputDecoration(
        labelText: "用户名",
        hintText: "请输入用户名(仅允许输入英文字符)",
        prefixIcon: Icon(Icons.person),
    ),
    onChanged: (value) {
        print("内容监听2：$value");
    },
),
TextField(
    inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp("[a-zA-Z0-9.]")),
    ],
    decoration: const InputDecoration(
        labelText: "邮箱",
        hintText: "请输入邮箱账号",
        prefixIcon: Icon(Icons.mail),
    ),
    keyboardType: TextInputType.emailAddress,
),
TextField(
    inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
    ],
    decoration: const InputDecoration(
        labelText: "密码",
        hintText: "请输入密码（仅允许输入6位即以上的数字）",
        prefixIcon: Icon(Icons.lock),
    ),
    keyboardType: TextInputType.number,
    obscureText: true,
),
TextField(
    autofocus: true,
    maxLines: 3,
    maxLength: 32,
    controller: _descController,
    onChanged: (value) {
        setState(() {
            descriptionCount = value;
        });
    },
    decoration: InputDecoration(
        labelText: "描述",
        hintText: "请输入描述",
        prefixIcon: const Icon(Icons.description),
        counterText: "${descriptionCount.length}/32",
    ),
    keyboardType: TextInputType.multiline,
)
```



## 焦点控制

焦点控制可以通过`FocusNode`和`FocusScopeNode`来控制。一般情况下，简单由`FoucusNode`管理，它代表焦点控制范围，可以在这个范围内可以通过`FocusScopeNode`在输入框之间移动焦点、设置默认焦点等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9065cf6586e245ff92ec71d8ca096a7b.png)

```dart
FocusNode focusNode1 = FocusNode();
FocusNode focusNode2 = FocusNode();
FocusScopeNode? focusScopeNode;

@override
void dispose() {
    focusNode1.dispose();
    focusNode2.dispose();
    focusScopeNode?.dispose();
    super.dispose();
}

TextField(
    autofocus: true,
    focusNode: focusNode1,
    decoration: const InputDecoration(
        labelText: "input1",
    ),
),
TextField(
    autofocus: true,
    focusNode: focusNode2,
    decoration: const InputDecoration(
        labelText: "input2",
    ),
),
ElevatedButton(
    onPressed: () {
        //方式一
        FocusScope.of(context).requestFocus(focusNode1);
    },
    child: const Text("input1获取焦点"),
),
ElevatedButton(
    onPressed: () {
        //方式二
        focusScopeNode ??= FocusScope.of(context);
        focusScopeNode?.requestFocus(focusNode2);
    },
    child: const Text("input2获取焦点"),
),
ElevatedButton(
    onPressed: () {
        //方式一
        focusNode1.unfocus();
        focusNode2.unfocus();
        //方式二
        // focusScopeNode?.unfocus();
    },
    child: const Text("隐藏键盘"),
),
```



## 自定义样式1

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5e1305f7f664ff4a3304751373b4441.png)

```dart
Padding(
    padding: EdgeInsets.all(10),
    child: TextField(
        textAlign: TextAlign.center,
        decoration: InputDecoration(
            fillColor: Color(0x30cccccc),
            filled: true,
            hintText: "QQ/邮箱/手机号",
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(100)),
                borderSide: BorderSide(color: Colors.grey),
            ),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(100)),
                borderSide: BorderSide(color: Colors.black),
            ),
        ),
    ),
)
```



## 自定义样式2

![在这里插入图片描述](https://img-blog.csdnimg.cn/3de911c1d12d4c75b3e27c7bb9f02379.png)

```dart
final FocusNode focusNode1 = FocusNode();
final FocusNode focusNode2 = FocusNode();
bool _hasFocus1 = false;
bool _hasFocus2 = false;

@override
void initState() {
    super.initState();
    focusNode1.addListener(() {
        if (_hasFocus1 != focusNode1.hasFocus) {
            setState(() {
                _hasFocus1 = focusNode1.hasFocus;
            });
        }
    });

    focusNode2.addListener(() {
        if (_hasFocus2 != focusNode2.hasFocus) {
            setState(() {
                _hasFocus2 = focusNode2.hasFocus;
            });
        }
    });
}

@override
void dispose() {
    focusNode1.dispose();
    focusNode2.dispose();
    super.dispose();
}

Padding(
    padding: const EdgeInsets.all(10),
    child: Column(
        children: [
            Container(
                child: TextField(
                    focusNode: focusNode1,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        labelText: "用户名",
                        labelStyle: TextStyle(
                            color: _hasFocus1 ? Colors.black : Colors.grey,
                        ),
                        hintText: "请输入用户名",
                        prefixIcon: Icon(
                            Icons.people,
                            color: _hasFocus1 ? Colors.red : Colors.grey,
                        ),
                        border: InputBorder.none,
                    ),
                ),
                decoration: BoxDecoration(
                    border: Border.all(
                        color: _hasFocus1 ? Colors.red : Colors.grey,
                        width: 1,
                    ),
                    borderRadius: const BorderRadius.all(Radius.circular(10)),
                ),
            ),
            const SizedBox(
                height: 5,
            ),
            Container(
                child: TextField(
                    focusNode: focusNode2,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        labelText: "密码",
                        labelStyle: TextStyle(
                            color: _hasFocus2 ? Colors.black : Colors.grey,
                        ),
                        hintText: "请输入密码",
                        prefixIcon: Icon(
                            Icons.lock,
                            color: _hasFocus2 ? Colors.red : Colors.grey,
                        ),
                        border: InputBorder.none,
                    ),
                    obscureText: true,
                ),
                decoration: BoxDecoration(
                    border: Border.all(
                        color: _hasFocus2 ? Colors.red : Colors.grey,
                        width: 1,
                    ),
                    borderRadius: BorderRadius.circular(10),
                ),
            ),
        ],
    ),
)
```

