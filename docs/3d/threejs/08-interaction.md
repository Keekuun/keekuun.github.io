---
title: 08 · 交互
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- Interaction
---

# 08 · 交互

> OrbitControls 工程配置、Raycaster 拾取，以及 **3D 与 DOM UI 并存** 时的最佳实践。

---

## 目录

- [适用场景](#适用场景)
- [OrbitControls 深入](#orbitcontrols-深入)
- [按需渲染与 Controls](#按需渲染与-controls)
- [Raycaster 原理与实现](#raycaster-原理与实现)
- [Layers 与拾取过滤](#layers-与拾取过滤)
- [HTML 标注与 DOM 叠加](#html-标注与-dom-叠加)
- [与 Vue/React 事件协作](#与-vuerreact-事件协作)
- [完整示例骨架](#完整示例骨架)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 交互 | 方案 |
|------|------|
| 产品页 360° 查看 | OrbitControls + autoRotate |
| 点击部件出说明 | Raycaster + 高亮 material |
| 配置器换色（UI 在侧边栏） | DOM 按钮 + traverse 改 material |
| 孪生设备告警弹窗 | Raycaster + HTML 标签 / Modal |
| 禁止用户旋转（纯展示） | `controls.enabled = false` |
| 第一人称室内漫游 | PointerLockControls（非 Orbit） |

**原则**：3D 负责 **空间展示与拾取**；表单、表格仍用 DOM，不要全画在 canvas 里。

---

## OrbitControls 深入

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2; // 不低于地平线
controls.maxAzimuthAngle = Math.PI / 4; // 限制左右 ±45°
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};
```

| 配置 | 产品页建议 |
|------|------------|
| `enableDamping` | 开，手感顺滑 |
| `maxPolarAngle` | 限制钻地 |
| `min/maxDistance` | 防止缩进模型内或太远 |
| `autoRotate` |  idle 展示可开，交互时关 |

**阻尼必须** `controls.update()` 在 animate 或 change 回调里每帧调用。

加载模型后更新 target：

```js
const box = new THREE.Box3().setFromObject(model);
controls.target.copy(box.getCenter(new THREE.Vector3()));
controls.update();
```

---

## 按需渲染与 Controls

产品配置器用户可能长时间不动：

```js
let needsRender = true;
const render = () => {
  if (!needsRender) return;
  needsRender = false;
  controls.update();
  renderer.render(scene, camera);
};

controls.addEventListener('change', () => { needsRender = true; });
// 数据驱动变更
function onDataUpdate() {
  updateMeshColors();
  needsRender = true;
}
requestAnimationFrame(function loop() {
  requestAnimationFrame(loop);
  if (controls.autoRotate) needsRender = true;
  render();
});
```

---

## Raycaster 原理与实现

从相机通过 NDC 点 `(x,y)` 发射射线，与 mesh 三角形求交：

```js
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pick(event) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, true);
  return hits[0] ?? null;
}
```

**hits 数组**：按距离排序，`hits[0]` 最近。穿透选择用 `hits[1]`。

**高亮**：

```js
let selected = null;
function select(mesh) {
  if (selected) resetMaterial(selected);
  selected = mesh;
  mesh.userData._origEmissive = mesh.material.emissive?.clone();
  mesh.material = mesh.material.clone();
  mesh.material.emissive.set(0x333333);
}
```

---

## Layers 与拾取过滤

```js
camera.layers.enable(0);
pickMesh.layers.set(1);
raycaster.layers.set(1); // 只拾取 layer 1
```

用于：**忽略地面**、**只拾取设备不拾取辅助线**。

```js
const pickables = [];
model.traverse((c) => {
  if (c.isMesh && c.userData.pickable) pickables.push(c);
});
raycaster.intersectObjects(pickables, false);
```

`recursive: false` + 扁平数组有时 **更快**（大场景）。

---

## HTML 标注与 DOM 叠加

**CSS2DRenderer**（始终面向相机）或手动投影：

```js
function worldToScreen(worldPos, camera, width, height) {
  const v = worldPos.clone().project(camera);
  if (v.z > 1) return null; // 在相机背后
  return {
    x: (v.x * 0.5 + 0.5) * width,
    y: (-v.y * 0.5 + 0.5) * height,
  };
}
```

DOM 结构：

```html
<div id="app" style="position:relative">
  <div id="canvas-host"></div>
  <div id="labels" style="position:absolute;inset:0;pointer-events:none"></div>
</div>
```

`pointer-events: none` 让点击穿透到 canvas；标签内按钮单独 `pointer-events: auto`。

---

## 与 Vue/React 事件协作

- canvas 上 **不要** 再包一层捕获点击的透明 div（会挡 OrbitControls）
- 侧边栏 Vue 组件改 store → watch 里改 mesh → 触发 render
- 移动端：`touch-action: none`  on canvas 容器，减少浏览器默认滚动

```css
#canvas-host canvas {
  touch-action: none;
  display: block;
}
```

---

## 完整示例骨架

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ... renderer, scene, camera, mesh ...

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener('click', onClick);

function onClick(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(mesh);
  if (hits.length) console.log(hits[0].point, hits[0].face.normal);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

---

## 练习

1. 限制 Orbit 只能水平转 ±30°。
2. 点击 mesh 切换 emissive 高亮，再点取消。
3. 加载 glTF，`userData.pickable` 过滤可点部件。
4. 实现 autoRotate，用户 drag 时暂停，松手 3s 后恢复。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[07 · 加载 glTF](./07-load-gltf.md)
- 下一篇：[09 · 性能与释放](./09-performance-and-dispose.md)
