[TOC]

# Java IO总结

## 概述

按照数据流动方向，以内存为基准，可分为：输入流和输出流，即流向内存指输入流，也叫读取数据，流出内存指输出流，也叫写出数据。

按照数据传输单位可分为：子节流和字符流。

在Java的IO体系中，主要位于`java.io`包下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200111222525785.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



## File

`java.io.File`类表示文件和目录。当传入一个文件路径时，File代表一个文件；当传入一个目录路径时，File代表一个目录。

### 创建File对象

```java
File file = new File(path);
File file2 = new File(parentPath, child);
File file3 = new File(parentDir, child);
```

### 常用方法

| 方法                 | 说明                               |
| :------------------- | :--------------------------------- |
| exists()             | 文件或目录是否存在                 |
| getName()            | 获取文件或目录名称                 |
| getPath()            | 获取文件或目录路径                 |
| isDirectory()        | 是否为目录                         |
| isFile()             | 是否为文件                         |
| createNewFile()      | 若文件不存在，则创建新文件         |
| delete()             | 删除文件或目录                     |
| renameTo(File)       | 重命名文件或目录                   |
| mkdir()              | 创建单级目录                       |
| mkdirs()             | 创建多级目录                       |
| File[] list()        | 输出该路径下所有的文件或目录的名称 |
| String[] listFiles() | 输出该路径下所有的文件或目录       |

### 递归遍历所有文件

```java
File dir = new File("./");
recursion(dir);

public static void recursion(File file) {
    if (!file.isDirectory()) {
        return;
    }

    File[] files = file.listFiles();
    if (files != null && files.length > 0) {
        for (File f : files) {
            if (f.isDirectory()) {
                recursion(f);
            } else {
                System.out.println(f);
            }
        }
    }
}
```



## 字节流

在Java中，处理子节流的类为`InputStream`和`OutputStream`，分别为输入流和输出流。

`InputStream`抽象类是所有字节输入流的父类，`OutputStream`抽象类是所有字节输出流的父类。

**InputStream通用方法**

```java
//读取下一个字节
public abstract int read()
//读取字节数组并返回长度
public int read(byte b[])
//读取字节数组指定位置和长度，并返回长度
public int read(byte b[], int off, int len)
//关闭流
public void close() 
```

**OutputStream通用方法**

```java
//输出指定字节
public void write(byte b[])
public abstract void write(int b)
public void write(byte b[], int off, int len)
//刷新流，只能用于缓冲流
public void flush()
//关闭输出流
public void close()
```

### FileInputStream

FileInputStream是专门操作文件流的。

```java
try (InputStream inputStream = new FileInputStream("text.txt")) {
    System.out.println((char) inputStream.read());
    System.out.println((char) inputStream.read());
} catch (IOException e) {
    e.printStackTrace();
}
```

### FileOutputStream

FileOutputStream是专门操作文件流的。

```java
try (OutputStream outputStream = new FileOutputStream("text.txt")) {
    outputStream.write('a');
    outputStream.write('b');
} catch (IOException e) {
    e.printStackTrace();
}
```



### 文件复制

```java
File srcFile = new File("text.txt");
File parentFile = new File("./copy");
if (!parentFile.exists()) {
    parentFile.mkdirs();
}
File destFile = new File(parentFile, "copy.txt");
FileInputStream fis = null;
FileOutputStream fos = null;
try {
    fis = new FileInputStream(srcFile);
    fos = new FileOutputStream(destFile);
    byte[] buffer = new byte[1024];
    int len;
    while ((len = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, len);
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (fos != null) {
        try {
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## 字符流

`Reader`抽象类是所有字符输入流的父类。`Writer`抽象类是所有字符输出流的父类。

**Reader通用方法**

```java
//读取一个字符
public int read() 
//读取字符数组并返回长度
public int read(char cbuf[])
//读取字符数组指定长度和位置并返回长度
public int read(char cbuf[], int off, int len) 
//关闭流
public void close()
```

**Writer通用方法**

```java
//输出数据
public void write(int c)
public void write(char cbuf[]) 
public void write(char cbuf[], int off, int len)
public void write(String str) 
public void write(String str, int off, int len) 
//刷新流
public void flush()
//关闭输出流
public void close()
```

### FileReader

```java
try (Reader reader = new FileReader("text.txt")) {
    char[] ch = new char[2];
    int len = reader.read(ch);
    System.out.println(new String(ch, 0, len));
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```

### FileWriter

```java
try (Writer writer = new FileWriter("text.txt")) {
    writer.write(97);
    writer.write('B');
    writer.write("hello");
    writer.write("我");
} catch (IOException e) {
    e.printStackTrace();
}
```

### 文件复制

```java
FileReader fr = null;
FileWriter fw = null;
try {
    fr = new FileReader("text.txt");
    fw = new FileWriter("new_text.txt");
    char[] buffer=new char[3];
    int len;
    while ((len = fr.read(buffer)) != -1) {
        fw.write(buffer, 0, len);
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (fw != null) {
        try {
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    if(fr!=null){
        try {
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## 转换流

InputStreamReader  / OutputStreamWriter：字节流转字符流

```java
//读取数据
try (InputStream inputStream = new FileInputStream("text.txt");
     Reader reader = new InputStreamReader(inputStream);
     BufferedReader bufferedReader = new BufferedReader(reader)) {
    String s = bufferedReader.readLine();
    System.out.println(s);
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}

//写入数据
try (OutputStream outputStream = new FileOutputStream("text.txt");
     Writer writer = new OutputStreamWriter(outputStream);
     BufferedWriter bufferedWriter = new BufferedWriter(writer);) {
    bufferedWriter.write(65);
    bufferedWriter.write("B");
    bufferedWriter.write("hello 沃德");
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```



## 缓冲流

缓冲流，BufferedInputStream / BufferedOutputStream /  BufferedReader / BufferedReader：减少调用本地API的次数优化流的输入和输出。

**文件复制：**

```java
try (
    InputStream inputStream = new BufferedInputStream(new FileInputStream("text.txt"));
    OutputStream outputStream = new BufferedOutputStream(new FileOutputStream("new_text.txt"))
) {
    byte[] buffer = new byte[1024];
    int len = 0;
    while ((len = inputStream.read(buffer)) != -1) {
        outputStream.write(buffer, 0, len);
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```



## 数据流

数据流用于处理基本数据类型和字符串值的。`DataInputStream`和`DataOutputStream`是其实现类。

```java
double[] doubles = {1.1, 2.2, 3.3};
int[] ints = {10, 20, 30};
String[] strings = {"hello", "world", "java"};

//写入
try (DataOutputStream output = new DataOutputStream(
    new BufferedOutputStream(
        new FileOutputStream("text.txt")))
    ) {
    for (int i = 0; i < doubles.length; i++) {
        output.writeDouble(doubles[i]);
        output.writeInt(ints[i]);
        output.writeUTF(strings[i]);
    }
} catch (Exception e) {
    e.printStackTrace();
}

//读取
try (DataInputStream input = new DataInputStream(
    new BufferedInputStream(
        new FileInputStream("text.txt")))
    ) {
    double x = input.readDouble();
    int y = input.readInt();
    String z = input.readUTF();
} catch (Exception e) {
    e.printStackTrace();
}
```



## 对象流

将对象转换为字节序列的方式输出称为对象流或序列化流，反之为反序列化流，序列化的对象必须实现`Serializable`接口。`ObjectOutputStream`和`ObjectInputStream`是其实现类。

```java
public class Person implements Serializable {
    private String name;
    private int age;
    //省略构造器、get()/set()、toString()
}

//序列化操作
File file = new File("text.txt");
Person person = new Person("小白", 18);
try (OutputStream outputStream = new FileOutputStream(file);
     ObjectOutputStream objectOutputStream = new ObjectOutputStream(outputStream)) {
    objectOutputStream.writeObject(person);
} catch (IOException e) {
    e.printStackTrace();
}

//反序列化流
File file = new File("person.txt");
FileInputStream fis = new FileInputStream(file);
ObjectInputStream ois = new ObjectInputStream(fis);
Person p = (Person) ois.readObject();
System.out.println(p.toString());
ois.close();
fis.close();
```



## RandomAccessFile

RandomAccessFile是一个可以随机读写文件的类，它允许我们在任何位置读取或写入数据。

**写入操作：**

```java
public class Test {
    public static void main(String[] args) {
        File file = new File("./test.txt");
        RandomAccessFile randomAccessFile = null;
        try {
            randomAccessFile = new RandomAccessFile(file, "rw");
            randomAccessFile.seek(10000);
            printFileLength(randomAccessFile); //文件大小: 0  指针偏移量: 10000

            //设置文件大小
            randomAccessFile.setLength(10000);
            printFileLength(randomAccessFile); //文件大小: 10000  指针偏移量: 10000

            //会先写入2个字节，用于记录字符串长度
            // 在UTF-8中，一个英文占1个字节，一个汉字占3个字节
            randomAccessFile.writeUTF("哈喽哈喽");
            printFileLength(randomAccessFile); //文件大小: 10014  指针偏移量: 10014

            //在UTF-8中，每个字符占2个字节
            randomAccessFile.writeChar('a');
            randomAccessFile.writeChars("ABCD");
            printFileLength(randomAccessFile); //文件大小: 10024  指针偏移量: 10024

            //移动指针到5000的位置
            randomAccessFile.seek(5000);
            //插入100个字符，会覆盖后面的200个字节
            char[] chars = new char[100];
            for (int i = 0; i < chars.length; i++) {
                chars[i] = 'a';
                randomAccessFile.writeChar(chars[i]);
            }
            printFileLength(randomAccessFile); //文件大小: 10024  指针偏移量: 5200

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (randomAccessFile != null) {
                try {
                    randomAccessFile.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 打印文件大小和指针偏移量
     */
    private static void printFileLength(RandomAccessFile randomAccessFile) throws IOException {
        System.out.println("文件大小: " + randomAccessFile.length() + "  指针偏移量: " + randomAccessFile.getFilePointer());
    }
}
```

**读取操作：**

```java
File file = new File("./test.txt");
RandomAccessFile randomAccessFile = null;
try {
    randomAccessFile = new RandomAccessFile(file, "r");

    //移动指针，读取字符串”哈喽哈喽“
    randomAccessFile.seek(10000);
    System.out.println(randomAccessFile.readUTF()); //哈喽哈喽

    //移动指针，读取100个字符"a"
    randomAccessFile.seek(5000);
    byte[] bytes = new byte[200];
    randomAccessFile.read(bytes);
    System.out.println(new String(bytes));

    //移动指针，读取字符"aABCD"
    byte[] bytes2 = new byte[10];
    randomAccessFile.seek(1014);
    randomAccessFile.read(bytes2);
    System.out.println(new String(bytes2)); // a A B C D
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (randomAccessFile != null) {
        try {
            randomAccessFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## Properties

Properties表示一个持久的属性集，它使用键值对结构。

文件中的数据必须是键值对形式。

```
name=Tom
age=18
address=beijing
```

```java
Properties properties = new Properties();
try (InputStream inputStream = new FileInputStream("text.txt")) {
    properties.load(inputStream);
    Set<String> nameSet = properties.stringPropertyNames();
    for (String key : nameSet) {
        System.out.println(key + ":" + properties.getProperty(key));
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```



## 流的关闭

GC的运行的时间点是不确定点，另外GC只能回收内存，至于各种stream之类，它们下边一般还开启了各种其他的资源，如文件，这就导致需要及时关闭避免资源消耗。

### JDK7之前

在JDK7之前需要调用`close()`，关闭顺序：先关闭外层流，再关闭内层流；先打开的后关闭，后打开的先关闭。

### JDK7之后

JDK7后可以使用try-with-resources，会自动调用`close()`.

```java
try (
    InputStream inputStream = new BufferedInputStream(new FileInputStream("text.txt"));
    OutputStream outputStream = new BufferedOutputStream(new FileOutputStream("new_text.txt"))
) {
    byte[] buffer = new byte[1024];
    int len = 0;
    while ((len = inputStream.read(buffer)) != -1) {
        outputStream.write(buffer, 0, len);
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```


