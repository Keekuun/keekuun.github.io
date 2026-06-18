---
title: 实践 · 轨道相机
date: 2026-06-15
isComment: true
categories:
- WebGL
tags:
- WebGL
- Camera
- Practice
---

# 实践 · 轨道相机

> Demo：[07-orbit-camera](http://localhost:5173/examples/07-orbit-camera/) · 源码 `apps/webgl-demos/examples/07-orbit-camera/main.js`

---

## 适用场景

- 产品 3D 展示：鼠标拖拽旋转、滚轮缩放
- 理解 Three.js `OrbitControls` 在算什么
- 数字孪生预览：围绕目标点轨道运动

---

## 球坐标相机

相机 eye 由三个参数决定：

| 参数 | 含义 |
|------|------|
| `radius` | 相机到目标距离 |
| `theta` | 水平角（绕 Y 轴） |
| `phi` | 俯仰角（0 = 顶视，π/2 = 平视） |

```js
function getCameraEye() {
  return [
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  ];
}
const view = m4.lookAt(getCameraEye(), [0, 0, 0], [0, 1, 0]);
```

目标点 `[0,0,0]` 即「轨道中心」——Three.js 里 `controls.target`。

---

## 指针交互

```js
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  theta += (e.clientX - lastX) * 0.01;
  phi = clamp(phi + (e.clientY - lastY) * 0.01, 0.1, Math.PI - 0.1);
});
canvas.addEventListener('wheel', (e) => {
  radius = clamp(radius + e.deltaY * 0.01, 2, 12);
});
```

`phi` 要 clamp，否则相机翻过极点会 **万向节锁** 式抖动。

---

## 与 Three.js OrbitControls

| 手写 | OrbitControls |
|------|---------------|
| `theta/phi/radius` | `getPolarAngle()` / `getDistance()` |
| `lookAt(target)` | `controls.target` |
| pointer 事件 | `controls.enableRotate` |
| wheel | `controls.enableZoom` |

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
// render loop 里
controls.update();
renderer.render(scene, camera);
```

---

## 练习

1. 把 `target` 改成 `[0, 1, 0]`， Orbit 绕偏移中心转。
2. 加「双击复位」：`theta=0.6; phi=0.5; radius=5`。
3. 限制 `phi` 为 `[0.2, 1.2]`，模拟「不允许钻到地底」。
4. 同一轨道逻辑迁到 Three.js，对比代码量。

---

## 导航

- [实践目录](./README.md)
- Demo 上一篇：Lab 06 · [13 光照](../13-lighting.md)
- 下一篇：[进阶 · 拾取](../advanced/01-picking.md)
