---
title: 14 · 大场景与分区加载
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Performance
---

# 14 · 大场景与分区加载

> 工厂/园区多 glb 按需加载、LOD 与 unload，控制内存和 draw call。

---

## 目录

- [适用场景](#适用场景)
- [问题诊断](#问题诊断)
- [分区 load / unload](#分区-load--unload)
- [LOD 层级](#lod-层级)
- [视距与显隐](#视距与显隐)
- [Loading 策略](#loading-策略)
- [Octree 简介](#octree-简介)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 现象 | 对策 |
|------|------|
| 单 glb > 100MB，首屏 > 30s | 按楼层/区域拆 glb + 懒加载 |
| 漫游卡顿，triangles 百万级 | LOD + 远处 hide |
| 切区后内存涨 | unload 时 dispose |
| 同屏设备上千 | InstancedMesh（见 [09](../09-performance-and-dispose.md)） |

**不适用**：单产品模型展示（一个 glb 即可）。

---

## 问题诊断

```js
console.log(renderer.info.render.triangles);
console.log(renderer.info.render.calls);
console.log(renderer.info.memory.geometries);
```

Chrome Performance 录制 walk 一圈，看 **GPU bound** 还是 **JS bound**。大场景通常是 GPU + 内存。

---

## 分区 load / unload

```js
const zones = new Map(); // zoneId -> { group, gltf }

async function loadZone(zoneId, url) {
  if (zones.has(zoneId)) return zones.get(zoneId).group;
  const gltf = await loadGLTF(url);
  const group = gltf.scene;
  group.name = zoneId;
  scene.add(group);
  zones.set(zoneId, { group, gltf });
  return group;
}

function unloadZone(zoneId) {
  const entry = zones.get(zoneId);
  if (!entry) return;
  entry.group.traverse((o) => {
    if (o.isMesh) {
      o.geometry?.dispose();
      [o.material].flat().forEach((m) => m?.dispose?.());
    }
  });
  scene.remove(entry.group);
  zones.delete(zoneId);
}
```

UI 楼层切换 / 地图热点进入区域时 `loadZone`；离开时 `unloadZone`。

---

## LOD 层级

```js
import { LOD } from 'three';

const lod = new LOD();
lod.addLevel(highMesh, 0);    // 0–20m 高精度
lod.addLevel(midMesh, 20);
lod.addLevel(lowMesh, 50);     // 50m+ 低模或 Billboard
scene.add(lod);

function animate() {
  lod.update(camera); // 每帧按距离切换
  renderer.render(scene, camera);
}
```

美术需提供 **同 pivot 的多精度模型**，或自动生成减面（Blender Decimate）。

---

## 视距与显隐

```js
function updateVisibility(camera, objects, maxDist = 100) {
  const camPos = camera.position;
  objects.forEach((obj) => {
    const d = obj.getWorldPosition(_v).distanceTo(camPos);
    obj.visible = d < maxDist;
  });
}
```

比 LOD 粗糙，但实现快。可与分区加载组合：进区 load + 离相机远 hide。

---

## Loading 策略

1. **首屏**：只 load 当前楼层 + 简模外景
2. **预加载**：相邻区域 idle 时 `requestIdleCallback` 预 load
3. **优先级**：用户视角方向上的 zone 优先
4. **取消**：快速切换 zone 时 AbortController 取消 fetch（需封装 loader）

```js
const cache = new Map();
async function loadGLTFCached(url) {
  if (cache.has(url)) return cache.get(url);
  const p = loadGLTF(url);
  cache.set(url, p);
  return p;
}
```

---

## Octree 简介

超大规模静态碰撞/拾取可用 [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) 或 Octree 加速 Raycaster。渲染侧仍以 **分区 + LOD** 为主；Octree 解决 pick 慢，不直接减面。

---

## 练习

1. 准备 2 个 zone glb，切换按钮 load/unload，观察 memory。
2. 对单模型做 3 级 LOD，走远观察切换。
3. 相机距离 > 50 隐藏某 Group。
4. 记录 loadZone 耗时，做 Loading UI。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[13 · 动画与运镜](./13-animation-and-camera.md)
- 下一篇：[15 · HTML 标注](./15-html-labels.md)
