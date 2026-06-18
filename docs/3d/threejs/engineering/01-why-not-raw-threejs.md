---
title: 工程 01 · 为什么不直接在业务里写 Three.js
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
- Architecture
---

# 工程 01 · 为什么不直接在业务里写 Three.js

> POC 可以一个 `main.js`；上线项目需要 **引擎层** 把 Three.js 关进笼子里。

---

## 目录

- [适用场景](#适用场景)
- [业界实际分层](#业界实际分层)
- [反模式](#反模式)
- [引擎层该做什么](#引擎层该做什么)
- [最小引擎接口示例](#最小引擎接口示例)
- [与 10 进项目的区别](#与-10-进项目的区别)
- [导航](#导航)

---

## 适用场景

| 阶段 | 做法 |
|------|------|
| 个人学习、验证 glb 能否加载 | 页面里直接写 Three.js ✅ |
| 单次交付、不再维护 | 薄封装即可 |
| **多页面 / 多项目复用 3D** | 必须引擎层 |
| **3 人以上协作** | 必须边界清晰 |
| 孪生、长期迭代 | 引擎层 + 资源管线 |

---

## 业界实际分层

```
┌─────────────────────────────────────────┐
│  pages / routes（业务）                  │
│  - 不调 THREE.*                         │
│  - 只传 props / 调 store                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  components/ModelViewer（视图层）        │
│  - <ModelViewer url onPick />           │
│  - 挂载/卸载、loading、error UI          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  packages/3d-core（引擎层）              │
│  - SceneManager.create / destroy        │
│  - AssetRegistry.loadModel              │
│  - Interaction.pick / highlight         │
│  - Presets: product | twin | preview    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  three（npm 依赖，版本锁定）              │
└─────────────────────────────────────────┘
```

**Three.js 只在引擎层出现一次。** 业务 import 的是 `@corp/3d-core` 或 `components/ModelViewer`。

---

## 反模式

**1. 业务组件里满屏 `THREE.`**

```vue
<!-- ❌ 难测、难复用、dispose 易漏 -->
<script setup>
import * as THREE from 'three';
onMounted(() => {
  const renderer = new THREE.WebGLRenderer();
  // ... 200 行
});
</script>
```

**2. 每个页面 copy 一份 createScene**

改 DPR、colorSpace、dispose 要改 N 处。

**3. 业务直接 traverse 改 mesh**

孪生逻辑散落在各个页面，部件 `name` 变更全崩。

**4. 3D 与路由生命周期脱节**

`v-if` 切页不 dispose → WebGL 泄漏，越用越卡（见 [09 性能](../09-performance-and-dispose.md)）。

---

## 引擎层该做什么

| 职责 | 说明 |
|------|------|
| 生命周期 | create / resize / pause / destroy 唯一入口 |
| 资源 | 加载、缓存、normalize、dispose |
| 预设 | `ProductPreset`（HDRI+orbit）、`TwinPreset`（轻光+标注） |
| 交互 | pick、highlight、flyTo 封装 |
| 性能档位 | desktop / mobile 配置切换 |
| 观测 | 可选 Stats、错误上报、load 耗时 |

**不该做**：业务权限、表单校验、接口 URL——留在业务层。

---

## 最小引擎接口示例

```ts
// packages/3d-core/src/SceneManager.ts
export interface SceneManagerOptions {
  preset?: 'product' | 'twin' | 'preview';
  container: HTMLElement;
}

export interface SceneManager {
  loadModel(url: string): Promise<void>;
  setHighlight(ids: string[]): void;
  flyTo(id: string): Promise<void>;
  resize(): void;
  dispose(): void;
}

export function createSceneManager(opts: SceneManagerOptions): SceneManager {
  // 内部：THREE.WebGLRenderer、OrbitControls、dispose...
}
```

业务侧：

```vue
<ModelViewer
  :model-url="product.glb"
  preset="product"
  @pick="onPickPart"
/>
```

`ModelViewer` 内部只调 `createSceneManager`，不 export Three 对象给外面。

---

## 与 10 进项目的区别

[10 · 进项目](../10-project-integration.md) 教 **单项目** 里 `createScene.js` 怎么写。

本系列教 **多项目、多团队** 时如何把 `createScene` 收成包、如何选型 R3F、如何定资源规范——是 10 的 **规模化**。

---

## 导航

- [工程目录](./README.md)
- 下一篇：[02 · 技术选型](./02-tech-selection.md)
