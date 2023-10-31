[TOC]

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

三、开启蓝牙。

四、扫描设备。

五、建立连接。

六、发现服务。

七、监听特征。

八、发送指令接收数据。

九、断开连接和关闭释放资源。



## 详细操作

### 一、权限申请

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

这里用到了 XXPermissions 权限框架。

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

### 二、检查BLE是否可用

```java
/**
     * 获取蓝牙适配器
     */
private BluetoothAdapter getBluetoothAdapter() {
    //        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
    //        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();
    //        return bluetoothAdapter;

    // 等价于如下
    return BluetoothAdapter.getDefaultAdapter();
}
```

```java
/**
     * 检查设备是否支持蓝牙
     */
private boolean supporBLE() {
    if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE) || getBluetoothAdapter() == null) {
        Toast.makeText(this, "当前设备不支持蓝牙", Toast.LENGTH_SHORT).show();
        return false;
    } else {
        Toast.makeText(this, "当前设备支持蓝牙", Toast.LENGTH_SHORT).show();
        return true;
    }
}
```

### 三、蓝牙是否开启

```java
/**
     * 检查蓝牙是否开启
     */
private boolean checkEnabled() {
    boolean isEnabled = getBluetoothAdapter().isEnabled();
    Toast.makeText(this, isEnabled ? "已开启" : "未开启", Toast.LENGTH_SHORT).show();
    return isEnabled;
}
```

```java
/**
     * 打开蓝牙，方式一
     */
private void openBLE1() {
    BluetoothAdapter bluetoothAdapter = getBluetoothAdapter();
    // 直接开启蓝牙，Android13不支持了
    boolean enable = bluetoothAdapter.enable();
    if (enable) {
        Toast.makeText(this, "开启蓝牙了", Toast.LENGTH_SHORT).show();
    }
}

/**
     * 打开蓝牙，方式二
     */
private void openBLE2() {
    Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
    startActivityForResult(intent, REQUEST_ENABLE_BT);
}
```

### 四、扫描设备

```java
private boolean isScanning = false;
private Handler handler = new Handler();
private static final long SCAN_PERIOD = 30_000; //扫描时间

/**
     * 开始扫描蓝牙设备
     */
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

/**
     * 停止扫描蓝牙设备
     */
public void stopScan() {
    if (isScanning) {
        Log.e("TAG", "停止扫描");
        isScanning = false;
        handler.removeCallbacksAndMessages(null);
        BluetoothLeScanner bluetoothLeScanner = getBluetoothAdapter().getBluetoothLeScanner();
        bluetoothLeScanner.stopScan(leScanCallback);
    }
}

/**
     * 扫描结果回调
     */
private final ScanCallback leScanCallback = new ScanCallback() {
    @Override
    public void onScanResult(int callbackType, ScanResult result) {
        super.onScanResult(callbackType, result);
        BluetoothDevice device = result.getDevice();
        if (device != null) {
            String deviceInfoStr = "\n" +
                "设备名：" + device.getName() + "\n" +
                "地址：" + device.getAddress() + "\n" +
                "uuids：" + Arrays.toString(device.getUuids());
            Log.e("TAG", "BLE : " + deviceInfoStr);
            if (filterDevice(device.getName())) {
                Log.e("TAG", "找到指定设备，停止扫描");
                stopScan();
                deviceType = getDeviceType(device.getName());
                deviceAddress = device.getAddress();
                viewBinding.tvDevice.setText(deviceInfoStr);
            }
        }
    }
};

/**
     * 过滤指定设备
     */
private boolean filterDevice(String deviceName) {
    return "BLE-EMP-Ui".equals(deviceName) || "Bluetooth BP".equals(deviceName);
}
```

### 五、连接设备

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

### 六、发现蓝牙服务

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

### 七、订阅通知、读指令、写指令

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
     * 订阅通知
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

### 八、监听数据变化

```java
/**
         * 发送读指令监听
         */
@Override
public void onCharacteristicRead(@NonNull BluetoothGatt gatt, @NonNull BluetoothGattCharacteristic characteristic, @NonNull byte[] value, int status) {
    super.onCharacteristicRead(gatt, characteristic, value, status);
    Log.e("TAG", "onCharacteristicRead");
    if (status == BluetoothGatt.GATT_SUCCESS) {
        byte[] data = value;
        // 处理读取到的数据
        Log.e("TAG", "获取特征数据：" + BytesUtils.bytesToHexString(data));
    }
}

/**
         * 发送写指令监听
         */
@Override
public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
    super.onCharacteristicWrite(gatt, characteristic, status);
    Log.e("TAG", "onCharacteristicWrite");
    Log.e("TAG", "获取写指令：" + BytesUtils.bytesToHexString(characteristic.getValue()));
    if (status == BluetoothGatt.GATT_SUCCESS) {
        Log.e("TAG", "写入成功");
        broadcastUpdate(ACTION_GATT_SERVICES_WRITE, BytesUtils.bytesToHexString(characteristic.getValue()));
    } else {
        Log.e("TAG", "写入失败");
    }
}

/**
         * 数据变化监听
         * 获取从BLE设备的数据
         */
@Override
public void onCharacteristicChanged(@NonNull BluetoothGatt gatt, @NonNull BluetoothGattCharacteristic characteristic, @NonNull byte[] value) {
    super.onCharacteristicChanged(gatt, characteristic, value);
    Log.e("TAG", "onCharacteristicChanged");
    Log.e("TAG", "从设备接收数据：" + BytesUtils.bytesToHexString(value));
    broadcastUpdate(ACTION_GATT_SERVICES_CHANGED, BytesUtils.bytesToHexString(value));
}

/**
         * 订阅成功监听
         */
@Override
public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
    super.onDescriptorWrite(gatt, descriptor, status);
    Log.e("TAG", "onDescriptorWrite");
}
```

### 九、断开连接和关闭资源

```java
mBluetoothGatt.disconnect(); //断开连接
mBluetoothGatt.close(); //关闭资源
mBluetoothGatt = null;
```

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



## [代码下载](https://github.com/xiangxiongfly/Android_BLE_Demo)

