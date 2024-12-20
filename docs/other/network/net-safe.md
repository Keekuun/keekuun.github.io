---
title: 网络和安全
date: 2019-10-20
sidebar: auto
categories: 
- 网络和安全
tags:
- 网络和安全
---

:::tip
+ XSS（Cross Site Scripting）跨站脚本攻击
+ CSRF（Cross Site Request Forgy）跨站请求伪造
+ 点击劫持
+ HTTP
+ HTTPS
+ WebSocket
:::

## 1.防御XSS攻击

+ HttpOnly 防止劫取 Cookie 验证码

+ 用户的输入检查 输入内容长度控制

+ 服务端的输出检查

+ CSP（`Content Security Policy`）内容安全策略：用于指定哪些内容可执行
 > HTTP 响应头Content-Security-Policy允许站点管理者控制用户代理能够为指定的页面加载哪些资源。除了少数例外情况，设置的政策主要涉及指定服务器的源和脚本结束点。这将帮助防止跨站脚本攻击（Cross-Site Script）（XSS）。

meta tag禁用不安全的内联/动态执行, 只允许通过 https加载这些资源 (images, fonts, scripts, etc.)
`meta http-equiv="Content-Security-Policy" content="default-src https:"`
```html
//我们可以在http响应头中设置Content-Security-Policy
//图片可以从任何地方加载(注意 "*" 通配符)
//多媒体文件仅允许从 media1.com 和 media2.com 加载(不允许从这些站点的子域名)
//可运行脚本仅允许来自于userscripts.example.com
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com

<!--同时meta中也支持设置Content-Security-Policy-->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

## 2.防御CSRF攻击
CSRF的发生有几个特点，**b站发送的请求带着a站的cookie信息； b站发送请求不经过a站的前端；http请求头中的referer为b站**。

+ 禁止第三方网站携带本网站的cookie信息：设置same-site属性，same-site属性有两个值，Strict（所有的第三方请求都不能携带本网站的cookie）和Lax（链接可以，但是form表单提交和ajax请求不行）

+ 本网站前端页面添加验证信息：使用**验证码**或者添加**token验证**

+ referer验证：禁止来自第三方的请求

## 3、点击劫持

原理：第三方网站通过iframe内嵌某一个网站，并且将iframe设置为透明不可见，将其覆盖在其他经过伪装的DOM上，伪装的可点击DOM（按钮等）与实际内嵌网站的可点击DOM位置相同，当用户点击伪装的DOM时，实际上点击的是iframe中内嵌的网页的DOM从而触发请求操作

特点：用户自己做了点击操作；用户毫不知情；

### iframe嵌套避免
+ 1.前端简单判断 `window.top !== window.self` 的时候那么你的网页就被iframe嵌套了,或者：
```js
<script>
if (top.location != window.location) {
    //如果不相等，说明使用了iframe，可进行相关的操作
}
</script>
```

但是这种方式并不是万能的，因为iframe标签中的属性sandbox属性是可以禁用内嵌网页的脚本的：
```html
<iframe sandbox='allow-forms' src='...'></iframe>
```

+ 2.The **X-Frame-Options** HTTP 响应头是用来给浏览器 指示允许一个页面 可否在 `frame`, `iframe`, `embed` 或者 `object` 中展现的标记。站点可以通过确保网站没有被嵌入到别人的站点里面，从而避免 **点击劫持** 攻击

设置http响应头 **X-Frame-Options**：有三个值 `DENY`（禁止内嵌） `SAMEORIGIN`（只允许同域名页面内嵌） `ALLOW-FROM`（指定可以内嵌的地址）

设置 meta 标签是无效的！例如 `meta http-equiv="X-Frame-Options" content="deny"` 没有任何效果。不要这样用！只有当像下面示例那样设置 HTTP 头 `X-Frame-Options` 才会生效。

+ 配置 **Apache** 在所有页面上发送 `X-Frame-Options` 响应头，需要把下面这行添加到 'site' 的配置中:_Header set X-Frame-Options "deny"_
+ 配置 **nginx** 发送 `X-Frame-Options` 响应头，把下面这行添加到 'http', 'server' 或者 'location' 的配置中*dd_header X-Frame-Options sameorigin always*;
+ 配置 **Express**

 ```js
 const helmet = require('helmet');
         const app = express();
         app.use(helmet.frameguard({ action: "sameorigin" }));
 ```

## HTTP
+ **HTTP1.0** 一次request 一次response 断开TCP 下次无法复用
+ **HTTP1.1** 长连接 `Connection: keep-alive` 一个TCP可以发送多个请求 头部阻塞
+ **HTTP2.0** 多路复用 在与HTTP/1.1语义完全兼容的基础上，进一步减少了网络延迟和传输的安全性，支持明文传输，消息头压缩，
    + 二进制分帧(在应用层http和传输层tcp/udp之间增加一个二进制分帧层，解决Http1.1性能限制，改进传输性能，实现低延迟和高吞吐量)
    + 头部压缩
    + 多路复用
      
## HTTPS
> [HTTP和HTTPS协议，看一篇就够了](https://blog.csdn.net/xiaoming100001/article/details/81109617)
基于HTTP协议，通过SSL或TLS提供加密处理数据、验证对方身份以及数据完整性保护。

通过抓包可以看到数据不是明文传输，而且HTTPS有如下特点：
+ 内容加密：采用混合加密技术，中间者无法直接查看明文内容
+ 验证身份：通过证书认证客户端访问的是自己的服务器
+ 保护数据完整性：防止传输的内容被中间人冒充或者篡改

## WebSocket
> [WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
>
WebSocket 是 HTML5(HTML5是指的一系列新的API，或者说新规范，新技术) 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。
```js
// 初始化一个 WebSocket 对象
var ws = new WebSocket('ws://localhost:9998/echo');

// 建立 web socket 连接成功触发事件
ws.onopen = function() {
  // 使用 send() 方法发送数据
  ws.send('发送数据');
  alert('数据发送中...');
};

// 接收服务端数据时触发事件
ws.onmessage = function(evt) {
  var received_msg = evt.data;
  alert('数据已接收...');
};

// 断开 web socket 连接成功触发事件
ws.onclose = function() {
  alert('连接已关闭...');
};
```

+ HTTP 和 WebSocket 有什么关系？

Websocket 其实是一个新协议，跟 HTTP 协议基本没有关系，只是为了兼容现有浏览器的握手规范而已，也就是说它是 HTTP 协议上的一种补充。

Websocket是基于HTTP协议的，或者说借用了HTTP的协议来完成一部分握手。

**上面说法不准确**，知乎大佬的答案：
> 作者：吴桐
> 链接：https://www.zhihu.com/question/20215561/answer/58593827
>
> 先说结论：“websocket出现是因为浏览器不给开后门”，“不是WebSocket基于HTTP，相反，可以看成可以看成可以看成HTTP基于WebSocket”。要理解为什么会出现HTTP，WebSocket，>
  可以做这样一个假设。假设平行宇宙1984年（我懒的查数据，所以就说一个平行宇宙了，随便看看吧），人们使用TCP协议进行通讯，假设那时候还没有网页浏览器这一说法，大家都是    通过各种软件直接通讯。假设到了1986年，人们使用浏览器来浏览网页，假设当时电脑时100MHz，100M内存。对TCP协议熟悉一点，大概也能猜到一个TCP链接，会消耗一点点内存，假设是32k（具体我也不知道），那么如果一台几万块钱的服务器最大能支持100M/32k＝3200个连接。显然，如果一个公司，面向全世界提供网页服务，如果使用TCP，最多也就3200个人同时看网页。于是服务器要求“所有客户端，打开网页之后，必须关闭TCP连接”。这就是（猜测的）HTTP的初衷了。按照这个协议，服务器接受TCP连接，几秒钟之内读取数据，检验之后，回复数据，断开连接。所谓的节省“资源”也没说明白到底节省了什么“资源”。等到二十年后，平行宇宙的2004年，QQ桌面版好好的，QQ网页版用的越来越多。由于浏览器都是连接之后很快断开，QQ网页版，只能靠各种polling方式持续交互数据（HTTP keep-alive也有自己的缺点，其他答主讲的很好），浪费大量的带宽（这时候带宽的费用就大了），同时客户端收到消息也不及时，还有各种其它问题。QQ网页版想直接用TCP协议长时间连接，但是QQ网页版能做的，都是浏览器允许做的。可以说，websocket的出现，就是因为浏览器不支持TCP直连，不给开后门。于是“希望所有的浏览器都能够直接进行TCP连接”，于是浏览器出现了websocket协议。所以，因为某些原因，人们在TCP上面弄了一个HTTP协议，把TCP支持的一些特性删除了，然后若干年之后想要那些被删除的特性，返回TCP，于是出现了WebSocket。WebSocket实际上可以看作HTTP的降级！“不是WebSocket基于HTTP，而是可以看成可以看成可以看成HTTP基于WebSocket”。具体协议细节其他答主讲的很好，就不重复了。包括从串口模拟出TCP，再模拟出HTTP，流接口变成块接口，都无所谓了。
>

> [前端安全-常见的攻击以及防御](https://www.cnblogs.com/zhiying/p/11018331.html)
>
> [XSS攻击常识及实战](https://blog.csdn.net/qq_37236745/article/details/83590663)
>
> [XSS跨站脚本攻击(一)----XSS攻击的三种类型](https://blog.csdn.net/u011781521/article/details/53894399?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-6.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-6.channel_param)
> 
>[XSS 和 CSRF简述及预防措施](https://www.cnblogs.com/yangsg/p/10621496.html#)
>
>[前端安全系列（一）：如何防止XSS攻击？](https://www.jianshu.com/p/2d9da4490ae1)
>
>[前端安全系列之二：如何防止CSRF攻击？](https://www.jianshu.com/p/205ae5a51fa1)
>
>[HTTP和HTTPS协议，看一篇就够了](https://blog.csdn.net/xiaoming100001/article/details/81109617)
>
>[WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
