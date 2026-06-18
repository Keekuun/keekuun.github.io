---
title: 11 · 深度与面剔除
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- depth
- Tutorial
---

# 11 · 深度与面剔除

> 开启深度缓冲与面剔除，解决立方体穿模、背面可见问题——Three.js 黑屏/穿模排查的底层之一。

---

## 目录

- [适用场景](#适用场景)
- [深度缓冲](#深度缓冲)
- [面剔除](#面剔除)
- [完整代码片段](#完整代码片段)
- [混合与透明预告](#混合与透明预告)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- 09 的立方体各面乱序叠加
- 两个物体重叠时谁在前谁在后不对
- 模型「从里面能看到背面」或内外翻转

---

## 深度缓冲

GPU 除了颜色缓冲，还有 **深度缓冲（Z-Buffer）**：每个像素存距离相机的深度值，新片元更近才覆盖。

```js
// 初始化时（每帧 clear 前）
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

| 调用 | 作用 |
|------|------|
| `gl.enable(DEPTH_TEST)` | 开启深度比较 |
| `gl.clear(DEPTH_BUFFER_BIT)` | 每帧清空深度（否则上一帧残留） |
| `gl.depthFunc(gl.LESS)` | 默认：更近的通过（一般不用改） |

**near / far 裁剪**：在投影矩阵里设置。near 太小会有 Z-fighting（闪烁）；far 太大损失深度精度。

---

## 面剔除

三角形有 **正面 / 背面**（由顶点 winding order 决定）。封闭网格通常只画正面：

```js
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);       // 剔除背面（默认）
gl.frontFace(gl.CCW);       // 逆时针为正面（OpenGL 默认）
```

若模型「里外反了」，要么改顶点顺序，要么 `gl.frontFace(gl.CW)`。

```
顶点顺序 CCW（从相机看）→ 正面
        v2
       / \
      /   \
    v0 --- v1
```

---

## 完整代码片段

在 09/10 的 `render` 里加入：

```js
function initGL(gl) {
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
}

function render() {
  gl.clearColor(0.1, 0.1, 0.12, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // ... 矩阵、drawElements ...
}
```

画 **两个** 立方体验证遮挡：

```js
// 立方体 A
let matrixA = m4.multiply(viewProjection, m4.translation(-1.5, 0, 0));
gl.uniformMatrix4fv(matrixLoc, false, matrixA);
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

// 立方体 B（更近）
let matrixB = m4.multiply(viewProjection, m4.translation(0.5, 0, -1));
gl.uniformMatrix4fv(matrixLoc, false, matrixB);
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
```

关闭 `DEPTH_TEST` 对比：后画的永远盖住先画的，与深度无关。

---

## 混合与透明预告

半透明物体需要 **关闭深度写入** 或 **从后往前排序** 绘制：

```js
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 透明物体常配合：gl.depthMask(false);
```

Three.js `material.transparent = true` 内部走类似逻辑。本篇先掌握不透明物体；透明玻璃在进阶 Three.js 材质篇深入。

---

## 与 Three.js 对照

| WebGL | Three.js |
|-------|----------|
| `DEPTH_TEST` | `renderer` 默认开启 |
| `clear(DEPTH_BUFFER_BIT)` | 每帧 `render` 自动 clear |
| `CULL_FACE` | `material.side = FrontSide`（默认） |
| `DoubleSide` | `material.side = THREE.DoubleSide` 关闭剔除 |

`material.side = BackSide` 只看内表面——排查 CAD 模型法线反了时常用。

---

## 练习

1. 只开 `DEPTH_TEST` 不开 `CULL_FACE`，旋转立方体观察内外两面。
2. 把 `near` 设为 `0.001`、`far` 设为 `10000`，让两个立方体共面，观察 Z-fighting。
3. 画 3 个不同 z 的平面，验证遮挡顺序。
4. Three.js 同一场景开/关 `depthTest: false`（`MeshBasicMaterial` 参数）对比。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[10 · 索引缓冲](./10-index-buffer.md)
- 下一篇：[12 · 纹理映射](./12-textures.md)
