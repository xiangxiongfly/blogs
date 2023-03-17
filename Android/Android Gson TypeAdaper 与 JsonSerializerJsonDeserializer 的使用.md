[TOC]

# Android Gson TypeAdaper 与 JsonSerializer/JsonDeserializer 的使用

## TypeAdapter

### 概述

![在这里插入图片描述](https://img-blog.csdnimg.cn/f19c24de9b004401a4bffacd134a32cd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_9,color_FFFFFF,t_70,g_se,x_16)

-   TypeAdapter是一个泛型抽象类，提供两个抽象方法`write()`方法和`read()`方法，用于处理序列化和反序列化的过程。
-   TypeAdapter直接使用流来解析数据，极大程度提高了解析效率。



### 使用TypeAdapter

使用TypeAdapter操作JSON字符串，序列时，需要将Java中的address数组转为字符串；反序列化时，需要将JSON字符串中的address字段转为Java数组。

**创建Person实体类**

```java
class Person {
    private String name;
    private int age;
    private String[] address;

    //省略构造函数、getter/setter、toString()方法
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
                    person.setName(in.nextString());
                    break;
                case "age":
                    person.setAge(in.nextInt());
                    break;
                case "address":
                    in.beginArray();
                    final ArrayList<String> addressList = new ArrayList<>();
                    while (in.hasNext()) {
                        addressList.add(in.nextString());
                    }
                    person.setAddress(addressList.toArray(new String[addressList.size()]));
                    in.endArray();
                    break;
            }
        }
        in.endObject();
        return person;
    }

    //序列化
    @Override
    public void write(JsonWriter out, Person person) throws IOException {
        out.beginObject();
        out.name("name").value(person.getName());
        out.name("age").value(person.getAge());
        out.name("address").beginArray();
        for (String item : person.getAddress()) {
            out.value(item);
        }
        out.endArray();
        out.endObject();
    }
}
```

**使用**

```json
{"name":"小白","age":18,"address":["广东省","广州市","黄埔区"]}
```

```java
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();


//序列化
Person p1 = new Person("小白", 18, new String[]{"广东省", "广州市", "黄埔区"});
String jsonStr = gson.toJson(p1);
System.out.println(jsonStr);
//{"name":"小白","age":18,"address":["广东省","广州市","黄埔区"]}


//反序列化
String json = getJson();
Person p2 = gson.fromJson(json, Person.class);
System.out.println(p2);
//Person{name='小白', age=18, address=[广东省, 广州市, 黄埔区]}
```



### 处理简洁的JSON

序列化时，需要将Java对象转为JSON数组；反序列化时，需要将JSON数组转为指定的Java对象。

**定义PersonTypeAdapter**

```java
class PersonTypeAdapter extends TypeAdapter<Person> {
    //反序列化
    @Override
    public Person read(JsonReader in) throws IOException {
        final Person person = new Person();
        in.beginArray();
        person.setName(in.nextString());
        person.setAge(in.nextInt());
        final ArrayList<String> addressList = new ArrayList<>();
        while (in.hasNext()) {
            addressList.add(in.nextString());
        }
        person.setAddress(addressList.toArray(new String[addressList.size()]));
        in.endArray();
        return person;
    }

    //序列化
    @Override
    public void write(JsonWriter out, Person person) throws IOException {
        out.beginArray();
        out.value(person.getName());
        out.value(person.getAge());
        for (String item : person.getAddress()) {
            out.value(item);
        }
        out.endArray();
    }
}
```

**JSON数据**

```json
["小明",18,"广东省","广州市","黄浦区"]
```

**使用**

```java
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();

//反序列化
String json = getJson();
Person p1 = gson.fromJson(json, Person.class);
System.out.println(p1);
//Person{name='小明', age=18, address=[广东省, 广州市, 黄浦区]}

//序列化
Person p2 = new Person("小明", 18, new String[]{"广东省", "广州市", "黄浦区"});
String jsonStr = gson.toJson(p2);
System.out.println(jsonStr);
//["小明",18,"广东省","广州市","黄浦区"]
```



### 处理嵌套数据

对象嵌套对象的数据结构：

```json
{
    "name":"小明",
    "age":18,
    "addressList":[
        {
            "id":110,
            "addressName":"广东省"
        },
        {
            "id":220,
            "addressName":"广州市"
        },
        {
            "id":330,
            "addressName":"黄埔区"
        }
    ]
}
```

**定义Person类**

```java
class Person {
    private String name;
    private int age;
    private Address[] address;
}

class Address {
    private int id;
    private String addressName;
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
                    person.setName(in.nextString());
                    break;
                case "age":
                    person.setAge(in.nextInt());
                    break;
                case "addressList":
                    in.beginArray();
                    final ArrayList<Address> addressList = new ArrayList<>();
                    while (in.hasNext()) {
                        in.beginObject();
                        final Address address = new Address();
                        while (in.hasNext()) {
                            switch (in.nextName()) {
                                case "id":
                                    address.setId(in.nextInt());
                                    break;
                                case "addressName":
                                    address.setAddressName(in.nextString());
                                    break;
                            }
                        }
                        addressList.add(address);
                        in.endObject();
                    }
                    person.setAddress(addressList.toArray(new Address[addressList.size()]));
                    in.endArray();
                    break;
            }
        }
        in.endObject();
        return person;
    }

    //序列化
    @Override
    public void write(JsonWriter out, Person person) throws IOException {
        out.beginObject();
        out.name("name").value(person.getName());
        out.name("age").value(person.getAge());
        out.name("addressList").beginArray();
        for (Address address : person.getAddress()) {
            out.beginObject();
            out.name("id").value(address.getId());
            out.name("addressName").value(address.getAddressName());
            out.endObject();
        }
        out.endArray();
        out.endObject();
    }
}
```

**使用**

```java
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypeAdapter())
    .create();


//序列化
Person p1 = new Person("小明", 18,
                       new Address[]{new Address(110, "广东省"),
                                     new Address(220, "广州市"),
                                     new Address(330, "黄埔区")});
String jsonStr = gson.toJson(p1);
System.out.println(jsonStr);
//{"name":"小明","age":18,"addressList":[{"id":110,"addressName":"广东省"},{"id":220,"addressName":"广州市"},{"id":330,"addressName":"黄埔区"}]}


//反序列化
String json = getJson();
Person p2 = gson.fromJson(json, Person.class);
System.out.println(p2);
//Person{name='小明', age=18, address=[Address{id=110, addressName='广东省'}, Address{id=220, addressName='广州市'}, Address{id=330, addressName='黄埔区'}]}
```





## JsonSerializer & JsonDeserializer

## 概述

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2e7420442b045bbb24d5fd9652c02e8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhbmd4aW9uZ2ZseTkxNQ==,size_12,color_FFFFFF,t_70,g_se,x_16)

-   `TypeAdapter`将序列化和反序列操作都接管了过来，可以通过`JsonSerializer`和`JsonDeserializer`只处理其中一个。
-   JsonSerializer & JsonDeserializer 在解析都会利用中间件——JsonElement。



### 使用JsonSerializer & JsonDeserializer 

**定义Person类**

```java
class Person {
    private String name;
    private int age;
    private String[] address;
}
```

**定义PersonTypAdapter类**

```java
class PersonTypAdapter implements JsonSerializer<Person>, JsonDeserializer<Person> {

    //反序列化
    @Override
    public Person deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        final Person person = new Person();
        JsonObject jsonObject = json.getAsJsonObject();
        if (jsonObject.has("name")) {
            person.setName(jsonObject.get("name").getAsString());
        }
        if (jsonObject.has("age")) {
            person.setAge(jsonObject.get("age").getAsInt());
        }
        if (jsonObject.has("address")) {
            JsonArray jsonArray = jsonObject.getAsJsonArray("address");
            ArrayList<String> addressList = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                addressList.add(jsonArray.get(i).getAsString());
            }
            person.setAddress(addressList.toArray(new String[jsonArray.size()]));
        }
        return person;
    }

    //序列化
    @Override
    public JsonElement serialize(Person person, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", person.getName());
        jsonObject.addProperty("age", person.getAge());
        JsonArray jsonArray = new JsonArray();
        for (String item : person.getAddress()) {
            jsonArray.add(item);
        }
        jsonObject.add("address", jsonArray);
        return jsonObject;
    }
}
```

**使用**

```java
Gson gson = new GsonBuilder()
    .registerTypeAdapter(Person.class, new PersonTypAdapter())
    .create();


//序列化
Person p1 = new Person("小白", 18, new String[]{"广东省", "广州市", "黄埔区"});
String jsonStr = gson.toJson(p1);
System.out.println(jsonStr);
//{"name":"小白","age":18,"address":["广东省","广州市","黄埔区"]}


//反序列化
String json = getJson();
Person p2 = gson.fromJson(json, Person.class);
System.out.println(p2);
//Person{name='小白', age=18, address=[广东省, 广州市, 黄埔区]}
```



### @JsonAdapter

还可以使用`@JsonAdapter`注解，效果与`registerTypeAdapter`基本一样，注解的优先级高于`registerTypeAdapter()`方法

```java
@JsonAdapter(PersonTypAdapter.class)
class Person {
    private String name;
    private int age;
    private String[] address;
}
```



## TypeAdapterFactory

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


