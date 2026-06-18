---
title: 09 · 性能与释放
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- Performance
---

# 09 · 性能与释放

> 性能预算、GPU 内存释放、LOD/Instancing，以及 **SPA 里 WebGL 泄漏** 的完整处理。

---

## 目录

- [适用场景](#适用场景)
- [性能预算怎么定](#性能预算怎么定)
- [渲染循环最佳实践](#渲染循环最佳实践)
- [dispose 与 GPU 内存](#dispose-与-gpu-内存)
- [完整销毁流程](#完整销毁流程)
- [优化手段对照表](#优化手段对照表)
- [Instancing 与 LOD](#instancing-与-lod)
- [调试与 Profile](#调试与-profile)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 问题 | 本章对应 |
|------|----------|
| SPA 路由切走再回来越来越卡 | dispose 不完整 |
| 移动端发热、掉帧 | DPR、阴影、面数 |
| 园区上千设备同屏 | Instancing / 合并 mesh |
| 远近模型精度 | LOD |
| 静态场景仍 60fps 空转 | 按需渲染 |
| 内存涨不回落 | geometry/material/texture 未 dispose |

**原则**：先 **测量**（Stats、`renderer.info`、Chrome Performance），再优化；避免未 Profile 就降面。

---

## 性能预算怎么定

参考目标（可按项目调整）：

| 平台 | FPS | 三角面 | 贴图 | shadowMap |
|------|-----|--------|------|-----------|
| 桌面产品页 | 60 | 单模型 50万内 | 2K 为主 | 2048 可选 |
| 移动端 H5 | 30+ | 10万–20万 | 1K | 关或假阴影 |
| 孪生大屏 | 30–60 | 分区加载 | 图集 | 常关 |

```js
console.log('triangles', renderer.info.render.triangles);
console.log('calls', renderer.info.render.calls);
console.log('textures', renderer.info.memory.textures);
console.log('geometries', renderer.info.memory.geometries);
```

`calls` = draw call 数，工业优化常以此为目标（合并材质、Instancing）。

---

## 渲染循环最佳实践

```js
const clock = new THREE.Clock();
const temp = new THREE.Vector3(); // 循环外复用

function animate() {
  animationId = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer?.update(delta);
  controls?.update();
  renderer.render(scene, camera);
}
```

**避免在 loop 内**：

- `new Vector3()` / `new Box3()` 每帧
- `traverse` 全场景（改到事件触发时）
- 无意义的 `console.log`

**visibilitychange**：

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(animationId);
  else animate();
});
```

**按需渲染**：见 [08 · 交互](./08-interaction.md)，配置器、静态展示页可显著省电。

---

## dispose 与 GPU 内存

JS 对象释放 ≠ GPU 资源释放。必须显式：

```js
function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) value.dispose();
  }
  material.dispose();
}

function disposeMesh(mesh) {
  mesh.geometry?.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(disposeMaterial);
  } else {
    disposeMaterial(mesh.material);
  }
}
```

**易漏**：

- `scene.environment` 的 PMREM 贴图
- `renderer.shadowMap` 相关
- `CSS2DRenderer` 创建的 DOM
- Draco/KTX2 loader 无 dispose，但 decoded geometry 要 dispose

---

## 完整销毁流程

```js
function destroyThree(ctx) {
  const { scene, renderer, controls, mixer } = ctx;
  cancelAnimationFrame(ctx.animationId);

  scene.traverse((obj) => {
    if (obj.isMesh) disposeMesh(obj);
  });
  scene.clear();

  if (scene.environment?.dispose) scene.environment.dispose();
  if (scene.background?.isTexture) scene.background.dispose();

  controls?.dispose();
  mixer?.stopAllAction();

  renderer.dispose();
  renderer.forceContextLoss?.();
  renderer.domElement.remove();
}
```

Vue `onUnmounted` / React `useEffect` cleanup **必须** 调用。`v-if` 切换 3D 组件 = 销毁 + 重建。

**webglcontextlost**：

```js
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  destroyThree(ctx);
});
```

---

## 优化手段对照表

| 手段 | 适用 | 代价 |
|------|------|------|
| cap pixelRatio 2 | 全局 | 略糊 |
| 关 antialias | 移动端 | 锯齿 |
| 关 shadowMap | 大场景 | 无实时阴影 |
| mergeGeometries | 静态同材质 | 失去单独 pick |
| InstancedMesh | 大量相同物体 | 不能单独换色（需 instanceColor） |
| LOD | 远近不同精度 | 多套模型 |
| 纹理 KTX2 | 大图 |  transcoder 配置 |
| Draco | 大 geometry | CPU 解码时间 |
| frustumCulled | 默认开 | 超大物体需关 |
| 分区加载 | 孪生园区 | 工程复杂度 |

---

## Instancing 与 LOD

**InstancedMesh**（上千相同设备图标）：

```js
const count = 1000;
const instanced = new THREE.InstancedMesh(geometry, material, count);
const matrix = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
  matrix.setPosition(Math.random() * 100, 0, Math.random() * 100);
  instanced.setMatrixAt(i, matrix);
}
instanced.instanceMatrix.needsUpdate = true;
scene.add(instanced);
// 1 次 draw call
```

**LOD**：

```js
import { LOD } from 'three';
const lod = new LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(midDetailMesh, 20);
lod.addLevel(lowDetailMesh, 50);
scene.add(lod);
// 每帧 lod.update(camera) 自动切换
```

---

## 调试与 Profile

```js
import Stats from 'three/addons/libs/stats.module.js';
const stats = new Stats();
document.body.appendChild(stats.dom);
// animate 里 stats.begin/end
```

Chrome DevTools → Performance → 录几秒 orbit，看 **GPU / Scripting** 占比。

Spector.js 可抓帧分析 draw call（进阶）。

---

## 练习

1. 路由 mock：挂载 → 销毁 → 再挂载，观察 `renderer.info.memory.geometries` 是否回落。
2. 1000 个 cube：普通 Mesh vs InstancedMesh，对比 `render.calls`。
3. cap DPR + 关 shadow，移动端 Remote Debug 测 FPS。
4. 实现 visibilitychange 暂停 loop。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[08 · 交互](./08-interaction.md)
- 下一篇：[10 · 进项目](./10-project-integration.md)
