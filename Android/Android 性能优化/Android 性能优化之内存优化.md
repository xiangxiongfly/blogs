[TOC]

# Android 性能优化之内存优化

## 内存问题

- 内存抖动
- 内存泄露
- 内存溢出

### 内存抖动

内存抖动指的是在短时间内大量对象被创建和销毁，导致频繁的垃圾回收（Garbage Collection, GC）活动。这种频繁的GC活动会占用大量的CPU资源，可能导致应用程序的卡顿或性能下降。

表现：内存曲线呈锯齿状。

### 内存泄露

内存泄露是指应用程序持有了不再需要的对象的引用，导致这些对象无法被垃圾回收器回收，从而占用了本可以被释放的内存空间。随着时间的推移，内存泄露会导致可用内存越来越少，最终可能导致应用程序崩溃或性能下降。

### 内存溢出

内存溢出是指应用程序尝试分配更多的内存空间，但系统无法满足这个请求，因为已经没有足够的内存空间可供分配。这通常会导致应用程序抛出OutOfMemoryError异常。



## 检测工具

- Memory Profiler
- Memory Analyzer
- LeakCanary

### Memory Profiler

- Memory Profiler 是 Android Studio自带的内存分析工具。
- 实时图表展示程序内存使用情况。
- 识别内存泄露、抖动等。
- 提供捕获堆转储、强制GC以及跟踪内存分配的能力。

### Memory Analyzer

- 强大的 Java Heap 分析工具，查找内存泄露已经内存占用。
- 生成整体报告、分析问题等。

### LeakCanary

- 自动内存泄露检测。	
  - LeakCanary自动检测这些对象的泄露问题：Activity、Fragment、View、ViewModel、Service。
- 官网：https://github.com/square/leakcanary



## 内存管理机制

### Java

Java 内存结构：堆、虚拟机栈、方法区、程序计数器、本地方法栈。

Java 内存回收算法：

- 标记-清除算法：
  1. 标记出所需要回收的对象
  2. 统一回收所有标记的对象。
- 复制算法：
  1. 将内存划分为大小相等的两块。
  2. 一款内存用完后复制存活对象到另一块中。
- 标记-整理算法：
  1. 标记过程与“标记-清除“算法一样。
  2. 存活对象往一端进行移动。
  3. 清除其余内存。
- 分代收集算法：
  - 结合多种收集算法优势。
  - 新生代对象存活率低，使用复制算法。
  - 老年代对象存活率高，使用标记-整理算法。

标记-清除算法缺点：标记和清除效率不高，会产生大量不连续的内存碎片。

复制算法：实现简单，运行高效。缺点：浪费一半空间。

标记-整理算法：避免标记-清理导致的内存碎片，避免复制算法的空间浪费。

### Android

Android内存弹性分配，分配值与最大值受具体设备影响。

Dalvik 回收算法和 ART 回收算法都是 Android 操作系统中用于内存管理的垃圾回收机制

Dalvik 回收算法：

- 标记-清除算法。
- 优点是实现简单。缺点是在标记和清除阶段都会暂停应用程序的执行，这会导致应用程序出现短暂的卡顿，影响用户体验。

Art 回收算法：

- 压缩式垃圾回收（Compacting Garbage Collection）的算法。在标记-清除算法的基础上进行了改进，以减少垃圾回收过程中的暂停时间。
- 并发标记：ART 引入了并发标记阶段，这意味着它可以与应用程序的执行同时进行。这减少了由于垃圾回收导致的暂停时间。
- 清除和压缩：在清除阶段，ART 不仅清除未被标记的对象，还会压缩内存，这意味着它会将存活的对象移动到一起，减少内存碎片。这使得内存管理更高效，并减少了内存分配失败的可能性。
- 自适应回收：ART 还引入了自适应回收的概念，这意味着它会根据应用程序的行为和内存使用模式自动调整垃圾回收的频率和方式。这使得 ART 可以更好地适应不同的应用程序需求。

LMK机制：

- Low Memory Killer 机制。
- 主要作用是在系统内存不足时，根据一定的优先级策略，结束一些后台进程，以释放内存，保证系统的稳定性和响应性。



## 解决

### 内存抖动问题

#### 模拟问题代码

```java
public class ShakeActivity extends AppCompatActivity {

    private static Handler mHandler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            String str = "";
            for (int i = 0; i < 10000000; i++) {
                str += i;
            }
            mHandler.sendEmptyMessageDelayed(1, 30);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shake);
    }

    public void startClick(View view) {
        mHandler.sendEmptyMessage(1);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mHandler.removeCallbacksAndMessages(null);
    }
}
```

#### 使用Memory Profiler工具检测

Memory Profiler 可以查看内存分配情况，点击“Record Java/Kotlin allocations"。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0bee6c0139a54dd5ba854811e78ab21b.png)

上面的含义：

- Java：Java 或 Kotlin 代码分配的内存。
- Native：C 或 C++ 代码分配的内存。
- Graphics：图形缓冲区队列为向屏幕显示像素（包括 GL 表面、GL 纹理等等）所使用的内存。CPU共享的内存。
- Stack：应用中的原生堆栈和 Java 堆栈使用的内存。这通常与您的应用运行多少线程有关。
- Code：应用用于处理代码和资源（如 dex 字节码、经过优化或编译的 dex 代码、.so 库和字体）的内存。
- Others：应用使用的系统不确定如何分类的内存。
- Allocated：应用分配的 Java/Kotlin 对象数。此数字没有计入 C 或 C++ 中分配的对象。

下面的含义：

- Allocations：通过 `malloc()` 或 `new` 运算符分配的对象数量。
- Deallocations：通过 `free()` 或 `delete` 运算符解除分配的对象数量。
- Allocations Size：选定时间段内所有分配的总大小，单位是字节。
- Deallocations Size：选定时间段内释放内存的总大小，单位是字节。
- Total Count：Allocations 减去 Deallocations 的结果。
- Remaining Size：Allocations Size 减去 Deallocations Size 的结果。
- Shallow Size：堆中所有实例的总大小，单位是字节。

 **上图分析：**

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/05a744c36fe54d40b25aaec19fcbc667.png)

这块地方 Allocations 和 Deallocations 的数值比较相近，同时 Shallow Size 比较大，说明可能频繁的创建和销毁对象。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/109597ffb3834a32bce95ed9a2654c49.png)

点击后，可以查看调用栈信息，结合代码可以推测出 Handler 地方存在内存抖动问题。

#### 优化技巧

- 避免大量频繁创建和销毁对象。

### 内存泄露问题

#### 模拟问题代码

```java
public class CallbackManager {
    public static ArrayList<Callback> sCallbacks = new ArrayList<>();

    public static void addCallback(Callback callback) {
        sCallbacks.add(callback);
    }

    public static void removeCallback(Callback callback) {
        sCallbacks.remove(callback);
    }
}
```

```java
public class LeakActivity extends AppCompatActivity implements Callback {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_leak);
        ImageView imageView = findViewById(R.id.imageView);
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.splash);
        imageView.setImageBitmap(bitmap);
        CallbackManager.addCallback(this);
    }

    @Override
    public void onOperate() {

    }
}
```

#### 使用LeakCanary工具检测

**添加依赖库：**

```
debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.14'
```

发生内存泄露后，LeakCanary会生成相关信息，并自动转储：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/173a184733d145c7bf784c502928b078.png)

上图可知：是 LeakActivity 发生内存泄露了，并显示出引用链关系。

当然也可以生成 hprof 文件，通过 Profiler 工具查看具体信息：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/15d481ed3d384e01b454fb11d2cff90f.png)

上图可知：发生了10个泄露点，其中就有 LeakActivity，点击 LeakActivity 可以查看这内存泄露的对象，并查看引用链，可知是被ArrayList持有了。

#### 优化技巧

- 及时回收集合元素。
- 避免static引用过多实例。
- 使用静态内部类。
- 及时关闭资源对象。

### Bitmap优化

使用完Bitmap后若不释放图片资源，容易造成**内存泄露，从而导致内存溢出**。

#### Bitmap内存模型

- api10之前（Android2.3.3）：Bitmap对象放在堆内存，像素数据放在本地内存。
- api10之后：均在堆内存。
- api26之后（Android8.0）：像素数据放在本地内存。使得native层的Bitmap像素数据可以和Java层的对象一起快速释放。

**内存回收：**

- 在Android 3.0之前，需要手动调用`Bitmap.recycle()`进行Bitmap的回收。
- 从Android 3.0开始，系统提供了更智能的内存管理，大多数情况下不需要手动回收Bitmap。

**Bitmap的像素配置：**

| Config    | 占用字节大小(byte) | 说明                    |
| --------- | ------------------ | ----------------------- |
| ALPHA_8   | 1                  | 单透明通道              |
| RGB_565   | 2                  | 简易RGB色调             |
| ARGB_8888 | 4                  | 24位真彩色              |
| RGBA_F16  | 8                  | Android 8.0 新增（HDR） |

**计算Btimap占用内存：**

- Bitmap#getByteCount()
- getWidth() * getHeight() * 1像素占用内存

#### 资源文件目录

**资源文件问题：**

- mdpi (中等密度)：大约160dpi，1x资源。
- hdpi (高密度)：大约240dpi，1.5x资源。
- xhdpi (超高密度)：大约320dpi，2x资源。
- xxhdpi (超超高密度)：大约480dpi，3x资源。
- xxxhdpi (超超超高密度)：大约640dpi，4x资源。

**测试代码：**

```java
private void printBitmap(Bitmap bitmap, String drawable) {
    String builder = drawable +
            " Bitmap占用内存:" +
            bitmap.getByteCount() +
            " width:" +
            bitmap.getWidth() +
            " height:" +
            bitmap.getHeight() +
            " 1像素占用大小:" +
            getByteBy1px(bitmap.getConfig());
    Log.e("TAG", builder);
}

private int getByteBy1px(Bitmap.Config config) {
    if (Bitmap.Config.ALPHA_8.equals(config)) {
        return 1;
    } else if (Bitmap.Config.RGB_565.equals(config)) {
        return 2;
    } else if (Bitmap.Config.ARGB_8888.equals(config)) {
        return 4;
    }
    return 1;
}
```

```java
// 逻辑密度
float density = metrics.density;
// 物理密度
int densityDpi = metrics.densityDpi;
Log.e("TAG", density + "-" + densityDpi);

// 1倍图
Bitmap bitmap1 = BitmapFactory.decodeResource(getResources(), R.drawable.splash1);
printBitmap(bitmap1, "drawable-mdpi");

// 2倍图
Bitmap bitmap2 = BitmapFactory.decodeResource(getResources(), R.drawable.splash2);
printBitmap(bitmap2, "drawable-xhdpi");

// 3倍图
Bitmap bitmap3 = BitmapFactory.decodeResource(getResources(), R.drawable.splash3);
printBitmap(bitmap3, "drawable-xxhdpi");

// 4倍图
Bitmap bitmap4 = BitmapFactory.decodeResource(getResources(), R.drawable.splash4);
printBitmap(bitmap4, "drawable-xxxhdpi");

// drawable
Bitmap bitmap5 = BitmapFactory.decodeResource(getResources(), R.drawable.splash);
printBitmap(bitmap5, "drawable");
/*
        3.0-480
        drawable-mdpi Bitmap占用内存:37127376 width:2574 height:3606 1像素占用大小:4
        drawable-xhdpi Bitmap占用内存:9281844 width:1287 height:1803 1像素占用大小:4
        drawable-xxhdpi Bitmap占用内存:4125264 width:858 height:1202 1像素占用大小:4
        drawable-xxxhdpi Bitmap占用内存:2323552 width:644 height:902 1像素占用大小:4
        drawable Bitmap占用内存:37127376 width:2574 height:3606 1像素占用大小:4
         */
```

**说明：**

在 mdpi 的设备上 1dp==1px，在 xhdpi 的设备上 1dp==2px，在 xxhdpi 的设备上 1dp==3px。

因此当前设备是 xxhdpi，因此同一张图片在 xxhdpi 资源下宽是858，在 mdpi 资源下会放大3倍宽是2574，在 xhdpi 资源下会放大1.5倍宽是1287。

#### 优化技巧

- 设置多套图片资源。
- 选择合适的解码方式。
- 设置图片缓存。



## [源码下载](https://github.com/xiangxiongfly/Android_Performance_Optimization)

