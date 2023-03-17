[TOC]

# Java时间日期总结

## Date

 `java.util.Date`是用于表示一个日期和时间的对象，注意与`java.sql.Date`区分，后者用在数据库中 。

### 主要API

```java
Date date = new Date();
date;//Tue Nov 03 13:26:57 CST 2020

//获取当前所在地日期
date.toLocaleString();//2020-11-3 13:26:57

//获取毫秒值
date.getTime();//1604381300674

//获取毫秒值
system.currentTimeMillis();//1604381311714
```



## 格式化日期

`java.text.SimpleDateFormat`使用格式化日期

| 字符                | 含义                |
| ------------------- | ------------------- |
| y                   | 年                  |
| M                   | 月                  |
| d                   | 日                  |
| E                   | 星期                |
| H                   | 时（24小时制）      |
| h                   | 时（12小时制）      |
| m                   | 分                  |
| s                   | 秒                  |
| yyyy-MM-dd HH:mm:ss | 2020-01-01 17:15:30 |

### 日期转字符串

```java
Date date = new Date();
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");   
String dateStr = format.format(date);
System.out.println(dateStr);//2020-06-18 11:41:03
```

### 字符串转日期

```java
String dateStr = "2020年08月07日 14时30分15秒";
SimpleDateFormat format = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
Date date = format.parse(dateStr);
System.out.println(date);//Fri Aug 07 14:30:15 CST 2020
```





## Calendar

`java.util.Calendar`是用于操作年月日时分秒的类，与`Date`相比多了一些日期时间运算的功能。

### 主要API

```java
//获取Calendar对象
Calendar calendar = Calendar.getInstance();

//获取Date对象
Date date = calendar.getTime();

//获取时间戳
long timeInMillis = calendar.getTimeInMillis();
long timeInMillis = date.getTime();

//获取年月日时分秒
int year = calendar.get(Calendar.YEAR);
int month = calendar.get(Calendar.MONTH);//月份范围0-11
int day = calendar.get(Calendar.DATE);
int hour_12 = calendar.get(Calendar.HOUR);//12进制
int hour_24 = calendar.get(Calendar.HOUR_OF_DAY);//24进制
int minute = calendar.get(Calendar.MINUTE);
int second = calendar.get(Calendar.SECOND);

//获取月内第几周
int WEEK_OF_MONTH = calendar.get(Calendar.WEEK_OF_MONTH);
//获取年内第几天
int DAY_OF_YEAR = calendar.get(Calendar.DAY_OF_YEAR);
//获取月内第几天
int DAY_OF_MONTH = calendar.get(Calendar.DAY_OF_MONTH);
//获取星期几，范围（1-7），1为周日，7为周六
int DAY_OF_WEEK = calendar.get(Calendar.DAY_OF_WEEK);

//设置为上一月的最后一天
calendar.set(Calendar.DATE, 0);
```

### 日期运算

```java
//年份加1
calendar.add(Calendar.YEAR, 1);
//年份减2
calendar.add(Calendar.YEAR, -2);

//小时加1
calendar.add(Calendar.HOUR, 1);
```



## LocalDate

`java.time.LocalDate`是Java8新增API，提供了新的日期和时间API，修改旧API不合理的设计。

### 主要API

```java
LocalDate date = LocalDate.of(2008, 9, 10);
LocalDate date = LocalDate.now();

int year = date.getYear(); //年

int month = date.getMonthValue(); //月

int dayOfMonth = date.getDayOfMonth(); //日

DayOfWeek dayOfWeek = date.getDayOfWeek(); //周几

int len = date.lengthOfMonth(); //月的日数

boolean leapYear = date.isLeapYear(); //是否闰年
```

```java
LocalTime time = LocalTime.of(18, 19, 20);
LocalTime time = LocalTime.now();

int hour = time.getHour(); //时

int minute = time.getMinute(); //分

int second = time.getSecond(); //秒
```

```java
LocalDateTime dateTime = LocalDateTime.of(2008, 9, 10, 18, 19, 20);
LocalDateTime dateTime = LocalDateTime.now();

LocalDate date = dateTime.toLocalDate(); //转当前日期
LocalTime time = dateTime.toLocalTime(); //转当前时间
```



### 格式化

#### 字符串->日期时间

ISO 8601规定的日期和时间分隔符是`T`。标准格式如下：

- 日期：yyyy-MM-dd
- 时间：HH:mm:ss
- 带毫秒的时间：HH:mm:ss.SSS
- 日期和时间：yyyy-MM-dd'T'HH:mm:ss
- 带毫秒的日期和时间：yyyy-MM-dd'T'HH:mm:ss.SSS

```java
//遵守ISO 8601格式，可以直接使用parse方法
LocalDateTime dateTime = LocalDateTime.parse("2008-08-08T15:16:17");
LocalDate date = LocalDate.parse("2008-08-08");
LocalTime time = LocalTime.parse("15:16:17");
System.out.println(dateTime);//2008-08-08T15:16:17
System.out.println(date);//2008-08-08
System.out.println(time);//15:16:17
```

```java
//非遵守ISO 8601格式
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
LocalDateTime dateTime = LocalDateTime.parse("2008/08/08 15:16:17", formatter);
System.out.println(dateTime);//2008-08-08T15:16:17
```

#### 日期时间->字符串

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
LocalDateTime dateTime = LocalDateTime.now();
String dateTimeStr = formatter.format(dateTime);
System.out.println(dateTimeStr); //2020/11/03 14:46:56
```



### 日期时间运算

**加减运算**

```java
LocalDateTime localDateTime = LocalDateTime.now();
System.out.println(localDateTime);//2020-11-03T15:00:32.445

//先加5天，再减3小时
LocalDateTime dateTime1 = localDateTime.plusDays(5).minusHours(3);
System.out.println(dateTime1);//2020-11-08T12:00:32.445

//再减一个月
LocalDateTime dateTime2 = dateTime1.minusMonths(1);
System.out.println(dateTime2);//2020-10-08T12:00:32.445
```

**指定修改**

```java
LocalDateTime d = LocalDateTime.now();
System.out.println(d);//2020-11-03T15:15:39.456

//日期修改为2008-8-8
LocalDateTime d2 = d.withYear(2008).withMonth(8).withDayOfMonth(8);
System.out.println(d2);//2008-08-08T15:15:39.456
```

**判断日期先后**

可以通过 `isBefore()`和`isAfter()` 判断日期时间的先后

```java
LocalDateTime now = LocalDateTime.now();
LocalDateTime d2 = LocalDateTime.of(2008, 8, 8, 15, 16, 17);
System.out.println(now.isAfter(d2));//true
```



### Instant

用于方便记录某个时间点

```java
Instant instant = Instant.ofEpochSecond(60 * 24);
System.out.println(instant); //1970-01-01T00:24:00Z

long second = instant.getEpochSecond(); //偏移秒数
System.out.println(second); //1440

Instant now = Instant.now();
System.out.println(now.getEpochSecond()); //偏移秒数
```



#### LocalDateTime->Instant

```java
LocalDateTime now = LocalDateTime.now();

Instant instant = now.toInstant(ZoneOffset.UTC);
```



### Duration

Duration表示两个Instant之间的一段时间

```java
Instant one = Instant.ofEpochSecond(100L);
Instant two = Instant.ofEpochSecond(200L);
Duration duration = Duration.between(one, two);
System.out.println(duration.getSeconds()); //100

Duration duration2 = duration.plusSeconds(200L); //累加秒数
System.out.println(duration2.getSeconds()); //300

Duration duration3 = duration.plusDays(1L); //累加天数
System.out.println(duration3.getSeconds()); //86500
```



### Period

Period表示两个日期的时间差

```java
LocalDate date1 = LocalDate.of(2008, 1, 2);
LocalDate date2 = LocalDate.of(2010, 7, 1);

Period period = Period.between(date1, date2);

System.out.println(period.getDays()); //29
System.out.println(period.getMonths()); //5
System.out.println(period.getYears()); //2
```



## 工具类

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DateTimeUtils {
    public static final String CONSTANT_DATE = "yyyy-MM-dd";

    private DateTimeUtils() {
    }

    /**
     * Date转String
     */
    public static String formatDate(Date date, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.format(date);
    }


    /**
     * String转Date
     */
    public static Date parseDate(String dateStr, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        try {
            Date date = simpleDateFormat.parse(dateStr);
            return date;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 月日时分秒 0-9前补充0，并转为字符串
     */
    public static String fillZero(int num) {
        return num < 10 ? "0" + num : "" + num;
    }

    /**
     * 去除前缀0，并转整数
     */
    public static int trimZero(String text) {
        if (text.startsWith("0")) {
            text = text.substring(1);
        }
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取每月天数
     */
    public static int getDaysInMonth(int year, int month) {
        String[] bigMonths = {"1", "3", "5", "7", "8", "10", "12"};
        String[] littleMonths = {"4", "6", "9", "11"};
        List<String> bigList = Arrays.asList(bigMonths);
        List<String> littleList = Arrays.asList(littleMonths);
        // 判断大小月及是否闰年,用来确定"日"的数据
        if (bigList.contains(String.valueOf(month))) {
            return 31;
        } else if (littleList.contains(String.valueOf(month))) {
            return 30;
        } else {
            if (year <= 0) {
                return 29;
            }
            // 是否闰年
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                return 29;
            } else {
                return 28;
            }
        }
    }

    /**
     * 获取昨天日期
     */
    public static String getYeasterDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        Date date = calendar.getTime();
        return new SimpleDateFormat(CONSTANT_DATE).format(date);
    }

    /**
     * 获取本周第一天
     */
    public static String getFirstOfThisWeek() {
        Calendar calendar = Calendar.getInstance();
        int dayWeek = calendar.get(Calendar.DAY_OF_WEEK);
        if (dayWeek == 1) {
            dayWeek += 7;
        }
        calendar.add(Calendar.DATE, 2 - dayWeek);
        Date date = calendar.getTime();
        return new SimpleDateFormat(CONSTANT_DATE).format(date);
    }

    /**
     * 获取本周最后一天
     */
    public static String getLastOfThisWeek() {
        Calendar calendar = Calendar.getInstance();
        int dayWeek = calendar.get(Calendar.DAY_OF_WEEK);
        if (dayWeek == 1) {
            dayWeek += 7;
        }
        calendar.add(Calendar.DATE, 2 - dayWeek);
        calendar.add(Calendar.DAY_OF_WEEK, 6);
        Date date = calendar.getTime();
        return new SimpleDateFormat(CONSTANT_DATE).format(date);
    }

    /**
     * 获取本月第一天
     */
    public static String getFirstOfMonth() {
        Calendar calendar = Calendar.getInstance();//获取当前日期
        calendar.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        Date date = calendar.getTime();
        return new SimpleDateFormat(CONSTANT_DATE).format(date);
    }

    /**
     * 获取本月最后一天
     */
    public static String getLastOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date date = calendar.getTime();
        return new SimpleDateFormat(CONSTANT_DATE).format(date);
    }
}
```

