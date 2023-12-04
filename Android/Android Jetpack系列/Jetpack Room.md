[TOC]

# Jetpack Room

## 概述

- Google推出的Jetpack组件之一
- 功能强大，使用简单，支持数据库监听等



## 添加依赖

```groovy
plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'kotlin-kapt'
}

dependencies {
    def room_version = "2.3.0"
    implementation("androidx.room:room-runtime:$room_version")
    annotationProcessor "androidx.room:room-compiler:$room_version"
    kapt("androidx.room:room-compiler:$room_version")
}
```



## Room组成部分

Room主要由三个部分组成：

- DataBase：数据库持有者。
- Entity：数据库中对应的表。
- DAO：提供访问数据库的方法。

开发者需要使用DataBase获取DAO对象，通过DAO操作Entity，Room数据库相关操作必须在子线程中执行。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba2efb916d7c49b38e37c1af2efa5a60.jpeg)



## 配置数据库

### 定义Entity

```kotlin
@Entity
data class User(var firstName: String, var lastName: String, var age: Int) {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0
}
```

### 定义Dao

```kotlin
@Dao
interface UserDao {
    @Insert
    fun insertUser(user: User)

    @Insert
    fun insertAllUser(user: List<User>)

    @Update
    fun updateUser(newUser: User)

    @Query("update User set age=100 where age= :age")
    fun updateUserWithAge(age: Int)

    @Query("select * from User")
    fun queryAllUsers(): List<User>

    @Query("select * from User where age >= :age")
    fun queryUserByAge(age: Int): List<User>

    @Delete
    fun deleteUser(user: User)

    @Query("delete from User where age = :age")
    fun deleteUserByAge(age: Int): Int
}
```

### 定义Database

```kotlin
@Database(version = 1, entities = [User::class])
abstract class MyRoomDatabase : RoomDatabase() {
    companion object {
        private var instance: MyRoomDatabase? = null
        private const val DB_NAME = "myroom"

        @Synchronized
        fun getDatabase(context: Context): MyRoomDatabase {
            instance?.let {
                return it
            }
            return Room.databaseBuilder(
                context.applicationContext,
                MyRoomDatabase::class.java,
                DB_NAME
            ).build().apply {
                instance = this
            }
        }
    }
    
    abstract fun userDao(): UserDao
}
```

### 初始化操作

```kotlin
userDao = MyRoomDatabase.getDatabase(this).userDao()
```



## 操作数据库

### 增加数据

**增加一条数据**

```kotlin
val user = User("小", "明", 18)
userDao.insertUser(user)
```

**增加多条数据**

```kotlin
val userList =
arrayListOf<User>(
    User("小", "白", 18),
    User("小", "黑", 28),
    User("大", "白", 38),
    User("大", "黑", 48)
)
userDao.insertAllUser(userList)
```



### 删除数据

**删除条件数据**

```kotlin
userDao.deleteUserByAge(28)
```



### 修改数据

**修改条件数据**

```kotlin
userDao.updateUserWithAge(48)
```

**修改数据根据主键**

```kotlin
val userList = userDao.queryUserByAge(20)
for (user in userList) {
    user.age = 1000
    userDao.updateUser(user)
}
```



### 查询数据

**查询所有数据**

```kotlin
val userList = userDao.queryAllUsers()
```

**查询条件数据**

```kotlin
val userList = userDao.queryUserByAge(20)
```



### 事务

```kotlin
//方式一
//使用注解
@Transaction
private fun transaction1() {
    thread {
        userDao.insertUser(User("李", "四", 28))
        userDao.insertUser(User("张", "三", 18))
        userDao.deleteUserByAge(28)
    }
}

//方式二
//使用runInTransaction
private fun transaction2() {
    thread {
        MyRoomDatabase.getDatabase(this).runInTransaction {
            userDao.insertUser(User("李", "四", 28))
            userDao.insertUser(User("张", "三", 18))
            userDao.deleteUserByAge(28)
        }
    }
}
```



## 高级用法

### 嵌套对象

```kotlin
data class Address(var addr: String?, var detailAddress: String?)

@Entity
data class Consumer(
    var name: String,
    var age: Int,
    @Embedded
    var address: Address? = null
) {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0L
}
```

注：最终Consumer表中一共有：id、name、age、addr、detailAddress字段



### 一对一

```kotlin
//Entity

@Entity
data class Consumer(
    var name: String,
    var age: Int,
    @Embedded
    var address: Address? = null
) {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0L
}


@Entity
data class Library(
    var libraryName: String,
    var consumerId: Long
) {
    @PrimaryKey(autoGenerate = true)
    var libraryId: Long = 0L
}

//一对一关联类
data class ConsumerAndLibrary(
    @Embedded
    var consumer: Consumer,
    @Relation(parentColumn = "id", entityColumn = "consumerId")
    var library: Library
)
```

```kotlin
//Dao

//一对一查询
@Transaction
@Query("SELECT * FROM Consumer")
fun getConsumerAndLibraryList(): List<ConsumerAndLibrary>
```

**查询操作：**

```kotlin
val consumerAndLibraryList =
MyRoomDatabase.getDatabase(this).libraryDao().getConsumerAndLibraryList()
for (i in consumerAndLibraryList) {
    log(i)
}
```

```
ConsumerAndLibrary(consumer=Consumer(name=小明, age=18, address=null), library=Library(libraryName=歌曲4, consumerId=1))
ConsumerAndLibrary(consumer=Consumer(name=小黑, age=28, address=null), library=Library(libraryName=歌曲5, consumerId=2))
ConsumerAndLibrary(consumer=Consumer(name=小白, age=38, address=null), library=Library(libraryName=歌曲6, consumerId=3))
```



### 一对多

```kotlin
//一对多关联
data class ConsumerAndLibrarys(
    @Embedded
    var consumer: Consumer,
    @Relation(parentColumn = "id", entityColumn = "consumerId")
    var library: List<Library>
)
```

```kotlin
//Dao

//一对多查询
@Transaction
@Query("SELECT * FROM Consumer")
fun getConsumerAndLibrarysList(): List<ConsumerAndLibrarys>
```

**查询操作：**

```kotlin
val consumerAndLibrarysList =
MyRoomDatabase.getDatabase(this).libraryDao().getConsumerAndLibrarysList()
for (i in consumerAndLibrarysList) {
    log(i)
}
```

```
ConsumerAndLibrarys(consumer=Consumer(name=小明, age=18, address=null), library=[Library(libraryName=歌曲1, consumerId=1), Library(libraryName=歌曲4, consumerId=1)])
ConsumerAndLibrarys(consumer=Consumer(name=小黑, age=28, address=null), library=[Library(libraryName=歌曲2, consumerId=2), Library(libraryName=歌曲5, consumerId=2)])
ConsumerAndLibrarys(consumer=Consumer(name=小白, age=38, address=null), library=[Library(libraryName=歌曲3, consumerId=3), Library(libraryName=歌曲6, consumerId=3)])
```





## 数据库升级

- Room会触发所有迁移策略，一个接着一个执行

### 新增表

**新建Entity类**

```kotlin
@Entity
data class Book(var name: String, var pages: Int) {

    @PrimaryKey(autoGenerate = true)
    var id = 0L

}
```

**配置升级信息**

```kotlin
private const val DB_NAME = "myroom"
private const val DB_VERSION = 2

@Database(version = DB_VERSION, entities = [User::class, Book::class])
abstract class MyRoomDatabase : RoomDatabase() {

    companion object {
        private var instance: MyRoomDatabase? = null

        //版本1升级到版本2策略
        private val updateVersion_1_2 = object : Migration(1, 2) {
            override fun migrate(database: SupportSQLiteDatabase) {
                val sql =
                "create table Book(id integer primary key autoincrement not null, name text not null, pages integer not null)"
                database.execSQL(sql)
            }
        }

        @Synchronized
        fun getDatabase(context: Context): MyRoomDatabase {
            instance?.let {
                return it
            }
            return Room.databaseBuilder(
                context.applicationContext,
                MyRoomDatabase::class.java,
                DB_NAME
            )
            .addMigrations(updateVersion_1_2)
            .build().apply {
                instance = this
            }
        }
    }

}
```



### 新增表字段

**修改配置类**

```kotlin
private const val DB_NAME = "myroom"
private const val DB_VERSION = 3

@Database(version = DB_VERSION, entities = [User::class, Book::class])
abstract class MyRoomDatabase : RoomDatabase() {

    companion object {
        private var instance: MyRoomDatabase? = null


        //版本1升级到版本2策略
        private val updateVersion_1_2 = object : Migration(1, 2) {
            override fun migrate(database: SupportSQLiteDatabase) {
                val sql =
                    "create table Book(id integer primary key autoincrement not null, name text not null, pages integer not null)"
                database.execSQL(sql)
            }
        }

        //版本2升级到版本3
        private val updateVersion_2_3 = object : Migration(2, 3) {
            override fun migrate(database: SupportSQLiteDatabase) {
                val sql = "alter table Book add column info text not null default 'unknown'"
                database.execSQL(sql)
            }
        }

        @Synchronized
        fun getDatabase(context: Context): MyRoomDatabase {
            instance?.let {
                return it
            }
            return Room.databaseBuilder(
                context.applicationContext,
                MyRoomDatabase::class.java,
                DB_NAME
            )
                .addMigrations(updateVersion_1_2, updateVersion_2_3)
                .build().apply {
                    instance = this
                }
        }
    }

}
```

**修改Entity类**

```kotlin
@Entity
data class Book(var name: String, var pages: Int, var info: String) {

    @PrimaryKey(autoGenerate = true)
    var id = 0L

}
```



## [源码下载](https://github.com/xiangxiongfly/DataStorageProject)