---
title: 记录一次修复Axios报错导致nuxt服务栈溢出的问题
date: 2023-03-09
categories:
- 前端
tags:
- bug
---

[[toc]]

# 1.项目背景
+ node: 16.6
+ nuxt: 2.15.8
+ axios: 0.18.0

项目是一个基于nuxt2的SSR项目，本地run正常，线上部署报错

# 2.问题描述
报错console：
```
cross-env NODE_ENV=production node server/index.js
....
Cannot stringify a function httpAdapter
Cannot stringify a function transform Request
Cannot stringify a function transform Request
Cannot stringify a function validateStatus
Cannot stringify arbitrary no-POJOs Writable

ERROR Maximum call stack size exceeded

at String.replace(<annoymous>)
at stringfyPrimitive(node_modules/@nuxt/devalue/dist/devalue.js 193:16)
at stringfy(node_modules/@nuxt/devalue/dist/devalue.js 80:14)
at node_modules/@nuxt/devalue/dist/devalue.js 116:71
...

```

# 3.排查过程
+ 1.注意到`ERROR Maximum call stack size exceeded`,因为本地build跑起来没问题，误认为是生产环境node运行内存不够导致的
使用 `process.memoryUsage()`查看运行内存，打算使用[`node --max-old-space-size=10240 index.js`](https://nodejs.cn/api/cli/max_old_space_size_size_in_megabytes.html) 来增加运行内存解决问题。

显然，这个方式无法解决问题，就算临时可以解决，服务能运行一段时间，最终还是会爆栈。

+ 2.继续查看报错日记：

`Cannot stringify a function httpAdapter`这个应该是罪魁祸首，报错的地方`at stringfyPrimitive(node_modules/@nuxt/devalue/dist/devalue.js 193:16)`，
但是我们仍然没法判断是什么引发的，只能初步判断与http请求相关，发现axios封装代码：

> 由于是接手的项目，这些代码一般都不会主动去做修改~~

```js
function request(url, options, extendsOptions) {
  // ...
    return axios(url, option, extendsOptions)
      .then((data) => {
        return data
      })
      .catch((err) => {
      // 此处直接reject,没有错误记录（坑）
        return Promise.reject(err)
      })
}
```
加一些console
```js
function request(url, options, extendsOptions) {
  // ...
    return axios(url, option, extendsOptions)
      .then((data) => {
        return data
      })
      .catch((err) => {
        // 先打印，简单排查
        console.error('axios error：', err)
        return Promise.reject(err)
      })
}
```

再次部署上去，获取到了关键的日志：
```yaml
    axios error: write EPROTO 139888620882736:error:1408F10B:SSL routines:ssl3_get_record:wrong version number:../deps/openssl/openssl/ssl/record/ssl3_record.c:331
```

# 4.问题原因

+ 1.由于后端有接口没有支持`https`,而项目`baseurl`配置的是`https`,就造成了这个问题。
+ 2.axios报错信息未做日志记录，项目虽然接入了sentry,但是这里的错误信息并没有捕获到
+ 3.axios的这个错误导致了nuxt服务的崩溃，nuxt健壮性。。。
>
> `try catch`和`window.onerror`是无法捕捉`Promise`错误的（因为是异步）
而当 `Promise` 被 `reject` 且没有 `reject` 处理器的时候，会触发 `unhandledrejection` 事件
当 `Promise` 被 `reject` 且有 `reject` 处理器的时候，会触发 `rejectionhandled` 事件。
Sentry这边只收集没有被reject的错误即`window.unhandledrejection`

# 5.按图索骥
既然，`nuxt`使用`axios`报错了，项目也是使用`catch`去捕获处理了，那么按理说`nuxt`服务应该成功运行啊，为什么会爆栈呢？

于是，去github查看nuxt的[httpadapter](https://github.com/nuxt/nuxt/issues?q=httpadapter) 相关issue还很多，着实惊出一身冷汗！

最后在这个issue[nuxt.js+axios SSR Parse Error](https://github.com/nuxt/nuxt/issues/1842) 看到官方的建议：


> We highly recommend to use [axios official nuxt module](https://github.com/nuxt-community/axios-module) since it prevents some security issue when working with session.
Also, from your error, your API is sending back to you the HPE_INVALID_HEADER_TOKEN error.

# 6.最佳实践
+ `axios`报错日志补充
+ *sentry监控错误,是否需要主动上报
+ **使用官方nuxt axios替换**[https://github.com/nuxt-community/axios-module](https://github.com/nuxt-community/axios-module)
