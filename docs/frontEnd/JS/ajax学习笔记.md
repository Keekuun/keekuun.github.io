---
title: 【Ajax】Ajax学习笔记
date: 2019-10-9
sidebar: auto
isComment: true
categories: 
- 前端
tags: 
- JS
- Ajax
---

# Ajax学习笔记

## Ajax简介

### 1. Ajax是什么？

Ajax : Asynochronous javascript and xml,即异步的js和xml。能利用js异步访问服务器，获取服务器的数据（XML，JSON等）。

### 2.异步交互和同步交互

+ 同步：网页发送第一个请求，需要等待服务器响应结束，才能法第二个请求，并且刷新的是整个页面！表现为“卡顿”。
+ 异步：网页发送第一个请求，无需等待服务器响应结束，就能发送第二个请求，并且刷新局部页面！表现为“顺滑”。

### 3.Ajax的优缺点

+ 优点：
  + 异步交互，增强了用户体验。
  + 提升性能，服务器不在需要响应整个页面，只需响应部分内容，服务器压力降低了。
+ 缺点：
  + ajax不能应用在所有的场景。
  + ajax有可能无端的增多了对服务器的访问次数，给服务器带来压力。

### 4.Ajax发送异步请求

+ 获取XMLHttpRequest对象

  ```js
  // 绝大部分浏览器
  var xmlHttpRequest = new XMLHttpRequest();
  // IE6
  var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
  // IE5.5及以下
  var xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  ```

+ 封装获取XMLHttpRequest函数

  ```js
  function createXMLHttpRequest() {
      try {
          // 主流浏览器
          return new XMLHttpRequest();
      }catch (e) {
          try {
              // IE6
              return new ActiveXObject("Msxml2.XMLHTTP");
          } catch(e) {
              try {
                  // IE5.5及以下
                  return new ActiveXObject("Microsoft.XMLHTTP");
              } catch (e) {
                  // 未知
                  throw e;
              }
          }
      }
  }
  ```

+ XMLHttpRequest连接服务器

  ```js
  var xmlHttp = createXMLHttpRequest();
  // xmlHttp.open(Method, url, boolean)
  xmlHttp.open("GET", "https://docs.zkkysqs.top");
  ```

  `xmlHttp.open(Method, url, true/false)`参数说明：

  	1. method：请求方法，可以是`GET`或`POST`。
   	2. url： 请求地址，服务器资源url。
   	3. boolean：是否异步，true-异步，false-同步。

+ XMLHttpRequest发送请求

  ```js
  xmlHttp.send(params);
  ```

  `xmlHttp.send(params)`方法的参数就是请求体内容，如果是`GET`请求（没有请求体），建议给`null`，否则浏览器（如firefox）可能发送失败。

+ XMLHttpRequest获取响应

  ```js
  xmlHttp.onReadystatechange = function() {
      // 双重判断：判断状态以及状态码
      if(xmlHttp.readyState === 4 && xml.Http.status === 200) {
          var text = xmlHttp.responseText;
      }
  }
  ```

  `xmlHttp.readyState`共有5个状态：

  | xmlHttp状态编号 | 含义                                                         |
  | :-------------: | ------------------------------------------------------------ |
  |        0        | 请求对象被创建,但未初始化,即open方法未调用                   |
  |        1        | 装载中,open方法已调用,send方法未调用                         |
  |        2        | 已装载,send方法已调用,但还未获得Header信息                   |
  |        3        | 交互中,已获取了部分信息,这时调用responseText将得到不完整信息,会返回错误 |
  |        4        | 所有数据已接收完成,可用responseText或responseBody得到完整数据 |

  > [MDN XMLHttpRequest ](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
  >
  > [MDN HTTP响应码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

+ 发送GET请求

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>发送GET请求</title>
  </head>
  <body>
  <button id="btn">点击</button>
  </body>
  </html>
  ```

  ```js
   // DOM加载完毕
      window.onload = function () {
          let btn = document.querySelector("#btn");
          // 监听点击事件
          btn.onclick = function () {
              // 获取XMLhTTPRequest对象
              let xmlHttp = creatXMLhTTPRequest();
              // 连接360服务器，异步方式
              xmlHttp.open("GET", "localhost:5000/hello", true);
              // 发送请求，GET请求没有请求体，但最好给出null，不然浏览器（Firefox）可能会出错
              xmlHttp.send(null);
              // 监听xmlHttp状态，荡状态发生变化时执行
              xmlHttp.onreadystatechange = function() {
                  // 双重判断：判断xmlhttp状态为4（服务响应结束）以及服务器响应的状态码为200（响应成功）
                  if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
                      // 获取响应结果
                      let text = xmlHttp.responseText;
                      console.log(text);
                  }
              }
          }
      };
  ```

  > **注意**：url地址必须同源（如果两个页面的协议，端口（如果有指定）和主机都相同，则两个页面具有相同的**源**），否则是跨域请求会失败。
  >
  > [MDN 浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

+ 发送POST请求

  ```js
  ... 同GET方式 
  xmlHttp.open("POST", url , true);
  // 设置请求头
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // 发送请求，POST请求指定请求体
  xmlHttp.send("user=zkk&password=123");
   // 监听xmlHttp状态，荡状态发生变化时执行
  xmlHttp.onreadystatechange = function() {
      ... 同GET方式 
  }
  ```

+ 响应内容为xml

  服务端：设置响应头：ContentType="text/xml;charset=utf-8";

  客户端：`let xml = xmlHttp.responseXML`获取XML DOM对象

+ 封装原生Ajax方法

  ```js
   	/**
       * 封装原生ajax
       * @param: options={method:, url:, async:, params:, callback:, type:}
       * method:string 请求方式POST/GET
       * url:string 请求地址
       * async:boolean 是否异步，true/false
       * params:请求参数（体）
       * type:string 数据类型
       * callback:function 回调函数
       * */
      function ajax(options) {
          // 创建XMLhTTPRequest对象
          function creatXMLhTTPRequest() {
              try {
                  // 主流浏览器
                  return new XMLHttpRequest();
              } catch (e) {
                  try {
                      // IE6
                      return new ActiveXObject("Msxml2.XMLHTTP");
                  } catch (e) {
                      try {
                          // IE5.5及以下
                          return new ActiveXObject("Microsoft.XMLHTTP");
                      } catch (e) {
                          // 未知
                          throw(e);
                      }
                  }
              }
          }
  
          var xmlHttp = creatXMLhTTPRequest();
          if (!options.method) { // 默认GET
              options.method = "GET"
          }
          if (options.async == undefined) { //默认异步
              options.async = true;
          }
          // 连接服务
          xmlHttp(options.method, options.url, options.async);
          // 设置请求头
          if ("POST" === method) {
              xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          }
          // 发送请求
          xmlHttp.send(options.params);
          // 监听状态
          xmlHttp.onreadystatechange = function () {
              // 双重判断：判断xmlhttp状态为4（服务响应结束）以及服务器响应的状态码为200（响应成功）
              if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                  // 获取服务器响应数据，进行转换
                  var data;
                  if (!options.type) { // 默认"text"
                      data = xmlHttp.responseText;
                  } else {
                      switch (options.type) {
                          case "xml":
                              data = xmlHttp.responseXML;
                              break;
                          case "text":
                              data = xmlHttp.responseText;
                              break;
                          case "json":
                              data = eval("(" + xmlHttp.responseText + ")");
                              break;
                      }
                  }
                  // 调用回调
                  options.callback(data);
              }
          }
      }
  
  
  //使用
  ajax({
      method: "POST",
      url: "www.xxxx.com",
      type:"json",
      async: true,
      callback: function(data) {
          // 获取请求数据
      }
  })
  ```

