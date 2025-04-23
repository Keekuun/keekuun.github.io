---
title: nestjs 联接postgresql
date: 2025-4-21
categories:
  - 后端
  - nestjs
tags:
  - nestjs
  - node
  - postgresql
---

## 使用 typeorm 连接 postgresql
1. 安装依赖
```bash 
npm install --save @nestjs/typeorm typeorm pg
```
2. 增加`TypeOrmModule`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import {TypeOrmModule} from "@nestjs/typeorm";

const PostgresqlModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '123456',
  database: 'nestjs',
  entities: [],
  synchronize: true,
});

@Module({
  imports: [
    PostgresqlModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

3. 创建 Entity

```ts
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn} from "typeorm";

@Entity()
export class Article {
  // 文章id
  @PrimaryGeneratedColumn()
  id: number;
  // 文章标题
  @Column('text')
  title: string;
  // 文章描述
  @Column('text')
  description: string;
  // 文章内容
  @Column('text')
  content: string;

  // 创建时间
  @CreateDateColumn()
  createTime: Date;
  
  // 更新时间
  @UpdateDateColumn()
  updateTime: Date;
  
  // 是否删除
  @Column({default: false})
  isDeleted: boolean;
  // 版本控制
  @VersionColumn()
  version: number;
}
```

4. 创建 Module
```ts
import {Module} from '@nestjs/common';
import {ArticleService} from './article.service';
import {ArticleController} from './article.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Article} from "./entities/article.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {
}

```

5. 创建 Service
```ts 
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    console.log('ArticleService init');
  }

  findAll() {
    return this.articleRepository.find();
  }

  findOne(id: number) {
    return this.articleRepository.findOneBy(id);
  }
}
```

> https://www.slingacademy.com/article/how-to-connect-to-postgresql-in-nestjs/

> https://typeorm.io/
