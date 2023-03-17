@[toc]
# 正则表达式总结

## 概述

在开发中，正则表达式常用于邮箱、手机号的校验，文本的批量查找、替换等操作。



## 工具

[https://regex101.com/](https://regex101.com/)



## 正则元字符

### 匹配单个字符

| 字符 | 功能                                                     |
| ---- | -------------------------------------------------------- |
| .    | 任意1个字符，除了\n                                      |
| \d   | 任意数字，即：0-9                                        |
| \D   | 任意非数字                                               |
| \s   | 空白符，即：\r 回车符、\n 换行符、\f 换页符、\t 制表符等 |
| \S   | 非空白符                                                 |
| \w   | 任意字母数字下划线，即：a-z、A-Z、0-9、_                 |
| \W   | 任意字母数字下划线                                       |



### 匹配数量

| 字符  | 功能        |
| ----- | ----------- |
| *     | 0次或多次   |
| +     | 1次或多次   |
| ?     | 0次或1次    |
| {m}   | 出现m次     |
| {m,}  | 至少出现m次 |
| {m,n} | 出现m到n次  |



### 匹配范围

| 字符   | 功能                                                         |
| ------ | ------------------------------------------------------------ |
| \|     | 匹配左右任意一个表达式，如：a\|b 表示a或b                    |
| [...]  | 范围内任意一个字符串，如：[abc] 表示字符a b c中任意一个      |
| [a-z]  | 匹配a到z中的任意一个，如：[0-9a-zA-Z_] 表示匹配数字、字母和下划线 |
| [^...] | 取反，如：\[^abc] 表示除abc外                                |



### 匹配边界

| 字符 | 功能               |
| ---- | ------------------ |
| ^    | 匹配字符串开头     |
| $    | 匹配字符串结尾     |
| \b   | 匹配一个单词的边界 |
| \B   | 匹配非单词边界     |



### 分组

| 字符  | 功能                     |
| ----- | ------------------------ |
| (abc) | 将括号中字符作为一个分组 |



### 贪婪模式和非贪婪模式

贪婪模式，会尽可能的多匹配

```
<.*>
```



![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220091937102.png)



非贪婪模式，在问号后面紧跟限定尾部

```
<.*?>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220092040435.png)







## Java对正则表达式的支持

在Java中`java.util.regex.Pattern`和`java.util.regex.Matcher`类负责对正则表达式的处理。

- Pattern：通过调用`Pattern#compile()`获取一个模式对象，Pattern对象提高了正则表达式的使用效率，可以作为一个常量，安全的提供多个线程并发使用。
- Matcher：模式匹配后的结果。

`Matcher#matches()`：完全匹配，并返回布尔值

```java
//匹配从a-z任意3个字符
Pattern pattern= Pattern.compile("[a-z]{3}");
Matcher matcher = pattern.matcher("abc");
System.out.println(matcher.matches());//true
```



`Matcher#find()`：从头开始匹配

`matcher#group()`：获取匹配后的数据

```java
final String regex = "\\d{1,3}";
String str = "11abd22asdasdf3333333ada4rtyr";
Pattern pattern = Pattern.compile(regex);
Matcher matcher = pattern.matcher(str);
while (matcher.find()) {
    System.out.println(matcher.group());
}
```

```
11
22
333
333
3
4
```



```java
final String regex = "([a-z]{2})(\\d{2})";
String str = "ab11-cd22-ef44-HI55-666-qqq";
Pattern pattern = Pattern.compile(regex);
Matcher matcher = pattern.matcher(str);
while (matcher.find()) {
    System.out.println(matcher.group());
    System.out.println(matcher.group(1));//第一个分组数据
    System.out.println(matcher.group(2));//第二个分组数据
    System.out.println("-----------");
}
```

```
ab11
ab11
ab
11
-----------
cd22
cd22
cd
22
-----------
ef44
ef44
ef
44
-----------
```



`Matcher#reset() `：重置，当前位置设置为开头





## 常用正则表达式

```java
public class RegexConstants {
    /**
     * 0-99数字
     */
    public static final String REGEX_NUM = "0|[1-9][0-9]?";

    /**
     * 简单电话号码验证
     */
    public static final String REGEX_MOBILE_SIMPLE = "^[1]\\d{10}$";

    /**
     * Regex of exact mobile.
     * <p>china mobile: 134(0-8), 135, 136, 137, 138, 139, 147, 150, 151, 152, 157, 158, 159, 165, 172, 178, 182, 183, 184, 187, 188, 198</p>
     * <p>china unicom: 130, 131, 132, 145, 155, 156, 166, 167, 171, 175, 176, 185, 186</p>
     * <p>china telecom: 133, 153, 162, 173, 177, 180, 181, 189, 199, 191</p>
     * <p>global star: 1349</p>
     * <p>virtual operator: 170</p>
     */
    public static final String REGEX_MOBILE_EXACT = "^((13[0-9])|(14[57])|(15[0-35-9])|(16[2567])|(17[01235-8])|(18[0-9])|(19[189]))\\d{8}$";

    /**
     * Regex of telephone number.
     */
    public static final String REGEX_TEL = "^0\\d{2,3}[- ]?\\d{7,8}$";

    /**
     * Regex of id card number which length is 15.
     */
    public static final String REGEX_ID_CARD15 = "^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$";

    /**
     * Regex of id card number which length is 18.
     */
    public static final String REGEX_ID_CARD18 = "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9Xx])$";

    /**
     * Regex of email.
     */
    public static final String REGEX_EMAIL = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";

    /**
     * Regex of url.
     */
    public static final String REGEX_URL = "[a-zA-z]+://[^\\s]*";

    /**
     * Regex of Chinese character.
     */
    public static final String REGEX_ZH = "^[\\u4e00-\\u9fa5]+$";

    /**
     * Regex of username.
     * <p>scope for "a-z", "A-Z", "0-9", "_", "Chinese character"</p>
     * <p>can't end with "_"</p>
     * <p>length is between 6 to 20</p>
     */
    public static final String REGEX_USERNAME = "^[\\w\\u4e00-\\u9fa5]{6,20}(?<!_)$";

    /**
     * Regex of date which pattern is "yyyy-MM-dd".
     */
    public static final String REGEX_DATE = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$";

    /**
     * Regex of ip address.
     */
    public static final String REGEX_IP = "((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)";
}
```