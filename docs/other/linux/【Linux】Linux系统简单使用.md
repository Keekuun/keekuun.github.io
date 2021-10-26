---
title: 【Linux】Linux系统简单使用
date: 2020-11-30
categories: 
- 其他
tags: 
- Linux
---

## 1. Linux常用命令

> [2万字系统总结，带你实现 Linux 命令自由？](https://juejin.cn/post/6938385978004340744)

### 1.文档型

+ `ls`： 查看文件列表
+ `ls -la`：查看所有目录以及详细信息

+ `touch文件名` ：创建文件

+ `cat  文件名` ：查看文件内容

+ `echo  ‘内容’ >> 文件名` ：给文件追加内容

+ `echo ‘内容' > 文件名` ：覆盖文件内容

+ `rm  文件` ：删除文件

+ `rm -r 目录`： 删除目录

+ `rm -rf 文件/目录` ：强制删除

+ `vi 文件` ：进入Vim编辑状态

+ `cd \` ：目录切换到根目录

+ `mkdir 目录名` ：创建目录

### 2.硬件型

系统：

+ `lsb_release -a` ：查看linux版本

+ `top` ：查看系统CPU资源和内存资源

磁盘

+ `df -Th` ：查看磁盘

进程

+ `ps -ef | grep docker`：查看docker进程
+ `kill -9 2736`：关闭进程2736

服务

+ `service docker status`：查看docker运行状态
+ `service docker stop`：关闭docker
+ `service docker restart`：重启docker
+ `service –status -all `：查看所有状态

网络

+ `ping -c 4 链接`：查看网络连接,发送4个包
+ `ip address`：IP相关信息

### 3.功能型

压缩

+ `tar zcvf 压缩之后文件名 被压缩文件名`：压缩文件

解压

+ `tar -zxvf 压缩包名`：解压`.gz`文件

下载

> [yun、apt、wget的区别](https://www.cnblogs.com/zq8421/p/10037532.html)

+ `wget 资源链接`：下载资源
+ `apt install nginx `：安装nginx

远程

+ `ssh 用户名@地址`：连接远程服务

> [Linux安装Tomcat完整步骤](https://blog.csdn.net/qq_32218457/article/details/79788800?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control)
> 
> [对不起，学会这些 Linux 知识后，我有点飘](https://juejin.cn/post/6881755746216706062)
> 
> [windows操作](https://juejin.cn/post/7020574670097219621)
> 
> [电脑效率工具软件](https://juejin.cn/post/6844903602817859598)
