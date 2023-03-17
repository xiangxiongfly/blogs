# Kotlin实现图片处理功能

## 定义图片类

定义一个二维数组，里面的每个元素都是一个color。

```kotlin
class Image(private val pxs: Array<Array<Color>>) {
    fun height(): Int {
        return pxs.size
    }

    fun width(): Int {
        return pxs[0].size
    }

    fun getPx(y: Int, x: Int): Color {
        return pxs[y][x]
    }
}
```

## 定义图片处理函数

```kotlin
/**
 * 横向翻转图片
 */
fun Image.flipHorizontal(): Image {
    val pxs = Array(height()) { y ->
        Array(width()) { x ->
            getPx(y, width() - 1 - x)
        }
    }
    return Image(pxs)
}

/**
 * 纵向翻转图片
 */
fun Image.flipVertical(): Image {
    val pxs = Array(height()) { y ->
        Array(width()) { x ->
            getPx(height() - 1 - y, x)
        }
    }
    return Image(pxs)
}

/**
 * 图片剪裁
 */
fun Image.crop(startX: Int, startY: Int, width: Int, height: Int): Image {
    val pxs = Array(height) { y ->
        Array(width) { x ->
            getPx(startX + x, startY + y)
        }
    }
    return Image(pxs)
}
```

## 定义下载函数

```kotlin
/**
 * 下载
 */
fun download(url: String, outputFile: File) {
    log("开始下载")
    val okHttpClient = OkHttpClient().newBuilder()
        .connectTimeout(10L, TimeUnit.SECONDS)
        .readTimeout(10L, TimeUnit.SECONDS)
        .build()
    val request = Request.Builder().url(url).build()
    val response = okHttpClient.newCall(request).execute()
    val body = response.body
    val code = response.code
    if (response.isSuccessful && body != null) {
        body.byteStream().apply {
            outputFile.outputStream().use {
                copyTo(it)
            }
        }
    }
    log("下载结束")
}
```

## 定义图片下载和保存函数

```kotlin
/**
 * 加载本地图片到内存中
 */
fun loadImage(imageFile: File): Image =
    ImageIO.read(imageFile)
        .let {
            Array(it.height) { y ->
                Array(it.width) { x ->
                    Color(it.getRGB(x, y))
                }
            }
        }.let {
            Image(it)
        }

/**
 * 下载网络图片
 */
suspend fun downloadImage(url: String, outputFile: File): Boolean {
    return withContext(Dispatchers.IO) {
        try {
            download(url, outputFile)
        } catch (e: Exception) {
            println(e)
            return@withContext false
        }
        return@withContext true
    }
}


/**
 * 图片保存
 */
fun Image.save(outputFile: File): Boolean {
    return try {
        val width = width()
        val height = height()
        val image = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
        for (x in 0 until width) {
            for (y in 0 until height) {
                val color = getPx(y, x)
                image.setRGB(x, y, color.rgb)
            }
        }
        ImageIO.write(image, "png", outputFile)
        true
    } catch (e: Exception) {
        println(e)
        false
    }
}
```

## 使用

```kotlin
const val BASE_PATH = "./lib_kt/src/main/res/images/"
const val URL =
    "https://raw.githubusercontent.com/chaxiu/ImageProcessor/main/src/main/resources/images/android.png"

suspend fun main() {
    val path = "${BASE_PATH}download.png"
    downloadImage(URL, File(path))
    loadImage(File(path))
        .flipVertical()
        .save(File("${BASE_PATH}download_flipVertical.png"))
    loadImage(File(path))
        .flipHorizontal()
        .save(File("${BASE_PATH}download_flipHorizontal.png"))
    loadImage(File(path))
        .crop(0, 0, 100, 200)
        .save(File("${BASE_PATH}download_crop.png"))
}
```

