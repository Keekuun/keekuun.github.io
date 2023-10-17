---
title: nuxt3 ssg 打包部署
sidebar: auto
date: 2023-10-16
isComment: true
categories: 
- Vue
- 前端
- CI/CD
tags: 
- nuxt
- docker
---

其他配置同[SSR部署](./nuxt3-ssr.md)

## 1.新增配置：
```json
{
  "scripts": {
    "preview": "nuxt preview",
    "generate:dev": "nuxt generate --dotenv env.dev",
    "generate:test": "nuxt generate --dotenv env.test",
    "generate:prod": "nuxt generate --dotenv env.prod"
  }
}
```

## 2.打包命令：
```bash
# 生产环境打包
nuxt generate --dotenv env.prod
```
执行上述脚本之后，会在root目录生成`dist`文件和`.output`目录，我们可以直接将`dist`目录或者`.output/public`下的静态文件直接部署在nginx服务。和通常的spa项目部署方式一样。

## 3.部署方式：
### 手动nginx部署
+ nginx配置文件：

```conf
user nginx;
worker_processes auto;
error_log  /var/log/nginx/error.log;
error_log  /var/log/nginx/error.log  notice;
error_log  /var/log/nginx/error.log  info;
pid /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;

    server {
        listen       80;
        listen  [::]:80;
        server_name  _;

        charset utf-8;

        location / {
            # 指定静态文件目录
            root   /app/nuxtApp;
            index  index.html index.htm;
            try_files $uri $uri/ $uri/index.html =404;
        }


        # api proxy
        location /api {
            proxy_pass  https://api.xxx.com;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```



+ 部署

1.将dist文件打包然后上传到linux系统的`/app/nuxtApp`目录下解压（需要删除dist目录）

2.将`nginx.conf`文件替换linux系统下nginx陪配置`/etc/nginx/nginx.conf`

3.启动nginx: `nginx -g daemon off`

## 4.docker结合nginx部署

+ 在项目root目录下新增`nginx.conf`(同上)
+ 在项目更目录新增dockerfile:
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

# 静态构建
RUN npm run generate:$ENV_NAME;

# 上传到oss
#RUN apk add --no-cache wget && wget https://gosspublic.alicdn.com/ossutil/1.7.13/ossutil64 && chmod 755 ossutil64 && ./ossutil64 config -e oss-cn-xxx.aliyuncs.com -i yourSecret -k yourKey && ./ossutil64 -v
#RUN ./ossutil64 cp ./.output/public/ oss://xxx/$ENV_NAME/ --meta x-oss-object-acl:public-read  -r -f

# Production image, copy all the files and run nuxt
FROM nginx:1.25.0-alpine3.17 AS runner
WORKDIR /app

# Automatically leverage output traces to reduce image size
# 这里和nginx.conf root指向的目录一致
COPY --from=builder /app/.output/public /app/nuxtApp
# nginx配置文件
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# 这里和nginx.conf listen 端口一致
EXPOSE 80

ENV PORT 80

CMD ["nginx", "-g","daemon off;"]
```
可以在docker desktop环境中，执行：`docker build ./ -f .\nginx.Dockerfile --build-arg ENV_NAME=prod -t nuxtApp`进行测试。

> [template-nuxt3](https://gitee.com/keekuun/create-ikun/tree/master/template-nuxt3)
