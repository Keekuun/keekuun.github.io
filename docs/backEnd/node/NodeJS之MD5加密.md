---
title: 【Node】NodeJS之MD5加密
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
- 加密
---

# NodeJS之MD5加密

> [Nodejs进阶：MD5入门介绍及crypto模块的应用](https://juejin.im/post/58fc1f925c497d0058fc3015)

## 1.MD5加密特点

+ MD加密是函数型加密。每次加密的结果一定相同，没有随机位。
+ 不论加密的内容多长多短，永远都是32位英文字母、数字混合
+ 仅仅改一个字符，密文都会大变。
+ MD5没有反解密函数破解的可能，所谓的破解MD5工具，都是通过字典的模式（穷举法），通过大量列举明-密对应的字典，找到明码

MD5常用来做版本校验。可以比对两个软件、文件是否完全一致。

## 2. NodeJS使用MD5加密

node中自带模块`crypto`可以用来MD5加密：

```js
const crypto = require('crypto');
crypto.createHash(algorithm); // 算法：'sha256'、 'sha512'、'md5'等

const md5 = crypto.createHash('md5');
const pwd = md5.update('123456').digest('base64');
```

由于MD5没有解密函数，当用户注册之后密码通过加密保存进数据库。当用户再次登陆输入密码之后，我们需要对用户提交的密码再次进行加密，然后与数据库中的加密之后的密码进行比对，从而判断出用户密码是否输入正确。

