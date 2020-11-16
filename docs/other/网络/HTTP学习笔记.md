# HTTP学习笔记
![HTTP](https://upload-images.jianshu.io/upload_images/16584865-6da1237e47a3ba2b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 1. web与网络基础

### 1.1使用HTTP协议访问Web

客户端（client, 浏览器browser）通过url访问服务器（server），服务器把指定资源（resource）传递给客户端，从而显示web页面。这一过程，web使用了一种名为HTTP（HyperText Transfer Protocol，超文本传输（转移）协议）的协议作为约定（规范），完成从客户端到服务器等一系列的信息交互。即，web是建立在HTTP协议上的通信。

### 1.2 HTTP的历史

HTTP协议的出现主要是为了解决文本传输的难题。随着HTTP的发展，HTTP协议已经超出了WEB这个框架的局限，被运用到了各种场景里。

+ HTTP/0.9，HTTP于1990年问世，还未作为正式的标准。HTTP/0.9表示HTTP/1.0之前的版本。

+ HTTP/1.0，HTTP于1996年5月正式作为标准,版本被命名为HTTP/1.0，并记载于RFC1945。

  ```
  RFC1945 - Hyperyext Transfer Protocol --HTTP/1.0
  ```

+ HTTP/1.1，目前主流的HTTP协议版本，于1997年1月发布，最初标准RFC2068，修订版RFC2616（最新版本）。

  ```markdown
  RFC2618 - Hyperyext Transfer Protocol --HTTP/1.1
  ```

+ HTTP/2.0， 2014年11月实现标准化

  > [掌握 HTTP2.0](http://jartto.wang/2018/03/30/grasp-http2-0/)
  >
  > [HTTP2.0的那些事](https://segmentfault.com/a/1190000004399183)
  >
  > [MDN HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

### 1.3 TCP/IP协议

HTTP协议是建立在TCP/IP上的，要想更好地理解HTTP，我们需要先了解TCP/IP。

+ TCP/IP协议族：计算机与网络设备相互通信，双方必须基于某一种规则，否则就会乱套。这一规则，就是协议（protocol），如：IP协议、FTP协议、UDP协议等等。

  狭义上，TCP/IP是指TCP和IP这两种协议。广义上，TCP/IP是在IP协议的通信过程中，使用到的协议族的统称。

+ TCP/IP分层：应用层、传输层、网络层和网络接口层。

  | TCP/IP协议族层 | 作用                                                         | 举例           |
  | -------------- | ------------------------------------------------------------ | -------------- |
  | 应用层         | 向用户提供应用服务时的通信活动                               | FTP、HTTP、DNS |
  | 传输层         | 提供处于网络连接中的两台计算机之间的数据传输                 | TCP、UDP       |
  | 网络层         | 处理在网络上流动的**数据包**（网络传输的最小数据单位），确认传输路线 | IP             |
  | 网络接口层     | 处理链接网络的硬件部分                                       |                |

  > [网络7层协议，4层，5层？](https://blog.csdn.net/cc1949/article/details/79063439)

+ TCP/IP通信传输流

  发送端在曾与层之间传输数据时，每经过一层时会加上该层所属的首部信息。反之，接收端在曾与层传输数据时，每经过一层时都会把对应的首部信息去掉。
![TCP/IP通信传输流](https://upload-images.jianshu.io/upload_images/16584865-a427899a837e683a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 1.4 IP、TCP和DNS
#### 1.4.1.负责传输的IP协议

按层次分，IP（Internet Protocol）网际协议位于网络层。IP协议的作用是根据IP地址（节点被分配到的地址，可以改变）和MAC地址（Media Access Control Address，网卡所属的固定地址，基本不会变）把数据包准确地传递给目标。

+ 使用ARP协议凭借MAC地址进行通信

一般通信双方不在同一个局域网（LAN）下，通常会经过许多中转设备才能连接到对方。在中转时，会借助下一站中转设备的MAC地址来搜索下一个中转目标，这一过程会采用ARP协议（Address Resolution Protocol）。

ARP是一种用以解析地址的协议，根据通信方的IP地址就可以反查出对应的MAC地址。

#### 1.4.2.确保可靠性的TCP协议

按层次分，TCP位于传输层，提供可靠的字节流服务（Byte System Service，将大块数据分割以报文段segment为单位的数据包进行管理）。TCP协议为了更容易传输大数据将数据分割，且TCP协议能够确认数据最终是否送达对方。

那么，TCP怎么确保数据能够送达目标呢？

+ TCP三次握手（TCP建立连接的过程）：

  为了准确无误地将数据送达目标，TCP协议采用三次握手（three-way handshaking）策略。

  握手过程中使用了TCP标志：SYN（synchronize）和ACK（ackonwledgement）。

  + 第一次握手：发送端发送一个带SYN标志的数据包给接收端。
  + 第二次握手：接收端收到这个SYN数据包之后，回传一个带有SYN/ACK标志的数据包以示传达确认信息。
  + 第三次握手：发送端收到SYN/ACK标志的数据包之后，再次回传一个带ACK标志的数据包。至此，“三次握手”结束。

若在握手过程中某个阶段莫名中断，TCP协议会再次以相同的顺序发送相同的数据包。

当然，除了上述三次握手，TCP协议还有其他各种手断来保证通信的可靠信。
![TCP三次握手](https://upload-images.jianshu.io/upload_images/16584865-66459582c3b55505.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1.5 负责域名解析的DNS服务

DNS（Domain Name System）服务是和HTTP协议一样位于应用层的协议。提供域名到IP地址之间的解析服务。IP地址（如：196.168.0.1）由一组纯数字组成，不便于记忆，用户一般使用主机名或域名（字母和数字组合，便于记忆和识别）来访问目标计算机。

但是计算机只认识IP地址，它不认识主机名或域名，于是DNS服务应运而生。DNS协议提供通过域名查找IP地址，或逆向从IP地址反查域名的服务。

### 1.6 各种协议与HTTP协议的关系

思考：[在浏览器输入url，按下回车的过程，经历了什么？]((https://mp.weixin.qq.com/s/3_DZKSP492uq9RfQ3eW4_A))

![浏览器输入url并按下回车的过程](https://upload-images.jianshu.io/upload_images/16584865-2c48b4aac3d4afd8.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 1.7 URI和URL

URL（Uniform Resource Locator，统一资源定位符）。URL 正是使用Web 浏览器等访问。Web 页面时需要输入的网页地址。

URL（Uniform Resource Identifier）统一资源标识符。由某个协议方案表示的资源的定位标识符。协议方案是指访问资源所使用的协议类型名称（比如，采用HTTP协议时，协议方案就是http）。

URI 用字符串标识某一互联网资源，而URL 表示资源的地点（互
联网上所处的位置）。可见URL 是URI 的子集。

![URI的格式](https://upload-images.jianshu.io/upload_images/16584865-f4ee12fbb396f281.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. HTTP协议

### 2.1 HTTP协议用于客户端和IP服务器端之间的通信。

+ 通过请求（request）和响应（response）的交换达成通信。

![HTTP请求与响应](https://upload-images.jianshu.io/upload_images/16584865-5796ad7e7528ec35.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


+ 请求报文：请求方法 + 请求URI + 协议版本 + 可选的请求首部字段 + 内容实体
![HTTP请求报文的构成](https://upload-images.jianshu.io/upload_images/16584865-73e3c1f32113b5f2.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


+ 响应报文：协议版本 + 状态码（表示请求成功或失败的数字代码） + 用以解释状态码的字符串 + 可选的响应首部字段 + 实体主体
![HTTP响应报文的构成](https://upload-images.jianshu.io/upload_images/16584865-2d780ef0eb95990a.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2.2 HTTP协议是无状态协议（stateless）

+ HTTP 协议自身不对请求和响应之间的通信状态进行保存。使用HTTP 协议，每当有新的请求发送时，就会有对应的新响应产生。协议本身并不保留之前一切的请求或响应报文的信息。
+ HTTP/1.1 虽然是无状态协议，但为了实现期望的保持状态功能，于是引入了Cookie 技术。有了Cookie 再用HTTP 协议通信，就可以管理状态了。

### 2.3  HTTP 协议使用URI 定位互联网上的资源

![HTTP协议使用URI定位资源](https://upload-images.jianshu.io/upload_images/16584865-07c01dbbd1001717.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


当客户端请求访问资源而发送请求时，URI 需要将作为请求报文中的请求URI 包含在内。除此之外，如果不是访问特定资源而是对服务器本身发起请求，可以用一个* 来代替请求URI。

```markdown
GET http://hackr.jp/index.htm HTTP/1.1

OPTIONS * HTTP/1.1
```

### 2.5　HTTP 方法

HTTP/1.1 中可使用的方法，如：GET、POST、PUT等。如：REST（REpresentational State Transfer，表征状态转移）标准。

| HTTP 方法 | 意图                   |
| --------- | ---------------------- |
| GET       | 获取资源               |
| POST      | 传输实体主体           |
| PUT       | 传输文件               |
| HEAD      | 获得报文首部           |
| DELETE    | 删除文件               |
| OPTIONS   | 询问支持的方法         |
| TRACE     | 追踪路径               |
| CONNECT   | 要求用隧道协议连接代理 |

### 2.6  持久连接和管线化

+ 持久连接（keep-alive）：保持TCP连接状态

  HTTP 协议的初始版本中，每进行一次HTTP 通信就要断开一次TCP 连接，性能地下，增加开销，浪费资源。为解决上述TCP 连接的问题，HTTP/1.1 和一部分的HTTP/1.0 想出了持久连接（HTTP Persistent Connections，也称为HTTP keep-alive 或HTTP connection reuse）的方法。持久连接的特点是，只要任意一端没有明确提出断开连接，则保持TCP 连接状态。

+ 管线化（pipelining）：可以连续发送请求

  持久连接使得多数请求以管线化（pipelining）方式发送成为可能。从前发送请求后需等待并收到响应，才能发送下一个请求。管线化技术出现后，不用等待响应亦可直接发送下一个请求。

### 2.7   Cookie技术实现状态管理

HTTP 是无状态协议，它不对之前发生过的请求和响应的状态进行管理。也就是说，无法根据之前的状态进行本次的请求处理。

无状态协议有它的优点，由于不必保存状态，自然可减少服务器的CPU 及内存资源的消耗。

保留无状态协议这个特征的同时又要解决类似的矛盾问题，于是引入了Cookie 技术。Cookie 技术通过在请求和响应报文中写入Cookie 信息来控制客户端的状态。

Cookie 会根据从服务器端发送的响应报文内的一个叫做**Set-Cookie**的首部字段信息，通知客户端保存Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入Cookie 值后发送出去。

①请求报文（没有Cookie 信息的状态）

```
GET /reader/ HTTP/1.1
Host: hackr.jp
*首部字段内没有Cookie的相关信息
```

②响应报文（服务器端生成Cookie 信息）

```
HTTP/1.1 200 OK
Date: Thu, 12 Jul 2012 07:12:20 GMT
Server: Apache
＜Set-Cookie: sid=1342077140226724; path=/; expires=Wed,
10-Oct-12 07:12:20 GMT＞
Content-Type: text/plain; charset=UTF-8
```

③请求报文（自动发送保存着的Cookie 信息）

```
GET /image/ HTTP/1.1
Host: hackr.jp
Cookie: sid=1342077140226724
```

服务器端发现客户端发送过来的Cookie 后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。

## 3. HTTP报文信息

### 3.1 HTTP报文

+ HTTP 报文： 用于HTTP 协议交互的信息被称为HTTP 报文。由多行（用CR+LF 作换行符）数据构成的字符串文本。

+ 请求报文：请求端（客户端）的HTTP 报文叫做请求报文。

  请求报文实例：

  ```
  GET / HTTP/1.1		请求行
  				   各种首部字段
  Host: hackr.jp		
  User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
  Accept-Language: ja,en-us;q=0.7,en;q=0.3
  Accept-Encoding: gzip, deflate
  DNT: 1
  Connection: keep-alive
  Pragma: no-cache
  Cache-Control: no-cache
  
  空行（CR＋LF）
  ```

  

+ 响应报文：响应端（服务器端）的叫做响应报文。

  响应报文实例：

  ```
  HTTP/1.1 200 OK		状态行
  				   各种首部字段
  Date: Fri, 13 Jul 2012 02:45:26 GMT
  Server: Apache
  Last-Modified: Fri, 31 Aug 2007 02:02:20 GMT
  ETag: "45bae1-16a-46d776ac"
  Accept-Ranges: bytes
  Content-Length: 362
  Connection: close
  Content-Type: text/html
  
  空行（CR＋LF）
  				  报文主体
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>hackr.jp</title>
  </head>
  <body>
  <img src="hackr.gif" alt="hackr.jp" width="240" height="84" />
  </body>
  </html>
  ```

  - 请求行：包含用于请求的方法，请求URI 和HTTP 版本。
  - 状态行：
    包含表明响应结果的状态码，原因短语和HTTP 版本。
  - 首部字段：包含表示请求和响应的各种条件和属性的各类首部。一般有4 种首部，分别是：通用首部、请求首部、响应首部和实体
    首部。
  - 其他：可能包含HTTP 的RFC 里未定义的首部（Cookie 等）

### 3.2  编码提升传输速率

+ 报文（ message）：是HTTP 通信中的基本单位，由8 位组字节流（octet sequence，其中octet 为8 个比特）组成，通过HTTP 通信传输。
+ 实体（ entity）：作为请求或响应的有效载荷数据（补充项）被传输，其内容由实
  体首部和实体主体组成。

HTTP 报文的主体用于传输请求或响应的实体主体。通常，报文主体等于实体主体。只有当传输中进行编码操作时，实体主体的内容发生变化，才导致它和报文主体产生差异。

+ 内容编码：内容编码指明应用在实体内容上的编码格式，并保持实体信息原样压缩。内容编码后的实体由客户端接收并负责解码。如：gzip（GNU zip）、compress（UNIX系统的标准压缩）、deflate（zlib）、identity（不进行编码）。

+ 分块传输编码（Chunked Transfer Coding）：在传输大容量数据时，通过把数据分割
  成多块，能够让浏览器逐步显示页面。

### 3.3  发送多种数据的多部分对象集合 

+ 多部分对象集合：发送的一份**报文主体**内可含有多类型实体。
  - `multipart/form-data`：在Web 表单文件上传时使用。如：`Content-Type: multipart/form-data; boundary=AaB03x`
  -  `multipart/byteranges`：状态码206（Partial Content，部分内容）响应报文包含了多个范围的内容时使用。

在HTTP 报文中使用多部分对象集合时，需要在**首部字段**里加上`Content-type`。

### 3.4  获取部分内容的范围请求

指定范围发送的请求叫做范围请求（Range Request）。即可以只请求部分内容。

执行范围请求时，会用到**首部字段**`Range` 来指定资源的byte 范围。例如：对一份10 000 字节大小的资源，如果使用范围请求，可以只请求5001~10 000 字节内的资源。

```
Range: bytes=5001-10000
```

### 3.4  内容协商返回最合适的内容

内容协商机制是指客户端和服务器端就响应的资源内容进行交涉，然后提供给客户端最为适合的资源。内容协商会以响应资源的语言、字符集、编码方式等作为判断的基准。

涉及的首部字段有：`Accept`、`Accept-Charset`、`Accept-Encoding`、`Accept-Language`、`Content-Language`

### 3.5 小结

通过HTTP报文，我们可以：

+ 分辨出响应报文或者请求报文

+ 查看HTTP协议版本、URI、响应状态、cookie

+ 数据传输过程编码、压缩、分块

+ 传输各种数据类型（MIME）的数据

+ 请求我们想要的资源（内容协商、范围请求）

  

## 4. HTTP响应状态代码(Response Status Codes)

状态码的职责是当客户端向服务器端发送请求时，描述返回的请求结果，告知客户端响应成功或失败的信息。

响应分为五类：信息响应(`100`–`199`)，成功响应(`200`–`299`)，重定向(`300`–`399`)，客户端错误(`400`–`499`)和服务器错误 (`500`–`599`)

> 查看这里：[MDN HTTP响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

## 5. HTTP首部(Header)

HTTP 协议的请求和响应报文中必定包含HTTP 首部。首部内容为客户端和服务器分别处理请求和响应提供所需要的信息。

HTTP 请求报文由方法、URI、HTTP 版本、HTTP 首部字段等部分构成。

HTTP 响应报文由HTTP 版本、状态码（数字和原因短语）、HTTP 首部字段3 部分构成。

> 首部字段查看这里:[MDN HTTP首部](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)

## 6. HTTPS协议

### 6.1 HTTP协议的存在的问题

+ 通信使用明文（不加密），内容可能会被窃听
+ 不验证通信方的身份，因此有可能遭遇伪装
+ 无法证明报文的完整性，所以有可能已遭篡改

### 6.2 HTTP+ 加密+ 认证+ 完整性保护=HTTPS

HTTP 协议中没有加密机制，但可以通过和SSL（Secure Socket Layer，安全套接层）或TLS（Transport Layer Security，安全层传输协议）的组合使用，加密HTTP 的通信内容。

SSL 不仅提供加密处理，而且还使用了一种被称为证书的手段，可用于确定方。

与SSL 组合使用的HTTP 被称为HTTPS（HTTP Secure，超文本传输安全协议）或HTTP over SSL。

![HTTP与HTTPS](https://upload-images.jianshu.io/upload_images/16584865-1904fa7dabd44793.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


HTTPS 并非是应用层的一种新协议。只是HTTP 通信接口部分用SSL（Secure Socket Layer）和TLS（Transport Layer Security）协议代替而已。

### 6.3 HTTPS安全通信过程
![HTTPS通信过程](https://upload-images.jianshu.io/upload_images/16584865-22316e00e3313aea.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

+ 1.客户端通过发送 Client Hello 报文开始 SSL 通信。报文中包含客户端支持的 SSL 的指定版本、加密组件(Cipher Suite)列表(所使用的加密算法及密钥长度等)

+ 2.服务器可进行 SSL 通信时，会以 Server Hello 报文作为应答。和客户端一样，在报文中包含 SSL 版本以及加密组件。服务器的加密组件内容是从接收 到的客户端加密组件内筛选出来的。

+ 3.之后服务器发送 Certificate 报文。报文中包含公开密钥证书。

+ 4.最后服务器发送 Server Hello Done 报文通知客户端，最初阶段的 SSL 握手协商部分结束。

+ 5.SSL 第一次握手结束之后，客户端以 Client Key Exchange 报文作为回应。报文中包含通信加密中使用的一种被称为 Pre-master secret 的随机密码串。该 报文已用步骤 3 中的公开密钥进行加密。

+ 6.接着客户端继续发送 Change Cipher Spec 报文。该报文会提示服务器，在此报文之后的通信会采用 Pre-master secret 密钥加密。

+ 7.客户端发送 Finished 报文。该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判定标准。

+ 8.服务器同样发送 Change Cipher Spec 报文。

+ 9.服务器同样发送 Finished 报文。

+ 10.服务器和客户端的 Finished 报文交换完毕之后，SSL 连接就算建立完成。当然，通信会受到 SSL 的保护。从此处开始进行应用层协议的通信，即发 送 HTTP 请求。

+ 11.应用层协议通信，即发送 HTTP 响应。

+ 12.最后由客户端断开连接。断开连接时，发送 close_notify 报文。

### 6.4 HTTPS的缺点

既然HTTPS 那么安全可靠，那为何所有的Web 网站不一直使用HTTPS ？

+ 消耗资源：由于HTTPS还需要做服务器、客户端双方加密及解密处理，因此会消耗CPU和内存等硬件资源。
+ 速度慢：由于大量消耗CPU及内存等资源，导致处理速度变慢。和使用HTTP 相比，HTTPS多了SSL通信以及加密和解密运算，将更多地消耗服务器和客户端的硬件资源，导致负载增强。（可以使用SSL 加速器分担负载来改善）
+ 增加成本：购买证书需要开销。

因此，如果是非敏感信息则使用HTTP 通信，只有在包含个人信息等敏感数据时，才利用HTTPS 加密通信。

## 7. HTTP认证

某些Web 页面只想让特定的人浏览，或者干脆仅本人可见。为达到这个目标，必不可少的就是认证功能。

### 7.1 认证方式

日常认证方式有：

+ 密码：只有本人才会知道的字符串信息。
+ 动态令牌：仅限本人持有的设备内显示的一次性密码。
+ 数字证书：仅限本人（终端）持有的信息。
+ 生物认证： 指纹和虹膜等本人的生理信息。
+ IC卡等：仅限本人持有的信息。

HTTP认证方式：

+ BASIC认证（基本认证）：HTTP/1.0 定义的认证方式
+ DIGEST认证（摘要认证）：HTTP/1.1 定义的认证方式
+ SSL客户端认证（成本大）：借由HTTPS 的客户端证书完成认证的方式。
+ FormBase认证（基于表单认证）：Web 网站的认证多半为基于表单认证

由于使用上的便利性及安全性问题，HTTP 协议标准提供的BASIC认证和DIGEST 认证几乎不怎么使用。另外，SSL 客户端认证虽然具有高度的安全等级，但因为导入及维持费用等问题，还尚未普及。目前，Web 网站的认证大都为基于表单认证。

### 7.2 Session 管理及Cookie 应用

基于表单认证本身是通过服务器端的Web 应用，将客户端发送过来的用户ID 和密码与之前注册过（登陆过）的信息做匹配来进行认证的。

但鉴于HTTP 是无状态协议，之前已认证成功的用户状态无法通过协议层面保存下来，即，无法实现状态管理。于是我们会使用Cookie 来管理Session，以弥补HTTP 协议中不存在的状态管理功能。
![二次登陆下：Session和Cookie](https://upload-images.jianshu.io/upload_images/16584865-194b432782e57feb.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


+ 1.客户端把用户ID 和密码等登录信息放入报文的实体部分，通常是以POST 方法把请求发送给服务器。而这时，会使用HTTPS 通信来进行HTML 表单画面的显示和用户输入数据的发送。
+ 2.服务器会发放用以识别用户的Session ID。通过验证从客户端发送过来的登录信息进行身份认证，然后把用户的认证状态与Session ID 绑定后记录在服务器端。向客户端返回响应时，会在首部字段Set-Cookie 内写入Session ID（如PHPSESSID=028a8c…）。
+ 3.客户端接收到从服务器端发来的Session ID 后，会将其作为Cookie 保存在本地。下次向服务器发送请求时，浏览器会自动发送Cookie，所以Session ID 也随之发送到服务器。服务器端可通过验证接收到的Session ID 识别用户和其认证状态。

> [彻底理解cookie，session，token](https://www.cnblogs.com/moyand/p/9047978.html)

## 8. WEB安全简析

### 8.1 针对Web 的攻击技术

+ 以服务器为目标的主动攻击,如：
  + SQL注入
  + OS命令注入

+ 以服务器为目标的被动攻击

### 8.2 因输出值转义不完全引发的安全漏洞

#### 8.2.1.XSS跨站脚本攻击: 

跨站脚本攻击（Cross-Site ScriptingXSS）是指通过存在安全漏洞的Web 网站注册用户的浏览器内运行非法的HTML 标签或JavaScript进行的一种攻击。

跨站脚本攻击有可能造成以下影响:

+ 利用虚假输入表单骗取用户个人信息。
+ 利 用脚本窃取用户的Cookie值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
+ 显示伪造的文章或图片。

XSS 是攻击者利用预先设置的陷阱触发的被动攻击。分类：
+ 反射型XSS：
  + XSS攻击代码非持久性，也就是没有保存在web server中，而是出现在URL地址中。
  + 非持久性，那么攻击方式就不同了。一般是攻击者通过邮件，聊天软件等等方式发送攻击URL，然后用户点击来达到攻击的。
+ 持久型XSS：
  + XSS攻击代码存储于web server上。
  +  攻击者，一般是通过网站的留言、评论、博客、日志等等功能(所有能够向web server输入内容的地方)，将攻击代码存储到web server上的

  **XSS防御的总体思路是：对输入(和URL参数)进行过滤（白名单和黑名单），对输出进行编码（HTML实体字符）**。

#### 8.2.2.SQL 注入攻击:

SQL 注入（SQL Injection）是指针对Web 应用使用的数据库，通过运行非法的SQL 而产生的攻击。

```sql
SELECT * FROM User WHERE userName = '张三 '-- and flag = 1; (-- 后面被注释了)
```

SQL 注入攻击有可能会造成以下等影响：

+ 非法查看或篡改数据库内的数据
+ 规避认证
+ 执行和数据库服务器业务关联的程序等

#### 8.2.3  OS 命令注入攻击

OS 命令注入攻击（OS Command Injection）是指通过Web 应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell 函数的地方就有存在被攻击的风险。

#### 8.2.4 HTTP 首部注入攻击

HTTP 首部注入攻击（HTTP Header Injection）是指攻击者通过在响应首部字段内插入换行，添加任意响应首部或主体的一种攻击。属于被动攻击模式。

HTTP 首部注入攻击有可能会造成以下一些影响：

+ 设置任何Cookie信息
+ 重定向至任意URL
+ 显示任意的主体（HTTP响应截断攻击）

#### 8.2.5 针对措施

+ 客户端的验证
+ Web应用端（服务器端）的验证
  + 输入值验证
  + 输出值转义

### 8.3  因会话管理疏忽引发的安全漏洞

#### 8.3.1 会话劫持

会话劫持（Session Hijack）是指攻击者通过某种手段拿到了用户的会话ID，并非法使用此会话ID 伪装成用户，达到攻击的目的。

下面列举了几种攻击者可获得会话ID 的途径：

+ 通过非正规的生成方法推测会话ID
+ 通过窃听或XSS攻击盗取会话ID
+ 通过会话固定攻击（Session Fixation）强行获取会话ID

### 8.3.2 会话固定攻击

对以窃取目标会话ID 为主动攻击手段的会话劫持而言，会话固定攻击（Session Fixation）攻击会强制用户使用攻击者指定的会话ID，属于被动攻击。

### 8.3.3  跨站点请求伪造CSRF

跨站点请求伪造（Cross-Site Request Forgeries，CSRF）攻击是指攻击者通过设置好的陷阱，强制对已完成认证的用户进行非预期的个人信息或设定信息等某些状态更新，属于被动攻击。

跨站点请求伪造有可能会造成以下等影响：

+ 利用已通过认证的用户权限更新设定信息等
+ 利用已通过认证的用户权限购买商品
+ 利用已通过认证的用户权限在留言板上发表言论

### 8.4 其他安全漏洞

+ 密码破解（穷举法、字典攻击）

+ 点击劫持：指利用透明的按钮或链接做成陷阱，覆盖在Web 页面之上。

+ 后门程序： 开发设置的隐藏入口

+ DoS攻击： 

  DoS 攻击（Denial of Service attack）是一种让运行中的服务呈停止状态的攻击。有时也叫做服务停止攻击或拒绝服务攻击。DoS 攻击的对象不仅限于Web 网站，还包括网络设备及服务器等。
  
  主要有以下两种DoS 攻击方式：
  + 集中利用访问请求造成资源过载，资源用尽的同时，实际上服务也就呈停止状态。
  + 通过攻击安全漏洞使服务停止。
