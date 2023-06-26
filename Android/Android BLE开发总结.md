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
private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
    /**
     * 连接状态监听
     */
    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
        super.onConnectionStateChange(gatt, status, newState);
        Log.e("TAG", "onConnectionStateChange");
        if (newState == BluetoothProfile.STATE_CONNECTED) {
            // 成功连接Gatt服务
            Log.e("TAG", "成功连接Gatt服务");
            connectionState = STATE_CONNECTED;
            broadcastUpdate(ACTION_GATT_CONNECTED);
            // 发现BLE提供的服务
            mBluetoothGatt.discoverServices();
        } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
            // 与GATT服务断开连接
            Log.e("TAG", "与GATT服务断开连接");
            connectionState = STATE_DISCONNECTED;
            broadcastUpdate(ACTION_GATT_DISCONNECTED);
            mBluetoothGatt = null;
        }
    }
}
```



### 监听蓝牙广播

```java
/**
     * 注册蓝牙状态广播
     */
private void regStateReceiver() {
    IntentFilter filter = new IntentFilter();
    filter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);
    filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
    filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
    registerReceiver(mBluetoothStateReceiver, filter);
}

/**
     * 注销蓝牙状态广播
     */
private void unregStateReceiver() {
    unregisterReceiver(mBluetoothStateReceiver);
}
```

```java
/**
     * 监听蓝牙状态广播
     */
private final BroadcastReceiver mBluetoothStateReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
        final String action = intent.getAction();
        BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        switch (action) {
            case BluetoothDevice.ACTION_ACL_CONNECTED:
                Log.e("TAG", "蓝牙设备已连接");
                tv_bluetooth_state.setText("蓝牙设备已连接");
                break;
            case BluetoothDevice.ACTION_ACL_DISCONNECTED:
                Log.e("TAG", "蓝牙设备断开连接");
                tv_bluetooth_state.setText("蓝牙设备断开连接");
                break;
            case BluetoothAdapter.ACTION_STATE_CHANGED:
                int blueState = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1);
                switch (blueState) {
                    case BluetoothAdapter.STATE_TURNING_ON:
                        Log.e("TAG", "手机蓝牙正在开启");
                        tv_bluetooth_state.setText("手机蓝牙正在开启");
                        break;
                    case BluetoothAdapter.STATE_ON:
                        Log.e("TAG", "手机蓝牙已开启");
                        tv_bluetooth_state.setText("手机蓝牙已开启");
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:
                        Log.e("TAG", "手机蓝牙正在关闭");
                        tv_bluetooth_state.setText("手机蓝牙正在关闭");
                        mBluetoothLeService.disconnect();
                        break;
                    case BluetoothAdapter.STATE_OFF:
                        Log.e("TAG", "手机蓝牙已关闭");
                        tv_bluetooth_state.setText("手机蓝牙已关闭");
                        mBluetoothLeService.close();
                        break;
                }
                break;
        }
    }
};
```



### 发现BLE服务

```java
private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {

    /**
     * 发现服务和特征，并订阅通知
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

`disconnect()` 方法会断开与 BLE 设备的 GATT 连接，但仍然保持与设备的物理连接，可以使用 `connectGatt()` 方法重新建立 GATT 连接。

二、close()

`close() `方法用于断开关闭与 BLE 设备的 GATT 连接，并释放与该设备关联的所有资源。这包括释放 BluetoothGatt 对象、清除服务缓存等。如果您想要重新连接同一台设备，则需要重新调用 `connectGatt()` 方法获取新的 BluetoothGatt 对象。

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



## 重启手机蓝牙连不上问题

当重启手机蓝牙后，连不上Gatt服务，BluetoothAdapter是系统变量，重启手机的时候可能会把扫描的设备信息清理掉，这就会导致connectGatt()连接失败。因此最好的方法是重启APP后先手动扫描一次，在进行重连。



## [CSDN源码](https://download.csdn.net/download/qq_14876133/87617557)



## [代码下载](https://github.com/xiangxiongfly/Android_BLE_Demo)

