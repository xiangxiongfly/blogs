[TOC]


# Android 权限总结

## 权限分类

[官网文档](https://developer.android.google.cn/guide/topics/permissions/overview?hl=zh-cn)

- 普通权限：这类权限通常不会直接威胁到用户的隐私。如果你的应用列表中包含这类权限，需要在 AndroidManifest.xml 文件中定义，系统会自动授予权限，无需用户明确授予。如：android.permission.INTERNET 网络权限，android.permission.SET_WALLPAPER 壁纸权限。 
- 危险权限：这类权限可能会涉及到用户的隐私数据，或者可能会对用户的存储数据或操作产生影响。需要在 AndroidManifest.xml 文件中定义，同时必须通过权限请求对话框向用户请求这类权限。如：android.permission.READ_CONTACTS 允许应用读取用户的联系人数据，android.permission.WRITE_EXTERNAL_STORAGE 允许应用写入到外部存储。 
- 特殊权限：这类权限不属于正常和危险权限，它们有自己的处理方式。如：android.permission.REQUEST_INSTALL_PACKAGES 安装应用权限，android.permission.MANAGE_EXTERNAL_STORAGE Android11新增的文件管理权限。

**危险权限：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210308220215363.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODc2MTMz,size_16,color_FFFFFF,t_70)



## API说明

**targetSdkVersion>=23: 这时就需要在代码中检查权限了，否则打开app去执行需要权限的操作会崩溃。如果关闭权限将会弹出提示框提示你开启权限。**


- `ContextCompact#checkSelfPermission()`：判断权限是否允许。
- `ActivityCompat#requestPermissions()`：申请权限。
- `ActivityCompat#onRequestPermissionsResult()`：权限结果回调。
- `ActivityCompat#shouldShowRequestPermissonRationale`：返回true，表示权限被拒绝过，可以再次申请；返回false，表示权限被拒绝并且不再询问，必须在设置中打开。

```kotlin
/**
* 检查权限：
*  PackageManager.PERMISSION_GRANTED 权限已申请
*  PackageManager.PERMISSION_DENIED 权限拒绝
*/
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED ) {

    //申请权限：
    ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CALL_PHONE), 1)
}
```

```kotlin
/**
* 权限回调：
*
* @param requestCode Int ：请求码
* @param permissions Array<out String> ：申请的所有权限
* @param grantResults IntArray ：权限申请结果
*/
override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray,
) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == 1) {

        //权限申请成功
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "授权成功", Toast.LENGTH_SHORT).show()
        } else {
            //权限申请失败
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                                                                    Manifest.permission.CALL_PHONE)
               ) {
                //已经拒绝过一次
                AlertDialog.Builder(this)
                .setMessage("需要使用通话权限")
                .show()
            } else {
                Toast.makeText(this, "授权失败", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```



## 单次授权

从 Android 11（API 级别 30）开始，每当您的应用请求与位置信息、麦克风或摄像头相关的权限时，面向用户显示的权限对话框都会包含一个名为**仅限这一次**的选项，如图 2 所示。如果用户在对话框中选择此选项，系统会向应用授予临时的单次授权。

然后，应用可以在一段时间内访问相关数据，具体时间取决于应用的行为和用户的操作：

- 当应用的 activity 可见时，应用可以访问相关数据。
- 如果用户将应用转为后台运行，应用可以在短时间内继续访问相关数据。
- 如果您在 activity 可见时启动了一项前台服务，并且用户随后将您的应用转到后台，那么您的应用可以继续访问相关数据，直到该前台服务停止。



## 权限被撤消时

如果用户撤消单次授权（例如在系统设置中撤消），无论您是否启动了前台服务，应用都无法访问相关数据。与任何权限一样，**如果用户撤消了应用的单次授权，应用进程就会终止**。

当用户下次打开应用并且应用中的某项功能请求访问位置信息、麦克风或摄像头时，系统会再次提示用户授予权限。



## 基本使用

```xml
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.CAMERA"/>
```


```kotlin
class MainActivity : AppCompatActivity() {
    companion object {
        const val REQUEST_PERMISSIONS = 111
    }

    private lateinit var context: Context

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        context = this;
        val btnCallPhone: Button = findViewById<Button>(R.id.btnCallPhone)
        btnCallPhone.setOnClickListener {
            doCallPhone()
        }
    }

    private fun doCallPhone() {
        if (requestPermissions()) {
            call()
        }
    }

    //申请权限
    private fun requestPermissions(): Boolean {
        val deniedPermissions = checkPermissions(Manifest.permission.CALL_PHONE, Manifest.permission.CAMERA)
        return if (deniedPermissions.isNotEmpty()) {
            requestPermissions(deniedPermissions)
            false
        } else {
            true
        }
    }

    //拨打电话
    private fun call() {
        try {
            val intent = Intent(Intent.ACTION_CALL)
            intent.data = Uri.parse("tel:10086")
            startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * 检查指定权限是否授权
     * 并返回未授权
     */
    private fun checkPermissions(vararg permissions: String): ArrayList<String> {
        return checkPermissions(listOf(*permissions))
    }

    private fun checkPermissions(permissionList: List<String>): ArrayList<String> {
        //未授权
        val deniedList = ArrayList<String>()
        for (permission in permissionList) {
            if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                deniedList.add(permission)
            }
        }
        return deniedList
    }

    /**
     * 申请指定权限
     */
    private fun requestPermissions(permissionList: ArrayList<String>) {
        ActivityCompat.requestPermissions(this, permissionList.toTypedArray(), REQUEST_PERMISSIONS)
    }

    /**
     * 授权结果回调
     */
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            REQUEST_PERMISSIONS -> {
                //已拒绝权限集合
                val deniedList = ArrayList<String>()
                //已拒绝权限且不再问询集合
                val deniedWithNeverList = ArrayList<String>()

                grantResults.forEachIndexed { 
                    index, result ->
                    if (result != PackageManager.PERMISSION_GRANTED) {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[index])) {
                            deniedList.add(permissions[index])
                        } else {
                            deniedWithNeverList.add(permissions[index])
                        }
                    }
                }

                if (deniedList.isEmpty() && deniedWithNeverList.isEmpty()) {
                    call()
                } else {
                    if (deniedList.isNotEmpty()) {
                        //再次申请权限
                        AlertDialog.Builder(context).apply {
                            setMessage("App需要以下权限才能继续")
                            setPositiveButton("确定") { 
                                dialog, which ->
                                requestPermissions()
                            }
                            setNegativeButton("取消", null)
                        }.show()
                    } else {
                        //跳转设置界面
                        gotoSetting()
                    }
                }
            }
        }
    }

    /**
     * 跳转权限设置界面
     */
    fun gotoSetting() {
        AlertDialog.Builder(context).apply {
            setMessage("请在设置中允许以下权限")
            setNegativeButton("拒绝") { dialog, which ->
                                    }
            setPositiveButton("开启") { 
                dialog, which ->
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                val uri = Uri.fromParts("package", packageName, null)
                intent.data = uri
                startActivityForResult(intent, 1)
            }
        }.show()
    }
}
```



## 简单封装

```kotlin
object PermissionUtils {
    const val REQUEST_PERMISSION_CODE = 6666

    const val CAMERA = Manifest.permission.CAMERA // 摄像头
    const val CALL_PHONE = Manifest.permission.CALL_PHONE // 拨打电话

    private const val TYPE_REQUEST_PERMISSION = 1 // 表示权限申请
    private const val TYPE_GOTO_SETTING = 2 // 表示跳转设置页面

    private val permissionMap = LinkedHashMap<String, String>()

    init {
        permissionMap[CAMERA] = "相机权限"
        permissionMap[CALL_PHONE] = "拨打电话"
    }

    /**
     * 判断权限是否全部通过
     */
    fun isGrantedPermissions(context: Context, permissionList: ArrayList<String>): Boolean {
        for (permission in permissionList) {
            if (ContextCompat.checkSelfPermission(context, permission)
                != PackageManager.PERMISSION_GRANTED
            ) {
                return false
            }
        }
        return true
    }

    /**
     * 检查权限，并返回已拒绝的权限
     */
    fun checkPermissions(context: Context, permissionList: ArrayList<String>): ArrayList<String> {
        val deniedPermissionList = ArrayList<String>()
        for (permission in permissionList) {
            if (ContextCompat.checkSelfPermission(context, permission)
                != PackageManager.PERMISSION_GRANTED
            ) {
                deniedPermissionList.add(permission)
            }
        }
        return deniedPermissionList
    }

    /**
     * 申请权限
     */
    fun applyPermission(activity: Activity, permissionList: ArrayList<String>) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val list = checkPermissions(activity, permissionList)
            if (list.size > 0) {
                showPermissionDialog(
                    activity, TYPE_REQUEST_PERMISSION, "需要您同意以下权限才能正常使用", list
                )
            }
        }
    }

    /**
     * 申请权限
     */
    fun applyPermission(fragment: Fragment, permissionList: ArrayList<String>) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val list = checkPermissions(fragment.context!!, permissionList)
            if (list.size > 0) {
                showPermissionDialog(
                    fragment, TYPE_REQUEST_PERMISSION, "需要您同意以下权限才能正常使用", list
                )
            }
        }
    }

    private fun showPermissionDialog(
        fragment: Fragment,
        type: Int,
        title: String,
        permissionList: ArrayList<String>
    ) {
        val descList = ArrayList<String>()
        for (permission in permissionList) {
            val permissionDesc: String = permissionMap[permission]!!
            if (!descList.contains(permissionDesc)) {
                descList.add(permissionDesc)
            }
        }
        val builder = StringBuilder()
        if (descList.size > 0) {
            for ((index, value) in descList.withIndex()) {
                if (index == descList.size - 1) {
                    builder.append(value)
                } else {
                    builder.append(value).append("\n")
                }
            }
        }
        val message = builder.toString()
        if (type == TYPE_REQUEST_PERMISSION) {
            AlertDialog.Builder(fragment.context)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton(
                    "允许"
                ) { dialog, which ->
                    requestPermissions(fragment, permissionList)
                }
                .setNegativeButton(
                    "拒绝"
                ) { dialog, which -> }
                .show()
        } else if (type == TYPE_GOTO_SETTING) {
            AlertDialog.Builder(fragment.context)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("打开") { dialog, which ->
                    gotoSettings(fragment)
                }
                .setNegativeButton(
                    "拒绝"
                ) { dialog, which -> }
                .show()
        }
    }


    /**
     * 显示权限弹窗
     */
    fun showPermissionDialog(
        activity: Activity,
        type: Int,
        title: String,
        permissionList: ArrayList<String>
    ) {
        val descList = ArrayList<String>()
        for (permission in permissionList) {
            val d: String = permissionMap.get(permission)!!
            if (!descList.contains(d)) {
                descList.add(d)
            }
        }
        val builder = StringBuilder()
        if (descList.size > 0) {
            for ((index, value) in descList.withIndex()) {
                if (index == descList.size - 1) {
                    builder.append(value)
                } else {
                    builder.append(value).append("\n")
                }
            }
        }
        val message = builder.toString()
        if (type == TYPE_REQUEST_PERMISSION) {
            AlertDialog.Builder(activity)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton(
                    "允许"
                ) { dialog, which ->
                    requestPermissions(activity, permissionList)
                }
                .setNegativeButton(
                    "拒绝"
                ) { dialog, which -> }
                .show()
        } else if (type == TYPE_GOTO_SETTING) {
            AlertDialog.Builder(activity)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("打开") { dialog, which ->
                    gotoSettings(activity)
                }
                .setNegativeButton(
                    "拒绝"
                ) { dialog, which -> }
                .show()
        }
    }

    /**
     * 回调权限结果
     */
    fun <T> onRequestPermissionsResult(
        obj: T,
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ): Boolean {
        return if (requestCode == REQUEST_PERMISSION_CODE) {
            if (obj is Fragment) {
                val fragment = obj as Fragment
                val deniedList = ArrayList<String>() // 已拒绝权限集合
                val deniedWithNeverList = ArrayList<String>() // 已拒绝且不再问询集合
                for (i in grantResults.indices) {
                    if (grantResults[i] == PackageManager.PERMISSION_DENIED) {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(
                                fragment.activity!!,
                                permissions[i]
                            )
                        ) {
                            deniedList.add(permissions[i])
                        } else {
                            deniedWithNeverList.add(permissions[i])
                        }
                    }
                }
                if (deniedList.size > 0) {
                    showPermissionDialog(
                        fragment,
                        TYPE_REQUEST_PERMISSION,
                        "需要您同意以下权限才能正常使用",
                        deniedList
                    )
                    false
                } else if (deniedWithNeverList.size > 0) {
                    showPermissionDialog(
                        fragment,
                        TYPE_GOTO_SETTING,
                        "请在设置中允许以下权限",
                        deniedWithNeverList
                    )
                    false
                } else {
                    true
                }
            } else if (obj is Activity) {
                val activity = obj as Activity
                val deniedList = ArrayList<String>() //拒绝权限集合
                val deniedWithNeverList = ArrayList<String>() //已拒绝且不再问询集合
                for (i in grantResults.indices) {
                    if (grantResults[i] == PackageManager.PERMISSION_DENIED) {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(
                                activity,
                                permissions[i]
                            )
                        ) {
                            deniedList.add(permissions[i])
                        } else {
                            deniedWithNeverList.add(permissions[i])
                        }
                    }
                }
                if (deniedList.size > 0) {
                    showPermissionDialog(
                        activity,
                        TYPE_REQUEST_PERMISSION,
                        "需要您同意以下权限才能正常使用",
                        deniedList
                    )
                    false
                } else if (deniedWithNeverList.size > 0) {
                    showPermissionDialog(
                        activity,
                        TYPE_GOTO_SETTING,
                        "请在设置中允许以下权限",
                        deniedWithNeverList
                    )
                    false
                } else {
                    true
                }
            } else {
                throw java.lang.IllegalStateException("obj不是一个Fragment或Activity")
            }
        } else false
    }

    /**
     * 真正申请权限
     */
    fun <T> requestPermissions(obj: T, permissionList: ArrayList<String>) {
        when (obj) {
            is Activity -> {
                ActivityCompat.requestPermissions(
                    obj,
                    permissionList.toTypedArray(),
                    REQUEST_PERMISSION_CODE
                )
            }
            is Fragment -> {
                obj.requestPermissions(
                    permissionList.toTypedArray(),
                    REQUEST_PERMISSION_CODE
                )
            }
            else -> {
                throw java.lang.IllegalStateException("obj不是一个Fragment或Activity")
            }
        }
    }

    /**
     * 跳转设置页面
     */
    fun <T> gotoSettings(obj: T) {
        when (obj) {
            is Fragment -> {
                val packageURI = Uri.parse("package:" + obj.activity!!.packageName)
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageURI)
                obj.startActivityForResult(intent, 1)
            }
            is Activity -> {
                val packageURI = Uri.parse("package:" + obj.packageName)
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageURI)
                obj.startActivityForResult(intent, 2)
            }
            else -> {
                throw IllegalStateException("obj不是一个Fragment或Activity")
            }
        }
    }
}
```

**在Activity中使用；**

```kotlin
class MainActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    fun onCallPhone(view: View) {
        doCallPhone()
    }

    private fun doCallPhone() {
        val permissionList = arrayListOf(PermissionUtils.CALL_PHONE, PermissionUtils.CAMERA)
        if (PermissionUtils.isGrantedPermissions(mContext, permissionList)) {
            val callIntent = Intent(Intent.ACTION_CALL).apply {
                data = Uri.parse("tel:" + "1234567890")
            }
            startActivity(callIntent)
        } else {
            PermissionUtils.applyPermission(this, permissionList)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (PermissionUtils.onRequestPermissionsResult(
                this,
                requestCode,
                permissions,
                grantResults
            )
        ) {
            Toast.makeText(mContext, "权限已全部允许", Toast.LENGTH_SHORT).show()
            doCallPhone()
        }
    }
}
```

**在Fragment中使用：**

```kotlin
class MyFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_two, container!!, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<Button>(R.id.btn_call_phone).setOnClickListener {
            doCallPhone()
        }
    }

    private fun doCallPhone() {
        val permissionList = arrayListOf(PermissionUtils.CALL_PHONE, PermissionUtils.CAMERA)
        if (PermissionUtils.isGrantedPermissions(context!!, permissionList)) {
            val callIntent = Intent(Intent.ACTION_CALL).apply {
                data = Uri.parse("tel:" + "1234567890")
            }
            startActivity(callIntent)
        } else {
            PermissionUtils.applyPermission(this, permissionList)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (PermissionUtils.onRequestPermissionsResult(
                this,
                requestCode,
                permissions,
                grantResults
            )
        ) {
            Toast.makeText(context, "权限已全部允许", Toast.LENGTH_SHORT).show()
            doCallPhone()
        }
    }
}
```



## 第三方权限框架

推荐第三方权限框架：[XXPermissions](https://github.com/getActivity/XXPermissions)、[PermissionX](https://github.com/guolindev/PermissionX)。

**这里使用 PermissionX 框架：**

安装：

```java
dependencies {
    implementation 'com.permissionx.guolindev:permissionx:1.4.0'
}
```

基本使用：

```java
PermissionX.init(this)
    .permissions(Manifest.permission.CAMERA, Manifest.permission.ACCESS_FINE_LOCATION)
    .onExplainRequestReason { scope, deniedList ->
        val message = "拍照功能需要您同意相册和定位权限"
        val ok = "确定"
        scope.showRequestReasonDialog(deniedList, message, ok)
    }
    .onForwardToSettings { scope, deniedList ->
        val message = "您需要去设置当中同意相册和定位权限"
        val ok = "确定"
        scope.showForwardToSettingsDialog(deniedList, message, ok)
    }
    .request { _, _, _ ->
        call()
    }
```

