---
title: 01 · 从传统前端到 Web 3D
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

# 01 · 从传统前端到 Web 3D

> 本篇不讲代码，建立 Three.js 的心智模型，并说明 **什么业务该用 Three.js、什么不该用**。

---

## 目录

- [适用场景：什么时候该上 Three.js](#适用场景什么时候该上-threejs)
- [和传统大屏有什么不一样](#和传统大屏有什么不一样)
- [一帧画面是怎么出来的](#一帧画面是怎么出来的)
- [ECharts 与 Three.js 的职责对照](#echarts-与-threejs-的职责对照)
- [WebGL 在栈里的位置](#webgl-在栈里的位置)
- [四个核心概念](#四个核心概念)
- [技术选型对照表](#技术选型对照表)
- [入门阶段常见误区](#入门阶段常见误区)
- [学习建议](#学习建议)
- [动手准备（不写代码）](#动手准备不写代码)
- [导航](#导航)

---

## 适用场景：什么时候该上 Three.js

| 需求 | 推荐方案 | 原因 |
|------|----------|------|
| 柱状图 / 折线 / 地图热力 | ECharts、AntV | 配置驱动，开发成本低 |
| 地球 + 飞线 + 散点（数据绑定强） | ECharts GL | 数据与 3D 透视已封装 |
| 汽车 / 家具 / 设备 **真实模型** 旋转展示 | **Three.js + glTF** | 需要加载外部 mesh、PBR 材质、部件交互 |
| 工厂 / 园区 **数字孪生**（模型 + 实时状态） | **Three.js**（大场景可能 + 瓦片/LOD） | 场景图 + 数据驱动 mesh 状态 |
| 全球地形 / 城市级 GIS | **Cesium** 或 Mapbox 3D | 地理坐标、瓦片流式加载是核心 |
| 大屏角落「3D 底座装饰」、弱业务绑定 | Three.js 或预渲染视频 | 真 3D 可交互；纯装饰可用视频降本 |
| 移动端营销 H5 轻 3D | Three.js（严格控制面数/贴图） | 需关注包体与帧率 |

**判断口诀**：要不要加载 **美术/CAD 出的三维模型**、要不要 **自由控制相机和光照**、要不要 **对模型部件做点击/换色**——三者有一，就倾向 Three.js；若只是 **数据映射到 3D 图表**，ECharts GL 往往够用。

---

## 和传统大屏有什么不一样

大屏常见流程：Vue/React 搭壳 → 接口灌数据 → ECharts `setOption` → `resize`。

ECharts 的 `globe`、`bar3D` 本质是 **图表引擎内部的 3D 投影**：你管数据和配置，不管 scene graph、不管每帧 render。

Three.js 要在浏览器里维护一个 **持续存在的 3D 世界**：

```
Scene（有什么）
  + Camera（从哪看）
  + Light（怎么亮，PBR 材质必须）
  + Renderer.render()（每帧画到 canvas）
```

差异不是 API 难背，而是 **渲染权责从库转移到应用**——包括资源加载、内存释放、帧率、交互拾取，都要自己管。前端已有的组件生命周期、状态管理、性能意识可以直接复用。

---

## 一帧画面是怎么出来的

理解这条链路，后面各章不会迷路：

```
1. JS 改 object.position / material / light ...
2. Three.js 更新 worldMatrix（场景图层级变换）
3. 遍历可见物体，按 material 类型选 shader
4. 组装 draw call 提交 GPU
5. 顶点着色器：算裁剪空间坐标
6. 光栅化
7. 片段着色器：算颜色（PBR 会算光照）
8. 输出到 canvas  framebuffer
```

ECharts 把 2–8 包在内部；Three.js 要求你 **主动调用第 5 步的入口**——`renderer.render(scene, camera)`，并自己保证 1 的数据正确。

没有 render loop，改属性也不会自动上屏；loop 空转不改属性，GPU 仍在重复画同一帧（浪费电）。

---

## ECharts 与 Three.js 的职责对照

| 大屏 / ECharts | Three.js | 备注 |
|----------------|----------|------|
| `echarts.init(dom)` | `WebGLRenderer` + canvas 挂 DOM | canvas 默认 300×150，必须 setSize |
| `setOption({ series })` | `scene.add(mesh/light/...)` | 增量更新需自己 diff 或重建 |
| 数据变更触发重绘 | 改属性 + 下一帧 `render` | 可合并多次修改为单帧 render |
| `chart.resize()` | `setSize` + `camera.aspect` + `updateProjectionMatrix` | 三步缺一可能拉伸 |
| `click` → `dataIndex` | `Raycaster` + `intersectObjects` | 需处理穿透、透明物体 |
| 内置动画配置 | `requestAnimationFrame` / GSAP / AnimationMixer | 模型骨骼动画走 Mixer |

大屏里没有「渲染循环」；Three.js 里是基础能力，[下一篇](./02-first-scene.md) 会实现。

---

## WebGL 在栈里的位置

```
应用（Three.js API）
  → Three.js（Scene、Material、Loader）
    → Shader + Buffer + Uniform
      → WebGL 2.0 API
        → GPU
```

Three.js r152+ 可选 `WebGPURenderer`，但工业项目仍以 WebGL 为主。

**何时需要翻 WebGL 笔记**（[WebGL 01](../webgl/01.md)）：

- 画面全黑 / 粉紫（shader 编译失败）
- 贴图上下颠倒、颜色发灰（gamma、colorSpace）
- 深度闪烁 z-fighting（near/far 精度）
- 性能瓶颈需看 draw call、overdraw

日常写 `MeshStandardMaterial` 不必手写 GLSL；**排查问题** 时需要知道顶点、法线、裁剪空间在干什么。

---

## 四个核心概念

**Scene**  
根容器，不是「关卡文件」。`scene.background`、`scene.environment`（HDRI 环境光）都挂在这里。`scene.fog` 可做雾效。

**Mesh = Geometry + Material**  
Geometry 存顶点、索引、法线、UV；Material 决定 shader 和贴图。同一 Geometry 可共享给多个 Mesh（instancing 进阶）。

**Camera**  
`PerspectiveCamera` 占 95% 工业场景。相机决定 viewMatrix 和 projectionMatrix，缺相机或相机在物体内部 → 全黑。

**Renderer**  
`WebGLRenderer` 维护 WebGL context、shadowMap、outputColorSpace 等。一个页面多个 3D 视图 = 多个 Renderer 或多 Viewport（进阶）。

---

## 技术选型对照表

| 库 | 强项 | 弱项 |
|----|------|------|
| Three.js | 生态最大、glTF、示例多 | 大地理场景需自建分块 |
| Babylon.js | 引擎一体化、工具链 | 国内资料相对少 |
| Cesium | 地球、GIS、3D Tiles | 非 GIS 产品页过重 |
| ECharts GL | 数据 3D 图表 | 真模型、自由相机弱 |
| PlayCanvas | 编辑器协作 | 偏游戏管线 |

本系列聚焦 Three.js，因国内 **产品展示 / 孪生 / 可视化** 岗位需求最集中。

---

## 入门阶段常见误区

**过早 R3F / TresJS**  
框架把 loop 藏进组件。第一次学用 **Vite + vanilla Three.js**，搞清 Scene/Camera/render 再封装。

**整页 copy 官方 example**  
examples 常堆 Stats、GUI、Helper。最小集：`Scene + Camera + Renderer + Mesh + animate`。

**过时教程**  
废弃 `Geometry`（非 `BufferGeometry`）、旧版 `examples/js` 路径。以 [threejs.org/docs](https://threejs.org/docs/) 为准，r150+ 全 ES Module。

**忽略 colorSpace**  
r152 起 `renderer.outputColorSpace = SRGBColorSpace`、贴图 `texture.colorSpace = SRGBColorSpace`，否则 PBR 发灰。详见 [05 · 几何与材质](./05-geometry-and-material.md)。

---

## 学习建议

1. 本地改 FOV、相机位置、材质参数，刷新观察——比只看文档有效。
2. 官方 examples 当习题：`webgl_loader_gltf`、`misc_controls_orbit`、`shadowmap`。
3. 黑屏 checklist：相机 → add → 光 → render → canvas 尺寸 → colorSpace。
4. 了解 glTF 导出（Blender）：法线、scale 应用、材质命名——模型问题占联调时间很大比例。

---

## 动手准备（不写代码）

1. [Three.js Editor](https://threejs.org/editor/)：拖物体、改相机、导出 JSON，理解场景图。
2. [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models) + [glTF Viewer](https://gltf-viewer.donmccurdy.com/)：看 mesh/material 结构。
3. 找一个熟悉的大屏页：若中间换成真 3D，列出需多管的三件事（相机、loop、模型加载），[下一篇](./02-first-scene.md) 在代码里对应。

---

## 导航

- [系列目录](./README.md)
- 下一篇：[02 · 第一个场景](./02-first-scene.md)
