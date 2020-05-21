---
title: 【Node】Express web 开发框架学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---
# Express web 开发框架
## Express web 开发框架简介
[Express](http://expressjs.com) 是一个简洁而灵活的 node.js Web应用框架, 提供一系列强大特性帮助你创建各种Web应用。
> [Express英文官网](http://www.expressjs.com.cn)
> [Express中文官网](http://expressjs.com)

## Express web 开发框架特点
1. 实现了路由功能。
2. 中间件功能。
3. 对request和response对象的扩展。
4. 可以继承其他模板引擎。

## Express web 开发框架基本使用
1. 安装
	```
	创建目录
	$ mkdir myapp
	$ cd myapp

	初始化package.json
	$ npm init
	安装 express 框架
	$ npm install express --save （保存到依赖列表）
	$ npm install express --no-save （临时安装，不添加到依赖中）
	```
2. 应用
	```js
	// 加载 expres 模块
	const express = require('express');
	// 创建一个 app 对象
	const app = express();
	// 通过中间件监听指定的路由
	app.get('/', (req, res) => {
		res.send('hello world!世界，你好！');
		// res.end('hello world!世界，你好！')
	});
	// 启动服务，监听8088端口
	app.listen(8088, () => {
		console.log('http://localhost:8088');
	})
	```
	
3. `res.end`和`res.send`的区别
	+ 接受参数
		- `res.end`只能接受 `String` 和 `Buffer` 两种类型；
		- `res.send`能接受各种类型，如 `string`、`buffer`、`json`、`array`、`object`等；
	+ 响应报文头
		- `res.end` 不会默认设置 `content-type`，（会出现中文乱码）
		- `res.send` 默认生成更多的响应报文头，包括`content-type`（不会出现中文乱码）
	
4. `app.get` 、 `app.use` 和 `app.all` 注册路由的区别
	+ 请求方法
		- `app.get`请求方法必须是`GET`;
		
		- `app.use`和`app.all`请求方式不限，什么请求方法都可以;
		
		  ```js
	  // http://127.0.0.1:3000/admin/aa/bb/cc/dd
		  app.use('admin', function(req, res) {
		      res.write(req.originalUrl + '\n'); // /admin/aa/bb/cc/dd
		      res.write(req.baseUrl + '\n'); // /admin
		      res.write(req.path + '\n'); // /aa/bb/cc/dd
		      res.end();
		  })
		  ```
		
		  
	+ 路由匹配
		- `app.get`和`app.all`请求路径的 `pathname`必须全等于（===）;
		- `app.use`请求的路径中的第一部分与路由匹配即可，并不要求 `pathname`完全匹配。
	
5. 获取`path`和`query`路由参数
	```js
	// 获取 path 参数;GET /news/2019/8/1
	app.get('/news/:year/:month/:day', (req, res) => {
	res.send(req.params);
	});
	
	// 获取 query参数；GET /news?year=2019&month=8&day=1
	app.get('/news', (req, res) => {
	res.send(req.params);
	})
	```
> tips：路径规则支持正则表达式
6. 小结
+ `req.query`: 获取 `query`参数；
+ `req.params`: 获取`path`参数；
+ `req.body`: 获取请求体（body）
+ `req.param('key')`: 处理get和post请求，但查找优先级由高到低为req.params--->req.body--->req.query

## Express web 开发框架更多应用
1. Express处理静态资源
	```js
	const express = require('express');
	const path = require('path');

	const app = express();

	// 处理静态资源的方法
	const static = express.static(path.join(__dirname, 'static'));
	app.use('/', static);
	app.use('/xxx', static);
	app.use('/www', static);

	app.listen(6666, () => {
	console.log('http://localhost:6666');
	});
	```
2. res常用的对象方法
+ res.json([body]) 发送 json response （等价于res.sen(json)）
	```js
	res.json(null);
	res.json({user: 'zkk'});
	res.status(404).json({error: 'not found!'});
	```
+ res.redirect([status,]path) 重定向
	```js
	res.redirect('/foo/bar'); // 状态码默认302
	res.redirect(301, 'https://www.baidu.com')
	````
+ res.sendFile(path[,options][,fn]) 发送文件
	```js
	res.sendFile(path.join(__dirname, 'static', 'avator.jpg'), (err) => {
		if (err) {
				throw err;
		}
		console.log('OK');
	});
	```
+ res.status(code).end(message) 设置响应码

## Express web 开发框架模块化开发实战
1. app.js模块负责启动服务
	```js
	// 1.加载模块
	const express= require('express');
	// 加载config配置模块
	const config = require('./config.js');
	// 加载router路由模块
	const router = require('./router.js');

	// 2.创建 app 对象
	app = express();

	// 3.注册路由
	app.use(router); // 默认路径'/'
	// app.use('/', router);

	// 4.启动服务
	app.listen(config.port,() => {
			console.log('Server is listening at http://localhost:'+config.port);
	});
	```
2. router.js 负责处理路由
	```js
	// 1.创建一个 router 对象
	const express = require('express');
	const router = express.Router();
	// 加载handler业务处理模块
	const handler = require('./handler.js');

	// 2.router对象挂载路由
	router.get('/', handler.home);
	router.get('/index', handler.index);
	router.get('/submit', handler.submit);
	router.get('/details', handler.details);
	...

	// 3.暴露 router 对象
	module.exports = router;
	```
3. config.js 负责存储配置信息
	```js
	module.exports = {
			port: 8080
			...
	};
	```
4. handler.js 负责处理业务
	```js
	const path = require('path');
	module.exports.index = (req, res) => {
			res.send('index 页面欢迎你！');
	};
	module.exports.home = (req, res) => {
			res.send('home 页面欢迎你！');
	};
	...
	...
	```
5. 项目目录结构
```
|-app
|	|--node_modules
|	|--package.json
|	|--static
|	|	|--images
|	|	|--css
|	|	|--data
|	|--views
|	|	|--home.html
|	|	|--details.html
|	|	|--...
|	|--app.js
|	|--router.js
|	|--handler.js
|	|--config.js
```