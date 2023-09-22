[toc]

# Android JSON解析总结

## 概述

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式

![在这里插入图片描述](https://img-blog.csdnimg.cn/d28f873568974118961716b9b10617ee.png)



## 语法

JSON有2种结构：

- 对象（Object）：JSON中的对象表示为花括号{}中的键值对集合。键和值之间用冒号`:`连接，键值对之间用逗号`,`连接。
- 数组（Array）：JSON中的数组表示为方括号[]中的值列表。数组元素之间用逗号`,`连接。



## 使用Android的org.json处理

### 生成JSON

```java
private void toJson() throws Exception {
    JSONObject schoolObject = new JSONObject();
    schoolObject.put("teacher", school.teacher);
    schoolObject.put("schoolRanking", school.schoolRanking);
    JSONArray studentArray = new JSONArray();
    for (Student student : school.students) {
        JSONObject studentObject = new JSONObject();
        studentObject.put("name", student.name);
        studentObject.put("age", student.age);
        studentObject.put("sex", student.sex);
        studentArray.put(studentObject);
    }
    schoolObject.put("students", studentArray);

    FileOutputStream outputStream = new FileOutputStream(new File(getCacheDir(), "test.json"));
    outputStream.write(schoolObject.toString().getBytes());
    outputStream.close();
}
```

### 解析JSON

```java
private void parseJson() throws Exception {
    BufferedReader fileReader = new BufferedReader(new FileReader(new File(getCacheDir(), "test.json")));
    StringBuilder builder = new StringBuilder();
    char[] buffer = new char[3];
    int len;
    while ((len = fileReader.read(buffer)) != -1) {
        builder.append(buffer, 0, len);
    }
    fileReader.close();

    JSONObject jsonObject = new JSONObject(builder.toString());
    JSONArray studentsArray = jsonObject.getJSONArray("students");
    ArrayList<Student> students = new ArrayList<>();
    for (int i = 0; i < studentsArray.length(); i++) {
        JSONObject studentObject = studentsArray.getJSONObject(i);
        String name = studentObject.getString("name");
        int age = studentObject.getInt("age");
        String sex = studentObject.getString("sex");
        students.add(new Student(name, age, sex));
    }
    String teacher = jsonObject.getString("teacher");
    int schoolRanking = jsonObject.getInt("schoolRanking");
    School school = new School(teacher, schoolRanking, students);
    Log.e("TAG", "school " + school);
}
```

