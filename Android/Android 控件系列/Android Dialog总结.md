[TOC]

# Dialog总结

## 系统内置控件

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b0794fedea044af0b4cfcaf9a39cf15b.png)

### AlertDialog

```java
new AlertDialog.Builder(context)
    .setIcon(R.mipmap.ic_launcher)
    .setTitle("系统提示")
    .setMessage("这是一个普通AlertDialog")
    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            Toast.makeText(context, "取消", Toast.LENGTH_SHORT).show();
        }
    })
    .setPositiveButton("确定", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            Toast.makeText(context, "确定", Toast.LENGTH_SHORT).show();
        }
    })
    .show();

```



### 普通列表AlertDialog

```java
final String[] fruits = {"apple", "banana", "cherry", "grape", "mango", "pear", "pineapple", "strawberry", "watermelon"};
new AlertDialog.Builder(context)
    .setTitle("水果列表")
    .setItems(fruits, new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            Toast.makeText(context, fruits[which], Toast.LENGTH_SHORT).show();
        }
    })
    .show();
```



### 单选列表AlertDialog

```java
final String[] fruits = {"apple", "banana", "cherry", "grape", "mango", "pear", "pineapple", "strawberry", "watermelon"};
new AlertDialog.Builder(context)
    .setTitle("水果列表")
    .setSingleChoiceItems(fruits, 0, new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            Toast.makeText(context, fruits[which], Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        }
    })
    .show();
```



### 多选列表AlertDialog

```java
final String[] fruits = {"apple", "banana", "cherry", "grape", "mango", "pear", "pineapple", "strawberry", "watermelon"};
final boolean[] checkItems = {false, false, false, false, false, false, false, false, false};
new AlertDialog.Builder(context)
    .setTitle("水果列表")
    .setMultiChoiceItems(fruits, checkItems, new DialogInterface.OnMultiChoiceClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which, boolean isChecked) {
            checkItems[which] = isChecked;
        }
    })
    .setPositiveButton("确定", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            String ret = "";
            for (int i = 0; i < checkItems.length; i++) {
                if (checkItems[i]) {
                    ret += fruits[i] + " ";
                }
            }
            Toast.makeText(context, ret, Toast.LENGTH_SHORT).show();
        }
    })
    .show();
```



### 自定义AlertDialog

```java
AlertDialog.Builder builder = new AlertDialog.Builder(context);
AlertDialog alertDialog = builder.create();
View dialogView = LayoutInflater.from(context).inflate(R.layout.dialog_custom_view, null);
dialogView.findViewById(R.id.btnCancle).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        alertDialog.dismiss();
    }
});
dialogView.findViewById(R.id.btnConfirm).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Toast.makeText(context, "确定", Toast.LENGTH_SHORT).show();
        alertDialog.dismiss();
    }
});
alertDialog.setView(dialogView);
alertDialog.setCancelable(false);//按返回键是否取消
alertDialog.setCanceledOnTouchOutside(false);//点击Dialog外部是否取消
alertDialog.show();
```



### 普通圆形ProgressDialog

```java
ProgressDialog.show(MainActivity.this, "提示", "正在加载。。。", false, true);
```



### 普通条形progressDialog

```
progressDialog = new ProgressDialog(context);
progressDialog.setTitle("提示");
progressDialog.setMessage("正在加载。。。");
progressDialog.setCancelable(true);
progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
progressDialog.setIndeterminate(false);//是否显示进度，必须设置为false才显示
progressDialog.show();
```



### 日期DatePickerDialog

```java
Calendar calendar = Calendar.getInstance();
new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        String ret = "";
        ret = year + "年" + (month + 1) + "月" + dayOfMonth + "日";
        Toast.makeText(context, ret, Toast.LENGTH_SHORT).show();
    }
},
                     calendar.get(Calendar.YEAR),
                     calendar.get(Calendar.MONTH),
                     calendar.get(Calendar.DAY_OF_MONTH)
                    ).show();
```



### 时间TimePickerDialog

```java
Calendar calendar = Calendar.getInstance();
new TimePickerDialog(context, android.app.AlertDialog.THEME_HOLO_LIGHT, new TimePickerDialog.OnTimeSetListener() {
    @Override
    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
        String ret = "";
        ret = hourOfDay + "时" + minute + "分";
        Toast.makeText(context, ret, Toast.LENGTH_SHORT).show();
    }
},
                     calendar.get(Calendar.HOUR_OF_DAY),
                     calendar.get(Calendar.MINUTE), true
                    ).show();
```



## 自定义Dialog（仿QQ弹窗）

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/0d3c93a2ab5f4524a95722bbeaa0b72a.png)

**dialog常用样式**

```xml
<style name="DialogStyle">
    <!--是否显示Title -->
    <item name="android:windowNoTitle">true</item>
    <!--Dialog中Window的背景颜色-->
    <item name="android:windowBackground">@android:color/transparent</item>
    <!--Dialog背景颜色-->
    <item name="android:background">@android:color/transparent</item>
    <!--去除边框-->
    <item name="android:windowFrame">@null</item>
    <!--Dialog外部区域是否模糊-->
    <item name="android:backgroundDimEnabled">true</item>
    <!--Dialog外部区域模糊度，当值为1 时，除了dialog以外的部分全黑-->
    <item name="android:backgroundDimAmount">0.6</item>
    <!--是否浮现在activity之上-->
    <item name="android:windowIsFloating">true</item>
    <!--是否半透明-->
    <item name="android:windowIsTranslucent">true</item>
    <!--竖屏状态下的dialog最小宽度-->
    <!--        <item name="android:windowMinWidthMinor">100%</item>-->
    <!--横屏状态下的dialog最小宽度-->
    <!--        <item name="android:windowMinWidthMajor">100%</item>-->
</style>

<style name="DialogStyle.Animation" parent="DialogStyle">
    <!-- dialog动画-->
    <item name="android:windowAnimationStyle">@style/DialogAnim</item>
</style>
```

**设置Dialog动画**

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--进入动画-->
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="200"
    android:fromYDelta="100%"
    android:interpolator="@android:anim/accelerate_interpolator"
    android:toXDelta="0" />
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--进入动画-->
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="200"
    android:fromYDelta="0%"
    android:interpolator="@android:anim/accelerate_interpolator"
    android:toYDelta="100%" />
```

```xml
<style name="DialogAnim" parent="android:Animation">
    <item name="android:windowEnterAnimation">@anim/anim_enter</item>
    <item name="android:windowExitAnimation">@anim/anim_exit</item>
</style>
```

**自定义Dialog：**

```kotlin
class QQDialog(context: Context) : Dialog(context, R.style.DialogStyle_Animation),
    View.OnClickListener {

    private lateinit var video: TextView
    private lateinit var photo: TextView
    private lateinit var cancel: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.dialog_qq)
        window?.apply {
            setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ) //设置宽高
            setGravity(Gravity.BOTTOM) //设置显示位置
        }
        setCanceledOnTouchOutside(true) //点击外部区域是否取消
        setCancelable(true) //按返回键是否取消
        initViews()
    }

    private fun initViews() {
        video = findViewById(R.id.video)
        photo = findViewById(R.id.photo)
        cancel = findViewById(R.id.cancel)
        video.setOnClickListener(this)
        photo.setOnClickListener(this)
        cancel.setOnClickListener(this)
    }

    override fun onClick(view: View) {
        when (view.id) {
            R.id.video -> {
                dismiss()
                mOnDialogClickListener?.onVideoClick()
            }
            R.id.photo -> {
                dismiss()
                mOnDialogClickListener?.onPhotoClick()
            }
            R.id.cancel -> dismiss()
        }
    }

    interface OnDialogClickListener {
        fun onVideoClick()
        fun onPhotoClick()
    }

    private var mOnDialogClickListener: OnDialogClickListener? = null

    fun setOnDialogClickListener(onDialogClickListener: OnDialogClickListener) {
        mOnDialogClickListener = onDialogClickListener
    }
}
```

**使用**

```kotlin
val qqDialog = QQDialog(mContext)
qqDialog.setOnDialogClickListener(object : QQDialog.OnDialogClickListener {
    override fun onVideoClick() {
        ToastUtils.show("点击了视频")
    }

    override fun onPhotoClick() {
        ToastUtils.show("点击了相册")
    }
})
qqDialog.show()
```



## [代码下载](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/home/src/main/java/com/example/home/dialog)

