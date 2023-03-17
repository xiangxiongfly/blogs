

## 微任务

- Dart通过事件循环执行代码，里面存放一个事件队列(Event Queue)，不断从事件列中取出事件执行
- Dart中还存在微任务队列，执行优先于事件队列

```dart
main(List<String> args) {
    print("start");

    Future(() => print("task1"));

    final future = Future(() => null);

    Future(() => print("task2")).then((_) {
        print("task3");
        scheduleMicrotask(() => print('task4-微任务'));
    }).then((_) => print("task5"));

    future.then((_) => print("task6-微任务"));

    scheduleMicrotask(() => print('task7-微任务'));

    Future(() => print('task8'))
        .then((_) => Future(() => print('task9')))
        .then((_) => print('task10'));

    print("end");
}
```

```
start
end
task7-微任务
task1
task6-微任务
task2
task3
task5
task4-微任务
task8
task9
task10
```

**流程分析**

- 1、main函数先执行，所以`main start`和`main end`先执行，没有任何问题；
- 2、main函数执行`过程中`，会将一些任务分别加入到`EventQueue`和`MicrotaskQueue`中；
- 3、task7通过`scheduleMicrotask`函数调用，所以它被最早加入到`MicrotaskQueue`，会被先执行；
- 4、然后开始执行`EventQueue`，task1被添加到`EventQueue`中被执行；
- 5、通过`final future = Future(() => null);`创建的future的then被添加到微任务中，微任务直接被优先执行，所以会执行task6；
- 6、一次在`EventQueue`中添加task2、task3、task5被执行；
- 7、task3的打印执行完后，调用`scheduleMicrotask`，那么在执行完这次的`EventQueue`后会执行，所以在task5后执行task4（注意：`scheduleMicrotask`的调用是作为task3的一部分代码，所以task4是要在task5之后执行的）
- 8、task8、task9、task10一次添加到`EventQueue`被执行；




