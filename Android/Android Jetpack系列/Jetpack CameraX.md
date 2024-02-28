[TOC]

# Jetpack CameraX

## 概述

CameraX 是一个 Jetpack 库，旨在帮助您更轻松地开发相机应用。如果您要开发新应用，我们建议您从 CameraX 开始。它提供了一个一致且易于使用的 API，该 API 适用于绝大多数 Android 设备，并向后兼容 Android 5.0（API 级别 21）。 



## 添加依赖库

```groovy
// CameraX core library using the camera2 implementation
def camerax_version = "1.2.0-alpha02" //1.2.0-alpha02
// The following line is optional, as the core library is included indirectly by camera-camera2
implementation "androidx.camera:camera-core:${camerax_version}"
implementation "androidx.camera:camera-camera2:${camerax_version}"
// If you want to additionally use the CameraX Lifecycle library
implementation "androidx.camera:camera-lifecycle:${camerax_version}"
// If you want to additionally use the CameraX VideoCapture library
implementation "androidx.camera:camera-video:${camerax_version}"
// If you want to additionally use the CameraX View class
implementation "androidx.camera:camera-view:${camerax_version}"
// If you want to additionally add CameraX ML Kit Vision Integration
implementation "androidx.camera:camera-mlkit-vision:${camerax_version}"
// If you want to additionally use the CameraX Extensions library
implementation "androidx.camera:camera-extensions:${camerax_version}"
```



## 使用

### 预览

```kotlin
class PictureActivity : BaseActivity() {
    private lateinit var mBinding: ActivityPictureBinding

    private lateinit var mPreview: Preview
    private lateinit var mCamera: Camera
    private lateinit var mCameraProvider: ProcessCameraProvider
    private var singleTapDetector: GestureDetector? = null
    private val mExecutor: Executor by lazy {
        ContextCompat.getMainExecutor(this)
    }
    private var isBack = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mBinding = ActivityPictureBinding.inflate(layoutInflater)
        setContentView(mBinding.root)
        mBinding.root.post {
            initCameraX()
        }
    }

    private fun initCameraX() {
        // 请求CameraProvider
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            mCameraProvider = cameraProviderFuture.get()
            bindPreview(mCameraProvider, mBinding.previewView)
            listenGesture()
        }, mExecutor)
    }

    private fun bindPreview(cameraProvider: ProcessCameraProvider, previewView: PreviewView) {
        // 切换前后摄像头
        val cameraSelector =
            if (isBack) CameraSelector.DEFAULT_BACK_CAMERA else CameraSelector.DEFAULT_FRONT_CAMERA

        // 创建Preview
        mPreview = Preview.Builder().build()      

        // 绑定前确保解除了所有绑定，防止CameraProvider重复绑定到Lifecycle发生异常
        cameraProvider.unbindAll()

        // 绑定生命周期
        mCamera = cameraProvider.bindToLifecycle(
            this,
            cameraSelector,
            mPreview
        )

        // 将Preview连接到PreviewView
        mPreview.setSurfaceProvider(previewView.surfaceProvider)
    }

    /**
     * 监听手势
     */
    private fun listenGesture() {
        mBinding.previewView.setOnTouchListener { view, event ->
            singleTapForFocus(event)
            true
        }
        focusOnPosition(
            (mBinding.previewView.width / 2).toFloat(),
            (mBinding.previewView.height / 2).toFloat(),
        )
    }

    /**
     * 根据坐标聚焦
     */
    private fun focusOnPosition(x: Float, y: Float, isShowTapView: Boolean = false) {
        logE("position: $x - $y")
        logE("width: ${mBinding.previewView.width}  height: ${mBinding.previewView.height}")
        val action = FocusMeteringAction.Builder(
            mBinding.previewView.meteringPointFactory.createPoint(x, y)
        ).build()
        if (isShowTapView) {
            showTapView(x.toInt(), y.toInt())
        }
        mCamera.cameraControl.startFocusAndMetering(action)
    }

    /**
     * 显示聚焦的图标
     */
    private fun showTapView(x: Int, y: Int) {
        val imageView = ImageView(this)
            .apply {
                setImageResource(R.drawable.ic_focus_view)
            }
        val popupWindow = PopupWindow(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            contentView = imageView
        }
        val offset = dp2px(50)
        popupWindow.showAsDropDown(mBinding.previewView, x - offset / 2, y - offset / 2)
        mBinding.previewView.postDelayed({ popupWindow.dismiss() }, 500L)
    }

    /**
     * 单击聚焦
     */
    private fun singleTapForFocus(event: MotionEvent) {
        if (singleTapDetector == null) {
            singleTapDetector = GestureDetector(this@PictureActivity,
                object : GestureDetector.SimpleOnGestureListener() {
                    override fun onSingleTapConfirmed(e: MotionEvent?): Boolean {
                        focusOnPosition(event.x, event.y, true)
                        return super.onSingleTapConfirmed(e)
                    }
                })
        }
        singleTapDetector!!.onTouchEvent(event)
    }

    /**
     * 前后摄像头切换
     */
    private fun changeCamera() {
        isBack = !isBack
        bindPreview(mCameraProvider, mBinding.previewView)
    }  
}
```

### 拍照

```kotlin
// 设置图片拍摄
mImageCapture = ImageCapture.Builder()
    .setTargetRotation(previewView.display.rotation)
//            .setCaptureMode() // 设置拍摄模式
//            .setFlashMode() // 设置闪光模式
    .build()

// 设置图片质量
mImageAnalysis = ImageAnalysis.Builder()
    .setTargetRotation(previewView.display.rotation)
    .setTargetResolution(Size(720, 1440))
    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
    .build()

// 绑定生命周期
mCamera = cameraProvider.bindToLifecycle(
    this,
    cameraSelector,
    mPreview,
    mImageCapture,
    mImageAnalysis
)
```

```kotlin
// 拍照
val contentValues = ContentValues()
    .apply {
        put(
            MediaStore.MediaColumns.DISPLAY_NAME,
            "my_capture_${System.currentTimeMillis()}"
        )
        put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
    }
val outputFileOptions = ImageCapture.OutputFileOptions.Builder(
    contentResolver,
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues
).build()
mImageCapture.takePicture(
    outputFileOptions,
    mExecutor,
    object : ImageCapture.OnImageSavedCallback {
        override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
            val uri = outputFileResults.savedUri ?: return
            showPicture(uri)
        }

        override fun onError(exception: ImageCaptureException) {
            logE("onError: ${exception.imageCaptureError}")
        }
    })
```

### 录视频

```kotlin
class VideoActivity : BaseActivity() {
    private lateinit var mBinding: ActivityVideoBinding

    private lateinit var mPreview: Preview
    private lateinit var mCamera: Camera
    private lateinit var mCameraProvider: ProcessCameraProvider
    private lateinit var mVideoCapture: VideoCapture
    private val mExecutor: Executor by lazy {
        ContextCompat.getMainExecutor(mContext)
    }
    private var isRecording = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mBinding = ActivityVideoBinding.inflate(layoutInflater)
        setContentView(mBinding.root)
        mBinding.root.post {
            initCameraX()
        }
        mBinding.ivVideo.setOnClickListener {
            if (!isRecording) startRecordVideo() else stopRecordVideo()
        }
    }

    private fun initCameraX() {
        val listenableFuture = ProcessCameraProvider.getInstance(this)
        listenableFuture.addListener({
            mCameraProvider = listenableFuture.get()
            bindPreview(mCameraProvider, mBinding.previewView)
        }, mExecutor)
    }

    private fun bindPreview(cameraProvider: ProcessCameraProvider, previewView: PreviewView) {
        // 设置摄像头
        val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

        // 创建Preview
        mPreview = Preview.Builder().build()

        mVideoCapture = VideoCapture.Builder()
            .setTargetRotation(previewView.display.rotation)
            .setVideoFrameRate(25)
            .setBitRate(3 * 1024 * 1024)
            .build()

        // 绑定前确保解除了所有绑定，防止CameraProvider重复绑定到Lifecycle发生异常
        cameraProvider.unbindAll()

        // 绑定生命周期
        mCamera = cameraProvider.bindToLifecycle(
            this,
            cameraSelector,
            mPreview,
            mVideoCapture
        )

        // 将Preview连接到PreviewView
        mPreview.setSurfaceProvider(previewView.surfaceProvider)
    }

    private fun startRecordVideo() {
        isRecording = true
        mBinding.tvVideo.text = "停止录制"

        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, "my_video" + "_" + System.currentTimeMillis())
            put(MediaStore.MediaColumns.MIME_TYPE, "video/mp4")
        }
        val options = VideoCapture.OutputFileOptions.Builder(
            contentResolver,
            MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
            contentValues
        ).build()
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }
        mVideoCapture.startRecording(
            options,
            mExecutor,
            object : VideoCapture.OnVideoSavedCallback {
                override fun onVideoSaved(outputFileResults: VideoCapture.OutputFileResults) {
                    val uri = outputFileResults.savedUri
                    uri?.let {
                        val path = it.path
                        path?.let {
                            showToast("视频保存在：$path")
                            logE("视频保存在：$path")
                        }
                    }
                }

                override fun onError(videoCaptureError: Int, message: String, cause: Throwable?) {
                    showToast("保存失败：$message")
                    logE("保存失败：$message")
                }
            }
        )
    }

    private fun stopRecordVideo() {
        isRecording = false
        mBinding.tvVideo.text = "开始录制"
        mVideoCapture.stopRecording()
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/Android_JetpackProject/tree/main/cameraxdemo)



## 文档

https://juejin.cn/post/7267840969605382198

https://juejin.cn/post/6951017751457005576

https://blog.csdn.net/EthanCo/article/details/125603671

https://developer.android.google.cn/media/camera/camerax?hl=zh-cn

