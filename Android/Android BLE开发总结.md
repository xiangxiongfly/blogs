[toc]

# Android BLE开发总结

## 基本知识

在Android BLE开发中，设备、服务、特征和描述它们之间的关系如下：

- 设备（Device）：指BLE设备，如蓝牙耳机、传感器等。
- 服务（Service）：指BLE设备所提供的服务，一个BLE设备可以提供多个服务，每个服务有一个唯一的UUID，服务中包含多个特征值。
- 特征（Characteristic）：指BLE设备服务中的特征值，每个特征值有一个唯一的UUID，可以读取、写入和监听特征值数据。
- 描述（Descriptor）：指BLE设备服务中特征值的描述信息，描述信息通常包含对特征值的详细描述和配置信息。



## 开发流程

一、权限申请。

二、检查BLE是否可用。

三、扫描设备。

四、建立连接。

五、发现服务。

六、监听特征。

七、发送指令接收数据。

八、断开连接，或关闭释放资源。



## 详细操作

### 权限申请

**AndroidManifest.xml注册**

```xml
<!-- Android11权限 -->
<uses-permission
                 android:name="android.permission.BLUETOOTH"
                 android:maxSdkVersion="30" />
<uses-permission
                 android:name="android.permission.BLUETOOTH_ADMIN"
                 android:maxSdkVersion="30" />
<!-- BLUETOOTH_SCAN 查找权限 -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<!-- 仅当您的应用程序使设备可被蓝牙设备发现时才需要。 -->
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<!-- BLUETOOTH_CONNECT 通信权限 -->
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<!-- ACCESS_FINE_LOCATION 获取物理位置权限 -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- 如果您说您的应用需要该功能，那么 Google Play 商店将 在缺少这些功能的设备上向用户隐藏您的应用 -->
<uses-feature
              android:name="android.hardware.bluetooth"
              android:required="true" />
<uses-feature
              android:name="android.hardware.bluetooth_le"
              android:required="true" />
```

**运行时权限**

这里用的XXPermissions权限框架。

```java
XXPermissions.with(this)
    .permission(Permission.BLUETOOTH_ADVERTISE, Permission.BLUETOOTH_CONNECT, Permission.BLUETOOTH_SCAN, Permission.ACCESS_FINE_LOCATION, Permission.ACCESS_FINE_LOCATION)
    .request(new OnPermissionCallback() {
        @Override
        public void onGranted(@NonNull List<String> permissions, boolean allGranted) {
        }

        @Override
        public void onDenied(@NonNull List<String> permissions, boolean doNotAskAgain) {
        }
    });
```



### 是否支持蓝牙BLE

```java
private BluetoothAdapter getBluetoothAdapter() {
    //        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
    //        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();
    //        return bluetoothAdapter;
    // 等价于如下
    return BluetoothAdapter.getDefaultAdapter();
}
```

```java
// 检查设备是否支持蓝牙
private void checkBLE() {
    if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
        Toast.makeText(this, "当前设备不支持蓝牙", Toast.LENGTH_SHORT).show();
    } else {
        Toast.makeText(this, "当前设备支持蓝牙", Toast.LENGTH_SHORT).show();
    }
    if (getBluetoothAdapter() == null) {
        Toast.makeText(this, "当前设备不支持蓝牙", Toast.LENGTH_SHORT).show();
    }
}
```



### 蓝牙是否开启

```java
// 蓝牙是否开启
private boolean checkEnabled() {
    boolean isEnabled = getBluetoothAdapter().isEnabled();
    Toast.makeText(this, isEnabled ? "蓝牙开启" : "蓝牙未开启", Toast.LENGTH_SHORT).show();
    return isEnabled;
}
```



### 开启蓝牙

```java
if (!checkEnabled()) {
    BluetoothAdapter bluetoothAdapter = getBluetoothAdapter();
    // 直接开启蓝牙
    bluetoothAdapter.enable();
}
```

```java
if (!checkEnabled()) {
    // 优雅开启蓝牙
    Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
    startActivityForResult(intent, REQUEST_ENABLE_BT);
}
```



### 搜索BLE设备

```java
private boolean isScanning = false;
private Handler handler = new Handler();
private static final long SCAN_PERIOD = 30_000; //扫描时间
private BluetoothDevice mDevice;

// 搜索周围BLE设备
private void startScan() {
    if (!isScanning) {
        Log.e("TAG", "开始扫描");
        isScanning = true;
        BluetoothLeScanner bluetoothLeScanner = getBluetoothAdapter().getBluetoothLeScanner();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                isScanning = false;
                bluetoothLeScanner.stopScan(leScanCallback);
            }
        }, SCAN_PERIOD);
        bluetoothLeScanner.startScan(leScanCallback);
    }
}

// 停止搜索
public void stopScan() {
    if (isScanning) {
        Log.e("TAG", "停止扫描");
        isScanning = false;
        BluetoothLeScanner bluetoothLeScanner = getBluetoothAdapter().getBluetoothLeScanner();
        bluetoothLeScanner.stopScan(leScanCallback);
    }
}

// 搜索回调
private final ScanCallback leScanCallback =
    new ScanCallback() {
    @Override
    public void onScanResult(int callbackType, ScanResult result) {
        super.onScanResult(callbackType, result);
        BluetoothDevice device = result.getDevice();
        if (device != null) {
            StringBuilder builder = new StringBuilder();
            builder.append("设备名：" + device.getName()).append("\n");
            builder.append("地址：" + device.getAddress()).append("\n");
            builder.append("uuids：" + device.getUuids());
            String deviceStr = builder.toString();
            Log.e("TAG", "BLE : " + deviceStr);
            if (filterDevice(device)) {
                Log.e("TAG", "找到指定设备，停止扫描");
                stopScan();
                mDevice = device;
                tv_device.setText(deviceStr);
            }
        }
    }
};

// 过滤设备
private boolean filterDevice(BluetoothDevice device) {
    return "BLE-EMP-Ui".equals(device.getName());
}
```



### 连接BLE设备

```java
/**
     * 连接gatt服务
     */
public boolean connect(final String address) {
    try {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(address);
        // 连接Gatt服务，用于通信
        mBluetoothGatt = device.connectGatt(this, false, mGattCallback);
        return true;
    } catch (IllegalArgumentException e) {
        Log.e("TAG", "连接异常");
        return false;
    }
}
```



### 断开连接

```java
mBluetoothGatt.disconnect();
```



### 监听连接状态

```java
/**
         * 连接状态监听
         */
@Override
public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
    super.onConnectionStateChange(gatt, status, newState);
    if (newState == BluetoothProfile.STATE_CONNECTED) {
        // 成功连接Gatt服务
        connectionState = STATE_CONNECTED;
        broadcastUpdate(ACTION_GATT_CONNECTED);
        // 发现服务
        mBluetoothGatt.discoverServices();
    } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
        // 与GATT服务器断开连接
        connectionState = STATE_DISCONNECTED;
        broadcastUpdate(ACTION_GATT_DISCONNECTED);
        mBluetoothGatt = null;
    }
}
```



### 发现BLE服务

```java
mBluetoothGatt.discoverServices();
```

```java
/**
 * 发现服务和特征，建立通信
 */
@Override
public void onServicesDiscovered(BluetoothGatt gatt, int status) {
    super.onServicesDiscovered(gatt, status);
    if (status == BluetoothGatt.GATT_SUCCESS) {
        broadcastUpdate(ACTION_GATT_SERVICES_DISCOVERED);
        BluetoothGattService service = mBluetoothGatt.getService(UUID.fromString(SERVICE_UUID));
        characteristic = service.getCharacteristic(UUID.fromString(CHARACTERISTIC_UUID));
        // 设置订阅通知
        setCharacteristicNotification(characteristic, true);
    } else {
        Log.e("TAG", "onServicesDiscovered received: " + status);
    }
}
```



### 订阅通知、读、写

```java
/**
     * 读取BEL设备的特征值
     */
public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
    if (mBluetoothGatt != null && characteristic != null) {
        mBluetoothGatt.readCharacteristic(characteristic);
    }
}

/**
     * 向BLE设备写入特征值
     */
public void writeCharacteristic(BluetoothGattCharacteristic characteristic, byte[] data) {
    if (mBluetoothGatt != null && characteristic != null) {
        characteristic.setValue(data);
        mBluetoothGatt.writeCharacteristic(characteristic);
    }
}

/**
     * 订阅通知，监听 BLE 设备特征值变化
     */
public void setCharacteristicNotification(BluetoothGattCharacteristic characteristic, boolean enabled) {
    if (mBluetoothGatt == null) {
        return;
    }
    mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);
    BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString(CHARACTERISTIC_UUID));
    descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
    mBluetoothGatt.writeDescriptor(descriptor);
}
```



### 监听读特征、写特征、特征变化

```java
/**
         * 读特征回调
         */
@Override
public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
    super.onCharacteristicRead(gatt, characteristic, status);
    Log.e("TAG", "onCharacteristicRead");
    if (status == BluetoothGatt.GATT_SUCCESS) {
        byte[] data = characteristic.getValue();
        // 处理读取到的数据
        Log.e("TAG", "获取特征数据：" + BytesUtils.bytesToHexString(data));
    }
}

/**
         * 写特征回调
         */
@Override
public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
    super.onCharacteristicWrite(gatt, characteristic, status);
    Log.e("TAG", "onCharacteristicWrite");
    Log.e("TAG", "获取写指令：" + BytesUtils.bytesToHexString(characteristic.getValue()));
    if (status == BluetoothGatt.GATT_SUCCESS) {
        Log.e("TAG", "写入成功");
    } else {
        Log.e("TAG", "写入失败");
    }
}

/**
         * 监听特征变化，从设备接收数据
         */
@Override
public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
    super.onCharacteristicChanged(gatt, characteristic);
    Log.e("TAG", "onCharacteristicChanged");
    Log.e("TAG", "从设备接收数据：" + BytesUtils.bytesToHexString(characteristic.getValue()));
}
```



### 关闭Gatt连接释放资源

一、disconnect()

`disconnect()` 方法用于断开与 BLE 设备的 GATT 连接，但是仍然保持与设备的物理连接。这意味着，虽然 GATT 连接已经断开，但是您仍然可以使用 `BluetoothDevice.connectGatt()` 方法重新建立 GATT 连接。

二、close()

`close() `方法用于关闭与 BLE 设备的 GATT 连接，并释放与该设备关联的所有资源。这包括释放 BluetoothGatt 对象、清除服务缓存等。如果您想要重新连接同一台设备，则需要重新调用 `BluetoothDevice.connectGatt()` 方法获取新的 BluetoothGatt 对象。

因此，`disconnect()` 方法适用于临时断开 GATT 连接，以便稍后重新连接。而 `close()` 方法适用于完全关闭与设备的连接并释放所有资源。

```java
/**
     * 关闭Gatt连接
     */
private void close() {
    if (mBluetoothGatt == null) {
        return;
    }
    mBluetoothGatt.close();
    mBluetoothGatt = null;
}
```



## 完整代码

**MainActivity**

```java
public class MainActivity extends AppCompatActivity {
    private TextView tv_device;

    public static final int REQUEST_ENABLE_BT = 0x1;

    private boolean isScanning = false;
    private Handler handler = new Handler();
    private static final long SCAN_PERIOD = 30_000; //扫描时间

    private BluetoothDevice mDevice;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();
        initPermissions();
    }

    private void initView() {
        tv_device = findViewById(R.id.tv_device);
        Button btn_search = findViewById(R.id.btn_search);
        Button btn_stop_search = findViewById(R.id.btn_stop_search);

        btn_search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startScan();
            }
        });
        btn_stop_search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopScan();
            }
        });
    }

    private BluetoothAdapter getBluetoothAdapter() {
//        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
//        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();
//        return bluetoothAdapter;
        // 等价于如下
        return BluetoothAdapter.getDefaultAdapter();
    }

    private void initPermissions() {
        //BLUETOOTH_ADVERTISE、BLUETOOTH_CONNECT、BLUETOOTH_SCAN、ACCESS_FINE_LOCATION权限是运行时权限
        XXPermissions.with(this)
                .permission(Permission.BLUETOOTH_ADVERTISE, Permission.BLUETOOTH_CONNECT, Permission.BLUETOOTH_SCAN, Permission.ACCESS_FINE_LOCATION, Permission.ACCESS_FINE_LOCATION)
                .request(new OnPermissionCallback() {
                    @Override
                    public void onGranted(@NonNull List<String> permissions, boolean allGranted) {
                    }

                    @Override
                    public void onDenied(@NonNull List<String> permissions, boolean doNotAskAgain) {
                    }
                });
    }

    public void clickCheck(View view) {
        checkBLE();
    }

    public void clickCheckEnabled(View view) {
        checkEnabled();
    }

    public void clickConnect(View view) {
        startDeviceActivity();
    }

    // 检查设备是否支持蓝牙
    private void checkBLE() {
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            Toast.makeText(this, "当前设备不支持蓝牙", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "当前设备支持蓝牙", Toast.LENGTH_SHORT).show();
        }
        if (getBluetoothAdapter() == null) {
            Toast.makeText(this, "当前设备不支持蓝牙", Toast.LENGTH_SHORT).show();
        }
    }

    // 蓝牙是否开启
    private boolean checkEnabled() {
        boolean isEnabled = getBluetoothAdapter().isEnabled();
        Toast.makeText(this, isEnabled ? "蓝牙开启" : "蓝牙未开启", Toast.LENGTH_SHORT).show();
        return isEnabled;
    }

    // 开启蓝牙
    public void clickOepn(View view) {
        if (!checkEnabled()) {
            BluetoothAdapter bluetoothAdapter = getBluetoothAdapter();
            // 直接开启蓝牙
            bluetoothAdapter.enable();
        }
    }

    // 开启蓝牙2
    public void clickOpen2(View view) {
        if (!checkEnabled()) {
            // 优雅开启蓝牙
            Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(intent, REQUEST_ENABLE_BT);
        }
    }

    // 搜索周围BLE设备
    private void startScan() {
        if (!isScanning) {
            Log.e("TAG", "开始扫描");
            isScanning = true;
            BluetoothLeScanner bluetoothLeScanner = getBluetoothAdapter().getBluetoothLeScanner();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    isScanning = false;
                    bluetoothLeScanner.stopScan(leScanCallback);
                }
            }, SCAN_PERIOD);
            bluetoothLeScanner.startScan(leScanCallback);
        }
    }

    // 停止搜索
    public void stopScan() {
        if (isScanning) {
            Log.e("TAG", "停止扫描");
            isScanning = false;
            BluetoothLeScanner bluetoothLeScanner = getBluetoothAdapter().getBluetoothLeScanner();
            bluetoothLeScanner.stopScan(leScanCallback);
        }
    }

    // 搜索回调
    private final ScanCallback leScanCallback =
            new ScanCallback() {
                @Override
                public void onScanResult(int callbackType, ScanResult result) {
                    super.onScanResult(callbackType, result);
                    BluetoothDevice device = result.getDevice();
                    if (device != null) {
                        StringBuilder builder = new StringBuilder();
                        builder.append("设备名：" + device.getName()).append("\n");
                        builder.append("地址：" + device.getAddress()).append("\n");
                        builder.append("uuids：" + device.getUuids());
                        String deviceStr = builder.toString();
                        Log.e("TAG", "BLE : " + deviceStr);
                        if (filterDevice(device)) {
                            Log.e("TAG", "找到指定设备，停止扫描");
                            stopScan();
                            mDevice = device;
                            tv_device.setText(deviceStr);
                        }
                    }
                }
            };

    private void startDeviceActivity() {
        if (mDevice != null) {
            startActivity(new Intent(this, DeviceControlActivity.class).putExtra("address", mDevice.getAddress()));
        }
    }

    // 过滤设备
    private boolean filterDevice(BluetoothDevice device) {
        return "BLE-EMP-Ui".equals(device.getName());
    }

}
```

**DeviceControlActivity**

```java
public class DeviceControlActivity extends AppCompatActivity {
    private boolean connected;
    private String deviceAddress; //BLE地址
    private BluetoothLeService mBluetoothLeService;
    private TextView tv_connect_state;
    private Button btn_disconnect;
    private Button btn_connect;
    private TextView tv_uuids;
    private Button btn_request;
    private Button btn_read;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_control);
        initView();
        deviceAddress = getIntent().getStringExtra("address");
        Intent serviceIntent = new Intent(this, BluetoothLeService.class);
        bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    private void initView() {
        tv_connect_state = findViewById(R.id.tv_connect_state);
        btn_disconnect = findViewById(R.id.btn_disconnect);
        btn_connect = findViewById(R.id.btn_connect);
        tv_uuids = findViewById(R.id.tv_uuids);
        btn_request = findViewById(R.id.btn_request);
        btn_read = findViewById(R.id.btn_read);

        btn_connect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!connected) {
                    mBluetoothLeService.connect(deviceAddress);
                }
            }
        });
        btn_disconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (connected) {
                    mBluetoothLeService.disconnect();
                }
            }
        });
        btn_request.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBluetoothLeService.request();
            }
        });
        btn_read.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBluetoothLeService.read();
            }
        });
    }

    private final ServiceConnection serviceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            mBluetoothLeService.connect(deviceAddress);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mBluetoothLeService = null;
        }
    };

    /**
     * 广播
     */
    private final BroadcastReceiver mUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (BluetoothLeService.ACTION_GATT_CONNECTED.equals(action)) {
                connected = true;
                tv_connect_state.setText("连接成功");
            } else if (BluetoothLeService.ACTION_GATT_DISCONNECTED.equals(action)) {
                connected = false;
                tv_connect_state.setText("连接断开");
            } else if (BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
                displayGattServices(mBluetoothLeService.getGattServices());
            }
        }
    };

    /**
     * 广播action
     */
    private static final IntentFilter getIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_CONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED);
        return intentFilter;
    }

    private void displayGattServices(List<BluetoothGattService> gattServices) {
        if (gattServices == null) {
            return;
        }
        StringBuilder builder = new StringBuilder();
        for (BluetoothGattService gattService : gattServices) {
            String serviceUuid = gattService.getUuid().toString();
            builder.append("服务uuid: " + serviceUuid).append("\n");
            List<BluetoothGattCharacteristic> gattCharacteristics = gattService.getCharacteristics();
            for (BluetoothGattCharacteristic gattCharacteristic : gattCharacteristics) {
                String uuid = gattCharacteristic.getUuid().toString();
                builder.append("\t\t\t特征uuid: " + uuid).append("\n");
            }
        }
        tv_uuids.setText(builder.toString());
    }

    /**
     * onResume()回调时注册广播，并连接蓝牙
     */
    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(mUpdateReceiver, getIntentFilter());
        if (mBluetoothLeService != null) {
            mBluetoothLeService.connect(deviceAddress);
        }
    }

    /**
     * onPause()回调是注销广播
     */
    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(mUpdateReceiver);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbindService(serviceConnection);
    }
}
```

**BluetoothLeService**

```java
public class BluetoothLeService extends Service {
    public final static String ACTION_GATT_CONNECTED =
            "com.example.bluetooth.le.ACTION_GATT_CONNECTED";
    public final static String ACTION_GATT_DISCONNECTED =
            "com.example.bluetooth.le.ACTION_GATT_DISCONNECTED";
    public final static String ACTION_GATT_SERVICES_DISCOVERED =
            "com.example.bluetooth.le.ACTION_GATT_SERVICES_DISCOVERED";

    // 服务UUID
    private static final String SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
    // 特征UUID
    private static final String CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTED = 2;

    private BluetoothGatt mBluetoothGatt;
    private BluetoothGattCharacteristic characteristic;
    private int connectionState; //连接状态

    private Binder binder = new LocalBinder();

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    class LocalBinder extends Binder {
        public BluetoothLeService getService() {
            return BluetoothLeService.this;
        }
    }

    /**
     * 连接gatt服务
     */
    public boolean connect(final String address) {
        try {
            BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            BluetoothDevice device = bluetoothAdapter.getRemoteDevice(address);
            // 连接Gatt服务，用于通信
            mBluetoothGatt = device.connectGatt(this, false, mGattCallback);
            return true;
        } catch (IllegalArgumentException e) {
            Log.e("TAG", "连接异常");
            return false;
        }
    }

    /**
     * 断开连接
     */
    public void disconnect() {
        mBluetoothGatt.disconnect();
    }

    /**
     * 发送指令
     */
    public void request() {
        writeCharacteristic(characteristic, BytesUtils.hexStringToBytes("938e0400080410"));
    }

    public void read() {
        readCharacteristic(characteristic);
    }

    private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {

        /**
         * 连接状态监听
         */
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                // 成功连接Gatt服务
                connectionState = STATE_CONNECTED;
                broadcastUpdate(ACTION_GATT_CONNECTED);
                // 现BLE提供的服务
                mBluetoothGatt.discoverServices();
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                // 与GATT服务器断开连接
                connectionState = STATE_DISCONNECTED;
                broadcastUpdate(ACTION_GATT_DISCONNECTED);
                mBluetoothGatt = null;
            }
        }

        /**
         * 发现服务和特征，建立通信
         */
        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            super.onServicesDiscovered(gatt, status);
            if (status == BluetoothGatt.GATT_SUCCESS) {
                broadcastUpdate(ACTION_GATT_SERVICES_DISCOVERED);
                BluetoothGattService service = mBluetoothGatt.getService(UUID.fromString(SERVICE_UUID));
                characteristic = service.getCharacteristic(UUID.fromString(CHARACTERISTIC_UUID));
                // 设置订阅通知
                setCharacteristicNotification(characteristic, true);
            } else {
                Log.e("TAG", "onServicesDiscovered received: " + status);
            }
        }

        /**
         * 读特征回调
         */
        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicRead(gatt, characteristic, status);
            Log.e("TAG", "onCharacteristicRead");
            if (status == BluetoothGatt.GATT_SUCCESS) {
                byte[] data = characteristic.getValue();
                // 处理读取到的数据
                Log.e("TAG", "获取特征数据：" + BytesUtils.bytesToHexString(data));
            }
        }

        /**
         * 写特征回调
         */
        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicWrite(gatt, characteristic, status);
            Log.e("TAG", "onCharacteristicWrite");
            Log.e("TAG", "获取写指令：" + BytesUtils.bytesToHexString(characteristic.getValue()));
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.e("TAG", "写入成功");
            } else {
                Log.e("TAG", "写入失败");
            }
        }

        /**
         * 监听特征变化，从设备接收数据
         */
        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            super.onCharacteristicChanged(gatt, characteristic);
            Log.e("TAG", "onCharacteristicChanged");
            Log.e("TAG", "从设备接收数据：" + BytesUtils.bytesToHexString(characteristic.getValue()));
        }
    };

    public List<BluetoothGattService> getGattServices() {
        if (mBluetoothGatt == null) {
            return null;
        }
        return mBluetoothGatt.getServices();
    }


    @Override
    public boolean onUnbind(Intent intent) {
        close();
        return super.onUnbind(intent);
    }

    /**
     * 关闭Gatt连接
     */
    private void close() {
        if (mBluetoothGatt == null) {
            return;
        }
        mBluetoothGatt.close();
        mBluetoothGatt = null;
    }

    /**
     * 广播更新
     */
    private void broadcastUpdate(final String action) {
        final Intent intent = new Intent(action);
        sendBroadcast(intent);
    }

    /**
     * 读取BEL设备的特征值
     */
    public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
        if (mBluetoothGatt != null && characteristic != null) {
            mBluetoothGatt.readCharacteristic(characteristic);
        }
    }

    /**
     * 向BLE设备写入特征值
     */
    public void writeCharacteristic(BluetoothGattCharacteristic characteristic, byte[] data) {
        if (mBluetoothGatt != null && characteristic != null) {
            characteristic.setValue(data);
            mBluetoothGatt.writeCharacteristic(characteristic);
        }
    }

    /**
     * 订阅通知，监听 BLE 设备特征值变化
     */
    public void setCharacteristicNotification(BluetoothGattCharacteristic characteristic, boolean enabled) {
        if (mBluetoothGatt == null) {
            return;
        }
        mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);
        BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString(CHARACTERISTIC_UUID));
        descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
        mBluetoothGatt.writeDescriptor(descriptor);
    }
}
```



## [CSDN源码](https://download.csdn.net/download/qq_14876133/87617557)



## [代码下载](https://github.com/xiangxiongfly/Android_BLE_Demo)

