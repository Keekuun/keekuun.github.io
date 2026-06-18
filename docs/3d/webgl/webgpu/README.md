---
title: WebGPU 选型与跟进
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGPU
- WebGL
tags:
- WebGPU
- WebGL
- Three.js
---

# WebGPU 选型与跟进

> 2026 年 Web 3D 的长期方向。本篇建立认知与选型框架，不要求立刻手写 WGSL 引擎。

---

## 标准与浏览器现状（2026）

| 里程碑 | 说明 |
|--------|------|
| 2023 | Chrome 113 默认支持 WebGPU |
| 2025-11 | Chrome / Firefox / Safari / Edge 均默认支持 |
| 2026-03 | W3C [WebGPU Candidate Recommendation](https://www.w3.org/TR/webgpu/) |
| 2026-03 | Chrome 146 **Compatibility Mode**（OpenGL ES 3.1 / D3D11 老 GPU） |

WebGPU **不是 WebGL 升级版**，而是全新 API，映射 Vulkan / Metal / D3D12。

---

## 三者怎么选

```
新项目评估
    │
    ├─ 要最大兼容、团队只会 Three.js → WebGLRenderer（默认）
    │
    ├─ 要算力（粒子/AI 预处理）、新项目 → WebGPURenderer + WebGL 回退
    │
    └─ 要读底层、改 Shader → 先 WebGL2，再对照 WGSL
```

| 维度 | WebGL 1/2 | WebGPU |
|------|-----------|--------|
| 编程模型 | 全局状态机 | Pipeline + Bind Group（显式） |
| Shader 语言 | GLSL | WGSL |
| Compute | 无 | 有 |
| CPU 多线程 | 主线程录命令 | Command Encoder 可 Worker 录制 |
| 生态 / 教程 | 极成熟 | 快速增长 |
| Three.js | `WebGLRenderer` | `WebGPURenderer`（r160+） |

**工业常见策略**：Feature detect → 优先 WebGPU → 回退 WebGL2。

---

## Feature Detect

```js
async function createRenderer(canvas) {
  if (navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        const device = await adapter.requestDevice();
        // 可用 WebGPURenderer 或原生 WebGPU
        return { api: 'webgpu', adapter, device };
      }
    } catch (e) {
      console.warn('WebGPU failed, fallback WebGL', e);
    }
  }
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return { api: 'webgl', gl };
}
```

老 GPU（Compatibility Mode）：

```js
const adapter = await navigator.gpu.requestAdapter({
  featureLevel: 'compatibility',
});
```

---

## Three.js 接入

```js
import { WebGPURenderer } from 'three/webgpu';

const renderer = new WebGPURenderer({ antialias: true });
await renderer.init(); // WebGPU 需 async init
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 场景图 API 与 WebGLRenderer 相同
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

与 [Three.js 进阶 19 · WebGPU](../threejs/advanced/README.md) 配套阅读。

注意：部分材质/后处理在 WebGPU 路径仍与 WebGL 有差异，上线前需实测目标机型。

---

## WebGL vs WebGPU 概念对照

| WebGL | WebGPU |
|-------|--------|
| `createShader` + `compileShader` | `createShaderModule` (WGSL) |
| `createProgram` + `linkProgram` | `createRenderPipeline` |
| `bindBuffer` + `vertexAttribPointer` | Pipeline vertex buffer layout |
| `uniform*` | Bind Group + Uniform Buffer |
| `drawArrays` | `pass.draw()` |
| `createFramebuffer` | `createTexture` + RenderPass `setTextureView` |
| — | `createComputePipeline` + `dispatchWorkgroups` |

---

## 学习路径（可选）

1. 完成 [WebGL 09–16](../16-debugging.md) + [WebGL2 01](../webgl2/01-glsl-300-es.md)
2. [WebGPU · 01 第一个三角形](./01-first-triangle.md) + Demo [19-webgpu-triangle](http://localhost:5173/examples/19-webgpu-triangle/)
3. [WebGPU · 02 Compute 粒子](./02-compute-particles.md) + Demo [21-webgpu-compute](http://localhost:5173/examples/21-webgpu-compute/)
4. [WebGPU Fundamentals](https://webgpufundamentals.org/) — 更多 WGSL 示例
5. Three.js `WebGPURenderer` 跑通现有 glTF 场景（[Lab 11](http://localhost:5174/labs/11-webgpu-renderer/)）
6. 有 Compute 需求时再深入 WGSL compute shader

不必跳过 WebGL 直接 WebGPU——**显式资源管理**的概念在 WebGL FBO/纹理里已有铺垫。

---

## 信息跟进

| 来源 | 链接 |
|------|------|
| W3C 标准 | [webgpu/spec](https://www.w3.org/TR/webgpu/) |
| 实现状态 | [gpuweb Implementation Status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) |
| Google 博客 | [web.dev WebGPU tag](https://web.dev/tags/webgpu/) |
| Three.js | [Release Notes](https://github.com/mrdoob/three.js/releases) |
| 社区 | [WebGL + WebGPU Meetup](https://www.youtube.com/@WebGLWorkshop) |

建议每季度扫一眼 Implementation Status；Three.js minor 版本看 WebGPU changelog。

---

## 导航

- WebGL 主系列：[目录](../README.md)
- WebGL2：[目录](../webgl2/README.md)
- 开始：[01 · 第一个三角形 WGSL](./01-first-triangle.md)
- Compute：[02 · GPU 粒子](./02-compute-particles.md)
- Three.js 进阶 WebGPU：[系列规划](../../threejs/advanced/README.md)
