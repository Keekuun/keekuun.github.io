---
title: 【Node】NodeJS之设置Cookie和Session
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
- Cookie
---

# NodeJS之设置Cookie和Session

## 1.Cookie概念

http是一个无状态的协议，cookie就是一种浏览器管理状态的一个文件，它有name，也有value，第一次访问网站的时候，浏览器发出请求，服务器响应请求后，会将cookie放入到响应请求中，在浏览器第二次发请求的时候，会把cookie带过去，服务端会辨别用户身份，当然服务器也可以修改cookie内容。

```js
//读取浏览器中的cookie
console.log(document.cookie);
//写入cookie
document.cookie='myname=laihuamin;path=/;domain=.baidu.com';
```



> [把cookie聊清楚](https://juejin.im/post/59d1f59bf265da06700b0934)

## 2.Session概念

Cookie机制弥补了HTTP协议无状态的不足。在Session出现之前，基本上所有的网站都采用Cookie来跟踪会话。

与Cookie不同的是，session是以服务端保存状态的。通过cookie将sessionId保存在cookie中，浏览器下次请求携带这个cookie（也就是seeeionId）,这样服务器通过sessionId就可以获取用户相应的信息了。即：

+ 如果已包含这个sessionId，则说明以前已经为此客户端创建过session，服务器就按照sessionId把这个session检索出来使用（如果检索不到，可能会新建一个），获取用户信息。

+ 如果客户端请求不包含sessionId，则为此客户端创建一个session并且生成一个与此session相关联的sessionId

> [你真的了解 Cookie 和 Session 吗]()

## 3.NodeJS操作cookie

### 3.1 espress框架操作cookie

前提是使用cookie-parser中间件，后面会介绍。

+ `res.cookie(name, value [, options])`：

    | options属性 | 类型              | 描述                                                         |
    | ----------- | ----------------- | ------------------------------------------------------------ |
    | `domain`    | String            | cookie的域名。默认为应用程序的域名。                         |
    | `encode`    | Function          | 为cookie设置编码的同步函数。默认为`encodeURIComponent`。     |
    | `expires`   | Date              | cookie的有效期(以GMT表示)。如果未指定或设置为0，则创建session cookie。 |
    | `httpOnly`  | Boolean           | 将cookie标记为只能由web服务器访问。                          |
    | `maxAge`    | Number            | 设置cookie有效时长（ms）。                                   |
    | `path`      | String            | cookie的路径，默认 '/'                                       |
    | `secure`    | Boolean           | 将cookie设置为仅用于HTTPS。                                  |
    | `signed`    | Boolean           | 指示是否应该对cookie进行签名。                               |
    | `sameSite`  | Boolean or String | **Set-Cookie** 属性`SameSite`的值. 更多：https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1. |

    ```js
    // 设置cookie
    res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

    // 清空cookie
    res.clearCookie('name', { path: '/admin' })

    // 设置多个cookie
    res
      .status(201)
      .cookie('access_token', 'Bearer ' + token, {
        expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
      })
      .cookie('test', 'test')
      .redirect(301, '/admin')
    ```
    
    > [express4x框架res.cookie](https://www.expressjs.com.cn/4x/api.html#res.cookie)
    
    
    
+ `req.cookies`：

    ```js
    req.cookies.name
    ```

    > [express4x框架req.cookies](https://www.expressjs.com.cn/4x/api.html#req.cookies)

### 3.2 前提是使用cookie-parser中间件

```sh
# 安装
npm i cookie-parser
```

```js
var express = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
// 挂载cookie-parser
app.use(cookieParser())
 
app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
 
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})
 
app.listen(8080)
 
// curl command that sends an HTTP request with two cookies
// curl http://127.0.0.1:8080 --cookie "Cho=Kim;Greet=Hello"
```

## 4.NodeJS设置session

### 4.1 安装express-session

```sh
npm install express-session
```



### 4.2 使用express-session

```js
var session = require('express-session')
var express = require('express')

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.get('/', function(req, res) {
    if(req.session.login) {
       res.send('欢迎光临：' + req.session.username);
    } else {
        res.send('你还未登陆');
    }
});

app.get('/login', function(req, res) {
    // 设置session
    req.session.login = true;
    req.session.username = 'haha';
    res.send('你已经成功登陆')；
});
```

