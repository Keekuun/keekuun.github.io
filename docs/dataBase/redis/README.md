---
title: redis安装
date: 2023-3-31
sidebar: auto
categories: 
- 数据库
tags: 
- redis
- database
---

# redis 安装
+ [Redis的安装-windows](https://blog.csdn.net/weixin_44893902/article/details/123087435)
+ [Redis Release for windows](https://github.com/tporadowski/redis/releases)
+ [Redis Release for linux](https://redis.io/download/)

# redis 可视化工具
+ [Mac Platform: Modern GUI for Redis](https://getmedis.com/)
+ [All Platform: RedisInsight2.0](https://redis.com/redis-enterprise/redis-insight/#insight-form)

# redis 启动
window打开redis安装包目录，在cmd中执行命令：
```bash
redis-server.exe redis.windows.conf
```
# redis简单命令

> https://redis.io/commands/

+ KEYS: 查看符合模板的所有keys，不建议生产环境使用
+ DEL: 删除一个指定的key
+ EXISTS: 判断key是否存在
+ EXPIRE: 给一个key设置有效期，有效期到期时该key会被自动删除
+ TTL: 查看一个key的剩余有效期

通过 `help [command]`可以查看一个命令的具体用法，例如：
```bash
# help 命令
> help

redis-cli 5.0.14.1 (git:ec77f72d)
To get help about Redis commands type:
      "help @<group>" to get a list of commands in <group>
      "help <command>" for help on <command>
      "help <tab>" to get a list of possible help topics
      "quit" to exit

To set redis-cli preferences:
      ":set hints" enable online hints
      ":set nohints" disable online hints
Set your preferences in ~/.redisclirc


# 查询通用命令
> help @generic

  DEL key [key ...]
  summary: Delete a key
  since: 1.0.0

  DUMP key
  summary: Return a serialized version of the value stored at the specified key.

  since: 2.6.0

  EXISTS key [key ...]
  summary: Determine if a key exists
  since: 1.0.0

  EXPIRE key seconds
  summary: Set a key's time to live in seconds
  since: 1.0.0

  EXPIREAT key timestamp
  summary: Set the expiration for a key as a UNIX timestamp
  since: 1.2.0

  KEYS pattern
  summary: Find all keys matching the given pattern
  since: 1.0.0

  MIGRATE host port key| destination-db timeout [COPY] [REPLACE] [KEYS key]
  summary: Atomically transfer a key from a Redis instance to another one.
  since: 2.6.0

  MOVE key db
  summary: Move a key to another database
  since: 1.0.0
  TOUCH key [key ...]
  summary: Alters the last access time of a key(s). Returns the number of existing keys specified.
  since: 3.2.1

  TTL key
  summary: Get the time to live for a key
  since: 1.0.0

  TYPE key
  summary: Determine the type stored at key
  since: 1.0.0

  UNLINK key [key ...]
  summary: Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
  since: 4.0.0

  WAIT numreplicas timeout
  summary: Wait for the synchronous replication of all the write commands sent in the context of the current connection
  since: 3.0.0

# 查看符合模板的所有keys
> help keys

  KEYS pattern
  summary: Find all keys matching the given pattern
  since: 1.0.0
  group: generic

```
