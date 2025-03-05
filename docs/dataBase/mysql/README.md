---
title: MySQL简介
date: 2021-10-26
sidebar: auto
categories: 
- 数据库
tags: 
- sql
- database
---

+ [MySQL 三万字精华总结 ](https://juejin.cn/post/6850037271233331208)
+ [138 张图带你 MySQL 入门](https://juejin.cn/post/6844904196383195144)
+ [MySQL的万字总结](https://juejin.cn/post/6844904039860142088)

# 1.MySQL简介
MySQL是一种关系数据库管理系统，使用标准SQL语言编写。它是一种客户端/服务器系统，可以在多种操作系统上运行，并支持多个用户同时访问同一数据库。

MySQL是一个以开源软件形式提供的RDBMS（关系型数据库管理系统）。MySQL由瑞典MySQL AB公司开发，现在是Oracle公司的一部分。MySQL最初是为Web应用程序设计的，并且常常用于LAMP（Linux，Apache，MySQL和PHP / Perl / Python）堆栈。MySQL也被广泛应用于商业应用程序中，如电子商务和在线银行等。

MySQL被广泛使用的原因之一是它易于使用和维护。MySQL提供了一个可扩展的数据库架构，因此它可以轻松地适应变化的业务需求。MySQL还具有高度可靠的性能和安全性，因此它是业界最流行的RDBMS之一。

# 2.PostgreSQL简介

> [PostgreSQL15安装指南](https://zhuanlan.zhihu.com/p/607744255)

PostgreSQL是一种开源的关系型数据库管理系统（RDBMS），是一种高度可靠、可扩展和高性能的数据库系统。它可以在各种不同的操作系统上运行，包括Linux、Windows、Mac OS X等。PostgreSQL的特点包括：

1. 高度可靠：PostgreSQL具备强大的数据完整性保护机制，并提供了许多高级数据类型和功能，如复合数据类型、数组、JSON等，以及许多可定制的数据类型和排除约束。

2. 可扩展性好：PostgreSQL具备良好的可扩展性，可以通过集群、分区和复制等技术，轻松地扩展数据库的处理能力和容量。

3. 具备高性能：PostgreSQL使用了许多高效的算法和技术，如B树索引、多版本并发控制（MVCC）等，以提高数据库的性能和并发性。

4. 具备可移植性：PostgreSQL的代码是开源的，并且遵循了SQL标准，因此可以在各种不同的计算机平台上使用。

5. 免费：PostgreSQL是一款自由软件，任何人都可以免费下载、使用和修改它的源代码。

6. 支持多种编程语言：PostgreSQL可以与许多不同的编程语言（如C、C++、Python、Java、PHP等）进行集成，方便开发人员使用。

总之，PostgreSQL是一种功能强大、强调数据完整性和可靠性的高性能关系型数据库管理系统，是许多企业和组织首选的数据库解决方案之一。 

# 3.PostgreSQL 和 MySQL对比

PostgreSQL 和 MySQL 都是一种关系型数据库管理系统。两种系统都是用于存储和管理数据的，但是它们之间存在一些主要的区别：

1. 数据类型：PostgreSQL 支持更多的数据类型，例如数组、范围、网络地址等。而 MySQL 的数据类型相对较少。

2. 可扩展性：PostgreSQL 比 MySQL 更可扩展性，支持更多的并发连接和更大的数据集。

3. 安全性：PostgreSQL 高度重视安全性，支持加密和其他安全功能。而 MySQL 的安全特性相对较少。

4. 性能：在某些情况下，MySQL 可能比 PostgreSQL 更快，特别是在处理大量简单查询时。但是，当处理复杂查询和大量数据时，PostgreSQL 的性能可能更好。

5. SQL 兼容性：PostgreSQL 更符合 SQL 标准，而 MySQL 只是部分符合 SQL 标准。

总的来说，PostgreSQL 是一种功能更强大、更安全、更可扩展的数据库系统，而 MySQL 则更适合处理大量简单的查询。选择哪种数据库系统取决于具体的使用情况
