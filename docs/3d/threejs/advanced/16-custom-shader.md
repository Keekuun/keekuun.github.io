---
title: 16 · 自定义 Shader 入门
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Shader
- GLSL
---

# 16 · 自定义 Shader 入门

> ShaderMaterial、uniform 传参与业务数据绑定：热力染色、流动管线、告警脉冲。

---

## 目录

- [适用场景](#适用场景)
- [何时不用 Shader](#何时不用-shader)
- [ShaderMaterial 结构](#shadermaterial-结构)
- [热力染色示例](#热力染色示例)
- [流动 UV 动画](#流动-uv-动画)
- [与 Mesh 原材质混合](#与-mesh-原材质混合)
- [调试技巧](#调试技巧)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 需求 | Standard 够吗 | Shader |
|------|---------------|--------|
| 换纯色 / emissive | 够 | 不必 |
| 按数值渐变热力（红→绿） | 不够 | **需要** |
| 管道流动箭头 / 条纹 | 不够 | **需要** |
| 区域扫光、扫描线 | 不够 | **需要** |
| 告警边缘脉冲 | emissive 可凑合 | Shader 更炫 |

可视化大屏、孪生 **工艺管线** 常用本章内容。产品 PBR 页一般 **不手写 Shader**。

---

## 何时不用 Shader

- 能 `material.color` / `emissive` 解决的不写 Shader（维护成本高）
- 团队无人懂 GLSL 时优先贴图动画
- 需深度理解时先读 [WebGL 04 片段着色器](../../webgl/04.md)

---

## ShaderMaterial 结构

```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorHot: { value: new THREE.Color(0xff0000) },
    uColorCold: { value: new THREE.Color(0x0000ff) },
    uIntensity: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uIntensity;
    uniform vec3 uColorHot;
    uniform vec3 uColorCold;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(uColorCold, uColorHot, uIntensity);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```

animate 里 `material.uniforms.uTime.value = clock.getElapsedTime()`。

---

## 热力染色示例

业务：`uIntensity` 接设备温度 0–1（归一化后传入）。

```js
function setDeviceHeat(mesh, normalized) {
  mesh.material.uniforms.uIntensity.value = normalized;
}

// API: temp 60°C, range 0-100
setDeviceHeat(mesh, temp / 100);
```

fragment 可改用 `smoothstep` 做柔和过渡：

```glsl
float t = smoothstep(0.2, 0.8, uIntensity);
vec3 color = mix(uColorCold, uColorHot, t);
```

---

## 流动 UV 动画

管道流向：

```glsl
// fragment
uniform float uTime;
uniform sampler2D uFlowMap;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  uv.x -= uTime * 0.3;
  vec4 tex = texture2D(uFlowMap, uv);
  gl_FragColor = tex;
}
```

`uFlowMap` 用箭头 repeat 贴图；`uTime` 每帧递增。

---

## 与 Mesh 原材质混合

保留 PBR 只加效果：用 `onBeforeCompile` 注入代码，或 **双 pass**（底层 Standard + 上层透明 Shader）。入门阶段 **单独 mesh 用 ShaderMaterial** 更简单。

```js
// 告警脉冲：改 emissive 往往够用
gsap.to(mat, { emissiveIntensity: 2, repeat: -1, yoyo: true, duration: 0.5 });
```

---

## 调试技巧

- 片元里临时 `gl_FragColor = vec4(vUv, 0.0, 1.0)` 检查 UV
- Console 报 `Shader Error` 带行号，先删改到最小能编译
- [glslsandbox](https://glslsandbox.com/) 离线试 fragment

---

## 练习

1. uniform 接 slider，实时改热力颜色。
2. 流动贴图管道，调 uTime 速度。
3. 读 [WebGL 05 GLSL](../../webgl/05.md)，给 shader 加 `precision mediump float`。
4. 孪生 mock：5 个 mesh 不同 uIntensity 表示告警等级。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[15 · HTML 标注](./15-html-labels.md)
- 下一篇：[17 · GIS 融合](./17-gis-coordinates.md)
