---
title: nestjs基础之class-validator
date: 2025-03-8
categories:
  - 后端
  - nestjs
tags:
  - nestjs
  - node
  - class-transformer
---

## what
`class-validator` 是一个用于验证数据的库，它允许使用基于装饰器和非装饰器的验证方式，内部使用 [validator.js](https://github.com/validatorjs/validator.js) 来执行验证，并且可以在浏览器和 Node.js 平台上使用。

+ 主要特性
  + 装饰器验证：可以使用装饰器对类的属性进行验证，方便快捷。
  + 跨平台支持：支持在浏览器和 Node.js 环境中使用。
  + 丰富的验证规则：提供了多种内置的验证规则，如 Contains、IsInt、Length、IsEmail 等。
  + 嵌套对象验证：支持对嵌套对象进行验证。
  + 自定义验证：可以创建自定义的验证类和装饰器。
  + 服务容器支持：可以使用服务容器来管理依赖。

## why [class-validator](https://github.com/typestack/class-validator)

1. **数据验证需求**  
   在 NestJS 中处理 HTTP 请求时，需要对用户输入的数据进行校验（如表单、JSON 数据），确保数据符合业务规则（例如邮箱格式、密码长度等）。

2. **类型安全增强**  
   TypeScript 的类型系统在运行时无法直接执行类型检查，`class-validator` 通过装饰器提供运行时验证能力，弥补类型系统的不足。

3. **开箱即用的验证规则**  
   提供丰富的内置验证装饰器（如 `@IsEmail`、`@MinLength`、`@IsOptional`），支持交叉验证和异步验证，减少手动编写验证逻辑的成本。

4. **与 NestJS 紧密集成**  
   可通过管道（Pipes）在控制器层自动执行验证，失败时直接抛出 `BadRequestException`，实现统一错误处理。

---

## how

1. **安装依赖**  
```bash
npm install class-validator --save
```

2. 使用 `class-validator`
```js
 import {
   validate,
   validateOrReject,
   Contains,
   IsInt,
   Length,
   IsEmail,
   IsFQDN,
   IsDate,
   Min,
   Max,
} from 'class-validator';

export class Post {
   @Length(10, 20)
   title: string;

   @Contains('hello')
   text: string;

   @IsInt()
   @Min(0)
   @Max(10)
   rating: number;

   @IsEmail()
   email: string;

   @IsFQDN()
   site: string;

   @IsDate()
   createDate: Date;
}

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

validate(post).then(errors => {
   // errors is an array of validation errors
   if (errors.length > 0) {
      console.log('validation failed. errors: ', errors);
   } else {
      console.log('validation succeed');
   }
});

validateOrReject(post).catch(errors => {
   console.log('Promise rejected (validation failed). Errors: ', errors);
});
// or
async function validateOrRejectExample(input) {
   try {
      await validateOrReject(input);
   } catch (errors) {
      console.log('Caught promise rejection (validation failed). Errors: ', errors);
   }
}
```

## 总结

`class-validator` 是一个用于数据验证的库，它提供了一组装饰器，用于在运行时验证对象属性。常用装饰器有：
- `@IsEmail()`：验证属性是否为有效的电子邮件地址。
- `@IsFQDN()`：验证属性是否为有效的 fully qualified domain name（FQDN）。
- `@IsDate()`：验证属性是否为有效的日期。
- `@IsInt()`：验证属性是否为整数。
- `@Min()`：验证属性是否大于或等于指定的最小值。
- `@Max()`：验证属性是否小于或等于指定的最大值。
- `@Length()`：验证属性的长度是否在指定的范围内。
- `@Contains()`：验证属性是否包含指定的子字符串。

## nestjs中使用class-validator
在 NestJS 中，`class-validator` 可以与控制器和管道一起使用，以实现数据验证。以下是一个示例：

`app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}    
```

`users.controller.ts`:
```ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return { message: 'User created successfully', data: createUserDto };
  }
}    
```

`create-user.dto.ts`:
```ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}
```

当传入的数据不符合验证规则时，`ValidationPipe` 会抛出一个 `BadRequestException` 异常。NestJS 会自动将这个异常转换为 HTTP 400 响应，并返回详细的验证错误信息。
