---
title: 05 · 几何与材质
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- 3D
---

# 05 · 几何与材质

> BufferGeometry 结构、PBR 材质参数、色彩空间，以及 **按项目类型选材质** 的方法。

---

## 目录

- [适用场景](#适用场景)
- [BufferGeometry 结构](#buffergeometry-结构)
- [内置 Geometry 与面数](#内置-geometry-与面数)
- [Material 选型决策树](#material-选型决策树)
- [MeshStandardMaterial 深入](#meshstandardmaterial-深入)
- [贴图与 colorSpace](#贴图与-colorspace)
- [法线与背面](#法线与背面)
- [draw call 与材质合并](#draw-call-与材质合并)
- [示例](#示例)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 场景 | Geometry | Material |
|------|----------|----------|
| 产品 PBR 展示 | glTF 自带 BufferGeometry | Standard / Physical |
| 占位 / 碰撞体 | Box/Sphere 低面数 | Basic 或 invisible |
| 地面 / 背景板 | PlaneGeometry | Standard + roughnessMap |
| 告警热力（染设备） | 原模型 geometry | clone Standard，改 `color` / `emissive` |
| 大屏装饰光带 | Tube / Line | Basic 或 LineBasicMaterial |
| 性能极限移动端 | 简化 mesh / LOD | Basic 或 Lambert，少贴图 |

**原则**：正式交付用 **PBR（Standard）**；调试阶段用 **Basic 排除光照问题**；上线前再切回 Standard 并配光。

---

## BufferGeometry 结构

所有几何体本质是 `BufferGeometry` + `BufferAttribute`：

```js
const geo = new THREE.BoxGeometry(1, 1, 1);
console.log(geo.attributes.position); // 顶点 xyz
console.log(geo.attributes.normal);   // 法线，光照必需
console.log(geo.attributes.uv);       // 贴图坐标
console.log(geo.index);               // 索引，复用顶点
```

| Attribute | 作用 | 缺失后果 |
|-----------|------|----------|
| `position` | 顶点位置 | 无法渲染 |
| `normal` | 光照方向 | 黑/平/只一面亮 |
| `uv` | 贴图映射 | 贴图错位或全黑 |
| `tangent` | 法线贴图 | normalMap 效果不对 |

**合并几何**（减 draw call）：

```js
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
const merged = mergeGeometries([geo1, geo2], true);
```

静态场景、多 mesh 同材质时可合并；**需单独换色/拾取的部件不要合并**。

---

## 内置 Geometry 与面数

```js
new THREE.SphereGeometry(radius, widthSegments, heightSegments);
// segments 32→64，面数约 4 倍
```

| 几何体 | 面数控制 | 用途 |
|--------|----------|------|
| Box | 固定 12 三角 | 占位 |
| Plane | 1×1 为 2 三角 | 地面 |
| Sphere | segments | 粒子、简易球 |
| Cylinder | radialSegments | 管道 |

工业模型面数在 **建模阶段** 控制（移动端单模型 5万–20万三角常见上限，视项目而定）。

---

## Material 选型决策树

```
需要实时光照？
├─ 否 → MeshBasicMaterial（UI、线框、调试）
└─ 是 → 需要 PBR 物理参数？
    ├─ 是 → MeshStandardMaterial（默认）
    │       └─ 需要透明/清漆/ior → MeshPhysicalMaterial
    └─ 否 → MeshLambertMaterial（老项目、极简性能）
```

| 材质 | 光照 | 贴图 | 性能 |
|------|------|------|------|
| Basic | 无 | map | 最快 |
| Lambert | 漫反射 | map | 快 |
| Standard | PBR | map/normal/rough/metal | 中 |
| Physical | PBR+ | 同上+透明 | 较慢 |

---

## MeshStandardMaterial 深入

PBR 核心参数（金属工作流）：

```js
new THREE.MeshStandardMaterial({
  color: 0xffffff,      // 基础色，乘 map
  metalness: 0.0,       // 0=电介质 1=金属
  roughness: 0.5,       // 0=镜面 1=完全粗糙
  map: diffuseMap,
  normalMap: normalMap,
  roughnessMap: roughMap,
  metalnessMap: metalMap,
  aoMap: aoMap,         // 环境光遮蔽，须第二套 uv 或复用 uv
  emissive: 0x000000,   // 自发光，告警高亮常用
  emissiveIntensity: 1,
});
```

**金属度经验**：

- 塑料、漆面面：`metalness: 0`，`roughness: 0.3–0.7`
- 金属件：`metalness: 1`，`roughness: 0.2–0.5`
- 玻璃：用 `MeshPhysicalMaterial`，`transmission: 1`

**环境反射**：仅有灯光时金属偏暗；产品页常加 **HDRI**：

```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
new RGBELoader().load('/hdr/studio.hdr', (tex) => {
  tex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = tex; // 不显示背景，只提供反射
});
```

---

## 贴图与 colorSpace

r152+ 色彩管理（不做会 **整体发灰**）：

```js
renderer.outputColorSpace = THREE.SRGBColorSpace;

const tex = textureLoader.load('diffuse.jpg');
tex.colorSpace = THREE.SRGBColorSpace; // 颜色贴图

const normalTex = textureLoader.load('normal.jpg');
normalTex.colorSpace = THREE.NoColorSpace; // 非颜色数据贴图
```

| 贴图类型 | colorSpace |
|----------|------------|
| map, emissiveMap | SRGBColorSpace |
| normalMap, roughnessMap, metalnessMap, aoMap | NoColorSpace |

贴图尺寸：**2 的幂**（512/1024/2048）对 mipmap 最友好；非幂次 Three.js 会处理但 mipmap 受限。

---

## 法线与背面

默认 **背面剔除**（`material.side = FrontSide`）。法线朝内的面从外看是黑的。

```js
material.side = THREE.DoubleSide; // 薄片、反面可见时
```

法线错误（模型全黑一侧）：

- 美术导出时 **Recalculate Normals**
- 或 `geometry.computeVertexNormals()`

---

## draw call 与材质合并

每个 **不同 material** 通常增加一次 draw call。优化：

1. 图集（atlas）合并贴图，共用 material
2. `mergeGeometries` 合并静态 mesh
3. `InstancedMesh` 大量相同 geometry+material

**不能合并**：需独立换色、独立 pick、独立动画的部件。

修改共享 material 会影响所有引用 mesh：

```js
child.material = child.material.clone();
child.material.color.set(0xff0000);
```

---

## 示例

```js
import * as THREE from 'three';

// ... scene, camera, renderer, outputColorSpace ...

const geo = new THREE.SphereGeometry(0.5, 32, 32);

const plastic = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  metalness: 0,
  roughness: 0.4,
});
const metal = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 1,
  roughness: 0.25,
});

const meshPlastic = new THREE.Mesh(geo, plastic);
meshPlastic.position.x = -1;
const meshMetal = new THREE.Mesh(geo, metal);
meshMetal.position.x = 1;
scene.add(meshPlastic, meshMetal);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(3, 5, 2);
scene.add(ambient, dir);
// 无 environment 时金属较暗——可加 HDRI 或提高 dir 强度
```

---

## 练习

1. 同一 sphere，对比 Basic / Lambert / Standard 在无光、有光下的差异。
2. 加载 diffuse + normal + roughness 三张贴图，观察 PBR 变化。
3. 故意不设 `outputColorSpace`，对比发灰程度。
4. `mergeGeometries` 合并 10 个 cube，用 Performance 看 draw call 变化（`renderer.info.render.calls`）。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[04 · 相机](./04-camera.md)
- 下一篇：[06 · 光与阴影](./06-lights-and-shadows.md)
