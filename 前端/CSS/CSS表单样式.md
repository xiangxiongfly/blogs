[TOC]

# CSS表单样式

## radio和checkbox居中问题

当字体设置为12px和14px时，文本与单选框或复选框都不能垂直居中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/da8d7169ecec4d9aa8fae6b4a83d3ee2.png)

为了解决这个问题，可以使用`vertical-align`属性。

**语法**

```
当文字为12px时：
单选框或复选框 {
	vertical-align: -3px;
}

当文字为14px时：
单选框或复选框 {
	vertical-align: -2px;
}
```

**使用**

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style type="text/css">
            #p1 {
                font-size: 12px;
            }

            #p1 input {
                vertical-align: -3px;                
            }

            #p2 {
                font-size: 14px;
            }

            #p2 input {
                vertical-align: -2px;
            }
        </style>
    </head>
    <body>
        <p id="p1">
            <input id="radio1" type="radio" />
            <label for="radio1">单选框</label>
            <input id="checkbox1" type="checkbox" />
            <label for="checkbox1">复选框</label>
        </p>
        <p id="p2">
            <input id="radio2" type="radio" />
            <label for="radio2">单选框</label>
            <input id="checkbox2" type="checkbox" />
            <label for="checkbox2">复选框</label>
        </p>
    </body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a6bc68cb035c467f9a797a0d8771d330.png)



## textarea

### 设置宽高

| 属性       | 说明         |
| ---------- | ------------ |
| width | 设置宽度 |
| height | 设置高度 |
| min-width  | 设置最小宽度 |
| min-height | 设置最小高度 |
| max-width  | 设置最大宽度 |
| max-height | 设置最大高度 |
| cols | 设置列数 |
| rows | 设置行数 |

### 禁止拖动

```
textarea元素 {
	resize: none;
}
```

### 各浏览器实现相同效果

由于不同的浏览器显示的效果是不一样的，那么只能使用CSS的`width`和`height`控制宽高，然后用`overflow:auto`定义textarea的滚动条。



## 表单对齐效果

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<style type="text/css">
			form {
				width: 320px;
				font-family: Arial;
				font-size: 14px;
				font-weight: bold;
			}

			/*清除浮动*/
			p {
				overflow: hidden;
			}

			label {
				float: left;
				width: 60px;
				height: 40px;
				line-height: 40px;
				text-align: right;
				margin-right: 10px;
			}

			input:not(#submit) {
				float: left;
				height: 16px;
				padding: 10px;
				border: 1px solid silver;
			}

			#tel,
			#pwd {
				width: 228px;
			}

			#verifyCode {
				width: 118px;
				margin-right: 10px;
			}

			#submit {
				width: 100px;
				height: 40px;
				border: 1px solid gray;
				padding: 0;
				background-color: #F1F1F1;
			}
		</style>
	</head>
	<body>
		<form action="index.html">
			<p>
				<label for="tel">手机号</label>
				<input id="tel" type="text" />
			</p>
			<p>
				<label for="pwd">密码</label>
				<input id="pwd" type="password" />
			</p>
			<p>
				<label for="verifyCode">验证码</label>
				<input id="verifyCode" type="text" />
				<input id="submit" type="submit" />
			</p>
		</form>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/dcfba342acbc47799bff2ec84cdb7afc.png)



