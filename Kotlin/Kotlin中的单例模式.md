[TOC]

## Kotlin中的单例模式

### object 静态代码块单例模式

Kotlin编译器将其转换为静态代码块的单例模式，因为static代码块中的代码，虚拟机只会执行一次，因此，它保证了线程安全的前提下，同时保证我们的INSTANCE只会被初始化一次。

缺点：不支持懒加载，不支持传参。

```kotlin
object Singleton {
}
```



### 借助委托实现懒加载

保证了懒加载的同时，也保证了线程安全。

```kotlin
object Singleton {
    val user by lazy {
        loadUser()
    }

    private fun loadUser(): User {
        return User()
    }
}
```



### 伴生对象双检查单例模式

- `@Volatiel`确保了INSTANCE的可见性。
- `synchronized`确保了INSTANCE的原子性。

```kotlin
class Singleton private constructor(name: String) {
    companion object {
        @Volatile
        private var INSTANCE: Singleton? = null

        fun getInstance(name: String): Singleton =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: Singleton(name).also { INSTANCE = it }
            }
    }
}
```



### 封装单例模式

**定义抽象类模板**

```kotlin
abstract class BaseSingleton<in P, out T> {
    @Volatile
    private var INSTANCE: T? = null

    protected abstract fun creator(param: P): T

    fun getInstance(param: P): T =
        INSTANCE ?: synchronized(this) {
            INSTANCE ?: creator(param).also { INSTANCE = it }
        }
}
```

```kotlin
class UserManager private constructor(name: String) {
    companion object : BaseSingleton<String, UserManager>() {
        override fun creator(param: String): UserManager {
            return UserManager(param)
        }
    }
}
```



#### 优化

- 将creator抽象方法修改为高阶函数的类型。
- 使用`::UserManager`函数引用，引用UserManager的构造函数

```kotlin
abstract class BaseSingleton<in P, out T> {
    @Volatile
    private var INSTANCE: T? = null

    protected abstract val creator: (P) -> T

    fun getInstance(param: P): T =
        INSTANCE ?: synchronized(this) {
            INSTANCE ?: creator(param).also { INSTANCE = it }
        }
}
```

```kotlin
class UserManager private constructor(name: String) {
    companion object : BaseSingleton<String, UserManager>() {
        override val creator: (String) -> UserManager
        	get() = ::UserManager
    }
}
```

