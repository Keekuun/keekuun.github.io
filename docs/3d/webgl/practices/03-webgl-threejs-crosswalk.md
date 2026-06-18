---
title: WebGL ↔ Three.js Demo 对照
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGL
- Three.js
tags:
- WebGL
- Three.js
- Practice
---

# WebGL ↔ Three.js Demo 对照

> 底层 WebGL Demo（`apps/webgl-demos`）与 Three.js Lab（`apps/threejs-demos`）讲同一概念时的并排索引。  
> 建议：**先 WebGL 看清数据流，再 Three.js 看引擎封装**。

---

## 启动命令

| 项目 | 命令 | 默认端口 |
|------|------|----------|
| WebGL Demos | `pnpm webgl:dev` | 5173 |
| Three.js Demos | `pnpm threejs:dev` | 5174 |

---

## 基础与场景

| 概念 | WebGL Demo | Three.js Lab | 文档 |
|------|------------|--------------|------|
| 第一个图元 | [01-triangle](http://localhost:5173/examples/01-triangle/) | — | [WebGL 01](../01.md) |
| 3D 立方体 / MVP | [02-cube-rotate](http://localhost:5173/examples/02-cube-rotate/) | [02-first-scene](http://localhost:5174/labs/02-first-scene/) | [09 矩阵](../09-matrices-and-3d.md) · [Three 02](../../threejs/02-first-scene.md) |
| 索引缓冲 | [03-cube-indexed](http://localhost:5173/examples/03-cube-indexed/) | （引擎内置） | [10 索引](../10-index-buffer.md) |
| 深度测试 | [04-depth-cubes](http://localhost:5173/examples/04-depth-cubes/) | — | [11 深度](../11-depth-and-culling.md) |
| 纹理 | [05-textured-cube](http://localhost:5173/examples/05-textured-cube/) | [05-materials](http://localhost:5174/labs/05-materials/) | [12 纹理](../12-textures.md) |
| 光照 | [06-lit-cube](http://localhost:5173/examples/06-lit-cube/) | [06-lights-shadows](http://localhost:5174/labs/06-lights-shadows/) | [13 光照](../13-lighting.md) |
| 轨道相机 | [07-orbit-camera](http://localhost:5173/examples/07-orbit-camera/) | [08-interaction](http://localhost:5174/labs/08-interaction/) | [02 轨道相机](./02-orbit-camera.md) |
| 场景图 / 父子 | — | [03-solar-system](http://localhost:5174/labs/03-solar-system/) | [Three 03](../../threejs/03-scene-graph-and-coordinates.md) |
| 相机 FOV | — | [04-camera-fov](http://localhost:5174/labs/04-camera-fov/) | [04 相机](../../threejs/04-camera.md) |

---

## 进阶渲染

| 概念 | WebGL Demo | Three.js Lab | 文档 |
|------|------------|--------------|------|
| 拾取 | [10-picking](http://localhost:5173/examples/10-picking/) | [08-interaction](http://localhost:5174/labs/08-interaction/) | [进阶 01](../advanced/01-picking.md) |
| 粒子 | [11-particles](http://localhost:5173/examples/11-particles/) | — | [进阶 02](../advanced/02-particles.md) |
| Shader 数据可视化 | [12-shader-gradient](http://localhost:5173/examples/12-shader-gradient/) | [P3-dashboard-3d](http://localhost:5174/portfolio/p3-dashboard-3d/) | [进阶 03](../advanced/03-heatmap-shader.md) |
| 阴影 | [13-shadow-mapping](http://localhost:5173/examples/13-shadow-mapping/) | [06-lights-shadows](http://localhost:5174/labs/06-lights-shadows/) | [进阶 04](../advanced/04-shadow-mapping.md) |
| 天空盒 / Cubemap | [14-skybox](http://localhost:5173/examples/14-skybox/) | — | [进阶 06](../advanced/06-cubemap-skybox.md) |
| 后处理模糊 | [15-blur-post](http://localhost:5173/examples/15-blur-post/) | — | [进阶 05](../advanced/05-post-processing.md) |
| 法线贴图 | [16-normal-map](http://localhost:5173/examples/16-normal-map/) | — | [进阶 07](../advanced/07-normal-mapping.md) |
| Bloom | [17-bloom-post](http://localhost:5173/examples/17-bloom-post/) | — | [进阶 08](../advanced/08-bloom.md) |
| FBO / 后处理入门 | [08-fbo-grayscale](http://localhost:5173/examples/08-fbo-grayscale/) | — | [15 FBO](../15-framebuffer.md) |

---

## WebGL2 与工程化

| 概念 | WebGL Demo | Three.js Lab | 文档 |
|------|------------|--------------|------|
| 实例化 | [09-instancing](http://localhost:5173/examples/09-instancing/) | [09-dispose-stats](http://localhost:5174/labs/09-dispose-stats/) | [WebGL2 03](../webgl2/03-instancing.md) |
| VAO | [18-webgl2-vao](http://localhost:5173/examples/18-webgl2-vao/) | — | [WebGL2 02](../webgl2/02-vao-and-ubo.md) |
| UBO | [20-webgl2-ubo](http://localhost:5173/examples/20-webgl2-ubo/) | — | [WebGL2 02](../webgl2/02-vao-and-ubo.md) |
| glTF 加载 | — | [07-gltf-loader](http://localhost:5174/labs/07-gltf-loader/) | [Three 07](../../threejs/07-load-gltf.md) |
| dispose / 性能 | — | [09-dispose-stats](http://localhost:5174/labs/09-dispose-stats/) | [Three 09](../../threejs/09-performance-and-dispose.md) |
| createScene 封装 | — | [10-scene-module](http://localhost:5174/labs/10-scene-module/) | [Three 10](../../threejs/10-project-integration.md) |

---

## WebGPU

| 概念 | WebGL Demo | Three.js Lab | 文档 |
|------|------------|--------------|------|
| 第一个三角形 | [19-webgpu-triangle](http://localhost:5173/examples/19-webgpu-triangle/) | — | [WebGPU 01](../webgpu/01-first-triangle.md) |
| Compute 粒子 | [21-webgpu-compute](http://localhost:5173/examples/21-webgpu-compute/) | — | [WebGPU 02](../webgpu/02-compute-particles.md) |
| MRT G-Buffer | [22-webgl2-mrt](http://localhost:5173/examples/22-webgl2-mrt/) | — | [WebGL2 04](../webgl2/04-3d-textures-and-mrt.md) |
| WebGPURenderer | — | [11-webgpu-renderer](http://localhost:5174/labs/11-webgpu-renderer/) | [WebGPU README](../webgpu/README.md) |
| WebGL vs WebGPU FPS | — | [12-webgl-vs-webgpu](http://localhost:5174/labs/12-webgl-vs-webgpu/) | [Three 进阶 19](../../threejs/advanced/19-webgpu.md) |

---

## 推荐学习顺序（有 Three.js 目标）

```
WebGL 01 → 02 → 06 → 07
    ↓
Three.js 02 → 03 → 06 → 08
    ↓
WebGL 10（拾取原理）→ Three.js 07（glTF）
    ↓
WebGL 13（阴影原理）→ 回头看 Three 06 shadowMap
    ↓
WebGPU 19 → 21 → Three.js 11（WebGPURenderer）
```

---

## 大屏 / 产品向（仅 Three.js）

| 场景 | Demo | 文档 |
|------|------|------|
| ECharts vs Three | [01-echarts-vs-three](http://localhost:5174/labs/01-echarts-vs-three/) | [Three 01](../../threejs/01-from-dashboard-to-3d.md) |
| 产品展示 | [P1-product-viewer](http://localhost:5174/portfolio/p1-product-viewer/) | [practices 02](../../threejs/practices/02-portfolio-projects.md) |
| 数字孪生 | [P2-twin-zone](http://localhost:5174/portfolio/p2-twin-zone/) | 同上 |
| 3D 配置器 | [P4-configurator](http://localhost:5174/portfolio/p4-configurator/) | 同上 |

---

## 导航

- [WebGL 实践实验室](./README.md)
- [Three.js 微实验](../../threejs/practices/01-micro-labs-by-chapter.md)
- [WebGL 主目录](../README.md)
- [Three.js 主目录](../../threejs/README.md)
