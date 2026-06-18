---
title: 工程 03 · 目录与模块边界
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
---

# 工程 03 · 目录与模块边界

> monorepo 划分、packages 职责、依赖规则——避免业务与 Three 缠在一起。

---

## 目录

- [适用场景](#适用场景)
- [单仓多包结构](#单仓多包结构)
- [packages 职责](#packages-职责)
- [依赖规则](#依赖规则)
- [ModelViewer 对外 API](#modelviewer-对外-api)
- [导航](#导航)

---

## 适用场景

- 2 个以上页面用 3D
- 产品页 + 孪生后台共用加载/交互逻辑
- 需要 **统一升级 three 版本**

单页小 demo 用 [10 进项目](../10-project-integration.md) 的 `src/three/` 即可，不必 monorepo。

---

## 单仓多包结构

```
apps/
├── product-site/          # Vue 产品官网
├── twin-dashboard/        # React 孪生大屏
└── docs/                  # 文档站

packages/
├── 3d-core/               # 引擎：仅依赖 three
│   ├── src/
│   │   ├── SceneManager.ts
│   │   ├── AssetLoader.ts
│   │   ├── presets/
│   │   ├── interaction/
│   │   └── dispose.ts
│   └── package.json
├── 3d-vue/                # Vue 组件，依赖 3d-core
│   └── ModelViewer.vue
└── 3d-react/              # React 组件（可选）
    └── ModelViewer.tsx

public-assets/             # 或 CDN 桶
├── models/
├── hdr/
└── draco/
```

`pnpm-workspace.yaml` 引用 `packages/*`、`apps/*`。

---

## packages 职责

| 包 | 依赖 | 导出 |
|----|------|------|
| `3d-core` | three | createSceneManager, loadGLTF, presets |
| `3d-vue` | 3d-core, vue | ModelViewer, useScene3D |
| `3d-react` | 3d-core, react | 同上 |
| apps | 3d-vue 等 | 页面、路由、接口 |

**3d-core 禁止** import vue/react。单元测试只测 core，不启 DOM 框架。

---

## 依赖规则

```
apps  →  3d-vue / 3d-react  →  3d-core  →  three
 ✗ apps 直接 import three
 ✗ 3d-vue 直接 new GLTFLoader（应走 AssetLoader）
```

ESLint `no-restricted-imports` 在 apps 里 ban `three`：

```js
// .eslintrc
"no-restricted-imports": ["error", { "paths": ["three"] }]
```

例外：只有 `packages/3d-core` 目录允许 import three。

**业界参照**：[pascalorg/editor](https://github.com/pascalorg/editor) 将 `@pascal-app/core`（逻辑）与 `@pascal-app/viewer`（R3F 渲染）拆包，与上表一致。详见 [07 开源参考](./07-open-source-reference.md)。

---

## ModelViewer 对外 API

业务 **稳定接口** 示例（版本化 semver）：

```ts
interface ModelViewerProps {
  modelUrl: string;
  preset?: 'product' | 'twin' | 'preview';
  draco?: boolean;
  autoRotate?: boolean;
  highlightIds?: string[];
  onReady?: () => void;
  onProgress?: (p: number) => void;
  onError?: (err: Error) => void;
  onPick?: (payload: { id: string; name: string }) => void;
}
```

内部换 Three 版本、换 Orbit 实现，**props 保持不变**。

---

## 导航

- [工程目录](./README.md)
- 上一篇：[02 · 技术选型](./02-tech-selection.md)
- 下一篇：[04 · 资源管线](./04-asset-pipeline.md)
