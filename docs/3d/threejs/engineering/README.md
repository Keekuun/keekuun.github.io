---
title: Web 3D 工程实践 · 导读
sidebar: auto
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

# Web 3D 工程实践

> 真实项目里很少在业务页面「直接写 Three.js API」。本系列讲 **分层架构、选型、资源管线与交付流程**。

---

## 和基础 / 进阶系列的关系

| 系列 | 解决什么 |
|------|----------|
| [基础 01–10](../README.md) | 搞懂 Three.js API 与渲染链路 |
| [进阶 11–19](../advanced/README.md) | HDRI、后处理、大场景等能力 |
| **工程实践（本系列）** | 团队怎么组织代码、怎么和美术/后端协作、怎么上线 |
| [实践与作品集](../practices/README.md) | 微实验 + P1～P4 作品集，把文档变成可演示项目 |

建议：**01–10 跑通 demo → [作品集 P1](../practices/02-portfolio-projects.md) → 本系列定架构 → 进阶按需查**。

---

## 核心结论（先看这段）

```
业务页面（Vue/React）
        ↓ 只调声明式 API
3D 视图层（ModelViewer / useScene3D）
        ↓
引擎层（SceneManager / AssetLoader / Interaction）
        ↓
Three.js（Scene / Renderer / Loader）
        ↓
WebGL
```

- **Three.js**：渲染库，类似「canvas 2D API」
- **引擎层**：你们团队维护的 **facade**，统一生命周期、加载、dispose
- **视图层**：对业务暴露 `modelUrl`、`onPick`、`theme` 等 props
- **业务层**：不 import `three`，不碰 `scene.add`

POC 可以单文件 `main.js`；**进迭代、多人协作、多项目复用** 时必须分层。

---

## 章节列表

| 篇 | 链接 | 内容 |
|----|------|------|
| 01 | [为什么不直接用 Three.js](./01-why-not-raw-threejs.md) | 分层动机、常见反模式 |
| 02 | [技术选型](./02-tech-selection.md) | 自研引擎层 / R3F / Tres / 商业 SDK |
| 03 | [目录与模块边界](./03-project-structure.md) | monorepo、packages、依赖规则 |
| 04 | [资源管线](./04-asset-pipeline.md) | 美术 → glTF → CDN → 运行时 |
| 05 | [数据驱动与状态](./05-data-and-state.md) | Store、WebSocket、与 2D 大屏并存 |
| 06 | [质量与交付](./06-quality-and-delivery.md) | 性能预算、CI、监控、上线清单 |
| 07 | [开源项目参考](./07-open-source-reference.md) | GitHub 高星项目架构对照与选型佐证 |

---

## 国内项目常见形态

| 形态 | 典型栈 | 工程重点 |
|------|--------|----------|
| 产品 3D 官网 | Vue + 自研 viewer 或 Tres | 加载、配置器、SEO 壳 |
| 数字孪生 | React/Vue + 自研引擎 + 地图 | 分区加载、标注、实时数据 |
| 大屏 3D 块 | Vue + iframe/组件 + ECharts | 弱耦合、性能档位 |
| 多产品线 | pnpm monorepo + `@corp/3d-core` | 版本统一、复用 |

---

## 导航

- 基础系列：[Three.js 从零到能上手](../README.md)
- 进阶系列：[Three.js 进阶](../advanced/README.md)
- 开始阅读：[01 · 为什么不直接用 Three.js](./01-why-not-raw-threejs.md)
- 开源对照：[07 · 开源项目参考](./07-open-source-reference.md)
- 动手实践：[实践与作品集](../practices/README.md) · [03 评估标准](../practices/03-project-evaluation.md)
