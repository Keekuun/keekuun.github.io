---
title: 13 · 光照模型
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- Lighting
- GLSL
- Tutorial
---

# 13 · 光照模型

> 法线、方向光与 Blinn-Phong 着色——理解 Three.js `MeshStandardMaterial` 为什么必须打光。

---

## 目录

- [适用场景](#适用场景)
- [法线](#法线)
- [Blinn-Phong 模型](#blinn-phong-模型)
- [顶点 vs 片段光照](#顶点-vs-片段光照)
- [完整着色器](#完整着色器)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- `MeshStandardMaterial` 全黑——没灯
- 自定义 Shader 要接业务「告警高亮」
- 模型「一块亮一块暗」——法线反了或没 normalize

Three.js [06 · 光与阴影](../threejs/06-lights-and-shadows.md) 讲 API；本篇讲 GPU 里怎么算。

---

## 法线

**法线（Normal）** 是垂直于表面的向量，决定光从哪个角度打上来有多亮。

立方体每面 4 顶点共用一个法线（ flat ）或每顶点不同（ smooth ）：

```js
// 前面 +Z
const normals = [
  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
  // back: 0,0,-1 ...
];
```

顶点着色器把法线变换到 **世界空间**（只用 Model 矩阵的逆转置，本篇简化为方向光 + 均匀缩放时可只用 Model 旋转部分）：

```glsl
attribute vec3 a_normal;
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;

varying vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * vec4(a_position, 1.0);
  v_normal = mat3(u_world) * a_normal;
}
```

片段着色器里 **务必 normalize**（插值后长度不为 1）：

```glsl
vec3 n = normalize(v_normal);
```

---

## Blinn-Phong 模型

经典三部分（简化 PBR 之前工业界常用）：

| 分量 | 含义 |
|------|------|
| **Ambient** | 环境光，避免背光面全黑 |
| **Diffuse** | 漫反射，与光方向、法线夹角相关 |
| **Specular** | 高光，与视角、半角向量相关 |

```glsl
precision mediump float;

uniform vec3 u_lightDirection;  // 世界空间，指向光源
uniform vec3 u_viewDirection;   // 相机指向（或相机位置 - 片元位置）
uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_specularColor;
uniform float u_shininess;

varying vec3 v_normal;

void main() {
  vec3 n = normalize(v_normal);
  vec3 l = normalize(u_lightDirection);
  vec3 v = normalize(u_viewDirection);
  vec3 h = normalize(l + v);  // Blinn：半角向量

  float ndotl = max(dot(n, l), 0.0);
  float ndoth = max(dot(n, h), 0.0);

  vec3 ambient = u_ambientColor;
  vec3 diffuse = u_diffuseColor * ndotl;
  vec3 specular = u_specularColor * pow(ndoth, u_shininess);

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
```

方向光：`u_lightDirection = normalize([0.5, 1, 0.8])` 即可，不需要光源位置。

---

## 顶点 vs 片段光照

| 方式 | 计算位置 | 效果 |
|------|----------|------|
| 顶点光照 | 顶点着色器算颜色，varying 插值 | 低多边形明显色块（Gouraud） |
| 片段光照 | 片段着色器逐像素算 | 平滑（Phong / Blinn-Phong） |

上面代码是 **片段光照**，工业展示用这个。

---

## 完整着色器

JS 侧每帧传入：

```js
const lightDirection = normalize([0.5, 1, 0.8]);
const viewDirection = normalize([
  cameraPosition[0],
  cameraPosition[1],
  cameraPosition[2],
]);

gl.uniform3fv(lightDirLoc, lightDirection);
gl.uniform3fv(viewDirLoc, viewDirection);
gl.uniform3fv(ambientLoc, [0.15, 0.15, 0.15]);
gl.uniform3fv(diffuseLoc, [0.8, 0.2, 0.2]);
gl.uniform3fv(specularLoc, [1, 1, 1]);
gl.uniform1f(shininessLoc, 32);
```

可叠加 [12 · 纹理](./12-textures.md)：`diffuse *= texture2D(u_texture, v_texcoord).rgb`。

---

## 与 Three.js 对照

| WebGL Blinn-Phong | Three.js |
|-------------------|----------|
| 手写 ambient/diffuse/specular | `MeshPhongMaterial` |
| 物理 roughness/metalness | `MeshStandardMaterial`（内部更复杂） |
| `a_normal` | `geometry.attributes.normal` |
| 没灯 = 只有 ambient | `AmbientLight` + `DirectionalLight` |

自定义染色（孪生告警）在 Three.js 进阶 [16 · Shader](../threejs/advanced/README.md) 用 `ShaderMaterial` + uniform 接 API。

---

## 练习

1. 只开 diffuse，关 specular，观察纯漫反射。
2. `shininess` 从 8 改到 128，看高光斑点大小。
3. 法线全部写成 `[0,1,0]`，看立方体六面一样亮——理解法线作用。
4. 与 `MeshStandardMaterial` + `DirectionalLight` 并排对比观感。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[12 · 纹理映射](./12-textures.md)
- 下一篇：[14 · 多物体与多 Program](./14-multiple-objects.md)
