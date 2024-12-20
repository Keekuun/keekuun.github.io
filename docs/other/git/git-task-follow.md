---
title: 新分支开发工作流
sidebar: auto
date: 2018-09-20
categories:
- 其他
tags:
- Git
---

# 新分支开发工作流：

> **public** 远程公共分支
>
> **origin** fork自public的自己的远程分支
>
>
拉取最新的分支信息
```bash
git fetch public
```
## 1.拉取远程public库新分支

```bash
git checkout public/Branch-25 --track
```

## 2.将新分支推送到origin库里面，没有这个分支会自动创建

```bash
git push origin Branch-25:Branch-25
```

## 3.将本地Branch-25分支的默认push分支切换为origin Branch-25

```bash
git push --set-upstream origin Branch-25
```

## 4.缓存本地更改

```bash
git stash
```
## 5.拉去最新代码

```bash
git pull public Branch-25
```

## 6.合并代码

```bash
git stash pop
```

## 7.提交到远程

```bash
git add .
git commit -m "feat: 新增feature"
git push
```
+ commit msg类型说明：

| 类型     | 描述                                                 |
| :------- | :--------------------------------------------------- |
| feat     | 新增feature                                          |
| fix      | 修复bug                                              |
| docs     | 仅仅修改了文档，比如README，CHANGELOG,CONTRIBUTE等等 |
| styles   | 修改了空格、格式缩进、逗号等，不改变代码逻辑         |
| refactor | 代码重构，没有加新功能或者修复Bug                    |
| perf     | 优化相关，比如提升性能、体验                         |
| test     | 测试用例，包括单元测试、集成测试                     |
| chore    | 改变构建流程、或者增加依赖库、工具等                 |
| revert   | 回滚到上一个版本                                     |


> [猴子都能懂的GIT入门](https://backlog.com/git-tutorial/cn/contents/)
