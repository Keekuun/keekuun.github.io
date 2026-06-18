---
title: Three.js 进阶 · 系列规划
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
- Advanced
---

# Three.js 进阶

> 基础系列 [01–10](../README.md) 完成后的延伸。共 11–19 九篇，可按项目类型选读。

---

## 前置要求

- [基础系列 01–10](../README.md)（建议含 07 glTF + 09 dispose）
- 可选：[WebGL 系列](../../webgl/README.md)（Shader 问题查 [13 光照](../../webgl/13-lighting.md)）

---

## 三条学习路径

### 路径 A · 产品 / 配置器

```
11 HDRI → 12 后处理 → 13 动画 → 18 R3F/Tres
```

### 路径 B · 数字孪生 / 园区

```
14 大场景 → 15 HTML 标注 → 16 Shader → 17 GIS
```

### 路径 C · 可视化 / 大屏 3D

```
16 Shader → 12 后处理 → 14 大场景（可选）→ 19 WebGPU
```

---

## 章节列表

| 篇 | 链接 | 内容 |
|----|------|------|
| 11 | [HDRI 与环境光照](./11-hdri-and-environment.md) | PMREM、scene.environment、产品 PBR |
| 12 | [后处理 EffectComposer](./12-post-processing.md) | Outline、Bloom、移动端降级 |
| 13 | [动画与运镜](./13-animation-and-camera.md) | Mixer、flyTo、GSAP |
| 14 | [大场景与分区加载](./14-large-scene-loading.md) | 分区 load/unload、LOD |
| 15 | [HTML 标注融合](./15-html-labels.md) | CSS2D、投影 DOM |
| 16 | [自定义 Shader 入门](./16-custom-shader.md) | 热力、流动管线 |
| 17 | [坐标系与 GIS 融合](./17-gis-coordinates.md) | 经纬度、Cesium 协作 |
| 18 | [R3F / Tres 工程实战](./18-r3f-tres.md) | React/Vue 声明式 3D |
| 19 | [WebGPU 与性能前瞻](./19-webgpu.md) | WebGPURenderer、选型 |

---

## 可运行 Demo

本地：`pnpm threejs:dev` → 首页 **进阶 · Advanced**（[threejs-demos](../../../apps/threejs-demos/README.md)）

| 篇 | Demo 路径 |
|----|-----------|
| 11 | `advanced/11-hdri` |
| 12 | `advanced/12-outline` · `12-bloom` |
| 13 | `advanced/13-animation` |
| 14–15 | `portfolio/p2-twin-zone` |
| 16 | `advanced/16-shader` |
| 17 | `advanced/17-gis` |
| 18 | `advanced/18-tres` · `18-r3f` |
| 19 | `labs/11-webgpu-renderer` · `12-webgl-vs-webgpu` |

---

## 导航

- 基础系列：[Three.js 从零到能上手](../README.md)
- 动手实践：[实践与作品集](../practices/README.md)
- 基础完结篇：[10 · 进项目](../10-project-integration.md)
- 进阶首篇：[11 · HDRI 与环境光照](./11-hdri-and-environment.md)
- WebGL：[学习路线](../../webgl/README.md) · [WebGPU 前瞻](../../webgl/webgpu/README.md)
