[TOC]

# Gson总结

## 依赖库

```
implementation 'com.google.code.gson:gson:2.8.6'
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

### 生成Json字符串

```java
JsonObject jsonObject = new JsonObject();
jsonObject.addProperty("name", "小明");
jsonObject.addProperty("age", 18);
jsonObject.addProperty("sex", true);

JsonArray jsonArray = new JsonArray();
jsonArray.add("北京市");
jsonArray.add("广州市");
jsonArray.add("上海市");
jsonObject.add("address", jsonArray);

System.out.println(jsonObject.toString());
```

```
{"name":"小明","age":18,"sex":true,"address":["北京市","广州市","上海市"]}
```



### toJson & fromJson

-   序列化：将Java对象转为Json字符串。
-   反序列化：将Json字符串转为Java对象。

```java
public class User {
    private String name;
    private int age;
    private boolean sex;
    private String[] address;

    public User() {
    }

    public User(String name, int age, boolean sex, String[] address) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.address = address;
    }

    //省略setter/getter toString()
}
```

#### 序列化 toJson

```java
Gson gson = new Gson();
User user = new User("小白", 18, true, new String[]{"北京市", "上海市", "广州市"});
String json = gson.toJson(user);
System.out.println(json);
```

```
{"name":"小白","age":18,"sex":true,"address":["北京市","上海市","广州市"]}
```

#### 反序列化操作 fromJson

```java
Gson gson = new Gson();
String json = "{\"name\":\"小白\",\"age\":18,\"sex\":true,\"address\":[\"北京市\",\"上海市\",\"广州市\"]}\n";
User user = gson.fromJson(json, User.class);
System.out.println(user);
```

```
User{name='小白', age=18, sex=true, address=[北京市, 上海市, 广州市]}
```



### Json数组与Java数组相互转换

```java
String json = "[\n" +
    "{\"name\":\"小白\",\"age\":18,\"sex\":true,\"address\":[\"北京市\",\"上海市\",\"广州市\"]},\n" +
    "{\"name\":\"小白2\",\"age\":19,\"sex\":false,\"address\":[\"上海市\",\"广州市\"]},\n" +
    "{\"name\":\"小白3\",\"age\":120,\"sex\":true,\"address\":[\"北京市\",\"广州市\"]}\n" +
    "]";

Gson gson = new Gson();

//Json数组转Java数组
System.out.println("Json字符串转Java数组：");
User[] users = gson.fromJson(json, User[].class);
for (User item : users) {
    System.out.println(item);
}

//Java数组转Json数组
System.out.println("Java数组转Json数组：");
String str = gson.toJson(users);
System.out.println(str);
```

```
Json字符串转Java数组：
User{name='小白', age=18, sex=true, address=[北京市, 上海市, 广州市]}
User{name='小白2', age=19, sex=false, address=[上海市, 广州市]}
User{name='小白3', age=120, sex=true, address=[北京市, 广州市]}
Java数组转Json数组：
[{"name":"小白","age":18,"sex":true,"address":["北京市","上海市","广州市"]},{"name":"小白2","age":19,"sex":false,"address":["上海市","广州市"]},{"name":"小白3","age":120,"sex":true,"address":["北京市","广州市"]}]
```



### Json数组与Java List相互转换

```java
String json = "[\n" +
    "{\"name\":\"小白\",\"age\":18,\"sex\":true,\"address\":[\"北京市\",\"上海市\",\"广州市\"]},\n" +
    "{\"name\":\"小白2\",\"age\":19,\"sex\":false,\"address\":[\"上海市\",\"广州市\"]},\n" +
    "{\"name\":\"小白3\",\"age\":120,\"sex\":true,\"address\":[\"北京市\",\"广州市\"]}\n" +
    "]";

Gson gson = new Gson();

//Json数组转Java List
System.out.println("Json数组转Java List:");
ArrayList<User> userList = gson.fromJson(json, new TypeToken<List<User>>() {
}.getType());
System.out.println(userList);

//Java List转Json数组
System.out.println("Java List转Json数组:");
String str = gson.toJson(userList);
System.out.println(str);
```

```
Json数组转Java List:
[User{name='小白', age=18, sex=true, address=[北京市, 上海市, 广州市]}, User{name='小白2', age=19, sex=false, address=[上海市, 广州市]}, User{name='小白3', age=120, sex=true, address=[北京市, 广州市]}]
Java List转Json数组:
[{"name":"小白","age":18,"sex":true,"address":["北京市","上海市","广州市"]},{"name":"小白2","age":19,"sex":false,"address":["上海市","广州市"]},{"name":"小白3","age":120,"sex":true,"address":["北京市","广州市"]}]
```



## 泛型支持

```java
public class Base<T> {
    private int code;
    private String message;
    private T data;  
}
```

```java
String json = "{\n" +
"    \"code\":1,\n" +
"    \"message\":\"success\",\n" +
"    \"data\":{\n" +
"        \"name\":\"小花\",\n" +
"        \"age\":\"38\",\n" +
"        \"sex\":true\n" +
"    }\n" +
"}";
Gson gson = new Gson();
Base<User> userBase = gson.fromJson(json, new TypeToken<Base<User>>() {
}.getType());
System.out.println(userBase);
```

```
Base{code=1, message='success', data=User{name='小花', age=38, sex=true}}
```



## 注解

### @SerializedName 属性重命名

```java
public class User {
    @SerializedName("Name")
    private String name;
    @SerializedName("Age")
    private int age;
    @SerializedName("Sex")
    private boolean sex;
    @SerializedName("Address")
    private String[] address;
}
```

```java
Gson gson = new Gson();
String json = "{\"Name\":\"小白\",\"Age\":18,\"Sex\":true,\"Address\":[\"北京市\",\"上海市\",\"广州市\"]}\n";
User user = gson.fromJson(json, User.class);
System.out.println(user);
```

```
User{name='小白', age=18, sex=true, address=[北京市, 上海市, 广州市]}
```



### @Expose 序列化策略

```java
@Expose(serialize = true, deserialize = true)   //序列化和反序列化都生效
@Expose(serialize = false, deserialize = true)  //序列化时不生效，反序列化时生效
@Expose(serialize = true, deserialize = false)  //序列化时生效，反序列化时不生效
@Expose(serialize = false, deserialize = false) //序列化和反序列化都不生效，和不写注解一样
```



## 过滤

Gson提供`excludeFieldsWithModifiers()`方法过滤指定数据

```java
public class User {
    public String name;
    int age;
    protected boolean sex;
    private String[] address;
}
```

```java
User user = new User("小白", 18, true, new String[]{"北京市", "上海市", "广州市"});
Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.PUBLIC, Modifier.PROTECTED).create();
String json = gson.toJson(user);
System.out.println(json);
```

```
{"age":18,"address":["北京市","上海市","广州市"]}
```



## serializeNulls 输出null

Gson在进行序列化操作时，如果某个属性值为null，则序列化时不操作该字段，否则使用`serializeNulls()`进行配置。

```java
User user = new User(null, 18, true, null);
Gson gson = new Gson();
String json = gson.toJson(user);
System.out.println(json);
```

```
{"age":18,"sex":true}
```

**使用serializeNulls()**

```java
User user = new User(null, 18, true, null);
Gson gson = new GsonBuilder().serializeNulls().create();
String json = gson.toJson(user);
System.out.println(json);
```

```
{"name":null,"age":18,"sex":true,"address":null}
```



## 格式日期时间

```java
public class User {
    private String name;
    private int age;
    private Date date;
}
```

**序列化**

```java
Gson gson = new GsonBuilder()
    .setPrettyPrinting() //格式化输出json
    .setDateFormat("yyyy-MM-dd HH:mm:ss") //格式化日期
    .create();

User user = new User("小黑", 18, new Date());
String json = gson.toJson(user);
System.out.println(json);
```

```
{
  "name": "小黑",
  "age": 18,
  "date": "2021-02-25 17:38:10"
}
```

**反序列化**

```java
String json = "{\n" +
    "  \"name\": \"小黑\",\n" +
    "  \"age\": 18,\n" +
    "  \"date\": \"2021-02-25 17:38:10\"\n" +
    "}";
User user = gson.fromJson(json, User.class);
System.out.println(user);
```

```
User{name='小黑', age=18, date=Thu Feb 25 17:38:10 CST 2021}
```



