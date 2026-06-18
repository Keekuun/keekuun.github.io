---
title: 工程 07 · 开源项目参考
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
- OpenSource
---

# 工程 07 · 开源项目参考

> 对照 GitHub 上高星、可落地的 Three.js 实践项目，提炼 **架构模式与选型依据**（非完整源码导读）。

---

## 目录

- [适用场景](#适用场景)
- [按业务形态分类](#按业务形态分类)
- [项目对照表](#项目对照表)
- [React 生态（pmndrs）](#react-生态pmndrs)
- [Vue / 国内孪生平台](#vue--国内孪生平台)
- [编辑器与低代码](#编辑器与低代码)
- [BIM / 超大模型（非 Three 为主）](#bim--超大模型非-three-为主)
- [从开源项目反推工程规范](#从开源项目反推工程规范)
- [导航](#导航)

---

## 适用场景

- 技术选型需要 **业界佐证**（见 [02 技术选型](./02-tech-selection.md)）
- 设计 monorepo / 引擎层时找 **目录参考**（见 [03 目录结构](./03-project-structure.md)）
- 不确定「产品页该多轻、孪生该多重」

以下 Stars 为 2026 年初量级，随时间浮动；**看架构比看星数重要**。

---

## 按业务形态分类

| 业务 | 优先参考 | 原因 |
|------|----------|------|
| 单模型产品页、AR | [model-viewer](https://github.com/google/model-viewer) | Web Component，几乎不写 Three API |
| React 配置器 / 3D 官网 | [react-three-next](https://github.com/pmndrs/react-three-next) + [drei](https://github.com/pmndrs/drei) | 持久 canvas、生态最全 |
| Vue 孪生 / 大屏 | [three-vue-tres](https://github.com/hawk86104/three-vue-tres) | 国内孪生落地栈 |
| 3D 编辑器 / 搭建器 | [pascalorg/editor](https://github.com/pascalorg/editor) | monorepo + core/viewer 分层 |
| IFC/BIM 全楼 | [xeokit-sdk](https://github.com/xeokit/xeokit-sdk) | 双精度、XKT，**非 Three** |
| 快速 R3F 脚手架 | [pmndrs/create](https://github.com/pmndrs/create) | 官方 CLI |

---

## 项目对照表

| 项目 | Stars≈ | 栈 | 可借鉴点 |
|------|--------|-----|----------|
| [react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 30k | R3F + Three | 声明式 3D = 引擎层另一种实现 |
| [drei](https://github.com/pmndrs/drei) | 9.6k | R3F 助手库 | Environment、Bounds、Html、useGLTF |
| [model-viewer](https://github.com/google/model-viewer) | 8.1k | Web Component | 最轻量产品 3D，`<model-viewer src="">` |
| [pascalorg/editor](https://github.com/pascalorg/editor) | 16k | R3F + Turborepo | `@pascal-app/core` / `viewer` / `apps/editor` |
| [react-three-next](https://github.com/pmndrs/react-three-next) | 2.8k | Next + R3F | **路由切换不重建 canvas** |
| [three-vue-tres](https://github.com/hawk86104/three-vue-tres) | 2.3k | Vue3 + Tres | 孪生平台、低代码、全端 |
| [Meteor3DEditor](https://github.com/nikonikoCW/Meteor3DEditor) | 20+ | Vue3 + Three | 场景序列化、GIS、Draco LOD |
| [xeokit-sdk](https://github.com/xeokit/xeokit-sdk) | 900+ | 自研 WebGL | BIM 孪生超大模型 |
| [pmndrs/create](https://github.com/pmndrs/create) | — | CLI | `npm create @react-three --drei --zustand` |

---

## React 生态（pmndrs）

### react-three-fiber + drei

**适用**：React 主力、组件化 3D、需要 postprocessing / physics。

业界默认组合：

```bash
npm create @react-three my-app -- --drei --zustand --postprocessing
```

与自研引擎层对照：

| 自研 `3d-core` | R3F 等价 |
|----------------|----------|
| SceneManager | `<Canvas>` |
| AssetLoader.load | `useGLTF` + Suspense |
| preset product | `<Environment>` + `<OrbitControls>` |
| syncDevices | `useFrame` + zustand |

[drei 文档](https://pmndrs.github.io/drei) 中 **生产常用**：`Environment`、`Center`、`Bounds`、`Html`、`useGLTF`、`PresentationControls`。

### react-three-next

**核心模式**：Layout 里 **一个持久 `<Canvas>`**，页面只换 3D 子树——避免 SPA 每页 new WebGLRenderer（泄漏根源之一）。

借鉴到 Vue：在 `App.vue` 挂单次 canvas，路由只换 scene 内容（或 iframe 隔离）。

### pascalorg/editor（高星编辑器参考）

Monorepo 拆分（与 [03 目录](./03-project-structure.md) 一致）：

```
@pascal-app/core     → 场景状态、schema、几何系统（≈ 3d-core）
@pascal-app/viewer   → R3F 渲染（≈ 3d-react）
apps/editor          → UI、工具（≈ apps/product-site）
```

技术栈：Turborepo、Zustand、Zod、R3F、WebGPU。**学结构，不必学 CSG 业务**。

---

## Vue / 国内孪生平台

### three-vue-tres（TvT.js）

- **定位**：三维可视化 / 孪生 **前端底座**，Apache 2.0 商用
- **栈**：Vue3 + TresJS + FesJS（路由、Pinia、布局）
- **能力**：低代码编辑器、Web/小程序/App、WebGPU 路线

**借鉴**：国内孪生投标/交付常要求 Vue + 国产化；可参考其 **插件化、编辑器 + 运行时** 分离，而非 fork 全量代码。

### Meteor3DEditor

- **定位**：Three + Vue3 **低代码**孪生/IoT 大屏
- **借鉴点**（与 [04 资源管线](./04-asset-pipeline.md) 高度相关）：
  - glTF 上传 → 自动生成 LOD + Draco
  - 场景 JSON 序列化 / 加载
  - GIS WGS84 ↔ 本地坐标
  - 内置 FPS、三角面数监控（见 [06 质量](./06-quality-and-delivery.md)）

---

## 编辑器与低代码

| 项目 | 说明 |
|------|------|
| [Triplex](https://github.com/pmndrs/triplex) | R3F 可视化编辑，VS Code 插件 |
| Pascal Editor | 完整 Web 3D 搭建 + core/viewer 分层 |
| Meteor3DEditor | 孪生低代码 + GIS |

**工程结论**：编辑器产物应是 **JSON 场景描述 + glb 资源 URL**，运行时由 `3d-core` 解析——业务页不嵌编辑器代码。

---

## BIM / 超大模型（非 Three 为主）

### xeokit-sdk

- **场景**：整栋 IFC/BIM、点云、双精度坐标
- **格式**：XKT（自研压缩）、也支持 glTF
- **与 Three 关系**：并列选型，不是 Three 上层

**何时不用 Three 硬扛**：

- 单模型 > 千万三角、需构件级 metadata（IFC 属性）
- 要内置剖切、X-Ray、BCF

**何时 Three + glTF 够用**：产品级零件、园区 **外观**孪生、营销展示。

详见 [17 GIS 融合](../advanced/17-gis-coordinates.md)。

---

## 从开源项目反推工程规范

对照高星项目，可固化进团队规范：

| 规范 | 出处 |
|------|------|
| 业务不 import `three` | Pascal core/viewer 分离、TvT 底座 |
| monorepo + 单 three 版本 | Pascal Turborepo |
| `useGLTF.preload` / 资源 cache | drei、R3F 生态 |
| 持久 Canvas / 单 Renderer | react-three-next |
| 场景 JSON + CDN glb | Meteor3DEditor |
| 轻量产品用 Web Component | model-viewer |
| 状态在 Zustand/Pinia，3D 只读 | Pascal、DigitalTwin 类 demo |
| CI：gltf-validator | 多数编辑器项目隐含要求 |
| 性能面板：FPS、triangles | Meteor3DEditor、Stats |

**model-viewer 适用边界**：

```html
<!-- 仅需旋转查看 glb + AR，无需自研引擎 -->
<model-viewer src="/models/chair.glb" camera-controls auto-rotate shadow-intensity="1" />
```

再要 **换色、拆件、孪生数据** → 必须 Three + 引擎层，model-viewer 不够。

---

## 推荐阅读顺序

1. 产品页极简 → 读 model-viewer 文档  
2. React 团队 → `npm create @react-three`，读 react-three-next  Layout  
3. Vue 孪生 → three-vue-tres 文档 + [18 R3F/Tres](../advanced/18-r3f-tres.md)  
4. 架构师 → pascalorg/editor 的 packages 划分  
5. BIM 投标 → xeokit 官方 demo  

---

## 导航

- [工程目录](./README.md)
- 上一篇：[06 · 质量与交付](./06-quality-and-delivery.md)
- 技术选型：[02 · 技术选型](./02-tech-selection.md)
- 基础系列：[Three.js 从零到能上手](../README.md)
