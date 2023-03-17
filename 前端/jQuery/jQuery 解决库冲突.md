[TOC]

# jQuery库冲突

## 原因

在某些情况下，可能有必要在同一个页面中使用多个JavaScript库。但是很多库都使用了“$”这个符号（因为它简短方便），这时就需要用一种方式来避免名称的冲突了。



## jQuery.noConflict()

在jQuery中，我们可以使用j`Query.noConflict()`方法来把“$”符号的控制器过渡给其他库。其中，`jQuery.noConflict()`方法的一般使用模式如下。

```html
<!DOCTYPE html>
<html> 
    <head> 
        <meta charset="utf-8" /> 
        <title></title> 
        <script src="js/jquery-1.12.4.min.js"></script> 
        <script> 
            $(function () { 
                console.log($); 
                jQuery.noConflict(); 
                console.log($); 
            }) 
        </script> 
    </head> 
    <body> 
        <div></div> 
    </body> 
</html> 
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/92b632b3407c4173b8bd066411c97127.png)

说明：使用`jQuery.noConflict()`方法前，`$`还是指向jQuery对象，使用方法后，`$`就不再指向jQuery对象了。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/jquery-1.12.4.min.js"></script>
		<script>
			$(function() {
				console.log(jQuery);
				jQuery.noConflict();
				console.log(jQuery);
			})
		</script>
	</head>
	<body>
		<div></div>
	</body>
</html>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/538cae516a3a43a48f2e11712f038968.png)

从输出结果可以看出，不管是否使用`jQuery.noConflict()`方法，`jQuery`这个变量始终指向的是jQuery对象本身。



## 如还想使用$可以这么做

使用了jQuery.noConflict()方法之后，如果还想继续让“$”指向jQuery对象，我们可以使用一个立即执行函数来建立一个封闭环境，使得在函数内部中，“$”指向jQuery对象。这样，就不会与外部的“$”冲突了。

```html
<!DOCTYPE html>
<html> 
    <head> 
        <meta charset="utf-8" /> 
        <title></title> 
        <script src="js/prototype.min.js"></script> 
        <script src="js/jquery-1.12.4.min.js"></script> 
        <script> 
            jQuery.noConflict(); 
            //这里之后可以把“$”交给prototype库使用 
        </script> 
        <script> 
            (function ($) { 
                $(function () { 
                    $("div").html("<strong>hello</strong>"); 
                }) 
            })(jQuery) 
        </script> 
    </head> 
    <body> 
        <div></div> 
    </body> 
</html> 
```



