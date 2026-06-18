---
title: WebGL2 进阶路线
sidebar: auto
date: 2026-06-15
isComment: true
categories:
- WebGL
- WebGL2
tags:
- WebGL2
- OpenGL ES 3.0
---

# WebGL2 进阶路线

> 完成 [WebGL 09–16](../16-debugging.md) 后再学。WebGL2 基于 OpenGL ES 3.0，**标准已冻结**，是现代浏览器默认上下文。

---

## 为什么要学 WebGL2

| 能力 | WebGL1 | WebGL2 |
|------|--------|--------|
| GLSL | 1.00，`attribute/varying` | 300 es，`in/out` |
| 顶点状态 | 每次重绑 attribute | **VAO** 保存绑定 |
| 大量 Uniform | 逐个 `uniform*` | **UBO** |
| 实例化 | 扩展 | 内置 `drawArraysInstanced` |
| 3D 纹理 / 数组纹理 | 扩展 | 内置 |
| 多渲染目标 MRT | 扩展 | 内置 |
| Transform Feedback | 无 | 有 |
| 32 位索引 | 扩展 | 内置 |

Three.js `WebGLRenderer` 在 WebGL2 可用时会自动用 VAO、UBO 等优化。

---

## 浏览器支持

```js
const gl = canvas.getContext('webgl2');
if (!gl) {
  // 回退 webgl 或提示升级浏览器
}
```

2026 年桌面与主流移动浏览器支持率约 **97%+**。仍建议 feature detect，Corporate 环境可能有旧版。

---

## 学习路线

| 篇 | 链接 | Demo | 内容 |
|----|------|------|------|
| 01 | [GLSL 300 es 迁移](./01-glsl-300-es.md) | — | 语法差异、context 切换 |
| 02 | [VAO 与 UBO](./02-vao-and-ubo.md) | [18 VAO](http://localhost:5173/examples/18-webgl2-vao/) · [20 UBO](http://localhost:5173/examples/20-webgl2-ubo/) | 顶点数组对象、Uniform 缓冲 |
| 03 | [实例化绘制](./03-instancing.md) | [09 实例化](http://localhost:5173/examples/09-instancing/) | 同 mesh 画 N 份 |
| 04 | [3D 纹理与 MRT](./04-3d-textures-and-mrt.md) | [22 MRT](http://localhost:5173/examples/22-webgl2-mrt/) | G-Buffer 双附件 |

---

## 与 Three.js 进阶

| WebGL2 | Three.js |
|--------|----------|
| Instancing | `InstancedMesh` |
| UBO | 内部 material 批处理 |
| 3D Texture | `Data3DTexture` |
| MRT | 自定义后处理、G-Buffer |

---

## 参考

- [WebGL2 Fundamentals 中文](https://webgl2fundamentals.org/webgl/lessons/zh_cn/)
- [OpenGL ES 3.0 Quick Reference (PDF)](https://www.khronos.org/files/opengles3-quick-reference-card.pdf)
- [WebGL2 State Diagram](https://webgl2fundamentals.org/webgl/lessons/resources/webgl-state-diagram.html)

---

## 导航

- WebGL 主系列：[目录](../README.md)
- 上一阶段：[16 · 调试](../16-debugging.md)
- 开始：[01 · GLSL 300 es](./01-glsl-300-es.md)
- 下一阶段：[WebGPU 前瞻](../webgpu/README.md)
