---
title: docker 安装并启动 postgres
date: 2024-12-3
sidebar: auto
categories: 
- 数据库
tags: 
- postgres
- docker
- database
---

# docker 安装并启动 postgres

```bash
# 拉取
docker pull postgres:16-alpine

# 启动 postgres，并设置用户名、密码
docker run --name postgres16 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123456 -d postgres:16-alpine

# 进入容器，使用 bash （exit 退出）
docker exec -it postgres16 bash
# root 用户登录 psql （\q 退出）
psql -U root

# 上述合并为一行
docker exec -it postgres16 bash -c "psql -U root"
```

```bash 
# 停止容器 postgres16
docker stop postgres16
# 查看正在运行的容器
docker ps
# 查看所有容器
docker ps -a
# 启动容器 postgres16
docker start postgres16

# 删除容器
docker rm postgres16
```

> https://github.com/Keekuun/go_simple_bank
