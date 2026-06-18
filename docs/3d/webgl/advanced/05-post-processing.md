---
title: 进阶 · 后处理链
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Post-processing
---

# 进阶 · 后处理链

> Demo：[15-blur-post](http://localhost:5173/examples/15-blur-post/) · 分离式高斯模糊  
> 基于 [15 FBO](../15-framebuffer.md) 与 [08-fbo-grayscale](http://localhost:5173/examples/08-fbo-grayscale/) 扩展。

**交互**：按 **B** 切换原图 / 模糊。

---

## 后处理是什么

场景先渲染到 **离屏纹理**，再经一系列 **全屏 Pass**（一个四边形 + 片段着色器）输出到屏幕。

```
Scene → RT1 → Pass(blur) → RT2 → Pass(bloom) → Screen
```

Three.js `EffectComposer` 即此模式的封装。

---

## 最小 Pass 结构

```js
function fullscreenPass(gl, program, inputTex, uniforms = {}) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.disable(gl.DEPTH_TEST);
  gl.useProgram(program);
  // bind quad vbo, set u_texture = inputTex
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.enable(gl.DEPTH_TEST);
}
```

每个 Pass 读写不同 FBO，**乒乓缓冲**（RT A → Pass → RT B → Pass → screen）。

---

## 常用 Pass

| Pass | 作用 | 核心 |
|------|------|------|
| 灰度 | 监控风 | `dot(rgb, vec3(0.299,0.587,0.114))` |
| 高斯模糊 |  glow 前置 | 9 tap 或 separable 横/竖两次 |
| Bloom | 亮部发光 | threshold → blur → add |
| FXAA | 抗锯齿 | 边缘检测 + 混合 |
| Outline | 选中描边 | 深度/normal 差分或 stencil |

---

## Separable Blur（性能）

2D 高斯 O(n²) → 拆成 **水平 + 竖直** 各 O(n)：

```glsl
// 横 pass：只采样 u 方向偏移
sum += texture(u_tex, v_uv + vec2(offset * i, 0)) * weight;
```

Two pass 比 one pass 9×9 核快很多。

---

## Bloom 简流程

1. Scene → HDR color RT
2. Bright pass：`max(color - threshold, 0)`
3. Blur bright（2 pass）
4. Composite：`scene + blur * intensity`

移动端可降 RT 分辨率、关 bloom。

---

## Three.js EffectComposer

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(size, strength, radius, threshold));
// loop: composer.render() 而非 renderer.render()
```

---

## 练习

1. 在 08 Demo 加 **横 blur Pass**（乒乓 FBO）。
2. 实现 **vignette**：`col *= smoothstep(0.8, 0.2, distance(uv, 0.5))`。
3. Three.js 同场景开/关 Bloom，Spector 数 pass 次数。
4. 读 [Three.js 进阶 12 后处理](../../threejs/advanced/12-post-processing.md) 对照 API。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[04 阴影](./04-shadow-mapping.md)
- 下一篇：[06 Cubemap](./06-cubemap-skybox.md)
