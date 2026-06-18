---
title: WebGPU · 01 第一个三角形
date: 2026-06-15
isComment: true
categories:
- WebGPU
tags:
- WebGPU
- WGSL
- Tutorial
---

# WebGPU · 01 第一个三角形

> Demo：[19-webgpu-triangle](http://localhost:5173/examples/19-webgpu-triangle/)  
> 对照 [01 彩色三角形](../01.md)（WebGL）与 [WebGPU 选型](./README.md)。

---

## 与 WebGL 的差异（一眼对照）

| 步骤 | WebGL | WebGPU |
|------|-------|--------|
| 上下文 | `getContext('webgl2')` | `getContext('webgpu')` + `configure` |
| 着色器 | GLSL 字符串 | WGSL `createShaderModule` |
| 管线 | `createProgram` + `useProgram` | `createRenderPipeline`（不可变） |
| 顶点 | `bufferData` + `vertexAttribPointer` | `createBuffer` + pipeline `buffers` layout |
| Uniform | `uniform1f` | `uniform` buffer + `bindGroup` |
| 绘制 | `drawArrays` | `pass.draw()` + `queue.submit` |

WebGPU **没有全局状态机**：每帧 `CommandEncoder` → `RenderPass` → submit。

---

## 最小流程

```js
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const context = canvas.getContext('webgpu');
context.configure({ device, format: navigator.gpu.getPreferredCanvasFormat() });

const pipeline = device.createRenderPipeline({ /* vertex + fragment WGSL */ });
const bindGroup = device.createBindGroup({ /* uniform buffer */ });

// 每帧
const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass({ colorAttachments: [...] });
pass.setPipeline(pipeline);
pass.setBindGroup(0, bindGroup);
pass.setVertexBuffer(0, vertexBuffer);
pass.draw(3);
pass.end();
device.queue.submit([encoder.finish()]);
```

---

## WGSL 顶点着色器（Demo 节选）

```wgsl
@vertex
fn vs(@location(0) position: vec2f, @location(1) color: vec4f) -> VertexOut {
  // uniforms.time 驱动旋转 — 对应 WebGL uniform
}
```

语法接近 Rust：`vec4f`、`mat2x2f`、`@builtin`、`@location`。

---

## Feature Detect 与回退

Demo 在 `navigator.gpu` 不可用时显示提示文案。生产环境：

```js
if (!navigator.gpu) {
  initWebGL2Fallback(canvas);
  return;
}
```

Three.js 封装：`WebGPURenderer` + 检测失败回退 `WebGLRenderer`。

---

## 练习

1. 对比 Demo 19 与 Demo 01 的代码行数与概念数量。
2. 改 WGSL 里 `clearValue` 背景色。
3. 去掉 rotation uniform，理解 bindGroup 最小配置。
4. Three.js：`new WebGPURenderer()` 跑 [threejs-demos](https://github.com/keekuun/keekuun.github.io/tree/master/apps/threejs-demos) 同场景。

---

## 导航

- [WebGPU 选型](./README.md)
- WebGL 对照：[01 基础概念](../01.md)
- 下一篇：[WebGL2 UBO Demo](../webgl2/02-vao-and-ubo.md) · [20-webgl2-ubo](http://localhost:5173/examples/20-webgl2-ubo/)
