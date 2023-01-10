---
title: 真香！vue-cli-service项目升级vite
sidebar: auto 
date: 2023-1-10 
isComment: true 
categories:
- Vue
- 前端 
tags:
- Vite
- Vue

---

# 真香！vue-cli-service项目升级vite

## ![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/095afad2-2fff-4dc5-88bb-9366d8abcf01.png)

## 1、项目概览

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/5db8b61f-f73a-435b-9c87-81afc4ab9429.png)

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/9261e685-febb-4297-b87c-6ddea0be312b.png)

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/aaf4306e-485c-4eb9-bbe1-fcd6c36c0081.png)

admin-web管理后台是我们业务的管理中心，开发、运营、产品等工作人员会频繁使用，是我们目前业务的核心配置中心，这个项目从建立之初一直更新迭代，迄今为止有**655**次commits,**681**
次CI，可见更新次数还是很频繁的。随着日积月累，代码量越来越多，vue单页面已经有了**100+** pages，**30+** vuecomponents，因此启动速度越来越慢。

## 2、vue-cli-service和vite启动速度对比

将vue-cli-service升级切换到vite之后启动速度得到了巨幅提升，下面是对比结果：

1.使用vue-cli-service serve启动：

* **平均耗时：15s**

* **最大耗时：40s**

* **最小耗时：10s**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/d2fc5dc7-3249-4dc6-b2b5-1acc21c8bebf.png)

2.使用vite启动：

* **平均耗时：2s**

* **最大耗时：5s**

* **最小耗时：1s**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/b9c8fa34-72b7-4e80-b817-4a714c01afdf.png)

**可见启动速度提升差不多10倍，平均每次启动节省约13s。**

**下面介绍项目改造过程：**

## 3、项目概览

### 1、目录结构

改造前的目录结构，使用`tree -aL 3 -I "node\_modules" > tree.txt`输出：

    .
    ├── .editorconfig
    ├── .env.development
    ├── .env.production
    ├── .env.staging
    ├── .eslintignore
    ├── .eslintrc.js
    ├── .git
    ├── .gitignore
    ├── .gitlab-ci.yml
    ├── .idea
    ├── .travis.yml
    ├── Dockerfile.prod
    ├── Dockerfile.test
    ├── LICENSE
    ├── README.md
    ├── babel.config.js
    ├── build
    ├── dist
    ├── docker-compose.yml
    ├── jest.config.js
    ├── jsconfig.json
    ├── mock
    ├── nginx.conf
    ├── package.json
    ├── plopfile.js
    ├── postcss.config.js
    ├── public
    │     ├── favicon.ico
    │     └── index.html
    ├── scripts
    │     └── notify.sh
    ├── src
    │     ├── App.vue
    │     ├── api
    │     │   ├── activity.js
    │     │   ├── config.js
    │...      ...
    │     ├── assets
    │     ├── components
    │     │   └── VideoPlay
    │     ├── directive
    │     ├── clipboard
    │     ├── el-drag-dialog
    │     ├── permission
    │     ├── filters
    │     ├── icons
    │     │     ├── index.js
    │     │     ├── svgo.yml
    │			│			└── svg # 多个svg图标
    │     │	      		├── 404.svg
    │...         			...
    │     │						└── zip.svg
    │     ├── layout
    │     ├── main.js
    │     ├── permission.js
    │     ├── router
    │     │     ├── activity.js
    │     │     ├── config.js
    │...         ...
    │     ├── settings.js
    │     ├── store
    │     │     ├── getters.js
    │     │     ├── index.js
    │			│			└── modules # 多个store
    │     │	      		├── app.js
    │...         			...
    │     │						└── user.js
    │     ├── store
    │     ├── styles
    │     ├── utils
    │     └── views
    │           ├── activity
    │...         ...
    │           └── withdrawal
    ├── vue.config.js
    └── yarn.lock

使用vite改造后的目录：

    .
    ├── .editorconfig
    ├── .env.development
    ├── .env.production
    ├── .env.staging
    ├── .eslintignore
    ├── .eslintrc.js
    ├── .git
    ├── .gitignore
    ├── .gitlab-ci.yml
    ├── .idea
    ├── .travis.yml
    ├── Dockerfile.prod
    ├── Dockerfile.test
    ├── LICENSE
    ├── README.md
    ├── babel.config.js
    ├── build
    ├── dist
    ├── docker-compose.yml
    ├── index.html  # 新增
    ├── jest.config.js
    ├── jsconfig.json
    ├── mock
    ├── nginx.conf
    ├── package.json
    ├── plopfile.js
    ├── postcss.config.js
    ├── public
    │     ├── favicon.ico
    │     └── index.html
    ├── scripts
    │     └── notify.sh
    ├── src
    │     ├── App.vue
    │     ├── api
    │     │   ├── activity.js
    │     │   ├── config.js
    │...      ...
    │     ├── assets
    │     ├── components
    │     │   └── VideoPlay
    │     ├── directive
    │     ├── clipboard
    │     ├── el-drag-dialog
    │     ├── permission
    │     ├── filters
    │     ├── icons
    │     │     ├── index.js
    │     │     ├── svgo.yml
    │			│			└── svg # 多个svg图标
    │     │	      		├── 404.svg
    │...         			...
    │     │						└── zip.svg
    │     ├── layout
    │     ├── main.js
    │     ├── permission.js
    │     ├── router
    │     │     ├── activity.js
    │     │     ├── config.js
    │...         ...
    │     ├── settings.js
    │     ├── store
    │     │     ├── getters.js
    │     │     ├── index.js
    │			│			└── modules # 多个store
    │     │	      		├── app.js
    │...         			...
    │     │						└── user.js
    │     ├── styles
    │     ├── utils
    │     └── views
    │           ├── activity
    │...         ...
    │           └── withdrawal
    ├── vite.config.js # 新增
    ├── vue.config.js
    └── yarn.lock

新增了两个文件：`vite.config.js`和`index.html`

### 2、node package包

改造前：package.json

```yaml
{
  "name": "admin-web",
  "version": "1.0.0",
  "description": "管理后台系统",
  "scripts": {
    "dev": "vue-cli-service serve",
    "lint": "eslint --ext .js,.vue src",
    "build:prod": "vue-cli-service build",
    "build:stage": "vue-cli-service build --mode staging",
    "preview": "node build/index.js --preview",
    "new": "plop",
    "svgo": "svgo -f src/icons/svg --config=src/icons/svgo.yml",
    "test:unit": "jest --clearCache && vue-cli-service test:unit",
    "test:ci": "npm run lint && npm run test:unit"
  },
  "dependencies": {
    "axios": "0.18.1",
    "clipboard": "2.0.4",
    "codemirror": "5.45.0",
    "core-js": "^3.6.5",
    "driver.js": "0.9.5",
    "dropzone": "5.5.1",
    "echarts": "4.2.1",
    "element-ui": "^2.15.7",
    "file-saver": "2.0.1",
    "fuse.js": "3.4.4",
    "js-cookie": "2.2.0",
    "jszip": "3.2.1",
    "md5": "2.2.1",
    "normalize.css": "7.0.0",
    "nprogress": "0.2.0",
    "path-to-regexp": "2.4.0",
    "screenfull": "4.2.0",
    "script-loader": "0.7.2",
    "sortablejs": "1.8.4",
    "tui-editor": "1.3.3",
    "v-viewer": "^1.6.4",
    "video.js": "^7.18.1", # 删除，使用cdn
    "videojs-contrib-hls": "^5.15.0",  # 删除，使用@videojs/http-streaming cdn代替
    "vue": "2.6.10",
    "vue-count-to": "1.0.13",
    "vue-router": "3.0.2",
    "vue-splitpane": "1.0.4",
    "vuedraggable": "2.20.0",
    "vuex": "3.1.0",
    "xlsx": "0.14.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "4.4.4",
    "@vue/cli-plugin-eslint": "4.4.4",
    "@vue/cli-plugin-unit-jest": "4.4.4",
    "@vue/cli-service": "4.4.4",
    "@vue/test-utils": "1.0.0-beta.29",
    "autoprefixer": "9.5.1",
    "babel-eslint": "10.1.0",
    "babel-jest": "23.6.0",
    "babel-plugin-dynamic-import-node": "2.3.3",
    "chalk": "2.4.2",
    "chokidar": "2.1.5",
    "connect": "3.6.6",
    "eslint": "6.7.2",
    "eslint-plugin-vue": "6.2.2",
    "html-webpack-plugin": "3.2.0",
    "husky": "1.3.1",
    "lint-staged": "8.1.5",
    "mockjs": "1.0.1-beta3",
    "plop": "2.3.0",
    "runjs": "4.3.2",
    "sass": "1.33.0",
    "sass-loader": "8.0.2",
    "script-ext-html-webpack-plugin": "2.1.3",
    "serve-static": "1.13.2",
    "svg-sprite-loader": "4.1.3",
    "svgo": "1.2.0",
    "vue-template-compiler": "2.6.10"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "engines": {
    "node": ">=8.9",
    "npm": ">= 3.0.0"
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

改造后：（**针对vue2项目使用vite2.x版本**）

```yaml
{
  "name": "admin-web",
  "version": "2.0.0",
  "description": "管理后台系统",
  "scripts": {
    "dev": "vue-cli-service serve",
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --ext .js,.vue src --fix",
    "build:prod": "vue-cli-service build",
    "build:stage": "vue-cli-service build --mode staging",
    "preview": "node build/index.js --preview",
    "new": "plop",
    "svgo": "svgo -f src/icons/svg --config=src/icons/svgo.yml",
    "test:unit": "jest --clearCache && vue-cli-service test:unit",
    "test:ci": "npm run lint && npm run test:unit",
    "dev-vite": "vite", # 新增
    "build-vite": "vite build",  # 新增
    "preview-vite": "vite preview"  # 新增
  },
  "dependencies": {
    "axios": "0.18.1",
    "clipboard": "2.0.4",
    "codemirror": "5.45.0",
    "core-js": "^3.6.5",
    "driver.js": "0.9.5",
    "dropzone": "5.5.1",
    "echarts": "4.2.1",
    "element-ui": "^2.15.7",
    "file-saver": "2.0.1",
    "fuse.js": "3.4.4",
    "js-cookie": "2.2.0",
    "jszip": "3.2.1",
    "md5": "2.2.1",
    "normalize.css": "7.0.0",
    "nprogress": "0.2.0",
    "path-browserify": "^1.0.1",
    "path-to-regexp": "2.4.0",
    "screenfull": "4.2.0",
    "script-loader": "0.7.2",
    "sortablejs": "1.8.4",
    "tui-editor": "1.3.3",
    "v-viewer": "^1.6.4",
    "vue": "2.6.10",
    "vue-count-to": "1.0.13",
    "vue-router": "3.0.2",
    "vue-splitpane": "1.0.4",
    "vuedraggable": "2.20.0",
    "vuex": "3.1.0",
    "xlsx": "0.14.1"
  },
  "devDependencies": {
    "@babel/plugin-syntax-jsx": "^7.18.6", # 新增
    "@originjs/vite-plugin-require-context": "^1.0.9", # 新增
    "@vue/babel-helper-vue-jsx-merge-props": "^1.4.0", # 新增
    "@vue/babel-preset-jsx": "^1.4.0", # 新增
    "@vue/cli-plugin-babel": "4.4.4",
    "@vue/cli-plugin-eslint": "4.4.4",
    "@vue/cli-plugin-unit-jest": "4.4.4",
    "@vue/cli-service": "4.4.4",
    "@vue/test-utils": "1.0.0-beta.29",
    "autoprefixer": "9.5.1",
    "babel-eslint": "10.1.0",
    "babel-jest": "23.6.0",
    "babel-plugin-dynamic-import-node": "2.3.3",
    "chalk": "2.4.2",
    "chokidar": "2.1.5",
    "connect": "3.6.6",
    "eslint": "6.7.2",
    "eslint-plugin-vue": "6.2.2",
    "html-webpack-plugin": "3.2.0",
    "husky": "1.3.1",
    "lint-staged": "8.1.5",
    "mockjs": "1.0.1-beta3",
    "plop": "2.3.0",
    "progress-bar-webpack-plugin": "^2.1.0", # 新增（可忽略）,查看vue-cli-service构建速度
    "runjs": "4.3.2",
    "sass": "1.33.0",
    "sass-loader": "8.0.2",
    "script-ext-html-webpack-plugin": "2.1.3",
    "serve-static": "1.13.2",
    "svg-sprite-loader": "4.1.3",
    "svgo": "1.2.0",
    "vite": "^2.9.15", # 新增
    "vite-plugin-commonjs": "^0.6.1", # 新增
    "vite-plugin-components": "^0.13.2", # 新增
    "vite-plugin-env-compatible": "^1.1.1", # 新增
    "vite-plugin-optimize-persist": "^0.1.2", # 新增
    "vite-plugin-package-config": "^0.1.1", # 新增
    "vite-plugin-svg-icons": "^2.0.1", # 新增
    "vite-plugin-vue2": "^2.0.3", # 新增
    "vue-template-compiler": "2.6.10"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "bugs": {
    "url": "https://github.com/PanJiaChen/vue-element-admin/issues"
  },
  "engines": {
    "node": ">=8.9",
    "npm": ">= 3.0.0"
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

### 3、入口文件index.html

1. 位置变换:

由 `root/public/index.html`到 `root/index.html`

2. 内容变化:

改造前：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  <title><%= webpackConfig.name %></title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
</body>
</html>
```

改造后：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="icon" href="/favicon.ico"/>
  <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
  <title>melon admin</title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
<script type="module" src="/src/main.js"></script>
<script src="https://unpkg.com/video.js/dist/video.js"></script>
<script src="https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js"></script>
</body>
</html>
```

## 4.新增vite配置文件

vite.config.js

```js
import {defineConfig} from 'vite'
import commonjs from 'vite-plugin-commonjs'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import viteComponents, {
  VuetifyResolver
} from 'vite-plugin-components'
import envCompatible from 'vite-plugin-env-compatible'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import {createVuePlugin} from 'vite-plugin-vue2'

import path from 'path'

// const { createVuePlugin } = require('vite-plugin-vue2')
// const path = require('path')
const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig({
    server: {
      host: '0.0.0.0',
      https: false,
      port: 8088,
      proxy: {
        '/melon.admin.s': {
          // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
          target: 'https://xxx.xxx.com', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
          // target: 'http://localhost:9000', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
          secure: false,
          changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
          ws: true //,       // 是否启用  websockets;
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: REPLACEMENT
        },
        {
          find: 'src/',
          replacement: REPLACEMENT
        },
        {
          find: /^~@\//,
          replacement: REPLACEMENT
        }
      ],
      extensions: ['.vue', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.css', '.scss']
    },
    plugins: [
      createVuePlugin({jsx: true}),
      viteComponents({
        customComponentResolvers: [
          VuetifyResolver()
        ]
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, './src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      commonjs(/* options */),
      ViteRequireContext(/* options */),
      envCompatible(),
      PkgConfig(),
      OptimizationPersist()
    ]
  }
)
```

> 至于为什么要这样配置，当然是一步步踩坑，填坑至此，说多了都是泪啊

## 5、切换vite问题汇总

### 1.页面显示：找不到此 localhost 页面

**需要把index.html从public文件夹移动到root目录下**

### 2.'URI malformed'报错,标题显示<%= webpackConfig.name %>

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
  <title><%= webpackConfig.name %></title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
</body>
</html>
```

**需要切换路径，**<%= webpackConfig.name %>和<%= BASE\_URL %>webpack能识别，vite识别不了，修改如下：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <!--    public下的文件使用路径即可-->
  <link rel="icon" href="/favicon.ico"/>
  <!--    标题直接配置在儿-->
  <title>admin web</title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
</body>
</html>
```

### 3.访问成功，单页面空白，控制台无任何信息

vite以esm的形式加载js文件，**需要手动引入**一下。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <!--    public下的文件使用路径即可-->
  <link rel="icon" href="/favicon.ico"/>
  <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
  <!--    标题直接配置在儿-->
  <title>melon admin</title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
<!--    以module的模式加载main.js-->
<script type="module" src="/src/main.js"></script>
</body>
</html>
```

> 如果继续空白，先把报错的代码注释掉，面向谷歌编程，一个个解决就完事了

### 4.vite无法识别alias路径

    [plugin:vite:import-analysis] Failed to resolve import "@/styles/index.scss" from "src\main.js". Does the file exist?

加载alias文件路径失败，**需要配置alias**,vite才能识别

```js
import {defineConfig} from 'vite'

import path from 'path'

const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: REPLACEMENT
      }
    ]
  }
})

```

### 5.vite无法自动查询文件后缀名，文件Not Found

    GET http://localhost:8089/src/layout net::ERR_ABORTED 404 (Not Found)
    
    import Layout from '/src/layout

直接导入某个目录下的index.js、index.css、index.json时可以省略具体的文件名，让webpack自动查找，vite无法识别，**需要配置****extensions**:

```js
import {defineConfig} from 'vite'

import path from 'path'

const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: REPLACEMENT
      }
    ],
    extensions: ['.vue', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.css', '.scss']
  }
})

```

### 6.vite识别不了 jsx， Uncaught ReferenceError: React is not defined

**需要配置jsx插件：**

```js
import {defineConfig} from 'vite'
import {createVuePlugin} from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [
    createVuePlugin({jsx: true}),
  ]
})

```

### 7.jsx语法未注明：\[plugin:vite-plugin-commonjs\] Unexpected token 

    if (icon) {
    19 |        if (icon.includes('el-icon')) {
    20 |          vnodes.push(<i class={[icon, 'sub-el-icon']} />)
       |                      ^
    21 |        } else {
    22 |          vnodes.push(<svg-icon icon-class={icon}/>)}

`<script>`标签下的js中包含jsx的语法**需要注明：`<script lang="jsx">`**

### 9.vite无法识别require: Uncaught ReferenceError: require is not defined

commonjs使用require来加载js，vite直接加载esm，vite无法识别require,解决方式有二：

1. **把commonjs的require方式改为esm的import方式**

2. **使用插件使vite支持require**:

```js
import {defineConfig} from 'vite'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    createVuePlugin({jsx: true}),
    commonjs(/* options */),
    // ...	...
  ]
})

```

**当然****module.exports****定义的js文件强烈建议修改为****export default****拥抱ESM吧**

### 8.动态加载require无法识别：Uncaught ReferenceError: require is not defined at index.js:8:22

1.store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
```

这里使用了webpack的requirecontext来读取store/modules目录下的多个store，否则需要一行行手动引入。

2.icons/index.js

```js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```

这里使用了webpack的requirecontext来读取icons/svg目录下的多个icon，否则需要一行行手动引入。

**1.解决方式一**：require.context相关代码删除，然后手动一个个引入`import testIcon from "./svg/test.svg"`，但是太过于繁琐，增加好多代码量。

**2.解决方式二：使用vite插件**`@originjs/vite-plugin-require-context`，让vite可以使用识别`require.context`

```js
import {defineConfig} from 'vite'
import ViteRequireContext from '@originjs/vite-plugin-require-context'

export default defineConfig({
  plugins: [
    createVuePlugin({jsx: true}),
    ViteRequireContext(/* options */)
    // ...	...
  ]
})
```

### 9.svgo图标无法显示

切换vite前，正常显示：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/d49a8fec-d6d3-431f-b08f-5eb329e3d849.png)

使用vite后图标不见了：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/f25ee98a-2f91-49f8-a7b3-86976f34e0f9.png)

这里是我解决`require`和`require.context`之后正常加载时的页面，这个两个问题如果没有解决的话，页面是直接进入不了的。所以前提是把这两个问题解决了才行。

打开控制台发现js并没有报错，只是svg没有成功显示的问题。

```html

<div data-v-4441ce11="">
  <div data-v-4441ce11="" class="el-tooltip icon-item" aria-describedby="el-tooltip-8235" tabindex="0">
    <svg data-v-c8a70580="" data-v-4441ce11="" aria-hidden="true" class="svg-icon disabled">
      <use data-v-c8a70580="" xlink:href="#icon-404"></use>
    </svg>
    <span data-v-4441ce11="">404</span>
  </div>
</div>
```

可以看到这里使用了[svg<use> - SVG: Scalable Vector Graphics | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)

搜索_svg:use vite，_找到解决方案[在vite中使用svg(vue) - 掘金 (juejin.cn)](https://juejin.cn/post/7036949769842851854)：

**借助vite插件`vite-plugin-svg-icons`使vite可以完美支持`svg:use`:**

```js
import {defineConfig} from 'vite'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

export default defineConfig({
    plugins: [
      createVuePlugin({jsx: true}),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, './src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      // ...	...
    ]
  }
)
```

### 10.vite无法识别scss变量导入

报错error和代码：

```markdown
    [plugin:vite:import-analysis] Cannot read properties of undefined (reading 'url')
    D:/work/gitlab/admin-web/src/styles/element-variables.scss
    
    import variables from '@/styles/element-variables.scss'
    @import "~element-ui/packages/theme-chalk/src/index";
```

**这里需要修改为\*.module.scss**[功能 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/features.html#css)

> 其实在解决这个问题之前，页面的主题配置还有一些和变量相关的样式都是混乱的，修复这个问题之后瞬间一片清明！！！

### 11.videojs报错导致Maximum call stack size exceeded

1.使用vite之后`videojs-contrib-hls`（用来播放m3u8视频的videojs插件）报错：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/3c878394-1820-43b6-b28d-ca4c4e47e5dd.png)

2.注释掉`videojs-contrib-hls`，只要打开引入了`videojs`组件的页面就卡住了：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/6d1b63c1-d29d-4a4b-a75b-c5e9898ec999.png)

3.然后我尝试使用CDN的方式引入，视频可以成功播放了，但是还是有error

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/f4a14d73-5288-4d86-b763-caf9141da1f4.png)

`index.html`增加cdn

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="icon" href="/favicon.ico"/>
  <!-- 新增 -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.21.1/alt/video-js-cdn.min.css" rel="stylesheet"/>
  <title>melon admin</title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
<script type="module" src="/src/main.js"></script>
<!-- 新增 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.21.1/video.min.js"></script>
<!-- 新增 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js"></script>
</body>
</html>
```

`VideoPlay.vue`

```vue

<template>
  <div>
    <div class="VideoPlay">
      <video
          :id="`video-${videoId}`"
          ref="videoRef"
          class="video-js vjs-default-skin vjs-big-play-centered"
          muted
          plays-inline
          controls
          preload="auto"
          height="400px"
          width="100%"
      />
    </div>
  </div>
</template>

<script>
// 注释掉videojs npm导入
// import videojs from 'video.js'
// import 'video.js/dist/video-js.css'
// import 'videojs-contrib-hls'

const config = {
  bigPlayButton: true,
  textTrackDisplay: false,
  posterImage: true,
  errorDisplay: false,
  controlBar: {
    currentTimeDisplay: true, // 当前时间
    timeDivider: true, // 时间分割线
    durationDisplay: true, // 总时间
    progressControl: true, // 进度条
    remainingTimeDisplay: {
      displayNegative: true
    }, //
    fullscreenToggle: true // 全屏按钮
  },
  playbackRates: [0.8, 1, 1.25, 1.5, 2],
  html5: {
    vhs: {
      withCredentials: false
    }
  }
}

export default {
  name: 'VideoPlay',
  props: {
    videoId: {
      default: Math.random().toString().slice(2, 6),
      type: [String, Number]
    },
    videoSrc: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      videoPlayerInstance: null,
    }
  },
  mounted() {
    try {
      this.videoSrc && this.getVideoPlayInstance()
    } catch (e) {
      console.error('init video')
    }
  },
  destroyed() {
    try {
      this.videoPlayerInstance && this.videoPlayerInstance.dispose()
    } catch (e) {
      console.error('destroyed video', e)
    }
  },
  methods: {
    setVideo(id, source) {
      try {
        config.sources = [{
          type: 'application/x-mpegURL',
          src: source
        }]
        // const instance = videojs(
        // 使用全局window.videojs
        const instance = window.videojs(
            id,
            config,
            () => {
              instance.play()
            })
        return instance
      } catch (e) {
        console.error('setVideo', e)
      }
    },
    getVideoPlayInstance() {
      if (!this.videoPlayerInstance) {
        this.videoPlayerInstance = this.setVideo(`video-${this.videoId}`, this.videoSrc)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.VideoPlay {
  width: 100%;
  height: 500px;

  .video-js {
    width: 100%;
    height: 100%;
  }
}

.audioPlay {
  width: 100%;
  height: 30px;

  .video-js {
    width: 100%;
    height: 100%;
    background: transparent;
  }
}
</style>
```

4.解决第3步的报错，切换了其他版本还是有这个错误，于是打算把[videojs-contrib-hls](https://github.com/videojs/videojs-contrib-hls)源码clone一份看看报错的地方能不能修改下源码，发现[README.md](https://github.com/videojs/videojs-contrib-hls#notice-this-project-will-be-deprecated-and-is-succeeded-by-videojs-http-streaming-vhs-supports-hls-and-dash-and-is-built-into-videojs-7-see-the-videojs-7-blog-post)：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/1c43e243-baff-4e38-b263-21d1aac2b639.png)

[Video.js Blog | Video.js (videojs.com)](https://videojs.com/blog/video-js-7-is-here/)博客显示videojs7使用[videojs/http-streaming](https://github.com/videojs/http-streaming)插件来替代[videojs-contrib-hls](https://github.com/videojs/videojs-contrib-hls)。

> [videojs/http-streaming](https://github.com/videojs/http-streaming): HLS, DASH, and future HTTP streaming protocols library for video.js

刚巧项目中的videojs也是7.x版本，于是我切换了[videojs/http-streaming](https://github.com/videojs/http-streaming)CDN,看了[官方DEMO](https://jsbin.com/gejugat/edit?html,output),需要把标签video替换为video-js，成功解决error，但是多了一个warning，
问题不大

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/a78f196d-97ad-43f1-acd2-f5c0a7c7c081.png)

这个就先忍了吧^\_^

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/W4j6OJVBQVpgO3p8/img/172e2ad1-bdee-4809-8ba2-09605177569f.png)

最终的index.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="icon" href="/favicon.ico"/>
  <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
  <title>melon admin</title>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
<script type="module" src="/src/main.js"></script>
<script src="https://unpkg.com/video.js/dist/video.js"></script>
<script src="https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js"></script>
</body>
</html>
```

> 在解决这个问题之前，我内心是崩溃的，找了诸多方式都无法解决，就差一点儿就放弃了，行百里者半九十，我坚持找解决方案，最终终于成功了，点个赞！

>  为了渐进升级，目前保留\`vue-cli-service\`和\`vite\`共存，两者都可以使用，后续可以把\`vue-cli-service\`相关的依赖和代码删除即可

## 6.参考文档

+ [Home | Vite中文网 (vitejs.cn)](https://vitejs.cn/)

+ [Origin.js- Webpack 转 Vite 的转换工具](https://originjs.org)： 这个是我在切换vite之后发现的一个宝藏项目，可以让我们少走很多弯路。

+ [cdnjs.com-CDN](https://cdnjs.com/libraries)

+ [Video.js Blog | Video.js (videojs.com)](https://videojs.com/blog/video-js-7-is-here/)
