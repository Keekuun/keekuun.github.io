---
title: WebGL2 · 01 GLSL 300 es 迁移
date: 2026-06-15
isComment: true
categories:
- WebGL2
tags:
- WebGL2
- GLSL
- Tutorial
---

# WebGL2 · 01 GLSL 300 es 迁移

> 从 WebGL1 迁到 WebGL2：第一行 `#version 300 es`，以及 `in/out` 替代 `attribute/varying`。

---

## Context 切换

```js
const gl = canvas.getContext('webgl2');
if (!gl) {
  console.warn('WebGL2 unavailable, fallback to WebGL1');
  return canvas.getContext('webgl');
}
```

WebGL2 context 仍可调 WebGL1 API；但要用新特性必须写 GLSL 300 es。

---

## 语法对照

| WebGL1 (GLSL 100) | WebGL2 (GLSL 300 es) |
|-------------------|----------------------|
| `attribute vec3 a_pos` | `in vec3 a_pos` |
| `varying vec2 v_uv` | `in/out vec2 v_uv`（VS out，FS in） |
| `gl_FragColor = ...` | `out vec4 outColor; outColor = ...` |
| `texture2D(s, uv)` | `texture(s, uv)` |
| `textureCube(s, dir)` | `texture(s, dir)` |

---

## 顶点着色器示例

```glsl
#version 300 es
in vec4 a_position;
in vec4 a_color;
uniform mat4 u_matrix;
out vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
```

## 片段着色器示例

```glsl
#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;

void main() {
  outColor = v_color;
}
```

**片段着色器必须声明 `out` 变量**，不再有内置 `gl_FragColor`。

---

## 精度

300 es 同样要求片段着色器写精度：

```glsl
precision mediump float;
```

顶点着色器默认 `highp`，一般可不写。

---

## 迁移检查清单

1. 所有 shader 文件首行 `#version 300 es`
2. `attribute` → `in`（仅 VS）
3. `varying` → VS `out` / FS `in`，名称一致
4. 声明 `out vec4 fragColor` 并赋值
5. `texture2D` → `texture`
6. `getContext('webgl2')`

把 [09 立方体](../09-matrices-and-3d.md) 改一版 WebGL2，作为迁移练习。

---

## 与 Three.js

Three.js 内置 shader（`MeshStandardMaterial` 等）在 WebGL2 下自动用 300 es 版本；自定义 `ShaderMaterial` 需自己写 `#version 300 es` 并与 renderer 能力一致。

---

## 练习

1. 09 立方体完整迁移到 WebGL2。
2. 故意去掉 `#version`，观察 compile log。
3. FS 忘记 `out` 变量，观察 link 错误。

---

## 导航

- [WebGL2 目录](./README.md)
- 下一篇：[02 · VAO 与 UBO](./02-vao-and-ubo.md)
