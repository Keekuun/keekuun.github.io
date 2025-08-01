---
title: PNPM Workspace 管理 Monorepo 实践
date: 2025-07-16
sidebar: auto
categories: 
- 工程化
tags: 
- pnpm
- monorepo
---

## 1. 项目结构设计

推荐的项目目录结构：

```
my-monorepo/
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── apps/
│   ├── web/                # 前端应用
│   ├── mobile/             # 移动端应用
│   └── desktop/            # 桌面应用
├── packages/
│   ├── ui/                 # 共享UI组件
│   ├── utils/              # 工具函数库
│   ├── config/             # 共享配置
│   └── api/                # API客户端
├── services/
│   ├── api-service/        # API服务
│   └── auth-service/       # 认证服务
└── scripts/                # 项目级脚本
```

## 2. 核心配置文件

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

### `.npmrc`

```bash
# PNPM 默认不会自动安装 peer dependencies，需要手动声明，开启自动安装 peer dependencies
auto-install-peers=true
# 允许使用相近版本的 peer dependencies， 不严格检查peer dependencies版本
strict-peer-dependencies=false
# 默认行为：PNPM 使用符号链接保持严格的依赖隔离， 开启后将依赖提升到 node_modules 根目录
shamefully-hoist=true
# 优先使用工作区本地包而非外部
prefer-workspace-packages=true
```

## 3. 依赖管理策略

### 3.1 共享依赖

根目录 `package.json` 中安装公共依赖：

```bash
pnpm add -w typescript eslint prettier @types/node
```

### 3.2 子包依赖
为特定子包添加依赖：
+ 从外部注册表安装：会从 npm registry 或其他配置的源下载包
+ 版本锁定：会在目标包的 package.json 中记录具体版本号
+ 存储位置：安装在目标包的 node_modules 中

```bash
pnpm add <package-name> --filter <target-package>

# 例如
pnpm add lodash@4.17.21 --filter web
```

会在 apps/web/package.json 中生成：
```json
{
  "dependencies": {
    "lodash": "4.17.21"
  }
}
```

### 3.3 工作区内部依赖
+ 从本地工作区链接：会链接到工作区内的其他包
+ 版本通配：使用 workspace:* 或 workspace:^ 等特殊版本标识
+ 存储位置：通过符号链接指向工作区内的包

```bash
pnpm add <workspace-package> --filter <target-package> --workspace

# 例如
pnpm add @project/ui --filter web --workspace
```

会在 apps/web/package.json 中生成：
```json
{
  "dependencies": {
    "@project/ui": "workspace:*"
  }
}
```

## 4. 脚本管理方案

### 4.1 根目录 `package.json`

```json
{
  "scripts": {
    "prepare": "pnpm -r run prepare",
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "dev": "pnpm run --parallel dev",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

### 4.2 子包脚本示例

```json
{
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "lint": "eslint src",
    "dev": "vite dev",
    "prepare": "husky install"
  }
}
```

## 5. 版本管理与发布

### 5.1 安装 Changesets

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

### 5.2 版本发布流程

1. 创建变更集：
   ```bash
   pnpm changeset
   ```
2. 更新版本：
   ```bash
   pnpm version-packages
   ```
3. 发布：
   ```bash
   pnpm release
   ```
当使用 changeset 发布时，workspace:* 会被自动转换为具体的版本号：
```json
// 开发时
"dependencies": {
  "@project/ui": "workspace:*"
}
// 发布后
"dependencies": {
  "@project/ui": "1.2.3"
}
```

## 6. 开发环境配置

### 6.1 跨包调试

在 `apps/web/package.json` 中：

```json
{
  "dependencies": {
    "@project/ui": "workspace:*"
  }
}
```

### 6.2 TS 路径映射

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@project/*": ["packages/*/src"],
      "@apps/*": ["apps/*/src"]
    }
  }
}
```

## 7. 代码质量保障

### 7.1 统一代码风格

根目录 `.eslintrc.js`:

```js
module.exports = {
  extends: ['eslint-config-project'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

### 7.2 共享配置

`packages/config/eslint-preset`:

```js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // 共享规则
  }
};
```

## 8. 性能优化技巧

### 8.1 过滤命令执行

```bash
pnpm --filter "web" run build
pnpm --filter "@project/*" run test
```

### 8.2 并行执行

```bash
pnpm run --parallel dev
pnpm run --stream --filter "!api-service" build
```

## 9. CI/CD 集成

### 9.1 GitHub Actions 示例

`.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 7
      - run: pnpm install
      - run: pnpm run test --filter "[affected]"

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run build --filter "[affected]"
```

## 10. 高级技巧

### 10.1 任务管道

```bash
pnpm --filter "web...utils" run build
```

### 10.2 依赖图可视化

```bash
pnpm m ls --graph
```

### 10.3 依赖检查

```bash
pnpm why react --filter web
```

## 11. 常见问题解决

### 11.1 幽灵依赖问题

+ 现象：使用了未在 package.json 声明的依赖

+ 解决：使用 `shamefully-hoist=true`，显式声明所有依赖

解决方案：
1. 确保所有依赖都显式声明
2. 使用 `pnpm.overrides` 统一版本

### 11.2 循环依赖

+ 现象：A 包依赖 B 包，同时 B 包又依赖 A 包

+ 解决：重构代码结构，提取公共逻辑到第三个包

检测工具：
```bash
pnpm m ls --cycle
```

### 11.3 版本冲突
+ 现象：不同包要求不同版本的同一依赖

+ 解决：在根目录使用 `pnpm.overrides` 统一版本

使用 `resolutions` 字段强制版本：

```json
{
  "pnpm": {
    "overrides": {
      "react": "18.2.0",
      "react-dom": "18.2.0"
    }
  }
}
```

### 11.4 实践建议
+ 明确区分：第三方依赖用常规安装，内部共享包用 `--workspace`
+ 版本控制：内部依赖始终使用 `workspace:*` 保持同步
+ 依赖隔离：每个包的依赖应尽可能独立，减少共享依赖
+ 定期检查：使用 `pnpm why` 检查依赖关系
+ CI验证：在 CI 中测试不带 `shamefully-hoist` 的构建

## 12. 推荐插件

1. [`@changesets/cli` - 版本管理](https://github.com/changesets/changesets)
2. [`@preconstruct/cli` - 包构建](https://github.com/preconstruct/preconstruct)
3. [`Turbo` - 任务缓存和优化](https://turbo.net.cn/docs)

> [Changeset Github Action](https://riskers.notion.site/Changeset-Github-Action-5a2dc1197f7b49b09909f66a39e3e458)
> 
> [next.js - 使用 trubo + pnpm workspace 管理的monorepo](https://github.com/vercel/next.js)
> 
> [mantine - 优秀的monorepo管理的react ui组件库](https://github.com/mantinedev/mantine)
