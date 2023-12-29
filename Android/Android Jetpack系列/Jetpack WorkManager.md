[TOC]

# Jetpack WorkManager

## 概述

[WorkManager](https://developer.android.google.cn/reference/androidx/work/WorkManager?hl=zh-cn) 是适合用于持久性工作的推荐解决方案。如果工作始终要通过应用重启和系统重新启动来调度，便是持久性的工作。由于大多数后台处理操作都是通过持久性工作完成的，因此 WorkManager 是适用于后台处理操作的主要推荐 API。

 

## 任务类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b9f1126ec9e240a7b4fdf1cbb796f4c4.png)

| **类型** | **周期**     | **使用方式**                                                 |
| -------- | ------------ | ------------------------------------------------------------ |
| 立即     | 一次性       | `OneTimeWorkRequest` 和 `Worker`。如需处理加急工作，请对 OneTimeWorkRequest 调用 `setExpedited()`。 |
| 长期运行 | 一次性或定期 | 任意 `WorkRequest` 或 `Worker`。在工作器中调用 `setForeground()` 来处理通知。 |
| 可延期   | 一次性或定期 | `PeriodicWorkRequest` 和 `Worker`。                          |



## 添加依赖库

```
def work_version = "2.7.1"
// (Java only)
implementation "androidx.work:work-runtime:$work_version"
// Kotlin + coroutines
implementation "androidx.work:work-runtime-ktx:$work_version"
```



## 使用

### 一次性工作

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/75e02186ab514ca2bc7139b4c00be4dc.png)

**定义工作Worker：**

```kotlin
class MyWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {
    override fun doWork(): Result {
        Log.e(TAG, "成功：${Thread.currentThread().name}")
        return Result.success()
    }
}
```

**创建WorkRequest：**

```kotlin
val workRequest: WorkRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
```

**提交任务：**

```kotlin
WorkManager.getInstance(this).enqueue(workRequest)
```



### 定期工作

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/1631beedf7a24545997f661492a528d3.png)

一次性任务使用 OneTimeWorkRequestBuilder 类，定期任务使用 PeriodicWorkRequestBuilder 类。

周期至少15分钟一次，小于15分钟按15分钟算。

成功和失败状态仅适用于一次性工作和[链式工作](https://developer.android.google.cn/topic/libraries/architecture/workmanager/how-to/chain-work?hl=zh-cn)。[定期工作](https://developer.android.google.cn/topic/libraries/architecture/workmanager/how-to/define-work?hl=zh-cn#schedule_periodic_work)只有一个终止状态 `CANCELLED`。 

```kotlin
val workRequest: WorkRequest =   
    PeriodicWorkRequestBuilder<MyWorker>(1, TimeUnit.MINUTES)                   
    .build()
```



### 延时工作

使用 setInitialDelay() 方法指定延迟时间。

```kotlin
val workRequest: WorkRequest = OneTimeWorkRequestBuilder<MyWorker>()
    .setInitialDelay(10, TimeUnit.SECONDS)
    .build()
```



### 取消工作

- cancelWorkById：通过 id 取消任务。
- cancelAllWorkByTag：通过 tag 取消任务。
- cancelAllWork：取消所有的任务。

```kotlin
val workRequest: WorkRequest = OneTimeWorkRequestBuilder<MyWorker>()
    .setInitialDelay(10, TimeUnit.SECONDS)
    .addTag("workGroup")
    .build()
```

**通过 id 取消任务：**

```kotlin
 WorkManager.getInstance(this).cancelWorkById(workRequest.id)
```

**通过 tag 取消任务：**

```kotlin
WorkManager.getInstance(this).cancelAllWorkByTag("workGroup")
```

**取消所有任务：**

```kotlin
WorkManager.getInstance(this).cancelAllWork()
```



### 传值

- WorkRequest#setInputData()：设置参数。
- Worker#getInputData()：获取参数。

**设置参数：**

```kotlin
val request: WorkRequest = OneTimeWorkRequestBuilder<ParamsWorker>()
    .setInputData(workDataOf("name" to "小明", "age" to 18, "sex" to true))
    .build()
WorkManager.getInstance(this).enqueue(request)
```

**获取参数：**

```kotlin
class ParamsWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        val name = inputData.getString("name")
        val age = inputData.getInt("age", -1)
        val sex = inputData.getBoolean("sex", false)
        Log.e(TAG, "name:${name} age:${age} sex:${sex}")
        return Result.success()
    }
}
```



### 加急工作

通过设置 setExpedited() 告诉系统这个任务是加急任务，需要尽快处理。

| 值                                | 说明                                       |
| --------------------------------- | ------------------------------------------ |
| RUN_AS_NON_EXPEDITED_WORK_REQUEST | 当系统无法进行加急处理时，任务变成常规任务 |
| DROP_WORK_REQUEST                 | 当系统无法进行加急处理时，删除改任务       |

在 Android12 之前的版本会报错：

```
Caused by: java.util.concurrent.ExecutionException: java.lang.IllegalStateException:
Expedited WorkRequests require a ListenableWorker to provide an implementation for `getForegroundInfoAsync()`
```

因此在 Android12 之前的版本，需要实现`getForegroundInfoAsync()` 和 `getForegroundInfo()` 方法 。

```kotlin
val request: WorkRequest = OneTimeWorkRequestBuilder<ExpeditedWorker>()
    .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
    .build()
WorkManager.getInstance(this).enqueue(request)
```

```kotlin
class ExpeditedWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        Log.e(TAG, "线程：${Thread.currentThread().name}")
        return Result.success()
    }

    @SuppressLint("RestrictedApi")
    override fun getForegroundInfoAsync(): ListenableFuture<ForegroundInfo> {
        val future = SettableFuture.create<ForegroundInfo>()
        future.set(getForegroundInfo())
        return future
    }

    private fun getForegroundInfo(): ForegroundInfo {
        val notificationId = 10086
        val notificationManager =
            applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel("1", "hello", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }
        return ForegroundInfo(notificationId, createNotification())
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(applicationContext, "1")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("标题")
            .setContentText("内容")
            .build()
    }
}
```



### 协程工作

- 继承 CoroutineWorker 类。
- 实现 getForegroundInfo() 方法。

```kotlin
class MyCoroutineWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {

    override suspend fun getForegroundInfo(): ForegroundInfo {
        val notificationId = 10087
        return ForegroundInfo(notificationId, createNotification())
    }

    override suspend fun doWork(): Result {
        Log.e(TAG, "线程：${Thread.currentThread().name}")
        return Result.success()
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(applicationContext, "1")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("标题")
            .setContentText("内容")
            .build()
    }
}
```



### 工作约束

```kotlin
                val constraints = Constraints.Builder()
                    .setRequiresBatteryNotLow(true) //设置为true，表示电量不足时停止工作
//                    .setRequiresCharging(true) //设置为true，表示只能在充电时工作
//                    .setRequiresDeviceIdle(true) //设置为true，表示系统在空闲状态时工作
//                    .setRequiresStorageNotLow(true) //设置为true，表示存储空间不足时停止工作
                    .build()
                val workRequest: WorkRequest =
                    // 周期至少15分钟一次，小于15分钟按15分钟算
                    PeriodicWorkRequestBuilder<MyWorker>(1, TimeUnit.MINUTES)
                        // 设置约束
                        .setConstraints(constraints)
                        .build()
```



### 重试策略

- Worker 返回 Result.retry 时才会执行重试。
- 通过设置 setBackoffCriteria() 定义重试策略。
- 延迟时间设置为允许的最小值，即 10 秒 

| 重试策略    | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| LINEAR      | 重试时间线性增加，比如第一次10秒，二次20秒，第三次30秒，第四次40秒 |
| EXPONENTIAL | 重试时间指数增加，比如第一次10秒，二次20秒，第三次40秒，第四次80秒 |

```kotlin
val request: WorkRequest = OneTimeWorkRequestBuilder<RetryWorker>()
    .setBackoffCriteria(
        BackoffPolicy.LINEAR,
        OneTimeWorkRequest.MIN_BACKOFF_MILLIS, //最短退避延迟时间设置为允许的最小值，即 10 秒。
        TimeUnit.MILLISECONDS
    ).build()
WorkManager.getInstance(this).enqueue(request)
```



### 观察工作

```kotlin
val request: WorkRequest = OneTimeWorkRequestBuilder<FailureWorker>().build()
// 通过id观察Work
WorkManager.getInstance(this)
    .getWorkInfoByIdLiveData(request.id)
    .observe(this) {
        when (it.state) {
            WorkInfo.State.SUCCEEDED -> {
                Log.e(TAG, "成功")
            }
            WorkInfo.State.FAILED -> {
                Log.e(TAG, "失败")
            }
            WorkInfo.State.ENQUEUED -> {
                Log.e(TAG, "排队")
            }
            WorkInfo.State.RUNNING -> {
                Log.e(TAG, "运行")
            }
        }
    }
WorkManager.getInstance(this).enqueue(request)
```



### 链接工作

您可以使用 WorkManager 创建工作链并将其加入队列。工作链用于指定多个依存任务并定义这些任务的运行顺序。当您需要以特定顺序运行多个任务时，此功能尤其有用。

#### 合并器

| 合并器类型               | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| OverwritingInputMerger   | 默认的合并方法 。如果合并过程中存在键冲突，键的最新值将覆盖生成的输出数据中的所有先前版本。 |
| ArrayCreatingInputMerger | 会尝试合并输入，并在必要时创建数组。                         |

**OverwritingInputMerger：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2ae5e72b5b744a28a6643f52eb496ad7.png)

**ArrayCreatingInputMerger：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/5ab1d0ce86ae4bc6897ae26e39bd30c4.png)

#### 使用

**定义Worker：**

```kotlin
class DataWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {
    override fun doWork(): Result {
        val delay = inputData.getLong("delay", 0L)
        Thread.sleep(delay)
        Log.e(TAG, "获取数据：${inputData}")
        return Result.success(inputData)
    }
}

class CacheWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {
    override fun doWork(): Result {
        Log.e(TAG, "缓存数据：${inputData}")
        return Result.success(inputData)
    }
}

class UploadWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {
    override fun doWork(): Result {
        Log.e(TAG, "上传数据：${inputData}")
        return Result.success()
    }
}
```

**提交任务：**

```kotlin
val work1 = OneTimeWorkRequestBuilder<DataWorker>()
    .setInputData(workDataOf("name" to "小白", "delay" to 1000L)
    .build()
val work2 = OneTimeWorkRequestBuilder<DataWorker>()
    .setInputData(workDataOf("sex" to true, "delay" to 2000L))
    .build()
val work3 = OneTimeWorkRequestBuilder<DataWorker>()
    .setInputData(workDataOf("age" to 18, "delay" to 3000L))
    .build()
val cache = OneTimeWorkRequestBuilder<CacheWorker>()
     //  .setInputMerger(OverwritingInputMerger::class)
    .setInputMerger(ArrayCreatingInputMerger::class)
    .build()
val upload = OneTimeWorkRequestBuilder<UploadWorker>().build()
WorkManager.getInstance(this)
    .beginWith(listOf(work1, work2, work3)) //这3个工作是并行执行的
    .then(cache)
    .then(upload)
    .enqueue()
```

**说明：**

当使用 OverwritingInputMerger 时，输出：

```
获取数据：Data {name : 小白, delay : 1000, }
获取数据：Data {delay : 2000, sex : true, }
获取数据：Data {age : 18, delay : 3000, }
缓存数据：Data {name : 小白, delay : 2000, age : 18, sex : true, }
上传数据：Data {name : 小白, delay : 2000, age : 18, sex : true, }
```

当使用 ArrayCreatingInputMerger 时，输出：

```
获取数据：Data {name : 小白, delay : 1000, }
获取数据：Data {delay : 2000, sex : true, }
获取数据：Data {age : 18, delay : 3000, }
缓存数据：Data {name : [小白], delay : [2000, 1000, 3000], age : [18], sex : [true], }
上传数据：Data {name : [小白], delay : [2000, 1000, 3000], age : [18], sex : [true], }
```



## 注意

- 受手机影响定期任务不能保证准时执行，这是因为是系统为了减少电量消耗，可能会将临近的几个任务放在一起执行，这样可以大幅度地减少CPU被唤醒的次数，从而有效延长电池的使用时间。 
- WorkManager官方虽然声称它可以保证在应用退出甚至手机重启的情况下，注册的任务也会被执行。但是在国产手机中，厂商定制了系统，导致应用被杀死后不再执行任务，下次在进来时会执行任务。



## [代码下载](https://github.com/xiangxiongfly/Android_JetpackProject/tree/main/workmanagerdemo)

