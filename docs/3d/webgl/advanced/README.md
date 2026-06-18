---
title: WebGL 进阶教程
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Shader
- Advanced
---

# WebGL 进阶教程

> 完成 [09–16](../16-debugging.md) 与 [实践实验室](../practices/README.md) 后再读。面向 **自定义 Shader、孪生可视化、后处理** 场景。

---

## 前置

- 能独立写旋转立方体 + 光照 + FBO
- 本地跑通 `pnpm webgl:dev`
- 可选：Three.js [进阶 16 Shader](../../threejs/advanced/16-custom-shader.md)

---

## 章节规划

| 篇 | 链接 | 内容 | Demo |
|----|------|------|------|
| 01 | [射线拾取](./01-picking.md) | 屏幕 → NDC → 逆矩阵 → AABB | [10-picking](http://localhost:5173/examples/10-picking/) |
| 02 | [粒子系统](./02-particles.md) | POINTS、additive、bufferSubData | [11-particles](http://localhost:5173/examples/11-particles/) |
| 03 | [热力渐变 Shader](./03-heatmap-shader.md) | attribute 传业务值、分段调色 | [12-shader-gradient](http://localhost:5173/examples/12-shader-gradient/) |
| 04 | [阴影贴图入门](./04-shadow-mapping.md) | 光源 VP、depth FBO、PCF | [13-shadow-mapping](http://localhost:5173/examples/13-shadow-mapping/) |
| 05 | [后处理链](./05-post-processing.md) | 分离 Blur、乒乓 FBO | [15-blur-post](http://localhost:5173/examples/15-blur-post/) |
| 06 | [环境 Cubemap](./06-cubemap-skybox.md) | 天空盒、samplerCube | [14-skybox](http://localhost:5173/examples/14-skybox/) |
| 07 | [法线贴图概念](./07-normal-mapping.md) | TBN、normalMap | [16-normal-map](http://localhost:5173/examples/16-normal-map/) |
| 08 | [Bloom 辉光](./08-bloom.md) | 亮部提取 + blur 叠加 | [17-bloom-post](http://localhost:5173/examples/17-bloom-post/) |

---

## 三条进阶路径

### 孪生 / 大屏

```
03 热力 → 02 粒子 → 01 拾取 → Three.js 15 标注
```

### 产品展示

```
01 拾取 → 07 法线贴图 → 04 阴影 → Three.js 11 HDRI
```

### 引擎向

```
04 阴影 → 05 后处理 → WebGL2 MRT → WebGPU 前瞻
```

---

## 与 Three.js 进阶对照

| WebGL 进阶 | Three.js 进阶 |
|------------|---------------|
| 03 热力 Shader | 16 自定义 Shader |
| 05 后处理 | 12 EffectComposer |
| 04 阴影 | 06 光与阴影 |
| 01 拾取 | 08 Raycaster |

---

## 导航

- [WebGL 主系列](../README.md)
- [实践实验室](../practices/README.md)
- 开始：[01 · 射线拾取](./01-picking.md)
