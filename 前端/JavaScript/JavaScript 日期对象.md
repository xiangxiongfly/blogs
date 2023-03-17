[TOC]

# JavaScript 日期对象

## 创建日期对象

```javascript
var obj = new Date();
console.log(obj); //Thu Dec 15 2022 16:29:26 GMT+0800 (中国标准时间)

var obj = new Date(2008, 9, 10, 12, 13, 14);
console.log(obj); //Fri Oct 10 2008 12:13:14 GMT+0800 (中国标准时间)

var obj = new Date('2008-9-10 11:12:13');
console.log(obj); //Wed Sep 10 2008 11:12:13 GMT+0800 (中国标准时间)
```



## 常用方法

| 方法          | 说明                                         |
| ------------- | -------------------------------------------- |
| getFullYear() | 获取年份                                     |
| getMonth()    | 获取月份，0~11之间                           |
| getDate()     | 获取日数，1~31之间                           |
| getHours()    | 获取时，0~23之间                             |
| getMinutes()  | 获取分，0~59之间                             |
| getSeconds()  | 获取秒，0~59之间                             |
| setFullYear() | 可以设置年、月、日                           |
| setMonth()    | 可以设置月、日                               |
| setHours()    | 可以设置时、分、秒、毫秒                     |
| setMinutes()  | 可以设置分、秒、毫秒                         |
| setSeconds()  | 可以设置秒、毫秒                             |
| getDay()      | 获取星期几，0表示周末，1表示周一 ~ 6表示周六 |
| getTime()     | 获取时间戳                                   |
| Date.now()    | 获取当前日期时间戳                           |

```javascript
var obj = new Date();
console.log(obj); //Thu Dec 15 2022 16:29:26 GMT+0800 (中国标准时间)

var year = obj.getFullYear();
var month = obj.getMonth()
var date = obj.getDate();
var hours = obj.getHours();
var minutes = obj.getMinutes();
var seconds = obj.getSeconds();
console.log(year + "-" + month + "-" + date); //2022-11-15
console.log(hours + ":" + minutes + ":" + seconds); //16:29:26
```

```javascript
var obj = new Date();
obj.setFullYear(2008);
obj.setMonth(8);
obj.setDate(9);
obj.setHours(8);
obj.setMinutes(8);
obj.setSeconds(10);
console.log(obj); //Tue Sep 09 2008 08:08:10 GMT+0800 (中国标准时间)
```

```javascript
var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var obj = new Date();
var day = obj.getDay();
console.log("今天是" + weeks[day]);
```

```javascript
var obj = new Date();
var time = obj.getTime();
console.log(time); //1671094213459
```



## 格式化

### 日期时间格式化

```javascript
/**
* 方法1
* @description 对Date的扩展，将 Date 转换为指定格式的String
*  月(MM)、日(dd)、小时(HH)、分(mm)、秒(ss)固定用两个占位符
*  年(yyyy)固定用4个占位符
* @param fmt
* @example    
*   (new Date()).format("yyyy-MM-dd HH:mm:ss") // 2018-07-31 20:09:04
*   (new Date()).format("yyyy-MM-dd") // 2018-07-31 20:08
* @returns {*}
*/
Date.prototype.format = function(pattern) {
    function fillZero(num) {
        return num < 10 ? "0" + num : num;
    }
    var pattern = pattern; // YYYY-MM-DD或YYYY-MM-DD HH:mm:ss
    var dateObj = {
        "y": this.getFullYear(),
        "M": fillZero(this.getMonth() + 1),
        "d": fillZero(this.getDate()),
        "H": fillZero(this.getHours()),
        "m": fillZero(this.getMinutes()),
        "s": fillZero(this.getSeconds())
    };
    return pattern.replace(/yyyy|MM|dd|HH|mm|ss/g, function(match) {
        switch (match) {
            case "yyyy":
                return dateObj.y;
            case "MM":
                return dateObj.M;
            case "dd":
                return dateObj.d;
            case "HH":
                return dateObj.H;
            case "mm":
                return dateObj.m;
            case "ss":
                return dateObj.s;
        }
    });
};

var d = new Date();

console.log(d.format('yyyy-MM-dd HH:mm:ss.S')); // 2023-01-12 15:58:26.0
console.log(d.format('yyyy-MM-dd')); // 2023-01-12
console.log(d.format('yyyy-MM-dd q HH:mm:ss')); // 2023-01-12 1 15:58:26
console.log(d.format("yyyy年MM月dd日 HH时mm分ss秒")); //2023年01月12日 15时58分26秒
```

```javascript
/**
			 * 方法2
			 * @description 对Date的扩展，将 Date 转换为指定格式的String
			 *  月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1~2 个占位符，
			 *  年(y)可以用 1~4 个占位符，毫秒(S)只能用 1 个占位符(是 1~3 位的数字)
			 * @param fmt
			 * @example    
			 * 		(new Date()).format("yyyy-MM-dd HH:mm:ss") // 2018-07-31 20:09:04
			 * 		(new Date()).format("yyyy-M-d H:m")  // 2018-07-31 20:09
			 * @returns {*}
			 */
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
                              (("00" + o[k]).substring(("" + o[k]).length)));
    return fmt;
};

var d = new Date();

console.log(d.format('yyyy-MM-dd HH:mm:ss.S')); // 2023-01-12 15:58:26.0
console.log(d.format('yyyy-MM-dd')); // 2023-01-12
console.log(d.format('yyyy-MM-dd q HH:mm:ss')); // 2023-01-12 1 15:58:26
console.log(d.format("yyyy年MM月dd日 HH时mm分ss秒")); //2023年01月12日 15时58分26秒
```

### 使用moment.js格式化

```html
<script src="js/moment.js"></script>
<script>
    //格式化
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log(moment().format('dddd'));
    console.log(moment().format("MMM Do YY"));
    console.log(moment().format('YYYY [escaped] YYYY'));
	console.log(moment().format('yyyy-MM-DD HH:mm:ss'));

    //Relative Time
    console.log(moment("20111031", "YYYYMMDD").fromNow());
    console.log(moment("20120620", "YYYYMMDD").fromNow());
    console.log(moment().startOf('day').fromNow());
    console.log(moment().endOf('day').fromNow());
    console.log(moment().startOf('hour').fromNow());
</script>
```



## 验证日期是否合法

```javascript
function validateDate(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    return true;
}

console.log(validateDate('2018-08-20')); // true
console.log(validateDate('2018-08-40')); // false
```



## 日期计算

### 比较两日期大小

```javascript
function compareDate(dateStr1, dateStr2) {
    var date1 = dateStr1.replace(/-/g, "\/");
    var date2 = dateStr2.replace(/-/g, "\/");
    return new Date(date1) > new Date(date2);
}

var dateStr1 = "2018-07-30 7:31";
var dateStr2 = "2018-07-31 7:30";
var dateStr3 = "2018-08-01 17:31";
var dateStr4 = "2018-08-01 17:30";
console.log(compareDate(dateStr1, dateStr2)); // false
console.log(compareDate(dateStr3, dateStr4)); // true
```

### 计算日期前后N天的日期

```javascript
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    //获取当前月份的日期，不足10补0
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，
    //不足10补0
    return y + "-" + m + "-" + d;
}

console.log("半年前：" + GetDateStr(-180)); // 半年前：2018-02-02
console.log("三月前：" + GetDateStr(-90)); // 三月前：2018-05-03
console.log("一月前：" + GetDateStr(-30)); // 一月前：2018-07-02
console.log("昨天：" + GetDateStr(-1)); // 昨天：2018-07-31
console.log("今天：" + GetDateStr(0)); // 今天：2018-08-01
console.log("明天：" + GetDateStr(1)); // 明天：2018-08-02
console.log("后天：" + GetDateStr(2)); // 后天：2018-08-03
console.log("一月后：" + GetDateStr(30)); // 一月后：2018-08-31
console.log("三月后：" + GetDateStr(90)); // 三月后：2018-10-30
console.log("半年后：" + GetDateStr(180)); // 半年后：2019-01-28
```

### 计算两日期的时间差

```javascript
function GetDateDiﬀ(startTime, endTime, diﬀType) {
    // 将yyyy-MM-dd的时间格式转换为yyyy/MM/dd的时间格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    // 将计算间隔类性字符转换为小写
    diﬀType = diﬀType.toLowerCase();
    var sTime = new Date(startTime); // 开始时间
    var eTime = new Date(endTime); // 结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diﬀType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

var result1 = GetDateDiﬀ("2018-07-30 18:12:34", '2018-08-01 9:17:30', "day");
var result2 = GetDateDiﬀ("2018-07-29 20:56:34", '2018-08-01 9:17:30', "hour");
console.log("两者时间差为：" + result1 + "天。"); //两者时间差为：1天。
console.log("两者时间差为：" + result2 + "小时。"); //两者时间差为：60小时。
```

### 倒计时功能

```javascript
function countDown(year, month, date, hour, minutes, seconds) {
    month--;
    //现在日期
    var nowTime = Date.now();
    //目标日期
    var targetTime = new Date(year, month, date, hour, minutes, seconds);
    //毫秒差
    var millisecond = targetTime - nowTime;

    var totalSeconds = (millisecond) / 1000; //总秒数

    var d = parseInt(totalSeconds / 60 / 60 / 24); //天
    var h = parseInt(totalSeconds / 60 / 60 % 24); //时
    var m = parseInt(totalSeconds / 60 % 60); //分
    var s = parseInt(totalSeconds % 60); //秒
    return d + '天' + h + '时' + m + '分' + s + '秒';
}

console.log(countDown(2022, 12, 15, 18, 0, 0));
```



