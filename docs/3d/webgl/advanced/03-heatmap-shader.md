---
title: 进阶 · 热力渐变 Shader
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Shader
- 数字孪生
---

# 进阶 · 热力渐变 Shader

> Demo：[12-shader-gradient](http://localhost:5173/examples/12-shader-gradient/) · 16×16 网格、温度 0–1 驱动颜色

---

## 适用场景

- 孪生园区：设备温度、负载着色
- 大屏 3D 块：区域告警红绿渐变
- Three.js 进阶 [16 Shader](../../threejs/advanced/16-custom-shader.md) 的 WebGL 原版

---

## 数据从哪来

业务 API → JS 数组 → **attribute 或 uniform**：

```js
// 每顶点一个 heat 值（本 Demo）
geo.setAttribute('heat', new Float32Array(heats));

// 或 uniform 传纹理（大网格时用 2D data texture）
gl.uniform1fv(heatLoc, heatArray);
```

Demo 每 0.5s 随机 walk 模拟 WebSocket 推送：

```js
heatData[i] += (Math.random() - 0.5) * 0.08;
gl.bufferSubData(gl.ARRAY_BUFFER, 0, heats);
```

---

## 分段调色函数

在片段着色器里用 `mix` 做多段渐变（比 1D 纹理更灵活）：

```glsl
vec3 heatColor(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.33) return mix(vec3(0.1,0.2,0.8), vec3(0.2,0.9,0.4), t / 0.33);
  if (t < 0.66) return mix(vec3(0.2,0.9,0.4), vec3(1.0,0.9,0.1), (t-0.33)/0.33);
  return mix(vec3(1.0,0.9,0.1), vec3(1.0,0.15,0.05), (t-0.66)/0.34);
}
```

蓝 → 绿 → 黄 → 红，符合运维大屏习惯。

---

## 工程注意

| 点 | 建议 |
|----|------|
| 更新频率 | 数据 1s 变一次不必 60fps 改 buffer |
| 精度 | 热力用 float attribute，避免 byte 量化断层 |
| 与 PBR 并存 | 热力时切 `ShaderMaterial`，常态用 Standard |
| 图例 | 2D DOM 色条比 3D 文字清晰 |

---

## Three.js ShaderMaterial

```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    u_maxHeat: { value: 100 },
  },
  vertexShader: `... varying float vHeat; ...`,
  fragmentShader: `... heatColor(vHeat) ...`,
});
geometry.setAttribute('heat', new THREE.BufferAttribute(heats, 1));
```

---

## 练习

1. 阈值以上闪红：FS 里 `if (v_heat > 0.8) col *= sin(time*10.)*0.5+1.0`。
2. 接真实 API：`fetch('/api/heatmap').then` 填 `heatData`。
3. 改成 **uniform 1D 调色纹理**（256×1），对比分段 mix。
4. 在 Three.js 项目里用同样 palette 做 `ShaderMaterial`。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[02 粒子](./02-particles.md)
- 下一篇：[04 阴影贴图](./04-shadow-mapping.md)
