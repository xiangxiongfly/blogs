[TOC]

# Gson总结

## 概述

Gson是一个Java库，用于将Java对象序列化为JSON格式，或将JSON格式反序列化为Java对象。



## 依赖库

```
implementation 'com.google.code.gson:gson:2.10.1'
```



## 基本API介绍

```
JsonElement有4个子类：
- JsonObject
- JsonArray
- JsonPrimitive
- JsonNull

JsonElement常用方法：
isJsonArray()
getAsJsonArray()
isJsonObject()
getAsJsonObject()
isJsonPrimitive()
getAsJsonPrimitive()
isJsonNull()
getAsJsonNull()
```



## 基本用法

### 直接生成JSON字符串

```java
JsonObject userObject = new JsonObject();
userObject.addProperty("name", "小明");
userObject.addProperty("age", 18);
userObject.addProperty("sex", true);
JsonArray addressArray = new JsonArray();
addressArray.add("广东省");
addressArray.add("广州市");
addressArray.add("黄埔区");
userObject.add("address", addressArray);
String jsonStr = userObject.toString();
System.out.println(jsonStr);
```

输出信息：

```
{"name":"小明","age":18,"sex":true,"address":["广东省","广州市","黄埔区"]}
```

### 操作对象

-   toJson()：序列化，将Java对象转为JSON字符串。
-   fromJson()：反序列化，将JSON字符串转为Java对象。

**序列化：**

```java
Gson gson = new Gson();
User user = new User("小白", 18, true, new String[]{"广东省", "广州市", "黄埔区"});
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"name":"小白","age":18,"sex":true,"address":["广东省","广州市","黄埔区"]}
```

**反序列化：**

```java
String jsonStr = "{\"name\":\"小白\",\"age\":18,\"sex\":true,\"address\":[\"广东省\",\"广州市\",\"黄埔区\"]}\n";
Gson gson = new Gson();
User user = gson.fromJson(jsonStr, User.class);
System.out.println(user);
```

输出信息：

```
User{name='小白', age=18, sex=true, address=[广东省, 广州市, 黄埔区]}
```

### 操作数组

**序列化：**

```java
String[] fruits = {"苹果", "香蕉", "葡萄"};
Gson gson = new Gson();
String jsonStr = gson.toJson(fruits);
System.out.println(jsonStr);
```

输出信息：

```
["苹果","香蕉","葡萄"]
```

**反序列化：**

```java
String jsonStr = "[\"苹果\",\"香蕉\",\"葡萄\"]";
Gson gson = new Gson();
String[] strs = gson.fromJson(jsonStr, String[].class);
System.out.println(strs);
```

输出信息：

```
苹果
香蕉
葡萄
```

### 操作集合

**序列化：**

```java
ArrayList<User> userList = new ArrayList<>();
userList.add(new User("小白", 18, true, new String[]{"广东省", "广州市", "黄埔区"}));
userList.add(new User("小黑白", 19, false, new String[]{"湖南省", "长沙市", "岳麓区"}));
Gson gson = new Gson();
String jsonStr = gson.toJson(userList);
System.out.println(jsonStr);
```

输出信息：

```
[{"name":"小白","age":18,"sex":true,"address":["广东省","广州市","黄埔区"]},{"name":"小黑白","age":19,"sex":false,"address":["湖南省","长沙市","岳麓区"]}]
```

**反序列化：**

```java
String jsonStr = "[{\"name\":\"小白\",\"age\":18,\"sex\":true,\"address\":[\"广东省\",\"广州市\",\"黄埔区\"]},{\"name\":\"小黑白\",\"age\":19,\"sex\":false,\"address\":[\"湖南省\",\"长沙市\",\"岳麓区\"]}]\n";
Gson gson = new Gson();
List<User> userList = gson.fromJson(jsonStr, new TypeToken<List<User>>() {
}.getType());
System.out.println(userList);
```

输出信息：

```
[User{name='小白', age=18, sex=true, address=[广东省, 广州市, 黄埔区]}, User{name='小黑白', age=19, sex=false, address=[湖南省, 长沙市, 岳麓区]}]
```

### 操作泛型

和使用集合是一样的。

**序列化：**

```java
Base<User> user = new Base<>(100, "成功", new User("小明", 18, true, new String[]{"广东省", "广州市", "黄埔区"}));
Gson gson = new Gson();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"id":100,"message":"成功","data":{"name":"小明","age":18,"sex":true,"address":["广东省","广州市","黄埔区"]}}
```

**反序列化：**

```java
String jsonStr = "{\n" +
    "    \"id\":100,\n" +
    "    \"message\":\"成功\",\n" +
    "    \"data\":{\n" +
    "        \"name\":\"小明\",\n" +
    "        \"age\":18,\n" +
    "        \"sex\":true,\n" +
    "        \"address\":[\n" +
    "            \"广东省\",\n" +
    "            \"广州市\",\n" +
    "            \"黄埔区\"\n" +
    "        ]\n" +
    "    }\n" +
    "}";
Gson gson = new Gson();
Base<User> user = gson.fromJson(jsonStr, new TypeToken<Base<User>>() {
}.getType());
System.out.println(user);
```

输出信息：

```
BaseBean{id=100, message='成功', data=User{name='小明', age=18, sex=true, address=[广东省, 广州市, 黄埔区]}}
```



## 其他用法

### @SerializedName

@SerializedName 是 Gson 中的一个注解，保证在 Java 类中的成员变量名与 JSON 中的键名不一致时，也能够正确地进行序列化和反序列化操作。

序列化时，将 Java 类中的成员变量替换为 JSON 中的键名；反序列化时，将 JSON 中的键名替换为 Java 中的成员变量。

```java
class User {
    @SerializedName("Name")
    public String name;
    
    @SerializedName("Age")
    public int age;
    
    @SerializedName("Sex")
    public boolean sex;
    
    @SerializedName("Address")
    public String[] address;
}
```

**序列化：**

```java
User user = new User("小明", 18, true, new String[]{"广东省", "广州市", "黄埔区"});
Gson gson = new Gson();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"Name":"小明","Age":18,"Sex":true,"Address":["广东省","广州市","黄埔区"]}
```

**反序列化：**

```java
String jsonStr = "{\n" +
    "    \"Name\":\"小明\",\n" +
    "    \"Age\":18,\n" +
    "    \"Sex\":true,\n" +
    "    \"Address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\",\n" +
    "        \"黄埔区\"\n" +
    "    ]\n" +
    "}";
Gson gson = new Gson();
User user = gson.fromJson(jsonStr, User.class);
System.out.println(user);
```

输出信息：

```
User{name='小明', age=18, sex=true, address=[广东省, 广州市, 黄埔区]}
```



### @Expose

@Expose 是 Gson 中的一个注解，用于指定哪些字段应该被序列化或反序列化。

参数serialize表示序列化时是否生效，默认值为true；参数deserialize表示反序列化时是否生效，默认值为true。

需要调用 `excludeFieldsWithoutExposeAnnotation()` 方法才起作用。

```java
class User {
    @Expose(serialize = false)
    public String name;
    
    @Expose(deserialize = false)
    public int age;
    
    @Expose(serialize = false, deserialize = false)
    public boolean sex;
    
    @Expose(serialize = true, deserialize = true)
    public String[] address;
}
```

**序列化：**

```java
User user = new User("小明", 18, true, new String[]{"北京市", "朝阳区"});
Gson gson = new GsonBuilder()
    .excludeFieldsWithoutExposeAnnotation()
    .create();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"age":18,"address":["北京市","朝阳区"]}
```

**反序列化：**

```java
String jsonStr = "{\n" +
    "    \"name\":\"小明\",\n" +
    "    \"age\":18,\n" +
    "    \"sex\":true,\n" +
    "    \"address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\",\n" +
    "        \"黄埔区\"\n" +
    "    ]\n" +
    "}";
Gson gson = new GsonBuilder()
    .excludeFieldsWithoutExposeAnnotation()
    .create();
User user = gson.fromJson(jsonStr, User.class);
System.out.println(user);
```

输出信息：

```
User{name='小明', age=0, sex=false, address=[广东省, 广州市, 黄埔区]}
```



### excludeFieldsWithModifiers()

`excludeFieldsWithModifiers()` 方法是Gson中的一个方法，用于在序列化时排除指定的字段。

这个方法接受一个是修饰符。修饰符可以是`TRANSIENT`、`STATIC`、`SYNCHRONIZED`或`VOLATILE`中的一个。这个方法返回一个新的GsonBuilder对象，可以继续链式调用其他方法来配置Gson实例。

```java
class User {
    private String name;
    protected int age;
    boolean sex;
    public String[] address;
}
```

**序列化：**

```java
User user = new User("小明", 18, true, new String[]{"广东省", "广州市"});
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.PRIVATE, Modifier.PROTECTED)
    .create();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"sex":true,"address":["广东省","广州市"]}
```

**反序列化：**

```java
String jsonStr = "{\n" +
    "    \"name\":\"小明\",\n" +
    "    \"age\":18,\n" +
    "    \"sex\":true,\n" +
    "    \"address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\",\n" +
    "        \"黄埔区\"\n" +
    "    ]\n" +
    "}";
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.PRIVATE, Modifier.PROTECTED)
    .create();
User user = gson.fromJson(jsonStr, User.class);
System.out.println(user);
```

输出信息：

```
User{name='null', age=0, sex=true, address=[广东省, 广州市, 黄埔区]}
```



### serializeNulls()

在Gson中，`serializeNulls()`  方式是序列化的一个选项，用于控制是否将值为null的属性序列化到JSON字符串中。

**不使用serializeNulls()：**

```java
User user = new User(null, 18, true, null);
Gson gson = new GsonBuilder().create();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"age":18,"sex":true}
```

**使用serializeNulls()：**

```java
User user = new User(null, 18, true, null);
Gson gson = new GsonBuilder().serializeNulls().create();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{"name":null,"age":18,"sex":true,"address":null}
```



### 格式日期时间

```java
class User {
    public String name;
    public int age;
    public Date date;
}
```

**序列化**

```java
User user = new User("小明", 18, new Date());
Gson gson = new GsonBuilder()
    .setPrettyPrinting() //格式化输出JSON字符串
    .setDateFormat("yyyy-MM-dd HH:mm::ss") //格式化日期
    .create();
String jsonStr = gson.toJson(user);
System.out.println(jsonStr);
```

输出信息：

```
{
  "name": "小明",
  "age": 18,
  "date": "2023-09-08 14:32::16"
}
```

**反序列化**

```java
String jsonStr = "{\n" +
    "  \"name\": \"小明\",\n" +
    "  \"age\": 18,\n" +
    "  \"date\": \"2023-09-08 14:32::16\"\n" +
    "}";
Gson gson = new GsonBuilder()
    .setPrettyPrinting() //格式化输出JSON字符串
    .setDateFormat("yyyy-MM-dd HH:mm::ss") //格式化日期
    .create();
User user = gson.fromJson(jsonStr, User.class);
System.out.println(user);
```

输出信息：

```
User{name='小明', age=18, date=Fri Sep 08 14:32:16 CST 2023}
```

