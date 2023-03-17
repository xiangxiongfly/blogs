[TOC]

# Flutter 日期时间组件

## 日期弹窗组件

```dart
var result = await showDatePicker(
    context: context,
    initialDate: DateTime.now(),
    firstDate: DateTime(2020),
    lastDate: DateTime(2025),
    helpText: "选择日期",
    confirmText: "确定",
    cancelText: "取消",
);
print("日期 $result");
```

## 日期组件

```dart
CalendarDatePicker(
    initialDate: DateTime.now(),
    firstDate: DateTime(2020),
    lastDate: DateTime(2025),
    onDateChanged: (DateTime dateTime) {
        print("日期 $dateTime");
    },
)
```

## 日期范围组件

```dart
var date = await showDateRangePicker(
    context: context,
    firstDate: DateTime(2020),
    lastDate: DateTime(2025),
);
print("日期范围：$date");
```

## 时间弹窗组件

```dart
var result = await showTimePicker(
    context: context,
    initialTime: TimeOfDay.now(),
);
print("时间 $result");
```

## ios风格日期组件

```dart
CupertinoDatePicker(
    mode: CupertinoDatePickerMode.date,
    initialDateTime: DateTime.now(),
    onDateTimeChanged: (DateTime dateTime) {
        print("ios风格日期选择器：$dateTime");
    },
)
```

## ios风格时间组件

```dart
CupertinoTimerPicker(
    initialTimerDuration: Duration(
        hours: DateTime.now().hour,
        minutes: DateTime.now().minute,
        seconds: DateTime.now().second,
    ),
    onTimerDurationChanged: (Duration time) {
        print("ios风格时间选择器：$time");
    },
)
```



