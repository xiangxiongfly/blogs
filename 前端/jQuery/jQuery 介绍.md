[TOC]

# jQuery 介绍

## 介绍

jQuery本身就是用JavaScript来写的，它只是把JavaScript中最常用的功能封装起来，以方便开发者快速开发。遥想当年，jQuery的创始人John Resig就是受够了JavaScript的各种缺点，所以才开发了jQuery。jQuery具有很多优点，主要包括以下几点：

- 代码简洁。
- 完美兼容。
- 轻量级。
- 强大的选择器。
- 完善的Ajax。
- 丰富的插件。

jQuery 官网：http://jquery.com。

jQuery API文档：http://api.jquery.com。

jQuery UI文档：http://jqueryui.com/demos。

jQuery Mobile文档：http://jquerymobile.com/demos。

jQuery插件：https://plugins.jquery.com。



## 下载

jQuery文件有两个常用版本：一个是1.x版本，另一个是3.x版本。

3.x版本是目前的最新版本，与1.x版本有着相同的API。1.x版本兼容IE6、IE7和IE8，而3.x版本不兼容IE6、IE7和IE8。

在实际开发中，推荐使用1.x版本，而不是3.x版本，原因有两个：

- 现在很多网站还是要考虑兼容IE6~IE8。
- 大多数jQuery插件不支持3.x版本，只支持1.x版本。

jQuery文件有2种类型：

- 开发版。
- 压缩版。

| 类型                 | 说明                     |
| -------------------- | ------------------------ |
| jquery.js 开发版     | 没有压缩，用于学习源代码 |
| jquery.min.js 压缩版 | 高度压缩，用于实际开发   |

github下载地址：https://github.com/jquery/jquery/tree/1.12.4/dist

![在这里插入图片描述](https://img-blog.csdnimg.cn/f1270d6db0274d3fb839e517292a191a.png)



## 安装

```css
<script src="jquery-1.12.4.min.js"></script>
<script>  
    //你的jQuery代码  
</script> 
```



## jQuery CDN

CDN，全称是Content Delivery Network，即“内容分发网络”。

CDN，简单点来说，就是在离你最近的地方放置一台性能好、连接顺畅的副本服务器，让你能够在最近的距离、以最快的速度获取内容。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1fa0ecefa1a0400dad0c468a059b8ba4.png)



**常用的jQuery CDN**

```
//jQuery官网
<script 
  src="http://code.jquery.com/jquery-1.12.4.min.js" 
  integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" 
  crossorigin="anonymous"> 
</script> 

//bootCDN 
<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script> 
```

简单来说，我们只要引入上面的代码，就不需要引入本地的jQuery库了。

