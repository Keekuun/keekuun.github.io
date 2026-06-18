---
title: WebGL 实践实验室
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGL
tags:
- WebGL
- Practice
- Demo
---

# WebGL 实践实验室

> 每篇对应 `apps/webgl-demos` 里一个可运行示例。**先跑 Demo，再改代码，最后对照文档**。

---

## 本地环境

```bash
pnpm --dir apps/webgl-demos install
pnpm webgl:dev
```

浏览器打开 http://localhost:5173

---

## 实验列表

| 实验 | Demo | 文档 | 练什么 |
|------|------|------|--------|
| Lab 01 | [01-triangle](http://localhost:5173/examples/01-triangle/) | [01 基础概念](../01.md) | 着色器编译、第一个三角形 |
| Lab 02 | [02-cube-rotate](http://localhost:5173/examples/02-cube-rotate/) | [09 矩阵](../09-matrices-and-3d.md) | MVP、透视、动画循环 |
| Lab 03 | [03-cube-indexed](http://localhost:5173/examples/03-cube-indexed/) | [10 索引](../10-index-buffer.md) | 8 顶点 + drawElements |
| Lab 04 | [04-depth-cubes](http://localhost:5173/examples/04-depth-cubes/) | [11 深度](../11-depth-and-culling.md) | 按 D 切换 depth test |
| Lab 05 | [05-textured-cube](http://localhost:5173/examples/05-textured-cube/) | [12 纹理](../12-textures.md) | REPEAT、程序化纹理 |
| Lab 06 | [06-lit-cube](http://localhost:5173/examples/06-lit-cube/) | [13 光照](../13-lighting.md) | Blinn-Phong 参数 |
| Lab 07 | [07-orbit-camera](http://localhost:5173/examples/07-orbit-camera/) | [02 轨道相机](./02-orbit-camera.md) | 鼠标交互、球坐标相机 |
| Lab 08 | [08-fbo-grayscale](http://localhost:5173/examples/08-fbo-grayscale/) | [15 FBO](../15-framebuffer.md) | 双 pass 后处理 |
| Lab 09 | [09-instancing](http://localhost:5173/examples/09-instancing/) | [WebGL2 03](../webgl2/03-instancing.md) | 400 实例一次 draw |
| Lab 10 | [10-picking](http://localhost:5173/examples/10-picking/) | [进阶 01](../advanced/01-picking.md) | 屏幕坐标 → 射线 |
| Lab 11 | [11-particles](http://localhost:5173/examples/11-particles/) | [进阶 02](../advanced/02-particles.md) | POINTS、additive |
| Lab 12 | [12-shader-gradient](http://localhost:5173/examples/12-shader-gradient/) | [进阶 03](../advanced/03-heatmap-shader.md) | uniform 接业务数据 |
| Lab 13 | [13-shadow-mapping](http://localhost:5173/examples/13-shadow-mapping/) | [进阶 04](../advanced/04-shadow-mapping.md) | Shadow Map + PCF，按 **S** 切换 |
| Lab 14 | [14-skybox](http://localhost:5173/examples/14-skybox/) | [进阶 06](../advanced/06-cubemap-skybox.md) | Cubemap、`gl_Position.xyww` |
| Lab 15 | [15-blur-post](http://localhost:5173/examples/15-blur-post/) | [进阶 05](../advanced/05-post-processing.md) | 乒乓 FBO、分离模糊，按 **B** 切换 |
| Lab 16 | [16-normal-map](http://localhost:5173/examples/16-normal-map/) | [进阶 07](../advanced/07-normal-mapping.md) | TBN 砖墙，**N** / **+/-** |
| Lab 17 | [17-bloom-post](http://localhost:5173/examples/17-bloom-post/) | [进阶 08](../advanced/08-bloom.md) | Bloom 辉光，按 **B** |
| Lab 18 | [18-webgl2-vao](http://localhost:5173/examples/18-webgl2-vao/) | [WebGL2 02](../webgl2/02-vao-and-ubo.md) | VAO 多网格 |
| Lab 19 | [19-webgpu-triangle](http://localhost:5173/examples/19-webgpu-triangle/) | [WebGPU 01](../webgpu/01-first-triangle.md) | WGSL 三角 |
| Lab 20 | [20-webgl2-ubo](http://localhost:5173/examples/20-webgl2-ubo/) | [WebGL2 02 UBO](../webgl2/02-vao-and-ubo.md) | std140 块 |
| Lab 21 | [21-webgpu-compute](http://localhost:5173/examples/21-webgpu-compute/) | [WebGPU 02](../webgpu/02-compute-particles.md) | Compute 更新粒子 |
| Lab 22 | [22-webgl2-mrt](http://localhost:5173/examples/22-webgl2-mrt/) | [WebGL2 04](../webgl2/04-3d-textures-and-mrt.md) | MRT G-Buffer，按 **M** 预览 |

**WebGL ↔ Three.js 并排对照**：[03-webgl-threejs-crosswalk](./03-webgl-threejs-crosswalk.md)

---

## 推荐练习路径

### 路径 A · 快速打通 3D（1 周）

```
Lab 01 → 02 → 04 → 06 → 07
```

目标：能解释 Three.js 黑屏、相机、光照问题。

### 路径 B · 完整底层（2–3 周）

按 Lab 01–12 顺序，每 lab 完成文档末尾 3 道改参练习。

### 路径 C · 对接 Three.js 项目

```
Lab 06 + 10 + 12 → Three.js 基础 01–10 → 进阶 16 Shader
```

### 路径 D · 进阶渲染（第 3 周）

```
Lab 13 阴影 → 14 天空盒 → 15 模糊 → 17 Bloom → Three.js 06 / 12
```

### 路径 E · WebGPU 入门（第 4 周）

```
Lab 19 WebGPU 三角 → Lab 21 Compute 粒子 → webgpu/01–02 文档 → Three.js Lab 11 WebGPURenderer
```

---

## 改代码怎么练

每个 Demo 的 `main.js` 顶部有完整 shader 字符串，建议：

1. **只改一个 uniform**（如 FOV、光方向），保存看变化
2. **片段着色器强制纯色**，确认管线通再恢复
3. 用 Chrome **Spector.js** 抓一帧，对照 [16 调试](../16-debugging.md)

---

## 项目结构说明

```
apps/webgl-demos/
├── shared/gl-utils.js   # createProgram、createCubeGeometry…
├── shared/m4.js           # perspective、lookAt、multiply
└── examples/XX-name/
    ├── index.html
    └── main.js            # 单文件示例，方便复制到 CodePen
```

新增实验：复制 `examples/03-cube-indexed`，改 `main.js`，在根 `index.html` 的 `demos` 数组里注册。

---

## 导航

- [WebGL 系列目录](../README.md)
- [进阶教程](../advanced/README.md)
- Demo 仓库：[apps/webgl-demos/README.md](https://github.com/keekuun/keekuun.github.io/tree/master/apps/webgl-demos)
