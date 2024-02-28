[TOC]

# Android 基于Fragment的权限封装

## 原理

业内普遍比较认可使用另外一种小技巧来进行实现。是什么小技巧呢？回想一下，之前所有申请运行时权限的操作都是在 Activity 中进行的，事实上，Android 在 Fragment 中也提供了一份相同的 API，使得我们在 Fragment 中也能申请运行时权限。

但不同的是，Fragment 并不像 Activity 那样必须有界面，我们完全可以向 Activity 中添加一个隐藏的 Fragment，然后在这个隐藏的 Fragment 中对运行时权限的 API 进行封装。这是一种非常轻量级的做法，不用担心隐藏 Fragment 会对 Activity 的性能造成什么影响。

 

## 代码

### PermissionUtils.java

```java
/**
 * 权限工具类
 */
public class PermissionUtils {
    public static final int REQUEST_SETTING_CODE = 0X123456;

    /**
     * 权限是否授予
     */
    public static boolean isGranted(@NonNull Context context, @NonNull String permission) {
        return ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * 权限是否全部授予
     */
    public static boolean isGrantedPermissions(@NonNull Context context, @NonNull ArrayList<String> permissionList) {
        for (String permission : permissionList) {
            if (!isGranted(context, permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 权限是否拒绝且不再询问
     */
    public static boolean isDeniedNever(@NonNull Activity activity, @NonNull String permission) {
        return !ActivityCompat.shouldShowRequestPermissionRationale(activity, permission);
    }

    /**
     * 权限是否包含拒绝且不再询问
     */
    public static boolean isDeniedNeverPermissions(@NonNull Activity activity, @NonNull ArrayList<String> permissions) {
        for (String permission : permissions) {
            if (isDeniedNever(activity, permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取未授权权限
     */
    public static ArrayList<String> getDeniedPermissions(@NonNull Context context, @NonNull ArrayList<String> permissionList) {
        ArrayList<String> deniedPermissionList = new ArrayList<>();
        for (String permission : permissionList) {
            if (!isGranted(context, permission)) {
                deniedPermissionList.add(permission);
            }
        }
        return deniedPermissionList;
    }

    /**
     * 获取包名Uri
     */
    static Uri getPackageNameUri(@NonNull Context context) {
        return Uri.parse("package:" + context.getPackageName());
    }

    /**
     * 跳转设置界面
     */
    public static void gotoSetting(@NonNull Activity activity) {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(getPackageNameUri(activity));
        activity.startActivityForResult(intent, REQUEST_SETTING_CODE);
    }

    public static void gotoSetting(@NonNull Fragment fragment) {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(getPackageNameUri(fragment.getContext()));
        fragment.startActivityForResult(intent, REQUEST_SETTING_CODE);
    }

    /**
     * 锁定屏幕方向
     */
    public static void lockScreenOrientation(@NonNull Activity activity) {
        try {
            // 获取实际屏幕方向
            int screenOrientation = activity.getResources().getConfiguration().orientation;
            switch (screenOrientation) {
                case Configuration.ORIENTATION_LANDSCAPE:
                    activity.setRequestedOrientation(PermissionUtils.isActivityReverse(activity) ?
                            ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE :
                            ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    break;
                case Configuration.ORIENTATION_PORTRAIT:
                    activity.setRequestedOrientation(PermissionUtils.isActivityReverse(activity) ?
                            ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT :
                            ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    break;
                default:
                    break;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Activity是否反方向旋转
     */
    public static boolean isActivityReverse(@NonNull Activity activity) {
        int activityRotation;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            activityRotation = activity.getDisplay().getRotation();
        } else {
            activityRotation = activity.getWindowManager().getDefaultDisplay().getRotation();
        }
        switch (activityRotation) {
            case Surface.ROTATION_180:
            case Surface.ROTATION_270:
                return true;
            case Surface.ROTATION_0:
            case Surface.ROTATION_90:
            default:
                return false;
        }
    }
}
```

### PermissionsFragment.java

```java
/**
 * 权限请求Fragment
 */
public class PermissionsFragment extends Fragment {
    public static final String REQUEST_CODE = "requestCode"; //请求码
    public static final String PARAM_PERMISSIONS = "permissionList";

    /**
     * 权限结果回调
     */
    @Nullable
    private OnPermissionCallback mOnPermissionCallback;
    /**
     * 设置结果回调
     */
    @Nullable
    private OnSettingsCallback mOnSettingsCallback;
    /**
     * 获取当前请求的屏幕方向
     */
    private int mScreenOrientation;
    private PermissionHelper mHelper;
    private ArrayList<String> allPermissionList;
    private int mRequestCode;
    private static final ArrayList<Integer> requestCodeList = new ArrayList<>();

    public static void launch(@NonNull FragmentActivity activity, @NonNull ArrayList<String> permissionList, @NonNull PermissionHelper helper,
                              @NonNull OnPermissionCallback onPermissionCallback, @Nullable OnSettingsCallback onSettingsCallback) {
        PermissionsFragment fragment = new PermissionsFragment();
        Bundle bundle = new Bundle();
        int requestCode = generateCode();
        bundle.putInt(REQUEST_CODE, requestCode);
        bundle.putStringArrayList(PARAM_PERMISSIONS, permissionList);
        fragment.setArguments(bundle);
        fragment.setRetainInstance(true);
        fragment.setCallback(onPermissionCallback, onSettingsCallback);
        fragment.setHelper(helper);
        fragment.attachActivity(activity);
    }

    private void setHelper(PermissionHelper helper) {
        mHelper = helper;
    }

    /**
     * 随机生成requestCode
     */
    private static int generateCode() {
        int requestCode = new Random().nextInt(65536);
        while (requestCodeList.contains(requestCode)) {
            requestCode = new Random().nextInt(65536);
        }
        requestCodeList.add(requestCode);
        return requestCode;
    }

    /**
     * 绑定Activity
     */
    private void attachActivity(@NonNull FragmentActivity activity) {
        activity.getSupportFragmentManager().beginTransaction().add(this, this.toString()).commitAllowingStateLoss();
    }

    /**
     * 解绑Activity
     */
    private void detachActivity(@NonNull FragmentActivity activity) {
        activity.getSupportFragmentManager().beginTransaction().remove(this).commitAllowingStateLoss();
    }

    /**
     * 设置权限监听回调监听
     */
    public void setCallback(@NonNull OnPermissionCallback onPermissionCallback, @Nullable OnSettingsCallback onSettingsCallback) {
        mOnPermissionCallback = onPermissionCallback;
        mOnSettingsCallback = onSettingsCallback;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        FragmentActivity activity = getActivity();
        if (activity == null) {
            return;
        }

        Bundle bundle = getArguments();
        if (bundle != null) {
            ArrayList<String> permissionList = bundle.getStringArrayList(PARAM_PERMISSIONS);
            if (permissionList == null || permissionList.isEmpty()) {
                return;
            }
            mRequestCode = bundle.getInt(REQUEST_CODE);
            allPermissionList = permissionList;
        }

        // 获取请求的屏幕方向
        mScreenOrientation = activity.getRequestedOrientation();
        // 如果未指定屏幕方向，就锁定当前屏幕方向
        if (mScreenOrientation == ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED) {
            PermissionUtils.lockScreenOrientation(activity);
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        FragmentActivity activity = getActivity();
        if (activity == null) {
            return;
        }
        // 如果当前屏幕方向是未指定，同时当前请求的屏幕方向是横屏或竖屏时，则屏幕方向切换为未指定方向模式
        if (mScreenOrientation == ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED &&
                activity.getRequestedOrientation() != ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED) {
            activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        requestPermissions(allPermissionList.toArray(new String[allPermissionList.size() - 1]), mRequestCode);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NotNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (permissions.length == 0 || grantResults.length == 0) {
            return;
        }
        if (requestCode == mRequestCode) {
            FragmentActivity activity = getActivity();
            if (activity == null) {
                return;
            }
            ArrayList<String> grantedList = new ArrayList<>(); //已授予权限
            ArrayList<String> deniedList = new ArrayList<>(); //已拒绝权限
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    deniedList.add(permissions[i]);
                } else {
                    grantedList.add(permissions[i]);
                }
            }
            requestCodeList.remove((Integer) mRequestCode);
            OnPermissionCallback onPermissionCallback = mOnPermissionCallback;
            mOnPermissionCallback = null;
            OnSettingsCallback onSettingsCallback = mOnSettingsCallback;
            mOnSettingsCallback = null;
            PermissionHelper helper = mHelper;
            mHelper = null;
            detachActivity(activity);

            boolean allGranted = grantedList.size() == permissions.length;
            if (allGranted) {
                onPermissionCallback.onGranted(true, grantedList);
                return;
            }

            boolean deniedNever = PermissionUtils.isDeniedNeverPermissions(activity, deniedList);
            onPermissionCallback.onDenied(deniedNever, deniedList);

            if (grantedList.size() > 0) {
                onPermissionCallback.onGranted(false, grantedList);
            }

            if (deniedNever) {
                helper.showPermissionSettingDialog(activity, deniedList, onSettingsCallback);
            } else if (deniedList.size() > 0) {
                helper.showPermissionInfoDialog(activity, deniedList, onPermissionCallback, onSettingsCallback);
            }
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mOnPermissionCallback = null;
    }
}
```

```java
/**
 * 权限结果回调
 */
public interface OnPermissionCallback {

    /**
     * 权限授予时回调
     *
     * @param allGranted  是否全部被授予
     * @param permissions 已授予权限
     */
    void onGranted(boolean allGranted, @NonNull ArrayList<String> permissions);

    /**
     * 权限拒绝时回调
     *
     * @param deniedNever 是否拒绝且不再询问
     * @param permissions 被拒绝权限
     */
    void onDenied(boolean deniedNever, @NonNull ArrayList<String> permissions);
}
```

```java
public interface OnSettingsCallback {
    void onResult();
}
```

### PermissionHelper.java

```java
/**
 * 权限请求类
 */
public class PermissionHelper {

    @Nullable
    private final FragmentActivity mActivity;
    @NonNull
    private final ArrayList<String> mPermissions = new ArrayList<>();

    private PermissionHelper(FragmentActivity activity) {
        mActivity = activity;
    }

    /**
     * 设置请求对象
     */
    public static PermissionHelper with(FragmentActivity activity) {
        return new PermissionHelper(activity);
    }

    public static PermissionHelper with(Fragment fragment) {
        FragmentActivity activity = fragment.getActivity();
        return new PermissionHelper(activity);
    }

    public PermissionHelper permissions(@NonNull ArrayList<String> permissionList) {
        mPermissions.addAll(permissionList);
        return this;
    }

    /**
     * 请求权限
     */
    public void request(@NonNull OnPermissionCallback onPermissionCallback) {
        request(onPermissionCallback, null);
    }

    public void request(@NonNull OnPermissionCallback onPermissionCallback, @Nullable OnSettingsCallback onSettingsCallback) {
        if (mActivity == null || mActivity.isFinishing() || mActivity.isDestroyed()) {
            return;
        }
        showPermissionInfoDialog(mActivity, mPermissions, onPermissionCallback, onSettingsCallback);
    }

    /**
     * 权限说明弹窗
     */
    public void showPermissionInfoDialog(@NonNull FragmentActivity activity, @NonNull ArrayList<String> allPermissions, @NonNull OnPermissionCallback onPermissionCallback) {
        showPermissionInfoDialog(activity, allPermissions, onPermissionCallback, null);
    }

    public void showPermissionInfoDialog(FragmentActivity activity, @NonNull ArrayList<String> allPermissions, @NonNull OnPermissionCallback onPermissionCallback, @Nullable OnSettingsCallback onSettingsCallback) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed()) {
            return;
        }
        ArrayList<String> permissionList = PermissionUtils.getDeniedPermissions(activity, allPermissions);
        String title = "权限说明";
        String message = "使用此功能需要先授予：" + listToString(getPermissionNames(permissionList));
        new AlertDialog.Builder(activity)
                .setTitle(title)
                .setMessage(message)
                .setCancelable(false)
                .setPositiveButton("授予", (dialog, which) -> {
                    dialog.dismiss();
                    PermissionsFragment.launch(activity, permissionList, this, onPermissionCallback, onSettingsCallback);
                })
                .setNegativeButton("取消", (dialog, which) -> {
                })
                .show();
    }

    /**
     * 获取权限名
     */
    public static ArrayList<String> getPermissionNames(ArrayList<String> permissions) {
        ArrayList<String> permissionNames = new ArrayList<>();
        for (String permission : permissions) {
            switch (permission) {
                case Manifest.permission.CAMERA:
                    permissionNames.add("相机权限");
                    break;
                case Manifest.permission.ACCESS_FINE_LOCATION:
                    permissionNames.add("定位权限");
                    break;
                case Manifest.permission.CALL_PHONE:
                    permissionNames.add("拨号权限");
                    break;
                default:
                    break;
            }
        }
        return permissionNames;
    }

    /**
     * ArrayList转String
     */
    public static String listToString(ArrayList<String> permissionNames) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0, size = permissionNames.size(); i < size; i++) {
            if (i == size - 1) {
                builder.append(permissionNames.get(i));
            } else {
                builder.append(permissionNames.get(i)).append("、");
            }
        }
        return builder.toString();
    }

    /**
     * 权限提醒弹窗
     */
    public void showPermissionSettingDialog(FragmentActivity activity, ArrayList<String> permissionList, @Nullable OnSettingsCallback onSettingsCallback) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed()) {
            return;
        }
        String title = "权限提醒";
        String message = "获取权限失败，请手动授予：" + listToString(getPermissionNames(permissionList));
        new AlertDialog.Builder(activity)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("前往授权", (dialog, which) -> {
                    dialog.dismiss();
                    SettingsFragment.launch(activity, onSettingsCallback);
                })
                .show();
    }
}
```

### SettingsFragment.java

```java
/**
 * 跳转设置页Fragment
 */
public class SettingsFragment extends Fragment {

    @Nullable
    private OnSettingsCallback mCallBack;

    public static void launch(@NonNull FragmentActivity activity, @Nullable OnSettingsCallback callback) {
        SettingsFragment fragment = new SettingsFragment();
        fragment.setRetainInstance(true);
        if (callback != null)
            fragment.setCallback(callback);
        fragment.attachActivity(activity);
    }

    /**
     * 设置回调
     */
    public void setCallback(@NonNull OnSettingsCallback callback) {
        mCallBack = callback;
    }

    /**
     * 绑定Activity
     */
    private void attachActivity(@NonNull FragmentActivity activity) {
        activity.getSupportFragmentManager().beginTransaction().add(this, this.toString()).commitAllowingStateLoss();
    }

    /**
     * 解绑Activity
     */
    private void detachActivity(@NonNull FragmentActivity activity) {
        activity.getSupportFragmentManager().beginTransaction().remove(this).commitAllowingStateLoss();
    }

    @Override
    public void onResume() {
        super.onResume();
        PermissionUtils.gotoSetting(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable @org.jetbrains.annotations.Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PermissionUtils.REQUEST_SETTING_CODE) {
            OnSettingsCallback callback = mCallBack;
            mCallBack = null;
            if (callback != null) {
                callback.onResult();
            }
        }

        FragmentActivity activity = getActivity();
        if (activity == null) {
            return;
        }
        detachActivity(activity);
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mCallBack = null;
    }
}
```

### Activity中使用

```java
{
    ArrayList<String> permissionList = new ArrayList<>();
    permissionList.add(Manifest.permission.CAMERA);
    permissionList.add(Manifest.permission.ACCESS_FINE_LOCATION);
    permissionList.add(Manifest.permission.CALL_PHONE);

    if (PermissionUtils.isGrantedPermissions(mContext, permissionList)) {
        Toast.makeText(mContext, "权限都通过了", Toast.LENGTH_SHORT).show();
    } else {
        PermissionHelper.with(this)
                .permissions(permissionList)
                .request(new OnPermissionCallback() {
                    @Override
                    public void onGranted(boolean allGranted, @NonNull ArrayList<String> permissions) {
                        if (allGranted) {
                            Toast.makeText(mContext, "权限全部通过", Toast.LENGTH_SHORT).show();
                        }
                        Log.e("TAG", "onGranted: " + allGranted + " - " + permissions);
                    }

                    @Override
                    public void onDenied(boolean deniedNever, @NonNull ArrayList<String> permissions) {
                        if (deniedNever) {
                            Toast.makeText(mContext, "权限拒绝且不再询问", Toast.LENGTH_SHORT).show();
                        }
                        Log.e("TAG", "onDenied: " + deniedNever + " - " + permissions);
                    }
                }, new OnSettingsCallback() {
                    @Override
                    public void onResult() {
                        Log.e("TAG", "onResult");
                    }
                });
    }
}
```

### Fragment中使用

```java
ArrayList<String> permissionList = new ArrayList<>();
permissionList.add(Manifest.permission.CAMERA);
permissionList.add(Manifest.permission.ACCESS_FINE_LOCATION);
permissionList.add(Manifest.permission.CALL_PHONE);

if (PermissionUtils.isGrantedPermissions(mContext, permissionList)) {
    Toast.makeText(mContext, "权限都通过了", Toast.LENGTH_SHORT).show();
} else {
    PermissionHelper.with(this)
        .permissions(permissionList)
        .request(new OnPermissionCallback() {
            @Override
            public void onGranted(boolean allGranted, @NonNull ArrayList<String> permissions) {
                if (allGranted) {
                    Toast.makeText(mContext, "权限全部通过", Toast.LENGTH_SHORT).show();
                }
                Log.e("TAG", "onGranted: " + allGranted + " - " + permissions);
            }

            @Override
            public void onDenied(boolean deniedNever, @NonNull ArrayList<String> permissions) {
                if (deniedNever) {
                    Toast.makeText(mContext, "权限拒绝且不再询问", Toast.LENGTH_SHORT).show();
                }
                Log.e("TAG", "onDenied: " + deniedNever + " - " + permissions);
            }
        }, new OnSettingsCallback() {
            @Override
            public void onResult() {
                Log.e("TAG", "onResult");
            }
        });
}
```



## [源码](https://github.com/xiangxiongfly/MyAndroidProject/tree/main/others/src/main/java/com/example/others/permissions)

