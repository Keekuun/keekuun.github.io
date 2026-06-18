---
title: 19 · WebGPU 与性能前瞻
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGPU
---

# 19 · WebGPU 与性能前瞻

> WebGPURenderer 现状、与 WebGL 差异，以及新项目技术选型建议。

---

## 目录

- [适用场景](#适用场景)
- [WebGL vs WebGPU](#webgl-vs-webgpu)
- [Three.js 中的 WebGPU](#threejs-中的-webgpu)
- [特性检测与回退](#特性检测与回退)
- [迁移注意点](#迁移注意点)
- [2026 选型建议](#2026-选型建议)
- [进阶系列回顾](#进阶系列回顾)
- [导航](#导航)

---

## 适用场景

| 情况 | 建议 |
|------|------|
| 现有 WebGL 项目维护 | 继续 WebGL，稳定 |
| 新项目 POC | 可试 WebGPURenderer + WebGL 回退 |
| 大量 compute / 粒子 | WebGPU 潜力大，Three API 仍在演进 |
| 必须支持旧 Android WebView | **WebGL** |
| 甲方无特殊要求 | **WebGL 默认**，WebGPU 作增强 |

**结论**：工业交付仍以 **WebGLRenderer** 为主；WebGPU 关注即可，不宜硬切。

---

## WebGL vs WebGPU

| | WebGL 2 | WebGPU |
|--|---------|--------|
| API 风格 | 状态机 OpenGL ES | 现代命令缓冲 |
| 浏览器 | 极广 | Chrome/Edge 好；Safari 逐步支持 |
| Three 成熟度 | 完全 | r150+ 实验→逐步稳定 |
| 后处理/材质 | 全支持 | 部分 addon 未移植 |
| 调试工具 | 成熟 | 较少 |

---

## Three.js 中的 WebGPU

```js
import { WebGPURenderer } from 'three/webgpu';

let renderer;

async function init() {
  if (navigator.gpu) {
    try {
      renderer = new WebGPURenderer({ antialias: true });
      await renderer.init();
    } catch (e) {
      console.warn('WebGPU init failed', e);
    }
  }
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  }
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
}
```

API 与 WebGLRenderer 尽量对齐（`render(scene, camera)`），但 **部分 Material/Pass 行为不同**，需回归测试。

### 可运行对照

| 实验 | 链接 | 练什么 |
|------|------|--------|
| Lab 11 | [WebGPURenderer + 回退](http://localhost:5174/labs/11-webgpu-renderer/) | 单渲染器、与 Lab 02 同场景 |
| Lab 12 | [WebGL vs WebGPU 并排](http://localhost:5174/labs/12-webgl-vs-webgpu/) | 2000 InstancedMesh、记录 FPS 与浏览器版本 |
| WebGL 原生 | [19 三角](http://localhost:5173/examples/19-webgpu-triangle/) · [21 Compute](http://localhost:5173/examples/21-webgpu-compute/) | WGSL 管线、Compute 粒子 |
| 文档 | [WebGPU 选型](../../webgl/webgpu/README.md) · [02 Compute](../../webgl/webgpu/02-compute-particles.md) | 底层概念 |

Node Material（`MeshStandardNodeMaterial`）是 WebGPU 路线配套，与经典 Material 并存，学习成本另计。

---

## 特性检测与回退

```js
async function createRenderer(container) {
  if (navigator.gpu) {
    try {
      const { WebGPURenderer } = await import('three/webgpu');
      const r = new WebGPURenderer({ antialias: true });
      await r.init();
      return { renderer: r, backend: 'webgpu' };
    } catch (e) {
      console.warn('WebGPU init failed', e);
    }
  }
  return {
    renderer: new THREE.WebGLRenderer({ antialias: true }),
    backend: 'webgl',
  };
}
```

上线 **双路径**：Analytics 记录 backend 占比，WebGPU 异常率高于 WebGL 则默认 WebGL。

---

## 迁移注意点

1. **postprocessing**：EffectComposer 部分 Pass 仅 WebGL；WebGPU 用 TSL 节点链
2. **ShaderMaterial**：GLSL 不能直拷 WebGPU；需 WGSL 或 Node 系统
3. **Instancing / LOD**：概念相同，实现已支持，仍要测
4. **dispose**：同样必须，context 泄漏问题仍在
5. **CI**：Pipeline 加 WebGL 为主；WebGPU 可选 job

---

## 2026 选型建议

```
新项目默认：WebGLRenderer + three r16x
         ↓
    目标用户浏览器够新？
         ↓ 是
    POC WebGPU 帧率/特性有收益？
         ↓ 是
    双渲染器 + feature flag
         ↓ 否
    保持 WebGL 至生态成熟
```

性能优化优先级仍高于换 API：[09 减面/LOD/dispose](./../09-performance-and-dispose.md) > 换 WebGPU。

---

## 进阶系列回顾

| 篇 | 主题 |
|----|------|
| [11](./11-hdri-and-environment.md) | HDRI |
| [12](./12-post-processing.md) | 后处理 |
| [13](./13-animation-and-camera.md) | 动画运镜 |
| [14](./14-large-scene-loading.md) | 大场景 |
| [15](./15-html-labels.md) | HTML 标注 |
| [16](./16-custom-shader.md) | Shader |
| [17](./17-gis-coordinates.md) | GIS |
| [18](./18-r3f-tres.md) | R3F/Tres |
| [19](./19-webgpu.md) | WebGPU |

基础系列：[01–10](../README.md)

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[18 · R3F / Tres](./18-r3f-tres.md)
- 基础系列：[Three.js 从零到能上手](../README.md)
