---
title: 17 · 坐标系与 GIS 融合
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- GIS
- Cesium
---

# 17 · 坐标系与 GIS 融合

> 本地坐标、CAD 导出与地图对齐；Three.js 与 Cesium / Mapbox 协作边界。

---

## 目录

- [适用场景](#适用场景)
- [三类坐标系](#三类坐标系)
- [CAD/BIM 进 Three.js](#cadbim-进-threejs)
- [经纬度转场景坐标](#经纬度转场景坐标)
- [Three 叠在地图上](#three-叠在地图上)
- [Cesium 与 Three 分工](#cesium-与-three-分工)
- [浮点精度问题](#浮点精度问题)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 项目 | 是否需要本章 |
|------|----------------|
| 产品 glb 自转展示 | 否 |
| 园区在 **高德/Mapbox 上** 落建筑 | **是** |
| CAD 图纸毫米坐标导入 | **是**（缩放 + 原点） |
| 全球级地球可视化 | 用 **Cesium**，Three 做局部 overlay |
| 纯 Three 孪生（无地图） | 统一「米」制本地坐标即可 |

---

## 三类坐标系

| 类型 | 单位/范围 | 例子 |
|------|-----------|------|
| **本地场景** | 任意，Y-up | Three.js 默认 |
| **工程/CAD** | mm、m，Z-up 常见 | 需旋转 + scale |
| **地理 WGS84** | 经度纬度高度 | 地图 API |

Three.js **不内置** 经纬度；要么转本地 ENU，要么交给 Cesium。

---

## CAD/BIM 进 Three.js

流程：

1. Blender / 专业工具转 glTF，**Apply Scale**，Y-up
2. 加载后 `Box3` 居中（见 [07](../07-load-gltf.md)）
3. 若必须保留真实 mm：统一 `model.scale.setScalar(0.001)` 变米

```js
// Z-up CAD 临时修正（视导出而定）
model.rotation.x = -Math.PI / 2;
```

与美术确认 **一个原点**：园区入口 (0,0,0) 或 GIS 锚点。

---

## 经纬度转场景坐标

小范围园区可用 **平面近似**（中心点 lat0/lng0）：

```js
const R = 6378137; // 地球半径 m

function lngLatToLocal(lng, lat, refLng, refLat) {
  const x = ((lng - refLng) * Math.PI / 180) * R * Math.cos(refLat * Math.PI / 180);
  const z = -((lat - refLat) * Math.PI / 180) * R; // Three Z
  return new THREE.Vector3(x, 0, z);
}
```

范围 > 几公里或要地球曲率：用 **Cesium** 或 proj4 + 合适投影。

---

## Three 叠在地图上

**架构 A：Mapbox Custom Layer**

- Mapbox 管底图与相机矩阵
- Three 在 `render` 回调里用 **相同 view-projection**

**架构 B：Cesium + Three.js**

- Cesium 地球主视图
- Three canvas 透明叠层做局部精细模型

**架构 C：纯 Three + 静态底图**

- 图片/瓦片贴 Plane，3D 建筑按本地坐标摆——适合展厅沙盘

```text
┌─────────────────────────────┐
│  Map / Cesium（地理相机）     │
│  ┌─────────────────────┐    │
│  │ Three canvas（局部）  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
         ↑ 共享锚点 refLng/Lat
```

---

## Cesium 与 Three 分工

| 能力 | Cesium | Three.js |
|------|--------|----------|
| 地球、3D Tiles | ✅ | ❌ |
| glTF 产品级 PBR | 可以 | ✅ 生态更好 |
| HTML 标注 | 有 Entity | CSS2D 更灵活 |
| Shader 定制 | 有限 | ✅ |

**建议**：地理大范围 Cesium 主导；产品级设备、室内用 Three overlay 或独立页。

---

## 浮点精度问题

场景坐标绝对值过大（如直接用 UTM 500000, 4000000）会出现 **抖动**。

**解决**：**Relative to Eye（RTE）** 或 **把场景原点移到玩家附近**：

```js
// 渲染前整体 offset（相机附近为 0）
const origin = new THREE.Vector3(anchorX, 0, anchorZ);
scene.position.sub(origin);
camera.position.sub(origin);
```

Cesium 内置处理；纯 Three 大坐标必须手动中心化。

---

## 练习

1. 定义 refLng/Lat，把 3 个经纬度点转成 Three 坐标并 `AxesHelper` 验证相对位置。
2. CAD 模型 rotation 修正后与地面 Grid 对齐。
3. 调研 Mapbox Custom Layer 文档，列出与 Three 集成的 3 个关键 API。
4. 大坐标 mock：scene 整体减 origin，观察抖动是否消失。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[16 · 自定义 Shader](./16-custom-shader.md)
- 下一篇：[18 · R3F / Tres](./18-r3f-tres.md)
