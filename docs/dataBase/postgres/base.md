# postgres 基操

首先进入 postgres docker 容器：

```bash
# 进入容器，使用 bash （exit 退出）
docker exec -it postgres16 bash
# root 用户登录 psql （\q 退出）, 必须先登录
psql -U root
```

## 查看数据库

```bash
\l;

List of databases
    Name     | Owner | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules | Access privileges 
-------------+-------+----------+-----------------+------------+------------+------------+-----------+-------------------
 postgres    | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 root        | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 simple_bank | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 t3-demo     | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 template0   | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/root          +
             |       |          |                 |            |            |            |           | root=CTc/root
 template1   | root  | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/root          +
             |       |          |                 |            |            |            |           | root=CTc/root
(6 rows)
```

## 进入数据库

```bash
\c simple_bank;

You are now connected to database "simple_bank" as user "root".
```

## 查看数据库所有表

```bash
\dt;
             List of relations
 Schema |       Name        | Type  | Owner 
--------+-------------------+-------+-------
 public | accounts          | table | root
 public | entries           | table | root
 public | schema_migrations | table | root
 public | transfers         | table | root
(4 rows)
```

## 查看表结构

```bash
\d accounts;
                                       Table "public.accounts"
   Column   |           Type           | Collation | Nullable |               Default                
------------+--------------------------+-----------+----------+--------------------------------------
 id         | bigint                   |           | not null | nextval('accounts_id_seq'::regclass)
 owner      | character varying        |           | not null | 
 balance    | bigint                   |           | not null | 
 currency   | character varying        |           | not null | 
 created_at | timestamp with time zone |           | not null | now()
Indexes:
    "accounts_pkey" PRIMARY KEY, btree (id)
    "accounts_owner_idx" btree (owner)
Referenced by:
    TABLE "entries" CONSTRAINT "entries_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id)
    TABLE "transfers" CONSTRAINT "transfers_from_account_id_fkey" FOREIGN KEY (from_account_id) REFERENCES accounts(id)
    TABLE "transfers" CONSTRAINT "transfers_to_account_id_fkey" FOREIGN KEY (to_account_id) REFERENCES accounts(id)
```

## 创建数据库

```bash
CREATE DATABASE db_demo;
```

## 删除数据库

```bash
DROP DATABASE db_demo;
```

## 创建表

```bash
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
email VARCHAR(50),
password VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP DEFAULT NULL,
PRIMARY KEY (id),
UNIQUE (email),
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
CHECK (LENGTH(password) >= 8),
CHECK (LENGTH(name) >= 3),
CHECK (created_at <= updated_at),
CHECK (deleted_at IS NULL OR deleted_at >= created_at),
)
```

## 删除表

```bash
DROP TABLE users;
```

## 插入数据

```bash
INSERT INTO users (name, email, password) VALUES ('John Doe', 'john@example.com', 'password');
```

## 查询数据

```bash
SELECT * FROM users;
id |       name        |        email         | password | created_at | updated_at | deleted_at
----+------------------+---------------------+----------+------------+------------+------------
 1 | John Doe         | john@example.com    | password | ...
 2 | Jane Doe         | jane@example.com    | password | ...
```

## 更新数据

```bash
UPDATE users SET name = 'Jane Smith' WHERE id = 2;
```

## 删除数据

```bash
DELETE FROM users WHERE id = 2;
```

## 统计数据

```bash
SELECT COUNT(*) FROM users;
```

## 聚合数据

```bash
SELECT MAX(balance) FROM accounts;
```

## 排序数据

```bash
SELECT * FROM users ORDER BY id DESC;
```



## 退出

```bash
simple_bank=# \q;
Bye
```

