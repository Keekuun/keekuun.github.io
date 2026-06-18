---
title: 14 · 多物体与多 Program
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- draw call
- Tutorial
---

# 14 · 多物体与多 Program

> 一个场景里多种几何体、多种着色器：理解 draw call 与 Three.js `scene.children` 的底层成本。

---

## 目录

- [适用场景](#适用场景)
- [draw call 是什么](#draw-call-是什么)
- [多物体同一 Program](#多物体同一-program)
- [多 Program 切换](#多-program-切换)
- [组织代码的结构](#组织代码的结构)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- 场景有立方体 + 球体 + 线框，材质不同
- 性能优化：「减少 draw call」从哪来
- 读 Three.js `renderer.info.render.calls`

---

## draw call 是什么

每次 `drawArrays` / `drawElements` = **一次 draw call**。GPU 切换状态（Program、纹理、Buffer）有开销；**100 个小物体 = 100 次 draw** 可能比 **1 个大物体** 更慢。

优化方向（进阶）：

- 合并几何体（同材质）
- 实例化（WebGL2 [03 · 实例化](./webgl2/03-instancing.md)）
- 合批（Three.js 内部 Batching）

---

## 多物体同一 Program

相同着色器，只改 **Model 矩阵** 和 **顶点缓冲**：

```js
const objects = [
  { buffer: cubeBuffer, indexBuffer: cubeIdx, matrix: m4.translation(-2, 0, 0) },
  { buffer: cubeBuffer, indexBuffer: cubeIdx, matrix: m4.translation(2, 0, 0) },
];

gl.useProgram(program);

for (const obj of objects) {
  bindGeometry(gl, program, obj.buffer, obj.colorBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);

  const worldMatrix = m4.multiply(viewProjection, obj.matrix);
  gl.uniformMatrix4fv(matrixLoc, false, worldMatrix);

  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}
```

`bindGeometry` 封装 attribute 绑定，避免重复代码。

---

## 多 Program 切换

线框用 flat 颜色 Program，实体用光照 Program：

```js
function drawLit(mesh) {
  gl.useProgram(litProgram);
  setUniformsLit(/* light, material */);
  bindAndDraw(mesh);
}

function drawWireframe(mesh) {
  gl.useProgram(flatProgram);
  gl.uniform4fv(colorLoc, [0, 1, 0, 1]);
  bindAndDraw(mesh);
}

// 渲染顺序
drawLit(solidCube);
gl.lineWidth(1); // 许多平台忽略 >1
drawWireframe(solidCube); // 同一几何，TRIANGLES vs LINES 需不同 index 或 geometry
```

**`gl.useProgram` 切换有成本**——尽量按 Program 分组绘制（先画所有 lit，再画所有 wire）。

---

## 组织代码的结构

推荐最小 OOP（不必上引擎）：

```js
class Mesh {
  constructor(gl, program, positions, indices, normals) {
    this.program = program;
    this.positionBuffer = createBuffer(gl, positions);
    this.indexBuffer = createIndexBuffer(gl, indices);
    this.indexCount = indices.length;
    this.matrix = m4.identity();
  }
  draw(gl, viewProjection) {
    gl.useProgram(this.program);
    // bind attributes, uniform matrix, drawElements
  }
}

class Scene {
  constructor() { this.meshes = []; }
  add(mesh) { this.meshes.push(mesh); }
  render(gl, viewProjection) {
    for (const mesh of this.meshes) mesh.draw(gl, viewProjection);
  }
}
```

Three.js 的 `Scene` + `Mesh` + `render(scene, camera)` 是这一层的超集。

---

## 与 Three.js 对照

| WebGL | Three.js |
|-------|----------|
| 每次 `drawElements` | `renderer.info.render.calls` +1 |
| `useProgram` 切换 | 不同 `Material` 类型 |
| 手写 `Scene.render` | `renderer.render(scene, camera)` |
| 合并 buffer | `BufferGeometryUtils.mergeGeometries` |

打开统计：

```js
console.log(renderer.info.render.calls, renderer.info.render.triangles);
```

---

## 练习

1. 画 10 个不同位置的立方体，统计 draw call（Chrome Spector 或自计数）。
2. 两种 Program：一个 `MeshBasic` 风格纯色，一个 [13](./13-lighting.md) 光照，交替绘制。
3. 把 10 个立方体 position 合并成一个 buffer、一次 draw（感受 batch 思路）。
4. Three.js 场景 10 个 `Mesh` vs 1 个 `InstancedMesh`（WebGL2）对比 `info.render.calls`。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[13 · 光照模型](./13-lighting.md)
- 下一篇：[15 · 渲染到纹理 FBO](./15-framebuffer.md)
