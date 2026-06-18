---
title: 07 · 加载 glTF
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- glTF
---

# 07 · 加载 glTF

> glTF 结构、加载器封装、Draco/KTX2 压缩，以及 **美术—前端协作** 里的常见坑。

---

## 目录

- [适用场景](#适用场景)
- [glTF 文件结构](#gltf-文件结构)
- [部署与路径](#部署与路径)
- [LoadingManager 与缓存](#loadingmanager-与缓存)
- [Promise 封装](#promise-封装)
- [加载后处理流水线](#加载后处理流水线)
- [Draco 与 KTX2 压缩](#draco-与-ktx2-压缩)
- [动画 AnimationMixer](#动画-animationmixer)
- [常见错误与协作清单](#常见错误与协作清单)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 场景 | 格式 | 说明 |
|------|------|------|
| 产品 3D 页 | 单 `.glb` | 贴图内嵌，部署简单 |
| 多 SKU 换色 | 同 mesh 多 material 或换 glb | 按 `name` traverse 换 material |
| 孪生园区 | 分区多个 glb + 坐标对齐 | 见 [03 场景图](./03-scene-graph-and-coordinates.md) |
| 带开关门/运转动画 | glb + animations | AnimationMixer |
| 超大 CAD | Draco 压缩 glb | 减体积，CPU 解码 |

**不用 glTF 的情况**：程序化几何（纯代码生成）、点云专用格式（可能用 PLY/自定义 loader）。

---

## glTF 文件结构

`.gltf` + 外部 bin/贴图，或 **`.glb` 单二进制**（生产首选）。

加载结果：

```js
{
  scene: Group,           // 根节点
  scenes: [],
  animations: [],         // AnimationClip[]
  cameras: [],
  asset: { version: '2.0' },
  parser: GLTFParser,
}
```

场景内典型层级：

```
Scene
 └── Nodes (Group/Mesh)
      └── Mesh
           ├── geometry (BufferGeometry)
           └── material (Standard/Physical...)
```

**KHR 扩展**（常见）：

| 扩展 | 作用 |
|------|------|
| KHR_draco_mesh_compression | Draco 压缩 mesh |
| KHR_texture_basisu | KTX2/Basis 贴图 |
| KHR_materials_clearcoat | 清漆层 |
| KHR_lights_punctual | 导出灯光 |

Loader 需注册对应 decoder（DracoLoader、KTX2Loader）。

---

## 部署与路径

| 方式 | 路径写法 | 适用 |
|------|----------|------|
| `public/models/a.glb` | `/models/a.glb` | 大文件、CDN |
| `import url from './a.glb?url'` | Vite 返回 hash URL | 小模型、版本缓存 |
| CDN 跨域 | 需 CORS 头 | 多站点共用 |

贴图 **相对路径** 错误是粉屏主因：`.gltf` 外链贴图时，路径相对 `.gltf` 文件位置。

---

## LoadingManager 与缓存

多资源统一进度：

```js
const manager = new THREE.LoadingManager();
manager.onStart = (url, loaded, total) => {};
manager.onLoad = () => { hideLoading(); };
manager.onProgress = (url, loaded, total) => {
  updateBar(loaded / total);
};
manager.onError = (url) => { showError(url); };

const loader = new GLTFLoader(manager);
```

**Cache** 避免重复加载：

```js
THREE.Cache.enabled = true;
// 同 URL 第二次 load 走缓存
```

---

## Promise 封装

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadGLTF(url, manager) {
  const loader = new GLTFLoader(manager);
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

// 使用
const gltf = await loadGLTF('/models/product.glb');
scene.add(gltf.scene);
```

配合 `async` 时注意 **组件卸载** 时 cancel 或 ignore 结果，避免内存泄漏。

---

## 加载后处理流水线

工业项目建议固定 pipeline：

```js
function normalizeModel(root, options = {}) {
  const { targetSize = 2, center = true, castShadow = true } = options;

  root.traverse((child) => {
    if (child.isMesh) {
      child.frustumCulled = true;
      if (castShadow) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      // 修复旧 glTF 双面
      if (child.material?.map) {
        child.material.map.colorSpace = THREE.SRGBColorSpace;
      }
    }
  });

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;
  root.scale.setScalar(scale);

  if (center) {
    const c = box.getCenter(new THREE.Vector3());
    root.position.sub(c.multiplyScalar(scale));
  }

  return root;
}
```

**按 name 换色**（配置器）：

```js
function setPartColor(root, partName, hex) {
  const mesh = root.getObjectByName(partName);
  if (!mesh?.isMesh) return;
  mesh.material = mesh.material.clone();
  mesh.material.color.set(hex);
}
```

---

## Draco 与 KTX2 压缩

**Draco**（减 geometry 体积）：

```js
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const draco = new DRACOLoader();
draco.setDecoderPath('/draco/gltf/'); // 从 three/examples/jsm/libs/draco 复制

const loader = new GLTFLoader();
loader.setDRACOLoader(draco);
```

**KTX2**（GPU 友好贴图）：

```js
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const ktx2 = new KTX2Loader()
  .setTranscoderPath('/basis/')
  .detectSupport(renderer);
loader.setKTX2Loader(ktx2);
```

Blender 导出时勾选对应压缩；前端必须配 decoder 路径。

---

## 动画 AnimationMixer

```js
const mixer = new THREE.AnimationMixer(model);
const clip = gltf.animations.find((c) => c.name === 'DoorOpen');
const action = mixer.clipAction(clip);
action.play();

function animate() {
  const delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}
```

孪生场景：**数据驱动** 与 **骨骼动画** 分离——状态用 material/emissive，机械运动用 clip。

---

## 常见错误与协作清单

| 现象 | 原因 | 处理 |
|------|------|------|
| 404 | public 路径错 | Network 面板查 URL |
| 粉紫 | shader/贴图失败 | Console；检查 map 路径 |
| 全黑 | 无法线/无灯 | computeVertexNormals；加光 |
| 巨大/极小 | 单位 mm vs m | normalizeModel |
| 部件找不到 | name 丢失 | Blender 导出前命名 |
| 换色全变 | 共享 material | clone material |

**给美术的导出 checklist**：

- [ ] 格式 glb，Y-up，应用 scale
- [ ] 三角面数在预算内
- [ ] 可交互部件命名规范
- [ ] 贴图 2 的幂，PBR 金属/粗糙度工作流
- [ ] 法线正确，无反面

---

## 练习

1. 封装 `loadGLTF` + `normalizeModel`，加载 DamagedHelmet。
2. LoadingManager 接 UI 进度条。
3. 配置 Draco，对比压缩前后文件体积与首屏时间。
4. 播放 glTF 内建 animation（如 Fox 模型的动画样例）。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[06 · 光与阴影](./06-lights-and-shadows.md)
- 下一篇：[08 · 交互](./08-interaction.md)
