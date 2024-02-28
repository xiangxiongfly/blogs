[TOC]

# Android 系统定位和高德定位

## 系统定位

### 工具类

```java
public class LocationUtils {
    public static final int REQUEST_LOCATION = 0xa1;

    /**
     * 判断定位服务是否开启
     */
    public static boolean isOpenLocationServer(Context context) {
        int locationMode = 0;
        try {
            locationMode = Settings.Secure.getInt(context.getContentResolver(), Settings.Secure.LOCATION_MODE);
        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
            return false;
        }
        return locationMode != Settings.Secure.LOCATION_MODE_OFF;
    }

    /**
     * 判断GPS是否可用
     */
    public static boolean isGPSEnabled(Context context) {
        LocationManager manager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        return manager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    /**
     * 判断定位是否可用
     */
    public static boolean isLocationEnabled(Context context) {
        LocationManager manager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        return manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER) || manager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }


    /**
     * 开启位置服务
     */
    public static void openLocation(Activity activity) {
        activity.startActivityForResult(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS), REQUEST_LOCATION);
    }

    /**
     * 开启位置服务
     */
    public static void openLocation(Fragment fragment) {
        fragment.startActivityForResult(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS), REQUEST_LOCATION);
    }

}
```

### 封装LocationManager

```java
public class LocationHelper {
    private static OnLocationChangeListener mOnLocationChangeListener;
    private static MyLocationListener mLocationListener;
    private static LocationManager mLocationManager;
    private static String mProvider;

    /**
     * 注册
     */
    public static void registerLocation(Context context, @Nullable OnLocationChangeListener listener) {
        mOnLocationChangeListener = listener;
        mLocationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        mProvider = mLocationManager.getBestProvider(getCriteria(), true);
        Location lastKnownLocation = mLocationManager.getLastKnownLocation(mProvider);
        if (listener != null && lastKnownLocation != null) {
            listener.onLastKnownLocation(lastKnownLocation);
        }
        mLocationListener = new MyLocationListener();
        startLocation();
    }

    /**
     * 开始定位
     */
    public static void startLocation() {
        // 第二个参数：更新定位的时间间隔，第三个参数：更新定位的距离范围
        mLocationManager.requestLocationUpdates(mProvider, 0, 0, mLocationListener);
    }

    /**
     * 停止定位
     */
    public static void stopLocation() {
        mLocationManager.removeUpdates(mLocationListener);
    }

    /**
     * 设置定位参数
     *
     * @return {@link Criteria}
     */
    private static Criteria getCriteria() {
        Criteria criteria = new Criteria();
        // 设置定位精确度 Criteria.ACCURACY_COARSE比较粗略，Criteria.ACCURACY_FINE则比较精细
        criteria.setAccuracy(Criteria.ACCURACY_FINE);
        // 设置是否要求速度
        criteria.setSpeedRequired(false);
        // 设置是否允许运营商收费
        criteria.setCostAllowed(false);
        // 设置是否需要方位信息
        criteria.setBearingRequired(false);
        // 设置是否需要海拔信息
        criteria.setAltitudeRequired(false);
        // 设置对电源的需求
        criteria.setPowerRequirement(Criteria.POWER_LOW);
        return criteria;
    }

    /**
     * 取消注册
     */
    public static void unregisterLocation() {
        if (mLocationManager != null) {
            if (mLocationListener != null) {
                mLocationManager.removeUpdates(mLocationListener);
            }
        }
        mLocationManager = null;
        mLocationListener = null;
        mOnLocationChangeListener = null;
    }

    public interface OnLocationChangeListener {
        void onLastKnownLocation(Location location);

        void onLocationChanged(Location location);
    }

    public static class MyLocationListener implements LocationListener {

        @Override
        public void onLocationChanged(@NonNull Location location) {
            if (mOnLocationChangeListener != null) {
                mOnLocationChangeListener.onLocationChanged(location);
            }
        }
    }
}
```

```java
public class LocationService extends Service {

    public static void actionStart(Context context) {
        context.startService(new Intent(context, LocationService.class));
    }

    public static void actionStop(Context context) {
        context.stopService(new Intent(context, LocationService.class));
    }

    @SuppressLint("MissingPermission")
    @Override
    public void onCreate() {
        super.onCreate();
        new Thread(() -> {
            Looper.prepare();
            LocationHelper.registerLocation(getApplicationContext(), new LocationHelper.OnLocationChangeListener() {
                @Override
                public void onLastKnownLocation(Location location) {
                    if (location != null) {
                        Log.e("TAG", "onLastKnownLocation= " + location);
                    }
                }

                @Override
                public void onLocationChanged(Location location) {
                    if (location != null) {
                        Log.e("TAG", "onLocationChanged= " + location);
                        stopSelf();
                    }
                }
            });
            Looper.loop();
        }).start();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        LocationHelper.unregisterLocation();
    }
}
```

### 使用

```java
// 开始定位
LocationService.actionStart(MainActivity.this, "start");

// 停止定位
LocationService.actionStart(MainActivity.this, "stop");

// 单次定位
LocationService.actionStart(MainActivity.this, "once");
```



## 高德定位

### 封装高德地图

```java
public class GDLocationHelper {
    private static AMapLocationClient locationClient;
    private static OnLocationChangeListener mOnLocationChangeListener;
    private static MyLocationListener mListener;

    public static void register(Context context, @Nullable OnLocationChangeListener onLocationChangeListener) {
        mOnLocationChangeListener = onLocationChangeListener;
        initLocation(context);
    }

    private static void initLocation(Context context) {
        locationClient = new AMapLocationClient(context);
        AMapLocation lastKnownLocation = locationClient.getLastKnownLocation();
        if (lastKnownLocation != null && mOnLocationChangeListener != null) {
            mOnLocationChangeListener.onLastKnownLocation(lastKnownLocation);
        }

        // 设置定位监听
        mListener = new MyLocationListener();
        locationClient.setLocationListener(mListener);
    }

    public static void startLocation() {
        locationClient.stopLocation();
        locationClient.setLocationOption(getDefaultOption(false));
        locationClient.startLocation();
    }

    public static void startOnceLocation() {
        locationClient.stopLocation();
        locationClient.setLocationOption(getDefaultOption(true));
        locationClient.startLocation();
    }

    public static void stopLocation() {
        locationClient.stopLocation();
    }

    public static void unregister() {
        stopLocation();
        locationClient.onDestroy();
        locationClient = null;
        mOnLocationChangeListener = null;
        mListener = null;
    }

    public static AMapLocationClientOption getDefaultOption(boolean isOnce) {
        AMapLocationClientOption mOption = new AMapLocationClientOption();
        mOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
//        mOption.setGpsFirst(false);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
//        mOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
//        mOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
        if (isOnce) {
            mOption.setOnceLocation(true);//可选，设置是否单次定位。默认是false
            mOption.setOnceLocationLatest(true);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
        } else {
            mOption.setOnceLocation(false);
            mOption.setInterval(2_000);//可选，设置定位间隔。默认为2秒
        }
        mOption.setMockEnable(false); //设置是否允许模拟位置
//        AMapLocationClientOption.setLocationProtocol(AMapLocationClientOption.AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
//        mOption.setSensorEnable(false);//可选，设置是否使用传感器。默认是false
        mOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
        mOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
//        mOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）
        return mOption;
    }

    public static class MyLocationListener implements AMapLocationListener {

        @Override
        public void onLocationChanged(AMapLocation aMapLocation) {
            if (mOnLocationChangeListener != null) {
                mOnLocationChangeListener.onLocationChanged(aMapLocation);
            }
        }
    }

    public interface OnLocationChangeListener {
        void onLastKnownLocation(AMapLocation location);

        void onLocationChanged(AMapLocation location);
    }
}
```

```java
public class GDLocationService extends Service {

    private volatile boolean isOnce = false;

    public static void actionStart(Context context) {
        actionStart(context, null);
    }

    public static void actionStart(Context context, String command) {
        context.startService(new Intent(context, GDLocationService.class).putExtra("command", command));
    }

    public static void actionStop(Context context) {
        context.stopService(new Intent(context, GDLocationService.class));
    }

    @Override
    public void onCreate() {
        super.onCreate();
        GDLocationHelper.register(getApplicationContext(), new GDLocationHelper.OnLocationChangeListener() {
            @Override
            public void onLastKnownLocation(AMapLocation location) {
                if (location != null) {
                    Log.e("TAG", "onLastKnownLocation= " + location.toString());
                }
            }

            @Override
            public void onLocationChanged(AMapLocation location) {
                if (location != null) {
                    Log.e("TAG", "onLocationChanged= " + location.toString());
                    if (isOnce) {
                        stopSelf();
                    }
                }
            }
        });
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String command = intent.getStringExtra("command");
        switch (command) {
            case "once":
                isOnce = true;
                GDLocationHelper.startOnceLocation();
                break;
            case "stop":
                GDLocationHelper.stopLocation();
                break;
            case "start":
            default:
                isOnce = false;
                GDLocationHelper.startLocation();
                break;
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        GDLocationHelper.unregister();
        Log.e("TAG", "onDestroy");
    }
}
```

### 使用

```java
// 开始定位   
GDLocationService.actionStart(MainActivity.this, "start");

// 停止定位
GDLocationService.actionStart(MainActivity.this, "stop");

// 单次定位
GDLocationService.actionStart(MainActivity.this, "once");
```

