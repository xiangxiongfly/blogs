[TOC]

# Android 获取屏幕、状态栏、导航栏信息

## 结构关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/64bcc532125148b8b42282c811a75b94.png)

**手机屏幕高度 = 状态栏高度 + ActionBar高度 + ContentView高度 + 导航栏高度**





## 使用

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        int screenWidth = ScreenUtils.getScreenWidth();
        int screenHeight = ScreenUtils.getScreenHeight();
        Log.e("TAG", "屏幕宽高：" + screenWidth + " - " + screenHeight);

        int appScreenWidth = ScreenUtils.getAppScreenWidth();
        int appScreenHeight = ScreenUtils.getAppScreenHeight();
        Log.e("TAG", "屏幕宽高（排除系统装饰元素）：" + appScreenWidth + " - " + appScreenHeight);

        int statusBarHeight = BarUtils.getStatusBarHeight();
        Log.e("TAG", "状态栏高度：" + statusBarHeight);

        int actionBarHeight = BarUtils.getActionBarHeight();
        Log.e("TAG", "ActionBar高度：" + actionBarHeight);

        View decorView = getWindow().getDecorView();
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                boolean navBarVisible = BarUtils.isNavBarVisible(MainActivity.this);
                Log.e("TAG", "底部导航栏是否显示：" + navBarVisible);
                int navBarHeight = BarUtils.getNavBarHeight();
                Log.e("TAG", "底部导航栏高度：" + navBarHeight);

                int decorViewWidth = decorView.getWidth();
                int decorViewHeight = decorView.getHeight();
                Log.e("TAG", "DecorView的宽高：" + decorViewWidth + " - " + decorViewHeight);

                int contentViewWidth = ScreenUtils.getContentViewWidth(MainActivity.this);
                int contentViewHeight = ScreenUtils.getContentViewHeight(MainActivity.this);
                Log.e("TAG", "Content View的宽高：" + contentViewWidth + " - " + contentViewHeight);
                decorView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        });
    }
}
```

在vivo iqoo2手机下输出信息：

```
屏幕宽高：1080 - 2340
屏幕宽高（排除系统装饰元素）：1080 - 2141
状态栏高度：84
ActionBar高度：168
底部导航栏是否显示：true
底部导航栏高度：126
DecorView的宽高：1080 - 2340
Content View的宽高：1080 - 1962
```

在xiaomi13手机下输出信息：

```
屏幕宽高：1440 - 3200
屏幕宽高（排除系统装饰元素）：1440 - 2898
状态栏高度：137
ActionBar高度：196
底部导航栏是否显示：true
底部导航栏高度：165
DecorView的宽高：1440 - 3200
Content View的宽高：1440 - 2702
```

**说明：**

在小米13下：`ScreenUtils.getScreenHeight()` 等于 `ScreenUtils.getAppScreenWidth() + 状态栏高度 +导航栏高度`。

但在在vivo iqoo2手机下：ScreenUtils.getScreenHeight() 等于 `ScreenUtils.getAppScreenWidth() + 199`，状态栏高度是84，导航栏高度是126，这个199是什么？说明 ScreenUtils.getAppScreenWidth() 这个方法是不稳定的。



## 开启全面屏手势

在vivo iqoo2手机下输出信息：

```
屏幕宽高：1080 - 2340
屏幕宽高（排除系统装饰元素）：1080 - 2267
状态栏高度：84
ActionBar高度：168
底部导航栏是否显示：false
底部导航栏高度：126
DecorView的宽高：1080 - 2340
Content View的宽高：1080 - 2088
```

查看LayoutSpector：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f5577cf0484e4f56bf5ff8a0f4934c5b.png)

在xiaomi13手机下输出信息：

```
屏幕宽高：1440 - 3200
屏幕宽高（排除系统装饰元素）：1440 - 3007
状态栏高度：137
ActionBar高度：196
底部导航栏是否显示：true
底部导航栏高度：165
DecorView的宽高：1440 - 3200
Content View的宽高：1440 - 2811
```

查看LayoutSpector：

![在这里插入图片描述](https://img-blog.csdnimg.cn/063a32b798fe4deca5a0c84856dfc742.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7d3014b3080649b6ba384664388622b0.png)

**说明：**

开启全面屏手势后，获取底部导航栏高度都不准确了，在vivo iqoo2手机直接隐藏导航栏，而小米13手机的导航栏高度则变小了。



## 工具类

**ScreenUtils.java**

```java
public class ScreenUtils {

    /**
     * 获取屏幕宽度
     */
    public static int getScreenWidth() {
        WindowManager wm = (WindowManager) BaseApp.getApp().getSystemService(Context.WINDOW_SERVICE);
        if (wm == null) return -1;
        Point point = new Point();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            //Andoird 4.0时，引入了虚拟导航键
            wm.getDefaultDisplay().getRealSize(point);
        } else {
            wm.getDefaultDisplay().getSize(point);
        }
        return point.x;
    }

    /**
     * 获取屏幕高度
     */
    public static int getScreenHeight() {
        WindowManager wm = (WindowManager) BaseApp.getApp().getSystemService(Context.WINDOW_SERVICE);
        if (wm == null) return -1;
        Point point = new Point();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            wm.getDefaultDisplay().getRealSize(point);
        } else {
            wm.getDefaultDisplay().getSize(point);
        }
        return point.y;
    }

    /**
     * 获取宽度（排除系统装饰元素，如底部导航栏等），此方法是不准确的
     */
    public static int getAppScreenWidth() {
        WindowManager wm = (WindowManager) BaseApp.getApp().getSystemService(Context.WINDOW_SERVICE);
        if (wm == null) return -1;
        Point point = new Point();
        wm.getDefaultDisplay().getSize(point);
        return point.x;
    }

    /**
     * 获取高度（排除系统装饰元素，如底部导航栏等），此方法是不准确的
     */
    public static int getAppScreenHeight() {
        WindowManager wm = (WindowManager) BaseApp.getApp().getSystemService(Context.WINDOW_SERVICE);
        if (wm == null) return -1;
        Point point = new Point();
        wm.getDefaultDisplay().getSize(point);
        return point.y;
    }

    /**
     * 获取ContentView宽度
     */
    public static int getContentViewWidth(Activity activity) {
        View contentView = activity.findViewById(Window.ID_ANDROID_CONTENT);
        return contentView.getWidth();
    }

    /**
     * 获取ContentView高度
     */
    public static int getContentViewHeight(Activity activity) {
        View contentView = activity.findViewById(Window.ID_ANDROID_CONTENT);
        return contentView.getHeight();
    }
}
```

**BarUtils.java**

```java
public final class BarUtils {

    /**
     * 获取ActionBar高度
     */
    public static int getActionBarHeight() {
        TypedValue tv = new TypedValue();
        if (BaseApp.getApp().getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
            return TypedValue.complexToDimensionPixelSize(
                    tv.data, BaseApp.getApp().getResources().getDisplayMetrics()
            );
        }
        return 0;
    }

    /**
     * 获取状态栏高度
     */
    public static int getStatusBarHeight() {
        Resources resources = Resources.getSystem();
        int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
        return resources.getDimensionPixelSize(resourceId);
    }

    /**
     * 获取底部导航栏高度
     */
    public static int getNavBarHeight() {
        Resources res = Resources.getSystem();
        int resourceId = res.getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId != 0) {
            return res.getDimensionPixelSize(resourceId);
        } else {
            return 0;
        }
    }

    /**
     * 判断底部状态栏是否显示
     */
    public static boolean isNavBarVisible(@NonNull final Activity activity) {
        return isNavBarVisible(activity.getWindow());
    }

    /**
     * 判断底部状态栏是否显示
     */
    public static boolean isNavBarVisible(@NonNull final Window window) {
        boolean isVisible = false;
        ViewGroup decorView = (ViewGroup) window.getDecorView();
        for (int i = 0, count = decorView.getChildCount(); i < count; i++) {
            final View child = decorView.getChildAt(i);
            final int id = child.getId();
            if (id != View.NO_ID) {
                String resourceEntryName = getResNameById(id);
                if ("navigationBarBackground".equals(resourceEntryName)
                        && child.getVisibility() == View.VISIBLE) {
                    isVisible = true;
                    break;
                }
            }
        }
        if (isVisible) {
            // 对于三星手机，android10以下非OneUI2的版本，比如 s8，note8 等设备上，
            // 导航栏显示存在bug："当用户隐藏导航栏时显示输入法的时候导航栏会跟随显示"，会导致隐藏输入法之后判断错误
            // 这个问题在 OneUI 2 & android 10 版本已修复
            if (RomUtils.isSamsung()
                    && Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
                    && Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                try {
                    return Settings.Global.getInt(BaseApp.getApp().getContentResolver(), "navigationbar_hide_bar_enabled") == 0;
                } catch (Exception ignore) {
                }
            }

            int visibility = decorView.getSystemUiVisibility();
            isVisible = (visibility & View.SYSTEM_UI_FLAG_HIDE_NAVIGATION) == 0;
        }

        return isVisible;
    }

    private static String getResNameById(int id) {
        try {
            return BaseApp.getApp().getResources().getResourceEntryName(id);
        } catch (Exception ignore) {
            return "";
        }
    }
}
```

**RomUtils.java**

```java
public final class RomUtils {

    private static final String[] ROM_HUAWEI    = {"huawei"};
    private static final String[] ROM_VIVO      = {"vivo"};
    private static final String[] ROM_XIAOMI    = {"xiaomi"};
    private static final String[] ROM_OPPO      = {"oppo"};
    private static final String[] ROM_LEECO     = {"leeco", "letv"};
    private static final String[] ROM_360       = {"360", "qiku"};
    private static final String[] ROM_ZTE       = {"zte"};
    private static final String[] ROM_ONEPLUS   = {"oneplus"};
    private static final String[] ROM_NUBIA     = {"nubia"};
    private static final String[] ROM_COOLPAD   = {"coolpad", "yulong"};
    private static final String[] ROM_LG        = {"lg", "lge"};
    private static final String[] ROM_GOOGLE    = {"google"};
    private static final String[] ROM_SAMSUNG   = {"samsung"};
    private static final String[] ROM_MEIZU     = {"meizu"};
    private static final String[] ROM_LENOVO    = {"lenovo"};
    private static final String[] ROM_SMARTISAN = {"smartisan", "deltainno"};
    private static final String[] ROM_HTC       = {"htc"};
    private static final String[] ROM_SONY      = {"sony"};
    private static final String[] ROM_GIONEE    = {"gionee", "amigo"};
    private static final String[] ROM_MOTOROLA  = {"motorola"};

    private static final String VERSION_PROPERTY_HUAWEI  = "ro.build.version.emui";
    private static final String VERSION_PROPERTY_VIVO    = "ro.vivo.os.build.display.id";
    private static final String VERSION_PROPERTY_XIAOMI  = "ro.build.version.incremental";
    private static final String VERSION_PROPERTY_OPPO    = "ro.build.version.opporom";
    private static final String VERSION_PROPERTY_LEECO   = "ro.letv.release.version";
    private static final String VERSION_PROPERTY_360     = "ro.build.uiversion";
    private static final String VERSION_PROPERTY_ZTE     = "ro.build.MiFavor_version";
    private static final String VERSION_PROPERTY_ONEPLUS = "ro.rom.version";
    private static final String VERSION_PROPERTY_NUBIA   = "ro.build.rom.id";
    private final static String UNKNOWN                  = "unknown";

    private static RomInfo bean = null;

    private RomUtils() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    /**
     * Return whether the rom is made by huawei.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isHuawei() {
        return ROM_HUAWEI[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by vivo.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isVivo() {
        return ROM_VIVO[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by xiaomi.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isXiaomi() {
        return ROM_XIAOMI[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by oppo.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isOppo() {
        return ROM_OPPO[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by leeco.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isLeeco() {
        return ROM_LEECO[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by 360.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean is360() {
        return ROM_360[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by zte.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isZte() {
        return ROM_ZTE[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by oneplus.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isOneplus() {
        return ROM_ONEPLUS[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by nubia.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isNubia() {
        return ROM_NUBIA[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by coolpad.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isCoolpad() {
        return ROM_COOLPAD[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by lg.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isLg() {
        return ROM_LG[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by google.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isGoogle() {
        return ROM_GOOGLE[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by samsung.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isSamsung() {
        return ROM_SAMSUNG[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by meizu.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isMeizu() {
        return ROM_MEIZU[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by lenovo.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isLenovo() {
        return ROM_LENOVO[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by smartisan.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isSmartisan() {
        return ROM_SMARTISAN[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by htc.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isHtc() {
        return ROM_HTC[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by sony.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isSony() {
        return ROM_SONY[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by gionee.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isGionee() {
        return ROM_GIONEE[0].equals(getRomInfo().name);
    }

    /**
     * Return whether the rom is made by motorola.
     *
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isMotorola() {
        return ROM_MOTOROLA[0].equals(getRomInfo().name);
    }

    /**
     * Return the rom's information.
     *
     * @return the rom's information
     */
    public static RomInfo getRomInfo() {
        if (bean != null) return bean;
        bean = new RomInfo();
        final String brand = getBrand();
        final String manufacturer = getManufacturer();
        if (isRightRom(brand, manufacturer, ROM_HUAWEI)) {
            bean.name = ROM_HUAWEI[0];
            String version = getRomVersion(VERSION_PROPERTY_HUAWEI);
            String[] temp = version.split("_");
            if (temp.length > 1) {
                bean.version = temp[1];
            } else {
                bean.version = version;
            }
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_VIVO)) {
            bean.name = ROM_VIVO[0];
            bean.version = getRomVersion(VERSION_PROPERTY_VIVO);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_XIAOMI)) {
            bean.name = ROM_XIAOMI[0];
            bean.version = getRomVersion(VERSION_PROPERTY_XIAOMI);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_OPPO)) {
            bean.name = ROM_OPPO[0];
            bean.version = getRomVersion(VERSION_PROPERTY_OPPO);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_LEECO)) {
            bean.name = ROM_LEECO[0];
            bean.version = getRomVersion(VERSION_PROPERTY_LEECO);
            return bean;
        }

        if (isRightRom(brand, manufacturer, ROM_360)) {
            bean.name = ROM_360[0];
            bean.version = getRomVersion(VERSION_PROPERTY_360);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_ZTE)) {
            bean.name = ROM_ZTE[0];
            bean.version = getRomVersion(VERSION_PROPERTY_ZTE);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_ONEPLUS)) {
            bean.name = ROM_ONEPLUS[0];
            bean.version = getRomVersion(VERSION_PROPERTY_ONEPLUS);
            return bean;
        }
        if (isRightRom(brand, manufacturer, ROM_NUBIA)) {
            bean.name = ROM_NUBIA[0];
            bean.version = getRomVersion(VERSION_PROPERTY_NUBIA);
            return bean;
        }

        if (isRightRom(brand, manufacturer, ROM_COOLPAD)) {
            bean.name = ROM_COOLPAD[0];
        } else if (isRightRom(brand, manufacturer, ROM_LG)) {
            bean.name = ROM_LG[0];
        } else if (isRightRom(brand, manufacturer, ROM_GOOGLE)) {
            bean.name = ROM_GOOGLE[0];
        } else if (isRightRom(brand, manufacturer, ROM_SAMSUNG)) {
            bean.name = ROM_SAMSUNG[0];
        } else if (isRightRom(brand, manufacturer, ROM_MEIZU)) {
            bean.name = ROM_MEIZU[0];
        } else if (isRightRom(brand, manufacturer, ROM_LENOVO)) {
            bean.name = ROM_LENOVO[0];
        } else if (isRightRom(brand, manufacturer, ROM_SMARTISAN)) {
            bean.name = ROM_SMARTISAN[0];
        } else if (isRightRom(brand, manufacturer, ROM_HTC)) {
            bean.name = ROM_HTC[0];
        } else if (isRightRom(brand, manufacturer, ROM_SONY)) {
            bean.name = ROM_SONY[0];
        } else if (isRightRom(brand, manufacturer, ROM_GIONEE)) {
            bean.name = ROM_GIONEE[0];
        } else if (isRightRom(brand, manufacturer, ROM_MOTOROLA)) {
            bean.name = ROM_MOTOROLA[0];
        } else {
            bean.name = manufacturer;
        }
        bean.version = getRomVersion("");
        return bean;
    }

    private static boolean isRightRom(final String brand, final String manufacturer, final String... names) {
        for (String name : names) {
            if (brand.contains(name) || manufacturer.contains(name)) {
                return true;
            }
        }
        return false;
    }

    private static String getManufacturer() {
        try {
            String manufacturer = Build.MANUFACTURER;
            if (!TextUtils.isEmpty(manufacturer)) {
                return manufacturer.toLowerCase();
            }
        } catch (Throwable ignore) {/**/}
        return UNKNOWN;
    }

    private static String getBrand() {
        try {
            String brand = Build.BRAND;
            if (!TextUtils.isEmpty(brand)) {
                return brand.toLowerCase();
            }
        } catch (Throwable ignore) {/**/}
        return UNKNOWN;
    }

    private static String getRomVersion(final String propertyName) {
        String ret = "";
        if (!TextUtils.isEmpty(propertyName)) {
            ret = getSystemProperty(propertyName);
        }
        if (TextUtils.isEmpty(ret) || ret.equals(UNKNOWN)) {
            try {
                String display = Build.DISPLAY;
                if (!TextUtils.isEmpty(display)) {
                    ret = display.toLowerCase();
                }
            } catch (Throwable ignore) {/**/}
        }
        if (TextUtils.isEmpty(ret)) {
            return UNKNOWN;
        }
        return ret;
    }

    private static String getSystemProperty(final String name) {
        String prop = getSystemPropertyByShell(name);
        if (!TextUtils.isEmpty(prop)) return prop;
        prop = getSystemPropertyByStream(name);
        if (!TextUtils.isEmpty(prop)) return prop;
        if (Build.VERSION.SDK_INT < 28) {
            return getSystemPropertyByReflect(name);
        }
        return prop;
    }

    private static String getSystemPropertyByShell(final String propName) {
        String line;
        BufferedReader input = null;
        try {
            Process p = Runtime.getRuntime().exec("getprop " + propName);
            input = new BufferedReader(new InputStreamReader(p.getInputStream()), 1024);
            String ret = input.readLine();
            if (ret != null) {
                return ret;
            }
        } catch (IOException ignore) {
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException ignore) {/**/}
            }
        }
        return "";
    }

    private static String getSystemPropertyByStream(final String key) {
        try {
            Properties prop = new Properties();
            FileInputStream is = new FileInputStream(
                    new File(Environment.getRootDirectory(), "build.prop")
            );
            prop.load(is);
            return prop.getProperty(key, "");
        } catch (Exception ignore) {/**/}
        return "";
    }

    private static String getSystemPropertyByReflect(String key) {
        try {
            @SuppressLint("PrivateApi")
            Class<?> clz = Class.forName("android.os.SystemProperties");
            Method getMethod = clz.getMethod("get", String.class, String.class);
            return (String) getMethod.invoke(clz, key, "");
        } catch (Exception e) {/**/}
        return "";
    }

    public static class RomInfo {
        private String name;
        private String version;

        public String getName() {
            return name;
        }

        public String getVersion() {
            return version;
        }

        @Override
        public String toString() {
            return "RomInfo{name=" + name +
                    ", version=" + version + "}";
        }
    }
}
```



## 总结

- 在获取屏幕宽高时，建议使用 getRealSize() 方法。
- 在获取导航栏高度时，需要在布局绘制完成后判断是否显示，然后通过屏幕高度减去状态栏高度和ActionBar高度和ContentView高度。



## [代码下载](https://download.csdn.net/download/qq_14876133/88499196)

