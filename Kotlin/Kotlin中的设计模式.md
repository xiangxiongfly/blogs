[TOC]

# Kotlin中的设计模式

## 创建型模式

### 工厂模式

#### 利用单例模式优化工厂类

```kotlin
interface Computer {
    val cpu: String
}

class PC(override val cpu: String) : Computer

class Server(override val cpu: String) : Computer

enum class ComputerType {
    PC, Server
}

object ComputerFactory {
    fun produce(type: ComputerType): Computer {
        return when (type) {
            ComputerType.PC -> PC("笔记本")
            ComputerType.Server -> Server("台式电脑")
        }
    }
}
```



#### 利用伴生对象优化工厂方法

```kotlin
interface Computer {
    val cpu: String

    companion object {
        operator fun invoke(type: ComputerType): Computer {
            return when (type) {
                ComputerType.PC -> PC("笔记本")
                ComputerType.Server -> Server("台式电脑")
            }
        }
    }
}

fun main() {
    val computer = Computer(ComputerType.PC)
}
```



#### 扩展函数-伴生对象方法

```kotlin
fun Computer.Companion.from(type: ComputerType): Computer = when (type) {
    ComputerType.PC -> PC("笔记本")
    ComputerType.Server -> Server("台式电脑")
}

fun main() {
    val computer = Computer.from(ComputerType.Server)
}
```



### 构建者模式

#### Java思维

```kotlin
class Computer private constructor(
    val code: String,
    val cpu: String?,
    val mainboard: String?,
    val memory: String?
) {
    class Builder(val code: String) {
        private var cpu: String? = null
        private var mainboard: String? = null
        private var memory: String? = null

        fun setCpu(cpu: String?): Builder {
            this.cpu = cpu
            return this
        }

        fun setMainboard(mainboard: String?): Builder {
            this.mainboard = mainboard
            return this
        }

        fun setMemory(memory: String?): Builder {
            this.memory = memory;
            return this
        }

        fun build(): Computer {
            return Computer(code, cpu, mainboard, memory)
        }
    }
}
```

```kotlin
val computer = Computer.Builder("001")
    .setCpu("英特尔处理器")
    .setMainboard("华硕主板")
    .setMemory("16G内存")
    .build()
```



#### Kotlin思维

可以借助`require`方法进行参数约束。

```kotlin
class Computer(
    val code: String,
    val cpu: String? = null,
    val mainboard: String? = null,
    val memory: String? = null
) {
    init {
        require(cpu != null) {
            "CPU 不能设置为null"
        }
    }
}
```

```kotlin
fun main() {
    val computer = Computer("008", "英特尔", "华硕")
}
```



