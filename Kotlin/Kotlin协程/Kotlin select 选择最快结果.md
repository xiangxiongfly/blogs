[TOC]

# Kotlin select 选择最快结果

## 概述

-   select是Kotlin 1.6中的特性，即选择最快的结果。
-   select与async、Channel结合使用，可以大大提高程序的响应速度，还可以提高程序的灵活性、扩展性。




## 使用传统方式

**场景：**

当需要查询一个商品的详情，如果有缓存先从缓存中读取数据，然后再请求网络获取最新的数据。

```kotlin
data class Product(val productId: String, val price: Double)
```

```kotlin
suspend fun getCacheInfo(productId: String): Product? {
    delay(100L)
    return Product(productId, 1.1)
}

suspend fun getNetworkInfo(productId: String): Product? {
    delay(200L)
    return Product(productId, 2.2)
}

fun updateUI(product: Product) {
    println("${product.productId} --- ${product.price}")
}
```

```kotlin
fun main() {
    runBlocking {
        val startTime = System.currentTimeMillis()
        val productId = "12345"
        
        val cacheInfo = getCacheInfo(productId)
        if (cacheInfo != null) {
            updateUI(cacheInfo)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
        
        val networkInfo = getNetworkInfo(productId)
        if (networkInfo != null) {
            updateUI(networkInfo)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
    }
}

/*
输出信息：
12345 --- 1.1
耗时：109
12345 --- 2.2
耗时：313
 */
```

传统方式缺点：先查找缓存的数据，再请求网络，这种串行执行缺乏并发执行优势，并且查找缓存时如果时间过长或发生异常，可能会后续操作。



## 使用 select & async方式

select 可以配合 async 来使用，async 可以实现并发，select 可以选择最快结果。

select & async 可以解决传统方式的缺点，它可以同时执行多个函数，谁返回的速度快，就会选择谁。

```kotlin
data class Product(
    val productId: String,
    val price: Double,
    val isCache: Boolean = false //判断是否为缓存
)
```

```kotlin
fun main() {
    runBlocking {
        val startTime = System.currentTimeMillis()
        val productId = "12345"
        val cacheDeferred = async { getCacheInfo(productId) }
        val networkDeferred = async { getNetworkInfo(productId) }
        
        val product = select<Product?> {
            cacheDeferred.onAwait {
                it?.copy(isCache = true)
            }
            networkDeferred.onAwait {
                it?.copy(isCache = false)
            }
        }
        
        if (product != null) {
            updateUI(product)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
        
        if (product != null && product.isCache) {
            val network = networkDeferred.await() ?: return@runBlocking
            updateUI(network)
            println("耗时：${System.currentTimeMillis() - startTime}")
        }
    }
}

/*
输出信息：
12345 --- 1.1
耗时：125
12345 --- 2.2
耗时：218
 */
```

说明：使用 async 包裹 getCacheInfo()、getNetworkInfo() 这两个挂起函数，让其实现并发执行，使用 onAwait 将执行结果传给 select，select 才能将数据返回给 product 局部变量。

相比传统方式，总耗时快了很多。



### 获取最快结果并取消其他Deferred

```kotlin
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    suspend fun <T> fastest(vararg deferreds: Deferred<T>): T = select {
        fun cancelAll() = deferreds.forEach { it.cancel() }
        for (deferred in deferreds) {
            deferred.onAwait {
                cancelAll()
                it
            }
        }
    }

    val deferred1 = async {
        delay(100L)
        println("hello 1")
        "world 1"
    }

    val deferred2 = async {
        delay(200L)
        println("hello 2")
        "world 2"
    }

    val deferred3 = async {
        delay(300L)
        println("hello 3")
        "world 3"
    }

    val result = fastest(deferred1, deferred2, deferred3)
    println(result)
    println("耗时: ${System.currentTimeMillis() - startTime}")
}

/*
输出信息：
hello 1
world 1
耗时: 116
 */
```

