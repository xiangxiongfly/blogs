# Kotlin实现一元一次方程

## 命令式编程

```kotlin
fun solveEquation(equation: String): String {
    val list = equation.split("=")
    var leftSum = 0
    var rightSum = 0
    val leftList = splitByOperator(list[0])
    val rightList = splitByOperator(list[1])

    leftList.forEach {
        if ("x" in it) {
            leftSum += xToInt(it)
        } else {
            rightSum -= it.toInt()
        }
    }

    rightList.forEach {
        if ("x" in it) {
            leftSum -= xToInt(it)
        } else {
            rightSum += it.toInt()
        }
    }

    return when {
        leftSum == 0 && rightSum == 0 -> "方程无数解"
        leftSum == 0 && rightSum != 0 -> "无解方程"
        else -> "x=${rightSum / leftSum}"
    }
}

//根据符号+、-分割语句并返回List
private fun splitByOperator(expression: String): List<String> {
    val result = mutableListOf<String>()
    var temp = ""
    expression.forEach {
        if (it == ' ') return@forEach
        if (it == '+' || it == '-') {
            if (temp.isNotEmpty()) {
                result.add(temp)
            }
            temp = it.toString()
        } else {
            temp += it
        }
    }
    result.add(temp)
    return result
}

//提取x的系数，如-2x转-2
private fun xToInt(x: String): Int =
    when (x) {
        "x",
        "+x" -> 1
        "-x" -> -1
        else -> x.replace("x", "").toInt()
    }
```

```kotlin
fun main() {
    val equation = "3x - 4  = x + 2"
    println(solveEquation(equation))
}
```



## 函数式编程

```kotlin
fun solveEquation(equation: String): String {
    val leftSum: Int
    val rightSum: Int

    val list = equation
    .filter { it != ' ' }
    .replace("-", "+-")
    .split("=")

    val leftList = list[0].split("+")
    val rightList = list[1].split("+")

    leftList
    	.filter { it.hasX() }
        .map { xToInt(it) }
        .toMutableList()
        .apply {
            rightList.filter { it.hasX() }
            .map { xToInt(it).times(-1) }
            .let { addAll(it) }
        }
        .sum()
        .let { leftSum = it }

    rightList
    	.filter { it.isNumber() }
        .map { it.toInt() }
        .toMutableList()
        .apply {
            leftList.filter { it.isNumber() }
            .map { it.toInt().times(-1) }
            .let { addAll(it) }
        }
        .sum()
        .let { rightSum = it }

    return when {
        leftSum == 0 && rightSum == 0 -> "方程无数解"
        leftSum == 0 && rightSum != 0 -> "无解"
        else -> "x=${rightSum / leftSum}"
    }
}

private fun String.isNumber(): Boolean =
	this != "" && "x" !in this

private fun String.hasX(): Boolean =
	this != "" && "x" in this

private fun xToInt(x: String) =
    when (x) {
        "x" -> 1
        "-x" -> -1
        else -> x.replace("x", "").toInt()
    }
```

```kotlin
fun main() {
    val equation = "3x - 4  = x + 2"
    println(solveEquation(equation))
}
```

