---
title: Three.js 实践与作品集 · 导读
sidebar: auto
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Practice
- Portfolio
---

# Three.js 实践与作品集

> 读文档只能建立概念；**找工作、进项目靠的是跑通 demo 和能演示的作品**。本系列把「该做什么、做到什么程度、对应哪篇教程」写清楚。

---

## 适用场景

| 情况 | 怎么用本系列 |
|------|--------------|
| 刚学完 [基础 01–10](../README.md) | 先做 [微实验](./01-micro-labs-by-chapter.md) 打手，再做作品集 **P1** |
| 准备投 Web 3D / 孪生岗 | 至少完成 [作品集 P1 + P2](./02-portfolio-projects.md)，README 写架构与性能数据 |
| 有大屏 / Vue 经验 | 优先 **P3 大屏 3D 块**，和 ECharts 同屏 |
| 进阶 11–19 边学边做 | 微实验里的「进阶块」+ 作品集 **P2/P4** |

---

## 学习顺序（建议 8～12 周）

```
Week 1–2   基础 01–06 + 微实验 A 块
Week 3–4   基础 07–10 + 微实验 B 块 → 启动作品集 P1
Week 5–6   工程 01–04 + 完善 P1（分层、加载、dispose）
Week 7–8   工程 05–06 + 作品集 P2 或 P3（二选一主线）
Week 9–10  进阶按需 + 用 R3F/Tres 重写其中一个作品
Week 11–12 部署、录屏、写项目 README、整理 GitHub 主页
```

**原则**：不要等「全读完」再动手；**P1 在学到 07 glTF 时就可以开做**。

---

## 文档结构

| 篇 | 链接 | 内容 |
|----|------|------|
| 01 | [按章微实验](./01-micro-labs-by-chapter.md) | 01–10 每章 2～4 个小实验 + 进阶选做 |
| 02 | [作品集项目](./02-portfolio-projects.md) | P1～P4 完整需求、验收标准、目录与部署 |
| 03 | [3D 项目评估标准](./03-project-evaluation.md) | 六维度评分、性能预算、测量流程、验收模板 |

---

## 代码放哪里

建议在仓库里单独建演示应用（与 [webgl-demos](../../../apps/webgl-demos/README.md) 并列）：

```
apps/threejs-demos/
├── package.json
├── vite.config.js
├── index.html              # 作品集导航
├── shared/                 # createScene、loadModel、dispose
├── labs/                   # 微实验（按章编号）
│   ├── 02-first-scene/
│   └── ...
└── portfolio/              # 作品集
    ├── p1-product-viewer/
    ├── p2-twin-zone/
    ├── p3-dashboard-3d/
    └── p4-configurator/    # 选做
```

本地运行模板：

```bash
pnpm --dir apps/threejs-demos install
pnpm --dir apps/threejs-demos dev
```

或直接：`pnpm threejs:dev`（仓库根目录）

已实现 Demo 见 [apps/threejs-demos](../../../apps/threejs-demos/README.md)。

模型资源：[glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models) · [Poly Pizza](https://poly.pizza/) · 自建 Blender 导出。

---

## 作品集最低配置（求职）

| 优先级 | 项目 | 对应岗位关键词 |
|--------|------|----------------|
| **必做** | [P1 产品 3D 展示](./02-portfolio-projects.md#p1-产品-3d-展示器) | glTF、PBR、交互、加载 |
| **必做** | [P2 分区孪生场景](./02-portfolio-projects.md#p2-分区孪生场景) **或** [P3 大屏 3D 块](./02-portfolio-projects.md#p3-大屏--3d-孪生块) | 孪生 / 大屏 |
| **强烈建议** | 其中一个用 [Vue + Tres](../advanced/18-r3f-tres.md) 或 React + R3F 重写 | 框架集成 |
| **选做** | [P4 配置器](./02-portfolio-projects.md#p4-3d-配置器选做) | 换色换件、动画 |

每个作品仓库 / 目录里要有：

1. **在线 Demo 链接**（Vercel / GitHub Pages）
2. **README**：功能截图、技术栈、目录结构、性能数据（三角面数、首屏加载秒数、移动端帧率）
3. **30 秒录屏**（orbit + 点击 + 数据变化）

---

## 与教程 / 工程的对应关系

| 能力 | 教程 | 实践落点 |
|------|------|----------|
| 场景生命周期 | [10 进项目](../10-project-integration.md) | 所有作品集 |
| 分层架构 | [工程 01](../engineering/01-why-not-raw-threejs.md) | P2、P3 的 `three/` 目录 |
| 资源管线 | [工程 04](../engineering/04-asset-pipeline.md) | P1 压缩 glb、Draco |
| 数据驱动 | [工程 05](../engineering/05-data-and-state.md) | P2、P3 WebSocket mock |
| 上线清单 | [工程 06](../engineering/06-quality-and-delivery.md) | 部署前自检 |
| 项目评估 | [03 评估标准](./03-project-evaluation.md) | README 性能表、验收打分 |
| 开源对照 | [工程 07](../engineering/07-open-source-reference.md) | 选型说明写进 README |

---

## 导航

- 基础系列：[Three.js 从零到能上手](../README.md)
- 进阶系列：[Three.js 进阶](../advanced/README.md)
- 工程实践：[Web 3D 工程实践](../engineering/README.md)
- 开始动手：[01 · 按章微实验](./01-micro-labs-by-chapter.md)
- 作品集规格：[02 · 作品集项目](./02-portfolio-projects.md)
- 评估标准：[03 · 3D 项目评估标准](./03-project-evaluation.md)
