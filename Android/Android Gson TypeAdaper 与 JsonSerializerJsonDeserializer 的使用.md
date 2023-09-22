[TOC]

# Android Gson TypeAdaper 和 JsonSerializer/JsonDeserializer  总结

## 概述

在Gson中，TypeAdapter 和 JsonSerializer 是两个用于定制序列化和反序列化过程的接口。

- JsonSerializer则是Gson中的默认实现，它提供了一种简单的序列化和反序列化方式，可以将Java对象转换为JSON字符串或将JSON字符串转换为Java对象。
- TypeAdapter是Gson提供的一个抽象类，用于接管某种类型的序列化和反序列化过程，包含两个重要方法：`write(JsonWriter out, T value)` 和 `read(JsonReader in)`。



## JsonSerializer & JsonDeserializer

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2e7420442b045bbb24d5fd9652c02e8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)

-   JsonSerializer接口用于定制JSON序列化过程，允许你自定义如何将Java对象转换为JSON字符串。通过实现JsonSerializer接口，你可以定义如何处理Java对象的属性、如何给属性添加自定义的命名、甚至可以改变序列化过程中的某些行为。
-   JsonDeserializer接口则用于定制JSON反序列化过程，允许你自定义如何将JSON字符串转换为Java对象。通过实现JsonDeserializer接口，你可以定义如何解析JSON数据、如何将JSON属性映射到Java对象的属性、甚至可以改变反序列化过程中的某些行为。



### 使用

**定义Person类**

```java
class Person {
    public String name;
    public int age;
    public String[] address;
}
```

**定义PersonSerializer类**

```java
class PersonSerializer implements JsonSerializer<Person>, JsonDeserializer<Person> {

    //反序列化
    @Override
    public Person deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        final Person person = new Person();
        JsonObject jsonObject = json.getAsJsonObject();
        if (jsonObject.has("name")) {
            JsonElement nameJsonEl = jsonObject.get("name");
            if (nameJsonEl.isJsonPrimitive() && nameJsonEl.getAsJsonPrimitive().isString()) {
                String name = nameJsonEl.getAsString();
                person.name = name;
            }
        }
        if (jsonObject.has("age")) {
            JsonElement ageJsonEl = jsonObject.get("age");
            if (ageJsonEl.isJsonPrimitive() && ageJsonEl.getAsJsonPrimitive().isNumber()) {
                int age = ageJsonEl.getAsInt();
                person.age = age;
            }
        }
        if (jsonObject.has("address")) {
            JsonElement addressJsonEl = jsonObject.get("address");
            if (addressJsonEl.isJsonArray()) {
                String[] address = context.deserialize(addressJsonEl, String[].class);
                person.address = address;
            }
        }
        return person;
    }

    //序列化
    @Override
    public JsonElement serialize(Person src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", src.name);
        jsonObject.addProperty("age", src.age);
        JsonArray jsonArray = new JsonArray(src.address.length);
        for (String item : src.address) {
            jsonArray.add(item);
        }
        jsonObject.add("address", jsonArray);
        return jsonObject;
    }
}
```

#### 序列化：

```java
Person person = new Person("小明", 18, new String[]{"广东省", "广州市"});
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonSerializer())
    .create();
String jsonStr = gson.toJson(person);
System.out.println(jsonStr);
```

输出信息：

```
{"name":"小明","age":18,"address":["广东省","广州市"]}
```

#### 反序列化：

```java
String jsonStr = "{\n" +
    "    \"name\":\"小明\",\n" +
    "    \"age\":18,\n" +
    "    \"address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\"\n" +
    "    ]\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonSerializer())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='小明', age=18, address=[广东省, 广州市]}
```

#### 数据为null情况：

```java
String jsonStr = "{\n" +
    "    \"name\":null,\n" +
    "    \"age\":null,\n" +
    "    \"address\":null\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonSerializer())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='null', age=0, address=null}
```

#### 数据有问题情况：

```java
String jsonStr = "{\n" +
    "    \"name\":true,\n" +
    "    \"age\":true,\n" +
    "    \"address\":true\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonSerializer())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='null', age=0, address=null}
```



### @JsonAdapter

还可以使用`@JsonAdapter`注解，效果与`registerTypeAdapter`基本一样，注解的优先级高于`registerTypeAdapter()`方法

```java
@JsonAdapter(PersonSerializer.class)
class Person {
    public String name;
    public int age;
    public String[] address;
}
```

```java
String jsonStr = "{\n" +
    "    \"name\":\"小明\",\n" +
    "    \"age\":18,\n" +
    "    \"address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\"\n" +
    "    ]\n" +
    "}";
Gson gson = new Gson();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```



## TypeAdapter

![在这里插入图片描述](https://img-blog.csdnimg.cn/f19c24de9b004401a4bffacd134a32cd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_9,color_FFFFFF,t_70,g_se,x_16)

-   Gson的TypeAdapter是一个抽象类，用于处理序列化和反序列化过程，包含两个重要方法：write(JsonWriter out, T value)和read(JsonReader in)。
-   TypeAdapter直接使用流来解析数据，极大程度提高了解析效率。



### 使用

**定义Person类**

```java
class Person {
    public String name;
    public int age;
    public String[] address;
}
```

**定义PersonTypeAdapter类**

```java
class PersonTypeAdapter extends TypeAdapter<Person> {

    //反序列化
    @Override
    public Person read(JsonReader in) throws IOException {
        final Person person = new Person();
        in.beginObject();
        while (in.hasNext()) {
            switch (in.nextName()) {
                case "name":
                    if (in.peek() == JsonToken.STRING) {
                        String name = in.nextString();
                        person.name = name;
                    } else {
                        in.skipValue();
                    }
                    break;
                case "age":
                    if (in.peek() == JsonToken.NUMBER) {
                        int age = in.nextInt();
                        person.age = age;
                    } else {
                        in.skipValue();
                    }
                    break;
                case "address":
                    if (in.peek() == JsonToken.BEGIN_ARRAY) {
                        in.beginArray();
                        ArrayList<String> addressList = new ArrayList<>();
                        while (in.hasNext()) {
                            addressList.add(in.nextString());
                        }
                        person.address = addressList.toArray(new String[0]);
                        in.endArray();
                    } else {
                        in.skipValue();
                    }
                    break;
                default:
                    in.skipValue();
            }
        }
        in.endObject();
        return person;
    }

    //序列化
    @Override
    public void write(JsonWriter out, Person value) throws IOException {
        out.beginObject();
        out.name("name").value(value.name);
        out.name("age").value(value.age);
        out.name("address").beginArray();
        for (String item : value.address) {
            out.value(item);
        }
        out.endArray();
        out.endObject();
    }
}
```

#### 序列化：

```java
Person person = new Person("小明", 18, new String[]{"广东省", "广州市"});
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();
String jsonStr = gson.toJson(person);
System.out.println(jsonStr);
```

输出信息：

```
{"name":"小明","age":18,"address":["广东省","广州市"]}
```

#### 反序列化：

```java
String jsonStr = "{\n" +
    "    \"name\":\"小明\",\n" +
    "    \"age\":18,\n" +
    "    \"address\":[\n" +
    "        \"广东省\",\n" +
    "        \"广州市\"\n" +
    "    ]\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='小明', age=18, address=[广东省, 广州市]}
```

#### 数据为null时：

```java
String jsonStr = "{\n" +
    "    \"name\":null,\n" +
    "    \"age\":null,\n" +
    "    \"address\":null\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='null', age=0, address=null}
```

#### 数据有问题情况：

```java
String jsonStr = "{\n" +
    "    \"name\":true,\n" +
    "    \"age\":true,\n" +
    "    \"address\":true\n" +
    "}";
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();
Person person = gson.fromJson(jsonStr, Person.class);
System.out.println(person);
```

输出信息：

```
Person{name='null', age=0, address=null}
```



### registerTypeAdapterFactory

TypeAdapterFactory 是用于创建 TypeAdapter 的工厂类，通过参数 TypeToken 来查找确定对应的 TypeAdapter，如果没有就返回 null 并由 Gson 默认的处理方法来进行序列化和反序列化操作，否则就由用户预定义的 TypeAdapter 来进行处理。

优先执行`registerTypeAdapter()`方法，然后在执行`registerTypeAdapterFactory()`方法。

```java
Gson gson = new GsonBuilder()
    .registerTypeAdapterFactory(new TypeAdapterFactory() {
        @Override
        public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
            if (type.getType().getTypeName().equals(Person.class.getTypeName())) {
                return (TypeAdapter<T>) new PersonTypeAdapter();
            }
            return null;
        }
    })
    .create();
```

