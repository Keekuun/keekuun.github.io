---
title: 06 · 光与阴影
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

# 06 · 光与阴影

> 按场景选光源、配置 PBR 三点布光，以及 **何时开实时阴影、何时用假阴影**。

---

## 目录

- [适用场景](#适用场景)
- [光源类型与选型](#光源类型与选型)
- [三点布光模板](#三点布光模板)
- [环境光与 HDRI](#环境光与-hdri)
- [实时阴影完整链路](#实时阴影完整链路)
- [阴影质量调参](#阴影质量调参)
- [假阴影与烘焙](#假阴影与烘焙)
- [完整示例](#完整示例)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 场景 | 光照策略 | 阴影 |
|------|----------|------|
| 产品展示（车漆/金属） | HDRI + 1 盏 Directional 补主光 | 地面 contact shadow 或烘焙 |
| 工厂孪生（大场景） | Ambient + Hemisphere + 少量 Directional | 常 **关闭** 或仅主建筑 |
| 营销 H5 | 简单 Ambient + Directional | 关，省 GPU |
| 室内漫游 | 多 PointLight / SpotLight | 选择性开启，注意性能 |
| 告警态高亮 | `emissive` + 弱 Ambient | 一般不需要阴影 |

**经验**：移动端默认 **关 shadowMap**；桌面产品页可开 **2048 单方向光阴影**；园区级场景实时阴影往往扛不住。

---

## 光源类型与选型

| 光源 | 模拟 | castShadow | 性能 | 典型用途 |
|------|------|------------|------|----------|
| AmbientLight | 环境均匀亮 | 否 | 低 | 抬暗部，不能单独塑形 |
| HemisphereLight | 天空+地面色 | 否 | 低 | 室外氛围 |
| DirectionalLight | 太阳，平行光 | **是** | 中 | 主光、阴影 |
| PointLight | 灯泡 | 是（贵） | 高 | 室内点光源 |
| SpotLight | 手电筒 | 是 | 高 | 舞台、聚焦 |

```js
const ambient = new THREE.AmbientLight(0xffffff, 0.25);
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(5, 10, 5);
```

`light.intensity` 在 physicallyCorrectLights 模式下单位不同（进阶）；默认模式下 0–1 直观调即可。

---

## 三点布光模板

产品摄影简化版：

```js
function setupProductLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(5, 8, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-5, 3, 5);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(0, 5, -8);
  scene.add(rim);

  return { key, fill, rim };
}
```

配合 `scene.environment`（HDRI）时，可降低 Directional 强度，避免过曝。

---

## 环境光与 HDRI

PBR 材质 **需要环境反射** 才像金属/塑料：

```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const pmrem = new THREE.PMREMGenerator(renderer);
new RGBELoader().load('/hdr/studio_small.hdr', (hdr) => {
  const envMap = pmrem.fromEquirectangular(hdr).texture;
  scene.environment = envMap;
  hdr.dispose();
  pmrem.dispose();
});
```

- `scene.environment`：影响所有 PBR 反射，不强制显示天空
- `scene.background = envMap`：天空盒背景

**适用**：产品页、单模型展示。**大园区** HDRI 体积和反射计算需权衡，有时只用 Ambient + Directional。

---

## 实时阴影完整链路

四处 **同时** 开启：

```js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// BasicShadowMap 快但锯齿；VSMShadowMap 软但贵

dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.bias = -0.0001;
dirLight.shadow.normalBias = 0.02;

mesh.castShadow = true;
ground.receiveShadow = true;
```

**shadow.camera**（DirectionalLight 用 OrthographicCamera 算阴影）：

```js
const cam = dirLight.shadow.camera;
cam.near = 0.5;
cam.far = 50;
cam.left = cam.bottom = -10;
cam.right = cam.top = 10;
// 范围越小，阴影分辨率越高——用 Helper 调
scene.add(new THREE.CameraHelper(cam));
```

---

## 阴影质量调参

| 参数 | 作用 |
|------|------|
| `mapSize` | 512/1024/2048，越大越清晰越贵 |
| `bias` | 减少 shadow acne（条纹） |
| `normalBias` | 减少 Peter Panning（阴影脱离物体） |
| shadow.camera 范围 | 范围过大 → 阴影糊 |

**shadow acne**：阴影贴图 self-shadow 冲突，微调 `bias`（负值）和 `normalBias`。

---

## 假阴影与烘焙

**Contact Shadow 平面**（产品页常用，零 real-time shadow）：

```js
const shadowMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.35,
});
const shadowPlane = new THREE.Mesh(
  new THREE.CircleGeometry(1.5, 32),
  shadowMat
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = 0.01;
```

或用 **渐变贴图** 圆形阴影 PNG，billboard 放模型脚下。

**烘焙**：Blender 烘 shadow 进 lightmap / 贴图，Web 端零实时阴影成本——大孪生静态场景常用。

---

## 完整示例

```js
renderer.shadowMap.enabled = true;

const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 8, 3);
dir.castShadow = true;
dir.shadow.mapSize.set(1024, 1024);
scene.add(new THREE.AmbientLight(0xffffff, 0.2), dir);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ roughness: 0.4 })
);
box.castShadow = true;
box.position.y = 0.5;
scene.add(box);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
```

---

## 练习

1. 仅 HDRI environment，无 Directional，观察 PBR 效果。
2. 开 shadow 后调 `bias`，观察 shadow acne 变化。
3. 对比 PCFSoftShadowMap 与 BasicShadowMap 帧率。
4. 用 Circle 假阴影替代 real-time shadow，对比移动端 FPS。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[05 · 几何与材质](./05-geometry-and-material.md)
- 下一篇：[07 · 加载 glTF](./07-load-gltf.md)
