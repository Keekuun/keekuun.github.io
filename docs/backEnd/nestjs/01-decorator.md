---
title: nestjs基础之装饰器
date: 2025-3-6
categories:
    - 后端
    - nestjs
tags:
    - nestjs
    - node
    - ES6
---

## 装饰器简介
ES2016 装饰器是一个返回**函数**的表达式，可以接受目标、名称和属性描述符作为参数。您通过在装饰器前加上 @ 字符并放置在您要装饰的内容顶部来应用它。装饰器可以为类、方法或属性定义。

**装饰器本质就是函数**，主要用于:

+ 装饰类：
```js
@annotation
class MyClass { }

function annotation(target, name, descriptor) {
   target.annotated = true;
}
```

+ 装饰方法或属性
```js
class MyClass {
  @readonly
  method() { }
}

function readonly(target, name, descriptor) {
   // descriptor对象原来的值如下
   // {
   //   value: specifiedFunction,
   //   enumerable: false,
   //   configurable: true,
   //   writable: true
   // };
   descriptor.writable = false;
   return descriptor;
}
```

1. `readonly`装饰器接收三个参数：`target`，`name`，和`descriptor`。
2. `target`是类的原型对象，`name`是方法的名称，`descriptor`是该方法的属性描述符对象。
3. 在装饰器函数中，将`descriptor.writable`设置为`false`，这将禁止对方法进行写操作，使其成为只读方法。
4. 返回修改后的属性描述符对象`descriptor`。

Nest 就是围绕**装饰器**的语言特性构建的。

## 装饰器类别
装饰器主要分为：
+ **类装饰器**：应用于类声明之前，用于修改类的行为或元数据。
1. 作用对象：类（classes）
2. 促发时机：在类实例化前执行（实例化阶段）
3. 典型用途：
    - 自动注册
    - 自动注入
    - 自动加载

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';

// 类装饰器
@Module({
    controllers: [CatsController]
})
export class CatsModule {}
```

+ **方法装饰器**：应用于方法声明之前，用于修改方法的行为或元数据。
1. 作用对象：方法（methods）
2. 促发时机：在方法执行前执行（非实例化阶段）
3. 典型用途：
   - 权限验证
   - 缓存
   - 请求拦截
   - 请求日志
   - 请求限流

```ts
import { Controller, Get } from '@nestjs/common';
@Controller('cats')
export class CatsController {
    // 方法装饰器
    @Get()
    findAll() {}
}
```
+ **参数装饰器**：应用于方法参数声明之前，用于修改参数的行为或元数据。
1. 作用对象：方法参数（method parameters）
2. 促发时机：在方法执行前执行（非实例化阶段）
3. 典型用途：
   - 参数验证
   - 参数转换
   - OpenAPI/Swagger 文档生成

```ts
import { Controller, Get, Param } from '@nestjs/common';
@Controller('cats')
export class CatsController {
    // @Param: 参数装饰器
    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #${id} cat`;
    }
}
```


+ **属性装饰器**：应用于属性声明之前，用于修改属性的行为或元数据。
1. 作用对象：类属性（class properties）
2. 触发时机：在类定义时执行（非实例化阶段）
3. 典型用途：
   - 添加元数据（Metadata）
   - 参数验证
   - 属性转换
   - OpenAPI/Swagger 文档生成

```ts
import { IsString, IsInt, IsOptional } from 'class-validator';

class CreateCatDto {
    @IsString()          // 验证字符串类型
    name: string;

    @IsInt()             // 验证整型
    age: number;

    @IsOptional()        // 允许字段可选
    breed?: string;
}

```


## nestjs 常用装饰器

### 核心架构装饰器
#### 1. 模块定义
`@Module` 装饰器：用于定义一个模块。
```ts
@Module({
  imports: [OtherModule],      // 导入依赖模块
  controllers: [CatsController],
  providers: [CatsService],    // 服务/管道/守卫等
  exports: [CatsService]       // 暴露给其他模块
})
export class AppModule {}

```

#### 2. 服务标识
`@Injectable` 装饰器：用于定义一个可注入的服务类。
```ts
@Injectable()  // 标记可注入类
export class CatsService {}
```

### 控制器装饰器
`@Controller` 装饰器：用于定义一个控制器。
#### 1. 路由定义

`@Get`、`@Post`、`@Put` 等 HTTP 方法装饰器：用于定义路由处理方法和路由路径。
```
@Controller('cats')  // 基础路由路径
export class CatsController {
  @Get()             // GET /cats
  @Post()            // POST /cats 
  @Put(':id')        // PUT /cats/:id
  @Delete(':id')     // DELETE /cats/:id
  @Patch(':id')      // PATCH /cats/:id
  @Options()         // OPTIONS 请求
}
```

#### 2. 请求处理
```
@Header('Cache-Control', 'none')    // 设置响应头
@HttpCode(201)                      // 自定义状态码
@Render('index.html')               // 服务端渲染
@Redirect('/new-url', 301)          // 重定向
```
### 参数提取装饰器

#### 1. 请求数据获取
`@Param`、`@Query`、`@Body` 等参数装饰器：用于获取请求中的参数。

```ts
@Param('id')                 // 路由参数 → /cats/:id
@Query('page')               // 查询参数 → ?page=1
@Body()                      // 请求体 → POST/PUT
@Headers('authorization')    // 请求头
```

#### 2. 上下文对象
```
@Request() req: FastifyRequest   // 底层请求对象
@Response() res: FastifyReply    // 底层响应对象
@Ip() clientIP: string           // 客户端 IP
@HostParam() domain: string      // 主机名参数

```

### 功能增强装饰器
#### 1. 安全控制
`@UseGuards` 装饰器：用于为路由或控制器指定守卫。

```ts
@UseGuards(AuthGuard)       // 路由守卫
@Roles('admin')             // 角色控制（需自定义装饰器）
@Public()                   // 跳过身份验证（自定义）
```

#### 2. 请求处理流程
`@UseInterceptors` 装饰器：用于为路由或控制器指定拦截器。
```
@UseInterceptors(LoggingInterceptor)  // 拦截器
@UsePipes(ValidationPipe)             // 数据管道
@UseFilters(HttpExceptionFilter)      // 异常过滤器
```

### Swagger 文档装饰器
```
@ApiTags('猫咪管理')          // 接口分类
@ApiOperation({ summary: '创建猫咪' })
@ApiResponse({ status: 201, description: '成功创建' })
@ApiBody({ type: CreateCatDto })      // 请求体模型
@ApiQuery({ name: 'page', required: false })
```

### 其他装饰器
#### 1. 文件上传
```
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  @UploadedFile() file: Express.Multer.File
) {}
```

### 2. SSE 服务端推送
```
@Get('stream')
@SSE()  // 服务端事件流
streamData() {
  return new Observable(subscriber => {
    subscriber.next({ data: '实时数据' });
  });
}
```

### 总结
Nest框架的装饰器可以分为以下三类：**核心类装饰器**、**HTTP类装饰器**和**模块类装饰器**。


#### 1.核心类装饰器：

+ `@Module()`：用于标识一个类作为Nest模块，用于组织应用程序中的组件。
+ `@Controller()`：用于标识一个类作为Nest控制器，负责处理传入的HTTP请求。
+ `@Injectable()`：用于标识一个类作为Nest提供者，用于实例化和管理应用程序的依赖项。
+ `@Middleware()`：用于标识一个类作为Nest中间件，用于处理HTTP请求和响应的中间操作。
+ `@Guard()`：用于标识一个类作为Nest守卫，用于执行身份验证和授权逻辑的中间件。


#### 2.HTTP类装饰器：

+ `@Get()`、`@Post()`、`@Put()`、`@Delete()`等：用于标识控制器中的方法作为特定HTTP请求方法的处理程序。
+ `@Param()`、`@Query()`、`@Body()`等：用于标识控制器方法中的参数来源，从URL路径参数、查询参数和请求体中提取值。
+ `@Render()`：用于标识控制器方法返回视图模板的装饰器。

#### 3.模块类装饰器：
+ `@Imports()`：用于在模块中导入其他模块。
+ `@Providers()`：用于在模块中定义提供者，以供依赖注入使用。
+ `@Controllers()`：用于在模块中定义控制器。
+ `@Exports()`：用于将模块中的提供者暴露给其他模块。
+ `@Global()`：用于标识一个模块为全局模块，使得其提供者在整个应用程序中可见。

## nestjs 自定义装饰器

### 版本化路由装饰器
+ 基础版
```ts
import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

// 创建可复用的版本装饰器工厂
export function ApiVersion(version: string, tag?: string) {
  return applyDecorators(
    Controller({ path: `v${version}`, version }), // 路径和版本号双保险
    ApiTags(tag || `V${version} 版本`),          // Swagger 分类
    ApiHeader({                                  // 添加版本头说明
      name: 'X-API-Version',
      description: `当前接口版本 v${version}`
    }),
    SetMetadata('apiVersion', version)          // 存储元数据供后续使用
  );
}

// 控制器使用示例
@ApiVersion('1', '用户管理') // 路径前缀 /v1，Swagger 分类"用户管理"
export class UserControllerV1 {
   @Get('profile')
   getProfile() { /* V1 实现 */ }
}

@ApiVersion('2', '用户管理') // 路径前缀 /v2
export class UserControllerV2 {
   @Get('profile')
   getProfile() { /* V2 实现 */ }
}
```

+ 多版本共存
```ts
import {applyDecorators, Controller, SetMetadata} from '@nestjs/common';
import {ApiHeader, ApiTags} from '@nestjs/swagger';

export function ApiVersion(
    versions: string | string[],
    tag?: string
) {
    const versionArray = Array.isArray(versions) ? versions : [versions];
    const pathPrefix = `v[${versionArray.join('|')}]`; // 生成正则表达式友好路径

    return applyDecorators(
        // 使用动态路径参数捕获版本号
        Controller({path: `:apiVersion(${versionArray.join('|')})`}),

        // 存储版本元数据供全局守卫使用
        SetMetadata('supportedVersions', versionArray),

        // Swagger 文档增强
        ApiTags(tag || `Version ${versionArray.join('/')}`),
        ApiHeader({
            name: 'X-API-Version',
            description: `支持版本: ${versionArray.join(', ')}`,
            example: versionArray[0]
        }),

        // 版本路由重定向逻辑
        VersionRedirectMiddleware(versionArray)
    );
}

// 版本重定向中间件工厂
function VersionRedirectMiddleware(versions: string[]) {
    return class implements NestMiddleware {
        use(req: Request, res: Response, next: Function) {
            const versionParam = req.params.apiVersion;
            if (!versions.includes(versionParam)) {
                return res.redirect(`/v${versions[0]}${req.path}`);
            }
            req.url = req.url.replace(`/${versionParam}`, '');
            next();
        }
    };
}

// 使用示例：支持 v1 和 v2 版本
@ApiVersion(['1', '2'], '用户模块')
export class UserController {
    @Get('profile')
    @Version(['1', '2']) // 方法级别声明支持版本
    getProfile(@Param('apiVersion') version: string) {
        return version === '1' ? this.getV1Profile() : this.getV2Profile();
    }
}

// main.ts
app.enableVersioning({
   type: VersioningType.URI,
   prefix: 'v',
});
```

+ 高级版装饰器（带自动路由前缀)
```ts
import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';

export function VersionedController(modulePath: string) {
    return (version: string) =>
        applyDecorators(
            ApiVersion(version),
            Controller(`api/${modulePath}/v${version}`) // 自动生成路由前缀
        );
}

// 使用示例
@VersionedController('payments')('3') // 路径：api/payments/v3
export class PaymentControllerV3 {
    @Post()
    createPayment() { /* 支付相关逻辑 */
    }
}

```

> [ES6 系列之我们来聊聊装饰器](https://github.com/mqyqingfeng/Blog/issues/109)
