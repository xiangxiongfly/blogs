[TOC]

# Flutter 内外边距

## Padding

```dart
Padding(
    padding: EdgeInsets.all(20),
    child: Text("hello"),
),
Padding(
    padding: EdgeInsets.only(left: 20, top: 20, right: 20, bottom: 20),
    child: Text("hello"),
),
Padding(
    padding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
    child: Text("hello"),
)
```



## Margin

```dart
Container(
    margin: const EdgeInsets.all(20),
    child: const Text("hello"),
),
Container(
    margin: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
    child: const Text("hello"),
),
Container(
    margin: const EdgeInsets.only(left: 20, top: 20, right: 20, bottom: 20),
    child: const Text("hello"),
)
```

