---
title: 进阶 · 射线拾取
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Picking
- Raycast
---

# 进阶 · 射线拾取

> Demo：[10-picking](http://localhost:5173/examples/10-picking/) · 对应 Three.js [08 Raycaster](../../threejs/08-interaction.md)

---

## 适用场景

- 点击 3D 物体高亮、弹出属性面板
- 孪生设备选中、配置器部件换色
- 理解 `Raycaster.setFromCamera` 底层在算什么

---

## 流程

```
屏幕 (clientX, clientY)
    ↓ 归一化
NDC (x: -1~1, y: -1~1)
    ↓ 逆(view × projection)
世界空间射线 origin + direction
    ↓ 与包围体求交
命中物体 id / 距离 t
```

---

## 屏幕 → NDC

```js
const rect = canvas.getBoundingClientRect();
const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
```

Canvas 左上角 y 向下，NDC y 向上，所以要 **取负**。

---

## NDC → 世界射线

```js
const invPV = m4.inverse(m4.multiply(projection, view));
const near = m4.transformPoint(invPV, [ndcX, ndcY, -1]);
const far = m4.transformPoint(invPV, [ndcX, ndcY, 1]);
const dir = normalize(sub(far, near));
const origin = cameraEye;
```

WebGL 裁剪空间 z：near → -1，far → +1（OpenGL 约定）。

---

## AABB 求交（轴对齐包围盒）

立方体中心 `center`，半边长 `half=1`：

```js
function hitAABB(origin, dir, center, half = 1) {
  let tmin = -Infinity, tmax = Infinity;
  for (let i = 0; i < 3; i++) {
    const inv = 1 / (dir[i] || 1e-8);
    let t0 = (center[i] - half - origin[i]) * inv;
    let t1 = (center[i] + half - origin[i]) * inv;
    if (t0 > t1) [t0, t1] = [t1, t0];
    tmin = Math.max(tmin, t0);
    tmax = Math.min(tmax, t1);
  }
  return tmax >= Math.max(tmin, 0) ? tmin : null;
}
```

多个物体取 **最小正 t**。

复杂 mesh 用三角形求交（Möller–Trumbore）或 **GPU picking**（离屏渲染 object id 颜色）。

---

## Three.js 等价写法

```js
const mouse = new THREE.Vector2(ndcX, ndcY);
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const hits = raycaster.intersectObjects(scene.children, true);
if (hits.length) console.log(hits[0].object, hits[0].point);
```

---

## 练习

1. 给选中立方体加 outline（改大 scale 或 Pass2 描边）。
2. 用 **球体** 包围体代替 AABB，感受精度差异。
3. 读 Demo 源码，在 `console.log` 打印射线 origin/dir。
4. Three.js 同场景用 Raycaster 对比命中结果。

---

## 导航

- [进阶目录](./README.md)
- 下一篇：[02 · 粒子系统](./02-particles.md)
