---
title: 真香！h5项目由nuxt2重构为nuxt3
sidebar: auto
date: 2023-08-10
isComment: true
categories: 
- Vue
- 前端
tags: 
- JS
- Vue
- nuxt
---

# h5项目由nuxt2重构为nuxt3
记录app混合开发过程中，前端h5项目由nuxt2升级为nuxt3的一次踩坑之旅。

## 1.项目背景
公司6年前不知道是哪位大神搭建的基于nuxt2的项目，不知道经历了多少手的改动，然后我接手的老旧h5项目是继承了6年多的老旧代码。。。
如果项目很稳定那还说得过去，由于不同开发人员加入了大量的plugins和不知名的js,导致项目即为冗余，最坑的是，这个h5项目在k8s中每间隔一到两个月就需要重启一次。
好吧，长痛不如短痛，改吧！


## 2.升级历程

### 2.1环境搭建的过程
+ nuxt3我开始并不熟悉，只知道他是基于vue3的ssr框架，那么先去看[官方文档](https://nuxt.com/)吧。
+ 然后先根据[getting-started](https://nuxt.com/docs/getting-started/installation)本地起一个demo。
+ 跑起来很丝滑，ok，那么接下来就需要进行页面迁移了。

> 当然这个只是一个可以跑得通的最基础的nuxt3项目,算是迁移成功的一小步了，后续还有很长的路要走，也不知道能否到达彼岸。

### 2.2页面迁移
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
    baseURL: options.baseURL ?? '/api',
    // cache request
    key: md5(url),

    // set user token if connected
    headers: token ? { Authorization: token } : {},
    ...body,

    onResponse(_ctx) {
      const responseData = _ctx.response._data
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

export function useHttpPost<T>(url: string, body = {}, needProxy = true) {
  return useHttpRequest<T>(url, { method: 'POST', body }, needProxy)
}

export function useHttpGet<T>(url: string, params = {}, needProxy = true) {
  return useHttpRequest<T>(url, { method: 'GET', params }, needProxy)
}

export function useHttpDelete<T>(url: string, body = {}, needProxy = true) {
  return useHttpRequest<T>(url, { method: 'DELETE', body }, needProxy)
}

export function useHttpPut<T>(url: string, body = {}, needProxy = true) {
  return useHttpRequest<T>(url, { method: 'PUT', body }, needProxy)
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
```vue
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
//此处写样式
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
### 2.3css重构

### 2.4jsbridge重构

### 2.5js重构

### 2.6打包重构

## 3.踩坑记录

## 4.兼容折磨

## 5.vite

## 6.nitro

## 7.docker部署
