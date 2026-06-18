---
title: 进阶 · 粒子系统
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Particles
---

# 进阶 · 粒子系统

> Demo：[11-particles](http://localhost:5173/examples/11-particles/) · 5000 点、additive 混合

---

## 适用场景

- 大屏「数据流」「告警火花」
- 雨雪、粉尘、星空背景
- 性能敏感：用 **POINTS** 而非大量三角面

---

## 绘制模式

```js
gl.drawArrays(gl.POINTS, 0, particleCount);
```

顶点着色器设置点大小：

```glsl
gl_PointSize = u_pointSize * (1.0 + a_position.y * 0.05);
```

片段着色器用 `gl_PointCoord` 画圆（否则是方块）：

```glsl
vec2 c = gl_PointCoord - vec2(0.5);
if (dot(c, c) > 0.25) discard;
```

---

## Additive 混合

发光叠加效果：

```js
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // 源 + 目标，越叠越亮
```

普通透明用 `gl.ONE_MINUS_SRC_ALPHA`。

---

## 动画：bufferSubData

每帧更新 CPU 侧 position 数组，上传到 GPU：

```js
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
```

粒子上万时考虑：

- WebGL2 **Transform Feedback**（GPU 算位置）
- WebGPU **Compute Shader**
- Three.js `Points` + `BufferAttribute` 同样模式

---

## Three.js 对照

```js
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const mat = new THREE.PointsMaterial({
  size: 4,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const points = new THREE.Points(geo, mat);
```

---

## 练习

1. 改 `blendFunc` 为普通 alpha，对比视觉。
2. 粒子数改 500 / 50000，看帧率（Performance 面板）。
3. 在 FS 里按 `gl_FragCoord` 做径向渐变。
4. 用 `THREE.Points` 复现 Demo。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[01 拾取](./01-picking.md)
- 下一篇：[03 热力 Shader](./03-heatmap-shader.md)
