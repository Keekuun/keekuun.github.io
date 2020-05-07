---
title: 【Node】NodeJS之HelloWorld
date: 2019-8-26
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之HelloWorld

## NodeJS安装

略，详见[nodejs官网网](https://nodejs.org/en/)

## Hello NodeJS

```js
// 导入http模块
var http = require("http");
// 创建服务器
var server = http.createServer(function(req, res) {
    // 设置http头部
    res.writeHead(200, {"Content-type": "text/html;charset=UTF-8"});
    res.end("Hello NodeJS");
})
// 运行服务器
server.listen(6666);
console.log("server is running at http://localhost:6666");
```

## NodeJS没有web容器的概念

NodeJS没有根目录的概念，它没有任何的web容器。它通过**路由匹配**，将对应的资源返回给客户端。

index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>hello node</title>
  <link rel="stylesheet" href="./hahaha.css">
  <style>
    div {
      width: 200px;
      height: 200px;
      background: bisque;
    }
  </style>
</head>
<body>
<div></div>
</body>
</html>
```

index.css

```css
body {
  padding: 20px;
  border: 1px dashed darkorange;
}
```

```js
// 导入http模块
var http = require('http');
var fs = require('fs');
// 创建服务器
var server = http.createServer(function (req, res) {
    if(req.url === '/index') {
        fs.readFile('./index.html', function(err, data) {
            res.writeHead(200, { 'Content-type': 'text/html;charset=UTF-8' });
            res.end(data);
        });
    } else if(req.url === '/hahaha.css') {
        fs.readFile('./index.css', function(err, data) {
            // 更换content-type
            res.writeHead(200, { 'Content-type': 'text/css;charset=UTF-8' });
            res.end(data);
        });
    };
});
// 运行服务器
server.listen(7777);
console.log('server is running at http://localhost:7777/index');
```

URL和真实文件是没有关系的，URL是通过了Node的顶层路由设计，呈递某一个静态文件的。