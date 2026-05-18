---
title: MySQL 基础问答30题
sidebar: auto
categories: 
- 数据库
tags: 
- sql
- database
- interview
---

## 1. 数据库的三范式是什么？
三范式（Third Normal Form）是数据库设计中的重要概念。它是指数据库表结构满足以下三个条件：
1. 第一范式（1NF）：每个字段只能包含原子值，即不可再分割的值。
2. 第二范式（2NF）：满足第一范式，并且每个非主键字段完全依赖于主键。
3. 第三范式（3NF）：满足第二范式，并且每个非主键字段不依赖于其他非主键字段。

## 2.说说InnoDB与MyISAM的区别
InnoDB和MyISAM是MySQL数据库中两种常用的存储引擎，它们有以下区别：
1. 事务支持：InnoDB支持事务，MyISAM不支持。
2. 锁机制：InnoDB使用行级锁，MyISAM使用表级锁。
3. 外键支持：InnoDB支持外键约束，MyISAM不支持。
4. 数据安全性：InnoDB具有更高的数据安全性，支持崩溃恢复，而MyISAM在崩溃时可能会丢失数据。
5. 性能：MyISAM在读取密集型应用中表现更好，而InnoDB在写入密集型应用中表现更好。
6. 全文索引：MyISAM支持全文索引，而InnoDB在较新的版本中也开始支持全文索引。
7. 存储方式：InnoDB使用聚簇索引存储数据，而MyISAM使用非聚簇索引存储数据。
8. 适用场景：InnoDB适用于需要事务支持和数据完整性的应用，而MyISAM适用于只读或读取密集型的应用。
9. 默认存储引擎：从MySQL 5.5版本开始，InnoDB成为默认的存储引擎，而之前的版本默认使用MyISAM。

## 3.drop、truncate、delete的区别
1. drop：用于删除整个表结构和数据，无法恢复。
2. truncate：用于删除表中的所有数据，但保留表结构，无法恢复。
3. delete：用于删除表中的部分或全部数据，保留表结构，可以通过事务回滚恢复。

sql 语句：
```sql
-- 删除整个表结构和数据
DROP TABLE table_name;

-- 删除表中的所有数据，但保留表结构
TRUNCATE TABLE table_name;

-- 删除表中的部分或全部数据，保留表结构
DELETE FROM table_name WHERE condition;
```

## 4.聊一聊数据库事务机制
数据库事务机制是一种确保数据库操作的原子性、一致性、隔离性和持久性的机制。事务是一组操作的集合，这些操作要么全部成功，要么全部失败，保证了数据的完整性和一致性。事务机制包括以下几个关键概念：

1. 原子性（Atomicity）：事务中的所有操作要么全部成功，要么全部失败，不会出现部分成功的情况。
2. 一致性（Consistency）：事务执行前后，数据库必须保持一致的状态，即满足所有的约束条件。
3. 隔离性（Isolation）：事务之间相互独立，一个事务的执行不会影响其他事务的执行，直到该事务完成。
4. 持久性（Durability）：一旦事务提交，对数据库的修改是永久性的，即使系统崩溃也不会丢失。

数据库事务机制通过锁机制、日志记录和恢复机制来实现。常见的事务隔离级别包括读未提交（Read Uncommitted）、读已提交（Read Committed）、可重复读（Repeatable Read）和串行化（Serializable）。不同的隔离级别提供了不同程度的数据一致性和并发性能，开发者可以根据应用需求选择合适的隔离级别。

### MySQL 中 ACID 是通过什么机制保证的？

**答：** MySQL InnoDB 引擎通过以下机制保证 ACID：

#### 1. 原子性（Atomicity）- Undo Log

**实现机制：** Undo Log（回滚日志）

**工作原理：**
- 事务执行前，先记录反向操作到 Undo Log
- 如果事务失败或回滚，通过 Undo Log 恢复数据
- 例如：INSERT 的反向操作是 DELETE，UPDATE 的反向操作是恢复旧值

**示例：**
```
事务开始 → 记录 Undo Log → 执行操作 → 成功则提交 / 失败则回滚
```

**具体过程：**
```sql
-- 事务执行 UPDATE
UPDATE accounts SET balance = 900 WHERE id = 1;  -- 原值是 1000

-- Undo Log 记录：
-- "将 id=1 的 balance 从 900 恢复为 1000"

-- 如果事务回滚
ROLLBACK;  -- InnoDB 读取 Undo Log，执行反向操作
```

#### 2. 一致性（Consistency）- 由其他三个特性共同保证

**实现机制：** 原子性 + 隔离性 + 持久性 + 数据库约束

**保证方式：**
- **数据库约束**：主键、外键、唯一索引、检查约束等
- **触发器**：自动维护数据完整性
- **事务正确执行的结果**：ACID 其他三个特性的综合结果

**示例：**
```sql
-- 转账操作必须保持一致性
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- 要么都成功，要么都失败

-- 如果第二条 UPDATE 失败，整个事务回滚
-- 保证总金额不变（一致性）
```

#### 3. 隔离性（Isolation）- Lock + MVCC

**实现机制：** 锁（Lock）+ 多版本并发控制（MVCC）

**锁机制：**
- **行级锁**：锁定特定行
- **表级锁**：锁定整张表
- **间隙锁（Gap Lock）**：防止幻读
- **临键锁（Next-Key Lock）**：记录锁 + 间隙锁

**MVCC（多版本并发控制）：**
- 通过 Read View 实现快照读
- 不同事务看到不同版本的数据
- 避免读写冲突
- 每行记录包含隐藏字段：
  - `DB_TRX_ID`：最近修改的事务 ID
  - `DB_ROLL_PTR`：回滚指针，指向 Undo Log

**隔离级别实现：**
- **READ UNCOMMITTED**：不加锁，直接读
- **READ COMMITTED**：每次查询创建新 Read View
- **REPEATABLE READ**：事务开始时创建 Read View，全程使用
- **SERIALIZABLE**：加锁，串行执行

#### 4. 持久性（Durability）- Redo Log

**实现机制：** Redo Log（重做日志）

**工作原理：**
- 事务提交时，先将修改写入 Redo Log
- Redo Log 采用顺序写入，性能高
- 即使系统崩溃，重启后通过 Redo Log 恢复数据

**WAL 技术（Write-Ahead Logging）：**
- 先写日志，再写磁盘
- 确保数据不丢失

**刷盘策略：**
```ini
innodb_flush_log_at_trx_commit = 1  # 每次提交都刷盘（最安全）
innodb_flush_log_at_trx_commit = 2  # 每秒刷盘（性能较好）
innodb_flush_log_at_trx_commit = 0  # 由操作系统决定（性能最好）
```

**两阶段提交（确保 Binlog 和 Redo Log 一致）：**
```
1. 执行器调用引擎接口更新数据
2. 引擎生成 Redo Log（prepare 状态）
3. 执行器生成 Binlog
4. 引擎提交 Redo Log（commit 状态）
```

### 总结图示

```
ACID 保证机制：
├── 原子性 → Undo Log（回滚日志）
│   └── 记录反向操作，失败时回滚
│
├── 一致性 → 约束 + 触发器 + 其他三个特性
│   ├── 主键、外键、唯一约束
│   └── 原子性 + 隔离性 + 持久性的综合结果
│
├── 隔离性 → Lock + MVCC
│   ├── 锁：行锁、表锁、间隙锁、临键锁
│   └── MVCC：Read View + Undo Log 实现快照读
│
└── 持久性 → Redo Log（重做日志）
    ├── WAL 技术：先写日志，再写磁盘
    └── 两阶段提交：确保 Binlog 和 Redo Log 一致
```

### 三种日志对比

| 日志类型 | 作用 | 所属层级 | 特点 |
|---------|------|---------|------|
| **Undo Log** | 保证原子性，MVCC | InnoDB 引擎 | 逻辑日志，用于回滚 |
| **Redo Log** | 保证持久性，崩溃恢复 | InnoDB 引擎 | 物理日志，循环写入 |
| **Binlog** | 主从复制，数据恢复 | Server 层 | 逻辑日志，追加写入 |

## 5. 聊聊 MySQL 中的关联查询

**答：** MySQL 关联查询（JOIN）用于从多个表中获取数据，是 SQL 中最常用的操作之一。

### JOIN 类型

#### 1. INNER JOIN（内连接）

**特点：** 只返回两表中匹配的行

```sql
-- 查询有订单的用户
SELECT u.name, o.order_no, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

#### 2. LEFT JOIN（左外连接）

**特点：** 返回左表的所有行，右表没有匹配时返回 NULL

```sql
-- 查询所有用户及其订单（包括没有订单的用户）
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

#### 3. RIGHT JOIN（右外连接）

**特点：** 返回右表的所有行，左表没有匹配时返回 NULL

```sql
-- 查询所有订单及其用户（包括没有用户的订单）
SELECT u.name, o.order_no
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

**注意：** LEFT JOIN 和 RIGHT JOIN 可以互换，通常推荐使用 LEFT JOIN（更易读）

#### 4. FULL OUTER JOIN（全外连接）

**特点：** 返回两表的所有行

**注意：** MySQL **不支持** FULL OUTER JOIN，需用 UNION 模拟：

```sql
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id

UNION

SELECT u.name, o.order_no
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

#### 5. CROSS JOIN（交叉连接）

**特点：** 返回笛卡尔积，结果行数 = 左表行数 × 右表行数

**什么是笛卡尔积？**

笛卡尔积是数学中的一个概念，指两个集合中所有可能的组合。

**示例：**
```sql
-- 假设有两个表
-- users 表：3 行
| id | name   |
|----|--------|
| 1  | 张三   |
| 2  | 李四   |
| 3  | 王五   |

-- colors 表：2 行
| id | color  |
|----|--------|
| 1  | 红色   |
| 2  | 蓝色   |

-- CROSS JOIN
SELECT u.name, c.color
FROM users u
CROSS JOIN colors c;

-- 结果：3 × 2 = 6 行
| name   | color  |
|--------|--------|
| 张三   | 红色   |  ← 张三 + 红色
| 张三   | 蓝色   |  ← 张三 + 蓝色
| 李四   | 红色   |  ← 李四 + 红色
| 李四   | 蓝色   |  ← 李四 + 蓝色
| 王五   | 红色   |  ← 王五 + 红色
| 王五   | 蓝色   |  ← 王五 + 蓝色
```

**笛卡尔积的原理：**
```
users (3行) × colors (2行) = 6行

每个 users 表的行都与 colors 表的所有行组合：
- 张三 → 与红色、蓝色分别组合（2行）
- 李四 → 与红色、蓝色分别组合（2行）
- 王五 → 与红色、蓝色分别组合（2行）
总计：2 + 2 + 2 = 6 行
```

**实际应用场景：**

**场景 1：生成所有可能的组合**
```sql
-- 生成所有日期和产品的销售记录组合
SELECT d.date, p.product_name
FROM dates d
CROSS JOIN products p;

-- 用于初始化销售报表，即使某天没有销售也有记录
```

**场景 2：测试数据生成**
```sql
-- 快速生成大量测试数据
INSERT INTO test_table (user_id, product_id)
SELECT u.id, p.id
FROM users u
CROSS JOIN products p
LIMIT 10000;  -- 生成 10000 条测试数据
```

**场景 3：多维度分析**
```sql
-- 生成所有地区和产品类别的组合
SELECT r.region_name, c.category_name
FROM regions r
CROSS JOIN categories c;

-- 用于创建完整的销售矩阵
```

**⚠️ 性能警告：**

CROSS JOIN 可能导致严重的性能问题！

```sql
-- ❌ 危险：大表 CROSS JOIN
SELECT * FROM users u      -- 1000 行
CROSS JOIN orders o;       -- 10000 行
-- 结果：1000 × 10000 = 10,000,000 行！

-- ❌ 更危险：三个大表 CROSS JOIN
SELECT * FROM users u      -- 1000 行
CROSS JOIN orders o        -- 10000 行
CROSS JOIN products p;     -- 5000 行
-- 结果：1000 × 10000 × 5000 = 50,000,000,000 行（500亿行！）
```

**如何避免意外的笛卡尔积：**

```sql
-- ❌ 错误：忘记写 ON 条件
SELECT * FROM users u, orders o;  -- 隐式 CROSS JOIN

-- ✅ 正确：明确指定连接条件
SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- ✅ 如果确实需要 CROSS JOIN，明确写出
SELECT * FROM users u
CROSS JOIN colors c;  -- 明确表示需要笛卡尔积
```

**CROSS JOIN vs INNER JOIN 对比：**

```sql
-- CROSS JOIN：无条件，所有组合
SELECT u.name, c.color
FROM users u
CROSS JOIN colors c;  -- 6 行（3 × 2）

-- INNER JOIN：有条件，只返回匹配的组合
SELECT u.name, c.color
FROM users u
INNER JOIN colors c ON u.favorite_color_id = c.id;  -- 可能只有 3 行
```

**总结：**
- ✅ **适用场景**：生成所有组合、测试数据、多维分析
- ❌ **不适用**：常规数据查询（应使用 INNER/LEFT JOIN）
- ⚠️ **注意**：警惕意外笛卡尔积导致的性能问题
- 💡 **建议**：明确写出 JOIN 类型，避免隐式 CROSS JOIN

```sql
-- 生成所有用户和产品的组合
SELECT u.name, p.product_name
FROM users u
CROSS JOIN products p;
```

**警告：** 谨慎使用，可能导致性能问题！

### JOIN 对比图

```
表 A: {1, 2, 3}    表 B: {2, 3, 4}

INNER JOIN:        {2, 3}              (交集)
LEFT JOIN:         {1, 2, 3}           (A 全部 + B 匹配)
RIGHT JOIN:        {2, 3, 4}           (B 全部 + A 匹配)
FULL OUTER JOIN:   {1, 2, 3, 4}        (并集)
CROSS JOIN:        {1×2, 1×3, 1×4...}  (笛卡尔积)
```

### JOIN 性能优化

#### 1. 确保连接字段有索引 ⭐ 最重要

```sql
-- ✅ 好：连接字段有索引
CREATE INDEX idx_orders_user_id ON orders(user_id);

SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id;  -- 快速

-- ❌ 不好：连接字段无索引
-- 会导致 Nested Loop Join，性能极差
```

#### 2. 避免在大表上做 JOIN

```sql
-- ❌ 不好：大表 JOIN 大表
SELECT * FROM orders o  -- 1000万行
INNER JOIN order_logs ol ON o.id = ol.order_id;  -- 5000万行

-- ✅ 好：先过滤再 JOIN
SELECT * FROM (
    SELECT * FROM orders WHERE create_time >= '2024-01-01'
) o
INNER JOIN order_logs ol ON o.id = ol.order_id;
```

#### 3. 使用 EXISTS 替代 IN（大数据量）

```sql
-- ❌ 不好：IN 子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total_amount > 1000);

-- ✅ 好：EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.total_amount > 1000
);
```

#### 4. 减少 JOIN 数量

```sql
-- ❌ 不好：过多 JOIN
SELECT * FROM a
INNER JOIN b ON ...
INNER JOIN c ON ...
INNER JOIN d ON ...
INNER JOIN e ON ...;  -- 5表 JOIN，性能差

-- ✅ 好：拆分为多次查询，应用层组装
-- 或者使用冗余字段减少 JOIN
```

#### 5. 使用 EXPLAIN 分析 JOIN

```sql
EXPLAIN SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.age > 18;

-- 重点关注：
-- type: ref 或 eq_ref 为好，ALL 为差
-- key: 实际使用的索引
-- rows: 扫描行数
-- Extra: Using index 为好，Using filesort 需优化
```

### JOIN 算法

#### 1. Nested Loop Join（嵌套循环连接）

**原理：**
```
for each row in outer_table:
    for each row in inner_table:
        if match:
            add to result
```

**特点：**
- 适合小表 JOIN
- 内表需要有索引
- 复杂度：O(M × N)

#### 2. Block Nested Loop Join（块嵌套循环）

**原理：**
- 将外表数据分批加载到 join buffer
- 减少内表扫描次数

**优化参数：**
```sql
-- 调整 join buffer 大小
SET GLOBAL join_buffer_size = 256 * 1024;  -- 256KB
```

#### 3. Hash Join（哈希连接） - MySQL 8.0+

**原理：**
- 对小表构建哈希表
- 大表逐行探测哈希表

**特点：**
- 适合大表 JOIN 大表
- 不需要索引
- 性能优于 Nested Loop

**查看是否使用 Hash Join：**
```sql
EXPLAIN FORMAT=TREE SELECT * FROM t1 INNER JOIN t2 ON t1.id = t2.t1_id;
-- 输出中包含 "Hash join" 表示使用了 Hash Join
```

### 常见面试题

#### 1. LEFT JOIN 中 WHERE 和 ON 的区别？

```sql
-- 场景：查询用户及其 2024 年的订单

-- ❌ 错误：WHERE 条件会过滤掉 NULL
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.create_time >= '2024-01-01';  -- 没有订单的用户被过滤

-- ✅ 正确：条件放在 ON 中
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id 
    AND o.create_time >= '2024-01-01';  -- 保留所有用户
```

**原因：**
- ON 条件：在连接时过滤，不影响左表
- WHERE 条件：在连接后过滤，会过滤掉 NULL 行

#### 2. 如何优化 COUNT(DISTINCT) + JOIN？

```sql
-- ❌ 不好：先 JOIN 再统计
SELECT COUNT(DISTINCT u.id)
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 1;

-- ✅ 好：先过滤再 JOIN
SELECT COUNT(*)
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.status = 1
);
```

### 最佳实践总结

| 场景 | 推荐做法 | 原因 |
|------|---------|------|
| 两表关联 | INNER JOIN | 只取匹配数据 |
| 保留主表全部 | LEFT JOIN | 包含未匹配数据 |
| 连接字段 | 加索引 | 提升性能 |
| 多表 JOIN | ≤ 3 个表 | 避免性能下降 |
| 大表 JOIN | 先过滤 | 减少数据量 |
| 判断存在 | EXISTS | 比 IN 性能好 |
| MySQL 8.0+ | Hash Join | 大表 JOIN 更快 |

**核心原则：**
1. ⭐ **连接字段必须有索引**
2. **控制 JOIN 数量**：不超过 3-5 个表
3. **先过滤再 JOIN**：减少参与连接的数据量
4. **使用 EXPLAIN 分析**：确认执行计划合理
5. **避免笛卡尔积**：确保有正确的连接条件

## 6. 事务隔离级别有哪些？MySQL 和 PostgreSQL 默认的隔离级别是什么？

**答：** SQL 标准定义了四种事务隔离级别，不同数据库的默认级别有所不同。

### SQL 标准定义的四种隔离级别

#### 1. READ UNCOMMITTED（读未提交）

**特点：**
- 最低的隔离级别
- 允许读取其他事务未提交的数据
- **问题**：脏读、不可重复读、幻读

**示例：**
```sql
-- 事务 A
START TRANSACTION;
UPDATE accounts SET balance = 900 WHERE id = 1;  -- 未提交

-- 事务 B（READ UNCOMMITTED 级别）
SELECT balance FROM accounts WHERE id = 1;  -- 读到 900（脏数据）

-- 事务 A
ROLLBACK;  -- 回滚，balance 实际还是 1000
-- 事务 B 读到了错误的数据！
```

**适用场景：** 几乎不使用，除非对数据一致性要求极低

#### 2. READ COMMITTED（读已提交）

**特点：**
- 只能读取其他事务已提交的数据
- **解决**：脏读
- **问题**：不可重复读、幻读

**示例：**
```sql
-- 事务 A（READ COMMITTED 级别）
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- 读到 1000

-- 事务 B
START TRANSACTION;
UPDATE accounts SET balance = 900 WHERE id = 1;
COMMIT;

-- 事务 A
SELECT balance FROM accounts WHERE id = 1;  -- 读到 900（不一致！）
```

**适用场景：** Oracle、PostgreSQL、SQL Server 的默认级别

#### 3. REPEATABLE READ（可重复读） ⭐

**特点：**
- 保证同一事务中多次读取同一数据结果一致
- **解决**：脏读、不可重复读
- **问题**：理论上存在幻读（但 InnoDB 通过 MVCC + Next-Key Lock 基本解决）

**示例：**
```sql
-- 事务 A（REPEATABLE READ 级别）
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- 创建快照，读到 1000

-- 事务 B
UPDATE accounts SET balance = 900 WHERE id = 1;
COMMIT;

-- 事务 A
SELECT balance FROM accounts WHERE id = 1;  -- 还是 1000（快照读）
COMMIT;
```

**适用场景：** **MySQL InnoDB 的默认级别** ⭐

#### 4. SERIALIZABLE（串行化）

**特点：**
- 最高的隔离级别
- 事务串行执行，完全隔离
- **解决**：所有并发问题（脏读、不可重复读、幻读）
- **缺点**：性能最差，并发度最低

**实现方式：**
- 通过强制事务串行执行
- 对所有读取的数据加锁

**适用场景：** 对数据一致性要求极高的场景（如金融核心系统）

### 三种并发问题对比

| 并发问题 | 描述 | READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE |
|---------|------|------------------|----------------|-----------------|---------------|
| **脏读** | 读到未提交数据 | ❌ 存在 | ✅ 解决 | ✅ 解决 | ✅ 解决 |
| **不可重复读** | 同一事务多次读取结果不一致 | ❌ 存在 | ❌ 存在 | ✅ 解决 | ✅ 解决 |
| **幻读** | 同一事务多次查询行数不一致 | ❌ 存在 | ❌ 存在 | ✅ 基本解决 | ✅ 解决 |

### MySQL vs PostgreSQL 默认隔离级别

| 数据库 | 默认隔离级别 | 说明 |
|--------|-------------|------|
| **MySQL (InnoDB)** | **REPEATABLE READ** | 通过 MVCC + Next-Key Lock 实现 |
| **PostgreSQL** | **READ COMMITTED** | 通过 MVCC 实现 |
| **Oracle** | **READ COMMITTED** | - |
| **SQL Server** | **READ COMMITTED** | - |

### MySQL 隔离级别详解

**查看当前隔离级别：**
```sql
-- 查看全局隔离级别
SELECT @@global.transaction_isolation;
-- 输出：REPEATABLE-READ

-- 查看会话隔离级别
SELECT @@session.transaction_isolation;

-- 或者
SHOW VARIABLES LIKE 'transaction_isolation';
```

**修改隔离级别：**
```sql
-- 修改全局隔离级别（影响新连接）
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 修改当前会话隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 修改下一个事务的隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
-- ...
COMMIT;
```

**配置文件修改（永久生效）：**
```ini
# my.cnf
[mysqld]
transaction-isolation = READ-COMMITTED
```

### PostgreSQL 隔离级别详解

**查看当前隔离级别：**
```sql
-- 查看当前事务隔离级别
SHOW transaction_isolation;
-- 输出：read committed

-- 查看所有隔离级别设置
SHOW ALL;
```

**设置隔离级别：**
```sql
-- 在事务开始时设置
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 或
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 执行操作
UPDATE accounts SET balance = 900 WHERE id = 1;

COMMIT;
```

**PostgreSQL 支持的隔离级别：**
- READ COMMITTED（默认）
- REPEATABLE READ
- SERIALIZABLE
- **注意**：PostgreSQL **不支持** READ UNCOMMITTED（会自动提升为 READ COMMITTED）

### MySQL REPEATABLE READ 如何实现？

**1. MVCC（多版本并发控制）**

每行记录包含隐藏字段：
- `DB_TRX_ID`：最近修改的事务 ID
- `DB_ROLL_PTR`：回滚指针，指向 Undo Log

**工作原理：**
```
事务 A 开始 → 创建 Read View（快照）
    ↓
事务 B 修改数据 → 生成新版本，旧版本保存在 Undo Log
    ↓
事务 A 查询 → 根据 Read View 判断可见性
    ↓
看到事务开始时的快照数据（不受事务 B 影响）
```

**2. Next-Key Lock（临键锁）**

防止幻读的机制：
- **记录锁（Record Lock）**：锁定特定行
- **间隙锁（Gap Lock）**：锁定记录之间的间隙
- **临键锁 = 记录锁 + 间隙锁**

**示例：**
```sql
-- 表中有数据：10, 20, 30

-- 事务 A
SELECT * FROM users WHERE id > 20 FOR UPDATE;
-- 锁定：记录 30 + 间隙 (20, +∞)

-- 事务 B
INSERT INTO users VALUES (25);  -- 阻塞等待
-- 因为 25 在 (20, +∞) 间隙中
```

### PostgreSQL READ COMMITTED 如何实现？

**MVCC 实现：**

PostgreSQL 使用不同的 MVCC 实现方式：

1. **每个事务看到的数据快照**
   - 基于事务开始时的数据库状态
   - 通过 xmin/xmax 字段判断可见性

2. **每次语句创建新快照**
   - READ COMMITTED：每条 SQL 语句开始时创建新快照
   - REPEATABLE READ：事务开始时创建快照，全程使用

3. **VACUUM 清理旧版本**
   - 定期清理不再需要的旧版本数据
   - 防止表膨胀

**示例：**
```sql
-- 事务 A（READ COMMITTED）
BEGIN;
SELECT * FROM accounts WHERE id = 1;  -- 快照 1

-- 事务 B
UPDATE accounts SET balance = 900 WHERE id = 1;
COMMIT;

-- 事务 A
SELECT * FROM accounts WHERE id = 1;  -- 快照 2，看到新数据
COMMIT;
```

### 如何选择隔离级别？

**MySQL 建议：**
- ⭐ **默认使用 REPEATABLE READ**：适合大多数场景
- **高并发 OLTP**：可考虑 READ COMMITTED（减少锁竞争）
- **金融核心系统**：考虑 SERIALIZABLE（最强一致性）

**PostgreSQL 建议：**
- ⭐ **默认使用 READ COMMITTED**：性能和一致性平衡
- **需要更强一致性**：使用 REPEATABLE READ 或 SERIALIZABLE
- **避免使用 READ UNCOMMITTED**：不被支持

### 隔离级别选择总结

| 场景 | 推荐隔离级别 | 原因 |
|------|-------------|------|
| 通用 Web 应用 | MySQL: RR / PG: RC | 平衡性能和一致性 |
| 高并发 OLTP | READ COMMITTED | 减少锁竞争，提升并发 |
| 数据分析报表 | READ COMMITTED | 需要最新数据 |
| 金融核心系统 | SERIALIZABLE | 最强一致性保障 |
| 秒杀抢购 | REPEATABLE READ + 乐观锁 | 防止超卖 |

**最佳实践：**
1. ⭐ **优先使用数据库默认隔离级别**
2. 有明确需求时才调整隔离级别
3. 尽量避免使用 SERIALIZABLE（性能差）
4. 修改前充分测试，评估对业务的影响
5. 监控锁等待和死锁情况

## 7. 分库分表之后，id 主键如何处理？

**答：** 分库分表后，传统的自增 ID 不再适用，需要使用分布式 ID 生成方案来保证全局唯一性。

### 为什么不能用自增 ID？

**问题：**
```sql
-- 单表时没问题
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

-- 分表后，每个表都有自己的自增序列
-- users_0: id = 1, 2, 3...
-- users_1: id = 1, 2, 3...
-- 会导致 ID 重复！❌
```

**解决方案：** 使用全局唯一的分布式 ID

### 分布式 ID 生成方案

#### 1. 雪花算法（Snowflake） ⭐ 最推荐

**原理：**
```
64位 Long 类型 ID 结构：
┌─────────────────────────────────────────────────────────────┐
│ 1bit │ 41bits      │ 10bits      │ 12bits                  │
│ 符号 | 时间戳       | 机器ID      | 序列号                   │
│ 位   │ (毫秒)       │ (数据中心+  │ (同一毫秒内的序列)        │
│      │             │ 机器)       │                          │
└─────────────────────────────────────────────────────────────┘

- 1 bit：符号位（固定为 0）
- 41 bits：时间戳（可用 69 年）
- 10 bits：机器 ID（支持 1024 个节点）
- 12 bits：序列号（每毫秒可生成 4096 个 ID）
```

**特点：**
- ✅ 全局唯一
- ✅ 趋势递增（有利于索引）
- ✅ 高性能（本地生成，无网络开销）
- ✅ 高可用（不依赖第三方服务）
- ❌ 依赖系统时钟（时钟回拨问题）

**Java 实现示例：**
```java
public class SnowflakeIdGenerator {
    private final long twepoch = 1288834974657L;
    private final long workerIdBits = 5L;
    private final long datacenterIdBits = 5L;
    private final long sequenceBits = 12L;
    
    private final long workerId;
    private final long datacenterId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;
    
    public synchronized long nextId() {
        long timestamp = timeGen();
        
        // 时钟回拨检查
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("Clock moved backwards");
        }
        
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & 4095;
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        
        return ((timestamp - twepoch) << 22)
            | (datacenterId << 17)
            | (workerId << 12)
            | sequence;
    }
}
```

**处理时钟回拨：**
```java
// 方案 1：等待时钟追上
private long tilNextMillis(long lastTimestamp) {
    long timestamp = timeGen();
    while (timestamp <= lastTimestamp) {
        timestamp = timeGen();
    }
    return timestamp;
}

// 方案 2：使用备用 Worker ID
// 方案 3：抛出异常，由上层重试
```

#### 2. 数据库号段模式

**原理：**
- 从数据库批量获取 ID 段
- 在内存中分配
- 用完后再次获取

**实现：**
```sql
-- 创建 ID 生成表
CREATE TABLE id_generator (
    biz_tag VARCHAR(50) PRIMARY KEY,  -- 业务标识
    max_id BIGINT NOT NULL,           -- 当前最大 ID
    step INT NOT NULL,                -- 步长
    update_time DATETIME NOT NULL
);

-- 初始化
INSERT INTO id_generator VALUES ('user', 0, 1000, NOW());

-- 获取新号段
UPDATE id_generator 
SET max_id = max_id + step 
WHERE biz_tag = 'user';

-- 应用层使用 [max_id - step + 1, max_id] 范围内的 ID
```

**特点：**
- ✅ ID 趋势递增
- ✅ 性能较好（批量获取）
- ✅ 可控性强
- ❌ 依赖数据库
- ❌ 有单点故障风险

**优化：双 Buffer 机制**
```java
// 维护两个号段，一个用完切换另一个
// 同时异步加载新的号段
// 避免获取号段时的阻塞
```

#### 3. Redis 生成 ID

**原理：**
```bash
# 利用 Redis INCR 命令的原子性
INCR user_id_seq  # 返回 1, 2, 3...
```

**优化（提高性能）：**
```lua
-- Lua 脚本批量获取
local key = KEYS[1]
local step = tonumber(ARGV[1])
local current = redis.call('INCRBY', key, step)
return current - step + 1
```

**特点：**
- ✅ 性能极高
- ✅ 实现简单
- ❌ 依赖 Redis
- ❌ ID 不连续（重启后可能重复）
- ❌ 需要持久化配置

#### 4. UUID

**特点：**
- ✅ 全球唯一
- ✅ 本地生成，无依赖
- ❌ 无序，导致索引碎片
- ❌ 存储空间大（36字符）
- ❌ 查询性能差

**不推荐用于分库分表主键！**

```sql
-- ❌ 不好：UUID 作为主键
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(50)
);

-- B+ 树索引会频繁分裂，性能差
```

**优化：使用 UUID 的二进制格式**
```sql
-- 稍好：使用 BINARY(16) 存储
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(50)
);

-- 但仍存在无序问题
```

#### 5. 美团 Leaf / 滴滴 Tinyid

**开源分布式 ID 生成服务：**
- 结合了号段模式和雪花算法的优点
- 高可用、高性能
- 提供 HTTP API

**Leaf 特点：**
- Leaf-segment：号段模式
- Leaf-snowflake：雪花算法
- 支持双 buffer 优化
- 监控和告警完善

### 各方案对比

| 方案 | 唯一性 | 递增性 | 性能 | 复杂度 | 依赖性 |
|------|--------|--------|------|--------|--------|
| 雪花算法 | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 中 | 无 |
| 号段模式 | ✅ | ✅ | ⭐⭐⭐⭐ | 中 | 数据库 |
| Redis | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 低 | Redis |
| UUID | ✅ | ❌ | ⭐⭐⭐ | 低 | 无 |
| Leaf/Tinyid | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 高 | 独立服务 |

### 分库分表主键最佳实践

**推荐方案：雪花算法** ⭐

**原因：**
1. 性能最好（本地生成）
2. 趋势递增（索引友好）
3. 无外部依赖
4. 成熟稳定

**实施步骤：**

#### 1. 选择数据类型

```sql
-- ✅ 推荐：BIGINT
CREATE TABLE users_0 (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50),
    create_time DATETIME
);

-- ❌ 不推荐：VARCHAR（UUID）
CREATE TABLE users_0 (
    id VARCHAR(36) PRIMARY KEY,
    ...
);
```

#### 2. 集成雪花算法

```java
@Service
public class UserService {
    @Autowired
    private SnowflakeIdGenerator idGenerator;
    
    public void createUser(User user) {
        // 生成分布式 ID
        long id = idGenerator.nextId();
        user.setId(id);
        
        // 根据 ID 路由到对应表
        String tableName = "users_" + (id % 10);
        userMapper.insertIntoTable(tableName, user);
    }
}
```

#### 3. 兼容旧数据迁移

```sql
-- 迁移方案：保留原 ID，新增分布式 ID
ALTER TABLE users ADD COLUMN distributed_id BIGINT;

-- 逐步迁移
UPDATE users SET distributed_id = snowflake_next_id() 
WHERE distributed_id IS NULL LIMIT 1000;

-- 切换完成后，将 distributed_id 改为主键
ALTER TABLE users DROP PRIMARY KEY, ADD PRIMARY KEY (distributed_id);
```

#### 4. 路由策略

```java
// 根据 ID 取模路由
public String getTableName(long userId) {
    int tableIndex = (int) (userId % 10);  // 10 个表
    return "users_" + tableIndex;
}

// 根据 ID 范围路由
public String getTableName(long userId) {
    if (userId < 1000000) {
        return "users_0";
    } else if (userId < 2000000) {
        return "users_1";
    }
    // ...
}
```

### 其他注意事项

#### 1. 分片键（Sharding Key）选择

**原则：**
- ✅ 高频查询字段
- ✅ 区分度高的字段
- ✅ 避免热点数据

**示例：**
```sql
-- ✅ 好：按 user_id 分片
-- 查询：SELECT * FROM orders WHERE user_id = 123
-- 直接路由到 orders_3（123 % 10 = 3）

-- ❌ 不好：按 status 分片
-- 大部分订单都是已完成状态，导致数据倾斜
```

#### 2. 跨分片查询问题

**问题：**
```sql
-- ❌ 跨分片查询，性能差
SELECT * FROM orders WHERE create_time > '2024-01-01';
-- 需要扫描所有分片，然后合并结果
```

**解决方案：**
- 使用 ES/MongoDB 做异构索引
- 建立汇总表
- 限制查询范围（必须带分片键）

#### 3. 分布式事务

**方案：**
- Seata（AT 模式）
- TCC（Try-Confirm-Cancel）
- 本地消息表
- RocketMQ 事务消息

#### 4. 扩容方案

**双倍扩容法：**
```
原始：users_0, users_1 (user_id % 2)
扩容：users_0, users_1, users_2, users_3 (user_id % 4)

迁移步骤：
1. 新增 users_2, users_3
2. 迁移 users_0 中奇数 ID 到 users_1
3. 迁移 users_1 中偶数 ID 到 users_0
4. 修改路由规则
```

### 总结

**分库分表主键选择建议：**
1. ⭐ **首选雪花算法**：性能好、递增、无依赖
2. **次选号段模式**：可控性强、适合已有数据库架构
3. **避免 UUID**：无序导致性能差
4. **Redis 方案**：适合已有 Redis 集群的场景

**关键要点：**
- 使用 BIGINT 类型存储 ID
- 保证全局唯一
- 尽量趋势递增
- 考虑时钟回拨问题
- 做好数据迁移方案

## 8. 说说 MySQL 中一条查询语句是如何执行的？

**答：** MySQL 查询执行分为 **Server 层** 和 **引擎层** 两个部分。

### 整体架构图

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

### 详细执行流程

以 `SELECT * FROM users WHERE id = 1;` 为例：

#### 1. 连接器（Connector）

**作用：** 管理连接、权限验证

**流程：**
- 检查用户名密码是否正确
- 验证用户是否有该数据库的权限
- 建立连接后，权限判断不再重复

**长连接优化：**
```sql
-- 查看当前连接
SHOW PROCESSLIST;

-- 主动断开空闲连接
mysql_close();

-- 或者执行后重置连接
SELECT 1;  -- 保持连接活跃
```

**常见问题：**
- 长连接占用内存过多
- 连接数达到上限
- 解决：使用连接池、定期断开重连

#### 2. 查询缓存（Query Cache） - MySQL 8.0 已移除

**作用：** 缓存 SELECT 语句和结果

**问题：**
- 表更新会清空所有缓存
- 命中率低
- 锁竞争严重

**现状：** MySQL 8.0 已完全移除

**替代方案：** 使用 Redis 等外部缓存

#### 3. 分析器（Analyzer）

**词法分析：** 识别关键字、表名、字段名

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

**语法分析：** 检查 SQL 是否符合 MySQL 语法

```sql
-- ❌ 语法错误
SELCT * FROM users;  -- SELECT 拼写错误

-- ✅ 正确
SELECT * FROM users;
```

#### 4. 优化器（Optimizer）

**作用：** 选择最优执行计划

**决策内容：**
- 选择使用哪个索引
- 多表 JOIN 的顺序
- 是否使用临时表、文件排序

**示例：**
```sql
-- 假设有 idx_name 和 idx_age 两个索引
SELECT * FROM users WHERE name = '张三' AND age = 20;

-- 优化器会根据统计信息决定使用哪个索引
-- 可以通过 EXPLAIN 查看
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20;
```

**优化策略：**
- 索引选择：基于成本模型
- 表连接顺序：小表驱动大表
- 子查询优化：转换为 JOIN
- 条件简化：常量折叠

#### 5. 执行器（Executor）

**作用：** 调用存储引擎接口，执行查询

**流程：**
1. 检查用户对表的查询权限
2. 调用引擎接口，获取第一行数据
3. 判断是否符合条件，符合则加入结果集
4. 继续获取下一行，直到最后一行
5. 返回结果集给客户端

**示例：**
```sql
-- 执行器会调用 InnoDB 引擎的接口
-- InnoDB 通过主键索引快速定位到 id=1 的记录
SELECT * FROM users WHERE id = 1;
```

**权限检查：**
```sql
-- 如果用户没有 SELECT 权限
ERROR 1142 (42000): SELECT command denied to user 'xxx'@'localhost'
```

#### 6. 存储引擎层

**InnoDB：**
- 通过 B+ 树索引定位数据
- 从 Buffer Pool 或磁盘读取数据页
- 返回记录给执行器

**MyISAM：**
- 类似的索引查找过程
- 不支持事务、行锁

### 各阶段性能分析

**查看 SQL 执行各阶段耗时：**

```sql
-- 开启 profiling
SET profiling = 1;

-- 执行查询
SELECT * FROM users WHERE id = 1;

-- 查看各阶段耗时
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;

-- 输出示例：
-- Status                    | Duration
-- starting                  | 0.000050
-- checking permissions      | 0.000010
-- Opening tables            | 0.000020
-- init                      | 0.000030
-- System lock               | 0.000010
-- optimizing                | 0.000010  ← 优化器
-- statistics                | 0.000020
-- preparing                 | 0.000010
-- executing                 | 0.000005  ← 执行器
-- Sending data              | 0.000100  ← 引擎层读取数据
-- end                       | 0.000005
-- query end                 | 0.000005
-- closing tables            | 0.000010
-- freeing items             | 0.000010
-- cleaning up               | 0.000010
```

### 慢查询通常卡在哪个阶段？

| 阶段 | 慢的原因 | 解决方案 |
|------|---------|----------|
| **优化器** | 复杂 SQL、多表 JOIN | 简化 SQL、添加索引 |
| **执行器** | 全表扫描、锁等待 | 添加索引、优化事务 |
| **引擎层** | 磁盘 I/O、Buffer Pool 不足 | 增加内存、优化索引 |
| **网络** | 返回数据量大 | 分页、只查需要的列 |

### UPDATE 语句的执行流程

UPDATE 语句比 SELECT 多了日志写入过程：

```sql
UPDATE users SET name = '李四' WHERE id = 1;
```

**额外步骤：**
1. **写 Undo Log**：记录回滚信息（保证原子性）
2. **更新数据**：在 Buffer Pool 中修改数据
3. **写 Redo Log**：记录修改操作（保证持久性）
4. **写 Binlog**：记录逻辑变更（用于主从复制）
5. **两阶段提交**：确保 Redo Log 和 Binlog 一致性

**两阶段提交流程：**
```
1. 执行器调用引擎接口更新数据
2. 引擎生成 Redo Log（prepare 状态）
3. 执行器生成 Binlog
4. 引擎提交 Redo Log（commit 状态）
```

### INSERT 语句的执行流程

```sql
INSERT INTO users (name, age) VALUES ('张三', 20);
```

**流程：**
1. 解析 SQL
2. 检查权限
3. 检查约束（主键、唯一、外键等）
4. 生成执行计划
5. 调用引擎接口插入数据
6. 写 Undo Log（用于回滚）
7. 更新索引
8. 写 Redo Log
9. 写 Binlog
10. 提交事务

### DELETE 语句的执行流程

```sql
DELETE FROM users WHERE id = 1;
```

**流程：**
1. 解析 SQL
2. 检查权限
3. 生成执行计划
4. 调用引擎接口删除数据
5. 标记删除（InnoDB 不立即物理删除）
6. 写 Undo Log
7. 更新索引
8. 写 Redo Log
9. 写 Binlog
10. 提交事务

**注意：** InnoDB 的 DELETE 只是标记删除，空间不会立即释放，需要 PURGE 线程清理。

### 总结

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

## 9. 讲解一下 DDL、DML、DCL、TCL 的区别？

**答：** SQL 语句根据其功能可以分为四大类：DDL、DML、DCL 和 TCL。

### 1. DDL（Data Definition Language）- 数据定义语言

**作用：** 定义和管理数据库对象的结构（schema）

**常用命令：**
- `CREATE`：创建数据库对象
- `ALTER`：修改数据库对象
- `DROP`：删除数据库对象
- `TRUNCATE`：清空表数据
- `RENAME`：重命名对象

**示例：**
```sql
-- 创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT,
    email VARCHAR(100)
);

-- 修改表结构
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users MODIFY COLUMN name VARCHAR(100);

-- 删除表
DROP TABLE users;

-- 清空表（保留结构）
TRUNCATE TABLE users;

-- 创建索引
CREATE INDEX idx_name ON users(name);

-- 创建视图
CREATE VIEW user_view AS SELECT id, name FROM users;
```

**特点：**
- ✅ 操作的是数据库对象的结构
- ✅ 自动提交，不能回滚
- ✅ 会隐式提交当前事务
- ⚠️ 谨慎使用，特别是 DROP 操作

### 2. DML（Data Manipulation Language）- 数据操作语言

**作用：** 操作数据库中的数据（增删改查）

**常用命令：**
- `INSERT`：插入数据
- `UPDATE`：更新数据
- `DELETE`：删除数据
- `SELECT`：查询数据

**示例：**
```sql
-- 插入数据
INSERT INTO users (name, age, email) VALUES ('张三', 20, 'zhangsan@example.com');
INSERT INTO users (name, age) VALUES ('李四', 25), ('王五', 30);  -- 批量插入

-- 更新数据
UPDATE users SET age = 21 WHERE name = '张三';
UPDATE users SET age = age + 1 WHERE age < 30;  -- 批量更新

-- 删除数据
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE age > 50;  -- 批量删除

-- 查询数据
SELECT * FROM users;
SELECT name, age FROM users WHERE age > 20;
SELECT COUNT(*) FROM users;
```

**特点：**
- ✅ 操作的是表中的数据
- ✅ 可以在事务中执行，支持回滚
- ✅ 最频繁使用的 SQL 类型
- ⚠️ SELECT 有时被单独归类为 DQL（Data Query Language）

### 3. DCL（Data Control Language）- 数据控制语言

**作用：** 控制数据库的访问权限和安全

**常用命令：**
- `GRANT`：授予权限
- `REVOKE`：撤销权限

**示例：**
```sql
-- 创建用户
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password123';

-- 授予权限
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON mydb.* TO 'admin_user'@'localhost';

-- 撤销权限
REVOKE DELETE ON mydb.users FROM 'app_user'@'localhost';

-- 查看权限
SHOW GRANTS FOR 'app_user'@'localhost';

-- 删除用户
DROP USER 'app_user'@'localhost';
```

**权限级别：**
- **全局权限**：`*.*`（所有数据库的所有表）
- **数据库权限**：`mydb.*`（指定数据库的所有表）
- **表权限**：`mydb.users`（指定表）
- **列权限**：`mydb.users(name, age)`（指定列）

**常见权限：**
- `SELECT`：查询
- `INSERT`：插入
- `UPDATE`：更新
- `DELETE`：删除
- `CREATE`：创建
- `DROP`：删除
- `ALTER`：修改
- `ALL PRIVILEGES`：所有权限

**特点：**
- ✅ 由 DBA（数据库管理员）使用
- ✅ 控制用户访问权限
- ✅ 保障数据库安全
- ⚠️ 遵循最小权限原则

### 4. TCL（Transaction Control Language）- 事务控制语言

**作用：** 管理数据库事务

**常用命令：**
- `BEGIN` / `START TRANSACTION`：开始事务
- `COMMIT`：提交事务
- `ROLLBACK`：回滚事务
- `SAVEPOINT`：设置保存点
- `RELEASE SAVEPOINT`：释放保存点

**示例：**
```sql
-- 基本事务
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- 提交事务

-- 回滚事务
START TRANSACTION;
DELETE FROM orders WHERE status = 'cancelled';
ROLLBACK;  -- 回滚，数据恢复

-- 使用保存点
START TRANSACTION;
INSERT INTO users (name) VALUES ('张三');
SAVEPOINT sp1;
INSERT INTO users (name) VALUES ('李四');
ROLLBACK TO sp1;  -- 回滚到保存点，只保留张三
COMMIT;

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
-- ...
COMMIT;
```

**特点：**
- ✅ 保证数据的 ACID 特性
- ✅ 只对 DML 语句有效
- ✅ DDL 语句会自动提交事务
- ⚠️ 注意事务粒度，避免长事务

### 四类 SQL 对比总结

| 类型 | 全称 | 作用 | 常用命令 | 是否可回滚 | 使用者 |
|------|------|------|---------|-----------|--------|
| **DDL** | Data Definition Language | 定义数据结构 | CREATE, ALTER, DROP, TRUNCATE | ❌ 否 | DBA、开发 |
| **DML** | Data Manipulation Language | 操作数据 | INSERT, UPDATE, DELETE, SELECT | ✅ 是 | 开发 |
| **DCL** | Data Control Language | 控制权限 | GRANT, REVOKE | ❌ 否 | DBA |
| **TCL** | Transaction Control Language | 控制事务 | COMMIT, ROLLBACK, SAVEPOINT | - | 开发 |

### 实际应用场景

**场景 1：创建新用户并授权**
```sql
-- DCL：创建用户
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password123';

-- DCL：授予权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'%';

-- DDL：创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);

-- DML：插入数据
INSERT INTO users (name) VALUES ('张三');
```

**场景 2：转账操作**
```sql
-- TCL：开始事务
START TRANSACTION;

-- DML：扣款
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

-- DML：收款
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- TCL：提交事务
COMMIT;

-- 如果出错
ROLLBACK;  -- 回滚
```

**场景 3：表结构变更**
```sql
-- DDL：添加字段
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- DDL：创建索引
CREATE INDEX idx_phone ON users(phone);

-- DML：更新数据
UPDATE users SET phone = '13800138000' WHERE id = 1;
```

### 注意事项

**1. DDL 会隐式提交事务**
```sql
START TRANSACTION;
INSERT INTO users (name) VALUES ('张三');  -- DML

CREATE TABLE test (id INT);  -- DDL，会自动提交前面的 INSERT

ROLLBACK;  -- ❌ 无效，张三已经插入
```

**2. TRUNCATE vs DELETE**
```sql
-- TRUNCATE 是 DDL，不能回滚
TRUNCATE TABLE users;  -- 快速清空，无法回滚

-- DELETE 是 DML，可以回滚
DELETE FROM users;  -- 可以回滚
```

**3. 权限管理最佳实践**
```sql
-- ✅ 好：最小权限原则
GRANT SELECT, INSERT ON mydb.users TO 'app_user'@'localhost';

-- ❌ 不好：授予过多权限
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'localhost';
```

**4. 事务控制最佳实践**
```sql
-- ✅ 好：短事务
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- ❌ 不好：长事务
START TRANSACTION;
SELECT * FROM users;  -- 大量查询
-- ... 业务逻辑处理 ...
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### 总结

**核心区别：**
- **DDL**：操作结构（表、索引、视图等），自动提交
- **DML**：操作数据（增删改查），可回滚
- **DCL**：操作权限（授权、撤销），DBA 使用
- **TCL**：操作事务（提交、回滚），配合 DML 使用

**记忆技巧：**
- **D**ata **D**efinition → **DDL**（定义结构）
- **D**ata **M**anipulation → **DML**（操作数据）
- **D**ata **C**ontrol → **DCL**（控制权限）
- **T**ransaction **C**ontrol → **TCL**（控制事务）

## 10. 存储过程和触发器的作用

**答：** 存储过程和触发器都是数据库中的可编程对象，用于封装业务逻辑，但它们的触发方式和使用场景不同。

### 一、存储过程（Stored Procedure）

#### 1. 什么是存储过程？

存储过程是一组预编译的 SQL 语句集合，存储在数据库中，可以通过名称调用执行。

**特点：**
- ✅ 预编译，执行效率高
- ✅ 封装复杂业务逻辑
- ✅ 减少网络传输
- ✅ 提高安全性
- ❌ 调试困难
- ❌ 可移植性差

#### 2. 创建和调用存储过程

**基本语法：**
```sql
DELIMITER $$  -- 修改分隔符

CREATE PROCEDURE procedure_name([IN|OUT|INOUT] param_name param_type)
BEGIN
    -- SQL 语句
END $$

DELIMITER ;  -- 恢复分隔符

-- 调用存储过程
CALL procedure_name(param_value);
```

**示例：转账存储过程**
```sql
DELIMITER $$

CREATE PROCEDURE transfer_money(
    IN from_account INT,
    IN to_account INT,
    IN amount DECIMAL(10, 2),
    OUT result VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET result = '转账失败';
    END;
    
    START TRANSACTION;
    
    -- 检查余额
    DECLARE from_balance DECIMAL(10, 2);
    SELECT balance INTO from_balance 
    FROM accounts WHERE id = from_account;
    
    IF from_balance < amount THEN
        SET result = '余额不足';
        ROLLBACK;
    ELSE
        UPDATE accounts SET balance = balance - amount WHERE id = from_account;
        UPDATE accounts SET balance = balance + amount WHERE id = to_account;
        COMMIT;
        SET result = '转账成功';
    END IF;
END $$

DELIMITER ;

-- 调用
CALL transfer_money(1, 2, 100, @result);
SELECT @result;
```

#### 3. 存储过程的优点

- **提高性能**：预编译，执行计划缓存
- **封装业务逻辑**：复杂逻辑在数据库层实现
- **提高安全性**：限制用户只能执行存储过程
- **代码复用**：多处调用，统一维护

#### 4. 存储过程的缺点

- **调试困难**：缺乏好的调试工具
- **可移植性差**：不同数据库语法不同
- **维护困难**：业务逻辑分散
- **扩展性差**：难以单元测试

### 二、触发器（Trigger）

#### 1. 什么是触发器？

触发器是一种特殊的存储过程，在特定的数据库事件（INSERT、UPDATE、DELETE）发生时自动执行。

**特点：**
- ✅ 自动执行，无需手动调用
- ✅ 保证数据一致性
- ✅ 实现审计日志
- ❌ 性能影响
- ❌ 调试困难
- ❌ 可能产生连锁反应

#### 2. 创建触发器

**基本语法：**
```sql
CREATE TRIGGER trigger_name
{BEFORE | AFTER} {INSERT | UPDATE | DELETE}
ON table_name
FOR EACH ROW
BEGIN
    -- SQL 语句
END;
```

**示例：审计日志触发器**
```sql
-- 创建审计表
CREATE TABLE users_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    old_name VARCHAR(50),
    new_name VARCHAR(50),
    operation VARCHAR(10),
    operation_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建触发器
DELIMITER $$

CREATE TRIGGER trg_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO users_audit (user_id, old_name, new_name, operation)
    VALUES (OLD.id, OLD.name, NEW.name, 'UPDATE');
END $$

DELIMITER ;

-- 测试
UPDATE users SET name = '新名字' WHERE id = 1;

-- 查看审计日志
SELECT * FROM users_audit;
```

#### 3. 触发器的优点

- **自动执行**：无需应用层调用
- **集中管理**：数据验证逻辑在数据库层
- **实现审计**：自动记录数据变更
- **简化代码**：应用层无需关心细节

#### 4. 触发器的缺点

- **性能影响**：每次操作都触发
- **调试困难**：隐式执行，不易发现
- **连锁反应**：可能触发其他触发器
- **维护困难**：依赖关系复杂

### 三、存储过程 vs 触发器对比

| 特性 | 存储过程 | 触发器 |
|------|---------|--------|
| **调用方式** | 手动调用（CALL） | 自动触发 |
| **触发时机** | 显式调用时 | INSERT/UPDATE/DELETE 时 |
| **参数** | 支持 IN/OUT/INOUT | 不支持 |
| **返回值** | 可以有返回值 | 不能有返回值 |
| **事务控制** | 可以控制事务 | 不能使用事务控制 |
| **使用场景** | 复杂业务逻辑 | 数据验证、审计、级联操作 |

### 四、最佳实践

**存储过程：**
- ✅ 适合：复杂批量处理、报表、数据迁移
- ❌ 不适合：简单 CRUD、频繁变化的逻辑
- 💡 建议：适度使用，优先考虑应用层实现

**触发器：**
- ✅ 适合：审计日志、数据验证、自动计算
- ❌ 不适合：复杂业务逻辑、大量数据操作
- 💡 建议：保持简单，避免嵌套

**核心原则：**
1. ⭐ **业务逻辑优先在应用层实现**
2. **数据库层只做数据持久化和简单验证**
3. **存储过程和触发器作为补充手段**
4. **权衡性能和可维护性**

## 11. MySQL 如何行转列和列转行

**答：** 行转列和列转行是数据库中常见的数据转换操作，用于改变数据的展示形式。

### 一、行转列（Pivot）

#### 1. 什么是行转列？

行转列是将多行数据转换为多列显示，通常用于报表展示。

**示例场景：**
```
原始数据（行）：
| 姓名 | 科目 | 分数 |
|------|------|------|
| 张三 | 语文 | 80   |
| 张三 | 数学 | 90   |
| 张三 | 英语 | 85   |
| 李四 | 语文 | 70   |
| 李四 | 数学 | 95   |
| 李四 | 英语 | 88   |

行转列后（列）：
| 姓名 | 语文 | 数学 | 英语 |
|------|------|------|------|
| 张三 | 80   | 90   | 85   |
| 李四 | 70   | 95   | 88   |
```

#### 2. 使用 CASE WHEN 实现行转列

**方法 1：CASE WHEN + 聚合函数**

```sql
-- 创建测试表
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    subject VARCHAR(50),
    score INT
);

-- 插入测试数据
INSERT INTO scores (name, subject, score) VALUES
('张三', '语文', 80),
('张三', '数学', 90),
('张三', '英语', 85),
('李四', '语文', 70),
('李四', '数学', 95),
('李四', '英语', 88),
('王五', '语文', 90),
('王五', '数学', 85),
('王五', '英语', 92);

-- 行转列
SELECT 
    name,
    MAX(CASE WHEN subject = '语文' THEN score END) AS chinese,
    MAX(CASE WHEN subject = '数学' THEN score END) AS math,
    MAX(CASE WHEN subject = '英语' THEN score END) AS english
FROM scores
GROUP BY name;

-- 结果：
-- | name | chinese | math | english |
-- |------|---------|------|----------|
-- | 张三 | 80      | 90   | 85       |
-- | 李四 | 70      | 95   | 88       |
-- | 王五 | 90      | 85   | 92       |
```

**原理说明：**
```
1. CASE WHEN 将符合条件的值提取出来
2. 其他情况返回 NULL
3. GROUP BY 按姓名分组
4. MAX/MIN/SUM 等聚合函数忽略 NULL，得到最终值
```

**方法 2：使用 IF 函数**

```sql
SELECT 
    name,
    MAX(IF(subject = '语文', score, NULL)) AS chinese,
    MAX(IF(subject = '数学', score, NULL)) AS math,
    MAX(IF(subject = '英语', score, NULL)) AS english
FROM scores
GROUP BY name;
```

#### 3. 动态行转列

当科目数量不固定时，需要使用动态 SQL：

```sql
-- 生成动态 SQL
SET @sql = NULL;

SELECT GROUP_CONCAT(DISTINCT
    CONCAT(
        'MAX(CASE WHEN subject = ''',
        subject,
        ''' THEN score END) AS `',
        subject,
        '`'
    )
) INTO @sql
FROM scores;

SET @sql = CONCAT('SELECT name, ', @sql, ' FROM scores GROUP BY name');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

#### 4. 实际应用场景

**场景 1：销售报表**
```sql
-- 原始数据：每月的销售记录
SELECT 
    product_name,
    SUM(CASE WHEN MONTH(sale_date) = 1 THEN amount END) AS jan,
    SUM(CASE WHEN MONTH(sale_date) = 2 THEN amount END) AS feb,
    SUM(CASE WHEN MONTH(sale_date) = 3 THEN amount END) AS mar,
    SUM(CASE WHEN MONTH(sale_date) = 4 THEN amount END) AS apr,
    SUM(CASE WHEN MONTH(sale_date) = 5 THEN amount END) AS may,
    SUM(CASE WHEN MONTH(sale_date) = 6 THEN amount END) AS jun,
    SUM(CASE WHEN MONTH(sale_date) = 7 THEN amount END) AS jul,
    SUM(CASE WHEN MONTH(sale_date) = 8 THEN amount END) AS aug,
    SUM(CASE WHEN MONTH(sale_date) = 9 THEN amount END) AS sep,
    SUM(CASE WHEN MONTH(sale_date) = 10 THEN amount END) AS oct,
    SUM(CASE WHEN MONTH(sale_date) = 11 THEN amount END) AS nov,
    SUM(CASE WHEN MONTH(sale_date) = 12 THEN amount END) AS dec
FROM sales
WHERE YEAR(sale_date) = 2024
GROUP BY product_name;
```

**场景 2：员工考勤统计**
```sql
SELECT 
    employee_id,
    COUNT(CASE WHEN status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN status = 'absent' THEN 1 END) AS absent_days,
    COUNT(CASE WHEN status = 'late' THEN 1 END) AS late_days
FROM attendance
WHERE month = '2024-01'
GROUP BY employee_id;
```

### 二、列转行（Unpivot）

#### 1. 什么是列转行？

列转行是将多列数据转换为多行显示，是行转列的逆操作。

**示例场景：**
```
原始数据（列）：
| 姓名 | 语文 | 数学 | 英语 |
|------|------|------|------|
| 张三 | 80   | 90   | 85   |
| 李四 | 70   | 95   | 88   |

列转行后（行）：
| 姓名 | 科目 | 分数 |
|------|------|------|
| 张三 | 语文 | 80   |
| 张三 | 数学 | 90   |
| 张三 | 英语 | 85   |
| 李四 | 语文 | 70   |
| 李四 | 数学 | 95   |
| 李四 | 英语 | 88   |
```

#### 2. 使用 UNION ALL 实现列转行

**方法 1：UNION ALL**

```sql
-- 创建测试表
CREATE TABLE student_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    chinese INT,
    math INT,
    english INT
);

-- 插入测试数据
INSERT INTO student_scores (name, chinese, math, english) VALUES
('张三', 80, 90, 85),
('李四', 70, 95, 88),
('王五', 90, 85, 92);

-- 列转行
SELECT name, '语文' AS subject, chinese AS score FROM student_scores
UNION ALL
SELECT name, '数学' AS subject, math AS score FROM student_scores
UNION ALL
SELECT name, '英语' AS subject, english AS score FROM student_scores
ORDER BY name, subject;

-- 结果：
-- | name | subject | score |
-- |------|---------|-------|
-- | 张三 | 语文    | 80    |
-- | 张三 | 数学    | 90    |
-- | 张三 | 英语    | 85    |
-- | 李四 | 语文    | 70    |
-- | 李四 | 数学    | 95    |
-- | 李四 | 英语    | 88    |
```

**方法 2：使用 CROSS JOIN**

```sql
SELECT 
    s.name,
    subj.subject,
    CASE subj.subject
        WHEN '语文' THEN s.chinese
        WHEN '数学' THEN s.math
        WHEN '英语' THEN s.english
    END AS score
FROM student_scores s
CROSS JOIN (
    SELECT '语文' AS subject
    UNION ALL SELECT '数学'
    UNION ALL SELECT '英语'
) subj
ORDER BY s.name, subj.subject;
```

#### 3. 实际应用场景

**场景 1：标准化数据存储**
```sql
-- 将宽表转换为窄表，便于分析
SELECT user_id, 'age' AS attribute, CAST(age AS CHAR) AS value FROM users
UNION ALL
SELECT user_id, 'gender' AS attribute, gender AS value FROM users
UNION ALL
SELECT user_id, 'city' AS attribute, city AS value FROM users;
```

**场景 2：数据导入导出**
```sql
-- 将 Excel 格式的列数据转换为数据库行数据
SELECT product_id, 'Q1' AS quarter, q1_sales AS sales FROM products
UNION ALL
SELECT product_id, 'Q2' AS quarter, q2_sales AS sales FROM products
UNION ALL
SELECT product_id, 'Q3' AS quarter, q3_sales AS sales FROM products
UNION ALL
SELECT product_id, 'Q4' AS quarter, q4_sales AS sales FROM products;
```

### 三、行转列 vs 列转行对比

| 特性 | 行转列（Pivot） | 列转行（Unpivot） |
|------|----------------|------------------|
| **方向** | 多行 → 多列 | 多列 → 多行 |
| **常用方法** | CASE WHEN + 聚合 | UNION ALL |
| **应用场景** | 报表展示、数据统计 | 数据标准化、数据清洗 |
| **复杂度** | 中等 | 简单 |
| **性能** | 较好 | 一般（UNION ALL 多次扫描） |

### 四、注意事项

#### 1. NULL 值处理

```sql
-- 行转列时，使用 COALESCE 处理 NULL
SELECT 
    name,
    COALESCE(MAX(CASE WHEN subject = '语文' THEN score END), 0) AS chinese,
    COALESCE(MAX(CASE WHEN subject = '数学' THEN score END), 0) AS math
FROM scores
GROUP BY name;
```

#### 2. 聚合函数选择

```sql
-- 根据需求选择合适的聚合函数
MAX()   -- 取最大值
MIN()   -- 取最小值
SUM()   -- 求和
AVG()   -- 平均值
COUNT() -- 计数
```

#### 3. 性能优化

```sql
-- ✅ 好：添加索引
CREATE INDEX idx_scores_name_subject ON scores(name, subject);

-- ✅ 好：限制数据范围
SELECT name,
    MAX(CASE WHEN subject = '语文' THEN score END) AS chinese
FROM scores
WHERE create_time >= '2024-01-01'
GROUP BY name;
```

#### 4. MySQL 8.0+ 新特性

MySQL 8.0.14+ 支持 JSON_TABLE，可以更灵活地处理行列转换：

```sql
-- 使用 JSON 进行行列转换（高级用法）
SELECT 
    name,
    JSON_EXTRACT(scores_json, '$.chinese') AS chinese,
    JSON_EXTRACT(scores_json, '$.math') AS math
FROM (
    SELECT 
        name,
        CONCAT('{"chinese":', 
            MAX(CASE WHEN subject = '语文' THEN score END),
            ',"math":',
            MAX(CASE WHEN subject = '数学' THEN score END),
            '}') AS scores_json
    FROM scores
    GROUP BY name
) t;
```

### 五、总结

**行转列：**
- ✅ 使用 CASE WHEN + 聚合函数
- ✅ 适合报表展示、数据统计
- 💡 科目固定时用静态 SQL，不固定时用动态 SQL

**列转行：**
- ✅ 使用 UNION ALL
- ✅ 适合数据标准化、数据清洗
- 💡 注意性能，避免过多 UNION

**最佳实践：**
1. ⭐ **优先在应用层处理**：复杂的行列转换建议在代码中实现
2. **数据库层做简单转换**：只处理简单的行列转换
3. **注意性能**：大数据量时考虑分页、缓存
4. **保持可读性**：使用注释说明转换逻辑

## 12. 如何查看 SQL 执行计划？

**答：** MySQL 提供了多种方式来查看 SQL 执行计划，帮助优化查询性能。

### 一、EXPLAIN 命令

#### 1. 基本用法

```sql
-- 基本语法
EXPLAIN SELECT * FROM users WHERE id = 1;

-- 或者
EXPLAIN SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.age > 18;
```

#### 2. EXPLAIN 输出字段详解

```sql
EXPLAIN SELECT * FROM users WHERE age > 20;
```

**输出示例：**
```
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | users | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 1000 |    33.33 | Using where |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
```

**字段说明：**

##### (1) id

- **含义**：SELECT 标识符，表示查询中执行 SELECT 子句或操作表的顺序
- **规则**：
  - id 相同：执行顺序从上到下
  - id 不同：id 值越大，优先级越高，越先执行
  - id 为 NULL：表示这是一个结果集，不需要使用它来进行查询

```sql
-- id 相同
EXPLAIN SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id;
-- 两个表的 id 都是 1，从上到下执行

-- id 不同
EXPLAIN SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE status = 1
);
-- 子查询的 id 更大，先执行
```

##### (2) select_type

| 类型 | 说明 |
|------|------|
| **SIMPLE** | 简单查询（不使用 UNION 或子查询） |
| **PRIMARY** | 最外层的 SELECT |
| **UNION** | UNION 中的第二个或后面的 SELECT |
| **DEPENDENT UNION** | 依赖于外部查询的 UNION |
| **UNION RESULT** | UNION 的结果 |
| **SUBQUERY** | 子查询中的第一个 SELECT |
| **DEPENDENT SUBQUERY** | 依赖于外部查询的子查询 |
| **DERIVED** | 派生表（FROM 子句中的子查询） |

```sql
-- SIMPLE
EXPLAIN SELECT * FROM users WHERE id = 1;

-- PRIMARY + SUBQUERY
EXPLAIN SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders
);

-- DERIVED
EXPLAIN SELECT * FROM (
    SELECT * FROM users WHERE age > 18
) AS t;
```

##### (3) table

- **含义**：显示这一行的数据是关于哪张表的
- **可能值**：表名、`<unionM,N>`、`<derivedN>`、`<subqueryN>`

##### (4) type ⭐ 最重要

**访问类型，从好到差：**

```
system > const > eq_ref > ref > range > index > ALL
```

| 类型 | 说明 | 示例 |
|------|------|------|
| **system** | 表只有一行记录（系统表） | 极少见 |
| **const** | 通过主键或唯一索引一次找到 | `WHERE id = 1` |
| **eq_ref** | 唯一性索引扫描，每个索引键对应一行 | 主键关联 |
| **ref** | 非唯一性索引扫描 | `WHERE name = '张三'` |
| **range** | 索引范围扫描 | `WHERE age > 18` |
| **index** | 全索引扫描 | `SELECT id FROM users` |
| **ALL** | 全表扫描 ⚠️ 需要优化 | `SELECT * FROM users` |

```sql
-- const
EXPLAIN SELECT * FROM users WHERE id = 1;  -- 主键查询

-- ref
EXPLAIN SELECT * FROM users WHERE name = '张三';  -- 普通索引

-- range
EXPLAIN SELECT * FROM users WHERE age BETWEEN 18 AND 30;

-- ALL（需要优化）
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';  -- 无索引
```

**优化目标：**
- ⭐ **至少达到 range 级别**
- **避免 ALL**（全表扫描）
- **争取 ref 或 eq_ref**

##### (5) possible_keys

- **含义**：可能使用的索引
- **注意**：如果为 NULL，表示没有相关索引

##### (6) key ⭐ 重要

- **含义**：实际使用的索引
- **注意**：
  - 如果为 NULL，表示没有使用索引
  - 可能与 possible_keys 不同（优化器选择了其他索引）

```sql
-- 有索引但未使用
EXPLAIN SELECT * FROM users WHERE name LIKE '%张三';  -- key 为 NULL

-- 使用了索引
EXPLAIN SELECT * FROM users WHERE name = '张三';  -- key 显示索引名
```

##### (7) key_len

- **含义**：索引使用的字节数
- **作用**：判断联合索引的使用情况
- **计算**：
  - INT：4 字节
  - BIGINT：8 字节
  - VARCHAR(n)：3n + 2 字节（utf8mb4）
  - 允许 NULL：+1 字节

```sql
-- 联合索引 (name, age)
CREATE INDEX idx_name_age ON users(name, age);

-- 只使用了 name
EXPLAIN SELECT * FROM users WHERE name = '张三';
-- key_len = 50*3 + 2 = 152（假设 name VARCHAR(50)）

-- 使用了 name 和 age
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20;
-- key_len = 152 + 4 + 1 = 157（age INT，允许 NULL）
```

##### (8) ref

- **含义**：显示索引的哪一列被使用了
- **常见值**：
  - `const`：常量
  - `数据库名.表名.列名`：引用其他表的列
  - `NULL`：没有使用索引

##### (9) rows ⭐ 重要

- **含义**：预估需要扫描的行数
- **作用**：越少越好
- **注意**：这是预估值，不是精确值

```sql
-- rows = 1（最优）
EXPLAIN SELECT * FROM users WHERE id = 1;

-- rows = 1000（需要优化）
EXPLAIN SELECT * FROM users WHERE age > 18;
```

##### (10) filtered

- **含义**：存储引擎返回的数据在 Server 层过滤后，剩下多少满足查询的记录数量的比例
- **范围**：0-100
- **作用**：值越大越好

##### (11) Extra ⭐ 重要

**常见值及含义：**

| 值 | 含义 | 好坏 |
|----|------|------|
| **Using index** | 覆盖索引，无需回表 | ✅ 好 |
| **Using where** | 使用了 WHERE 过滤 | ⚠️ 一般 |
| **Using filesort** | 需要文件排序 | ❌ 需优化 |
| **Using temporary** | 使用临时表 | ❌ 需优化 |
| **Using join buffer** | 使用连接缓存 | ⚠️ 一般 |
| **Impossible WHERE** | WHERE 条件总是 false | - |
| **Select tables optimized away** | 优化器已完成优化 | ✅ 好 |
| **Distinct** | 查找 distinct 值 | - |

```sql
-- Using index（好）
EXPLAIN SELECT id FROM users WHERE name = '张三';
-- 覆盖索引，无需回表

-- Using filesort（需优化）
EXPLAIN SELECT * FROM users ORDER BY email;
-- 没有索引，需要文件排序

-- Using temporary（需优化）
EXPLAIN SELECT DISTINCT name FROM users;
-- 使用临时表去重
```

#### 3. EXPLAIN 扩展用法

```sql
-- 格式化输出（更易读）
EXPLAIN FORMAT=TREE SELECT * FROM users WHERE id = 1;

-- JSON 格式（详细信息）
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE id = 1;

-- 显示分区信息
EXPLAIN PARTITIONS SELECT * FROM users;
```

### 二、SHOW PROFILE

#### 1. 基本用法

```sql
-- 开启 profiling
SET profiling = 1;

-- 执行查询
SELECT * FROM users WHERE id = 1;

-- 查看所有查询
SHOW PROFILES;

-- 查看指定查询的详细耗时
SHOW PROFILE FOR QUERY 1;

-- 查看所有 CPU 和 Block IO 信息
SHOW PROFILE CPU, BLOCK IO FOR QUERY 1;
```

#### 2. 输出示例

```
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| starting             | 0.000050 |
| checking permissions | 0.000010 |
| Opening tables       | 0.000020 |
| init                 | 0.000030 |
| System lock          | 0.000010 |
| optimizing           | 0.000010 |
| statistics           | 0.000020 |
| preparing            | 0.000010 |
| executing            | 0.000005 |
| Sending data         | 0.000100 |  ← 主要耗时在这里
| end                  | 0.000005 |
| query end            | 0.000005 |
| closing tables       | 0.000010 |
| freeing items        | 0.000010 |
| cleaning up          | 0.000010 |
+----------------------+----------+
```

**注意：** MySQL 5.7+ 已废弃 SHOW PROFILE，推荐使用 Performance Schema。

### 三、Performance Schema

#### 1. 基本用法

```sql
-- 查看最近的语句事件
SELECT * FROM performance_schema.events_statements_history_long
ORDER BY EVENT_ID DESC LIMIT 10;

-- 查看语句的执行时间
SELECT 
    DIGEST_TEXT,
    COUNT_STAR AS exec_count,
    SUM_TIMER_WAIT/1000000000000 AS total_latency_sec,
    AVG_TIMER_WAIT/1000000000000 AS avg_latency_sec,
    MAX_TIMER_WAIT/1000000000000 AS max_latency_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

### 四、慢查询日志

#### 1. 开启慢查询日志

```sql
-- 查看慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 超过 2 秒的记录
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
```

#### 2. 分析慢查询日志

```bash
# 使用 mysqldumpslow 工具
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log

# 参数说明：
# -s t: 按时间排序
# -t 10: 显示前 10 条
```

### 五、实战优化案例

#### 案例 1：优化全表扫描

```sql
-- 原始 SQL（ALL，全表扫描）
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- type: ALL, rows: 10000, key: NULL

-- 优化：添加索引
CREATE INDEX idx_email ON users(email);

-- 优化后
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- type: ref, rows: 1, key: idx_email ✅
```

#### 案例 2：优化文件排序

```sql
-- 原始 SQL（Using filesort）
EXPLAIN SELECT * FROM users ORDER BY create_time DESC LIMIT 10;
-- Extra: Using filesort

-- 优化：添加索引
CREATE INDEX idx_create_time ON users(create_time);

-- 优化后
EXPLAIN SELECT * FROM users ORDER BY create_time DESC LIMIT 10;
-- Extra: Using index ✅
```

#### 案例 3：优化临时表

```sql
-- 原始 SQL（Using temporary）
EXPLAIN SELECT DISTINCT name FROM users GROUP BY age;
-- Extra: Using temporary; Using filesort

-- 优化：重写 SQL
EXPLAIN SELECT name FROM users GROUP BY name, age;
-- 减少临时表使用
```

#### 案例 4：优化 JOIN

```sql
-- 原始 SQL
EXPLAIN SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.age > 18;

-- 检查：
-- 1. users 表的 age 字段是否有索引
-- 2. orders 表的 user_id 字段是否有索引

-- 优化：添加索引
CREATE INDEX idx_age ON users(age);
CREATE INDEX idx_user_id ON orders(user_id);

-- 优化后重新 EXPLAIN
```

### 六、EXPLAIN 分析流程

**标准分析步骤：**

```
1. 看 type
   ↓
   是否为 ALL？ → 是 → 需要添加索引
   ↓ 否
   
2. 看 key
   ↓
   是否为 NULL？ → 是 → 检查为什么没用到索引
   ↓ 否
   
3. 看 rows
   ↓
   是否过大？ → 是 → 考虑优化查询条件或索引
   ↓ 否
   
4. 看 Extra
   ↓
   是否有 Using filesort/Using temporary？ → 是 → 需要优化
   ↓ 否
   
5. 看 key_len
   ↓
   联合索引是否充分利用？ → 否 → 调整索引顺序或查询条件
```

### 七、总结

**常用命令：**
```sql
-- 基本用法
EXPLAIN SELECT ...;

-- 详细格式
EXPLAIN FORMAT=JSON SELECT ...;

-- 树形格式（MySQL 8.0+）
EXPLAIN FORMAT=TREE SELECT ...;
```

**关键指标：**
1. ⭐ **type**：至少达到 range，避免 ALL
2. ⭐ **key**：确认使用了合适的索引
3. ⭐ **rows**：扫描行数越少越好
4. ⭐ **Extra**：避免 Using filesort 和 Using temporary

**优化建议：**
- 定期分析慢查询
- 使用 EXPLAIN 验证索引效果
- 关注 type 和 Extra 字段
- 结合业务场景优化

## 13. UNION 和 UNION ALL 的区别

**答：** UNION 和 UNION ALL 都用于合并多个 SELECT 语句的结果集，但它们在处理重复数据时有所不同。

### 一、基本区别

| 特性 | UNION | UNION ALL |
|------|-------|-----------|
| **去重** | ✅ 自动去重 | ❌ 不去重 |
| **性能** | 较慢（需要排序去重） | 较快（直接合并） |
| **排序** | 默认按第一列排序 | 不排序 |
| **使用场景** | 需要去重时 | 不需要去重或确定无重复 |

### 二、UNION 详解

#### 1. 基本用法

```sql
-- 合并两个查询结果，自动去重
SELECT name FROM users WHERE age > 20
UNION
SELECT name FROM users WHERE city = '北京';
```

**示例：**
```sql
-- 创建测试表
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    class VARCHAR(50)
);

INSERT INTO students (name, class) VALUES
('张三', '一班'),
('李四', '一班'),
('王五', '二班'),
('赵六', '二班');

-- UNION 去重
SELECT name FROM students WHERE class = '一班'
UNION
SELECT name FROM students WHERE id <= 2;

-- 结果：
-- | name |
-- |------|
-- | 张三 |  ← 只出现一次（去重）
-- | 李四 |
```

#### 2. UNION 的工作原理

```
1. 执行第一个 SELECT
2. 执行第二个 SELECT
3. 合并结果集
4. 排序（默认按第一列）
5. 去除重复行
6. 返回结果
```

**注意：** UNION 的去重操作需要进行排序和比较，因此性能较差。

#### 3. 使用 ORDER BY

```sql
-- UNION 的 ORDER BY 只能放在最后
(SELECT name FROM students WHERE class = '一班')
UNION
(SELECT name FROM students WHERE class = '二班')
ORDER BY name DESC;  -- 对整个结果集排序

-- ❌ 错误：不能在每个 SELECT 中单独排序
SELECT name FROM students WHERE class = '一班' ORDER BY name
UNION
SELECT name FROM students WHERE class = '二班' ORDER BY name;
```

### 三、UNION ALL 详解

#### 1. 基本用法

```sql
-- 合并两个查询结果，保留所有数据（包括重复）
SELECT name FROM users WHERE age > 20
UNION ALL
SELECT name FROM users WHERE city = '北京';
```

**示例：**
```sql
-- UNION ALL 不去重
SELECT name FROM students WHERE class = '一班'
UNION ALL
SELECT name FROM students WHERE id <= 2;

-- 结果：
-- | name |
-- |------|
-- | 张三 |  ← 可能出现多次
-- | 李四 |
-- | 张三 |  ← 重复出现
-- | 李四 |  ← 重复出现
```

#### 2. UNION ALL 的工作原理

```
1. 执行第一个 SELECT
2. 执行第二个 SELECT
3. 直接合并结果集
4. 返回结果（不做任何处理）
```

**优势：** 无需排序和去重，性能更好。

### 四、性能对比

#### 1. 性能测试

```sql
-- 测试数据
CREATE TABLE test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value INT
);

-- 插入 100 万条数据
INSERT INTO test_table (value)
SELECT FLOOR(RAND() * 1000) FROM information_schema.columns LIMIT 1000000;

-- 测试 UNION（慢）
SELECT SQL_NO_CACHE value FROM test_table WHERE value < 100
UNION
SELECT SQL_NO_CACHE value FROM test_table WHERE value > 900;
-- 耗时：约 2 秒（需要去重）

-- 测试 UNION ALL（快）
SELECT SQL_NO_CACHE value FROM test_table WHERE value < 100
UNION ALL
SELECT SQL_NO_CACHE value FROM test_table WHERE value > 900;
-- 耗时：约 0.5 秒（直接合并）
```

**结论：** UNION ALL 比 UNION 快 3-4 倍。

#### 2. EXPLAIN 分析

```sql
-- UNION 的执行计划
EXPLAIN
SELECT value FROM test_table WHERE value < 100
UNION
SELECT value FROM test_table WHERE value > 900;

-- 输出中包含：
-- Extra: Using temporary; Using filesort  ← 需要临时表和排序

-- UNION ALL 的执行计划
EXPLAIN
SELECT value FROM test_table WHERE value < 100
UNION ALL
SELECT value FROM test_table WHERE value > 900;

-- 输出中不包含：
-- Extra: （无临时表和排序）✅
```

### 五、使用规则

#### 1. 列数必须相同

```sql
-- ✅ 正确：列数相同
SELECT id, name FROM users
UNION
SELECT id, name FROM customers;

-- ❌ 错误：列数不同
SELECT id, name FROM users
UNION
SELECT id FROM customers;
```

#### 2. 数据类型必须兼容

```sql
-- ✅ 正确：类型兼容
SELECT CAST(id AS CHAR) FROM users
UNION
SELECT name FROM users;

-- ❌ 错误：类型不兼容（某些数据库）
SELECT id FROM users  -- INT
UNION
SELECT name FROM users;  -- VARCHAR
```

#### 3. 列名以第一个 SELECT 为准

```sql
SELECT id AS user_id, name AS user_name FROM users
UNION
SELECT id, name FROM customers;

-- 结果集的列名为：user_id, user_name
```

### 六、实际应用场景

#### 场景 1：合并不同表的数据

```sql
-- 查询所有用户（包括普通用户和管理员）
SELECT id, name, 'user' AS type FROM users
UNION ALL
SELECT id, name, 'admin' AS type FROM admins
ORDER BY id;
```

#### 场景 2：分页查询优化

```sql
-- 从多个分区表中查询数据
(SELECT * FROM orders_2023 WHERE create_time >= '2023-01-01' LIMIT 100)
UNION ALL
(SELECT * FROM orders_2024 WHERE create_time >= '2024-01-01' LIMIT 100)
LIMIT 100;
```

#### 场景 3：统计不同条件的数据

```sql
-- 统计各年龄段的人数
SELECT '18-25岁' AS age_group, COUNT(*) AS count FROM users WHERE age BETWEEN 18 AND 25
UNION ALL
SELECT '26-35岁', COUNT(*) FROM users WHERE age BETWEEN 26 AND 35
UNION ALL
SELECT '36-45岁', COUNT(*) FROM users WHERE age BETWEEN 36 AND 45
UNION ALL
SELECT '46岁以上', COUNT(*) FROM users WHERE age > 45;

-- 结果：
-- | age_group | count |
-- |-----------|-------|
-- | 18-25岁   | 100   |
-- | 26-35岁   | 200   |
-- | 36-45岁   | 150   |
-- | 46岁以上  | 50    |
```

#### 场景 4：去重需求

```sql
-- 查询所有参与过项目的员工（去重）
SELECT employee_id FROM project_a
UNION
SELECT employee_id FROM project_b
UNION
SELECT employee_id FROM project_c;

-- 如果使用 UNION ALL，同一个员工可能出现在多个项目中，会重复
```

### 七、注意事项

#### 1. 优先使用 UNION ALL

```sql
-- ✅ 好：如果确定没有重复，使用 UNION ALL
SELECT id FROM users WHERE age > 20
UNION ALL
SELECT id FROM users WHERE city = '北京';

-- ❌ 不好：不必要的去重操作
SELECT id FROM users WHERE age > 20
UNION
SELECT id FROM users WHERE city = '北京';
```

**原则：**
- 如果能确定结果集没有重复，使用 UNION ALL
- 如果需要去重，才使用 UNION

#### 2. NULL 值处理

```sql
-- UNION 认为 NULL = NULL，会去重
SELECT NULL AS value
UNION
SELECT NULL;

-- 结果：只有一行 NULL

-- UNION ALL 保留所有 NULL
SELECT NULL AS value
UNION ALL
SELECT NULL;

-- 结果：两行 NULL
```

#### 3. 与 ORDER BY 和 LIMIT 配合

```sql
-- 每个子查询单独排序和限制
(SELECT name FROM students WHERE class = '一班' ORDER BY name LIMIT 5)
UNION ALL
(SELECT name FROM students WHERE class = '二班' ORDER BY name LIMIT 5)
ORDER BY name;  -- 对整个结果集排序

-- 注意：需要用括号包裹每个子查询
```

#### 4. 避免过多 UNION

```sql
-- ❌ 不好：过多 UNION，性能差
SELECT ... FROM table1
UNION ALL
SELECT ... FROM table2
UNION ALL
SELECT ... FROM table3
UNION ALL
SELECT ... FROM table4
UNION ALL
SELECT ... FROM table5;  -- 5 个以上

-- ✅ 好：考虑其他方案
-- 1. 使用临时表
-- 2. 使用应用层合并
-- 3. 重新设计表结构
```

### 八、UNION vs JOIN

| 特性 | UNION | JOIN |
|------|-------|------|
| **作用** | 垂直合并（增加行数） | 水平合并（增加列数） |
| **方向** | 上下拼接 | 左右拼接 |
| **列数** | 必须相同 | 可以不同 |
| **使用场景** | 合并相似结构的数据 | 关联不同表的数据 |

```sql
-- UNION：垂直合并
SELECT name FROM users
UNION ALL
SELECT name FROM customers;
-- 结果：一列，多行

-- JOIN：水平合并
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
-- 结果：多列，多行
```

### 九、总结

**核心区别：**
- **UNION**：去重 + 排序，性能较慢
- **UNION ALL**：不去重，性能较快

**选择建议：**
1. ⭐ **优先使用 UNION ALL**：性能更好
2. **需要去重时才用 UNION**：明确需要去重
3. **注意列数和数据类型**：必须匹配
4. **避免过多 UNION**：考虑替代方案

**最佳实践：**
- 能确定无重复 → 使用 UNION ALL
- 需要去重 → 使用 UNION
- 大数据量 → 优先考虑 UNION ALL + 应用层去重
- 复杂查询 → 考虑使用临时表或子查询

## 14. HAVING 和 WHERE 的区别

**答：** WHERE 和 HAVING 都用于过滤数据，但它们的使用时机和作用对象不同。

### 一、核心区别

| 特性 | WHERE | HAVING |
|------|-------|--------|
| **作用时机** | 分组前过滤 | 分组后过滤 |
| **作用对象** | 行数据 | 分组后的结果 |
| **聚合函数** | ❌ 不能使用 | ✅ 可以使用 |
| **执行顺序** | 先执行 | 后执行 |
| **性能** | 较好（减少数据量） | 较差（已分组） |

### 二、SQL 执行顺序

理解 WHERE 和 HAVING 的关键是掌握 SQL 的执行顺序：

```
1. FROM          ← 确定数据源
2. WHERE         ← 过滤行数据（分组前）
3. GROUP BY      ← 分组
4. HAVING        ← 过滤分组（分组后）
5. SELECT        ← 选择列
6. ORDER BY      ← 排序
7. LIMIT         ← 限制行数
```

**关键点：**
- WHERE 在 GROUP BY 之前执行
- HAVING 在 GROUP BY 之后执行

### 三、WHERE 详解

#### 1. 基本用法

```sql
-- WHERE 过滤行数据
SELECT * FROM users WHERE age > 18;

-- WHERE 可以使用各种条件
SELECT * FROM users 
WHERE age > 18 
AND city = '北京' 
AND status = 1;
```

#### 2. WHERE 不能使用聚合函数

```sql
-- ❌ 错误：WHERE 中不能使用聚合函数
SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE COUNT(*) > 10  -- 错误！
GROUP BY department;

-- Error: Invalid use of group function
```

**原因：** WHERE 在分组之前执行，此时还没有进行聚合计算。

#### 3. WHERE 的性能优势

```sql
-- ✅ 好：先用 WHERE 过滤，减少数据量
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'  -- 先过滤
GROUP BY department;

-- 只统计 2020 年后入职的员工，数据量更小
```

### 四、HAVING 详解

#### 1. 基本用法

```sql
-- HAVING 过滤分组后的结果
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;  -- 只显示员工数大于 10 的部门
```

#### 2. HAVING 可以使用聚合函数

```sql
-- ✅ 正确：HAVING 中可以使用聚合函数
SELECT department, 
       COUNT(*) AS emp_count,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 10           -- 员工数大于 10
   AND AVG(salary) > 5000;     -- 平均工资大于 5000
```

#### 3. HAVING 也可以使用非聚合字段

```sql
-- HAVING 也可以过滤普通字段（但不推荐）
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING department = '技术部';  -- 可以，但应该用 WHERE

-- ✅ 更好：用 WHERE 过滤
SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE department = '技术部'
GROUP BY department;
```

### 五、对比示例

#### 示例 1：基础对比

```sql
-- 创建测试表
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10, 2),
    order_date DATE
);

INSERT INTO orders (customer_id, amount, order_date) VALUES
(1, 100, '2024-01-01'),
(1, 200, '2024-01-02'),
(2, 150, '2024-01-01'),
(2, 300, '2024-01-03'),
(3, 50, '2024-01-02');

-- 需求：查询总订单金额大于 200 的客户

-- ❌ 错误：WHERE 不能使用聚合函数
SELECT customer_id, SUM(amount) AS total_amount
FROM orders
WHERE SUM(amount) > 200  -- 错误！
GROUP BY customer_id;

-- ✅ 正确：使用 HAVING
SELECT customer_id, SUM(amount) AS total_amount
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 200;

-- 结果：
-- | customer_id | total_amount |
-- |-------------|--------------|
-- | 1           | 300.00       |
-- | 2           | 450.00       |
```

#### 示例 2：WHERE 和 HAVING 同时使用

```sql
-- 需求：查询 2024 年总订单金额大于 200 的客户

SELECT 
    customer_id, 
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM orders
WHERE order_date >= '2024-01-01'  -- WHERE：过滤 2024 年的订单
  AND order_date < '2025-01-01'
GROUP BY customer_id
HAVING SUM(amount) > 200;         -- HAVING：过滤总金额大于 200 的客户

-- 结果：
-- | customer_id | order_count | total_amount |
-- |-------------|-------------|--------------|
-- | 1           | 2           | 300.00       |
-- | 2           | 2           | 450.00       |
```

**执行过程：**
```
1. FROM orders                    ← 从 orders 表
2. WHERE order_date >= '2024-...' ← 过滤出 2024 年的订单
3. GROUP BY customer_id           ← 按客户分组
4. HAVING SUM(amount) > 200       ← 过滤总金额大于 200 的组
5. SELECT ...                     ← 选择要显示的列
```

#### 示例 3：性能对比

```sql
-- ❌ 不好：HAVING 过滤，扫描全部数据
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING department = '技术部';  -- 先全部分组，再过滤

-- ✅ 好：WHERE 过滤，减少数据量
SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE department = '技术部'    -- 先过滤，再分组
GROUP BY department;

-- 性能差异：
-- 第一种：扫描 10000 条 → 分组 → 过滤
-- 第二种：过滤 1000 条 → 分组
-- 第二种快 10 倍！
```

### 六、常见误区

#### 误区 1：HAVING 只能用于聚合函数

```sql
-- ❌ 误解：HAVING 只能用于聚合函数
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;  -- 只能用聚合函数？

-- ✅ 事实：HAVING 也可以使用非聚合字段
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING department LIKE '技术%';  -- 可以，但不推荐

-- 💡 建议：非聚合字段的过滤用 WHERE
```

#### 误区 2：WHERE 和 HAVING 可以互换

```sql
-- ❌ 错误：WHERE 不能替代 HAVING
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE AVG(salary) > 5000  -- 错误！WHERE 不能用聚合函数
GROUP BY department;

-- ✅ 正确：必须用 HAVING
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 5000;
```

#### 误区 3：HAVING 性能更好

```sql
-- ❌ 不好：HAVING 过滤普通字段
SELECT * FROM users
GROUP BY city
HAVING city = '北京';

-- ✅ 好：WHERE 过滤普通字段
SELECT * FROM users
WHERE city = '北京'
GROUP BY city;

-- 原因：WHERE 在分组前过滤，减少数据量
```

### 七、实际应用场景

#### 场景 1：查找重复数据

```sql
-- 查找重复的邮箱
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- 查找重复的用户名
SELECT name, COUNT(*) AS count
FROM users
GROUP BY name
HAVING COUNT(*) > 1;
```

#### 场景 2：统计分析

```sql
-- 查询平均成绩大于 80 的学生
SELECT student_id, AVG(score) AS avg_score
FROM scores
GROUP BY student_id
HAVING AVG(score) > 80;

-- 查询订单数超过 5 的客户
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```

#### 场景 3：数据质量检查

```sql
-- 查找没有订单的客户
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
HAVING COUNT(o.id) = 0;

-- 查找库存不足的商品
SELECT product_id, SUM(stock) AS total_stock
FROM warehouses
GROUP BY product_id
HAVING SUM(stock) < 10;
```

#### 场景 4：复杂过滤条件

```sql
-- 查询满足多个条件的部门
SELECT 
    department,
    COUNT(*) AS emp_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary
FROM employees
WHERE hire_date >= '2020-01-01'  -- WHERE：入职时间
GROUP BY department
HAVING COUNT(*) >= 5             -- HAVING：员工数
   AND AVG(salary) > 8000        -- HAVING：平均工资
   AND MAX(salary) < 50000;      -- HAVING：最高工资
```

### 八、最佳实践

#### 1. 优先使用 WHERE

```sql
-- ✅ 原则：能用 WHERE 就不用 HAVING
-- 非聚合字段的过滤用 WHERE
SELECT department, COUNT(*)
FROM employees
WHERE department = '技术部'  -- WHERE
GROUP BY department;

-- 聚合字段的过滤用 HAVING
SELECT department, COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;  -- HAVING
```

#### 2. 合理使用组合

```sql
-- ✅ 好：WHERE + HAVING 组合使用
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM orders
WHERE order_date >= '2024-01-01'  -- WHERE：时间过滤
GROUP BY customer_id
HAVING COUNT(*) >= 3              -- HAVING：订单数
   AND SUM(amount) > 1000;        -- HAVING：总金额
```

#### 3. 注意性能

```sql
-- ❌ 不好：HAVING 过滤大量数据
SELECT category, COUNT(*)
FROM products
GROUP BY category
HAVING category IN ('电子', '图书', '服装');  -- 先全部分组

-- ✅ 好：WHERE 先过滤
SELECT category, COUNT(*)
FROM products
WHERE category IN ('电子', '图书', '服装')  -- 先过滤
GROUP BY category;
```

### 九、总结

**核心区别：**
- **WHERE**：分组前过滤，作用于行，不能使用聚合函数
- **HAVING**：分组后过滤，作用于组，可以使用聚合函数

**使用原则：**
1. ⭐ **非聚合字段过滤 → 用 WHERE**
2. **聚合字段过滤 → 用 HAVING**
3. **优先使用 WHERE**：性能更好
4. **必要时组合使用**：WHERE + HAVING

**记忆技巧：**
- **WHERE** 在 **GROUP BY** 之前 → 过滤原始数据
- **HAVING** 在 **GROUP BY** 之后 → 过滤分组结果
- **WHERE** 不能用 **聚合函数**
- **HAVING** 可以用 **聚合函数**

## 15. 常见的索引原则

**答：** 索引是提升数据库查询性能的重要手段，但使用不当反而会降低性能。以下是常见的索引设计和使用原则。

### 一、应该创建索引的场景

#### 1. 主键自动创建索引

```sql
-- 主键自动创建聚簇索引
CREATE TABLE users (
    id INT PRIMARY KEY,  -- 自动创建索引
    name VARCHAR(50)
);
```

#### 2. 频繁作为查询条件的字段

```sql
-- ✅ 好：经常用于 WHERE 条件
SELECT * FROM users WHERE email = 'test@example.com';
CREATE INDEX idx_email ON users(email);

-- ✅ 好：经常用于 JOIN 条件
SELECT * FROM orders o
INNER JOIN users u ON o.user_id = u.id;
CREATE INDEX idx_user_id ON orders(user_id);
```

#### 3.  ORDER BY 和 GROUP BY 的字段

```sql
-- ✅ 好：排序字段加索引
SELECT * FROM users ORDER BY create_time DESC;
CREATE INDEX idx_create_time ON users(create_time);

-- ✅ 好：分组字段加索引
SELECT department, COUNT(*) FROM employees GROUP BY department;
CREATE INDEX idx_department ON employees(department);
```

#### 4. 区分度高的字段

```sql
-- ✅ 好：区分度高（唯一值多）
-- 身份证号、手机号、邮箱等
CREATE INDEX idx_phone ON users(phone);

-- ❌ 不好：区分度低（唯一值少）
-- 性别、状态等
CREATE INDEX idx_gender ON users(gender);  -- 只有男/女两个值
```

**区分度计算公式：**
```
区分度 = COUNT(DISTINCT column) / COUNT(*)
```

```sql
-- 查看字段区分度
SELECT 
    COUNT(DISTINCT gender) / COUNT(*) AS gender_distinctness,
    COUNT(DISTINCT email) / COUNT(*) AS email_distinctness
FROM users;

-- 结果：
-- gender_distinctness: 0.00002  (很低，不适合建索引)
-- email_distinctness:  0.99999  (很高，适合建索引)
```

#### 5. 联合索引遵循最左前缀

```sql
-- 创建联合索引
CREATE INDEX idx_name_age_city ON users(name, age, city);

-- ✅ 可以使用索引
WHERE name = '张三'
WHERE name = '张三' AND age = 20
WHERE name = '张三' AND age = 20 AND city = '北京'

-- ❌ 不能使用索引
WHERE age = 20
WHERE city = '北京'
WHERE age = 20 AND city = '北京'
```

### 二、不应该创建索引的场景

#### 1. 表记录太少

```sql
-- ❌ 不需要：表只有几十条记录
-- 全表扫描比索引查找更快

-- 经验法则：
-- - 小于 1000 行：通常不需要索引
-- - 1000-10000 行：根据查询频率决定
-- - 大于 10000 行：考虑添加索引
```

#### 2. 频繁更新的字段

```sql
-- ❌ 不好：频繁更新的字段
UPDATE users SET login_count = login_count + 1 WHERE id = 1;
-- 每次更新都要维护索引，性能差

-- ✅ 好：不常更新的字段
CREATE INDEX idx_email ON users(email);  -- 邮箱很少修改
```

#### 3. 区分度低的字段

```sql
-- ❌ 不好：性别只有两个值
CREATE INDEX idx_gender ON users(gender);

-- ❌ 不好：状态字段只有几个值
CREATE INDEX idx_status ON orders(status);  -- 待支付、已支付、已完成

-- 💡 建议：如果必须查询，考虑联合索引
CREATE INDEX idx_status_create_time ON orders(status, create_time);
```

#### 4. 大文本字段

```sql
-- ❌ 不好：TEXT、BLOB 类型
CREATE INDEX idx_content ON articles(content);  -- content 是 TEXT 类型

-- ✅ 好：使用前缀索引
CREATE INDEX idx_content_prefix ON articles(content(100));  -- 只索引前 100 个字符
```

#### 5. 参与计算的字段

```sql
-- ❌ 不好：字段参与计算
SELECT * FROM users WHERE age + 1 > 20;
CREATE INDEX idx_age ON users(age);  -- 索引失效

-- ✅ 好：改写查询
SELECT * FROM users WHERE age > 19;  -- 可以使用索引
```

### 三、索引设计原则

#### 1. 选择合适的索引类型

```sql
-- 唯一索引：保证数据唯一性
CREATE UNIQUE INDEX idx_email ON users(email);

-- 普通索引：加速查询
CREATE INDEX idx_name ON users(name);

-- 联合索引：多字段查询
CREATE INDEX idx_name_age ON users(name, age);

-- 前缀索引：长字符串
CREATE INDEX idx_email_prefix ON users(email(20));

-- 全文索引：文本搜索
CREATE FULLTEXT INDEX ft_content ON articles(content);
```

#### 2. 联合索引字段顺序

**原则：**
- 区分度高的字段放在前面
- 经常用于等值查询的字段放在前面
- 范围查询的字段放在后面

```sql
-- 示例：用户表
-- name: 区分度高，经常等值查询
-- age: 区分度中等，经常范围查询
-- city: 区分度低

-- ✅ 好：区分度高的在前
CREATE INDEX idx_name_age_city ON users(name, age, city);

-- ❌ 不好：区分度低的在前
CREATE INDEX idx_city_age_name ON users(city, age, name);
```

#### 3. 覆盖索引优化

```sql
-- 创建联合索引
CREATE INDEX idx_name_age ON users(name, age);

-- ✅ 好：覆盖索引，无需回表
SELECT name, age FROM users WHERE name = '张三';

-- ❌ 不好：需要回表
SELECT name, age, email FROM users WHERE name = '张三';
```

#### 4. 避免冗余索引

```sql
-- ❌ 不好：冗余索引
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_name_age ON users(name, age);  -- 包含了 idx_name

-- ✅ 好：只保留联合索引
CREATE INDEX idx_name_age ON users(name, age);
-- 既可以用于 WHERE name = '张三'
-- 也可以用于 WHERE name = '张三' AND age = 20
```

**检查冗余索引：**
```sql
-- 查看所有索引
SHOW INDEX FROM users;

-- 使用 pt-duplicate-key-checker 工具
pt-duplicate-key-checker --host=localhost --user=root --password=xxx
```

### 四、索引使用注意事项

#### 1. 避免索引失效

```sql
-- ❌ 不好：函数操作导致索引失效
SELECT * FROM users WHERE YEAR(create_time) = 2024;

-- ✅ 好：范围查询
SELECT * FROM users 
WHERE create_time >= '2024-01-01' 
  AND create_time < '2025-01-01';

-- ❌ 不好：模糊查询以 % 开头
SELECT * FROM users WHERE name LIKE '%张三';

-- ✅ 好：模糊查询以 % 结尾
SELECT * FROM users WHERE name LIKE '张三%';

-- ❌ 不好：类型隐式转换
SELECT * FROM users WHERE phone = 13800138000;  -- phone 是 VARCHAR

-- ✅ 好：使用字符串
SELECT * FROM users WHERE phone = '13800138000';

-- ❌ 不好：OR 连接未索引字段
SELECT * FROM users WHERE name = '张三' OR age = 20;  -- age 无索引

-- ✅ 好：使用 UNION
SELECT * FROM users WHERE name = '张三'
UNION
SELECT * FROM users WHERE age = 20;
```

#### 2. 控制索引数量

```sql
-- ❌ 不好：过多索引
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_age ON users(age);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_phone ON users(phone);
CREATE INDEX idx_city ON users(city);
-- ... 太多索引会影响写入性能

-- ✅ 好：合理控制
-- 一般建议：单表索引不超过 5-6 个
-- 优先考虑联合索引
CREATE INDEX idx_name_email ON users(name, email);
CREATE INDEX idx_phone ON users(phone);
```

**索引的影响：**
- 每个索引都会占用存储空间
- 每次 INSERT/UPDATE/DELETE 都要维护索引
- 索引越多，写入性能越差

#### 3. 定期分析和优化索引

```sql
-- 分析表，更新统计信息
ANALYZE TABLE users;

-- 查看索引使用情况
SELECT 
    table_schema,
    table_name,
    index_name,
    rows_read,
    rows_inserted,
    rows_updated,
    rows_deleted
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE table_schema = 'mydb'
ORDER BY rows_read DESC;

-- 删除未使用的索引
DROP INDEX idx_unused ON users;
```

#### 4. 注意索引长度

```sql
-- ❌ 不好：索引过长
CREATE INDEX idx_name ON users(name(255));  -- VARCHAR(255)

-- ✅ 好：合理长度
CREATE INDEX idx_name ON users(name(50));  -- 实际只需要 50

-- 查看索引长度
SHOW INDEX FROM users;
```

### 五、索引监控和维护

#### 1. 查看索引使用情况

```sql
-- 查看慢查询中未使用索引的 SQL
SHOW VARIABLES LIKE 'log_queries_not_using_indexes';
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 查看当前正在执行的 SQL
SHOW FULL PROCESSLIST;

-- 使用 EXPLAIN 分析
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

#### 2. 索引碎片整理

```sql
-- 查看表状态
SHOW TABLE STATUS LIKE 'users';

-- 优化表，整理碎片
OPTIMIZE TABLE users;

-- 注意：OPTIMIZE TABLE 会锁表，建议在低峰期执行
```

#### 3. 监控索引性能

```sql
-- 查看 InnoDB 缓冲池命中率
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';

-- 计算命中率
-- 命中率 = (1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests) * 100%
-- 理想值：> 99%
```

### 六、最佳实践总结

#### 索引设计 checklist

- [ ] **主键是否使用自增 ID**
- [ ] **查询频繁的字段是否加了索引**
- [ ] **JOIN 字段是否加了索引**
- [ ] **ORDER BY/GROUP BY 字段是否加了索引**
- [ ] **联合索引是否符合最左前缀原则**
- [ ] **是否避免了冗余索引**
- [ ] **索引数量是否合理（≤ 5-6 个）**
- [ ] **区分度低的字段是否避免单独建索引**
- [ ] **是否使用了覆盖索引优化**
- [ ] **是否定期分析和优化索引**

#### 性能优化建议

1. ⭐ **优先使用 EXPLAIN 分析**
   - 确认索引是否生效
   - 关注 type、key、rows、Extra 字段

2. **合理使用联合索引**
   - 减少索引数量
   - 提高查询效率

3. **避免索引失效**
   - 不在索引列上使用函数
   - 避免类型隐式转换
   - 注意 LIKE 的使用方式

4. **定期维护索引**
   - 删除未使用的索引
   - 整理索引碎片
   - 更新统计信息

5. **权衡读写性能**
   - 读多写少：可以适当增加索引
   - 写多读少：尽量减少索引

### 七、总结

**核心原则：**
1. ⭐ **查询频繁的字段加索引**
2. **区分度高的字段加索引**
3. **联合索引遵循最左前缀**
4. **避免索引失效**
5. **控制索引数量**
6. **定期分析和优化**

**记忆口诀：**
- 查询频繁要索引
- 区分高低要看清
- 联合索引最左前
- 函数运算索引失
- 冗余索引要删除
- 定期维护不能忘

## 16. MySQL 中的 IN 和 EXISTS 子句有什么区别？

**答：** IN 和 EXISTS 都用于子查询，但它们的执行机制和适用场景不同。

### 一、基本语法对比

#### 1. IN 子句

```sql
-- 基本语法
SELECT * FROM table1 
WHERE column IN (SELECT column FROM table2);

-- 示例：查询有订单的用户
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);
```

**工作原理：**
```
1. 执行子查询，获取结果集
2. 将结果集加载到内存
3. 对外表逐行匹配
```

#### 2. EXISTS 子句

```sql
-- 基本语法
SELECT * FROM table1 
WHERE EXISTS (SELECT 1 FROM table2 WHERE condition);

-- 示例：查询有订单的用户
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

**工作原理：**
```
1. 遍历外表的每一行
2. 对每一行执行子查询
3. 如果子查询返回至少一行，EXISTS 为 true
4. 找到匹配后立即停止（短路优化）
```

### 二、核心区别

| 特性 | IN | EXISTS |
|------|----|--------|
| **返回值** | 值列表 | 布尔值（true/false） |
| **执行方式** | 先执行子查询 | 先执行外查询 |
| **NULL 处理** | 不匹配 NULL | 不受 NULL 影响 |
| **性能（子查询表小）** | ✅ 更好 | ❌ 较差 |
| **性能（子查询表大）** | ❌ 较差 | ✅ 更好 |
| **优化策略** | 哈希连接 | 嵌套循环 + 短路 |

### 三、性能对比分析

#### 场景 1：子查询结果集小

```sql
-- 假设 orders 表只有 100 条记录
-- users 表有 100 万条记录

-- ✅ 好：使用 IN
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- 执行过程：
-- 1. 子查询返回 100 个 user_id
-- 2. 将这 100 个 ID 加载到内存
-- 3. 对 users 表进行哈希匹配
-- 4. 快速找到匹配的 100 条记录

-- ❌ 不好：使用 EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- 执行过程：
-- 1. 遍历 users 表的 100 万条记录
-- 2. 对每条记录执行子查询
-- 3. 最多执行 100 万次子查询
```

**结论：** 子查询结果集小时，IN 更快。

#### 场景 2：子查询结果集大

```sql
-- 假设 orders 表有 100 万条记录
-- users 表只有 1000 条记录

-- ❌ 不好：使用 IN
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- 执行过程：
-- 1. 子查询返回 100 万个 user_id
-- 2. 需要将 100 万个 ID 加载到内存
-- 3. 内存占用大，可能溢出
-- 4. 匹配效率低

-- ✅ 好：使用 EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- 执行过程：
-- 1. 遍历 users 表的 1000 条记录
-- 2. 对每条记录执行子查询
-- 3. 子查询可以使用索引，快速判断
-- 4. 找到匹配后立即停止
```

**结论：** 子查询结果集大时，EXISTS 更快。

### 四、NULL 值处理

#### 1. IN 的 NULL 问题

```sql
-- 创建测试表
CREATE TABLE t1 (id INT);
CREATE TABLE t2 (id INT);

INSERT INTO t1 VALUES (1), (2), (3);
INSERT INTO t2 VALUES (1), (NULL), (3);

-- IN 遇到 NULL 的问题
SELECT * FROM t1 WHERE id IN (SELECT id FROM t2);

-- 预期结果：1, 3
-- 实际结果：1, 3  （正确）

-- 但是 NOT IN 会有问题
SELECT * FROM t1 WHERE id NOT IN (SELECT id FROM t2);

-- 预期结果：2
-- 实际结果：空集  （错误！）

-- 原因：
-- id NOT IN (1, NULL, 3)
-- 等价于：id != 1 AND id != NULL AND id != 3
-- 由于 id != NULL 的结果是 UNKNOWN
-- 整个表达式结果为 FALSE
```

**解决方案：**
```sql
-- ✅ 方案 1：过滤 NULL
SELECT * FROM t1 
WHERE id NOT IN (SELECT id FROM t2 WHERE id IS NOT NULL);

-- ✅ 方案 2：使用 NOT EXISTS
SELECT * FROM t1 
WHERE NOT EXISTS (SELECT 1 FROM t2 WHERE t2.id = t1.id);
```

#### 2. EXISTS 不受 NULL 影响

```sql
-- EXISTS 正确处理 NULL
SELECT * FROM t1 
WHERE EXISTS (SELECT 1 FROM t2 WHERE t2.id = t1.id);

-- 结果：1, 3  （正确）

SELECT * FROM t1 
WHERE NOT EXISTS (SELECT 1 FROM t2 WHERE t2.id = t1.id);

-- 结果：2  （正确）
```

**结论：** EXISTS 对 NULL 的处理更安全。

### 五、EXPLAIN 分析

#### 1. IN 的执行计划

```sql
EXPLAIN SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);
```

**输出示例：**
```
+----+--------------+-------------+--------+---------------+---------+
| id | select_type  | table       | type   | key           | rows    |
+----+--------------+-------------+--------+---------------+---------+
|  1 | PRIMARY      | users       | ALL    | NULL          | 1000000 |
|  2 | SUBQUERY     | orders      | index  | idx_user_id   |  100000 |
+----+--------------+-------------+--------+---------------+---------+
```

**说明：**
- 子查询先执行，扫描 orders 表
- 主查询再执行，扫描 users 表
- 使用哈希连接或半连接优化

#### 2. EXISTS 的执行计划

```sql
EXPLAIN SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

**输出示例：**
```
+----+--------------------+-------+------+---------------+---------+
| id | select_type        | table | type | key           | rows    |
+----+--------------------+-------+------+---------------+---------+
|  1 | PRIMARY            | u     | ALL  | NULL          | 1000000 |
|  2 | DEPENDENT SUBQUERY | o     | ref  | idx_user_id   |       1 |
+----+--------------------+-------+------+---------------+---------+
```

**说明：**
- 主查询先执行，遍历 users 表
- 子查询依赖主查询，对每行执行
- 使用索引快速查找，找到即停止

### 六、实际应用场景

#### 场景 1：判断存在性

```sql
-- ✅ 推荐：使用 EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id 
    AND o.status = 'paid'
);

-- 语义更清晰：是否存在已支付的订单
```

#### 场景 2：匹配具体值

```sql
-- ✅ 推荐：使用 IN
SELECT * FROM users 
WHERE id IN (1, 2, 3, 4, 5);

-- 或者
SELECT * FROM users 
WHERE department_id IN (
    SELECT id FROM departments WHERE location = '北京'
);
```

#### 场景 3：NOT IN vs NOT EXISTS

```sql
-- ❌ 不好：NOT IN 有 NULL 问题
SELECT * FROM users 
WHERE id NOT IN (SELECT user_id FROM orders);

-- ✅ 好：NOT EXISTS 更安全
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- 查询没有订单的用户
```

#### 场景 4：多条件匹配

```sql
-- IN：适合单字段匹配
SELECT * FROM users 
WHERE id IN (1, 2, 3);

-- EXISTS：适合多条件匹配
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id 
    AND o.amount > 1000
    AND o.status = 'paid'
);
```

### 七、优化建议

#### 1. 选择原则

```
子查询结果集小 → 使用 IN
子查询结果集大 → 使用 EXISTS
需要判断存在性 → 使用 EXISTS
匹配具体值列表 → 使用 IN
涉及 NULL 值   → 使用 EXISTS
```

#### 2. 现代 MySQL 的优化

MySQL 5.6+ 对 IN 进行了优化：

```sql
-- MySQL 5.6+ 会自动优化 IN 子查询
-- 转换为 semi-join 或 materialization

EXPLAIN SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- 可能看到：
-- select_type: SIMPLE
-- Extra: Using where; Using index

-- 说明优化器已经进行了优化
```

**优化策略：**
- **Semi-join**：半连接优化
- **Materialization**：物化子查询结果
- **Duplicate Weedout**：去重优化

#### 3. 最佳实践

```sql
-- ✅ 好：小结果集用 IN
SELECT * FROM products 
WHERE category_id IN (1, 2, 3);

-- ✅ 好：大结果集用 EXISTS
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.id
    AND o.create_time >= '2024-01-01'
);

-- ✅ 好：NOT EXISTS 替代 NOT IN
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM blacklist b WHERE b.user_id = u.id
);

-- ✅ 好：确保子查询字段有索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### 八、性能测试案例

```sql
-- 测试数据
-- users: 10 万条记录
-- orders: 100 万条记录

-- 测试 1：IN
SELECT SQL_NO_CACHE * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000);
-- 耗时：0.5 秒

-- 测试 2：EXISTS
SELECT SQL_NO_CACHE * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id 
    AND o.amount > 1000
);
-- 耗时：0.3 秒

-- 结论：大数据量时，EXISTS 略快
```

### 九、总结

**核心区别：**
- **IN**：先执行子查询，适合子查询结果集小的场景
- **EXISTS**：先执行外查询，适合子查询结果集大的场景

**选择建议：**
1. ⭐ **子查询小 → 用 IN**
2. **子查询大 → 用 EXISTS**
3. **判断存在性 → 用 EXISTS**
4. **NOT 操作 → 优先用 NOT EXISTS**
5. **涉及 NULL → 用 EXISTS**

**注意事项：**
- NOT IN 有 NULL 陷阱，建议使用 NOT EXISTS
- 确保子查询字段有索引
- MySQL 5.6+ 已优化 IN，性能差距缩小
- 使用 EXPLAIN 分析实际执行计划

## 17. MySQL 如何处理 NULL 值，对性能有什么影响？

**答：** NULL 在 MySQL 中表示"未知"或"不存在"的值，它的处理方式与空字符串、0 等完全不同，对性能和查询逻辑都有重要影响。

### 一、NULL 的基本概念

#### 1. NULL 的含义

```
NULL ≠ 空字符串 ('')
NULL ≠ 0
NULL ≠ false
NULL = 未知值
```

**示例：**
```sql
-- 创建测试表
CREATE TABLE test_null (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    email VARCHAR(100)
);

INSERT INTO test_null (name, age, email) VALUES
('张三', 20, 'zhangsan@example.com'),
('李四', NULL, 'lisi@example.com'),      -- age 为 NULL
('王五', 25, NULL),                       -- email 为 NULL
('赵六', NULL, NULL);                     -- 多个 NULL
```

#### 2. NULL 的比较规则

```sql
-- ❌ 错误：不能用 = 或 != 比较 NULL
SELECT * FROM test_null WHERE age = NULL;      -- 返回空集
SELECT * FROM test_null WHERE age != NULL;     -- 返回空集

-- ✅ 正确：使用 IS NULL 或 IS NOT NULL
SELECT * FROM test_null WHERE age IS NULL;      -- 返回李四、赵六
SELECT * FROM test_null WHERE age IS NOT NULL;  -- 返回张三、王五

-- NULL 与任何值比较都是 UNKNOWN
SELECT NULL = NULL;    -- NULL (不是 true)
SELECT NULL != NULL;   -- NULL (不是 false)
SELECT NULL > 0;       -- NULL
SELECT NULL < 0;       -- NULL
```

### 二、NULL 对索引的影响

#### 1. NULL 可以被索引

```sql
-- MySQL 的 InnoDB 和 MyISAM 引擎允许 NULL 值被索引
CREATE INDEX idx_age ON test_null(age);

-- 可以使用索引查询 NULL
EXPLAIN SELECT * FROM test_null WHERE age IS NULL;
-- type: ref, key: idx_age  ✅ 使用了索引
```

**注意：**
- **InnoDB/MyISAM**：NULL 可以被索引
- **某些数据库**（如 Oracle）：NULL 不能被索引

#### 2. NULL 对联合索引的影响

```sql
-- 创建联合索引
CREATE INDEX idx_name_age ON test_null(name, age);

-- ✅ 可以使用索引
SELECT * FROM test_null WHERE name = '张三' AND age IS NULL;

-- ⚠️ 注意：如果第一列是 NULL，可能无法使用索引
SELECT * FROM test_null WHERE name IS NULL AND age = 20;
```

#### 3. COUNT 对 NULL 的处理

```sql
-- COUNT(*) 统计所有行（包括 NULL）
SELECT COUNT(*) FROM test_null;  -- 4

-- COUNT(column) 不统计 NULL 值
SELECT COUNT(age) FROM test_null;    -- 2（排除了 2 个 NULL）
SELECT COUNT(email) FROM test_null;  -- 2（排除了 2 个 NULL）

-- COUNT(DISTINCT column) 也不统计 NULL
SELECT COUNT(DISTINCT age) FROM test_null;  -- 2
```

### 三、NULL 对性能的影响

#### 1. 存储空间

```sql
-- NULL 需要额外的存储空间
-- InnoDB 中，每个可为 NULL 的列需要 1 位（bit）来标记

-- 查看表的存储信息
SHOW TABLE STATUS LIKE 'test_null';

-- 对比：
-- CREATE TABLE t1 (col INT NOT NULL);     -- 每行节省空间
-- CREATE TABLE t2 (col INT NULL);         -- 每行多 1 bit
```

**影响：**
- 大量 NULL 值会增加存储开销
- 影响缓冲池利用率
- 降低 I/O 效率

#### 2. 索引效率

```sql
-- NULL 值会降低索引的选择性

-- 假设 age 字段有大量 NULL
SELECT 
    COUNT(*) AS total,
    COUNT(age) AS not_null,
    COUNT(*) - COUNT(age) AS null_count,
    (COUNT(*) - COUNT(age)) / COUNT(*) * 100 AS null_percentage
FROM test_null;

-- 如果 NULL 比例很高（如 > 50%），索引效果会很差
```

**影响：**
- NULL 值多 → 索引区分度低 → 优化器可能不使用索引
- B+ 树中包含 NULL 节点 → 增加树的高度

#### 3. 查询性能

```sql
-- ❌ 不好：NULL 导致索引失效
SELECT * FROM users WHERE phone != '';  -- phone 有很多 NULL

-- ✅ 好：明确处理 NULL
SELECT * FROM users WHERE phone IS NOT NULL AND phone != '';

-- ❌ 不好：函数操作 NULL
SELECT * FROM users WHERE IFNULL(phone, '') = '13800138000';

-- ✅ 好：直接比较
SELECT * FROM users WHERE phone = '13800138000';
```

### 四、NULL 在聚合函数中的处理

#### 1. 常见聚合函数

```sql
-- SUM、AVG、MAX、MIN 都忽略 NULL
SELECT 
    SUM(age) AS sum_age,      -- 忽略 NULL
    AVG(age) AS avg_age,      -- 忽略 NULL
    MAX(age) AS max_age,      -- 忽略 NULL
    MIN(age) AS min_age       -- 忽略 NULL
FROM test_null;

-- 结果：
-- sum_age: 45 (20 + 25)
-- avg_age: 22.5 (45 / 2)
-- max_age: 25
-- min_age: 20
```

#### 2. GROUP BY 和 NULL

```sql
-- NULL 值会被分为一组
SELECT age, COUNT(*) AS count
FROM test_null
GROUP BY age;

-- 结果：
-- | age  | count |
-- |------|-------|
-- | NULL | 2     |  ← NULL 作为一组
-- | 20   | 1     |
-- | 25   | 1     |
```

#### 3. ORDER BY 和 NULL

```sql
-- MySQL 中，NULL 被认为是最小值
SELECT * FROM test_null ORDER BY age ASC;
-- NULL 值排在最前面

SELECT * FROM test_null ORDER BY age DESC;
-- NULL 值排在最后面

-- 控制 NULL 的排序位置
SELECT * FROM test_null 
ORDER BY 
    CASE WHEN age IS NULL THEN 1 ELSE 0 END,  -- NULL 排后面
    age ASC;
```

### 五、NULL 的安全处理

#### 1. 使用 COALESCE

```sql
-- COALESCE 返回第一个非 NULL 值
SELECT 
    name,
    COALESCE(age, 0) AS age,           -- NULL 转为 0
    COALESCE(email, 'N/A') AS email    -- NULL 转为 'N/A'
FROM test_null;

-- 结果：
-- | name | age | email                |
-- |------|-----|----------------------|
-- | 张三 | 20  | zhangsan@example.com |
-- | 李四 | 0   | lisi@example.com     |
-- | 王五 | 25  | N/A                  |
-- | 赵六 | 0   | N/A                  |
```

#### 2. 使用 IFNULL

```sql
-- IFNULL(expr1, expr2)：如果 expr1 为 NULL，返回 expr2
SELECT 
    name,
    IFNULL(age, 0) AS age,
    IFNULL(email, 'unknown') AS email
FROM test_null;
```

#### 3. 使用 NULLIF

```sql
-- NULLIF(expr1, expr2)：如果 expr1 = expr2，返回 NULL
SELECT NULLIF('', '') AS result;   -- NULL
SELECT NULLIF('a', 'b') AS result; -- 'a'

-- 应用场景：避免除零错误
SELECT 
    name,
    total_amount / NULLIF(order_count, 0) AS avg_amount
FROM orders;
```

#### 4. 使用 CASE WHEN

```sql
SELECT 
    name,
    CASE 
        WHEN age IS NULL THEN '未知'
        WHEN age < 18 THEN '未成年'
        WHEN age < 60 THEN '成年'
        ELSE '老年'
    END AS age_group
FROM test_null;
```

### 六、NULL 的常见陷阱

#### 陷阱 1：NOT IN 与 NULL

```sql
-- ❌ 危险：NOT IN 遇到 NULL 会返回空集
SELECT * FROM users 
WHERE id NOT IN (SELECT user_id FROM orders);  -- 如果 user_id 有 NULL

-- 原因：
-- id NOT IN (1, 2, NULL)
-- 等价于：id != 1 AND id != 2 AND id != NULL
-- id != NULL 的结果是 UNKNOWN
-- 整个表达式为 FALSE

-- ✅ 安全：使用 NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- 或者过滤 NULL
SELECT * FROM users 
WHERE id NOT IN (
    SELECT user_id FROM orders WHERE user_id IS NOT NULL
);
```

#### 陷阱 2：外连接与 NULL

```sql
-- LEFT JOIN 会产生 NULL
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 结果：
-- | name | order_no |
-- |------|----------|
-- | 张三 | ORD001   |
-- | 李四 | NULL     |  ← 没有订单

-- 查找没有订单的用户
SELECT u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.user_id IS NULL;  -- 正确

-- ❌ 错误
WHERE o.user_id = NULL;  -- 不会返回任何结果
```

#### 陷阱 3：唯一索引与 NULL

```sql
-- MySQL 中，唯一索引允许多个 NULL 值
CREATE UNIQUE INDEX idx_email ON users(email);

INSERT INTO users (name, email) VALUES ('张三', NULL);
INSERT INTO users (name, email) VALUES ('李四', NULL);  -- ✅ 成功

-- 注意：这与 SQL 标准不同
-- SQL 标准：唯一约束中 NULL 也应该唯一
-- MySQL：NULL != NULL，所以可以有多个 NULL
```

#### 陷阱 4：DISTINCT 与 NULL

```sql
-- DISTINCT 会将所有 NULL 视为相同
SELECT DISTINCT age FROM test_null;

-- 结果：
-- | age  |
-- |------|
-- | NULL |  ← 只有一个 NULL
-- | 20   |
-- | 25   |
```

### 七、最佳实践

#### 1. 尽量避免使用 NULL

```sql
-- ❌ 不好：大量使用 NULL
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    phone VARCHAR(20),      -- 可能为 NULL
    email VARCHAR(100),     -- 可能为 NULL
    address VARCHAR(200)    -- 可能为 NULL
);

-- ✅ 好：使用默认值
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL DEFAULT '',
    address VARCHAR(200) NOT NULL DEFAULT ''
);
```

**优点：**
- 简化查询逻辑
- 提高索引效率
- 减少存储开销
- 避免 NULL 相关陷阱

#### 2. 必须使用 NULL 时的建议

```sql
-- 场景：确实需要表示"未知"或"不存在"

-- ✅ 建议 1：明确文档说明
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    resign_date DATE NULL  -- NULL 表示未离职
);

-- ✅ 建议 2：使用合适的默认值
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    discount DECIMAL(5, 2) NOT NULL DEFAULT 0.00  -- 0 表示无折扣
);

-- ✅ 建议 3：查询时正确处理 NULL
SELECT * FROM employees 
WHERE resign_date IS NULL;  -- 在职员工

SELECT * FROM employees 
WHERE resign_date IS NOT NULL;  -- 已离职员工
```

#### 3. 索引优化

```sql
-- 如果字段有很多 NULL，考虑部分索引
CREATE INDEX idx_phone_not_null ON users(phone(20)) 
WHERE phone IS NOT NULL;  -- MySQL 8.0.13+ 支持

-- 或者使用联合索引
CREATE INDEX idx_name_phone ON users(name, phone);
-- 即使 phone 有 NULL，name 的索引仍然有效
```

#### 4. 查询优化

```sql
-- ❌ 不好：隐式处理 NULL
SELECT * FROM users WHERE COALESCE(phone, '') != '';

-- ✅ 好：显式处理 NULL
SELECT * FROM users WHERE phone IS NOT NULL AND phone != '';

-- ❌ 不好：函数操作导致索引失效
SELECT * FROM users WHERE IFNULL(age, 0) > 18;

-- ✅ 好：分开处理
SELECT * FROM users WHERE age > 18 OR age IS NULL;
```

### 八、总结

**NULL 的核心特性：**
1. NULL 表示"未知"，不等于任何值（包括 NULL 本身）
2. 必须使用 IS NULL / IS NOT NULL 进行判断
3. 聚合函数忽略 NULL 值
4. NULL 可以被索引（InnoDB/MyISAM）

**性能影响：**
1. ⭐ **存储开销**：每个 NULL 列需要额外 1 bit
2. **索引效率**：大量 NULL 会降低索引选择性
3. **查询性能**：不当处理会导致索引失效

**最佳实践：**
1. ⭐ **尽量避免 NULL**：使用默认值替代
2. **必须使用时**：明确语义，正确处理
3. **查询时**：使用 IS NULL，避免 NOT IN
4. **索引时**：考虑 NULL 对索引的影响
5. **文档化**：明确 NULL 的含义

**记忆口诀：**
- NULL 不等任何值
- 判断要用 IS NULL
- 聚合函数忽略它
- 尽量不用最安全
- NOT IN 时要小心
- 索引效率受影响

## 18. 如何在 MySQL 中处理和避免全表扫描？

**答：** 全表扫描（Full Table Scan）是指数据库遍历表中的每一行来查找匹配的记录，这是性能最差的数据访问方式。以下是识别、处理和避免全表扫描的方法。

### 一、什么是全表扫描

#### 1. 定义

```
全表扫描：数据库引擎从头到尾扫描表中的所有数据行
- EXPLAIN 中 type 字段显示为 'ALL'
- 没有使用任何索引
- 数据量大时性能极差
```

#### 2. 示例

```sql
-- 创建测试表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    age INT,
    city VARCHAR(50),
    create_time DATETIME
);

-- 插入 100 万条测试数据
INSERT INTO users (name, email, age, city, create_time)
SELECT 
    CONCAT('user_', seq),
    CONCAT('user_', seq, '@example.com'),
    FLOOR(RAND() * 50) + 18,
    ELT(FLOOR(RAND() * 10) + 1, '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '重庆'),
    DATE_ADD('2020-01-01', INTERVAL FLOOR(RAND() * 1500) DAY)
FROM (
    SELECT @row := @row + 1 AS seq
    FROM information_schema.columns c1, information_schema.columns c2,
    (SELECT @row := 0) r
    LIMIT 1000000
) t;

-- 全表扫描示例
EXPLAIN SELECT * FROM users WHERE age = 25;
-- type: ALL, rows: 1000000  ← 扫描全部 100 万行
```

### 二、如何识别全表扫描

#### 1. 使用 EXPLAIN

```sql
-- 查看执行计划
EXPLAIN SELECT * FROM users WHERE age = 25;

-- 输出：
-- +----+-------------+-------+------+---------------+------+---------+------+---------+-------------+
-- | id | select_type | table | type | possible_keys | key  | key_len | ref  | rows    | Extra       |
-- +----+-------------+-------+------+---------------+------+---------+------+---------+-------------+
-- |  1 | SIMPLE      | users | ALL  | NULL          | NULL | NULL    | NULL | 1000000 | Using where |
-- +----+-------------+-------+------+---------------+------+---------+------+---------+-------------+

-- 关键指标：
-- type: ALL         ← 全表扫描
-- key: NULL         ← 未使用索引
-- rows: 1000000     ← 需要扫描 100 万行
```

#### 2. 慢查询日志

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过 1 秒的查询

-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query%';

-- 分析慢查询日志
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

#### 3. Performance Schema

```sql
-- 查看全表扫描的查询
SELECT 
    DIGEST_TEXT,
    COUNT_STAR AS exec_count,
    SUM_TIMER_WAIT/1000000000000 AS total_latency_sec
FROM performance_schema.events_statements_summary_by_digest
WHERE DIGEST_TEXT LIKE '%SELECT%'
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

### 三、全表扫描的常见原因

#### 1. 没有合适的索引

```sql
-- ❌ 全表扫描：没有索引
SELECT * FROM users WHERE email = 'test@example.com';

-- ✅ 解决：添加索引
CREATE INDEX idx_email ON users(email);
```

#### 2. 索引失效

```sql
-- ❌ 全表扫描：函数操作导致索引失效
SELECT * FROM users WHERE YEAR(create_time) = 2024;

-- ✅ 解决：改写查询
SELECT * FROM users 
WHERE create_time >= '2024-01-01' 
  AND create_time < '2025-01-01';

-- ❌ 全表扫描：模糊查询以 % 开头
SELECT * FROM users WHERE name LIKE '%张三';

-- ✅ 解决：使用前缀匹配
SELECT * FROM users WHERE name LIKE '张三%';

-- ❌ 全表扫描：类型隐式转换
SELECT * FROM users WHERE phone = 13800138000;  -- phone 是 VARCHAR

-- ✅ 解决：使用正确的类型
SELECT * FROM users WHERE phone = '13800138000';
```

#### 3. OR 条件不当

```sql
-- ❌ 全表扫描：OR 连接未索引字段
SELECT * FROM users WHERE name = '张三' OR age = 25;
-- 如果 age 没有索引，会导致全表扫描

-- ✅ 解决：使用 UNION
SELECT * FROM users WHERE name = '张三'
UNION
SELECT * FROM users WHERE age = 25;
```

#### 4. 不使用索引列

```sql
-- ❌ 全表扫描：对索引列进行计算
SELECT * FROM users WHERE age + 1 > 25;

-- ✅ 解决：改写条件
SELECT * FROM users WHERE age > 24;

-- ❌ 全表扫描：NOT IN 或 !=
SELECT * FROM users WHERE city != '北京';

-- ✅ 解决：使用 IN（如果可选值少）
SELECT * FROM users WHERE city IN ('上海', '广州', '深圳');
```

#### 5. 数据量小或选择性低

```sql
-- 优化器可能认为全表扫描更快
-- 当返回的行数超过表的 20-30% 时

SELECT * FROM users WHERE age > 18;  -- 如果大部分用户都 > 18
-- 优化器可能选择全表扫描
```

### 四、避免全表扫描的方法

#### 方法 1：添加合适的索引

```sql
-- 单列索引
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_age ON users(age);

-- 联合索引（推荐）
CREATE INDEX idx_age_city ON users(age, city);

-- 覆盖索引
CREATE INDEX idx_name_email ON users(name, email);
-- SELECT name, email FROM users WHERE name = '张三';  -- 无需回表

-- 前缀索引（长字符串）
CREATE INDEX idx_email_prefix ON users(email(20));
```

**索引选择原则：**
- 区分度高的字段优先
- 频繁查询的字段
- JOIN、ORDER BY、GROUP BY 的字段

#### 方法 2：优化查询语句

```sql
-- ❌ 不好：SELECT *
SELECT * FROM users WHERE age = 25;

-- ✅ 好：只查询需要的列
SELECT id, name, email FROM users WHERE age = 25;

-- ❌ 不好：函数操作
SELECT * FROM users WHERE LEFT(name, 2) = '张三';

-- ✅ 好：直接比较
SELECT * FROM users WHERE name LIKE '张三%';

-- ❌ 不好：子查询
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- ✅ 好：JOIN
SELECT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

#### 方法 3：使用覆盖索引

```sql
-- 创建覆盖索引
CREATE INDEX idx_name_age_email ON users(name, age, email);

-- 查询只需要索引中的数据，无需回表
EXPLAIN SELECT name, age, email FROM users WHERE name = '张三';
-- Extra: Using index  ← 覆盖索引

-- 对比：需要回表
EXPLAIN SELECT name, age, email, city FROM users WHERE name = '张三';
-- Extra: Using where  ← 需要回表获取 city
```

#### 方法 4：分页优化

```sql
-- ❌ 不好：深分页
SELECT * FROM users ORDER BY id LIMIT 1000000, 10;
-- 需要扫描 1000010 行，然后丢弃前 1000000 行

-- ✅ 好：使用游标分页
SELECT * FROM users WHERE id > 1000000 ORDER BY id LIMIT 10;

-- ✅ 好：延迟关联
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 1000000, 10
) AS tmp ON u.id = tmp.id;
```

#### 方法 5：分区表

```sql
-- 按时间分区
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50),
    amount DECIMAL(10, 2),
    create_time DATETIME
) PARTITION BY RANGE (YEAR(create_time)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- 查询时自动裁剪分区
SELECT * FROM orders WHERE create_time >= '2024-01-01';
-- 只扫描 p2024 和 pmax 分区
```

#### 方法 6：使用缓存

```sql
-- 热点数据使用 Redis 缓存
-- 应用层逻辑：

# Python 示例
def get_user(user_id):
    # 先查缓存
    user = redis.get(f'user:{user_id}')
    if user:
        return json.loads(user)
    
    # 缓存未命中，查数据库
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    
    # 写入缓存
    if user:
        redis.setex(f'user:{user_id}', 3600, json.dumps(user))
    
    return user
```

### 五、实战优化案例

#### 案例 1：添加索引优化

```sql
-- 原始查询（全表扫描）
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- type: ALL, rows: 1000000

-- 优化：添加索引
CREATE INDEX idx_email ON users(email);

-- 优化后
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- type: ref, key: idx_email, rows: 1  ✅

-- 性能提升：从 1000ms 降到 1ms
```

#### 案例 2：联合索引优化

```sql
-- 原始查询
SELECT * FROM users WHERE age = 25 AND city = '北京';

-- 方案 1：单独索引
CREATE INDEX idx_age ON users(age);
CREATE INDEX idx_city ON users(city);
-- 优化器只能使用一个索引

-- 方案 2：联合索引（推荐）
CREATE INDEX idx_age_city ON users(age, city);
-- 可以同时使用两个条件

EXPLAIN SELECT * FROM users WHERE age = 25 AND city = '北京';
-- type: ref, key: idx_age_city  ✅
```

#### 案例 3：避免函数操作

```sql
-- 原始查询（全表扫描）
SELECT * FROM users WHERE DATE(create_time) = '2024-01-01';
-- type: ALL

-- 优化：范围查询
SELECT * FROM users 
WHERE create_time >= '2024-01-01 00:00:00' 
  AND create_time < '2024-01-02 00:00:00';

-- 添加索引
CREATE INDEX idx_create_time ON users(create_time);

EXPLAIN SELECT * FROM users 
WHERE create_time >= '2024-01-01 00:00:00' 
  AND create_time < '2024-01-02 00:00:00';
-- type: range, key: idx_create_time  ✅
```

#### 案例 4：大表分页优化

```sql
-- 原始查询（慢）
SELECT * FROM users ORDER BY id LIMIT 900000, 10;
-- 耗时：2000ms

-- 优化 1：游标分页
SELECT * FROM users WHERE id > 900000 ORDER BY id LIMIT 10;
-- 耗时：10ms  ✅

-- 优化 2：延迟关联
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 900000, 10
) AS tmp ON u.id = tmp.id;
-- 耗时：50ms  ✅
```

### 六、监控和预防

#### 1. 定期分析慢查询

```bash
# 每周分析慢查询日志
mysqldumpslow -s t -t 20 /var/log/mysql/slow.log > /tmp/slow_report.txt

# 找出全表扫描的查询
grep "type: ALL" /tmp/explain_results.txt
```

#### 2. 使用 pt-query-digest

```bash
# 安装 Percona Toolkit
pt-query-digest /var/log/mysql/slow.log \
  --order-by Query_time:sum \
  --limit 10 \
  --report-format profile
```

#### 3. 设置告警

```sql
-- 监控全表扫描次数
SHOW STATUS LIKE 'Select_scan';

-- 监控未使用索引的查询
SHOW STATUS LIKE 'Select_full_join';

-- 设置阈值告警
-- Select_scan / QPS > 0.1 时告警
```

#### 4. 定期审查索引

```sql
-- 查看未使用的索引
SELECT 
    table_schema,
    table_name,
    index_name,
    rows_read
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
  AND rows_read = 0
  AND table_schema = 'mydb';

-- 删除未使用的索引
DROP INDEX idx_unused ON users;
```

### 七、最佳实践总结

#### 避免全表扫描 checklist

- [ ] **所有查询都用 EXPLAIN 分析**
- [ ] **确保 type 不是 ALL**
- [ ] **WHERE 条件字段有索引**
- [ ] **避免在索引列上使用函数**
- [ ] **避免类型隐式转换**
- [ ] **LIKE 不以 % 开头**
- [ ] **使用覆盖索引优化**
- [ ] **大表分页使用游标**
- [ ] **定期清理无用索引**
- [ ] **监控慢查询日志**

#### 性能优化建议

1. ⭐ **优先添加索引**：最直接有效的方法
2. **优化 SQL 写法**：避免索引失效
3. **使用覆盖索引**：减少回表
4. **合理分页**：避免深分页
5. **使用缓存**：减轻数据库压力
6. **分区表**：大数据量场景
7. **定期维护**：分析和优化索引

### 八、总结

**识别全表扫描：**
- EXPLAIN 中 type = ALL
- 慢查询日志中的高耗时查询
- Performance Schema 统计

**主要原因：**
1. 没有索引
2. 索引失效（函数、类型转换、模糊查询等）
3. OR 条件不当
4. 数据选择性低

**解决方法：**
1. ⭐ **添加合适的索引**
2. **优化 SQL 语句**
3. **使用覆盖索引**
4. **分页优化**
5. **使用缓存**
6. **分区表**

**核心原则：**
- 能用索引就不用全表扫描
- 定期监控和优化
- 权衡读写性能

## 19. MySQL 中的表空间是什么，它的作用是什么？

**答：** 表空间（Tablespace）是 InnoDB 存储引擎中用于管理数据存储的逻辑容器，它决定了数据和索引在磁盘上的组织方式。

### 一、表空间的概念

#### 1. 什么是表空间？

```
表空间：InnoDB 存储数据的逻辑区域
- 包含数据文件（.ibd）
- 存储表数据、索引、 undo log 等
- 是 InnoDB 最高的存储层次
```

**层次结构：**
```
表空间 (Tablespace)
  └── 段 (Segment)
      └── 区 (Extent, 1MB = 64个页)
          └── 页 (Page, 16KB)
              └── 行 (Row)
```

#### 2. 表空间的类型

MySQL InnoDB 支持三种表空间类型：

| 类型 | 说明 | 文件位置 |
|------|------|----------|
| **系统表空间** | 存储系统数据和共享数据 | ibdata1 |
| **独立表空间** | 每个表一个文件 | table.ibd |
| **通用表空间** | 多个表共享的文件 | user_defined.ibd |

### 二、系统表空间（System Tablespace）

#### 1. 特点

```sql
-- 系统表空间文件
ibdata1  -- 默认的系统表空间文件

-- 存储内容：
-- 1. 数据字典（Data Dictionary）
-- 2. Undo Log（回滚日志）
-- 3. 双写缓冲区（Doublewrite Buffer）
-- 4. 插入缓冲（Insert Buffer）
-- 5. 系统表的聚簇索引
```

**特点：**
- ✅ 所有表共享
- ❌ 无法收缩（即使删除数据，文件也不会变小）
- ❌ 备份和恢复困难
- ❌ I/O 竞争激烈

#### 2. 配置

```ini
# my.cnf 配置
[mysqld]
innodb_data_file_path = ibdata1:12M:autoextend
# 初始大小 12M，自动扩展

# 多个系统表空间文件
innodb_data_file_path = ibdata1:50M;ibdata2:50M:autoextend
```

#### 3. 问题

```sql
-- 问题 1：文件无限增长
-- 删除大量数据后，ibdata1 不会缩小

-- 问题 2：备份困难
-- 需要备份整个 ibdata1，即使只修改了一个表

-- 问题 3：I/O 瓶颈
-- 所有表的读写都集中在一个文件
```

### 三、独立表空间（File-Per-Table Tablespace）

#### 1. 特点

```sql
-- 启用独立表空间（MySQL 5.6+ 默认启用）
SHOW VARIABLES LIKE 'innodb_file_per_table';
-- Value: ON

-- 每个表有自己的 .ibd 文件
users.ibd    -- users 表的数据和索引
orders.ibd   -- orders 表的数据和索引
```

**特点：**
- ✅ 每个表独立文件
- ✅ 可以单独备份和恢复
- ✅ 可以收缩空间（OPTIMIZE TABLE）
- ✅ I/O 分散，性能更好
- ✅ 支持表空间传输（Transportable Tablespace）

#### 2. 优势

```sql
-- 优势 1：空间回收
DELETE FROM users WHERE id < 10000;
OPTIMIZE TABLE users;  -- 回收空间，缩小 .ibd 文件

-- 优势 2：单独备份
-- 只需备份 users.ibd，无需备份整个系统表空间

-- 优势 3：快速删除表
DROP TABLE users;  -- 直接删除 users.ibd 文件

-- 优势 4：表空间传输
-- 可以将 .ibd 文件从一个实例复制到另一个实例
```

#### 3. 配置和管理

```sql
-- 查看表的表空间信息
SELECT 
    table_schema,
    table_name,
    tablespace_name,
    data_length / 1024 / 1024 AS data_mb,
    index_length / 1024 / 1024 AS index_mb
FROM information_schema.tables
WHERE table_schema = 'mydb';

-- 结果：
-- | table_schema | table_name | tablespace_name | data_mb | index_mb |
-- |--------------|------------|-----------------|---------|----------|
-- | mydb         | users      | mydb/users      | 100     | 50       |
-- | mydb         | orders     | mydb/orders     | 200     | 80       |

-- 迁移表到独立表空间
ALTER TABLE users ENGINE=InnoDB;  -- 如果之前使用系统表空间
```

### 四、通用表空间（General Tablespace）

#### 1. 特点

```sql
-- 创建通用表空间（MySQL 5.7+）
CREATE TABLESPACE ts_app 
ADD DATAFILE 'ts_app.ibd' 
FILE_BLOCK_SIZE = 16384
ENGINE = InnoDB;

-- 将表添加到通用表空间
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50)
) TABLESPACE ts_app;

-- 或者修改现有表
ALTER TABLE orders TABLESPACE ts_app;
```

**特点：**
- ✅ 多个表共享一个表空间文件
- ✅ 可以存储在非数据目录
- ✅ 支持不同的页大小
- ✅ 灵活的空间管理

#### 2. 使用场景

```sql
-- 场景 1：相关表放在一起
CREATE TABLESPACE ts_order 
ADD DATAFILE '/data/orders/ts_order.ibd'
ENGINE = InnoDB;

CREATE TABLE orders (...) TABLESPACE ts_order;
CREATE TABLE order_items (...) TABLESPACE ts_order;
CREATE TABLE order_logs (...) TABLESPACE ts_order;

-- 场景 2：使用 SSD 存储热点数据
CREATE TABLESPACE ts_hot 
ADD DATAFILE '/ssd/hot/ts_hot.ibd'
ENGINE = InnoDB;

CREATE TABLE hot_products (...) TABLESPACE ts_hot;

-- 场景 3：不同页大小
CREATE TABLESPACE ts_compressed 
ADD DATAFILE 'ts_compressed.ibd'
FILE_BLOCK_SIZE = 8192  -- 8KB 页，用于压缩表
ENGINE = InnoDB;

CREATE TABLE large_text (...) 
TABLESPACE ts_compressed
ROW_FORMAT=COMPRESSED;
```

### 五、表空间的操作

#### 1. 查看表空间信息

```sql
-- 查看所有表空间
SELECT * FROM information_schema.INNODB_TABLESPACES;

-- 查看表空间文件
SELECT 
    space,
    name,
    file_format,
    row_format,
    space_type
FROM information_schema.INNODB_TABLESPACES;

-- 查看表空间使用情况
SELECT 
    tablespace_name,
    SUM(data_length) / 1024 / 1024 AS total_data_mb,
    SUM(index_length) / 1024 / 1024 AS total_index_mb,
    COUNT(*) AS table_count
FROM information_schema.tables
GROUP BY tablespace_name;
```

#### 2. 表空间维护

```sql
-- 收缩表空间（独立表空间）
OPTIMIZE TABLE users;

-- 重建表空间
ALTER TABLE users FORCE;

-- 导入表空间
ALTER TABLE users DISCARD TABLESPACE;  -- 卸载
-- 复制 .ibd 文件到指定位置
ALTER TABLE users IMPORT TABLESPACE;   -- 导入

-- 删除通用表空间
DROP TABLESPACE ts_app;
-- 注意：必须先删除或迁移其中的所有表
```

#### 3. 表空间传输

```sql
-- 步骤 1：源服务器
FLUSH TABLES users FOR EXPORT;  -- 锁定表并生成 .cfg 文件
-- 复制 users.ibd 和 users.cfg 到目标服务器
UNLOCK TABLES;

-- 步骤 2：目标服务器
CREATE TABLE users (...);  -- 创建相同结构的表
ALTER TABLE users DISCARD TABLESPACE;  -- 卸载表空间
-- 复制 users.ibd 和 users.cfg 到数据目录
ALTER TABLE users IMPORT TABLESPACE;   -- 导入表空间
```

### 六、表空间的选择建议

#### 1. 独立表空间 vs 系统表空间

```sql
-- ✅ 推荐：使用独立表空间（默认）
SHOW VARIABLES LIKE 'innodb_file_per_table';
-- 确保值为 ON

-- 优点：
-- 1. 空间可回收
-- 2. 备份灵活
-- 3. I/O 分散
-- 4. 快速删除表

-- ❌ 不推荐：使用系统表空间
-- 除非有特殊需求（如嵌入式设备）
```

#### 2. 独立表空间 vs 通用表空间

| 场景 | 推荐 | 原因 |
|------|------|------|
| **大多数应用** | 独立表空间 | 简单、灵活 |
| **相关表分组** | 通用表空间 | 便于管理 |
| **不同存储介质** | 通用表空间 | 灵活部署 |
| **压缩表** | 通用表空间 | 支持不同页大小 |
| **云环境** | 独立表空间 | 便于扩容 |

#### 3. 最佳实践

```sql
-- ✅ 实践 1：默认使用独立表空间
-- my.cnf
[mysqld]
innodb_file_per_table = ON

-- ✅ 实践 2：大表使用独立表空间
-- 每个大表都有自己的 .ibd 文件，便于管理

-- ✅ 实践 3：相关小表使用通用表空间
CREATE TABLESPACE ts_small_tables 
ADD DATAFILE 'ts_small.ibd'
ENGINE = InnoDB;

CREATE TABLE config_1 (...) TABLESPACE ts_small_tables;
CREATE TABLE config_2 (...) TABLESPACE ts_small_tables;

-- ✅ 实践 4：定期优化表空间
-- 每周执行
OPTIMIZE TABLE users;
OPTIMIZE TABLE orders;

-- ✅ 实践 5：监控表空间使用
SELECT 
    table_name,
    data_length / 1024 / 1024 AS data_mb,
    data_free / 1024 / 1024 AS free_mb,
    (data_free / data_length) * 100 AS fragmentation_pct
FROM information_schema.tables
WHERE table_schema = 'mydb'
  AND data_length > 0
ORDER BY fragmentation_pct DESC;
```

### 七、表空间与性能

#### 1. I/O 性能

```sql
-- 独立表空间：I/O 分散
-- users.ibd, orders.ibd, products.ibd
-- 可以并行读写，减少竞争

-- 系统表空间：I/O 集中
-- 所有表都在 ibdata1
-- 容易成为瓶颈
```

#### 2. 空间管理

```sql
-- 独立表空间：可以收缩
DELETE FROM users WHERE id < 10000;
-- users.ibd 文件大小不变

OPTIMIZE TABLE users;
-- users.ibd 文件缩小，释放磁盘空间

-- 系统表空间：无法收缩
-- 即使删除数据，ibdata1 也不会变小
-- 只能重建整个实例
```

#### 3. 备份恢复

```bash
# 独立表空间：可以单独备份
mysqldump mydb users > users.sql
# 或者物理备份
cp /var/lib/mysql/mydb/users.ibd /backup/

# 系统表空间：必须整体备份
mysqldump --all-databases > all.sql
```

### 八、常见问题

#### 问题 1：ibd 文件过大

```sql
-- 原因：大量 DELETE 操作后未优化

-- 解决：
OPTIMIZE TABLE users;  -- 重建表，回收空间

-- 或者
ALTER TABLE users ENGINE=InnoDB;  -- 重建表
```

#### 问题 2：ibdata1 无限增长

```sql
-- 原因：使用了系统表空间

-- 解决：
-- 1. 启用独立表空间
-- my.cnf
[mysqld]
innodb_file_per_table = ON

-- 2. 迁移现有表
ALTER TABLE users ENGINE=InnoDB;
ALTER TABLE orders ENGINE=InnoDB;
-- ... 对所有表执行

-- 3. 重建实例（彻底解决）
-- 导出数据 → 停止服务 → 删除 ibdata1 → 启动服务 → 导入数据
```

#### 问题 3：表空间损坏

```sql
-- 检查表空间
CHECK TABLE users;

-- 修复表空间
REPAIR TABLE users;  -- 仅适用于 MyISAM

-- InnoDB 表空间损坏
-- 1. 从备份恢复
-- 2. 使用 ibdconnect 工具
-- 3. 联系专业支持
```

### 九、总结

**表空间类型：**
1. **系统表空间**：共享文件，无法收缩，不推荐
2. **独立表空间**：每表一文件，推荐使用
3. **通用表空间**：多表共享，特殊场景使用

**核心优势：**
- ✅ 独立表空间：空间可回收、备份灵活、I/O 分散
- ✅ 通用表空间：灵活部署、支持不同页大小

**最佳实践：**
1. ⭐ **默认使用独立表空间**
2. **定期 OPTIMIZE TABLE**
3. **监控表空间使用**
4. **相关表可使用通用表空间**
5. **避免使用系统表空间**

**记忆要点：**
- 独立表空间最常用
- 每表一个 ibd 文件
- 可以收缩和传输
- 通用表空间更灵活
- 系统表空间已淘汰

## 20. 在 MySQL 中，如何优化 ORDER BY 查询？

**答：** ORDER BY 排序是数据库查询中的常见操作，但不当使用会导致性能问题。以下是优化 ORDER BY 查询的方法。

### 一、ORDER BY 的工作原理

#### 1. 两种排序方式

```sql
-- 方式 1：索引排序（Using index）
-- 数据已经按索引顺序存储，无需额外排序
SELECT * FROM users ORDER BY id;  -- id 是主键，已排序

-- 方式 2：文件排序（Using filesort）
-- 需要额外的排序操作
SELECT * FROM users ORDER BY name;  -- name 无索引，需要排序
```

**性能对比：**
- **索引排序**：非常快，直接按索引顺序读取
- **文件排序**：较慢，需要在内存或磁盘中排序

#### 2. EXPLAIN 分析

```sql
-- 查看排序方式
EXPLAIN SELECT * FROM users ORDER BY create_time;

-- 输出示例 1：使用索引
-- +----+-------------+-------+------+---------------+---------+---------+------+------+
-- | id | select_type | table | type | key           | Extra   |       |      |      |
-- +----+-------------+-------+------+---------------+---------+---------+------+------+
-- |  1 | SIMPLE      | users | ALL  | NULL          | Using filesort |  ← 文件排序
-- +----+-------------+-------+------+---------------+---------+---------+------+------+

-- 输出示例 2：使用索引
-- +----+-------------+-------+------+---------------+---------+---------+------+------+
-- | id | select_type | table | type | key           | Extra   |       |      |      |
-- +----+-------------+-------+------+---------------+---------+---------+------+------+
-- |  1 | SIMPLE      | users | ALL  | idx_create    | NULL    |  ← 索引排序
-- +----+-------------+-------+------+---------------+---------+---------+------+------+
```

### 二、避免文件排序（Filesort）

#### 1. 创建合适的索引

```sql
-- ❌ 不好：没有索引，使用 filesort
SELECT * FROM users ORDER BY create_time;
-- Extra: Using filesort

-- ✅ 好：添加索引
CREATE INDEX idx_create_time ON users(create_time);

SELECT * FROM users ORDER BY create_time;
-- Extra: NULL（使用索引排序）
```

#### 2. 联合索引优化

```sql
-- 创建联合索引
CREATE INDEX idx_age_create ON users(age, create_time);

-- ✅ 可以使用索引排序
SELECT * FROM users WHERE age = 20 ORDER BY create_time;
-- 先过滤 age = 20，再按 create_time 排序

-- ❌ 不能使用索引排序
SELECT * FROM users WHERE age > 20 ORDER BY create_time;
-- 范围查询后，无法利用索引排序
```

**原则：**
- WHERE 条件使用等值查询
- ORDER BY 字段在联合索引后面

#### 3. 覆盖索引优化

```sql
-- 创建覆盖索引
CREATE INDEX idx_name_email ON users(name, email);

-- ✅ 覆盖索引，无需回表
SELECT name, email FROM users ORDER BY name;
-- Extra: Using index

-- ❌ 需要回表
SELECT name, email, age FROM users ORDER BY name;
-- Extra: Using filesort（如果需要额外排序）
```

### 三、优化文件排序

当无法避免 filesort 时，可以优化其性能。

#### 1. 调整排序缓冲区

```sql
-- 查看当前配置
SHOW VARIABLES LIKE 'sort_buffer_size';
SHOW VARIABLES LIKE 'max_length_for_sort_data';

-- 增加排序缓冲区（会话级别）
SET SESSION sort_buffer_size = 4 * 1024 * 1024;  -- 4MB

-- 限制排序字段长度
SET SESSION max_length_for_sort_data = 1024;
```

**参数说明：**
- `sort_buffer_size`：每个线程的排序缓冲区大小
- `max_length_for_sort_data`：排序数据的最大长度

#### 2. 减少排序数据量

```sql
-- ❌ 不好：排序所有列
SELECT * FROM users ORDER BY create_time;

-- ✅ 好：只选择需要的列
SELECT id, name, email FROM users ORDER BY create_time;

-- ✅ 更好：先过滤再排序
SELECT id, name FROM users 
WHERE status = 1 
ORDER BY create_time 
LIMIT 10;
```

#### 3. 使用 LIMIT 优化

```sql
-- ❌ 不好：排序全部数据
SELECT * FROM users ORDER BY create_time DESC;

-- ✅ 好：限制返回行数
SELECT * FROM users ORDER BY create_time DESC LIMIT 10;

-- MySQL 会使用优先队列优化
-- 只需维护一个大小为 10 的堆
```

### 四、常见优化场景

#### 场景 1：单字段排序

```sql
-- 创建索引
CREATE INDEX idx_create_time ON users(create_time);

-- 升序排序
SELECT * FROM users ORDER BY create_time ASC;  -- 使用索引

-- 降序排序
SELECT * FROM users ORDER BY create_time DESC;  -- 使用索引（反向扫描）

-- MySQL 8.0+ 支持降序索引
CREATE INDEX idx_create_desc ON users(create_time DESC);
```

#### 场景 2：多字段排序

```sql
-- 创建联合索引
CREATE INDEX idx_age_create ON users(age, create_time);

-- ✅ 可以使用索引
SELECT * FROM users ORDER BY age, create_time;

-- ✅ 可以使用索引
SELECT * FROM users ORDER BY age DESC, create_time DESC;

-- ❌ 不能使用索引（排序方向不一致）
SELECT * FROM users ORDER BY age ASC, create_time DESC;
-- Extra: Using filesort

-- MySQL 8.0+ 解决：创建混合方向索引
CREATE INDEX idx_age_asc_create_desc ON users(age ASC, create_time DESC);
```

#### 场景 3：WHERE + ORDER BY

```sql
-- 创建联合索引
CREATE INDEX idx_status_create ON users(status, create_time);

-- ✅ 可以使用索引
SELECT * FROM users 
WHERE status = 1 
ORDER BY create_time;

-- ❌ 不能使用索引（范围查询）
SELECT * FROM users 
WHERE status IN (1, 2, 3) 
ORDER BY create_time;
-- Extra: Using filesort

-- ✅ 优化：拆分为多个查询
SELECT * FROM users WHERE status = 1 ORDER BY create_time LIMIT 10
UNION ALL
SELECT * FROM users WHERE status = 2 ORDER BY create_time LIMIT 10
UNION ALL
SELECT * FROM users WHERE status = 3 ORDER BY create_time LIMIT 10;
```

#### 场景 4：GROUP BY + ORDER BY

```sql
-- ❌ 不好：额外的排序
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
ORDER BY emp_count DESC;
-- Extra: Using filesort

-- ✅ 好：GROUP BY 默认已排序
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department;
-- 结果已按 department 排序

-- 如果需要按聚合结果排序，无法避免 filesort
-- 但可以优化：
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
ORDER BY emp_count DESC
LIMIT 10;
-- 使用优先队列优化
```

#### 场景 5：JOIN + ORDER BY

```sql
-- 创建索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_users_create ON users(create_time);

-- ❌ 不好：排序驱动表的字段
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id
ORDER BY u.create_time;
-- 可能需要 filesort

-- ✅ 好：排序被驱动表的字段
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id
ORDER BY o.create_time;
-- 如果 orders 表有索引，可以使用

-- 最佳：使用覆盖索引
CREATE INDEX idx_user_order ON orders(user_id, create_time, order_no);

SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id
ORDER BY o.create_time;
-- Extra: Using index
```

### 五、高级优化技巧

#### 1. 延迟关联

```sql
-- ❌ 不好：深分页 + 排序
SELECT * FROM users ORDER BY create_time LIMIT 100000, 10;
-- 需要排序 100010 行，然后丢弃前 100000 行

-- ✅ 好：延迟关联
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY create_time LIMIT 100000, 10
) AS tmp ON u.id = tmp.id;
-- 子查询只扫描索引，速度快
```

#### 2. 游标分页

```sql
-- ❌ 不好：OFFSET 分页
SELECT * FROM users ORDER BY create_time LIMIT 10 OFFSET 10000;

-- ✅ 好：游标分页
SELECT * FROM users 
WHERE create_time < '2024-01-01 00:00:00'  -- 上一页最后一条的时间
ORDER BY create_time DESC 
LIMIT 10;
-- 直接使用索引范围扫描
```

#### 3. 预排序 + 缓存

```sql
-- 对于不经常变化的数据，可以预排序并缓存

-- 应用层逻辑（Python 示例）
def get_top_users():
    # 先查缓存
    result = redis.get('top_users')
    if result:
        return json.loads(result)
    
    # 缓存未命中，查询数据库
    result = db.query("""
        SELECT id, name, score 
        FROM users 
        ORDER BY score DESC 
        LIMIT 100
    """)
    
    # 写入缓存（有效期 1 小时）
    redis.setex('top_users', 3600, json.dumps(result))
    
    return result
```

#### 4. 分区表优化

```sql
-- 按时间分区
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50),
    create_time DATETIME,
    amount DECIMAL(10, 2)
) PARTITION BY RANGE (YEAR(create_time)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025)
);

-- 查询时自动裁剪分区
SELECT * FROM orders 
WHERE create_time >= '2024-01-01'
ORDER BY create_time DESC 
LIMIT 10;
-- 只扫描 p2024 分区，减少排序数据量
```

### 六、监控和分析

#### 1. 查看排序统计

```sql
-- 查看排序相关的状态变量
SHOW STATUS LIKE 'Sort_%';

-- 输出：
-- Sort_merge_passes: 0      -- 合并排序的次数
-- Sort_range: 100            -- 使用范围的排序次数
-- Sort_rows: 50000           -- 排序的行数
-- Sort_scan: 50              -- 使用全表扫描的排序次数

-- Sort_merge_passes > 0 说明 sort_buffer_size 太小
```

#### 2. 优化建议

```sql
-- 如果 Sort_merge_passes > 0
-- 增加 sort_buffer_size
SET GLOBAL sort_buffer_size = 8 * 1024 * 1024;  -- 8MB

-- 如果 Sort_scan 很大
-- 检查是否有未使用索引的 ORDER BY
SHOW PROCESSLIST;
EXPLAIN SELECT ... ORDER BY ...;
```

### 七、最佳实践总结

#### ORDER BY 优化 checklist

- [ ] **ORDER BY 字段是否有索引**
- [ ] **是否避免了 filesort**
- [ ] **联合索引是否符合最左前缀**
- [ ] **是否使用了 LIMIT 限制行数**
- [ ] **是否只选择了需要的列**
- [ ] **深分页是否使用游标或延迟关联**
- [ ] **排序缓冲区大小是否合理**
- [ ] **是否可以利用覆盖索引**

#### 优化原则

1. ⭐ **优先使用索引排序**：避免 filesort
2. **合理使用联合索引**：WHERE + ORDER BY
3. **限制返回行数**：使用 LIMIT
4. **减少排序数据**：只选需要的列
5. **优化深分页**：游标分页或延迟关联
6. **调整缓冲区**：根据实际需求设置
7. **考虑缓存**：热点数据预排序

### 八、总结

**排序方式：**
- **索引排序**：最快，无需额外操作
- **文件排序**：较慢，需要优化

**核心优化方法：**
1. ⭐ **添加合适的索引**
2. **使用联合索引**
3. **利用覆盖索引**
4. **限制返回行数（LIMIT）**
5. **减少排序数据量**
6. **优化深分页**
7. **调整排序缓冲区**

**常见问题：**
- filesort 性能差 → 添加索引
- 深分页慢 → 游标分页
- 多字段排序 → 联合索引
- 大结果集 → LIMIT + 缓存

**记忆口诀：**
- 排序尽量用索引
- 联合索引要注意
- LIMIT 不能少
- 深分页要优化
- 缓冲大小要合适
- 缓存热点数据

## 21. 在 MySQL 中，什么是视图的物化？

**答：** 视图的物化（Materialized View）是指将视图的查询结果实际存储在磁盘上，而不是每次查询时动态计算。需要注意的是，**MySQL 原生不支持物化视图**，但可以通过其他方式实现类似功能。

### 一、视图的基本概念

#### 1. 普通视图（Virtual View）

```sql
-- 创建普通视图
CREATE VIEW v_user_orders AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    o.order_no,
    o.amount,
    o.create_time
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 查询视图
SELECT * FROM v_user_orders WHERE amount > 100;
```

**特点：**
- ❌ **不存储数据**：只保存查询定义
- ❌ **每次查询都执行**：实时从基表获取数据
- ✅ **数据始终最新**：反映基表的当前状态
- ⚠️ **性能较差**：复杂查询每次都重新计算

**工作原理：**
```
查询视图 → 展开为原始 SQL → 执行查询 → 返回结果
```

#### 2. 物化视图（Materialized View）

```sql
-- MySQL 不直接支持，这是 PostgreSQL 的语法
CREATE MATERIALIZED VIEW mv_user_orders AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    o.order_no,
    o.amount,
    o.create_time
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 刷新物化视图
REFRESH MATERIALIZED VIEW mv_user_orders;
```

**特点：**
- ✅ **存储实际数据**：物理存储在磁盘上
- ✅ **查询速度快**：直接读取预计算的结果
- ❌ **数据可能过期**：需要手动或定时刷新
- ⚠️ **占用存储空间**：需要额外的磁盘空间

**工作原理：**
```
创建时执行查询 → 存储结果到磁盘 → 查询时直接读取
```

### 二、MySQL 中的替代方案

由于 MySQL 不支持物化视图，可以使用以下方案实现类似功能。

#### 方案 1：使用普通表 + 定时刷新

```sql
-- 步骤 1：创建表存储物化数据
CREATE TABLE mv_user_orders (
    user_id INT,
    user_name VARCHAR(50),
    order_no VARCHAR(50),
    amount DECIMAL(10, 2),
    create_time DATETIME,
    refresh_time DATETIME,  -- 记录刷新时间
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB;

-- 步骤 2：初始填充数据
INSERT INTO mv_user_orders
SELECT 
    u.id,
    u.name,
    o.order_no,
    o.amount,
    o.create_time,
    NOW()
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 步骤 3：定时刷新（使用事件调度器）
DELIMITER $$

CREATE EVENT ev_refresh_mv
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    -- 清空旧数据
    TRUNCATE TABLE mv_user_orders;
    
    -- 重新填充
    INSERT INTO mv_user_orders
    SELECT 
        u.id,
        u.name,
        o.order_no,
        o.amount,
        o.create_time,
        NOW()
    FROM users u
    INNER JOIN orders o ON u.id = o.user_id;
END $$

DELIMITER ;

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 查询物化视图
SELECT * FROM mv_user_orders WHERE amount > 100;
-- 速度非常快，直接查表
```

**优点：**
- ✅ 查询性能接近物化视图
- ✅ 可以添加索引优化
- ✅ 灵活控制刷新频率

**缺点：**
- ❌ 数据有延迟
- ❌ 需要维护刷新逻辑
- ❌ 占用额外存储空间

#### 方案 2：使用触发器增量更新

```sql
-- 创建物化表
CREATE TABLE mv_order_stats (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(50),
    total_orders INT,
    total_amount DECIMAL(10, 2),
    last_order_time DATETIME,
    update_time DATETIME
);

-- 初始填充
INSERT INTO mv_order_stats
SELECT 
    u.id,
    u.name,
    COUNT(o.id) AS total_orders,
    SUM(o.amount) AS total_amount,
    MAX(o.create_time) AS last_order_time,
    NOW()
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 创建触发器：订单插入时更新
DELIMITER $$

CREATE TRIGGER trg_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO mv_order_stats (user_id, user_name, total_orders, total_amount, last_order_time, update_time)
    VALUES (NEW.user_id, '', 1, NEW.amount, NEW.create_time, NOW())
    ON DUPLICATE KEY UPDATE
        total_orders = total_orders + 1,
        total_amount = total_amount + NEW.amount,
        last_order_time = GREATEST(last_order_time, NEW.create_time),
        update_time = NOW();
END $$

-- 创建触发器：订单删除时更新
CREATE TRIGGER trg_order_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    UPDATE mv_order_stats
    SET total_orders = total_orders - 1,
        total_amount = total_amount - OLD.amount,
        update_time = NOW()
    WHERE user_id = OLD.user_id;
END $$

-- 创建触发器：订单更新时更新
CREATE TRIGGER trg_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    UPDATE mv_order_stats
    SET total_amount = total_amount - OLD.amount + NEW.amount,
        last_order_time = GREATEST(last_order_time, NEW.create_time),
        update_time = NOW()
    WHERE user_id = NEW.user_id;
END $$

DELIMITER ;

-- 查询统计信息（非常快）
SELECT * FROM mv_order_stats WHERE total_amount > 1000;
```

**优点：**
- ✅ 数据实时更新
- ✅ 查询性能极佳
- ✅ 适合聚合统计

**缺点：**
- ❌ 触发器影响写入性能
- ❌ 逻辑复杂，维护困难
- ❌ 不适用于复杂查询

#### 方案 3：使用存储过程手动刷新

```sql
-- 创建刷新存储过程
DELIMITER $$

CREATE PROCEDURE sp_refresh_mv_user_orders()
BEGIN
    START TRANSACTION;
    
    -- 清空旧数据
    TRUNCATE TABLE mv_user_orders;
    
    -- 重新填充
    INSERT INTO mv_user_orders
    SELECT 
        u.id,
        u.name,
        o.order_no,
        o.amount,
        o.create_time,
        NOW()
    FROM users u
    INNER JOIN orders o ON u.id = o.user_id;
    
    COMMIT;
END $$

DELIMITER ;

-- 手动调用刷新
CALL sp_refresh_mv_user_orders();

-- 或者在应用层定时调用
```

**优点：**
- ✅ 灵活控制刷新时机
- ✅ 可以在低峰期执行
- ✅ 可以添加日志和监控

**缺点：**
- ❌ 需要手动或外部调度
- ❌ 数据有延迟

### 三、物化视图的应用场景

#### 场景 1：复杂报表查询

```sql
-- 原始查询（慢）
SELECT 
    DATE(o.create_time) AS order_date,
    u.city,
    COUNT(*) AS order_count,
    SUM(o.amount) AS total_amount,
    AVG(o.amount) AS avg_amount
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.create_time >= '2024-01-01'
GROUP BY DATE(o.create_time), u.city
ORDER BY order_date, city;

-- 优化：创建物化表
CREATE TABLE mv_daily_order_stats (
    order_date DATE,
    city VARCHAR(50),
    order_count INT,
    total_amount DECIMAL(10, 2),
    avg_amount DECIMAL(10, 2),
    refresh_time DATETIME,
    PRIMARY KEY (order_date, city)
);

-- 每天凌晨刷新
INSERT INTO mv_daily_order_stats
SELECT 
    DATE(o.create_time),
    u.city,
    COUNT(*),
    SUM(o.amount),
    AVG(o.amount),
    NOW()
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.create_time >= CURDATE() - INTERVAL 1 DAY
GROUP BY DATE(o.create_time), u.city
ON DUPLICATE KEY UPDATE
    order_count = VALUES(order_count),
    total_amount = VALUES(total_amount),
    avg_amount = VALUES(avg_amount),
    refresh_time = VALUES(refresh_time);

-- 查询报表（快）
SELECT * FROM mv_daily_order_stats 
WHERE order_date >= '2024-01-01'
ORDER BY order_date, city;
```

#### 场景 2：实时统计看板

```sql
-- 用户行为统计
CREATE TABLE mv_user_activity (
    user_id INT PRIMARY KEY,
    login_count INT,
    page_view_count INT,
    last_active_time DATETIME,
    update_time DATETIME
);

-- 使用触发器实时更新
-- 或使用定时任务每小时刷新

-- 看板查询（毫秒级响应）
SELECT * FROM mv_user_activity ORDER BY page_view_count DESC LIMIT 100;
```

#### 场景 3：搜索引擎索引

```sql
-- 全文搜索预处理
CREATE TABLE mv_search_index (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT,
    title VARCHAR(200),
    content TEXT,
    keywords VARCHAR(500),
    FULLTEXT INDEX ft_search (title, content, keywords)
);

-- 定时刷新搜索索引
INSERT INTO mv_search_index
SELECT 
    a.id,
    a.title,
    a.content,
    CONCAT(a.title, ' ', a.tags, ' ', u.name) AS keywords
FROM articles a
INNER JOIN users u ON a.author_id = u.id
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    content = VALUES(content),
    keywords = VALUES(keywords);

-- 搜索查询
SELECT * FROM mv_search_index 
WHERE MATCH(title, content, keywords) AGAINST('MySQL 优化');
```

### 四、其他数据库的物化视图

#### 1. PostgreSQL

```sql
-- 创建物化视图
CREATE MATERIALIZED VIEW mv_user_orders AS
SELECT u.id, u.name, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 创建索引
CREATE INDEX idx_mv_amount ON mv_user_orders(amount);

-- 刷新物化视图
REFRESH MATERIALIZED VIEW mv_user_orders;

-- 并发刷新（PostgreSQL 9.4+）
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_orders;
```

#### 2. Oracle

```sql
-- 创建物化视图
CREATE MATERIALIZED VIEW mv_user_orders
BUILD IMMEDIATE
REFRESH FORCE ON DEMAND
AS
SELECT u.id, u.name, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 自动刷新
CREATE MATERIALIZED VIEW mv_user_orders
REFRESH FAST ON COMMIT
AS
SELECT u.id, u.name, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

#### 3. ClickHouse

```sql
-- 物化视图（自动聚合）
CREATE MATERIALIZED VIEW mv_order_stats
ENGINE = SummingMergeTree()
ORDER BY (user_id)
AS
SELECT 
    user_id,
    count() AS total_orders,
    sum(amount) AS total_amount
FROM orders
GROUP BY user_id;
```

### 五、最佳实践

#### 1. 选择合适的刷新策略

```sql
-- 策略 1：定时刷新（适合数据变化不频繁）
-- 每小时/每天刷新一次

-- 策略 2：增量刷新（适合大数据量）
-- 只刷新变化的数据

-- 策略 3：触发器刷新（适合实时性要求高）
-- 数据变化时立即更新

-- 策略 4：手动刷新（适合可控场景）
-- 应用层控制刷新时机
```

#### 2. 监控和维护

```sql
-- 监控刷新时间
SELECT 
    table_name,
    refresh_time,
    TIMESTAMPDIFF(MINUTE, refresh_time, NOW()) AS minutes_since_refresh
FROM information_schema.tables
WHERE table_name LIKE 'mv_%';

-- 监控数据一致性
SELECT 
    (SELECT COUNT(*) FROM orders) AS actual_count,
    (SELECT SUM(total_orders) FROM mv_order_stats) AS mv_count,
    ABS((SELECT COUNT(*) FROM orders) - (SELECT SUM(total_orders) FROM mv_order_stats)) AS diff;

-- 定期重建索引
ALTER TABLE mv_user_orders FORCE;
```

#### 3. 性能优化

```sql
-- 为物化表添加合适的索引
CREATE INDEX idx_mv_amount ON mv_user_orders(amount);
CREATE INDEX idx_mv_create_time ON mv_user_orders(create_time);

-- 使用分区表
ALTER TABLE mv_daily_order_stats 
PARTITION BY RANGE (TO_DAYS(order_date)) (
    PARTITION p202401 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-03-01'))
);

-- 压缩存储
ALTER TABLE mv_user_orders ROW_FORMAT=COMPRESSED;
```

### 六、总结

**MySQL 视图类型：**
- **普通视图**：虚拟表，不存储数据，每次查询动态计算
- **物化视图**：MySQL 不支持，需通过普通表模拟

**MySQL 替代方案：**
1. ⭐ **普通表 + 定时刷新**：最常用，灵活可控
2. **触发器增量更新**：实时性好，适合统计
3. **存储过程手动刷新**：灵活控制刷新时机

**物化视图的优势：**
- ✅ 查询性能大幅提升
- ✅ 减轻基表压力
- ✅ 适合复杂查询和报表

**物化视图的劣势：**
- ❌ 数据有延迟
- ❌ 占用存储空间
- ❌ 需要维护刷新逻辑

**选择建议：**
- 实时性要求高 → 触发器更新
- 数据量大、查询复杂 → 定时刷新
- 报表统计 → 物化表 + 索引
- 简单查询 → 普通视图即可

## 22. 如何在 MySQL 中处理 BLOB 和 CLOB 数据类型？

**答：** BLOB（Binary Large Object）和 CLOB（Character Large Object）是用于存储大对象数据的类型。MySQL 中使用 BLOB 系列和 TEXT 系列来分别处理二进制和字符大对象。

### 一、数据类型概述

#### 1. BLOB 类型（二进制大对象）

| 类型 | 最大大小 | 说明 |
|------|---------|------|
| **TINYBLOB** | 255 B | 小二进制数据 |
| **BLOB** | 64 KB | 中等二进制数据 |
| **MEDIUMBLOB** | 16 MB | 较大二进制数据 |
| **LONGBLOB** | 4 GB | 超大二进制数据 |

**适用场景：**
- 图片、音频、视频文件
- PDF、Word 文档
- 序列化对象
- 加密数据

#### 2. TEXT 类型（字符大对象，相当于 CLOB）

| 类型 | 最大大小 | 说明 |
|------|---------|------|
| **TINYTEXT** | 255 B | 短文本 |
| **TEXT** | 64 KB | 中等文本 |
| **MEDIUMTEXT** | 16 MB | 较长文本 |
| **LONGTEXT** | 4 GB | 超长文本 |

**适用场景：**
- 文章内容
- HTML 页面
- JSON/XML 数据
- 日志信息

### 二、基本使用

#### 1. 创建表

```sql
-- 存储图片
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255),
    content_type VARCHAR(100),
    data MEDIUMBLOB,  -- 存储图片二进制数据
    size INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 存储文章
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content LONGTEXT,  -- 存储文章内容
    author_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 存储文档
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    file_data LONGBLOB,  -- 存储文档二进制数据
    mime_type VARCHAR(100),
    file_size BIGINT
);
```

#### 2. 插入数据

```sql
-- 方法 1：直接插入（小数据）
INSERT INTO images (filename, content_type, data, size)
VALUES (
    'photo.jpg',
    'image/jpeg',
    LOAD_FILE('/path/to/photo.jpg'),  -- 从文件加载
    102400
);

-- 方法 2：使用应用程序插入
-- Python 示例
import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='password',
    database='mydb'
)
cursor = conn.cursor()

# 读取文件
with open('photo.jpg', 'rb') as f:
    image_data = f.read()

# 插入数据库
cursor.execute(
    "INSERT INTO images (filename, content_type, data, size) VALUES (%s, %s, %s, %s)",
    ('photo.jpg', 'image/jpeg', image_data, len(image_data))
)
conn.commit()

# 方法 3：插入文本
INSERT INTO articles (title, content, author_id)
VALUES (
    'MySQL 教程',
    '这是一篇关于 MySQL 的长篇文章...',
    1
);
```

#### 3. 查询数据

```sql
-- 查询元数据（不获取大字段）
SELECT id, filename, content_type, size, created_at
FROM images
WHERE id = 1;

-- 查询完整数据
SELECT * FROM images WHERE id = 1;

-- 查询文本内容
SELECT id, title, LEFT(content, 100) AS preview  -- 只取前 100 字符
FROM articles
WHERE id = 1;

-- 全文搜索（需要全文索引）
SELECT * FROM articles
WHERE MATCH(content) AGAINST('MySQL 优化');
```

#### 4. 更新和删除

```sql
-- 更新二进制数据
UPDATE images
SET data = LOAD_FILE('/path/to/new_photo.jpg'),
    size = 204800
WHERE id = 1;

-- 更新文本内容
UPDATE articles
SET content = '更新后的文章内容...'
WHERE id = 1;

-- 删除数据
DELETE FROM images WHERE id = 1;
```

### 三、性能优化

#### 1. 避免 SELECT *

```sql
-- ❌ 不好：加载所有大字段
SELECT * FROM articles;

-- ✅ 好：只查询需要的字段
SELECT id, title, created_at FROM articles;

-- 需要内容时再单独查询
SELECT content FROM articles WHERE id = 1;
```

**原因：**
- BLOB/TEXT 字段占用大量内存
- 网络传输慢
- Buffer Pool 污染

#### 2. 分离大字段到独立表

```sql
-- 主表：存储常用字段
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    author_id INT,
    summary VARCHAR(500),  -- 摘要
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_author (author_id),
    INDEX idx_created (created_at)
);

-- 扩展表：存储大字段
CREATE TABLE article_contents (
    article_id INT PRIMARY KEY,
    content LONGTEXT,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 查询列表（快）
SELECT id, title, summary FROM articles ORDER BY created_at DESC LIMIT 10;

-- 查看详情（按需加载）
SELECT a.*, c.content
FROM articles a
INNER JOIN article_contents c ON a.id = c.article_id
WHERE a.id = 1;
```

**优点：**
- ✅ 主表查询速度快
- ✅ Buffer Pool 利用率高
- ✅ 可以单独优化大字段表

#### 3. 使用前缀索引

```sql
-- ❌ 不能对 BLOB/TEXT 创建完整索引
CREATE INDEX idx_content ON articles(content);  -- 错误！

-- ✅ 可以创建前缀索引
CREATE INDEX idx_content_prefix ON articles(content(100));

-- 或者使用全文索引
ALTER TABLE articles ADD FULLTEXT INDEX ft_content (content);
```

#### 4. 压缩存储

```sql
-- 使用 COMPRESSED 行格式
CREATE TABLE articles_compressed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content LONGTEXT
) ROW_FORMAT=COMPRESSED;

-- 或者在应用层压缩
import zlib

# 压缩
compressed_data = zlib.compress(article_content.encode('utf-8'))

# 存储
cursor.execute(
    "INSERT INTO articles (title, content) VALUES (%s, %s)",
    (title, compressed_data)
)

# 解压
content = zlib.decompress(compressed_data).decode('utf-8')
```

### 四、最佳实践

#### 1. 是否应该在数据库中存储大对象？

**方案对比：**

| 方案 | 优点 | 缺点 |
|------|------|------|
| **数据库存储** | 事务一致、备份简单 | 性能差、成本高 |
| **文件系统存储** | 性能好、成本低 | 备份复杂、无事务 |
| **对象存储（OSS/S3）** | 性能好、可扩展 | 需要额外服务 |

**推荐方案：**

```sql
-- ✅ 最佳实践：数据库存元数据，文件系统/OSS 存实际文件
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255),
    file_path VARCHAR(500),  -- 文件路径或 OSS URL
    content_type VARCHAR(100),
    file_size BIGINT,
    md5_hash CHAR(32),  -- 用于去重和校验
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

-- 插入记录
INSERT INTO files (filename, file_path, content_type, file_size, md5_hash, user_id)
VALUES (
    'document.pdf',
    'https://oss.example.com/files/2024/01/doc_123.pdf',  -- OSS URL
    'application/pdf',
    1048576,
    'd41d8cd98f00b204e9800998ecf8427e',
    1
);

-- 查询文件信息
SELECT * FROM files WHERE user_id = 1 ORDER BY created_at DESC;
```

**应用层逻辑：**
```python
# 上传文件
def upload_file(file, user_id):
    # 1. 生成唯一文件名
    filename = generate_unique_name(file.filename)
    
    # 2. 上传到 OSS
    oss_url = oss_client.upload(file, filename)
    
    # 3. 计算 MD5
    md5 = calculate_md5(file)
    
    # 4. 保存元数据到数据库
    db.execute(
        "INSERT INTO files (filename, file_path, content_type, file_size, md5_hash, user_id) "
        "VALUES (%s, %s, %s, %s, %s, %s)",
        (file.filename, oss_url, file.content_type, file.size, md5, user_id)
    )
    
    return oss_url

# 下载文件
def download_file(file_id):
    # 1. 从数据库获取文件信息
    file_info = db.query("SELECT * FROM files WHERE id = %s", file_id)
    
    # 2. 从 OSS 下载
    file_data = oss_client.download(file_info.file_path)
    
    return file_data, file_info.filename
```

#### 2. 选择合适的类型

```sql
-- 根据数据大小选择类型

-- 小文本（< 255 B）
CREATE TABLE config (
    key VARCHAR(50) PRIMARY KEY,
    value TINYTEXT  -- 配置值
);

-- 中等文本（< 64 KB）
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT  -- 评论内容
);

-- 大文本（< 16 MB）
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content MEDIUMTEXT  -- 博客内容
);

-- 超大文本（< 4 GB）
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_content LONGTEXT  -- 日志内容
);

-- 小二进制（< 255 B）
CREATE TABLE thumbnails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data TINYBLOB  -- 缩略图
);

-- 中等二进制（< 64 KB）
CREATE TABLE icons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data BLOB  -- 图标
);

-- 大二进制（< 16 MB）
CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data MEDIUMBLOB  -- 照片
);

-- 超大二进制（< 4 GB）
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data LONGBLOB  -- 视频（不推荐，建议用 OSS）
);
```

#### 3. 设置合理的 max_allowed_packet

```sql
-- 查看当前配置
SHOW VARIABLES LIKE 'max_allowed_packet';

-- 修改配置（my.cnf）
[mysqld]
max_allowed_packet = 64M  -- 允许最大 64MB 的数据包

-- 或者运行时修改
SET GLOBAL max_allowed_packet = 67108864;  -- 64MB

-- 注意：必须大于你要插入的最大 BLOB/TEXT 数据
```

#### 4. 监控和优化

```sql
-- 监控大表大小
SELECT 
    table_name,
    ROUND(data_length / 1024 / 1024, 2) AS data_mb,
    ROUND(index_length / 1024 / 1024, 2) AS index_mb,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS total_mb
FROM information_schema.tables
WHERE table_schema = 'mydb'
ORDER BY data_length DESC;

-- 检查碎片
SELECT 
    table_name,
    data_free / 1024 / 1024 AS free_mb,
    (data_free / data_length) * 100 AS fragmentation_pct
FROM information_schema.tables
WHERE table_schema = 'mydb'
  AND data_length > 0
ORDER BY fragmentation_pct DESC;

-- 优化表
OPTIMIZE TABLE articles;
```

### 五、常见问题

#### 问题 1：插入大文件失败

```sql
-- 错误：Packet too large
-- 解决：增加 max_allowed_packet

-- my.cnf
[mysqld]
max_allowed_packet = 128M

-- 重启 MySQL
sudo systemctl restart mysql
```

#### 问题 2：查询速度慢

```sql
-- 原因：加载了大量 BLOB/TEXT 数据

-- 解决 1：避免 SELECT *
SELECT id, title FROM articles;  -- 不包含 content

-- 解决 2：分离大字段
-- 将 BLOB/TEXT 移到扩展表

-- 解决 3：使用缓存
-- Redis 缓存热点数据
```

#### 问题 3：备份文件过大

```bash
# 原因：包含大量 BLOB/TEXT 数据

# 解决 1：排除大字段表
mysqldump mydb --ignore-table=mydb.articles_content > backup.sql

# 解决 2：使用文件系统备份
# 数据库只备份元数据，文件单独备份

# 解决 3：使用增量备份
innobackupex --incremental /backup/
```

#### 问题 4：全文搜索性能差

```sql
-- 创建全文索引
ALTER TABLE articles ADD FULLTEXT INDEX ft_content (content);

-- 使用全文搜索
SELECT * FROM articles
WHERE MATCH(content) AGAINST('MySQL 优化' IN NATURAL LANGUAGE MODE);

-- 如果数据量很大，考虑使用 Elasticsearch
```

### 六、总结

**数据类型选择：**
- **BLOB 系列**：二进制数据（图片、文件）
- **TEXT 系列**：字符数据（文章、日志）
- 根据数据大小选择合适的类型

**最佳实践：**
1. ⭐ **优先使用文件系统/OSS 存储大文件**
2. **数据库只存元数据和路径**
3. **避免 SELECT ***
4. **分离大字段到独立表**
5. **使用前缀索引或全文索引**
6. **设置合理的 max_allowed_packet**
7. **定期优化表**

**存储方案对比：**
- 小数据（< 1MB）→ 可以考虑数据库
- 中等数据（1MB - 100MB）→ 文件系统
- 大数据（> 100MB）→ 对象存储（OSS/S3）

**记忆要点：**
- BLOB 存二进制
- TEXT 存字符
- 大文件用 OSS
- 避免 SELECT *
- 分离大字段
- 前缀索引优化

## 23. 如何在 MySQL 中进行数据脱敏？

**答：** 数据脱敏（Data Masking）是指对敏感数据进行变形处理，使其在不影响业务的前提下，无法被识别或还原。MySQL 提供了多种方式实现数据脱敏。

### 一、数据脱敏的场景

#### 1. 为什么需要数据脱敏？

```
敏感数据类型：
- 个人身份信息：姓名、身份证号、手机号
- 金融信息：银行卡号、账户余额
- 健康信息：病历、诊断结果
- 认证信息：密码、Token

脱敏目的：
- ✅ 保护用户隐私
- ✅ 符合法律法规（GDPR、个人信息保护法）
- ✅ 降低数据泄露风险
- ✅ 满足开发测试需求
```

#### 2. 脱敏场景

| 场景 | 说明 |
|------|------|
| **生产环境查询** | DBA 或开发人员查询时脱敏 |
| **数据导出** | 导出数据给第三方时脱敏 |
| **测试环境** | 使用生产数据副本时脱敏 |
| **日志记录** | 记录 SQL 日志时脱敏 |
| **数据分析** | 统计分析时脱敏 |

### 二、MySQL 内置脱敏方法

#### 1. 使用字符串函数脱敏

```sql
-- 手机号脱敏：保留前 3 后 4
SELECT 
    name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS masked_phone
FROM users;

-- 结果：
-- | name | masked_phone   |
-- |------|----------------|
-- | 张三 | 138****8000    |

-- 身份证脱敏：保留前 6 后 4
SELECT 
    name,
    CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4)) AS masked_id
FROM users;

-- 结果：
-- | name | masked_id           |
-- |------|---------------------|
-- | 张三 | 110101********1234  |

-- 邮箱脱敏：保留前缀前 2 位和域名
SELECT 
    name,
    CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS masked_email
FROM users;

-- 结果：
-- | name | masked_email        |
-- |------|---------------------|
-- | 张三 | zh***@example.com   |

-- 姓名脱敏：保留姓，名用 * 代替
SELECT 
    name,
    CONCAT(LEFT(name, 1), '**') AS masked_name
FROM users;

-- 结果：
-- | name | masked_name |
-- |------|-------------|
-- | 张三 | 张**        |
```

#### 2. 使用 REPLACE 函数脱敏

```sql
-- 银行卡号脱敏
SELECT 
    card_number,
    REPLACE(
        CONCAT(LEFT(card_number, 4), ' **** **** ', RIGHT(card_number, 4)),
        ' ', ''
    ) AS masked_card
FROM bank_cards;

-- 结果：
-- | card_number      | masked_card      |
-- |------------------|------------------|
-- | 6222021234567890 | 6222****7890     |
```

#### 3. 使用 MD5/SHA 哈希脱敏

```sql
-- 不可逆脱敏（用于统计分析）
SELECT 
    user_id,
    MD5(phone) AS hashed_phone,
    SHA2(email, 256) AS hashed_email
FROM users;

-- 结果：
-- | user_id | hashed_phone                     | hashed_email                                                         |
-- |---------|----------------------------------|----------------------------------------------------------------------|
-- | 1       | e10adc3949ba59abbe56e057f20f883e  | a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3 |

-- 注意：哈希是不可逆的，无法还原原始数据
```

#### 4. 使用 CASE WHEN 条件脱敏

```sql
-- 根据角色决定显示内容
SELECT 
    u.name,
    CASE 
        WHEN current_user() = 'admin@localhost' THEN u.phone
        ELSE CONCAT(LEFT(u.phone, 3), '****', RIGHT(u.phone, 4))
    END AS phone
FROM users u;

-- 管理员看到完整手机号，其他人看到脱敏后的
```

### 三、使用视图实现脱敏

#### 1. 创建脱敏视图

```sql
-- 创建脱敏视图
CREATE VIEW v_users_masked AS
SELECT 
    id,
    name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
    CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
    CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4)) AS id_card,
    age,
    city
FROM users;

-- 授予普通用户访问视图的权限
GRANT SELECT ON mydb.v_users_masked TO 'developer'@'%';

-- 撤销对原表的访问权限
REVOKE SELECT ON mydb.users FROM 'developer'@'%';

-- 使用视图查询（自动脱敏）
SELECT * FROM v_users_masked;
```

**优点：**
- ✅ 透明脱敏，应用层无需修改
- ✅ 集中管理脱敏规则
- ✅ 权限控制简单

**缺点：**
- ❌ 性能略有损失
- ❌ 视图较多时管理复杂

#### 2. 多级别脱敏视图

```sql
-- 普通员工视图（高度脱敏）
CREATE VIEW v_users_employee AS
SELECT 
    id,
    CONCAT(LEFT(name, 1), '**') AS name,
    '***' AS phone,
    '***' AS email,
    age,
    city
FROM users;

-- 经理视图（部分脱敏）
CREATE VIEW v_users_manager AS
SELECT 
    id,
    name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
    CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
    age,
    city
FROM users;

-- 管理员视图（不脱敏）
CREATE VIEW v_users_admin AS
SELECT * FROM users;

-- 根据不同角色授予不同视图权限
GRANT SELECT ON mydb.v_users_employee TO 'employee'@'%';
GRANT SELECT ON mydb.v_users_manager TO 'manager'@'%';
GRANT SELECT ON mydb.v_users_admin TO 'admin'@'%';
```

### 四、使用存储过程脱敏

#### 1. 动态脱敏存储过程

```sql
DELIMITER $$

CREATE PROCEDURE sp_get_users(
    IN p_role VARCHAR(20),
    IN p_limit INT
)
BEGIN
    IF p_role = 'admin' THEN
        -- 管理员：查看完整数据
        SELECT * FROM users LIMIT p_limit;
    ELSEIF p_role = 'manager' THEN
        -- 经理：部分脱敏
        SELECT 
            id,
            name,
            CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
            email,
            age
        FROM users
        LIMIT p_limit;
    ELSE
        -- 普通员工：高度脱敏
        SELECT 
            id,
            CONCAT(LEFT(name, 1), '**') AS name,
            '***' AS phone,
            '***' AS email,
            age
        FROM users
        LIMIT p_limit;
    END IF;
END $$

DELIMITER ;

-- 调用
CALL sp_get_users('manager', 10);
```

#### 2. 数据导出脱敏

```sql
DELIMITER $$

CREATE PROCEDURE sp_export_users_masked()
BEGIN
    -- 创建临时表
    CREATE TEMPORARY TABLE tmp_users_export AS
    SELECT 
        id,
        name,
        CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
        CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
        age,
        city
    FROM users;
    
    -- 导出到文件
    SELECT * FROM tmp_users_export
    INTO OUTFILE '/tmp/users_export.csv'
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n';
    
    -- 清理临时表
    DROP TEMPORARY TABLE tmp_users_export;
END $$

DELIMITER ;

CALL sp_export_users_masked();
```

### 五、应用层脱敏

#### 1. Python 示例

```python
import re

def mask_phone(phone):
    """手机号脱敏"""
    if len(phone) == 11:
        return phone[:3] + '****' + phone[-4:]
    return phone

def mask_id_card(id_card):
    """身份证脱敏"""
    if len(id_card) == 18:
        return id_card[:6] + '********' + id_card[-4:]
    return id_card

def mask_email(email):
    """邮箱脱敏"""
    parts = email.split('@')
    if len(parts) == 2:
        return parts[0][:2] + '***@' + parts[1]
    return email

def mask_name(name):
    """姓名脱敏"""
    if len(name) >= 2:
        return name[0] + '*' * (len(name) - 1)
    return name

# 使用示例
users = db.query("SELECT * FROM users")
for user in users:
    user['phone'] = mask_phone(user['phone'])
    user['email'] = mask_email(user['email'])
    user['name'] = mask_name(user['name'])
```

#### 2. Java 示例

```java
public class DataMasking {
    
    public static String maskPhone(String phone) {
        if (phone != null && phone.length() == 11) {
            return phone.substring(0, 3) + "****" + phone.substring(7);
        }
        return phone;
    }
    
    public static String maskIdCard(String idCard) {
        if (idCard != null && idCard.length() == 18) {
            return idCard.substring(0, 6) + "********" + idCard.substring(14);
        }
        return idCard;
    }
    
    public static String maskEmail(String email) {
        if (email != null && email.contains("@")) {
            String[] parts = email.split("@");
            return parts[0].substring(0, Math.min(2, parts[0].length())) 
                   + "***@" + parts[1];
        }
        return email;
    }
}

// 使用 MyBatis 拦截器自动脱敏
@Intercepts({
    @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})
})
public class DataMaskingInterceptor implements Interceptor {
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        List<Object> results = (List<Object>) invocation.proceed();
        
        // 对结果进行脱敏
        for (Object result : results) {
            if (result instanceof User) {
                User user = (User) result;
                user.setPhone(DataMasking.maskPhone(user.getPhone()));
                user.setEmail(DataMasking.maskEmail(user.getEmail()));
            }
        }
        
        return results;
    }
}
```

### 六、数据脱敏工具

#### 1. mysqldump 脱敏导出

```bash
# 使用 sed 在导出时脱敏
mysqldump -u root -p mydb users | \
sed 's/\([0-9]\{3\}\)[0-9]\{4\}\([0-9]\{4\}\)/\1****\2/g' > users_masked.sql

# 或使用专门的脱敏工具
```

#### 2. 使用 pt-show-grants 检查权限

```bash
# 检查谁有访问敏感数据的权限
pt-show-grants --host=localhost --user=root --password=xxx

# 确保只有必要的人员有权限
```

#### 3. 第三方脱敏工具

- **Apache ShardingSphere**：提供数据脱敏功能
- **MyCat**：支持数据脱敏配置
- **DataMasker**：专业的数据脱敏工具

### 七、最佳实践

#### 1. 脱敏策略设计

```sql
-- 制定脱敏等级
-- Level 1: 完全脱敏（测试环境）
-- Level 2: 部分脱敏（数据分析）
-- Level 3: 轻微脱敏（内部使用）
-- Level 4: 不脱敏（管理员）

-- 为每个敏感字段定义脱敏规则
CREATE TABLE data_masking_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100),
    column_name VARCHAR(100),
    masking_type VARCHAR(50),  -- phone, email, id_card, etc.
    masking_rule VARCHAR(500),  -- 脱敏规则
    level INT  -- 脱敏等级
);

INSERT INTO data_masking_rules (table_name, column_name, masking_type, masking_rule, level)
VALUES 
('users', 'phone', 'phone', 'LEFT(phone, 3) + **** + RIGHT(phone, 4)', 2),
('users', 'email', 'email', 'LEFT(email, 2) + ***@ + domain', 2),
('users', 'id_card', 'id_card', 'LEFT(id_card, 6) + ******** + RIGHT(id_card, 4)', 2);
```

#### 2. 权限管理

```sql
-- 最小权限原则
-- 创建只读用户
CREATE USER 'readonly'@'%' IDENTIFIED BY 'password';

-- 只授予脱敏视图的权限
GRANT SELECT ON mydb.v_users_masked TO 'readonly'@'%';

-- 禁止直接访问原表
REVOKE ALL PRIVILEGES ON mydb.users FROM 'readonly'@'%';

-- 定期审计权限
SELECT * FROM mysql.user WHERE User = 'readonly';
SHOW GRANTS FOR 'readonly'@'%';
```

#### 3. 审计和监控

```sql
-- 开启通用查询日志
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/general.log';

-- 监控敏感数据访问
SELECT 
    user,
    host,
    db,
    command,
    time,
    info
FROM information_schema.processlist
WHERE info LIKE '%SELECT%phone%' 
   OR info LIKE '%SELECT%id_card%';

-- 使用审计插件
INSTALL PLUGIN server_audit SONAME 'server_audit.so';
SET GLOBAL server_audit_logging = ON;
```

#### 4. 测试环境脱敏

```sql
-- 从生产环境复制数据到测试环境时脱敏
DELIMITER $$

CREATE PROCEDURE sp_clone_and_mask_data()
BEGIN
    -- 清空测试表
    TRUNCATE TABLE test_db.users;
    
    -- 插入脱敏后的数据
    INSERT INTO test_db.users
    SELECT 
        id,
        name,
        CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
        CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
        CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4)) AS id_card,
        age,
        city
    FROM prod_db.users;
END $$

DELIMITER ;

CALL sp_clone_and_mask_data();
```

### 八、法律法规要求

#### 1. 中国个人信息保护法

```
必须脱敏的场景：
- 向第三方提供个人信息
- 公开披露个人信息
- 用于大数据分析
- 开发测试使用生产数据

脱敏要求：
- 去标识化：无法识别特定个人
- 匿名化：无法复原
- 最小化：只收集必要的信息
```

#### 2. GDPR（欧盟通用数据保护条例）

```
数据保护原则：
- Privacy by Design：设计时考虑隐私
- Data Minimization：数据最小化
- Purpose Limitation：用途限制

违规处罚：
- 最高 2000 万欧元或全球年营业额 4%
```

### 九、总结

**脱敏方法：**
1. ⭐ **字符串函数**：CONCAT、LEFT、RIGHT、REPLACE
2. **哈希函数**：MD5、SHA2（不可逆）
3. **视图脱敏**：透明、集中管理
4. **存储过程**：灵活控制
5. **应用层脱敏**：最灵活

**最佳实践：**
1. ⭐ **优先使用视图脱敏**：透明、易维护
2. **分级脱敏**：根据角色设置不同等级
3. **最小权限**：只授予必要的权限
4. **审计监控**：记录敏感数据访问
5. **测试环境必须脱敏**：避免数据泄露
6. **遵守法律法规**：符合 GDPR、个人信息保护法

**脱敏原则：**
- 能不用就不用（避免存储敏感数据）
- 能用假数据就用假数据
- 必须用时才脱敏
- 脱敏要彻底（不能轻易还原）
- 定期审查脱敏效果

## 24. MySQL 中的 GROUP BY 和 DISTINCT 有何区别？

**答：** GROUP BY 和 DISTINCT 都可以用于去重，但它们的设计目的、功能和使用场景有所不同。

### 一、基本概念

#### 1. DISTINCT

```sql
-- DISTINCT：去除重复行
SELECT DISTINCT column FROM table;

-- 示例
SELECT DISTINCT city FROM users;

-- 结果：返回不重复的城市列表
-- | city   |
-- |--------|
-- | 北京   |
-- | 上海   |
-- | 广州   |
```

**特点：**
- ✅ 简单去重
- ✅ 语法简洁
- ❌ 只能去重，不能聚合
- ❌ 多列去重时所有列都需相同

#### 2. GROUP BY

```sql
-- GROUP BY：分组并聚合
SELECT column, aggregate_function(column) 
FROM table 
GROUP BY column;

-- 示例
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

-- 结果：按城市分组统计
-- | city   | user_count |
-- |--------|------------|
-- | 北京   | 100        |
-- | 上海   | 80         |
-- | 广州   | 60         |
```

**特点：**
- ✅ 支持聚合函数
- ✅ 可以计算统计值
- ✅ 配合 HAVING 过滤
- ⚠️ 语法相对复杂

### 二、核心区别对比

| 特性 | DISTINCT | GROUP BY |
|------|---------|----------|
| **主要用途** | 去重 | 分组聚合 |
| **聚合函数** | ❌ 不支持 | ✅ 支持 |
| **HAVING** | ❌ 不支持 | ✅ 支持 |
| **排序** | 默认排序 | 不保证排序 |
| **性能** | 相当 | 相当 |
| **灵活性** | 低 | 高 |
| **可读性** | 好 | 一般 |

### 三、功能对比

#### 1. 简单去重（两者等价）

```sql
-- 方式 1：使用 DISTINCT
SELECT DISTINCT city FROM users;

-- 方式 2：使用 GROUP BY
SELECT city FROM users GROUP BY city;

-- 结果相同，性能相近
-- EXPLAIN 显示执行计划基本一致
```

**EXPLAIN 分析：**
```sql
EXPLAIN SELECT DISTINCT city FROM users;
-- Extra: Using temporary; Using filesort

EXPLAIN SELECT city FROM users GROUP BY city;
-- Extra: Using temporary; Using filesort
```

#### 2. 多列去重

```sql
-- DISTINCT：所有列组合去重
SELECT DISTINCT city, age FROM users;
-- 只有 city 和 age 都相同的行才会被去重

-- GROUP BY：同样效果
SELECT city, age FROM users GROUP BY city, age;

-- 示例数据：
-- | city | age |
-- |------|-----|
-- | 北京 | 20  |  ← 保留
-- | 北京 | 20  |  ← 去重
-- | 北京 | 25  |  ← 保留（age 不同）
-- | 上海 | 20  |  ← 保留（city 不同）
```

#### 3. 聚合计算（只能用 GROUP BY）

```sql
-- ❌ DISTINCT 无法实现
SELECT DISTINCT city, COUNT(*) FROM users;  -- 错误！

-- ✅ GROUP BY 可以实现
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

-- 更多聚合示例
SELECT 
    city,
    COUNT(*) AS user_count,
    AVG(age) AS avg_age,
    MAX(age) AS max_age,
    MIN(age) AS min_age,
    SUM(score) AS total_score
FROM users
GROUP BY city;
```

#### 4. 条件过滤

```sql
-- DISTINCT：只能用 WHERE（分组前过滤）
SELECT DISTINCT city 
FROM users 
WHERE age > 18;

-- GROUP BY：可以用 WHERE 和 HAVING
SELECT city, COUNT(*) AS user_count
FROM users
WHERE age > 18          -- 分组前过滤
GROUP BY city
HAVING COUNT(*) > 10;   -- 分组后过滤

-- 示例：找出用户数超过 10 人的城市
```

### 四、性能对比

#### 1. 执行计划分析

```sql
-- 测试数据：100 万条记录

-- DISTINCT
EXPLAIN SELECT DISTINCT city FROM users;
-- type: ALL
-- rows: 1000000
-- Extra: Using temporary; Using filesort

-- GROUP BY
EXPLAIN SELECT city FROM users GROUP BY city;
-- type: ALL
-- rows: 1000000
-- Extra: Using temporary; Using filesort

-- 结论：无索引时，性能基本相同
```

#### 2. 有索引的情况

```sql
-- 创建索引
CREATE INDEX idx_city ON users(city);

-- DISTINCT
EXPLAIN SELECT DISTINCT city FROM users;
-- type: range
-- key: idx_city
-- Extra: Using index

-- GROUP BY
EXPLAIN SELECT city FROM users GROUP BY city;
-- type: range
-- key: idx_city
-- Extra: Using index

-- 结论：有索引时，两者都能利用索引，性能相近
```

#### 3. 实际性能测试

```sql
-- 测试 1：简单去重
SELECT SQL_NO_CACHE DISTINCT city FROM users;
-- 耗时：0.5 秒

SELECT SQL_NO_CACHE city FROM users GROUP BY city;
-- 耗时：0.5 秒

-- 测试 2：带聚合
SELECT SQL_NO_CACHE city, COUNT(*) FROM users GROUP BY city;
-- 耗时：0.8 秒

-- 结论：
-- - 简单去重：DISTINCT 和 GROUP BY 性能相当
-- - 需要聚合：只能用 GROUP BY
```

### 五、使用场景

#### 场景 1：简单去重 → 用 DISTINCT

```sql
-- ✅ 推荐：语义清晰
SELECT DISTINCT department FROM employees;

-- 获取所有部门的列表
```

#### 场景 2：统计分析 → 用 GROUP BY

```sql
-- ✅ 必须用 GROUP BY
SELECT 
    department,
    COUNT(*) AS emp_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department;

-- 统计各部门的人数和平均工资
```

#### 场景 3：去重后计数 → 两者结合

```sql
-- 统计有多少个不同的城市
SELECT COUNT(DISTINCT city) AS city_count FROM users;

-- 不能用 GROUP BY 直接实现
-- 需要子查询
SELECT COUNT(*) FROM (
    SELECT city FROM users GROUP BY city
) AS t;
```

#### 场景 4：多列去重 → 根据需求选择

```sql
-- 方式 1：DISTINCT（简洁）
SELECT DISTINCT city, age FROM users;

-- 方式 2：GROUP BY（可扩展）
SELECT city, age, COUNT(*) AS count
FROM users
GROUP BY city, age;

-- 如果需要统计每组数量，用 GROUP BY
-- 如果只需要去重，用 DISTINCT
```

#### 场景 5：分页查询 → 注意陷阱

```sql
-- ❌ 陷阱：DISTINCT + LIMIT 可能不符合预期
SELECT DISTINCT city FROM users ORDER BY city LIMIT 10;

-- ✅ 正确：确保顺序一致
SELECT DISTINCT city FROM users ORDER BY city LIMIT 10;

-- GROUP BY 同样需要注意
SELECT city FROM users GROUP BY city ORDER BY city LIMIT 10;
```

### 六、常见误区

#### 误区 1：DISTINCT 比 GROUP BY 快

```sql
-- ❌ 误解：DISTINCT 更快
SELECT DISTINCT city FROM users;  -- 认为这个更快

-- ✅ 事实：性能相当
SELECT city FROM users GROUP BY city;  -- 性能一样

-- 原因：MySQL 优化器会将两者转换为相同的执行计划
```

#### 误区 2：GROUP BY 会自动排序

```sql
-- ❌ 误解：GROUP BY 结果已排序
SELECT city, COUNT(*) FROM users GROUP BY city;
-- 在 MySQL 5.7+ 中，不保证排序

-- ✅ 正确：显式指定 ORDER BY
SELECT city, COUNT(*) FROM users 
GROUP BY city 
ORDER BY city;

-- 注意：MySQL 5.6 及之前版本，GROUP BY 默认排序
-- MySQL 5.7+ 移除了隐式排序，需要显式指定
```

#### 误区 3：DISTINCT 可以用于聚合

```sql
-- ❌ 错误：DISTINCT 不能直接聚合
SELECT DISTINCT city, COUNT(*) FROM users;  -- 语法错误

-- ✅ 正确：使用 GROUP BY
SELECT city, COUNT(*) FROM users GROUP BY city;

-- 或者：COUNT(DISTINCT ...) 是聚合函数的一部分
SELECT COUNT(DISTINCT city) FROM users;
```

#### 误区 4：NULL 值处理

```sql
-- DISTINCT 和 GROUP BY 对 NULL 的处理相同

INSERT INTO users (city) VALUES (NULL), (NULL), ('北京');

SELECT DISTINCT city FROM users;
-- 结果：
-- | city |
-- |------|
-- | NULL |  ← 只有一个 NULL
-- | 北京 |

SELECT city FROM users GROUP BY city;
-- 结果相同
-- NULL 被视为相同的值，只保留一个
```

### 七、高级用法

#### 1. DISTINCT 与 JOIN

```sql
-- 查询下过订单的用户（去重）
SELECT DISTINCT u.id, u.name
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 等效的 GROUP BY 写法
SELECT u.id, u.name
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 更好的写法：使用 EXISTS
SELECT u.id, u.name
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

#### 2. GROUP BY 与 ROLLUP

```sql
-- ROLLUP：生成分组小计和总计
SELECT 
    city,
    COUNT(*) AS user_count
FROM users
GROUP BY city WITH ROLLUP;

-- 结果：
-- | city   | user_count |
-- |--------|------------|
-- | 北京   | 100        |
-- | 上海   | 80         |
-- | 广州   | 60         |
-- | NULL   | 240        |  ← 总计

-- 多级 ROLLUP
SELECT 
    province,
    city,
    COUNT(*) AS user_count
FROM users
GROUP BY province, city WITH ROLLUP;
```

#### 3. GROUP BY 与 GROUP_CONCAT

```sql
-- 将分组结果合并为字符串
SELECT 
    city,
    GROUP_CONCAT(name SEPARATOR ', ') AS users
FROM users
GROUP BY city;

-- 结果：
-- | city | users                    |
-- |------|--------------------------|
-- | 北京 | 张三, 李四, 王五         |
-- | 上海 | 赵六, 钱七               |
```

### 八、最佳实践

#### 1. 选择原则

```
只需去重 → 用 DISTINCT
需要聚合 → 用 GROUP BY
去重 + 计数 → COUNT(DISTINCT column)
复杂统计 → 用 GROUP BY + 聚合函数
```

#### 2. 性能优化

```sql
-- ✅ 为 GROUP BY/DISTINCT 字段添加索引
CREATE INDEX idx_city ON users(city);

-- ✅ 减少返回列
SELECT DISTINCT city FROM users;  -- 只查需要的列

-- ✅ 先过滤再分组
SELECT city, COUNT(*) 
FROM users 
WHERE age > 18  -- 先过滤
GROUP BY city;

-- ✅ 使用覆盖索引
CREATE INDEX idx_city_name ON users(city, name);
SELECT DISTINCT city, name FROM users;  -- Using index
```

#### 3. 代码规范

```sql
-- ✅ 好：语义清晰
-- 去重用 DISTINCT
SELECT DISTINCT department FROM employees;

-- 统计用 GROUP BY
SELECT department, COUNT(*) FROM employees GROUP BY department;

-- ❌ 不好：混用导致混淆
SELECT department FROM employees GROUP BY department;  -- 应该用 DISTINCT
```

### 九、总结

**核心区别：**
- **DISTINCT**：专注去重，语法简洁
- **GROUP BY**：分组聚合，功能强大

**选择建议：**
1. ⭐ **简单去重 → DISTINCT**
2. **需要聚合 → GROUP BY**
3. **去重计数 → COUNT(DISTINCT)**
4. **复杂统计 → GROUP BY + HAVING**

**性能对比：**
- 无索引：性能相当
- 有索引：都能利用索引
- MySQL 优化器会做相同优化

**注意事项：**
- MySQL 5.7+ GROUP BY 不自动排序
- NULL 值在两者中被视为相同
- 大数据量时注意添加索引
- 优先考虑语义清晰度

**记忆口诀：**
- 去重用 DISTINCT
- 聚合用 GROUP BY
- 性能基本没差异
- 索引优化是关键
- 语义清晰最重要

## 25. MySQL 中，如何使用和优化 LIMIT 子句进行分页？

**答：** LIMIT 是 MySQL 中用于限制查询返回行数的子句，常用于分页查询。但不当使用会导致性能问题，特别是深分页场景。

### 一、LIMIT 基本用法

#### 1. 语法

```sql
-- 语法 1：限制返回行数
SELECT * FROM table LIMIT row_count;

-- 语法 2：偏移量 + 行数
SELECT * FROM table LIMIT offset, row_count;
-- 或
SELECT * FROM table LIMIT row_count OFFSET offset;
```

#### 2. 基本示例

```sql
-- 返回前 10 条记录
SELECT * FROM users LIMIT 10;

-- 从第 11 条开始，返回 10 条（第 2 页）
SELECT * FROM users LIMIT 10, 10;
-- 或
SELECT * FROM users LIMIT 10 OFFSET 10;

-- 从第 21 条开始，返回 10 条（第 3 页）
SELECT * FROM users LIMIT 20, 10;
```

**参数说明：**
- `offset`：偏移量，从 0 开始
- `row_count`：返回的行数

### 二、分页的工作原理

#### 1. OFFSET 分页的执行过程

```sql
SELECT * FROM users ORDER BY id LIMIT 100000, 10;
```

**执行步骤：**
```
1. 扫描前 100010 行数据
2. 丢弃前 100000 行
3. 返回最后 10 行
```

**问题：**
- ❌ 扫描大量无用数据
- ❌ offset 越大，性能越差
- ❌ I/O 浪费严重

#### 2. EXPLAIN 分析

```sql
EXPLAIN SELECT * FROM users ORDER BY id LIMIT 100000, 10;

-- 输出：
-- +----+-------------+-------+------+---------------+------+---------+------+--------+
-- | id | select_type | table | type | key           | rows | Extra  |
-- +----+-------------+-------+------+---------------+------+--------+
-- |  1 | SIMPLE      | users | ALL  | NULL          | 100K | Using filesort |
-- +----+-------------+-------+------+---------------+------+--------+

-- rows: 100000  ← 需要扫描 10 万行
```

### 三、分页优化方案

#### 方案 1：覆盖索引优化

```sql
-- ❌ 不好：SELECT * 导致回表
SELECT * FROM users ORDER BY id LIMIT 100000, 10;

-- ✅ 好：先查主键，再关联查询
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 100000, 10
) AS tmp ON u.id = tmp.id;

-- 原理：
-- 1. 子查询只扫描索引（覆盖索引），速度快
-- 2. 再通过主键关联查询完整数据
-- 3. 只需回表 10 次，而不是 100010 次
```

**性能对比：**
```
原始查询：扫描 100010 行 → 回表 100010 次 → 耗时 2000ms
优化后：扫描索引 100010 行 → 回表 10 次 → 耗时 50ms
性能提升：40 倍
```

#### 方案 2：游标分页（推荐）

```sql
-- ❌ 不好：OFFSET 分页
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10000;

-- ✅ 好：游标分页
SELECT * FROM users 
WHERE id > 10000  -- 上一页最后一条的 ID
ORDER BY id 
LIMIT 10;

-- 原理：
-- 1. 利用索引范围扫描
-- 2. 直接定位到起始位置
-- 3. 只扫描需要的 10 行
```

**应用层实现：**
```python
# 第一页
def get_first_page():
    results = db.query(
        "SELECT * FROM users ORDER BY id LIMIT 11"
    )
    
    if len(results) > 10:
        # 有下一页
        next_cursor = results[-1]['id']
        return {
            'data': results[:10],
            'has_next': True,
            'next_cursor': next_cursor
        }
    else:
        return {
            'data': results,
            'has_next': False
        }

# 后续页
def get_next_page(cursor):
    results = db.query(
        "SELECT * FROM users WHERE id > %s ORDER BY id LIMIT 11",
        (cursor,)
    )
    
    if len(results) > 10:
        next_cursor = results[-1]['id']
        return {
            'data': results[:10],
            'has_next': True,
            'next_cursor': next_cursor
        }
    else:
        return {
            'data': results,
            'has_next': False
        }
```

**优点：**
- ✅ 性能稳定，不受页数影响
- ✅ 始终只扫描 10 行
- ✅ 适合大数据量

**缺点：**
- ❌ 只能顺序翻页，不能跳页
- ❌ 需要保存游标（上一页最后一条的 ID）

#### 方案 3：延迟关联

```sql
-- 适用于复杂查询
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users 
    WHERE age > 18 
    ORDER BY create_time DESC 
    LIMIT 100000, 10
) AS tmp ON u.id = tmp.id;

-- 原理：
-- 1. 子查询只用索引字段，速度快
-- 2. 通过主键关联获取完整数据
```

#### 方案 4：限制最大页数

```sql
-- 业务层面限制
-- 最多只允许查看前 100 页

SELECT * FROM users ORDER BY id LIMIT 1000, 10;  -- 第 100 页

-- 如果用户请求第 101 页，返回错误
if page > 100:
    return error("最多只能查看前 100 页")
```

**原因：**
- 大部分用户不会翻到很深的页
- 搜索引擎通常也只抓取前几页
- 降低服务器压力

#### 方案 5：使用缓存

```python
# Redis 缓存分页结果
def get_users_page(page, page_size=10):
    cache_key = f'users:page:{page}'
    
    # 先查缓存
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # 缓存未命中，查数据库
    offset = (page - 1) * page_size
    results = db.query(
        "SELECT * FROM users ORDER BY id LIMIT %s, %s",
        (offset, page_size)
    )
    
    # 写入缓存（有效期 5 分钟）
    redis.setex(cache_key, 300, json.dumps(results))
    
    return results
```

**适用场景：**
- 数据变化不频繁
- 热点页面（前几页）
- 可以接受短暂的数据不一致

### 四、不同场景的分页策略

#### 场景 1：简单列表（推荐游标分页）

```sql
-- 按 ID 排序
SELECT * FROM users 
WHERE id > :last_id 
ORDER BY id 
LIMIT 10;

-- 按时间排序
SELECT * FROM articles 
WHERE create_time < :last_time 
ORDER BY create_time DESC 
LIMIT 10;
```

#### 场景 2：带搜索条件

```sql
-- 游标分页 + 条件过滤
SELECT * FROM users 
WHERE age > 18 
  AND city = '北京'
  AND id > :last_id 
ORDER BY id 
LIMIT 10;

-- 需要创建联合索引
CREATE INDEX idx_age_city_id ON users(age, city, id);
```

#### 场景 3：复杂排序

```sql
-- 多字段排序
SELECT * FROM products 
WHERE category_id = 1
ORDER BY sales DESC, id ASC 
LIMIT 10 OFFSET 100;

-- 优化：使用覆盖索引
SELECT p.* FROM products p
INNER JOIN (
    SELECT id FROM products 
    WHERE category_id = 1
    ORDER BY sales DESC, id ASC 
    LIMIT 100, 10
) AS tmp ON p.id = tmp.id;

-- 创建联合索引
CREATE INDEX idx_category_sales_id ON products(category_id, sales DESC, id);
```

#### 场景 4：JOIN 查询分页

```sql
-- ❌ 不好：JOIN 后分页
SELECT u.name, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 1
ORDER BY o.create_time DESC
LIMIT 10000, 10;

-- ✅ 好：先分页再 JOIN
SELECT u.name, o.order_no, o.amount
FROM (
    SELECT user_id, create_time 
    FROM orders 
    WHERE status = 1
    ORDER BY create_time DESC 
    LIMIT 10000, 10
) AS tmp
INNER JOIN orders o ON tmp.user_id = o.user_id 
  AND tmp.create_time = o.create_time
INNER JOIN users u ON o.user_id = u.id;
```

### 五、性能测试对比

#### 测试环境

```sql
-- 测试表：100 万条记录
CREATE TABLE test_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    age INT,
    create_time DATETIME,
    INDEX idx_create_time (create_time)
);
```

#### 测试结果

```sql
-- 测试 1：浅分页（第 1 页）
SELECT * FROM test_users ORDER BY id LIMIT 0, 10;
-- 耗时：1ms

-- 测试 2：中等分页（第 1000 页）
SELECT * FROM test_users ORDER BY id LIMIT 9990, 10;
-- 耗时：50ms

-- 测试 3：深分页（第 10000 页）
SELECT * FROM test_users ORDER BY id LIMIT 99990, 10;
-- 耗时：500ms

-- 测试 4：超深分页（第 100000 页）
SELECT * FROM test_users ORDER BY id LIMIT 999990, 10;
-- 耗时：5000ms  ← 非常慢

-- 测试 5：游标分页（任意深度）
SELECT * FROM test_users WHERE id > 999990 ORDER BY id LIMIT 10;
-- 耗时：1ms  ← 始终很快
```

**结论：**
- OFFSET 分页：性能随页数增加而下降
- 游标分页：性能稳定，不受页数影响

### 六、最佳实践

#### 1. 分页策略选择

```
数据量小（< 1 万） → OFFSET 分页即可
数据量中等（1 万 - 100 万） → 覆盖索引优化
数据量大（> 100 万） → 游标分页
需要跳页功能 → OFFSET + 限制最大页数
实时性要求高 → 游标分页
可以接受缓存 → OFFSET + Redis 缓存
```

#### 2. 索引优化

```sql
-- ✅ 为 ORDER BY 字段添加索引
CREATE INDEX idx_create_time ON users(create_time);

-- ✅ 联合索引包含排序和过滤字段
CREATE INDEX idx_status_create ON users(status, create_time);

-- ✅ 覆盖索引
CREATE INDEX idx_id_name ON users(id, name);
SELECT id, name FROM users ORDER BY id LIMIT 10;  -- Using index
```

#### 3. 避免常见陷阱

```sql
-- ❌ 陷阱 1：没有 ORDER BY
SELECT * FROM users LIMIT 10;
-- 结果不确定，每次可能不同

-- ✅ 正确：始终指定 ORDER BY
SELECT * FROM users ORDER BY id LIMIT 10;

-- ❌ 陷阱 2：OFFSET 过大
SELECT * FROM users LIMIT 1000000, 10;

-- ✅ 正确：使用游标分页
SELECT * FROM users WHERE id > 1000000 ORDER BY id LIMIT 10;

-- ❌ 陷阱 3：COUNT(*) + OFFSET 分页
SELECT COUNT(*) FROM users;  -- 额外查询
SELECT * FROM users LIMIT 100, 10;

-- ✅ 正确：估算总数或使用游标
-- 或者缓存 COUNT 结果
```

#### 4. 前端交互优化

```javascript
// 无限滚动（适合移动端）
let lastId = 0;
function loadMore() {
    fetch(`/api/users?last_id=${lastId}&limit=10`)
        .then(res => res.json())
        .then(data => {
            render(data.items);
            if (data.has_next) {
                lastId = data.next_cursor;
            }
        });
}

// 传统分页（适合 PC 端）
function goToPage(page) {
    if (page > 100) {
        alert('最多只能查看前 100 页');
        return;
    }
    fetch(`/api/users?page=${page}&limit=10`)
        .then(res => res.json())
        .then(data => render(data));
}
```

### 七、总结

**分页方式对比：**

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **OFFSET** | 简单、支持跳页 | 深分页慢 | 小数据量 |
| **游标分页** | 性能稳定 | 不支持跳页 | 大数据量、无限滚动 |
| **覆盖索引** | 减少回表 | 仍需扫描 | 中等数据量 |
| **缓存分页** | 速度快 | 数据可能过期 | 热点数据 |

**核心优化方法：**
1. ⭐ **优先使用游标分页**
2. **深分页用覆盖索引优化**
3. **添加合适的索引**
4. **限制最大页数**
5. **使用缓存减轻压力**
6. **避免 SELECT ***

**性能对比：**
```
OFFSET 分页：O(n) 复杂度，随页数增加而变慢
游标分页：O(1) 复杂度，性能稳定
```

**记忆要点：**
- 浅分页用 OFFSET
- 深分页用游标
- 覆盖索引减回表
- 限制页数防滥用
- 索引优化是关键
- 缓存热点提性能

## 26. MySQL 中的查询缓存退役了吗？为什么？

**答：** 是的，MySQL 查询缓存（Query Cache）在 **MySQL 8.0 版本中已被完全移除**。早在 MySQL 5.7.20 中就被标记为废弃（deprecated）。

### 一、查询缓存的历史

#### 1. 什么是查询缓存？

```sql
-- 查询缓存的工作原理
SELECT * FROM users WHERE id = 1;  -- 第一次：执行查询并缓存结果

SELECT * FROM users WHERE id = 1;  -- 第二次：直接从缓存返回，不执行查询
```

**工作流程：**
```
1. 接收 SQL 查询
2. 计算 SQL 的哈希值
3. 查找缓存中是否有匹配的哈希
4. 如果有 → 直接返回缓存结果
5. 如果没有 → 执行查询并缓存结果
```

#### 2. 版本演进

| 版本 | 状态 | 说明 |
|------|------|------|
| **MySQL 4.0+** | 引入 | 首次引入查询缓存 |
| **MySQL 5.0-5.6** | 默认开启 | 广泛使用 |
| **MySQL 5.7.20** | 标记废弃 | 不推荐使用 |
| **MySQL 8.0** | 完全移除 | 代码已删除 |

### 二、为什么退役？

#### 原因 1：并发性能问题（最主要原因）

```sql
-- 问题：任何表的更新都会清空该表的所有缓存

-- 线程 1：查询
SELECT * FROM users WHERE id = 1;  -- 缓存结果

-- 线程 2：更新（即使更新不同的行）
UPDATE users SET name = '张三' WHERE id = 2;  -- 清空 users 表的所有缓存！

-- 线程 3：再次查询
SELECT * FROM users WHERE id = 1;  -- 缓存已失效，需要重新执行
```

**问题分析：**
- ❌ **全局锁竞争**：缓存使用全局互斥锁
- ❌ **缓存失效频繁**：任何写操作都会使相关表的所有缓存失效
- ❌ **高并发下性能下降**：锁竞争成为瓶颈

**性能测试：**
```
低并发场景（< 10 QPS）：
- 有缓存：1000 req/s
- 无缓存：900 req/s
- 提升：11%

高并发场景（> 1000 QPS）：
- 有缓存：5000 req/s  ← 锁竞争严重
- 无缓存：8000 req/s  ← 反而更快
- 下降：37.5%
```

#### 原因 2：命中率低

```sql
-- 缓存对 SQL 要求极其严格

-- 以下 SQL 被视为不同，无法共享缓存
SELECT * FROM users WHERE id = 1;
SELECT * FROM Users WHERE id = 1;  -- 表名大小写不同
SELECT * FROM users WHERE id=1;    -- 空格不同
SELECT * FROM users WHERE id = 2;  -- 参数不同

-- 实际应用中，完全相同的 SQL 很少
```

**命中率统计：**
```
典型 Web 应用：
- 缓存命中率：10-20%
- 缓存失效率：80-90%

原因：
- 动态 SQL 多（参数不同）
- 数据更新频繁
- 查询多样化
```

#### 原因 3：内存管理问题

```sql
-- 查询缓存占用固定内存
SHOW VARIABLES LIKE 'query_cache_size';
-- query_cache_size = 67108864 (64MB)

-- 问题：
-- 1. 内存预分配，即使不使用也占用
-- 2. 内存碎片化严重
-- 3. 大结果集可能填满缓存
```

**内存浪费示例：**
```
配置：query_cache_size = 256MB
实际使用：50MB
浪费：206MB (80%)

原因：
- 缓存块大小固定
- 小查询浪费空间
- 碎片化严重
```

#### 原因 4：有更好的替代方案

```
现代缓存方案：
- ✅ Redis/Memcached：应用层缓存
- ✅ InnoDB Buffer Pool：引擎层缓存
- ✅ CDN：静态资源缓存
- ✅ HTTP 缓存：浏览器缓存

优势：
- 更灵活的控制
- 更好的性能
- 分布式支持
- 持久化能力
```

### 三、InnoDB Buffer Pool 的优势

#### 1. 什么是 Buffer Pool？

```
Buffer Pool：InnoDB 引擎的内存缓存区
- 缓存数据页（Data Pages）
- 缓存索引页（Index Pages）
- 缓存 Undo Log
- 使用 LRU 算法管理
```

#### 2. 与查询缓存对比

| 特性 | 查询缓存 | Buffer Pool |
|------|---------|-------------|
| **缓存粒度** | SQL 级别 | 数据页级别 |
| **失效机制** | 表级失效 | 页级失效 |
| **并发性能** | 差（全局锁） | 好（无锁/轻量锁） |
| **命中率** | 低（10-20%） | 高（90-99%） |
| **内存利用** | 差（碎片化） | 好（LRU 管理） |
| **适用场景** | 读多写少 | 通用场景 |

#### 3. Buffer Pool 工作原理

```sql
-- 第一次查询
SELECT * FROM users WHERE id = 1;
-- 1. 从磁盘读取数据页到 Buffer Pool
-- 2. 在 Buffer Pool 中查找记录
-- 3. 返回结果

-- 第二次查询
SELECT * FROM users WHERE id = 1;
-- 1. 直接在 Buffer Pool 中找到数据页
-- 2. 返回结果（无需磁盘 I/O）

-- 即使 SQL 不同，只要访问相同的数据页，就能命中
SELECT * FROM users WHERE id = 1;
SELECT name FROM users WHERE id = 1;  -- 都能命中 Buffer Pool
```

**优势：**
- ✅ 缓存数据页，而非 SQL 结果
- ✅ 不同的 SQL 可以共享缓存
- ✅ 更新只影响相关页，不影响其他页
- ✅ 并发性能好

### 四、现代缓存方案

#### 1. 应用层缓存（Redis）

```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_user(user_id):
    # 缓存键
    cache_key = f'user:{user_id}'
    
    # 先查缓存
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # 缓存未命中，查数据库
    user = db.query("SELECT * FROM users WHERE id = %s", (user_id,))
    
    # 写入缓存（有效期 1 小时）
    if user:
        redis_client.setex(cache_key, 3600, json.dumps(user))
    
    return user

def update_user(user_id, data):
    # 更新数据库
    db.execute("UPDATE users SET ... WHERE id = %s", (user_id,))
    
    # 删除缓存（Cache Aside 模式）
    cache_key = f'user:{user_id}'
    redis_client.delete(cache_key)
```

**优点：**
- ✅ 灵活控制缓存策略
- ✅ 支持分布式
- ✅ 持久化能力
- ✅ 丰富的数据结构

#### 2. 多级缓存架构

```
客户端请求
    ↓
CDN 缓存（静态资源）
    ↓
浏览器缓存（HTTP 缓存）
    ↓
应用层缓存（Redis/Memcached）
    ↓
数据库缓存（Buffer Pool）
    ↓
磁盘存储
```

**示例：**
```python
def get_article(article_id):
    # Level 1: 本地缓存（进程内）
    if article_id in local_cache:
        return local_cache[article_id]
    
    # Level 2: Redis 缓存
    cached = redis.get(f'article:{article_id}')
    if cached:
        result = json.loads(cached)
        local_cache[article_id] = result  # 回填本地缓存
        return result
    
    # Level 3: 数据库（Buffer Pool 会自动缓存）
    article = db.query("SELECT * FROM articles WHERE id = %s", (article_id,))
    
    # 写入缓存
    if article:
        redis.setex(f'article:{article_id}', 300, json.dumps(article))
        local_cache[article_id] = article
    
    return article
```

#### 3. 缓存更新策略

```python
# 策略 1：Cache Aside（旁路缓存）- 最常用
def update_with_cache aside(key, data):
    db.update(data)          # 先更新数据库
    cache.delete(key)        # 再删除缓存
    # 下次查询时会重新加载

# 策略 2：Write Through（写穿）
def update_with_write_through(key, data):
    db.update(data)          # 更新数据库
    cache.set(key, data)     # 同时更新缓存

# 策略 3：Write Behind（写回）
def update_with_write_behind(key, data):
    cache.set(key, data)     # 先更新缓存
    async_db_update(data)    # 异步更新数据库
```

### 五、迁移建议

#### 1. 从 MySQL 5.7 升级到 8.0

```sql
-- 升级前检查
SHOW VARIABLES LIKE 'query_cache%';

-- 输出：
-- query_cache_type = ON
-- query_cache_size = 67108864

-- 升级步骤：
-- 1. 禁用查询缓存
SET GLOBAL query_cache_type = OFF;
SET GLOBAL query_cache_size = 0;

-- 2. 观察性能变化
-- 3. 实施替代方案（Redis 等）
-- 4. 升级到 MySQL 8.0
```

#### 2. 替代方案设计

```python
# 原代码（依赖查询缓存）
def get_users_by_city(city):
    return db.query("SELECT * FROM users WHERE city = %s", (city,))
    # MySQL 查询缓存自动处理

# 新代码（使用 Redis）
def get_users_by_city(city):
    cache_key = f'users:city:{city}'
    
    # 查缓存
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # 查数据库
    users = db.query("SELECT * FROM users WHERE city = %s", (city,))
    
    # 写缓存（有效期 5 分钟）
    redis.setex(cache_key, 300, json.dumps(users))
    
    return users

def update_user_city(user_id, new_city):
    # 更新数据库
    db.execute("UPDATE users SET city = %s WHERE id = %s", (new_city, user_id))
    
    # 清除相关缓存
    old_city = get_user_city(user_id)
    redis.delete(f'users:city:{old_city}')
```

### 六、最佳实践

#### 1. 不要依赖查询缓存

```sql
-- ❌ 不好：依赖查询缓存
-- MySQL 5.7 及之前
SELECT SQL_CACHE * FROM users WHERE id = 1;

-- ✅ 好：使用应用层缓存
-- Python + Redis
user = redis.get('user:1') or db.query("SELECT * FROM users WHERE id = 1")
```

#### 2. 合理配置 Buffer Pool

```ini
# my.cnf
[mysqld]
# Buffer Pool 大小（建议为物理内存的 50-70%）
innodb_buffer_pool_size = 4G

# Buffer Pool 实例数（减少锁竞争）
innodb_buffer_pool_instances = 8

# 预热 Buffer Pool（重启后快速恢复）
innodb_buffer_pool_dump_at_shutdown = ON
innodb_buffer_pool_load_at_startup = ON
```

#### 3. 监控缓存效果

```sql
-- 查看 Buffer Pool 命中率
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';

-- 计算命中率
-- 命中率 = (1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests) * 100%
-- 理想值：> 99%

-- 如果命中率低：
-- 1. 增加 innodb_buffer_pool_size
-- 2. 优化查询，减少全表扫描
-- 3. 添加合适的索引
```

#### 4. 缓存穿透和雪崩防护

```python
# 防止缓存穿透（查询不存在的数据）
def get_user(user_id):
    cache_key = f'user:{user_id}'
    
    cached = redis.get(cache_key)
    if cached:
        if cached == 'NULL':  # 特殊标记
            return None
        return json.loads(cached)
    
    user = db.query("SELECT * FROM users WHERE id = %s", (user_id,))
    
    if user:
        redis.setex(cache_key, 3600, json.dumps(user))
    else:
        # 缓存空值，防止穿透
        redis.setex(cache_key, 60, 'NULL')
    
    return user

# 防止缓存雪崩（大量缓存同时过期）
import random
def set_cache_with_jitter(key, value, ttl):
    # 添加随机抖动
    jitter = random.randint(0, 60)
    redis.setex(key, ttl + jitter, value)
```

### 七、总结

**查询缓存退役原因：**
1. ⭐ **并发性能差**：全局锁竞争严重
2. **命中率低**：SQL 稍有不同就失效
3. **内存浪费**：碎片化严重
4. **有更好的替代**：Buffer Pool + Redis

**现代缓存架构：**
```
应用层：Redis/Memcached（灵活、分布式）
引擎层：InnoDB Buffer Pool（高效、自动）
系统层：OS Page Cache（透明、底层）
```

**迁移建议：**
1. ⭐ **使用 Redis 等应用层缓存**
2. **优化 Buffer Pool 配置**
3. **实施多级缓存策略**
4. **注意缓存一致性**
5. **防护缓存穿透/雪崩**

**核心观点：**
- 查询缓存是"过早优化"的典型例子
- 在现代高并发场景下弊大于利
- Buffer Pool 提供了更好的缓存机制
- 应用层缓存更灵活可控

**记忆要点：**
- MySQL 8.0 已移除
- 并发性能是主因
- Buffer Pool 更高效
- Redis 是最佳替代
- 多级缓存是趋势

## 27. MySQL 的 slow_query_log 的作用是什么？

**答：** `slow_query_log`（慢查询日志）是 MySQL 中用于记录执行时间超过指定阈值的 SQL 语句的功能，是数据库性能优化的重要工具。

### 一、慢查询日志的作用

#### 1. 主要功能

```
慢查询日志的作用：
- ✅ 识别性能瓶颈
- ✅ 发现慢 SQL
- ✅ 优化查询性能
- ✅ 监控系统健康
- ✅ 辅助性能调优
```

#### 2. 工作原理

```sql
-- 配置阈值：long_query_time = 2 秒

-- SQL 1：执行 1 秒 → 不记录
SELECT * FROM users WHERE id = 1;  -- 耗时 1s < 2s

-- SQL 2：执行 3 秒 → 记录到慢查询日志
SELECT * FROM orders WHERE status = 'pending';  -- 耗时 3s > 2s ✓

-- SQL 3：执行 5 秒 → 记录到慢查询日志
SELECT COUNT(*) FROM large_table;  -- 耗时 5s > 2s ✓
```

### 二、配置慢查询日志

#### 1. 查看当前配置

```sql
-- 查看所有慢查询相关配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';
SHOW VARIABLES LIKE 'log_queries_not_using_indexes';

-- 输出：
-- +---------------------+----------------------------------+
-- | Variable_name       | Value                            |
-- +---------------------+----------------------------------+
-- | slow_query_log      | OFF                              | ← 是否开启
-- | slow_query_log_file | /var/log/mysql/slow.log          | ← 日志文件路径
-- | long_query_time     | 10.000000                        | ← 阈值（秒）
-- +---------------------+----------------------------------+
```

#### 2. 开启慢查询日志

```sql
-- 方法 1：运行时开启（临时生效）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 超过 2 秒的查询
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 方法 2：配置文件开启（永久生效）
-- my.cnf 或 my.ini
[mysqld]
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = ON  -- 记录未使用索引的查询
```

#### 3. 重要参数说明

| 参数 | 说明 | 默认值 | 建议值 |
|------|------|--------|--------|
| **slow_query_log** | 是否开启慢查询日志 | OFF | ON |
| **slow_query_log_file** | 日志文件路径 | hostname-slow.log | 自定义路径 |
| **long_query_time** | 慢查询阈值（秒） | 10 | 1-2 |
| **log_queries_not_using_indexes** | 记录未使用索引的查询 | OFF | ON |
| **log_slow_admin_statements** | 记录管理语句（ALTER等） | OFF | OFF |
| **min_examined_row_limit** | 最少检查行数才记录 | 0 | 1000 |

### 三、慢查询日志格式

#### 1. 日志内容示例

```
# Time: 2024-01-15T10:30:45.123456Z
# User@Host: root[root] @ localhost []  Id:    12
# Query_time: 3.456789  Lock_time: 0.000123 Rows_sent: 100  Rows_examined: 1000000

SET timestamp=1705312245;
SELECT * FROM orders WHERE status = 'pending' AND create_time > '2024-01-01';
```

**字段说明：**
- `Time`：执行时间
- `User@Host`：执行用户和主机
- `Query_time`：查询执行时间（秒）
- `Lock_time`：锁等待时间（秒）
- `Rows_sent`：返回的行数
- `Rows_examined`：扫描的行数
- `SET timestamp`：时间戳
- 最后一行：实际的 SQL 语句

#### 2. 关键指标解读

```sql
-- Query_time: 3.456789
-- 含义：查询总共执行了 3.46 秒
-- 分析：超过阈值，需要优化

-- Lock_time: 0.000123
-- 含义：锁等待了 0.000123 秒
-- 分析：锁竞争不严重

-- Rows_sent: 100
-- 含义：返回了 100 行数据
-- 分析：结果集不大

-- Rows_examined: 1000000
-- 含义：扫描了 100 万行
-- 分析：全表扫描！需要添加索引

-- 优化方向：
-- Rows_examined / Rows_sent = 10000
-- 扫描 10000 行才返回 1 行，效率极低
```

### 四、分析慢查询日志

#### 1. 使用 mysqldumpslow 工具

```bash
# 基本用法
mysqldumpslow /var/log/mysql/slow.log

# 按查询时间排序，显示前 10 条
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log

# 按锁定时间排序
mysqldumpslow -s l -t 10 /var/log/mysql/slow.log

# 按扫描行数排序
mysqldumpslow -s r -t 10 /var/log/mysql/slow.log

# 按执行次数排序
mysqldumpslow -s c -t 10 /var/log/mysql/slow.log

# 包含所有 SQL（不进行抽象）
mysqldumpslow -a /var/log/mysql/slow.log
```

**参数说明：**
- `-s`：排序方式
  - `t`：按查询时间
  - `l`：按锁定时间
  - `r`：按返回行数
  - `c`：按执行次数
- `-t`：显示前 N 条
- `-a`：不进行 SQL 抽象
- `-g`：正则过滤

**输出示例：**
```
Count: 100  Time=3.45s (345s)  Lock=0.00s (0s)  Rows=100.0 (10000), root[root]@localhost
SELECT * FROM orders WHERE status = 'N' AND create_time > 'S'

Count: 50  Time=5.67s (283s)  Lock=0.01s (0s)  Rows=1.0 (50), root[root]@localhost
SELECT COUNT(*) FROM users WHERE age > N
```

#### 2. 使用 pt-query-digest（推荐）

```bash
# 安装 Percona Toolkit
sudo apt-get install percona-toolkit  # Ubuntu
sudo yum install percona-toolkit      # CentOS

# 分析慢查询日志
pt-query-digest /var/log/mysql/slow.log

# 输出报告
pt-query-digest /var/log/mysql/slow.log \
  --report-format profile \
  --order-by Query_time:sum \
  --limit 10

# 生成 HTML 报告
pt-query-digest /var/log/mysql/slow.log \
  --create-review-table \
  --review h=localhost,D=test,t=query_review
```

**输出示例：**
```
# Rank Query ID           Response time Calls R/Call V/M   Item
# ==== ================== ============= ===== ====== ===== ==========
#    1 0xABC123...         345.0000 50%    100 3.4500  0.01 SELECT orders
#    2 0xDEF456...         283.5000 40%     50 5.6700  0.02 SELECT users
#    3 0xGHI789...          71.2500 10%     25 2.8500  0.00 SELECT products
```

#### 3. 使用 Performance Schema

```sql
-- 查询最慢的 SQL
SELECT 
    DIGEST_TEXT,
    COUNT_STAR AS exec_count,
    SUM_TIMER_WAIT/1000000000000 AS total_latency_sec,
    AVG_TIMER_WAIT/1000000000000 AS avg_latency_sec,
    MAX_TIMER_WAIT/1000000000000 AS max_latency_sec,
    SUM_ROWS_EXAMINED AS rows_examined,
    SUM_ROWS_SENT AS rows_sent
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;

-- 查询未使用索引的 SQL
SELECT 
    DIGEST_TEXT,
    COUNT_STAR AS exec_count,
    SUM_NO_INDEX_USED AS no_index_used_count
FROM performance_schema.events_statements_summary_by_digest
WHERE SUM_NO_INDEX_USED > 0
ORDER BY SUM_NO_INDEX_USED DESC
LIMIT 10;
```

### 五、实战优化案例

#### 案例 1：全表扫描优化

```sql
-- 慢查询日志记录：
# Query_time: 5.234567  Rows_sent: 10  Rows_examined: 1000000
SELECT * FROM users WHERE email = 'test@example.com';

-- 分析：扫描 100 万行，只返回 10 行

-- 优化：添加索引
CREATE INDEX idx_email ON users(email);

-- 优化后：
# Query_time: 0.001234  Rows_sent: 10  Rows_examined: 10
-- 性能提升：4200 倍！
```

#### 案例 2：深分页优化

```sql
-- 慢查询日志记录：
# Query_time: 3.456789  Rows_sent: 10  Rows_examined: 100010
SELECT * FROM orders ORDER BY create_time LIMIT 100000, 10;

-- 分析：深分页导致扫描大量数据

-- 优化：使用游标分页
SELECT * FROM orders 
WHERE create_time < '2024-01-01 00:00:00'
ORDER BY create_time DESC 
LIMIT 10;

-- 优化后：
# Query_time: 0.012345  Rows_sent: 10  Rows_examined: 10
-- 性能提升：280 倍！
```

#### 案例 3：JOIN 优化

```sql
-- 慢查询日志记录：
# Query_time: 8.123456  Rows_sent: 100  Rows_examined: 5000000
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 1;

-- 分析：缺少关联字段索引

-- 优化：添加索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_users_status ON users(status);

-- 优化后：
# Query_time: 0.234567  Rows_sent: 100  Rows_examined: 1000
-- 性能提升：34 倍！
```

### 六、最佳实践

#### 1. 合理设置阈值

```sql
-- 开发环境：宽松阈值，捕获更多问题
SET GLOBAL long_query_time = 1;

-- 测试环境：中等阈值
SET GLOBAL long_query_time = 2;

-- 生产环境：严格阈值
SET GLOBAL long_query_time = 1;

-- 高并发系统：更严格
SET GLOBAL long_query_time = 0.5;
```

**建议：**
- 初始设置为 1-2 秒
- 根据系统负载调整
- 定期审查和优化

#### 2. 定期分析日志

```bash
#!/bin/bash
# 每日分析慢查询日志

LOG_FILE="/var/log/mysql/slow.log"
REPORT_DIR="/var/log/mysql/reports"
DATE=$(date +%Y%m%d)

# 生成报告
mysqldumpslow -s t -t 20 $LOG_FILE > $REPORT_DIR/slow_report_$DATE.txt

# 归档日志
mv $LOG_FILE $LOG_FILE.$DATE
mysqladmin flush-logs

# 发送告警（如果存在超慢查询）
if grep -q "Query_time: [1-9][0-9]" $REPORT_DIR/slow_report_$DATE.txt; then
    echo "发现超慢查询，请检查：$REPORT_DIR/slow_report_$DATE.txt" | \
    mail -s "MySQL 慢查询告警" dba@example.com
fi
```

#### 3. 监控和告警

```python
import re
import smtplib
from datetime import datetime

def analyze_slow_log(log_file, threshold=5):
    """分析慢查询日志，发现超慢查询"""
    slow_queries = []
    
    with open(log_file, 'r') as f:
        content = f.read()
    
    # 解析慢查询
    pattern = r'# Query_time: ([\d.]+).*?Rows_examined: (\d+)\n(.*?)$'
    matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
    
    for match in matches:
        query_time = float(match.group(1))
        rows_examined = int(match.group(2))
        sql = match.group(3).strip()
        
        if query_time > threshold:
            slow_queries.append({
                'query_time': query_time,
                'rows_examined': rows_examined,
                'sql': sql
            })
    
    return slow_queries

# 使用
slow_queries = analyze_slow_log('/var/log/mysql/slow.log', threshold=5)
if slow_queries:
    send_alert(slow_queries)
```

#### 4. 日志轮转

```bash
# 配置 logrotate
# /etc/logrotate.d/mysql

/var/log/mysql/slow.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 640 mysql mysql
    postrotate
        mysqladmin flush-logs
    endscript
}
```

### 七、常见问题

#### 问题 1：日志文件过大

```bash
# 原因：长期未清理

# 解决 1：定期轮转
# 使用 logrotate（见上文）

# 解决 2：手动清理
mv /var/log/mysql/slow.log /var/log/mysql/slow.log.old
mysqladmin flush-logs
rm /var/log/mysql/slow.log.old

# 解决 3：限制日志大小
# my.cnf
[mysqld]
max_binlog_size = 100M  # 虽然这是 binlog，但理念相同
```

#### 问题 2：影响性能

```sql
-- 问题：开启慢查询日志会轻微影响性能

-- 解决 1：异步写入
-- MySQL 5.6+ 默认异步写入，影响很小

-- 解决 2：只在需要时开启
SET GLOBAL slow_query_log = 'ON';   -- 需要时开启
-- ... 分析问题 ...
SET GLOBAL slow_query_log = 'OFF';  -- 分析完关闭

-- 解决 3：提高阈值
SET GLOBAL long_query_time = 5;  -- 只记录非常慢的查询
```

**性能影响测试：**
```
关闭慢查询日志：10000 req/s
开启慢查询日志：9800 req/s
性能损失：2%  （可接受）
```

#### 问题 3：找不到慢查询

```sql
-- 原因 1：阈值设置太高
SHOW VARIABLES LIKE 'long_query_time';
-- 如果设置为 10，可能错过很多慢查询

-- 解决：降低阈值
SET GLOBAL long_query_time = 1;

-- 原因 2：日志未开启
SHOW VARIABLES LIKE 'slow_query_log';
-- 如果为 OFF，需要开启

-- 解决：开启日志
SET GLOBAL slow_query_log = 'ON';

-- 原因 3：权限问题
-- 确保 MySQL 有权限写入日志文件

-- 解决：检查权限
ls -la /var/log/mysql/slow.log
chown mysql:mysql /var/log/mysql/slow.log
```

### 八、总结

**慢查询日志的作用：**
1. ⭐ **识别性能瓶颈**
2. **发现慢 SQL**
3. **辅助性能优化**
4. **监控系统健康**

**核心配置：**
```ini
[mysqld]
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = ON
```

**分析工具：**
- **mysqldumpslow**：MySQL 自带，简单易用
- **pt-query-digest**：功能强大，推荐使用
- **Performance Schema**：实时监控

**最佳实践：**
1. ⭐ **生产环境始终开启**
2. **合理设置阈值（1-2 秒）**
3. **定期分析日志**
4. **建立告警机制**
5. **日志轮转和归档**
6. **结合 EXPLAIN 优化**

**优化流程：**
```
开启慢查询日志 → 收集慢查询 → 分析日志 → EXPLAIN 分析 → 
添加索引/优化 SQL → 验证效果 → 持续监控
```

**记忆要点：**
- 慢查询日志必开启
- 阈值设置要合理
- 定期分析不能少
- pt-query-digest 强
- 结合 EXPLAIN 优化
- 建立告警机制

## 28. MySQL 数据库的主要备份方式有哪些？

**答：** MySQL 提供了多种备份方式，根据备份方法、备份范围和备份时机可以分为不同的类型。选择合适的备份策略对数据安全至关重要。

### 一、备份分类

#### 1. 按备份方法分类

| 类型 | 说明 | 工具 | 特点 |
|------|------|------|------|
| **逻辑备份** | 导出 SQL 语句 | mysqldump | 灵活、可跨版本 |
| **物理备份** | 复制数据文件 | xtrabackup | 快速、适合大库 |

#### 2. 按备份范围分类

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **全量备份** | 备份整个数据库 | 定期完整备份 |
| **增量备份** | 只备份变化的数据 | 频繁备份 |
| **差异备份** | 备份自上次全备后的变化 | 折中方案 |

#### 3. 按备份时机分类

| 类型 | 说明 | 影响 |
|------|------|------|
| **热备份** | 数据库运行时备份 | 无停机，最常用 |
| **温备份** | 备份时加读锁 | 可读不可写 |
| **冷备份** | 停止服务后备份 | 停机，最安全 |

### 二、逻辑备份（mysqldump）

#### 1. 基本用法

```bash
# 备份单个数据库
mysqldump -u root -p mydb > mydb_backup.sql

# 备份多个数据库
mysqldump -u root -p --databases db1 db2 > backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_backup.sql

# 备份指定表
mysqldump -u root -p mydb users orders > tables_backup.sql
```

#### 2. 常用参数

```bash
# 完整备份（推荐）
mysqldump -u root -p \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --master-data=2 \
  --flush-logs \
  mydb > mydb_backup.sql

# 参数说明：
# --single-transaction：InnoDB 一致性备份（不加锁）
# --routines：备份存储过程和函数
# --triggers：备份触发器
# --events：备份事件调度器
# --master-data=2：记录 binlog 位置（注释形式）
# --flush-logs：刷新日志
```

#### 3. 压缩备份

```bash
# 备份并压缩
mysqldump -u root -p mydb | gzip > mydb_backup.sql.gz

# 恢复
gunzip < mydb_backup.sql.gz | mysql -u root -p mydb

# 或者
zcat mydb_backup.sql.gz | mysql -u root -p mydb
```

**压缩率：**
```
原始大小：10 GB
压缩后：2-3 GB
压缩率：70-80%
```

#### 4. 分片备份（大数据库）

```bash
# 按表备份
for table in $(mysql -u root -p -N -e "SHOW TABLES FROM mydb"); do
    mysqldump -u root -p mydb $table > ${table}.sql
    echo "Backup completed: $table"
done

# 并行备份（加快大库备份）
mysqldump -u root -p mydb table1 &
mysqldump -u root -p mydb table2 &
mysqldump -u root -p mydb table3 &
wait
```

#### 5. 恢复数据

```bash
# 恢复整个数据库
mysql -u root -p mydb < mydb_backup.sql

# 恢复单个表
mysql -u root -p mydb < users.sql

# 从压缩文件恢复
gunzip < mydb_backup.sql.gz | mysql -u root -p mydb
```

**优点：**
- ✅ 灵活，可选择性恢复
- ✅ 可跨 MySQL 版本
- ✅ 可跨平台迁移
- ✅ 可读性强（SQL 文本）

**缺点：**
- ❌ 备份速度慢（大库）
- ❌ 恢复速度慢
- ❌ 占用存储空间大
- ❌ 备份期间可能影响性能

### 三、物理备份（XtraBackup）

#### 1. Percona XtraBackup 介绍

```
XtraBackup：开源的 MySQL 热备份工具
- 支持 InnoDB 和 XtraDB
- 在线热备份，无需停机
- 支持增量备份
- 备份速度快
```

#### 2. 安装

```bash
# Ubuntu/Debian
sudo apt-get install percona-xtrabackup-80

# CentOS/RHEL
sudo yum install percona-xtrabackup-80

# 验证安装
xtrabackup --version
```

#### 3. 全量备份

```bash
# 创建备份目录
mkdir -p /backup/mysql

# 执行全量备份
xtrabackup --backup \
  --target-dir=/backup/mysql/full_$(date +%Y%m%d) \
  --user=root \
  --password=your_password

# 准备备份（应用日志）
xtrabackup --prepare \
  --target-dir=/backup/mysql/full_$(date +%Y%m%d)
```

#### 4. 增量备份

```bash
# 第一次增量备份（基于全量备份）
xtrabackup --backup \
  --target-dir=/backup/mysql/incr_$(date +%Y%m%d_%H%M%S) \
  --incremental-basedir=/backup/mysql/full_20240115 \
  --user=root \
  --password=your_password

# 第二次增量备份（基于上次增量）
xtrabackup --backup \
  --target-dir=/backup/mysql/incr_$(date +%Y%m%d_%H%M%S) \
  --incremental-basedir=/backup/mysql/incr_20240115_120000 \
  --user=root \
  --password=your_password
```

#### 5. 恢复备份

```bash
# 步骤 1：准备全量备份
xtrabackup --prepare \
  --apply-log-only \
  --target-dir=/backup/mysql/full_20240115

# 步骤 2：应用增量备份
xtrabackup --prepare \
  --apply-log-only \
  --target-dir=/backup/mysql/full_20240115 \
  --incremental-dir=/backup/mysql/incr_20240115_120000

# 步骤 3：最终准备
xtrabackup --prepare \
  --target-dir=/backup/mysql/full_20240115

# 步骤 4：停止 MySQL
systemctl stop mysql

# 步骤 5：恢复数据
rm -rf /var/lib/mysql/*
xtrabackup --copy-back \
  --target-dir=/backup/mysql/full_20240115

# 步骤 6：修改权限
chown -R mysql:mysql /var/lib/mysql

# 步骤 7：启动 MySQL
systemctl start mysql
```

**优点：**
- ✅ 备份速度快
- ✅ 恢复速度快
- ✅ 支持增量备份
- ✅ 在线热备份

**缺点：**
- ❌ 只能用于 InnoDB/XtraDB
- ❌ 不能跨版本
- ❌ 需要额外安装
- ❌ 恢复时需要停机

### 四、Binlog 备份

#### 1. Binlog 的作用

```
Binlog（二进制日志）：
- 记录所有修改数据的 SQL
- 用于主从复制
- 用于时间点恢复（PITR）
- 配合全量备份使用
```

#### 2. 配置 Binlog

```ini
# my.cnf
[mysqld]
log-bin = mysql-bin
binlog-format = ROW  # 推荐 ROW 格式
expire_logs_days = 7  # 保留 7 天
max_binlog_size = 100M
```

#### 3. 备份 Binlog

```bash
# 刷新 binlog（开始新的 binlog 文件）
mysqladmin -u root -p flush-logs

# 复制 binlog 文件
cp /var/lib/mysql/mysql-bin.* /backup/binlog/

# 或者使用 mysqlbinlog 工具
mysqlbinlog --read-from-remote-server \
  --host=localhost \
  --user=root \
  --password=xxx \
  --raw \
  mysql-bin.000001 > /backup/binlog/mysql-bin.000001
```

#### 4. 时间点恢复（PITR）

```bash
# 场景：误删除数据，需要恢复到特定时间点

# 步骤 1：恢复最近的全量备份
mysql -u root -p mydb < full_backup.sql

# 步骤 2：应用 binlog 恢复到故障前
mysqlbinlog --stop-datetime="2024-01-15 10:30:00" \
  /var/lib/mysql/mysql-bin.000001 \
  /var/lib/mysql/mysql-bin.000002 | \
  mysql -u root -p mydb

# 或者恢复到特定位置
mysqlbinlog --stop-position=12345 \
  mysql-bin.000001 | \
  mysql -u root -p mydb
```

### 五、其他备份工具

#### 1. MySQL Enterprise Backup

```bash
# Oracle 官方企业级备份工具（商业软件）
mysqlbackup --user=root --password=xxx \
  --backup-dir=/backup/mysql \
  backup-and-apply-log
```

**特点：**
- ✅ 官方支持
- ✅ 功能强大
- ✅ 支持压缩和加密
- ❌ 需要付费

#### 2. MyDumper

```bash
# 多线程逻辑备份工具
mydumper -u root -p password \
  -B mydb \
  -o /backup/mydumper \
  -t 4  # 4 个线程

# 恢复
myloader -u root -p password \
  -B mydb \
  -d /backup/mydumper \
  -t 4
```

**特点：**
- ✅ 多线程，速度快
- ✅ 支持并行恢复
- ✅ 比 mysqldump 快 5-10 倍

#### 3. LVM 快照

```bash
# 基于 LVM 的物理备份

# 步骤 1：锁定表
mysql -u root -p -e "FLUSH TABLES WITH READ LOCK"

# 步骤 2：创建 LVM 快照
lvcreate --snapshot --size 10G --name mysql_snap /dev/vg/mysql

# 步骤 3：解锁表
mysql -u root -p -e "UNLOCK TABLES"

# 步骤 4：挂载快照并备份
mount /dev/vg/mysql_snap /mnt/snap
tar czf /backup/mysql_lvm.tar.gz /mnt/snap
umount /mnt/snap

# 步骤 5：删除快照
lvremove /dev/vg/mysql_snap
```

**特点：**
- ✅ 几乎瞬时完成
- ✅ 一致性保证
- ❌ 需要 LVM 支持
- ❌ 需要短暂锁表

### 六、备份策略设计

#### 1. 常见备份策略

**策略 1：每日全量 + Binlog**
```
周一：全量备份
周二：全量备份
...
每天：实时备份 Binlog

恢复：全量备份 + Binlog 回放
```

**策略 2：每周全量 + 每日增量 + Binlog**
```
周日：全量备份
周一：增量备份
周二：增量备份
...
每天：实时备份 Binlog

恢复：全量 + 增量 + Binlog 回放
```

**策略 3：多副本策略**
```
本地：每日全量备份（保留 7 天）
远程：同步到异地（保留 30 天）
云存储：归档到 OSS/S3（保留 1 年）
```

#### 2. 备份计划示例

```bash
#!/bin/bash
# 备份脚本：/usr/local/bin/mysql_backup.sh

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

# 全量备份
mysqldump -u root -p'password' \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --master-data=2 \
  --flush-logs \
  --all-databases | \
  gzip > $BACKUP_DIR/full_$DATE.sql.gz

# 备份 binlog
mysqladmin -u root -p'password' flush-logs
cp /var/lib/mysql/mysql-bin.* $BACKUP_DIR/binlog/

# 清理过期备份
find $BACKUP_DIR -name "full_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR/binlog -name "mysql-bin.*" -mtime +$RETENTION_DAYS -delete

# 记录日志
echo "Backup completed: $DATE" >> $BACKUP_DIR/backup.log
```

**定时任务：**
```bash
# crontab -e
# 每天凌晨 2 点执行备份
0 2 * * * /usr/local/bin/mysql_backup.sh
```

### 七、备份验证和监控

#### 1. 验证备份有效性

```bash
# 定期测试恢复

# 步骤 1：创建测试数据库
mysql -u root -p -e "CREATE DATABASE test_restore;"

# 步骤 2：恢复备份
mysql -u root -p test_restore < backup.sql

# 步骤 3：验证数据
mysql -u root -p -e "SELECT COUNT(*) FROM test_restore.users;"

# 步骤 4：清理测试数据库
mysql -u root -p -e "DROP DATABASE test_restore;"
```

#### 2. 监控备份状态

```python
import os
import time
from datetime import datetime

def check_backup_status(backup_dir, max_age_hours=25):
    """检查备份是否正常"""
    # 查找最新的备份文件
    backup_files = [f for f in os.listdir(backup_dir) if f.endswith('.sql.gz')]
    
    if not backup_files:
        send_alert("没有发现备份文件！")
        return False
    
    # 获取最新备份时间
    latest_backup = max(backup_files, key=lambda f: os.path.getmtime(os.path.join(backup_dir, f)))
    backup_time = os.path.getmtime(os.path.join(backup_dir, latest_backup))
    
    # 检查备份是否过期
    age_hours = (time.time() - backup_time) / 3600
    if age_hours > max_age_hours:
        send_alert(f"备份已过期 {age_hours:.1f} 小时！最新备份：{latest_backup}")
        return False
    
    # 检查备份文件大小
    backup_size = os.path.getsize(os.path.join(backup_dir, latest_backup))
    if backup_size < 1024:  # 小于 1KB
        send_alert(f"备份文件异常小：{latest_backup} ({backup_size} bytes)")
        return False
    
    print(f"备份正常：{latest_backup}, 大小：{backup_size/1024/1024:.2f} MB, 年龄：{age_hours:.1f} 小时")
    return True
```

### 八、最佳实践

#### 1. 3-2-1 备份原则

```
3 份数据副本：
- 原始数据
- 本地备份
- 异地备份

2 种不同介质：
- 磁盘
- 磁带/云存储

1 份离线备份：
- 防止勒索病毒
```

#### 2. 备份 checklist

- [ ] **定期执行全量备份**
- [ ] **启用 Binlog 并备份**
- [ ] **测试恢复流程**
- [ ] **监控备份状态**
- [ ] **异地备份**
- [ ] **加密敏感数据**
- [ ] **文档化恢复步骤**
- [ ] **定期演练恢复**

#### 3. 安全建议

```bash
# 加密备份文件
mysqldump -u root -p mydb | gzip | openssl enc -aes-256-cbc -salt -pass pass:your_password > backup.sql.gz.enc

# 解密恢复
openssl enc -aes-256-cbc -d -salt -pass pass:your_password < backup.sql.gz.enc | gunzip | mysql -u root -p mydb

# 限制备份文件权限
chmod 600 /backup/mysql/*.sql.gz
chown mysql:mysql /backup/mysql/*.sql.gz
```

### 九、总结

**主要备份方式：**
1. ⭐ **逻辑备份（mysqldump）**：灵活、通用
2. **物理备份（XtraBackup）**：快速、适合大库
3. **Binlog 备份**：时间点恢复
4. **其他工具**：MyDumper、LVM 快照等

**备份策略：**
- 小数据库：每日全量 + Binlog
- 中等数据库：每周全量 + 每日增量 + Binlog
- 大数据库：XtraBackup + 增量 + Binlog

**核心原则：**
1. ⭐ **定期备份**
2. **多地存储**
3. **定期验证**
4. **文档化流程**
5. **监控告警**

**选择建议：**
```
数据量 < 10GB → mysqldump
数据量 10GB-100GB → MyDumper
数据量 > 100GB → XtraBackup
需要 PITR → 必须启用 Binlog
```

**记忆要点：**
- 逻辑备份用 mysqldump
- 物理备份用 XtraBackup
- Binlog 保时间点
- 3-2-1 原则要牢记
- 定期验证不能少
- 异地备份防灾难

## 29. NULL 和 '' 的区别是什么？

**答：** NULL 和空字符串（''）在 MySQL 中是两个完全不同的概念，它们在存储、比较、索引和语义上都有显著差异。

### 一、基本概念

#### 1. NULL 的含义

```
NULL = 未知值 / 不存在 / 未定义
- 不是空字符串
- 不是 0
- 不是 false
- 表示"没有值"或"值未知"
```

**示例：**
```sql
-- 用户手机号未知
INSERT INTO users (name, phone) VALUES ('张三', NULL);

-- 用户没有填写邮箱
INSERT INTO users (name, email) VALUES ('李四', NULL);
```

#### 2. 空字符串的含义

```
'' = 空字符串
- 是一个确定的值
- 长度为 0 的字符串
- 表示"有值，但值为空"
```

**示例：**
```sql
-- 用户明确填写了空字符串
INSERT INTO users (name, phone) VALUES ('王五', '');

-- 用户邮箱为空字符串
INSERT INTO users (name, email) VALUES ('赵六', '');
```

### 二、核心区别对比

| 特性 | NULL | '' (空字符串) |
|------|------|---------------|
| **含义** | 未知/不存在 | 已知，值为空 |
| **存储空间** | 需要额外 1 bit 标记 | 不需要额外空间 |
| **比较运算** | 不能用 = 或 != | 可以用 = 或 != |
| **判断方法** | IS NULL / IS NOT NULL | = '' / != '' |
| **聚合函数** | 被忽略 | 被计算 |
| **唯一索引** | 可以有多个 NULL | 只能有一个 '' |
| **排序** | 被认为是最小值 | 正常排序 |
| **连接操作** | 结果为 NULL | 正常连接 |

### 三、存储差异

#### 1. 存储空间

```sql
-- 创建测试表
CREATE TABLE test_storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    col_null VARCHAR(100) NULL,
    col_empty VARCHAR(100) NOT NULL DEFAULT ''
);

-- 插入数据
INSERT INTO test_storage (col_null, col_empty) VALUES (NULL, '');
INSERT INTO test_storage (col_null, col_empty) VALUES ('test', 'test');

-- 查看存储大小
SELECT 
    LENGTH(col_null) AS null_length,      -- NULL: NULL
    LENGTH(col_empty) AS empty_length     -- '': 0
FROM test_storage;

-- 结果：
-- | null_length | empty_length |
-- |-------------|--------------|
-- | NULL        | 0            |  ← NULL 没有长度
-- | 4           | 4            |
```

**存储开销：**
```
InnoDB 引擎：
- NULL 值：需要 1 bit 标记位
- 空字符串：不需要额外空间

对于允许 NULL 的列：
- 每行需要额外的 NULL 标记字节
- 如果表中有很多 NULL 列，会累积占用空间
```

#### 2. 实际存储示例

```sql
-- 假设 VARCHAR(100) 字段

-- 存储 NULL
-- 实际占用：1 bit (NULL 标记)

-- 存储 ''
-- 实际占用：1 byte (长度标识) + 0 bytes (内容) = 1 byte

-- 存储 'abc'
-- 实际占用：1 byte (长度标识) + 3 bytes (内容) = 4 bytes
```

### 四、比较运算差异

#### 1. NULL 的比较

```sql
-- ❌ 错误：NULL 不能用 = 或 != 比较
SELECT * FROM users WHERE phone = NULL;      -- 返回空集
SELECT * FROM users WHERE phone != NULL;     -- 返回空集
SELECT NULL = NULL;                          -- 结果：NULL (不是 true)
SELECT NULL != NULL;                         -- 结果：NULL (不是 false)

-- ✅ 正确：使用 IS NULL 或 IS NOT NULL
SELECT * FROM users WHERE phone IS NULL;     -- 返回 phone 为 NULL 的行
SELECT * FROM users WHERE phone IS NOT NULL; -- 返回 phone 不为 NULL 的行

-- NULL 与任何值比较都是 UNKNOWN
SELECT NULL > 0;    -- NULL
SELECT NULL < 0;    -- NULL
SELECT NULL = '';   -- NULL
SELECT NULL != '';  -- NULL
```

#### 2. 空字符串的比较

```sql
-- ✅ 正常比较
SELECT * FROM users WHERE phone = '';        -- 返回 phone 为空字符串的行
SELECT * FROM users WHERE phone != '';       -- 返回 phone 不为空字符串的行
SELECT '' = '';                              -- 结果：true
SELECT '' != 'abc';                          -- 结果：true

-- 空字符串与其他值比较
SELECT '' > 0;    -- false (字符串转数字为 0)
SELECT '' < 'a';  -- true
SELECT '' = 0;    -- true (隐式转换)
```

### 五、聚合函数处理

#### 1. COUNT 函数

```sql
-- 创建测试表
CREATE TABLE test_agg (
    id INT,
    value VARCHAR(10)
);

INSERT INTO test_agg VALUES (1, NULL);
INSERT INTO test_agg VALUES (2, '');
INSERT INTO test_agg VALUES (3, 'abc');
INSERT INTO test_agg VALUES (4, NULL);

-- COUNT(*) 统计所有行
SELECT COUNT(*) FROM test_agg;  -- 结果：4

-- COUNT(column) 不统计 NULL
SELECT COUNT(value) FROM test_agg;  -- 结果：2 (排除了 2 个 NULL)

-- 空字符串会被统计
SELECT COUNT(value) FROM test_agg WHERE value = '';  -- 结果：1
```

#### 2. 其他聚合函数

```sql
-- SUM、AVG、MAX、MIN 都忽略 NULL
SELECT SUM(id) FROM test_agg;     -- 10 (1+2+3+4)
SELECT AVG(id) FROM test_agg;     -- 2.5

-- 但对字符串字段
SELECT MAX(value) FROM test_agg;  -- 'abc' (NULL 被忽略)
SELECT MIN(value) FROM test_agg;  -- '' (空字符串被认为最小)

-- GROUP BY 中的 NULL
SELECT value, COUNT(*) FROM test_agg GROUP BY value;
-- 结果：
-- | value | count |
-- |-------|-------|
-- | NULL  | 2     |  ← NULL 作为一组
-- | ''    | 1     |
-- | 'abc' | 1     |
```

### 六、索引行为差异

#### 1. 唯一索引

```sql
-- 创建唯一索引
CREATE UNIQUE INDEX idx_phone ON users(phone);

-- ✅ 可以插入多个 NULL
INSERT INTO users (name, phone) VALUES ('张三', NULL);
INSERT INTO users (name, phone) VALUES ('李四', NULL);  -- 成功

-- ❌ 不能插入多个空字符串
INSERT INTO users (name, phone) VALUES ('王五', '');
INSERT INTO users (name, phone) VALUES ('赵六', '');  -- 失败！Duplicate entry

-- 原因：
-- - NULL != NULL，所以可以有多个 NULL
-- - '' = ''，所以只能有一个空字符串
```

**注意：**
- 这是 MySQL 的行为
- SQL 标准规定唯一约束中 NULL 也应该唯一
- PostgreSQL 遵循 SQL 标准，不允许多个 NULL

#### 2. 普通索引

```sql
-- 创建普通索引
CREATE INDEX idx_phone ON users(phone);

-- NULL 和空字符串都可以被索引
EXPLAIN SELECT * FROM users WHERE phone IS NULL;
-- type: ref, key: idx_phone  ✅ 使用索引

EXPLAIN SELECT * FROM users WHERE phone = '';
-- type: ref, key: idx_phone  ✅ 使用索引
```

### 七、字符串操作差异

#### 1. 连接操作

```sql
-- CONCAT 遇到 NULL 返回 NULL
SELECT CONCAT('Hello', NULL, 'World');  -- 结果：NULL
SELECT CONCAT('Hello', '', 'World');    -- 结果：'HelloWorld'

-- 使用 IFNULL 或 COALESCE 处理
SELECT CONCAT('Hello', IFNULL(NULL, ''), 'World');  -- 'HelloWorld'
SELECT CONCAT('Hello', COALESCE(NULL, ''), 'World'); -- 'HelloWorld'
```

#### 2. 长度计算

```sql
SELECT LENGTH(NULL);    -- 结果：NULL
SELECT LENGTH('');      -- 结果：0
SELECT LENGTH('abc');   -- 结果：3

SELECT CHAR_LENGTH(NULL);  -- 结果：NULL
SELECT CHAR_LENGTH('');    -- 结果：0
```

#### 3. 其他字符串函数

```sql
-- UPPER/LOWER
SELECT UPPER(NULL);   -- NULL
SELECT UPPER('');     -- ''

-- TRIM
SELECT TRIM(NULL);    -- NULL
SELECT TRIM('');      -- ''

-- SUBSTRING
SELECT SUBSTRING(NULL, 1, 1);  -- NULL
SELECT SUBSTRING('', 1, 1);    -- ''
```

### 八、实际应用场景

#### 场景 1：用户资料

```sql
CREATE TABLE user_profile (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NULL,        -- NULL 表示未填写
    email VARCHAR(100) NULL,       -- NULL 表示未填写
    bio TEXT NOT NULL DEFAULT ''   -- '' 表示有简介但为空
);

-- 查询未填写手机的用户
SELECT * FROM user_profile WHERE phone IS NULL;

-- 查询有简介但为空的用户
SELECT * FROM user_profile WHERE bio = '';
```

**设计建议：**
- 可选字段用 NULL（表示未填写）
- 必填字段用 NOT NULL DEFAULT ''（表示有值但为空）

#### 场景 2：订单地址

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    address VARCHAR(200) NULL,      -- NULL 表示未填写地址
    remark TEXT NOT NULL DEFAULT '' -- '' 表示无备注
);

-- 查询未填写地址的订单
SELECT * FROM orders WHERE address IS NULL;

-- 查询无备注的订单
SELECT * FROM orders WHERE remark = '';
```

#### 场景 3：数据统计

```sql
-- 统计各状态的记录数
SELECT 
    COUNT(*) AS total,                          -- 总记录数
    COUNT(phone) AS has_phone,                  -- 有手机号的
    COUNT(*) - COUNT(phone) AS no_phone,        -- 无手机号的（NULL）
    SUM(CASE WHEN phone = '' THEN 1 ELSE 0 END) AS empty_phone  -- 空字符串
FROM users;
```

### 九、最佳实践

#### 1. 选择 NULL 还是空字符串？

**使用 NULL 的场景：**
```sql
-- ✅ 适合用 NULL
- 可选字段（用户未填写）
- 外键关系（可能没有关联）
- 时间字段（尚未发生）
- 数值字段（未知或未计算）

CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NULL,         -- 可选
    birthday DATE NULL,             -- 可能未知
    last_login DATETIME NULL        -- 尚未登录
);
```

**使用空字符串的场景：**
```sql
-- ✅ 适合用 ''
- 文本字段（有值但为空）
- 需要频繁查询的字段
- 避免 NULL 相关陷阱

CREATE TABLE articles (
    id INT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NOT NULL DEFAULT '',  -- 可能有摘要
    content TEXT NOT NULL                       -- 必须有内容
);
```

#### 2. 统一规范

```sql
-- ❌ 不好：混用 NULL 和 ''
SELECT * FROM users WHERE phone IS NULL OR phone = '';

-- ✅ 好：统一使用一种方式
-- 方案 1：统一用 NULL
ALTER TABLE users MODIFY phone VARCHAR(20) NULL;
UPDATE users SET phone = NULL WHERE phone = '';
SELECT * FROM users WHERE phone IS NULL;

-- 方案 2：统一用空字符串
ALTER TABLE users MODIFY phone VARCHAR(20) NOT NULL DEFAULT '';
UPDATE users SET phone = '' WHERE phone IS NULL;
SELECT * FROM users WHERE phone = '';
```

#### 3. 查询优化

```sql
-- ❌ 不好：同时检查 NULL 和 ''
SELECT * FROM users WHERE phone IS NULL OR phone = '';

-- ✅ 好：使用 COALESCE 统一处理
SELECT * FROM users WHERE COALESCE(phone, '') = '';

-- ✅ 更好：数据库设计时避免这种情况
-- 统一使用 NULL 或 ''
```

#### 4. 应用层处理

```python
# Python 示例
def get_user_phone(user):
    """获取用户手机号，统一处理 NULL 和 ''"""
    phone = user.get('phone')
    
    # 将 NULL 和 '' 都视为无手机号
    if phone is None or phone == '':
        return None
    
    return phone

# 或者在 SQL 层处理
query = """
    SELECT 
        id,
        name,
        CASE 
            WHEN phone IS NULL OR phone = '' THEN NULL
            ELSE phone
        END AS phone
    FROM users
"""
```

### 十、常见问题

#### 问题 1：NOT NULL 字段插入 NULL

```sql
CREATE TABLE test (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- ❌ 错误
INSERT INTO test (id, name) VALUES (1, NULL);
-- ERROR: Column 'name' cannot be null

-- ✅ 正确
INSERT INTO test (id, name) VALUES (1, '');
```

#### 问题 2：默认值设置

```sql
-- ❌ 不好：默认值为 NULL
CREATE TABLE users (
    phone VARCHAR(20) DEFAULT NULL
);

-- ✅ 好：明确指定默认值
CREATE TABLE users (
    phone VARCHAR(20) NULL DEFAULT NULL,          -- 允许 NULL，默认 NULL
    email VARCHAR(100) NOT NULL DEFAULT ''        -- 不允许 NULL，默认空字符串
);
```

#### 问题 3：JSON 数据处理

```sql
-- JSON 中的 null 和空字符串
SELECT JSON_EXTRACT('{"phone": null}', '$.phone');   -- null
SELECT JSON_EXTRACT('{"phone": ""}', '$.phone');     -- ""

-- 在应用中需要区分
import json
data = json.loads('{"phone": null}')
if data['phone'] is None:  # Python 的 None 对应 JSON 的 null
    print("Phone is null")
```

### 十一、总结

**核心区别：**
- **NULL**：未知值，需要用 IS NULL 判断
- **''**：空字符串，是确定的值，用 = '' 判断

**主要差异：**
1. ⭐ **语义不同**：NULL=未知，''=已知但为空
2. **存储不同**：NULL 需要额外标记位
3. **比较不同**：NULL 不能用 =，'' 可以
4. **索引不同**：唯一索引允许多个 NULL，只允许一个 ''
5. **聚合不同**：COUNT 忽略 NULL，包含 ''

**最佳实践：**
1. ⭐ **根据业务语义选择**
2. **保持统一规范**
3. **避免混用 NULL 和 ''**
4. **查询时使用正确的判断方式**
5. **考虑性能和索引影响**

**选择建议：**
```
可选字段 → 用 NULL（表示未填写）
必填字段 → 用 NOT NULL DEFAULT ''
外键关系 → 用 NULL（可能无关联）
文本内容 → 用 ''（有内容但为空）
```

**记忆要点：**
- NULL 是未知值
- 空串是确定值
- 判断 NULL 用 IS
- 判断空串用 =
- 唯一索引要注意
- 统一规范最重要

## 30. MySQL 的 binlog 是什么？

**答：** Binlog（Binary Log，二进制日志）是 MySQL Server 层产生的日志文件，记录所有修改数据的 SQL 语句，用于主从复制和数据恢复。

### 一、Binlog 的基本概念

#### 1. 什么是 Binlog？

```
Binlog：MySQL 的二进制日志
- 记录所有修改数据的 SQL（DDL 和 DML）
- 不记录查询语句（SELECT）
- 以事件（Event）形式存储
- 用于主从复制和数据恢复
```

**特点：**
- ✅ Server 层日志（与引擎无关）
- ✅ 逻辑日志（记录 SQL 或数据变更）
- ✅ 追加写入（只增不减）
- ✅ 文件格式化（可解析）

#### 2. Binlog vs Redo Log

| 特性 | Binlog | Redo Log |
|------|--------|----------|
| **层次** | Server 层 | InnoDB 引擎层 |
| **内容** | 逻辑日志（SQL） | 物理日志（数据页修改） |
| **格式** | 文本/二进制 | 二进制 |
| **写入时机** | 事务提交时 | 事务执行过程中 |
| **循环使用** | 否（追加写入） | 是（循环覆盖） |
| **主要用途** | 主从复制、数据恢复 | 崩溃恢复（Crash-Safe） |

### 二、Binlog 的作用

#### 1. 主从复制

```
主库（Master）          从库（Slave）
    |                       |
    |-- 执行 SQL --         |
    |-- 写 Binlog --        |
    |                       |
    |---- Binlog --------->|
    |                       |-- 读取 Binlog
    |                       |-- 重放 SQL
    |                       |-- 数据同步
```

**流程：**
1. 主库执行 SQL 并写入 Binlog
2. 从库 I/O 线程读取主库 Binlog
3. 从库 SQL 线程重放 Binlog 中的事件
4. 实现数据同步

#### 2. 数据恢复

```sql
-- 场景：误删除数据，需要恢复

-- 步骤 1：恢复最近的全量备份
mysql -u root -p mydb < full_backup.sql

-- 步骤 2：使用 Binlog 恢复到故障前
mysqlbinlog --stop-datetime="2024-01-15 10:30:00" \
  mysql-bin.000001 \
  mysql-bin.000002 | \
  mysql -u root -p mydb

-- 实现时间点恢复（PITR：Point-In-Time Recovery）
```

#### 3. 审计和监控

```bash
# 查看数据库的所有修改操作
mysqlbinlog mysql-bin.000001 | grep "UPDATE\|DELETE\|INSERT"

# 分析特定用户的操作
mysqlbinlog mysql-bin.000001 | grep "user@host"
```

### 三、Binlog 的配置

#### 1. 开启 Binlog

```ini
# my.cnf 配置
[mysqld]
# 开启 Binlog
log-bin = mysql-bin

# Binlog 格式（推荐 ROW）
binlog-format = ROW

# Server ID（主从复制必需）
server-id = 1

# Binlog 文件保留天数
expire_logs_days = 7

# 单个 Binlog 文件最大大小
max_binlog_size = 100M

# Binlog 缓存大小
binlog_cache_size = 4M
```

#### 2. 查看 Binlog 状态

```sql
-- 查看是否开启 Binlog
SHOW VARIABLES LIKE 'log_bin';
-- Value: ON

-- 查看 Binlog 格式
SHOW VARIABLES LIKE 'binlog_format';
-- Value: ROW

-- 查看当前 Binlog 文件
SHOW MASTER STATUS;
-- +------------------+----------+--------------+------------------+
-- | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
-- +------------------+----------+--------------+------------------+
-- | mysql-bin.000001 |     1234 |              |                  |
-- +------------------+----------+--------------+------------------+

-- 查看所有 Binlog 文件
SHOW BINARY LOGS;
-- +------------------+-----------+
-- | Log_name         | File_size |
-- +------------------+-----------+
-- | mysql-bin.000001 |   1048576 |
-- | mysql-bin.000002 |    524288 |
-- +------------------+-----------+
```

### 四、Binlog 的三种格式

#### 1. STATEMENT 格式

```sql
-- 记录执行的 SQL 语句

-- 原始 SQL
UPDATE users SET age = age + 1 WHERE id > 100;

-- Binlog 中记录
# at 1234
#240115 10:30:45 server id 1  end_log_pos 1345
UPDATE users SET age = age + 1 WHERE id > 100;
```

**优点：**
- ✅ 日志量小
- ✅ 可读性强

**缺点：**
- ❌ 某些函数不确定（NOW()、RAND()、UUID()）
- ❌ 可能导致主从不一致

**示例问题：**
```sql
-- 主库执行
UPDATE users SET create_time = NOW() WHERE id = 1;

-- 从库重放时，NOW() 的值可能不同
-- 导致主从数据不一致！
```

#### 2. ROW 格式（推荐）

```sql
-- 记录数据行的变更

-- 原始 SQL
UPDATE users SET age = 25 WHERE id = 1;

-- Binlog 中记录
# at 1234
#240115 10:30:45 server id 1  end_log_pos 1345
### UPDATE `mydb`.`users`
### WHERE
###   @1=1  /* id */
###   @2='张三'  /* name */
###   @3=20  /* age */
### SET
###   @1=1  /* id */
###   @2='张三'  /* name */
###   @3=25  /* age */
```

**优点：**
- ✅ 数据一致性高
- ✅ 不受函数影响
- ✅ 可以精确恢复

**缺点：**
- ❌ 日志量大（特别是批量更新）
- ❌ 可读性差

**示例：**
```sql
-- 批量更新 1000 行
UPDATE users SET status = 1 WHERE create_time < '2024-01-01';

-- ROW 格式会记录 1000 行的变更前后的数据
-- 日志量可能是 STATEMENT 的几十倍
```

#### 3. MIXED 格式

```
MIXED = STATEMENT + ROW
- 默认使用 STATEMENT
- 遇到不安全语句时自动切换为 ROW

不安全语句包括：
- 包含不确定函数（NOW()、RAND()、UUID()）
- 使用 AUTO_INCREMENT
- 使用临时表
```

**优点：**
- ✅ 兼顾性能和安全性
- ✅ 自动选择合适格式

**缺点：**
- ⚠️ 行为不可预测
- ⚠️ 调试困难

#### 4. 格式对比

| 特性 | STATEMENT | ROW | MIXED |
|------|-----------|-----|-------|
| **日志量** | 小 | 大 | 中等 |
| **一致性** | 低 | 高 | 高 |
| **可读性** | 好 | 差 | 一般 |
| **性能** | 好 | 一般 | 好 |
| **推荐度** | ❌ | ✅ | ⚠️ |

**建议：**
- ⭐ **生产环境使用 ROW 格式**
- 确保数据一致性
- 配合 binlog_row_image 优化

### 五、Binlog 的管理

#### 1. 刷新 Binlog

```sql
-- 手动刷新（生成新的 Binlog 文件）
FLUSH LOGS;
-- 或
mysqladmin -u root -p flush-logs

-- 作用：
-- 1. 关闭当前 Binlog 文件
-- 2. 创建新的 Binlog 文件
-- 3. 便于管理和归档
```

#### 2. 清理 Binlog

```sql
-- 删除指定日期之前的 Binlog
PURGE BINARY LOGS BEFORE '2024-01-01 00:00:00';

-- 删除指定文件之前的 Binlog
PURGE BINARY LOGS TO 'mysql-bin.000010';

-- 自动清理（配置 expire_logs_days）
SET GLOBAL expire_logs_days = 7;  -- 保留 7 天

-- ⚠️ 注意：不要手动删除 Binlog 文件
-- rm mysql-bin.000001  ← 错误！
```

#### 3. 查看 Binlog 内容

```bash
# 使用 mysqlbinlog 工具

# 查看整个文件
mysqlbinlog mysql-bin.000001

# 查看指定位置
mysqlbinlog --start-position=1234 --stop-position=5678 mysql-bin.000001

# 查看指定时间
mysqlbinlog --start-datetime="2024-01-15 10:00:00" \
  --stop-datetime="2024-01-15 12:00:00" \
  mysql-bin.000001

# 解码为可读格式
mysqlbinlog -v mysql-bin.000001

# 输出到文件
mysqlbinlog mysql-bin.000001 > binlog.txt
```

**输出示例：**
```
# at 1234
#240115 10:30:45 server id 1  end_log_pos 1345 CRC32 0x12345678
# Query	thread_id=1	exec_time=0	error_code=0
SET TIMESTAMP=1705312245/*!*/;
UPDATE users SET age = 25 WHERE id = 1
/*!*/;
```

### 六、Binlog 的事件类型

#### 1. 常见事件类型

```sql
-- FORMAT_DESCRIPTION_EVENT：描述 Binlog 格式
-- ROTATE_EVENT：切换到新的 Binlog 文件
-- QUERY_EVENT：执行 SQL 语句
-- XID_EVENT：事务提交
-- TABLE_MAP_EVENT：表映射（ROW 格式）
-- WRITE_ROWS_EVENT：插入行（ROW 格式）
-- UPDATE_ROWS_EVENT：更新行（ROW 格式）
-- DELETE_ROWS_EVENT：删除行（ROW 格式）
```

#### 2. 事务在 Binlog 中的表示

```sql
-- 原始事务
START TRANSACTION;
UPDATE users SET age = 25 WHERE id = 1;
UPDATE users SET age = 30 WHERE id = 2;
COMMIT;

-- Binlog 中的事件序列
BEGIN                    -- QUERY_EVENT
UPDATE users ...         -- QUERY_EVENT 或 ROW_EVENT
UPDATE users ...         -- QUERY_EVENT 或 ROW_EVENT
XID                      -- XID_EVENT（事务提交标记）
```

### 七、Binlog 与主从复制

#### 1. 主从复制流程

```
主库：
1. 执行 SQL
2. 写入 Binlog
3. 返回结果给客户端

从库：
1. I/O 线程连接主库
2. 读取 Binlog 到 Relay Log
3. SQL 线程读取 Relay Log
4. 重放 SQL
5. 数据同步完成
```

#### 2. 配置主从复制

```sql
-- 主库配置
[mysqld]
log-bin = mysql-bin
server-id = 1
binlog-format = ROW

-- 创建复制用户
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- 查看主库状态
SHOW MASTER STATUS;
-- File: mysql-bin.000001
-- Position: 1234

-- 从库配置
[mysqld]
server-id = 2

-- 配置主从连接
CHANGE MASTER TO
  MASTER_HOST='master_ip',
  MASTER_USER='repl',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=1234;

-- 启动从库
START SLAVE;

-- 查看从库状态
SHOW SLAVE STATUS\G
-- Slave_IO_Running: Yes
-- Slave_SQL_Running: Yes
```

### 八、Binlog 的性能优化

#### 1. 调整 Binlog 缓存

```ini
# my.cnf
[mysqld]
# Binlog 缓存大小（每个会话）
binlog_cache_size = 4M

# 最大 Binlog 缓存大小
max_binlog_cache_size = 1G

# 监控缓存使用情况
SHOW STATUS LIKE 'Binlog_cache%';
-- Binlog_cache_use: 使用缓存的次数
-- Binlog_cache_disk_use: 使用磁盘的次数（应该为 0）
```

#### 2. 组提交（Group Commit）

```ini
# my.cnf
[mysqld]
# 控制组提交行为
binlog_group_commit_sync_delay = 0
binlog_group_commit_sync_no_delay_count = 0

# MySQL 5.6+ 自动启用组提交
# 多个事务的 Binlog 一起刷盘，提高性能
```

#### 3. 并行复制

```sql
-- 从库配置并行复制（MySQL 5.6+）
[mysqld]
slave_parallel_workers = 4  -- 4 个并行线程
slave_parallel_type = LOGICAL_CLOCK

-- 提高从库回放速度
```

#### 4. 优化 ROW 格式日志量

```ini
# my.cnf
[mysqld]
# 只记录被修改的列（MySQL 5.6+）
binlog_row_image = MINIMAL

# 选项：
# FULL：记录所有列（默认）
# MINIMAL：只记录主键和修改的列
# NOBLOB：不记录 BLOB/TEXT 列
```

**效果：**
```
FULL：UPDATE users SET age = 25 WHERE id = 1
- 记录：id, name, age, email, phone... （所有列）

MINIMAL：UPDATE users SET age = 25 WHERE id = 1
- 记录：id（主键）, age（修改的列）

日志量减少：50-80%
```

### 九、常见问题

#### 问题 1：Binlog 文件过大

```bash
# 原因：未设置过期时间或日志量大

# 解决 1：设置自动清理
SET GLOBAL expire_logs_days = 7;

# 解决 2：手动清理
PURGE BINARY LOGS BEFORE '2024-01-01';

# 解决 3：使用 ROW 格式时优化
binlog_row_image = MINIMAL
```

#### 问题 2：主从延迟

```sql
-- 查看从库延迟
SHOW SLAVE STATUS\G
-- Seconds_Behind_Master: 100  ← 延迟 100 秒

-- 原因：
-- 1. 主库写入压力大
-- 2. 从库硬件性能差
-- 3. 大事务导致阻塞

-- 解决：
-- 1. 增加从库并行复制线程
slave_parallel_workers = 8

-- 2. 优化大事务
-- 将大事务拆分为小事务

-- 3. 提升从库硬件
```

#### 问题 3：Binlog 损坏

```bash
# 检查 Binlog 完整性
mysqlbinlog mysql-bin.000001 > /dev/null

# 如果损坏，尝试修复
# 1. 从备份恢复
# 2. 跳过损坏的事件（谨慎使用）

# 预防：
-- 定期备份 Binlog
-- 使用 RAID 保护磁盘
-- 监控磁盘健康
```

### 十、最佳实践

#### 1. 生产环境配置

```ini
[mysqld]
# 必须开启
log-bin = mysql-bin
binlog-format = ROW
server-id = 1

# 保留策略
expire_logs_days = 7
max_binlog_size = 100M

# 性能优化
binlog_cache_size = 4M
binlog_row_image = MINIMAL
sync_binlog = 1  # 每次提交都刷盘（最安全）

# 可选：压缩
# binlog_checksum = CRC32
```

#### 2. 监控建议

```sql
-- 监控 Binlog 文件大小
SHOW BINARY LOGS;

-- 监控主从状态
SHOW SLAVE STATUS\G

-- 监控 Binlog 缓存
SHOW STATUS LIKE 'Binlog_cache%';

-- 告警阈值：
-- Binlog 文件总大小 > 50GB
-- 主从延迟 > 60 秒
-- Binlog_cache_disk_use > 0
```

#### 3. 备份策略

```bash
#!/bin/bash
# 每日备份 Binlog

BACKUP_DIR="/backup/binlog"
DATE=$(date +%Y%m%d)

# 刷新 Binlog
mysqladmin -u root -p flush-logs

# 复制昨天的 Binlog
cp /var/lib/mysql/mysql-bin.$(date -d yesterday +%Y%m%d)* $BACKUP_DIR/

# 压缩
gzip $BACKUP_DIR/mysql-bin.*

# 上传到云存储
aws s3 cp $BACKUP_DIR/ s3://my-backup/binlog/$DATE/
```

### 十一、总结

**Binlog 的核心作用：**
1. ⭐ **主从复制**：实现数据同步
2. **数据恢复**：时间点恢复（PITR）
3. **审计监控**：记录所有数据变更

**三种格式对比：**
- **STATEMENT**：日志量小，但可能不一致
- **ROW**：一致性好，推荐生产使用
- **MIXED**：自动切换，行为不可预测

**最佳实践：**
1. ⭐ **生产环境使用 ROW 格式**
2. **设置合理的保留策略**
3. **定期备份 Binlog**
4. **监控主从延迟**
5. **优化 binlog_row_image**
6. **启用组提交提高性能**

**关键配置：**
```ini
log-bin = mysql-bin
binlog-format = ROW
expire_logs_days = 7
binlog_row_image = MINIMAL
sync_binlog = 1
```

**记忆要点：**
- Binlog 记修改
- ROW 格式最安全
- 主从复制靠它传
- 数据恢复也能干
- 定期清理不能忘
- 监控延迟保同步