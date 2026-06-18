---
title: WebGL2 · 03 实例化绘制
date: 2026-06-15
isComment: true
categories:
- WebGL2
tags:
- WebGL2
- Instancing
- Tutorial
---

# WebGL2 · 03 实例化绘制

> 一份几何体、一次 draw 画 N 个实例——数字孪生里「上千设备点」的 GPU 友好做法。

---

## 适用场景

- 场景里 1000 个相同图标/树/设备模型
- Three.js `InstancedMesh` 底层原理
- 减少 draw call（[14 · 多物体](../14-multiple-objects.md) 的升级版）

---

## 核心 API

```js
gl.drawArraysInstanced(mode, first, count, instanceCount);
gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
```

`instanceCount` = 实例个数。GPU 对每个实例调用顶点着色器，`gl_InstanceID` 从 0 递增。

---

## 顶点着色器

```glsl
#version 300 es
in vec3 a_position;
in vec3 a_instanceOffset;  // 每实例不同：用 instanced attribute

uniform mat4 u_viewProjection;

void main() {
  vec3 worldPos = a_position + a_instanceOffset;
  gl_Position = u_viewProjection * vec4(worldPos, 1.0);
}
```

或用 **instance matrix**（mat4 占 4 个 attribute location，需 `vertexAttribDivisor`）。

---

## Divisor

默认 attribute 每个顶点更新；实例化 attribute 每 **实例** 更新一次：

```js
const loc = gl.getAttribLocation(program, 'a_instanceOffset');
gl.enableVertexAttribArray(loc);
gl.bindBuffer(gl.ARRAY_BUFFER, instanceOffsetBuffer);
gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(loc, 1);  // 关键：1 = 每实例步进
```

| divisor | 含义 |
|---------|------|
| 0 | 每个顶点（默认） |
| 1 | 每个实例 |
| N | 每 N 个实例 |

---

## 完整流程

1. 普通 VAO：几何 position/index
2. `instanceBuffer`：N 个 `vec3` offset（或 mat4）
3. 对 instance attribute 设 `vertexAttribDivisor(1)`
4. `drawElementsInstanced(TRIANGLES, indexCount, UNSIGNED_SHORT, 0, N)`

```js
// 100 个立方体，一次 draw
gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, 100);
```

---

## 与 Three.js

```js
const mesh = new THREE.InstancedMesh(geometry, material, count);
const dummy = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  dummy.position.set(/* ... */);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
mesh.instanceMatrix.needsUpdate = true;
```

`InstancedMesh` 把 matrix 数组作为 instanced attribute 上传。

---

## 练习

1. 100 个随机位置立方体，1 次 `drawElementsInstanced`。
2. 用 `gl_InstanceID` 在 FS 里上色（彩虹实例）。
3. 对比 [14](../14-multiple-objects.md) 循环 100 次 draw 的 `renderer.info.calls`（Three 对照实验）。

---

## 导航

- [WebGL2 目录](./README.md)
- 上一篇：[02 · VAO 与 UBO](./02-vao-and-ubo.md)
- 下一篇：[04 · 3D 纹理与 MRT](./04-3d-textures-and-mrt.md)
