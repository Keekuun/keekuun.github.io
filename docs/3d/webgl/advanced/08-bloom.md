---
title: 进阶 · Bloom 辉光
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Bloom
- Post-processing
---

# 进阶 · Bloom 辉光

> Demo：[17-bloom-post](http://localhost:5173/examples/17-bloom-post/)  
> 在 [15-blur-post](http://localhost:5173/examples/15-blur-post/) 基础上增加亮部提取 + 叠加。

**交互**：按 **B** 开关 Bloom。

---

## 流程

```
Scene → RT0
RT0 → Bright Pass（阈值 0.6）→ RT1
RT1 → Blur H → RT2 → Blur V → RT3
Screen = RT0 + RT3 × intensity
```

与 Three.js `UnrealBloomPass` 同思路，工业大屏「告警发光」常用。

---

## Bright Pass

```glsl
vec3 bright = max(color.rgb - vec3(0.6), vec3(0.0));
```

只让高亮区域进入模糊链，普通像素不参与 glow。

---

## 与 15 模糊 Demo 区别

| 15 blur-post | 17 bloom-post |
|--------------|---------------|
| 全屏统一模糊 | 只模糊亮部 |
| 单通道后处理 | 4 个 RT 乒乓 |
| 按 B 原图/模糊 | 按 B 开/关 glow 叠加 |

---

## Three.js

```js
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
composer.addPass(new UnrealBloomPass(size, strength, radius, threshold));
```

---

## 练习

1. 调 threshold `0.6 → 0.4`，看更多区域发光。
2. 改 `u_bloomOn * 1.2` 强度，观察过曝。
3. 对比 [Three.js 进阶 12 后处理](../../threejs/advanced/12-post-processing.md) OutlinePass。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[07 法线贴图](./07-normal-mapping.md)
- 相关：[05 后处理链](./05-post-processing.md)
