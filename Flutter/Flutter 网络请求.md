[TOC]

# Flutter 网络请求

## HttpClient

HttpClient是Dart标准库的一部分，功能较弱使用不友好，不建议直接使用。

### Get请求

```dart
getByHttpClient() async {
    String _result;
    var httpClient = HttpClient();
    try {
        final uri = Uri(
            scheme: "https",
            host: "www.wanandroid.com",
            path: "article/list/0/json",
        );
        HttpClientRequest request = await httpClient.getUrl(uri);
        HttpClientResponse response = await request.close();
        if (response.statusCode == HttpStatus.ok) {
            String responseBody = await response.transform(utf8.decoder).join();
            _result = responseBody;
        } else {
            _result = "请求失败：${response.statusCode}";
        }
    } catch (exception) {
        _result = "请求失败：$exception";
    }
    setState(() {
        _data = _result;
    });
    if (kDebugMode) {
        print(_result);
    }
}
```

### Post请求

```dart
postByHttpClient() async {
    String _result = "";
    var httpClient = HttpClient();
    try {
        final uri = Uri(
            scheme: "https",
            host: "www.wanandroid.com",
            path: "user/login",
            queryParameters: {"username": "Tom", "password": "123456"});
        HttpClientRequest request = await httpClient.postUrl(uri);
        HttpClientResponse response = await request.close();
        if (response.statusCode == HttpStatus.ok) {
            String responseBody = await response.transform(utf8.decoder).join();
            _result = responseBody;
        } else {
            _result = "请求失败：${response.statusCode}";
        }
    } catch (exception) {
        _result = "请求失败：$exception";
    }
    setState(() {
        _data = _result;
    });
    if (kDebugMode) {
        print(_result);
    }
}
```



## http

http是一个可组合，基于Future的库，用于HTTP请求，包含更多的高级功能。

### 添加库

```yaml
dependencies:
  http: ^0.12.2
```

### Get请求

```dart
import 'package:http/http.dart' as http;

getByHttp() async {
    String _result = "";
    const url = "https://www.wanandroid.com/article/list/0/json";
    var client = http.Client();
    try {
        http.Response response = await client.get(Uri.parse(url));
        if (response.statusCode == 200) {
            _result = response.body;
        } else {
            _result = "请求失败：${response.statusCode}";
        }
    } catch (exception) {
        _result = "请求失败：$exception";
    }
    setState(() {
        _data = _result;
    });
    if (kDebugMode) {
        print(_result);
    }
}
```

### Post请求

```dart
postByHttp() async {
    String _result = "";
    const url = "https://www.wanandroid.com/user/login";
    var client = http.Client();
    try {
        http.Response response = await client.post(Uri.parse(url), body: {"username": "Tom", "password": "123456"});
        if (response.statusCode == 200) {
            _result = response.body;
        } else {
            _result = "失败：${response.statusCode}";
        }
    } catch (exception) {
        _result = "异常：$exception";
    }
    setState(() {
        _data = _result;
    });
    if (kDebugMode) {
        print(_result);
    }
}
```



## dio

dio是一个强大的Http请求库，支持Restful API、FormData、拦截器、请求取消、Cookie管理、文件上传/下载等高级功能。

### 添加库

```yaml
dependencies:
  dio: ^4.0.4
```

### Get请求

```dart
getByDio() async {
    token = CancelToken();
    String result = "";
    const url = "https://www.wanandroid.com/article/list/0/json";
    var dio = Dio()..interceptors.add(MyInterceptor());
    try {
        Response response = await dio.get(url, cancelToken: token);
        result = response.data.toString();
    } on DioError catch (e) {
        if (e.response != null) {
            result = "请求失败：${e.response!.statusCode}";
        } else {
            result = "请求失败：$e";
        }
    }
    setState(() {
        _data = result;
    });
    if (kDebugMode) {
        print(result);
    }
}
```

### Post请求

```dart
postByDio() async {
    String result = "";
    const url = "https://www.wanandroid.com/user/login";
    var dio = Dio();
    try {
        Response response =
            await dio.post<String>(url, data: {"username": "Tom", "password": "123456"});
        result = response.data;
    } on DioError catch (e) {
        if (e.response != null) {
            result = "失败错误码：${e.response!.statusCode}";
        } else {
            result = "其他异常：$e";
        }
    }
    setState(() {
        _data = result;
    });
    if (kDebugMode) {
        print(result);
    }
}
```



### FormData

```dart
postFormByDio() async {
    String result = "";
    const url = "https://www.wanandroid.com/user/login";
    var dio = Dio();
    var formData = FormData.fromMap({"username": "Tom", "password": "123456"});
    try {
        Response response = await dio.post<String>(url, data: formData);
        result = response.data;
    } on DioError catch (e) {
        if (e.response != null) {
            result = "失败错误码：${e.response!.statusCode}";
        } else {
            result = "其他异常：$e";
        }
    }
    setState(() {
        _data = result;
    });
    if (kDebugMode) {
        print(result);
    }
}
```



### 取消请求

```dart
//定义token
CancelToken? token = CancelToken();

//添加token
dio.get(url, cancelToken: token);

//取消请求
token.cancel("cancel");
```



### 添加拦截器

**创建拦截器类**

```dart
class MyInterceptor extends dio.Interceptor {
    @override
    void onRequest(dio.RequestOptions options, dio.RequestInterceptorHandler handler) {
        print("请求前调用");
        super.onRequest(options, handler);
    }

    @override
    void onResponse(dio.Response response, dio.ResponseInterceptorHandler handler) {
        print("响应后调用");
        super.onResponse(response, handler);
    }

    @override
    void onError(dio.DioError err, dio.ErrorInterceptorHandler handler) {
        print("发生异常时调用");
        super.onError(err, handler);
    }
}
```

**使用拦截器**

```dart
var dio = Dio()
    ..interceptors.add(MyInterceptor());
```



### 简单封装

```dart
class HttpManager {
    static const CONNECT_TIMEOUT = 50000;
    static const RECEIVE_TIMEOUT = 30000;

    static HttpManager? _instance;

    late Dio _dio;

    Dio get client => _dio;

    factory HttpManager() => _getInstance();

    static _getInstance() {
        _instance ??= HttpManager._create();
        return _instance;
    }

    HttpManager._create() {
        var options = BaseOptions(
            connectTimeout: CONNECT_TIMEOUT,
            receiveTimeout: RECEIVE_TIMEOUT,
        );
        _dio = Dio(options)
            ..interceptors.add(LogInterceptor(
                requestBody: true,
                responseBody: true,
            ));
    }
}
```

```dart
getByHttpManager() async {
    String result = "";
    const url = "https://www.wanandroid.com/article/list/0/json";
    try {
        Response response = await HttpManager().client.get(url);
        result = response.data.toString();
    } on DioError catch (e) {
        if (e.response != null) {
            result = "失败错误码：${e.response!.statusCode}";
        } else {
            result = "其他异常：$e";
        }
    }
    setState(() {
        _data = result;
    });
}
```

