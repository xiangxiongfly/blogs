[TOC]

# Dart 异步编程

## 概述

- 同步编程指按照代码的编写顺序依次执行；异步编程指利用系统资源并行执行多个任务，提高执行效率。

- Dart是单线程的、支持异步编程的语言。

- 开发者通过async/await实现异步编程。

  

## Future

- Future表示一个异步任务的最终完成或失败及其结果值得表示，一个Future只会对应一个结果：成功或失败，Future的返回值仍然是一个Future对象。
- Future在执行过程可以划分为两种状态：
  - 未完成状态：执行Future内部的任务
  - 完成状态：当Future内部的任务执行完成，通常会返回一个值或抛出一个异常

### then & catchError & whenComplete

```dart
void main(List<String> args) {
    print("start");

    Future(() {
        sleep(Duration(seconds: 2));
        print("执行任务");
        return "hello";
        // throw Exception("发生异常了");
    }).then((value) {
        print("value: $value");
    }).catchError((error) {
        print("error: $error");
    }).whenComplete(() {
        print("执行完毕!!!");
    });

    print("end");
}
```

```
start
end
执行任务
value: hello
执行完毕!!!
```



### Future.value() 

直接获取一个完成的Future，会直接调用then函数。

```dart
void main(List<String> args) {
    print("start");
    Future.value("hello").then((value) {
        print(value);
    });
    print("end");
}
```

```
start
end
hello
```



```dart
main(List<String> args) {
    Future(() {
        return "hello";
    }).then((value) {
        return value + " world";
    }).then((value) {
        print(value);
    });
}
```

```
hello world
```



### Future.error()

```dart
void main(List<String> args) {
    print("start");
    Future.error(Exception("这是一个异常")).catchError((error) {
        print(error);
    });
    print("end");
}
```

```dart
start
end
Exception: 这是一个异常

```



### Future.delayed()

延迟执行任务。

```dart
void main(List<String> args) {
    print("start");
    Future.delayed(Duration(seconds: 2), () {
        return "hello world";
    }).then((value) {
        print(value);
    });
    print("end");
}
```

```
start
end
hello world
```



### Future.wait()

等待多个异步任务执行完后进行操作。

```dart
void main(List<String> args) {
    print("start");
    Future.wait([
        Future.delayed(Duration(seconds: 2), () {
            return "hello";
        }),
        Future.delayed(Duration(seconds: 3), () {
            return "world";
        })
    ]).then((value) {
        print("成功：$value");
    }).catchError((error) {
        print("失败：$error");
    });
    print("end");
}
```

```
start
end
成功：[hello, world]
```



### timeout()

Future超时处理。

```dart
void main(List<String> args) {
    print("start");
    Future.delayed(const Duration(seconds: 2), () {
        return "hello world";
    }).timeout(const Duration(seconds: 1), onTimeout: () {
        return "timeout";
    }).then((value) {
        print(value);
    });
    print("end");
}
```

```
start
end
timeout
```



### doWhilte()

循环执行任务

```dart
void main(List<String> args) async {
    print("start");
    int count = 0;
    await Future.doWhile(() async {
        await Future.delayed(const Duration(seconds: 1));
        count++;
        print(count);
        return count > 3 ? false : true;
    });
    print("end");
}
```

````
start
1
2
3
4
end
````



## async/await

- `async/await`可以实现用同步的代码格式实现异步的调用过程
- `async`用于声明函数，表示这个函数是异步函数，其返回值类型是Future
- `await`后面是一个Future，表示会等待异步任务执行完后才会往下走，await必须在async函数内部

### 基本用法

```dart
void main(List<String> args) {
    print("start");
    getTask().then((value) {
        print(value);
    });
    print("end");
}

Future<String> getTask() async {
    print(1);
    var result = await Future.delayed(Duration(seconds: 2), () {
        return "hello";
    });
    print(2);
    return result + " world";
}
```

```dart
start
1
end
2
hello world
```



### 处理地狱回调

举个例子：如现在有个需求是用户先登陆，登陆成功后获取用户id，通过用户id请求接口，获取到用户个人信息后进行数据缓存。

#### 使用Future

```dart
void main(List<String> args) {
    login("Tom", "666").then((value) {
        return getUserInfo(value);
    }).then((value) {
        saveUserInfo(value);
    }).catchError((e) {
        print(e);
    });
}

Future<String> login(String username, String password) {
    print("请求接口：登陆成功");
    return Future.value("123456");
}

Future<String> getUserInfo(String id) {
    print("请求接口：用户信息");
    return Future.value("这是一些用户信息");
}

saveUserInfo(String userInfo) {
    print("缓存：$userInfo");
}
```

```
请求接口：登陆成功
请求接口：用户信息
缓存这是一些用户信息
```



#### 使用async/await

```dart
void main(List<String> args) {
    handleTask();
}

void handleTask() async {
    String id = await login("Tom", "666");
    String userInfo = await getUserInfo(id);
    saveUserInfo(userInfo);
}
```



## 生成器

生成器函数可以延迟生成一连串的值。

### Iterable

同步生成器。

-   使用`sync*`关键字声明函数。
-   使用`yield`关键字传递值。

```dart
void main() {
    var iterator = generator(10).iterator;
    while (iterator.moveNext()) {
        print(iterator.current);
    }
}

Iterable<int> generator(int n) sync* {
    int k = 0;
    while (k < n) 
        yield k++;
}

/*
0
1
2
3
4
5
6
7
8
9
 */
```



### Stream

异步生成器。

-   使用`async*`关键字声明函数，返回值类型是Stream。

```dart
void main() {
    var stream = generator(10).listen(null);
    stream.onData((data) {
        print(data);
    });
}

Stream<int> generator(int n) async* {
    int k = 0;
    while (k < n) yield k++;
}

/*
0
1
2
3
4
5
6
7
8
9
 */
```

Stream也可以接收异步任务数据，与Future不同的是，它可以接收多个异步任务的结果（成功或失败）。

```dart
void main(List<String> args) {
    Stream.fromFutures([
        Future.delayed(Duration(seconds: 1), () {
            return "hello";
        }),
        Future.delayed(Duration(seconds: 2), () {
            throw Exception("异常了");
        }),
        Future.delayed(Duration(seconds: 3), () {
            return "world";
        })
    ]).listen((event) {
        print(event);
    }, onError: (e) {
        print(e.message);
    }, onDone: () {
        print("onDone");
    });
}
```

```
hello
异常了
world
onDone
```



## Future任务原理说明

大多数操作系统（Windows、Linux）的任务调度都是采用时间片轮转的抢占式调度方式，对于单核CPU来说，并行执行两个任务，实际上是CPU在进行快速的切换，对用户来讲感觉不到切换停顿。

-   时间片：任务执行的一段时间称为时间片。
-   运行状态：任务正在执行时的状态称为运行状态。
-   就绪状态：任务执行一段时间后被强制暂停去执行下一个任务，被暂停的任务就处在就绪状态。
-   任务调度：就绪状态会等待下一个时间片的到来，任务的暂停与执行切换，称为任务调度。

Dart是单线程模型的语言，所以在Flutter中，异步任务实际上是单线程通过任务调度优先级来实现的。

Dart中的线程机制被称为isolate，在Flutter项目中，运行中的Flutter程序由一个或多个isolate组成。默认情况下启动的Flutter项目，通过main函数启动就是创建一个main isolate。每个isolate内部都维护着一个事件循环（Event Loop）和两个队列（event queue 和 microtask queue），isolate之间都是相互独立的。当Flutter程序触发点击事件、IO事件、网络事件时，他们都会加入到eventLoop中，eventLoop一直在循环中，当主线程发现事件队列不为空时，就会取出事件并执行。

![在这里插入图片描述](https://img-blog.csdnimg.cn/580141db258a4910a2487212ec87c4b9.png)

