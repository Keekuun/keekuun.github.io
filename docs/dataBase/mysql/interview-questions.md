---
title: MySQL经典面试题与答案
sidebar: auto
categories: 
- 数据库
tags: 
- sql
- database
- interview
---

# MySQL 面试题目录

## 📚 一、基础概念篇（入门必会）
1. [什么是 MySQL？特点是什么？](#1-什么是-mysql它有什么特点)
2. [常见存储引擎有哪些？区别？](#2-常见存储引擎有哪些区别)
3. [DELETE/TRUNCATE/DROP 区别](#3-deletetruncatedrop-区别)
4. [数据库视图的作用](#4-数据库视图的作用)
5. [数据库三范式](#5-数据库三范式)

## 🔧 二、SQL 操作篇（日常开发）
6. [MySQL 查询语句执行流程](#6-mysql-中一条查询语句是怎么执行的)
7. [索引分类与原理](#7-mysql-索引有哪些分类)
8. [索引失效场景](#8-什么情况下索引会失效)
9. [联合索引与最左前缀](#9-什么是联合索引最左前缀原则是什么)
10. [EXPLAIN 执行计划](#10-如何分析-sql-的执行计划)

## ⚡ 三、性能优化篇（进阶提升）
11. [SQL 优化手段](#11-sql-优化的常见手段有哪些)
12. [慢查询排查](#12-慢查询如何排查和优化)
13. [深分页优化](#13-深分页如何优化)
14. [COUNT 优化](#14-countcount1count字段-的区别)
15. [JOIN 优化](#15-mysql-有哪些联合查询join方式)

## 🔒 四、事务与锁篇（核心原理）
16. [事务 ACID 特性](#16-什么是事件事务的-acid-特性是什么)
17. [MySQL 如何保证 ACID](#17-mysql-如何保证-acid-特性)
18. [隔离级别详解](#18-mysql-的隔离级别有哪些分别解决什么问题)
19. [脏读/不可重复读/幻读](#19-什么是脏读不可重复读幻读)
20. [锁机制详解](#20-mysql-有哪些锁类型)
21. [死锁避免](#21-什么是死锁如何避免)
22. [乐观锁 vs 悲观锁](#22-什么是乐观锁和悲观锁)
23. [MVCC 原理](#23-什么是-mvcc)

## 📊 五、日志与备份篇（运维必备）
24. [Binlog 详解](#24-binlogredo-logundo-log-的区别)
25. [Redo Log & Undo Log](#25-binlogredo-logundo-log-的区别)
26. [主从复制原理](#26-mysql-主从复制的原理是什么)
27. [主从延迟解决](#27-主从延迟如何解决)
28. [备份与恢复](#28-mysql-如何进行备份和恢复)

## 🏗️ 六、架构设计篇（高阶应用）
29. [读写分离](#29-什么是读写分离如何实现)
30. [分库分表](#30-什么情况下需要考虑分库分表)
31. [分布式 ID 生成](#31-分库分表时主键pk怎么设置)
32. [Buffer Pool](#32-什么是缓冲池buffer-pool)

## 💡 七、实战 SQL 篇（面试高频）
33. [部门最高工资](#33-如何查询每个部门的最高工资)
34. [高于平均工资](#34-如何查询工资高于部门平均工资的员工)
35. [行转列](#35-如何实现行转列)
36. [删除重复数据](#36-如何删除重复数据)
37. [连续签到统计](#37-如何实现连续签到天数统计)

## ❓ 八、常见问题篇（查漏补缺）
38. [自增 ID 用完](#38-mysql-自增-id-用完了怎么办)
39. [VARCHAR vs CHAR](#39-varchar-和-char-的区别如何选择)
40. [DATETIME vs TIMESTAMP](#40-datetime-和-timestamp-的区别)
41. [NULL 值处理](#41-如何处理-mysql-中的-null-值)
42. [MySQL 8.0 新特性](#42-mysql-80-有哪些新特性)
43. [防止 SQL 注入](#43-如何防止-sql-注入)
44. [高可用方案](#44-如何保证数据库的高可用)
45. [数据库迁移](#45-数据库迁移如何做)
46. [CPU 100% 排查](#46-如何排查-cpu-100-问题)

---

## 📚 一、基础概念篇（入门必会）

> **适合人群**：MySQL 初学者，需要了解基本概念

### 1. 什么是 MySQL？它有什么特点？

**答：** MySQL 是一种关系型数据库管理系统（RDBMS），使用标准 SQL 语言。主要特点包括：

- **开源免费**：社区版完全免费
- **跨平台**：支持 Linux、Windows、macOS 等多种操作系统
- **高性能**：读写速度快，适合高并发场景
- **易用性**：安装配置简单，学习成本低
- **可扩展**：支持主从复制、分库分表等扩展方案
- **丰富的存储引擎**：InnoDB、MyISAM 等可选

---

### 2. 常见存储引擎有哪些？区别？

**答：** 主要有 InnoDB 和 MyISAM 两种：

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 事务支持 | ✅ 支持 | ❌ 不支持 |
| 外键约束 | ✅ 支持 | ❌ 不支持 |
| 锁粒度 | 行级锁 | 表级锁 |
| 崩溃恢复 | ✅ 支持 | ❌ 不支持 |
| 全文索引 | 5.6+ 支持 | ✅ 支持 |
| 存储空间 | 较大 | 较小 |
| 适用场景 | OLTP 事务处理 | 读多写少场景 |

**推荐使用 InnoDB**，它是 MySQL 5.5+ 的默认存储引擎。

---

### 3. DELETE/TRUNCATE/DROP 区别

**答：** 三者都可以删除数据，但使用场景和影响完全不同。

#### 基本区别对比

| 特性 | DELETE | TRUNCATE | DROP |
|------|--------|----------|------|
| **类型** | DML（数据操作语言） | DDL（数据定义语言） | DDL（数据定义语言） |
| **作用** | 删除数据 | 清空表数据 | 删除整个表 |
| **WHERE 条件** | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| **事务** | ✅ 可回滚 | ❌ 不可回滚 | ❌ 不可回滚 |
| **触发器** | ✅ 触发 | ❌ 不触发 | ❌ 不触发 |
| **自增 ID** | 继续递增 | 重置为 1 | 表不存在 |
| **速度** | 慢（逐行删除） | 快（直接清空） | 最快（删除结构） |
| **空间释放** | 不立即释放 | 立即释放 | 完全释放 |
| **日志记录** | 记录每行删除 | 只记录页释放 | 记录表删除 |
| **权限要求** | DELETE 权限 | ALTER 权限 | DROP 权限 |

#### DELETE - 删除数据

**特点：**
- 逐行删除数据，每行都记录到 Undo Log
- 可以带 WHERE 条件，选择性删除
- 触发 DELETE 触发器
- 可以回滚（事务中）
- 自增 ID 不会重置

**示例：**
```sql
-- 删除指定数据
DELETE FROM users WHERE id = 1;

-- 删除所有数据（慢）
DELETE FROM users;

-- 事务中可以回滚
START TRANSACTION;
DELETE FROM users WHERE age < 18;
ROLLBACK;  -- 数据恢复
```

**适用场景：**
- ✅ 需要删除部分数据
- ✅ 需要触发触发器
- ✅ 需要事务控制
- ✅ 数据量较小的情况

#### TRUNCATE - 清空表

**特点：**
- DDL 操作，直接删除数据页
- 不能带 WHERE 条件，只能清空整表
- 不触发触发器
- 不能回滚（隐式提交）
- 自增 ID 重置为初始值
- 速度比 DELETE 快很多

**示例：**
```sql
-- 清空整张表
TRUNCATE TABLE users;

-- 等同于
TRUNCATE users;

-- 无法回滚
START TRANSACTION;
TRUNCATE TABLE users;
ROLLBACK;  -- ❌ 无效，数据已清空
```

**实现原理：**
```
DELETE: 逐行删除 → 记录 Undo Log → 标记删除 → 空间不释放
TRUNCATE: 直接删除数据页 → 重建表结构 → 空间立即释放
```

**适用场景：**
- ✅ 需要清空整张表
- ✅ 不需要保留自增 ID
- ✅ 追求快速清空
- ✅ 大表清空（百万级以上）

#### DROP - 删除表

**特点：**
- DDL 操作，删除表结构和数据
- 表完全消失，包括索引、约束、触发器
- 不能回滚
- 最彻底，速度最快

**示例：**
```sql
-- 删除整张表
DROP TABLE users;

-- 如果表存在才删除
DROP TABLE IF EXISTS users;

-- 删除多张表
DROP TABLE users, orders, products;
```

**适用场景：**
- ✅ 不再需要该表
- ✅ 测试环境清理
- ✅ 重构表结构前

---

### 4. 数据库视图的作用

**答：** 视图（View）是一个虚拟表，其内容由查询定义。

#### 视图的基本概念

**特点：**
- 视图不存储数据，只存储 SQL 查询逻辑
- 数据来自基表（真实表）
- 对视图的操作会映射到基表
- 简化复杂查询，提高安全性

**创建视图：**
```sql
-- 基本语法
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;

-- 示例：创建用户订单视图
CREATE VIEW user_orders_view AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    o.id AS order_id,
    o.total_amount,
    o.create_time
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

**使用视图：**
```sql
-- 像普通表一样查询
SELECT * FROM user_orders_view WHERE user_id = 1;

-- 可以 JOIN 其他表
SELECT * FROM user_orders_view v
INNER JOIN products p ON v.product_id = p.id;
```

#### 视图的作用

**1. 简化复杂查询** ⭐
```sql
-- ❌ 不使用视图：每次都要写复杂 SQL
SELECT 
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- ✅ 使用视图：简化为简单查询
CREATE VIEW user_order_stats AS
SELECT 
    u.id AS user_id,
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 使用时只需
SELECT * FROM user_order_stats WHERE order_count > 10;
```

**2. 提高安全性**
```sql
-- 创建只包含非敏感信息的视图
CREATE VIEW public_users_view AS
SELECT id, name, avatar
FROM users;  -- 不包含 password、phone 等敏感字段

-- 授予用户只能访问视图的权限
GRANT SELECT ON public_users_view TO 'app_user'@'localhost';
```

**3. 逻辑数据独立性**
```sql
-- 基表结构变化，只需修改视图，应用层无需改动
-- 原视图
CREATE VIEW user_info AS
SELECT id, name, age FROM users;

-- 基表拆分后，修改视图即可
ALTER VIEW user_info AS
SELECT u.id, u.name, p.age 
FROM users u
INNER JOIN user_profiles p ON u.id = p.user_id;
```

**4. 重用 SQL 逻辑**
```sql
-- 多个地方使用相同的复杂逻辑
CREATE VIEW active_users_view AS
SELECT * FROM users 
WHERE status = 1 
AND last_login_time > DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 多处复用
SELECT * FROM active_users_view;
SELECT COUNT(*) FROM active_users_view;
```

#### 总结

**视图的优点：**
- ✅ 简化复杂查询
- ✅ 提高数据安全性
- ✅ 逻辑数据独立性
- ✅ 代码复用

**视图的缺点：**
- ❌ 不提升性能（甚至可能降低）
- ❌ 嵌套视图难以维护
- ❌ 更新有限制
- ❌ 调试困难

**最佳实践：**
1. ⭐ **适度使用视图**：不要过度依赖
2. **避免嵌套**：最多 2-3 层
3. **注意性能**：复杂查询考虑汇总表
4. **命名规范**：使用 `_view` 后缀
5. **文档说明**：记录视图用途和逻辑
6. **定期审查**：删除不再使用的视图

---

### 5. 数据库三范式

**答：** 数据库范式是设计关系数据库时需要遵循的规范，目的是减少数据冗余，提高数据一致性。

**常见范式：**

#### 第一范式（1NF）- 原子性
- **要求**：每个字段都是不可分割的原子值
- **示例**：
  ```sql
  -- ❌ 不符合 1NF
  | name  | phones        |
  |-------|---------------|
  | 张三  | 138,139,140   |
  
  -- ✅ 符合 1NF
  | name  | phone  |
  |-------|--------|
  | 张三  | 138    |
  | 张三  | 139    |
  | 张三  | 140    |
  ```

#### 第二范式（2NF）- 完全依赖
- **要求**：在 1NF 基础上，非主键字段必须完全依赖于主键（消除部分依赖）
- **适用**：仅针对复合主键的情况
- **示例**：
  ```sql
  -- ❌ 不符合 2NF（订单详情表中，商品名称只依赖于商品ID，不依赖于订单ID）
  | order_id | product_id | product_name | quantity |
  |----------|------------|--------------|----------|
  | 1        | 101        | iPhone       | 2        |
  
  -- ✅ 符合 2NF（拆分成两个表）
  -- 订单详情表
  | order_id | product_id | quantity |
  |----------|------------|----------|
  | 1        | 101        | 2        |
  
  -- 商品表
  | product_id | product_name |
  |------------|--------------|
  | 101        | iPhone       |
  ```

#### 第三范式（3NF）- 消除传递依赖
- **要求**：在 2NF 基础上，非主键字段之间不能有依赖关系（消除传递依赖）
- **示例**：
  ```sql
  -- ❌ 不符合 3NF（员工表中，部门名称依赖于部门ID，而部门ID依赖于员工ID）
  | emp_id | emp_name | dept_id | dept_name | dept_location |
  |--------|----------|---------|-----------|---------------|
  | 1      | 张三     | 10      | 技术部    | 北京          |
  
  -- ✅ 符合 3NF（拆分成两个表）
  -- 员工表
  | emp_id | emp_name | dept_id |
  |--------|----------|---------|
  | 1      | 张三     | 10      |
  
  -- 部门表
  | dept_id | dept_name | dept_location |
  |---------|-----------|---------------|
  | 10      | 技术部    | 北京          |
  ```

#### BC范式（BCNF）
- **要求**：在 3NF 基础上，任何字段都不能依赖于其他非主键字段
- **更严格的 3NF**

#### 第四范式（4NF）和第五范式（5NF）
- 处理多对多关系的复杂情况
- 实际应用中较少使用

**实际应用建议：**
- ⭐ **一般遵循 3NF 即可**
- 适当反范式化可以提高查询性能（如冗余字段）
- 需要在数据一致性和查询性能之间权衡

---

## 🔧 二、SQL 操作篇（日常开发）

> **适合人群**：有一定 MySQL 基础，需要掌握常用操作

### 6. MySQL 中一条查询语句是怎么执行的？

**答：** MySQL 查询执行分为 **Server 层** 和 **引擎层** 两个部分。

#### 整体架构图

```
客户端请求
    ↓
┌─────────────────────────────────┐
│         Server 层               │
│  ┌──────────┐                   │
│  │ 连接器    │ ← 管理连接、权限验证  │
│  └──────────┘                   │
│  ┌──────────┐                   │
│  │ 查询缓存  │ ← MySQL 8.0 已移除  │
│  └──────────┘                   │
│  ┌──────────┐                   │
│  │ 分析器    │ ← 词法分析、语法分析  │
│  └──────────┘                   │
│  ┌──────────┐                   │
│  │ 优化器    │ ← 生成执行计划      │
│  └──────────┘                   │
│  ┌──────────┐                   │
│  │ 执行器    │ ← 调用引擎接口      │
│  └──────────┘                   │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│        存储引擎层                 │
│  ┌──────────┐                   │
│  │ InnoDB   │ ← 默认引擎         │
│  └──────────┘                   │
│  ┌──────────┐                   │
│  │ MyISAM   │                   │
│  └──────────┘                   │
└─────────────────────────────────┘
    ↓
返回结果给客户端
```

#### 详细执行流程

以 `SELECT * FROM users WHERE id = 1;` 为例：

**1. 连接器（Connector）**
- **作用**：管理连接、权限验证
- **流程**：
  - 检查用户名密码是否正确
  - 验证用户是否有该数据库的权限
  - 建立连接后，权限判断不再重复
- **长连接优化**：
  ```sql
  -- 查看当前连接
  SHOW PROCESSLIST;
  
  -- 主动断开空闲连接
  mysql_close();
  
  -- 或者执行后重置连接
  SELECT 1;  -- 保持连接活跃
  ```

**2. 查询缓存（Query Cache）** - MySQL 8.0 已移除
- **作用**：缓存 SELECT 语句和结果
- **问题**：表更新会清空所有缓存，命中率低
- **现状**：MySQL 8.0 已完全移除
- **替代方案**：使用 Redis 等外部缓存

**3. 分析器（Analyzer）**
- **词法分析**：识别关键字、表名、字段名
  ```sql
  SELECT → 关键字
  * → 字段
  FROM → 关键字
  users → 表名
  WHERE → 关键字
  id → 字段名
  = → 运算符
  1 → 值
  ```

- **语法分析**：检查 SQL 是否符合 MySQL 语法
  ```sql
  -- ❌ 语法错误
  SELCT * FROM users;  -- SELECT 拼写错误
  
  -- ✅ 正确
  SELECT * FROM users;
  ```

**4. 优化器（Optimizer）**
- **作用**：选择最优执行计划
- **决策内容**：
  - 选择使用哪个索引
  - 多表 JOIN 的顺序
  - 是否使用临时表、文件排序
- **示例**：
  ```sql
  -- 假设有 idx_name 和 idx_age 两个索引
  SELECT * FROM users WHERE name = '张三' AND age = 20;
  
  -- 优化器会根据统计信息决定使用哪个索引
  -- 可以通过 EXPLAIN 查看
  EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20;
  ```

**5. 执行器（Executor）**
- **作用**：调用存储引擎接口，执行查询
- **流程**：
  1. 检查用户对表的查询权限
  2. 调用引擎接口，获取第一行数据
  3. 判断是否符合条件，符合则加入结果集
  4. 继续获取下一行，直到最后一行
  5. 返回结果集给客户端

- **示例**：
  ```sql
  -- 执行器会调用 InnoDB 引擎的接口
  -- InnoDB 通过主键索引快速定位到 id=1 的记录
  SELECT * FROM users WHERE id = 1;
  ```

**6. 存储引擎层**
- **InnoDB**：
  - 通过 B+ 树索引定位数据
  - 从 Buffer Pool 或磁盘读取数据页
  - 返回记录给执行器
  
- **MyISAM**：
  - 类似的索引查找过程
  - 不支持事务、行锁

#### 总结

**查询语句执行关键点：**
1. ⭐ **连接器**：管理连接，注意长连接问题
2. **查询缓存**：MySQL 8.0 已移除，使用 Redis 替代
3. **分析器**：词法分析和语法分析
4. **优化器**：选择最优执行计划（索引选择）
5. **执行器**：权限检查，调用引擎接口
6. **引擎层**：实际的数据读写操作

**性能优化重点：**
- 减少全表扫描（添加索引）
- 优化复杂查询（避免多表 JOIN）
- 合理使用缓存（Redis）
- 控制返回数据量（分页、限制字段）
- 监控慢查询日志

---

### 7. MySQL 索引有哪些分类？

**答：** MySQL 索引可以从多个维度进行分类：

#### 按数据结构分类

1. **B+ Tree 索引** ⭐ 最常用
   - InnoDB 和 MyISAM 默认使用
   - 适合范围查询、排序、分组
   - 支持全值匹配、最左前缀匹配

2. **Hash 索引**
   - Memory 存储引擎默认使用
   - 只支持等值查询（=、IN）
   - 不支持范围查询、排序
   - 查询速度极快 O(1)

3. **Full-Text 全文索引**
   - 用于全文搜索
   - InnoDB（5.6+）和 MyISAM 支持
   - 配合 MATCH() AGAINST() 使用

4. **R-Tree 空间索引**
   - 用于地理空间数据
   - MyISAM 支持
   - GIS 应用场景

#### 按物理存储分类

1. **聚簇索引（Clustered Index）** ⭐
   - 数据和索引存储在一起
   - 叶子节点存储完整行数据
   - 一张表只能有一个聚簇索引
   - InnoDB 的主键索引就是聚簇索引

2. **非聚簇索引（Secondary Index）**
   - 也叫二级索引、辅助索引
   - 叶子节点存储主键值
   - 查询时需要回表
   - 一张表可以有多个非聚簇索引

#### 按逻辑分类

1. **主键索引（PRIMARY KEY）** ⭐
   - 唯一且不为 NULL
   - 一张表只能有一个
   - 自动创建聚簇索引
   ```sql
   CREATE TABLE users (
       id INT PRIMARY KEY,  -- 主键索引
       name VARCHAR(50)
   );
   ```

2. **唯一索引（UNIQUE）**
   - 索引列的值必须唯一
   - 允许有 NULL 值
   - 一张表可以有多个
   ```sql
   CREATE UNIQUE INDEX idx_email ON users(email);
   ALTER TABLE users ADD UNIQUE INDEX idx_phone(phone);
   ```

3. **普通索引（INDEX / KEY）** ⭐ 最常用
   - 没有任何限制
   - 加速查询
   ```sql
   CREATE INDEX idx_name ON users(name);
   ALTER TABLE users ADD INDEX idx_age(age);
   ```

4. **联合索引（Composite Index）** ⭐
   - 对多个列建立的索引
   - 遵循最左前缀原则
   ```sql
   CREATE INDEX idx_name_age ON users(name, age, city);
   -- 可以使用：name、name+age、name+age+city
   -- 不能使用：age、city、age+city
   ```

5. **全文索引（FULLTEXT）**
   - 用于全文搜索
   - 适用于 CHAR、VARCHAR、TEXT 类型
   ```sql
   CREATE FULLTEXT INDEX ft_content ON articles(content);
   SELECT * FROM articles WHERE MATCH(content) AGAINST('MySQL');
   ```

6. **空间索引（SPATIAL）**
   - 用于地理空间数据
   - 列值不能为 NULL
   ```sql
   CREATE SPATIAL INDEX sp_location ON places(location);
   ```

#### 按功能特性分类

1. **覆盖索引（Covering Index）**
   - 不是独立的索引类型，而是一种使用方式
   - 查询的列都能从索引中获取，无需回表
   ```sql
   -- 假设 idx_name_age 是 (name, age) 的联合索引
   SELECT name, age FROM users WHERE name = '张三';  -- ✅ 覆盖索引
   SELECT name, age, email FROM users WHERE name = '张三';  -- ❌ 需要回表
   ```

2. **前缀索引（Prefix Index）**
   - 对字符串的前 N 个字符建立索引
   - 节省空间，但可能降低选择性
   ```sql
   -- 只对 email 的前 10 个字符建立索引
   CREATE INDEX idx_email_prefix ON users(email(10));
   ```

3. **降序索引（Descending Index）** - MySQL 8.0+
   - 支持降序扫描
   ```sql
   CREATE INDEX idx_score_desc ON students(score DESC);
   SELECT * FROM students ORDER BY score DESC LIMIT 10;  -- 无需 filesort
   ```

4. **隐藏索引（Invisible Index）** - MySQL 8.0+
   - 优化器不使用，但仍会维护
   - 用于测试删除索引的影响
   ```sql
   CREATE INDEX idx_test ON users(name) INVISIBLE;
   ALTER INDEX idx_test ON users VISIBLE;  -- 恢复可见
   ```

#### 如何选择索引类型？

| 场景 | 推荐索引类型 | 示例 |
|------|-------------|------|
| 主键 | 主键索引 | `id INT PRIMARY KEY` |
| 唯一约束字段 | 唯一索引 | 邮箱、手机号 |
| 频繁查询字段 | 普通索引 | 姓名、状态 |
| 多条件查询 | 联合索引 | `(name, age)` |
| 大文本搜索 | 全文索引 | 文章 content |
| 地理位置 | 空间索引 | GPS 坐标 |
| 长字符串 | 前缀索引 | `email(10)` |
| 高频等值查询 | Hash 索引 | Memory 引擎 |

**最佳实践：**
1. ⭐ 优先使用 B+ Tree 索引（InnoDB 默认）
2. 主键使用自增 ID，避免页分裂
3. 联合索引遵循最左前缀原则
4. 区分度低的字段不适合建索引（如性别）
5. 定期分析索引使用情况，删除无用索引

---

### 8. 什么情况下索引会失效？

**答：** 常见索引失效场景：

1. **模糊查询以 % 开头**
   ```sql
   SELECT * FROM user WHERE name LIKE '%张三';  -- ❌ 索引失效
   SELECT * FROM user WHERE name LIKE '张三%';  -- ✅ 索引有效
   ```

2. **对索引列进行函数运算**
   ```sql
   SELECT * FROM user WHERE YEAR(create_time) = 2024;  -- ❌ 索引失效
   SELECT * FROM user WHERE create_time >= '2024-01-01';  -- ✅ 索引有效
   ```

3. **类型隐式转换**
   ```sql
   -- phone 是 varchar 类型
   SELECT * FROM user WHERE phone = 13800138000;  -- ❌ 索引失效
   SELECT * FROM user WHERE phone = '13800138000';  -- ✅ 索引有效
   ```

4. **OR 连接条件中有未索引的列**
   ```sql
   SELECT * FROM user WHERE name = '张三' OR age = 20;  -- 如果 age 无索引，则失效
   ```

5. **联合索引不满足最左前缀原则**
   ```sql
   -- 联合索引 (name, age, city)
   SELECT * FROM user WHERE age = 20;  -- ❌ 索引失效
   SELECT * FROM user WHERE name = '张三';  -- ✅ 索引有效
   SELECT * FROM user WHERE name = '张三' AND age = 20;  -- ✅ 索引有效
   ```

6. **NOT、!=、<> 操作符**
   ```sql
   SELECT * FROM user WHERE name != '张三';  -- ❌ 通常索引失效
   ```

---

### 9. 什么是联合索引？最左前缀原则是什么？

**答：** 联合索引是对多个列建立的索引。

**最左前缀原则**：查询条件必须从联合索引的最左边开始匹配。

```sql
-- 创建联合索引
CREATE INDEX idx_name_age_city ON user(name, age, city);

-- ✅ 符合最左前缀
WHERE name = '张三'
WHERE name = '张三' AND age = 20
WHERE name = '张三' AND age = 20 AND city = '北京'

-- ❌ 不符合最左前缀
WHERE age = 20
WHERE city = '北京'
WHERE age = 20 AND city = '北京'
```

---

### 10. 如何分析 SQL 的执行计划？

**答：** 使用 `EXPLAIN` 命令：

```sql
EXPLAIN SELECT * FROM user WHERE name = '张三';
```

**重点关注字段：**

- **type**：访问类型（性能从好到差）
  - `system > const > eq_ref > ref > range > index > ALL`
  - 至少达到 `range` 级别，避免 `ALL`（全表扫描）

- **key**：实际使用的索引
  
- **rows**：预估扫描的行数，越少越好

- **Extra**：额外信息
  - `Using index`：✅ 覆盖索引
  - `Using where`：需要 WHERE 过滤
  - `Using filesort`：⚠️ 需要文件排序，考虑优化
  - `Using temporary`：⚠️ 使用临时表，需要优化

---

## ⚡ 三、性能优化篇（进阶提升）

> **适合人群**：有 MySQL 开发经验，需要提升性能优化能力

### 11. SQL 优化的常见手段有哪些？

**答：**

1. **索引优化**
   - 为查询字段添加合适的索引
   - 避免索引失效
   - 使用覆盖索引

2. **SQL 语句优化**
   - 避免 `SELECT *`，只查询需要的列
   - 使用 LIMIT 分页
   - 避免大事务
   - 批量插入代替单条插入

3. **表结构优化**
   - 选择合适的数据类型（如用 INT 不用 VARCHAR 存数字）
   - 适当冗余字段减少 JOIN
   - 垂直/水平分表

4. **架构优化**
   - 读写分离
   - 引入缓存（Redis）
   - 分库分表

---

### 12. 慢查询如何排查和优化？

**答：**

**排查步骤：**

1. **开启慢查询日志**
   ```sql
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;  -- 超过2秒的记录
   ```

2. **分析慢查询日志**
   ```bash
   mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
   ```

3. **使用 EXPLAIN 分析执行计划**

4. **查看当前正在执行的慢查询**
   ```sql
   SHOW FULL PROCESSLIST;
   ```

**优化方法：**
- 添加或优化索引
- 重构 SQL 语句
- 优化表结构
- 增加缓存层

---

### 13. 深分页如何优化？

**答：** 深分页问题：`LIMIT 1000000, 10` 需要扫描 1000010 条记录。

**优化方案：**

1. **子查询优化**
   ```sql
   -- 原始 SQL
   SELECT * FROM user ORDER BY id LIMIT 1000000, 10;
   
   -- 优化后
   SELECT * FROM user 
   WHERE id >= (SELECT id FROM user ORDER BY id LIMIT 1000000, 1) 
   LIMIT 10;
   ```

2. **延迟关联**
   ```sql
   SELECT u.* FROM user u
   INNER JOIN (SELECT id FROM user ORDER BY id LIMIT 1000000, 10) AS tmp
   ON u.id = tmp.id;
   ```

3. **记录上次查询的最大 ID**
   ```sql
   -- 第一页
   SELECT * FROM user ORDER BY id LIMIT 10;
   
   -- 后续页（记录上一页最后一条的 id = 100）
   SELECT * FROM user WHERE id > 100 ORDER BY id LIMIT 10;
   ```

---

### 14. COUNT(*)、COUNT(1)、COUNT(字段) 的区别？

**答：**

- **COUNT(*)**：统计所有行，包括 NULL 值，MySQL 专门优化，性能最好 ⭐ 推荐
- **COUNT(1)**：统计所有行，包括 NULL 值，性能与 COUNT(*) 相近
- **COUNT(字段)**：统计该字段非 NULL 的行数，需要判断 NULL，性能较差

**结论：** 优先使用 `COUNT(*)`。

---

### 15. MySQL 有哪些联合查询（JOIN）方式？

**答：** MySQL 支持多种 JOIN 方式。

#### JOIN 类型详解

**1. INNER JOIN（内连接）** ⭐ 最常用
- 只返回两表中匹配的行

```sql
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

**2. LEFT JOIN（左外连接）** ⭐ 常用
- 返回左表的所有行，右表没有匹配时返回 NULL

```sql
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

**3. RIGHT JOIN（右外连接）**
- 返回右表的所有行，左表没有匹配时返回 NULL

**4. CROSS JOIN（交叉连接）**
- 返回笛卡尔积，谨慎使用

#### JOIN 性能优化

**1. 确保连接字段有索引** ⭐ 最重要
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

**2. 避免在大表上做 JOIN**
```sql
-- ✅ 好：先过滤再 JOIN
SELECT * FROM (
    SELECT * FROM orders WHERE create_time >= '2024-01-01'
) o
INNER JOIN order_items oi ON o.id = oi.order_id;
```

**3. 使用 EXISTS 替代 IN（大数据量）**
```sql
-- ✅ 好：EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.total_amount > 1000
);
```

---

## 🔒 四、事务与锁篇（核心原理）

> **适合人群**：需要深入理解 MySQL 并发控制机制

### 16. 什么是事务？事务的 ACID 特性是什么？

**答：** 事务是数据库操作的最小工作单元，要么全部执行成功，要么全部回滚。

**ACID 特性：**

- **原子性（Atomicity）**：事务中的所有操作要么全部完成，要么全部不完成
- **一致性（Consistency）**：事务执行前后，数据库从一个一致状态变换到另一个一致状态
- **隔离性（Isolation）**：多个事务并发执行时，互不干扰
- **持久性（Durability）**：事务一旦提交，对数据的修改是永久的

---

### 17. MySQL 如何保证 ACID 特性？

**答：** MySQL InnoDB 引擎通过以下机制保证 ACID：

#### 原子性（Atomicity）- Undo Log
- **实现机制**：Undo Log（回滚日志）
- **工作原理**：事务执行前，先记录反向操作到 Undo Log，如果事务失败或回滚，通过 Undo Log 恢复数据

#### 一致性（Consistency）- 由其他三个特性共同保证
- **实现机制**：原子性 + 隔离性 + 持久性 + 数据库约束

#### 隔离性（Isolation）- Lock + MVCC
- **实现机制**：锁（Lock）+ 多版本并发控制（MVCC）

#### 持久性（Durability）- Redo Log
- **实现机制**：Redo Log（重做日志）
- **WAL 技术**：先写日志，再写磁盘，确保数据不丢失

**总结：**
```
ACID 保证机制：
├── 原子性 → Undo Log（回滚）
├── 一致性 → 约束 + 触发器 + 其他三个特性
├── 隔离性 → Lock + MVCC
└── 持久性 → Redo Log（重做）
```

---

### 18. MySQL 的隔离级别有哪些？分别解决什么问题？

**答：** 四种隔离级别（从低到高）：

1. **READ UNCOMMITTED（读未提交）**
   - 问题：脏读、不可重复读、幻读
   
2. **READ COMMITTED（读已提交）**
   - 解决：脏读
   - 问题：不可重复读、幻读
   
3. **REPEATABLE READ（可重复读）** ⭐ MySQL 默认级别
   - 解决：脏读、不可重复读
   - 问题：幻读（InnoDB 通过 MVCC + Next-Key Lock 基本解决）
   
4. **SERIALIZABLE（串行化）**
   - 解决：所有并发问题
   - 缺点：性能最低

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|---------|------|-----------|------|
| READ UNCOMMITTED | ❌ | ❌ | ❌ |
| READ COMMITTED | ✅ | ❌ | ❌ |
| REPEATABLE READ | ✅ | ✅ | ✅（InnoDB 基本解决） |
| SERIALIZABLE | ✅ | ✅ | ✅ |

**结论：** MySQL 默认的 REPEATABLE READ 已经能解决所有三种并发问题。

---

### 19. 什么是脏读、不可重复读、幻读？

**答：**

- **脏读**：读取到其他事务未提交的数据
- **不可重复读**：同一事务中多次读取同一数据，结果不一致（其他事务修改并提交）
- **幻读**：同一事务中多次查询，返回的行数不一致（其他事务插入或删除）

**解决方案：**
- 避免脏读：隔离级别 ≥ READ COMMITTED
- 避免不可重复读：隔离级别 ≥ REPEATABLE READ
- 避免幻读：MySQL RR 级别 + Next-Key Lock

---

### 20. MySQL 有哪些锁类型？

**答：**

**按粒度分类：**
- **全局锁**：锁整个数据库实例
- **表级锁**：锁整张表（MyISAM 默认）
- **行级锁**：锁某一行（InnoDB 默认）⭐ 并发度最高

**按性质分类：**
- **共享锁（S 锁/读锁）**：允许多个事务同时读取
- **排他锁（X 锁/写锁）**：只允许一个事务写入

**InnoDB 特殊锁：**
- **记录锁（Record Lock）**：锁定单条记录
- **间隙锁（Gap Lock）**：锁定记录之间的间隙
- **临键锁（Next-Key Lock）**：记录锁 + 间隙锁

---

### 21. 什么是死锁？如何避免？

**答：** 死锁是两个或多个事务互相等待对方释放锁，导致都无法继续执行。

**示例：**
```
事务 A：锁定 row1 → 请求 row2
事务 B：锁定 row2 → 请求 row1
```

**避免方法：**

1. **固定顺序访问资源**：所有事务按相同顺序获取锁
2. **一次性获取所有锁**：减少锁持有时间
3. **设置超时时间**
   ```sql
   SET innodb_lock_wait_timeout = 50;  -- 50秒超时
   ```
4. **使用较低隔离级别**：如 READ COMMITTED
5. **合理设计索引**：避免锁升级

---

### 22. 什么是乐观锁和悲观锁？

**答：**

**悲观锁**：假设会发生冲突，操作前先加锁
```sql
-- 使用 SELECT ... FOR UPDATE
START TRANSACTION;
SELECT * FROM user WHERE id = 1 FOR UPDATE;
UPDATE user SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**乐观锁**：假设不会发生冲突，提交时检查是否有冲突
```sql
-- 使用版本号机制
UPDATE user SET balance = balance - 100, version = version + 1 
WHERE id = 1 AND version = old_version;
```

**应用场景：**
- 悲观锁：写多读少，冲突频繁
- 乐观锁：读多写少，冲突较少

---

### 23. 什么是 MVCC？

**答：** MVCC（Multi-Version Concurrency Control）多版本并发控制，用于实现非阻塞读。

**核心原理：**

1. **隐藏字段**：每行记录包含
   - `DB_TRX_ID`：最近修改的事务 ID
   - `DB_ROLL_PTR`：回滚指针，指向 Undo Log

2. **Undo Log**：保存历史版本

3. **Read View**：快照读时的可见性视图

**工作流程：**
```
事务 A 查询 → 创建 Read View → 根据可见性规则判断版本
                     ↓
         当前版本可见？→ 是 → 返回
                     ↓ 否
         历史版本可见？→ 是 → 返回历史版本
                     ↓ 否
         继续查找更早版本
```

**应用场景：** READ COMMITTED 和 REPEATABLE READ 隔离级别。

---

## 📊 五、日志与备份篇（运维必备）

> **适合人群**：DBA 和需要负责数据库运维的开发者

### 24. Binlog、Redo Log、Undo Log 的区别？

**答：**

| 日志类型 | 作用 | 所属层级 | 特点 |
|---------|------|---------|------|
| **Binlog** | 归档日志，用于主从复制和数据恢复 | Server 层 | 逻辑日志，追加写入 |
| **Redo Log** | 保证事务持久性，崩溃恢复 | InnoDB 引擎 | 物理日志，循环写入 |
| **Undo Log** | 保证事务原子性，MVCC | InnoDB 引擎 | 逻辑日志，用于回滚 |

**两阶段提交**：确保 Binlog 和 Redo Log 的一致性。

---

### 25. Binlog、Redo Log、Undo Log 的区别？

（同上题，内容已合并）

---

### 26. MySQL 主从复制的原理是什么？

**答：**

**复制流程：**

1. **Master 节点**
   - 将数据变更写入 Binlog（二进制日志）
   
2. **Slave 节点**
   - I/O 线程：从 Master 读取 Binlog，写入 Relay Log（中继日志）
   - SQL 线程：读取 Relay Log，重放操作到本地数据库

**复制模式：**

- **异步复制**：Master 不等待 Slave 响应，性能最高，可能丢失数据
- **半同步复制**：Master 至少等待一个 Slave 确认，平衡性能和安全
- **全同步复制**：等待所有 Slave 确认，安全性最高，性能最差

---

### 27. 主从延迟如何解决？

**答：** 主从延迟是指 Slave 落后于 Master 的时间。

**产生原因：**
- Master 并发高，Binlog 生成快
- Slave 单线程回放（MySQL 5.6 之前）
- 网络延迟
- 大事务执行时间长

**解决方案：**

1. **并行复制**（MySQL 5.6+）
   ```ini
   slave_parallel_workers = 4  # 开启多线程复制
   ```

2. **优化大事务**
   - 拆分大事务为小事务
   - 避免一次性删除/更新大量数据

3. **使用半同步复制**
   ```ini
   rpl_semi_sync_master_enabled = ON
   ```

4. **监控延迟**
   ```sql
   SHOW SLAVE STATUS\G
   -- 关注 Seconds_Behind_Master
   ```

---

### 28. MySQL 如何进行备份和恢复？

**答：**

**逻辑备份：**
```bash
# 备份
mysqldump -u root -p --all-databases > backup.sql

# 恢复
mysql -u root -p < backup.sql
```

**物理备份：**
```bash
# 使用 Percona XtraBackup（在线热备）
xtrabackup --backup --target-dir=/data/backup
xtrabackup --prepare --target-dir=/data/backup
xtrabackup --copy-back --target-dir=/data/backup
```

**Binlog 增量备份：**
```bash
# 基于时间点恢复
mysqlbinlog --stop-datetime="2024-01-01 12:00:00" binlog.000001 | mysql -u root -p
```

---

## 🏗️ 六、架构设计篇（高阶应用）

> **适合人群**：架构师和高级开发工程师，需要设计高可用架构

### 29. 什么是读写分离？如何实现？

**答：** 读写分离是将读操作和写操作分发到不同的数据库实例。

**实现方式：**

1. **应用层实现**
   - 代码中区分读写数据源
   - 灵活但侵入性强

2. **中间件实现** ⭐ 推荐
   - MyCat、ShardingSphere、ProxySQL
   - 透明化，对应用无侵入

3. **DNS/负载均衡**
   - 根据 SQL 类型路由

**优势：**
- ✅ 分担主库压力
- ✅ 提高读性能
- ✅ 增强可用性

**注意：**
- ❌ 主从延迟问题
- ❌ 分布式事务复杂

---

### 30. 什么情况下需要考虑分库分表？

**答：**

**判断标准：**

1. **单表数据量**
   - 行数超过 500 万 - 1000 万
   - 文件大小超过 2GB

2. **性能指标**
   - QPS 超过单机承载能力
   - 慢查询比例持续上升
   - CPU、IO 长期高位运行

3. **业务需求**
   - 需要水平扩展
   - 数据增长迅速

**分表策略：**

- **垂直分表**：将大字段拆分到扩展表
- **水平分表**：按规则拆分数据
  - 范围分片：按 ID 范围
  - Hash 分片：`user_id % 10`
  - 时间分片：按月/年分表

**常用中间件：**
- ShardingSphere
- MyCat
- Vitess

---

### 31. 分库分表时，主键（PK）怎么设置？

**答：** 分库分表后，自增 ID 不再适用，需要使用分布式 ID 生成方案。

#### 分布式 ID 生成方案

**1. 雪花算法（Snowflake）** ⭐ 最推荐

**原理：**
```
64位 Long 类型 ID 结构：
┌─────────────────────────────────────────────────────────────┐
│ 1bit │ 41bits      │ 10bits      │ 12bits                  │
│ 符号 | 时间戳       | 机器ID      | 序列号                   │
│ 位   │ (毫秒)       │ (数据中心+  │ (同一毫秒内的序列)        │
│      │             │ 机器)       │                          │
└─────────────────────────────────────────────────────────────┘
```

**特点：**
- ✅ 全局唯一
- ✅ 趋势递增（有利于索引）
- ✅ 高性能（本地生成，无网络开销）
- ✅ 高可用（不依赖第三方服务）
- ❌ 依赖系统时钟（时钟回拨问题）

**2. 数据库号段模式**

**原理：**
- 从数据库批量获取 ID 段
- 在内存中分配
- 用完后再次获取

**特点：**
- ✅ ID 趋势递增
- ✅ 性能较好（批量获取）
- ✅ 可控性强
- ❌ 依赖数据库
- ❌ 有单点故障风险

**3. Redis 生成 ID**

**原理：**
```bash
# 利用 Redis INCR 命令的原子性
INCR user_id_seq  # 返回 1, 2, 3...
```

**特点：**
- ✅ 性能极高
- ✅ 实现简单
- ❌ 依赖 Redis
- ❌ ID 不连续（重启后可能重复）

**4. UUID**

**特点：**
- ✅ 全球唯一
- ✅ 本地生成，无依赖
- ❌ 无序，导致索引碎片
- ❌ 存储空间大（36字符）
- ❌ 查询性能差

**不推荐用于分库分表主键！**

---

### 32. 什么是缓冲池（Buffer Pool）？

**答：** Buffer Pool 是 InnoDB 在内存中开辟的一块区域，用于缓存数据和索引。

**作用：**
- 减少磁盘 I/O，提升性能
- 采用 LRU 算法管理页面

**优化建议：**
```sql
-- 设置为物理内存的 50%-75%
SET GLOBAL innodb_buffer_pool_size = 4G;

-- 查看命中率
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';
-- 命中率 = (1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests) * 100%
```

---

## 💡 七、实战 SQL 篇（面试高频）

> **适合人群**：准备面试，需要掌握常见 SQL 写法

### 33. 如何查询每个部门的最高工资？

```sql
SELECT department_id, MAX(salary) as max_salary
FROM employees
GROUP BY department_id;
```

---

### 34. 如何查询工资高于部门平均工资的员工？

```sql
SELECT e.*
FROM employees e
INNER JOIN (
    SELECT department_id, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department_id
) dept_avg ON e.department_id = dept_avg.department_id
WHERE e.salary > dept_avg.avg_salary;
```

---

### 35. 如何实现行转列？

```sql
-- 使用 CASE WHEN
SELECT 
    name,
    SUM(CASE WHEN subject = '语文' THEN score ELSE 0 END) AS chinese,
    SUM(CASE WHEN subject = '数学' THEN score ELSE 0 END) AS math,
    SUM(CASE WHEN subject = '英语' THEN score ELSE 0 END) AS english
FROM scores
GROUP BY name;
```

---

### 36. 如何删除重复数据？

```sql
-- 保留 id 最小的记录
DELETE t1 FROM user t1
INNER JOIN user t2 
WHERE t1.name = t2.name 
  AND t1.email = t2.email 
  AND t1.id > t2.id;
```

---

### 37. 如何实现连续签到天数统计？

```sql
-- 假设 sign_in 表有 user_id 和 sign_date
SELECT 
    user_id,
    MIN(sign_date) as start_date,
    MAX(sign_date) as end_date,
    COUNT(*) as consecutive_days
FROM (
    SELECT 
        user_id,
        sign_date,
        DATE_SUB(sign_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY sign_date) DAY) as grp
    FROM sign_in
) t
GROUP BY user_id, grp
HAVING COUNT(*) >= 7;  -- 连续签到7天以上
```

---

## ❓ 八、常见问题篇（查漏补缺）

> **适合人群**：所有 MySQL 开发者，需要了解的常见问题

### 38. MySQL 自增 ID 用完了怎么办？

**答：**

**INT 类型范围：**
- 有符号：-2,147,483,648 ~ 2,147,483,647（约 21 亿）
- 无符号：0 ~ 4,294,967,295（约 42 亿）

**BIGINT 类型范围：**
- 有符号：约 922 亿亿
- 无符号：约 1844 亿亿

**解决方案：**

1. **使用 BIGINT**（推荐）⭐
   ```sql
   ALTER TABLE users MODIFY id BIGINT UNSIGNED AUTO_INCREMENT;
   ```

2. **清理无用数据**
   ```sql
   DELETE FROM logs WHERE create_time < '2020-01-01';
   ALTER TABLE logs AUTO_INCREMENT = 1;
   ```

3. **分库分表**
   - 当数据量达到瓶颈时考虑

---

### 39. VARCHAR 和 CHAR 的区别？如何选择？

**答：**

| 特性 | VARCHAR | CHAR |
|------|---------|------|
| 长度 | 可变长度 | 固定长度 |
| 存储 | 实际长度 + 1-2字节 | 固定长度 |
| 性能 | 稍慢 | 稍快 |
| 空间 | 节省空间 | 可能浪费空间 |
| 适用场景 | 长度变化大的字段 | 长度固定的字段 |

**选择建议：**
- ✅ **VARCHAR**：姓名、邮箱、地址等长度不固定的字段
- ✅ **CHAR**：手机号、身份证、性别等长度固定的字段

---

### 40. DATETIME 和 TIMESTAMP 的区别？

**答：**

| 特性 | DATETIME | TIMESTAMP |
|------|----------|-----------|
| 范围 | 1000-01-01 ~ 9999-12-31 | 1970-01-01 ~ 2038-01-19 |
| 时区 | 与时区无关 | 与时区相关 |
| 存储空间 | 8 字节 | 4 字节 |
| 自动更新 | 需手动设置 | 可自动更新 |

**选择建议：**
- ✅ **DATETIME**：存储历史时间、未来时间
- ✅ **TIMESTAMP**：记录创建时间、更新时间

---

### 41. 如何处理 MySQL 中的 NULL 值？

**答：**

**注意事项：**

1. **NULL 不等于任何值**
   ```sql
   SELECT * FROM user WHERE name = NULL;     -- ❌ 错误
   SELECT * FROM user WHERE name IS NULL;    -- ✅ 正确
   ```

2. **NULL 参与运算结果为 NULL**
   ```sql
   SELECT NULL + 1;  -- 结果是 NULL
   ```

3. **COUNT 不统计 NULL**
   ```sql
   SELECT COUNT(name) FROM user;  -- 不统计 name 为 NULL 的行
   SELECT COUNT(*) FROM user;     -- 统计所有行
   ```

**最佳实践：**
- 尽量避免使用 NULL，设置默认值
- 使用 `IFNULL()` 或 `COALESCE()` 处理 NULL
  ```sql
  SELECT IFNULL(name, '未知') FROM user;
  SELECT COALESCE(name, '未知') FROM user;
  ```

---

### 42. MySQL 8.0 有哪些新特性？

**答：**

1. **窗口函数**
   ```sql
   SELECT *, RANK() OVER (ORDER BY score DESC) as rank FROM student;
   ```

2. **CTE（公用表表达式）**
   ```sql
   WITH RECURSIVE cte AS (
       SELECT 1 as n
       UNION ALL
       SELECT n + 1 FROM cte WHERE n < 10
   )
   SELECT * FROM cte;
   ```

3. **JSON 增强**
   ```sql
   SELECT JSON_EXTRACT(data, '$.name') FROM user;
   ```

4. **降序索引**
   ```sql
   CREATE INDEX idx ON user(name DESC);
   ```

5. **隐藏索引**
   ```sql
   CREATE INDEX idx ON user(name) INVISIBLE;
   ```

6. **移除 Query Cache**

7. **默认字符集改为 utf8mb4**

---

### 43. 如何防止 SQL 注入？

**答：**

**防御措施：**

1. **使用预编译语句（PreparedStatement）** ⭐ 最有效
   ```java
   // Java 示例
   String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
   PreparedStatement pstmt = connection.prepareStatement(sql);
   pstmt.setString(1, username);
   pstmt.setString(2, password);
   ResultSet rs = pstmt.executeQuery();
   ```

2. **使用 ORM 框架**
   ```python
   # Python SQLAlchemy
   user = session.query(User).filter(User.username == username).first()
   ```

3. **输入验证和过滤**
   ```java
   // 白名单验证
   if (!username.matches("^[a-zA-Z0-9_]{3,20}$")) {
       throw new IllegalArgumentException("Invalid username");
   }
   ```

4. **最小权限原则**
   - 应用账号不使用 root
   - 只授予必要的权限

5. **转义特殊字符**
   ```php
   $username = mysqli_real_escape_string($conn, $username);
   ```

---

### 44. 如何保证数据库的高可用？

**答：**

**方案组合：**

1. **主从复制**：数据冗余
2. **主从切换**：故障自动转移
   - MHA（Master High Availability）
   - Orchestrator
3. **读写分离**：负载均衡
4. **分库分表**：水平扩展
5. **备份策略**：定期全量 + 增量备份
6. **监控告警**：Prometheus + Grafana

---

### 45. 数据库迁移如何做？

**答：**

**迁移步骤：**

1. **评估阶段**
   - 评估数据量、停机时间
   - 制定迁移方案

2. **准备阶段**
   ```bash
   # 全量备份
   mysqldump -u root -p --single-transaction --master-data=2 \
     --all-databases > full_backup.sql
   
   # 记录 Binlog 位置
   SHOW MASTER STATUS;
   ```

3. **测试阶段**
   - 在测试环境演练
   - 验证数据一致性
   - 性能测试

4. **执行阶段**
   ```bash
   # 1. 停止应用写入
   # 2. 等待主从同步
   # 3. 导出数据
   mysqldump -u root -p --single-transaction dbname > dump.sql
   
   # 4. 导入新库
   mysql -u root -p -h new_host dbname < dump.sql
   
   # 5. 追增量 Binlog
   mysqlbinlog --start-position=xxx binlog.000001 | mysql -u root -p -h new_host
   
   # 6. 切换应用连接
   # 7. 验证数据
   ```

5. **回滚方案**
   - 保留旧库一段时间
   - 准备快速回滚脚本

---

### 46. 如何排查 CPU 100% 问题？

**答：**

**排查步骤：**

1. **定位问题进程**
   ```bash
   top -c  # 查看 CPU 占用最高的进程
   ```

2. **查看 MySQL 线程**
   ```sql
   SHOW FULL PROCESSLIST;
   ```

3. **查找慢查询**
   ```sql
   -- 查看正在执行的 SQL
   SELECT * FROM information_schema.PROCESSLIST 
   WHERE COMMAND != 'Sleep' 
   ORDER BY TIME DESC;
   ```

4. **分析执行计划**
   ```sql
   EXPLAIN SELECT ...;  -- 对可疑 SQL 进行分析
   ```

5. **常见原因**
   - 缺少索引导致全表扫描
   - 复杂 JOIN 或子查询
   - 大量排序或分组操作
   - 锁等待

**解决方法：**
- 添加索引
- 优化 SQL 语句
- 拆分大查询
- 增加缓存

---

## 总结

本文涵盖了 MySQL 面试的核心知识点，包括：

- ✅ 基础概念：存储引擎、事务、隔离级别
- ✅ 索引原理：B+ 树、聚簇索引、索引失效
- ✅ SQL 优化：执行计划、慢查询、深分页
- ✅ 锁与并发：锁类型、死锁、MVCC
- ✅ 高可用：主从复制、读写分离
- ✅ 实战技巧：常见 SQL 写法、性能调优
