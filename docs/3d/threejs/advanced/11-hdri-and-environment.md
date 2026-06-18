---
title: 11 · HDRI 与环境光照
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- HDRI
- PBR
---

# 11 · HDRI 与环境光照

> 用 HDR 环境贴图为 PBR 材质提供反射，解决「有灯仍发灰、金属像塑料」。

---

## 目录

- [适用场景](#适用场景)
- [environment 与 background 的区别](#environment-与-background-的区别)
- [PMREM 生成流程](#pmrem-生成流程)
- [可复用 setupHDRI](#可复用-setuphdri)
- [与 Directional 光配合](#与-directional-光配合)
- [HDR 资源选型](#hdr-资源选型)
- [常见问题](#常见问题)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 现象 | 是否需要 HDRI |
|------|----------------|
| 金属车身无高光反射 | **需要** |
| 玻璃 / 清漆不透、不亮 | **需要** + Physical 材质 |
| 仅有 Basic/Lambert 纯色 | 不需要 |
| 工厂孪生大场景、弱材质要求 | 可选，Ambient 够用 |
| 移动端 H5 包体敏感 | 用小分辨率 HDR 或只用 `environment` 低强度 |

**结论**：**产品 PBR 页几乎标配**；孪生页按美术要求选装。

---

## environment 与 background 的区别

```js
scene.environment = envMap;  // 参与 PBR 反射/折射计算，不一定可见
scene.background = envMap; // 作为天空盒背景显示
```

| 设置 | 画面背景 | PBR 反射 |
|------|----------|----------|
| 仅 environment | 仍可用 `scene.background = Color` | 有 |
| 仅 background | 显示 HDR 全景 | 无（除非同时设 environment） |
| 两者同一张贴图 | 全景背景 + 反射一致 | 有 |

产品页常见：**背景纯色或渐变**，只设 `environment`。

---

## PMREM 生成流程

HDR 不能直接给 Standard 材质用，需经 **PMREM**（预过滤 mipmap 环境贴图）：

```js
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load('/hdr/studio_small_09_1k.hdr', (hdrEquirect) => {
  const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
  scene.environment = envMap;
  hdrEquirect.dispose();
  pmremGenerator.dispose();
});
```

`PMREMGenerator` 在加载完成后应 `dispose()`，避免 GPU 泄漏。`renderer` 须已创建且 `outputColorSpace = SRGBColorSpace`。

---

## 可复用 setupHDRI

```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export function setupHDRI(renderer, scene, hdrUrl, options = {}) {
  const { asBackground = false, intensity = 1 } = options;
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  return new Promise((resolve, reject) => {
    new RGBELoader().load(
      hdrUrl,
      (hdr) => {
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        if (asBackground) scene.background = envMap;
        hdr.dispose();
        pmrem.dispose();
        scene.environmentIntensity = intensity; // r152+
        resolve(envMap);
      },
      undefined,
      reject
    );
  });
}
```

HDR 文件放 `public/hdr/`，推荐 **1k** 用于 Web（`studio`、`neutral` 类摄影棚 HDR 常用）。

---

## 与 Directional 光配合

HDRI 提供环境反射；**Directional 仍负责主阴影和高光方向**：

```js
await setupHDRI(renderer, scene, '/hdr/studio_1k.hdr', { intensity: 0.8 });

const key = new THREE.DirectionalLight(0xffffff, 0.6);
key.position.set(5, 8, 5);
scene.add(key);
scene.add(new THREE.AmbientLight(0xffffff, 0.15));
```

有 HDRI 后 Directional `intensity` 通常 **降低**，避免过曝。无 HDRI 时金属 `metalness: 1` 几乎全黑。

---

## HDR 资源选型

| 类型 | 适用 |
|------|------|
| studio / photo_studio | 产品、工业设备 |
| neutral / white room | 白底产品图 |
| outdoor / city | 建筑外景孪生 |
| night | 夜景园区 |

来源：[Poly Haven](https://polyhaven.com/hdris)（CC0）。体积：1k ≈ 1–3MB，2k 桌面可接受。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 仍发灰 | 检查 `outputColorSpace`、贴图 colorSpace |
| 反射过强 | 降 `environmentIntensity` 或换 neutral HDR |
| 加载后内存涨 | pmrem 与 hdr 源贴图 dispose |
| 移动端卡 | 用 1k；孪生可不用 HDRI |

---

## 练习

1. 对 [07 glTF 模型](../07-load-gltf.md) 加载 DamagedHelmet，对比有无 HDRI。
2. 只设 environment，背景保持纯色。
3. 调整 `metalness/roughness` 观察 HDRI 反射变化。
4. 封装 `setupHDRI` 并在 Vue 组件 mount 时调用。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[10 · 进项目](../10-project-integration.md)
- 下一篇：[12 · 后处理](./12-post-processing.md)
