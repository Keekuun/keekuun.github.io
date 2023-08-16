---
title: 真香！h5项目由nuxt2重构为nuxt3
sidebar: auto
date: 2023-08-10
isComment: true
categories: 
- Vue
- 前端
- CI/CD
tags: 
- JS
- Vue
- nuxt
- docker
- 重构
---

# h5项目由nuxt2重构为nuxt3
记录app混合开发过程中，前端h5项目由nuxt2升级为nuxt3的一次踩坑之旅。

## 1.项目背景
公司6年前不知道是哪位大神搭建的基于nuxt2的项目，不知道经历了多少手的改动，然后我接手的老旧h5项目是继承了6年多的老旧代码。。。
如果项目很稳定那还说得过去，由于不同开发人员加入了大量的plugins和不知名的js,导致项目即为冗余，最坑的是，这个h5项目在k8s中每间隔一到两个月就需要重启一次。
好吧，长痛不如短痛，改吧！


## 2.升级历程

### 2.1 环境搭建的过程
+ nuxt3我开始并不熟悉，只知道他是基于vue3的ssr框架，那么先去看[官方文档](https://nuxt.com/)吧。
+ 然后先根据[getting-started](https://nuxt.com/docs/getting-started/installation)本地起一个demo。
+ 跑起来很丝滑，ok，那么接下来就需要进行页面迁移了。

> 当然这个只是一个可以跑得通的最基础的nuxt3项目,算是迁移成功的一小步了，后续还有很长的路要走，也不知道能否到达彼岸。

### 2.2 页面迁移
面对十多个页面，我们怎么下手呢？不积跬步无以至千里，我们先重构一个页面吧！

我们知道nuxt2是基于vue2的，nuxt3是基于vue3的，那么我们需要把vue2页面重构为vue3。
什么？vue3也不是很熟悉，那看文档呗。然后熟练地打开了vue3的官网，找到[迁移至南](https://v3-migration.vuejs.org/)。（真是熟练地让人心疼呀！）

+ 然后我又熟练地搭建（[Quick Start](https://vuejs.org/guide/quick-start.html)）了一个vue3项目demo,经过半天的折磨，我将一个最简单的vue2页面升级为了vue3。
+ 接着将这个vue3页面，通过CV大法放置在nuxt3项目中，运行`npm run dev`,不出所料控制台报错。
+ 什么？依赖没找到。把nuxt2依赖先一股脑CV过来，删除掉不需要的依赖（babel、webpack、vue、@nuxt相关的）其他第三方依赖全部保留。经过一番折腾，终于跑通了页面。又向成功迈出了关键的一步。

上述迁移了一个最简单的页面，它没有依赖vuex、以及api接口，那么接着我们需要啃硬骨头了。

先找到了一个我最熟悉的页面，这个页面依赖了vuex并且有多个api请求。经过上述一番折腾，我对vue3和nuxt3也有了一定的了解（拿捏它）。

+ vue3推荐使用pinia，那就盘他,我又熟练地找到了pinia的文档-[nuxt接入pinia](https://pinia.vuejs.org/zh/ssr/nuxt.html), 安装依赖`pnpm add pinia @pinia/nuxt`，并将它添加在`nuxt.config.ts`文件中。
+ 接着我创建了一个stores目录，用来存放pinia的store, 创建一了第一个store:
```js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```
这个文件上是不是和vuex的store非常相似，继续CV大法，把vuex的state、actions一股脑CV过来，修修补补，好的我们第一个pinia的store算是基本完成。

下面解决pinia的actions中的数据请求：
+ 我熟练地打开了nuxt3的官网，找到[Data fetching](https://nuxt.com/docs/getting-started/data-fetching#data-fetching),one hour later! 决定抛弃axios，选择使用nuxt3自带的请求方法——[useFetch](https://nuxt.com/docs/getting-started/data-fetching#usefetch)
+ 接着我创建了一个utils目录，新增`request.ts`，决定简单封装一下。后面看到官网[Composables Directory](https://nuxt.com/docs/guide/directory-structure/composables#composables-directory),哦，官方推荐这种方式呢，可以，于是我定义了一个`useHttpRequest`来封装我自己的`useFetch`，是不是很优雅！
```ts
import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { useRuntimeConfig } from 'nuxt/app'
import md5 from 'md5'
import { Toast } from '~/plugins/toast'
import type { ResponseData } from '~/types'

export default async function useHttpRequest<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
// 自定义body
  const body = options.method !== 'GET' ? { body: { } } : {}
  const rawData = ref(null)
  const defaults: UseFetchOptions<T> = {
    baseURL: options.baseURL ?? '/api', // 代理配置见后续
    // cache request
    key: md5(url),

    // set user token if connected
    headers: { Authorization: 'Bear token...' }, // 写入token
    ...body,

    onResponse(_ctx) {
      const responseData = _ctx.response._data
        // 此处为业务code码
      const { code, msg, data } = (responseData || {
        code: 1,
        msg: '数据格式不规范！',
        data: null,
      }) as ResponseData<T>
      if (code !== 0) {
        rawData.value = responseData
        msg && Toast(msg)
      } else {
        rawData.value = null
      }
      _ctx.response._data = data
      console.log('raw response data', responseData)
    },

    onResponseError(_ctx) {
        // 此处为http code码
      let { status: code, statusText: message } = _ctx.response
      if (code === 401) {
        message = '登录已过期,请重新登录'
      } else if (code === 404) {
        message = '接口不存在'
      } else if (code >= 500) {
        message = '服务器异常'
      } else {
        message = '网络异常'
      }
      console.error('responseError', message)
      Toast(message)
    },
  }
  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults)
  const { execute, pending, error, ...rest } = await useFetch(url, params)
  if (pending.value) {
    await execute()
  }
  return { execute, pending, error: rawData, ...rest }
}

export function useHttpPost<T>(url: string, body = {}) {
  return useHttpRequest<T>(url, { method: 'POST', body })
}

export function useHttpGet<T>(url: string, params = {}) {
  return useHttpRequest<T>(url, { method: 'GET', params })
}

export function useHttpDelete<T>(url: string, body = {}) {
  return useHttpRequest<T>(url, { method: 'DELETE', body })
}

export function useHttpPut<T>(url: string, body = {}) {
  return useHttpRequest<T>(url, { method: 'PUT', body })
}

```

+ 接着我们就可以愉快地测试数据请求啦。比如，下面这个store:
```js
import { defineStore } from 'pinia'
import { useHttpPost } from '~/composables/useHttpRequest'

export const taskCenterStore = defineStore('demo', {
    state() {
        return {
            data: {}
        }
    },
    getters: {},
    actions: {
        async getData() {
            const { data } = await useHttpPost('/api/v1/demo')
            this.data = data.value || {}
        },
    },
})
 
```
然后在页面中使用：
```angular2html
<template>
<!--  模板展示-->
</template>
<!--使用setup语法糖-->
<script lang="ts" setup>
import { useDemoStore } from '@/stores/demo'
// 获取store实例
const store = useDemoStore()
// 获取store data
const data = computed(() => store.data)
// 请求数据getData
onMounted(() => {
  store.getData()
})
</script>

<style lang="scss" scoped>
/*此处写样式*/
</style>
```

可以看到上述使用了**setup语法糖**，并且`computed`、`onMounted`等方法并没有显性的引入，这是因为`auto import`,官网可见[nuxt Auto Imports](https://nuxt.com/docs/migration/auto-imports#auto-imports)和[pinia auto import](https://pinia.vuejs.org/zh/ssr/nuxt.html#auto-imports)

那么，问题来了，我们迁移一个页面都耗费了如此道的功夫，那么剩下还有那么多，如果我们都要把它改造为`setup`语法糖的页面，得多麻烦呢？
其实，我们在vue3中也可以使用options语法，这样我们就一个继续使用CV大法了，当然vuex和pinia的使用方式也有一些差异，我们还是需要手动修改的
```vue
<template>
<!--  模板文件-->
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useDemoStore } from '~/stores/demo'

export default {
  components: { },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    // 注入store的state
    ...mapState(useDemoStore, ['data']),
  },
  mounted() {
    // 使用store的actions
    this.getData()
  },
  methods: {
    // 注入store的actions
    ...mapActions(useDemoStore, ['getData']),
  },
}
</script>
```

### 2.3 css重构
部分页面css文件如下：
```scss
<style lang="scss">
@use 'sass:math';
@function tovw($size, $base: 3.6) {
  @return math.div($size, $base) + vw;
}
.coin {
  padding-right: tovw(20);
  height: tovw(20);
  line-height: tovw(20);
  background-position: center right;
  background-repeat: no-repeat;
  background-size: tovw(16);
  display: inline-flex;
  align-items: center;
}
</style>
```

上面可以看到`style`标签中使用了大量的`tovw`转换`px`为`vw`做移动端适配，每个地方都需要手动去转换，
我们可以使用[`postcss-px-to-viewport`](https://github.com/evrone/postcss-px-to-viewport)实现自动替换,
更新`nuxt.config`文件:

> 为了解决 `postcss-px-to-viewport` 控制台输出: `postcss.plugin was deprecated. Migration guide:...`
> 我们使用[`postcss-px-to-viewport-8-plugin`](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin)

```js
export default defineNuxtConfig({
  postcss: {
    plugins: {
      'postcss-px-to-viewport-8-plugin': {
        viewportWidth: 360, // 设计稿的宽度
        unitPrecision: 6,
        unitToConvert: 'px',
        propList: ['*'],
        exclude: /node_modules|pc/i,
      },
    },
  }
})
```
这样一来，原来的`tovw`仍然可以保留，开发新的页面就可以随心所欲的使用`px`了。

### 2.4 jsbridge重构
由于前端人微言轻，在项目初始的时候我就提到过，IOS和android需要使用一套**jsbridge标准**（接口名称、参数、回调函数-返回值、调用方式一致），奈何客户端， 只按照自己舒服的方式去定义接口，只争取到了一个标准——接口名称（根本卵用没有）。

接手老代码之初，android功能已经有很多页面了，ios还在开发阶段（功能还未测试），我跟ios开发沟通过，需要按照android先定义好的jsbridge接口来实现，奈何ios为了赶进度，只随意找了一个文档，按照别人的来设计接口，只有名称一样：

比如`OpenUrl`接口定义：

| 平台      | 接口名称          | 入参        | 回调函数       | 返回值      |
|---------|---------------|-----------|------------|----------|
| android | `OpenUrl`     | `JSON字符串` | 需要挂在window | `JSON字符串` |
| ios     | `OpenUrl`     | `JSON`    | 参数传递       | `JSON`    |

> 返回值是在回调函数中的参数返回的

示例代码如下：
```js
// android
window.JSBridge.call(
  'OpenUrl',                    // 1.jsbridge名称
  JSON.stringify({              // 2.jsbridgei参数
    url: `${window.origin}/demo`,
    from: 'demo'
  }),
    'callbackName'              // 3.jsbridge回调函数名称
)
                                // 4.jsbridge回调函数挂载window上
window.callbackName = ret => {console.log('android ret', ret)}

// ios

// setupIosJSBridge初始化jsbridge
function setupIosJSBridge(callback) {
    if (window.JSBridge) {
        return callback(window.JSBridge)
    }
    if (window.WKWVJBCallbacks) {
        return window.WKWVJBCallbacks.push(callback)
    }
    window.WKWVJBCallbacks = [callback]
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}

setupIosJSBridge(function(bridge) {                         
    bridge.call(
        'OpenUrl',                                          // 1.jsbridgei名称
        {url: `${window.origin}/demo`, from: 'demo'},       // 2.jsbridgei参数
        (ret) => {console.log('ios ret', ret)}              // 3.jsbridgei回调函数和返回值
    )
})
```
不仅如此,在调用的时候,我们还得区分平台,然后调用不同的`JSBridge`,使得代码极为臃肿、不可阅读。

既然改变不了客户端，那就改变自己吧，于是将业务代码中的`JSBridge`抽离出来，最初定义了`utils/android-jsbridge`和`utils/ios-jsbridge`,最后合二为一：

```js
function randomString(len) {
  len = len || 8
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function isAndroid() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('android') || ua.includes('adr')
}
export function isIOS() {
  const ua = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod|ios/.test(ua)
}

const stringify = (str) => JSON.stringify(str)

// 注入JSBridge
function injectJSBridge(callback) {
  if (window.JSBridge) {
    callback(window.JSBridge)
  }
  if (isIOS()) {
    if (window.WKWVJBCallbacks) {
      return window.WKWVJBCallbacks.push(callback)
    }
    window.WKWVJBCallbacks = [callback]
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
  }
}

function _call(name, data, callback) {
  injectJSBridge(function(bridge) {
    bridge.call(name, data, callback)
  })
}

function _register(name, callback) {
  injectJSBridge(function(bridge) {
    bridge.register(name, function(data, responseCallback) {
      callback(data, responseCallback)
    })
  })
}

// 调用时分别适配ios和android
// 解决客户端接口定义标准不一致的问题
function callJSBridge(name, data = {}, cb = () => {}) {
  const wrappedFn = (data) => {
    let obj = {}
    if (typeof data === 'string') {
      try {
        obj = JSON.parse(data)
      } catch (e) {
        console.error(`${data} is not a valid json string`, e)
        obj = data
      }
    }
    console.log('wrappedFn obj', obj)
    return cb(obj)
  }
  try {
    if (isIOS()) {
      _call(name, data, wrappedFn)
      return
    }
    if (isAndroid()) {
      // 避免回调函数定义重复
      const fnName = `fn${randomString()}`
      window[fnName] = wrappedFn
      _call(name, stringify(data), fnName)
    }
  } catch (e) {
    console.error('callJSBridge', e)
  }
}

// 使用 `openUrl('xx/xx', 'xx', () => {})`
export function openUrl(url, from = 'h5', cb = () => {}) {
  callJSBridge('OpenUrl', { url, from }, cb)
}

export default callJSBridge
```

之后使用就很丝滑了，一行代码就搞定了。减少了大量的重复代码、极大地降低了心智负担。

### 2.5 js重构
除了jsbridge重构，老代码中的webpack相关的都需要移除，还有`require`的代码都需要改为`import`这里就不再赘述了, [migrate-from-commonjs-to-esm](https://nuxt.com/docs/migration/module-authors#migrate-from-commonjs-to-esm)。

### 2.6 打包配置
+ env环境变量

为了适配多环境部署，我们需要区分`开发环境（development）`、`测试环境（test）`、`生产环境（production）`。

在官网搜索`env`，可以看到文档[`.env File`](https://nuxt.com/docs/guide/directory-structure/env#env-file)

例如：
```bash
npx nuxi dev --dotenv .env.local
```
这样就可以加载本地根目录下`.env.local`定义的变量了，所以,我们需要新增`.env.development`、`.env.test`、`.env.production`。

并修改启动和构建脚本命令：
```json
 {
  "scripts": {
    "dev": "nuxt dev --dotenv .env.development",
    "build": "nuxt build --dotenv env/prod.env",
    "build:prod": "nuxt build --dotenv .env.production",
    "build:test": "nuxt build --dotenv .env.test",
    "build:dev": "nuxt build --dotenv .env.development"
  }
}
```
`.env`文件中我们可以定义一些环境变量，比如：
```dotenv
# 可以区分环境
NUXT_APP_ENV='dev' 
# api host区分不同环境
NUXT_APP_API_HOST='https://xx.api.com'
# cdn地址
NUXT_APP_CDN_URL='/'
```
为了可以在逻辑中处理不同环境，我们还可以配置`nuxt.config`中的环境变量，然后通过[`useRuntimeConfig`](https://nuxt.com/docs/api/composables/use-runtime-config#useruntimeconfig)获取使用。

```js
export default defineNuxtConfig({
    runtimeConfig: {
        // Private keys are only available on the server
        app: {
            NUXT_APP_API_HOST: process.env.NUXT_APP_API_HOST,
        },
        // Public keys that are exposed to the client
        public: {
            NUXT_APP_CDN_URL: process.env.NUXT_APP_CDN_URL,
            NUXT_APP_ENV: process.env.NUXT_APP_ENV,
        },
    },
})
```

修改`useRequest`中的`baseURL`，关键逻辑如下:

```ts
import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { useRuntimeConfig } from 'nuxt/app'

export default async function useHttpRequest<T>(
    url: string,
    options: UseFetchOptions<T> = {},
) {
    const { app } = useRuntimeConfig()
    // 从环境变量中获取接口域名
    const { NUXT_APP_API_HOST } = app
    const isDev = process.dev
    const body = options.method !== 'GET' ? { body: { base } } : {}
    // ... ...

    const defaults: UseFetchOptions<T> = {
        // isDev走本地代理
        baseURL: options.baseURL ?? isDev ? '/api' : NUXT_APP_API_HOST
    }

    const params = defu(options, defaults)
    
    return useFetch(url, params)
}
```

+ 本地代理配置
```js
export default defineNuxtConfig({
    vite: {
        server: {
            proxy: {
                '/api': {
                    target: process.env.NUXT_APP_API_HOST,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, ''),
                },
            },
        },
    }
})
```
于是，就可以多环境随意切换了。

## 3.CI/CD 部署
部署走的是`gitlab-ci`一整套流程，通过`commit`触发`gitlab-ci`的`runner`，执行`.gitlab-ci.yml`中设置的脚本，通过`docker`打包，然后推送到阿里云k8s中，然后在阿里云管理平台上一键部署对应的镜像。

+ `.gitlab-ci.yml`配置
```yaml
stages:
  - build
  - deploy
  - notify

variables:
  NAME: ${CI_PROJECT_NAME}
  GROUP_NAME: xxx
  REPO_NAME: ${GROUP_NAME}/${NAME}
  CI_PRODUCTION_REGISTRY: registry.xxx.aliyuncs.com
  CI_PRODUCTION_REGISTRY_IMAGE: ${CI_PRODUCTION_REGISTRY}/xxx/${NAME}
  CI_PRODUCTION_REGISTRY_USER: xxx
  CI_PRODUCTION_REGISTRY_PASSWORD: xxx
  
before_script:
  - chmod a+x ./scripts/notify.sh

build-test:
  stage: build
  variables:
    GIT_STRATEGY: fetch
  tags:
    - docker
  only:
    - main
    - test
  script:
    - pwd
    # ENV_NAME 用于在Dockerfile区分一下不同的环境
    - docker build ./ -f Dockerfile --build-arg ENV_NAME=test  -t ${CI_PRODUCTION_REGISTRY_IMAGE}:${CI_COMMIT_REF_NAME}
    - docker login ${CI_PRODUCTION_REGISTRY} -u ${CI_PRODUCTION_REGISTRY_USER} -p ${CI_PRODUCTION_REGISTRY_PASSWORD}
    - docker push ${CI_PRODUCTION_REGISTRY_IMAGE}:${CI_COMMIT_REF_NAME}
    - docker rmi ${CI_PRODUCTION_REGISTRY_IMAGE}:${CI_COMMIT_REF_NAME}

# 构建结果通知到钉钉群
failure-notify:
  stage: notify
  tags:
    - docker
  script:
    - ./scripts/notify.sh 1
  when: on_failure

success-notify:
  stage: notify
  tags:
    - docker
  script:
    - ./scripts/notify.sh 0
  when: on_success
```

+ `dockerfile`配置

```dockerfile
# 区分环境， 默认test
ARG ENV_NAME=test

# Install dependencies only when needed
FROM node:18.16.0-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml .npmrc ./

# https://pnpm.io/installation#using-corepack
RUN corepack enable && pnpm i --frozen-lockfile --ignore-scripts --production

# Rebuild the source code only when needed
FROM node:18.16.0-alpine AS builder

WORKDIR /app

 # 使用构建参数
ARG ENV_NAME
ENV ENV_NAME ${ENV_NAME}
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build:$ENV_NAME;

#RUN apk add --no-cache wget && wget https://gosspublic.alicdn.com/ossutil/1.7.13/ossutil64 && chmod 755 ossutil64 && ./ossutil64 config -e oss-xxx.aliyuncs.com -i secretxxx -k keyxxx && ./ossutil64 -v
#RUN ./ossutil64 cp ./.output/public/ oss://oss-bucket/dirname/$ENV_NAME/ --meta x-oss-object-acl:public-read  -r -f

# Production image, copy all the files and run nuxt
FROM node:18.16.0-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxtjs -u 1001

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/.output/public ./public
COPY --from=builder --chown=nuxtjs:nodejs /app/.output/server ./server

USER nuxtjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "./server/index.mjs"]
```

通过`docker`分层级部署，可以增加缓存，提升构建速度。

+ `./scripts/notify.sh`配置

```bash
 #!/bin/sh
##################
# 钉钉通知
# 自动化部署脚本中使用
# author:
##################

EchoRed() {
  printf "\n\033[31m %s \033[0m\n" "$1"
}

EchoGreen() {
  printf "\n\033[32m %s \033[0m\n" "$1"
}

EchoYellow() {
  printf "\n\033[33m %s \033[0m\n" "$1"
}

EchoGreen "========== 开始通知 ==========="

 # 钉钉机器人的地址
webhook='https://oapi.dingtalk.com/robot/send?access_token=your token'

# 推送模板发送
sendDingTalkNotifications() {
  # 获取格言
  response1=$(curl -s "https://api.quotable.io/random")
  content1=$(echo "$response1" | awk -F'"content":"' '{print $2}' | awk -F'"' '{print $1}')
#  author1=$(echo "$response1" | awk -F'"author":"' '{print $2}' | awk -F'"' '{print $1}')
  # 获取诗词
  response2=$(curl -s "https://v1.jinrishici.com/all")
  content2=$(echo "$response2" | awk -F'"content" : "' '{print $2}' | awk -F'"' '{print $1}')
#  author2=$(echo "$response2" | awk -F'"author" : "' '{print $2}' | awk -F'"' '{print $1}')
  img=$(curl -s "https://tuapi.eees.cc/api.php?category=meinv")
  imgUrl=$(echo "$img" | awk -F'src="' '{print $2}' | awk -F'"' '{print $1}')
  title="【前端构建消息】 ${CI_PROJECT_NAME}"
  text="### ${title} \n ### 构建分支：${CI_COMMIT_REF_NAME} \n ### 构建状态：<font color='${FONT_COLOR}'>${DEPLOY_STATUS}</font> \n ### 提交者：${GITLAB_USER_EMAIL} \n ### [流水线 Pipeline #${CI_PIPELINE_ID}](${CI_PROJECT_URL}/pipelines/${CI_PIPELINE_ID}) \n <img alt='' src='${imgUrl}' width='480px' /> <p>【格言】：$content1</p> <p>【诗词】：$content2</p>"
  curl -X POST "$webhook" -H 'Content-Type: application/json' -d "{\"msgtype\": \"markdown\",\"markdown\": {\"title\":\"$title\",\"text\": \"$text\"}}"
}

DEPLOY_STATUS='构建成功！'
FONT_COLOR='#00d600' # 绿色
if [ "$1" -eq "1" ]; then
  DEPLOY_STATUS='构建失败！'
  FONT_COLOR='#f56c6c' # 红色
fi

sendDingTalkNotifications

EchoGreen "========== 结束通知 ==========="
```

这样的话，每次`commit`成功之后，`gitlab`自动构建，并通知到钉钉，可以愉快的写代码(看妹子)啦！

![美女](../../../../images/vue/ding.jpg)

## 4.兼容折磨
nuxt3官方文档对兼容低版本浏览器几乎没有什么说明，想到nuxt3使用的是vite打包，那么我们可以去vite官网找解决方案：

经过一番查找我们找到文档目标：[Modern Browser Baseline change](https://vitejs.dev/guide/migration.html#modern-browser-baseline-change)

可以看到有一个插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy),这个貌似就是我们需要的。

然后，愉快的配置：
```js
import legacy from '@vitejs/plugin-legacy'

export default defineNuxtConfig({
    vite: {
        plugins: [
            legacy({
                targets: ['chrome >= 49'],
                // 其他的pollyfill: https://unpkg.com/browse/core-js@3.32.0/es/
                modernPolyfills: [
                    'es.global-this',
                    'es.object.from-entries',
                    'es.array.flat',
                    'es.object.entries',
                ],
            }),
        ],
    }
})
```

但是打包之后控制台会报错：`Uncaught ReferenceError: System is not defined `entry-legacy.4e3349cb.js:1:12341`

我们去[github nuxt issue](https://github.com/nuxt/nuxt/issues)搜索一下关键词[es5](https://github.com/nuxt/nuxt/issues?q=es5)，可以看到社区解决方案：

> 以下来自github：

1. Put the polyfills chunk to 1st position and remove module attribute from legacy chunks
   `modules/vite-legacy.ts`:
```js
import { defineNuxtModule } from '@nuxt/kit'
import { pick } from 'lodash'

// Fix vite-legacy build, see https://github.com/nuxt/nuxt/issues/15464
export default defineNuxtModule({
setup(_option, nuxt) {
nuxt.hook('build:manifest', manifest => {
if (!manifest['vite/legacy-polyfills-legacy']) {
return
}

      // Copy of manifest where polyfill is moved to 1st position.
      const manifest_copy: typeof manifest = {
        ...pick(manifest, 'vite/legacy-polyfills-legacy'),
        ...manifest,
      }
      // Clear manifest.
      for (const key of Object.keys(manifest)) {
        delete manifest[key]
      }
      // Fill manifest again from the copy.
      Object.assign(manifest, manifest_copy)

      // Remove module attribute from legacy chunks.
      for (const key of Object.keys(manifest)) {
        if (key.match(/-legacy(\.|$)/)) {
          manifest[key].module = false
        }
      }
    })
},
})
```
2. Mark legacy chunks as nomodule and remove defer from them
   `server/plugins/vite-legacy.ts`:

```js
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'

// Make vite-legacy build operational, see https://github.com/nuxt/nuxt/issues/15464
export default defineNitroPlugin(nitroApp => {
nitroApp.hooks.hook('render:response', response => {
// Mark legacy chunks as nomodule (prevents modern browsers from loading them)
// At the same time, unmark them as defer (otherwise System.register() in the legacy entry doesn't actually execute the code)
response.body = response.body.replace(
/(<script src="[^"]+\-legacy\.[^>]+") defer/g,
'$1 nomodule',
)

    // Remove legacy chunks preload (fixes warnings in modern browsers)
    response.body = response.body.replace(
      /<link rel="preload" as="script" href="[^"]+\-legacy\..*?>/g,
      '',
    )

    // The other option would be NOT to remove defer from legacy chunks,
    // but start them from a nomodule HTML script:
    //
    // response.body += `<script nomodule>document.querySelector("script[src*='/entry-legacy.']").onload=function(){System.import(this.src)}</script>`
    //
    // This is similar to what vite-legacy-plugin does in vanilla vite.
})
})
```

经此，我们已经可以愉快的兼容低版本浏览器了。

如果不想增加上述2个文件，有一个老哥把他们封装成了一个npm包，可以直接下载使用：[nuxt-vite-legacy](https://www.npmjs.com/package/nuxt-vite-legacy)

> 你以为到这里就完了么？sorry！没有！

经测试上述兼容处理，可以在`chrome62`以下版本和`chrome62`以上版本正常使用，但是在`chrome62`版本中无法正确执行，控制台报错：
```
Uncaught SyntaxError: Unexpected token import
```

原来`chrome62`版本支持[script type="module"](https://caniuse.com/?search=type%20module),但是不支持[dynamic import](https://caniuse.com/?search=dynamic%20import)。

比如上述配置之后打包之后的的代码：
```html
<!--兼容性代码-->
<script src="/_nuxt/entry-legacy.4cc1bd51.js" nomodule crossorigin></script>
<!--现代浏览器代码-->
<script type="module" src="/_nuxt/entry.fb895d54.js"></script>
```
`chrome62`浏览器由于支持`type="module"`，所以成功加载了`<script type="module" src="/_nuxt/entry.fb895d54.js"></script>`中的脚本，但是这个脚本中由于有`dymaic import`代码，导致报错了。

解决方案很简单，就是把这个代码移除就好，但是考虑到现代浏览的体验，我们只想需要把低版本的这个代码移除就好。

于是，修改`server/plugins/vite-legacy.ts`如下：
```js
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { judgeUaVersion } from '~/utils/ua'

// Make vite-legacy build operational, see https://github.com/nuxt/nuxt/issues/15464
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const ua = event.node.req.headers['user-agent']
    // remove legacy prefect in modern browsers
    if (!judgeUaVersion(ua)) {
      html.head = html.head.map((node) => {
        if (
          /<link rel="prefetch" as="script" href="[^"]+-legacy\..*?>/g.test(
            node
          )
        ) {
          return node.replace(
            /<link rel="prefetch" as="script" href="[^"]+-legacy\..*?>/g,
            ''
          )
        }
        return node
      })
    }

    if (!judgeUaVersion(ua, '61') && judgeUaVersion(ua, '63')) {
      // use legacy code in chrome 61 & 62
      html.bodyAppend = html.bodyAppend.map((node) =>
        node
          .replace(
            // remove module code
            /<script type="module" src="[^"]+\..*?>/g,
            ''
          )
          .replaceAll(
            // remove defer to prevent it from being replaced with nomodule in render:response
            /(<script src="[^"]+-legacy\.[^>]+") defer/g,
            '$1 '
          )
      )
    }
  })
})

```
终于大功告成！！！

## 5.vite
> [Vite Next Generation Frontend Tooling](https://vitejs.dev/)

## 6.nitro
> [Create web servers that run anywhere.](https://www.nitropack.org/)
