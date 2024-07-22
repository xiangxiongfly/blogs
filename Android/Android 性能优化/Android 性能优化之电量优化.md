[toc]

# Android 性能优化之电量优化

## 检测方案

### 设置-耗电排行

- 直观，但没有详细数据。
- 适合特定场景专项测试。

### 广播接收

- 获取当前手机电池信息。

```java
IntentFilter filter = new IntentFilter();
filter.addAction(Intent.ACTION_BATTERY_CHANGED);
Intent intent = registerReceiver(null, filter);
int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
int temperature = intent.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1);
int health = intent.getIntExtra(BatteryManager.EXTRA_HEALTH, -1);
Log.e("TAG", "电量：" + level);
Log.e("TAG", "电池温度：" + temperature);
Log.e("TAG", "电池健康度：" + health);
```

### Battery Historian

- Google推出的电量分析工具。
- 支持Android5.0以上系统。
- 可视化展示电量信息。























































