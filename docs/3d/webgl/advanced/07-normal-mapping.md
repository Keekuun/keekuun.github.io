---
title: 进阶 · 法线贴图概念
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Normal Map
---

# 进阶 · 法线贴图概念

> Demo：[16-normal-map](http://localhost:5173/examples/16-normal-map/) · 程序化砖墙 + TBN  
> 低面数模型看起来有凹凸细节；理解 `normalMap` 在 Shader 里改了什么。

**交互**：**N** 开关法线贴图 · **+ / -** 调强度

---

## 为什么需要

几何细分高 → 顶点多、慢。  
**法线贴图**在片段着色器里 **扰动法线**，光照计算仿佛表面有细节。

---

## 切线空间（TBN）

每个顶点需要：

| 属性 | 含义 |
|------|------|
| Normal | 法线 N |
| Tangent | 切线 T |
| Bitangent | 副切线 B = N × T |

矩阵 `TBN` 把切线空间法线变到世界空间：

```glsl
mat3 tbn = mat3(normalize(T), normalize(B), normalize(N));
vec3 n = normalize(tbn * (texture2D(u_normalMap, v_uv).rgb * 2.0 - 1.0));
```

贴图 RGB 存 `(x,y,z)` 映射到 0~1。

---

## 顶点着色器传递

```glsl
varying mat3 v_tbn;
varying vec3 v_worldPos;

void main() {
  vec4 world = u_model * vec4(a_position, 1.0);
  v_worldPos = world.xyz;
  mat3 normalMatrix = mat3(u_model);
  vec3 T = normalize(normalMatrix * a_tangent);
  vec3 N = normalize(normalMatrix * a_normal);
  vec3 B = cross(N, T);
  v_tbn = mat3(T, B, N);
  gl_Position = u_viewProjection * world;
}
```

glTF 通常自带 tangent；没有则用 `computeTangents` 工具生成。

---

## 与仅漫反射贴图区别

| | diffuse map | normal map |
|---|-------------|------------|
| 改什么 |  albedo 颜色 | 光照用的法线 |
| 视觉 | 换色 | 凹凸光影 |
| 无灯时 | 可见 | 几乎无效果（需光照） |

---

## Three.js

```js
const mat = new THREE.MeshStandardMaterial({
  map: colorTex,
  normalMap: normalTex,
  normalScale: new THREE.Vector2(1, 1),
});
```

`MeshNormalMaterial` 可 debug 法线方向。

---

## 练习

1. 运行 Demo，**N** 对比平面法线 vs 法线贴图光照。
2. **+ / -** 调 `u_normalScale`，观察砖缝凹凸 exaggerate。
3. 故意去掉 TBN，直接 `n = mapN`，看光照错乱。
4. Three.js `MeshStandardMaterial` + `normalMap` 并排对比。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[06 Cubemap](./06-cubemap-skybox.md)
- 下一篇：[08 Bloom 辉光](./08-bloom.md)
