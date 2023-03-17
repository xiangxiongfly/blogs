[TOC]

# Kotlin实现单词频率统计功能

## 命令式风格代码

**定义单词频率类**

```kotlin
data class WordFrequency(val word: String, val count: Int)
```

**定义处理类**

```kotlin
class WordProcessor {

    /**
     * 处理
     */
    fun processText(text: String): List<WordFrequency> {
        val cleaned = clean(text)
        val words = cleaned.split(" ")
        val map = getWordCount(words)
        val list = sortByCount(map)
        return list
    }

    /**
     * 清洗字符串，去除标点符号
     */
    private fun clean(text: String): String {
        return text.replace("[^A-Za-z]".toRegex(), " ").trim()
    }

    /**
     * 单词频率统计
     */
    private fun getWordCount(list: List<String>): Map<String, Int> {
        val map = hashMapOf<String, Int>()
        for (word in list) {
            if (word == "") continue
            val w = word.trim()
            val count = map.getOrDefault(w, 0)
            map[w] = count + 1
        }
        return map
    }

    /**
     * 单词按出现次数排序
     */
    private fun sortByCount(map: Map<String, Int>): MutableList<WordFrequency> {
        val list = mutableListOf<WordFrequency>()
        for (entry in map) {
            list.add(WordFrequency(entry.key, entry.value))
        }
        list.sortByDescending {
            it.count
        }
        return list
    }
}
```

**使用**

```kotlin
const val text = "Kotlin is my favorite language. I love Kotlin!!!"

fun main() {
    val list = WordProcessor().processText(text)
    list.forEach {
        println(it)
    }
}

//WordFrequency(word=Kotlin, count=2)
//WordFrequency(word=love, count=1)
//WordFrequency(word=I, count=1)
//WordFrequency(word=is, count=1)
//WordFrequency(word=language, count=1)
//WordFrequency(word=my, count=1)
//WordFrequency(word=favorite, count=1)
```



## 函数式风格代码

将一些方法定义为扩展函数。

```kotlin
class WordProcessor {

    /**
     * 处理
     */
    fun processText(text: String): List<WordFrequency> {
        return text.clean()
        .split(" ")
        .getWordCount()
        .mapToList<WordFrequency> { WordFrequency(it.key, it.value) }
        .sort()
    }

    /**
     * 清洗字符串，去除标点符号
     */
    private fun String.clean(): String {
        return this.replace("[^A-Za-z]".toRegex(), " ").trim()
    }

    /**
     * 单词频率统计
     */
    private fun List<String>.getWordCount(): Map<String, Int> {
        val map = hashMapOf<String, Int>()
        for (word in this) {
            if (word == "") continue
            val w = word.trim()
            val count = map.getOrDefault(w, 0)
            map[w] = count + 1
        }
        return map
    }

    /**
     * Map转List
     */
    private fun <T> Map<String, Int>.mapToList(transform: (Map.Entry<String, Int>) -> T): MutableList<T> {
        val list = mutableListOf<T>()
        for (entry in this) {
            val bean = transform(entry)
            list.add(bean)
        }
        return list
    }

    /**
     * List排序
     */
    private fun MutableList<WordFrequency>.sort(): List<WordFrequency> {
        this.sortByDescending { it.count }
        return this
    }
}
```



## inline优化

- inline的作用就是将inline函数中的代码拷贝到调用处。
- 高阶函数会被编译器转换为匿名内部类的形式，使用inline可以减少匿名内部类的产生，提高执行效率。
- Kotlin官方推荐inline用于修饰高阶函数，普通函数使用inline，编译器会提示警告。

```kotlin
private inline fun <T> Map<String, Int>.mapToList(transform: (Map.Entry<String, Int>) -> T): MutableList<T> {
    val list = mutableListOf<T>()
    for (entry in this) {
        val bean = transform(entry)
        list.add(bean)
    }
    return list
}
```



## 借助Kotlin内置函数

```kotlin
class WordProcessor {
    fun processText(text: String): List<WordFrequency> {  
        return text.clean()
        .split(" ")
        .filter { it != "" }
        .groupBy { it }
        .map { WordFrequency(it.key, it.value.size) }
        .sortedByDescending { it.count }
    }
}
```



