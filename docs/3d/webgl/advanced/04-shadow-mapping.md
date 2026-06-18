---
title: 进阶 · 阴影贴图入门
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Shadow
---

# 进阶 · 阴影贴图入门

> Demo：[13-shadow-mapping](http://localhost:5173/examples/13-shadow-mapping/) · 源码 `examples/13-shadow-mapping/main.js`  
> 理解 Three.js [06 光与阴影](../../threejs/06-lights-and-shadows.md) 里 `castShadow` / `shadowMap` 的底层。

**交互**：按 **S** 开关阴影。

---

## 思路

1. **光源视角**渲染场景深度 → 阴影贴图（depth texture）
2. **正常渲染**时，把片元变换到光源裁剪空间，比较深度
3. 当前深度 > 阴影贴图深度 → 在阴影中

```
Pass A（光源相机）: scene → shadow FBO (depth only)
Pass B（主相机）:   采样 shadowMap + 光照计算
```

---

## 光源 View-Projection

方向光用 **正交投影** 包住场景：

```js
const lightView = m4.lookAt(lightPosition, sceneCenter, [0, 1, 0]);
const lightProj = m4.orthographic(-8, 8, -8, 8, 1, 20);
const lightVP = m4.multiply(lightProj, lightView);
```

点光源用 **透视** + 6 面或 dual-paraboloid（复杂，工业常用方向光阴影）。

---

## 顶点着色器传 shadow 坐标

```glsl
uniform mat4 u_lightMatrix;
varying vec4 v_shadowCoord;

void main() {
  vec4 worldPos = u_model * vec4(a_position, 1.0);
  gl_Position = u_viewProjection * worldPos;
  v_shadowCoord = u_lightMatrix * worldPos;
}
```

片段着色器透视除法 + 0.5 偏置映射到 0~1：

```glsl
vec3 shadowCoord = v_shadowCoord.xyz / v_shadowCoord.w;
shadowCoord = shadowCoord * 0.5 + 0.5;
float depth = texture2D(u_shadowMap, shadowCoord.xy).r;
float inShadow = shadowCoord.z - 0.005 > depth ? 1.0 : 0.0;
```

---

## PCF 软阴影

单像素采样锯齿明显，取周围 3×3 平均：

```glsl
float shadow = 0.0;
for (int x = -1; x <= 1; x++) {
  for (int y = -1; y <= 1; y++) {
    float d = texture2D(u_shadowMap, shadowCoord.xy + vec2(x,y)*texelSize).r;
    shadow += shadowCoord.z - bias > d ? 1.0 : 0.0;
  }
}
shadow /= 9.0;
```

WebGL2 可用 `sampler2DShadow` 硬件 PCF。

---

## Three.js 对照

```js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
light.castShadow = true;
light.shadow.mapSize.set(2048, 2048);
mesh.castShadow = true;
mesh.receiveShadow = true;
```

内部即 shadow pass + `directionalShadowMap` uniform。

---

## 练习

1. 运行 Demo，按 **S** 对比开/关阴影。
2. 调 `bias`（Demo 里 `0.002`）观察 Peter panning 与 acne。
3. 改 `SHADOW_SIZE` 为 256 / 1024，看边缘锯齿。
4. Three.js 对比 `PCFSoftShadowMap` vs `BasicShadowMap`。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[03 热力 Shader](./03-heatmap-shader.md)
- 下一篇：[05 后处理链](./05-post-processing.md)
