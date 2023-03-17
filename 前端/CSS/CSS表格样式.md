[TOC]

# CSS表格样式

## caption-side 标题位置

**语法**

```
caption-side: 取值;
```

**取值**

| 属性值 | 说明               |
| ------ | ------------------ |
| top    | 默认值，标题在顶部 |
| bottom | 标题在底部         |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			th,
			td {
				border: 1px solid silver;
			}

			table {
				width: 100%;
			}

			table {
				caption-side: top;
			}
		</style>
	</head>
	<body>
		<table>
			<caption>表格标题</caption>
			<!--表头-->
			<thead>
				<tr>
					<th>表头单元格1</th>
					<th>表头单元格2</th>
				</tr>
			</thead>
			<!--表身-->
			<tbody>
				<tr>
					<td>表行单元格1</td>
					<td>表行单元格2</td>
				</tr>
				<tr>
					<td>表行单元格3</td>
					<td>表行单元格4</td>
				</tr>
			</tbody>
			<!--表脚-->
			<tfoot>
				<tr>
					<td>表行单元格5</td>
					<td>表行单元格6</td>
				</tr>
			</tfoot>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/70329a30f1dd4c34b4b5871905c94d9e.png)



## border-collapse 边框合并

**语法**

```
border-colapse: 取值;
```

**取值**

| 属性值   | 说明                     |
| -------- | ------------------------ |
| separate | 默认值，边框分开，有空隙 |
| collapse | 边框合并，无空隙         |

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			th,
			td {
				border: 1px solid silver;
			}

			table {
				width: 100%;
				border-collapse: collapse;
			}
		</style>
	</head>
	<body>
		<table>
			<!--表头-->
			<thead>
				<tr>
					<th>表头单元格1</th>
					<th>表头单元格2</th>
				</tr>
			</thead>
			<!--表身-->
			<tbody>
				<tr>
					<td>表行单元格1</td>
					<td>表行单元格2</td>
				</tr>
				<tr>
					<td>表行单元格3</td>
					<td>表行单元格4</td>
				</tr>
			</tbody>
			<!--表脚-->
			<tfoot>
				<tr>
					<td>表行单元格5</td>
					<td>表行单元格6</td>
				</tr>
			</tfoot>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/04335a1579c94ad5b7a3d8b40ccf0cba.png)



## border-spacing 边框间距

**语法**

```
border-spacing: 像素值;
```

**使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<style type="text/css">
			table,
			th,
			td {
				border: 1px solid silver;
			}

			table {
				width: 100%;
				border-spacing: 0px;
			}
		</style>
	</head>
	<body>
		<table>
			<!--表头-->
			<thead>
				<tr>
					<th>表头单元格1</th>
					<th>表头单元格2</th>
				</tr>
			</thead>
			<!--表身-->
			<tbody>
				<tr>
					<td>表行单元格1</td>
					<td>表行单元格2</td>
				</tr>
				<tr>
					<td>表行单元格3</td>
					<td>表行单元格4</td>
				</tr>
			</tbody>
			<!--表脚-->
			<tfoot>
				<tr>
					<td>表行单元格5</td>
					<td>表行单元格6</td>
				</tr>
			</tfoot>
		</table>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/283777aa7b894b1baca28fbdc0a195f5.png)





## css样式（推荐使用）

<img src="https://img-blog.csdnimg.cn/20200625233403805.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:50%;" />



```html
<style>
    table {
        width: 50%;
        border: 1px solid black;
        margin: 0 auto;
        border-collapse: collapse;
    }

    td {
        height: 50px;
        border: 1px solid black;
        text-align: center;
        vertical-align: center;
    }

    tbody tr:nth-child(even) {
        background-color: antiquewhite;
    }
</style>

<body>
    <table>
        <tr>
            <td>编号</td>
            <td>姓名</td>
            <td>年龄</td>
            <td>地址</td>
        </tr>
        <tr>
            <td>01</td>
            <td>唐僧</td>
            <td>100</td>
            <td>西天</td>
        </tr>
        <tr>
            <td>02</td>
            <td>孙悟空</td>
            <td>500</td>
            <td>花果山</td>
        </tr>
        <tr>
            <td>03</td>
            <td>猪八戒</td>
            <td>400</td>
            <td>高老庄</td>
        </tr>
        <tr>
            <td>04</td>
            <td>沙和尚</td>
            <td>300</td>
            <td>流沙河</td>
        </tr>
    </table>
</body>
```



在表格中，若没有使用`tbody`而是直接使用`tr`，这时浏览器会自动创建一个`tbody`，并将所有`tr`全部放到`tbody`中，所以`tr`不受`table`的子元素。

下图是在浏览器中的结构：

<img src="https://img-blog.csdnimg.cn/20200625233436192.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:50%;" />