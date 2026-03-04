---
title: Skills 入门指南
date: 2026-03-04
sticky: 1
isComment: true
categories: 
- AI
tags: 
- skills
---

# Skills 入门指南

> 使用 Skills 扩展 AI Agent 的能力

## 📚 目录

- [什么是 Skills](#什么是-skills)
- [为什么使用 Skills](#为什么使用-skills)
- [安装 Skills CLI](#安装-skills-cli)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [推荐 Skills](#推荐-skills)
- [管理 Skills](#管理-skills)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 什么是 Skills

**Skills** 是一个开放的生态系统，为 AI Agent（如 Claude Code）提供专业化的知识、工作流程和工具集成。

### 核心概念

- **Skill**：一个包含特定领域知识的模块化包
- **Skills CLI**：管理和安装 skills 的命令行工具（`npx skills`）
- **Skills 生态**：由社区和官方维护的 skills 仓库集合
- **全局 vs 项目级**：可以全局安装或在特定项目中安装

### Skills 的工作原理

当你安装一个 skill 后：
1. Skill 文件被复制或链接到 `~/.claude/skills/` 目录
2. Claude Code 在执行任务时自动加载相关 skills
3. Skills 提供上下文、最佳实践和代码模板
4. 帮助 AI 生成更专业、更符合标准的代码

> 现在可以安装到全局的 `~/.agent/skills`目录，可以给cursor等IDE使用
---

## 为什么使用 Skills

### 对开发者的好处

1. **提升代码质量**
   - 遵循行业最佳实践
   - 符合框架官方推荐模式
   - 减少常见错误

2. **加速开发效率**
   - 减少重复性工作
   - 快速生成样板代码
   - 自动应用设计模式

3. **降低学习曲线**
   - 快速上手新技术栈
   - 获得专家级指导
   - 了解框架深层知识

4. **保持技术更新**
   - Skills 持续更新
   - 跟随技术演进
   - 学习最新特性

### 适用场景

- 学习新的技术栈（如前端转全栈）
- 优化现有代码库
- 遵循团队规范
- 快速原型开发
- 代码审查和重构

---

## 安装 Skills CLI

Skills CLI 基于 npx，无需全局安装即可使用：

```bash
# 直接使用（推荐）
npx skills --help

# 或全局安装
npm install -g skills
```

### 验证安装

```bash
npx skills --version
```

---

## 快速开始

### 1. 搜索 Skills

**交互式搜索：**
```bash
npx skills find
```

**关键词搜索：**
```bash
npx skills find react
npx skills find golang
npx skills find api design
```

### 2. 安装 Skills

**安装单个 Skill（全局）：**
```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
```

**查看仓库中的所有 Skills：**
```bash
npx skills add vercel-labs/agent-skills -l
```

**安装特定 Skills：**
```bash
npx skills add vercel-labs/agent-skills --skill pr-review,commit -g -y
```

### 3. 查看已安装的 Skills

```bash
# 查看全局 skills
npx skills list -g

# 查看项目 skills
npx skills list
```

### 4. 使用 Skills

安装后，Claude Code 会自动在相关任务中使用这些 skills。无需额外配置！

**示例：**
- 安装 `nextjs-app-router-patterns` 后，创建 Next.js 页面时会自动应用最佳实践
- 安装 `golang-backend-development` 后，编写 Go API 时会遵循标准模式

---

## 常用命令

### 搜索与安装

```bash
# 交互式搜索
npx skills find

# 关键词搜索
npx skills find [query]

# 安装 skill（全局）
npx skills add <owner/repo@skill> -g -y

# 列出仓库中的 skills
npx skills add <owner/repo> -l

# 安装仓库所有 skills
npx skills add <owner/repo> --all
```

### 查看与管理

```bash
# 列出全局 skills
npx skills list -g
npx skills ls -g

# 列出项目 skills
npx skills list
npx skills ls

# 按 agent 筛选
npx skills ls -a claude-code
```

### 删除 Skills

```bash
# 交互式删除
npx skills remove
npx skills rm

# 删除特定 skill（全局）
npx skills remove <skill-name> -g

# 删除所有 skills
npx skills remove --all -g

# 跳过确认
npx skills remove <skill-name> -g -y
```

### 更新 Skills

```bash
# 检查更新
npx skills check

# 更新所有 skills
npx skills update
```

### 创建自定义 Skill

```bash
# 初始化新 skill
npx skills init my-skill

# 在特定目录初始化
npx skills init my-project/my-skill
```

---

## 推荐 Skills

### 🎯 前端开发（Next.js + React）

#### Next.js

```bash
# Next.js App Router 模式（6.5K 安装）⭐
npx skills add wshobson/agents@nextjs-app-router-patterns -g -y

# Next.js 最佳实践（2.4K 安装）
npx skills add sickn33/antigravity-awesome-skills@nextjs-best-practices -g -y

# Next.js + Supabase 认证（2.8K 安装）
npx skills add sickn33/antigravity-awesome-skills@nextjs-supabase-auth -g -y
```

#### React

```bash
# Vercel React 最佳实践（185.8K 安装）⭐ 必装
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y

# React 性能优化（444 安装）
npx skills add nickcrew/claude-ctx-plugin@react-performance-optimization -g -y

# React 组件开发（11.1K 安装）
npx skills add google-labs-code/stitch-skills@react:components -g -y
```

#### Tailwind CSS

```bash
# 高级布局（1.9K 安装）⭐
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-advanced-layouts -g -y

# 动画效果（672 安装）
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-animations -g -y

# 移动优先设计（613 安装）
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-mobile-first -g -y
```

#### TypeScript

```bash
# TypeScript 高级类型（10.6K 安装）⭐
npx skills add wshobson/agents@typescript-advanced-types -g -y

# TypeScript 专家（1.9K 安装）
npx skills add sickn33/antigravity-awesome-skills@typescript-expert -g -y

# OpenAPI 转 TypeScript（2.9K 安装）
npx skills add softaworks/agent-toolkit@openapi-to-typescript -g -y
```

### 🚀 后端开发（Go）

```bash
# Go 后端开发（319 安装）⭐
npx skills add manutej/luxor-claude-marketplace@golang-backend-development -g -y

# Go Clean Architecture（27 安装）
npx skills add eng0ai/eng0-template-skills@go-backend-clean-architecture -g -y

# Go 微服务（60 安装）
npx skills add mindrally/skills@go-backend-microservices -g -y

# Go 后端审查（21 安装）
npx skills add jssfy/k-skills@go-backend-reviewer -g -y
```

### 🔌 API 设计

```bash
# API 设计（4.1K 安装）⭐
npx skills add supercent-io/skills-template@api-design -g -y

# REST API 设计模式（65 安装）
npx skills add manutej/luxor-claude-marketplace@rest-api-design-patterns -g -y

# API 模式（436 安装）
npx skills add sickn33/antigravity-awesome-skills@api-patterns -g -y
```

### 🗄️ 数据库

```bash
# 数据库 Schema 设计（4.1K 安装）⭐
npx skills add supercent-io/skills-template@database-schema-design -g -y

# PostgreSQL（3.6K 安装）
npx skills add neondatabase/agent-skills@neon-postgres -g -y

# 数据库迁移（3.2K 安装）
npx skills add wshobson/agents@database-migration -g -y

# Prisma ORM（1.2K 安装）
npx skills add prisma/skills@prisma-database-setup -g -y
```

### 🧪 测试

```bash
# 后端测试（4.1K 安装）⭐
npx skills add supercent-io/skills-template@backend-testing -g -y

# 测试策略（4.1K 安装）
npx skills add supercent-io/skills-template@testing-strategies -g -y

# E2E 测试（4.8K 安装）
npx skills add wshobson/agents@e2e-testing-patterns -g -y

# Web 应用测试（17.4K 安装）
npx skills add anthropics/skills@webapp-testing -g -y
```

### 🐳 部署与容器化

```bash
# Docker 专家（75 安装）
npx skills add personamanagmentlayer/pcl@docker-expert -g -y

# Docker 部署（108 安装）
npx skills add pluginagentmarketplace/custom-plugin-nodejs@docker-deployment -g -y
```

---

## 管理 Skills

### 查看已安装的 Skills

```bash
# 查看全局 skills
npx skills ls -g

# 查看项目 skills
npx skills ls

# 按 agent 筛选
npx skills ls -a claude-code
```

### 删除 Skills

**交互式删除（推荐）：**
```bash
npx skills remove -g
```

**删除特定 Skill：**
```bash
npx skills remove <skill-name> -g -y
```

**批量删除所有 Skills：**
```bash
npx skills remove --all -g -y
```

### 更新 Skills

```bash
# 检查可用更新
npx skills check

# 更新所有 skills
npx skills update
```

### Skills 存储位置

- **全局 Skills**: `~/.claude/skills/`
- **项目 Skills**: `./claude/skills/`

**手动清理：**
```bash
# 删除所有全局 skills
rm -rf ~/.claude/skills/*

# 删除特定 skill
rm -rf ~/.claude/skills/<skill-name>
```

---

## 最佳实践

### 1. 按需安装，避免过度安装

**推荐：**
```bash
# 只安装核心 skills
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add wshobson/agents@nextjs-app-router-patterns -g -y
```

**不推荐：**
```bash
# 避免一次性安装大量不常用的 skills
npx skills add owner/repo --all
```

### 2. 定期更新

```bash
# 每周检查一次
npx skills check

# 更新所有
npx skills update
```

### 3. 使用全局安装

对于常用 skills，使用 `-g` 标志全局安装：
```bash
npx skills add <skill> -g -y
```

### 4. 定期清理

```bash
# 查看已安装的
npx skills ls -g

# 删除不需要的
npx skills remove -g
```

### 5. 优先选择热门 Skills

- 查看安装数：数字越大，说明使用者越多
- 优先选择官方维护的 skills（如 Vercel、Anthropic）
- 查看 https://skills.sh/ 了解详情

### 6. 技术栈组合推荐

**前端开发者核心包：**
```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add wshobson/agents@nextjs-app-router-patterns -g -y
npx skills add wshobson/agents@typescript-advanced-types -g -y
```

**全栈开发者核心包：**
```bash
# 前端
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add wshobson/agents@nextjs-app-router-patterns -g -y

# 后端
npx skills add manutej/luxor-claude-marketplace@golang-backend-development -g -y
npx skills add supercent-io/skills-template@api-design -g -y

# 数据库
npx skills add supercent-io/skills-template@database-schema-design -g -y

# 测试
npx skills add supercent-io/skills-template@backend-testing -g -y
```

---

## 常见问题

### Q1: Skills 和普通提示词的区别？

**Skills：**
- 模块化、可重用
- 社区维护和更新
- 自动在相关任务中激活
- 包含完整的上下文和最佳实践

**普通提示词：**
- 一次性使用
- 需要手动输入
- 缺乏结构化知识

### Q2: 安装太多 Skills 会影响性能吗？

不会。Claude Code 只在相关任务时加载对应的 skills。但建议按需安装，保持管理简洁。

### Q3: Skills 可以离线使用吗？

可以。一旦安装，skills 存储在本地，无需网络连接即可使用。

### Q4: 如何知道某个 Skill 是否在工作？

Claude Code 在使用 skill 时会自动应用其知识。你可以通过生成代码的质量和模式来判断。

### Q5: 可以创建自己的 Skills 吗？

可以！使用以下命令：
```bash
npx skills init my-skill
```

然后在 `SKILL.md` 文件中编写你的知识和指导。

### Q6: Skills 支持哪些 AI Agent？

主要支持：
- Claude Code
- Cursor
- Windsurf
- 其他支持 Agent Skills 协议的工具

### Q7: Skills 是免费的吗？

是的！Skills 生态完全开源和免费。

### Q8: 如何贡献到 Skills 生态？

1. 创建自己的 skill
2. 发布到 GitHub
3. 在 https://skills.sh/ 提交
4. 分享给社区

### Q9: Global vs Project 安装的区别？

**Global（-g）：**
- 安装到 `~/.claude/skills/`
- 所有项目共享
- 适合通用 skills

**Project：**
- 安装到项目的 `.claude/skills/`
- 仅当前项目使用
- 适合项目特定的 skills

### Q10: 如何查看 Skill 的详细内容？

**方法 1：** 访问 Skills 网站
```
https://skills.sh/<owner>/<repo>/<skill-name>
```

**方法 2：** 查看本地文件
```bash
cat ~/.claude/skills/<skill-name>/SKILL.md
```

---

## 快速参考

### 常用命令速查表

| 操作 | 命令 |
|------|------|
| 搜索 skills | `npx skills find [query]` |
| 安装 skill（全局） | `npx skills add <package> -g -y` |
| 列出已安装 | `npx skills ls -g` |
| 删除 skill | `npx skills remove <name> -g` |
| 检查更新 | `npx skills check` |
| 更新所有 | `npx skills update` |
| 交互式删除 | `npx skills remove -g` |
| 查看帮助 | `npx skills --help` |

### 推荐资源

- **Skills 官网**: https://skills.sh/
- **Skills map**: https://skillsmp.com/
- **GitHub 组织**: https://github.com/vercel-labs/agent-skills
- **社区 Skills**: https://github.com/topics/agent-skills
- **文档**: https://github.com/anthropics/claude-code

---

## 下一步

### 初学者

1. 安装 3-5 个核心 skills
2. 尝试使用 Claude Code 完成任务
3. 观察 skills 如何改进代码质量

### 进阶使用

1. 探索更多专业领域的 skills
2. 定期更新 skills
3. 根据项目需求动态安装/删除

### 高级用户

1. 创建自定义 skills
2. 贡献到社区
3. 优化 skills 配置

---

**开始你的 Skills 之旅！**

```bash
# 从这里开始
npx skills find

# 安装你的第一个 skill
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y

# 查看已安装的
npx skills ls -g
```