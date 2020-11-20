---
title: 【Webpack】Webpack学习笔记之基础
date: 2020-5-28
sidebar: auto
categories: 
- webpack
tags: 
- webpack
---

# Webpack学习笔记之基础

## 1.初识webpack

+ webpack默认配置文件：`webpack.config.js`可以通过 `webpack --config 文件名` 指定配置文件。

+ webapck配置组成：

  ```js
  module.exports = {
      entry: './src/index.js', ................. 打包的入口文件（默认'./src/index.js'）
      output: './dist/main.js',..................打包的输出文件（默认'./dist/main.js'）
      mode: 'production',........................环境（开发、生产）
      module: {
      	rules: [...............................Loader配置文件
      		{test: /\.txt$/, use: 'raw-loader'}
      	]
  	},
      plugins: [.................................插件配置
          new HtmlwebpackPlugin({
              template: './src/index.html'
          })
      ]
  }
  ```

  

## 2.安装webpack

+ 先安装`nodejs`和`nvm`(下载或配置node版本)

+ 全局安装webpack

  ```sh
  npm install webpack webpack-cli --savee-dev -g
  
  webpack -v
  ```

+ 创建文件

  ```sh
  mkdir webpack-demo
  cd webpack-demo
  ```

+ 初始化

  ```sh
  npm init -y
  npm install webpack webpack-cli --savee-dev
  ```

## 3.小试牛刀

`webpack.config.js`

```js
'use strict';

const path = require('path');

module.exports = {
    mode: 'production',
    entry: '.src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
};
```

`package.json`

```json
{
  "name": "webpeck-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^4.0.0-beta.2"
  }
}
```

定义`index.js`，安装依赖之后，执行命令``npm run build`之后会在`src/bundle.js`中生成打包之后的js文件。
