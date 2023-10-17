---
title: nuxt3 ssr 打包部署
sidebar: auto
date: 2023-10-15
isComment: true
categories: 
- Vue
- 前端
- CI/CD
tags: 
- nuxt
- docker
---

## 1.环境变量
可以创建`env.dev`, `env.prod`等多个环境变量
```env
NUXT_APP_NAME='nuxt'
NUXT_APP_SECRET='secret'
NUXT_APP_ENV='prod'
NUXT_APP_CDN_URL='/'
```

## 2.脚本配置：
```json
{
  "name": "nuxt3-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nuxt dev --dotenv env.dev",
    "build:prod": "nuxt build --dotenv env.prod",
    "build:test": "nuxt build --dotenv env.test",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "start": "node .output/server/index.mjs",
    "lint": "eslint --ext \".ts,.js,.vue\" --ignore-path .eslintignore .",
    "lintfix": "eslint --fix --ext \".ts,.js,.vue\" --ignore-path .eslintignore .",
    "prepare": "husky install",
    "clean": "rm -rf .nuxt dist .output"
  }
}
```

## 3.配置文件`nuxt.config.ts`：
```ts
export default defineNuxtConfig({
   ssr: true, // 默认配置

   runtimeConfig: {
       // only server
      app: {
         NUXT_APP_NAME: process.env.NUXT_APP_NAME,
         NUXT_APP_SECRET: process.env.NUXT_APP_SECRET,
      },
      // server client
      public: {
         NUXT_APP_CDN_URL: process.env.NUXT_APP_CDN_URL,
         NUXT_APP_ENV: process.env.NUXT_APP_ENV,
      },
   },
})
```

## 4.打包命令：
```bash
# 生产环境打包
nuxt build --dotenv env.prod
```

## 5.部署方式：
### 1.docker分层部署

```dockerfile

FROM node:18-alpine AS deps
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml .npmrc ./
# https://pnpm.io/installation#using-corepack
RUN corepack enable && pnpm i --frozen-lockfile --ignore-scripts --production


FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build:prod;

FROM node:18.16.0-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output/public ./public
COPY --from=builder /app/.output/server ./server

EXPOSE 3000
ENV PORT 3000
CMD ["node", "./server/index.mjs"]
```

### 2.使用pm2
新建pm2配置文件`ecosystem.config.js`，放到项目的根目录：
```js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
```
执行脚本：
```bash
npm install pm2 -g
npm run build

# pm2启动nuxt3
pm2 start ecosystem.config.js
```

```
pm2 list //查看所有pm2进程
pm2 start //启动进程
pm2 stop all //停止所有进程
pm2 stop 进程号 //停止某个进程
pm2 delete all //删除所有进程
pm2 delete 进程号 //删除某个进程
pm2 reload 进程号 //重启某个进程
pm2 logs  // 查看日志
pm2 monit  // 查看资源
```

### 3.[docker结合pm2部署](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
+ 新增启动方式及依赖：
```json
{
  "name": "NuxtAppName",
  "scripts": {
    "start:pm2": "pm2-runtime ecosystem.config.js"
  },
  "dependencies": {
    "pm2": "^5.3.0"
  }
}
```
+ root目录新增pm2配置`ecosystem.config.js`：
```js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs', // nuxt启动脚本入口
    },
  ],
}
```

+ 修改dockerfile：
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml .npmrc ./
# https://pnpm.io/installation#using-corepack
RUN corepack enable && pnpm i --frozen-lockfile --ignore-scripts --production

FROM node:18-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build:prod;

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000

CMD ["npm", "run", "start:pm2"]
```

> [template-nuxt3](https://gitee.com/keekuun/create-ikun/tree/master/template-nuxt3)
