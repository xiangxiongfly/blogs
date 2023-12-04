[TOC]

# Android 数据存储

## Android 9 及以下版本

### 分类

**内部存储：**

内部存储只能被自己的应用访问，无需权限申请，app卸载后数据会被删，内部缓存存储的文件在内部空间不足时会被删除。

- getFilesDir()：获取内部存储目录，路径：`/data/user/0/<package_name>/files`。
- getCacheDir()：获取内部缓存目录，路径：`/data/user/0/<package_name>/cache`。
- fileList()：获取内部存储目录下的所有文件。

**外部存储：**

- 私有存储：空间相对较大，App卸载后会被删除，无需权限申请，外部缓存存储的文件在内部空间不足时会被删除。

  - getExternalFilesDir()：获取外部存储的私有目录，路径：`/storage/emulated/0/Android/data/<package_name>/files`。
  - getExternalCacheDir()：获取外部存储的私有缓存目录，路径：`/storage/emulated/0/Android/data/<package_name>/cache`。

- 公有存储：使用外部非私有存储，需要权限申请。
  - Environment.getExternalStorageDirectory()：外部存储根路径，路径：`/storage/emulated/0`。

```kotlin
Log.e(TAG, "getFileDir(): ${filesDir}") // /data/user/0/com.example.myapplication/files

Log.e(TAG, "getCacheDir(): ${cacheDir}") // /data/user/0/com.example.myapplication/cache

Log.e(
    TAG,
    "getExternalFilesDir(): ${getExternalFilesDir(null)}"
) // /storage/emulated/0/Android/data/com.example.myapplication/files

Log.e(
    TAG, "getExternalFilesDir(): ${getExternalFilesDir(Environment.DIRECTORY_MOVIES)}"
) // /storage/emulated/0/Android/data/com.example.myapplication/files/Movies

Log.e(
    TAG,
    "getExternalCacheDir(): ${externalCacheDir}"
) // /storage/emulated/0/Android/data/com.example.myapplication/cache

Log.e(
    TAG,
    "Environment.getExternalStorageDirectory(): ${Environment.getExternalStorageDirectory()}"
) // /storage/emulated/0

fileList().forEach {
    Log.e(TAG, "内部存储文件: ${it}")
}
```



### 内部存储

**写入数据：**

```kotlin
val content = "hello内部存储测试数据"
val fileName = "内部存储.txt"
val output = openFileOutput(fileName, MODE_PRIVATE)
output.write(content.toByteArray())
output.flush()
output.close()
```

**读取数据：**

```kotlin
val fileName = "内部存储.txt"
var content = ""
var len = 0
val buffer = ByteArray(1024)
val input = openFileInput(fileName)
while (input.read(buffer).also { len = it } != -1) {
    val str = String(buffer, 0, len)
    content += str
}
input.close()
Log.e(TAG, "content: ${content}")
```

**写入内部缓存目录数据：**

```kotlin
val content = "hello内部缓存存储测试数据"
val fileName = "内部缓存存储.txt"
val file = File(cacheDir, fileName)
val output = FileOutputStream(file)
output.write(content.toByteArray())
output.flush()
output.close()
```

**读取内部缓存目录数据：**

```kotlin
val fileName = "内部缓存存储.txt"
val file = File(cacheDir, fileName)
var content = ""
var len = 0
val buffer = ByteArray(1024)
val input = FileInputStream(file)
while (input.read(buffer).also { len = it } != -1) {
    val str = String(buffer, 0, len)
    content += str
}
input.close()
Log.e(TAG, "content: ${content}")
```



### 外部存储

#### 判断SD卡是否挂起

```kotlin

```

#### 私有存储读写数据

**写入外部私有存储：**

```kotlin
val content = "hello外部存储测试数据"
val fileName = "外部存储.txt"
val file = File(getExternalFilesDir("外部存储测试"), fileName)
val output = FileOutputStream(file)
output.write(content.toByteArray())
output.flush()
output.close()
```

**读取外部私有存储：**

```kotlin
val fileName = "外部存储.txt"
val file = File(getExternalFilesDir("外部存储测试"), fileName)
var content = ""
var len = 0
val buffer = ByteArray(1024)
val input = FileInputStream(file)
while (input.read(buffer).also { len = it } != -1) {
    val str = String(buffer, 0, len)
    content += str
}
input.close()
Log.e(TAG, "content: ${content}")
```

**写入外部缓存目录：**

```kotlin
val content = "hello外部缓存存储测试数据"
val fileName = "外部缓存存储.txt"
val file = File(externalCacheDir, fileName)
val output = FileOutputStream(file)
output.write(content.toByteArray())
output.flush()
output.close()
```

**读取外部缓存目录：**

```kotlin
val fileName = "外部缓存存储.txt"
val file = File(externalCacheDir, fileName)
var content = ""
var len = 0
val buffer = ByteArray(1024)
val input = FileInputStream(file)
while (input.read(buffer).also { len = it } != -1) {
    val str = String(buffer, 0, len)
    content += str
}
input.close()
Log.e(TAG, "content: ${content}")
```

#### 公有存储读写数据

**申请权限：**

```
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

```kotlin
ActivityCompat.requestPermissions(
    this, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), REQUEST_PERMISSIONS_CODE
)
```

**写入外部公有目录：**

```kotlin
val content = "hello外部公有存储测试数据"
val fileName = "外部公有存储.txt"
val file = File(Environment.getExternalStorageDirectory(), fileName)
val output = FileOutputStream(file)
output.write(content.toByteArray())
output.flush()
output.close()
```

**读取外部公有目录：**

```kotlin
val fileName = "外部公有存储.txt"
val file = File(Environment.getExternalStorageDirectory(), fileName)
var content = ""
var len = 0
val buffer = ByteArray(1024)
val input = FileInputStream(file)
while (input.read(buffer).also { len = it } != -1) {
    val str = String(buffer, 0, len)
    content += str
}
input.close()
Log.e(TAG, "content: ${content}")
```



## Android 10

Android长久以来都支持外置存储空间这个功能，也就是我们常说的SD卡存储。这个功能使用得极其广泛，几乎所有的App都喜欢在SD卡的根目录下建立一个自己专属的目录，用来存放各类文件和数据。 

这些文件存放的目的：

- 第一，存储在SD卡的文件不会计入到应用程序的占用空间当中，也就是说即使你在SD卡存放了1G的文件，你的应用程序在设置中显示的占用空间仍然可能只有几十K。
- 第二，存储在SD卡的文件，即使应用程序被卸载了，这些文件仍然会被保留下来，这有助于实现一些需要数据被永久保留的功能。 

分区存储的目的：

- 存储在SD卡上的文件属于公有文件，所有的应用程序都有权随意访问，存在严重的安全性问题。
- 因此，Google在Android 10当中加入了分区存储功能。开启分区存储功能后，应用程序只能管理自己的专属目录，路径：`/storage/emulated/0/Android/data/<package_name>/files`。

其他类型文件，如图片、音频、视频这三类文件可以通过MediaStore访问。

另外，应用程序向媒体库贡献的图片、音频和视频可以自动获取读写权限。

如果需要读取其他应用程序向媒体库共享的图片、音频、视频，则必须要申请 `READ_EXTERNAL_STORAGE ` 权限。

**不开启分区存储：**

```
<application
    android:requestLegacyExternalStorage="true">
</application>
```



## Android 11 及以上版本

Android 11中，Scoped Storage被强制启用了。 

如果你的targetSdkVersion等于30，Scoped Storage就会被强制启用，requestLegacyExternalStorage标记将会被忽略。 

### 保持图片到相册

```kotlin
val bitmap = BitmapFactory.decodeResource(resources, R.drawable.aaa)
//        val displayName = "${System.currentTimeMillis()}.png"
val displayName = "aaa.png"
val mineType = "image/png"
val format = Bitmap.CompressFormat.PNG

val contentValues = ContentValues()
contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, displayName)
contentValues.put(MediaStore.MediaColumns.MIME_TYPE, mineType)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES)
    //            contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DCIM)
} else {
    contentValues.put(
        MediaStore.MediaColumns.DATA,
        Environment.getExternalStorageDirectory().path + File.separator + Environment.DIRECTORY_DCIM + File.separator + displayName
    )
}
val uri =
contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)
if (uri != null) {
    val outputStream = contentResolver.openOutputStream(uri)
    if (outputStream != null) {
        bitmap.compress(format, 100, outputStream)
        outputStream.close()
        toast("保存图片成功")
    }
}
```

### 查询图片

可以获取本应用程序贡献的图片，其他应用程序贡献的图片需要申请读权限。

```kotlin
val displayName = "hello.jpg"
val uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
val selection = MediaStore.Images.Media.DISPLAY_NAME + "=?"
var selectionArgs = arrayOf(displayName)
val cursor = contentResolver.query(uri, null, selection, selectionArgs, null)
if (cursor != null) {
    if (cursor.moveToFirst()) {
        val id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID))
        val resultUri = ContentUris.withAppendedId(uri, id)
        Log.e("TAG", "查询成功: $resultUri") //content://media/external/images/media/1000000502
        showImageView(resultUri)
    }
    cursor.close()
}
```

```kotlin
private fun showImageView(uri: Uri) {
    // 方式一：
    viewBinding.imageView.setImageURI(uri)

    // 方式二：
    //        Glide.with(this).load(uri).into(viewBinding.imageView)

    // 方式三：
    //        val fd = contentResolver.openFileDescriptor(uri, "r")
    //        if (fd != null) {
    //            val bitmap = BitmapFactory.decodeFileDescriptor(fd.fileDescriptor)
    //            fd.close()
    //            viewBinding.imageView.setImageBitmap(bitmap)
    //        }
}
```

### 查询所有图片

```kotlin
val cursor = contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    null,
    null,
    null,
    "${MediaStore.MediaColumns.DATE_ADDED} desc"
)
if (cursor != null) {
    while (cursor.moveToNext()) {
        val id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
        val displayName =
        cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DISPLAY_NAME))
        val uri =
        ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id)
        Log.e("TAG", "查询成功:$displayName $uri")
    }
    cursor.close()
}
```

### 删除图片

只能删除本应用程序贡献的图片。

```kotlin
val displayName = "aaa.png"
val selection = MediaStore.Images.Media.DISPLAY_NAME + "=?"
val selectionArgs = arrayOf(displayName)
val row: Int = contentResolver.delete(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    selection,
    selectionArgs
)
Log.e("TAG", "删除成功: $row")
```

### 修改图片

只能修改本应用程序贡献的图片。

```kotlin
val displayName = "aaa.png"
val selection = MediaStore.Images.Media.DISPLAY_NAME + "=?"
val selectionArgs = arrayOf(displayName)
val contentValues = ContentValues()
contentValues.put(MediaStore.Images.ImageColumns.DISPLAY_NAME, "bbb.png")
val row = contentResolver.update(
    Uri.parse("content://media/external/images/media/1000000534"),
    contentValues,
    selection, selectionArgs
)
Log.e("TAG", "修改成功：$row")
```

### 保存到Download目录下

```kotlin
if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
    toast("只支持Android_10及以上版本")
    return
}
val content = "这是一些测试数据，分区存储123"
val fileName = "test.txt"
val contentValues = ContentValues()
contentValues.put(MediaStore.Downloads.DISPLAY_NAME, fileName)
contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
val resultUri =
contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
if (resultUri != null) {
    val outputStream = contentResolver.openOutputStream(resultUri)
    if (outputStream != null) {
        val bos = BufferedOutputStream(outputStream)
        val bis = BufferedInputStream(ByteArrayInputStream(content.toByteArray()))
        val buffer = ByteArray(1024)
        var len = 0
        while (bis.read(buffer).also { len = it } != -1) {
            bos.write(buffer, 0, len)
            bos.flush()
        }
        bos.close()
        bis.close()
    }
}
```

### 使用系统文件选择器

如果我们要读取SD卡上非图片、音频、视频类的文件，比如说打开一个PDF文件，这个时候就不能再使用MediaStore API了，需要使用系统文件选择器。 

**单选：**

```kotlin
val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
intent.addCategory(Intent.CATEGORY_OPENABLE)
intent.type = "image/*"
startActivityForResult(intent, REQUEST_IMAGE_CODE)
```

**多选：**

```kotlin
val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
intent.addCategory(Intent.CATEGORY_OPENABLE)
intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true) //多选
intent.type = "image/*"
startActivityForResult(intent, REQUEST_IMAGE_MULTIPLE_CODE)
```

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (resultCode == Activity.RESULT_OK) {
        when (requestCode) {
            REQUEST_IMAGE_SINGLE_CODE -> {
                data?.let {
                    val uri = it.data
                    Log.e("TAG", "uri: $uri")
                    viewBinding.imageView.setImageURI(uri)
                }
            }
            REQUEST_IMAGE_MULTIPLE_CODE -> {
                if (data != null && data.clipData != null) {
                    with(data.clipData!!) {
                        for (i in 0 until this.itemCount) {
                            Log.e("TAG", "${i} uri: ${this.getItemAt(i).uri}")
                        }
                    }
                }
            }
        }
    }
}
```

### 复制图片到本应用程序下并显示

如果要编辑其他程序贡献的图片，可以先复制图片到本应用程序下，再做修改。

```kotlin
val uri = Uri.parse("content://media/external/images/media/68")
val inputStream = contentResolver.openInputStream(uri)
val dir = cacheDir
val imageName = "helloabc.jpg"
val imageFile = File(dir, imageName)
val fileOutputStream = FileOutputStream(imageFile)
val bos = BufferedOutputStream(fileOutputStream)
val bis = BufferedInputStream(inputStream)
val buffer = ByteArray(1024)
var len = 0
while (bis.read(buffer).also { len = it } != -1) {
    bos.write(buffer, 0, len)
    bos.flush()
}
bos.close()
bis.close()
viewBinding.imageView.setImageURI(Uri.parse(imageFile.absolutePath))
```

### 授予管理所有文件的权限

拥有对整个SD卡的读写权限，在Android 11上被认为是一种非常危险的权限，同时也可能会对用户的数据安全造成比较大的影响。 

**在AndroidManifest文件中申明权限：**

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.scopedstoragedemo">

    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"
        tools:ignore="ScopedStorage" />

</manifest>
```

`tools:ignore="ScopedStorage" `如果不加这个，AndroidStudio会警告提示，因为绝大部分应用程序不应该申请这个权限 。

可以通过`Environment.isExternalStorageManager() `判断是否已授权。

**申请权限：**

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
    AlertDialog.Builder(this)
    .setMessage("本程序需要允许访问所有文件权限")
    .setPositiveButton("确定") { dialog, which ->
                              val intent = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
                              startActivity(intent)
                             }
    .show()
} else {
    toast("您已获得访问所有文件权限")
}
```

**判断是否授权：**

```kotlin
fun isExternalStorageManager(): Boolean =
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && Environment.isExternalStorageManager()
```

**测试：**

```kotlin
if (isExternalStorageManager()) {
    val content = "hello test123456"
    val fileName = "test123456.txt"
    val file = File(Environment.getExternalStorageDirectory(), fileName)
    val output = FileOutputStream(file)
    output.write(content.toByteArray())
    output.flush()
    output.close()
} else {
    toast("未授权")
}
```

```kotlin
if (isExternalStorageManager()) {
    val fileName = "test123456.txt"
    val file = File(Environment.getExternalStorageDirectory(), fileName)
    if (file.exists()) {
        var content = ""
        val input = FileInputStream(file)
        val buffer = ByteArray(1024)
        var len = 0
        while ((input.read(buffer).also { len = it }) != -1) {
            val str = String(buffer, 0, len)
            content += str
        }
        input.close()
        Log.e("TAG", "content: $content")
    }
} else {
    toast("未授权")
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_DataStorage)

