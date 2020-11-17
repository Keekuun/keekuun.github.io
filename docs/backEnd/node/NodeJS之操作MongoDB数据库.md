---
title: 【Node】NodeJS之操作MongoDB数据库
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
- MongoDB
---

# NodeJS之操作MongoDB数据库

## 1.SQL与NOSQL

**SQL**：_Structure Query Language_，结构性查询语言，使用SQL的数据库如：MySQL、SQLite、Oracle等(传统关系型数据库，使用行和列来存储数据，类似excel)。

**NOSQL**：不使用SQL的数据库，如：MongoDB（以 JSON 或 XML 格式存储数据）、Redis、LevelDB等（非关系型分布式数据库）

### 1.1 SQL的ACID

**ACID — 数据库事务正确执行的四个基本要素**

|       | 名称                  | 说明                                                         |
| ----- | --------------------- | ------------------------------------------------------------ |
| **A** | 原子性（Atomicity）   | 一个事务中的所有操作，要么全部完成，要么全部不完成，不会在中间某个环节结束。事务在执行过程中发生错误，会被回滚到事务开始前的状态，就像这个事务从来没有执行过一样。 |
| **C** | 一致性（Consistency） | 在事务开始之前和事务结束以后，数据的数据的一致性约束没有被破坏。 |
| **I** | 隔离性（Isolation）   | 数据库允许多个并发事务同时对数据进行读写和修改的能力。隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。。 |
| **D** | 持久性（Durability）  | 事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。 |

### 1.2 NOSQL（Not Only SQL）的优缺点

**解决关系型数据库无法存储数据结构的问题**

优点如下：

+ **高效的储存空间利用率**
+ **查询效率高**
+ **适合做聚合操作**
+ **适合大量的数据而不是小数据**

缺点如下：

- 不适合扫描小量数据
- 不适合随机的更新
- 不适合做含有删除和更新的实时操作
- 单行的数据是ACID的，多行的事务时，不支持事务的正常回滚，支持 I(Isolation)隔离性(事务串行提交)，D(Durability)持久性，不能保证 A(Atomicity)原子性， C(Consistency)一致性

## 2. MongoDB使用

MongoDB 将数据存储为一个文档（Document）。MongoDB是一个基于分布式文件存储的数据库。

[安装MongoDB](https://mongoing.com/archives/docs/mongodb%e4%b8%ad%e6%96%87%e7%94%a8%e6%88%b7%e6%89%8b%e5%86%8c%ef%bc%88version-4-2%ef%bc%89/mongodb%e5%ae%89%e8%a3%85/%e5%9c%a8windows%e4%b8%8a%e5%ae%89%e8%a3%85%e7%a4%be%e5%8c%ba%e7%89%88mongodb)

### 2.0 连接

```sh
# 开机
> mongod --dbpath C:\mongo
# 进入repl
> mongo

# 显示数据库
> show dbs
# 显示当前数据库
> db
# 连接表
> use test
```

### 2.1 增insert

`db.COLLECTION_NAME.insert(document)`

```sh
# 新建数据库（切换数据库）
use test
# 新建collection,并插入一document
db.student.insert({name: 'zkk'},{name: 'zzz'})
```

### 2.2 删drop、remove

`db.collection.remove(query,justOne)`

```sh
# 删除当前数据库
db.dropDatabase()
# 删除collection
db.student.drop()
# 删除一个document
db.student.remove({'name': 'zkk'}, {justOne: true})
# 删除所有documents
db.db.student.remove({})
```

### 2.3 改update

`db.collection.update( criteria, objNew, upsert, multi )`

update()函数接受以下四个参数：

- **criteria** : update的查询条件，类似sql update查询内where后面的。

- **objNew** : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的

- **upsert** : 这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。

- **multi** : mongodb默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。

  ```sh
  # 更改字段(默认一条，multi更新多条)
  db.student.update({'age': {$gte: 18}}, {$set: {'desc': 'adult'}}, {multi: true})
  ```

  

```sh
# 拷贝数据库
db.copyDatabase('oldTest', 'newTest')

# 1.改collection名
db.student.renameCollection('teacher')
# 2.改collection名
db.runCommand({renameCollection: 'test.student', to: 'test.teacher'})
```



### 2.4 查find

#### 2.4.1 一般查询find

```sh
# 查看所有库
show dbs

# 查看当前库下的所有表
show collections

# 查当前表字段,并格式化
db.student.find({}).petty()

# 查看一条
db.student.findOne()
```

#### 2.4.2条件查询 $gt

MongoDB中条件操作符有：

- (>) 大于 - $gt
- (<) 小于 - $lt
- (>=) 大于等于 - $gte
- (<= ) 小于等于 - $lte

```sh
# 条件查询
db.student.find({'name':'zkk'})
# or查询
db.student.find($or: [{'name':'zkk'},{'name':'zzz'}])
# 大于$gt 小于$lt 大于等于$gte 小于等于$lte
# > 18
db.student.find({'age': {$gt: 18}}) 
# < 18
db.student.find({'age': {$lt: 18}}) 
# >=18
db.student.find({'age': {$gte: 18}}) 
# [18, 36]
db.student.find({'age': {$gte: 18, $lte: 36}}) 
```

#### 2.4.3 分页查询limit、skip

```sh
# 查前n条
db.student.find().limit(n)

# 查从第m+1后开始的n条 --- 分页查询
db.student.find().limit(n).skip(m)
```

#### 2.4.4 排序查询sort

`db.COLLECTION_NAME.find().sort({KEY:1})`

```sh
# 按key升序查询 1   降序 -1
db.student.find().sort({age: 1})
```

#### 2.4.5 正则查询$regex

option的值包含：

- i(不区分大小写)，
- m(当使用^与$符号模糊匹配时，作用于屏蔽中间的换行符) ,
- x(忽略注释，以#开头 /n结尾)，
- s(允许所有字符包括换行符参与模糊匹配)

```sh
db.student.find({'name': {$regex: '/[a-z]/', $options: '$i'}})
```

#### 2.4.6 聚合查询aggregate

`db.COLLECTION_NAME.aggregate(AGGREGATE_OPERATION)`

集合中的数据如下：

```
{
   _id: ObjectId(7df78ad8902c)
   title: 'MongoDB Overview', 
   description: 'MongoDB is no sql database',
   by_user: 'w3cschool.cn',
   url: 'http://www.w3cschool.cn',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 100
},
{
   _id: ObjectId(7df78ad8902d)
   title: 'NoSQL Overview', 
   description: 'No sql database is very fast',
   by_user: 'w3cschool.cn',
   url: 'http://www.w3cschool.cn',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 10
},
{
   _id: ObjectId(7df78ad8902e)
   title: 'Neo4j Overview', 
   description: 'Neo4j is no sql database',
   by_user: 'Neo4j',
   url: 'http://www.neo4j.com',
   tags: ['neo4j', 'database', 'NoSQL'],
   likes: 750
},
```

现在我们通过以上集合计算每个作者所写的文章数，使用aggregate()计算结果如下：

```
> db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])
{
   "result" : [
      {
         "_id" : "w3cschool.cn",
         "num_tutorial" : 2
      },
      {
         "_id" : "Neo4j",
         "num_tutorial" : 1
      }
   ],
   "ok" : 1
}
>
```

以上实例类似sql语句： *select by_user, count(\*) from mycol group by by_user*

在上面的例子中，我们通过字段by_user字段对数据进行分组，并计算by_user字段相同值的总和。

下表展示了一些聚合的表达式:

| 表达式      | 描述                                           | 实例                                                         |
| :---------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `$sum`      | 计算总和。                                     | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}])` |
| `$avg`      | 计算平均值                                     | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])` |
| `$min`      | 获取集合中所有文档对应值得最小值。             | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}])` |
| `$max`      | 获取集合中所有文档对应值得最大值。             | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}])` |
| `$push`     | 在结果文档中插入值到一个数组中。               | `db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])` |
| `$addToSet` | 在结果文档中插入值到一个数组中，但不创建副本。 | `db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])` |
| `$first`    | 根据资源文档的排序获取第一个文档数据。         | `db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])` |
| `$last`     | 根据资源文档的排序获取最后一个文档数据         | `db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])` |

### 2.5 建立索引

建立索引之后可以增快检索速度。

+ 查看检索的详情

```sh
# 查看检索的详情步骤
db.student.find({'name':'zkk'}).explain()
```

+ 创建一个单键索引：在某个集合上只查询某个单键

  `db.student.createIndex({key: 1}, {unique: true});`：1-正向索引 -1-负向索引。`unique`设为true，表示唯一索引，不能重复。

```sh
db.student.createIndex({'name': 1});  

# 输出
{
    'createdCollectionAutomatically': false,
    'numIndexesBefore': 1,
    'numIndexesAfter': 2,
    'OK': 1
}
```

+ 创建复合索引：需要查询某个键，而有时又需要查询同样的键和额外的键

```sh
db.products.createIndex( { "category": 1, "item": 1 } )
```

> [索引参考](https://mongoing.com/docs/reference/indexes.html)

## 3. NodeJS操作MongoDB

> [MongoDB Node.js Driver Documentation](http://mongodb.github.io/node-mongodb-native/3.6/)

### 3.1 安装

```sh
npm install mongodb --save
```

### 3.2 连接数据库

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
```

### 3.3 CURD操作

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';
const client = new MongoClient(url, {useNewUrlParser: true});

// Use connect method to connect to the server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  insertDocuments(db, function() {
    findDocuments(db, function() {
      client.close();
    });
    updateDocument(db, function() {
      removeDocument(db, function() {
        client.close();
      });
    });
  });
});


// insert方法
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

// find方法
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

// update方法
const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

// remove方法
const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}
```



## 4.使用Mogoose框架

Mogoose是一个将Javascript对象与数据库产生关系的一个框架，ORM（object relation model）。使得操作对象，就是操作数据库了，对象产生了，同时也持久化了。

```js
const mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
// 定义Schema
const catSchema = { name: String };
// 创建一个模型，有属性 name
const Cat = mongoose.model('Cat', catSchema);
// 实例化Cat
const kitty = new Cat({ name: 'Zildjian' });
// 调用save之后就会保存进数据库中
kitty.save().then(() => console.log('meow'));
```

上面的代码，没有一句是明显的数据库操作，体验全是操作类（创建类、实例化类、调用类的方法），但是数据库持久了。**mongoose的设计哲学：操作对象的形式来操作数据库**

+ `Schema.methods`对象直接保存实例

```js
// 实例方法
// 在catSchema的methods对象上分配实例方法
catSchema.methods.say = function() {}
```

+ `Schema.statics`对象直接保存静态方法

```js
// 创建静态方法
// 在catSchema的statics对象上分配一个静态方法
catSchema.statics.haha = function() {}
```



<iframe src="https://mongoose.kkfor.com/guides.html" height="600px" width="100%" />

## 5. 参考文档

+ [NoSQL 还是 SQL ？这一篇讲清楚](https://juejin.im/post/5b6d62ddf265da0f491bd200#heading-2)
+ [数据库常见面试题(开发者篇)](https://juejin.im/post/5a9ca0d6518825555c1d1acd)
+ [MongoDB中文用户手册（Version 4.2）](https://mongoing.com/archives/docs/mongodb%e4%b8%ad%e6%96%87%e7%94%a8%e6%88%b7%e6%89%8b%e5%86%8c%ef%bc%88version-4-2%ef%bc%89/mongodb%e5%ae%89%e8%a3%85/%e5%9c%a8windows%e4%b8%8a%e5%ae%89%e8%a3%85%e7%a4%be%e5%8c%ba%e7%89%88mongodb)
+ [mongoose5.2.8中文文档](https://mongoose.kkfor.com/quickstart.html)
+ [mongoosejs英文官网](https://mongoosejs.com/)
