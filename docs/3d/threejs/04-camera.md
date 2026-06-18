---
title: 04 · 相机
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

# 04 · 相机

> 透视 / 正交选型、裁剪面与深度精度，以及产品页 / 孪生页常用相机方案。

---

## 目录

- [适用场景](#适用场景)
- [PerspectiveCamera 深入](#perspectivecamera-深入)
- [OrthographicCamera 何时用](#orthographiccamera-何时用)
- [位置、朝向与相机 Rig](#位置朝向与相机-rig)
- [resize 与多 viewport](#resize-与多viewport)
- [深度缓冲与 z-fighting](#深度缓冲与-z-fighting)
- [排查清单](#排查清单)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 场景 | 相机选择 | 典型参数 |
|------|----------|----------|
| 汽车 / 产品 orbit 展示 | Perspective | FOV 35–50，相机距离按包围盒算 |
| 建筑室内漫游 | Perspective | FOV 60–75，near 0.1，far 按场景 |
| 园区 / 工厂俯视 | Perspective 高机位 | 高 far，注意深度精度 |
| 2.5D 大屏「模型陈列」 | Orthographic | 无近大远小，像沙盘 |
| 户型图 / 尺寸标注 | Orthographic | 平行投影，尺寸不随距离变 |
| 小地图（角落 viewport） | 第二台相机 + setViewport | 同 scene 双视角 |

**产品页经验**：FOV 过大（>60）会让车身边缘畸变像广角镜头；**35–45 + 适当距离** 更接近摄影棚效果。

---

## PerspectiveCamera 深入

```js
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

**FOV** 是 **垂直** 视野角（度）。与焦距换算（35mm 全画幅近似）：

```js
const focalLength = 50; // mm
const fov = 2 * MathUtils.radToDeg(Math.atan(24 / (2 * focalLength)));
// 50mm ≈ 27° 垂直 FOV
```

**根据模型自动摆相机**（产品页常用）：

```js
import { Box3, Vector3, PerspectiveCamera } from 'three';

function frameObject(object, camera, offset = 1.5) {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fovRad = (camera.fov * Math.PI) / 180;
  const distance = (maxDim / 2 / Math.tan(fovRad / 2)) * offset;

  camera.position.copy(center);
  camera.position.z += distance;
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.lookAt(center);
}
```

**near / far**：

- `near` 太大 → 近处物体被裁
- `far` 太大 → 深度缓冲精度下降，远处 z-fighting
- 经验：`far / near` 尽量 < 1e4；大场景用 **对数深度缓冲** 或 **分区加载**

```js
camera = new PerspectiveCamera(50, aspect, 0.1, 200);
// 或对数深度（Three.js 材质 side 需注意）
gl.logarithmicDepthBuffer = true; // WebGLRenderer 构造参数
```

---

## OrthographicCamera 何时用

```js
const frustumSize = 10;
const aspect = width / height;
const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  near,
  far
);
```

无透视缩短，适合 **技术示意、UI 风 3D、CAD 2D 视图**。resize 时须同步改 left/right/top/bottom，不能只改 aspect。

---

## 位置、朝向与相机 Rig

```js
camera.position.set(3, 2, 5);
camera.lookAt(target); // target 为 Vector3

camera.up.set(0, 1, 0); // 默认 Y 轴为上；太空场景可能改 Z-up
```

**相机 Rig**（运镜常用）：空 Group 作父节点，相机作子节点，转 Group 实现轨道：

```js
const rig = new THREE.Group();
rig.add(camera);
camera.position.set(0, 0, 5);
scene.add(rig);
rig.rotation.y += 0.01; // 绕场景中心转
camera.lookAt(0, 0, 0);
```

与 [OrbitControls](./08-interaction.md) 区别：Controls 改 camera 与 target；Rig 适合 **路径动画、自动展示**。

---

## resize 与多 viewport

标准 resize（透视）：

```js
camera.aspect = w / h;
camera.updateProjectionMatrix();
renderer.setSize(w, h);
```

**同 canvas 双视图**（主视图 + 小地图）：

```js
renderer.setScissorTest(true);

// 主视图
renderer.setViewport(0, 0, w, h);
renderer.setScissor(0, 0, w, h);
renderer.render(scene, mainCamera);

// 右上角小地图
const mapSize = 200;
renderer.setViewport(w - mapSize, h - mapSize, mapSize, mapSize);
renderer.setScissor(w - mapSize, h - mapSize, mapSize, mapSize);
renderer.render(scene, topCamera);
```

---

## 深度缓冲与 z-fighting

两平面距离小于深度精度可分辨时，面片交替闪烁。

**处理**：

1. 缩小 `far - near` 范围
2. 略微偏移共面物体（`polygonOffset`）
3. 对数深度缓冲
4. 建筑室内：不用一个相机看全楼，分区加载

```js
material.polygonOffset = true;
material.polygonOffsetFactor = 1;
material.polygonOffsetUnits = 1;
```

---

## 排查清单

| 现象 | 可能原因 |
|------|----------|
| 全黑 | 相机在 mesh 内；未 lookAt；culling |
| 物体一半消失 | near 过大；clip plane |
| 远处闪烁 | z-fighting；far 过大 |
| 画面拉伸 | aspect 未更新 |
| 移动端模糊 | DPR 过高或未 setPixelRatio |

调试：`CameraHelper`、`GridHelper`；`Box3Helper` 看模型包围盒与相机距离关系。

---

## 练习

1. 对 glTF 模型调用 `frameObject`，对比 FOV 35 与 75。
2. 实现 Orthographic 俯视「沙盘」视角，与 Perspective 切换。
3. 故意设 `near=5` 观察近裁效果。
4. 大 `far`（1e6）下观察地面 z-fighting，再收紧 far 对比。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[03 · 场景图与坐标](./03-scene-graph-and-coordinates.md)
- 下一篇：[05 · 几何与材质](./05-geometry-and-material.md)
