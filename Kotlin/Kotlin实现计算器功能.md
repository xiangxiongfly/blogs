# Kotlin实现计算器功能

## 功能介绍

- 交互式界面，输入计算公式，按下回车，程序就会帮我们计算出结果。如输入：1+2=3
- 输入exit，按下回车，程序就会退出。
- 支持加减乘除这四种运算。



## 功能实现

**定义枚举类**

```kotlin
/**
 * 枚举类：定义计算符号
 */
enum class Operation(val value: String) {
    ADD("+"),
    MINUS("-"),
    MULTI("*"),
    DIVI("/");
}
```



**定义公式类**

```kotlin
/**
 * 定义计算公式实体类
 */
data class Expression(
    val left: String,
    val operator: Operation,
    val right: String
)
```



**计算器类**

```kotlin
/**
 * 计算器类
 */
class Calculator {
    //退出指令
    private val EXIT = "exit"

    //帮助信息
    private val HELP = """
-------------------------------------
使用说明：
1. 输入 1 + 1，按回车，即可使用计算器；
2. 主要：数字与符号之间要有空格；
3. 想要退出程序，请输入：exit；
-------------------------------------
""".trimIndent()

    //开始运行计算器
    fun start() {
        while (true) {
            println(HELP)

            val input = readLine() ?: continue

            val result = calculate(input)

            if (result == null) {
                println("输入格式不正确")
                continue
            } else {
                println("$input = $result")
            }
        }
    }

    /**
     * 计算公式
     */
    private fun calculate(input: String): String? {
        if (shouldExit(input)) exitProcess(0)

        val exp = parseExpression(input) ?: return null

        val (left, operator, right) = exp

        return when (operator) {
            Operation.ADD -> add(left, right)
            Operation.MINUS -> minus(left, right)
            Operation.MULTI -> multi(left, right)
            Operation.DIVI -> divi(left, right)
        }
    }


    /**
     * 是否必须退出
     */
    private fun shouldExit(input: String): Boolean {
        return input == EXIT
    }

    /**
     * 解析计算公式
     */
    private fun parseExpression(input: String): Expression? {
        val operator = parseOperation(input) ?: return null

        val list = input.split(operator.value)
        if (list.size != 2) return null

        return Expression(left = list[0].trim(), operator = operator, right = list[1].trim())
    }

    /**
     * 解析出计算符号
     */
    private fun parseOperation(input: String): Operation? {
        Operation.values().forEach {
            if (input.contains(it.value)) {
                return it
            }
        }
        return null
    }

    /**
     * 加
     */
    fun add(left: String, right: String): String {
        return (left.toLong() + right.toLong()).toString()
    }

    /**
     * 减
     */
    fun minus(left: String, right: String): String {
        return (left.toLong() - right.toLong()).toString()
    }

    /**
     * 乘
     */
    fun multi(left: String, right: String): String {
        return (left.toLong() * right.toLong()).toString()
    }

    /**
     * 除
     */
    fun divi(left: String, right: String): String {
        return (left.toLong() / right.toLong()).toString()
    }
}
```

**使用**

```kotlin
fun main() {
    val calculator = Calculator()
    calculator.start()
}
```



## 兼容特大数想加

当2个特大数想加时，程序会抛出异常。

对此我们可以改造`add`方法：

```kotlin
fun add(left: String, right: String): String {
    val result = StringBuilder()
    var leftIndex = left.length - 1
    var rightIndex = right.length - 1
    var carry = 0
    while (leftIndex >= 0 || rightIndex >= 0) {
        val leftValue = if (leftIndex >= 0) left[leftIndex].digitToInt() else 0
        val rightValue = if (rightIndex >= 0) right[rightIndex].digitToInt() else 0
        val sum = leftValue + rightValue + carry
        carry = sum / 10
        result.append(sum % 10)
        leftIndex--
        rightIndex--
    }

    if (carry != 0) {
        result.append(carry)
    }

    return result.reverse().toString()
}
```

