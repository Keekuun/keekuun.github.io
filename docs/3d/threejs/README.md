---
title: Three.js 从零到能干活
sidebar: auto
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- 3D
---

# Three.js 从零到能上手

> 面向零 3D 基础的前端：从第一个旋转立方体开始，按工业项目常用能力逐步补齐。

---

## 这套系列学什么

Three.js 是浏览器里做 Web 3D 最常用的库，底层走 WebGL（或 WebGPU）。它和 ECharts 大屏不是同一类工具：没有「一个 option 配完」的捷径，需要自己管理场景、相机、物体和每一帧渲染。

本系列按 **能跑起来 → 看得对 → 接模型 → 能交互 → 能上线** 的顺序写，每篇说明 **适用场景**、原理与工程实践，附可运行示例与练习。

- 产品 / 设备 3D 展示（glTF、orbit、换色、标注）
- 数字孪生、园区场景（加载、分区、数据驱动状态）
- 可视化页面里的 3D 模块（与 2D 图表并存）

---

## 学习路线

建议按顺序阅读，前两篇打基础，后面可以边学边查 [官方 examples](https://threejs.org/examples/)。

| 篇 | 链接 | 内容 |
|----|------|------|
| 01 | [从传统前端到 3D](./01-from-dashboard-to-3d.md) | 3D 渲染在 Web 里多管了哪些事 |
| 02 | [第一个场景](./02-first-scene.md) | Scene / Camera / Renderer / Mesh，跑通旋转立方体 |
| 03 | [场景图与坐标](./03-scene-graph-and-coordinates.md) | Object3D 层级、position / rotation / scale |
| 04 | [相机](./04-camera.md) | 透视、裁剪面、黑屏与画面变形 |
| 05 | [几何与材质](./05-geometry-and-material.md) | Geometry、Material 选型 |
| 06 | [光与阴影](./06-lights-and-shadows.md) | 常见光源与 shadow 配置 |
| 07 | [加载 glTF](./07-load-gltf.md) | GLTFLoader、加载进度与错误处理 |
| 08 | [交互](./08-interaction.md) | OrbitControls、Raycaster 点击拾取 |
| 09 | [性能与释放](./09-performance-and-dispose.md) | 渲染循环、dispose、移动端帧率 |
| 10 | [进项目](./10-project-integration.md) | 工程结构、何时使用 R3F / Tres |

基础系列到此结束。后续三条线：

- **动手实践**：[实践与作品集](./practices/README.md)（微实验 + 作品集 + [评估标准](./practices/03-project-evaluation.md)）
- **能力进阶**：[Three.js 进阶 11–19](./advanced/README.md)（HDRI、后处理、大场景等）
- **工程实践**：[Web 3D 工程实践](./engineering/README.md)（分层架构、选型、资源管线、交付——**真实项目必读**）

---

## 推荐学习方式

**Three.js 为主，WebGL 为辅。** 日常开发以 Three.js API 为主；出现黑屏、材质异常、贴图问题时，再对照 [WebGL 系列](../webgl/README.md) 查底层（着色器、法线、深度、FBO 等）。3D 实战从 [WebGL 09 · 矩阵](../webgl/09-matrices-and-3d.md) 起读。

**先 vanilla，后框架。** 第一遍用 Vite + 纯 Three.js，不要用 React Three Fiber 或 TresJS 封装。搞清 Scene、Camera、render loop 之后，再迁到框架层。

**以官方文档和 examples 为准。** Three.js r150+ 统一 ES Module 导入；避免依赖过时的中文教程（例如已废弃的 `Geometry` API）。

**改参数、看结果。** 每篇示例都建议在本地改 FOV、颜色、相机位置，观察变化，比只读代码见效快。

---

## 环境与工具

| 项 | 建议 |
|----|------|
| 运行时 | Node 18+ |
| 脚手架 | `pnpm create vite`，选 vanilla 模板 |
| 依赖 | `pnpm add three` |
| **本仓库 Demo** | `pnpm threejs:dev` → [apps/threejs-demos](../../apps/threejs-demos/README.md) |
| 浏览器 | Chrome，配合 DevTools Console / Performance |
| 模型预览 | [glTF Viewer](https://gltf-viewer.donmccurdy.com/) |
| 在线编辑 | [Three.js Editor](https://threejs.org/editor/) |

---

## 参考资源

- [Three.js 官网](https://threejs.org/) — 文档与 examples
- [Discover three.js](https://discoverthreejs.com/) — 免费系统教程
- [Three.js Journey](https://threejs-journey.com/) — 付费进阶（可选）
- [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models) — 标准测试模型

框架封装（学完基础后再看）：[React Three Fiber](https://r3f.docs.pmnd.rs/) · [TresJS](https://docs.tresjs.org/zh/guide/)

---

## 导航

- WebGL 底层：[WebGL 学习路线](../webgl/README.md) · [09 矩阵与 3D](../webgl/09-matrices-and-3d.md)
- 开始阅读：[01 · 从传统前端到 3D](./01-from-dashboard-to-3d.md)
- 能力进阶：[Three.js 进阶](./advanced/README.md)
- **动手实践**：[实践与作品集](./practices/README.md)
- **工程实践**：[Web 3D 工程实践](./engineering/README.md)
