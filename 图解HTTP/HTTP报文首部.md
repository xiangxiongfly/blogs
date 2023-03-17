[TOC]

# HTTP报文首部

HTTP首部字段是构成HTTP报文的要素之一。在客户端与服务端之间以HTTP协议进行通信的过程中，无论是请求还是响应都会使用首部字段，它能祈祷传递额外重要信息的作用。

使用首部字段是为了给浏览器和服务器提供报文大小、所使用的语言、认证信息等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3295472354764df2b6d26d32215ba626.png)

## 首部字段结构

**格式：**

```
首部字段名： 字段值
```

**举例：**

```
Content-Type: text/html
Keep-Alive: timeout=15, max=100
```

**HTTP首部字段出现重复情况：**

这种情况在规范内尚未明确，根据浏览器内部处理逻辑的不同，结果可能并不一致。有些浏览器会优先处理第一次出现的首部字段，而有些则会优先处理最后出现的首部字段。



## 首部字段类型

HTTP首部字段根据实际用途可分为以下4种类型：

- 通用首部字段：请求报文和响应报文都会使用的首部。
- 请求首部字段：从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。
- 响应首部字段：从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息。
- 实体首部字段：针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息

**通用首部字段**

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e168ee9ffad4368b907fb8c941e1c59.png)

**请求首部字段**

![在这里插入图片描述](https://img-blog.csdnimg.cn/ddc34037753442e5966afdd8d0ff9698.png)

**响应首部字段**

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1fd72710df3412f860974cfdfe48e50.png)

**实体首部字段**

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c528616a91c445f9dbace47cf981424.png)



## End-to-end首部和Hop-by-hop首部

**端到端首部**

分在此类别中的首部会转发给请求/响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。

Connection、Keep-Alive、Proxy-Authenticate、Proxy-Authorization、Trailer、TE、Transfer-Encoding、Upgrade这些都属于端到端首部。

**逐跳首部**

分在此类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。HTTP/1.1及以后版本中，如果要使用hop-by-hop首部，需要提供Connection首部字段。



## 通用首部字段

### Cache-Control

![在这里插入图片描述](https://img-blog.csdnimg.cn/4467aa5645e341019d6b78010c82ff1a.png)

指定操作缓存的工作机制。

**格式：**

```
Cache-Control: private, max-age=0, no-cache
```

**缓存请求指令**

![在这里插入图片描述](https://img-blog.csdnimg.cn/295ccfec84644b2d9ef2f9b39ff3c78e.png)

**缓存响应指令**

![在这里插入图片描述](https://img-blog.csdnimg.cn/64b697a929a549a6b5004d1818d80bb8.png)

**public指令**

```
Cache-Control: public
```

public指令表示其他用户也可以利用缓存。

**private指令**

```
Cache-Control: private
```

private指令表示特定用户使用缓存。

**no-cache指令**

```
Cache-Control: no-cache
```

客户端发送的请求中如果包含no-cache指令，则表示客户端将不会接收缓存过的响应。于是，“中间”的缓存服务器必须把客户端请求转发给源服务器。如果服务器返回的响应中包含no-cache指令，那么缓存服务器不能对资源进行缓存。源服务器以后也将不再对缓存服务器请求中提出的资源有效性进行确认，且禁止其对响应资源进行缓存操作。

**no-store指令**

```
Cache-Control: no-store
```

no-store指令规定缓存不能在本地存储请求或响应的任一部分。

**max-age指令**

```
Cache-Control: max-age=604800（单位：秒）
```

当客户端发送的请求中包含max-age指令时，如果判定缓存资源的缓存时间数值比指定时间的数值更小，那么客户端就接收缓存的资源。另外，当指定max-age值为0，那么缓存服务器通常需要将请求转发给源服务器。

当服务器返回的响应中包含max-age指令时，缓存服务器将不对资源的有效性再作确认，而max-age数值代表资源保存为缓存的最长时间。

应用HTTP/1.1版本的缓存服务器遇到同时存在Expires首部字段的情况时，会优先处理max-age指令，而忽略掉Expires首部字段。而HTTP/1.0版本的缓存服务器的情况却相反，max-age指令会被忽略掉。

**s-maxage指令**

```
Cache-Control: s-maxage=604800（单位：秒）
```

s-maxage指令的功能和max-age指令的相同，它们的不同点是s-maxage指令只适用于供多位用户使用的公共缓存服务器。

当使用s-maxage指令后，则直接忽略对Expires首部字段及max-age指令的处理。

**min-fresh指令**

```
Cache-Control: min-fresh=60（单位：秒）
```

min-fresh指令要求缓存服务器返回至少还未过指定时间的缓存资源。

比如，当指定min-fresh为60秒后，在这60秒以内如果有超过有效期限的资源都无法作为响应返回了。

**max-stale指令**

```
Cache-Control: max-stale=3600（单位：秒）
```

使用max-stale可指示缓存资源，即使过期也照常接收。

如果指令未指定参数值，那么无论经过多久，客户端都会接收响应；如果指令中指定了具体数值，那么即使过期，只要仍处于max-stale指定的时间内，仍旧会被客户端接收。

**only-if-cached指令**

```
Cache-Control: only-if-cached
```

使用only-if-cached指令表示客户端仅在缓存服务器本地缓存目标资源的情况下才会要求其返回。换言之，该指令要求缓存服务器不重新加载响应，也不会再次确认资源有效性。若发生请求缓存服务器的本地缓存无响应，则返回状态码504 Gateway Timeout。

**must-revalidate指令**

```
Cache-Control: must-revalidate
```

使用must-revalidate指令，代理会向源服务器再次验证即将返回的响应缓存目前是否仍然有效。

若代理无法连通源服务器再次获取有效资源的话，缓存必须给客户端一条504（Gateway Timeout）状态码。

另外，使用must-revalidate指令会忽略请求的max-stale指令（即使已经在首部使用了max-stale，也不会再有效果）。

**proxy-revalidate指令**

```
Cache-Control: proxy-revalidate
```

proxy-revalidate指令要求所有的缓存服务器在接收到客户端带有该指令的请求返回响应之前，必须再次验证缓存的有效性。

**no-transform指令**

```
Cache-Control: no-transform
```

使用no-transform指令规定无论是在请求还是响应中，缓存都不能改变实体主体的媒体类型。

这样做可防止缓存或代理压缩图片等类似操作。



### Connection

Connection首部字段具备如下两个作用：

- 控制不再转发给代理的首部字段。
- 管理持久连接。

**控制不再转发给代理的首部字段**

![在这里插入图片描述](https://img-blog.csdnimg.cn/964e598d516d44569013bc25b4208662.png)

在客户端发送请求和服务器返回响应内，使用Connection首部字段，可控制不再转发给代理的首部字段（即Hop-by-hop首部）。

**管理持久连接**

![在这里插入图片描述](https://img-blog.csdnimg.cn/3198178d51b143ff8748d567b03c47fa.png)

HTTP/1.1版本的默认连接都是持久连接。为此，客户端会在持久连接上连续发送请求。当服务器端想明确断开连接时，则指定Connection首部字段的值为Close。



### Date

首部字段Date表明创建HTTP报文的日期和时间。

HTTP/1.1协议使用在RFC1123中规定的日期时间的格式，如下示例：

```
Date: Tue, 03 Jul 2012 04:40:59 GMT
```



### Pragma

Pragma是HTTP/1.1之前版本的历史遗留字段，仅作为与HTTP/1.0的向后兼容而定义。



### Trailer

首部字段Trailer会事先说明在报文主体后记录了哪些首部字段。该首部字段可应用在HTTP/1.1版本分块传输编码时。



### Transfer-Encoding

首部字段Transfer-Encoding规定了传输报文主体时采用的编码方式。HTTP/1.1的传输编码方式仅对分块传输编码有效。



### Via

使用首部字段Via是为了追踪客户端与服务器之间的请求和响应报文的传输路径。

报文经过代理或网关时，会先在首部字段Via中附加该服务器的信息，然后再进行转发。这个做法和traceroute及电子邮件的Received首部的工作机制很类似。

首部字段Via不仅用于追踪报文的转发，还可避免请求回环的发生。所以必须在经过代理时附加该首部字段内容。

![在这里插入图片描述](https://img-blog.csdnimg.cn/41bdba0accc54319bb72e8eeb411f4da.png)



## 请求首部字段

![在这里插入图片描述](https://img-blog.csdnimg.cn/466aae4ebbbd4fa69e09fdee0bdc86d5.png)

### Host

![在这里插入图片描述](https://img-blog.csdnimg.cn/85d3cb0a200a46a1a5d76e6d70e2cb2e.png)

```
Host: www.hackr.jp
```

虚拟主机运行在同一个IP上，因此使用首部字段Host加以区分。



### Accept

![在这里插入图片描述](https://img-blog.csdnimg.cn/8adffbd747a74794aa5b0021b2205422.png)

Accept首部字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级。可使用type/subtype这种形式，一次指定多种媒体类型。

**常见媒体类型：**

- 文本文件：
  - text/html, text/plain, text/css 
  - application/xhtml+xml, application/xml
- 图片文件：
  - image/jpeg, image/gif, image/png
- 视频文件：
  - video/mpeg, video/quicktime 
- 应用程序使用的二进制文件：
  - application/octet-stream, application/zip

如果浏览器不支持PNG图片的显示，那Accept就不指定image/png，而指定可处理的image/gif和image/jpeg等图片类型。

若想要给显示的媒体类型增加优先级，则使用q=来额外表示权重值[插图]，用分号（;）进行分隔。权重值q的范围是0～1（可精确到小数点后3位），且1为最大值。不指定权重q值时，默认权重为q=1.0。当服务器提供多种内容时，将会首先返回权重值最高的媒体类型。



### Accept-Charset

![在这里插入图片描述](https://img-blog.csdnimg.cn/4c03875a200f49e78d6210860f2aa0a4.png)

```
Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
```

Accept-Charset首部字段可用来通知服务器用户代理支持的字符集及字符集的相对优先顺序。另外，可一次性指定多种字符集。与首部字段Accept相同的是可用权重q值来表示相对优先级。

该首部字段应用于内容协商机制的服务器驱动协商。



### Accept-Encoding

![在这里插入图片描述](https://img-blog.csdnimg.cn/92508b7393bc443a8ead1677180054e6.png)

```
Accept-Encoding: gzip, deflate
```

Accept-Encoding首部字段用来告知服务器用户代理支持的内容编码及内容编码的优先级顺序，通常指定压缩方法，是否支持压缩，支持什么压缩方法。可一次性指定多种内容编码。

**常见压缩编码：**

- gzip：
  - 由文件压缩程序gzip（GNU zip）生成的编码格式（RFC1952），采用Lempel-Ziv算法（LZ77）及32位循环冗余校验（Cyclic Redundancy Check，通称CRC）。
- compress：
  - 由UNIX文件压缩程序compress生成的编码格式，采用Lempel-Ziv-Welch算法（LZW）。
- deflate：
  - 组合使用zlib格式（RFC1950）及由deflate压缩算法（RFC1951）生成的编码格式。
- identity：
  - 不执行压缩或不会变化的默认编码格式。

采用权重q值来表示相对优先级，这点与首部字段Accept相同。另外，也可使用星号（*）作为通配符，指定任意的编码格式。



### Accept-Language

![在这里插入图片描述](https://img-blog.csdnimg.cn/0dbe0888ddc943ad8b619457f548e555.png)

```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3
```

首部字段Accept-Language用来告知服务器用户代理能够处理的自然语言集（指中文或英文等），以及自然语言集的相对优先级。可一次指定多种自然语言集。

和Accept首部字段一样，按权重值q来表示相对优先级。在上述图例中，客户端在服务器有中文版资源的情况下，会请求其返回中文版对应的响应，没有中文版时，则请求返回英文版响应。



### Authorization

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ed721dd2a1c4022ac8717ce7e067797.png)

```
Authorization: Basic dWVub3NlbjpwYXNzd29yZA==
```

首部字段Authorization是用来告知服务器，用户代理的认证信息（证书值）。通常，想要通过服务器认证的用户代理会在接收到返回的401状态码响应后，把首部字段Authorization加入请求中。共用缓存在接收到含有Authorization首部字段的请求时的操作处理会略有差异。



### Expect

![在这里插入图片描述](https://img-blog.csdnimg.cn/8dc9d8579e6d458ab88ca0466e02a15f.png)

```
Expect: 100-continue
```

客户端使用首部字段Expect来告知服务器，期望出现的某种特定行为。因服务器无法理解客户端的期望作出回应而发生错误时，会返回状态码417Expectation Failed。

客户端可以利用该首部字段，写明所期望的扩展。虽然HTTP/1.1规范只定义了100-continue（状态码100 Continue之意）。等待状态码100响应的客户端在发生请求时，需要指定Expect:100-continue。



### If-Match

![在这里插入图片描述](https://img-blog.csdnimg.cn/493ec7e8c49544f09a013730caaa51e3.png)

以If-xxx这种样式的请求首部字段，都可称为条件请求。服务器接收到附带条件的请求后，只有判断指定条件为真时，才会执行请求。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f9cd6549a584e759558eca20f80c7e8.png)

```
If-Match: "123456"
```

只有当If-Match的字段值跟ETag值匹配一致时，服务器才会接受请求。



### If-Modified-Since

![在这里插入图片描述](https://img-blog.csdnimg.cn/c14bcd52bcb345e0b63156953695656f.png)

```
If-Modified-Since: Thu, 15 Apr 2004 00:00:00 GMT
```

如果在If-Modified-Since字段指定的日期时间后，资源发生了更新，服务器会接受请求；如果请求的资源都没有过更新，则返回状态码304 Not Modified的响应。



### If-None-Match

![在这里插入图片描述](https://img-blog.csdnimg.cn/c8581288646d43a39326782a7aa33cf4.png)

只有在If-None-Match的字段值与ETag值不一致时，可处理该请求。与If-Match首部字段的作用相反。



### If-Range

![在这里插入图片描述](https://img-blog.csdnimg.cn/4e9a3b88679d4579b48c3cd524b73e22.png)

首部字段If-Range属于附带条件之一。它告知服务器若指定的If-Range字段值（ETag值或者时间）和请求资源的ETag值或时间相一致时，则作为范围请求处理。反之，则返回全体资源。

![在这里插入图片描述](https://img-blog.csdnimg.cn/214835dfbf054c9aadd8eb430e924479.png)



### Max-Forwards

![在这里插入图片描述](https://img-blog.csdnimg.cn/1cf2384c2b2d4a88813739517293ca35.png)

```
Max-Forwards: 10
```

服务器在往下一个服务器转发请求之前，会将Max-Forwards的值减1后重新赋值。当服务器接收到Max-Forwards值为0的请求时，则不再进行转发，而是直接返回响应。



### Range

```
Range: bytes=5001-10000
```

对于只需获取部分资源的范围请求，包含首部字段Range即可告知服务器资源的指定范围。上面的示例表示请求获取从第5001字节至第10000字节的资源。

**其他格式：**

```
Range: bytes=-500
Range: bytes=500-
Range: bytes=500-600,601-999
```

接收到附带Range首部字段请求的服务器，会在处理请求之后返回状态码为206 Partial Content的响应。无法处理该范围请求时，则会返回状态码200OK的响应及全部资源。



### User-Agent

```
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/=> 20100101 Firefox/13.0.1
```

首部字段User-Agent会将创建请求的浏览器和用户代理名称等信息传达给服务器。

由网络爬虫发起请求时，有可能会在字段内添加爬虫作者的电子邮件地址。此外，如果请求经过代理，那么中间也很可能被添加上代理服务器的名称。



## 响应首部字段

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ae0e155eede4119be24ebfd8761a535.png)

响应首部字段是由服务器端向客户端返回响应报文中所使用的字段，用于补充响应的附加信息、服务器信息，以及对客户端的附加要求等信息。



### Accept-Ranges

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe6e2e0d5a724a86932cf403c1d00323.png)

```
Accept-Ranges: bytes
```

首部字段Accept-Ranges是用来告知客户端服务器是否能处理范围请求，以指定获取服务器端某个部分的资源。

可指定的字段值有两种，可处理范围请求时指定其为bytes，反之则指定其为none。



### Age

![在这里插入图片描述](https://img-blog.csdnimg.cn/58d236ec3db645729dd0c89d6778a8cc.png)

```
Age: 600
```

首部字段Age能告知客户端，源服务器在多久前创建了响应。字段值的单位为秒。

若创建该响应的服务器是缓存服务器，Age值是指缓存后的响应再次发起认证到认证完成的时间值。代理创建响应时必须加上首部字段Age。



### ETag

![在这里插入图片描述](https://img-blog.csdnimg.cn/e3840a8e83dc4720800f578477d40738.png)

```
ETag: "82e22293907ce725faf67773957acd12"
```

首部字段ETag能告知客户端实体标识。它是一种可将资源以字符串形式做唯一性标识的方式。服务器会为每份资源分配对应的ETag值。另外，当资源更新时，ETag值也需要更新。生成ETag值时，并没有统一的算法规则，而仅仅是由服务器来分配。



### Location

![在这里插入图片描述](https://img-blog.csdnimg.cn/437291ef830c47498776cb9f3932d309.png)

```
Location: http://www.usagidesign.jp/sample.html
```

使用首部字段Location可以将响应接收方引导至某个与请求URI位置不同的资源。

基本上，该字段会配合3xx:Redirection的响应，提供重定向的URI。

几乎所有的浏览器在接收到包含首部字段Location的响应后，都会强制性地尝试对已提示的重定向资源的访问。



### Retry-After

![在这里插入图片描述](https://img-blog.csdnimg.cn/1e016bedddeb4dff96bb2f66e5250cfe.png)

```
Retry-After: 120
```

首部字段Retry-After告知客户端应该在多久之后再次发送请求。主要配合状态码503 Service Unavailable响应，或3xx Redirect响应一起使用。

字段值可以指定为具体的日期时间（Wed, 04 Jul 2012 06:34:24 GMT等格式），也可以是创建响应后的秒数。



### Server

![在这里插入图片描述](https://img-blog.csdnimg.cn/739a206f59914d1fbefb1101139bd6bb.png)

```
Server: Apache/2.2.17 (Unix)

或者：
Server: Apache/2.2.6 (Unix) PHP/5.2.5
```

首部字段Server告知客户端当前服务器上安装的HTTP服务器应用程序的信息。不单单会标出服务器上的软件应用名称，还有可能包括版本号和安装时启用的可选项。



### Vary

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e31c5449d4e481a92d3ada0659e5707.png)

```
Vary: Accept-Language
```

当代理服务器接收到带有Vary首部字段指定获取资源的请求时，如果使用的Accept-Language字段的值相同，那么就直接从缓存返回响应。反之，则需要先从源服务器端获取资源后才能作为响应返回。



## 实体首部字段

实体首部字段是包含在请求报文和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ee38da77b3c4f8189bf41a17400691a.png)

### Allow

![在这里插入图片描述](https://img-blog.csdnimg.cn/ebe28451e9a649d280c1d51ada22ea56.png)

```
Allow: GET, HEAD
```

首部字段Allow用于通知客户端能够支持Request-URI指定资源的所有HTTP方法。当服务器接收到不支持的HTTP方法时，会以状态码405 Method Not Allowed作为响应返回。与此同时，还会把所有能支持的HTTP方法写入首部字段Allow后返回。



### Content-Encoding

![在这里插入图片描述](https://img-blog.csdnimg.cn/157b5cc592fa41e996ad5ab2e3a4d655.png)

```
Content-Encoding: gzip
```

首部字段Content-Encoding会告知客户端服务器对实体的主体部分选用的内容编码方式。内容编码是指在不丢失实体信息的前提下所进行的压缩。

主要采用以下4种内容编码的方式：

- gzip
- compress
- deflate
- identity



### Content-Language

![在这里插入图片描述](https://img-blog.csdnimg.cn/2237630f213d40ddb1acc20dcfeec316.png)

```
Content-Language: zh-CN
```

首部字段Content-Language会告知客户端，实体主体使用的自然语言（指中文或英文等语言）。



### Content-Length

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe853cff0d5a41d8bd944d944e4d4964.png)

```
Content-Length: 15000
```

首部字段Content-Length表明了实体主体部分的大小（单位是字节）。

对实体主体进行内容编码传输时，不能再使用Content-Length首部字段。



### Content-MD5

![在这里插入图片描述](https://img-blog.csdnimg.cn/f718be68d4b1496e99def11047d8e31c.png)

```
Content-MD5: OGFkZDUwNGVhNGY3N2MxMDIwZmQ4NTBmY2IyTY==
```

首部字段Content-MD5是一串由MD5算法生成的值，其目的在于检查报文主体在传输过程中是否保持完整，以及确认传输到达。

对报文主体执行MD5算法获得的128位二进制数，再通过Base64编码后将结果写入Content-MD5字段值。由于HTTP首部无法记录二进制值，所以要通过Base64编码处理。为确保报文的有效性，作为接收方的客户端会对报文主体再执行一次相同的MD5算法。计算出的值与字段值作比较后，即可判断出报文主体的准确性。



### Content-Range

![在这里插入图片描述](https://img-blog.csdnimg.cn/783e9758838646f48cff7d8625645b62.png)

```
Content-Range: bytes 5001-10000/10000
```

用于响应头中，在发出带Range的请求后，服务器会在Content-Range头部返回当前接受的范围和文件总大小。



### Content-Type

```
Content-Type: text/html; charset=UTF-8
```

首部字段Content-Type说明了实体主体内对象的媒体类型。和首部字段Accept一样，字段值用type/subtype形式赋值。

**常用媒体类型：**

- application/xhtml+xml：XHTML格式
- application/xml：XML数据格式
- application/atom+xml：Atom XML聚合格式
- application/json：JSON数据格式
- application/pdf：pdf格式
- application/msword：word文档格式
- appllication/octet-stream：二进制流数据
- application/x-www-form-urlencoded：表单提交



### Expires

![在这里插入图片描述](https://img-blog.csdnimg.cn/a16dde277ff6470b8d1adf0498244474.png)

```
Expires: Wed, 04 Jul 2012 08:26:05 GMT
```

首部字段Expires会将资源失效的日期告知客户端。缓存服务器在接收到含有首部字段Expires的响应后，会以缓存来应答请求，在Expires字段值指定的时间之前，响应的副本会一直被保存。当超过指定的时间后，缓存服务器在请求发送过来时，会转向源服务器请求资源。

如果源服务器不希望缓存服务器对资源缓存时，最好在Expires字段内写入与首部字段Date相同的时间值。

当首部字段Cache-Control有指定max-age指令时，比起首部字段Expires，会优先处理max-age指令。



### Last-Modified

![在这里插入图片描述](https://img-blog.csdnimg.cn/6309be5ce9d04b57a8c7510313614a60.png)

```
Last-Modified: Wed, 23 May 2012 09:59:55 GMT
```

首部字段Last-Modified指明资源最终修改的时间。一般来说，这个值就是Request-URI指定资源被修改的时间。



## Cookie相关的首部字段

Cookie的工作机制是用户识别及状态管理。

调用Cookie时，由于可校验Cookie的有效期，以及发送方的域、路径、协议等信息，所以正规发布的Cookie内的数据不会因来自其他Web站点和攻击者的攻击而泄露。

**Cookie相关的首部字段：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/4263b783822d456983d9d707a6a424e7.png)

### Set-Cookie

当服务器准备开始管理客户端的状态时，会事先告知各种信息。

**Set-Cookie字段的属性：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/b21a3d1d1ae44cd1a6d488cefcc0bf07.png)

```
Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31 GMT; path=/; domain=.hackr.jp;
```

**expires属性**

Cookie的expires属性指定浏览器可发送Cookie的有效期。

当省略expires属性时，其有效期仅限于维持浏览器会话（Session）时间段内。这通常限于浏览器应用程序被关闭之前。

另外，一旦Cookie从服务器端发送至客户端，服务器端就不存在可以显式删除Cookie的方法。但可通过覆盖已过期的Cookie，实现对客户端Cookie的实质性删除操作。

**path属性**

Cookie的path属性可用于限制指定Cookie的发送范围的文件目录。不过另有办法可避开这项限制，看来对其作为安全机制的效果不能抱有期待。

**domain属性**

通过Cookie的domain属性指定的域名可做到与结尾匹配一致。比如，当指定example.com后，除example.com以外，www.example.com或www2.example.com等都可以发送Cookie。

因此，除了针对具体指定的多个域名发送Cookie之外，不指定domain属性显得更安全。

**secure属性**

Cookie的secure属性用于限制Web页面仅在HTTPS安全连接时，才可以发送Cookie。

```
Set-Cookie: name=value; secure
```

**HttpOnly属性**

Cookie的HttpOnly属性是Cookie的扩展功能，它使JavaScript脚本无法获得Cookie。其主要目的为防止跨站脚本攻击（Cross-site scripting,XSS）对Cookie的信息窃取。

```
Set-Cookie: name=value; HttpOnly
```



### Cookie

```
Cookie: status=enable
```

首部字段Cookie会告知服务器，当客户端想获得HTTP状态管理支持时，就会在请求中包含从服务器接收到的Cookie。接收到多个Cookie时，同样可以以多个Cookie形式发送。

