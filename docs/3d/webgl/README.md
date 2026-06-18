---
title: WebGL 从零到能查底层
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- WebGL2
- WebGPU
- GLSL
- 3D
---

# WebGL 从零到能查底层

> 面向已写 Three.js 业务、想搞清黑屏 / 材质 / Shader 原理的前端。**Three.js 为主，WebGL 为辅**——本系列目标是能读源码、改 Shader、定位性能，而不是手写游戏引擎。

---

## 这套系列学什么

WebGL 是浏览器里的 GPU 绘图 API，Three.js / Babylon.js 底层都走它（或 WebGPU）。本系列分三阶段：

| 阶段 | 内容 | 目标 |
|------|------|------|
| **基础 01–08** | 着色器管线、GLSL、Canvas 对比 | 知道 GPU 在画什么 |
| **进阶 09–16** | 3D 矩阵、深度、纹理、光照、FBO | 能独立画旋转立方体 + 简单光照 |
| **WebGL2** | GLSL 300 es、VAO、UBO、实例化 | 读懂 Three.js 底层优化 |
| **WebGPU 前瞻** | 与 WebGL 差异、选型 | 新项目技术评估 |

---

## 学习路线

### 阶段一 · 着色器入门（已有）

按顺序阅读，每篇附 CodePen 或本地 Demo。

| 篇 | 链接 | 内容 |
|----|------|------|
| 01 | [基础概念](./01.md) | 顶点/片段着色器、Attribute/Uniform/Varying、第一个三角形 |
| 02 | [工作原理](./02.md) | 光栅化、Varying 插值 |
| 03 | [顶点着色器](./03.md) | Buffer、normalize、Uniform 数组 |
| 04 | [片段着色器](./04.md) | 纹理采样、Uniform API |
| 05 | [GLSL 语言](./05.md) | 类型、限定符、内置函数 |
| 06 | [Canvas 与 WebGL](./06.md) | 2D Canvas 对比、context 类型 |
| 07 | [WebGL API 速查](./07.md) | 常用常量、状态、错误排查 |
| 08 | [Canvas 交互](./08.md) | 拖拽、缩放（2D，可选） |

### 阶段二 · 3D 实战（09–16）

**分水岭：09 学完应能画旋转 3D 立方体。**

| 篇 | 链接 | 内容 | 对应 Three.js 问题 |
|----|------|------|-------------------|
| 09 | [矩阵与 3D 空间](./09-matrices-and-3d.md) | MVP、透视投影、第一个 3D 立方体 | 相机/物体 transform 异常 |
| 10 | [索引缓冲](./10-index-buffer.md) | `drawElements`、复用顶点 | BufferGeometry 索引模式 |
| 11 | [深度与面剔除](./11-depth-and-culling.md) | depth test、cull face | 穿模、反面不可见 |
| 12 | [纹理映射](./12-textures.md) | UV、wrap、filter | 贴图翻转、模糊 |
| 13 | [光照模型](./13-lighting.md) | 法线、Blinn-Phong | Standard 材质发灰 |
| 14 | [多物体与多 Program](./14-multiple-objects.md) | 100 个立方体、draw call | 场景组织 |
| 15 | [渲染到纹理 FBO](./15-framebuffer.md) | 离屏渲染、镜子效果 | RenderTarget、后处理 |
| 16 | [调试与工具](./16-debugging.md) | Spector.js、常见编译错误 | 日常排错 |

### 阶段三 · WebGL2

| 篇 | 链接 | 内容 |
|----|------|------|
| — | [WebGL2 系列目录](./webgl2/README.md) | 路线与浏览器支持 |
| 01 | [GLSL 300 es 迁移](./webgl2/01-glsl-300-es.md) | `#version 300 es`、`in/out` |
| 02 | [VAO 与 UBO](./webgl2/02-vao-and-ubo.md) | 顶点数组对象、Uniform 缓冲 |
| 03 | [实例化绘制](./webgl2/03-instancing.md) | `drawArraysInstanced` |
| 04 | [3D 纹理与 MRT](./webgl2/04-3d-textures-and-mrt.md) | 多渲染目标 · Demo [22](http://localhost:5173/examples/22-webgl2-mrt/) |

### 阶段四 · WebGPU 前瞻

| 篇 | 链接 | 内容 |
|----|------|------|
| — | [WebGPU 选型与跟进](./webgpu/README.md) | 标准进展、与 WebGL 对照、Three.js 接入 |
| 01 | [第一个三角形 WGSL](./webgpu/01-first-triangle.md) | Pipeline、BindGroup、CommandEncoder |
| 02 | [Compute 粒子](./webgpu/02-compute-particles.md) | Storage buffer、Compute + Render |
| Demo | [19-webgpu-triangle](http://localhost:5173/examples/19-webgpu-triangle/) · [21-compute](http://localhost:5173/examples/21-webgpu-compute/) | 可运行 WGSL |

### 实践实验室 · 可运行 Demo

本地一键启动：

```bash
pnpm --dir apps/webgl-demos install
pnpm webgl:dev
```

打开 http://localhost:5173 ，**22 个**示例对应文档章节。

| 资源 | 链接 |
|------|------|
| 实验导读 | [实践实验室](./practices/README.md) |
| 轨道相机 | [实践 · 轨道相机](./practices/02-orbit-camera.md) |
| 源码 | `apps/webgl-demos/` |

### 阶段五 · 进阶教程

| 篇 | 链接 | 内容 |
|----|------|------|
| — | [进阶系列目录](./advanced/README.md) | 拾取、粒子、热力、阴影、后处理 |
| 01 | [射线拾取](./advanced/01-picking.md) | CPU Raycast + AABB |
| 02 | [粒子系统](./advanced/02-particles.md) | POINTS、additive |
| 03 | [热力 Shader](./advanced/03-heatmap-shader.md) | 孪生/大屏染色 |
| 04 | [阴影贴图](./advanced/04-shadow-mapping.md) | Shadow Map、PCF |
| 05 | [后处理链](./advanced/05-post-processing.md) | Bloom、Blur |
| 06 | [Cubemap 天空盒](./advanced/06-cubemap-skybox.md) | 环境贴图、IBL 概念 |
| 07 | [法线贴图](./advanced/07-normal-mapping.md) | TBN、normalMap |
| 08 | [Bloom 辉光](./advanced/08-bloom.md) | 亮部 glow |

---

## 与 Three.js 系列的关系

```
Three.js 01–10（日常开发主战场）
        ↓ 遇到 Shader / 黑屏 / 性能
WebGL 01–08（概念）
        ↓
WebGL 09–16（3D 实战）
        ↓ 读 Three.js 源码、写自定义 Shader
Three.js 进阶 16 Shader ←→ WebGL 13 光照
Three.js 进阶 12 后处理 ←→ WebGL 15 FBO
Three.js 进阶 19 WebGPU ←→ WebGL webgpu/
```

- Three.js 基础：[Three.js 从零到能上手](../threejs/README.md)
- Three.js 进阶：[进阶系列规划](../threejs/advanced/README.md)

---

## 推荐学习方式

1. **先跑通 Three.js 02 旋转立方体**，再回来看 WebGL 09——有画面参照学矩阵更快。
2. **每篇改 3 个参数**：FOV、相机 z、物体颜色，观察变化。
3. **本地用 Vite vanilla**，不要用框架封装 WebGL。
4. **对照官方教程**：本系列是精简路线，细节可查 [WebGL Fundamentals 中文](https://webglfundamentals.org/webgl/lessons/zh_cn/)。

---

## 环境与工具

| 项 | 建议 |
|----|------|
| 运行时 | Node 18+ |
| **本仓库 Demo** | `pnpm webgl:dev` → [apps/webgl-demos](../../apps/webgl-demos/) |
| 脚手架 | `pnpm create vite webgl-demo --template vanilla` |
| 工具库 | 本仓库 `shared/gl-utils.js`、`shared/m4.js`；或 [webglfundamentals](https://webglfundamentals.org/webgl/resources/webgl-utils.js) |
| 调试 | Chrome DevTools、 [Spector.js](https://spector.babylonjs.com/) |
| 浏览器 | Chrome；WebGL2 需 `getContext('webgl2')` |

---

## Web 图形 API 现状（2026）

| API | 状态 | 说明 |
|-----|------|------|
| WebGL 1 | 已冻结 | 兼容兜底，不再加特性 |
| WebGL 2 | 已冻结 | 现代浏览器 ~97%+ 支持，**WebGL 学习终点** |
| WebGPU | W3C CR | Chrome / Firefox / Safari 默认支持；新项目长期方向 |

WebGL 不会消失，但也不会再进化。工业项目常见策略：**WebGPU 优先 + WebGL2 回退**。

---

## 参考资源

### 教程

- [WebGL Fundamentals 中文](https://webglfundamentals.org/webgl/lessons/zh_cn/)
- [WebGL2 Fundamentals 中文](https://webgl2fundamentals.org/webgl/lessons/zh_cn/)
- [WebGPU Fundamentals](https://webgpufundamentals.org/)

### 标准与跟进

- [Khronos WebGL Registry](https://registry.khronos.org/webgl/)
- [W3C WebGPU](https://www.w3.org/TR/webgpu/)
- [WebGPU Implementation Status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status)
- [Three.js Releases](https://github.com/mrdoob/three.js/releases)

### 状态图

- [WebGL State Diagram](https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html)
- [WebGL2 State Diagram](https://webgl2fundamentals.org/webgl/lessons/resources/webgl-state-diagram.html)

### 视频

[WebGL + WebGPU Meetup LIVE](https://www.youtube.com/watch?v=oWwtCDv3Pgg)

<iframe width="640" height="360" src="https://www.youtube.com/embed/oWwtCDv3Pgg" title="WebGL + WebGPU Meetup LIVE!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

---

## 最小 GLSL 示例

```js
'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vsGLSL = `
void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 100.0;
}
`;

const fsGLSL = `
precision highp float;

void main() {
    gl_FragColor = vec4(1, 0.5, 0, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader));
}

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg));
}

gl.useProgram(prg);
gl.drawArrays(gl.POINTS, 0, 1);
```

---

## 导航

- 开始阅读基础：[01 · 基础概念](./01.md)
- 跳到 3D 实战：[09 · 矩阵与 3D 空间](./09-matrices-and-3d.md)
- 跑 Demo：[实践实验室](./practices/README.md)
- 进阶：[进阶教程](./advanced/README.md)
- Three.js 系列：[从零到能上手](../threejs/README.md)
