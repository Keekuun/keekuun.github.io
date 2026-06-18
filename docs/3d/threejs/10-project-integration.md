---
title: 10 · 进项目
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- Engineering
---

# 10 · 进项目

> 工程结构、Vue/React 集成、与孪生/大屏后端协作，以及 **R3F/Tres 选型**。

---

## 目录

- [适用场景](#适用场景)
- [推荐项目结构](#推荐项目结构)
- [createScene 完整封装](#createscene-完整封装)
- [loadModel 与错误边界](#loadmodel-与错误边界)
- [接入 Vue 3](#接入-vue-3)
- [接入 React](#接入-react)
- [与孪生 / 大屏数据流](#与孪生--大屏数据流)
- [何时用 R3F / Tres](#何时用-r3f--tres)
- [上线检查清单](#上线检查清单)
- [系列回顾](#系列回顾)
- [导航](#导航)

---

## 适用场景

本章面向 **要把 Three.js 放进真实业务工程** 的情况：

| 项目类型 | 集成要点 |
|----------|----------|
| Vue 产品 3D 官网 | composable + dispose + loading |
| React 配置器 | useEffect cleanup + 状态同步 |
| 大屏 + 3D 孪生块 | WebSocket 驱动 mesh + ECharts 同屏 |
| 微前端子应用 | 独立 canvas，注意 context 与卸载 |
| npm 组件库 `@corp/model-viewer` | 薄 API：`src` `onPick` `env` |

POC 阶段可单文件 `main.js`；**进迭代和多人协作** 时应拆分模块。

---

## 推荐项目结构

```
src/
├── three/
│   ├── createScene.js       # renderer / scene / camera / loop
│   ├── loadModel.js         # GLTF + normalize pipeline
│   ├── lights/
│   │   ├── product.js       # 三点光 + HDRI
│   │   └── twin.js          # 大场景轻量光
│   ├── controls.js          # Orbit 预设
│   ├── pick.js              # Raycaster 封装
│   ├── dispose.js           # 统一销毁
│   └── constants.js         # DPR cap、默认 FOV
├── components/
│   └── ModelViewer.vue
public/
├── models/
├── hdr/
└── draco/
```

**边界**：

- `three/` 目录 **不 import Vue/React**
- UI 层只调 `createScene`、`loadModel`、`destroy`
- 业务 id → mesh 映射在 `userData` 或单独 `Map`

---

## createScene 完整封装

```js
// three/createScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DPR_CAP = 2;

export function createScene(container, options = {}) {
  const {
    fov = 50,
    antialias = true,
    alpha = false,
    orbit = true,
  } = options;

  const renderer = new THREE.WebGLRenderer({ antialias, alpha });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  const camera = new THREE.PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    0.1,
    200
  );
  camera.position.set(0, 1, 5);

  let controls = null;
  if (orbit) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  }

  let animationId = null;
  let disposed = false;
  const clock = new THREE.Clock();
  const hooks = { beforeRender: [] };

  function render() {
    if (disposed) return;
    hooks.beforeRender.forEach((fn) => fn(clock.getDelta()));
    controls?.update();
    renderer.render(scene, camera);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    render();
  }
  animate();

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(container);

  function dispose() {
    disposed = true;
    cancelAnimationFrame(animationId);
    ro.disconnect();
    controls?.dispose();
    scene.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose();
        [o.material].flat().forEach((m) => m?.dispose?.());
      }
    });
    scene.clear();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { scene, camera, renderer, controls, render, dispose, hooks };
}
```

---

## loadModel 与错误边界

```js
// three/loadModel.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { normalizeModel } from './normalizeModel.js';

export async function loadModel(url, manager) {
  const loader = new GLTFLoader(manager);
  const gltf = await new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
  return normalizeModel(gltf.scene);
}
```

组件层：

```js
try {
  loading.value = true;
  model = await loadModel(props.url, manager);
  ctx.scene.add(model);
  frameObject(model, ctx.camera, ctx.controls);
} catch (e) {
  error.value = '模型加载失败';
  console.error(e);
} finally {
  loading.value = false;
}
```

---

## 接入 Vue 3

```vue
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { createScene } from '@/three/createScene';
import { loadModel } from '@/three/loadModel';

const props = defineProps({ modelUrl: String });
const containerRef = ref(null);
let ctx;

onMounted(async () => {
  ctx = createScene(containerRef.value);
  if (props.modelUrl) {
    const model = await loadModel(props.modelUrl);
    ctx.scene.add(model);
  }
});

watch(() => props.modelUrl, async (url) => {
  // 换模型：先清旧模型 dispose 再 load
});

onUnmounted(() => ctx?.dispose());
</script>

<template>
  <div ref="containerRef" class="viewer" />
</template>
```

**注意**：`v-if="show3d"` 销毁组件时必须 dispose；`keep-alive` 切走时可暂停 loop 而非销毁（看产品需求）。

---

## 接入 React

```jsx
export function ModelViewer({ modelUrl }) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const ctx = createScene(ref.current);
    ctxRef.current = ctx;
    let cancelled = false;

    (async () => {
      if (modelUrl) {
        const model = await loadModel(modelUrl);
        if (!cancelled) ctx.scene.add(model);
      }
    })();

    return () => {
      cancelled = true;
      ctx.dispose();
    };
  }, [modelUrl]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
```

Strict Mode 下 effect 双调用：dispose 必须幂等，`disposed`  flag 防重复 render。

---

## 与孪生 / 大屏数据流

```
         WebSocket / 轮询
                ↓
         Store（deviceId → status）
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
 ECharts 2D            Three.js
 告警列表                 mesh.emissive
 趋势图                   HTML 标签
```

```js
// store 订阅
watch(devices, (list) => {
  list.forEach(({ id, level }) => {
    const mesh = meshMap.get(id);
    if (!mesh) return;
    mesh.material.emissive.set(level > 0 ? 0xff0000 : 0x000000);
  });
  ctx.render(); // 按需渲染模式
}, { deep: true });
```

**坐标**：后端给的设备坐标须与模型导出坐标系一致；必要时统一转换层 `applyTransform(device, mesh)`。

---

## 何时用 R3F / Tres

| 情况 | 建议 |
|------|------|
| 单页产品展示、团队熟悉 vanilla | 本章封装足够 |
| React 多 3D 组件、状态复杂 | [R3F](https://r3f.docs.pmnd.rs/) + drei |
| Vue 3 声明式 3D | [TresJS](https://docs.tresjs.org/zh/guide/) |
| 后处理、物理、XR | R3F 生态更全 |
| 性能极限、定制 loader | vanilla 更可控 |

框架 **不替代** dispose、colorSpace、pick 等基础；出问题仍回 [09](./09-performance-and-dispose.md) 排查。

Tres 示例：

```vue
<TresCanvas window-size>
  <TresPerspectiveCamera :position="[0, 1, 5]" />
  <OrbitControls />
  <Suspense>
    <GLTFModel path="/models/product.glb" />
  </Suspense>
</TresCanvas>
```

---

## 上线检查清单

- [ ] 路由 / 组件卸载完整 `dispose`
- [ ] 模型、HDR、Draco 404 与失败 UI
- [ ] `outputColorSpace` + 贴图 colorSpace
- [ ] DPR cap、移动端 shadow 策略
- [ ] 无 Helper / Stats 残留
- [ ] glTF 体积与 Draco/KTX2
- [ ] CSP 是否允许 wasm（Draco/Basis）
- [ ] 弱网：LoadingManager 进度、超时重试
- [ ] `touch-action: none` on canvas

---

## 系列回顾

| 篇 | 主题 |
|----|------|
| [01](./01-from-dashboard-to-3d.md) | 选型与心智模型 |
| [02](./02-first-scene.md) | Renderer 与 loop |
| [03](./03-scene-graph-and-coordinates.md) | 场景图与坐标 |
| [04](./04-camera.md) | 相机 |
| [05](./05-geometry-and-material.md) | 几何与 PBR |
| [06](./06-lights-and-shadows.md) | 光与阴影 |
| [07](./07-load-gltf.md) | glTF 管线 |
| [08](./08-interaction.md) | 交互 |
| [09](./09-performance-and-dispose.md) | 性能 |
| [10](./10-project-integration.md) | 工程化 |

基础系列完结。建议接着做 **[实践与作品集](./practices/README.md)**（P1 产品展示 + P2/P3 择一），再读 **[Web 3D 工程实践](./engineering/README.md)**；能力扩展见 [进阶 11–19](./advanced/README.md)。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[09 · 性能与释放](./09-performance-and-dispose.md)
- **动手实践**：[实践与作品集](./practices/README.md) · [作品集 P1 规格](./practices/02-portfolio-projects.md#p1-产品-3d-展示器)
- 工程实践：[Web 3D 工程实践](./engineering/README.md)
- 进阶系列：[Three.js 进阶](./advanced/README.md)
- WebGL 底层：[WebGL 基础概念](../webgl/01.md)
