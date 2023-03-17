## 移除字符串中的元音字母

**Java版**

```java
private static void foo(String str) {
    StringBuilder builder = new StringBuilder();
    char[] chars = str.toCharArray();
    for (char c : chars) {
        if (c != 'a' && c != 'e' && c != 'i' && c != 'o' && c != 'u') {
            builder.append(c);
        }
    }
    String result = builder.toString();
    System.out.println(result);
}
```

**Kotlin版**

```kotlin
fun foo(str: String) {
    val result = str.filter { it !in setOf('a', 'e', 'i', 'o', 'u') }
    println(result)
}
```



## 冒泡排序

```kotlin
fun sort(arr: IntArray): IntArray {
    var swap: Boolean;
    for (i in 0 until arr.size - 1) {
        swap = false
        for (j in 0 until arr.size - 1 - i) {
            if (arr[j] > arr[j + 1]) {
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp;
                swap = true
            }
        }
        if (!swap) {
            break
        }
    }
    return arr
}
```



## 版本号判断

**方案一**

```kotlin
fun compareVersion(version1: String, version2: String): Int {
    val list1 = version1.split(".")
    val list2 = version2.split(".")
    var i = 0;
    while (i < list1.size || i < list2.size) {
        val v1 = list1.getOrNull(i)?.toInt() ?: 0
        val v2 = list2.getOrNull(i)?.toInt() ?: 0
        if (v1 != v2) {
            return v1.compareTo(v2)
        }
        i++
    }
    return 0
}
```

**方案二**

```kotlin
fun compareVersion(version1: String, version2: String): Int {
    val length1 = version1.length
    val length2 = version2.length
    var i = 0
    var j = 0

    while (i < length1 || j < length2) {
        var x = 0
        while (i < length1 && version1[i] != '.') {
            x = x * 10 + version1[i].toInt() - '0'.toInt()
            i++
        }
        i++

        var y = 0
        while (j < length2 && version2[j] != '.') {
            y = y * 10 + version2[j].toInt() - '0'.toInt()
            j++
        }
        j++

        if (x != y) {
            return x.compareTo(y)
        }
    }
    return 0
}
```

















