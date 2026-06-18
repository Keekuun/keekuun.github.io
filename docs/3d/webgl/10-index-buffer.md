---
title: 10 · 索引缓冲
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- drawElements
- Tutorial
---

# 10 · 索引缓冲

> 用 8 个顶点 + 索引画出立方体，理解 `drawElements` 与 `BufferGeometry.index` 的关系。

---

## 目录

- [适用场景](#适用场景)
- [为什么需要索引](#为什么需要索引)
- [ELEMENT_ARRAY_BUFFER](#element_array_buffer)
- [完整代码要点](#完整代码要点)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- 模型顶点大量重复（立方体 8 角点 vs 36 顶点）
- 读 Three.js `geometry.index` 或 glTF 的 `indices` accessor
- 减少 GPU 内存、提升缓存命中率

---

## 为什么需要索引

09 里立方体用了 **36 个顶点**，但角点只有 **8 个**。每个角被 3 个面共用，坐标重复存储。

```
无索引：36 顶点 × (position + color) = 大量重复
有索引：8 顶点 + 36 个 uint16 索引 = 省内存
```

绘制 API 从 `drawArrays` 换成 `drawElements`：

```js
// drawArrays：按缓冲顺序依次取顶点
gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

// drawElements：按索引缓冲里的下标取顶点
gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
```

---

## ELEMENT_ARRAY_BUFFER

索引数据放在 **`gl.ELEMENT_ARRAY_BUFFER`**（不是 `ARRAY_BUFFER`）：

```js
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array([
    0, 1, 2,  0, 2, 3,  // front
    4, 5, 6,  4, 6, 7,  // back
    // ...
  ]),
  gl.STATIC_DRAW
);
```

立方体 8 顶点位置（局部空间 -1～1）：

```js
const positions = [
  // front
  -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
  // back
  -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
];
// 12 floats × 3 components = 8 vertices × 3
```

索引（36 个）：

```js
const indices = [
  0, 1, 2,  0, 2, 3,
  4, 5, 6,  4, 6, 7,
  5, 1, 2,  5, 2, 6,
  4, 7, 3,  4, 3, 0,
  3, 2, 6,  3, 6, 5,
  4, 0, 1,  4, 1, 7,
];
```

绘制：

```js
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
```

---

## 完整代码要点

在 [09](./09-matrices-and-3d.md) 基础上改动：

1. `positions` 改为 8 顶点 × 3 分量 = 24 个 float
2. `colors` 改为 8 顶点 × 4 分量（每顶点一色，或按面在着色器里算）
3. 创建 `indexBuffer`，绑定到 `ELEMENT_ARRAY_BUFFER`
4. `drawElements` 替换 `drawArrays`

**属性设置不变**——索引只影响「取哪个顶点」，不影响 `vertexAttribPointer` 配置。

顶点着色器 + MVP 矩阵与 09 相同。

```js
function setAttributes(gl, program, positionBuffer, colorBuffer) {
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const colorLoc = gl.getAttribLocation(program, 'a_color');

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
}

function draw(gl, indexBuffer, indexCount) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
}
```

### 索引类型选择

| 类型 | 常量 | 顶点数上限 |
|------|------|-----------|
| Uint8 | `UNSIGNED_BYTE` | 256（少用） |
| Uint16 | `UNSIGNED_SHORT` | 65535 |
| Uint32 | `UNSIGNED_INT` | 更多（WebGL2 / 扩展） |

glTF 常见 `UNSIGNED_SHORT`；大场景可能用 32 位索引。

---

## 与 Three.js 对照

| WebGL | Three.js |
|-------|----------|
| `ELEMENT_ARRAY_BUFFER` + `drawElements` | `BufferGeometry.setIndex()` |
| 8 顶点 + 36 索引 | `BoxGeometry` 内部同样逻辑 |
| `indexCount` | `geometry.drawRange.count` |

```js
// Three.js 查看索引
const geo = new THREE.BoxGeometry(1, 1, 1);
console.log(geo.index.count, geo.attributes.position.count);
// index.count = 36, position.count = 24（非索引）或 8（若合并）
```

---

## 练习

1. 用 `console.log` 对比 09（36 顶点）与 10（8 顶点）的 `bufferData` 字节数。
2. 故意写错一个索引（如 `0, 1, 99`），观察画面撕裂——理解索引即「指针」。
3. 画一个四面体：4 顶点 + 12 索引。
4. 在 Three.js 里 `new THREE.BufferGeometry()` 手写 positions + index，用 `MeshBasicMaterial` 渲染，与 WebGL 版本对照。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[09 · 矩阵与 3D 空间](./09-matrices-and-3d.md)
- 下一篇：[11 · 深度与面剔除](./11-depth-and-culling.md)
