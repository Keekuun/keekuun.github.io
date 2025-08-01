---
title: nestjs基础之class-transformer
date: 2025-03-7
categories:
  - 后端
  - nestjs
tags:
  - nestjs
  - node
  - class-transformer
---

## why [class-transformer](https://github.com/typestack/class-transformer)

假设我们有一个`user.json`文件,里面有`user`数组:

```json
[
  {
    "id": 1,
    "firstName": "Johny",
    "lastName": "Cage",
    "age": 27
  },
  {
    "id": 2,
    "firstName": "Ismoil",
    "lastName": "Somoni",
    "age": 50
  },
  {
    "id": 3,
    "firstName": "Luke",
    "lastName": "Dacascos",
    "age": 12
  }
]
```

我们还有一个 `User class`类:

```ts
export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;

    constructor(id: number, firstName: string, lastName: string, age: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

    isAdult() {
        return this.age > 36 && this.age < 60;
    }
}
```

然后我们想将这个数组转换为`User class`数组，如果直接读取json文件，那么就没法使用User类的实例方法，如：`isAdult`，那么我们就需要使用
`class-transformer`这个库来转换。

```ts
import {plainToInstance} from 'class-transformer';
import path from 'node:path';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

import usersJson from "./data/user.json" with {type: 'json'};

// 获取 ESM 模式下的正确路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 JSON 文件
const rawData = readFileSync(
    path.join(__dirname, 'data/user.json'), // 注意相对路径层级
    'utf-8'
);

// const usersJson = JSON.parse(rawData);
// 将user.json数组转换为User数组
// before：
try {
    const users: User[] = JSON.parse(rawData);
    console.log(users[0]?.isAdult())
} catch (e) {
    // TypeError: users[0]?.isAdult is not a function
    console.log(e);
}

// now：
const realUsers = plainToInstance(User, usersJson);
console.log(realUsers[0].isAdult()); // false

```

## how

1. 安装依赖

```bash
npm install reflect-metadata --save # 前置依赖
npm install class-transformer --save
npm install es6-shim --save # 需要ES6支持，否则需要安装
```

2. api 方法

+ `plainToInstance`：将普通对象数组转换为`class`数组

```ts
import {plainToInstance} from 'class-transformer';

let users = plainToInstance(User, userJson); // to convert user plain object a single user. also supports arrays
```

+ `plainToClassFromExist`: 将普通对象数组转换为`class`数组，并使用`exist`对象中的属性填充`class`对象的属性

```ts
const defaultUser = new User();
defaultUser.role = 'user';

// 如果 user 对象中存在 role 属性，则使用 user 对象中的 role 属性，否则使用默认的 role 属性值， 即 ’user‘。
let mixedUser = plainToClassFromExist(defaultUser, {id: 1, firstName: 'Mike', lastName: 'Bob'}); // mixed user should have the value role = user when no value is set otherwise.
```

+ `instanceToPlain`: 实例转换为普通js对象

```ts
console.log(instanceToPlain(mixedUser))

// 普通js 对象 { id: 1, firstName: 'Mike', lastName: 'Bob', role: 'user'}
```

+ `instanceToInstance`: 实例转换为新实例， 可以理解为clone

+ `serialize`: 序列化为json格式
+ `deserialize` & `deserializeArray`: 反序列化(数组)

+ `Exclude`: 忽略属性
+ `Expose`: 显示属性

```ts
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class User {
    @Expose()
    id: number;

    @Expose()
    email: string;

    password: string;
}
```

+ `Type`: 类型转换
+ `Transform`: 数据转换 `@Transform(({ value, key, obj, type }) => value)`

```ts
import {Type} from 'class-transformer';

export class User {
    id: number;

    email: string;

    password: string;

    // 将日期字符串转换为日期对象
    @Type(() => Date)
    registrationDate: Date;

    @Type(() => Date)
    @Transform(({value}) => moment(value), {toClassOnly: true})
    date: Moment;
}
```

## 总结

`class-transformer`是一个用于类转换的库， 它提供了许多装饰器来帮助转换类实例和普通对象，如`@Exclude`、`@Expose`、`@Type`、
`@Transform`等。 通过使用这些装饰器， 我们可以轻松地将普通对象转换为类实例， 并且可以控制哪些属性被转换， 以及如何转换它们。
它还支持数组转换， 并且提供了许多其他功能， 使得类转换更加方便和灵活。
