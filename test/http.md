```
tcp 三次握手

client  ---> SYN=1,seq=x            service

            <---- SYN=1 ack=x+1, ACK=1, seq=y

            -----> ack=y+1 ACK=1


tcp 四次挥手

      FIN_WAIT_1  client ----> FIN=1,seq=x   service

      FIN_WAIT_2              <-----ACK=1,ack=x+1
                    <------FIN=1,seq=y

      TIME_WAIT              -------> ACK=y, ack=y+1

      CLOSED

HTTPS

ssl/tls  私钥 -- 服务器    共钥 --- 公开

对称加密：加解密用相同的密钥
非对称加密：网站保管私钥，分发公钥给用户，公要加密登录，私钥解密，


HTTP                HTTP(应用层)
                    SSL(传输层)


TCP                 TCP(传输层)

IP                  IP（网络层）


服务端 ---》 第三方机构 --- 》数字证书

客户端 --- 服务端 请求数字证书

服务端 ---》数字证书 ---》客户端

客户端 ---》 数字证书 ----》 第三方机构验证




客户端 --- https流程 ---》服务端

《-------数字证书
----》验证数字证书 ---》session key



http0.9 get

http1.0 get post head
expires

http1.1
keek-alive pipline
options put patch delete trace connect
OPTIONS针对跨域资源的预检
catch-control:
public
private: 代理不可以
no-cache:
no-store:
max-age:

last-modified/ if-modified-since
etag/if-none-match

http2
二进制分帧
头部压缩 多路复用 服务器推送


http3:
UDP是无连接;
QUIC是一种通用传输协议，与TCP非常相似
QUIC实际上就是在UDP基础上重写了TCP的功能，但是又比TCP更加智能，更高效的实现了TCP的核心功能。QUIC 来保证数据的顺序、完整性和正确性
HTTP3用在物联网、大数据和VR等方面。
基于udp QUIC


HTTP2   HTTP3
TLS     TLS
        QUIC
TCP     UDP
```

cors ACCESS-CONTROL-ALLOW-ORIGIN


websocket 2008
长连接，会话一直保持
基于tcp
html5
Upgrade: websocket
Connection: Upgrade

readyState:
CONNECTING：值为0，表示正在连接。
OPEN：值为1，表示连接成功，可以通信了。
CLOSING：值为2，表示连接正在关闭。
CLOSED：值为3，表示连接已经关闭，或者打开连接失败。


301 切换域名
302

网络安全

iframe
a、如何让自己的网站不被其他网站的 iframe 引用？
```
if(top.location != self.location){
    top.location.href = 'http://www.baidu.com'
}
```
<a target="_blank" href="" rel="noopener noreferrer nofollow">

csrf跨站请求伪造
a -->login ---> later cookie ---> b

token
验证码
Referer校验


xss植入js,获取cookie

输入过滤转义
加密
httponly
csp白名单


SQL注入

点击劫持



CSS

css盒模型

ie: content = width + padding + border box-sizing: border-box
standard: content = width box-sizing: content-box

外边距合并： 只有普通文档流中块框的  垂直外边距  才会发生  外边距合并 。行内框、浮动框或绝对定位之间的外边距不会合并。
BFC:

root
display: inline-block table-cell table-caption
position: absolute fixed
overflow: 不为visible
float: 不为none


flex:

container属性：

flex-direction: row | column | row-reverse | column-reverse
flex-wrap: wrap | nowrap | wrap-reverse
flex-flow: <flex-direction> || <flex-wrap>

justify-content: flex-start | flex-end | center | space-between | space-around

align-items: flex-start | flex-end | center | baseline | stretch

align-content: flex-start | flex-end | center | space-between | space-around | stretch


items属性：
order: 1
flex-grow
flex-shrink:
flex-basis:
flex:
align-self


js
web worker
service worker: Service Worker 首先是一个运行在后台的 Worker 线程，然后它会长期运行，充当一个服务，很适合那些不需要网页或用户互动的功能
IntersectionObserver

SSE: SSE 与 WebSocket 作用相似，都是建立浏览器与服务器之间的通信渠道，然后服务器向浏览器推送信息。
https://www.bookstack.cn/read/webapi-tutorial/spilt.3.docs-server-sent-events.md
SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立协议。
SSE 属于轻量级，使用简单；WebSocket 协议相对复杂。
SSE 默认支持断线重连，WebSocket 需要自己实现断线重连。
SSE 一般只用来传送文本，二进制数据需要编码后传送，WebSocket 默认支持传送二进制数据。
SSE 支持自定义发送的消息类型。

fetch

文件上传
断点续传
多文件上传

大文件上传

前端上传大文件时使用 Blob.prototype.slice 将文件切片，并发上传多个切片，最后发送一个合并的请求通知服务端合并切片
服务端接收切片并存储，收到合并请求后使用流将切片合并到最终文件
原生 XMLHttpRequest 的 upload.onprogress 对切片上传进度的监听
使用 Vue 计算属性根据每个切片的进度算出整个文件的上传进度

断点续传

使用 spark-md5 根据文件内容算出文件 hash
通过 hash 可以判断服务端是否已经上传该文件，从而直接提示用户上传成功（秒传）
通过 XMLHttpRequest 的 abort 方法暂停切片的上传
上传前服务端返回已经上传的切片名，前端跳过这些切片的上传

Blob.prototype.slice 创建多个切片

nodejs 的 读写流（readStream/writeStream）

```
pwa: Progressive Web Apps

manifest.json
<link rel="manifest" href="manifest.json" />
<script>
  if (navigator.serviceWorker != null) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('Registered events at scope: ', registration.scope);
    });
  }
</script>

```

```
继承

1.原型链继承
function parent() {}

function child() {}

child.prototype = new parent

child1 = new child()
child2 = new child()

缺点：多个实例共享同一个原型对象
```
