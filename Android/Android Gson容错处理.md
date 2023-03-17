[TOC]

# Gson 容错处理

## Gson支持的容错处理

如：JSON中的字符串转Java中的int类型。

```json
{
    "name":"Tom",
    "age":11
}
```

```java
Gson gson = new Gson();
Person person = gson.fromJson(json, Person.class);
System.out.println(person); //Person{name='Tom', age=11}
```

如：JSON中的整型转Java中的String类型。

```json
{
    "name":"Tom",
    "age":11,
}
```

```java
Gson gson = new Gson();
Person person = gson.fromJson(json, Person.class);
System.out.println(person); //Person{name='Tom', age='11'}
```

但是，如果JSON中是浮点类型，而Java中是int类型，则会抛出异常。



## 适配基本数据类型

适配boolean、Boolean、int、Integer、float、Float、double、Double、long、Long、String类型。

### 定义TypeAdapter相关类

```java
/**
 * 适配boolean、Boolean
 */
public class BooleanTypeAdapter extends TypeAdapter<Boolean> {

    @Override
    public void write(JsonWriter out, Boolean value) throws IOException {
        out.value(value);
    }

    @Override
    public Boolean read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case BOOLEAN:
                return in.nextBoolean();
            case STRING:
                return Boolean.parseBoolean(in.nextString());
            case NUMBER:
                return in.nextInt() != 0;
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配int、Integer
 */
public class IntegerTypeAdapter extends TypeAdapter<Integer> {

    @Override
    public void write(JsonWriter out, Integer value) throws IOException {
        out.value(value);
    }

    @Override
    public Integer read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
                try {
                    return in.nextInt();
                } catch (NumberFormatException e) {
                    return (int) in.nextDouble();
                }
            case STRING:
                String result = in.nextString();
                if (result == null || "".equals(result)) {
                    return 0;
                }
                try {
                    return Integer.parseInt(result);
                } catch (NumberFormatException e) {
                    try {
                        return (int) new BigDecimal(result).floatValue();
                    } catch (NumberFormatException e2) {
                        return 0;
                    }
                }
            case NULL:
                in.nextNull();
                break;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
        return null;
    }
}

/**
 * 适配long、Long
 */
public class LongTypeAdapter extends TypeAdapter<Long> {

    @Override
    public void write(JsonWriter out, Long value) throws IOException {
        out.value(value);
    }

    @Override
    public Long read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
                try {
                    return in.nextLong();
                } catch (NumberFormatException e) {
                    return new BigDecimal(in.nextString()).longValue();
                }
            case STRING:
                String str = in.nextString();
                if (str == null || "".equals(str)) {
                    return 0L;
                }
                try {
                    return Long.parseLong(str);
                } catch (NumberFormatException e) {
                    try {
                        return new BigDecimal(str).longValue();
                    } catch (NumberFormatException e2) {
                        return 0L;
                    }
                }
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配float、Float
 */
class FloatTypeAdapter extends TypeAdapter<Float> {

    @Override
    public void write(JsonWriter out, Float value) throws IOException {
        out.value(value);
    }

    @Override
    public Float read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
                return (float) in.nextDouble();
            case STRING:
                String str = in.nextString();
                if (str == null || "".equals(str)) {
                    return 0F;
                }
                try {
                    return Float.parseFloat(str);
                } catch (NumberFormatException e) {
                    return 0F;
                }
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配float、Float
 */
public class FloatTypeAdapter extends TypeAdapter<Float> {

    @Override
    public void write(JsonWriter out, Float value) throws IOException {
        out.value(value);
    }

    @Override
    public Float read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
                return (float) in.nextDouble();
            case STRING:
                String str = in.nextString();
                if (str == null || "".equals(str)) {
                    return 0F;
                }
                try {
                    return Float.parseFloat(str);
                } catch (NumberFormatException e) {
                    return 0F;
                }
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配double、Double
 */
public class DoubleTypeAdapter extends TypeAdapter<Double> {

    @Override
    public void write(JsonWriter out, Double value) throws IOException {
        out.value(value);
    }

    @Override
    public Double read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
                return in.nextDouble();
            case STRING:
                String str = in.nextString();
                if (str == null || "".equals(str)) {
                    return 0D;
                }
                try {
                    return Double.parseDouble(str);
                } catch (NumberFormatException e) {
                    return 0D;
                }
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配String
 */
public class StringTypeAdapter extends TypeAdapter<String> {

    @Override
    public void write(JsonWriter out, String value) throws IOException {
        out.value(value);
    }

    @Override
    public String read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case STRING:
            case NUMBER:
                return in.nextString();
            case BOOLEAN:
                return String.valueOf(in.nextBoolean());
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                throw new IllegalArgumentException();
        }
    }
}

/**
 * 适配BigDecimal
 */
public class BigDecimalTypeAdapter extends TypeAdapter<BigDecimal> {

    @Override
    public void write(JsonWriter out, BigDecimal value) throws IOException {
        out.value(value);
    }

    @Override
    public BigDecimal read(JsonReader in) throws IOException {
        switch (in.peek()) {
            case NUMBER:
            case STRING:
                String str = in.nextString();
                if (str == null || "".equals(str)) {
                    return new BigDecimal(0);
                }
                try {
                    return new BigDecimal(str);
                } catch (NumberFormatException e) {
                    return null;
                }
            case NULL:
                in.nextNull();
                return null;
            default:
                in.skipValue();
                return null;
        }
    }
}
```

### 使用

```java
public class Person {
    public long id;
    public String name;
    public int age;
    public boolean sex;
    public float height;
    public double price;
    public String description;
    public BigDecimal length;
}
```

```java

public class SimpleTest {
    public static void main(String[] args) {
        Gson gson = new GsonBuilder()
            .registerTypeAdapterFactory(TypeAdapters.newFactory(boolean.class, Boolean.class, new BooleanTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(int.class, Integer.class, new IntegerTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(long.class, Long.class, new LongTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(float.class, Float.class, new FloatTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(double.class, Double.class, new DoubleTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(String.class, new StringTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(BigDecimal.class, new BigDecimalTypeAdapter()))
            .create();

        System.out.println("正常情况：");
        String json = getJson("./person.json");
        System.out.println("json: \n" + json);
        Person person = gson.fromJson(json, Person.class);
        System.out.println("结果：\n" + person);
        System.out.println("=================");

        System.out.println("都为null情况：");
        String json2 = getJson("./person_error1.json");
        System.out.println("json: \n" + json2);
        Person person2 = gson.fromJson(json2, Person.class);
        System.out.println("结果：\n" + person2);
        System.out.println("=================");

        System.out.println("都为\"\"情况：");
        String json3 = getJson("./person_error2.json");
        System.out.println("json: \n" + json3);
        Person person3 = gson.fromJson(json3, Person.class);
        System.out.println("结果：\n" + person3);
        System.out.println("=================");

        System.out.println("其他情况：");
        String json4 = getJson("./person_error3.json");
        System.out.println("json: \n" + json4);
        Person person4 = gson.fromJson(json4, Person.class);
        System.out.println("结果：\n" + person4);
        System.out.println("=================");
    }

    public static String getJson(String path) {
        try {
            byte[] bytes = Files.readAllBytes(Paths.get(path));
            return new String(bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
}
```

```
正常情况：
json: 
{
  "id": 11111111,
  "name": "小明",
  "age": 18,
  "sex": true,
  "height": 170.5,
  "price": 12.34,
  "description": "这是一堆描述 这是一堆描述",
  "length": 11111111111111.1111
}
结果：
Person{id=11111111, name='小明', age=18, sex=true, height=170.5, price=12.34, description='这是一堆描述 这是一堆描述', length=11111111111111.1111}
=================
都为null情况：
json: 
{
  "id": null,
  "name": null,
  "age": null,
  "sex": null,
  "height": null,
  "price": null,
  "description": null,
  "length": null
}
结果：
Person{id=0, name='null', age=0, sex=false, height=0.0, price=0.0, description='null', length=null}
=================
都为""情况：
json: 
{
  "id": "",
  "name": "",
  "age": "",
  "sex": "",
  "height": "",
  "price": "",
  "description": "",
  "length": ""
}
结果：
Person{id=0, name='', age=0, sex=false, height=0.0, price=0.0, description='', length=0}
=================
其他情况：
json: 
{
  "id": "null",
  "name": "null",
  "age": "null",
  "sex": "null",
  "height": "null",
  "price": "null",
  "description": "null",
  "length": "null"
}
结果：
Person{id=0, name='null', age=0, sex=false, height=0.0, price=0.0, description='null', length=null}
=================
```



## 其他容错处理

通常服务器返回的数据格式如下：

```json
{
    "code":1,
    "message":"success",
    "data":
}
```

这里的字段data可能是JSONObject类型，也有可能是JSONArray类型，当然可能是JSON原始类型。但是遇到不靠谱的后台，就会出现应该返回JSONArray类型结果返回一个""。

### 定义BaseResult实体类

```java
public class BaseResult<T> {
    public int code;
    public String message;
    public T data;
}
```

```java
public class User {
    public String name;
    public int age;
}
```

### 定义BaseResultTypeAdapter类

```java
public class BaseResultTypeAdapter implements JsonDeserializer<BaseResult> {

    @Override
    public BaseResult deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        final BaseResult result = new BaseResult();
        JsonObject jsonObject = json.getAsJsonObject();
        result.code = jsonObject.get("code").getAsInt();
        result.message = jsonObject.get("message").getAsString();
        JsonElement dataJsonElement = jsonObject.get("data");

        if (dataJsonElement.isJsonArray() && !dataJsonElement.isJsonNull()) {
            //JSONArray类型
            String mJson = dataJsonElement.toString();
            if (result.code == 1) {
                Type type = ((ParameterizedType) typeOfT).getActualTypeArguments()[0];
                result.data = fromJsonArray(mJson, type);
            }
        } else if (dataJsonElement.isJsonObject() && !dataJsonElement.isJsonNull()) {
            //JSONObject类型
            String mJson = dataJsonElement.toString();
            if (result.code == 1) {
                Type type = ((ParameterizedType) typeOfT).getActualTypeArguments()[0];
                result.data = fromJsonObject(mJson, type);
            }
        } else if (dataJsonElement.isJsonPrimitive() && !dataJsonElement.isJsonNull()) {
            //JSON原始类型
            if (result.code == 1) {
                JsonPrimitive jsonPrimitive = dataJsonElement.getAsJsonPrimitive();
                if (jsonPrimitive.isBoolean()) {
                    result.data = jsonPrimitive.getAsBoolean();
                } else if (jsonPrimitive.isNumber()) {
                    result.data = jsonPrimitive.getAsNumber();
                } else if (jsonPrimitive.isString()) {
                    result.data = jsonPrimitive.getAsString();
                }
            }
        }
        return result;
    }

    private <T> T fromJsonObject(String json, Type type) {
        Gson gson = new GsonBuilder()
            .registerTypeAdapterFactory(TypeAdapters.newFactory(boolean.class, Boolean.class, new BooleanTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(int.class, Integer.class, new IntegerTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(long.class, Long.class, new LongTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(float.class, Float.class, new FloatTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(double.class, Double.class, new DoubleTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(String.class, new StringTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(BigDecimal.class, new BigDecimalTypeAdapter()))
            .create();
        return gson.fromJson(json, type);
    }

    private <T> ArrayList<T> fromJsonArray(String json, Type type) {
        Gson gson = new GsonBuilder()
            .registerTypeAdapterFactory(TypeAdapters.newFactory(boolean.class, Boolean.class, new BooleanTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(int.class, Integer.class, new IntegerTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(long.class, Long.class, new LongTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(float.class, Float.class, new FloatTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(double.class, Double.class, new DoubleTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(String.class, new StringTypeAdapter()))
            .registerTypeAdapterFactory(TypeAdapters.newFactory(BigDecimal.class, new BigDecimalTypeAdapter()))
            .create();
        return gson.fromJson(json, type);
    }
}
```

### 使用：

```java
Gson gson = new GsonBuilder()
                .registerTypeAdapterFactory(TypeAdapters.newFactory(boolean.class, Boolean.class, new BooleanTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(int.class, Integer.class, new IntegerTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(long.class, Long.class, new LongTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(float.class, Float.class, new FloatTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(double.class, Double.class, new DoubleTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(String.class, new StringTypeAdapter()))
                .registerTypeAdapterFactory(TypeAdapters.newFactory(BigDecimal.class, new BigDecimalTypeAdapter()))
                .registerTypeAdapter(BaseResult.class, new BaseResultTypeAdapter())
                .create();
```

#### 当data为JSON原始类型时

```java
System.out.println("data为double：");
String json = getJson("./user_double.json");
System.out.println("json:\n" + json);
BaseResult<Double> result = gson.fromJson(json, new TypeToken<BaseResult<Double>>() {
}.getType());
System.out.println("输出：\n" + result);
System.out.println("=================================");

System.out.println("data为boolean：");
String json2 = getJson("./user_boolean.json");
System.out.println("json:\n" + json2);
BaseResult<Boolean> result2 = gson.fromJson(json2, new TypeToken<BaseResult<Boolean>>() {
}.getType());
System.out.println("输出：\n" + result2);
System.out.println("=================================");

System.out.println("data为String：");
String json3 = getJson("./user_string.json");
System.out.println("json:\n" + json3);
BaseResult<String> result3 = gson.fromJson(json3, new TypeToken<BaseResult<String>>() {
}.getType());
System.out.println("输出：\n" + result3);
System.out.println("=================================");
```

```
data为double：
json:
{
  "code":1,
  "message":"请求成功",
  "data":12.34
}
输出：
BaseResult{code=1, message='请求成功', data=12.34}
=================================
data为boolean：
json:
{
  "code":1,
  "message":"请求成功",
  "data":true
}
输出：
BaseResult{code=1, message='请求成功', data=true}
=================================
data为String：
json:
{
  "code":1,
  "message":"请求成功",
  "data":"hello world"
}
输出：
BaseResult{code=1, message='请求成功', data=hello world}
=================================
```

#### 当data为JSONObject类型时

```java
System.out.println("data为正确的JSONObject");
String json = getJson("./user_object.json");
System.out.println("json:\n" + json);
BaseResult<User> result = gson.fromJson(json, new TypeToken<BaseResult<User>>() {
}.getType());
System.out.println("输出：\n" + result);
System.out.println("=================================");

System.out.println("data为错误的JSONObject");
String json2 = getJson("./user_object_error.json");
System.out.println("json:\n" + json2);
BaseResult<User> result2 = gson.fromJson(json2, new TypeToken<BaseResult<User>>() {
}.getType());
System.out.println("输出：\n" + result2);
System.out.println("=================================");
```

```
data为正确的JSONObject
json:
{
  "code": 1,
  "message": "请求成功",
  "data": {
    "name": "小bai",
    "age": 18
  }
}
输出：
BaseResult{code=1, message='请求成功', data=User{name='小bai', age=18}}
=================================
data为错误的JSONObject
json:
{
  "code": 0,
  "message": "请求失败",
  "data": ""
}
输出：
BaseResult{code=0, message='请求失败', data=null}
=================================
```

#### 当data为JSONArray类型时

```java
System.out.println("data为正确的JSONArray");
String json = getJson("./user_array.json");
System.out.println("json:\n" + json);
BaseResult<ArrayList<User>> result = gson.fromJson(json, new TypeToken<BaseResult<ArrayList<User>>>() {
}.getType());
System.out.println("输出：\n" + result);
System.out.println("=================================");

System.out.println("data为错误的JSONArray");
String json2 = getJson("./user_array_error.json");
System.out.println("json:\n" + json2);
BaseResult<ArrayList<User>> result2 = gson.fromJson(json2, new TypeToken<BaseResult<ArrayList<User>>>() {
}.getType());
System.out.println("输出：\n" + result2);
System.out.println("=================================");
```

```
data为正确的JSONArray
json:
{
  "code": 1,
  "message": "请求成功",
  "data": [
    {
      "name": "小bai",
      "age": 18
    },
    {
      "name": "大bai",
      "age": 28
    }
  ]
}
输出：
BaseResult{code=1, message='请求成功', data=[User{name='小bai', age=18}, User{name='大bai', age=28}]}
=================================
data为错误的JSONArray
json:
{
  "code": 0,
  "message": "请求失败",
  "data": ""
}
输出：
BaseResult{code=0, message='请求失败', data=null}
=================================
```



## [github代码下载](https://github.com/xiangxiongfly/GsonDemo/tree/main)


## [CSDN代码下载](https://download.csdn.net/download/qq_14876133/85231123)

